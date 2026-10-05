-- V0.15: 10 Duels / Paris calendar day. LOCAL ONLY; apply after 202610040004.
begin;
alter table public.duel_players add column daily_date date not null
  default timezone('Europe/Paris', clock_timestamp())::date;
-- Preserve today's actually spent fights (even if the old recharge granted more than 10).
update public.duel_players d set recharge_at = null, charges = greatest(0, 10 - (
  select count(*)::integer from public.duel_matches m
  where m.attacker_id = d.user_id
    and m.created_at >= (d.daily_date::timestamp at time zone 'Europe/Paris')
    and m.created_at < ((d.daily_date + 1)::timestamp at time zone 'Europe/Paris')
));
alter table public.duel_players add constraint duel_daily_no_passive_timer check (recharge_at is null);
create or replace function public.duel_assign(p_attacker uuid, p_exclude uuid[] default '{}'::uuid[])
returns jsonb language plpgsql security definer set search_path = '' as $$
declare own public.duel_players%rowtype; chosen uuid; ts timestamptz := clock_timestamp();
begin
  if (select auth.role()) is distinct from 'service_role' then raise insufficient_privilege; end if;
  select * into own from public.duel_players where user_id = p_attacker for update;
  if not found then raise invalid_parameter_value using message = 'Duel account missing'; end if;
  ts := clock_timestamp();
  if own.daily_date < timezone('Europe/Paris', ts)::date then
    own.charges := 10;
    own.daily_date := timezone('Europe/Paris', ts)::date;
  end if;
  own.recharge_at := null;
  chosen := case when own.pending_opponent = any(p_exclude) then null else own.pending_opponent end;
  if chosen is not null and not exists (
    select 1 from public.game_saves s where s.user_id = chosen
      and s.save_data ->> 'activeWarriorId' <> ''
      and s.save_data -> 'ownedWarriors' ? (s.save_data ->> 'activeWarriorId')
      and s.save_data -> 'ownedWarriors' -> (s.save_data ->> 'activeWarriorId') ->> 'warriorId' = s.save_data ->> 'activeWarriorId'
      and (s.save_data -> 'ownedWarriors' -> (s.save_data ->> 'activeWarriorId') ->> 'level') ~ '^(10|[1-9])$'
  ) then chosen := null; end if;
  if chosen is null then
    select d.user_id into chosen from public.duel_players d
    join public.game_saves s on s.user_id = d.user_id
    where d.user_id <> p_attacker and d.user_id <> all(p_exclude) and s.save_data ->> 'activeWarriorId' <> ''
      and s.save_data -> 'ownedWarriors' ? (s.save_data ->> 'activeWarriorId')
      and s.save_data -> 'ownedWarriors' -> (s.save_data ->> 'activeWarriorId') ->> 'warriorId' = s.save_data ->> 'activeWarriorId'
      and (s.save_data -> 'ownedWarriors' -> (s.save_data ->> 'activeWarriorId') ->> 'level') ~ '^(10|[1-9])$'
    order by case when abs(d.points - own.points) <= 200 then 0
                  when abs(d.points - own.points) <= 600 then 1 else 2 end,
             random() limit 1;
  end if;
  update public.duel_players set charges = own.charges, recharge_at = null, daily_date = own.daily_date,
    pending_opponent = chosen, updated_at = ts where user_id = p_attacker;
  return jsonb_build_object('opponent_id', chosen, 'charges', own.charges,
    'recharge_at', null, 'reset_at', ((own.daily_date + 1)::timestamp at time zone 'Europe/Paris'),
    'limit_rule', 'daily-v015', 'server_now', ts, 'points', own.points);
end;
$$;
revoke all on function public.duel_assign(uuid,uuid[]) from public, anon, authenticated;
grant execute on function public.duel_assign(uuid,uuid[]) to service_role;


