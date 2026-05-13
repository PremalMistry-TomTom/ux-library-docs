import { lazy, Suspense } from 'react';
import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';

const TryItEmbed = lazy(() => import('../components/demos/TryItEmbed'));

/* ─── Code examples ──────────────────────────────────────────────────────────── */
const CODE_AUTH = `curl "https://api.tomtom.com/search/2/geocode/De%20Ruijterkade%20154%20Amsterdam.json?key=YOUR_API_KEY"`;

const CODE_FIRST_GEOCODE = `# Geocode a freeform address — TomTom HQ, Amsterdam
curl "https://api.tomtom.com/search/2/geocode/\\
De%20Ruijterkade%20154%2C%201011%20AC%2C%20Amsterdam.json\\
?key=YOUR_API_KEY\\
&limit=1"`;

const CODE_RESPONSE = `{
  "summary": {
    "query": "de ruijterkade 154 1011 ac amsterdam",
    "queryType": "NON_NEAR",
    "numResults": 1,
    "totalResults": 1,
    "fuzzyLevel": 1
  },
  "results": [
    {
      "type": "Point Address",
      "id": "NL/PAD/p0/3802262",
      "score": 13.2504415512,
      "matchConfidence": { "score": 1 },
      "address": {
        "streetNumber": "154",
        "streetName": "De Ruijterkade",
        "municipality": "Amsterdam",
        "postalCode": "1011",
        "extendedPostalCode": "1011 AC",
        "countryCode": "NL",
        "country": "Nederland",
        "freeformAddress": "De Ruijterkade 154, 1011 AC Amsterdam"
      },
      "position": { "lat": 52.37727, "lon": 4.90943 },
      "entryPoints": [
        { "type": "main", "position": { "lat": 52.37739, "lon": 4.90944 } }
      ]
    }
  ]
}`;

