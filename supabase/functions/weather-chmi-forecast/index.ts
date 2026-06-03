import "jsr:@supabase/functions-js/edge-runtime.d.ts";

type JsonRecord = Record<string, unknown>;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const CHMI_FORECAST_ROOT = 'https://opendata.chmi.cz/meteorology/weather/forecast/';
const CHMI_FORECAST_NOW_ROOT = 'https://opendata.chmi.cz/meteorology/weather/forecast/now/';
const CHMI_SCHEMA_DOC = 'https://opendata.chmi.cz/meteorology/weather/forecast/metadata/chmi_forecast_schema_doc.html';

const REGIONS = [
  { code: 'RPPH', name: 'Praha', lat: 50.0755, lon: 14.4378, terms: ['praha', 'hmp'] },
  { code: 'RPSC', name: 'Středočeský kraj', lat: 49.8782, lon: 14.9363, terms: ['stredocesk', 'středočesk'] },
  { code: 'RPCB', name: 'Jihočeský kraj', lat: 48.9458, lon: 14.4416, terms: ['jihocesk', 'jihočesk'] },
  { code: 'RPPL', name: 'Plzeňský kraj', lat: 49.7384, lon: 13.3736, terms: ['plzen', 'plzeň'] },
  { code: 'RPKV', name: 'Karlovarský kraj', lat: 50.1435, lon: 12.7502, terms: ['karlovar'] },
  { code: 'RPUL', name: 'Ústecký kraj', lat: 50.6119, lon: 13.7870, terms: ['usteck', 'ústeck'] },
  { code: 'RPLB', name: 'Liberecký kraj', lat: 50.6594, lon: 14.7632, terms: ['liberec', 'jablonec'] },
  { code: 'RPHK', name: 'Královéhradecký kraj', lat: 50.3512, lon: 15.7976, terms: ['kralovehradeck', 'královéhradeck', 'hostinne', 'hostinné', 'trutnov', 'vrchlabi', 'vrchlabí', 'hradec', 'krkonos'] },
  { code: 'RPPD', name: 'Pardubický kraj', lat: 49.9444, lon: 16.2857, terms: ['pardubice', 'pardubick'] },
  { code: 'RPJI', name: 'Kraj Vysočina', lat: 49.4490, lon: 15.6406, terms: ['vysocina', 'vysočina', 'jihlava'] },
  { code: 'RPBM', name: 'Jihomoravský kraj', lat: 49.1240, lon: 16.7666, terms: ['jihomorav', 'brno'] },
  { code: 'RPOL', name: 'Olomoucký kraj', lat: 49.6587, lon: 17.0811, terms: ['olomouc', 'olomouck'] },
  { code: 'RPZL', name: 'Zlínský kraj', lat: 49.2162, lon: 17.7720, terms: ['zlin', 'zlín'] },
  { code: 'RPOS', name: 'Moravskoslezský kraj', lat: 49.7305, lon: 18.2333, terms: ['moravskoslez', 'ostrava', 'frenstat', 'frenštát'] },
];

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=900, s-maxage=900' },
  });
}

function numberOrNull(value: unknown): number | null {
  const number = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
  return Number.isFinite(number) ? number : null;
}

