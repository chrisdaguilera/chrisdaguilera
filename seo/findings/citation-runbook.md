# Citation cleanup runbook — Ideal Insulation

Goal: every directory listing the business shows the **same** name, address, and phone (NAP). Google's local algorithm reads inconsistencies as a trust signal that the business is unclear or low-quality.

## Canonical NAP (paste-ready)

```
Name:    Ideal Insulation
Address: 4950 Golden Gate Pkwy
         Naples, FL  [zip TO_VERIFY — likely 34116]
Phone:   (239) 455-2002
Email:   estimates@idealinsulationinc.com
Website: https://www.idealinsulationinc.com
Hours:   Mon–Fri 7:00 AM – 5:00 PM
         Sat 8:00 AM – 1:00 PM
         Sun closed
```

Use this exact formatting everywhere. Do not abbreviate "Pkwy" to "Parkway" on some directories and not others — pick "Pkwy" everywhere (matches USPS).

## Standard short description (for "About" / "Description" fields)

> Ideal Insulation is Southwest Florida's #1 insulation contractor since 2013. We install spray foam, blown-in, and batt insulation for homes and businesses across Collier, Lee, and Charlotte counties — Naples, Fort Myers, Cape Coral, Bonita Springs, Estero, Marco Island, and beyond. FPL Preferred Contractor (instant $220 rebate processing). Google Guaranteed. Fully licensed and insured. Lifetime transferable workmanship warranty. Free same-day estimates and thermal scans. Bilingual service. Call (239) 455-2002.

(625 chars — fits BBB, Yelp, GBP, etc.)

## Long description (for GBP, Houzz, Angi)

> Ideal Insulation has insulated homes and businesses across Southwest Florida since 2013. Family-run with 9 trucks and 20 certified installers, we handle every project in-house — no subcontractors. Our services include open-cell and closed-cell spray foam, blown-in cellulose and Rockwool, fiberglass batt insulation, attic upgrades, insulation removal, and commercial work. As an FPL Preferred Insulation Contractor, we process the $220 ceiling-insulation rebate instantly at install. We also help homeowners claim the 30% federal Energy Efficient Home Improvement Credit (Section 25C). Every job is backed by a lifetime transferable workmanship warranty. Free same-day estimates and thermal scans across Collier, Lee, and Charlotte counties — Naples, Fort Myers, Cape Coral, Bonita Springs, Estero, Marco Island, Sanibel, Lehigh Acres, Punta Gorda, and Ave Maria. Bilingual English/Spanish service. Google Guaranteed and fully insured. Call (239) 455-2002 or email estimates@idealinsulationinc.com.

## Service categories (use the closest match)

Primary: Insulation contractor
Secondary (where the directory allows multiple): Insulation installation service · Spray foam insulation contractor · Attic insulation service · HVAC contractor (if available) · Energy auditor

---

# Per-directory checklist

Work top-to-bottom. Each entry has: priority, current state (from the audit), action, time estimate.

## 1. Google Business Profile  ⭐ DO FIRST

**Priority**: P0 — drives 80% of local-pack ranking.
**Current state**: not verified by us; need to confirm ownership.
**Action**:
1. Sign in to `https://business.google.com/` with the email that owns the listing.
2. If you don't own it: go to `https://www.google.com/maps/`, search "Ideal Insulation Naples", click "Claim this business", verify by postcard or phone.
3. Once verified, edit and confirm:
   - Name: `Ideal Insulation`
   - Address: `4950 Golden Gate Pkwy, Naples, FL`
   - Phone: `(239) 455-2002`
   - Hours: as above
   - Categories: primary `Insulation contractor`, plus secondaries from the list above
   - Service area: every city in `seo/data/business.yml` `areas_served`
   - Description: paste the long description
   - Services: list every service from `seo/data/business.yml` `services`
   - Attributes: "Online estimates", "Onsite services", "LGBTQ+ friendly" if applicable, "Identifies as Latino-owned" (this is a real attribute and a search filter Google now exposes)
   - Photos: upload 20+ — trucks, crews, before/after attic, FPL/Google Guaranteed badges
