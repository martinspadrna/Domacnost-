-- Domácnost+ schema v47 / cloud extras
-- Drobné moduly mimo hlavní tabulky: poznámky, zařízení, kamery, slevové kódy.
-- Data jsou oddělená přes household_id a RLS stejně jako ostatní cloudové moduly.

create table if not exists public.household_notes (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  text text not null,
  status text not null default 'active',
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.household_devices (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  name text not null,
  type text,
  address text,
  note text,
  status text not null default 'active',
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.camera_feeds (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  name text not null,
  location text,
  snapshot_url text,
  status text not null default 'offline',
  note text,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.household_coupons (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  store text not null,
  code text,
  discount text,
  expiry date,
  note text,
  used boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists household_notes_household_idx on public.household_notes(household_id, created_at desc);
create index if not exists household_devices_household_idx on public.household_devices(household_id, created_at desc);
create index if not exists camera_feeds_household_idx on public.camera_feeds(household_id, created_at desc);
create index if not exists household_coupons_household_idx on public.household_coupons(household_id, expiry, created_at desc);

alter table public.household_notes enable row level security;
alter table public.household_devices enable row level security;
alter table public.camera_feeds enable row level security;
alter table public.household_coupons enable row level security;

-- Policies intentionally mirror the rest of Domácnost+ cloud tables.
do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='household_notes' and policyname='household_notes_select_member') then
    create policy household_notes_select_member on public.household_notes for select to authenticated using (public.is_household_member(household_id));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='household_notes' and policyname='household_notes_insert_member') then
    create policy household_notes_insert_member on public.household_notes for insert to authenticated with check (public.has_household_role(household_id, array['owner','admin','member']));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='household_notes' and policyname='household_notes_update_member') then
    create policy household_notes_update_member on public.household_notes for update to authenticated using (public.has_household_role(household_id, array['owner','admin','member'])) with check (public.has_household_role(household_id, array['owner','admin','member']));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='household_notes' and policyname='household_notes_delete_member') then
    create policy household_notes_delete_member on public.household_notes for delete to authenticated using (public.has_household_role(household_id, array['owner','admin','member']));
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='household_devices' and policyname='household_devices_select_member') then
    create policy household_devices_select_member on public.household_devices for select to authenticated using (public.is_household_member(household_id));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='household_devices' and policyname='household_devices_insert_member') then
    create policy household_devices_insert_member on public.household_devices for insert to authenticated with check (public.has_household_role(household_id, array['owner','admin','member']));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='household_devices' and policyname='household_devices_update_member') then
    create policy household_devices_update_member on public.household_devices for update to authenticated using (public.has_household_role(household_id, array['owner','admin','member'])) with check (public.has_household_role(household_id, array['owner','admin','member']));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='household_devices' and policyname='household_devices_delete_member') then
    create policy household_devices_delete_member on public.household_devices for delete to authenticated using (public.has_household_role(household_id, array['owner','admin','member']));
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='camera_feeds' and policyname='camera_feeds_select_member') then
    create policy camera_feeds_select_member on public.camera_feeds for select to authenticated using (public.is_household_member(household_id));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='camera_feeds' and policyname='camera_feeds_insert_member') then
    create policy camera_feeds_insert_member on public.camera_feeds for insert to authenticated with check (public.has_household_role(household_id, array['owner','admin','member']));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='camera_feeds' and policyname='camera_feeds_update_member') then
    create policy camera_feeds_update_member on public.camera_feeds for update to authenticated using (public.has_household_role(household_id, array['owner','admin','member'])) with check (public.has_household_role(household_id, array['owner','admin','member']));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='camera_feeds' and policyname='camera_feeds_delete_member') then
    create policy camera_feeds_delete_member on public.camera_feeds for delete to authenticated using (public.has_household_role(household_id, array['owner','admin','member']));
  end if;

  if not exists (select 1 from pg_policies where schemaname='public' and tablename='household_coupons' and policyname='household_coupons_select_member') then
    create policy household_coupons_select_member on public.household_coupons for select to authenticated using (public.is_household_member(household_id));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='household_coupons' and policyname='household_coupons_insert_member') then
    create policy household_coupons_insert_member on public.household_coupons for insert to authenticated with check (public.has_household_role(household_id, array['owner','admin','member']));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='household_coupons' and policyname='household_coupons_update_member') then
    create policy household_coupons_update_member on public.household_coupons for update to authenticated using (public.has_household_role(household_id, array['owner','admin','member'])) with check (public.has_household_role(household_id, array['owner','admin','member']));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='household_coupons' and policyname='household_coupons_delete_member') then
    create policy household_coupons_delete_member on public.household_coupons for delete to authenticated using (public.has_household_role(household_id, array['owner','admin','member']));
  end if;
end $$;
