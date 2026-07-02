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
      targetPh: 7.2,
      dosePer10m3Per01: 100,
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
    await page.send('Page.addScriptToEvaluateOnNewDocument', { source: smokeSeedScript() });
    await page.send('Page.navigate', { url });
    await new Promise((resolveWait) => setTimeout(resolveWait, 2500));

    const initial = await page.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const text = document.body?.innerText || '';
        return {
          title: document.title,
          appStarted: Boolean(window.__DOMACNOST_APP_STARTED__),
          appRoot: Boolean(document.querySelector('#app')),
          versionOk: document.title.includes('v.0.1_${expectedBuild}') || text.includes('v.0.1_${expectedBuild}'),
          bootError: Boolean(document.querySelector('.module-error-card, .app-boot-error')),
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
    if (!initialValue.navPool) { fail('Po seed bootu není dostupná navigace Bazén.'); bootOk = false; }
    if (!initialValue.navFinance) { fail('Po seed bootu není dostupná navigace Finance.'); bootOk = false; }
    if (!initialValue.navContracts) { fail('Po seed bootu není dostupná navigace Smlouvy.'); bootOk = false; }
    if (bootOk) ok('boot: app root, verze, Finance, Bazén i Smlouvy navigace dostupné.');

    await page.send('Runtime.evaluate', {
      expression: `document.querySelector('[data-nav="pool"]')?.click()`
    });
    await new Promise((resolveWait) => setTimeout(resolveWait, 500));
    const poolCheck = await page.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const text = document.body?.innerText || '';
        return {
          form: Boolean(document.querySelector('form[data-form="pool-settings"]')),
          volume: text.includes('21,6 m³') || text.includes('21.6 m³') || text.includes('objem vody'),
          ph: text.includes('pH') && (text.includes('pH-') || text.includes('pH+'))
        };
      })()`
    });
    const poolValue = poolCheck.result?.value || {};
    if (process.env.E2E_DEBUG === '1') {
      console.log('DEBUG pool:', JSON.stringify(poolValue, null, 2));
    }
    let poolOk = true;
    if (!poolValue.form) { fail('Bazén po kliknutí nerenderuje pool-settings formulář.'); poolOk = false; }
    if (!poolValue.volume) { fail('Bazén po kliknutí neukazuje objem vody.'); poolOk = false; }
    if (!poolValue.ph) { fail('Bazén po kliknutí neukazuje pH část.'); poolOk = false; }
    if (poolOk) ok('Bazén: formulář, objem a pH část renderují.');

    await page.send('Runtime.evaluate', {
      expression: `document.querySelector('[data-nav="finance"]')?.click()`
    });
    await new Promise((resolveWait) => setTimeout(resolveWait, 500));
    const financeCheck = await page.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const text = document.body?.innerText || '';
        return {
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
        return {
          addForm: Boolean(document.querySelector('form[data-form="add-contract"]')),
          updateForm: Boolean(document.querySelector('form[data-form="update-contract"]')),
          fileForm: Boolean(document.querySelector('form[data-form="add-contract-file"]')),
          contractText: text.includes('Smoke pojistka') && text.includes('Smlouvy a pojistky')
        };
      })()`
    });
    const contractsValue = contractsCheck.result?.value || {};
    let contractsOk = true;
    if (!contractsValue.addForm) { fail('Smlouvy nerenderují add-contract formulář.'); contractsOk = false; }
    if (!contractsValue.updateForm) { fail('Smlouvy nerenderují update-contract formulář v detailu.'); contractsOk = false; }
    if (!contractsValue.fileForm) { fail('Smlouvy nerenderují add-contract-file formulář.'); contractsOk = false; }
    if (!contractsValue.contractText) { fail('Smlouvy neukazují seed smlouvu/přehled.'); contractsOk = false; }
    if (contractsOk) ok('Smlouvy: přehled, detail i příloha formuláře renderují.');

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
