import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

export const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly',
];

export function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'content-type': 'application/json; charset=utf-8' },
  });
}

export function softError(code: string, message: string, details: Record<string, unknown> = {}, status = 200) {
  return jsonResponse({ ok: false, code, error: message, ...details }, status);
}

export function redirectResponse(url: string) {
  return new Response(null, { status: 302, headers: { location: url } });
}

export function requireEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing env ${name}`);
  return value;
}

export function serviceClient() {
  return createClient(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function readBody(req: Request) {
  if (req.method === 'GET') return {} as Record<string, unknown>;
  try { return await req.json(); } catch (_) { return {} as Record<string, unknown>; }
}

export async function getUserFromRequest(req: Request, supabase = serviceClient()) {
  const auth = req.headers.get('authorization') || '';
  const jwt = auth.replace(/^Bearer\s+/i, '').trim();
  if (!jwt) throw new Error('Missing auth token');
  const { data, error } = await supabase.auth.getUser(jwt);
  if (error || !data?.user) throw new Error('Invalid auth token');
  return data.user;
}

export async function assertHouseholdMember(supabase: ReturnType<typeof serviceClient>, householdId: string, userId: string) {
  if (!householdId) throw new Error('Missing householdId');
  const { data, error } = await supabase
    .from('household_members')
    .select('role,status')
    .eq('household_id', householdId)
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle();
  if (error || !data) throw new Error('No access to household');
  return data;
}

export function googleRedirectUri() {
  return Deno.env.get('GOOGLE_CALENDAR_REDIRECT_URI') || `${requireEnv('SUPABASE_URL')}/functions/v1/google-calendar-callback`;
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

function base64ToBytes(value: string) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function encryptionKey(usages: KeyUsage[] = ['encrypt', 'decrypt']) {
  const raw = base64ToBytes(requireEnv('GOOGLE_TOKEN_ENCRYPTION_KEY_BASE64'));
  if (raw.byteLength !== 32) throw new Error('GOOGLE_TOKEN_ENCRYPTION_KEY_BASE64 must decode to 32 bytes');
  return crypto.subtle.importKey('raw', raw, 'AES-GCM', false, usages);
}

export async function encryptSecret(value: string) {
  if (!value) return '';
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await encryptionKey(['encrypt']);
  const encoded = new TextEncoder().encode(value);
  const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded));
  return `${bytesToBase64(iv)}:${bytesToBase64(encrypted)}`;
}

export async function decryptSecret(value = '') {
  if (!value) return '';
  const [ivPart, dataPart] = value.split(':');
  if (!ivPart || !dataPart) throw new Error('Invalid encrypted secret');
  const key = await encryptionKey(['decrypt']);
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: base64ToBytes(ivPart) }, key, base64ToBytes(dataPart));
  return new TextDecoder().decode(decrypted);
}

export function publicConnection(row: any, tokenState = row?.token_state || undefined) {
  if (!row) return null;
  return {
    id: row.id,
    householdId: row.household_id,
    profileId: row.profile_id,
    provider: row.provider,
    googleAccountEmail: row.google_account_email,
    scopes: row.scopes || [],
    status: row.status,
    tokenState,
    lastSyncAt: row.last_sync_at,
    lastError: row.last_error || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function activeConnection(supabase: ReturnType<typeof serviceClient>, householdId: string, userId: string) {
  const { data, error } = await supabase
    .from('calendar_provider_connections')
    .select('id,household_id,profile_id,user_id,provider,google_account_email,scopes,status,last_sync_at,last_error,created_at,updated_at')
    .eq('household_id', householdId)
    .eq('user_id', userId)
    .eq('provider', 'google')
    .eq('status', 'connected')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) throw new Error('Google account is not connected');
  return data;
}

export async function connectedGoogleConnections(supabase: ReturnType<typeof serviceClient>, householdId: string, userId: string) {
  const { data, error } = await supabase
    .from('calendar_provider_connections')
    .select('id,household_id,profile_id,user_id,provider,google_account_email,scopes,status,last_sync_at,last_error,created_at,updated_at')
    .eq('household_id', householdId)
    .eq('user_id', userId)
    .eq('provider', 'google')
    .eq('status', 'connected')
    .order('updated_at', { ascending: false })
    .limit(8);
  if (error) throw error;
  return data || [];
}

export async function saveConnectionSecret(supabase: ReturnType<typeof serviceClient>, payload: Record<string, unknown>) {
  const { data, error } = await supabase.rpc('save_calendar_provider_connection_secret', {
    p_connection_id: payload.connection_id,
    p_access_token_encrypted: payload.access_token_encrypted || '',
    p_refresh_token_encrypted: payload.refresh_token_encrypted || null,
    p_token_expires_at: payload.token_expires_at || null,
    p_token_type: payload.token_type || 'Bearer',
    p_raw_token_response: payload.raw_token_response || {},
  });
  if (error) throw error;
  return data === true;
}

export async function tokenSecrets(supabase: ReturnType<typeof serviceClient>, connectionId: string) {
  const { data, error } = await supabase.rpc('get_calendar_provider_connection_secret', { p_connection_id: connectionId });
  if (error) throw error;
  if (Array.isArray(data)) return data[0] || null;
  return data || null;
}

export async function hasTokenSecret(supabase: ReturnType<typeof serviceClient>, connectionId: string) {
  const { data, error } = await supabase.rpc('has_calendar_provider_connection_secret', { p_connection_id: connectionId });
  if (error) throw error;
  return data === true;
}

export async function activeConnectionWithToken(supabase: ReturnType<typeof serviceClient>, householdId: string, userId: string) {
  const connections = await connectedGoogleConnections(supabase, householdId, userId);
  if (!connections.length) return { connection: null, secrets: null, missingConnection: null };
  for (const connection of connections) {
    const secrets = await tokenSecrets(supabase, connection.id);
    if (secrets?.access_token_encrypted || secrets?.refresh_token_encrypted) return { connection, secrets, missingConnection: null };
  }
  return { connection: null, secrets: null, missingConnection: connections[0] };
}

export async function markMissingToken(supabase: ReturnType<typeof serviceClient>, connectionId: string) {
  await supabase.from('calendar_provider_connections').update({
    status: 'error',
    last_error: 'missing_google_token',
    oauth_state: null,
    updated_at: new Date().toISOString(),
  }).eq('id', connectionId);
}

export async function googleAccessToken(supabase: ReturnType<typeof serviceClient>, connectionOrId: any, suppliedSecrets?: any) {
  const connection = typeof connectionOrId === 'string' ? { id: connectionOrId } : connectionOrId;
  const secrets = suppliedSecrets || await tokenSecrets(supabase, connection.id);
  if (!secrets?.access_token_encrypted && !secrets?.refresh_token_encrypted) {
    await markMissingToken(supabase, connection.id);
    throw new Error('missing_google_token');
  }
  const expiresAt = secrets.token_expires_at ? new Date(secrets.token_expires_at).getTime() : 0;
  const stillValid = expiresAt > Date.now() + 5 * 60 * 1000;
  if (stillValid && secrets.access_token_encrypted) return decryptSecret(secrets.access_token_encrypted);
  const refreshToken = await decryptSecret(secrets.refresh_token_encrypted || '');
  if (!refreshToken) {
    if (secrets.access_token_encrypted) return decryptSecret(secrets.access_token_encrypted);
    await markMissingToken(supabase, connection.id);
    throw new Error('missing_google_token');
  }
  const params = new URLSearchParams({
    client_id: requireEnv('GOOGLE_CLIENT_ID'),
    client_secret: requireEnv('GOOGLE_CLIENT_SECRET'),
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  const token = await response.json();
  if (!response.ok || !token.access_token) throw new Error(token.error_description || token.error || 'Google token refresh failed');
  const tokenExpiresAt = new Date(Date.now() + Number(token.expires_in || 3600) * 1000).toISOString();
  await saveConnectionSecret(supabase, {
    connection_id: connection.id,
    access_token_encrypted: await encryptSecret(token.access_token),
    refresh_token_encrypted: secrets.refresh_token_encrypted || '',
    token_expires_at: tokenExpiresAt,
    token_type: token.token_type || secrets.token_type || 'Bearer',
    raw_token_response: { ...token, access_token: '[encrypted]' },
  });
  return token.access_token as string;
}

export async function googleFetch(path: string, accessToken: string) {
  const response = await fetch(`https://www.googleapis.com/calendar/v3${path}`, {
    headers: { authorization: `Bearer ${accessToken}` },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error?.message || data.error_description || 'Google Calendar request failed');
  return data;
}
