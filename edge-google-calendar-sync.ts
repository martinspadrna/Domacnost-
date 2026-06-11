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

function requireEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing env ${name}`);
  return value;
}

function serviceClient() {
  return createClient(requireEnv("SUPABASE_URL"), requireEnv("SUPABASE_SERVICE_ROLE_KEY"), { auth: { persistSession: false, autoRefreshToken: false } });
}

async function readBody(req: Request) {
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

function b64ToBytes(value: string) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function bytesToB64(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

async function cryptoKey(usages: KeyUsage[]) {
  const raw = b64ToBytes(requireEnv("GOOGLE_TOKEN_ENCRYPTION_KEY_BASE64"));
  if (raw.byteLength !== 32) throw new Error("Invalid encryption key");
  return crypto.subtle.importKey("raw", raw, "AES-GCM", false, usages);
}

async function decryptStored(value = "") {
  const [ivPart, dataPart] = value.split(":");
  if (!ivPart || !dataPart) throw new Error("Invalid stored token");
  const key = await cryptoKey(["decrypt"]);
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: b64ToBytes(ivPart) }, key, b64ToBytes(dataPart));
  return new TextDecoder().decode(decrypted);
}

async function encryptStored(value: string) {
  if (!value) return "";
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await cryptoKey(["encrypt"]);
  const encoded = new TextEncoder().encode(value);
  const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded));
  return `${bytesToB64(iv)}:${bytesToB64(encrypted)}`;
}

function publicConnection(row: any) {
  if (!row) return null;
  return {
    id: row.id,
    householdId: row.household_id,
    profileId: row.profile_id || null,
    provider: row.provider,
    googleAccountEmail: row.google_account_email || "",
    scopes: row.scopes || [],
    status: row.status,
    lastSyncAt: row.last_sync_at || null,
    lastError: row.last_error || "",
    updatedAt: row.updated_at || null,
    tokenState: "ready"
  };
}

async function markMissingToken(supabase: ReturnType<typeof serviceClient>, connectionId: string) {
  await supabase.from("calendar_provider_connections").update({ status: "error", last_error: "missing_google_token", oauth_state: null, updated_at: new Date().toISOString() }).eq("id", connectionId);
}

async function secretForConnection(supabase: ReturnType<typeof serviceClient>, connectionId: string) {
  const { data, error } = await supabase.rpc("get_calendar_provider_connection_secret", { p_connection_id: connectionId });
  if (error) throw error;
  return Array.isArray(data) ? data[0] : data;
}

async function activeConnectionWithSecret(supabase: ReturnType<typeof serviceClient>, householdId: string, userId: string) {
  const { data, error } = await supabase.from("calendar_provider_connections").select("id,household_id,profile_id,user_id,provider,google_account_email,scopes,status,last_sync_at,last_error,updated_at").eq("household_id", householdId).eq("user_id", userId).eq("provider", "google").eq("status", "connected").order("updated_at", { ascending: false }).limit(8);
  if (error) throw error;
  for (const connection of data || []) {
    const secret = await secretForConnection(supabase, connection.id);
    if (secret?.access_token_encrypted || secret?.refresh_token_encrypted) return { connection, secret };
  }
  if ((data || []).length) await markMissingToken(supabase, data![0].id);
  throw new Error("missing_google_token");
}

async function accessTokenForConnection(supabase: ReturnType<typeof serviceClient>, connection: any, secret: any) {
  const expiresAt = secret.token_expires_at ? new Date(secret.token_expires_at).getTime() : 0;
  if (expiresAt > Date.now() + 5 * 60 * 1000 && secret.access_token_encrypted) return decryptStored(secret.access_token_encrypted);

  if (secret.refresh_token_encrypted) {
    const refreshToken = await decryptStored(secret.refresh_token_encrypted);
    const params = new URLSearchParams({ client_id: requireEnv("GOOGLE_CLIENT_ID"), client_secret: requireEnv("GOOGLE_CLIENT_SECRET"), grant_type: "refresh_token", refresh_token: refreshToken });
    const response = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: params });
    const refreshed = await response.json();
    if (!response.ok || !refreshed.access_token) throw new Error(refreshed.error_description || refreshed.error || "Google token refresh failed");
    const tokenExpiresAt = new Date(Date.now() + Number(refreshed.expires_in || 3600) * 1000).toISOString();
    const { error } = await supabase.rpc("save_calendar_provider_connection_secret", { p_connection_id: connection.id, p_access_token_encrypted: await encryptStored(refreshed.access_token), p_refresh_token_encrypted: secret.refresh_token_encrypted || "", p_token_expires_at: tokenExpiresAt, p_token_type: refreshed.token_type || secret.token_type || "Bearer", p_raw_token_response: { source: "sync_refresh", has_access_token: true } });
    if (error) throw error;
    return refreshed.access_token as string;
  }

  if (secret.access_token_encrypted) return decryptStored(secret.access_token_encrypted);
  await markMissingToken(supabase, connection.id);
  throw new Error("missing_google_token");
}

async function googleCalendarGet(path: string, accessToken: string) {
  const response = await fetch(`https://www.googleapis.com/calendar/v3${path}`, { headers: { authorization: `Bearer ${accessToken}` } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error?.message || data.error_description || "Google Calendar request failed");
  return data;
}

