# Analýza duplikátních CSS proměnných v :root

> Soubor: `styles.css` (19 018 řádků)  
> Větev: `css-cleanup`  
> Datum: 2026-06-18

---

## Metodika

`styles.css` obsahuje **34 bloků `:root {}`** rozptýlených po celém souboru. Každý blok byl přidán
v době vydání nové verze aplikace (v0.1_13 → v0.1_288) místo aktualizace stávajícího bloku.

V CSS kaskádě **vždy vyhraje deklarace, která je v souboru nejpozději** (při stejné specificitě).
Výjimkou jsou bloky uvnitř `@media` nebo `@supports` — ty se uplatní jen při splnění podmínky.

Pro každou proměnnou bylo zkontrolováno:
- zda se nachází ve volném `:root {}` (top-level) nebo uvnitř `@media`/`@supports`
- jaké má hodnoty a na kterých řádcích
- která hodnota v kaskádě aktuálně platí

---

## 🔴 NEBEZPEČNÉ — proměnné s různými hodnotami

Tyto proměnné **nelze sloučit mechanicky**. Při přesunutí špatné hodnoty do jednoho bloku
se změní vizuální výsledek.

---

### `--card`
| Řádek | Kontext | Hodnota |
|---|---|---|
| L8 | top-level | `rgba(255, 255, 255, 0.68)` |
| **L12489** | **top-level** | **`rgba(255, 255, 255, 0.34)`** ✅ platí |

**Pozorování:** L8 je původní světlá karta. L12489 (v.0.1_194+) ji výrazně ztmavil na 34 % opacity.
Sloučením zachovat hodnotu z L12489.

---

### `--card-strong`
| Řádek | Kontext | Hodnota |
|---|---|---|
| L9 | top-level | `rgba(255, 255, 255, 0.86)` |
| **L12490** | **top-level** | **`rgba(255, 255, 255, 0.48)`** ✅ platí |

---

### `--glass`
| Řádek | Kontext | Hodnota |
|---|---|---|
| L10 | top-level | `rgba(255, 255, 255, 0.52)` |
| **L12491** | **top-level** | **`rgba(255, 255, 255, 0.20)`** ✅ platí |

---

### `--shadow-soft`
| Řádek | Kontext | Hodnota |
|---|---|---|
| L17 | top-level | `0 10px 30px rgba(45, 70, 110, 0.10)` |
| **L12492** | **top-level** | **`0 12px 30px rgba(31, 54, 88, 0.08)`** ✅ platí |

Mírná změna barvy stínu a opacity mezi verzemi.

---

### `--ios-glass`
| Řádek | Kontext | Hodnota |
|---|---|---|
| L4256 | top-level | `rgba(255, 255, 255, 0.46)` |
| **L12493** | **top-level** | **`rgba(255, 255, 255, 0.30)`** ✅ platí |

---

### `--ios-glass-strong`
| Řádek | Kontext | Hodnota |
|---|---|---|
| L4257 | top-level | `rgba(255, 255, 255, 0.72)` |
| **L12494** | **top-level** | **`rgba(255, 255, 255, 0.46)`** ✅ platí |

---

### `--ios-glass-edge`
| Řádek | Kontext | Hodnota |
|---|---|---|
| L4258 | top-level | `rgba(255, 255, 255, 0.68)` |
| **L12495** | **top-level** | **`rgba(255, 255, 255, 0.62)`** ✅ platí |

---

### `--ios-glass-shadow`
| Řádek | Kontext | Hodnota |
|---|---|---|
| L4259 | top-level | `0 18px 54px rgba(31, 54, 88, 0.14)` |
| **L12496** | **top-level** | **`0 18px 42px rgba(31, 54, 88, 0.10)`** ✅ platí |

---

### `--radius-xl`
| Řádek | Kontext | Hodnota |
|---|---|---|
| L18 | top-level | `28px` |
| **L2322** | **top-level** | **`22px`** ✅ platí |

**Pozorování:** V původní verzi byl rádius 28px. Ve v.0.1_51 byl snížen na 22px.
Pokud by při sloučení zůstalo 28px, zvětší se zaoblení karet v celé aplikaci.

---

### `--radius-lg`
| Řádek | Kontext | Hodnota |
|---|---|---|
| L19 | top-level | `22px` |
| **L2323** | **top-level** | **`18px`** ✅ platí |

