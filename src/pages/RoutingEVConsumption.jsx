import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';

/* ─── Code examples ──────────────────────────────────────────────────────────── */
const CODE_ELECTRIC_TABLE = `# Electric consumption table format
# speed (km/h), consumption (kWh/100km) — colon-separated pairs

constantSpeedConsumptionInkWhPerHundredkm=50,8.2:90,14.6:120,21.0

# URL-encoded form:
constantSpeedConsumptionInkWhPerHundredkm=50%2C8.2%3A90%2C14.6%3A120%2C21.0`;

const CODE_ELECTRIC_FULL = `curl "https://api.tomtom.com/routing/1/calculateRoute/\\
52.3676,4.9041:48.8566,2.3522/json\\
?key=YOUR_API_KEY\\
&vehicleEngineType=electric\\
&currentChargeInkWh=45\\
&maxChargeInkWh=75\\
&constantSpeedConsumptionInkWhPerHundredkm=50%2C8.2%3A90%2C14.6%3A120%2C21.0\\
&auxiliaryPowerInkW=1.5\\
&accelerationEfficiency=0.33\\
&decelerationEfficiency=0.33"`;

const CODE_COMBUSTION = `curl "https://api.tomtom.com/routing/1/calculateRoute/\\
52.3676,4.9041:48.8566,2.3522/json\\
?key=YOUR_API_KEY\\
&vehicleEngineType=combustion\\
&currentFuelInLiters=40\\
&constantSpeedConsumptionInLitersPerHundredkm=50%2C6.3%3A80%2C7.1%3A120%2C9.0"`;

const SPEED_TABLE = [
  { speed: 30,  kwh: 6.5 },
  { speed: 50,  kwh: 8.2 },
  { speed: 70,  kwh: 11.0 },
  { speed: 90,  kwh: 14.6 },
  { speed: 110, kwh: 18.4 },
  { speed: 120, kwh: 21.0 },
  { speed: 130, kwh: 23.8 },
];

