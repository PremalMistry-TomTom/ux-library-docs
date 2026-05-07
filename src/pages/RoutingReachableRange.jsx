import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Parameter data ─────────────────────────────────────────────────────────── */

const PARAMS_BUDGET = [
  { name: 'origin', required: true, type: 'string (path)', desc: 'Lat,lon of the starting point. Example: 52.509,13.429' },
  { name: 'fuelBudgetInLiters', type: 'float', desc: 'Fuel budget in litres. Requires a combustion consumption model. Returns the area reachable before fuel runs out.' },
  { name: 'energyBudgetInkWh', type: 'float', desc: 'Battery energy budget in kWh. Requires an electric consumption model. Returns the area reachable before the battery is depleted.' },
  { name: 'timeBudgetInSec', type: 'integer', desc: 'Time budget in seconds. Returns all points reachable within this travel time. Most commonly used for isochrone visualisation.' },
  { name: 'distanceBudgetInMeters', type: 'integer', desc: 'Distance budget in metres. Returns all points reachable within this driving distance.' },
  { name: 'travelMode', type: 'string', default: 'car', values: ['car', 'truck', 'taxi', 'bus', 'van', 'motorcycle', 'bicycle', 'pedestrian'], desc: 'Vehicle type used for the calculation. truck enables dimension and weight-based road restrictions.' },
  { name: 'vehicleEngineType', type: 'string', values: ['combustion', 'electric'], desc: 'Required when using a fuel or energy budget. Determines which consumption model applies.' },
  { name: 'routeType', type: 'string', default: 'fastest', values: ['fastest', 'shortest', 'eco'], desc: 'Optimisation objective for roads within the reachable range.' },
  { name: 'traffic', type: 'boolean', default: true, desc: 'Apply real-time and historic traffic to travel time calculations. Affects isochrone shape significantly during peak hours.' },
  { name: 'departAt', type: 'datetime (RFC 3339)', desc: 'Departure time for traffic-aware calculation. Defaults to now.' },
  { name: 'avoid', type: 'string (repeatable)', values: ['motorways', 'tollRoads', 'ferries', 'unpavedRoads', 'tunnels', 'borderCrossings'], desc: 'Road or feature types to exclude from reachable area. Repeatable.' },
  { name: 'report', type: 'string', values: ['effectiveSettings'], desc: 'Include effectiveSettings to confirm which parameter values were applied.' },
];

const PARAMS_VEHICLE = [
  { name: 'vehicleMaxSpeed', type: 'integer (km/h)', desc: '0 = determined from road data. Capped at 250 km/h.' },
  { name: 'vehicleWeight', type: 'integer (kg)', desc: 'Total vehicle weight. Used to filter roads with weight restrictions.' },
  { name: 'vehicleAxleWeight', type: 'integer (kg)', desc: 'Weight per axle for bridge and road restrictions.' },
  { name: 'vehicleLength', type: 'float (metres)', desc: 'Vehicle length for road-width and low-clearance restrictions.' },
  { name: 'vehicleWidth', type: 'float (metres)', desc: 'Vehicle width, rounded to the nearest cm.' },
  { name: 'vehicleHeight', type: 'float (metres)', desc: 'Vehicle height for bridge and tunnel clearance.' },
  { name: 'vehicleCommercial', type: 'boolean', desc: 'Treat as a commercial vehicle for applicable road restrictions.' },
  { name: 'vehicleLoadType', type: 'string (repeatable)', values: ['USHazmatClass1','USHazmatClass2','USHazmatClass3','USHazmatClass4','USHazmatClass5','USHazmatClass6','USHazmatClass7','USHazmatClass8','USHazmatClass9','otherHazmatExplosive','otherHazmatGeneral','otherHazmatHarmfulToWater'], desc: 'Hazardous material classification for routing restrictions.' },
  { name: 'vehicleAdrTunnelRestrictionCode', type: 'string', values: ['B', 'C', 'D', 'E'], desc: 'ADR tunnel restriction code for hazmat transport.' },
  { name: 'hilliness', type: 'string', default: 'normal', values: ['low', 'normal', 'high'], desc: 'Preference for hilly roads.' },
  { name: 'windingness', type: 'string', default: 'normal', values: ['low', 'normal', 'high'], desc: 'Preference for winding roads.' },
];

