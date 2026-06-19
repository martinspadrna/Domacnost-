# Analýza .app-shell a .app-shell.home-app-shell (Fáze A3)

Datum: 2026-06-19  
Větev: app-shell-cleanup  
Soubor: styles.css (18 042 řádků po A4)

---

## Metodika

Každý blok ověřen čtením souboru – žádné spoléhání na předchozí označení.  
Kontext = TOP-LEVEL znamená: na úrovni dokumentu, mimo jakýkoliv @media/@supports wrapper.

---

## Inventář všech bloků

### `.app-shell {}` – přímý selektor

| # | Řádek | Kontext | Vlastnosti |
|---|-------|---------|-----------|
| A1 | L96–99 | TOP-LEVEL (base) | `min-height: 100svh; padding: max(18px, safe-area) 16px calc(nav-height+safe-bottom+20px)` |
| A2 | L2313–2315 | TOP-LEVEL (v51) | `padding: max(12px, safe-area) 12px calc(nav-height+safe-bottom+12px)` – přepisuje A1 padding |
| A3 | L15040–15042 | TOP-LEVEL (v242) | `padding-bottom: calc(nav-height + max(20px, safe-bottom) + 18px) !important` – přepisuje padding-bottom |
| A4 | L16480 | @media (min-width:700px) and (max-width:1180px) – v278 | group `html, body, .app-shell { overflow-x: hidden }` |
| A5 | L16484–16488 | @media (min-width:700px) and (max-width:1180px) – v278 | `padding-left/right/bottom !important` – tablet layout |
| A6 | L17656–17659 | TOP-LEVEL (v281 oblast) | group `.app-shell, main { -webkit-overflow-scrolling: touch }` – GPU perf |

### `.app-shell.home-app-shell {}` – přímý selektor

| # | Řádek | Kontext | Vlastnosti |
|---|-------|---------|-----------|
| B1 | L11949–11954 | TOP-LEVEL (v159) | `height: 100svh !i; min-height: 100svh !i; overflow: hidden !i; padding: max(28px,safe+10px) 14px calc(nav+safe+18px) !i` |
| B2 | L13351–13355 | TOP-LEVEL (v217) | `height: var(--app-vh) !i; min-height: var(--app-vh) !i; padding-bottom: calc(nav+home-nav-reserve+6px) !i` |
| B3 | L13377–13380 | @media (max-width:420px) – v217 | `padding-bottom: calc(nav+home-nav-reserve+4px) !i` — FAKTICKY MRTVÝ (přepsán pozdějšími 720px bloky) |
| B4 | L16363–16367 | @media (max-width:720px) – v276 | group `.app-shell, .app-shell.home-app-shell, .app-frame { padding-bottom: calc(nav-v278+max(14px,safe)+12px) !i }` |
| B5 | L16718–16724 | TOP-LEVEL (v281) | `height: 100svh !i; max-height: 100svh !i; overflow: hidden !i; overscroll-behavior: none !i; padding-bottom: calc(nav+safe+12px) !i` |
| B6 | L17196–17199 | @media (max-width:720px) – intermediate fix | `padding-bottom: calc(nav-v278-shell-height+max(2px,safe-18px)+8px) !i` |
| B7 | L17684–17692 | TOP-LEVEL (v286 DEFINITIVE FIX) | `display: flex !i; flex-direction: column !i; height/min/max: 100svh !i; overflow: hidden !i; padding-bottom: var(--home-bottom-reserve) !i` |
| B8 | L17988–17997 | @media (max-width:720px) – v288b FINÁLNÍ MOBILNÍ | `display/flex-direction/h/min-h/max-h/overflow/padding-bottom` – full override pro mobil |

---

## Kaskádová analýza – efektivní hodnoty po propsání

### `.app-shell` – efektivní top-level (desktopový základ)

Vlastnost | Efektivní hodnota | Zdroj
---|---|---
`min-height` | `100svh` | A1 (nikdo nepřepisuje)
`padding-top` | `max(12px, env(safe-area-inset-top, 0px))` | A2 přepisuje A1
`padding-left/right` | `12px` | A2 přepisuje A1
`padding-bottom` | `calc(var(--nav-height) + max(20px, env(safe-area-inset-bottom, 0px)) + 18px) !important` | A3

### `.app-shell.home-app-shell` – efektivní top-level (základ platí kde neplatí @media)

Vlastnost | Efektivní hodnota | Zdroj
---|---|---
`display` | `flex !important` | B7
`flex-direction` | `column !important` | B7
`height` | `100svh !important` | B7 (B2 používal var(--app-vh), B7 vrací přímou hodnotu)
`min-height` | `100svh !important` | B7
`max-height` | `100svh !important` | B7 (přidáno v B5)
`overflow` | `hidden !important` | B7
`overscroll-behavior` | `none !important` | B5 — **B7 nepřepisuje, zůstává aktivní z B5**
`padding-top` | `max(28px, calc(env(safe-area-inset-top, 0px) + 10px)) !important` | B1 — **žádný pozdější blok nepřepisuje padding-top!**
`padding-left/right` | `14px !important` | B1 — **žádný pozdější blok nepřepisuje**
`padding-bottom` | `var(--home-bottom-reserve) !important` | B7

