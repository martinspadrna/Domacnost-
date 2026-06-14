// Domácnost+ v0.1_244
// Supabase Edge Function: parcel-discovery-search
// Bezpečný experimentální backend pro Balíky.
// Dopravci většinou neposkytují veřejné API pro výpis všech zásilek jen podle telefonu/e-mailu.
// Funkce proto neobchází privátní endpointy. Umí zpracovat kontaktní údaje,
// vložený text z e-mailu/SMS a rozpoznat čísla zásilek + dopravce.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const CARRIERS = [
  { key: "zasilkovna", name: "Zásilkovna / Packeta", hints: ["zasilkovna", "zásilkovna", "packeta", "z-box", "zbox"], url: "https://tracking.packeta.com/cs/tracking/search?id={code}" },
  { key: "balikovna", name: "Balíkovna / Česká pošta", hints: ["balikovna", "balíkovna", "ceska posta", "česká pošta", "postaonline"], url: "https://www.balikovna.cz/cs/sledovat-balik?parcelNumber={code}" },
  { key: "ppl", name: "PPL", hints: ["ppl", "dhl parcel"], url: "https://www.ppl.cz/vyhledat-zasilku?shipmentId={code}" },
  { key: "dpd", name: "DPD", hints: ["dpd"], url: "https://www.dpd.com/cz/cs/receiving/track/?parcelNumber={code}" },
  { key: "gls", name: "GLS", hints: ["gls"], url: "https://gls-group.com/CZ/cs/sledovani-zasilek?match={code}" },
  { key: "wedo", name: "WE|DO / One by Allegro", hints: ["we|do", "wedo", "one by allegro", "allegro"], url: "https://tracking.wedo.cz/?shipment={code}" },
  { key: "dhl", name: "DHL", hints: ["dhl"], url: "https://www.dhl.com/cz-cs/home/tracking/tracking-parcel.html?submit=1&tracking-id={code}" },
  { key: "ups", name: "UPS", hints: ["ups"], url: "https://www.ups.com/track?tracknum={code}" },
];

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json", "Connection": "keep-alive" },
  });
}

function normalizeText(value: unknown): string {
  return String(value || "").trim();
}

function cleanPhone(value: string): string {
  return value.replace(/[^+\d]/g, "");
}

function extractCodes(text: string): string[] {
  const source = text.replace(/\s+/g, " ");
  const matches = source.match(/\b[A-Z]{0,4}\d[A-Z0-9]{7,30}\b/gi) || [];
  const codes = matches
    .map((item) => item.replace(/[^A-Z0-9]/gi, "").toUpperCase())
    .filter((item) => item.length >= 8 && item.length <= 34)
    .filter((item) => !/^\d{8}$/.test(item));
  return Array.from(new Set(codes));
}

function detectCarrier(code: string, text: string) {
  const lowered = text.toLowerCase();
  const hinted = CARRIERS.find((carrier) => carrier.hints.some((hint) => lowered.includes(hint)));
  if (hinted) return hinted;
  if (/^1Z[0-9A-Z]{16}$/i.test(code)) return CARRIERS.find((carrier) => carrier.key === "ups") || null;
  if (/^JD\d+/i.test(code)) return CARRIERS.find((carrier) => carrier.key === "dhl") || null;
  if (/^4\d{10,13}$/.test(code)) return CARRIERS.find((carrier) => carrier.key === "ppl") || null;
  if (/^13\d{9,12}$/.test(code)) return CARRIERS.find((carrier) => carrier.key === "dpd") || null;
  return null;
}

function buildTrackingUrl(carrier: { url: string } | null, code: string): string {
  if (!carrier) return `https://www.google.com/search?q=${encodeURIComponent(`${code} sledovani zasilky`)}`;
  return carrier.url.replace("{code}", encodeURIComponent(code));
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch (_error) {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const lookup = typeof body.lookup === "object" && body.lookup !== null ? body.lookup as Record<string, unknown> : {};
  const phone = cleanPhone(normalizeText(body.phone ?? lookup.phone));
  const email = normalizeText(body.email ?? lookup.email).toLowerCase();
  const postalCode = normalizeText(body.postalCode ?? body.zip ?? lookup.postalCode ?? lookup.postal_code);
  const address = normalizeText(body.address ?? lookup.address);
  const pastedText = normalizeText(body.text ?? body.pastedText ?? body.sourceText ?? lookup.text ?? lookup.pastedText);
  const consent = Boolean(body.consent ?? body.allowLookup ?? lookup.consent ?? true);

  if (!consent) {
    return json({ ok: false, error: "missing_consent", message: "Pro hledání je potřeba souhlas s použitím telefonu/e-mailu." }, 400);
  }

  if (!phone && !email) {
    return json({ ok: false, error: "missing_contact", message: "Zadej telefon nebo e-mail." }, 400);
  }

  const sourceText = [pastedText, email, phone, postalCode, address].filter(Boolean).join("\n");
  const codes = extractCodes(sourceText);
  const parcels = codes.map((code) => {
    const carrier = detectCarrier(code, sourceText);
    return {
      id: `discovered-${code.toLowerCase()}`,
      trackingNumber: code,
      tracking: code,
      carrier: carrier?.key || "other",
      provider: carrier?.key || "other",
      title: `Zásilka ${code}`,
      status: "new",
      trackingUrl: buildTrackingUrl(carrier || null, code),
      url: buildTrackingUrl(carrier || null, code),
      note: carrier ? `Rozpoznáno jako ${carrier.name}.` : "Dopravce nebyl jistě rozpoznán.",
      source: "parcel-discovery-search",
      confidence: carrier ? 0.72 : 0.45,
    };
  });

  return json({
    ok: true,
    mode: "limited_backend_ready",
    message: parcels.length
      ? "Našel jsem čísla zásilek ve vložených údajích. Přímé vyhledávání u dopravců podle telefonu/e-mailu zatím není dostupné bez jejich oficiálních API."
      : "Podle samotného telefonu/e-mailu se u dopravců nedá veřejně spolehlivě dohledat seznam zásilek. Vlož e-mail/SMS nebo číslo zásilky, případně později napojíme Gmail/IMAP nebo oficiální API dopravců.",
    parcels,
    providers: CARRIERS.map((carrier) => ({
      id: carrier.key,
      label: carrier.name,
      status: "limited",
      message: "Připravené sledování podle čísla; seznam zásilek jen podle kontaktu bez API nevrací."
    })),
    searched: {
      phone: Boolean(phone),
      email: Boolean(email),
      postalCode: Boolean(postalCode),
      address: Boolean(address),
      pastedText: Boolean(pastedText),
      carriers: CARRIERS.map((carrier) => carrier.name),
    },
    limitations: [
      "Dopravci většinou neposkytují veřejné vyhledání všech zásilek jen podle telefonu nebo e-mailu.",
      "Backend proto bez oficiálního API neobchází weby dopravců ani nezkouší privátní endpointy.",
      "Funkční cesta je detekce čísel zásilek z e-mailů/SMS nebo budoucí napojení na Gmail/IMAP/oficiální API.",
    ],
  });
});
