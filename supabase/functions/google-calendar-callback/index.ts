import { corsHeaders, encryptSecret, GOOGLE_SCOPES, jsonResponse, redirectResponse, serviceClient } from '../_shared/google-calendar.ts';

function appUrl(path = '') {
  const base = Deno.env.get('APP_PUBLIC_URL') || 'https://domacnost-plus.vercel.app/';
  return new URL(path, base).toString();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  const url = new URL(req.url);
  try {
    const code = url.searchParams.get('code') || '';
    const state = url.searchParams.get('state') || '';
    const oauthError = url.searchParams.get('error') || '';
    if (oauthError) throw new Error(oauthError);
    if (!code || !state) throw new Error('Missing Google OAuth code/state');

    const supabase = serviceClient();
    const { data: connection, error: connectionError } = await supabase
      .from('calendar_provider_connections')
      .select('id,household_id,user_id,oauth_redirect_uri,status')
      .eq('oauth_state', state)
      .eq('provider', 'google')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (connectionError || !connection) throw new Error('OAuth state was not found');

    const redirectUri = connection.oauth_redirect_uri || Deno.env.get('GOOGLE_CALENDAR_REDIRECT_URI') || `${Deno.env.get('SUPABASE_URL')}/functions/v1/google-calendar-callback`;
    const tokenParams = new URLSearchParams({
      code,
      client_id: Deno.env.get('GOOGLE_CLIENT_ID') || '',
      client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET') || '',
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    });
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: tokenParams,
    });
    const token = await tokenResponse.json();
    if (!tokenResponse.ok || !token.access_token) throw new Error(token.error_description || token.error || 'Google token exchange failed');

    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { authorization: `Bearer ${token.access_token}` },
    });
    const userInfo = await userInfoResponse.json().catch(() => ({}));
    const expiresAt = new Date(Date.now() + Number(token.expires_in || 3600) * 1000).toISOString();

    await supabase.schema('app_private').from('calendar_provider_connection_secrets').upsert({
      connection_id: connection.id,
      access_token_encrypted: await encryptSecret(token.access_token),
      refresh_token_encrypted: token.refresh_token ? await encryptSecret(token.refresh_token) : undefined,
      token_expires_at: expiresAt,
      token_type: token.token_type || 'Bearer',
      raw_token_response: token,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'connection_id' });

    await supabase.from('calendar_provider_connections').update({
      google_account_email: userInfo.email || null,
      scopes: token.scope ? String(token.scope).split(' ') : GOOGLE_SCOPES,
      status: 'connected',
      oauth_state: null,
      last_error: null,
      updated_at: new Date().toISOString(),
    }).eq('id', connection.id);

    return redirectResponse(appUrl('?googleCalendar=connected'));
  } catch (error) {
    console.error('google-calendar-callback failed', error);
    return redirectResponse(appUrl('?googleCalendar=error'));
  }
});