export default function GeocodingQuickstart({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Quick Start</h1>
        <PageActions pageId="geocoding-quickstart" pageTitle="Geocoding API Quick Start" />
      </div>
      <p className="quick-answer">
        Convert a postal address into latitude/longitude coordinates in a single GET request.
        Authenticate with an API key, pass an address string, and get back a precise position
        with match confidence.
      </p>

      {/* ── 1. Authentication ── */}
      <div className="zone">
        <h2 className="sh" id="authentication">Authentication</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
          All Geocoding API requests require an API key passed as the <code>key</code> query
          parameter. Get one free at the{' '}
          <a href="https://developer.tomtom.com" target="_blank" rel="noreferrer"
            style={{ color: 'var(--brand)' }}>TomTom Developer Portal</a>.
        </p>
        <CodeBlock code={CODE_AUTH} language="bash" />
        <Callout type="info" title="Keep your key secret">
          Never expose your API key in client-side JavaScript. For browser apps, proxy
          requests through your own backend.
        </Callout>
      </div>

      {/* ── 2. Your first geocode ── */}
      <div className="zone">
        <h2 className="sh" id="first-geocode">Your first geocode</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          The example below geocodes TomTom's headquarters address in Amsterdam. Pass the
          address as a URL-encoded string in the path — the API tolerates typos and partial
          addresses.
        </p>

        <Suspense fallback={<div style={{ height: 200, background: 'var(--s1)', borderRadius: 12 }} />}>
          <TryItEmbed demoId="geocode" />
        </Suspense>

        <p style={{ color: 'var(--mid)', fontSize: '0.8125rem', margin: '1rem 0 0.5rem' }}>
          Equivalent cURL request:
        </p>
        <CodeBlock code={CODE_FIRST_GEOCODE} language="bash" />

        <p style={{ color: 'var(--mid)', fontSize: '0.8125rem', margin: '1rem 0 0.5rem' }}>
          Abbreviated response:
        </p>
        <CodeBlock code={CODE_RESPONSE} language="json" />
      </div>

      {/* ── 3. Understanding the response ── */}
      <div className="zone">
        <h2 className="sh" id="response-structure">Understanding the response</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          Every Geocoding response has the same top-level structure:
        </p>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {[
            { key: 'results[]', desc: 'Array of address matches, ordered by relevance score. Index 0 is the best match. Typically returns 1 result for precise addresses.' },
            { key: 'results[0].type', desc: 'Match type: Point Address (exact house number), Street, Municipality, PostalCodeArea, Country, or Geography.' },
            { key: 'results[0].score', desc: 'Relevance score. Higher = closer match. Point Address matches at a known building score higher than Street or Municipality matches.' },
            { key: 'results[0].matchConfidence', desc: 'Confidence score from 0 to 1 for how well the address string matched the result. A score of 1 means exact match.' },
            { key: 'results[0].address', desc: 'Structured address decomposition: streetNumber, streetName, municipality, postalCode, countryCode, country, freeformAddress.' },
            { key: 'results[0].position', desc: 'Primary lat/lon coordinate of the address centroid.' },
            { key: 'results[0].entryPoints[]', desc: 'Routable access points for the address. type: "main" is the primary entry; "minor" entries are additional access points.' },
          ].map(({ key, desc }) => (
            <div key={key} style={{
              display: 'grid', gridTemplateColumns: '220px 1fr', gap: '0.75rem',
              padding: '0.625rem 0.875rem', background: 'var(--s1)',
              border: '1px solid var(--border)', borderRadius: '10px', alignItems: 'start',
            }}>
              <code style={{ fontSize: '0.75rem', color: 'var(--brand)', fontFamily: 'var(--font-mono)' }}>{key}</code>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text)' }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. Version comparison ── */}
      <div className="zone">
        <h2 className="sh" id="version-comparison">Which version should I use?</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          The Geocoding API has two versions on different map data platforms.
        </p>
        <div style={{ display: 'grid', gap: '0.875rem' }}>
          {[
            {
              version: 'v1', label: 'Production', color: '#22c55e',
              platform: 'TomTom Maps', methods: 'GET',
              baseUrl: '/search/2/geocode/{query}.json',
              summary: 'Stable and production-ready. Use for all new integrations today. Supports freeform geocode, structured geocode, reverse geocode, and cross-street lookup.',
            },
            {
              version: 'v2', label: 'Public Preview', color: '#a78bfa',
              platform: 'Orbis Maps', methods: 'GET',
              baseUrl: '/maps/orbis/search/geocode',
              summary: 'Next-generation platform with improved address coverage, enhanced structured geocode, and the Attributes header for selective field responses. Updated match confidence scoring.',
            },
          ].map(v => (
            <div key={v.version} style={{
              padding: '1rem 1.125rem', background: 'var(--bg)',
              border: '1px solid var(--border)', borderRadius: '20px',
              display: 'grid', gridTemplateColumns: '56px 1fr', gap: '0.875rem', alignItems: 'start',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  display: 'inline-block', padding: '2px 8px',
                  background: v.color + '22', border: `1px solid ${v.color}66`,
                  borderRadius: '6px', fontSize: '0.6875rem', fontWeight: 700,
                  color: v.color, marginBottom: '0.25rem',
                }}>{v.version}</div>
                <div style={{ fontSize: '0.625rem', color: 'var(--muted)', lineHeight: 1.2 }}>{v.label}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.25rem' }}>{v.summary}</div>
                <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                    <strong style={{ color: 'var(--mid)' }}>Platform:</strong> {v.platform}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                    <strong style={{ color: 'var(--mid)' }}>Methods:</strong> {v.methods}
                  </span>
                  <code style={{ fontSize: '0.6875rem', color: 'var(--mid)', fontFamily: 'var(--font-mono)' }}>{v.baseUrl}</code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. Next steps ── */}
      <div className="zone">
        <h2 className="sh" id="next-steps">Next steps</h2>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="page-action-btn" onClick={() => onNavigate?.('geocode', 'geocoding-api')}>
            Geocode reference
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('reverse-geocode', 'geocoding-api')}>
            Reverse Geocode
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('structured-geocode', 'geocoding-api')}>
            Structured Geocode
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('geocoding-tomtom-maps', 'geocoding-api')}>
            Geocoding API v1
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('geocoding-orbis-maps', 'geocoding-api')}>
            Geocoding API v2
          </button>
        </div>
      </div>
    </div>
  );
}
