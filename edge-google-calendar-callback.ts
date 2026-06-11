import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { corsHeaders, encryptSecret, GOOGLE_SCOPES, redirectResponse, saveConnectionSecret, serviceClient, tokenSecrets } from './edge-shared-google-calendar.ts';

function appUrl(path = '') {
  const base = Deno.env.get('APP_PUBLIC_URL') || 'https://domacnost-plus.vercel.app/';
  return new URL(path, base).toString();
}

function errorRedirect(reason: string) {
  return redirectResponse(appUrl(`?googleCalendar=error&reason=${encodeURIComponent(reason)}`));
}

async function setConnectionError(supabase: ReturnType<typeof serviceClient>, connectionId: string, code: string, detail = '') {
  if (!connectionId) return;
  await supabase.from('calendar_provider_connections').update({
    status: 'error',
    last_error: detail ? `${code}: ${detail}` : code,
    oauth_state: null,
    updated_at: new Date().toISOString(),
  }).eq('id', connectionId);
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  const url = new URL(req.url);
  let connectionId = '';
  let supabase: ReturnType<typeof serviceClient> | null = null;
  try {
    const code = url.searchParams.get('code') || '';
    const state = url.searchParams.get('state') || '';
    const oauthError = url.searchParams.get('error') || '';
    if (oauthError) throw new Error(oauthError);
    if (!code || !state) throw new Error('Missing Google OAuth code/state');

    supabase = serviceClient();
    const { data: connection, error: connectionError } = await supabase
      .from('calendar_provider_connections')
      .select('id,household_id,user_id,oauth_redirect_uri,status')
      .eq('oauth_state', state)
      .eq('provider', 'google')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (connectionError || !connection) throw new Error('OAuth state was not found');
    connectionId = connection.id;

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

    const secretPayload: Record<string, unknown> = {
      connection_id: connection.id,
      access_token_encrypted: await encryptSecret(token.access_token),
      token_expires_at: expiresAt,
      token_type: token.token_type || 'Bearer',
      raw_token_response: { ...token, access_token: '[encrypted]', refresh_token: token.refresh_token ? '[encrypted]' : undefined },
      updated_at: new Date().toISOString(),
    };
    if (token.refresh_token) secretPayload.refresh_token_encrypted = await encryptSecret(token.refresh_token);

    try {
      await saveConnectionSecret(supabase, secretPayload);
    } catch (secretError) {
      const message = secretError instanceof Error ? secretError.message : String(secretError);
      await setConnectionError(supabase, connection.id, 'token_store_failed', message);
      return errorRedirect('token_store_failed');
    }

    const savedSecret = await tokenSecrets(supabase, connection.id);
    if (!savedSecret?.access_token_encrypted && !savedSecret?.refresh_token_encrypted) {
      await setConnectionError(supabase, connection.id, 'token_store_verify_failed', 'secret row missing after upsert');
      return errorRedirect('token_store_failed');
    }

    const { error: updateError } = await supabase.from('calendar_provider_connections').update({
      google_account_email: userInfo.email || null,
      scopes: token.scope ? String(token.scope).split(' ') : GOOGLE_SCOPES,
      status: 'connected',
      oauth_state: null,
      last_error: null,
      updated_at: new Date().toISOString(),
    }).eq('id', connection.id);
    if (updateError) throw updateError;

    return redirectResponse(appUrl('?googleCalendar=connected'));
  } catch (error) {
    console.error('google-calendar-callback failed', error);
    if (supabase && connectionId) await setConnectionError(supabase, connectionId, error instanceof Error ? error.message : String(error));
    const message = error instanceof Error ? error.message : String(error);
    const reason = message.includes('redirect_uri') ? 'redirect_uri_mismatch' : message.includes('GOOGLE_TOKEN_ENCRYPTION_KEY_BASE64') ? 'token_store_failed' : 'oauth_callback_failed';
    return errorRedirect(reason);
  }
});