4. Turn on messaging.
5. Add 5 Q&A entries seeded with target keywords (e.g. "Do you serve Cape Coral?", "Do you process FPL rebates?", "How much does spray foam cost in Naples?").
6. Set up weekly Posts cadence (announcements, offers, photos).
**Time**: 90 min initial + 30 min/week ongoing.

## 2. Yelp

**Priority**: P0 — listed as "Ideal Insulations" (plural). Wrong name leaks trust to a bunch of citation aggregators.
**Current URL**: `https://www.yelp.com/biz/ideal-insulations-naples`
**Action**:
1. Go to `https://biz.yelp.com/`, sign in or claim the business.
2. Edit business → "Business Information" → change name to **`Ideal Insulation`** (singular).
3. Confirm address `4950 Golden Gate Pkwy, Naples, FL`.
4. Categories: `Insulation Installation` (primary) + `Heating & Air Conditioning/HVAC` if available.
5. Hours, phone, website — match canonical.
6. Upload 10+ photos.
7. Paste short description.
**Note**: Yelp may require human review of name changes. If they reject, submit a support ticket citing the FL Sunbiz registration ("Ideal Insulation Enterprises Inc") as proof — the name on Yelp does not match the legal name.
**Time**: 30 min.

## 3. Yellow Pages — three duplicate listings

**Priority**: P0 — Google reads duplicates as low trust.
**Listings**:
- `https://www.yellowpages.com/naples-fl/mip/ideal-insulation-enterprises-inc-6316310` (zip 34110)
- `https://www.yellowpages.com/naples-fl/mip/ideal-insulation-inc-537773636` (zip 34117)
- `https://www.yellowpages.com/naples-fl/mip/ideal-insulation-inc-462413349` (zip 34116)
**Action**:
1. Go to `https://accounts.yellowpages.com/` and claim each listing in turn (each requires phone verification — they call the listed number).
2. Pick the listing closest to the canonical address (likely the 34116 listing if 4950 Golden Gate Pkwy is in 34116) as the **keeper**.
3. On the two losers: open YP support (`https://help.yellowpages.com/`), submit a "Duplicate listing" request, include URLs of the keeper and the duplicate. They typically merge or remove within 7–14 days.
4. On the keeper: edit name to `Ideal Insulation`, address to `4950 Golden Gate Pkwy`, phone to `(239) 455-2002`. Paste short description.
**Time**: 60 min initial + 5 min/listing follow-up.

## 4. Facebook Business Page

**Priority**: P0 — page name reads "Ideal Insulation Enterprise Inc" (singular, missing "s"). Mismatch with Yelp, Sunbiz, and the website.
**Current URL**: `https://www.facebook.com/Ideal-Insulation-Enterprise-Inc-1222507037825337/`
**Action**:
1. Go to the page → Settings → Page Info → Edit Page Name.
2. Submit name change to **`Ideal Insulation`**. Facebook reviews name changes manually; takes 1–3 days.
3. While waiting, fix Address, Hours, Phone, Website, About, Services to match canonical.
4. Set up a custom URL: `facebook.com/IdealInsulationFL` (only available once page has 25+ likes; if not yet there, do this later).
**Time**: 20 min.

## 5. Florida Sunbiz (state corporate record)

**Priority**: P1 — state record lists `2070 39th St SW, Naples, FL 34117`, not Golden Gate Pkwy. BBB and any contractor-license-board lookup will surface the old address and reintroduce inconsistency.
**Action**:
1. Sign in to `https://efile.sunbiz.org/` with the corporation's filing credentials (or pay $61.25 for a profit-corp annual report amendment).
2. Update Principal Place of Business and Mailing Address to `4950 Golden Gate Pkwy, Naples, FL [zip]`.
3. File the amendment.
**Note**: this is a legal filing — confirm with the registered agent (Ruben Ruiz per the Sunbiz record) before filing.
**Time**: 30 min.

