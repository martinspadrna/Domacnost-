-- Domácnost+ v.0.1_144
-- Garáž: pořízení a prodej auta pro online synchronizaci mezi zařízeními.

alter table if exists public.vehicles
  add column if not exists purchase_date date,
  add column if not exists purchase_price numeric(12,2),
  add column if not exists sale_date date,
  add column if not exists sale_price numeric(12,2);
