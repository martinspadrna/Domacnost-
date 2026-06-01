(() => {
  'use strict';

  const APP_VERSION = 'Domácnost+ v.0.1_44';
  const STORAGE_KEY = 'domacnostPlus.v0.1_44';
  const PREVIOUS_STORAGE_KEY = 'domacnostPlus.v0.1_43';
  const LEGACY_STORAGE_KEYS = [PREVIOUS_STORAGE_KEY, 'domacnostPlus.v0.1_42', 'domacnostPlus.v0.1_41', 'domacnostPlus.v0.1_39', 'domacnostPlus.v0.1_38', 'domacnostPlus.v0.1_37', 'domacnostPlus.v0.1_36', 'domacnostPlus.v0.1_35', 'domacnostPlus.v0.1_34', 'domacnostPlus.v0.1_33', 'domacnostPlus.v0.1_32', 'domacnostPlus.v0.1_31', 'domacnostPlus.v0.1_30', 'domacnostPlus.v0.1_29', 'domacnostPlus.v0.1_28', 'domacnostPlus.v0.1_27', 'domacnostPlus.v0.1_26', 'domacnostPlus.v0.1_24', 'domacnostPlus.v0.1_23', 'domacnostPlus.v0.1_21', 'domacnostPlus.v0.1_20', 'domacnostPlus.v0.1_19', 'domacnostPlus.v0.1_18', 'domacnostPlus.v0.1_17', 'domacnostPlus.v0.1_16', 'domacnostPlus.v0.1_14', 'domacnostPlus.v0.1_13', 'domacnostPlus.v0.1_12', 'domacnostPlus.cloud.v1.2.911', 'domacnostPlus.cloud.v1.1.910', 'homeWebOffline.v1.0.909', 'homeWebOffline.v0.9.908', 'homeWebOffline.v0.8.907', 'homeWebOffline.v0.7.906', 'homeWebOffline.v0.6.905', 'homeWebOffline.v0.5.904', 'homeWebOffline.v0.4.903', 'homeWebOffline.v0.3.902', 'homeWebOffline.v0.2.901', 'homeWebOffline.v0.1.900'];

  const MODULES = [
    { id: 'home', label: 'Domů', icon: '🏠' },
    { id: 'calendar', label: 'Kalendář', icon: '📅' },
    { id: 'packages', label: 'Balíky', icon: '📦' },
    { id: 'shopping', label: 'Nákupy', icon: '🛒' },
    { id: 'homecare', label: 'Domácnost', icon: '💡' },
    { id: 'garage', label: 'Garáž', icon: '🚗' },
    { id: 'contracts', label: 'Smlouvy', icon: '📄' },
    { id: 'cameras', label: 'Kamery', icon: '📹' },
    { id: 'finance', label: 'Finance', icon: '💰' },
    { id: 'settings', label: 'Nastavení', icon: '⚙️' }
  ];



  const SHOPPING_UNITS = [
    ['ks', 'ks'], ['g', 'g'], ['kg', 'kg'], ['ml', 'ml'], ['l', 'l'], ['bal', 'balení'], ['krab', 'krabice'], ['lahev', 'láhev'], ['plech', 'plechovka'], ['role', 'role'], ['sacek', 'sáček'], ['m', 'm'], ['jine', 'jiné']
  ];

  const SHOPPING_CATEGORIES = [
    ['Ovoce a zelenina', '🥦'], ['Pečivo', '🥐'], ['Mléčné', '🥛'], ['Maso a uzeniny', '🥩'], ['Ryby', '🐟'], ['Trvanlivé', '🥫'], ['Mražené', '🧊'], ['Nápoje', '🥤'], ['Drogerie', '🧴'], ['Domácnost', '🏠'], ['Děti', '🧸'], ['Zvířata', '🐾'], ['Lékárna', '💊'], ['Ostatní', '🛒']
  ];

  const CONTRACT_TYPE_OPTIONS = [
    ['car_insurance', 'Pojištění auta'],
    ['home_insurance', 'Pojištění domácnosti'],
    ['property_insurance', 'Pojištění nemovitosti'],
    ['electricity', 'Elektřina'],
    ['gas', 'Plyn'],
    ['water', 'Voda'],
    ['internet', 'Internet'],
    ['mobile', 'Mobil / paušál'],
    ['subscription', 'Předplatné'],
    ['loan', 'Úvěr / půjčka'],
    ['leasing', 'Leasing'],
    ['service', 'Servis / služba'],
    ['other', 'Jiné']
  ];

  const TASK_CATEGORY_OPTIONS = [
    ['domacnost', 'Domácnost'],
    ['uklid', 'Úklid'],
    ['udrzba', 'Údržba'],
    ['nakupy', 'Nákupy'],
    ['zahrada', 'Zahrada'],
    ['auto', 'Auto'],
    ['finance', 'Finance'],
    ['zdravi', 'Zdraví'],
    ['ostatni', 'Ostatní']
  ];

  const TASK_PRIORITY_OPTIONS = [
    ['low', 'Nízká'],
    ['normal', 'Normální'],
    ['high', 'Vysoká'],
    ['urgent', 'Urgentní']
  ];

  const FINANCE_CATEGORY_OPTIONS = [
    ['salary', 'Výplata', 'income'],
    ['bonus', 'Bonus / odměna', 'income'],
    ['sale', 'Prodej', 'income'],
    ['other_income', 'Ostatní příjem', 'income'],
    ['groceries', 'Potraviny', 'expense'],
    ['drugstore', 'Drogerie', 'expense'],
    ['housing', 'Bydlení', 'expense'],
    ['energy', 'Energie', 'expense'],
    ['car', 'Auto', 'expense'],
    ['kids', 'Děti', 'expense'],
    ['health', 'Zdraví', 'expense'],
    ['fun', 'Zábava', 'expense'],
    ['restaurant', 'Restaurace', 'expense'],
    ['subscription', 'Předplatné', 'expense'],
    ['contracts', 'Smlouvy / pojistky', 'expense'],
    ['other_expense', 'Ostatní výdaj', 'expense']
  ];

  const DEFAULT_SHOPPING_CATALOG = [
    ['Banány','kg','Ovoce a zelenina'], ['Jablka','kg','Ovoce a zelenina'], ['Hrušky','kg','Ovoce a zelenina'], ['Pomeranče','kg','Ovoce a zelenina'], ['Citrony','ks','Ovoce a zelenina'], ['Rajčata','kg','Ovoce a zelenina'], ['Okurka','ks','Ovoce a zelenina'], ['Paprika','ks','Ovoce a zelenina'], ['Brambory','kg','Ovoce a zelenina'], ['Cibule','kg','Ovoce a zelenina'], ['Česnek','ks','Ovoce a zelenina'], ['Mrkev','kg','Ovoce a zelenina'], ['Salát','ks','Ovoce a zelenina'],
    ['Rohlíky','ks','Pečivo'], ['Chléb','ks','Pečivo'], ['Toustový chléb','ks','Pečivo'], ['Bagety','ks','Pečivo'],
    ['Máslo','ks','Mléčné'], ['Mléko','l','Mléčné'], ['Jogurt','ks','Mléčné'], ['Tvaroh','ks','Mléčné'], ['Sýr plátkový','bal','Mléčné'], ['Sýr eidam','g','Mléčné'], ['Smetana','ks','Mléčné'], ['Vejce','bal','Mléčné'],
    ['Kuřecí maso','kg','Maso a uzeniny'], ['Vepřové maso','kg','Maso a uzeniny'], ['Hovězí maso','kg','Maso a uzeniny'], ['Mleté maso','kg','Maso a uzeniny'], ['Šunka','g','Maso a uzeniny'], ['Salám','g','Maso a uzeniny'], ['Párky','bal','Maso a uzeniny'], ['Losos','g','Ryby'], ['Tuňák','plech','Ryby'],
    ['Rýže','kg','Trvanlivé'], ['Těstoviny','bal','Trvanlivé'], ['Mouka hladká','kg','Trvanlivé'], ['Mouka polohrubá','kg','Trvanlivé'], ['Cukr','kg','Trvanlivé'], ['Sůl','kg','Trvanlivé'], ['Olej','l','Trvanlivé'], ['Kečup','ks','Trvanlivé'], ['Hořčice','ks','Trvanlivé'], ['Káva','bal','Trvanlivé'], ['Čaj','bal','Trvanlivé'],
    ['Pizza mražená','ks','Mražené'], ['Hranolky mražené','bal','Mražené'], ['Zelenina mražená','bal','Mražené'], ['Zmrzlina','ks','Mražené'],
    ['Voda neperlivá','lahev','Nápoje'], ['Voda perlivá','lahev','Nápoje'], ['Minerálka','lahev','Nápoje'], ['Džus','l','Nápoje'], ['Cola','lahev','Nápoje'],
    ['Toaletní papír','bal','Drogerie'], ['Papírové kapesníky','bal','Drogerie'], ['Kuchyňské utěrky','role','Drogerie'], ['Jar','ks','Drogerie'], ['Tablety do myčky','bal','Drogerie'], ['Prací gel','ks','Drogerie'], ['Aviváž','ks','Drogerie'], ['Šampon','ks','Drogerie'], ['Sprchový gel','ks','Drogerie'], ['Zubní pasta','ks','Drogerie'], ['Zubní kartáček','ks','Drogerie'],
    ['Pytle na odpad','role','Domácnost'], ['Alobal','role','Domácnost'], ['Potravinová fólie','role','Domácnost'], ['Baterie AA','bal','Domácnost'], ['Baterie AAA','bal','Domácnost'],
    ['Granule pro psa','kg','Zvířata'], ['Granule pro kočku','kg','Zvířata'], ['Kapsičky pro kočku','ks','Zvířata'], ['Stelivo pro kočku','kg','Zvířata'], ['Paralen','bal','Lékárna'], ['Ibalgin','bal','Lékárna'], ['Náplasti','bal','Lékárna'], ['Dezinfekce','ks','Lékárna']
  ].map(([name, unit, category]) => ({ id: `default-${normalizeKeySeed(name)}`, name, defaultUnit: unit, category, householdId: '', source: 'default' }));

  function normalizeKeySeed(value) {
    return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  const DEFAULT_BOTTOM_NAV_IDS = ['home', 'calendar', 'shopping', 'homecare'];
  const BOTTOM_NAV_MIN = 3;
  const BOTTOM_NAV_MAX = 5;
  const MORE_MODULE = { id: 'more', label: 'Více', icon: '•••' };
  const FILE_DB_NAME = 'homeWebOfflineFiles.v1';
  const FILE_STORE_CONTRACTS = 'contractFiles';
  const SUPABASE_URL = 'https://cgshssdjgzzuprlwnabl.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_v7jeuZC-MNUEO5nfE5xcUQ_Pu9pT-X_';
  const SUPABASE_STORAGE_KEY = 'domacnost-plus-auth';
  const APP_PUBLIC_URL = 'https://domacnost-plus.vercel.app/';
  const DEMO_SESSION_KEY = 'domacnostPlus.demoStartedThisSession';
  const BRAND_ICON_SRC = './assets/domacnost-plus-icon-180-v0-1-44.png';

  const MANAGED_MODULE_IDS = MODULES
    .filter((module) => !['home', 'settings'].includes(module.id))
    .map((module) => module.id);

  const DEFAULT_STATE = {
    meta: {
      schemaVersion: 43,
      appBuild: 44,
      mode: 'demo-gated-start-logo-fix',
      createdAt: '',
      updatedAt: ''
    },
    settings: {
      theme: 'light',
      dashboardNote: 'Domácí přehled je připravený na cloud. Každý si nastaví vlastní domácnost, profily a zapnuté moduly.',
      cloudEnabled: false,
      bottomNavIds: [...DEFAULT_BOTTOM_NAV_IDS]
    },
    household: {
      id: '',
      name: '',
      isConfigured: false,
      createdAt: ''
    },
    profiles: [],
    activeProfileId: '',
    enabledModules: [...MANAGED_MODULE_IDS],
    calendar: [],
    packages: [],
    coupons: [],
    hdoWindows: [],
    shopping: [],
    shoppingCatalogCustom: [],
    shoppingCloud: { units: [], categories: [], catalog: [], activeListId: '', loadedAt: '' },
    hdoCloud: { settingId: '', loadedAt: '' },
    wasteCloud: { types: [], loadedAt: '' },
    parcelsCloud: { loadedAt: '' },
    tasksCloud: { loadedAt: '' },
    calendarCloud: { sources: [], loadedAt: '' },
    shoppingStats: {},
    pwa: { installed: false, lastUpdateCheck: '', lastInstallPrompt: '', diagnostics: null },
    homeTasks: [],
    waste: [],
    notes: [],
    devices: [],
    vehicles: [],
    fuel: [],
    services: [],
    contracts: [],
    contractFiles: [],
    cameras: [],
    finance: [],
    financeAccounts: [],
    financeCloud: { categories: [], accountsLoadedAt: '', loadedAt: '', monthFilter: '' },
    cloud: {
      supabaseUrl: SUPABASE_URL,
      provider: 'supabase',
      userId: '',
      email: '',
      householdId: '',
      lastSyncAt: '',
      status: 'offline',
      households: [],
      invitations: []
    },
    householdWorkspaces: {}
  };

  let state = loadState();
  let demoRuntimeActive = false;
  let activeModule = localStorage.getItem('homeWeb.activeModule') || 'home';
  let garageVehicleId = null;
  let activeContractId = null;
  let fuelioPreview = null;
  let garageEditRecord = null;
  let toastTimer = null;
  let now = new Date();
  let supabaseClientInstance = null;
  let deferredInstallPrompt = null;
  let serviceWorkerRegistration = null;
  let pendingServiceWorker = null;
  let pwaUpdateAvailable = false;
  let onboardingMode = sessionStorage.getItem('domacnostPlus.onboardingMode') || 'choice';

  const app = document.getElementById('app');
  document.documentElement.dataset.theme = state.settings.theme || 'light';

  function uid() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  function safeParse(json, fallback) {
    try {
      return JSON.parse(json) ?? fallback;
    } catch {
      return fallback;
    }
  }

  function loadState() {
    const candidates = [];
    const addCandidate = (key, raw, priority = 0) => {
      const parsed = safeParse(raw, null);
      if (!parsed || typeof parsed !== 'object') return;
      candidates.push({ key, value: parsed, priority, score: scoreStoredState(parsed, priority) });
    };

    addCandidate(STORAGE_KEY, localStorage.getItem(STORAGE_KEY), 100);
    LEGACY_STORAGE_KEYS.forEach((key, index) => addCandidate(key, localStorage.getItem(key), 80 - index));

    // PWA/iOS cache při update může přepnout na nový storage klíč dřív,
    // než se zkopíruje stará domácnost. Proto projdeme všechny známé klíče
    // v prohlížeči a vybereme nejlépe vyplněnou domácnost.
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (!key || candidates.some((candidate) => candidate.key === key)) continue;
      if (/^(domacnostPlus|homeWebOffline)\./.test(key)) {
        addCandidate(key, localStorage.getItem(key), 20);
      }
    }

    const best = candidates
      .sort((a, b) => b.score - a.score)
      .find((candidate) => candidate.value);

    if (best) {
      const migrated = migrateState(mergeState(DEFAULT_STATE, best.value), { fromLegacy: best.key !== STORAGE_KEY });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }

    return migrateState(mergeState(DEFAULT_STATE, {}));
  }

  function isStoredDemoState(candidate) {
    return Boolean(
      candidate?.settings?.demoMode
      || candidate?.cloud?.provider === 'demo'
      || candidate?.cloud?.status === 'demo'
      || String(candidate?.meta?.mode || '').includes('demo')
    );
  }

  function scoreStoredState(candidate, priority = 0) {
    if (!candidate || typeof candidate !== 'object') return -1;
    if (isStoredDemoState(candidate)) return -1;
    let score = priority;
    const household = candidate.household || {};
    const collections = getCollectionNames ? getCollectionNames() : [];

    if (household.isConfigured) score += 1000;
    if (household.id) score += 150;
    if (normalizeText(household.name || candidate.settings?.householdName)) score += 150;
    if (Array.isArray(candidate.profiles) && candidate.profiles.length) score += 120 + candidate.profiles.length;
    if (candidate.cloud?.householdId) score += 200;
    if (candidate.cloud?.userId) score += 80;

    collections.forEach((collection) => {
      if (Array.isArray(candidate[collection]) && candidate[collection].length) score += Math.min(100, candidate[collection].length * 3);
    });

    const updated = Date.parse(candidate.meta?.updatedAt || candidate.cloud?.lastSyncAt || candidate.household?.createdAt || '');
    if (Number.isFinite(updated)) score += Math.min(50, Math.floor(updated / 86400000) % 50);
    return score;
  }

  function mergeState(base, saved) {
    const merged = structuredCloneSafe(base);
    Object.keys(saved || {}).forEach((key) => {
      if (Array.isArray(merged[key])) {
        merged[key] = Array.isArray(saved[key]) ? saved[key] : merged[key];
      } else if (typeof merged[key] === 'object' && merged[key] !== null) {
        merged[key] = { ...merged[key], ...(saved[key] || {}) };
      } else {
        merged[key] = saved[key] ?? merged[key];
      }
    });
    return merged;
  }

  function migrateState(input, options = {}) {
    const migrated = structuredCloneSafe(input || DEFAULT_STATE);
    const timestamp = new Date().toISOString();

    migrated.meta = {
      schemaVersion: 43,
      appBuild: 44,
      mode: 'demo-gated-start-logo-fix',
      createdAt: migrated.meta?.createdAt || timestamp,
      updatedAt: migrated.meta?.updatedAt || timestamp
    };

    migrated.settings = {
      theme: migrated.settings?.theme === 'dark' ? 'dark' : 'light',
      dashboardNote: migrated.settings?.dashboardNote || DEFAULT_STATE.settings.dashboardNote,
      bottomNavIds: Array.isArray(migrated.settings?.bottomNavIds) ? migrated.settings.bottomNavIds : [...DEFAULT_BOTTOM_NAV_IDS]
    };

    migrated.household = {
      id: migrated.household?.id || `household-${uid()}`,
      name: normalizeText(migrated.household?.name || migrated.settings?.householdName || ''),
      isConfigured: Boolean(migrated.household?.isConfigured),
      createdAt: migrated.household?.createdAt || timestamp
    };

    if (options.fromLegacy) {
      migrated.household.name = migrated.household.name || normalizeText(input?.settings?.householdName) || 'Moje domácnost';
      migrated.household.isConfigured = true;
    }

    migrated.profiles = Array.isArray(migrated.profiles) ? migrated.profiles : [];
    if (!migrated.profiles.length && migrated.household.isConfigured) {
      migrated.profiles = [createProfile(options.fromLegacy ? 'Martin' : 'Já', 'owner', migrated.household.id)];
    }

    migrated.profiles = migrated.profiles.map((profile, index) => ({
      id: profile.id || `profile-${uid()}`,
      householdId: profile.householdId || migrated.household.id,
      name: normalizeText(profile.name) || `Profil ${index + 1}`,
      color: profile.color || ['blue', 'green', 'violet', 'orange'][index % 4],
      role: profile.role || (index === 0 ? 'owner' : 'member'),
      createdAt: profile.createdAt || timestamp
    }));

    if (!migrated.profiles.some((profile) => profile.id === migrated.activeProfileId)) {
      migrated.activeProfileId = migrated.profiles[0]?.id || '';
    }

    migrated.shoppingStats = migrated.shoppingStats && typeof migrated.shoppingStats === 'object' && !Array.isArray(migrated.shoppingStats) ? migrated.shoppingStats : {};
    migrated.tasksCloud = migrated.tasksCloud && typeof migrated.tasksCloud === 'object' && !Array.isArray(migrated.tasksCloud) ? migrated.tasksCloud : { loadedAt: '' };
    migrated.householdWorkspaces = migrated.householdWorkspaces && typeof migrated.householdWorkspaces === 'object' && !Array.isArray(migrated.householdWorkspaces) ? migrated.householdWorkspaces : {};
    migrated.cloud.households = Array.isArray(migrated.cloud?.households) ? migrated.cloud.households : [];
    migrated.cloud.invitations = Array.isArray(migrated.cloud?.invitations) ? migrated.cloud.invitations : [];

    migrated.enabledModules = normalizeModuleList(migrated.enabledModules);
    migrated.settings.bottomNavIds = normalizeBottomNavIds(migrated.settings.bottomNavIds, migrated.enabledModules);

    getCollectionNames().forEach((collection) => {
      migrated[collection] = Array.isArray(migrated[collection]) ? migrated[collection] : [];
      migrated[collection] = migrated[collection].map((item) => ({
        householdId: item.householdId || migrated.household.id,
        profileId: item.profileId || migrated.activeProfileId || migrated.profiles[0]?.id || '',
        ...item
      }));
    });

    migrated.vehicles = migrated.vehicles.map((vehicle) => ({
      technicalInspectionUntil: '',
      insuranceUntil: '',
      serviceIntervalKm: '',
      nextServiceKm: '',
      nextServiceDate: '',
      note: '',
      ...vehicle
    }));

    return migrated;
  }

  function structuredCloneSafe(value) {
    if (typeof structuredClone === 'function') return structuredClone(value);
    return JSON.parse(JSON.stringify(value));
  }

  function createProfile(name, role = 'member', householdId = '') {
    return {
      id: `profile-${uid()}`,
      householdId: householdId || currentHouseholdId(false),
      name: normalizeText(name) || 'Profil',
      color: 'blue',
      role,
      createdAt: new Date().toISOString()
    };
  }

  function getCollectionNames() {
    return ['calendar', 'packages', 'coupons', 'hdoWindows', 'shopping', 'shoppingCatalogCustom', 'homeTasks', 'waste', 'notes', 'devices', 'vehicles', 'fuel', 'services', 'contracts', 'contractFiles', 'cameras', 'finance', 'financeAccounts'];
  }

  function normalizeModuleList(value) {
    const list = Array.isArray(value) ? value : typeof value === 'string' ? [value] : [];
    const clean = list.filter((id) => MANAGED_MODULE_IDS.includes(id));
    return clean.length ? [...new Set(clean)] : [...MANAGED_MODULE_IDS];
  }

  function getNavCandidateIds(enabledModules = state?.enabledModules) {
    const enabled = new Set(normalizeModuleList(enabledModules));
    return MODULES
      .filter((module) => module.id === 'home' || (module.id !== 'settings' && enabled.has(module.id)))
      .map((module) => module.id);
  }

  function normalizeBottomNavIds(value, enabledModules = state?.enabledModules) {
    const candidates = getNavCandidateIds(enabledModules);
    const candidateSet = new Set(candidates);
    const requested = Array.isArray(value) ? value : [];
    const result = [...new Set(requested.filter((id) => candidateSet.has(id)))].slice(0, BOTTOM_NAV_MAX);
    const fallback = [...DEFAULT_BOTTOM_NAV_IDS, ...candidates].filter((id) => candidateSet.has(id));
    const minimum = Math.min(BOTTOM_NAV_MIN, candidates.length);

    for (const id of fallback) {
      if (result.length >= minimum) break;
      if (!result.includes(id)) result.push(id);
    }

    if (!result.length && candidates[0]) result.push(candidates[0]);
    return result.slice(0, BOTTOM_NAV_MAX);
  }

  function currentHouseholdId(createFallback = true) {
    if (state?.household?.id) return state.household.id;
    return createFallback ? `household-${uid()}` : '';
  }

  function currentProfile() {
    return state.profiles.find((profile) => profile.id === state.activeProfileId) || state.profiles[0] || null;
  }

  function currentProfileId() {
    return currentProfile()?.id || '';
  }

  function householdName() {
    return state.household?.name || state.settings?.householdName || 'Domácnost';
  }

  function getAppBaseUrl() {
    return APP_PUBLIC_URL;
  }

  function getAuthRedirectUrl() {
    return `${APP_PUBLIC_URL}?auth=confirmed`;
  }

  function getVisibleModules() {
    const enabled = new Set(normalizeModuleList(state.enabledModules));
    return MODULES.filter((module) => module.id === 'home' || module.id === 'settings' || enabled.has(module.id));
  }

  function getBottomNavModules() {
    const visible = getVisibleModules();
    const selectedIds = normalizeBottomNavIds(state.settings?.bottomNavIds, state.enabledModules);
    const selected = selectedIds
      .map((id) => visible.find((module) => module.id === id))
      .filter(Boolean);
    return [...selected, MORE_MODULE];
  }

  function isMoreNavActive() {
    const selectedIds = normalizeBottomNavIds(state.settings?.bottomNavIds, state.enabledModules);
    return activeModule === MORE_MODULE.id || !selectedIds.includes(activeModule);
  }

  function isModuleEnabled(moduleId) {
    return moduleId === 'home' || moduleId === 'settings' || normalizeModuleList(state.enabledModules).includes(moduleId);
  }

  function saveState() {
    // Demo je jen dočasný sandbox. Nikdy ho neukládáme do localStorage,
    // aby se všem při každém spuštění ukázala stejná plná demo domácnost.
    if (isDemoOnlyState()) return;
    if (state?.meta) state.meta.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function formatDate(value, options = {}) {
    if (!value) return '—';
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat('cs-CZ', { day: '2-digit', month: '2-digit', year: 'numeric', ...options }).format(date);
  }

  function formatDateTime(date) {
    return new Intl.DateTimeFormat('cs-CZ', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  }

  function formatCurrency(value) {
    const number = Number(value || 0);
    return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(number);
  }

  function formatBytes(value) {
    const bytes = Number(value || 0);
    if (!bytes) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1).replace('.', ',')} kB`;
    return `${(bytes / 1048576).toFixed(1).replace('.', ',')} MB`;
  }

  function daysUntil(dateISO) {
    if (!dateISO) return null;
    const start = new Date(todayISO());
    const target = new Date(`${dateISO}T00:00:00`);
    if (Number.isNaN(target.getTime())) return null;
    return Math.ceil((target - start) / 86400000);
  }

  function normalizeText(value) {
    return String(value || '').trim();
  }

  function getFormData(form) {
    const data = new FormData(form);
    const result = {};
    for (const [key, value] of data.entries()) {
      if (result[key]) {
        result[key] = Array.isArray(result[key]) ? [...result[key], value] : [result[key], value];
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  function isDemoOnlyState() {
    return Boolean(state?.settings?.demoMode || state?.cloud?.provider === 'demo' || state?.cloud?.status === 'demo');
  }

  function shouldShowStartChoice() {
    if (!state.household?.isConfigured) return true;
    if (state.cloud?.status === 'email-confirmation') {
      onboardingMode = 'account';
      return true;
    }
    return isDemoOnlyState() && !demoRuntimeActive;
  }

  function render() {
    document.documentElement.dataset.theme = state.settings.theme || 'light';

    if (shouldShowStartChoice()) {
      renderOnboarding();
      return;
    }

    const visibleModules = getVisibleModules();
    const selectableModules = [...visibleModules, MORE_MODULE];
    if (!selectableModules.some((module) => module.id === activeModule)) activeModule = 'home';
    localStorage.setItem('homeWeb.activeModule', activeModule);

    const active = selectableModules.find((module) => module.id === activeModule) || visibleModules[0];
    const bottomNavModules = getBottomNavModules();

    app.innerHTML = `
      <div class="app-frame">
        <header class="topbar">
          <div class="brand">
            <div class="brand-mark logo-mark"><img src="${BRAND_ICON_SRC}" alt="Domácnost+" loading="eager"></div>
            <div class="brand-title">
              <h1>${escapeHtml(householdName())}</h1>
              <p>${escapeHtml(APP_VERSION)} · ${escapeHtml(currentProfile()?.name || 'bez profilu')} · ${escapeHtml(cloudModeLabel())}</p>
            </div>
          </div>
          <div class="top-actions">
            ${renderProfileSwitcher()}
            <div class="clock-card">
              <strong>${clockText(now)}</strong>
              <span>${escapeHtml(shortDateText(now))}</span>
            </div>
            <button class="icon-btn" type="button" data-action="toggle-theme" aria-label="Přepnout vzhled">${state.settings.theme === 'dark' ? '☀️' : '🌙'}</button>
          </div>
        </header>

        <main>
          <section class="page-head">
            <div>
              <h2 class="page-title">${escapeHtml(active.label)}</h2>
              <p class="page-subtitle">${escapeHtml(getModuleSubtitle(active.id))}</p>
            </div>
            ${renderPageActions(active.id)}
          </section>
          ${renderDemoReadOnlyBanner()}${renderModule(active.id)}
        </main>

        <p class="footer-note">${escapeHtml(APP_VERSION)} · cloud nákupy, smlouvy, garáž, HDO, odpad, balíky, úkoly, kalendář a finance · lokální režim zůstává jako záloha</p>
      </div>

      <nav class="nav-shell" aria-label="Hlavní navigace">
        <div class="nav-scroll">
          ${bottomNavModules.map((module) => {
            const isActive = module.id === MORE_MODULE.id ? isMoreNavActive() : module.id === activeModule;
            return `
              <button class="nav-item ${isActive ? 'active' : ''}" type="button" data-nav="${module.id}">
                <span class="nav-icon">${module.icon}</span>
                <span>${escapeHtml(module.label)}</span>
              </button>
            `;
          }).join('')}
        </div>
      </nav>
      <div id="copy-toast" class="copy-toast" role="status" aria-live="polite"></div>
    `;

    promoteActiveContentBeforeForms();
    keepActiveNavCentered();
  }

  function renderDemoReadOnlyBanner() {
    if (!isDemoOnlyState()) return '';
    return `
      <section class="card demo-readonly-banner desktop-span-2">
        <div class="item-top">
          <div>
            <h2>Demo verze</h2>
            <p>Ukázková domácnost je vždy stejná. Všechno si můžeš proklikat, ale změny se neukládají a po novém spuštění začne demo znovu čisté.</p>
          </div>
          <span class="badge warn">bez ukládání</span>
        </div>
      </section>
    `;
  }

  function promoteActiveContentBeforeForms() {
    // V modulech má být nejdřív vidět aktivní obsah a až potom přidávání nové položky.
    document.querySelectorAll('.card').forEach((card) => {
      const form = card.querySelector(':scope > form');
      const list = card.querySelector(':scope > .list');
      if (!form || !list) return;
      if (form.compareDocumentPosition(list) & Node.DOCUMENT_POSITION_FOLLOWING) {
        card.insertBefore(list, form);
      }
    });
  }

  function keepActiveNavCentered(behavior = 'auto') {
    requestAnimationFrame(() => {
      const navScroll = document.querySelector('.nav-scroll');
      const activeItem = navScroll?.querySelector('.nav-item.active');
      if (!navScroll || !activeItem) return;

      const maxLeft = navScroll.scrollWidth - navScroll.clientWidth;
      const targetLeft = activeItem.offsetLeft - ((navScroll.clientWidth - activeItem.clientWidth) / 2);
      navScroll.scrollTo({
        left: Math.max(0, Math.min(maxLeft, targetLeft)),
        behavior
      });
    });
  }

  function renderOnboarding() {
    document.documentElement.dataset.theme = state.settings.theme || 'light';
    const authRedirect = getAuthRedirectUrl();

    if (onboardingMode === 'choice') {
      app.innerHTML = `
        <div class="onboarding-screen">
          <section class="onboarding-card onboarding-choice-card">
            <div class="onboarding-hero">
              <div class="brand-mark big logo-mark"><img src="${BRAND_ICON_SRC}" alt="Domácnost+" loading="eager"></div>
              <div>
                <span class="badge">${escapeHtml(APP_VERSION)}</span>
                <h1>Domácnost+</h1>
                <p>Rodinná aplikace pro domácnost, nákupy, smlouvy, finance, auta, HDO, odpad, balíky a další věci kolem domu.</p>
              </div>
            </div>

            <div class="grid two onboarding-choice-grid">
              <article class="card flat choice-tile">
                <div class="choice-icon">🔐</div>
                <h2>Založit / přihlásit domácnost</h2>
                <p>Vytvoříš vlastní domácnost, účet, profily členů a data se budou držet odděleně od ostatních rodin přes Supabase.</p>
                <button class="primary-btn" type="button" data-action="onboarding-mode" data-mode="account">Pokračovat k účtu</button>
              </article>
              <article class="card flat choice-tile">
                <div class="choice-icon">🏡</div>
                <h2>Demo verze</h2>
                <p>Ukázková dlouho používaná domácnost s hotovými daty, historií financí, nákupy, smlouvami, garáží, odpadem a balíky.</p>
                <button class="ghost-btn" type="button" data-action="start-demo">Spustit demo</button>
              </article>
            </div>

            <div class="inline-note">Demo je jen lokální ukázka v tomhle zařízení. Skutečná domácnost se zakládá přes účet a má vlastní cloudové ID.</div>
          </section>
        </div>
        <div id="copy-toast" class="copy-toast" role="status" aria-live="polite"></div>
      `;
      return;
    }

    app.innerHTML = `
      <div class="onboarding-screen">
        <section class="onboarding-card">
          <div class="onboarding-hero">
            <div class="brand-mark big logo-mark"><img src="${BRAND_ICON_SRC}" alt="Domácnost+" loading="eager"></div>
            <div>
              <span class="badge">${escapeHtml(APP_VERSION)}</span>
              <h1>Založení nebo přihlášení domácnosti</h1>
              <p>Každá domácnost má vlastní účet a cloudové ID. Data jedné rodiny se nebudou míchat s jinou.</p>
            </div>
          </div>

          ${renderEmailConfirmationCard()}

          <div class="grid two">
            <section class="card flat">
              <div class="card-header"><div><h2>Přihlásit existující domácnost</h2><p>Pro členy, kteří už mají účet nebo přijali pozvánku.</p></div></div>
              <form data-form="onboarding-login" class="stack-form">
                ${field('E-mail', 'email', 'email', 'email@domena.cz', true)}
                ${field('Heslo', 'password', 'password', 'heslo', true)}
                <div class="form-actions"><button class="primary-btn" type="submit">Přihlásit domácnost</button></div>
              </form>
            </section>

            <section class="card flat">
              <div class="card-header"><div><h2>Založit novou domácnost</h2><p>Název domácnosti, vlastník a první profily.</p></div></div>
              <form data-form="onboarding" class="stack-form">
                ${field('Název domácnosti', 'householdName', 'text', 'Špadrnovi / Doma / Byt', true)}
                ${field('E-mail vlastníka', 'email', 'email', 'email@domena.cz', true)}
                <div class="form-grid two">
                  ${field('Heslo', 'password', 'password', 'min. 6 znaků', true)}
                  ${field('Heslo znovu', 'passwordConfirm', 'password', 'pro kontrolu', true)}
                </div>
                <div class="form-grid two">
                  ${field('Hlavní profil', 'profilePrimary', 'text', 'Martin', true)}
                  ${field('Druhý profil', 'profileSecondary', 'text', 'Manželka')}
                </div>
                ${field('Další profily', 'profilesExtra', 'text', 'děti, babička… odděl čárkou')}
                <details class="soft-details">
                  <summary>Vybrat moduly</summary>
                  <div class="module-check-grid">
                    ${MODULES.filter((module) => !['home', 'settings'].includes(module.id)).map((module) => moduleCheckbox(module, true)).join('')}
                  </div>
                </details>
                <div class="form-actions"><button class="primary-btn" type="submit">Založit účet a domácnost</button></div>
                <div class="inline-note">Pokud účet s tímto e-mailem už existuje, aplikace tě přepne na přihlášení místo další registrace.</div>
              </form>
            </section>
          </div>

          <div class="inline-note">Ověřovací e-mail se teď posílá s návratem na: <strong>${escapeHtml(authRedirect)}</strong>. V Supabase musí být tahle adresa povolená v Auth Redirect URLs.</div>
          <div class="form-actions onboarding-actions">
            <button class="ghost-btn" type="button" data-action="onboarding-mode" data-mode="choice">Zpět na výběr</button>
            <button class="ghost-btn" type="button" data-action="toggle-theme">Přepnout vzhled</button>
          </div>
        </section>
      </div>
      <div id="copy-toast" class="copy-toast" role="status" aria-live="polite"></div>
    `;
  }



  function renderEmailConfirmationCard() {
    const cloud = state.cloud || {};
    if (cloud.status !== 'email-confirmation') return '';
    const email = cloud.email || '';
    return `
      <section class="card flat auth-confirm-card">
        <div class="card-header">
          <div>
            <h2>Čeká se na ověření e-mailu</h2>
            <p>Potvrzovací e-mail jsme poslali na <strong>${escapeHtml(email || 'zadaný e-mail')}</strong>. Po kliknutí na odkaz se vrať sem a aplikace se pokusí domácnost napojit na cloud.</p>
          </div>
          <span class="badge warn">ověření</span>
        </div>
        <div class="cloud-status-grid">
          <div class="mini-stat"><span>Návratová adresa</span><strong>${escapeHtml(getAuthRedirectUrl())}</strong></div>
          <div class="mini-stat"><span>Stav</span><strong>čeká na potvrzení</strong></div>
        </div>
        <div class="form-actions">
          <button class="primary-btn" type="button" data-action="cloud-check-confirmation">Už jsem ověřil, zkusit napojit</button>
          <button class="ghost-btn" type="button" data-action="cloud-resend-confirmation">Poslat ověřovací e-mail znovu</button>
        </div>
      </section>
    `;
  }

  function renderProfileSwitcher() {
    if (!state.profiles?.length) return '';
    return `
      <label class="profile-switcher" aria-label="Aktivní profil">
        <span>Profil</span>
        <select data-profile-switch>
          ${state.profiles.map((profile) => `<option value="${escapeHtml(profile.id)}" ${profile.id === currentProfileId() ? 'selected' : ''}>${escapeHtml(profile.name)}</option>`).join('')}
        </select>
      </label>
    `;
  }

  function moduleCheckbox(module, checked) {
    return `
      <label class="check-card">
        <input type="checkbox" name="modules" value="${escapeHtml(module.id)}" ${checked ? 'checked' : ''}>
        <span class="check-icon">${module.icon}</span>
        <span><strong>${escapeHtml(module.label)}</strong><em>${escapeHtml(getModuleSubtitle(module.id))}</em></span>
      </label>
    `;
  }

  function getModuleSubtitle(moduleId) {
    const subtitles = {
      home: 'Rychlý domácí přehled pro tablet i mobil. Zatím bez cloudu, všechno běží jen offline.',
      calendar: 'Ruční kalendář už umí cloud. Google napojení přijde později přes bezpečný backend.',
      packages: 'Základ pro sledování balíků. Teď ručně, později automatika přes backend.',
      shopping: 'Sdílený nákupní seznam s katalogem položek, jednotkami a cloudovým oddělením domácností.',
      homecare: 'HDO, odpad, poznámky, úkoly a domácí zařízení na jednom místě.',
      garage: 'Auta v domácnosti, tankování, servis a základní přehled spotřeby.',
      contracts: 'Evidence smluv a pojistek s hlídáním platnosti.',
      cameras: 'Přehled kamer. Prozatím jen lokální karty a snapshot URL, žádné cloud streamy.',
      finance: 'Jednoduchý přehled příjmů a výdajů domácnosti s cloudovým oddělením podle householdId.',
      settings: 'Domácnost, profily, zapnuté moduly, export/import a reset offline prototypu.',
      more: 'Všechny další moduly a nastavení na jednom místě. Spodní lišta zůstává čistá a krátká.'
    };
    return subtitles[moduleId] || '';
  }

  function renderPageActions(moduleId) {
    if (moduleId === 'settings' || moduleId === 'more') return '';
    return `
      <div class="top-actions">
        <button class="ghost-btn" type="button" data-nav="settings">Nastavení</button>
      </div>
    `;
  }

  function renderModule(moduleId) {
    const renderers = {
      home: renderDashboard,
      calendar: renderCalendar,
      packages: renderPackages,
      shopping: renderShopping,
      homecare: renderHomecare,
      garage: renderGarage,
      contracts: renderContracts,
      cameras: renderCameras,
      finance: renderFinance,
      settings: renderSettings,
      more: renderMore
    };
    return (renderers[moduleId] || renderDashboard)();
  }

  function renderDashboard() {
    const todayEvents = state.calendar
      .filter((event) => event.date === todayISO())
      .sort((a, b) => String(a.time).localeCompare(String(b.time)));
    const upcomingEvents = state.calendar
      .filter((event) => !event.date || event.date >= todayISO())
      .sort((a, b) => `${a.date || ''}${a.time || ''}`.localeCompare(`${b.date || ''}${b.time || ''}`))
      .slice(0, 6);
    const activePackages = state.packages.filter((pkg) => pkg.status !== 'delivered');
    const hdo = getHdoStatus(now);
    const urgentContracts = state.contracts
      .map((contract) => ({ ...contract, days: daysUntil(contract.validTo) }))
      .filter((contract) => contract.days !== null && contract.days <= 45)
      .sort((a, b) => a.days - b.days)
      .slice(0, 4);
    const openShopping = state.shopping.filter((item) => !item.done);
    const openTasks = state.homeTasks
      .filter((task) => !task.done)
      .sort((a, b) => String(a.due || '9999-12-31').localeCompare(String(b.due || '9999-12-31')))
      .slice(0, 4);
    const wasteSoon = state.waste
      .map((item) => ({ ...item, days: daysUntil(item.date) }))
      .filter((item) => item.days !== null && item.days >= 0 && item.days <= 7)
      .sort((a, b) => a.days - b.days)
      .slice(0, 3);
    const vehicleAlerts = getVehicleAlerts().slice(0, 4);
    const visibleModules = getVisibleModules();
    const focusItems = getDashboardFocusItems({
      hdo,
      todayEvents,
      upcomingEvents,
      activePackages,
      urgentContracts,
      openShopping,
      openTasks,
      wasteSoon,
      vehicleAlerts
    });

    return `
      <div class="dashboard-v10">
        <section class="card hero-card station-hero">
          <div class="station-hero-main">
            <div>
              <span class="badge good">tabletový režim v1.0</span>
              <div class="hero-time">${clockText(now)}</div>
              <div class="hero-date">${escapeHtml(formatDateTime(now))}</div>
            </div>
            <div class="station-summary">
              <div class="station-summary-item"><strong>${todayEvents.length}</strong><span>dnes v kalendáři</span></div>
              <div class="station-summary-item"><strong>${activePackages.length}</strong><span>aktivní balíky</span></div>
              <div class="station-summary-item"><strong>${openShopping.length}</strong><span>v nákupu</span></div>
              <div class="station-summary-item"><strong>${hdo.active ? 'Běží' : 'Ne'}</strong><span>HDO</span></div>
            </div>
          </div>
          <div class="station-hero-bottom">
            <div class="inline-note hero-note">Domácnost: <strong>${escapeHtml(householdName())}</strong> · profil: <strong>${escapeHtml(currentProfile()?.name || '—')}</strong> · zapnuté moduly: <strong>${visibleModules.length - 2}</strong></div>
            <button class="ghost-btn" type="button" data-nav="settings">Upravit</button>
          </div>
        </section>

        ${renderCloudSyncOverview('dashboard')}

        <section class="tablet-focus-grid">
          ${focusItems.map(renderDashboardFocusItem).join('')}
        </section>

        <section class="card tablet-agenda-card">
          <div class="card-header">
            <div><h2>Dnes a brzy</h2><p>Rychlý přehled věcí, které by na domácím tabletu měly být vidět hned.</p></div>
            <span class="badge">${focusItems.length} položek</span>
          </div>
          <div class="timeline-list">
            ${renderDashboardTimeline(todayEvents, upcomingEvents, urgentContracts, openTasks, wasteSoon, vehicleAlerts)}
          </div>
        </section>

        <section class="card tablet-now-card">
          <div class="card-header">
            <div><h2>Teď doma</h2><p>${escapeHtml(state.settings.dashboardNote || '')}</p></div>
            <span class="badge ${hdo.active ? 'good' : 'warn'}">HDO ${hdo.active ? 'běží' : 'neběží'}</span>
          </div>
          <div class="list">
            <button class="item module-hub-item" type="button" data-nav="homecare">
              <div class="item-top"><div class="item-title">Nízký tarif</div><span class="badge ${hdo.active ? 'good' : 'warn'}">${escapeHtml(hdo.label)}</span></div>
              <div class="item-meta">${escapeHtml(hdo.message)}</div>
            </button>
            <button class="item module-hub-item" type="button" data-nav="shopping">
              <div class="item-top"><div class="item-title">Nákupy</div><span class="badge ${openShopping.length ? 'warn' : 'good'}">${openShopping.length} koupit</span></div>
              <div class="item-meta">${openShopping.slice(0, 3).map((item) => item.name).filter(Boolean).join(' · ') || 'Nákupní seznam je prázdný.'}</div>
            </button>
          </div>
        </section>

        ${renderSetupChecklist()}

        ${renderCloudReadiness(true)}

        <section class="card desktop-span-2 tablet-modules-card">
          <div class="card-header">
            <div><h2>Rychlé moduly</h2><p>Všechny hlavní části jsou připravené jako offline kostra. Na tabletu jsou karty větší, na mobilu zůstanou pod sebou.</p></div>
            <button class="ghost-btn" type="button" data-nav="more">Více</button>
          </div>
          <div class="grid four">
            ${visibleModules.filter((module) => module.id !== 'home' && module.id !== 'settings').map(renderModuleStatusCard).join('')}
          </div>
        </section>

        ${renderDeleteAccountCard()}
      </div>
    `;
  }

  function getDashboardFocusItems({ hdo, todayEvents, upcomingEvents, activePackages, urgentContracts, openShopping, openTasks, wasteSoon, vehicleAlerts }) {
    const firstEvent = todayEvents[0] || upcomingEvents[0];
    const firstPackage = activePackages[0];
    const firstContract = urgentContracts[0];
    const firstTask = openTasks[0];
    const firstWaste = wasteSoon[0];
    const firstVehicle = vehicleAlerts[0];

    const items = [
      {
        nav: 'calendar',
        icon: '📅',
        title: firstEvent ? firstEvent.title : 'Kalendář je volný',
        meta: firstEvent ? `${firstEvent.date === todayISO() ? 'Dnes' : formatDate(firstEvent.date)}${firstEvent.time ? ` · ${firstEvent.time}` : ''}${firstEvent.note ? ` · ${firstEvent.note}` : ''}` : 'Žádná událost na dnešek ani nejbližší dny.',
        badge: todayEvents.length ? `${todayEvents.length} dnes` : 'volno',
        tone: todayEvents.length ? 'good' : ''
      },
      {
        nav: 'homecare',
        icon: '💡',
        title: hdo.active ? 'Nízký tarif běží' : 'Nízký tarif neběží',
        meta: hdo.message,
        badge: hdo.active ? 'běží' : 'čeká',
        tone: hdo.active ? 'good' : 'warn'
      },
      {
        nav: 'packages',
        icon: '📦',
        title: firstPackage ? `${carrierLabel(firstPackage.carrier) || 'Balík'} · ${packageStatus(firstPackage.status).label}` : 'Žádný aktivní balík',
        meta: firstPackage ? `${firstPackage.tracking || 'bez čísla'}${firstPackage.note ? ` · ${firstPackage.note}` : ''}` : 'Tady se později ukáže nejbližší zásilka.',
        badge: `${activePackages.length} aktivní`,
        tone: activePackages.length ? 'warn' : 'good'
      },
      {
        nav: 'shopping',
        icon: '🛒',
        title: openShopping.length ? 'Nákup čeká' : 'Nákup hotový',
        meta: openShopping.slice(0, 3).map((item) => item.name).filter(Boolean).join(' · ') || 'V seznamu není nic k nákupu.',
        badge: `${openShopping.length} položek`,
        tone: openShopping.length ? 'warn' : 'good'
      },
      {
        nav: firstContract ? 'contracts' : firstVehicle ? 'garage' : 'homecare',
        icon: firstContract ? '📄' : firstVehicle ? '🚗' : '🧹',
        title: firstContract ? firstContract.name : firstVehicle ? firstVehicle.title : firstTask ? firstTask.title : firstWaste ? `${firstWaste.type} odpad` : 'Žádná akutní připomínka',
        meta: firstContract
          ? `${firstContract.provider || 'Bez poskytovatele'} · platnost do ${formatDate(firstContract.validTo)}`
          : firstVehicle
            ? firstVehicle.meta
            : firstTask
              ? `${firstTask.due ? `Termín ${formatDate(firstTask.due)}` : 'Bez termínu'}${firstTask.note ? ` · ${firstTask.note}` : ''}`
              : firstWaste
                ? `Svoz ${formatDate(firstWaste.date)}${firstWaste.note ? ` · ${firstWaste.note}` : ''}`
                : 'Až přidáš úkoly, svoz, STK nebo smlouvy, objeví se tady.',
        badge: firstContract ? dueBadge(firstContract.days) : firstVehicle ? dueBadge(firstVehicle.days) : firstTask?.due ? dueBadge(daysUntil(firstTask.due)) : firstWaste ? dueBadge(firstWaste.days) : 'klid',
        tone: firstContract?.days < 0 || firstVehicle?.days < 0 ? 'bad' : firstContract || firstVehicle || firstTask || firstWaste ? 'warn' : 'good'
      }
    ];

    return items;
  }


  function getCloudSyncOverviewItems() {
    const counters = [
      { nav: 'shopping', icon: '🛒', label: 'Nákupy', items: state.shopping || [], loadedAt: state.shoppingCloud?.loadedAt },
      { nav: 'contracts', icon: '📄', label: 'Smlouvy', items: state.contracts || [] },
      { nav: 'contracts', icon: '📎', label: 'Přílohy smluv', items: state.contractFiles || [] },
      { nav: 'garage', icon: '🚗', label: 'Garáž', items: [...(state.vehicles || []), ...(state.fuel || []), ...(state.services || [])] },
      { nav: 'homecare', icon: '💡', label: 'HDO', items: state.hdoWindows || [], loadedAt: state.hdoCloud?.loadedAt },
      { nav: 'homecare', icon: '♻️', label: 'Odpad', items: state.waste || [], loadedAt: state.wasteCloud?.loadedAt },
      { nav: 'homecare', icon: '✅', label: 'Úkoly', items: state.homeTasks || [], loadedAt: state.tasksCloud?.loadedAt },
      { nav: 'packages', icon: '📦', label: 'Balíky', items: state.packages || [], loadedAt: state.parcelsCloud?.loadedAt },
      { nav: 'calendar', icon: '📅', label: 'Kalendář', items: state.calendar || [], loadedAt: state.calendarCloud?.loadedAt },
      { nav: 'finance', icon: '💰', label: 'Finance', items: state.finance || [], loadedAt: state.financeCloud?.loadedAt }
    ];
    return counters.map((entry) => {
      const total = entry.items.length;
      const cloud = entry.items.filter((item) => item.cloudId).length;
      const local = Math.max(total - cloud, 0);
      const percent = total ? Math.round((cloud / total) * 100) : 100;
      return { ...entry, total, cloud, local, percent };
    });
  }

  function renderCloudSyncOverview(mode = 'dashboard') {
    const cloudReady = Boolean(state.cloud?.userId && state.cloud?.householdId);
    const items = getCloudSyncOverviewItems();
    const totalLocal = items.reduce((sum, item) => sum + item.local, 0);
    const totalCloud = items.reduce((sum, item) => sum + item.cloud, 0);
    const total = totalLocal + totalCloud;
    const overall = total ? Math.round((totalCloud / total) * 100) : (cloudReady ? 100 : 0);
    const compactItems = mode === 'dashboard' ? items.filter((item) => item.total || ['Nákupy', 'Smlouvy', 'Garáž', 'HDO', 'Odpad', 'Úkoly', 'Balíky', 'Kalendář'].includes(item.label)).slice(0, 9) : items;
    return `
      <section class="card desktop-span-2 cloud-sync-overview-card">
        <div class="card-header">
          <div>
            <h2>Cloud / lokální data</h2>
            <p>${cloudReady ? 'Rychlá kontrola, co už je v Supabase a co zůstává jen v tomto zařízení.' : 'Aplikace je připravená na cloud, ale domácnost zatím není napojená.'}</p>
          </div>
          <span class="badge ${cloudReady ? 'good' : 'warn'}">${cloudReady ? `${overall}% cloud` : 'lokálně'}</span>
        </div>
        <div class="cloud-status-grid compact-cloud-stats">
          <div class="mini-stat"><span>Cloud záznamy</span><strong>${totalCloud}</strong></div>
          <div class="mini-stat"><span>Jen lokálně</span><strong>${totalLocal}</strong></div>
          <div class="mini-stat"><span>Poslední sync</span><strong>${state.cloud?.lastSyncAt ? escapeHtml(formatDateTime(state.cloud.lastSyncAt)) : 'nikdy'}</strong></div>
          <div class="mini-stat"><span>Domácnost</span><strong>${escapeHtml(state.cloud?.householdId ? 'napojená' : 'offline')}</strong></div>
        </div>
        <div class="sync-overview-list">
          ${compactItems.map((item) => `
            <button class="sync-overview-row" type="button" data-nav="${escapeHtml(item.nav)}">
              <span class="sync-overview-icon">${escapeHtml(item.icon)}</span>
              <span class="sync-overview-main">
                <span class="sync-overview-title">${escapeHtml(item.label)}</span>
                <span class="sync-progress"><i style="width:${item.percent}%"></i></span>
              </span>
              <span class="sync-overview-meta"><strong>${item.cloud}</strong> cloud · <strong>${item.local}</strong> lokál</span>
            </button>
          `).join('')}
        </div>
        <div class="form-actions">
          ${cloudReady ? '<button class="ghost-btn" type="button" data-action="cloud-load-all">Načíst vše z cloudu</button>' : '<button class="ghost-btn" type="button" data-nav="settings">Napojit cloud v Nastavení</button>'}
          ${cloudReady && totalLocal ? '<span class="badge warn">lokální položky odešli v daném modulu</span>' : '<span class="badge good">bez lokálních restů</span>'}
        </div>
      </section>
    `;
  }

  function renderDashboardFocusItem(item) {
    return `
      <button class="card focus-tile ${item.tone || ''}" type="button" data-nav="${escapeHtml(item.nav)}">
        <div class="focus-icon">${escapeHtml(item.icon)}</div>
        <div>
          <div class="item-top"><h3>${escapeHtml(item.title)}</h3><span class="badge ${item.tone || ''}">${escapeHtml(item.badge)}</span></div>
          <p>${escapeHtml(item.meta)}</p>
        </div>
      </button>
    `;
  }

  function renderDashboardTimeline(todayEvents, upcomingEvents, urgentContracts, openTasks, wasteSoon, vehicleAlerts) {
    const rows = [
      ...todayEvents.slice(0, 3).map((event) => ({ nav: 'calendar', icon: '📅', title: event.title, meta: `${event.time || 'celý den'}${event.note ? ` · ${event.note}` : ''}`, badge: 'dnes', tone: 'good' })),
      ...upcomingEvents.filter((event) => event.date !== todayISO()).slice(0, 3).map((event) => ({ nav: 'calendar', icon: '📅', title: event.title, meta: `${formatDate(event.date)}${event.time ? ` · ${event.time}` : ''}${event.note ? ` · ${event.note}` : ''}`, badge: 'brzy', tone: '' })),
      ...urgentContracts.slice(0, 3).map((contract) => ({ nav: 'contracts', icon: '📄', title: contract.name, meta: `${contract.provider || 'Bez poskytovatele'} · platnost do ${formatDate(contract.validTo)}`, badge: dueBadge(contract.days), tone: contract.days < 0 ? 'bad' : contract.days <= 14 ? 'warn' : '' })),
      ...openTasks.slice(0, 3).map((task) => ({ nav: 'homecare', icon: '✅', title: task.title, meta: `${task.due ? `Termín ${formatDate(task.due)}` : 'Bez termínu'}${task.note ? ` · ${task.note}` : ''}`, badge: task.due ? dueBadge(daysUntil(task.due)) : 'úkol', tone: task.due && daysUntil(task.due) <= 2 ? 'warn' : '' })),
      ...wasteSoon.slice(0, 2).map((item) => ({ nav: 'homecare', icon: '♻️', title: `${item.type} odpad`, meta: `${formatDate(item.date)}${item.note ? ` · ${item.note}` : ''}`, badge: dueBadge(item.days), tone: item.days <= 1 ? 'warn' : '' })),
      ...vehicleAlerts.slice(0, 3).map((item) => ({ nav: 'garage', icon: '🚗', title: item.title, meta: item.meta, badge: dueBadge(item.days), tone: item.days < 0 ? 'bad' : item.days <= 30 ? 'warn' : '' }))
    ].slice(0, 9);

    if (!rows.length) return '<div class="empty">Zatím tu není nic důležitého. Jakmile přidáš kalendář, smlouvy, úkoly nebo auto, dashboard se začne plnit sám.</div>';

    return rows.map((row) => `
      <button class="timeline-item ${row.tone || ''}" type="button" data-nav="${escapeHtml(row.nav)}">
        <span class="timeline-icon">${escapeHtml(row.icon)}</span>
        <span class="timeline-copy"><strong>${escapeHtml(row.title)}</strong><em>${escapeHtml(row.meta)}</em></span>
        <span class="badge ${row.tone || ''}">${escapeHtml(row.badge)}</span>
      </button>
    `).join('');
  }

  function getVehicleAlerts() {
    const alerts = [];
    state.vehicles.forEach((vehicle) => {
      [
        { key: 'technicalInspectionUntil', label: 'STK' },
        { key: 'insuranceUntil', label: 'Pojistka' },
        { key: 'nextServiceDate', label: 'Servis' }
      ].forEach((item) => {
        const days = daysUntil(vehicle[item.key]);
        if (days !== null && days <= 45) {
          alerts.push({
            days,
            title: `${item.label}: ${vehicle.name}`,
            meta: `${item.label} do ${formatDate(vehicle[item.key])}`
          });
        }
      });
      const currentKm = Number(vehicle.odometer || 0);
      const nextKm = Number(vehicle.nextServiceKm || 0);
      if (currentKm && nextKm && nextKm - currentKm <= 1500) {
        alerts.push({
          days: nextKm < currentKm ? -1 : 30,
          title: `Servis podle km: ${vehicle.name}`,
          meta: `Aktuálně ${currentKm} km · další servis při ${nextKm} km`
        });
      }
    });
    return alerts.sort((a, b) => a.days - b.days);
  }

  function dueBadge(days) {
    if (days === null || days === undefined) return 'bez termínu';
    if (days < 0) return 'po termínu';
    if (days === 0) return 'dnes';
    if (days === 1) return 'zítra';
    return `${days} dní`;
  }

  function renderSetupChecklist() {
    const checks = [
      { done: Boolean(state.household?.isConfigured), title: 'Domácnost vytvořená', note: 'Základ pro oddělení více rodin.' },
      { done: state.profiles.length >= 2, title: 'Profily členů', note: 'Ideálně aspoň dva profily pro domácnost.' },
      { done: normalizeBottomNavIds(state.settings?.bottomNavIds, state.enabledModules).length >= BOTTOM_NAV_MIN, title: 'Spodní lišta', note: 'Vybrané hlavní položky + pevné Více.' },
      { done: state.hdoWindows.length > 0, title: 'HDO okna', note: 'Nízký tarif se pak ukáže na dashboardu.' },
      { done: state.vehicles.length > 0, title: 'Garáž', note: 'Auta, tankování, servis a později Fuelio import.' },
      { done: state.contracts.length > 0, title: 'Smlouvy', note: 'Pojistky/smlouvy včetně příloh přes IndexedDB.' }
    ];
    const doneCount = checks.filter((item) => item.done).length;
    return `
      <section class="card setup-card">
        <div class="card-header">
          <div><h2>Dokončení základu</h2><p>Co je dobré nastavit, než půjdeme do cloudu.</p></div>
          <span class="badge ${doneCount >= checks.length ? 'good' : ''}">${doneCount}/${checks.length}</span>
        </div>
        <div class="setup-list">
          ${checks.map((item) => `
            <div class="setup-item ${item.done ? 'done' : ''}">
              <span>${item.done ? '✓' : '•'}</span>
              <div><strong>${escapeHtml(item.title)}</strong><em>${escapeHtml(item.note)}</em></div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }


  function getModuleStats(moduleId) {
    const countBy = (collection, predicate = null) => {
      const list = Array.isArray(state[collection]) ? state[collection] : [];
      return predicate ? list.filter(predicate).length : list.length;
    };
    const stats = {
      calendar: { count: countBy('calendar'), label: 'událostí', note: 'Google napojení později přes backend.' },
      packages: { count: countBy('packages', (item) => item.status !== 'delivered'), label: 'aktivních', note: `${countBy('packages')} balíků celkem.` },
      shopping: { count: countBy('shopping', (item) => !item.done), label: 'koupit', note: `${countBy('coupons', (item) => !item.used)} nepoužitých kódů.` },
      homecare: { count: countBy('homeTasks', (item) => !item.done) + countBy('hdoWindows') + countBy('waste'), label: 'položek', note: `${countBy('hdoWindows')} HDO oken, ${countBy('waste')} svozů, ${countBy('homeTasks', (item) => !item.done)} úkolů.` },
      garage: { count: countBy('vehicles'), label: 'aut', note: `${countBy('fuel')} tankování, ${countBy('services')} servisů.` },
      contracts: { count: countBy('contracts'), label: 'smluv', note: `${countBy('contractFiles')} příloh lokálně v IndexedDB.` },
      cameras: { count: countBy('cameras'), label: 'kamer', note: 'Snapshot/stream zatím jen lokálně.' },
      finance: { count: countBy('finance'), label: 'záznamů', note: `${formatCurrency(financeMonthSummary().balance)} rozdíl tento měsíc.` }
    };
    return stats[moduleId] || { count: 0, label: 'položek', note: getModuleSubtitle(moduleId) };
  }

  function getCloudReadiness() {
    const checks = [
      { key: 'household', done: Boolean(state.household?.isConfigured && state.household?.id), title: 'Domácnost má svoje ID', note: 'Základ pro oddělení rodin v cloudu.' },
      { key: 'profiles', done: state.profiles.length >= 1 && state.profiles.every((profile) => profile.householdId), title: 'Profily jsou navázané na domácnost', note: 'Později půjdou propojit s účty/rolemi.' },
      { key: 'modules', done: normalizeModuleList(state.enabledModules).length > 0, title: 'Moduly jsou volitelné', note: 'Každá rodina si vybere vlastní sestavu.' },
      { key: 'navigation', done: normalizeBottomNavIds(state.settings?.bottomNavIds, state.enabledModules).length >= BOTTOM_NAV_MIN, title: 'Spodní lišta je uživatelská', note: 'Dobré pro iPhone, Android i budoucí tablet.' },
      { key: 'ids', done: getCollectionNames().every((collection) => (state[collection] || []).every((item) => item.householdId && item.profileId)), title: 'Data mají householdId/profileId', note: 'Nejdůležitější příprava na Supabase RLS.' },
      { key: 'storage', done: true, title: 'Soubory jsou mimo localStorage', note: 'Přílohy smluv jedou přes IndexedDB.' }
    ];
    const doneCount = checks.filter((item) => item.done).length;
    return { checks, doneCount, total: checks.length, percent: Math.round((doneCount / checks.length) * 100) };
  }

  function renderCloudReadiness(compact = false) {
    const readiness = getCloudReadiness();
    return `
      <section class="card ${compact ? '' : 'desktop-span-2'}">
        <div class="card-header">
          <div><h2>Připravenost na cloud</h2><p>Kontrola, jestli se offline data později půjdou rozumně převést na Vercel + Supabase.</p></div>
          <span class="badge ${readiness.percent >= 90 ? 'good' : readiness.percent >= 70 ? 'warn' : ''}">${readiness.percent} %</span>
        </div>
        <div class="progress-shell"><span style="width:${readiness.percent}%"></span></div>
        ${compact ? `
          <div class="inline-note" style="margin-top:12px;">${readiness.doneCount}/${readiness.total} technických bodů je připravených. Další krok bude doladit export/import a potom založit cloud projekt.</div>
        ` : `
          <div class="setup-list" style="margin-top:12px;">
            ${readiness.checks.map((item) => `
              <div class="setup-item ${item.done ? 'done' : ''}">
                <span>${item.done ? '✓' : '•'}</span>
                <div><strong>${escapeHtml(item.title)}</strong><em>${escapeHtml(item.note)}</em></div>
              </div>
            `).join('')}
          </div>
        `}
      </section>
    `;
  }

  function renderNextPlanCard() {
    const steps = [
      { title: 'Domácnost+ v.0.1_10', note: 'Hotovo: tabletový domácí dashboard a první cloudový základ.' },
      { title: 'Domácnost+ v.0.1_11', note: 'Hotovo: Supabase Auth, domácnost, členové, profily a cloudový základ Nákupů.' },
      { title: 'Domácnost+ v.0.1_12', note: 'Hotovo: instalovatelná PWA, update flow po deployi, katalog nákupů a cloudové Hotovo/Vrátit/Smazat.' },
      { title: 'Domácnost+ v.0.1_13', note: 'Hotovo: rychlé přidání často používaných nákupů, lokální statistika katalogu a stabilnější PWA popisky.' },
      { title: 'Domácnost+ v.0.1_14', note: 'Hotovo: cloudové Smlouvy bez příloh, načtení/odeslání/smazání přes Supabase.' },
      { title: 'Domácnost+ v.0.1_17', note: 'Hotovo: cloudový základ Garáže — auta, tankování, servis, načtení a odeslání lokálních dat.' },
      { title: 'Domácnost+ v.0.1_18', note: 'Hotovo: editace tankování/servisu, Fuelio import rovnou do cloudu a stabilnější Garáž sync.' },
      { title: 'Domácnost+ v.0.1_20', note: 'Hotovo: cloudový svoz odpadu, základ připomínek a dashboardové stavy cloud/lokál.' },
      { title: 'Domácnost+ v.0.1_24', note: 'Hotovo: cloudový Kalendář a příprava na Google Calendar bez tokenů ve frontendu.' },
      { title: 'Domácnost+ v.0.1_26', note: 'Hotovo: tvrdší oprava PWA ikon, relativní cesty, root apple-touch fallback a cache-busting pro iPhone/Android.' },
      { title: 'Domácnost+ v.0.1_28', note: 'Hotovo: PWA diagnostika manifestu, ikon, Apple touch ikon, service workeru a cache přímo v aplikaci.' },
      { title: 'Domácnost+ v.0.1_30', note: 'Hotovo: správa více cloud domácností, přepínání domácnosti a připravený panel pozvánek.' },
      { title: 'Domácnost+ v.0.1_33', note: 'Hotovo: finance v cloudu a profil po přijetí pozvánky.' },
      { title: 'Domácnost+ v.0.1_40', note: 'Hotovo: bohatší demo, potvrzení e-mailu, opětovné odeslání ověřovacího e-mailu a přechod z demo do ostré domácnosti.' },
      { title: 'Domácnost+ v.0.1_44', note: 'Hotovo: kontrola Supabase Auth nastavení, bezpečnější přechod demo → ostrá domácnost a jasný stav redirect URL.' },
      { title: 'Domácnost+ v.0.1_34', note: 'Hotovo: variabilní finanční účty, peněženky, obálky a osobní zůstatky.' }
    ];
    return `
      <section class="card roadmap-card">
        <div class="card-header"><div><h2>Co mám v plánu dál</h2><p>Cloudová kostra běží. Další větší směr je převod modulů a synchronizace dat.</p></div><span class="badge">roadmap</span></div>
        <div class="list">
          ${steps.map((step, index) => `
            <div class="item">
              <div class="item-top"><div class="item-title">${escapeHtml(step.title)}</div><span class="badge ${index === 0 ? 'good' : ''}">${index === 0 ? 'hotovo' : 'další'}</span></div>
              <div class="item-meta">${escapeHtml(step.note)}</div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  function renderModuleStatusCard(module) {
    const stats = getModuleStats(module.id);
    return `
      <button class="item module-hub-item module-status-card" type="button" data-nav="${module.id}">
        <div class="module-status-icon">${module.icon}</div>
        <div class="item-top"><div class="item-title">${escapeHtml(module.label)}</div><span class="badge">${stats.count} ${escapeHtml(stats.label)}</span></div>
        <div class="item-meta">${escapeHtml(stats.note)}</div>
      </button>
    `;
  }

  function renderCalendar() {
    const events = [...state.calendar].sort((a, b) => `${a.date || ''}${a.time || ''}`.localeCompare(`${b.date || ''}${b.time || ''}`));
    const cloudReady = Boolean(state.cloud?.householdId);
    const localOnly = events.filter((event) => !event.cloudId).length;
    const cloudCount = events.filter((event) => event.cloudId).length;
    return `
      <div class="grid two">
        <section class="card">
          <div class="card-header">
            <div><h2>Přidat událost</h2><p>Ruční kalendář už umí cloud. Google Calendar přijde později přes backend bez tokenů ve frontendu.</p></div>
            <span class="badge ${cloudCount ? 'good' : ''}">${cloudCount ? 'cloud' : 'lokálně'}</span>
          </div>
          <form data-form="add-event">
            <div class="form-grid two">
              ${field('Název', 'title', 'text', 'Doktor / návštěva / výlet', true)}
              ${field('Datum', 'date', 'date', '', true, todayISO())}
              ${field('Začátek', 'time', 'time', '')}
              ${field('Konec', 'endTime', 'time', '')}
              ${selectField('Typ', 'type', [['event', 'Událost'], ['family', 'Rodina'], ['shift', 'Směna'], ['reminder', 'Připomínka'], ['holiday', 'Volno/svátek'], ['other', 'Ostatní']])}
              ${field('Místo', 'location', 'text', 'volitelné')}
              ${field('Poznámka', 'note', 'text', 'volitelné')}
            </div>
            <div class="form-actions">
              <button class="primary-btn" type="submit">Uložit událost</button>
              ${cloudReady ? '<button class="ghost-btn" type="button" data-action="cloud-load-calendar">Načíst cloud kalendář</button>' : ''}
              ${cloudReady && localOnly ? `<button class="ghost-btn" type="button" data-action="cloud-sync-local-calendar">Odeslat lokální (${localOnly})</button>` : ''}
            </div>
          </form>
          <div class="inline-note" style="margin-top:12px;">Google Calendar bude později přes backend/Supabase/Vercel funkci. Tokeny se nebudou ukládat do frontendu.</div>
        </section>
        <section class="card">
          <div class="card-header"><div><h2>Události</h2><p>${events.length} položek · ${cloudCount} cloud</p></div></div>
          ${events.length ? renderEventList(events, true) : renderEmpty('Zatím žádná událost.')}
        </section>
      </div>
    `;
  }

  function renderEventList(events, withDelete = false) {
    return `<div class="list">${events.map((event) => `
      <div class="item">
        <div class="item-top">
          <div class="item-title">${escapeHtml(event.title)}</div>
          <span class="badge ${event.cloudId ? 'good' : ''}">${event.cloudId ? 'cloud' : 'lokálně'}</span>
        </div>
        <div class="item-meta">${formatDate(event.date)} · ${escapeHtml(event.time || 'celý den')}${event.endTime ? `–${escapeHtml(event.endTime)}` : ''}${event.location ? ` · ${escapeHtml(event.location)}` : ''}${event.note ? ` · ${escapeHtml(event.note)}` : ''}</div>
        ${withDelete ? `<div class="item-actions">${state.cloud?.householdId && !event.cloudId ? `<button class="ghost-btn" type="button" data-action="cloud-sync-calendar" data-id="${event.id}">Odeslat</button>` : ''}<button class="danger-btn" type="button" data-action="delete-calendar" data-id="${event.id}">Smazat</button></div>` : ''}
      </div>
    `).join('')}</div>`;
  }

  function renderPackages() {
    const packages = [...state.packages].sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
    const cloudReady = Boolean(state.cloud?.householdId);
    const localOnly = packages.filter((pkg) => !pkg.cloudId).length;
    return `
      <div class="grid two">
        <section class="card">
          <div class="card-header">
            <div><h2>Přidat balík</h2><p>Ruční sledování zásilek. Automatika přes e-mail/backend přijde později.</p></div>
            <span class="badge ${packages.some((pkg) => pkg.cloudId) ? 'good' : ''}">${packages.some((pkg) => pkg.cloudId) ? 'cloud' : 'lokálně'}</span>
          </div>
          <form data-form="add-package">
            <div class="form-grid two">
              ${selectField('Dopravce', 'carrier', [['zasilkovna','Zásilkovna'], ['balikovna','Balíkovna'], ['ceska_posta','Česká pošta'], ['ppl','PPL'], ['dpd','DPD'], ['gls','GLS'], ['one','One by Allegro'], ['alza','Alza'], ['other','Jiný']])}
              ${field('Číslo zásilky', 'tracking', 'text', 'např. Z123456789', true)}
              ${field('Název / obchod', 'title', 'text', 'např. Temu / Alza / dárek')}
              ${selectField('Stav', 'status', [['new', 'Nový'], ['transit', 'Na cestě'], ['pickup', 'K vyzvednutí'], ['delivered', 'Doručeno'], ['problem', 'Problém']])}
              ${field('Předpoklad doručení', 'expectedDate', 'date', '')}
              ${field('Výdejní místo', 'pickupPlace', 'text', 'volitelné')}
              ${field('Odkaz na tracking', 'url', 'url', 'volitelné')}
              ${field('Poznámka', 'note', 'text', 'co to je / poznámka')}
            </div>
            <div class="form-actions">
              <button class="primary-btn" type="submit">Přidat balík</button>
              ${cloudReady ? '<button class="ghost-btn" type="button" data-action="cloud-load-parcels">Načíst cloud balíky</button>' : ''}
              ${cloudReady && localOnly ? `<button class="ghost-btn" type="button" data-action="cloud-sync-local-parcels">Odeslat lokální (${localOnly})</button>` : ''}
            </div>
          </form>
          <div class="inline-note" style="margin-top:12px;">Balíky jsou při cloudu oddělené podle domácnosti. Cizí domácnost neuvidí tvoje tracking čísla ani poznámky.</div>
        </section>
        <section class="card">
          <div class="card-header"><div><h2>Aktivní balíky</h2><p>${packages.length} položek</p></div></div>
          ${packages.length ? `<div class="list">${packages.map(renderPackageItem).join('')}</div>` : renderEmpty('Zatím žádný balík.')}
        </section>
      </div>
    `;
  }

  function renderPackageItem(pkg) {
    const status = packageStatus(pkg.status);
    return `
      <div class="item">
        <div class="item-top">
          <div class="item-title">${escapeHtml(pkg.title || carrierLabel(pkg.carrier) || 'Balík')}</div>
          <span class="badge ${status.kind}">${escapeHtml(status.label)}</span>
        </div>
        <div class="item-meta">${escapeHtml(carrierLabel(pkg.carrier))} · ${escapeHtml(pkg.tracking)}${pkg.expectedDate ? ` · doručení ${formatDate(pkg.expectedDate)}` : ''}${pkg.pickupPlace ? ` · ${escapeHtml(pkg.pickupPlace)}` : ''}${pkg.note ? ` · ${escapeHtml(pkg.note)}` : ''}${pkg.cloudId ? ' · cloud' : ' · lokálně'}</div>
        <div class="item-actions">
          <button class="ghost-btn" type="button" data-action="copy" data-value="${escapeHtml(pkg.tracking)}">Kopírovat číslo</button>
          ${pkg.url ? `<a class="ghost-btn" href="${escapeHtml(pkg.url)}" target="_blank" rel="noopener">Tracking</a>` : ''}
          <button class="ghost-btn" type="button" data-action="package-status" data-id="${pkg.id}" data-status="pickup">K vyzvednutí</button>
          <button class="ghost-btn" type="button" data-action="package-status" data-id="${pkg.id}" data-status="delivered">Doručeno</button>
          ${state.cloud?.householdId && !pkg.cloudId ? `<button class="ghost-btn" type="button" data-action="cloud-sync-parcel" data-id="${pkg.id}">Odeslat</button>` : ''}
          <button class="danger-btn" type="button" data-action="delete-package" data-id="${pkg.id}">Smazat</button>
        </div>
      </div>
    `;
  }

  function packageStatus(status) {
    const map = {
      new: { label: 'Nový', kind: '' },
      transit: { label: 'Na cestě', kind: '' },
      in_transit: { label: 'Na cestě', kind: '' },
      pickup: { label: 'K vyzvednutí', kind: 'good' },
      ready_pickup: { label: 'K vyzvednutí', kind: 'good' },
      delivered: { label: 'Doručeno', kind: 'good' },
      problem: { label: 'Problém', kind: 'bad' },
      archived: { label: 'Archiv', kind: '' }
    };
    return map[status] || map.new;
  }

  function carrierLabel(value) {
    const map = {
      zasilkovna: 'Zásilkovna', balikovna: 'Balíkovna', ceska_posta: 'Česká pošta', ppl: 'PPL', dpd: 'DPD', gls: 'GLS', one: 'One by Allegro', alza: 'Alza', other: 'Jiný'
    };
    return map[value] || value || 'Jiný';
  }

  function parcelStatusToCloud(status) {
    if (status === 'transit') return 'in_transit';
    if (status === 'pickup') return 'ready_pickup';
    return status || 'new';
  }

  function parcelStatusFromCloud(status) {
    if (status === 'in_transit') return 'transit';
    if (status === 'ready_pickup') return 'pickup';
    return status || 'new';
  }

  function getShoppingUnits() {
    const cloudUnits = state.shoppingCloud?.units || [];
    if (cloudUnits.length) return cloudUnits.map((unit) => [unit.code, unit.label || unit.code]);
    return SHOPPING_UNITS;
  }

  function getShoppingCategories() {
    const cloudCategories = state.shoppingCloud?.categories || [];
    if (cloudCategories.length) {
      return cloudCategories.map((category) => [category.name, category.icon || '🛒']);
    }
    return SHOPPING_CATEGORIES;
  }

  function getShoppingCatalog() {
    const cloudCatalog = state.shoppingCloud?.catalog || [];
    const mappedCloud = cloudCatalog.map((item) => ({
      id: item.id,
      name: item.name,
      defaultUnit: item.default_unit || item.defaultUnit || 'ks',
      category: item.category_name || item.category || 'Ostatní',
      householdId: item.household_id || '',
      source: item.household_id ? 'household' : 'global'
    }));
    const localCustom = (state.shoppingCatalogCustom || []).map((item) => ({ ...item, source: 'local' }));
    const base = mappedCloud.length ? mappedCloud : DEFAULT_SHOPPING_CATALOG;
    const byName = new Map();
    [...base, ...localCustom].forEach((item) => {
      if (!item?.name) return;
      byName.set(normalizeKey(item.name), item);
    });
    return [...byName.values()].sort((a, b) => String(a.name).localeCompare(String(b.name), 'cs'));
  }

  function findShoppingCatalogItem(name) {
    const key = normalizeKey(name);
    return getShoppingCatalog().find((item) => normalizeKey(item.name) === key) || null;
  }


  function getShoppingStat(name) {
    const key = normalizeKey(name);
    return state.shoppingStats?.[key] || null;
  }

  function trackShoppingUsage(name, unit = 'ks', category = 'Ostatní') {
    const key = normalizeKey(name);
    if (!key) return;
    const current = state.shoppingStats?.[key] || {};
    state.shoppingStats = {
      ...(state.shoppingStats || {}),
      [key]: {
        name: normalizeText(name),
        unit: normalizeText(unit) || current.unit || 'ks',
        category: normalizeText(category) || current.category || 'Ostatní',
        count: Number(current.count || 0) + 1,
        lastUsedAt: new Date().toISOString()
      }
    };
  }

  function getShoppingQuickItems(limit = 10) {
    const catalog = getShoppingCatalog();
    const nowMs = Date.now();
    const scored = catalog.map((item) => {
      const stat = getShoppingStat(item.name);
      const count = Number(stat?.count || item.usage_count || 0);
      const lastUsedMs = stat?.lastUsedAt ? new Date(stat.lastUsedAt).getTime() : 0;
      const recentBoost = lastUsedMs ? Math.max(0, 14 - Math.floor((nowMs - lastUsedMs) / 86400000)) : 0;
      const ownBoost = item.householdId || item.source === 'local' ? 4 : 0;
      return { ...item, score: count * 12 + recentBoost + ownBoost, count };
    });
    const active = scored.filter((item) => item.score > 0).sort((a, b) => b.score - a.score || String(a.name).localeCompare(String(b.name), 'cs'));
    const fallback = scored.filter((item) => item.score <= 0).sort((a, b) => String(a.name).localeCompare(String(b.name), 'cs'));
    return [...active, ...fallback].slice(0, limit);
  }

  function shoppingSourceLabel(item) {
    if (item.householdId || item.source === 'local') return 'vlastní domácnost';
    if (item.source === 'household') return 'vlastní domácnost';
    return 'základní katalog';
  }

  function renderShopping() {
    const openItems = state.shopping.filter((item) => !item.done);
    const doneItems = state.shopping.filter((item) => item.done);
    const coupons = [...state.coupons].sort((a, b) => String(a.expiry || '9999').localeCompare(String(b.expiry || '9999')));
    const units = getShoppingUnits();
    const categories = getShoppingCategories();
    const catalog = getShoppingCatalog();
    const quickItems = getShoppingQuickItems(10);
    const cloudReady = Boolean(state.cloud?.userId && state.cloud?.householdId);
    const ownCatalogCount = catalog.filter((item) => item.householdId || item.source === 'local').length;
    const localOnlyShoppingCount = state.shopping.filter((item) => !item.cloudId).length;
    return `
      <div class="grid two">
        <section class="card desktop-span-2">
          <div class="card-header">
            <div><h2>Nákupní seznam</h2><p>Vyber z katalogu, nastav množství a jednotku. Nově přidané položky zůstanou jen v tvojí domácnosti.</p></div>
            <span class="badge ${cloudReady ? 'good' : ''}">${cloudReady ? 'cloud nákupy' : 'lokálně'}</span>
          </div>
          <div class="cloud-status-grid">
            <div class="mini-stat"><span>Startovní katalog</span><strong>${catalog.length}</strong></div>
            <div class="mini-stat"><span>Vlastní položky</span><strong>${ownCatalogCount}</strong></div>
            <div class="mini-stat"><span>Na seznamu</span><strong>${openItems.length}</strong></div>
            <div class="mini-stat"><span>Jednotky</span><strong>${units.length}</strong></div>
          </div>
          <div class="quick-add-panel">
            <div class="quick-add-head"><strong>Rychlé přidání</strong><span>Časem se sem dostanou věci, které kupujete nejčastěji.</span></div>
            <div class="quick-chip-row">
              ${quickItems.map((item) => `<button class="quick-chip" type="button" data-action="quick-add-shopping" data-name="${escapeHtml(item.name)}"><span>${escapeHtml(item.name)}</span><small>${escapeHtml(item.defaultUnit || 'ks')}</small></button>`).join('')}
            </div>
          </div>
          <form data-form="add-shopping">
            <datalist id="shoppingCatalogList">
              ${catalog.map((item) => `<option value="${escapeHtml(item.name)}"></option>`).join('')}
            </datalist>
            <div class="form-grid four">
              <div class="field"><label>Položka</label><input class="input" name="name" list="shoppingCatalogList" placeholder="mléko / rohlíky / granule" required></div>
              ${selectField('Kategorie', 'category', categories.map(([name]) => [name, name]), 'Ostatní')}
              ${field('Množství', 'quantity', 'number', '1')}
              ${selectField('Jednotka', 'unit', units, 'ks')}
              ${field('Poznámka', 'note', 'text', 'volitelné')}
            </div>
            <div class="form-actions">
              <button class="primary-btn" type="submit">Přidat do seznamu</button>
              ${cloudReady ? `<button class="ghost-btn" type="button" data-action="cloud-load-shopping">Načíst cloud nákupy</button>` : ''}
              ${cloudReady && localOnlyShoppingCount ? `<button class="ghost-btn" type="button" data-action="cloud-sync-local-shopping">Odeslat lokální (${localOnlyShoppingCount})</button>` : ''}
            </div>
          </form>
          <div class="hint-box">Když zadáš novou položku, která není v katalogu, uloží se jako vlastní položka téhle domácnosti. Nepřepíše se nikomu jinému.</div>
          <div style="height:14px"></div>
          ${openItems.length ? `<div class="list">${openItems.map(renderShoppingItem).join('')}</div>` : renderEmpty('Nákupní seznam je prázdný.')}
          ${doneItems.length ? `<div class="card-header" style="margin-top:16px"><div><h3>Hotovo</h3><p>${doneItems.length} položek</p></div></div><div class="list">${doneItems.slice(0, 6).map(renderShoppingItem).join('')}</div>` : ''}
        </section>

        <section class="card">
          <div class="card-header"><div><h2>Katalog domácnosti</h2><p>Časté věci k nákupu. Základ je společný, tvoje vlastní položky jsou oddělené podle domácnosti.</p></div></div>
          <div class="list compact-list">
            ${catalog.slice(0, 24).map((item) => `<div class="item compact-item"><div class="item-top"><div class="item-title">${escapeHtml(item.name)}</div><span class="badge">${escapeHtml(item.defaultUnit || 'ks')}</span></div><div class="item-meta">${escapeHtml(item.category || 'Ostatní')} · ${shoppingSourceLabel(item)}${getShoppingStat(item.name)?.count ? ` · použito ${getShoppingStat(item.name).count}×` : ''}</div><div class="item-actions"><button class="ghost-btn" type="button" data-action="quick-add-shopping" data-name="${escapeHtml(item.name)}">Přidat</button></div></div>`).join('')}
          </div>
        </section>

        <section class="card">
          <div class="card-header"><div><h2>Slevové kódy</h2><p>Kupóny a kódy, které nechceš zapomenout.</p></div></div>
          <form data-form="add-coupon">
            <div class="form-grid two">
              ${field('Obchod / služba', 'store', 'text', 'Alza / Temu / Allegro', true)}
              ${field('Kód', 'code', 'text', 'SLEVA10', true)}
              ${field('Sleva', 'discount', 'text', '10 % / 200 Kč')}
              ${field('Platnost do', 'expiry', 'date', '')}
              ${field('Poznámka', 'note', 'text', 'volitelné')}
            </div>
            <div class="form-actions"><button class="primary-btn" type="submit">Uložit kód</button></div>
          </form>
          <div style="height:14px"></div>
          ${coupons.length ? `<div class="list">${coupons.map(renderCouponItem).join('')}</div>` : renderEmpty('Zatím nemáš uložený žádný slevový kód.')}
        </section>
      </div>
    `;
  }

  function renderShoppingItem(item) {
    const amount = [item.quantity || item.amount || 1, item.unit || 'ks'].filter(Boolean).join(' ');
    return `
      <div class="item">
        <div class="item-top">
          <div class="item-title">${item.done ? '✓ ' : ''}${escapeHtml(item.name)}</div>
          <span class="badge">${escapeHtml(amount)}</span>
        </div>
        <div class="item-meta">${escapeHtml(item.category || 'bez kategorie')}${item.note ? ` · ${escapeHtml(item.note)}` : ''}${item.cloudId ? ' · cloud' : ''}</div>
        <div class="item-actions">
          <button class="ghost-btn" type="button" data-action="toggle-done" data-collection="shopping" data-id="${item.id}">${item.done ? 'Vrátit' : 'Hotovo'}</button>
          <button class="danger-btn" type="button" data-action="delete" data-collection="shopping" data-id="${item.id}">Smazat</button>
        </div>
      </div>
    `;
  }

  function renderCouponItem(coupon) {
    const left = daysUntil(coupon.expiry);
    const badgeClass = left === null ? '' : left < 0 ? 'bad' : left <= 7 ? 'warn' : 'good';
    const badgeText = left === null ? 'bez expirace' : left < 0 ? 'propadlý' : `${left} dní`;
    return `
      <div class="item">
        <div class="item-top">
          <div class="item-title">${escapeHtml(coupon.store)}</div>
          <span class="badge ${badgeClass}">${escapeHtml(badgeText)}</span>
        </div>
        <div class="item-meta">Kód: <strong>${escapeHtml(coupon.code)}</strong>${coupon.discount ? ` · ${escapeHtml(coupon.discount)}` : ''}${coupon.expiry ? ` · do ${formatDate(coupon.expiry)}` : ''}${coupon.note ? ` · ${escapeHtml(coupon.note)}` : ''}</div>
        <div class="item-actions">
          <button class="ghost-btn" type="button" data-action="copy" data-value="${escapeHtml(coupon.code)}">Kopírovat kód</button>
          <button class="ghost-btn" type="button" data-action="toggle-used" data-id="${coupon.id}">${coupon.used ? 'Nepoužitý' : 'Použitý'}</button>
          <button class="danger-btn" type="button" data-action="delete" data-collection="coupons" data-id="${coupon.id}">Smazat</button>
        </div>
      </div>
    `;
  }

  function renderHomecare() {
    const hdo = getHdoStatus(now);
    const tasks = [...state.homeTasks].sort((a, b) => Number(a.done) - Number(b.done));
    const waste = [...state.waste].sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')));
    const notes = [...state.notes].sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
    const devices = [...state.devices].sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));

    return `
      <div class="grid two">
        <section class="card">
          <div class="card-header">
            <div><h2>HDO / nízký tarif</h2><p>${escapeHtml(hdo.message)}</p></div>
            <span class="badge ${hdo.active ? 'good' : 'warn'}">${hdo.active ? 'běží' : 'neběží'} · ${state.hdoWindows.some((item) => item.cloudId) ? 'cloud' : 'lokálně'}</span>
          </div>
          <form data-form="add-hdo">
            <div class="form-grid two">
              ${field('Název okna', 'label', 'text', 'např. Večerní tarif', true)}
              ${field('Od', 'start', 'time', '', true)}
              ${field('Do', 'end', 'time', '', true)}
              ${selectField('Dny', 'daysMode', [['all', 'Každý den'], ['workdays', 'Po–Pá'], ['weekend', 'Víkend']])}
            </div>
            <div class="form-actions"><button class="primary-btn" type="submit">Přidat HDO okno</button>${state.cloud?.householdId ? '<button class="ghost-btn" type="button" data-action="cloud-load-hdo">Načíst cloud HDO</button>' : ''}${state.cloud?.householdId && state.hdoWindows.some((item) => !item.cloudId) ? `<button class="ghost-btn" type="button" data-action="cloud-sync-local-hdo">Odeslat lokální HDO (${state.hdoWindows.filter((item) => !item.cloudId).length})</button>` : ''}</div>
          </form>
          <div style="height:14px"></div>
          ${state.hdoWindows.length ? `<div class="list">${state.hdoWindows.map((item) => `
            <div class="item">
              <div class="item-top"><div class="item-title">${escapeHtml(item.label)}</div><span class="badge ${item.enabled ? 'good' : ''}">${item.enabled ? 'aktivní' : 'vypnuto'}</span></div>
              <div class="item-meta">${escapeHtml(item.start)}–${escapeHtml(item.end)} · ${escapeHtml(daysLabel(item.days))}${item.cloudId ? ' · cloud' : ' · lokálně'}</div>
              <div class="item-actions"><button class="ghost-btn" type="button" data-action="toggle-hdo" data-id="${item.id}">${item.enabled ? 'Vypnout' : 'Zapnout'}</button>${state.cloud?.householdId && !item.cloudId ? `<button class="ghost-btn" type="button" data-action="cloud-sync-hdo" data-id="${item.id}">Odeslat</button>` : ''}<button class="danger-btn" type="button" data-action="delete-hdo" data-id="${item.id}">Smazat</button></div>
            </div>
          `).join('')}</div>` : renderEmpty('Zatím není nastavené žádné HDO okno.')}
        </section>

        <section class="card">
          <div class="card-header">
            <div><h2>Odpad</h2><p>Svoz odpadu s přípravou na připomínky.</p></div>
            <span class="badge ${waste.some((item) => item.cloudId) ? 'good' : ''}">${waste.some((item) => item.cloudId) ? 'cloud' : 'lokálně'}</span>
          </div>
          <form data-form="add-waste">
            <div class="form-grid two">
              ${field('Typ', 'type', 'text', 'plast / papír / komunál', true)}
              ${field('Datum svozu', 'date', 'date', '', true)}
              ${selectField('Opakování', 'repeatRule', [['none', 'Jednorázově'], ['weekly', 'Týdně'], ['biweekly', 'Každé 2 týdny'], ['monthly', 'Měsíčně']])}
              ${field('Upozornit předem (hod)', 'notifyBeforeHours', 'number', '12')}
              ${field('Poznámka', 'note', 'text', 'volitelné')}
            </div>
            <div class="form-actions"><button class="primary-btn" type="submit">Přidat svoz</button>${state.cloud?.householdId ? '<button class="ghost-btn" type="button" data-action="cloud-load-waste">Načíst cloud odpad</button>' : ''}${state.cloud?.householdId && waste.some((item) => !item.cloudId) ? `<button class="ghost-btn" type="button" data-action="cloud-sync-local-waste">Odeslat lokální svozy (${waste.filter((item) => !item.cloudId).length})</button>` : ''}</div>
          </form>
          <div style="height:14px"></div>
          ${waste.length ? `<div class="list">${waste.map((item) => `
            <div class="item">
              <div class="item-top"><div class="item-title">${escapeHtml(item.type)}</div><span class="badge ${daysUntil(item.date) <= 1 ? 'warn' : ''}">${formatDate(item.date)}</span></div>
              <div class="item-meta">${escapeHtml(wasteRepeatLabel(item.repeatRule))}${item.notifyBeforeHours ? ` · připomenout ${escapeHtml(String(item.notifyBeforeHours))} h předem` : ''}${item.note ? ` · ${escapeHtml(item.note)}` : ''}${item.cloudId ? ' · cloud' : ' · lokálně'}</div>
              <div class="item-actions">${state.cloud?.householdId && !item.cloudId ? `<button class="ghost-btn" type="button" data-action="cloud-sync-waste" data-id="${item.id}">Odeslat</button>` : ''}<button class="danger-btn" type="button" data-action="delete-waste" data-id="${item.id}">Smazat</button></div>
            </div>
          `).join('')}</div>` : renderEmpty('Žádný svoz zatím není uložený.')}
        </section>

        <section class="card">
          <div class="card-header">
            <div><h2>Úkoly a poznámky</h2><p>Domácí úkoly jsou připravené pro cloud i budoucí notifikace.</p></div>
            <span class="badge ${tasks.some((task) => task.cloudId) ? 'good' : ''}">${tasks.some((task) => task.cloudId) ? 'cloud' : 'lokálně'}</span>
          </div>
          <form data-form="add-task">
            <div class="form-grid two">
              ${field('Úkol', 'title', 'text', 'vyměnit filtr / koupit baterky', true)}
              ${field('Termín', 'due', 'date', '')}
              ${selectField('Kategorie', 'category', TASK_CATEGORY_OPTIONS, 'domacnost')}
              ${selectField('Priorita', 'priority', TASK_PRIORITY_OPTIONS, 'normal')}
              ${field('Poznámka', 'note', 'text', 'volitelné')}
            </div>
            <div class="form-actions"><button class="primary-btn" type="submit">Přidat úkol</button>${state.cloud?.householdId ? '<button class="ghost-btn" type="button" data-action="cloud-load-tasks">Načíst cloud úkoly</button>' : ''}${state.cloud?.householdId && tasks.some((task) => !task.cloudId) ? `<button class="ghost-btn" type="button" data-action="cloud-sync-local-tasks">Odeslat lokální úkoly (${tasks.filter((task) => !task.cloudId).length})</button>` : ''}</div>
          </form>
          <div style="height:14px"></div>
          ${tasks.length ? `<div class="list">${tasks.map((task) => `
            <div class="item">
              <div class="item-top"><div class="item-title">${task.done ? '✓ ' : ''}${escapeHtml(task.title)}</div><span class="badge ${task.due && daysUntil(task.due) <= 2 && !task.done ? 'warn' : ''}">${task.due ? formatDate(task.due) : 'bez termínu'}</span></div>
              <div class="item-meta">${escapeHtml(taskCategoryLabel(task.category))} · ${escapeHtml(taskPriorityLabel(task.priority))}${task.note ? ` · ${escapeHtml(task.note)}` : ''}${task.cloudId ? ' · cloud' : ' · lokálně'}</div>
              <div class="item-actions">${state.cloud?.householdId && !task.cloudId ? `<button class="ghost-btn" type="button" data-action="cloud-sync-task" data-id="${task.id}">Odeslat</button>` : ''}<button class="ghost-btn" type="button" data-action="task-toggle" data-id="${task.id}">${task.done ? 'Vrátit' : 'Hotovo'}</button><button class="danger-btn" type="button" data-action="task-delete" data-id="${task.id}">Smazat</button></div>
            </div>
          `).join('')}</div>` : renderEmpty('Zatím žádný domácí úkol.')}
          <form data-form="add-note" style="margin-top:14px;">
            <div class="form-grid">
              ${field('Rychlá poznámka', 'text', 'text', 'např. zavolat servis', true)}
            </div>
            <div class="form-actions"><button class="ghost-btn" type="submit">Přidat poznámku</button></div>
          </form>
          ${notes.length ? `<div class="list" style="margin-top:12px;">${notes.slice(0, 6).map((note) => `
            <div class="item"><div class="item-top"><div class="item-title">${escapeHtml(note.text)}</div><button class="danger-btn" type="button" data-action="delete" data-collection="notes" data-id="${note.id}">Smazat</button></div></div>
          `).join('')}</div>` : ''}
        </section>

        <section class="card">
          <div class="card-header"><div><h2>Domácí zařízení / síť</h2><p>Routery, NAS, kamery, tablety a další věci doma.</p></div></div>
          <form data-form="add-device">
            <div class="form-grid two">
              ${field('Název', 'name', 'text', 'WD My Cloud / router / kamera', true)}
              ${field('Typ', 'type', 'text', 'síť / TV / kamera')}
              ${field('IP / adresa', 'address', 'text', '192.168.1.10')}
              ${field('Poznámka', 'note', 'text', 'volitelné')}
            </div>
            <div class="form-actions"><button class="primary-btn" type="submit">Přidat zařízení</button></div>
          </form>
          <div style="height:14px"></div>
          ${devices.length ? `<div class="list">${devices.map((device) => `
            <div class="item">
              <div class="item-top"><div class="item-title">${escapeHtml(device.name)}</div><span class="badge">${escapeHtml(device.type || 'zařízení')}</span></div>
              <div class="item-meta">${escapeHtml(device.address || 'bez adresy')}${device.note ? ` · ${escapeHtml(device.note)}` : ''}</div>
              <div class="item-actions"><button class="danger-btn" type="button" data-action="delete" data-collection="devices" data-id="${device.id}">Smazat</button></div>
            </div>
          `).join('')}</div>` : renderEmpty('Zatím žádné zařízení.')}
        </section>
      </div>
    `;
  }

  function renderGarage() {
    const vehicles = state.vehicles;
    if (!garageVehicleId && vehicles.length) garageVehicleId = vehicles[0].id;
    const activeVehicle = vehicles.find((vehicle) => vehicle.id === garageVehicleId) || null;

    return `
      <div class="grid two">
        <section class="card">
          <div class="card-header"><div><h2>Auta</h2><p>Seznam vozidel v domácnosti, termíny a rychlý stav.</p></div><span class="badge ${state.cloud?.householdId ? 'good' : ''}">${state.cloud?.householdId ? 'cloud ready' : 'lokálně'}</span></div>
          <div class="form-actions compact-actions">
            <button class="ghost-btn" type="button" data-action="cloud-load-garage">Načíst cloud Garáž</button>
            <button class="ghost-btn" type="button" data-action="cloud-sync-local-garage">Odeslat lokální Garáž</button>
          </div>
          <form data-form="add-vehicle">
            <div class="form-grid two">
              ${field('Název auta', 'name', 'text', 'Elroq / Octavia', true)}
              ${field('SPZ', 'plate', 'text', 'volitelné')}
              ${field('Palivo', 'fuelType', 'text', 'benzín / nafta / elektro')}
              ${field('Aktuální km', 'odometer', 'number', '0')}
              ${field('STK do', 'technicalInspectionUntil', 'date', '')}
              ${field('Pojistka do', 'insuranceUntil', 'date', '')}
            </div>
            <div class="form-actions"><button class="primary-btn" type="submit">Přidat auto</button></div>
          </form>
          <div style="height:14px"></div>
          ${vehicles.length ? `
            <div class="tabs-inline">
              ${vehicles.map((vehicle) => `<button class="tab-pill ${vehicle.id === garageVehicleId ? 'active' : ''}" type="button" data-action="select-vehicle" data-id="${vehicle.id}">${escapeHtml(vehicle.name)}</button>`).join('')}
            </div>
            <div class="list" style="margin-top:12px;">${vehicles.map((vehicle) => renderVehicleListItem(vehicle)).join('')}</div>
          ` : renderEmpty('Zatím není přidané žádné auto.')}
        </section>
        <section class="card">
          ${activeVehicle ? renderVehicleDetail(activeVehicle) : renderEmpty('Přidej první auto a tady se zobrazí tankování, servis, termíny a přehledy.')}
        </section>
        <section class="card desktop-span-2">
          ${renderFuelioImport()}
        </section>
      </div>
    `;
  }

  function renderVehicleListItem(vehicle) {
    const fuelRows = state.fuel.filter((item) => item.vehicleId === vehicle.id);
    const serviceRows = state.services.filter((item) => item.vehicleId === vehicle.id);
    const stats = getVehicleStats(sortFuelRows(fuelRows), serviceRows);
    const stk = dateStatus(vehicle.technicalInspectionUntil, 60);
    const insurance = dateStatus(vehicle.insuranceUntil, 45);
    const warningCount = [stk, insurance].filter((item) => item.className === 'warn' || item.className === 'bad').length;
    return `
      <div class="item ${vehicle.id === garageVehicleId ? 'selected' : ''}">
        <div class="item-top">
          <div class="item-title">${escapeHtml(vehicle.name)} ${vehicle.cloudId ? '<span class="soft-mark">cloud</span>' : '<span class="soft-mark">lokálně</span>'}</div>
          <span class="badge ${warningCount ? 'warn' : ''}">${warningCount ? `${warningCount} upozornění` : escapeHtml(vehicle.plate || 'bez SPZ')}</span>
        </div>
        <div class="item-meta">
          ${escapeHtml(vehicle.fuelType || 'palivo neuvedeno')} · ${escapeHtml(vehicle.odometer || 0)} km<br>
          Spotřeba ${stats.averageConsumption ? `${stats.averageConsumption.toFixed(2).replace('.', ',')} l/100 km` : '—'} · letos ${formatCurrency(stats.thisYearCost)}
        </div>
        <div class="mini-badges">
          <span class="badge ${stk.className}">STK: ${escapeHtml(stk.shortText)}</span>
          <span class="badge ${insurance.className}">pojistka: ${escapeHtml(insurance.shortText)}</span>
        </div>
        <div class="item-actions"><button class="ghost-btn" type="button" data-action="select-vehicle" data-id="${vehicle.id}">Detail</button><button class="danger-btn" type="button" data-action="delete-vehicle" data-id="${vehicle.id}">Smazat</button></div>
      </div>
    `;
  }

  function renderFuelioImport() {
    const rows = fuelioPreview?.rows || [];
    const stats = getFuelioPreviewStats(rows);
    return `
      <div class="card-header">
        <div><h2>Import z Fuelio</h2><p>Nahraj CSV export. Nejdřív se ukáže náhled, duplicity a až potom se data uloží.</p></div>
        <span class="badge">CSV</span>
      </div>
      <form data-form="fuelio-preview">
        <div class="upload-box">
          <label for="fuelioCsv">Fuelio CSV export</label>
          <input id="fuelioCsv" class="input" type="file" name="fuelioCsv" accept=".csv,text/csv" required>
          <p>Mapování je tolerantní: datum, km, litry, cena, poznámka, kategorie a vozidlo. Import nikdy nezapisuje data bez náhledu.</p>
        </div>
        <div class="form-actions"><button class="ghost-btn" type="submit">Načíst náhled</button></div>
      </form>
      ${fuelioPreview ? `
        <div class="preview-box">
          <div class="item-top"><div class="item-title">${escapeHtml(fuelioPreview.fileName)}</div><span class="badge good">náhled</span></div>
          <div class="kpi-row compact">
            <div class="kpi"><strong>${stats.fuelCount}</strong><span>tankování</span></div>
            <div class="kpi"><strong>${stats.serviceCount}</strong><span>servisy/náklady</span></div>
            <div class="kpi"><strong>${stats.vehicleCount || 1}</strong><span>vozidla</span></div>
            <div class="kpi"><strong>${stats.duplicateCount}</strong><span>možné duplicity</span></div>
          </div>
          <div class="inline-note">Import půjde do existujících aut podle názvu. Pokud CSV nemá název auta, použije se aktuálně vybrané auto nebo se vytvoří „Fuelio import“.</div>
          ${renderFuelioPreviewTable(rows)}
          <div class="form-actions">
            <button class="primary-btn" type="button" data-action="confirm-fuelio-import">Importovat lokálně</button>
            <button class="ghost-btn" type="button" data-action="confirm-fuelio-import-cloud">Importovat + uložit do cloudu</button>
            <button class="ghost-btn" type="button" data-action="clear-fuelio-preview">Zrušit náhled</button>
          </div>
          <div class="inline-note">Cloud import použije stejný náhled a potom odešle jen nové neuložené záznamy. Duplicity z Fuelia hlídá aplikace lokálně i databáze přes hash.</div>
        </div>
      ` : ''}
    `;
  }

  function renderFuelioPreviewTable(rows) {
    const sample = rows.slice(0, 8);
    if (!sample.length) return '';
    return `
      <div class="table-wrap" style="margin-top:12px;">
        <table class="preview-table">
          <thead><tr><th>Typ</th><th>Datum</th><th>Auto</th><th>Km</th><th>Litry</th><th>Cena</th><th>Poznámka</th></tr></thead>
          <tbody>
            ${sample.map((row) => `
              <tr>
                <td>${row.kind === 'fuel' ? 'Tankování' : 'Náklad'}</td>
                <td>${formatDate(row.date)}</td>
                <td>${escapeHtml(row.vehicleName || 'aktuální auto')}</td>
                <td>${escapeHtml(row.odometer || '—')}</td>
                <td>${row.liters ? escapeHtml(String(row.liters).replace('.', ',')) : '—'}</td>
                <td>${formatCurrency(row.price)}</td>
                <td>${escapeHtml(row.note || row.title || '—')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ${rows.length > sample.length ? `<div class="inline-note" style="margin-top:8px;">Zobrazuji prvních ${sample.length} řádků z ${rows.length}. Uloží se celý import bez duplicit.</div>` : ''}
    `;
  }


  function renderFuelListItem(item) {
    const isEditing = garageEditRecord?.collection === 'fuel' && garageEditRecord?.id === item.id;
    return `
      <div class="item ${isEditing ? 'selected' : ''}">
        <div class="item-top">
          <div class="item-title">${formatDate(item.date)}</div>
          <span class="badge ${item.cloudId ? 'good' : ''}">${item.cloudId ? 'cloud' : 'lokálně'} · ${escapeHtml(item.odometer || '—')} km</span>
        </div>
        <div class="item-meta">${escapeHtml(item.liters || 0)} l · ${formatCurrency(item.price)}${item.note ? ` · ${escapeHtml(item.note)}` : ''}</div>
        ${isEditing ? renderGarageRecordEditForm('fuel', item) : ''}
        <div class="item-actions">
          <button class="ghost-btn" type="button" data-action="edit-garage-record" data-collection="fuel" data-id="${item.id}">${isEditing ? 'Zavřít úpravu' : 'Upravit'}</button>
          <button class="danger-btn" type="button" data-action="delete" data-collection="fuel" data-id="${item.id}">Smazat</button>
        </div>
      </div>
    `;
  }

  function renderServiceListItem(item) {
    const isEditing = garageEditRecord?.collection === 'services' && garageEditRecord?.id === item.id;
    return `
      <div class="item ${isEditing ? 'selected' : ''}">
        <div class="item-top">
          <div class="item-title">${escapeHtml(item.title)}</div>
          <span class="badge ${item.cloudId ? 'good' : ''}">${item.cloudId ? 'cloud' : 'lokálně'} · ${formatDate(item.date)}</span>
        </div>
        <div class="item-meta">${formatCurrency(item.price)}${item.odometer ? ` · ${escapeHtml(item.odometer)} km` : ''}${item.note ? ` · ${escapeHtml(item.note)}` : ''}</div>
        ${isEditing ? renderGarageRecordEditForm('services', item) : ''}
        <div class="item-actions">
          <button class="ghost-btn" type="button" data-action="edit-garage-record" data-collection="services" data-id="${item.id}">${isEditing ? 'Zavřít úpravu' : 'Upravit'}</button>
          <button class="danger-btn" type="button" data-action="delete" data-collection="services" data-id="${item.id}">Smazat</button>
        </div>
      </div>
    `;
  }

  function renderGarageRecordEditForm(collection, item) {
    if (collection === 'fuel') {
      return `
        <form class="inline-edit-form" data-form="update-fuel" data-id="${item.id}">
          <div class="form-grid two">
            ${field('Datum', 'date', 'date', '', true, item.date || todayISO())}
            ${field('Stav km', 'odometer', 'number', 'např. 125000', true, item.odometer || '')}
            ${field('Litry', 'liters', 'number', 'např. 42,5', false, item.liters || '')}
            ${field('Cena celkem', 'price', 'number', 'např. 1600', false, item.price || '')}
            ${field('Poznámka', 'note', 'text', 'volitelné', false, item.note || '')}
          </div>
          <div class="form-actions"><button class="primary-btn" type="submit">Uložit tankování</button><button class="ghost-btn" type="button" data-action="cancel-garage-edit">Zrušit</button></div>
        </form>
      `;
    }
    return `
      <form class="inline-edit-form" data-form="update-service" data-id="${item.id}">
        <div class="form-grid two">
          ${field('Datum', 'date', 'date', '', true, item.date || todayISO())}
          ${field('Stav km', 'odometer', 'number', 'volitelné', false, item.odometer || '')}
          ${field('Popis', 'title', 'text', 'olej / pneu / STK', true, item.title || '')}
          ${field('Cena', 'price', 'number', 'volitelné', false, item.price || '')}
          ${field('Poznámka', 'note', 'text', 'volitelné', false, item.note || '')}
        </div>
        <div class="form-actions"><button class="primary-btn" type="submit">Uložit servis</button><button class="ghost-btn" type="button" data-action="cancel-garage-edit">Zrušit</button></div>
      </form>
    `;
  }

  function renderVehicleDetail(vehicle) {
    const fuelRows = sortFuelRows(state.fuel.filter((item) => item.vehicleId === vehicle.id));
    const serviceRows = state.services.filter((item) => item.vehicleId === vehicle.id).sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
    const stats = getVehicleStats(fuelRows, serviceRows);
    const latestFuel = fuelRows[fuelRows.length - 1] || null;
    const latestService = serviceRows[0] || null;
    const serviceStatus = getServiceStatus(vehicle, latestService, latestFuel);
    const stk = dateStatus(vehicle.technicalInspectionUntil, 60);
    const insurance = dateStatus(vehicle.insuranceUntil, 45);
    return `
      <div class="card-header">
        <div><h2>${escapeHtml(vehicle.name)}</h2><p>${escapeHtml(vehicle.plate || 'Bez SPZ')} · ${escapeHtml(vehicle.fuelType || 'palivo neuvedeno')}</p></div>
        <span class="badge ${vehicle.cloudId ? 'good' : ''}">${vehicle.cloudId ? 'cloud' : 'lokálně'} · ${escapeHtml(vehicle.odometer || latestFuel?.odometer || 0)} km</span>
      </div>
      <div class="kpi-row compact">
        <div class="kpi"><strong>${stats.averageConsumption ? `${stats.averageConsumption.toFixed(2).replace('.', ',')}` : '—'}</strong><span>l/100 km</span></div>
        <div class="kpi"><strong>${formatCurrency(stats.thisYearCost)}</strong><span>náklady letos</span></div>
        <div class="kpi"><strong>${formatCurrency(stats.fuelCost + stats.serviceCost)}</strong><span>celkem</span></div>
        <div class="kpi"><strong>${latestFuel ? formatDate(latestFuel.date, { day: 'numeric', month: 'numeric', year: '2-digit' }) : '—'}</strong><span>poslední tankování</span></div>
      </div>
      <div class="garage-status-grid">
        ${renderDueCard('STK', stk, 'Datum STK zatím není nastavené.')}
        ${renderDueCard('Pojistka', insurance, 'Datum konce pojistky zatím není nastavené.')}
        ${renderDueCard('Servis', serviceStatus, 'Servisní interval zatím není nastavený.')}
      </div>
      <div class="grid two">
        <div>
          <div class="card-header"><div><h3>Údaje auta</h3><p>Termíny a servisní intervaly.</p></div></div>
          <form data-form="update-vehicle" data-vehicle-id="${vehicle.id}">
            <div class="form-grid two">
              ${field('Název auta', 'name', 'text', 'Elroq / Octavia', true, vehicle.name)}
              ${field('SPZ', 'plate', 'text', 'volitelné', false, vehicle.plate || '')}
              ${field('Palivo', 'fuelType', 'text', 'benzín / nafta / elektro', false, vehicle.fuelType || '')}
              ${field('Aktuální km', 'odometer', 'number', '0', false, vehicle.odometer || latestFuel?.odometer || '')}
              ${field('STK do', 'technicalInspectionUntil', 'date', '', false, vehicle.technicalInspectionUntil || '')}
              ${field('Pojistka do', 'insuranceUntil', 'date', '', false, vehicle.insuranceUntil || '')}
              ${field('Další servis při km', 'nextServiceKm', 'number', 'např. 150000', false, vehicle.nextServiceKm || '')}
              ${field('Další servis do data', 'nextServiceDate', 'date', '', false, vehicle.nextServiceDate || '')}
              ${field('Poznámka', 'note', 'text', 'pneu, rozměr, VIN...', false, vehicle.note || '')}
            </div>
            <div class="form-actions"><button class="ghost-btn" type="submit">Uložit údaje auta</button><button class="ghost-btn" type="button" data-action="cloud-sync-vehicle" data-id="${vehicle.id}">Odeslat auto do cloudu</button></div>
          </form>
          ${renderMiniChart(fuelRows)}
        </div>
        <div>
          <form data-form="add-fuel" data-vehicle-id="${vehicle.id}">
            <div class="form-grid">
              ${field('Datum tankování', 'date', 'date', '', true, todayISO())}
              ${field('Stav km', 'odometer', 'number', 'např. 125000', true)}
              ${field('Litry', 'liters', 'number', 'např. 42,5')}
              ${field('Cena celkem', 'price', 'number', 'např. 1600')}
            </div>
            <div class="form-actions"><button class="primary-btn" type="submit">Přidat tankování</button></div>
          </form>
          <form data-form="add-service" data-vehicle-id="${vehicle.id}" style="margin-top:14px;">
            <div class="form-grid">
              ${field('Datum servisu', 'date', 'date', '', true, todayISO())}
              ${field('Popis', 'title', 'text', 'olej / pneu / STK', true)}
              ${field('Cena', 'price', 'number', 'volitelné')}
              ${field('Poznámka', 'note', 'text', 'volitelné')}
            </div>
            <div class="form-actions"><button class="ghost-btn" type="submit">Přidat servis</button></div>
          </form>
        </div>
      </div>
      <div style="height:14px"></div>
      <div class="grid two">
        <div>
          <div class="card-header"><div><h3>Tankování</h3><p>${fuelRows.length} záznamů</p></div></div>
          ${fuelRows.length ? `<div class="list">${[...fuelRows].reverse().slice(0, 8).map((item) => renderFuelListItem(item)).join('')}</div>` : renderEmpty('Zatím žádné tankování.')}
        </div>
        <div>
          <div class="card-header"><div><h3>Servisy</h3><p>${serviceRows.length} záznamů</p></div></div>
          ${serviceRows.length ? `<div class="list">${serviceRows.slice(0, 8).map((item) => renderServiceListItem(item)).join('')}</div>` : renderEmpty('Zatím žádný servis.')}
        </div>
      </div>
    `;
  }

  function sortFuelRows(rows) {
    return [...rows].sort((a, b) => Number(a.odometer || 0) - Number(b.odometer || 0) || String(a.date || '').localeCompare(String(b.date || '')));
  }

  function getVehicleStats(fuelRows, serviceRows) {
    let km = 0;
    let liters = 0;
    for (let index = 1; index < fuelRows.length; index += 1) {
      const previous = Number(fuelRows[index - 1].odometer || 0);
      const current = Number(fuelRows[index].odometer || 0);
      const rowLiters = Number(fuelRows[index].liters || 0);
      if (current > previous && rowLiters > 0) {
        km += current - previous;
        liters += rowLiters;
      }
    }
    const currentYear = new Date().getFullYear();
    const fuelCost = fuelRows.reduce((sum, item) => sum + Number(item.price || 0), 0);
    const serviceCost = serviceRows.reduce((sum, item) => sum + Number(item.price || 0), 0);
    const thisYearFuel = fuelRows.filter((item) => Number(String(item.date || '').slice(0, 4)) === currentYear).reduce((sum, item) => sum + Number(item.price || 0), 0);
    const thisYearService = serviceRows.filter((item) => Number(String(item.date || '').slice(0, 4)) === currentYear).reduce((sum, item) => sum + Number(item.price || 0), 0);
    return {
      averageConsumption: km > 0 ? (liters / km) * 100 : null,
      fuelCost,
      serviceCost,
      thisYearCost: thisYearFuel + thisYearService,
      totalKm: km
    };
  }

  function dateStatus(dateISO, warnDays = 45) {
    const left = daysUntil(dateISO);
    if (left === null) return { left: null, className: '', shortText: 'nenastaveno', text: 'nenastaveno' };
    if (left < 0) return { left, className: 'bad', shortText: `po termínu`, text: `po termínu ${Math.abs(left)} dní` };
    if (left === 0) return { left, className: 'bad', shortText: 'dnes', text: 'končí dnes' };
    if (left <= warnDays) return { left, className: 'warn', shortText: `${left} dní`, text: `zbývá ${left} dní` };
    return { left, className: 'good', shortText: `${left} dní`, text: `zbývá ${left} dní` };
  }

  function renderDueCard(label, status, emptyText) {
    const value = status.left === null ? emptyText : status.text;
    return `
      <div class="due-card ${status.className}">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(value)}</strong>
      </div>
    `;
  }

  function getServiceStatus(vehicle, latestService, latestFuel) {
    const date = dateStatus(vehicle.nextServiceDate, 45);
    const currentKm = Number(vehicle.odometer || latestFuel?.odometer || 0);
    const nextKm = Number(vehicle.nextServiceKm || 0);
    if (nextKm > 0 && currentKm > 0) {
      const leftKm = nextKm - currentKm;
      if (leftKm <= 0) return { left: -1, className: 'bad', shortText: 'servis', text: `servis po termínu o ${Math.abs(leftKm)} km` };
      if (leftKm <= 1500) return { left: leftKm, className: 'warn', shortText: `${leftKm} km`, text: `zbývá ${leftKm} km` };
      return { left: leftKm, className: date.className || 'good', shortText: `${leftKm} km`, text: date.left !== null && date.className === 'warn' ? `${leftKm} km · ${date.text}` : `zbývá ${leftKm} km` };
    }
    if (date.left !== null) return date;
    if (latestService) return { left: null, className: '', shortText: formatDate(latestService.date), text: `poslední servis ${formatDate(latestService.date)}` };
    return { left: null, className: '', shortText: 'nenastaveno', text: 'nenastaveno' };
  }

  function getFuelioPreviewStats(rows) {
    let duplicateCount = 0;
    const vehicleByName = new Map(state.vehicles.map((vehicle) => [normalizeKey(vehicle.name), vehicle]));
    const fallbackVehicle = state.vehicles.find((vehicle) => vehicle.id === garageVehicleId) || state.vehicles[0] || null;
    rows.forEach((row) => {
      const vehicle = row.vehicleName ? vehicleByName.get(normalizeKey(row.vehicleName)) : fallbackVehicle;
      const vehicleId = vehicle?.id || fallbackVehicle?.id || '';
      if (!vehicleId) return;
      if (row.kind === 'fuel' && fuelDuplicateExists(row, vehicleId)) duplicateCount += 1;
      if (row.kind === 'service' && serviceDuplicateExists(row, vehicleId)) duplicateCount += 1;
    });
    return {
      fuelCount: rows.filter((row) => row.kind === 'fuel').length,
      serviceCount: rows.filter((row) => row.kind === 'service').length,
      vehicleCount: new Set(rows.map((row) => row.vehicleName).filter(Boolean)).size,
      duplicateCount
    };
  }


  function renderMiniChart(fuelRows) {
    const points = [];
    const rows = fuelRows.filter((item) => Number(item.odometer) > 0 && Number(item.liters) > 0);
    for (let index = 1; index < rows.length; index += 1) {
      const prev = Number(rows[index - 1].odometer || 0);
      const current = Number(rows[index].odometer || 0);
      const liters = Number(rows[index].liters || 0);
      if (current > prev && liters > 0) points.push(Number(((liters / (current - prev)) * 100).toFixed(2)));
    }
    if (points.length < 2) return '<div class="inline-note" style="margin-top:12px;">Graf spotřeby se zobrazí po více tankováních s km a litry.</div>';
    const max = Math.max(...points, 12);
    const min = Math.min(...points, 0);
    const width = 320;
    const height = 130;
    const coords = points.map((point, index) => {
      const x = points.length === 1 ? 0 : (index / (points.length - 1)) * width;
      const y = height - ((point - min) / Math.max(max - min, 1)) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
    return `
      <svg class="mini-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Graf spotřeby">
        <polyline points="${coords}" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="0.72"></polyline>
      </svg>
    `;
  }

  function renderContracts() {
    const contracts = [...state.contracts].sort((a, b) => String(a.validTo || '9999').localeCompare(String(b.validTo || '9999')));
    if (!activeContractId && contracts.length) activeContractId = contracts[0].id;
    const activeContract = contracts.find((contract) => contract.id === activeContractId) || null;
    return `
      <div class="grid two">
        <section class="card">
          <div class="card-header"><div><h2>Přidat smlouvu / pojistku</h2><p>Základní evidence se ukládá podle domácnosti. Typy jsou sjednocené, aby šly později filtrovat a napojit na Garáž.</p></div><span class="badge ${state.cloud?.householdId ? 'good' : ''}">${state.cloud?.householdId ? 'cloud smlouvy' : 'lokálně'}</span></div>
          <form data-form="add-contract">
            <div class="form-grid two">
              ${field('Název', 'name', 'text', 'Povinné ručení / internet / elektřina', true)}
              ${selectField('Typ', 'type', contractTypeOptions('other'), 'other')}
              ${field('Poskytovatel', 'provider', 'text', 'pojišťovna / dodavatel')}
              ${field('Číslo smlouvy', 'number', 'text', 'volitelné')}
              ${field('Platnost od', 'validFrom', 'date', '')}
              ${field('Platnost do', 'validTo', 'date', '')}
              ${field('Částka', 'amount', 'number', 'např. 1250')}
              ${selectField('Frekvence platby', 'frequency', [['monthly', 'Měsíčně'], ['yearly', 'Ročně'], ['once', 'Jednorázově'], ['other', 'Jiné']])}
              ${field('Poznámka', 'note', 'text', 'volitelné')}
            </div>
            <div class="form-actions"><button class="primary-btn" type="submit">Uložit</button>${state.cloud?.householdId ? '<button class="ghost-btn" type="button" data-action="cloud-load-contracts">Načíst cloud smlouvy</button>' : ''}${state.cloud?.householdId && state.contracts.some((contract) => !contract.cloudId) ? `<button class="ghost-btn" type="button" data-action="cloud-sync-local-contracts">Odeslat lokální (${state.contracts.filter((contract) => !contract.cloudId).length})</button>` : ''}</div>
          </form>
          <div class="inline-note" style="margin-top:12px;">Základ smlouvy může být v cloudu podle domácnosti. PDF a fotky dokumentů se zatím ukládají jen v tomto prohlížeči. JSON export zatím obsahuje metadata, ne samotné soubory.</div>
        </section>
        <section class="card">
          <div class="card-header"><div><h2>Přehled</h2><p>${contracts.length} položek · ${contracts.filter((contract) => contract.cloudId).length} cloud</p></div></div>
          ${contracts.length ? `<div class="list">${contracts.map(renderContractItem).join('')}</div>` : renderEmpty('Zatím není uložená žádná smlouva ani pojistka.')}
        </section>
        <section class="card desktop-span-2">
          ${activeContract ? renderContractDetail(activeContract) : renderEmpty('Vyber nebo přidej smlouvu. Tady se zobrazí detail a přílohy.')}
        </section>
      </div>
    `;
  }

  function renderContractItem(contract) {
    const left = daysUntil(contract.validTo);
    const badgeClass = left === null ? '' : left < 0 ? 'bad' : left <= 45 ? 'warn' : 'good';
    const badgeText = left === null ? 'bez konce' : left < 0 ? 'propadlé' : `${left} dní`;
    const files = contractFileCount(contract.id);
    return `
      <div class="item ${contract.id === activeContractId ? 'selected' : ''}">
        <div class="item-top"><div class="item-title">${escapeHtml(contract.name)}</div><span class="badge ${badgeClass}">${escapeHtml(badgeText)}</span></div>
        <div class="item-meta">
          ${escapeHtml(contract.provider || 'Bez poskytovatele')} · ${escapeHtml(contractTypeLabel(contract.type))}${contract.number ? ` · č. ${escapeHtml(contract.number)}` : ''}<br>
          ${contract.validFrom ? `od ${formatDate(contract.validFrom)} · ` : ''}${contract.validTo ? `do ${formatDate(contract.validTo)} · ` : ''}${formatCurrency(contract.amount)} / ${frequencyLabel(contract.frequency)}${contract.cloudId ? ' · cloud' : ''}${contract.note ? ` · ${escapeHtml(contract.note)}` : ''}
        </div>
        <div class="item-actions">
          <button class="ghost-btn" type="button" data-action="select-contract" data-id="${contract.id}">Detail</button>
          ${state.cloud?.householdId && !contract.cloudId ? `<button class="ghost-btn" type="button" data-action="cloud-sync-contract" data-id="${contract.id}">Odeslat</button>` : ''}
          <span class="badge">${files} příloh</span>
          <button class="danger-btn" type="button" data-action="delete" data-collection="contracts" data-id="${contract.id}">Smazat</button>
        </div>
      </div>
    `;
  }

  function renderContractDetail(contract) {
    const files = state.contractFiles.filter((file) => file.contractId === contract.id).sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
    const left = daysUntil(contract.validTo);
    const statusText = left === null ? 'Bez nastaveného konce' : left < 0 ? `Propadlé před ${Math.abs(left)} dny` : left === 0 ? 'Končí dnes' : `Končí za ${left} dní`;
    return `
      <div class="card-header">
        <div><h2>${escapeHtml(contract.name)}</h2><p>${escapeHtml(contract.provider || 'Bez poskytovatele')} · ${escapeHtml(contractTypeLabel(contract.type))}</p></div>
        <span class="badge ${left !== null && left <= 45 ? (left < 0 ? 'bad' : 'warn') : 'good'}">${escapeHtml(statusText)}</span>
      </div>
      <div class="grid two">
        <div class="detail-stack">
          <div class="stat-line"><span>Číslo smlouvy</span><strong>${escapeHtml(contract.number || '—')}</strong></div>
          <div class="stat-line"><span>Platnost</span><strong>${contract.validFrom ? formatDate(contract.validFrom) : '—'} → ${contract.validTo ? formatDate(contract.validTo) : '—'}</strong></div>
          <div class="stat-line"><span>Platba</span><strong>${formatCurrency(contract.amount)} / ${frequencyLabel(contract.frequency)}</strong></div>
          <div class="stat-line"><span>Přílohy</span><strong>${files.length}</strong></div>
          ${contract.note ? `<div class="inline-note">${escapeHtml(contract.note)}</div>` : ''}
        </div>
        <div>
          <form data-form="update-contract" data-contract-id="${contract.id}" class="compact-form">
            <div class="card-header small"><div><h3>Upravit údaje</h3><p>Změna se uloží lokálně a u cloudové smlouvy rovnou i do Supabase.</p></div></div>
            <div class="form-grid two">
              ${field('Název', 'name', 'text', 'Název smlouvy', true, contract.name || '')}
              ${selectField('Typ', 'type', contractTypeOptions(contract.type || 'other'), contract.type || 'other')}
              ${field('Poskytovatel', 'provider', 'text', 'Poskytovatel', false, contract.provider || '')}
              ${field('Číslo smlouvy', 'number', 'text', 'Číslo smlouvy', false, contract.number || '')}
              ${field('Platnost od', 'validFrom', 'date', '', false, contract.validFrom || '')}
              ${field('Platnost do', 'validTo', 'date', '', false, contract.validTo || '')}
              ${field('Částka', 'amount', 'number', 'např. 1250', false, contract.amount || '')}
              ${selectField('Frekvence platby', 'frequency', [['monthly', 'Měsíčně'], ['quarterly', 'Čtvrtletně'], ['yearly', 'Ročně'], ['once', 'Jednorázově'], ['other', 'Jiné']], contract.frequency || 'monthly')}
              ${field('Poznámka', 'note', 'text', 'volitelné', false, contract.note || '')}
            </div>
            <div class="form-actions"><button class="primary-btn" type="submit">Uložit změny</button>${contract.cloudId ? '<span class="badge good">cloud update</span>' : '<span class="badge">lokální smlouva</span>'}</div>
          </form>
        </div>
      </div>
      <div style="height:14px"></div>
      <div class="grid two">
        <div>
          <form data-form="add-contract-file" data-contract-id="${contract.id}">
            <div class="upload-box">
              <label for="contractFiles">PDF / fotka smlouvy</label>
              <input id="contractFiles" class="input" type="file" name="files" multiple accept="application/pdf,image/*,.pdf">
              <p>Na iPhonu/Androidu můžeš vybrat soubor, fotku z galerie nebo rovnou vyfotit dokument podle nabídky systému.</p>
            </div>
            <div class="form-actions"><button class="primary-btn" type="submit">Přidat přílohu</button>${contract.cloudId ? '<span class="badge good">Supabase Storage</span>' : '<span class="badge">lokálně / po odeslání smlouvy cloud</span>'}</div>
          </form>
        </div>
        <div class="inline-note">
          <strong>Cloud přílohy:</strong><br>U cloudové smlouvy se PDF/fotky ukládají do soukromého Supabase Storage bucketu. Otevírání jde přes dočasný odkaz, veřejné URL se nepoužívá. Lokální smlouvy dál používají IndexedDB.
        </div>
      </div>
      <div style="height:14px"></div>
      <div class="card-header"><div><h3>Přílohy</h3><p>${files.filter((file) => file.cloudId).length} cloud · ${files.filter((file) => !file.cloudId).length} lokálně</p></div>${contract.cloudId && state.cloud?.householdId ? '<button class="ghost-btn" type="button" data-action="cloud-load-contract-files">Načíst cloud přílohy</button>' : ''}</div>
      ${files.length ? `<div class="file-list">${files.map((file) => `
        <div class="file-row">
          <div>
            <strong>${escapeHtml(file.fileName)}</strong>
            <em>${escapeHtml(file.fileType || 'soubor')} · ${formatBytes(file.size)} · ${formatDate(file.createdAt?.slice(0, 10))}${file.cloudId ? ' · cloud' : ' · lokálně'}</em>
          </div>
          <div class="item-actions">
            <button class="ghost-btn" type="button" data-action="open-contract-file" data-id="${file.id}">Otevřít</button>
            <button class="ghost-btn" type="button" data-action="download-contract-file" data-id="${file.id}">Stáhnout</button>
            <button class="danger-btn" type="button" data-action="delete-contract-file" data-id="${file.id}">Smazat</button>
          </div>
        </div>
      `).join('')}</div>` : renderEmpty('Zatím nejsou přidané žádné přílohy.')}
    `;
  }

  function contractFileCount(contractId) {
    return state.contractFiles.filter((file) => file.contractId === contractId).length;
  }

  function renderCameras() {
    const cameras = state.cameras;
    return `
      <div class="grid two">
        <section class="card">
          <div class="card-header"><div><h2>Přidat kameru</h2><p>Teď jen karta/snapshot. Streamy později lokálně přes HA/Frigate/go2rtc/VPN, ne veřejně přes cloud.</p></div></div>
          <form data-form="add-camera">
            <div class="form-grid two">
              ${field('Název', 'name', 'text', 'Vchod / garáž / zahrada', true)}
              ${field('Umístění', 'location', 'text', 'venku / chodba')}
              ${field('Snapshot URL', 'snapshotUrl', 'url', 'volitelné')}
              ${selectField('Stav', 'status', [['online', 'Online'], ['offline', 'Offline'], ['unknown', 'Nevím']])}
              ${field('Poznámka', 'note', 'text', 'volitelné')}
            </div>
            <div class="form-actions"><button class="primary-btn" type="submit">Přidat kameru</button></div>
          </form>
          <div class="inline-note" style="margin-top:12px;">Pozor na HTTPS/mixed-content: když poběží aplikace přes HTTPS a kamera jen přes HTTP, prohlížeč může náhled blokovat.</div>
        </section>
        <section class="card">
          <div class="card-header"><div><h2>Přehled kamer</h2><p>${cameras.length} položek</p></div></div>
          ${cameras.length ? `<div class="grid two">${cameras.map(renderCameraCard).join('')}</div>` : renderEmpty('Zatím není přidaná žádná kamera.')}
        </section>
      </div>
    `;
  }

  function renderCameraCard(camera) {
    return `
      <div class="item">
        <div class="camera-preview">
          ${camera.snapshotUrl ? `<img src="${escapeHtml(camera.snapshotUrl)}" alt="Náhled kamery ${escapeHtml(camera.name)}" loading="lazy" onerror="this.replaceWith(document.createTextNode('Náhled nejde načíst'))">` : `<div>📹<br>${escapeHtml(camera.name)}</div>`}
        </div>
        <div class="item-top" style="margin-top:10px;"><div class="item-title">${escapeHtml(camera.name)}</div><span class="badge ${camera.status === 'online' ? 'good' : camera.status === 'offline' ? 'bad' : ''}">${escapeHtml(camera.status || 'unknown')}</span></div>
        <div class="item-meta">${escapeHtml(camera.location || 'bez umístění')}${camera.note ? ` · ${escapeHtml(camera.note)}` : ''}</div>
        <div class="item-actions"><button class="danger-btn" type="button" data-action="delete" data-collection="cameras" data-id="${camera.id}">Smazat</button></div>
      </div>
    `;
  }


  function renderFinance() {
    const items = [...(state.finance || [])].sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')) || String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
    const accounts = financeAccountsSorted();
    const selectedMonth = financeSelectedMonth();
    const visibleItems = items.filter((item) => String(item.date || '').slice(0, 7) === selectedMonth);
    const summary = financeMonthSummary(selectedMonth);
    const balances = financeAccountBalances();
    const totalBalance = accounts.reduce((sum, account) => account.includeInTotal === false ? sum : sum + (balances[account.id] || 0), 0);
    const localOnly = items.filter((item) => !item.cloudId).length;
    const localAccounts = accounts.filter((account) => !account.cloudId).length;
    const categoryRows = financeCategoryBreakdown(selectedMonth);
    const accountRows = financeAccountMonthSummary(selectedMonth);
    const managedRows = financeManagedGroups(balances);
    return `
      <div class="grid two">
        <section class="card desktop-span-2">
          <div class="card-header">
            <div><h2>Finance</h2><p>Obecný přehled příjmů, výdajů, zůstatků, peněženek, spoření i peněz spravovaných pro někoho dalšího.</p></div>
            <span class="badge ${items.some((item) => item.cloudId) || accounts.some((item) => item.cloudId) ? 'good' : ''}">${items.some((item) => item.cloudId) || accounts.some((item) => item.cloudId) ? 'cloud' : 'lokálně'}</span>
          </div>
          <div class="kpi-grid">
            <div class="kpi"><strong>${formatCurrency(summary.income)}</strong><span>Příjmy za ${escapeHtml(financeMonthLabel(selectedMonth))}</span></div>
            <div class="kpi"><strong>${formatCurrency(summary.expense)}</strong><span>Výdaje za ${escapeHtml(financeMonthLabel(selectedMonth))}</span></div>
            <div class="kpi"><strong>${formatCurrency(summary.balance)}</strong><span>Rozdíl měsíce</span></div>
            <div class="kpi"><strong>${formatCurrency(totalBalance)}</strong><span>Zůstatek účtů</span></div>
          </div>
          <div class="inline-note" style="margin-top:12px;">Tip: pro tvůj případ můžeš založit účty třeba „Tchyně – u mě“, „Tchyně – spoření“ a zapisovat výplatu, stržené energie/nájem, výběry i převod bokem. Jiná domácnost si z toho může udělat hotovost, banku, obálky nebo kapesné.</div>
          <form data-form="finance-month-filter" style="margin-top:14px;">
            <div class="form-grid two">
              ${field('Měsíc přehledu', 'month', 'month', '', false, selectedMonth)}
              <div class="field"><label>Rychlý posun</label><div class="item-actions"><button class="ghost-btn" type="button" data-action="finance-month-prev">Předchozí</button><button class="ghost-btn" type="button" data-action="finance-month-current">Aktuální</button><button class="ghost-btn" type="button" data-action="finance-month-next">Další</button></div></div>
            </div>
            <div class="form-actions"><button class="ghost-btn" type="submit">Zobrazit měsíc</button></div>
          </form>
          <div class="quick-add-panel" style="margin-top:14px;">
            <div class="quick-add-head"><strong>Rychlé šablony</strong><span>Vyplní formulář, částku jen doplníš.</span></div>
            <div class="quick-chip-row">
              <button class="quick-chip" type="button" data-action="finance-template" data-template="salary">💼 <span>Výplata</span></button>
              <button class="quick-chip" type="button" data-action="finance-template" data-template="rent">🏠 <span>Nájem</span></button>
              <button class="quick-chip" type="button" data-action="finance-template" data-template="energy">⚡ <span>Energie</span></button>
              <button class="quick-chip" type="button" data-action="finance-template" data-template="cash">💵 <span>Výběr</span></button>
              <button class="quick-chip" type="button" data-action="finance-template" data-template="savings">🏦 <span>Na spoření</span></button>
            </div>
          </div>
        </section>

        <section class="card">
          <div class="card-header"><div><h2>Rychlé nastavení spravovaných peněz</h2><p>Obecná šablona pro osobu, obálku nebo peníze, které držíš bokem. Hodí se i pro tchyni, kapesné, rezervu nebo společné cíle.</p></div></div>
          <form data-form="add-managed-finance-set">
            <div class="form-grid two">
              ${field('Název osoby / obálky', 'ownerName', 'text', 'např. Tchyně / Dovolená / Kapesné', true)}
              ${field('Hlavní účet', 'mainAccountName', 'text', 'např. Tchyně – u mě')}
              ${field('Účet bokem / spoření', 'reserveAccountName', 'text', 'např. Tchyně – spoření')}
              ${field('Počáteční zůstatek hlavní', 'mainOpeningBalance', 'number', '0')}
              ${field('Počáteční zůstatek bokem', 'reserveOpeningBalance', 'number', '0')}
              ${selectField('Započítat do celku', 'includeInTotal', [['yes', 'Ano'], ['no', 'Ne']], 'yes')}
            </div>
            <div class="form-actions"><button class="primary-btn" type="submit">Založit dvojici účtů</button></div>
          </form>
        </section>

        <section class="card">
          <div class="card-header"><div><h2>Spravované zůstatky</h2><p>Součet účtů seskupený podle osoby/obálky. Přesně pro situace, kdy někomu držíš peníze na svém účtu a část dáváš bokem.</p></div></div>
          ${managedRows.length ? `<div class="list">${managedRows.map((row) => `<div class="item"><div class="item-top"><div class="item-title">${escapeHtml(row.label)}</div><span class="badge good">${formatCurrency(row.total)}</span></div><div class="item-meta">${row.accounts.map((account) => `${financeAccountIcon(account.accountType)} ${escapeHtml(account.name)}: ${formatCurrency(balances[account.id] || 0)}`).join(' · ')}</div></div>`).join('')}</div>` : renderEmpty('Zatím tu nejsou spravované účty. Přidej účet s vlastníkem, nebo použij rychlé nastavení vlevo.')}
        </section>

        <section class="card">
          <div class="card-header"><div><h2>Účty / peněženky</h2><p>Každý účet má vlastní zůstatek. Může to být banka, hotovost, spoření, obálka nebo osoba.</p></div><span class="badge">${accounts.length}</span></div>
          <form data-form="add-finance-account">
            <div class="form-grid two">
              ${field('Název účtu', 'name', 'text', 'např. Tchyně – u mě', true)}
              ${selectField('Typ účtu', 'accountType', financeAccountTypeOptions(), 'person')}
              ${field('Počáteční zůstatek', 'openingBalance', 'number', 'např. 0')}
              ${field('Vlastník / poznámka', 'ownerLabel', 'text', 'např. tchyně')}
              ${selectField('Započítat do celku', 'includeInTotal', [['yes', 'Ano'], ['no', 'Ne']], 'yes')}
              ${field('Poznámka', 'note', 'text', 'volitelné')}
            </div>
            <div class="form-actions">
              <button class="primary-btn" type="submit">Přidat účet</button>
              ${state.cloud?.householdId ? '<button class="ghost-btn" type="button" data-action="cloud-load-finance">Načíst cloud finance</button>' : ''}
              ${state.cloud?.householdId && localAccounts ? `<button class="ghost-btn" type="button" data-action="cloud-sync-local-finance-accounts">Odeslat účty (${localAccounts})</button>` : ''}
            </div>
          </form>
          ${accounts.length ? `<div class="list" style="margin-top:14px;">${accounts.map((account) => renderFinanceAccount(account, balances)).join('')}</div>` : renderEmpty('Zatím tu není žádný účet. Přidej aspoň jeden, třeba „Moje banka“, „Hotovost“ nebo „Tchyně – u mě“.')}
        </section>

        <section class="card">
          <div class="card-header"><div><h2>Přidat pohyb</h2><p>Příjem, výdaj nebo přesun mezi účty. Přesun je vhodný pro peníze bokem na spoření.</p></div></div>
          <form data-form="add-finance">
            <div class="form-grid two">
              ${selectField('Typ', 'type', [['expense', 'Výdaj'], ['income', 'Příjem'], ['transfer', 'Přesun mezi účty']], 'expense')}
              ${selectField('Účet', 'accountId', financeAccountOptions(true), accounts[0]?.id || '')}
              ${selectField('Cílový účet u přesunu', 'transferAccountId', financeAccountOptions(false), '')}
              ${field('Název', 'title', 'text', 'např. výplata / energie / výběr', true)}
              ${field('Částka', 'amount', 'number', 'např. 1250', true)}
              ${field('Datum', 'date', 'date', '', false, todayISO())}
              ${selectField('Kategorie', 'category', financeCategoryOptions(), 'groceries')}
              ${selectField('Platba', 'paymentMethod', [['card', 'Kartou'], ['cash', 'Hotově'], ['bank_transfer', 'Převod'], ['direct_debit', 'Inkaso'], ['other', 'Jiné']], 'bank_transfer')}
              ${field('Poznámka', 'note', 'text', 'volitelné')}
            </div>
            <div class="form-actions">
              <button class="primary-btn" type="submit">Přidat pohyb</button>
              ${state.cloud?.householdId && localOnly ? `<button class="ghost-btn" type="button" data-action="cloud-sync-local-finance">Odeslat pohyby (${localOnly})</button>` : ''}
            </div>
          </form>
        </section>

        <section class="card">
          <div class="card-header"><div><h2>Souhrn podle kategorií</h2><p>${escapeHtml(financeMonthLabel(selectedMonth))}</p></div></div>
          ${categoryRows.length ? `<div class="list">${categoryRows.map((row) => `<div class="item"><div class="item-top"><div class="item-title">${escapeHtml(row.label)}</div><span class="badge ${row.type === 'income' ? 'good' : ''}">${formatCurrency(row.amount)}</span></div><div class="item-meta">${row.type === 'income' ? 'příjmy' : 'výdaje'} · ${row.count}×</div></div>`).join('')}</div>` : renderEmpty('V tomhle měsíci zatím nejsou žádné kategorie.')}
        </section>

        <section class="card">
          <div class="card-header"><div><h2>Souhrn podle účtů</h2><p>${escapeHtml(financeMonthLabel(selectedMonth))}</p></div></div>
          ${accountRows.length ? `<div class="list">${accountRows.map((row) => `<div class="item"><div class="item-top"><div class="item-title">${escapeHtml(row.label)}</div><span class="badge">${formatCurrency(row.net)}</span></div><div class="item-meta">Příjmy ${formatCurrency(row.income)} · výdaje ${formatCurrency(row.expense)} · přesuny ${formatCurrency(row.transferIn - row.transferOut)}</div></div>`).join('')}</div>` : renderEmpty('V tomhle měsíci zatím nejsou žádné pohyby na účtech.')}
        </section>

        <section class="card desktop-span-2">
          <div class="card-header"><div><h2>Pohyby za měsíc</h2><p>${visibleItems.length} položek · ${escapeHtml(financeMonthLabel(selectedMonth))}</p></div></div>
          ${visibleItems.length ? `<div class="list">${visibleItems.map(renderFinanceItem).join('')}</div>` : renderEmpty('V tomhle měsíci zatím není žádný příjem, výdaj ani přesun.')}
        </section>
      </div>
    `;
  }

  function renderFinanceAccount(account, balances = financeAccountBalances()) {
    return `
      <div class="item">
        <div class="item-top">
          <div class="item-title">${financeAccountIcon(account.accountType)} ${escapeHtml(account.name)}</div>
          <span class="badge good">${formatCurrency(balances[account.id] || 0)}</span>
        </div>
        <div class="item-meta">${escapeHtml(financeAccountTypeLabel(account.accountType))}${account.ownerLabel ? ` · ${escapeHtml(account.ownerLabel)}` : ''}${account.includeInTotal === false ? ' · mimo celkový součet' : ''}${account.note ? ` · ${escapeHtml(account.note)}` : ''}${account.cloudId ? ' · cloud' : ' · lokálně'}</div>
        <div class="item-actions">
          ${state.cloud?.householdId && !account.cloudId ? `<button class="ghost-btn" type="button" data-action="cloud-sync-finance-account" data-id="${account.id}">Odeslat</button>` : ''}
          <button class="danger-btn" type="button" data-action="delete-finance-account" data-id="${account.id}">Smazat</button>
        </div>
      </div>
    `;
  }

  function renderFinanceItem(item) {
    const isIncome = item.type === 'income';
    const isTransfer = item.type === 'transfer';
    const account = financeAccountById(item.accountId);
    const target = financeAccountById(item.transferAccountId);
    return `
      <div class="item">
        <div class="item-top">
          <div class="item-title">${isTransfer ? '↔️' : isIncome ? '➕' : '➖'} ${escapeHtml(item.title)}</div>
          <span class="badge ${isIncome || isTransfer ? 'good' : 'warn'}">${formatCurrency(item.amount)}</span>
        </div>
        <div class="item-meta">${formatDate(item.date)} · ${isTransfer ? 'Přesun' : escapeHtml(financeCategoryLabel(item.category))}${account ? ` · ${escapeHtml(account.name)}` : ''}${target ? ` → ${escapeHtml(target.name)}` : ''} · ${escapeHtml(financePaymentLabel(item.paymentMethod))}${item.note ? ` · ${escapeHtml(item.note)}` : ''}${item.cloudId ? ' · cloud' : ' · lokálně'}</div>
        <div class="item-actions">
          ${state.cloud?.householdId && !item.cloudId ? `<button class="ghost-btn" type="button" data-action="cloud-sync-finance" data-id="${item.id}">Odeslat</button>` : ''}
          <button class="danger-btn" type="button" data-action="delete-finance" data-id="${item.id}">Smazat</button>
        </div>
      </div>
    `;
  }

  function renderMore() {
    const visibleModules = getVisibleModules().filter((module) => !['home', 'settings'].includes(module.id));
    const primaryIds = new Set(normalizeBottomNavIds(state.settings?.bottomNavIds, state.enabledModules));
    const secondaryModules = visibleModules.filter((module) => !primaryIds.has(module.id));
    const primaryModules = visibleModules.filter((module) => primaryIds.has(module.id));

    return `
      <div class="grid two">
        <section class="card desktop-span-2">
          <div class="card-header">
            <div><h2>Další moduly</h2><p>Spodní lišta drží jen věci, které si zvolíš v Nastavení. Všechno ostatní je tady.</p></div>
            <span class="badge">Více je napevno</span>
          </div>
          <div class="grid four">
            ${secondaryModules.length ? secondaryModules.map(renderModuleStatusCard).join('') : '<div class="empty">Všechny zapnuté moduly už máš připnuté dole.</div>'}
          </div>
        </section>

        <section class="card">
          <div class="card-header"><div><h2>Rychlý přístup</h2><p>Moduly, které máš aktuálně připnuté ve spodní liště.</p></div></div>
          <div class="list">
            ${primaryModules.map(renderModuleStatusCard).join('')}
          </div>
        </section>

        <section class="card">
          <div class="card-header"><div><h2>Nastavení</h2><p>Domácnost, profily, moduly, instalace a účet.</p></div></div>
          <button class="item module-hub-item" type="button" data-nav="settings">
            <div class="item-top"><div class="item-title">⚙️ Nastavení aplikace</div><span class="badge">otevřít</span></div>
            <div class="item-meta">Tady si každý upraví domácnost, profily a moduly podle sebe.</div>
          </button>
        </section>
      </div>
    `;
  }

  function renderSettings() {
    const enabled = new Set(normalizeModuleList(state.enabledModules));
    return `
      <div class="grid two">
        <section class="card">
          <div class="card-header"><div><h2>Domácnost</h2><p>Základní nastavení domácnosti.</p></div><span class="badge">${escapeHtml(state.household.id)}</span></div>
          <form data-form="household-settings">
            <div class="form-grid">
              ${field('Název domácnosti', 'householdName', 'text', 'Domácnost', true, householdName())}
              ${selectField('Vzhled', 'theme', [['light', 'Světlý'], ['dark', 'Tmavý']], state.settings.theme)}
              <div class="field"><label for="dashboardNote">Poznámka na dashboard</label><textarea id="dashboardNote" class="textarea" name="dashboardNote">${escapeHtml(state.settings.dashboardNote || '')}</textarea></div>
            </div>
            <div class="form-actions"><button class="primary-btn" type="submit">Uložit domácnost</button></div>
          </form>
        </section>

        <section class="card">
          <div class="card-header"><div><h2>Profily</h2><p>Členové domácnosti, kteří se zobrazují u událostí, úkolů a záznamů.</p></div><span class="badge">${state.profiles.length} profilů</span></div>
          <div class="profile-list">
            ${state.profiles.map((profile) => `
              <div class="profile-chip ${profile.id === currentProfileId() ? 'active' : ''}">
                <button type="button" data-action="set-profile" data-id="${escapeHtml(profile.id)}">
                  <strong>${escapeHtml(profile.name)}</strong>
                  <span>${escapeHtml(profile.role === 'owner' ? 'správce' : 'člen domácnosti')}</span>
                </button>
                ${state.profiles.length > 1 ? `<button class="mini-danger" type="button" data-action="delete-profile" data-id="${escapeHtml(profile.id)}" aria-label="Smazat profil">×</button>` : ''}
              </div>
            `).join('')}
          </div>
          <form data-form="add-profile" style="margin-top:14px;">
            <div class="form-grid two">
              ${field('Nový profil', 'name', 'text', 'Jméno člena domácnosti', true)}
              ${selectField('Role', 'role', [['member', 'Člen'], ['owner', 'Správce']], 'member')}
            </div>
            <div class="form-actions"><button class="ghost-btn" type="submit">Přidat profil</button></div>
          </form>
        </section>

        <section class="card desktop-span-2">
          <div class="card-header"><div><h2>Zapnuté moduly</h2><p>Vyber, co chce tahle domácnost používat.</p></div></div>
          <div class="module-toggle-grid">
            ${MODULES.filter((module) => !['home', 'settings'].includes(module.id)).map((module) => `
              <button class="module-toggle ${enabled.has(module.id) ? 'active' : ''}" type="button" data-action="toggle-module" data-id="${module.id}">
                <span>${module.icon}</span>
                <strong>${escapeHtml(module.label)}</strong>
                <em>${enabled.has(module.id) ? 'zapnuto' : 'vypnuto'}</em>
              </button>
            `).join('')}
          </div>
        </section>

        <section class="card desktop-span-2">
          ${renderBottomNavSettings()}
        </section>

        ${renderCloudAccount()}

        ${renderPwaInstallCard()}

        <section class="card">
          <div class="card-header"><div><h2>Data</h2><p>Export/import pro přenos mezi prohlížeči, než bude Supabase. Přílohy smluv jsou zatím uložené zvlášť v IndexedDB.</p></div></div>
          <div class="form-actions">
            <button class="ghost-btn" type="button" data-action="export-data">Exportovat JSON</button>
            <button class="danger-btn" type="button" data-action="reset-data">Reset dat</button>
          </div>
          <form data-form="import-data" style="margin-top:14px;">
            <div class="field"><label for="importJson">Import JSON</label><textarea id="importJson" class="textarea" name="json" placeholder="Sem vlož exportovaný JSON"></textarea></div>
            <div class="form-actions"><button class="primary-btn" type="submit">Importovat</button></div>
          </form>
        </section>

        ${renderDeleteAccountCard()}
      </div>
    `;
  }


  function renderDeleteAccountCard() {
    const signedIn = Boolean(state.cloud?.userId);
    return `
      <section class="card desktop-span-2 danger-zone">
        <div class="card-header">
          <div><h2>Smazat účet</h2><p>Trvalé smazání přihlášeného online účtu a jeho navázaných dat.</p></div>
          <span class="badge warn">nevratné</span>
        </div>
        ${signedIn ? `
          <div class="hint-box danger-hint">Smazání účtu je nevratné. Pokud jsi vlastník domácnosti, smažou se i data domácnosti navázaná na tento účet. Pro potvrzení napiš <strong>SMAZAT</strong>.</div>
          <form data-form="delete-own-account" class="stack-form">
            ${field('Potvrzení', 'confirmText', 'text', 'SMAZAT', true)}
            <div class="form-actions"><button class="danger-btn" type="submit">Smazat můj účet</button></div>
          </form>
        ` : `
          <div class="inline-note">Smazání účtu je dostupné až po přihlášení e-mailem a heslem.</div>
        `}
      </section>
    `;
  }

  function renderBottomNavSettings() {
    const selected = new Set(normalizeBottomNavIds(state.settings?.bottomNavIds, state.enabledModules));
    const candidates = getNavCandidateIds(state.enabledModules)
      .map((id) => MODULES.find((module) => module.id === id))
      .filter(Boolean);

    return `
      <div class="card-header">
        <div><h2>Spodní lišta</h2><p>Každá domácnost si může připnout vlastní hlavní položky. „Více“ zůstává dole vždycky.</p></div>
        <span class="badge">${selected.size}/${BOTTOM_NAV_MAX} + Více</span>
      </div>
      <div class="hint-box">Vyber ${BOTTOM_NAV_MIN} až ${BOTTOM_NAV_MAX} položek. Vypnuté moduly se tady nezobrazí — nejdřív je zapni v části „Zapnuté moduly“.</div>
      <div class="switch-list nav-picker-list">
        ${candidates.map((module) => {
          const isSelected = selected.has(module.id);
          return `
            <button class="switch-row nav-picker-switch ${isSelected ? 'active' : ''}" type="button" role="switch" aria-checked="${isSelected ? 'true' : 'false'}" data-action="toggle-bottom-nav" data-id="${module.id}">
              <span class="switch-row-icon">${module.icon}</span>
              <span class="switch-row-copy">
                <strong>${escapeHtml(module.label)}</strong>
                <em>${isSelected ? 'zobrazuje se dole' : 'nezobrazuje se dole'}</em>
              </span>
              <span class="ios-switch" aria-hidden="true"><span></span></span>
            </button>
          `;
        }).join('')}
      </div>
    `;
  }


  function cloudModeLabel() {
    if (state.cloud?.userId) return `cloud: ${state.cloud.email || 'přihlášeno'}`;
    return 'cloud-ready / lokální režim';
  }

  function getSupabaseClient() {
    if (supabaseClientInstance) return supabaseClientInstance;
    const factory = window.supabase?.createClient;
    if (!factory) return null;
    supabaseClientInstance = factory(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        storageKey: SUPABASE_STORAGE_KEY,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
    return supabaseClientInstance;
  }


  function isExistingAccountSignUpResponse(data, error) {
    const message = String(error?.message || error?.code || '').toLowerCase();
    if (message.includes('already') || message.includes('registered') || message.includes('exist') || message.includes('user_already_exists')) return true;
    const identities = data?.user?.identities;
    return Array.isArray(identities) && identities.length === 0 && !data?.session;
  }

  function markExistingAccount(email) {
    state.cloud = {
      ...(state.cloud || {}),
      supabaseUrl: SUPABASE_URL,
      provider: 'supabase',
      status: 'existing-account',
      email: normalizeText(email).toLowerCase()
    };
    onboardingMode = 'account';
    sessionStorage.setItem('domacnostPlus.onboardingMode', 'account');
    saveState();
    render();
    showToast('Účet s tímto e-mailem už existuje. Přihlas se nebo obnov heslo.');
  }

  async function deleteOwnAccount(confirmText) {
    const cleanConfirm = String(confirmText || '').trim();
    if (cleanConfirm !== 'SMAZAT') {
      showToast('Pro smazání účtu napiš přesně SMAZAT');
      return;
    }
    const ok = window.confirm('Opravdu trvale smazat přihlášený účet? Tohle nejde vrátit zpět.');
    if (!ok) return;
    const client = getSupabaseClient();
    if (!client || !state.cloud?.userId) {
      showToast('Nejdřív se přihlas k online účtu');
      return;
    }
    const { error } = await client.rpc('delete_own_account', { confirm_text: cleanConfirm });
    if (error) {
      showToast(error.message || 'Účet se nepovedlo smazat');
      return;
    }
    await client.auth.signOut().catch(() => {});
    localStorage.removeItem(STORAGE_KEY);
    state = migrateState(mergeState(DEFAULT_STATE, {}));
    state.household.isConfigured = false;
    state.cloud = { ...(state.cloud || {}), status: 'offline', userId: '', email: '', householdId: '' };
    sessionStorage.removeItem(DEMO_SESSION_KEY);
    sessionStorage.setItem('domacnostPlus.onboardingMode', 'choice');
    onboardingMode = 'choice';
    activeModule = 'home';
    render();
    showToast('Účet byl smazán');
  }


  async function cloudLogout() {
    const client = getSupabaseClient();
    if (client) await client.auth.signOut();
    state.cloud = { ...(state.cloud || {}), status: 'offline', userId: '', email: '' };
    saveState();
    render();
    showToast('Odhlášeno');
  }

  async function bootstrapCloudHousehold(showMessage = true) {
    const client = getSupabaseClient();
    if (!client) { if (showMessage) showToast('Supabase knihovna není načtená'); return null; }
    const user = await refreshCloudSession(false);
    if (!user) { if (showMessage) showToast('Nejdřív se přihlas'); return null; }

    const existingHouseholdId = state.cloud?.householdId;
    let cloudHouseholdId = existingHouseholdId || '';

    if (!cloudHouseholdId) {
      const { data: household, error: householdError } = await client
        .from('households')
        .insert({
          name: householdName(),
          timezone: 'Europe/Prague',
          app_build: 44,
          schema_version: 43,
          created_by: user.id
        })
        .select('id')
        .single();
      if (householdError) { if (showMessage) showToast(householdError.message || 'Domácnost se nepovedla vytvořit'); return null; }
      cloudHouseholdId = household.id;

      const { error: memberError } = await client.from('household_members').insert({
        household_id: cloudHouseholdId,
        user_id: user.id,
        role: 'owner',
        status: 'active',
        display_name: currentProfile()?.name || user.email || 'Owner',
        joined_at: new Date().toISOString()
      });
      if (memberError) { if (showMessage) showToast(memberError.message || 'Člen domácnosti se nepovedl vytvořit'); return null; }
    }

    const profilesPayload = state.profiles.map((profile, index) => ({
      household_id: cloudHouseholdId,
      user_id: index === 0 ? user.id : null,
      name: profile.name,
      avatar_emoji: profile.avatarEmoji || '🙂',
      is_default: profile.id === state.activeProfileId,
      is_archived: false,
      created_by: user.id
    }));

    if (profilesPayload.length) {
      const { error: profileError } = await client.from('profiles').insert(profilesPayload);
      if (profileError && !String(profileError.message || '').includes('duplicate')) {
        if (showMessage) showToast(profileError.message || 'Profily se nepovedly uložit');
        return null;
      }
    }

    state.cloud = {
      ...(state.cloud || {}),
      supabaseUrl: SUPABASE_URL,
      provider: 'supabase',
      status: 'bootstrapped',
      userId: user.id,
      email: user.email || '',
      householdId: cloudHouseholdId,
      lastSyncAt: new Date().toISOString()
    };
    saveState();
    render();
    if (showMessage) showToast('Domácnost je v cloudu');
    return cloudHouseholdId;
  }

  function setActiveProfile(id) {
    if (!state.profiles.some((profile) => profile.id === id)) return;
    state.activeProfileId = id;
    saveState();
    render();
  }

  function deleteProfile(id) {
    if (state.profiles.length <= 1) {
      showToast('Poslední profil nejde smazat');
      return;
    }
    const profile = state.profiles.find((item) => item.id === id);
    if (!profile) return;
    const ok = window.confirm(`Smazat profil ${profile.name}? Data z modulů zůstanou uložená, jen už nebudou patřit aktivnímu profilu.`);
    if (!ok) return;
    state.profiles = state.profiles.filter((item) => item.id !== id);
    if (state.activeProfileId === id) state.activeProfileId = state.profiles[0]?.id || '';
    saveState();
    render();
    showToast('Profil smazán');
  }

  function toggleModule(moduleId) {
    if (!MANAGED_MODULE_IDS.includes(moduleId)) return;
    const enabled = new Set(normalizeModuleList(state.enabledModules));
    if (enabled.has(moduleId)) enabled.delete(moduleId);
    else enabled.add(moduleId);
    state.enabledModules = [...enabled];
    state.settings.bottomNavIds = normalizeBottomNavIds(state.settings?.bottomNavIds, state.enabledModules);
    if (!isModuleEnabled(activeModule)) activeModule = 'home';
    saveState();
    render();
  }

  function toggleBottomNav(moduleId) {
    const candidates = getNavCandidateIds(state.enabledModules);
    if (!candidates.includes(moduleId)) return;

    const selected = new Set(normalizeBottomNavIds(state.settings?.bottomNavIds, state.enabledModules));
    if (selected.has(moduleId)) {
      if (selected.size <= Math.min(BOTTOM_NAV_MIN, candidates.length)) {
        showToast(`Nech aspoň ${BOTTOM_NAV_MIN} položky + Více`);
        return;
      }
      selected.delete(moduleId);
    } else {
      if (selected.size >= BOTTOM_NAV_MAX) {
        showToast(`Maximum je ${BOTTOM_NAV_MAX} položek + Více`);
        return;
      }
      selected.add(moduleId);
    }

    state.settings.bottomNavIds = normalizeBottomNavIds([...selected], state.enabledModules);
    saveState();
    render();
  }

  async function deleteItem(collection, id) {
    if (!collection || !Array.isArray(state[collection])) return;
    if (collection === 'fuel' || collection === 'services') {
      const record = state[collection].find((item) => item.id === id);
      const ok = await cloudDeleteGarageRecord(collection, record);
      if (!ok) return;
    }
    if (collection === 'contracts') {
      const contract = state.contracts.find((item) => item.id === id);
      const ok = await cloudDeleteContract(contract);
      if (!ok) return;
      const files = state.contractFiles.filter((file) => file.contractId === id);
      files.forEach((file) => deleteStoredContractFile(file.id).catch(() => {}));
      state.contractFiles = state.contractFiles.filter((file) => file.contractId !== id);
      if (activeContractId === id) activeContractId = state.contracts.find((contract) => contract.id !== id)?.id || null;
    }
    state[collection] = state[collection].filter((item) => item.id !== id);
    touchState();
    saveState();
    render();
    showToast('Smazáno');
  }

  function toggleBoolean(collection, id, key) {
    const item = state[collection]?.find((entry) => entry.id === id);
    if (!item) return;
    item[key] = !item[key];
    saveState();
    render();
  }

  async function deleteVehicle(id) {
    const vehicle = state.vehicles.find((item) => item.id === id);
    const ok = await cloudDeleteVehicle(vehicle);
    if (!ok) return;
    state.vehicles = state.vehicles.filter((entry) => entry.id !== id);
    state.fuel = state.fuel.filter((item) => item.vehicleId !== id);
    state.services = state.services.filter((item) => item.vehicleId !== id);
    if (garageVehicleId === id) garageVehicleId = state.vehicles[0]?.id || null;
    saveState();
    render();
    showToast('Auto smazáno');
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Zkopírováno');
    } catch {
      const area = document.createElement('textarea');
      area.value = text;
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
      showToast('Zkopírováno');
    }
  }

  function exportData() {
    const payload = JSON.stringify({ version: APP_VERSION, exportedAt: new Date().toISOString(), state }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `domacnost-plus-v0-1-44-${todayISO()}.json`; 
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast('Export vytvořen');
  }

  function importData(json) {
    const parsed = safeParse(json, null);
    if (!parsed || !parsed.state) {
      showToast('Import se nepovedl');
      return;
    }
    state = migrateState(mergeState(DEFAULT_STATE, parsed.state));
    saveState();
    render();
    showToast('Import hotový');
  }

  function resetData() {
    const ok = window.confirm('Opravdu smazat všechna offline data Domácnost+ v tomto prohlížeči?');
    if (!ok) return;
    state = migrateState(structuredCloneSafe(DEFAULT_STATE));
    garageVehicleId = null;
    activeModule = 'home';
    localStorage.removeItem(STORAGE_KEY);
    saveState();
    render();
    sessionStorage.removeItem('domacnostPlus.onboardingMode');
    showToast('Data resetována');
  }

  function showToast(text) {
    const toast = document.getElementById('copy-toast');
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
  }

  app.addEventListener('click', (event) => {
    const nav = event.target.closest('[data-nav]');
    if (nav) {
      activeModule = nav.dataset.nav;
      render();
      keepActiveNavCentered('smooth');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const action = event.target.closest('[data-action]');
    if (action) {
      try {
        handleAction(action);
      } catch (error) {
        console.error('Action failed', action.dataset.action, error);
        showToast('Akce se nepovedla. Zkus obnovit aplikaci.');
      }
    }
  });

  app.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      handleForm(event.target);
    } catch (error) {
      console.error('Form failed', event.target?.dataset?.form, error);
      showToast('Formulář se nepovedlo uložit.');
    }
  });

  app.addEventListener('change', (event) => {
    const profileSwitch = event.target.closest('[data-profile-switch]');
    if (profileSwitch) setActiveProfile(profileSwitch.value);
  });

  setInterval(() => {
    now = new Date();
    if (activeModule === 'home' || activeModule === 'homecare') render();
    const clock = document.querySelector('.clock-card strong');
    const date = document.querySelector('.clock-card span');
    if (clock) clock.textContent = clockText(now);
    if (date) date.textContent = shortDateText(now);
  }, 30000);

  setupInstallAndUpdateFlow();
  registerServiceWorker();

  render();
  refreshCloudSession(false).catch(() => {});
  handleInitialAuthReturn().catch((error) => console.warn('Auth return handling failed', error));
})();
