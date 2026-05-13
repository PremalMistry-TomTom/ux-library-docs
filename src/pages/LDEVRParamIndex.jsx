import PageActions from '../components/ui/PageActions';

const V = {
  1: { bg: 'rgba(34,197,94,0.1)',   color: '#15803d' },
  2: { bg: 'rgba(167,139,250,0.1)', color: '#7c3aed' },
  3: { bg: 'rgba(251,146,60,0.1)',  color: '#c2410c' },
};

const PARAM_TABLE = [
  { name: 'key',                          type: 'string',        dflt: '—',          v: [1,2,3], desc: 'TomTom API key. Required on all requests via ?key= query parameter.', constraint: 'Required.' },
  { name: 'accelerationEfficiency',       type: 'float',         dflt: '—',          v: [1,2,3], desc: 'Efficiency of energy→kinetic conversion during acceleration. Product with decelerationEfficiency must be ≤ 1.' },
  { name: 'arriveAt',                     type: 'datetime',      dflt: '—',          v: [1,2,3], desc: 'Desired arrival time (RFC 3339). Cannot be combined with departAt.', constraint: 'Mutually exclusive with departAt.' },
  { name: 'auxiliaryPowerInkW',           type: 'float',         dflt: '0',          v: [1,2,3], desc: 'Continuous power draw from HVAC, infotainment, and accessories in kW. Counts against battery budget.' },
  { name: 'avoid',                        type: 'string (×n)',   dflt: '—',          v: [1,2,3], desc: 'Road or feature types to exclude. Repeatable.', values: 'tollRoads, motorways, ferries, unpavedRoads, tunnels, borderCrossings' },
  { name: 'chargeMarginsInkWh',           type: 'string (CSV)',  dflt: '—',          v: [1,2],   desc: 'Comma-separated kWh margins at each charging stop. Allows fine-grained per-stop minimum charge control beyond minChargeAtChargingStopsInkWh.' },
  { name: 'chargingStopsStrategy',        type: 'string',        dflt: 'auto',       v: [1,2],   desc: 'Strategy for selecting charging stops.', values: 'auto, manual', constraint: 'manual requires a chargingModes or chargingConnectors POST body.' },
  { name: 'computeTravelTimeFor',         type: 'string',        dflt: 'none',       v: [1,2],   desc: 'Include travel time variants in the response.', values: 'none, all' },
  { name: 'computeTollCost',              type: 'boolean',       dflt: 'false',      v: [1,2],   desc: 'Include toll cost information in the route response. Requires vehicleWeight and other commercial parameters for accurate pricing.' },
  { name: 'connectorSet',                 type: 'string (CSV)',  dflt: '—',          v: [1,2,3], desc: 'Comma-separated EV connector type codes. Restricts charging stops to stations that support the listed connectors.', values: 'IEC62196Type2CableAttached, IEC62196Type2CCS, Chademo, GBT20234Part2, Tesla, Nacs' },
  { name: 'constantSpeedConsumptionInkWhPerHundredkm', type: 'colon pairs', dflt: '—', v: [1,2,3], desc: '1–25 speed:kWh/100km pairs defining the EV consumption curve.', constraint: 'Required for the electric consumption model. No duplicate speeds.' },
  { name: 'consumptionInkWhPerkmAltitudeGain', type: 'float',    dflt: '—',          v: [1,2,3], desc: 'kWh consumed per 1 km of altitude gain. Paired with recuperationInkWhPerkmAltitudeLoss.' },
  { name: 'criticalMinChargeAtDestinationInkWh', type: 'float',  dflt: '—',          v: [1,2,3], desc: 'Absolute minimum charge threshold at destination in kWh. Route fails if this cannot be guaranteed.' },
  { name: 'currentChargeInkWh',           type: 'float',         dflt: '—',          v: [1,2,3], desc: 'Current battery charge in kWh at the start of the route.', constraint: 'Required. Must be ≤ maxChargeInkWh.' },
  { name: 'decelerationEfficiency',       type: 'float',         dflt: '—',          v: [1,2,3], desc: 'Efficiency of kinetic→energy recovery during braking. Product with accelerationEfficiency must be ≤ 1.' },
  { name: 'departAt',                     type: 'datetime',      dflt: 'now',        v: [1,2,3], desc: 'Departure time (RFC 3339). Defaults to now.', constraint: 'Mutually exclusive with arriveAt.' },
  { name: 'downhillEfficiency',           type: 'float',         dflt: '—',          v: [1,2,3], desc: 'Efficiency of potential→energy conversion on downhill segments. Product with uphillEfficiency must be ≤ 1.' },
  { name: 'instructionsType',             type: 'string',        dflt: '—',          v: [1,2,3], desc: 'Activates turn-by-turn guidance in the response.', values: 'coded, text, tagged' },
  { name: 'language',                     type: 'string (IETF)', dflt: 'en-GB',      v: [1,2,3], desc: 'Language for instruction text and street name localisation.', values: 'e.g. en-GB, de-DE, fr-FR' },
  { name: 'maxChargeInkWh',               type: 'float',         dflt: '—',          v: [1,2,3], desc: 'Total usable battery capacity in kWh.', constraint: 'Required. Must be ≥ currentChargeInkWh.' },
  { name: 'minChargeAtChargingStopsInkWh', type: 'float',        dflt: '—',          v: [1,2,3], desc: 'Minimum battery charge level required when arriving at each automatic charging stop.', constraint: 'Required.' },
  { name: 'minChargeAtDestinationInkWh',  type: 'float',         dflt: '—',          v: [1,2,3], desc: 'Minimum battery charge required on arrival at the final destination.', constraint: 'Required. Must be ≥ criticalMinChargeAtDestinationInkWh.' },
  { name: 'recuperationInkWhPerkmAltitudeLoss', type: 'float',   dflt: '—',          v: [1,2,3], desc: 'kWh recovered per 1 km of altitude loss via regenerative braking.' },
  { name: 'report',                       type: 'string',        dflt: '—',          v: [1,2,3], desc: 'Returns effectiveSettings in the response.', values: 'effectiveSettings' },
  { name: 'routeType',                    type: 'string',        dflt: 'fastest',    v: [1,2,3], desc: 'Route optimisation objective.', values: 'fastest, shortest, eco' },
  { name: 'sectionType',                  type: 'string (×n)',   dflt: '—',          v: [1,2,3], desc: 'Section types to include in the response. Repeatable.', values: 'travelMode, traffic, toll, country, motorway, tunnel, ferry, speedLimit' },
  { name: 'traffic',                      type: 'boolean',       dflt: 'true',       v: [1,2,3], desc: 'Use real-time and historic traffic data for route and timing calculations.' },
  { name: 'travelMode',                   type: 'string',        dflt: 'car',        v: [1,2,3], desc: 'Vehicle or transport type.', values: 'car, truck, taxi, bus, van' },
  { name: 'uphillEfficiency',             type: 'float',         dflt: '—',          v: [1,2,3], desc: 'Efficiency of energy→potential conversion on uphill segments. Product with downhillEfficiency must be ≤ 1.' },
  { name: 'vehicleAdrTunnelRestrictionCode', type: 'string',     dflt: '—',          v: [1,2,3], desc: 'ADR tunnel restriction code for hazardous cargo.', values: 'B, C, D, E' },
  { name: 'vehicleAxleWeight',            type: 'integer (kg)',  dflt: '0',          v: [1,2,3], desc: 'Weight per axle in kg. 0 = ignore axle weight restrictions.' },
  { name: 'vehicleBrandId',              type: 'string',         dflt: '—',          v: [1,2],   desc: 'TomTom vehicle brand identifier. Enables brand-specific charging parameters and consumption profile lookup.' },
  { name: 'vehicleCommercial',            type: 'boolean',       dflt: 'false',      v: [1,2,3], desc: 'Mark as a commercial vehicle to apply commercial road access restrictions.' },
  { name: 'vehicleEngineType',            type: 'string',        dflt: 'electric',   v: [1,2,3], desc: 'Engine type. Must be electric for LDEVR.', values: 'electric', constraint: 'Always electric for Long Distance EV Routing.' },
  { name: 'vehicleHeight',               type: 'float (m)',      dflt: '0',          v: [1,2,3], desc: 'Vehicle height for bridge/tunnel clearance. 0 = ignore.' },
  { name: 'vehicleId',                   type: 'string',         dflt: '—',          v: [1,2],   desc: 'TomTom vehicle profile identifier. Loads a pre-defined vehicle profile including consumption curve and connector types.' },
  { name: 'vehicleLength',               type: 'float (m)',      dflt: '0',          v: [1,2,3], desc: 'Vehicle length including any attached equipment. 0 = ignore.' },
  { name: 'vehicleLoadType',             type: 'string (×n)',    dflt: '—',          v: [1,2,3], desc: 'Hazardous cargo classification. Not for bicycle/pedestrian.', values: 'USHazmatClass1–9, otherHazmatExplosive, otherHazmatGeneral, otherHazmatHarmfulToWater' },
  { name: 'vehicleMaxSpeed',             type: 'integer (km/h)', dflt: '0',          v: [1,2,3], desc: 'Maximum vehicle speed in km/h. 0 = auto from road data. Range: 0–250.' },
  { name: 'vehicleWeight',               type: 'integer (kg)',   dflt: '0',          v: [1,2,3], desc: 'Total vehicle weight in kg. 0 = ignore weight restrictions.' },
  { name: 'vehicleWidth',                type: 'float (m)',      dflt: '0',          v: [1,2,3], desc: 'Vehicle width in metres. 0 = ignore width restrictions.' },
];

