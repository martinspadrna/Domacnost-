# Analýza mrtvého kódu – styles.css (fáze A4)

> Větev: `dead-code-cleanup`  
> Soubor: `styles.css` (18 507 řádků)  
> Datum: 2026-06-19  
> Metodika: Pro každý kandidát ověřen (1) přesný kontext v souboru, (2) co ho přepisuje a kde, (3) grep tříd v app.js

---

## Kontext: kaskáda navigace na různých viewportech

Aktivní nav bloky (ty, které v kaskádě opravdu platí):
- **Mobil / tablet** (`max-width: 720px` / `700–1180px`): **v278 @media bloky** — definují kompletní nav, přepisují vše starší
- **Desktop** (`> 1180px`): **top-level bloky** — platí poslední top-level deklarace pro každou vlastnost:
  - `.nav-shell`: v242 top-level (L15490) + v278 top-level (~L17323, přebíjí bottom/transform/position z v242)
  - `.nav-scroll`, `.nav-item`, `.nav-item.active`: **poslední top-level blok** = v159 (L12163–L12206)
  - `.nav-active-runner`: v220 top-level (~L13722) + v278 top-level (`pointer-events:none`)

---

## ⛔ JISTĚ MRTVÉ

Přepsáno na VŠECH viewportech. Třídy jsou v JS živé, ale tyto konkrétní bloky nemají žádný efekt.

---

### A. v96 nav fragmenty — top-level, 4 bloky

> Kontext: TOP-LEVEL (bez @media)

| Blok | Řádky | Selektor / vlastnosti |
|---|---|---|
| v96-a | L5221–5237 | `.app-shell { padding-bottom }` + `.nav-shell { position, left, bottom:var(--nav-fixed-gap), width, transform, will-change, contain }` |
| v96-b | L5239–5243 | `@media (max-width:420px) { .nav-shell { width } }` |
| v96-c | L5251–5258 | `.app-shell { padding-bottom }` + `.nav-shell { bottom:var(--nav-fixed-gap) }` |
| v96-d | L5298–5305 | `.app-shell { padding-bottom }` + `.nav-shell { bottom:var(--nav-fixed-gap) }` |

**Přepsáno:** v242 top-level (L15490) přepisuje VŠECHNY vlastnosti `.nav-shell` z v96 pomocí `!important`.  
**Varování při mazání:** mezi bloky v96-a a v96-c jsou na L5260–5296 bloky `.overview-backdrop` a `.overview-panel` — ty **NESMÍME smazat**, patří jiné části UI.  
**JS grep:** `.app-shell` — přiřazena dynamicky; `.nav-shell` — přiřazena jako statická třída.

---

### B. v149 nav fragmenty — top-level (L11301–11323)

> Kontext: TOP-LEVEL (bez @media), blok uveden komentářem `/* Domácnost+ v0.1_149 */`

| Řádky | Selektor / vlastnosti |
|---|---|
| L11302–11310 | `.mini-module-icon-nav`, `.nav-item .nav-icon.mini-module-icon` — icon sizes (32 px) |
| L11312–11315 | `.nav-item { min-height:62px, gap:4px }` |
| L11317–11319 | `.nav-item span:last-child { font-size:.82rem }` |
| L11321–11323 | `.nav-shell { padding:9px 8px 10px }` |

**Přepsáno proč JISTĚ:**
- L11312–11315 `.nav-item { min-height:62px }`: přepsáno v159 top-level (L12175, `min-height:58px !important`)
- L11317–11319 `.nav-item span:last-child`: přepsáno v159 top-level (L12188–12190, `display:none !important` pro active; nenásleduje explicitní font-size, ale v278 @media pokryje mobil)
- L11321–11323 `.nav-shell { padding }`: přepsáno v159 top-level (L12163, `padding:8px !important`) a pak v242
- **L11302–11310 icon sizes** → přesunuto do **PODMÍNĚNÉ** (na desktopu nejsou v158/v242/v278 top-level přepsány)

