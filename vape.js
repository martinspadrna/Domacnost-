(function () {
  'use strict';

  // Vape: ceník nákupů + 3 kalkulačky (booster/báze, hotová báze/aroma, vlastní směs).
  // Data žijí v households.dashboard_layout.vape, stejně jako u bazénu - není potřeba nová DB tabulka.
  function createVape(deps) {
    const getState = deps.getState || (() => ({}));
    const uid = deps.uid || (() => `${Date.now()}-${Math.random().toString(16).slice(2)}`);
    const todayISO = deps.todayISO || (() => new Date().toISOString().slice(0, 10));
    const normalizeText = deps.normalizeText || ((v) => String(v || '').trim());
    const normalizeKey = deps.normalizeKey || ((v) => String(v || '').toLowerCase());
    const escapeHtml = deps.escapeHtml || ((v) => String(v ?? ''));
    const decimalValue = deps.decimalValue || ((v) => Number(String(v || '').replace(',', '.')) || 0);
    const field = deps.field || (() => '');
    const selectField = deps.selectField || (() => '');
    const renderEmpty = deps.renderEmpty || ((text) => `<div class="empty">${escapeHtml(text)}</div>`);
    const renderEmptyCta = deps.renderEmptyCta || (() => '');
    const renderSectionTabs = deps.renderSectionTabs || (() => '');
    const getModuleTab = deps.getModuleTab || ((area, fallback) => fallback);
    const formatCurrency = deps.formatCurrency || ((v) => `${Math.round(Number(v) || 0)} Kč`);
    const touchState = deps.touchState || (() => {});
    const saveState = deps.saveState || (() => {});
    const render = deps.render || (() => {});
    const showToast = deps.showToast || (() => {});
    const cloudReady = deps.cloudReady || (() => false);
    const cloudSaveHouseholdUiSettings = deps.cloudSaveHouseholdUiSettings || (() => Promise.resolve(false));

    let vapeItemEditId = '';

    const VAPE_CATEGORIES = [
      ['devices', 'Zařízení'],
      ['cartridge', 'Cartridge'],
      ['ready', 'Hotové liquidy'],
      ['shakevape', 'Shake & Vape'],
      ['base', 'Báze'],
      ['booster', 'Boostery'],
      ['aroma', 'Aroma'],
      ['other', 'Ostatní']
    ];
    const VAPE_CATEGORY_LABELS = Object.fromEntries(VAPE_CATEGORIES);

    // Přepis kompletního ceníku z "Vape kalkulačka.xlsm" (list Ceny) k datu importu.
    // [kategorie, název, cena, velikost v ml (null = kus bez objemu), počet kusů, hodnocení /10]
    const VAPE_SEED_ITEMS = [
      ['devices', 'OXVA Xlim Pro 2 Pod Kit (Brown Python)', 783, null, 1, null],
      ['devices', 'OXVA Xlim Pro 2 Pod Kit (Black Carbon)', 751, null, 1, null],
      ['devices', 'Oxva Xlim Pro V3 POD', 844, null, 1, null],
      ['cartridge', 'OXVA Xlim V3 Top Fill 0.8 ohm', 97, null, 2, null],
      ['cartridge', 'OXVA Xlim V3 Top Fill 0.6 ohm', 97, null, 2, null],
      ['cartridge', 'OXVA Xlim V3 Top Fill 0.8 ohm', 99, null, 4, null],
      ['cartridge', 'OXVA Xlim V3 Top Fill 1.2 ohm', 100, null, 1, null],
      ['ready', 'Dreamix SALT - Apple (Jablko) (10mg)', 156, 10, 1, 1],
      ['ready', 'Dreamix SALT - Apple (Jablko) (20mg)', 156, 10, 1, 1],
      ['ready', 'Dreamix SALT - Strawberry (Jahoda) (10mg)', 156, 10, 1, 10],
      ['ready', 'ELF BAR ELFLIQ Blueberry (10mg)', 175, 10, 1, 1],
      ['ready', 'EMPORIO Nic Salt Mentol (12mg)', 132, 10, 1, 10],
      ['ready', 'EMPORIO Strawberry (3mg)', 0, 10, 1, 8],
      ['ready', 'Drifter 10mg bar salts - Sweet strawberry ice', 200, 10, 1, 10],
      ['ready', 'Drifter 10mg bar salts - Apple peach', 200, 10, 1, 8],
      ['ready', 'Drifter 10mg bar salts - Sweet blueberry ice', 185, 10, 1, null],
      ['shakevape', 'Adam´s Vape Lemon Bomb', 0, 10, 1, 10],
      ['shakevape', 'Drifter 0mg bar juice - Sweet strawberry ice', 315, 16, 1, 10],
      ['shakevape', 'Drifter 0mg bar juice - Sweet blueberry ice', 315, 16, 1, 10],
      ['shakevape', 'Juice Sauz Drifter Shake and Vape 16/60ml Apple Peach', 254.3, 16, 2, 10],
      ['shakevape', 'Juice Sauz Drifter Shake and Vape 16/60ml Sweet Strawberry Ice', 254.3, 16, 2, 10],
      ['shakevape', 'Juice Sauz Drifter Shake and Vape 16/60ml Sweet Blueberry Ice', 254.3, 16, 2, 0],
      ['shakevape', 'Juice Sauz Drifter Shake and Vape 16/60ml Cherry', 254.3, 16, 1, null],
      ['shakevape', 'Juice Sauz Drifter Shake and Vape 16/60ml Blueberry Bubblegum', 248, 16, 2, 8],
      ['shakevape', 'Juice Sauz Drifter Shake and Vape 16/60ml Cola', 248, 16, 1, 8.5],
      ['shakevape', 'Juice Sauz Drifter Shake and Vape 16/60ml Peach Ice', 248, 16, 1, 10],
      ['shakevape', 'Juice Sauz Drifter Shake and Vape 16/60ml Apple Peach', 248, 16, 2, 10],
      ['shakevape', 'Juice Sauz Drifter Shake and Vape 16/60ml Sweet Strawberry Ice', 248, 16, 1, 4],
      ['shakevape', 'Juice Sauz Drifter Shake and Vape 16/60ml Cherimoya Grapefruit & Berries', 353, 16, 1, null],
      ['shakevape', 'Al Carlo Shake and Vape 12/60ml Virginia Blueberry', 280, 12, 1, null],
      ['shakevape', 'Bombo-Solo Shake and Vape 15/60ml Caramel Choco Nuts (Čokoláda s karamelem a ořechy)', 336, 15, 1, null],
      ['shakevape', 'Bombo-Solo Shake and Vape 15/60ml Drakulin Icecream (Jahodovo-vanilková zmrzlina s colou)', 336, 15, 1, null],
      ['shakevape', 'Bombo-Solo Shake and Vape 15/60ml Vanilla Biscuit (Vanilková sušenka)', 336, 15, 1, null],
      ['shakevape', 'Bombo-Solo Shake and Vape 15/60ml Watermelon Ice (Ledový vodní meloun)', 336, 15, 1, null],
      ['shakevape', 'Bombo-Solo Shake and Vape 15/60ml Bubblegum Ice (Sladká žvýkačka na ledu)', 336, 15, 1, null],
      ['base', 'FICHEMA Glycerín VG USP 99,5%', 95, 1000, 1, null],
      ['base', 'FICHEMA Monopropylenglykol PG USP 99,5%', 119, 1000, 1, null],
      ['booster', 'Booster Emporio SALT SHOT 20mg (50/50)', 409, 50, 2, null],
      ['booster', 'Unflavored 200mg/ml Nicotine Salt B (100/0)', 1288.6, 100, 1, null],
      ['aroma', 'IMPERIA Black Label French Vanilla', 139, 10, 1, null],
      ['aroma', 'IMPERIA Black Label Garden Strawberry (Zahradní jahoda)', 139, 10, 1, null],
      ['aroma', 'IMPERIA Black Label Cherry (Třešeň)', 139, 10, 1, null],
      ['aroma', 'IMPERIA Black Label Toffee', 139, 10, 1, null],
      ['aroma', 'IMPERIA Black Label Tutti Frutti', 139, 10, 1, null],
      ['aroma', 'IMPERIA Black Label Wafle', 139, 10, 1, null],
      ['aroma', 'IMPERIA Black Label Borůvka', 139, 10, 1, null],
      ['aroma', 'IMPERIA Black Label Cola (Kola)', 139, 10, 1, null],
      ['aroma', 'IMPERIA Black Label Cola (Kola) (zdarma)', 0, 10, 1, null],
      ['aroma', 'IMPERIA Black Label Perník', 146, 10, 1, null],
      ['aroma', 'IMPERIA Black Label Perník (zdarma)', 0, 10, 1, null],
      ['aroma', 'IMPERIA Black Label Green Apple', 159, 10, 1, null],
      ['aroma', 'Big Mounth Beast Sunrise', 0, 10, 1, null],
      ['aroma', 'Big Mouth All Loved Up - Lemon Tree (Citronáda)', 0, 10, 1, null],
      ['aroma', 'HiLIQ Concentrated Flavors 5ml Ice Blueberry v.2', 68, 5, 1, null],
      ['other', 'Injekční stříkačka 2,5ml s jehlou', 9, null, 1, null],
      ['other', 'Lahvička 10ml', 9, null, 5, null],
      ['other', 'Diamond Mist Chubby style s ryskou (unicorn) 60ml', 38, null, 2, null],
      ['other', 'Chubby Gorilla - lahvička 10ml V3', 11.75, null, 4, null],
      ['other', 'Flavourit s twist uzávěrem a ryskou - 250ml', 48, null, 2, null],
      ['other', 'Flavourit s twist uzávěrem a ryskou - 50ml', 28, null, 2, null],
      ['other', 'Twist style plnící lahvička s ryskou (Twist) 60ml', 48, null, 1, null],
      ['other', 'Flavourit s ryskou 250ml', 42, null, 1, null],
      ['other', 'Chubby Gorilla 120ml', 52, null, 1, null],
      ['other', 'Big Mounth 30ml', 0, null, 2, null],
      ['other', 'Just Juice S&V: Guanabana & Lime on Ice', 264, 10, 1, null],
      ['other', 'Dekang Dripper PG30-VG70 20mg', 480, 50, 1, null]
    ];

    function seedVapeItems() {
      return VAPE_SEED_ITEMS.map(([category, name, price, sizeMl, qty, rating]) => normalizeVapeItem({
        id: `vape-item-${uid()}`,
        category,
        name,
        price,
        sizeMl,
        qty,
        rating,
        note: '',
        createdAt: '2025-01-06T00:00:00.000Z'
      }));
    }

    function normalizeVapeItem(value = {}) {
      const category = VAPE_CATEGORIES.some(([id]) => id === value.category) ? value.category : 'other';
      const price = Math.max(0, decimalValue(value.price));
      const sizeMl = value.sizeMl === '' || value.sizeMl === null || value.sizeMl === undefined ? null : Math.max(0, decimalValue(value.sizeMl)) || null;
      const qty = Math.max(1, Math.round(decimalValue(value.qty)) || 1);
      const ratingRaw = value.rating === '' || value.rating === null || value.rating === undefined ? null : decimalValue(value.rating);
      const rating = ratingRaw === null || !Number.isFinite(ratingRaw) ? null : Math.min(10, Math.max(0, ratingRaw));
      return {
        id: normalizeText(value.id) || `vape-item-${uid()}`,
        category,
        name: normalizeText(value.name),
        price,
        sizeMl,
        qty,
        rating,
        note: normalizeText(value.note),
        createdAt: normalizeText(value.createdAt) || new Date().toISOString()
      };
    }

    function normalizeVapeItems(value) {
      const rows = Array.isArray(value) ? value : [];
      return rows.map(normalizeVapeItem).filter((item) => item.name);
    }

    function vapeItemPricePerMl(item) {
      if (!item || !(item.sizeMl > 0)) return null;
      return item.price / item.sizeMl;
    }

    function normalizeVapeCalc(value) {
      return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
    }

    function normalizeVapeState(value = {}) {
      return {
        items: normalizeVapeItems(value.items),
        resaleTotal: Math.max(0, decimalValue(value.resaleTotal ?? 0)),
        startDate: /^\d{4}-\d{2}-\d{2}$/.test(String(value.startDate || '')) ? value.startDate : todayISO(),
        cigaretteCostPerDay: decimalValue(value.cigaretteCostPerDay ?? 150.5) || 150.5,
        calcBooster: normalizeVapeCalc(value.calcBooster),
        calcReady: normalizeVapeCalc(value.calcReady),
        calcShakeVape: normalizeVapeCalc(value.calcShakeVape),
        updatedAt: normalizeText(value.updatedAt)
      };
    }

    function getVape() {
      return normalizeVapeState(getState().vape || {});
    }

    function vapeTotalSpent(vape = getVape()) {
      const itemsTotal = vape.items.reduce((sum, item) => sum + item.price * item.qty, 0);
      return Math.max(0, itemsTotal - vape.resaleTotal);
    }

    function vapeDaysVaping(vape = getVape()) {
      const start = new Date(`${vape.startDate}T00:00:00`);
      if (Number.isNaN(start.getTime())) return 0;
      const diff = Math.floor((Date.now() - start.getTime()) / 86400000);
      return Math.max(0, diff);
    }

    function vapeSavingsVsCigarettes(vape = getVape()) {
      const days = vapeDaysVaping(vape);
      const cigaretteCost = days * vape.cigaretteCostPerDay;
      return cigaretteCost - vapeTotalSpent(vape);
    }

    function formatMl(value) {
      const number = Number(value);
      if (!Number.isFinite(number) || number <= 0) return '—';
      return `${number.toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} ml`;
    }

    function formatPerMl(value) {
      if (value === null || value === undefined || !Number.isFinite(value)) return '—';
      return `${value.toLocaleString('cs-CZ', { maximumFractionDigits: 2 })} Kč/ml`;
    }

    // Kalkulačka 1: nikotinový booster + báze na cílový objem a koncentraci.
    function calcBoosterMix({ volumeMl, targetNicMgMl, boosterMgMl, boosterPg, targetPg }) {
      const volume = Math.max(0, decimalValue(volumeMl));
      const targetNic = Math.max(0, decimalValue(targetNicMgMl));
      const boosterStrength = Math.max(0.01, decimalValue(boosterMgMl));
      const targetPgPercent = Math.min(100, Math.max(0, decimalValue(targetPg)));
      if (!(volume > 0)) return null;
      const boosterMl = Math.min(volume, (volume * targetNic) / boosterStrength);
      const baseMl = Math.max(0, volume - boosterMl);
      const basePgMl = baseMl * (targetPgPercent / 100);
      const baseVgMl = baseMl - basePgMl;
      return {
        volumeMl: volume,
        boosterMl,
        boosterBottles: boosterMl / 10,
        baseMl,
        basePgMl,
        baseVgMl,
        boosterPg: Math.min(100, Math.max(0, decimalValue(boosterPg))),
        targetPg: targetPgPercent
      };
    }

    // Kalkulačka 2: hotová báze + aroma podle procenta aroma v celkovém objemu.
    function calcReadyBaseAroma({ volumeMl, aromaPercent }) {
      const volume = Math.max(0, decimalValue(volumeMl));
      const aromaPct = Math.min(100, Math.max(0, decimalValue(aromaPercent)));
      if (!(volume > 0)) return null;
      const aromaMl = volume * (aromaPct / 100);
      const baseMl = volume - aromaMl;
      return { volumeMl: volume, aromaPercent: aromaPct, aromaMl, baseMl };
    }

    // Najde položku v ceníku podle názvu (přesná shoda přednostně, jinak substring).
    function findVapeItemByName(vape, name) {
      const key = normalizeKey(name);
      if (!key) return null;
      const items = vape.items.filter((item) => item.sizeMl > 0);
      return items.find((item) => normalizeKey(item.name) === key)
        || items.find((item) => normalizeKey(item.name).includes(key) || key.includes(normalizeKey(item.name)))
        || null;
    }

    // Průměrná cena/ml napříč položkami dané kategorie v ceníku (báze / booster) -
    // báze a nikotin se u Shake and Vape nekupují pod konkrétním "receptovým" názvem,
    // takže se cena bere jako průměr toho, co je v ceníku vedené.
    function vapeCategoryAveragePricePerMl(vape, category) {
      const perMl = vape.items
        .filter((item) => item.category === category)
        .map(vapeItemPricePerMl)
        .filter((value) => Number.isFinite(value) && value > 0);
      if (!perMl.length) return null;
      return perMl.reduce((sum, value) => sum + value, 0) / perMl.length;
    }

    // Kalkulačka 3: Shake and Vape - lahvička s příchutí doplněná bází a nikotinovým
    // boosterem. Příchuť i booster se počítají jako 100% PG (běžné složení), báze má
    // vlastní poměr PG/VG. Cena příchutě se dohledá v ceníku podle názvu, báze a
    // nikotin se cení průměrnou cenou/ml z jejich kategorie v ceníku.
    function calcShakeAndVape({ bottleSizeMl, flavorName, flavorMl, baseMl, basePg, nicMgMl, nicMl }) {
      const vape = getVape();
      const bottleSize = Math.max(0, decimalValue(bottleSizeMl));
      const flavor = Math.max(0, decimalValue(flavorMl));
      const base = Math.max(0, decimalValue(baseMl));
      const basePgPercent = Math.min(100, Math.max(0, decimalValue(basePg)));
      const nicStrength = Math.max(0, decimalValue(nicMgMl));
      const nic = Math.max(0, decimalValue(nicMl));
      const totalMl = flavor + base + nic;
      if (!(totalMl > 0)) return null;

      const flavorItem = findVapeItemByName(vape, flavorName);
      const flavorPricePerMl = flavorItem ? vapeItemPricePerMl(flavorItem) : null;
      const basePricePerMl = vapeCategoryAveragePricePerMl(vape, 'base');
      const nicPricePerMl = vapeCategoryAveragePricePerMl(vape, 'booster');
      const flavorCost = flavorPricePerMl ? flavor * flavorPricePerMl : 0;
      const baseCost = basePricePerMl ? base * basePricePerMl : 0;
      const nicCost = nicPricePerMl ? nic * nicPricePerMl : 0;
      const totalPrice = flavorCost + baseCost + nicCost;

      const totalPgMl = flavor * 1 + base * (basePgPercent / 100) + nic * 1;
      const pgPercent = (totalPgMl / totalMl) * 100;
      const totalNicMg = nic * nicStrength;

      return {
        bottleSizeMl: bottleSize,
        flavorName: normalizeText(flavorName),
        flavorMl: flavor,
        baseMl: base,
        basePg: basePgPercent,
        nicMgMl: nicStrength,
        nicMl: nic,
        totalMl,
        totalPrice,
        pricePerMl: totalPrice / totalMl,
        pgPercent,
        vgPercent: 100 - pgPercent,
        nicMgPerMl: totalNicMg / totalMl,
        flavorMatched: Boolean(flavorItem),
        baseMatched: Boolean(basePricePerMl),
        nicMatched: Boolean(nicPricePerMl)
      };
    }

    function persistVape(toast = '') {
      touchState();
      saveState({ immediate: true });
      render();
      if (toast) showToast(toast);
      if (cloudReady()) {
        cloudSaveHouseholdUiSettings(false).catch((error) => {
          console.warn('Vape autosync failed', error);
          showToast('Vape uloženo lokálně, cloud se zkusí později');
        });
      }
    }

    function addVapeItemFromForm(data, form) {
      const item = normalizeVapeItem({ id: `vape-item-${uid()}`, ...data });
      if (!item.name || !(item.price >= 0)) return showToast('Doplň název a cenu položky');
      const vape = getVape();
      getState().vape = { ...vape, items: [...vape.items, item] };
      form?.reset?.();
      persistVape('Položka přidána do ceníku');
    }

    function updateVapeItemFromForm(id, data, form) {
      const vape = getVape();
      const index = vape.items.findIndex((item) => item.id === id);
      if (index < 0) return showToast('Položku se nepovedlo najít');
      const next = normalizeVapeItem({ ...vape.items[index], ...data, id });
      if (!next.name || !(next.price >= 0)) return showToast('Doplň název a cenu položky');
      const items = [...vape.items];
      items[index] = next;
      getState().vape = { ...vape, items };
      vapeItemEditId = '';
      form?.reset?.();
      persistVape('Položka upravena');
    }

    function setVapeItemEdit(id) {
      vapeItemEditId = vapeItemEditId === id ? '' : String(id || '');
      render();
    }

    function deleteVapeItem(id) {
      const vape = getVape();
      const item = vape.items.find((row) => row.id === id);
      if (!item) return;
      if (typeof window !== 'undefined' && !window.confirm(`Smazat položku „${item.name}“?`)) return;
      getState().vape = { ...vape, items: vape.items.filter((row) => row.id !== id) };
      if (vapeItemEditId === id) vapeItemEditId = '';
      persistVape('Položka smazána');
    }

    function saveVapeSettingsFromForm(data) {
      const vape = getVape();
      getState().vape = {
        ...vape,
        resaleTotal: Math.max(0, decimalValue(data.resaleTotal)),
        startDate: /^\d{4}-\d{2}-\d{2}$/.test(String(data.startDate || '')) ? data.startDate : vape.startDate,
        cigaretteCostPerDay: decimalValue(data.cigaretteCostPerDay) || vape.cigaretteCostPerDay
      };
      persistVape('Nastavení vape uloženo');
    }

    function calcVapeBoosterFromForm(data) {
      const result = calcBoosterMix(data);
      if (!result) return showToast('Zadej objem liquidu');
      const vape = getVape();
      getState().vape = { ...vape, calcBooster: { ...data, result } };
      persistVape();
    }

    function calcVapeReadyFromForm(data) {
      const result = calcReadyBaseAroma(data);
      if (!result) return showToast('Zadej objem liquidu');
      const vape = getVape();
      getState().vape = { ...vape, calcReady: { ...data, result } };
      persistVape();
    }

    function calcVapeShakeAndVapeFromForm(data) {
      const result = calcShakeAndVape(data);
      if (!result) return showToast('Zadej aspoň jeden objem (příchuť, báze nebo nikotin)');
      const vape = getVape();
      getState().vape = { ...vape, calcShakeVape: { ...data, result } };
      persistVape();
    }

    function renderVapeBoosterCalc(vape) {
      const saved = vape.calcBooster || {};
      const result = saved.result || null;
      return `
        <section class="card desktop-span-2 vape-calc-panel">
          <div class="card-header"><div><h2>Booster + báze</h2><p>Nikotinový booster namíchaný do cílové koncentrace a objemu.</p></div></div>
          <form data-form="vape-calc-booster" class="compact-form">
            <div class="form-grid two">
              ${field('Cílový objem (ml)', 'volumeMl', 'number', 'např. 250', true, saved.volumeMl || '')}
              ${field('Cílová koncentrace nikotinu (mg/ml)', 'targetNicMgMl', 'number', 'např. 6', true, saved.targetNicMgMl || '')}
              ${field('Síla boosteru (mg/ml)', 'boosterMgMl', 'number', 'např. 200', true, saved.boosterMgMl || '20')}
              ${field('PG/VG boosteru (% PG)', 'boosterPg', 'number', 'např. 100', false, saved.boosterPg ?? 100)}
              ${field('Cílový poměr báze (% PG)', 'targetPg', 'number', 'např. 50', false, saved.targetPg ?? 50)}
            </div>
            <div class="form-actions"><button class="primary-btn" type="submit">Spočítat</button></div>
          </form>
          ${result ? `
            <div class="kpi-grid compact-kpi-grid">
              <div class="kpi"><strong>${formatMl(result.boosterMl)}</strong><span>boosteru (${result.boosterBottles.toLocaleString('cs-CZ', { maximumFractionDigits: 2 })} × 10ml lahvička)</span></div>
              <div class="kpi"><strong>${formatMl(result.baseMl)}</strong><span>hotové báze</span></div>
              <div class="kpi"><strong>${formatMl(result.basePgMl)}</strong><span>z toho PG</span></div>
              <div class="kpi"><strong>${formatMl(result.baseVgMl)}</strong><span>z toho VG</span></div>
            </div>
          ` : renderEmpty('Vyplň formulář a spočítej namíchání boosteru.')}
        </section>
      `;
    }

    function renderVapeReadyCalc(vape) {
      const saved = vape.calcReady || {};
      const result = saved.result || null;
      return `
        <section class="card desktop-span-2 vape-calc-panel">
          <div class="card-header"><div><h2>Hotová báze + aroma</h2><p>Kolik hotové (nikotinové) báze a aroma smíchat na daný objem.</p></div></div>
          <form data-form="vape-calc-ready" class="compact-form">
            <div class="form-grid two">
              ${field('Požadovaný objem (ml)', 'volumeMl', 'number', 'např. 60', true, saved.volumeMl || '')}
              ${field('Procento aroma (%)', 'aromaPercent', 'number', 'např. 17', true, saved.aromaPercent || '')}
            </div>
            <div class="form-actions"><button class="primary-btn" type="submit">Spočítat</button></div>
          </form>
          ${result ? `
            <div class="kpi-grid compact-kpi-grid">
              <div class="kpi"><strong>${formatMl(result.baseMl)}</strong><span>hotové báze</span></div>
              <div class="kpi"><strong>${formatMl(result.aromaMl)}</strong><span>aroma</span></div>
            </div>
          ` : renderEmpty('Vyplň formulář a spočítej namíchání.')}
        </section>
      `;
    }

    function renderVapeShakeAndVapeCalc(vape) {
      const saved = vape.calcShakeVape || {};
      const result = saved.result || null;
      return `
        <section class="card desktop-span-2 vape-calc-panel">
          <div class="card-header"><div><h2>Shake and Vape</h2><p>Lahvička s příchutí doplněná bází a nikotinovým boosterem na cílový objem.</p></div></div>
          <form data-form="vape-calc-shakevape" class="compact-form">
            <div class="form-grid two">
              ${field('Velikost lahvičky (ml)', 'bottleSizeMl', 'number', 'např. 60', true, saved.bottleSizeMl ?? 60)}
              ${field('Název příchutě', 'flavorName', 'text', 'podle ceníku', false, saved.flavorName || '')}
              ${field('Příchuť v lahvičce (ml)', 'flavorMl', 'number', 'např. 16', false, saved.flavorMl ?? 16)}
              ${field('Báze (ml)', 'baseMl', 'number', 'např. 43', false, saved.baseMl ?? 43)}
              ${field('Báze - poměr PG (%)', 'basePg', 'number', 'např. 50', false, saved.basePg ?? 50)}
              ${field('Síla nikotinu (mg/ml)', 'nicMgMl', 'number', 'např. 200', false, saved.nicMgMl ?? 200)}
              ${field('Obsah nikotinu (ml)', 'nicMl', 'number', 'např. 1', false, saved.nicMl ?? 1)}
            </div>
            <div class="inline-note compact-note">Příchuť a nikotinový booster se počítají jako 100% PG (běžné složení), báze má svůj vlastní poměr PG/VG.</div>
            <div class="form-actions"><button class="primary-btn" type="submit">Spočítat směs</button></div>
          </form>
          ${result ? `
            <div class="kpi-grid compact-kpi-grid">
              <div class="kpi"><strong>${formatMl(result.totalMl)}</strong><span>celkové množství</span></div>
              <div class="kpi"><strong>${formatCurrency(result.totalPrice)}</strong><span>celková cena</span></div>
              <div class="kpi"><strong>${formatPerMl(result.pricePerMl)}</strong><span>cena za ml</span></div>
              <div class="kpi"><strong>${Math.round(result.pgPercent)}/${Math.round(result.vgPercent)}</strong><span>výsledný poměr PG/VG</span></div>
              <div class="kpi"><strong>${result.nicMgPerMl.toLocaleString('cs-CZ', { maximumFractionDigits: 2 })} mg/ml</strong><span>celkový obsah nikotinu</span></div>
            </div>
            ${result.bottleSizeMl && Math.round(result.totalMl) !== Math.round(result.bottleSizeMl) ? `<div class="inline-note compact-note">Součet příchuť + báze + nikotin (${formatMl(result.totalMl)}) neodpovídá velikosti lahvičky (${formatMl(result.bottleSizeMl)}).</div>` : ''}
            ${!result.flavorMatched && result.flavorName ? `<div class="inline-note compact-note">Příchuť „${escapeHtml(result.flavorName)}“ nebyla v ceníku nalezena, do ceny se nepočítá.</div>` : ''}
            ${!result.baseMatched && result.baseMl ? '<div class="inline-note compact-note">V ceníku není žádná báze, cena báze se nepočítá.</div>' : ''}
            ${!result.nicMatched && result.nicMl ? '<div class="inline-note compact-note">V ceníku není žádný booster, cena nikotinu se nepočítá.</div>' : ''}
          ` : renderEmpty('Vyplň formulář a spočítej Shake and Vape směs.')}
        </section>
      `;
    }

    function renderVapeCalculators(vape) {
      const tabs = [
        { id: 'booster', label: 'Booster', icon: '💧' },
        { id: 'ready', label: 'Hotová báze', icon: '🧪' },
        { id: 'shakevape', label: 'Shake and Vape', icon: '🧉' }
      ];
      const active = getModuleTab('vapeCalc', 'booster');
      const activeTab = tabs.some((tab) => tab.id === active) ? active : 'booster';
      const panel = activeTab === 'ready' ? renderVapeReadyCalc(vape) : activeTab === 'shakevape' ? renderVapeShakeAndVapeCalc(vape) : renderVapeBoosterCalc(vape);
      return `
        ${renderSectionTabs('vapeCalc', tabs, 'booster')}
        ${panel}
      `;
    }

    function renderVapeItemForm(item) {
      const isEdit = Boolean(item);
      return `
        <section class="card desktop-span-2 vape-item-form-panel">
          <div class="card-header"><div><h2>${isEdit ? 'Upravit položku' : 'Přidat položku'}</h2><p>Nákup, cena a velikost balení pro ceník a přehled útraty.</p></div></div>
          <form data-form="${isEdit ? 'update-vape-item' : 'add-vape-item'}" ${isEdit ? `data-id="${escapeHtml(item.id)}"` : ''} class="compact-form">
            <div class="form-grid two">
              ${selectField('Kategorie', 'category', VAPE_CATEGORIES, item?.category || 'other')}
              ${field('Název', 'name', 'text', 'např. Aroma / liquid / zařízení', true, item?.name || '')}
              ${field('Cena (Kč)', 'price', 'number', 'např. 139', true, item?.price ?? '')}
              ${field('Velikost (ml)', 'sizeMl', 'number', 'volitelné', false, item?.sizeMl || '')}
              ${field('Počet kusů', 'qty', 'number', 'např. 1', false, item?.qty || 1)}
              ${field('Hodnocení (0-10)', 'rating', 'number', 'volitelné', false, item?.rating ?? '')}
              ${field('Poznámka', 'note', 'text', 'volitelné', false, item?.note || '')}
            </div>
            <div class="form-actions">
              <button class="primary-btn" type="submit">${isEdit ? 'Uložit položku' : 'Přidat položku'}</button>
              ${isEdit ? '<button class="ghost-btn" type="button" data-action="vape-item-edit-cancel">Zrušit úpravu</button>' : ''}
            </div>
          </form>
        </section>
      `;
    }

    function renderVapeItemRow(item) {
      const perMl = vapeItemPricePerMl(item);
      const metaParts = [
        VAPE_CATEGORY_LABELS[item.category] || 'Ostatní',
        item.sizeMl ? formatMl(item.sizeMl) : '',
        item.qty > 1 ? `${item.qty} ks` : '',
        perMl !== null ? formatPerMl(perMl) : '',
        item.rating !== null ? `hodnocení ${item.rating}/10` : '',
        item.note || ''
      ].filter(Boolean);
      return `
        <div class="item compact-item vape-item-row">
          <div class="item-top">
            <div class="item-title">${escapeHtml(item.name)}</div>
            <span class="badge">${formatCurrency(item.price)}</span>
          </div>
          <div class="item-meta">${escapeHtml(metaParts.join(' · '))}</div>
          <div class="item-actions">
            <button class="ghost-btn" type="button" data-action="vape-item-edit" data-id="${escapeHtml(item.id)}">Upravit</button>
            <button class="danger-btn" type="button" data-action="delete-vape-item" data-id="${escapeHtml(item.id)}">Smazat</button>
          </div>
        </div>
      `;
    }

    function renderVapeItems(vape) {
      const categoryTabs = [{ id: 'all', label: 'Vše' }, ...VAPE_CATEGORIES.map(([id, label]) => ({ id, label }))];
      const activeCategory = getModuleTab('vapeCategory', 'all');
      const filtered = activeCategory === 'all' ? vape.items : vape.items.filter((item) => item.category === activeCategory);
      const editingItem = vapeItemEditId ? vape.items.find((item) => item.id === vapeItemEditId) || null : null;
      const sorted = [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'cs'));
      return `
        ${renderVapeItemForm(editingItem)}
        <section class="card desktop-span-2 vape-items-panel">
          <div class="card-header"><div><h2>Ceník</h2><p>Všechny nákupy vape vybavení a liquidů na jednom místě.</p></div><span class="badge">${filtered.length}</span></div>
          ${renderSectionTabs('vapeCategory', categoryTabs, 'all')}
          ${sorted.length ? `<div class="file-list compact-file-list vape-item-list">${sorted.map(renderVapeItemRow).join('')}</div>` : renderEmpty('V téhle kategorii zatím nic není.')}
        </section>
      `;
    }

    function renderVapeStats(vape) {
      const totalSpent = vapeTotalSpent(vape);
      const days = vapeDaysVaping(vape);
      const savings = vapeSavingsVsCigarettes(vape);
      const tone = savings >= 0 ? 'good' : 'bad';
      return `
        <section class="card desktop-span-2 vape-stats-panel">
          <div class="card-header"><div><h2>Přehled</h2><p>Celková útrata, počet dní vapování a srovnání s cigaretami.</p></div></div>
          <div class="kpi-grid compact-kpi-grid">
            <div class="kpi"><strong>${formatCurrency(totalSpent)}</strong><span>celková útrata</span></div>
            <div class="kpi"><strong>${days.toLocaleString('cs-CZ')}</strong><span>dní vapování</span></div>
            <div class="kpi ${tone}"><strong>${formatCurrency(Math.abs(savings))}</strong><span>${savings >= 0 ? 'ušetřeno oproti cigaretám' : 'oproti cigaretám prodělek'}</span></div>
          </div>
          <div class="inline-note compact-note">Útrata je součet ceny × počet kusů u všech položek v ceníku, minus utrženo za prodej vybavení. Srovnání s cigaretami počítá s ${formatCurrency(vape.cigaretteCostPerDay)}/den od začátku vapování.</div>
          <form data-form="vape-settings" class="compact-form">
            <div class="form-grid two">
              ${field('Začátek vapování', 'startDate', 'date', '', false, vape.startDate)}
              ${field('Cena krabičky cigaret / den (Kč)', 'cigaretteCostPerDay', 'number', 'např. 150,5', false, vape.cigaretteCostPerDay)}
              ${field('Utrženo za prodej vybavení (Kč)', 'resaleTotal', 'number', 'např. 581', false, vape.resaleTotal)}
            </div>
            <div class="form-actions"><button class="primary-btn" type="submit">Uložit nastavení</button></div>
          </form>
        </section>
      `;
    }

    function renderVape() {
      const vape = getVape();
      const tabs = [
        { id: 'calc', label: 'Kalkulačky', icon: '🧮' },
        { id: 'items', label: 'Ceník', icon: '🧾' },
        { id: 'stats', label: 'Přehled', icon: '📈' }
      ];
      const active = getModuleTab('vape', 'calc');
      const activeTab = tabs.some((tab) => tab.id === active) ? active : 'calc';
      const panel = activeTab === 'items' ? renderVapeItems(vape) : activeTab === 'stats' ? renderVapeStats(vape) : renderVapeCalculators(vape);
      return `
        ${renderSectionTabs('vape', tabs, 'calc')}
        ${panel}
      `;
    }

    return {
      normalizeVapeState,
      seedVapeItems,
      renderVape,
      addVapeItemFromForm,
      updateVapeItemFromForm,
      setVapeItemEdit,
      deleteVapeItem,
      saveVapeSettingsFromForm,
      calcVapeBoosterFromForm,
      calcVapeReadyFromForm,
      calcVapeShakeAndVapeFromForm,
      getVapeItemEditId: () => vapeItemEditId
    };
  }

  window.DomacnostVape = { createVape };
})();
