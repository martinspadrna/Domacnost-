-- Domácnost+ v.0.1_145
-- Garáž: km při koupi a km při prodeji pro online synchronizaci mezi zařízeními.

alter table if exists public.vehicles
  add column if not exists purchase_odometer integer,
  add column if not exists sale_odometer integer;
