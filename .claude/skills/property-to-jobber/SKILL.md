---
name: property-to-jobber
description: Pushes property appraiser lookup results (living area, base, garage square footage, year built, construction, roof, etc.) into Jobber as a client, request, or quote for a homeowner insurance quote workflow. Use after property-lookup has returned property data and the user wants the details saved to Jobber.
---

# Property → Jobber

Pushes the structured property data from a `property-lookup-*` skill into Jobber.

## Decide what to create

Ask the user (or infer from context) which Jobber action they want — the four common paths:

1. **Attach to an existing client → new request.** Most common for "I'm quoting Jane Smith — pull the details and put them on her request."
2. **New client + new request.** Cold lead, no Jobber client yet.
3. **New quote on an existing client.** They're ready to issue numbers, not just intake.
4. **Note-only — append to an existing request.** They've already started the request and just want the appraiser data attached.

If unclear, ask: "Do you want me to (a) create a new client+request, (b) add a request to an existing client, (c) create a quote, or (d) append to an existing request?"

## Workflow

### 1. Find or create the client

Use the owner name from the appraiser data as a starting point — but **confirm with the user** that the property owner is the actual insurance customer (the owner of record can be a trust, LLC, or previous owner if the sale hasn't recorded yet).

- Find existing: `jobber_find_client` with `searchable_name` = customer name or email.
- New client: `jobber_create_client` with at minimum `c_first_name` / `c_last_name` (or `c_company_name`), and the property address as `c_street1` / `c_city` / `c_province=FL` / `c_postalCode`.

### 2. Create the request, quote, or note

#### a) New request

`jobber_create_request` with:
- `client`: the client ID from step 1
- `title`: `"Homeowner Quote — <site_address>"`

Then immediately call `jobber_add_note_to_request` with the property details (formatted block — see below) so the data is on the request.

#### b) New quote

`jobber_create_quote` with:
- `client`: client ID
- `title`: `"Homeowner Insurance — <site_address>"`
- `number_of_line_items`: usually `1` for the policy line; ask if you don't know.

Note: Jobber's `create_quote` tool here doesn't take a freeform notes field. After it's created, attach the property details either as a description on the line item (if the user wants it visible to them on the quote) or as an internal note on the related request.

#### c) Note on existing request

`jobber_add_note_to_request` with `requestId` = the existing request ID (ask the user for it if not given) and `message` = the formatted property block below.

### 3. Format the note message

Use a plain-text block that's readable in Jobber's note view. Don't use markdown headings (Jobber renders them as raw `#`). Example:

```
PROPERTY DETAILS — Collier County Appraiser
Site address: 1234 EXAMPLE LN, NAPLES, FL 34108
Owner of record: SMITH, JOHN A & JANE
Parcel / Folio: 12-34-56-78-00012.3450

Living area (heated): 2,415 sqft
Base area (1st floor): 2,415 sqft
Garage: 484 sqft
Total under roof: 3,210 sqft
Year built: 2003
Stories: 1
Construction: CBS
Roof material: Concrete Tile
Bedrooms: 3
Bathrooms: 2.5
Pool: Yes

Source: https://www.collierappraiser.com/...
Pulled: 2026-05-17
```

Always include:
- The source URL so anyone can re-verify the data.
- The pull date (use the current date from the conversation context).
- The county name so it's obvious which appraiser supplied the data.
- Any `unknown` or flagged fields verbatim — don't silently drop them.

## Gotchas

- Jobber's `jobber_find_client` returns the closest match, not necessarily the right one. If the search term is generic (e.g., "Smith"), show the result to the user and confirm before using its ID.
- If the owner of record on the appraiser site doesn't match the customer the user is quoting, flag it: `"⚠ Owner of record (SMITH, JOHN A & JANE) does not match the customer name on this request. Verify before binding."`
- Don't push to Jobber automatically. Always confirm with the user first unless they've explicitly said "and push to Jobber" in their request.
- Phone/email rarely come from the appraiser site — leave those fields blank on `jobber_create_client` unless the user has provided them.
