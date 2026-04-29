# TomTom UX Library — Documentation Site

Interactive documentation for the TomTom UX Library SDK — a composable Android UI layer built on top of NavSDK for automotive, IVI, and fleet navigation applications.

![Overview](docs/screenshots/01-overview.png)

---

## What's inside

The UX Library gives OEMs a production-ready baseline for every visible layer of the navigation experience — colours, typography, map styles, navigation panels, search, cluster display, AI assistant integration, and vehicle systems — all overridable without forking the SDK.

---

## Screens

### Map Style — live interactive preview
Switch between Browse, Drive, Mono, and Satellite styles. The live TomTom map updates instantly inside a landscape tablet frame with contextual overlays (NIP strip for Drive, search bar for Browse).

![Map Style](docs/screenshots/02-map-style.png)

---

### Instrument Cluster — interactive configuration builder
Toggle map, horizon panel, and vignette on/off. Add or remove NIP, SLG, CMP, JV, UEP, and ETA components. Switch NIP and ETA layout types. The cluster display updates live and generates the corresponding Kotlin + ADB intent code.

![Cluster](docs/screenshots/03-cluster.png)

---

### TomTom AI Assistant — architecture overview
The signal flow from driver voice input through OEM STT, VPA Cloud, TAIA SDK, and TAIA Cloud — down to the Navigation App and TTS output — shown as a layered stack with OEM vs TomTom ownership badges.

![TAIA Architecture](docs/screenshots/04-taia-arch.png)

---

### ADAS Integration — capabilities & integration model
Highlights the six ADAS SDK capabilities (ISA, Predictive Speed Control, Safety Alerts, Lane Control, EV Energy Optimisation, ODD) alongside a stack diagram showing how the SDK layers onto any existing navigation provider.

![ADAS](docs/screenshots/05-adas.png)

---

### Dark mode
Full dark theme across all pages — map previews, cluster display, navigation panels, code blocks, and the global header.

![Dark mode](docs/screenshots/06-dark-map.png)

---

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Structure

```
src/
├── pages/          # One file per doc page
├── components/
│   ├── layout/     # Topnav, Sidenav, TOC, GlobalHeader
│   └── ui/         # Callout, CodeBlock, ApiLinks, Swatch
├── data/           # navigation.js — single source of truth for nav + page titles
├── hooks/          # useGlobalHeader
├── locales/        # EN + ZH i18n strings
└── index.css       # Design system — 4pt scale, CSS custom properties, dark mode
```

## Tech

- **React + Vite** — SPA, no router (page state in `useState`)
- **react-i18next** — EN / 中文 localisation
- **TomTom Maps Web SDK** — live map on Map Style and Tilt pages
- **CSS custom properties** — theming, spacing scale, dark mode via `data-theme`
- **GitHub Actions** — builds and deploys to GitHub Pages on push to `main`
