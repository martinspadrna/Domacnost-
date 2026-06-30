# Analýza modulu Kalendář pro extrakci z app.js

> Větev: `module-extract-calendar` · Fáze B · KROK 1 – jen analýza, žádné editace kódu
> Vzor extrakce: weather.js / finance.js / subscriptions.js (IIFE → factory → window.Domacnost* → lazy getter + wrappery)
> Stav app.js: v.0.1_305 (6 modulů už extrahováno)

---

## TL;DR (shrnutí pro netrpělivé)

- **~75 funkcí** kalendáře, rozesetých do ~8 oblastí app.js.
- **Realtime sync mezi zařízeními je GENERICKÝ a zůstává v app.js** — NENÍ to kalendářový kód. Kalendář se jen „veze" v generickém reload kanálu. → Riziko pro realtime je **NÍZKÉ**, dokud zůstanou wrappery `cloudLoadCalendar` / `cloudLoadCalendarSources`.
- **Google OAuth + edge funkce = nejvyšší riziko.** OAuth dělá plný redirect (`window.location.href`), návrat zpracovává `handleInitialAuthReturn` v bootu app.js, a `invokeGoogleCalendarFunction` má těžké závislosti (households, bootstrap, reset workspace).
- **Token NENÍ v klientu** — drží ho edge funkce server-side (Supabase). Klient má jen `connection` metadata. → Extrakce se tokenu nedotkne.
- **Doporučení: extrahovat PO ČÁSTECH** (Část A: render + event/dashboard helpery + lokální/cloud CRUD událostí; Část B: Google OAuth + edge + auto-sync zvlášť). Důvod níž.

---

## 1) Funkce kalendáře (~75) podle oblastí

| Oblast | Řádky | Funkce (počet) |
|--------|-------|----------------|
| **A. Event helpery + dashboard** | 3439–3493 | `calendarEventStartMs`, `calendarEventEndMs`, `calendarEventIsRunning`, `calendarEventIsRelevant`, `sortCalendarEventsByStart`, `upcomingCalendarEvents`, `calendarEventTimeLabel`, `calendarEventMetaLabel` (8) |
| **B. Detail modal** | 2819–2825 | `findCalendarEventById`, `renderCalendarEventDetailModal` (2) |
| **C. Zdroje (sources)** | 4842–4919 | `getCalendarSources`, `normalizeCalendarSourceProvider`, `calendarSourceProviderLabel`, `calendarSourceIcon`, `mapCalendarSource`, `getCalendarSource`, `isCalendarSourceEnabled`, `visibleCalendarEvents`, `calendarSourceName`, `calendarSourceOptions` (10) |
| **D. Google connection (zobrazení)** | 4919–5008 | `googleCalendarConnection`, `googleCalendarItems`, `googleCalendarStatusLabel`, `googleCalendarLastError`, `googleCalendarStatusNote`, `isGoogleCalendarSelected`, `renderGoogleCalendarConnector` (7) |
| **E. Měsíční mřížka / render** | 5011–5303 | `normalizeCalendarMonth`, `shiftCalendarMonth`, `calendarMonthTitle`, `calendarDayNumber`, `calendarDayHeaderText`, `calendarCellEventTime`, `calendarEventDisplayEndDate`, `calendarEventDateRange`, `calendarEventDateLabel`, `renderCalendarMonthGrid`, `renderCalendarSourceList`, `renderCalendar`, `renderEventList` (13) |
| **F. DateTime helpery + cloud zdroje** | 14135–14400 | `buildCalendarDateTime`, `splitCalendarDateTime`, `normalizeCalendarType`, `cloudCalendarPayload`, `cloudLoadCalendarSources`, `ensureManualCalendarSource`, `mergeCalendarSources`, `addCalendarSourceFromForm`, `cloudAddCalendarSource`, `cloudSyncLocalCalendarSources`, `normalizeGoogleCalendarItem` (11) |
| **G. Google OAuth + edge** ⚠️ | 14392–14618 | `rememberGoogleCalendarError`, `googleCalendarNeedsOAuthReconnect`, `markGoogleCalendarMissingToken`, `startGoogleCalendarOAuthReconnect`, `readFunctionErrorMessage`, `invokeGoogleCalendarFunction`, `googleCalendarSourceSyncMs`, `googleCalendarAutoSyncNeeded`, `scheduleGoogleCalendarAutoSync`, `googleCalendarStart`, `googleCalendarListCalendars`, `saveGoogleCalendarSourcesFromForm`, `googleCalendarSync`, `googleCalendarDisconnect` (14) |
| **H. Handlery + cloud CRUD událostí** | 14665–14878 | `toggleCalendarSource`, `deleteCalendarSource`, `cloudAddCalendarEvent`, `cloudDeleteCalendarEvent`, `cloudLoadCalendar`, `cloudSyncCalendarById`, `cloudSyncLocalCalendar`, `addEventFromForm`, `deleteCalendarEvent` (9) |
| **I. OAuth návrat (zůstává v app.js)** | 18072+ | `hasGoogleCalendarReturnUrl` + větev v `handleInitialAuthReturn` |

