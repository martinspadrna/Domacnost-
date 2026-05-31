# Domácnost+ v.0.1_14

- Přidaný cloudový základ pro Smlouvy a pojistky bez příloh.
- Supabase tabulka `contracts` s RLS podle `household_id`.
- Aplikace umí uložit novou smlouvu do cloudu, načíst cloud smlouvy, odeslat lokální smlouvy a smazat cloud smlouvu.
- PDF/fotky smluv zatím zůstávají lokálně v IndexedDB; Storage přijde až v dalším kroku.
- Zachovaná kompatibilita s Domácnost+ v.0.1_13.
