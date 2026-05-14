# UX Library — Claude project context

> Auto-loaded every session. Keep this current after major work.
> Last updated: 2026-05-14

---

## What this project is

An internal developer documentation portal for TomTom Maps APIs and SDKs.
Built with **React + Vite**, deployed to GitHub Pages.
Audience: developers integrating TomTom APIs.

The app is a **single-page shell** — `App.jsx` owns all routing state. There is no React Router. Navigation is handled by `onNavigate(pageId, productId)` callbacks passed down from `App.jsx` to each page component.

---

## Key shorthand

| Shorthand | Meaning |
|---|---|
| **Plumbing Portal** | The `?` fullscreen overlay — press `?` anywhere or click the wrench icon in `GlobalHeader`. Renders `PlumbingPortal.jsx`. |
| **Gallery** | `UIComponentGallery.jsx` — the design audit page inside the Plumbing Portal |
| **Shell** | The 3-column `.shell` CSS grid layout: sidenav \| content \| toc |
| **Playbook** | `@playbook-ui-kit` — TomTom's internal React component library at `/Users/mistrypr/Downloads/playbook-ui-kit-main` |
| **DocsPortal / Discovery** | `DocsPortal.jsx` — the product discovery + catalogue landing page |
| **TryIt** | `TryItDemos.jsx` + `TryItEmbed.jsx` — live API demo widget system |
| **Illo / IlloXxx** | SVG illustration components used as hero cards on domain pages |

---

## Products in the app

Defined in `src/data/products.js`. Each product has an `id`, `nav` tree, `pageTitles` map, and optional `iosNav`/`iosPageTitles` for platform parity.

| Product ID | Display Name | Notes |
|---|---|---|
| `ux-library` | UX Library | Design system docs, overview, theming |
| `navsdk` | Maps & Navigation SDK | Android + iOS platform toggle |
| `ana` | Automotive Navigation Application | In-vehicle HMI patterns |
| `routing-api` | Routing API | v1/v2/v3, incl. Private Preview v3 |
| `ldevr` | Long Distance EV Routing API | EV-specific routing, charging stops |
| `matrix-routing` | Matrix Routing | Sync + async matrix |
| `waypoint-api` | Waypoint Optimisation API | — |
| `search-api` | Search API | Fuzzy, POI, autocomplete, batch |
| `geocoding-api` | Geocoding API | Forward + reverse geocode |
| `traffic-api` | Traffic API | Incidents, flow, model ID |
| `traffic-analytics` | Traffic Analytics | Area analytics, O/D, junction |
| `ev-charging-api` | EV Charging API | Station search, availability |
| `map-display-api` | Map Display API | Raster/vector tiles, static image |
| `parking-fuel-api` | Parking & Fuel API | Parking availability, on-street, fuel prices |
| `snap-to-roads` | Snap to Roads API | GPS trace snapping |

---

## Codebase map

```
src/
  App.jsx                      ← Root. Owns all routing state, theme (isDark), platform
                                  toggle, plumbing portal open state, nav collapse.
                                  Key state: currentPage, currentProduct, currentPlatform,
                                  isDark, navDrawerOpen, navCollapsed, plumbingOpen.

  pages/
    ── Plumbing (internal tools) ──
    PlumbingPortal.jsx           ← Fullscreen overlay. 13 nav items in 4 groups.
    UIComponentGallery.jsx       ← Design audit gallery. 43 sections, 7 groups.
                                    Has Decision Mode (keep/merge/erase).
    TryItDemos.jsx               ← All live API demos. DEMOS[] array, TryItPanel component.
    Typography.jsx               ← Typography specimens
    ScreenshotAssets.jsx         ← Interactive demo screenshots
    IntroIllustrations.jsx       ← Illustration system browser
    IntroIllustrationsLegacy.jsx ← Old illustration reference
    StyleSamples.jsx             ← Colour / style samples
    ContentSpacing.jsx           ← Spacing scale
    IconStyleSandbox.jsx         ← SVG icon style testing
    DocPageGuidelines.jsx        ← Doc authoring guidelines
    DocIntroTemplate.jsx         ← Intro page template
    DocFeatureTemplate.jsx       ← Feature page template
    DocUseCaseTemplate.jsx       ← Use-case template
    DocDosDonts.jsx              ← Dos & Don'ts template

    ── UX Library product pages ──
    Overview.jsx                 ← Product overview / hub
    DocsPortal.jsx               ← Discovery + Catalogue landing page
    DomainLanding.jsx            ← Generic domain landing (uses IlloXxx hero cards)
    DesignTokens.jsx             ← Token reference
    Colour.jsx                   ← Colour system
    Typography.jsx               ← (also a product page)
    Theming.jsx                  ← Theme system
    CornerRadius.jsx             ← Border radius tokens
    Font.jsx                     ← Font stack
    ContentSpacing.jsx           ← (also a product page)

    ── NavSDK pages ──
    NavSDKIntro.jsx              ← SDK overview + capability cards
    NavSDKDomains.jsx            ← 8 domain landing pages
    NavSDKGettingStarted.jsx
    NavSDKMapPages.jsx
    NavSDKNavigationPages.jsx
    NavSDKRoutingPages.jsx
    NavSDKLocationPages.jsx
    NavSDKHorizonPages.jsx
    NavSDKAdvancedPages.jsx
    NavSDKOfflinePages.jsx
    NavSDKiOS*.jsx               ← iOS platform parity versions

    ── ANA pages ──
    ANAIntro.jsx
    HomeScreenLayout.jsx, RouteBar.jsx, InstructionPanel.jsx,
    HorizonPanel.jsx, ETAPanel.jsx, HUD.jsx, NavigationControls.jsx,
    POIDetails.jsx, EVNavUI.jsx, EVBattery.jsx, EVSupport.jsx,
    Cluster.jsx, IntentRouting.jsx, SpeechToText.jsx,
    VoiceEngine.jsx, ConversationPersonality.jsx, AIConfig.jsx,
    VIBasics.jsx, SafetyLocations.jsx, ADASIntegration.jsx

    ── API Reference pages ──
    RoutingAPIIntro.jsx + RoutingCalculateRoute.jsx, RoutingV2/V3*.jsx,
    RoutingBatch.jsx, RoutingReachableRange.jsx, RoutingInstructions.jsx,
    RoutingLaneGuidance.jsx, RoutingEVRoute.jsx, RoutingRoadShields.jsx,
    LDEVRIntro.jsx + LDEVR*.jsx (12 endpoint pages),
    SearchAPIIntro.jsx + Search*.jsx,
    GeocodingAPIIntro.jsx + GeocodePage.jsx, ReverseGeocodePage.jsx,
    TrafficAPIIntro.jsx + Traffic*.jsx,
    TrafficAnalyticsAPIIntro.jsx + TrafficArea*.jsx etc.,
    EVChargingAPIIntro.jsx + EVCharging*.jsx,
    MapDisplayAPIIntro.jsx + Map*.jsx,
    ParkingFuelAPIIntro.jsx + Parking*.jsx + FuelPrices.jsx,
    SnapToRoadsAPIIntro.jsx + SnapToRoads.jsx,
    MatrixRoutingIntro.jsx + RoutingBatch.jsx,
    WaypointOptIntro.jsx,
    GeocodingAPIIntro.jsx

  components/
    layout/
      GlobalHeader.jsx           ← Fixed top chrome. Classes: .global-header, .gh-nav,
                                    .gh-nav-link, .gh-nav-link--active (color:var(--brand)),
                                    .gh-icon-btn, .gh-icon-btn--active (#e2001a),
                                    .gh-signin-btn, .gh-product-label, .gh-divider,
                                    .gh-hamburger, .gh-mobile-menu
                                    Nav links: ['Products', 'Resources', 'Pricing']
                                    Auto-hides on scroll down, reveals on scroll up.
      Sidenav.jsx                ← Left nav. CONNECTOR_COLOR = '#D4D4D4'
                                    CornerConnector (└), TeeConnector (├) — inline divs
                                    with absolute-positioned border lines (not SVG).
                                    ChevronIcon rotates -90deg (collapsed) → 0deg (open).
                                    Classes: .sidenav, .sidenav-group, .sidenav-label,
                                    .sidenav-items, .sidenav-item, .sidenav-top-link,
                                    .sidenav-collapse-btn, .sidenav-collapse-bar,
                                    .sidenav-drawer, .sidenav--collapsed
      TOC.jsx                    ← Right column sticky nav. Classes: .toc, .toc-heading,
                                    .toc-list (active state: .toc-list a.active)
      Topnav.jsx                 ← Breadcrumb bar above content. .topnav, .topnav-crumb

    ui/
      Callout.jsx                ← Info/warn/success/danger. Used 74× across codebase.
                                    Props: type ('info'|'warn'|'success'|'danger'), title?
      CodeBlock.jsx              ← Syntax-highlighted code. Multi-tab via tabs prop.
      ApiRefTwoCol.jsx           ← Two-column API reference layout. Exports ParamRow.
                                    Section format: { id, title, left, right, demoId? }
      AskAIPanel.jsx             ← AI chat widget. Purple #5b21b6 — NOT TomTom red.
                                    Classes: .ai-panel, .ai-panel-header, .ai-panel-source,
                                    .ai-msg--user, .ai-msg--ai, .ai-msg--typing,
                                    .ai-panel-footer, .ai-panel-icon-btn
      ApiLinks.jsx               ← Cross-reference link cards (.api-links-block,
                                    .api-links-card, .api-ref-chip)
      PageActions.jsx            ← Page-level action bar (.page-actions, .page-action-btn,
                                    .page-action-btn--ai, .page-action-sep)
      PasswordGate.jsx           ← Private preview password wall
      PrivatePreviewBanner.jsx   ← .ppb-root banner for private preview API pages
      ExampleCard.jsx            ← Illustrated destination card
      Swatch.jsx                 ← Colour swatch card

    demos/
      TryItEmbed.jsx             ← Embeds a single demo by demoId into any page.
                                    Uses hardcoded DEMO_API_KEY.
                                    Usage: <TryItEmbed demoId="fuzzy-search" />

  data/
    products.js                  ← PRODUCTS map + getProduct() helper
    navigation.js                ← Top-level nav wiring
    nav-*.js                     ← Per-product nav tree + page titles
    colours.js                   ← Colour palette data
    fonts.js                     ← Font stack data
```

