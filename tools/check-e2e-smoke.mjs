#!/usr/bin/env node
// Domácnost+ real-browser E2E smoke.
// Dependency-free: spustí lokální statický server, najde systémový Chrome/Edge,
// připojí se přes Chrome DevTools Protocol a ověří základní boot + nové moduly.

import { createServer } from 'node:http';
import { mkdtempSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn, spawnSync } from 'node:child_process';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, '..');
const required = process.env.E2E_REQUIRED === '1' || process.env.CI === 'true';
const timeoutMs = Number(process.env.E2E_TIMEOUT_MS || 25000);
const appSource = readFileSync(join(projectRoot, 'app.js'), 'utf8');
const buildMatch = appSource.match(/const APP_BUILD = (\d+);/);
const expectedBuild = buildMatch ? buildMatch[1] : '0';
const notes = [];
const errors = [];

function ok(message) {
  notes.push(message);
}

function fail(message) {
  errors.push(message);
}

function shouldSkip(message) {
  if (required) {
    fail(message);
    return false;
  }
  console.log(`E2E smoke přeskočen: ${message}`);
  process.exit(0);
}

function commandPath(command) {
  const lookup = process.platform === 'win32' ? 'where' : 'which';
  const result = spawnSync(lookup, [command], { encoding: 'utf8' });
  if (result.status !== 0) return '';
  return String(result.stdout || '').split(/\r?\n/).map((line) => line.trim()).find(Boolean) || '';
}

function browserCandidates() {
  const envCandidates = [
    process.env.CHROME_PATH,
    process.env.EDGE_PATH,
    process.env.BROWSER_PATH
  ].filter(Boolean);
  const pathCandidates = process.platform === 'win32'
    ? [
        join(process.env.ProgramFiles || 'C:\\Program Files', 'Google\\Chrome\\Application\\chrome.exe'),
        join(process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)', 'Google\\Chrome\\Application\\chrome.exe'),
        join(process.env.ProgramFiles || 'C:\\Program Files', 'Microsoft\\Edge\\Application\\msedge.exe'),
        join(process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)', 'Microsoft\\Edge\\Application\\msedge.exe')
      ]
    : process.platform === 'darwin'
      ? [
          '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
          '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
          '/Applications/Chromium.app/Contents/MacOS/Chromium'
        ]
      : [
          '/usr/bin/google-chrome',
          '/usr/bin/google-chrome-stable',
          '/usr/bin/chromium',
          '/usr/bin/chromium-browser',
          '/snap/bin/chromium',
          '/usr/bin/microsoft-edge',
          '/usr/bin/microsoft-edge-stable'
        ];
  const commandCandidates = ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'msedge']
    .map(commandPath)
    .filter(Boolean);
  return [...envCandidates, ...pathCandidates, ...commandCandidates];
}

function findBrowser() {
  return browserCandidates().find((candidate) => existsSync(candidate)) || '';
}

function mimeType(filePath) {
  return {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.webmanifest': 'application/manifest+json; charset=utf-8',
    '.png': 'image/png',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp'
  }[extname(filePath)] || 'application/octet-stream';
}

function supabaseStubScript() {
  return `<script defer>
    window.supabase = {
      createClient: function () {
        const chain = {
          select: function () { return chain; },
          insert: function () { return chain; },
          update: function () { return chain; },
          delete: function () { return chain; },
          eq: function () { return chain; },
          in: function () { return chain; },
          order: function () { return chain; },
          limit: function () { return chain; },
          single: function () { return Promise.resolve({ data: null, error: null }); },
          maybeSingle: function () { return Promise.resolve({ data: null, error: null }); },
          then: function (resolve) { return Promise.resolve({ data: [], error: null }).then(resolve); }
        };
        return {
          auth: {
            getSession: function () { return Promise.resolve({ data: { session: null }, error: null }); },
            onAuthStateChange: function () { return { data: { subscription: { unsubscribe: function () {} } } }; },
            signInWithPassword: function () { return Promise.resolve({ data: {}, error: null }); },
            signUp: function () { return Promise.resolve({ data: {}, error: null }); },
            signOut: function () { return Promise.resolve({ error: null }); },
            resetPasswordForEmail: function () { return Promise.resolve({ error: null }); },
            updateUser: function () { return Promise.resolve({ data: {}, error: null }); }
          },
          from: function () { return chain; },
          channel: function () { return { on: function () { return this; }, subscribe: function () { return this; }, unsubscribe: function () {} }; },
          removeChannel: function () { return Promise.resolve('ok'); },
          storage: { from: function () { return { upload: function () { return Promise.resolve({ data: {}, error: null }); }, download: function () { return Promise.resolve({ data: null, error: null }); }, remove: function () { return Promise.resolve({ data: [], error: null }); }, getPublicUrl: function () { return { data: { publicUrl: '' } }; } }; } }
        };
      }
    };
  </script>`;
}

function startStaticServer() {
  const server = createServer((req, res) => {
    try {
      const url = new URL(req.url || '/', 'http://127.0.0.1');
      let pathname = decodeURIComponent(url.pathname || '/');
      if (pathname === '/') pathname = '/index.html';
      const safePath = normalize(pathname).replace(/^[/\\]+/, '');
      const filePath = resolve(projectRoot, safePath);
      if (!filePath.startsWith(projectRoot)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }
      if (safePath === 'index.html') {
        const html = readFileSync(filePath, 'utf8')
          .replace(/<script\s+src="https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js@2"\s+defer><\/script>/, supabaseStubScript());
        res.writeHead(200, { 'Content-Type': mimeType(filePath), 'Cache-Control': 'no-store' });
        res.end(html);
        return;
      }
      const data = readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': mimeType(filePath), 'Cache-Control': 'no-store' });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
  });
  return new Promise((resolveServer) => {
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      resolveServer({ server, url: `http://127.0.0.1:${port}/` });
    });
  });
}