**JS grep:** `.mini-module-icon-nav`, `.mini-module-icon` — třídy živé v JS (šablony).

---

### C. v217 nav fragment — top-level (L13402–13405)

> Kontext: TOP-LEVEL, uveden komentářem `/* Domácnost+ v.0.1_217 */`

```
.nav-shell {
  bottom: var(--nav-bottom-lock);    /* 0px, definováno v konsolidovaném :root */
  transform: translate3d(-50%, 0, 0);
}
```

**Přepsáno:** v242 top-level (L15490): `bottom: 0 !important` a `transform: translate3d(-50%,0,0) !important`.  
**Proměnná `--nav-bottom-lock`:** viz sekce Osiřelé proměnné.

---

### D. v218 @media nav bloky (~L13440–13474)

> Kontext: `@media (max-width:720px)` a `@supports (-webkit-touch-callout:none) { @media (max-width:720px) }`

Bloky definují `.nav-shell { position, bottom, width, padding, … }` pro mobil.

**Přepsáno:** v278 obsahuje stejné media query (`max-width:720px`) a přichází v souboru **JAKO POSLEDNÍ** → přepisuje v218 na mobilu. Na desktopu podmínka media neplatí vůbec.

---

### E. v220 @media + @supports nav bloky (~L13629–13716)

> Kontext: `@media (max-width:720px)` a `@supports (-webkit-touch-callout:none) { @media }`

Nav-shell/scroll bloky. Přepsány v278 @media na mobilu, neplatí na desktopu.

**Pozor:** v220 má TAKÉ TOP-LEVEL bloky (~L13722–13769) pro `.nav-active-runner` animaci — ty jsou **ŽIVÉ** a do tohoto seznamu **NEPATŘÍ** (viz PODMÍNĚNÉ sekce).

---

### F. v221 @media + @supports nav bloky (~L13780–13861)

> Kontext: Mix `@media (max-width:720px)`, `@supports + @media`, a `:root` block pro `--home-compact-head-offset`

Nav-shell, nav-scroll, home-page-head výšky. Přepsány v278 @media na mobilu, neplatí na desktopu.

Zahrnuje `:root { --home-compact-head-offset: … }` na ~L13777 — viz Osiřelé proměnné.

---

### G. v225 @media nav bloky (~L14123–14308)

> Kontext: `@media (max-width:720px)` a `@supports + @media` bloky

Definuje nav-shell padding/bottom, nav-scroll sizes, nav-item sizes — vše přepsáno v278 @media.

Zahrnuje `:root { --nav-bottom-lock: -14px }` uvnitř @media — viz Osiřelé proměnné.

**Pozor:** v225 má TAKÉ TOP-LEVEL bloky (~L14310–14331) pro animační stavový stroj (`.nav-runner-ready`, `.nav-is-moving`) — ty jsou **ŽIVÉ** a nepatří sem (viz PODMÍNĚNÉ).

---

### H. Osiřelé CSS proměnné v :root

Proměnné definované v konsolidovaném `:root` bloku, ale všechna jejich **použití** (consumptions) jsou v dead blocích.

| Proměnná | Definice | Použití | Proč mrtvá |
|---|---|---|---|
| `--nav-fixed-gap` | L13877 (konsolidovaný :root) | L5230, L5257, L5304 — dead v96 `.nav-shell { bottom }` bloky | Vše v sekci A výše |
| `--nav-bottom-lock` | L13878 (konsolidovaný :root, `0px`) | L13402 — dead v217 `.nav-shell { bottom }`, dále jen jako SET v dead @media blocích | Žádné živé použití |
| `--home-compact-head-offset` | ~L13777 (v dead v221 `:root` bloku) | ~L13802 — uvnitř dead v221 @media bloku | Proměnná i použití jsou v dead kódu |

**Není mrtvá:** `--home-compact-height` (L13878 konsolidovaný :root) — použita na ~L13900 v **ŽIVÉM** `@media (max-width:390px)` bloku. Nesmazat.

---

## ⚠️ PODMÍNĚNÉ

