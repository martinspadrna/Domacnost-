# Diagnostika synchronizace – proč sync mlčí

Datum: 2026-06-19  
Větev: sync-diagnostika  
Soubor: app.js (24 083 řádků)  
Fáze: **POUZE čtení – žádné změny kódu**

---

## 1. Co dělají tlačítka krok po kroku

### `cloud-run-autosync-now` → `runCloudAutosyncNow(true)` (L20751)

```
1. cloudReady()? → NE → toast "Nejdřív napoj..." → return false
2. isDemoOnlyState()? → ANO → return false (tiché!)
3. cloudLocalPendingCount() === 0? → ANO → toast "Cloud je aktuální" → return true  ← ⚠️ ŽÁDNÝ PULL
4. cloudAutosyncRunning = true
5. await cloudSyncLocalPendingData(false)     ← PUSH: lokální → cloud
6. await cloudLoadAllModules(false, { skipRealtimeSetup: true, silentWhenOffline: true })  ← PULL
7. Výsledek: toast "Lokální záznamy jsou v cloudu" nebo "X položek chce ruční kontrolu"
catch → console.warn (tiché!)
```

**KLÍČOVÝ PROBLÉM:** Krok 3 – pokud zařízení B nemá žádné lokálně nesyncované položky
(`cloudId` je nastavené na všem), funkce **okamžitě vrátí `true`** s toastem "Cloud je aktuální"
a **neprovede žádný pull z cloudu**. Tlačítko "Synchronizovat teď" je PUSH-only.

---

### `cloud-load-all` → `cloudLoadAllModules(true)` (L21213)

```
1. !state.cloud?.userId || !state.cloud?.householdId → toast "Nejdřív napoj..." → return
   (Poznámka: nekontroluje provider === 'supabase', na rozdíl od cloudReady())
2. Pro každý ze 15 loaderů:
   try { await loader(false) } catch (e) { console.warn(...) }  ← každý selhání je tiché!
3. state.cloud.lastSyncAt = now → saveState() → render()
4. setupCloudRealtimeSubscriptions(false)  ← spustí realtime pokud neběží
5. showToast("Cloud načten: X/15 částí")
```

Toto tlačítko **skutečně stahuje vše z cloudu** (pokud podmínka v kroku 1 projde).
Pokud neprojde nebo loader selže → tiché selhání, jen `console.warn`.

---

### `cloud-start-realtime` → `setupCloudRealtimeSubscriptions(true)` (L20873)

```
1. !cloudReady() || isDemoOnlyState() → disposeCloudRealtime() → return false (tiché!)
2. getSupabaseClient() – pokud není okno.supabase → realtimeStatus='unsupported' → return false
3. Pokud channel existuje a householdId se nezměnil a force=false → return true (skip)
4. disposeCloudRealtime() – zrušení starého kanálu
5. channel = client.channel('domacnost-plus-household-{id}')
6. Pro každou tabulku v REALTIME_CLOUD_TABLES (24 tabulek):
   channel.on('postgres_changes', { filter: household_id=eq.{id} }, scheduleCloudRealtimeRefresh)
7. channel.subscribe(status => { realtimeStatus = status === 'subscribed' ? 'online' : status })
8. return true
```

**Žádná async/await** – subscribe je callback, neví se kdy se dokončí.
Status 'subscribed' vs. cokoliv jiného (channel_error, timed_out, closed) závisí na Supabase.

---

## 2. Realtime – za jakých podmínek se spustí a kdy ne

### Automatické spuštění při bootu

```
Boot (app.js)
  ↓ 6.2s delay
scheduleCloudWarmStart() → cloudWarmStartLoad()
  - refreshCloudSession()
  - cloudLoadHouseholds()
  - cloudLoadHouseholdUiSettings()
  - cloudLoadProfilesForCurrentHousehold()
  - scheduleBootBackgroundCloudLoad()  ← 60s delay!
                        ↓ 60 sekund po bootu
              cloudBackgroundLoadAllModules()
                - cloudLoadModuleForNav() pro každý modul
                - setupCloudRealtimeSubscriptions(false)  ← TEĎ TEPRVE realtime!
```

**Realtime se spustí nejdříve 60+ sekund po startu aplikace.**
Pokud uživatel zavře app do 60s, realtime se nikdy nespustí.

### Další místa, kde se realtime spouští

| Kde | Podmínka |
|-----|----------|
| `cloudBackgroundLoadAllModules` (L21203) | Po 60s background load |
| `cloudLoadAllModules` (L21250) | Jen pokud `!options.skipRealtimeSetup` |
| `cloudSyncLocalPendingData` (L21109) | Po manuálním "Dohnat lokální → cloud" |
| `cloud-start-realtime` button (L22167) | Manuálně |

**Realtime se NESPUSTÍ z:** `runCloudAutosyncNow` (volá cloudLoadAllModules se `skipRealtimeSetup: true`).

