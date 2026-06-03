declare const Deno: { serve: (handler: (req: Request) => Response | Promise<Response>) => void };

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const CHMI_FORECAST_INDEX = 'https://opendata.chmi.cz/meteorology/weather/forecast/now/';
const CHMI_FORECAST_SCHEMA_DOC = 'https://opendata.chmi.cz/meteorology/weather/forecast/metadata/chmi_forecast_schema_doc.html';

type WeatherLocation = {
  name?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'content-type': 'application/json; charset=utf-8' },
  });
}

async function readBody(req: Request) {
  try { return await req.json(); } catch (_) { return {}; }
}

function normalizeLocation(value: unknown): Required<WeatherLocation> {
  const raw = value && typeof value === 'object' ? value as WeatherLocation : {};
  const latitude = Number(raw.latitude ?? 50.5407);
  const longitude = Number(raw.longitude ?? 15.7233);
  return {
    name: String(raw.name || 'Hostinné'),
    country: String(raw.country || 'CZ'),
    latitude: Number.isFinite(latitude) ? latitude : 50.5407,
    longitude: Number.isFinite(longitude) ? longitude : 15.7233,
  };
}

function regionCodeForLocation(location: Required<WeatherLocation>) {
  const lat = location.latitude;
  const lon = location.longitude;
  const name = `${location.name || ''}`.toLowerCase();
  if (name.includes('hostinn') || name.includes('vrchlab') || name.includes('trutnov') || name.includes('hradec') || name.includes('krkono')) return 'RPHK';
  if (name.includes('liberec') || name.includes('jablonec')) return 'RPLB';
  if (name.includes('pardubic')) return 'RPPU';
  if (name.includes('ostr') || name.includes('frýd') || name.includes('frenšt')) return 'RPMS';
  if (name.includes('brno')) return 'RPJM';
  if (name.includes('praha')) return 'RPPH';
  if (name.includes('plze')) return 'RPPL';
  if (name.includes('olomouc')) return 'RPOL';
  if (name.includes('zlín') || name.includes('zlin')) return 'RPZL';
  if (name.includes('ústí') || name.includes('usti')) return 'RPUL';
  if (name.includes('české budějovice') || name.includes('ceske budejovice')) return 'RPCB';
  if (name.includes('vysočina') || name.includes('vysocina') || name.includes('jihlava')) return 'RPVY';
  if (lon > 15.0 && lon < 16.7 && lat > 50.0 && lat < 51.2) return 'RPHK';
  if (lon > 14.2 && lon < 15.5 && lat > 50.3) return 'RPLB';
  if (lon > 17.0 && lat > 49.2) return 'RPMS';
  if (lon > 16.0 && lon < 17.4 && lat < 49.5) return 'RPJM';
  return 'RPHK';
}

function latestForecastUrl(indexHtml: string, regionCode: string) {
  const upper = regionCode.toUpperCase();
  const files = [...indexHtml.matchAll(/href="([^"]+\.json)"/gi)]
    .map((match) => match[1])
    .filter((file) => file.toUpperCase().includes(`_${upper}_`));
  const preferred = files.filter((file) => /pCK0tx/i.test(file) || /pCH1tx/i.test(file));
  const candidates = (preferred.length ? preferred : files).sort();
  const file = candidates.at(-1);
  if (!file) throw new Error(`ČHMÚ soubor pro region ${upper} nebyl nalezen`);
  return new URL(file, CHMI_FORECAST_INDEX).toString();
}

function flattenForecastText(data: unknown) {
  const texts: string[] = [];
  function walk(value: unknown) {
    if (!value) return;
    if (Array.isArray(value)) { value.forEach(walk); return; }
    if (typeof value !== 'object') return;
    const raw = value as Record<string, unknown>;
    for (const key of ['displayText', 'text', 'headline']) {
      if (typeof raw[key] === 'string' && raw[key]) texts.push(raw[key] as string);
    }
    Object.values(raw).forEach(walk);
  }
  walk(data);
  return [...new Set(texts.map((text) => text.replace(/\s+/g, ' ').trim()).filter(Boolean))];
}

