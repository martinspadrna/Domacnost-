# Domácnost+ v.0.1_82 – ČHMÚ počasí

Tahle verze přidává první bezpečný krok pro počasí z ČHMÚ přes Supabase Edge Function.
Frontend nečte ČHMÚ jako hlavní zdroj napřímo, ale volá vlastní backend funkci:

```txt
weather-chmi-forecast
```

## Nasazení funkce

```bash
supabase functions deploy weather-chmi-forecast --project-ref cgshssdjgzzuprlwnabl
```

Funkce nepotřebuje žádný tajný API klíč. Čte veřejná ČHMÚ Open Data:

```txt
https://opendata.chmi.cz/meteorology/weather/forecast/now/
https://opendata.chmi.cz/meteorology/weather/forecast/metadata/chmi_forecast_schema_doc.html
```

## Jak to v aplikaci funguje

- Nastavení počasí je pořád v Nastavení → Home / dashboard.
- Výchozí zdroj je `ČHMÚ`.
- Když Edge Function není nasazená, nebo ČHMÚ změní formát / dočasně neodpoví, frontend automaticky použije Open-Meteo fallback.
- Home se kvůli počasí nesmí rozbít.
- Do `households.weather_location` se ukládá i `source`, například:

```json
{
  "name": "Hostinné",
  "country": "CZ",
  "latitude": 50.5407,
  "longitude": 15.7233,
  "source": "chmi"
}
```

## Poznámka k přesnosti

ČHMÚ předpovědní JSON je textově/regionově orientovaný. V téhle první verzi funkce vybírá region podle názvu/souřadnic a normalizuje textovou předpověď do formátu, kterému rozumí frontend.

Další krok může být přesnější mapování nejbližší stanice z ČHMÚ aktuálních měření a spojení:

- aktuální stav ze stanice,
- regionová textová předpověď,
- výstrahy ČHMÚ.