---

## Illustration system

`IlloXxx` components are React SVG illustrations used as hero cards on domain/landing pages.
- Theme-aware: accept `palette` prop (`{ bg, accent, warn, danger, surface, text }`)
- Built in `IntroIllustrations.jsx` and exported for use in `Overview.jsx` and domain pages
- `useDemoStyle` hook provides palette from current day/night theme
- There are ~40 illustrations covering all product domains
- Legacy versions in `IntroIllustrationsLegacy.jsx`

---

## Live demo system (TryIt)

`TryItDemos.jsx` exports:
- `DEMOS[]` — array of ~40 demo configs (one per API endpoint)
- `TryItPanel` — the interactive widget component

Each demo config:
```js
{
  id: 'fuzzy-search',
  product: 'Search API',
  endpoint: 'Fuzzy Search',
  method: 'GET',
  fields: [{ id, label, placeholder, defaultValue, flex?, width? }],
  fetch: async (fields, apiKey) => { ... return result },
  renderMode: 'sdk-map' | 'tile' | 'image' | 'table' | 'json',
  mapCenter?: (result, fields) => [lat, lon],
  tableRows?: (result) => [[label, value], ...],
}
```

To embed a demo in a page:
```jsx
import { lazy, Suspense } from 'react';
const TryItEmbed = lazy(() => import('../components/demos/TryItEmbed'));
<TryItEmbed demoId="fuzzy-search" />
```

Demo IDs available (grouped by product):
- Search API: `fuzzy-search`, `poi-search`, `nearby-search`, `along-route-search`, `autocomplete`, `batch-search`, `poi-details`, `poi-photos`
- Geocoding API: `geocode`, `reverse-geocode`
- Routing API: `calculate-route`, `reachable-range`, `turn-by-turn`, `lane-guidance`, `batch-routing`
- Traffic API: `traffic-incidents`, `traffic-flow`, `traffic-model-id`
- Traffic Analytics: `traffic-stats`, `area-analytics`, `od-analysis`, `junction-analytics`
- Map Display API: `raster-tile`, `vector-tile`, `satellite-tile`, `static-image`, `map-assets`
- EV Charging API: `ev-station-search`, `ev-market-coverage`
- LDEVR: `ldevr-weather`, `ldevr-vehicle-brand`, `ldevr-toll`, `ldevr-parks`, `ldevr-emsp`
- Parking & Fuel: `parking-availability`, `parking-prices`, `on-street-parking`, `fuel-prices`
- Other: `snap-to-roads`, `matrix-sync`, `matrix-async`, + waypoint demos

---

## CSS architecture