export default function LDEVRParamIndex({ onNavigate }) {
  const thStyle = {
    padding: '0.5rem 0.75rem', textAlign: 'left', fontSize: '0.6875rem',
    fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase',
    letterSpacing: '0.06em', borderBottom: '2px solid var(--border)',
    background: 'var(--s1)',
  };
  const vBadge = {
    fontSize: '0.625rem', fontWeight: 700, padding: '2px 6px',
    borderRadius: 4, fontFamily: 'var(--font-mono)',
  };

  return (
    <div className="page page--wide">
      <div className="page-header">
        <h1>Parameter Index</h1>
        <PageActions pageId="ldevr-params-ref" pageTitle="Long Distance EV Routing API Parameter Index" />
      </div>
      <p className="quick-answer">
        All Long Distance EV Routing API request parameters in one place — type, default, version availability, and key constraints. Covers the calculateLongDistanceEVRoute endpoint across v1, v2, and v3.
      </p>

      <div className="zone">
        <h2 className="sh" id="all-params">Parameters (A–Z)</h2>
        <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, minWidth: 220 }}>Parameter</th>
                <th style={{ ...thStyle, minWidth: 110 }}>Type</th>
                <th style={{ ...thStyle, minWidth: 80 }}>Default</th>
                <th style={{ ...thStyle, minWidth: 90 }}>Versions</th>
                <th style={{ ...thStyle }}>Description &amp; constraints</th>
              </tr>
            </thead>
            <tbody>
              {PARAM_TABLE.map((p, i) => (
                <tr key={p.name} style={{ background: i % 2 === 0 ? 'var(--bg)' : 'var(--s1)', borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.5rem 0.75rem', verticalAlign: 'top' }}>
                    <code style={{ fontSize: '0.75rem', color: 'var(--brand)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{p.name}</code>
                  </td>
                  <td style={{ padding: '0.5rem 0.75rem', verticalAlign: 'top' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{p.type}</span>
                  </td>
                  <td style={{ padding: '0.5rem 0.75rem', verticalAlign: 'top' }}>
                    <code style={{ fontSize: '0.75rem', color: 'var(--mid)', fontFamily: 'var(--font-mono)' }}>{p.dflt}</code>
                  </td>
                  <td style={{ padding: '0.5rem 0.75rem', verticalAlign: 'top' }}>
                    <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      {p.v.map(n => (
                        <span key={n} style={{ ...vBadge, background: V[n].bg, color: V[n].color }}>v{n}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '0.5rem 0.75rem', verticalAlign: 'top', color: 'var(--text)', lineHeight: 1.5 }}>
                    {p.desc}
                    {p.values && (
                      <div style={{ marginTop: 4, fontSize: '0.75rem', color: 'var(--muted)' }}>
                        Values: <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--mid)', fontSize: '0.75rem' }}>{p.values}</code>
                      </div>
                    )}
                    {p.constraint && (
                      <div style={{ marginTop: 4, fontSize: '0.75rem', color: 'var(--muted)', fontStyle: 'italic' }}>{p.constraint}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="zone">
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="page-action-btn" onClick={() => onNavigate?.('ldevr-calculate-route', 'ldevr')}>Calculate Route</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('ldevr-response-ref', 'ldevr')}>Response Schema</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('ldevr-errors', 'ldevr')}>Error Codes</button>
        </div>
      </div>
    </div>
  );
}
