---
name: property-lookup-collier
description: Looks up a property on the Collier County (FL) Property Appraiser site (collierappraiser.com) by address and extracts living area, base, garage square footage, year built, construction type, and other fields used for a homeowner insurance quote. Use for any address in Naples, Marco Island, Immokalee, Ave Maria, or Everglades City.
---

# Collier County Property Lookup

County appraiser: **Collier County Property Appraiser (CCPA)**
Base URL: https://www.collierappraiser.com/

## Search workflow

Collier's site exposes a parcel/address search at:
- Home: https://www.collierappraiser.com/
- Search page: https://www.collierappraiser.com/parcel-search/

It supports address, owner name, and folio (parcel) search.

### Step 1 — search by address (Playwright MCP)

Follow the shared browser-navigation pattern in `property-lookup` SKILL.md. Collier-specific notes:

- **Search URL:** `https://www.collierappraiser.com/parcel-search/`
- **Search mode:** click the "Address" tab if not already selected.
- **Inputs to fill:** street number into "Street #", street name (no suffix, no direction) into "Street Name". City is a dropdown — set it if you know it, leave blank if not.
- **Submit:** the "Search" button.
- **Results row:** click the folio number link whose Site Address matches.

If `browser_*` tools aren't available, fall back to a site-scoped Google search via Firecrawl:
```
firecrawl_search_data
  query: "site:collierappraiser.com <street number> <street name>"
```
…then `browser_navigate` (or scrape) the first result. Note this only works if Google has indexed that exact parcel page — many haven't.

### Step 2 — parse the result

Collier displays a "Building/Extra Features" section that includes a Sub Area table. Field name → output mapping:

| Collier label                          | Output field            |
| -------------------------------------- | ----------------------- |
| Folio Number                           | `parcel_id`             |
| Site Address                           | `site_address`          |
| Owner Name                             | `owner_name`            |
| Year Built (Effective Year Built)      | `year_built` (note effective separately if different) |
| Adjusted Building Area / Living Area   | `living_area_sqft`      |
| Total Area                             | `total_under_roof_sqft` |
| Sub Area `BAS` (Base Area)             | `base_area_sqft`        |
| Sub Area `FGR` / `GAR` (Attached Garage) | `garage_sqft`         |
| Sub Area `FOP` / `FSP` (Open/Screened Porch) | (optional) `porch_sqft` |
| Stories                                | `stories`               |
| Exterior Walls / Construction          | `construction_type`     |
| Roof Cover                             | `roof_material`         |
| Beds                                   | `bedrooms`              |
| Baths                                  | `bathrooms`             |
| Pool (Y/N — listed under Extra Features) | `pool`                |

### Step 3 — record the deep link

After landing on the detail page, capture the URL. It usually contains a `Map` or `FolioID` parameter (e.g., `https://www.collierappraiser.com/main_search/Recorddetail.html?Map=No&FolioID=XXXXXXXXXXX`). Save this as `appraiser_url`.

## Gotchas

- Collier uses "Adjusted Building Area" for the heated/cooled total. Don't confuse it with "Total Area" which adds porches, garage, lanai.
- "Effective Year Built" can be higher than "Year Built" after major renovations — report both if they differ.
- Condos return a different layout — usually the Living Area is on the unit detail, while the building/structure data is on the parent building record.
- Mailing address ≠ site address — always use site address for the quote.
- Pool is listed under "Extra Features" with codes like `SP1` (screen pool) or `PL1` (pool). If not present in extra features, set `pool: N`.