function codeFromText(text: string) {
  const lower = text.toLowerCase();
  if (lower.includes('bouř')) return 95;
  if (lower.includes('sně') || lower.includes('sneh')) return 71;
  if (lower.includes('déšť') || lower.includes('dest') || lower.includes('přeháň') || lower.includes('prehán')) return 61;
  if (lower.includes('mlh')) return 45;
  if (lower.includes('zataž') || lower.includes('oblačno až zataženo')) return 3;
  if (lower.includes('oblač') || lower.includes('oblac')) return 2;
  if (lower.includes('polojas')) return 2;
  if (lower.includes('jasno')) return 0;
  return 2;
}

function temperatureRangeFromText(text: string) {
  const patterns = [
    /(-?\d{1,2})\s*(?:až|-|az)\s*(-?\d{1,2})\s*°?\s*C/gi,
    /teplot\w*[^\d-]{0,40}(-?\d{1,2})\s*(?:až|-|az)\s*(-?\d{1,2})/gi,
  ];
  for (const pattern of patterns) {
    const match = pattern.exec(text);
    if (!match) continue;
    const a = Number(match[1]);
    const b = Number(match[2]);
    if (Number.isFinite(a) && Number.isFinite(b)) return { min: Math.min(a, b), max: Math.max(a, b) };
  }
  return { min: null as number | null, max: null as number | null };
}

function toDailyForecast(texts: string[], updatedAt: string) {
  const base = new Date(updatedAt || new Date().toISOString());
  return texts.slice(0, 4).map((text, index) => {
    const date = new Date(base);
    date.setDate(base.getDate() + index);
    const range = temperatureRangeFromText(text);
    return {
      date: date.toISOString().slice(0, 10),
      weatherCode: codeFromText(text),
      min: range.min,
      max: range.max,
      precipitation: null,
      sunrise: null,
      sunset: null,
      text,
    };
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);
  try {
    const body = await readBody(req) as { location?: WeatherLocation; regionCode?: string };
    const location = normalizeLocation(body.location);
    const regionCode = String(body.regionCode || regionCodeForLocation(location)).toUpperCase();
    const indexResponse = await fetch(CHMI_FORECAST_INDEX, { cache: 'no-store' });
    if (!indexResponse.ok) throw new Error(`ČHMÚ index HTTP ${indexResponse.status}`);
    const indexHtml = await indexResponse.text();
    const forecastUrl = latestForecastUrl(indexHtml, regionCode);
    const forecastResponse = await fetch(forecastUrl, { cache: 'no-store' });
    if (!forecastResponse.ok) throw new Error(`ČHMÚ forecast HTTP ${forecastResponse.status}`);
    const forecast = await forecastResponse.json();
    const updatedAt = forecast?.datumVytvoreni || forecast?.data?.features?.[0]?.properties?.sent || new Date().toISOString();
    const texts = flattenForecastText(forecast);
    if (!texts.length) throw new Error('ČHMÚ odpověď neobsahuje čitelný text předpovědi');
    const summary = texts[0];
    const daily = toDailyForecast(texts, updatedAt);
    const range = (daily.find((day) => Number.isFinite(day.max) || Number.isFinite(day.min)) || daily[0] || {}) as Partial<{ min: number | null; max: number | null }>;
    const temperature = Number.isFinite(range.max) ? range.max : Number.isFinite(range.min) ? range.min : null;
    return jsonResponse({
      provider: 'chmi',
      regionCode,
      sourceUrl: forecastUrl,
      schemaDoc: CHMI_FORECAST_SCHEMA_DOC,
      weather: {
        location: { ...location, regionCode },
        current: {
          temperature,
          feelsLike: temperature,
          humidity: null,
          windSpeed: null,
          precipitation: null,
          weatherCode: codeFromText(summary),
          time: updatedAt,
          text: summary,
        },
        daily,
        hourly: [],
        updatedAt,
        error: '',
        loading: false,
        source: 'chmi',
      },
    });
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : String(error) }, 400);
  }
});
