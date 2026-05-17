---
name: property-lookup-charlotte
description: Looks up a property on the Charlotte County (FL) Property Appraiser site (ccappraiser.com) by address and extracts living area, base, garage square footage, year built, construction type, and other fields used for a homeowner insurance quote. Use for any address in Punta Gorda, Port Charlotte, Rotonda West, Placida, El Jobean, Charlotte Harbor, or the Charlotte-side of Englewood (~33981).
---

# Charlotte County Property Lookup

County appraiser: **Charlotte County Property Appraiser (CCPA)**
Base URL: https://www.ccappraiser.com/

## Search workflow

### Step 1 — search by address

Real Property search entry: https://www.ccappraiser.com/RPSearchEnter.asp

The form posts to a results page. Use:

```
firecrawl_scrape_page
  url: https://www.ccappraiser.com/RPSearchEnter.asp
  instructions: "Select the 'Search by Address' option. Enter the street number and street name (no suffix, no direction). Submit the search. From the results list, click the parcel whose 'Situs Address' best matches <full address>. Return the full property record page."
  waitFor: 4000
  formats: ["markdown"]
  output_hint: "Owner name, account/parcel number, situs address, year built, total living area, building footprint/base area, garage area, construction, roof, beds, baths, pool, and the detail URL."
```

If the address search returns too many results, retry by selecting 'Search by Owner' with just the owner's last name if known.

### Step 2 — parse the detail page

Charlotte's detail page is organized by section. Field mapping:

| Charlotte label                      | Output field            |
| ------------------------------------ | ----------------------- |
| Account Number / Parcel ID           | `parcel_id`             |
| Owner Name                           | `owner_name`            |
| Situs Address                        | `site_address`          |
| Year Built                           | `year_built`            |
| Total Living Area (TLA)              | `living_area_sqft`      |
| Total Area Under Roof                | `total_under_roof_sqft` |
| Sub-Areas → Base / Main Living (`BAS`) | `base_area_sqft`      |
| Sub-Areas → Garage (`FGR`, `GAR`, `AGR`) | `garage_sqft`       |
| Exterior Wall                        | `construction_type`     |
| Roof Cover                           | `roof_material`         |
| # of Stories                         | `stories`               |
| Bedrooms                             | `bedrooms`              |
| Bathrooms                            | `bathrooms`             |
| Pool (Extra Features)                | `pool`                  |

### Step 3 — capture the deep link

Detail URLs look like `https://www.ccappraiser.com/Show_Parcel.asp?acct=<account_number>`. Save as `appraiser_url`.

## Gotchas

- **Hurricane Ian impact:** many Charlotte properties have rebuild/repair permits from 2022 onward. If a `roof_year` or recent permit is visible, capture it — underwriters specifically care.
- Some older records list living area only as part of "Improvements" / "Building Information". If you don't see "Total Living Area", look under "Building 1" → "Heated Area".
- Rotonda West has many vacant lots — if the lookup returns no building, return `building: none, vacant lot — confirm with user before quoting`.
- The site may redirect mobile users — use desktop UA (the default for firecrawl).
- Englewood addresses: the 33981 zip is Charlotte; 34223/34224 are Sarasota. Always verify the county first.
