(function () {
  'use strict';

  // Smlouvy: UI render + overview. Cloud sync a souborové přílohy zatím zůstávají v app.js,
  // protože sdílí Supabase Storage, IndexedDB a globální preview modal.
  function createContracts(deps) {
    const getState = deps.getState || (() => ({}));
    const getActiveContractId = deps.getActiveContractId || (() => null);
    const setActiveContractId = deps.setActiveContractId || (() => {});
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
      contractFileCount,
      renderContractOverviewItem,
      renderContracts
    };
  }

  window.DomacnostContracts = { createContracts };
})();
