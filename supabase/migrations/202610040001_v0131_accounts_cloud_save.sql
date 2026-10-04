-- V0.13.1. Apply once in the Supabase SQL Editor before enabling account play.
create schema if not exists app_private;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  created_at timestamptz not null default now(),
  constraint profiles_username_valid check (
    username = btrim(username) and char_length(username) between 1 and 24
    and username !~ '[[:cntrl:]]'
  )
);
create unique index if not exists profiles_username_lower_unique on public.profiles (lower(username));

create table if not exists public.game_saves (
  user_id uuid primary key references auth.users(id) on delete cascade,
  save_data jsonb not null,
  save_version integer not null check (save_version > 0),
  revision bigint not null check (revision > 0),
  updated_at timestamptz not null default now(),
  constraint game_saves_json_object check (jsonb_typeof(save_data) = 'object')
);

alter table public.profiles enable row level security;
alter table public.game_saves enable row level security;

revoke all on public.profiles from public, anon, authenticated;
revoke all on public.game_saves from public, anon, authenticated;
grant select on public.profiles to authenticated;
grant select on public.game_saves to authenticated;

create policy profiles_read_self on public.profiles for select to authenticated
  using (user_id = (select auth.uid()));
create policy game_saves_read_self on public.game_saves for select to authenticated
  using (user_id = (select auth.uid()));

create or replace function app_private.create_profile_for_auth_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare chosen_name text;
begin
  chosen_name := pg_catalog.btrim(new.raw_user_meta_data ->> 'username');
  if chosen_name is null or pg_catalog.char_length(chosen_name) not between 1 and 24
    or chosen_name ~ '[[:cntrl:]]' then
    raise check_violation using message = 'Invalid username';
  end if;
  insert into public.profiles (user_id, username) values (new.id, chosen_name);
  return new;
end;
$$;
revoke all on function app_private.create_profile_for_auth_user() from public, anon, authenticated;
drop trigger if exists chronos_create_profile on auth.users;
create trigger chronos_create_profile after insert on auth.users
  for each row execute function app_private.create_profile_for_auth_user();

create or replace function app_private.reject_username_change()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.username is distinct from old.username then
    raise check_violation using message = 'Username is immutable';
  end if;
  return new;
end;
$$;
revoke all on function app_private.reject_username_change() from public, anon, authenticated;
drop trigger if exists chronos_username_immutable on public.profiles;
create trigger chronos_username_immutable before update on public.profiles
  for each row execute function app_private.reject_username_change();

-- Anonymous users may check availability, but never read profile rows directly.
create or replace function app_private.username_available_impl(candidate text)
returns boolean language sql stable security definer set search_path = '' as $$
  select not exists (
    select 1 from public.profiles where lower(username) = lower(pg_catalog.btrim(candidate))
  );
$$;
revoke all on function app_private.username_available_impl(text) from public, anon, authenticated;
grant usage on schema app_private to anon, authenticated;
grant execute on function app_private.username_available_impl(text) to anon, authenticated;

create or replace function public.username_available(candidate text)
returns boolean language sql stable security invoker set search_path = '' as $$
  select app_private.username_available_impl(candidate);
$$;
revoke all on function public.username_available(text) from public, anon, authenticated;
grant execute on function public.username_available(text) to anon, authenticated;

-- Only this private function can write a save. No user_id is accepted from callers.
create or replace function app_private.save_game_impl(
  expected_revision bigint, next_save_data jsonb, next_save_version integer
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare owner_id uuid; saved public.game_saves%rowtype; current_row public.game_saves%rowtype;
begin
  owner_id := (select auth.uid());
  if owner_id is null then raise insufficient_privilege using message = 'Authentication required'; end if;
  if expected_revision < 0 or next_save_version <= 0 or pg_catalog.jsonb_typeof(next_save_data) <> 'object' then
    raise invalid_parameter_value using message = 'Invalid save payload';
  end if;
  if expected_revision <> 0 and not exists (select 1 from public.game_saves where user_id = owner_id) then
    return pg_catalog.jsonb_build_object('status','conflict','revision',0,'updated_at',null,'save_data',null,'save_version',null);
  end if;
  insert into public.game_saves (user_id, save_data, save_version, revision, updated_at)
    values (owner_id, next_save_data, next_save_version, 1, now())
    on conflict (user_id) do update
      set save_data = excluded.save_data,
          save_version = excluded.save_version,
          revision = public.game_saves.revision + 1,
          updated_at = now()
      where public.game_saves.revision = expected_revision
    returning * into saved;
  if found then
    return pg_catalog.jsonb_build_object('status','saved','revision',saved.revision,
      'updated_at',saved.updated_at,'save_data',saved.save_data,'save_version',saved.save_version);
  end if;
  select * into current_row from public.game_saves where user_id = owner_id;
  return pg_catalog.jsonb_build_object('status','conflict','revision',current_row.revision,
    'updated_at',current_row.updated_at,'save_data',current_row.save_data,'save_version',current_row.save_version);
end;
$$;
revoke all on function app_private.save_game_impl(bigint,jsonb,integer) from public, anon, authenticated;
grant execute on function app_private.save_game_impl(bigint,jsonb,integer) to authenticated;

create or replace function public.save_game(
  expected_revision bigint, next_save_data jsonb, next_save_version integer
) returns jsonb language sql security invoker set search_path = '' as $$
  select app_private.save_game_impl(expected_revision, next_save_data, next_save_version);
$$;
revoke all on function public.save_game(bigint,jsonb,integer) from public, anon, authenticated;
grant execute on function public.save_game(bigint,jsonb,integer) to authenticated;