const PARAMS_COMBUSTION = [
  { name: 'constantSpeedConsumptionInLitersPerHundredkm', required: true, type: 'colon-delimited speed:consumption pairs', desc: '1–25 speed/fuel pairs defining the consumption curve. Example: 50,6.3:80,7.1:120,9.0' },
  { name: 'currentFuelInLiters', type: 'float', desc: 'Current fuel level. Reachable range uses this as the available budget when fuelBudgetInLiters is not set.' },
  { name: 'auxiliaryPowerInLitersPerHour', type: 'float', desc: 'Additional fuel draw from accessories.' },
  { name: 'fuelEnergyDensityInMJoulesPerLiter', type: 'float', desc: 'Fuel energy density. Required when using efficiency parameters.' },
  { name: 'accelerationEfficiency', type: 'float', desc: 'Kinetic energy conversion during acceleration. Product with decelerationEfficiency must be ≤ 1.' },
  { name: 'decelerationEfficiency', type: 'float', desc: 'Energy recovery during braking.' },
  { name: 'uphillEfficiency', type: 'float', desc: 'Efficiency going uphill. Must be paired with downhillEfficiency.' },
  { name: 'downhillEfficiency', type: 'float', desc: 'Energy recovery going downhill.' },
];

const PARAMS_ELECTRIC = [
  { name: 'constantSpeedConsumptionInkWhPerHundredkm', required: true, type: 'colon-delimited speed:consumption pairs', desc: '1–25 speed/energy pairs defining the EV consumption curve. Example: 50,12.5:100,17.8:130,23.5' },
  { name: 'currentChargeInkWh', required: true, type: 'float', desc: 'Current battery charge. Must be paired with maxChargeInkWh.' },
  { name: 'maxChargeInkWh', required: true, type: 'float', desc: 'Battery capacity. Must be paired with currentChargeInkWh.' },
  { name: 'auxiliaryPowerInkW', type: 'float', desc: 'Continuous power draw from HVAC and infotainment.' },
  { name: 'accelerationEfficiency', type: 'float', desc: 'Cannot be combined with altitude-based consumption parameters.' },
  { name: 'decelerationEfficiency', type: 'float', desc: 'Energy recovered via regenerative braking.' },
  { name: 'uphillEfficiency', type: 'float', desc: 'Cannot be combined with altitude-based parameters.' },
  { name: 'downhillEfficiency', type: 'float', desc: 'Must be paired with uphillEfficiency.' },
  { name: 'consumptionInkWhPerkmAltitudeGain', type: 'float', desc: 'Energy used per km of altitude gain. Cannot be combined with efficiency parameters.' },
  { name: 'recuperationInkWhPerkmAltitudeLoss', type: 'float', desc: 'Energy recovered per km of altitude loss.' },
];

/* ─── Response data ─────────────────────────────────────────────────────────── */

const RESPONSE_FIELDS = [
  { name: 'reachableBoundary', type: 'object', desc: 'The reachable area result.', children: [
    { name: 'reachableBoundary.type', type: 'string', desc: 'Always "REACHABLE_RANGE".' },
    { name: 'reachableBoundary.boundary', type: 'GeoPoint[]', desc: 'Ordered polygon vertices forming the outer boundary of the reachable area. Connect the last point back to the first to close the polygon.', children: [
      { name: 'boundary[].latitude',  type: 'float', desc: 'Latitude of this boundary vertex.' },
      { name: 'boundary[].longitude', type: 'float', desc: 'Longitude of this boundary vertex.' },
    ]},
  ]},
  { name: 'report', type: 'object', desc: 'Returned when report=effectiveSettings. Contains the parameter values actually applied.', children: [
    { name: 'report.effectiveSettings', type: 'object[]', desc: 'Array of key/value pairs showing resolved parameter values.' },
  ]},
];

const RANGE_ERRORS = [
  { code: 'MAP_MATCHING_FAILURE',   title: 'Map Matching Failure',    desc: 'The origin coordinate could not be matched to a drivable road. Verify coordinate precision and that the location is accessible.' },
  { code: 'RANGE_NOT_REACHABLE',    title: 'Range Not Reachable',     desc: 'No drivable network exists within the requested budget. Check that the origin is accessible and the budget value is reasonable.' },
  { code: 'BAD_INPUT',              title: 'Bad Input',               desc: 'Invalid or conflicting parameters — e.g., multiple budget types specified, or efficiency parameters combined with altitude parameters.' },
  { code: 'BUDGET_TOO_LARGE',       title: 'Budget Too Large',        desc: 'The requested budget (time, distance, fuel, or energy) exceeds the supported limit and would produce an impractically large polygon.' },
];

