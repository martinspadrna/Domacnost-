# Domácnost+ v.0.1_86 — Google přihlášení + Kalendář

Tahle verze přidává jednodušší cestu: uživatel se přihlásí přes Google a aplikace se pokusí stejný Google účet použít i pro Google Kalendář.

## 1) Google Cloud OAuth client

V Google Cloud Console musí u stejného OAuth clienta být:

### Authorized JavaScript origins

```txt
https://domacnost-plus.vercel.app
```

### Authorized redirect URIs

Pro Supabase Auth Google login:

```txt
https://cgshssdjgzzuprlwnabl.supabase.co/auth/v1/callback
```

Fallback starší kalendářový OAuth nech klidně také:

```txt
https://cgshssdjgzzuprlwnabl.functions.supabase.co/google-calendar-callback
```

## 2) Supabase Auth provider

V Supabase Dashboard:

```txt
Authentication → Providers → Google
```

Zapnout Google provider a vložit:

```txt
Client ID
Client secret
```

Site URL:

```txt
https://domacnost-plus.vercel.app
```

Redirect URLs / Additional redirect URLs:

```txt
https://domacnost-plus.vercel.app/**
https://domacnost-plus.vercel.app/?auth=google
```

## 3) Scopes

Google Auth musí povolit minimálně:

```txt
openid
email
profile
https://www.googleapis.com/auth/calendar.readonly
```

Poznámka: calendar scope může v testovacím režimu vyžadovat, aby byl uživatel přidaný v Google Cloud jako Test user.

## 4) Supabase Edge Function secrets

Tyhle secrets už používají kalendářové backend funkce:

```txt
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_CALENDAR_REDIRECT_URI=https://cgshssdjgzzuprlwnabl.functions.supabase.co/google-calendar-callback
APP_PUBLIC_URL=https://domacnost-plus.vercel.app/
GOOGLE_TOKEN_ENCRYPTION_KEY_BASE64
```

## 5) Test v aplikaci

1. Otevřít Domácnost+.
2. Kliknout `Pokračovat přes Google`.
3. Přihlásit Google účet a povolit čtení kalendáře.
4. Po návratu appka otevře `Kalendář → Zdroje`.
5. Kliknout `Napojit z Google přihlášení`, případně se to napojí samo po návratu.
6. Kliknout `Načíst kalendáře`.
7. Vybrat kalendáře a uložit.
8. Spustit sync.

## Fallback

Pokud Google přihlášení nedá aplikaci kalendářový token, zůstává tlačítko `Fallback OAuth kalendář`, které používá původní vlastní Edge Function flow.
