import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "content-type": "application/json; charset=utf-8" }
  });
}

function requireEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing env ${name}`);
  return value;
}

function serviceClient() {
  return createClient(requireEnv("SUPABASE_URL"), requireEnv("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false }
  });
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
  const { data, error } = await supabase
    .from("household_members")
    .select("role,status")
    .eq("household_id", householdId)
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();
  if (error || !data) throw new Error("No access to household");
}

function normalizeDistributor(value: unknown) {
  const raw = String(value || "").trim().toLowerCase();
  if (["cez", "čez", "cez_distribuce", "cez-distribuce"].includes(raw)) return "cez";
  if (["egd", "eg.d", "eg-d", "eon", "e.on"].includes(raw)) return "egd";
  if (["pre", "pre-distribuce", "predistribuce"].includes(raw)) return "pre";
  return raw || "unknown";
}

function normalizeCode(value: unknown) {
  return String(value || "").toUpperCase().replace(/\s+/g, "").replace(/[^A-Z0-9]/g, "").slice(0, 24);
}

function officialTarget(distributor: string) {
  if (distributor === "cez") return { name: "ČEZ Distribuce", url: "https://www.cezdistribuce.cz/cs/pro-zakazniky/spinani-hdo" };
  if (distributor === "egd") return { name: "EG.D", url: "https://www.egd.cz/hdo" };
  if (distributor === "pre") return { name: "PREdistribuce", url: "https://www.predistribuce.cz/cs/potrebuji-zaridit/sluzby-distribuce/hromadne-dalkove-ovladani/" };
  return { name: "Neznámý distributor", url: "" };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const supabase = serviceClient();
    const user = await getUserFromRequest(req, supabase);
    const body = await readBody(req) as Record<string, unknown>;
    const householdId = String(body.householdId || "");
    await assertHouseholdMember(supabase, householdId, user.id);

    const distributor = normalizeDistributor(body.distributor);
    const code = normalizeCode(body.code || body.hdoCode || body.commandCode);
    if (!code) return jsonResponse({ ok: false, code: "missing_hdo_code", error: "Chybí HDO kód nebo povel." }, 400);

    const target = officialTarget(distributor);
    return jsonResponse({
      ok: true,
      distributor,
      hdoCode: code,
      source: "manual_verification",
      confidence: "pending_user_check",
      windows: [],
      message: "Kód je uložený. Stabilní veřejné API distributora pro automatický import časů není v této verzi použité, proto zatím ověř časy v oficiální kalkulačce a případně je zadej ručně.",
      officialName: target.name,
      officialUrl: target.url,
      canAutoFill: false
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return jsonResponse({ ok: false, code: "hdo_lookup_failed", error: message }, 400);
  }
});
