import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import { useIlloStyle } from '../context/IlloStyleContext';
import {
  makeThumb,
  L_ParkingAvailability, L_ParkingPrices, L_OnStreetParking, L_FuelPrices,
} from '../illustrations/lightVariants';
import {
  IlloParkingAvailability, IlloParkingPrices, IlloOnStreetParking, IlloFuelPrices,
} from './IntroIllustrations';

/* ─── Shared helpers ─────────────────────────────────────────────────────────── */
function MethodBadge({ method }) {
  const colors = { GET: '#3fb950', POST: '#58a6ff', DELETE: '#f85149' };
  return (
    <span style={{ fontSize: '0.625rem', fontWeight: 700, padding: '2px 6px', borderRadius: 3, background: `${colors[method]}22`, color: colors[method], fontFamily: 'var(--font-mono, monospace)', letterSpacing: '0.04em' }}>
      {method}
    </span>
  );
}

function EndpointCard({ Illo, title, method = 'GET', path, desc }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', background: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 140, flexShrink: 0, overflow: 'hidden' }}>
        <Illo />
      </div>
      <div style={{ padding: '10px 14px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <MethodBadge method={method} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)' }}>{title}</span>
        </div>
        {path && <code style={{ fontSize: '0.5625rem', color: 'var(--muted)', fontFamily: 'var(--font-mono, monospace)', wordBreak: 'break-all' }}>{path}</code>}
        {desc && <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.55 }}>{desc}</p>}
      </div>
    </div>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────────────────── */
const HeroIllo = makeThumb(IlloParkingAvailability, L_ParkingAvailability);

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function ParkingFuelAPIIntro({ onNavigate }) {
  const { palette } = useIlloStyle();

  const endpoints = [
    {
      Illo: makeThumb(IlloParkingAvailability, L_ParkingAvailability),
      title: 'Parking Availability',
      method: 'GET',
      path: '/parking/2/parkingAvailability/{id}.json',
      desc: 'Retrieve real-time available spot counts, capacity, and trend data for off-street car parks.',
    },
    {
      Illo: makeThumb(IlloParkingPrices, L_ParkingPrices),
      title: 'Parking Prices',
      method: 'GET',
      path: '/parking/2/parkingDetails/{id}.json',
      desc: 'Get estimated parking costs, hourly rate breakdowns, and accepted payment methods for a facility.',
    },
    {
      Illo: makeThumb(IlloOnStreetParking, L_OnStreetParking),
      title: 'On-Street Parking',
      method: 'GET',
      path: '/parking/2/onStreetParking.json',
      desc: 'Query real-time on-street parking availability near a location, including restrictions and time limits.',
    },
    {
      Illo: makeThumb(IlloFuelPrices, L_FuelPrices),
      title: 'Fuel Prices',
      method: 'GET',
      path: '/search/2/poiSearch/fuel.json',
      desc: 'Fetch current fuel prices by fuel type at petrol stations near a given location.',
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Parking &amp; Fuel API</h1>
        <PageActions />
      </div>

      <p className="quick-answer">
        The TomTom Parking &amp; Fuel API delivers real-time data on off-street parking availability and
        pricing, on-street restrictions, and fuel prices at nearby stations. It helps drivers make
        informed decisions about where to park or refuel before reaching their destination.
      </p>

      {/* Hero illustration */}
      <div style={{ borderRadius: 20, overflow: 'hidden', height: 200, background: palette.bg, marginBottom: 32 }}>
        <HeroIllo />
      </div>

      {/* Endpoint grid */}
      <div className="zone">
        <h2 className="sh" id="endpoints">Endpoints</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {endpoints.map(ep => (
            <EndpointCard key={ep.title} {...ep} />
          ))}
        </div>
      </div>

      {/* Base URL */}
      <div className="zone">
        <h2 className="sh" id="base-url">Base URL</h2>
        <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, color: 'var(--black)' }}>
          GET https://api.tomtom.com/parking/2/parkingAvailability/{'{'}id{'}'}.json?key={'{'}your-api-key{'}'}
        </div>
      </div>

      <Callout type="info" title="Authentication">
        All requests require a valid API key passed as <code>key={'{'}your-api-key{'}'}</code> in the query string.
        You can obtain a key from the <a href="https://developer.tomtom.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--red)' }}>TomTom Developer Portal</a>.
      </Callout>
    </div>
  );
}
