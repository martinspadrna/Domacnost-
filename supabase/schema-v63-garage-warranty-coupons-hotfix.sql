-- Domácnost+ v.0.1_160 / schema v63
-- Hotfix: sjednocení archivovaných/prodaných aut podle prodejních polí.
-- Bez mazání dat. Jen dorovná ownership_status/is_archived tam, kde už existuje datum/prodejní km/prodejní cena.

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

update public.vehicles
set ownership_status = 'sold',
    is_archived = true,
    updated_at = now()
where ownership_status = 'owned'
  and (
    sale_date is not null
    or sale_price is not null
    or sale_odometer is not null
  );

notify pgrst, 'reload schema';

commit;