Bloky dead na mobilu/tabletu (v278 @media přepisuje), ale **možná živé na desktopu > 1180px** kde platí jen top-level kaskáda. Před smazáním ověřit chování na desktopu.

---

### P1. v149 icon sizes — top-level (L11302–11310)

> Kontext: TOP-LEVEL

`.nav-item .nav-icon.mini-module-icon { width:32px, height:32px }` apod.

**Situace:** v278 top-level nepokrývá icon sizes. v242 top-level nepokrývá icon sizes. Na desktopu > 1180px tyto velikosti **platí** jako poslední top-level definice pro default stav ikony.  
**Riziko mazání:** na desktopu ikony ztratí explicitní rozměry, zdědí co přijde dříve v kaskádě.

---

### P2. v159 nav bloky — top-level (L12163–12206)

> Kontext: TOP-LEVEL (bez @media), blok uveden komentářem `/* Domácnost+ v0.1_159... */`  
> ⚠️ Minulá chyba: L12181 byl v ANALYZA_NAV.md chybně označen jako [M:760] — je TOP-LEVEL

| Řádky | Selektor / vlastnosti | Desktop stav |
|---|---|---|
| L12163–12167 | `.nav-shell { border-radius:30px, padding:8px, overflow:hidden }` | `padding` přepsáno v242 (!important); `border-radius` a `overflow` v242 nemá → **živé** |
| L12169–12173 | `.nav-scroll { position:relative, gap:6px, align-items:center }` | v242 a v278 top-level nepokrývají → **živé** |
| L12175–12179 | `.nav-item { min-height:58px, border-radius:22px, transition }` | v242 a v278 top-level nepokrývají .nav-item → **živé** |
| L12181–12186 | `.nav-item.active { color:#fff, background:gradient-blue, box-shadow, transform }` | Na desktopu aktivní položka zobrazuje **modrý gradient**; v278 @media resets na transparent na mobilu |
| L12188–12201 | `.nav-item.active > span:last-child { display:none }` + icon 46px pro active stav | **živé** na desktopu |
| L12203–12206 | `.nav-item:not(.active) { background:transparent, box-shadow:none }` | **živé** na desktopu |

**Riziko mazání:** smazání L12175–12206 změní vizuální styl aktivní položky na desktopu (z modrého gradientu na skleněný efekt z L339).  
**JS grep:** `.active` přiřazena v app.js L2625.

---

### P3. v234 nav bloky — top-level (L14895–14935)

> Kontext: TOP-LEVEL (bez @media), uveden komentářem `/* Domácnost+ v0.1_239... */`  
> Tento blok byl záměrně ZACHOVÁN v Phase 5 jako "potřebný pro desktop"

Blok definuje: `:root` proměnné `--nav-visual-height-v234` (76px) / `--nav-inner-height-v234` (62px) / `--nav-bottom-gap-v234`, dále `body { padding-bottom }`, `.nav-shell { position, left, right, bottom, **width, height, min-height, max-height**, transform, transform-origin, overflow }`, `.nav-scroll { height }`, `.nav-item { height }`, `.app-frame { padding-bottom }`.

**Co v242 přepisuje:** position, left, right, bottom, width, max-width, margin, padding, transform, will-change, contain, overscroll-behavior (vše `!important`).  
**Co v242 NEPŘEPISUJE:** `height`, `min-height`, `max-height`, `transform-origin`, `overflow` pro `.nav-shell`.  

Na desktopu > 1180px platí `.nav-shell { height:76px }` právě z tohoto bloku. Smazání by odstraňilo výšku nav-shell na desktopu.  
**Rozhodnutí:** ověřit, zda desktop > 1180px je reálný use-case; teprve pak rozhodnout o smazání.

---

### P4. v242 top-level `.nav-shell` (L15490–15504)

> Kontext: TOP-LEVEL  
> Komentář: `/* Domácnost+ v.0.1_242 – spodní lišta zamknutá k viewportu při scrollu */`

