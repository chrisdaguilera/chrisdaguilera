---
name: property-lookup-lee
description: Looks up a property on the Lee County (FL) Property Appraiser site (leepa.org) by address and extracts living area, base, garage square footage, year built, construction type, and other fields used for a homeowner insurance quote. Use for any address in Fort Myers, Cape Coral, Bonita Springs, Estero, Lehigh Acres, Sanibel, Captiva, North Fort Myers, Fort Myers Beach, Pine Island, Alva, or Buckingham.
---

# Lee County Property Lookup

County appraiser: **Lee County Property Appraiser (LCPA)**
Base URL: https://www.leepa.org/

## Search workflow

**Important:** leepa.org is an ASP.NET WebForms site with `__VIEWSTATE` postbacks. Direct GETs to `PropertySearch.aspx?StrNumber=...&StrName=...` will NOT execute a search — they just render the empty form. You must drive the form via a browser MCP.

### Step 1 — search by address (Playwright MCP)

Follow the shared browser-navigation pattern in `property-lookup` SKILL.md. Lee-specific notes:

- **Search URL:** `https://www.leepa.org/Search/PropertySearch.aspx`
- **Search mode:** the search page has tabs near the top (Parcel/STRAP, Owner, Address, etc.). Click the **Address** tab. Within Address, there's also a sub-toggle for "Site Info" vs "Owner Info" — leave it on **Site Info**.
- **Inputs to fill:**
  - "Street Number" → the number from the address
  - "Street Name" → the name only (no `RD`, `ST`, `CIR`, `BLVD`, `N`, `S`, etc.)
  - "Postal Code" → optional but recommended when you have it
- **Submit:** the "Search" / "Submit" button. There is no Enter-key fallback — you must click.
- **Results table:** click the **STRAP number link** (not the address column) of the row whose Site Address matches.
- **Detail page URL:** will look like `https://www.leepa.org/Display/DisplayParcel.aspx?FolioID=NNNNNNNN` once you land on it — that's the value to save as `appraiser_url`.

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
