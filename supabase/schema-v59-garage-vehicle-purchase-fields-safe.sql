-- Domácnost+ v.0.1_146
-- Bezpečné doplnění všech polí auta pro koupi/prodej.
-- Tento soubor je schválně kompletní, aby stačilo spustit i v případě, že v57/v58 ještě neběžely.

alter table if exists public.vehicles
  add column if not exists purchase_date date,
  add column if not exists purchase_price numeric(12,2),
  add column if not exists purchase_odometer integer,
  add column if not exists sale_date date,
  add column if not exists sale_price numeric(12,2),
  add column if not exists sale_odometer integer;

notify pgrst, 'reload schema';
