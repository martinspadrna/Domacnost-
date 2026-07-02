#!/usr/bin/env node
// Nastaví verzované Git hooky pro lokální checkout.

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, '..');
const hookDir = join(projectRoot, '.githooks');
const hookFile = join(hookDir, 'pre-commit');

if (!existsSync(hookFile)) {
  console.error('Chybí .githooks/pre-commit.');
  process.exit(1);
}

const result = spawnSync('git', ['config', 'core.hooksPath', '.githooks'], {
  cwd: projectRoot,
  encoding: 'utf8',
  shell: false
});

if (result.status !== 0) {
  const message = (result.stderr || result.stdout || '').trim() || `exit ${result.status}`;
  console.error(`Nepovedlo se nastavit Git hooks: ${message}`);
  process.exit(result.status || 1);
}

console.log('Git hooks nastavené na .githooks.');
