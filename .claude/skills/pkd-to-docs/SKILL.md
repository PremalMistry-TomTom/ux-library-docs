---
name: pkd-to-docs
description: Turn a PM Product Knowledge Document (PKD) — plus any decks, technical direction pages, OpenAPI specs or SDK code — into draft developer docs pages inside the TomTom docs prototype (this repo), written the way an end customer would read them, with an AI context file and a gap report of everything the sources can't answer yet. Use this whenever someone wants to "start docs from the PKD", draft docs for a new or pre-release TomTom product, API, SDK, SDK module or endpoint, turn a Confluence product page into docs, check what a product team still needs to decide before docs can be written, or add a new product to the docs prototype — even if they don't say "PKD" or "skill".
---

# PKD to docs

Draft a product's developer docs before (or while) it is built, by reading its PKD the way a customer would, pouring it into the prototype's page templates, and reporting every gap the PKD can't fill.

**Why this exists.** Docs written late inherit whatever naming, versioning and linking each team improvised. Drafting from the PKD, on fixed templates, surfaces the gaps (auth, errors, limits, contract, versions) while the product team can still decide them, and gives every product the same shape for developers and for their agents. The output is a starting point for the docs team, not a publishable page.

**Principles behind the templates** (detail in `references/principles.md`):
1. Two templates — API and SDK — with a fixed page set and section order.
2. One naming system for map platform, version and status.
3. Cross-links go both ways and name a version.
4. Two kinds of demo: an Explorer for the whole API, a playground for one task.
5. AI context per product (and per endpoint/use case when possible), built from the same source as the pages.
6. Ask AI lives in the page shell, via `PageActions`.

## Workflow

Work through these in order. Steps 1–3 happen before you touch the repo.

### 1. Gather and snapshot the sources

Collect every source the user points to: the PKD (often a Confluence page — read it with the Atlassian MCP `getConfluenceContent` tool, `content_format: markdown`, `detail: full`), linked technical direction pages, decks or HTML artifacts (read with the Artifact tool or from disk), and — if they exist — OpenAPI specs or SDK source. Precedence when sources disagree: **code/spec > technical direction > PKD > proposals > decks**. The PKD sets intent; once code exists it is the source of truth. A proposal is a source outside the PKD that suggests rather than decides (a design direction, say): tag everything from it PROPOSAL, and where it conflicts with the PKD, the PKD applies and the conflict becomes a gap.

Precedence assumes the sources are current. A technical direction page that is older than the PKD's latest changes, or still marked in review, loses its precedence on anything the PKD has since changed: treat its content as Direction, and log the conflict as a gap. Decks are mostly framing (story, scenarios, quotes); don't take contract facts from them.

Save a dated snapshot of each source **outside this repo** (this repo is public on GitHub). Ask the user where if unclear; a project folder such as `<Product project>/03 Sources/` is typical. Note each source's date — PKDs change weekly and the gap report must say which version it read.

Read `references/sources-and-screening.md` now. It explains the PKD status tags (AGREED / LEANING / OPEN / CHECK) and how to treat each, and what must never reach a page.

### 2. Classify the product shape

Decide which shape(s) the product is, using `references/product-shapes.md`: **API**, **SDK**, **SDK module**, **new endpoint**, or **service** (cloud API + thin SDK, possibly MCP — e.g. an agent-facing product). The shape picks the page set. State your classification and the evidence for it in the gap report; if the PKD itself leaves the split open (e.g. "API side vs SDK side: OPEN"), say so and draft both sides with the open item flagged.

### 3. Build the content inventory

