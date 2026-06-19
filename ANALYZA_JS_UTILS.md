# Analýza kandidátů na extrakci do utils modulu (Fáze B)

Datum: 2026-06-19  
Větev: js-utils-extract  
Soubor: app.js (24 091 řádků)

---

## Vzorový propojovací pattern (shopping modul)

Existující moduly používají tento vzor:
- Soubor: IIFE → tovární funkce → `window.DomacnostXxx = { createXxx }`
- app.js: lazy getter `getShoppingToolkit()` instantiuje jednou, injektuje deps
- Injekce: čistý objekt `{ getState, normalizeText, escapeHtml, ... }`
- Modul přijme deps jako parametr factory, obalí je do closure

Nový utils modul bude stejný: `window.DomacnostUtils = { createUtils }`, v app.js `getUtils()` getter.

---

## Inventář kandidátů

### 1. `uid` — L1161–1163

```js
function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}
```

**Dělá:** Generuje unikátní ID ze timestamp + náhodný řetězec (base36).  
**Vnější identifikátory:** `Date`, `Math` — oba JS built-in.  
**Volá jiné interní funkce:** ne.  
**Klasifikace: ČISTÁ** ✓

---

### 2. `safeParse` — L1527–1533

```js
function safeParse(json, fallback) {
  try {
    return JSON.parse(json) ?? fallback;
  } catch {
    return fallback;
  }
}
```

**Dělá:** Bezpečný JSON.parse s fallback hodnotou.  
**Vnější identifikátory:** `JSON` — JS built-in.  
**Volá jiné interní funkce:** ne.  
**Klasifikace: ČISTÁ** ✓

---

### 3. `structuredCloneSafe` — L1912–1915

```js
function structuredCloneSafe(value) {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}
```

**Dělá:** Deep copy — preferuje nativní `structuredClone`, fallback na JSON round-trip.  
**Vnější identifikátory:** `structuredClone` (globální Web API), `JSON` — oba built-in.  
**Volá jiné interní funkce:** ne.  
**Klasifikace: ČISTÁ** ✓

---

### 4. `normalizeText` — L2423–2425

```js
function normalizeText(value) {
  return String(value || '').trim();
}
```

**Dělá:** Coerce na string + trim.  
**Vnější identifikátory:** `String` — JS built-in.  
**Volá jiné interní funkce:** ne.  
**Klasifikace: ČISTÁ** ✓

---

### 5. `escapeHtml` — L2339–2346

```js
function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
```

**Dělá:** HTML escaping (5 znaků).  
**Vnější identifikátory:** `String` — JS built-in.  
**Volá jiné interní funkce:** ne.  
**Poznámka:** Již nyní injektována do shopping modulů jako `deps.escapeHtml`.  
**Klasifikace: ČISTÁ** ✓

---

### 6. `easterSundayDate` — L1183–1201

```js
function easterSundayDate(year) {
  const y = Number(year);
  if (!Number.isInteger(y) || y < 1900 || y > 2200) return null;
  // Meeus/Jones/Butcher algoritmus
  const a = y % 19; const b = Math.floor(y / 100); ...
  return new Date(Date.UTC(y, month - 1, day));
}
```

**Dělá:** Vypočítá datum Velikonoc pro daný rok (algoritmicky, bez tabulky).  
**Vnější identifikátory:** `Number`, `Math`, `Date.UTC` — JS built-ins.  
**Volá jiné interní funkce:** ne.  
**Klasifikace: ČISTÁ** ✓

---

### 7. `addDaysIso` — L1203–1209

```js
function addDaysIso(isoDate, days) {
  const [year, month, day] = String(isoDate || '').slice(0, 10).split('-').map(Number);
  if (!year || !month || !day) return '';
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + Number(days || 0));
  return date.toISOString().slice(0, 10);
}
```

**Dělá:** Přičte N dní k ISO datumu, vrátí ISO string.  
**Vnější identifikátory:** `String`, `Number`, `Date` — JS built-ins.  
**Volá jiné interní funkce:** ne.  
**Klasifikace: ČISTÁ** ✓

---

### 8. `addMonthsIso` — L1211–1218

```js
function addMonthsIso(isoDate, months = 1) { ... }
```

