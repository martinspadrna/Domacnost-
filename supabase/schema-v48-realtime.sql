-- Domácnost+ v.0.1_63 / schema v48
-- Zapne Supabase Realtime publikaci pro sdílené cloudové tabulky domácnosti.
-- Frontend pak může po změně od jiného člena domácnosti automaticky obnovit data aktivní household_id.

do $$
declare
  tbl text;
  tables text[] := array[
    'shopping_lists',
    'shopping_list_items',
    'contracts',
    'contract_files',
    'vehicles',
    'fuel_logs',
    'service_logs',
    'hdo_settings',
    'hdo_windows',
    'waste_types',
    'waste_schedules',
    'household_tasks',
    'task_events',
    'parcels',
    'calendar_events',
    'finance_accounts',
    'finance_transactions',
    'household_notes',
    'household_devices',
    'camera_feeds',
    'household_coupons'
  ];
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    execute 'create publication supabase_realtime';
  end if;

  foreach tbl in array tables loop
    if exists (
      select 1
      from information_schema.tables ist
      where ist.table_schema = 'public'
        and ist.table_name = tbl
    ) and not exists (
      select 1
      from pg_publication_tables ppt
      where ppt.pubname = 'supabase_realtime'
        and ppt.schemaname = 'public'
        and ppt.tablename = tbl
    ) then
      execute format('alter publication supabase_realtime add table public.%I', tbl);
    end if;
  end loop;
end $$;
