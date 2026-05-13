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
      pageId: 'structured-geocode',
      tag: 'v2',
    },
    {
      Thumb: makeThumb(IlloReverseGeocode, L_ReverseGeocode, IcoReverseGeocode),
      method: 'GET',
      title: 'Cross Street Lookup',
      desc: 'Resolve a coordinate to the nearest road intersection or cross-street name for turn-by-turn context.',
      pageId: 'cross-street-lookup',
      tag: 'v1',
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

      {/* Quickstart CTA */}
      <div className="zone" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button
          onClick={() => onNavigate?.('geocoding-quickstart', 'geocoding-api')}
          style={{ background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 20, padding: '10px 20px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
        >
          Quickstart →
        </button>
        <button
          onClick={() => onNavigate?.('geocode', 'geocoding-api')}
          style={{ background: 'var(--bg)', color: 'var(--black)', border: '1px solid var(--border)', borderRadius: 20, padding: '10px 20px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
        >
          API Reference
        </button>
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

      {/* Guides — before version table */}
      <div className="zone">
        <h2 className="sh" id="guides">Guides</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
          {[
            { id: 'geocoding-guide-accuracy', title: 'Improving Accuracy', desc: 'Use countrySet, geoBias, and entityType filtering to get higher-precision geocode results.' },
            { id: 'geocoding-guide-batch', title: 'Batch Geocoding', desc: 'Process large lists of addresses efficiently using the Batch Search API with geocode queries.' },
            { id: 'geocoding-guide-structured', title: 'Structured vs Free-form', desc: 'When to use Structured Geocode vs free-form geocoding — tradeoffs in precision and flexibility.' },
          ].map(({ id, title, desc }) => (
            <button key={id} onClick={() => onNavigate?.(id, 'geocoding-api')}
              style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 20, padding: '1.25rem', cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--black)', marginBottom: '0.375rem' }}>{title}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--mid)', lineHeight: 1.5 }}>{desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Version comparison table */}
      <div className="zone">
        <h2 className="sh" id="versions">Versions</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '10px 14px', textAlign: 'left', width: '34%', color: 'var(--muted)', fontWeight: 600, fontSize: '0.75rem' }}>Feature</th>
                {[
                  { label: 'V1', platform: 'TomTom Maps',  status: 'Production',   statusBg: 'rgba(34,197,94,0.1)',   statusColor: '#15803d', color: '#15803d' },
                  { label: 'V2', platform: 'Orbis Maps v1', status: 'Production',  statusBg: 'rgba(34,197,94,0.1)',   statusColor: '#15803d', color: '#7c3aed' },
                  { label: 'V3', platform: 'Orbis Maps v2', status: 'Public Preview', statusBg: 'rgba(167,139,250,0.1)', statusColor: '#7c3aed', color: '#c2410c' },
                ].map(v => (
                  <th key={v.label} style={{ padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid var(--border)', width: '22%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: v.color }}>{v.label}</span>
                      <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 4, background: v.statusBg, color: v.statusColor, whiteSpace: 'nowrap' }}>{v.status}</span>
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--muted)', marginTop: 2 }}>{v.platform}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Free-form Geocode',    '✓', '✓', '✓'],
                ['Structured Geocode',   '✓', '✓', '✓'],
                ['Reverse Geocode',      '✓', '✓', '✓'],
                ['Cross-Street Lookup',  '✓', '—', '—'],
                ['Region-specific results','✓', '✓', '✓'],
                ['Extended postal codes','✓', '✓', '✓'],
                ['Entity type filtering','✓', '✓', '✓'],
                ['Copyrights endpoint',  '—', '✓', '✓'],
              ].map(([feat, v1, v2, v3], i) => (
                <tr key={feat} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'var(--bg)' }}>
                  <td style={{ padding: '9px 14px', color: 'var(--black)', fontWeight: 500 }}>{feat}</td>
                  {[v1, v2, v3].map((val, j) => (
                    <td key={j} style={{ padding: '9px 14px', color: val === '✓' ? '#15803d' : 'var(--t-dis)', fontWeight: val === '✓' ? 700 : 400 }}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
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

    </div>
  );
}
