#!/usr/bin/env node
// Domácnost+ release surface check.
// Bez npm závislostí — čte přímo app.js / index.html / sw.js a ověřuje,
// že APP_VERSION / APP_BUILD / cache klíč / query stringy / export filename
// sedí ke stejnému buildu. Nenulový exit code = neshoda k nápravě.
// Spustit: node tools/check-release.mjs

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, '..');
const appPath = resolve(projectRoot, 'app.js');
const indexPath = resolve(projectRoot, 'index.html');
const swPath = resolve(projectRoot, 'sw.js');

const errors = [];
const notes = [];

function readOrFail(path) {
  try {
    return readFileSync(path, 'utf8');
  } catch (error) {
    errors.push(`Nelze číst ${path}: ${error.message}`);
    return '';
  }
}

function requireMatch(source, regex, label) {
  const match = source.match(regex);
  if (!match) {
    errors.push(`Nenašel jsem ${label}. Regex: ${regex}`);
    return null;
  }
  return match;
}

const app = readOrFail(appPath);
const index = readOrFail(indexPath);
const sw = readOrFail(swPath);

// APP_VERSION 'Domácnost+ v.0.1_320'
const versionMatch = requireMatch(
  app,
  /const APP_VERSION = 'Domácnost\+ v\.0\.1_(\d+)';/,
  'APP_VERSION v app.js'
);
// APP_BUILD 320
const buildMatch = requireMatch(
  app,
  /const APP_BUILD = (\d+);/,
  'APP_BUILD v app.js'
);

if (versionMatch && buildMatch) {
  const versionNumber = versionMatch[1];
  const buildNumber = buildMatch[1];
  if (versionNumber !== buildNumber) {
    errors.push(`APP_VERSION (v.0.1_${versionNumber}) neodpovídá APP_BUILD (${buildNumber}).`);
  } else {
    notes.push(`APP_VERSION a APP_BUILD sladěné na ${buildNumber}.`);
  }

  const expectedQuery = `0-1-${buildNumber}`;
  const expectedCache = `domacnost-plus-v0-1-${buildNumber}`;

  // index.html title <title>Domácnost+ v.0.1_320</title>
  if (!index.includes(`Domácnost+ v.0.1_${buildNumber}`)) {
    errors.push(`index.html neobsahuje 'Domácnost+ v.0.1_${buildNumber}' (title / boot fallback).`);
  } else {
    notes.push(`index.html: verze title match ${buildNumber}.`);
  }

  // index.html query strings ?v=0-1-320
  const queryHits = [...index.matchAll(/\?v=0-1-(\d+)/g)];
  if (!queryHits.length) {
    errors.push(`index.html neobsahuje žádné ?v=0-1-... script tagy.`);
  } else {
    const mismatched = queryHits.filter((hit) => hit[1] !== buildNumber);
    if (mismatched.length) {
      const set = new Set(mismatched.map((hit) => hit[1]));
      errors.push(
        `index.html má ${mismatched.length} script tagů s ?v=0-1-{${[...set].join(', ')}} místo ?v=${expectedQuery}.`
      );
    } else {
      notes.push(`index.html: ${queryHits.length} script tagů s ?v=${expectedQuery}.`);
    }
  }

  // sw.js CACHE_NAME = 'domacnost-plus-v0-1-320'
  const cacheMatch = requireMatch(sw, /const CACHE_NAME = '([^']+)';/, 'CACHE_NAME v sw.js');
  if (cacheMatch) {
    if (cacheMatch[1] !== expectedCache) {
      errors.push(`sw.js CACHE_NAME='${cacheMatch[1]}' neodpovídá '${expectedCache}'.`);
    } else {
      notes.push(`sw.js: CACHE_NAME=${expectedCache}.`);
    }
  }

  // Export filename derived from APP_BUILD.
  // Hledáme 'domacnost-plus-v0-1-${APP_BUILD}-${todayISO()}.json' (template literal).
  const exportRegex = /domacnost-plus-v0-1-\$\{APP_BUILD\}-\$\{todayISO\(\)\}\.json/;
  if (!exportRegex.test(app)) {
    errors.push(
      `Export filename v app.js není odvozený z APP_BUILD. Očekáváno: 'domacnost-plus-v0-1-\${APP_BUILD}-\${todayISO()}.json'.`
    );
  } else {
    notes.push(`app.js: export filename odvozený z APP_BUILD (${buildNumber}).`);
  }

  // PWA_EXPECTED_CACHE v app.js by měl matchovat sw.js CACHE_NAME
  const pwaExpectedRegex = /const PWA_EXPECTED_CACHE = `\$\{PWA_CACHE_PREFIX\}v0-1-\$\{APP_BUILD\}`;/;
  if (!pwaExpectedRegex.test(app)) {
    notes.push(`app.js: PWA_EXPECTED_CACHE nemá odvozený tvar (informativní, není hard fail).`);
  }

  // Ochrana proti zbytkům předchozí verze na release surface.
  const staleQuery = `0-1-${Number(buildNumber) - 1}`;
  const staleCache = `domacnost-plus-v0-1-${Number(buildNumber) - 1}`;
  const staleVersion = `v.0.1_${Number(buildNumber) - 1}`;
  const staleHits = [];
  if (index.includes(`?v=${staleQuery}`)) staleHits.push(`index.html ?v=${staleQuery}`);
  if (index.includes(staleVersion)) staleHits.push(`index.html ${staleVersion}`);
  if (sw.includes(staleCache)) staleHits.push(`sw.js ${staleCache}`);
  if (app.includes(`APP_VERSION = 'Domácnost+ ${staleVersion}'`)) staleHits.push(`app.js ${staleVersion}`);
  if (staleHits.length) {
    errors.push(`Zbyla stará verze na release surface: ${staleHits.join('; ')}.`);
  } else {
    notes.push(`Žádné zbytky předchozí verze (${staleQuery}) na release surface.`);
  }
}

console.log('Release surface check pro Domácnost+');
notes.forEach((line) => console.log(`  ok: ${line}`));
if (errors.length) {
  console.error('\nProblémy:');
  errors.forEach((line) => console.error(`  ! ${line}`));
  console.error(`\nNeprošlo ${errors.length} kontrol.`);
  process.exit(1);
} else {
  console.log('\nVšechny kontrolní body sedí.');
}