> Pozn.: `buildPolishShopCalendarYear` / `polishShopCalendarAround` (1350, 1388) NEJSOU kalendář (polské svátky). `googleDisplayNameFromUser` (17958) je auth, ne kalendář.

---

## 2) Google OAuth – jak to funguje

- **Start připojení:** `googleCalendarStart()` → `invokeGoogleCalendarFunction('google-calendar-start', { returnTo: APP_PUBLIC_URL, cleanup })` → edge vrátí `authUrl` → **`window.location.href = data.authUrl`** (plný redirect na Google).
- **Token:** drží ho **edge funkce server-side** (Supabase, šifrovaný `GOOGLE_TOKEN_ENCRYPTION_KEY_BASE64`). Klient v `state.calendarCloud.googleConnection` má jen metadata (`status`, `tokenState`, `email`). **Klient token NIKDY nedrží** → extrakce se ho nedotkne.
- **Návrat z přihlášení:** Google přesměruje zpět na `APP_PUBLIC_URL?googleCalendar=connected`. V bootu app.js to chytí **`handleInitialAuthReturn()`**: `hasGoogleCalendarReturnUrl()` (hledá `?googleCalendar`), nastaví `activeModule='calendar'`, `moduleTabs.calendar='sources'`, a při `connected` auto-načte kalendáře (`googleCalendarListCalendars`) přes `GOOGLE_CALENDAR_CALLBACK_AUTOLOAD_FLAG`.
- **Token chybí / reconnect:** `markGoogleCalendarMissingToken`, `googleCalendarNeedsOAuthReconnect`, `startGoogleCalendarOAuthReconnect` (flag `GOOGLE_CALENDAR_RECONNECT_FLAG` v sessionStorage).

**Závěr:** OAuth start/sync/disconnect/list jsou kalendářové funkce (jdou do modulu). **Návrat (`handleInitialAuthReturn`) je ale v bootu app.js** a musí dál umět zavolat kalendářové funkce → přes wrappery. To je integrační šev.

---

## 3) Realtime sync mezi zařízeními – NEJCITLIVĚJŠÍ, ale generický

**Klíčové zjištění: realtime NENÍ kalendářový kód.** Je to sdílená infrastruktura v app.js:

- `setupCloudRealtimeSubscriptions(force)` (16202) — vytvoří **jeden generický kanál** `domacnost-plus-household-${householdId}` a přihlásí se na `postgres_changes` pro **VŠECHNY tabulky v `REALTIME_CLOUD_TABLES`** (ř.915), kde **jsou i `calendar_events` a `calendar_sources`** (ř.932–933).
- Na jakoukoli změnu (i z druhého zařízení) → `scheduleCloudRealtimeRefresh()` (16167) → po 1.2 s → `cloudLoadAllModules(false, { skipRealtimeSetup:true })` → **přebije VŠECHNY moduly včetně kalendáře** přes `cloudLoadCalendarSources` + `cloudLoadCalendar` (16570–16571).
- Stav kanálu: `cloudRealtimeChannel`, `cloudRealtimeHouseholdId`, `cloudRealtimeReloading`, `cloudRealtimeReloadTimer` (modulové proměnné app.js).
- `setupCloudRealtimeSubscriptions` se volá z ~7 míst (boot, login, household switch, warm start…).

