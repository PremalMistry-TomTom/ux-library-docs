# TomTom UX Library — Documentation Site

Interactive documentation for the TomTom UX Library SDK — a composable Android UI layer built on top of NavSDK for automotive, IVI, and fleet navigation applications.

> **Live preview →** deploy via Vercel (see [Sharing internally](#sharing-internally) below)

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

### Home Screen Layout — interactive IVI screen zones & resize demo
Click any of the four named zones to highlight it on the full-width IVI mock. Drag the four inset sliders to resize the navigation application area live — the generated Kotlin code updates in real time. A fourth explorer lets you combine all four UI state dimensions to inspect active/passive transitions.

![Home Screen Layout](docs/screenshots/07-home-screen-layout.png)

---

### Navigation Controls — button bar position & search entry point
Choose from four button bar positions (left, right, top, bottom) and toggle individual control buttons on/off. Switch search entry between a persistent destination panel and a compact button. The full-width IVI mock and Kotlin snippet update instantly.

![Navigation Controls](docs/screenshots/08-nav-controls.png)

---

### Horizon Panel — composed vs decomposed layout
Toggle between the single composed Horizon Panel and its three independent sub-components (NIP, Upcoming Events, ETA). Switch panel position between left, centre, and right. The full-width guidance mock shows exactly how each configuration looks on screen.

![Horizon Panel](docs/screenshots/09-horizon-panel.png)

---

### Next Instruction Panel — five anchor positions
Place the NIP at any of five anchor points (top-left, top-centre, top-right, bottom-left, bottom-right). The full-width map mock and Kotlin configuration update live.

![Next Instruction Panel](docs/screenshots/10-instruction-panel.png)

---

### ETA Panel — position & content field toggles
Choose from six anchor positions and individually show/hide each content field (ETA, travel time, distance, battery SoC, end-route button) via toggle switches. The full-width map mock and generated Kotlin reflect every change.

![ETA Panel](docs/screenshots/11-eta-panel.png)

---

## Sharing internally

The repo is private, so GitHub Pages won't serve it publicly. The easiest way to give colleagues a live URL is **Vercel** — free, no config needed beyond connecting the repo.

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click **Add New → Project**
3. Import **PremalMistry-TomTom/ux-library-docs**
4. Leave all settings as-is (Vercel auto-detects Vite) and click **Deploy**

That's it. You'll get a URL like `ux-library-docs.vercel.app` in about 60 seconds. Every push to `main` auto-redeploys. Anyone with the link can view it — no GitHub account required.

A `vercel.json` is already committed to the repo with the correct build settings.

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
