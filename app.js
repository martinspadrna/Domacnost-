(() => {
  'use strict';

  const APP_VERSION = 'Domácnost+ v.0.1_22';
  const STORAGE_KEY = 'domacnostPlus.v0.1_22';
  const PREVIOUS_STORAGE_KEY = 'domacnostPlus.v0.1_20';
  const LEGACY_STORAGE_KEYS = [PREVIOUS_STORAGE_KEY, 'domacnostPlus.v0.1_21', 'domacnostPlus.v0.1_19', 'domacnostPlus.v0.1_18', 'domacnostPlus.v0.1_17', 'domacnostPlus.v0.1_16', 'domacnostPlus.v0.1_14', 'domacnostPlus.v0.1_13', 'domacnostPlus.v0.1_12', 'domacnostPlus.cloud.v1.2.911', 'domacnostPlus.cloud.v1.1.910', 'homeWebOffline.v1.0.909', 'homeWebOffline.v0.9.908', 'homeWebOffline.v0.8.907', 'homeWebOffline.v0.7.906', 'homeWebOffline.v0.6.905', 'homeWebOffline.v0.5.904', 'homeWebOffline.v0.4.903', 'homeWebOffline.v0.3.902', 'homeWebOffline.v0.2.901', 'homeWebOffline.v0.1.900'];

  const MODULES = [
    { id: 'home', label: 'Domů', icon: '🏠' },
    { id: 'calendar', label: 'Kalendář', icon: '📅' },
    { id: 'packages', label: 'Balíky', icon: '📦' },
    { id: 'shopping', label: 'Nákupy', icon: '🛒' },
    { id: 'homecare', label: 'Domácnost', icon: '💡' },
    { id: 'garage', label: 'Garáž', icon: '🚗' },
    { id: 'contracts', label: 'Smlouvy', icon: '📄' },
    { id: 'cameras', label: 'Kamery', icon: '📹' },
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

  const MANAGED_MODULE_IDS = MODULES
    .filter((module) => !['home', 'settings'].includes(module.id))
    .map((module) => module.id);

  const DEFAULT_STATE = {
    meta: {
      schemaVersion: 21,
      appBuild: 22,
      mode: 'pwa-cloud-parcels',
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
    shoppingStats: {},
    pwa: { installed: false, lastUpdateCheck: '', lastInstallPrompt: '' },
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
    cloud: {
      supabaseUrl: SUPABASE_URL,
      provider: 'supabase',
      userId: '',
      email: '',
      householdId: '',
      lastSyncAt: '',
      status: 'offline'
    }
  };

  let state = loadState();
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
    const saved = safeParse(localStorage.getItem(STORAGE_KEY), null);
    if (saved) return migrateState(mergeState(DEFAULT_STATE, saved));

    for (const key of LEGACY_STORAGE_KEYS) {
      const legacy = safeParse(localStorage.getItem(key), null);
      if (legacy) {
        const migrated = migrateState(mergeState(DEFAULT_STATE, legacy), { fromLegacy: true });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        return migrated;
      }
    }

    return migrateState(mergeState(DEFAULT_STATE, {}));
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
      schemaVersion: 21,
      appBuild: 22,
      mode: 'pwa-cloud-parcels',
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
    return ['calendar', 'packages', 'coupons', 'hdoWindows', 'shopping', 'shoppingCatalogCustom', 'homeTasks', 'waste', 'notes', 'devices', 'vehicles', 'fuel', 'services', 'contracts', 'contractFiles', 'cameras'];
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

  function render() {
    document.documentElement.dataset.theme = state.settings.theme || 'light';

    if (!state.household?.isConfigured) {
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
            <div class="brand-mark">HW</div>
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
          ${renderModule(active.id)}
        </main>

        <p class="footer-note">${escapeHtml(APP_VERSION)} · cloud nákupy, smlouvy, garáž, HDO, odpad a balíky · lokální režim zůstává jako záloha</p>
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

    keepActiveNavCentered();
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
    app.innerHTML = `
      <div class="onboarding-screen">
        <section class="onboarding-card">
          <div class="onboarding-hero">
            <div class="brand-mark big">HW</div>
            <div>
              <span class="badge">${escapeHtml(APP_VERSION)}</span>
              <h1>Vítej v Home Webu</h1>
              <p>Nastav domácnost, profily a moduly. Tahle verze je pořád offline, ale datová struktura už počítá s tím, že později může běžet pro víc rodin přes Vercel + Supabase.</p>
            </div>
          </div>

          <form data-form="onboarding" class="onboarding-form">
            <div class="grid two">
              <section class="card flat">
                <div class="card-header"><div><h2>1. Domácnost</h2><p>Název rodinného účtu / domácnosti.</p></div></div>
                ${field('Název domácnosti', 'householdName', 'text', 'Špadrnovi / Doma / Byt', true)}
              </section>
              <section class="card flat">
                <div class="card-header"><div><h2>2. Profily</h2><p>Začni klidně dvěma profily. Další půjdou přidat v nastavení.</p></div></div>
                <div class="form-grid two">
                  ${field('První profil', 'profilePrimary', 'text', 'Martin', true)}
                  ${field('Druhý profil', 'profileSecondary', 'text', 'Manželka')}
                </div>
              </section>
            </div>

            <section class="card flat">
              <div class="card-header"><div><h2>3. Moduly</h2><p>Zapni jen to, co chceš používat. Později to můžeš změnit.</p></div></div>
              <div class="module-check-grid">
                ${MODULES.filter((module) => !['home', 'settings'].includes(module.id)).map((module) => moduleCheckbox(module, true)).join('')}
              </div>
            </section>

            <div class="form-actions onboarding-actions">
              <button class="primary-btn" type="submit">Vytvořit domácnost</button>
              <button class="ghost-btn" type="button" data-action="toggle-theme">Přepnout vzhled</button>
            </div>
          </form>
        </section>
      </div>
      <div id="copy-toast" class="copy-toast" role="status" aria-live="polite"></div>
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
      calendar: 'Jednoduchý lokální kalendář. Později tady bude napojení na Google Kalendář.',
      packages: 'Základ pro sledování balíků. Teď ručně, později automatika přes backend.',
      shopping: 'Sdílený nákupní seznam s katalogem položek, jednotkami a cloudovým oddělením domácností.',
      homecare: 'HDO, odpad, poznámky, úkoly a domácí zařízení na jednom místě.',
      garage: 'Auta v domácnosti, tankování, servis a základní přehled spotřeby.',
      contracts: 'Evidence smluv a pojistek s hlídáním platnosti.',
      cameras: 'Přehled kamer. Prozatím jen lokální karty a snapshot URL, žádné cloud streamy.',
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

        ${renderNextPlanCard()}
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
        title: firstPackage ? `${firstPackage.carrier || 'Balík'} · ${statusLabel(firstPackage.status)}` : 'Žádný aktivní balík',
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
      homecare: { count: countBy('homeTasks', (item) => !item.done) + countBy('hdoWindows') + countBy('waste'), label: 'položek', note: `${countBy('hdoWindows')} HDO oken, ${countBy('waste')} svozů.` },
      garage: { count: countBy('vehicles'), label: 'aut', note: `${countBy('fuel')} tankování, ${countBy('services')} servisů.` },
      contracts: { count: countBy('contracts'), label: 'smluv', note: `${countBy('contractFiles')} příloh lokálně v IndexedDB.` },
      cameras: { count: countBy('cameras'), label: 'kamer', note: 'Snapshot/stream zatím jen lokálně.' }
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
      { title: 'Domácnost+ v.0.1_21', note: 'Další: Domácí úkoly a obecné připomínky do cloudu.' }
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
    return `
      <div class="grid two">
        <section class="card">
          <div class="card-header"><div><h2>Přidat událost</h2><p>Zatím lokální kalendář. Google napojení přijde později přes backend.</p></div></div>
          <form data-form="add-event">
            <div class="form-grid two">
              ${field('Název', 'title', 'text', 'Doktor / návštěva / výlet', true)}
              ${field('Datum', 'date', 'date', '', true, todayISO())}
              ${field('Začátek', 'time', 'time', '')}
              ${field('Konec', 'endTime', 'time', '')}
              ${selectField('Typ', 'type', [['rodina', 'Rodina'], ['prace', 'Práce'], ['domacnost', 'Domácnost'], ['ostatni', 'Ostatní']])}
              ${field('Poznámka', 'note', 'text', 'volitelné')}
            </div>
            <div class="form-actions"><button class="primary-btn" type="submit">Uložit událost</button></div>
          </form>
        </section>
        <section class="card">
          <div class="card-header"><div><h2>Události</h2><p>${events.length} položek</p></div></div>
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
          <span class="badge">${escapeHtml(event.type || 'ostatní')}</span>
        </div>
        <div class="item-meta">${formatDate(event.date)} · ${escapeHtml(event.time || 'celý den')}${event.endTime ? `–${escapeHtml(event.endTime)}` : ''}${event.note ? ` · ${escapeHtml(event.note)}` : ''}</div>
        ${withDelete ? `<div class="item-actions"><button class="ghost-btn" type="button" data-action="delete" data-collection="calendar" data-id="${event.id}">Smazat</button></div>` : ''}
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
          <div class="card-header"><div><h2>Úkoly a poznámky</h2><p>Rychlé domácí připomínky.</p></div></div>
          <form data-form="add-task">
            <div class="form-grid two">
              ${field('Úkol', 'title', 'text', 'vyměnit filtr / koupit baterky', true)}
              ${field('Termín', 'due', 'date', '')}
              ${field('Poznámka', 'note', 'text', 'volitelné')}
            </div>
            <div class="form-actions"><button class="primary-btn" type="submit">Přidat úkol</button></div>
          </form>
          <div style="height:14px"></div>
          ${tasks.length ? `<div class="list">${tasks.map((task) => `
            <div class="item">
              <div class="item-top"><div class="item-title">${task.done ? '✓ ' : ''}${escapeHtml(task.title)}</div><span class="badge">${task.due ? formatDate(task.due) : 'bez termínu'}</span></div>
              <div class="item-meta">${task.note ? escapeHtml(task.note) : 'Bez poznámky'}</div>
              <div class="item-actions"><button class="ghost-btn" type="button" data-action="toggle-done" data-collection="homeTasks" data-id="${task.id}">${task.done ? 'Vrátit' : 'Hotovo'}</button><button class="danger-btn" type="button" data-action="delete" data-collection="homeTasks" data-id="${task.id}">Smazat</button></div>
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
          <div class="card-header"><div><h2>Nastavení</h2><p>Domácnost, profily, zapnuté moduly, export/import a reset.</p></div></div>
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
          <div class="card-header"><div><h2>Domácnost</h2><p>Tohle je základ budoucího rodinného účtu.</p></div><span class="badge">${escapeHtml(state.household.id)}</span></div>
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
          <div class="card-header"><div><h2>Profily</h2><p>Profily jsou uvnitř jedné domácnosti. Později se navážou na účty v Supabase.</p></div><span class="badge">${state.profiles.length} profilů</span></div>
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
          <div class="card-header"><div><h2>Zapnuté moduly</h2><p>Když app pošleš někomu dalšímu, vybere si vlastní moduly a začne s prázdnými daty.</p></div></div>
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

        ${renderCloudReadiness(false)}

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

        ${renderNextPlanCard()}
      </div>
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

  function renderCloudAccount() {
    const cloud = state.cloud || {};
    const signedIn = Boolean(cloud.userId);
    return `
      <section class="card desktop-span-2 cloud-card">
        <div class="card-header">
          <div><h2>Cloud účet</h2><p>Napojení na Supabase projekt Domácnost+. Základ domácnosti/profilů a Nákupy už umí cloud.</p></div>
          <span class="badge ${signedIn ? 'good' : ''}">${signedIn ? 'přihlášeno' : 'lokálně'}</span>
        </div>
        <div class="cloud-status-grid">
          <div class="mini-stat"><span>Supabase</span><strong>${escapeHtml(SUPABASE_URL.replace('https://', ''))}</strong></div>
          <div class="mini-stat"><span>Účet</span><strong>${escapeHtml(cloud.email || 'nepřihlášeno')}</strong></div>
          <div class="mini-stat"><span>Cloud domácnost</span><strong>${escapeHtml(cloud.householdId || 'zatím nevytvořena')}</strong></div>
          <div class="mini-stat"><span>Poslední zápis</span><strong>${cloud.lastSyncAt ? escapeHtml(formatDateTime(cloud.lastSyncAt)) : 'nikdy'}</strong></div>
        </div>
        ${signedIn ? `
          <div class="hint-box">Jsi přihlášený. Tlačítko níže vytvoří nebo napojí aktuální domácnost v Supabase: domácnost, owner člen a profily. Nákupy už se umí ukládat do cloudu.</div>
          <div class="form-actions">
            <button class="primary-btn" type="button" data-action="cloud-bootstrap">Vytvořit / napojit domácnost v cloudu</button>
            <button class="ghost-btn" type="button" data-action="cloud-refresh-session">Obnovit stav účtu</button>
            <button class="danger-btn" type="button" data-action="cloud-logout">Odhlásit</button>
          </div>
        ` : `
          <div class="grid two cloud-auth-grid">
            <form data-form="cloud-login">
              <h3>Přihlášení</h3>
              <div class="form-grid two">
                ${field('E-mail', 'email', 'email', 'email@domena.cz', true)}
                ${field('Heslo', 'password', 'password', 'min. 6 znaků', true)}
              </div>
              <div class="form-actions"><button class="primary-btn" type="submit">Přihlásit</button></div>
            </form>
            <form data-form="cloud-signup">
              <h3>Nový účet</h3>
              <div class="form-grid two">
                ${field('E-mail', 'email', 'email', 'email@domena.cz', true)}
                ${field('Heslo', 'password', 'password', 'min. 6 znaků', true)}
              </div>
              <div class="form-actions"><button class="ghost-btn" type="submit">Založit účet</button></div>
            </form>
          </div>
          <div class="inline-note">Pokud bude v Supabase zapnuté potvrzení e-mailu, po registraci bude potřeba účet potvrdit přes e-mail a pak se přihlásit.</div>
        `}
      </section>
    `;
  }


  function getPwaStatus() {
    const standalone = window.matchMedia?.('(display-mode: standalone)')?.matches || window.navigator.standalone === true;
    const secure = location.protocol === 'https:' || ['localhost', '127.0.0.1'].includes(location.hostname);
    const swSupported = 'serviceWorker' in navigator && location.protocol !== 'file:';
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent || '');
    const android = /android/i.test(navigator.userAgent || '');
    return {
      standalone,
      secure,
      swSupported,
      ios,
      android,
      canPrompt: Boolean(deferredInstallPrompt),
      updateAvailable: Boolean(pwaUpdateAvailable),
      fileMode: location.protocol === 'file:'
    };
  }

  function renderPwaInstallCard() {
    const pwa = getPwaStatus();
    const statusLabel = pwa.standalone ? 'nainstalováno' : pwa.fileMode ? 'lokální soubor' : pwa.canPrompt ? 'lze instalovat' : 'připraveno';
    return `
      <section class="card desktop-span-2 pwa-card">
        <div class="card-header">
          <div><h2>Instalace aplikace</h2><p>Domácnost+ je připravená jako instalovatelná PWA appka. Na mobilu se otevře jako samostatná aplikace bez klasické lišty prohlížeče.</p></div>
          <span class="badge ${pwa.standalone ? 'good' : pwa.updateAvailable ? 'warn' : ''}">${statusLabel}</span>
        </div>
        <div class="cloud-status-grid">
          <div class="mini-stat"><span>Režim</span><strong>${pwa.standalone ? 'samostatná app' : 'prohlížeč'}</strong></div>
          <div class="mini-stat"><span>Service worker</span><strong>${pwa.swSupported ? 'podporovaný' : 'není dostupný'}</strong></div>
          <div class="mini-stat"><span>Instalace</span><strong>${pwa.canPrompt ? 'tlačítkem' : pwa.ios ? 'přes Safari' : 'přes menu'}</strong></div>
          <div class="mini-stat"><span>Verze</span><strong>${escapeHtml(APP_VERSION)}</strong></div>
        </div>
        ${pwa.fileMode ? `<div class="hint-box warn-box">Teď je appka otevřená jako lokální soubor ze ZIPu. Instalace a automatické aktualizace fungují až přes HTTPS, tedy typicky přes Vercel.</div>` : ''}
        <div class="install-steps">
          <div class="install-step"><strong>iPhone / iPad</strong><span>Otevři ve Safari → Sdílet → Přidat na plochu.</span></div>
          <div class="install-step"><strong>Android / Chrome</strong><span>Menu prohlížeče → Instalovat aplikaci. Když prohlížeč nabídne tlačítko, objeví se níže.</span></div>
          <div class="install-step"><strong>Update</strong><span>Po novém deployi přes Vercel se zobrazí možnost aktualizovat. Tohle držíme podobně jako u RaK.</span></div>
        </div>
        <div class="form-actions">
          ${pwa.canPrompt ? `<button class="primary-btn" type="button" data-action="pwa-install">Instalovat aplikaci</button>` : ''}
          <button class="ghost-btn" type="button" data-action="pwa-check-update">Zkontrolovat update</button>
          ${pwa.updateAvailable ? `<button class="primary-btn" type="button" data-action="pwa-apply-update">Aktualizovat na novou verzi</button>` : ''}
        </div>
      </section>
    `;
  }

  function field(label, name, type = 'text', placeholder = '', required = false, value = '') {
    const inputId = `field-${name}-${Math.random().toString(36).slice(2, 7)}`;
    return `
      <div class="field">
        <label for="${inputId}">${escapeHtml(label)}</label>
        <input class="input" id="${inputId}" name="${name}" type="${type}" placeholder="${escapeHtml(placeholder)}" value="${escapeHtml(value)}" ${required ? 'required' : ''} ${type === 'number' ? 'step="any" inputmode="decimal"' : ''}>
      </div>
    `;
  }

  function selectField(label, name, options, selected = '') {
    const selectId = `field-${name}-${Math.random().toString(36).slice(2, 7)}`;
    return `
      <div class="field">
        <label for="${selectId}">${escapeHtml(label)}</label>
        <select class="select" id="${selectId}" name="${name}">
          ${options.map(([value, text]) => `<option value="${escapeHtml(value)}" ${String(value) === String(selected) ? 'selected' : ''}>${escapeHtml(text)}</option>`).join('')}
        </select>
      </div>
    `;
  }

  function renderEmpty(text) {
    return `<div class="empty">${escapeHtml(text)}</div>`;
  }

  function clockText(date) {
    return new Intl.DateTimeFormat('cs-CZ', { hour: '2-digit', minute: '2-digit' }).format(date);
  }

  function shortDateText(date) {
    return new Intl.DateTimeFormat('cs-CZ', { weekday: 'short', day: 'numeric', month: 'numeric' }).format(date);
  }

  function getHdoStatus(date) {
    const day = date.getDay();
    const minutesNow = date.getHours() * 60 + date.getMinutes();
    const enabled = state.hdoWindows.filter((item) => item.enabled && Array.isArray(item.days) && item.days.includes(day));
    const active = enabled.find((item) => isTimeInWindow(minutesNow, item.start, item.end));
    if (active) {
      return {
        active: true,
        label: active.label,
        message: `Právě běží ${active.label} (${active.start}–${active.end}).`
      };
    }
    const next = findNextHdoWindow(date);
    if (!next) return { active: false, label: 'není nastaveno', message: 'Není nastavené žádné aktivní HDO okno.' };
    return {
      active: false,
      label: next.item.label,
      message: `Další nízký tarif: ${next.item.label} za ${humanDuration(next.diffMinutes)} (${next.item.start}–${next.item.end}).`
    };
  }

  function isTimeInWindow(minutesNow, start, end) {
    const startMinutes = timeToMinutes(start);
    const endMinutes = timeToMinutes(end);
    if (startMinutes === null || endMinutes === null) return false;
    if (startMinutes === endMinutes) return true;
    if (startMinutes < endMinutes) return minutesNow >= startMinutes && minutesNow < endMinutes;
    return minutesNow >= startMinutes || minutesNow < endMinutes;
  }

  function timeToMinutes(value) {
    const match = String(value || '').match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return null;
    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (hours > 23 || minutes > 59) return null;
    return hours * 60 + minutes;
  }

  function findNextHdoWindow(date) {
    const windows = state.hdoWindows.filter((item) => item.enabled && Array.isArray(item.days));
    if (!windows.length) return null;
    const base = new Date(date);
    const candidates = [];
    windows.forEach((item) => {
      const startMinutes = timeToMinutes(item.start);
      if (startMinutes === null) return;
      for (let offset = 0; offset <= 7; offset += 1) {
        const candidate = new Date(base);
        candidate.setDate(base.getDate() + offset);
        const day = candidate.getDay();
        if (!item.days.includes(day)) continue;
        candidate.setHours(Math.floor(startMinutes / 60), startMinutes % 60, 0, 0);
        const diffMinutes = Math.round((candidate - base) / 60000);
        if (diffMinutes > 0) candidates.push({ item, diffMinutes });
      }
    });
    return candidates.sort((a, b) => a.diffMinutes - b.diffMinutes)[0] || null;
  }

  function humanDuration(minutes) {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    if (hours < 24) return rest ? `${hours} h ${rest} min` : `${hours} h`;
    const days = Math.floor(hours / 24);
    const leftHours = hours % 24;
    return leftHours ? `${days} d ${leftHours} h` : `${days} d`;
  }

  function daysLabel(days) {
    const normalized = [...(days || [])].sort((a, b) => a - b).join(',');
    if (normalized === '0,1,2,3,4,5,6') return 'každý den';
    if (normalized === '1,2,3,4,5') return 'po–pá';
    if (normalized === '0,6') return 'víkend';
    const names = ['ne', 'po', 'út', 'st', 'čt', 'pá', 'so'];
    return (days || []).map((day) => names[day] || '?').join(', ');
  }

  function frequencyLabel(value) {
    return ({ monthly: 'měsíčně', yearly: 'ročně', once: 'jednorázově', other: 'jiné' }[value] || 'jiné');
  }

  function openFilesDb() {
    return new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) {
        reject(new Error('IndexedDB není dostupné'));
        return;
      }
      const request = indexedDB.open(FILE_DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(FILE_STORE_CONTRACTS)) {
          db.createObjectStore(FILE_STORE_CONTRACTS, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('IndexedDB chyba'));
    });
  }

  async function withFileStore(mode, callback) {
    const db = await openFilesDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(FILE_STORE_CONTRACTS, mode);
      const store = tx.objectStore(FILE_STORE_CONTRACTS);
      let result;
      try {
        result = callback(store);
      } catch (error) {
        reject(error);
        return;
      }
      tx.oncomplete = () => {
        db.close();
        resolve(result);
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error || new Error('IndexedDB transakce selhala'));
      };
    });
  }

  async function putStoredContractFile(record) {
    await withFileStore('readwrite', (store) => store.put(record));
  }

  async function getStoredContractFile(id) {
    const db = await openFilesDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(FILE_STORE_CONTRACTS, 'readonly');
      const request = tx.objectStore(FILE_STORE_CONTRACTS).get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error || new Error('Soubor nejde načíst'));
      tx.oncomplete = () => db.close();
      tx.onerror = () => db.close();
    });
  }

  async function deleteStoredContractFile(id) {
    await withFileStore('readwrite', (store) => store.delete(id));
  }

  function sanitizeStorageFileName(name) {
    const fallback = 'priloha';
    const raw = String(name || fallback).trim() || fallback;
    const parts = raw.split('.');
    const ext = parts.length > 1 ? `.${parts.pop().toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8)}` : '';
    const base = parts.join('.') || fallback;
    return `${normalizeKey(base).replace(/\s+/g, '-').slice(0, 80) || fallback}${ext}`;
  }

  async function ensureCloudContract(contract) {
    if (!contract) return null;
    if (contract.cloudId) return contract.cloudId;
    if (!state.cloud?.householdId) return null;
    const cloudContract = await cloudAddContract(contract);
    if (!cloudContract?.id) return null;
    contract.cloudId = cloudContract.id;
    touchState();
    saveState();
    return contract.cloudId;
  }

  async function cloudUploadContractFile(contract, file) {
    const client = getSupabaseClient();
    if (!client || !state.cloud?.householdId) return null;
    const user = await refreshCloudSession(false);
    if (!user) return null;
    const cloudContractId = await ensureCloudContract(contract);
    if (!cloudContractId) return null;
    const storagePath = `${state.cloud.householdId}/${cloudContractId}/${Date.now()}-${uid()}-${sanitizeStorageFileName(file.name)}`;
    const { error: uploadError } = await client.storage
      .from('contract-files')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'application/octet-stream'
      });
    if (uploadError) {
      showToast(uploadError.message || 'Přílohu se nepovedlo nahrát');
      return null;
    }

    const { data, error } = await client
      .from('contract_files')
      .insert({
        household_id: state.cloud.householdId,
        contract_id: cloudContractId,
        bucket_id: 'contract-files',
        storage_path: storagePath,
        file_name: file.name || 'příloha',
        mime_type: file.type || null,
        file_size: file.size || 0,
        source: file.type && file.type.startsWith('image/') ? 'camera' : 'upload',
        created_by: user.id
      })
      .select('id,household_id,contract_id,storage_path,file_name,mime_type,file_size,source,created_at')
      .single();
    if (error) {
      await client.storage.from('contract-files').remove([storagePath]).catch?.(() => {});
      showToast(error.message || 'Metadata přílohy se nepovedlo uložit');
      return null;
    }
    state.cloud.lastSyncAt = new Date().toISOString();
    return mapCloudContractFile(data, contract.id);
  }

  function mapCloudContractFile(item, localContractId = null) {
    const contract = localContractId
      ? state.contracts.find((entry) => entry.id === localContractId)
      : state.contracts.find((entry) => entry.cloudId === item.contract_id);
    if (!contract) return null;
    const existing = state.contractFiles.find((file) => file.cloudId === item.id);
    return {
      id: existing?.id || `cloud-file-${item.id}`,
      cloudId: item.id,
      householdId: currentHouseholdId(),
      profileId: currentProfileId(),
      contractId: contract.id,
      cloudContractId: item.contract_id,
      storagePath: item.storage_path,
      bucketId: 'contract-files',
      fileName: item.file_name || 'příloha',
      fileType: item.mime_type || 'soubor',
      size: item.file_size || 0,
      source: item.source || 'upload',
      createdAt: item.created_at || new Date().toISOString()
    };
  }

  async function cloudLoadContractFiles(showMessage = true) {
    const client = getSupabaseClient();
    if (!client) return showToast('Supabase knihovna není načtená');
    const user = await refreshCloudSession(false);
    if (!user || !state.cloud?.householdId) return showToast('Nejdřív napoj domácnost na cloud');
    const { data, error } = await client
      .from('contract_files')
      .select('id,household_id,contract_id,storage_path,file_name,mime_type,file_size,source,created_at')
      .eq('household_id', state.cloud.householdId)
      .order('created_at', { ascending: false });
    if (error) return showToast(error.message || 'Přílohy se nepovedlo načíst');
    const cloudFiles = (data || []).map((item) => mapCloudContractFile(item)).filter(Boolean);
    const localOnly = state.contractFiles.filter((file) => !file.cloudId);
    state.contractFiles = [...localOnly, ...cloudFiles];
    state.cloud.lastSyncAt = new Date().toISOString();
    touchState();
    saveState();
    render();
    if (showMessage) showToast('Cloud přílohy načtené');
  }

  async function addContractFiles(form) {
    const contractId = form.dataset.contractId;
    const contract = state.contracts.find((item) => item.id === contractId);
    const input = form.querySelector('input[type="file"]');
    const files = [...(input?.files || [])];
    if (!contract || !files.length) {
      showToast('Vyber soubor');
      return;
    }
    let added = 0;
    for (const file of files) {
      const cloudFile = state.cloud?.householdId ? await cloudUploadContractFile(contract, file) : null;
      if (cloudFile) {
        state.contractFiles = state.contractFiles.filter((entry) => entry.cloudId !== cloudFile.cloudId);
        state.contractFiles.push(cloudFile);
        added += 1;
        continue;
      }
      if (!('indexedDB' in window)) {
        showToast('Prohlížeč nepodporuje IndexedDB');
        continue;
      }
      const id = `file-${uid()}`;
      const createdAt = new Date().toISOString();
      const meta = {
        id,
        householdId: currentHouseholdId(),
        profileId: currentProfileId(),
        contractId,
        fileName: file.name || 'příloha',
        fileType: file.type || 'soubor',
        size: file.size || 0,
        createdAt
      };
      await putStoredContractFile({ ...meta, blob: file });
      state.contractFiles.push(meta);
      added += 1;
    }
    activeContractId = contractId;
    touchState();
    saveState();
    render();
    showToast(added === 1 ? 'Příloha přidána' : `Přidáno ${added} příloh`);
  }

  async function openCloudContractFile(meta, download = false) {
    const client = getSupabaseClient();
    if (!client || !meta?.storagePath) return showToast('Cloud příloha není dostupná');
    const { data, error } = await client.storage
      .from('contract-files')
      .createSignedUrl(meta.storagePath, 60, download ? { download: meta.fileName || 'priloha' } : undefined);
    if (error || !data?.signedUrl) {
      showToast(error?.message || 'Dočasný odkaz nejde vytvořit');
      return;
    }
    window.open(data.signedUrl, '_blank', 'noopener');
  }

  async function openOrDownloadContractFile(id, openInNewTab = false) {
    const meta = state.contractFiles.find((file) => file.id === id);
    if (meta?.cloudId) {
      await openCloudContractFile(meta, !openInNewTab);
      return;
    }
    try {
      const record = await getStoredContractFile(id);
      if (!record?.blob) {
        showToast('Soubor není v tomto prohlížeči dostupný');
        return;
      }
      const url = URL.createObjectURL(record.blob);
      if (openInNewTab) {
        window.open(url, '_blank', 'noopener');
        setTimeout(() => URL.revokeObjectURL(url), 15000);
      } else {
        const link = document.createElement('a');
        link.href = url;
        link.download = meta?.fileName || record.fileName || 'priloha';
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      }
    } catch {
      showToast('Soubor nejde otevřít');
    }
  }

  async function deleteCloudContractFile(meta) {
    const client = getSupabaseClient();
    if (!client || !meta?.cloudId || !meta?.storagePath || !state.cloud?.householdId) return false;
    const { error: dbError } = await client
      .from('contract_files')
      .delete()
      .eq('id', meta.cloudId)
      .eq('household_id', state.cloud.householdId);
    if (dbError) {
      showToast(dbError.message || 'Metadata přílohy se nepovedlo smazat');
      return false;
    }
    const { error: storageError } = await client.storage.from('contract-files').remove([meta.storagePath]);
    if (storageError) showToast('Metadata smazaná, soubor ve Storage může zůstat k dočištění');
    state.cloud.lastSyncAt = new Date().toISOString();
    return true;
  }

  async function deleteContractFile(id) {
    const meta = state.contractFiles.find((file) => file.id === id);
    const ok = window.confirm(meta?.cloudId ? 'Smazat přílohu smlouvy z cloudu?' : 'Smazat přílohu smlouvy z tohoto zařízení?');
    if (!ok) return;
    if (meta?.cloudId) {
      const deleted = await deleteCloudContractFile(meta);
      if (!deleted) return;
    } else {
      deleteStoredContractFile(id).catch(() => {});
    }
    state.contractFiles = state.contractFiles.filter((file) => file.id !== id);
    touchState();
    saveState();
    render();
    showToast('Příloha smazána');
  }

  function normalizeKey(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function parseCsv(text) {
    const firstLine = String(text || '').split(/\r?\n/).find((line) => line.trim()) || '';
    const delimiter = (firstLine.match(/;/g) || []).length >= (firstLine.match(/,/g) || []).length ? ';' : ',';
    const rows = [];
    let row = [];
    let cell = '';
    let quote = false;
    const source = String(text || '').replace(/^\uFEFF/, '');
    for (let i = 0; i < source.length; i += 1) {
      const char = source[i];
      const next = source[i + 1];
      if (char === '"') {
        if (quote && next === '"') {
          cell += '"';
          i += 1;
        } else {
          quote = !quote;
        }
      } else if (char === delimiter && !quote) {
        row.push(cell);
        cell = '';
      } else if ((char === '\n' || char === '\r') && !quote) {
        if (char === '\r' && next === '\n') i += 1;
        row.push(cell);
        if (row.some((value) => String(value).trim() !== '')) rows.push(row);
        row = [];
        cell = '';
      } else {
        cell += char;
      }
    }
    row.push(cell);
    if (row.some((value) => String(value).trim() !== '')) rows.push(row);
    const headers = (rows.shift() || []).map((header) => normalizeKey(header));
    return rows.map((values) => Object.fromEntries(headers.map((header, index) => [header || `col ${index}`, normalizeText(values[index])])));
  }

  function getRowValue(row, keys) {
    const normalizedKeys = keys.map(normalizeKey);
    for (const key of normalizedKeys) {
      if (row[key] !== undefined && row[key] !== '') return row[key];
    }
    const found = Object.keys(row).find((rowKey) => normalizedKeys.some((key) => rowKey.includes(key)));
    return found ? row[found] : '';
  }

  function parseCzNumber(value) {
    if (value === undefined || value === null || value === '') return '';
    const clean = String(value)
      .replace(/\s/g, '')
      .replace(/Kč|CZK|EUR|€/gi, '')
      .replace(',', '.')
      .replace(/[^0-9.\-]/g, '');
    const number = Number(clean);
    return Number.isFinite(number) ? number : '';
  }

  function parseFuelioDate(value) {
    const text = normalizeText(value);
    if (!text) return '';
    const iso = text.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
    if (iso) return `${iso[1]}-${iso[2].padStart(2, '0')}-${iso[3].padStart(2, '0')}`;
    const cz = text.match(/^(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{2,4})/);
    if (cz) {
      const year = cz[3].length === 2 ? `20${cz[3]}` : cz[3];
      return `${year}-${cz[2].padStart(2, '0')}-${cz[1].padStart(2, '0')}`;
    }
    const parsed = new Date(text);
    return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString().slice(0, 10);
  }

  function mapFuelioRows(text) {
    const rows = parseCsv(text);
    return rows.map((row, index) => {
      const date = parseFuelioDate(getRowValue(row, ['date', 'datum', 'time', 'timestamp']));
      const odometer = parseCzNumber(getRowValue(row, ['odometer', 'tachometer', 'mileage', 'kilometers', 'kilometres', 'km', 'stav tachometru']));
      const liters = parseCzNumber(getRowValue(row, ['liters', 'litres', 'volume', 'fuel volume', 'quantity', 'mnozstvi', 'palivo']));
      const price = parseCzNumber(getRowValue(row, ['total cost', 'total price', 'amount', 'cost', 'price', 'cena', 'castka', 'celkem']));
      const vehicleName = normalizeText(getRowValue(row, ['vehicle', 'car', 'auto', 'vozidlo', 'vehicle name']));
      const category = normalizeText(getRowValue(row, ['category', 'type', 'kategorie', 'typ', 'expense type']));
      const note = normalizeText(getRowValue(row, ['note', 'notes', 'poznamka', 'description', 'comment']));
      const station = normalizeText(getRowValue(row, ['station', 'gas station', 'cerpaci stanice', 'place', 'location']));
      const title = category || note || station || 'Záznam z Fuelio';
      const kind = liters && odometer ? 'fuel' : price && (category || note || station) ? 'service' : 'ignored';
      return { index, kind, date, odometer, liters, price, vehicleName, title, note: [station, note].filter(Boolean).join(' · ') };
    }).filter((row) => row.kind !== 'ignored' && row.date);
  }

  async function previewFuelioImport(form) {
    const file = form.querySelector('input[type="file"]')?.files?.[0];
    if (!file) {
      showToast('Vyber CSV soubor');
      return;
    }
    const text = await file.text();
    const rows = mapFuelioRows(text);
    if (!rows.length) {
      fuelioPreview = null;
      render();
      showToast('V CSV jsem nenašel použitelná data');
      return;
    }
    fuelioPreview = { fileName: file.name, rows };
    render();
    showToast('Náhled načten');
  }

  function fuelDuplicateExists(row, vehicleId) {
    return state.fuel.some((item) => item.vehicleId === vehicleId && String(item.date) === String(row.date) && Number(item.odometer || 0) === Number(row.odometer || 0) && Number(item.liters || 0) === Number(row.liters || 0) && Number(item.price || 0) === Number(row.price || 0));
  }

  function serviceDuplicateExists(row, vehicleId) {
    return state.services.some((item) => item.vehicleId === vehicleId && String(item.date) === String(row.date) && String(item.title || '') === String(row.title || '') && Number(item.price || 0) === Number(row.price || 0));
  }

  async function confirmFuelioImport(options = {}) {
    const syncCloud = Boolean(options.syncCloud);
    if (!fuelioPreview?.rows?.length) {
      showToast('Nejdřív načti náhled');
      return;
    }
    const vehicleByName = new Map(state.vehicles.map((vehicle) => [normalizeKey(vehicle.name), vehicle]));
    let fallbackVehicle = state.vehicles.find((vehicle) => vehicle.id === garageVehicleId) || state.vehicles[0] || null;
    if (!fallbackVehicle) {
      fallbackVehicle = { id: uid(), householdId: currentHouseholdId(), profileId: currentProfileId(), createdAt: new Date().toISOString(), name: 'Fuelio import', plate: '', fuelType: '', odometer: '', technicalInspectionUntil: '', insuranceUntil: '', nextServiceKm: '', nextServiceDate: '', note: '' };
      state.vehicles.push(fallbackVehicle);
      vehicleByName.set(normalizeKey(fallbackVehicle.name), fallbackVehicle);
    }

    let importedFuel = 0;
    let importedServices = 0;
    let skipped = 0;
    const importedIds = { fuel: [], services: [], vehicles: [] };

    fuelioPreview.rows.forEach((row) => {
      let vehicle = row.vehicleName ? vehicleByName.get(normalizeKey(row.vehicleName)) : fallbackVehicle;
      if (!vehicle && row.vehicleName) {
        vehicle = { id: uid(), householdId: currentHouseholdId(), profileId: currentProfileId(), createdAt: new Date().toISOString(), name: row.vehicleName, plate: '', fuelType: '', odometer: row.odometer || '', technicalInspectionUntil: '', insuranceUntil: '', nextServiceKm: '', nextServiceDate: '', note: '' };
        state.vehicles.push(vehicle);
        vehicleByName.set(normalizeKey(row.vehicleName), vehicle);
        importedIds.vehicles.push(vehicle.id);
      }
      const vehicleId = vehicle?.id || fallbackVehicle.id;
      if (row.kind === 'fuel') {
        if (fuelDuplicateExists(row, vehicleId)) {
          skipped += 1;
          return;
        }
        const item = { id: uid(), householdId: currentHouseholdId(), profileId: currentProfileId(), createdAt: new Date().toISOString(), source: 'fuelio', vehicleId, date: row.date, odometer: row.odometer, liters: row.liters, price: row.price, note: row.note };
        state.fuel.push(item);
        importedIds.fuel.push(item.id);
        if (row.odometer && Number(row.odometer) > Number(vehicle.odometer || 0)) vehicle.odometer = String(row.odometer);
        importedFuel += 1;
      }
      if (row.kind === 'service') {
        if (serviceDuplicateExists(row, vehicleId)) {
          skipped += 1;
          return;
        }
        const item = { id: uid(), householdId: currentHouseholdId(), profileId: currentProfileId(), createdAt: new Date().toISOString(), source: 'fuelio', vehicleId, date: row.date, odometer: row.odometer || '', title: row.title, price: row.price, note: row.note };
        state.services.push(item);
        importedIds.services.push(item.id);
        importedServices += 1;
      }
    });

    garageVehicleId = fallbackVehicle.id;
    fuelioPreview = null;
    touchState();
    saveState();

    if (syncCloud) {
      const result = await cloudSyncGarageSubset(importedIds);
      render();
      showToast(`Fuelio import + cloud: ${importedFuel} tankování, ${importedServices} nákladů, ${skipped} duplicit · cloud ${result.fuel + result.services + result.vehicles} záznamů`);
      return;
    }

    render();
    showToast(`Fuelio import: ${importedFuel} tankování, ${importedServices} nákladů, ${skipped} duplicit`);
  }


  async function updateVehicle(vehicleId, data) {
    const vehicle = state.vehicles.find((item) => item.id === vehicleId);
    if (!vehicle) {
      showToast('Auto se nepodařilo najít');
      return;
    }
    vehicle.name = normalizeText(data.name) || vehicle.name;
    vehicle.plate = normalizeText(data.plate);
    vehicle.fuelType = normalizeText(data.fuelType);
    vehicle.odometer = normalizeText(data.odometer);
    vehicle.technicalInspectionUntil = normalizeText(data.technicalInspectionUntil);
    vehicle.insuranceUntil = normalizeText(data.insuranceUntil);
    vehicle.nextServiceKm = normalizeText(data.nextServiceKm);
    vehicle.nextServiceDate = normalizeText(data.nextServiceDate);
    vehicle.note = normalizeText(data.note);
    const ok = await cloudUpdateVehicle(vehicle);
    if (!ok) return;
    touchState();
    saveState();
    render();
    showToast(vehicle.cloudId ? 'Údaje auta uloženy v cloudu' : 'Údaje auta uloženy lokálně');
  }


  async function updateFuelLog(id, data) {
    const item = state.fuel.find((entry) => entry.id === id);
    if (!item) return showToast('Tankování nenalezeno');
    item.date = normalizeText(data.date) || item.date;
    item.odometer = normalizeText(data.odometer);
    item.liters = decimalValue(data.liters);
    item.price = decimalValue(data.price);
    item.note = normalizeText(data.note);
    item.updatedAt = new Date().toISOString();
    const ok = await cloudUpdateFuelLog(item);
    if (!ok) return;
    garageEditRecord = null;
    touchState();
    saveState();
    render();
    showToast(item.cloudId ? 'Tankování upraveno v cloudu' : 'Tankování upraveno lokálně');
  }

  async function updateServiceLog(id, data) {
    const item = state.services.find((entry) => entry.id === id);
    if (!item) return showToast('Servis nenalezen');
    item.date = normalizeText(data.date) || item.date;
    item.odometer = normalizeText(data.odometer);
    item.title = normalizeText(data.title) || item.title;
    item.price = decimalValue(data.price);
    item.note = normalizeText(data.note);
    item.updatedAt = new Date().toISOString();
    const ok = await cloudUpdateServiceLog(item);
    if (!ok) return;
    garageEditRecord = null;
    touchState();
    saveState();
    render();
    showToast(item.cloudId ? 'Servis upraven v cloudu' : 'Servis upraven lokálně');
  }


  async function addShoppingFromForm(data, form) {
    const name = normalizeText(data.name);
    if (!name) return showToast('Zadej položku');
    const catalogItem = findShoppingCatalogItem(name);
    const category = normalizeText(data.category) || catalogItem?.category || 'Ostatní';
    const unit = normalizeText(data.unit) || catalogItem?.defaultUnit || 'ks';
    const quantity = decimalValue(data.quantity) || 1;
    const note = normalizeText(data.note);
    const isKnown = Boolean(catalogItem);
    const cloudReady = Boolean(state.cloud?.userId && state.cloud?.householdId);

    if (!isKnown) {
      state.shoppingCatalogCustom = state.shoppingCatalogCustom || [];
      if (!state.shoppingCatalogCustom.some((item) => normalizeKey(item.name) === normalizeKey(name))) {
        state.shoppingCatalogCustom.push({ id: uid(), householdId: currentHouseholdId(), profileId: currentProfileId(), createdAt: new Date().toISOString(), name, defaultUnit: unit, category });
      }
    }

    const localItem = {
      id: uid(),
      householdId: currentHouseholdId(),
      profileId: currentProfileId(),
      createdAt: new Date().toISOString(),
      name,
      category,
      quantity,
      unit,
      note,
      done: false,
      catalogItemId: catalogItem?.id || ''
    };

    if (cloudReady) {
      const cloudItem = await cloudAddShoppingItem({ name, category, quantity, unit, note, catalogItem });
      if (cloudItem) {
        localItem.cloudId = cloudItem.id;
        localItem.cloudListId = cloudItem.list_id;
        localItem.catalogItemId = cloudItem.catalog_item_id || localItem.catalogItemId;
      }
    }

    trackShoppingUsage(name, unit, category);
    state.shopping.push(localItem);
    touchState();
    saveState();
    form?.reset();
    render();
    showToast(isKnown ? 'Přidáno do nákupu' : 'Přidáno i do katalogu domácnosti');
  }

  async function quickAddShoppingByName(name) {
    const catalogItem = findShoppingCatalogItem(name);
    if (!catalogItem) return showToast('Položku se nepovedlo najít v katalogu');
    await addShoppingFromForm({
      name: catalogItem.name,
      category: catalogItem.category || 'Ostatní',
      quantity: '1',
      unit: catalogItem.defaultUnit || 'ks',
      note: ''
    }, null);
  }

  async function cloudSyncLocalShoppingItems() {
    const cloudReady = Boolean(state.cloud?.userId && state.cloud?.householdId);
    if (!cloudReady) return showToast('Nejdřív napoj domácnost na cloud');
    const localItems = state.shopping.filter((item) => !item.cloudId);
    if (!localItems.length) return showToast('Není co odeslat');
    let synced = 0;
    for (const item of localItems) {
      const catalogItem = findShoppingCatalogItem(item.name);
      const cloudItem = await cloudAddShoppingItem({
        name: item.name,
        category: item.category || catalogItem?.category || 'Ostatní',
        quantity: item.quantity || 1,
        unit: item.unit || catalogItem?.defaultUnit || 'ks',
        note: item.note || '',
        catalogItem
      });
      if (cloudItem) {
        item.cloudId = cloudItem.id;
        item.cloudListId = cloudItem.list_id;
        item.catalogItemId = cloudItem.catalog_item_id || item.catalogItemId || '';
        synced += 1;
      }
    }
    touchState();
    saveState();
    render();
    showToast(synced ? `Odesláno do cloudu: ${synced}` : 'Nic se nepovedlo odeslat');
  }

  async function cloudLoadShoppingData(showMessage = true) {
    const client = getSupabaseClient();
    if (!client) return showToast('Supabase knihovna není načtená');
    const user = await refreshCloudSession(false);
    if (!user || !state.cloud?.householdId) return showToast('Nejdřív vytvoř / napoj domácnost v cloudu');
    const householdId = state.cloud.householdId;

    const [unitsRes, categoriesRes, catalogRes, listsRes] = await Promise.all([
      client.from('shopping_units').select('code,label,kind,sort_order').order('sort_order'),
      client.from('shopping_categories').select('id,household_id,name,icon,sort_order').or(`household_id.is.null,household_id.eq.${householdId}`).order('sort_order'),
      client.from('shopping_catalog_items').select('id,household_id,name,default_unit,category_id,shopping_categories(name)').or(`household_id.is.null,household_id.eq.${householdId}`).order('name'),
      client.from('shopping_lists').select('id,name,status,created_at').eq('household_id', householdId).eq('status', 'active').order('created_at', { ascending: false }).limit(1)
    ]);

    const firstError = unitsRes.error || categoriesRes.error || catalogRes.error || listsRes.error;
    if (firstError) return showToast(firstError.message || 'Nákupy se nepovedlo načíst');

    let activeListId = listsRes.data?.[0]?.id || '';
    if (!activeListId) {
      const { data: list, error: listError } = await client.from('shopping_lists').insert({ household_id: householdId, name: 'Nákup', status: 'active', created_by: user.id }).select('id').single();
      if (listError) return showToast(listError.message || 'Seznam se nepovedlo vytvořit');
      activeListId = list.id;
    }

    const itemsRes = await client.from('shopping_list_items').select('id,list_id,catalog_item_id,name,quantity,unit,note,is_done,position,created_at').eq('household_id', householdId).eq('list_id', activeListId).order('position').order('created_at');
    if (itemsRes.error) return showToast(itemsRes.error.message || 'Položky nákupu se nepovedlo načíst');

    state.shoppingCloud = {
      units: unitsRes.data || [],
      categories: categoriesRes.data || [],
      catalog: (catalogRes.data || []).map((item) => ({ ...item, category_name: item.shopping_categories?.name || 'Ostatní' })),
      activeListId,
      loadedAt: new Date().toISOString()
    };

    const cloudItems = (itemsRes.data || []).map((item) => ({
      id: state.shopping.find((local) => local.cloudId === item.id)?.id || uid(),
      cloudId: item.id,
      cloudListId: item.list_id,
      householdId: currentHouseholdId(),
      profileId: currentProfileId(),
      createdAt: item.created_at || new Date().toISOString(),
      name: item.name,
      quantity: item.quantity || 1,
      unit: item.unit || 'ks',
      note: item.note || '',
      done: Boolean(item.is_done),
      catalogItemId: item.catalog_item_id || '',
      category: findShoppingCatalogItem(item.name)?.category || 'Ostatní'
    }));
    const localOnly = state.shopping.filter((item) => !item.cloudId);
    state.shopping = [...localOnly, ...cloudItems];

    state.cloud.lastSyncAt = new Date().toISOString();
    saveState();
    render();
    if (showMessage) showToast('Cloud nákupy načtené');
  }

  async function cloudFindOrCreateCatalogItem({ name, category, unit, catalogItem }) {
    if (catalogItem?.id && !String(catalogItem.id).startsWith('default-') && catalogItem.source !== 'local') return catalogItem.id;
    const client = getSupabaseClient();
    const householdId = state.cloud?.householdId;
    if (!client || !householdId) return '';

    const { data: existing } = await client.from('shopping_catalog_items').select('id,name').eq('household_id', householdId).ilike('name', name).maybeSingle();
    if (existing?.id) return existing.id;

    let categoryId = '';
    const cachedCategory = (state.shoppingCloud?.categories || []).find((item) => item.name === category);
    if (cachedCategory?.id) categoryId = cachedCategory.id;
    const { data, error } = await client.from('shopping_catalog_items').insert({ household_id: householdId, category_id: categoryId || null, name, default_unit: unit || 'ks', created_by: state.cloud.userId }).select('id').single();
    if (error) {
      showToast(error.message || 'Katalogovou položku se nepovedlo uložit');
      return '';
    }
    state.shoppingCloud.catalog = [...(state.shoppingCloud?.catalog || []), { id: data.id, household_id: householdId, name, default_unit: unit || 'ks', category_name: category }];
    return data.id;
  }

  async function cloudAddShoppingItem({ name, category, quantity, unit, note, catalogItem }) {
    const client = getSupabaseClient();
    if (!client || !state.cloud?.householdId) return null;
    if (!state.shoppingCloud?.activeListId) await cloudLoadShoppingData(false);
    const householdId = state.cloud.householdId;
    const listId = state.shoppingCloud?.activeListId;
    if (!listId) return null;
    const catalogItemId = await cloudFindOrCreateCatalogItem({ name, category, unit, catalogItem });
    const { data, error } = await client.from('shopping_list_items').insert({
      household_id: householdId,
      list_id: listId,
      catalog_item_id: catalogItemId || null,
      name,
      quantity,
      unit,
      note,
      is_done: false,
      added_by_profile_id: null,
      created_by: state.cloud.userId
    }).select('id,list_id,catalog_item_id').single();
    if (error) {
      showToast(error.message || 'Cloud položka se nepovedla uložit');
      return null;
    }
    state.cloud.lastSyncAt = new Date().toISOString();
    return data;
  }


  async function cloudUpdateShoppingItem(item) {
    const client = getSupabaseClient();
    if (!client || !item?.cloudId || !state.cloud?.householdId) return true;
    const { error } = await client
      .from('shopping_list_items')
      .update({
        is_done: Boolean(item.done),
        done_at: item.done ? new Date().toISOString() : null,
        quantity: item.quantity || 1,
        unit: item.unit || 'ks',
        note: item.note || null
      })
      .eq('id', item.cloudId)
      .eq('household_id', state.cloud.householdId);
    if (error) {
      showToast(error.message || 'Cloud nákup se nepovedlo aktualizovat');
      return false;
    }
    state.cloud.lastSyncAt = new Date().toISOString();
    return true;
  }

  async function cloudDeleteShoppingItem(item) {
    const client = getSupabaseClient();
    if (!client || !item?.cloudId || !state.cloud?.householdId) return true;
    const { error } = await client
      .from('shopping_list_items')
      .delete()
      .eq('id', item.cloudId)
      .eq('household_id', state.cloud.householdId);
    if (error) {
      showToast(error.message || 'Cloud nákup se nepovedlo smazat');
      return false;
    }
    state.cloud.lastSyncAt = new Date().toISOString();
    return true;
  }


  function fuelTypeToCloud(value) {
    const key = normalizeKey(value || '');
    if (key.includes('nafta') || key.includes('diesel')) return 'diesel';
    if (key.includes('elektro') || key.includes('electric')) return 'electric';
    if (key.includes('hybrid')) return 'hybrid';
    if (key.includes('lpg')) return 'lpg';
    if (key.includes('cng')) return 'cng';
    if (key.includes('benzin') || key.includes('benzín') || key.includes('gasoline')) return 'gasoline';
    return key ? 'other' : 'other';
  }

  function fuelTypeFromCloud(value) {
    const map = { gasoline: 'benzín', diesel: 'nafta', lpg: 'LPG', cng: 'CNG', hybrid: 'hybrid', electric: 'elektro', other: 'jiné' };
    return map[value] || value || '';
  }

  function serviceTypeToCloud(value) {
    const key = normalizeKey(value || '');
    if (key.includes('stk')) return 'stk';
    if (key.includes('emise')) return 'emissions';
    if (key.includes('pneu') || key.includes('tire')) return 'tires';
    if (key.includes('pojist')) return 'insurance';
    if (key.includes('oprav') || key.includes('repair')) return 'repair';
    if (key.includes('servis') || key.includes('service')) return 'service';
    return 'other';
  }

  function garageSourceHash(prefix, item) {
    const vehicle = state.vehicles.find((entry) => entry.id === item.vehicleId);
    const vehicleKey = vehicle?.cloudId || vehicle?.name || item.vehicleId || '';
    return [prefix, vehicleKey, item.date || '', item.odometer || '', item.liters || '', item.price || '', item.title || '', item.note || ''].map((part) => normalizeKey(part)).join('|').slice(0, 240);
  }

  async function ensureCloudVehicle(vehicle) {
    if (!vehicle) return null;
    if (vehicle.cloudId) return vehicle.cloudId;
    const cloudVehicle = await cloudAddVehicle(vehicle);
    if (!cloudVehicle?.id) return null;
    vehicle.cloudId = cloudVehicle.id;
    touchState();
    saveState();
    return vehicle.cloudId;
  }

  function cloudVehiclePayload(vehicle, userId) {
    return {
      household_id: state.cloud.householdId,
      profile_id: null,
      name: vehicle.name || 'Auto',
      plate_number: vehicle.plate || null,
      fuel_type: fuelTypeToCloud(vehicle.fuelType),
      current_odometer: vehicle.odometer === '' || vehicle.odometer === undefined ? null : Number(vehicle.odometer),
      stk_until: vehicle.technicalInspectionUntil || null,
      insurance_until: vehicle.insuranceUntil || null,
      next_service_odometer: vehicle.nextServiceKm === '' || vehicle.nextServiceKm === undefined ? null : Number(vehicle.nextServiceKm),
      next_service_date: vehicle.nextServiceDate || null,
      note: vehicle.note || null,
      created_by: vehicle.cloudId ? undefined : userId,
      updated_by: userId
    };
  }

  async function cloudAddVehicle(vehicle) {
    const client = getSupabaseClient();
    if (!client || !state.cloud?.householdId) return null;
    const user = await refreshCloudSession(false);
    if (!user) return null;
    const payload = cloudVehiclePayload(vehicle, user.id);
    const { data, error } = await client.from('vehicles').insert(payload).select('id').single();
    if (error) {
      showToast(error.message || 'Auto se nepovedlo uložit do cloudu');
      return null;
    }
    state.cloud.lastSyncAt = new Date().toISOString();
    return data;
  }

  async function cloudUpdateVehicle(vehicle) {
    const client = getSupabaseClient();
    if (!client || !vehicle?.cloudId || !state.cloud?.householdId) return true;
    const user = await refreshCloudSession(false);
    if (!user) return false;
    const payload = cloudVehiclePayload(vehicle, user.id);
    delete payload.created_by;
    const { error } = await client.from('vehicles').update(payload).eq('id', vehicle.cloudId).eq('household_id', state.cloud.householdId);
    if (error) {
      showToast(error.message || 'Auto se nepovedlo aktualizovat v cloudu');
      return false;
    }
    state.cloud.lastSyncAt = new Date().toISOString();
    return true;
  }

  async function cloudDeleteVehicle(vehicle) {
    const client = getSupabaseClient();
    if (!client || !vehicle?.cloudId || !state.cloud?.householdId) return true;
    const { error } = await client.from('vehicles').delete().eq('id', vehicle.cloudId).eq('household_id', state.cloud.householdId);
    if (error) {
      showToast(error.message || 'Auto se nepovedlo smazat v cloudu');
      return false;
    }
    state.cloud.lastSyncAt = new Date().toISOString();
    return true;
  }

  async function cloudAddFuelLog(item) {
    const client = getSupabaseClient();
    if (!client || !state.cloud?.householdId) return null;
    const user = await refreshCloudSession(false);
    if (!user) return null;
    const vehicle = state.vehicles.find((entry) => entry.id === item.vehicleId);
    const vehicleCloudId = await ensureCloudVehicle(vehicle);
    if (!vehicleCloudId) return null;
    const liters = item.liters === '' || item.liters === undefined ? null : Number(item.liters);
    const totalPrice = item.price === '' || item.price === undefined ? null : Number(item.price);
    const payload = {
      household_id: state.cloud.householdId,
      vehicle_id: vehicleCloudId,
      profile_id: null,
      date: item.date || todayISO(),
      odometer: item.odometer === '' || item.odometer === undefined ? null : Number(item.odometer),
      liters,
      total_price: totalPrice,
      price_per_liter: liters && totalPrice ? Number((totalPrice / liters).toFixed(2)) : null,
      full_tank: true,
      note: item.note || null,
      source: item.source === 'fuelio' ? 'fuelio_import' : 'manual',
      source_hash: garageSourceHash('fuel', item),
      created_by: user.id,
      updated_by: user.id
    };
    const { data, error } = await client.from('fuel_logs').insert(payload).select('id').single();
    if (error) {
      if (!String(error.message || '').toLowerCase().includes('duplicate')) showToast(error.message || 'Tankování se nepovedlo uložit do cloudu');
      return null;
    }
    item.cloudId = data.id;
    state.cloud.lastSyncAt = new Date().toISOString();
    return data;
  }

  async function cloudAddServiceLog(item) {
    const client = getSupabaseClient();
    if (!client || !state.cloud?.householdId) return null;
    const user = await refreshCloudSession(false);
    if (!user) return null;
    const vehicle = state.vehicles.find((entry) => entry.id === item.vehicleId);
    const vehicleCloudId = await ensureCloudVehicle(vehicle);
    if (!vehicleCloudId) return null;
    const payload = {
      household_id: state.cloud.householdId,
      vehicle_id: vehicleCloudId,
      profile_id: null,
      date: item.date || todayISO(),
      odometer: item.odometer === '' || item.odometer === undefined ? null : Number(item.odometer),
      type: serviceTypeToCloud(item.title),
      title: item.title || 'Servis',
      total_price: item.price === '' || item.price === undefined ? null : Number(item.price),
      note: item.note || null,
      source: item.source === 'fuelio' ? 'fuelio_import' : 'manual',
      source_hash: garageSourceHash('service', item),
      created_by: user.id,
      updated_by: user.id
    };
    const { data, error } = await client.from('service_logs').insert(payload).select('id').single();
    if (error) {
      if (!String(error.message || '').toLowerCase().includes('duplicate')) showToast(error.message || 'Servis se nepovedlo uložit do cloudu');
      return null;
    }
    item.cloudId = data.id;
    state.cloud.lastSyncAt = new Date().toISOString();
    return data;
  }


  async function cloudUpdateFuelLog(item) {
    const client = getSupabaseClient();
    if (!client || !item?.cloudId || !state.cloud?.householdId) return true;
    const user = await refreshCloudSession(false);
    if (!user) return false;
    const liters = item.liters === '' || item.liters === undefined ? null : Number(item.liters);
    const totalPrice = item.price === '' || item.price === undefined ? null : Number(item.price);
    const payload = {
      date: item.date || todayISO(),
      odometer: item.odometer === '' || item.odometer === undefined ? null : Number(item.odometer),
      liters,
      total_price: totalPrice,
      price_per_liter: liters && totalPrice ? Number((totalPrice / liters).toFixed(2)) : null,
      note: item.note || null,
      updated_by: user.id
    };
    const { error } = await client.from('fuel_logs').update(payload).eq('id', item.cloudId).eq('household_id', state.cloud.householdId);
    if (error) {
      showToast(error.message || 'Tankování se nepovedlo upravit v cloudu');
      return false;
    }
    state.cloud.lastSyncAt = new Date().toISOString();
    return true;
  }

  async function cloudUpdateServiceLog(item) {
    const client = getSupabaseClient();
    if (!client || !item?.cloudId || !state.cloud?.householdId) return true;
    const user = await refreshCloudSession(false);
    if (!user) return false;
    const payload = {
      date: item.date || todayISO(),
      odometer: item.odometer === '' || item.odometer === undefined ? null : Number(item.odometer),
      type: serviceTypeToCloud(item.title),
      title: item.title || 'Servis',
      total_price: item.price === '' || item.price === undefined ? null : Number(item.price),
      note: item.note || null,
      updated_by: user.id
    };
    const { error } = await client.from('service_logs').update(payload).eq('id', item.cloudId).eq('household_id', state.cloud.householdId);
    if (error) {
      showToast(error.message || 'Servis se nepovedlo upravit v cloudu');
      return false;
    }
    state.cloud.lastSyncAt = new Date().toISOString();
    return true;
  }

  async function cloudDeleteGarageRecord(collection, item) {
    const client = getSupabaseClient();
    if (!client || !item?.cloudId || !state.cloud?.householdId) return true;
    const table = collection === 'fuel' ? 'fuel_logs' : collection === 'services' ? 'service_logs' : '';
    if (!table) return true;
    const { error } = await client.from(table).delete().eq('id', item.cloudId).eq('household_id', state.cloud.householdId);
    if (error) {
      showToast(error.message || 'Záznam se nepovedlo smazat v cloudu');
      return false;
    }
    state.cloud.lastSyncAt = new Date().toISOString();
    return true;
  }

  async function cloudLoadGarageData(showMessage = true) {
    const client = getSupabaseClient();
    if (!client || !state.cloud?.householdId) return showToast('Nejdřív napoj domácnost na cloud');
    const user = await refreshCloudSession(false);
    if (!user) return showToast('Nejdřív se přihlas');

    const [{ data: vehicles, error: vehicleError }, { data: fuel, error: fuelError }, { data: services, error: serviceError }] = await Promise.all([
      client.from('vehicles').select('*').eq('household_id', state.cloud.householdId).order('created_at', { ascending: true }),
      client.from('fuel_logs').select('*').eq('household_id', state.cloud.householdId).order('date', { ascending: true }),
      client.from('service_logs').select('*').eq('household_id', state.cloud.householdId).order('date', { ascending: true })
    ]);
    if (vehicleError || fuelError || serviceError) {
      showToast(vehicleError?.message || fuelError?.message || serviceError?.message || 'Garáž se nepovedlo načíst');
      return;
    }

    const existingByCloud = new Map(state.vehicles.filter((vehicle) => vehicle.cloudId).map((vehicle) => [vehicle.cloudId, vehicle]));
    const cloudVehicles = (vehicles || []).map((vehicle) => {
      const existing = existingByCloud.get(vehicle.id);
      return {
        id: existing?.id || uid(),
        cloudId: vehicle.id,
        householdId: currentHouseholdId(),
        profileId: currentProfileId(),
        createdAt: vehicle.created_at || new Date().toISOString(),
        name: vehicle.name || 'Auto',
        plate: vehicle.plate_number || '',
        fuelType: fuelTypeFromCloud(vehicle.fuel_type),
        odometer: vehicle.current_odometer === null || vehicle.current_odometer === undefined ? '' : String(vehicle.current_odometer),
        technicalInspectionUntil: vehicle.stk_until || '',
        insuranceUntil: vehicle.insurance_until || '',
        nextServiceKm: vehicle.next_service_odometer === null || vehicle.next_service_odometer === undefined ? '' : String(vehicle.next_service_odometer),
        nextServiceDate: vehicle.next_service_date || '',
        note: vehicle.note || ''
      };
    });
    const vehicleIdByCloud = new Map(cloudVehicles.map((vehicle) => [vehicle.cloudId, vehicle.id]));
    const localVehicles = state.vehicles.filter((vehicle) => !vehicle.cloudId);
    state.vehicles = [...localVehicles, ...cloudVehicles];

    const localFuel = state.fuel.filter((item) => !item.cloudId);
    state.fuel = [
      ...localFuel,
      ...(fuel || []).map((item) => ({
        id: state.fuel.find((entry) => entry.cloudId === item.id)?.id || uid(),
        cloudId: item.id,
        householdId: currentHouseholdId(),
        profileId: currentProfileId(),
        createdAt: item.created_at || new Date().toISOString(),
        source: item.source === 'fuelio_import' ? 'fuelio' : 'cloud',
        vehicleId: vehicleIdByCloud.get(item.vehicle_id) || '',
        date: item.date || '',
        odometer: item.odometer === null || item.odometer === undefined ? '' : String(item.odometer),
        liters: item.liters === null || item.liters === undefined ? '' : Number(item.liters),
        price: item.total_price === null || item.total_price === undefined ? '' : Number(item.total_price),
        note: item.note || ''
      })).filter((item) => item.vehicleId)
    ];

    const localServices = state.services.filter((item) => !item.cloudId);
    state.services = [
      ...localServices,
      ...(services || []).map((item) => ({
        id: state.services.find((entry) => entry.cloudId === item.id)?.id || uid(),
        cloudId: item.id,
        householdId: currentHouseholdId(),
        profileId: currentProfileId(),
        createdAt: item.created_at || new Date().toISOString(),
        source: item.source === 'fuelio_import' ? 'fuelio' : 'cloud',
        vehicleId: vehicleIdByCloud.get(item.vehicle_id) || '',
        date: item.date || '',
        odometer: item.odometer === null || item.odometer === undefined ? '' : String(item.odometer),
        title: item.title || 'Servis',
        price: item.total_price === null || item.total_price === undefined ? '' : Number(item.total_price),
        note: item.note || ''
      })).filter((item) => item.vehicleId)
    ];

    if (!garageVehicleId && state.vehicles.length) garageVehicleId = state.vehicles[0].id;
    state.cloud.lastSyncAt = new Date().toISOString();
    touchState();
    saveState();
    render();
    if (showMessage) showToast('Cloud Garáž načtená');
  }


  async function cloudSyncGarageSubset(ids = {}) {
    if (!state.cloud?.householdId) {
      showToast('Nejdřív napoj domácnost na cloud');
      return { vehicles: 0, fuel: 0, services: 0 };
    }
    const vehicleIds = new Set(ids.vehicles || []);
    const fuelIds = new Set(ids.fuel || []);
    const serviceIds = new Set(ids.services || []);
    let vehicles = 0;
    let fuel = 0;
    let services = 0;

    const records = [
      ...state.fuel.filter((item) => fuelIds.has(item.id)),
      ...state.services.filter((item) => serviceIds.has(item.id))
    ];
    records.forEach((record) => {
      if (record.vehicleId) vehicleIds.add(record.vehicleId);
    });

    for (const vehicle of state.vehicles.filter((item) => vehicleIds.has(item.id))) {
      if (!vehicle.cloudId) {
        const cloudVehicle = await cloudAddVehicle(vehicle);
        if (cloudVehicle?.id) {
          vehicle.cloudId = cloudVehicle.id;
          vehicles += 1;
        }
      }
    }
    for (const item of state.fuel.filter((entry) => fuelIds.has(entry.id))) {
      if (!item.cloudId) {
        const saved = await cloudAddFuelLog(item);
        if (saved?.id) fuel += 1;
      }
    }
    for (const item of state.services.filter((entry) => serviceIds.has(entry.id))) {
      if (!item.cloudId) {
        const saved = await cloudAddServiceLog(item);
        if (saved?.id) services += 1;
      }
    }
    touchState();
    saveState();
    return { vehicles, fuel, services };
  }

  async function cloudSyncLocalGarage() {
    if (!state.cloud?.householdId) return showToast('Nejdřív napoj domácnost na cloud');
    let vehicles = 0;
    let fuel = 0;
    let services = 0;
    for (const vehicle of state.vehicles) {
      if (!vehicle.cloudId) {
        const cloudVehicle = await cloudAddVehicle(vehicle);
        if (cloudVehicle?.id) {
          vehicle.cloudId = cloudVehicle.id;
          vehicles += 1;
        }
      }
    }
    for (const item of state.fuel) {
      if (!item.cloudId) {
        const saved = await cloudAddFuelLog(item);
        if (saved?.id) fuel += 1;
      }
    }
    for (const item of state.services) {
      if (!item.cloudId) {
        const saved = await cloudAddServiceLog(item);
        if (saved?.id) services += 1;
      }
    }
    touchState();
    saveState();
    render();
    showToast(`Garáž odeslána: ${vehicles} aut, ${fuel} tankování, ${services} servisů`);
  }


  function frequencyToCloud(value) {
    const map = { monthly: 'monthly', yearly: 'yearly', once: 'one_time', one_time: 'one_time', quarterly: 'quarterly', other: 'other' };
    return map[value] || 'monthly';
  }

  function frequencyFromCloud(value) {
    const map = { monthly: 'monthly', yearly: 'yearly', one_time: 'once', quarterly: 'quarterly', other: 'other' };
    return map[value] || 'monthly';
  }

  function contractTypeOptions(selected = '') {
    return CONTRACT_TYPE_OPTIONS.map(([value, label]) => [value, label]);
  }

  function contractTypeLabel(value) {
    const found = CONTRACT_TYPE_OPTIONS.find(([key]) => key === value);
    return found ? found[1] : (value || 'typ neuveden');
  }

  function cloudContractPayload(contract, userId) {
    return {
      household_id: state.cloud.householdId,
      profile_id: null,
      title: contract.name,
      type: contract.type || null,
      provider: contract.provider || null,
      contract_number: contract.number || null,
      valid_from: contract.validFrom || null,
      valid_until: contract.validTo || null,
      amount: contract.amount === '' || contract.amount === null || contract.amount === undefined ? null : Number(contract.amount),
      currency: 'CZK',
      payment_frequency: frequencyToCloud(contract.frequency),
      reminder_days: 30,
      note: contract.note || null,
      status: 'active',
      created_by: userId || state.cloud.userId || null,
      updated_by: userId || state.cloud.userId || null
    };
  }

  async function cloudAddContract(contract) {
    const client = getSupabaseClient();
    if (!client || !state.cloud?.householdId) return null;
    const user = await refreshCloudSession(false);
    if (!user) return null;
    if (contract.cloudId) return { id: contract.cloudId };
    const { data, error } = await client
      .from('contracts')
      .insert(cloudContractPayload(contract, user.id))
      .select('id')
      .single();
    if (error) {
      showToast(error.message || 'Smlouvu se nepovedlo uložit do cloudu');
      return null;
    }
    state.cloud.lastSyncAt = new Date().toISOString();
    return data;
  }

  async function cloudUpdateContract(contract) {
    const client = getSupabaseClient();
    if (!client || !state.cloud?.householdId || !contract?.cloudId) return true;
    const user = await refreshCloudSession(false);
    if (!user) return false;
    const payload = cloudContractPayload(contract, user.id);
    delete payload.household_id;
    delete payload.profile_id;
    delete payload.created_by;
    const { error } = await client
      .from('contracts')
      .update(payload)
      .eq('id', contract.cloudId)
      .eq('household_id', state.cloud.householdId);
    if (error) {
      showToast(error.message || 'Smlouvu se nepovedlo upravit v cloudu');
      return false;
    }
    state.cloud.lastSyncAt = new Date().toISOString();
    return true;
  }

  async function cloudLoadContracts(showMessage = true) {
    const client = getSupabaseClient();
    if (!client) return showToast('Supabase knihovna není načtená');
    const user = await refreshCloudSession(false);
    if (!user || !state.cloud?.householdId) return showToast('Nejdřív vytvoř / napoj domácnost v cloudu');
    const { data, error } = await client
      .from('contracts')
      .select('id,title,type,provider,contract_number,valid_from,valid_until,amount,payment_frequency,note,created_at')
      .eq('household_id', state.cloud.householdId)
      .order('valid_until', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false });
    if (error) return showToast(error.message || 'Smlouvy se nepovedlo načíst');

    const cloudContracts = (data || []).map((item) => {
      const existing = state.contracts.find((contract) => contract.cloudId === item.id);
      return {
        id: existing?.id || uid(),
        cloudId: item.id,
        householdId: currentHouseholdId(),
        profileId: currentProfileId(),
        createdAt: item.created_at || new Date().toISOString(),
        name: item.title || 'Smlouva',
        type: item.type || '',
        provider: item.provider || '',
        number: item.contract_number || '',
        validFrom: item.valid_from || '',
        validTo: item.valid_until || '',
        amount: item.amount === null || item.amount === undefined ? '' : Number(item.amount),
        frequency: frequencyFromCloud(item.payment_frequency),
        note: item.note || ''
      };
    });
    const localOnly = state.contracts.filter((contract) => !contract.cloudId);
    state.contracts = [...localOnly, ...cloudContracts];
    if (!activeContractId && state.contracts.length) activeContractId = state.contracts[0].id;
    state.cloud.lastSyncAt = new Date().toISOString();
    touchState();
    saveState();
    render();
    await cloudLoadContractFiles(false);
    if (showMessage) showToast('Cloud smlouvy načtené');
  }

  async function cloudSyncContractById(id) {
    const contract = state.contracts.find((item) => item.id === id);
    if (!contract) return;
    if (contract.cloudId) {
      const ok = await cloudUpdateContract(contract);
      if (!ok) return;
      showToast('Cloud smlouva aktualizovaná');
    } else {
      const cloudContract = await cloudAddContract(contract);
      if (!cloudContract?.id) return;
      contract.cloudId = cloudContract.id;
      showToast('Smlouva odeslaná do cloudu');
    }
    touchState();
    saveState();
    render();
  }

  async function cloudSyncLocalContracts() {
    const localContracts = state.contracts.filter((contract) => !contract.cloudId);
    if (!state.cloud?.householdId) return showToast('Nejdřív napoj domácnost na cloud');
    if (!localContracts.length) return showToast('Není co odeslat');
    let synced = 0;
    for (const contract of localContracts) {
      const cloudContract = await cloudAddContract(contract);
      if (cloudContract?.id) {
        contract.cloudId = cloudContract.id;
        synced += 1;
      }
    }
    touchState();
    saveState();
    render();
    showToast(synced ? `Odesláno smluv: ${synced}` : 'Nic se nepovedlo odeslat');
  }

  async function cloudDeleteContract(contract) {
    const client = getSupabaseClient();
    if (!client || !contract?.cloudId || !state.cloud?.householdId) return true;
    const { error } = await client
      .from('contracts')
      .delete()
      .eq('id', contract.cloudId)
      .eq('household_id', state.cloud.householdId);
    if (error) {
      showToast(error.message || 'Cloud smlouvu se nepovedlo smazat');
      return false;
    }
    state.cloud.lastSyncAt = new Date().toISOString();
    return true;
  }



  function cloudParcelPayload(pkg, userId) {
    return {
      household_id: state.cloud.householdId,
      profile_id: pkg.profileId && String(pkg.profileId).startsWith('profile-') ? null : pkg.profileId || null,
      title: pkg.title || pkg.note || carrierLabel(pkg.carrier) || 'Balík',
      carrier: pkg.carrier || 'other',
      tracking_number: pkg.tracking || '',
      tracking_url: pkg.url || null,
      status: parcelStatusToCloud(pkg.status),
      expected_date: pkg.expectedDate || null,
      pickup_place: pkg.pickupPlace || null,
      note: pkg.note || null,
      source: pkg.source || 'manual',
      created_by: pkg.cloudId ? undefined : userId,
      updated_by: userId
    };
  }

  async function cloudAddParcel(pkg) {
    const client = getSupabaseClient();
    if (!client || !state.cloud?.householdId) return null;
    const user = await refreshCloudSession(false);
    if (!user) return null;
    const { data, error } = await client.from('parcels').insert(cloudParcelPayload(pkg, user.id)).select('id').single();
    if (error) {
      showToast(error.message || 'Balík se nepovedlo uložit do cloudu');
      return null;
    }
    state.cloud.lastSyncAt = new Date().toISOString();
    return data;
  }

  async function cloudUpdateParcel(pkg) {
    const client = getSupabaseClient();
    if (!client || !pkg?.cloudId || !state.cloud?.householdId) return true;
    const user = await refreshCloudSession(false);
    if (!user) return false;
    const payload = cloudParcelPayload(pkg, user.id);
    delete payload.created_by;
    const { error } = await client.from('parcels').update(payload).eq('id', pkg.cloudId).eq('household_id', state.cloud.householdId);
    if (error) {
      showToast(error.message || 'Balík se nepovedlo upravit v cloudu');
      return false;
    }
    state.cloud.lastSyncAt = new Date().toISOString();
    return true;
  }

  async function cloudDeleteParcel(pkg) {
    const client = getSupabaseClient();
    if (!client || !pkg?.cloudId || !state.cloud?.householdId) return true;
    const { error } = await client.from('parcels').delete().eq('id', pkg.cloudId).eq('household_id', state.cloud.householdId);
    if (error) {
      showToast(error.message || 'Cloud balík se nepovedlo smazat');
      return false;
    }
    state.cloud.lastSyncAt = new Date().toISOString();
    return true;
  }

  async function cloudLoadParcels(showMessage = true) {
    const client = getSupabaseClient();
    if (!client || !state.cloud?.householdId) {
      if (showMessage) showToast('Nejdřív napoj domácnost na cloud');
      return;
    }
    const { data, error } = await client
      .from('parcels')
      .select('id,title,carrier,tracking_number,tracking_url,status,expected_date,pickup_place,note,created_at')
      .eq('household_id', state.cloud.householdId)
      .order('created_at', { ascending: false });
    if (error) {
      showToast(error.message || 'Balíky se nepovedlo načíst');
      return;
    }
    const localOnly = state.packages.filter((pkg) => !pkg.cloudId);
    const cloudItems = (data || []).map((item) => ({
      id: state.packages.find((pkg) => pkg.cloudId === item.id)?.id || `parcel-cloud-${item.id}`,
      cloudId: item.id,
      householdId: currentHouseholdId(),
      profileId: currentProfileId(),
      createdAt: item.created_at || new Date().toISOString(),
      title: item.title || '',
      carrier: item.carrier || 'other',
      tracking: item.tracking_number || '',
      url: item.tracking_url || '',
      status: parcelStatusFromCloud(item.status),
      expectedDate: item.expected_date || '',
      pickupPlace: item.pickup_place || '',
      note: item.note || ''
    }));
    state.packages = [...localOnly, ...cloudItems];
    state.parcelsCloud = { ...(state.parcelsCloud || {}), loadedAt: new Date().toISOString() };
    state.cloud.lastSyncAt = new Date().toISOString();
    touchState();
    saveState();
    render();
    if (showMessage) showToast(`Načteno balíků: ${cloudItems.length}`);
  }

  async function cloudSyncParcelById(id) {
    const pkg = state.packages.find((item) => item.id === id);
    if (!pkg) return;
    const saved = pkg.cloudId ? await cloudUpdateParcel(pkg) : await cloudAddParcel(pkg);
    if (saved?.id) pkg.cloudId = saved.id;
    touchState();
    saveState();
    render();
    showToast(pkg.cloudId ? 'Balík uložen do cloudu' : 'Balík se nepovedlo odeslat');
  }

  async function cloudSyncLocalParcels() {
    const local = state.packages.filter((pkg) => !pkg.cloudId);
    let synced = 0;
    for (const pkg of local) {
      const saved = await cloudAddParcel(pkg);
      if (saved?.id) {
        pkg.cloudId = saved.id;
        synced += 1;
      }
    }
    touchState();
    saveState();
    render();
    showToast(synced ? `Odesláno balíků: ${synced}` : 'Žádný balík se nepovedlo odeslat');
  }

  async function addPackageFromForm(data, form) {
    const item = {
      id: uid(),
      householdId: currentHouseholdId(),
      profileId: currentProfileId(),
      createdAt: new Date().toISOString(),
      title: normalizeText(data.title) || normalizeText(data.note) || carrierLabel(data.carrier),
      carrier: data.carrier || 'other',
      tracking: normalizeText(data.tracking),
      status: data.status || 'new',
      url: normalizeText(data.url),
      expectedDate: normalizeText(data.expectedDate),
      pickupPlace: normalizeText(data.pickupPlace),
      note: normalizeText(data.note),
      source: 'manual'
    };
    const saved = await cloudAddParcel(item);
    if (saved?.id) item.cloudId = saved.id;
    state.packages.push(item);
    touchState();
    saveState();
    form?.reset();
    render();
    showToast(item.cloudId ? 'Balík uložen do cloudu' : 'Balík uložen lokálně');
  }

  async function deletePackage(id) {
    const item = state.packages.find((pkg) => pkg.id === id);
    if (!item) return;
    const ok = await cloudDeleteParcel(item);
    if (!ok) return;
    state.packages = state.packages.filter((pkg) => pkg.id !== id);
    touchState();
    saveState();
    render();
    showToast('Balík smazán');
  }

  function cloudHdoDaysToDb(days) {
    const list = Array.isArray(days) ? days : [];
    return list.map((day) => Number(day) === 0 ? 7 : Number(day)).filter((day) => day >= 1 && day <= 7);
  }

  function cloudHdoDaysFromDb(days) {
    const list = Array.isArray(days) ? days : [];
    return list.map((day) => Number(day) === 7 ? 0 : Number(day)).filter((day) => day >= 0 && day <= 6);
  }

  async function ensureCloudHdoSetting() {
    const client = getSupabaseClient();
    if (!client || !state.cloud?.householdId) return null;
    const user = await refreshCloudSession(false);
    if (!user) return null;
    if (state.hdoCloud?.settingId) return state.hdoCloud.settingId;
    const payload = {
      household_id: state.cloud.householdId,
      title: 'HDO / nízký tarif',
      created_by: user.id,
      updated_by: user.id
    };
    const { data, error } = await client
      .from('hdo_settings')
      .upsert(payload, { onConflict: 'household_id' })
      .select('id')
      .single();
    if (error) {
      showToast(error.message || 'Nastavení HDO se nepovedlo založit v cloudu');
      return null;
    }
    state.hdoCloud = { ...(state.hdoCloud || {}), settingId: data.id, loadedAt: new Date().toISOString() };
    return data.id;
  }

  function cloudHdoPayload(item, settingId, userId) {
    return {
      household_id: state.cloud.householdId,
      setting_id: settingId,
      label: item.label || null,
      days: cloudHdoDaysToDb(item.days),
      start_time: item.start || '00:00',
      end_time: item.end || '00:00',
      is_enabled: item.enabled !== false,
      source: 'manual',
      created_by: item.cloudId ? undefined : userId,
      updated_by: userId
    };
  }

  async function cloudAddHdoWindow(item) {
    const client = getSupabaseClient();
    if (!client || !state.cloud?.householdId) return null;
    const user = await refreshCloudSession(false);
    if (!user) return null;
    const settingId = await ensureCloudHdoSetting();
    if (!settingId) return null;
    const payload = cloudHdoPayload(item, settingId, user.id);
    const { data, error } = await client.from('hdo_windows').insert(payload).select('id').single();
    if (error) {
      showToast(error.message || 'HDO okno se nepovedlo uložit do cloudu');
      return null;
    }
    state.cloud.lastSyncAt = new Date().toISOString();
    return data;
  }

  async function cloudUpdateHdoWindow(item) {
    const client = getSupabaseClient();
    if (!client || !item?.cloudId || !state.cloud?.householdId) return true;
    const user = await refreshCloudSession(false);
    if (!user) return false;
    const settingId = await ensureCloudHdoSetting();
    if (!settingId) return false;
    const payload = cloudHdoPayload(item, settingId, user.id);
    delete payload.created_by;
    const { error } = await client.from('hdo_windows').update(payload).eq('id', item.cloudId).eq('household_id', state.cloud.householdId);
    if (error) {
      showToast(error.message || 'HDO okno se nepovedlo aktualizovat v cloudu');
      return false;
    }
    state.cloud.lastSyncAt = new Date().toISOString();
    return true;
  }

  async function cloudDeleteHdoWindow(item) {
    const client = getSupabaseClient();
    if (!client || !item?.cloudId || !state.cloud?.householdId) return true;
    const { error } = await client.from('hdo_windows').delete().eq('id', item.cloudId).eq('household_id', state.cloud.householdId);
    if (error) {
      showToast(error.message || 'HDO okno se nepovedlo smazat z cloudu');
      return false;
    }
    state.cloud.lastSyncAt = new Date().toISOString();
    return true;
  }

  async function cloudLoadHdoData(showMessage = true) {
    const client = getSupabaseClient();
    if (!client || !state.cloud?.householdId) {
      if (showMessage) showToast('Nejdřív napoj domácnost na cloud');
      return;
    }
    const { data: settings, error: settingsError } = await client
      .from('hdo_settings')
      .select('id,title')
      .eq('household_id', state.cloud.householdId)
      .maybeSingle();
    if (settingsError) {
      showToast(settingsError.message || 'HDO nastavení se nepovedlo načíst');
      return;
    }
    if (settings?.id) state.hdoCloud = { ...(state.hdoCloud || {}), settingId: settings.id, loadedAt: new Date().toISOString() };
    const { data, error } = await client
      .from('hdo_windows')
      .select('id,label,days,start_time,end_time,is_enabled')
      .eq('household_id', state.cloud.householdId)
      .order('start_time', { ascending: true });
    if (error) {
      showToast(error.message || 'HDO okna se nepovedlo načíst');
      return;
    }
    const localOnly = state.hdoWindows.filter((item) => !item.cloudId);
    const cloudItems = (data || []).map((item) => ({
      id: `hdo-cloud-${item.id}`,
      cloudId: item.id,
      householdId: state.household.id,
      profileId: currentProfileId(),
      label: item.label || 'HDO okno',
      start: String(item.start_time || '').slice(0, 5),
      end: String(item.end_time || '').slice(0, 5),
      days: cloudHdoDaysFromDb(item.days),
      enabled: item.is_enabled !== false,
      createdAt: new Date().toISOString()
    }));
    state.hdoWindows = [...cloudItems, ...localOnly];
    state.cloud.lastSyncAt = new Date().toISOString();
    touchState();
    saveState();
    render();
    if (showMessage) showToast(`Načteno HDO oken: ${cloudItems.length}`);
  }

  async function cloudSyncHdoById(id) {
    const item = state.hdoWindows.find((entry) => entry.id === id);
    if (!item) return;
    const saved = item.cloudId ? await cloudUpdateHdoWindow(item) : await cloudAddHdoWindow(item);
    if (saved?.id) item.cloudId = saved.id;
    touchState();
    saveState();
    render();
    showToast(item.cloudId ? 'HDO uloženo do cloudu' : 'HDO se nepovedlo odeslat');
  }

  async function cloudSyncLocalHdo() {
    const local = state.hdoWindows.filter((item) => !item.cloudId);
    let synced = 0;
    for (const item of local) {
      const saved = await cloudAddHdoWindow(item);
      if (saved?.id) {
        item.cloudId = saved.id;
        synced += 1;
      }
    }
    touchState();
    saveState();
    render();
    showToast(synced ? `Odesláno HDO oken: ${synced}` : 'Žádné HDO se nepovedlo odeslat');
  }

  async function addHdoWindowFromForm(data, form) {
    const item = {
      id: uid(),
      householdId: currentHouseholdId(),
      profileId: currentProfileId(),
      createdAt: new Date().toISOString(),
      label: normalizeText(data.label),
      start: normalizeText(data.start),
      end: normalizeText(data.end),
      days: daysModeToArray(data.daysMode),
      enabled: true
    };
    const saved = await cloudAddHdoWindow(item);
    if (saved?.id) item.cloudId = saved.id;
    state.hdoWindows.push(item);
    touchState();
    saveState();
    form?.reset();
    render();
    showToast(item.cloudId ? 'HDO okno uloženo do cloudu' : 'HDO okno uloženo lokálně');
  }

  async function toggleHdoWindow(id) {
    const item = state.hdoWindows.find((entry) => entry.id === id);
    if (!item) return;
    item.enabled = !item.enabled;
    const ok = await cloudUpdateHdoWindow(item);
    if (!ok) {
      item.enabled = !item.enabled;
      return;
    }
    touchState();
    saveState();
    render();
  }

  async function deleteHdoWindow(id) {
    const item = state.hdoWindows.find((entry) => entry.id === id);
    if (!item) return;
    const ok = await cloudDeleteHdoWindow(item);
    if (!ok) return;
    state.hdoWindows = state.hdoWindows.filter((entry) => entry.id !== id);
    touchState();
    saveState();
    render();
    showToast('HDO okno smazáno');
  }


  function wasteRepeatLabel(value) {
    return ({ none: 'jednorázově', weekly: 'týdně', biweekly: 'každé 2 týdny', monthly: 'měsíčně', custom: 'vlastní opakování' })[value || 'none'] || 'jednorázově';
  }

  function cloudWastePayload(item, userId) {
    return {
      household_id: state.cloud.householdId,
      title: item.type || 'Svoz odpadu',
      pickup_date: item.date || todayISO(),
      repeat_rule: item.repeatRule || 'none',
      repeat_interval: item.repeatRule === 'biweekly' ? 2 : 1,
      notify_before_hours: item.notifyBeforeHours === '' || item.notifyBeforeHours === undefined ? 12 : Number(item.notifyBeforeHours),
      is_enabled: item.enabled !== false,
      note: item.note || null,
      created_by: item.cloudId ? undefined : userId,
      updated_by: userId
    };
  }

  async function cloudAddWaste(item) {
    const client = getSupabaseClient();
    if (!client || !state.cloud?.householdId) return null;
    const user = await refreshCloudSession(false);
    if (!user) return null;
    const payload = cloudWastePayload(item, user.id);
    const { data, error } = await client.from('waste_schedules').insert(payload).select('id').single();
    if (error) {
      showToast(error.message || 'Svoz se nepovedlo uložit do cloudu');
      return null;
    }
    state.cloud.lastSyncAt = new Date().toISOString();
    return data;
  }

  async function cloudUpdateWaste(item) {
    const client = getSupabaseClient();
    if (!client || !item?.cloudId || !state.cloud?.householdId) return true;
    const user = await refreshCloudSession(false);
    if (!user) return false;
    const payload = cloudWastePayload(item, user.id);
    delete payload.created_by;
    const { error } = await client.from('waste_schedules').update(payload).eq('id', item.cloudId).eq('household_id', state.cloud.householdId);
    if (error) {
      showToast(error.message || 'Svoz se nepovedlo upravit v cloudu');
      return false;
    }
    state.cloud.lastSyncAt = new Date().toISOString();
    return true;
  }

  async function cloudDeleteWaste(item) {
    const client = getSupabaseClient();
    if (!client || !item?.cloudId || !state.cloud?.householdId) return true;
    const { error } = await client.from('waste_schedules').delete().eq('id', item.cloudId).eq('household_id', state.cloud.householdId);
    if (error) {
      showToast(error.message || 'Svoz se nepovedlo smazat z cloudu');
      return false;
    }
    state.cloud.lastSyncAt = new Date().toISOString();
    return true;
  }

  async function cloudLoadWaste(showMessage = true) {
    const client = getSupabaseClient();
    if (!client || !state.cloud?.householdId) {
      if (showMessage) showToast('Nejdřív napoj domácnost na cloud');
      return;
    }
    const { data, error } = await client
      .from('waste_schedules')
      .select('id,title,pickup_date,repeat_rule,notify_before_hours,is_enabled,note')
      .eq('household_id', state.cloud.householdId)
      .order('pickup_date', { ascending: true });
    if (error) {
      showToast(error.message || 'Svoz odpadu se nepovedlo načíst');
      return;
    }
    const localOnly = state.waste.filter((item) => !item.cloudId);
    const cloudItems = (data || []).map((item) => ({
      id: state.waste.find((entry) => entry.cloudId === item.id)?.id || `waste-cloud-${item.id}`,
      cloudId: item.id,
      householdId: currentHouseholdId(),
      profileId: currentProfileId(),
      createdAt: new Date().toISOString(),
      type: item.title || 'Svoz odpadu',
      date: item.pickup_date || '',
      repeatRule: item.repeat_rule || 'none',
      notifyBeforeHours: item.notify_before_hours ?? 12,
      enabled: item.is_enabled !== false,
      note: item.note || ''
    }));
    state.waste = [...cloudItems, ...localOnly];
    state.cloud.lastSyncAt = new Date().toISOString();
    touchState();
    saveState();
    render();
    if (showMessage) showToast(`Načteno svozů: ${cloudItems.length}`);
  }

  async function cloudSyncWasteById(id) {
    const item = state.waste.find((entry) => entry.id === id);
    if (!item) return;
    const saved = item.cloudId ? await cloudUpdateWaste(item) : await cloudAddWaste(item);
    if (saved?.id) item.cloudId = saved.id;
    touchState();
    saveState();
    render();
    showToast(item.cloudId ? 'Svoz uložen do cloudu' : 'Svoz se nepovedlo odeslat');
  }

  async function cloudSyncLocalWaste() {
    const local = state.waste.filter((item) => !item.cloudId);
    let synced = 0;
    for (const item of local) {
      const saved = await cloudAddWaste(item);
      if (saved?.id) {
        item.cloudId = saved.id;
        synced += 1;
      }
    }
    touchState();
    saveState();
    render();
    showToast(synced ? `Odesláno svozů: ${synced}` : 'Žádný svoz se nepovedlo odeslat');
  }

  async function addWasteFromForm(data, form) {
    const item = {
      id: uid(),
      householdId: currentHouseholdId(),
      profileId: currentProfileId(),
      createdAt: new Date().toISOString(),
      type: normalizeText(data.type),
      date: normalizeText(data.date),
      repeatRule: data.repeatRule || 'none',
      notifyBeforeHours: data.notifyBeforeHours === '' || data.notifyBeforeHours === undefined ? 12 : Number(data.notifyBeforeHours),
      enabled: true,
      note: normalizeText(data.note)
    };
    const saved = await cloudAddWaste(item);
    if (saved?.id) item.cloudId = saved.id;
    state.waste.push(item);
    touchState();
    saveState();
    form?.reset();
    render();
    showToast(item.cloudId ? 'Svoz uložen do cloudu' : 'Svoz uložen lokálně');
  }

  async function deleteWaste(id) {
    const item = state.waste.find((entry) => entry.id === id);
    if (!item) return;
    const ok = await cloudDeleteWaste(item);
    if (!ok) return;
    state.waste = state.waste.filter((entry) => entry.id !== id);
    touchState();
    saveState();
    render();
    showToast('Svoz smazán');
  }

  async function toggleShoppingDone(id) {
    const item = state.shopping.find((entry) => entry.id === id);
    if (!item) return;
    item.done = !item.done;
    item.doneAt = item.done ? new Date().toISOString() : '';
    const ok = await cloudUpdateShoppingItem(item);
    if (!ok) {
      item.done = !item.done;
      item.doneAt = item.done ? item.doneAt : '';
      return;
    }
    touchState();
    saveState();
    render();
  }

  async function deleteShoppingItem(id) {
    const item = state.shopping.find((entry) => entry.id === id);
    if (!item) return;
    const ok = await cloudDeleteShoppingItem(item);
    if (!ok) return;
    state.shopping = state.shopping.filter((entry) => entry.id !== id);
    touchState();
    saveState();
    render();
    showToast('Smazáno');
  }

  async function handleForm(form) {
    const type = form.dataset.form;
    const data = getFormData(form);
    const handlers = {
      'add-event': () => addItem('calendar', { title: data.title, date: data.date, time: data.time, endTime: data.endTime, type: data.type, note: data.note }),
      'add-package': () => addPackageFromForm(data, form),
      'add-shopping': () => addShoppingFromForm(data, form),
      'add-coupon': () => addItem('coupons', { store: data.store, code: data.code, discount: data.discount, expiry: data.expiry, note: data.note, used: false }),
      'add-hdo': () => addHdoWindowFromForm(data, form),
      'add-waste': () => addWasteFromForm(data, form),
      'add-task': () => addItem('homeTasks', { title: data.title, due: data.due, note: data.note, done: false }),
      'add-note': () => addItem('notes', { text: data.text, createdAt: new Date().toISOString() }),
      'add-device': () => addItem('devices', { name: data.name, type: data.type, address: data.address, note: data.note }),
      'add-vehicle': async () => {
        const vehicle = {
          id: uid(),
          householdId: currentHouseholdId(),
          profileId: currentProfileId(),
          createdAt: new Date().toISOString(),
          name: normalizeText(data.name),
          plate: normalizeText(data.plate),
          fuelType: normalizeText(data.fuelType),
          odometer: normalizeText(data.odometer),
          technicalInspectionUntil: normalizeText(data.technicalInspectionUntil),
          insuranceUntil: normalizeText(data.insuranceUntil),
          nextServiceKm: '',
          nextServiceDate: '',
          note: ''
        };
        const cloudVehicle = await cloudAddVehicle(vehicle);
        if (cloudVehicle?.id) vehicle.cloudId = cloudVehicle.id;
        state.vehicles.push(vehicle);
        garageVehicleId = vehicle.id;
        touchState();
        saveState();
        form.reset();
        render();
        showToast(vehicle.cloudId ? 'Auto uloženo do cloudu' : 'Auto uloženo lokálně');
      },
      'update-vehicle': () => updateVehicle(form.dataset.vehicleId, data),
      'add-fuel': async () => {
        const item = { id: uid(), householdId: currentHouseholdId(), profileId: currentProfileId(), createdAt: new Date().toISOString(), vehicleId: form.dataset.vehicleId, date: data.date, odometer: data.odometer, liters: decimalValue(data.liters), price: decimalValue(data.price), note: data.note };
        const saved = await cloudAddFuelLog(item);
        if (saved?.id) item.cloudId = saved.id;
        state.fuel.push(item);
        touchState();
        saveState();
        form.reset();
        render();
        showToast(item.cloudId ? 'Tankování uloženo do cloudu' : 'Tankování uloženo lokálně');
      },
      'add-service': async () => {
        const item = { id: uid(), householdId: currentHouseholdId(), profileId: currentProfileId(), createdAt: new Date().toISOString(), vehicleId: form.dataset.vehicleId, date: data.date, title: data.title, price: decimalValue(data.price), note: data.note };
        const saved = await cloudAddServiceLog(item);
        if (saved?.id) item.cloudId = saved.id;
        state.services.push(item);
        touchState();
        saveState();
        form.reset();
        render();
        showToast(item.cloudId ? 'Servis uložen do cloudu' : 'Servis uložen lokálně');
      },
      'update-fuel': async () => updateFuelLog(form.dataset.id, data),
      'update-service': async () => updateServiceLog(form.dataset.id, data),
      'add-contract': async () => {
        const contract = {
          id: uid(),
          householdId: currentHouseholdId(),
          profileId: currentProfileId(),
          createdAt: new Date().toISOString(),
          name: normalizeText(data.name),
          type: normalizeText(data.type),
          provider: normalizeText(data.provider),
          number: normalizeText(data.number),
          validFrom: normalizeText(data.validFrom),
          validTo: normalizeText(data.validTo),
          amount: decimalValue(data.amount),
          frequency: data.frequency,
          note: normalizeText(data.note)
        };
        const cloudContract = await cloudAddContract(contract);
        if (cloudContract?.id) contract.cloudId = cloudContract.id;
        state.contracts.push(contract);
        activeContractId = contract.id;
        touchState();
        saveState();
        form.reset();
        render();
        showToast(contract.cloudId ? 'Smlouva uložena do cloudu' : 'Smlouva uložena lokálně');
      },
      'update-contract': async () => updateContract(form.dataset.contractId, data, form),
      'add-contract-file': () => addContractFiles(form),
      'fuelio-preview': () => previewFuelioImport(form),
      'add-camera': () => addItem('cameras', { name: data.name, location: data.location, snapshotUrl: data.snapshotUrl, status: data.status, note: data.note }),
      onboarding: () => completeOnboarding(data),
      'household-settings': () => {
        state.household.name = normalizeText(data.householdName) || 'Domácnost';
        state.settings.theme = data.theme === 'dark' ? 'dark' : 'light';
        state.settings.dashboardNote = normalizeText(data.dashboardNote);
        touchState();
        saveState();
        render();
        showToast('Domácnost uložena');
      },
      settings: () => {
        state.household.name = normalizeText(data.householdName) || 'Domácnost';
        state.settings.theme = data.theme === 'dark' ? 'dark' : 'light';
        state.settings.dashboardNote = normalizeText(data.dashboardNote);
        touchState();
        saveState();
        render();
        showToast('Nastavení uloženo');
      },
      'add-profile': () => addProfile(data.name, data.role),
      'import-data': () => importData(data.json),
      'cloud-login': () => cloudLogin(data.email, data.password),
      'cloud-signup': () => cloudSignUp(data.email, data.password)
    };
    const handler = handlers[type];
    if (handler) await handler();
  }

  function completeOnboarding(data) {
    const householdId = `household-${uid()}`;
    const names = [data.profilePrimary, data.profileSecondary]
      .map(normalizeText)
      .filter(Boolean);
    if (!names.length) names.push('Já');

    state.household = {
      id: householdId,
      name: normalizeText(data.householdName) || 'Moje domácnost',
      isConfigured: true,
      createdAt: new Date().toISOString()
    };
    state.profiles = names.map((name, index) => createProfile(name, index === 0 ? 'owner' : 'member', householdId));
    state.activeProfileId = state.profiles[0]?.id || '';
    state.enabledModules = normalizeModuleList(data.modules);
    state.settings.dashboardNote = DEFAULT_STATE.settings.dashboardNote;
    state.settings.bottomNavIds = normalizeBottomNavIds(DEFAULT_BOTTOM_NAV_IDS, state.enabledModules);
    activeModule = 'home';
    touchState();
    saveState();
    render();
    showToast('Domácnost vytvořena');
  }

  function addProfile(name, role = 'member') {
    const cleanName = normalizeText(name);
    if (!cleanName) return;
    const profile = createProfile(cleanName, role === 'owner' ? 'owner' : 'member', currentHouseholdId());
    state.profiles.push(profile);
    state.activeProfileId = profile.id;
    touchState();
    saveState();
    render();
    showToast('Profil přidán');
  }

  function touchState() {
    state.meta = { ...(state.meta || {}), schemaVersion: 21, appBuild: 22, mode: 'pwa-cloud-parcels', updatedAt: new Date().toISOString() };
  }

  function addItem(collection, item) {
    const normalized = Object.fromEntries(Object.entries(item).map(([key, value]) => [key, typeof value === 'string' ? normalizeText(value) : value]));
    if (!state[collection]) state[collection] = [];
    state[collection].push({
      id: uid(),
      householdId: currentHouseholdId(),
      profileId: currentProfileId(),
      createdAt: new Date().toISOString(),
      ...normalized
    });
    touchState();
    saveState();
    render();
    showToast('Uloženo');
  }

  async function updateContract(id, data, form) {
    const contract = state.contracts.find((item) => item.id === id);
    if (!contract) return showToast('Smlouva nenalezena');
    contract.name = normalizeText(data.name) || contract.name;
    contract.type = normalizeText(data.type) || 'other';
    contract.provider = normalizeText(data.provider);
    contract.number = normalizeText(data.number);
    contract.validFrom = normalizeText(data.validFrom);
    contract.validTo = normalizeText(data.validTo);
    contract.amount = decimalValue(data.amount);
    contract.frequency = data.frequency || 'monthly';
    contract.note = normalizeText(data.note);
    contract.updatedAt = new Date().toISOString();
    const ok = await cloudUpdateContract(contract);
    if (!ok) return;
    touchState();
    saveState();
    render();
    showToast(contract.cloudId ? 'Smlouva upravena v cloudu' : 'Smlouva upravena lokálně');
  }

  function decimalValue(value) {
    if (value === undefined || value === null || value === '') return '';
    const parsed = Number(String(value).replace(',', '.'));
    return Number.isFinite(parsed) ? parsed : '';
  }

  function daysModeToArray(mode) {
    if (mode === 'workdays') return [1, 2, 3, 4, 5];
    if (mode === 'weekend') return [6, 0];
    return [1, 2, 3, 4, 5, 6, 0];
  }

  function handleAction(button) {
    const action = button.dataset.action;
    if (action === 'toggle-theme') {
      state.settings.theme = state.settings.theme === 'dark' ? 'light' : 'dark';
      saveState();
      render();
      return;
    }
    if (action === 'delete') {
      if (button.dataset.collection === 'shopping') {
        deleteShoppingItem(button.dataset.id);
        return;
      }
      deleteItem(button.dataset.collection, button.dataset.id);
      return;
    }
    if (action === 'toggle-done') {
      if (button.dataset.collection === 'shopping') {
        toggleShoppingDone(button.dataset.id);
        return;
      }
      toggleBoolean(button.dataset.collection, button.dataset.id, 'done');
      return;
    }
    if (action === 'toggle-enabled') {
      toggleBoolean(button.dataset.collection, button.dataset.id, 'enabled');
      return;
    }
    if (action === 'toggle-hdo') {
      toggleHdoWindow(button.dataset.id);
      return;
    }
    if (action === 'delete-hdo') {
      deleteHdoWindow(button.dataset.id);
      return;
    }
    if (action === 'toggle-used') {
      toggleBoolean('coupons', button.dataset.id, 'used');
      return;
    }
    if (action === 'copy') {
      copyText(button.dataset.value || '');
      return;
    }
    if (action === 'package-status') {
      const pkg = state.packages.find((item) => item.id === button.dataset.id);
      if (pkg) {
        pkg.status = button.dataset.status;
        cloudUpdateParcel(pkg).then(() => {
          touchState();
          saveState();
          render();
        });
      }
      return;
    }
    if (action === 'cloud-load-parcels') {
      cloudLoadParcels(true);
      return;
    }
    if (action === 'cloud-sync-local-parcels') {
      cloudSyncLocalParcels();
      return;
    }
    if (action === 'cloud-sync-parcel') {
      cloudSyncParcelById(button.dataset.id);
      return;
    }
    if (action === 'delete-package') {
      deletePackage(button.dataset.id);
      return;
    }
    if (action === 'set-profile') {
      setActiveProfile(button.dataset.id);
      return;
    }
    if (action === 'delete-profile') {
      deleteProfile(button.dataset.id);
      return;
    }
    if (action === 'toggle-module') {
      toggleModule(button.dataset.id);
      return;
    }
    if (action === 'toggle-bottom-nav') {
      toggleBottomNav(button.dataset.id);
      return;
    }
    if (action === 'select-vehicle') {
      garageVehicleId = button.dataset.id;
      render();
      return;
    }
    if (action === 'select-contract') {
      activeContractId = button.dataset.id;
      render();
      return;
    }
    if (action === 'open-contract-file') {
      openOrDownloadContractFile(button.dataset.id, true);
      return;
    }
    if (action === 'download-contract-file') {
      openOrDownloadContractFile(button.dataset.id, false);
      return;
    }
    if (action === 'delete-contract-file') {
      deleteContractFile(button.dataset.id);
      return;
    }
    if (action === 'cloud-load-contract-files') {
      cloudLoadContractFiles(true);
      return;
    }
    if (action === 'confirm-fuelio-import') {
      confirmFuelioImport({ syncCloud: false });
      return;
    }
    if (action === 'confirm-fuelio-import-cloud') {
      confirmFuelioImport({ syncCloud: true });
      return;
    }
    if (action === 'edit-garage-record') {
      const current = garageEditRecord;
      const next = { collection: button.dataset.collection, id: button.dataset.id };
      garageEditRecord = current?.collection === next.collection && current?.id === next.id ? null : next;
      render();
      return;
    }
    if (action === 'cancel-garage-edit') {
      garageEditRecord = null;
      render();
      return;
    }
    if (action === 'clear-fuelio-preview') {
      fuelioPreview = null;
      render();
      showToast('Náhled zrušen');
      return;
    }
    if (action === 'delete-vehicle') {
      deleteVehicle(button.dataset.id);
      return;
    }
    if (action === 'cloud-bootstrap') {
      bootstrapCloudHousehold();
      return;
    }
    if (action === 'cloud-load-shopping') {
      cloudLoadShoppingData(true);
      return;
    }
    if (action === 'quick-add-shopping') {
      quickAddShoppingByName(button.dataset.name || '');
      return;
    }
    if (action === 'cloud-sync-local-shopping') {
      cloudSyncLocalShoppingItems();
      return;
    }
    if (action === 'cloud-load-contracts') {
      cloudLoadContracts(true);
      return;
    }
    if (action === 'cloud-sync-contract') {
      cloudSyncContractById(button.dataset.id);
      return;
    }
    if (action === 'cloud-sync-local-contracts') {
      cloudSyncLocalContracts();
      return;
    }
    if (action === 'cloud-load-garage') {
      cloudLoadGarageData(true);
      return;
    }
    if (action === 'cloud-sync-local-garage') {
      cloudSyncLocalGarage();
      return;
    }
    if (action === 'cloud-load-hdo') {
      cloudLoadHdoData(true);
      return;
    }
    if (action === 'cloud-sync-local-hdo') {
      cloudSyncLocalHdo();
      return;
    }
    if (action === 'cloud-sync-hdo') {
      cloudSyncHdoById(button.dataset.id);
      return;
    }
    if (action === 'cloud-load-waste') {
      cloudLoadWaste(true);
      return;
    }
    if (action === 'cloud-sync-local-waste') {
      cloudSyncLocalWaste();
      return;
    }
    if (action === 'cloud-sync-waste') {
      cloudSyncWasteById(button.dataset.id);
      return;
    }
    if (action === 'delete-waste') {
      deleteWaste(button.dataset.id);
      return;
    }
    if (action === 'cloud-sync-vehicle') {
      const vehicle = state.vehicles.find((item) => item.id === button.dataset.id);
      if (!vehicle) return;
      ensureCloudVehicle(vehicle).then(() => cloudUpdateVehicle(vehicle)).then((ok) => {
        if (!ok) return;
        touchState();
        saveState();
        render();
        showToast('Auto odesláno do cloudu');
      });
      return;
    }
    if (action === 'pwa-install') {
      promptInstallApp();
      return;
    }
    if (action === 'pwa-check-update') {
      checkForAppUpdate(true);
      return;
    }
    if (action === 'pwa-apply-update') {
      applyAppUpdate();
      return;
    }
    if (action === 'cloud-refresh-session') {
      refreshCloudSession(true);
      return;
    }
    if (action === 'cloud-logout') {
      cloudLogout();
      return;
    }
    if (action === 'export-data') {
      exportData();
      return;
    }
    if (action === 'reset-data') {
      resetData();
    }
  }



  async function promptInstallApp() {
    if (!deferredInstallPrompt) {
      showToast('Instalace se teď nabízí přes menu prohlížeče');
      return;
    }
    deferredInstallPrompt.prompt();
    try {
      const choice = await deferredInstallPrompt.userChoice;
      if (choice?.outcome === 'accepted') {
        state.pwa = { ...(state.pwa || {}), installed: true, lastInstallPrompt: new Date().toISOString() };
        saveState();
        showToast('Instalace potvrzena');
      }
    } catch {
      showToast('Instalaci se nepovedlo spustit');
    }
    deferredInstallPrompt = null;
    render();
  }

  async function checkForAppUpdate(showMessage = false) {
    if (!serviceWorkerRegistration) {
      if (showMessage) showToast('Service worker zatím není připravený');
      return;
    }
    try {
      await serviceWorkerRegistration.update();
      state.pwa = { ...(state.pwa || {}), lastUpdateCheck: new Date().toISOString() };
      saveState();
      if (showMessage) showToast(pwaUpdateAvailable ? 'Je dostupná nová verze' : 'Update zkontrolován');
      render();
    } catch {
      if (showMessage) showToast('Update se nepovedlo zkontrolovat');
    }
  }

  function markUpdateAvailable(worker) {
    pendingServiceWorker = worker || pendingServiceWorker;
    pwaUpdateAvailable = true;
    render();
    showToast('Je dostupná nová verze aplikace');
  }

  function applyAppUpdate() {
    if (pendingServiceWorker) {
      pendingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
      showToast('Aktualizuji aplikaci');
      return;
    }
    window.location.reload();
  }

  function setupInstallAndUpdateFlow() {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      deferredInstallPrompt = event;
      state.pwa = { ...(state.pwa || {}), lastInstallPrompt: new Date().toISOString() };
      saveState();
      render();
    });

    window.addEventListener('appinstalled', () => {
      deferredInstallPrompt = null;
      state.pwa = { ...(state.pwa || {}), installed: true };
      saveState();
      showToast('Domácnost+ je nainstalovaná');
      render();
    });
  }

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').then((registration) => {
        serviceWorkerRegistration = registration;
        if (registration.waiting && navigator.serviceWorker.controller) markUpdateAvailable(registration.waiting);
        registration.addEventListener('updatefound', () => {
          const worker = registration.installing;
          if (!worker) return;
          worker.addEventListener('statechange', () => {
            if (worker.state === 'installed' && navigator.serviceWorker.controller) markUpdateAvailable(worker);
          });
        });
      }).catch(() => {});
    });

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }

  async function refreshCloudSession(showMessage = false) {
    const client = getSupabaseClient();
    if (!client) {
      if (showMessage) showToast('Supabase knihovna není načtená');
      return null;
    }
    const { data, error } = await client.auth.getUser();
    if (error || !data?.user) {
      state.cloud = { ...(state.cloud || {}), supabaseUrl: SUPABASE_URL, status: 'offline', userId: '', email: '' };
      saveState();
      if (showMessage) showToast('Nejsi přihlášený');
      render();
      return null;
    }
    state.cloud = {
      ...(state.cloud || {}),
      supabaseUrl: SUPABASE_URL,
      provider: 'supabase',
      status: 'signed-in',
      userId: data.user.id,
      email: data.user.email || ''
    };
    saveState();
    if (showMessage) showToast('Stav účtu obnoven');
    render();
    return data.user;
  }

  async function cloudLogin(email, password) {
    const client = getSupabaseClient();
    if (!client) return showToast('Supabase knihovna není načtená');
    const { data, error } = await client.auth.signInWithPassword({ email: normalizeText(email), password: String(password || '') });
    if (error) return showToast(error.message || 'Přihlášení se nepovedlo');
    const user = data?.user;
    state.cloud = { ...(state.cloud || {}), supabaseUrl: SUPABASE_URL, provider: 'supabase', status: 'signed-in', userId: user?.id || '', email: user?.email || normalizeText(email) };
    saveState();
    render();
    showToast('Přihlášeno');
  }

  async function cloudSignUp(email, password) {
    const client = getSupabaseClient();
    if (!client) return showToast('Supabase knihovna není načtená');
    const { data, error } = await client.auth.signUp({ email: normalizeText(email), password: String(password || '') });
    if (error) return showToast(error.message || 'Registrace se nepovedla');
    const user = data?.user;
    if (user) {
      state.cloud = { ...(state.cloud || {}), supabaseUrl: SUPABASE_URL, provider: 'supabase', status: data.session ? 'signed-in' : 'email-confirmation', userId: user.id, email: user.email || normalizeText(email) };
      saveState();
      render();
    }
    showToast(data.session ? 'Účet vytvořen' : 'Zkontroluj e-mail pro potvrzení');
  }

  async function cloudLogout() {
    const client = getSupabaseClient();
    if (client) await client.auth.signOut();
    state.cloud = { ...(state.cloud || {}), status: 'offline', userId: '', email: '' };
    saveState();
    render();
    showToast('Odhlášeno');
  }

  async function bootstrapCloudHousehold() {
    const client = getSupabaseClient();
    if (!client) return showToast('Supabase knihovna není načtená');
    const user = await refreshCloudSession(false);
    if (!user) return showToast('Nejdřív se přihlas');

    const existingHouseholdId = state.cloud?.householdId;
    let cloudHouseholdId = existingHouseholdId || '';

    if (!cloudHouseholdId) {
      const { data: household, error: householdError } = await client
        .from('households')
        .insert({
          name: householdName(),
          timezone: 'Europe/Prague',
          app_build: 14,
          schema_version: 13,
          created_by: user.id
        })
        .select('id')
        .single();
      if (householdError) return showToast(householdError.message || 'Domácnost se nepovedla vytvořit');
      cloudHouseholdId = household.id;

      const { error: memberError } = await client.from('household_members').insert({
        household_id: cloudHouseholdId,
        user_id: user.id,
        role: 'owner',
        status: 'active',
        display_name: currentProfile()?.name || user.email || 'Owner',
        joined_at: new Date().toISOString()
      });
      if (memberError) return showToast(memberError.message || 'Člen domácnosti se nepovedl vytvořit');
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
        return showToast(profileError.message || 'Profily se nepovedly uložit');
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
    showToast('Domácnost je v cloudu');
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
    link.download = `domacnost-plus-v0-1-18-${todayISO()}.json`; 
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
    const ok = window.confirm('Opravdu smazat všechna offline data Home Web v tomto prohlížeči?');
    if (!ok) return;
    state = migrateState(structuredCloneSafe(DEFAULT_STATE));
    garageVehicleId = null;
    activeModule = 'home';
    localStorage.removeItem(STORAGE_KEY);
    saveState();
    render();
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
    if (action) handleAction(action);
  });

  app.addEventListener('submit', (event) => {
    event.preventDefault();
    handleForm(event.target);
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
})();
