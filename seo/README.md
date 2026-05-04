# Ideal Insulation — SEO

Working repo for the SEO program on **idealinsulationinc.com**. Goal: rank #1 in Google for high-intent local searches across SWFL.

## What's in here

```
seo/
├── data/
│   ├── business.yml         single source of truth for NAP + structured-data fields
│   └── keywords.yml         target keyword per page + tracking groups
├── findings/
│   ├── audit-2026-05.md     full SEO audit, sequenced by priority
│   └── citation-runbook.md  step-by-step cleanup for every directory
├── jsonld/
│   ├── local-business.json  LocalBusiness schema (homepage + areas-served page)
│   ├── service-*.json       Service schema (one per service)
│   ├── faq-spray-foam.json  FAQPage schema for spray foam Naples
│   └── breadcrumb-template.json  pattern for every non-homepage page
├── rewrites/
│   └── page-rewrites.csv    current vs recommended title/meta for every page
└── templates/
    └── service-city-template.md  spec for the new HubSpot template
```

## How to use this — Phase 1 quick wins (no credentials needed)

Each step is paste-into-HubSpot work that can be done today.

### 1. Fix the Rockkwool typo (5 min)

1. HubSpot → Marketing → Website → Pages.
2. Open `blown-in-insulation-naples-swfl`.
3. Settings → "Title and Meta Description" → paste the recommended title from `seo/rewrites/page-rewrites.csv` row for `/blown-in-insulation-naples-swfl/`.
4. Update the page H1 to match.
5. Republish.
6. Open the live URL in incognito to confirm.

### 2. Rewrite the homepage (10 min)

1. HubSpot → Pages → open the homepage.
2. Settings → paste the recommended `<title>` and `meta description` from the rewrites CSV.
3. Settings → Advanced Options → Head HTML → paste:
   ```html
   <script type="application/ld+json">
   {... paste the contents of seo/jsonld/local-business.json ...}
   </script>
   ```
4. Republish.
5. Validate at https://search.google.com/test/rich-results.

### 3. Fix the blog index title (5 min)

1. HubSpot → Settings → Website → Blog.
2. For the blog "Ideal Insulation Enterprises Inc Blog", change the listing-page Title to what's in the rewrites CSV.
3. Save.

### 4. Add Service + FAQ JSON-LD to the spray foam page (10 min)

1. Open `/services/spray-foam-insulation-naples-swfl/` in HubSpot.
2. Settings → Advanced Options → Head HTML → paste both:
   ```html
   <script type="application/ld+json">
   {... contents of seo/jsonld/service-spray-foam.json ...}
   </script>
   <script type="application/ld+json">
   {... contents of seo/jsonld/faq-spray-foam.json ...}
   </script>
   ```
3. Republish, validate at the Rich Results Test.

### 5. Same pattern for the other service pages

Repeat step 4 with the matching `service-*.json` for:
- `/blown-in-insulation-naples-swfl/` → `service-blown-in.json`
- `/services/insulation-removal-naples` (after URL change) → `service-removal.json`

### 6. Citation cleanup

Open `seo/findings/citation-runbook.md` and work top-to-bottom. Start with **Google Business Profile** — it drives most local-pack ranking on its own.

## Phase 2 — service × city build-out (weeks 3–8)

Build the HubSpot template from `seo/templates/service-city-template.md`, then publish 8 pages from it:

- `/services/spray-foam-insulation-fort-myers`
- `/services/spray-foam-insulation-cape-coral`
- `/services/attic-insulation-fort-myers`
- `/services/attic-insulation-cape-coral`
- `/services/blown-in-insulation-fort-myers`
- `/services/insulation-removal-fort-myers`
- `/services/spray-foam-insulation-bonita-springs`
- `/services/spray-foam-insulation-marco-island`

Stagger the publishes 2–3 per week. Titles/metas/schema for each are in the rewrites CSV.

## Phase 4 — automation (when credentials arrive)

When you provide:
- HubSpot Private App token (scopes: `content`, `cms.pages.read`, `cms.pages.landing_pages.read`, `cms.knowledge_base.articles.read`)
- Google Search Console service-account JSON for a verified property
- GA4 property ID

…I'll add a Node toolkit under `seo/src/` that pulls the full HubSpot page inventory, joins with GSC click/impression data, and produces a weekly report of pages that need attention. Until then, the manual work above is enough.

## Updating the canonical NAP

If the address, phone, or hours change: update `seo/data/business.yml` first, then re-generate the JSON-LD blocks (manually for now, or via the Node toolkit when it's built). Re-paste the new JSON-LD into the affected HubSpot pages and republish.

## Verification checklist (after any change)

- [ ] Page republished in HubSpot.
- [ ] Visited the live URL in incognito; change is visible.
- [ ] If JSON-LD: validated at https://search.google.com/test/rich-results.
- [ ] If title/meta: previewed via `view-source:` and Search Console URL Inspection.
- [ ] Submitted for re-indexing in Search Console.
- [ ] Logged the change in `seo/changelog.md` (create as you go).
