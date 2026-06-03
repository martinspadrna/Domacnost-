# Domácnost+ v.0.1_84 – Google Calendar backend setup

Tahle verze už má frontend UI, SQL migraci a Edge Function soubory pro bezpečné napojení Google Kalendáře. Reálné přihlášení začne fungovat až po doplnění Google Cloud credentials a nasazení funkcí.

## 1) Spusť SQL migraci

V Supabase SQL editoru spusť:

```sql
-- soubor: supabase/schema-v52-google-calendar.sql
```

Migrace přidá:

- `public.calendar_provider_connections` – metadata Google připojení bez tokenů,
- `app_private.calendar_provider_connection_secrets` – šifrované tokeny jen pro backend/service role,
- doplnění `calendar_sources` o vazbu na provider connection,
- doplnění `calendar_events` o `provider_event_id`, status a raw payload,
- `calendar_sync_runs` pro logování synchronizací.

## 2) Google Cloud Console

V Google Cloud Console vytvoř OAuth Client typu **Web application**.

Redirect URI nastav podle Supabase projektu:

```txt
https://cgshssdjgzzuprlwnabl.supabase.co/functions/v1/google-calendar-callback
```

Použité scopes:

```txt
openid
email
https://www.googleapis.com/auth/calendar.readonly
```

## 3) Supabase secrets

Vygeneruj 32bytový klíč pro šifrování tokenů:

```bash
openssl rand -base64 32
```

Potom nastav secrets:

```bash
supabase secrets set GOOGLE_CLIENT_ID="..."
supabase secrets set GOOGLE_CLIENT_SECRET="..."
supabase secrets set GOOGLE_CALENDAR_REDIRECT_URI="https://cgshssdjgzzuprlwnabl.supabase.co/functions/v1/google-calendar-callback"
supabase secrets set GOOGLE_TOKEN_ENCRYPTION_KEY_BASE64="výstup_z_openssl_rand_base64_32"
supabase secrets set APP_PUBLIC_URL="https://domacnost-plus.vercel.app/"
```

`SUPABASE_URL` a `SUPABASE_SERVICE_ROLE_KEY` musí být pro Edge Functions dostupné taky. Service role klíč nikdy nedávat do frontendu.

## 4) Deploy Edge Functions

```bash
supabase functions deploy google-calendar-start
supabase functions deploy google-calendar-list-calendars
supabase functions deploy google-calendar-save-sources
supabase functions deploy google-calendar-sync
supabase functions deploy google-calendar-disconnect
supabase functions deploy google-calendar-callback --no-verify-jwt
```

Callback musí být bez JWT ověření, protože na něj přesměrovává Google OAuth. Ostatní funkce mají běžet s přihlášeným Supabase uživatelem.

## 5) Flow v aplikaci

1. Přihlásit se do Domácnost+ online účtem.
2. Otevřít **Kalendář → Zdroje**.
3. Kliknout **Připojit Google kalendář**.
4. Po návratu kliknout / nechat načíst dostupné kalendáře.
5. Zaškrtnout kalendáře a uložit výběr.
6. Kliknout **Spustit sync**.

Každý vybraný Google kalendář vznikne jako samostatný `calendar_source`. Události se ukládají do `calendar_events` a deduplikují přes `source_id + provider_event_id`.
