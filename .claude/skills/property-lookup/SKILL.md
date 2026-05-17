---
name: property-lookup
description: Looks up property details (living area sqft, base sqft, garage sqft, year built, construction type) from a Florida county property appraiser site for use in homeowner insurance quotes. Use whenever the user gives an address and asks for property details, square footage, appraiser info, or quote data. Routes the lookup to the correct county skill (Collier, Lee, Charlotte, Sarasota, or Hendry) based on the city/zip in the address.
---

# Property Lookup (Florida appraiser sites)

Entry point for "pull property details for a homeowner quote from address X."

## What this returns

A structured block of fields used to price a homeowner policy:

- `owner_name`
- `parcel_id` (STRAP / folio / parcel number — county-specific name)
- `site_address`
- `living_area_sqft` (heated/cooled — sometimes called "Living Area", "Heated Area", "Adjusted Building Area")
- `base_area_sqft` (1st-floor footprint — sometimes "Base", "Main Living", "Building Sub Area BAS")
- `garage_sqft` (sometimes "Garage", "Attached Garage", "FGR", "GAR")
- `total_under_roof_sqft` (all areas under roof — living + garage + lanai + porches)
- `year_built` (actual year built; note if "effective year built" differs)
- `stories`
- `construction_type` (e.g., CBS / Masonry / Frame)
- `roof_type` / `roof_material` (if listed)
- `roof_year` (if a roof permit year is shown — often only via permits tab)
- `bedrooms`
- `bathrooms`
- `pool` (Y/N, plus pool sqft if listed)
- `appraiser_url` (deep link back to the property record so the user can verify)

## Workflow

1. **Parse the address.** Pull out street, city, state, zip.
2. **Resolve county.** Map the city (and zip as tiebreaker) to a county using the table below. If ambiguous (Englewood spans Sarasota and Charlotte; some 339xx zips cross Lee/Charlotte), ask the user which county.
3. **Invoke the county-specific skill** — they hold the URL and search workflow:
   - Collier → `property-lookup-collier`
   - Lee → `property-lookup-lee`
   - Charlotte → `property-lookup-charlotte`
   - Sarasota → `property-lookup-sarasota`
   - Hendry → `property-lookup-hendry`
4. **Present the structured fields** back to the user.
5. **Offer to push to Jobber.** If the user confirms (or already asked for it), use the `property-to-jobber` skill to attach the data to a Jobber client/request/quote.

## City → county map

| City                                                                                  | County    |
| ------------------------------------------------------------------------------------- | --------- |
| Naples, Marco Island, Immokalee, Ave Maria, Everglades City                           | Collier   |
| Fort Myers, Cape Coral, Bonita Springs, Estero, Lehigh Acres, Sanibel, Captiva, North Fort Myers, Fort Myers Beach, Boca Grande (Lee side), Alva, Buckingham, Pine Island, Matlacha, St. James City | Lee       |
| Punta Gorda, Port Charlotte, Rotonda West, Placida, El Jobean, Charlotte Harbor, Englewood (Charlotte side, ~33981) | Charlotte |
| Sarasota, North Port, Venice, Osprey, Nokomis, Laurel, Siesta Key, Longboat Key (Sarasota side), Englewood (Sarasota side, ~34223/34224) | Sarasota  |
| Clewiston, LaBelle, Felda, Port LaBelle, Harlem, Pioneer                              | Hendry    |

## Zip → county fallback (when city is missing or ambiguous)

| Zip range          | Likely county |
| ------------------ | ------------- |
| 34101–34120, 34137–34146 (Naples, Marco, Immokalee) | Collier |
| 33900–33994 (Fort Myers, Cape Coral, etc.) — except as noted | Lee |
| 33927, 33938, 33947–33955, 33980–33983 (Punta Gorda, Port Charlotte, Rotonda) | Charlotte |
| 34223, 34224 (Englewood north of Tom Adams Br.) | Sarasota |
| 34228, 34229, 34231–34243, 34272, 34275, 34276, 34285, 34286, 34287, 34288, 34289, 34290, 34291, 34292, 34293 | Sarasota |
| 33930 (LaBelle), 33935 (Clewiston) | Hendry |

If the zip falls outside these ranges, tell the user the county isn't supported yet and stop.

## Output format

Always return the data as a fenced code block first (so the user can copy it), then a short human-readable summary:

```yaml
owner_name: SMITH, JOHN A & JANE
parcel_id: 12-34-56-78-00012.3450
site_address: 1234 EXAMPLE LN, NAPLES, FL 34108
county: Collier
living_area_sqft: 2415
base_area_sqft: 2415
garage_sqft: 484
total_under_roof_sqft: 3210
year_built: 2003
stories: 1
construction_type: CBS
roof_material: Concrete Tile
bedrooms: 3
bathrooms: 2.5
pool: Y
appraiser_url: https://www.collierappraiser.com/...
```

## Notes / gotchas

- "Living area" vs "base area" vs "total area" is named inconsistently across counties. Use the county skill's mapping — do NOT guess by name only.
- If only "Total Area" is listed (no living/base split), report what's there and flag it: `living_area_sqft: unknown — only total area (3210) listed`.
- If multiple buildings on one parcel (common for ag/farms or duplexes), list each and ask the user which structure to quote.
- Some sites are JS-heavy. If a plain `WebFetch` returns no data, retry with `firecrawl_scrape_page` and set `waitFor: 3000`.
- Some sites use captchas or POST-only forms. The per-county skill will note this and may direct you to manually copy the URL after a search.
