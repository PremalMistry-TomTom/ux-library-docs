import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import { useIlloStyle } from '../context/IlloStyleContext';
import {
  makeThumb,
  L_EVSearchNearby, L_EVChargingAvailability, L_EVMarketCoverage,
} from '../illustrations/lightVariants';
import {
  IlloEVSearchNearby, IlloEVChargingAvailability,
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
        {desc && <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.55 }}>{desc}</p>}
      </div>
    </div>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────────────────── */
const HeroIllo = makeThumb(IlloEVSearchNearby, L_EVSearchNearby);

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function EVChargingAPIIntro({ onNavigate }) {
  const { palette } = useIlloStyle();

  const endpoints = [
    {
      Illo: makeThumb(IlloEVSearchNearby, L_EVSearchNearby),
      title: 'EV Search Nearby',
      method: 'GET',
      path: '/search/2/nearbySearch/.json?categorySet=7309',
      desc: 'Search for EV charging stations near a coordinate, filtered by connector type and operator.',
    },
    {
      Illo: makeThumb(IlloEVChargingAvailability, L_EVChargingAvailability),
      title: 'Charging Availability',
      method: 'GET',
      path: '/search/2/chargingAvailability.json',
      desc: 'Query real-time connector availability at a specific charging station, including occupied and free slots.',
    },
    {
      Illo: makeThumb(null, L_EVMarketCoverage),
      title: 'Market Coverage',
      method: 'GET',
      path: '/search/2/evSupportedMarkets.json',
      desc: 'Return the list of countries and regions where TomTom EV charging data is available.',
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
          GET https://api.tomtom.com/search/2/chargingAvailability.json?key={'{'}your-api-key{'}'}
        </div>
      </div>

      <Callout type="info" title="Authentication">
        All requests require a valid API key passed as <code>key={'{'}your-api-key{'}'}</code> in the query string.
        You can obtain a key from the <a href="https://developer.tomtom.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--red)' }}>TomTom Developer Portal</a>.
      </Callout>
    </div>
  );
}