const CODE_ERROR = `// HTTP 400 — error response
{
  "formatVersion": "0.0.12",
  "detailedError": {
    "code": "MAP_MATCHING_FAILURE",
    "message": "The origin coordinate could not be matched to the road network.",
    "target": "calculateReachableRange",
    "details": [{
      "code": "InvalidCoordinates",
      "message": "Coordinate is outside the supported routing area.",
      "target": "origin"
    }]
  }
}`;

/* ─── Code examples ──────────────────────────────────────────────────────────── */

const CODE_TIME = `# Isochrone: all points reachable within 30 minutes from Berlin
# Departing at 8am on a weekday — traffic changes the shape significantly

curl "https://api.tomtom.com/routing/1/calculateReachableRange/\\
  52.50931,13.42936/json\\
  ?timeBudgetInSec=1800\\
  &travelMode=car\\
  &traffic=true\\
  &departAt=2025-10-30T08:00:00\\
  &key=YOUR_API_KEY"`;

const CODE_VEHICLE = `# Reachable range for a 20-tonne truck avoiding motorways
# Useful for last-mile delivery planning

curl "https://api.tomtom.com/routing/1/calculateReachableRange/\\
  52.50931,13.42936/json\\
  ?timeBudgetInSec=3600\\
  &travelMode=truck\\
  &vehicleWeight=20000\\
  &vehicleHeight=4.0\\
  &vehicleLength=12.0\\
  &avoid=motorways\\
  &key=YOUR_API_KEY"`;

const CODE_COMBUSTION = `# Reachable range on remaining fuel — petrol vehicle
# Uses current fuel level as the energy budget

curl "https://api.tomtom.com/routing/1/calculateReachableRange/\\
  52.50931,13.42936/json\\
  ?fuelBudgetInLiters=30\\
  &vehicleEngineType=combustion\\
  &constantSpeedConsumptionInLitersPerHundredkm=50,6.3:80,7.1:120,9.0\\
  &auxiliaryPowerInLitersPerHour=0.4\\
  &key=YOUR_API_KEY"`;

const CODE_ELECTRIC = `# EV reachable range — 30 kWh remaining, keep 5 kWh reserve
# energyBudgetInkWh = available charge minus reserve

curl "https://api.tomtom.com/routing/1/calculateReachableRange/\\
  52.50931,13.42936/json\\
  ?energyBudgetInkWh=25\\
  &vehicleEngineType=electric\\
  &constantSpeedConsumptionInkWhPerHundredkm=50,12.5:100,17.8:130,23.5\\
  &currentChargeInkWh=30\\
  &maxChargeInkWh=75\\
  &auxiliaryPowerInkW=1.5\\
  &key=YOUR_API_KEY"`;

const CODE_RESPONSE = `{
  "reachableBoundary": {
    "type": "REACHABLE_RANGE",
    "boundary": [
      { "latitude": 52.571, "longitude": 13.311 },
      { "latitude": 52.565, "longitude": 13.289 },
      { "latitude": 52.548, "longitude": 13.271 },
      { "latitude": 52.524, "longitude": 13.267 },
      { "latitude": 52.498, "longitude": 13.270 },
      { "latitude": 52.476, "longitude": 13.283 },
      { "latitude": 52.458, "longitude": 13.309 },
      { "latitude": 52.448, "longitude": 13.344 },
      { "latitude": 52.449, "longitude": 13.382 },
      { "latitude": 52.462, "longitude": 13.415 },
      { "latitude": 52.484, "longitude": 13.438 },
      { "latitude": 52.509, "longitude": 13.445 },
      { "latitude": 52.535, "longitude": 13.438 },
      { "latitude": 52.557, "longitude": 13.420 },
      { "latitude": 52.570, "longitude": 13.390 },
      { "latitude": 52.574, "longitude": 13.353 },
      { "latitude": 52.571, "longitude": 13.311 }
    ]
  }
}`;

/* ─── Page ───────────────────────────────────────────────────────────────────── */

