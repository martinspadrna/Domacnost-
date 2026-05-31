-- Home Web cloud draft schema · offline v0.9 (908), schema v7
-- Neaplikovat naslepo do produkce bez kontroly RLS/policies podle finálního auth flow.

create extension if not exists pgcrypto;

create table if not exists public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.household_members (
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member', 'read_only')),
  created_at timestamptz not null default now(),
  primary key (household_id, user_id)
);

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  name text not null,
  color text,
  role text not null default 'member',
  created_at timestamptz not null default now()
);

create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  name text not null,
  type text,
  provider text,
  contract_number text,
  valid_from date,
  valid_to date,
  amount numeric,
  frequency text,
  note text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contract_files (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  contract_id uuid not null references public.contracts(id) on delete cascade,
  file_name text not null,
  file_type text,
  file_size bigint,
  storage_path text not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  name text not null,
  plate text,
  fuel_type text,
  odometer numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.fuel_logs (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  date date not null,
  odometer numeric,
  liters numeric,
  price numeric,
  note text,
  source text,
  created_at timestamptz not null default now()
);

create table if not exists public.service_logs (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  date date not null,
  title text not null,
  price numeric,
  note text,
  source text,
  created_at timestamptz not null default now()
);

create table if not exists public.parcels (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  carrier text,
  tracking text not null,
  status text,
  url text,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hdo_windows (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  label text not null,
  start_time time not null,
  end_time time not null,
  days smallint[] not null,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.shopping_items (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  name text not null,
  category text,
  amount text,
  note text,
  done boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.discount_codes (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  store text not null,
  code text not null,
  discount text,
  expiry date,
  note text,
  used boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.camera_configs (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  name text not null,
  location text,
  snapshot_url text,
  status text,
  note text,
  created_at timestamptz not null default now()
);

alter table public.households enable row level security;
alter table public.household_members enable row level security;
alter table public.profiles enable row level security;
alter table public.contracts enable row level security;
alter table public.contract_files enable row level security;
alter table public.vehicles enable row level security;
alter table public.fuel_logs enable row level security;
alter table public.service_logs enable row level security;
alter table public.parcels enable row level security;
alter table public.hdo_windows enable row level security;
alter table public.shopping_items enable row level security;
alter table public.discount_codes enable row level security;
alter table public.camera_configs enable row level security;

-- Pomocná kontrola členství. Finální policies doplnit podle finálního auth flow.
create or replace function public.is_household_member(target_household uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.household_members hm
    where hm.household_id = target_household
      and hm.user_id = auth.uid()
  );
$$;

-- Ukázkové read policies. Insert/update/delete policies doplnit podle rolí owner/admin/member.
create policy "members can read profiles" on public.profiles for select using (public.is_household_member(household_id));
create policy "members can read contracts" on public.contracts for select using (public.is_household_member(household_id));
create policy "members can read contract files" on public.contract_files for select using (public.is_household_member(household_id));
create policy "members can read vehicles" on public.vehicles for select using (public.is_household_member(household_id));
create policy "members can read fuel logs" on public.fuel_logs for select using (public.is_household_member(household_id));
create policy "members can read service logs" on public.service_logs for select using (public.is_household_member(household_id));
create policy "members can read parcels" on public.parcels for select using (public.is_household_member(household_id));
create policy "members can read hdo windows" on public.hdo_windows for select using (public.is_household_member(household_id));
create policy "members can read shopping" on public.shopping_items for select using (public.is_household_member(household_id));
create policy "members can read discount codes" on public.discount_codes for select using (public.is_household_member(household_id));
create policy "members can read camera configs" on public.camera_configs for select using (public.is_household_member(household_id));
