---
name: property-lookup-hendry
description: Looks up a property on the Hendry County (FL) Property Appraiser site (hendryprop.com) by address and extracts living area, base, garage square footage, year built, construction type, and other fields used for a homeowner insurance quote. Use for any address in Clewiston, LaBelle, Port LaBelle, Felda, Harlem, or Pioneer.
---

# Hendry County Property Lookup

County appraiser: **Hendry County Property Appraiser (HCPA)**
Base URL: https://hendryprop.com/

## Search workflow

### Step 1 — search by address (Playwright MCP)

Follow the shared browser-navigation pattern in `property-lookup` SKILL.md. Hendry-specific notes:

- **Search URL:** `https://hendryprop.com/property-search/`
- **Search mode:** the address search is the default mode on this page. If a search-type tab/dropdown is shown, choose "Address".
- **Inputs to fill:**
  - Street Number → number only
  - Street Name → name only (no suffix, no direction)
- **Submit:** the "Search" button.
- **Results list:** click the parcel link whose Site Address matches.
- **Detail page URL:** usually contains a `KeyValue=` or `pid=` parameter — save as `appraiser_url`.

If the on-site search returns nothing or errors out, fall back to a Google site-scoped search via Firecrawl:
```
firecrawl_search_data
  query: "site:hendryprop.com <street number> <street name> <city>"
```
…then `browser_navigate` the first result.

### Step 2 — parse the parcel detail page

Field mapping (Hendry's labels lean toward qPublic conventions):

| Hendry label                         | Output field            |
| ------------------------------------ | ----------------------- |
| Parcel Number / Parcel ID            | `parcel_id`             |
| Owner                                | `owner_name`            |
| Location Address / Site Address      | `site_address`          |
| Actual Year Built                    | `year_built`            |
| Effective Year Built                 | report if ≠ year_built  |
| Heated Area / Living Area            | `living_area_sqft`      |
| Total Area / Gross Area              | `total_under_roof_sqft` |
| Sub-Area `BAS` (Base)                | `base_area_sqft`        |
| Sub-Area `FGR` / `GAR` (Garage)      | `garage_sqft`           |
| Exterior Wall                        | `construction_type`     |
| Roof Cover                           | `roof_material`         |
| Stories                              | `stories`               |
| Bedrooms                             | `bedrooms`              |
| Bathrooms                            | `bathrooms`             |
| Pool (Extra Features)                | `pool`                  |

### Step 3 — capture the deep link

Hendry's parcel detail URL usually contains a `KeyValue=` or `pid=` parameter. Save as `appraiser_url`.

## Gotchas

- Port LaBelle is rural — many parcels are vacant lots or agricultural with no building. If there's no building section, return `building: none — vacant or ag lot, confirm with user before quoting`.
- Clewiston has a substantial number of mobile / manufactured homes — check for "Mobile Home" or "MH" section instead of "Building".
- Hendry's data is less standardized than the coastal counties — if a field is missing, flag it as `unknown` rather than guessing.
- Hurricane Ian and Milton both hit Hendry hard — roof permits are critical for quoting; capture any "Re-roof" permit year as `roof_year`.
