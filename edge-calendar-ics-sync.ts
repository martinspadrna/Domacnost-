// Domácnost+ - ICS/iCal kalendář bez dalšího přihlášení: uživatel v kalendářové aplikaci
// vezme "tajný" nebo "veřejný" iCal odkaz kalendáře, uloží
// ho jako zdroj (provider='ical', provider_calendar_id=URL) a tahle funkce ho
// pravidelně stáhne a naparsuje - žádný krátkodobý přihlašovací token.
//
// Samostatný soubor bez sdílených importů, ať deploy nezávisí na multi-file importu.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "content-type": "application/json; charset=utf-8" } });
}

function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (error && typeof error === 'object') {
    const anyError = error as Record<string, unknown>;
    return String(anyError.message || anyError.details || anyError.hint || anyError.code || JSON.stringify(anyError));
  }
  return String(error);
}

function requireEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing env ${name}`);
  return value;
}

function serviceClient() {
  return createClient(requireEnv("SUPABASE_URL"), requireEnv("SUPABASE_SERVICE_ROLE_KEY"), { auth: { persistSession: false, autoRefreshToken: false } });
}

async function readBody(req: Request) {
  if (req.method === 'GET') return {} as Record<string, unknown>;
  try { return await req.json(); } catch (_) { return {}; }
}

async function getUserFromRequest(req: Request, supabase = serviceClient()) {
  const jwt = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "").trim();
  if (!jwt) throw new Error("Missing auth token");
  const { data, error } = await supabase.auth.getUser(jwt);
  if (error || !data?.user) throw new Error("Invalid auth token");
  return data.user;
}

async function assertHouseholdMember(supabase: ReturnType<typeof serviceClient>, householdId: string, userId: string) {
  if (!householdId) throw new Error("Missing householdId");
  const { data, error } = await supabase.from("household_members").select("role,status").eq("household_id", householdId).eq("user_id", userId).eq("status", "active").maybeSingle();
  if (error || !data) throw new Error("No access to household");
}

type SupabaseClient = ReturnType<typeof serviceClient>;

function uniqueClean(values: unknown[]) {
  return [...new Set(values.map((item) => String(item || '').trim()).filter(Boolean))];
}

function bodyArray(value: unknown) {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

async function selectedIcsSources(supabase: SupabaseClient, householdId: string, body: Record<string, unknown>) {
  const explicitSourceIds = uniqueClean([...bodyArray(body.sourceIds), ...bodyArray(body.sourceId)]);
  let query = supabase
    .from('calendar_sources')
    .select('id,household_id,profile_id,name,provider,provider_calendar_id,color,is_enabled,sync_enabled,last_synced_at,note,created_at')
    .eq('household_id', householdId)
    .eq('provider', 'ical');

  if (explicitSourceIds.length) query = query.in('id', explicitSourceIds);
  else query = query.eq('sync_enabled', true);

  const { data, error } = await query;
  if (error) throw error;

  return (data || [])
    .filter((row: any) => row.is_enabled !== false)
    .filter((row: any) => explicitSourceIds.length || row.sync_enabled !== false)
    .filter((row: any) => /^https?:\/\//i.test(String(row.provider_calendar_id || '')));
}

// ---------- ICS parsing (RFC 5545, jen běžně používaná podmnožina) ----------

function unfoldIcsLines(raw: string): string[] {
  // Řádky delší než 75 oktetů se v ICS "skládají" na další řádek s úvodní
  // mezerou/tabem - to je potřeba nejdřív spojit zpátky, jinak se property
  // rozseká napůl.
  const lines = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  const out: string[] = [];
  for (const line of lines) {
    if ((line.startsWith(' ') || line.startsWith('\t')) && out.length) {
      out[out.length - 1] += line.slice(1);
    } else if (line.trim()) {
      out.push(line);
    }
  }
  return out;
}

function unescapeIcsText(value: string) {
  return value
    .replace(/\\n/gi, '\n')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\');
}

function parseIcsLine(line: string): { name: string; params: Record<string, string>; value: string } {
  const colonIndex = line.indexOf(':');
  if (colonIndex === -1) return { name: line.trim().toUpperCase(), params: {}, value: '' };
  const head = line.slice(0, colonIndex);
  const value = line.slice(colonIndex + 1);
  const parts = head.split(';');
  const name = (parts.shift() || '').trim().toUpperCase();
  const params: Record<string, string> = {};
  for (const part of parts) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;
    params[part.slice(0, eq).trim().toUpperCase()] = part.slice(eq + 1).trim();
  }
  return { name, params, value };
}

type IcsDateTime = { iso: string; allDay: boolean };

// Deno (Supabase edge runtime) má plnou ICU/Intl data - offset konkrétní IANA
// zóny v konkrétní chvíli se dá spočítat i bez timezone knihovny: naformátuj
// stejný okamžik jako UTC i jako lokální čas té zóny a rozdíl je offset.
function tzOffsetMinutes(utcMs: number, timeZone: string): number {
  try {
    const dtf = new Intl.DateTimeFormat('en-US', {
      timeZone, hour12: false,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    const parts = dtf.formatToParts(new Date(utcMs));
    const map: Record<string, string> = {};
    for (const part of parts) map[part.type] = part.value;
    const asUtc = Date.UTC(
      Number(map.year), Number(map.month) - 1, Number(map.day),
      Number(map.hour) === 24 ? 0 : Number(map.hour), Number(map.minute), Number(map.second)
    );
    return Math.round((asUtc - utcMs) / 60000);
  } catch (_) {
    return 0;
  }
}

function localPartsToUtcMs(y: number, mo: number, d: number, h: number, mi: number, s: number, timeZone: string): number {
  // Naivní UTC odhad, pak dorovnání o offset zóny v tom odhadnutém čase
  // (funguje spolehlivě mimo DST přechodovou hodinu, což pro kalendářové
  // připomínky stačí).
  const guessUtc = Date.UTC(y, mo, d, h, mi, s);
  const offsetMin = tzOffsetMinutes(guessUtc, timeZone);
  return guessUtc - offsetMin * 60000;
}

function parseIcsDate(prop: { params: Record<string, string>; value: string }, fallbackTimeZone = 'Europe/Prague'): IcsDateTime | null {
  const raw = prop.value.trim();
  if (!raw) return null;
  const isDateOnly = prop.params.VALUE === 'DATE' || /^\d{8}$/.test(raw);
  const match = raw.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/);
  if (!match) return null;
  const [, yStr, moStr, dStr, hStr, miStr, sStr, zFlag] = match;
  const y = Number(yStr); const mo = Number(moStr) - 1; const d = Number(dStr);
  if (isDateOnly || !hStr) {
    return { iso: `${yStr}-${moStr}-${dStr}T00:00:00Z`, allDay: true };
  }
  const h = Number(hStr); const mi = Number(miStr); const s = Number(sStr);
  let utcMs: number;
  if (zFlag) utcMs = Date.UTC(y, mo, d, h, mi, s);
  else utcMs = localPartsToUtcMs(y, mo, d, h, mi, s, prop.params.TZID || fallbackTimeZone);
  return { iso: new Date(utcMs).toISOString(), allDay: false };
}

type IcsEvent = {
  uid: string;
  summary: string;
  description: string;
  location: string;
  status: string;
  start: IcsDateTime;
  end: IcsDateTime | null;
  rrule: Record<string, string> | null;
  exdates: string[];
  recurrenceId: string | null;
  lastModified: string;
};

function parseRrule(value: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const part of value.split(';')) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;
    out[part.slice(0, eq).trim().toUpperCase()] = part.slice(eq + 1).trim();
  }
  return out;
}

function parseIcs(raw: string): IcsEvent[] {
  const lines = unfoldIcsLines(raw);
  const events: IcsEvent[] = [];
  let current: Partial<IcsEvent> | null = null;
  let exdates: string[] = [];

  for (const rawLine of lines) {
    const { name, params, value } = parseIcsLine(rawLine);
    if (name === 'BEGIN' && value.trim().toUpperCase() === 'VEVENT') {
      current = {};
      exdates = [];
      continue;
    }
    if (name === 'END' && value.trim().toUpperCase() === 'VEVENT') {
      if (current && current.uid && current.start) {
        events.push({
          uid: current.uid,
          summary: current.summary || '(bez názvu)',
          description: current.description || '',
          location: current.location || '',
          status: current.status || 'CONFIRMED',
          start: current.start,
          end: current.end || null,
          rrule: current.rrule || null,
          exdates,
          recurrenceId: current.recurrenceId || null,
          lastModified: current.lastModified || ''
        });
      }
      current = null;
      continue;
    }
    if (!current) continue;
    switch (name) {
      case 'UID': current.uid = value.trim(); break;
      case 'SUMMARY': current.summary = unescapeIcsText(value); break;
      case 'DESCRIPTION': current.description = unescapeIcsText(value); break;
      case 'LOCATION': current.location = unescapeIcsText(value); break;
      case 'STATUS': current.status = value.trim().toUpperCase(); break;
      case 'DTSTART': { const parsed = parseIcsDate({ params, value }); if (parsed) current.start = parsed; break; }
      case 'DTEND': { const parsed = parseIcsDate({ params, value }); if (parsed) current.end = parsed; break; }
      case 'RECURRENCE-ID': { const parsed = parseIcsDate({ params, value }); if (parsed) current.recurrenceId = parsed.iso; break; }
      case 'RRULE': current.rrule = parseRrule(value); break;
      case 'EXDATE': {
        for (const part of value.split(',')) {
          const parsed = parseIcsDate({ params, value: part });
          if (parsed) exdates.push(parsed.iso);
        }
        break;
      }
      case 'LAST-MODIFIED':
      case 'DTSTAMP': { const parsed = parseIcsDate({ params, value }); if (parsed) current.lastModified = parsed.iso; break; }
      default: break;
    }
  }
  return events;
}

// ---------- Rozbalení RRULE (jen DAILY/WEEKLY/MONTHLY/YEARLY, běžné parametry) ----------

const WEEKDAY_INDEX: Record<string, number> = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };
const MAX_OCCURRENCES_PER_EVENT = 200;

function addUnit(date: Date, unit: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY', amount: number): Date {
  const next = new Date(date.getTime());
  if (unit === 'DAILY') next.setUTCDate(next.getUTCDate() + amount);
  else if (unit === 'WEEKLY') next.setUTCDate(next.getUTCDate() + amount * 7);
  else if (unit === 'MONTHLY') next.setUTCMonth(next.getUTCMonth() + amount);
  else next.setUTCFullYear(next.getUTCFullYear() + amount);
  return next;
}

function expandRecurrence(event: IcsEvent, windowStartMs: number, windowEndMs: number): IcsDateTime[] {
  const startMs = Date.parse(event.start.iso);
  if (!event.rrule) return (startMs >= windowStartMs && startMs <= windowEndMs) ? [event.start] : [];

  const freq = String(event.rrule.FREQ || '').toUpperCase();
  if (!['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'].includes(freq)) {
    // Neznámá/nepodporovaná frekvence (SECONDLY/MINUTELY/HOURLY apod.) -
    // zobraz aspoň první výskyt (pokud padne do synchronizačního okna), ať
    // událost úplně nezmizí.
    return (startMs >= windowStartMs && startMs <= windowEndMs) ? [event.start] : [];
  }
  const interval = Math.max(1, Number(event.rrule.INTERVAL) || 1);
  const until = event.rrule.UNTIL ? Date.parse(parseIcsDate({ params: {}, value: event.rrule.UNTIL })?.iso || '') : null;
  const count = event.rrule.COUNT ? Number(event.rrule.COUNT) : null;
  const byDay = freq === 'WEEKLY' && event.rrule.BYDAY
    ? event.rrule.BYDAY.split(',').map((code) => WEEKDAY_INDEX[code.trim().toUpperCase().slice(-2)]).filter((n) => n !== undefined)
    : null;
  const exSet = new Set(event.exdates);

  const results: IcsDateTime[] = [];
  let cursor = new Date(startMs);
  let produced = 0;
  const hardEnd = until ? Math.min(until, windowEndMs) : windowEndMs;

  while (produced < MAX_OCCURRENCES_PER_EVENT && cursor.getTime() <= hardEnd) {
    if (count !== null && produced >= count) break;
    const candidates = byDay
      ? byDay.map((weekday) => {
          const weekStart = new Date(cursor.getTime());
          const diff = (weekday - weekStart.getUTCDay() + 7) % 7;
          weekStart.setUTCDate(weekStart.getUTCDate() + diff);
          return weekStart;
        })
      : [cursor];

    for (const candidate of candidates) {
      if (candidate.getTime() < startMs) continue;
      if (until !== null && candidate.getTime() > until) continue;
      if (count !== null && produced >= count) break;
      // COUNT se čerpá z RAW řady výskytů PŘED odečtením EXDATE (RFC 5545) -
      // vyloučený termín pořád "spotřebuje" jedno místo, negeneruje se náhrada.
      produced += 1;
      const iso = candidate.toISOString();
      if (exSet.has(iso)) continue;
      if (candidate.getTime() > windowEndMs) continue;
      if (candidate.getTime() >= windowStartMs) {
        results.push({ iso, allDay: event.start.allDay });
      }
    }
    cursor = addUnit(cursor, freq as any, interval);
  }
  return results;
}

function eventDurationMs(event: IcsEvent): number {
  if (!event.end) return event.start.allDay ? 86400000 : 3600000;
  return Math.max(0, Date.parse(event.end.iso) - Date.parse(event.start.iso));
}

function buildInstances(events: IcsEvent[], windowStartMs: number, windowEndMs: number) {
  const instances: { event: IcsEvent; startIso: string; endIso: string | null }[] = [];
  for (const event of events) {
    if (event.status === 'CANCELLED' && !event.rrule) continue;
    const durationMs = eventDurationMs(event);
    const occurrences = expandRecurrence(event, windowStartMs, windowEndMs);
    for (const occurrence of occurrences) {
      const endIso = event.end ? new Date(Date.parse(occurrence.iso) + durationMs).toISOString() : null;
      instances.push({ event, startIso: occurrence.iso, endIso });
    }
  }
  return instances;
}

// ---------- Upsert do calendar_events (stejný tvar jako Google sync) ----------

function normalizeIcsEvent(instance: { event: IcsEvent; startIso: string; endIso: string | null }, source: any, householdId: string, userId: string) {
  const { event, startIso, endIso } = instance;
  const providerEventId = event.rrule ? `${event.uid}::${startIso}` : event.uid;
  return {
    household_id: householdId,
    source_id: source.id,
    title: event.summary || '(bez názvu)',
    description: event.description || null,
    location: event.location || null,
    starts_at: startIso,
    ends_at: endIso,
    all_day: event.start.allDay,
    event_type: 'event',
    status: event.status === 'CANCELLED' ? 'cancelled' : 'confirmed',
    visibility: 'household',
    provider_event_id: providerEventId,
    provider_status: event.status || null,
    provider_updated_at: event.lastModified || null,
    source_etag: null,
    external_url: null,
    raw_provider_payload: {
      provider: 'ical',
      uid: event.uid,
      recurrenceId: event.recurrenceId,
      startIso,
      endIso
    },
    updated_by: userId,
  };
}

async function upsertEvent(supabase: SupabaseClient, source: any, payload: Record<string, unknown>, userId: string) {
  const { data: existing, error: findError } = await supabase
    .from('calendar_events')
    .select('id')
    .eq('source_id', source.id)
    .eq('provider_event_id', payload.provider_event_id)
    .maybeSingle();
  if (findError) throw findError;
  const query = existing?.id
    ? supabase.from('calendar_events').update(payload).eq('id', existing.id)
    : supabase.from('calendar_events').insert({ ...payload, created_by: userId });
  const { error } = await query;
  if (error) throw error;
  return true;
}

async function cancelMissingEventsForSource(
  supabase: SupabaseClient,
  source: any,
  activeProviderEventIds: Set<string>,
  windowStartMs: number,
  windowEndMs: number,
  userId: string
) {
  const windowStartIso = new Date(windowStartMs).toISOString();
  const windowEndIso = new Date(windowEndMs).toISOString();
  const { data, error } = await supabase
    .from('calendar_events')
    .select('id,provider_event_id')
    .eq('source_id', source.id)
    .neq('status', 'cancelled')
    .gte('starts_at', windowStartIso)
    .lte('starts_at', windowEndIso);
  if (error) throw error;
  const staleIds = (data || [])
    .filter((row: any) => row.provider_event_id && !activeProviderEventIds.has(String(row.provider_event_id)))
    .map((row: any) => row.id)
    .filter(Boolean);
  if (!staleIds.length) return 0;
  for (let index = 0; index < staleIds.length; index += 100) {
    const ids = staleIds.slice(index, index + 100);
    const { error: updateError } = await supabase
      .from('calendar_events')
      .update({
        status: 'cancelled',
        provider_status: 'CANCELLED',
        updated_by: userId
      })
      .in('id', ids);
    if (updateError) throw updateError;
  }
  return staleIds.length;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const supabase = serviceClient();
    const user = await getUserFromRequest(req, supabase);
    const body = await readBody(req);
    const householdId = String(body.householdId || '');
    await assertHouseholdMember(supabase, householdId, user.id);

    const sources = await selectedIcsSources(supabase, householdId, body);
    if (!sources.length) return jsonResponse({ ok: false, code: 'no_ics_sources', error: 'Nejsou žádné iCal/ICS zdroje k synchronizaci.', eventsUpserted: 0 });

    const now = Date.now();
    const windowStartMs = body.timeMin ? Date.parse(String(body.timeMin)) : now - 30 * 86400000;
    const windowEndMs = body.timeMax ? Date.parse(String(body.timeMax)) : now + 400 * 86400000;

    let eventsUpserted = 0;
    let eventsCancelled = 0;
    let eventsRemoved = 0;
    const errors: { sourceId: string; error: string }[] = [];

    for (const source of sources) {
      await supabase.from('calendar_sources').update({ sync_status: 'syncing', sync_error: null, updated_by: user.id }).eq('id', source.id);
      try {
        const response = await fetch(source.provider_calendar_id, { headers: { accept: 'text/calendar, text/plain, */*' } });
        if (!response.ok) throw new Error(`ICS odkaz vrátil HTTP ${response.status}`);
        const text = await response.text();
        const parsedEvents = parseIcs(text);
        const instances = buildInstances(parsedEvents, windowStartMs, windowEndMs);
        const activeProviderEventIds = new Set<string>();
        for (const instance of instances) {
          const payload = normalizeIcsEvent(instance, source, householdId, user.id);
          activeProviderEventIds.add(String(payload.provider_event_id || ''));
          if (await upsertEvent(supabase, source, payload, user.id)) eventsUpserted += 1;
          if (payload.status === 'cancelled') eventsCancelled += 1;
        }
        eventsRemoved += await cancelMissingEventsForSource(supabase, source, activeProviderEventIds, windowStartMs, windowEndMs, user.id);
        await supabase.from('calendar_sources').update({ last_synced_at: new Date().toISOString(), sync_status: 'idle', sync_error: null, updated_by: user.id }).eq('id', source.id);
      } catch (sourceError) {
        const message = errorMessage(sourceError);
        errors.push({ sourceId: source.id, error: message });
        await supabase.from('calendar_sources').update({ sync_status: 'error', sync_error: message, updated_by: user.id }).eq('id', source.id);
      }
    }

    return jsonResponse({ ok: true, sources, eventsUpserted, eventsCancelled, eventsRemoved, errors });
  } catch (error) {
    const message = errorMessage(error);
    return jsonResponse({ ok: false, code: 'calendar_ics_sync_failed', error: message }, 400);
  }
});
