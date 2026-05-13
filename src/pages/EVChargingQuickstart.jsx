import { lazy, Suspense } from 'react';
import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';

const TryItEmbed = lazy(() => import('../components/demos/TryItEmbed'));

/* ─── Code examples ──────────────────────────────────────────────────────────── */
const CODE_AUTH = `curl "https://api.tomtom.com/search/2/categorySearch/electric%20vehicle%20station.json?key=YOUR_API_KEY&lat=52.37939&lon=4.89998&radius=2000"`;

const CODE_FIRST_SEARCH = `# Find EV charging stations near Amsterdam Centraal
curl "https://api.tomtom.com/search/2/categorySearch/\\
electric%20vehicle%20station.json\\
?key=YOUR_API_KEY\\
&lat=52.37939\\
&lon=4.89998\\
&radius=2000\\
&limit=5"`;

const CODE_RESPONSE = `{
  "summary": {
    "query": "electric vehicle station",
    "numResults": 5,
    "totalResults": 23
  },
  "results": [
    {
      "type": "POI",
      "poi": {
        "name": "Fastned Amsterdam Centraal",
        "categorySet": [{ "id": 7309 }],
        "openingHours": { "mode": "nextSevenDays" }
      },
      "address": {
        "freeformAddress": "Prins Hendrikkade 20-21, 1012 TL Amsterdam"
      },
      "position": { "lat": 52.37867, "lon": 4.90268 },
      "dataSources": {
        "chargingAvailability": {
          "id": "00112233-4455-6677-8899-aabbccddeeff"
        }
      }
    }
  ]
}`;

export default function EVChargingQuickstart({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Quick Start</h1>
        <PageActions pageId="ev-quickstart" pageTitle="EV Charging API Quick Start" />
      </div>
      <p className="quick-answer">
        Discover EV charging stations near a location in a single API call. Authenticate with an
        API key, search by category near a coordinate, and get back stations with position,
        opening hours, and a real-time availability ID.
      </p>

      {/* ── 1. Authentication ── */}
      <div className="zone">
        <h2 className="sh" id="authentication">Authentication</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
          All EV Charging API requests require an API key passed as the <code>key</code> query
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

      {/* ── 2. Your first search ── */}
      <div className="zone">
        <h2 className="sh" id="first-search">Your first station search</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          EV station discovery uses the category search endpoint with category{' '}
          <code>electric vehicle station</code>. Provide <code>lat</code>, <code>lon</code>, and{' '}
          <code>radius</code> to search within a circular area. The response includes a{' '}
          <code>chargingAvailability.id</code> for each station — use it to query live connector
          availability in a follow-up call.
        </p>

        <Suspense fallback={<div style={{ height: 200, background: 'var(--s1)', borderRadius: 12 }} />}>
          <TryItEmbed demoId="ev-station-search" />
        </Suspense>

        <p style={{ color: 'var(--mid)', fontSize: '0.8125rem', margin: '1rem 0 0.5rem' }}>
          Equivalent cURL request:
        </p>
        <CodeBlock code={CODE_FIRST_SEARCH} language="bash" />

        <p style={{ color: 'var(--mid)', fontSize: '0.8125rem', margin: '1rem 0 0.5rem' }}>
          Abbreviated response:
        </p>
        <CodeBlock code={CODE_RESPONSE} language="json" />
      </div>

      {/* ── 3. Understanding the response ── */}
      <div className="zone">
        <h2 className="sh" id="response-structure">Understanding the response</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          EV station results use the same structure as Search API results, with one key addition
          in <code>dataSources</code>:
        </p>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {[
            { key: 'results[]', desc: 'Array of EV station POI results ordered by distance from the search point. Index 0 is the closest station.' },
            { key: 'results[0].poi.name', desc: 'Operator or station name (e.g. Fastned, Tesla Supercharger, Allego).' },
            { key: 'results[0].poi\n.categorySet[0].id', desc: 'Category identifier. EV stations always have id 7309. Useful for filtering mixed POI results.' },
            { key: 'results[0].poi\n.openingHours', desc: 'Opening hours object. mode: "nextSevenDays" includes structured times for the coming week. Present only when data is available.' },
            { key: 'results[0].position', desc: 'Station latitude/longitude as { lat, lon }. Use for map marker placement and distance calculations.' },
            { key: 'results[0].dataSources\n.chargingAvailability.id', desc: 'UUID for querying real-time connector availability. Pass to /search/2/chargingAvailability.json to get live available/occupied counts per connector type.' },
          ].map(({ key, desc }) => (
            <div key={key} style={{
              display: 'grid', gridTemplateColumns: '220px 1fr', gap: '0.75rem',
              padding: '0.625rem 0.875rem', background: 'var(--s1)',
              border: '1px solid var(--border)', borderRadius: '10px', alignItems: 'start',
            }}>
              <code style={{ fontSize: '0.75rem', color: 'var(--brand)', fontFamily: 'var(--font-mono)', whiteSpace: 'pre' }}>{key}</code>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text)' }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. Version comparison ── */}
      <div className="zone">
        <h2 className="sh" id="version-comparison">Which version should I use?</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          The EV Charging API has two versions. The Orbis version is currently in Private Preview.
        </p>
        <div style={{ display: 'grid', gap: '0.875rem' }}>
          {[
            {
              version: 'v1', label: 'Production', color: '#22c55e',
              platform: 'TomTom Maps', methods: 'GET',
              baseUrl: '/search/2/categorySearch/electric vehicle station.json',
              summary: 'Stable and production-ready. Category search, connector filtering via connectorSet, power filtering via minPowerKW/maxPowerKW, and real-time availability via chargingAvailability endpoint.',
            },
            {
              version: 'v3', label: 'Private Preview', color: '#fb923c',
              platform: 'Orbis Maps', methods: 'POST',
              baseUrl: '/maps/orbis/search/evStationSearch',
              summary: 'Dedicated EV Station Search endpoint with native connector and power filtering in the request body. Structured opening hours, EV-specific attributes via Attributes header, and improved station data coverage.',
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
          <button className="page-action-btn" onClick={() => onNavigate?.('ev-station-search', 'ev-charging-api')}>
            EV Station Search reference
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('ev-charging-availability', 'ev-charging-api')}>
            Charging Availability
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('ev-tomtom-maps', 'ev-charging-api')}>
            EV Charging v1
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('ev-orbis-maps', 'ev-charging-api')}>
            EV Charging v3
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('ev-guide-discovery', 'ev-charging-api')}>
            Guide: Station Discovery
          </button>
        </div>
      </div>
    </div>
  );
}
