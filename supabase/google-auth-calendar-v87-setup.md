# Domácnost+ v.0.1_94 — Google přihlášení + kalendář diagnostika

Tento build opravuje obecnou hlášku `Edge Function returned a non-2xx status code` při napojení kalendáře.

## Nutné nastavení v Google Cloud

OAuth client musí mít:

Authorized JavaScript origins:

```txt
https://domacnost-plus.vercel.app
```

Authorized redirect URIs:

```txt
https://cgshssdjgzzuprlwnabl.supabase.co/auth/v1/callback
https://cgshssdjgzzuprlwnabl.functions.supabase.co/google-calendar-callback
```

## Nutné nastavení v Supabase Auth

Authentication → Providers → Google:

- Enabled: zapnuto
- Client ID: Google OAuth Client ID
- Client Secret: Google OAuth Client Secret

Scopy musí obsahovat minimálně:

```txt
openid
email
profile
https://www.googleapis.com/auth/calendar.readonly
https://www.googleapis.com/auth/calendar.calendarlist.readonly
```

Po změně scopes je potřeba se z aplikace odhlásit a znovu přihlásit přes Google, ideálně s `prompt=consent`.

## Nutné Supabase Edge Function secrets

```txt
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_CALENDAR_REDIRECT_URI=https://cgshssdjgzzuprlwnabl.functions.supabase.co/google-calendar-callback
APP_PUBLIC_URL=https://domacnost-plus.vercel.app/
GOOGLE_TOKEN_ENCRYPTION_KEY_BASE64
```

## Test

1. Odhlásit se v aplikaci.
2. Přihlásit se přes Google.
3. Kalendář → Zdroje.
4. Napojit z Google přihlášení.
5. Když to selže, appka už má vypsat konkrétní chybu místo obecného non-2xx.
6. Pokud chybí token ze Supabase Auth, použít fallback OAuth kalendáře.
