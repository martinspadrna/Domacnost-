# Domácnost+ v.0.1_14

Navazuje na Domácnost+ v.0.1_12.

## Hotovo

- Změněné značení verze na Domácnost+ v.0.1_14.
- Schema v aplikaci navýšené na 12, appBuild na 13.
- Service worker cache přepsaná na `domacnost-plus-v0-1-14`.
- Nákupy mají rychlé přidání položek z katalogu.
- Aplikace si lokálně pamatuje, které položky se v domácnosti používají nejčastěji.
- Rychlé položky se řadí podle používání a nedávného přidání.
- Katalog ukazuje, jestli položka patří do základního katalogu, nebo je vlastní pro domácnost.
- Přidané tlačítko pro odeslání lokálních nákupních položek do cloudu, když už je domácnost napojená.

## Poznámky

- Globální katalog zůstává společný základ.
- Vlastní katalogové položky se dál ukládají pod `household_id`, takže se nepropíšou do jiných domácností.
- PWA update flow zůstává z v.0.1_12, jen je cache přepsaná na novou verzi.

## Další krok

- Domácnost+ v.0.1_14: začít převádět modul Smlouvy bez příloh do Supabase.
