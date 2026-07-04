(function () {
  'use strict';

  // Bazén: lokální výpočet objemu a orientační dávkování pH přípravků.
  // Data žijí v households.dashboard_layout.pool, takže není potřeba nová DB tabulka.
  function createPool(deps) {
    const getState = deps.getState || (() => ({}));
    const uid = deps.uid || (() => `${Date.now()}-${Math.random().toString(16).slice(2)}`);
    const todayISO = deps.todayISO || (() => new Date().toISOString().slice(0, 10));
    const normalizeText = deps.normalizeText || ((v) => String(v || '').trim());
    const escapeHtml = deps.escapeHtml || ((v) => String(v ?? ''));
    const decimalValue = deps.decimalValue || ((v) => Number(String(v || '').replace(',', '.')) || 0);
    const field = deps.field || (() => '');
    const selectField = deps.selectField || (() => '');
    const renderEmptyCta = deps.renderEmptyCta || (() => '');
    const formatDate = deps.formatDate || ((v) => String(v || ''));
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

    function nullableNumber(value) {
      if (value === '' || value === null || value === undefined) return '';
      const number = decimalValue(value);
      return Number.isFinite(number) && number > 0 ? number : '';
    }

    function normalizePoolMeasurement(value = {}) {
      const date = normalizeText(value.date || value.measuredAt || value.createdAt || todayISO()).slice(0, 10) || todayISO();
      return {
        id: normalizeText(value.id) || `pool-measure-${uid()}`,
        date,
        ph: nullableNumber(value.ph),
        waterTempC: nullableNumber(value.waterTempC ?? value.waterTemp ?? value.temperature),
        note: normalizeText(value.note),
        createdAt: normalizeText(value.createdAt) || new Date().toISOString()
      };
    }

    function normalizePoolMeasurements(value) {
      const rows = Array.isArray(value) ? value : [];
      return rows
        .map(normalizePoolMeasurement)
        .filter((item) => item.ph !== '' || item.waterTempC !== '')
        .sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')) || String(a.createdAt || '').localeCompare(String(b.createdAt || '')))
        .slice(-120);
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
        waterTempC: nullableNumber(value.waterTempC ?? value.waterTemp ?? value.temperature),
        targetPh: value.targetPh === '' || value.targetPh === null || value.targetPh === undefined ? 7.2 : decimalValue(value.targetPh) || 7.2,
        dosePer10m3Per01: numberOrEmpty(value.dosePer10m3Per01) || 100,
        measurements: normalizePoolMeasurements(value.measurements),
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

    function latestPoolMeasurement(pool) {
      const measurements = normalizePoolMeasurements(pool.measurements);
      return measurements.length ? measurements[measurements.length - 1] : null;
    }

    function shouldAppendMeasurement(current, measurement) {
      if (!measurement || (measurement.ph === '' && measurement.waterTempC === '')) return false;
      const last = latestPoolMeasurement(current);
      if (!last) return true;
      return !(last.date === measurement.date
        && Number(last.ph || 0) === Number(measurement.ph || 0)
        && Number(last.waterTempC || 0) === Number(measurement.waterTempC || 0)
        && String(last.note || '') === String(measurement.note || ''));
    }

    function formatPoolNumber(value, decimals = 1) {
      const number = Number(value);
      if (!Number.isFinite(number) || number <= 0) return '—';
      return number.toLocaleString('cs-CZ', { maximumFractionDigits: decimals });
    }

    function renderPoolMeasurements(pool) {
      const measurements = normalizePoolMeasurements(pool.measurements);
      const latest = latestPoolMeasurement(pool);
      const chartRows = measurements.slice(-14);
      const tableRows = measurements.slice(-6).reverse();
      const chart = renderPoolMeasurementChart(chartRows);
      return `
        <section class="card desktop-span-2 pool-measurements-panel">
          <div class="card-header"><div><h2>Měření vody</h2><p>Historie pH a teploty vody pro sledování trendu.</p></div><span class="badge">${measurements.length} měření</span></div>
          <div class="kpi-grid compact-kpi-grid">
            <div class="kpi"><strong>${latest?.ph !== '' && latest?.ph !== undefined ? formatPoolNumber(latest.ph, 2) : '—'}</strong><span>poslední pH</span></div>
            <div class="kpi"><strong>${latest?.waterTempC !== '' && latest?.waterTempC !== undefined ? `${formatPoolNumber(latest.waterTempC, 1)} °C` : '—'}</strong><span>teplota vody</span></div>
            <div class="kpi"><strong>${latest?.date ? formatDate(latest.date) : '—'}</strong><span>poslední měření</span></div>
          </div>
          ${chart}
          ${tableRows.length ? `<div class="file-list compact-file-list pool-measurement-list">${tableRows.map((item) => `
            <div class="file-row compact-file-row">
              <div>
                <strong>${escapeHtml(formatDate(item.date))}</strong>
                <em>pH ${escapeHtml(formatPoolNumber(item.ph, 2))} · voda ${escapeHtml(item.waterTempC !== '' ? `${formatPoolNumber(item.waterTempC, 1)} °C` : '—')}${item.note ? ` · ${escapeHtml(item.note)}` : ''}</em>
              </div>
            </div>
          `).join('')}</div>` : '<div class="inline-note compact-note">Zatím žádné uložené měření. Vyplň pH nebo teplotu vody a ulož bazén.</div>'}
        </section>
      `;
    }

    function renderPoolMeasurementChart(rows) {
      if (!rows.length) return '<div class="inline-note compact-note">Graf se zobrazí po prvním měření.</div>';
      const width = 520;
      const height = 220;
      const padLeft = 36;
      const padRight = 18;
      const padTop = 20;
      const padBottom = 42;
      const innerWidth = width - padLeft - padRight;
      const innerHeight = height - padTop - padBottom;
      const phValues = rows.map((item) => Number(item.ph)).filter(Number.isFinite);
      const tempValues = rows.map((item) => Number(item.waterTempC)).filter(Number.isFinite);
      const phMin = Math.min(6.8, ...phValues);
      const phMax = Math.max(8.0, ...phValues);
      const tempMin = Math.max(0, Math.floor(Math.min(18, ...tempValues) - 1));
      const tempMax = Math.ceil(Math.max(30, ...tempValues) + 1);
      const xFor = (index) => padLeft + (rows.length === 1 ? innerWidth / 2 : (index / (rows.length - 1)) * innerWidth);
      const yScale = (value, min, max) => padTop + ((max - value) / Math.max(max - min, 0.1)) * innerHeight;
      const pathFor = (key, min, max) => {
        let started = false;
        return rows.map((item, index) => {
          const value = Number(item[key]);
          if (!Number.isFinite(value)) return '';
          const command = started ? 'L' : 'M';
          started = true;
          return `${command} ${xFor(index).toFixed(1)} ${yScale(value, min, max).toFixed(1)}`;
        })
        .filter(Boolean)
        .join(' ');
      };
      const phPath = pathFor('ph', phMin, phMax);
      const tempPath = pathFor('waterTempC', tempMin, tempMax);
      const labels = rows.map((item, index) => {
        const x = xFor(index);
        const label = String(item.date || '').slice(5).replace('-', '.');
        return `<text x="${x.toFixed(1)}" y="${height - 18}" text-anchor="middle">${escapeHtml(label)}</text>`;
      }).join('');
      const phDots = rows.map((item, index) => {
        const value = Number(item.ph);
        if (!Number.isFinite(value)) return '';
        return `<circle class="pool-chart-dot ph" cx="${xFor(index).toFixed(1)}" cy="${yScale(value, phMin, phMax).toFixed(1)}" r="4"></circle>`;
      }).join('');
      const tempDots = rows.map((item, index) => {
        const value = Number(item.waterTempC);
        if (!Number.isFinite(value)) return '';
        return `<circle class="pool-chart-dot temp" cx="${xFor(index).toFixed(1)}" cy="${yScale(value, tempMin, tempMax).toFixed(1)}" r="4"></circle>`;
      }).join('');
      return `
        <div class="pool-chart-wrap">
          <div class="consumption-chart-head"><strong>Trend vody</strong><span>posledních ${rows.length} měření</span></div>
          <svg class="consumption-chart pool-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Graf pH a teploty vody">
            <g class="consumption-grid">
              <line x1="${padLeft}" y1="${padTop}" x2="${width - padRight}" y2="${padTop}"></line>
              <line x1="${padLeft}" y1="${padTop + innerHeight / 2}" x2="${width - padRight}" y2="${padTop + innerHeight / 2}"></line>
              <line x1="${padLeft}" y1="${padTop + innerHeight}" x2="${width - padRight}" y2="${padTop + innerHeight}"></line>
              <text x="${padLeft - 8}" y="${padTop + 4}" text-anchor="end">pH ${phMax.toFixed(1)}</text>
              <text x="${padLeft - 8}" y="${padTop + innerHeight + 4}" text-anchor="end">pH ${phMin.toFixed(1)}</text>
            </g>
            ${phPath ? `<path class="pool-chart-line ph" d="${phPath}"></path>` : ''}
            ${tempPath ? `<path class="pool-chart-line temp" d="${tempPath}"></path>` : ''}
            ${phDots}${tempDots}
            <g class="consumption-bar">${labels}</g>
          </svg>
          <div class="consumption-chart-stats pool-chart-legend">
            <span><strong>pH</strong><em>modrá linka</em></span>
            <span><strong>°C</strong><em>zelená linka, vlastní měřítko</em></span>
          </div>
        </div>
      `;
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
      const latest = latestPoolMeasurement(pool);
      return `
        <section class="card desktop-span-2 pool-panel">
          <div class="card-header"><div><h2>Stav vody</h2><p>Objem vody, poslední pH a orientační dávka pH přípravku.</p></div><span class="badge">${formatVolume(volume)}</span></div>
          <div class="kpi-grid compact-kpi-grid">
            <div class="kpi"><strong>${formatVolume(volume)}</strong><span>objem vody</span></div>
            <div class="kpi"><strong>${pool.ph || '—'}</strong><span>aktuální pH</span></div>
            <div class="kpi"><strong>${pool.waterTempC ? `${formatPoolNumber(pool.waterTempC, 1)} °C` : '—'}</strong><span>teplota vody</span></div>
            <div class="kpi ${tone}"><strong>${dose.status === 'ok' ? 'OK' : dose.status === 'missing' ? 'doplň' : formatGrams(dose.grams)}</strong><span>${escapeHtml(dose.label)}</span></div>
          </div>
          ${pool.updatedAt ? `<div class="inline-note compact-note">Naposledy upraveno ${escapeHtml(formatDateTime(pool.updatedAt))}${latest?.date ? ` · měření ${escapeHtml(formatDate(latest.date))}` : ''}${pool.note ? ` · ${escapeHtml(pool.note)}` : ''}</div>` : ''}
          <form data-form="pool-settings" class="compact-form pool-form">
            <div class="form-grid two">
              ${selectField('Tvar bazénu', 'shape', SHAPE_OPTIONS, pool.shape)}
              ${renderDimensionFields(pool)}
              ${field('Datum měření', 'measurementDate', 'date', '', false, latest?.date || todayISO())}
              ${field('Aktuální pH', 'ph', 'number', 'např. 7,6', false, pool.ph || '')}
              ${field('Teplota vody °C', 'waterTempC', 'number', 'např. 24,5', false, pool.waterTempC || '')}
              ${field('Cílové pH', 'targetPh', 'number', 'např. 7,2', false, pool.targetPh || 7.2)}
              ${field('Dávka g / 10 m³ / 0,1 pH', 'dosePer10m3Per01', 'number', 'např. 100', false, pool.dosePer10m3Per01 || 100)}
              ${field('Poznámka', 'note', 'text', 'např. po dešti / chlorování', false, pool.note || '')}
            </div>
            <div class="inline-note compact-note">Dávkování je orientační. Vždy ho porovnej s etiketou konkrétního pH+ / pH- přípravku.</div>
            <div class="form-actions"><button class="primary-btn" type="submit">Uložit bazén</button></div>
          </form>
        </section>
        ${renderPoolMeasurements(pool)}
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
      const measurement = normalizePoolMeasurement({
        date: normalizeText(data.measurementDate) || todayISO(),
        ph: next.ph,
        waterTempC: next.waterTempC,
        note: next.note
      });
      if (shouldAppendMeasurement(current, measurement)) {
        next.measurements = normalizePoolMeasurements([...(current.measurements || []), measurement]);
      } else {
        next.measurements = normalizePoolMeasurements(current.measurements || []);
      }
      getState().pool = next;
      touchState();
      saveState({ immediate: true });
      if (cloudReady()) await cloudSaveHouseholdUiSettings(false);
      render();
      showToast('Bazén uložen');
    }

    return {
      normalizePoolState,
      normalizePoolMeasurements,
      poolVolumeM3,
      formatPoolVolume: formatVolume,
      poolPhDose,
      renderPool,
      savePoolFromForm
    };
  }

  window.DomacnostPool = { createPool };
})();
