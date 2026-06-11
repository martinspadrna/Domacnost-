import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { assertHouseholdMember, corsHeaders, getUserFromRequest, googleRedirectUri, GOOGLE_SCOPES, jsonResponse, readBody, serviceClient, tokenSecrets } from './edge-shared-google-calendar.ts';

async function cleanupBeforeReconnect(supabase: ReturnType<typeof serviceClient>, householdId: string, userId: string) {
  const now = new Date().toISOString();
  await supabase
    .from('calendar_provider_connections')
    .update({ status: 'disconnected', last_error: 'reconnect_started', oauth_state: null, updated_at: now })
    .eq('household_id', householdId)
    .eq('user_id', userId)
    .eq('provider', 'google')
    .in('status', ['oauth_pending', 'error']);

  const { data: connectedRows } = await supabase
    .from('calendar_provider_connections')
    .select('id')
    .eq('household_id', householdId)
    .eq('user_id', userId)
    .eq('provider', 'google')
    .eq('status', 'connected');

  for (const row of connectedRows || []) {
    const secret = await tokenSecrets(supabase, row.id);
    if (!secret?.access_token_encrypted && !secret?.refresh_token_encrypted) {
      await supabase
        .from('calendar_provider_connections')
        .update({ status: 'error', last_error: 'missing_google_token', oauth_state: null, updated_at: now })
        .eq('id', row.id);
    }
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const supabase = serviceClient();
    const user = await getUserFromRequest(req, supabase);
    const body = await readBody(req);
    const householdId = String(body.householdId || '');
    const profileIdRaw = body.profileId;
    const profileId = profileIdRaw && !String(profileIdRaw).startsWith('profile-') ? String(profileIdRaw) : null;
    await assertHouseholdMember(supabase, householdId, user.id);
    await cleanupBeforeReconnect(supabase, householdId, user.id);

    const state = crypto.randomUUID();
    const redirectUri = googleRedirectUri();
    const { data: connection, error } = await supabase.from('calendar_provider_connections').insert({
      household_id: householdId,
      profile_id: profileId,
      user_id: user.id,
      provider: 'google',
      scopes: GOOGLE_SCOPES,
      status: 'oauth_pending',
      oauth_state: state,
      oauth_redirect_uri: redirectUri,
      last_error: null,
      updated_at: new Date().toISOString(),
    }).select('id,household_id,profile_id,user_id,provider,google_account_email,scopes,status,last_sync_at,last_error,created_at,updated_at').single();
    if (error) throw error;

    const params = new URLSearchParams({
      client_id: Deno.env.get('GOOGLE_CLIENT_ID') || '',
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: GOOGLE_SCOPES.join(' '),
      access_type: 'offline',
      prompt: 'consent',
      include_granted_scopes: 'true',
      state,
    });
    if (!params.get('client_id')) throw new Error('Missing GOOGLE_CLIENT_ID');
    return jsonResponse({ ok: true, connection, status: 'oauth_pending', authUrl: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` });
  } catch (error) {
    return jsonResponse({ ok: false, code: 'google_calendar_start_failed', error: error instanceof Error ? error.message : String(error) }, 400);
  }
});
