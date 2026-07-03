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
    [/v\.0\.1_281/, 'styles.css: stary v0.1_281 Home/nav patch nesmi byt pred finalnim Home blokem.'],
    [/v\.0\.1_282/, 'styles.css: stary v0.1_282 Home readability patch nesmi byt pred finalnim Home blokem.'],
    [/v\.0\.1_283/, 'styles.css: stary v0.1_283 Home height patch nesmi byt pred finalnim Home blokem.'],
    [/v\.0\.1_284/, 'styles.css: stary v0.1_284 Home layout patch nesmi byt pred finalnim Home blokem.'],
    [/v\.0\.1_286/, 'styles.css: stary v0.1_286 Home active-area patch nesmi byt pred finalnim Home blokem.'],
    [/v\.0\.1_287/, 'styles.css: stary v0.1_287 Home text/height patch nesmi byt pred finalnim Home blokem.'],
    [/v\.0\.1_288/, 'styles.css: stary v0.1_288 Home padding patch nesmi byt pred finalnim Home blokem.'],
    [/legacy[\s\S]{0,80}Home:/, 'styles.css: stary legacy Home patch nesmi byt pred finalnim Home blokem.']
  ].forEach(([pattern, label]) => expectAbsent(beforeHome, pattern, label));

  [
    [/\.settings-tab-dashboard \.settings-panel:not\(\.panel-dashboard\),\s*\.settings-tab-household \.settings-panel:not\(\.panel-household\)/, 'styles.css: settings tab visibility ma zit az ve finalnim Nastaveni bloku.']
  ].forEach(([pattern, label]) => expectAbsent(beforeSettings, pattern, label));
}

console.log('Style layering check pro Domacnost+');
notes.forEach((line) => console.log(`  ok: ${line}`));

if (errors.length) {
  console.error('\nProblemy:');
  errors.forEach((line) => console.error(`  ! ${line}`));
  process.exit(1);
}

console.log(`\nOK: ${notes.length} kontrol stylovych vrstev proslo.`);
