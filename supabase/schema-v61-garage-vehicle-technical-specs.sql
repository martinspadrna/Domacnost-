-- Domácnost+ v.0.1_150
-- Garáž: rozšířený technický list auta uložený jako JSON kvůli budoucímu rozšiřování bez dalších desítek sloupců.

alter table if exists public.vehicles
  add column if not exists technical_specs jsonb not null default '{}'::jsonb;

notify pgrst, 'reload schema';