Before writing pages, list every fact you will use, each with: the claim, its source and section, its status tag, and the page it lands on. Facts that are OPEN, internal-only or missing go straight into the gap report instead. This inventory is what keeps the pages honest — nothing on a page should lack a line here. Write it as a table in the gap-report markdown copy, outside the repo (it quotes the PKD, so it doesn't belong in the public page).

### 4. Draft the pages in the prototype

Follow `references/repo-wiring.md` exactly — it lists every file a new product touches (nav, products registry, App routes, TOC, portal card) and the component conventions. Use the page sets and section orders in `references/api-template.md` or `references/sdk-template.md` (a service uses both). Start from `assets/page-skeleton.jsx`.

How to write each page:
- **Write for the integrating developer** (and their agent): what it does, when to use it, how to call it, what comes back, what can go wrong. Strategy, pricing, accounts and competitors stay out (see screening).
- **Open every page with a one-sentence `quick-answer`.** If you can't write it from the sources, that's a gap.
- **Mark draft status visibly.** Every page carries the draft banner from the skeleton naming the source version. LEANING content gets an inline "Direction, not final" callout; never present it as settled. PROPOSAL content goes in a Proposal block, never as plain prose.
- **Never invent contract details.** No made-up endpoints, parameters, field names, error codes, limits or versions. Where the template needs one and the sources don't have it, render the section with a clearly marked placeholder ("To be defined — see gap G7") and log the gap. A page that shows its holes is the useful outcome.
- **Examples only from the sources.** Driver/user quotes, scenarios and sample requests in the PKD are fair game and make pages concrete. Until field names are defined, show an example response as a two-column table (content → illustrative value), not as JSON — JSON would force you to invent keys.
- **Link both ways.** Every page that depends on another TomTom API/SDK gets an `ApiLinks` block with types and versions, using page IDs that resolve.
- **Draw where words alone are too abstract.** Flows across parties, what runs where and who owns it, and how integration paths differ are hard to follow as prose. Add a diagram with the kit in `src/components/diagrams/Diagrams.jsx` wherever the sources say enough to draw it truthfully; mark undecided parts as `tbd`. Read `references/diagrams.md` for when to draw, which component fits, and how to label.

### 5. Write the AI context file

Create `src/data/claude-context-<product-id>.js` following `references/principles.md` §AI context: what it does, how it fits, integration paths, the contract as far as known, gotchas, and an explicit "Not yet defined" list mirroring the gap report. Add a "Download AI context" button on the intro — there is no shared component yet, so copy the small `DownloadAIContextBtn` from `src/pages/TrafficAPIIntro.jsx` into your pages file. Agents read this file literally, so it must carry the same draft warnings as the pages.

### 6. Write the gap report

Keep the gaps in one data file, `src/data/gaps-<product-id>.js`, and render the gap report page (`<prefix>-gap-report`) from it, so the page, the placeholders and the markdown copy in the snapshot folder all use the same IDs. Follow `references/gap-report.md`. It is the main deliverable for the product team: each gap has an ID, the question, why a developer needs it, the template section it blocks, the source evidence, a suggested owner (from the PKD's decision table when named) and a severity. Put the source versions and the shape classification at the top.

### 7. Check and verify

Run the consistency check and fix what it reports:

```bash
python3 .claude/skills/pkd-to-docs/scripts/check_product.py <product-id>
```

It verifies every nav page is routed and titled, TOC entries exist and match the page's `h2` ids, `ApiLinks` targets resolve, no banned naming slipped in, every page has a draft banner and quick answer, and no screened terms appear in any of the product's files (pass `--deny <file>` with the names from the screening step; terms are case-sensitive, so `HERE` doesn't match "here"). Then build (`npx vite build --outDir /tmp/<id>-build --emptyOutDir`) and open each page in the dev-server preview; check the console too. If you can't run a server, render each page component with React's `renderToString` through Vite's `ssrLoadModule` as a fallback, and say that you did.

### 8. Hand back

Tell the user: the shape you chose, the pages drafted (as a short list), the top gaps by severity with owners, and anything screened out that they may want to handle differently. Don't commit or push draft product pages unless the user explicitly asks — the repo is public, and pre-release product details in source are visible to anyone even behind the site's password gate. Offer a private branch or repo instead.

## Reference files

| File | Read when |
|---|---|
| `references/sources-and-screening.md` | Step 1 — always |
| `references/product-shapes.md` | Step 2 — always |
| `references/api-template.md` | Product has an API side |
| `references/sdk-template.md` | Product has an SDK side |
| `references/principles.md` | Steps 4–5 — naming, versions, links, demos, AI context |
| `references/repo-wiring.md` | Step 4 — before editing any file |
| `references/diagrams.md` | Step 4 — before drawing any diagram |
| `references/gap-report.md` | Step 6 |
| `assets/page-skeleton.jsx` | Step 4 — copy for each page |
| `scripts/check_product.py` | Step 7 |
