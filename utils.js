(function () {
  'use strict';

  function createUtils(deps) {
    function uid() {
      return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
    }

    function safeParse(json, fallback) {
      try {
        return JSON.parse(json) ?? fallback;
      } catch {
        return fallback;
      }
    }

    function structuredCloneSafe(value) {
      if (typeof structuredClone === 'function') return structuredClone(value);
      return JSON.parse(JSON.stringify(value));
    }

    function normalizeText(value) {
      return String(value || '').trim();
    }

    return { uid, safeParse, structuredCloneSafe, normalizeText };
  }

  window.DomacnostUtils = { createUtils };
})();
