import PageActions from '../components/ui/PageActions';
import { useIlloStyle } from '../context/IlloStyleContext';
import {
  makeThumb,
  L_MapRasterTile, L_MapVectorTile, L_MapSatelliteTile, L_MapAssetsAPI, L_MapStaticImage,
} from '../illustrations/lightVariants';
import {
  IcoADAS, IcoAIConfig, IcoAIVoice, IcoAreaAnalytics, IcoBatchRouting,
  IcoCalculateRoute, IcoCluster, IcoETAPanel, IcoEV, IcoEVBattery,
  IcoEVChargingAvailability, IcoEVNavUI, IcoEVRequirements, IcoEVRouting, IcoEVSearchNearby,
  IcoFuelPrices, IcoGeocode, IcoHUD, IcoHomeScreen, IcoHorizonPanel,
  IcoInstructionPanel, IcoIntentRouting, IcoJunctionAnalytics, IcoMapDisplay,
  IcoMapRasterTile, IcoMapSatelliteTile, IcoMapStaticImage, IcoMapVectorTile, IcoMatrixRouting,
  IcoNavControls, IcoNavGuidance, IcoNavSDKAdvanced, IcoNavSDKLocation, IcoNavSDKNavigation,
  IcoNavSDKOffline, IcoNavSDKRouting, IcoNavSDKSearch, IcoNavSDKVirtualHorizon,
  IcoODAnalysis, IcoOnStreetParking, IcoPOIDetails, IcoPOIPhotos, IcoParkingAvailability,
  IcoParkingPrices, IcoReachableRange, IcoReverseGeocode, IcoRouteBar, IcoRoutingWeather,
  IcoSearchAlongRoute, IcoSearchAutocomplete, IcoSearchFuzzy, IcoSearchNearby, IcoSearchPOI,
  IcoSnapToRoads, IcoSpeechToText, IcoTrafficFlow, IcoTrafficFlowTile, IcoTrafficIncidents,
  IcoTrafficModelID, IcoTrafficStats, IcoTruck, IcoTurnInstructions, IcoVIBasics,
  IcoVoiceEngine, IcoWaypointOpt,
} from '../illustrations/iconVariants';
import {
  IlloMapRasterTile, IlloMapVectorTile, IlloMapSatelliteTile, IlloMapStaticImage,
} from './IntroIllustrations';

