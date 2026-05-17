---
name: property-lookup-sarasota
description: Looks up a property on the Sarasota County (FL) Property Appraiser site (sc-pa.com) by address and extracts living area, base, garage square footage, year built, construction type, and other fields used for a homeowner insurance quote. Use for any address in Sarasota, North Port, Venice, Osprey, Nokomis, Siesta Key, Laurel, the Sarasota-side of Englewood (~34223/34224), or the Sarasota-side of Longboat Key.
---

# Sarasota County Property Lookup

County appraiser: **Sarasota County Property Appraiser (SCPA)**
Base URL: https://www.sc-pa.com/

## Search workflow

### Step 1 — search by address

Real property search page: https://www.sc-pa.com/search/real-property-search/

The search supports multiple modes (address, owner, parcel, sales). For our use, address:

```
firecrawl_scrape_page
  url: https://www.sc-pa.com/search/real-property-search/
  instructions: "Use the 'Address Search' mode. Enter the street number and street name (no suffix, no direction). Submit. From the results, click the parcel whose Site Address matches <full address>. Return the full Property Card / detail page."
  waitFor: 4000
  formats: ["markdown"]
  output_hint: "Owner, parcel ID, site address, year built, living area (heated), total under roof, base area, garage area, exterior wall, roof, stories, beds, baths, pool, and the property card URL."
```

### Step 2 — parse the property card

Sarasota's "Property Card" has clear sections: Owner, Site Address, Land, Buildings, Extra Features, Sales. Field mapping:

| Sarasota label                       | Output field            |
| ------------------------------------ | ----------------------- |
| Parcel ID                            | `parcel_id`             |
| Owner(s)                             | `owner_name`            |
| Site Address                         | `site_address`          |
| Year Built (under Buildings)         | `year_built`            |
| Effective Year Built                 | report if ≠ year_built  |
| Heated Area / Living Area            | `living_area_sqft`      |
| Total Area Under Roof / Gross Area   | `total_under_roof_sqft` |
| Building Sub-Area → `BAS` (Base)     | `base_area_sqft`        |
| Building Sub-Area → `FGR` / `GAR`    | `garage_sqft`           |
| Exterior Wall                        | `construction_type`     |
| Roof Cover / Roof Material           | `roof_material`         |
| Number of Stories                    | `stories`               |
| Bedrooms                             | `bedrooms`              |
| Bathrooms                            | `bathrooms`             |
| Pool (Extra Features)                | `pool`                  |

### Step 3 — capture the deep link

Sarasota's property card URL is typically `https://www.sc-pa.com/propertysearch/parcel/details/<parcel_id>` or similar. Save as `appraiser_url`.

### Optional — permits / roof year

Sarasota has a "Permits" section on the property card. If a roof permit is listed, capture the most recent year as `roof_year`. Underwriters specifically want this for 10+-year-old homes.

## Gotchas

- North Port is enormous and has many duplicate street names — always include the city in the lookup.
- Some Siesta Key condos return the building-level record first; you need to click into the unit. If only one unit's data appears with no living area, the result is probably the building shell — re-search with the unit number.
- Englewood addresses: the 34223/34224 zips are Sarasota; 33981 is Charlotte. Always verify which side before using this skill.
- Longboat Key spans Sarasota (south) and Manatee (north). If the address is north of Broadway/Gulf of Mexico Drive, it's likely Manatee — not supported by this skill yet, ask the user to confirm.
