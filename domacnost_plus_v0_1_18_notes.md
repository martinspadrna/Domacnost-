# Domácnost+ v.0.1_18

## Hotovo
- Garáž: editace existujícího tankování.
- Garáž: editace existujícího servisu/nákladu.
- Cloud: editace tankování/servisu se propisuje do Supabase, pokud má záznam cloudId.
- Fuelio: přidaná volba Importovat lokálně nebo Importovat + uložit do cloudu.
- Fuelio: cloud import synchronizuje jen nově importované záznamy a auta.
- Fuelio: stabilnější source hash pro ochranu proti duplicitám používá cloudId/název auta místo čistě lokálního id.
- Nákupy: zachovaná oprava duplicitního přepnutí Hotovo z v.0.1_17.

## Poznámka
- Garáž má pořád lokální fallback. Když není domácnost napojená na cloud, editace a import fungují lokálně.
- Fuelio import přes cloud je vhodný testovat nejdřív na malém exportu.
