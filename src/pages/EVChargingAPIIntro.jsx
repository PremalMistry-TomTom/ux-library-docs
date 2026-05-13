import PageActions from '../components/ui/PageActions';
import { useIlloStyle } from '../context/IlloStyleContext';
import {
  makeThumb,
  L_EVSearchNearby, L_EVChargingAvailability, L_EVMarketCoverage,
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
  IlloEVSearchNearby, IlloEVChargingAvailability,
} from './IntroIllustrations';

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function EVChargingAPIIntro({ onNavigate }) {
  const { theme: illoTheme, palette: illoPalette } = useIlloStyle();

  const endpoints = [
    {
      Thumb: makeThumb(IlloEVSearchNearby, L_EVSearchNearby, IcoEVSearchNearby),
      method: 'GET',
      title: 'EV Station Search',
      desc: 'Search for charging stations near a coordinate using category set 7309 (v1) or the Orbis EV nearby endpoint (v3).',
      pageId: 'ev-station-search',
      tag: 'v1/v3',
    },
    {
      Thumb: makeThumb(IlloEVChargingAvailability, L_EVChargingAvailability, IcoEVChargingAvailability),
      method: 'GET',
      title: 'Charging Availability',
      desc: 'Query real-time connector availability at a charging station — number of occupied and free slots per connector type.',
      pageId: 'ev-charging-availability',
      tag: 'v1/v3',
    },
    {
      Thumb: makeThumb(null, L_EVMarketCoverage, IcoAreaAnalytics),
      method: 'GET',
      title: 'Supported Markets',
      desc: 'Return the list of countries and regions where TomTom EV charging availability data is provided.',
      pageId: 'ev-supported-markets',
      tag: 'v1',
    },
    {
      Thumb: makeThumb(IlloEVChargingAvailability, L_EVChargingAvailability, IcoEVChargingAvailability),
      method: 'GET',
      title: 'EV Search by ID',
      desc: 'Retrieve enriched details for one or more EV POIs by UUID, including connectors, opening hours, and tariff pricing.',
      pageId: 'ev-search-by-id',
      tag: 'v1/v3',
    },
    {
      Thumb: makeThumb(IlloEVSearchNearby, L_EVSearchNearby, IcoEVSearchNearby),
      method: 'POST',
      title: 'Along-Route Charging',
      desc: 'Find charging stations along a route corridor, ranked by deviation from the original path and compatible connectors.',
      pageId: 'ev-search-along-route',
      tag: 'v1/v3',
    },
    {
      Thumb: makeThumb(null, L_EVMarketCoverage, IcoAreaAnalytics),
      method: 'GET',
      title: 'EV Search Nearby',
      desc: 'Discover EV charging stations within a circular area or bounding box with rich filter support for connector type and power level.',
      pageId: 'ev-search-nearby',
      tag: 'v1/v3',
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
      content: <span style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>Built on Search API service version <strong>2</strong></span>,
    },
    {
      label: 'Coverage',
      content: <span style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>Real-time availability in Europe and North America; static data globally</span>,
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>EV &amp; Charging API</h1>
        <PageActions />
      </div>

      <p className="quick-answer">
        The TomTom EV &amp; Charging API provides everything needed to build EV-ready applications:
        find nearby charging stations, check real-time connector availability, and verify market coverage.
        It integrates with the Search API infrastructure for consistent, high-quality data.
      </p>

      {/* Quickstart CTA */}
      <div className="zone" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button
          onClick={() => onNavigate?.('ev-quickstart', 'ev-charging-api')}
          style={{ background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 20, padding: '10px 20px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
        >
          Quickstart →
        </button>
        <button
          onClick={() => onNavigate?.('ev-station-search', 'ev-charging-api')}
          style={{ background: 'var(--bg)', color: 'var(--black)', border: '1px solid var(--border)', borderRadius: 20, padding: '10px 20px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
        >
          API Reference
        </button>
      </div>

      {/* Endpoint grid */}
      <div className="zone">
        <h2 className="sh" id="endpoints">Endpoints</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--mid)', margin: '0 0 20px', lineHeight: 1.6 }}>
          EV charging endpoints extend the Search API at <code>/search/2/</code> with EV-specific category and availability parameters.
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
            { id: 'ev-guide-discovery', title: 'Station Discovery Patterns', desc: 'Find EV charging stations near a coordinate, along a route, and within a custom geometry using category set 7309.' },
            { id: 'ev-guide-connectors', title: 'Connector Type Filtering', desc: 'Filter stations by connector type (CCS, CHAdeMO, Type 2, etc.) using the connectorSet parameter.' },
            { id: 'ev-guide-jmespath', title: 'JMESPath Response Filtering', desc: 'Use JMESPath expressions in V2 to extract only the fields you need from the search response (Orbis Maps only).' },
          ].map(({ id, title, desc }) => (
            <button key={id} onClick={() => onNavigate?.(id, 'ev-charging-api')}
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
                <th style={{ padding: '10px 14px', textAlign: 'left', width: '40%', color: 'var(--muted)', fontWeight: 600, fontSize: '0.75rem' }}>Feature</th>
                {[
                  { label: 'V1', platform: 'TomTom Maps', status: 'Production',       statusBg: 'rgba(34,197,94,0.1)',   statusColor: '#15803d', color: '#15803d' },
                  { label: 'V3', platform: 'Orbis Maps',  status: 'Private Preview',  statusBg: 'rgba(251,146,60,0.1)', statusColor: '#c2410c', color: '#c2410c' },
                ].map(v => (
                  <th key={v.label} style={{ padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid var(--border)', width: '30%' }}>
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
                ['EV Station Search',         '✓', '✓'],
                ['EV Search Nearby',          '✓', '✓'],
                ['EV Search Along Route',     '✓', '✓'],
                ['EV Search by ID',           '✓', '✓'],
                ['Charging Availability',     '✓', '✓'],
                ['Connector type filtering',  '✓', '✓'],
                ['Power range filtering',     '✓', '✓'],
                ['JMESPath response filtering','—', '✓'],
                ['Market coverage endpoint',  '✓', '—'],
              ].map(([feat, v1, v3], i) => (
                <tr key={feat} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'var(--bg)' }}>
                  <td style={{ padding: '9px 14px', color: 'var(--black)', fontWeight: 500 }}>{feat}</td>
                  {[v1, v3].map((val, j) => (
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

      {/* Getting started */}
      <div className="zone">
        <h2 className="sh" id="getting-started">Getting started</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--mid)', marginBottom: 16, lineHeight: 1.6 }}>
          Find nearby CCS-compatible charging stations and check real-time availability:
        </p>
        <pre style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', fontSize: '0.8125rem', lineHeight: 1.7, overflowX: 'auto', color: 'var(--black)' }}>{`const API_KEY = 'your-api-key';
const lat = 52.3731, lon = 4.8922;

// Step 1 — Find nearby EV stations (category 7309 = EV charging station)
const searchRes = await fetch(
  \`https://api.tomtom.com/search/2/nearbySearch/.json\` +
  \`?key=\${API_KEY}&lat=\${lat}&lon=\${lon}&radius=2000&categorySet=7309&limit=10\`
);
const { results } = await searchRes.json();

// Step 2 — Check real-time availability at the first result
const stationId = results[0]?.dataSources?.chargingAvailability?.id;
if (stationId) {
  const availRes = await fetch(
    \`https://api.tomtom.com/search/2/chargingAvailability.json\` +
    \`?key=\${API_KEY}&chargingAvailability=\${stationId}\`
  );
  const { connectors } = (await availRes.json()).chargingAvailability;
  connectors.forEach(c => {
    console.log(c.type.id, '—', c.availability.current.available, 'free');
  });
}`}</pre>
      </div>
    </div>
  );
}
