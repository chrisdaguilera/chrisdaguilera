---
name: property-lookup-hendry
description: Looks up a property on the Hendry County (FL) Property Appraiser site (hendryprop.com) by address and extracts living area, base, garage square footage, year built, construction type, and other fields used for a homeowner insurance quote. Use for any address in Clewiston, LaBelle, Port LaBelle, Felda, Harlem, or Pioneer.
---

# Hendry County Property Lookup

County appraiser: **Hendry County Property Appraiser (HCPA)**
Base URL: https://hendryprop.com/

## Search workflow

### Step 1 — search by address

Property search page: https://hendryprop.com/property-search/

Hendry uses a Grizzly Logic / qPublic-style search backend. Use:

```
firecrawl_scrape_page
  url: https://hendryprop.com/property-search/
  instructions: "Use the address search. Enter the street number and street name (no suffix, no direction). Submit. From the results list, click the parcel whose Site Address matches <full address>. Return the full parcel detail / property card page."
  waitFor: 4000
  formats: ["markdown"]
  output_hint: "Owner, parcel ID, site address, year built, heated/living area, total area under roof, base area, garage area, exterior wall, roof, stories, beds, baths, pool, and the parcel detail URL."
```

If the on-site search fails, fall back to a Google site-scoped search:
```
firecrawl_search_data
  query: "site:hendryprop.com <street number> <street name> <city>"
```
…then scrape the first result.

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
