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
async function readBody(req: Request) { try { return await req.json(); } catch (_) { return {}; } }
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
async function decryptStored(value = "") {
  const [ivPart, dataPart] = value.split(":");
  if (!ivPart || !dataPart) throw new Error("Invalid stored token");
  const raw = b64ToBytes(requireEnv("GOOGLE_TOKEN_ENCRYPTION_KEY_BASE64"));
  if (raw.byteLength !== 32) throw new Error("Invalid encryption key");
  const key = await crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["decrypt"]);
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: b64ToBytes(ivPart) }, key, b64ToBytes(dataPart));
  return new TextDecoder().decode(decrypted);
}
function publicConnection(row: any, tokenState = "unknown") {
  return { id: row.id, householdId: row.household_id, profileId: row.profile_id, provider: row.provider, googleAccountEmail: row.google_account_email, scopes: row.scopes || [], status: row.status, tokenState, lastSyncAt: row.last_sync_at, lastError: row.last_error || "", createdAt: row.created_at, updatedAt: row.updated_at };
}
async function markMissingToken(supabase: ReturnType<typeof serviceClient>, connectionId: string) {
  await supabase.from("calendar_provider_connections").update({ status: "error", last_error: "missing_google_token", oauth_state: null, updated_at: new Date().toISOString() }).eq("id", connectionId);
}
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const supabase = serviceClient();
    const user = await getUserFromRequest(req, supabase);
    const body = await readBody(req) as Record<string, unknown>;
    const householdId = String(body.householdId || "");
    await assertHouseholdMember(supabase, householdId, user.id);
    const { data: rows, error: connectionError } = await supabase.from("calendar_provider_connections").select("id,household_id,profile_id,user_id,provider,google_account_email,scopes,status,last_sync_at,last_error,created_at,updated_at").eq("household_id", householdId).eq("user_id", user.id).eq("provider", "google").eq("status", "connected").order("updated_at", { ascending: false }).limit(5);
    if (connectionError) throw connectionError;
    for (const connection of rows || []) {
      const { data: secretData, error: secretError } = await supabase.rpc("get_calendar_provider_connection_secret", { p_connection_id: connection.id });
      if (secretError) throw secretError;
      const secret = Array.isArray(secretData) ? secretData[0] : secretData;
      if (!secret?.access_token_encrypted) continue;
      const accessToken = await decryptStored(secret.access_token_encrypted);
      const response = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList?minAccessRole=reader&showHidden=false", { headers: { authorization: `Bearer ${accessToken}` } });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error?.message || "Google Calendar request failed");
      const calendars = (data.items || []).map((item: any) => ({ id: item.id, summary: item.summary, description: item.description || "", primary: Boolean(item.primary), accessRole: item.accessRole || "", backgroundColor: item.backgroundColor || "", foregroundColor: item.foregroundColor || "", selected: Boolean(item.selected) }));
      return jsonResponse({ ok: true, connection: publicConnection(connection, "ready"), calendars });
    }
    if ((rows || []).length) {
      await markMissingToken(supabase, rows[0].id);
      return jsonResponse({ ok: false, code: "missing_google_token", error: "Google účet je přihlášený, ale kalendářový token není uložený. Použij Připojit Google kalendář.", needsOAuthReconnect: true, connection: publicConnection({ ...rows[0], status: "error", last_error: "missing_google_token" }, "missing") });
    }
    return jsonResponse({ ok: false, code: "google_calendar_not_connected", error: "Google kalendář zatím není napojený. Použij Připojit Google kalendář.", needsOAuthReconnect: true });
  } catch (error) {
    return jsonResponse({ ok: false, code: "google_calendar_list_failed", error: error instanceof Error ? error.message : String(error) });
  }
});
