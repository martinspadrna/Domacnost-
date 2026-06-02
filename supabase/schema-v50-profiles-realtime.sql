-- Domácnost+ schema v50 / build 65
-- Doplnění profilů a členů domácnosti do Supabase Realtime publikace.
-- Díky tomu se změny profilů a členství postupně chovají stejně jako ostatní sdílená data domácnosti.

do $$
declare
  tbl text;
  tables text[] := array['profiles','household_members'];
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