async function waitForJson(url, timeout = timeoutMs) {
  const start = Date.now();
  let lastError = null;
  while (Date.now() - start < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, 150));
  }
  throw lastError || new Error(`Timeout waiting for ${url}`);
}

function connectCdp(wsUrl) {
  if (typeof WebSocket !== 'function') {
    shouldSkip('Node runtime nemá global WebSocket pro CDP.');
  }
  const socket = new WebSocket(wsUrl);
  const pending = new Map();
  let id = 0;
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) return;
    const { resolveResult, rejectResult } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) rejectResult(new Error(message.error.message || JSON.stringify(message.error)));
    else resolveResult(message.result);
  });
  const openPromise = new Promise((resolveOpen, rejectOpen) => {
    socket.addEventListener('open', resolveOpen, { once: true });
    socket.addEventListener('error', () => rejectOpen(new Error('CDP WebSocket connection failed')), { once: true });
  });
  return {
    socket,
    open: openPromise,
    send(method, params = {}) {
      const nextId = ++id;
      const promise = new Promise((resolveResult, rejectResult) => {
        pending.set(nextId, { resolveResult, rejectResult });
      });
      socket.send(JSON.stringify({ id: nextId, method, params }));
      return promise;
    },
    close() {
      try { socket.close(); } catch {}
    }
  };
}

