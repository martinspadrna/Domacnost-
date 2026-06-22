# Analýza modulů pro extrakci z app.js

> Větev: `module-extract-analyza` · Fáze B · Krok 1 – jen analýza, žádné editace  
> Vzor extrakce: `shopping.js` + `utils.js` (fungující precedent)

---

## A. Inventář funkcí

| Modul | Počet funkcí | Action handlery |
|-------|-------------|-----------------|
| **HDO** | 10 | `add-hdo`, `toggle-hdo`, `delete-hdo`, `cloud-sync-hdo` |
| **Odpad/Svoz** | 2 | `add-waste`, `delete-waste`, `cloud-sync-waste` |
| **Kalendář** | 21 | `add-calendar-source`, `google-calendar-*`, `delete-calendar` (7+) |
| **Finance** | 39 | add/update/delete account + transaction + template + cloud-sync (10+) |
| **Předplatné** | 44 | add person/service/share/payment, toggle, cloud-sync (8+) |
| **Záruky** | 13 | `add-warranty`, `edit-warranty`, `delete-warranty`, `delete-warranty-file` |
| **Věrnostní/Kupony** | ~3 | minimální, CRUD na poli |
| **Počasí** | 8 | `weather-refresh`, `weather-settings` |
| **Zápisník/Úkoly** | 6 | `add-task`, `task-toggle`, `task-delete`, `add-note`, `notebook-item-*` |

---

## B. State klíče (čtení / zápis)

| Modul | State klíče | Zápis |
|-------|------------|-------|
| **HDO** | `state.hdoWindows`, `state.hdoCloud` | hdoWindows, hdoCloud |
| **Odpad** | `state.waste`, `state.wasteCloud` | waste, wasteCloud |
| **Kalendář** | `state.calendar`, `state.calendarCloud` | calendar, calendarCloud |
| **Finance** | `state.finance`, `state.financeAccounts`, `state.financeTemplates`, `state.financeCloud` | všechny 4 |
| **Předplatné** | `state.subscriptions`, `state.subscriptionPeople`, `state.subscriptionPayments`, `state.subscriptionsCloud` | všechny 4 |
| **Záruky** | `state.warranties`, `state.warrantyFiles` | obě |
| **Počasí** | `state.weather` | weather (cache) |
| **Zápisník** | `state.homeTasks`, `state.notes`, `state.tasksCloud` | všechny 3 |
| **Věrnostní** | `state.coupons`, `state.loyaltyCards`, `state.loyaltyCardsCloud` | všechny 3 |

**Vzor zápisu u všech modulů:**  
`array.push/filter` → `saveState()` → `render()`

---

## C. Odchozí závislosti (volání ven z modulu)

**Kritické sdílené helpers (>100 výskytů v celém app.js):**

| Helper | Výskyty | Používají |
|--------|---------|-----------|
| `escapeHtml()` | 695× | všechny moduly |
| `showToast()` | 492× | všechny moduly |
| `normalizeText()` | 420× | všechny moduly |
| `field()` | 309× | všechny moduly s formuláři |
| `render()` | 244× | všechny moduly |
| `saveState()` | 188× | všechny moduly |
| `cloudReady()` | 108× | moduly s cloud sync |
| `formatCurrency()` | 103× | Finance, Předplatné |
| `formatDate()` | 79× | vše s daty |
| `uid()` | 70× | při vytváření položek |

**Klíčový závěr:** Počasí volá jen `showToast`, `saveState`, `render` a základní date helpery → **nejnižší coupling ze všech.**

---

## D. Příchozí závislosti (volání zvenčí do modulu)

| Modul | renderModule | Overview drawer | Dashboard | Akce |
|-------|-------------|-----------------|-----------|------|
| **HDO** | `renderHomecare('hdo')` | `renderOverviewContent('hdo')` | `getHdoStatus(now)` | 4 handlerů |
| **Odpad** | `renderHomecare('waste')` | `renderOverviewContent('waste')` | `getUpcomingWasteRuntimeItems()` | 3 handlerů |
| **Kalendář** | `renderCalendar` | `renderOverviewContent('calendar')` | `calendarEventIsRunning()` | 7+ handlerů |
| **Finance** | `renderFinance` | `renderOverviewContent('finance')` | `financeMonthSummary()` + KPIs | 10+ handlerů |
| **Předplatné** | `renderSubscriptions` | — | — | 8+ handlerů |
| **Záruky** | `renderHomecare('warranties')` | — | — | 4 handlerů |
| **Počasí** | `renderWeatherPage` | — | `normalizeWeatherState()` (read-only) | 2 handlerů |
| **Zápisník** | `renderHomecare('tasks')` | `renderOverviewContent('tasks')` | — | 5 handlerů |
| **Věrnostní** | přes `renderMore` | — | — | CRUD |