function normalizeTerm(value: string) {
  return value.toLocaleLowerCase('cs-CZ').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function distanceKm(aLat: number, aLon: number, bLat: number, bLon: number) {
  const toRad = (value: number) => value * Math.PI / 180;
  const r = 6371;
  const dLat = toRad(bLat - aLat);
  const dLon = toRad(bLon - aLon);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLon / 2) ** 2;
  return 2 * r * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function pickRegion(text: string, latitude: number, longitude: number) {
  const normalized = normalizeTerm(text || '');
  const exact = REGIONS.find((region) => region.terms.some((term) => normalized.includes(normalizeTerm(term))));
  if (exact) return exact;
  return REGIONS.map((region) => ({ region, distance: distanceKm(latitude, longitude, region.lat, region.lon) })).sort((a, b) => a.distance - b.distance)[0].region;
}

function weatherTextToCode(text: string): number | null {
  const value = normalizeTerm(text);
  if (value.includes('bour')) return 95;
  if (value.includes('sne') || value.includes('snih')) return 71;
  if (value.includes('dest') || value.includes('prehank') || value.includes('srazk')) return 61;
  if (value.includes('mlh')) return 45;
  if (value.includes('jasno') || value.includes('slunecno')) return 0;
  if (value.includes('polojas')) return 2;
  if (value.includes('oblac') || value.includes('zatazen')) return 3;
  return null;
}

function codeToText(code: number | null) {
  if (code === 0) return 'Jasno';
  if (code === 1 || code === 2) return 'Polojasno';
  if (code === 3) return 'Oblačno až zataženo';
  if (code === 45 || code === 48) return 'Mlha';
  if (code && [61, 63, 65, 80, 81, 82].includes(code)) return 'Déšť nebo přeháňky';
  if (code && [71, 73, 75, 85, 86].includes(code)) return 'Sněžení';
  if (code && [95, 96, 99].includes(code)) return 'Bouřky';
  return 'Počasí';
}

function extractDisplayText(value: unknown): string[] {
  const out: string[] = [];
  const walk = (node: unknown) => {
    if (!node || out.length > 18) return;
    if (Array.isArray(node)) return node.forEach(walk);
    if (typeof node !== 'object') return;
    const rec = node as JsonRecord;
    const direct = rec.displayText ?? rec.text ?? rec.forecastText ?? rec.description ?? rec.value;
    if (typeof direct === 'string' && direct.trim().length > 20) out.push(direct.trim().replace(/\s+/g, ' '));
    Object.keys(rec).forEach((key) => !['displayText', 'text', 'forecastText', 'description', 'value'].includes(key) && walk(rec[key]));
  };
  walk(value);
  return Array.from(new Set(out));
}

function pickForecastText(payload: unknown, regionName: string, regionCode: string) {
  const texts = extractDisplayText(payload);
  if (!texts.length) return '';
  const normalizedRegion = normalizeTerm(regionName);
  const normalizedCode = normalizeTerm(regionCode);
  return texts.find((text) => normalizeTerm(text).includes(normalizedRegion) || normalizeTerm(text).includes(normalizedCode)) || texts[0];
}

async function fetchJson(url: string, timeoutMs = 7000): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal, headers: { accept: 'application/json,text/plain,*/*' } });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchText(url: string, timeoutMs = 7000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal, headers: { accept: 'text/html,text/plain,*/*' } });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return await response.text();
  } finally {
    clearTimeout(timer);
  }
}

function extractJsonLinks(html: string) {
  const urls = new Set<string>();
  const rx = /href=["']([^"']+\.json(?:\?[^"']*)?)["']/gi;
  let match: RegExpExecArray | null;
  while ((match = rx.exec(html))) {
    try { urls.add(new URL(match[1], CHMI_FORECAST_NOW_ROOT).toString()); } catch (_) { /* ignore */ }
  }
  return [...urls].sort((a, b) => b.localeCompare(a));
}

async function loadChmi(regionName: string, regionCode: string) {
  const candidates = [
    `${CHMI_FORECAST_ROOT}forecast.json`,
    `${CHMI_FORECAST_NOW_ROOT}forecast.json`,
    `${CHMI_FORECAST_NOW_ROOT}weather-forecast.json`,
    `${CHMI_FORECAST_NOW_ROOT}regional_forecast.json`,
  ];
  for (const url of candidates) {
    try {
      const json = await fetchJson(url);
      const text = pickForecastText(json, regionName, regionCode);
      if (text) return { text, url, code: weatherTextToCode(text) };
    } catch (_) { /* try next */ }
  }
  const listing = await fetchText(CHMI_FORECAST_NOW_ROOT);
  for (const url of extractJsonLinks(listing).slice(0, 10)) {
    try {
      const json = await fetchJson(url);
      const text = pickForecastText(json, regionName, regionCode);
      if (text) return { text, url, code: weatherTextToCode(text) };
    } catch (_) { /* try next */ }
  }
  throw new Error('ČHMÚ předpověď se nepodařilo načíst');
}

