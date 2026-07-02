#!/usr/bin/env node
// Domácnost+ app wiring smoke.
// Dependency-free kontrola, která hlídá, že nové uživatelské funkce nejsou
// jen v jednom souboru, ale jsou zapojené do rendereru, formulářů, cloudu,
// PWA cache a release/check pipeline.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, '..');
const errors = [];
const notes = [];

function read(relPath) {
  try {
    return readFileSync(join(projectRoot, relPath), 'utf8');
  } catch (error) {
    errors.push(`Nelze číst ${relPath}: ${error.message}`);
    return '';
  }
}

function expect(source, pattern, label) {
  const ok = typeof pattern === 'string' ? source.includes(pattern) : pattern.test(source);
  if (!ok) errors.push(label);
  else notes.push(label);
}

function expectAbsent(source, pattern, label) {
  const found = typeof pattern === 'string' ? source.includes(pattern) : pattern.test(source);
  if (found) errors.push(label);
  else notes.push(label);
}

const app = read('app.js');
const finance = read('finance.js');
const pool = read('pool.js');
const contracts = read('contracts.js');
const index = read('index.html');
const sw = read('sw.js');
const pkg = read('package.json');
const styles = read('styles.css');

if (app && finance) {
  expect(app, "financeLoans: []", 'app.js: financeLoans jsou ve výchozím stavu.');
  expect(app, "financeRefinanceResult: null", 'app.js: refinance výsledek má lokální stav.');
  expect(app, /migrated\.financeLoans = normalizeFinanceLoans\(migrated\.financeLoans\)/, 'app.js: financeLoans prochází migrací.');
  expect(app, /financeLoans: normalizeFinanceLoans\(state\.financeLoans \|\| \[\]\)/, 'app.js: financeLoans se ukládají do household UI payloadu.');
  expect(app, /Array\.isArray\(layout\.financeLoans\)/, 'app.js: financeLoans se obnovují z cloud layoutu.');
  expect(app, /finance: \[loadHouseholdUiForModule, cloudLoadFinance\]/, 'app.js: finance lazy loader tahá i household UI.');
  expect(app, "'add-finance-loan': () => addFinanceLoanFromForm(data, form)", 'app.js: add-finance-loan form handler existuje.');
  expect(app, "'finance-refinance': () => calculateFinanceRefinance(data, form)", 'app.js: finance-refinance form handler existuje.');
  expect(app, "action === 'finance-loan-edit'", 'app.js: edit půjčky má action handler.');
  expect(finance, 'function normalizeFinanceLoan', 'finance.js: normalizeFinanceLoan existuje.');
  expect(finance, 'function financeLoanMonthlyPayment', 'finance.js: splátkový výpočet existuje.');
  expect(finance, 'function renderFinanceRefinancePanel', 'finance.js: refinance panel existuje.');
  expect(finance, "data-form=\"finance-refinance\"", 'finance.js: refinance formulář se renderuje.');
  expect(finance, "{ id: 'loans'", 'finance.js: Půjčky jsou samostatný tab.');
}

