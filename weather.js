(function () {
  'use strict';

  function createWeather(deps) {
    const getWeatherState = deps.getWeatherState || (() => null);
    const setWeatherState = deps.setWeatherState || (() => {});
    const getHouseholdId = deps.getHouseholdId || (() => '');
    const getModuleTab = deps.getModuleTab || ((area, fallback) => fallback);
    const renderSectionTabs = deps.renderSectionTabs || (() => '');
    const saveState = deps.saveState || (() => {});
    const render = deps.render || (() => {});
    const touchState = deps.touchState || (() => {});
    const cloudSaveHouseholdUiSettings = deps.cloudSaveHouseholdUiSettings || (() => Promise.resolve(false));
    const getSupabaseClient = deps.getSupabaseClient || (() => null);
    const getSupabaseClientIfReady = deps.getSupabaseClientIfReady || (() => null);
    const showToast = deps.showToast || (() => {});
    const normalizeText = deps.normalizeText || ((value) => String(value || '').trim());
    const escapeHtml = deps.escapeHtml || ((value) => String(value ?? ''));
    const formatDateTime = deps.formatDateTime || ((value) => String(value || ''));
    const toSafeDate = deps.toSafeDate || (() => null);
    const field = deps.field || (() => '');
    const selectField = deps.selectField || (() => '');
    const shortWeekday = deps.shortWeekday || (() => '—');

    const WEATHER_DEFAULT_LOCATION = deps.WEATHER_DEFAULT_LOCATION || { name: 'Hostinné', country: 'CZ', latitude: 50.5407, longitude: 15.7233 };
    const WEATHER_CACHE_MS = deps.WEATHER_CACHE_MS || 30 * 60 * 1000;
    const WEATHER_PROVIDER_OPTIONS = deps.WEATHER_PROVIDER_OPTIONS || [['chmi', 'ČHMÚ – preferovaný zdroj'], ['open-meteo', 'Open-Meteo fallback']];
    const WEATHER_CHMI_FUNCTION = deps.WEATHER_CHMI_FUNCTION || 'weather-chmi-forecast';

    let weatherFetchPromise = null;
    let locationSearchTimer = null;

    function normalizeWeatherLocation(location) {
      const source = location && typeof location === 'object' ? location : WEATHER_DEFAULT_LOCATION;
      const latitude = Number(source.latitude ?? source.lat ?? WEATHER_DEFAULT_LOCATION.latitude);
      const longitude = Number(source.longitude ?? source.lon ?? WEATHER_DEFAULT_LOCATION.longitude);
      return {
        name: normalizeText(source.name || source.city || WEATHER_DEFAULT_LOCATION.name),
        country: normalizeText(source.country || WEATHER_DEFAULT_LOCATION.country),
        latitude: Number.isFinite(latitude) ? latitude : WEATHER_DEFAULT_LOCATION.latitude,
        longitude: Number.isFinite(longitude) ? longitude : WEATHER_DEFAULT_LOCATION.longitude
      };
    }

    function normalizeWeatherSource(value) {
      const clean = String(value || '').trim().toLowerCase();
      if (clean === 'chmi' || clean === 'open-meteo' || clean === 'open-meteo-fallback' || clean === 'demo') return clean;
      return 'chmi';
    }

    function normalizeWeatherState(value) {
      const base = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
      return {
        location: normalizeWeatherLocation(base.location),
        current: base.current && typeof base.current === 'object' ? base.current : null,
        daily: Array.isArray(base.daily) ? base.daily : [],
        hourly: Array.isArray(base.hourly) ? base.hourly : [],
        updatedAt: base.updatedAt || '',
        error: base.error || '',
        loading: false,
        source: normalizeWeatherSource(base.source),
        meta: base.meta && typeof base.meta === 'object' ? base.meta : {}
      };
    }

    function weatherSourceLabel(source) {
      const normalized = normalizeWeatherSource(source === undefined ? getWeatherState()?.source : source);
      if (normalized === 'chmi') return 'ČHMÚ';
      if (normalized === 'open-meteo-fallback') return 'Open-Meteo fallback';
      if (normalized === 'demo') return 'Demo';
      return 'Open-Meteo';
    }

    function weatherAnimeKind(code) {
      const value = Number(code);
      if (value === 0) return 'sun';
      if (value === 1 || value === 2) return 'partly';
      if (value === 3) return 'cloud';
      if (value === 45 || value === 48) return 'fog';
      if ([71, 73, 75].includes(value)) return 'snow';
      if ([95, 96, 99, 82].includes(value)) return 'storm';
      if ([51, 53, 55, 61, 63, 65, 80, 81].includes(value)) return 'rain';
      return 'partly';
    }

    function renderWeatherAnimeIcon(code, options = {}) {
      const size = options.size || 'md';
      const extraClass = options.extraClass ? ` ${options.extraClass}` : '';
      const kind = options.kind || weatherAnimeKind(code);
      return `<span class="weather-anime-icon weather-anime-icon-${escapeHtml(String(size))}${extraClass}" aria-hidden="true">${getWeatherAnimeSvg(kind)}</span>`;
    }

    function getWeatherAnimeSvg(kind) {
      const icons = {
        sun: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="14" fill="#FBBF24"/><g stroke="#F59E0B" stroke-width="4" stroke-linecap="round"><path d="M32 8v8M32 48v8M8 32h8M48 32h8M15 15l6 6M43 43l6 6M49 15l-6 6M21 43l-6 6"/></g></svg>`,
        partly: `<svg viewBox="0 0 64 64"><circle cx="23" cy="22" r="11" fill="#FBBF24"/><g stroke="#F59E0B" stroke-width="3.5" stroke-linecap="round"><path d="M23 6v5M23 33v5M7 22h5M34 22h5M12 11l4 4M34 33l4 4"/></g><path d="M23 45h24a9 9 0 0 0 .7-18A12 12 0 0 0 25.4 23 10.5 10.5 0 0 0 23 45Z" fill="#93C5FD"/><path d="M24 45h22" stroke="#60A5FA" stroke-width="3.5" stroke-linecap="round"/></svg>`,
        cloud: `<svg viewBox="0 0 64 64"><path d="M19 46h28a10 10 0 0 0 .8-20A14 14 0 0 0 21.8 24 12 12 0 0 0 19 46Z" fill="#93C5FD"/><path d="M20 46h26" stroke="#60A5FA" stroke-width="4" stroke-linecap="round"/></svg>`,
        fog: `<svg viewBox="0 0 64 64"><path d="M19 35h28a10 10 0 0 0 .8-20A14 14 0 0 0 21.8 13 12 12 0 0 0 19 35Z" fill="#CBD5E1"/><g stroke="#94A3B8" stroke-width="4" stroke-linecap="round"><path d="M14 43h36M18 50h28"/></g></svg>`,
        rain: `<svg viewBox="0 0 64 64"><path d="M19 33h28a10 10 0 0 0 .8-20A14 14 0 0 0 21.8 11 12 12 0 0 0 19 33Z" fill="#93C5FD"/><g stroke="#2563EB" stroke-width="4" stroke-linecap="round"><path d="m24 40-3 7M34 40l-3 7M44 40l-3 7"/></g></svg>`,
        snow: `<svg viewBox="0 0 64 64"><path d="M19 33h28a10 10 0 0 0 .8-20A14 14 0 0 0 21.8 11 12 12 0 0 0 19 33Z" fill="#BFDBFE"/><g stroke="#60A5FA" stroke-width="3" stroke-linecap="round"><path d="M24 42h8M28 38v8M25 39l6 6M31 39l-6 6M39 42h8M43 38v8M40 39l6 6M46 39l-6 6"/></g></svg>`,
        storm: `<svg viewBox="0 0 64 64"><path d="M19 31h28a10 10 0 0 0 .8-20A14 14 0 0 0 21.8 9 12 12 0 0 0 19 31Z" fill="#94A3B8"/><path d="m34 34-8 12h7l-3 11 12-16h-7l3-7Z" fill="#FBBF24"/><g stroke="#2563EB" stroke-width="3.5" stroke-linecap="round"><path d="m22 38-2 5M46 38l-2 5"/></g></svg>`
      };
      return icons[String(kind || 'partly')] || icons.partly;
    }

    function weatherCodeLabel(code) {
      const labels = {
        0: ['Jasno', 'weather-sun'],
        1: ['Skoro jasno', 'weather-partly-cloud'],
        2: ['Polojasno', 'weather-partly-cloud'],
        3: ['Zataženo', 'weather-cloud'],
        45: ['Mlha', 'weather-fog'],
        48: ['Namrzající mlha', 'weather-fog'],
        51: ['Slabé mrholení', 'weather-rain'],
        53: ['Mrholení', 'weather-rain'],
        55: ['Silné mrholení', 'weather-rain'],
        61: ['Slabý déšť', 'weather-rain'],
        63: ['Déšť', 'weather-rain'],
        65: ['Silný déšť', 'weather-rain'],
        71: ['Slabé sněžení', 'weather-snow'],
        73: ['Sněžení', 'weather-snow'],
        75: ['Silné sněžení', 'weather-snow'],
        80: ['Přeháňky', 'weather-rain'],
        81: ['Silné přeháňky', 'weather-rain'],
        82: ['Prudké přeháňky', 'weather-storm'],
        95: ['Bouřka', 'weather-storm'],
        96: ['Bouřka s kroupami', 'weather-storm'],
        99: ['Silná bouřka', 'weather-storm']
      };
      return labels[Number(code)] || ['Počasí', 'weather-partly-cloud'];
    }

    function roundWeather(value, suffix = '') {
      if (value === null || value === undefined || value === '') return '—';
      const number = Number(value);
      if (!Number.isFinite(number)) return '—';
      return `${Math.round(number)}${suffix}`;
    }

    function weatherLocationLabel() {
      const location = normalizeWeatherLocation(getWeatherState()?.location);
      return [location.name, location.country].filter(Boolean).join(', ');
    }

    function shortTime(value) {
      const date = toSafeDate(value, null);
      if (!date) return '—';
      return new Intl.DateTimeFormat('cs-CZ', { hour: '2-digit', minute: '2-digit' }).format(date);
    }

    function positiveModulo(value, base) {
      return ((Number(value) % base) + base) % base;
    }

    function minutesOfDay(value) {
      const date = toSafeDate(value, null);
      if (!date) return null;
      return date.getHours() * 60 + date.getMinutes();
    }

    function formatMinuteOfDay(value) {
      const minutes = Math.round(positiveModulo(value, 1440));
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    }

    function formatMinutesDuration(value) {
      const minutes = Math.round(Number(value || 0));
      if (!(minutes > 0)) return '—';
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours} h ${String(mins).padStart(2, '0')} min`;
    }

    function astronomyDateForDay(day = null) {
      const iso = normalizeText(day?.date) || new Date().toISOString().slice(0, 10);
      return toSafeDate(`${iso}T12:00:00`, null) || toSafeDate(iso, null) || new Date();
    }

    function moonPhaseInfo(day = null) {
      const date = astronomyDateForDay(day);
      const synodicMonth = 29.530588853;
      const referenceNewMoon = Date.UTC(2000, 0, 6, 18, 14);
      const age = positiveModulo((date.getTime() - referenceNewMoon) / 86400000, synodicMonth);
      const phase = age / synodicMonth;
      const illumination = Math.round(((1 - Math.cos(2 * Math.PI * phase)) / 2) * 100);
      const waxing = phase < 0.5;
      let label = 'Nov';
      let emoji = '🌑';
      if (phase < 0.03 || phase >= 0.97) { label = 'Nov'; emoji = '🌑'; }
      else if (phase < 0.22) { label = 'Dorůstající srpek'; emoji = '🌒'; }
      else if (phase < 0.28) { label = 'První čtvrť'; emoji = '🌓'; }
      else if (phase < 0.47) { label = 'Dorůstá k úplňku'; emoji = '🌔'; }
      else if (phase < 0.53) { label = 'Úplněk'; emoji = '🌕'; }
      else if (phase < 0.72) { label = 'Couvá po úplňku'; emoji = '🌖'; }
      else if (phase < 0.78) { label = 'Poslední čtvrť'; emoji = '🌗'; }
      else { label = 'Ubývající srpek'; emoji = '🌘'; }
      return { age, phase, illumination, waxing, label, emoji };
    }

    function approximateMoonTimes(day = null, moon = moonPhaseInfo(day)) {
      const sunrise = minutesOfDay(day?.sunrise);
      const baseRise = Number.isFinite(sunrise) ? sunrise : 6 * 60;
      const moonriseMinutes = baseRise + moon.phase * 1440;
      return {
        moonrise: formatMinuteOfDay(moonriseMinutes),
        moonset: formatMinuteOfDay(moonriseMinutes + 720)
      };
    }

    function weatherAstronomyForDay(day = null, location = null) {
      const moon = moonPhaseInfo(day);
      const moonTimes = approximateMoonTimes(day, moon);
      const sunrise = minutesOfDay(day?.sunrise);
      const sunset = minutesOfDay(day?.sunset);
      const daylight = Number.isFinite(sunrise) && Number.isFinite(sunset) ? positiveModulo(sunset - sunrise, 1440) : 0;
      return {
        location: normalizeWeatherLocation(location || getWeatherState()?.location),
        sun: {
          sunrise: shortTime(day?.sunrise),
          sunset: shortTime(day?.sunset),
          daylight: formatMinutesDuration(daylight)
        },
        moon: {
          ...moon,
          ...moonTimes
        }
      };
    }

    function renderMoonPhaseIcon(moon = moonPhaseInfo(), options = {}) {
      const size = options.size || 'md';
      const label = `${moon.label || 'Měsíc'} · ${Number(moon.illumination || 0)} %`;
      return `<span class="weather-moon-icon weather-moon-icon-${escapeHtml(String(size))}" role="img" aria-label="${escapeHtml(label)}">${escapeHtml(moon.emoji || '🌙')}</span>`;
    }

    function nextHourlyWindow(hours = [], count = 24) {
      if (!hours.length) return [];
      const now = new Date();
      const currentIndex = hours.findIndex((hour) => {
        const date = toSafeDate(hour.time, null);
        return date && date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
          && date.getDate() === now.getDate() && date.getHours() === now.getHours();
      });
      const startIndex = currentIndex === -1 ? 0 : currentIndex;
      return hours.slice(startIndex, startIndex + count);
    }

    function renderWeatherHourlyStrip(hours = []) {
      if (!hours.length) return '<div class="empty">Hodinový výhled zatím není načtený.</div>';
      return `<div class="weather-hourly-strip">${hours.map((hour) => {
        const [label, hourIcon] = weatherCodeLabel(hour.weatherCode);
        return `<div class="weather-hour"><span>${escapeHtml(shortTime(hour.time))}</span><strong>${renderWeatherAnimeIcon(hour.weatherCode, { size: 'xs', extraClass: 'weather-inline-icon' })}<span>${roundWeather(hour.temperature, '°')}</span></strong><em>${roundWeather(hour.precipitation, ' mm')} · ${escapeHtml(label)}</em></div>`;
      }).join('')}</div>`;
    }

    function compactWeatherText(value, maxLength = 92) {
      const text = normalizeText(value);
      if (!text) return '';
      return text.length > maxLength ? `${text.slice(0, maxLength - 1).trim()}…` : text;
    }

    function renderWeatherDailyGrid(days = []) {
      if (!days.length) return '<div class="empty">Denní předpověď zatím není načtená.</div>';
      return `<div class="weather-daily-row">${days.map((day) => {
        const [label, dayIcon] = weatherCodeLabel(day.weatherCode);
        const sunLine = day.sunrise || day.sunset ? `☀ ${shortTime(day.sunrise)}/${shortTime(day.sunset)}` : '';
        const textLine = compactWeatherText(day.text && day.text !== label ? day.text : '', 86);
        const detail = [
          `${roundWeather(day.min, '°')} / ${roundWeather(day.max, '°')}`,
          roundWeather(day.precipitation, ' mm'),
          sunLine,
          textLine || label
        ].filter((part) => part && part !== '—').join(' · ');
        return `<div class="weather-day"><span>${escapeHtml(shortWeekday(day.date))}</span><strong>${renderWeatherAnimeIcon(day.weatherCode, { size: 'xs', extraClass: 'weather-inline-icon' })}<span>${roundWeather(day.max, '°')}</span></strong><em>${escapeHtml(detail)}</em></div>`;
      }).join('')}</div>`;
    }

    function renderWeatherAstronomyPanel(weather, day, location) {
      const astronomy = weatherAstronomyForDay(day, location);
      return `
        <section class="card desktop-span-2 weather-astronomy-card">
          <div class="card-header">
            <div><h2>Slunce a měsíc</h2><p>${escapeHtml(weatherLocationLabel())}</p></div>
            <span class="badge">${escapeHtml(astronomy.moon.label)}</span>
          </div>
          <div class="weather-astronomy-hero">
            <div class="weather-astronomy-feature weather-astronomy-sun">
              <span class="weather-astronomy-icon" aria-hidden="true">☀️</span>
              <div><strong>${escapeHtml(astronomy.sun.daylight)}</strong><em>délka dne</em></div>
            </div>
            <div class="weather-astronomy-feature weather-astronomy-moon">
              ${renderMoonPhaseIcon(astronomy.moon, { size: 'lg' })}
              <div><strong>${escapeHtml(`${astronomy.moon.illumination} %`)}</strong><em>${escapeHtml(astronomy.moon.label)}</em></div>
            </div>
          </div>
          <div class="weather-astronomy-grid">
            <div class="mini-stat"><span>Východ slunce</span><strong>${escapeHtml(astronomy.sun.sunrise)}</strong></div>
            <div class="mini-stat"><span>Západ slunce</span><strong>${escapeHtml(astronomy.sun.sunset)}</strong></div>
            <div class="mini-stat"><span>Východ měsíce</span><strong>${escapeHtml(astronomy.moon.moonrise)}</strong></div>
            <div class="mini-stat"><span>Západ měsíce</span><strong>${escapeHtml(astronomy.moon.moonset)}</strong></div>
            <div class="mini-stat"><span>Nasvícení</span><strong>${escapeHtml(`${astronomy.moon.illumination} %`)}</strong></div>
            <div class="mini-stat"><span>Fáze</span><strong>${escapeHtml(astronomy.moon.label)}</strong></div>
          </div>
        </section>
      `;
    }

    async function searchWeatherLocations(query) {
      try {
        const clean = normalizeText(query);
        if (!clean) return [];
        const params = new URLSearchParams({ name: clean, count: '8', language: 'cs', format: 'json' });
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`, { cache: 'no-store' });
        if (!response.ok) return [];
        const data = await response.json();
        return Array.isArray(data.results) ? data.results : [];
      } catch {
        return [];
      }
    }

    function renderLocationAutocompleteField(location) {
      const displayValue = [location.name, location.country].filter(Boolean).join(', ');
      return `<div class="form-group weather-location-field">
        <label>Místo</label>
        <div class="weather-autocomplete-wrapper">
          <input type="text" data-weather-location-search value="${escapeHtml(displayValue)}" placeholder="Hledej město…" autocomplete="off" spellcheck="false">
          <div class="weather-autocomplete-dropdown" data-weather-autocomplete hidden></div>
        </div>
        <input type="hidden" name="locationName" value="${escapeHtml(location.name)}">
        <input type="hidden" name="locationCountry" value="${escapeHtml(location.country)}">
        <input type="hidden" name="locationLat" value="${escapeHtml(String(location.latitude))}">
        <input type="hidden" name="locationLon" value="${escapeHtml(String(location.longitude))}">
      </div>`;
    }

    function handleLocationSearchInput(inputEl) {
      const form = inputEl.closest('form');
      if (!form) return;
      const query = normalizeText(inputEl.value);
      const dropdown = form.querySelector('[data-weather-autocomplete]');
      const saveBtn = form.querySelector('[data-weather-save-btn]');
      const hiddenLat = form.querySelector('input[name="locationLat"]');
      const hiddenLon = form.querySelector('input[name="locationLon"]');

      if (hiddenLat) hiddenLat.value = '';
      if (hiddenLon) hiddenLon.value = '';
      if (saveBtn) saveBtn.disabled = true;

      clearTimeout(locationSearchTimer);

      if (!query || query.length < 2) {
        if (dropdown) { dropdown.innerHTML = ''; dropdown.hidden = true; }
        return;
      }

      if (dropdown) {
        dropdown.innerHTML = '<div class="weather-autocomplete-status">Hledám…</div>';
        dropdown.hidden = false;
      }

      locationSearchTimer = setTimeout(async () => {
        const results = await searchWeatherLocations(query);
        if (!dropdown) return;
        if (!results.length) {
          dropdown.innerHTML = '<div class="weather-autocomplete-status">Žádné výsledky</div>';
          return;
        }
        dropdown.innerHTML = results.map((r) => {
          const label = [r.name, r.admin1, r.country].filter(Boolean).join(', ');
          return `<button type="button" class="weather-autocomplete-item" data-weather-location-pick data-name="${escapeHtml(r.name)}" data-country="${escapeHtml(r.country_code || r.country || '')}" data-lat="${escapeHtml(String(r.latitude))}" data-lon="${escapeHtml(String(r.longitude))}">${escapeHtml(label)}</button>`;
        }).join('');
      }, 400);
    }

    function handleLocationPick(pickBtn) {
      const form = pickBtn.closest('form');
      if (!form) return;
      const { name, country, lat, lon } = pickBtn.dataset;

      const displayInput = form.querySelector('[data-weather-location-search]');
      if (displayInput) displayInput.value = [name, country].filter(Boolean).join(', ');

      const hName = form.querySelector('input[name="locationName"]');
      const hCountry = form.querySelector('input[name="locationCountry"]');
      const hLat = form.querySelector('input[name="locationLat"]');
      const hLon = form.querySelector('input[name="locationLon"]');
      if (hName) hName.value = name || '';
      if (hCountry) hCountry.value = country || '';
      if (hLat) hLat.value = lat || '';
      if (hLon) hLon.value = lon || '';

      const saveBtn = form.querySelector('[data-weather-save-btn]');
      if (saveBtn) saveBtn.disabled = false;

      const dropdown = form.querySelector('[data-weather-autocomplete]');
      if (dropdown) { dropdown.innerHTML = ''; dropdown.hidden = true; }
    }

    function renderWeatherPage() {
      const weather = normalizeWeatherState(getWeatherState());
      const current = weather.current || {};
      const [condition, icon] = weatherCodeLabel(current.weatherCode);
      const updated = weather.updatedAt ? formatDateTime(new Date(weather.updatedAt)) : 'nenačteno';
      const todayWeather = (weather.daily || [])[0] || {};
      const sourceLabel = weatherSourceLabel(weather.source);
      const location = normalizeWeatherLocation(weather.location);
      const providerLabel = normalizeText(weather.meta?.providerLabel) || (weather.source === 'chmi' ? 'ČHMÚ + doplněné detaily' : sourceLabel);
      const astronomySource = normalizeText(weather.meta?.astronomySource || weather.meta?.numericFallback) || (weather.source === 'chmi' ? 'Open-Meteo' : sourceLabel);
      ensureWeatherFresh(false);
      const requestedTab = getModuleTab('weather', 'overview');
      const activeTab = ['overview', 'astronomy', 'settings'].includes(requestedTab) ? requestedTab : 'overview';
      const tabs = renderSectionTabs('weather', [
        { id: 'overview', label: 'Přehled', icon: '🌤️' },
        { id: 'astronomy', label: 'Další', icon: '🌙' },
        { id: 'settings', label: 'Nastavení', icon: '⚙️' }
      ], 'overview');
      const overviewContent = `
        <section class="card desktop-span-2 weather-page-hero">
          <div class="card-header compact-card-header">
            <div><h2>${escapeHtml(weatherLocationLabel())}</h2><p>Aktualizováno: ${escapeHtml(updated)}</p></div>
            <span class="badge ${weather.current ? 'good' : weather.error ? 'warn' : ''}">${weather.loading ? 'načítám' : weather.current ? escapeHtml(providerLabel) : 'není načtené'}</span>
          </div>
          <div class="weather-main-row">
            <div class="weather-current weather-current-large">
              ${renderWeatherAnimeIcon(current.weatherCode, { size: 'md', extraClass: 'weather-icon' })}
              <div><strong>${roundWeather(current.temperature, '°')}</strong><em>${escapeHtml(condition)} · pocitově ${roundWeather(current.feelsLike, '°')}</em></div>
            </div>
            <div class="weather-metrics">
              <div class="mini-stat"><span>Vlhkost</span><strong>${roundWeather(current.humidity, '%')}</strong></div>
              <div class="mini-stat"><span>Vítr</span><strong>${roundWeather(current.windSpeed, ' km/h')}</strong></div>
              <div class="mini-stat"><span>Srážky teď</span><strong>${Number.isFinite(Number(current.precipitation)) ? `${String(current.precipitation).replace('.', ',')} mm` : '—'}</strong></div>
              <div class="mini-stat"><span>Zdroj</span><strong>${escapeHtml(sourceLabel)}</strong></div>
            </div>
          </div>
          <div class="form-actions compact-actions"><button class="primary-btn" type="button" data-action="weather-refresh">Obnovit počasí</button></div>
        </section>
        <section class="card desktop-span-2">
          <div class="card-header"><div><h2>Po hodinách</h2><p>Nejbližších 24 hodin pro rychlé plánování.</p></div></div>
          ${renderWeatherHourlyStrip(nextHourlyWindow(weather.hourly || [], 24))}
        </section>
        <section class="card desktop-span-2">
          <div class="card-header"><div><h2>Další dny</h2><p>Přehled dopředu, bez zbytečné omáčky.</p></div></div>
          ${renderWeatherDailyGrid((weather.daily || []).slice(0, 7))}
        </section>
      `;
      const settingsContent = `
        <section class="card desktop-span-2 weather-settings-card">
          <div class="card-header"><div><h2>Nastavení počasí</h2><p>${escapeHtml(weatherLocationLabel())}</p></div></div>
          <form data-form="weather-settings" class="compact-form">
            <div class="form-grid two">
              ${selectField('Zdroj', 'weatherSource', WEATHER_PROVIDER_OPTIONS, normalizeWeatherSource(weather.source))}
              ${renderLocationAutocompleteField(location)}
            </div>
            <div class="form-actions compact-actions"><button class="primary-btn" type="submit" data-weather-save-btn>Uložit a načíst počasí</button><button class="ghost-btn" type="button" data-action="weather-refresh">Obnovit počasí</button></div>
          </form>
        </section>
      `;
      const astronomyContent = renderWeatherAstronomyPanel(weather, todayWeather, location);
      return `
        ${tabs}
        <div class="grid two module-tabbed weather-tab-${escapeHtml(activeTab)}" data-tab-area="weather">
          ${activeTab === 'settings' ? settingsContent : activeTab === 'astronomy' ? astronomyContent : overviewContent}
        </div>`;
    }

    async function ensureWeatherFresh(force = false) {
      const normalized = normalizeWeatherState(getWeatherState());
      setWeatherState(normalized);
      const updatedAt = Date.parse(normalized.updatedAt || '');
      if (!force && normalized.current && updatedAt && Date.now() - updatedAt < WEATHER_CACHE_MS) return;
      if (weatherFetchPromise) return weatherFetchPromise;
      weatherFetchPromise = fetchWeatherForLocation(force)
        .catch((error) => {
          setWeatherState({ ...normalizeWeatherState(getWeatherState()), loading: false, error: error?.message || 'Počasí se nepovedlo načíst' });
          saveState();
        })
        .finally(() => { weatherFetchPromise = null; });
      return weatherFetchPromise;
    }

    function normalizeWeatherPayload(payload, location, source = 'chmi', fallbackError = '') {
      const raw = payload?.weather && typeof payload.weather === 'object' ? payload.weather : payload || {};
      return {
        location: normalizeWeatherLocation(raw.location || location),
        current: raw.current && typeof raw.current === 'object' ? raw.current : null,
        daily: Array.isArray(raw.daily) ? raw.daily : [],
        hourly: Array.isArray(raw.hourly) ? raw.hourly : [],
        updatedAt: raw.updatedAt || new Date().toISOString(),
        error: raw.error || fallbackError || '',
        loading: false,
        source: normalizeWeatherSource(raw.source || source),
        meta: raw.meta && typeof raw.meta === 'object' ? raw.meta : {}
      };
    }

    async function fetchChmiWeatherForLocation(location) {
      // Use only an already-initialised client — never force-create one here.
      // Creating the Supabase client triggers its auto-refresh machinery; on iOS
      // the network may not be ready at first render and the refresh fails → SIGNED_OUT.
      // The warmstart (6.2 s) creates the client properly once the network is stable.
      const client = getSupabaseClientIfReady();
      if (!client?.functions?.invoke) throw new Error('ČHMÚ backend zatím není dostupný');
      const normalizedLocation = normalizeWeatherLocation(location);
      const body = {
        householdId: getHouseholdId(),
        location: normalizedLocation,
        locationName: normalizedLocation.name,
        name: normalizedLocation.name,
        country: normalizedLocation.country,
        latitude: normalizedLocation.latitude,
        longitude: normalizedLocation.longitude,
        region: normalizedLocation.region || normalizedLocation.name
      };
      const { data, error } = await client.functions.invoke(WEATHER_CHMI_FUNCTION, { body });
      if (error || data?.error) throw new Error(error?.message || data?.error || 'ČHMÚ počasí se nepovedlo načíst');
      return normalizeWeatherPayload(data, location, 'chmi');
    }

    async function fetchOpenMeteoWeatherForLocation(location) {
      const params = new URLSearchParams({
        latitude: String(location.latitude),
        longitude: String(location.longitude),
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m',
        hourly: 'temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset',
        timezone: 'auto',
        forecast_days: '7'
      });
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Počasí HTTP ${response.status}`);
      const data = await response.json();
      const current = data.current || {};
      const daily = data.daily || {};
      const hourly = data.hourly || {};
      return {
        location,
        current: {
          temperature: current.temperature_2m,
          feelsLike: current.apparent_temperature,
          humidity: current.relative_humidity_2m,
          windSpeed: current.wind_speed_10m,
          precipitation: current.precipitation,
          weatherCode: current.weather_code,
          time: current.time || new Date().toISOString()
        },
        daily: (daily.time || []).map((date, index) => ({
          date,
          weatherCode: daily.weather_code?.[index],
          min: daily.temperature_2m_min?.[index],
          max: daily.temperature_2m_max?.[index],
          precipitation: daily.precipitation_sum?.[index],
          sunrise: daily.sunrise?.[index],
          sunset: daily.sunset?.[index]
        })),
        hourly: (hourly.time || []).map((time, index) => ({
          time,
          weatherCode: hourly.weather_code?.[index],
          temperature: hourly.temperature_2m?.[index],
          feelsLike: hourly.apparent_temperature?.[index],
          windSpeed: hourly.wind_speed_10m?.[index],
          precipitation: hourly.precipitation?.[index]
        })),
        updatedAt: new Date().toISOString(),
        error: '',
        loading: false,
        source: 'open-meteo'
      };
    }

    async function fetchWeatherForLocation(force = false) {
      const location = normalizeWeatherLocation(getWeatherState()?.location);
      const storedSource = normalizeWeatherSource(getWeatherState()?.source || 'chmi');
      const preferredSource = storedSource === 'open-meteo-fallback' ? 'chmi' : storedSource;
      setWeatherState({ ...normalizeWeatherState(getWeatherState()), location, loading: true, error: '' });
      if (force) render();

      let nextWeather;
      try {
        nextWeather = preferredSource === 'chmi'
          ? await fetchChmiWeatherForLocation(location)
          : await fetchOpenMeteoWeatherForLocation(location);
      } catch (error) {
        const message = error?.message || 'Počasí se nepovedlo načíst';
        if (preferredSource === 'chmi') {
          nextWeather = await fetchOpenMeteoWeatherForLocation(location);
          nextWeather.source = 'open-meteo-fallback';
          nextWeather.error = `ČHMÚ zatím nedostupné, dočasně fallback: ${message}`;
        } else {
          throw error;
        }
      }

      setWeatherState(normalizeWeatherPayload(nextWeather, location, nextWeather.source || preferredSource));
      touchState();
      saveState();
      render();
    }

    async function findWeatherLocationByName(name) {
      const clean = normalizeText(name);
      if (!clean) throw new Error('Doplň název místa');
      const params = new URLSearchParams({ name: clean, count: '1', language: 'cs', format: 'json' });
      const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Vyhledání místa HTTP ${response.status}`);
      const data = await response.json();
      const item = data.results?.[0];
      if (!item) throw new Error('Místo se nepovedlo najít');
      return {
        name: item.name || clean,
        country: item.country_code || item.country || '',
        latitude: item.latitude,
        longitude: item.longitude
      };
    }

    async function saveWeatherSettings(data, form) {
      try {
        const lat = Number(String(data.locationLat || '').replace(',', '.'));
        const lon = Number(String(data.locationLon || '').replace(',', '.'));
        if (!Number.isFinite(lat) || !Number.isFinite(lon) || !normalizeText(data.locationName)) {
          showToast('Vyber město ze seznamu');
          return;
        }
        const location = {
          name: normalizeText(data.locationName),
          country: normalizeText(data.locationCountry || ''),
          latitude: lat,
          longitude: lon
        };
        const weatherSource = normalizeWeatherSource(data.weatherSource || getWeatherState()?.source || 'chmi');
        setWeatherState({ ...normalizeWeatherState(getWeatherState()), location, current: null, daily: [], hourly: [], updatedAt: '', error: '', source: weatherSource });
        touchState();
        saveState();
        form?.reset?.();
        showToast(`Počasí nastavené: ${location.name}`);
        cloudSaveHouseholdUiSettings(false).catch((error) => console.warn('Cloud sync (počasí) na pozadí selhal', error));
        await ensureWeatherFresh(true);
      } catch (error) {
        showToast(error?.message || 'Počasí se nepovedlo nastavit');
      }
    }

    return {
      normalizeWeatherLocation,
      normalizeWeatherSource,
      normalizeWeatherState,
      weatherSourceLabel,
      weatherCodeLabel,
      roundWeather,
      weatherLocationLabel,
      weatherAstronomyForDay,
      renderMoonPhaseIcon,
      renderWeatherAnimeIcon,
      renderWeatherPage,
      ensureWeatherFresh,
      saveWeatherSettings,
      handleLocationSearchInput,
      handleLocationPick
    };
  }

  window.DomacnostWeather = { createWeather };
})();
