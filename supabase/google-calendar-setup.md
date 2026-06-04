# Domácnost+ v.0.1_86 — Google Calendar napojení

Tahle verze přidává ostrý backendový základ pro Google Calendar přes Supabase Edge Functions.

## Co už je připravené

- `calendar_provider_connections` — veřejná metadata připojení Google účtu.
- `app_private.calendar_provider_connection_secrets` — šifrované OAuth tokeny jen pro backend/service role.
- `calendar_sources.provider_connection_id` — vazba samostatných Google kalendářů na připojený účet.
- `calendar_events.provider_event_id` — deduplikace Google událostí přes `source_id + provider_event_id`.
- Edge Functions:
  - `google-calendar-start`
  - `google-calendar-callback`
  - `google-calendar-list-calendars`
  - `google-calendar-save-sources`
  - `google-calendar-sync`
  - `google-calendar-disconnect`

## Google Cloud Console

1. Otevři Google Cloud Console.
2. Vytvoř projekt pro Domácnost+ nebo použij existující.
3. Zapni API:
   - Google Calendar API
4. Nastav OAuth consent screen.
5. Vytvoř OAuth client:
   - Application type: Web application
6. Přidej Authorized redirect URI:

```txt
https://cgshssdjgzzuprlwnabl.functions.supabase.co/google-calendar-callback
```

7. Zkopíruj:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

## Supabase secrets

V Supabase nastav secrets:

```bash
supabase secrets set GOOGLE_CLIENT_ID="..." --project-ref cgshssdjgzzuprlwnabl
supabase secrets set GOOGLE_CLIENT_SECRET="..." --project-ref cgshssdjgzzuprlwnabl
supabase secrets set GOOGLE_CALENDAR_REDIRECT_URI="https://cgshssdjgzzuprlwnabl.functions.supabase.co/google-calendar-callback" --project-ref cgshssdjgzzuprlwnabl
supabase secrets set APP_PUBLIC_URL="https://domacnost-plus.vercel.app/" --project-ref cgshssdjgzzuprlwnabl
```

Vygeneruj 32 bajtový šifrovací klíč pro AES-GCM:

```bash
openssl rand -base64 32
```

A ulož ho:

```bash
supabase secrets set GOOGLE_TOKEN_ENCRYPTION_KEY_BASE64="VYSTUP_Z_OPENSSL" --project-ref cgshssdjgzzuprlwnabl
```

`SUPABASE_SERVICE_ROLE_KEY` a `SUPABASE_URL` jsou dostupné Edge Functions automaticky podle prostředí Supabase.

## Jak to bude fungovat v aplikaci

1. Kalendář → Zdroje.
2. Kliknout na Připojit Google kalendář.
3. Google OAuth souhlas.
4. Návrat do aplikace.
5. Načíst dostupné kalendáře.
6. Zaškrtnout vybrané kalendáře.
7. Uložit zdroje.
8. Spustit sync.

Každý Google kalendář se ukládá jako samostatný `calendar_source`.
Události se ukládají do `calendar_events`.
Tokeny se nikdy neukládají do frontendu.

## Poznámky

- Callback funkce má `verify_jwt=false`, protože ji volá Google. Bezpečnost hlídá OAuth `state` uložený v DB.
- Ostatní Google funkce mají `verify_jwt=true`.
- První sync bere události od 30 dnů zpět do 365 dnů dopředu.
- Smazané Google události se ukládají jako `status='cancelled'`, nemažou se bezhlavě.

## Domácnost+ v.0.1_86 — jednodušší cesta přes Google login

Od v0.1_86 je preferovaný postup přihlášení přes Supabase Auth Google provider. Uživatel klikne v aplikaci na `Pokračovat přes Google`, Supabase vytvoří relaci a aplikace se pokusí stejný Google token použít pro napojení kalendáře přes Edge Function `google-calendar-link-auth-session`.

V Google OAuth clientovi proto musí být nově také Supabase Auth callback:

```txt
https://cgshssdjgzzuprlwnabl.supabase.co/auth/v1/callback
```

A JavaScript origin:

```txt
https://domacnost-plus.vercel.app
```

Původní callback pro fallback kalendářového OAuth nech ponechaný:

```txt
https://cgshssdjgzzuprlwnabl.functions.supabase.co/google-calendar-callback
```
