(function () {
  'use strict';

  // Smlouvy: UI render + cloud CRUD. Souborové přílohy zatím zůstávají v app.js,
  // protože sdílí Supabase Storage, IndexedDB a globální preview modal.
  function createContracts(deps) {
    const getState = deps.getState || (() => ({}));
    const getActiveContractId = deps.getActiveContractId || (() => null);
    const setActiveContractId = deps.setActiveContractId || (() => {});
    const uid = deps.uid || (() => `${Date.now()}-${Math.random().toString(16).slice(2)}`);
    const normalizeText = deps.normalizeText || ((value) => String(value ?? '').trim());
    const decimalValue = deps.decimalValue || ((value) => value);
    const currentHouseholdId = deps.currentHouseholdId || (() => '');
    const currentProfileId = deps.currentProfileId || (() => '');
    const touchState = deps.touchState || (() => {});
    const saveState = deps.saveState || (() => {});
    const render = deps.render || (() => {});
    const showToast = deps.showToast || (() => {});
    const getSupabaseClient = deps.getSupabaseClient || (() => null);
    const refreshCloudSession = deps.refreshCloudSession || (async () => null);
    const cloudLoadContractFiles = deps.cloudLoadContractFiles || (async () => true);
    const getModuleTab = deps.getModuleTab || ((area, fallback) => fallback);
    const escapeHtml = deps.escapeHtml || ((v) => String(v ?? ''));
    const field = deps.field || (() => '');
    const selectField = deps.selectField || (() => '');
    const renderEmptyCta = deps.renderEmptyCta || (() => '');
    const renderOverviewItem = deps.renderOverviewItem || (() => '');
    const renderSectionTabs = deps.renderSectionTabs || (() => '');
    const daysUntil = deps.daysUntil || (() => null);
    const dueBadge = deps.dueBadge || ((v) => String(v ?? ''));
    const formatDate = deps.formatDate || ((v) => String(v || ''));
    const formatCurrency = deps.formatCurrency || ((v) => String(v || ''));
    const formatBytes = deps.formatBytes || ((v) => String(v || ''));
    const cloudReady = deps.cloudReady || (() => false);

    const CONTRACT_TYPE_OPTIONS = [
      ['car_insurance', 'Pojištění auta'],
      ['home_insurance', 'Pojištění domácnosti'],
      ['property_insurance', 'Pojištění nemovitosti'],
      ['electricity', 'Elektřina'],
      ['gas', 'Plyn'],
      ['water', 'Voda'],
      ['internet', 'Internet'],
      ['mobile', 'Mobil / paušál'],
      ['subscription', 'Předplatné'],
      ['loan', 'Úvěr / půjčka'],
      ['leasing', 'Leasing'],
      ['service', 'Servis / služba'],
      ['other', 'Jiné']
    ];

    function contractTypeOptions() {
      return CONTRACT_TYPE_OPTIONS.map(([value, label]) => [value, label]);
    }

    function contractTypeLabel(value) {
      const found = CONTRACT_TYPE_OPTIONS.find(([key]) => key === value);
      return found ? found[1] : (value || 'typ neuveden');
    }

    function frequencyLabel(value) {
      return ({ monthly: 'měsíčně', quarterly: 'čtvrtletně', yearly: 'ročně', once: 'jednorázově', other: 'jiné' }[value] || 'jiné');
    }

    function frequencyToCloud(value) {
      const map = { monthly: 'monthly', yearly: 'yearly', once: 'one_time', one_time: 'one_time', quarterly: 'quarterly', other: 'other' };
      return map[value] || 'monthly';
    }

    function frequencyFromCloud(value) {
      const map = { monthly: 'monthly', yearly: 'yearly', one_time: 'once', quarterly: 'quarterly', other: 'other' };
      return map[value] || 'monthly';
    }

    function cloudContractPayload(contract, userId) {
      const state = getState();
      return {
        household_id: state.cloud?.householdId,
        profile_id: null,
        title: contract.name,
        type: contract.type || null,
        provider: contract.provider || null,
        contract_number: contract.number || null,
        valid_from: contract.validFrom || null,
        valid_until: contract.validTo || null,
        amount: contract.amount === '' || contract.amount === null || contract.amount === undefined ? null : Number(contract.amount),
        currency: 'CZK',
        payment_frequency: frequencyToCloud(contract.frequency),
        reminder_days: 30,
        note: contract.note || null,
        status: 'active',
        created_by: userId || state.cloud?.userId || null,
        updated_by: userId || state.cloud?.userId || null
      };
    }

    async function cloudAddContract(contract) {
      const state = getState();
      const client = getSupabaseClient();
      if (!client || !state.cloud?.householdId) return null;
      const user = await refreshCloudSession(false);
      if (!user) return null;
      if (contract.cloudId) return { id: contract.cloudId };
      const { data, error } = await client
        .from('contracts')
        .insert(cloudContractPayload(contract, user.id))
        .select('id')
        .single();
      if (error) {
        showToast(error.message || 'Smlouvu se nepovedlo uložit do cloudu');
        return null;
      }
      state.cloud.lastSyncAt = new Date().toISOString();
      return data;
    }

    async function cloudUpdateContract(contract) {
      const state = getState();
      const client = getSupabaseClient();
      if (!client || !state.cloud?.householdId || !contract?.cloudId) return true;
      const user = await refreshCloudSession(false);
      if (!user) return false;
      const payload = cloudContractPayload(contract, user.id);
      delete payload.household_id;
      delete payload.profile_id;
      delete payload.created_by;
      const { error } = await client
        .from('contracts')
        .update(payload)
        .eq('id', contract.cloudId)
        .eq('household_id', state.cloud.householdId);
      if (error) {
        showToast(error.message || 'Smlouvu se nepovedlo upravit v cloudu');
        return false;
      }
      state.cloud.lastSyncAt = new Date().toISOString();
      return true;
    }

    async function cloudLoadContracts(showMessage = true) {
      const state = getState();
      const client = getSupabaseClient();
      if (!client) {
        if (showMessage) showToast('Supabase knihovna není načtená');
        return false;
      }
      const user = await refreshCloudSession(false);
      if (!user || !state.cloud?.householdId) {
        if (showMessage) showToast('Nejdřív vytvoř / napoj domácnost v cloudu');
        return false;
      }
      const { data, error } = await client
        .from('contracts')
        .select('id,title,type,provider,contract_number,valid_from,valid_until,amount,payment_frequency,note,created_at')
        .eq('household_id', state.cloud.householdId)
        .order('valid_until', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false });
      if (error) {
        if (showMessage) showToast(error.message || 'Smlouvy se nepovedlo načíst');
        return false;
      }

      const cloudContracts = (data || []).map((item) => {
        const existing = (state.contracts || []).find((contract) => contract.cloudId === item.id);
        return {
          id: existing?.id || uid(),
          cloudId: item.id,
          householdId: currentHouseholdId(),
          profileId: currentProfileId(),
          createdAt: item.created_at || new Date().toISOString(),
          name: item.title || 'Smlouva',
          type: item.type || '',
          provider: item.provider || '',
          number: item.contract_number || '',
          validFrom: item.valid_from || '',
          validTo: item.valid_until || '',
          amount: item.amount === null || item.amount === undefined ? '' : Number(item.amount),
          frequency: frequencyFromCloud(item.payment_frequency),
          note: item.note || ''
        };
      });
      const localOnly = (state.contracts || []).filter((contract) => !contract.cloudId);
      state.contracts = [...localOnly, ...cloudContracts];
      if (!getActiveContractId() && state.contracts.length) setActiveContractId(state.contracts[0].id);
      state.cloud.lastSyncAt = new Date().toISOString();
      touchState();
      saveState();
      render();
      await cloudLoadContractFiles(false);
      if (showMessage) showToast('Cloud smlouvy načtené');
      return true;
    }

    async function cloudSyncContractById(id) {
      const state = getState();
      const contract = (state.contracts || []).find((item) => item.id === id);
      if (!contract) return false;
      if (contract.cloudId) {
        const ok = await cloudUpdateContract(contract);
        if (!ok) return false;
        showToast('Cloud smlouva aktualizovaná');
      } else {
        const cloudContract = await cloudAddContract(contract);
        if (!cloudContract?.id) return false;
        contract.cloudId = cloudContract.id;
        showToast('Smlouva odeslaná do cloudu');
      }
      touchState();
      saveState();
      render();
      return true;
    }

    async function cloudSyncLocalContracts() {
      const state = getState();
      const localContracts = (state.contracts || []).filter((contract) => !contract.cloudId);
      if (!state.cloud?.householdId) {
        showToast('Nejdřív napoj domácnost na cloud');
        return 0;
      }
      if (!localContracts.length) {
        showToast('Není co odeslat');
        return 0;
      }
      let synced = 0;
      for (const contract of localContracts) {
        const cloudContract = await cloudAddContract(contract);
        if (cloudContract?.id) {
          contract.cloudId = cloudContract.id;
          synced += 1;
        }
      }
      touchState();
      saveState();
      render();
      showToast(synced ? `Odesláno smluv: ${synced}` : 'Nic se nepovedlo odeslat');
      return synced;
    }

    async function cloudDeleteContract(contract) {
      const state = getState();
      const client = getSupabaseClient();
      if (!client || !contract?.cloudId || !state.cloud?.householdId) return true;
      const { error } = await client
        .from('contracts')
        .delete()
        .eq('id', contract.cloudId)
        .eq('household_id', state.cloud.householdId);
      if (error) {
        showToast(error.message || 'Cloud smlouvu se nepovedlo smazat');
        return false;
      }
      state.cloud.lastSyncAt = new Date().toISOString();
      return true;
    }

    async function addContractFromForm(data, form) {
      const state = getState();
      const contract = {
        id: uid(),
        householdId: currentHouseholdId(),
        profileId: currentProfileId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        name: normalizeText(data.name),
        type: normalizeText(data.type),
        provider: normalizeText(data.provider),
        number: normalizeText(data.number),
        validFrom: normalizeText(data.validFrom),
        validTo: normalizeText(data.validTo),
        amount: decimalValue(data.amount),
        frequency: data.frequency,
        note: normalizeText(data.note)
      };
      const cloudContract = await cloudAddContract(contract);
      if (cloudContract?.id) contract.cloudId = cloudContract.id;
      state.contracts = Array.isArray(state.contracts) ? state.contracts : [];
      state.contracts.push(contract);
      setActiveContractId(contract.id);
      touchState();
      saveState();
      if (form?.reset) form.reset();
      render();
      showToast(contract.cloudId ? 'Smlouva uložena do cloudu' : 'Smlouva uložena lokálně');
      return contract;
    }

    async function updateContract(id, data) {
      const state = getState();
      const contract = (state.contracts || []).find((item) => item.id === id);
      if (!contract) return showToast('Smlouva nenalezena');
      contract.name = normalizeText(data.name) || contract.name;
      contract.type = normalizeText(data.type) || 'other';
      contract.provider = normalizeText(data.provider);
      contract.number = normalizeText(data.number);
      contract.validFrom = normalizeText(data.validFrom);
      contract.validTo = normalizeText(data.validTo);
      contract.amount = decimalValue(data.amount);
      contract.frequency = data.frequency || 'monthly';
      contract.note = normalizeText(data.note);
      contract.updatedAt = new Date().toISOString();
      const ok = await cloudUpdateContract(contract);
      if (!ok) return false;
      touchState();
      saveState();
      render();
      showToast(contract.cloudId ? 'Smlouva upravena v cloudu' : 'Smlouva upravena lokálně');
      return true;
    }

    function contractFileCount(contractId) {
      return (getState().contractFiles || []).filter((file) => file.contractId === contractId).length;
    }

    function sortedContracts() {
      return [...(getState().contracts || [])].sort((a, b) => String(a.validTo || '9999').localeCompare(String(b.validTo || '9999')));
    }

    function renderContractOverviewItem(contract) {
      const days = daysUntil(contract.validTo);
      return renderOverviewItem({
        title: contract.name,
        badge: dueBadge(days),
        badgeClass: days !== null && days <= 14 ? 'warn' : 'good',
        meta: [contract.provider || 'Bez poskytovatele', contract.type ? contractTypeLabel(contract.type) : '', contract.validTo ? `do ${formatDate(contract.validTo)}` : '', contract.price ? formatCurrency(contract.price) : '', contract.cloudId ? 'cloud' : 'lokálně'].filter(Boolean).join(' · '),
        icon: '📄'
      });
    }

    function renderContractItem(contract) {
      const state = getState();
      const activeContractId = getActiveContractId();
      const left = daysUntil(contract.validTo);
      const badgeClass = left === null ? '' : left < 0 ? 'bad' : left <= 45 ? 'warn' : 'good';
      const badgeText = left === null ? 'bez konce' : left < 0 ? 'propadlé' : `${left} dní`;
      const files = contractFileCount(contract.id);
      return `
        <div class="item ${contract.id === activeContractId ? 'selected' : ''}">
          <div class="item-top"><div class="item-title">${escapeHtml(contract.name)}</div><span class="badge ${badgeClass}">${escapeHtml(badgeText)}</span></div>
          <div class="item-meta">
            ${escapeHtml(contract.provider || 'Bez poskytovatele')} · ${escapeHtml(contractTypeLabel(contract.type))}${contract.number ? ` · č. ${escapeHtml(contract.number)}` : ''}<br>
            ${contract.validFrom ? `od ${formatDate(contract.validFrom)} · ` : ''}${contract.validTo ? `do ${formatDate(contract.validTo)} · ` : ''}${formatCurrency(contract.amount)} / ${frequencyLabel(contract.frequency)}${contract.cloudId ? ' · cloud' : ''}${contract.note ? ` · ${escapeHtml(contract.note)}` : ''}
          </div>
          <div class="item-actions">
            <button class="ghost-btn" type="button" data-action="select-contract" data-id="${escapeHtml(contract.id)}">Detail</button>
            ${state.cloud?.householdId && !contract.cloudId ? `<button class="ghost-btn" type="button" data-action="cloud-sync-contract" data-id="${escapeHtml(contract.id)}">Odeslat</button>` : ''}
            <span class="badge">${files} příloh</span>
            <button class="danger-btn" type="button" data-action="delete" data-collection="contracts" data-id="${escapeHtml(contract.id)}">Smazat</button>
          </div>
        </div>
      `;
    }

    function renderContractDetail(contract) {
      const state = getState();
      const files = (state.contractFiles || []).filter((file) => file.contractId === contract.id).sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
      const left = daysUntil(contract.validTo);
      const statusText = left === null ? 'Bez nastaveného konce' : left < 0 ? `Propadlé před ${Math.abs(left)} dny` : left === 0 ? 'Končí dnes' : `Končí za ${left} dní`;
      const cloudFiles = files.filter((file) => file.cloudId).length;
      const localFiles = files.length - cloudFiles;
      return `
        <div class="card-header compact-detail-head">
          <div><h2>${escapeHtml(contract.name)}</h2><p>${escapeHtml(contract.provider || 'Bez poskytovatele')} · ${escapeHtml(contractTypeLabel(contract.type))}</p></div>
          <span class="badge ${left !== null && left <= 45 ? (left < 0 ? 'bad' : 'warn') : 'good'}">${escapeHtml(statusText)}</span>
        </div>
        <div class="grid two detail-summary-grid">
          <div class="detail-stack compact-detail-stack">
            <div class="stat-line"><span>Číslo smlouvy</span><strong>${escapeHtml(contract.number || '—')}</strong></div>
            <div class="stat-line"><span>Platnost</span><strong>${contract.validFrom ? formatDate(contract.validFrom) : '—'} → ${contract.validTo ? formatDate(contract.validTo) : '—'}</strong></div>
            <div class="stat-line"><span>Platba</span><strong>${formatCurrency(contract.amount)} / ${frequencyLabel(contract.frequency)}</strong></div>
            <div class="stat-line"><span>Přílohy</span><strong>${files.length} celkem · ${cloudFiles} cloud · ${localFiles} lokálně</strong></div>
            ${contract.note ? `<div class="inline-note compact-note">${escapeHtml(contract.note)}</div>` : ''}
          </div>
          <div class="inline-note compact-note">
            <strong>Ukládání příloh</strong><br>Online domácnost ukládá přílohy rovnou do soukromého Supabase Storage a ostatní členové je otevřou přes dočasný odkaz. IndexedDB zůstává jen jako offline fallback.
          </div>
        </div>
        <div class="card-header small compact-files-head"><div><h3>Přílohy</h3><p>${cloudFiles} cloud · ${localFiles} lokálně</p></div><div class="form-actions compact-actions">${contract.cloudId && state.cloud?.householdId ? '<button class="ghost-btn" type="button" data-action="cloud-load-contract-files">Načíst cloud přílohy</button>' : ''}${cloudReady() && localFiles ? '<button class="primary-btn" type="button" data-action="cloud-sync-local-contract-files">Odeslat lokální přílohy</button>' : ''}</div></div>
        ${files.length ? `<div class="file-list compact-file-list">${files.map((file) => `
          <div class="file-row compact-file-row">
            <div>
              <strong>${escapeHtml(file.fileName)}</strong>
              <em>${escapeHtml(file.fileType || 'soubor')} · ${formatBytes(file.size)} · ${formatDate(file.createdAt?.slice(0, 10))}${file.cloudId ? ' · cloud' : ' · lokálně'}</em>
            </div>
            <div class="item-actions compact-actions">
              <button class="ghost-btn" type="button" data-action="open-contract-file" data-id="${escapeHtml(file.id)}">Otevřít</button>
              <button class="ghost-btn" type="button" data-action="download-contract-file" data-id="${escapeHtml(file.id)}">Stáhnout</button>
              <button class="danger-btn" type="button" data-action="delete-contract-file" data-id="${escapeHtml(file.id)}">Smazat</button>
            </div>
          </div>
        `).join('')}</div>` : renderEmptyCta({ icon: '📎', title: 'Zatím žádné přílohy', text: 'Přidej PDF nebo fotku smlouvy. U online domácnosti se příloha nahraje do soukromého Supabase Storage.', nav: 'contracts', tab: 'detail', label: 'Přidat přílohu' })}
        <details class="action-details compact-edit-details">
          <summary><span>Upravit údaje smlouvy</span><em>název, platnost, částka, poznámka</em></summary>
          <form data-form="update-contract" data-contract-id="${escapeHtml(contract.id)}" class="compact-form">
            <div class="form-grid two">
              ${field('Název', 'name', 'text', 'Název smlouvy', true, contract.name || '')}
              ${selectField('Typ', 'type', contractTypeOptions(), contract.type || 'other')}
              ${field('Poskytovatel', 'provider', 'text', 'Poskytovatel', false, contract.provider || '')}
              ${field('Číslo smlouvy', 'number', 'text', 'Číslo smlouvy', false, contract.number || '')}
              ${field('Platnost od', 'validFrom', 'date', '', false, contract.validFrom || '')}
              ${field('Platnost do', 'validTo', 'date', '', false, contract.validTo || '')}
              ${field('Částka', 'amount', 'number', 'např. 1250', false, contract.amount || '')}
              ${selectField('Frekvence platby', 'frequency', [['monthly', 'Měsíčně'], ['quarterly', 'Čtvrtletně'], ['yearly', 'Ročně'], ['once', 'Jednorázově'], ['other', 'Jiné']], contract.frequency || 'monthly')}
              ${field('Poznámka', 'note', 'text', 'volitelně', false, contract.note || '')}
            </div>
            <div class="form-actions"><button class="primary-btn" type="submit">Uložit změny</button>${contract.cloudId ? '<span class="badge good">cloud update</span>' : '<span class="badge">lokální smlouva</span>'}</div>
          </form>
        </details>
        <details class="action-details compact-edit-details">
          <summary><span>Přidat přílohu</span><em>PDF, fotka nebo scan dokumentu</em></summary>
          <form data-form="add-contract-file" data-contract-id="${escapeHtml(contract.id)}" class="compact-form">
            <div class="upload-box">
              <label for="contractFiles">PDF / fotka smlouvy</label>
              <input id="contractFiles" class="input" type="file" name="files" multiple accept="application/pdf,image/*,.pdf">
              <p>Na iPhonu/Androidu můžeš vybrat soubor, fotku z galerie nebo rovnou vyfotit dokument podle nabídky systému.</p>
            </div>
            <div class="form-actions"><button class="primary-btn" type="submit">Přidat přílohu</button>${cloudReady() ? '<span class="badge good">cloud upload</span>' : '<span class="badge">offline fallback</span>'}</div>
          </form>
        </details>
      `;
    }

    function renderContracts() {
      const state = getState();
      const contracts = sortedContracts();
      if (!getActiveContractId() && contracts.length) setActiveContractId(contracts[0].id);
      const activeContract = contracts.find((contract) => contract.id === getActiveContractId()) || null;
      const cloudCount = contracts.filter((contract) => contract.cloudId).length;
      const localCount = contracts.length - cloudCount;
      const warningCount = contracts.filter((contract) => {
        const left = daysUntil(contract.validTo);
        return left !== null && left <= 45;
      }).length;
      const activeContractsTab = getModuleTab('contracts', 'overview');
      return `
        ${renderSectionTabs('contracts', [
          { id: 'overview', label: 'Přehled', icon: '📄', count: contracts.length },
          { id: 'detail', label: 'Detail', icon: '📎', count: activeContract ? contractFileCount(activeContract.id) : 0 },
          { id: 'add', label: 'Přidat', icon: '➕' }
        ], 'overview')}
        <div class="grid two module-tabbed contracts-tab-${activeContractsTab}" data-tab-area="contracts">
          <section class="card desktop-span-2 contracts-panel panel-overview">
            <div class="card-header"><div><h2>Smlouvy a pojistky</h2><p>Nejdřív přehled a blížící se termíny. Detail a přílohy jsou oddělené v záložce, aby se modul na mobilu netáhl.</p></div></div>
            <div class="cloud-status-grid compact-cloud-stats">
              <div class="mini-stat"><span>Smlouvy</span><strong>${contracts.length}</strong></div>
              <div class="mini-stat"><span>Upozornění</span><strong>${warningCount}</strong></div>
              <div class="mini-stat"><span>Cloud</span><strong>${cloudCount}</strong></div>
              <div class="mini-stat"><span>Lokálně</span><strong>${localCount}</strong></div>
            </div>
            ${contracts.length ? `<div class="list compact-list">${contracts.map(renderContractItem).join('')}</div>` : renderEmptyCta({ icon: '📄', title: 'Smlouvy jsou prázdné', text: 'Přidej pojistku, tarif nebo smlouvu a aplikace začne hlídat platnost.', nav: 'contracts', tab: 'add', label: 'Přidat smlouvu' })}
          </section>

          <section class="card desktop-span-2 contracts-panel panel-detail">
            ${activeContract ? renderContractDetail(activeContract) : renderEmptyCta({ icon: '📎', title: 'Detail smlouvy zatím není', text: 'Vyber existující smlouvu, nebo přidej první a potom k ní nahraj přílohy.', nav: 'contracts', tab: 'add', label: 'Přidat smlouvu' })}
          </section>

          <section class="card contracts-panel panel-add">
            <div class="card-header"><div><h2>Přidat smlouvu / pojistku</h2><p>Základní evidence se ukládá podle domácnosti. Typy jsou sjednocené, aby šly později filtrovat a napojit na Garáž.</p></div><span class="badge ${state.cloud?.householdId ? 'good' : ''}">${state.cloud?.householdId ? 'cloud smlouvy' : 'lokálně'}</span></div>
            <form data-form="add-contract">
              <div class="form-grid two">
                ${field('Název', 'name', 'text', 'Povinné ručení / internet / elektřina', true)}
                ${selectField('Typ', 'type', contractTypeOptions(), 'other')}
                ${field('Poskytovatel', 'provider', 'text', 'pojišťovna / dodavatel')}
                ${field('Číslo smlouvy', 'number', 'text', 'volitelně')}
                ${field('Platnost od', 'validFrom', 'date', '')}
                ${field('Platnost do', 'validTo', 'date', '')}
                ${field('Částka', 'amount', 'number', 'např. 1250')}
                ${selectField('Frekvence platby', 'frequency', [['monthly', 'Měsíčně'], ['yearly', 'Ročně'], ['once', 'Jednorázově'], ['other', 'Jiné']])}
                ${field('Poznámka', 'note', 'text', 'volitelně')}
              </div>
              <div class="form-actions"><button class="primary-btn" type="submit">Uložit</button>${state.cloud?.householdId ? '<button class="ghost-btn" type="button" data-action="cloud-load-contracts">Načíst cloud smlouvy</button>' : ''}${state.cloud?.householdId && (state.contracts || []).some((contract) => !contract.cloudId) ? `<button class="ghost-btn" type="button" data-action="cloud-sync-local-contracts">Odeslat lokální (${(state.contracts || []).filter((contract) => !contract.cloudId).length})</button>` : ''}</div>
            </form>
            <div class="inline-note">Základ smlouvy může být v cloudu podle domácnosti. PDF a fotky dokumentů se ukládají do Supabase Storage, lokálně jen jako offline fallback.</div>
          </section>
        </div>
      `;
    }

    return {
      addContractFromForm,
      cloudAddContract,
      cloudUpdateContract,
      cloudLoadContracts,
      cloudSyncContractById,
      cloudSyncLocalContracts,
      cloudDeleteContract,
      contractFileCount,
      renderContractOverviewItem,
      renderContracts,
      updateContract
    };
  }

  window.DomacnostContracts = { createContracts };
})();
