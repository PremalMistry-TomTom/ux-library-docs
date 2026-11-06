/* ─────────────────────────────────────────────────────────────────────────────
 * hairline.jsx — TomTom Docs hairline illustrations (Thiago Andrade's set)
 *
 * The figures and the kernel are vendored in public/hairline/ by
 * scripts/sync-hairline.sh; never edit them here. Each figure is drawn live
 * in a 400 × 320 viewBox (aspect 5:4) and coloured by CSS variables, so the
 * Plumbing colour and theme options recolour every figure at once.
 *
 * Colour and theme live on <html> (data-hl-colour, data-hl-theme) and are
 * set by IlloStyleProvider; the CSS is in index.css under "Hairline".
 * ───────────────────────────────────────────────────────────────────────────── */
import { useEffect, useRef, useState } from 'react';
import {
  IcoADAS, IcoAIConfig, IcoAreaAnalytics, IcoCalculateRoute, IcoEV, IcoEVRouting,
  IcoEVSearchNearby, IcoGeocode, IcoHomeScreen, IcoHorizonPanel, IcoIntentRouting,
  IcoMapDisplay, IcoMapRasterTile, IcoMapSatelliteTile, IcoMapStaticImage, IcoMapVectorTile,
  IcoMatrixRouting, IcoNavGuidance, IcoNavSDKNavigation, IcoNavSDKRouting, IcoNavSDKSearch,
  IcoNavSDKVirtualHorizon, IcoODAnalysis, IcoParkingAvailability, IcoPOIDetails,
  IcoReachableRange, IcoRoutingWeather, IcoSearchFuzzy, IcoSearchPOI, IcoTrafficFlow,
  IcoTrafficFlowTile, IcoTrafficIncidents, IcoTrafficStats, IcoTruck, IcoVIBasics, IcoWaypointOpt,
  IcoNavSDKLocation, IcoNavSDKOffline, IcoNavSDKAdvanced, IcoNavControls, IcoTurnInstructions,
  IcoInstructionPanel, IcoRouteBar, IcoHUD, IcoETAPanel, IcoCluster, IcoEVNavUI, IcoEVBattery,
  IcoSearchAutocomplete, IcoSearchNearby, IcoSearchAlongRoute, IcoReverseGeocode, IcoBatchRouting,
  IcoSnapToRoads, IcoEVChargingAvailability, IcoEVRequirements, IcoVoiceEngine, IcoMapStyle, IcoThemingTokens,
  IcoPOIPhotos, IcoTrafficModelID, IcoJunctionAnalytics, IcoParkingPrices, IcoOnStreetParking, IcoFuelPrices,
  IcoAIVoice, IcoSpeechToText, IcoConversationPersonality, IcoColourSystem, IcoSearchResult,
} from './iconVariants';

import UPSTREAM_INDEX from '../../public/hairline/figures/index.json';
import LOCAL_INDEX from '../../public/hairline-local/figures/index.json';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/* Every figure that exists. A mapping or a per-card slug that names a figure not
   in this set (one planned in src/data/hairline-backlog.js) is ignored until the
   figure is added to public/hairline-local/figures/index.json. */
export const HAIRLINE_AVAILABLE = new Set([...UPSTREAM_INDEX, ...LOCAL_INDEX].map(f => f.slug));
const available = (slug) => (slug && HAIRLINE_AVAILABLE.has(slug) ? slug : null);

/* ── Which hairline figure stands in for which Icon-style thumbnail ──────────
   Keyed by the component itself, not its name, so it survives minification.
   An Icon with no entry keeps its Icon-style drawing until a figure is made
   for it (see HAIRLINE_GAPS below and "Make yours" in Thiago's gallery). */