---

### `--radius-md`
| Řádek | Kontext | Hodnota |
|---|---|---|
| L20 | top-level | `16px` |
| **L2324** | **top-level** | **`14px`** ✅ platí |

---

### `--nav-height`
| Řádek | Kontext | Hodnota |
|---|---|---|
| L21 | top-level | `76px` |
| L2325 | top-level | `70px` |
| L16380 | `@media (max-width: 720px)` | `72px` |
| **L17321** | **`@media (max-width: 720px)`** | **`76px`** ✅ platí na mobilu |

**Pozorování:** Aktuálně platí `70px` na desktopu (L2325), `76px` na mobilu (L17321 — mediaquery přebíjí).
Mediové overridy jsou záměrné — **ponechat je**. Sloučit jen top-level hodnoty (vzít L2325 = 70px).

---

### `--nav-fixed-gap`
| Řádek | Kontext | Hodnota |
|---|---|---|
| L5240 | top-level | `max(8px, env(safe-area-inset-bottom, 0px))` |
| L5274 | top-level | `max(2px, calc(env(safe-area-inset-bottom, 0px) - 8px))` |
| **L5325** | **top-level** | **`max(-6px, calc(env(safe-area-inset-bottom, 0px) - 22px))`** ✅ platí |

**Pozorování:** Tři iterace polohy spodní lišty ve třech po sobě jdoucích hotfixech v0.1_96.
Všechny jsou top-level, každý přepsal předchozí. Hodnoty L5240 a L5274 jsou mrtvý kód.

---

### `--nav-bottom-lock`
Nejvíce přepisovaná proměnná v souboru. Celkem **11 výskytů** — mix top-level a mediových bloků.

| Řádek | Kontext | Hodnota |
|---|---|---|
| L13434 | top-level | `max(8px, env(safe-area-inset-bottom, 0px))` |
| L13440 | `@media (max-width: 720px)` | `max(0px, calc(env(safe-area-inset-bottom, 0px) - 34px))` |
| L13483 | top-level | `0px` |
| L13497 | `@supports (-webkit-touch-callout) + @media (max-width: 720px)` | `-24px` |
| L13676 | top-level | `max(6px, calc(env(safe-area-inset-bottom, 0px) - 30px))` |
| L13709 | `@supports (-webkit-touch-callout) + @media (max-width: 720px)` | `max(6px, calc(...) - 30px)` |
| L13740 | top-level | `2px` |
| L13834 | top-level | `0px` |
| L13917 | `@media (max-width: 720px)` | `-8px` |
| L14160 | top-level | `0px` |
| **L14247** | **`@media (max-width: 720px)`** | **`-14px`** ✅ platí na mobilu |

**Aktuálně platí na desktopu:** `0px` (L14160, top-level — nejpozdější top-level výskyt).  
**Aktuálně platí na mobilu:** `-14px` (L14247, `@media max-width: 720px` — nejpozdější mediaquery).  
Top-level hodnoty L13434, L13483, L13676, L13740, L13834 jsou mezivýsledky — **mrtvý kód**, ale záměrně postupné iterace. Při sloučení zachovat pouze L14160 (top-level) a L14247 (media).

---

### `--home-nav-reserve-bottom`
| Řádek | Kontext | Hodnota |
|---|---|---|
| L13435 | top-level | `max(0px, calc(env(safe-area-inset-bottom, 0px) - 22px))` |
| L13484 | top-level | `0px` |
| L13498 | `@supports (-webkit-touch-callout) + @media (max-width: 720px)` | `0px` |
| L13677 | top-level | `0px` |
| L13710 | `@supports (-webkit-touch-callout) + @media (max-width: 720px)` | `0px` |
| **L13741** | **top-level** | **`0px`** ✅ platí |

**Pozorování:** Po iteracích skončila na `0px` — ale **první hodnota z L13435 je jiná**.
Při sloučení vzít `0px`.

---

### `--home-compact-height`
| Řádek | Kontext | Hodnota |
|---|---|---|
| L13836 | top-level | `calc(var(--app-vh) - var(--nav-height) - 150px)` |
| **L13924** | **`@media (max-width: 390px)`** | **`calc(var(--app-vh) - var(--nav-height) - 138px)`** ✅ platí na velmi malých displejích |

