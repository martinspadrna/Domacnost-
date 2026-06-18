# Analýza navigačních CSS selektorů

> Soubor: `styles.css` (18 951 řádků po konsolidaci :root)  
> Větev: `nav-cleanup`  
> Datum: 2026-06-19

---

## Metodika a poznámka k počtům

Původní odhad (35×, 15×, 11×, 18×) počítal přesné shody selektoru.
Detailní parser zachytil i **složené selektory**, které daný řetězec obsahují:
`.nav-item.active`, `.nav-item:active`, `.nav-item .nav-icon`, `.nav-shell::before` atd.

Skutečné počty bloků:

| Selektor | Odhadovaný | Nalezený (vč. složených) |
|---|---|---|
| `.nav-shell` | 35× | **42×** |
| `.nav-scroll` | 18× | **33×** |
| `.nav-item` | 15× | **70×** (většina jsou složené selektory) |
| `.nav-item.active` | 11× | **21×** (vč. `.nav-item.active .nav-icon` apod.) |

Analýza níže rozlišuje:
- **[TL]** = top-level (bez @media/@supports)
- **[M:760]** = `@media (max-width: 760px)`
- **[M:720]** = `@media (max-width: 720px)` (nested uvnitř M:760)
- **[M:XXX]** = jiná media podmínka
- **[S:ios]** = `@supports (-webkit-touch-callout: none)`

---

## 1. `.nav-shell`

### Celkový přehled

Navigační lišta prošla **~10 kompletními přepisy layoutu** přidanými jako nové @media bloky
bez odstranění předchozích. Výsledkem jsou blokové série v `@media (max-width: 720px)`, kde každá
nová verze přepisuje `position`, `bottom`, `height`, `width`, `transform` — starší jsou **mrtvý kód**.

### Výskyty

#### Top-level (1×)

| Řádek | Kontext | Vlastnosti |
|---|---|---|
| **L281** | **[TL]** | `position: fixed`, `right: 12px`, `left: 12px`, `bottom: calc(10px + var(--safe-bottom))`, `z-index: 30`, `width: min(620px, calc(100% - 24px))`, `margin: 0 auto`, `padding: 8px`, `border`, `border-radius: 26px`, `background`, `box-shadow`, `backdrop-filter` |

→ **Toto je jediný top-level blok.** Definuje desktopový layout. Bezpečný, nepotřebuje sloučení.

#### @media bloky — iOS glass efekty (L4xxx)

| Řádek | Kontext | Vlastnosti | Stav |
|---|---|---|---|
| L4309 | [M:760] | `position: absolute`, `inset: 0`, pseudo-element glass overlay | Živý — styling |
| L4319 | [M:760] | `position: relative`, `z-index: 1` | Živý — glass vrstva |
| L4340 | [M:760] | `border-radius: 30px`, `background: color-mix(ios-glass)` | Živý — iOS vzhled |
| L4385 | [M:760 > M:560] | `border-radius: 28px` | Živý — malé displeje |

#### @media bloky — historické přepisy pozice lišty (mrtvý kód) ⚠️

Toto je nejkritičtější sekce. Série bloků v `[M:760]` nebo `[M:720]` definují `position`, `bottom`,
`height`, `width`. **Každý přepsal předchozí — starší jsou mrtvé.**

