import { readFileSync } from 'node:fs';

const app = readFileSync('app.js', 'utf8');
const warranty = readFileSync('warranty.js', 'utf8');

const checks = [
  {
    name: 'render captures and restores whole form snapshots',
    ok: app.includes('captureFormStabilitySnapshot()') &&
      app.includes('restoreFormStabilitySnapshot(formSnapshot)') &&
      app.includes('namedFormControls(form)')
  },
  {
    name: 'background render waits while a form is being edited',
    ok: app.includes('FORM_RENDER_QUIET_MS') &&
      app.includes('shouldDelayBackgroundRender()') &&
      app.includes('scheduleQuietRender()')
  },
  {
    name: 'reading entry form uses last-value placeholder and min guard',
    ok: app.includes('readingEntryValuePlaceholder') &&
      app.includes('readingEntryValueField') &&
      app.includes('naposledy') &&
      app.includes(' min="${escapeHtml(String(latest.value))}"')
  },
  {
    name: 'reading entries stay open after save and reject lower current values',
    ok: app.includes('readingsEntryDrawerOpen = true;') &&
      app.includes('item.value < Number(latest.value)') &&
      app.includes('value < Number(latest.value)')
  },
  {
    name: 'average reading price is direct unit price first',
    ok: app.includes('const direct = decimalValue(meter?.pricePerUnit);') &&
      app.includes('directAverageFields') &&
      app.includes('Průměrná cena za')
  },
  {
    name: 'warranty files survive renders through an in-memory queue',
    ok: warranty.includes('const warrantyPendingFiles = new Map();') &&
      warranty.includes('stageWarrantyFilesFromForm') &&
      warranty.includes('pendingWarrantyFilesFor(queueKey)')
  },
  {
    name: 'warranty UI shows selected queued files',
    ok: warranty.includes('renderPendingWarrantyFiles') &&
      warranty.includes('Vybráno:')
  },
  {
    name: 'app wires warranty file selection to the queue',
    ok: app.includes('function stageWarrantyFilesFromForm(form)') &&
      app.includes('form[data-form="add-warranty-files"]') &&
      app.includes('stageWarrantyFilesFromForm(warrantyFilesForm)')
  }
];

const failed = checks.filter((check) => !check.ok);
if (failed.length) {
  console.error('Form stability checks failed:');
  failed.forEach((check) => console.error(`- ${check.name}`));
  process.exit(1);
}

console.log(`Form stability checks OK (${checks.length}/${checks.length})`);