async function loadOpenMeteo(latitude: number, longitude: number, name: string) {
  const params = new URLSearchParams({
    latitude: String(latitude), longitude: String(longitude), timezone: 'Europe/Prague', forecast_days: '5',
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset',
    hourly: 'temperature_2m,precipitation,weather_code,wind_speed_10m',
  });
  const payload = await fetchJson(`https://api.open-meteo.com/v1/forecast?${params}`) as JsonRecord;
  const current = (payload.current || {}) as JsonRecord;
  const daily = (payload.daily || {}) as JsonRecord;
  const hourly = (payload.hourly || {}) as JsonRecord;
  const dailyTime = Array.isArray(daily.time) ? daily.time : [];
  const hourlyTime = Array.isArray(hourly.time) ? hourly.time : [];
  const currentCode = numberOrNull(current.weather_code);
  return {
    location: { name, country: 'CZ', latitude, longitude },
    current: {
      temperature: numberOrNull(current.temperature_2m),
      feelsLike: numberOrNull(current.apparent_temperature),
      humidity: numberOrNull(current.relative_humidity_2m),
      windSpeed: numberOrNull(current.wind_speed_10m),
      precipitation: numberOrNull(current.precipitation),
      weatherCode: currentCode,
      time: typeof current.time === 'string' ? current.time : new Date().toISOString(),
      text: codeToText(currentCode),
    },
    daily: dailyTime.slice(0, 5).map((date: unknown, index: number) => ({
      date: String(date),
      weatherCode: numberOrNull((daily.weather_code as unknown[])?.[index]),
      min: numberOrNull((daily.temperature_2m_min as unknown[])?.[index]),
      max: numberOrNull((daily.temperature_2m_max as unknown[])?.[index]),
      precipitation: numberOrNull((daily.precipitation_sum as unknown[])?.[index]),
      sunrise: typeof (daily.sunrise as unknown[])?.[index] === 'string' ? (daily.sunrise as string[])[index] : null,
      sunset: typeof (daily.sunset as unknown[])?.[index] === 'string' ? (daily.sunset as string[])[index] : null,
      text: codeToText(numberOrNull((daily.weather_code as unknown[])?.[index])),
    })),
    hourly: hourlyTime.slice(0, 24).map((time: unknown, index: number) => ({
      time: String(time),
      temperature: numberOrNull((hourly.temperature_2m as unknown[])?.[index]),
      precipitation: numberOrNull((hourly.precipitation as unknown[])?.[index]),
      weatherCode: numberOrNull((hourly.weather_code as unknown[])?.[index]),
      windSpeed: numberOrNull((hourly.wind_speed_10m as unknown[])?.[index]),
    })),
    updatedAt: new Date().toISOString(),
    error: '',
    loading: false,
    source: 'open-meteo-fallback',
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);
  let body: JsonRecord = {};
  try { body = await req.json(); } catch (_) { body = {}; }
  const location = body.location && typeof body.location === 'object' ? body.location as JsonRecord : {};
  const latitude = numberOrNull(body.latitude ?? body.lat ?? location.latitude ?? location.lat) ?? 49.8175;
  const longitude = numberOrNull(body.longitude ?? body.lon ?? location.longitude ?? location.lon) ?? 15.4730;
  const name = String(body.locationName || body.name || location.name || 'Domácnost');
  const region = pickRegion(String(body.region || name), latitude, longitude);
  const warnings: string[] = [];

  let weather = await loadOpenMeteo(latitude, longitude, name);
  weather.location = { ...weather.location, regionCode: region.code, regionName: region.name } as typeof weather.location & { regionCode: string; regionName: string };
  try {
    const chmi = await loadChmi(region.name, region.code);
    const code = chmi.code ?? weather.current.weatherCode;
    weather = {
      ...weather,
      source: 'chmi',
      current: { ...weather.current, weatherCode: code, text: chmi.text },
      daily: weather.daily.map((day: JsonRecord, index: number) => index === 0 ? { ...day, weatherCode: code, text: chmi.text } : day),
      meta: { providerLabel: 'ČHMÚ + číselný fallback', chmiRegion: region.name, chmiRegionCode: region.code, chmiUrl: chmi.url, chmiSchemaDoc: CHMI_SCHEMA_DOC, numericFallback: 'Open-Meteo', warnings },
    } as typeof weather & { meta: JsonRecord };
  } catch (error) {
    warnings.push(error instanceof Error ? error.message : String(error));
    weather = { ...weather, meta: { providerLabel: 'Open-Meteo fallback', chmiRegion: region.name, chmiRegionCode: region.code, numericFallback: 'Open-Meteo', warnings } } as typeof weather & { meta: JsonRecord };
  }
  return jsonResponse(weather);
});