export const HAIRLINE_FOR = new Map([
  [IcoMapDisplay,           'map-data'],
  [IcoMapVectorTile,        'map-layers'],
  [IcoMapRasterTile,        'apis'],
  [IcoMapSatelliteTile,     'global-data'],
  [IcoMapStaticImage,       'markers'],
  [IcoSearchFuzzy,          'search'],
  [IcoSearchPOI,            'usecases/poi'],
  [IcoPOIDetails,           'usecases/poi'],
  [IcoGeocode,              'markers'],
  [IcoTrafficFlow,          'traffic'],
  [IcoTrafficFlowTile,      'map-data'],
  [IcoTrafficIncidents,     'traffic-incident'],
  [IcoTrafficStats,         'usecases/traffic'],
  [IcoEV,                   'usecases/ev'],
  [IcoEVSearchNearby,       'usecases/ev'],
  [IcoEVRouting,            'usecases/multistop'],
  [IcoCalculateRoute,       'routing'],
  [IcoMatrixRouting,        'matrix'],
  [IcoODAnalysis,           'matrix'],
  [IcoIntentRouting,        'agentic-map'],
  [IcoAIConfig,             'mcps'],
  [IcoReachableRange,       'usecases/city'],
  [IcoWaypointOpt,          'dispatch'],
  [IcoRoutingWeather,       'usecases/heatmap'],
  [IcoNavGuidance,          'navigation'],
  [IcoNavSDKNavigation,     'navigation'],
  [IcoNavSDKSearch,         'search'],
  [IcoNavSDKRouting,        'routing'],
  [IcoNavSDKVirtualHorizon, 'mpp'],
  [IcoADAS,                 'mpp'],
  [IcoHorizonPanel,         'mpp'],
  [IcoVIBasics,             'automotive'],
  [IcoHomeScreen,           'automotive-ui'],
  [IcoParkingAvailability,  'parking'],
  [IcoTruck,                'usecases/fleet'],
  [IcoAreaAnalytics,        'usecases/density'],
  // Drawn for this prototype with the tomtom-hairline skill (public/hairline-local/)
  [IcoNavSDKLocation,       'nav/location'],
  [IcoNavSDKOffline,        'nav/offline'],
  [IcoNavSDKAdvanced,       'nav/simulate'],
  [IcoNavControls,          'nav/controls'],
  [IcoTurnInstructions,     'nav/turn'],
  [IcoInstructionPanel,     'nav/lanes'],
  [IcoRouteBar,             'nav/route-bar'],
  [IcoHUD,                  'nav/hud'],
  [IcoETAPanel,             'nav/eta'],
  [IcoCluster,              'nav/cluster'],
  [IcoEVNavUI,              'nav/ev-battery'],
  [IcoEVBattery,            'nav/ev-battery'],
  // Planned (src/data/hairline-backlog.js): active once the figure exists
  [IcoSearchAutocomplete,     'nav/autocomplete'],
  [IcoSearchNearby,           'nav/nearby'],
  [IcoSearchAlongRoute,       'nav/along-route'],
  [IcoReverseGeocode,         'nav/reverse-geocode'],
  [IcoBatchRouting,           'nav/batch'],
  [IcoSnapToRoads,            'nav/snap-to-roads'],
  [IcoEVChargingAvailability, 'nav/ev-availability'],
  [IcoEVRequirements,         'nav/ev-requirements'],
  [IcoVoiceEngine,            'nav/voice-engine'],
  [IcoMapStyle,               'nav/map-style'],
  [IcoThemingTokens,          'nav/theming'],
  [IcoPOIPhotos,              'nav/poi-photos'],
  [IcoTrafficModelID,         'nav/traffic-model'],
  [IcoJunctionAnalytics,      'nav/junction'],
  [IcoParkingPrices,          'nav/parking-prices'],
  [IcoOnStreetParking,        'nav/on-street'],
  [IcoFuelPrices,             'nav/fuel-prices'],
  [IcoAIVoice,                'nav/ai-voice'],
  [IcoSpeechToText,           'nav/speech-to-text'],
  [IcoConversationPersonality,'nav/personality'],
  [IcoColourSystem,           'nav/colour-system'],
  [IcoSearchResult,           'nav/search-result'],
]);

/** Icon thumbnails still waiting for a hairline figure of their own. */
export const HAIRLINE_GAPS = [
  'SearchNearby', 'SearchAlongRoute', 'SearchAutocomplete', 'ReverseGeocode', 'POIPhotos',
  'TrafficModelID', 'EVChargingAvailability', 'EVRequirements',
  'BatchRouting', 'SnapToRoads', 'JunctionAnalytics',
  'OnStreetParking', 'ParkingPrices', 'FuelPrices',
  'VoiceEngine', 'AIVoice', 'SpeechToText', 'ConversationPersonality',
  'ColourSystem', 'MapStyle', 'ThemingTokens', 'SearchResult',
];

/** The figure for a thumbnail: the card's own slug when it names one that exists,
    else the figure mapped to its Icon, else null (the Icon drawing stays). */
export const hairlineSlugFor = (Icon, cardSlug) =>
  available(cardSlug) || available(Icon && HAIRLINE_FOR.get(Icon)) || null;

/* ── Loading: the kernel once, each figure once ─────────────────────────── */
/* Thiago's figures are in public/hairline/figures (synced); the ones drawn for
   this prototype, slugs under nav/, are in public/hairline-local/figures. */
const LOCAL_PREFIX = 'nav/';
const figureUrl = (slug) => slug.startsWith(LOCAL_PREFIX)
  ? `${BASE}/hairline-local/figures/${slug}.js`
  : `${BASE}/hairline/figures/${slug}.js`;
let kernelP = null;
const figP = new Map();

function loadKernel() {
  if (!kernelP) {
    kernelP = fetch(`${BASE}/hairline/kernel.js`)
      .then(r => { if (!r.ok) throw new Error(`hairline kernel: ${r.status}`); return r.text(); })
      .then(src => {
        const HL = new Function(`${src};return HL`)();
        HL.inject(document);
        return HL;
      });
    kernelP.catch(() => { kernelP = null; });
  }
  return kernelP;
}