if (app && pool && index && sw) {
  expect(index, './pool.js?v=', 'index.html: pool.js se načítá před app.js.');
  expect(sw, "'./pool.js'", 'sw.js: pool.js je v APP_ASSETS.');
  expect(app, "{ id: 'pool'", 'app.js: pool je v module registry/Home konfiguraci.');
  expect(app, 'let poolInstance = null', 'app.js: pool má modulovou instanci.');
  expect(app, 'function getPoolModule()', 'app.js: getPoolModule factory wrapper existuje.');
  expect(app, 'pool: renderPool', 'app.js: pool renderer je v renderModule mapě.');
  expect(app, "'pool-settings': () => savePoolFromForm(data, form)", 'app.js: pool-settings form handler existuje.');
  expect(app, /migrated\.pool = normalizePoolState\(migrated\.pool\)/, 'app.js: pool prochází migrací.');
  expect(app, /pool: normalizePoolState\(state\.pool \|\| \{\}\)/, 'app.js: pool se ukládá do household UI payloadu.');
  expect(app, /layout\.pool && typeof layout\.pool === 'object'/, 'app.js: pool se obnovuje z cloud layoutu.');
  expect(app, /pool: \[loadHouseholdUiForModule\]/, 'app.js: pool lazy/background loader tahá household UI.');
  expect(pool, 'function normalizePoolState', 'pool.js: normalizePoolState existuje.');
  expect(pool, 'function normalizePoolMeasurements', 'pool.js: historie měření bazénu se normalizuje.');
  expect(pool, 'function poolVolumeM3', 'pool.js: výpočet objemu existuje.');
  expect(pool, 'function poolPhDose', 'pool.js: dávkování pH existuje.');
  expect(pool, 'waterTempC', 'pool.js: teplota vody je součást stavu/renderu.');
  expect(pool, 'function renderPoolMeasurementChart', 'pool.js: graf pH/teploty existuje.');
  expect(pool, 'data-form="pool-settings"', 'pool.js: formulář nastavení bazénu se renderuje.');
}

if (app && contracts && index && sw) {
  expect(index, './contracts.js?v=', 'index.html: contracts.js se načítá před app.js.');
  expect(sw, "'./contracts.js'", 'sw.js: contracts.js je v APP_ASSETS.');
  expect(app, 'let contractsInstance = null', 'app.js: contracts má modulovou instanci.');
  expect(app, 'function getContractsModule()', 'app.js: getContractsModule factory wrapper existuje.');
  expect(app, 'contracts: renderContracts', 'app.js: contracts renderer je v renderModule mapě.');
  expect(app, 'return getContractsModule().renderContracts();', 'app.js: renderContracts je už jen wrapper.');
  expect(app, 'return getContractsModule().renderContractOverviewItem(contract);', 'app.js: overview smlouvy jde přes contracts module.');
  expect(app, 'return getContractsModule().cloudLoadContracts(showMessage);', 'app.js: cloudLoadContracts je už jen wrapper.');
  expect(app, 'return getContractsModule().addContractFromForm(data, form);', 'app.js: add-contract formulář jde přes contracts module.');
  expectAbsent(app, 'function cloudContractPayload', 'app.js: cloudContractPayload už není v monolitu.');
  expectAbsent(app, 'function cloudUploadContractFile', 'app.js: cloudUploadContractFile už není v monolitu.');
  expect(contracts, 'function renderContracts()', 'contracts.js: renderContracts existuje.');
  expect(contracts, 'function renderContractDetail', 'contracts.js: renderContractDetail existuje.');
  expect(contracts, 'function cloudContractPayload', 'contracts.js: cloudContractPayload žije v modulu.');
  expect(contracts, 'async function cloudLoadContracts', 'contracts.js: cloudLoadContracts žije v modulu.');
  expect(contracts, 'async function addContractFromForm', 'contracts.js: add-contract handler žije v modulu.');
  expect(contracts, 'async function cloudUploadContractFile', 'contracts.js: upload příloh smluv žije v modulu.');
  expect(contracts, 'async function cloudLoadContractFiles', 'contracts.js: načtení příloh smluv žije v modulu.');
  expect(contracts, 'async function openOrDownloadContractFile', 'contracts.js: otevření/stahování příloh žije v modulu.');
  expect(contracts, 'data-form="add-contract"', 'contracts.js: add-contract formulář se renderuje.');
  expect(contracts, 'data-form="add-contract-file"', 'contracts.js: add-contract-file formulář se renderuje.');
  expect(contracts, 'window.DomacnostContracts', 'contracts.js: factory export existuje.');
}

