(function () {
  'use strict';

  // Bazén: lokální výpočet objemu a orientační dávkování pH přípravků.
  // Data žijí v households.dashboard_layout.pools (pole pojmenovaných bazénů),
  // takže není potřeba nová DB tabulka. Každý bazén má vlastní rozměry/cílové
  // pH i vlastní historii měření - jde o samostatnou "entitu", podobně jako
  // vozidla v Garáži.
  function createPool(deps) {
    const getState = deps.getState || (() => ({}));
    const getModuleTab = deps.getModuleTab || ((area, fallback) => fallback);
    const setModuleTab = deps.setModuleTab || (() => {});
    const renderSectionTabs = deps.renderSectionTabs || (() => '');
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
    const confirm = deps.confirm || ((message) => window.confirm(message));

    let activePoolId = '';
    let phInfoOpen = false;

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

    function normalizePool(value = {}, index = 0) {
      const shape = ['rect', 'round', 'oval', 'custom'].includes(value.shape) ? value.shape : 'rect';
      return {
        id: normalizeText(value.id) || `pool-${uid()}`,
        name: normalizeText(value.name) || `Bazén${index ? ` ${index + 1}` : ''}`,
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
        createdAt: normalizeText(value.createdAt) || new Date().toISOString(),
        updatedAt: normalizeText(value.updatedAt)
      };
    }

    // Zpětná kompatibilita: staré households.dashboard_layout.pool (jeden objekt,
    // bez name/id) migruje app.js na pole s jednou položkou - normalizePool tady
    // dostane i objekt bez id/name a doplní je.
    function normalizePools(value) {
      const rows = Array.isArray(value) ? value : [];
      const seen = new Set();
      return rows.map((row, index) => normalizePool(row, index)).map((pool) => {
        let id = pool.id;
        while (seen.has(id)) id = `pool-${uid()}`;
        seen.add(id);
        return { ...pool, id };
      });
    }

    function getPools() {
      return normalizePools(getState().pools);
    }

    function getActivePool(pools = getPools()) {
      if (!pools.length) return null;
      return pools.find((pool) => pool.id === activePoolId) || pools[0];
    }

    function poolVolumeM3(pool) {
      if (!pool) return 0;
      const item = normalizePool(pool);
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

    function poolPhDose(pool) {
      if (!pool) return { status: 'missing', label: 'Doplň rozměry a pH', grams: 0, delta: 0 };
      const item = normalizePool(pool);
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

    function phInfoContent(pool) {
      const target = decimalValue(pool?.targetPh) || 7.2;
      const ph = decimalValue(pool?.ph);
      if (!ph) {
        return {
          tone: '',
          label: 'pH zatím nezměřeno',
          text: 'pH ukazuje, jak kyselá nebo zásaditá je voda v bazénu. Ideální rozmezí pro koupání i účinnou dezinfekci chlórem je zhruba 7,0–7,6. Změř pH testrem nebo proužky a zapiš ho jako nové měření.'
        };
      }
      const diff = ph - target;
      if (Math.abs(diff) < 0.2) {
        return {
          tone: 'good',
          label: `pH ${formatPoolNumber(ph, 2)} je v pořádku`,
          text: `Hodnota je blízko cíle ${formatPoolNumber(target, 2)}. Voda by měla být příjemná na kůži a oči a dezinfekce (chlór) funguje nejúčinněji právě v tomhle rozmezí.`
        };
      }
      if (diff < 0) {
        return {
          tone: diff < -0.4 ? 'bad' : 'warn',
          label: `pH ${formatPoolNumber(ph, 2)} je nízké (kyselá voda)`,
          text: 'Nejčastější příčiny: hodně deště nebo čerstvě doplněná voda, moc chlornanu/dezinfekce, nebo nově napuštěný bazén. Nízké pH dráždí oči a pokožku a časem koroduje kovové části (žebřík, trysky, topení). Přidej pH+ podle dávkování níž a za pár hodin pH znovu změř.'
        };
      }
      return {
        tone: diff > 0.4 ? 'bad' : 'warn',
        label: `pH ${formatPoolNumber(ph, 2)} je vysoké (zásaditá voda)`,
        text: 'Nejčastější příčiny: tvrdá napouštěná voda, moc přidaného pH+ přípravku, nebo víc organického znečištění (listí, pyl, opalovací krémy). Vysoké pH snižuje účinnost chlóru a může způsobit zákal vody a vodní kámen. Přidej pH- podle dávkování níž a za pár hodin pH znovu změř.'
      };
    }

    function renderPhInfoModal(pool) {
      if (!phInfoOpen || !pool) return '';
      const info = phInfoContent(pool);
      return `
        <div class="app-modal-backdrop pool-ph-info-backdrop" data-modal-backdrop role="presentation">
          <section class="app-modal pool-ph-info-modal" role="dialog" aria-modal="true" aria-labelledby="pool-ph-info-title">
            <div class="app-modal-head">
              <div>
                <span class="badge ${escapeHtml(info.tone)}">${escapeHtml(info.label)}</span>
                <h2 id="pool-ph-info-title">Co znamená pH bazénu</h2>
              </div>
              <button class="icon-btn" type="button" data-action="close-modal" aria-label="Zavřít vysvětlivku">×</button>
            </div>
            <p>${escapeHtml(info.text)}</p>
          </section>
        </div>
      `;
    }

    function openPhInfoModal() {
      phInfoOpen = true;
      render();
    }

    function closePhInfoModal() {
      if (!phInfoOpen) return;
      phInfoOpen = false;
      render();
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
            <button type="button" class="kpi kpi-clickable" data-action="pool-ph-info"><strong>${latest?.ph !== '' && latest?.ph !== undefined ? formatPoolNumber(latest.ph, 2) : '—'}</strong><span>poslední pH</span></button>
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
        ${field('Délka m', 'length', 'number', 'např. 6', true, pool.length || '')}
        ${field('Šířka m', 'width', 'number', 'např. 3', true, pool.width || '')}
        ${field('Průměrná hloubka m', 'depth', 'number', 'např. 1,2', true, pool.depth || '')}
      `;
    }

    function renderPoolSwitcher(pools, activePool) {
      if (!pools.length) return '';
      return `
        <div class="pool-switcher" data-no-swipe>
          ${pools.map((pool) => `
            <button class="pool-switcher-chip ${activePool && pool.id === activePool.id ? 'active' : ''}" type="button" data-action="pool-select" data-id="${escapeHtml(pool.id)}">${escapeHtml(pool.name)}</button>
          `).join('')}
          <button class="pool-switcher-chip pool-switcher-add" type="button" data-action="pool-add">+ Nový bazén</button>
        </div>
      `;
    }

    function renderPoolAddForm(pool, exists = true) {
      return `
        <form data-form="pool-settings" class="compact-form pool-form">
          <div class="form-grid two">
            ${field('Název bazénu', 'name', 'text', 'např. Zahradní bazén', true, pool.name || '')}
            ${selectField('Tvar bazénu', 'shape', SHAPE_OPTIONS, pool.shape)}
            ${renderDimensionFields(pool)}
            ${field('Datum měření', 'measurementDate', 'date', '', false, todayISO())}
            ${field('Aktuální pH', 'ph', 'number', 'např. 7,6', false, '')}
            ${field('Teplota vody °C', 'waterTempC', 'number', 'např. 24,5', false, '')}
            ${field('Cílové pH', 'targetPh', 'number', 'např. 7,2', false, pool.targetPh || 7.2)}
            ${field('Dávka g / 10 m³ / 0,1 pH', 'dosePer10m3Per01', 'number', 'např. 100', false, pool.dosePer10m3Per01 || 100)}
            ${field('Poznámka', 'note', 'text', 'např. po dešti / chlorování', false, pool.note || '')}
          </div>
          <div class="inline-note compact-note">Dávkování je orientační. Vždy ho porovnej s etiketou konkrétního pH+ / pH- přípravku. Uložení se zaznamená i jako nové měření, pokud se pH/teplota/datum liší od posledního záznamu.</div>
          <div class="form-actions">
            <button class="primary-btn" type="submit">${exists ? 'Uložit bazén / měření' : 'Založit bazén'}</button>
            ${exists ? `<button class="danger-btn" type="button" data-action="pool-delete" data-id="${escapeHtml(pool.id)}">Smazat tento bazén</button>` : ''}
          </div>
        </form>
      `;
    }

    function renderPool() {
      const pools = getPools();
      const pool = getActivePool(pools);
      if (!pool) {
        if (getModuleTab('pool', 'overview') === 'add') {
          return `
            <section class="card desktop-span-2 pool-panel">
              <div class="card-header"><div><h2>Nový bazén</h2><p>Zadej rozměry a cílové pH, uložením se bazén založí.</p></div></div>
              ${renderPoolAddForm(normalizePool({}), false)}
            </section>
          `;
        }
        return renderEmptyCta({ icon: '🏊', title: 'Zatím žádný bazén', text: 'Založ bazén, nastav rozměry a cílové pH, ať se dá počítat objem vody a dávkování.', nav: 'pool', tab: 'add', label: 'Založit bazén' });
      }
      const volume = poolVolumeM3(pool);
      const dose = poolPhDose(pool);
      const tone = dose.status === 'ok' ? 'good' : dose.status === 'missing' ? 'warn' : 'bad';
      const latest = latestPoolMeasurement(pool);
      const activeTab = getModuleTab('pool', 'overview');
      const tabs = renderSectionTabs('pool', [
        { id: 'overview', label: 'Přehled', icon: '🏊', count: normalizePoolMeasurements(pool.measurements).length },
        { id: 'add', label: 'Nové měření', icon: '➕' }
      ], 'overview');
      return `
        <section class="card desktop-span-2 pool-panel">
          <div class="card-header"><div><h2>${escapeHtml(pool.name)}</h2><p>Objem vody, poslední pH a orientační dávka pH přípravku.</p></div><span class="badge">${formatVolume(volume)}</span></div>
          ${renderPoolSwitcher(pools, pool)}
          ${tabs}
          <div class="module-tabbed pool-tab-${escapeHtml(activeTab)}" data-tab-area="pool">
            ${activeTab === 'add' ? renderPoolAddForm(pool) : `
              <div class="kpi-grid compact-kpi-grid">
                <div class="kpi"><strong>${formatVolume(volume)}</strong><span>objem vody</span></div>
                <button type="button" class="kpi kpi-clickable" data-action="pool-ph-info"><strong>${pool.ph || '—'}</strong><span>aktuální pH</span></button>
                <div class="kpi"><strong>${pool.waterTempC ? `${formatPoolNumber(pool.waterTempC, 1)} °C` : '—'}</strong><span>teplota vody</span></div>
                <div class="kpi ${tone}"><strong>${dose.status === 'ok' ? 'OK' : dose.status === 'missing' ? 'doplň' : formatGrams(dose.grams)}</strong><span>${escapeHtml(dose.label)}</span></div>
              </div>
              ${pool.updatedAt ? `<div class="inline-note compact-note">Naposledy upraveno ${escapeHtml(formatDateTime(pool.updatedAt))}${latest?.date ? ` · měření ${escapeHtml(formatDate(latest.date))}` : ''}${pool.note ? ` · ${escapeHtml(pool.note)}` : ''}</div>` : ''}
              <div class="form-actions compact-actions pool-overview-actions"><button class="ghost-btn danger-btn" type="button" data-action="pool-delete" data-id="${escapeHtml(pool.id)}">Smazat tento bazén</button></div>
            `}
          </div>
        </section>
        ${activeTab === 'overview' ? renderPoolMeasurements(pool) : ''}
        ${volume > 0 ? '' : renderEmptyCta({ icon: '🏊', title: 'Zadej rozměry bazénu', text: 'Pak se dopočítá objem vody a dávkování podle naměřeného pH.', nav: 'pool', tab: 'add', label: 'Nastavit bazén' })}
        ${renderPhInfoModal(pool)}
      `;
    }

    function markPoolCloudPending(options = {}) {
      const state = getState();
      const now = new Date().toISOString();
      const deletedIds = { ...(state.poolCloud?.deletedIds || {}) };
      const deletedId = normalizeText(options.deletedId);
      if (deletedId) deletedIds[deletedId] = now;
      state.poolCloud = {
        ...(state.poolCloud || {}),
        pendingAt: now,
        deletedIds
      };
    }

    function markPoolCloudSaved() {
      const state = getState();
      state.poolCloud = {
        ...(state.poolCloud || {}),
        pendingAt: '',
        loadedAt: new Date().toISOString(),
        deletedIds: { ...(state.poolCloud?.deletedIds || {}) }
      };
      saveState({ immediate: true });
    }

    function persistPools(pools, options = {}) {
      getState().pools = normalizePools(pools);
      markPoolCloudPending(options);
      touchState();
      saveState({ immediate: options.immediate === true });
      if (cloudReady()) {
        cloudSaveHouseholdUiSettings(false)
          .then((ok) => { if (ok) markPoolCloudSaved(); })
          .catch((error) => console.warn('Cloud sync (bazén) na pozadí selhal', error));
      }
    }

    function addPool() {
      const pools = getPools();
      const pool = normalizePool({ name: `Bazén ${pools.length + 1}` }, pools.length);
      persistPools([...pools, pool]);
      activePoolId = pool.id;
      setModuleTab('pool', 'add');
      render();
      showToast('Nový bazén přidán, doplň rozměry a pH');
    }

    function previewShape(shape) {
      const pools = getPools();
      const active = getActivePool(pools);
      if (!active) return;
      const updated = normalizePool({ ...active, shape });
      getState().pools = pools.map((pool) => (pool.id === active.id ? updated : pool));
      render();
    }

    function selectPool(id) {
      const pools = getPools();
      if (!pools.some((pool) => pool.id === id)) return;
      activePoolId = id;
      render();
    }

    function deletePool(id) {
      const pools = getPools();
      const target = pools.find((pool) => pool.id === id);
      if (!target) return;
      if (!confirm(`Smazat bazén „${target.name}“${target.measurements.length ? ` včetně ${target.measurements.length} měření` : ''}?`)) return;
      const next = pools.filter((pool) => pool.id !== id);
      if (activePoolId === id) activePoolId = next[0]?.id || '';
      persistPools(next, { deletedId: id, immediate: true });
      setModuleTab('pool', 'overview');
      render();
      showToast('Bazén smazán');
    }

    async function savePoolFromForm(data) {
      const pools = getPools();
      const current = getActivePool(pools) || normalizePool({}, pools.length);
      // Formulář "Nové měření" nechává pH/teplotu prázdné (nepředvyplňuje se stará
      // hodnota) - když je uživatel nevyplní, zůstává aktuální pH/teplota bazénu
      // beze změny (nesmaže se na prázdno) a žádné nové měření se nezaznamená.
      const typedPh = normalizeText(data.ph);
      const typedWaterTempC = normalizeText(data.waterTempC);
      const next = normalizePool({
        ...current,
        ...data,
        name: normalizeText(data.name) || current.name,
        ph: typedPh === '' ? current.ph : data.ph,
        waterTempC: typedWaterTempC === '' ? current.waterTempC : data.waterTempC,
        updatedAt: new Date().toISOString()
      });
      const measurement = normalizePoolMeasurement({
        date: normalizeText(data.measurementDate) || todayISO(),
        ph: typedPh === '' ? '' : next.ph,
        waterTempC: typedWaterTempC === '' ? '' : next.waterTempC,
        note: next.note
      });
      if (shouldAppendMeasurement(current, measurement)) {
        next.measurements = normalizePoolMeasurements([...(current.measurements || []), measurement]);
      } else {
        next.measurements = normalizePoolMeasurements(current.measurements || []);
      }
      const exists = pools.some((pool) => pool.id === current.id);
      const nextPools = exists ? pools.map((pool) => (pool.id === current.id ? next : pool)) : [...pools, next];
      activePoolId = next.id;
      persistPools(nextPools);
      render();
      showToast('Bazén uložen');
    }

    return {
      normalizePool,
      normalizePools,
      getPools,
      getActivePool,
      poolVolumeM3,
      formatPoolVolume: formatVolume,
      poolPhDose,
      renderPool,
      savePoolFromForm,
      addPool,
      selectPool,
      deletePool,
      previewShape,
      openPhInfoModal,
      closePhInfoModal
    };
  }

  window.DomacnostPool = { createPool };
})();