**Pozorování:** L13836 je základ (top-level), L13924 je záměrný override pro iPhone SE/mini (`≤390px`).
Oba jsou potřeba, nejde o chybu — **ponechat oba**.

---

### `--nav-motion-duration`
Proměnná pro animaci aktivní položky v navigaci. Postupně dolaďována v 5 iteracích.

| Řádek | Kontext | Hodnota |
|---|---|---|
| L14161 | top-level | `1.15s` |
| L14272 | top-level | `1.65s` |
| L14449 | top-level | `2.12s` |
| L14692 | top-level | `2.2s` |
| L14907 | top-level | `2.35s` |
| **L15174** | **top-level** | **`2.2s`** ✅ platí |

Všech 6 výskytů je top-level — jde o chronologický vývoj hodnoty. Zachovat pouze poslední (`2.2s`).

---

### `--nav-motion-ease`
| Řádek | Kontext | Hodnota |
|---|---|---|
| L14162 | top-level | `cubic-bezier(.18, .88, .18, 1)` |
| L14273 | top-level | `cubic-bezier(.16, .86, .16, 1)` |
| L14449 | top-level | `cubic-bezier(.14, .78, .16, 1)` |
| L14692 | top-level | `cubic-bezier(.14, .78, .16, 1)` |
| L14908 | top-level | `cubic-bezier(.12, .76, .14, 1)` |
| **L15174** | **top-level** | **`cubic-bezier(.14, .78, .16, 1)`** ✅ platí |

Totéž — zachovat pouze poslední hodnotu.

---

### `--nav-compact-bottom-v252`
| Řádek | Kontext | Hodnota |
|---|---|---|
| L16384 | `@media (max-width: 720px)` | `max(6px, calc(env(safe-area-inset-bottom, 0px) - 28px))` |
| **L16487** | **`@media (max-width: 720px)`** | **`max(4px, calc(env(safe-area-inset-bottom, 0px) - 30px))`** ✅ platí |

Obě hodnoty jsou uvnitř stejného media query — druhá přebíjí první.

---

### `--home-bottom-reserve`
| Řádek | Kontext | Hodnota |
|---|---|---|
| L18650 | top-level | `calc(78px + max(2px, calc(env(safe-area-inset-bottom, 0px) - 18px)) + 6px)` |
| **L18842** | **top-level** | **`calc(78px + max(2px, calc(env(safe-area-inset-bottom, 0px) - 24px)) + 4px) !important`** ✅ platí |

**Pozorování:** L18842 je komentován jako záměrný "finální fix" s vysvětlením v komentáři výše.
Zachovat L18842. L18650 je mrtvý kód přidaný ve stejném commit-bloku, hned přebytý.

---

## ✅ BEZPEČNÉ — proměnné se stejnou hodnotou všude

Žádná taková proměnná nebyla nalezena — **všechny duplicitní proměnné mají alespoň jednu odlišnou hodnotu.**

Poznámka: Proměnné, které se vyskytují jen jednou (bez duplikátu), nejsou v tomto seznamu — jsou
ze své podstaty bezpečné.

---

## Shrnutí rizik

| Kategorie | Počet proměnných | Riziko |
|---|---|---|
| Vizuální (opacity, barvy, rádiusy) | 9 | Viditelná změna UI při sloučení špatné hodnoty |
| Layout / safe-area (px, calc) | 8 | Posunutá navigace nebo hero na iOS |
| Animace (duration, ease) | 2 | Jiná rychlost/plynulost přechodu |
| Bezpečné (identické hodnoty) | 0 | — |

**Celkem: 20 proměnných vyžaduje ruční kontrolu před sloučením `:root` bloků.**

---

## Doporučený postup při sloučení

1. Vzít první `:root {}` blok na L1 jako **master blok**
2. Pro každou nebezpečnou proměnnou: dosadit **nejpozději definovanou top-level hodnotu** (tučně zvýrazněná výše)
3. Mediové a `@supports` overridy **ponechat na místě** (záměrné responzivní přepisy)
4. Po sloučení smazat všechny ostatní top-level `:root {}` bloky
5. Vizuálně ověřit v prohlížeči: spodní navigace na iOS (safe-area), karty/skla, zaoblení
