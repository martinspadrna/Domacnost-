(() => {
  'use strict';

  const APP_VERSION = 'Home Web offline v1.0 (909)';
  const STORAGE_KEY = 'homeWebOffline.v1.0.909';
  const LEGACY_STORAGE_KEYS = ['homeWebOffline.v0.9.908', 'homeWebOffline.v0.8.907', 'homeWebOffline.v0.7.906', 'homeWebOffline.v0.6.905', 'homeWebOffline.v0.5.904', 'homeWebOffline.v0.4.903', 'homeWebOffline.v0.3.902', 'homeWebOffline.v0.2.901', 'homeWebOffline.v0.1.900'];

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

  const DEFAULT_BOTTOM_NAV_IDS = ['home', 'calendar', 'shopping', 'homecare'];
  const BOTTOM_NAV_MIN = 3;
  const BOTTOM_NAV_MAX = 5;
  const MORE_MODULE = { id: 'more', label: 'Více', icon: '•••' };
  const FILE_DB_NAME = 'homeWebOfflineFiles.v1';
  const FILE_STORE_CONTRACTS = 'contractFiles';

  const MANAGED_MODULE_IDS = MODULES
    .filter((module) => !['home', 'settings'].includes(module.id))
    .map((module) => module.id);

  const DEFAULT_STATE = {
    meta: {
      schemaVersion: 8,
      appBuild: 909,
      mode: 'offline',
      createdAt: '',
      updatedAt: ''
    },
    settings: {
      theme: 'light',
      dashboardNote: 'Domácí přehled je zatím offline. Každý si nastaví vlastní domácnost, profily a zapnuté moduly.',
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
    homeTasks: [],
    waste: [],
    notes: [],
    devices: [],
    vehicles: [],
    fuel: [],
    services: [],
    contracts: [],
    contractFiles: [],
    cameras: []
  };

  let state = loadState();
  let activeModule = localStorage.getItem('homeWeb.activeModule') || 'home';
  let garageVehicleId = null;
  let activeContractId = null;
  let fuelioPreview = null;
  let toastTimer = null;
  let now = new Date();

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
      schemaVersion: 8,
      appBuild: 909,
      mode: 'offline',
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
    return ['calendar', 'packages', 'coupons', 'hdoWindows', 'shopping', 'homeTasks', 'waste', 'notes', 'devices', 'vehicles', 'fuel', 'services', 'contracts', 'contractFiles', 'cameras'];
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
              <p>${escapeHtml(APP_VERSION)} · ${escapeHtml(currentProfile()?.name || 'bez profilu')} · offline režim</p>
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

        <p class="footer-note">${escapeHtml(APP_VERSION)} · lokální data jsou už uložená ve struktuře household/profiles/module pro pozdější Supabase · zatím bez cloudu</p>
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
      shopping: 'Sdílený nákupní seznam pro domácnost. Offline základ bez přihlašování.',
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
      { title: 'v1.0 (909)', note: 'Hotovo: tabletový domácí dashboard, větší focus karty, časová osa „dnes a brzy“ a lepší přehled pro mobil/tablet.' },
      { title: 'Cloud 1.1', note: 'Další logický krok: založit čistý Vercel + Supabase projekt, Auth, households, profiles a RLS pravidla.' },
      { title: 'Cloud 1.2+', note: 'Migrace offline dat, Supabase Storage pro smlouvy, první synchronizace mezi iPhonem, Xiaomi a budoucím tabletem.' }
    ];
    return `
      <section class="card roadmap-card">
        <div class="card-header"><div><h2>Co mám v plánu dál</h2><p>Offline UX základ je po v1.0 použitelný. Další větší směr už je cloudová kostra.</p></div><span class="badge">roadmap</span></div>
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
    return `
      <div class="grid two">
        <section class="card">
          <div class="card-header"><div><h2>Přidat balík</h2><p>První verze je ruční. Později přidáme rozpoznání z e-mailu/SMS a kontrolu přes backend.</p></div></div>
          <form data-form="add-package">
            <div class="form-grid two">
              ${field('Dopravce', 'carrier', 'text', 'Zásilkovna / PPL / DPD / One')}
              ${field('Číslo zásilky', 'tracking', 'text', 'např. Z123456789', true)}
              ${selectField('Stav', 'status', [['new', 'Nový'], ['transit', 'Na cestě'], ['pickup', 'K vyzvednutí'], ['delivered', 'Doručeno'], ['problem', 'Problém']])}
              ${field('Odkaz na tracking', 'url', 'url', 'volitelné')}
              ${field('Poznámka', 'note', 'text', 'co to je / obchod')}
            </div>
            <div class="form-actions"><button class="primary-btn" type="submit">Přidat balík</button></div>
          </form>
          <div class="inline-note" style="margin-top:12px;">Tip: když zatím neznáš přesný tracking odkaz, nech ho prázdný. Později doplníme automatické odkazy podle dopravce.</div>
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
          <div class="item-title">${escapeHtml(pkg.carrier || 'Balík')}</div>
          <span class="badge ${status.kind}">${escapeHtml(status.label)}</span>
        </div>
        <div class="item-meta">${escapeHtml(pkg.tracking)}${pkg.note ? ` · ${escapeHtml(pkg.note)}` : ''}</div>
        <div class="item-actions">
          <button class="ghost-btn" type="button" data-action="copy" data-value="${escapeHtml(pkg.tracking)}">Kopírovat číslo</button>
          ${pkg.url ? `<a class="ghost-btn" href="${escapeHtml(pkg.url)}" target="_blank" rel="noopener">Tracking</a>` : ''}
          <button class="ghost-btn" type="button" data-action="package-status" data-id="${pkg.id}" data-status="pickup">K vyzvednutí</button>
          <button class="ghost-btn" type="button" data-action="package-status" data-id="${pkg.id}" data-status="delivered">Doručeno</button>
          <button class="danger-btn" type="button" data-action="delete" data-collection="packages" data-id="${pkg.id}">Smazat</button>
        </div>
      </div>
    `;
  }

  function packageStatus(status) {
    const map = {
      new: { label: 'Nový', kind: '' },
      transit: { label: 'Na cestě', kind: '' },
      pickup: { label: 'K vyzvednutí', kind: 'good' },
      delivered: { label: 'Doručeno', kind: 'good' },
      problem: { label: 'Problém', kind: 'bad' }
    };
    return map[status] || map.new;
  }

  function renderShopping() {
    const openItems = state.shopping.filter((item) => !item.done);
    const doneItems = state.shopping.filter((item) => item.done);
    const coupons = [...state.coupons].sort((a, b) => String(a.expiry || '9999').localeCompare(String(b.expiry || '9999')));
    return `
      <div class="grid two">
        <section class="card">
          <div class="card-header"><div><h2>Nákupní seznam</h2><p>Rychlé položky pro domácnost.</p></div></div>
          <form data-form="add-shopping">
            <div class="form-grid two">
              ${field('Položka', 'name', 'text', 'mléko / granule / filtr', true)}
              ${field('Kategorie', 'category', 'text', 'potraviny / drogerie')}
              ${field('Počet', 'amount', 'text', '1 ks')}
              ${field('Poznámka', 'note', 'text', 'volitelné')}
            </div>
            <div class="form-actions"><button class="primary-btn" type="submit">Přidat do seznamu</button></div>
          </form>
          <div style="height:14px"></div>
          ${openItems.length ? `<div class="list">${openItems.map(renderShoppingItem).join('')}</div>` : renderEmpty('Nákupní seznam je prázdný.')}
          ${doneItems.length ? `<div class="card-header" style="margin-top:16px"><div><h3>Hotovo</h3><p>${doneItems.length} položek</p></div></div><div class="list">${doneItems.slice(0, 6).map(renderShoppingItem).join('')}</div>` : ''}
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
    return `
      <div class="item">
        <div class="item-top">
          <div class="item-title">${item.done ? '✓ ' : ''}${escapeHtml(item.name)}</div>
          <span class="badge">${escapeHtml(item.amount || '1 ks')}</span>
        </div>
        <div class="item-meta">${escapeHtml(item.category || 'bez kategorie')}${item.note ? ` · ${escapeHtml(item.note)}` : ''}</div>
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
            <span class="badge ${hdo.active ? 'good' : 'warn'}">${hdo.active ? 'běží' : 'neběží'}</span>
          </div>
          <form data-form="add-hdo">
            <div class="form-grid two">
              ${field('Název okna', 'label', 'text', 'např. Večerní tarif', true)}
              ${field('Od', 'start', 'time', '', true)}
              ${field('Do', 'end', 'time', '', true)}
              ${selectField('Dny', 'daysMode', [['all', 'Každý den'], ['workdays', 'Po–Pá'], ['weekend', 'Víkend']])}
            </div>
            <div class="form-actions"><button class="primary-btn" type="submit">Přidat HDO okno</button></div>
          </form>
          <div style="height:14px"></div>
          ${state.hdoWindows.length ? `<div class="list">${state.hdoWindows.map((item) => `
            <div class="item">
              <div class="item-top"><div class="item-title">${escapeHtml(item.label)}</div><span class="badge ${item.enabled ? 'good' : ''}">${item.enabled ? 'aktivní' : 'vypnuto'}</span></div>
              <div class="item-meta">${escapeHtml(item.start)}–${escapeHtml(item.end)} · ${escapeHtml(daysLabel(item.days))}</div>
              <div class="item-actions"><button class="ghost-btn" type="button" data-action="toggle-enabled" data-collection="hdoWindows" data-id="${item.id}">${item.enabled ? 'Vypnout' : 'Zapnout'}</button><button class="danger-btn" type="button" data-action="delete" data-collection="hdoWindows" data-id="${item.id}">Smazat</button></div>
            </div>
          `).join('')}</div>` : renderEmpty('Zatím není nastavené žádné HDO okno.')}
        </section>

        <section class="card">
          <div class="card-header"><div><h2>Odpad</h2><p>Jednoduchý přehled svozu.</p></div></div>
          <form data-form="add-waste">
            <div class="form-grid two">
              ${field('Typ', 'type', 'text', 'plast / papír / komunál', true)}
              ${field('Datum svozu', 'date', 'date', '', true)}
              ${field('Poznámka', 'note', 'text', 'volitelné')}
            </div>
            <div class="form-actions"><button class="primary-btn" type="submit">Přidat svoz</button></div>
          </form>
          <div style="height:14px"></div>
          ${waste.length ? `<div class="list">${waste.map((item) => `
            <div class="item">
              <div class="item-top"><div class="item-title">${escapeHtml(item.type)}</div><span class="badge ${daysUntil(item.date) <= 1 ? 'warn' : ''}">${formatDate(item.date)}</span></div>
              <div class="item-meta">${item.note ? escapeHtml(item.note) : 'Bez poznámky'}</div>
              <div class="item-actions"><button class="danger-btn" type="button" data-action="delete" data-collection="waste" data-id="${item.id}">Smazat</button></div>
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
          <div class="card-header"><div><h2>Auta</h2><p>Seznam vozidel v domácnosti, termíny a rychlý stav.</p></div></div>
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
          <div class="item-title">${escapeHtml(vehicle.name)}</div>
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
            <button class="primary-btn" type="button" data-action="confirm-fuelio-import">Importovat do Garáže</button>
            <button class="ghost-btn" type="button" data-action="clear-fuelio-preview">Zrušit náhled</button>
          </div>
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
        <span class="badge">${escapeHtml(vehicle.odometer || latestFuel?.odometer || 0)} km</span>
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
            <div class="form-actions"><button class="ghost-btn" type="submit">Uložit údaje auta</button></div>
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
          ${fuelRows.length ? `<div class="list">${[...fuelRows].reverse().slice(0, 8).map((item) => `
            <div class="item"><div class="item-top"><div class="item-title">${formatDate(item.date)}</div><span class="badge">${escapeHtml(item.odometer)} km</span></div><div class="item-meta">${escapeHtml(item.liters || 0)} l · ${formatCurrency(item.price)}${item.note ? ` · ${escapeHtml(item.note)}` : ''}</div><div class="item-actions"><button class="danger-btn" type="button" data-action="delete" data-collection="fuel" data-id="${item.id}">Smazat</button></div></div>
          `).join('')}</div>` : renderEmpty('Zatím žádné tankování.')}
        </div>
        <div>
          <div class="card-header"><div><h3>Servisy</h3><p>${serviceRows.length} záznamů</p></div></div>
          ${serviceRows.length ? `<div class="list">${serviceRows.slice(0, 8).map((item) => `
            <div class="item"><div class="item-top"><div class="item-title">${escapeHtml(item.title)}</div><span class="badge">${formatDate(item.date)}</span></div><div class="item-meta">${formatCurrency(item.price)}${item.note ? ` · ${escapeHtml(item.note)}` : ''}</div><div class="item-actions"><button class="danger-btn" type="button" data-action="delete" data-collection="services" data-id="${item.id}">Smazat</button></div></div>
          `).join('')}</div>` : renderEmpty('Zatím žádný servis.')}
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
          <div class="card-header"><div><h2>Přidat smlouvu / pojistku</h2><p>Základní evidence + lokální přílohy přes IndexedDB.</p></div></div>
          <form data-form="add-contract">
            <div class="form-grid two">
              ${field('Název', 'name', 'text', 'Povinné ručení / internet / elektřina', true)}
              ${field('Typ', 'type', 'text', 'auto / domácnost / energie')}
              ${field('Poskytovatel', 'provider', 'text', 'pojišťovna / dodavatel')}
              ${field('Číslo smlouvy', 'number', 'text', 'volitelné')}
              ${field('Platnost od', 'validFrom', 'date', '')}
              ${field('Platnost do', 'validTo', 'date', '')}
              ${field('Částka', 'amount', 'number', 'např. 1250')}
              ${selectField('Frekvence platby', 'frequency', [['monthly', 'Měsíčně'], ['yearly', 'Ročně'], ['once', 'Jednorázově'], ['other', 'Jiné']])}
              ${field('Poznámka', 'note', 'text', 'volitelné')}
            </div>
            <div class="form-actions"><button class="primary-btn" type="submit">Uložit</button></div>
          </form>
          <div class="inline-note" style="margin-top:12px;">PDF a fotky dokumentů se zatím ukládají jen v tomto prohlížeči. JSON export zatím obsahuje metadata, ne samotné soubory.</div>
        </section>
        <section class="card">
          <div class="card-header"><div><h2>Přehled</h2><p>${contracts.length} položek</p></div></div>
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
          ${escapeHtml(contract.provider || 'Bez poskytovatele')} · ${escapeHtml(contract.type || 'typ neuveden')}${contract.number ? ` · č. ${escapeHtml(contract.number)}` : ''}<br>
          ${contract.validFrom ? `od ${formatDate(contract.validFrom)} · ` : ''}${contract.validTo ? `do ${formatDate(contract.validTo)} · ` : ''}${formatCurrency(contract.amount)} / ${frequencyLabel(contract.frequency)}${contract.note ? ` · ${escapeHtml(contract.note)}` : ''}
        </div>
        <div class="item-actions">
          <button class="ghost-btn" type="button" data-action="select-contract" data-id="${contract.id}">Detail</button>
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
        <div><h2>${escapeHtml(contract.name)}</h2><p>${escapeHtml(contract.provider || 'Bez poskytovatele')} · ${escapeHtml(contract.type || 'typ neuveden')}</p></div>
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
          <form data-form="add-contract-file" data-contract-id="${contract.id}">
            <div class="upload-box">
              <label for="contractFiles">PDF / fotka smlouvy</label>
              <input id="contractFiles" class="input" type="file" name="files" multiple accept="application/pdf,image/*,.pdf">
              <p>Na iPhonu/Androidu můžeš vybrat soubor, fotku z galerie nebo rovnou vyfotit dokument podle nabídky systému.</p>
            </div>
            <div class="form-actions"><button class="primary-btn" type="submit">Přidat přílohu</button></div>
          </form>
        </div>
      </div>
      <div style="height:14px"></div>
      <div class="card-header"><div><h3>Přílohy</h3><p>Uložené lokálně v IndexedDB.</p></div></div>
      ${files.length ? `<div class="file-list">${files.map((file) => `
        <div class="file-row">
          <div>
            <strong>${escapeHtml(file.fileName)}</strong>
            <em>${escapeHtml(file.fileType || 'soubor')} · ${formatBytes(file.size)} · ${formatDate(file.createdAt?.slice(0, 10))}</em>
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

  async function addContractFiles(form) {
    const contractId = form.dataset.contractId;
    const contract = state.contracts.find((item) => item.id === contractId);
    const input = form.querySelector('input[type="file"]');
    const files = [...(input?.files || [])];
    if (!contract || !files.length) {
      showToast('Vyber soubor');
      return;
    }
    if (!('indexedDB' in window)) {
      showToast('Prohlížeč nepodporuje IndexedDB');
      return;
    }
    let added = 0;
    for (const file of files) {
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

  async function openOrDownloadContractFile(id, openInNewTab = false) {
    const meta = state.contractFiles.find((file) => file.id === id);
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

  async function deleteContractFile(id) {
    const ok = window.confirm('Smazat přílohu smlouvy z tohoto zařízení?');
    if (!ok) return;
    state.contractFiles = state.contractFiles.filter((file) => file.id !== id);
    deleteStoredContractFile(id).catch(() => {});
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

  function confirmFuelioImport() {
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

    fuelioPreview.rows.forEach((row) => {
      let vehicle = row.vehicleName ? vehicleByName.get(normalizeKey(row.vehicleName)) : fallbackVehicle;
      if (!vehicle && row.vehicleName) {
        vehicle = { id: uid(), householdId: currentHouseholdId(), profileId: currentProfileId(), createdAt: new Date().toISOString(), name: row.vehicleName, plate: '', fuelType: '', odometer: row.odometer || '', technicalInspectionUntil: '', insuranceUntil: '', nextServiceKm: '', nextServiceDate: '', note: '' };
        state.vehicles.push(vehicle);
        vehicleByName.set(normalizeKey(row.vehicleName), vehicle);
      }
      const vehicleId = vehicle?.id || fallbackVehicle.id;
      if (row.kind === 'fuel') {
        if (fuelDuplicateExists(row, vehicleId)) {
          skipped += 1;
          return;
        }
        state.fuel.push({ id: uid(), householdId: currentHouseholdId(), profileId: currentProfileId(), createdAt: new Date().toISOString(), source: 'fuelio', vehicleId, date: row.date, odometer: row.odometer, liters: row.liters, price: row.price, note: row.note });
        if (row.odometer && Number(row.odometer) > Number(vehicle.odometer || 0)) vehicle.odometer = String(row.odometer);
        importedFuel += 1;
      }
      if (row.kind === 'service') {
        if (serviceDuplicateExists(row, vehicleId)) {
          skipped += 1;
          return;
        }
        state.services.push({ id: uid(), householdId: currentHouseholdId(), profileId: currentProfileId(), createdAt: new Date().toISOString(), source: 'fuelio', vehicleId, date: row.date, title: row.title, price: row.price, note: row.note });
        importedServices += 1;
      }
    });

    garageVehicleId = fallbackVehicle.id;
    fuelioPreview = null;
    touchState();
    saveState();
    render();
    showToast(`Fuelio import: ${importedFuel} tankování, ${importedServices} nákladů, ${skipped} duplicit`);
  }


  function updateVehicle(vehicleId, data) {
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
    touchState();
    saveState();
    render();
    showToast('Údaje auta uloženy');
  }

  async function handleForm(form) {
    const type = form.dataset.form;
    const data = getFormData(form);
    const handlers = {
      'add-event': () => addItem('calendar', { title: data.title, date: data.date, time: data.time, endTime: data.endTime, type: data.type, note: data.note }),
      'add-package': () => addItem('packages', { carrier: data.carrier, tracking: data.tracking, status: data.status || 'new', url: data.url, note: data.note, createdAt: new Date().toISOString() }),
      'add-shopping': () => addItem('shopping', { name: data.name, category: data.category, amount: data.amount, note: data.note, done: false }),
      'add-coupon': () => addItem('coupons', { store: data.store, code: data.code, discount: data.discount, expiry: data.expiry, note: data.note, used: false }),
      'add-hdo': () => addItem('hdoWindows', { label: data.label, start: data.start, end: data.end, days: daysModeToArray(data.daysMode), enabled: true }),
      'add-waste': () => addItem('waste', { type: data.type, date: data.date, note: data.note }),
      'add-task': () => addItem('homeTasks', { title: data.title, due: data.due, note: data.note, done: false }),
      'add-note': () => addItem('notes', { text: data.text, createdAt: new Date().toISOString() }),
      'add-device': () => addItem('devices', { name: data.name, type: data.type, address: data.address, note: data.note }),
      'add-vehicle': () => {
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
        state.vehicles.push(vehicle);
        garageVehicleId = vehicle.id;
        touchState();
        saveState();
        form.reset();
        render();
      },
      'update-vehicle': () => updateVehicle(form.dataset.vehicleId, data),
      'add-fuel': () => addItem('fuel', { vehicleId: form.dataset.vehicleId, date: data.date, odometer: data.odometer, liters: decimalValue(data.liters), price: decimalValue(data.price), note: data.note }),
      'add-service': () => addItem('services', { vehicleId: form.dataset.vehicleId, date: data.date, title: data.title, price: decimalValue(data.price), note: data.note }),
      'add-contract': () => {
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
        state.contracts.push(contract);
        activeContractId = contract.id;
        touchState();
        saveState();
        form.reset();
        render();
        showToast('Smlouva uložena');
      },
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
      'import-data': () => importData(data.json)
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
    state.meta = { ...(state.meta || {}), schemaVersion: 8, appBuild: 909, mode: 'offline', updatedAt: new Date().toISOString() };
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
      deleteItem(button.dataset.collection, button.dataset.id);
      return;
    }
    if (action === 'toggle-done') {
      toggleBoolean(button.dataset.collection, button.dataset.id, 'done');
      return;
    }
    if (action === 'toggle-enabled') {
      toggleBoolean(button.dataset.collection, button.dataset.id, 'enabled');
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
        saveState();
        render();
      }
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
    if (action === 'confirm-fuelio-import') {
      confirmFuelioImport();
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
    if (action === 'export-data') {
      exportData();
      return;
    }
    if (action === 'reset-data') {
      resetData();
    }
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

  function deleteItem(collection, id) {
    if (!collection || !Array.isArray(state[collection])) return;
    if (collection === 'contracts') {
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

  function deleteVehicle(id) {
    state.vehicles = state.vehicles.filter((vehicle) => vehicle.id !== id);
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
    link.download = `home-web-offline-909-${todayISO()}.json`; 
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

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }

  render();
})();
