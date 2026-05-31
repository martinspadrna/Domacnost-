# Domácnost+ v.0.1_17

## Hotovo

- Přidaný cloudový základ modulu Garáž.
- Supabase tabulky:
  - vehicles
  - fuel_logs
  - service_logs
- Všechny garážové tabulky mají RLS přes household_id.
- Frontend umí:
  - uložit nové auto do cloudu,
  - upravit cloudové auto,
  - uložit tankování do cloudu,
  - uložit servis do cloudu,
  - načíst cloudovou Garáž,
  - odeslat lokální Garáž do cloudu,
  - smazat cloudové auto nebo záznam.
- Karty aut nově ukazují lokálně/cloud.
- Opraven starší bug v Nákupu, kde se při přepnutí Hotovo stav mohl kvůli duplicitnímu toggle vrátit zpět.

## Poznámky

- Fuelio import zatím ukládá primárně lokálně; po importu je možné použít „Odeslat lokální Garáž“.
- Další krok: lepší cloud import Fuelio a úprava/smazání jednotlivých tankování a servisů přes detail.
