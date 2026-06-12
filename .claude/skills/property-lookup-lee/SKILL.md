---
name: property-lookup-lee
description: Looks up a property on the Lee County (FL) Property Appraiser site (leepa.org) by address and extracts living area, base, garage square footage, year built, construction type, and other fields used for a homeowner insurance quote. Use for any address in Fort Myers, Cape Coral, Bonita Springs, Estero, Lehigh Acres, Sanibel, Captiva, North Fort Myers, Fort Myers Beach, Pine Island, Alva, or Buckingham.
---

# Lee County Property Lookup

County appraiser: **Lee County Property Appraiser (LCPA)**
Base URL: https://www.leepa.org/

## Search workflow

### Primary: search-then-deep-link (no browser needed — verified working)

**Key fact:** `https://www.leepa.org/Display/DisplayParcel.aspx?FolioID=NNNNNNNN` is a **plain GET** that renders the full parcel record to ordinary scrapers. Only the *search form* needs a browser; the detail page does not. `?STRAP=` does **not** work ("Invalid Search Request") — FolioID is the only deep-link key.

1. **Find the parcel via web search** — `firecrawl_search_data` with:
   ```
   "<street number> <street name>" <city> parcel OR STRAP OR folio OR APN
   ```
   - Zillow/Realtor snippets give the STRAP (e.g. `274425P30060G2510` / `27-44-25-P3-0060G.2510`) plus sqft, beds, baths for cross-checking.
   - **City of Fort Myers / Cape Coral permit PDFs** in results often contain the numeric FolioID directly *and* roof permit history (e.g. "Remove Existing Tile Roof and Replace…" + date = `roof_year`).
   - If no FolioID surfaced, run a second search: `site:leepa.org <street number> <street name>` — Google has many DisplayParcel pages indexed with FolioID in the URL.
2. **Scrape the detail page** — `firecrawl_scrape_page` on `https://www.leepa.org/Display/DisplayParcel.aspx?FolioID=NNNNNNNN` (use `waitFor: 3000`).
3. **Read the "Certified Roll Data" block** — the page dumps the DOR NAL fields as `F01:`–`F92:`. Verified mappings:

   | NAL field | Meaning                     | Output field        |
   | --------- | --------------------------- | ------------------- |
   | F01       | County code (46 = Lee)      | —                   |
   | F02       | Parcel ID (STRAP, compact)  | `parcel_id`         |
   | F08       | Just value ($)              | `just_value`        |
   | F38       | Land value ($)              | —                   |
   | F41       | Land sqft                   | `lot_sqft`          |
   | F44       | Actual year built           | `year_built`        |
   | F45       | Effective year built        | report if ≠ F44     |
   | F47       | Living/under-roof area — **verify against listing sqft from step 1** (NAL says TOT_LVG_AREA but observed values run high, may include garage) | `living_area_sqft` (flag if it disagrees with listings) |
   | F51       | Owner of record             | `owner_name`        |
   | F52/F54/F56 | Site address / city / zip | `site_address`      |
   | F65       | Subdivision name            | —                   |

   The page links the official field legend: https://www.leepa.org/TaxRoll/DOR_NAL_Field_Info.pdf — scrape it once if an F-field is ambiguous.
4. **Beds/baths/garage sub-areas:** the interactive Building/Construction sections are JS-collapsed and may not render in the scrape. Take beds/baths/living sqft from the step-1 listing snippets (they all source LEEPA anyway), and try the printable cost card `https://fieldcards.leepa.org/CurrentCostCard/Folio/NNNNNNNN` for the BAS/FGR sub-area table — note that server is slow and often times out; treat it as best-effort.
5. Save the DisplayParcel URL as `appraiser_url`.

### Fallback: drive the search form (Playwright MCP, if available)

leepa.org's search is ASP.NET WebForms with `__VIEWSTATE` postbacks — direct GETs to `PropertySearch.aspx?StrNumber=...` just render the empty form.

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
