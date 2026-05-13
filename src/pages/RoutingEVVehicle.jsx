import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';

/* ─── Code examples ──────────────────────────────────────────────────────────── */
const CODE_V1_PARAMS = `# v1 / v2 — query string parameters
curl "https://api.tomtom.com/routing/1/calculateRoute/\\
52.3676,4.9041:48.8566,2.3522/json\\
?key=YOUR_API_KEY\\
&vehicleEngineType=electric\\
&vehicleWeight=1800\\
&vehicleLength=4.5\\
&vehicleWidth=1.85\\
&vehicleHeight=1.6\\
&currentChargeInkWh=45\\
&maxChargeInkWh=75\\
&minChargeAtDestinationInkWh=5\\
&constantSpeedConsumptionInkWhPerHundredkm=50%2C8.2%3A90%2C14.6"`;

const CODE_V3_BODY = `# v3 — JSON POST body (vehicle parameters nested differently)
POST /maps/orbis/routing/v3/routes
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "from": { "position": { "lat": 52.3676, "lon": 4.9041 } },
  "to":   { "position": { "lat": 48.8566, "lon": 2.3522 } },
  "vehicle": {
    "engineType": "electric",
    "weight": 1800,
    "dimensions": {
      "length": 4.5,
      "width": 1.85,
      "height": 1.6
    },
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

const VEHICLE_PARAMS = [
  { param: 'vehicleWeight', type: 'integer (kg)', example: '1800', desc: 'Gross vehicle weight. Used to apply weight-restricted road and bridge rules. 0 = no restriction.' },
  { param: 'vehicleAxleWeight', type: 'integer (kg)', example: '900', desc: 'Weight per axle. Applies bridge weight restrictions common in truck routing.' },
  { param: 'vehicleLength', type: 'float (metres)', example: '4.5', desc: 'Vehicle length. Used to filter out low-clearance routes and short tunnels.' },
  { param: 'vehicleWidth', type: 'float (metres)', example: '1.85', desc: 'Vehicle width in metres, rounded to the nearest cm for road-width restrictions.' },
  { param: 'vehicleHeight', type: 'float (metres)', example: '1.6', desc: 'Vehicle height for bridge and tunnel vertical-clearance checks.' },
  { param: 'vehicleMaxSpeed', type: 'integer (km/h)', example: '180', desc: 'Maximum vehicle speed. 0 = auto-determined from road data. Values 0–250.' },
  { param: 'vehicleCommercial', type: 'boolean', example: 'false', desc: 'Mark vehicle as commercial to apply relevant road access restrictions.' },
];

const BATTERY_PARAMS = [
  { param: 'currentChargeInkWh', type: 'float', req: true, example: '45', desc: 'Current battery state of charge in kWh. Must always be ≤ maxChargeInkWh.' },
  { param: 'maxChargeInkWh', type: 'float', req: true, example: '75', desc: 'Total usable battery capacity in kWh.' },
  { param: 'minChargeAtDestinationInkWh', type: 'float', req: false, example: '5', desc: 'Minimum battery level required on arrival. Routes that fall below this are rejected.' },
  { param: 'minChargeAtChargingStopsInkWh', type: 'float', req: false, example: '5', desc: 'Minimum charge level at each charging stop. Only used by the Long Distance EV Routing API.' },
];

export default function RoutingEVVehicle({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Vehicle Profiles</h1>
        <PageActions pageId="routing-ev-connectors" pageTitle="EV Vehicle Profiles" />
      </div>
      <p className="quick-answer">
        Configure vehicle dimensions and battery parameters to enable accurate EV route
        planning. Dimension parameters enforce road-access restrictions; battery parameters
        determine reachable range.
      </p>

      {/* ── Vehicle dimensions ── */}
      <div className="zone">
        <h2 className="sh" id="vehicle-dimensions">Vehicle dimensions</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          Dimension and weight parameters apply to both electric and combustion vehicles.
          They filter out roads with weight, height, width, or length restrictions.
        </p>
        <div style={{
          background: 'var(--s1)', border: '1px solid var(--border)',
          borderRadius: '16px', overflow: 'hidden',
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 120px 80px',
            padding: '0.5rem 1rem', borderBottom: '1px solid var(--border)',
            background: 'var(--bg)',
          }}>
            {['Parameter', 'Type', 'Example'].map(h => (
              <span key={h} style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--mid)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</span>
            ))}
          </div>
          {VEHICLE_PARAMS.map(({ param, type, example, desc }) => (
            <div key={param} style={{
              display: 'grid', gridTemplateColumns: '1fr 120px 80px',
              padding: '0.625rem 1rem', borderBottom: '1px solid var(--border)',
              alignItems: 'start', gap: '0.5rem',
            }}>
              <div>
                <code style={{ fontSize: '0.75rem', color: 'var(--brand)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.2rem' }}>{param}</code>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text)' }}>{desc}</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)', paddingTop: '1px' }}>{type}</span>
              <code style={{ fontSize: '0.75rem', color: 'var(--mid)', fontFamily: 'var(--font-mono)', paddingTop: '1px' }}>{example}</code>
            </div>
          ))}
        </div>
      </div>

      {/* ── Battery parameters ── */}
      <div className="zone">
        <h2 className="sh" id="battery-params">Battery parameters</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          Battery parameters are required when using <code>vehicleEngineType=electric</code>.
          They define the current charge, capacity, and arrival constraints.
        </p>
        <div style={{
          background: 'var(--s1)', border: '1px solid var(--border)',
          borderRadius: '16px', overflow: 'hidden',
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 80px 80px',
            padding: '0.5rem 1rem', borderBottom: '1px solid var(--border)',
            background: 'var(--bg)',
          }}>
            {['Parameter', 'Type', 'Example'].map(h => (
              <span key={h} style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--mid)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</span>
            ))}
          </div>
          {BATTERY_PARAMS.map(({ param, type, req, example, desc }) => (
            <div key={param} style={{
              display: 'grid', gridTemplateColumns: '1fr 80px 80px',
              padding: '0.625rem 1rem', borderBottom: '1px solid var(--border)',
              alignItems: 'start', gap: '0.5rem',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <code style={{ fontSize: '0.75rem', color: 'var(--brand)', fontFamily: 'var(--font-mono)' }}>{param}</code>
                  {req && (
                    <span style={{ fontSize: '0.625rem', fontWeight: 700, color: '#fb923c', background: '#fb923c18', border: '1px solid #fb923c44', borderRadius: '4px', padding: '1px 5px' }}>required</span>
                  )}
                </div>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text)' }}>{desc}</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)', paddingTop: '1px' }}>{type}</span>
              <code style={{ fontSize: '0.75rem', color: 'var(--mid)', fontFamily: 'var(--font-mono)', paddingTop: '1px' }}>{example}</code>
            </div>
          ))}
        </div>
      </div>

      {/* ── Syntax differences ── */}
      <div className="zone">
        <h2 className="sh" id="syntax-versions">v1/v2 vs v3 syntax</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
          In v1 and v2, all vehicle parameters are passed as query string parameters (or a
          flat POST body in v2). In v3, vehicle parameters are nested under the{' '}
          <code>vehicle</code> object in the POST body, with dimensions grouped under
          <code>vehicle.dimensions</code> and battery parameters under
          <code>vehicle.electricConsumption</code>.
        </p>

        <p style={{ color: 'var(--mid)', fontSize: '0.8125rem', marginBottom: '0.5rem' }}>v1/v2 — query string:</p>
        <CodeBlock code={CODE_V1_PARAMS} language="bash" />

        <p style={{ color: 'var(--mid)', fontSize: '0.8125rem', margin: '1rem 0 0.5rem' }}>v3 — POST body:</p>
        <CodeBlock code={CODE_V3_BODY} language="json" />

        <Callout type="warn" title="v3 private preview">
          The v3 API requires preview access. Contact TomTom to request access before using
          the <code>/maps/orbis/routing/v3/</code> base path.
        </Callout>
      </div>

      {/* ── Next steps ── */}
      <div className="zone">
        <h2 className="sh" id="next-steps">Next steps</h2>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="page-action-btn" onClick={() => onNavigate?.('routing-ev-overview', 'routing-api')}>
            EV Route Planning
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('routing-ev-consumption', 'routing-api')}>
            Consumption Models
          </button>
        </div>
      </div>
    </div>
  );
}