---

## E. Přímý přístup k DOM

**Výsledek:** Žádný modul nesahá přímo na DOM ve svých funkcích.

Architektura je **pure-render pipeline**:
1. Modulové funkce vrací HTML string
2. `app.innerHTML = html` se děje výhradně v hlavní `render()` funkci
3. Action handlery mění state → volají `render()`

→ **Moduly jsou už architektonicky čisté pro extrakci.**

---

## F. Volání saveState() / render()

Všechny moduly sledují stejný vzor:

```
form data → parse → mutate state.module → saveState() → render()
```

- `saveState()`: 188 výskytů, rovnoměrně rozložených
- `render()`: 244 výskytů, rovnoměrně rozložených
- Žádný modul není výjimečný — vzor je konzistentní

---

## G. Pořadí bezpečnosti extrakce (od nejméně provázaného)

### Tier 1 – Nejbezpečnější ⭐⭐⭐

#### 1. POČASÍ (Weather) — coupling 1/10
- Jeden state objekt (`state.weather`), žádná pole
- Dashboard čte jen `normalizeWeatherState()` (read-only, nemusí se přesouvat)
- Cache-based — selhání se nekaskáduje
- 8 funkcí, 2 action handlery
- Žádná závislost na jiných modulech

#### 2. ZÁPISNÍK / ÚKOLY (Notes/Tasks) — coupling 2/10
- Jednoduchá pole, čisté CRUD operace
- Žádné soubory, žádné výpočty
- Dashboard zápisník nepoužívá
- 6 funkcí, 5 action handlerů

#### 3. VĚRNOSTNÍ KARTY / KUPONY — coupling 2.5/10
- Minimální kód, žádné dashboard widgety
- Pure CRUD na polích
- Caveat: příliš malé na samostatnou extrakci — vhodné párovat se zárukami

### Tier 2 – Střední provázanost ⭐⭐

#### 4. ZÁRUKY (Warranties) — coupling 3/10
- 13 funkcí, self-contained
- Overhead: file upload + IndexedDB + komprese obrázků
- Dashboard nepoužívá záruky vůbec

#### 5. HDO — coupling 3.5/10
- Dashboard volá `getHdoStatus(now)` — tight loop
- Potřeba přenést time-window helpery (ne všechny mají HDO prefix)
- Cloud sync metadata

#### 6. ODPAD/SVOZ — coupling 4/10
- Jen 2 pojmenované funkce, ale helpery jsou rozptýleny
- Dashboard `getUpcomingWasteRuntimeItems()` – těsná vazba

### Tier 3 – Vysoká provázanost ⭐

#### 7. KALENDÁŘ — coupling 6/10
- Google Calendar OAuth, token management, iCal parsing
- Dashboard: `calendarEventIsRunning()` (real-time)
- 17+ action handlerů

#### 8. FINANCE — coupling 7/10
- 4 paralelní pole (transactions, accounts, templates, cloud meta)
- Dashboard KPIs + balance calculations
- Největší modul po Předplatném

#### 9. PŘEDPLATNÉ — coupling 7.5/10
- 44 funkcí – největší sada
- Komplexní matematika (credit tracking, sdílené částky)
- SVG brand loga hardcoded v kódu
- 4 paralelní pole

---

## Top 3 kandidáti: co řešit při extrakci

---

### Kandidát #1: POČASÍ (doporučený první)

**Riziko: MINIMÁLNÍ**

**Co předat modulu při init:**
```javascript
createWeatherModule({
  getState: () => state.weather,
  setState: (val) => { state.weather = val; },
  helpers: { showToast, saveState, render, escapeHtml, formatDate, normalizeText },
  constants: { WEATHER_CACHE_MS, WEATHER_PROVIDER_OPTIONS, APP_TIME_ZONE }
})
```

**Veřejné API (co app.js volá):**
- `renderWeatherPage()` → HTML string
- `renderWeatherAnimeIcon(code, opts)` → HTML (používá dashboard)
- `weatherCodeLabel(code)` → [string, string]
- `ensureWeatherFresh(force)` → Promise
- `handleWeatherAction(action, data)` → void

