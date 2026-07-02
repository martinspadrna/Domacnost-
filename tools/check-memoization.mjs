#!/usr/bin/env node
// Domácnost+ memoization safety check.
// Bez npm závislostí — chrání proti regresi memoization invalidation
// zavedené v v0.1_325 a zpevněné v v0.1_326.
//
// Kontroly:
//   1. notes.js NEpoužívá slabý fingerprint `text.slice(0, 96)` v kódu
//      (komentář zmiňující starý pattern je OK — scanujeme jen kód).
//   2. notes.js signature používá full-text hash (fnv1aHashNoteText(text)).
//   3. calendar.js signature zahrnuje title (e.title) — je to tie-breaker
//      v sortCalendarEventsByStart, bez něj by přejmenování události se
//      stejným časem nechalo staré pořadí z cache.
//
// Spustit: node tools/check-memoization.mjs

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, '..');

const errors = [];
const notes = [];

function readOrFail(relPath) {
  try {
    return readFileSync(join(projectRoot, relPath), 'utf8');
  } catch (error) {
    errors.push(`Nelze číst ${relPath}: ${error.message}`);
    return '';
  }
}

// Odstraní řádkové `//` komentáře, aby zmínka o starém patternu v komentáři
// neshodila kontrolu. Blokové komentáře v těchto souborech nejsou, stačí `//`.
function stripLineComments(source) {
  return source
    .split('\n')
    .map((line) => {
      const idx = line.indexOf('//');
      return idx === -1 ? line : line.slice(0, idx);
    })
    .join('\n');
}

// Kontrola notes.js.
const notesSource = readOrFail('notes.js');
if (notesSource) {
  const notesCode = stripLineComments(notesSource);
  if (/text\.slice\(\s*0\s*,\s*96\s*\)/.test(notesCode)) {
    errors.push(
      'notes.js: signature používá slabý `text.slice(0, 96)` fingerprint. ' +
        'Edit za 96. znakem se stejnou délkou by nechal starou cache. ' +
        'Použij full-text hash (fnv1aHashNoteText).'
    );
  } else {
    notes.push('notes.js: žádný slabý text.slice(0, 96) fingerprint v kódu.');
  }
  if (!/function fnv1aHashNoteText\(/.test(notesSource)) {
    errors.push('notes.js: chybí fnv1aHashNoteText helper pro full-text fingerprint.');
  } else if (!/\$\{fnv1aHashNoteText\(text\)\}/.test(notesSource)) {
    errors.push('notes.js: computeNotesSignature nepoužívá fnv1aHashNoteText(text) v signature.');
  } else {
    notes.push('notes.js: signature používá full-text FNV-1a hash.');
  }
}

// Kontrola calendar.js.
const calendarSource = readOrFail('calendar.js');
if (calendarSource) {
  const sigMatch = calendarSource.match(/function computeCalendarSignature\(\)\s*\{[\s\S]*?\n {4}\}/);
  if (!sigMatch) {
    errors.push('calendar.js: nenašel jsem computeCalendarSignature().');
  } else {
    const sigBody = sigMatch[0];
    if (!/e\.title/.test(sigBody)) {
      errors.push(
        'calendar.js: computeCalendarSignature neobsahuje e.title. ' +
          'sortCalendarEventsByStart používá title jako tie-breaker — přejmenování ' +
          'události se stejným časem by nechalo staré pořadí z cache.'
      );
    } else {
      notes.push('calendar.js: signature zahrnuje e.title (sort tie-breaker).');
    }
    if (!/s\.isEnabled/.test(sigBody)) {
      errors.push('calendar.js: computeCalendarSignature neobsahuje source isEnabled (toggle zdroje by neinvalidoval).');
    } else {
      notes.push('calendar.js: signature zahrnuje source isEnabled.');
    }
  }
}

console.log('Memoization safety check pro Domácnost+');
notes.forEach((line) => console.log(`  ok: ${line}`));
if (errors.length) {
  console.error('\nProblémy:');
  errors.forEach((line) => console.error(`  ! ${line}`));
  console.error(`\nNeprošlo ${errors.length} kontrol.`);
  process.exit(1);
} else {
  console.log('\nVšechny kontrolní body sedí.');
}
