# Principles

These come from a teardown of docs.tomtom.com (Oct 2026) and the prototype that fixes it. Each rule exists because the live site breaks it somewhere.

## Naming and versioning

- Name the map platform in full: **TomTom Orbis Maps** or **TomTom Maps**. "Genesis" is the retired name for TomTom Maps — never use it on a page.
- Status is a word, colour only supports it: **Production** (v1 green `#15803d`), **Public Preview** (v2 purple `#7c3aed`), **Private Preview** (v3 orange `#c2410c`). For pre-release products without versions, use the PKD's own stage words (e.g. **Alpha**) as a status label and don't invent v-numbers.
- URL path numbers (`/services/4`, `/routing/1`) are path segments, not versions; they appear only inside URLs.
- One version line per API. Never two "v1"s in a switcher.
- SDKs state the same facts on every platform: SDK name, version, map platform, status.

## Cross-referencing

- Every page that uses another TomTom API or SDK has an `ApiLinks` block at the top (after the quick answer). Each item has a `type` badge (`REST API`, `Android SDK`, `iOS SDK`, `Web SDK`, `Tool`) and names a version where one exists.
- Links go both ways: if the new product's page links to a Routing API page, note in the gap report that the Routing page should link back (don't edit other products' pages unless asked).
- Every `pageId` must resolve to an existing route; `check_product.py` verifies this.

## Demos

- **API Explorer** = the whole API: every parameter, live URL and cURL, response tree, result on a map. Needs real endpoints and a key — for a PKD-stage product it's a gap, not a page.
- **Playground** = one task with a few inputs, embedded in a guide. A PKD-stage product can have an illustrative, clearly labelled mock ("Illustrative — no live service yet") if it helps explain a concept; never present a mock as live.

## AI context

The file `src/data/claude-context-<id>.js` exports `<ID>_CLAUDE_CONTEXT` (a markdown template string) and `download<Name>Context()` (Blob download, filename `tomtom-<id>.md`). Pattern: `src/data/claude-context-traffic-api.js`.

Sections, in order: what it does → status (draft, source version) → how it fits / who owns what → integration paths → capabilities with where they run → contract as far as defined → flows → gotchas → **Not yet defined** (mirrors the gap report IDs) → glossary → links.

Inside the template literal, escape backticks (`` \` ``) and `${` (`\${`) — an unescaped backtick in prose breaks the module at runtime (this has happened).

Add the product to `src/data/claude-context-bundle.js` only once it's public; leave a gap noting it.

## Ask AI

Every page header has `<PageActions />`, which provides Ask about this page, Copy as markdown and Open in Claude/ChatGPT. Don't add another assistant entry point.

## Page design standards

- No hero images on intros; open with the quick answer.
- Every non-reference page has a TOC entry in `TOC_MAP` (`src/components/layout/TOC.jsx`) listing its `h2` ids.
- Write plainly: active voice, short sentences, the reader's terms, not internal ones.
