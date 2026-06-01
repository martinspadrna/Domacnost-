# Domácnost+ — nastavení Supabase Auth e-mailů

Tahle část se nastavuje v Supabase Dashboardu, ne SQL migrací. Aplikace už posílá správný redirect na produkční adresu.

## 1) URL Configuration

Supabase → Authentication → URL Configuration

- **Site URL**: `https://domacnost-plus.vercel.app/`
- **Redirect URLs**:
  - `https://domacnost-plus.vercel.app/`
  - `https://domacnost-plus.vercel.app/?auth=confirmed`

## 2) Confirm signup e-mail

Supabase → Authentication → Email Templates → Confirm signup

- **Subject**: `Potvrzení účtu Domácnost+`
- **Body**: zkopírovat celý obsah souboru:

`supabase/email-confirmation-template-domacnost-plus.html`

Šablona obsahuje logo aplikace z:

`https://domacnost-plus.vercel.app/apple-touch-icon.png`

## 3) Kontrola

Po uložení spusť novou registraci přes produkční adresu:

`https://domacnost-plus.vercel.app/`

Potvrzovací tlačítko v e-mailu má vést na:

`https://domacnost-plus.vercel.app/?auth=confirmed`

Pokud se objeví `localhost`, je pořád špatně nastavená **Site URL** nebo starý e-mail vznikl před uložením změny.
