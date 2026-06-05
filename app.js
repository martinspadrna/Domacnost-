(() => {
  'use strict';

  try {

  window.__DOMACNOST_APP_STARTED__ = true;
  if (window.__DOMACNOST_BOOT_TIMEOUT__) window.clearTimeout(window.__DOMACNOST_BOOT_TIMEOUT__);

  const localStorage = createSafeStorage(window.localStorage, 'local');
  const sessionStorage = createSafeStorage(window.sessionStorage, 'session');

  const APP_VERSION = 'Domácnost+ v.0.1_116';
  const APP_TIME_ZONE = 'Europe/Prague';
  const GOOGLE_CALENDAR_RECONNECT_FLAG = 'domacnostPlus.googleCalendarReconnectAttempted';
  const GOOGLE_CALENDAR_CALLBACK_AUTOLOAD_FLAG = 'domacnostPlus.googleCalendarCallbackAutoLoaded';
  const STORAGE_KEY = 'domacnostPlus.v0.1_86';
  const PREVIOUS_STORAGE_KEY = 'domacnostPlus.v0.1_85';
  const LEGACY_STORAGE_KEYS = [PREVIOUS_STORAGE_KEY, 'domacnostPlus.v0.1_82', 'domacnostPlus.v0.1_81', 'domacnostPlus.v0.1_80', 'domacnostPlus.v0.1_79', 'domacnostPlus.v0.1_78', 'domacnostPlus.v0.1_77', 'domacnostPlus.v0.1_72', 'domacnostPlus.v0.1_71', 'domacnostPlus.v0.1_70', 'domacnostPlus.v0.1_69', 'domacnostPlus.v0.1_68', 'domacnostPlus.v0.1_67', 'domacnostPlus.v0.1_66', 'domacnostPlus.v0.1_65', 'domacnostPlus.v0.1_64', 'domacnostPlus.v0.1_63', 'domacnostPlus.v0.1_62', 'domacnostPlus.v0.1_61', 'domacnostPlus.v0.1_60', 'domacnostPlus.v0.1_59', 'domacnostPlus.v0.1_58', 'domacnostPlus.v0.1_57', 'domacnostPlus.v0.1_56', 'domacnostPlus.v0.1_55', 'domacnostPlus.v0.1_54', 'domacnostPlus.v0.1_53', 'domacnostPlus.v0.1_52', 'domacnostPlus.v0.1_51', 'domacnostPlus.v0.1_50', 'domacnostPlus.v0.1_49', 'domacnostPlus.v0.1_48', 'domacnostPlus.v0.1_47', 'domacnostPlus.v0.1_46', 'domacnostPlus.v0.1_45', 'domacnostPlus.v0.1_44', 'domacnostPlus.v0.1_43', 'domacnostPlus.v0.1_42', 'domacnostPlus.v0.1_41', 'domacnostPlus.v0.1_39', 'domacnostPlus.v0.1_38', 'domacnostPlus.v0.1_37', 'domacnostPlus.v0.1_36', 'domacnostPlus.v0.1_35', 'domacnostPlus.v0.1_34', 'domacnostPlus.v0.1_33', 'domacnostPlus.v0.1_32', 'domacnostPlus.v0.1_31', 'domacnostPlus.v0.1_30', 'domacnostPlus.v0.1_29', 'domacnostPlus.v0.1_28', 'domacnostPlus.v0.1_27', 'domacnostPlus.v0.1_26', 'domacnostPlus.v0.1_24', 'domacnostPlus.v0.1_23', 'domacnostPlus.v0.1_21', 'domacnostPlus.v0.1_20', 'domacnostPlus.v0.1_19', 'domacnostPlus.v0.1_18', 'domacnostPlus.v0.1_17', 'domacnostPlus.v0.1_16', 'domacnostPlus.v0.1_14', 'domacnostPlus.v0.1_13', 'domacnostPlus.v0.1_12', 'domacnostPlus.cloud.v1.2.911', 'domacnostPlus.cloud.v1.1.910', 'homeWebOffline.v1.0.909', 'homeWebOffline.v0.9.908', 'homeWebOffline.v0.8.907', 'homeWebOffline.v0.7.906', 'homeWebOffline.v0.6.905', 'homeWebOffline.v0.5.904', 'homeWebOffline.v0.4.903', 'homeWebOffline.v0.3.902', 'homeWebOffline.v0.2.901', 'homeWebOffline.v0.1.900'];

  const MODULES = [
    { id: 'home', label: 'Domů', icon: '🏠' },
    { id: 'weather', label: 'Počasí', icon: '🌤️' },
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
  const CONTRACT_FILE_MAX_BYTES = 15 * 1024 * 1024;
  const CONTRACT_FILE_ALLOWED_MIME = new Set(['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']);
  const SUPABASE_URL = 'https://cgshssdjgzzuprlwnabl.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_v7jeuZC-MNUEO5nfE5xcUQ_Pu9pT-X_';
  const SUPABASE_STORAGE_KEY = 'domacnost-plus-auth';
  const APP_PUBLIC_URL = 'https://domacnost-plus.vercel.app/';
  const DEMO_SESSION_KEY = 'domacnostPlus.demoStartedThisSession';
  const BRAND_ICON_SRC = './assets/icons/domacnost-plus-icon-180.png';

  const MANAGED_MODULE_IDS = MODULES
    .filter((module) => !['home', 'settings'].includes(module.id))
    .map((module) => module.id);

  const DASHBOARD_WIDGETS = [];
  const DEFAULT_DASHBOARD_WIDGET_IDS = [];
  const HOME_HERO_ITEMS = [
    { id: 'calendar', label: 'Kalendář', icon: '📅', overview: 'calendar', metric: (ctx) => ctx.calendarPanelEvents?.length || 0, text: () => 'nejbližší události' },
    { id: 'packages', label: 'Balíky', icon: '📦', overview: 'packages', metric: (ctx) => ctx.activePackages.length, text: () => 'aktivní balíky' },
    { id: 'shopping', label: 'Nákup', icon: '🛒', overview: 'shopping', metric: (ctx) => ctx.openShopping.length, text: () => 'v nákupu' },
    { id: 'coupons', label: 'Slevové kódy', icon: '🏷️', nav: 'shopping', tab: 'coupons', metric: () => state.coupons.filter((item) => !item.used).length, text: () => 'nepoužité kódy' },
    { id: 'hdo', label: 'HDO', icon: '💡', overview: 'hdo', metric: (ctx) => ctx.hdo.active ? 'Běží' : 'Ne', text: () => 'HDO' },
    { id: 'waste', label: 'Odpad', icon: '♻️', overview: 'waste', metric: (ctx) => ctx.wasteSoon.length, text: () => 'svoz do 7 dnů' },
    { id: 'tasks', label: 'Úkoly', icon: '✅', overview: 'tasks', metric: (ctx) => ctx.openTasks.length, text: () => 'otevřené úkoly' },
    { id: 'notes', label: 'Poznámky', icon: '📝', nav: 'homecare', tab: 'tasks', metric: () => state.notes.length, text: () => 'poznámky' },
    { id: 'devices', label: 'Zařízení', icon: '🔌', nav: 'homecare', tab: 'devices', metric: () => state.devices.length, text: () => 'zařízení' },
    { id: 'warranties', label: 'Záruky', icon: '🧾', nav: 'homecare', tab: 'warranties', metric: () => state.warranties.filter((item) => item.status !== 'archived').length, text: () => 'záruky' },
    { id: 'polishHolidays', label: 'PL svátky', icon: '🇵🇱', nav: 'homecare', tab: 'polish-holidays', metric: () => polishShopHeroMetric(), text: () => polishShopHeroText() },
    { id: 'garage', label: 'Garáž', icon: '🚗', overview: 'garage', metric: () => state.vehicles.length, text: () => garageCountLabel(state.vehicles.length) },
    { id: 'contracts', label: 'Smlouvy', icon: '📄', overview: 'contracts', metric: () => state.contracts.length, text: () => 'smlouvy' },
    { id: 'finance', label: 'Finance', icon: '💰', overview: 'finance', metric: () => formatCurrency(financeMonthSummary().balance), text: () => 'měsíční rozdíl' },
    { id: 'cameras', label: 'Kamery', icon: '📹', nav: 'cameras', tab: 'overview', metric: () => state.cameras.length, text: () => 'kamery' }
  ];
  const DEFAULT_HOME_HERO_IDS = [];
  const HOME_HERO_MAX = 8;
  const POLISH_SHOP_HOLIDAY_API = 'https://date.nager.at/api/v3/PublicHolidays';
  const POLISH_SHOP_YEAR_MIN = 2025;
  const POLISH_SHOP_YEAR_MAX = 2032;
  const WEATHER_DEFAULT_LOCATION = { name: 'Hostinné', country: 'CZ', latitude: 50.5407, longitude: 15.7233 };
  const WEATHER_CACHE_MS = 30 * 60 * 1000;
  const WEATHER_PROVIDER_OPTIONS = [
    ['chmi', 'ČHMÚ – preferovaný zdroj'],
    ['open-meteo', 'Open-Meteo fallback']
  ];
  const VEHICLE_ICON_COLORS = [
    ['blue', 'Modrá'],
    ['green', 'Zelená'],
    ['teal', 'Tyrkysová'],
    ['amber', 'Žlutá'],
    ['red', 'Červená'],
    ['purple', 'Fialová'],
    ['graphite', 'Šedá']
  ];
  const WARRANTY_STATUS_OPTIONS = [
    ['active', 'Aktivní'],
    ['claim', 'Reklamace'],
    ['done', 'Vyřešeno'],
    ['archived', 'Archiv']
  ];
  const WEATHER_CHMI_FUNCTION = 'weather-chmi-forecast';
  const DEFAULT_STATE = {
    meta: {
      schemaVersion: 69,
      appBuild: 116,
      mode: 'polish-shop-holidays-v116',
      createdAt: '',
      updatedAt: ''
    },
    settings: {
      theme: 'light',
      dashboardNote: 'Domácí přehled je připravený na cloud. Každý si nastaví vlastní domácnost, profily a zapnuté moduly.',
      cloudEnabled: false,
      bottomNavIds: [...DEFAULT_BOTTOM_NAV_IDS],
      dashboardWidgets: [...DEFAULT_DASHBOARD_WIDGET_IDS],
      homeHeroItems: [...DEFAULT_HOME_HERO_IDS],
      vehicleIconColors: {}
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
    calendarCloud: { sources: [], loadedAt: '', sourcesLoadedAt: '', googleConnection: null, googleCalendars: [], googleCalendarsLoadedAt: '', googleLastSyncAt: '' },
    shoppingStats: {},
    pwa: { installed: false, lastUpdateCheck: '', lastInstallPrompt: '', diagnostics: null },
    homeTasks: [],
    waste: [],
    notes: [],
    devices: [],
    warranties: [],
    vehicles: [],
    fuel: [],
    services: [],
    contracts: [],
    contractFiles: [],
    cameras: [],
    finance: [],
    financeAccounts: [],
    financeCloud: { categories: [], accountsLoadedAt: '', loadedAt: '', monthFilter: '' },
    householdExtrasCloud: { loadedAt: '' },
    weather: {
      location: { ...WEATHER_DEFAULT_LOCATION },
      current: null,
      daily: [],
      hourly: [],
      updatedAt: '',
      error: '',
      loading: false,
      source: 'chmi',
      meta: {}
    },
    polishShopClosures: {
      year: new Date().getFullYear(),
      updatedAt: '',
      source: 'built-in',
      onlineHolidays: {},
      error: ''
    },
    cloud: {
      supabaseUrl: SUPABASE_URL,
      provider: 'supabase',
      userId: '',
      email: '',
      householdId: '',
      lastSyncAt: '',
      profilesLoadedAt: '',
      lastRealtimeAt: '',
      lastAutosyncAt: '',
      localPendingCount: 0,
      autoSyncEnabled: true,
      autosyncStatus: 'idle',
      realtimeStatus: 'offline',
      status: 'offline',
      households: [],
      invitations: []
    },
    householdWorkspaces: {}
  };


  const CLOUD_EXTRA_COLLECTIONS = {
    coupons: {
      table: 'household_coupons',
      select: 'id,store,code,discount,expiry,note,used,created_at',
      order: { column: 'expiry', ascending: true },
      payload: (item, userId) => ({
        household_id: state.cloud.householdId,
        profile_id: null,
        store: item.store || 'Obchod',
        code: item.code || null,
        discount: item.discount || null,
        expiry: item.expiry || null,
        note: item.note || null,
        used: Boolean(item.used),
        created_by: item.cloudId ? undefined : userId,
        updated_by: userId
      }),
      map: (item) => ({
        id: state.coupons.find((entry) => entry.cloudId === item.id)?.id || `coupon-cloud-${item.id}`,
        cloudId: item.id,
        householdId: currentHouseholdId(),
        profileId: currentProfileId(),
        createdAt: item.created_at || new Date().toISOString(),
        store: item.store || 'Obchod',
        code: item.code || '',
        discount: item.discount || '',
        expiry: item.expiry || '',
        note: item.note || '',
        used: Boolean(item.used)
      })
    },
    notes: {
      table: 'household_notes',
      select: 'id,text,status,created_at',
      order: { column: 'created_at', ascending: false },
      payload: (item, userId) => ({
        household_id: state.cloud.householdId,
        profile_id: null,
        text: item.text || 'Poznámka',
        status: item.status || 'active',
        created_by: item.cloudId ? undefined : userId,
        updated_by: userId
      }),
      map: (item) => ({
        id: state.notes.find((entry) => entry.cloudId === item.id)?.id || `note-cloud-${item.id}`,
        cloudId: item.id,
        householdId: currentHouseholdId(),
        profileId: currentProfileId(),
        createdAt: item.created_at || new Date().toISOString(),
        text: item.text || 'Poznámka',
        status: item.status || 'active'
      })
    },
    devices: {
      table: 'household_devices',
      select: 'id,name,type,address,note,status,created_at',
      order: { column: 'created_at', ascending: false },
      payload: (item, userId) => ({
        household_id: state.cloud.householdId,
        profile_id: null,
        name: item.name || 'Zařízení',
        type: item.type || null,
        address: item.address || null,
        note: item.note || null,
        status: item.status || 'active',
        created_by: item.cloudId ? undefined : userId,
        updated_by: userId
      }),
      map: (item) => ({
        id: state.devices.find((entry) => entry.cloudId === item.id)?.id || `device-cloud-${item.id}`,
        cloudId: item.id,
        householdId: currentHouseholdId(),
        profileId: currentProfileId(),
        createdAt: item.created_at || new Date().toISOString(),
        name: item.name || 'Zařízení',
        type: item.type || '',
        address: item.address || '',
        note: item.note || '',
        status: item.status || 'active'
      })
    },
    cameras: {
      table: 'camera_feeds',
      select: 'id,name,location,snapshot_url,status,note,created_at',
      order: { column: 'created_at', ascending: false },
      payload: (item, userId) => ({
        household_id: state.cloud.householdId,
        profile_id: null,
        name: item.name || 'Kamera',
        location: item.location || null,
        snapshot_url: item.snapshotUrl || null,
        status: item.status || 'offline',
        note: item.note || null,
        created_by: item.cloudId ? undefined : userId,
        updated_by: userId
      }),
      map: (item) => ({
        id: state.cameras.find((entry) => entry.cloudId === item.id)?.id || `camera-cloud-${item.id}`,
        cloudId: item.id,
        householdId: currentHouseholdId(),
        profileId: currentProfileId(),
        createdAt: item.created_at || new Date().toISOString(),
        name: item.name || 'Kamera',
        location: item.location || '',
        snapshotUrl: item.snapshot_url || '',
        status: item.status || 'offline',
        note: item.note || ''
      })
    }
  };


  const REALTIME_CLOUD_TABLES = [
    'shopping_lists',
    'shopping_list_items',
    'profiles',
    'household_members',
    'contracts',
    'contract_files',
    'vehicles',
    'fuel_logs',
    'service_logs',
    'hdo_settings',
    'hdo_windows',
    'waste_types',
    'waste_schedules',
    'household_tasks',
    'task_events',
    'parcels',
    'calendar_events',
    'calendar_sources',
    'finance_accounts',
    'finance_transactions',
    'household_notes',
    'household_devices',
    'camera_feeds',
    'household_coupons'
  ];

  const REALTIME_STATUS_LABELS = {
    offline: 'vypnuto',
    connecting: 'připojuji',
    online: 'živě',
    subscribed: 'živě',
    timed_out: 'timeout',
    channel_error: 'chyba',
    closed: 'zavřeno',
    refreshing: 'obnovuji',
    unsupported: 'nedostupné'
  };

  const AUTOSYNC_STATUS_LABELS = {
    idle: 'čeká',
    pending: 'čeká na sync',
    syncing: 'synchronizuje',
    done: 'hotovo',
    blocked: 'ručně dořešit',
    error: 'chyba',
    disabled: 'vypnuto'
  };

  let state = loadState();
  let demoRuntimeActive = false;
  let activeModule = localStorage.getItem('homeWeb.activeModule') || 'home';
  let activeOverview = null;
  let moduleTabs = isStoredDemoState(state) ? {} : (safeParse(localStorage.getItem('domacnostPlus.moduleTabs'), {}) || {});
  let garageVehicleId = null;
  let garageHistoryYearFilter = 'all';
  let garageHistoryTypeFilter = 'all';
  let calendarViewMonth = localStorage.getItem('domacnostPlus.calendarViewMonth') || todayISO().slice(0, 7);
  let activeContractId = null;
  let fuelioPreview = null;
  let garageEditRecord = null;
  let garageModal = null;
  let calendarDetailEventId = null;
  let toastTimer = null;
  let now = new Date();
  let supabaseClientInstance = null;
  let deferredInstallPrompt = null;
  let serviceWorkerRegistration = null;
  let pendingServiceWorker = null;
  let pwaUpdateAvailable = false;
  let onboardingMode = sessionStorage.getItem('domacnostPlus.onboardingMode') || 'choice';
  const ONBOARDING_GOOGLE_INTENT_KEY = 'domacnostPlus.googleAuthIntent';
  let cloudWarmStartDone = false;
  let cloudRealtimeChannel = null;
  let cloudRealtimeHouseholdId = '';
  let cloudRealtimeReloadTimer = null;
  let cloudRealtimeReloading = false;
  let cloudAutosyncTimer = null;
  let cloudAutosyncRunning = false;
  let cloudAutosyncLastAttempt = 0;
  let suppressToastDepth = 0;

  const app = document.getElementById('app');
  document.documentElement.dataset.theme = state.settings.theme || 'light';

  window.addEventListener?.('error', (event) => {
    if (!app || app.getAttribute?.('data-boot-ok') === '1') return;
    renderBootFallback(event.error || event.message || 'Neznámá chyba při spuštění');
  });
  window.addEventListener?.('unhandledrejection', (event) => {
    if (!app || app.getAttribute?.('data-boot-ok') === '1') return;
    renderBootFallback(event.reason || 'Nezachycená chyba při spuštění');
  });

  function createSafeStorage(storage, label = 'storage') {
    const memory = new Map();
    const readNativeLength = () => {
      try {
        return storage ? storage.length : 0;
      } catch {
        return 0;
      }
    };
    const hasNative = () => {
      try {
        if (!storage) return false;
        const testKey = `domacnostPlus.${label}.test`;
        storage.setItem(testKey, '1');
        storage.removeItem(testKey);
        return true;
      } catch {
        return false;
      }
    };
    let nativeAvailable = hasNative();
    const fallback = () => {
      nativeAvailable = false;
      return memory;
    };
    return {
      get length() {
        if (nativeAvailable) return readNativeLength();
        return memory.size;
      },
      key(index) {
        if (nativeAvailable) {
          try { return storage.key(index); } catch { fallback(); }
        }
        return Array.from(memory.keys())[index] || null;
      },
      getItem(key) {
        if (nativeAvailable) {
          try { return storage.getItem(key); } catch { fallback(); }
        }
        return memory.has(key) ? memory.get(key) : null;
      },
      setItem(key, value) {
        if (nativeAvailable) {
          try { storage.setItem(key, value); return; } catch { fallback(); }
        }
        memory.set(key, String(value));
      },
      removeItem(key) {
        if (nativeAvailable) {
          try { storage.removeItem(key); return; } catch { fallback(); }
        }
        memory.delete(key);
      },
      clear() {
        if (nativeAvailable) {
          try { storage.clear(); return; } catch { fallback(); }
        }
        memory.clear();
      }
    };
  }

  function uid() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function localISODate(date = new Date(), timeZone = APP_TIME_ZONE) {
    const safeDate = toSafeDate(date, new Date());
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).formatToParts(safeDate).reduce((acc, part) => {
      if (part.type !== 'literal') acc[part.type] = part.value;
      return acc;
    }, {});
    return `${parts.year}-${parts.month}-${parts.day}`;
  }

  function todayISO() {
    return localISODate(new Date(), APP_TIME_ZONE);
  }

  function easterSundayDate(year) {
    const y = Number(year);
    if (!Number.isInteger(y) || y < 1900 || y > 2200) return null;
    const a = y % 19;
    const b = Math.floor(y / 100);
    const c = y % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(Date.UTC(y, month - 1, day));
  }

  function addDaysIso(isoDate, days) {
    const [year, month, day] = String(isoDate || '').slice(0, 10).split('-').map(Number);
    if (!year || !month || !day) return '';
    const date = new Date(Date.UTC(year, month - 1, day));
    date.setUTCDate(date.getUTCDate() + Number(days || 0));
    return date.toISOString().slice(0, 10);
  }

  function addYearsIso(isoDate, years = 2) {
    const [year, month, day] = String(isoDate || '').slice(0, 10).split('-').map(Number);
    if (!year || !month || !day) return '';
    const date = new Date(Date.UTC(year, month - 1, day));
    date.setUTCFullYear(date.getUTCFullYear() + Number(years || 0));
    return date.toISOString().slice(0, 10);
  }

  function czechPublicHolidayName(isoDate) {
    const value = String(isoDate || '').slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return '';
    const fixed = {
      '01-01': 'Nový rok / Den obnovy samostatného českého státu',
      '05-01': 'Svátek práce',
      '05-08': 'Den vítězství',
      '07-05': 'Cyril a Metoděj',
      '07-06': 'Jan Hus',
      '09-28': 'Den české státnosti',
      '10-28': 'Den vzniku samostatného československého státu',
      '11-17': 'Den boje za svobodu a demokracii',
      '12-24': 'Štědrý den',
      '12-25': '1. svátek vánoční',
      '12-26': '2. svátek vánoční'
    };
    const fixedName = fixed[value.slice(5)];
    if (fixedName) return fixedName;
    const year = Number(value.slice(0, 4));
    const easter = easterSundayDate(year);
    if (!easter) return '';
    const easterIso = easter.toISOString().slice(0, 10);
    if (value === addDaysIso(easterIso, -2)) return 'Velký pátek';
    if (value === addDaysIso(easterIso, 1)) return 'Velikonoční pondělí';
    return '';
  }

  function isCzechPublicHolidayDate(date) {
    return Boolean(czechPublicHolidayName(localISODate(date, APP_TIME_ZONE)));
  }

  function normalizePolishShopState(value = {}) {
    const raw = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    const year = clampPolishShopYear(raw.year || new Date().getFullYear());
    const onlineHolidays = raw.onlineHolidays && typeof raw.onlineHolidays === 'object' && !Array.isArray(raw.onlineHolidays) ? raw.onlineHolidays : {};
    const cleanOnline = {};
    Object.entries(onlineHolidays).forEach(([rawYear, list]) => {
      const safeYear = clampPolishShopYear(rawYear);
      if (!Array.isArray(list)) return;
      cleanOnline[safeYear] = list
        .filter((item) => item && typeof item === 'object' && /^\d{4}-\d{2}-\d{2}$/.test(String(item.date || '').slice(0, 10)))
        .map((item) => ({ date: String(item.date).slice(0, 10), name: normalizeText(item.name || item.localName || item.englishName || 'Svátek') }));
    });
    return {
      year,
      updatedAt: normalizeText(raw.updatedAt),
      source: normalizeText(raw.source) || 'built-in',
      onlineHolidays: cleanOnline,
      error: normalizeText(raw.error)
    };
  }

  function clampPolishShopYear(value) {
    const year = Number(value || new Date().getFullYear());
    if (!Number.isFinite(year)) return new Date().getFullYear();
    return Math.min(POLISH_SHOP_YEAR_MAX, Math.max(POLISH_SHOP_YEAR_MIN, Math.round(year)));
  }

  function polishShopSelectedYear() {
    state.polishShopClosures = normalizePolishShopState(state.polishShopClosures);
    return clampPolishShopYear(state.polishShopClosures.year || new Date().getFullYear());
  }

  function polishPublicHolidayBuiltins(year) {
    const y = clampPolishShopYear(year);
    const easter = easterSundayDate(y);
    const easterIso = easter ? easter.toISOString().slice(0, 10) : '';
    const items = [
      [`${y}-01-01`, 'Nowy Rok'],
      [`${y}-01-06`, 'Święto Trzech Króli'],
      [`${y}-05-01`, 'Święto Pracy'],
      [`${y}-05-03`, 'Święto Konstytucji 3 Maja'],
      [`${y}-08-15`, 'Wniebowzięcie NMP / Święto Wojska Polskiego'],
      [`${y}-11-01`, 'Wszystkich Świętych'],
      [`${y}-11-11`, 'Narodowe Święto Niepodległości'],
      [`${y}-12-24`, 'Wigilia Bożego Narodzenia'],
      [`${y}-12-25`, 'Boże Narodzenie'],
      [`${y}-12-26`, 'Drugi dzień Bożego Narodzenia']
    ];
    if (easterIso) {
      items.push([easterIso, 'Wielkanoc']);
      items.push([addDaysIso(easterIso, 1), 'Poniedziałek Wielkanocny']);
      items.push([addDaysIso(easterIso, 49), 'Zielone Świątki']);
      items.push([addDaysIso(easterIso, 60), 'Boże Ciało']);
    }
    return items.map(([date, name]) => ({ date, name }));
  }

  function polishPublicHolidays(year) {
    const y = clampPolishShopYear(year);
    const built = polishPublicHolidayBuiltins(y);
    const online = normalizePolishShopState(state.polishShopClosures).onlineHolidays?.[y] || [];
    const map = new Map(built.map((item) => [item.date, { ...item }]));
    online.forEach((item) => {
      if (!item.date) return;
      const existing = map.get(item.date);
      map.set(item.date, { date: item.date, name: normalizeText(item.name) || existing?.name || 'Svátek' });
    });
    return [...map.values()].sort((a, b) => a.date.localeCompare(b.date));
  }

  function utcDateFromIso(isoDate) {
    const [year, month, day] = String(isoDate || '').slice(0, 10).split('-').map(Number);
    if (!year || !month || !day) return null;
    return new Date(Date.UTC(year, month - 1, day));
  }

  function isoWeekday(isoDate) {
    const date = utcDateFromIso(isoDate);
    return date ? date.getUTCDay() : -1;
  }

  function polishLastSundayIso(year, month) {
    const y = clampPolishShopYear(year);
    const date = new Date(Date.UTC(y, Number(month), 0));
    while (date.getUTCDay() !== 0) date.setUTCDate(date.getUTCDate() - 1);
    return date.toISOString().slice(0, 10);
  }

  function previousSundayBeforeIso(isoDate) {
    const date = utcDateFromIso(isoDate);
    if (!date) return '';
    date.setUTCDate(date.getUTCDate() - 1);
    while (date.getUTCDay() !== 0) date.setUTCDate(date.getUTCDate() - 1);
    return date.toISOString().slice(0, 10);
  }

  function allSundaysIso(year) {
    const y = clampPolishShopYear(year);
    const date = new Date(Date.UTC(y, 0, 1));
    while (date.getUTCDay() !== 0) date.setUTCDate(date.getUTCDate() + 1);
    const result = [];
    while (date.getUTCFullYear() === y) {
      result.push(date.toISOString().slice(0, 10));
      date.setUTCDate(date.getUTCDate() + 7);
    }
    return result;
  }

  function polishTradingSundays(year) {
    const y = clampPolishShopYear(year);
    const easter = easterSundayDate(y);
    const dates = new Set([
      polishLastSundayIso(y, 1),
      polishLastSundayIso(y, 4),
      polishLastSundayIso(y, 6),
      polishLastSundayIso(y, 8)
    ]);
    if (easter) dates.add(addDaysIso(easter.toISOString().slice(0, 10), -7));
    let christmasSunday = previousSundayBeforeIso(`${y}-12-24`);
    for (let index = 0; index < 3 && christmasSunday; index += 1) {
      dates.add(christmasSunday);
      christmasSunday = addDaysIso(christmasSunday, -7);
    }
    return [...dates].filter((date) => date.startsWith(String(y))).sort();
  }

  function addPolishShopEntry(map, entry) {
    if (!entry?.date) return;
    const existing = map.get(entry.date);
    if (!existing) {
      map.set(entry.date, { ...entry, labels: [entry.name].filter(Boolean) });
      return;
    }
    const status = existing.status === 'closed' || entry.status === 'closed' ? 'closed' : entry.status || existing.status;
    const labels = [...new Set([...(existing.labels || []), entry.name].filter(Boolean))];
    map.set(entry.date, {
      ...existing,
      ...entry,
      status,
      name: labels.join(' + '),
      labels,
      reason: [...new Set([existing.reason, entry.reason].filter(Boolean))].join(' · ')
    });
  }

  function buildPolishShopCalendarYear(year) {
    const y = clampPolishShopYear(year);
    const map = new Map();
    polishPublicHolidays(y).forEach((holiday) => addPolishShopEntry(map, {
      date: holiday.date,
      name: holiday.name,
      type: 'holiday',
      status: 'closed',
      reason: 'svátek / obchody zavřené'
    }));
    const trading = new Set(polishTradingSundays(y));
    allSundaysIso(y).forEach((date) => {
      if (!trading.has(date)) {
        addPolishShopEntry(map, {
          date,
          name: 'Neděle nehandlová',
          type: 'sunday',
          status: 'closed',
          reason: 'větší obchody zavřené'
        });
      }
    });
    const easter = easterSundayDate(y);
    if (easter) {
      const easterSaturday = addDaysIso(easter.toISOString().slice(0, 10), -1);
      if (!map.has(easterSaturday)) {
        addPolishShopEntry(map, {
          date: easterSaturday,
          name: 'Wielka Sobota',
          type: 'limited',
          status: 'limited',
          reason: 'obvykle zkráceno do 14:00'
        });
      }
    }
    return [...map.values()].sort((a, b) => a.date.localeCompare(b.date));
  }

  function polishShopCalendarAround(year = polishShopSelectedYear()) {
    const y = clampPolishShopYear(year);
    return [y - 1, y, y + 1]
      .filter((item) => item >= POLISH_SHOP_YEAR_MIN && item <= POLISH_SHOP_YEAR_MAX)
      .flatMap((item) => buildPolishShopCalendarYear(item));
  }

  function nextPolishShopEntry(status = '') {
    const today = todayISO();
    return polishShopCalendarAround(new Date().getFullYear())
      .filter((entry) => entry.date >= today && (!status || entry.status === status))
      .sort((a, b) => a.date.localeCompare(b.date))[0] || null;
  }

  function polishShopTodayEntry(offset = 0) {
    const iso = addDaysIso(todayISO(), offset);
    return polishShopCalendarAround(Number(iso.slice(0, 4))).find((entry) => entry.date === iso) || null;
  }

  function polishShopHeroMetric() {
    const todayEntry = polishShopTodayEntry(0);
    if (todayEntry?.status === 'closed') return 'Zavřeno';
    if (todayEntry?.status === 'limited') return 'Pozor';
    const next = nextPolishShopEntry('closed');
    return next ? dueBadge(daysUntil(next.date)) : 'OK';
  }

  function polishShopHeroText() {
    const todayEntry = polishShopTodayEntry(0);
    if (todayEntry?.status === 'closed') return todayEntry.name;
    if (todayEntry?.status === 'limited') return `${todayEntry.name} · zkráceno`;
    const next = nextPolishShopEntry('closed');
    return next ? `${formatDate(next.date)} · ${next.name}` : 'Žádné známé zavření';
  }

  function dateOffsetISO(days) {
    const date = new Date();
    date.setDate(date.getDate() + Number(days || 0));
    return localISODate(date, APP_TIME_ZONE);
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
    const previousAppBuild = Number(migrated.meta?.appBuild || 0);

    migrated.meta = {
      schemaVersion: 69,
      appBuild: 116,
      mode: 'polish-shop-holidays-v116',
      createdAt: migrated.meta?.createdAt || timestamp,
      updatedAt: migrated.meta?.updatedAt || timestamp
    };

    migrated.settings = {
      ...(migrated.settings || {}),
      theme: migrated.settings?.theme === 'dark' ? 'dark' : 'light',
      dashboardNote: migrated.settings?.dashboardNote || DEFAULT_STATE.settings.dashboardNote,
      bottomNavIds: Array.isArray(migrated.settings?.bottomNavIds) ? migrated.settings.bottomNavIds : [...DEFAULT_BOTTOM_NAV_IDS],
      dashboardWidgets: [],
      homeHeroItems: previousAppBuild && previousAppBuild < 74 ? [] : normalizeHomeHeroIds(migrated.settings?.homeHeroItems),
      vehicleIconColors: normalizeVehicleIconColorMap(migrated.settings?.vehicleIconColors)
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
    migrated.hdoCloud = migrated.hdoCloud && typeof migrated.hdoCloud === 'object' && !Array.isArray(migrated.hdoCloud)
      ? { settingId: migrated.hdoCloud.settingId || '', loadedAt: migrated.hdoCloud.loadedAt || '' }
      : { ...DEFAULT_STATE.hdoCloud };
    migrated.householdWorkspaces = migrated.householdWorkspaces && typeof migrated.householdWorkspaces === 'object' && !Array.isArray(migrated.householdWorkspaces) ? migrated.householdWorkspaces : {};
    migrated.cloud.households = Array.isArray(migrated.cloud?.households) ? migrated.cloud.households : [];
    migrated.cloud.invitations = Array.isArray(migrated.cloud?.invitations) ? migrated.cloud.invitations : [];
    migrated.cloud.autoSyncEnabled = migrated.cloud?.autoSyncEnabled !== false;
    migrated.cloud.autosyncStatus = migrated.cloud?.autosyncStatus || 'idle';
    migrated.cloud.lastAutosyncAt = migrated.cloud?.lastAutosyncAt || '';
    migrated.cloud.profilesLoadedAt = migrated.cloud?.profilesLoadedAt || '';
    migrated.cloud.localPendingCount = Number(migrated.cloud?.localPendingCount || 0);
    migrated.weather = normalizeWeatherState(migrated.weather);
    migrated.polishShopClosures = normalizePolishShopState(migrated.polishShopClosures);
    if (previousAppBuild < 82 && migrated.weather.source === 'open-meteo') {
      migrated.weather.source = 'chmi';
      migrated.weather.updatedAt = '';
      migrated.weather.error = '';
    }
    if (previousAppBuild < 84) {
      migrated.weather.source = 'chmi';
      migrated.weather.updatedAt = '';
      migrated.weather.error = '';
      migrated.weather.loading = false;
    }

    migrated.enabledModules = normalizeModuleList(migrated.enabledModules);
    if (!migrated.enabledModules.includes('weather')) migrated.enabledModules = ['weather', ...migrated.enabledModules];
    migrated.settings.bottomNavIds = normalizeBottomNavIds(migrated.settings.bottomNavIds, migrated.enabledModules);

    getCollectionNames().forEach((collection) => {
      migrated[collection] = Array.isArray(migrated[collection]) ? migrated[collection] : [];
      migrated[collection] = migrated[collection]
        .filter((item) => item && typeof item === 'object')
        .map((item) => ({
          householdId: item.householdId || migrated.household.id,
          profileId: item.profileId || migrated.activeProfileId || migrated.profiles[0]?.id || '',
          ...item
        }));
    });

    const migratedVehicleIconColors = normalizeVehicleIconColorMap(migrated.settings.vehicleIconColors);
    migrated.vehicles = migrated.vehicles.map((vehicle) => {
      const baseVehicle = {
        technicalInspectionUntil: '',
        insuranceUntil: '',
        serviceIntervalKm: '',
        nextServiceKm: '',
        nextServiceDate: '',
        note: '',
        ...vehicle
      };
      const keys = [baseVehicle.cloudId, baseVehicle.id, normalizeKey(baseVehicle.name)].filter(Boolean);
      baseVehicle.iconColor = normalizeVehicleIconColor(baseVehicle.iconColor || keys.map((key) => migratedVehicleIconColors[key]).find(Boolean) || 'blue');
      keys.forEach((key) => { migratedVehicleIconColors[key] = baseVehicle.iconColor; });
      return baseVehicle;
    });
    migrated.settings.vehicleIconColors = migratedVehicleIconColors;

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
    return ['calendar', 'packages', 'coupons', 'hdoWindows', 'shopping', 'shoppingCatalogCustom', 'homeTasks', 'waste', 'notes', 'devices', 'warranties', 'vehicles', 'fuel', 'services', 'contracts', 'contractFiles', 'cameras', 'finance', 'financeAccounts'];
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

  function normalizeDashboardWidgetIds(value) {
    return [];
  }

  function dashboardWidgetById(id) {
    return DASHBOARD_WIDGETS.find((item) => item.id === id) || DASHBOARD_WIDGETS[0];
  }

  function normalizeHomeHeroIds(value) {
    const allowed = new Set(HOME_HERO_ITEMS.map((item) => item.id));
    const requested = Array.isArray(value) ? value : DEFAULT_HOME_HERO_IDS;
    const result = [];
    requested.forEach((id) => {
      if (allowed.has(id) && !result.includes(id)) result.push(id);
    });
    return result.slice(0, HOME_HERO_MAX);
  }

  function homeHeroItemById(id) {
    return HOME_HERO_ITEMS.find((item) => item.id === id) || HOME_HERO_ITEMS[0];
  }

  function normalizeWeatherLocation(location) {
    const source = location && typeof location === 'object' ? location : WEATHER_DEFAULT_LOCATION;
    const latitude = Number(source.latitude ?? source.lat ?? WEATHER_DEFAULT_LOCATION.latitude);
    const longitude = Number(source.longitude ?? source.lon ?? WEATHER_DEFAULT_LOCATION.longitude);
    return {
      name: normalizeText(source.name || source.city || WEATHER_DEFAULT_LOCATION.name),
      country: normalizeText(source.country || WEATHER_DEFAULT_LOCATION.country),
      latitude: Number.isFinite(latitude) ? latitude : WEATHER_DEFAULT_LOCATION.latitude,
      longitude: Number.isFinite(longitude) ? longitude : WEATHER_DEFAULT_LOCATION.longitude
    };
  }

  function normalizeWeatherSource(value) {
    const clean = String(value || '').trim().toLowerCase();
    if (clean === 'chmi' || clean === 'open-meteo' || clean === 'open-meteo-fallback' || clean === 'demo') return clean;
    return 'chmi';
  }

  function normalizeWeatherState(value) {
    const base = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    return {
      location: normalizeWeatherLocation(base.location),
      current: base.current && typeof base.current === 'object' ? base.current : null,
      daily: Array.isArray(base.daily) ? base.daily : [],
      hourly: Array.isArray(base.hourly) ? base.hourly : [],
      updatedAt: base.updatedAt || '',
      error: base.error || '',
      loading: false,
      source: normalizeWeatherSource(base.source),
      meta: base.meta && typeof base.meta === 'object' ? base.meta : {}
    };
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
    return MODULES.filter((module) => module.id === 'home' || module.id === 'settings' || module.id === 'weather' || enabled.has(module.id));
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
    return moduleId === 'home' || moduleId === 'settings' || moduleId === 'weather' || normalizeModuleList(state.enabledModules).includes(moduleId);
  }

  function persistStateSnapshot() {
    if (isDemoOnlyState()) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function saveState() {
    // Demo je jen dočasný sandbox. Nikdy ho neukládáme do localStorage,
    // aby se všem při každém spuštění ukázala stejná plná demo domácnost.
    if (isDemoOnlyState()) return;
    if (state?.meta) state.meta.updatedAt = new Date().toISOString();
    persistStateSnapshot();
    scheduleCloudAutosync('save');
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

  function toSafeDate(value, fallback = null) {
    if (value instanceof Date) return Number.isFinite(value.getTime()) ? value : fallback;
    if (typeof value === 'number') {
      const date = new Date(value);
      return Number.isFinite(date.getTime()) ? date : fallback;
    }
    if (typeof value === 'string' && value.trim()) {
      const date = new Date(value);
      return Number.isFinite(date.getTime()) ? date : fallback;
    }
    return fallback;
  }

  function formatDateTime(value) {
    const date = toSafeDate(value);
    if (!date) return '—';
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
    if (isDemoOnlyState()) return !demoRuntimeActive;
    if (!hasUsableAppSession()) {
      if (state.cloud?.status === 'email-confirmation') onboardingMode = 'account';
      else if (onboardingMode !== 'google-setup') onboardingMode = sessionStorage.getItem('domacnostPlus.onboardingMode') || 'choice';
      return true;
    }
    if (!state.household?.isConfigured) return true;
    return false;
  }

  function render() {
    document.documentElement.dataset.theme = state.settings.theme || 'light';
    const showStartChoice = shouldShowStartChoice();
    if (showStartChoice) activeOverview = null;
    document.body.classList.toggle('overview-open', Boolean(activeOverview || garageModal || calendarDetailEventId));

    if (showStartChoice) {
      renderOnboarding();
      if (app) app.setAttribute?.('data-boot-ok', '1');
      return;
    }

    const visibleModules = getVisibleModules();
    const selectableModules = [...visibleModules, MORE_MODULE];
    if (!selectableModules.some((module) => module.id === activeModule)) activeModule = 'home';
    if (!isDemoOnlyState()) localStorage.setItem('homeWeb.activeModule', activeModule);

    const active = selectableModules.find((module) => module.id === activeModule) || visibleModules[0];
    const bottomNavModules = getBottomNavModules();
    const isHomeModule = active.id === 'home';
    const pageTitle = isHomeModule ? householdName() : active.label;
    const pageSubtitle = isHomeModule ? '' : getModuleSubtitle(active.id);

    app.innerHTML = `
      <div class="app-frame ${isHomeModule ? 'home-clean-frame' : ''}">
        <main>
          <section class="page-head ${isHomeModule ? 'home-page-head' : ''}">
            <div>
              <h2 class="page-title">${escapeHtml(pageTitle)}</h2>
              ${pageSubtitle ? `<p class="page-subtitle">${escapeHtml(pageSubtitle)}</p>` : ''}
            </div>
            ${renderPageActions(active.id)}
          </section>
          ${renderDemoReadOnlyBanner()}${renderModule(active.id)}
        </main>
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
      ${renderOverviewDrawer()}
      ${renderGlobalModals()}
      <div id="copy-toast" class="copy-toast" role="status" aria-live="polite"></div>
    `;

    if (app) app.setAttribute?.('data-boot-ok', '1');
    promoteActiveContentBeforeForms();
    keepActiveNavCentered();
    keepActiveSectionTabsCentered();
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
          <div class="item-actions compact-actions">
            <span class="badge warn">bez ukládání</span>
            <button class="ghost-btn" type="button" data-action="exit-demo">Zpět na úvod</button>
          </div>
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

  function safeAnimationFrame(callback) {
    const frame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || ((fn) => window.setTimeout(fn, 0));
    frame(callback);
  }

  function keepActiveNavCentered(behavior = 'auto') {
    safeAnimationFrame(() => {
      const navScroll = document.querySelector('.nav-scroll');
      const activeItem = navScroll?.querySelector('.nav-item.active');
      if (!navScroll || !activeItem) return;
      const maxLeft = Math.max(0, navScroll.scrollWidth - navScroll.clientWidth);
      if (!maxLeft) return;
      const itemLeft = activeItem.offsetLeft;
      const itemRight = itemLeft + activeItem.clientWidth;
      const visibleLeft = navScroll.scrollLeft;
      const visibleRight = visibleLeft + navScroll.clientWidth;
      if (itemLeft >= visibleLeft && itemRight <= visibleRight) return;
      const targetLeft = itemLeft - ((navScroll.clientWidth - activeItem.clientWidth) / 2);
      navScroll.scrollTo({ left: Math.max(0, Math.min(maxLeft, targetLeft)), behavior });
    });
  }


  function keepActiveSectionTabsCentered(behavior = 'auto') {
    safeAnimationFrame(() => {
      document.querySelectorAll('.section-tabs').forEach((tabs) => {
        const activeTab = tabs.querySelector('.section-tab.active');
        if (!activeTab) return;
        const maxLeft = tabs.scrollWidth - tabs.clientWidth;
        const targetLeft = activeTab.offsetLeft - ((tabs.clientWidth - activeTab.clientWidth) / 2);
        tabs.scrollTo({
          left: Math.max(0, Math.min(maxLeft, targetLeft)),
          behavior
        });
      });
    });
  }

  function getModuleTab(area, fallback) {
    return moduleTabs?.[area] || fallback;
  }

  function setModuleTab(area, tab) {
    moduleTabs = { ...(moduleTabs || {}), [area]: tab };
    if (!isDemoOnlyState()) localStorage.setItem('domacnostPlus.moduleTabs', JSON.stringify(moduleTabs));
    render();
    keepActiveSectionTabsCentered('smooth');
  }

  function renderSectionTabs(area, tabs, fallback) {
    const fallbackTab = fallback || tabs[0]?.id || 'main';
    const rawActive = getModuleTab(area, fallbackTab);
    const active = tabs.some((tab) => tab.id === rawActive) ? rawActive : fallbackTab;
    return `
      <div class="section-tabs compact-tabs" role="tablist" aria-label="Záložky modulu">
        ${tabs.map((tab) => `
          <button class="section-tab ${active === tab.id ? 'active' : ''}" type="button" role="tab" aria-selected="${active === tab.id ? 'true' : 'false'}" data-action="set-section-tab" data-area="${escapeHtml(area)}" data-tab="${escapeHtml(tab.id)}">
            <span aria-hidden="true">${escapeHtml(tab.icon || '')}</span><strong>${escapeHtml(tab.label)}</strong>${tab.count !== undefined ? `<em>${escapeHtml(String(tab.count))}</em>` : ''}
          </button>
        `).join('')}
      </div>
    `;
  }

  function renderOverviewItem({ title, badge = '', meta = '', badgeClass = '', icon = '' }) {
    return `
      <div class="item compact-item overview-list-item">
        <div class="item-top">
          <div class="item-title">${icon ? `${escapeHtml(icon)} ` : ''}${escapeHtml(title || '—')}</div>
          ${badge ? `<span class="badge ${escapeHtml(badgeClass)}">${escapeHtml(badge)}</span>` : ''}
        </div>
        ${meta ? `<div class="item-meta">${escapeHtml(meta)}</div>` : ''}
      </div>
    `;
  }

  function renderOverviewSummary(items = []) {
    const cleanItems = items.filter((item) => item && item.value !== undefined && item.value !== null && item.value !== '');
    if (!cleanItems.length) return '';
    return `
      <div class="overview-summary-grid">
        ${cleanItems.map((item) => `
          <div class="overview-summary-card ${escapeHtml(item.tone || '')}">
            <span>${escapeHtml(item.label || '')}</span>
            <strong>${escapeHtml(String(item.value))}</strong>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderPackageOverviewItem(pkg) {
    const status = packageStatus(pkg.status);
    return renderOverviewItem({
      title: pkg.title || carrierLabel(pkg.carrier) || 'Balík',
      badge: status.label,
      badgeClass: status.kind,
      meta: [carrierLabel(pkg.carrier), pkg.tracking, pkg.expectedDate ? `doručení ${formatDate(pkg.expectedDate)}` : '', pkg.pickupPlace, pkg.note, pkg.cloudId ? 'cloud' : 'lokálně'].filter(Boolean).join(' · '),
      icon: '📦'
    });
  }

  function renderShoppingOverviewItem(item) {
    const amount = [item.quantity || item.amount || 1, item.unit || 'ks'].filter(Boolean).join(' ');
    return renderOverviewItem({
      title: item.name,
      badge: amount,
      meta: [item.category || 'bez kategorie', item.note, item.cloudId ? 'cloud' : ''].filter(Boolean).join(' · '),
      icon: '🛒'
    });
  }

  function renderContractOverviewItem(contract) {
    const days = daysUntil(contract.validTo);
    return renderOverviewItem({
      title: contract.name,
      badge: dueBadge(days),
      badgeClass: days !== null && days <= 14 ? 'warn' : 'good',
      meta: [contract.provider || 'Bez poskytovatele', contract.type ? contractTypeLabel(contract.type) : '', contract.validTo ? `do ${formatDate(contract.validTo)}` : '', contract.price ? formatCurrency(contract.price) : '', contract.cloudId ? 'cloud' : 'lokálně'].filter(Boolean).join(' · '),
      icon: '📄'
    });
  }

  function renderGarageOverviewItem(vehicle) {
    return `
      <button class="item compact-item overview-list-item overview-action-item vehicle-overview-action" type="button" data-action="select-vehicle" data-id="${vehicle.id}">
        <div class="item-top">
          <div class="item-title"><span class="vehicle-icon-bubble ${vehicleIconColorClass(vehicle.iconColor)}" aria-hidden="true">🚗</span>${escapeHtml(vehicle.name || 'Auto')}</div>
          ${vehicle.odometer ? `<span class="badge">${escapeHtml(vehicle.odometer)} km</span>` : ''}
        </div>
        <div class="item-meta">${escapeHtml([vehicle.brand, vehicle.model, vehicle.year, vehicle.plate].filter(Boolean).join(' · ') || 'Otevřít přehled auta')}</div>
      </button>
    `;
  }

  function renderVehicleAlertOverviewItem(item) {
    if (item.vehicleId) {
      return `
        <button class="item compact-item overview-list-item overview-action-item vehicle-overview-action" type="button" data-action="select-vehicle" data-id="${item.vehicleId}">
          <div class="item-top">
            <div class="item-title"><span class="vehicle-icon-bubble ${vehicleIconColorClass(item.iconColor)}" aria-hidden="true">🚗</span>${escapeHtml(item.title || 'Upozornění')}</div>
            <span class="badge ${item.days !== null && item.days <= 7 ? 'warn' : ''}">${escapeHtml(dueBadge(item.days))}</span>
          </div>
          <div class="item-meta">${escapeHtml(item.meta || 'Otevřít detail auta')}</div>
        </button>
      `;
    }
    return renderOverviewItem({
      title: item.title,
      badge: dueBadge(item.days),
      badgeClass: item.days !== null && item.days <= 7 ? 'warn' : '',
      meta: item.meta,
      icon: '🚗'
    });
  }

  function renderFinanceOverviewItem(item) {
    const isIncome = item.type === 'income';
    const isTransfer = item.type === 'transfer';
    const account = financeAccountById(item.accountId);
    const target = financeAccountById(item.transferAccountId);
    return renderOverviewItem({
      title: item.title,
      badge: formatCurrency(item.amount),
      badgeClass: isIncome || isTransfer ? 'good' : 'warn',
      meta: [formatDate(item.date), isTransfer ? 'Přesun' : financeCategoryLabel(item.category), account?.name, target ? `→ ${target.name}` : '', financePaymentLabel(item.paymentMethod), item.note, item.cloudId ? 'cloud' : 'lokálně'].filter(Boolean).join(' · '),
      icon: isTransfer ? '↔️' : isIncome ? '➕' : '➖'
    });
  }

  function renderTaskOverviewItem(task) {
    const days = daysUntil(task.due);
    return renderOverviewItem({
      title: task.title,
      badge: task.due ? formatDate(task.due) : 'bez termínu',
      badgeClass: task.due && days <= 2 ? 'warn' : '',
      meta: task.note || taskCategoryLabel(task.category),
      icon: '✅'
    });
  }

  function renderWasteOverviewItem(item) {
    return renderOverviewItem({
      title: `${item.type} odpad`,
      badge: item.days === null ? 'bez data' : dueBadge(item.days),
      badgeClass: item.days !== null && item.days <= 1 ? 'warn' : '',
      meta: `Svoz ${formatDate(item.date)}${item.note ? ` · ${item.note}` : ''}`,
      icon: '♻️'
    });
  }

  function renderOverviewDrawer() {
    if (!activeOverview) return '';
    return `
      <div class="overview-backdrop" data-overview-backdrop role="presentation">
        <aside class="overview-panel" data-overview-panel role="dialog" aria-modal="true" aria-labelledby="overview-title">
          ${renderOverviewContent(activeOverview)}
        </aside>
      </div>
    `;
  }

  function renderGlobalModals() {
    return `${renderCalendarEventDetailModal()}${renderGarageRecordModal()}`;
  }

  function findCalendarEventById(id) {
    const key = String(id || '');
    if (!key) return null;
    return (state.calendar || []).find((event) => String(event.id || '') === key || String(event.cloudId || '') === key) || null;
  }

  function renderCalendarEventDetailModal() {
    const event = findCalendarEventById(calendarDetailEventId);
    if (!event) return '';
    const running = calendarEventIsRunning(event, now);
    const source = calendarSourceName(event.sourceId);
    return `
      <div class="app-modal-backdrop" data-modal-backdrop role="presentation">
        <section class="app-modal calendar-event-modal" role="dialog" aria-modal="true" aria-labelledby="calendar-event-title">
          <div class="app-modal-head">
            <div>
              <span class="badge ${running ? 'good' : ''}">${running ? 'probíhá' : event.date ? formatDate(event.date) : 'bez data'}</span>
              <h2 id="calendar-event-title">${escapeHtml(event.title || 'Událost')}</h2>
              <p>${escapeHtml(calendarEventMetaLabel(event, now))} · ${escapeHtml(source)}</p>
            </div>
            <button class="icon-btn" type="button" data-action="close-modal" aria-label="Zavřít detail události">×</button>
          </div>
          <div class="modal-detail-grid">
            <div class="modal-detail-card"><span>Datum</span><strong>${event.date ? formatDate(event.date) : '—'}</strong></div>
            <div class="modal-detail-card"><span>Čas</span><strong>${escapeHtml(calendarEventTimeLabel(event, now) || '—')}</strong></div>
            <div class="modal-detail-card"><span>Typ</span><strong>${escapeHtml(event.type || 'událost')}</strong></div>
            <div class="modal-detail-card"><span>Zdroj</span><strong>${escapeHtml(source)}</strong></div>
          </div>
          ${event.location ? `<div class="inline-note"><strong>Místo:</strong> ${escapeHtml(event.location)}</div>` : ''}
          ${event.note ? `<div class="inline-note"><strong>Poznámka:</strong> ${escapeHtml(event.note)}</div>` : ''}
          <div class="form-actions modal-actions">
            <button class="ghost-btn" type="button" data-action="close-modal">Zavřít</button>
            ${!event.cloudId ? `<button class="danger-btn" type="button" data-action="delete-calendar" data-id="${escapeHtml(event.id || '')}">Smazat událost</button>` : ''}
          </div>
        </section>
      </div>
    `;
  }

  function renderGarageRecordModal() {
    if (!garageModal) return '';
    const type = garageModal.type || '';
    const vehicle = state.vehicles.find((item) => item.id === garageModal.vehicleId) || state.vehicles.find((item) => item.id === garageVehicleId) || state.vehicles[0] || null;
    if (!vehicle) return '';
    let title = '';
    let subtitle = escapeHtml(vehicle.name || 'Auto');
    let form = '';
    if (type === 'add-fuel') {
      title = 'Přidat tankování';
      form = `
        <form data-form="add-fuel" data-vehicle-id="${escapeHtml(vehicle.id)}" class="compact-form garage-modal-form">
          <div class="form-grid two">
            ${field('Datum tankování', 'date', 'date', '', true, todayISO())}
            ${field('Stav km', 'odometer', 'number', 'např. 125000', true)}
            <div class="fuel-cost-row wide-row">
              ${fuelNumberField('Litry', 'liters', 'např. 42,5')}
              ${fuelNumberField('Cena za litr', 'pricePerLiter', 'např. 38,90')}
            </div>
            ${fuelNumberField('Cena celkem', 'price', 'např. 1600')}
            ${field('Poznámka', 'note', 'text', 'volitelné')}
          </div>
          <div class="form-actions modal-actions"><button class="primary-btn" type="submit">Uložit tankování</button><button class="ghost-btn" type="button" data-action="close-modal">Zrušit</button></div>
        </form>`;
    } else if (type === 'add-service') {
      title = 'Přidat servis / náklad';
      form = `
        <form data-form="add-service" data-vehicle-id="${escapeHtml(vehicle.id)}" class="compact-form garage-modal-form">
          <div class="form-grid two">
            ${field('Datum servisu', 'date', 'date', '', true, todayISO())}
            ${field('Stav km', 'odometer', 'number', 'volitelné')}
            ${field('Popis', 'title', 'text', 'olej / pneu / STK', true)}
            ${field('Cena', 'price', 'number', 'volitelné')}
            ${field('Poznámka', 'note', 'text', 'volitelné')}
          </div>
          <div class="form-actions modal-actions"><button class="primary-btn" type="submit">Uložit servis</button><button class="ghost-btn" type="button" data-action="close-modal">Zrušit</button></div>
        </form>`;
    } else if (type === 'edit-fuel') {
      const item = state.fuel.find((entry) => entry.id === garageModal.recordId);
      if (!item) return '';
      title = 'Upravit tankování';
      subtitle = `${escapeHtml(vehicle.name || 'Auto')} · ${formatDate(item.date)}`;
      form = renderGarageRecordEditForm('fuel', item);
    } else if (type === 'edit-service') {
      const item = state.services.find((entry) => entry.id === garageModal.recordId);
      if (!item) return '';
      title = 'Upravit servis / náklad';
      subtitle = `${escapeHtml(vehicle.name || 'Auto')} · ${formatDate(item.date)}`;
      form = renderGarageRecordEditForm('services', item);
    } else return '';
    return `
      <div class="app-modal-backdrop" data-modal-backdrop role="presentation">
        <section class="app-modal garage-record-modal" role="dialog" aria-modal="true" aria-labelledby="garage-modal-title">
          <div class="app-modal-head">
            <div>
              <span class="badge good">${subtitle}</span>
              <h2 id="garage-modal-title">${escapeHtml(title)}</h2>
              <p>Formulář je zvlášť, aby detail auta nezajížděl dolů.</p>
            </div>
            <button class="icon-btn" type="button" data-action="close-modal" aria-label="Zavřít formulář">×</button>
          </div>
          ${form}
        </section>
      </div>
    `;
  }

  function closeOverview() {
    if (!activeOverview) return;
    activeOverview = null;
    render();
  }

  function openOverview(type) {
    activeOverview = type || 'homecare';
    try {
      render();
    } catch (error) {
      console.error('Overview render failed', type, error);
      activeOverview = null;
      render();
      showToast('Rychlý přehled se nepovedlo otevřít. Data jsem neuložil ani nesmazal.');
    }
  }

  function overviewTarget(type) {
    const map = {
      calendar: { nav: 'calendar', tab: 'overview' },
      hdo: { nav: 'homecare', tab: 'hdo' },
      homecare: { nav: 'homecare', tab: 'hdo' },
      shopping: { nav: 'shopping', tab: 'list' },
      packages: { nav: 'packages', tab: 'active' },
      contracts: { nav: 'contracts', tab: 'overview' },
      garage: { nav: 'garage', tab: 'overview' },
      finance: { nav: 'finance', tab: 'summary' },
      tasks: { nav: 'homecare', tab: 'tasks' },
      waste: { nav: 'homecare', tab: 'waste' },
      important: { nav: 'homecare', tab: 'tasks' }
    };
    return map[type] || { nav: type || 'homecare', tab: '' };
  }

  function renderOverviewContent(type) {
    const hdo = getHdoStatus(now);
    const titleMap = {
      calendar: ['📅', 'Kalendář'],
      hdo: ['💡', 'HDO / nízký tarif'],
      homecare: ['🏠', 'Domácnost'],
      shopping: ['🛒', 'Nákupy'],
      packages: ['📦', 'Balíky'],
      contracts: ['📄', 'Smlouvy'],
      garage: ['🚗', 'Garáž'],
      finance: ['💰', 'Finance'],
      tasks: ['✅', 'Úkoly'],
      waste: ['♻️', 'Odpad'],
      important: ['⭐', 'Důležité']
    };
    const [icon, title] = titleMap[type] || ['🏠', 'Přehled'];
    let body = '';
    const target = overviewTarget(type);
    const navTarget = target.nav;
    const tabTarget = target.tab;

    if (type === 'hdo') {
      const rows = sortHdoWindowsForOverview(getSafeHdoWindows());
      const enabledRows = rows.filter((item) => item.enabled && timeToMinutes(item.start) !== null && timeToMinutes(item.end) !== null);
      const nextHdo = findNextHdoWindow(now);
      body = `
        <div class="overview-status ${hdo.active ? 'good' : 'warn'}"><strong>${hdo.active ? 'Nízký tarif právě běží' : 'Nízký tarif teď neběží'}</strong><span>${escapeHtml(hdo.message)}</span></div>
        ${renderOverviewSummary([
          { label: 'Okna', value: rows.length },
          { label: 'Aktivní', value: enabledRows.length, tone: enabledRows.length ? 'good' : '' },
          { label: 'Další změna', value: hdo.active ? 'běží' : nextHdo ? humanDuration(nextHdo.diffMinutes) : '—' }
        ])}
        ${rows.length ? `<div class="list compact-list">${rows.map((item) => {
          const isValidTime = timeToMinutes(item.start) !== null && timeToMinutes(item.end) !== null;
          return `<div class="item compact-item"><div class="item-top"><div class="item-title">${escapeHtml(item.label || 'HDO okno')}</div><span class="badge ${item.enabled && isValidTime ? 'good' : ''}">${item.enabled && isValidTime ? 'aktivní' : item.enabled ? 'zkontrolovat čas' : 'vypnuto'}</span></div><div class="item-meta">${escapeHtml(isValidTime ? hdoWindowTimeLabel(item) : 'čas není správně')} · ${escapeHtml(daysLabel(item.days))}${item.cloudId ? ' · cloud' : ' · lokálně'}</div></div>`;
        }).join('')}</div>` : renderEmptyCta({ icon: '💡', title: 'HDO není nastavené', text: 'Zadej časová okna nízkého tarifu a dashboard ukáže aktuální stav i další přepnutí.', nav: 'homecare', tab: 'hdo', label: 'Nastavit HDO' })}
      `;
    } else if (type === 'calendar') {
      const upcomingAll = upcomingCalendarEvents(now);
      const runningCount = upcomingAll.filter((event) => calendarEventIsRunning(event, now)).length;
      const todayCount = upcomingAll.filter((event) => event.date === todayISO()).length;
      const weekCount = upcomingAll.filter((event) => event.date && daysUntil(event.date) !== null && daysUntil(event.date) <= 7).length;
      const rows = upcomingAll.slice(0,8);
      body = `${renderOverviewSummary([{ label: 'Probíhá', value: runningCount, tone: runningCount ? 'good' : '' }, { label: 'Dnes', value: todayCount }, { label: 'Do 7 dnů', value: weekCount }])}${rows.length ? renderEventList(rows, false) : renderEmptyCta({ icon: '📅', title: 'Kalendář je prázdný', text: 'Přidej první událost a dashboard začne ukazovat dnešek i nejbližší dny.', nav: 'calendar', tab: 'add', label: 'Přidat událost' })}`;
    } else if (type === 'shopping') {
      const openItems = state.shopping.filter((item) => !item.done);
      const doneCount = state.shopping.filter((item) => item.done).length;
      const categoryCount = new Set(openItems.map((item) => item.category || 'Ostatní')).size;
      const rows = openItems.slice(0,10);
      body = `${renderOverviewSummary([{ label: 'Koupit', value: openItems.length }, { label: 'Hotovo', value: doneCount, tone: doneCount ? 'good' : '' }, { label: 'Kategorie', value: categoryCount }])}${rows.length ? `<div class="list compact-list overview-list">${rows.map(renderShoppingOverviewItem).join('')}</div>` : renderEmptyCta({ icon: '🛒', title: 'Nákup je prázdný', text: 'Přidej položku z katalogu nebo vlastní položku domácnosti.', nav: 'shopping', tab: 'list', label: 'Přidat položku' })}`;
    } else if (type === 'packages') {
      const activePackages = state.packages.filter((item) => !['delivered', 'archived'].includes(item.status));
      const deliveredCount = state.packages.filter((item) => item.status === 'delivered').length;
      const carrierCount = new Set(activePackages.map((item) => carrierLabel(item.carrier) || item.carrier || 'jiný')).size;
      const rows = activePackages.slice(0,8);
      body = `${renderOverviewSummary([{ label: 'Aktivní', value: activePackages.length }, { label: 'Doručené', value: deliveredCount, tone: deliveredCount ? 'good' : '' }, { label: 'Dopravci', value: carrierCount }])}${rows.length ? `<div class="list compact-list overview-list">${rows.map(renderPackageOverviewItem).join('')}</div>` : renderEmptyCta({ icon: '📦', title: 'Žádný aktivní balík', text: 'Přidej zásilku ručně. Později půjde automatika přes bezpečný backend.', nav: 'packages', tab: 'add', label: 'Přidat balík' })}`;
    } else if (type === 'contracts') {
      const sortedContracts = state.contracts.map((contract) => ({...contract, days: daysUntil(contract.validTo)})).sort((a,b)=>(a.days ?? 9999)-(b.days ?? 9999));
      const overdueCount = sortedContracts.filter((contract) => contract.days !== null && contract.days < 0).length;
      const soonCount = sortedContracts.filter((contract) => contract.days !== null && contract.days >= 0 && contract.days <= 30).length;
      const rows = sortedContracts.slice(0,8);
      body = `${renderOverviewSummary([{ label: 'Celkem', value: state.contracts.length }, { label: 'Do 30 dnů', value: soonCount, tone: soonCount ? 'warn' : '' }, { label: 'Po termínu', value: overdueCount, tone: overdueCount ? 'bad' : '' }])}${rows.length ? `<div class="list compact-list overview-list">${rows.map(renderContractOverviewItem).join('')}</div>` : renderEmptyCta({ icon: '📄', title: 'Žádné smlouvy', text: 'Přidej první pojistku, tarif nebo smlouvu a aplikace začne hlídat platnost.', nav: 'contracts', tab: 'add', label: 'Přidat smlouvu' })}`;
    } else if (type === 'garage') {
      const allAlerts = getVehicleAlerts();
      const alerts = allAlerts.slice(0,8);
      body = `${renderOverviewSummary([{ label: 'Auta', value: state.vehicles.length }, { label: 'Upozornění', value: allAlerts.length, tone: allAlerts.length ? 'warn' : 'good' }, { label: 'Záznamy', value: state.fuel.length + state.services.length }])}${alerts.length ? `<div class="list compact-list overview-list">${alerts.map(renderVehicleAlertOverviewItem).join('')}</div>` : `<div class="list compact-list overview-list">${state.vehicles.slice(0,6).map(renderGarageOverviewItem).join('') || renderEmptyCta({ icon: '🚗', title: 'Garáž je prázdná', text: 'Přidej první auto a dashboard začne hlídat STK, pojistku a servis.', nav: 'garage', tab: 'add', label: 'Přidat auto' })}</div>`}`;
    } else if (type === 'finance') {
      const summary = financeMonthSummary();
      const month = financeSelectedMonth();
      const rows = state.finance.filter((item) => String(item.date || '').slice(0, 7) === month).sort((a, b) => String(b.date || '').localeCompare(String(a.date || ''))).slice(0, 8);
      body = `${renderOverviewSummary([{ label: 'Příjmy', value: formatCurrency(summary.income), tone: 'good' }, { label: 'Výdaje', value: formatCurrency(summary.expense), tone: 'warn' }, { label: 'Rozdíl', value: formatCurrency(summary.balance), tone: summary.balance >= 0 ? 'good' : 'bad' }])}<div class="list compact-list overview-list">${rows.map(renderFinanceOverviewItem).join('') || renderEmptyCta({ icon: '💰', title: 'Finance jsou prázdné', text: 'Založ účet nebo přidej první pohyb. Přehled se začne počítat automaticky.', nav: 'finance', tab: 'accounts', label: 'Založit finance' })}</div>`;
    } else if (type === 'tasks') {
      const openTasks = state.homeTasks.filter((task) => !task.done);
      const urgentTasks = openTasks.filter((task) => task.due && daysUntil(task.due) !== null && daysUntil(task.due) <= 2).length;
      const doneCount = state.homeTasks.filter((task) => task.done).length;
      const tasks = openTasks.slice(0,8);
      body = `${renderOverviewSummary([{ label: 'Otevřené', value: openTasks.length }, { label: 'Brzy', value: urgentTasks, tone: urgentTasks ? 'warn' : '' }, { label: 'Hotovo', value: doneCount, tone: doneCount ? 'good' : '' }])}${tasks.length ? `<div class="list compact-list overview-list">${tasks.map(renderTaskOverviewItem).join('')}</div>` : renderEmptyCta({ icon: '✅', title: 'Žádné otevřené úkoly', text: 'Přidej domácí úkol, údržbu nebo připomínku.', nav: 'homecare', tab: 'tasks', label: 'Přidat úkol' })}`;
    } else if (type === 'waste') {
      const upcomingWaste = state.waste.map((item) => ({...item, days: daysUntil(item.date)})).filter((item)=>item.days === null || item.days >= 0).sort((a,b)=>(a.days ?? 9999)-(b.days ?? 9999));
      const nextWaste = upcomingWaste.find((item) => item.days !== null);
      const typeCount = new Set(state.waste.map((item) => item.type || 'jiný')).size;
      const waste = upcomingWaste.slice(0,8);
      body = `${renderOverviewSummary([{ label: 'Nejbližší', value: nextWaste ? dueBadge(nextWaste.days) : '—', tone: nextWaste?.days <= 1 ? 'warn' : '' }, { label: 'Typy', value: typeCount }, { label: 'Plánů', value: state.waste.length }])}${waste.length ? `<div class="list compact-list overview-list">${waste.map(renderWasteOverviewItem).join('')}</div>` : renderEmptyCta({ icon: '♻️', title: 'Svoz odpadu není nastavený', text: 'Přidej typ odpadu a termín. Dashboard pak ukáže nejbližší svoz.', nav: 'homecare', tab: 'waste', label: 'Přidat svoz' })}`;
    } else {
      const tasks = state.homeTasks.filter((task) => !task.done).slice(0,5);
      const waste = state.waste.map((item) => ({...item, days: daysUntil(item.date)})).filter((item)=>item.days !== null && item.days >= 0).sort((a,b)=>a.days-b.days).slice(0,4);
      body = `${tasks.length ? `<h3 class="overview-mini-title">Úkoly</h3><div class="list compact-list overview-list">${tasks.map(renderTaskOverviewItem).join('')}</div>` : ''}${waste.length ? `<h3 class="overview-mini-title">Odpad</h3><div class="list compact-list overview-list">${waste.map(renderWasteOverviewItem).join('')}</div>` : renderEmptyCta({ icon: '✨', title: 'Nic akutního tu není', text: 'Přidej úkol nebo svoz odpadu, ať má domácí přehled co hlídat.', nav: 'homecare', tab: 'tasks', label: 'Přidat úkol' })}`;
    }

    return `
      <div class="overview-head">
        <div><span class="overview-icon">${escapeHtml(icon)}</span><div><h2 id="overview-title">${escapeHtml(title)}</h2><p>Rychlý náhled bez úprav. Detail otevřeš dole.</p></div></div>
        <button class="icon-btn" type="button" data-action="close-overview" aria-label="Zavřít">×</button>
      </div>
      <div class="overview-body">${body}</div>
      <div class="form-actions overview-actions"><button class="primary-btn" type="button" data-nav="${escapeHtml(navTarget)}" ${tabTarget ? `data-target-tab="${escapeHtml(tabTarget)}"` : ''}>Otevřít modul</button><button class="ghost-btn" type="button" data-action="close-overview">Zavřít</button></div>
    `;
  }

  function renderOnboarding() {
    document.documentElement.dataset.theme = state.settings.theme || 'light';

    if (onboardingMode === 'choice') {
      app.innerHTML = `
        <div class="onboarding-screen">
          <section class="onboarding-card onboarding-choice-card compact-auth-card">
            <div class="onboarding-hero compact-auth-hero">
              <div class="brand-mark big logo-mark"><img src="${BRAND_ICON_SRC}" alt="Domácnost+" loading="eager"></div>
              <div>
                <span class="badge">${escapeHtml(APP_VERSION)}</span>
                <h1>Domácnost+</h1>
              </div>
            </div>

            <div class="grid two onboarding-choice-grid compact-login-grid">
              <article class="card flat choice-tile">
                <div class="choice-icon">🔐</div>
                <h2>Přihlášení</h2>
                <button class="primary-btn" type="button" data-action="onboarding-mode" data-mode="account">Přihlásit se</button>
              </article>
              <article class="card flat choice-tile">
                <div class="choice-icon">🏡</div>
                <h2>Demo</h2>
                <button class="ghost-btn" type="button" data-action="start-demo">Spustit demo</button>
              </article>
            </div>
          </section>
        </div>
        <div id="copy-toast" class="copy-toast" role="status" aria-live="polite"></div>
      `;
      return;
    }

    if (onboardingMode === 'register' || onboardingMode === 'google-setup') {
      const isGoogleSetup = onboardingMode === 'google-setup';
      const email = state.cloud?.email || '';
      const profileName = currentProfile()?.name || (email ? email.split('@')[0] : 'Já');
      app.innerHTML = `
        <div class="onboarding-screen">
          <section class="onboarding-card compact-auth-card">
            <div class="onboarding-hero compact-auth-hero">
              <div class="brand-mark big logo-mark"><img src="${BRAND_ICON_SRC}" alt="Domácnost+" loading="eager"></div>
              <div>
                <span class="badge">${escapeHtml(APP_VERSION)}</span>
                <h1>Nastavení domácnosti</h1>
              </div>
            </div>

            ${renderEmailConfirmationCard()}

            <section class="card flat">
              <form data-form="${isGoogleSetup ? 'onboarding-google-setup' : 'onboarding'}" class="stack-form">
                ${field('Název domácnosti', 'householdName', 'text', 'Špadrnovi / Doma / Byt', true)}
                ${isGoogleSetup ? `<input type="hidden" name="email" value="${escapeHtml(email)}">` : field('E-mail vlastníka', 'email', 'email', 'email@domena.cz', true)}
                ${isGoogleSetup ? '' : `
                  <div class="form-grid two">
                    ${field('Heslo', 'password', 'password', 'min. 6 znaků', true)}
                    ${field('Heslo znovu', 'passwordConfirm', 'password', 'pro kontrolu', true)}
                  </div>
                `}
                <div class="form-grid two">
                  ${field('Hlavní profil', 'profilePrimary', 'text', profileName, true)}
                  ${field('Druhý profil', 'profileSecondary', 'text', 'Manželka')}
                </div>
                ${field('Další profily', 'profilesExtra', 'text', 'děti, babička… odděl čárkou')}
                <details class="soft-details" open>
                  <summary>Vybrat moduly</summary>
                  <div class="module-check-grid">
                    ${MODULES.filter((module) => !['home', 'settings'].includes(module.id)).map((module) => moduleCheckbox(module, true)).join('')}
                  </div>
                </details>
                <div class="form-actions"><button class="primary-btn" type="submit">Dokončit nastavení domácnosti</button></div>
              </form>
            </section>

            <div class="form-actions onboarding-actions">
              <button class="ghost-btn" type="button" data-action="onboarding-mode" data-mode="account">Zpět</button>
            </div>
          </section>
        </div>
        <div id="copy-toast" class="copy-toast" role="status" aria-live="polite"></div>
      `;
      return;
    }

    app.innerHTML = `
      <div class="onboarding-screen">
        <section class="onboarding-card compact-auth-card">
          <div class="onboarding-hero compact-auth-hero">
            <div class="brand-mark big logo-mark"><img src="${BRAND_ICON_SRC}" alt="Domácnost+" loading="eager"></div>
            <div>
              <span class="badge">${escapeHtml(APP_VERSION)}</span>
              <h1>Přihlášení</h1>
            </div>
          </div>

          ${renderEmailConfirmationCard()}

          <div class="grid two compact-auth-grid">
            <section class="card flat">
              <div class="card-header"><div><h2>Přihlášení přes e-mail</h2></div></div>
              <form data-form="onboarding-login" class="stack-form">
                ${field('E-mail', 'email', 'email', 'email@domena.cz', true)}
                ${field('Heslo', 'password', 'password', 'heslo', true)}
                <div class="form-actions"><button class="primary-btn" type="submit">Přihlásit e-mailem</button></div>
              </form>
            </section>

            <section class="card flat">
              <div class="card-header"><div><h2>Přihlášení přes Google</h2></div></div>
              <button class="oauth-btn google-oauth-btn full-width" type="button" data-action="cloud-oauth-google" data-intent="login">
                <span aria-hidden="true">G</span>
                <strong>Přihlásit přes Google</strong>
              </button>
            </section>

            <section class="card flat">
              <div class="card-header"><div><h2>Registrace e-mailem</h2></div></div>
              <button class="primary-btn full-width" type="button" data-action="onboarding-mode" data-mode="register">Registrovat e-mailem</button>
            </section>

            <section class="card flat">
              <div class="card-header"><div><h2>Registrace přes Google</h2></div></div>
              <button class="oauth-btn google-oauth-btn full-width" type="button" data-action="cloud-oauth-google" data-intent="register">
                <span aria-hidden="true">G</span>
                <strong>Registrovat přes Google</strong>
              </button>
            </section>
          </div>

          <div class="form-actions onboarding-actions">
            <button class="ghost-btn" type="button" data-action="onboarding-mode" data-mode="choice">Zpět</button>
          </div>
        </section>
      </div>
      <div id="copy-toast" class="copy-toast" role="status" aria-live="polite"></div>
    `;
  }



  function renderOAuthButtons() {
    return `
      <div class="oauth-block">
        <div class="oauth-divider"><span>nebo rychleji</span></div>
        <div class="oauth-actions single">
          <button class="oauth-btn google-oauth-btn" type="button" data-action="cloud-oauth-google">
            <span aria-hidden="true">G</span>
            <strong>Pokračovat přes Google</strong>
          </button>
        </div>
        <div class="small-muted oauth-note">Google přihlášení slouží jen pro účet. Kalendář se připojuje samostatně v nastavení zdrojů.</div>
      </div>
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
      weather: 'Aktuální počasí, hodinový výhled a předpověď pro místo domácnosti.',
      home: 'Rychlý domácí přehled pro tablet i mobil. Online domácnost je hlavní zdroj, lokál jen cache/fallback.',
      calendar: 'Kalendář umí více zdrojů. Google Calendar je připravený přes bezpečný backend, ne přes tokeny ve frontendu.',
      packages: 'Základ pro sledování balíků. Teď ručně, později automatika přes backend.',
      shopping: 'Sdílený nákupní seznam s katalogem položek, jednotkami a cloudovým oddělením domácností.',
      homecare: 'HDO, odpad, poznámky, úkoly a domácí zařízení na jednom místě.',
      garage: 'Auta v domácnosti, tankování, servis a základní přehled spotřeby.',
      contracts: 'Evidence smluv a pojistek s hlídáním platnosti.',
      cameras: 'Přehled kamer. Metadata karet se sdílí cloudově, streamy později bezpečně přes lokální síť/VPN.',
      finance: 'Jednoduchý přehled příjmů a výdajů domácnosti s cloudovým oddělením podle householdId.',
      settings: 'Domácnost, profily, zapnuté moduly, export/import a reset offline prototypu.',
      more: 'Všechny další moduly a nastavení na jednom místě. Spodní lišta zůstává čistá a krátká.'
    };
    return subtitles[moduleId] || '';
  }

  function renderPageActions(moduleId) {
    if (moduleId === 'home' || moduleId === 'settings' || moduleId === 'more') return '';
    return `
      <div class="top-actions">
        <button class="ghost-btn" type="button" data-nav="settings">Nastavení</button>
      </div>
    `;
  }

  function renderModule(moduleId) {
    const renderers = {
      home: renderDashboard,
      weather: renderWeatherPage,
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
    const renderer = renderers[moduleId] || renderDashboard;
    try {
      return renderer();
    } catch (error) {
      console.error(`Domácnost+ render modulu ${moduleId} spadl`, error);
      if (moduleId === 'garage') return renderGarageRecovery(error);
      return renderModuleRecovery(moduleId, error);
    }
  }

  function renderModuleRecovery(moduleId, error) {
    const module = MODULES.find((item) => item.id === moduleId) || { label: moduleId || 'Modul', icon: '⚠️' };
    return `
      <section class="card desktop-span-2 module-error-card">
        <div class="card-header"><div><h2>${escapeHtml(module.icon)} ${escapeHtml(module.label)}</h2><p>Modul se nenačetl čistě, ale aplikace zůstala běžet.</p></div><span class="badge warn">chyba renderu</span></div>
        <div class="inline-note"><strong>Technicky:</strong> ${escapeHtml(error?.message || String(error || 'neznámá chyba'))}</div>
        <div class="form-actions"><button class="ghost-btn" type="button" data-nav="home">Zpět domů</button><button class="ghost-btn" type="button" data-action="soft-ui-reset">Vyčistit UI stav</button></div>
      </section>
    `;
  }

  function renderGarageRecovery(error) {
    const vehicles = Array.isArray(state.vehicles) ? state.vehicles.filter(Boolean) : [];
    return `
      <section class="card desktop-span-2 module-error-card">
        <div class="card-header"><div><h2>🚗 Garáž</h2><p>Garáž se zachytila v bezpečném režimu. Data nejsou smazaná.</p></div><span class="badge warn">oprava UI</span></div>
        <div class="inline-note"><strong>Technicky:</strong> ${escapeHtml(error?.message || String(error || 'neznámá chyba'))}</div>
        <div class="cloud-status-grid compact-cloud-stats">
          <div class="mini-stat"><span>Auta</span><strong>${vehicles.length}</strong></div>
          <div class="mini-stat"><span>Tankování</span><strong>${Array.isArray(state.fuel) ? state.fuel.length : 0}</strong></div>
          <div class="mini-stat"><span>Servisy</span><strong>${Array.isArray(state.services) ? state.services.length : 0}</strong></div>
          <div class="mini-stat"><span>Build</span><strong>112</strong></div>
        </div>
        <div class="form-actions"><button class="ghost-btn" type="button" data-action="garage-ui-repair">Opravit stav Garáže</button><button class="ghost-btn" type="button" data-nav="home">Zpět domů</button></div>
      </section>
    `;
  }

  const DEFAULT_CALENDAR_EVENT_MINUTES = 60;

  function calendarEventStartMs(event) {
    if (!event?.date) return Number.MAX_SAFE_INTEGER;
    if (!event.time) return new Date(buildCalendarDateTime(event.date, '00:00')).getTime();
    return new Date(buildCalendarDateTime(event.date, event.time)).getTime();
  }

  function calendarEventEndMs(event) {
    if (!event?.date) return Number.MAX_SAFE_INTEGER;
    const startMs = calendarEventStartMs(event);
    if (!Number.isFinite(startMs)) return Number.MAX_SAFE_INTEGER;
    if (!event.time) return new Date(buildCalendarDateTime(event.date, '23:59')).getTime() + 59999;
    if (event.endTime) {
      let endMs = new Date(buildCalendarDateTime(event.date, event.endTime, event.time)).getTime();
      if (Number.isFinite(endMs) && endMs <= startMs) endMs += 24 * 60 * 60 * 1000;
      return endMs;
    }
    return startMs + DEFAULT_CALENDAR_EVENT_MINUTES * 60 * 1000;
  }

  function calendarEventIsRunning(event, referenceDate = now) {
    const refMs = toSafeDate(referenceDate, new Date()).getTime();
    return calendarEventStartMs(event) <= refMs && calendarEventEndMs(event) > refMs;
  }

  function calendarEventIsRelevant(event, referenceDate = now) {
    if (!event?.date) return true;
    const refMs = toSafeDate(referenceDate, new Date()).getTime();
    return calendarEventEndMs(event) > refMs;
  }

  function sortCalendarEventsByStart(rows) {
    return [...(rows || [])].sort((a, b) => calendarEventStartMs(a) - calendarEventStartMs(b) || String(a.title || '').localeCompare(String(b.title || '')));
  }

  function upcomingCalendarEvents(referenceDate = now) {
    return sortCalendarEventsByStart(visibleCalendarEvents().filter((event) => calendarEventIsRelevant(event, referenceDate)));
  }

  function calendarEventTimeLabel(event, referenceDate = now) {
    if (!event) return '';
    const running = calendarEventIsRunning(event, referenceDate);
    if (!event.time) return event.date === todayISO() ? 'dnes · celý den' : `${shortDateText(event.date)} · celý den`;
    const range = event.endTime ? `${event.time}–${event.endTime}` : event.time;
    if (running) return event.endTime ? `probíhá do ${event.endTime}` : `probíhá od ${event.time}`;
    if (event.date === todayISO()) return `dnes ${range}`;
    return `${shortDateText(event.date)} · ${range}`;
  }

  function calendarEventMetaLabel(event, referenceDate = now) {
    const timeLabel = calendarEventTimeLabel(event, referenceDate);
    return `${timeLabel}${event?.location ? ` · ${event.location}` : ''}${event?.note ? ` · ${event.note}` : ''}`;
  }

  function renderDashboard() {
    const calendarPanelEvents = upcomingCalendarEvents(now);
    const todayEvents = calendarPanelEvents
      .filter((event) => event.date === todayISO())
      .sort((a, b) => calendarEventStartMs(a) - calendarEventStartMs(b));
    const upcomingEvents = calendarPanelEvents.slice(0, 6);
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
    ensureWeatherFresh(false);
    const weather = normalizeWeatherState(state.weather);
    const dashboardContext = { hdo, todayEvents, upcomingEvents, calendarPanelEvents, activePackages, urgentContracts, openShopping, openTasks, wasteSoon, vehicleAlerts, visibleModules, weather, notes: state.notes, devices: state.devices, cameras: state.cameras, coupons: state.coupons, contracts: state.contracts };
    const selectedHeroItems = normalizeHomeHeroIds(state.settings?.homeHeroItems);
    const heroCount = selectedHeroItems.length;

    return `
      <div class="dashboard-v10 dashboard-empty-home">
        <section class="card hero-card station-hero home-minimal-hero home-hero-count-${heroCount}">
          <div class="station-hero-main">
            <div class="station-clock-area">
              <div class="hero-clock-row">
                <button class="hero-clock-copy hero-clock-button" type="button" data-nav="calendar" data-target-tab="overview" aria-label="Otevřít kalendář">
                  <div class="hero-time">${clockText(now)}</div>
                  <div class="hero-date">${escapeHtml(formatDateTime(now))}</div>
                </button>
                ${renderHeroWeatherPill(dashboardContext, { expanded: heroCount === 0 })}
              </div>
            </div>
            ${heroCount ? `<div class="station-summary station-summary-count-${heroCount}">${renderHomeHeroSummaryItems(dashboardContext)}</div>` : ''}
          </div>
        </section>
      </div>
    `;
  }

  function homeCycleIndex(length, seconds = 45) {
    const count = Number(length || 0);
    if (count <= 1) return 0;
    const slot = Math.floor(now.getTime() / Math.max(1000, Number(seconds || 45) * 1000));
    return Math.abs(slot) % count;
  }

  function renderHeroWeatherPill(ctx, options = {}) {
    const weather = normalizeWeatherState(ctx?.weather || state.weather);
    const current = weather.current || {};
    const [condition, currentIcon] = weatherCodeLabel(current.weatherCode);
    const hasCurrent = Boolean(weather.current);
    const daily = Array.isArray(weather.daily) ? weather.daily.slice(0, 4) : [];
    const compactSlides = [];
    compactSlides.push({
      icon: currentIcon,
      value: hasCurrent ? roundWeather(current.temperature, '°') : '—',
      label: weather.loading ? 'Načítám' : (weather.error && !hasCurrent) ? 'Chyba' : hasCurrent ? condition : 'Počasí'
    });
    if (!options.expanded && daily.length) {
      daily.slice(1, 4).forEach((day) => {
        const [dayLabel, dayIcon] = weatherCodeLabel(day.weatherCode);
        compactSlides.push({
          icon: dayIcon,
          value: roundWeather(day.max, '°'),
          label: `${shortWeekday(day.date)} · ${dayLabel}`
        });
      });
    }
    const activeSlide = compactSlides[homeCycleIndex(compactSlides.length, 45)] || compactSlides[0];
    const forecast = options.expanded && daily.length ? `
          <span class="hero-weather-forecast" aria-label="Výhled počasí na další dny">
            ${daily.map((day, index) => {
              const [, dayIcon] = weatherCodeLabel(day.weatherCode);
              const label = index === 0 ? 'Dnes' : shortWeekday(day.date);
              return `<span class="hero-weather-day"><em>${escapeHtml(label)}</em><strong>${escapeHtml(dayIcon)} ${roundWeather(day.max, '°')}</strong><small>${roundWeather(day.min, '°')}</small></span>`;
            }).join('')}
          </span>` : '';
    return `
      <button class="hero-weather-pill ${options.expanded ? 'hero-weather-pill-expanded' : ''} ${compactSlides.length > 1 ? 'hero-weather-pill-live' : ''}" type="button" data-nav="weather" aria-label="Otevřít podrobné počasí">
        ${renderGlassIcon(activeSlide.icon, { size: options.expanded ? 'hero-lg' : 'hero-md', extraClass: 'hero-weather-icon' })}
        <span class="hero-weather-copy"><strong>${escapeHtml(activeSlide.value)}</strong><em>${escapeHtml(activeSlide.label)}</em></span>
        ${forecast}
      </button>
    `;
  }

  function renderHomeHeroSummaryItems(ctx) {
    const selected = normalizeHomeHeroIds(state.settings?.homeHeroItems);
    const heroCount = selected.length;
    const density = heroCount <= 4 ? 'large' : 'small';
    return selected.map((id) => {
      const item = homeHeroItemById(id);
      const metric = typeof item.metric === 'function' ? item.metric(ctx) : '—';
      const text = typeof item.text === 'function' ? item.text(ctx) : item.label;
      const presentation = getHomeHeroItemPresentation(id, ctx, item, metric, text, { density, heroCount });
      const attrs = id === 'calendar'
        ? 'data-nav="calendar" data-target-tab="overview"'
        : item.nav
          ? `data-nav="${escapeHtml(item.nav)}"${item.tab ? ` data-target-tab="${escapeHtml(item.tab)}"` : ''}`
          : `data-action="open-overview" data-overview="${escapeHtml(item.overview)}"`;
      const chips = Array.isArray(presentation.chips) && presentation.chips.length
        ? `<span class="station-summary-chipline">${presentation.chips.slice(0, density === 'large' ? 4 : 3).map((chip) => `<b>${escapeHtml(chip)}</b>`).join('')}</span>`
        : '';
      const extraRows = Array.isArray(presentation.extraRows) && presentation.extraRows.length
        ? `<span class="station-summary-extra" aria-label="Další položky">${presentation.extraRows.slice(0, density === 'large' ? 5 : density === 'medium' ? 2 : 0).map((row) => `<b>${escapeHtml(row)}</b>`).join('')}</span>`
        : '';
      return `
        <button class="station-summary-item station-summary-item-${escapeHtml(id)} station-summary-size-${density} station-summary-tone-${escapeHtml(presentation.tone || 'neutral')} ${presentation.live ? 'station-summary-live' : ''}" type="button" ${attrs}>
          ${renderGlassIcon(getHomeIconKind(id), { size: density === 'large' ? 'home-lg' : 'home-sm', extraClass: 'station-summary-icon' })}
          <span class="station-summary-copy">
            <em>${escapeHtml(item.label)}</em>
            <strong class="station-summary-metric">${escapeHtml(presentation.metric)}</strong>
            <span class="station-summary-primary">${escapeHtml(presentation.text)}</span>
            ${presentation.detail ? `<small class="station-summary-detail">${escapeHtml(presentation.detail)}</small>` : ''}
            ${chips}
            ${extraRows}
          </span>
        </button>`;
    }).join('');
  }

  function getHomeHeroItemPresentation(id, ctx, item, metric, text, options = {}) {
    const density = options.density || 'small';
    const extraLimit = density === 'large' ? 5 : density === 'medium' ? 2 : 0;
    const base = { metric: metric ?? '—', text: text || item?.label || '', detail: '', chips: [], extraRows: [], tone: 'neutral' };
    const firstTitle = (value, fallback = '—') => normalizeText(value?.title || value?.name || value?.label || value?.store || value?.provider || value?.note || fallback);
    const detailRows = (rows, mapper) => extraLimit ? rows.slice(0, extraLimit).map(mapper).filter(Boolean) : [];
    const nextDateLine = (date, prefix = '') => {
      const days = daysUntil(date);
      if (days === null) return '';
      return `${prefix}${dueBadge(days)}`.trim();
    };
    if (id === 'hdo') return getHdoHeroPresentation(ctx, options);
    if (id === 'polishHolidays') {
      const todayEntry = polishShopTodayEntry(0);
      const tomorrowEntry = polishShopTodayEntry(1);
      const nextClosed = nextPolishShopEntry('closed');
      const nextLimited = nextPolishShopEntry('limited');
      const isClosed = todayEntry?.status === 'closed';
      const isLimited = todayEntry?.status === 'limited';
      return {
        ...base,
        metric: isClosed ? 'Zavřeno' : isLimited ? 'Pozor' : nextClosed ? dueBadge(daysUntil(nextClosed.date)) : 'OK',
        text: isClosed || isLimited ? todayEntry.name : nextClosed ? `${formatDate(nextClosed.date)} · ${nextClosed.name}` : 'Bez známého zavření',
        detail: tomorrowEntry ? `Zítra: ${tomorrowEntry.name}` : nextLimited ? `Pozor: ${formatDate(nextLimited.date)} · ${nextLimited.name}` : 'Kliknutím otevřeš polské svátky',
        tone: isClosed ? 'bad' : isLimited || nextClosed && daysUntil(nextClosed.date) <= 3 ? 'warn' : 'good'
      };
    }
    if (id === 'calendar') {
      const events = (ctx.calendarPanelEvents || ctx.upcomingEvents || []);
      const runningEvents = events.filter((event) => calendarEventIsRunning(event, now));
      const slideEvents = runningEvents.length ? runningEvents : events.slice(0, 5);
      const next = slideEvents[homeCycleIndex(slideEvents.length, 45)] || events[0];
      const isRunning = next ? calendarEventIsRunning(next, now) : false;
      return {
        ...base,
        metric: isRunning ? 'Nyní' : next ? 'Další' : 'Volno',
        text: next ? firstTitle(next, 'Událost') : 'Žádná nadcházející událost',
        detail: next ? calendarEventTimeLabel(next, now) : 'Kliknutím otevřeš kalendář',
        chips: [],
        extraRows: [],
        live: slideEvents.length > 1,
        tone: isRunning || next ? 'good' : 'neutral'
      };
    }
    if (id === 'packages') {
      const active = ctx.activePackages || [];
      const first = active[0];
      return { ...base, metric: active.length, text: first ? firstTitle(first, 'Balík') : 'Žádný aktivní balík', detail: first ? normalizeText(first.statusLabel || first.status || first.carrier || first.trackingNumber || 'sledovat zásilku') : 'Nový balík přidáš ručně', extraRows: detailRows(active, (entry) => `${carrierLabel(entry.carrier) || 'Balík'} · ${firstTitle(entry, entry.tracking || 'zásilka')}`), tone: active.length ? 'warn' : 'good' };
    }
    if (id === 'shopping') {
      const open = ctx.openShopping || [];
      return { ...base, metric: open.length, text: open[0] ? firstTitle(open[0], 'Položka') : 'Nákup je prázdný', detail: open.length > 1 ? `+${open.length - 1} další položky` : 'Kliknutím otevřeš seznam', chips: open.slice(0, density === 'large' ? 4 : 2).map((entry) => firstTitle(entry, '')).filter(Boolean), extraRows: detailRows(open, (entry) => `${firstTitle(entry, 'Položka')}${entry.quantity ? ` · ${entry.quantity}` : ''}`), tone: open.length ? 'warn' : 'good' };
    }
    if (id === 'coupons') {
      const unused = (state.coupons || []).filter((entry) => !entry.used);
      const expiring = unused.map((entry) => ({ ...entry, days: daysUntil(entry.expiry) })).filter((entry) => entry.days !== null).sort((a, b) => a.days - b.days)[0];
      return { ...base, metric: unused.length, text: expiring ? firstTitle(expiring, 'Kupón') : 'Žádný nepoužitý kód', detail: expiring ? `platí ${dueBadge(expiring.days)}` : 'Ulož si slevový kód', tone: expiring && expiring.days <= 7 ? 'warn' : unused.length ? 'good' : 'neutral' };
    }
    if (id === 'waste') {
      const upcoming = (state.waste || []).map((entry) => ({ ...entry, days: daysUntil(entry.date) })).filter((entry) => entry.days !== null && entry.days >= 0).sort((a, b) => a.days - b.days);
      const next = upcoming[0];
      return { ...base, metric: next ? dueBadge(next.days) : '—', text: next ? firstTitle(next, 'Svoz') : 'Svoz není nastavený', detail: next ? shortDateText(next.date) : 'Přidej termín odpadu', extraRows: detailRows(upcoming, (entry) => `${shortDateText(entry.date)} · ${firstTitle(entry, 'Svoz')}`), tone: next?.days <= 1 ? 'warn' : next ? 'good' : 'neutral' };
    }
    if (id === 'tasks') {
      const open = ctx.openTasks || [];
      const first = open[0];
      return { ...base, metric: open.length, text: first ? firstTitle(first, 'Úkol') : 'Nic nečeká', detail: first?.due ? `termín ${dueBadge(daysUntil(first.due))}` : 'Domácí úkoly jsou čisté', extraRows: detailRows(open, (entry) => `${entry.due ? `${shortDateText(entry.due)} · ` : ''}${firstTitle(entry, 'Úkol')}`), tone: open.length ? 'warn' : 'good' };
    }
    if (id === 'notes') {
      const notes = state.notes || [];
      const last = notes[0];
      return { ...base, metric: notes.length, text: last ? firstTitle(last, 'Poznámka') : 'Žádné poznámky', detail: last?.text ? normalizeText(last.text).slice(0, 48) : 'Rychlé domácí poznámky', tone: notes.length ? 'good' : 'neutral' };
    }
    if (id === 'devices') {
      const devices = state.devices || [];
      const active = devices.filter((device) => device.status !== 'offline' && device.status !== 'archived').length;
      return { ...base, metric: devices.length, text: devices[0] ? firstTitle(devices[0], 'Zařízení') : 'Žádné zařízení', detail: devices.length ? `${active} aktivní / ${devices.length} celkem` : 'Přidej domácí zařízení', tone: devices.length ? 'good' : 'neutral' };
    }
    if (id === 'garage') {
      const alert = (ctx.vehicleAlerts || [])[0];
      const vehicles = state.vehicles || [];
      const vehicleCount = vehicles.length;
      if (vehicleCount) {
        const selectedVehicle = vehicles[homeCycleIndex(vehicleCount, 45)] || vehicles[0];
        const fuelRows = sortFuelRows((state.fuel || []).filter((entry) => entry.vehicleId === selectedVehicle.id));
        const stats = getVehicleStats(fuelRows, []);
        const fuelCostPerKm = stats.totalKm > 0 ? stats.fuelCost / stats.totalKm : null;
        const consumption = stats.averageConsumption ? `${stats.averageConsumption.toFixed(1).replace('.', ',')} l/100` : 'spotřeba bez dat';
        const fuelKm = fuelCostPerKm ? `${fuelCostPerKm.toFixed(2).replace('.', ',')} Kč/km palivo` : 'Kč/km bez dat';
        return { ...base, metric: firstTitle(selectedVehicle, 'Auto'), text: consumption, detail: fuelKm, live: vehicleCount > 1, tone: alert ? 'warn' : 'good' };
      }
      return { ...base, metric: 0, text: garageCountLabel(0), detail: 'Přidej první auto', tone: 'neutral' };
    }
    if (id === 'contracts') {
      const urgent = (ctx.urgentContracts || [])[0];
      return { ...base, metric: state.contracts.length, text: urgent ? firstTitle(urgent, 'Smlouva') : 'Žádná akutní smlouva', detail: urgent ? `končí ${dueBadge(urgent.days)}` : 'Hlídání platností je klidné', tone: urgent ? 'warn' : state.contracts.length ? 'good' : 'neutral' };
    }
    if (id === 'finance') {
      const summary = financeMonthSummary();
      return { ...base, metric: formatCurrency(summary.balance), text: summary.balance >= 0 ? 'měsíc v plusu' : 'měsíc v mínusu', detail: `Příjmy ${formatCurrency(summary.income)} · výdaje ${formatCurrency(summary.expense)}`, tone: summary.balance >= 0 ? 'good' : 'warn' };
    }
    if (id === 'cameras') {
      const cameras = state.cameras || [];
      const online = cameras.filter((camera) => camera.status === 'online' || camera.status === 'active').length;
      return { ...base, metric: cameras.length, text: cameras[0] ? firstTitle(cameras[0], 'Kamera') : 'Žádná kamera', detail: cameras.length ? `${online} online / ${cameras.length} celkem` : 'Přidej kameru do přehledu', tone: cameras.length ? 'good' : 'neutral' };
    }
    return base;
  }

  function getHdoHeroPresentation(ctx, options = {}) {
    const safeDate = toSafeDate(now, new Date());
    const minuteNow = safeDate.getHours() * 60 + safeDate.getMinutes();
    const extraLimit = options.density === 'large' ? 5 : options.density === 'medium' ? 2 : 0;
    const allEnabled = getSafeHdoWindows().filter((entry) => entry.enabled && timeToMinutes(entry.start) !== null && timeToMinutes(entry.end) !== null);
    const enabledToday = allEnabled.filter((entry) => hdoWindowMatchesDate(entry, safeDate));
    const enabled = enabledToday.length ? enabledToday : allEnabled;
    const extraRows = extraLimit ? sortHdoWindowsForOverview(enabled).slice(0, extraLimit).map((entry) => hdoWindowTimeLabel(entry)) : [];
    const active = enabledToday.find((entry) => isTimeInWindow(minuteNow, entry.start, entry.end));
    if (active) {
      const endMinutes = timeToMinutes(active.end);
      let diff = endMinutes - minuteNow;
      if (diff <= 0) diff += 1440;
      return {
        metric: 'Běží',
        text: `do ${active.end}`,
        detail: `ještě ${humanDuration(diff)}`,
        chips: [daysLabel(active.days)],
        extraRows,
        tone: 'good'
      };
    }
    const next = findNextHdoWindow(safeDate);
    if (next) {
      return {
        metric: `za ${humanDuration(next.diffMinutes)}`,
        text: hdoWindowTimeLabel(next.item),
        detail: '',
        chips: [daysLabel(next.item.days)],
        extraRows,
        tone: 'warn'
      };
    }
    return { metric: '—', text: 'HDO není nastavené', detail: 'Přidej okna nízkého tarifu', chips: [], extraRows: [], tone: 'neutral' };
  }


  function renderDashboardWidget(id, ctx) {
    switch (id) {
      case 'weather':
      case 'cloud':
        return '';
      case 'setup':
        return `${renderStarterStateCard()}${renderSetupChecklist()}`;
      case 'focus':
        return `<section class="tablet-focus-grid dashboard-widget-block" data-dashboard-widget="focus">${ctx.focusItems.map(renderDashboardFocusItem).join('')}</section>`;
      case 'timeline':
        return `
          <section class="card tablet-agenda-card dashboard-widget-block" data-dashboard-widget="timeline">
            <div class="card-header">
              <div><h2>Dnes a brzy</h2><p>Rychlý přehled věcí, které by na domácím tabletu měly být vidět hned.</p></div>
              <span class="badge">${ctx.focusItems.length} položek</span>
            </div>
            <div class="timeline-list">
              ${renderDashboardTimeline(ctx.todayEvents, ctx.upcomingEvents, ctx.urgentContracts, ctx.openTasks, ctx.wasteSoon, ctx.vehicleAlerts)}
            </div>
          </section>
        `;
      case 'now':
        return `
          <section class="card tablet-now-card dashboard-widget-block" data-dashboard-widget="now">
            <div class="card-header">
              <div><h2>Teď doma</h2><p>${escapeHtml(state.settings.dashboardNote || '')}</p></div>
              <span class="badge ${ctx.hdo.active ? 'good' : 'warn'}">HDO ${ctx.hdo.active ? 'běží' : 'neběží'}</span>
            </div>
            <div class="list">
              <button class="item module-hub-item" type="button" data-action="open-overview" data-overview="hdo">
                <div class="item-top"><div class="item-title">Nízký tarif</div><span class="badge ${ctx.hdo.active ? 'good' : 'warn'}">${escapeHtml(ctx.hdo.label)}</span></div>
                <div class="item-meta">${escapeHtml(ctx.hdo.message)}</div>
              </button>
              <button class="item module-hub-item" type="button" data-action="open-overview" data-overview="shopping">
                <div class="item-top"><div class="item-title">Nákupy</div><span class="badge ${ctx.openShopping.length ? 'warn' : 'good'}">${ctx.openShopping.length} koupit</span></div>
                <div class="item-meta">${ctx.openShopping.slice(0, 3).map((item) => item.name).filter(Boolean).join(' · ') || 'Nákupní seznam je prázdný.'}</div>
              </button>
            </div>
          </section>
        `;
      case 'readiness':
        return '';
      case 'modules':
        return `
          <section class="card desktop-span-2 tablet-modules-card dashboard-widget-block" data-dashboard-widget="modules">
            <div class="card-header">
              <div><h2>Rychlé moduly</h2><p>Zapnuté části domácnosti. Viditelnost karet hlavní obrazovky se nastavuje samostatně.</p></div>
              <button class="ghost-btn" type="button" data-nav="more">Více</button>
            </div>
            <div class="grid four">
              ${ctx.visibleModules.filter((module) => module.id !== 'home' && module.id !== 'settings').map(renderModuleStatusCard).join('')}
            </div>
          </section>
        `;
      default:
        return '';
    }
  }

  function renderDashboardWidgetDock(widgetIds) {
    const selected = new Set(widgetIds);
    const hiddenCount = DASHBOARD_WIDGETS.filter((widget) => !selected.has(widget.id)).length;
    return `
      <section class="card dashboard-layout-card dashboard-widget-block" data-dashboard-widget="layout">
        <div class="card-header compact-card-header">
          <div><h2>Hlavní obrazovka</h2><p>Zapnuté sekce Home se dají přidávat a odebírat. Počasí se nastavuje v horním rychlém panelu.</p></div>
          <span class="badge ${hiddenCount ? 'warn' : 'good'}">${widgetIds.length}/${DASHBOARD_WIDGETS.length}</span>
        </div>
        <div class="dashboard-widget-chip-row">
          ${DASHBOARD_WIDGETS.map((widget) => `
            <button class="quick-chip dashboard-widget-chip ${selected.has(widget.id) ? 'active' : ''}" type="button" data-action="toggle-dashboard-widget" data-id="${escapeHtml(widget.id)}">
              <span>${escapeHtml(widget.icon)}</span><strong>${escapeHtml(widget.label)}</strong>
            </button>
          `).join('')}
        </div>
        <div class="form-actions compact-actions"><button class="ghost-btn" type="button" data-nav="settings" data-target-tab="dashboard">Podrobné nastavení</button><button class="ghost-btn" type="button" data-action="dashboard-reset-widgets">Výchozí karty</button></div>
      </section>
    `;
  }

  function weatherSourceLabel(source = state.weather?.source) {
    const normalized = normalizeWeatherSource(source);
    if (normalized === 'chmi') return 'ČHMÚ';
    if (normalized === 'open-meteo-fallback') return 'Open-Meteo fallback';
    if (normalized === 'demo') return 'Demo';
    return 'Open-Meteo';
  }

  function renderGlassIcon(kind, options = {}) {
    const size = options.size || 'md';
    const extraClass = options.extraClass ? ` ${options.extraClass}` : '';
    const svg = getGlassIconSvg(kind);
    return `<span class="glass-icon glass-icon-${escapeHtml(String(kind || 'generic'))} glass-icon-size-${escapeHtml(String(size))}${extraClass}" aria-hidden="true">${svg}</span>`;
  }

  function getHomeIconKind(id) {
    return {
      calendar: 'calendar',
      packages: 'package',
      shopping: 'cart',
      coupons: 'tag',
      hdo: 'bulb',
      waste: 'recycle',
      tasks: 'check',
      notes: 'note',
      devices: 'plug',
      warranties: 'receipt',
      polishHolidays: 'flag-pl',
      garage: 'car',
      contracts: 'doc',
      finance: 'coins',
      cameras: 'camera',
      weather: 'weather-partly-cloud',
      homecare: 'home'
    }[String(id || '')] || 'generic';
  }

  function getGlassIconSvg(kind) {
    const icons = {
      calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="3.2"/><path d="M7.5 3.8v3.4M16.5 3.8v3.4M3.5 9.5h17M8 13h3M13 13h3M8 17h3"/></svg>`,
      package: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="M12 21V12m8-4.5-8 4.5-8-4.5M8 5l8 4.5"/></svg>`,
      cart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="19" r="1.8"/><circle cx="17" cy="19" r="1.8"/><path d="M4 5h2l2.1 8.2a1 1 0 0 0 1 .8h7.9a1 1 0 0 0 1-.8L20 8H7"/></svg>`,
      tag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 11V5.7A2.2 2.2 0 0 1 5.7 3.5H11l8.5 8.5a2.2 2.2 0 0 1 0 3.1l-4.4 4.4a2.2 2.2 0 0 1-3.1 0L3.5 11Z"/><circle cx="8" cy="8" r="1.4"/></svg>`,
      bulb: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M8.5 14.5c-1.4-1-2.5-2.8-2.5-5A6 6 0 0 1 12 3.5a6 6 0 0 1 6 6c0 2.2-1 4-2.5 5-.9.7-1.5 1.6-1.5 2.5h-4c0-.9-.6-1.8-1.5-2.5Z"/></svg>`,
      recycle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m10 3 2 3-2 3M12 6H8.8A2.8 2.8 0 0 0 6.4 7.5L5 10"/><path d="m19 14-3 .2-1.8-2.6M16 14.2l1.6 2.5A2.8 2.8 0 0 1 15.2 21H12"/><path d="m5 13 1-2.8 3 .2M6 10.2 4.4 12.7A2.8 2.8 0 0 0 6.8 17H10"/></svg>`,
      check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="m8.5 12.2 2.4 2.5 4.7-5"/></svg>`,
      note: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5h8l4 4V20a.5.5 0 0 1-.5.5h-11A.5.5 0 0 1 6 20V3.5Z"/><path d="M14 3.5V8h4M9 12h6M9 15.5h6"/></svg>`,
      plug: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 9h8v4a4 4 0 0 1-4 4 4 4 0 0 1-4-4V9Z"/><path d="M10 5v4M14 5v4M12 17v4"/></svg>`,
      receipt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3.5h10v17l-2.2-1.4-2.8 1.4-2.8-1.4L7 20.5v-17Z"/><path d="M9.2 8.5h5.6M9.2 12h5.6M9.2 15.5h4.2"/></svg>`,
      'flag-pl': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4v16"/><path d="M7 5.2h10.4a1 1 0 0 1 .9 1.4l-1.1 2.4 1.1 2.4a1 1 0 0 1-.9 1.4H7Z"/><path d="M7 10.2h10.1" stroke-width="4.2" opacity=".32"/></svg>`,
      car: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 15.5V12l1.8-4.2A2 2 0 0 1 8.6 6.5h6.8a2 2 0 0 1 1.8 1.3L19 12v3.5"/><path d="M5 15.5h14"/><circle cx="8" cy="16.5" r="1.8"/><circle cx="16" cy="16.5" r="1.8"/><path d="M7.4 9.5h9.2"/></svg>`,
      doc: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-10A.5.5 0 0 1 7 20V3.5Z"/><path d="M14 3.5V8h4M9.2 12h5.6M9.2 15.5h5.6"/></svg>`,
      coins: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="7" rx="5.8" ry="2.7"/><path d="M6.2 7v4c0 1.5 2.6 2.7 5.8 2.7s5.8-1.2 5.8-2.7V7"/><path d="M8.2 14.2v2.2c0 1.2 1.7 2.2 3.8 2.2 2.1 0 3.8-1 3.8-2.2v-2.2"/></svg>`,
      camera: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8.5h2.5l1.3-2h6.4l1.3 2H19a1.5 1.5 0 0 1 1.5 1.5v7A1.5 1.5 0 0 1 19 18.5H5A1.5 1.5 0 0 1 3.5 17v-7A1.5 1.5 0 0 1 5 8.5Z"/><circle cx="12" cy="13" r="3.5"/></svg>`,
      home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m4 11 8-6 8 6"/><path d="M6.5 10.5V19a.5.5 0 0 0 .5.5h3.5V15h3v4.5H17a.5.5 0 0 0 .5-.5v-8.5"/></svg>`,
      generic: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7.5"/></svg>`,
      'weather-sun': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.1"/><path d="M12 2.8v2.4M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7M18.5 18.5l-1.7-1.7M7.2 7.2 5.5 5.5"/></svg>`,
      'weather-partly-cloud': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="9" r="3.2"/><path d="M9 3.8v1.6M4.8 9H3.2M14.8 9h-1.6M12.8 5.2l-1.1 1.1M5.2 5.2l1.1 1.1"/><path d="M8.5 17.5h8a3 3 0 1 0-.4-5.97A4.8 4.8 0 0 0 7 13a2.7 2.7 0 0 0 1.5 4.5Z"/></svg>`,
      'weather-cloud': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 18h9a3.5 3.5 0 0 0 .2-7A5.2 5.2 0 0 0 6.8 12.4 3 3 0 0 0 7.5 18Z"/></svg>`,
      'weather-fog': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7.8 12.8h8.4a3 3 0 0 0 .2-6A4.5 4.5 0 0 0 8 8.2a2.4 2.4 0 0 0-.2 4.6Z"/><path d="M5 16.5h14M7.5 19.2h9"/></svg>`,
      'weather-rain': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 13.2h9a3.5 3.5 0 0 0 .2-7A5.2 5.2 0 0 0 6.8 7.6a3 3 0 0 0 .7 5.6Z"/><path d="M9 16.3 8.2 19M13 16.3 12.2 19M17 16.3 16.2 19"/></svg>`,
      'weather-snow': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 13.2h9a3.5 3.5 0 0 0 .2-7A5.2 5.2 0 0 0 6.8 7.6a3 3 0 0 0 .7 5.6Z"/><path d="M9 17.2h0M12 18.5h0M15 17.2h0" stroke-width="3.2"/></svg>`,
      'weather-storm': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 12.8h9a3.5 3.5 0 0 0 .2-7A5.2 5.2 0 0 0 6.8 7.2a3 3 0 0 0 .7 5.6Z"/><path d="m11 14 3-1.2-1.6 3.3 2.1-.3-3.4 4 .9-3.3-2.2.1Z"/></svg>`
    };
    return icons[String(kind || 'generic')] || icons.generic;
  }

  function weatherCodeLabel(code) {
    const labels = {
      0: ['Jasno', 'weather-sun'],
      1: ['Skoro jasno', 'weather-partly-cloud'],
      2: ['Polojasno', 'weather-partly-cloud'],
      3: ['Zataženo', 'weather-cloud'],
      45: ['Mlha', 'weather-fog'],
      48: ['Namrzající mlha', 'weather-fog'],
      51: ['Slabé mrholení', 'weather-rain'],
      53: ['Mrholení', 'weather-rain'],
      55: ['Silné mrholení', 'weather-rain'],
      61: ['Slabý déšť', 'weather-rain'],
      63: ['Déšť', 'weather-rain'],
      65: ['Silný déšť', 'weather-rain'],
      71: ['Slabé sněžení', 'weather-snow'],
      73: ['Sněžení', 'weather-snow'],
      75: ['Silné sněžení', 'weather-snow'],
      80: ['Přeháňky', 'weather-rain'],
      81: ['Silné přeháňky', 'weather-rain'],
      82: ['Prudké přeháňky', 'weather-storm'],
      95: ['Bouřka', 'weather-storm'],
      96: ['Bouřka s kroupami', 'weather-storm'],
      99: ['Silná bouřka', 'weather-storm']
    };
    return labels[Number(code)] || ['Počasí', 'weather-partly-cloud'];
  }

  function roundWeather(value, suffix = '') {
    if (value === null || value === undefined || value === '') return '—';
    const number = Number(value);
    if (!Number.isFinite(number)) return '—';
    return `${Math.round(number)}${suffix}`;
  }

  function weatherLocationLabel() {
    const location = normalizeWeatherLocation(state.weather?.location);
    return [location.name, location.country].filter(Boolean).join(', ');
  }

  function makeDemoWeatherState() {
    return {
      location: { name: 'Demo Hostinné', country: 'CZ', latitude: 50.5407, longitude: 15.7233 },
      current: { temperature: 18, feelsLike: 17, humidity: 63, windSpeed: 10, precipitation: 0, weatherCode: 2, time: new Date().toISOString() },
      daily: [
        { date: todayISO(), weatherCode: 2, min: 12, max: 21, precipitation: 0, sunrise: `${todayISO()}T05:02`, sunset: `${todayISO()}T20:57` },
        { date: dateOffsetISO(1), weatherCode: 61, min: 11, max: 18, precipitation: 3 },
        { date: dateOffsetISO(2), weatherCode: 3, min: 10, max: 19, precipitation: 1 },
        { date: dateOffsetISO(3), weatherCode: 0, min: 13, max: 23, precipitation: 0 }
      ],
      updatedAt: new Date().toISOString(),
      error: '',
      loading: false,
      source: 'demo'
    };
  }

  function renderDashboardWeatherCard() {
    const weather = normalizeWeatherState(state.weather);
    const current = weather.current || {};
    const [condition, icon] = weatherCodeLabel(current.weatherCode);
    const hasCurrent = Boolean(weather.current);
    const updated = weather.updatedAt ? formatDateTime(new Date(weather.updatedAt)) : 'nenačteno';
    const today = (weather.daily || [])[0] || {};
    const rain = Number.isFinite(Number(current.precipitation)) ? `${String(current.precipitation).replace('.', ',')} mm` : '—';
    const sourceLabel = weatherSourceLabel(weather.source);
    return `
      <section class="card weather-card weather-card-compact dashboard-widget-block desktop-span-2" data-dashboard-widget="weather">
        <div class="card-header compact-card-header">
          <button class="plain-card-title weather-title-button" type="button" data-nav="weather">
            <div><h2>Počasí</h2><p>${escapeHtml(weatherLocationLabel())} · ${escapeHtml(sourceLabel)} · ${weather.error ? escapeHtml(weather.error) : `Aktualizováno: ${escapeHtml(updated)}`}</p></div>
          </button>
          <span class="badge ${weather.error ? 'warn' : hasCurrent ? 'good' : ''}">${weather.loading ? 'načítám' : hasCurrent ? escapeHtml(sourceLabel) : 'není načtené'}</span>
        </div>
        <button class="weather-main-row weather-current-button" type="button" data-nav="weather" aria-label="Otevřít podrobné počasí">
          <div class="weather-current">
            ${renderGlassIcon(icon, { size: 'weather-md', extraClass: 'weather-icon' })}
            <div><strong>${hasCurrent ? roundWeather(current.temperature, '°') : '—'}</strong><em>${escapeHtml(condition)}</em></div>
          </div>
          <div class="weather-metrics weather-metrics-compact">
            <div class="mini-stat"><span>Pocitově</span><strong>${roundWeather(current.feelsLike, '°')}</strong></div>
            <div class="mini-stat"><span>Dnes</span><strong>${roundWeather(today.min, '°')} / ${roundWeather(today.max, '°')}</strong></div>
            <div class="mini-stat"><span>Srážky</span><strong>${rain}</strong></div>
            <div class="mini-stat"><span>Vítr</span><strong>${roundWeather(current.windSpeed, ' km/h')}</strong></div>
          </div>
        </button>
        <details class="weather-dashboard-details">
          <summary>Ukázat rychlý výhled</summary>
          ${renderWeatherHourlyStrip((weather.hourly || []).slice(0, 8))}
          ${renderWeatherDailyGrid((weather.daily || []).slice(0, 5))}
        </details>
        <div class="form-actions compact-actions">
          <button class="ghost-btn" type="button" data-nav="weather">Podrobné počasí</button>
          <button class="ghost-btn" type="button" data-action="weather-refresh">Obnovit</button>
          <button class="ghost-btn" type="button" data-nav="settings" data-target-tab="dashboard">Nastavit místo</button>
        </div>
      </section>
    `;
  }

  function renderWeatherHourlyStrip(hours = []) {
    if (!hours.length) return '<div class="empty">Hodinový výhled zatím není načtený.</div>';
    return `<div class="weather-hourly-strip">${hours.map((hour) => {
      const [label, hourIcon] = weatherCodeLabel(hour.weatherCode);
      return `<div class="weather-hour"><span>${escapeHtml(shortTime(hour.time))}</span><strong>${renderGlassIcon(hourIcon, { size: 'weather-xs', extraClass: 'weather-inline-icon' })}<span>${roundWeather(hour.temperature, '°')}</span></strong><em>${roundWeather(hour.precipitation, ' mm')} · ${escapeHtml(label)}</em></div>`;
    }).join('')}</div>`;
  }

  function compactWeatherText(value, maxLength = 92) {
    const text = normalizeText(value);
    if (!text) return '';
    return text.length > maxLength ? `${text.slice(0, maxLength - 1).trim()}…` : text;
  }

  function renderWeatherDailyGrid(days = []) {
    if (!days.length) return '<div class="empty">Denní předpověď zatím není načtená.</div>';
    return `<div class="weather-daily-row">${days.map((day) => {
      const [label, dayIcon] = weatherCodeLabel(day.weatherCode);
      const sunLine = day.sunrise || day.sunset ? `☀ ${shortTime(day.sunrise)}/${shortTime(day.sunset)}` : '';
      const textLine = compactWeatherText(day.text && day.text !== label ? day.text : '', 86);
      const detail = [
        `${roundWeather(day.min, '°')} / ${roundWeather(day.max, '°')}`,
        roundWeather(day.precipitation, ' mm'),
        sunLine,
        textLine || label
      ].filter((part) => part && part !== '—').join(' · ');
      return `<div class="weather-day"><span>${escapeHtml(shortWeekday(day.date))}</span><strong>${renderGlassIcon(dayIcon, { size: 'weather-xs', extraClass: 'weather-inline-icon' })}<span>${roundWeather(day.max, '°')}</span></strong><em>${escapeHtml(detail)}</em></div>`;
    }).join('')}</div>`;
  }

  function shortTime(value) {
    const date = toSafeDate(value, null);
    if (!date) return '—';
    return new Intl.DateTimeFormat('cs-CZ', { hour: '2-digit', minute: '2-digit' }).format(date);
  }

  function renderWeatherPage() {
    const weather = normalizeWeatherState(state.weather);
    const current = weather.current || {};
    const [condition, icon] = weatherCodeLabel(current.weatherCode);
    const updated = weather.updatedAt ? formatDateTime(new Date(weather.updatedAt)) : 'nenačteno';
    const todayWeather = (weather.daily || [])[0] || {};
    const sourceLabel = weatherSourceLabel(weather.source);
    const providerLabel = normalizeText(weather.meta?.providerLabel) || (weather.source === 'chmi' ? 'ČHMÚ + doplněné číselné detaily' : sourceLabel);
    const astronomySource = normalizeText(weather.meta?.astronomySource || weather.meta?.numericFallback) || (weather.source === 'chmi' ? 'Open-Meteo' : sourceLabel);
    ensureWeatherFresh(false);
    return `
      <div class="grid two weather-page">
        <section class="card desktop-span-2 weather-page-hero">
          <div class="card-header compact-card-header">
            <div><h2>${escapeHtml(weatherLocationLabel())}</h2><p>Hlavní předpověď: ${escapeHtml(sourceLabel)} · detaily jako východ/západ: ${escapeHtml(astronomySource)} · aktualizováno: ${escapeHtml(updated)}</p></div>
            <span class="badge ${weather.current ? 'good' : weather.error ? 'warn' : ''}">${weather.loading ? 'načítám' : weather.current ? escapeHtml(providerLabel) : 'není načtené'}</span>
          </div>
          <div class="weather-main-row">
            <div class="weather-current weather-current-large">
              ${renderGlassIcon(icon, { size: 'weather-md', extraClass: 'weather-icon' })}
              <div><strong>${roundWeather(current.temperature, '°')}</strong><em>${escapeHtml(condition)} · pocitově ${roundWeather(current.feelsLike, '°')}</em></div>
            </div>
            <div class="weather-metrics">
              <div class="mini-stat"><span>Vlhkost</span><strong>${roundWeather(current.humidity, '%')}</strong></div>
              <div class="mini-stat"><span>Vítr</span><strong>${roundWeather(current.windSpeed, ' km/h')}</strong></div>
              <div class="mini-stat"><span>Srážky teď</span><strong>${Number.isFinite(Number(current.precipitation)) ? `${String(current.precipitation).replace('.', ',')} mm` : '—'}</strong></div>
              <div class="mini-stat"><span>Východ</span><strong>${escapeHtml(shortTime(todayWeather.sunrise))}</strong></div>
              <div class="mini-stat"><span>Západ</span><strong>${escapeHtml(shortTime(todayWeather.sunset))}</strong></div>
              <div class="mini-stat"><span>Zdroj</span><strong>${escapeHtml(sourceLabel)}</strong></div>
            </div>
          </div>
          <div class="form-actions compact-actions"><button class="primary-btn" type="button" data-action="weather-refresh">Obnovit počasí</button><button class="ghost-btn" type="button" data-nav="settings" data-target-tab="dashboard">Nastavit místo</button></div>
        </section>
        <section class="card desktop-span-2">
          <div class="card-header"><div><h2>Po hodinách</h2><p>Nejbližších 24 hodin pro rychlé plánování.</p></div></div>
          ${renderWeatherHourlyStrip((weather.hourly || []).slice(0, 24))}
        </section>
        <section class="card desktop-span-2">
          <div class="card-header"><div><h2>Další dny</h2><p>Přehled dopředu, bez zbytečné omáčky.</p></div></div>
          ${renderWeatherDailyGrid((weather.daily || []).slice(0, 7))}
        </section>
      </div>
    `;
  }

  function shortWeekday(dateISO) {
    if (!dateISO) return '—';
    const date = new Date(`${dateISO}T00:00:00`);
    if (Number.isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat('cs-CZ', { weekday: 'short', day: 'numeric' }).format(date);
  }

  let weatherFetchPromise = null;
  async function ensureWeatherFresh(force = false) {
    if (isDemoOnlyState()) return;
    state.weather = normalizeWeatherState(state.weather);
    const updatedAt = Date.parse(state.weather.updatedAt || '');
    if (!force && state.weather.current && updatedAt && Date.now() - updatedAt < WEATHER_CACHE_MS) return;
    if (weatherFetchPromise) return weatherFetchPromise;
    weatherFetchPromise = fetchWeatherForLocation(force)
      .catch((error) => {
        state.weather = { ...normalizeWeatherState(state.weather), loading: false, error: error?.message || 'Počasí se nepovedlo načíst' };
        saveState();
      })
      .finally(() => { weatherFetchPromise = null; });
    return weatherFetchPromise;
  }

  function normalizeWeatherPayload(payload, location, source = 'chmi', fallbackError = '') {
    const raw = payload?.weather && typeof payload.weather === 'object' ? payload.weather : payload || {};
    return {
      location: normalizeWeatherLocation(raw.location || location),
      current: raw.current && typeof raw.current === 'object' ? raw.current : null,
      daily: Array.isArray(raw.daily) ? raw.daily : [],
      hourly: Array.isArray(raw.hourly) ? raw.hourly : [],
      updatedAt: raw.updatedAt || new Date().toISOString(),
      error: raw.error || fallbackError || '',
      loading: false,
      source: normalizeWeatherSource(raw.source || source),
      meta: raw.meta && typeof raw.meta === 'object' ? raw.meta : {}
    };
  }

  async function fetchChmiWeatherForLocation(location) {
    const client = getSupabaseClient();
    if (!client?.functions?.invoke) throw new Error('ČHMÚ backend zatím není dostupný');
    const normalizedLocation = normalizeWeatherLocation(location);
    const body = {
      householdId: state.cloud?.householdId || '',
      location: normalizedLocation,
      locationName: normalizedLocation.name,
      name: normalizedLocation.name,
      country: normalizedLocation.country,
      latitude: normalizedLocation.latitude,
      longitude: normalizedLocation.longitude,
      region: normalizedLocation.region || normalizedLocation.name
    };
    const { data, error } = await client.functions.invoke(WEATHER_CHMI_FUNCTION, { body });
    if (error || data?.error) throw new Error(error?.message || data?.error || 'ČHMÚ počasí se nepovedlo načíst');
    return normalizeWeatherPayload(data, location, 'chmi');
  }

  async function fetchOpenMeteoWeatherForLocation(location) {
    const params = new URLSearchParams({
      latitude: String(location.latitude),
      longitude: String(location.longitude),
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m',
      hourly: 'temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset',
      timezone: 'auto',
      forecast_days: '7'
    });
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Počasí HTTP ${response.status}`);
    const data = await response.json();
    const current = data.current || {};
    const daily = data.daily || {};
    const hourly = data.hourly || {};
    return {
      location,
      current: {
        temperature: current.temperature_2m,
        feelsLike: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        precipitation: current.precipitation,
        weatherCode: current.weather_code,
        time: current.time || new Date().toISOString()
      },
      daily: (daily.time || []).map((date, index) => ({
        date,
        weatherCode: daily.weather_code?.[index],
        min: daily.temperature_2m_min?.[index],
        max: daily.temperature_2m_max?.[index],
        precipitation: daily.precipitation_sum?.[index],
        sunrise: daily.sunrise?.[index],
        sunset: daily.sunset?.[index]
      })),
      hourly: (hourly.time || []).map((time, index) => ({
        time,
        weatherCode: hourly.weather_code?.[index],
        temperature: hourly.temperature_2m?.[index],
        feelsLike: hourly.apparent_temperature?.[index],
        windSpeed: hourly.wind_speed_10m?.[index],
        precipitation: hourly.precipitation?.[index]
      })),
      updatedAt: new Date().toISOString(),
      error: '',
      loading: false,
      source: 'open-meteo'
    };
  }

  async function fetchWeatherForLocation(force = false) {
    const location = normalizeWeatherLocation(state.weather?.location);
    const storedSource = normalizeWeatherSource(state.weather?.source || 'chmi');
    const preferredSource = storedSource === 'open-meteo-fallback' ? 'chmi' : storedSource;
    state.weather = { ...normalizeWeatherState(state.weather), location, loading: true, error: '' };
    if (force) render();

    let nextWeather;
    try {
      nextWeather = preferredSource === 'chmi'
        ? await fetchChmiWeatherForLocation(location)
        : await fetchOpenMeteoWeatherForLocation(location);
    } catch (error) {
      const message = error?.message || 'Počasí se nepovedlo načíst';
      if (preferredSource === 'chmi') {
        nextWeather = await fetchOpenMeteoWeatherForLocation(location);
        nextWeather.source = 'open-meteo-fallback';
        nextWeather.error = `ČHMÚ zatím nedostupné, dočasně fallback: ${message}`;
      } else {
        throw error;
      }
    }

    state.weather = normalizeWeatherPayload(nextWeather, location, nextWeather.source || preferredSource);
    touchState();
    saveState();
    render();
  }

  async function findWeatherLocationByName(name) {
    const clean = normalizeText(name);
    if (!clean) throw new Error('Doplň název místa');
    const params = new URLSearchParams({ name: clean, count: '1', language: 'cs', format: 'json' });
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Vyhledání místa HTTP ${response.status}`);
    const data = await response.json();
    const item = data.results?.[0];
    if (!item) throw new Error('Místo se nepovedlo najít');
    return {
      name: item.name || clean,
      country: item.country_code || item.country || '',
      latitude: item.latitude,
      longitude: item.longitude
    };
  }

  async function saveWeatherSettings(data, form) {
    try {
      let location;
      const rawLatitude = String(data.latitude ?? '').trim();
      const rawLongitude = String(data.longitude ?? '').trim();
      const latitude = Number(rawLatitude.replace(',', '.'));
      const longitude = Number(rawLongitude.replace(',', '.'));
      const weatherSource = normalizeWeatherSource(data.weatherSource || state.weather?.source || 'chmi');
      if (rawLatitude && rawLongitude && Number.isFinite(latitude) && Number.isFinite(longitude)) {
        location = { name: normalizeText(data.locationName) || WEATHER_DEFAULT_LOCATION.name, country: normalizeText(data.country) || '', latitude, longitude };
      } else {
        location = await findWeatherLocationByName(data.locationName || data.city || WEATHER_DEFAULT_LOCATION.name);
      }
      state.weather = { ...normalizeWeatherState(state.weather), location, current: null, daily: [], hourly: [], updatedAt: '', error: '', source: weatherSource };
      touchState();
      saveState();
      await cloudSaveHouseholdUiSettings(false);
      await ensureWeatherFresh(true);
      form?.reset?.();
      showToast(`Počasí nastavené: ${location.name}`);
    } catch (error) {
      showToast(error?.message || 'Počasí se nepovedlo nastavit');
    }
  }

  function getDashboardFocusItems({ hdo, todayEvents, upcomingEvents, activePackages, urgentContracts, openShopping, openTasks, wasteSoon, vehicleAlerts }) {
    const firstEvent = todayEvents[0] || upcomingEvents[0];
    const firstPackage = activePackages[0];
    const firstContract = urgentContracts[0];
    const firstTask = openTasks[0];
    const firstWaste = wasteSoon[0];
    const firstVehicle = vehicleAlerts[0];
    const financeSummary = financeMonthSummary();
    const financeMonth = financeSelectedMonth();

    const items = [
      {
        nav: 'calendar',
        icon: '📅',
        title: firstEvent ? firstEvent.title : 'Kalendář je volný',
        meta: firstEvent ? calendarEventMetaLabel(firstEvent, now) : 'Žádná událost na dnešek ani nejbližší dny.',
        badge: firstEvent && calendarEventIsRunning(firstEvent, now) ? 'běží' : firstEvent ? 'další' : 'volno',
        tone: todayEvents.length ? 'good' : ''
      },
      {
        nav: 'homecare',
        overview: 'hdo',
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
        nav: 'finance',
        overview: 'finance',
        icon: '💰',
        title: financeSummary.balance >= 0 ? 'Finance drží plus' : 'Finance jsou v mínusu',
        meta: `${financeMonthLabel(financeMonth)}: příjmy ${formatCurrency(financeSummary.income)} · výdaje ${formatCurrency(financeSummary.expense)}`,
        badge: formatCurrency(financeSummary.balance),
        tone: financeSummary.balance >= 0 ? 'good' : 'warn'
      },
      {
        nav: firstContract ? 'contracts' : firstVehicle ? 'garage' : 'homecare',
        overview: firstContract ? 'contracts' : firstVehicle ? 'garage' : firstTask ? 'tasks' : firstWaste ? 'waste' : 'homecare',
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
      { nav: 'settings', tab: 'household', icon: '👥', label: 'Profily', items: state.profiles || [], loadedAt: state.cloud?.profilesLoadedAt },
      { nav: 'shopping', tab: 'list', icon: '🛒', label: 'Nákupy', items: state.shopping || [], loadedAt: state.shoppingCloud?.loadedAt },
      { nav: 'contracts', tab: 'overview', icon: '📄', label: 'Smlouvy', items: state.contracts || [] },
      { nav: 'contracts', tab: 'detail', icon: '📎', label: 'Přílohy smluv', items: state.contractFiles || [] },
      { nav: 'garage', tab: 'overview', icon: '🚗', label: 'Garáž', items: [...(state.vehicles || []), ...(state.fuel || []), ...(state.services || [])] },
      { nav: 'homecare', tab: 'hdo', icon: '💡', label: 'HDO', items: state.hdoWindows || [], loadedAt: state.hdoCloud?.loadedAt },
      { nav: 'homecare', tab: 'waste', icon: '♻️', label: 'Odpad', items: state.waste || [], loadedAt: state.wasteCloud?.loadedAt },
      { nav: 'homecare', tab: 'tasks', icon: '✅', label: 'Úkoly', items: state.homeTasks || [], loadedAt: state.tasksCloud?.loadedAt },
      { nav: 'packages', tab: 'active', icon: '📦', label: 'Balíky', items: state.packages || [], loadedAt: state.parcelsCloud?.loadedAt },
      { nav: 'calendar', tab: 'overview', icon: '📅', label: 'Kalendář', items: state.calendar || [], loadedAt: state.calendarCloud?.loadedAt },
      { nav: 'calendar', tab: 'sources', icon: '🧩', label: 'Zdroje kalendáře', items: getCalendarSources(), loadedAt: state.calendarCloud?.sourcesLoadedAt },
      { nav: 'finance', tab: 'summary', icon: '💰', label: 'Finance', items: state.finance || [], loadedAt: state.financeCloud?.loadedAt },
      { nav: 'homecare', tab: 'tasks', icon: '📝', label: 'Poznámky', items: state.notes || [], loadedAt: state.householdExtrasCloud?.loadedAt },
      { nav: 'homecare', tab: 'devices', icon: '🔌', label: 'Zařízení', items: state.devices || [], loadedAt: state.householdExtrasCloud?.loadedAt },
      { nav: 'homecare', tab: 'warranties', icon: '🧾', label: 'Záruky', items: state.warranties || [], loadedAt: state.householdExtrasCloud?.loadedAt },
      { nav: 'cameras', tab: 'overview', icon: '📹', label: 'Kamery', items: state.cameras || [], loadedAt: state.householdExtrasCloud?.loadedAt },
      { nav: 'shopping', tab: 'coupons', icon: '🏷️', label: 'Slevové kódy', items: state.coupons || [], loadedAt: state.householdExtrasCloud?.loadedAt }
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
    const autosyncEnabled = state.cloud?.autoSyncEnabled !== false;
    const autosyncStatus = cloudAutosyncStatusLabel();
    const featuredCloudLabels = ['Profily', 'Nákupy', 'Smlouvy', 'Přílohy smluv', 'Garáž', 'HDO', 'Odpad', 'Úkoly', 'Balíky', 'Kalendář', 'Finance', 'Poznámky', 'Zařízení', 'Kamery', 'Slevové kódy'];
    const compactItems = mode === 'dashboard' ? items.filter((item) => item.total || featuredCloudLabels.includes(item.label)).slice(0, 14) : items;
    return `
      <section class="card desktop-span-2 cloud-sync-overview-card">
        <div class="card-header">
          <div>
            <h2>Cloud-first data</h2>
            <p>${cloudReady ? 'Online domácnost je hlavní zdroj. Lokál je jen cache nebo dočasný fallback při výpadku.' : 'Aplikace je připravená na cloud, ale domácnost zatím není napojená.'}</p>
          </div>
          <span class="badge ${cloudReady ? 'good' : 'warn'}">${cloudReady ? `${overall}% cloud` : 'lokálně'}</span>
        </div>
        <div class="cloud-status-grid compact-cloud-stats">
          <div class="mini-stat"><span>Cloud záznamy</span><strong>${totalCloud}</strong></div>
          <div class="mini-stat"><span>Jen lokálně</span><strong>${totalLocal}</strong></div>
          <div class="mini-stat"><span>Poslední sync</span><strong>${state.cloud?.lastSyncAt ? escapeHtml(formatDateTime(state.cloud.lastSyncAt)) : 'nikdy'}</strong></div>
          <div class="mini-stat"><span>Realtime</span><strong data-cloud-realtime-status>${cloudReady ? escapeHtml(realtimeStatusLabel()) : 'offline'}</strong></div>
          <div class="mini-stat"><span>Autosync</span><strong>${cloudReady ? escapeHtml(autosyncStatus) : 'offline'}</strong></div>
          <div class="mini-stat"><span>Poslední autosync</span><strong>${state.cloud?.lastAutosyncAt ? escapeHtml(formatDateTime(state.cloud.lastAutosyncAt)) : 'nikdy'}</strong></div>
        </div>
        ${cloudReady ? `<div class="cloud-automation-strip ${totalLocal ? 'warn' : 'good'}"><span class="sync-status-dot"></span><strong>${totalLocal ? `${totalLocal} položek čeká na cloud` : 'Cloud-first je čistý'}</strong><em>${autosyncEnabled ? 'Automatické dohnání je zapnuté.' : 'Automatické dohnání je vypnuté.'}</em></div>` : ''}
        <div class="sync-overview-list">
          ${compactItems.map((item) => `
            <button class="sync-overview-row ${item.local ? 'pending' : item.cloud ? 'cloud-ok' : 'empty'}" type="button" data-nav="${escapeHtml(item.nav)}" ${item.tab ? `data-target-tab="${escapeHtml(item.tab)}"` : ''}>
              <span class="sync-overview-icon">${escapeHtml(item.icon)}</span>
              <span class="sync-overview-main">
                <span class="sync-overview-title">${escapeHtml(item.label)}</span>
                <span class="sync-progress"><i style="width:${item.percent}%"></i></span>
              </span>
              <span class="sync-overview-meta"><strong>${item.cloud}</strong> cloud · <strong>${item.local}</strong> lokál${item.loadedAt ? ` · ${formatDateTime(item.loadedAt)}` : ''}</span>
            </button>
          `).join('')}
        </div>
        <div class="form-actions">
          ${cloudReady ? '<button class="ghost-btn" type="button" data-action="cloud-load-all">Načíst vše z cloudu</button><button class="ghost-btn" type="button" data-action="cloud-start-realtime">Zapnout živé změny</button><button class="ghost-btn" type="button" data-action="cloud-run-autosync-now">Synchronizovat teď</button>' : '<button class="ghost-btn" type="button" data-nav="settings">Napojit cloud v Nastavení</button>'}
          ${cloudReady ? `<button class="ghost-btn" type="button" data-action="cloud-toggle-autosync">${autosyncEnabled ? 'Vypnout autosync' : 'Zapnout autosync'}</button>` : ''}
          ${cloudReady && totalLocal ? '<button class="primary-btn" type="button" data-action="cloud-sync-pending">Dohnat lokální → cloud</button>' : ''}
          ${cloudReady && totalLocal ? '<span class="badge warn">něco je jen v tomto zařízení</span>' : '<span class="badge good">cloud-first OK</span>'}
        </div>
      </section>
    `;
  }

  function renderDashboardFocusItem(item) {
    const attrs = item.nav === 'calendar' || item.overview === 'calendar' ? 'data-nav="calendar" data-target-tab="overview"' : `data-action="open-overview" data-overview="${escapeHtml(item.overview || item.nav)}"`;
    return `
      <button class="card focus-tile ${item.tone || ''}" type="button" ${attrs}>
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
      ...todayEvents.slice(0, 3).map((event) => ({ nav: 'calendar', icon: '📅', title: event.title, meta: calendarEventMetaLabel(event, now), badge: calendarEventIsRunning(event, now) ? 'běží' : 'dnes', tone: 'good' })),
      ...upcomingEvents.filter((event) => event.date !== todayISO()).slice(0, 3).map((event) => ({ nav: 'calendar', icon: '📅', title: event.title, meta: calendarEventMetaLabel(event, now), badge: 'brzy', tone: '' })),
      ...urgentContracts.slice(0, 3).map((contract) => ({ nav: 'contracts', icon: '📄', title: contract.name, meta: `${contract.provider || 'Bez poskytovatele'} · platnost do ${formatDate(contract.validTo)}`, badge: dueBadge(contract.days), tone: contract.days < 0 ? 'bad' : contract.days <= 14 ? 'warn' : '' })),
      ...openTasks.slice(0, 3).map((task) => ({ nav: 'homecare', overview: 'tasks', icon: '✅', title: task.title, meta: `${task.due ? `Termín ${formatDate(task.due)}` : 'Bez termínu'}${task.note ? ` · ${task.note}` : ''}`, badge: task.due ? dueBadge(daysUntil(task.due)) : 'úkol', tone: task.due && daysUntil(task.due) <= 2 ? 'warn' : '' })),
      ...wasteSoon.slice(0, 2).map((item) => ({ nav: 'homecare', overview: 'waste', icon: '♻️', title: `${item.type} odpad`, meta: `${formatDate(item.date)}${item.note ? ` · ${item.note}` : ''}`, badge: dueBadge(item.days), tone: item.days <= 1 ? 'warn' : '' })),
      ...vehicleAlerts.slice(0, 3).map((item) => ({ nav: 'garage', icon: '🚗', title: item.title, meta: item.meta, badge: dueBadge(item.days), tone: item.days < 0 ? 'bad' : item.days <= 30 ? 'warn' : '' }))
    ].slice(0, 9);

    if (!rows.length) {
      if (isDemoOnlyState()) return renderEmpty('Zatím tu není nic důležitého. Jakmile přidáš kalendář, smlouvy, úkoly nebo auto, dashboard se začne plnit sám.');
      const progress = getStarterSetupProgress();
      const nextStep = progress.nextStep || { nav: 'calendar', tab: 'add' };
      return renderEmptyCta({
        icon: '✨',
        title: 'Dashboard zatím čeká na první data',
        text: 'Jakmile přidáš kalendář, úkol, svoz, auto nebo smlouvu, časová osa se začne plnit sama.',
        nav: nextStep.nav,
        tab: nextStep.tab,
        label: `Pokračovat: ${nextStep.title || 'nastavení'}`
      });
    }

    return rows.map((row) => `
      <button class="timeline-item ${row.tone || ''}" type="button" ${row.nav === 'calendar' && !row.overview ? 'data-nav="calendar" data-target-tab="overview"' : `data-action="open-overview" data-overview="${escapeHtml(row.overview || row.nav)}"`}>
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
            vehicleId: vehicle.id,
            iconColor: vehicle.iconColor,
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
          vehicleId: vehicle.id,
          iconColor: vehicle.iconColor,
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
    if (isDemoOnlyState()) return '';
    const progress = getStarterSetupProgress();
    const steps = progress.orderedSteps;
    return `
      <section class="card setup-card guided-checklist-card">
        <div class="card-header">
          <div><h2>Dokončení základu</h2><p>Krátký stav toho, jestli je ostrá domácnost použitelná pro běžný den.</p></div>
          <span class="badge ${progress.doneCount >= progress.total ? 'good' : progress.doneCount >= 3 ? 'warn' : ''}">${progress.doneCount}/${progress.total}</span>
        </div>
        <div class="starter-priority-line">
          <span>Další: ${escapeHtml(progress.nextStep?.title || 'základ je hotový')}</span>
          <button class="ghost-btn mini-btn" type="button" data-nav="${escapeHtml(progress.nextStep?.nav || 'settings')}" data-target-tab="${escapeHtml(progress.nextStep?.tab || 'household')}">Pokračovat</button>
        </div>
        <div class="progress-shell setup-progress"><span style="width:${progress.percent}%"></span></div>
        <div class="setup-list compact-setup-list">
          ${steps.map((item) => {
            const isNext = !item.done && item.id === progress.nextStep?.id;
            return `
              <button class="setup-item setup-action-item ${item.done ? 'done' : ''} ${isNext ? 'is-next' : ''}" type="button" data-nav="${escapeHtml(item.nav)}" data-target-tab="${escapeHtml(item.tab)}">
                <span>${item.done ? '✓' : escapeHtml(item.icon)}</span>
                <div><strong>${escapeHtml(item.title)}</strong><em>${escapeHtml(item.note)}</em></div>
                ${isNext ? '<small>další</small>' : ''}
              </button>
            `;
          }).join('')}
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
      weather: { count: normalizeWeatherState(state.weather).current ? 1 : 0, label: 'místo', note: weatherLocationLabel() || 'Počasí podle místa domácnosti.' },
      calendar: { count: countBy('calendar'), label: 'událostí', note: 'Google napojení později přes backend.' },
      packages: { count: countBy('packages', (item) => item.status !== 'delivered'), label: 'aktivních', note: `${countBy('packages')} balíků celkem.` },
      shopping: { count: countBy('shopping', (item) => !item.done), label: 'koupit', note: `${countBy('coupons', (item) => !item.used)} nepoužitých kódů.` },
      homecare: { count: countBy('homeTasks', (item) => !item.done) + countBy('hdoWindows') + countBy('waste') + countBy('warranties'), label: 'položek', note: `${countBy('hdoWindows')} HDO oken, ${countBy('waste')} svozů, ${countBy('homeTasks', (item) => !item.done)} úkolů, ${countBy('warranties')} záruk.` },
      garage: { count: countBy('vehicles'), label: 'aut', note: `${countBy('fuel')} tankování, ${countBy('services')} servisů.` },
      contracts: { count: countBy('contracts'), label: 'smluv', note: `${countBy('contractFiles')} příloh, cloudově přes Storage / lokálně jen fallback.` },
      cameras: { count: countBy('cameras'), label: 'kamer', note: 'Snapshot/stream zatím jen lokálně.' },
      finance: { count: countBy('finance'), label: 'záznamů', note: `${formatCurrency(financeMonthSummary().balance)} rozdíl tento měsíc.` }
    };
    return stats[moduleId] || { count: 0, label: 'položek', note: getModuleSubtitle(moduleId) };
  }

  function getCloudReadiness() {
    const checks = [
      { key: 'household', done: Boolean(state.household?.isConfigured && state.household?.id), title: 'Domácnost má svoje ID', note: 'Základ pro oddělení rodin a household_id v cloudu.' },
      { key: 'profiles', done: state.profiles.length >= 1 && state.profiles.every((profile) => profile.householdId), title: 'Profily jsou navázané na domácnost', note: 'Profily se synchronizují přes cloud domácnosti.' },
      { key: 'modules', done: normalizeModuleList(state.enabledModules).length > 0, title: 'Moduly jsou volitelné', note: 'Každá rodina si vybere vlastní sestavu.' },
      { key: 'navigation', done: normalizeBottomNavIds(state.settings?.bottomNavIds, state.enabledModules).length >= BOTTOM_NAV_MIN, title: 'Spodní lišta je uživatelská', note: 'Dobré pro iPhone, Android i budoucí tablet.' },
      { key: 'ids', done: getCollectionNames().every((collection) => (state[collection] || []).every((item) => item.householdId && item.profileId)), title: 'Data mají householdId/profileId', note: 'Důležité pro RLS a sdílení jen uvnitř domácnosti.' },
      { key: 'storage', done: true, title: 'Soubory jsou mimo localStorage', note: 'Přílohy smluv jedou online přes soukromý Supabase Storage, IndexedDB je jen fallback.' }
    ];
    const doneCount = checks.filter((item) => item.done).length;
    return { checks, doneCount, total: checks.length, percent: Math.round((doneCount / checks.length) * 100) };
  }

  function renderCloudReadiness(compact = false) {
    const readiness = getCloudReadiness();
    return `
      <section class="card ${compact ? '' : 'desktop-span-2'}">
        <div class="card-header">
          <div><h2>Technická připravenost</h2><p>Kontrola cloud-first režimu, PWA a bezpečného fallbacku do lokální cache.</p></div>
          <span class="badge ${readiness.percent >= 90 ? 'good' : readiness.percent >= 70 ? 'warn' : ''}">${readiness.percent} %</span>
        </div>
        <div class="progress-shell"><span style="width:${readiness.percent}%"></span></div>
        ${compact ? `
          <div class="inline-note" style="margin-top:12px;">${readiness.doneCount}/${readiness.total} technických bodů je připravených. Cloud je hlavní zdroj dat, lokál zůstává jen cache/fallback.</div>
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
      { title: 'Domácnost+ v.0.1_116', note: 'Hotovo: Garáž sjednocuje duplicitní lokální/cloud auta, tankování a servisní záznamy podle obsahu a preferuje cloudovou verzi místo dvojitého výpisu.' },
      { title: 'Domácnost+ v.0.1_115', note: 'Hotovo: nový modul Svátky Polsko s přehledem zavřených obchodů a online aktualizací svátků, mazání auta je přesunuté do detailu s potvrzením a Home má větší čas/počasí s modernějšími ikonami.' },
      { title: 'Domácnost+ v.0.1_113', note: 'Hotovo: hlavní Home panel je roztažený téměř přes celou šířku obrazovky a až ke spodní liště, vnitřní panely vyplňují dostupnou výšku.' },
      { title: 'Domácnost+ v.0.1_112', note: 'Hotovo: Home panel je výškově roztáhnutý níž ke spodní liště a lépe využívá prostor pod rychlými panely.' },
      { title: 'Domácnost+ v.0.1_111', note: 'Hotovo: oprava pádu Garáže v detailu auta, živé Home karty mají jemný flip efekt a PWA ikony přešly na stabilní názvy bez verzování při každém buildu.' },
      { title: 'Domácnost+ v.0.1_109', note: 'Hotovo: Home má menší mezeru mezi časem/počasím a mini panely, vybrané Home karty umí živě střídat další info a základní Garáž počítá Kč/km jen z paliva.' },
      { title: 'Domácnost+ v.0.1_108', note: 'Hotovo: Home Kalendář otevírá rovnou měsíční mřížku, klik na událost ukáže detail, Garáž má modální tankování/servis, cena/km počítá i servisní náklady a Nákupy dostaly čistší Listonic styl.' },
      { title: 'Domácnost+ v.0.1_107', note: 'Hotovo: Home má vyšší část čas/počasí bez zvětšení celé karty, Kalendář na Home vrací stav Nyní/Další, HDO a Garáž mají čistší texty a Garáž má rychlé akce + chytrý dopočet tankování.' },
      { title: 'Domácnost+ v.0.1_106', note: 'Hotovo: přehled Kalendáře je nově skutečný měsíční kalendář s týdny v řádcích, dny ve sloupcích a tlačítky předchozí měsíc / dnes / další měsíc.' },
      { title: 'Domácnost+ v.0.1_105', note: 'Hotovo: oprava kliknutí na auto z rychlého přehledu Garáže a nový modul Záruky v Domácnosti se základní dvouletou zárukou, možností prodloužení a poznámkami k reklamaci.' },
      { title: 'Domácnost+ v.0.1_104', note: 'Hotovo: vyšší panel času a počasí na Home, Kalendář bez popisku „Další“, HDO bez duplicitního „sepne v…“ a Garáž má klikací auta z rychlého přehledu plus volbu barvy ikonky auta.' },
      { title: 'Domácnost+ v.0.1_103', note: 'Hotovo: Garáž na Home ukazuje počet aut místo nuly bez upozornění a detail auta má plnou historii s filtrem podle roku a typu záznamu.' },
      { title: 'Domácnost+ v.0.1_102', note: 'Hotovo: vyšší Home mini panely pod časem a počasím, čitelnější karta Kalendář, HDO přehled řadí Po–Pá před víkend a Fuelio import čte vícesekční exporty včetně Data/Odo/Costs.' },
      { title: 'Domácnost+ v.0.1_101', note: 'Hotovo: uklizené ikony do assets/icons, Home panel Kalendář ukazuje jen jednu aktuální nebo nejbližší událost, HDO víkend platí i pro české svátky a Fuelio import je tolerantnější na CSV exporty.' },
      { title: 'Domácnost+ v.0.1_100', note: 'Hotovo: Home panel Kalendář ukazuje jen probíhající a nadcházející události. Skončené události z hlavní plochy mizí, probíhající ukazují čas konce.' },
      { title: 'Domácnost+ v.0.1_99', note: 'Hotovo: automatické HDO podle distributora/kódu/importu bylo odstraněné. HDO se zadává jen ručně, zůstává rychlé číselné zadávání časů a cloudové uložení ručních oken.' },
      { title: 'Domácnost+ v.0.1_98', note: 'Hotovo: HDO import měl fallback pro hlavní distributory v ČR a kalendář převáděl cloudové a Google události do Europe/Prague.' },
      { title: 'Domácnost+ v.0.1_97', note: 'Hotovo: HDO dohledání bylo připravené pro ČEZ Distribuci, EG.D, PREdistribuci i ruční fallback. U kalendářů přibylo odebrání zdroje včetně jeho událostí a spodní lišta má stabilnější pozici po startu.' },
      { title: 'Domácnost+ v.0.1_94', note: 'Hotovo: Google Calendar ukládá a čte serverové tokeny přes bezpečné RPC funkce do app_private, bez vystavení privátního schématu do API. Google login zůstává jen přihlášení.' },
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
      { title: 'Domácnost+ v.0.1_34', note: 'Hotovo: variabilní finanční účty, peněženky, obálky a osobní zůstatky.' },
      { title: 'Domácnost+ v.0.1_40', note: 'Hotovo: bohatší demo, potvrzení e-mailu, opětovné odeslání ověřovacího e-mailu a přechod z demo do ostré domácnosti.' },
      { title: 'Domácnost+ v.0.1_43', note: 'Hotovo: kontrola Supabase Auth nastavení, bezpečnější přechod demo → ostrá domácnost a jasný stav redirect URL.' },
      { title: 'Domácnost+ v.0.1_48', note: 'Hotovo: kompaktní záložky v kalendáři, balících, financích, garáži a smlouvách + oprava rychlého přehledu financí.' },
      { title: 'Domácnost+ v.0.1_49', note: 'Hotovo: čistší rychlé přehledy z dashboardu bez destruktivních akcí, finance na dashboardu a lepší mobilní centrování záložek.' },
      { title: 'Domácnost+ v.0.1_50', note: 'Hotovo: kompaktní detaily Garáže a Smluv, rozbalovací editační bloky a čistší onboarding ostré domácnosti.' },
      { title: 'Domácnost+ v.0.1_51', note: 'Hotovo: nouzová oprava načítání, bezpečnější service worker fallback a startovací diagnostika místo bílé stránky.' },
      { title: 'Domácnost+ v.0.1_52', note: 'Hotovo: pojistka proti visícímu startu bez app.js, přehlednější dashboard modaly a Finance v cloud přehledu.' },
      { title: 'Domácnost+ v.0.1_53', note: 'Hotovo: klikací horní souhrny na dashboardu, chytřejší otevření správné záložky a smazání účtu jen v Nastavení.' },
      { title: 'Domácnost+ v.0.1_54', note: 'Hotovo: stabilnější mobilní rychlé přehledy, zamknuté pozadí při otevřeném modalu, Escape zavření a opravené pořadí roadmapy.' },
      { title: 'Domácnost+ v.0.1_55', note: 'Hotovo: kompaktnější dashboard karty, sjednocené výšky rychlých modulů a lepší mobilní zahuštění bez zásahu do startu aplikace.' },
      { title: 'Domácnost+ v.0.1_56', note: 'Hotovo: sjednocené mobilní záložky a kompaktnější formuláře/listy ve Financích a Kamerách bez zásahu do boot/PWA flow.' },
      { title: 'Domácnost+ v.0.1_57', note: 'Hotovo: kompaktnější Nastavení se záložkami a lepší prázdné stavy pro ostrou domácnost.' },
      { title: 'Domácnost+ v.0.1_58', note: 'Hotovo: průvodce prvním nastavením domácnosti, stavové kroky a čistší start pro prázdnou ostrou domácnost.' },
      { title: 'Domácnost+ v.0.1_59', note: 'Hotovo: průvodce už neruší demo, prázdná časová osa navádí na další krok a setup karty mají lepší prioritu akcí.' },
      { title: 'Domácnost+ v.0.1_60', note: 'Hotovo: průvodce prvním nastavením má fáze Základ / Denní provoz / Evidence a prázdné přehledy nově vedou rovnou na správné akce.' },
      { title: 'Domácnost+ v.0.1_61', note: 'Hotovo: zvýrazněný nejbližší krok nastavení, jasnější fáze průvodce a oprava duplicitního meta řádku v dashboardu.' },
      { title: 'Domácnost+ v.0.1_62', note: 'Hotovo: cloud-first režim, online drobné moduly, soukromé nahrávání příloh smluv a app-like chování bez zoomu/označování textu.' },
      { title: 'Domácnost+ v.0.1_63', note: 'Hotovo: Supabase Realtime pro sdílené moduly, automatické občerstvení dat mezi členy domácnosti a stabilnější cloud sync.' },
      { title: 'Domácnost+ v.0.1_64', note: 'Hotovo: cloud-first autosync, přehled položek cloud/lokál a cloud upload starších lokálních příloh smluv.' },
      { title: 'Domácnost+ v.0.1_65', note: 'Hotovo: cloudové profily domácnosti, archivace profilů a Realtime pro profily/členy.' },
      { title: 'Domácnost+ v.0.1_66', note: 'Hotovo: modulární hlavní obrazovka, zapínání/odebírání karet a počasí podle místa domácnosti.' },
      { title: 'Domácnost+ v.0.1_67', note: 'Hotovo: čistší základní obrazovka bez horního panelu, název domácnosti místo Domů a oprava pádu DateTimeFormat při neplatném datu.' },
      { title: 'Domácnost+ v.0.1_68', note: 'Hotovo: název domácnosti na Home, cloud domácnost po vytvoření a globálně odstraněný horní panel s přepínačem vzhledu.' },
      { title: 'Domácnost+ v.0.1_69', note: 'Hotovo: cloud stav, autosync, Realtime a technická připravenost přesunuté z hlavní obrazovky do Nastavení.' },
      { title: 'Domácnost+ v.0.1_70', note: 'Hotovo: upravitelný horní panel Home, kompaktní počasí s detailní stránkou, cloudová změna názvu domácnosti a číselná klávesnice pro HDO.' },
      { title: 'Domácnost+ v.0.1_71', note: 'Hotovo: základ počasí vedle času na Home, počasí jako volitelná položka horního panelu a rozšíření horního panelu o hlavní funkce domácnosti.' },
      { title: 'Domácnost+ v.0.1_73', note: 'Hotfix: bezpečný HDO rychlý přehled, sanitace HDO časů/dnů a ochrana proti zaseknutí při otevření přehledu.' },
      { title: 'Domácnost+ v.0.1_72', note: 'Hotovo: odstranění samostatné weather karty z Home, sanitace starého dashboard nastavení a prevence duplicitních cloud domácností.' },
      { title: 'Domácnost+ v.0.1_75', note: 'Hotfix: zavírání kalendáře/rychlých přehledů z Home a první globální posun UI do iOS glass stylu.' },
      { title: 'Domácnost+ v.0.1_76', note: 'Hotovo: více zdrojů kalendáře, příprava Google Calendar napojení a výběr zdroje u událostí.' },
      { title: 'Domácnost+ v.0.1_77', note: 'Hotovo: Home bez verze/popisků, bez badge nad časem a adaptivní horní panel s časem, počasím a 0–4 volitelnými položkami.' },
      { title: 'Domácnost+ v.0.1_78', note: 'Hotovo: bezpečný první krok Google Calendar integrace: UI ve Zdrojích, výběr více Google kalendářů, sync akce, SQL migrace a Edge Function skeletony bez tokenů ve frontendu.' },
      { title: 'Domácnost+ v.0.1_79', note: 'Hotfix: variabilní Home panel drží rozložení 0–4 položek a počasí v prázdném panelu ukazuje více detailů.' },
      { title: 'Domácnost+ v.0.1_80', note: 'Hotovo: Home horní panel má stabilní výšku, položky se přizpůsobují uvnitř panelu a mini karty ukazují konkrétní stav, například HDO do kdy běží nebo kdy sepne.' },
      { title: 'Domácnost+ v.0.1_81', note: 'Hotfix: při Home bez dalších panelů jsou čas a počasí pod sebou, hlavní panel zůstává stabilní a ve Více je nastavení hned nahoře.' },
      { title: 'Domácnost+ v.0.1_82', note: 'Hotovo: první bezpečný krok ČHMÚ počasí přes Edge Function s Open-Meteo fallbackem a pevně ukotvený spodní panel.' },
      { title: 'Domácnost+ v.0.1_83', note: 'Hotovo: ČHMÚ Edge Function nasazená v Supabase, spodní panel níž a rychlé detaily z Home nad navigací.' },
      { title: 'Domácnost+ v.0.1_84', note: 'Hotfix: rychlé detaily z Home už nejsou schované dole, spodní panel je níž a počasí doplňuje východ/západ slunce z číselného fallbacku.' }
    ];
    return `
      <section class="card roadmap-card">
        <div class="card-header"><div><h2>Co mám v plánu dál</h2><p>Cloudová kostra běží. Další větší směr je dokončit nasazení Google OAuth, sync pravidla a potom doladit sdílení členů domácnosti.</p></div><span class="badge">roadmap</span></div>
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

  function getCalendarSources() {
    return Array.isArray(state.calendarCloud?.sources) ? state.calendarCloud.sources : [];
  }

  function normalizeCalendarSourceProvider(provider = '') {
    const value = String(provider || '').toLowerCase();
    if (['google', 'manual', 'family', 'work', 'ical', 'other'].includes(value)) return value;
    return 'manual';
  }

  function calendarSourceProviderLabel(provider = '') {
    const labels = {
      manual: 'Ruční',
      family: 'Rodinný',
      work: 'Práce',
      google: 'Google',
      ical: 'iCal',
      other: 'Jiný'
    };
    return labels[normalizeCalendarSourceProvider(provider)] || 'Kalendář';
  }

  function calendarSourceIcon(provider = '') {
    const icons = { manual: '✍️', family: '👨‍👩‍👧', work: '🏭', google: 'G', ical: '📥', other: '📅' };
    return icons[normalizeCalendarSourceProvider(provider)] || '📅';
  }

  function mapCalendarSource(row = {}) {
    return {
      id: row.id || row.cloudId || uid(),
      cloudId: row.cloudId || row.id || '',
      householdId: row.household_id || row.householdId || currentHouseholdId(),
      profileId: row.profile_id || row.profileId || '',
      name: row.name || 'Kalendář',
      provider: normalizeCalendarSourceProvider(row.provider),
      providerCalendarId: row.provider_calendar_id || row.providerCalendarId || row.calendar_id || row.external_calendar_id || row.google_calendar_id || '',
      providerConnectionId: row.provider_connection_id || row.providerConnectionId || '',
      color: row.color || '',
      isEnabled: row.is_enabled !== undefined ? Boolean(row.is_enabled) : row.isEnabled !== false,
      syncEnabled: row.sync_enabled !== undefined ? Boolean(row.sync_enabled) : Boolean(row.syncEnabled),
      lastSyncedAt: row.last_synced_at || row.lastSyncedAt || '',
      note: row.note || '',
      createdAt: row.created_at || row.createdAt || new Date().toISOString()
    };
  }

  function getCalendarSource(sourceId) {
    const id = String(sourceId || '');
    if (!id) return null;
    return getCalendarSources().find((source) => [source.id, source.cloudId].filter(Boolean).map(String).includes(id)) || null;
  }

  function isCalendarSourceEnabled(sourceId) {
    const source = getCalendarSource(sourceId);
    return !source || source.isEnabled !== false;
  }

  function visibleCalendarEvents() {
    return (state.calendar || []).filter((event) => isCalendarSourceEnabled(event.sourceId));
  }

  function calendarSourceName(sourceId) {
    const source = getCalendarSource(sourceId);
    return source?.name || 'Ruční kalendář';
  }

  function calendarSourceOptions(selected = '') {
    const sources = getCalendarSources().filter((source) => source.isEnabled !== false);
    const options = sources.map((source) => [source.id || source.cloudId, `${source.name} · ${calendarSourceProviderLabel(source.provider)}`]);
    if (!options.length) options.push(['manual', 'Ruční kalendář']);
    return selectField('Kalendář', 'sourceId', options, selected || options[0]?.[0] || 'manual');
  }

  function googleCalendarConnection() {
    return state.calendarCloud?.googleConnection || null;
  }

  function googleCalendarItems() {
    return Array.isArray(state.calendarCloud?.googleCalendars) ? state.calendarCloud.googleCalendars : [];
  }

  function googleCalendarStatusLabel(connection = googleCalendarConnection()) {
    const status = String(connection?.status || '').toLowerCase();
    const tokenState = String(connection?.tokenState || '').toLowerCase();
    if (status === 'connected' && tokenState === 'missing') return 'účet přihlášený, token chybí';
    if (status === 'connected' && tokenState === 'ready') return 'token uložený';
    if (status === 'connected') return 'připojeno';
    if (status === 'oauth_pending') return 'čeká na dokončení OAuth';
    if (status === 'error') return 'chyba připojení';
    if (status === 'disconnected') return 'odpojeno';
    return 'nepřipojeno';
  }

  function googleCalendarLastError() {
    return state.calendarCloud?.googleLastError || googleCalendarConnection()?.lastError || null;
  }

  function googleCalendarStatusNote(connection = googleCalendarConnection()) {
    const lastError = googleCalendarLastError();
    const status = String(connection?.status || '').toLowerCase();
    const tokenState = String(connection?.tokenState || '').toLowerCase();
    const reason = String(lastError?.code || lastError?.reason || connection?.lastError || '').toLowerCase();
    const message = lastError?.message || lastError?.error || connection?.lastError || '';
    if (status === 'connected' && tokenState === 'ready') return { tone: 'good', title: 'Token uložený', text: 'Kalendáře je možné načíst. Token zůstává pouze na backendu v app_private.' };
    if (status === 'oauth_pending') return { tone: 'warn', title: 'Připojení čeká na dokončení OAuth', text: 'Dokonči přihlášení u Googlu. Když ses vrátil zpět a stav se nezměnil, použij znovupřipojení.' };
    if (status === 'connected' && tokenState === 'missing') return { tone: 'warn', title: 'Google účet je přihlášený, ale kalendářový token chybí', text: 'Aplikace už nebude sama dokola přesměrovávat. Spusť čisté znovupřipojení Google kalendáře.' };
    if (['missing_google_token', 'token_store_failed', 'missing_encryption_key', 'redirect_uri_mismatch', 'missing_calendar_scope'].includes(reason)) return { tone: 'danger', title: 'Kalendářové připojení selhalo', text: message || 'Zkontroluj redirect_uri, scopes, Edge Function secrets a šifrovací klíč.' };
    if (status === 'error' || message) return { tone: 'danger', title: 'Kalendářové připojení má chybu', text: message || 'Zkus znovu spustit připojení Google kalendáře.' };
    return { tone: '', title: 'Google kalendář není připojený', text: 'Kalendář připoj přes samostatné Google OAuth tlačítko níže.' };
  }

  function isGoogleCalendarSelected(calendarId, sourceList = getCalendarSources()) {
    const id = String(calendarId || '');
    return Boolean(id && sourceList.some((source) => normalizeCalendarSourceProvider(source.provider) === 'google' && String(source.providerCalendarId || '') === id));
  }

  function renderGoogleCalendarConnector(cloudReady, sourceList = getCalendarSources()) {
    const connection = googleCalendarConnection();
    const calendars = googleCalendarItems();
    const connected = String(connection?.status || '').toLowerCase() === 'connected';
    const tokenReady = String(connection?.tokenState || '').toLowerCase() === 'ready';
    const statusNote = googleCalendarStatusNote(connection);
    const googleSources = sourceList.filter((source) => normalizeCalendarSourceProvider(source.provider) === 'google');
    return `
      <section class="google-calendar-connector">
        <div class="item-top connector-head">
          <div>
            <div class="item-title"><span class="calendar-source-icon google-icon">G</span> Google kalendáře</div>
            <div class="item-meta">Google login slouží jen pro přihlášení. Kalendář se připojuje samostatným OAuth flow přes backend, takže token nikdy není ve frontendu.</div>
          </div>
          <span class="badge ${connected ? 'good' : ''}">${escapeHtml(googleCalendarStatusLabel(connection))}</span>
        </div>
        <div class="cloud-status-grid compact-cloud-stats google-calendar-stats">
          <div class="mini-stat"><span>Účet</span><strong>${escapeHtml(connection?.googleAccountEmail || connection?.email || '—')}</strong></div>
          <div class="mini-stat"><span>Vybrané</span><strong>${googleSources.length}</strong></div>
          <div class="mini-stat"><span>Dostupné</span><strong>${calendars.length || '—'}</strong></div>
          <div class="mini-stat"><span>Token</span><strong>${escapeHtml(connection?.tokenState === 'ready' ? 'uložený' : connection?.tokenState === 'missing' ? 'chybí' : '—')}</strong></div>
        </div>
        <div class="form-actions connector-actions">
          ${cloudReady ? `<button class="primary-btn" type="button" data-action="google-calendar-reconnect">${connected ? 'Znovu připojit Google kalendář' : 'Připojit Google kalendář'}</button>` : '<span class="badge">nejdřív online účet</span>'}
          ${cloudReady ? `<button class="ghost-btn" type="button" data-action="google-calendar-list-calendars" ${tokenReady ? '' : 'aria-describedby="google-calendar-state-note"'}>Načíst kalendáře</button>` : ''}
          ${cloudReady && googleSources.length ? '<button class="ghost-btn" type="button" data-action="google-calendar-sync">Spustit sync</button>' : ''}
          ${cloudReady && connected ? '<button class="danger-btn" type="button" data-action="google-calendar-disconnect">Odpojit Google</button>' : ''}
        </div>
        ${cloudReady ? `<div id="google-calendar-state-note" class="inline-note google-calendar-state-note ${statusNote.tone ? `is-${statusNote.tone}` : ''}"><strong>${escapeHtml(statusNote.title)}</strong><span>${escapeHtml(statusNote.text)}</span></div>` : '<div class="inline-note">Google napojení funguje jen v ostrém online účtu domácnosti. Demo zůstává read-only sandbox.</div>'}
        ${calendars.length ? `
          <form data-form="google-calendar-save-sources" class="google-calendar-picker">
            <div class="item-meta">Vyber kalendáře, které chceš zobrazovat v Domácnost+. Každý vybraný kalendář se uloží jako samostatný zdroj.</div>
            <div class="google-calendar-grid">
              ${calendars.map((calendar) => {
                const checked = isGoogleCalendarSelected(calendar.id, sourceList) || calendar.selected;
                return `
                  <label class="google-calendar-option ${checked ? 'active' : ''}">
                    <input type="checkbox" name="googleCalendarIds" value="${escapeHtml(calendar.id)}" ${checked ? 'checked' : ''}>
                    <span>
                      <strong>${escapeHtml(calendar.summary || calendar.name || 'Google kalendář')}</strong>
                      <em>${escapeHtml(calendar.id || '')}${calendar.primary ? ' · hlavní' : ''}${calendar.accessRole ? ` · ${escapeHtml(calendar.accessRole)}` : ''}</em>
                    </span>
                  </label>
                `;
              }).join('')}
            </div>
            <div class="form-actions">
              <button class="primary-btn" type="submit">Uložit vybrané kalendáře</button>
            </div>
          </form>
        ` : '<div class="inline-note">Po připojení Google kalendáře se tady zobrazí dostupné kalendáře. Když token chybí, spusť připojení znovu tímto tlačítkem.</div>'}
      </section>
    `;
  }

  function normalizeCalendarMonth(value) {
    const clean = String(value || '').slice(0, 7);
    return /^\d{4}-\d{2}$/.test(clean) ? clean : todayISO().slice(0, 7);
  }

  function shiftCalendarMonth(monthKey, delta = 0) {
    const clean = normalizeCalendarMonth(monthKey);
    const [year, month] = clean.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1 + Number(delta || 0), 1));
    return date.toISOString().slice(0, 7);
  }

  function calendarMonthTitle(monthKey) {
    const clean = normalizeCalendarMonth(monthKey);
    const [year, month] = clean.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, 1));
    return new Intl.DateTimeFormat('cs-CZ', { month: 'long', year: 'numeric' }).format(date);
  }

  function calendarDayNumber(isoDate) {
    const day = Number(String(isoDate || '').slice(8, 10));
    return Number.isFinite(day) ? day : '';
  }

  function calendarDayHeaderText(isoDate) {
    const date = new Date(`${String(isoDate || '').slice(0, 10)}T00:00:00`);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('cs-CZ', { weekday: 'short', day: 'numeric', month: 'numeric' }).format(date);
  }

  function calendarCellEventTime(event) {
    if (!event?.time) return 'celý den';
    return event.endTime ? `${event.time}–${event.endTime}` : event.time;
  }

  function renderCalendarMonthGrid(events = [], monthKey = calendarViewMonth) {
    const month = normalizeCalendarMonth(monthKey);
    const [year, rawMonth] = month.split('-').map(Number);
    const firstDay = new Date(Date.UTC(year, rawMonth - 1, 1));
    const lastDay = new Date(Date.UTC(year, rawMonth, 0));
    const leadingDays = (firstDay.getUTCDay() + 6) % 7;
    const trailingDays = 6 - ((lastDay.getUTCDay() + 6) % 7);
    const gridStart = addDaysIso(`${month}-01`, -leadingDays);
    const gridEnd = addDaysIso(lastDay.toISOString().slice(0, 10), trailingDays);
    const monthEvents = sortCalendarEventsByStart(events).filter((event) => event.date && event.date >= gridStart && event.date <= gridEnd);
    const eventsByDate = monthEvents.reduce((acc, event) => {
      const key = String(event.date || '').slice(0, 10);
      if (!key) return acc;
      if (!acc[key]) acc[key] = [];
      acc[key].push(event);
      return acc;
    }, {});
    const days = [];
    let cursor = gridStart;
    while (cursor <= gridEnd) {
      days.push(cursor);
      cursor = addDaysIso(cursor, 1);
    }
    while (days.length < 35) days.push(addDaysIso(days[days.length - 1], 1));
    const weeks = [];
    for (let index = 0; index < days.length; index += 7) weeks.push(days.slice(index, index + 7));
    const monthEventCount = monthEvents.filter((event) => String(event.date || '').startsWith(month)).length;
    const today = todayISO();
    const dayNames = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];
    return `
      <div class="calendar-month-view">
        <div class="calendar-month-toolbar">
          <div>
            <span class="badge">Měsíční přehled</span>
            <h3>${escapeHtml(calendarMonthTitle(month))}</h3>
            <p>${monthEventCount ? `${monthEventCount} událostí v měsíci` : 'Žádné události v tomto měsíci'}</p>
          </div>
          <div class="calendar-month-actions">
            <button class="ghost-btn" type="button" data-action="calendar-month-prev">‹</button>
            <button class="ghost-btn" type="button" data-action="calendar-month-today">Dnes</button>
            <button class="ghost-btn" type="button" data-action="calendar-month-next">›</button>
          </div>
        </div>
        <div class="calendar-grid" role="table" aria-label="Kalendář ${escapeHtml(calendarMonthTitle(month))}">
          <div class="calendar-weekdays" role="row">
            ${dayNames.map((day) => `<div class="calendar-weekday" role="columnheader">${day}</div>`).join('')}
          </div>
          ${weeks.map((week, weekIndex) => `
            <div class="calendar-week-row" role="row" aria-label="Týden ${weekIndex + 1}">
              ${week.map((dayIso) => {
                const dayEvents = eventsByDate[dayIso] || [];
                const visible = dayEvents.slice(0, 3);
                const hidden = dayEvents.length - visible.length;
                const outside = !dayIso.startsWith(month);
                const weekend = [0, 6].includes((new Date(`${dayIso}T00:00:00Z`)).getUTCDay());
                const holiday = czechPublicHolidayName(dayIso);
                return `
                  <div class="calendar-day ${outside ? 'outside-month' : ''} ${dayIso === today ? 'today' : ''} ${weekend ? 'weekend' : ''} ${holiday ? 'holiday' : ''}" role="cell">
                    <div class="calendar-day-head">
                      <span class="calendar-day-number">${calendarDayNumber(dayIso)}</span>
                      <span class="calendar-day-name">${escapeHtml(calendarDayHeaderText(dayIso))}</span>
                    </div>
                    <div class="calendar-day-events">
                      ${visible.map((event) => `
                        <button class="calendar-day-event ${event.cloudId ? 'cloud-event' : ''}" type="button" data-action="calendar-event-detail" data-id="${escapeHtml(event.id || event.cloudId || '')}" title="${escapeHtml(event.title)}">
                          <strong>${escapeHtml(event.title)}</strong>
                          <span>${escapeHtml(calendarCellEventTime(event))}${event.location ? ` · ${escapeHtml(event.location)}` : ''}</span>
                        </button>
                      `).join('')}
                      ${hidden > 0 ? `<div class="calendar-more-events">+${hidden} další</div>` : ''}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderCalendarSourceList(sources = getCalendarSources()) {
    if (!sources.length) {
      return renderEmptyCta({ icon: '📅', title: 'Zatím žádné zdroje', text: 'Začni ručním rodinným kalendářem. Google Calendar bude připravený přes bezpečný backend.', action: 'cloud-load-calendar-sources', label: 'Načíst zdroje' });
    }
    return `<div class="list compact-list calendar-source-list">${sources.map((source) => {
      const linkedEvents = (state.calendar || []).filter((event) => String(event.sourceId || '') === String(source.id || source.cloudId || '')).length;
      const google = normalizeCalendarSourceProvider(source.provider) === 'google';
      return `
        <div class="item calendar-source-item ${source.isEnabled === false ? 'muted-item' : ''}">
          <div class="item-top">
            <div class="item-title"><span class="calendar-source-icon">${escapeHtml(calendarSourceIcon(source.provider))}</span> ${escapeHtml(source.name)}</div>
            <span class="badge ${source.isEnabled === false ? '' : 'good'}">${source.isEnabled === false ? 'skrytý' : 'aktivní'}</span>
          </div>
          <div class="item-meta">${escapeHtml(calendarSourceProviderLabel(source.provider))}${source.providerCalendarId ? ` · ${escapeHtml(source.providerCalendarId)}` : ''}${source.syncEnabled ? ' · sync zapnutý' : ''}${source.lastSyncedAt ? ` · poslední sync ${formatDateTime(source.lastSyncedAt)}` : ''}</div>
          ${source.note ? `<div class="item-meta">${escapeHtml(source.note)}</div>` : ''}
          <div class="cloud-status-grid compact-cloud-stats source-mini-stats">
            <div class="mini-stat"><span>Události</span><strong>${linkedEvents}</strong></div>
            <div class="mini-stat"><span>Typ</span><strong>${escapeHtml(calendarSourceProviderLabel(source.provider))}</strong></div>
            <div class="mini-stat"><span>Stav</span><strong>${source.isEnabled === false ? 'skrytý' : 'viditelný'}</strong></div>
          </div>
          <div class="item-actions">
            <button class="ghost-btn" type="button" data-action="calendar-toggle-source" data-source-id="${escapeHtml(source.id || source.cloudId || '')}" data-enabled="${source.isEnabled === false ? 'true' : 'false'}">${source.isEnabled === false ? 'Zobrazit' : 'Skrýt'}</button>
            ${google && state.cloud?.householdId ? `<button class="ghost-btn" type="button" data-action="google-calendar-sync" data-source-id="${escapeHtml(source.cloudId || source.id || '')}">Sync</button>` : ''}
            <button class="danger-btn" type="button" data-action="calendar-delete-source" data-source-id="${escapeHtml(source.id || source.cloudId || '')}">Odebrat</button>
            ${google && !state.cloud?.householdId ? '<span class="badge">čeká na online účet</span>' : ''}
          </div>
        </div>
      `;
    }).join('')}</div>`;
  }

  function renderCalendar() {
    const sourceList = getCalendarSources();
    const enabledSourceIds = new Set(sourceList.filter((source) => source.isEnabled !== false).map((source) => String(source.id || source.cloudId || '')));
    const events = [...visibleCalendarEvents()].sort((a, b) => `${a.date || ''}${a.time || ''}`.localeCompare(`${b.date || ''}${b.time || ''}`));
    const upcoming = events.filter((event) => !event.date || event.date >= todayISO()).slice(0, 12);
    const past = events.filter((event) => event.date && event.date < todayISO()).reverse().slice(0, 8);
    const hiddenEvents = (state.calendar || []).filter((event) => event.sourceId && !enabledSourceIds.has(String(event.sourceId)) && getCalendarSource(event.sourceId)).length;
    const cloudReady = Boolean(state.cloud?.householdId);
    const localOnly = events.filter((event) => !event.cloudId).length;
    const cloudCount = events.filter((event) => event.cloudId).length;
    const activeSources = sourceList.filter((source) => source.isEnabled !== false).length;
    const activeCalendarTab = getModuleTab('calendar', 'overview');
    return `
      ${renderSectionTabs('calendar', [
        { id: 'overview', label: 'Přehled', icon: '📅', count: upcoming.length },
        { id: 'sources', label: 'Zdroje', icon: '🧩', count: sourceList.length },
        { id: 'add', label: 'Přidat', icon: '➕' },
        { id: 'history', label: 'Historie', icon: '🕘', count: past.length }
      ], 'overview')}
      <div class="grid two module-tabbed calendar-tab-${activeCalendarTab}" data-tab-area="calendar">
        <section class="card desktop-span-2 calendar-panel panel-overview">
          <div class="card-header">
            <div><h2>Kalendář</h2><p>Události se dají držet ve více kalendářích. Google Calendar je připravený přes bezpečný backend, ne přes tokeny ve frontendu.</p></div>
            <span class="badge ${cloudCount ? 'good' : ''}">${events.length} položek · ${activeSources} zdrojů</span>
          </div>
          <div class="cloud-status-grid compact-cloud-stats">
            <div class="mini-stat"><span>Dnes</span><strong>${events.filter((event) => event.date === todayISO()).length}</strong></div>
            <div class="mini-stat"><span>Brzy</span><strong>${upcoming.length}</strong></div>
            <div class="mini-stat"><span>Zdroje</span><strong>${activeSources}/${sourceList.length || 1}</strong></div>
            <div class="mini-stat"><span>Lokálně</span><strong>${localOnly}</strong></div>
          </div>
          ${hiddenEvents ? `<div class="inline-note">${hiddenEvents} událostí je schovaných, protože jejich kalendář je vypnutý.</div>` : ''}
          ${renderCalendarMonthGrid(events, calendarViewMonth)}
          ${events.length ? '' : renderEmptyCta({ icon: '📅', title: 'Kalendář je prázdný', text: 'Přidej první událost nebo zdroj kalendáře. Měsíční přehled zůstává připravený.', nav: 'calendar', tab: 'add', label: 'Přidat událost' })}
        </section>

        <section class="card desktop-span-2 calendar-panel panel-sources">
          <div class="card-header">
            <div><h2>Zdroje kalendáře</h2><p>Tady se spravují ruční, rodinné, pracovní a Google kalendáře. Google se páruje přes bezpečný backend.</p></div>
            <span class="badge ${cloudReady ? 'good' : ''}">${cloudReady ? 'cloud' : 'lokálně'}</span>
          </div>
          ${renderGoogleCalendarConnector(cloudReady, sourceList)}
          ${renderCalendarSourceList(sourceList)}
          <details class="compact-edit-details" open>
            <summary><span>Přidat zdroj kalendáře</span><em>ruční / Google připravený na backend</em></summary>
            <form data-form="add-calendar-source" class="compact-form">
              <div class="form-grid two">
                ${field('Název kalendáře', 'name', 'text', 'Rodina / Práce / Google osobní', true)}
                ${selectField('Typ', 'provider', [['manual', 'Ruční'], ['family', 'Rodinný'], ['work', 'Práce'], ['google', 'Google Calendar'], ['ical', 'iCal / externí'], ['other', 'Jiný']])}
                ${field('ID / popis kalendáře', 'providerCalendarId', 'text', 'volitelné, např. primární / práce')}
                ${field('Barva', 'color', 'text', '#8b5cf6')}
                ${field('Poznámka', 'note', 'text', 'volitelné')}
              </div>
              <div class="form-actions">
                <button class="primary-btn" type="submit">Přidat zdroj</button>
                ${cloudReady ? '<button class="ghost-btn" type="button" data-action="cloud-load-calendar-sources">Načíst zdroje</button>' : ''}
                ${cloudReady && sourceList.filter((source) => !source.cloudId).length ? `<button class="ghost-btn" type="button" data-action="cloud-sync-local-calendar-sources">Odeslat lokální zdroje (${sourceList.filter((source) => !source.cloudId).length})</button>` : ''}
              </div>
            </form>
          </details>
          <div class="inline-note">Google Calendar v tomhle buildu počítá se Supabase Edge Functions. Bez Google Cloud credentials půjde UI připravit, ale reálné přihlášení poběží až po nasazení funkcí a doplnění secrets.</div>
        </section>

        <section class="card calendar-panel panel-add">
          <div class="card-header">
            <div><h2>Přidat událost</h2><p>Vyber kalendář/zdroj, aby šlo později oddělit rodinu, práci, Google nebo další externí kalendáře.</p></div>
            <span class="badge ${cloudCount ? 'good' : ''}">${cloudCount ? 'cloud' : 'lokálně'}</span>
          </div>
          <form data-form="add-event">
            <div class="form-grid two">
              ${field('Název', 'title', 'text', 'Doktor / návštěva / výlet', true)}
              ${calendarSourceOptions()}
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
        </section>

        <section class="card desktop-span-2 calendar-panel panel-history">
          <div class="card-header"><div><h2>Historie</h2><p>Poslední starší události, aby hlavní přehled nebyl zbytečně dlouhý.</p></div></div>
          ${past.length ? renderEventList(past, true) : renderEmpty('Historie je zatím prázdná.')}
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
        <div class="item-meta">${escapeHtml(calendarEventMetaLabel(event, now))} · ${escapeHtml(calendarSourceName(event.sourceId))}</div>
        ${withDelete ? `<div class="item-actions">${state.cloud?.householdId && !event.cloudId ? `<button class="ghost-btn" type="button" data-action="cloud-sync-calendar" data-id="${event.id}">Odeslat</button>` : ''}<button class="danger-btn" type="button" data-action="delete-calendar" data-id="${event.id}">Smazat</button></div>` : ''}
      </div>
    `).join('')}</div>`;
  }

  function renderPackages() {
    const packages = [...state.packages].sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
    const activePackages = packages.filter((pkg) => !['delivered', 'archived'].includes(pkg.status));
    const deliveredPackages = packages.filter((pkg) => ['delivered', 'archived'].includes(pkg.status));
    const cloudReady = Boolean(state.cloud?.householdId);
    const localOnly = packages.filter((pkg) => !pkg.cloudId).length;
    const cloudCount = packages.filter((pkg) => pkg.cloudId).length;
    const activePackagesTab = getModuleTab('packages', 'active');
    return `
      ${renderSectionTabs('packages', [
        { id: 'active', label: 'Aktivní', icon: '📦', count: activePackages.length },
        { id: 'add', label: 'Přidat', icon: '➕' },
        { id: 'archive', label: 'Doručené', icon: '✅', count: deliveredPackages.length }
      ], 'active')}
      <div class="grid two module-tabbed packages-tab-${activePackagesTab}" data-tab-area="packages">
        <section class="card desktop-span-2 packages-panel panel-active">
          <div class="card-header">
            <div><h2>Aktivní balíky</h2><p>Vepředu jsou jen zásilky, které ještě řešíš. Přidávání je schované v záložce, aby modul nebyl roztahaný.</p></div>
            <span class="badge ${cloudCount ? 'good' : ''}">${packages.length} celkem · ${cloudCount} cloud</span>
          </div>
          <div class="cloud-status-grid compact-cloud-stats">
            <div class="mini-stat"><span>Aktivní</span><strong>${activePackages.length}</strong></div>
            <div class="mini-stat"><span>K vyzvednutí</span><strong>${activePackages.filter((pkg) => ['pickup', 'ready_pickup'].includes(pkg.status)).length}</strong></div>
            <div class="mini-stat"><span>Cloud</span><strong>${cloudCount}</strong></div>
            <div class="mini-stat"><span>Lokálně</span><strong>${localOnly}</strong></div>
          </div>
          ${activePackages.length ? `<div class="list compact-list">${activePackages.map(renderPackageItem).join('')}</div>` : renderEmptyCta({ icon: '📦', title: 'Žádný aktivní balík', text: 'Přidej zásilku ručně. Později půjde automatika přes bezpečný backend.', nav: 'packages', tab: 'add', label: 'Přidat balík' })}
        </section>

        <section class="card packages-panel panel-add">
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
          <div class="inline-note">Balíky jsou při cloudu oddělené podle domácnosti. Cizí domácnost neuvidí tvoje tracking čísla ani poznámky.</div>
        </section>

        <section class="card desktop-span-2 packages-panel panel-archive">
          <div class="card-header"><div><h2>Doručené / archiv</h2><p>Hotové balíky jsou mimo hlavní přehled, aby aktivní část zůstala krátká.</p></div></div>
          ${deliveredPackages.length ? `<div class="list compact-list">${deliveredPackages.slice(0, 30).map(renderPackageItem).join('')}</div>` : renderEmptyCta({ icon: '✅', title: 'Archiv je prázdný', text: 'Doručené balíky se sem přesunou automaticky po označení jako doručené.' })}
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
    const activeShoppingTab = getModuleTab('shopping', 'list');
    return `
      ${renderSectionTabs('shopping', [
        { id: 'list', label: 'Seznam', icon: '🛒', count: openItems.length },
        { id: 'catalog', label: 'Katalog', icon: '📚', count: catalog.length },
        { id: 'coupons', label: 'Kódy', icon: '🏷️', count: coupons.length }
      ], 'list')}
      <div class="grid two module-tabbed shopping-tab-${activeShoppingTab}">
        <section class="card desktop-span-2 shopping-panel panel-list listonic-panel">
          <div class="card-header">
            <div><h2>Nákupní seznam</h2><p>Jednoduchý checklist ve stylu rychlého nákupu: přidat, odškrtnout, hotovo.</p></div>
            <span class="badge ${cloudReady ? 'good' : ''}">${cloudReady ? 'cloud nákupy' : 'lokálně'}</span>
          </div>
          <div class="shopping-progress-card"><div><strong>${openItems.length ? `${openItems.length} koupit` : 'Nákup hotový'}</strong><span>${doneItems.length} hotovo · ${state.shopping.length} celkem</span></div><div class="shopping-progress"><span style="width:${state.shopping.length ? Math.round((doneItems.length / state.shopping.length) * 100) : 0}%"></span></div></div>
          <div class="quick-add-panel listonic-quick-add">
            <div class="quick-add-head"><strong>Rychlé přidání</strong><span>Časem se sem dostanou věci, které kupujete nejčastěji.</span></div>
            <div class="quick-chip-row">
              ${quickItems.map((item) => `<button class="quick-chip" type="button" data-action="quick-add-shopping" data-name="${escapeHtml(item.name)}"><span>${escapeHtml(item.name)}</span><small>${escapeHtml(item.defaultUnit || 'ks')}</small></button>`).join('')}
            </div>
          </div>
          <form data-form="add-shopping" class="listonic-add-form">
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
          ${openItems.length ? `<div class="list shopping-listonic-list">${openItems.map(renderShoppingItem).join('')}</div>` : renderEmptyCta({ icon: '🛒', title: 'Nákup je prázdný', text: 'Přidej položku z katalogu nebo vlastní položku domácnosti.', nav: 'shopping', tab: 'list', label: 'Přidat položku' })}
          ${doneItems.length ? `<div class="card-header" style="margin-top:16px"><div><h3>Hotovo</h3><p>${doneItems.length} položek</p></div></div><div class="list shopping-listonic-list shopping-listonic-done">${doneItems.slice(0, 6).map(renderShoppingItem).join('')}</div>` : ''}
        </section>

        <section class="card shopping-panel panel-catalog">
          <div class="card-header"><div><h2>Katalog domácnosti</h2><p>Časté věci k nákupu. Základ je společný, tvoje vlastní položky jsou oddělené podle domácnosti.</p></div></div>
          <div class="list compact-list">
            ${catalog.slice(0, 24).map((item) => `<div class="item compact-item"><div class="item-top"><div class="item-title">${escapeHtml(item.name)}</div><span class="badge">${escapeHtml(item.defaultUnit || 'ks')}</span></div><div class="item-meta">${escapeHtml(item.category || 'Ostatní')} · ${shoppingSourceLabel(item)}${getShoppingStat(item.name)?.count ? ` · použito ${getShoppingStat(item.name).count}×` : ''}</div><div class="item-actions"><button class="ghost-btn" type="button" data-action="quick-add-shopping" data-name="${escapeHtml(item.name)}">Přidat</button></div></div>`).join('')}
          </div>
        </section>

        <section class="card shopping-panel panel-coupons">
          <div class="card-header"><div><h2>Slevové kódy</h2><p>Kupóny a kódy, které nechceš zapomenout. V online domácnosti jsou sdílené pro všechny členy.</p></div><span class="badge ${coupons.some((item) => item.cloudId) ? 'good' : ''}">${coupons.some((item) => item.cloudId) ? 'cloud' : 'lokálně'}</span></div>
          <form data-form="add-coupon">
            <div class="form-grid two">
              ${field('Obchod / služba', 'store', 'text', 'Alza / Temu / Allegro', true)}
              ${field('Kód', 'code', 'text', 'SLEVA10', true)}
              ${field('Sleva', 'discount', 'text', '10 % / 200 Kč')}
              ${field('Platnost do', 'expiry', 'date', '')}
              ${field('Poznámka', 'note', 'text', 'volitelné')}
            </div>
            <div class="form-actions"><button class="primary-btn" type="submit">Uložit kód</button>${cloudReady ? '<button class="ghost-btn" type="button" data-action="cloud-load-extras">Načíst cloud kódy</button>' : ''}${cloudReady && coupons.some((item) => !item.cloudId) ? `<button class="ghost-btn" type="button" data-action="cloud-sync-local-extras">Odeslat lokální kódy (${coupons.filter((item) => !item.cloudId).length})</button>` : ''}</div>
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
      <div class="item shopping-listonic-item ${item.done ? 'done' : ''}">
        <button class="shopping-check-btn ${item.done ? 'checked' : ''}" type="button" data-action="toggle-done" data-collection="shopping" data-id="${item.id}" aria-label="${item.done ? 'Vrátit položku' : 'Označit jako koupené'}">
          ${item.done ? '✓' : ''}
        </button>
        <div class="shopping-listonic-copy">
          <div class="item-title">${escapeHtml(item.name)}</div>
          <div class="item-meta">${escapeHtml(item.category || 'bez kategorie')}${item.note ? ` · ${escapeHtml(item.note)}` : ''}${item.cloudId ? ' · cloud' : ''}</div>
        </div>
        <span class="badge shopping-amount-pill">${escapeHtml(amount)}</span>
        <button class="danger-btn mini-danger-btn" type="button" data-action="delete" data-collection="shopping" data-id="${item.id}" aria-label="Smazat ${escapeHtml(item.name)}">×</button>
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

  function normalizeWarrantyStatus(value) {
    const key = normalizeKey(value || 'active');
    return WARRANTY_STATUS_OPTIONS.some(([id]) => id === key) ? key : 'active';
  }

  function warrantyStatusLabel(value) {
    return WARRANTY_STATUS_OPTIONS.find(([id]) => id === normalizeWarrantyStatus(value))?.[1] || 'Aktivní';
  }

  function normalizeWarrantyItem(item = {}) {
    const purchaseDate = normalizeText(item.purchaseDate || item.purchase_date || item.date || todayISO());
    const warrantyUntil = normalizeText(item.warrantyUntil || item.warranty_until || item.until || addYearsIso(purchaseDate, 2));
    return {
      id: item.id || `warranty-${uid()}`,
      householdId: item.householdId || '',
      profileId: item.profileId || '',
      createdAt: item.createdAt || item.created_at || new Date().toISOString(),
      name: normalizeText(item.name || item.title) || 'Věc v záruce',
      store: normalizeText(item.store || item.seller || ''),
      category: normalizeText(item.category || ''),
      price: normalizeText(item.price || ''),
      purchaseDate,
      warrantyUntil,
      status: normalizeWarrantyStatus(item.status),
      note: normalizeText(item.note || item.notes || '')
    };
  }

  function normalizeWarranties(items = []) {
    return Array.isArray(items) ? items.map(normalizeWarrantyItem).filter((item) => item.name) : [];
  }

  function warrantyTone(item) {
    if (item.status === 'archived' || item.status === 'done') return 'good';
    if (item.status === 'claim') return 'warn';
    const days = daysUntil(item.warrantyUntil);
    if (days === null) return '';
    if (days < 0) return 'bad';
    if (days <= 30) return 'warn';
    return 'good';
  }

  function warrantyBadge(item) {
    if (item.status === 'claim') return 'reklamace';
    if (item.status === 'done') return 'vyřešeno';
    if (item.status === 'archived') return 'archiv';
    const days = daysUntil(item.warrantyUntil);
    if (days === null) return 'bez data';
    if (days < 0) return 'po záruce';
    if (days === 0) return 'končí dnes';
    if (days <= 30) return `končí za ${days} d`;
    return `zbývá ${days} d`;
  }

  function sortedWarranties() {
    return normalizeWarranties(state.warranties)
      .sort((a, b) => {
        const aArchived = ['archived', 'done'].includes(a.status) ? 1 : 0;
        const bArchived = ['archived', 'done'].includes(b.status) ? 1 : 0;
        if (aArchived !== bArchived) return aArchived - bArchived;
        return String(a.warrantyUntil || '9999').localeCompare(String(b.warrantyUntil || '9999'));
      });
  }

  function renderWarrantyItem(item) {
    const meta = [
      item.store,
      item.category,
      item.price ? formatCurrency(item.price) : '',
      `koupeno ${formatDate(item.purchaseDate)}`,
      `záruka do ${formatDate(item.warrantyUntil)}`,
      warrantyStatusLabel(item.status)
    ].filter(Boolean).join(' · ');
    return `
      <div class="item warranty-item">
        <div class="item-top">
          <div class="item-title">🧾 ${escapeHtml(item.name)}</div>
          <span class="badge ${warrantyTone(item)}">${escapeHtml(warrantyBadge(item))}</span>
        </div>
        <div class="item-meta">${escapeHtml(meta)}</div>
        ${item.note ? `<div class="inline-note compact-note">${escapeHtml(item.note)}</div>` : ''}
        <div class="item-actions"><button class="danger-btn" type="button" data-action="delete-warranty" data-id="${item.id}">Smazat</button></div>
      </div>
    `;
  }

  function renderWarrantiesPanel(warranties) {
    const activeItems = warranties.filter((item) => !['archived', 'done'].includes(item.status));
    const claimCount = warranties.filter((item) => item.status === 'claim').length;
    const endingSoon = warranties.filter((item) => {
      const days = daysUntil(item.warrantyUntil);
      return item.status === 'active' && days !== null && days >= 0 && days <= 30;
    }).length;
    const expired = warranties.filter((item) => {
      const days = daysUntil(item.warrantyUntil);
      return item.status === 'active' && days !== null && days < 0;
    }).length;
    return `
      <section class="card homecare-panel panel-warranties">
        <div class="card-header">
          <div><h2>Záruky</h2><p>Koupené věci, konec záruky a poznámky třeba k reklamaci.</p></div>
          <span class="badge ${state.cloud?.householdId ? 'good' : ''}">${state.cloud?.householdId ? 'sdílené v domácnosti' : 'lokálně'}</span>
        </div>
        ${renderOverviewSummary([
          { label: 'Aktivní', value: activeItems.length },
          { label: 'Do 30 dnů', value: endingSoon, tone: endingSoon ? 'warn' : '' },
          { label: 'Reklamace', value: claimCount, tone: claimCount ? 'warn' : '' },
          { label: 'Po záruce', value: expired, tone: expired ? 'bad' : '' }
        ])}
        <form data-form="add-warranty" class="compact-form warranty-form">
          <div class="form-grid two">
            ${field('Věc', 'name', 'text', 'televize / pračka / telefon', true)}
            ${field('Obchod', 'store', 'text', 'Alza / Datart / Kaufland')}
            ${field('Kategorie', 'category', 'text', 'elektronika / spotřebič')}
            ${field('Cena', 'price', 'number', 'volitelné')}
            ${field('Datum koupě', 'purchaseDate', 'date', '', true, todayISO())}
            ${field('Záruka do', 'warrantyUntil', 'date', 'automaticky 2 roky', false, addYearsIso(todayISO(), 2))}
            ${selectField('Stav', 'status', WARRANTY_STATUS_OPTIONS, 'active')}
            ${field('Poznámka / reklamace', 'note', 'text', 'např. reklamováno, číslo reklamace, domluva')}
          </div>
          <div class="inline-note compact-note">Když konec záruky necháš podle návrhu, počítá se automaticky 2 roky od data koupě. U prodloužené záruky ho jen ručně přepíšeš.</div>
          <div class="form-actions"><button class="primary-btn" type="submit">Přidat záruku</button></div>
        </form>
        <div style="height:14px"></div>
        ${warranties.length ? `<div class="list warranty-list">${warranties.map(renderWarrantyItem).join('')}</div>` : renderEmptyCta({ icon: '🧾', title: 'Záruky jsou prázdné', text: 'Přidej první koupenou věc. Konec záruky se předvyplní na 2 roky od nákupu.', nav: 'homecare', tab: 'warranties', label: 'Přidat záruku' })}
      </section>
    `;
  }

  function polishShopEntryBadge(entry) {
    if (!entry) return '—';
    if (entry.status === 'closed') return 'zavřeno';
    if (entry.status === 'limited') return 'omezeno';
    return 'info';
  }

  function polishShopEntryTone(entry) {
    if (!entry) return '';
    if (entry.status === 'closed') return 'bad';
    if (entry.status === 'limited') return 'warn';
    return 'good';
  }

  function renderPolishShopEntry(entry) {
    const days = daysUntil(entry.date);
    const dayText = days === 0 ? 'dnes' : days === 1 ? 'zítra' : days !== null && days > 1 ? `za ${days} dní` : shortWeekday(entry.date);
    return `
      <div class="item polish-shop-row polish-shop-row-${escapeHtml(entry.status || 'info')}">
        <div class="item-top">
          <div class="item-title">${entry.status === 'limited' ? '⚠️' : '🇵🇱'} ${escapeHtml(entry.name)}</div>
          <span class="badge ${polishShopEntryTone(entry)}">${escapeHtml(polishShopEntryBadge(entry))}</span>
        </div>
        <div class="item-meta">${escapeHtml(formatDate(entry.date))} · ${escapeHtml(dayText)} · ${escapeHtml(entry.reason || '')}</div>
      </div>
    `;
  }

  function renderPolishTradingSundayItem(date) {
    const days = daysUntil(date);
    const dayText = days === 0 ? 'dnes' : days === 1 ? 'zítra' : days !== null && days > 1 ? `za ${days} dní` : shortWeekday(date);
    return `<div class="chip-card"><strong>${escapeHtml(formatDate(date))}</strong><span>${escapeHtml(dayText)}</span></div>`;
  }

  function renderPolishHolidaysPanel() {
    state.polishShopClosures = normalizePolishShopState(state.polishShopClosures);
    const year = polishShopSelectedYear();
    const entries = buildPolishShopCalendarYear(year);
    const todayEntry = polishShopTodayEntry(0);
    const tomorrowEntry = polishShopTodayEntry(1);
    const upcoming = polishShopCalendarAround(year).filter((entry) => entry.date >= todayISO()).slice(0, 8);
    const closedCount = entries.filter((entry) => entry.status === 'closed').length;
    const trading = polishTradingSundays(year);
    const nextTrading = trading.filter((date) => date >= todayISO()).slice(0, 4);
    const years = [];
    for (let y = Math.max(POLISH_SHOP_YEAR_MIN, new Date().getFullYear() - 1); y <= Math.min(POLISH_SHOP_YEAR_MAX, new Date().getFullYear() + 3); y += 1) years.push([String(y), String(y)]);
    const statusTitle = todayEntry?.status === 'closed' ? 'Dnes v Polsku zavřeno' : todayEntry?.status === 'limited' ? 'Dnes pozor na zkrácený provoz' : 'Dnes bez známého zákazu';
    const statusText = todayEntry ? `${todayEntry.name} · ${todayEntry.reason}` : 'Velké obchody by dnes podle vestavěného kalendáře neměly být plošně zavřené.';
    const source = state.polishShopClosures.updatedAt ? `online aktualizováno ${formatDateTime(new Date(state.polishShopClosures.updatedAt))}` : 'vestavěný kalendář + online aktualizace na tlačítko';
    return `
      <section class="card homecare-panel panel-polish-holidays polish-shop-panel">
        <div class="card-header">
          <div><h2>Svátky Polsko</h2><p>Hlídá dny, kdy bývají v Polsku zavřené velké obchody a galerie.</p></div>
          <span class="badge ${todayEntry?.status === 'closed' ? 'bad' : todayEntry?.status === 'limited' ? 'warn' : 'good'}">${todayEntry?.status === 'closed' ? 'dnes zavřeno' : todayEntry?.status === 'limited' ? 'pozor dnes' : 'dnes OK'}</span>
        </div>
        <div class="polish-shop-hero">
          <div class="polish-shop-status ${polishShopEntryTone(todayEntry)}"><span>🇵🇱</span><div><strong>${escapeHtml(statusTitle)}</strong><em>${escapeHtml(statusText)}</em></div></div>
          <div class="polish-shop-mini">
            <div class="mini-stat"><span>Zítra</span><strong>${escapeHtml(tomorrowEntry ? polishShopEntryBadge(tomorrowEntry) : 'OK')}</strong></div>
            <div class="mini-stat"><span>${escapeHtml(year)}</span><strong>${closedCount}</strong></div>
            <div class="mini-stat"><span>Neděle handl.</span><strong>${trading.length}</strong></div>
          </div>
        </div>
        <form data-form="polish-holidays-year" class="compact-form polish-shop-toolbar">
          <div class="form-grid two">
            ${selectField('Rok', 'year', years, String(year))}
            <div class="field"><label>Zdroj</label><input class="input" value="${escapeHtml(source)}" readonly></div>
          </div>
          <div class="form-actions compact-actions"><button class="ghost-btn" type="submit">Zobrazit rok</button><button class="primary-btn" type="button" data-action="polish-holidays-refresh">Online aktualizace</button></div>
          ${state.polishShopClosures.error ? `<div class="inline-note warn-note">${escapeHtml(state.polishShopClosures.error)}</div>` : ''}
        </form>
        <div class="grid two polish-shop-grid">
          <div>
            <div class="card-header small"><div><h3>Nejbližší zavření / omezení</h3><p>Praktické pro cestu do Polska.</p></div></div>
            ${upcoming.length ? `<div class="list compact-list">${upcoming.map(renderPolishShopEntry).join('')}</div>` : renderEmpty('V nejbližší době není známé zavření.')}
          </div>
          <div>
            <div class="card-header small"><div><h3>Neděle handlowe ${escapeHtml(year)}</h3><p>V tyhle neděle bývají velké obchody otevřené.</p></div></div>
            <div class="chip-grid polish-trading-grid">${(nextTrading.length ? nextTrading : trading.slice(0, 4)).map(renderPolishTradingSundayItem).join('')}</div>
          </div>
        </div>
        <details class="compact-edit-details polish-shop-all">
          <summary><span>Celý přehled roku ${escapeHtml(year)}</span><em>${entries.length} položek</em></summary>
          <div class="list compact-list">${entries.map(renderPolishShopEntry).join('')}</div>
        </details>
        <div class="inline-note compact-note">Poznámka: výjimky můžou mít malé obchody, čerpací stanice, lékárny nebo provozy, kde obsluhuje majitel. Modul je dělaný hlavně pro velké obchody a galerie.</div>
      </section>
    `;
  }

  async function refreshPolishShopHolidaysOnline() {
    state.polishShopClosures = normalizePolishShopState(state.polishShopClosures);
    const year = polishShopSelectedYear();
    const years = [...new Set([year, year + 1].filter((item) => item >= POLISH_SHOP_YEAR_MIN && item <= POLISH_SHOP_YEAR_MAX))];
    try {
      const nextOnline = { ...(state.polishShopClosures.onlineHolidays || {}) };
      for (const y of years) {
        const response = await fetch(`${POLISH_SHOP_HOLIDAY_API}/${y}/PL`, { headers: { accept: 'application/json' } });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = await response.json();
        if (!Array.isArray(payload)) throw new Error('Nečekaná odpověď');
        nextOnline[y] = payload.map((item) => ({ date: String(item.date || '').slice(0, 10), name: normalizeText(item.localName || item.name || item.englishName || 'Svátek') })).filter((item) => item.date);
      }
      state.polishShopClosures = normalizePolishShopState({ ...state.polishShopClosures, onlineHolidays: nextOnline, updatedAt: new Date().toISOString(), source: 'date.nager.at + lokální pravidla nedělí', error: '' });
      touchState();
      saveState();
      render();
      showToast('Polské svátky aktualizované online');
    } catch (error) {
      state.polishShopClosures.error = 'Online aktualizace se nepovedla, zůstává vestavěný kalendář.';
      touchState();
      saveState();
      render();
      showToast('Online aktualizace se nepovedla');
    }
  }

  function renderHomecare() {
    const hdo = getHdoStatus(now);
    const tasks = [...state.homeTasks].sort((a, b) => Number(a.done) - Number(b.done));
    const waste = [...state.waste].sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')));
    const notes = [...state.notes].sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
    const devices = [...state.devices].sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
    const warranties = sortedWarranties();
    const polishShopCount = buildPolishShopCalendarYear(polishShopSelectedYear()).filter((entry) => entry.status === 'closed').length;
    const activeHomecareTab = getModuleTab('homecare', 'hdo');

    return `
      ${renderSectionTabs('homecare', [
        { id: 'hdo', label: 'HDO', icon: '💡', count: state.hdoWindows.length },
        { id: 'waste', label: 'Odpad', icon: '♻️', count: waste.length },
        { id: 'tasks', label: 'Úkoly', icon: '✅', count: tasks.filter((task) => !task.done).length },
        { id: 'warranties', label: 'Záruky', icon: '🧾', count: warranties.length },
        { id: 'polish-holidays', label: 'Svátky PL', icon: '🇵🇱', count: polishShopCount },
        { id: 'devices', label: 'Zařízení', icon: '📡', count: devices.length }
      ], 'hdo')}
      <div class="grid two module-tabbed homecare-tab-${activeHomecareTab}">
        <section class="card homecare-panel panel-hdo">
          <div class="card-header">
            <div><h2>HDO / nízký tarif</h2><p>${escapeHtml(hdo.message)}</p></div>
            <span class="badge ${hdo.active ? 'good' : 'warn'}">${hdo.active ? 'běží' : 'neběží'} · ${state.hdoWindows.some((item) => item.cloudId) ? 'cloud' : 'lokálně'}</span>
          </div>
          <details class="compact-edit-details hdo-manual-details" open>
            <summary><span>Ruční zadání časů</span><em>funguje pořád stejně</em></summary>
            <form data-form="add-hdo" class="compact-form hdo-manual-form">
              <div class="form-grid two">
                ${field('Název okna', 'label', 'text', 'např. Večerní tarif', true)}
                ${hdoTimeField('Od', 'start', '0600 nebo 06:00', true)}
                ${hdoTimeField('Do', 'end', '2200 nebo 22:00', true)}
                ${selectField('Dny', 'daysMode', [['all', 'Každý den'], ['workdays', 'Po–Pá'], ['weekend', 'Víkend']])}
              </div>
              <div class="form-actions"><button class="primary-btn" type="submit">Přidat HDO okno</button>${state.cloud?.householdId ? '<button class="ghost-btn" type="button" data-action="cloud-load-hdo">Načíst cloud HDO</button>' : ''}${state.cloud?.householdId && state.hdoWindows.some((item) => !item.cloudId) ? `<button class="ghost-btn" type="button" data-action="cloud-sync-local-hdo">Odeslat lokální HDO (${state.hdoWindows.filter((item) => !item.cloudId).length})</button>` : ''}</div>
            </form>
          </details>
          <div style="height:14px"></div>
          ${state.hdoWindows.length ? `<div class="list">${sortHdoWindowsForOverview(getSafeHdoWindows()).map((item) => `
            <div class="item">
              <div class="item-top"><div class="item-title">${escapeHtml(item.label)}</div><span class="badge ${item.enabled ? 'good' : ''}">${item.enabled ? 'aktivní' : 'vypnuto'}</span></div>
              <div class="item-meta">${escapeHtml(item.start)}–${escapeHtml(item.end)} · ${escapeHtml(daysLabel(item.days))}${item.cloudId ? ' · cloud' : ' · lokálně'}</div>
              <div class="item-actions"><button class="ghost-btn" type="button" data-action="toggle-hdo" data-id="${item.id}">${item.enabled ? 'Vypnout' : 'Zapnout'}</button>${state.cloud?.householdId && !item.cloudId ? `<button class="ghost-btn" type="button" data-action="cloud-sync-hdo" data-id="${item.id}">Odeslat</button>` : ''}<button class="danger-btn" type="button" data-action="delete-hdo" data-id="${item.id}">Smazat</button></div>
            </div>
          `).join('')}</div>` : renderEmptyCta({ icon: '💡', title: 'HDO není nastavené', text: 'Zadej časová okna nízkého tarifu a dashboard začne ukazovat aktuální stav.', nav: 'homecare', tab: 'hdo', label: 'Nastavit HDO' })}
        </section>

        <section class="card homecare-panel panel-waste">
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
          `).join('')}</div>` : renderEmptyCta({ icon: '♻️', title: 'Svoz odpadu není nastavený', text: 'Přidej první svoz a aplikace ho ukáže v přehledu Dnes a brzy.', nav: 'homecare', tab: 'waste', label: 'Přidat svoz' })}
        </section>

        <section class="card homecare-panel panel-tasks">
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
          `).join('')}</div>` : renderEmptyCta({ icon: '✅', title: 'Žádný domácí úkol', text: 'Přidej údržbu, připomínku nebo běžnou domácí poznámku.', nav: 'homecare', tab: 'tasks', label: 'Přidat úkol' })}
          <form data-form="add-note" style="margin-top:14px;">
            <div class="form-grid">
              ${field('Rychlá poznámka', 'text', 'text', 'např. zavolat servis', true)}
            </div>
            <div class="form-actions"><button class="ghost-btn" type="submit">Přidat poznámku</button>${state.cloud?.householdId ? '<button class="ghost-btn" type="button" data-action="cloud-load-extras">Načíst cloud poznámky</button>' : ''}${state.cloud?.householdId && notes.some((item) => !item.cloudId) ? `<button class="ghost-btn" type="button" data-action="cloud-sync-local-extras">Odeslat lokální poznámky (${notes.filter((item) => !item.cloudId).length})</button>` : ''}</div>
          </form>
          ${notes.length ? `<div class="list" style="margin-top:12px;">${notes.slice(0, 6).map((note) => `
            <div class="item"><div class="item-top"><div class="item-title">${escapeHtml(note.text)}</div><span class="badge ${note.cloudId ? 'good' : ''}">${note.cloudId ? 'cloud' : 'lokálně'}</span></div><div class="item-actions"><button class="danger-btn" type="button" data-action="delete" data-collection="notes" data-id="${note.id}">Smazat</button></div></div>
          `).join('')}</div>` : ''}
        </section>

        ${renderWarrantiesPanel(warranties)}

        ${renderPolishHolidaysPanel()}

        <section class="card homecare-panel panel-devices">
          <div class="card-header"><div><h2>Domácí zařízení / síť</h2><p>Routery, NAS, kamery, tablety a další věci doma. V online domácnosti jsou sdílené.</p></div><span class="badge ${devices.some((item) => item.cloudId) ? 'good' : ''}">${devices.some((item) => item.cloudId) ? 'cloud' : 'lokálně'}</span></div>
          <form data-form="add-device">
            <div class="form-grid two">
              ${field('Název', 'name', 'text', 'WD My Cloud / router / kamera', true)}
              ${field('Typ', 'type', 'text', 'síť / TV / kamera')}
              ${field('IP / adresa', 'address', 'text', '192.168.1.10')}
              ${field('Poznámka', 'note', 'text', 'volitelné')}
            </div>
            <div class="form-actions"><button class="primary-btn" type="submit">Přidat zařízení</button>${state.cloud?.householdId ? '<button class="ghost-btn" type="button" data-action="cloud-load-extras">Načíst cloud zařízení</button>' : ''}${state.cloud?.householdId && devices.some((item) => !item.cloudId) ? `<button class="ghost-btn" type="button" data-action="cloud-sync-local-extras">Odeslat lokální zařízení (${devices.filter((item) => !item.cloudId).length})</button>` : ''}</div>
          </form>
          <div style="height:14px"></div>
          ${devices.length ? `<div class="list">${devices.map((device) => `
            <div class="item">
              <div class="item-top"><div class="item-title">${escapeHtml(device.name)}</div><span class="badge">${escapeHtml(device.type || 'zařízení')}</span></div>
              <div class="item-meta">${escapeHtml(device.address || 'bez adresy')}${device.note ? ` · ${escapeHtml(device.note)}` : ''}${device.cloudId ? ' · cloud' : ' · lokálně'}</div>
              <div class="item-actions"><button class="danger-btn" type="button" data-action="delete" data-collection="devices" data-id="${device.id}">Smazat</button></div>
            </div>
          `).join('')}</div>` : renderEmptyCta({ icon: '🔌', title: 'Zařízení jsou prázdná', text: 'Přidej router, kotel, spotřebič nebo jiné domácí zařízení.', nav: 'homecare', tab: 'devices', label: 'Přidat zařízení' })}
        </section>
      </div>
    `;
  }

  function normalizeVehicleIconColor(value, fallback = 'blue') {
    const key = normalizeKey(value || '');
    return VEHICLE_ICON_COLORS.some(([id]) => id === key) ? key : fallback;
  }

  function normalizeVehicleIconColorMap(map = {}) {
    if (!map || typeof map !== 'object' || Array.isArray(map)) return {};
    return Object.fromEntries(Object.entries(map)
      .map(([key, value]) => [String(key || '').trim(), normalizeVehicleIconColor(value, '')])
      .filter(([key, value]) => key && value));
  }

  function vehicleIconColorOptions() {
    return VEHICLE_ICON_COLORS.map(([id, label]) => [id, label]);
  }

  function vehicleIconColorClass(value) {
    return `vehicle-icon-color-${normalizeVehicleIconColor(value)}`;
  }

  function vehicleIconColorFromSettings(vehicle = {}) {
    const map = normalizeVehicleIconColorMap(state.settings?.vehicleIconColors);
    const keys = [vehicle.cloudId, vehicle.id, normalizeKey(vehicle.name)].filter(Boolean);
    for (const key of keys) {
      if (map[key]) return map[key];
    }
    return 'blue';
  }

  function rememberVehicleIconColor(vehicle) {
    if (!vehicle) return;
    const color = normalizeVehicleIconColor(vehicle.iconColor);
    vehicle.iconColor = color;
    state.settings.vehicleIconColors = normalizeVehicleIconColorMap(state.settings?.vehicleIconColors);
    [vehicle.cloudId, vehicle.id, normalizeKey(vehicle.name)].filter(Boolean).forEach((key) => {
      state.settings.vehicleIconColors[key] = color;
    });
  }

  function refreshVehicleIconColorSettings() {
    state.settings.vehicleIconColors = normalizeVehicleIconColorMap(state.settings?.vehicleIconColors);
    (state.vehicles || []).forEach((vehicle) => rememberVehicleIconColor(vehicle));
  }

  function garageNumberKey(value, decimals = 2) {
    const normalized = parseCzNumber(value);
    if (!Number.isFinite(normalized)) return '';
    return Number(normalized).toFixed(decimals);
  }

  function garageVehicleDedupeKey(vehicle = {}) {
    const plate = normalizeKey(vehicle.plate || vehicle.plateNumber || '');
    if (plate) return `plate:${plate}`;
    const name = normalizeKey(vehicle.name || vehicle.title || vehicle.model || '');
    const fuelType = normalizeKey(vehicle.fuelType || '');
    return name ? `name:${name}|fuel:${fuelType}` : '';
  }

  function garageRecordVehicleKey(vehicleId, vehicleMap = new Map()) {
    const vehicle = vehicleMap.get(vehicleId) || null;
    return vehicle ? (vehicle.cloudId ? `cloud:${vehicle.cloudId}` : garageVehicleDedupeKey(vehicle) || `local:${vehicle.id}`) : `vehicle:${normalizeKey(vehicleId)}`;
  }

  function garageFuelDedupeKey(item = {}, vehicleMap = new Map()) {
    return [
      'fuel',
      garageRecordVehicleKey(item.vehicleId, vehicleMap),
      normalizeText(item.date),
      garageNumberKey(item.odometer, 0),
      garageNumberKey(item.liters, 3),
      garageNumberKey(item.price, 2)
    ].join('|');
  }

  function garageServiceDedupeKey(item = {}, vehicleMap = new Map()) {
    return [
      'service',
      garageRecordVehicleKey(item.vehicleId, vehicleMap),
      normalizeText(item.date),
      garageNumberKey(item.odometer, 0),
      normalizeKey(item.title || item.category || 'Servis'),
      garageNumberKey(item.price, 2),
      normalizeKey(item.note || '')
    ].join('|');
  }

  function preferGarageCloudRecord(current = {}, candidate = {}) {
    if (candidate.cloudId && !current.cloudId) return candidate;
    if (!candidate.cloudId && current.cloudId) return current;
    const candidateUpdated = Date.parse(candidate.updatedAt || candidate.createdAt || '') || 0;
    const currentUpdated = Date.parse(current.updatedAt || current.createdAt || '') || 0;
    return candidateUpdated >= currentUpdated ? { ...current, ...candidate, id: current.id || candidate.id } : current;
  }

  function dedupeGarageVehicles(vehicles = []) {
    const map = new Map();
    const idRemap = new Map();
    const unique = [];
    for (const vehicle of vehicles) {
      const key = garageVehicleDedupeKey(vehicle) || `id:${vehicle.id}`;
      if (!map.has(key)) {
        map.set(key, vehicle);
        unique.push(vehicle);
        continue;
      }
      const existing = map.get(key);
      const preferred = preferGarageCloudRecord(existing, vehicle);
      const dropped = preferred === existing ? vehicle : existing;
      if (dropped?.id && preferred?.id && dropped.id !== preferred.id) idRemap.set(dropped.id, preferred.id);
      if (preferred !== existing) {
        const index = unique.indexOf(existing);
        if (index >= 0) unique[index] = preferred;
        map.set(key, preferred);
      }
    }
    return { items: unique, idRemap };
  }

  function dedupeGarageRecords(records = [], keyFn, vehicleMap = new Map()) {
    const map = new Map();
    const unique = [];
    for (const record of records) {
      const key = keyFn(record, vehicleMap);
      if (!key || key.includes('|||')) {
        unique.push(record);
        continue;
      }
      if (!map.has(key)) {
        map.set(key, record);
        unique.push(record);
        continue;
      }
      const existing = map.get(key);
      const preferred = preferGarageCloudRecord(existing, record);
      if (preferred !== existing) {
        const index = unique.indexOf(existing);
        if (index >= 0) unique[index] = preferred;
        map.set(key, preferred);
      }
    }
    return unique;
  }

  function normalizeGarageRuntimeState() {
    const beforeSignature = JSON.stringify({ vehicles: state.vehicles, fuel: state.fuel, services: state.services, active: garageVehicleId });
    state.vehicles = Array.isArray(state.vehicles) ? state.vehicles.filter((item) => item && typeof item === 'object') : [];
    state.fuel = Array.isArray(state.fuel) ? state.fuel.filter((item) => item && typeof item === 'object') : [];
    state.services = Array.isArray(state.services) ? state.services.filter((item) => item && typeof item === 'object') : [];
    state.settings = state.settings && typeof state.settings === 'object' ? state.settings : { ...DEFAULT_STATE.settings };
    state.settings.vehicleIconColors = normalizeVehicleIconColorMap(state.settings.vehicleIconColors);
    state.vehicles = state.vehicles.map((vehicle, index) => {
      const id = normalizeText(vehicle.id) || `vehicle-${index + 1}-${uid()}`;
      const normalized = {
        technicalInspectionUntil: '',
        insuranceUntil: '',
        nextServiceKm: '',
        nextServiceDate: '',
        note: '',
        ...vehicle,
        id,
        name: normalizeText(vehicle.name || vehicle.title || vehicle.model || `Auto ${index + 1}`),
        iconColor: normalizeVehicleIconColor(vehicle.iconColor || vehicle.color || state.settings.vehicleIconColors[id] || state.settings.vehicleIconColors[normalizeKey(vehicle.name)] || 'blue')
      };
      rememberVehicleIconColor(normalized);
      return normalized;
    });
    const dedupedVehicles = dedupeGarageVehicles(state.vehicles);
    state.vehicles = dedupedVehicles.items;
    if (dedupedVehicles.idRemap.has(garageVehicleId)) garageVehicleId = dedupedVehicles.idRemap.get(garageVehicleId);
    const validVehicleIds = new Set(state.vehicles.map((vehicle) => vehicle.id));
    const fallbackVehicleId = state.vehicles[0]?.id || '';
    state.fuel = state.fuel.map((item, index) => {
      const remappedVehicleId = dedupedVehicles.idRemap.get(item.vehicleId) || item.vehicleId;
      return { ...item, id: normalizeText(item.id) || `fuel-${index + 1}-${uid()}`, vehicleId: validVehicleIds.has(remappedVehicleId) ? remappedVehicleId : fallbackVehicleId };
    }).filter((item) => item.vehicleId);
    state.services = state.services.map((item, index) => {
      const remappedVehicleId = dedupedVehicles.idRemap.get(item.vehicleId) || item.vehicleId;
      return { ...item, id: normalizeText(item.id) || `service-${index + 1}-${uid()}`, vehicleId: validVehicleIds.has(remappedVehicleId) ? remappedVehicleId : fallbackVehicleId, title: normalizeText(item.title || item.category || item.note || 'Servis / náklad') };
    }).filter((item) => item.vehicleId);
    const vehicleMap = new Map(state.vehicles.map((vehicle) => [vehicle.id, vehicle]));
    state.fuel = dedupeGarageRecords(state.fuel, garageFuelDedupeKey, vehicleMap);
    state.services = dedupeGarageRecords(state.services, garageServiceDedupeKey, vehicleMap);
    if (!validVehicleIds.has(garageVehicleId)) garageVehicleId = fallbackVehicleId;
    const afterSignature = JSON.stringify({ vehicles: state.vehicles, fuel: state.fuel, services: state.services, active: garageVehicleId });
    if (beforeSignature !== afterSignature && !isDemoMode()) {
      state.meta = { ...(state.meta || {}), updatedAt: new Date().toISOString() };
      saveState();
    }
  }

  function renderGarage() {
    normalizeGarageRuntimeState();
    const vehicles = state.vehicles;
    if (!garageVehicleId && vehicles.length) garageVehicleId = vehicles[0].id;
    let activeVehicle = vehicles.find((vehicle) => vehicle.id === garageVehicleId) || null;
    if (!activeVehicle && vehicles.length) {
      garageVehicleId = vehicles[0].id;
      activeVehicle = vehicles[0];
    }
    const fuelRowsAll = state.fuel || [];
    const serviceRowsAll = state.services || [];
    const alerts = getVehicleAlerts();
    const activeGarageTab = getModuleTab('garage', 'overview');

    return `
      ${renderSectionTabs('garage', [
        { id: 'overview', label: 'Přehled', icon: '🚗', count: vehicles.length },
        { id: 'detail', label: 'Detail', icon: '🔧', count: activeVehicle ? 1 : 0 },
        { id: 'add', label: 'Přidat auto', icon: '➕' },
        { id: 'import', label: 'Fuelio', icon: '📥' }
      ], 'overview')}
      <div class="grid two module-tabbed garage-tab-${activeGarageTab}" data-tab-area="garage">
        <section class="card desktop-span-2 garage-panel panel-overview garage-fuelio-panel">
          <div class="card-header"><div><h2>Garáž</h2><p>Seznam aut, termíny a rychlý stav bez dlouhého scrollování.</p></div><span class="badge ${state.cloud?.householdId ? 'good' : ''}">${state.cloud?.householdId ? 'cloud ready' : 'lokálně'}</span></div>
          ${state.cloud?.householdId ? `
            <div class="form-actions compact-actions">
              <button class="ghost-btn" type="button" data-action="cloud-load-garage">Načíst cloud Garáž</button>
              <button class="ghost-btn" type="button" data-action="cloud-sync-local-garage">Odeslat lokální Garáž</button>
            </div>
          ` : '<div class="inline-note compact-note">Po přihlášení se Garáž ukládá podle domácnosti. Offline data zůstávají jen jako pracovní záloha.</div>'}
          <div class="cloud-status-grid compact-cloud-stats">
            <div class="mini-stat"><span>Auta</span><strong>${vehicles.length}</strong></div>
            <div class="mini-stat"><span>Tankování</span><strong>${fuelRowsAll.length}</strong></div>
            <div class="mini-stat"><span>Servisy</span><strong>${serviceRowsAll.length}</strong></div>
            <div class="mini-stat"><span>Upozornění</span><strong>${alerts.length}</strong></div>
          </div>
          ${vehicles.length ? `
            <div class="tabs-inline compact-vehicle-tabs">
              ${vehicles.map((vehicle) => `<button class="tab-pill vehicle-tab-pill ${vehicle.id === garageVehicleId ? 'active' : ''}" type="button" data-action="select-vehicle" data-id="${vehicle.id}"><span class="vehicle-color-dot ${vehicleIconColorClass(vehicle.iconColor)}" aria-hidden="true"></span>${escapeHtml(vehicle.name)}</button>`).join('')}
            </div>
            <div class="list compact-list">${vehicles.map((vehicle) => renderVehicleListItem(vehicle)).join('')}</div>
          ` : renderEmptyCta({ icon: '🚗', title: 'Garáž je prázdná', text: 'Přidej první auto, potom půjdou řešit tankování, servis, STK a pojistka.', nav: 'garage', tab: 'add', label: 'Přidat auto' })}
        </section>

        <section class="card desktop-span-2 garage-panel panel-detail garage-fuelio-panel">
          ${activeVehicle ? renderVehicleDetail(activeVehicle) : renderEmptyCta({ icon: '🚗', title: 'Nejdřív přidej auto', text: 'Detail se naplní tankováním, servisy, termíny STK a pojištěním.', nav: 'garage', tab: 'add', label: 'Přidat auto' })}
        </section>

        <section class="card garage-panel panel-add">
          <div class="card-header"><div><h2>Přidat auto</h2><p>Základ vozidla, termíny STK a pojištění. Detail se pak řeší v záložce Detail.</p></div></div>
          <form data-form="add-vehicle">
            <div class="form-grid two">
              ${field('Název auta', 'name', 'text', 'Elroq / Octavia', true)}
              ${field('SPZ', 'plate', 'text', 'volitelné')}
              ${field('Palivo', 'fuelType', 'text', 'benzín / nafta / elektro')}
              ${field('Aktuální km', 'odometer', 'number', '0')}
              ${field('STK do', 'technicalInspectionUntil', 'date', '')}
              ${field('Pojistka do', 'insuranceUntil', 'date', '')}
              ${selectField('Barva ikonky auta', 'iconColor', vehicleIconColorOptions(), 'blue')}
            </div>
            <div class="form-actions"><button class="primary-btn" type="submit">Přidat auto</button></div>
          </form>
        </section>

        <section class="card desktop-span-2 garage-panel panel-import">
          ${renderFuelioImport()}
        </section>
      </div>
    `;
  }

  function renderVehicleListItem(vehicle) {
    const fuelRows = state.fuel.filter((item) => item.vehicleId === vehicle.id);
    const serviceRows = state.services.filter((item) => item.vehicleId === vehicle.id);
    const stats = getVehicleStats(sortFuelRows(fuelRows), serviceRows);
    const costPerKm = stats.totalKm > 0 ? stats.fuelCost / stats.totalKm : null;
    return `
      <div class="item vehicle-list-item fuelio-vehicle-card ${vehicle.id === garageVehicleId ? 'selected' : ''}">
        <button class="vehicle-main-action" type="button" data-action="select-vehicle" data-id="${vehicle.id}">
          <span class="vehicle-icon-bubble ${vehicleIconColorClass(vehicle.iconColor)}" aria-hidden="true">🚗</span>
          <span class="vehicle-main-copy">
            <strong>${escapeHtml(vehicle.name)}</strong>
            <em>${escapeHtml([vehicle.brand, vehicle.model, vehicle.plate].filter(Boolean).join(' · ') || vehicle.fuelType || 'auto')}</em>
          </span>
        </button>
        <div class="fuelio-vehicle-stats">
          <span><strong>${stats.averageConsumption ? `${stats.averageConsumption.toFixed(1).replace('.', ',')}` : '—'}</strong><em>l/100</em></span>
          <span><strong>${costPerKm ? `${costPerKm.toFixed(2).replace('.', ',')}` : '—'}</strong><em>Kč/km palivo</em></span>
          <span><strong>${fuelRows.length + serviceRows.length}</strong><em>záznamů</em></span>
        </div>
        <div class="item-actions vehicle-card-actions">
          <button class="ghost-btn icon-action-btn" type="button" data-action="select-vehicle" data-id="${vehicle.id}" data-garage-target="vehicle-settings" title="Nastavení auta" aria-label="Nastavení auta ${escapeHtml(vehicle.name)}">⚙️</button>
          <button class="primary-btn icon-action-btn fuel-add-shortcut" type="button" data-action="select-vehicle" data-id="${vehicle.id}" data-garage-target="add-fuel" title="Přidat tankování" aria-label="Přidat tankování ${escapeHtml(vehicle.name)}">⛽+</button>
          <button class="ghost-btn icon-action-btn" type="button" data-action="select-vehicle" data-id="${vehicle.id}" data-garage-target="add-service" title="Přidat servis" aria-label="Přidat servis ${escapeHtml(vehicle.name)}">🧾+</button>
        </div>
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



  function garageCountLabel(count) {
    const value = Number(count || 0);
    if (value === 1) return 'auto v garáži';
    if (value >= 2 && value <= 4) return 'auta v garáži';
    return 'aut v garáži';
  }

  function garageHistoryYear(item) {
    const year = Number(String(item?.date || '').slice(0, 4));
    return Number.isFinite(year) && year > 1900 ? String(year) : '';
  }

  function garageHistoryTypeLabel(type) {
    if (type === 'fuel') return 'tankování';
    if (type === 'service') return 'servis / náklad';
    return 'vše';
  }

  function garageHistoryRecords(fuelRows, serviceRows) {
    const fuel = fuelRows.map((item) => ({ kind: 'fuel', date: item.date || '', odometer: Number(item.odometer || 0), item }));
    const services = serviceRows.map((item) => ({ kind: 'service', date: item.date || '', odometer: Number(item.odometer || 0), item }));
    return [...fuel, ...services].sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')) || Number(b.odometer || 0) - Number(a.odometer || 0));
  }

  function garageHistoryYears(records) {
    return [...new Set(records.map((record) => garageHistoryYear(record.item)).filter(Boolean))].sort((a, b) => Number(b) - Number(a));
  }

  function renderGarageHistoryFilters(records, visibleRecords) {
    const years = garageHistoryYears(records);
    const selectedYear = years.includes(String(garageHistoryYearFilter)) ? String(garageHistoryYearFilter) : 'all';
    const selectedType = ['all', 'fuel', 'service'].includes(garageHistoryTypeFilter) ? garageHistoryTypeFilter : 'all';
    const fuelCount = records.filter((record) => record.kind === 'fuel').length;
    const serviceCount = records.filter((record) => record.kind === 'service').length;
    return `
      <div class="garage-history-toolbar">
        <label class="compact-select-field">
          <span>Rok</span>
          <select class="select" data-garage-history-filter="year" aria-label="Filtrovat historii auta podle roku">
            <option value="all" ${selectedYear === 'all' ? 'selected' : ''}>Všechny roky</option>
            ${years.map((year) => `<option value="${escapeHtml(year)}" ${selectedYear === year ? 'selected' : ''}>${escapeHtml(year)}</option>`).join('')}
          </select>
        </label>
        <label class="compact-select-field">
          <span>Typ</span>
          <select class="select" data-garage-history-filter="type" aria-label="Filtrovat historii auta podle typu záznamu">
            <option value="all" ${selectedType === 'all' ? 'selected' : ''}>Vše</option>
            <option value="fuel" ${selectedType === 'fuel' ? 'selected' : ''}>Tankování (${fuelCount})</option>
            <option value="service" ${selectedType === 'service' ? 'selected' : ''}>Servis / náklady (${serviceCount})</option>
          </select>
        </label>
        <div class="garage-history-count"><strong>${visibleRecords.length}</strong><span>z ${records.length} záznamů</span></div>
      </div>
    `;
  }

  function filterGarageHistoryRecords(records) {
    const years = garageHistoryYears(records);
    const selectedYear = years.includes(String(garageHistoryYearFilter)) ? String(garageHistoryYearFilter) : 'all';
    const selectedType = ['all', 'fuel', 'service'].includes(garageHistoryTypeFilter) ? garageHistoryTypeFilter : 'all';
    return records.filter((record) => {
      const yearOk = selectedYear === 'all' || garageHistoryYear(record.item) === selectedYear;
      const typeOk = selectedType === 'all' || record.kind === selectedType;
      return yearOk && typeOk;
    });
  }

  function renderGarageHistoryItem(record) {
    return record.kind === 'fuel' ? renderFuelListItem(record.item) : renderServiceListItem(record.item);
  }

  function renderGarageHistory(vehicle, fuelRows, serviceRows) {
    const records = garageHistoryRecords(fuelRows, serviceRows);
    const visibleRecords = filterGarageHistoryRecords(records);
    const selectedYear = garageHistoryYears(records).includes(String(garageHistoryYearFilter)) ? String(garageHistoryYearFilter) : 'all';
    const selectedType = ['all', 'fuel', 'service'].includes(garageHistoryTypeFilter) ? garageHistoryTypeFilter : 'all';
    const filterText = `${selectedYear === 'all' ? 'všechny roky' : selectedYear} · ${garageHistoryTypeLabel(selectedType)}`;
    return `
      <section class="garage-history-panel">
        <div class="card-header small"><div><h3>Historie auta</h3><p>${records.length} záznamů celkem · ${escapeHtml(filterText)}</p></div></div>
        ${renderGarageHistoryFilters(records, visibleRecords)}
        ${visibleRecords.length ? `<div class="list compact-list garage-history-list">${visibleRecords.map(renderGarageHistoryItem).join('')}</div>` : renderEmpty(`Pro filtr ${filterText} tu není žádný záznam.`)}
      </section>
    `;
  }

  function renderFuelListItem(item) {
    return `
      <div class="item garage-history-row fuelio-record-row">
        <div class="item-top">
          <div class="item-title">⛽ ${formatDate(item.date)}</div>
          <span class="badge ${item.cloudId ? 'good' : ''}">${item.cloudId ? 'cloud' : 'lokálně'} · ${escapeHtml(item.odometer || '—')} km</span>
        </div>
        <div class="item-meta">${escapeHtml(item.liters || 0)} l · ${formatCurrency(item.price)}${fuelPricePerLiter(item) ? ` · ${escapeHtml(formatFuelPricePerLiter(fuelPricePerLiter(item)))}` : ''}${item.note ? ` · ${escapeHtml(item.note)}` : ''}</div>
        <div class="item-actions">
          <button class="ghost-btn" type="button" data-action="edit-garage-record" data-collection="fuel" data-id="${item.id}">Upravit</button>
          <button class="danger-btn" type="button" data-action="delete" data-collection="fuel" data-id="${item.id}">Smazat</button>
        </div>
      </div>
    `;
  }

  function renderServiceListItem(item) {
    return `
      <div class="item garage-history-row fuelio-record-row">
        <div class="item-top">
          <div class="item-title">🧾 ${escapeHtml(item.title)}</div>
          <span class="badge ${item.cloudId ? 'good' : ''}">${item.cloudId ? 'cloud' : 'lokálně'} · ${formatDate(item.date)}</span>
        </div>
        <div class="item-meta">${formatCurrency(item.price)}${item.odometer ? ` · ${escapeHtml(item.odometer)} km` : ''}${item.note ? ` · ${escapeHtml(item.note)}` : ''}</div>
        <div class="item-actions">
          <button class="ghost-btn" type="button" data-action="edit-garage-record" data-collection="services" data-id="${item.id}">Upravit</button>
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
            <div class="fuel-cost-row">
              ${fuelNumberField('Litry', 'liters', 'např. 42,5', item.liters || '')}
              ${fuelNumberField('Cena za litr', 'pricePerLiter', 'např. 38,90', item.pricePerLiter || fuelPricePerLiter(item))}
            </div>
            ${fuelNumberField('Cena celkem', 'price', 'např. 1600', item.price || '')}
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
    const costPerKm = stats.totalKm > 0 ? stats.fuelCost / stats.totalKm : null;
    const totalCost = stats.fuelCost + stats.serviceCost;
    return `
      <div class="card-header compact-detail-head vehicle-detail-head">
        <div class="vehicle-detail-title"><span class="vehicle-icon-bubble vehicle-icon-bubble-large ${vehicleIconColorClass(vehicle.iconColor)}" aria-hidden="true">🚗</span><div><h2>${escapeHtml(vehicle.name)}</h2><p>${escapeHtml(vehicle.plate || 'Bez SPZ')} · ${escapeHtml(vehicle.fuelType || 'palivo neuvedeno')}</p></div></div>
        <div class="vehicle-detail-head-actions">
          <button class="ghost-btn icon-action-btn" type="button" data-action="open-garage-detail" data-garage-target="vehicle-settings" title="Nastavení auta" aria-label="Nastavení auta">⚙️</button>
          <button class="primary-btn icon-action-btn fuel-add-shortcut" type="button" data-action="open-garage-detail" data-garage-target="add-fuel" title="Přidat tankování" aria-label="Přidat tankování">⛽+</button>
          <button class="ghost-btn icon-action-btn" type="button" data-action="open-garage-detail" data-garage-target="add-service" title="Přidat servis / náklad" aria-label="Přidat servis nebo náklad">🧾+</button>
          <span class="badge ${vehicle.cloudId ? 'good' : ''}">${vehicle.cloudId ? 'cloud' : 'lokálně'} · ${escapeHtml(vehicle.odometer || latestFuel?.odometer || 0)} km</span>
        </div>
      </div>
      <div class="kpi-row compact">
        <div class="kpi"><strong>${stats.averageConsumption ? `${stats.averageConsumption.toFixed(2).replace('.', ',')}` : '—'}</strong><span>l/100 km</span></div>
        <div class="kpi"><strong>${formatCurrency(stats.thisYearCost)}</strong><span>náklady letos</span></div>
        <div class="kpi"><strong>${formatCurrency(totalCost)}</strong><span>celkem</span></div>
        <div class="kpi"><strong>${costPerKm ? `${costPerKm.toFixed(2).replace('.', ',')} Kč` : '—'}</strong><span>palivo / km</span></div>
      </div>
      <div class="garage-status-grid compact-status-grid">
        ${renderDueCard('STK', stk, 'Datum STK zatím není nastavené.')}
        ${renderDueCard('Pojistka', insurance, 'Datum konce pojistky zatím není nastavené.')}
        ${renderDueCard('Servis', serviceStatus, 'Servisní interval zatím není nastavený.')}
      </div>
      <div class="grid two detail-summary-grid">
        <div class="detail-stack compact-detail-stack">
          <div class="stat-line"><span>Poslední tankování</span><strong>${latestFuel ? `${formatDate(latestFuel.date)} · ${escapeHtml(latestFuel.odometer || '—')} km` : '—'}</strong></div>
          <div class="stat-line"><span>Poslední servis</span><strong>${latestService ? `${formatDate(latestService.date)} · ${escapeHtml(latestService.title || 'servis')}` : '—'}</strong></div>
          <div class="stat-line"><span>Záznamy</span><strong>${fuelRows.length} tankování · ${serviceRows.length} servisů</strong></div>
          ${vehicle.note ? `<div class="inline-note compact-note">${escapeHtml(vehicle.note)}</div>` : ''}
        </div>
        <div class="compact-chart-box">${renderMiniChart(fuelRows)}</div>
      </div>
      ${renderGarageHistory(vehicle, fuelRows, serviceRows)}
      <details class="action-details compact-edit-details" data-garage-detail="vehicle-settings">
        <summary><span>Upravit údaje auta</span><em>termíny, km, servisní intervaly</em></summary>
        <form data-form="update-vehicle" data-vehicle-id="${vehicle.id}" class="compact-form">
          <div class="form-grid two">
            ${field('Název auta', 'name', 'text', 'Elroq / Octavia', true, vehicle.name)}
            ${field('SPZ', 'plate', 'text', 'volitelné', false, vehicle.plate || '')}
            ${field('Palivo', 'fuelType', 'text', 'benzín / nafta / elektro', false, vehicle.fuelType || '')}
            ${field('Aktuální km', 'odometer', 'number', '0', false, vehicle.odometer || latestFuel?.odometer || '')}
            ${field('STK do', 'technicalInspectionUntil', 'date', '', false, vehicle.technicalInspectionUntil || '')}
            ${field('Pojistka do', 'insuranceUntil', 'date', '', false, vehicle.insuranceUntil || '')}
            ${field('Další servis při km', 'nextServiceKm', 'number', 'např. 150000', false, vehicle.nextServiceKm || '')}
            ${field('Další servis do data', 'nextServiceDate', 'date', '', false, vehicle.nextServiceDate || '')}
            ${selectField('Barva ikonky auta', 'iconColor', vehicleIconColorOptions(), normalizeVehicleIconColor(vehicle.iconColor))}
            ${field('Poznámka', 'note', 'text', 'pneu, rozměr, VIN...', false, vehicle.note || '')}
          </div>
          <div class="form-actions"><button class="ghost-btn" type="submit">Uložit údaje auta</button><button class="ghost-btn" type="button" data-action="cloud-sync-vehicle" data-id="${vehicle.id}">Odeslat auto do cloudu</button></div>
        </form>
      </details>
      <details class="action-details compact-edit-details danger-zone-details">
        <summary><span>Smazat auto</span><em>a všechny jeho záznamy</em></summary>
        <div class="inline-note warn-note">Smaže se auto, tankování i servisní náklady. Akce bude ještě vyžadovat potvrzení.</div>
        <div class="form-actions"><button class="danger-btn" type="button" data-action="delete-vehicle" data-id="${vehicle.id}">Smazat auto</button></div>
      </details>
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
    const cloudCount = contracts.filter((contract) => contract.cloudId).length;
    const localCount = contracts.length - cloudCount;
    const warningCount = contracts.filter((contract) => {
      const left = daysUntil(contract.validTo);
      return left !== null && left <= 45;
    }).length;
    const activeContractsTab = getModuleTab('contracts', 'overview');
    return `
      ${renderSectionTabs('contracts', [
        { id: 'overview', label: 'Přehled', icon: '📄', count: contracts.length },
        { id: 'detail', label: 'Detail', icon: '📎', count: activeContract ? contractFileCount(activeContract.id) : 0 },
        { id: 'add', label: 'Přidat', icon: '➕' }
      ], 'overview')}
      <div class="grid two module-tabbed contracts-tab-${activeContractsTab}" data-tab-area="contracts">
        <section class="card desktop-span-2 contracts-panel panel-overview">
          <div class="card-header"><div><h2>Smlouvy a pojistky</h2><p>Nejdřív přehled a blížící se termíny. Detail a přílohy jsou oddělené v záložce, aby se modul na mobilu netáhl.</p></div></div>
          <div class="cloud-status-grid compact-cloud-stats">
            <div class="mini-stat"><span>Smlouvy</span><strong>${contracts.length}</strong></div>
            <div class="mini-stat"><span>Upozornění</span><strong>${warningCount}</strong></div>
            <div class="mini-stat"><span>Cloud</span><strong>${cloudCount}</strong></div>
            <div class="mini-stat"><span>Lokálně</span><strong>${localCount}</strong></div>
          </div>
          ${contracts.length ? `<div class="list compact-list">${contracts.map(renderContractItem).join('')}</div>` : renderEmptyCta({ icon: '📄', title: 'Smlouvy jsou prázdné', text: 'Přidej pojistku, tarif nebo smlouvu a aplikace začne hlídat platnost.', nav: 'contracts', tab: 'add', label: 'Přidat smlouvu' })}
        </section>

        <section class="card desktop-span-2 contracts-panel panel-detail">
          ${activeContract ? renderContractDetail(activeContract) : renderEmptyCta({ icon: '📎', title: 'Detail smlouvy zatím není', text: 'Vyber existující smlouvu, nebo přidej první a potom k ní nahraj přílohy.', nav: 'contracts', tab: 'add', label: 'Přidat smlouvu' })}
        </section>

        <section class="card contracts-panel panel-add">
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
          <div class="inline-note">Základ smlouvy může být v cloudu podle domácnosti. PDF a fotky dokumentů se zatím ukládají jen v tomto prohlížeči. JSON export zatím obsahuje metadata, ne samotné soubory.</div>
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
    const cloudFiles = files.filter((file) => file.cloudId).length;
    const localFiles = files.length - cloudFiles;
    return `
      <div class="card-header compact-detail-head">
        <div><h2>${escapeHtml(contract.name)}</h2><p>${escapeHtml(contract.provider || 'Bez poskytovatele')} · ${escapeHtml(contractTypeLabel(contract.type))}</p></div>
        <span class="badge ${left !== null && left <= 45 ? (left < 0 ? 'bad' : 'warn') : 'good'}">${escapeHtml(statusText)}</span>
      </div>
      <div class="grid two detail-summary-grid">
        <div class="detail-stack compact-detail-stack">
          <div class="stat-line"><span>Číslo smlouvy</span><strong>${escapeHtml(contract.number || '—')}</strong></div>
          <div class="stat-line"><span>Platnost</span><strong>${contract.validFrom ? formatDate(contract.validFrom) : '—'} → ${contract.validTo ? formatDate(contract.validTo) : '—'}</strong></div>
          <div class="stat-line"><span>Platba</span><strong>${formatCurrency(contract.amount)} / ${frequencyLabel(contract.frequency)}</strong></div>
          <div class="stat-line"><span>Přílohy</span><strong>${files.length} celkem · ${cloudFiles} cloud · ${localFiles} lokálně</strong></div>
          ${contract.note ? `<div class="inline-note compact-note">${escapeHtml(contract.note)}</div>` : ''}
        </div>
        <div class="inline-note compact-note">
          <strong>Ukládání příloh</strong><br>Online domácnost ukládá přílohy rovnou do soukromého Supabase Storage a ostatní členové je otevřou přes dočasný odkaz. IndexedDB zůstává jen jako offline fallback.
        </div>
      </div>
      <div class="card-header small compact-files-head"><div><h3>Přílohy</h3><p>${cloudFiles} cloud · ${localFiles} lokálně</p></div><div class="form-actions compact-actions">${contract.cloudId && state.cloud?.householdId ? '<button class="ghost-btn" type="button" data-action="cloud-load-contract-files">Načíst cloud přílohy</button>' : ''}${cloudReady() && localFiles ? '<button class="primary-btn" type="button" data-action="cloud-sync-local-contract-files">Odeslat lokální přílohy</button>' : ''}</div></div>
      ${files.length ? `<div class="file-list compact-file-list">${files.map((file) => `
        <div class="file-row compact-file-row">
          <div>
            <strong>${escapeHtml(file.fileName)}</strong>
            <em>${escapeHtml(file.fileType || 'soubor')} · ${formatBytes(file.size)} · ${formatDate(file.createdAt?.slice(0, 10))}${file.cloudId ? ' · cloud' : ' · lokálně'}</em>
          </div>
          <div class="item-actions compact-actions">
            <button class="ghost-btn" type="button" data-action="open-contract-file" data-id="${file.id}">Otevřít</button>
            <button class="ghost-btn" type="button" data-action="download-contract-file" data-id="${file.id}">Stáhnout</button>
            <button class="danger-btn" type="button" data-action="delete-contract-file" data-id="${file.id}">Smazat</button>
          </div>
        </div>
      `).join('')}</div>` : renderEmptyCta({ icon: '📎', title: 'Zatím žádné přílohy', text: 'Přidej PDF nebo fotku smlouvy. U online domácnosti se příloha nahraje do soukromého Supabase Storage.', nav: 'contracts', tab: 'detail', label: 'Přidat přílohu' })}
      <details class="action-details compact-edit-details">
        <summary><span>Upravit údaje smlouvy</span><em>název, platnost, částka, poznámka</em></summary>
        <form data-form="update-contract" data-contract-id="${contract.id}" class="compact-form">
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
      </details>
      <details class="action-details compact-edit-details">
        <summary><span>Přidat přílohu</span><em>PDF, fotka nebo scan dokumentu</em></summary>
        <form data-form="add-contract-file" data-contract-id="${contract.id}" class="compact-form">
          <div class="upload-box">
            <label for="contractFiles">PDF / fotka smlouvy</label>
            <input id="contractFiles" class="input" type="file" name="files" multiple accept="application/pdf,image/*,.pdf">
            <p>Na iPhonu/Androidu můžeš vybrat soubor, fotku z galerie nebo rovnou vyfotit dokument podle nabídky systému.</p>
          </div>
          <div class="form-actions"><button class="primary-btn" type="submit">Přidat přílohu</button>${cloudReady() ? '<span class="badge good">cloud upload</span>' : '<span class="badge">offline fallback</span>'}</div>
        </form>
      </details>
    `;
  }

  function contractFileCount(contractId) {
    return state.contractFiles.filter((file) => file.contractId === contractId).length;
  }

  function renderCameras() {
    const cameras = state.cameras;
    const onlineCount = cameras.filter((camera) => camera.status === 'online').length;
    const activeCamerasTab = getModuleTab('cameras', 'overview');
    return `
      ${renderSectionTabs('cameras', [
        { id: 'overview', label: 'Přehled', icon: '📷', count: cameras.length },
        { id: 'add', label: 'Přidat', icon: '➕' }
      ], 'overview')}
      <div class="grid two module-tabbed cameras-tab-${activeCamerasTab}" data-tab-area="cameras">
        <section class="card desktop-span-2 cameras-panel panel-overview">
          <div class="card-header"><div><h2>Přehled kamer</h2><p>Rychlý grid kamer. Metadata karet jsou v online domácnosti sdílená, streamy později bezpečně přes lokální síť/VPN.</p></div><span class="badge ${onlineCount ? 'good' : ''}">${onlineCount}/${cameras.length} online</span></div><div class="form-actions compact-actions">${state.cloud?.householdId ? '<button class="ghost-btn" type="button" data-action="cloud-load-extras">Načíst cloud kamery</button>' : ''}${state.cloud?.householdId && cameras.some((item) => !item.cloudId) ? `<button class="ghost-btn" type="button" data-action="cloud-sync-local-extras">Odeslat lokální kamery (${cameras.filter((item) => !item.cloudId).length})</button>` : ''}</div>
          ${cameras.length ? `<div class="grid two compact-camera-grid">${cameras.map(renderCameraCard).join('')}</div>` : renderEmptyCta({ icon: '📷', title: 'Kamery jsou prázdné', text: 'Přidej kartu kamery nebo snapshot URL. Streamy půjdou později bezpečně přes lokální síť/VPN.', nav: 'cameras', tab: 'add', label: 'Přidat kameru' })}
        </section>

        <section class="card cameras-panel panel-add">
          <div class="card-header"><div><h2>Přidat kameru</h2><p>Teď jen karta/snapshot. Streamy později lokálně přes HA/Frigate/go2rtc/VPN, ne veřejně přes cloud.</p></div></div>
          <form data-form="add-camera" class="compact-form">
            <div class="form-grid two">
              ${field('Název', 'name', 'text', 'Vchod / garáž / zahrada', true)}
              ${field('Umístění', 'location', 'text', 'venku / chodba')}
              ${field('Snapshot URL', 'snapshotUrl', 'url', 'volitelné')}
              ${selectField('Stav', 'status', [['online', 'Online'], ['offline', 'Offline'], ['unknown', 'Nevím']])}
              ${field('Poznámka', 'note', 'text', 'volitelné')}
            </div>
            <div class="form-actions"><button class="primary-btn" type="submit">Přidat kameru</button></div>
          </form>
          <div class="inline-note compact-note">Pozor na HTTPS/mixed-content: když poběží aplikace přes HTTPS a kamera jen přes HTTP, prohlížeč může náhled blokovat.</div>
        </section>
      </div>
    `;
  }

  function renderCameraCard(camera) {
    return `
      <div class="item compact-item camera-card">
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
    const activeFinanceTab = getModuleTab('finance', 'summary');
    return `
      ${renderSectionTabs('finance', [
        { id: 'summary', label: 'Přehled', icon: '💰', count: visibleItems.length },
        { id: 'accounts', label: 'Účty', icon: '🏦', count: accounts.length },
        { id: 'add', label: 'Přidat', icon: '➕' },
        { id: 'analysis', label: 'Souhrny', icon: '📊' }
      ], 'summary')}
      <div class="grid two module-tabbed finance-tab-${activeFinanceTab}" data-tab-area="finance">
        <section class="card desktop-span-2 finance-panel panel-summary">
          <div class="card-header">
            <div><h2>Finance</h2><p>Obecný přehled příjmů, výdajů, zůstatků, peněženek, spoření i peněz spravovaných pro někoho dalšího.</p></div>
            <span class="badge ${items.some((item) => item.cloudId) || accounts.some((item) => item.cloudId) ? 'good' : ''}">${items.some((item) => item.cloudId) || accounts.some((item) => item.cloudId) ? 'cloud' : 'lokálně'}</span>
          </div>
          <div class="kpi-grid compact-kpi-grid">
            <div class="kpi"><strong>${formatCurrency(summary.income)}</strong><span>Příjmy za ${escapeHtml(financeMonthLabel(selectedMonth))}</span></div>
            <div class="kpi"><strong>${formatCurrency(summary.expense)}</strong><span>Výdaje za ${escapeHtml(financeMonthLabel(selectedMonth))}</span></div>
            <div class="kpi"><strong>${formatCurrency(summary.balance)}</strong><span>Rozdíl měsíce</span></div>
            <div class="kpi"><strong>${formatCurrency(totalBalance)}</strong><span>Zůstatek účtů</span></div>
          </div>
          <form data-form="finance-month-filter" class="compact-filter-form">
            <div class="form-grid two">
              ${field('Měsíc přehledu', 'month', 'month', '', false, selectedMonth)}
              <div class="field"><label>Rychlý posun</label><div class="item-actions"><button class="ghost-btn" type="button" data-action="finance-month-prev">Předchozí</button><button class="ghost-btn" type="button" data-action="finance-month-current">Aktuální</button><button class="ghost-btn" type="button" data-action="finance-month-next">Další</button></div></div>
            </div>
            <div class="form-actions"><button class="ghost-btn" type="submit">Zobrazit měsíc</button></div>
          </form>
          ${visibleItems.length ? `<div class="list compact-list">${visibleItems.slice(0, 18).map(renderFinanceItem).join('')}</div>` : renderEmptyCta({ icon: '💰', title: 'Měsíc je bez pohybů', text: 'Přidej příjem, výdaj nebo přesun mezi účty. Přehled se začne počítat automaticky.', nav: 'finance', tab: 'add', label: 'Přidat pohyb' })}
        </section>

        <section class="card finance-panel panel-accounts">
          <div class="card-header"><div><h2>Účty / peněženky</h2><p>Každý účet má vlastní zůstatek. Může to být banka, hotovost, spoření, obálka nebo osoba.</p></div><span class="badge">${accounts.length}</span></div>
          ${accounts.length ? `<div class="list compact-list">${accounts.map((account) => renderFinanceAccount(account, balances)).join('')}</div>` : renderEmptyCta({ icon: '🏦', title: 'Nejdřív přidej účet', text: 'Účet může být banka, hotovost, spoření, obálka nebo spravované peníze pro někoho dalšího.', nav: 'finance', tab: 'accounts', label: 'Přidat účet' })}
          <details class="action-details compact-edit-details finance-form-drawer">
            <summary><span>Přidat účet / peněženku</span><em>banka, hotovost, obálka nebo osoba</em></summary>
            <form data-form="add-finance-account" class="compact-form">
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
          </details>
        </section>

        <section class="card finance-panel panel-accounts">
          <div class="card-header"><div><h2>Spravované zůstatky</h2><p>Součet účtů seskupený podle osoby/obálky.</p></div></div>
          ${managedRows.length ? `<div class="list compact-list">${managedRows.map((row) => `<div class="item compact-item"><div class="item-top"><div class="item-title">${escapeHtml(row.label)}</div><span class="badge good">${formatCurrency(row.total)}</span></div><div class="item-meta">${row.accounts.map((account) => `${financeAccountIcon(account.accountType)} ${escapeHtml(account.name)}: ${formatCurrency(balances[account.id] || 0)}`).join(' · ')}</div></div>`).join('')}</div>` : renderEmptyCta({ icon: '👥', title: 'Spravované peníze zatím nejsou', text: 'Přidej účet s vlastníkem, třeba babička / tchyně, nebo použij rychlé založení dvojice účtů.', nav: 'finance', tab: 'accounts', label: 'Přidat spravované peníze' })}
          <details class="action-details compact-edit-details finance-form-drawer">
            <summary><span>Založit spravované peníze</span><em>dvojice hlavní účet + spoření</em></summary>
            <form data-form="add-managed-finance-set" class="compact-form">
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
          </details>
        </section>

        <section class="card finance-panel panel-add">
          <div class="card-header"><div><h2>Přidat pohyb</h2><p>Příjem, výdaj nebo přesun mezi účty. Přesun je vhodný pro peníze bokem na spoření.</p></div></div>
          <div class="quick-add-panel">
            <div class="quick-add-head"><strong>Rychlé šablony</strong><span>Vyplní formulář, částku jen doplníš.</span></div>
            <div class="quick-chip-row">
              <button class="quick-chip" type="button" data-action="finance-template" data-template="salary">💼 <span>Výplata</span></button>
              <button class="quick-chip" type="button" data-action="finance-template" data-template="rent">🏠 <span>Nájem</span></button>
              <button class="quick-chip" type="button" data-action="finance-template" data-template="energy">⚡ <span>Energie</span></button>
              <button class="quick-chip" type="button" data-action="finance-template" data-template="cash">💵 <span>Výběr</span></button>
              <button class="quick-chip" type="button" data-action="finance-template" data-template="savings">🏦 <span>Na spoření</span></button>
            </div>
          </div>
          <form data-form="add-finance" class="compact-form spaced-form">
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
          <div class="inline-note">Pro spravované peníze můžeš mít účty třeba „Babička – u mě“ a „Babička – spoření“. Přesuny pak nepočítají jako výdaj domácnosti, ale jako pohyb mezi účty.</div>
        </section>

        <section class="card finance-panel panel-analysis">
          <div class="card-header"><div><h2>Souhrn podle kategorií</h2><p>${escapeHtml(financeMonthLabel(selectedMonth))}</p></div></div>
          ${categoryRows.length ? `<div class="list compact-list">${categoryRows.map((row) => `<div class="item compact-item"><div class="item-top"><div class="item-title">${escapeHtml(row.label)}</div><span class="badge ${row.type === 'income' ? 'good' : ''}">${formatCurrency(row.amount)}</span></div><div class="item-meta">${row.type === 'income' ? 'příjmy' : 'výdaje'} · ${row.count}×</div></div>`).join('')}</div>` : renderEmpty('V tomhle měsíci zatím nejsou žádné kategorie.')}
        </section>

        <section class="card finance-panel panel-analysis">
          <div class="card-header"><div><h2>Souhrn podle účtů</h2><p>${escapeHtml(financeMonthLabel(selectedMonth))}</p></div></div>
          ${accountRows.length ? `<div class="list compact-list">${accountRows.map((row) => `<div class="item compact-item"><div class="item-top"><div class="item-title">${escapeHtml(row.label)}</div><span class="badge">${formatCurrency(row.net)}</span></div><div class="item-meta">Příjmy ${formatCurrency(row.income)} · výdaje ${formatCurrency(row.expense)} · přesuny ${formatCurrency(row.transferIn - row.transferOut)}</div></div>`).join('')}</div>` : renderEmpty('V tomhle měsíci zatím nejsou žádné pohyby na účtech.')}
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
      <div class="grid two more-hub-grid">
        <section class="card desktop-span-2 more-settings-priority">
          <div class="card-header"><div><h2>Nastavení</h2><p>Domácnost, profily, zapnuté moduly, Home panel, cloud a export/import.</p></div><span class="badge">nahoře</span></div>
          <button class="item module-hub-item" type="button" data-nav="settings">
            <div class="item-top"><div class="item-title">⚙️ Nastavení aplikace</div><span class="badge">otevřít</span></div>
            <div class="item-meta">Tady upravíš domácnost, profily, zapnuté moduly i rozložení Home bez scrollování dolů.</div>
          </button>
        </section>

        <section class="card desktop-span-2">
          <div class="card-header">
            <div><h2>Další moduly</h2><p>Spodní lišta drží jen věci, které si zvolíš v Nastavení. Všechno ostatní je tady.</p></div>
            <span class="badge">Více je napevno</span>
          </div>
          <div class="grid four">
            ${secondaryModules.length ? secondaryModules.map(renderModuleStatusCard).join('') : '<div class="empty">Všechny zapnuté moduly už máš připnuté dole.</div>'}
          </div>
        </section>

        <section class="card desktop-span-2">
          <div class="card-header"><div><h2>Rychlý přístup</h2><p>Moduly, které máš aktuálně připnuté ve spodní liště.</p></div></div>
          <div class="grid four">
            ${primaryModules.map(renderModuleStatusCard).join('')}
          </div>
        </section>
      </div>
    `;
  }

  function renderSettings() {
    const enabled = new Set(normalizeModuleList(state.enabledModules));
    const settingsTabIds = ['household', 'modules', 'dashboard', 'cloud', 'data'];
    const activeSettingsTab = settingsTabIds.includes(getModuleTab('settings', 'household')) ? getModuleTab('settings', 'household') : 'household';
    return `
      ${renderSectionTabs('settings', [
        { id: 'household', label: 'Domácnost', icon: '🏠', count: state.profiles.length },
        { id: 'modules', label: 'Moduly', icon: '🧩', count: normalizeModuleList(state.enabledModules).length },
        { id: 'dashboard', label: 'Home', icon: '🧱', count: normalizeHomeHeroIds(state.settings?.homeHeroItems).length },
        { id: 'cloud', label: 'Cloud / PWA', icon: '☁️', count: state.cloud?.userId ? 1 : 0 },
        { id: 'data', label: 'Data', icon: '🛟' }
      ], 'household')}
      <div class="settings-tabbed settings-tab-${activeSettingsTab}" data-tab-area="settings">
        <div class="settings-panel panel-household grid two">
          <section class="card compact-settings-card">
            <div class="card-header"><div><h2>Domácnost</h2><p>Základ rodinného účtu a vzhled celé aplikace.</p></div><span class="badge">${escapeHtml(state.household.id)}</span></div>
            <form data-form="household-settings" class="compact-form">
              <div class="form-grid two">
                ${field('Název domácnosti', 'householdName', 'text', 'Domácnost', true, householdName())}
                ${selectField('Vzhled', 'theme', [['light', 'Světlý'], ['dark', 'Tmavý']], state.settings.theme)}
              </div>
              <div class="form-actions compact-actions"><button class="primary-btn" type="submit">Uložit domácnost</button></div>
            </form>
          </section>

          <section class="card compact-settings-card">
            <div class="card-header"><div><h2>Profily</h2><p>Členové jedné domácnosti. Každý může mít svoje položky a nastavení.</p></div><span class="badge">${state.profiles.length} profilů</span></div>
            <div class="profile-list compact-profile-list">
              ${state.profiles.map((profile) => `
                <div class="profile-chip ${profile.id === currentProfileId() ? 'active' : ''}">
                  <button type="button" data-action="set-profile" data-id="${escapeHtml(profile.id)}">
                    <strong>${escapeHtml(profile.name)}</strong>
                    <span>${escapeHtml(profile.role === 'owner' ? 'správce' : 'člen domácnosti')}${profile.cloudId ? ' · cloud' : ' · lokálně'}</span>
                  </button>
                  ${state.profiles.length > 1 ? `<button class="mini-danger" type="button" data-action="delete-profile" data-id="${escapeHtml(profile.id)}" aria-label="Smazat profil">×</button>` : ''}
                </div>
              `).join('')}
            </div>
            ${state.cloud?.householdId ? `<div class="form-actions compact-actions"><button class="ghost-btn" type="button" data-action="cloud-sync-local-profiles">Odeslat lokální profily</button><button class="ghost-btn" type="button" data-action="cloud-load-all">Načíst profily z cloudu</button></div>` : ''}
            <details class="action-details compact-edit-details settings-form-drawer">
              <summary><span>Přidat profil</span><em>další člen domácnosti</em></summary>
              <form data-form="add-profile" class="compact-form">
                <div class="form-grid two">
                  ${field('Nový profil', 'name', 'text', 'Jméno člena domácnosti', true)}
                  ${selectField('Role', 'role', [['member', 'Člen'], ['owner', 'Správce']], 'member')}
                </div>
                <div class="form-actions"><button class="ghost-btn" type="submit">Přidat profil</button></div>
              </form>
            </details>
          </section>
        </div>

        <div class="settings-panel panel-modules grid two">
          <section class="card desktop-span-2 compact-settings-card">
            <div class="card-header"><div><h2>Zapnuté moduly</h2><p>Každá domácnost si může nechat jen to, co opravdu používá.</p></div><span class="badge">${enabled.size}</span></div>
            <div class="module-toggle-grid compact-module-toggle-grid">
              ${MODULES.filter((module) => !['home', 'settings'].includes(module.id)).map((module) => `
                <button class="module-toggle ${enabled.has(module.id) ? 'active' : ''}" type="button" data-action="toggle-module" data-id="${module.id}">
                  <span>${module.icon}</span>
                  <strong>${escapeHtml(module.label)}</strong>
                  <em>${enabled.has(module.id) ? 'zapnuto' : 'vypnuto'}</em>
                </button>
              `).join('')}
            </div>
          </section>

          <section class="card desktop-span-2 compact-settings-card">
            ${renderBottomNavSettings()}
          </section>
        </div>

        <div class="settings-panel panel-dashboard grid two">
          ${renderDashboardSettings()}
        </div>

        <div class="settings-panel panel-cloud grid two">
          ${renderCloudAccount()}
          ${renderCloudSyncOverview('settings')}
          ${renderCloudReadiness(false)}
          ${renderPwaInstallCard()}
          ${renderAuthSetupCard()}
        </div>

        <div class="settings-panel panel-data grid two">
          <section class="card compact-settings-card">
            <div class="card-header"><div><h2>Data</h2><p>Export/import pro přenos nebo zálohu. Přílohy smluv jsou zvlášť v IndexedDB/Supabase Storage.</p></div></div>
            <div class="form-actions compact-actions">
              <button class="ghost-btn" type="button" data-action="export-data">Exportovat JSON</button>
              <button class="danger-btn" type="button" data-action="reset-data">Reset dat</button>
            </div>
            <details class="action-details compact-edit-details settings-form-drawer">
              <summary><span>Import JSON</span><em>vložit starší export</em></summary>
              <form data-form="import-data" class="compact-form">
                <div class="field"><label for="importJson">Import JSON</label><textarea id="importJson" class="textarea" name="json" placeholder="Sem vlož exportovaný JSON"></textarea></div>
                <div class="form-actions"><button class="primary-btn" type="submit">Importovat</button></div>
              </form>
            </details>
          </section>

          ${renderDeleteAccountCard()}
        </div>
      </div>
    `;
  }


  function renderDashboardSettings() {
    const selected = new Set(normalizeDashboardWidgetIds(state.settings?.dashboardWidgets));
    const weather = normalizeWeatherState(state.weather);
    const location = normalizeWeatherLocation(weather.location);
    const previewCtx = {
      hdo: getHdoStatus(now),
      todayEvents: upcomingCalendarEvents(now).filter((event) => event.date === todayISO()),
      upcomingEvents: upcomingCalendarEvents(now).slice(0, 6),
      calendarPanelEvents: upcomingCalendarEvents(now),
      activePackages: state.packages.filter((pkg) => pkg.status !== 'delivered'),
      openShopping: state.shopping.filter((item) => !item.done),
      openTasks: state.homeTasks.filter((task) => !task.done),
      wasteSoon: state.waste.map((item) => ({ ...item, days: daysUntil(item.date) })).filter((item) => item.days !== null && item.days >= 0 && item.days <= 7),
      vehicleAlerts: getVehicleAlerts(),
      weather
    };
    return `
      <section class="card desktop-span-2 compact-settings-card dashboard-settings-card">
        <div class="card-header"><div><h2>Panely v horním bloku Home</h2><p>Čas a počasí jsou na Home pevně. Vyber 0–8 dalších panelů pod ně.</p></div><span class="badge">${normalizeHomeHeroIds(state.settings?.homeHeroItems).length}/8</span></div>
        <div class="switch-list dashboard-widget-picker">
          ${HOME_HERO_ITEMS.map((item) => {
            const active = normalizeHomeHeroIds(state.settings?.homeHeroItems).includes(item.id);
            return `
              <button class="switch-row dashboard-widget-switch ${active ? 'active' : ''}" type="button" role="switch" aria-checked="${active ? 'true' : 'false'}" data-action="toggle-home-hero-item" data-id="${escapeHtml(item.id)}">
                <span class="switch-row-icon">${escapeHtml(item.icon)}</span>
                <span class="switch-row-copy"><strong>${escapeHtml(item.label)}</strong><em>${escapeHtml(item.text(previewCtx))}</em></span>
                <span class="ios-switch" aria-hidden="true"><span></span></span>
              </button>
            `;
          }).join('')}
        </div>
        <div class="form-actions compact-actions"><button class="ghost-btn" type="button" data-action="home-hero-reset">Bez dalších panelů</button>${cloudReady() ? '<span class="badge good">ukládá se i do domácnosti</span>' : '<span class="badge">lokálně</span>'}</div>
      </section>

      <section class="card compact-settings-card weather-settings-card">
        <div class="card-header"><div><h2>Počasí</h2><p>Preferovaný zdroj je ČHMÚ přes Edge Function. Když backend nebo data vypadnou, appka bezpečně použije Open-Meteo fallback.</p></div><span class="badge ${weather.current ? 'good' : ''}">${weather.current ? 'aktivní' : 'nastavit'}</span></div>
        <form data-form="weather-settings" class="compact-form">
          <div class="form-grid two">
            ${selectField('Zdroj', 'weatherSource', WEATHER_PROVIDER_OPTIONS, normalizeWeatherSource(weather.source))}
            ${field('Místo', 'locationName', 'text', 'Hostinné', true, location.name)}
            ${field('Země', 'country', 'text', 'CZ', false, location.country)}
            ${field('Šířka', 'latitude', 'number', '50,5407', false, location.latitude)}
            ${field('Délka', 'longitude', 'number', '15,7233', false, location.longitude)}
          </div>
          <div class="form-actions compact-actions"><button class="primary-btn" type="submit">Uložit a načíst počasí</button><button class="ghost-btn" type="button" data-action="weather-refresh">Obnovit počasí</button></div>
        </form>
        <div class="inline-note compact-note">Když vyplníš jen název místa, aplikace ho zkusí najít přes geocoding. ČHMÚ data běží přes backend mezivrstvu, aby se Home nerozbilo ani při změně datového formátu.</div>
      </section>

      <section class="card compact-settings-card">
        <div class="card-header"><div><h2>Jak to bude fungovat dál</h2><p>Teď je hotový základ zapnout/vypnout. Později půjde doplnit ruční řazení, velikosti karet a tabletový režim.</p></div></div>
        <div class="hint-box">Dashboard je samostatná vrstva nad moduly. Když odebereš kartu z hlavní obrazovky, data a modul zůstanou v aplikaci.</div>
      </section>
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

  function hasStoredSupabaseSession() {
    const raw = localStorage.getItem(SUPABASE_STORAGE_KEY);
    const session = safeParse(raw, null);
    if (!session || typeof session !== 'object') return false;
    const accessToken = normalizeText(session.access_token || session.currentSession?.access_token);
    const refreshToken = normalizeText(session.refresh_token || session.currentSession?.refresh_token);
    const expiresAt = Number(session.expires_at || session.currentSession?.expires_at || 0);
    if (refreshToken) return true;
    if (accessToken && (!expiresAt || expiresAt * 1000 > Date.now() - 60000)) return true;
    return false;
  }

  function hasUsableAppSession() {
    return Boolean(state.cloud?.status === 'signed-in' && state.cloud?.userId && hasStoredSupabaseSession());
  }

  function resetSignedOutAppState() {
    const theme = state.settings?.theme === 'dark' ? 'dark' : 'light';
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('homeWeb.activeModule');
    localStorage.removeItem('domacnostPlus.moduleTabs');
    sessionStorage.removeItem(DEMO_SESSION_KEY);
    sessionStorage.removeItem(ONBOARDING_GOOGLE_INTENT_KEY);
    sessionStorage.setItem('domacnostPlus.onboardingMode', 'choice');
    state = migrateState(mergeState(DEFAULT_STATE, {}));
    state.settings.theme = theme;
    state.household = { ...(state.household || {}), name: '', isConfigured: false };
    state.profiles = [];
    state.activeProfileId = '';
    state.cloud = { ...(state.cloud || {}), supabaseUrl: SUPABASE_URL, provider: 'supabase', status: 'offline', userId: '', email: '', householdId: '', households: [], invitations: [] };
    onboardingMode = 'choice';
    demoRuntimeActive = false;
    activeModule = 'home';
    moduleTabs = {};
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

  async function cloudOAuthSignIn(provider = 'google', intent = 'login') {
    const client = getSupabaseClient();
    if (!client?.auth?.signInWithOAuth) return showToast('Supabase OAuth není dostupný');
    if (provider !== 'google') return showToast('Teď je připravené jen Google přihlášení');
    sessionStorage.setItem(ONBOARDING_GOOGLE_INTENT_KEY, intent === 'register' ? 'register' : 'login');
    try {
      const { data, error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${APP_PUBLIC_URL}?auth=google`,
          scopes: 'openid email profile https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.calendarlist.readonly',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });
      if (error) return showToast(error.message || 'Google přihlášení se nepovedlo');
      if (data?.url) window.location.href = data.url;
    } catch (error) {
      console.warn('Google OAuth sign-in failed', error);
      showToast('Google přihlášení se nepovedlo spustit');
    }
  }

  function renderCloudHouseholdManager() {
    const households = Array.isArray(state.cloud?.households) ? state.cloud.households : [];
    const activeCloudId = state.cloud?.householdId || '';
    return `
      <div class="cloud-household-panel">
        <div class="card-subheader"><h3>Cloud domácnosti</h3><p>Cloud je hlavní zdroj dat pro všechny členy domácnosti. Lokální úložiště zůstává jen jako cache a nouzový fallback.</p></div>
        <div class="form-actions compact-actions">
          <button class="ghost-btn" type="button" data-action="cloud-load-households">Načíst moje domácnosti</button>
          <button class="ghost-btn" type="button" data-action="cloud-load-all">Načíst data aktivní domácnosti</button>
          <button class="primary-btn" type="button" data-action="cloud-sync-pending">Dohnat lokální → cloud</button>
        </div>
        ${households.length ? `
          ${households.length > 1 ? '<div class="inline-note warn-note">Pod účtem je víc aktivních domácností. Appka teď novou nevytváří automaticky; duplicitní můžeš jen skrýt z tohoto účtu.</div>' : ''}
          <div class="cloud-household-list">
            ${households.map((household) => `
              <div class="cloud-household-row ${household.id === activeCloudId ? 'active' : ''}">
                <div><strong>${escapeHtml(household.name || 'Domácnost')}</strong><span>${escapeHtml(household.role || 'member')} · ${escapeHtml(shortId(household.id))}</span></div>
                <div class="item-actions compact-actions">
                  ${household.id === activeCloudId ? '<span class="badge good">aktivní</span>' : `<button class="ghost-btn" type="button" data-action="cloud-switch-household" data-id="${escapeHtml(household.id)}" data-name="${escapeHtml(household.name || 'Domácnost')}">Přepnout</button><button class="ghost-btn" type="button" data-action="cloud-archive-household" data-id="${escapeHtml(household.id)}">Skrýt</button>`}
                </div>
              </div>
            `).join('')}
          </div>
        ` : '<div class="inline-note">Zatím není načtený seznam domácností. Klikni na „Načíst moje domácnosti“.</div>'}
        <div class="grid two cloud-auth-grid">
          <form data-form="cloud-create-household">
            <h3>Nová domácnost</h3>
            <div class="form-grid two">
              ${field('Název', 'name', 'text', 'Novákovi / Chata / Byt', true)}
              ${field('Hlavní profil', 'profileName', 'text', currentProfile()?.name || 'Já', false)}
            </div>
            <div class="form-actions"><button class="primary-btn" type="submit">Vytvořit novou domácnost</button></div>
          </form>
          <form data-form="cloud-invite-member">
            <h3>Pozvat člena</h3>
            <div class="form-grid two">
              ${field('E-mail', 'email', 'email', 'email@domena.cz', true)}
              ${selectField('Role', 'role', [['member', 'Člen'], ['admin', 'Admin'], ['read_only', 'Jen čtení']], 'member')}
            </div>
            <div class="form-actions"><button class="ghost-btn" type="submit">Připravit pozvánku</button></div>
          </form>
        </div>
        <div class="form-actions compact-actions">
          <button class="ghost-btn" type="button" data-action="cloud-load-invitations">Načíst pozvánky</button>
        </div>
        ${renderCloudInvitationsPanel()}
        <div class="inline-note">Pozvánky už jsou v Supabase. Pozvaný člověk se přihlásí stejným e-mailem, načte příchozí pozvánky a přijme je. Data se dál oddělují podle cloud ID domácnosti.</div>
      </div>
    `;
  }

  function renderCloudInvitationsPanel() {
    const invitations = Array.isArray(state.cloud?.invitations) ? state.cloud.invitations : [];
    const pending = invitations.filter((item) => item.status !== 'accepted' && item.status !== 'cancelled');
    const incoming = pending.filter((item) => String(item.email || '').toLowerCase() === String(state.cloud?.email || '').toLowerCase());
    const outgoing = pending.filter((item) => String(item.email || '').toLowerCase() !== String(state.cloud?.email || '').toLowerCase());
    const row = (item, incomingMode = false) => `
      <div class="cloud-household-row">
        <div>
          <strong>${escapeHtml(item.email || 'pozvánka')}</strong>
          <span>${escapeHtml(item.role || 'member')} · ${escapeHtml(item.status || 'pending')}${item.expiresAt || item.expires_at ? ` · do ${escapeHtml(formatDate(item.expiresAt || item.expires_at))}` : ''}</span>
        </div>
        ${incomingMode ? `<button class="primary-btn" type="button" data-action="cloud-accept-invitation" data-id="${escapeHtml(item.id)}">Přijmout</button>` : `<span class="badge ${item.localOnly ? 'warn' : 'good'}">${item.localOnly ? 'lokálně' : 'cloud'}</span>`}
      </div>`;
    return `
      <div class="cloud-invitations-panel">
        <div class="card-subheader"><h3>Pozvánky</h3><p>${pending.length ? `${pending.length} aktivních pozvánek` : 'Zatím žádné aktivní pozvánky.'}</p></div>
        ${incoming.length ? `<div class="cloud-household-list"><div class="inline-note">Příchozí pozvánky pro tvůj e-mail</div>${incoming.map((item) => row(item, true)).join('')}</div>` : ''}
        ${outgoing.length ? `<div class="cloud-household-list"><div class="inline-note">Odeslané pozvánky z této domácnosti</div>${outgoing.map((item) => row(item, false)).join('')}</div>` : ''}
      </div>`;
  }

  function shortId(value) {
    return value ? `${String(value).slice(0, 8)}…` : '—';
  }

  function renderAuthSetupCard() {
    const siteUrl = getAppBaseUrl();
    const redirectUrl = getAuthRedirectUrl();
    const currentUrl = location.protocol === 'file:' ? 'lokální soubor' : `${location.origin}/`;
    const isProdHost = currentUrl === siteUrl;
    const isLocalHost = ['localhost', '127.0.0.1'].includes(location.hostname);
    const templatePath = 'supabase/email-confirmation-template-domacnost-plus.html';
    const checks = [
      {
        ok: true,
        title: 'Site URL v Supabase',
        note: siteUrl
      },
      {
        ok: true,
        title: 'Povolený redirect URL',
        note: redirectUrl
      },
      {
        ok: !isLocalHost,
        title: 'Aktuální adresa aplikace',
        note: isProdHost ? 'Běží na produkční Vercel adrese.' : `${currentUrl} · potvrzovací e-mail se i tak posílá na produkční adresu.`
      },
      {
        ok: true,
        title: 'Šablona e-mailu',
        note: `${templatePath} · vložit do Supabase → Authentication → Email Templates → Confirm signup`
      }
    ];
    return `
      <section class="card desktop-span-2 setup-card auth-setup-card">
        <div class="card-header">
          <div><h2>Supabase Auth nastavení</h2><p>Kontrola pro potvrzovací e-maily, aby odkazy nepadaly na localhost a šly zpět do Domácnost+.</p></div>
          <span class="badge ${isProdHost ? 'good' : 'warn'}">${isProdHost ? 'produkce' : 'kontrola'}</span>
        </div>
        <div class="setup-list">
          ${checks.map((item) => `
            <div class="setup-item ${item.ok ? 'done' : ''}">
              <span>${item.ok ? '✓' : '!'}</span>
              <div><strong>${escapeHtml(item.title)}</strong><em>${escapeHtml(item.note)}</em></div>
            </div>
          `).join('')}
        </div>
        <div class="hint-box" style="margin-top:12px;">
          V Supabase musí být v Authentication → URL Configuration nastaveno <strong>${escapeHtml(siteUrl)}</strong> a <strong>${escapeHtml(redirectUrl)}</strong>. Aplikace při registraci používá produkční redirect natvrdo, takže už sama neposílá localhost.
        </div>
        <div class="inline-note" style="margin-top:12px;">Demo verze je lokální ukázka. Ostrou domácnost zakládej přes účet, aby měla vlastní cloudové ID a nemíchala se s demo daty.</div>
      </section>
    `;
  }

  function renderCloudAccount() {
    const cloud = state.cloud || {};
    const signedIn = Boolean(cloud.userId);
    return `
      <section class="card desktop-span-2 cloud-card">
        <div class="card-header">
          <div><h2>Cloud účet</h2><p>Online domácnost v Supabase. Při vytvoření domácnosti se cloud připraví automaticky; lokál zůstává jen cache/fallback.</p></div>
          <span class="badge ${signedIn ? 'good' : ''}">${signedIn ? 'přihlášeno' : 'lokálně'}</span>
        </div>
        <div class="cloud-status-grid">
          <div class="mini-stat"><span>Supabase</span><strong>${escapeHtml(SUPABASE_URL.replace('https://', ''))}</strong></div>
          <div class="mini-stat"><span>Účet</span><strong>${escapeHtml(cloud.email || 'nepřihlášeno')}</strong></div>
          <div class="mini-stat"><span>Cloud domácnost</span><strong>${escapeHtml(cloud.householdId || 'zatím nevytvořena')}</strong></div>
          <div class="mini-stat"><span>Poslední zápis</span><strong>${cloud.lastSyncAt ? escapeHtml(formatDateTime(cloud.lastSyncAt)) : 'nikdy'}</strong></div>
          <div class="mini-stat"><span>Živé změny</span><strong data-cloud-realtime-status>${signedIn && cloud.householdId ? escapeHtml(realtimeStatusLabel(cloud.realtimeStatus)) : 'offline'}</strong></div>
          <div class="mini-stat"><span>Autosync</span><strong>${signedIn && cloud.householdId ? escapeHtml(cloudAutosyncStatusLabel(cloud.autosyncStatus)) : 'offline'}</strong></div>
          <div class="mini-stat"><span>Poslední autosync</span><strong>${cloud.lastAutosyncAt ? escapeHtml(formatDateTime(cloud.lastAutosyncAt)) : 'nikdy'}</strong></div>
        </div>
        ${signedIn ? renderCloudHouseholdManager() : ''}
        ${signedIn ? `
          <div class="hint-box">Jsi přihlášený. Domácnost se při založení rovnou vytvoří v Supabase. Tady zůstává jen kontrola, ruční synchronizace a údržba účtu.</div>
          <div class="form-actions">
            <button class="ghost-btn" type="button" data-action="cloud-bootstrap">Opravit cloud napojení</button>
            <button class="ghost-btn" type="button" data-action="cloud-load-all">Načíst data domácnosti</button>
            <button class="ghost-btn" type="button" data-action="cloud-start-realtime">Zapnout živé změny</button>
            <button class="ghost-btn" type="button" data-action="cloud-run-autosync-now">Synchronizovat teď</button>
            <button class="ghost-btn" type="button" data-action="cloud-toggle-autosync">${cloud.autoSyncEnabled === false ? 'Zapnout autosync' : 'Vypnout autosync'}</button>
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
    const manifestLink = document.querySelector('link[rel="manifest"]');
    const appleLinks = Array.from(document.querySelectorAll('link[rel="apple-touch-icon"], link[rel="apple-touch-icon-precomposed"]'));
    const iconLinks = Array.from(document.querySelectorAll('link[rel~="icon"]'));
    return {
      standalone,
      secure,
      swSupported,
      ios,
      android,
      canPrompt: Boolean(deferredInstallPrompt),
      updateAvailable: Boolean(pwaUpdateAvailable),
      fileMode: location.protocol === 'file:',
      manifestHref: manifestLink ? new URL(manifestLink.getAttribute('href'), location.href).href : '',
      appleIconCount: appleLinks.length,
      iconCount: iconLinks.length,
      swControlled: Boolean(navigator.serviceWorker?.controller),
      swReady: Boolean(serviceWorkerRegistration),
      protocol: location.protocol.replace(':', ''),
      host: location.host || 'lokální soubor'
    };
  }

  function renderPwaDiagnostics() {
    const diagnostics = state.pwa?.diagnostics;
    if (!diagnostics?.checks?.length) {
      return `<div class="hint-box">Diagnostiku spusť po otevření aplikace z Vercelu/HTTPS. Zkontroluje manifest, dostupnost ikon, Apple touch ikony, service worker a režim instalace.</div>`;
    }
    const okCount = diagnostics.checks.filter((item) => item.status === 'ok').length;
    const warnCount = diagnostics.checks.filter((item) => item.status === 'warn').length;
    const badCount = diagnostics.checks.filter((item) => item.status === 'bad').length;
    return `
      <div class="pwa-diagnostic-summary">
        <span class="badge good">OK ${okCount}</span>
        <span class="badge warn">Pozor ${warnCount}</span>
        <span class="badge bad">Chyba ${badCount}</span>
        <span class="badge">${escapeHtml(formatDateTime(diagnostics.checkedAt))}</span>
      </div>
      <div class="diagnostic-list">
        ${diagnostics.checks.map((item) => `
          <div class="diagnostic-row ${escapeHtml(item.status)}">
            <span class="diagnostic-dot" aria-hidden="true"></span>
            <div>
              <strong>${escapeHtml(item.label)}</strong>
              <em>${escapeHtml(item.message)}</em>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderPwaInstallCard() {
    const pwa = getPwaStatus();
    const statusLabel = pwa.standalone ? 'nainstalováno' : pwa.fileMode ? 'lokální soubor' : pwa.canPrompt ? 'lze instalovat' : 'připraveno';
    return `
      <section class="card desktop-span-2 pwa-card">
        <div class="card-header">
          <div><h2>Instalace aplikace</h2><p>Domácnost+ je instalovatelná PWA. Tahle část teď umí i diagnostiku ikon, manifestu a service workeru.</p></div>
          <span class="badge ${pwa.standalone ? 'good' : pwa.updateAvailable ? 'warn' : ''}">${statusLabel}</span>
        </div>
        <div class="cloud-status-grid">
          <div class="mini-stat"><span>Režim</span><strong>${pwa.standalone ? 'samostatná app' : 'prohlížeč'}</strong></div>
          <div class="mini-stat"><span>Adresa</span><strong>${escapeHtml(pwa.host)}</strong></div>
          <div class="mini-stat"><span>Service worker</span><strong>${pwa.swControlled ? 'aktivní' : pwa.swSupported ? 'podporovaný' : 'není dostupný'}</strong></div>
          <div class="mini-stat"><span>Apple ikony</span><strong>${pwa.appleIconCount} odkazů</strong></div>
          <div class="mini-stat"><span>Manifest</span><strong>${pwa.manifestHref ? 'nalezen' : 'chybí'}</strong></div>
          <div class="mini-stat"><span>Verze</span><strong>${escapeHtml(APP_VERSION)}</strong></div>
        </div>
        ${pwa.fileMode ? `<div class="hint-box warn-box">Teď je appka otevřená jako lokální soubor ze ZIPu. Instalace, ikona a automatické aktualizace fungují správně až přes HTTPS, typicky přes Vercel.</div>` : ''}
        <div class="hint-box">Když se na iPhonu pořád ukazuje stará nebo prázdná ikona, smaž starou ikonu z plochy, otevři web znovu v Safari a přidej ji znovu. iOS si ikonu ukládá mimo běžnou web cache.</div>
        <div class="install-steps">
          <div class="install-step"><strong>iPhone / iPad</strong><span>Safari → Sdílet → Přidat na plochu. iOS bere hlavně apple-touch-icon, proto je kontrolujeme zvlášť.</span></div>
          <div class="install-step"><strong>Android / Chrome</strong><span>Menu prohlížeče → Instalovat aplikaci. Tlačítko se objeví jen když Chrome pošle instalační prompt.</span></div>
          <div class="install-step"><strong>Update</strong><span>Nový deploy přes Vercel se kontroluje přes service worker podobně jako u RaK.</span></div>
        </div>
        <div class="form-actions">
          ${pwa.canPrompt ? `<button class="primary-btn" type="button" data-action="pwa-install">Instalovat aplikaci</button>` : ''}
          <button class="ghost-btn" type="button" data-action="pwa-run-diagnostics">Spustit diagnostiku</button>
          <button class="ghost-btn" type="button" data-action="pwa-check-update">Zkontrolovat update</button>
          <button class="ghost-btn" type="button" data-action="pwa-clear-cache">Vyčistit PWA cache</button>
          ${pwa.updateAvailable ? `<button class="primary-btn" type="button" data-action="pwa-apply-update">Aktualizovat na novou verzi</button>` : ''}
        </div>
        ${renderPwaDiagnostics()}
      </section>
    `;
  }

  function field(label, name, type = 'text', placeholder = '', required = false, value = '', inputMode = '') {
    const inputId = `field-${name}-${Math.random().toString(36).slice(2, 7)}`;
    return `
      <div class="field">
        <label for="${inputId}">${escapeHtml(label)}</label>
        <input class="input" id="${inputId}" name="${name}" type="${type}" placeholder="${escapeHtml(placeholder)}" value="${escapeHtml(value)}" ${required ? 'required' : ''} ${type === 'number' ? 'step="any" inputmode="decimal"' : inputMode ? `inputmode="${escapeHtml(inputMode)}" pattern="[0-9:., ]*"` : ''}>
      </div>
    `;
  }

  function fuelNumberField(label, name, placeholder = '', value = '') {
    const inputId = `field-${name}-${Math.random().toString(36).slice(2, 7)}`;
    return `
      <div class="field">
        <label for="${inputId}">${escapeHtml(label)}</label>
        <input class="input" id="${inputId}" name="${name}" type="number" step="any" inputmode="decimal" placeholder="${escapeHtml(placeholder)}" value="${escapeHtml(value)}" data-fuel-calc>
      </div>
    `;
  }

  function hdoTimeField(label, name, placeholder = '06:00', required = false, value = '') {
    const inputId = `field-${name}-${Math.random().toString(36).slice(2, 7)}`;
    return `
      <div class="field">
        <label for="${inputId}">${escapeHtml(label)}</label>
        <input class="input" id="${inputId}" name="${name}" type="text" placeholder="${escapeHtml(placeholder)}" value="${escapeHtml(value)}" ${required ? 'required' : ''} inputmode="numeric" pattern="[0-9:]*" autocomplete="off" data-hdo-time-input>
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

  function renderEmptyCta({ icon = '✨', title = 'Zatím prázdno', text = '', nav = '', tab = '', action = '', label = '' } = {}) {
    const button = nav
      ? `<button class="ghost-btn" type="button" data-nav="${escapeHtml(nav)}" ${tab ? `data-target-tab="${escapeHtml(tab)}"` : ''}>${escapeHtml(label || 'Otevřít')}</button>`
      : action
        ? `<button class="ghost-btn" type="button" data-action="${escapeHtml(action)}">${escapeHtml(label || 'Pokračovat')}</button>`
        : '';
    return `
      <div class="empty empty-cta">
        <div class="empty-cta-icon" aria-hidden="true">${escapeHtml(icon)}</div>
        <div>
          <strong>${escapeHtml(title)}</strong>
          ${text ? `<p>${escapeHtml(text)}</p>` : ''}
        </div>
        ${button ? `<div class="form-actions compact-actions">${button}</div>` : ''}
      </div>
    `;
  }

  function isRealHouseholdStarterState() {
    if (isDemoOnlyState()) return false;
    const counts = [
      state.calendar?.length || 0,
      state.packages?.length || 0,
      state.shopping?.length || 0,
      state.homeTasks?.length || 0,
      state.waste?.length || 0,
      state.vehicles?.length || 0,
      state.contracts?.length || 0,
      state.finance?.length || 0,
      state.cameras?.length || 0
    ];
    return counts.reduce((sum, value) => sum + value, 0) <= 2;
  }


  function getStarterSetupSteps() {
    const shoppingOpen = state.shopping?.some((item) => !item.done) || false;
    const hasFinanceBase = (state.financeAccounts?.length || 0) > 0 || (state.finance?.length || 0) > 0;
    return [
      {
        id: 'profiles',
        done: state.profiles.length >= 1,
        nav: 'settings',
        tab: 'household',
        icon: '👤',
        title: 'Doplnit profily',
        note: state.profiles.length ? `${state.profiles.length} profilů v domácnosti.` : 'Aspoň jeden profil, později klidně celá rodina.'
      },
      {
        id: 'hdo',
        done: state.hdoWindows.length > 0,
        nav: 'homecare',
        tab: 'hdo',
        icon: '💡',
        title: 'Nastavit HDO',
        note: state.hdoWindows.length ? `${state.hdoWindows.length} časových oken.` : 'Nízký tarif se pak ukáže na dashboardu.'
      },
      {
        id: 'shopping',
        done: shoppingOpen || (state.shopping?.length || 0) > 0,
        nav: 'shopping',
        tab: 'list',
        icon: '🛒',
        title: 'Přidat nákup',
        note: shoppingOpen ? `${state.shopping.filter((item) => !item.done).length} položek k nákupu.` : 'První sdílený seznam hned oživí dashboard.'
      },
      {
        id: 'garage',
        done: state.vehicles.length > 0,
        nav: 'garage',
        tab: state.vehicles.length ? 'overview' : 'add',
        icon: '🚗',
        title: 'Přidat auto',
        note: state.vehicles.length ? `${state.vehicles.length} aut v garáži.` : 'STK, pojistka, servis a později Fuelio import.'
      },
      {
        id: 'contracts',
        done: state.contracts.length > 0,
        nav: 'contracts',
        tab: state.contracts.length ? 'overview' : 'add',
        icon: '📄',
        title: 'Přidat smlouvu',
        note: state.contracts.length ? `${state.contracts.length} smluv uložených.` : 'Pojistky, platnosti a později přílohy.'
      },
      {
        id: 'finance',
        done: hasFinanceBase,
        nav: 'finance',
        tab: hasFinanceBase ? 'summary' : 'accounts',
        icon: '💰',
        title: 'Založit finance',
        note: hasFinanceBase ? 'Finance už mají první základ.' : 'Účty, hotovost, spoření a spravované peníze.'
      }
    ];
  }


  function getStarterSetupProgress() {
    const steps = getStarterSetupSteps();
    const doneSteps = steps.filter((step) => step.done);
    const pendingSteps = steps.filter((step) => !step.done);
    const total = Math.max(steps.length, 1);
    const doneCount = doneSteps.length;
    return {
      steps,
      orderedSteps: [...pendingSteps, ...doneSteps],
      pendingSteps,
      doneSteps,
      doneCount,
      total,
      percent: Math.round((doneCount / total) * 100),
      nextStep: pendingSteps[0] || steps[0]
    };
  }

  function getStarterPhaseSummary(progress) {
    const phaseDefs = [
      { id: 'base', icon: '🏠', title: 'Základ', note: 'profily domácnosti', ids: ['profiles'] },
      { id: 'daily', icon: '⚡', title: 'Denní provoz', note: 'HDO + nákupy', ids: ['hdo', 'shopping'] },
      { id: 'records', icon: '🗂️', title: 'Evidence', note: 'auto, smlouvy, finance', ids: ['garage', 'contracts', 'finance'] }
    ];
    return phaseDefs.map((phase) => {
      const steps = progress.steps.filter((step) => phase.ids.includes(step.id));
      const doneCount = steps.filter((step) => step.done).length;
      const firstPending = steps.find((step) => !step.done) || steps[0];
      const total = Math.max(steps.length, 1);
      return {
        ...phase,
        doneCount,
        total,
        percent: Math.round((doneCount / total) * 100),
        firstPending,
        done: doneCount >= total
      };
    });
  }

  function renderStarterPhaseStrip(progress) {
    const phases = getStarterPhaseSummary(progress);
    return `
      <div class="starter-phase-grid" aria-label="Fáze prvního nastavení domácnosti">
        ${phases.map((phase) => {
          const isNext = !phase.done && phase.firstPending?.id === progress.nextStep?.id;
          return `
            <button class="starter-phase-card ${phase.done ? 'done' : ''} ${isNext ? 'is-next' : ''}" type="button" data-nav="${escapeHtml(phase.firstPending?.nav || 'settings')}" data-target-tab="${escapeHtml(phase.firstPending?.tab || 'household')}">
              <span class="starter-phase-icon" aria-hidden="true">${escapeHtml(phase.done ? '✓' : phase.icon)}</span>
              <span class="starter-phase-copy"><strong>${escapeHtml(phase.title)}</strong><em>${escapeHtml(isNext ? `Další: ${phase.firstPending?.title || phase.note}` : phase.note)}</em></span>
              <span class="starter-phase-count">${isNext ? 'další' : `${phase.doneCount}/${phase.total}`}</span>
            </button>
          `;
        }).join('')}
      </div>
    `;
  }

  function renderStarterPriorityStrip(progress) {
    const pending = progress.pendingSteps.slice(0, 3);
    if (!pending.length) {
      return '<div class="starter-priority-strip done"><span>✓ Základ domácnosti je připravený.</span></div>';
    }
    return `
      <div class="starter-priority-strip" aria-label="Nejbližší doporučené kroky">
        ${pending.map((step, index) => `
          <button class="starter-priority-chip ${index === 0 ? 'is-next' : ''}" type="button" data-nav="${escapeHtml(step.nav)}" data-target-tab="${escapeHtml(step.tab)}">
            <strong>${index + 1}</strong><span><b>${escapeHtml(step.title)}</b><em>${escapeHtml(index === 0 ? `Teď: ${step.note}` : step.note)}</em></span>
          </button>
        `).join('')}
      </div>
    `;
  }

  function renderStarterSetupStep(step, nextStepId = '') {
    const isNext = !step.done && step.id === nextStepId;
    return `
      <button class="starter-step-card ${step.done ? 'done' : ''} ${isNext ? 'is-next' : ''}" type="button" data-nav="${escapeHtml(step.nav)}" data-target-tab="${escapeHtml(step.tab)}">
        <span class="starter-step-icon" aria-hidden="true">${escapeHtml(step.done ? '✓' : step.icon)}</span>
        <span class="starter-step-copy"><strong>${escapeHtml(step.title)}</strong><em>${escapeHtml(step.note)}</em></span>
        <span class="starter-step-status">${step.done ? 'hotovo' : isNext ? 'další' : 'nastavit'}</span>
      </button>
    `;
  }

  function renderStarterStateCard() {
    if (!isRealHouseholdStarterState()) return '';
    const signedIn = Boolean(state.cloud?.userId);
    const householdReady = Boolean(state.cloud?.householdId);
    const progress = getStarterSetupProgress();
    const nextStep = progress.nextStep || progress.steps[0];
    return `
      <section class="card desktop-span-2 starter-state-card guided-starter-card">
        <div class="card-header">
          <div><h2>Rychlé nastavení domácnosti</h2><p>Ostrá domácnost je zatím skoro prázdná. Tady jsou první kroky, které ji hned udělají použitelnou.</p></div>
          <span class="badge ${householdReady ? 'good' : signedIn ? 'warn' : ''}">${progress.doneCount}/${progress.total}</span>
        </div>
        <div class="starter-progress-head">
          <div>
            <strong>${progress.percent}% připraveno</strong>
            <span>Další krok: ${escapeHtml(nextStep.title)}</span>
          </div>
          <button class="ghost-btn" type="button" data-nav="${escapeHtml(nextStep.nav)}" data-target-tab="${escapeHtml(nextStep.tab)}">Pokračovat</button>
        </div>
        <div class="starter-progress"><span style="width:${progress.percent}%"></span></div>
        ${renderStarterPhaseStrip(progress)}
        ${renderStarterPriorityStrip(progress)}
        <div class="starter-step-grid">
          ${progress.orderedSteps.map((step) => renderStarterSetupStep(step, progress.nextStep?.id)).join('')}
        </div>
      </section>
    `;
  }

  function clockText(value) {
    const date = toSafeDate(value, new Date());
    if (!date || !Number.isFinite(date.getTime())) return '—:—';
    return new Intl.DateTimeFormat('cs-CZ', { hour: '2-digit', minute: '2-digit' }).format(date);
  }

  function shortDateText(value) {
    const date = toSafeDate(value, new Date());
    if (!date || !Number.isFinite(date.getTime())) return '—';
    return new Intl.DateTimeFormat('cs-CZ', { weekday: 'short', day: 'numeric', month: 'numeric' }).format(date);
  }

  function hdoWindowMatchesDate(item, date) {
    const safeDate = toSafeDate(date, new Date());
    if (!safeDate || !Number.isFinite(safeDate.getTime())) return false;
    const days = sanitizeHdoDays(item?.days);
    if (days.includes(safeDate.getDay())) return true;
    const isHoliday = isCzechPublicHolidayDate(safeDate);
    const hasWeekend = days.includes(0) || days.includes(6);
    return isHoliday && hasWeekend;
  }

  function getHdoStatus(date) {
    const safeDate = toSafeDate(date, new Date());
    if (!safeDate || !Number.isFinite(safeDate.getTime())) {
      return { active: false, label: 'není nastaveno', message: 'HDO se teď nepovedlo spočítat. Zkontroluj časová okna.' };
    }
    const day = safeDate.getDay();
    const minutesNow = safeDate.getHours() * 60 + safeDate.getMinutes();
    const enabled = getSafeHdoWindows().filter((item) => item.enabled && hdoWindowMatchesDate(item, safeDate) && timeToMinutes(item.start) !== null && timeToMinutes(item.end) !== null);
    const active = enabled.find((item) => isTimeInWindow(minutesNow, item.start, item.end));
    if (active) {
      return {
        active: true,
        label: active.label,
        message: `Právě běží ${active.label} (${hdoWindowTimeLabel(active)}).`
      };
    }
    const next = findNextHdoWindow(safeDate);
    if (!next) return { active: false, label: 'není nastaveno', message: 'Není nastavené žádné aktivní HDO okno.' };
    return {
      active: false,
      label: next.item.label,
      message: `Další nízký tarif: ${next.item.label} za ${humanDuration(next.diffMinutes)} (${hdoWindowTimeLabel(next.item)}).`
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
    if (!Number.isFinite(hours) || !Number.isFinite(minutes) || hours > 23 || minutes > 59) return null;
    return hours * 60 + minutes;
  }

  function sanitizeHdoDays(days) {
    if (!Array.isArray(days)) return [];
    return [...new Set(days.map((day) => Number(day)).filter((day) => Number.isInteger(day) && day >= 0 && day <= 6))].sort((a, b) => a - b);
  }

  function normalizeHdoWindowView(item) {
    if (!item || typeof item !== 'object') return null;
    const start = normalizeHdoTimeInput(item.start || item.start_time || item.from || '');
    const end = normalizeHdoTimeInput(item.end || item.end_time || item.to || '');
    return {
      ...item,
      label: normalizeText(item.label || item.title || 'HDO okno') || 'HDO okno',
      start,
      end,
      days: sanitizeHdoDays(item.days),
      enabled: item.enabled !== false && item.is_enabled !== false
    };
  }

  function getSafeHdoWindows() {
    return (Array.isArray(state.hdoWindows) ? state.hdoWindows : [])
      .map(normalizeHdoWindowView)
      .filter(Boolean);
  }

  function hdoWindowSortWeight(item) {
    const days = sanitizeHdoDays(item?.days);
    const hasWorkday = days.some((day) => day >= 1 && day <= 5);
    const hasWeekend = days.some((day) => day === 0 || day === 6);
    if (hasWorkday && !hasWeekend) return 0;
    if (hasWorkday && hasWeekend) return 1;
    if (hasWeekend) return 2;
    return 3;
  }

  function sortHdoWindowsForOverview(rows = []) {
    return [...rows].sort((a, b) => {
      const groupDiff = hdoWindowSortWeight(a) - hdoWindowSortWeight(b);
      if (groupDiff) return groupDiff;
      const timeDiff = (timeToMinutes(a?.start) ?? 9999) - (timeToMinutes(b?.start) ?? 9999);
      if (timeDiff) return timeDiff;
      return String(a?.label || '').localeCompare(String(b?.label || ''), 'cs');
    });
  }

  function hdoWindowTimeLabel(item) {
    const start = item?.start || '—';
    const end = item?.end || '—';
    return `${start}–${end}`;
  }

  function findNextHdoWindow(date) {
    const base = toSafeDate(date, new Date());
    if (!base || !Number.isFinite(base.getTime())) return null;
    const windows = getSafeHdoWindows().filter((item) => item.enabled && item.days.length);
    if (!windows.length) return null;
    const candidates = [];
    windows.forEach((item) => {
      const startMinutes = timeToMinutes(item.start);
      if (startMinutes === null) return;
      for (let offset = 0; offset <= 7; offset += 1) {
        const candidate = new Date(base);
        candidate.setDate(base.getDate() + offset);
        if (!hdoWindowMatchesDate(item, candidate)) continue;
        candidate.setHours(Math.floor(startMinutes / 60), startMinutes % 60, 0, 0);
        const diffMinutes = Math.round((candidate.getTime() - base.getTime()) / 60000);
        if (Number.isFinite(diffMinutes) && diffMinutes > 0) candidates.push({ item, diffMinutes });
      }
    });
    return candidates.sort((a, b) => a.diffMinutes - b.diffMinutes)[0] || null;
  }

  function humanDuration(minutes) {
    const safeMinutes = Number(minutes);
    if (!Number.isFinite(safeMinutes) || safeMinutes < 0) return '—';
    if (safeMinutes < 60) return `${Math.round(safeMinutes)} min`;
    const hours = Math.floor(safeMinutes / 60);
    const rest = Math.round(safeMinutes % 60);
    if (hours < 24) return rest ? `${hours} h ${rest} min` : `${hours} h`;
    const days = Math.floor(hours / 24);
    const leftHours = hours % 24;
    return leftHours ? `${days} d ${leftHours} h` : `${days} d`;
  }

  function daysLabel(days) {
    const safeDays = sanitizeHdoDays(days);
    if (!safeDays.length) return 'bez dnů';
    const normalized = safeDays.join(',');
    if (normalized === '0,1,2,3,4,5,6') return 'každý den';
    if (normalized === '1,2,3,4,5') return 'po–pá';
    if (normalized === '0,6') return 'víkend + svátky';
    const names = ['ne', 'po', 'út', 'st', 'čt', 'pá', 'so'];
    const base = safeDays.map((day) => names[day] || '?').join(', ');
    return safeDays.includes(0) || safeDays.includes(6) ? `${base} + svátky` : base;
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

  function isAllowedContractFile(file) {
    if (!file) return false;
    const name = String(file.name || '').toLowerCase();
    const type = String(file.type || '').toLowerCase();
    if (CONTRACT_FILE_ALLOWED_MIME.has(type)) return true;
    return ['.pdf', '.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'].some((ext) => name.endsWith(ext));
  }

  function contractFileValidationMessage(file) {
    if (!file) return 'Soubor není dostupný';
    if (file.size > CONTRACT_FILE_MAX_BYTES) return `${file.name || 'Soubor'} je větší než 15 MB`;
    if (!isAllowedContractFile(file)) return `${file.name || 'Soubor'} není podporovaný typ. Použij PDF nebo fotku.`;
    return '';
  }

  async function cloudLoadContractFiles(showMessage = true) {
    const client = getSupabaseClient();
    if (!client) { if (showMessage) showToast('Supabase knihovna není načtená'); return null; }
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
    const useCloudStorage = cloudReady();
    let added = 0;
    let failed = 0;
    for (const file of files) {
      const validationMessage = contractFileValidationMessage(file);
      if (validationMessage) {
        failed += 1;
        showToast(validationMessage);
        continue;
      }
      if (useCloudStorage) {
        const cloudFile = await cloudUploadContractFile(contract, file);
        if (cloudFile) {
          state.contractFiles = state.contractFiles.filter((entry) => entry.cloudId !== cloudFile.cloudId);
          state.contractFiles.push(cloudFile);
          added += 1;
        } else {
          failed += 1;
        }
        continue;
      }
      if (!('indexedDB' in window)) {
        failed += 1;
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
    if (input) input.value = '';
    render();
    if (added && useCloudStorage) showToast(failed ? `Do cloudu nahráno ${added}, neprošlo ${failed}` : (added === 1 ? 'Příloha nahraná do cloudu' : `Do cloudu nahráno příloh: ${added}`));
    else if (added) showToast(added === 1 ? 'Příloha uložená lokálně' : `Lokálně přidáno příloh: ${added}`);
    else showToast('Přílohu se nepovedlo přidat');
  }

  async function cloudSyncLocalContractFiles(showMessage = true) {
    if (!cloudReady()) {
      if (showMessage) showToast('Nejdřív napoj domácnost na cloud');
      return 0;
    }
    const localFiles = state.contractFiles.filter((file) => !file.cloudId);
    if (!localFiles.length) {
      if (showMessage) showToast('Žádné lokální přílohy k odeslání');
      return 0;
    }
    let uploaded = 0;
    let missing = 0;
    let failed = 0;
    for (const meta of localFiles) {
      const contract = state.contracts.find((item) => item.id === meta.contractId);
      if (!contract) { failed += 1; continue; }
      let stored = null;
      try {
        stored = await getStoredContractFile(meta.id);
      } catch {
        stored = null;
      }
      const blob = stored?.blob;
      if (!blob) { missing += 1; continue; }
      const fileName = meta.fileName || stored.fileName || 'priloha';
      const fileType = meta.fileType || stored.fileType || blob.type || 'application/octet-stream';
      const uploadFile = (typeof File !== 'undefined' && blob instanceof File) ? blob : new File([blob], fileName, { type: fileType });
      const cloudFile = await cloudUploadContractFile(contract, uploadFile);
      if (!cloudFile?.cloudId) { failed += 1; continue; }
      state.contractFiles = state.contractFiles.filter((file) => file.id !== meta.id && file.cloudId !== cloudFile.cloudId);
      state.contractFiles.push({ ...cloudFile, id: meta.id, createdAt: meta.createdAt || cloudFile.createdAt });
      deleteStoredContractFile(meta.id).catch(() => {});
      uploaded += 1;
    }
    if (uploaded) state.cloud.lastSyncAt = new Date().toISOString();
    touchState();
    saveState();
    render();
    if (showMessage) {
      const details = [uploaded ? `${uploaded} nahráno` : '', missing ? `${missing} nemá soubor v tomto prohlížeči` : '', failed ? `${failed} chyba` : ''].filter(Boolean).join(' · ');
      showToast(details || 'Přílohy se nepodařilo dohnat');
    }
    return uploaded;
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

  function detectCsvDelimiter(line) {
    const candidates = [';', ',', '\t'];
    let best = ';';
    let bestCount = -1;
    candidates.forEach((candidate) => {
      const delimiter = candidate === '\t' ? '\t' : candidate;
      const count = (String(line || '').match(new RegExp(delimiter === '\t' ? '\\t' : `\\${delimiter}`, 'g')) || []).length;
      if (count > bestCount) {
        best = candidate;
        bestCount = count;
      }
    });
    return best === '\t' ? '\t' : best;
  }

  function splitCsvRows(text, delimiter) {
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
    return rows;
  }

  function csvHeaderScore(cells) {
    return cells.map(normalizeKey).reduce((score, header) => {
      if (/date|datum|data|time|cas|odometer|tachometer|mileage|km|volume|lit|fuel|palivo|cost|price|cena|vehicle|vozidlo|service|servis|expense|naklad|odo/.test(header)) return score + 1;
      return score;
    }, 0);
  }

  function detectCsvDelimiterFromText(text) {
    const rawLines = String(text || '').split(/\r?\n/).filter((line) => line.trim() && !/^sep=/i.test(line.trim()));
    const candidates = [';', ',', '\t'];
    let best = ';';
    let bestScore = -1;
    rawLines.slice(0, 30).forEach((line) => {
      candidates.forEach((candidate) => {
        const delimiter = candidate === '\t' ? '\t' : candidate;
        const count = (String(line || '').match(new RegExp(delimiter === '\t' ? '\\t' : `\\${delimiter}`, 'g')) || []).length;
        const score = count + (csvHeaderScore(splitCsvRows(`${line}\n`, delimiter)[0] || []) * 4);
        if (score > bestScore) {
          best = candidate;
          bestScore = score;
        }
      });
    });
    return best === '\t' ? '\t' : best;
  }

  function parseCsvTables(text) {
    const raw = String(text || '').replace(/^\uFEFF/, '').replace(/^sep=(.)\s*\r?\n/i, '');
    if (!raw.trim()) return [];
    const delimiter = detectCsvDelimiterFromText(raw);
    const sourceRows = splitCsvRows(raw, delimiter);
    const tables = [];
    let currentSection = 'default';
    let headers = null;
    let currentRows = [];
    const flush = () => {
      if (headers && currentRows.length) tables.push({ section: currentSection, rows: currentRows });
      headers = null;
      currentRows = [];
    };
    sourceRows.forEach((cells) => {
      const first = normalizeText(cells[0]);
      const marker = cells.length === 1 && /^##\s*/.test(first);
      if (marker) {
        flush();
        currentSection = normalizeText(first.replace(/^##\s*/, '')) || 'default';
        return;
      }
      if (!headers) {
        if (csvHeaderScore(cells) > 0) headers = cells.map((header, index) => normalizeKey(header) || `col ${index}`);
        return;
      }
      currentRows.push(Object.fromEntries(headers.map((header, index) => [header, normalizeText(cells[index])])));
    });
    flush();
    return tables;
  }

  function parseCsv(text) {
    return parseCsvTables(text).flatMap((table) => table.rows.map((row) => ({ ...row, __fuelioSection: table.section })));
  }

  function getRowValue(row, keys) {
    const normalizedKeys = keys.map(normalizeKey);
    for (const key of normalizedKeys) {
      if (row[key] !== undefined && row[key] !== '') return row[key];
    }
    const found = Object.keys(row).find((rowKey) => normalizedKeys.some((key) => rowKey === key || rowKey.includes(key) || key.includes(rowKey)));
    return found ? row[found] : '';
  }

  function parseCzNumber(value) {
    if (value === undefined || value === null || value === '') return '';
    let clean = String(value).trim().replace(/\s/g, '').replace(/Kč|CZK|EUR|€/gi, '');
    if (clean.includes(',') && clean.includes('.')) clean = clean.replace(/\./g, '').replace(',', '.');
    else clean = clean.replace(',', '.');
    clean = clean.replace(/[^0-9.\-]/g, '');
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
    const us = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
    if (us) {
      const year = us[3].length === 2 ? `20${us[3]}` : us[3];
      return `${year}-${us[1].padStart(2, '0')}-${us[2].padStart(2, '0')}`;
    }
    const parsed = new Date(text);
    return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString().slice(0, 10);
  }

  function mapFuelioRows(text) {
    const tables = parseCsvTables(text);
    const vehicle = tables.find((table) => normalizeKey(table.section) === 'vehicle')?.rows?.[0] || null;
    const defaultVehicleName = normalizeText(getRowValue(vehicle || {}, ['name', 'vehicle name', 'car', 'auto', 'vozidlo']));
    const costCategoryTable = tables.find((table) => normalizeKey(table.section) === 'costcategories');
    const costCategoryMap = new Map((costCategoryTable?.rows || []).map((row) => [String(getRowValue(row, ['costtypeid', 'cost type id', 'id'])), normalizeText(getRowValue(row, ['name', 'nazev']))]).filter(([id, name]) => id && name));
    let sequence = 0;
    const mapped = tables.flatMap((table) => {
      const section = normalizeKey(table.section);
      return table.rows.map((row) => {
        let rowType = normalizeText(getRowValue(row, ['record type', 'entry type', 'type', 'category', 'kategorie', 'typ', 'zaznam', 'druh'])).toLowerCase();
        if (/^\d+(\.\d+)?$/.test(rowType)) rowType = '';
        const date = parseFuelioDate(getRowValue(row, ['date', 'data', 'datum', 'datetime', 'date time', 'time', 'timestamp', 'created at']));
        const odometer = parseCzNumber(getRowValue(row, ['odometer', 'tachometer', 'mileage', 'kilometers', 'kilometres', 'stav tachometru', 'km stav', 'km', 'odo', 'odo km']));
        const liters = parseCzNumber(getRowValue(row, ['liters', 'litres', 'fuel litres', 'fuel liters', 'liter', 'litr', 'litru', 'volume', 'fuel volume', 'quantity', 'amount fuel', 'mnozstvi', 'natankovano', 'palivo objem']));
        const unitPrice = parseCzNumber(getRowValue(row, ['unit price', 'price per unit', 'price liter', 'price per litre', 'price per liter', 'cena za litr', 'cena l', 'volumeprice', 'volume price']));
        const explicitTotal = parseCzNumber(getRowValue(row, ['total cost', 'total price', 'total', 'amount', 'cost', 'price', 'price optional', 'expense', 'cena celkem', 'celkova cena', 'celkem', 'castka', 'naklad']));
        const price = explicitTotal || (liters && unitPrice ? Number((liters * unitPrice).toFixed(2)) : '');
        const vehicleName = normalizeText(getRowValue(row, ['vehicle', 'vehicle name', 'car', 'auto', 'vozidlo', 'car name'])) || defaultVehicleName;
        const costTypeId = String(getRowValue(row, ['costtypeid', 'cost type id', 'cost category', 'category id']));
        const costCategory = costCategoryMap.get(costTypeId) || '';
        let category = normalizeText(getRowValue(row, ['category', 'type', 'kategorie', 'typ', 'expense type', 'service type', 'tag', 'tags'])) || costCategory;
        if (!/cost|expense|service|maintenance/.test(section) && /^\d+(\.\d+)?$/.test(category)) category = '';
        const titleSource = normalizeText(getRowValue(row, ['costtitle', 'cost title', 'title', 'nazev', 'name']));
        const note = normalizeText(getRowValue(row, ['note', 'notes', 'poznamka', 'description', 'comment', 'memo']));
        const station = normalizeText(getRowValue(row, ['station', 'gas station', 'fuel station', 'cerpaci stanice', 'city', 'city optional', 'place', 'location', 'misto']));
        const isCostSection = /cost|expense|service|maintenance/.test(section);
        const title = titleSource || category || note || station || (rowType.includes('fuel') || liters ? 'Tankování z Fuelio' : 'Záznam z Fuelio');
        const isServiceLike = isCostSection || /service|servis|expense|naklad|maintenance|udrzba|oprava|pneu|insurance|pojist|registrace|myti|parkovani/.test(rowType + ' ' + category + ' ' + title + ' ' + note);
        const kind = liters ? 'fuel' : price && isServiceLike ? 'service' : price && !liters ? 'service' : 'ignored';
        sequence += 1;
        return { index: sequence, kind, date, odometer, liters, price, pricePerLiter: unitPrice || (liters && price ? Number((price / liters).toFixed(2)) : ''), vehicleName, title, note: [station, note].filter(Boolean).join(' · ') };
      });
    }).filter((row) => row.kind !== 'ignored' && row.date);
    return mapped;
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
      fallbackVehicle = { id: uid(), householdId: currentHouseholdId(), profileId: currentProfileId(), createdAt: new Date().toISOString(), name: 'Fuelio import', plate: '', fuelType: '', odometer: '', technicalInspectionUntil: '', insuranceUntil: '', nextServiceKm: '', nextServiceDate: '', iconColor: 'blue', note: '' };
      state.vehicles.push(fallbackVehicle);
      rememberVehicleIconColor(fallbackVehicle);
      vehicleByName.set(normalizeKey(fallbackVehicle.name), fallbackVehicle);
    }

    let importedFuel = 0;
    let importedServices = 0;
    let skipped = 0;
    const importedIds = { fuel: [], services: [], vehicles: [] };

    fuelioPreview.rows.forEach((row) => {
      let vehicle = row.vehicleName ? vehicleByName.get(normalizeKey(row.vehicleName)) : fallbackVehicle;
      if (!vehicle && row.vehicleName) {
        vehicle = { id: uid(), householdId: currentHouseholdId(), profileId: currentProfileId(), createdAt: new Date().toISOString(), name: row.vehicleName, plate: '', fuelType: '', odometer: row.odometer || '', technicalInspectionUntil: '', insuranceUntil: '', nextServiceKm: '', nextServiceDate: '', iconColor: 'blue', note: '' };
        state.vehicles.push(vehicle);
        rememberVehicleIconColor(vehicle);
        vehicleByName.set(normalizeKey(row.vehicleName), vehicle);
        importedIds.vehicles.push(vehicle.id);
      }
      const vehicleId = vehicle?.id || fallbackVehicle.id;
      if (row.kind === 'fuel') {
        if (fuelDuplicateExists(row, vehicleId)) {
          skipped += 1;
          return;
        }
        const item = { id: uid(), householdId: currentHouseholdId(), profileId: currentProfileId(), createdAt: new Date().toISOString(), source: 'fuelio', vehicleId, date: row.date, odometer: row.odometer, liters: row.liters, price: row.price, pricePerLiter: row.pricePerLiter || '', note: row.note };
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
    vehicle.iconColor = normalizeVehicleIconColor(data.iconColor || vehicle.iconColor);
    vehicle.note = normalizeText(data.note);
    rememberVehicleIconColor(vehicle);
    const ok = await cloudUpdateVehicle(vehicle);
    if (!ok) return;
    touchState();
    saveState();
    if (cloudReady()) await cloudSaveHouseholdUiSettings(false);
    render();
    showToast(vehicle.cloudId ? 'Údaje auta uloženy v cloudu' : 'Údaje auta uloženy lokálně');
  }


  async function updateFuelLog(id, data) {
    const item = state.fuel.find((entry) => entry.id === id);
    if (!item) return showToast('Tankování nenalezeno');
    item.date = normalizeText(data.date) || item.date;
    item.odometer = normalizeText(data.odometer);
    const fuelParts = normalizeFuelCostParts(data);
    item.liters = fuelParts.liters;
    item.price = fuelParts.price;
    item.pricePerLiter = fuelParts.pricePerLiter;
    item.note = normalizeText(data.note);
    item.updatedAt = new Date().toISOString();
    const ok = await cloudUpdateFuelLog(item);
    if (!ok) return;
    garageEditRecord = null;
    garageModal = null;
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
    garageModal = null;
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
    if (!client) { if (showMessage) showToast('Supabase knihovna není načtená'); return null; }
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
    if (!user) { if (showMessage) showToast('Nejdřív se přihlas'); return null; }

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
        iconColor: normalizeVehicleIconColor(existing?.iconColor || vehicleIconColorFromSettings({ cloudId: vehicle.id, name: vehicle.name })),
        note: vehicle.note || ''
      };
    });
    const vehicleIdByCloud = new Map(cloudVehicles.map((vehicle) => [vehicle.cloudId, vehicle.id]));
    const localVehicles = state.vehicles.filter((vehicle) => !vehicle.cloudId);
    state.vehicles = [...localVehicles, ...cloudVehicles];
    refreshVehicleIconColorSettings();

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
        pricePerLiter: item.price_per_liter === null || item.price_per_liter === undefined ? '' : Number(item.price_per_liter),
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
          rememberVehicleIconColor(vehicle);
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
    refreshVehicleIconColorSettings();
    touchState();
    saveState();
    if (cloudReady()) await cloudSaveHouseholdUiSettings(false);
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
          rememberVehicleIconColor(vehicle);
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
    refreshVehicleIconColorSettings();
    touchState();
    saveState();
    if (cloudReady()) await cloudSaveHouseholdUiSettings(false);
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



  function pad2(value) {
    return String(value).padStart(2, '0');
  }

  function lastSundayIso(year, monthIndex) {
    const date = new Date(Date.UTC(year, monthIndex + 1, 0));
    date.setUTCDate(date.getUTCDate() - date.getUTCDay());
    return date.toISOString().slice(0, 10);
  }

  function pragueOffsetForLocalDateTime(date, time = '00:00') {
    const cleanDate = String(date || todayISO()).slice(0, 10);
    const cleanTime = String(time || '00:00').slice(0, 5);
    const year = Number(cleanDate.slice(0, 4));
    if (!Number.isFinite(year)) return '+01:00';
    const dstStart = lastSundayIso(year, 2);
    const dstEnd = lastSundayIso(year, 9);
    if (cleanDate > dstStart && cleanDate < dstEnd) return '+02:00';
    if (cleanDate === dstStart && cleanTime >= '02:00') return '+02:00';
    if (cleanDate === dstEnd && cleanTime < '03:00') return '+02:00';
    return '+01:00';
  }

  function buildCalendarDateTime(date, time, fallbackTime = '00:00') {
    const d = String(date || todayISO()).slice(0, 10);
    const t = String(time || fallbackTime || '00:00').slice(0, 5);
    return `${d}T${t}:00${pragueOffsetForLocalDateTime(d, t)}`;
  }

  function zonedDateTimeParts(value, timeZone = APP_TIME_ZONE) {
    const date = toSafeDate(value);
    if (!date) return { date: '', time: '' };
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    }).formatToParts(date).reduce((acc, part) => {
      if (part.type !== 'literal') acc[part.type] = part.value;
      return acc;
    }, {});
    return {
      date: `${parts.year}-${parts.month}-${parts.day}`,
      time: `${parts.hour}:${parts.minute}`
    };
  }

  function splitCalendarDateTime(value, options = {}) {
    if (!value) return { date: '', time: '' };
    const text = String(value);
    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return { date: text, time: '' };
    const hasExplicitZone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(text);
    if (hasExplicitZone) {
      const parts = zonedDateTimeParts(text, APP_TIME_ZONE);
      return { date: parts.date, time: options.allDay ? '' : parts.time };
    }
    return { date: text.slice(0, 10), time: options.allDay ? '' : (text.length >= 16 ? text.slice(11, 16) : '') };
  }

  function normalizeCalendarType(value) {
    const map = { rodina: 'family', prace: 'event', domacnost: 'event', ostatni: 'other' };
    const next = map[value] || value || 'event';
    return ['event', 'shift', 'family', 'reminder', 'holiday', 'other'].includes(next) ? next : 'event';
  }

  function cloudCalendarPayload(event, userId, sourceId = null) {
    const start = buildCalendarDateTime(event.date, event.time, '00:00');
    const end = event.endTime ? buildCalendarDateTime(event.date, event.endTime, event.time || '00:00') : null;
    return {
      household_id: state.cloud.householdId,
      source_id: sourceId || event.sourceId || null,
      profile_id: event.profileId && String(event.profileId).startsWith('profile-') ? null : event.profileId || null,
      title: event.title || 'Událost',
      description: event.note || null,
      location: event.location || null,
      starts_at: start,
      ends_at: end,
      all_day: !event.time,
      event_type: normalizeCalendarType(event.type),
      status: 'confirmed',
      visibility: 'household',
      created_by: event.cloudId ? undefined : userId,
      updated_by: userId
    };
  }

  async function cloudLoadCalendarSources(showMessage = false) {
    const client = getSupabaseClient();
    if (!client || !state.cloud?.householdId) {
      if (showMessage) showToast('Nejdřív napoj domácnost na cloud');
      return [];
    }
    const { data, error } = await client
      .from('calendar_sources')
      .select('id,household_id,profile_id,name,provider,provider_calendar_id,provider_connection_id,color,is_enabled,sync_enabled,last_synced_at,note,created_at')
      .eq('household_id', state.cloud.householdId)
      .order('created_at', { ascending: true });
    if (error) {
      if (showMessage) showToast(error.message || 'Zdroje kalendáře se nepovedlo načíst');
      return getCalendarSources();
    }
    const sources = (data || []).map(mapCalendarSource);
    state.calendarCloud = {
      ...(state.calendarCloud || {}),
      sources,
      sourcesLoadedAt: new Date().toISOString()
    };
    touchState();
    saveState();
    if (showMessage) {
      render();
      showToast('Zdroje kalendáře načtené');
    }
    return sources;
  }

  async function ensureManualCalendarSource() {
    const client = getSupabaseClient();
    if (!client || !state.cloud?.householdId) return null;
    let sources = getCalendarSources();
    let cached = sources.find((source) => source.provider === 'manual' && source.isEnabled !== false);
    if (cached?.id) return cached.id;
    if (!sources.length) sources = await cloudLoadCalendarSources(false);
    cached = sources.find((source) => source.provider === 'manual' && source.isEnabled !== false);
    if (cached?.id) return cached.id;
    const user = await refreshCloudSession(false);
    if (!user) return null;
    const { data: existing, error: existingError } = await client
      .from('calendar_sources')
      .select('id,household_id,profile_id,name,provider,provider_calendar_id,provider_connection_id,color,is_enabled,sync_enabled,last_synced_at,note,created_at')
      .eq('household_id', state.cloud.householdId)
      .eq('provider', 'manual')
      .limit(1);
    if (existingError) {
      showToast(existingError.message || 'Zdroj kalendáře se nepovedlo načíst');
      return null;
    }
    if (existing?.[0]?.id) {
      const source = mapCalendarSource(existing[0]);
      state.calendarCloud = { ...(state.calendarCloud || {}), sources: mergeCalendarSources(getCalendarSources(), [source]) };
      return source.id;
    }
    const { data, error } = await client.from('calendar_sources').insert({
      household_id: state.cloud.householdId,
      name: 'Ruční kalendář',
      provider: 'manual',
      is_enabled: true,
      sync_enabled: false,
      created_by: user.id,
      updated_by: user.id
    }).select('id,household_id,profile_id,name,provider,provider_calendar_id,provider_connection_id,color,is_enabled,sync_enabled,last_synced_at,note,created_at').single();
    if (error) {
      showToast(error.message || 'Zdroj kalendáře se nepovedlo vytvořit');
      return null;
    }
    const source = mapCalendarSource(data);
    state.calendarCloud = { ...(state.calendarCloud || {}), sources: mergeCalendarSources(getCalendarSources(), [source]) };
    return source.id;
  }

  function mergeCalendarSources(current = [], incoming = []) {
    const map = new Map();
    [...current, ...incoming].forEach((source) => {
      const normalized = mapCalendarSource(source);
      const key = String(normalized.id || normalized.cloudId || normalized.name);
      map.set(key, normalized);
    });
    return [...map.values()].sort((a, b) => String(a.createdAt || '').localeCompare(String(b.createdAt || '')));
  }

  async function addCalendarSourceFromForm(data, form) {
    const source = mapCalendarSource({
      id: uid(),
      householdId: currentHouseholdId(),
      profileId: currentProfileId(),
      name: normalizeText(data.name),
      provider: normalizeCalendarSourceProvider(data.provider),
      providerCalendarId: normalizeText(data.providerCalendarId),
      color: normalizeText(data.color),
      isEnabled: true,
      syncEnabled: normalizeCalendarSourceProvider(data.provider) === 'google',
      note: normalizeText(data.note),
      createdAt: new Date().toISOString()
    });
    if (!source.name) return showToast('Doplň název kalendáře');
    const saved = await cloudAddCalendarSource(source);
    if (saved?.id) {
      source.id = saved.id;
      source.cloudId = saved.id;
    }
    state.calendarCloud = { ...(state.calendarCloud || {}), sources: mergeCalendarSources(getCalendarSources(), [source]) };
    touchState();
    saveState();
    form.reset();
    render();
    const google = source.provider === 'google';
    showToast(saved?.id ? (google ? 'Google zdroj připravený v cloudu' : 'Zdroj kalendáře uložen do cloudu') : 'Zdroj kalendáře uložen lokálně');
  }

  async function cloudAddCalendarSource(source) {
    const client = getSupabaseClient();
    if (!client || !state.cloud?.householdId) return null;
    const user = await refreshCloudSession(false);
    if (!user) return null;
    const payload = {
      household_id: state.cloud.householdId,
      profile_id: source.profileId && String(source.profileId).startsWith('profile-') ? null : source.profileId || null,
      name: source.name || 'Kalendář',
      provider: normalizeCalendarSourceProvider(source.provider),
      provider_calendar_id: source.providerCalendarId || null,
      color: source.color || null,
      is_enabled: source.isEnabled !== false,
      sync_enabled: normalizeCalendarSourceProvider(source.provider) === 'google' ? source.syncEnabled !== false : Boolean(source.syncEnabled),
      note: source.note || null,
      created_by: user.id,
      updated_by: user.id
    };
    const { data, error } = await client
      .from('calendar_sources')
      .insert(payload)
      .select('id,household_id,profile_id,name,provider,provider_calendar_id,provider_connection_id,color,is_enabled,sync_enabled,last_synced_at,note,created_at')
      .single();
    if (error) {
      showToast(error.message || 'Zdroj kalendáře se nepovedlo uložit do cloudu');
      return null;
    }
    return data;
  }


  async function cloudSyncLocalCalendarSources(showMessage = false) {
    if (!cloudReady()) return 0;
    const localSources = getCalendarSources().filter((source) => !source.cloudId);
    if (!localSources.length) {
      if (showMessage) showToast('Žádné lokální zdroje kalendáře k odeslání');
      return 0;
    }
    let count = 0;
    const savedSources = [];
    for (const source of localSources) {
      try {
        const saved = await cloudAddCalendarSource(source);
        if (saved?.id) {
          source.id = saved.id;
          source.cloudId = saved.id;
          savedSources.push(mapCalendarSource(saved));
          count += 1;
        }
      } catch (error) {
        console.warn('Cloud calendar source sync failed', error);
      }
    }
    state.calendarCloud = { ...(state.calendarCloud || {}), sources: mergeCalendarSources(getCalendarSources(), savedSources) };
    touchState();
    saveState();
    if (showMessage) showToast(`Odesláno zdrojů kalendáře: ${count}`);
    return count;
  }

  function normalizeGoogleCalendarItem(item = {}) {
    return {
      id: String(item.id || item.calendarId || ''),
      summary: item.summary || item.name || 'Google kalendář',
      description: item.description || '',
      primary: Boolean(item.primary),
      accessRole: item.accessRole || item.access_role || '',
      backgroundColor: item.backgroundColor || item.background_color || '',
      foregroundColor: item.foregroundColor || item.foreground_color || '',
      selected: Boolean(item.selected)
    };
  }


  function rememberGoogleCalendarError(payload = {}) {
    state.calendarCloud = {
      ...(state.calendarCloud || {}),
      googleLastError: {
        code: payload.code || payload.errorCode || '',
        message: payload.error || payload.message || '',
        at: new Date().toISOString(),
        needsOAuthReconnect: Boolean(payload.needsOAuthReconnect || payload.needsGoogleLogin || payload.fallbackAvailable)
      }
    };
    touchState();
    saveState();
  }

  function googleCalendarNeedsOAuthReconnect(payload = {}) {
    const code = String(payload.code || payload.errorCode || payload.reason || '').toLowerCase();
    const message = String(payload.error || payload.message || '').toLowerCase();
    return Boolean(payload.needsOAuthReconnect || payload.needsGoogleLogin || payload.fallbackAvailable)
      || ['missing_provider_token', 'missing_google_token', 'google_token_missing', 'token_not_available', 'missing_calendar_scope', 'token_store_failed'].includes(code)
      || message.includes('google token is not available')
      || message.includes('chybí google token')
      || message.includes('nepředalo kalendářový token');
  }

  function markGoogleCalendarMissingToken(message = 'Google účet je přihlášený, ale kalendářový token chybí.') {
    state.calendarCloud = {
      ...(state.calendarCloud || {}),
      googleConnection: {
        ...(state.calendarCloud?.googleConnection || {}),
        status: 'error',
        tokenState: 'missing',
        lastError: message
      }
    };
    touchState();
    saveState();
  }

  async function startGoogleCalendarOAuthReconnect(reason = '', { force = false } = {}) {
    const attempted = sessionStorage.getItem(GOOGLE_CALENDAR_RECONNECT_FLAG) === '1';
    if (attempted && !force) {
      showToast('Automatické znovupřipojení už proběhlo. Další pokus spusť ručně tlačítkem Znovu připojit Google kalendář.');
      return false;
    }
    sessionStorage.setItem(GOOGLE_CALENDAR_RECONNECT_FLAG, '1');
    showToast(reason || 'Spouštím čisté znovupřipojení Google kalendáře.');
    await googleCalendarStart({ cleanup: true });
    return true;
  }

  async function readFunctionErrorMessage(error, fallback = 'Google backend zatím není připravený') {
    if (!error) return fallback;
    const context = error.context;
    try {
      if (context?.clone && typeof context.clone === 'function') {
        const cloned = context.clone();
        const body = await cloned.json().catch(() => null);
        const message = body?.error || body?.message || body?.hint;
        if (message) return message;
      }
      if (context?.json && typeof context.json === 'function') {
        const body = await context.json().catch(() => null);
        const message = body?.error || body?.message || body?.hint;
        if (message) return message;
      }
      if (context?.text && typeof context.text === 'function') {
        const text = await context.text().catch(() => '');
        if (text) return text.slice(0, 220);
      }
    } catch (_) {
      // Supabase FunctionsHttpError nemusí vždy dovolit přečíst body odpovědi.
    }
    return error.message || fallback;
  }

  async function invokeGoogleCalendarFunction(functionName, body = {}, showMessage = true) {
    const client = getSupabaseClient();
    if (!client?.functions?.invoke) {
      if (showMessage) showToast('Supabase funkce nejsou dostupné');
      return null;
    }
    const user = await refreshCloudSession(false);
    if (!user) {
      if (showMessage) showToast('Nejdřív se přihlas');
      return null;
    }
    let households = await cloudLoadHouseholds(false);
    if (!households.length) {
      resetLocalWorkspaceForCloudUser(user, { force: true });
      const createdHouseholdId = await bootstrapCloudHousehold(false);
      if (!createdHouseholdId) {
        if (showMessage) showToast('Nejdřív vytvoř domácnost pro tento Google účet');
        return null;
      }
      households = await cloudLoadHouseholds(false);
    }
    if (!cloudReady()) {
      if (showMessage) showToast('Google účet zatím nemá aktivní domácnost');
      return null;
    }
    const payload = {
      householdId: state.cloud.householdId,
      profileId: currentProfileId(),
      ...body
    };
    try {
      const { data, error } = await client.functions.invoke(functionName, { body: payload });
      if (error || data?.error || data?.ok === false) {
        const payloadError = data || {};
        const message = payloadError?.error || payloadError?.message || await readFunctionErrorMessage(error, 'Google backend zatím není připravený');
        console.warn(`${functionName} failed`, error || payloadError?.error || payloadError);
        rememberGoogleCalendarError({ ...payloadError, error: message });
        if (showMessage) showToast(message);
        return null;
      }
      return data || {};
    } catch (error) {
      console.warn(`${functionName} failed`, error);
      const message = await readFunctionErrorMessage(error, 'Google backend zatím není nasazený nebo nemá credentials');
      if (showMessage) showToast(message);
      return null;
    }
  }

  async function googleCalendarStart(options = {}) {
    const data = await invokeGoogleCalendarFunction('google-calendar-start', { returnTo: APP_PUBLIC_URL, cleanup: options.cleanup !== false }, true);
    if (data?.connection) {
      state.calendarCloud = { ...(state.calendarCloud || {}), googleConnection: data.connection, googleLastError: null };
      touchState();
      saveState();
    }
    if (data?.authUrl) {
      window.location.href = data.authUrl;
      return;
    }
    showToast('Nepřišla OAuth adresa. Zkontroluj Edge Function secrets.');
  }

  async function googleCalendarListCalendars(showMessage = true) {
    const data = await invokeGoogleCalendarFunction('google-calendar-list-calendars', {}, showMessage);
    if (!data) {
      const lastError = state.calendarCloud?.googleLastError || {};
      if (googleCalendarNeedsOAuthReconnect(lastError)) {
        markGoogleCalendarMissingToken(lastError.message || lastError.error || 'Google účet je vidět, ale kalendářový token chybí.');
        render();
        if (showMessage) showToast('Kalendářový token chybí. Použij tlačítko Znovu připojit Google kalendář.');
      }
      return [];
    }
    const calendars = (data.calendars || data.items || []).map(normalizeGoogleCalendarItem).filter((calendar) => calendar.id);
    state.calendarCloud = {
      ...(state.calendarCloud || {}),
      googleConnection: data.connection ? { ...data.connection, tokenState: data.connection.tokenState || 'ready' } : state.calendarCloud?.googleConnection || null,
      googleCalendars: calendars,
      googleCalendarsLoadedAt: new Date().toISOString(),
      googleLastError: null
    };
    touchState();
    saveState();
    sessionStorage.removeItem(GOOGLE_CALENDAR_CALLBACK_AUTOLOAD_FLAG);
    render();
    if (showMessage) showToast(calendars.length ? `Načteno Google kalendářů: ${calendars.length}` : 'Google účet nemá dostupné kalendáře');
    return calendars;
  }

  async function saveGoogleCalendarSourcesFromForm(form) {
    if (!form) return;
    const checkedIds = [...form.querySelectorAll('input[name="googleCalendarIds"]:checked')].map((input) => input.value);
    if (!checkedIds.length) return showToast('Vyber aspoň jeden Google kalendář');
    const calendars = googleCalendarItems().filter((calendar) => checkedIds.includes(calendar.id));
    const data = await invokeGoogleCalendarFunction('google-calendar-save-sources', { calendars }, true);
    if (!data) return;
    const savedSources = (data.sources || []).map(mapCalendarSource);
    state.calendarCloud = {
      ...(state.calendarCloud || {}),
      sources: mergeCalendarSources(getCalendarSources(), savedSources),
      googleConnection: data.connection || state.calendarCloud?.googleConnection || null
    };
    touchState();
    saveState();
    render();
    showToast(savedSources.length ? `Uloženo Google kalendářů: ${savedSources.length}` : 'Výběr Google kalendářů uložen');
  }

  async function googleCalendarSync(sourceId = '') {
    const cleanSourceId = normalizeText(sourceId);
    let sources = getCalendarSources();
    if (!sources.length && state.cloud?.householdId) sources = await cloudLoadCalendarSources(false);
    const googleSources = sources.filter((source) => normalizeCalendarSourceProvider(source.provider) === 'google' && source.isEnabled !== false);
    const body = {};

    if (cleanSourceId) {
      const source = getCalendarSource(cleanSourceId) || googleSources.find((item) => [item.id, item.cloudId].filter(Boolean).map(String).includes(cleanSourceId));
      if (!source || normalizeCalendarSourceProvider(source.provider) !== 'google') return showToast('Google kalendář nenalezen');
      body.sourceId = source.cloudId || source.id;
      body.sourceIds = [source.cloudId || source.id].filter(Boolean);
      body.calendarIds = [source.providerCalendarId].filter(Boolean);
    } else if (googleSources.length) {
      body.sourceIds = googleSources.map((source) => source.cloudId || source.id).filter(Boolean);
      body.calendarIds = googleSources.map((source) => source.providerCalendarId).filter(Boolean);
    }

    const data = await invokeGoogleCalendarFunction('google-calendar-sync', body, true);
    if (!data) return;
    const syncedSources = (data.sources || []).map(mapCalendarSource);
    state.calendarCloud = {
      ...(state.calendarCloud || {}),
      sources: syncedSources.length ? mergeCalendarSources(getCalendarSources(), syncedSources) : getCalendarSources(),
      googleConnection: data.connection || state.calendarCloud?.googleConnection || null,
      googleLastSyncAt: new Date().toISOString()
    };
    await cloudLoadCalendar(false);
    render();
    showToast(`Google sync hotový${Number.isFinite(data.eventsUpserted) ? ` · ${data.eventsUpserted} událostí` : ''}`);
  }

  async function googleCalendarDisconnect() {
    const data = await invokeGoogleCalendarFunction('google-calendar-disconnect', {}, true);
    if (!data) return;
    state.calendarCloud = {
      ...(state.calendarCloud || {}),
      googleConnection: data.connection || { ...(state.calendarCloud?.googleConnection || {}), status: 'disconnected' },
      googleCalendars: []
    };
    await cloudLoadCalendarSources(false);
    render();
    showToast('Google kalendář odpojený');
  }

  async function toggleCalendarSource(sourceId, enabled) {
    const source = getCalendarSource(sourceId);
    if (!source) return showToast('Zdroj kalendáře nenalezen');
    const nextEnabled = enabled !== undefined ? enabled : source.isEnabled === false;
    source.isEnabled = Boolean(nextEnabled);
    const client = getSupabaseClient();
    if (client && state.cloud?.householdId && source.cloudId) {
      const user = await refreshCloudSession(false);
      const { error } = await client
        .from('calendar_sources')
        .update({ is_enabled: source.isEnabled, updated_by: user?.id || undefined })
        .eq('id', source.cloudId)
        .eq('household_id', state.cloud.householdId);
      if (error) {
        showToast(error.message || 'Zdroj kalendáře se nepovedlo upravit');
        return;
      }
    }
    state.calendarCloud = { ...(state.calendarCloud || {}), sources: mergeCalendarSources(getCalendarSources(), [source]) };
    touchState();
    saveState();
    render();
    showToast(source.isEnabled ? 'Kalendář zobrazen' : 'Kalendář skrytý');
  }

  async function deleteCalendarSource(sourceId) {
    const source = getCalendarSource(sourceId);
    if (!source) return showToast('Zdroj kalendáře nenalezen');
    const label = source.name || 'kalendář';
    const ok = window.confirm(`Odebrat kalendář „${label}“ a jeho události z Domácnost+?`);
    if (!ok) return;

    const sourceKeys = [source.id, source.cloudId].filter(Boolean).map(String);
    const client = getSupabaseClient();
    if (client && state.cloud?.householdId && source.cloudId) {
      const { error: eventsError } = await client
        .from('calendar_events')
        .delete()
        .eq('source_id', source.cloudId)
        .eq('household_id', state.cloud.householdId);
      if (eventsError) {
        showToast(eventsError.message || 'Události kalendáře se nepovedlo odebrat');
        return;
      }
      const { error } = await client
        .from('calendar_sources')
        .delete()
        .eq('id', source.cloudId)
        .eq('household_id', state.cloud.householdId);
      if (error) {
        showToast(error.message || 'Kalendář se nepovedlo odebrat');
        return;
      }
    }

    state.calendarCloud = {
      ...(state.calendarCloud || {}),
      sources: getCalendarSources().filter((item) => !sourceKeys.includes(String(item.id || '')) && !sourceKeys.includes(String(item.cloudId || ''))),
      sourcesLoadedAt: new Date().toISOString()
    };
    state.calendar = (state.calendar || []).filter((event) => !sourceKeys.includes(String(event.sourceId || '')));
    if (state.calendarCloud?.googleCalendars?.length && source.providerCalendarId) {
      state.calendarCloud.googleCalendars = state.calendarCloud.googleCalendars.map((calendar) => String(calendar.id || '') === String(source.providerCalendarId) ? { ...calendar, selected: false } : calendar);
    }
    if (state.cloud) state.cloud.lastSyncAt = new Date().toISOString();
    touchState();
    saveState();
    render();
    showToast('Kalendář odebraný');
  }

  async function cloudAddCalendarEvent(event) {
    const client = getSupabaseClient();
    if (!client || !state.cloud?.householdId) return null;
    const user = await refreshCloudSession(false);
    if (!user) return null;
    let sourceId = event.sourceId || '';
    let source = getCalendarSource(sourceId);
    if (source && !source.cloudId) {
      const savedSource = await cloudAddCalendarSource(source);
      if (savedSource?.id) {
        source.cloudId = savedSource.id;
        source.id = savedSource.id;
        sourceId = savedSource.id;
        state.calendarCloud = { ...(state.calendarCloud || {}), sources: mergeCalendarSources(getCalendarSources(), [source, mapCalendarSource(savedSource)]) };
      }
    }
    source = getCalendarSource(sourceId);
    if (source?.cloudId) sourceId = source.cloudId;
    if (sourceId === 'manual' || !sourceId || !getCalendarSource(sourceId)) {
      sourceId = await ensureManualCalendarSource();
    }
    const { data, error } = await client.from('calendar_events').insert(cloudCalendarPayload(event, user.id, sourceId)).select('id,source_id').single();
    if (error) {
      showToast(error.message || 'Událost se nepovedlo uložit do cloudu');
      return null;
    }
    event.cloudId = data.id;
    event.sourceId = data.source_id || sourceId || '';
    state.cloud.lastSyncAt = new Date().toISOString();
    return data;
  }

  async function cloudDeleteCalendarEvent(event) {
    const client = getSupabaseClient();
    if (!client || !event?.cloudId || !state.cloud?.householdId) return true;
    const { error } = await client.from('calendar_events').delete().eq('id', event.cloudId).eq('household_id', state.cloud.householdId);
    if (error) {
      showToast(error.message || 'Cloud událost se nepovedlo smazat');
      return false;
    }
    state.cloud.lastSyncAt = new Date().toISOString();
    return true;
  }

  async function cloudLoadCalendar(showMessage = true) {
    const client = getSupabaseClient();
    if (!client || !state.cloud?.householdId) {
      if (showMessage) showToast('Nejdřív napoj domácnost na cloud');
      return false;
    }
    await cloudLoadCalendarSources(false);
    const { data, error } = await client
      .from('calendar_events')
      .select('id,source_id,title,description,location,starts_at,ends_at,all_day,event_type,created_at')
      .eq('household_id', state.cloud.householdId)
      .neq('status', 'cancelled')
      .order('starts_at', { ascending: true });
    if (error) {
      showToast(error.message || 'Kalendář se nepovedlo načíst');
      return false;
    }
    const localOnly = state.calendar.filter((event) => !event.cloudId);
    const cloudItems = (data || []).map((item) => {
      const start = splitCalendarDateTime(item.starts_at, { allDay: item.all_day });
      const end = splitCalendarDateTime(item.ends_at, { allDay: item.all_day });
      return {
        id: state.calendar.find((event) => event.cloudId === item.id)?.id || `event-cloud-${item.id}`,
        cloudId: item.id,
        sourceId: item.source_id || '',
        householdId: currentHouseholdId(),
        profileId: currentProfileId(),
        createdAt: item.created_at || new Date().toISOString(),
        title: item.title || 'Událost',
        date: start.date,
        time: item.all_day ? '' : start.time,
        endTime: end.time || '',
        type: normalizeCalendarType(item.event_type),
        location: item.location || '',
        note: item.description || ''
      };
    });
    state.calendar = [...cloudItems, ...localOnly];
    state.calendarCloud = { ...(state.calendarCloud || {}), loadedAt: new Date().toISOString(), sourcesLoadedAt: state.calendarCloud?.sourcesLoadedAt || new Date().toISOString() };
    touchState();
    saveState();
    render();
    if (showMessage) showToast('Cloud kalendář načten');
    return true;
  }

  async function cloudSyncCalendarById(id) {
    const event = state.calendar.find((entry) => entry.id === id);
    if (!event) return;
    await cloudAddCalendarEvent(event);
    touchState();
    saveState();
    render();
    showToast(event.cloudId ? 'Událost odeslána do cloudu' : 'Událost zůstala lokálně');
  }

  async function cloudSyncLocalCalendar() {
    const local = state.calendar.filter((event) => !event.cloudId);
    if (!local.length) return showToast('Žádné lokální události k odeslání');
    let count = 0;
    for (const event of local) {
      const saved = await cloudAddCalendarEvent(event);
      if (saved?.id) count += 1;
    }
    touchState();
    saveState();
    render();
    showToast(`Odesláno událostí: ${count}`);
  }

  async function addEventFromForm(data, form) {
    const event = {
      id: uid(),
      householdId: currentHouseholdId(),
      profileId: currentProfileId(),
      createdAt: new Date().toISOString(),
      title: normalizeText(data.title),
      date: normalizeText(data.date),
      time: normalizeText(data.time),
      endTime: normalizeText(data.endTime),
      type: normalizeCalendarType(data.type),
      sourceId: normalizeText(data.sourceId) || 'manual',
      location: normalizeText(data.location),
      note: normalizeText(data.note)
    };
    if (!event.title || !event.date) return showToast('Doplň název a datum');
    const saved = await cloudAddCalendarEvent(event);
    if (saved?.id) event.cloudId = saved.id;
    state.calendar.push(event);
    touchState();
    saveState();
    form.reset();
    render();
    showToast(event.cloudId ? 'Událost uložena do cloudu' : 'Událost uložena lokálně');
  }

  async function deleteCalendarEvent(id) {
    const event = state.calendar.find((entry) => entry.id === id);
    if (!event) return;
    const ok = await cloudDeleteCalendarEvent(event);
    if (!ok) return;
    state.calendar = state.calendar.filter((entry) => entry.id !== id);
    touchState();
    saveState();
    render();
    showToast('Událost smazána');
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
      .select('id,title,note')
      .eq('household_id', state.cloud.householdId)
      .maybeSingle();
    if (settingsError) {
      showToast(settingsError.message || 'HDO nastavení se nepovedlo načíst');
      return;
    }
    if (settings?.id) {
      state.hdoCloud = {
        ...(state.hdoCloud || {}),
        settingId: settings.id,
        loadedAt: new Date().toISOString()
      };
    }
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

  function normalizeHdoTimeInput(value) {
    const raw = normalizeText(value).replace(/\s+/g, '');
    if (!raw) return '';
    const colon = raw.match(/^(\d{1,2}):(\d{1,2})$/);
    if (colon) {
      const h = Number(colon[1]);
      const m = Number(colon[2]);
      if (h >= 0 && h <= 23 && m >= 0 && m <= 59) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }
    const digits = raw.replace(/\D/g, '');
    if (digits.length === 3 || digits.length === 4) {
      const h = Number(digits.slice(0, -2));
      const m = Number(digits.slice(-2));
      if (h >= 0 && h <= 23 && m >= 0 && m <= 59) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }
    if (digits.length <= 2) {
      const h = Number(digits);
      if (h >= 0 && h <= 23) return `${String(h).padStart(2, '0')}:00`;
    }
    return '';
  }

  function formatHdoTimeInputLive(input, event = {}) {
    if (!input) return;
    const raw = String(input.value || '');
    if (!raw) return;
    if (raw.includes(':')) {
      const [h = '', m = ''] = raw.split(':');
      input.value = `${h.replace(/\D/g, '').slice(0, 2)}:${m.replace(/\D/g, '').slice(0, 2)}`;
      return;
    }
    const digits = raw.replace(/\D/g, '').slice(0, 4);
    if (!digits) {
      input.value = '';
      return;
    }
    if (digits.length === 2 && !String(event.inputType || '').startsWith('delete')) {
      input.value = `${digits}:`;
      return;
    }
    if (digits.length > 2) {
      input.value = `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
      return;
    }
    input.value = digits;
  }

  function normalizeHdoTimeInputOnBlur(input) {
    if (!input) return;
    const normalized = normalizeHdoTimeInput(input.value);
    if (normalized) input.value = normalized;
  }


  async function addWarrantyFromForm(data, form) {
    const purchaseDate = normalizeText(data.purchaseDate) || todayISO();
    const item = normalizeWarrantyItem({
      id: uid(),
      householdId: currentHouseholdId(),
      profileId: currentProfileId(),
      createdAt: new Date().toISOString(),
      name: data.name,
      store: data.store,
      category: data.category,
      price: decimalValue(data.price) || '',
      purchaseDate,
      warrantyUntil: normalizeText(data.warrantyUntil) || addYearsIso(purchaseDate, 2),
      status: data.status || 'active',
      note: data.note
    });
    state.warranties = normalizeWarranties([...(state.warranties || []), item]);
    touchState();
    saveState();
    if (cloudReady()) await cloudSaveHouseholdUiSettings(false);
    form?.reset();
    const purchase = form?.querySelector?.('[name="purchaseDate"]');
    const until = form?.querySelector?.('[name="warrantyUntil"]');
    if (purchase) purchase.value = todayISO();
    if (until) until.value = addYearsIso(todayISO(), 2);
    render();
    showToast('Záruka uložena');
  }

  async function deleteWarranty(id) {
    const before = (state.warranties || []).length;
    state.warranties = normalizeWarranties(state.warranties).filter((item) => item.id !== id);
    if (state.warranties.length === before) return;
    touchState();
    saveState();
    if (cloudReady()) await cloudSaveHouseholdUiSettings(false);
    render();
    showToast('Záruka smazána');
  }

  async function addHdoWindowFromForm(data, form) {
    const start = normalizeHdoTimeInput(data.start);
    const end = normalizeHdoTimeInput(data.end);
    if (!start || !end) return showToast('Zadej čas HDO jako 0600 nebo 06:00');
    const item = {
      id: uid(),
      householdId: currentHouseholdId(),
      profileId: currentProfileId(),
      createdAt: new Date().toISOString(),
      label: normalizeText(data.label),
      start,
      end,
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


  function normalizeTaskCategory(value) {
    const valid = new Set(TASK_CATEGORY_OPTIONS.map(([key]) => key));
    return valid.has(value) ? value : 'domacnost';
  }

  function normalizeTaskPriority(value) {
    const valid = new Set(TASK_PRIORITY_OPTIONS.map(([key]) => key));
    return valid.has(value) ? value : 'normal';
  }

  function taskCategoryLabel(value) {
    return TASK_CATEGORY_OPTIONS.find(([key]) => key === value)?.[1] || 'Domácnost';
  }

  function taskPriorityLabel(value) {
    return TASK_PRIORITY_OPTIONS.find(([key]) => key === value)?.[1] || 'Normální';
  }

  function cloudTaskPayload(task, userId) {
    return {
      household_id: state.cloud.householdId,
      profile_id: null,
      assigned_profile_id: null,
      title: task.title || 'Úkol',
      description: task.note || null,
      category: normalizeTaskCategory(task.category),
      priority: normalizeTaskPriority(task.priority),
      status: task.done ? 'done' : 'open',
      due_date: task.due || null,
      due_at: null,
      repeat_rule: 'none',
      repeat_interval: 1,
      notify_before_minutes: 60,
      completed_at: task.done ? (task.completedAt || new Date().toISOString()) : null,
      completed_by_profile_id: null,
      created_by: userId,
      updated_by: userId
    };
  }

  async function cloudAddTask(task) {
    const client = getSupabaseClient();
    if (!client || !state.cloud?.householdId) return null;
    const user = await refreshCloudSession(false);
    if (!user) return null;
    const { data, error } = await client.from('household_tasks').insert(cloudTaskPayload(task, user.id)).select('id').single();
    if (error) {
      showToast(error.message || 'Úkol se nepovedlo uložit do cloudu');
      return null;
    }
    task.cloudId = data.id;
    state.cloud.lastSyncAt = new Date().toISOString();
    return data;
  }

  async function cloudUpdateTask(task) {
    const client = getSupabaseClient();
    if (!client || !task?.cloudId || !state.cloud?.householdId) return true;
    const user = await refreshCloudSession(false);
    if (!user) return false;
    const { error } = await client
      .from('household_tasks')
      .update(cloudTaskPayload(task, user.id))
      .eq('id', task.cloudId)
      .eq('household_id', state.cloud.householdId);
    if (error) {
      showToast(error.message || 'Úkol se nepovedlo upravit v cloudu');
      return false;
    }
    state.cloud.lastSyncAt = new Date().toISOString();
    return true;
  }

  async function cloudDeleteTask(task) {
    const client = getSupabaseClient();
    if (!client || !task?.cloudId || !state.cloud?.householdId) return true;
    const { error } = await client.from('household_tasks').delete().eq('id', task.cloudId).eq('household_id', state.cloud.householdId);
    if (error) {
      showToast(error.message || 'Úkol se nepovedlo smazat v cloudu');
      return false;
    }
    state.cloud.lastSyncAt = new Date().toISOString();
    return true;
  }

  async function cloudLoadTasks(showMessage = true) {
    const client = getSupabaseClient();
    if (!client || !state.cloud?.householdId) return false;
    const { data, error } = await client
      .from('household_tasks')
      .select('*')
      .eq('household_id', state.cloud.householdId)
      .order('status', { ascending: false })
      .order('due_date', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false });
    if (error) {
      showToast(error.message || 'Úkoly se nepovedlo načíst z cloudu');
      return false;
    }
    const localOnly = state.homeTasks.filter((task) => !task.cloudId);
    const cloudItems = (data || []).map((item) => ({
      id: state.homeTasks.find((task) => task.cloudId === item.id)?.id || `task-cloud-${item.id}`,
      householdId: currentHouseholdId(),
      profileId: currentProfileId(),
      cloudId: item.id,
      title: item.title,
      due: item.due_date || '',
      note: item.description || '',
      category: normalizeTaskCategory(item.category),
      priority: normalizeTaskPriority(item.priority),
      done: item.status === 'done',
      completedAt: item.completed_at || '',
      createdAt: item.created_at || new Date().toISOString()
    }));
    state.homeTasks = [...cloudItems, ...localOnly];
    state.tasksCloud = { ...(state.tasksCloud || {}), loadedAt: new Date().toISOString() };
    touchState();
    saveState();
    render();
    if (showMessage) showToast('Cloud úkoly načteny');
    return true;
  }

  async function cloudSyncTaskById(id) {
    const task = state.homeTasks.find((entry) => entry.id === id);
    if (!task) return;
    const saved = task.cloudId ? await cloudUpdateTask(task) : await cloudAddTask(task);
    if (!saved && !task.cloudId) return;
    touchState();
    saveState();
    render();
    showToast('Úkol odeslán do cloudu');
  }

  async function cloudSyncLocalTasks() {
    const local = state.homeTasks.filter((task) => !task.cloudId);
    if (!local.length) return showToast('Žádné lokální úkoly k odeslání');
    let count = 0;
    for (const task of local) {
      const saved = await cloudAddTask(task);
      if (saved?.id) count += 1;
    }
    touchState();
    saveState();
    render();
    showToast(`Odesláno úkolů: ${count}`);
  }

  async function addTaskFromForm(data, form) {
    const task = {
      id: uid(),
      householdId: currentHouseholdId(),
      profileId: currentProfileId(),
      createdAt: new Date().toISOString(),
      title: normalizeText(data.title),
      due: normalizeText(data.due),
      note: normalizeText(data.note),
      category: normalizeTaskCategory(data.category),
      priority: normalizeTaskPriority(data.priority),
      done: false
    };
    if (!task.title) return showToast('Doplň název úkolu');
    const saved = await cloudAddTask(task);
    if (saved?.id) task.cloudId = saved.id;
    state.homeTasks.push(task);
    touchState();
    saveState();
    form.reset();
    render();
    showToast(task.cloudId ? 'Úkol uložen do cloudu' : 'Úkol uložen lokálně');
  }

  async function toggleTaskDone(id) {
    const task = state.homeTasks.find((entry) => entry.id === id);
    if (!task) return;
    task.done = !task.done;
    task.completedAt = task.done ? new Date().toISOString() : '';
    const ok = await cloudUpdateTask(task);
    if (!ok) return;
    touchState();
    saveState();
    render();
  }

  async function deleteTask(id) {
    const task = state.homeTasks.find((entry) => entry.id === id);
    if (!task) return;
    const ok = await cloudDeleteTask(task);
    if (!ok) return;
    state.homeTasks = state.homeTasks.filter((entry) => entry.id !== id);
    touchState();
    saveState();
    render();
    showToast('Úkol smazán');
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
      'add-event': () => addEventFromForm(data, form),
      'add-calendar-source': () => addCalendarSourceFromForm(data, form),
      'google-calendar-save-sources': () => saveGoogleCalendarSourcesFromForm(form),
      'add-package': () => addPackageFromForm(data, form),
      'add-shopping': () => addShoppingFromForm(data, form),
      'add-coupon': () => addItem('coupons', { store: data.store, code: data.code, discount: data.discount, expiry: data.expiry, note: data.note, used: false }),
      'add-hdo': () => addHdoWindowFromForm(data, form),
      'add-waste': () => addWasteFromForm(data, form),
      'add-task': () => addTaskFromForm(data, form),
      'add-note': () => addItem('notes', { text: data.text, createdAt: new Date().toISOString() }),
      'add-device': () => addItem('devices', { name: data.name, type: data.type, address: data.address, note: data.note }),
      'add-warranty': () => addWarrantyFromForm(data, form),
      'polish-holidays-year': () => {
        state.polishShopClosures = normalizePolishShopState({ ...state.polishShopClosures, year: data.year });
        touchState();
        saveState();
        render();
      },
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
          iconColor: normalizeVehicleIconColor(data.iconColor),
          nextServiceKm: '',
          nextServiceDate: '',
          note: ''
        };
        const cloudVehicle = await cloudAddVehicle(vehicle);
        if (cloudVehicle?.id) vehicle.cloudId = cloudVehicle.id;
        state.vehicles.push(vehicle);
        rememberVehicleIconColor(vehicle);
        garageVehicleId = vehicle.id;
        touchState();
        saveState();
        if (cloudReady()) await cloudSaveHouseholdUiSettings(false);
        form.reset();
        render();
        showToast(vehicle.cloudId ? 'Auto uloženo do cloudu' : 'Auto uloženo lokálně');
      },
      'update-vehicle': () => updateVehicle(form.dataset.vehicleId, data),
      'add-fuel': async () => {
        const fuelParts = normalizeFuelCostParts(data);
        const item = { id: uid(), householdId: currentHouseholdId(), profileId: currentProfileId(), createdAt: new Date().toISOString(), vehicleId: form.dataset.vehicleId, date: data.date, odometer: data.odometer, liters: fuelParts.liters, price: fuelParts.price, pricePerLiter: fuelParts.pricePerLiter, note: data.note };
        const saved = await cloudAddFuelLog(item);
        if (saved?.id) item.cloudId = saved.id;
        state.fuel.push(item);
        garageModal = null;
        touchState();
        saveState();
        form.reset();
        render();
        showToast(item.cloudId ? 'Tankování uloženo do cloudu' : 'Tankování uloženo lokálně');
      },
      'add-service': async () => {
        const item = { id: uid(), householdId: currentHouseholdId(), profileId: currentProfileId(), createdAt: new Date().toISOString(), vehicleId: form.dataset.vehicleId, date: data.date, odometer: data.odometer, title: data.title, price: decimalValue(data.price), note: data.note };
        const saved = await cloudAddServiceLog(item);
        if (saved?.id) item.cloudId = saved.id;
        state.services.push(item);
        garageModal = null;
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
      'onboarding-google-setup': () => completeGoogleOnboardingSetup(data),
      'onboarding-login': () => loginExistingHouseholdFromOnboarding(data),
      'household-settings': async () => {
        state.household.name = normalizeText(data.householdName) || 'Domácnost';
        state.settings.theme = data.theme === 'dark' ? 'dark' : 'light';
        touchState();
        saveState();
        await cloudSaveHouseholdUiSettings(false, true);
        render();
        showToast(state.cloud?.householdId ? 'Domácnost uložena do cloudu' : 'Domácnost uložena lokálně');
      },
      settings: async () => {
        state.household.name = normalizeText(data.householdName) || 'Domácnost';
        state.settings.theme = data.theme === 'dark' ? 'dark' : 'light';
        touchState();
        saveState();
        await cloudSaveHouseholdUiSettings(false, true);
        render();
        showToast('Nastavení uloženo');
      },
      'add-profile': () => addProfile(data.name, data.role),
      'weather-settings': () => saveWeatherSettings(data, form),
      'import-data': () => importData(data.json),
      'cloud-login': () => cloudLogin(data.email, data.password),
      'cloud-signup': () => cloudSignUp(data.email, data.password),
      'delete-own-account': () => deleteOwnAccount(data.confirmText),
      'cloud-create-household': () => cloudCreateHousehold(data.name, data.profileName),
      'cloud-invite-member': () => cloudInviteMember(data.email, data.role),
      'add-finance-account': () => addFinanceAccountFromForm(data, form),
      'add-managed-finance-set': () => addManagedFinanceSetFromForm(data, form),
      'add-finance': () => addFinanceFromForm(data, form),
      'finance-month-filter': () => setFinanceMonth(data.month)
    };
    const handler = handlers[type];
    if (handler) await handler();
  }

  async function completeOnboarding(data) {
    const email = normalizeText(data.email).toLowerCase();
    const password = String(data.password || '');
    const passwordConfirm = String(data.passwordConfirm || '');

    if (!email || !password) {
      showToast('Vyplň e-mail a heslo pro rodinný účet');
      return;
    }
    if (password.length < 6) {
      showToast('Heslo musí mít aspoň 6 znaků');
      return;
    }
    if (password !== passwordConfirm) {
      showToast('Hesla se neshodují');
      return;
    }

    const householdId = `household-${uid()}`;
    const extraNames = normalizeText(data.profilesExtra)
      .split(',')
      .map((name) => normalizeText(name))
      .filter(Boolean);
    const names = [data.profilePrimary, data.profileSecondary]
      .map(normalizeText)
      .filter(Boolean)
      .concat(extraNames);
    const uniqueNames = [...new Set(names.length ? names : ['Já'])];

    state.household = {
      id: householdId,
      name: normalizeText(data.householdName) || 'Moje domácnost',
      isConfigured: true,
      createdAt: new Date().toISOString()
    };
    state.profiles = uniqueNames.map((name, index) => createProfile(name, index === 0 ? 'owner' : 'member', householdId));
    state.activeProfileId = state.profiles[0]?.id || '';
    state.enabledModules = normalizeModuleList(data.modules);
    state.settings.dashboardNote = DEFAULT_STATE.settings.dashboardNote;
    state.settings.demoMode = false;
    state.settings.bottomNavIds = normalizeBottomNavIds(DEFAULT_BOTTOM_NAV_IDS, state.enabledModules);
    activeModule = 'home';
    sessionStorage.removeItem(DEMO_SESSION_KEY);
    touchState();
    saveState();

    const cloudResult = await registerCloudHouseholdFromOnboarding(email, password);
    if (cloudResult === 'existing-account') {
      state = migrateState(mergeState(DEFAULT_STATE, {}));
      markExistingAccount(email);
      return;
    }
    render();
    if (cloudResult === 'bootstrapped') showToast('Rodinný účet a cloudová domácnost vytvořeny');
    else if (cloudResult === 'email-confirmation') showToast('Potvrď e-mail. Po potvrzení se domácnost automaticky napojí na cloud');
    else showToast('Domácnost vytvořena, cloud se zkusí znovu po přihlášení');
  }


  async function completeGoogleOnboardingSetup(data) {
    const user = await refreshCloudSession(false);
    if (!user) return showToast('Google účet není přihlášený. Spusť registraci přes Google znovu.');

    const householdId = `household-${uid()}`;
    const extraNames = normalizeText(data.profilesExtra)
      .split(',')
      .map((name) => normalizeText(name))
      .filter(Boolean);
    const names = [data.profilePrimary, data.profileSecondary]
      .map(normalizeText)
      .filter(Boolean)
      .concat(extraNames);
    const uniqueNames = [...new Set(names.length ? names : [googleDisplayNameFromUser(user)])];

    state.household = {
      id: householdId,
      name: normalizeText(data.householdName) || 'Moje domácnost',
      isConfigured: true,
      createdAt: new Date().toISOString()
    };
    state.profiles = uniqueNames.map((name, index) => createProfile(name, index === 0 ? 'owner' : 'member', householdId));
    state.activeProfileId = state.profiles[0]?.id || '';
    state.enabledModules = normalizeModuleList(data.modules);
    state.settings.dashboardNote = DEFAULT_STATE.settings.dashboardNote;
    state.settings.demoMode = false;
    state.settings.bottomNavIds = normalizeBottomNavIds(DEFAULT_BOTTOM_NAV_IDS, state.enabledModules);
    state.cloud = {
      ...(state.cloud || {}),
      supabaseUrl: SUPABASE_URL,
      provider: 'supabase',
      status: 'signed-in',
      userId: user.id,
      email: user.email || state.cloud?.email || ''
    };
    activeModule = 'home';
    sessionStorage.removeItem(DEMO_SESSION_KEY);
    sessionStorage.removeItem(ONBOARDING_GOOGLE_INTENT_KEY);
    touchState();
    saveState();

    const createdHouseholdId = await bootstrapCloudHousehold(false);
    if (createdHouseholdId) {
      await cloudLoadAllModules(false, { skipRealtimeSetup: true, silentWhenOffline: true });
      onboardingMode = 'choice';
      sessionStorage.removeItem('domacnostPlus.onboardingMode');
      render();
      showToast('Google účet a domácnost jsou připravené');
      return;
    }
    render();
    showToast('Domácnost je nastavená lokálně, cloud napojení půjde opravit v nastavení');
  }

  async function registerCloudHouseholdFromOnboarding(email, password) {
    const client = getSupabaseClient();
    if (!client) return 'local-only';
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getAuthRedirectUrl(),
        data: {
          app_name: 'Domácnost+',
          household_name: householdName(),
          owner_profile_name: currentProfile()?.name || ''
        }
      }
    });
    if (error) {
      if (isExistingAccountSignUpResponse(data, error)) return 'existing-account';
      showToast(error.message || 'Registrace se nepovedla');
      return 'local-only';
    }
    if (isExistingAccountSignUpResponse(data, null)) return 'existing-account';
    const user = data?.user;
    if (!data?.session || !user) {
      state.cloud = {
        ...(state.cloud || {}),
        supabaseUrl: SUPABASE_URL,
        provider: 'supabase',
        status: 'email-confirmation',
        userId: user?.id || '',
        email
      };
      saveState();
      return 'email-confirmation';
    }
    state.settings.demoMode = false;
    state.cloud = {
      ...(state.cloud || {}),
      supabaseUrl: SUPABASE_URL,
      provider: 'supabase',
      status: 'signed-in',
      userId: user.id,
      email: user.email || email
    };
    saveState();
    await bootstrapCloudHousehold(false);
    return state.cloud?.householdId ? 'bootstrapped' : 'signed-in';
  }

  async function loginExistingHouseholdFromOnboarding(data) {
    const email = normalizeText(data.email).toLowerCase();
    const password = String(data.password || '');
    if (!email || !password) return showToast('Vyplň e-mail a heslo');
    const client = getSupabaseClient();
    if (!client) return showToast('Supabase knihovna není načtená');
    const { data: authData, error } = await client.auth.signInWithPassword({ email, password });
    if (error) return showToast(error.message || 'Přihlášení se nepovedlo');
    const user = authData?.user;
    state.settings.demoMode = false;
    state.cloud = {
      ...(state.cloud || {}),
      supabaseUrl: SUPABASE_URL,
      provider: 'supabase',
      status: 'signed-in',
      userId: user?.id || '',
      email: user?.email || email
    };
    saveState();
    const households = await cloudLoadHouseholds(false);
    const firstHousehold = pickBestCloudHousehold(households);
    if (!firstHousehold) {
      render();
      showToast('Přihlášeno, ale účet zatím není v žádné domácnosti');
      return;
    }
    state.cloud.householdId = firstHousehold.id;
    state.household = {
      id: firstHousehold.id,
      name: firstHousehold.name || 'Domácnost',
      isConfigured: true,
      createdAt: firstHousehold.createdAt || new Date().toISOString()
    };
    await cloudLoadProfilesForCurrentHousehold();
    await cloudLoadAllModules(false);
    onboardingMode = 'choice';
    sessionStorage.removeItem('domacnostPlus.onboardingMode');
    sessionStorage.removeItem(DEMO_SESSION_KEY);
    activeModule = 'home';
    touchState();
    saveState();
    render();
    showToast('Domácnost načtena');
  }

  function startDemoHome() {
    const demo = createDemoState();
    state = migrateState(mergeState(DEFAULT_STATE, demo));
    state.settings.demoMode = true;
    state.cloud = {
      ...(state.cloud || {}),
      supabaseUrl: SUPABASE_URL,
      provider: 'demo',
      status: 'demo',
      userId: '',
      email: '',
      householdId: '',
      lastSyncAt: '',
      households: [],
      invitations: []
    };
    onboardingMode = 'choice';
    demoRuntimeActive = true;
    sessionStorage.removeItem('domacnostPlus.onboardingMode');
    sessionStorage.setItem(DEMO_SESSION_KEY, '1');
    activeModule = 'home';
    moduleTabs = {};
    touchState();
    render();
    showToast('Spuštěná demo domácnost · změny se neukládají');
  }

  function exitDemoHome() {
    demoRuntimeActive = false;
    onboardingMode = 'choice';
    sessionStorage.removeItem(DEMO_SESSION_KEY);
    sessionStorage.removeItem('domacnostPlus.onboardingMode');
    localStorage.setItem('homeWeb.activeModule', 'home');
    activeModule = 'home';
    moduleTabs = {};
    state = migrateState(mergeState(DEFAULT_STATE, {}));
    document.documentElement.dataset.theme = state.settings.theme || 'light';
    render();
    showToast('Demo ukončeno · můžeš se přihlásit nebo znovu spustit demo');
  }

  function createDemoState() {
    const nowIso = new Date().toISOString();
    const householdId = `demo-household-${uid()}`;
    const petrId = `demo-profile-petr-${uid()}`;
    const janaId = `demo-profile-jana-${uid()}`;
    const elaId = `demo-profile-ela-${uid()}`;
    const babickaId = `demo-profile-babicka-${uid()}`;
    const carOctaviaId = `demo-car-octavia-${uid()}`;
    const carCityId = `demo-car-city-${uid()}`;
    const accountMain = `demo-account-main-${uid()}`;
    const accountSavings = `demo-account-savings-${uid()}`;
    const accountCash = `demo-account-cash-${uid()}`;
    const accountHoliday = `demo-account-holiday-${uid()}`;
    const accountGrandma = `demo-account-grandma-${uid()}`;
    const accountGrandmaSavings = `demo-account-grandma-savings-${uid()}`;
    const createdAt = '2024-02-12T08:30:00.000Z';
    const addDays = (days) => {
      const date = new Date();
      date.setDate(date.getDate() + days);
      return date.toISOString().slice(0, 10);
    };
    const daysFromNow = addDays;
    const daysAgo = (days) => addDays(-days);
    const isoAt = (days, hour = 9, minute = 0) => {
      const date = new Date();
      date.setDate(date.getDate() + days);
      date.setHours(hour, minute, 0, 0);
      return date.toISOString();
    };
    const make = (base) => ({ id: uid(), householdId, createdAt: isoAt(-Math.floor(Math.random() * 420), 8, 15), ...base });

    const profiles = [
      { id: petrId, householdId, name: 'Petr', color: 'blue', role: 'owner', createdAt },
      { id: janaId, householdId, name: 'Jana', color: 'violet', role: 'admin', createdAt },
      { id: elaId, householdId, name: 'Eliška', color: 'pink', role: 'member', createdAt: isoAt(-410) },
      { id: babickaId, householdId, name: 'Babička', color: 'green', role: 'member', createdAt: isoAt(-360) }
    ];

    const calendar = [
      make({ profileId: petrId, title: 'Dentální hygiena', date: daysFromNow(1), time: '09:30', endTime: '10:15', type: 'event', location: 'Ordinace', note: 'Vzít kartičku pojišťovny' }),
      make({ profileId: janaId, title: 'Třídní schůzky', date: daysFromNow(3), time: '17:00', endTime: '18:00', type: 'family', location: 'Škola', note: 'Probrat školu v přírodě' }),
      make({ profileId: petrId, title: 'Servis auta', date: daysFromNow(8), time: '08:00', endTime: '10:00', type: 'event', location: 'Autoservis', note: 'Oleje + filtry' }),
      make({ profileId: janaId, title: 'Narozeniny mamky', date: daysFromNow(16), time: '15:00', type: 'family', location: 'U rodičů', note: 'Koupit kytku' }),
      make({ profileId: petrId, title: 'Dovolená Beskydy', date: daysFromNow(42), time: '', type: 'holiday', location: 'Beskydy', note: 'Zarezervovaná chata' }),
      make({ profileId: elaId, title: 'Kroužek keramika', date: daysFromNow(5), time: '16:00', endTime: '17:30', type: 'family', location: 'DDM', note: 'Zaplatit pololetí' }),
      make({ profileId: babickaId, title: 'Kontrola u doktora', date: daysFromNow(11), time: '11:00', type: 'event', location: 'Poliklinika', note: 'Odvoz autem' })
    ];
    ['Kino', 'Výlet na hrad', 'Rodinný oběd', 'Kontrola komína', 'Revize kotle', 'Zubař Eliška', 'Návštěva', 'Platba pojistky', 'Školní besídka', 'Dovolená záloha', 'Veterina Rex', 'Servis kol'].forEach((title, index) => {
      calendar.push(make({ profileId: index % 2 ? janaId : petrId, title, date: addDays(index * 6 - 70), time: index % 3 === 0 ? '09:00' : index % 3 === 1 ? '16:30' : '', type: index % 4 === 0 ? 'family' : 'event', location: index % 2 ? 'Město' : '', note: index % 2 ? 'Historická demo událost' : '' }));
    });

    const packages = [
      make({ profileId: janaId, title: 'Boty z e-shopu', carrier: 'zasilkovna', tracking: 'Z1234567890', status: 'pickup', expectedDate: daysFromNow(0), pickupPlace: 'Z-BOX u obchodu', url: '', note: 'Vyzvednout dnes' }),
      make({ profileId: petrId, title: 'Filtry do vysavače', carrier: 'ppl', tracking: 'PPL987654321', status: 'transit', expectedDate: daysFromNow(2), pickupPlace: '', url: '', note: 'Do garáže' }),
      make({ profileId: janaId, title: 'Drogerie', carrier: 'balikovna', tracking: 'BVK452981736', status: 'new', expectedDate: daysFromNow(4), pickupPlace: 'Balíkovna Coop', url: '', note: 'Prací gel v akci' }),
      make({ profileId: petrId, title: 'Náhradní filtr do auta', carrier: 'dpd', tracking: 'DPD778812450', status: 'delivered', expectedDate: daysAgo(7), pickupPlace: '', url: '', note: 'Doručeno minulý týden' }),
      make({ profileId: janaId, title: 'Dárek pro Elišku', carrier: 'gls', tracking: 'GLS99881233', status: 'problem', expectedDate: daysFromNow(1), pickupPlace: '', url: '', note: 'Změna adresy' })
    ];

    const shoppingNames = [
      ['Mléko', 2, 'l', 'Mléčné', false], ['Rohlíky', 12, 'ks', 'Pečivo', false], ['Banány', 1.5, 'kg', 'Ovoce a zelenina', false], ['Rajčata', 1, 'kg', 'Ovoce a zelenina', false], ['Kuřecí maso', 1.2, 'kg', 'Maso a uzeniny', false], ['Tablety do myčky', 1, 'bal', 'Drogerie', true], ['Toaletní papír', 1, 'bal', 'Drogerie', false], ['Granule Rex', 5, 'kg', 'Zvířata', false], ['Káva', 2, 'bal', 'Trvanlivé', true], ['Zelenina mražená', 3, 'bal', 'Mražené', true], ['Pytle na odpad', 1, 'role', 'Domácnost', false], ['Paralen', 1, 'bal', 'Lékárna', true]
    ];
    const shopping = shoppingNames.map(([name, quantity, unit, category, done], index) => make({ profileId: index % 2 ? janaId : petrId, name, quantity, unit, category, note: done ? 'Už koupeno v demo historii' : '', done, doneAt: done ? isoAt(-index, 18, 0) : '', createdAt: isoAt(-index * 2, 10, 0) }));
    const shoppingStats = {};
    ['Mléko','Rohlíky','Banány','Rajčata','Jogurt','Máslo','Tablety do myčky','Granule Rex','Káva','Toaletní papír','Kuřecí maso','Sýr plátkový'].forEach((name, index) => {
      shoppingStats[normalizeKey(name)] = { name, unit: index % 3 === 0 ? 'ks' : index % 3 === 1 ? 'bal' : 'kg', category: index < 6 ? 'Potraviny' : 'Domácnost', count: 28 - index * 2, lastUsedAt: isoAt(-index, 12, 0) };
    });

    const hdoWindows = [
      make({ profileId: petrId, start: '02:00', end: '06:00', days: [0,1,2,3,4,5,6], enabled: true, note: 'Noční nízký tarif' }),
      make({ profileId: petrId, start: '13:00', end: '15:00', days: [1,2,3,4,5], enabled: true, note: 'Odpolední okno po–pá' }),
      make({ profileId: petrId, start: '22:00', end: '23:30', days: [0,6], enabled: true, note: 'Víkendové dohřátí' })
    ];

    const waste = [
      make({ profileId: petrId, type: 'Plast', date: daysFromNow(1), repeat: 'biweekly', notifyBeforeHours: 12, note: 'Večer vyvézt žlutou' }),
      make({ profileId: petrId, type: 'Směsný odpad', date: daysFromNow(4), repeat: 'weekly', notifyBeforeHours: 12, note: '' }),
      make({ profileId: janaId, type: 'Papír', date: daysFromNow(7), repeat: 'monthly', notifyBeforeHours: 24, note: 'Složit krabice v garáži' }),
      make({ profileId: janaId, type: 'Bioodpad', date: daysFromNow(3), repeat: 'weekly', notifyBeforeHours: 8, note: 'Hnědá nádoba za bránou' }),
      make({ profileId: petrId, type: 'Sklo', date: daysFromNow(18), repeat: 'monthly', notifyBeforeHours: 24, note: 'Odvézt tašku skla do kontejneru' })
    ];

    const homeTasks = [
      make({ profileId: petrId, title: 'Vyměnit filtr digestoře', category: 'udrzba', priority: 'normal', due: daysFromNow(5), note: 'Filtr je ve skříni', done: false }),
      make({ profileId: janaId, title: 'Objednat kadeřnici', category: 'ostatni', priority: 'low', due: daysFromNow(10), note: '', done: false }),
      make({ profileId: petrId, title: 'Zaplatit zálohu dovolené', category: 'finance', priority: 'high', due: daysFromNow(2), note: 'Podklady v e-mailu', done: false }),
      make({ profileId: janaId, title: 'Připravit věci na sběrný dvůr', category: 'domacnost', priority: 'normal', due: daysFromNow(9), note: 'Staré elektro + krabice', done: false }),
      make({ profileId: petrId, title: 'Umýt auto', category: 'auto', priority: 'low', due: daysAgo(8), note: 'Hotovo minulý týden', done: true, doneAt: isoAt(-7, 18, 0) }),
      make({ profileId: janaId, title: 'Vytřídit dětské oblečení', category: 'domacnost', priority: 'normal', due: daysAgo(20), note: 'Část šla na charitu', done: true, doneAt: isoAt(-18, 20, 0) })
    ];
    ['Zalít kytky', 'Objednat granule', 'Zkontrolovat pojistku auta', 'Vyčistit filtr sušičky', 'Záloha fotek na NAS', 'Vyměnit baterie v ovladači', 'Zkontrolovat lékárničku', 'Vyčistit odpad v koupelně'].forEach((title, index) => {
      homeTasks.push(make({ profileId: index % 2 ? janaId : petrId, title, category: index % 3 === 0 ? 'udrzba' : index % 3 === 1 ? 'domacnost' : 'zdravi', priority: index % 5 === 0 ? 'high' : 'normal', due: addDays(index * 4 - 12), note: index % 2 ? 'Opakovaný demo úkol' : '', done: index < 3, doneAt: index < 3 ? isoAt(-index * 3, 19, 0) : '' }));
    });

    const devices = [
      make({ profileId: petrId, name: 'Router', type: 'Síť', address: '192.168.1.1', note: 'Hlavní router v pracovně' }),
      make({ profileId: petrId, name: 'NAS', type: 'Úložiště', address: '192.168.1.50', note: 'Zálohy fotek a dokumentů' }),
      make({ profileId: petrId, name: 'Switch garáž', type: 'Síť', address: '192.168.1.12', note: 'Kamery + AP' }),
      make({ profileId: janaId, name: 'Tablet v kuchyni', type: 'Dashboard', address: '192.168.1.80', note: 'Budoucí domácí panel' }),
      make({ profileId: petrId, name: 'Tiskárna', type: 'Tisk', address: '192.168.1.45', note: 'Toner objednat při 15 %' })
    ];

    const warranties = [
      make({ profileId: petrId, name: 'Pračka se sušičkou', store: 'Datart', category: 'Spotřebič', price: 14990, purchaseDate: daysAgo(220), warrantyUntil: addYearsIso(daysAgo(220), 2), status: 'active', note: 'Účtenka v e-mailu, řešit čištění filtru.' }),
      make({ profileId: janaId, name: 'Telefon Jana', store: 'Alza', category: 'Elektronika', price: 11990, purchaseDate: daysAgo(540), warrantyUntil: addYearsIso(daysAgo(540), 3), status: 'active', note: 'Prodloužená záruka na 3 roky.' }),
      make({ profileId: petrId, name: 'Robotický vysavač', store: 'Mall', category: 'Domácnost', price: 7990, purchaseDate: daysAgo(690), warrantyUntil: addYearsIso(daysAgo(690), 2), status: 'claim', note: 'Reklamace: hlučnější kartáč, číslo RMA-2026-042.' })
    ];

    const vehicles = [
      make({ id: carOctaviaId, profileId: petrId, name: 'Škoda Octavia', brand: 'Škoda', model: 'Octavia', plate: '1AB 2345', fuelType: 'diesel', odometer: '184500', technicalInspectionUntil: daysFromNow(90), insuranceUntil: daysFromNow(45), nextServiceKm: '190000', nextServiceDate: daysFromNow(30), note: 'Rodinné auto' }),
      make({ id: carCityId, profileId: janaId, name: 'Hyundai i20', brand: 'Hyundai', model: 'i20', plate: '2CD 9876', fuelType: 'gasoline', odometer: '76200', technicalInspectionUntil: daysFromNow(210), insuranceUntil: daysFromNow(160), nextServiceKm: '80000', nextServiceDate: daysFromNow(80), note: 'Městské auto' })
    ];
    const fuel = [];
    for (let i = 0; i < 18; i += 1) {
      const vehicleId = i % 3 === 0 ? carCityId : carOctaviaId;
      const baseKm = vehicleId === carOctaviaId ? 176400 : 70500;
      const liters = vehicleId === carOctaviaId ? 45 + (i % 5) * 1.7 : 32 + (i % 4) * 1.4;
      fuel.push(make({ profileId: vehicleId === carOctaviaId ? petrId : janaId, vehicleId, date: daysAgo(20 + i * 18), odometer: String(baseKm + i * (vehicleId === carOctaviaId ? 460 : 310)), liters: Number(liters.toFixed(1)), price: Math.round(liters * (36 + (i % 4))), note: i % 4 === 0 ? 'Plná nádrž' : 'Běžné tankování' }));
    }
    const services = [
      make({ profileId: petrId, vehicleId: carOctaviaId, date: daysAgo(60), title: 'Výměna oleje', price: 4200, note: 'Olej + filtry' }),
      make({ profileId: petrId, vehicleId: carOctaviaId, date: daysAgo(190), title: 'Pneumatiky', price: 14800, note: 'Letní sada' }),
      make({ profileId: janaId, vehicleId: carCityId, date: daysAgo(95), title: 'STK + emise', price: 2300, note: 'Bez závad' }),
      make({ profileId: janaId, vehicleId: carCityId, date: daysAgo(35), title: 'Brzdy přední', price: 6200, note: 'Destičky + kotouče' })
    ];

    const contracts = [
      make({ profileId: petrId, name: 'Pojištění auta Octavia', type: 'car_insurance', provider: 'Demo pojišťovna', number: 'AUTO-2026-001', validFrom: daysAgo(180), validTo: daysFromNow(45), amount: 8400, frequency: 'yearly', note: 'Navazuje na Garáž' }),
      make({ profileId: janaId, name: 'Pojištění domácnosti', type: 'home_insurance', provider: 'Bezpečný domov', number: 'DOM-88421', validFrom: daysAgo(260), validTo: daysFromNow(70), amount: 3200, frequency: 'yearly', note: 'Hlídáno před výročím' }),
      make({ profileId: petrId, name: 'Internet domácnost', type: 'internet', provider: 'DemoNet', number: 'NET-5544', validFrom: daysAgo(400), validTo: daysFromNow(120), amount: 599, frequency: 'monthly', note: 'Optika 1 Gb/s' }),
      make({ profileId: petrId, name: 'Elektřina', type: 'electricity', provider: 'Energie Demo', number: 'EL-2025-77', validFrom: daysAgo(300), validTo: daysFromNow(22), amount: 3850, frequency: 'monthly', note: 'Brzy zkontrolovat ceník' }),
      make({ profileId: janaId, name: 'Mobil Jana', type: 'mobile', provider: 'Operátor+', number: 'TEL-3312', validFrom: daysAgo(500), validTo: daysFromNow(300), amount: 649, frequency: 'monthly', note: '' }),
      make({ profileId: petrId, name: 'Streamovací služba', type: 'subscription', provider: 'Stream Demo', number: 'SUB-908', validFrom: daysAgo(80), validTo: daysFromNow(285), amount: 239, frequency: 'monthly', note: 'Rodinný tarif' })
    ];

    const accountDefs = [
      { id: accountMain, profileId: petrId, name: 'Domácí účet', accountType: 'bank', openingBalance: 24800, ownerLabel: 'Petr + Jana', note: 'Hlavní provoz domácnosti' },
      { id: accountSavings, profileId: petrId, name: 'Rezerva / spoření', accountType: 'savings', openingBalance: 118000, ownerLabel: 'Domácnost', note: 'Peníze bokem' },
      { id: accountCash, profileId: janaId, name: 'Hotovost doma', accountType: 'cash', openingBalance: 3600, ownerLabel: 'Domácnost', note: 'Obálka v šuplíku' },
      { id: accountHoliday, profileId: janaId, name: 'Obálka dovolená', accountType: 'envelope', openingBalance: 18500, ownerLabel: 'Dovolená', note: 'Rezerva na léto' },
      { id: accountGrandma, profileId: babickaId, name: 'Babička – u nás', accountType: 'person', openingBalance: 0, ownerLabel: 'Babička', note: 'Spravované peníze, které chodí na náš účet' },
      { id: accountGrandmaSavings, profileId: babickaId, name: 'Babička – spoření', accountType: 'savings', openingBalance: 42000, ownerLabel: 'Babička', note: 'Peníze bokem pro babičku' }
    ];
    const financeAccounts = accountDefs.map((account) => make({ ...account, currentBalance: account.openingBalance, includeInTotal: true }));
    const finance = [];
    for (let month = 0; month < 14; month += 1) {
      const base = month * 31;
      finance.push(make({ profileId: petrId, type: 'income', title: 'Výplata Petr', amount: 42500 + (month % 3) * 1200, date: daysAgo(base + 7), category: 'salary', accountId: accountMain, paymentMethod: 'bank_transfer', note: month === 0 ? 'Aktuální měsíc' : '' }));
      finance.push(make({ profileId: janaId, type: 'income', title: 'Výplata Jana', amount: 31800 + (month % 2) * 900, date: daysAgo(base + 9), category: 'salary', accountId: accountMain, paymentMethod: 'bank_transfer', note: '' }));
      finance.push(make({ profileId: babickaId, type: 'income', title: 'Důchod babička', amount: 17480, date: daysAgo(base + 10), category: 'salary', accountId: accountGrandma, paymentMethod: 'bank_transfer', note: 'Připsáno na náš účet, vedeno odděleně' }));
      finance.push(make({ profileId: babickaId, type: 'expense', title: 'Babička – nájem', amount: 6200, date: daysAgo(base + 11), category: 'housing', accountId: accountGrandma, paymentMethod: 'bank_transfer', note: 'Strženo za nájem' }));
      finance.push(make({ profileId: babickaId, type: 'expense', title: 'Babička – energie', amount: 2800, date: daysAgo(base + 11), category: 'energy', accountId: accountGrandma, paymentMethod: 'bank_transfer', note: 'Záloha energie' }));
      finance.push(make({ profileId: babickaId, type: 'expense', title: 'Babička – hotovost', amount: month % 2 ? 3000 : 2500, date: daysAgo(base + 13), category: 'other_expense', accountId: accountGrandma, paymentMethod: 'cash', note: 'Vybráno v hotovosti' }));
      finance.push(make({ profileId: babickaId, type: 'transfer', title: 'Babička – bokem na spoření', amount: month % 3 === 0 ? 2000 : 1500, date: daysAgo(base + 15), category: 'other_expense', accountId: accountGrandma, transferAccountId: accountGrandmaSavings, paymentMethod: 'bank_transfer', note: 'Přesun na spořicí účet' }));
      finance.push(make({ profileId: petrId, type: 'expense', title: 'Nájem / hypotéka', amount: 14500, date: daysAgo(base + 12), category: 'housing', accountId: accountMain, paymentMethod: 'bank_transfer', note: '' }));
      finance.push(make({ profileId: janaId, type: 'expense', title: 'Potraviny', amount: 4200 + (month % 4) * 360, date: daysAgo(base + 3), category: 'groceries', accountId: accountMain, paymentMethod: 'card', note: 'Velký nákup' }));
      finance.push(make({ profileId: petrId, type: 'expense', title: 'Energie', amount: 3850, date: daysAgo(base + 14), category: 'energy', accountId: accountMain, paymentMethod: 'direct_debit', note: '' }));
      finance.push(make({ profileId: petrId, type: 'transfer', title: 'Přesun do rezervy', amount: month % 2 ? 4500 : 6000, date: daysAgo(base + 17), category: 'other_expense', accountId: accountMain, transferAccountId: accountSavings, paymentMethod: 'bank_transfer', note: 'Automaticky bokem' }));
      if (month < 8) finance.push(make({ profileId: janaId, type: 'transfer', title: 'Dovolená obálka', amount: 2500, date: daysAgo(base + 19), category: 'other_expense', accountId: accountMain, transferAccountId: accountHoliday, paymentMethod: 'bank_transfer', note: 'Letní rezerva' }));
    }
    ['Lékárna', 'Kino', 'Restaurace', 'Školní výlet', 'Pojistka auto', 'Servis auta', 'Dárek narozeniny', 'Drogerie'].forEach((title, index) => {
      finance.push(make({ profileId: index % 2 ? janaId : petrId, type: 'expense', title, amount: [680, 920, 1450, 1200, 8400, 4200, 1800, 760][index], date: addDays(index * -9 - 2), category: ['health','fun','restaurant','kids','contracts','car','other_expense','drugstore'][index], accountId: accountMain, paymentMethod: index % 2 ? 'card' : 'bank_transfer', note: index === 4 ? 'Roční platba' : '' }));
    });

    const coupons = [
      make({ profileId: janaId, store: 'Drogerie', code: 'JARO15', discount: '15 %', expiry: daysFromNow(12), note: 'Použít na tablety do myčky', used: false }),
      make({ profileId: petrId, store: 'Alza', code: 'DOPRAVA0', discount: 'doprava zdarma', expiry: daysFromNow(4), note: 'Na filtr do auta', used: false }),
      make({ profileId: janaId, store: 'Lékárna', code: 'LETO10', discount: '10 %', expiry: daysFromNow(30), note: '', used: false }),
      make({ profileId: petrId, store: 'Sport', code: 'BOTY20', discount: '20 %', expiry: daysAgo(9), note: 'Už použito', used: true })
    ];

    return {
      meta: { schemaVersion: 69, appBuild: 116, mode: 'rich-demo-v116', createdAt, updatedAt: nowIso },
      settings: {
        ...DEFAULT_STATE.settings,
        dashboardNote: 'Demo domácnost je záměrně naplněná historií. Ukazuje, jak Domácnost+ vypadá po dlouhém aktivním používání.',
        bottomNavIds: ['home', 'calendar', 'shopping', 'homecare', 'finance'],
        dashboardWidgets: [...DEFAULT_DASHBOARD_WIDGET_IDS],
        demoMode: true
      },
      household: { id: householdId, name: 'Demo domácnost Královi', isConfigured: true, createdAt },
      profiles,
      activeProfileId: petrId,
      enabledModules: [...MANAGED_MODULE_IDS],
      calendar,
      packages,
      coupons,
      hdoWindows,
      shopping,
      shoppingCatalogCustom: [
        make({ profileId: petrId, name: 'Granule Rex', defaultUnit: 'kg', category: 'Zvířata', source: 'household' }),
        make({ profileId: janaId, name: 'Káva Guatemala', defaultUnit: 'bal', category: 'Trvanlivé', source: 'household' }),
        make({ profileId: janaId, name: 'Jogurty Eliška', defaultUnit: 'ks', category: 'Mléčné', source: 'household' })
      ],
      shoppingStats,
      hdoCloud: { settingId: '', loadedAt: '' },
      shoppingCloud: { units: [], categories: [], catalog: [], activeListId: '', loadedAt: '' },
      wasteCloud: { types: [], loadedAt: '' },
      parcelsCloud: { loadedAt: '' },
      tasksCloud: { loadedAt: '' },
      calendarCloud: { sources: [], loadedAt: '', sourcesLoadedAt: '', googleConnection: null, googleCalendars: [], googleCalendarsLoadedAt: '', googleLastSyncAt: '' },
      waste,
      homeTasks,
      notes: [
        make({ profileId: petrId, text: 'V garáži dochází zimní směs do ostřikovačů.' }),
        make({ profileId: janaId, text: 'Na příští týden domluvit návštěvu babičky.' }),
        make({ profileId: petrId, text: 'Po výplatě zkontrolovat rezervu a obálku dovolená.' }),
        make({ profileId: janaId, text: 'Koupit nové filtry do konvice, poslední je nasazený.' })
      ],
      devices,
      warranties,
      vehicles,
      fuel,
      services,
      contracts,
      contractFiles: [],
      cameras: [
        make({ profileId: petrId, name: 'Vchod', location: 'Před domem', snapshotUrl: '', status: 'online', note: 'Demo kamera bez streamu' }),
        make({ profileId: petrId, name: 'Garáž', location: 'Garáž', snapshotUrl: '', status: 'online', note: 'Snapshot se doplní později' }),
        make({ profileId: janaId, name: 'Zahrada', location: 'Zadní část domu', snapshotUrl: '', status: 'offline', note: 'Výměna napájení' })
      ],
      financeAccounts,
      finance,
      financeCloud: { categories: [], accountsLoadedAt: '', loadedAt: '', monthFilter: todayISO().slice(0, 7) },
      householdExtrasCloud: { loadedAt: '' },
      weather: makeDemoWeatherState(),
      pwa: { installed: false, lastUpdateCheck: '', lastInstallPrompt: '', diagnostics: null },
      cloud: { supabaseUrl: SUPABASE_URL, provider: 'demo', userId: '', email: '', householdId: '', lastSyncAt: '', status: 'demo', households: [], invitations: [] },
      householdWorkspaces: {}
    };
  }
  async function cloudAddProfile(profile) {
    if (!cloudReady() || !profile) return null;
    const client = getSupabaseClient();
    if (!client) return null;
    const user = await refreshCloudSession(false);
    if (!user || !state.cloud?.householdId) return null;
    const payload = {
      household_id: state.cloud.householdId,
      user_id: profile.userId || null,
      name: normalizeText(profile.name) || 'Profil',
      avatar_emoji: profile.avatarEmoji || '🙂',
      color: profile.color || 'blue',
      is_default: Boolean(profile.id && profile.id === state.activeProfileId),
      is_archived: false,
      created_by: user.id
    };
    const { data, error } = await client.from('profiles').insert(payload).select('id, created_at').single();
    if (error) {
      showToast(error.message || 'Profil se nepovedlo uložit do cloudu');
      return null;
    }
    profile.cloudId = data.id;
    profile.householdId = state.cloud.householdId;
    state.cloud.profilesLoadedAt = new Date().toISOString();
    state.cloud.lastSyncAt = new Date().toISOString();
    return data;
  }

  async function cloudArchiveProfile(profile) {
    if (!profile?.cloudId || !cloudReady()) return true;
    const client = getSupabaseClient();
    if (!client) return true;
    const { error } = await client
      .from('profiles')
      .update({ is_archived: true, updated_at: new Date().toISOString() })
      .eq('id', profile.cloudId)
      .eq('household_id', state.cloud.householdId);
    if (error) {
      showToast(error.message || 'Profil se nepovedlo smazat v cloudu');
      return false;
    }
    state.cloud.profilesLoadedAt = new Date().toISOString();
    state.cloud.lastSyncAt = new Date().toISOString();
    return true;
  }

  async function cloudSyncLocalProfiles(showMessage = false) {
    if (!cloudReady()) return 0;
    const localProfiles = (state.profiles || []).filter((profile) => !profile.cloudId);
    if (!localProfiles.length) {
      if (showMessage) showToast('Žádné lokální profily k odeslání');
      return 0;
    }
    let count = 0;
    for (const profile of localProfiles) {
      try {
        const saved = await cloudAddProfile(profile);
        if (saved?.id) count += 1;
      } catch (error) {
        console.warn('Cloud profile sync failed', error);
      }
    }
    touchState();
    saveState();
    if (showMessage) showToast(`Odesláno profilů: ${count}`);
    return count;
  }

  async function addProfile(name, role = 'member') {
    const cleanName = normalizeText(name);
    if (!cleanName) return;
    const profile = createProfile(cleanName, role === 'owner' ? 'owner' : 'member', currentHouseholdId());
    const saved = await cloudAddProfile(profile);
    if (saved?.id) profile.cloudId = saved.id;
    state.profiles.push(profile);
    state.activeProfileId = profile.id;
    touchState();
    saveState();
    render();
    showToast(profile.cloudId ? 'Profil přidán do cloudu' : 'Profil přidán lokálně');
  }

  function touchState() {
    state.meta = { ...(state.meta || {}), schemaVersion: 69, appBuild: 116, mode: 'polish-shop-holidays-v116', updatedAt: new Date().toISOString() };
  }

  async function addItem(collection, item) {
    const normalized = Object.fromEntries(Object.entries(item).map(([key, value]) => [key, typeof value === 'string' ? normalizeText(value) : value]));
    if (!state[collection]) state[collection] = [];
    const record = {
      id: uid(),
      householdId: currentHouseholdId(),
      profileId: currentProfileId(),
      createdAt: new Date().toISOString(),
      ...normalized
    };
    const saved = await cloudAddExtraItem(collection, record);
    if (saved?.id) record.cloudId = saved.id;
    state[collection].push(record);
    touchState();
    saveState();
    render();
    showToast(record.cloudId ? 'Uloženo do cloudu' : 'Uloženo lokálně');
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

  function roundFuelNumber(value, decimals = 2) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return '';
    return Number(parsed.toFixed(decimals));
  }

  function normalizeFuelCostParts(data = {}) {
    let liters = decimalValue(data.liters);
    let price = decimalValue(data.price);
    let pricePerLiter = decimalValue(data.pricePerLiter);
    if ((liters === '' || liters === 0) && price !== '' && pricePerLiter) liters = roundFuelNumber(Number(price) / Number(pricePerLiter), 2);
    if ((price === '' || price === 0) && liters !== '' && pricePerLiter !== '') price = roundFuelNumber(Number(liters) * Number(pricePerLiter), 2);
    if ((pricePerLiter === '' || pricePerLiter === 0) && liters && price !== '') pricePerLiter = roundFuelNumber(Number(price) / Number(liters), 2);
    return { liters, price, pricePerLiter };
  }

  function fuelPricePerLiter(item = {}) {
    if (item.pricePerLiter !== '' && item.pricePerLiter !== undefined && item.pricePerLiter !== null) return decimalValue(item.pricePerLiter);
    const liters = decimalValue(item.liters);
    const price = decimalValue(item.price);
    if (!liters || price === '') return '';
    return roundFuelNumber(Number(price) / Number(liters), 2);
  }

  function formatFuelPricePerLiter(value) {
    const parsed = decimalValue(value);
    if (parsed === '') return '';
    return `${Number(parsed).toFixed(2).replace('.', ',')} Kč/l`;
  }

  function fillFuelFormCalculation(form, changedInput = null) {
    if (!form || !form.matches('form[data-form="add-fuel"], form[data-form="update-fuel"]')) return;
    const fields = {
      liters: form.querySelector('[name="liters"]'),
      price: form.querySelector('[name="price"]'),
      pricePerLiter: form.querySelector('[name="pricePerLiter"]')
    };
    if (!fields.liters || !fields.price || !fields.pricePerLiter) return;
    if (changedInput) changedInput.dataset.autoFuelValue = 'false';
    const valueOf = (input) => decimalValue(input?.value);
    const setAuto = (input, value, decimals = 2) => {
      if (!input || value === '' || !Number.isFinite(Number(value))) return;
      if (input.value && input.dataset.autoFuelValue !== 'true') return;
      input.value = Number(value).toFixed(decimals).replace(/\.?0+$/, '');
      input.dataset.autoFuelValue = 'true';
    };
    const liters = valueOf(fields.liters);
    const price = valueOf(fields.price);
    const pricePerLiter = valueOf(fields.pricePerLiter);
    if (liters && price !== '') setAuto(fields.pricePerLiter, Number(price) / Number(liters), 2);
    if (liters && pricePerLiter !== '') setAuto(fields.price, Number(liters) * Number(pricePerLiter), 2);
    if (price !== '' && pricePerLiter) setAuto(fields.liters, Number(price) / Number(pricePerLiter), 2);
  }

  function openGarageDetailPanel(target = '') {
    const normalized = target === 'vehicle-settings' ? 'vehicle-settings' : target === 'add-service' ? 'add-service' : target === 'add-fuel' ? 'add-fuel' : '';
    if (!normalized) return;
    if (normalized === 'add-fuel' || normalized === 'add-service') {
      const vehicle = state.vehicles.find((item) => item.id === garageVehicleId) || state.vehicles[0];
      if (!vehicle) return showToast('Nejdřív vyber auto');
      garageModal = { type: normalized, vehicleId: vehicle.id };
      render();
      return;
    }
    const settings = document.querySelector('[data-garage-detail="vehicle-settings"]');
    if (settings) settings.open = true;
    settings?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    settings?.querySelector('input, select, textarea')?.focus({ preventScroll: true });
  }

  function daysModeToArray(mode) {
    if (mode === 'workdays') return [1, 2, 3, 4, 5];
    if (mode === 'weekend') return [6, 0];
    return [1, 2, 3, 4, 5, 6, 0];
  }


  function financeCategoryOptions() {
    return FINANCE_CATEGORY_OPTIONS.map(([key, label]) => [key, label]);
  }

  function financeCategoryLabel(value) {
    return FINANCE_CATEGORY_OPTIONS.find(([key]) => key === value)?.[1] || value || 'Ostatní';
  }

  function financeAccountTypeOptions() {
    return [['cash', 'Hotovost'], ['bank', 'Běžný účet'], ['savings', 'Spoření'], ['envelope', 'Obálka / rezerva'], ['person', 'Osoba / spravované peníze'], ['debt', 'Dluh / vyrovnání'], ['other', 'Jiné']];
  }

  function financeAccountTypeLabel(value) {
    return financeAccountTypeOptions().find(([key]) => key === value)?.[1] || 'Jiné';
  }

  function financeAccountIcon(value) {
    return { cash: '💵', bank: '🏦', savings: '🐷', envelope: '✉️', person: '👤', debt: '🧾', other: '💰' }[value] || '💰';
  }

  function financeAccountsSorted() {
    return [...(state.financeAccounts || [])].sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'cs'));
  }

  function financeAccountById(id) {
    return (state.financeAccounts || []).find((account) => account.id === id || account.cloudId === id) || null;
  }

  function financeAccountOptions(includeEmpty = true) {
    const options = financeAccountsSorted().map((account) => [account.id, `${financeAccountIcon(account.accountType)} ${account.name}`]);
    return includeEmpty ? [['', 'Bez účtu / jen záznam'], ...options] : [['', 'Nevybráno'], ...options];
  }

  function financeManagedGroups(balances = financeAccountBalances()) {
    const map = new Map();
    (state.financeAccounts || []).forEach((account) => {
      const explicitOwner = normalizeText(account.ownerLabel);
      const isManagedType = ['person', 'savings', 'envelope', 'debt'].includes(account.accountType);
      if (!explicitOwner && !isManagedType) return;
      const label = explicitOwner || financeAccountTypeLabel(account.accountType);
      if (!map.has(label)) map.set(label, { label, accounts: [], total: 0 });
      const row = map.get(label);
      row.accounts.push(account);
      row.total += Number(balances[account.id] || 0);
    });
    return [...map.values()].sort((a, b) => Math.abs(b.total) - Math.abs(a.total) || a.label.localeCompare(b.label, 'cs'));
  }

  function financeCategoryType(value) {
    return FINANCE_CATEGORY_OPTIONS.find(([key]) => key === value)?.[2] || 'expense';
  }

  function financePaymentLabel(value) {
    const map = { cash: 'hotově', card: 'kartou', bank_transfer: 'převod', direct_debit: 'inkaso', other: 'jiné' };
    return map[value] || 'jiné';
  }

  function financeSelectedMonth() {
    const stored = state.financeCloud?.monthFilter;
    return /^\d{4}-\d{2}$/.test(String(stored || '')) ? stored : todayISO().slice(0, 7);
  }

  function financeMonthLabel(month) {
    const safeMonth = /^\d{4}-\d{2}$/.test(String(month || '')) ? month : todayISO().slice(0, 7);
    const [year, monthIndex] = safeMonth.split('-').map(Number);
    return new Intl.DateTimeFormat('cs-CZ', { month: 'long', year: 'numeric' }).format(new Date(year, monthIndex - 1, 1));
  }

  function setFinanceMonth(month) {
    if (!/^\d{4}-\d{2}$/.test(String(month || ''))) return showToast('Vyber platný měsíc');
    state.financeCloud = { ...(state.financeCloud || {}), monthFilter: month };
    touchState();
    saveState();
    render();
  }

  function shiftFinanceMonth(delta) {
    const month = financeSelectedMonth();
    const [year, monthIndex] = month.split('-').map(Number);
    const date = new Date(year, monthIndex - 1 + delta, 1);
    const next = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    setFinanceMonth(next);
  }

  function financeMonthSummary(month = financeSelectedMonth()) {
    return (state.finance || []).reduce((acc, item) => {
      if (String(item.date || '').slice(0, 7) !== month) return acc;
      const amount = Number(item.amount || 0);
      if (item.type === 'income') acc.income += amount;
      else if (item.type === 'expense') acc.expense += amount;
      acc.balance = acc.income - acc.expense;
      return acc;
    }, { income: 0, expense: 0, balance: 0 });
  }

  function financeCategoryBreakdown(month = financeSelectedMonth()) {
    const map = new Map();
    (state.finance || []).forEach((item) => {
      if (String(item.date || '').slice(0, 7) !== month || item.type === 'transfer') return;
      const key = `${item.type}:${item.category || 'other'}`;
      const current = map.get(key) || { key, type: item.type, category: item.category || 'other', label: financeCategoryLabel(item.category), amount: 0, count: 0 };
      current.amount += Number(item.amount || 0);
      current.count += 1;
      map.set(key, current);
    });
    return [...map.values()].sort((a, b) => b.amount - a.amount);
  }

  function financeAccountMonthSummary(month = financeSelectedMonth()) {
    const map = new Map();
    const ensure = (account) => {
      if (!account) return null;
      const key = account.id;
      if (!map.has(key)) map.set(key, { key, label: `${financeAccountIcon(account.accountType)} ${account.name}`, income: 0, expense: 0, transferIn: 0, transferOut: 0, net: 0 });
      return map.get(key);
    };
    (state.finance || []).forEach((item) => {
      if (String(item.date || '').slice(0, 7) !== month) return;
      const amount = Number(item.amount || 0);
      const account = financeAccountById(item.accountId);
      const target = financeAccountById(item.transferAccountId);
      if (item.type === 'income') { const row = ensure(account); if (row) { row.income += amount; row.net += amount; } }
      if (item.type === 'expense') { const row = ensure(account); if (row) { row.expense += amount; row.net -= amount; } }
      if (item.type === 'transfer') {
        const from = ensure(account);
        const to = ensure(target);
        if (from) { from.transferOut += amount; from.net -= amount; }
        if (to) { to.transferIn += amount; to.net += amount; }
      }
    });
    return [...map.values()].sort((a, b) => Math.abs(b.net) - Math.abs(a.net));
  }

  function financeAccountBalances() {
    const balances = {};
    (state.financeAccounts || []).forEach((account) => {
      balances[account.id] = Number(account.openingBalance || 0);
      if (account.cloudId) balances[account.cloudId] = balances[account.id];
    });
    (state.finance || []).forEach((item) => {
      const amount = Number(item.amount || 0);
      if (!amount) return;
      const account = financeAccountById(item.accountId);
      const target = financeAccountById(item.transferAccountId);
      if (item.type === 'income' && account) balances[account.id] = (balances[account.id] || 0) + amount;
      if (item.type === 'expense' && account) balances[account.id] = (balances[account.id] || 0) - amount;
      if (item.type === 'transfer') {
        if (account) balances[account.id] = (balances[account.id] || 0) - amount;
        if (target) balances[target.id] = (balances[target.id] || 0) + amount;
      }
    });
    return balances;
  }

  function cloudFinanceAccountPayload(account, userId) {
    return {
      household_id: state.cloud.householdId,
      profile_id: null,
      name: account.name,
      account_type: ['cash', 'bank', 'savings', 'envelope', 'person', 'debt', 'other'].includes(account.accountType) ? account.accountType : 'other',
      owner_label: account.ownerLabel || null,
      currency: 'CZK',
      opening_balance: Number(account.openingBalance || 0),
      current_balance: Number(financeAccountBalances()[account.id] || account.openingBalance || 0),
      include_in_total: account.includeInTotal !== false,
      is_archived: false,
      note: account.note || null,
      created_by: userId,
      updated_by: userId
    };
  }

  async function cloudAddFinanceAccount(account) {
    const client = getSupabaseClient();
    if (!client || !state.cloud?.householdId) return null;
    const user = await refreshCloudSession(false);
    if (!user) return null;
    const { data, error } = await client.from('finance_accounts').insert(cloudFinanceAccountPayload(account, user.id)).select('id').single();
    if (error) {
      showToast(error.message || 'Účet se nepovedlo uložit do cloudu');
      return null;
    }
    account.cloudId = data.id;
    state.cloud.lastSyncAt = new Date().toISOString();
    return data;
  }

  function cloudFinancePayload(item, userId) {
    const account = financeAccountById(item.accountId);
    const target = financeAccountById(item.transferAccountId);
    return {
      household_id: state.cloud.householdId,
      profile_id: null,
      category_id: null,
      account_id: account?.cloudId || null,
      transfer_account_id: target?.cloudId || null,
      type: item.type === 'transfer' ? 'transfer' : item.type === 'income' ? 'income' : 'expense',
      title: item.title || financeCategoryLabel(item.category),
      amount: Number(item.amount || 0),
      currency: 'CZK',
      transaction_date: item.date || todayISO(),
      payment_method: ['cash', 'card', 'bank_transfer', 'direct_debit', 'other'].includes(item.paymentMethod) ? item.paymentMethod : 'other',
      is_recurring: false,
      recurring_rule: 'none',
      note: item.note || null,
      source: 'manual',
      created_by: userId,
      updated_by: userId
    };
  }

  async function cloudAddFinance(item) {
    const client = getSupabaseClient();
    if (!client || !state.cloud?.householdId) return null;
    const user = await refreshCloudSession(false);
    if (!user) return null;
    if (item.accountId) {
      const account = financeAccountById(item.accountId);
      if (account && !account.cloudId) await cloudAddFinanceAccount(account);
    }
    if (item.transferAccountId) {
      const target = financeAccountById(item.transferAccountId);
      if (target && !target.cloudId) await cloudAddFinanceAccount(target);
    }
    const { data, error } = await client.from('finance_transactions').insert(cloudFinancePayload(item, user.id)).select('id').single();
    if (error) {
      showToast(error.message || 'Finance se nepovedlo uložit do cloudu');
      return null;
    }
    item.cloudId = data.id;
    state.cloud.lastSyncAt = new Date().toISOString();
    return data;
  }

  async function cloudLoadFinance(showMessage = true) {
    const client = getSupabaseClient();
    if (!client || !state.cloud?.householdId) return false;
    const { data: accountData, error: accountError } = await client
      .from('finance_accounts')
      .select('id,name,account_type,owner_label,opening_balance,include_in_total,note,created_at')
      .eq('household_id', state.cloud.householdId)
      .eq('is_archived', false)
      .order('name', { ascending: true });
    if (accountError) {
      showToast(accountError.message || 'Finanční účty se nepovedlo načíst z cloudu');
      return false;
    }
    const localAccounts = (state.financeAccounts || []).filter((item) => !item.cloudId);
    const cloudAccounts = (accountData || []).map((item) => ({
      id: state.financeAccounts.find((entry) => entry.cloudId === item.id)?.id || `finance-account-cloud-${item.id}`,
      householdId: currentHouseholdId(),
      profileId: currentProfileId(),
      cloudId: item.id,
      name: item.name || 'Účet',
      accountType: item.account_type || 'other',
      ownerLabel: item.owner_label || '',
      openingBalance: Number(item.opening_balance || 0),
      includeInTotal: item.include_in_total !== false,
      note: item.note || '',
      createdAt: item.created_at || new Date().toISOString()
    }));
    state.financeAccounts = [...cloudAccounts, ...localAccounts];
    const cloudAccountById = Object.fromEntries(state.financeAccounts.filter((account) => account.cloudId).map((account) => [account.cloudId, account]));

    const { data, error } = await client
      .from('finance_transactions')
      .select('id,type,title,amount,transaction_date,payment_method,note,created_at,account_id,transfer_account_id')
      .eq('household_id', state.cloud.householdId)
      .order('transaction_date', { ascending: false })
      .order('created_at', { ascending: false });
    if (error) {
      showToast(error.message || 'Finance se nepovedlo načíst z cloudu');
      return false;
    }
    const localOnly = (state.finance || []).filter((item) => !item.cloudId);
    const cloudItems = (data || []).map((item) => ({
      id: state.finance.find((entry) => entry.cloudId === item.id)?.id || `finance-cloud-${item.id}`,
      householdId: currentHouseholdId(),
      profileId: currentProfileId(),
      cloudId: item.id,
      type: item.type === 'transfer' || item.transfer_account_id ? 'transfer' : item.type || 'expense',
      title: item.title || 'Záznam',
      amount: item.amount === null || item.amount === undefined ? 0 : Number(item.amount),
      date: item.transaction_date || todayISO(),
      paymentMethod: item.payment_method || 'other',
      accountId: cloudAccountById[item.account_id]?.id || '',
      transferAccountId: cloudAccountById[item.transfer_account_id]?.id || '',
      category: item.type === 'income' ? 'other_income' : 'other_expense',
      note: item.note || '',
      createdAt: item.created_at || new Date().toISOString()
    }));
    state.finance = [...cloudItems, ...localOnly];
    state.financeCloud = { ...(state.financeCloud || {}), accountsLoadedAt: new Date().toISOString(), loadedAt: new Date().toISOString() };
    touchState();
    saveState();
    render();
    if (showMessage) showToast('Cloud finance načtené');
    return true;
  }

  async function cloudDeleteFinance(item) {
    const client = getSupabaseClient();
    if (!client || !item?.cloudId || !state.cloud?.householdId) return true;
    const { error } = await client.from('finance_transactions').delete().eq('id', item.cloudId).eq('household_id', state.cloud.householdId);
    if (error) {
      showToast(error.message || 'Záznam se nepovedlo smazat v cloudu');
      return false;
    }
    state.cloud.lastSyncAt = new Date().toISOString();
    return true;
  }

  async function cloudDeleteFinanceAccount(account) {
    const client = getSupabaseClient();
    if (!client || !account?.cloudId || !state.cloud?.householdId) return true;
    const { error } = await client.from('finance_accounts').update({ is_archived: true }).eq('id', account.cloudId).eq('household_id', state.cloud.householdId);
    if (error) {
      showToast(error.message || 'Účet se nepovedlo archivovat v cloudu');
      return false;
    }
    return true;
  }

  async function addFinanceAccountFromForm(data, form) {
    const account = {
      id: uid(),
      householdId: currentHouseholdId(),
      profileId: currentProfileId(),
      createdAt: new Date().toISOString(),
      name: normalizeText(data.name),
      accountType: normalizeText(data.accountType) || 'other',
      ownerLabel: normalizeText(data.ownerLabel),
      openingBalance: decimalValue(data.openingBalance) || 0,
      includeInTotal: data.includeInTotal !== 'no',
      note: normalizeText(data.note)
    };
    if (!account.name) return showToast('Doplň název účtu');
    const saved = await cloudAddFinanceAccount(account);
    if (saved?.id) account.cloudId = saved.id;
    state.financeAccounts.push(account);
    touchState();
    saveState();
    form.reset();
    render();
    showToast(account.cloudId ? 'Účet uložen do cloudu' : 'Účet uložen lokálně');
  }

  async function addManagedFinanceSetFromForm(data, form) {
    const ownerName = normalizeText(data.ownerName);
    if (!ownerName) return showToast('Doplň název osoby nebo obálky');
    const includeInTotal = data.includeInTotal !== 'no';
    const existingNames = new Set((state.financeAccounts || []).map((account) => normalizeText(account.name).toLowerCase()));
    const mainName = normalizeText(data.mainAccountName) || `${ownerName} – u mě`;
    const reserveName = normalizeText(data.reserveAccountName) || `${ownerName} – bokem`;
    const drafts = [
      { name: mainName, accountType: 'person', openingBalance: decimalValue(data.mainOpeningBalance) || 0, note: 'Hlavní spravovaný zůstatek' },
      { name: reserveName, accountType: 'savings', openingBalance: decimalValue(data.reserveOpeningBalance) || 0, note: 'Peníze bokem / spoření' }
    ].filter((draft) => draft.name && !existingNames.has(draft.name.toLowerCase()));
    if (!drafts.length) return showToast('Tyhle účty už existují');
    let cloudCount = 0;
    for (const draft of drafts) {
      const account = {
        id: uid(),
        householdId: currentHouseholdId(),
        profileId: currentProfileId(),
        createdAt: new Date().toISOString(),
        name: draft.name,
        accountType: draft.accountType,
        ownerLabel: ownerName,
        openingBalance: draft.openingBalance,
        includeInTotal,
        note: draft.note
      };
      const saved = await cloudAddFinanceAccount(account);
      if (saved?.id) {
        account.cloudId = saved.id;
        cloudCount += 1;
      }
      state.financeAccounts.push(account);
    }
    touchState();
    saveState();
    form.reset();
    render();
    showToast(cloudCount ? `Založeno účtů: ${drafts.length}, v cloudu: ${cloudCount}` : `Založeno účtů: ${drafts.length}`);
  }

  function fillFinanceTemplate(template) {
    const form = document.querySelector('[data-form="add-finance"]');
    if (!form) return;
    const accounts = financeAccountsSorted();
    const primary = accounts[0]?.id || '';
    const secondary = accounts.find((account) => account.id !== primary && ['savings', 'envelope', 'person'].includes(account.accountType))?.id || accounts.find((account) => account.id !== primary)?.id || '';
    const templates = {
      salary: { type: 'income', title: 'Výplata', category: 'salary', paymentMethod: 'bank_transfer', accountId: primary },
      rent: { type: 'expense', title: 'Nájem', category: 'housing', paymentMethod: 'bank_transfer', accountId: primary },
      energy: { type: 'expense', title: 'Energie', category: 'energy', paymentMethod: 'direct_debit', accountId: primary },
      cash: { type: 'expense', title: 'Výběr hotově', category: 'other_expense', paymentMethod: 'cash', accountId: primary },
      savings: { type: 'transfer', title: 'Přesun na spoření', category: 'other_expense', paymentMethod: 'bank_transfer', accountId: primary, transferAccountId: secondary }
    };
    const values = templates[template];
    if (!values) return;
    Object.entries(values).forEach(([name, value]) => {
      const field = form.elements[name];
      if (field) field.value = value || '';
    });
    if (form.elements.date) form.elements.date.value = todayISO();
    if (form.elements.amount) form.elements.amount.focus();
    showToast('Šablona vyplněná, doplň částku');
  }

  async function addFinanceFromForm(data, form) {
    let type = data.type === 'income' ? 'income' : data.type === 'transfer' ? 'transfer' : 'expense';
    const accountId = normalizeText(data.accountId);
    const transferAccountId = normalizeText(data.transferAccountId);
    if (type === 'transfer' && (!accountId || !transferAccountId || accountId === transferAccountId)) {
      return showToast('U přesunu vyber dva různé účty');
    }
    const category = normalizeText(data.category) || (type === 'income' ? 'other_income' : 'other_expense');
    const item = {
      id: uid(),
      householdId: currentHouseholdId(),
      profileId: currentProfileId(),
      createdAt: new Date().toISOString(),
      type,
      title: normalizeText(data.title) || (type === 'transfer' ? 'Přesun' : financeCategoryLabel(category)),
      amount: decimalValue(data.amount),
      date: normalizeText(data.date) || todayISO(),
      category,
      accountId,
      transferAccountId: type === 'transfer' ? transferAccountId : '',
      paymentMethod: normalizeText(data.paymentMethod) || 'other',
      note: normalizeText(data.note)
    };
    if (!item.title || !Number(item.amount)) return showToast('Doplň název a částku');
    const saved = await cloudAddFinance(item);
    if (saved?.id) item.cloudId = saved.id;
    state.finance.push(item);
    touchState();
    saveState();
    form.reset();
    render();
    showToast(item.cloudId ? 'Finance uloženy do cloudu' : 'Finance uloženy lokálně');
  }

  async function cloudSyncFinanceAccountById(id) {
    const account = state.financeAccounts.find((entry) => entry.id === id);
    if (!account) return;
    const saved = await cloudAddFinanceAccount(account);
    if (!saved?.id) return;
    touchState();
    saveState();
    render();
    showToast('Účet odeslán do cloudu');
  }

  async function cloudSyncLocalFinanceAccounts() {
    const local = (state.financeAccounts || []).filter((item) => !item.cloudId);
    if (!local.length) return showToast('Žádné lokální účty k odeslání');
    let count = 0;
    for (const account of local) {
      const saved = await cloudAddFinanceAccount(account);
      if (saved?.id) count += 1;
    }
    touchState();
    saveState();
    render();
    showToast(`Odesláno finančních účtů: ${count}`);
  }

  async function cloudSyncFinanceById(id) {
    const item = state.finance.find((entry) => entry.id === id);
    if (!item) return;
    const saved = await cloudAddFinance(item);
    if (!saved?.id) return;
    touchState();
    saveState();
    render();
    showToast('Záznam odeslán do cloudu');
  }

  async function cloudSyncLocalFinance() {
    const local = (state.finance || []).filter((item) => !item.cloudId);
    if (!local.length) return showToast('Žádné lokální finance k odeslání');
    let count = 0;
    for (const item of local) {
      const saved = await cloudAddFinance(item);
      if (saved?.id) count += 1;
    }
    touchState();
    saveState();
    render();
    showToast(`Odesláno finančních záznamů: ${count}`);
  }

  async function deleteFinanceTransaction(id) {
    const item = state.finance.find((entry) => entry.id === id);
    if (!item) return;
    const ok = await cloudDeleteFinance(item);
    if (!ok) return;
    state.finance = state.finance.filter((entry) => entry.id !== id);
    touchState();
    saveState();
    render();
    showToast('Záznam smazán');
  }

  async function deleteFinanceAccount(id) {
    const account = state.financeAccounts.find((entry) => entry.id === id);
    if (!account) return;
    if ((state.finance || []).some((item) => item.accountId === id || item.transferAccountId === id)) {
      showToast('Účet má pohyby. Nejdřív smaž nebo přesuň záznamy.');
      return;
    }
    const ok = await cloudDeleteFinanceAccount(account);
    if (!ok) return;
    state.financeAccounts = state.financeAccounts.filter((entry) => entry.id !== id);
    touchState();
    saveState();
    render();
    showToast('Účet smazán');
  }




  function cloudReady() {
    return Boolean(state.cloud?.userId && state.cloud?.householdId && state.cloud?.provider === 'supabase');
  }


  function realtimeStatusLabel(status = state.cloud?.realtimeStatus) {
    return REALTIME_STATUS_LABELS[String(status || 'offline').toLowerCase()] || String(status || 'vypnuto');
  }

  function cloudAutosyncStatusLabel(status = state.cloud?.autosyncStatus) {
    if (state.cloud?.autoSyncEnabled === false) return AUTOSYNC_STATUS_LABELS.disabled;
    return AUTOSYNC_STATUS_LABELS[String(status || 'idle').toLowerCase()] || String(status || 'čeká');
  }

  function cloudLocalPendingCount(items = null) {
    try {
      const rows = items || getCloudSyncOverviewItems();
      return rows.reduce((sum, item) => sum + Number(item.local || 0), 0);
    } catch {
      return 0;
    }
  }

  function scheduleCloudAutosync(source = 'save') {
    if (!cloudReady() || isDemoOnlyState()) return;
    if (state.cloud?.autoSyncEnabled === false) return;
    if (cloudAutosyncRunning || cloudRealtimeReloading || suppressToastDepth > 0) return;
    const pending = cloudLocalPendingCount();
    state.cloud.localPendingCount = pending;
    if (!pending) return;
    if (Date.now() - cloudAutosyncLastAttempt < 6500) return;
    if (cloudAutosyncTimer) window.clearTimeout(cloudAutosyncTimer);
    state.cloud.autosyncStatus = 'pending';
    state.cloud.autosyncSource = source;
    persistStateSnapshot();
    cloudAutosyncTimer = window.setTimeout(() => {
      cloudAutosyncTimer = null;
      runCloudAutosyncNow(false);
    }, 2600);
  }

  async function runCloudAutosyncNow(showMessage = true) {
    if (!cloudReady()) {
      if (showMessage) showToast('Nejdřív napoj domácnost na cloud');
      return false;
    }
    if (isDemoOnlyState()) return false;
    if (cloudAutosyncTimer) {
      window.clearTimeout(cloudAutosyncTimer);
      cloudAutosyncTimer = null;
    }
    const before = cloudLocalPendingCount();
    state.cloud.localPendingCount = before;
    if (!before) {
      state.cloud.autosyncStatus = 'done';
      state.cloud.lastAutosyncAt = new Date().toISOString();
      persistStateSnapshot();
      if (showMessage) showToast('Cloud je aktuální');
      render();
      return true;
    }
    cloudAutosyncRunning = true;
    cloudAutosyncLastAttempt = Date.now();
    state.cloud.autosyncStatus = 'syncing';
    persistStateSnapshot();
    render();
    try {
      await withMutedToasts(async () => {
        await cloudSyncLocalPendingData(false);
        await cloudLoadAllModules(false, { skipRealtimeSetup: true, silentWhenOffline: true });
      });
      const after = cloudLocalPendingCount();
      state.cloud = {
        ...(state.cloud || {}),
        autosyncStatus: after ? 'blocked' : 'done',
        lastAutosyncAt: new Date().toISOString(),
        localPendingCount: after,
        lastAutosyncError: ''
      };
      touchState();
      persistStateSnapshot();
      render();
      if (showMessage) showToast(after ? `Cloud sync hotový, ${after} položek chce ruční kontrolu` : 'Lokální záznamy jsou v cloudu');
      return !after;
    } catch (error) {
      console.warn('Cloud autosync failed', error);
      state.cloud = {
        ...(state.cloud || {}),
        autosyncStatus: 'error',
        lastAutosyncError: error?.message || 'Autosync selhal',
        localPendingCount: cloudLocalPendingCount()
      };
      persistStateSnapshot();
      render();
      if (showMessage) showToast('Automatická synchronizace se nepovedla');
      return false;
    } finally {
      cloudAutosyncRunning = false;
    }
  }

  function setCloudAutosyncEnabled(enabled) {
    state.cloud = {
      ...(state.cloud || {}),
      autoSyncEnabled: Boolean(enabled),
      autosyncStatus: enabled ? 'idle' : 'disabled'
    };
    touchState();
    saveState();
    render();
    showToast(enabled ? 'Autosync zapnutý' : 'Autosync vypnutý');
    if (enabled) scheduleCloudAutosync('manual-toggle');
  }

  function disposeCloudRealtime() {
    if (cloudRealtimeReloadTimer) {
      window.clearTimeout(cloudRealtimeReloadTimer);
      cloudRealtimeReloadTimer = null;
    }
    const client = supabaseClientInstance;
    if (cloudRealtimeChannel && client?.removeChannel) {
      try { client.removeChannel(cloudRealtimeChannel); } catch (error) { console.warn('Realtime remove failed', error); }
    }
    cloudRealtimeChannel = null;
    cloudRealtimeHouseholdId = '';
    cloudRealtimeReloading = false;
  }

  function scheduleCloudRealtimeRefresh(source = 'cloud') {
    if (!cloudReady() || isDemoOnlyState()) return;
    if (cloudRealtimeReloadTimer) window.clearTimeout(cloudRealtimeReloadTimer);
    state.cloud = {
      ...(state.cloud || {}),
      realtimeStatus: 'refreshing',
      realtimeSource: source,
      lastRealtimeAt: new Date().toISOString()
    };
    saveState();
    cloudRealtimeReloadTimer = window.setTimeout(async () => {
      if (cloudRealtimeReloading || !cloudReady() || isDemoOnlyState()) return;
      cloudRealtimeReloading = true;
      try {
        await withMutedToasts(() => cloudLoadAllModules(false, { skipRealtimeSetup: true }));
        state.cloud = {
          ...(state.cloud || {}),
          realtimeStatus: 'online',
          realtimeSource: source,
          lastRealtimeAt: new Date().toISOString()
        };
        touchState();
        saveState();
        render();
      } catch (error) {
        console.warn('Realtime cloud refresh failed', error);
        state.cloud = { ...(state.cloud || {}), realtimeStatus: 'channel_error' };
        saveState();
      } finally {
        cloudRealtimeReloading = false;
        cloudRealtimeReloadTimer = null;
      }
    }, 1200);
  }

  function setupCloudRealtimeSubscriptions(force = false) {
    if (!cloudReady() || isDemoOnlyState()) {
      disposeCloudRealtime();
      return false;
    }
    const client = getSupabaseClient();
    if (!client?.channel) {
      state.cloud = { ...(state.cloud || {}), realtimeStatus: 'unsupported' };
      saveState();
      return false;
    }
    const householdId = state.cloud.householdId;
    if (!force && cloudRealtimeChannel && cloudRealtimeHouseholdId === householdId) return true;
    disposeCloudRealtime();
    cloudRealtimeHouseholdId = householdId;
    state.cloud = { ...(state.cloud || {}), realtimeStatus: 'connecting' };
    const channel = client.channel(`domacnost-plus-household-${householdId}`);
    REALTIME_CLOUD_TABLES.forEach((table) => {
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table, filter: `household_id=eq.${householdId}` },
        (payload) => scheduleCloudRealtimeRefresh(payload?.table || table)
      );
    });
    cloudRealtimeChannel = channel;
    channel.subscribe((status) => {
      const key = String(status || '').toLowerCase();
      state.cloud = {
        ...(state.cloud || {}),
        realtimeStatus: key === 'subscribed' ? 'online' : key,
        realtimeStartedAt: key === 'subscribed' ? new Date().toISOString() : state.cloud?.realtimeStartedAt || ''
      };
      saveState();
      const realtimeBadge = document.querySelector('[data-cloud-realtime-status]');
      if (realtimeBadge) realtimeBadge.textContent = realtimeStatusLabel();
    });
    return true;
  }

  async function withMutedToasts(callback) {
    suppressToastDepth += 1;
    try {
      return await callback();
    } finally {
      suppressToastDepth = Math.max(0, suppressToastDepth - 1);
    }
  }

  function extraCloudConfig(collection) {
    return CLOUD_EXTRA_COLLECTIONS[collection] || null;
  }

  async function cloudAddExtraItem(collection, item) {
    const config = extraCloudConfig(collection);
    if (!config || !cloudReady()) return null;
    const client = getSupabaseClient();
    if (!client) return null;
    const user = await refreshCloudSession(false);
    if (!user || !state.cloud?.householdId) return null;
    const payload = config.payload(item, user.id);
    const { data, error } = await client
      .from(config.table)
      .insert(payload)
      .select('id')
      .single();
    if (error) {
      showToast(error.message || 'Záznam se nepovedlo uložit do cloudu');
      return null;
    }
    item.cloudId = data.id;
    state.cloud.lastSyncAt = new Date().toISOString();
    return data;
  }

  async function cloudUpdateExtraItem(collection, item) {
    const config = extraCloudConfig(collection);
    if (!config || !cloudReady() || !item?.cloudId) return true;
    const client = getSupabaseClient();
    if (!client) return true;
    const user = await refreshCloudSession(false);
    if (!user) return false;
    const payload = config.payload(item, user.id);
    delete payload.created_by;
    const { error } = await client
      .from(config.table)
      .update(payload)
      .eq('id', item.cloudId)
      .eq('household_id', state.cloud.householdId);
    if (error) {
      showToast(error.message || 'Záznam se nepovedlo upravit v cloudu');
      return false;
    }
    state.cloud.lastSyncAt = new Date().toISOString();
    return true;
  }

  async function cloudDeleteExtraItem(collection, item) {
    const config = extraCloudConfig(collection);
    if (!config || !item?.cloudId || !cloudReady()) return true;
    const client = getSupabaseClient();
    if (!client) return true;
    const { error } = await client
      .from(config.table)
      .delete()
      .eq('id', item.cloudId)
      .eq('household_id', state.cloud.householdId);
    if (error) {
      showToast(error.message || 'Záznam se nepovedlo smazat z cloudu');
      return false;
    }
    state.cloud.lastSyncAt = new Date().toISOString();
    return true;
  }

  async function cloudLoadExtraCollection(collection, showMessage = false) {
    const config = extraCloudConfig(collection);
    if (!config || !cloudReady()) return false;
    const client = getSupabaseClient();
    if (!client) return false;
    let query = client
      .from(config.table)
      .select(config.select)
      .eq('household_id', state.cloud.householdId);
    if (config.order) query = query.order(config.order.column, { ascending: config.order.ascending });
    const { data, error } = await query;
    if (error) {
      if (showMessage) showToast(error.message || 'Cloud data se nepovedlo načíst');
      return false;
    }
    const localOnly = (state[collection] || []).filter((item) => !item.cloudId);
    const cloudItems = (data || []).map((item) => config.map(item));
    state[collection] = [...cloudItems, ...localOnly];
    state.householdExtrasCloud = { ...(state.householdExtrasCloud || {}), loadedAt: new Date().toISOString() };
    state.cloud.lastSyncAt = new Date().toISOString();
    touchState();
    saveState();
    if (showMessage) showToast('Cloud data načtená');
    return true;
  }

  async function cloudLoadExtraCollections(showMessage = false) {
    if (!cloudReady()) return false;
    let count = 0;
    for (const collection of Object.keys(CLOUD_EXTRA_COLLECTIONS)) {
      try {
        const ok = await cloudLoadExtraCollection(collection, false);
        if (ok) count += 1;
      } catch (error) {
        console.warn('Cloud extra load failed', collection, error);
      }
    }
    touchState();
    saveState();
    render();
    if (showMessage) showToast(`Cloud drobné moduly načtené: ${count}/${Object.keys(CLOUD_EXTRA_COLLECTIONS).length}`);
    return true;
  }

  async function cloudSyncLocalExtraCollections(showMessage = true) {
    if (!cloudReady()) {
      if (showMessage) showToast('Nejdřív napoj domácnost na cloud');
      return 0;
    }
    let synced = 0;
    for (const collection of Object.keys(CLOUD_EXTRA_COLLECTIONS)) {
      const localItems = (state[collection] || []).filter((item) => !item.cloudId);
      for (const item of localItems) {
        try {
          const saved = await cloudAddExtraItem(collection, item);
          if (saved?.id) synced += 1;
        } catch (error) {
          console.warn('Cloud extra sync failed', collection, error);
        }
      }
    }
    touchState();
    saveState();
    render();
    if (showMessage) showToast(synced ? `Odesláno drobných záznamů: ${synced}` : 'Žádné lokální drobné záznamy k odeslání');
    return synced;
  }

  async function cloudSyncLocalPendingData(showMessage = true) {
    if (!cloudReady()) {
      if (showMessage) showToast('Nejdřív napoj domácnost na cloud');
      return;
    }
    const syncers = [
      cloudSyncLocalProfiles,
      cloudSyncLocalShoppingItems,
      cloudSyncLocalContracts,
      cloudSyncLocalContractFiles,
      cloudSyncLocalGarage,
      cloudSyncLocalHdo,
      cloudSyncLocalWaste,
      cloudSyncLocalTasks,
      cloudSyncLocalParcels,
      cloudSyncLocalCalendarSources,
      cloudSyncLocalCalendar,
      cloudSyncLocalFinanceAccounts,
      cloudSyncLocalFinance,
      () => cloudSyncLocalExtraCollections(false)
    ];
    await withMutedToasts(async () => {
      for (const syncer of syncers) {
        try {
          await syncer();
        } catch (error) {
          console.warn('Cloud pending sync failed', error);
        }
      }
    });
    if (showMessage) await withMutedToasts(() => cloudLoadAllModules(false));
    setupCloudRealtimeSubscriptions(false);
    state.cloud.lastSyncAt = new Date().toISOString();
    touchState();
    saveState();
    render();
    if (showMessage) showToast('Lokální záznamy byly zkontrolované a cloud je načtený');
  }

  async function cloudWarmStartLoad(showMessage = false, force = false) {
    if ((cloudWarmStartDone && !force) || isDemoOnlyState()) return;
    const user = await refreshCloudSession(false);
    if (!user) return;
    cloudWarmStartDone = true;
    const households = await cloudLoadHouseholds(false);
    if (!state.cloud?.householdId && households.length) {
      const preferredHousehold = pickBestCloudHousehold(households);
      state.cloud.householdId = preferredHousehold.id;
      state.household = { ...(state.household || {}), id: preferredHousehold.id, name: preferredHousehold.name || state.household?.name || 'Domácnost', isConfigured: true };
    }
    if (!state.cloud?.householdId && state.household?.isConfigured) {
      await bootstrapCloudHousehold(false);
    }
    if (!state.cloud?.householdId) return;
    await cloudLoadProfilesForCurrentHousehold();
    await cloudSyncLocalPendingData(false);
    await cloudLoadAllModules(false);
    if (showMessage) showToast('Cloud domácnost načtená');
  }

  async function cloudLoadAllModules(showMessage = true, options = {}) {
    if (!state.cloud?.userId || !state.cloud?.householdId) {
      if (!options.silentWhenOffline) showToast('Nejdřív napoj domácnost na cloud');
      return;
    }
    const loaders = [
      cloudLoadHouseholdUiSettings,
      cloudLoadProfilesForCurrentHousehold,
      cloudLoadShoppingData,
      cloudLoadContracts,
      cloudLoadGarageData,
      cloudLoadHdoData,
      cloudLoadWaste,
      cloudLoadTasks,
      cloudLoadParcels,
      cloudLoadCalendarSources,
      cloudLoadCalendar,
      cloudLoadContractFiles,
      cloudLoadFinance,
      cloudLoadExtraCollections
    ];
    let ok = 0;
    for (const loader of loaders) {
      try {
        await loader(false);
        ok += 1;
      } catch (error) {
        console.warn('Cloud load module failed', error);
      }
    }
    state.cloud.lastSyncAt = new Date().toISOString();
    touchState();
    saveState();
    render();
    if (!options.skipRealtimeSetup) setupCloudRealtimeSubscriptions(false);
    if (showMessage) showToast(`Cloud načten: ${ok}/${loaders.length} částí`);
  }

  function handleAction(button) {
    const action = button.dataset.action;
    if (action === 'open-overview') {
      if ((button.dataset.overview || '') === 'calendar') {
        activeOverview = null;
        activeModule = 'calendar';
        moduleTabs = { ...(moduleTabs || {}), calendar: 'overview' };
        if (!isDemoOnlyState()) {
          localStorage.setItem('homeWeb.activeModule', activeModule);
          localStorage.setItem('domacnostPlus.moduleTabs', JSON.stringify(moduleTabs));
        }
        render();
        keepActiveNavCentered('smooth');
        keepActiveSectionTabsCentered('smooth');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      openOverview(button.dataset.overview || 'homecare');
      return;
    }
    if (action === 'close-overview') {
      closeOverview();
      return;
    }
    if (action === 'close-modal') {
      garageModal = null;
      calendarDetailEventId = null;
      garageEditRecord = null;
      render();
      return;
    }
    if (action === 'set-section-tab') {
      setModuleTab(button.dataset.area || activeModule, button.dataset.tab || 'main');
      return;
    }
    if (action === 'onboarding-mode') {
      onboardingMode = button.dataset.mode || 'choice';
      if (onboardingMode === 'choice') sessionStorage.removeItem('domacnostPlus.onboardingMode');
      else sessionStorage.setItem('domacnostPlus.onboardingMode', onboardingMode);
      render();
      return;
    }
    if (action === 'start-demo') {
      startDemoHome();
      return;
    }
    if (action === 'exit-demo') {
      exitDemoHome();
      return;
    }
    if (action === 'toggle-theme') {
      state.settings.theme = state.settings.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = state.settings.theme || 'light';
      if (button.classList.contains('icon-btn')) {
        button.textContent = state.settings.theme === 'dark' ? '☀️' : '🌙';
      }
      button.setAttribute('aria-label', 'Přepnout vzhled');
      touchState();
      saveState();
      showToast(state.settings.theme === 'dark' ? 'Tmavý vzhled' : 'Světlý vzhled');
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
    if (action === 'cloud-load-all') {
      cloudLoadAllModules(true);
      return;
    }
    if (action === 'cloud-load-extras') {
      cloudLoadExtraCollections(true);
      return;
    }
    if (action === 'cloud-sync-local-extras') {
      cloudSyncLocalExtraCollections(true).then(() => cloudLoadExtraCollections(false));
      return;
    }
    if (action === 'cloud-sync-pending') {
      cloudSyncLocalPendingData(true);
      return;
    }
    if (action === 'cloud-sync-local-profiles') {
      cloudSyncLocalProfiles(true).then(() => cloudLoadProfilesForCurrentHousehold());
      return;
    }
    if (action === 'cloud-run-autosync-now') {
      runCloudAutosyncNow(true);
      return;
    }
    if (action === 'cloud-toggle-autosync') {
      setCloudAutosyncEnabled(state.cloud?.autoSyncEnabled === false);
      return;
    }
    if (action === 'cloud-oauth-google') {
      cloudOAuthSignIn('google', button.dataset.intent || 'login');
      return;
    }
    if (action === 'google-calendar-start') {
      googleCalendarStart({ cleanup: true });
      return;
    }
    if (action === 'google-calendar-reconnect') {
      sessionStorage.removeItem(GOOGLE_CALENDAR_RECONNECT_FLAG);
      startGoogleCalendarOAuthReconnect('Čistím staré pokusy a spouštím nové připojení Google kalendáře.', { force: true });
      return;
    }
    if (action === 'google-calendar-list-calendars') {
      googleCalendarListCalendars(true);
      return;
    }
    if (action === 'google-calendar-sync') {
      googleCalendarSync(button.dataset.sourceId || '');
      return;
    }
    if (action === 'google-calendar-disconnect') {
      googleCalendarDisconnect();
      return;
    }
    if (action === 'cloud-load-calendar') {
      cloudLoadCalendar(true);
      return;
    }
    if (action === 'cloud-load-calendar-sources') {
      cloudLoadCalendarSources(true);
      return;
    }
    if (action === 'cloud-sync-local-calendar-sources') {
      cloudSyncLocalCalendarSources(true);
      return;
    }
    if (action === 'calendar-toggle-source') {
      toggleCalendarSource(button.dataset.sourceId, button.dataset.enabled === 'true');
      return;
    }
    if (action === 'calendar-delete-source') {
      deleteCalendarSource(button.dataset.sourceId);
      return;
    }
    if (action === 'cloud-sync-local-calendar') {
      cloudSyncLocalCalendar();
      return;
    }
    if (action === 'cloud-sync-calendar') {
      cloudSyncCalendarById(button.dataset.id);
      return;
    }
    if (action === 'delete-calendar') {
      calendarDetailEventId = null;
      deleteCalendarEvent(button.dataset.id);
      return;
    }
    if (action === 'calendar-month-prev' || action === 'calendar-month-next' || action === 'calendar-month-today') {
      if (action === 'calendar-month-prev') calendarViewMonth = shiftCalendarMonth(calendarViewMonth, -1);
      if (action === 'calendar-month-next') calendarViewMonth = shiftCalendarMonth(calendarViewMonth, 1);
      if (action === 'calendar-month-today') calendarViewMonth = todayISO().slice(0, 7);
      if (!isDemoOnlyState()) localStorage.setItem('domacnostPlus.calendarViewMonth', calendarViewMonth);
      render();
      return;
    }
    if (action === 'calendar-event-detail') {
      calendarDetailEventId = button.dataset.id || '';
      render();
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
    if (action === 'toggle-dashboard-widget') {
      toggleDashboardWidget(button.dataset.id);
      return;
    }
    if (action === 'toggle-home-hero-item') {
      toggleHomeHeroItem(button.dataset.id);
      return;
    }
    if (action === 'home-hero-reset') {
      resetHomeHeroItems();
      return;
    }
    if (action === 'dashboard-reset-widgets') {
      resetDashboardWidgets();
      return;
    }
    if (action === 'weather-refresh') {
      ensureWeatherFresh(true).then(() => {
        const error = normalizeWeatherState(state.weather).error;
        showToast(error || 'Počasí obnoveno');
      });
      return;
    }
    if (action === 'soft-ui-reset') {
      localStorage.removeItem('homeWeb.activeModule');
      localStorage.removeItem('domacnostPlus.moduleTabs');
      activeModule = 'home';
      moduleTabs = {};
      render();
      showToast('UI stav vyčištěný');
      return;
    }
    if (action === 'garage-ui-repair') {
      normalizeGarageRuntimeState();
      garageEditRecord = null;
      garageModal = null;
      moduleTabs = { ...(moduleTabs || {}), garage: 'overview' };
      if (!isDemoOnlyState()) localStorage.setItem('domacnostPlus.moduleTabs', JSON.stringify(moduleTabs));
      touchState();
      saveState();
      render();
      showToast('Stav Garáže opravený');
      return;
    }
    if (action === 'delete-warranty') {
      deleteWarranty(button.dataset.id);
      return;
    }
    if (action === 'open-garage-detail') {
      openGarageDetailPanel(button.dataset.garageTarget || '');
      return;
    }
    if (action === 'select-vehicle') {
      garageVehicleId = button.dataset.id;
      garageEditRecord = null;
      activeOverview = null;
      activeModule = 'garage';
      if (!isDemoOnlyState()) localStorage.setItem('homeWeb.activeModule', activeModule);
      moduleTabs = { ...(moduleTabs || {}), garage: 'detail' };
      if (!isDemoOnlyState()) localStorage.setItem('domacnostPlus.moduleTabs', JSON.stringify(moduleTabs));
      const garageTarget = button.dataset.garageTarget || '';
      render();
      keepActiveSectionTabsCentered('smooth');
      if (garageTarget) window.setTimeout(() => openGarageDetailPanel(garageTarget), 60);
      return;
    }
    if (action === 'select-contract') {
      activeContractId = button.dataset.id;
      moduleTabs = { ...(moduleTabs || {}), contracts: 'detail' };
      if (!isDemoOnlyState()) localStorage.setItem('domacnostPlus.moduleTabs', JSON.stringify(moduleTabs));
      render();
      keepActiveSectionTabsCentered('smooth');
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
    if (action === 'cloud-sync-local-contract-files') {
      cloudSyncLocalContractFiles(true).then(() => cloudLoadContractFiles(false));
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
      const collection = button.dataset.collection;
      const id = button.dataset.id;
      const item = collection === 'fuel' ? state.fuel.find((entry) => entry.id === id) : state.services.find((entry) => entry.id === id);
      if (!item) return showToast('Záznam nenalezen');
      garageVehicleId = item.vehicleId || garageVehicleId;
      garageEditRecord = null;
      garageModal = { type: collection === 'fuel' ? 'edit-fuel' : 'edit-service', vehicleId: item.vehicleId || garageVehicleId, recordId: id };
      render();
      return;
    }
    if (action === 'cancel-garage-edit') {
      garageEditRecord = null;
      garageModal = null;
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
    if (action === 'polish-holidays-refresh') {
      refreshPolishShopHolidaysOnline();
      return;
    }
    if (action === 'cloud-bootstrap') {
      bootstrapCloudHousehold();
      return;
    }
    if (action === 'cloud-load-households') {
      cloudLoadHouseholds(true);
      return;
    }
    if (action === 'cloud-load-invitations') {
      cloudLoadInvitations(true);
      return;
    }
    if (action === 'cloud-accept-invitation') {
      cloudAcceptInvitation(button.dataset.id);
      return;
    }
    if (action === 'cloud-switch-household') {
      cloudSwitchHousehold(button.dataset.id, button.dataset.name);
      return;
    }
    if (action === 'cloud-archive-household') {
      cloudArchiveHouseholdForCurrentUser(button.dataset.id);
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
    if (action === 'cloud-load-tasks') {
      cloudLoadTasks(true);
      return;
    }
    if (action === 'cloud-sync-local-tasks') {
      cloudSyncLocalTasks();
      return;
    }
    if (action === 'cloud-sync-task') {
      cloudSyncTaskById(button.dataset.id);
      return;
    }
    if (action === 'task-toggle') {
      toggleTaskDone(button.dataset.id);
      return;
    }
    if (action === 'task-delete') {
      deleteTask(button.dataset.id);
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
    if (action === 'cloud-sync-finance-account') {
      cloudSyncFinanceAccountById(button.dataset.id);
      return;
    }
    if (action === 'cloud-sync-local-finance-accounts') {
      cloudSyncLocalFinanceAccounts();
      return;
    }
    if (action === 'delete-finance-account') {
      deleteFinanceAccount(button.dataset.id);
      return;
    }
    if (action === 'cloud-load-finance') {
      cloudLoadFinance(true);
      return;
    }
    if (action === 'cloud-sync-local-finance') {
      cloudSyncLocalFinance();
      return;
    }
    if (action === 'cloud-sync-finance') {
      cloudSyncFinanceById(button.dataset.id);
      return;
    }
    if (action === 'delete-finance') {
      deleteFinanceTransaction(button.dataset.id);
      return;
    }
    if (action === 'finance-month-prev') {
      shiftFinanceMonth(-1);
      return;
    }
    if (action === 'finance-month-current') {
      setFinanceMonth(todayISO().slice(0, 7));
      return;
    }
    if (action === 'finance-month-next') {
      shiftFinanceMonth(1);
      return;
    }
    if (action === 'finance-template') {
      fillFinanceTemplate(button.dataset.template);
      return;
    }
    if (action === 'pwa-install') {
      promptInstallApp();
      return;
    }
    if (action === 'pwa-run-diagnostics') {
      runPwaDiagnostics();
      return;
    }
    if (action === 'pwa-clear-cache') {
      clearPwaCacheAndReload();
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
    if (action === 'cloud-check-confirmation') {
      cloudCheckEmailConfirmation();
      return;
    }
    if (action === 'cloud-resend-confirmation') {
      cloudResendConfirmation();
      return;
    }
    if (action === 'cloud-refresh-session') {
      refreshCloudSession(true).then(() => setupCloudRealtimeSubscriptions(true));
      return;
    }
    if (action === 'cloud-start-realtime') {
      const ok = setupCloudRealtimeSubscriptions(true);
      showToast(ok ? 'Živá synchronizace zapnutá' : 'Realtime zatím nejde zapnout');
      render();
      return;
    }
    if (action === 'cloud-oauth-signin') {
      cloudOAuthSignIn(button.dataset.provider || 'google', button.dataset.intent || 'login');
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



  function isEditableTarget(target) {
    return Boolean(target?.closest?.('input, textarea, select, [contenteditable="true"], .selectable-text'));
  }

  function installAppLikeTouchGuards() {
    let lastTouchEnd = 0;
    const preventGesture = (event) => event.preventDefault();
    document.addEventListener('gesturestart', preventGesture, { passive: false });
    document.addEventListener('gesturechange', preventGesture, { passive: false });
    document.addEventListener('gestureend', preventGesture, { passive: false });
    document.addEventListener('touchmove', (event) => {
      if (event.touches && event.touches.length > 1 && !isEditableTarget(event.target)) event.preventDefault();
    }, { passive: false });
    document.addEventListener('touchend', (event) => {
      const current = Date.now();
      if (current - lastTouchEnd <= 300 && !isEditableTarget(event.target)) event.preventDefault();
      lastTouchEnd = current;
    }, { passive: false });
  }

  function addDiagnostic(checks, label, status, message) {
    checks.push({ label, status, message });
  }

  function loadImageInfo(src) {
    return new Promise((resolve) => {
      if (!src) {
        resolve({ ok: false, width: 0, height: 0, message: 'Chybí cesta' });
        return;
      }
      const image = new Image();
      const timer = window.setTimeout(() => {
        image.onload = null;
        image.onerror = null;
        resolve({ ok: false, width: 0, height: 0, message: 'Timeout načtení' });
      }, 6000);
      image.onload = () => {
        window.clearTimeout(timer);
        resolve({ ok: true, width: image.naturalWidth || image.width, height: image.naturalHeight || image.height, message: 'OK' });
      };
      image.onerror = () => {
        window.clearTimeout(timer);
        resolve({ ok: false, width: 0, height: 0, message: 'Obrázek se nenačetl' });
      };
      image.src = src;
    });
  }

  async function verifyIcon(checks, label, src, expectedWidth = 0) {
    const info = await loadImageInfo(src);
    if (!info.ok) {
      addDiagnostic(checks, label, 'bad', `${info.message}: ${src}`);
      return;
    }
    const sizeText = `${info.width}×${info.height}`;
    if (expectedWidth && (info.width < expectedWidth || info.height < expectedWidth)) {
      addDiagnostic(checks, label, 'warn', `Načteno, ale malé: ${sizeText}`);
      return;
    }
    addDiagnostic(checks, label, 'ok', `Načteno ${sizeText}`);
  }

  async function runPwaDiagnostics() {
    showToast('Spouštím PWA diagnostiku');
    const checks = [];
    const pwa = getPwaStatus();

    addDiagnostic(checks, 'HTTPS / Vercel', pwa.secure && !pwa.fileMode ? 'ok' : 'warn', pwa.fileMode ? 'Otevřeno jako lokální ZIP; instalace nebude spolehlivá.' : `Protokol: ${pwa.protocol}`);
    addDiagnostic(checks, 'Standalone režim', pwa.standalone ? 'ok' : 'warn', pwa.standalone ? 'Aplikace běží jako nainstalovaná.' : 'Aplikace zatím běží v prohlížeči.');
    addDiagnostic(checks, 'Service worker podpora', pwa.swSupported ? 'ok' : 'bad', pwa.swSupported ? 'Prohlížeč service worker podporuje.' : 'Service worker není dostupný.');
    addDiagnostic(checks, 'Service worker řízení stránky', pwa.swControlled ? 'ok' : 'warn', pwa.swControlled ? 'Aktivní service worker řídí stránku.' : 'Po prvním načtení může být potřeba stránku obnovit.');
    addDiagnostic(checks, 'Instalační prompt', pwa.canPrompt ? 'ok' : (pwa.ios ? 'warn' : 'warn'), pwa.canPrompt ? 'Chrome nabízí instalaci tlačítkem.' : (pwa.ios ? 'Na iPhonu se používá Sdílet → Přidat na plochu.' : 'Prohlížeč zatím neposlal instalační prompt.'));

    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (!manifestLink) {
      addDiagnostic(checks, 'Manifest odkaz', 'bad', 'V HTML chybí link rel="manifest".');
    } else {
      const manifestUrl = new URL(manifestLink.getAttribute('href'), location.href).href;
      addDiagnostic(checks, 'Manifest odkaz', 'ok', manifestUrl);
      try {
        const response = await fetch(manifestUrl, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const manifest = await response.json();
        addDiagnostic(checks, 'Manifest načtení', 'ok', `${manifest.name || 'bez názvu'} / ${manifest.display || 'bez display'}`);
        addDiagnostic(checks, 'Manifest display', manifest.display === 'standalone' ? 'ok' : 'warn', `display: ${manifest.display || 'neuvedeno'}`);
        const icons = Array.isArray(manifest.icons) ? manifest.icons : [];
        const has192 = icons.some((icon) => String(icon.sizes || '').includes('192x192'));
        const has512 = icons.some((icon) => String(icon.sizes || '').includes('512x512'));
        const hasMaskable = icons.some((icon) => String(icon.purpose || '').includes('maskable'));
        addDiagnostic(checks, 'Manifest ikony', has192 && has512 ? 'ok' : 'bad', `${icons.length} ikon, 192: ${has192 ? 'ano' : 'ne'}, 512: ${has512 ? 'ano' : 'ne'}, maskable: ${hasMaskable ? 'ano' : 'ne'}`);
        const icon512 = icons.find((icon) => String(icon.sizes || '').includes('512x512') && !String(icon.purpose || '').includes('maskable')) || icons.find((icon) => String(icon.sizes || '').includes('512x512'));
        const icon192 = icons.find((icon) => String(icon.sizes || '').includes('192x192') && !String(icon.purpose || '').includes('maskable')) || icons.find((icon) => String(icon.sizes || '').includes('192x192'));
        if (icon192?.src) await verifyIcon(checks, 'Manifest 192 ikona', new URL(icon192.src, manifestUrl).href, 192);
        if (icon512?.src) await verifyIcon(checks, 'Manifest 512 ikona', new URL(icon512.src, manifestUrl).href, 512);
      } catch (error) {
        addDiagnostic(checks, 'Manifest načtení', 'bad', error?.message || 'Manifest se nepodařilo načíst.');
      }
    }

    const appleLinks = Array.from(document.querySelectorAll('link[rel="apple-touch-icon"], link[rel="apple-touch-icon-precomposed"]'));
    addDiagnostic(checks, 'Apple touch odkazy', appleLinks.length >= 2 ? 'ok' : 'warn', `${appleLinks.length} odkazů v HTML`);
    const apple180 = appleLinks.find((link) => link.getAttribute('sizes') === '180x180') || appleLinks[0];
    if (apple180) await verifyIcon(checks, 'Apple touch ikona', new URL(apple180.getAttribute('href'), location.href).href, 120);
    await verifyIcon(checks, 'Apple touch ikona v assets/icons', new URL('./assets/icons/apple-touch-icon.png', location.href).href, 120);
    await verifyIcon(checks, 'Favicon v assets/icons', new URL('./assets/icons/favicon.ico', location.href).href, 16);

    state.pwa = {
      ...(state.pwa || {}),
      diagnostics: {
        checkedAt: new Date().toISOString(),
        appVersion: APP_VERSION,
        pageUrl: location.href,
        checks
      }
    };
    saveState();
    render();
    const bad = checks.filter((item) => item.status === 'bad').length;
    const warn = checks.filter((item) => item.status === 'warn').length;
    showToast(bad ? `Diagnostika našla ${bad} chyb` : warn ? `Diagnostika hotová, ${warn} upozornění` : 'Diagnostika OK');
  }

  async function clearPwaCacheAndReload() {
    try {
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.filter((key) => key.includes('domacnost-plus')).map((key) => caches.delete(key)));
      }
      if (serviceWorkerRegistration) await serviceWorkerRegistration.update();
      showToast('Cache vyčištěná, načítám znovu');
      window.setTimeout(() => window.location.reload(), 500);
    } catch {
      showToast('Cache se nepovedlo vyčistit');
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
    try {
      const sessionResult = await client.auth.getSession?.();
      const token = sessionResult?.data?.session?.access_token;
      if (token && client.realtime?.setAuth) client.realtime.setAuth(token);
    } catch (sessionError) {
      console.warn('Realtime auth refresh failed', sessionError);
    }
    if (error || !data?.user) {
      resetSignedOutAppState();
      saveState();
      if (showMessage) showToast('Nejsi přihlášený');
      render();
      return null;
    }
    const previousUserId = state.cloud?.userId || '';
    if (previousUserId && previousUserId !== data.user.id) {
      resetLocalWorkspaceForCloudUser(data.user, { previousUserId, force: true });
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
    await cloudWarmStartLoad(false, true);
    render();
    showToast('Přihlášeno a cloud domácnost načtená');
  }

  async function cloudSignUp(email, password) {
    const client = getSupabaseClient();
    if (!client) return showToast('Supabase knihovna není načtená');
    const { data, error } = await client.auth.signUp({
      email: normalizeText(email),
      password: String(password || ''),
      options: {
        emailRedirectTo: getAuthRedirectUrl(),
        data: { app_name: 'Domácnost+' }
      }
    });
    if (error) {
      if (isExistingAccountSignUpResponse(data, error)) return markExistingAccount(email);
      return showToast(error.message || 'Registrace se nepovedla');
    }
    if (isExistingAccountSignUpResponse(data, null)) return markExistingAccount(email);
    const user = data?.user;
    if (user) {
      state.cloud = { ...(state.cloud || {}), supabaseUrl: SUPABASE_URL, provider: 'supabase', status: data.session ? 'signed-in' : 'email-confirmation', userId: user.id, email: user.email || normalizeText(email) };
      saveState();
      if (data.session && state.household?.isConfigured && !state.cloud?.householdId) {
        await bootstrapCloudHousehold(false);
        await cloudLoadAllModules(false, { skipRealtimeSetup: true, silentWhenOffline: true });
      }
      render();
    }
    showToast(data.session ? 'Účet vytvořený a domácnost napojená na cloud' : 'Zkontroluj e-mail pro potvrzení');
  }



  async function cloudResendConfirmation() {
    const client = getSupabaseClient();
    if (!client) return showToast('Supabase knihovna není načtená');
    const email = normalizeText(state.cloud?.email || window.prompt('E-mail pro ověření') || '').toLowerCase();
    if (!email) return showToast('Doplň e-mail');
    const { error } = await client.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: getAuthRedirectUrl() }
    });
    if (error) return showToast(error.message || 'E-mail se nepovedlo odeslat');
    state.cloud = { ...(state.cloud || {}), supabaseUrl: SUPABASE_URL, provider: 'supabase', status: 'email-confirmation', email };
    saveState();
    render();
    showToast('Ověřovací e-mail znovu odeslán');
  }

  async function cloudCheckEmailConfirmation() {
    const user = await refreshCloudSession(false);
    if (!user) {
      showToast('Zatím nejsi přihlášený. Zkus kliknout na odkaz v e-mailu nebo se přihlásit heslem.');
      return;
    }
    state.cloud = { ...(state.cloud || {}), status: 'signed-in', userId: user.id, email: user.email || state.cloud?.email || '' };
    const households = await cloudLoadHouseholds(false);
    if (households.length && !state.cloud.householdId) {
      const preferredHousehold = pickBestCloudHousehold(households);
      state.cloud.householdId = preferredHousehold.id;
      state.household = { ...(state.household || {}), id: preferredHousehold.id, name: preferredHousehold.name || state.household?.name || 'Domácnost', isConfigured: true };
    }
    if (state.household?.isConfigured && !state.cloud.householdId) {
      await bootstrapCloudHousehold(false);
    }
    if (state.cloud.householdId) {
      await cloudLoadProfilesForCurrentHousehold();
      await cloudLoadAllModules(false);
    }
    onboardingMode = state.household?.isConfigured ? 'choice' : 'account';
    sessionStorage.removeItem('domacnostPlus.onboardingMode');
    touchState();
    saveState();
    render();
    showToast('E-mail je ověřený a účet je přihlášený');
  }

  function googleDisplayNameFromUser(user) {
    const meta = user?.user_metadata || {};
    return normalizeText(meta.full_name || meta.name || user?.email?.split('@')?.[0] || 'Já') || 'Já';
  }

  function captureCurrentHouseholdWorkspace() {
    const snapshot = {
      savedAt: new Date().toISOString(),
      household: structuredCloneSafe(state.household || {}),
      profiles: structuredCloneSafe(state.profiles || []),
      activeProfileId: state.activeProfileId || '',
      enabledModules: structuredCloneSafe(state.enabledModules || []),
      settings: {
        bottomNavIds: structuredCloneSafe(state.settings?.bottomNavIds || []),
        homeHeroItems: structuredCloneSafe(state.settings?.homeHeroItems || []),
        dashboardWidgets: structuredCloneSafe(state.settings?.dashboardWidgets || []),
        theme: state.settings?.theme || 'light'
      },
      collections: {}
    };
    getCollectionNames().forEach((collection) => {
      snapshot.collections[collection] = structuredCloneSafe(state[collection] || []);
    });
    return snapshot;
  }

  function resetCloudModuleCachesForUserSwitch() {
    state.shoppingCloud = structuredCloneSafe(DEFAULT_STATE.shoppingCloud);
    state.hdoCloud = structuredCloneSafe(DEFAULT_STATE.hdoCloud);
    state.wasteCloud = structuredCloneSafe(DEFAULT_STATE.wasteCloud);
    state.parcelsCloud = structuredCloneSafe(DEFAULT_STATE.parcelsCloud);
    state.tasksCloud = structuredCloneSafe(DEFAULT_STATE.tasksCloud);
    state.calendarCloud = structuredCloneSafe(DEFAULT_STATE.calendarCloud);
    state.financeCloud = structuredCloneSafe(DEFAULT_STATE.financeCloud);
    state.householdExtrasCloud = structuredCloneSafe(DEFAULT_STATE.householdExtrasCloud);
  }

  function resetLocalWorkspaceForCloudUser(user, options = {}) {
    const force = options.force === true;
    const previousUserId = options.previousUserId || state.cloud?.userId || '';
    const nextUserId = user?.id || '';
    if (!force && (!nextUserId || previousUserId === nextUserId)) return false;

    if (previousUserId && previousUserId !== nextUserId && !isDemoOnlyState()) {
      state.householdWorkspaces = {
        ...(state.householdWorkspaces || {}),
        [previousUserId]: captureCurrentHouseholdWorkspace()
      };
    }

    const now = new Date().toISOString();
    const localHouseholdId = `household-${uid()}`;
    const profile = createProfile(googleDisplayNameFromUser(user), 'owner', localHouseholdId);
    state.household = {
      id: localHouseholdId,
      name: 'Moje domácnost',
      isConfigured: true,
      createdAt: now
    };
    state.profiles = [profile];
    state.activeProfileId = profile.id;
    getCollectionNames().forEach((collection) => {
      state[collection] = [];
    });
    resetCloudModuleCachesForUserSwitch();
    state.settings = {
      ...(state.settings || {}),
      demoMode: false,
      cloudEnabled: true,
      dashboardWidgets: [],
      homeHeroItems: [],
      bottomNavIds: normalizeBottomNavIds(state.settings?.bottomNavIds || DEFAULT_BOTTOM_NAV_IDS, state.enabledModules)
    };
    state.enabledModules = normalizeModuleList(state.enabledModules?.length ? state.enabledModules : MANAGED_MODULE_IDS);
    state.cloud = {
      ...(state.cloud || {}),
      supabaseUrl: SUPABASE_URL,
      provider: 'supabase',
      status: 'signed-in',
      userId: nextUserId,
      email: user?.email || '',
      householdId: '',
      households: [],
      invitations: [],
      profilesLoadedAt: '',
      lastSyncAt: '',
      lastRealtimeAt: '',
      lastAutosyncAt: '',
      localPendingCount: 0,
      autosyncStatus: 'idle',
      realtimeStatus: 'offline'
    };
    return true;
  }

  function ensureLocalHouseholdForGoogleAuth(user) {
    if (!state.household?.isConfigured) {
      state.household = {
        ...(state.household || {}),
        id: state.household?.id || `household-${uid()}`,
        name: state.household?.name || 'Moje domácnost',
        isConfigured: true,
        createdAt: state.household?.createdAt || new Date().toISOString()
      };
    }
    if (!Array.isArray(state.profiles) || !state.profiles.length) {
      const profile = createProfile(googleDisplayNameFromUser(user), 'owner', state.household.id);
      state.profiles = [profile];
      state.activeProfileId = profile.id;
    }
    state.settings.demoMode = false;
    state.enabledModules = normalizeModuleList(state.enabledModules?.length ? state.enabledModules : MANAGED_MODULE_IDS);
    state.settings.bottomNavIds = normalizeBottomNavIds(state.settings.bottomNavIds || DEFAULT_BOTTOM_NAV_IDS, state.enabledModules);
  }

  async function handleGoogleAuthReturn() {
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    const user = await refreshCloudSession(false);
    if (!user) {
      showToast('Google přihlášení se nevrátilo do aplikace. Zkontroluj Supabase Auth Google provider.');
      return;
    }

    const intent = sessionStorage.getItem(ONBOARDING_GOOGLE_INTENT_KEY) || 'login';
    if (intent === 'register') {
      resetLocalWorkspaceForCloudUser(user, { force: true });
      state.household = {
        ...(state.household || {}),
        id: state.household?.id || `household-${uid()}`,
        name: '',
        isConfigured: false,
        createdAt: state.household?.createdAt || new Date().toISOString()
      };
      state.profiles = [createProfile(googleDisplayNameFromUser(user), 'owner', state.household.id)];
      state.activeProfileId = state.profiles[0]?.id || '';
      state.settings.demoMode = false;
      onboardingMode = 'google-setup';
      sessionStorage.setItem('domacnostPlus.onboardingMode', 'google-setup');
      sessionStorage.removeItem(DEMO_SESSION_KEY);
      touchState();
      saveState();
      clearAuthReturnUrl(true);
      render();
      showToast('Google účet je přihlášený. Dokonči nastavení domácnosti.');
      return;
    }

    ensureLocalHouseholdForGoogleAuth(user);
    saveState();
    const households = await cloudLoadHouseholds(false);
    if (!households.length) {
      onboardingMode = 'google-setup';
      sessionStorage.setItem('domacnostPlus.onboardingMode', 'google-setup');
      sessionStorage.removeItem(DEMO_SESSION_KEY);
      clearAuthReturnUrl(true);
      render();
      showToast('Google účet zatím nemá domácnost. Dokonči nastavení domácnosti.');
      return;
    } else if (!state.cloud?.householdId) {
      const preferredHousehold = pickBestCloudHousehold(households);
      state.cloud.householdId = preferredHousehold.id;
      state.household = { ...(state.household || {}), id: preferredHousehold.id, name: preferredHousehold.name || state.household?.name || 'Domácnost', isConfigured: true };
    }
    if (state.cloud?.householdId) {
      await cloudLoadProfilesForCurrentHousehold();
      await cloudLoadAllModules(false, { skipRealtimeSetup: true, silentWhenOffline: true });
      activeModule = 'home';
    }
    onboardingMode = 'choice';
    sessionStorage.removeItem('domacnostPlus.onboardingMode');
    sessionStorage.removeItem(ONBOARDING_GOOGLE_INTENT_KEY);
    sessionStorage.removeItem(DEMO_SESSION_KEY);
    touchState();
    saveState();
    render();
    showToast('Přihlášeno přes Google');
  }

  function isAuthReturnUrl() {
    const search = new URLSearchParams(window.location.search || '');
    if (search.get('auth') === 'confirmed') return true;
    if (search.get('auth') === 'google') return true;
    if (search.has('code') && search.has('state')) return true;
    if (search.get('type') === 'signup') return true;
    const hash = window.location.hash || '';
    return hash.includes('access_token=') || hash.includes('refresh_token=') || hash.includes('type=signup');
  }

  function hasGoogleCalendarReturnUrl() {
    const params = new URLSearchParams(window.location.search || '');
    return params.has('googleCalendar');
  }

  function clearAuthReturnUrl(force = false) {
    if (!force && !isAuthReturnUrl() && !hasGoogleCalendarReturnUrl()) return;
    const clean = `${window.location.origin}${window.location.pathname}`;
    window.history.replaceState({}, document.title, clean);
  }

  async function handleInitialAuthReturn() {
    if (hasGoogleCalendarReturnUrl()) {
      const params = new URLSearchParams(window.location.search || '');
      const result = params.get('googleCalendar');
      activeModule = 'calendar';
      moduleTabs = { ...(moduleTabs || {}), calendar: 'sources' };
      if (!isDemoOnlyState()) localStorage.setItem('domacnostPlus.moduleTabs', JSON.stringify(moduleTabs));
      render();
      const reason = params.get('reason') || '';
      if (result === 'connected') {
        const alreadyAutoLoaded = sessionStorage.getItem(GOOGLE_CALENDAR_CALLBACK_AUTOLOAD_FLAG) === '1';
        if (!alreadyAutoLoaded) {
          sessionStorage.setItem(GOOGLE_CALENDAR_CALLBACK_AUTOLOAD_FLAG, '1');
          showToast('Google účet připojený. Jednou zkusím načíst kalendáře.');
          await googleCalendarListCalendars(false);
        } else {
          showToast('Google callback už byl zpracovaný. Další načtení spusť ručně.');
        }
      } else if (result === 'error') {
        rememberGoogleCalendarError({ code: reason || 'google_calendar_callback_error', error: reason === 'token_store_failed' ? 'Token exchange proběhl, ale uložení tokenu přes serverové RPC selhalo. Zkontroluj SQL RPC migraci, GOOGLE_TOKEN_ENCRYPTION_KEY_BASE64 a service role práva.' : 'Google připojení se nepovedlo. Zkontroluj redirect_uri, scopes a Edge Function secrets.' });
        showToast(reason === 'token_store_failed' ? 'Google token se nepovedlo uložit. Zkontroluj Supabase secrets.' : 'Google připojení se nepovedlo.');
      }
      clearAuthReturnUrl(true);
      return;
    }
    if (!isAuthReturnUrl()) return;
    const search = new URLSearchParams(window.location.search || '');
    if (search.get('auth') === 'google' || (search.has('code') && search.has('state'))) {
      await handleGoogleAuthReturn();
      clearAuthReturnUrl(true);
      return;
    }
    await new Promise((resolve) => window.setTimeout(resolve, 450));
    await cloudCheckEmailConfirmation();
    clearAuthReturnUrl();
  }

  function scoreCloudHouseholdCandidate(item) {
    if (!item) return 0;
    let score = 0;
    const activeId = state.cloud?.householdId || '';
    const localName = normalizeText(state.household?.name || state.settings?.householdName || '').toLowerCase();
    const candidateName = normalizeText(item.name || '').toLowerCase();
    if (item.id && item.id === activeId) score += 10000;
    if (candidateName && localName && candidateName === localName) score += 800;
    if (item.role === 'owner') score += 300;
    if (item.status === 'active') score += 100;
    const created = Date.parse(item.createdAt || '');
    if (Number.isFinite(created)) score += Math.min(250, Math.max(0, created / 100000000000));
    return score;
  }

  function pickBestCloudHousehold(households = []) {
    return [...households].sort((a, b) => scoreCloudHouseholdCandidate(b) - scoreCloudHouseholdCandidate(a))[0] || null;
  }

  function hasMultipleCloudHouseholds() {
    return Array.isArray(state.cloud?.households) && state.cloud.households.length > 1;
  }

  async function cloudLoadHouseholds(showMessage = false) {
    const client = getSupabaseClient();
    if (!client) { if (showMessage) showToast('Supabase knihovna není načtená'); return []; }
    const user = await refreshCloudSession(false);
    if (!user) { if (showMessage) showToast('Nejdřív se přihlas'); return []; }
    const { data, error } = await client
      .from('household_members')
      .select('household_id, role, status, households(id, name, timezone, dashboard_layout, weather_location, created_at)')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: true });
    if (error) { if (showMessage) showToast(error.message || 'Domácnosti se nepovedlo načíst'); return []; }
    const households = (data || []).map((row) => ({
      id: row.household_id,
      role: row.role || 'member',
      status: row.status || 'active',
      name: row.households?.name || 'Domácnost',
      timezone: row.households?.timezone || 'Europe/Prague',
      dashboardLayout: row.households?.dashboard_layout || {},
      weatherLocation: row.households?.weather_location || {},
      createdAt: row.households?.created_at || ''
    })).filter((item) => item.id);
    state.cloud = { ...(state.cloud || {}), households, lastSyncAt: new Date().toISOString() };
    const currentCloudHouseholdValid = households.some((item) => item.id === state.cloud.householdId);
    if (state.cloud.householdId && !currentCloudHouseholdValid) {
      state.cloud.householdId = '';
      state.cloud.profilesLoadedAt = '';
      resetCloudModuleCachesForUserSwitch();
    }
    if (!households.length) {
      state.cloud.householdId = '';
      state.household = { ...(state.household || {}), isConfigured: Boolean(state.household?.isConfigured) };
      touchState();
      saveState();
      render();
      if (showMessage) showToast('Tenhle účet zatím nemá žádnou domácnost');
      return [];
    }
    if (!state.cloud.householdId) {
      const preferredHousehold = pickBestCloudHousehold(households);
      state.cloud.householdId = preferredHousehold.id;
      state.household = { ...(state.household || {}), id: preferredHousehold.id, name: preferredHousehold.name || state.household?.name || 'Domácnost', isConfigured: true };
    }
    const activeHousehold = households.find((item) => item.id === state.cloud.householdId);
    if (activeHousehold) {
      state.household = { ...(state.household || {}), id: activeHousehold.id, name: activeHousehold.name || state.household?.name || 'Domácnost', isConfigured: true };
      applyCloudHouseholdUiSettings(activeHousehold);
    }
    touchState();
    saveState();
    render();
    if (showMessage) showToast(`Načteno domácností: ${households.length}`);
    return households;
  }

  function applyCloudHouseholdUiSettings(household) {
    if (!household) return;
    const layout = household.dashboardLayout || household.dashboard_layout || {};
    const weatherLocation = household.weatherLocation || household.weather_location || {};
    if (Array.isArray(layout.widgets)) state.settings.dashboardWidgets = normalizeDashboardWidgetIds(layout.widgets);
    else if (Array.isArray(layout.dashboardWidgets)) state.settings.dashboardWidgets = normalizeDashboardWidgetIds(layout.dashboardWidgets);
    if (Array.isArray(layout.heroItems)) state.settings.homeHeroItems = normalizeHomeHeroIds(layout.heroItems);
    else if (Array.isArray(layout.homeHeroItems)) state.settings.homeHeroItems = normalizeHomeHeroIds(layout.homeHeroItems);
    if (layout.vehicleIconColors && typeof layout.vehicleIconColors === 'object') {
      state.settings.vehicleIconColors = normalizeVehicleIconColorMap(layout.vehicleIconColors);
      (state.vehicles || []).forEach((vehicle) => {
        vehicle.iconColor = normalizeVehicleIconColor(vehicle.iconColor || vehicleIconColorFromSettings(vehicle));
      });
    }
    if (Array.isArray(layout.warranties)) {
      state.warranties = normalizeWarranties(layout.warranties);
    }
    if (weatherLocation && typeof weatherLocation === 'object' && Object.keys(weatherLocation).length) {
      state.weather = {
        ...normalizeWeatherState(state.weather),
        location: normalizeWeatherLocation(weatherLocation),
        source: normalizeWeatherSource(weatherLocation.source || weatherLocation.provider || state.weather?.source)
      };
    }
  }

  function householdUiPayload() {
    return {
      dashboard_layout: {
        widgets: normalizeDashboardWidgetIds(state.settings?.dashboardWidgets),
        heroItems: normalizeHomeHeroIds(state.settings?.homeHeroItems),
        vehicleIconColors: normalizeVehicleIconColorMap(state.settings?.vehicleIconColors),
        warranties: normalizeWarranties(state.warranties),
        updatedAt: new Date().toISOString(),
        appBuild: 116
      },
      weather_location: {
        ...normalizeWeatherLocation(state.weather?.location),
        source: normalizeWeatherSource(state.weather?.source)
      }
    };
  }

  async function cloudSaveHouseholdUiSettings(showMessage = false, includeName = false) {
    if (!cloudReady()) return false;
    const client = getSupabaseClient();
    if (!client) return false;
    const { error } = await client
      .from('households')
      .update(includeName ? { ...householdUiPayload(), name: householdName() } : householdUiPayload())
      .eq('id', state.cloud.householdId);
    if (error) {
      if (showMessage) showToast(error.message || 'Nastavení hlavní obrazovky se nepovedlo uložit do cloudu');
      return false;
    }
    state.cloud.lastSyncAt = new Date().toISOString();
    saveState();
    if (showMessage) showToast('Nastavení hlavní obrazovky uloženo do cloudu');
    return true;
  }

  async function cloudLoadHouseholdUiSettings(showMessage = false) {
    if (!cloudReady()) return false;
    const client = getSupabaseClient();
    if (!client) return false;
    const { data, error } = await client
      .from('households')
      .select('id, name, dashboard_layout, weather_location')
      .eq('id', state.cloud.householdId)
      .single();
    if (error) {
      if (showMessage) showToast(error.message || 'Nastavení domácnosti se nepovedlo načíst');
      return false;
    }
    if (data) {
      state.household.name = data.name || state.household.name || 'Domácnost';
      applyCloudHouseholdUiSettings(data);
      state.cloud.lastSyncAt = new Date().toISOString();
      touchState();
      saveState();
      render();
    }
    if (showMessage) showToast('Nastavení hlavní obrazovky načtené');
    return true;
  }

  function currentWorkspaceKey() {
    return state.cloud?.householdId || state.household?.id || 'local';
  }

  function saveHouseholdWorkspace() {
    const key = currentWorkspaceKey();
    if (!key) return;
    state.householdWorkspaces = state.householdWorkspaces || {};
    const snapshot = {
      household: structuredCloneSafe(state.household),
      profiles: structuredCloneSafe(state.profiles),
      activeProfileId: state.activeProfileId,
      collections: {}
    };
    getCollectionNames().forEach((collection) => {
      snapshot.collections[collection] = structuredCloneSafe(state[collection] || []);
    });
    state.householdWorkspaces[key] = snapshot;
  }

  function restoreHouseholdWorkspace(key, cloudName = 'Domácnost') {
    const snapshot = state.householdWorkspaces?.[key];
    if (snapshot) {
      state.household = structuredCloneSafe(snapshot.household || state.household);
      state.profiles = structuredCloneSafe(snapshot.profiles || []);
      state.activeProfileId = snapshot.activeProfileId || state.profiles[0]?.id || '';
      getCollectionNames().forEach((collection) => {
        state[collection] = structuredCloneSafe(snapshot.collections?.[collection] || []);
      });
    } else {
      state.household = {
        id: `household-${key}`,
        name: cloudName || 'Domácnost',
        isConfigured: true,
        createdAt: new Date().toISOString()
      };
      state.profiles = [createProfile(currentProfile()?.name || 'Já', 'owner', state.household.id)];
      state.activeProfileId = state.profiles[0]?.id || '';
      getCollectionNames().forEach((collection) => { state[collection] = []; });
      state.shoppingStats = {};
    }
  }

  async function cloudSwitchHousehold(householdId, name = 'Domácnost') {
    if (!householdId || householdId === state.cloud?.householdId) return;
    const ok = window.confirm(`Přepnout na domácnost „${name || 'Domácnost'}“? Lokální pohled aktuální domácnosti se uloží odděleně.`);
    if (!ok) return;
    saveHouseholdWorkspace();
    state.cloud.householdId = householdId;
    restoreHouseholdWorkspace(householdId, name);
    state.household.name = name || state.household.name || 'Domácnost';
    state.cloud.lastSyncAt = new Date().toISOString();
    activeModule = 'home';
    touchState();
    saveState();
    render();
    await cloudLoadAllModules(false);
    showToast('Domácnost přepnuta');
  }

  async function cloudCreateHousehold(name, profileName) {
    const cleanName = normalizeText(name) || 'Nová domácnost';
    const client = getSupabaseClient();
    if (!client) return showToast('Supabase knihovna není načtená');
    const user = await refreshCloudSession(false);
    if (!user) return showToast('Nejdřív se přihlas');
    saveHouseholdWorkspace();
    const { data: household, error: householdError } = await client
      .from('households')
      .insert({ name: cleanName, timezone: 'Europe/Prague', app_build: 108, schema_version: 68, created_by: user.id, ...householdUiPayload() })
      .select('id, name')
      .single();
    if (householdError) return showToast(householdError.message || 'Domácnost se nepovedla vytvořit');
    const { error: memberError } = await client.from('household_members').insert({
      household_id: household.id,
      user_id: user.id,
      role: 'owner',
      status: 'active',
      display_name: normalizeText(profileName) || currentProfile()?.name || user.email || 'Owner',
      joined_at: new Date().toISOString()
    });
    if (memberError) return showToast(memberError.message || 'Člen domácnosti se nepovedl vytvořit');
    state.cloud.householdId = household.id;
    restoreHouseholdWorkspace(household.id, household.name);
    state.household.name = household.name;
    const cleanProfileName = normalizeText(profileName) || currentProfile()?.name || 'Já';
    state.profiles = [createProfile(cleanProfileName, 'owner', state.household.id)];
    state.activeProfileId = state.profiles[0].id;
    await client.from('profiles').insert({ household_id: household.id, user_id: user.id, name: cleanProfileName, is_default: true, created_by: user.id });
    await cloudLoadHouseholds(false);
    setupCloudRealtimeSubscriptions(true);
    touchState();
    saveState();
    render();
    showToast('Nová domácnost vytvořena');
  }

  async function cloudArchiveHouseholdForCurrentUser(householdId) {
    const cleanId = normalizeText(householdId);
    if (!cleanId) return;
    if (cleanId === state.cloud?.householdId) {
      showToast('Aktivní domácnost nejdřív přepni na jinou, pak ji můžeš skrýt');
      return;
    }
    const client = getSupabaseClient();
    if (!client) return showToast('Supabase knihovna není načtená');
    const user = await refreshCloudSession(false);
    if (!user) return showToast('Nejdřív se přihlas');
    const ok = window.confirm('Skrýt tuhle domácnost z mého účtu? Data v databázi se nemažou, jen se ukončí tvoje aktivní členství.');
    if (!ok) return;
    const { error } = await client
      .from('household_members')
      .update({ status: 'archived', updated_at: new Date().toISOString() })
      .eq('household_id', cleanId)
      .eq('user_id', user.id);
    if (error) return showToast(error.message || 'Domácnost se nepovedlo skrýt');
    state.cloud.households = (state.cloud.households || []).filter((item) => item.id !== cleanId);
    touchState();
    saveState();
    render();
    showToast('Domácnost skrytá z aktivního seznamu');
  }

  async function cloudInviteMember(email, role = 'member') {
    const cleanEmail = normalizeText(email).toLowerCase();
    if (!cleanEmail || !state.cloud?.householdId) return showToast('Doplň e-mail a napoj domácnost na cloud');
    const client = getSupabaseClient();
    if (!client) return showToast('Supabase knihovna není načtená');
    const user = await refreshCloudSession(false);
    if (!user) return showToast('Nejdřív se přihlas');
    const payload = {
      household_id: state.cloud.householdId,
      email: cleanEmail,
      role: ['admin', 'member', 'read_only'].includes(role) ? role : 'member',
      status: 'pending',
      invited_by: user.id,
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString()
    };
    const { data, error } = await client.from('household_invitations').insert(payload).select('id, household_id, email, role, status, expires_at, created_at').single();
    if (error) return showToast(error.message || 'Pozvánku se nepovedlo vytvořit');
    state.cloud.invitations = [...(state.cloud.invitations || []).filter((item) => item.id !== data.id), mapCloudInvitation(data)];
    touchState();
    saveState();
    render();
    showToast('Pozvánka vytvořena');
  }

  function mapCloudInvitation(item) {
    return {
      id: item.id,
      householdId: item.household_id,
      email: item.email,
      role: item.role,
      status: item.status,
      expiresAt: item.expires_at,
      createdAt: item.created_at,
      cloudId: item.id
    };
  }

  async function cloudLoadInvitations(showMessage = true) {
    const client = getSupabaseClient();
    if (!client) { if (showMessage) showToast('Supabase knihovna není načtená'); return []; }
    const user = await refreshCloudSession(false);
    if (!user) { if (showMessage) showToast('Nejdřív se přihlas'); return []; }
    const { data, error } = await client
      .from('household_invitations')
      .select('id, household_id, email, role, status, expires_at, created_at')
      .in('status', ['pending', 'expired'])
      .order('created_at', { ascending: false });
    if (error) { if (showMessage) showToast(error.message || 'Pozvánky se nepovedlo načíst'); return []; }
    state.cloud.invitations = (data || []).map(mapCloudInvitation);
    touchState();
    saveState();
    render();
    if (showMessage) showToast(`Načteno pozvánek: ${state.cloud.invitations.length}`);
    return state.cloud.invitations;
  }

  async function cloudAcceptInvitation(invitationId) {
    if (!invitationId) return;
    const client = getSupabaseClient();
    if (!client) return showToast('Supabase knihovna není načtená');
    const user = await refreshCloudSession(false);
    if (!user) return showToast('Nejdřív se přihlas');
    const displayName = currentProfile()?.name || user.email || 'Člen domácnosti';
    const { data: householdId, error } = await client.rpc('accept_household_invitation', {
      invitation_id: invitationId,
      member_display_name: displayName
    });
    if (error) return showToast(error.message || 'Pozvánku se nepovedlo přijmout');
    await cloudLoadHouseholds(false);
    const accepted = state.cloud.invitations?.find((item) => item.id === invitationId);
    saveHouseholdWorkspace();
    state.cloud.householdId = householdId;
    restoreHouseholdWorkspace(householdId, accepted?.householdName || 'Sdílená domácnost');
    state.cloud.lastSyncAt = new Date().toISOString();
    await cloudLoadProfilesForCurrentHousehold();
    await cloudLoadAllModules(false);
    await cloudLoadInvitations(false);
    activeModule = 'home';
    touchState();
    saveState();
    render();
    showToast('Pozvánka přijata');
  }


  async function cloudLoadProfilesForCurrentHousehold() {
    const client = getSupabaseClient();
    if (!client || !state.cloud?.householdId) return false;
    const previousActive = state.profiles?.find((profile) => profile.id === state.activeProfileId) || null;
    const { data, error } = await client
      .from('profiles')
      .select('id, name, user_id, avatar_emoji, color, is_default, created_at')
      .eq('household_id', state.cloud.householdId)
      .eq('is_archived', false)
      .order('created_at', { ascending: true });
    if (error) return false;
    if (!data?.length) return false;
    state.profiles = data.map((profile, index) => ({
      id: profile.id,
      cloudId: profile.id,
      householdId: state.cloud.householdId,
      name: profile.name || `Profil ${index + 1}`,
      avatarEmoji: profile.avatar_emoji || '🙂',
      color: profile.color || ['blue', 'green', 'violet', 'orange'][index % 4],
      role: profile.user_id === state.cloud.userId ? 'member' : 'member',
      userId: profile.user_id || '',
      isDefault: Boolean(profile.is_default),
      createdAt: profile.created_at || new Date().toISOString()
    }));
    const preserved = state.profiles.find((profile) => profile.cloudId && profile.cloudId === previousActive?.cloudId)
      || state.profiles.find((profile) => normalizeText(profile.name).toLowerCase() === normalizeText(previousActive?.name).toLowerCase())
      || state.profiles.find((profile) => profile.isDefault)
      || state.profiles[0];
    state.activeProfileId = preserved?.id || '';
    state.cloud.profilesLoadedAt = new Date().toISOString();
    state.cloud.lastSyncAt = new Date().toISOString();
    return true;
  }

  async function cloudLogout() {
    disposeCloudRealtime();
    const client = getSupabaseClient();
    if (client) await client.auth.signOut().catch(() => {});
    resetSignedOutAppState();
    saveState();
    document.documentElement.dataset.theme = state.settings.theme || 'light';
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

    const households = await cloudLoadHouseholds(false);
    if (cloudHouseholdId && !households.some((item) => item.id === cloudHouseholdId)) {
      cloudHouseholdId = '';
      state.cloud.householdId = '';
    }
    if (!cloudHouseholdId) {
      const preferredHousehold = pickBestCloudHousehold(households);
      if (preferredHousehold?.id) {
        cloudHouseholdId = preferredHousehold.id;
        state.household = { ...(state.household || {}), id: preferredHousehold.id, name: preferredHousehold.name || state.household?.name || 'Domácnost', isConfigured: true };
        applyCloudHouseholdUiSettings(preferredHousehold);
      }
    }

    if (!cloudHouseholdId) {
      const { data: household, error: householdError } = await client
        .from('households')
        .insert({
          name: householdName(),
          timezone: 'Europe/Prague',
          app_build: 108,
          schema_version: 68,
          created_by: user.id,
          ...householdUiPayload()
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
    setupCloudRealtimeSubscriptions(true);
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

  async function deleteProfile(id) {
    if (state.profiles.length <= 1) {
      showToast('Poslední profil nejde smazat');
      return;
    }
    const profile = state.profiles.find((item) => item.id === id);
    if (!profile) return;
    const confirmed = window.confirm(`Smazat profil ${profile.name}? Data z modulů zůstanou uložená, jen už nebudou patřit aktivnímu profilu.`);
    if (!confirmed) return;
    const ok = await cloudArchiveProfile(profile);
    if (!ok) return;
    state.profiles = state.profiles.filter((item) => item.id !== id);
    if (state.activeProfileId === id) state.activeProfileId = state.profiles[0]?.id || '';
    touchState();
    saveState();
    render();
    showToast(profile.cloudId ? 'Profil smazán v cloudu' : 'Profil smazán');
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


  function toggleDashboardWidget(widgetId) {
    if (!DASHBOARD_WIDGETS.some((widget) => widget.id === widgetId)) return;
    const selected = new Set(normalizeDashboardWidgetIds(state.settings?.dashboardWidgets));
    if (selected.has(widgetId)) {
      if (selected.size <= 1) {
        showToast('Na hlavní obrazovce nech aspoň jednu kartu');
        return;
      }
      selected.delete(widgetId);
    } else {
      selected.add(widgetId);
    }
    state.settings.dashboardWidgets = normalizeDashboardWidgetIds([...selected]);
    touchState();
    saveState();
    cloudSaveHouseholdUiSettings(false);
    render();
  }

  function resetDashboardWidgets() {
    state.settings.dashboardWidgets = [...DEFAULT_DASHBOARD_WIDGET_IDS];
    touchState();
    saveState();
    cloudSaveHouseholdUiSettings(false);
    render();
    showToast('Home vyčištěná');
  }

  function toggleHomeHeroItem(itemId) {
    if (!HOME_HERO_ITEMS.some((item) => item.id === itemId)) return;
    const selected = new Set(normalizeHomeHeroIds(state.settings?.homeHeroItems));
    if (selected.has(itemId)) {
      selected.delete(itemId);
    } else {
      if (selected.size >= HOME_HERO_MAX) return showToast(`V horním panelu nech nejvýš ${HOME_HERO_MAX} položek`);
      selected.add(itemId);
    }
    state.settings.homeHeroItems = normalizeHomeHeroIds([...selected]);
    touchState();
    saveState();
    cloudSaveHouseholdUiSettings(false);
    render();
  }

  function resetHomeHeroItems() {
    state.settings.homeHeroItems = [...DEFAULT_HOME_HERO_IDS];
    touchState();
    saveState();
    cloudSaveHouseholdUiSettings(false);
    render();
    showToast('Panely na Home vyčištěné');
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
    if (extraCloudConfig(collection)) {
      const item = state[collection].find((entry) => entry.id === id);
      const ok = await cloudDeleteExtraItem(collection, item);
      if (!ok) return;
    }
    state[collection] = state[collection].filter((item) => item.id !== id);
    touchState();
    saveState();
    render();
    showToast('Smazáno');
  }

  async function toggleBoolean(collection, id, key) {
    const item = state[collection]?.find((entry) => entry.id === id);
    if (!item) return;
    item[key] = !item[key];
    const ok = await cloudUpdateExtraItem(collection, item);
    if (!ok) {
      item[key] = !item[key];
      return;
    }
    touchState();
    saveState();
    render();
  }

  async function deleteVehicle(id) {
    const vehicle = state.vehicles.find((item) => item.id === id);
    if (!vehicle) return showToast('Auto nenalezeno');
    const fuelCount = state.fuel.filter((item) => item.vehicleId === id).length;
    const serviceCount = state.services.filter((item) => item.vehicleId === id).length;
    const message = `Opravdu smazat auto "${vehicle.name || 'Auto'}"?\n\nSmaže se i ${fuelCount} tankování a ${serviceCount} servisních/nákladových záznamů.`;
    if (typeof window !== 'undefined' && typeof window.confirm === 'function' && !window.confirm(message)) return;
    const ok = await cloudDeleteVehicle(vehicle);
    if (!ok) return;
    state.vehicles = state.vehicles.filter((entry) => entry.id !== id);
    state.fuel = state.fuel.filter((item) => item.vehicleId !== id);
    state.services = state.services.filter((item) => item.vehicleId !== id);
    if (garageVehicleId === id) garageVehicleId = state.vehicles[0]?.id || null;
    touchState();
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
    link.download = `domacnost-plus-v0-1-116-${todayISO()}.json`; 
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
    if (suppressToastDepth > 0) return;
    const toast = document.getElementById('copy-toast');
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
  }


  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (garageModal || calendarDetailEventId) {
      garageModal = null;
      calendarDetailEventId = null;
      garageEditRecord = null;
      render();
      return;
    }
    if (activeOverview) closeOverview();
  });

  app.addEventListener('click', (event) => {
    const backdrop = event.target.closest('[data-overview-backdrop]');
    if (backdrop && !event.target.closest('[data-overview-panel]')) {
      closeOverview();
      return;
    }
    const modalBackdrop = event.target.closest('[data-modal-backdrop]');
    if (modalBackdrop && !event.target.closest('.app-modal')) {
      garageModal = null;
      calendarDetailEventId = null;
      garageEditRecord = null;
      render();
      return;
    }

    const nav = event.target.closest('[data-nav]');
    if (nav) {
      activeOverview = null;
      activeModule = nav.dataset.nav;
      if (nav.dataset.targetTab) {
        moduleTabs = { ...(moduleTabs || {}), [activeModule]: nav.dataset.targetTab };
        if (!isDemoOnlyState()) localStorage.setItem('domacnostPlus.moduleTabs', JSON.stringify(moduleTabs));
      }
      render();
      keepActiveNavCentered('smooth');
      keepActiveSectionTabsCentered('smooth');
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
    if (profileSwitch) {
      setActiveProfile(profileSwitch.value);
      return;
    }
    const garageHistoryFilter = event.target.closest('[data-garage-history-filter]');
    if (garageHistoryFilter) {
      if (garageHistoryFilter.dataset.garageHistoryFilter === 'year') garageHistoryYearFilter = garageHistoryFilter.value || 'all';
      if (garageHistoryFilter.dataset.garageHistoryFilter === 'type') garageHistoryTypeFilter = garageHistoryFilter.value || 'all';
      garageEditRecord = null;
      render();
    }
  });

  app.addEventListener('input', (event) => {
    const hdoTimeInput = event.target.closest('[data-hdo-time-input]');
    if (hdoTimeInput) formatHdoTimeInputLive(hdoTimeInput, event);
    const fuelCalcInput = event.target.closest('[data-fuel-calc]');
    if (fuelCalcInput) fillFuelFormCalculation(fuelCalcInput.form, fuelCalcInput);
    const warrantyPurchase = event.target.closest('form[data-form="add-warranty"] input[name="purchaseDate"]');
    if (warrantyPurchase) {
      const form = warrantyPurchase.form;
      const until = form?.querySelector('[name="warrantyUntil"]');
      const expectedToday = addYearsIso(todayISO(), 2);
      if (until && (!until.value || until.value === expectedToday || until.dataset.autoWarranty === 'true')) {
        until.value = addYearsIso(warrantyPurchase.value || todayISO(), 2);
        until.dataset.autoWarranty = 'true';
      }
    }
    const warrantyUntil = event.target.closest('form[data-form="add-warranty"] input[name="warrantyUntil"]');
    if (warrantyUntil) warrantyUntil.dataset.autoWarranty = 'false';
  });

  app.addEventListener('focusout', (event) => {
    const hdoTimeInput = event.target.closest('[data-hdo-time-input]');
    if (hdoTimeInput) normalizeHdoTimeInputOnBlur(hdoTimeInput);
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
  installAppLikeTouchGuards();

  render();
  cloudWarmStartLoad(false).catch((error) => console.warn('Cloud warm start failed', error));
  handleInitialAuthReturn().catch((error) => console.warn('Auth return handling failed', error));

  } catch (error) {
    console.error('Domácnost+ boot failed', error);
    renderBootFallback(error);
  }

  function renderBootFallback(error) {
    const root = document.getElementById('app');
    if (!root) return;
    const message = escapeBootText(error?.message || error?.reason || String(error || 'Neznámá chyba při spuštění'));
    root.innerHTML = `
      <div class="boot-fallback-screen">
        <section class="boot-fallback-card">
          <div class="brand-mark big logo-mark">🏠</div>
          <span class="badge">Domácnost+ v.0.1_116</span>
          <h1>Aplikace se nespustila čistě</h1>
          <p>Nezůstáváš na bílé stránce. Nejčastější příčina je stará PWA cache nebo uložený stav rozhraní po aktualizaci.</p>
          <div class="inline-note boot-error-text"><strong>Technicky:</strong><br>${message}</div>
          <div class="form-actions">
            <button class="primary-btn" type="button" data-boot-action="reload">Obnovit aplikaci</button>
            <button class="ghost-btn" type="button" data-boot-action="soft-reset">Vyčistit rozhraní a obnovit</button>
          </div>
          <p class="small-muted">Soft reset nemaže data domácnosti. Smaže jen aktivní záložku/modul a staré dočasné nastavení UI.</p>
        </section>
      </div>
    `;
    root.querySelector('[data-boot-action="reload"]')?.addEventListener('click', () => window.location.reload());
    root.querySelector('[data-boot-action="soft-reset"]')?.addEventListener('click', async () => {
      try {
        window.localStorage?.removeItem('homeWeb.activeModule');
        window.localStorage?.removeItem('domacnostPlus.moduleTabs');
        window.sessionStorage?.removeItem('domacnostPlus.onboardingMode');
      } catch {}
      try {
        if ('caches' in window) {
          const keys = await caches.keys();
          await Promise.all(keys.filter((key) => key.startsWith('domacnost-plus-')).map((key) => caches.delete(key)));
        }
      } catch {}
      window.location.reload();
    });
  }

  function escapeBootText(value) {
    return String(value || '').replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
  }
})();