**Dělá:** Přičte N měsíců k ISO datumu (ošetří přetečení posledního dne).  
**Vnější identifikátory:** `String`, `Number`, `Date` — JS built-ins.  
**Volá jiné interní funkce:** ne.  
**Klasifikace: ČISTÁ** ✓

---

### 9. `addYearsIso` — L1220–1226

```js
function addYearsIso(isoDate, years = 2) { ... }
```

**Dělá:** Přičte N let k ISO datumu.  
**Vnější identifikátory:** `String`, `Number`, `Date` — JS built-ins.  
**Volá jiné interní funkce:** ne.  
**Klasifikace: ČISTÁ** ✓

---

### 10. `toSafeDate` — L2378–2389

```js
function toSafeDate(value, fallback = null) {
  if (value instanceof Date) return Number.isFinite(value.getTime()) ? value : fallback;
  if (typeof value === 'number') { ... }
  if (typeof value === 'string' && value.trim()) { ... }
  return fallback;
}
```

**Dělá:** Převede Date/number/string na platný Date objekt, nebo vrátí fallback.  
**Vnější identifikátory:** `Date`, `Number` — JS built-ins.  
**Volá jiné interní funkce:** ne.  
**Klasifikace: ČISTÁ** ✓

---

### 11. `formatDate` — L2348–2353

```js
function formatDate(value, options = {}) {
  if (!value) return '—';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('cs-CZ', { day: '2-digit', month: '2-digit', year: 'numeric', ...options }).format(date);
}
```

**Dělá:** Formátuje ISO datum do českého formátu (DD.MM.YYYY).  
**Vnější identifikátory:** `Date`, `Number`, `Intl` — JS/Web built-ins.  
**Volá jiné interní funkce:** ne.  
**Klasifikace: ČISTÁ** ✓

---

### 12. `formatCurrency` — L2402–2405

```js
function formatCurrency(value) {
  const number = Number(value || 0);
  return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(number);
}
```

**Dělá:** Formátuje číslo jako CZK (bez haléřů).  
**Vnější identifikátory:** `Number`, `Intl` — built-ins.  
**Volá jiné interní funkce:** ne.  
**Klasifikace: ČISTÁ** ✓

---

### 13. `formatBytes` — L2407–2413

