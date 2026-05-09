import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import { useIlloStyle } from '../context/IlloStyleContext';
import { makeThumb, L_Geocode, L_ReverseGeocode } from '../illustrations/lightVariants';
import { IlloGeocode, IlloReverseGeocode } from './IntroIllustrations';

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
const HeroIllo = makeThumb(IlloGeocode, L_Geocode);

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function GeocodingAPIIntro({ onNavigate }) {
  const { palette } = useIlloStyle();

  const endpoints = [
    {
      Illo: makeThumb(IlloGeocode, L_Geocode),
      title: 'Geocode',
      method: 'GET',
      path: '/search/2/geocode/{query}.json',
      desc: 'Convert a human-readable address string into precise geographic coordinates (latitude/longitude).',
    },
    {
      Illo: makeThumb(IlloReverseGeocode, L_ReverseGeocode),
      title: 'Reverse Geocode',
      method: 'GET',
      path: '/search/2/reverseGeocode/{position}.json',
      desc: 'Convert a lat/lon coordinate into a structured address, street name, or place name.',
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
          GET https://api.tomtom.com/search/2/geocode/{'{'}query{'}'}.json?key={'{'}your-api-key{'}'}
        </div>
      </div>

      <Callout type="info" title="Authentication">
        All requests require a valid API key passed as <code>key={'{'}your-api-key{'}'}</code> in the query string.
        You can obtain a key from the <a href="https://developer.tomtom.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--red)' }}>TomTom Developer Portal</a>.
      </Callout>
    </div>
  );
}