All styles in `src/index.css`. No CSS Modules, no Tailwind (that's Playbook only).

### Design tokens (CSS custom properties on `:root`)
```css
/* Surfaces */
--bg          /* page background */
--s1, --s2    /* elevated surfaces */
--white, --black

/* Text */
--mid         /* secondary text */
--muted       /* tertiary / captions */
--t-dis       /* disabled text */
--t-hi        /* high-emphasis (alias for --black) */

/* Border */
--border      /* default border colour */
--b-hi, --b-med  /* high/med emphasis borders */

/* Brand */
--red         /* TomTom red #DF1B12 */
--brand       /* alias for --red, used for active states */
--brand-hover /* darker red #C01008 */

/* Semantic surfaces */
--info-bg, --info-border, --info-text
--warn-bg, --warn-border, --warn-text
--success-bg, --success-border, --success-text
--danger-bg, --danger-border, --danger-text

/* Typography */
--font-mono   /* code font */
--font-display /* heading font (Proxima Nova or similar) */

/* Radius */
--r-sm, --r-md, --r-lg, --r-xl  /* corner radius scale */
```

### Dark mode
Toggled via `isDark` in `App.jsx` → adds class `dark` to `<body>`. All tokens defined in `body.dark { }` block in `index.css`.

### Component class naming
BEM-ish, component-scoped: `.global-header > .gh-nav > .gh-nav-link--active`

---

## Plumbing Portal nav items

The `PlumbingPortal.jsx` has 13 nav items in 4 groups:

| Group | Items |
|---|---|
| Design system | UI component gallery, Typography system, Interactive demos, Intro hero illustrations, Style samples, Content spacing |
| Doc authoring | Page guidelines, Intro page template, Feature page template, Use case template, Dos & Don'ts |
| Illustration | Icon style sandbox |
| API demos | Try it — endpoint demos |

---

## UIComponentGallery (Plumbing Gallery) — key facts

- **~5800 lines**, 49 sections in 7 groups
- Each section is a `function XxxSection()` defined before the export, rendered in `<div id="sN">` wrappers
- `GallerySection` helper component — shows title, desc, usage pills, optional Playbook pills, decision badge
- All section functions are defined in file order but rendered in the `JUMP_GROUPS` order inside `export default`
- **Do NOT wrap in `.page`** — renders directly inside PlumbingPortal's scrollable `<main>`
- **Do NOT import `PageActions`** inside the gallery

### UsageBar pill system
`usage` prop is array of `{ n, f, t?, fix? }`:
- `f` = number of real-app files that use this class (grep excluding UIComponentGallery itself)
- `t: 'missing'` → class not found in CSS or app at all (red)
- `t: 'ghost'` → defined in CSS but never applied as `className` (amber)
- `t: 'wrong'` → gallery name differs from real code; `fix` shows correct name (orange)
- `t: 'playbook'` → matching component in `@playbook-ui-kit/components` (purple)
- No `t` → green (5+), yellow (2–4), orange (1), red (0)

---

## Decision Mode (refactor audit tool)

Built into the gallery. Persists to `localStorage['ux-gallery-decisions']`.

**To use:**
1. Open gallery → click **"⊕ Decision mode"** (top-right of page header)
2. Each `GallerySection` header shows a badge — click to cycle:
   `? undecided` → `✓ keep` → `⇒ merge` → `✕ erase` → back
3. `merge` state reveals a text input: "merge into →" (type target section name)
4. Progress bar shows `X / 43 reviewed`
5. When done → **"↓ Export decisions.json"** downloads `ux-refactor-decisions.json`
6. Use **"✕ Clear all"** to reset

**Exported file format:**
```json
{
  "exportedAt": "ISO timestamp",
  "summary": { "keep": 0, "merge": 0, "erase": 0, "undecided": 0 },
  "decisions": [
    { "id": "s1", "section": "Design Tokens", "decision": "keep" },
    { "id": "s22", "section": "Badges & Tags", "decision": "merge", "mergeInto": "Buttons" },
    { "id": "s7", "section": "Shell Layout", "decision": "erase" }
  ]
}
```

**When you receive decisions.json, the refactor pass:**
- `keep` → leave CSS/component untouched, document as canonical in new gallery
- `erase` → delete CSS block, grep all files, remove or replace `className` usages
- `merge (into X)` → rename all usages to target class, fold CSS into target rule, delete old block

**Always read `ux-refactor-decisions.json` before touching any CSS or component files.**

---

## Playbook component mapping (already tagged in gallery)

Sections with purple `Playbook` pills have a confirmed match in `@playbook-ui-kit/components`:

| Gallery section | Playbook components |
|---|---|
| Buttons | `Button` |
| Badges & Tags | `Tag`, `StatusTag`, `Chip`, `ChipGroup`, `ChipGroupToggle` |
| Callouts | `Alert` |
| Forms & Inputs | `Input`, `Textarea`, `Slider`, `FormControl`, `FieldLabel`, `FieldCaption`, `Checkbox`, `Switch`, `Dropdown`, `FileInput` |
| Steps | `Stepper`, `StepMenu`, `StepsMenu` |
| Tables | `Table` |
| Status States | `Spinner`, `AnimatedLoadingBar`, `AnimatedLoadingSpinner` |
| Navigation Cards | `ContentCard`, `SearchCard` |
| Domain / Benefit / Text Cards | `Card`, `ComplexCard` |
| DocsPortal2 Cards | `Card`, `ContentCard` |
| Sidenav Anatomy | `Sidebar` |
| Sidenav Collapse/Drawer | `Sidebar`, `Drawer` |
| Global Header | `Header`, `SubHeader`, `HeaderMenu`, `HeaderMenuButton`, `HeaderMenuDropdown` |
| Tab Bar | `TabNavigation` |
| Modal | `Modal`, `ModalContextProvider` |
| Platform Switcher | `Switcher` |
| TOC | `TableOfContent` |

Playbook uses `ui-` prefixed Tailwind classes. CSS variables follow `--ui-{category}-{name}` pattern. React components are PascalCase. Icons are `Icon` + PascalCase of SVG filename.

---

## Key work done (chronological highlights)

**Phase 1 — Foundation (April 2026)**
- Initial commit: basic portal shell, routing, dark mode, nav system
- Password gate for private preview content
- GitHub Pages deploy workflow with SPA 404 fallback
- Sidenav collapse button docked to bottom of viewport

**Phase 2 — Content & API pages**
- All Routing API pages (v1/v2/v3, incl. Private Preview v3)
- All LDEVR endpoint pages (12 pages)
- NavSDK: 8 domain pages, 7 hero illustrations, 12 mosaic cards
- NavSDK iOS platform parity
- ANA: full suite of HMI pattern pages
- Cross-reference `ApiLinks` added to all pages

**Phase 3 — Illustration system**
- 9 new endpoint SVG illustrations for Routing & LDEVR
- `IlloXxx` component system — theme-aware SVG hero cards
- Dual-style toggle (legacy vs new illustration style)
- Colour palette tokens: accent/warn/danger
- 6 functional colour-scale themes with light/dark variants

**Phase 4 — Live demos**
- `Interactive Demos` page with full day/night theme system
- All EV/Map/Traffic/Safety demo components with palette theming
- `useDemoStyle` hook extracted for consistent palette application
- TomTom Maps SDK integration for live map rendering in demos
- Rich popup cards with collapsible JSON on map markers
- `TryItDemos` plumbing page — all ~40 endpoints in one place
- `TryItEmbed` component for lazy-loading demos into API ref pages
- Demos embedded in all relevant API reference pages

**Phase 5 — DocsPortal / Discovery**
- Discovery + Catalogue on single page with sticky use-cases bar
- `Blueprint Light` theme
- 6 buyer-centric use-case filter categories (not product categories)
- `ProductCard` component unifying Discovery and Catalogue cards
- LDEVR, ANA, NavSDK, EV Charging cards added to Discovery mosaic

**Phase 6 — Design system & a11y**
- WCAG 2.1 AA and design critique fixes across all pages
- Playbook token alignment: badges, method tags, semantic surfaces
- Sidenav normalised to single font (Proxima Nova)
- 20px corner radius standardised across all cards
- `ApiLinks` cross-reference cards redesigned to match Discovery style

**Phase 7 — Plumbing Portal**
- Global Plumbing Portal overlay (press `?`)
- Plumbing Portal nav: 13 items, 4 groups
- SVG copy on hero cards in portal
- Full-width demo gallery inside portal

**Phase 8 — UIComponentGallery**
- Built from scratch, grew from 12 → 21 → 37 → 43 → 49 sections
- 7 logical groups with quick-jump nav
- Real TomTomLogo SVG in header specimens
- Correct purple AI panel (#5b21b6, not red)
- Sidenav tree connectors (CornerConnector/TeeConnector) matching real code
- Shell layout with mobile/tablet/desktop variants + interactive toggles
- Comprehensive usage audit — grep-based file counts for every class
- Color-coded usage pills (green/yellow/orange/red/amber)
- Playbook component mapping — purple pills for all 19 matched sections
- **Decision Mode** — keep/merge/erase audit with localStorage + export

**Phase 9 — Routing API depth pass (current)**
- `ROUTING_API_NAV_A/B/C` — three nav patterns, Option B (concept-first + vDots) is default
- Merged Map Platforms + Reference sections → single "Versions & Reference" group
- `RoutingEVLanding` + `RoutingHowToLanding` — guide sub-group landing pages
- `PARAM_TABLE` — 54-row A–Z parameter index with version badges (v1/v2/v3)
- Response schema expanded to full depth: guidance, optimizedWaypoints, warnings
- Intro version comparison table aligned to inline V1/V2/V3 bold + status pill
- Gallery §44–49: Version Badges, Param Index Table, Response Tree, Guide Landing Card, Nav Option B, Nav Option C

---

## API documentation source

All API reference content is sourced from the official documentation repository:
```
/Users/mistrypr/Downloads/devportal-documentation-develop/documentation/<api-name>/
```

Every param, response field, and endpoint described in the portal **must trace back to a `.mdx` file in this repo**. Never invent content. When a page is built, read the source `.mdx` files first.

Key folder pattern per API:
```
<api-name>/
  documentation/
    tomtom-maps/          ← v1 content
      calculate-route.mdx
      common-routing-parameters.mdx
      product-information/introduction.mdx
    tomtom-orbis-maps/
      v2/                 ← v2 content
      v3/                 ← v3 content (private preview where applicable)
```

---

## API build blueprint (repeat for every API)

The standard 6-step process established with Routing API. Follow this exactly.

### Step 1 — Inventory the source
Read `<api-name>/documentation/` in the devportal repo. Map every `.mdx` file to one of:
- **Endpoint reference** — request params + response schema
- **Guide** — how-to, use-case, or concept explanation
- **Product info** — intro, market coverage, migration, release notes

This becomes the content inventory. Nothing gets skipped.

### Step 2 — Build the nav (`src/data/nav-<api>.js`)
Three exports:
- **`<API>_NAV`** (Option A) — version-sectioned; one section per version, endpoints repeat per version
- **`<API>_NAV_B`** (Option B) — concept-first; one entry per endpoint concept, `vDots` show version coverage. **This is the default.**
- **`<API>_NAV_C`** (Option C) — same as B but adds `{ type: 'version-filter' }` entry for a segmented All/V1/V2/V3 control

Register **B as the default** in `src/data/products.js`:
```js
import { FOO_NAV_B as FOO_NAV, FOO_PAGE_TITLES } from './nav-foo';
```

Shared tail at the bottom of every B/C nav — **7 items, always in this order**:
```
Guides section → sub-groups with landingId
Reference section → Versions & Reference group (landingId: '<api>-platform')
  1. <API Name> v1            id: '<api>-tomtom-maps'
  2. <API Name> v2 (& v3)     id: '<api>-orbis-maps'  (combine v2+v3 as one item if both exist)
  3. Migration Guide           id: '<api>-migration'
  4. Parameter Index           id: '<api>-params-ref'
  5. Response Schema           id: '<api>-response-ref'
  6. Error Codes               id: '<api>-error-codes'
  7. Market Coverage           id: '<api>-coverage'
```

Also add all page IDs to the `*_PAGE_TITLES` export at the bottom of the nav file.

### Step 3 — Build the Intro page (`src/pages/<Api>Intro.jsx`)
**No hero image** (see page design rule 3). Mandatory section order:
1. `<h1>` + `<p className="quick-answer">`
2. **Quickstart CTA** — red button `onNavigate('<api>-quickstart', '<product-id>')` + secondary "API Reference" button
3. **Endpoints grid** — nav cards with thumbnail, HTTP method badge, title, description
4. **Guides cards** — inline cards `onNavigate('<guide-id>', '<product-id>')`
5. **Version comparison table** — columns: `V1 bold + status pill` (green Production), `V2` (purple Public Preview), `V3` (orange Private Preview if applicable). Rows: capability features from source MDX.
6. **Base URL & Authentication** — table with Base URL, Auth, Version, Formats rows

### Step 4 — Build endpoint reference pages (`src/pages/<Api>*.jsx`)
One file per endpoint concept. Uses `ApiRefTwoCol` + `ParamRow`. Must include:
- **All** request params sourced directly from `.mdx` (zero omissions)
- `PARAM_TABLE` array: `{ name, type, dflt, v: [1,2,3], desc, values?, constraint? }` — feeds the Parameter Index
- Full response schema tree at real depth (not shallow placeholders)
- Guidance/instruction fields as a dedicated section where applicable
- `optimizedWaypoints` and `warnings` sections where the API returns them

### Step 4b — Build market coverage page (`src/pages/<Api>Coverage.jsx` or inside `<Api>GuidePages.jsx`)

All coverage pages **must follow the SearchCoverage / RoutingCoverage table pattern** (confirmed 2026-05-12):

**Mandatory section order:**
1. `<h1>API Name — Market Coverage</h1>` + `<p className="quick-answer">` describing what the API supports globally
2. **Definitions** zone — Symbol/Meaning table: `✔` = full data, `★` = conditional (see region-specific content), `—` = not provided
3. **Coverage Columns** zone — table describing each column header (e.g. what "Calculate Route" means, what "Real-time Traffic" means)
4. **One `<CoverageTable>` per region** — Americas, Asia Pacific, Europe, Middle East & Africa (match regions from source MDX)
5. `<Callout type="info">` at the bottom linking to the live TomTom developer portal coverage page for the full/up-to-date list

**Data source:** Always read from the devportal repo source MDX:
```
documentation/<api-name>/documentation/tomtom-maps/product-information/market-coverage.mdx
```
Parse the HTML tables in the MDX — extract market name, country codes, and per-column ✔/★/— values. Never approximate or omit markets.

**Column headers:** Use the exact column names from the source MDX. For Routing: `['Market', 'Country codes', 'Calculate Route & Reachable Range', 'Real-time Traffic']`.

**Table styles** (copy exactly, do not deviate):
```js
const tdStyle    = { padding: '8px 12px', border: '1px solid var(--border)', fontSize: '0.8125rem', verticalAlign: 'top', textAlign: 'center' };
const thStyle    = { ...tdStyle, background: 'var(--s1)', fontWeight: 600 };
const tdLeft     = { ...tdStyle, textAlign: 'left' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' };
const CHECK = '✔';
const STAR  = '★';
```

**TOC entries** for every coverage page:
```js
'<api>-coverage': [
  { id: 'definitions',     label: 'Definitions' },
  { id: 'coverage-legend', label: 'Coverage columns' },
  { id: 'americas',        label: 'Americas' },
  { id: 'asia-pacific',    label: 'Asia Pacific' },
  { id: 'europe',          label: 'Europe' },
  { id: 'mea',             label: 'Middle East & Africa' },
],
```

### Step 4c — Build migration guide page (`src/pages/<Api>Migration.jsx`)

All migration pages **must follow the RoutingMigration pattern** (confirmed 2026-05-12). Reference: `RoutingMigration` in `RoutingGuidePages.jsx`.

**Imports required:**
```js
import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
```

**Data structure:**
```js
const MIGRATION_CHANGES = [
  { area: 'Base URL', v1: '...old...', v2: '...new...', note: 'Action description.' },
  // ...
];
```

**Key changes table** — copy this exact JSX pattern from RoutingMigration:
- Container: `background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden'`
- Header row: `gridTemplateColumns: '120px 1fr 1fr 1fr'`, labels `['Area', 'v1', 'v2', 'Action']` in `var(--mid)` uppercase
- V1 column: `<code>` with `color: '#22c55e', background: '#22c55e12'`
- V2 column: `<code>` with `color: '#a78bfa', background: '#a78bfa12'`
- V3 column (when applicable): `<code>` with `color: '#fb923c', background: '#fb923c12'`
- Action column: `<span>` with `color: 'var(--muted)'`

**Mandatory section order:**
1. `<h1>API Name — Migration Guide</h1>` + `<PageActions>` + `<p className="quick-answer">`
2. `<Callout>` with preview status (Public Preview → `type="warn"`, Private Preview → `type="warn"`)
3. **Key changes** zone — AREA/V1/V2/ACTION table (one per version transition if multiple)
4. **Response field renames** (if applicable) — plain HTML table with `v1 field` / `v2 field` columns
5. **Code comparison** zone — `CodeBlock` before + `CodeBlock` after with labels "Before (vN):" / "After (vN):"
6. **Next steps** zone — `page-action-btn` buttons to related pages

**Source docs path:**
```
documentation/<api-name>/documentation/tomtom-orbis-maps/[vN/]product-information/migration-guide.mdx
```
Always read source MDX before writing. Never invent breaking changes.

**TOC entries** for every migration page:
- Single-version migration: `key-changes`, `code-comparison`, plus any specific sections (`removed`, `field-renames`, etc.)
- Multi-version migration (e.g. LDEVR): `v1-to-v2`, `v2-to-v3`, `code-comparison`
- APIs with per-endpoint sections (Traffic, Map Display): `general-changes`, then one id per endpoint

**Existing migration pages** (all rebuilt to this pattern 2026-05-12):
| API | File | Sections |
|---|---|---|
| Routing | `RoutingGuidePages.jsx` → `RoutingMigration` | key-changes, code-comparison, next-steps |
| Search | `SearchMigration.jsx` | key-changes, code-comparison, removed |
| Geocoding | `GeocodingMigration.jsx` | v1-migration, v2-migration, code-comparison |
| Traffic | `TrafficMigration.jsx` | general-changes, flow-vector-tiles, incident-details, code-comparison |
| Map Display | `MapMigration.jsx` | general-changes, vector-tile, raster-tile, code-comparison |
| LDEVR | `LDEVRMigration.jsx` | v1-to-v2 (with field renames table), v2-to-v3, code-comparison |
| EV Charging | — | No migration doc exists in source repo |

### Step 4d — Build quickstart page (`src/pages/<Api>Quickstart.jsx`)

All quickstart pages **must follow the RoutingQuickStart pattern** (confirmed 2026-05-12). Reference: `src/pages/RoutingQuickStart.jsx`.

**Imports required:**
```js
import { lazy, Suspense } from 'react';
import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';

const TryItEmbed = lazy(() => import('../components/demos/TryItEmbed'));
```

**Mandatory section order:**
1. `<h1>Quick Start</h1>` + `<PageActions>` + `<p className="quick-answer">`
2. **Authentication** zone — `CodeBlock` with a representative API call + `<Callout type="info" title="Keep your key secret">` warning about client-side exposure
3. **Your first X** zone — `<TryItEmbed>` live widget + `CodeBlock` cURL equivalent + `CodeBlock` abbreviated response with labels "Equivalent cURL request:" / "Abbreviated response:"
4. **Understanding the response** zone — key/description grid explaining top-level response fields
5. **Which version should I use?** zone — version comparison cards (one per version)
6. **Next steps** zone — `page-action-btn` buttons to related endpoint reference pages

**TryItEmbed pattern (mandatory):**
```jsx
<Suspense fallback={<div style={{ height: 200, background: 'var(--s1)', borderRadius: 12 }} />}>
  <TryItEmbed demoId="the-demo-id" />
</Suspense>
```
See `CLAUDE.md → Live demo system` for all available demo IDs.

**Response structure grid pattern:**
```jsx
<div style={{ display: 'grid', gap: '0.5rem' }}>
  {[
    { key: 'fieldName', desc: 'Description of the field.' },
    ...
  ].map(({ key, desc }) => (
    <div key={key} style={{
      display: 'grid', gridTemplateColumns: '220px 1fr', gap: '0.75rem',
      padding: '0.625rem 0.875rem', background: 'var(--s1)',
      border: '1px solid var(--border)', borderRadius: '10px', alignItems: 'start',
    }}>
      <code style={{ fontSize: '0.75rem', color: 'var(--brand)', fontFamily: 'var(--font-mono)' }}>{key}</code>
      <span style={{ fontSize: '0.8125rem', color: 'var(--text)' }}>{desc}</span>
    </div>
  ))}
</div>
```

**Version comparison cards pattern:**
```jsx
<div style={{ display: 'grid', gap: '0.875rem' }}>
  {[
    {
      version: 'v1', label: 'Production', color: '#22c55e',
      platform: 'TomTom Maps', methods: 'GET or POST',
      baseUrl: '/base/url/pattern',
      summary: 'Description of what this version offers.',
    },
    ...
  ].map(v => (
    <div key={v.version} style={{
      padding: '1rem 1.125rem', background: 'var(--bg)',
      border: '1px solid var(--border)', borderRadius: '20px',
      display: 'grid', gridTemplateColumns: '56px 1fr', gap: '0.875rem', alignItems: 'start',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          display: 'inline-block', padding: '2px 8px',
          background: v.color + '22', border: `1px solid ${v.color}66`,
          borderRadius: '6px', fontSize: '0.6875rem', fontWeight: 700,
          color: v.color, marginBottom: '0.25rem',
        }}>{v.version}</div>
        <div style={{ fontSize: '0.625rem', color: 'var(--muted)', lineHeight: 1.2 }}>{v.label}</div>
      </div>
      <div>
        <div style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.25rem' }}>{v.summary}</div>
        <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
            <strong style={{ color: 'var(--mid)' }}>Platform:</strong> {v.platform}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
            <strong style={{ color: 'var(--mid)' }}>Methods:</strong> {v.methods}
          </span>
          <code style={{ fontSize: '0.6875rem', color: 'var(--mid)', fontFamily: 'var(--font-mono)' }}>{v.baseUrl}</code>
        </div>
      </div>
    </div>
  ))}
</div>
```

**Version colours per status:**
- v1 Production: `#22c55e`
- v2 Public Preview: `#a78bfa`
- v3 Private Preview: `#fb923c`

**TOC entries** for every quickstart page (update `TOC_MAP` in `TOC.jsx`):
```js
'<api>-quickstart': [
  { id: 'authentication',    label: 'Authentication' },
  { id: 'first-<verb>',      label: 'Your first <verb>' },   // e.g. 'first-search', 'first-route'
  { id: 'response-structure', label: 'Understanding the response' },
  { id: 'version-comparison', label: 'Which version?' },
],
```
Note: `next-steps` zone is intentionally omitted from TOC (below-the-fold utility section).

**Existing quickstart pages** (all rebuilt to this pattern 2026-05-12):
| API | File | TryIt demoId | Versions |
|---|---|---|---|
| Routing | `RoutingQuickStart.jsx` | `calculate-route` | v1, v2, v3 |
| Search | `SearchQuickstart.jsx` | `fuzzy-search` | v1, v2 |
| Geocoding | `GeocodingQuickstart.jsx` | `geocode` | v1, v2 |
| Traffic | `TrafficQuickstart.jsx` | `traffic-incidents` | v1, v3 |
| Map Display | `MapDisplayQuickstart.jsx` | `raster-tile` | v1, v2 |
| LDEVR | `LDEVRQuickstart.jsx` | `ldevr-weather` | v1, v2, v3 |
| EV Charging | `EVChargingQuickstart.jsx` | `ev-station-search` | v1, v3 |

### Step 5 — Build guide landing pages (`src/pages/<Api>GuidePages.jsx`)
For every Guides sub-group that has a `landingId`, a landing component with a `CARDS` array and `onNavigate` links. Eliminates dead group-header clicks.

### Step 6 — Register new UI patterns in the gallery
Any net-new component pattern introduced by this API gets a `§N` section in `UIComponentGallery.jsx`:
- New badge or pill type → "API Reference" group
- New layout pattern → "API Reference" group
- New nav pattern → "App Shell" group

---

## API build status

| API | Nav | Intro | Endpoint pages | Guide landings | Param Index | Response depth | Gallery |
|---|---|---|---|---|---|---|---|
| Routing API | ✅ A/B/C | ✅ | ✅ v1/v2/v3 | ✅ EV + How-to | ✅ 54-row A–Z | ✅ full | ✅ §44–49 |
| LDEVR | ✅ A/B/C | ✅ v1/v2/v3 | ✅ 13 pages incl. Guidance v3 | ✅ Platform landing | ✅ 40 params | ✅ full tree | — |
| Search API | ✅ A/B/C | ✅ v1/v2 | ✅ 11 endpoints + POI | ✅ Guides + Platform | ✅ 29 params | ✅ full tree | — |
| Geocoding API | ✅ A/B/C | ✅ v1/v2/v3 | ✅ Geocode, Rev, Structured, CrossStreet | ✅ Guides + Platform | ✅ 24 params | ✅ full tree | — |
| Traffic API | ✅ A/B/C | ✅ v1 (TomTom Maps); v2/v3 Orbis not yet built | ✅ Flow, Incidents, Tiles (raster+vector), Model ID | ✅ Guides + Platform | ✅ 19 params | ✅ full tree | — |
| Map Display API | ✅ A/B/C | ✅ v1/v2/v3 (3D Landmarks + Extended = v3 Private Preview; Assets/Static/WMS/WMTS = v1) | ✅ Raster, Vector, Satellite, Hillshade, Static, WMS, WMTS, Assets, 3D, Extended, Copyrights | ✅ Guides + Platform | ✅ 16 params | ✅ full tree | — |
| EV Charging API | ✅ A/B/C | ✅ v1/v3 (Orbis = Private Preview; Unified pattern) | ✅ Station Search, Nearby, Along-Route, By ID, Availability, Markets | ✅ Guides + Platform | ✅ 20 params | ✅ full tree | — |
| Matrix Routing | — | partial | partial | — | — | — | — |
| Waypoint Opt. | — | partial | — | — | — | — | — |
| Traffic Analytics | — | partial | partial | — | — | — | — |
| Parking & Fuel | — | partial | partial | — | — | — | — |
| Snap to Roads | — | partial | partial | — | — | — | — |

**Completed:** All 6 priority APIs (Routing, LDEVR, Search, Geocoding, Traffic, Map Display, EV Charging) have nav A/B/C, upgraded intro pages with version tables, all endpoint pages, guide landings, and platform reference landings. All wired in App.jsx.

---

## Version system (fixed across all APIs)

| Version | Colour | Badge bg | Status label |
|---|---|---|---|
| v1 | `#15803d` | `rgba(34,197,94,0.1)` | Production |
| v2 | `#7c3aed` | `rgba(167,139,250,0.1)` | Public Preview |
| v3 | `#c2410c` | `rgba(251,146,60,0.1)` | Private Preview |

vDots (nav): `5×5px` circles, same colours as above. `border-radius: 50%`. Absent = not supported in that version.

### Version accuracy rules — always check source docs

Before setting the `version` prop on any API reference page, or `vDots` on any nav item, you **must** verify the correct label from the source `.mdx` files in the devportal repo. The rules:

| Source MDX says… | Portal version label | `version` prop | `vDots` |
|---|---|---|---|
| TomTom Maps content (no Orbis folder) | Production | `"v1"` | `['v1']` |
| Orbis Maps — no preview notice | Production | `"v2"` | `['v2']` |
| Orbis Maps — `Public Preview` notice | Public Preview | `"v2"` | `['v2']` |
| Orbis Maps — `Private Preview` notice | Private Preview | `"v3"` | `['v3']` |
| Both TomTom Maps + Orbis (any preview) | Use Unified pattern | see rule 6 | `['v1','v2']` or `['v1','v3']` |

**Never use:**
- `version="v2-private"` — not a valid key; VersionTabBar will silently skip it. Use `"v2"` (Public Preview) or `"v3"` (Private Preview).
- `version="v4"` / `version="v5"` / any other service-version number — those are URL path segments, not our portal version labels. Always map to `v1`/`v2`/`v3`.

**Confirmed endpoint version status (audited 2026-05-12):**
| Endpoint group | Orbis status | Portal version |
|---|---|---|
| Search API (all endpoints) | Public Preview | v2 |
| Geocoding API (all endpoints) | Public Preview | v2 |
| Traffic API — flow/incidents/tiles/model-id | TomTom Maps only (current pages) | v1 |
| Traffic API — Orbis raster flow v2 / incident v2 | Private Preview | v3 (not yet built) |
| Map Display — raster/vector/satellite/hillshade/copyrights | Public Preview | v2 |
| Map Display — 3D Landmarks | Private Preview | v3 |
| Map Display — Extended Tiles | Private Preview | v3 |
| Map Display — Static Image / WMS / WMTS / Map Assets | TomTom Maps only | v1 |
| EV Charging (all 5 endpoints) | Private Preview | v3 ✅ |
| LDEVR — weather/vehicle-brand/oem-emsp/toll/parks/data-freshness | Public Preview | v2 |
| LDEVR — guidance | Private Preview | v3 ✅ |

---

## Page design standards

Rules that apply to every page in the app. Document here and implement in code.

### 1 — TOC on right side (all pages except API reference)
Every page that is **not** an API reference page (i.e. not using `ApiRefTwoCol`) must have a TOC entry in `TOC_MAP` (`src/components/layout/TOC.jsx`). The shell shows the right column automatically when `TOC_MAP[currentPage]` is non-empty. Intro pages, guide pages, quickstart pages, and reference landing pages all get TOC entries.

### 2 — Intro page quick-link to quickstart
Every API intro page must have a prominent CTA button (styled like the quickstart card) that calls `onNavigate('<api>-quickstart', '<product-id>')`. Place it in the opening zone, after the `quick-answer` paragraph and before the endpoints grid.

### 3 — No hero images
Do not use `<HeroIllo>` or any SVG illustration component on intro pages. The intro page opens directly with the `quick-answer` paragraph.

### 4 — Endpoints come before version table in Intro
Intro page section order (mandatory):
1. `<h1>` + `quick-answer`
2. Quickstart CTA (rule 2)
3. **Endpoints grid** (`zone` with endpoint cards)
4. **Guides cards** (one card per guide, `onNavigate` links)
5. **Version comparison table** (`zone` with `<h2 id="versions">`)
6. Base URL + authentication notes

### 5 — Guides come before version table in Intro
Guide cards must appear in the intro page **above** the version comparison table. (Covered by the ordering in rule 4.)

### 6 — API reference pages need a version switcher in the header
Use `VersionTabBar` (`src/components/ui/VersionTabBar.jsx`) — the same component used by Routing API pages. This is a tab strip, not just pills.

**Single-version endpoint** (non-interactive indicator):
```jsx
import VersionTabBar from '../components/ui/VersionTabBar';
// In the page-header with page-header--with-tabs class:
<div className="page-header page-header--with-tabs">
  <h1>Endpoint Name</h1>
  <PageActions />
  <VersionTabBar versions={['v2']} activeTab="v2" onTabChange={() => {}} />
</div>
```

**Multi-version endpoint** (interactive tab switching — follow the Routing Unified pattern):
```jsx
import { useState } from 'react';
import VersionTabBar from '../components/ui/VersionTabBar';
export function FooUnified({ onNavigate }) {
  const [tab, setTab] = useState('v1');
  return (
    <div className="page page--wide">
      <div className="page-header page-header--with-tabs">
        <h1>Endpoint Name</h1>
        <PageActions />
        <VersionTabBar versions={['v1', 'v2']} activeTab={tab} onTabChange={setTab} />
      </div>
      {tab === 'v1' && <FooV1Content onNavigate={onNavigate} />}
      {tab === 'v2' && <FooV2Content onNavigate={onNavigate} />}
    </div>
  );
}
```

`ApiRefTwoCol` integrates this automatically when the `version` prop is set (e.g. `version="v1"` or `version="v1,v2"`). It parses the string, renders `VersionTabBar` in non-interactive mode (single version = static indicator), and applies `page-header--with-tabs` to remove the header's bottom border. The tab strip itself provides the border via its `borderBottom: '1px solid var(--border)'` wrapper.

### 7 — No TryIt / Try-it-live widget on API reference pages
`TryItEmbed` is **removed** from `ApiRefTwoCol`. The lazy import, `pageDemoId`, `demoBlock`, and its render are deleted. `demoId` properties in `sections` arrays are ignored (no-ops). TryIt will be re-added via a dedicated mechanism later.

---

## API Explorer pages — architecture rules

The Routing API Explorer (`src/pages/RoutingExplorer.jsx`) is the canonical pattern for any future interactive API explorer page. Follow these rules exactly when building a new one.

### Component structure

An Explorer page has two module-level components:

```
MapPanel (or equivalent visualisation component)   ← module level, before the Page
export default function XxxExplorer({ onNavigate, isDark = false })  ← Page
```

`MapPanel` is a **separate module-level function**, not nested inside the Page. This is intentional — it owns its own map lifecycle and isolates map re-renders from the page's param state updates.

### isDark threading

`isDark` is the portal's light/dark theme toggle. It must flow down from `App` all the way to `MapPanel`:

1. **`App.jsx — PageContent` props**: `PageContent` is a module-level function. It does NOT close over `App`'s state. Add `isDark` to its props and pass it at the call site:
   ```jsx
   // PageContent signature:
   function PageContent({ pageId, onNavigate, product, platform, routingNavMode = 'a', isDark = false }) { … }

   // Call site (inside App's JSX):
   <PageContent … isDark={isDark} />

   // Case in the switch:
   case 'xxx-explorer': return <XxxExplorer onNavigate={onNavigate} isDark={isDark} />;
   ```

2. **Page component**: Accepts `isDark = false` as a prop and passes it to `MapPanel`:
   ```jsx
   export default function XxxExplorer({ onNavigate, isDark = false }) {
     …
     return … <MapPanel … isDark={isDark} />;
   }
   ```

3. **MapPanel**: Accepts `isDark = false` as a prop and uses it directly in effects. Never reads it from a parent scope — always from its own props.

### State that belongs in MapPanel, not in the Page

`MapPanel` is module-level and cannot close over the Page's state. Any state or refs used exclusively inside `MapPanel` must be declared there:

| Variable | Where to declare | Why |
|---|---|---|
| `mapRef` | `MapPanel` | Map instance lifecycle |
| `appliedStyleRef` | `MapPanel` | Tracks last-applied isDark value, prevents double-fire |
| `redrawToken` / `setRedrawToken` | `MapPanel` | Bumped after `setStyle()` to re-trigger route draw |
| `markersRef`, `popupRef` | `MapPanel` | Marker lifecycle |

**Never** declare these in the Page and reference them from `MapPanel` — they will be `undefined` at runtime.

### Dark/light map style switching pattern

Use the TomTom Style API URL template. The confirmed working format (SDK v6.25.1):

```js
const STYLE_VERSION = '22.2.1-*';

function mapStyleUrl(apiKey, isDark) {
  const v = isDark ? 'dark' : 'light';
  const key = apiKey || DEMO_KEY;
  return (
    `https://api.tomtom.com/style/1/style/${STYLE_VERSION}` +
    `?key=${key}&map=2/basic_street-${v}` +
    `&traffic_incidents=2/incidents_${v}` +
    `&traffic_flow=2/flow_relative-${v}` +
    `&poi=2/poi_${v}`
  );
}
```

Inside `MapPanel`, two effects handle style:

```js
// Effect 1 — init map with correct style from the start
useEffect(() => {
  loadSdk().then(tt => {
    map = tt.map({ key: apiKey, container: containerRef.current, style: mapStyleUrl(apiKey, isDark), … });
    appliedStyleRef.current = isDark;
    mapRef.current = map;
  }).catch(() => {});
  return () => { /* cleanup */ };
}, [apiKey]); // apiKey only — isDark baked in at init via closure

