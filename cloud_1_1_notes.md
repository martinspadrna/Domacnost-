# Domácnost+ Cloud v1.1 (910)

Navazuje na offline v1.0 (909).

## Hotovo ve frontendu
- přidaná konfigurace Supabase projektu `cgshssdjgzzuprlwnabl`
- používá se publishable key `sb_publishable_...`, ne service role
- přidané formuláře pro registraci/přihlášení
- základní bootstrap do Supabase: households, household_members, profiles
- lokální režim a JSON export zůstávají jako fallback

## Hotovo v Supabase
- tabulky `households`, `household_members`, `profiles`
- RLS zapnuté
- role owner/admin/member/read_only
- trigger updated_at

## Další krok
- doladit hardening helper funkcí/RLS policy
- připojit první modul, ideálně Nákupy nebo HDO
- připravit migraci offline dat do cloud tabulek