**Kritické: `overscroll-behavior: none` (B5) a `padding-top/left/right` (B1) musí být zahrnuty do sloučeného bloku!**

---

## Klasifikace bloků

### ČISTÉ TOP-LEVEL DUPLICITY → SLOUČIT

**Skupina A** – `.app-shell` top-level (A1 + A2 + A3 → 1 blok):
- A1 `min-height` + původní padding → plně přepsán A2+A3
- A2 přepisuje padding shorthand z A1
- A3 přepisuje padding-bottom s !important

**Skupina B** – `.app-shell.home-app-shell` top-level (B1 + B2 + B5 + B7 → 1 blok):
- B2 přepisuje height + min-height + padding-bottom z B1
- B5 přepisuje height + přidává max-height, overscroll-behavior, padding-bottom
- B7 je DEFINITIVE FIX – přepisuje vše kromě overscroll-behavior a padding-top/left/right

### PODMÍNĚNÉ OVERRIDY → NECHAT BEZ ZÁSAHU

- B3 `@media (max-width:420px)`: fakticky mrtvý, ale neškodný, ponechat
- B4 `@media (max-width:720px)` v276: aktivní mobilní padding-bottom
- A4+A5 `@media (min-width:700px) and (max-width:1180px)` v278: tabletový layout
- B6 `@media (max-width:720px)` intermediate: aktivní mobilní padding-bottom
- B8 `@media (max-width:720px)` v288b: FINÁLNÍ mobilní override

### MIMO SCOPE → NECHAT BEZ ZÁSAHU

- A6 group selector `.app-shell, main` (GPU perf – jedinečný, neslouít)
- Descendant bloky `.app-shell.home-app-shell .app-frame` atd. (v159/v217/v281/v286/v287/v288/v288b)

---

## Konsolidované bloky (Fáze 2)

### Skupina A – výsledný blok (umístit na pozici L15040, smazat L96 a L2313)

```css
.app-shell {
  min-height: 100svh;
  padding: max(12px, env(safe-area-inset-top, 0px)) 12px calc(var(--nav-height) + var(--safe-bottom) + 12px);
  padding-bottom: calc(var(--nav-height) + max(20px, env(safe-area-inset-bottom, 0px)) + 18px) !important;
}
```

### Skupina B – výsledný blok (umístit na pozici L17684, smazat L11949/L13351/L16718)

```css
.app-shell.home-app-shell {
  display: flex !important;
  flex-direction: column !important;
  height: 100svh !important;
  min-height: 100svh !important;
  max-height: 100svh !important;
  overflow: hidden !important;
  overscroll-behavior: none !important;
  padding: max(28px, calc(env(safe-area-inset-top, 0px) + 10px)) 14px var(--home-bottom-reserve) !important;
}
```

### Ověření kaskády po sloučení

**Mobil (≤720px) – padding-bottom finální cesta:**
1. ~~B1 (smazán)~~, ~~B2 (smazán)~~, ~~B5 (smazán)~~
2. B4 @media (max-width:720px): `calc(nav-v278-shell-height + max(14px,safe) + 12px) !i`
3. B7 konsolidovaný top-level: `var(--home-bottom-reserve) !i` (OVERRIDE – přichází po B4)
4. B6 @media (max-width:720px): `calc(nav-v278-shell-height + ... + 8px) !i` (OVERRIDE – přichází po B7? ANO: L17196 < L17684 → B7 overriduje B6? NE!)

**POZOR: L17196 < L17684** → @media blok B6 (L17196) přichází PŘED konsolidovaným B7 (L17684).  
Proto konsolidovaný B7 (top-level !important) OVERRIDUJE B6 (@media !important) na mobilních zařízeních.  
Ale stejně tak overridoval původní L17684 blok B6. **Chování se nemění.** ✓

5. B8 v288b @media (max-width:720px) L17988: FINÁLNÍ — přichází ПІСЛЯ B7 konsolidovaného (17988 > 17684). ✓

**Desktop (>1180px) – padding-bottom:**  
Konsolidovaný B7: `var(--home-bottom-reserve) !important` ✓

**Tablet (700–1180px) – padding-left/right/bottom pro `.app-shell` (ne .home-app-shell):**  
A5 @media (min-width:700px) and (max-width:1180px): má vyšší specificitu? Ne, jen stejnou. Ale `.app-shell.home-app-shell` má vyšší specificitu než `.app-shell`, takže A5 tablet blok neovlivní home shell. ✓

---

## Plán Fáze 2 (shrnutí)

| Akce | Řádky | Popis |
|------|-------|-------|
| SMAZAT | L96–99 | `.app-shell` base block |
| SMAZAT | L2313–2315 | `.app-shell` v51 block |
| NAHRADIT | L15040–15042 | konsolidovaný `.app-shell` blok (3 řádky → 4 řádky) |
| SMAZAT | L11949–11954 | `.app-shell.home-app-shell` v159 block |
| SMAZAT | L13351–13355 | `.app-shell.home-app-shell` v217 block |
| SMAZAT | L16718–16724 | `.app-shell.home-app-shell` v281 block |
| NAHRADIT | L17684–17692 | konsolidovaný `.app-shell.home-app-shell` blok (9 řádků → 10 řádků) |
