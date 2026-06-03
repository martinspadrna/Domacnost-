import { activeConnection, assertHouseholdMember, corsHeaders, getUserFromRequest, googleAccessToken, googleFetch, jsonResponse, publicConnection, readBody, serviceClient } from '../_shared/google-calendar.ts';

function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function eventStartEnd(item: any) {
  const allDay = Boolean(item.start?.date && !item.start?.dateTime);
  const start = item.start?.dateTime || (item.start?.date ? `${item.start.date}T00:00:00Z` : new Date().toISOString());
  const end = item.end?.dateTime || (item.end?.date ? `${item.end.date}T00:00:00Z` : null);
  return { start, end, allDay };
}

async function upsertProviderEvent(supabase: ReturnType<typeof serviceClient>, source: any, item: any, userId: string) {
  const { start, end, allDay } = eventStartEnd(item);
  const providerEventId = String(item.id || '');
  if (!providerEventId) return null;
  const payload = {
    household_id: source.household_id,
    source_id: source.id,
    title: item.summary || '(bez názvu)',
    description: item.description || null,
    location: item.location || null,
    starts_at: start,
    ends_at: end,
    all_day: allDay,
    event_type: 'event',
    status: item.status === 'cancelled' ? 'cancelled' : 'confirmed',
    visibility: 'household',
    provider_event_id: providerEventId,
    provider_status: item.status || null,
    provider_updated_at: item.updated || null,
    source_etag: item.etag || null,
    external_url: item.htmlLink || null,
    raw_provider_payload: item,
    updated_by: userId,
  };
  const { data: existing, error: findError } = await supabase
    .from('calendar_events')
    .select('id')
    .eq('source_id', source.id)
    .eq('provider_event_id', providerEventId)
    .maybeSingle();
  if (findError) throw findError;
  const query = existing?.id
    ? supabase.from('calendar_events').update(payload).eq('id', existing.id).select('id,status').single()
    : supabase.from('calendar_events').insert({ ...payload, created_by: userId }).select('id,status').single();
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  let runId: string | null = null;
  try {
    const supabase = serviceClient();
    const user = await getUserFromRequest(req, supabase);
    const body = await readBody(req);
    const householdId = String(body.householdId || '');
    const requestedSourceId = body.sourceId ? String(body.sourceId) : '';
    await assertHouseholdMember(supabase, householdId, user.id);
    const connection = await activeConnection(supabase, householdId, user.id);
    const accessToken = await googleAccessToken(supabase, connection.id);

    const sourceQuery = supabase
      .from('calendar_sources')
      .select('id,household_id,name,provider_calendar_id,provider_connection_id')
      .eq('household_id', householdId)
      .eq('provider', 'google')
      .eq('provider_connection_id', connection.id)
      .eq('sync_enabled', true);
    const { data: sources, error: sourcesError } = requestedSourceId
      ? await sourceQuery.eq('id', requestedSourceId)
      : await sourceQuery;
    if (sourcesError) throw sourcesError;
    if (!sources?.length) throw new Error('No Google calendar sources selected');

    const { data: run, error: runError } = await supabase.from('calendar_sync_runs').insert({
      household_id: householdId,
      connection_id: connection.id,
      provider: 'google',
      status: 'running',
      created_by: user.id,
    }).select('id').single();
    if (!runError) runId = run?.id || null;

    let eventsUpserted = 0;
    let eventsCancelled = 0;
    const syncedSources = [];
    const timeMin = addDays(new Date(), -30).toISOString();
    const timeMax = addDays(new Date(), 365).toISOString();

    for (const source of sources) {
      try {
        await supabase.from('calendar_sources').update({ sync_status: 'running', sync_error: null }).eq('id', source.id);
        const params = new URLSearchParams({
          singleEvents: 'true',
          showDeleted: 'true',
          orderBy: 'startTime',
          timeMin,
          timeMax,
          maxResults: '2500',
        });
        const data = await googleFetch(`/calendars/${encodeURIComponent(source.provider_calendar_id)}/events?${params.toString()}`, accessToken);
        for (const item of data.items || []) {
          const saved = await upsertProviderEvent(supabase, source, item, user.id);
          if (saved?.id) eventsUpserted += 1;
          if (item.status === 'cancelled') eventsCancelled += 1;
        }
        const nowIso = new Date().toISOString();
        const { data: updatedSource } = await supabase.from('calendar_sources').update({
          last_synced_at: nowIso,
          sync_status: 'idle',
          sync_error: null,
          updated_by: user.id,
        }).eq('id', source.id).select('id,household_id,profile_id,name,provider,provider_calendar_id,color,is_enabled,sync_enabled,last_synced_at,note,created_at').single();
        if (updatedSource) syncedSources.push(updatedSource);
      } catch (sourceError) {
        await supabase.from('calendar_sources').update({
          sync_status: 'error',
          sync_error: sourceError instanceof Error ? sourceError.message : String(sourceError),
        }).eq('id', source.id);
        throw sourceError;
      }
    }

    const finishedAt = new Date().toISOString();
    await supabase.from('calendar_provider_connections').update({ last_sync_at: finishedAt, last_error: null, updated_at: finishedAt }).eq('id', connection.id);
    if (runId) await supabase.from('calendar_sync_runs').update({ status: 'success', finished_at: finishedAt, events_upserted: eventsUpserted, events_cancelled: eventsCancelled }).eq('id', runId);
    return jsonResponse({ connection: publicConnection({ ...connection, last_sync_at: finishedAt, status: 'connected' }), sources: syncedSources, eventsUpserted, eventsCancelled });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    try {
      const supabase = serviceClient();
      if (runId) await supabase.from('calendar_sync_runs').update({ status: 'error', finished_at: new Date().toISOString(), error: message }).eq('id', runId);
    } catch (_) {}
    return jsonResponse({ error: message }, 400);
  }
});
