# API template

Reference implementations in this repo: **Routing API** (`src/pages/RoutingAPIIntro.jsx`, `RoutingQuickStart.jsx`, `RoutingGuidePages.jsx`, `RoutingExplorer.jsx`, `src/data/nav-routing-api.js`) and **Traffic API** (`TrafficAPIIntro.jsx`, `TrafficQuickstart.jsx`, `TrafficExplorer.jsx`, `nav-traffic-api.js`). Read the relevant one before drafting; copy its structure, not its content. `CLAUDE.md` → "API build blueprint" has the full rules.

## Page set

| Page | ID pattern | Required sections, in order |
|---|---|---|
| Intro | `<id>-intro` | h1 + `quick-answer` → actions (Quickstart primary, Explorer, Download AI context) → endpoints grid → guides → versions table → base URL & auth |
| Quickstart | `<id>-quickstart` | Authentication → Your first request (cURL + abbreviated response) → Understanding the response → Which version → Next steps |
| Endpoint reference (one per endpoint concept) | `<id>-<endpoint>` | `ApiRefTwoCol` with `ParamRow`s; `version` prop set; request params; response schema at real depth; errors |
| API Explorer | `<id>-explorer` | Only once endpoints and a key exist — otherwise list it as a gap, don't build a fake |
| Guide landings | `<id>-<group>` | One per guide group, cards to tasks |
| Reference set (7, this order) | `<id>-tomtom-maps`, `-orbis-maps`, `-migration`, `-params-ref`, `-response-ref`, `-error-codes`, `-coverage` | Include only the ones the product has; a brand-new product usually has no migration page and one platform |

## Nav (option B, concept-first)

```js
export const FOO_NAV = [
  { id: 'foo-intro', label: 'Introduction', type: 'top' },
  { id: 'foo-quickstart', label: 'Getting Started', type: 'top' },
  { type: 'section', label: 'Endpoints' },
  { id: 'foo-thing', label: 'Thing', type: 'top', ref: true, vDots: ['v1'] },
  { type: 'section', label: 'Guides' },
  // …
  { type: 'section', label: 'Reference' },
  // …
];
export const FOO_PAGE_TITLES = { 'foo-intro': 'Introduction', /* every id */ };
```

`vDots` only when versions exist. Pre-release products often have no version yet: omit `vDots` and show status as a word on the page (Alpha, Private Preview).

## When the API isn't specified yet

Common for a PKD-stage product. Keep the page set, but:
- Endpoints grid → a **capabilities** grid ("What you can ask for"), each card marked with its status, and a callout that endpoints are to be defined (gap).
- Quickstart → keep Authentication and "Your first request" headings with placeholders pointing to gaps; do not write a cURL for an endpoint that doesn't exist.
- Reference set → include Response schema as the **Response contract** page (see `product-shapes.md` service pages); skip the rest and list them in the gap report as "blocked until the contract exists".