if (app) {
  expect(app, 'function isHorizontallyScrollableTarget', 'app.js: swipe guard umí poznat horizontálně scrollovatelný blok.');
  expect(app, 'const NAVIGATION_SWIPE_IGNORE_SELECTOR', 'app.js: swipe guard má centrální seznam chráněných oblastí.');
  expect(app, 'function isNavigationSwipeIgnoredTarget', 'app.js: navigační swipe má jednotný ignore helper.');
  expect(app, 'swipeStartTarget', 'app.js: navigační swipe kontroluje i místo začátku gesta.');
  expect(app, 'isNavigationSwipeIgnoredTarget(event.target) || isNavigationSwipeIgnoredTarget(swipeStartTarget)', 'app.js: swipe navigace ignoruje start i konec v chráněném bloku.');
  expect(app, "'.form-actions'", 'app.js: formulářové akce jsou chráněné proti swipe přepnutí.');
  expect(app, "'.finance-toolbar'", 'app.js: finance toolbar je chráněný proti swipe přepnutí.');
  expect(app, "'.garage-history-toolbar'", 'app.js: garážové filtry jsou chráněné proti swipe přepnutí.');
  expect(app, 'aria-label="Záložky modulu" data-no-swipe', 'app.js: společné modulové záložky jsou chráněné proti swipe přepnutí.');
  expect(app, 'data-module-cockpit="${escapeHtml(moduleId)}" data-no-swipe', 'app.js: module cockpit je chráněný proti swipe přepnutí.');
  expect(app, '<div class="module-cockpit-metrics" data-no-swipe>', 'app.js: cockpit metriky jsou chráněné proti swipe přepnutí.');
  expect(app, '<div class="module-cockpit-actions" data-no-swipe>', 'app.js: cockpit akce jsou chráněné proti swipe přepnutí.');
}

if (styles) {
  expect(styles, '.section-tabs {\n  display: flex;', 'styles.css: společné modulové záložky používají horizontální rail.');
  expect(styles, '.finance-tab-loans .finance-panel:not(.panel-loans)', 'styles.css: Finance Půjčky mají vlastní tab visibility pravidlo.');
  expect(styles, '/* Domácnost+ – jednotný obsah modulů */', 'styles.css: existuje finální blok pro jednotný obsah modulů.');
  expect(styles, '.grid.two.module-tabbed,\n  .grid.three.module-tabbed', 'styles.css: module-tabbed má mobilní jednosloupcové pravidlo.');
  expect(styles, '.module-tabbed > .card {\n    grid-column: auto;', 'styles.css: module-tabbed umí na desktopu vrátit běžné karty do gridu.');
  expect(styles, '.form-actions,\n  .item-actions,\n  .finance-filter-chips', 'styles.css: společné akční lišty používají mobilní rail.');
  expect(styles, '.garage-history-toolbar {\n    display: flex;', 'styles.css: garážové filtry používají mobilní rail.');
  expect(styles, '.module-cockpit-metrics,\n  .module-cockpit-actions', 'styles.css: cockpit metriky a akce sdílí mobilní rail.');
  expect(styles, 'overscroll-behavior-x: contain;', 'styles.css: cockpit rail drží horizontální posun uvnitř panelu.');
  expect(styles, 'scroll-snap-type: x proximity;', 'styles.css: cockpit rail má jemné snapování položek.');
}

if (pkg) {
  expect(pkg, '"check:wiring"', 'package.json: check:wiring je v npm skriptech.');
  expect(pkg, 'npm run check:wiring', 'package.json: hlavní check spouští wiring smoke.');
  expect(pkg, '"check:e2e"', 'package.json: check:e2e real-browser smoke je dostupný.');
}

console.log('App wiring smoke pro Domácnost+');
notes.forEach((line) => console.log(`  ok: ${line}`));

if (errors.length) {
  console.error('\nProblémy:');
  errors.forEach((line) => console.error(`  ! ${line}`));
  console.error(`\nNeprošlo ${errors.length} kontrol.`);
  process.exit(1);
}

console.log('\nVšechny wiring kontroly sedí.');
