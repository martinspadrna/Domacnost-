-- Domácnost+ v.0.1_85 / schema v55
-- Ostrý bezpečný základ pro Google Calendar OAuth přes Supabase Edge Functions.
-- Frontend vidí jen metadata připojení. Google access/refresh tokeny jsou v app_private a čte je jen service role backend.

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

alter table if exists public.calendar_sync_runs
  add column if not exists connection_id uuid references public.calendar_provider_connections(id) on delete set null,
  add column if not exists events_upserted integer not null default 0,
  add column if not exists events_cancelled integer not null default 0,
  add column if not exists error text;

-- Starší schéma používalo status failed, novější funkce používají error. Povolit obě hodnoty bez pádu migrace.
do $$
begin
  if exists (
    select 1 from information_schema.table_constraints
    where table_schema = 'public'
      and table_name = 'calendar_sync_runs'
      and constraint_name = 'calendar_sync_runs_status_check'
  ) then
    alter table public.calendar_sync_runs drop constraint calendar_sync_runs_status_check;
  end if;
  alter table public.calendar_sync_runs
    add constraint calendar_sync_runs_status_check
    check (status in ('running','success','failed','error','partial'));
exception
  when duplicate_object then null;
end $$;

create index if not exists calendar_provider_connections_household_idx on public.calendar_provider_connections(household_id, provider, status);
create index if not exists calendar_provider_connections_user_idx on public.calendar_provider_connections(user_id, provider, status);
create index if not exists calendar_provider_connections_state_idx on public.calendar_provider_connections(provider, oauth_state) where oauth_state is not null;
create index if not exists calendar_sources_provider_connection_idx on public.calendar_sources(provider_connection_id, provider_calendar_id) where provider_connection_id is not null;
create unique index if not exists calendar_sources_google_unique_idx on public.calendar_sources(household_id, provider_connection_id, provider_calendar_id) where provider = 'google' and provider_connection_id is not null and provider_calendar_id is not null;
create unique index if not exists calendar_events_provider_unique_idx on public.calendar_events(source_id, provider_event_id) where source_id is not null and provider_event_id is not null;
create index if not exists calendar_sync_runs_connection_idx on public.calendar_sync_runs(connection_id, started_at desc) where connection_id is not null;

alter table public.calendar_provider_connections enable row level security;
alter table public.calendar_sync_runs enable row level security;

revoke all on schema app_private from anon, authenticated, public;
revoke all on all tables in schema app_private from anon, authenticated, public;

-- Service role má schéma dostupné automaticky přes bypassrls, explicitní grant pomáhá edge runtime klientovi.
grant usage on schema app_private to service_role;
grant all on all tables in schema app_private to service_role;

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

comment on table public.calendar_provider_connections is 'Metadata Google Calendar připojení. Neobsahuje raw OAuth tokeny.';
comment on table app_private.calendar_provider_connection_secrets is 'Šifrované Google OAuth tokeny. Číst/zapisovat má jen Edge Function se service role.';
comment on column public.calendar_sources.provider_connection_id is 'Vazba zdroje kalendáře na Google OAuth připojení.';
comment on column public.calendar_events.provider_event_id is 'ID události u Google. Deduplikace přes source_id + provider_event_id.';
