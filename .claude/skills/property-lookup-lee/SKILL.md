---
name: property-lookup-lee
description: Looks up a property on the Lee County (FL) Property Appraiser site (leepa.org) by address and extracts living area, base, garage square footage, year built, construction type, and other fields used for a homeowner insurance quote. Use for any address in Fort Myers, Cape Coral, Bonita Springs, Estero, Lehigh Acres, Sanibel, Captiva, North Fort Myers, Fort Myers Beach, Pine Island, Alva, or Buckingham.
---

# Lee County Property Lookup

County appraiser: **Lee County Property Appraiser (LCPA)**
Base URL: https://www.leepa.org/

## Search workflow

Lee has the best URL-driven search of the five counties — you can hit search results directly.

### Step 1 — search by address

Property search page: https://www.leepa.org/search/propertysearch.aspx

Lee supports a URL with query parameters once you've done a search (the page does a server postback that sets the form, then you click a STRAP link). The reliable approach is:

```
firecrawl_scrape_page
  url: https://www.leepa.org/search/propertysearch.aspx
  instructions: "Click the 'Address' search tab. Enter the street number into 'Street Number' and the street name (no suffix, no direction) into 'Street Name'. If the city is known, select it from the City dropdown. Submit the search. From the results table, click the STRAP number whose Site Address matches <full address>. Return the full property record page."
  waitFor: 4000
  formats: ["markdown"]
  output_hint: "Owner, STRAP, site address, year built, total living area, total area under roof, garage area, construction, roof, beds, baths, pool, and the detail page URL."
```

If multiple results, prefer the row whose Site Address exactly matches the input street number and street name.

### Step 2 — drill into "Building/Construction" and "Sub Areas"

The detail page has tabs / collapsible sections:
- **Property Description** — STRAP, folio, owner, site address
- **Building/Construction** — year built, exterior wall, roof cover, stories, beds, baths, total living area
- **Building Sub Areas** — table with codes and square footages (this is where base/garage come from)

Field mapping:

| Lee label                              | Output field            |
| -------------------------------------- | ----------------------- |
| STRAP                                  | `parcel_id`             |
| Folio ID                               | (keep as `folio_id`)    |
| Owner Of Record                        | `owner_name`            |
| Site Address                           | `site_address`          |
| Year Built                             | `year_built`            |
| Effective Year Built                   | report if ≠ year_built  |
| Total Living Area                      | `living_area_sqft`      |
| Total Area Under Roof                  | `total_under_roof_sqft` |
| Sub Area code `BAS` / `Base Area`      | `base_area_sqft`        |
| Sub Area code `FGR` / `GAR` / `Finished Garage` | `garage_sqft`  |
| Exterior Walls                         | `construction_type`     |
| Roof Cover                             | `roof_material`         |
| Stories                                | `stories`               |
| Bedrooms                               | `bedrooms`              |
| Total Bathrooms                        | `bathrooms`             |
| Pool (under Extra Features)            | `pool`                  |

### Step 3 — capture the deep link

Lee's detail page is `propertydetails.aspx?FolioID=XXXXXXX`. Save as `appraiser_url`.

### Optional — pull roof permit year

Lee also lists permits on the detail page. If a "Re-Roof" or "Roof" permit is shown, capture the most recent permit year as `roof_year` (this is gold for the homeowner quote since underwriters want roof age).

## Gotchas

- Cape Coral has many duplicate street names — always include the city in the search.
- Sanibel uses "Sanibel" not "Sanibel Island" in the City dropdown.
- Some new construction shows up with the building data blank for the first 6–12 months; flag `living_area_sqft: unknown — new construction, building data not yet assessed`.
- Lee's "Total Living Area" is the heated/cooled total; "Total Area Under Roof" includes garage and lanai.
- Mobile/manufactured homes have a different section ("Mobile Home Information") — use it instead of "Building/Construction".