| Řádek | Kontext | Klíčové vlastnosti | Verze | Stav |
|---|---|---|---|---|
| L5226 | [M:760] | `position: fixed !important`, `left: 50%`, `bottom: var(--nav-fixed-gap)`, `transform: translate3d(-50%, 0, 0)` | v.96 | **MRTVÝ** — přepsán L17767 |
| L5256 | [M:760] | `bottom: var(--nav-fixed-gap) !important` | v.96b | **MRTVÝ** |
| L5303 | [M:760] | `bottom: var(--nav-fixed-gap) !important` | v.96c | **MRTVÝ** |
| L5640 | [M:760] | `bottom: calc(max(8px, env(safe-area)) + 4px)`, `transform: translate3d(0,0,0)` | starší | **MRTVÝ** ⚠️ |
| L11321 | [M:760] | `padding: 9px 8px 10px !important` | v.157 | **MRTVÝ** |
| L12163 | [M:760] | `border-radius: 30px !important`, `padding: 8px !important`, `overflow: hidden !important` | v.163 | **MRTVÝ** |
| L12536 | [M:760] | `position: relative`, `z-index: 1` | — | **MRTVÝ** |
| L13402 | [M:760] | `bottom: var(--nav-bottom-lock) !important`, `transform: translate3d(-50%, 0, 0) !important` | v.217 | **MRTVÝ** |
| L13441 | [M:720] | `bottom: var(--nav-bottom-lock) !important`, `transform` | v.217 | **MRTVÝ** |
| L13629 | [M:720] | `bottom: var(--nav-bottom-lock) !important`, `transform`, `max-height: calc(100svh - 12px)` | v.220 | **MRTVÝ** |
| L13661 | [M:720 > S:ios] | `bottom: var(--nav-bottom-lock) !important`, `transform` | v.220 | **MRTVÝ** |
| L13688 | [M:720] | `bottom: var(--nav-bottom-lock) !important`, `transform`, `will-change: transform` | v.220b | **MRTVÝ** |
| L13781 | [M:720] | `bottom: var(--nav-bottom-lock) !important`, `transform`, `max-height: none !important` | v.221 | **MRTVÝ** |
| L14124 | [M:720] | `bottom: var(--nav-bottom-lock) !important`, `height: 88px !important`, `min/max-height: 88px` | v.225 | **MRTVÝ** |
| L14234 | [M:720] | `bottom: 0 !important`, `height: calc(82px + env(safe-area))`, `overflow: visible !important` | v.225b | **MRTVÝ** ⚠️ |
| L14408 | [M:720] | `bottom: var(--nav-bottom-gap-v226) !important`, `height: var(--nav-visual-height-v226)` | **v.226** | **MRTVÝ** |
| L14649 | [M:720] | `bottom: var(--nav-bottom-gap-v230) !important`, `height: var(--nav-visual-height-v230)` | **v.230** | **MRTVÝ** |
| L14859 | [M:720] | `bottom: var(--nav-bottom-gap-v232) !important`, `height: var(--nav-visual-height-v232)` | **v.232** | **MRTVÝ** |
| L15126 | [M:760] | `bottom: var(--nav-bottom-gap-v234) !important`, `height: var(--nav-visual-height-v234)` | **v.234** | **MRTVÝ** |
| L15710 | [M:760] | `bottom: 0 !important`, `height: calc(82px + env(safe-area))`, `overflow-scrolling`, `overscroll-behavior: none` | v.255+ | **MRTVÝ** ⚠️ |
| L15731 | [M:760 > S:ios] | `bottom: 0 !important` | v.255+ iOS | **MRTVÝ** |
| L15973 | [M:720] | `bottom: var(--nav-bottom-gap-v246) !important`, `height: var(--nav-visual-height-v246)` | **v.246** | **MRTVÝ** |
| L16281 | [M:720] | `bottom: 0 !important`, `height: var(--nav-visual-height-v251)` | **v.251** | **MRTVÝ** |
| L16337 | [M:720] | `bottom: var(--nav-compact-bottom-v252) !important`, `height: var(--nav-compact-height-v252)` | **v.252** | **MRTVÝ** |

#### @media bloky — AKTUÁLNĚ PLATNÁ definice (v.278) ✅

Posledním kompletním přepisem je v.278. Tyto bloky **platí** a nesmí být smazány:

