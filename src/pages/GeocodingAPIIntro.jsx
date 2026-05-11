import PageActions from '../components/ui/PageActions';
import { useIlloStyle } from '../context/IlloStyleContext';
import { makeThumb, L_Geocode, L_ReverseGeocode } from '../illustrations/lightVariants';
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
import { IlloGeocode, IlloReverseGeocode } from './IntroIllustrations';

/* ─── Hero ───────────────────────────────────────────────────────────────────── */
const HeroIllo = makeThumb(IlloGeocode, L_Geocode, IcoGeocode);

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function GeocodingAPIIntro({ onNavigate }) {
  const { theme: illoTheme, palette: illoPalette } = useIlloStyle();

  const endpoints = [
    {
      Thumb: makeThumb(IlloGeocode, L_Geocode, IcoGeocode),
      method: 'GET',
      title: 'Geocode',
      desc: 'Convert a human-readable address string into precise geographic coordinates (latitude/longitude).',
      pageId: 'geocode',
      tag: 'v2',
    },
    {
      Thumb: makeThumb(IlloReverseGeocode, L_ReverseGeocode, IcoReverseGeocode),
      method: 'GET',
      title: 'Reverse Geocode',
      desc: 'Convert a lat/lon coordinate into a structured address, street name, or place name.',
      pageId: 'reverse-geocode',
      tag: 'v2',
    },
    {
      Thumb: makeThumb(IlloGeocode, L_Geocode, IcoGeocode),
      method: 'GET',
      title: 'Structured Geocode',
      desc: 'Geocode addresses already split into discrete fields — street number, city, postal code — for higher precision.',
      pageId: 'geocode',
      tag: 'v2',
    },
    {
      Thumb: makeThumb(IlloReverseGeocode, L_ReverseGeocode, IcoReverseGeocode),
      method: 'GET',
      title: 'Cross Street Lookup',
      desc: 'Resolve a coordinate to the nearest road intersection or cross-street name for turn-by-turn context.',
      pageId: 'reverse-geocode',
      tag: 'v2',
    },
  ];

  const baseUrlRows = [
    {
      label: 'Base URL',
      content: <code style={{ fontSize: '0.875rem', fontFamily: 'monospace', color: 'var(--black)' }}>https://api.tomtom.com/search/2/</code>,
    },
    {
      label: 'Auth',
      content: <span style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>API key via <code>?key={'{'}<em>your-api-key</em>{'}'}</code> query parameter</span>,
    },
    {
      label: 'Version',
      content: <span style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>Service version <strong>2</strong> — stable, globally available</span>,
    },
    {
      label: 'Formats',
      content: <span style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>JSON (default), XML — specified as file extension in the path</span>,
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Geocoding API</h1>
        <PageActions />
      </div>

      <p className="quick-answer">
        The TomTom Geocoding API translates between human-readable addresses and geographic coordinates.
        Use the geocode endpoint to place address markers on a map, and the reverse geocode endpoint
        to label GPS positions with readable street addresses.
      </p>

      {/* Hero illustration */}
      <div style={{ borderRadius: 20, overflow: 'hidden', height: 200, background: illoPalette.bg, marginBottom: 32 }}>
        <HeroIllo />
      </div>

      {/* Endpoint grid */}
      <div className="zone">
        <h2 className="sh" id="endpoints">Endpoints</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--mid)', margin: '0 0 20px', lineHeight: 1.6 }}>
          Geocoding endpoints share the Search API base path at <code>/search/2/</code>.
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
          Convert an address to coordinates with a single request:
        </p>
        <pre style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', fontSize: '0.8125rem', lineHeight: 1.7, overflowX: 'auto', color: 'var(--black)' }}>{`const API_KEY = 'your-api-key';

// Forward geocoding — address → coordinates
const geocodeRes = await fetch(
  \`https://api.tomtom.com/search/2/geocode/\${
    encodeURIComponent('De Ruyterkade 154, Amsterdam')
  }.json?key=\${API_KEY}\`
);
const { results: [first] } = await geocodeRes.json();
const { lat, lon } = first.position;   // 52.3800, 4.9003

// Reverse geocoding — coordinates → address
const reverseRes = await fetch(
  \`https://api.tomtom.com/search/2/reverseGeocode/\${lat},\${lon}.json?key=\${API_KEY}\`
);
const { addresses: [addr] } = await reverseRes.json();
console.log(addr.address.freeformAddress);
// → "De Ruyterkade 154, 1011 AC Amsterdam, Netherlands"`}</pre>
      </div>
    </div>
  );
}
