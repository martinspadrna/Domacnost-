import { assertHouseholdMember, corsHeaders, getUserFromRequest, GOOGLE_SCOPES, googleRedirectUri, jsonResponse, readBody, serviceClient } from '../_shared/google-calendar.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const supabase = serviceClient();
    const user = await getUserFromRequest(req, supabase);
    const body = await readBody(req);
    const householdId = String(body.householdId || '');
    const profileId = body.profileId ? String(body.profileId) : null;
    await assertHouseholdMember(supabase, householdId, user.id);

    const state = crypto.randomUUID();
    const redirectUri = googleRedirectUri();
    const { data: connection, error } = await supabase.from('calendar_provider_connections').insert({
      household_id: householdId,
      profile_id: profileId && !profileId.startsWith('profile-') ? profileId : null,
      user_id: user.id,
      provider: 'google',
      scopes: GOOGLE_SCOPES,
      status: 'oauth_pending',
      oauth_state: state,
      oauth_redirect_uri: redirectUri,
      updated_at: new Date().toISOString(),
    }).select('id').single();
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

    return jsonResponse({ connectionId: connection.id, authUrl: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` });
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : String(error) }, 400);
  }
});
