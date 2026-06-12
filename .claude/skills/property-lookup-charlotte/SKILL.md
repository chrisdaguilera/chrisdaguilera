---
name: property-lookup-charlotte
description: Looks up a property on the Charlotte County (FL) Property Appraiser site (ccappraiser.com) by address and extracts living area, base, garage square footage, year built, construction type, and other fields used for a homeowner insurance quote. Use for any address in Punta Gorda, Port Charlotte, Rotonda West, Placida, El Jobean, Charlotte Harbor, or the Charlotte-side of Englewood (~33981).
---

# Charlotte County Property Lookup

County appraiser: **Charlotte County Property Appraiser (CCPA)**
Base URL: https://www.ccappraiser.com/

## Search workflow

### Primary: search-then-deep-link (no browser needed)

Per the `property-lookup` Strategy A: find the account/parcel number via `firecrawl_search_data` (Zillow/Realtor snippets, or `site:ccappraiser.com <address>`), then `firecrawl_scrape_page` the detail page directly — `https://www.ccappraiser.com/Show_Parcel.asp?acct=<account_number>&gen=T&tax=T&bld=T&oth=T&sal=T&lnd=T&leg=T` is a plain GET (the `&bld=T` etc. flags expand the building/sales/land sections). Cross-check sqft against the listing snippets.

### Fallback: drive the search form (Playwright MCP, if available)

Follow the shared browser-navigation pattern in `property-lookup` SKILL.md. Charlotte-specific notes:

- **Search URL:** `https://www.ccappraiser.com/RPSearchEnter.asp`
- **Search mode:** click / select the **"Search by Address"** option (radio or tab depending on browser width).
- **Inputs to fill:**
  - Street Number → number only
  - Street Name → name only (no suffix, no direction)
- **Submit:** the "Search" button.
- **Results list:** click the parcel link whose **Situs Address** matches.
- **Detail page URL:** looks like `https://www.ccappraiser.com/Show_Parcel.asp?acct=<account_number>` — save as `appraiser_url`.

If the address search returns too many results, retry with **"Search by Owner"** using just the owner's last name (if known).

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
