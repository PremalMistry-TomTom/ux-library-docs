import { lazy, Suspense } from 'react';
import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';

const TryItEmbed = lazy(() => import('../components/demos/TryItEmbed'));

/* ─── Code examples ──────────────────────────────────────────────────────────── */
const CODE_EV_ROUTE = `# EV route from Amsterdam to Paris
# Battery: 45 kWh current / 75 kWh max
# Consumption: 8.2 kWh/100km @ 50 km/h, 14.6 kWh/100km @ 90 km/h

curl "https://api.tomtom.com/routing/1/calculateRoute/\\
52.3676,4.9041:48.8566,2.3522/json\\
?key=YOUR_API_KEY\\
&travelMode=car\\
&vehicleEngineType=electric\\
&currentChargeInkWh=45\\
&maxChargeInkWh=75\\
&minChargeAtDestinationInkWh=5\\
&constantSpeedConsumptionInkWhPerHundredkm=50%2C8.2%3A90%2C14.6"`;

const CODE_EV_V3 = `# v3 POST body syntax — same parameters, JSON body
POST /maps/orbis/routing/v3/routes
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "from": { "position": { "lat": 52.3676, "lon": 4.9041 } },
  "to":   { "position": { "lat": 48.8566, "lon": 2.3522 } },
  "vehicle": {
    "engineType": "electric",
    "electricConsumption": {
      "maxChargeInkWh": 75,
      "currentChargeInkWh": 45,
      "minChargeAtDestinationInkWh": 5,
      "speedConsumptionInkWhPerHundredkm": [
        { "speed": 50,  "consumption": 8.2 },
        { "speed": 90,  "consumption": 14.6 }
      ]
    }
  }
}`;

