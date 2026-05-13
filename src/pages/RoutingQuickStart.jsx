import { lazy, Suspense } from 'react';
import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';

const TryItEmbed = lazy(() => import('../components/demos/TryItEmbed'));

/* ─── Code examples ──────────────────────────────────────────────────────────── */
const CODE_AUTH = `curl "https://api.tomtom.com/routing/1/calculateRoute/52.3676,4.9041:48.8566,2.3522/json?key=YOUR_API_KEY"`;

const CODE_FIRST_ROUTE = `# Calculate a route from Amsterdam to Paris
# POST with JSON body (v1 also supports GET with query params)

curl -X POST \\
  "https://api.tomtom.com/routing/1/calculateRoute/\\
52.3676,4.9041:48.8566,2.3522/json\\
?key=YOUR_API_KEY\\
&travelMode=car\\
&routeType=fastest\\
&traffic=true" \\
  -H "Content-Type: application/json" \\
  -d '{}'`;

const CODE_RESPONSE = `{
  "formatVersion": "0.0.12",
  "routes": [
    {
      "summary": {
        "lengthInMeters": 503241,
        "travelTimeInSeconds": 17423,
        "trafficDelayInSeconds": 612,
        "departureTime": "2026-05-12T09:00:00+02:00",
        "arrivalTime": "2026-05-12T14:50:23+02:00"
      },
      "legs": [ ... ],
      "sections": [ ... ]
    }
  ]
}`;

export default function RoutingQuickStart({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Quick Start</h1>
        <PageActions pageId="routing-quickstart" pageTitle="Routing API Quick Start" />
      </div>
      <p className="quick-answer">
        Make your first Routing API request in minutes. Authenticate with an API key, call
        Calculate Route, and get a full route summary including travel time, distance, and
        traffic delay.
      </p>

      {/* ── 1. Authentication ── */}
      <div className="zone">
        <h2 className="sh" id="authentication">Authentication</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
          All Routing API requests require an API key passed as the <code>key</code> query
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

      {/* ── 2. Your first route ── */}
      <div className="zone">
        <h2 className="sh" id="first-route">Your first route</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          The example below calculates the fastest car route from Amsterdam to Paris.
          Waypoints are specified as <code>lat,lon</code> pairs separated by colons in the
          path.
        </p>

        <Suspense fallback={<div style={{ height: 200, background: 'var(--s1)', borderRadius: 12 }} />}>
          <TryItEmbed demoId="calculate-route" />
        </Suspense>

        <p style={{ color: 'var(--mid)', fontSize: '0.8125rem', margin: '1rem 0 0.5rem' }}>
          Equivalent cURL request:
        </p>
        <CodeBlock code={CODE_FIRST_ROUTE} language="bash" />

        <p style={{ color: 'var(--mid)', fontSize: '0.8125rem', margin: '1rem 0 0.5rem' }}>
          Abbreviated response (summary fields):
        </p>
        <CodeBlock code={CODE_RESPONSE} language="json" />
      </div>

      {/* ── 3. Understanding the response ── */}
      <div className="zone">
        <h2 className="sh" id="response-structure">Understanding the response</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          Every Calculate Route response has the same top-level structure. Here is what
          each key contains:
        </p>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {[
            { key: 'routes[]', desc: 'Array of route alternatives. Index 0 is always the primary route. Up to 5 alternatives via maxAlternatives.' },
            { key: 'routes[0].summary', desc: 'Aggregated metrics for the whole route: total distance, travel time, traffic delay, and departure/arrival timestamps.' },
            { key: 'routes[0].legs[]', desc: 'One leg per pair of consecutive waypoints. Each leg has its own summary and ordered list of points.' },
            { key: 'routes[0].legs[0].points[]', desc: 'The route polyline as an ordered array of {latitude, longitude} objects.' },
            { key: 'routes[0].sections[]', desc: 'Annotated segments — toll zones, tunnels, ferries, speed-limit changes, and more. Requires sectionType query param.' },
            { key: 'routes[0].guidance', desc: 'Turn-by-turn instructions. Requires instructionsType query param. Contains instructions[] and instructionGroups[].' },
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
          The Routing API has three versions, each on a different map data platform.
        </p>
        <div style={{ display: 'grid', gap: '0.875rem' }}>
          {[
            {
              version: 'v1', label: 'Production', color: '#22c55e',
              platform: 'TomTom Maps', methods: 'GET or POST',
              baseUrl: '/routing/1/calculateRoute/…',
              summary: 'Stable and production-ready. Use for all new integrations today. Full parameter support including EV routing, batch, and reachable range.',
            },
            {
              version: 'v2', label: 'Public Preview', color: '#a78bfa',
              platform: 'Orbis Maps', methods: 'POST',
              baseUrl: '/routing/2/calculateRoute/…',
              summary: 'Next-generation map platform. Enhanced guidance output with road shields, lane-level detail, and improved traffic integration.',
            },
            {
              version: 'v3', label: 'Private Preview', color: '#fb923c',
              platform: 'Orbis Maps', methods: 'POST only',
              baseUrl: '/maps/orbis/routing/v3/routes',
              summary: 'Attribute-selected response fields (only request what you need). Simplified waypoint syntax. Requires preview access.',
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
          <button className="page-action-btn" onClick={() => onNavigate?.('routing-calculate-route', 'routing-api')}>
            Calculate Route (v1)
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('routing-v2-calculate-route', 'routing-api')}>
            Calculate Route (v2)
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('routing-v3-calculate-route', 'routing-api')}>
            Calculate Route (v3)
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('routing-ev-overview', 'routing-api')}>
            EV Route Planning
          </button>
        </div>
      </div>
    </div>
  );
}