| Řádek | Kontext | Klíčové vlastnosti |
|---|---|---|
| **L17279** | [M:720] | `bottom: var(--nav-v278-bottom-gap) !important`, `height: var(--nav-v278-shell-height)`, `width: min(620px, calc(100dvw - 22px))`, `padding: 8px`, `border: 1px solid rgba(...)`, `border-radius: 28px`, `transform: translate3d(-50%, 0, 0)` |
| **L17299** | [M:720] | `inset: 0 !important`, `border-radius: inherit !important` (pseudo-element) |
| **L17460** | [M:700-1180] | Tabletový layout: `height: var(--nav-v278-shell-height)`, `bottom: max(8px, ...)`, `width: min(720px, ...)` |
| **L17767** | [M:760] | `position: fixed !important`, `bottom: max(6px, env(safe-area-inset-bottom))`, `z-index: 80`, `overscroll-behavior: contain`, `will-change: transform` |
| **L17789** | [M:720] | `width: calc(100dvw - 32px)`, `height: 82px`, `border-radius: 28px` |
| **L18099** | [M:720] | `bottom: max(2px, calc(env(safe-area-inset-bottom) - 18px)) !important` |
| **L18575** | [M:760] | `contain: paint` |

> ⚠️ **POZOR na `bottom`:** I v platných blocích jsou DVA různé výrazy pro `bottom`:
> - L17767: `max(6px, env(safe-area-inset-bottom, 0px))` (M:760, obecný)
> - L18099: `max(2px, calc(env(safe-area-inset-bottom, 0px) - 18px))` (M:720, přesnější)
> Oba platí (720 je subset 760 a přepíše). Toto **není** duplicita — jsou to dvě různé podmínky.

### Shrnutí `.nav-shell`

- **1 top-level blok** → bezpečný, nepotřebuje sloučení
- **~24 mrtvých @media bloků** (přepsáno v.278) → kandidáti na smazání, ale RIZIKOVÉ
- **7 živých @media bloků** (v.278 + utility) → nesahat
- **Riziko při mazání:** bloky mají různé `bottom` hodnoty a `overflow` vlastnosti; před smazáním ověřit, že žádný z nich není podmíněn JS třídou nebo specifickým stavem, který moderní verze neřeší

---

## 2. `.nav-scroll`

Vnitřní flex kontejner navigační lišty (drží `.nav-item` vedle sebe).

### Výskyty

#### Top-level (2×)

| Řádek | Kontext | Vlastnosti | Poznámka |
|---|---|---|---|
| **L298** | **[TL]** | `display: flex`, `gap: 6px`, `overflow: visible` | Aktivní scroll — hlavní definice |
| **L304** | **[TL]** | `display: none` | Pravděpodobně `.nav-scroll.hidden` nebo alternativní selektor — ověřit! |

> ⚠️ **Dva top-level bloky pro `.nav-scroll`** — pokud jsou oba přesně `.nav-scroll { }`,
> L304 (`display: none`) přepisuje L298 a scroll by byl vždy skrytý. Pravděpodobně je L304
> `.nav-scroll.collapsed` nebo podobný složený selektor. **Před sloučením ověřit přesný text.**

#### @media bloky — historické přepisy výšky (mrtvý kód)

Stejný vzor jako u `.nav-shell` — každá verze přepsala `height`, `min-height`, `max-height`:

