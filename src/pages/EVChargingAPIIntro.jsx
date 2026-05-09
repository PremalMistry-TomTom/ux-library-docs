import PageActions from '../components/ui/PageActions';
import { useIlloStyle } from '../context/IlloStyleContext';
import {
  makeThumb,
  L_EVSearchNearby, L_EVChargingAvailability, L_EVMarketCoverage,
} from '../illustrations/lightVariants';
import {
  IlloEVSearchNearby, IlloEVChargingAvailability,
} from './IntroIllustrations';

/* ─── Hero ───────────────────────────────────────────────────────────────────── */
const HeroIllo = makeThumb(IlloEVSearchNearby, L_EVSearchNearby);

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function EVChargingAPIIntro({ onNavigate }) {
  const { theme: illoTheme, palette: illoPalette } = useIlloStyle();

  const endpoints = [
    {
      Thumb: makeThumb(IlloEVSearchNearby, L_EVSearchNearby),
      method: 'GET',
      title: 'EV Station Search',
      desc: 'Search for charging stations near a coordinate using category set 7309, with connector type and operator filters.',
      pageId: 'ev-charging-api-intro',
      tag: 'v2',
    },
    {
      Thumb: makeThumb(IlloEVChargingAvailability, L_EVChargingAvailability),
      method: 'GET',
      title: 'Charging Availability',
      desc: 'Query real-time connector availability at a charging station — number of occupied and free slots per connector type.',
      pageId: 'ev-charging-api-intro',
      tag: 'v2',
    },
    {
      Thumb: makeThumb(null, L_EVMarketCoverage),
      method: 'GET',
      title: 'Supported Markets',
      desc: 'Return the list of countries and regions where TomTom EV charging availability data is provided.',
      pageId: 'ev-charging-api-intro',
      tag: 'v2',
    },
    {
      Thumb: makeThumb(IlloEVChargingAvailability, L_EVChargingAvailability),
      method: 'GET',
      title: 'Charging Park Details',
      desc: 'Retrieve enriched details for a charging park including operator, amenities, opening hours, and pricing information.',
      pageId: 'ev-charging-api-intro',
      tag: 'v2',
    },
    {
      Thumb: makeThumb(IlloEVSearchNearby, L_EVSearchNearby),
      method: 'GET',
      title: 'Along-Route Charging',
      desc: 'Find charging stations along a route corridor, ranked by deviation from the original path and compatible connectors.',
      pageId: 'ev-charging-api-intro',
      tag: 'v2',
    },
    {
      Thumb: makeThumb(null, L_EVMarketCoverage),
      method: 'GET',
      title: 'Connector Categories',
      desc: 'List supported EV connector type categories — CCS, CHAdeMO, Type 2, and more — for filtering search results.',
      pageId: 'ev-charging-api-intro',
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

      {/* Hero illustration */}
      <div style={{ borderRadius: 20, overflow: 'hidden', height: 200, background: illoPalette.bg, marginBottom: 32 }}>
        <HeroIllo />
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
                  <span style={{ fontSize: '0.625rem', fontWeight: 700, padding: '2px 6px', borderRadius: 3, background: 'rgba(63,185,80,0.12)', color: '#3fb950', fontFamily: 'monospace', letterSpacing: '0.04em' }}>{method}</span>
                  {tag && <span style={{ fontSize: '0.625rem', padding: '1px 5px', borderRadius: 3, background: 'rgba(34,197,94,0.08)', color: '#22c55e', fontWeight: 600 }}>{tag}</span>}
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