```css
.nav-shell {
  position: fixed !important;
  left: 50% !important;     /* v278 top-level to taky má → přepsáno */
  right: auto !important;
  bottom: 0 !important;     /* v278 top-level přepisuje na calc(safe-area) */
  width: min(620px, calc(100vw - 16px)) !important;   /* v278 top-level NEMÁ */
  max-width: calc(100vw - 16px) !important;            /* v278 top-level NEMÁ */
  margin: 0 !important;
  padding: 8px 8px max(8px, env(safe-area-inset-bottom, 0px)) !important; /* v278 top-level NEMÁ */
  transform: translate3d(-50%, 0, 0) !important;       /* v278 top-level přepisuje */
  -webkit-transform: translate3d(-50%, 0, 0) !important;
  will-change: transform !important;                   /* v278 top-level přepisuje */
  contain: layout paint style !important;              /* v278 top-level NEMÁ */
  overscroll-behavior: none !important;               /* v278 top-level NEMÁ */
}
```

**Přepsáno v278:** `position`, `left`, `bottom`, `transform`, `will-change`  
**Stále platí na desktopu (v278 top-level nemá):** `width`, `max-width`, `margin`, `padding`, `contain`, `overscroll-behavior`  
Na tablet (700–1180px): v278 @media přepisuje vše.  
**Smazání:** odstraní `width:min(620px,...)` a `padding` z desktop nav → nav se roztáhne na 100% šířku.

---

### P5. v220 top-level animační bloky (~L13722–13769)

> Kontext: TOP-LEVEL

Definují **vizuální podobu** `.nav-active-runner` (gradient, rozměry, pozice) a `.nav-item { position:relative, z-index:1 }` jako základ pro animaci.

**Nejsou dead:** tyto vlastnosti nejsou přepsány žádným pozdějším top-level blokem (v278 top-level přidá jen `pointer-events:none`). Runner gradient a size pochází odtud.  
**JS grep:** `.nav-runner-ready`, `.nav-is-moving` — aktivně přiřazovány v app.js L2721–2741.

---

### P6. v225 top-level stavový stroj animace (~L14310–14331)

> Kontext: TOP-LEVEL

Bloky pro `.nav-shell.nav-is-moving .nav-active-runner`, `.nav-shell.nav-runner-ready .nav-active-runner` — definují transition a transform stavy animace.

**Nejsou dead:** JS je používá aktivně. Před mazáním nutno ověřit, zda v278 @media bloky tyto stavy kompletně překryly.

---

## ❓ NEJASNÉ

---

### N1. v232 @media home-hero bloky

Část v232 bloků zůstala v souboru po Phase 5 (byly zachovány home-page pravidla). Řádky přesně neurčeny (Phase 5 provedl selektivní mazání). Obsahují `home-hero` výšky (`clamp(505px, …)`).

**Nejasné:** novější home-page bloky tyto výšky mohou přepisovat, ale plný přehled vyžaduje samostatnou analýzu home-hero kaskády.

---

### N2. v232 station-summary-count grid pravidla

`@media` blok s `.station-summary-count-X` grid pravidly. Nenalezeno jednoznačné pozdější přepsání. Možná živé, možná přepsáno v288+ blocích. Vyžaduje hlubší analýzu.

---

## Doporučený postup mazání

1. **Nejprve smazat JISTĚ MRTVÉ** — sekce A (v96, s ohledem na non-nav bloky L5260–5296), C (v217), D–G (@media v218–v225), H (osiřelé :root proměnné)
2. **Sekce B** (v149): smazat jen L11312–11315 a L11321–11323; L11302–11310 přesunout do PODMÍNĚNÉ ověřování
3. **PODMÍNĚNÉ (P2–P4):** rozhodnout po dohodě — závisí na tom, jestli je desktop > 1180px reálný use-case
4. **PODMÍNĚNÉ (P5, P6):** NESMAZAT bez hlubší analýzy animačního stavového stroje
5. **NEJASNÉ:** nechat být, vyřešit v samostatném passé

---

*Všechny řádky s `~L` jsou přibližné (±5 řádků) — ověřit před mazáním přečtením souboru.*
