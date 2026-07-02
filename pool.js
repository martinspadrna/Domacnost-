(function () {
  'use strict';

  // Bazén: lokální výpočet objemu a orientační dávkování pH přípravků.
  // Data žijí v households.dashboard_layout.pool, takže není potřeba nová DB tabulka.
  function createPool(deps) {
    const getState = deps.getState || (() => ({}));
    const normalizeText = deps.normalizeText || ((v) => String(v || '').trim());
    const escapeHtml = deps.escapeHtml || ((v) => String(v ?? ''));
    const decimalValue = deps.decimalValue || ((v) => Number(String(v || '').replace(',', '.')) || 0);
    const field = deps.field || (() => '');
    const selectField = deps.selectField || (() => '');
    const renderEmptyCta = deps.renderEmptyCta || (() => '');
    const formatDateTime = deps.formatDateTime || ((v) => String(v || ''));
    const touchState = deps.touchState || (() => {});
    const saveState = deps.saveState || (() => {});
    const render = deps.render || (() => {});
    const showToast = deps.showToast || (() => {});
    const cloudReady = deps.cloudReady || (() => false);
    const cloudSaveHouseholdUiSettings = deps.cloudSaveHouseholdUiSettings || (() => Promise.resolve(false));

    const SHAPE_OPTIONS = [
      ['rect', 'Obdélník'],
      ['round', 'Kruh'],
      ['oval', 'Ovál'],
      ['custom', 'Zadaný objem']
    ];

    function numberOrEmpty(value) {
      if (value === '' || value === null || value === undefined) return '';
      const number = decimalValue(value);
      return number > 0 ? number : '';
    }

    function normalizePoolState(value = {}) {
      const shape = ['rect', 'round', 'oval', 'custom'].includes(value.shape) ? value.shape : 'rect';
      return {
        shape,
        length: numberOrEmpty(value.length),
        width: numberOrEmpty(value.width),
        diameter: numberOrEmpty(value.diameter),
        depth: numberOrEmpty(value.depth),
        volumeM3: numberOrEmpty(value.volumeM3),
        ph: value.ph === '' || value.ph === null || value.ph === undefined ? '' : decimalValue(value.ph),
        targetPh: value.targetPh === '' || value.targetPh === null || value.targetPh === undefined ? 7.2 : decimalValue(value.targetPh) || 7.2,
        dosePer10m3Per01: numberOrEmpty(value.dosePer10m3Per01) || 100,
        note: normalizeText(value.note),
        updatedAt: normalizeText(value.updatedAt)
      };
    }

    function poolVolumeM3(pool = normalizePoolState(getState().pool)) {
      const item = normalizePoolState(pool);
      if (item.shape === 'custom') return decimalValue(item.volumeM3);
      const depth = decimalValue(item.depth);
      if (depth <= 0) return 0;
      if (item.shape === 'round') {
        const diameter = decimalValue(item.diameter);
        return diameter > 0 ? Math.PI * Math.pow(diameter / 2, 2) * depth : 0;
      }
      if (item.shape === 'oval') {
        const length = decimalValue(item.length);
        const width = decimalValue(item.width);
        return length > 0 && width > 0 ? Math.PI * (length / 2) * (width / 2) * depth : 0;
      }
      const length = decimalValue(item.length);
      const width = decimalValue(item.width);
      return length > 0 && width > 0 ? length * width * depth : 0;
    }

    function formatVolume(value) {
      const number = Number(value || 0);
      if (!Number.isFinite(number) || number <= 0) return '0 m³';
      return `${number.toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} m³`;
    }

    function formatGrams(value) {
      const number = Math.max(0, Math.round(Number(value || 0)));
      if (number >= 1000) return `${(number / 1000).toLocaleString('cs-CZ', { maximumFractionDigits: 2 })} kg`;
      return `${number.toLocaleString('cs-CZ')} g`;
    }

    function poolPhDose(pool = normalizePoolState(getState().pool)) {
      const item = normalizePoolState(pool);
      const current = decimalValue(item.ph);
      const target = decimalValue(item.targetPh) || 7.2;
      const volume = poolVolumeM3(item);
      const dosePer10 = decimalValue(item.dosePer10m3Per01) || 100;
      if (volume <= 0 || current <= 0 || target <= 0) return { status: 'missing', label: 'Doplň rozměry a pH', grams: 0, delta: 0 };
      const delta = current - target;
      if (Math.abs(delta) < 0.05) return { status: 'ok', label: 'pH je v cíli', grams: 0, delta };
      const direction = delta > 0 ? 'minus' : 'plus';
      const grams = (volume / 10) * (Math.abs(delta) / 0.1) * dosePer10;
      return {
        status: direction,
        label: direction === 'minus' ? 'Přidat pH-' : 'Přidat pH+',
        grams,
        delta
      };
    }

    function renderDimensionFields(pool) {
      if (pool.shape === 'custom') {
        return field('Objem vody m³', 'volumeM3', 'number', 'např. 24', true, pool.volumeM3 || '');
      }
      if (pool.shape === 'round') {
        return `
          ${field('Průměr m', 'diameter', 'number', 'např. 4,5', true, pool.diameter || '')}
          ${field('Průměrná hloubka m', 'depth', 'number', 'např. 1,2', true, pool.depth || '')}
        `;
      }
      return `
        ${field(pool.shape === 'oval' ? 'Délka m' : 'Délka m', 'length', 'number', 'např. 6', true, pool.length || '')}
        ${field(pool.shape === 'oval' ? 'Šířka m' : 'Šířka m', 'width', 'number', 'např. 3', true, pool.width || '')}
        ${field('Průměrná hloubka m', 'depth', 'number', 'např. 1,2', true, pool.depth || '')}
      `;
    }

    function renderPool() {
      const pool = normalizePoolState(getState().pool || {});
      const volume = poolVolumeM3(pool);
      const dose = poolPhDose(pool);
      const tone = dose.status === 'ok' ? 'good' : dose.status === 'missing' ? 'warn' : 'bad';
      return `
        <section class="card desktop-span-2 pool-panel">
          <div class="card-header"><div><h2>Bazén</h2><p>Objem vody, poslední pH a orientační dávka pH přípravku.</p></div><span class="badge">${formatVolume(volume)}</span></div>
          <div class="kpi-grid compact-kpi-grid">
            <div class="kpi"><strong>${formatVolume(volume)}</strong><span>objem vody</span></div>
            <div class="kpi"><strong>${pool.ph || '—'}</strong><span>aktuální pH</span></div>
            <div class="kpi ${tone}"><strong>${dose.status === 'ok' ? 'OK' : dose.status === 'missing' ? 'doplň' : formatGrams(dose.grams)}</strong><span>${escapeHtml(dose.label)}</span></div>
          </div>
          ${pool.updatedAt ? `<div class="inline-note compact-note">Naposledy upraveno ${escapeHtml(formatDateTime(pool.updatedAt))}${pool.note ? ` · ${escapeHtml(pool.note)}` : ''}</div>` : ''}
          <form data-form="pool-settings" class="compact-form pool-form">
            <div class="form-grid two">
              ${selectField('Tvar bazénu', 'shape', SHAPE_OPTIONS, pool.shape)}
              ${renderDimensionFields(pool)}
              ${field('Aktuální pH', 'ph', 'number', 'např. 7,6', false, pool.ph || '')}
              ${field('Cílové pH', 'targetPh', 'number', 'např. 7,2', false, pool.targetPh || 7.2)}
              ${field('Dávka g / 10 m³ / 0,1 pH', 'dosePer10m3Per01', 'number', 'např. 100', false, pool.dosePer10m3Per01 || 100)}
              ${field('Poznámka', 'note', 'text', 'např. po dešti / chlorování', false, pool.note || '')}
            </div>
            <div class="inline-note compact-note">Dávkování je orientační. Vždy ho porovnej s etiketou konkrétního pH+ / pH- přípravku.</div>
            <div class="form-actions"><button class="primary-btn" type="submit">Uložit bazén</button></div>
          </form>
        </section>
        ${volume > 0 ? '' : renderEmptyCta({ icon: '🏊', title: 'Zadej rozměry bazénu', text: 'Pak se dopočítá objem vody a dávkování podle naměřeného pH.', nav: 'pool', label: 'Nastavit bazén' })}
      `;
    }

    async function savePoolFromForm(data) {
      const current = normalizePoolState(getState().pool || {});
      const next = normalizePoolState({
        ...current,
        ...data,
        updatedAt: new Date().toISOString()
      });
      getState().pool = next;
      touchState();
      saveState({ immediate: true });
      if (cloudReady()) await cloudSaveHouseholdUiSettings(false);
      render();
      showToast('Bazén uložen');
    }

    return {
      normalizePoolState,
      poolVolumeM3,
      formatPoolVolume: formatVolume,
      poolPhDose,
      renderPool,
      savePoolFromForm
    };
  }

  window.DomacnostPool = { createPool };
})();
