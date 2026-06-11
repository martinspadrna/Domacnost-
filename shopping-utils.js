(function () {
  'use strict';

  function createToolkit(deps) {
    const defaultUnits = deps.defaultUnits || [];
    const defaultCategories = deps.defaultCategories || [];
    const defaultCatalog = deps.defaultCatalog || [];
    const normalizeText = deps.normalizeText || ((value) => String(value || '').trim());
    const normalizeKey = deps.normalizeKey || ((value) => normalizeText(value).toLowerCase());
    const escapeHtml = deps.escapeHtml || ((value) => String(value || ''));
    const getState = deps.getState || (() => ({}));

    let cacheVersion = 0;
    let catalogCacheVersion = -1;
    let catalogCache = null;
    let categoriesCacheVersion = -1;
    let categoriesCache = null;
    let unitsCacheVersion = -1;
    let unitsCache = null;
    let categoryIconCacheVersion = -1;
    let categoryIconCache = null;

    function markCatalogDirty() {
      cacheVersion += 1;
      catalogCacheVersion = -1;
      catalogCache = null;
      categoriesCacheVersion = -1;
      categoriesCache = null;
      unitsCacheVersion = -1;
      unitsCache = null;
      categoryIconCacheVersion = -1;
      categoryIconCache = null;
    }

    function getShoppingUnits() {
      if (unitsCache && unitsCacheVersion === cacheVersion) return unitsCache;
      const state = getState();
      const cloudUnits = state.shoppingCloud?.units || [];
      unitsCache = cloudUnits.length ? cloudUnits.map((unit) => [unit.code, unit.label || unit.code]) : defaultUnits;
      unitsCacheVersion = cacheVersion;
      return unitsCache;
    }

    function getShoppingCategories() {
      if (categoriesCache && categoriesCacheVersion === cacheVersion) return categoriesCache;
      const state = getState();
      const cloudCategories = state.shoppingCloud?.categories || [];
      categoriesCache = cloudCategories.length
        ? cloudCategories.map((category) => [category.name, category.icon || '🛒'])
        : defaultCategories;
      categoriesCacheVersion = cacheVersion;
      return categoriesCache;
    }

    function getShoppingCategoryIconMap() {
      if (categoryIconCache && categoryIconCacheVersion === cacheVersion) return categoryIconCache;
      const map = new Map();
      getShoppingCategories().forEach(([name, icon]) => map.set(normalizeKey(name), icon || '🛒'));
      categoryIconCache = map;
      categoryIconCacheVersion = cacheVersion;
      return map;
    }

    function shoppingKindIcon(kind) {
      const label = normalizeText(kind) || 'Ostatní';
      return getShoppingCategoryIconMap().get(normalizeKey(label)) || '🛒';
    }

    function findDefaultCatalogItem(name) {
      const key = normalizeKey(name);
      return defaultCatalog.find((entry) => normalizeKey(entry.name) === key) || null;
    }

    function shoppingKindLabel(item) {
      const catalogItem = item?.name ? findDefaultCatalogItem(item.name) : null;
      return normalizeText(item?.kind || item?.category || catalogItem?.kind || catalogItem?.category) || 'Ostatní';
    }

    function getShoppingCatalog() {
      if (catalogCache && catalogCacheVersion === cacheVersion) return catalogCache;
      const state = getState();
      const categories = getShoppingCategories();
      const categoryOrder = new Map(categories.map(([name], index) => [normalizeKey(name), index]));
      const cloudCatalog = state.shoppingCloud?.catalog || [];
      const mappedCloud = cloudCatalog.map((item) => {
        const kind = item.kind || item.category_name || item.category || 'Ostatní';
        return {
          id: item.id,
          name: item.name,
          defaultUnit: item.default_unit || item.defaultUnit || 'ks',
          category: kind,
          kind,
          householdId: item.household_id || '',
          source: item.household_id ? 'household' : 'global'
        };
      });
      const localCustom = (state.shoppingCatalogCustom || []).map((item) => ({ ...item, source: 'local' }));
      const base = mappedCloud.length ? mappedCloud : defaultCatalog;
      const byName = new Map();
      [...base, ...localCustom].forEach((item) => {
        if (!item?.name) return;
        byName.set(normalizeKey(item.name), item);
      });
      catalogCache = [...byName.values()].sort((a, b) => {
        const ai = categoryOrder.get(normalizeKey(a.kind || a.category)) ?? 999;
        const bi = categoryOrder.get(normalizeKey(b.kind || b.category)) ?? 999;
        return ai - bi || String(a.name).localeCompare(String(b.name), 'cs');
      });
      catalogCacheVersion = cacheVersion;
      return catalogCache;
    }

    function findShoppingCatalogItem(name) {
      const key = normalizeKey(name);
      return getShoppingCatalog().find((item) => normalizeKey(item.name) === key) || null;
    }

    function getShoppingStat(name) {
      const state = getState();
      const key = normalizeKey(name);
      return state.shoppingStats?.[key] || null;
    }

    function getShoppingQuickItems(limit = 10, catalog = getShoppingCatalog()) {
      const nowMs = Date.now();
      const scored = catalog.map((item) => {
        const stat = getShoppingStat(item.name);
        const count = Number(stat?.count || item.usage_count || 0);
        const lastUsedMs = stat?.lastUsedAt ? new Date(stat.lastUsedAt).getTime() : 0;
        const recentBoost = lastUsedMs ? Math.max(0, 14 - Math.floor((nowMs - lastUsedMs) / 86400000)) : 0;
        const ownBoost = item.householdId || item.source === 'local' ? 4 : 0;
        return { ...item, score: count * 12 + recentBoost + ownBoost, count };
      });
      const active = scored.filter((item) => item.score > 0).sort((a, b) => b.score - a.score || String(a.name).localeCompare(String(b.name), 'cs'));
      const fallback = scored.filter((item) => item.score <= 0).sort((a, b) => String(a.name).localeCompare(String(b.name), 'cs'));
      return [...active, ...fallback].slice(0, limit);
    }

    function getShoppingDatalistItems(catalog = getShoppingCatalog(), limit = 90) {
      const byName = new Map();
      getShoppingQuickItems(limit, catalog).forEach((item) => byName.set(normalizeKey(item.name), item));
      catalog
        .filter((item) => item.householdId || item.source === 'local')
        .slice(0, 40)
        .forEach((item) => byName.set(normalizeKey(item.name), item));
      return [...byName.values()].slice(0, limit);
    }

    function shoppingSourceLabel(item) {
      if (item.householdId || item.source === 'local') return 'vlastní domácnost';
      if (item.source === 'household') return 'vlastní domácnost';
      return 'základní katalog';
    }

    function renderShoppingCatalogItem(item, activeList) {
      const stat = getShoppingStat(item.name);
      const usedText = stat?.count ? ` · použito ${stat.count}×` : '';
      return `<div class="item compact-item"><div class="item-top"><div class="item-title"><span class="shopping-kind-badge" aria-hidden="true">${escapeHtml(shoppingKindIcon(item.kind || item.category))}</span>${escapeHtml(item.name)}</div><span class="badge">${escapeHtml(item.defaultUnit || 'ks')}</span></div><div class="item-meta">${escapeHtml(item.kind || item.category || 'Ostatní')} · ${shoppingSourceLabel(item)}${usedText}</div><div class="item-actions"><button class="ghost-btn" type="button" data-action="quick-add-shopping" data-name="${escapeHtml(item.name)}">Přidat do ${escapeHtml(activeList?.name || 'seznamu')}</button></div></div>`;
    }

    function buildShoppingListStats(lists = []) {
      const state = getState();
      const stats = new Map(lists.map((list) => [list.id, { total: 0, open: 0, done: 0 }]));
      (state.shopping || []).forEach((item) => {
        if (!stats.has(item.listId)) return;
        const stat = stats.get(item.listId);
        stat.total += 1;
        if (item.done) stat.done += 1;
        else stat.open += 1;
      });
      return stats;
    }

    function shoppingKindSortIndex(kind) {
      const key = normalizeKey(kind);
      const index = getShoppingCategories().findIndex(([name]) => normalizeKey(name) === key);
      return index >= 0 ? index : 999;
    }

    function groupShoppingItemsByKind(items = []) {
      const groups = new Map();
      items.forEach((item) => {
        const kind = shoppingKindLabel(item);
        if (!groups.has(kind)) groups.set(kind, []);
        groups.get(kind).push(item);
      });
      return [...groups.entries()]
        .sort(([a], [b]) => shoppingKindSortIndex(a) - shoppingKindSortIndex(b) || String(a).localeCompare(String(b), 'cs'))
        .map(([kind, rows]) => ({
          kind,
          icon: shoppingKindIcon(kind),
          items: rows.sort((a, b) => String(a.name).localeCompare(String(b.name), 'cs'))
        }));
    }

    return {
      markCatalogDirty,
      getShoppingUnits,
      getShoppingCategories,
      getShoppingCategoryIconMap,
      shoppingKindIcon,
      shoppingKindLabel,
      getShoppingCatalog,
      findShoppingCatalogItem,
      getShoppingStat,
      getShoppingQuickItems,
      getShoppingDatalistItems,
      shoppingSourceLabel,
      renderShoppingCatalogItem,
      buildShoppingListStats,
      groupShoppingItemsByKind
    };
  }

  window.DomacnostShoppingUtils = { createToolkit };
})();
