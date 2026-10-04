-- V0.13.2. Apply after 202610040001. Competitive writes are service-role only.
grant select on public.profiles to service_role;
grant select, update on public.game_saves to service_role;

create table public.duel_players (
  user_id uuid primary key references public.profiles(user_id) on delete cascade,
  points bigint not null default 0 check (points >= 0),
  wins integer not null default 0 check (wins >= 0),
  charges smallint not null default 10 check (charges between 0 and 10),
  recharge_at timestamptz,
  pending_opponent uuid references public.profiles(user_id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint duel_no_self_pending check (pending_opponent is distinct from user_id),
  constraint duel_full_has_no_timer check (charges < 10 or recharge_at is null)
);

create table public.duel_matches (
  id uuid primary key default gen_random_uuid(),
  attacker_id uuid not null references public.profiles(user_id) on delete cascade,
  defender_id uuid not null references public.profiles(user_id) on delete cascade,
  request_id uuid not null,
  attacker_warrior_id text not null,
  defender_warrior_id text not null,
  attacker_rarity text not null,
  defender_rarity text not null,
  attacker_won boolean not null,
  points_awarded smallint not null check (points_awarded between 0 and 45),
  xp_awarded smallint not null check (xp_awarded >= 0),
  coins_awarded smallint not null check (coins_awarded >= 0),
  replay jsonb not null,
  created_at timestamptz not null default now(),
  unique (attacker_id, request_id),
  constraint duel_no_self_match check (attacker_id <> defender_id)
);
create index duel_players_rank on public.duel_players (points desc, created_at, user_id);
create index duel_matches_attacker_recent on public.duel_matches (attacker_id, created_at desc, id desc);

alter table public.duel_players enable row level security;
alter table public.duel_matches enable row level security;
revoke all on public.duel_players from public, anon, authenticated;
revoke all on public.duel_matches from public, anon, authenticated;
grant select, insert, update, delete on public.duel_players to service_role;
grant select, insert, update, delete on public.duel_matches to service_role;

create or replace function app_private.create_duel_player()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.duel_players(user_id) values (new.user_id) on conflict do nothing;
  return new;
end;
$$;
revoke all on function app_private.create_duel_player() from public, anon, authenticated;
create trigger chronos_create_duel_player after insert on public.profiles
  for each row execute function app_private.create_duel_player();
insert into public.duel_players(user_id) select user_id from public.profiles on conflict do nothing;

-- The Edge Function calls these public RPCs using its private service-role key.
-- Calling clients cannot execute them and cannot write either table directly.
create or replace function public.duel_assign(p_attacker uuid, p_exclude uuid[] default '{}'::uuid[])
returns jsonb language plpgsql security definer set search_path = '' as $$
declare own public.duel_players%rowtype; chosen uuid; ts timestamptz := clock_timestamp();
begin
  if (select auth.role()) is distinct from 'service_role' then raise insufficient_privilege; end if;
  select * into own from public.duel_players where user_id = p_attacker for update;
  if not found then raise invalid_parameter_value using message = 'Duel account missing'; end if;
  if own.charges < 10 and own.recharge_at is not null and own.recharge_at <= ts then
    own.charges := least(10, own.charges + 1 + floor(extract(epoch from ts - own.recharge_at) / 1200)::integer);
    own.recharge_at := case when own.charges = 10 then null else own.recharge_at + interval '20 minutes' * (1 + floor(extract(epoch from ts - own.recharge_at) / 1200)::integer) end;
  end if;
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
  update public.duel_players set charges = own.charges, recharge_at = own.recharge_at,
    pending_opponent = chosen, updated_at = ts where user_id = p_attacker;
  return jsonb_build_object('opponent_id', chosen, 'charges', own.charges,
    'recharge_at', own.recharge_at, 'server_now', ts, 'points', own.points);
end;
$$;
revoke all on function public.duel_assign(uuid,uuid[]) from public, anon, authenticated;
grant execute on function public.duel_assign(uuid,uuid[]) to service_role;

create or replace function public.duel_invalidate(p_attacker uuid, p_defender uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if (select auth.role()) is distinct from 'service_role' then raise insufficient_privilege; end if;
  update public.duel_players set pending_opponent = null, updated_at = clock_timestamp()
    where user_id = p_attacker and pending_opponent = p_defender;
end;
$$;
revoke all on function public.duel_invalidate(uuid,uuid) from public, anon, authenticated;
grant execute on function public.duel_invalidate(uuid,uuid) to service_role;

create or replace function public.duel_finalize(
  p_attacker uuid, p_defender uuid, p_request uuid,
  p_attacker_revision bigint, p_defender_revision bigint,
  p_next_save jsonb, p_attacker_warrior text, p_defender_warrior text,
  p_attacker_rarity text, p_defender_rarity text,
  p_won boolean, p_points smallint, p_xp smallint, p_coins smallint, p_replay jsonb
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare existing public.duel_matches%rowtype; own public.duel_players%rowtype;
  attack_save public.game_saves%rowtype; defend_save public.game_saves%rowtype;
  ts timestamptz := clock_timestamp(); expected_points integer; awarded_charges integer;
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
    (p_won and (p_xp <> 100 or p_coins <> 50)) or
    (not p_won and (p_xp <> 25 or p_coins <> 10)) then raise invalid_parameter_value using message = 'Invalid Duel awards'; end if;
  if own.charges < 10 and own.recharge_at is not null and own.recharge_at <= ts then
    awarded_charges := 1 + floor(extract(epoch from ts - own.recharge_at) / 1200)::integer;
    own.charges := least(10, own.charges + awarded_charges);
    own.recharge_at := case when own.charges = 10 then null else own.recharge_at + interval '20 minutes' * awarded_charges end;
  end if;
  if own.charges = 0 then raise check_violation using message = 'No Duel charges'; end if;
  update public.game_saves set save_data = p_next_save, save_version = (p_next_save ->> 'version')::integer,
    revision = revision + 1, updated_at = ts where user_id = p_attacker;
  update public.duel_players set charges = own.charges - 1,
    recharge_at = coalesce(own.recharge_at, ts + interval '20 minutes'),
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
      s.save_data ->> 'activeWarriorId' as warrior_id,
      (s.save_data -> 'ownedWarriors' -> (s.save_data ->> 'activeWarriorId') ->> 'level')::integer as level
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
    'warrior_id', x.save_data ->> 'activeWarriorId',
    'level', (x.save_data -> 'ownedWarriors' -> (x.save_data ->> 'activeWarriorId') ->> 'level')::integer,
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
