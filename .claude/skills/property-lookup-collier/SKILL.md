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

### Step 1 — search by address

Use `firecrawl_scrape_page` with the search page URL and an `instructions` field that submits the address. Example:

```
url: https://www.collierappraiser.com/parcel-search/
instructions: "Enter the street number and street name from this address into the address search, submit, then click the first matching result and return the full property detail page."
waitFor: 3000
formats: ["markdown"]
output_hint: "Property record page including owner name, folio number, site address, building information table (year built, living area, base area, garage area, total area, construction type, stories, bedrooms, bathrooms), and the URL of the detail page."
```

If the form is too JS-heavy and the scrape fails, fall back to a Google search scoped to the site:
```
firecrawl_search_data
  query: "site:collierappraiser.com <street number> <street name>"
```
…then scrape the first result's URL directly.

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
