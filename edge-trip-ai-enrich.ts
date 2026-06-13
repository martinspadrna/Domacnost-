import "jsr:@supabase/functions-js/edge-runtime.d.ts";

type SourceItem = { title?: string; url?: string };

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
      "Connection": "keep-alive",
    },
  });
}

function sanitizeText(value: unknown, maxLength = 300) {
  return String(value ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function normalizeUrl(value: unknown) {
  const raw = sanitizeText(value, 500);
  if (!raw) return "";
  try {
    const url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    if (!["http:", "https:"].includes(url.protocol)) return "";
    return url.toString().slice(0, 500);
  } catch (_) {
    return "";
  }
}

function readOutputText(data: any) {
  if (typeof data?.output_text === "string") return data.output_text;
  const chunks: string[] = [];
  for (const item of data?.output || []) {
    for (const content of item?.content || []) {
      if (typeof content?.text === "string") chunks.push(content.text);
      if (typeof content?.output_text === "string") chunks.push(content.output_text);
    }
  }
  return chunks.join("\n");
}

function parseJsonFromText(text: string) {
  const trimmed = text.trim();
  try { return JSON.parse(trimmed); } catch (_) {}
  const first = trimmed.indexOf("{");
  const last = trimmed.lastIndexOf("}");
  if (first >= 0 && last > first) return JSON.parse(trimmed.slice(first, last + 1));
  throw new Error("AI nevrátila čitelný JSON");
}

function normalizeSources(value: unknown): SourceItem[] {
  if (!Array.isArray(value)) return [];
  return value.map((source: any) => ({
    title: sanitizeText(source?.title || source?.name || source?.url, 220),
    url: normalizeUrl(source?.url || source?.link),
  })).filter((source) => source.title || source.url).slice(0, 8);
}

function resultToTrip(result: any, fallback: { place: string; date: string; startLocation: string }) {
  const openingHours = typeof result?.openingHours === "object" ? result.openingHours?.text : result?.openingHours;
  const tickets = typeof result?.tickets === "object" ? result.tickets?.text : (result?.ticketPrices || result?.prices);
  const route = typeof result?.route === "object" ? result.route?.text : result?.route;
  const weather = typeof result?.weather === "object" ? result.weather?.text : result?.weather;
  const warnings = Array.isArray(result?.warnings) ? result.warnings.filter(Boolean).join(" · ") : result?.warning;
  const packing = Array.isArray(result?.packingChecklist) && result.packingChecklist.length ? `Co vzít: ${result.packingChecklist.filter(Boolean).join(", ")}` : "";
  const tips = [result?.summary, result?.food, result?.childTips, packing].map((item) => sanitizeText(item, 900)).filter(Boolean).join("\n");
  return {
    place: sanitizeText(result?.place || fallback.place, 180),
    date: sanitizeText(result?.date || fallback.date, 20),
    startLocation: sanitizeText(result?.startLocation || fallback.startLocation, 180),
    openingHours: sanitizeText(openingHours, 1200),
    ticketPrices: sanitizeText(tickets, 1200),
    route: sanitizeText(route, 1200),
    weather: sanitizeText(weather, 1200),
    website: normalizeUrl(result?.officialWebsite || result?.website),
    parking: sanitizeText(result?.parking, 1200),
    tips: sanitizeText(tips, 1800),
    warning: sanitizeText(warnings, 1200),
    verifiedAt: sanitizeText(result?.checkedAt || result?.verifiedAt || new Date().toISOString(), 80),
    sources: normalizeSources(result?.sources),
  };
}

const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    place: { type: "string" },
    date: { type: "string" },
    summary: { type: "string" },
    officialWebsite: { type: "string" },
    address: { type: "string" },
    openingHours: {
      type: "object",
      additionalProperties: false,
      properties: {
        status: { type: "string", enum: ["found", "not_found", "uncertain", "not_available_yet"] },
        text: { type: "string" },
        verifiedForDate: { type: "string" },
      },
      required: ["status", "text", "verifiedForDate"],
    },
    tickets: {
      type: "object",
      additionalProperties: false,
      properties: {
        status: { type: "string", enum: ["found", "not_found", "uncertain"] },
        text: { type: "string" },
      },
      required: ["status", "text"],
    },
    route: {
      type: "object",
      additionalProperties: false,
      properties: {
        status: { type: "string", enum: ["estimated", "not_enough_data", "not_available"] },
        text: { type: "string" },
      },
      required: ["status", "text"],
    },
    weather: {
      type: "object",
      additionalProperties: false,
      properties: {
        status: { type: "string", enum: ["forecast", "climate_hint", "not_available_yet", "not_available"] },
        text: { type: "string" },
      },
      required: ["status", "text"],
    },
    parking: { type: "string" },
    food: { type: "string" },
    childTips: { type: "string" },
    packingChecklist: { type: "array", items: { type: "string" }, maxItems: 12 },
    warnings: { type: "array", items: { type: "string" }, maxItems: 8 },
    sources: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: { title: { type: "string" }, url: { type: "string" } },
        required: ["title", "url"],
      },
      maxItems: 8,
    },
    checkedAt: { type: "string" },
  },
  required: ["title", "place", "date", "summary", "officialWebsite", "address", "openingHours", "tickets", "route", "weather", "parking", "food", "childTips", "packingChecklist", "warnings", "sources", "checkedAt"],
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ ok: false, error: "method_not_allowed" }, 405);

  const apiKey = Deno.env.get("OPENAI_API_KEY") || Deno.env.get("OPENAI_API_KEY_DOMACNOST");
  if (!apiKey) {
    return jsonResponse({ ok: false, error: "openai_key_missing", message: "AI doplnění výletu není na serveru nastavené. V Supabase secrets doplň OPENAI_API_KEY." }, 501);
  }

  let payload: Record<string, unknown> = {};
  try { payload = await req.json(); } catch (_) { return jsonResponse({ ok: false, error: "invalid_json" }, 400); }

  const place = sanitizeText(payload.place || payload.title, 180);
  const date = sanitizeText(payload.date, 20);
  const startLocation = sanitizeText(payload.startLocation || payload.start, 180);
  const notes = sanitizeText(payload.notes, 1000);
  const existingWebsite = normalizeUrl(payload.website);
  const checklist = Array.isArray(payload.checklist) ? payload.checklist.map((item) => sanitizeText(item, 160)).filter(Boolean).slice(0, 12) : [];

  if (!place) return jsonResponse({ ok: false, error: "missing_place", message: "Vyplň místo výletu." }, 400);
  if (!date || !isValidDate(date)) return jsonResponse({ ok: false, error: "invalid_date", message: "Vyplň datum ve formátu RRRR-MM-DD." }, 400);

  const todayIso = new Date().toISOString().slice(0, 10);
  const target = new Date(`${date}T12:00:00Z`);
  const today = new Date(`${todayIso}T12:00:00Z`);
  const daysAhead = Math.round((target.getTime() - today.getTime()) / 86400000);

  const systemPrompt = "Jsi praktický český plánovač rodinných výletů pro aplikaci Domácnost+. Odpovídej česky. Najdi a shrň jen užitečné ověřitelné informace. Pokud si nejsi jistý cenou, otevírací dobou, parkováním nebo počasím, jasně to označ jako nejisté. Nepředstírej přesnost. Pro počasí: pokud je datum více než cca 14 dní dopředu, nedávej konkrétní předpověď, pouze klimatickou/obecnou poznámku nebo že předpověď ještě není dostupná. U vzdálené budoucnosti zdůrazni nutnost pozdější kontroly. Cestu uváděj jako orientační, pokud není přesně dostupná. Vždy preferuj oficiální zdroje atrakce. Vrať pouze JSON podle schématu.";
  const userPrompt = JSON.stringify({
    task: "Doplň informace k výletu pro domácí zápisník.",
    place,
    date,
    start: startLocation || "nezadáno",
    existingWebsite: existingWebsite || "nezadáno",
    notes: notes || "",
    checklist,
    today: todayIso,
    daysAhead,
    requestedFields: ["otevírací doba", "vstupné", "adresa", "oficiální web", "orientační cesta", "počasí/dostupnost předpovědi", "parkování", "jídlo", "tipy pro děti", "co vzít", "zdroje"],
  });

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: Deno.env.get("OPENAI_TRIP_MODEL") || "gpt-5.5",
        input: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [{ type: "web_search" }],
        text: { format: { type: "json_schema", name: "trip_enrichment", schema: outputSchema, strict: true } },
      }),
    });

    const rawText = await response.text();
    let raw: any = {};
    try { raw = rawText ? JSON.parse(rawText) : {}; } catch (_) {}
    if (!response.ok) {
      console.error("OpenAI trip enrich error", response.status, rawText.slice(0, 1000));
      return jsonResponse({ ok: false, error: "ai_request_failed", status: response.status, message: raw?.error?.message || "AI doplnění se nepovedlo. Zkus to později." }, 502);
    }

    const outputText = readOutputText(raw);
    if (!outputText) return jsonResponse({ ok: false, error: "empty_ai_response", message: "AI nevrátila použitelný výsledek." }, 502);
    const result = parseJsonFromText(outputText);
    const trip = resultToTrip(result, { place, date, startLocation });
    return jsonResponse({ ok: true, result: { ...result, checkedAt: result.checkedAt || new Date().toISOString() }, trip });
  } catch (error) {
    console.error("trip-ai-enrich unexpected error", error);
    return jsonResponse({ ok: false, error: "unexpected_error", message: error instanceof Error ? error.message : "AI doplnění se nepovedlo kvůli chybě serveru." }, 500);
  }
});