create or replace function public.duel_finalize(
  p_attacker uuid, p_defender uuid, p_request uuid,
  p_attacker_revision bigint, p_defender_revision bigint,
  p_next_save jsonb, p_attacker_warrior text, p_defender_warrior text,
  p_attacker_rarity text, p_defender_rarity text,
  p_won boolean, p_points smallint, p_xp smallint, p_coins smallint, p_replay jsonb
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare existing public.duel_matches%rowtype; own public.duel_players%rowtype;
  attack_save public.game_saves%rowtype; defend_save public.game_saves%rowtype;
  ts timestamptz := clock_timestamp(); expected_points integer;
begin
  if (select auth.role()) is distinct from 'service_role' then raise insufficient_privilege; end if;
  if p_attacker = p_defender or jsonb_typeof(p_next_save) <> 'object' or jsonb_typeof(p_replay) <> 'object' then raise invalid_parameter_value; end if;
  select * into own from public.duel_players where user_id = p_attacker for update;
  select * into existing from public.duel_matches where attacker_id = p_attacker and request_id = p_request;
  if found then return existing.replay; end if;
  if own.pending_opponent is distinct from p_defender then raise serialization_failure using message = 'Opponent changed'; end if;
  -- Deterministic lock order prevents two simultaneous cross-duels deadlocking.
  perform 1 from public.game_saves where user_id in (p_attacker, p_defender) order by user_id for update;
  select * into attack_save from public.game_saves where user_id = p_attacker;
  select * into defend_save from public.game_saves where user_id = p_defender;
  if attack_save.revision is distinct from p_attacker_revision or defend_save.revision is distinct from p_defender_revision then
    raise serialization_failure using message = 'Save changed; retry with current state';
  end if;
  if attack_save.save_data ->> 'activeWarriorId' is distinct from p_attacker_warrior
    or defend_save.save_data ->> 'activeWarriorId' is distinct from p_defender_warrior then raise serialization_failure; end if;
  expected_points := case when p_won then 20 + 5 * greatest(0,
    array_position(array['Commun','Peu commun','Rare','Épique','Légendaire','Mythique'], p_defender_rarity)
    - array_position(array['Commun','Peu commun','Rare','Épique','Légendaire','Mythique'], p_attacker_rarity)) else 0 end;
  if expected_points is null or p_points <> expected_points or
    (p_won and (p_xp <> 20 or p_coins <> 10)) or
    (not p_won and (p_xp <> 4 or p_coins <> 0)) then raise invalid_parameter_value using message = 'Invalid Duel awards'; end if;
  ts := clock_timestamp();
  if own.daily_date < timezone('Europe/Paris', ts)::date then
    own.charges := 10;
    own.daily_date := timezone('Europe/Paris', ts)::date;
  end if;
  if own.charges = 0 then raise check_violation using message = 'No Duel charges'; end if;
  update public.game_saves set save_data = p_next_save, save_version = (p_next_save ->> 'version')::integer,
    revision = revision + 1, updated_at = ts where user_id = p_attacker;
  update public.duel_players set charges = own.charges - 1,
    recharge_at = null, daily_date = own.daily_date,
    pending_opponent = null, points = points + p_points,
    wins = wins + case when p_won then 1 else 0 end, updated_at = ts where user_id = p_attacker;
  insert into public.duel_matches (attacker_id, defender_id, request_id, attacker_warrior_id, defender_warrior_id,
    attacker_rarity, defender_rarity, attacker_won, points_awarded, xp_awarded, coins_awarded, replay)
    values (p_attacker, p_defender, p_request, p_attacker_warrior, p_defender_warrior,
      p_attacker_rarity, p_defender_rarity, p_won, p_points, p_xp, p_coins, p_replay);
  return p_replay;
end;
$$;
revoke all on function public.duel_finalize(uuid,uuid,uuid,bigint,bigint,jsonb,text,text,text,text,boolean,smallint,smallint,smallint,jsonb) from public, anon, authenticated;
grant execute on function public.duel_finalize(uuid,uuid,uuid,bigint,bigint,jsonb,text,text,text,text,boolean,smallint,smallint,smallint,jsonb) to service_role;

commit;
