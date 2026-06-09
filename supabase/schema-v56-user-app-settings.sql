-- Domácnost+ schema v56 / build 143
-- Osobní nastavení vzhledu účtu: styl ikon, barevné schéma, světlý/tmavý režim.
-- Není vázané na domácnost, aby každý člen mohl mít vlastní vzhled na všech zařízeních.

create table if not exists public.user_app_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_app_settings enable row level security;

drop policy if exists "user_app_settings_select_own" on public.user_app_settings;
create policy "user_app_settings_select_own"
  on public.user_app_settings
  for select
  using (auth.uid() = user_id);

drop policy if exists "user_app_settings_insert_own" on public.user_app_settings;
create policy "user_app_settings_insert_own"
  on public.user_app_settings
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "user_app_settings_update_own" on public.user_app_settings;
create policy "user_app_settings_update_own"
  on public.user_app_settings
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "user_app_settings_delete_own" on public.user_app_settings;
create policy "user_app_settings_delete_own"
  on public.user_app_settings
  for delete
  using (auth.uid() = user_id);

create index if not exists user_app_settings_updated_at_idx
  on public.user_app_settings(updated_at desc);
