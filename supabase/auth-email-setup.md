# Domácnost+ — nastavení Supabase Auth e-mailů

Aby potvrzovací e-mail po registraci nepadal na `localhost`, nastav v Supabase Dashboardu přesně tyto adresy:

## URL Configuration

Supabase → Authentication → URL Configuration

- **Site URL**: `https://domacnost-plus.vercel.app/`
- **Redirect URLs**:
  - `https://domacnost-plus.vercel.app/`
  - `https://domacnost-plus.vercel.app/?auth=confirmed`

## Confirmation e-mail template

Supabase → Authentication → Email Templates → Confirm signup

- **Subject**: `Potvrzení účtu Domácnost+`
- **Body**: vložit obsah souboru `email-confirmation-template-domacnost-plus.html`

Šablona používá logo z:

`https://domacnost-plus.vercel.app/apple-touch-icon.png`

Důležité: pokud se někdy změní doména aplikace, musí se změnit i `APP_PUBLIC_URL` v aplikaci, Redirect URLs v Supabase a URL loga v e-mailové šabloně.
