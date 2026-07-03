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
}

console.log('Style layering check pro Domacnost+');
notes.forEach((line) => console.log(`  ok: ${line}`));

if (errors.length) {
  console.error('\nProblemy:');
  errors.forEach((line) => console.error(`  ! ${line}`));
  process.exit(1);
}

console.log(`\nOK: ${notes.length} kontrol stylovych vrstev proslo.`);
