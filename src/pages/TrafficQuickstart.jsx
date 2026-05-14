import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';

/* ─── Code examples ──────────────────────────────────────────────────────────── */
const CODE_AUTH = `curl "https://api.tomtom.com/traffic/services/5/incidentDetails?key=YOUR_API_KEY&bbox=4.84,52.32,4.95,52.42&fields=%7Bincidents%7Btype,geometry%7D%7D"`;

const CODE_FIRST_REQUEST = `# Fetch traffic incidents in a bounding box (Amsterdam area)
curl "https://api.tomtom.com/traffic/services/5/incidentDetails\\
  ?key=YOUR_API_KEY\\
  &bbox=4.84239,52.31,4.97,52.51\\
  &fields=%7Bincidents%7Btype%2Cgeometry%7Btype%2Ccoordinates%7D%2Cproperties%7BiconCategory%2CmagnitudeOfDelay%2Cfrom%2Cto%2Clength%2Cdelay%7D%7D%7D\\
  &language=en-GB\\
  &timeValidityFilter=present"`;

const CODE_RESPONSE = `{
  "incidents": [
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": { "coordinate": [ ... ] }
      },
      "properties": {
        "iconCategory": 9,
        "magnitudeOfDelay": 0,
        "from": "Upper Richmond Road (A205) / Rocks Lane",
        "to": "Mortlake High Street",
        "length": 312,
        "delay": 0
      }
    }
  ]
}`;

export default function TrafficQuickstart({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Getting Started</h1>
        <PageActions pageId="traffic-quickstart" pageTitle="Traffic API — Getting Started" />
      </div>
      <p className="quick-answer">
        Understand how the Traffic API works, authenticate with an API key, and know which
        version to use. Ready to build? Jump straight into the live API Explorer.
      </p>

      {/* ── 1. Authentication ── */}
      <div className="zone">
        <h2 className="sh" id="authentication">Authentication</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
          All Traffic API requests require an API key passed as the <code>key</code> query
          parameter. You can generate a key in the{' '}
          <a href="https://developer.tomtom.com" target="_blank" rel="noreferrer"
            style={{ color: 'var(--brand)' }}>TomTom Developer Portal</a>.
        </p>
        <CodeBlock code={CODE_AUTH} language="bash" />
        <Callout type="info" title="Keep your key secret">
          Never expose your API key in client-side JavaScript. For browser apps, proxy
          requests through your own backend.
        </Callout>
      </div>

      {/* ── 2. Your first request ── */}
      <div className="zone">
        <h2 className="sh" id="first-request">Your first request</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          The example below fetches live traffic incidents in the Amsterdam area. Provide a
          bounding box as <code>minLon,minLat,maxLon,maxLat</code> and select which fields to
          return using the URL-encoded <code>fields</code> template.
        </p>

        {/* Explorer CTA */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 16, padding: '14px 18px',
          background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 16,
          marginBottom: '1rem',
        }}>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--black)', marginBottom: 3 }}>
              Try it live in the API Explorer
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', lineHeight: 1.45 }}>
              Set parameters, fire live requests, see real incident data on a map, copy cURL — all in one place.
            </div>
          </div>
          <button
            className="page-action-btn"
            style={{ flexShrink: 0 }}
            onClick={() => onNavigate?.('traffic-explorer', 'traffic-api')}
          >
            Open API Explorer →
          </button>
        </div>

        <p style={{ color: 'var(--mid)', fontSize: '0.8125rem', margin: '0 0 0.5rem' }}>
          Equivalent cURL request:
        </p>
        <CodeBlock code={CODE_FIRST_REQUEST} language="bash" />

        <p style={{ color: 'var(--mid)', fontSize: '0.8125rem', margin: '1rem 0 0.5rem' }}>
          Abbreviated response:
        </p>
        <CodeBlock code={CODE_RESPONSE} language="json" />
      </div>

      {/* ── 3. Understanding the response ── */}
      <div className="zone">
        <h2 className="sh" id="response-structure">Understanding the response</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          Incident Details v5 returns an <code>incidents</code> array of GeoJSON Feature objects:
        </p>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {[
            { key: 'incidents[]', desc: 'Array of GeoJSON Feature objects. Each represents one traffic incident in the requested bounding box. Only fields requested via the fields parameter are included.' },
            { key: 'incidents[0].geometry', desc: 'GeoJSON geometry — either a Point or LineString with longitude/latitude coordinates. Use for map overlay rendering.' },
            { key: 'incidents[0].properties.iconCategory', desc: 'Integer incident type (0–14). 1 = Accident, 6 = Jam, 8 = Road Closed, 9 = Road Works, 14 = Broken-down vehicle.' },
            { key: 'incidents[0].properties.magnitudeOfDelay', desc: 'Severity: 0 = Unknown, 1 = Minor, 2 = Moderate, 3 = Major, 4 = Undefined. Use for colour-coding markers.' },
            { key: 'incidents[0].properties.delay', desc: 'Extra travel time in seconds compared to free-flow conditions. Useful for ranking incidents by impact on journey time.' },
            { key: 'incidents[0].properties.from / to', desc: 'Human-readable start and end road names for the affected segment. Safe to display directly in UI.' },
            { key: 'incidents[0].properties.length', desc: 'Length of the affected road segment in metres.' },
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
          The Traffic API has two versions on different map data platforms.
        </p>
        <div style={{ display: 'grid', gap: '0.875rem' }}>
          {[
            {
              version: 'v1', label: 'Production', color: '#22c55e',
              platform: 'TomTom Maps', methods: 'GET',
              baseUrl: '/traffic/services/{v}/incidentDetails',
              summary: 'Stable and production-ready. Covers flow segment data, raster and vector flow/incident tiles, incident details (v5), and Traffic Model ID for data synchronisation.',
            },
            {
              version: 'v3', label: 'Private Preview', color: '#fb923c',
              platform: 'Orbis Maps', methods: 'GET',
              baseUrl: '/maps/orbis/traffic/incidents/details',
              summary: 'Next-generation platform with simplified URLs, the Attributes header for field selection, string-based category values (accident, jam, roadWorks), and unified error format.',
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
          <button className="page-action-btn" onClick={() => onNavigate?.('traffic-incident-details', 'traffic-api')}>
            Incident Details reference
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('traffic-flow-segment', 'traffic-api')}>
            Flow Segment Data
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('traffic-flow-tiles', 'traffic-api')}>
            Flow Tiles
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('traffic-tomtom-maps', 'traffic-api')}>
            Traffic API v1
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('traffic-orbis-maps', 'traffic-api')}>
            Traffic API v3
          </button>
        </div>
      </div>
    </div>
  );
}
