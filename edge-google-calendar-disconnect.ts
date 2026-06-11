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
    const nowIso = new Date().toISOString();

    await supabase.from('calendar_provider_connections').update({
      status: 'disconnected',
      oauth_state: null,
      updated_at: nowIso,
    }).eq('id', connection.id);

    await supabase.from('calendar_sources').update({
      sync_enabled: false,
      sync_status: 'idle',
      sync_error: 'Google účet byl odpojený',
      updated_by: user.id,
    }).eq('household_id', householdId).eq('provider', 'google').eq('provider_connection_id', connection.id);

    return jsonResponse({ connection: publicConnection({ ...connection, status: 'disconnected', updated_at: nowIso }) });
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : String(error) }, 400);
  }
});