/* ─── Hero ───────────────────────────────────────────────────────────────────── */
const HeroIllo = makeThumb(IlloMapVectorTile, L_MapVectorTile, IcoMapVectorTile);

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function MapDisplayAPIIntro({ onNavigate }) {
  const { theme: illoTheme, palette: illoPalette } = useIlloStyle();

  const endpoints = [
    {
      Thumb: makeThumb(IlloMapRasterTile, L_MapRasterTile, IcoMapRasterTile),
      method: 'GET',
      title: 'Raster Map Tile',
      desc: 'PNG map tiles at 256 or 512 px across 23 zoom levels — for standard slippy-map integrations.',
      pageId: 'map-raster-tile',
      tag: 'v1',
    },
    {
      Thumb: makeThumb(IlloMapVectorTile, L_MapVectorTile, IcoMapVectorTile),
      method: 'GET',
      title: 'Vector Tile',
      desc: 'Protobuf (MVT) vector tiles at 23 zoom levels for client-side styled, resolution-independent rendering.',
      pageId: 'map-vector-tile',
      tag: 'v2',
    },
    {
      Thumb: makeThumb(IlloMapSatelliteTile, L_MapSatelliteTile, IcoMapSatelliteTile),
      method: 'GET',
      title: 'Satellite Tile',
      desc: 'Aerial/satellite imagery tiles in JPG at 256 × 256 px across 20 zoom levels.',
      pageId: 'map-satellite-tile',
      tag: 'v1',
    },
    {
      Thumb: makeThumb(IlloMapRasterTile, L_MapRasterTile, IcoMapRasterTile),
      method: 'GET',
      title: 'Hillshade Tile',
      desc: 'Terrain hillshade imagery at 514 × 514 px across 14 zoom levels for topographic context.',
      pageId: 'map-display-api-intro',
      tag: 'v1',
    },
    {
      Thumb: makeThumb(null, L_MapAssetsAPI, IcoMapDisplay),
      method: 'GET',
      title: 'Map Styles',
      desc: 'Fetch style JSON, sprite sheets, and glyph fonts needed to render vector tiles client-side.',
      pageId: 'map-display-api-intro',
      tag: 'v2',
    },
    {
      Thumb: makeThumb(IlloMapStaticImage, L_MapStaticImage, IcoMapStaticImage),
      method: 'GET',
      title: 'Static Image',
      desc: 'Generate a single static map image at a defined bounding box, zoom, and pixel dimensions for reports or previews.',
      pageId: 'map-static-image',
      tag: 'v1',
    },
    {
      Thumb: makeThumb(IlloMapVectorTile, L_MapVectorTile, IcoMapVectorTile),
      method: 'GET',
      title: 'WMS / WMTS',
      desc: 'OGC-compliant Web Map Service and Web Map Tile Service endpoints for GIS and enterprise integrations.',
      pageId: 'map-display-api-intro',
      tag: 'v1',
    },
    {
      Thumb: makeThumb(IlloMapVectorTile, L_MapVectorTile, IcoMapVectorTile),
      method: 'GET',
      title: 'Vector Content',
      desc: 'Map feature collections for advanced client-side processing and custom cartographic workflows.',
      pageId: 'map-display-api-intro',
      tag: 'v2',
    },
  ];

  const baseUrlRows = [
    {
      label: 'Base URL',
      content: <code style={{ fontSize: '0.875rem', fontFamily: 'monospace', color: 'var(--black)' }}>https://api.tomtom.com/map/1/</code>,
    },
    {
      label: 'Auth',
      content: <span style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>API key via <code>?key={'{'}<em>your-api-key</em>{'}'}</code> query parameter</span>,
    },
    {
      label: 'Version',
      content: <span style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>Service version <strong>1</strong> for raster/static; vector tiles also available as <strong>v2</strong></span>,
    },
    {
      label: 'Tile grid',
      content: <span style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>Spherical Mercator (<strong>EPSG:3857</strong>) · zoom 0–22 · 256 or 512 px tiles</span>,
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Map Display API</h1>
        <PageActions />
      </div>

      <p className="quick-answer">
        The TomTom Map Display API provides raster and vector map tiles, satellite imagery, and static
        map images for embedding TomTom maps in web, mobile, and server-rendered applications.
        Choose raster tiles for simplicity or vector tiles for full style customisation.
      </p>

      {/* Hero illustration */}
      <div style={{ borderRadius: 20, overflow: 'hidden', height: 200, background: illoPalette.bg, marginBottom: 32 }}>
        <HeroIllo />
      </div>

      {/* Endpoint grid */}
      <div className="zone">
        <h2 className="sh" id="endpoints">Endpoints</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--mid)', margin: '0 0 20px', lineHeight: 1.6 }}>
          Raster tiles follow the path <code>/map/1/tile/{'{'}layer{'}'}/{'{'}style{'}'}/{'{'}zoom{'}'}/{'{'}x{'}'}/{'{'}y{'}'}.png</code>; vector tiles use <code>.pbf</code>.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
          {endpoints.map(({ Thumb, method, title, desc, pageId, tag }) => (
            <div
              key={title}
              className="nav-card"
              onClick={() => onNavigate?.(pageId)}
            >
              <div className="nav-card-thumb" style={illoTheme !== 'dark' ? { background: illoPalette.bg, padding: 0 } : undefined}>
                <Thumb />
              </div>
              <div className="nav-card-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <span className={`http-tag http-tag-${method.toLowerCase()}`}>{method}</span>
                  {tag && <span className="meta-tag">{tag}</span>}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--black)', marginBottom: 3 }}>{title}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.5 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Base URL table */}
      <div className="zone">
        <h2 className="sh" id="base-url">Base URL &amp; Authentication</h2>
        <div style={{ border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
          {baseUrlRows.map(({ label, content }, i) => (
            <div key={label} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', borderBottom: i < baseUrlRows.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ padding: '10px 14px', background: 'var(--bg)', borderRight: '1px solid var(--border)', fontSize: '0.625rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center' }}>{label}</div>
              <div style={{ padding: '10px 14px' }}>{content}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Getting started */}
      <div className="zone">
        <h2 className="sh" id="getting-started">Getting started</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--mid)', marginBottom: 16, lineHeight: 1.6 }}>
          Assemble a tile URL and display it in a Leaflet or Mapbox GL map:
        </p>
        <pre style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', fontSize: '0.8125rem', lineHeight: 1.7, overflowX: 'auto', color: 'var(--black)' }}>{`const API_KEY = 'your-api-key';

// Raster tile URL template — plug into Leaflet L.tileLayer()
const rasterTemplate =
  \`https://api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.png?key=\${API_KEY}\`;

// Vector tile style URL — plug into maplibre-gl / Mapbox GL JS
const vectorStyleUrl =
  \`https://api.tomtom.com/maps-sdk-for-web/6.x/6.25.0/maps/sdk.min.css\`;

// Static image — render a 800×400 px map centred on Amsterdam
const staticImageUrl =
  \`https://api.tomtom.com/map/1/staticimage\` +
  \`?key=\${API_KEY}&zoom=12&center=4.9041,52.3676&format=png&width=800&height=400\`;`}</pre>
      </div>
    </div>
  );
}