export default function RoutingEVGuide({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>EV Route Planning</h1>
        <PageActions pageId="routing-ev-overview" pageTitle="EV Route Planning" />
      </div>
      <p className="quick-answer">
        Use <code>vehicleEngineType=electric</code> with Calculate Route to plan routes that
        account for battery range. Available in v1, v2, and v3.
      </p>

      {/* ── How EV routing works ── */}
      <div className="zone">
        <h2 className="sh" id="how-it-works">How EV routing works in the Routing API</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
          The standard Routing API supports EV route planning by accepting electric vehicle
          parameters alongside your normal route request. The API adjusts the route to
          account for battery consumption — avoiding roads or segments that would deplete the
          battery below your minimum threshold at the destination.
        </p>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
          This is <strong>not</strong> the same as the Long Distance EV Routing API (LDEVR).
          The standard Routing API does not automatically insert charging stops — it simply
          routes within your current battery range and returns a consumption summary. If the
          destination is unreachable on the current charge, the request returns an error.
        </p>
        <Callout type="info" title="Need automatic charging stops?">
          For multi-stop EV trips with automatic charging stop optimisation, see the{' '}
          <button
            style={{ background: 'none', border: 'none', color: 'var(--brand)', cursor: 'pointer', padding: 0, fontSize: 'inherit', textDecoration: 'underline' }}
            onClick={() => onNavigate?.('ldevr-intro', 'ldevr')}
          >
            Long Distance EV Routing API
          </button>.
        </Callout>
      </div>

      {/* ── Key parameters ── */}
      <div className="zone">
        <h2 className="sh" id="key-params">Key parameters</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          Add these parameters to any Calculate Route request to enable EV routing. The
          first three are required together.
        </p>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {[
            { param: 'vehicleEngineType', type: 'string', req: true, desc: 'Set to "electric" to activate EV routing. Must be combined with consumption and battery parameters.' },
            { param: 'constantSpeedConsumptionInkWhPerHundredkm', type: 'string', req: true, desc: 'Speed:consumption lookup table. Format: "50,8.2:90,14.6:120,21.0". 1–25 pairs.' },
            { param: 'currentChargeInkWh', type: 'float', req: true, desc: 'Current battery state of charge in kWh.' },
            { param: 'maxChargeInkWh', type: 'float', req: true, desc: 'Total usable battery capacity in kWh.' },
            { param: 'minChargeAtDestinationInkWh', type: 'float', req: false, desc: 'Minimum battery level required on arrival. Routes that fall below this threshold are rejected.' },
            { param: 'auxiliaryPowerInkW', type: 'float', req: false, desc: 'Continuous power draw from HVAC, headlights, and other accessories. Added to base consumption.' },
            { param: 'accelerationEfficiency', type: 'float', req: false, desc: 'Efficiency factor during acceleration (0–1). Pair with decelerationEfficiency.' },
            { param: 'decelerationEfficiency', type: 'float', req: false, desc: 'Energy recovery factor during braking via regenerative braking (0–1).' },
          ].map(({ param, type, req, desc }) => (
            <div key={param} style={{
              display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem',
              padding: '0.625rem 0.875rem', background: 'var(--s1)',
              border: '1px solid var(--border)', borderRadius: '10px',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <code style={{ fontSize: '0.75rem', color: 'var(--brand)', fontFamily: 'var(--font-mono)' }}>{param}</code>
                  {req && (
                    <span style={{ fontSize: '0.625rem', fontWeight: 700, color: '#fb923c', background: '#fb923c18', border: '1px solid #fb923c44', borderRadius: '4px', padding: '1px 5px' }}>required</span>
                  )}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text)' }}>{desc}</div>
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--muted)', whiteSpace: 'nowrap', alignSelf: 'start', paddingTop: '2px' }}>{type}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Code example ── */}
      <div className="zone">
        <h2 className="sh" id="code-example">Code example</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
          Route from Amsterdam to Paris with a 75 kWh battery at 60% charge, using a
          two-point consumption table.
        </p>

        <Suspense fallback={<div style={{ height: 200, background: 'var(--s1)', borderRadius: 12 }} />}>
          <TryItEmbed demoId="calculate-route" />
        </Suspense>

        <p style={{ color: 'var(--mid)', fontSize: '0.8125rem', margin: '1rem 0 0.5rem' }}>
          v1 query string syntax:
        </p>
        <CodeBlock code={CODE_EV_ROUTE} language="bash" />
      </div>

      {/* ── Version support ── */}
      <div className="zone">
        <h2 className="sh" id="version-support">Version support</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          EV routing is available across all three Routing API versions.
        </p>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {[
            { version: 'v1', color: '#22c55e', label: 'Production', syntax: 'Query string', note: 'Full EV parameter support. All consumption model parameters available.' },
            { version: 'v2', color: '#a78bfa', label: 'Public Preview', syntax: 'POST body', note: 'Same parameters as v1 but in POST JSON body. Enhanced guidance output.' },
            { version: 'v3', color: '#fb923c', label: 'Private Preview', syntax: 'POST body (different schema)', note: 'Parameters nested under vehicle.electricConsumption. speedConsumptionInkWhPerHundredkm is an array of objects, not a colon-delimited string.' },
          ].map(v => (
            <div key={v.version} style={{
              display: 'grid', gridTemplateColumns: '48px 1fr', gap: '0.875rem',
              padding: '0.75rem 1rem', background: 'var(--bg)',
              border: '1px solid var(--border)', borderRadius: '12px', alignItems: 'start',
            }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                padding: '2px 8px', background: v.color + '22',
                border: `1px solid ${v.color}66`, borderRadius: '6px',
                fontSize: '0.75rem', fontWeight: 700, color: v.color,
              }}>{v.version}</div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.2rem' }}>
                  <strong style={{ color: 'var(--mid)' }}>{v.label}</strong> — {v.syntax}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>{v.note}</div>
              </div>
            </div>
          ))}
        </div>

        <p style={{ color: 'var(--mid)', fontSize: '0.8125rem', margin: '1.25rem 0 0.5rem' }}>
          v3 POST body syntax for EV parameters:
        </p>
        <CodeBlock code={CODE_EV_V3} language="json" />
      </div>

      {/* ── Next steps ── */}
      <div className="zone">
        <h2 className="sh" id="next-steps">Next steps</h2>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="page-action-btn" onClick={() => onNavigate?.('routing-ev-consumption', 'routing-api')}>
            Consumption Models
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('routing-ev-connectors', 'routing-api')}>
            Vehicle Profiles
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('ldevr-intro', 'ldevr')}>
            Long Distance EV Routing API
          </button>
        </div>
      </div>
    </div>
  );
}