| Řádek | Kontext | Klíčové vlastnosti | Verze | Stav |
|---|---|---|---|---|
| L5647 | [M:760] | `overscroll-behavior-x: contain`, `transform: translate3d(0,0,0)` | v.96 | Živý — scroll chování |
| L12169 | [M:760] | `position: relative !important`, `gap: 6px`, `align-items: center` | v.163 | **MRTVÝ?** |
| L13718 | [M:760] | `isolation: isolate !important` | v.220 | Živý — stacking context |
| L13751 | [M:760] | `color: rgba(238, 244, 255, .96) !important` | v.220 | Živý — barva textu |
| L13757 | [M:760] | `transform: translateY(-2px) scale(1.12)`, `filter` | v.220 | Aktivní stav — živý |
| L14135 | [M:720] | `height: 100%`, `min-height: 0`, `align-items: stretch` | v.225 | **MRTVÝ** |
| L14244 | [M:720] | `height: 74px`, `min-height: 74px`, `max-height: 74px`, `overflow: visible` | v.225b | **MRTVÝ** |
| L14318/14319 | [M:760] | (prázdné nebo micro-úpravy) | — | Ověřit |
| L14322 | [M:760] | `transition: none !important` | — | Živý — animace off |
| L14328 | [M:760] | `transform: scale(1.12) translateY(-2px) !important` | — | Aktivní stav |
| L14424 | [M:720] | `height: var(--nav-inner-height-v226)`, `align-items: stretch`, `overflow: hidden` | **v.226** | **MRTVÝ** |
| L14468 | [M:720] | `opacity: 1`, `transition: none` | v.226 | **MRTVÝ** |
| L14475 | [M:720] | `transform: scale(1.1) translateY(-1px)`, `transition: ...` | v.226 | **MRTVÝ** |
| L14666 | [M:720] | `height: var(--nav-inner-height-v230)`, `overflow: hidden` | **v.230** | **MRTVÝ** |
| L14794 | [M:760] | `min-height: 50px`, `padding-inline: 4px`, `font-size: .68rem` | v.232 | **MRTVÝ?** |
| L14802 | [M:760] | `transform-origin: center` | — | Ověřit |
| L14807 | [M:380] | `font-size: .62rem` | — | Živý — malé displeje |
| L14816 | [M:760] | `transform: none !important` | — | Živý — reset |
| L14877 | [M:720] | `height: var(--nav-inner-height-v232)`, `scroll-behavior: auto` | **v.232** | **MRTVÝ** |
| L14900 | [M:720] | `opacity: 1`, `transition: none` | v.232 | **MRTVÝ** |
| L14907 | [M:720] | `transform: scale(1.08) translateY(-1px)`, `transition` | v.232 | **MRTVÝ** |
| L15140 | [M:760] | `height: var(--nav-inner-height-v234)`, `overflow: hidden` | **v.234** | **MRTVÝ** |
| L15994 | [M:720] | `height: var(--nav-inner-height-v246)`, `overflow: hidden` | **v.246** | **MRTVÝ** |
| L16299 | [M:720] | `height: var(--nav-inner-height-v251)`, `overflow: hidden` | **v.251** | **MRTVÝ** |
| L16357 | [M:720] | `height: var(--nav-compact-inner-v252)`, `align-items: center`, `gap: 6px` | **v.252** | **MRTVÝ** |

#### @media bloky — AKTUÁLNĚ PLATNÁ definice (v.278) ✅

| Řádek | Kontext | Klíčové vlastnosti |
|---|---|---|
| **L17304** | [M:720] | `display: flex`, `align-items: center`, `gap: 6px`, `width: 100%`, `height: var(--nav-v278-inner-height)`, `overflow: hidden`, `box-sizing: border-box` |
| **L17479** | [M:700-1180] | Tablet: `height: var(--nav-v278-inner-height)`, `align-items: center`, `overflow: hidden` |
| **L17779** | [M:760] | `overscroll-behavior: contain`, `-webkit-overflow-scrolling: auto` |
| **L17799** | [M:720] | `height: 64px`, `min/max-height: 64px` |

### Shrnutí `.nav-scroll`

- **2 top-level bloky** — před sloučením ověřit, zda L304 je přesně `.nav-scroll` nebo složený selektor
- **~14 mrtvých @media bloků** (v226–v252) → kandidáti na smazání
- **4 živé @media bloky** (v278) → nesahat

---

## 3. `.nav-item`

Jednotlivé položky navigace. Pozor: **parser zachytil 70 výskytů**, protože `.nav-item` je
prefixem pro desítky složených selektorů (`.nav-item.active`, `.nav-item:active`,
`.nav-item .nav-icon`, `.nav-item .nav-label` atd.). Níže jsou jen bloky,
kde je `.nav-item` klíčovým nebo prvním selektorem.

### Výskyty — čisté `.nav-item` top-level bloky

