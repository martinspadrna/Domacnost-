-- Domácnost+ v.0.1_148
-- Garáž: stav vlastnictví auta a bezpečné doplnění polí pro kalkulace prodaných aut.

alter table if exists public.vehicles
  add column if not exists ownership_status text not null default 'owned',
  add column if not exists purchase_date date,
  add column if not exists purchase_price numeric(12,2),
  add column if not exists purchase_odometer integer,
  add column if not exists sale_date date,
  add column if not exists sale_price numeric(12,2),
  add column if not exists sale_odometer integer;

do $$
begin
  if exists (select 1 from pg_constraint where conname = 'vehicles_ownership_status_check') then
    alter table public.vehicles drop constraint vehicles_ownership_status_check;
  end if;
  alter table public.vehicles
    add constraint vehicles_ownership_status_check check (ownership_status in ('owned', 'sold'));
end $$;

notify pgrst, 'reload schema';
