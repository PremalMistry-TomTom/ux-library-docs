import { lazy, Suspense } from 'react';
import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';

const TryItEmbed = lazy(() => import('../components/demos/TryItEmbed'));

/* ─── Code examples ──────────────────────────────────────────────────────────── */
const CODE_AUTH = `curl -X POST "https://api.tomtom.com/routing/1/calculateLongDistanceEVRoute/52.507,13.492:50.104,8.624/json?key=YOUR_API_KEY&vehicleEngineType=electric&currentChargeInkWh=20&maxChargeInkWh=40"`;

const CODE_FIRST_ROUTE = `# Berlin → Frankfurt, 40 kWh battery at 50% charge
# Charging stops are inserted automatically
curl -X POST \\
  "https://api.tomtom.com/routing/1/calculateLongDistanceEVRoute/\\
52.507,13.492:50.104,8.624/json\\
?key=YOUR_API_KEY\\
&vehicleEngineType=electric\\
&constantSpeedConsumptionInkWhPerHundredkm=32,10.87:77,18.01\\
&currentChargeInkWh=20\\
&maxChargeInkWh=40\\
&minChargeAtDestinationInkWh=4\\
&criticalMinChargeAtDestinationInkWh=2\\
&minChargeAtChargingStopsInkWh=4" \\
  -H "Content-Type: application/json" \\
  -d '{
    "chargingParameters": {
      "batteryCurve": [
        { "stateOfChargeInkWh": 0,  "maxPowerInkW": 200 },
        { "stateOfChargeInkWh": 30, "maxPowerInkW": 150 },
        { "stateOfChargeInkWh": 36, "maxPowerInkW": 50  }
      ]
    }
  }'`;

const CODE_RESPONSE = `{
  "routes": [
    {
      "summary": {
        "lengthInMeters": 562840,
        "travelTimeInSeconds": 22450,
        "totalChargingTimeInSeconds": 2700,
        "remainingChargeAtArrivalInkWh": 4.0,
        "departureTime": "2026-05-12T09:00:00+02:00",
        "arrivalTime": "2026-05-12T16:14:10+02:00"
      },
      "legs": [
        {
          "summary": {
            "lengthInMeters": 312400,
            "travelTimeInSeconds": 10320,
            "remainingChargeAtArrivalInkWh": 6.5
          }
        },
        {
          "summary": {
            "lengthInMeters": 250440,
            "travelTimeInSeconds": 9430,
            "remainingChargeAtArrivalInkWh": 4.0,
            "chargingInformationAtEndOfLeg": {
              "chargingTimeInSeconds": 2700,
              "targetChargeInkWh": 32.0,
              "chargingParkId": "840DR5SS91",
              "chargingConnections": [
                { "facilityType": "Charge150To350Kw", "plugType": "IEC62196Type2CCS" }
              ]
            }
          }
        }
      ]
    }
  ]
}`;

export default function LDEVRQuickstart({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Quick Start</h1>
        <PageActions pageId="ldevr-quickstart" pageTitle="Long Distance EV Routing Quick Start" />
      </div>
      <p className="quick-answer">
        Calculate a long-distance EV route with automatic charging stops in a single POST request.
        Provide origin, destination, battery parameters, and a consumption model — the API plans
        the optimal charging stops and returns a multi-leg route.
      </p>

      {/* ── 1. Authentication ── */}
      <div className="zone">
        <h2 className="sh" id="authentication">Authentication</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
          All LDEVR requests require an API key passed as the <code>key</code> query parameter.
          Get one free at the{' '}
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
        <h2 className="sh" id="first-route">Your first EV route</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          The example below routes from Berlin to Frankfurt with a 40 kWh battery at 50%
          charge. Waypoints are colon-separated <code>lat,lon</code> pairs in the path.
          The API inserts charging stops automatically — each stop becomes a new leg.
        </p>

        <Suspense fallback={<div style={{ height: 200, background: 'var(--s1)', borderRadius: 12 }} />}>
          <TryItEmbed demoId="ldevr-weather" />
        </Suspense>

        <p style={{ color: 'var(--mid)', fontSize: '0.8125rem', margin: '1rem 0 0.5rem' }}>
          Equivalent cURL request:
        </p>
        <CodeBlock code={CODE_FIRST_ROUTE} language="bash" />

        <p style={{ color: 'var(--mid)', fontSize: '0.8125rem', margin: '1rem 0 0.5rem' }}>
          Abbreviated response (2-leg route with one charging stop):
        </p>
        <CodeBlock code={CODE_RESPONSE} language="json" />
      </div>

      {/* ── 3. Understanding the response ── */}
      <div className="zone">
        <h2 className="sh" id="response-structure">Understanding the response</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          Every LDEVR response has the same top-level structure, with EV-specific fields
          alongside the standard routing fields:
        </p>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {[
            { key: 'routes[0].summary', desc: 'Aggregated metrics for the whole route including totalChargingTimeInSeconds and remainingChargeAtArrivalInkWh alongside distance and travel time.' },
            { key: 'routes[0].legs[]', desc: 'One leg per segment between charging stops (or origin/destination). The API inserts stops automatically — leg count = charging stops + 1.' },
            { key: 'legs[N].summary\n.remainingChargeAtArrivalInkWh', desc: 'Predicted battery level when arriving at the end of this leg. Use to verify the route meets your minimum charge requirements.' },
            { key: 'legs[N].summary\n.chargingInformationAtEndOfLeg', desc: 'Present on legs that end at a charging stop. Contains chargingTimeInSeconds, targetChargeInkWh, chargingParkId, and chargingConnections.' },
            { key: 'chargingConnections[]', desc: 'Available connector types at the charging stop. facilityType describes the charge speed; plugType is the connector standard (e.g. IEC62196Type2CCS).' },
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
          The Long Distance EV Routing API has three versions, each with additional capabilities.
        </p>
        <div style={{ display: 'grid', gap: '0.875rem' }}>
          {[
            {
              version: 'v1', label: 'Production', color: '#22c55e',
              platform: 'TomTom Maps', methods: 'POST',
              baseUrl: '/routing/1/calculateLongDistanceEVRoute/…',
              summary: 'Stable and production-ready. Full EV routing with battery curve, charging stop optimisation, weather impact, and multi-waypoint support.',
            },
            {
              version: 'v2', label: 'Public Preview', color: '#a78bfa',
              platform: 'Orbis Maps', methods: 'POST',
              baseUrl: '/maps/orbis/routing/calculateLongDistanceEVRoute?apiVersion=2',
              summary: 'Locations move to GeoJSON POST body. API key moves to TomTom-Api-Key header. Response field renames (e.g. travelTimeInSeconds → travelDurationInSeconds).',
            },
            {
              version: 'v3', label: 'Private Preview', color: '#fb923c',
              platform: 'Orbis Maps', methods: 'POST only',
              baseUrl: '/maps/orbis/routing/calculateLongDistanceEVRoute?apiVersion=3',
              summary: 'Attribute-selected response fields via required Attributes header. All enum values switch to camelCase. sections restructured as map keyed by type.',
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
          <button className="page-action-btn" onClick={() => onNavigate?.('ldevr-calculate-route', 'ldevr')}>
            Calculate EV Route reference
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('ldevr-battery-model', 'ldevr')}>
            Battery model
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('ldevr-charging-stops', 'ldevr')}>
            Charging stops
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('ldevr-tomtom-maps', 'ldevr')}>
            LDEVR v1
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('ldevr-orbis-v2', 'ldevr')}>
            LDEVR v2
          </button>
        </div>
      </div>
    </div>
  );
}