| Řádek | Kontext | Vlastnosti | Poznámka |
|---|---|---|---|
| **L308** | **[TL]** | `display: flex`, `flex: 1 1 0`, `min-height: 54px`, `flex-direction: column`, `align-items: center`, `gap: 3px`, `padding: 6px`, `border-radius: 19px`, `color: var(--muted)`, `font-size: 0.76rem`, `font-weight: 850`, `transition: color 160ms, background 160ms` | Hlavní definice — vše |
| **L1108** | **[TL]** | `max-width: 100%`, `overflow: hidden`, `text-overflow: ellipsis` | Doplnění — text overflow |

> L308 a L1108 nastavují **různé vlastnosti** (layout vs text overflow) → jde je bezpečně sloučit do jednoho bloku. Žádný konflikt hodnot.

### Výskyty — top-level bloky složených selektorů (výběr)

| Řádek | Kontext | Selektor | Vlastnosti |
|---|---|---|---|
| L330 | [TL] | `.nav-item:active` | `transform: scale(0.98)` |
| L334 | [TL] | `.nav-item .nav-icon` | `font-size: 1.18rem` |
| L339 | [TL] | `.nav-item.active` | `color`, `background: gradient`, `box-shadow` |
| L345 | [TL] | `.nav-item:active` nebo dark varianta | `background: rgba(...)` |

### @media bloky (výběr klíčových)

Stejný versioning vzor jako u `.nav-shell`:

| Řádek | Kontext | Verze | Stav |
|---|---|---|---|
| L832 | [M:420] | — | Živý (malé displeje) |
| L4333 | [M:760] | v.96 iOS glass | Živý — iOS styling |
| L5654/5661 | [M:760] | v.96 | Živý — touch handling |
| L11305/11312/11317 | [M:760] | v.157 | **MRTVÝ** |
| L12175/12181/12188/12194 | [M:760] | v.163 | **MRTVÝ** |
| L13735/13740/13747/13751/13757 | [M:760] | v.217-220 | Části živé (animace), části mrtvé |
| L14141/14148 | [M:720] | v.225 | **MRTVÝ** |
| L14432/14440 | [M:720] | **v.226** | **MRTVÝ** |
| L14673/14682/14690/14696 | [M:720] | **v.230** | **MRTVÝ** |
| L14885/14907 | [M:720] | **v.232** | **MRTVÝ** |
| L15147 | [M:760] | **v.234** | **MRTVÝ** |
| L16001 | [M:720] | **v.246** | **MRTVÝ** |
| L16306 | [M:720] | **v.251** | **MRTVÝ** |
| L16375/16389/16397/16417 | [M:720] | **v.252** | **MRTVÝ** |
| **L17329/17345/17353/17374** | **[M:720]** | **v.278** | **PLATÍ** ✅ |
| **L17496/17507/17530** | **[M:700-1180]** | **v.278 tablet** | **PLATÍ** ✅ |
| **L17806** | **[M:720]** | **v.278** | **PLATÍ** ✅ |

### Shrnutí `.nav-item`

- **2 čisté top-level bloky** (L308, L1108) → nastavují různé vlastnosti → sloučit bezpečně
- **Složené top-level selektory** (L330, L334, L339, L345) → každý řeší jiný stav → nesloučit
- **Versioned @media bloky** → stejný vzor jako u `.nav-shell`, aktuální je v.278

---

## 4. `.nav-item.active`

Aktivní stav navigační položky.

### Výskyty — top-level

| Řádek | Kontext | Vlastnosti |
|---|---|---|
| **L339** | **[TL]** | `color: var(--text)`, `background: linear-gradient(135deg, rgba(255,255,255,.70), ...)`, `box-shadow: 0 10px 28px rgba(...)` |

> Jediný top-level blok — bezpečný, nepotřebuje sloučení.

### @media bloky (výběr)