function loadFigure(slug) {
  if (!figP.has(slug)) {
    const p = Promise.all([loadKernel(), fetch(figureUrl(slug)).then(r => {
      if (!r.ok) throw new Error(`hairline ${slug}: ${r.status}`);
      return r.text();
    })]).then(([HL, src]) => {
      let fig;
      new Function('HL', 'hairline', src)(HL, (f) => { fig = f; });
      return { HL, fig };
    });
    p.catch(() => figP.delete(slug));
    figP.set(slug, p);
  }
  return figP.get(slug);
}

/* ── The tour: an unseen pointer walks the figure's stops (as in the gallery) ── */
const TRAVEL = 650, DWELL = 900, GAP = 700;
const ease = (t) => 1 - Math.pow(1 - t, 3);

function emit(stage, type, [x, y]) {
  const r = stage.getBoundingClientRect();
  stage.dispatchEvent(new PointerEvent(type, {
    pointerType: 'mouse', pointerId: 1, bubbles: false,
    clientX: r.left + (x / 400) * r.width, clientY: r.top + (y / 320) * r.height,
  }));
}

function driver(HL, stage, stops) {
  let raf = 0, from = null, i = 0, t0 = 0, phase = 'travel';
  const step = (now) => {
    const stop = stops[i];
    if (phase === 'travel') {
      if (stop === null) { from = null; emit(stage, 'pointerleave', [200, 160]); phase = 'wait'; t0 = now; }
      else {
        const k = from ? ease(Math.min(1, (now - t0) / TRAVEL)) : 1, a = from ?? stop;
        emit(stage, 'pointermove', [a[0] + (stop[0] - a[0]) * k, a[1] + (stop[1] - a[1]) * k]);
        if (k >= 1) { from = stop; phase = 'wait'; t0 = now; }
      }
    } else if (now - t0 >= (stop === null ? GAP : DWELL)) { i = (i + 1) % stops.length; phase = 'travel'; t0 = now; }
    raf = requestAnimationFrame(step);
  };
  return {
    start() { if (raf || HL.reducedMotion()) return; i = 0; from = null; phase = 'travel'; t0 = performance.now(); raf = requestAnimationFrame(step); },
    stop() { if (!raf) return; cancelAnimationFrame(raf); raf = 0; from = null; emit(stage, 'pointerleave', [200, 160]); },
  };
}

/* The card a figure sits in: hovering anywhere on it plays the figure's tour. */
const CARD_SELECTOR = '.nav-card, .illo-card-wrap, [role="button"], [role="link"], a';

/**
 * One hairline figure, filling its box at 5:4. Hovering the card it sits in
 * (the nearest `hoverRoot`, default: CARD_SELECTOR) plays its tour.
 */
export function HairlineFigure({ slug, hoverRoot }) {
  const ref = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const stage = ref.current;
    if (!stage || !slug) return;
    let alive = true, cleanup = () => {};
    loadFigure(slug).then(({ HL, fig }) => {
      if (!alive) return;
      stage.replaceChildren();
      stage.setAttribute('data-hairline', fig.name);
      const svg = HL.mk('svg', { viewBox: '0 0 400 320', 'aria-hidden': 'true' }, stage);
      const handle = fig.mount({ stage, svg, read: { textContent: '' } }, fig.range[1]);
      const drive = driver(HL, stage, fig.tour ?? HL.LAP);
      const host = stage.closest(hoverRoot || CARD_SELECTOR) || stage.parentElement?.parentElement;
      const on = (e) => { if (e.pointerType === 'mouse') drive.start(); };
      const off = (e) => { if (e.pointerType === 'mouse') drive.stop(); };
      host?.addEventListener('pointerenter', on);
      host?.addEventListener('pointerleave', off);
      cleanup = () => {
        host?.removeEventListener('pointerenter', on);
        host?.removeEventListener('pointerleave', off);
        drive.stop();
        handle?.destroy?.();
        stage.replaceChildren();
      };
    }).catch((err) => { console.error(err); if (alive) setFailed(true); });
    return () => { alive = false; cleanup(); };
  }, [slug, hoverRoot]);

  if (failed) return <div className="hl-fig hl-fig--failed" aria-hidden="true" />;
  return <div className="hl-fig" aria-hidden="true"><div ref={ref} className="hl-stage" /></div>;
}

/* ── Colour and theme options, as in Thiago's gallery ───────────────────── */
export const HAIRLINE_COLOURS = [
  { id: 'blueprint', label: 'Blueprint',       swatch: '#1988CF' },
  { id: 'mono',      label: 'Black and white', swatch: 'linear-gradient(135deg, #1B1C1F 50%, #E5E5E5 50%)' },
  { id: 'red',       label: 'TomTom red',      swatch: '#DF1B12' },
];
export const HAIRLINE_THEMES = [
  { id: 'auto',  label: 'Auto',  desc: 'Follows the site’s day / night mode' },
  { id: 'light', label: 'Light', desc: 'White ground' },
  { id: 'dark',  label: 'Dark',  desc: 'Near-black ground' },
];
