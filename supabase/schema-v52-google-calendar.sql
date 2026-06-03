-- Domácnost+ v.0.1_78 / schema v52
-- Bezpečný základ pro Google Calendar integraci.
-- Tokeny nejsou čitelné z frontendu: veřejná tabulka drží metadata, private schema drží šifrované tokeny jen pro Edge Functions se service role klíčem.

create schema if not exists app_private;

create table if not exists public.calendar_provider_connections (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null default 'google' check (provider in ('google')),
  google_account_email text,
  scopes text[] not null default '{}'::text[],
  status text not null default 'oauth_pending' check (status in ('oauth_pending','connected','disconnected','error')),
  oauth_state text,
  oauth_redirect_uri text,
  last_sync_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists app_private.calendar_provider_connection_secrets (
  connection_id uuid primary key references public.calendar_provider_connections(id) on delete cascade,
  access_token_encrypted text,
  refresh_token_encrypted text,
  token_expires_at timestamptz,
  token_type text,
  raw_token_response jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists public.calendar_sources
  add column if not exists provider_connection_id uuid references public.calendar_provider_connections(id) on delete set null,
  add column if not exists sync_status text not null default 'idle',
  add column if not exists sync_error text,
  add column if not exists external_url text;

alter table if exists public.calendar_events
  add column if not exists provider_event_id text,
  add column if not exists provider_status text,
  add column if not exists provider_updated_at timestamptz,
  add column if not exists source_etag text,
  add column if not exists external_url text,
  add column if not exists raw_provider_payload jsonb not null default '{}'::jsonb;

create table if not exists public.calendar_sync_runs (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  source_id uuid references public.calendar_sources(id) on delete set null,
  connection_id uuid references public.calendar_provider_connections(id) on delete set null,
  provider text not null default 'google',
  status text not null default 'running' check (status in ('running','success','error','partial')),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  events_upserted integer not null default 0,
  events_cancelled integer not null default 0,
  error text,
  created_by uuid references auth.users(id) on delete set null
);

create index if not exists calendar_provider_connections_household_idx on public.calendar_provider_connections(household_id, provider, status);
create index if not exists calendar_provider_connections_user_idx on public.calendar_provider_connections(user_id, provider, status);
create index if not exists calendar_sources_provider_connection_idx on public.calendar_sources(provider_connection_id, provider_calendar_id) where provider_connection_id is not null;
create unique index if not exists calendar_sources_google_unique_idx on public.calendar_sources(household_id, provider_connection_id, provider_calendar_id) where provider = 'google' and provider_connection_id is not null and provider_calendar_id is not null;
create unique index if not exists calendar_events_provider_unique_idx on public.calendar_events(source_id, provider_event_id) where source_id is not null and provider_event_id is not null;
create index if not exists calendar_sync_runs_household_idx on public.calendar_sync_runs(household_id, started_at desc);

alter table public.calendar_provider_connections enable row level security;
alter table public.calendar_sync_runs enable row level security;

revoke all on schema app_private from anon, authenticated, public;
revoke all on all tables in schema app_private from anon, authenticated, public;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='calendar_provider_connections' and policyname='calendar_provider_connections_select_member') then
    create policy calendar_provider_connections_select_member on public.calendar_provider_connections
      for select to authenticated
      using (public.is_household_member(household_id));
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='calendar_provider_connections' and policyname='calendar_provider_connections_insert_member') then
    create policy calendar_provider_connections_insert_member on public.calendar_provider_connections
      for insert to authenticated
      with check (public.has_household_role(household_id, array['owner','admin','member']) and user_id = auth.uid());
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='calendar_provider_connections' and policyname='calendar_provider_connections_update_member') then
    create policy calendar_provider_connections_update_member on public.calendar_provider_connections
      for update to authenticated
      using (public.has_household_role(household_id, array['owner','admin','member']))
      with check (public.has_household_role(household_id, array['owner','admin','member']));
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='calendar_provider_connections' and policyname='calendar_provider_connections_delete_admin') then
    create policy calendar_provider_connections_delete_admin on public.calendar_provider_connections
      for delete to authenticated
      using (public.has_household_role(household_id, array['owner','admin']));
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='calendar_sync_runs' and policyname='calendar_sync_runs_select_member') then
    create policy calendar_sync_runs_select_member on public.calendar_sync_runs
      for select to authenticated
      using (public.is_household_member(household_id));
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='calendar_sync_runs' and policyname='calendar_sync_runs_insert_member') then
    create policy calendar_sync_runs_insert_member on public.calendar_sync_runs
      for insert to authenticated
      with check (public.has_household_role(household_id, array['owner','admin','member']));
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='calendar_sync_runs' and policyname='calendar_sync_runs_update_member') then
    create policy calendar_sync_runs_update_member on public.calendar_sync_runs
      for update to authenticated
      using (public.has_household_role(household_id, array['owner','admin','member']))
      with check (public.has_household_role(household_id, array['owner','admin','member']));
  end if;
end $$;

comment on table public.calendar_provider_connections is 'Metadata připojených kalendářových providerů. Neobsahuje raw Google tokeny.';
comment on table app_private.calendar_provider_connection_secrets is 'Šifrované Google OAuth tokeny. Číst/zapisovat má jen backend se service role klíčem.';
comment on column public.calendar_sources.provider_connection_id is 'Vazba zdroje na Google/iCal připojení. Pro každý Google kalendář vzniká samostatný calendar_source.';
comment on column public.calendar_events.provider_event_id is 'ID události u externího provideru. Deduplikace přes source_id + provider_event_id.';
