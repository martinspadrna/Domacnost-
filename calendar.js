(function () {
  'use strict';

  // Kalendář – ČÁST A + B (fáze B): render + měsíční mřížka + event/dashboard helpery +
  // zdroje + CRUD událostí + cloud načtení (cloudLoadCalendar / cloudLoadCalendarSources)
  // + Google OAuth/edge funkce (googleCalendarStart/Sync/ListCalendars/Disconnect,
  //   invokeGoogleCalendarFunction, renderGoogleCalendarConnector, auto-sync).
  // Realtime sync mezi zařízeními ZŮSTÁVÁ v app.js (generický kanál, ne kalendářový kód);
  // OAuth NÁVRAT (handleInitialAuthReturn) také zůstává v bootu app.js – volá modul přes wrappery.
  //   - cloudLoadCalendar / cloudLoadCalendarSources: state.X -> getState().X, aby časování
  //     zápisu (state.calendar/calendarCloud -> saveState) zůstalo IDENTICKÉ –
  //     realtime reload v app.js je volá a sync mezi zařízeními se nesmí rozbít.
  //   - invokeGoogleCalendarFunction dostává HEAVY DEPS (cloudLoadHouseholds,
  //     bootstrapCloudHousehold, resetLocalWorkspaceForCloudUser) – vynechaný dep = tichý pád syncu.
  function createCalendar(deps) {
    const getState = deps.getState || (() => ({}));
    const getNow = deps.getNow || (() => new Date());
    const getCalendarViewMonth = deps.getCalendarViewMonth || (() => new Date().toISOString().slice(0, 7));
    const getCalendarDetailEventId = deps.getCalendarDetailEventId || (() => null);
    const getDetailsOpen = deps.getDetailsOpen || (() => false);
    const escapeHtml = deps.escapeHtml || ((v) => String(v ?? ''));
    const normalizeText = deps.normalizeText || ((v) => String(v || '').trim());
    const uid = deps.uid || (() => Math.random().toString(36).slice(2));
    const todayISO = deps.todayISO || (() => new Date().toISOString().slice(0, 10));
    const formatDate = deps.formatDate || ((v) => String(v || ''));
    const formatDateTime = deps.formatDateTime || ((v) => String(v || ''));
    const shortDateText = deps.shortDateText || ((v) => String(v || ''));
    const field = deps.field || (() => '');
    const selectField = deps.selectField || (() => '');
    const renderSectionTabs = deps.renderSectionTabs || (() => '');
    const renderEmpty = deps.renderEmpty || (() => '');
    const renderEmptyCta = deps.renderEmptyCta || (() => '');
    const getModuleTab = deps.getModuleTab || ((area, fallback) => fallback);
    const currentHouseholdId = deps.currentHouseholdId || (() => '');
    const currentProfileId = deps.currentProfileId || (() => '');
    const showToast = deps.showToast || (() => {});
    const saveState = deps.saveState || (() => {});
    const touchState = deps.touchState || (() => {});
    const render = deps.render || (() => {});
    const toSafeDate = deps.toSafeDate || ((v, f) => f || new Date());
    const addDaysIso = deps.addDaysIso || ((iso) => iso);
    const dateOffsetISO = deps.dateOffsetISO || (() => '');
    const localISODate = deps.localISODate || ((d) => new Date(d).toISOString().slice(0, 10));
    const czechPublicHolidayName = deps.czechPublicHolidayName || (() => '');
    const pragueOffsetForLocalDateTime = deps.pragueOffsetForLocalDateTime || (() => '+01:00');
    const getSupabaseClient = deps.getSupabaseClient || (() => null);
    const refreshCloudSession = deps.refreshCloudSession || (async () => null);
    const cloudReady = deps.cloudReady || (() => false);
    // ČÁST B – Google OAuth + edge (heavy deps pro invokeGoogleCalendarFunction):
    const cloudLoadHouseholds = deps.cloudLoadHouseholds || (async () => []);
    const bootstrapCloudHousehold = deps.bootstrapCloudHousehold || (async () => null);
    const resetLocalWorkspaceForCloudUser = deps.resetLocalWorkspaceForCloudUser || (() => {});
    const runWhenUiQuiet = deps.runWhenUiQuiet || ((cb) => setTimeout(cb, 0));
    const requestRender = deps.requestRender || render;
    const getGoogleCalendarDetailsOpen = deps.getGoogleCalendarDetailsOpen || (() => false);
    const APP_PUBLIC_URL = deps.APP_PUBLIC_URL || '';
    const GOOGLE_CALENDAR_RECONNECT_FLAG = deps.GOOGLE_CALENDAR_RECONNECT_FLAG || 'domacnostPlus.googleCalendarReconnectAttempted';
    const GOOGLE_CALENDAR_CALLBACK_AUTOLOAD_FLAG = deps.GOOGLE_CALENDAR_CALLBACK_AUTOLOAD_FLAG || 'domacnostPlus.googleCalendarCallbackAutoLoaded';

    const DEFAULT_CALENDAR_EVENT_MINUTES = deps.DEFAULT_CALENDAR_EVENT_MINUTES || 60;
    const APP_TIME_ZONE = deps.APP_TIME_ZONE || 'Europe/Prague';
    const GOOGLE_CALENDAR_AUTO_SYNC_MAX_AGE_MS = 2 * 60 * 60 * 1000;

    let googleCalendarAutoSyncTimer = null;
    let googleCalendarAutoSyncRunning = false;

    function getCalendarSources() {
      return Array.isArray(getState().calendarCloud?.sources) ? getState().calendarCloud.sources : [];
    }

    function normalizeCalendarSourceProvider(provider = '') {
      const value = String(provider || '').toLowerCase();
      if (['google', 'manual', 'family', 'work', 'ical', 'other'].includes(value)) return value;
      return 'manual';
    }

    function calendarSourceProviderLabel(provider = '') {
      const labels = {
        manual: 'Ruční',
        family: 'Rodinný',
        work: 'Práce',
        google: 'Google',
        ical: 'iCal',
        other: 'Jiný'
      };
      return labels[normalizeCalendarSourceProvider(provider)] || 'Kalendář';
    }

    function calendarSourceIcon(provider = '') {
      const icons = { manual: '✍️', family: '👨‍👩‍👧', work: '🏭', google: 'G', ical: '📥', other: '📅' };
      return icons[normalizeCalendarSourceProvider(provider)] || '📅';
    }

    function mapCalendarSource(row = {}) {
      return {
        id: row.id || row.cloudId || uid(),
        cloudId: row.cloudId || row.id || '',
        householdId: row.household_id || row.householdId || currentHouseholdId(),
        profileId: row.profile_id || row.profileId || '',
        name: row.name || 'Kalendář',
        provider: normalizeCalendarSourceProvider(row.provider),
        providerCalendarId: row.provider_calendar_id || row.providerCalendarId || row.calendar_id || row.external_calendar_id || row.google_calendar_id || '',
        providerConnectionId: row.provider_connection_id || row.providerConnectionId || '',
        color: row.color || '',
        isEnabled: row.is_enabled !== undefined ? Boolean(row.is_enabled) : row.isEnabled !== false,
        syncEnabled: row.sync_enabled !== undefined ? Boolean(row.sync_enabled) : Boolean(row.syncEnabled),
        lastSyncedAt: row.last_synced_at || row.lastSyncedAt || '',
        note: row.note || '',
        createdAt: row.created_at || row.createdAt || new Date().toISOString()
      };
    }

    function getCalendarSource(sourceId) {
      const id = String(sourceId || '');
      if (!id) return null;
      return getCalendarSources().find((source) => [source.id, source.cloudId].filter(Boolean).map(String).includes(id)) || null;
    }

    function isCalendarSourceEnabled(sourceId) {
      const source = getCalendarSource(sourceId);
      return !source || source.isEnabled !== false;
    }

    // Cache pro visibleCalendarEvents() a upcomingCalendarEvents(). Signature
    // bere state.calendar (id/cloudId/sourceId/date/time/endDate/endTime/
    // updatedAt) + calendarCloud.sources (id/cloudId + isEnabled), takže
    // změna zdrojů nebo jejich toggle invaliduje stejně jako edit události.
    // Cache padne i po reassignu state (loadState / hydrate) — signature
    // z čerstvého getState() nesedne k předchozí.
    let cachedCalendarSignature = '';
    let cachedVisibleEvents = null;
    let cachedUpcomingRefKey = null;
    let cachedUpcomingList = null;

    function computeCalendarSignature() {
      const events = getState().calendar || [];
      const sources = getCalendarSources();
      const eventParts = new Array(events.length);
      for (let i = 0; i < events.length; i += 1) {
        const e = events[i] || {};
        // title patří do signature — sortCalendarEventsByStart používá
        // localeCompare(title) jako tie-breaker při stejném startMs, takže
        // přejmenování události se stejným časem musí invalidovat cache.
        // updatedAt většinou stačí, ale nepolehneme na to (starý stav v IDB
        // nemusí updatedAt mít, migrace ho nastaví lazy).
        eventParts[i] = `${e.id || ''}:${e.cloudId || ''}:${e.sourceId || ''}:${e.date || ''}:${e.time || ''}:${e.endDate || ''}:${e.endTime || ''}:${e.updatedAt || ''}:${e.title || ''}`;
      }
      const sourceParts = new Array(sources.length);
      for (let i = 0; i < sources.length; i += 1) {
        const s = sources[i] || {};
        sourceParts[i] = `${s.id || ''}:${s.cloudId || ''}:${s.isEnabled !== false ? '1' : '0'}`;
      }
      return `${events.length}#${eventParts.join('|')}##${sources.length}#${sourceParts.join('|')}`;
    }

    function ensureCalendarFresh() {
      const sig = computeCalendarSignature();
      if (sig !== cachedCalendarSignature) {
        cachedCalendarSignature = sig;
        cachedVisibleEvents = null;
        cachedUpcomingRefKey = null;
        cachedUpcomingList = null;
      }
    }

    function visibleCalendarEvents() {
      ensureCalendarFresh();
      if (cachedVisibleEvents) return cachedVisibleEvents;
      cachedVisibleEvents = (getState().calendar || []).filter((event) => isCalendarSourceEnabled(event.sourceId));
      return cachedVisibleEvents;
    }

    function calendarSourceName(sourceId) {
      const source = getCalendarSource(sourceId);
      return source?.name || 'Ruční kalendář';
    }

    function calendarSourceOptions(selected = '') {
      const sources = getCalendarSources().filter((source) => source.isEnabled !== false);
      const options = [['manual', 'Sdílený kalendář domácnosti']];
      sources.forEach((source) => {
        const id = source.id || source.cloudId;
        if (!id || String(id) === 'manual') return;
        options.push([id, `${source.name} · ${calendarSourceProviderLabel(source.provider)}`]);
      });
      return selectField('Uložit do', 'sourceId', options, selected || 'manual');
    }

    function buildCalendarDateTime(date, time, fallbackTime = '00:00') {
      const d = String(date || todayISO()).slice(0, 10);
      const t = String(time || fallbackTime || '00:00').slice(0, 5);
      return `${d}T${t}:00${pragueOffsetForLocalDateTime(d, t)}`;
    }

    function zonedDateTimeParts(value, timeZone = APP_TIME_ZONE) {
      const date = toSafeDate(value);
      if (!date) return { date: '', time: '' };
      const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23'
      }).formatToParts(date).reduce((acc, part) => {
        if (part.type !== 'literal') acc[part.type] = part.value;
        return acc;
      }, {});
      return {
        date: `${parts.year}-${parts.month}-${parts.day}`,
        time: `${parts.hour}:${parts.minute}`
      };
    }

    function splitCalendarDateTime(value, options = {}) {
      if (!value) return { date: '', time: '' };
      const text = String(value);
      if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return { date: text, time: '' };
      const hasExplicitZone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(text);
      if (hasExplicitZone) {
        const parts = zonedDateTimeParts(text, APP_TIME_ZONE);
        return { date: parts.date, time: options.allDay ? '' : parts.time };
      }
      return { date: text.slice(0, 10), time: options.allDay ? '' : (text.length >= 16 ? text.slice(11, 16) : '') };
    }

    function normalizeCalendarType(value) {
      const map = { rodina: 'family', prace: 'event', domacnost: 'event', ostatni: 'other' };
      const next = map[value] || value || 'event';
      return ['event', 'shift', 'family', 'reminder', 'holiday', 'other'].includes(next) ? next : 'event';
    }

    function calendarEventStartMs(event) {
      if (!event?.date) return Number.MAX_SAFE_INTEGER;
      if (!event.time) return new Date(buildCalendarDateTime(event.date, '00:00')).getTime();
      return new Date(buildCalendarDateTime(event.date, event.time)).getTime();
    }

    function calendarEventEndMs(event) {
      if (!event?.date) return Number.MAX_SAFE_INTEGER;
      const startMs = calendarEventStartMs(event);
      if (!Number.isFinite(startMs)) return Number.MAX_SAFE_INTEGER;
      const endDate = normalizeText(event.endDate) || event.date;
      if (!event.time) {
        const allDayEndDate = event.endDate && event.endDate > event.date ? addDaysIso(event.endDate, -1) : event.date;
        return new Date(buildCalendarDateTime(allDayEndDate, '23:59')).getTime() + 59999;
      }
      if (event.endTime || event.endDate) {
        let endMs = new Date(buildCalendarDateTime(endDate, event.endTime || event.time, event.time)).getTime();
        if (Number.isFinite(endMs) && endMs <= startMs) endMs += 24 * 60 * 60 * 1000;
        return endMs;
      }
      return startMs + DEFAULT_CALENDAR_EVENT_MINUTES * 60 * 1000;
    }

    function calendarEventIsRunning(event, referenceDate = getNow()) {
      const refMs = toSafeDate(referenceDate, new Date()).getTime();
      return calendarEventStartMs(event) <= refMs && calendarEventEndMs(event) > refMs;
    }

    function calendarEventIsRelevant(event, referenceDate = getNow()) {
      if (!event?.date) return true;
      const refMs = toSafeDate(referenceDate, new Date()).getTime();
      return calendarEventEndMs(event) > refMs;
    }

    function sortCalendarEventsByStart(rows) {
      return [...(rows || [])].sort((a, b) => calendarEventStartMs(a) - calendarEventStartMs(b) || String(a.title || '').localeCompare(String(b.title || '')));
    }

    function upcomingCalendarEvents(referenceDate = getNow()) {
      ensureCalendarFresh();
      const refMs = toSafeDate(referenceDate, new Date()).getTime();
      // Klíč na minuty: v jednom renderu se často volá s "now" vytvořeným
      // opakovaně (různé getTime v desítkách ms). Per-minute klíč dedupuje
      // volání v témže renderu; rozdíl <60 s výsledek fakticky nemění
      // (calendarEventIsRelevant test na koncový čas události v ms).
      const refKey = Number.isFinite(refMs) ? Math.floor(refMs / 60000) : 0;
      if (cachedUpcomingRefKey === refKey && cachedUpcomingList) return cachedUpcomingList;
      cachedUpcomingList = sortCalendarEventsByStart(
        visibleCalendarEvents().filter((event) => calendarEventIsRelevant(event, referenceDate))
      );
      cachedUpcomingRefKey = refKey;
      return cachedUpcomingList;
    }

    function calendarEventTimeLabel(event, referenceDate = getNow()) {
      if (!event) return '';
      const running = calendarEventIsRunning(event, referenceDate);
      const endDate = calendarEventDisplayEndDate(event);
      const dateRange = endDate && endDate !== event.date ? `${shortDateText(event.date)}–${shortDateText(endDate)}` : shortDateText(event.date);
      if (!event.time) return event.date === todayISO() && endDate === event.date ? 'dnes · celý den' : `${dateRange} · celý den`;
      const range = event.endTime ? `${event.time}–${event.endTime}` : event.time;
      if (running) return event.endTime ? `probíhá do ${event.endTime}` : `probíhá od ${event.time}`;
      if (event.date === todayISO()) return `dnes ${range}`;
      return `${shortDateText(event.date)} · ${range}`;
    }

    function calendarEventMetaLabel(event, referenceDate = getNow()) {
      const timeLabel = calendarEventTimeLabel(event, referenceDate);
      return `${timeLabel}${event?.location ? ` · ${event.location}` : ''}${event?.note ? ` · ${event.note}` : ''}`;
    }

    function findCalendarEventById(id) {
      const key = String(id || '');
      if (!key) return null;
      return (getState().calendar || []).find((event) => String(event.id || '') === key || String(event.cloudId || '') === key) || null;
    }

    function renderCalendarEventDetailModal() {
      const event = findCalendarEventById(getCalendarDetailEventId());
      if (!event) return '';
      const running = calendarEventIsRunning(event, getNow());
      const source = calendarSourceName(event.sourceId);
      return `
        <div class="app-modal-backdrop" data-modal-backdrop role="presentation">
          <section class="app-modal calendar-event-modal" role="dialog" aria-modal="true" aria-labelledby="calendar-event-title">
            <div class="app-modal-head">
              <div>
                <span class="badge ${running ? 'good' : ''}">${running ? 'probíhá' : event.date ? formatDate(event.date) : 'bez data'}</span>
                <h2 id="calendar-event-title">${escapeHtml(event.title || 'Událost')}</h2>
                <p>${escapeHtml(calendarEventMetaLabel(event, getNow()))} · ${escapeHtml(source)}</p>
              </div>
              <button class="icon-btn" type="button" data-action="close-modal" aria-label="Zavřít detail události">×</button>
            </div>
            <div class="modal-detail-grid">
              <div class="modal-detail-card"><span>Datum</span><strong>${escapeHtml(calendarEventDateLabel(event))}</strong></div>
              <div class="modal-detail-card"><span>Čas</span><strong>${escapeHtml(calendarEventTimeLabel(event, getNow()) || '—')}</strong></div>
              <div class="modal-detail-card"><span>Typ</span><strong>${escapeHtml(event.type || 'událost')}</strong></div>
              <div class="modal-detail-card"><span>Zdroj</span><strong>${escapeHtml(source)}</strong></div>
            </div>
            ${event.location ? `<div class="inline-note"><strong>Místo:</strong> ${escapeHtml(event.location)}</div>` : ''}
            ${event.note ? `<div class="inline-note"><strong>Poznámka:</strong> ${escapeHtml(event.note)}</div>` : ''}
            <div class="form-actions modal-actions">
              <button class="ghost-btn" type="button" data-action="close-modal">Zavřít</button>
              ${!event.cloudId ? `<button class="danger-btn" type="button" data-action="delete-calendar" data-id="${escapeHtml(event.id || '')}">Smazat událost</button>` : ''}
            </div>
          </section>
        </div>
      `;
    }

    function normalizeCalendarMonth(value) {
      const clean = String(value || '').slice(0, 7);
      return /^\d{4}-\d{2}$/.test(clean) ? clean : todayISO().slice(0, 7);
    }

    function shiftCalendarMonth(monthKey, delta = 0) {
      const clean = normalizeCalendarMonth(monthKey);
      const [year, month] = clean.split('-').map(Number);
      const date = new Date(Date.UTC(year, month - 1 + Number(delta || 0), 1));
      return date.toISOString().slice(0, 7);
    }

    function calendarMonthTitle(monthKey) {
      const clean = normalizeCalendarMonth(monthKey);
      const [year, month] = clean.split('-').map(Number);
      const date = new Date(Date.UTC(year, month - 1, 1));
      return new Intl.DateTimeFormat('cs-CZ', { month: 'long', year: 'numeric' }).format(date);
    }

    function calendarDayNumber(isoDate) {
      const day = Number(String(isoDate || '').slice(8, 10));
      return Number.isFinite(day) ? day : '';
    }

    function calendarDayHeaderText(isoDate) {
      const date = new Date(`${String(isoDate || '').slice(0, 10)}T00:00:00`);
      if (Number.isNaN(date.getTime())) return '';
      return new Intl.DateTimeFormat('cs-CZ', { weekday: 'short', day: 'numeric', month: 'numeric' }).format(date);
    }

    function calendarCellEventTime(event) {
      if (!event?.time) return 'celý den';
      return event.endTime ? `${event.time}–${event.endTime}` : event.time;
    }

    function calendarEventDisplayEndDate(event = {}) {
      const startDate = String(event.date || '').slice(0, 10);
      let endDate = String(event.endDate || '').slice(0, 10);
      if (!startDate) return '';
      if (!endDate) {
        const endMs = calendarEventEndMs(event);
        if (Number.isFinite(endMs) && endMs !== Number.MAX_SAFE_INTEGER) {
          endDate = localISODate(new Date(endMs));
        }
      }
      if (!endDate || endDate < startDate) return startDate;
      if (!event.time && event.endDate && endDate > startDate) {
        endDate = addDaysIso(endDate, -1);
      }
      return endDate < startDate ? startDate : endDate;
    }

    function calendarEventDateRange(event = {}, gridStart = '', gridEnd = '') {
      const startDate = String(event.date || '').slice(0, 10);
      if (!startDate) return [];
      let endDate = calendarEventDisplayEndDate(event);
      if (!endDate) endDate = startDate;
      let cursor = startDate < gridStart ? gridStart : startDate;
      const last = endDate > gridEnd ? gridEnd : endDate;
      const days = [];
      while (cursor && last && cursor <= last && days.length < 366) {
        days.push(cursor);
        cursor = addDaysIso(cursor, 1);
      }
      return days;
    }

    function calendarEventDateLabel(event = {}) {
      const startDate = String(event.date || '').slice(0, 10);
      const endDate = calendarEventDisplayEndDate(event);
      if (!startDate) return '—';
      if (!endDate || endDate === startDate) return formatDate(startDate);
      return `${formatDate(startDate)} – ${formatDate(endDate)}`;
    }

    function renderCalendarMonthGrid(events = [], monthKey = getCalendarViewMonth()) {
      const month = normalizeCalendarMonth(monthKey);
      const [year, rawMonth] = month.split('-').map(Number);
      const firstDay = new Date(Date.UTC(year, rawMonth - 1, 1));
      const lastDay = new Date(Date.UTC(year, rawMonth, 0));
      const leadingDays = (firstDay.getUTCDay() + 6) % 7;
      const trailingDays = 6 - ((lastDay.getUTCDay() + 6) % 7);
      const gridStart = addDaysIso(`${month}-01`, -leadingDays);
      const gridEnd = addDaysIso(lastDay.toISOString().slice(0, 10), trailingDays);
      const monthEvents = sortCalendarEventsByStart(events).filter((event) => {
        const startDate = String(event.date || '').slice(0, 10);
        const endDate = calendarEventDisplayEndDate(event) || startDate;
        return startDate && startDate <= gridEnd && endDate >= gridStart;
      });
      const eventsByDate = monthEvents.reduce((acc, event) => {
        calendarEventDateRange(event, gridStart, gridEnd).forEach((key) => {
          if (!acc[key]) acc[key] = [];
          acc[key].push(event);
        });
        return acc;
      }, {});
      const days = [];
      let cursor = gridStart;
      while (cursor <= gridEnd) {
        days.push(cursor);
        cursor = addDaysIso(cursor, 1);
      }
      while (days.length < 35) days.push(addDaysIso(days[days.length - 1], 1));
      const weeks = [];
      for (let index = 0; index < days.length; index += 7) weeks.push(days.slice(index, index + 7));
      const monthStart = `${month}-01`;
      const monthEnd = lastDay.toISOString().slice(0, 10);
      const monthEventCount = monthEvents.filter((event) => {
        const startDate = String(event.date || '').slice(0, 10);
        const endDate = calendarEventDisplayEndDate(event) || startDate;
        return startDate && startDate <= monthEnd && endDate >= monthStart;
      }).length;
      const today = todayISO();
      const dayNames = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];
      return `
        <div class="calendar-month-view">
          <div class="calendar-month-toolbar">
            <div>
              <span class="badge">Měsíční přehled</span>
              <h3>${escapeHtml(calendarMonthTitle(month))}</h3>
              <p>${monthEventCount ? `${monthEventCount} událostí v měsíci` : 'Žádné události v tomto měsíci'}</p>
            </div>
            <div class="calendar-month-actions">
              <button class="ghost-btn" type="button" data-action="calendar-month-prev">‹</button>
              <button class="ghost-btn" type="button" data-action="calendar-month-today">Dnes</button>
              <button class="ghost-btn" type="button" data-action="calendar-month-next">›</button>
            </div>
          </div>
          <div class="calendar-grid" data-no-swipe role="table" aria-label="Kalendář ${escapeHtml(calendarMonthTitle(month))}">
            <div class="calendar-weekdays" role="row">
              ${dayNames.map((day) => `<div class="calendar-weekday" role="columnheader">${day}</div>`).join('')}
            </div>
            ${weeks.map((week, weekIndex) => `
              <div class="calendar-week-row" role="row" aria-label="Týden ${weekIndex + 1}">
                ${week.map((dayIso) => {
                  const dayEvents = eventsByDate[dayIso] || [];
                  const visible = dayEvents.slice(0, 3);
                  const hidden = dayEvents.length - visible.length;
                  const outside = !dayIso.startsWith(month);
                  const weekend = [0, 6].includes((new Date(`${dayIso}T00:00:00Z`)).getUTCDay());
                  const holiday = czechPublicHolidayName(dayIso);
                  return `
                    <div class="calendar-day ${outside ? 'outside-month' : ''} ${dayIso === today ? 'today' : ''} ${weekend ? 'weekend' : ''} ${holiday ? 'holiday' : ''}" role="cell">
                      <div class="calendar-day-head">
                        <span class="calendar-day-number">${calendarDayNumber(dayIso)}</span>
                        <span class="calendar-day-name">${escapeHtml(calendarDayHeaderText(dayIso))}</span>
                      </div>
                      <div class="calendar-day-events">
                        ${visible.map((event) => `
                          <button class="calendar-day-event ${event.cloudId ? 'cloud-event' : ''} ${dayIso !== String(event.date || '').slice(0, 10) ? 'continued-event' : ''}" type="button" data-action="calendar-event-detail" data-id="${escapeHtml(event.id || event.cloudId || '')}" title="${escapeHtml(event.title)}">
                            <strong>${dayIso !== String(event.date || '').slice(0, 10) ? '↳ ' : ''}${escapeHtml(event.title)}</strong>
                            <span>${escapeHtml(dayIso !== String(event.date || '').slice(0, 10) ? 'pokračuje' : calendarCellEventTime(event))}${event.location ? ` · ${escapeHtml(event.location)}` : ''}</span>
                          </button>
                        `).join('')}
                        ${hidden > 0 ? `<div class="calendar-more-events">+${hidden} další</div>` : ''}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    function renderCalendarSourceList(sources = getCalendarSources()) {
      if (!sources.length) {
        return renderEmptyCta({ icon: '📅', title: 'Zatím žádné zdroje', text: 'Přidej ruční domácí zdroj nebo připoj Google kalendář.', nav: 'calendar', tab: 'sources', label: 'Přidat zdroj' });
      }
      return `<details class="compact-edit-details calendar-source-list-details"><summary><span>Aktivní zdroje</span><em>${sources.length} zdrojů</em></summary><div class="list compact-list calendar-source-list">${sources.map((source) => {
        const linkedEvents = (getState().calendar || []).filter((event) => String(event.sourceId || '') === String(source.id || source.cloudId || '')).length;
        const google = normalizeCalendarSourceProvider(source.provider) === 'google';
        return `
          <div class="item calendar-source-item ${source.isEnabled === false ? 'muted-item' : ''}">
            <div class="item-top">
              <div class="item-title"><span class="calendar-source-icon">${escapeHtml(calendarSourceIcon(source.provider))}</span> ${escapeHtml(source.name)}</div>
              <span class="badge ${source.isEnabled === false ? '' : 'good'}">${source.isEnabled === false ? 'skrytý' : 'aktivní'}</span>
            </div>
            <div class="item-meta">${escapeHtml(calendarSourceProviderLabel(source.provider))}${source.providerCalendarId ? ` · ${escapeHtml(source.providerCalendarId)}` : ''}${source.lastSyncedAt ? ` · sync ${formatDateTime(source.lastSyncedAt)}` : ''}</div>
            ${source.note ? `<div class="item-meta">${escapeHtml(source.note)}</div>` : ''}
            <div class="cloud-status-grid compact-cloud-stats source-mini-stats">
              <div class="mini-stat"><span>Události</span><strong>${linkedEvents}</strong></div>
              <div class="mini-stat"><span>Typ</span><strong>${escapeHtml(calendarSourceProviderLabel(source.provider))}</strong></div>
              <div class="mini-stat"><span>Stav</span><strong>${source.isEnabled === false ? 'skrytý' : 'viditelný'}</strong></div>
            </div>
            <div class="item-actions">
              <button class="ghost-btn" type="button" data-action="calendar-toggle-source" data-source-id="${escapeHtml(source.id || source.cloudId || '')}" data-enabled="${source.isEnabled === false ? 'true' : 'false'}">${source.isEnabled === false ? 'Zobrazit' : 'Skrýt'}</button>
              ${google && getState().cloud?.householdId ? `<button class="ghost-btn" type="button" data-action="google-calendar-sync" data-source-id="${escapeHtml(source.cloudId || source.id || '')}">Sync</button>` : ''}
              <button class="danger-btn" type="button" data-action="calendar-delete-source" data-source-id="${escapeHtml(source.id || source.cloudId || '')}">Odebrat</button>
            </div>
          </div>
        `;
      }).join('')}</div></details>`;
    }

    function renderCalendar() {
      const sourceList = getCalendarSources();
      const enabledSourceIds = new Set(sourceList.filter((source) => source.isEnabled !== false).map((source) => String(source.id || source.cloudId || '')));
      const events = [...visibleCalendarEvents()].sort((a, b) => `${a.date || ''}${a.time || ''}`.localeCompare(`${b.date || ''}${b.time || ''}`));
      const todayEvents = events.filter((event) => event.date === todayISO());
      const upcoming = events.filter((event) => !event.date || event.date >= todayISO()).slice(0, 12);
      const soonCount = events.filter((event) => event.date && event.date > todayISO() && event.date <= dateOffsetISO(7)).length;
      const past = events.filter((event) => event.date && event.date < todayISO()).reverse().slice(0, 8);
      const hiddenEvents = (getState().calendar || []).filter((event) => event.sourceId && !enabledSourceIds.has(String(event.sourceId)) && getCalendarSource(event.sourceId)).length;
      const cloudReadyFlag = Boolean(getState().cloud?.householdId);
      const localOnly = events.filter((event) => !event.cloudId).length;
      const cloudCount = events.filter((event) => event.cloudId).length;
      const activeSources = sourceList.filter((source) => source.isEnabled !== false).length;
      const activeCalendarTab = getModuleTab('calendar', 'overview');
      return `
        ${renderSectionTabs('calendar', [
          { id: 'overview', label: 'Přehled', icon: '📅', count: todayEvents.length },
          { id: 'sources', label: 'Zdroje', icon: '🧩', count: sourceList.length },
          { id: 'add', label: 'Přidat', icon: '➕' },
          { id: 'history', label: 'Historie', icon: '🕘', count: past.length }
        ], 'overview')}
        <div class="grid two module-tabbed calendar-tab-${activeCalendarTab}" data-tab-area="calendar">
          <section class="card desktop-span-2 calendar-panel panel-overview">
            <div class="card-header">
              <div><h2>Přehled</h2></div>
              <span class="badge ${cloudCount ? 'good' : ''}">${events.length} událostí</span>
            </div>
            <details class="compact-edit-details calendar-overview-summary-details">
              <summary><span>Souhrn kalendáře</span><em>${events.length} událostí · ${activeSources}/${sourceList.length || 0} zdrojů</em></summary>
              <div class="cloud-status-grid compact-cloud-stats calendar-overview-stats">
                <div class="mini-stat"><span>Celkem</span><strong>${events.length}</strong></div>
                <div class="mini-stat"><span>Dnes</span><strong>${todayEvents.length}</strong></div>
                <div class="mini-stat"><span>Brzy</span><strong>${soonCount}</strong></div>
                <div class="mini-stat"><span>Zdroje</span><strong>${activeSources}/${sourceList.length || 0}</strong></div>
              </div>
            </details>
            ${hiddenEvents ? `<div class="inline-note">${hiddenEvents} událostí je schovaných, protože jejich kalendář je vypnutý.</div>` : ''}
            ${renderCalendarMonthGrid(events, getCalendarViewMonth())}
            ${events.length ? '' : renderEmptyCta({ icon: '📅', title: 'Kalendář je prázdný', text: 'Přidej první sdílenou domácí událost.', nav: 'calendar', tab: 'add', label: 'Přidat událost' })}
          </section>

          <section class="card desktop-span-2 calendar-panel panel-sources">
            <div class="card-header">
              <div><h2>Zdroje kalendáře</h2></div>
              <span class="badge ${cloudReadyFlag ? 'good' : ''}">${cloudReadyFlag ? 'cloud' : 'lokálně'}</span>
            </div>
            ${renderGoogleCalendarConnector(cloudReadyFlag, sourceList)}
            <details class="compact-edit-details calendar-manual-source-details" data-details-key="calendar-add-source" ${getDetailsOpen('calendar-add-source') ? 'open' : ''}>
              <summary><span>Přidat ruční zdroj kalendáře</span><em>domácí / veřejný Google iCal odkaz</em></summary>
              <form data-form="add-calendar-source" class="compact-form">
                <div class="form-grid two">
                  ${field('Název kalendáře', 'name', 'text', 'Rodina / Práce / Veřejný Google', true)}
                  ${selectField('Typ', 'provider', [['manual', 'Ruční domácí'], ['family', 'Rodinný'], ['work', 'Práce'], ['ical', 'Veřejný Google / iCal odkaz'], ['other', 'Jiný']])}
                  ${field('Veřejný odkaz / ID', 'providerCalendarId', 'text', 'volitelné, např. veřejný iCal odkaz')}
                  ${field('Barva', 'color', 'text', '#8b5cf6')}
                  ${field('Poznámka', 'note', 'text', 'volitelné')}
                </div>
                <div class="inline-note compact-note">Veřejný Google kalendář vlož jako veřejný iCal odkaz. Zatím se uloží jako zdroj; automatické načítání iCal událostí bude samostatný krok.</div>
                <div class="form-actions"><button class="primary-btn" type="submit">Přidat zdroj</button></div>
              </form>
            </details>
            ${renderCalendarSourceList(sourceList)}
          </section>

          <section class="card calendar-panel panel-add">
            <div class="card-header">
              <div><h2>Přidat událost</h2><p>Událost může být jen sdílená v domácnosti, bez Google kalendáře.</p></div>
              <span class="badge ${cloudCount ? 'good' : ''}">${cloudReadyFlag ? 'sdílené v domácnosti' : 'lokálně'}</span>
            </div>
            <form data-form="add-event">
              <div class="form-grid two">
                ${field('Název', 'title', 'text', 'Doktor / návštěva / výlet', true)}
                ${calendarSourceOptions('manual')}
                ${field('Datum', 'date', 'date', '', true, todayISO())}
                ${field('Konec vícedenní události', 'endDate', 'date', '')}
                ${field('Začátek', 'time', 'time', '')}
                ${field('Konec', 'endTime', 'time', '')}
                ${selectField('Typ', 'type', [['event', 'Událost'], ['family', 'Rodina'], ['shift', 'Směna'], ['reminder', 'Připomínka'], ['holiday', 'Volno/svátek'], ['other', 'Ostatní']])}
                ${field('Místo', 'location', 'text', 'volitelné')}
                ${field('Poznámka', 'note', 'text', 'volitelné')}
              </div>
              <div class="form-actions">
                <button class="primary-btn" type="submit">Uložit událost</button>
              </div>
            </form>
          </section>

          <section class="card desktop-span-2 calendar-panel panel-history">
            <div class="card-header"><div><h2>Historie</h2><p>Poslední starší události, aby hlavní přehled nebyl zbytečně dlouhý.</p></div></div>
            ${past.length ? renderEventList(past, true) : renderEmpty('Historie je zatím prázdná.')}
          </section>
        </div>
      `;
    }

    function renderEventList(events, withDelete = false) {
      return `<div class="list">${events.map((event) => `
        <div class="item">
          <div class="item-top">
            <div class="item-title">${escapeHtml(event.title)}</div>
            <span class="badge ${event.cloudId ? 'good' : ''}">${event.cloudId ? 'cloud' : 'lokálně'}</span>
          </div>
          <div class="item-meta">${escapeHtml(calendarEventMetaLabel(event, getNow()))} · ${escapeHtml(calendarSourceName(event.sourceId))}</div>
          ${withDelete ? `<div class="item-actions">${getState().cloud?.householdId && !event.cloudId ? `<button class="ghost-btn" type="button" data-action="cloud-sync-calendar" data-id="${event.id}">Odeslat</button>` : ''}<button class="danger-btn" type="button" data-action="delete-calendar" data-id="${event.id}">Smazat</button></div>` : ''}
        </div>
      `).join('')}</div>`;
    }

    function cloudCalendarPayload(event, userId, sourceId = null) {
      const start = buildCalendarDateTime(event.date, event.time, '00:00');
      const endDate = normalizeText(event.endDate) || event.date;
      const end = event.endTime || event.endDate ? buildCalendarDateTime(endDate, event.endTime || event.time || '23:59', event.time || '00:00') : null;
      return {
        household_id: getState().cloud.householdId,
        source_id: sourceId || event.sourceId || null,
        profile_id: event.profileId && String(event.profileId).startsWith('profile-') ? null : event.profileId || null,
        title: event.title || 'Událost',
        description: event.note || null,
        location: event.location || null,
        starts_at: start,
        ends_at: end,
        all_day: !event.time,
        event_type: normalizeCalendarType(event.type),
        status: 'confirmed',
        visibility: 'household',
        created_by: event.cloudId ? undefined : userId,
        updated_by: userId
      };
    }

    async function cloudLoadCalendarSources(showMessage = false) {
      const client = getSupabaseClient();
      if (!client || !getState().cloud?.householdId) {
        if (showMessage) showToast('Nejdřív napoj domácnost na cloud');
        return [];
      }
      const { data, error } = await client
        .from('calendar_sources')
        .select('id,household_id,profile_id,name,provider,provider_calendar_id,provider_connection_id,color,is_enabled,sync_enabled,last_synced_at,note,created_at')
        .eq('household_id', getState().cloud.householdId)
        .order('created_at', { ascending: true });
      if (error) {
        if (showMessage) showToast(error.message || 'Zdroje kalendáře se nepovedlo načíst');
        return getCalendarSources();
      }
      const sources = (data || []).map(mapCalendarSource);
      getState().calendarCloud = {
        ...(getState().calendarCloud || {}),
        sources,
        sourcesLoadedAt: new Date().toISOString()
      };
      touchState();
      saveState();
      if (sources.some((source) => normalizeCalendarSourceProvider(source.provider) === 'google')) {
        scheduleGoogleCalendarAutoSync('sources-loaded', { delay: showMessage ? 1800 : 9000 });
      }
      if (showMessage) {
        render();
        showToast('Zdroje kalendáře načtené');
      }
      return sources;
    }

    async function ensureManualCalendarSource() {
      const client = getSupabaseClient();
      if (!client || !getState().cloud?.householdId) return null;
      let sources = getCalendarSources();
      let cached = sources.find((source) => source.provider === 'manual' && source.isEnabled !== false);
      if (cached?.id) return cached.id;
      if (!sources.length) sources = await cloudLoadCalendarSources(false);
      cached = sources.find((source) => source.provider === 'manual' && source.isEnabled !== false);
      if (cached?.id) return cached.id;
      const user = await refreshCloudSession(false);
      if (!user) return null;
      const { data: existing, error: existingError } = await client
        .from('calendar_sources')
        .select('id,household_id,profile_id,name,provider,provider_calendar_id,provider_connection_id,color,is_enabled,sync_enabled,last_synced_at,note,created_at')
        .eq('household_id', getState().cloud.householdId)
        .eq('provider', 'manual')
        .limit(1);
      if (existingError) {
        showToast(existingError.message || 'Zdroj kalendáře se nepovedlo načíst');
        return null;
      }
      if (existing?.[0]?.id) {
        const source = mapCalendarSource(existing[0]);
        getState().calendarCloud = { ...(getState().calendarCloud || {}), sources: mergeCalendarSources(getCalendarSources(), [source]) };
        return source.id;
      }
      const { data, error } = await client.from('calendar_sources').insert({
        household_id: getState().cloud.householdId,
        name: 'Ruční kalendář',
        provider: 'manual',
        is_enabled: true,
        sync_enabled: false,
        created_by: user.id,
        updated_by: user.id
      }).select('id,household_id,profile_id,name,provider,provider_calendar_id,provider_connection_id,color,is_enabled,sync_enabled,last_synced_at,note,created_at').single();
      if (error) {
        showToast(error.message || 'Zdroj kalendáře se nepovedlo vytvořit');
        return null;
      }
      const source = mapCalendarSource(data);
      getState().calendarCloud = { ...(getState().calendarCloud || {}), sources: mergeCalendarSources(getCalendarSources(), [source]) };
      return source.id;
    }

    function mergeCalendarSources(current = [], incoming = []) {
      const map = new Map();
      [...current, ...incoming].forEach((source) => {
        const normalized = mapCalendarSource(source);
        const key = String(normalized.id || normalized.cloudId || normalized.name);
        map.set(key, normalized);
      });
      return [...map.values()].sort((a, b) => String(a.createdAt || '').localeCompare(String(b.createdAt || '')));
    }

    async function addCalendarSourceFromForm(data, form) {
      const source = mapCalendarSource({
        id: uid(),
        householdId: currentHouseholdId(),
        profileId: currentProfileId(),
        name: normalizeText(data.name),
        provider: normalizeCalendarSourceProvider(data.provider),
        providerCalendarId: normalizeText(data.providerCalendarId),
        color: normalizeText(data.color),
        isEnabled: true,
        syncEnabled: normalizeCalendarSourceProvider(data.provider) === 'google',
        note: normalizeText(data.note),
        createdAt: new Date().toISOString()
      });
      if (!source.name) return showToast('Doplň název kalendáře');
      const saved = await cloudAddCalendarSource(source);
      if (saved?.id) {
        source.id = saved.id;
        source.cloudId = saved.id;
      }
      getState().calendarCloud = { ...(getState().calendarCloud || {}), sources: mergeCalendarSources(getCalendarSources(), [source]) };
      touchState();
      saveState();
      form.reset();
      render();
      const google = source.provider === 'google';
      showToast(saved?.id ? (google ? 'Google zdroj připravený v cloudu' : 'Zdroj kalendáře uložen do cloudu') : 'Zdroj kalendáře uložen lokálně');
    }

    async function cloudAddCalendarSource(source) {
      const client = getSupabaseClient();
      if (!client || !getState().cloud?.householdId) return null;
      const user = await refreshCloudSession(false);
      if (!user) return null;
      const payload = {
        household_id: getState().cloud.householdId,
        profile_id: source.profileId && String(source.profileId).startsWith('profile-') ? null : source.profileId || null,
        name: source.name || 'Kalendář',
        provider: normalizeCalendarSourceProvider(source.provider),
        provider_calendar_id: source.providerCalendarId || null,
        color: source.color || null,
        is_enabled: source.isEnabled !== false,
        sync_enabled: normalizeCalendarSourceProvider(source.provider) === 'google' ? source.syncEnabled !== false : Boolean(source.syncEnabled),
        note: source.note || null,
        created_by: user.id,
        updated_by: user.id
      };
      const { data, error } = await client
        .from('calendar_sources')
        .insert(payload)
        .select('id,household_id,profile_id,name,provider,provider_calendar_id,provider_connection_id,color,is_enabled,sync_enabled,last_synced_at,note,created_at')
        .single();
      if (error) {
        showToast(error.message || 'Zdroj kalendáře se nepovedlo uložit do cloudu');
        return null;
      }
      return data;
    }

    async function cloudSyncLocalCalendarSources(showMessage = false) {
      if (!cloudReady()) return 0;
      const localSources = getCalendarSources().filter((source) => !source.cloudId);
      if (!localSources.length) {
        if (showMessage) showToast('Žádné lokální zdroje kalendáře k odeslání');
        return 0;
      }
      let count = 0;
      const savedSources = [];
      for (const source of localSources) {
        try {
          const saved = await cloudAddCalendarSource(source);
          if (saved?.id) {
            source.id = saved.id;
            source.cloudId = saved.id;
            savedSources.push(mapCalendarSource(saved));
            count += 1;
          }
        } catch (error) {
          console.warn('Cloud calendar source sync failed', error);
        }
      }
      getState().calendarCloud = { ...(getState().calendarCloud || {}), sources: mergeCalendarSources(getCalendarSources(), savedSources) };
      touchState();
      saveState();
      if (showMessage) showToast(`Odesláno zdrojů kalendáře: ${count}`);
      return count;
    }

    async function toggleCalendarSource(sourceId, enabled) {
      const source = getCalendarSource(sourceId);
      if (!source) return showToast('Zdroj kalendáře nenalezen');
      const nextEnabled = enabled !== undefined ? enabled : source.isEnabled === false;
      source.isEnabled = Boolean(nextEnabled);
      const client = getSupabaseClient();
      if (client && getState().cloud?.householdId && source.cloudId) {
        const user = await refreshCloudSession(false);
        const { error } = await client
          .from('calendar_sources')
          .update({ is_enabled: source.isEnabled, updated_by: user?.id || undefined })
          .eq('id', source.cloudId)
          .eq('household_id', getState().cloud.householdId);
        if (error) {
          showToast(error.message || 'Zdroj kalendáře se nepovedlo upravit');
          return;
        }
      }
      getState().calendarCloud = { ...(getState().calendarCloud || {}), sources: mergeCalendarSources(getCalendarSources(), [source]) };
      touchState();
      saveState();
      render();
      showToast(source.isEnabled ? 'Kalendář zobrazen' : 'Kalendář skrytý');
    }

    async function deleteCalendarSource(sourceId) {
      const source = getCalendarSource(sourceId);
      if (!source) return showToast('Zdroj kalendáře nenalezen');
      const label = source.name || 'kalendář';
      const ok = window.confirm(`Odebrat kalendář „${label}“ a jeho události z Domácnost+?`);
      if (!ok) return;

      const sourceKeys = [source.id, source.cloudId].filter(Boolean).map(String);
      const client = getSupabaseClient();
      if (client && getState().cloud?.householdId && source.cloudId) {
        const { error: eventsError } = await client
          .from('calendar_events')
          .delete()
          .eq('source_id', source.cloudId)
          .eq('household_id', getState().cloud.householdId);
        if (eventsError) {
          showToast(eventsError.message || 'Události kalendáře se nepovedlo odebrat');
          return;
        }
        const { error } = await client
          .from('calendar_sources')
          .delete()
          .eq('id', source.cloudId)
          .eq('household_id', getState().cloud.householdId);
        if (error) {
          showToast(error.message || 'Kalendář se nepovedlo odebrat');
          return;
        }
      }

      getState().calendarCloud = {
        ...(getState().calendarCloud || {}),
        sources: getCalendarSources().filter((item) => !sourceKeys.includes(String(item.id || '')) && !sourceKeys.includes(String(item.cloudId || ''))),
        sourcesLoadedAt: new Date().toISOString()
      };
      getState().calendar = (getState().calendar || []).filter((event) => !sourceKeys.includes(String(event.sourceId || '')));
      if (getState().calendarCloud?.googleCalendars?.length && source.providerCalendarId) {
        getState().calendarCloud.googleCalendars = getState().calendarCloud.googleCalendars.map((calendar) => String(calendar.id || '') === String(source.providerCalendarId) ? { ...calendar, selected: false } : calendar);
      }
      if (getState().cloud) getState().cloud.lastSyncAt = new Date().toISOString();
      touchState();
      saveState();
      render();
      showToast('Kalendář odebraný');
    }

    async function cloudAddCalendarEvent(event) {
      const client = getSupabaseClient();
      if (!client || !getState().cloud?.householdId) return null;
      const user = await refreshCloudSession(false);
      if (!user) return null;
      let sourceId = event.sourceId || '';
      let source = getCalendarSource(sourceId);
      if (source && !source.cloudId) {
        const savedSource = await cloudAddCalendarSource(source);
        if (savedSource?.id) {
          source.cloudId = savedSource.id;
          source.id = savedSource.id;
          sourceId = savedSource.id;
          getState().calendarCloud = { ...(getState().calendarCloud || {}), sources: mergeCalendarSources(getCalendarSources(), [source, mapCalendarSource(savedSource)]) };
        }
      }
      source = getCalendarSource(sourceId);
      if (source?.cloudId) sourceId = source.cloudId;
      if (sourceId === 'manual' || !sourceId || !getCalendarSource(sourceId)) {
        sourceId = await ensureManualCalendarSource();
      }
      const { data, error } = await client.from('calendar_events').insert(cloudCalendarPayload(event, user.id, sourceId)).select('id,source_id').single();
      if (error) {
        showToast(error.message || 'Událost se nepovedlo uložit do cloudu');
        return null;
      }
      event.cloudId = data.id;
      event.sourceId = data.source_id || sourceId || '';
      getState().cloud.lastSyncAt = new Date().toISOString();
      return data;
    }

    async function cloudDeleteCalendarEvent(event) {
      const client = getSupabaseClient();
      if (!client || !event?.cloudId || !getState().cloud?.householdId) return true;
      const { error } = await client.from('calendar_events').delete().eq('id', event.cloudId).eq('household_id', getState().cloud.householdId);
      if (error) {
        showToast(error.message || 'Cloud událost se nepovedlo smazat');
        return false;
      }
      getState().cloud.lastSyncAt = new Date().toISOString();
      return true;
    }

    async function cloudLoadCalendar(showMessage = true) {
      const client = getSupabaseClient();
      if (!client || !getState().cloud?.householdId) {
        if (showMessage) showToast('Nejdřív napoj domácnost na cloud');
        return false;
      }
      await cloudLoadCalendarSources(false);
      const { data, error } = await client
        .from('calendar_events')
        .select('id,source_id,title,description,location,starts_at,ends_at,all_day,event_type,created_at')
        .eq('household_id', getState().cloud.householdId)
        .neq('status', 'cancelled')
        .order('starts_at', { ascending: true });
      if (error) {
        showToast(error.message || 'Kalendář se nepovedlo načíst');
        return false;
      }
      const localOnly = getState().calendar.filter((event) => !event.cloudId);
      const cloudItems = (data || []).map((item) => {
        const start = splitCalendarDateTime(item.starts_at, { allDay: item.all_day });
        const end = splitCalendarDateTime(item.ends_at, { allDay: item.all_day });
        return {
          id: getState().calendar.find((event) => event.cloudId === item.id)?.id || `event-cloud-${item.id}`,
          cloudId: item.id,
          sourceId: item.source_id || '',
          householdId: currentHouseholdId(),
          profileId: currentProfileId(),
          createdAt: item.created_at || new Date().toISOString(),
          title: item.title || 'Událost',
          date: start.date,
          time: item.all_day ? '' : start.time,
          endDate: end.date && end.date !== start.date ? end.date : '',
          endTime: item.all_day ? '' : end.time || '',
          type: normalizeCalendarType(item.event_type),
          location: item.location || '',
          note: item.description || ''
        };
      });
      getState().calendar = [...cloudItems, ...localOnly];
      getState().calendarCloud = { ...(getState().calendarCloud || {}), loadedAt: new Date().toISOString(), sourcesLoadedAt: getState().calendarCloud?.sourcesLoadedAt || new Date().toISOString() };
      touchState();
      saveState();
      render();
      if (showMessage) showToast('Cloud kalendář načten');
      return true;
    }

    async function cloudSyncCalendarById(id) {
      const event = getState().calendar.find((entry) => entry.id === id);
      if (!event) return;
      await cloudAddCalendarEvent(event);
      touchState();
      saveState();
      render();
      showToast(event.cloudId ? 'Událost odeslána do cloudu' : 'Událost zůstala lokálně');
    }

    async function cloudSyncLocalCalendar() {
      const local = getState().calendar.filter((event) => !event.cloudId);
      if (!local.length) return showToast('Žádné lokální události k odeslání');
      let count = 0;
      for (const event of local) {
        const saved = await cloudAddCalendarEvent(event);
        if (saved?.id) count += 1;
      }
      touchState();
      saveState();
      render();
      showToast(`Odesláno událostí: ${count}`);
    }

    async function addEventFromForm(data, form) {
      const event = {
        id: uid(),
        householdId: currentHouseholdId(),
        profileId: currentProfileId(),
        createdAt: new Date().toISOString(),
        title: normalizeText(data.title),
        date: normalizeText(data.date),
        endDate: normalizeText(data.endDate),
        time: normalizeText(data.time),
        endTime: normalizeText(data.endTime),
        type: normalizeCalendarType(data.type),
        sourceId: normalizeText(data.sourceId) || 'manual',
        location: normalizeText(data.location),
        note: normalizeText(data.note)
      };
      if (!event.title || !event.date) return showToast('Doplň název a datum');
      const saved = await cloudAddCalendarEvent(event);
      if (saved?.id) event.cloudId = saved.id;
      getState().calendar.push(event);
      touchState();
      saveState();
      form.reset();
      render();
      showToast(event.cloudId ? 'Událost uložena do cloudu' : 'Událost uložena lokálně');
    }

    async function deleteCalendarEvent(id) {
      const event = getState().calendar.find((entry) => entry.id === id);
      if (!event) return;
      const ok = await cloudDeleteCalendarEvent(event);
      if (!ok) return;
      getState().calendar = getState().calendar.filter((entry) => entry.id !== id);
      touchState();
      saveState();
      render();
      showToast('Událost smazána');
    }

    // ---------- Google OAuth + edge (ČÁST B) ----------

    function googleCalendarConnection() {
      return getState().calendarCloud?.googleConnection || null;
    }

    function googleCalendarItems() {
      return Array.isArray(getState().calendarCloud?.googleCalendars) ? getState().calendarCloud.googleCalendars : [];
    }

    function googleCalendarStatusLabel(connection = googleCalendarConnection()) {
      const status = String(connection?.status || '').toLowerCase();
      const tokenState = String(connection?.tokenState || '').toLowerCase();
      if (status === 'connected' && tokenState === 'missing') return 'účet přihlášený, token chybí';
      if (status === 'connected' && tokenState === 'ready') return 'token uložený';
      if (status === 'connected') return 'připojeno';
      if (status === 'oauth_pending') return 'čeká na dokončení OAuth';
      if (status === 'error') return 'chyba připojení';
      if (status === 'disconnected') return 'odpojeno';
      return 'nepřipojeno';
    }

    function googleCalendarLastError() {
      return getState().calendarCloud?.googleLastError || googleCalendarConnection()?.lastError || null;
    }

    function googleCalendarStatusNote(connection = googleCalendarConnection()) {
      const lastError = googleCalendarLastError();
      const status = String(connection?.status || '').toLowerCase();
      const tokenState = String(connection?.tokenState || '').toLowerCase();
      const reason = String(lastError?.code || lastError?.reason || connection?.lastError || '').toLowerCase();
      const message = lastError?.message || lastError?.error || connection?.lastError || '';
      if (status === 'connected' && tokenState === 'ready') return { tone: 'good', title: 'Google kalendář je připojený', text: 'Můžeš načíst dostupné kalendáře a vybrat, které se mají zobrazovat v domácnosti.' };
      if (status === 'oauth_pending') return { tone: 'warn', title: 'Připojení čeká na dokončení', text: 'Dokonči přihlášení u Googlu. Když se stav nezmění, spusť znovupřipojení.' };
      if (status === 'connected' && tokenState === 'missing') return { tone: 'warn', title: 'Google kalendář je potřeba znovu připojit', text: 'Přihlášení do aplikace nestačí pro kalendář. Spusť znovu připojení Google kalendáře.' };
      if (['missing_google_token', 'token_store_failed', 'missing_encryption_key', 'redirect_uri_mismatch', 'missing_calendar_scope'].includes(reason)) return { tone: 'danger', title: 'Připojení Google kalendáře selhalo', text: message || 'Zkus připojení spustit znovu.' };
      if (status === 'error' || message) return { tone: 'danger', title: 'Google kalendář má chybu', text: message || 'Zkus znovu spustit připojení Google kalendáře.' };
      return { tone: '', title: 'Google kalendář není připojený', text: 'Rozbal Google kalendář a spusť připojení.' };
    }

    function isGoogleCalendarSelected(calendarId, sourceList = getCalendarSources()) {
      const id = String(calendarId || '');
      return Boolean(id && sourceList.some((source) => normalizeCalendarSourceProvider(source.provider) === 'google' && String(source.providerCalendarId || '') === id));
    }

    function renderGoogleCalendarConnector(cloudReadyFlag, sourceList = getCalendarSources()) {
      const connection = googleCalendarConnection();
      const calendars = googleCalendarItems();
      const connected = String(connection?.status || '').toLowerCase() === 'connected';
      const tokenReady = String(connection?.tokenState || '').toLowerCase() === 'ready';
      const statusNote = googleCalendarStatusNote(connection);
      const googleSources = sourceList.filter((source) => normalizeCalendarSourceProvider(source.provider) === 'google');
      const detailsOpen = getGoogleCalendarDetailsOpen();
      return `
        <details class="compact-edit-details google-calendar-connector calendar-google-details" ${detailsOpen ? 'open' : ''}>
          <summary><span>Google kalendář</span><em>${escapeHtml(googleCalendarStatusLabel(connection))}</em></summary>
          <div class="google-calendar-connector-body">
            <div class="cloud-status-grid compact-cloud-stats google-calendar-stats">
              <div class="mini-stat"><span>Účet</span><strong>${escapeHtml(connection?.googleAccountEmail || connection?.email || '—')}</strong></div>
              <div class="mini-stat"><span>Vybrané</span><strong>${googleSources.length}</strong></div>
              <div class="mini-stat"><span>Dostupné</span><strong>${calendars.length || '—'}</strong></div>
            </div>
            <div class="form-actions connector-actions">
              ${cloudReadyFlag ? `<button class="primary-btn" type="button" data-action="google-calendar-reconnect">${connected ? 'Znovu připojit Google kalendář' : 'Připojit Google kalendář'}</button>` : '<span class="badge">nejdřív online účet</span>'}
              ${cloudReadyFlag ? `<button class="ghost-btn" type="button" data-action="google-calendar-list-calendars" ${tokenReady ? '' : 'aria-describedby="google-calendar-state-note"'}>Načíst kalendáře</button>` : ''}
              ${cloudReadyFlag && googleSources.length ? '<button class="ghost-btn" type="button" data-action="google-calendar-sync">Spustit sync</button>' : ''}
              ${cloudReadyFlag && connected ? '<button class="danger-btn" type="button" data-action="google-calendar-disconnect">Odpojit Google</button>' : ''}
            </div>
            ${cloudReadyFlag ? `<div id="google-calendar-state-note" class="inline-note google-calendar-state-note ${statusNote.tone ? `is-${statusNote.tone}` : ''}"><strong>${escapeHtml(statusNote.title)}</strong><span>${escapeHtml(statusNote.text)}</span></div>` : '<div class="inline-note">Google kalendář funguje jen v online domácnosti.</div>'}
            ${calendars.length ? `
              <form data-form="google-calendar-save-sources" class="google-calendar-picker">
                <div class="google-calendar-grid">
                  ${calendars.map((calendar) => {
                    const checked = isGoogleCalendarSelected(calendar.id, sourceList) || calendar.selected;
                    return `
                      <label class="google-calendar-option ${checked ? 'active' : ''}">
                        <input type="checkbox" name="googleCalendarIds" value="${escapeHtml(calendar.id)}" ${checked ? 'checked' : ''}>
                        <span>
                          <strong>${escapeHtml(calendar.summary || calendar.name || 'Google kalendář')}</strong>
                          <em>${calendar.primary ? 'hlavní' : escapeHtml(calendar.id || '')}${calendar.accessRole ? ` · ${escapeHtml(calendar.accessRole)}` : ''}</em>
                        </span>
                      </label>
                    `;
                  }).join('')}
                </div>
                <div class="form-actions">
                  <button class="primary-btn" type="submit">Uložit vybrané kalendáře</button>
                </div>
              </form>
            ` : ''}
          </div>
        </details>
      `;
    }

    function normalizeGoogleCalendarItem(item = {}) {
      return {
        id: String(item.id || item.calendarId || ''),
        summary: item.summary || item.name || 'Google kalendář',
        description: item.description || '',
        primary: Boolean(item.primary),
        accessRole: item.accessRole || item.access_role || '',
        backgroundColor: item.backgroundColor || item.background_color || '',
        foregroundColor: item.foregroundColor || item.foreground_color || '',
        selected: Boolean(item.selected)
      };
    }

    function rememberGoogleCalendarError(payload = {}) {
      getState().calendarCloud = {
        ...(getState().calendarCloud || {}),
        googleLastError: {
          code: payload.code || payload.errorCode || '',
          message: payload.error || payload.message || '',
          at: new Date().toISOString(),
          needsOAuthReconnect: Boolean(payload.needsOAuthReconnect || payload.needsGoogleLogin || payload.fallbackAvailable)
        }
      };
      touchState();
      saveState();
    }

    function googleCalendarNeedsOAuthReconnect(payload = {}) {
      const code = String(payload.code || payload.errorCode || payload.reason || '').toLowerCase();
      const message = String(payload.error || payload.message || '').toLowerCase();
      return Boolean(payload.needsOAuthReconnect || payload.needsGoogleLogin || payload.fallbackAvailable)
        || ['missing_provider_token', 'missing_google_token', 'google_token_missing', 'token_not_available', 'missing_calendar_scope', 'token_store_failed'].includes(code)
        || message.includes('google token is not available')
        || message.includes('chybí google token')
        || message.includes('nepředalo kalendářový token');
    }

    function markGoogleCalendarMissingToken(message = 'Google účet je přihlášený, ale kalendářový token chybí.') {
      getState().calendarCloud = {
        ...(getState().calendarCloud || {}),
        googleConnection: {
          ...(getState().calendarCloud?.googleConnection || {}),
          status: 'error',
          tokenState: 'missing',
          lastError: message
        }
      };
      touchState();
      saveState();
    }

    async function startGoogleCalendarOAuthReconnect(reason = '', { force = false } = {}) {
      const attempted = sessionStorage.getItem(GOOGLE_CALENDAR_RECONNECT_FLAG) === '1';
      if (attempted && !force) {
        showToast('Automatické znovupřipojení už proběhlo. Další pokus spusť ručně tlačítkem Znovu připojit Google kalendář.');
        return false;
      }
      sessionStorage.setItem(GOOGLE_CALENDAR_RECONNECT_FLAG, '1');
      showToast(reason || 'Spouštím čisté znovupřipojení Google kalendáře.');
      await googleCalendarStart({ cleanup: true });
      return true;
    }

    async function readFunctionErrorMessage(error, fallback = 'Google backend zatím není připravený') {
      if (!error) return fallback;
      const context = error.context;
      try {
        if (context?.clone && typeof context.clone === 'function') {
          const cloned = context.clone();
          const body = await cloned.json().catch(() => null);
          const message = body?.error || body?.message || body?.hint;
          if (message) return message;
        }
        if (context?.json && typeof context.json === 'function') {
          const body = await context.json().catch(() => null);
          const message = body?.error || body?.message || body?.hint;
          if (message) return message;
        }
        if (context?.text && typeof context.text === 'function') {
          const text = await context.text().catch(() => '');
          if (text) return text.slice(0, 220);
        }
      } catch (_) {
        // Supabase FunctionsHttpError nemusí vždy dovolit přečíst body odpovědi.
      }
      return error.message || fallback;
    }

    async function invokeGoogleCalendarFunction(functionName, body = {}, showMessage = true) {
      const client = getSupabaseClient();
      if (!client?.functions?.invoke) {
        if (showMessage) showToast('Supabase funkce nejsou dostupné');
        return null;
      }
      const user = await refreshCloudSession(false);
      if (!user) {
        if (showMessage) showToast('Nejdřív se přihlas');
        return null;
      }
      let households = await cloudLoadHouseholds(false);
      if (!households.length) {
        resetLocalWorkspaceForCloudUser(user, { force: true });
        const createdHouseholdId = await bootstrapCloudHousehold(false);
        if (!createdHouseholdId) {
          if (showMessage) showToast('Nejdřív vytvoř domácnost pro tento Google účet');
          return null;
        }
        households = await cloudLoadHouseholds(false);
      }
      if (!cloudReady()) {
        if (showMessage) showToast('Google účet zatím nemá aktivní domácnost');
        return null;
      }
      const payload = {
        householdId: getState().cloud.householdId,
        profileId: currentProfileId(),
        ...body
      };
      try {
        const { data, error } = await client.functions.invoke(functionName, { body: payload });
        if (error || data?.error || data?.ok === false) {
          const payloadError = data || {};
          const message = payloadError?.error || payloadError?.message || await readFunctionErrorMessage(error, 'Google backend zatím není připravený');
          console.warn(`${functionName} failed`, error || payloadError?.error || payloadError);
          rememberGoogleCalendarError({ ...payloadError, error: message });
          if (showMessage) showToast(message);
          return null;
        }
        return data || {};
      } catch (error) {
        console.warn(`${functionName} failed`, error);
        const message = await readFunctionErrorMessage(error, 'Google backend zatím není nasazený nebo nemá credentials');
        if (showMessage) showToast(message);
        return null;
      }
    }

    function googleCalendarSourceSyncMs(source = {}) {
      const raw = source.lastSyncedAt || source.last_synced_at || getState().calendarCloud?.googleLastSyncAt || '';
      const ms = raw ? Date.parse(raw) : 0;
      return Number.isFinite(ms) ? ms : 0;
    }

    function googleCalendarAutoSyncNeeded(sources = getCalendarSources()) {
      const googleSources = (sources || []).filter((source) => normalizeCalendarSourceProvider(source.provider) === 'google' && source.isEnabled !== false);
      if (!googleSources.length) return false;
      const connection = googleCalendarConnection();
      const status = String(connection?.status || '').toLowerCase();
      const tokenState = String(connection?.tokenState || '').toLowerCase();
      if (status === 'connected' && tokenState === 'missing') return false;
      const nowMs = Date.now();
      return googleSources.some((source) => {
        const syncedMs = googleCalendarSourceSyncMs(source);
        return !syncedMs || nowMs - syncedMs > GOOGLE_CALENDAR_AUTO_SYNC_MAX_AGE_MS;
      });
    }

    function scheduleGoogleCalendarAutoSync(reason = 'auto', options = {}) {
      if (googleCalendarAutoSyncTimer || googleCalendarAutoSyncRunning || !cloudReady()) return;
      googleCalendarAutoSyncTimer = runWhenUiQuiet(async () => {
        googleCalendarAutoSyncTimer = null;
        if (googleCalendarAutoSyncRunning || !cloudReady()) return;
        googleCalendarAutoSyncRunning = true;
        try {
          let sources = getCalendarSources();
          if (!sources.length || options.forceLoadSources) sources = await cloudLoadCalendarSources(false);
          if (options.force || googleCalendarAutoSyncNeeded(sources)) {
            await googleCalendarSync('', { showMessage: false, auto: true, reason });
          }
        } catch (error) {
          console.warn('Google Calendar auto sync failed', reason, error);
        } finally {
          googleCalendarAutoSyncRunning = false;
        }
      }, { delay: Number(options.delay || 12000), quietMs: Number(options.quietMs || 2200), timeout: Number(options.timeout || 12000) });
    }

    async function googleCalendarStart(options = {}) {
      const data = await invokeGoogleCalendarFunction('google-calendar-start', { returnTo: APP_PUBLIC_URL, cleanup: options.cleanup !== false }, true);
      if (data?.connection) {
        getState().calendarCloud = { ...(getState().calendarCloud || {}), googleConnection: data.connection, googleLastError: null };
        touchState();
        saveState();
      }
      if (data?.authUrl) {
        window.location.href = data.authUrl;
        return;
      }
      showToast('Nepřišla OAuth adresa. Zkontroluj Edge Function secrets.');
    }

    async function googleCalendarListCalendars(showMessage = true) {
      const data = await invokeGoogleCalendarFunction('google-calendar-list-calendars', {}, showMessage);
      if (!data) {
        const lastError = getState().calendarCloud?.googleLastError || {};
        if (googleCalendarNeedsOAuthReconnect(lastError)) {
          markGoogleCalendarMissingToken(lastError.message || lastError.error || 'Google účet je vidět, ale kalendářový token chybí.');
          render();
          if (showMessage) showToast('Kalendářový token chybí. Použij tlačítko Znovu připojit Google kalendář.');
        }
        return [];
      }
      const calendars = (data.calendars || data.items || []).map(normalizeGoogleCalendarItem).filter((calendar) => calendar.id);
      getState().calendarCloud = {
        ...(getState().calendarCloud || {}),
        googleConnection: data.connection ? { ...data.connection, tokenState: data.connection.tokenState || 'ready' } : getState().calendarCloud?.googleConnection || null,
        googleCalendars: calendars,
        googleCalendarsLoadedAt: new Date().toISOString(),
        googleLastError: null
      };
      touchState();
      saveState();
      sessionStorage.removeItem(GOOGLE_CALENDAR_CALLBACK_AUTOLOAD_FLAG);
      render();
      if (showMessage) showToast(calendars.length ? `Načteno Google kalendářů: ${calendars.length}` : 'Google účet nemá dostupné kalendáře');
      return calendars;
    }

    async function saveGoogleCalendarSourcesFromForm(form) {
      if (!form) return;
      const checkedIds = [...form.querySelectorAll('input[name="googleCalendarIds"]:checked')].map((input) => input.value);
      if (!checkedIds.length) return showToast('Vyber aspoň jeden Google kalendář');
      const calendars = googleCalendarItems().filter((calendar) => checkedIds.includes(calendar.id));
      const data = await invokeGoogleCalendarFunction('google-calendar-save-sources', { calendars }, true);
      if (!data) return;
      const savedSources = (data.sources || []).map(mapCalendarSource);
      getState().calendarCloud = {
        ...(getState().calendarCloud || {}),
        sources: mergeCalendarSources(getCalendarSources(), savedSources),
        googleConnection: data.connection || getState().calendarCloud?.googleConnection || null
      };
      touchState();
      saveState();
      render();
      scheduleGoogleCalendarAutoSync('sources-saved', { delay: 1800, force: true });
      showToast(savedSources.length ? `Uloženo Google kalendářů: ${savedSources.length}` : 'Výběr Google kalendářů uložen');
    }

    async function googleCalendarSync(sourceId = '', options = {}) {
      const showMessage = options.showMessage !== false;
      const cleanSourceId = normalizeText(sourceId);
      let sources = getCalendarSources();
      if (!sources.length && getState().cloud?.householdId) sources = await cloudLoadCalendarSources(false);
      const googleSources = sources.filter((source) => normalizeCalendarSourceProvider(source.provider) === 'google' && source.isEnabled !== false);
      const body = {};

      if (cleanSourceId) {
        const source = getCalendarSource(cleanSourceId) || googleSources.find((item) => [item.id, item.cloudId].filter(Boolean).map(String).includes(cleanSourceId));
        if (!source || normalizeCalendarSourceProvider(source.provider) !== 'google') { if (showMessage) showToast('Google kalendář nenalezen'); return false; }
        body.sourceId = source.cloudId || source.id;
        body.sourceIds = [source.cloudId || source.id].filter(Boolean);
        body.calendarIds = [source.providerCalendarId].filter(Boolean);
      } else if (googleSources.length) {
        body.sourceIds = googleSources.map((source) => source.cloudId || source.id).filter(Boolean);
        body.calendarIds = googleSources.map((source) => source.providerCalendarId).filter(Boolean);
      }

      const data = await invokeGoogleCalendarFunction('google-calendar-sync', body, showMessage);
      if (!data) return false;
      const syncedSources = (data.sources || []).map(mapCalendarSource);
      getState().calendarCloud = {
        ...(getState().calendarCloud || {}),
        sources: syncedSources.length ? mergeCalendarSources(getCalendarSources(), syncedSources) : getCalendarSources(),
        googleConnection: data.connection || getState().calendarCloud?.googleConnection || null,
        googleLastSyncAt: new Date().toISOString()
      };
      await cloudLoadCalendar(false);
      requestRender();
      if (showMessage) showToast(`Google sync hotový${Number.isFinite(data.eventsUpserted) ? ` · ${data.eventsUpserted} událostí` : ''}`);
      return true;
    }

    async function googleCalendarDisconnect() {
      const data = await invokeGoogleCalendarFunction('google-calendar-disconnect', {}, true);
      if (!data) return;
      getState().calendarCloud = {
        ...(getState().calendarCloud || {}),
        googleConnection: data.connection || { ...(getState().calendarCloud?.googleConnection || {}), status: 'disconnected' },
        googleCalendars: []
      };
      await cloudLoadCalendarSources(false);
      render();
      showToast('Google kalendář odpojený');
    }

    return {
      // dashboard / čtení
      upcomingCalendarEvents,
      calendarEventIsRunning,
      sortCalendarEventsByStart,
      calendarEventStartMs,
      calendarEventTimeLabel,
      calendarEventMetaLabel,
      visibleCalendarEvents,
      getCalendarSources,
      normalizeCalendarSourceProvider,
      getCalendarSource,
      mapCalendarSource,
      mergeCalendarSources,
      // render
      renderCalendar,
      renderCalendarEventDetailModal,
      renderEventList,
      findCalendarEventById,
      shiftCalendarMonth,
      // cloud (volané z realtime / cloudLoadAllModules / nav)
      cloudLoadCalendar,
      cloudLoadCalendarSources,
      cloudSyncLocalCalendar,
      cloudSyncLocalCalendarSources,
      cloudSyncCalendarById,
      // handlery
      addEventFromForm,
      deleteCalendarEvent,
      addCalendarSourceFromForm,
      toggleCalendarSource,
      deleteCalendarSource,
      // Google OAuth + edge (ČÁST B) – volané z app.js (boot, handlery, návrat z OAuth)
      googleCalendarConnection,
      googleCalendarItems,
      googleCalendarLastError,
      googleCalendarStart,
      googleCalendarListCalendars,
      googleCalendarSync,
      googleCalendarDisconnect,
      startGoogleCalendarOAuthReconnect,
      scheduleGoogleCalendarAutoSync,
      saveGoogleCalendarSourcesFromForm,
      rememberGoogleCalendarError,
      renderGoogleCalendarConnector,
      normalizeGoogleCalendarItem
    };
  }

  window.DomacnostCalendar = { createCalendar };
})();