```js
function formatBytes(value) {
  const bytes = Number(value || 0);
  if (!bytes) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1).replace('.', ',')} kB`;
  return `${(bytes / 1048576).toFixed(1).replace('.', ',')} MB`;
}
```

**Dělá:** Formátuje bajty na B/kB/MB s českým desetinným oddělovačem.  
**Vnější identifikátory:** `Number` — built-in.  
**Volá jiné interní funkce:** ne.  
**Klasifikace: ČISTÁ** ✓

---

### 14. `localISODate` — L1165–1177 — ⚠️ ZÁVISLÁ

```js
function localISODate(date = new Date(), timeZone = APP_TIME_ZONE) {
  const safeDate = toSafeDate(date, new Date());
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone, ... }).formatToParts(safeDate)...
  return `${parts.year}-${parts.month}-${parts.day}`;
}
```

**Dělá:** ISO datum v zadané časové zóně (default Prague).  
**Vnější identifikátory:**
- `toSafeDate` — jiná utility (#10)
- `APP_TIME_ZONE` — closure konstanta `'Europe/Prague'` (L13), použita jako default parametru
**Volá jiné interní funkce:** `toSafeDate` ✓ (jiná utility, ne state/DOM)  
**Poznámka k `APP_TIME_ZONE`:** Není mutable state, je to `const`. Při extrakci: buď předat jako konfiguraci factory, nebo hardkódovat `'Europe/Prague'` do default parametru.  
**Klasifikace: ZÁVISLÁ NA JINÉ UTILITĚ + CLOSURE KONSTANTA**

---

### 15. `todayISO` — L1179–1181 — ⚠️ ZÁVISLÁ

```js
function todayISO() {
  return localISODate(new Date(), APP_TIME_ZONE);
}
```

**Dělá:** Dnešní datum jako ISO string v pražském čase.  
**Vnější identifikátory:**
- `localISODate` — utility #14
- `APP_TIME_ZONE` — closure konstanta
**Klasifikace: ZÁVISLÁ NA JINÉ UTILITĚ + CLOSURE KONSTANTA**

---

### 16. `czechPublicHolidayName` — L1228–1253 — ⚠️ ZÁVISLÁ

```js
function czechPublicHolidayName(isoDate) {
  // tabulka pevných svátků ...
  const easter = easterSundayDate(year);
  if (value === addDaysIso(easterIso, -2)) return 'Velký pátek';
  if (value === addDaysIso(easterIso, 1)) return 'Velikonoční pondělí';
  return '';
}
```

**Dělá:** Vrátí název českého státního svátku pro ISO datum, nebo `''`.  
**Vnější identifikátory:**
- `easterSundayDate` — utility #6
- `addDaysIso` — utility #7
- `String`, `Number`, `Boolean` — built-ins
**Volá jiné interní funkce:** pouze jiné utilities.  
**Klasifikace: ZÁVISLÁ NA JINÝCH UTILITÁCH** ✓

---

### 17. `isCzechPublicHolidayDate` — L1255–1257 — ⚠️ ZÁVISLÁ

```js
function isCzechPublicHolidayDate(date) {
  return Boolean(czechPublicHolidayName(localISODate(date, APP_TIME_ZONE)));
}
```

**Dělá:** Bool — je zadaný Date objekt český státní svátek?  
**Vnější identifikátory:**
- `czechPublicHolidayName` — utility #16
- `localISODate` — utility #14
- `APP_TIME_ZONE` — closure konstanta
**Klasifikace: ZÁVISLÁ NA JINÝCH UTILITÁCH + CLOSURE KONSTANTA**

---

### 18. `parseDateValue` — L2355–2376 — ⚠️ ZÁVISLÁ

```js
function parseDateValue(value) {
  // ...
  const text = normalizeText(value);
  // parsování ISO, CZ formátu, fallback na new Date(text)
}
```

**Dělá:** Parsuje datum z Date/number/ISO stringu/CZ formátu.  
**Vnější identifikátory:**
- `normalizeText` — utility #4
- `Date`, `Number` — built-ins
**Klasifikace: ZÁVISLÁ NA JINÉ UTILITĚ** ✓

---

### 19. `formatDateTime` — L2391–2400 — ⚠️ ZÁVISLÁ

```js
function formatDateTime(value) {
  const date = toSafeDate(value);
  if (!date) return '—';
  return new Intl.DateTimeFormat('cs-CZ', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}
```

**Dělá:** Formátuje datum na slovní český popis (Pondělí 1. ledna 2025).  
**Vnější identifikátory:**
- `toSafeDate` — utility #10
- `Intl` — built-in
**Klasifikace: ZÁVISLÁ NA JINÉ UTILITĚ** ✓

---

### 20. `daysUntil` — L2415–2421 — ⚠️ ZÁVISLÁ

```js
function daysUntil(dateISO) {
  if (!dateISO) return null;
  const start = new Date(todayISO());
  const target = new Date(`${dateISO}T00:00:00`);
  ...
  return Math.ceil((target - start) / 86400000);
}
```

**Dělá:** Počet dní do zadaného ISO data (záporné = v minulosti).  
**Vnější identifikátory:**
- `todayISO` — utility #15 (volá `localISODate` → `APP_TIME_ZONE`)
- `Date`, `Math`, `Number` — built-ins
**Klasifikace: ZÁVISLÁ NA JINÉ UTILITĚ**

---

## Vyřazení z úvahy

### `getFormData` — L2427–2438

```js
function getFormData(form) {
  const data = new FormData(form);
  ...
}
```

**Bere DOM element jako parametr.** Sám o sobě nečte globální DOM ani state, ale přijímá DOM jako vstup → není čistá datová utilita. **Nechávám v app.js.**

### `clampPolishShopYear` — L1280–1284

```js
function clampPolishShopYear(value) {
  return Math.min(POLISH_SHOP_YEAR_MAX, Math.max(POLISH_SHOP_YEAR_MIN, Math.round(year)));
}
```

**Závisí na `POLISH_SHOP_YEAR_MIN/MAX` (L534–535)** — closure konstanty specifické pro polský shopový modul. Příliš specifická. **Nechávám v app.js.**

---

## Souhrn klasifikace

### ČISTÉ — bezpečné extrahovat jako první (nulové vnější závislosti)

| # | Funkce | Řádky | Závisí na |
|---|--------|-------|-----------|
| 1 | `uid` | L1161–1163 | `Date`, `Math` (built-in) |
| 2 | `safeParse` | L1527–1533 | `JSON` (built-in) |
| 3 | `structuredCloneSafe` | L1912–1915 | `structuredClone`, `JSON` (built-in) |
| 4 | `normalizeText` | L2423–2425 | `String` (built-in) |
| 5 | `escapeHtml` | L2339–2346 | `String` (built-in) |
| 6 | `easterSundayDate` | L1183–1201 | `Number`, `Math`, `Date` (built-in) |
| 7 | `addDaysIso` | L1203–1209 | `String`, `Number`, `Date` (built-in) |
| 8 | `addMonthsIso` | L1211–1218 | `String`, `Number`, `Date` (built-in) |
| 9 | `addYearsIso` | L1220–1226 | `String`, `Number`, `Date` (built-in) |
| 10 | `toSafeDate` | L2378–2389 | `Date`, `Number` (built-in) |
| 11 | `formatDate` | L2348–2353 | `Date`, `Number`, `Intl` (built-in) |
| 12 | `formatCurrency` | L2402–2405 | `Number`, `Intl` (built-in) |
| 13 | `formatBytes` | L2407–2413 | `Number` (built-in) |

Celkem: **13 funkcí, ~70 řádků kódu**

---

### ZÁVISLÉ NA JINÝCH UTILITÁCH — extrahovat po čistých, ve správném pořadí

| # | Funkce | Řádky | Závisí na (interní) | Poznámka |
|---|--------|-------|---------------------|---------|
| 14 | `localISODate` | L1165–1177 | `toSafeDate` (#10) | + closure const `APP_TIME_ZONE` |
| 15 | `todayISO` | L1179–1181 | `localISODate` (#14) | + closure const `APP_TIME_ZONE` |
| 16 | `czechPublicHolidayName` | L1228–1253 | `easterSundayDate` (#6), `addDaysIso` (#7) | ✓ jen čisté utility |
| 17 | `isCzechPublicHolidayDate` | L1255–1257 | `czechPublicHolidayName` (#16), `localISODate` (#14) | + `APP_TIME_ZONE` |
| 18 | `parseDateValue` | L2355–2376 | `normalizeText` (#4) | ✓ jen čisté utility |
| 19 | `formatDateTime` | L2391–2400 | `toSafeDate` (#10) | ✓ jen čisté utility |
| 20 | `daysUntil` | L2415–2421 | `todayISO` (#15) | + tranzitivně `APP_TIME_ZONE` |

**Poznámka k `APP_TIME_ZONE`:** Konstanta `'Europe/Prague'` definovaná na L13. Není mutable state. Při extrakci modulu: předat jako `config.timeZone` do factory, nebo jednoduše hardkódovat `'Europe/Prague'` do default parametrů funkcí (hodnota se v praxi nemění).

---

### ŠPINAVÉ — do utils NEPATŘÍ, nechávám v app.js

(Příklady z oblasti kolem prohledávaných funkcí)

| Funkce | Důvod |
|--------|-------|
| `loadState` | čte `localStorage`, `STORAGE_KEY`, volá `scoreStoredState`, `LEGACY_STORAGE_KEYS` |
| `saveState` | volá `persistStateSnapshot`, `scheduleCloudAutosync`, čte/zapisuje `state` |
| `createSafeStorage` | obaluje `localStorage`/`sessionStorage`, vrací closure s vedlejším efektem |
| `isDemoOnlyState` | čte `state.settings`, `state.cloud` |
| `hasUsableAppSession` | čte `state.cloud`, volá `hasStoredSupabaseSession()` |
| `getFormData` | přijímá DOM element (FormData) |
| `clampPolishShopYear` | závisí na closure konstantách specifických pro polský modul |

---

## Doporučené pořadí extrakce (Fáze B krok po kroku)

1. **Krok 1 (příští):** Extrahovat 13 čistých funkcí do `utils.js` — žádné závislosti, nulové riziko
2. **Krok 2:** Přidat závislé (#16, #18, #19) — závisí jen na čistých, bez `APP_TIME_ZONE`
3. **Krok 3:** Přidat `localISODate`, `todayISO`, `isCzechPublicHolidayDate`, `daysUntil` — vyřeší `APP_TIME_ZONE` jako config factory
