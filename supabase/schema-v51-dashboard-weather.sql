-- Domácnost+ v.0.1_66 / schema v51
-- Modulární hlavní obrazovka a nastavení počasí pro celou domácnost.

alter table public.households
  add column if not exists dashboard_layout jsonb not null default '{}'::jsonb,
  add column if not exists weather_location jsonb not null default '{}'::jsonb;

comment on column public.households.dashboard_layout is 'User configurable household dashboard layout: enabled cards, order and compact settings.';
comment on column public.households.weather_location is 'Household weather location settings used by the client weather widget.';