**Jak zapojit:**
1. V `renderModule` switchi: `weather: () => weatherModule.renderWeatherPage()`
2. V action dispatch: weather akce → `weatherModule.handleAction(action, data)`
3. `renderWeatherAnimeIcon` exportovat do globálního scope (volá ji dashboard)

**Načítání:**
```html
<script src="utils.js"></script>
<script src="weather.js"></script>
<script src="app.js"></script>
```

---

### Kandidát #2: ZÁPISNÍK/ÚKOLY

**Riziko: NÍZKÉ**

**Co předat:**
```javascript
createTasksModule({
  getHomeTasks: () => state.homeTasks,
  setHomeTasks: (v) => { state.homeTasks = v; },
  getNotes: () => state.notes,
  setNotes: (v) => { state.notes = v; },
  getTasksCloud: () => state.tasksCloud,
  helpers: { showToast, saveState, render, escapeHtml, field, uid,
             normalizeText, formatDate, daysUntil },
  constants: { TASK_CATEGORY_OPTIONS, TASK_PRIORITY_OPTIONS }
})
```

**Veřejné API:**
- `renderTasksPanel()` → HTML
- `renderTaskOverviewItem(task)` → HTML (volá overview drawer)
- `handleTaskAction(action, data, form)` → void

**Klíčový problém:** `renderTaskOverviewItem` a `renderTaskOverviewItem` se volají z overview draweru v app.js → musí zůstat dosažitelné. Řeší se buď globálním exportem nebo callbackem předaným při init.

---

### Kandidát #3: ZÁRUKY

**Riziko: NÍZKÉ (s overhead na file handling)**

**Co předat:**
```javascript
createWarrantiesModule({
  getWarranties: () => state.warranties,
  setWarranties: (v) => { state.warranties = v; },
  getWarrantyFiles: () => state.warrantyFiles,
  setWarrantyFiles: (v) => { state.warrantyFiles = v; },
  helpers: { showToast, saveState, render, escapeHtml, field, uid, formatDate },
  fileConfig: {
    WARRANTY_FILE_MAX_BYTES,
    WARRANTY_IMAGE_MAX_DIMENSION,
    WARRANTY_IMAGE_JPEG_QUALITY,
    FILE_DB_NAME,
    FILE_STORE_WARRANTIES
  },
  fileApis: { getFileDatabase, saveFileToDatabase, getFileFromDatabase }
})
```

**Klíčový problém:** Modal stav (`activeWarrantyDetailId`) zůstane v app.js. Modul exposuje `openDetail(id)` / `closeDetail()` callbacky.

---

## Doporučené pořadí extrakce

| Fáze | Modul | Odhad | Validace |
|------|-------|-------|----------|
| 1a | **Počasí** | 6–8 h | render stránky + refresh + ukládání nastavení |
| 1b | **Zápisník/Úkoly** | 8–12 h | CRUD úkolů, overview drawer, cloud sync |
| 2 | **Záruky** | 12–16 h | upload souboru, komprese, modal, CRUD |
| 3a | **Věrnostní/Kupony** | 4–6 h | vzor ze záruky |
| 3b | **HDO** | 12–16 h | dashboard widget `getHdoStatus` |
| 4a | **Odpad** | 10–14 h | `getUpcomingWasteRuntimeItems` refactoring |
| 4b | **Kalendář** | 16–20 h | Google integrace, real-time sync |
| 5a | **Finance** | 20–24 h | největší, nejtěsnější dashboard vazba |
| 5b | **Předplatné** | 18–22 h | komplexní matematika, brand SVG |

---

## Pořadí `<script>` tagů po extrakci

```html
<script src="utils.js"></script>       <!-- sdílené utility (hotové) -->
<script src="app.js"></script>         <!-- hlavní app – inicializuje state -->
<script src="weather.js"></script>     <!-- po app.js – potřebuje state ref -->
<script src="tasks-notes.js"></script>
<script src="warranties.js"></script>
<!-- shopping.js je už hotové -->
```

**Klíčové:** Každý modul se načte PO `app.js`, protože potřebuje přístup k `state` a globálním helperům. Alternativně: factory pattern s callback injekcí (bezpečnější).

---

## Závěr

**Doporučení: začít s Počasím.**

- 8 funkcí, 1 state objekt, žádné kaskádující selhání
- Úspěch je jednoznačný (stránka buď renderuje nebo ne)
- Dá důvěru a šablonu pro další extrakce
- Pak: Zápisník/Úkoly (podobná bezpečnost, větší krok)
