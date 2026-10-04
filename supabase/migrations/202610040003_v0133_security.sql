-- V0.13.3: make public Duel reads robust when a save has no Warrior or bad legacy data.
-- V0.13.1 and V0.13.2 are already applied and must not be edited/replayed.
create or replace function app_private.duel_public_level(p_save jsonb)
returns integer language sql immutable set search_path = '' as $$
  select case when (p_save -> 'ownedWarriors' -> (p_save ->> 'activeWarriorId') ->> 'level') ~ '^(10|[1-9])$'
    then (p_save -> 'ownedWarriors' -> (p_save ->> 'activeWarriorId') ->> 'level')::integer
    else null end;
$$;
revoke all on function app_private.duel_public_level(jsonb) from public, anon, authenticated;
grant execute on function app_private.duel_public_level(jsonb) to service_role;

create or replace function public.duel_board(p_viewer uuid)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare result jsonb;
begin
  if (select auth.role()) is distinct from 'service_role' then raise insufficient_privilege; end if;
  with ranked as (
    select d.user_id, d.points, row_number() over (order by d.points desc, d.created_at, d.user_id) as rank
    from public.duel_players d
  ), presented as (
    select r.rank, r.points, p.username,
      nullif(s.save_data ->> 'activeWarriorId', '') as warrior_id,
      app_private.duel_public_level(s.save_data) as level
    from ranked r join public.profiles p on p.user_id = r.user_id
    left join public.game_saves s on s.user_id = r.user_id
    where r.rank <= 100
  ) select jsonb_build_object(
    'top', coalesce((select jsonb_agg(to_jsonb(presented) order by rank) from presented), '[]'::jsonb),
    'own_rank', (select rank from ranked where user_id = p_viewer),
    'own_points', (select points from ranked where user_id = p_viewer)
  ) into result;
  return result;
end;
$$;
revoke all on function public.duel_board(uuid) from public, anon, authenticated;
grant execute on function public.duel_board(uuid) to service_role;

create or replace function public.duel_profile(p_username text)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare result jsonb;
begin
  if (select auth.role()) is distinct from 'service_role' then raise insufficient_privilege; end if;
  with ranked as (
    select d.user_id, d.points, row_number() over (order by d.points desc, d.created_at, d.user_id) as rank
    from public.duel_players d
  ), selected as (
    select r.*, p.username, s.save_data from ranked r
      join public.profiles p on p.user_id = r.user_id
      left join public.game_saves s on s.user_id = r.user_id
    where lower(p.username) = lower(p_username)
  ) select jsonb_build_object('username', x.username, 'rank', x.rank, 'points', x.points,
    'warrior_id', nullif(x.save_data ->> 'activeWarriorId', ''),
    'level', app_private.duel_public_level(x.save_data),
    'history', coalesce((select jsonb_agg(to_jsonb(h) - 'id' order by h.created_at desc, h.id desc) from (
      select m.id, m.created_at, p.username as opponent, m.attacker_warrior_id as warrior_id, m.attacker_won as won
      from public.duel_matches m join public.profiles p on p.user_id = m.defender_id
      where m.attacker_id = x.user_id order by m.created_at desc, m.id desc limit 5
    ) h), '[]'::jsonb)) into result from selected x;
  return result;
end;
$$;
revoke all on function public.duel_profile(text) from public, anon, authenticated;
grant execute on function public.duel_profile(text) to service_role;
