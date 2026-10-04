-- V0.14: economy only. Apply after 202610040003. Existing receipts remain immutable.
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
    (p_won and (p_xp <> 20 or p_coins <> 20)) or
    (not p_won and (p_xp <> 4 or p_coins <> 0)) then raise invalid_parameter_value using message = 'Invalid Duel awards'; end if;
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
