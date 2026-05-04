# HubSpot template spec — Service-by-City landing page

This is the spec for one HubSpot CMS template that powers all service-by-city pages (e.g. `/services/spray-foam-insulation-fort-myers`, `/services/attic-insulation-cape-coral`). Build this template once in HubSpot Design Manager, then publish 8 pages from it.

## Why a template (not 8 hand-built pages)

- Consistency: every service-city page has the same modules in the same order, so Google sees a predictable pattern and the template's authority compounds.
- Editing one component (e.g. the FPL rebate callout) updates every page.
- Cuts authoring time per new page from ~3 hours to ~30 min.

## URL pattern

```
/services/{service-slug}-{city-slug}
```

Examples:
- `/services/spray-foam-insulation-fort-myers`
- `/services/attic-insulation-cape-coral`
- `/services/blown-in-insulation-fort-myers`

## Page-level fields the editor fills in

| Field | Example | Used in |
|---|---|---|
| `service_name` | "Spray Foam Insulation" | H1, title, body |
| `city` | "Fort Myers" | H1, title, body, schema |
| `county` | "Lee County" | body, schema |
| `state` | "FL" | always |
| `hero_image` | trucks/crew on-site in that city | hero module |
| `hero_subline` | "Cuts AC bills 25–40% in Fort Myers homes" | hero module |
| `city_intro_paragraph` | 80–120 word city-specific intro | intro section |
| `city_specific_pain_points` | bullet list (humidity, post-Ian rebuilds, etc.) | "Why this matters in {city}" section |
| `local_proof_photo_1..3` | before/after attic photos from that city | proof section |
| `local_testimonial_id` | reference to a testimonial filtered by city | testimonial module |
| `gbp_embed_url` | Google Maps embed centered on the city | map section |
| `internal_links` | links to 3 nearby service pages and 1 blog post | "Related" footer |

## Module order (top to bottom)

1. **Sticky header** — logo, phone link `tel:+12394552002`, "Free Estimate" CTA. This belongs in the global theme, not the page template, but verify it persists on this template.

2. **Hero**
   - `<h1>{service_name} in {city}, {state}</h1>` — exactly this format. No alternatives. Google relies on H1 alignment.
   - One-sentence subline: `Cuts AC bills 25–40% in {city} homes — FPL Preferred Contractor`
   - Two CTAs: primary "Get a Free Estimate" → `#contact`; secondary "Call (239) 455-2002" → `tel:+12394552002`
   - Trust badge row: FPL Preferred · Google Guaranteed · Lifetime Warranty · Bilingual · Since 2013

3. **City intro** (`city_intro_paragraph`)
   - 80–120 words. Must mention: the city by name (3+ times), the county, why insulation matters specifically in this area (humidity, hurricane exposure, FPL territory).

4. **Service detail**
   - 2–3 paragraphs explaining what we do for `{service_name}`. Same boilerplate-with-variables across cities.
   - 1 bullet list of options (e.g. open-cell vs closed-cell, R-values, materials).

5. **"Why this matters in {city}"**
   - 3 bullets pulled from `city_specific_pain_points`. Examples:
     - "Cape Coral's canal homes face year-round humidity — closed-cell foam doubles as a moisture barrier."
     - "Fort Myers attics over 30 years old typically test below R-15, well under the FPL R-8 rebate threshold and far below the 2026 Florida code minimum."
     - "Marco Island coastal homes face salt-air corrosion in vented attics — sealed roof decks eliminate it."

6. **FPL rebate callout** (global module, identical on every page)
   - "$220 instant rebate processed at install. We're an FPL Preferred Contractor — no paperwork on your end."
   - Link to `/fpl-rebate-naples` for full detail.

7. **Federal tax credit callout** (global module, identical on every page)
   - "Up to 30% off via the federal Energy Efficient Home Improvement Credit (Section 25C). We provide the documentation."
   - Link to `/federal-tax-credit-insulation-florida`.

8. **Process section** ("How it works") — global, identical
   - 4 steps: Free thermal scan → Custom quote → Same-day install → Lifetime warranty.

9. **Local proof** (3 photos + 1 testimonial from `{city}`)
   - Filter testimonials by tag `city:{city}`. Falls back to general SWFL testimonial if none.
   - Photos must be real on-site work in that city. EXIF should have GPS metadata for that city — Google reads it.

10. **FAQ accordion** (top 6 questions, drawn from `seo/jsonld/faq-spray-foam.json`)
    - Render the accordion HTML AND emit the `FAQPage` JSON-LD. Both. Google reads the JSON-LD; users read the accordion.

11. **Map embed** (Google Maps `gbp_embed_url` centered on `{city}`)
    - One-line caption: "Serving {city} and surrounding {county}."

12. **Internal links footer** (`Related services` + `Related guides`)
    - 3 nearby service pages: e.g. on the Fort Myers spray foam page link to `/services/attic-insulation-fort-myers`, `/services/blown-in-insulation-fort-myers`, `/services/spray-foam-insulation-cape-coral`.
    - 1 blog post link: e.g. `/blog/best-attic-insulation-florida` (post-blog-URL-migration).

13. **Final CTA strip** — full-width, "Free same-day estimate in {city}. Call (239) 455-2002."

14. **Footer** (global) — NAP block, social, services menu.

## Required `<head>` content (per page)

In HubSpot's Page Settings → Advanced Options → Head HTML, paste:

```html
<!-- LocalBusiness reference (already on homepage; @id link only) -->
<!-- Service schema for THIS page -->
<script type="application/ld+json">
{... contents of seo/jsonld/service-spray-foam.json customized for this city ...}
</script>

<!-- FAQ schema -->
<script type="application/ld+json">
{... contents of seo/jsonld/faq-spray-foam.json ...}
</script>

<!-- Breadcrumb -->
<script type="application/ld+json">
{... contents of seo/jsonld/breadcrumb-template.json customized for this URL ...}
</script>
```

## Page metadata (set in HubSpot Page Settings)

- **Title**: from `seo/rewrites/page-rewrites.csv` (column `recommended_title`).
- **Meta description**: from same CSV (column `recommended_meta`).
- **Canonical URL**: leave default (HubSpot auto-sets to the published URL with `https://www.idealinsulationinc.com` host).
- **Featured image**: a real on-site photo from that city (used by `og:image` and Twitter card).
- **Language**: English (`en`). For Spanish variants, set `es` and use `/es/...` URL prefix.

## Internal-link checklist (do this when each page goes live)

- [ ] Add a link from `/areas-served-swfl` to the new page.
- [ ] Add a link from the homepage's "Service Areas" module if one exists.
- [ ] Add reciprocal links from the 3 sibling service-city pages.
- [ ] Add a link from any related blog post (e.g. the `attic-insulation-fort-myers` blog post should link to `/services/attic-insulation-fort-myers`).
- [ ] Submit the URL in Google Search Console → URL Inspection → "Request Indexing".

## Do not

- Do **not** spin up duplicate near-identical copy across all 8 cities. Each `city_intro_paragraph` and `city_specific_pain_points` must be uniquely written for that city — Google has gotten very good at detecting doorway pages, and they get demoted hard.
- Do **not** keyword-stuff the URL slug. Use `/services/spray-foam-insulation-fort-myers`, not `/services/spray-foam-insulation-fort-myers-fl-cheap-best-near-me`.
- Do **not** publish all 8 pages on the same day. Stagger over 2–3 weeks so Google can index them deliberately.
- Do **not** copy testimonials across pages. If you don't have a real testimonial from that city yet, skip the testimonial module on that page until you do.
