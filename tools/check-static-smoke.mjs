#!/usr/bin/env node
// Domácnost+ static smoke check.
// Bez npm závislostí — ověřuje release-adjacent invarianty, které nespadají
// do surface/version checku (viz tools/check-release.mjs), ale jejich rozbití
// se pozná až v runtime PWA.
//
// Kontroly:
//   1. Všechny lokální CSS/JS z index.html existují na disku.
//   2. Všechny APP_ASSETS z sw.js existují (relativní './' cesty).
//   3. Všechny icons.src z manifest.webmanifest existují.
//   4. sw.js activate handler dělá prefix filter (startsWith CACHE_PREFIX)
//      místo naivního key !== CACHE_NAME (jinak by mazal cizí cache).
//   5. PWA UI akce jsou zaregistrované jak v render vrstvě, tak v action
//      dispatcheru (pwa-check-update, pwa-apply-update, pwa-clear-cache).
//
// Spustit: node tools/check-static-smoke.mjs

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, '..');

const errors = [];
const notes = [];

function readOrFail(relPath, label) {
  try {
    return readFileSync(join(projectRoot, relPath), 'utf8');
  } catch (error) {
    errors.push(`Nelze číst ${label} (${relPath}): ${error.message}`);
    return '';
  }
}

function checkFileExists(relPath, label) {
  const absPath = join(projectRoot, relPath);
  if (!existsSync(absPath)) {
    errors.push(`Chybí soubor: ${relPath} (${label})`);
    return false;
  }
  return true;
}

// Odstraní ?v=... query string, aby ho fs vidělo jako čistou cestu.
function stripQuery(href) {
  const i = href.indexOf('?');
  return i === -1 ? href : href.slice(0, i);
}

// Kontrola 1: lokální CSS/JS z index.html.
const index = readOrFail('index.html', 'index.html');
if (index) {
  const cssHits = [...index.matchAll(/<link\s+rel="stylesheet"\s+href="([^"]+)"/g)];
  const jsHits = [...index.matchAll(/<script\s+src="([^"]+)"/g)];
  const localAssets = [];
  cssHits.forEach((m) => localAssets.push({ href: m[1], kind: 'css' }));
  jsHits.forEach((m) => localAssets.push({ href: m[1], kind: 'js' }));

  let checkedLocal = 0;
  localAssets.forEach(({ href, kind }) => {
    if (/^https?:\/\//i.test(href)) return; // externí (Supabase CDN aj.)
    const clean = stripQuery(href).replace(/^\.\//, '');
    if (!clean) return;
    if (checkFileExists(clean, `index.html ${kind}`)) checkedLocal += 1;
  });
  notes.push(`index.html: ${checkedLocal} lokálních CSS/JS souborů existuje.`);
}

// Kontrola 2: APP_ASSETS z sw.js.
const swSource = readOrFail('sw.js', 'sw.js');
if (swSource) {
  const appAssetsMatch = swSource.match(/const APP_ASSETS\s*=\s*\[([\s\S]*?)\];/);
  if (!appAssetsMatch) {
    errors.push('sw.js: nenašel jsem APP_ASSETS pole.');
  } else {
    const paths = [...appAssetsMatch[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
    if (!paths.length) {
      errors.push('sw.js: APP_ASSETS je prázdné.');
    } else {
      let checkedAssets = 0;
      paths.forEach((p) => {
        if (p === './') return; // root = index.html, řeší se navigation fetch
        const clean = p.replace(/^\.\//, '');
        if (checkFileExists(clean, 'sw.js APP_ASSETS')) checkedAssets += 1;
      });
      notes.push(`sw.js: ${checkedAssets} APP_ASSETS souborů existuje.`);
    }
  }

  // Kontrola 4: prefix filter v activate handleru.
  if (!/CACHE_PREFIX\s*=\s*'domacnost-plus-'/.test(swSource)) {
    errors.push("sw.js: chybí definice CACHE_PREFIX = 'domacnost-plus-'.");
  }
  const activateMatch = swSource.match(/self\.addEventListener\('activate'[\s\S]*?\}\);/);
  if (!activateMatch) {
    errors.push('sw.js: nenašel jsem activate handler.');
  } else {
    const activateBody = activateMatch[0];
    if (!/startsWith\(CACHE_PREFIX\)/.test(activateBody)) {
      errors.push(
        "sw.js activate handler nemá prefix filter (key.startsWith(CACHE_PREFIX))." +
          ' Bez něj by smazal cizí cache na stejném originu.'
      );
    } else {
      notes.push('sw.js activate: prefix filter přítomen.');
    }
    if (!/key !== CACHE_NAME/.test(activateBody)) {
      errors.push('sw.js activate handler nechrání aktuální CACHE_NAME (chybí key !== CACHE_NAME).');
    }
  }
}

// Kontrola 3: ikony z manifest.
const manifestSource = readOrFail('manifest.webmanifest', 'manifest.webmanifest');
if (manifestSource) {
  try {
    const manifest = JSON.parse(manifestSource);
    const icons = Array.isArray(manifest.icons) ? manifest.icons : [];
    if (!icons.length) {
      errors.push('manifest.webmanifest: pole icons je prázdné.');
    } else {
      let checkedIcons = 0;
      icons.forEach((icon, i) => {
        const src = String(icon.src || '').replace(/^\.\//, '');
        if (!src) {
          errors.push(`manifest.webmanifest icons[${i}].src je prázdné.`);
          return;
        }
        if (checkFileExists(src, `manifest icons[${i}]`)) checkedIcons += 1;
      });
      notes.push(`manifest.webmanifest: ${checkedIcons} ikon existuje.`);
    }
  } catch (error) {
    errors.push(`manifest.webmanifest: parse selhalo — ${error.message}`);
  }
}

// Kontrola 5: PWA akce v app.js.
const app = readOrFail('app.js', 'app.js');
if (app) {
  const pwaActions = ['pwa-check-update', 'pwa-apply-update', 'pwa-clear-cache'];
  pwaActions.forEach((action) => {
    const inRender = new RegExp(`data-action="${action}"`).test(app);
    const inDispatch = new RegExp(`action === '${action}'`).test(app);
    if (!inRender) errors.push(`app.js: chybí render tlačítko s data-action="${action}".`);
    if (!inDispatch) errors.push(`app.js: chybí action handler pro '${action}'.`);
    if (inRender && inDispatch) notes.push(`app.js: PWA akce ${action} zaregistrovaná (render + dispatch).`);
  });
}

console.log('Static smoke check pro Domácnost+');
notes.forEach((line) => console.log(`  ok: ${line}`));
if (errors.length) {
  console.error('\nProblémy:');
  errors.forEach((line) => console.error(`  ! ${line}`));
  console.error(`\nNeprošlo ${errors.length} kontrol.`);
  process.exit(1);
} else {
  console.log('\nVšechny kontrolní body sedí.');
}