function smokeSeedScript() {
  const seed = {
    meta: { schemaVersion: 85, appBuild: Number(expectedBuild), mode: 'e2e-smoke', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    household: { id: 'household-e2e-smoke', name: 'Smoke domácnost', isConfigured: true, createdAt: new Date().toISOString() },
    profiles: [{ id: 'profile-e2e-smoke', name: 'Smoke', role: 'admin', createdAt: new Date().toISOString() }],
    activeProfileId: 'profile-e2e-smoke',
    enabledModules: ['weather', 'calendar', 'shopping', 'hdo', 'waste', 'readings', 'pool', 'tasks', 'warranties', 'polishHolidays', 'garage', 'contracts', 'finance', 'subscriptions'],
    vehicles: [{
      id: 'vehicle-e2e-smoke',
      householdId: 'household-e2e-smoke',
      profileId: 'profile-e2e-smoke',
      name: 'Smoke auto',
      brand: 'Test',
      model: 'Modal',
      year: '2024',
      plate: 'SMK 351',
      fuelType: 'benzín',
      odometer: 45000,
      technicalInspectionUntil: '2027-01-01',
      insuranceUntil: '2026-12-31',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }],
    fuel: [{
      id: 'fuel-e2e-smoke',
      vehicleId: 'vehicle-e2e-smoke',
      date: '2026-06-30',
      odometer: 44800,
      liters: 42,
      pricePerLiter: 38.9,
      price: 1633.8,
      note: 'E2E smoke',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }],
    services: [{
      id: 'service-e2e-smoke',
      vehicleId: 'vehicle-e2e-smoke',
      date: '2026-06-20',
      odometer: 44000,
      title: 'Smoke servis',
      price: 2500,
      note: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }],
    settings: {
      bottomNavIds: ['home', 'finance', 'pool', 'contracts', 'calendar'],
      homeHeroItems: ['pool', 'finance', 'calendar', 'garage'],
      dashboardWidgets: []
    },
    contracts: [{
      id: 'contract-e2e-smoke',
      householdId: 'household-e2e-smoke',
      profileId: 'profile-e2e-smoke',
      name: 'Smoke pojistka',
      type: 'home_insurance',
      provider: 'Test',
      number: 'SMOKE-1',
      validFrom: '2026-01-01',
      validTo: '2026-12-31',
      amount: 1200,
      frequency: 'monthly',
      note: 'E2E smoke',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }],
    financeLoans: [{
      id: 'loan-e2e-smoke',
      name: 'Smoke půjčka',
      lender: 'Test',
      loanType: 'consumer',
      principal: 120000,
      currentBalance: 90000,
      interestRate: 7.9,
      monthlyPayment: 3100,
      remainingMonths: 36,
      earlyRepaymentFee: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }],
    pool: {
      shape: 'rect',
      length: 6,
      width: 3,
      depth: 1.2,
      ph: 7.6,
      waterTempC: 24.5,
      targetPh: 7.2,
      dosePer10m3Per01: 100,
      measurements: [
        { id: 'pool-measure-1', date: '2026-06-28', ph: 7.3, waterTempC: 22.2, note: 'start' },
        { id: 'pool-measure-2', date: '2026-06-30', ph: 7.5, waterTempC: 23.8, note: '' },
        { id: 'pool-measure-3', date: '2026-07-02', ph: 7.6, waterTempC: 24.5, note: 'smoke' }
      ],
      updatedAt: new Date().toISOString()
    },
    cloud: {
      provider: 'supabase',
      status: 'signed-in',
      userId: 'user-e2e-smoke',
      email: 'smoke@example.test',
      householdId: 'household-e2e-smoke',
      lastSyncAt: '',
      autoSyncEnabled: false
    }
  };
  const auth = {
    access_token: 'e2e-access-token',
    refresh_token: 'e2e-refresh-token',
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    user: { id: 'user-e2e-smoke', email: 'smoke@example.test' }
  };
  return `
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem('domacnostPlus.v0.1_86', ${JSON.stringify(JSON.stringify(seed))});
    localStorage.setItem('domacnost-plus-auth', ${JSON.stringify(JSON.stringify(auth))});
    localStorage.setItem('domacnostPlus.moduleTabs', JSON.stringify({ finance: 'loans' }));
  `;
}

async function run() {
  const browserPath = findBrowser();
  if (!browserPath) shouldSkip('nenalezený Chrome/Chromium/Edge binary.');
  ok(`browser: ${browserPath}`);

  const { server, url } = await startStaticServer();
  const userDataDir = mkdtempSync(join(tmpdir(), 'domacnost-e2e-'));
  const debugPort = 9300 + Math.floor(Math.random() * 400);
  const browserProcess = spawn(browserPath, [
    '--headless=new',
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-background-networking',
    '--disable-extensions',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--no-sandbox',
    'about:blank'
  ], { stdio: ['ignore', 'ignore', 'pipe'] });

  let cdp = null;
  let page = null;
  try {
    browserProcess.stderr.setEncoding('utf8');
    const version = await waitForJson(`http://127.0.0.1:${debugPort}/json/version`);
    const browserCdp = connectCdp(version.webSocketDebuggerUrl);
    await browserCdp.open;
    const target = await browserCdp.send('Target.createTarget', { url: 'about:blank' });
    const targets = await waitForJson(`http://127.0.0.1:${debugPort}/json/list`);
    const tabInfo = targets.find((item) => item.id === target.targetId) || targets.find((item) => item.type === 'page');
    if (!tabInfo?.webSocketDebuggerUrl) throw new Error('Nepovedlo se získat CDP URL pro stránku.');
    page = connectCdp(tabInfo.webSocketDebuggerUrl);
    await page.open;
    await page.send('Page.enable');
    await page.send('Runtime.enable');
    await page.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await page.send('Page.addScriptToEvaluateOnNewDocument', { source: smokeSeedScript() });
    await page.send('Page.navigate', { url });
    await new Promise((resolveWait) => setTimeout(resolveWait, 2500));

    const initial = await page.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const text = document.body?.innerText || '';
        const homeMain = document.querySelector('.home-redesign-shell.home-app-shell main');
        const homeMainStyle = homeMain ? getComputedStyle(homeMain) : null;
        const homePrimary = document.querySelector('.home-primary-action');
        const homePrimaryStyle = homePrimary ? getComputedStyle(homePrimary) : null;
        const homeStatus = document.querySelector('.home-status-card');
        const homeStatusStyle = homeStatus ? getComputedStyle(homeStatus) : null;
        const homeAttention = document.querySelector('.home-attention-item');
        const homeAttentionStyle = homeAttention ? getComputedStyle(homeAttention) : null;
        const homeAttentionMeta = homeAttention ? homeAttention.querySelector('.home-attention-copy em') : null;
        const homeAttentionMetaStyle = homeAttentionMeta ? getComputedStyle(homeAttentionMeta) : null;
        const homeShortcut = document.querySelector('.home-module-shortcut');
        const homeShortcutStyle = homeShortcut ? getComputedStyle(homeShortcut) : null;
        return {
          title: document.title,
          appStarted: Boolean(window.__DOMACNOST_APP_STARTED__),
          appRoot: Boolean(document.querySelector('#app')),
          versionOk: document.title.includes('v.0.1_${expectedBuild}') || text.includes('v.0.1_${expectedBuild}'),
          bootError: Boolean(document.querySelector('.module-error-card, .app-boot-error')),
          homeRedesign: Boolean(document.querySelector('.home-dashboard-redesign')),
          homeDailyHero: Boolean(document.querySelector('.home-daily-hero')),
          homeOldHero: Boolean(document.querySelector('.home-minimal-hero, .dashboard-empty-home')),
          homeMainScrollable: Boolean(homeMainStyle && /auto|scroll/.test(homeMainStyle.overflowY)),
          homeSummaryCopy: Boolean(document.querySelector('.home-daily-hero .station-summary-copy')),
          homeDaily: Boolean(document.querySelector('[data-dashboard-widget="daily"]')),
          homePrimary: Boolean(document.querySelector('.home-primary-action')),
          homeStatusCount: document.querySelectorAll('.home-status-card').length,
          homeAttention: Boolean(document.querySelector('.home-attention-list')),
          homeModules: Boolean(document.querySelector('.home-module-strip .home-module-shortcut')),
          homePrimarySurface: Boolean(homePrimaryStyle && homePrimaryStyle.display === 'grid' && parseFloat(homePrimaryStyle.borderTopLeftRadius) >= 16),
          homeStatusSurface: Boolean(homeStatusStyle && homeStatusStyle.display === 'grid' && parseFloat(homeStatusStyle.borderTopLeftRadius) >= 16),
          homeAttentionSurface: Boolean(homeAttentionStyle && homeAttentionStyle.display === 'grid' && parseFloat(homeAttentionStyle.borderTopLeftRadius) >= 16),
          homeAttentionClamp: Boolean(homeAttentionMetaStyle && homeAttentionMetaStyle.webkitLineClamp === '2'),
          homeShortcutSurface: Boolean(homeShortcutStyle && homeShortcutStyle.display === 'grid' && parseFloat(homeShortcutStyle.borderTopLeftRadius) >= 16),
          bottomNavCount: document.querySelectorAll('.nav-shell .nav-item').length,
          navPool: Boolean(document.querySelector('[data-nav="pool"]')),
          navFinance: Boolean(document.querySelector('[data-nav="finance"]')),
          navContracts: Boolean(document.querySelector('[data-nav="contracts"]')),
          textSample: text.slice(0, 600)
        };
      })()`
    });
    const initialValue = initial.result?.value || {};
    if (process.env.E2E_DEBUG === '1') {
      console.log('DEBUG initial:', JSON.stringify(initialValue, null, 2));
    }
    let bootOk = true;
    if (!initialValue.appStarted) { fail('App nenastavila __DOMACNOST_APP_STARTED__.'); bootOk = false; }
    if (!initialValue.appRoot) { fail('Chybí #app root.'); bootOk = false; }
    if (!initialValue.versionOk) { fail(`Na stránce/title není v0.1_${expectedBuild}.`); bootOk = false; }
    if (initialValue.bootError) { fail('Po bootu je vidět module/app error card.'); bootOk = false; }
    if (!initialValue.homeRedesign) { fail('Home nepoužívá nový home-dashboard-redesign layout.'); bootOk = false; }
    if (!initialValue.homeDailyHero) { fail('Home nepoužívá nový home-daily-hero panel.'); bootOk = false; }
    if (initialValue.homeOldHero) { fail('Home znovu vykresluje starý full-height hero layout.'); bootOk = false; }
    if (!initialValue.homeMainScrollable) { fail('Nový Home main není scrollovatelný.'); bootOk = false; }
    if (!initialValue.homeSummaryCopy) { fail('Home denní panel nemá textové bloky station-summary-copy.'); bootOk = false; }
    if (!initialValue.homeDaily) { fail('Home neobsahuje denní přehled.'); bootOk = false; }
    if (!initialValue.homePrimary) { fail('Home neobsahuje hlavní akční kartu.'); bootOk = false; }
    if (initialValue.homeStatusCount < 4) { fail('Home nemá čtyři stavové karty.'); bootOk = false; }
    if (!initialValue.homeAttention) { fail('Home neobsahuje seznam Dnes a brzy.'); bootOk = false; }
    if (!initialValue.homeModules) { fail('Home neobsahuje zkratky modulů.'); bootOk = false; }
    if (!initialValue.homePrimarySurface) { fail('Home hlavní akce nemá sjednocený dashboard povrch.'); bootOk = false; }
    if (!initialValue.homeStatusSurface) { fail('Home stavová karta nemá sjednocený dashboard povrch.'); bootOk = false; }
    if (!initialValue.homeAttentionSurface) { fail('Home pozornostní řádek nemá sjednocený dashboard povrch.'); bootOk = false; }
    if (!initialValue.homeAttentionClamp) { fail('Home pozornostní metadata nemají kontrolovaný dvouřádkový ořez.'); bootOk = false; }
    if (!initialValue.homeShortcutSurface) { fail('Home modulová zkratka nemá sjednocený dashboard povrch.'); bootOk = false; }
    if (initialValue.bottomNavCount !== 5) { fail(`Spodní lišta má ${initialValue.bottomNavCount} položek místo 5 včetně Více.`); bootOk = false; }
    if (!initialValue.navPool) { fail('Po seed bootu není dostupná navigace Bazén.'); bootOk = false; }
    if (!initialValue.navFinance) { fail('Po seed bootu není dostupná navigace Finance.'); bootOk = false; }
    if (!initialValue.navContracts) { fail('Po seed bootu není dostupná navigace Smlouvy.'); bootOk = false; }
    if (bootOk) ok('boot: nový Home, app root, verze, Finance, Bazén i Smlouvy navigace dostupné.');

    await page.send('Runtime.evaluate', {
      expression: `document.querySelector('.nav-shell [data-nav="more"]')?.click()`
    });
    await new Promise((resolveWait) => setTimeout(resolveWait, 400));
    const moreCheck = await page.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const headings = Array.from(document.querySelectorAll('.more-module-section h2')).map((node) => node.textContent.trim());
        return {
          settings: Boolean(document.querySelector('.more-settings-card[data-nav="settings"]')),
          sectionCount: document.querySelectorAll('.more-module-section').length,
          hasDaily: headings.includes('Denně'),
          hasHome: headings.includes('Domov'),
          hasMoney: headings.includes('Peníze a doklady'),
          moduleShortcutCount: document.querySelectorAll('.more-module-section [data-nav]').length
        };
      })()`
    });
    const moreValue = moreCheck.result?.value || {};
    let moreOk = true;
    if (!moreValue.settings) { fail('Více neobsahuje vstup do Nastavení.'); moreOk = false; }
    if (moreValue.sectionCount < 3) { fail('Více nemá skupiny modulů.'); moreOk = false; }
    if (!moreValue.hasDaily) { fail('Více nemá sekci Denně.'); moreOk = false; }
    if (!moreValue.hasHome) { fail('Více nemá sekci Domov.'); moreOk = false; }
    if (!moreValue.hasMoney) { fail('Více nemá sekci Peníze a doklady.'); moreOk = false; }
    if (moreValue.moduleShortcutCount < 8) { fail('Více nemá dost modulových zkratek.'); moreOk = false; }
    if (moreOk) ok('Více: nastavení a skupiny modulů renderují.');

    await page.send('Runtime.evaluate', {
      expression: `document.querySelector('.more-settings-card[data-nav="settings"]')?.click()`
    });
    await new Promise((resolveWait) => setTimeout(resolveWait, 500));
    const settingsCheck = await page.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const settings = document.querySelector('.settings-tabbed[data-tab-area="settings"]');
        document.querySelector('.section-tabs [data-area="settings"][data-tab="data"]')?.click();
        const card = document.querySelector('.compact-settings-card');
        const cardStyle = card ? getComputedStyle(card) : null;
        const visualChoice = document.querySelector('.visual-choice-card');
        const visualChoiceStyle = visualChoice ? getComputedStyle(visualChoice) : null;
        const importDrawer = document.querySelector('.panel-data .settings-form-drawer');
        if (importDrawer) importDrawer.open = true;
        const importTextarea = document.querySelector('.panel-data textarea[name="json"]');
        const importTextareaStyle = importTextarea ? getComputedStyle(importTextarea) : null;
        return {
          settings: Boolean(settings),
          settingsClass: settings?.className || '',
          compactCardCount: document.querySelectorAll('.compact-settings-card').length,
          visualChoiceCount: document.querySelectorAll('.visual-choice-card').length,
          settingsText: (settings?.innerText || '').slice(0, 220),
          cardSurface: Boolean(cardStyle && parseFloat(cardStyle.borderTopLeftRadius) >= 16),
          cardDisplay: cardStyle?.display || '',
          cardRadius: cardStyle?.borderTopLeftRadius || '',
          cardBackground: cardStyle?.backgroundColor || '',
          visualChoiceSurface: Boolean(visualChoiceStyle && visualChoiceStyle.display === 'grid' && parseFloat(visualChoiceStyle.borderTopLeftRadius) >= 16),
          visualChoiceDisplay: visualChoiceStyle?.display || '',
          visualChoiceRadius: visualChoiceStyle?.borderTopLeftRadius || '',
          dataPanel: Boolean(document.querySelector('.settings-tab-data .panel-data, .panel-data')),
          importDrawer: Boolean(importDrawer),
          importTextarea: Boolean(importTextareaStyle && parseFloat(importTextareaStyle.minHeight) >= 120)
        };
      })()`
    });
    const settingsValue = settingsCheck.result?.value || {};
    if (process.env.E2E_DEBUG === '1') {
      console.log('DEBUG settings:', JSON.stringify(settingsValue, null, 2));
    }
    let settingsOk = true;
    if (!settingsValue.settings) { fail('Nastavení nerenderuje settings-tabbed layout.'); settingsOk = false; }
    if (!settingsValue.cardSurface) { fail('Nastavení karty nemají sjednocený povrch.'); settingsOk = false; }
    if (!settingsValue.visualChoiceSurface) { fail('Nastavení vzhledu nemá nový grid povrch voleb.'); settingsOk = false; }
    if (!settingsValue.dataPanel) { fail('Nastavení Data panel není dostupný.'); settingsOk = false; }
    if (!settingsValue.importDrawer) { fail('Nastavení Data nemá import drawer.'); settingsOk = false; }
    if (!settingsValue.importTextarea) { fail('Import JSON textarea nemá stabilní výšku.'); settingsOk = false; }
    if (settingsOk) ok('Nastavení: karty, volby vzhledu a import dat renderují v novém povrchu.');

    await page.send('Runtime.evaluate', {
      expression: `document.querySelector('[data-nav="pool"]')?.click()`
    });
    await new Promise((resolveWait) => setTimeout(resolveWait, 500));
    const poolCheck = await page.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const text = document.body?.innerText || '';
        const metricsRail = document.querySelector('[data-module-cockpit="pool"] .module-cockpit-metrics');
        const metricsStyle = metricsRail ? getComputedStyle(metricsRail) : null;
        const poolChartWrap = document.querySelector('.pool-chart-wrap');
        const poolChartWrapStyle = poolChartWrap ? getComputedStyle(poolChartWrap) : null;
        return {
          cockpit: Boolean(document.querySelector('[data-module-cockpit="pool"]')),
          cockpitNoSwipe: Boolean(document.querySelector('[data-module-cockpit="pool"][data-no-swipe]')),
          cockpitMetrics: document.querySelectorAll('[data-module-cockpit="pool"] .module-cockpit-metric').length,
          cockpitActions: document.querySelectorAll('[data-module-cockpit="pool"] .module-cockpit-actions button').length,
          metricRailScrollable: Boolean(metricsRail && metricsStyle && /auto|scroll/.test(metricsStyle.overflowX) && metricsRail.scrollWidth > metricsRail.clientWidth),
          form: Boolean(document.querySelector('form[data-form="pool-settings"]')),
          tempInput: Boolean(document.querySelector('form[data-form="pool-settings"] input[name="waterTempC"]')),
          volume: text.includes('21,6 m³') || text.includes('21.6 m³') || text.includes('objem vody'),
          ph: text.includes('pH') && (text.includes('pH-') || text.includes('pH+')),
          temperature: text.includes('Teplota vody') && text.includes('24,5'),
          chart: Boolean(document.querySelector('.pool-chart .pool-chart-line.ph')) && Boolean(document.querySelector('.pool-chart .pool-chart-line.temp')),
          chartSurface: Boolean(poolChartWrapStyle && parseFloat(poolChartWrapStyle.borderTopLeftRadius) >= 16 && poolChartWrapStyle.overflow === 'hidden')
        };
      })()`
    });
    const poolValue = poolCheck.result?.value || {};
    if (process.env.E2E_DEBUG === '1') {
      console.log('DEBUG pool:', JSON.stringify(poolValue, null, 2));
    }
    let poolOk = true;
    if (!poolValue.cockpit) { fail('Bazén nemá horní module cockpit.'); poolOk = false; }
    if (!poolValue.cockpitNoSwipe) { fail('Bazén cockpit není chráněný proti swipe přepnutí modulu.'); poolOk = false; }
    if (poolValue.cockpitMetrics < 3) { fail('Bazén cockpit nemá metriky.'); poolOk = false; }
    if (poolValue.cockpitActions < 1) { fail('Bazén cockpit nemá rychlou akci.'); poolOk = false; }
    if (!poolValue.metricRailScrollable) { fail('Bazén cockpit metriky nejsou na mobilu vodorovně posuvné.'); poolOk = false; }
    if (!poolValue.form) { fail('Bazén po kliknutí nerenderuje pool-settings formulář.'); poolOk = false; }
    if (!poolValue.tempInput) { fail('Bazén po kliknutí nemá vstup pro teplotu vody.'); poolOk = false; }
    if (!poolValue.volume) { fail('Bazén po kliknutí neukazuje objem vody.'); poolOk = false; }
    if (!poolValue.ph) { fail('Bazén po kliknutí neukazuje pH část.'); poolOk = false; }
    if (!poolValue.temperature) { fail('Bazén po kliknutí neukazuje teplotu vody.'); poolOk = false; }
    if (!poolValue.chart) { fail('Bazén po kliknutí nerenderuje graf pH/teploty.'); poolOk = false; }
    if (!poolValue.chartSurface) { fail('Bazénový graf nemá sjednocený detailní/grafový povrch.'); poolOk = false; }
    if (poolOk) ok('Bazén: formulář, objem, pH, teplota a graf renderují.');

    await page.send('Runtime.evaluate', {
      expression: `document.querySelector('[data-nav="finance"]')?.click()`
    });
    await new Promise((resolveWait) => setTimeout(resolveWait, 500));
    const financeCheck = await page.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const text = document.body?.innerText || '';
        const actionsRail = document.querySelector('[data-module-cockpit="finance"] .module-cockpit-actions');
        const actionsStyle = actionsRail ? getComputedStyle(actionsRail) : null;
        const sectionTabs = document.querySelector('.section-tabs[aria-label="Záložky modulu"]');
        const sectionTabsStyle = sectionTabs ? getComputedStyle(sectionTabs) : null;
        const financeFormActions = document.querySelector('form[data-form="finance-refinance"] .form-actions');
        const financeFormActionsStyle = financeFormActions ? getComputedStyle(financeFormActions) : null;
        const financeModule = document.querySelector('.module-tabbed[data-tab-area="finance"]');
        const financeModuleStyle = financeModule ? getComputedStyle(financeModule) : null;
        const financeModuleRect = financeModule ? financeModule.getBoundingClientRect() : null;
        const financeCards = financeModule ? Array.from(financeModule.querySelectorAll(':scope > .card')) : [];
        const financeDetails = document.querySelector('.finance-form-drawer.action-details');
        const financeDetailsStyle = financeDetails ? getComputedStyle(financeDetails) : null;
        const financeDetailsSummary = financeDetails ? financeDetails.querySelector('summary') : null;
        const financeDetailsSummaryStyle = financeDetailsSummary ? getComputedStyle(financeDetailsSummary) : null;
        const financeLoanItem = document.querySelector('.finance-loan-item');
        const financeLoanItemStyle = financeLoanItem ? getComputedStyle(financeLoanItem) : null;
        const financeLoanTop = financeLoanItem ? financeLoanItem.querySelector('.item-top') : null;
        const financeLoanTopStyle = financeLoanTop ? getComputedStyle(financeLoanTop) : null;
        const financeLoanMeta = financeLoanItem ? financeLoanItem.querySelector('.item-meta') : null;
        const financeLoanMetaStyle = financeLoanMeta ? getComputedStyle(financeLoanMeta) : null;
        return {
          cockpit: Boolean(document.querySelector('[data-module-cockpit="finance"]')),
          cockpitNoSwipe: Boolean(document.querySelector('[data-module-cockpit="finance"][data-no-swipe]')),
          cockpitMetrics: document.querySelectorAll('[data-module-cockpit="finance"] .module-cockpit-metric').length,
          cockpitActions: document.querySelectorAll('[data-module-cockpit="finance"] .module-cockpit-actions button').length,
          actionRailScrollable: Boolean(actionsRail && actionsStyle && /auto|scroll/.test(actionsStyle.overflowX) && actionsRail.scrollWidth > actionsRail.clientWidth),
          tabsNoSwipe: Boolean(sectionTabs?.hasAttribute('data-no-swipe')),
          tabsScrollable: Boolean(sectionTabs && sectionTabsStyle && /auto|scroll/.test(sectionTabsStyle.overflowX) && sectionTabs.scrollWidth > sectionTabs.clientWidth),
          formActionsRail: Boolean(financeFormActionsStyle && /auto|scroll/.test(financeFormActionsStyle.overflowX) && financeFormActionsStyle.flexWrap === 'nowrap' && financeFormActionsStyle.overscrollBehaviorX === 'contain'),
          moduleOneColumn: Boolean(financeModuleStyle && financeModuleStyle.display === 'grid' && financeModuleStyle.gridTemplateColumns.trim().split(/\\s+/).length === 1),
          moduleCardsFit: Boolean(financeModuleRect && financeCards.length && financeCards.every((card) => card.getBoundingClientRect().width <= financeModuleRect.width + 1)),
          detailsSurface: Boolean(financeDetails?.open && financeDetailsStyle && parseFloat(financeDetailsStyle.borderTopLeftRadius) >= 18 && financeDetailsStyle.overflow === 'hidden'),
          detailsSummaryGrid: Boolean(financeDetailsSummaryStyle && financeDetailsSummaryStyle.display === 'grid' && parseFloat(financeDetailsSummaryStyle.minHeight) >= 46 && parseFloat(financeDetailsSummaryStyle.columnGap) >= 8),
          loanItemSurface: Boolean(financeLoanItemStyle && parseFloat(financeLoanItemStyle.borderTopLeftRadius) >= 16 && financeLoanItemStyle.display === 'grid'),
          loanItemTopGrid: Boolean(financeLoanTopStyle && financeLoanTopStyle.display === 'grid' && financeLoanTopStyle.gridTemplateColumns.trim().split(/\\s+/).length >= 2),
          loanItemMetaClamp: Boolean(financeLoanMetaStyle && financeLoanMetaStyle.webkitLineClamp === '3'),
          loanForm: Boolean(document.querySelector('form[data-form="add-finance-loan"]')),
          refinanceForm: Boolean(document.querySelector('form[data-form="finance-refinance"]')),
          loanText: text.includes('Smoke půjčka') && text.includes('Refinancování')
        };
      })()`
    });
    const financeValue = financeCheck.result?.value || {};
    if (process.env.E2E_DEBUG === '1') {
      console.log('DEBUG finance:', JSON.stringify(financeValue, null, 2));
    }
    let financeOk = true;
    if (!financeValue.cockpit) { fail('Finance nemají horní module cockpit.'); financeOk = false; }
    if (!financeValue.cockpitNoSwipe) { fail('Finance cockpit není chráněný proti swipe přepnutí modulu.'); financeOk = false; }
    if (financeValue.cockpitMetrics < 3) { fail('Finance cockpit nemá metriky.'); financeOk = false; }
    if (financeValue.cockpitActions < 3) { fail('Finance cockpit nemá rychlé akce.'); financeOk = false; }
    if (!financeValue.actionRailScrollable) { fail('Finance cockpit akce nejsou na mobilu vodorovně posuvné.'); financeOk = false; }
    if (!financeValue.tabsNoSwipe) { fail('Finance modulové záložky nejsou chráněné proti swipe přepnutí.'); financeOk = false; }
    if (!financeValue.tabsScrollable) { fail('Finance modulové záložky nejsou na mobilu vodorovně posuvné.'); financeOk = false; }
    if (!financeValue.formActionsRail) { fail('Finance formulářové akce nemají mobilní rail chování.'); financeOk = false; }
    if (!financeValue.moduleOneColumn) { fail('Finance module-tabbed není na mobilu jednosloupcový grid.'); financeOk = false; }
    if (!financeValue.moduleCardsFit) { fail('Finance module-tabbed karty na mobilu přesahují šířku modulu.'); financeOk = false; }
    if (!financeValue.detailsSurface) { fail('Finance rozbalovací formulář nemá nový sjednocený povrch.'); financeOk = false; }
    if (!financeValue.detailsSummaryGrid) { fail('Finance rozbalovací formulář nemá nový summary layout.'); financeOk = false; }
    if (!financeValue.loanItemSurface) { fail('Finance půjčka nemá nový sjednocený seznamový povrch.'); financeOk = false; }
    if (!financeValue.loanItemTopGrid) { fail('Finance půjčka nemá nový item-top grid layout.'); financeOk = false; }
    if (!financeValue.loanItemMetaClamp) { fail('Finance půjčka nemá kontrolovaný ořez metadat.'); financeOk = false; }
    if (!financeValue.loanForm) { fail('Finance/Půjčky nerenderují add-finance-loan formulář.'); financeOk = false; }
    if (!financeValue.refinanceForm) { fail('Finance/Půjčky nerenderují finance-refinance formulář.'); financeOk = false; }
    if (!financeValue.loanText) { fail('Finance/Půjčky neukazují seed půjčku/refinancování.'); financeOk = false; }
    if (financeOk) ok('Finance: půjčka a refinancování renderují.');

    await page.send('Runtime.evaluate', {
      expression: `document.querySelector('[data-nav="contracts"]')?.click()`
    });
    await new Promise((resolveWait) => setTimeout(resolveWait, 500));
    const contractsCheck = await page.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const text = document.body?.innerText || '';
        const detailPanel = document.querySelector('.contracts-panel.panel-detail');
        const detailPanelStyle = detailPanel ? getComputedStyle(detailPanel) : null;
        return {
          cockpit: Boolean(document.querySelector('[data-module-cockpit="contracts"]')),
          cockpitMetrics: document.querySelectorAll('[data-module-cockpit="contracts"] .module-cockpit-metric').length,
          cockpitActions: document.querySelectorAll('[data-module-cockpit="contracts"] .module-cockpit-actions button').length,
          addForm: Boolean(document.querySelector('form[data-form="add-contract"]')),
          updateForm: Boolean(document.querySelector('form[data-form="update-contract"]')),
          fileForm: Boolean(document.querySelector('form[data-form="add-contract-file"]')),
          detailSurface: Boolean(detailPanelStyle && parseFloat(detailPanelStyle.borderTopLeftRadius) >= 16),
          contractText: text.includes('Smoke pojistka') && text.includes('Smlouvy a pojistky')
        };
      })()`
    });
    const contractsValue = contractsCheck.result?.value || {};
    let contractsOk = true;
    if (!contractsValue.cockpit) { fail('Smlouvy nemají horní module cockpit.'); contractsOk = false; }
    if (contractsValue.cockpitMetrics < 3) { fail('Smlouvy cockpit nemá metriky.'); contractsOk = false; }
    if (contractsValue.cockpitActions < 3) { fail('Smlouvy cockpit nemá rychlé akce.'); contractsOk = false; }
    if (!contractsValue.addForm) { fail('Smlouvy nerenderují add-contract formulář.'); contractsOk = false; }
    if (!contractsValue.updateForm) { fail('Smlouvy nerenderují update-contract formulář v detailu.'); contractsOk = false; }
    if (!contractsValue.fileForm) { fail('Smlouvy nerenderují add-contract-file formulář.'); contractsOk = false; }
    if (!contractsValue.detailSurface) { fail('Smlouvy detail nemá sjednocený detailní povrch.'); contractsOk = false; }
    if (!contractsValue.contractText) { fail('Smlouvy neukazují seed smlouvu/přehled.'); contractsOk = false; }
    if (contractsOk) ok('Smlouvy: přehled, detail i příloha formuláře renderují.');

    await page.send('Runtime.evaluate', {
      expression: `document.querySelector('.nav-shell [data-nav="more"]')?.click()`
    });
    await new Promise((resolveWait) => setTimeout(resolveWait, 350));
    await page.send('Runtime.evaluate', {
      expression: `document.querySelector('.more-module-section [data-nav="garage"], [data-nav="garage"]')?.click()`
    });
    await new Promise((resolveWait) => setTimeout(resolveWait, 600));
    await page.send('Runtime.evaluate', {
      expression: `document.querySelector('button[data-action="select-vehicle"][data-garage-target="add-fuel"], button[data-action="open-garage-detail"][data-garage-target="add-fuel"]')?.click()`
    });
    await new Promise((resolveWait) => setTimeout(resolveWait, 900));
    const modalCheck = await page.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const modal = document.querySelector('.app-modal.garage-record-modal');
        const backdrop = document.querySelector('.app-modal-backdrop');
        const head = modal ? modal.querySelector('.app-modal-head') : null;
        const form = modal ? modal.querySelector('form[data-form="add-fuel"]') : null;
        const actions = modal ? modal.querySelector('.modal-actions') : null;
        const modalStyle = modal ? getComputedStyle(modal) : null;
        const backdropStyle = backdrop ? getComputedStyle(backdrop) : null;
        const headStyle = head ? getComputedStyle(head) : null;
        const actionsStyle = actions ? getComputedStyle(actions) : null;
        const formGrid = form ? form.querySelector('.form-grid.two') : null;
        const formGridStyle = formGrid ? getComputedStyle(formGrid) : null;
        return {
          modal: Boolean(modal),
          bodyOpen: document.body.classList.contains('overview-open'),
          form: Boolean(form),
          fuelFields: form ? form.querySelectorAll('input[name="date"], input[name="odometer"], input[name="liters"], input[name="price"]').length : 0,
          modalSurface: Boolean(modalStyle && parseFloat(modalStyle.borderTopLeftRadius) >= 18 && /auto|scroll/.test(modalStyle.overflowY) && modalStyle.overscrollBehaviorY === 'contain'),
          modalFitsMobile: Boolean(modal && modal.getBoundingClientRect().width <= window.innerWidth && modal.getBoundingClientRect().height <= window.innerHeight),
          backdropMobileSheet: Boolean(backdropStyle && ['flex-end', 'end'].includes(backdropStyle.alignItems)),
          headLayout: Boolean(headStyle && headStyle.display === 'grid' && headStyle.position === 'sticky'),
          actionsStickyRail: Boolean(actionsStyle && actionsStyle.position === 'sticky' && /auto|scroll/.test(actionsStyle.overflowX) && actionsStyle.flexWrap === 'nowrap'),
          formSingleColumn: Boolean(formGridStyle && formGridStyle.gridTemplateColumns.trim().split(/\\s+/).length === 1)
        };
      })()`
    });
    const modalValue = modalCheck.result?.value || {};
    if (process.env.E2E_DEBUG === '1') {
      console.log('DEBUG modal:', JSON.stringify(modalValue, null, 2));
    }
    let modalOk = true;
    if (!modalValue.modal) { fail('Garage add-fuel modal se neotevrel.'); modalOk = false; }
    if (!modalValue.bodyOpen) { fail('Otevreny modal nenastavil modalni stav body.'); modalOk = false; }
    if (!modalValue.form) { fail('Garage modal neobsahuje add-fuel formular.'); modalOk = false; }
    if (modalValue.fuelFields < 4) { fail('Garage modal nema zakladni pole tankovani.'); modalOk = false; }
    if (!modalValue.modalSurface) { fail('Garage modal nema sjednoceny modalni povrch a vnitrni scroll.'); modalOk = false; }
    if (!modalValue.modalFitsMobile) { fail('Garage modal presahuje mobilni viewport.'); modalOk = false; }
    if (!modalValue.backdropMobileSheet) { fail('Modal backdrop na mobilu nedrzi sheet u spodni hrany.'); modalOk = false; }
    if (!modalValue.headLayout) { fail('Modal hlavicka nema sticky grid layout.'); modalOk = false; }
    if (!modalValue.actionsStickyRail) { fail('Modalni akce nemaji sticky mobilni rail.'); modalOk = false; }
    if (!modalValue.formSingleColumn) { fail('Modalni formular neni na mobilu jednosloupcovy.'); modalOk = false; }
    if (modalOk) ok('Modaly: garage tankovani se otevira jako novy mobilni sheet s formularovou akci.');

    browserCdp.close();
  } finally {
    if (page) page.close();
    browserProcess.kill();
    await new Promise((resolveClose) => server.close(resolveClose));
    await new Promise((resolveExit) => {
      if (browserProcess.exitCode !== null || browserProcess.killed) {
        setTimeout(resolveExit, 300);
        return;
      }
      browserProcess.once('exit', resolveExit);
      setTimeout(resolveExit, 1500);
    });
    try {
      rmSync(userDataDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 250 });
    } catch (error) {
      console.warn(`Varování: dočasný profil prohlížeče nejde hned smazat (${error.code || error.message}).`);
    }
  }
}

await run();

console.log('E2E smoke pro Domácnost+');
notes.forEach((line) => console.log(`  ok: ${line}`));

if (errors.length) {
  console.error('\nProblémy:');
  errors.forEach((line) => console.error(`  ! ${line}`));
  console.error(`\nNeprošlo ${errors.length} kontrol.`);
  process.exit(1);
}

console.log('\nReal-browser E2E smoke prošel.');
