# Home Web cloud migration notes

Aktuální offline build: Home Web offline v1.0 (909), schema v8.

## Co už je připravené
- `householdId` u datových položek.
- `profileId` u datových položek.
- Volitelné moduly a uživatelská spodní lišta.
- Přílohy smluv mimo `localStorage`, zatím přes IndexedDB.
- Export/import JSON pro textová data.
- Návrh Supabase tabulek v `supabase_schema_draft.sql`.

## Co bude potřeba při přechodu do cloudu
- Supabase Auth.
- Tabulky `households`, `household_members`, `profiles`.
- RLS policies pro každou modulovou tabulku.
- Supabase Storage private bucket pro přílohy smluv.
- Migrační import z offline JSON do Supabase.
- Rozhodnout, jestli Home Web poběží jako samostatný projekt, nebo vedle RaK.

## Poznámka
Soubory příloh nejsou součástí JSON exportu. V offline režimu zůstávají v IndexedDB konkrétního prohlížeče.


## Doplněno ve v1.0 (909)
- Tabletový dashboard používá větší focus karty a časovou osu „dnes a brzy“.
- Dashboard lépe agreguje kalendář, HDO, balíky, nákup, smlouvy, úkoly, svoz odpadu a garáž.
- Offline UX základ je připravený na další krok: cloudovou kostru.