export default function RoutingReachableRange({ onNavigate }) {
  const sections = [
    {
      id: 'api-rr-budget',
      heading: 'Budget & origin',
      method: 'GET',
      params: PARAMS_BUDGET,
      note: 'Exactly one budget type is required: fuelBudgetInLiters, energyBudgetInkWh, timeBudgetInSec, or distanceBudgetInMeters. Fuel and energy budgets require a matching consumption model.',
      code: CODE_TIME,
    },
    {
      id: 'api-rr-vehicle',
      heading: 'Vehicle profile',
      method: 'GET',
      params: PARAMS_VEHICLE,
      code: CODE_VEHICLE,
    },
    {
      id: 'api-rr-combustion',
      heading: 'Combustion consumption model',
      method: 'GET',
      params: PARAMS_COMBUSTION,
      note: 'Requires vehicleEngineType=combustion. Use fuelBudgetInLiters to define the available range from full. Use currentFuelInLiters without a budget to derive range from the tank state.',
      code: CODE_COMBUSTION,
    },
    {
      id: 'api-rr-electric',
      heading: 'Electric consumption model',
      method: 'GET',
      params: PARAMS_ELECTRIC,
      note: 'Requires vehicleEngineType=electric. Set energyBudgetInkWh to the usable portion of the battery (e.g., currentCharge minus a reserve). Altitude and efficiency parameters are mutually exclusive.',
      code: CODE_ELECTRIC,
    },
  ];

  const responseData = [
    {
      id: 'api-rr-response',
      heading: 'Response',
      params: RESPONSE_FIELDS,
      note: (
        <>
          Returns a <code style={{ fontFamily: 'monospace', color: 'var(--blue)', fontSize: '0.75rem' }}>reachableBoundary</code> object
          with an ordered array of <code style={{ fontFamily: 'monospace', color: 'var(--blue)', fontSize: '0.75rem' }}>boundary</code> points
          forming a closed polygon. Connect the last vertex back to the first to render the isochrone.
        </>
      ),
      extra: (
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)', marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
            Rendering the polygon
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 8 }}>
            {[
              { lib: 'TomTom Maps Web SDK', snippet: 'new tt.Polygon({ coordinates: [boundary.map(p => [p.longitude, p.latitude])] })' },
              { lib: 'Mapbox GL JS', snippet: "map.addLayer({ type: 'fill', source: { type: 'geojson', data: { type: 'Feature', geometry: { type: 'Polygon', coordinates: [...] } } } })" },
              { lib: 'Android SDK', snippet: 'TomtomPolygon(boundary.map { LatLng(it.latitude, it.longitude) })' },
              { lib: 'GeoJSON', snippet: '{ "type": "Polygon", "coordinates": [ boundary.map(p => [p.longitude, p.latitude]) ] }' },
            ].map(({ lib, snippet }) => (
              <div key={lib} style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '8px 12px', background: 'var(--bg)' }}>
                <code style={{ fontSize: '0.875rem', fontFamily: 'monospace', color: 'var(--blue)', fontWeight: 700 }}>{lib}</code>
                <div style={{ fontSize: '0.5rem', color: 'var(--muted)', marginTop: 4, lineHeight: 1.5, fontFamily: 'monospace', wordBreak: 'break-all' }}>{snippet}</div>
              </div>
            ))}
          </div>
        </div>
      ),
      code: CODE_RESPONSE,
      lang: 'json',
    },
    {
      id: 'api-rr-errors',
      heading: 'Error codes',
      params: [],
      note: 'When a request fails the API returns an HTTP error status and a JSON body describing the problem.',
      extra: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
          {RANGE_ERRORS.map(e => (
            <div key={e.code} style={{
              display: 'flex', alignItems: 'flex-start', gap: 14,
              padding: '12px 14px', borderRadius: 20,
              border: '1px solid var(--border)', background: 'var(--bg)',
            }}>
              <span style={{
                fontSize: '0.875rem', fontWeight: 700, padding: '3px 9px',
                borderRadius: 20, background: 'rgba(226,0,26,0.08)',
                color: '#e2001a', fontFamily: 'monospace', letterSpacing: '0.02em',
                flexShrink: 0, marginTop: 1, whiteSpace: 'nowrap',
              }}>{e.code}</span>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)', marginBottom: 4 }}>{e.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.6 }}>{e.desc}</div>
              </div>
            </div>
          ))}
        </div>
      ),
      code: CODE_ERROR,
      lang: 'json',
    },
  ];

  return (
    <div className="page page--wide">
      <div className="page-header">
        <h1>Reachable Range</h1>
        <PageActions />
      </div>

      <p className="quick-answer">
        Returns an isochrone polygon — all points reachable from an origin within a given time, distance, fuel, or energy budget.
        Use it to visualise delivery zones, service areas, or EV range on a map.
      </p>

      <Callout type="info">
        Exactly one budget type is required per request. Fuel and energy budgets require a matching consumption model
        (<code style={{ fontFamily: 'monospace' }}>vehicleEngineType</code> + consumption curve parameters).
      </Callout>

      <div className="zone">
        <ApiRefTwoCol sections={sections} panelLabel="Example" />
      </div>

      <div className="zone">
        <h2 className="sh" id="rr-response">Response</h2>
        <ApiRefTwoCol sections={responseData} panelLabel="Response example" />
      </div>

      <div className="zone">
        <h2 className="sh" id="rr-model-scope">What the API models — and what it doesn't</h2>
        <p className="body">
          The accuracy of the returned polygon depends directly on the quality of the consumption model you supply.
          Several real-world factors are intentionally left to the caller — this section clarifies the boundary.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12, marginTop: 4 }}>
          {[
            {
              topic: 'Ambient temperature',
              status: 'caller',
              body: 'Temperature is not a direct input. Model it by adjusting your consumption curve per-request — higher kWh/100 km values in cold or hot conditions. This gives you full control over how aggressively temperature degrades range.',
            },
            {
              topic: 'Battery degradation',
              status: 'caller',
              body: 'Pass current usable capacity in maxChargeInkWh, not nameplate. TomTom uses whatever values you provide — accounting for pack ageing, cell wear, and usable SoC window is your responsibility before calling the API.',
            },
            {
              topic: 'PHEV (combined range)',
              status: 'workaround',
              body: 'There is no single-call PHEV mode. Issue two requests — one with vehicleEngineType=electric and one with vehicleEngineType=combustion — then composite the two polygons client-side. The battery-only polygon is the inner bound; the combined range is the outer.',
            },
            {
              topic: 'Dynamic HVAC load',
              status: 'static',
              body: 'auxiliaryPowerInkW accepts a fixed continuous draw per request. Dynamic HVAC modelling (varying load by zone, speed, or cabin temperature delta) is not supported — encode a representative steady-state value or issue separate requests for different load scenarios.',
            },
            {
              topic: 'Elevation: consumption vs road selection',
              status: 'both',
              body: 'When you supply consumptionInkWhPerkmAltitudeGain / recuperationInkWhPerkmAltitudeLoss, elevation affects both consumption estimates and road selection — hillier candidate routes cost more energy and may be excluded. The two effects are not separable.',
            },
            {
              topic: 'Range confidence / accuracy',
              status: 'none',
              body: 'The API returns no confidence score or accuracy band. Polygon fidelity depends on the resolution of your consumption curve — more speed/consumption pairs means better accuracy. Typical production deployments see ±5–15% depending on model quality.',
            },
          ].map(({ topic, status, body }) => {
            const badge = {
              caller:     { label: 'Caller responsibility', bg: 'rgba(59,130,246,0.08)',  color: '#2563eb' },
              workaround: { label: 'Workaround available',  bg: 'rgba(245,158,11,0.08)',  color: '#b45309' },
              static:     { label: 'Static only',           bg: 'rgba(100,116,139,0.08)', color: '#475569' },
              both:       { label: 'Both',                  bg: 'rgba(16,185,129,0.08)',  color: '#047857' },
              none:       { label: 'Not exposed',           bg: 'rgba(226,0,26,0.08)',    color: '#e2001a' },
            }[status];
            return (
              <div key={topic} style={{ border: '1px solid var(--border)', borderRadius: 20, padding: '16px 18px', background: 'var(--surface, var(--white))' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--black)', lineHeight: 1.3 }}>{topic}</span>
                  <span style={{ fontSize: '0.625rem', fontWeight: 700, padding: '2px 7px', borderRadius: 99, background: badge.bg, color: badge.color, whiteSpace: 'nowrap', flexShrink: 0 }}>{badge.label}</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.6, margin: 0 }}>{body}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="zone" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className="page-action-btn" onClick={() => onNavigate?.('routing-calculate-route')}>
          Calculate Route →
        </button>
        <button className="page-action-btn" onClick={() => onNavigate?.('routing-batch')}>
          Batch Routing →
        </button>
      </div>
    </div>
  );
}