**Funkce, co sync „obsluhují" z pohledu kalendáře:** žádná vlastní — kalendář se jen **veze** v generickém reloadu. Jediné, co realtime potřebuje od kalendáře, je **funkční `cloudLoadCalendar` + `cloudLoadCalendarSources`**.

**Závěr:** `setupCloudRealtimeSubscriptions`, `scheduleCloudRealtimeRefresh`, `disposeCloudRealtime`, `cloudLoadAllModules`, konstanta `REALTIME_CLOUD_TABLES` → **VŠE zůstává v app.js**. Extrakce kalendáře se realtime kódu nedotkne. Riziko pro sync = jen jestli wrappery `cloudLoadCalendar*` fungují 1:1.

---

## 4) Edge funkce (`google-calendar-*`)

Jediný vstupní bod: **`invokeGoogleCalendarFunction(functionName, body, showMessage)`** (14467) → `client.functions.invoke(functionName, { body })`.

Volané edge funkce:
- `google-calendar-start` (OAuth start, vrací authUrl) — z `googleCalendarStart`
- `google-calendar-list-calendars` (seznam kalendářů) — z `googleCalendarListCalendars`
- `google-calendar-sync` (stáhne události do Supabase) — z `googleCalendarSync`
- `google-calendar-disconnect` — z `googleCalendarDisconnect`

`invokeGoogleCalendarFunction` má **těžké závislosti** (proto vysoké riziko): `getSupabaseClient`, `refreshCloudSession`, `cloudLoadHouseholds`, `resetLocalWorkspaceForCloudUser`, `bootstrapCloudHousehold`, `cloudReady`, `currentProfileId`, `rememberGoogleCalendarError`, `readFunctionErrorMessage`, `state.cloud`, `showToast`. Po úspěchu `google-calendar-sync` volá `cloudLoadCalendar(false)` (stáhne nově upsertnuté události) a edge zápis zároveň spustí realtime na druhém zařízení.

---

## 5) Sdílený state – klíče a ukládání

| Klíč | Co drží | Zápis |
|------|---------|-------|
| `state.calendar` (15×) | pole událostí (lokální + cloud, `cloudId`) | push/filter/map → `saveState()` |
| `state.calendarCloud` (40×) | **vše ostatní:** `sources` (zdroje kalendáře – ZDE žijí, ne v samostatném klíči), `googleConnection`, `googleCalendars`, `googleLastError`, `googleLastSyncAt`, `googleCalendarsLoadedAt` | merge → `saveState()` |
| `state.calendarSources` | **neexistuje** (0×) — zdroje jsou v `state.calendarCloud.sources` | — |

- `getCalendarSources()` = `state.calendarCloud?.sources`.
- Cloud: události v Supabase tabulce `calendar_events`, zdroje v `calendar_sources`. Lokálně přes `saveState()` (a tedy i IndexedDB záloha z v301).
- **Coupling:** `state.calendarCloud` (a `state.settings` přes moduleTabs) se může serializovat i přes generický `cloudSaveHouseholdUiSettings` — ověřit při extrakci, ať se Google connection neztratí.
- UI stav: `calendarViewMonth` (modulová proměnná app.js – měsíc mřížky), `googleCalendarDetailsOpen`, `moduleTabs.calendar`. `calendarViewMonth` se mění i odjinud (např. reset) → buď get/set accessor (jako finance edit-id), nebo ověřit, kdo všechno ji sahá.

---

## 6) Co volá dashboard z kalendáře (Home widget „Další událost")

