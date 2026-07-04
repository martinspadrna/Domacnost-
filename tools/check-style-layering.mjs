#!/usr/bin/env node
// Domacnost+ style layering check.
// Hlida, ze uz sjednocene moduly nezavisi na historickych CSS vrstvach
// pred finalnim blokem. Kontrola je zamerne konzervativni a rozsiruje se
// postupne s dalsimi predelanymi castmi UI.

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
    errors.push(`Nelze cist ${relPath}: ${error.message}`);
    return '';
  }
}

function beforeMarker(source, marker, label) {
  const markerIndex = source.indexOf(marker);
  if (markerIndex === -1) {
    errors.push(`styles.css: chybi finalni marker ${label}.`);
    return source;
  }
  return source.slice(0, markerIndex);
}

function expectAbsent(source, pattern, label) {
  const found = typeof pattern === 'string' ? source.includes(pattern) : pattern.test(source);
  if (found) errors.push(label);
  else notes.push(label);
}

const styles = read('styles.css');
if (styles) {
  const beforeCalendar = beforeMarker(styles, '/* Domacnost+ - sjednoceny kalendar */', 'sjednoceny kalendar');
  const beforeGarage = beforeMarker(styles, '/* Domacnost+ - sjednocena Garaz */', 'sjednocena Garaz');
  const beforeHome = beforeMarker(styles, '/* Domacnost+ - sjednoceny Home */', 'sjednoceny Home');
  const beforeSettings = beforeMarker(styles, '/* Domácnost+ – jednotné Nastavení, importy a dlouhé formuláře */', 'jednotne Nastaveni');

  [
    [/v\.0\.1_106/, 'styles.css: stary v0.1_106 kalendarovy grid nesmi byt pred finalnim kalendarem.'],
    ['Mobile month calendar readability', 'styles.css: stary mobilni calendar readability patch nesmi byt pred finalnim kalendarem.'],
    [/\.calendar-month-view\s*\{/, 'styles.css: calendar-month-view ma zit az ve finalnim kalendarovem bloku.'],
    [/\.calendar-week-row\s*\{/, 'styles.css: calendar-week-row ma zit az ve finalnim kalendarovem bloku.']
  ].forEach(([pattern, label]) => expectAbsent(beforeCalendar, pattern, label));

  [
    [/v\.0\.1_103/, 'styles.css: stary v0.1_103 garage history patch nesmi byt pred finalni Garazi.'],
    [/Fuelio-like garage/, 'styles.css: stary Fuelio-like garage komentar/styl nesmi byt pred finalni Garazi.'],
    [/v\.0\.1_140/, 'styles.css: stary v0.1_140 garage overview patch nesmi byt pred finalni Garazi.'],
    [/v\.0\.1_141/, 'styles.css: stary v0.1_141 garage chart/dropdown patch nesmi byt pred finalni Garazi.'],
    [/v\.0\.1_142/, 'styles.css: stary v0.1_142 garage detail patch nesmi byt pred finalni Garazi.'],
    [/v\.0\.1_148/, 'styles.css: stary v0.1_148 garage calculator patch nesmi byt pred finalni Garazi.'],
    [/v\.0\.1_150/, 'styles.css: stary v0.1_150 garage tech/calculator patch nesmi byt pred finalni Garazi.'],
    [/\.fuelio-vehicle-card\s*\{/, 'styles.css: fuelio-vehicle-card ma zit az ve finalnim garage bloku.'],
    [/\.garage-chart-body\s*\{/, 'styles.css: garage-chart-body ma zit az ve finalnim garage bloku.'],
    [/\.garage-tab-calculator\s+\.garage-panel:not\(\.panel-calculator\)/, 'styles.css: garage tab visibility ma zit az ve finalnim garage bloku.']
  ].forEach(([pattern, label]) => expectAbsent(beforeGarage, pattern, label));

  [
    ['home reset', 'styles.css: stary home reset nesmi byt pred finalnim Home blokem.'],
    [/v\.0\.1_96[\s\S]{0,120}Home panelu/, 'styles.css: stary v0.1_96 variabilni Home panel nesmi byt pred finalnim Home blokem.'],
    [/v\.0\.1_96[\s\S]{0,120}stabiln[\s\S]{0,80}Home panel/, 'styles.css: stary v0.1_96 stabilni Home panel nesmi byt pred finalnim Home blokem.'],
    [/v\.0\.1_102[\s\S]{0,120}Home mini/, 'styles.css: stary v0.1_102 Home mini panel patch nesmi byt pred finalnim Home blokem.'],
    [/v\.0\.1_109/, 'styles.css: stary v0.1_109 Home live patch nesmi byt pred finalnim Home blokem.'],
    [/v\.0\.1_111/, 'styles.css: stary v0.1_111 Home layout/live patch nesmi byt pred finalnim Home blokem.'],
    [/v\.0\.1_112/, 'styles.css: stary v0.1_112 Home height patch nesmi byt pred finalnim Home blokem.'],
    [/v\.0\.1_113/, 'styles.css: stary v0.1_113 Home width/height patch nesmi byt pred finalnim Home blokem.'],
    [/v0\.1_115|v0\.1_117|v0\.1_118|v0\.1_120|v0\.1_124/, 'styles.css: stare Home glass/weather icon vrstvy v115-v124 nesmi byt pred finalnim Home blokem.'],
    [/v\.0\.1_138[\s\S]{0,120}Home/, 'styles.css: stary v0.1_138 Home readability patch nesmi byt pred finalnim Home blokem.'],
    [/v\.0\.1_149[\s\S]{0,120}Home/, 'styles.css: stary v0.1_149 Home height/icon patch nesmi byt pred finalnim Home blokem.'],
    [/v\.0\.1_154[\s\S]{0,120}Home/, 'styles.css: stary v0.1_154 Home compact patch nesmi byt pred finalnim Home blokem.'],
    [/v\.0\.1_155[\s\S]{0,120}Home/, 'styles.css: stary v0.1_155 Home no-scroll patch nesmi byt pred finalnim Home blokem.'],
    [/v\.0\.1_156[\s\S]{0,120}Home/, 'styles.css: stary v0.1_156 Home grid patch nesmi byt pred finalnim Home blokem.'],
    [/v\.0\.1_159[\s\S]{0,120}Home/, 'styles.css: stary v0.1_159 Home fullscreen patch nesmi byt pred finalnim Home blokem.'],
    [/v\.0\.1_217[\s\S]{0,120}Home/, 'styles.css: stary v0.1_217 Home safe-area patch nesmi byt pred finalnim Home blokem.'],
    [/v\.0\.1_232[\s\S]{0,120}finance\/Home/, 'styles.css: stary v0.1_232 finance/Home stabilization patch nesmi byt pred finalnim Home blokem.'],
    [/v\.0\.1_232[\s\S]{0,120}stabilizace Home/, 'styles.css: stary v0.1_232 final Home stabilization patch nesmi byt pred finalnim Home blokem.'],
    [/v\.0\.1_136[\s\S]{0,120}Home/, 'styles.css: stary v0.1_136 Home edit toolbar patch nesmi byt pred finalnim Home blokem.'],
    [/v\.0\.1_139[\s\S]{0,120}Home/, 'styles.css: stary v0.1_139 Home edit toolbar patch nesmi byt pred finalnim Home blokem.'],
    [/v\.0\.1_249[\s\S]{0,120}Home/, 'styles.css: stary v0.1_249 Home long-press patch nesmi byt pred finalnim Home blokem.'],
    [/v\.0\.1_281/, 'styles.css: stary v0.1_281 Home/nav patch nesmi byt pred finalnim Home blokem.'],
    [/v\.0\.1_282/, 'styles.css: stary v0.1_282 Home readability patch nesmi byt pred finalnim Home blokem.'],
    [/v\.0\.1_283/, 'styles.css: stary v0.1_283 Home height patch nesmi byt pred finalnim Home blokem.'],
    [/v\.0\.1_284/, 'styles.css: stary v0.1_284 Home layout patch nesmi byt pred finalnim Home blokem.'],
    [/v\.0\.1_286/, 'styles.css: stary v0.1_286 Home active-area patch nesmi byt pred finalnim Home blokem.'],
    [/v\.0\.1_287/, 'styles.css: stary v0.1_287 Home text/height patch nesmi byt pred finalnim Home blokem.'],
    [/v\.0\.1_288/, 'styles.css: stary v0.1_288 Home padding patch nesmi byt pred finalnim Home blokem.'],
    [/\.home-minimal-hero\b/, 'styles.css: stary home-minimal-hero selector nesmi byt pred finalnim Home blokem.'],
    [/\.home-hero-count-\d+\b/, 'styles.css: stary home-hero-count selector nesmi byt pred finalnim Home blokem.'],
    [/\.app-shell\.home-app-shell\s+\.home-hero-count-0\.home-minimal-hero/, 'styles.css: stary app-shell Home fullscreen selector nesmi byt pred finalnim Home blokem.'],
    [/\.home-hero-count-0\.home-minimal-hero,[\s\S]{0,500}height:\s*(?:calc|clamp)/, 'styles.css: stary Home hero height clamp nesmi byt pred finalnim Home blokem.'],
    [/\.station-summary-edit-toolbar\s*\{/, 'styles.css: stary Home edit toolbar nesmi byt pred finalnim Home blokem.'],
    [/\.home-hero-edit-toolbar-top\s*\{/, 'styles.css: stary Home top edit toolbar nesmi byt pred finalnim Home blokem.'],
    [/\.app-shell\.home-app-shell\s+\.hero-weather-copy,/, 'styles.css: stary app-shell Home weather text override nesmi byt pred finalnim Home blokem.'],
    [/legacy[\s\S]{0,80}Home:/, 'styles.css: stary legacy Home patch nesmi byt pred finalnim Home blokem.'],
    [/\.glass-icon\.hero-weather-icon/, 'styles.css: stare glass hero weather pravidlo nesmi zit pred finalnim Home blokem.'],
    [/\.station-summary-item \.glass-icon\.station-summary-icon/, 'styles.css: stary glass station-summary fallback nesmi zit pred finalnim Home blokem.'],
    [/\.glass-icon-size-/, 'styles.css: stare glass-icon-size utility tridy nesmi zit pred finalnim Home blokem.']
  ].forEach(([pattern, label]) => expectAbsent(beforeHome, pattern, label));

  [
    [/\.settings-tab-dashboard \.settings-panel:not\(\.panel-dashboard\),\s*\.settings-tab-household \.settings-panel:not\(\.panel-household\)/, 'styles.css: settings tab visibility ma zit az ve finalnim Nastaveni bloku.'],
    [/\.pwa-card\s*\{/, 'styles.css: PWA karta ma zit az ve finalnim Nastaveni bloku.'],
    [/\.install-steps\s*\{/, 'styles.css: instalacni kroky PWA maji zit az ve finalnim Nastaveni bloku.'],
    [/\.install-step\s*\{/, 'styles.css: instalacni krok PWA ma zit az ve finalnim Nastaveni bloku.']
  ].forEach(([pattern, label]) => expectAbsent(beforeSettings, pattern, label));
}

const shoppingStyles = read('shopping.css');
if (shoppingStyles) {
  [
    [/\.shopping-done-details\b/, 'shopping.css: stary inline Hotovo details nesmi zustat vedle noveho shopping-done-modal.'],
    [/\.loyalty-card-top\b/, 'shopping.css: stara verze vernostni karty loyalty-card-top nesmi zustat vedle compact wallet renderu.'],
    [/\.loyalty-card-bottom\b/, 'shopping.css: stara verze vernostni karty loyalty-card-bottom nesmi zustat vedle compact wallet renderu.'],
    [/\.loyalty-card-actions\b/, 'shopping.css: stare inline akce vernostni karty nesmi zustat vedle action modalu.'],
    [/\.loyalty-favorite-btn\b/, 'shopping.css: stare tlacitko oblibene vernostni karty nesmi zustat vedle action modalu.'],
    [/\.loyalty-card-code\b/, 'shopping.css: stary kod vernostni karty nesmi zustat vedle SVG code preview.'],
    [/\.loyalty-code-photo\b/, 'shopping.css: stary foto kod vernostni karty nesmi zustat vedle aktualni scan/preview vrstvy.'],
    [/\.loyalty-barcode(?!-svg)\b/, 'shopping.css: stary rucne kresleny loyalty-barcode nesmi zustat vedle SVG barcode renderu.'],
    [/\.loyalty-qr(?!-svg)\b/, 'shopping.css: stary rucne kresleny loyalty-qr nesmi zustat vedle SVG QR renderu.'],
    [/\.loyalty-card-menu(?:\s|>|:|\.|\[|#|$)/, 'shopping.css: stare details menu vernostni karty nesmi zustat vedle action modalu.'],
    [/\.loyalty-card-menu-panel\b/, 'shopping.css: stary inline menu panel vernostni karty nesmi zustat vedle action modalu.'],
    [/v\.0\.1_281/, 'shopping.css: stary v0.1_281 compact loyalty override nesmi zustat vedle finalniho Nákupu.'],
    [/\.loyalty-wallet-grid \.loyalty-card-item:not\(\.is-editing\)[\s\S]{0,220}!important/, 'shopping.css: compact loyalty karty nesmi byt rizene starou !important vrstvou.'],
    [/body:not\(\.overview-open\)\s+\.shopping-done-modal-backdrop/, 'shopping.css: Hotovo modal nesmi byt schovavany starou overview-open CSS pojistkou.'],
    [/transition-property:\s*transform,\s*box-shadow,\s*border-color\s*!important/, 'shopping.css: nakupni prechody nesmi zustat ve stare !important vrstve.']
  ].forEach(([pattern, label]) => expectAbsent(shoppingStyles, pattern, label));
}

if (styles) {
  expectAbsent(styles, /\.subscription-cloud-actions\b/, 'styles.css: stary rucni cloud action pas v Predplatnem nesmi zustat vedle automatickeho sync statusu.');
  expectAbsent(styles, /\.finance-hero-card\b/, 'styles.css: mrtvy Finance hero selector nesmi zustat vedle aktualniho finance dashboardu.');
  expectAbsent(styles, /\.warranty-overview-button\b|\.fake-btn\b/, 'styles.css: stary warranty overview button/fake-btn nesmi zustat vedle aktualniho warranty item detailu.');
  expectAbsent(styles, /\.warranty-files-block\b/, 'styles.css: stary warranty files wrapper nesmi zustat vedle aktualniho warranty detail modalu.');
  expectAbsent(styles, /\.hdo-manual-form\b/, 'styles.css: HDO manual form nema mit vlastni stary formularovy patch vedle spolecneho rozbalovaciho povrchu.');
  expectAbsent(styles, /v0\.1_239[\s\S]{0,160}Zápisník|v0\.1_239[\s\S]{0,160}ZĂˇpisnĂ­k/, 'styles.css: stare v0.1_239 bloky Zapisniku nesmi zustat vedle finalniho Zapisniku.');
  expectAbsent(styles, /v0\.1_240[\s\S]{0,120}Zápisník|v0\.1_240[\s\S]{0,120}ZĂˇpisnĂ­k/, 'styles.css: stary v0.1_240 Zapisnik prebarvovaci blok nesmi zustat vedle finalniho Zapisniku.');
  expectAbsent(styles, /v0\.1_241[\s\S]{0,160}Zápisník|v0\.1_241[\s\S]{0,160}ZĂˇpisnĂ­k/, 'styles.css: stary v0.1_241 Zapisnik sekce/datum patch nesmi zustat vedle finalniho Zapisniku.');
  expectAbsent(styles, /\.notebook-header-actions \.notebook-add-btn\s*\{[\s\S]{0,80}display:\s*none\s*!important/, 'styles.css: stare notebook add tlacitko nesmi byt skryvane !important vrstvou.');
  expectAbsent(styles, /\.readings-tab-overview\s+\.readings-panel\.panel-detail\b/, 'styles.css: stary Odečty detail-only tab hack nesmi zustat vedle aktualniho kompletniho readings tab pravidla.');
  expectAbsent(styles, /\.readings-prices-page\s*,\s*\.readings-prices-page\s+\*/, 'styles.css: stary Odečty v267 brute-force descendant reset nesmi zustat vedle finalniho Odecty bloku.');
  expectAbsent(styles, /\.readings-group-card\s*,\s*\.readings-group-card\s+\*/, 'styles.css: stary Odečty group descendant reset nesmi zustat vedle finalniho Odecty bloku.');
}

console.log('Style layering check pro Domacnost+');
notes.forEach((line) => console.log(`  ok: ${line}`));

if (errors.length) {
  console.error('\nProblemy:');
  errors.forEach((line) => console.error(`  ! ${line}`));
  process.exit(1);
}

console.log(`\nOK: ${notes.length} kontrol stylovych vrstev proslo.`);
