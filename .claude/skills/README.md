# Property Lookup Skills

Claude Code skills that pull property details from a Florida county property appraiser site and (optionally) push them into Jobber for a homeowner insurance quote.

## What's in here

| Skill                          | What it does |
| ------------------------------ | ------------ |
| `property-lookup`              | Entry point. Takes an address, figures out the county, delegates to the right county skill. |
| `property-lookup-collier`      | Naples / Marco / Immokalee — Collier County Appraiser |
| `property-lookup-lee`          | Fort Myers / Cape Coral / Bonita / Estero / Sanibel — Lee County Appraiser |
| `property-lookup-charlotte`    | Punta Gorda / Port Charlotte / Rotonda — Charlotte County Appraiser |
| `property-lookup-sarasota`     | Sarasota / North Port / Venice / Englewood (Sarasota side) — Sarasota County Appraiser |
| `property-lookup-hendry`       | Clewiston / LaBelle / Port LaBelle — Hendry County Appraiser |
| `property-to-jobber`           | Pushes the extracted fields into Jobber as a client / request / quote / note. |

## Install

Two options:

### Project-scoped (only in this repo)
Already installed — they live in `.claude/skills/` and Claude Code picks them up automatically when started from this repo's root.

### Global (any Claude Code session)
Symlink or copy them to your user skills directory:

```bash
ln -s "$(pwd)/.claude/skills/property-lookup"           ~/.claude/skills/property-lookup
ln -s "$(pwd)/.claude/skills/property-lookup-collier"   ~/.claude/skills/property-lookup-collier
ln -s "$(pwd)/.claude/skills/property-lookup-lee"       ~/.claude/skills/property-lookup-lee
ln -s "$(pwd)/.claude/skills/property-lookup-charlotte" ~/.claude/skills/property-lookup-charlotte
ln -s "$(pwd)/.claude/skills/property-lookup-sarasota"  ~/.claude/skills/property-lookup-sarasota
ln -s "$(pwd)/.claude/skills/property-lookup-hendry"    ~/.claude/skills/property-lookup-hendry
ln -s "$(pwd)/.claude/skills/property-to-jobber"        ~/.claude/skills/property-to-jobber
```

## Required tools / MCP servers

### Browser MCP (REQUIRED for lookups)

The Florida county appraiser sites are ASP.NET WebForms with `__VIEWSTATE` postbacks. Plain HTTP scrapers (WebFetch, Firecrawl `scrape_page`, Apify `scrape_single_url`) **cannot** drive the address-search form on them — they'll just return the empty form. You need a real browser MCP.

**Recommended:** [Playwright MCP](https://github.com/microsoft/playwright-mcp) (Microsoft, free, no account).

Install once on the machine running Claude Code:
```bash
npm install -g @playwright/mcp@latest
npx playwright install chromium
```

Then add to your Claude Code MCP config (`~/.claude.json` or via `claude mcp add`):
```bash
claude mcp add playwright -- npx -y @playwright/mcp@latest
```

Verify after a restart:
```bash
claude mcp list
# should show: playwright: ✓ Connected
```

The skills assume tools named `mcp__playwright__browser_navigate`, `_snapshot`, `_click`, `_type`, `_select_option`, `_wait_for`, and `_close`. Other browser MCPs (browser-use, Chrome DevTools MCP) work too if they expose equivalent primitives.

### Firecrawl (optional fallback)

Useful for Google site-scoped searches when the appraiser's on-site search fails. Already present in your current setup as `mcp__*__firecrawl_search_data`.

### Jobber MCP (for the push step)

Needs `jobber_find_client`, `jobber_create_client`, `jobber_create_request`, `jobber_create_quote`, and `jobber_add_note_to_request`. Already present in your current setup.

## Example usage

Say to Claude:

> Look up 1234 Pelican Bay Blvd, Naples FL 34108 and pull the property details for a homeowner quote.

What happens:
1. `property-lookup` resolves "Naples" → Collier County.
2. Delegates to `property-lookup-collier`.
3. Collier skill hits collierappraiser.com, finds the parcel, extracts living area / base / garage / year built / construction / roof / pool.
4. Returns the structured data to you (YAML block + summary).
5. Asks: "Push this to Jobber?"

If you say yes:
6. `property-to-jobber` finds the client (or creates one), creates a request titled `"Homeowner Quote — 1234 PELICAN BAY BLVD, NAPLES, FL 34108"`, and attaches the property details as a note with the appraiser source URL.

## Adding more counties

Copy one of the existing county skills as a template:

```bash
cp -r .claude/skills/property-lookup-collier .claude/skills/property-lookup-<newcounty>
```

Then in the new `SKILL.md`:
1. Update the YAML frontmatter `name` and `description` (list the cities so the router picks it up).
2. Swap the URL and the search workflow.
3. Update the field-mapping table for that site's labels.

Then add the county to the city → county map in `property-lookup/SKILL.md`.

## Limitations / known issues

- Some county sites change layouts periodically. If a skill stops returning a field, the field-mapping table in that county's `SKILL.md` is what to fix.
- Condos return different page structures than single-family on most county sites — check the building vs. unit distinction.
- Owner of record on the appraiser site can lag a recent sale by 30–90 days. The skills flag mismatches but it's worth a sanity check before binding.
- Roof age is rarely on the main building page — it usually requires the permits tab. The Lee, Charlotte, Sarasota, and Hendry skills note this; capture it when available.