// Effect 2 — switch style when portal theme toggles
useEffect(() => {
  const map = mapRef.current;
  if (!map || appliedStyleRef.current === isDark) return;
  appliedStyleRef.current = isDark;
  try {
    map.setStyle(mapStyleUrl(apiKey, isDark));
    map.once('styledata', () => {
      if (!mapRef.current) return;
      if (mapRef.current.isStyleLoaded()) {
        setRedrawToken(t => t + 1);
      } else {
        mapRef.current.once('idle', () => setRedrawToken(t => t + 1));
      }
    });
  } catch {}
}, [isDark]);

// Route draw effect — include redrawToken in deps so it re-fires after style swap
useEffect(() => {
  …
}, [result, endpoint, vals.origin, redrawToken]);
```

### Scoping checklist before shipping any Explorer page

- [ ] `MapPanel` (or equivalent) has `isDark = false` in its own props
- [ ] All map-related refs and style-state live inside `MapPanel`, not the Page
- [ ] `PageContent` in `App.jsx` has `isDark` in its props signature
- [ ] `<PageContent>` call site passes `isDark={isDark}`
- [ ] The new `case 'xxx-explorer'` in `PageContent` passes `isDark={isDark}` to the page component
- [ ] `redrawToken` is in the route-draw effect's dependency array

### Explorer pages — variant patterns

Not all explorers need a TomTom Maps SDK map. Use the right visual output for the API:

| API type | Visual output | Pattern |
|---|---|---|
| Routing / Traffic (with SDK map) | Live TomTom Maps SDK map | `TrafficMap`/`RouteMap` module-level component, `isDark` prop, `appliedStyleRef` guard, `redrawToken` |
| Traffic incidents (no SDK needed) | Incident markers on TomTom map | Same as above — TrafficMap handles both incidents and flow-segment |
| Map Display (tile/image APIs) | `<img>` tags — the response IS the image | No SDK needed. `TileGrid` shows 3×3 stitched tiles. Static Image uses `<img key={url}>` to auto-reload. |

### Existing Explorer pages (confirmed working 2026-05-14)

| API | File | Page ID | Endpoints |
|---|---|---|---|
| Routing | `src/pages/RoutingExplorer.jsx` | `routing-explorer` | Calculate Route, Reachable Range (v1 + v2) |
| Traffic | `src/pages/TrafficExplorer.jsx` | `traffic-explorer` | Incident Details v5, Flow Segment Data v4 |
| Map Display | `src/pages/MapDisplayExplorer.jsx` | `map-display-explorer` | Raster Tile (3×3 grid), Static Image |

### Map Display Explorer — special notes

- **No TomTom Maps SDK** — tiles and static images load directly via `<img src={url}>` (no CORS issue)
- **Raster Tile**: `TileGrid` component derives tile X/Y from lat/lon using `latLonToTile()`, shows 3×3 grid, center tile has pin + z/x/y label
- **Static Image**: `<img key={staticImgUrl}>` re-mounts automatically when any param changes (no Run button needed)
- **Static Image `center` param**: API takes `longitude,latitude` order (NOT lat,lon) — the `staticUrl()` helper handles this
- **Traffic Incidents `fields` param**: Valid properties are `iconCategory, magnitudeOfDelay, from, to, length, delay, roadNumbers, timeValidity, probabilityOfOccurrence, numberOfReports` — `startPoint` and `endPoint` are NOT valid

---

## Hard rules (never do these)

- Don't use `var(--red)` for the AI panel — it uses purple `#5b21b6`
- Don't wrap the gallery in `.page` — no `.page` class in `UIComponentGallery`
- Don't import `PageActions` into `UIComponentGallery`
- Don't use `cd` before `git` commands (git already operates on cwd)
- Don't add emojis to source files unless explicitly asked
- Don't use `sed` with `&` in class name strings — use the `Edit` tool directly
- Don't add the `--no-verify` or `-c commit.gpgsign=false` flags to git
- Nav links in `GlobalHeader` are `['Products', 'Resources', 'Pricing']` — not Maps/Nav/EV

---

## Dev server

```bash
npm run dev   # → http://localhost:5173
```

Server name in `.claude/launch.json`: `"UX Library — dev"`
Server ID (current session): `5b08df56-3ef7-4a8f-b8ec-7b49a65a0bee`