export default function RoutingEVConsumption({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Consumption Models</h1>
        <PageActions pageId="routing-ev-consumption" pageTitle="EV Consumption Models" />
      </div>
      <p className="quick-answer">
        The Routing API supports two consumption models: electric (kWh/100 km speed table)
        and combustion (litres/100 km speed table). Consumption data lets the API estimate
        remaining range and flag routes that would deplete the battery.
      </p>

      {/* ── Electric model ── */}
      <div className="zone">
        <h2 className="sh" id="electric-model">Electric consumption model</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
          The electric consumption model uses a speed lookup table to estimate energy use
          in kWh per 100 km. You provide 1–25 speed/consumption pairs; the API interpolates
          linearly between them. Extrapolation beyond the range of your table uses the
          nearest endpoint slope.
        </p>

        {/* Speed table visualisation */}
        <div style={{
          background: 'var(--s1)', border: '1px solid var(--border)',
          borderRadius: '16px', overflow: 'hidden', marginBottom: '1.25rem',
        }}>
          <div style={{ padding: '0.625rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '2rem' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--mid)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Speed (km/h)</span>
            <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--mid)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>kWh / 100 km</span>
            <span style={{ fontSize: '0.6875rem', color: 'var(--muted)' }}>Example: compact EV</span>
          </div>
          {SPEED_TABLE.map(({ speed, kwh }) => (
            <div key={speed} style={{
              display: 'grid', gridTemplateColumns: '120px 120px 1fr',
              padding: '0.375rem 1rem', borderBottom: '1px solid var(--border)',
              alignItems: 'center',
            }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{speed}</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{kwh}</span>
              <div style={{ height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(kwh / 24) * 100}%`, background: '#22c55e', borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {[
            { param: 'constantSpeedConsumptionInkWhPerHundredkm', req: true, desc: 'Colon-delimited list of speed,consumption pairs. Speed in km/h; consumption in kWh/100 km. Example: "50,8.2:90,14.6:120,21.0".' },
            { param: 'auxiliaryPowerInkW', req: false, desc: 'Continuous power draw from accessories (HVAC, lighting, infotainment). Added uniformly to the interpolated consumption. Example: 1.5 kW.' },
            { param: 'accelerationEfficiency', req: false, desc: 'Kinetic-to-battery efficiency on acceleration. Range 0–1. Must be paired with decelerationEfficiency. Product of both ≤ 1.' },
            { param: 'decelerationEfficiency', req: false, desc: 'Battery recovery efficiency during regenerative braking. Range 0–1. Must be paired with accelerationEfficiency.' },
            { param: 'uphillEfficiency', req: false, desc: 'Motor efficiency going uphill. Cannot be combined with altitude-based parameters.' },
            { param: 'downhillEfficiency', req: false, desc: 'Recuperation efficiency going downhill. Must be paired with uphillEfficiency.' },
            { param: 'consumptionInkWhPerkmAltitudeGain', req: false, desc: 'Energy used per 1 km of altitude gain (kWh/km). Cannot be combined with efficiency parameters.' },
            { param: 'recuperationInkWhPerkmAltitudeLoss', req: false, desc: 'Energy recovered per 1 km of altitude loss. Pair with consumptionInkWhPerkmAltitudeGain.' },
          ].map(({ param, req, desc }) => (
            <div key={param} style={{
              padding: '0.625rem 0.875rem', background: 'var(--bg)',
              border: '1px solid var(--border)', borderRadius: '10px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <code style={{ fontSize: '0.75rem', color: 'var(--brand)', fontFamily: 'var(--font-mono)' }}>{param}</code>
                {req && (
                  <span style={{ fontSize: '0.625rem', fontWeight: 700, color: '#fb923c', background: '#fb923c18', border: '1px solid #fb923c44', borderRadius: '4px', padding: '1px 5px' }}>required</span>
                )}
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text)' }}>{desc}</div>
            </div>
          ))}
        </div>

        <p style={{ color: 'var(--mid)', fontSize: '0.8125rem', marginBottom: '0.5rem' }}>
          Speed table format:
        </p>
        <CodeBlock code={CODE_ELECTRIC_TABLE} language="bash" />

        <p style={{ color: 'var(--mid)', fontSize: '0.8125rem', margin: '1rem 0 0.5rem' }}>
          Full request with efficiency parameters:
        </p>
        <CodeBlock code={CODE_ELECTRIC_FULL} language="bash" />
      </div>

      {/* ── Combustion model ── */}
      <div className="zone">
        <h2 className="sh" id="combustion-model">Combustion consumption model</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
          The combustion model works identically to the electric model but uses
          litres per 100 km instead of kWh. Use it to estimate fuel consumption and
          remaining range for conventional vehicles.
        </p>

        <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {[
            { param: 'constantSpeedConsumptionInLitersPerHundredkm', req: true, desc: 'Speed:consumption pairs in L/100 km. Same format as the electric table. Example: "50,6.3:80,7.1:120,9.0".' },
            { param: 'currentFuelInLiters', req: false, desc: 'Current fuel level in litres. Used to compute remaining range warnings.' },
            { param: 'auxiliaryPowerInLitersPerHour', req: false, desc: 'Extra fuel consumption from accessories. Added uniformly.' },
            { param: 'fuelEnergyDensityInMJoulesPerLiter', req: false, desc: 'Fuel energy density. Required when using efficiency parameters. Typical: 34.2 MJ/L (petrol), 35.8 MJ/L (diesel).' },
            { param: 'accelerationEfficiency', req: false, desc: 'Same as the electric model — kinetic energy conversion efficiency. Requires fuelEnergyDensityInMJoulesPerLiter.' },
            { param: 'decelerationEfficiency', req: false, desc: 'Braking energy recovery. Pair with accelerationEfficiency.' },
          ].map(({ param, req, desc }) => (
            <div key={param} style={{
              padding: '0.625rem 0.875rem', background: 'var(--bg)',
              border: '1px solid var(--border)', borderRadius: '10px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <code style={{ fontSize: '0.75rem', color: 'var(--brand)', fontFamily: 'var(--font-mono)' }}>{param}</code>
                {req && (
                  <span style={{ fontSize: '0.625rem', fontWeight: 700, color: '#fb923c', background: '#fb923c18', border: '1px solid #fb923c44', borderRadius: '4px', padding: '1px 5px' }}>required</span>
                )}
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text)' }}>{desc}</div>
            </div>
          ))}
        </div>

        <CodeBlock code={CODE_COMBUSTION} language="bash" />

        <Callout type="info" title="Consumption response fields">
          When you supply consumption parameters the response <code>summary</code> object
          includes <code>remainingChargeAfterArrivalInkWh</code> (electric) or
          <code>remainingFuelAfterArrivalInLiters</code> (combustion).
        </Callout>
      </div>

      {/* ── Next steps ── */}
      <div className="zone">
        <h2 className="sh" id="next-steps">Next steps</h2>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="page-action-btn" onClick={() => onNavigate?.('routing-ev-overview', 'routing-api')}>
            EV Route Planning
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('routing-ev-connectors', 'routing-api')}>
            Vehicle Profiles
          </button>
        </div>
      </div>
    </div>
  );
}
