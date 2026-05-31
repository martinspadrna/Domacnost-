# Domácnost+ Cloud v1.2 (911)

## Hotovo

- Supabase struktura pro modul Nákupy.
- Společné číselníky jednotek: ks, g, kg, ml, l, balení, krabice, láhev, plechovka, role, sáček, m, jiné.
- Globální startovní kategorie a katalog položek.
- Vlastní katalogové položky se ukládají s `household_id`, takže se nepropíšou do jiných domácností.
- Nákupní seznamy a položky jsou oddělené podle `household_id`.
- Frontend má upravený formulář pro výběr z katalogu, množství a jednotku.

## Důležité

Globální katalog slouží jen jako startovní základ. Vlastní položky přidané uživatelem patří vždy konkrétní domácnosti.

## Další plán

- Sync změny stavu položek Hotovo/Vrátit do Supabase.
- Lepší našeptávání podle často používaných položek.
- Rychlé přidání posledních/favoritních položek.
