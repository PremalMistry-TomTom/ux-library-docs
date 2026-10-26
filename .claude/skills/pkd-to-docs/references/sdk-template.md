# SDK template

Reference implementation: **Maps & Navigation SDK** (`src/pages/NavSDKIntro.jsx`, `NavSDKDomains.jsx`, `NavSDKGettingStarted.jsx`, `NavSDK*Pages.jsx`, iOS in `NavSDKiOS*.jsx`, nav in `src/data/nav-navsdk.js`). The UX Library product's `Overview.jsx` and the data-driven `DomainLanding.jsx` are reusable patterns too. Don't use the UX Library as a content model — it isn't a shipping SDK.

## Page set

| Page | Required sections, in order |
|---|---|
| Intro | h1 + `quick-answer` → actions (Quick start, example app if any, Download AI context) → When to choose it → Key use cases → Capabilities → Architecture → Editions (availability only) |
| Domain landing (one per capability group) | quick answer → Use cases (cards) → Related domains |
| Getting started | Project setup → Init → First result (first map / first event / first call) → Example app if any |
| Feature page | quick answer → `ApiLinks` "APIs used on this page" → demo (if one is possible) → code → options table → platform notes |

## Platform parity

- One product ID; platforms via `platforms`, `iosNav`, `iosPageTitles` in `products.js` (see the `navsdk` entry).
- Android and iOS share headings and section order. A feature missing on one platform shows "Not on <platform> yet" instead of disappearing.
- If the sources say the SDK is one platform only (e.g. "Android only"), state that on the intro and don't create the other platform's nav. Log "other platforms" as a gap only if the PKD implies them.

## Editions

Show availability per edition (a table of capabilities × editions), never prices. Edition names must match the PKD's glossary exactly, and must match the AI context file.

## Dependencies on other SDKs

If the SDK depends on, or integrates with, another TomTom SDK (e.g. "DI SDK depends on NavSDK"), say so on the intro and link the other SDK's pages both ways with `ApiLinks` (`type: 'Android SDK'`, `pageId`, `productId: 'navsdk'`). Note that `navsdk-ios` is not a product ID — iOS pages are `navsdk` with `navsdk-ios-*` page IDs.