Dashboard/hero/overview v app.js silně používá kalendářové helpery (řádky mimo blok kalendáře):
- **`upcomingCalendarEvents(now)`** — 3118, a context builder 11288–11290 (`todayEvents`, `upcomingEvents`, `calendarPanelEvents`)
- **`calendarEventIsRunning(event, now)`** — 2828, 3118-3119, 3721-3723, 4291, 4475 (hero „běží", focus items, detail modal)
- **`calendarEventMetaLabel`** — 2837, 4290, 4475-4476
- **`calendarEventTimeLabel`** — 2843, 3727 (hero „Další událost": `${calendarEventTimeLabel(next)} · ${firstTitle(next)}`)

Hero widget „Další událost" (~3721): `upcomingCalendarEvents(now)` → `next` → `calendarEventIsRunning` + `calendarEventTimeLabel`. Tyhle 4 funkce (+`visibleCalendarEvents`) jsou **malé čisté čtecí funkce** → musí mít **wrappery** (stejně jako `getHdoStatus` / `subscriptionMonthSummary`).

---

## Co předat přes deps

**Stav (přes `getState()`):** `state.calendar`, `state.calendarCloud`, `state.cloud`, `state.settings`, `state.household`.

**UI stav (get/set accessor, zůstává v app.js):** `calendarViewMonth`, `googleCalendarDetailsOpen`, `moduleTabs.calendar` (přes `getModuleTab`/`writeModuleTab`).

**Realtime (zůstává v app.js, NEpředává se do modulu):** `setupCloudRealtimeSubscriptions`, `scheduleCloudRealtimeRefresh`, `cloudLoadAllModules`, `REALTIME_CLOUD_TABLES`. Modul jen poskytuje `cloudLoadCalendar` / `cloudLoadCalendarSources`, které app.js volá.

**OAuth / edge (deps do modulu):** `getSupabaseClient`, `refreshCloudSession`, `cloudLoadHouseholds`, `bootstrapCloudHousehold`, `resetLocalWorkspaceForCloudUser`, `cloudReady`, `cloudSaveHouseholdUiSettings`, `APP_PUBLIC_URL`, konstanty `GOOGLE_CALENDAR_RECONNECT_FLAG`, `GOOGLE_CALENDAR_CALLBACK_AUTOLOAD_FLAG`, `GOOGLE_CALENDAR_AUTO_SYNC_MAX_AGE_MS`, `sessionStorage`, `getActiveModule`/`setActiveModule` (OAuth návrat nastavuje `activeModule='calendar'`).

**OAuth návrat (zůstává v app.js boot):** `handleInitialAuthReturn` + `hasGoogleCalendarReturnUrl` zůstanou v app.js, jen budou volat kalendářové wrappery (`googleCalendarListCalendars`).

**Utils:** `escapeHtml`, `normalizeText`, `uid`, `todayISO`, `formatDate`, `formatDateTime`, `field`, `selectField`, `renderSectionTabs`, `renderEmpty`, `renderEmptyCta`, `currentHouseholdId`, `currentProfileId`, `showToast`, `saveState`, `touchState`, `render`, `requestRender`, `runWhenUiQuiet`, `withMutedToasts`, `firstTitle`, `parseDateValue` + časové helpery.

**Wrappery (volané z app.js – dashboard, boot, realtime, handlery):** `upcomingCalendarEvents`, `calendarEventIsRunning`, `calendarEventTimeLabel`, `calendarEventMetaLabel`, `visibleCalendarEvents`, `renderCalendar`, `renderCalendarEventDetailModal`, `findCalendarEventById`, `cloudLoadCalendar`, `cloudLoadCalendarSources`, `addEventFromForm`, `deleteCalendarEvent`, `addCalendarSourceFromForm`, `saveGoogleCalendarSourcesFromForm`, `toggleCalendarSource`, `deleteCalendarSource`, `cloudSyncCalendarById`, `cloudSyncLocalCalendar`, `cloudSyncLocalCalendarSources`, `googleCalendarStart`, `googleCalendarListCalendars`, `googleCalendarSync`, `googleCalendarDisconnect`, `startGoogleCalendarOAuthReconnect`, `scheduleGoogleCalendarAutoSync`, `googleCalendarConnection`, `normalizeGoogleCalendarItem` (~28).

---

## KDE je největší riziko

1. **🔴 OAuth redirect + návrat (nejvyšší).** `googleCalendarStart` dělá plný `window.location.href` redirect; návrat řeší `handleInitialAuthReturn` v bootu app.js. Riziko: po extrakci musí boot dál správně zavolat `googleCalendarListCalendars` (wrapper) + nastavit `activeModule`/`moduleTabs`. Lazy getter modulu se vytvoří až při prvním volání — ověřit, že to při bootu po návratu nespadne (modul načtený přes `<script defer>` před app.js → OK, ale otestovat).
2. **🔴 `invokeGoogleCalendarFunction` deps.** Sahá na `cloudLoadHouseholds`, `bootstrapCloudHousehold`, `resetLocalWorkspaceForCloudUser` — těžká auth/household infra. Když se některá nepředá → tichý ReferenceError při syncu.
3. **🟠 `state.calendarCloud` coupling.** Google connection + zdroje žijí v `calendarCloud`, který možná serializuje i `cloudSaveHouseholdUiSettings`. Riziko ztráty Google připojení / zdrojů při ukládání. Ověřit, jestli se `calendarCloud.sources`/`googleConnection` posílají do household UI settings.
4. **🟡 Realtime reload (střední, ale generický).** Sám kanál zůstává v app.js. Riziko jen pokud wrapper `cloudLoadCalendar`/`cloudLoadCalendarSources` změní časování zápisu (`state.calendar = [...]` → `saveState`). Verbatim přesun to drží 1:1.
5. **🟡 `calendarViewMonth` / dashboard helpery.** Musí mít wrappery, jinak Home „Další událost" spadne při renderu (jako kdyby chyběl `getHdoStatus`).

---

## Doporučení: extrahovat PO ČÁSTECH (2 fáze)

Vzhledem k tomu, že **realtime zůstává v app.js** (nízké riziko) a **OAuth/edge je nejrizikovější**, doporučuju rozdělit:

### Část A – „bezpečné jádro" (nejdřív, samostatný commit)
Render + event/dashboard helpery + zdroje (zobrazení) + lokální/cloud CRUD událostí + DateTime helpery:
oblasti **A, B, C, E, F (bez cloud zdrojů Google), H**. Tj. `renderCalendar`, mřížka, `upcomingCalendarEvents` & spol., `cloudLoadCalendar`, `cloudAddCalendarEvent`, `addEventFromForm`, `deleteCalendarEvent`, `addCalendarSourceFromForm`…
→ **Ověření:** přidat/smazat událost, měsíční mřížka, Home „Další událost", **cross-device sync ruční události** (realtime reload), perzistence po restartu. Tady se NESAHÁ na Google OAuth → realtime a login se netknou.

### Část B – „Google OAuth + edge" (až po ověření části A, zvlášť)
Oblasti **D, G** + `googleCalendarSync`/`Start`/`ListCalendars`/`Disconnect`/`invokeGoogleCalendarFunction`/auto-sync + integrace s `handleInitialAuthReturn`.
→ **Ověření:** připojit Google, návrat z přihlášení, načíst kalendáře, spustit sync, **cross-device sync Google událostí**, odpojit, reconnect při chybějícím tokenu.

**Proč ne naráz:** OAuth redirect/return + `invokeGoogleCalendarFunction` heavy-deps + edge jsou jediná část s reálným rizikem rozbití přihlášení/syncu. Oddělením se dá část A nasadit a ověřit (cross-device sync ručních událostí funguje), a teprve pak riskovat Google vrstvu se zaměřeným testem loginu. Pokud část A projde čistě, část B je menší a izolovaná.

> Pokud bys přesto chtěl naráz: jde to (vzor je ověřený 6×), ale test po nasazení musí pokrýt **login přes Google + cross-device sync v obou směrech** dřív, než se na to spolehneš.

---

## Pořadí `<script>` (po extrakci)
`...finance.js → subscriptions.js → calendar.js → app.js` (calendar.js před app.js, registruje `window.DomacnostCalendar` dřív, než app.js poprvé volá getter — důležité kvůli OAuth návratu v bootu) + do `sw.js` APP_ASSETS.
