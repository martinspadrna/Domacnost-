-- Domácnost+ v.0.1_159 / schema v62
-- Garáž: reálně doplní chybějící sloupce pro prodaná/nevlastněná auta.
-- Záruky: soukromé přílohy fotka/PDF přes Supabase Storage + metadata.

begin;

alter table public.vehicles
  add column if not exists ownership_status text not null default 'owned',
  add column if not exists purchase_date date,
  add column if not exists purchase_price numeric,
  add column if not exists purchase_odometer integer,
  add column if not exists sale_date date,
  add column if not exists sale_price numeric,
  add column if not exists sale_odometer integer,
  add column if not exists technical_specs jsonb not null default '{}'::jsonb;

alter table public.vehicles drop constraint if exists vehicles_ownership_status_check;
alter table public.vehicles add constraint vehicles_ownership_status_check check (ownership_status in ('owned', 'sold', 'not_owned'));

update public.vehicles
set ownership_status = case
  when is_archived is true and coalesce(ownership_status, 'owned') = 'owned' then 'sold'
  else coalesce(ownership_status, 'owned')
end;

create table if not exists public.household_warranty_files (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  warranty_key text,
  bucket_id text not null default 'warranty-files',
  storage_path text not null,
  file_name text not null,
  mime_type text,
  file_size bigint not null default 0,
  source text not null default 'upload',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.household_warranty_files
  add column if not exists warranty_key text,
  add column if not exists bucket_id text not null default 'warranty-files',
  add column if not exists source text not null default 'upload';

create index if not exists household_warranty_files_household_idx on public.household_warranty_files(household_id, created_at desc);
create index if not exists household_warranty_files_warranty_key_idx on public.household_warranty_files(household_id, warranty_key, created_at desc);

alter table public.household_warranty_files enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='household_warranty_files' and policyname='household_warranty_files_select_member') then
    create policy household_warranty_files_select_member on public.household_warranty_files for select to authenticated using (public.is_household_member(household_id));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='household_warranty_files' and policyname='household_warranty_files_insert_member') then
    create policy household_warranty_files_insert_member on public.household_warranty_files for insert to authenticated with check (public.has_household_role(household_id, array['owner','admin','member']));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='household_warranty_files' and policyname='household_warranty_files_delete_member') then
    create policy household_warranty_files_delete_member on public.household_warranty_files for delete to authenticated using (public.has_household_role(household_id, array['owner','admin','member']));
  end if;
end $$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('warranty-files', 'warranty-files', false, 15728640, array['application/pdf','image/jpeg','image/png','image/webp','image/heic','image/heif'])
on conflict (id) do update set
  public = false,
  file_size_limit = 15728640,
  allowed_mime_types = array['application/pdf','image/jpeg','image/png','image/webp','image/heic','image/heif'];

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='warranty_files_select_member') then
    create policy warranty_files_select_member on storage.objects for select to authenticated using (bucket_id = 'warranty-files' and public.is_household_member((storage.foldername(name))[1]::uuid));
  end if;
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='warranty_files_insert_member') then
    create policy warranty_files_insert_member on storage.objects for insert to authenticated with check (bucket_id = 'warranty-files' and public.has_household_role((storage.foldername(name))[1]::uuid, array['owner','admin','member']));
  end if;
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='warranty_files_delete_member') then
    create policy warranty_files_delete_member on storage.objects for delete to authenticated using (bucket_id = 'warranty-files' and public.has_household_role((storage.foldername(name))[1]::uuid, array['owner','admin','member']));
  end if;
end $$;

notify pgrst, 'reload schema';
commit;