---

## 3. Všechna místa, kde sync může tiše selhat

### A) Podmínkové early-return (bez chybové hlášky)

| Místo | Podmínka | Efekt |
|-------|----------|-------|
| `scheduleCloudAutosync` L20724 | `!cloudReady() \|\| isDemoOnlyState()` | tiché return |
| `scheduleCloudAutosync` L20725 | `autoSyncEnabled === false` | tiché return |
| `scheduleCloudAutosync` L20726 | `cloudAutosyncRunning \|\| realtimeReloading \|\| suppressToastDepth > 0` | tiché return |
| `scheduleCloudAutosync` L20729 | `cloudLocalPendingCount() === 0` | tiché return ← **klíčové** |
| `scheduleCloudAutosync` L20730 | `Date.now() - lastAttempt < 6500ms` | throttle, tiché |
| `runCloudAutosyncNow` L20763 | `pending === 0` | "Cloud je aktuální", žádný pull |
| `setupCloudRealtimeSubscriptions` L20874 | `!cloudReady() \|\| isDemoOnlyState()` | tiché return false |
| `setupCloudRealtimeSubscriptions` L20879 | `!client?.channel` | status='unsupported', return false |
| `cloudWarmStartLoad` L21120 | `cloudWarmStartDone && !force` | tiché return (jen při 2. spuštění) |
| `cloudWarmStartLoad` L21135 | `!state.cloud?.householdId` | tiché return, žádný load |
| `scheduleBootBackgroundCloudLoad` L20518 | `!cloudReady()` | tiché return |

### B) Prázdné / logující catch bloky

| Funkce | Catch chování |
|--------|--------------|
| `cloudLoadAllModules` (každý loader) | `console.warn('Cloud load module failed', error)` |
| `cloudBackgroundLoadAllModules` | `console.warn('Background module load failed', moduleId, error)` |
| `cloudSyncLocalPendingData` (každý syncer) | `console.warn('Cloud pending sync failed', error)` |
| `runCloudAutosyncNow` | `console.warn('Cloud autosync failed', error)` |
| `scheduleCloudAutosync` deferred run | `console.warn('Cloud autosync deferred run failed', error)` |
| `scheduleCloudRealtimeRefresh` | `console.warn('Realtime cloud refresh failed', error)` |
| `disposeCloudRealtime` | `console.warn('Realtime remove failed', error)` |
| `refreshCloudSession` realtime auth | `console.warn('Realtime auth refresh failed', error)` |

→ Všechna selhání sítě/RLS jsou v konzoli, ale uživatel je nevidí.

### C) Chybějící await / async trap

`setupCloudRealtimeSubscriptions` je synchronní funkce – volá `channel.subscribe(callback)`,
ale výsledek (`status`) přijde asynchronně přes callback. Není žádný await na "subscribed".
Pokud Supabase odmítne subscribe (RLS, síť), funkce vrátí `true` (sestavila kanál), ale
callback nikdy nedostane `'subscribed'` → `realtimeStatus` zůstane `'connecting'`.

### D) Podmínka `cloudReady()` vs. `userId + householdId`

`cloudReady()` = `userId AND householdId AND provider === 'supabase'`  
`cloudLoadAllModules` a `cloudBackgroundLoadAllModules` kontrolují jen `userId AND householdId` (bez provider check).
→ Konzistentní to není, ale v praxi to neblokuje – je-li userId nastavené, provider je 'supabase'.

---

## 4. Předpoklady pro funkční sync

### Nutné podmínky (bez kterých sync neběží vůbec)

| Podmínka | Kde se kontroluje | Co když není |
|----------|-------------------|-------------|
| `state.cloud.userId` nastavené | cloudReady(), cloudLoadAllModules | tiché blokování |
| `state.cloud.householdId` nastavené | cloudReady(), všechny loadery | tiché blokování |
| `state.cloud.provider === 'supabase'` | cloudReady() | tiché blokování |
| `window.supabase` (CDN knjhovna načtená) | getSupabaseClient() | null client, tichý fail |
| Platná session (refreshToken nebo accessToken) | refreshCloudSession() → getUser() | resetSignedOutAppState() |
| `isDemoOnlyState() === false` | cloudReady(), všude | tiché blokování |
| `autoSyncEnabled !== false` | scheduleCloudAutosync | autosync se neplánuje |

### Podmínky pro realtime (navíc)

| Podmínka | Co když není |
|----------|-------------|
| Supabase Realtime povolené v projektu | status: 'unsupported' nebo 'channel_error' |
| RLS politiky pro realtime na tabulkách | subscribe selže tiše |
| `cloudRealtimeChannel === null` nebo `force=true` | přeskočí setup (existující kanál se neobnovuje) |
| Stabilní WebSocket připojení | status: 'timed_out' nebo 'closed' |

