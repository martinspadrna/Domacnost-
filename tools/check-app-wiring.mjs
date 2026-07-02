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

const app = read('app.js');
const finance = read('finance.js');
const pool = read('pool.js');
const index = read('index.html');
const sw = read('sw.js');
const pkg = read('package.json');

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
  expect(pool, 'function poolVolumeM3', 'pool.js: výpočet objemu existuje.');
  expect(pool, 'function poolPhDose', 'pool.js: dávkování pH existuje.');
  expect(pool, 'data-form="pool-settings"', 'pool.js: formulář nastavení bazénu se renderuje.');
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