## 6. Better Business Bureau (BBB)

**Priority**: P1 — strong local trust signal, especially for over-50 demographic.
**Action**:
1. Search `https://www.bbb.org/us/fl/naples` for "Ideal Insulation".
2. If a listing exists: claim it via the "Get Accredited" / claim flow, update NAP.
3. If no listing exists: create one (free, but BBB Accreditation costs ~$500/year and is worth it for a contractor — Accredited badge boosts conversion).
**Time**: 30 min initial; accreditation review takes 2–4 weeks.

## 7. Angi (formerly Angie's List)

**Priority**: P1 — homeowner-decision-stage traffic.
**Action**:
1. Go to `https://pro.angi.com/` and claim or create the listing.
2. NAP, services, areas served, photos — match canonical.
3. Decide on paid lead packages later; the free listing is enough for citation purposes.
**Time**: 30 min.

## 8. HomeAdvisor

**Priority**: P1.
**Action**: claim/create at `https://pro.homeadvisor.com/`. Same as Angi (they're the same parent company now).
**Time**: 20 min (or skip if claiming Angi auto-syncs HA — it sometimes does).

## 9. Houzz

**Priority**: P2 — strong for higher-end / new-construction work.
**Action**: claim/create at `https://www.houzz.com/pro/`. Upload 10–20 project photos. NAP must match canonical. Categories: `Insulation`.
**Time**: 30 min.

## 10. Nextdoor Business

**Priority**: P2 — neighborhood-level local SEO and word of mouth.
**Action**: claim at `https://business.nextdoor.com/`. Free. Encourages neighbor recommendations.
**Time**: 20 min.

## 11. FPL Preferred Contractor directory

**Priority**: P1 — confirms the differentiator we lean on in titles and schema.
**Action**: confirm Ideal Insulation is listed at `https://www.fpl.com/save/programs.html` Participating Independent Contractor finder for ZIP codes across SWFL. If listed under a different name or address, request correction via FPL contractor-program contact.
**Time**: 15 min.

## 12. Long-tail directories (batch in one sitting)

These are lower-leverage individually but together form the citation web Google uses to verify identity. Update each to canonical NAP. Most are free to claim; a few require email verification.

- The Blue Book (`https://www.thebluebook.com/`)
- Chamber of Commerce (`https://www.chamberofcommerce.com/`)
- Cortera (`https://start.cortera.com/`) — read-only data feed; submit correction
- Bisprofiles (`https://bisprofiles.com/`)
- Jobbersites (the `idealinsulationenterprisesinc.jobbersites.com` page — confirm it's intentional)
- Manta
- Hotfrog
- Cylex
- Brownbook
- ezlocal
- showmelocal
- LocalStack
- Citysquares
- iBegin
- Foursquare for Business
- Apple Maps Connect (`https://mapsconnect.apple.com/`) — important, separate from Google
- Bing Places (`https://www.bingplaces.com/`)

**Time**: 3–4 hours in one sitting.

---

## Tracking

Maintain `seo/findings/citation-status.csv` (create as you go) with columns:
`directory, listing_url, claimed_y_n, current_name, current_address, current_phone, status (correct|fix-submitted|fixed), last_checked_date`

Re-run a 30-min spot-check monthly: search Google for `"Ideal Insulation" Naples` and skim the first three SERP pages for new or stray listings.

---

## When this is done

You'll know NAP is unified when:
- Google's "Knowledge Panel" for "Ideal Insulation Naples" matches canonical NAP.
- Search "Ideal Insulation" on Yelp, YP, BBB, FB — all show the same name and address.
- BrightLocal or Whitespark citation audit (one-time $30) returns ≥90% NAP consistency.
- New citations created from the GBP via `Whitespark`, `BrightLocal`, or `Yext` (optional paid services) all carry canonical NAP automatically.
