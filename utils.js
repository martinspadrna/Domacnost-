(function () {
  'use strict';

  function createUtils(config) {
    // APP_TIME_ZONE ('Europe/Prague') předaný z app.js přes config.timeZone
    const timeZone = (config && config.timeZone) || 'Europe/Prague';

    // --- Čisté utility (bez interních závislostí) ---

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

    function escapeHtml(value) {
      return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
    }

    function easterSundayDate(year) {
      const y = Number(year);
      if (!Number.isInteger(y) || y < 1900 || y > 2200) return null;
      const a = y % 19;
      const b = Math.floor(y / 100);
      const c = y % 100;
      const d = Math.floor(b / 4);
      const e = b % 4;
      const f = Math.floor((b + 8) / 25);
      const g = Math.floor((b - f + 1) / 3);
      const h = (19 * a + b - d - g + 15) % 30;
      const i = Math.floor(c / 4);
      const k = c % 4;
      const l = (32 + 2 * e + 2 * i - h - k) % 7;
      const m = Math.floor((a + 11 * h + 22 * l) / 451);
      const month = Math.floor((h + l - 7 * m + 114) / 31);
      const day = ((h + l - 7 * m + 114) % 31) + 1;
      return new Date(Date.UTC(y, month - 1, day));
    }

    function addDaysIso(isoDate, days) {
      const [year, month, day] = String(isoDate || '').slice(0, 10).split('-').map(Number);
      if (!year || !month || !day) return '';
      const date = new Date(Date.UTC(year, month - 1, day));
      date.setUTCDate(date.getUTCDate() + Number(days || 0));
      return date.toISOString().slice(0, 10);
    }

    function addMonthsIso(isoDate, months = 1) {
      const [year, month, day] = String(isoDate || '').slice(0, 10).split('-').map(Number);
      if (!year || !month || !day) return '';
      const targetMonthIndex = month - 1 + Number(months || 0);
      const lastDayOfTargetMonth = new Date(Date.UTC(year, targetMonthIndex + 1, 0)).getUTCDate();
      const date = new Date(Date.UTC(year, targetMonthIndex, Math.min(day, lastDayOfTargetMonth)));
      return date.toISOString().slice(0, 10);
    }

    function isLeapYear(year) {
      return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    function addYearsIso(isoDate, years = 2) {
      const [year, month, day] = String(isoDate || '').slice(0, 10).split('-').map(Number);
      if (!year || !month || !day) return '';
      const targetYear = year + Number(years || 0);
      // Date.UTC by 29. únor v necílovém-přestupném roce tiše přeteklo na
      // 1. březen (fakturační období měřidel i konec záruky by tak driftovaly
      // o den dál při každém dalším posunu) - den se proto zarovná na 28.
      // dřív, než se z něj postaví Date.
      const clampedDay = (month === 2 && day === 29 && !isLeapYear(targetYear)) ? 28 : day;
      const date = new Date(Date.UTC(targetYear, month - 1, clampedDay));
      return date.toISOString().slice(0, 10);
    }

    function toSafeDate(value, fallback = null) {
      if (value instanceof Date) return Number.isFinite(value.getTime()) ? value : fallback;
      if (typeof value === 'number') {
        const date = new Date(value);
        return Number.isFinite(date.getTime()) ? date : fallback;
      }
      if (typeof value === 'string' && value.trim()) {
        const date = new Date(value);
        return Number.isFinite(date.getTime()) ? date : fallback;
      }
      return fallback;
    }

    function formatDate(value, options = {}) {
      if (!value) return '—';
      const date = new Date(`${value}T00:00:00`);
      if (Number.isNaN(date.getTime())) return '—';
      return new Intl.DateTimeFormat('cs-CZ', { day: '2-digit', month: '2-digit', year: 'numeric', ...options }).format(date);
    }

    function formatCurrency(value) {
      const number = Number(value || 0);
      return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(number);
    }

    function formatBytes(value) {
      const bytes = Number(value || 0);
      if (!bytes) return '0 B';
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1048576) return `${(bytes / 1024).toFixed(1).replace('.', ',')} kB`;
      return `${(bytes / 1048576).toFixed(1).replace('.', ',')} MB`;
    }

    // --- Závislé na jiných utilitách uvnitř modulu ---

    function localISODate(date = new Date(), tz = timeZone) {
      const safeDate = toSafeDate(date, new Date());
      const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: tz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).formatToParts(safeDate).reduce((acc, part) => {
        if (part.type !== 'literal') acc[part.type] = part.value;
        return acc;
      }, {});
      return `${parts.year}-${parts.month}-${parts.day}`;
    }

    function todayISO() {
      return localISODate(new Date(), timeZone);
    }

    function czechPublicHolidayName(isoDate) {
      const value = String(isoDate || '').slice(0, 10);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return '';
      const fixed = {
        '01-01': 'Nový rok / Den obnovy samostatného českého státu',
        '05-01': 'Svátek práce',
        '05-08': 'Den vítězství',
        '07-05': 'Cyril a Metoděj',
        '07-06': 'Jan Hus',
        '09-28': 'Den české státnosti',
        '10-28': 'Den vzniku samostatného československého státu',
        '11-17': 'Den boje za svobodu a demokracii',
        '12-24': 'Štědrý den',
        '12-25': '1. svátek vánoční',
        '12-26': '2. svátek vánoční'
      };
      const fixedName = fixed[value.slice(5)];
      if (fixedName) return fixedName;
      const year = Number(value.slice(0, 4));
      const easter = easterSundayDate(year);
      if (!easter) return '';
      const easterIso = easter.toISOString().slice(0, 10);
      if (value === addDaysIso(easterIso, -2)) return 'Velký pátek';
      if (value === addDaysIso(easterIso, 1)) return 'Velikonoční pondělí';
      return '';
    }

    function isCzechPublicHolidayDate(date) {
      return Boolean(czechPublicHolidayName(localISODate(date, timeZone)));
    }

    function parseDateValue(value) {
      if (value instanceof Date) return Number.isFinite(value.getTime()) ? value : null;
      if (typeof value === 'number') {
        const date = new Date(value);
        return Number.isFinite(date.getTime()) ? date : null;
      }
      const text = normalizeText(value);
      if (!text) return null;
      const iso = text.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
      if (iso) {
        const date = new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
        return Number.isFinite(date.getTime()) ? date : null;
      }
      const cz = text.match(/^(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{2,4})/);
      if (cz) {
        const year = Number(cz[3].length === 2 ? `20${cz[3]}` : cz[3]);
        const date = new Date(year, Number(cz[2]) - 1, Number(cz[1]));
        return Number.isFinite(date.getTime()) ? date : null;
      }
      const parsed = new Date(text);
      return Number.isFinite(parsed.getTime()) ? parsed : null;
    }

    function formatDateTime(value) {
      const date = toSafeDate(value);
      if (!date) return '—';
      return new Intl.DateTimeFormat('cs-CZ', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    }

    function daysUntil(dateISO) {
      if (!dateISO) return null;
      const start = new Date(todayISO());
      const target = new Date(`${dateISO}T00:00:00`);
      if (Number.isNaN(target.getTime())) return null;
      return Math.ceil((target - start) / 86400000);
    }

    return {
      uid, safeParse, structuredCloneSafe, normalizeText,
      escapeHtml, easterSundayDate, addDaysIso, addMonthsIso, addYearsIso,
      toSafeDate, formatDate, formatCurrency, formatBytes,
      localISODate, todayISO, czechPublicHolidayName, isCzechPublicHolidayDate,
      parseDateValue, formatDateTime, daysUntil
    };
  }

  window.DomacnostUtils = { createUtils };
})();
