import { activeConnection, assertHouseholdMember, corsHeaders, getUserFromRequest, jsonResponse, publicConnection, readBody, serviceClient } from './edge-shared-google-calendar.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const supabase = serviceClient();
    const user = await getUserFromRequest(req, supabase);
    const body = await readBody(req);
    const householdId = String(body.householdId || '');
    await assertHouseholdMember(supabase, householdId, user.id);
    const connection = await activeConnection(supabase, householdId, user.id);
    const calendars = Array.isArray(body.calendars) ? body.calendars : [];
    if (!calendars.length) throw new Error('No calendars selected');

    const savedSources = [];
    for (const calendar of calendars) {
      const providerCalendarId = String(calendar.id || '');
      if (!providerCalendarId) continue;
      const payload = {
        household_id: householdId,
        profile_id: body.profileId && !String(body.profileId).startsWith('profile-') ? String(body.profileId) : null,
        name: String(calendar.summary || calendar.name || 'Google kalendář'),
        provider: 'google',
        provider_connection_id: connection.id,
        provider_calendar_id: providerCalendarId,
        color: calendar.backgroundColor || null,
        is_enabled: true,
        sync_enabled: true,
        sync_status: 'idle',
        sync_error: null,
        note: connection.google_account_email ? `Google účet: ${connection.google_account_email}` : 'Google Calendar',
        external_url: `https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent(providerCalendarId)}`,
        updated_by: user.id,
      };
      const { data: existing, error: findError } = await supabase
        .from('calendar_sources')
        .select('id')
        .eq('household_id', householdId)
        .eq('provider', 'google')
        .eq('provider_connection_id', connection.id)
        .eq('provider_calendar_id', providerCalendarId)
        .maybeSingle();
      if (findError) throw findError;
      const query = existing?.id
        ? supabase.from('calendar_sources').update(payload).eq('id', existing.id).select('id,household_id,profile_id,name,provider,provider_calendar_id,color,is_enabled,sync_enabled,last_synced_at,note,created_at').single()
        : supabase.from('calendar_sources').insert({ ...payload, created_by: user.id }).select('id,household_id,profile_id,name,provider,provider_calendar_id,color,is_enabled,sync_enabled,last_synced_at,note,created_at').single();
      const { data, error } = await query;
      if (error) throw error;
      savedSources.push(data);
    }
    return jsonResponse({ connection: publicConnection(connection), sources: savedSources });
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : String(error) }, 400);
  }
});