| Řádek | Kontext | Klíčové vlastnosti | Verze | Stav |
|---|---|---|---|---|
| L4333 | [M:760] | `background: color-mix(ios-glass)`, `box-shadow`, `backdrop-filter` | v.96 iOS | Živý |
| L4344 | [M:760] | `color: var(--text)`, `transform: translateY(-1px)` | v.96 | Živý |
| L12181 | [M:760] | `color: #ffffff !important`, `background: gradient(primary)`, `box-shadow`, `transform: translateY(-2px)` | v.163 | **MRTVÝ?** ⚠️ |
| L12188 | [M:760] | `display: none !important` (sub-element) | v.163 | **MRTVÝ?** |
| L12194 | [M:760] | `.nav-item.active .nav-icon`: `width: 46px`, `color: #ffffff`, `filter: drop-shadow` | v.163 | **MRTVÝ?** |
| L13740 | [M:760] | `background: transparent !important`, `box-shadow: none !important` | v.217 | Živý — reset |
| L14148 | [M:720] | `transform: none !important` | v.225 | **MRTVÝ** |
| L14440/14446 | [M:720] | `transform: none`, ikona 42px | **v.226** | **MRTVÝ** |
| L14682 | [M:720] | ikona 40px | **v.230** | **MRTVÝ** |
| L16375/16397/16417 | [M:720] | v.252 layout | **v.252** | **MRTVÝ** |
| **L17329/17353/17374** | **[M:720]** | `background: transparent`, `box-shadow: none`, ikona 42px | **v.278** | **PLATÍ** ✅ |
| **L17496/17530** | **[M:700-1180]** | tablet layout aktivní položky | **v.278 tablet** | **PLATÍ** ✅ |
| **L17806** | **[M:720]** | výška 64px | **v.278** | **PLATÍ** ✅ |

> ⚠️ **Pozor na L12181:** Definuje `background: gradient(primary)` a `color: #ffffff` pro aktivní stav
> — tento "barevný" aktivní stav byl pravděpodobně záměrně nahrazen v novějších verzích průhledným
> stylem (L13740: `background: transparent`). Před smazáním ověřit, zda se tato třída někde ještě
> renderuje přes JS.

---

## Souhrn rizik a doporučení

### Co je bezpečné sloučit

| Selektor | Bloky | Akce |
|---|---|---|
| `.nav-item` top-level | L308 + L1108 | Sloučit — různé vlastnosti, žádný konflikt |

### Co je mrtvý kód (kandidáti na smazání)

V `@media (max-width: 720px)` existují kompletní definice layoutu pro verze v226, v230, v232, v234, v246, v251, v252 — všechny přepsány v278. Odstranitelnými bloky jsou ty, které:
- Nastavují `height: var(--nav-visual-height-vXXX)`
- Nastavují `bottom: var(--nav-bottom-gap-vXXX)` (pro varianty před v278)
- Nastavují `width` ve stejné podmínce jako v278

**Odhadovaný počet smazatelných bloků (`.nav-shell` + `.nav-scroll` + `.nav-item`):** ~40–50 bloků.

### Kde NESAHAT (podmíněné overridy)

- Všechny bloky v `[M:700-1180]` (tabletový layout v278)
- Všechny bloky v `[S:ios]` (iOS-specific safe-area)
- Bloky s `prefers-reduced-motion`
- Utility bloky (animace, opacity, transition reset)

### Speciální rizika

1. **`.nav-shell` bottom:** Dva výrazy pro `bottom` v živých blocích (L17767 vs L18099) jsou záměrné — různé media podmínky (760px vs 720px), **neslučovat**.

2. **`.nav-item.active` L12181:** Barevný aktivní stav (`background: primary`) mohl být záměrně odstraněn nebo stále žije v jiném kontextu. **Před smazáním ověřit v JS/HTML.**

3. **`.nav-scroll` L304:** Dvouřádkový blok `display: none` — ověřit, zda je přesně `.nav-scroll` nebo složený selektor. **Číst přesný text před jakoukoliv akcí.**

4. **Versioned CSS proměnné:** Proměnné jako `--nav-visual-height-v226` jsou definovány v `:root` (zůstaly z dřívějšího úklidu jako unikátní vars). Pokud se smažou odpovídající bloky v `.nav-shell`, stanou se tyto proměnné nedefinovanými — smazat i je.