function uniqueClean(values: unknown[]) {
  return [...new Set(values.map((item) => String(item || "").trim()).filter(Boolean))];
}

function bodyArray(value: unknown) {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

function sourceIds(body: Record<string, unknown>) {
  return uniqueClean([...bodyArray(body.sourceIds), ...bodyArray(body.sourceId)]);
}

function sourceCalendarIds(body: Record<string, unknown>) {
  const raw = body.calendarIds || body.sourceCalendarIds || body.googleCalendarIds || [];
  const list = bodyArray(raw).map((item: any) => typeof item === "string" ? item : (item?.providerCalendarId || item?.calendarId || item?.calendar_id || item?.provider_calendar_id || item?.external_calendar_id || item?.google_calendar_id || item?.id || ""));
  return uniqueClean(list);
}

async function selectedCalendarSources(supabase: ReturnType<typeof serviceClient>, householdId: string, body: Record<string, unknown>) {
  const explicitSourceIds = sourceIds(body);
  const explicitCalendarIds = sourceCalendarIds(body);
  let query = supabase
    .from("calendar_sources")
    .select("id,household_id,profile_id,name,provider,provider_calendar_id,color,is_enabled,sync_enabled,last_synced_at,note,created_at,provider_connection_id,sync_status")
    .eq("household_id", householdId)
    .eq("provider", "google");

  if (explicitSourceIds.length) query = query.in("id", explicitSourceIds);
  else if (explicitCalendarIds.length) query = query.in("provider_calendar_id", explicitCalendarIds);
  else query = query.eq("sync_enabled", true);

  const { data, error } = await query;
  if (error) throw error;

  const rows = (data || [])
    .filter((row: any) => row.is_enabled !== false)
    .filter((row: any) => explicitSourceIds.length || explicitCalendarIds.length || row.sync_enabled !== false)
    .filter((row: any) => row.provider_calendar_id);

  if ((explicitSourceIds.length || explicitCalendarIds.length) && !rows.length) {
    throw new Error("Vybraný Google kalendář není uložený ve zdrojích. Ulož výběr kalendářů znovu.");
  }

  return rows;
}

function normalizeEvent(item: any, source: any, householdId: string, userId: string) {
  const allDay = Boolean(item.start?.date && !item.start?.dateTime);
  const startsAt = item.start?.dateTime || (item.start?.date ? `${item.start.date}T00:00:00Z` : new Date().toISOString());
  const endsAt = item.end?.dateTime || (item.end?.date ? `${item.end.date}T00:00:00Z` : null);
  return {
    household_id: householdId,
    source_id: source.id || null,
    title: item.summary || "(bez názvu)",
    description: item.description || null,
    location: item.location || null,
    starts_at: startsAt,
    ends_at: endsAt,
    all_day: allDay,
    event_type: "event",
    status: item.status === "cancelled" ? "cancelled" : "confirmed",
    visibility: "household",
    provider_event_id: String(item.id || ""),
    provider_status: item.status || null,
    provider_updated_at: item.updated || null,
    source_etag: item.etag || null,
    external_url: item.htmlLink || null,
    raw_provider_payload: item,
    updated_by: userId,
  };
}

async function upsertEvent(supabase: ReturnType<typeof serviceClient>, source: any, item: any, householdId: string, userId: string) {
  const providerEventId = String(item.id || "");
  if (!providerEventId || !source.id) return false;
  const payload = normalizeEvent(item, source, householdId, userId);
  const { data: existing, error: findError } = await supabase.from("calendar_events").select("id").eq("source_id", source.id).eq("provider_event_id", providerEventId).maybeSingle();
  if (findError) throw findError;
  const query = existing?.id ? supabase.from("calendar_events").update(payload).eq("id", existing.id) : supabase.from("calendar_events").insert({ ...payload, created_by: userId });
  const { error } = await query;
  if (error) throw error;
  return true;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const supabase = serviceClient();
    const user = await getUserFromRequest(req, supabase);
    const body = await readBody(req) as Record<string, unknown>;
    const householdId = String(body.householdId || "");
    await assertHouseholdMember(supabase, householdId, user.id);

    const { connection, secret } = await activeConnectionWithSecret(supabase, householdId, user.id);
    const accessToken = await accessTokenForConnection(supabase, connection, secret);
    const sources = await selectedCalendarSources(supabase, householdId, body);
    if (!sources.length) return jsonResponse({ ok: false, code: "no_google_calendars_selected", error: "Nejsou vybrané žádné Google kalendáře.", eventsUpserted: 0 });

    const now = new Date();
    const timeMin = String(body.timeMin || new Date(now.getTime() - 30 * 86400000).toISOString());
    const timeMax = String(body.timeMax || new Date(now.getTime() + 365 * 86400000).toISOString());
    let eventsUpserted = 0;
    let eventsCancelled = 0;

    for (const source of sources) {
      const calendarId = source.provider_calendar_id;
      const syncStartedAt = new Date().toISOString();
      if (!calendarId) continue;
      await supabase.from("calendar_sources").update({ sync_status: "syncing", sync_error: null, updated_by: user.id }).eq("id", source.id);
      const path = `/calendars/${encodeURIComponent(calendarId)}/events?singleEvents=true&showDeleted=true&orderBy=startTime&timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&maxResults=2500`;
      const data = await googleCalendarGet(path, accessToken);
      for (const item of data.items || []) {
        if (await upsertEvent(supabase, source, item, householdId, user.id)) eventsUpserted += 1;
        if (item.status === "cancelled") eventsCancelled += 1;
      }
      source.last_synced_at = new Date().toISOString();
      source.sync_status = "idle";
      await supabase.from("calendar_sources").update({ last_synced_at: source.last_synced_at, sync_status: "idle", sync_error: null, updated_by: user.id }).eq("id", source.id);
      source.sync_started_at = syncStartedAt;
    }

    const finishedAt = new Date().toISOString();
    await supabase.from("calendar_provider_connections").update({ last_sync_at: finishedAt, last_error: null, updated_at: finishedAt }).eq("id", connection.id);
    return jsonResponse({ ok: true, connectionId: connection.id, connection: publicConnection({ ...connection, last_sync_at: finishedAt, updated_at: finishedAt }), sources, eventsUpserted, eventsCancelled });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return jsonResponse({ ok: false, code: message === "missing_google_token" ? "missing_google_token" : "google_calendar_sync_failed", error: message, needsOAuthReconnect: message === "missing_google_token" }, 400);
  }
});