### Co lze ověřit za běhu

```js
// V konzoli prohlížeče:
state = JSON.parse(localStorage.getItem('domacnostPlus.appState'))
state?.cloud?.userId        // musí být neprázdný string
state?.cloud?.householdId   // musí být neprázdný string
state?.cloud?.provider      // musí být 'supabase'
state?.cloud?.status        // musí být 'signed-in'
state?.cloud?.realtimeStatus  // 'online' = funguje, jinak ne
state?.cloud?.lastSyncAt    // kdy proběhl poslední sync
state?.settings?.demoMode   // musí být false/undefined
```

---

## 5. Ověřovací kroky pro tebe

### Krok 1 – ověř stav cloud připojení (konzole)

```js
const s = JSON.parse(localStorage.getItem('domacnostPlus.appState'));
console.table({
  userId: s?.cloud?.userId,
  householdId: s?.cloud?.householdId,
  provider: s?.cloud?.provider,
  status: s?.cloud?.status,
  realtimeStatus: s?.cloud?.realtimeStatus,
  autoSyncEnabled: s?.cloud?.autoSyncEnabled,
  demoMode: s?.settings?.demoMode,
  lastSyncAt: s?.cloud?.lastSyncAt
});
```

**Očekáváš:** userId = string (UUID), householdId = string (UUID), provider = 'supabase',
status = 'signed-in', autoSyncEnabled = true nebo undefined, demoMode = false/undefined.

Pokud householdId chybí na jednom zařízení → to je root cause. Sync je blokovaný na prvním kroku.

---

### Krok 2 – zkontroluj konzoli při kliknutí "Načíst vše z cloudu"

Otevři DevTools → Console → klikni na tlačítko.

**Hledáš:**
- `Cloud load module failed` + chybová zpráva → síťová chyba nebo RLS
- `Nejdřív napoj...` toast → userId nebo householdId chybí
- Žádný výstup → funkce se ani nevolá (bug v handleru?)
- `Cloud načten: X/15 částí` – kolik loaderů uspělo? (X < 15 = část selhala)

---

### Krok 3 – zkontroluj Network tab při "Načíst vše z cloudu"

DevTools → Network → filtr `supabase` nebo `rest/v1`

**Hledáš:**
- Jdou vůbec requesty na Supabase? (jestli ne → client není inicializovaný)
- Status kódy: 200 = OK, 401 = neplatná session, 403 = RLS blokuje, 0/failed = síť
- Odpovědi: obsahují data? Nebo prázdné pole `[]`?

Konkrétně pro slevové karty: hledej request na tabulku `household_coupons`.

---

### Krok 4 – ověř realtime status

Po 60s od spuštění (nebo po kliknutí "Zapnout živé změny"):

```js
const s = JSON.parse(localStorage.getItem('domacnostPlus.appState'));
s?.cloud?.realtimeStatus  // 'online' = funguje
```

Nebo: na obrazovce Cloud (v Nastavení) je mini-stat "Realtime" – musí ukazovat "živě".

Pokud ukazuje `connecting` déle než 10s → Supabase realtime blokuje (RLS nebo síť).

---

### Krok 5 – ověř Supabase dashboard

Přihlásit se do supabase.com → projekt → **Table Editor → household_coupons** (nebo jiná tabulka):

- Jsou tam záznamy od zařízení A? (pokud ne → push nikdy neproběhl → device A má bug v uploadu)
- Mají záznamy správné `household_id` = to, které je v `state.cloud.householdId` obou zařízení?

Pak: **Supabase → Authentication → Users** – jsou obě zařízení pod stejným user ID?

Pak: **Supabase → Database → Replication** – jsou tabulky zapnuté pro realtime?
(Každá tabulka v REALTIME_CLOUD_TABLES musí být v Publication `supabase_realtime`.)

---

## 6. Nejpravděpodobnější příčiny (v pořadí pravděpodobnosti)

1. **Slevové karty nikdy nedoputovaly do Supabase** – device A je nepushoval (autosync nenašel pending, nebo push selhal tiše). Ověř Krok 5.

2. **"Synchronizovat teď" je PUSH-only** – device B nemá local pending → tlačítko vrátí "Cloud je aktuální" bez pull. Správné tlačítko pro pull je **"Načíst vše z cloudu"**.

3. **Realtime není aktivní** – device B nemá realtime (timeout, RLS, 60s boot delay). Nová data z device A ho nikdy neprobudí. Ověř Krok 4.

4. **householdId nesedí** – jedno zařízení má jiný household. Ověř Krok 1 na obou zařízeních.

5. **RLS blokuje** – tabulka `household_coupons` nebo jiná má RLS políkdu, která nedovolí SELECT nebo INSERT pro daného uživatele/domácnost. Ověř Krok 3 (403) nebo Krok 5.
