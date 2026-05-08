import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';
import PrivatePreviewBanner from '../components/ui/PrivatePreviewBanner';

/* ─── Budget & origin ────────────────────────────────────────────────────── */
const PARAMS_BUDGET = [
  { name: 'origin', required: true, type: 'string (path)', desc: 'Origin point as comma-separated latitude,longitude. Example: 52.50931,13.42936' },
  { name: 'contentType', required: true, type: 'string (path)', values: ['json'], desc: 'Response format. Currently only json is supported.' },
  { name: 'fuelBudgetInLiters', type: 'float', desc: 'Fuel budget in litres. The range boundary marks where the vehicle would run out of fuel.' },
  { name: 'energyBudgetInkWh', type: 'float', desc: 'Energy budget in kWh for electric vehicles.' },
  { name: 'timeBudgetInSec', type: 'integer', desc: 'Time budget in seconds. The boundary is the set of points reachable within this travel time.' },
  { name: 'distanceBudgetInMeters', type: 'integer', desc: 'Distance budget in metres.' },
  { name: 'departAt', type: 'datetime (RFC 3339)', desc: 'Departure time for traffic modelling. Defaults to now.' },
  { name: 'routeType', type: 'string', default: 'fastest', values: ['fastest', 'shortest', 'eco', 'thrilling'], desc: 'Optimisation objective used when extending routes to compute the range boundary.' },
  { name: 'traffic', type: 'boolean', default: true, desc: 'Use real-time and historic traffic data.' },
  { name: 'avoid', type: 'string (repeatable)', values: ['tollRoads', 'motorways', 'ferries', 'unpavedRoads', 'tunnels', 'borderCrossings', 'lowEmissionZones', 'carPools'], desc: 'Road or feature types to exclude when computing the range.' },
  { name: 'travelMode', type: 'string', default: 'car', values: ['car', 'truck', 'taxi', 'bus', 'van', 'motorcycle', 'bicycle', 'pedestrian'], desc: 'Vehicle type used for routing.' },
  { name: 'hilliness', type: 'string', default: 'normal', values: ['low', 'normal', 'high'], desc: 'Preference for hilly routes. Only applicable with routeType=thrilling.' },
  { name: 'windingness', type: 'string', default: 'normal', values: ['low', 'normal', 'high'], desc: 'Preference for winding roads. Only applicable with routeType=thrilling.' },
];

/* ─── Vehicle profile ────────────────────────────────────────────────────── */
const PARAMS_VEHICLE = [
  { name: 'vehicleMaxSpeed', type: 'integer (km/h)', desc: 'Maximum vehicle speed. 0 = determined from road data. Range 0–250.' },
  { name: 'vehicleWeight', type: 'integer (kg)', desc: 'Total vehicle weight. Used for bridge and road weight restrictions.' },
  { name: 'vehicleAxleWeight', type: 'integer (kg)', desc: 'Weight per axle. Used with truck routing.' },
  { name: 'numberOfAxles', type: 'integer', desc: 'Total number of axles.' },
  { name: 'vehicleLength', type: 'float (metres)', desc: 'Vehicle length for low-clearance and road-width restrictions.' },
  { name: 'vehicleWidth', type: 'float (metres)', desc: 'Vehicle width, rounded to the nearest cm.' },
  { name: 'vehicleHeight', type: 'float (metres)', desc: 'Vehicle height for bridge and tunnel clearance.' },
  { name: 'vehicleCommercial', type: 'boolean', desc: 'Mark as a commercial vehicle to apply relevant road restrictions.' },
  { name: 'vehicleLoadType', type: 'string (repeatable)', values: ['USHazmatClass1', 'USHazmatClass2', 'USHazmatClass3', 'USHazmatClass4', 'USHazmatClass5', 'USHazmatClass6', 'USHazmatClass7', 'USHazmatClass8', 'USHazmatClass9', 'otherHazmatExplosive', 'otherHazmatGeneral', 'otherHazmatHarmfulToWater'], desc: 'Hazardous material classification for routing restrictions.' },
  { name: 'vehicleAdrTunnelRestrictionCode', type: 'string', values: ['B', 'C', 'D', 'E'], desc: 'ADR tunnel restriction code for hazmat transport.' },
  { name: 'vehicleEngineType', type: 'string', values: ['combustion', 'electric', 'mild_hybrid', 'full_hybrid', 'plug_in_hybrid', 'hydrogen'], desc: 'Engine type. Required when using a consumption model.' },
];

/* ─── Combustion consumption ─────────────────────────────────────────────── */
const PARAMS_COMBUSTION = [
  { name: 'constantSpeedConsumptionInLitersPerHundredkm', required: true, type: 'string (speed:consumption pairs)', desc: '1–25 speed/fuel pairs defining the consumption curve. Example: 50,6.3:80,7.1:120,9.0. Requires vehicleEngineType=combustion.' },
  { name: 'currentFuelInLiters', type: 'float', desc: 'Current fuel level in litres. The range boundary is the set of reachable points before the tank reaches 0.' },
  { name: 'auxiliaryPowerInLitersPerHour', type: 'float', desc: 'Additional fuel draw from accessories (AC, heating, etc.).' },
  { name: 'fuelEnergyDensityInMJoulesPerLiter', type: 'float', desc: 'Fuel energy density. Required when using efficiency parameters. Typical: 34.2 (petrol), 35.8 (diesel).' },
  { name: 'accelerationEfficiency', type: 'float', desc: 'Efficiency of kinetic energy conversion during acceleration. Must be paired with decelerationEfficiency.' },
  { name: 'decelerationEfficiency', type: 'float', desc: 'Energy recovery efficiency during braking. Must be paired with accelerationEfficiency.' },
  { name: 'uphillEfficiency', type: 'float', desc: 'Efficiency going uphill. Must be paired with downhillEfficiency.' },
  { name: 'downhillEfficiency', type: 'float', desc: 'Energy recovery going downhill. Must be paired with uphillEfficiency.' },
];

/* ─── Electric consumption ───────────────────────────────────────────────── */
const PARAMS_ELECTRIC = [
  { name: 'constantSpeedConsumptionInkWhPerHundredkm', required: true, type: 'string (speed:consumption pairs)', desc: '1–25 speed/energy pairs. Example: 50,12.5:100,17.8:130,23.5. Requires vehicleEngineType=electric.' },
  { name: 'currentChargeInkWh', required: true, type: 'float', desc: 'Must be ≤ maxChargeInkWh. The range boundary is computed until this hits 0.' },
  { name: 'maxChargeInkWh', required: true, type: 'float', desc: 'Total battery capacity in kWh.' },
  { name: 'auxiliaryPowerInkW', type: 'float', desc: 'Continuous power draw from HVAC, infotainment, and accessories.' },
  { name: 'accelerationEfficiency', type: 'float', desc: 'Cannot be combined with altitude-based parameters.' },
  { name: 'decelerationEfficiency', type: 'float', desc: 'Energy recovered during regenerative braking. Pair with accelerationEfficiency.' },
  { name: 'uphillEfficiency', type: 'float', desc: 'Cannot be combined with altitude-based parameters.' },
  { name: 'downhillEfficiency', type: 'float', desc: 'Must be paired with uphillEfficiency.' },
];

/* ─── POST body ──────────────────────────────────────────────────────────── */
const PARAMS_POST_BODY = [
  {
    name: 'origin', type: 'object',
    desc: 'Origin point. Can be provided here instead of the URL path.',
    children: [
      { name: 'origin.latitude',  type: 'float', desc: 'Latitude of the origin point.' },
      { name: 'origin.longitude', type: 'float', desc: 'Longitude of the origin point.' },
    ],
  },
  {
    name: 'avoidAreas', type: 'object',
    desc: 'Rectangular areas to exclude from the range calculation. Max 10 rectangles.',
    children: [
      {
        name: 'avoidAreas.rectangles', type: 'object[]',
        desc: 'Array of rectangular exclusion zones.',
        children: [
          { name: 'rectangles[].southWestCorner', type: 'GeoPoint', desc: 'South-west (bottom-left) corner of the avoid rectangle.' },
          { name: 'rectangles[].northEastCorner', type: 'GeoPoint', desc: 'North-east (top-right) corner. Must have higher lat/lon than southWestCorner.' },
        ],
      },
    ],
  },
  { name: 'avoidVignette', type: 'string[]', desc: 'Array of ISO 3166-1 alpha-3 country codes whose vignette systems to avoid. Mutually exclusive with allowVignette.' },
  { name: 'allowVignette', type: 'string[]', desc: 'Only avoid vignette toll roads in countries NOT in this list. Mutually exclusive with avoidVignette.' },
];

/* ─── Response schema ────────────────────────────────────────────────────── */
const RESPONSE_FIELDS = [
  { field: 'reachableRange.center.latitude',  type: 'float', desc: 'Latitude of the origin point echoed back in the response.' },
  { field: 'reachableRange.center.longitude', type: 'float', desc: 'Longitude of the origin point echoed back in the response.' },
  { field: 'reachableRange.boundary',         type: 'array', desc: 'Ordered array of {latitude, longitude} objects describing the polygon perimeter, ordered clockwise.' },
];

const RESPONSE_CODES = [
  { code: '200', title: 'OK',                   desc: 'A reachable range polygon was computed. The response body contains the boundary array.' },
  { code: '400', title: 'Bad Request',           desc: 'One or more parameters are invalid. Common causes: origin not near a road, no range polygon found, or no budget parameter was provided.' },
  { code: '403', title: 'Forbidden',             desc: 'Permission or authentication issue — forbidden, not authorized, or account inactive.' },
  { code: '404', title: 'Not Found',             desc: 'The requested resource could not be found. May be available again in the future.' },
  { code: '405', title: 'Method Not Allowed',    desc: 'The client used an HTTP method other than GET or POST.' },
  { code: '408', title: 'Timeout',               desc: 'The server timed out while computing the reachable range. Try a smaller budget or simpler avoid constraints.' },
  { code: '429', title: 'Too Many Requests',     desc: 'Rate limit exceeded. Reduce request frequency or contact TomTom to increase your quota.' },
  { code: '500', title: 'Internal Server Error', desc: 'An unexpected server-side error occurred. Retry with exponential back-off.' },
];

/* ─── Code examples ──────────────────────────────────────────────────────── */
const CODE_GET = `# Routing API v3 — Reachable Range (GET)
# Endpoint: /routing/1/calculateReachableRange/{origin}/{contentType}

curl "https://api.tomtom.com/routing/1/calculateReachableRange/\\
  52.50931,13.42936/json\\
  ?timeBudgetInSec=3600\\
  &travelMode=car\\
  &traffic=true\\
  &routeType=fastest" \\
  -H "TomTom-Api-Key: YOUR_API_KEY"`;

const CODE_ELECTRIC = `# EV reachable range — energy budget

curl "https://api.tomtom.com/routing/1/calculateReachableRange/\\
  52.50931,13.42936/json\\
  ?energyBudgetInkWh=40\\
  &vehicleEngineType=electric\\
  &constantSpeedConsumptionInkWhPerHundredkm=50,12.5:100,17.8:130,23.5\\
  &currentChargeInkWh=40\\
  &maxChargeInkWh=50\\
  &auxiliaryPowerInkW=1.2" \\
  -H "TomTom-Api-Key: YOUR_API_KEY"`;

const CODE_COMBUSTION = `# Combustion reachable range — fuel budget

curl "https://api.tomtom.com/routing/1/calculateReachableRange/\\
  52.50931,13.42936/json\\
  ?fuelBudgetInLiters=30\\
  &vehicleEngineType=combustion\\
  &constantSpeedConsumptionInLitersPerHundredkm=50,6.3:80,7.1:120,9.0\\
  &currentFuelInLiters=30\\
  &auxiliaryPowerInLitersPerHour=0.5" \\
  -H "TomTom-Api-Key: YOUR_API_KEY"`;

const CODE_POST = `# POST body — origin object + avoid area

curl -X POST \\
  "https://api.tomtom.com/routing/1/calculateReachableRange/origin/json" \\
  -H "TomTom-Api-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "origin": { "latitude": 52.50931, "longitude": 13.42936 },
    "avoidAreas": {
      "rectangles": [{
        "southWestCorner": { "latitude": 52.48, "longitude": 13.41 },
        "northEastCorner":  { "latitude": 52.52, "longitude": 13.46 }
      }]
    },
    "avoidVignette": ["AUT", "CHE"]
  }'`;

const CODE_RESPONSE = `// HTTP 200 — reachable range polygon
{
  "reachableRange": {
    "center": {
      "latitude": 52.50931,
      "longitude": 13.42936
    },
    "boundary": [
      { "latitude": 52.57341, "longitude": 13.42936 },
      { "latitude": 52.56204, "longitude": 13.56731 },
      { "latitude": 52.50931, "longitude": 13.61084 },
      { "latitude": 52.45658, "longitude": 13.56731 },
      { "latitude": 52.44521, "longitude": 13.42936 },
      { "latitude": 52.45658, "longitude": 13.29141 },
      { "latitude": 52.50931, "longitude": 13.24788 },
      { "latitude": 52.56204, "longitude": 13.29141 }
    ]
  }
}`;

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function RoutingV3ReachableRange() {
  const sections = [
    {
      id: 'routing-v3-rr-budget',
      heading: 'Budget & origin',
      method: 'GET',
      note: 'One budget parameter is required. The origin is specified in the URL path as latitude,longitude. The API computes the reachable area by extending routes in all directions until the budget is consumed.',
      params: PARAMS_BUDGET,
      code: CODE_GET,
      lang: 'bash',
    },
    {
      id: 'routing-v3-rr-vehicle',
      heading: 'Vehicle profile',
      method: 'GET',
      params: PARAMS_VEHICLE,
      code: CODE_GET,
      lang: 'bash',
    },
    {
      id: 'routing-v3-rr-combustion',
      heading: 'Combustion consumption model',
      method: 'GET',
      params: PARAMS_COMBUSTION,
      code: CODE_COMBUSTION,
      lang: 'bash',
    },
    {
      id: 'routing-v3-rr-electric',
      heading: 'Electric consumption model',
      method: 'GET',
      params: PARAMS_ELECTRIC,
      code: CODE_ELECTRIC,
      lang: 'bash',
    },
    {
      id: 'routing-v3-rr-post-body',
      heading: 'POST body',
      method: 'POST',
      note: 'POST body for avoid areas and vignette control. The origin can also be specified in the POST body as an object.',
      params: PARAMS_POST_BODY,
      code: CODE_POST,
      lang: 'bash',
    },
    {
      id: 'routing-v3-rr-response',
      heading: 'Response & error codes',
      params: [],
      note: 'The response contains a reachableRange object with a center point and a boundary polygon.',
      extra: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
          {/* Response schema fields */}
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--mid)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
            Response fields
          </div>
          {RESPONSE_FIELDS.map(f => (
            <div key={f.field} style={{
              display: 'flex', alignItems: 'flex-start', gap: 14,
              padding: '12px 14px', borderRadius: 20,
              border: '1px solid var(--border)', background: 'var(--bg)',
            }}>
              <span style={{
                fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                background: 'rgba(0,122,255,0.07)',
                color: '#005cc5',
                fontFamily: 'monospace', flexShrink: 0, marginTop: 2, whiteSpace: 'nowrap',
              }}>{f.type}</span>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)', marginBottom: 4, fontFamily: 'monospace' }}>{f.field}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            </div>
          ))}
          {/* Spacer */}
          <div style={{ height: 8 }} />
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--mid)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
            HTTP status codes
          </div>
          {RESPONSE_CODES.map(e => (
            <div key={e.code} style={{
              display: 'flex', alignItems: 'flex-start', gap: 14,
              padding: '12px 14px', borderRadius: 20,
              border: '1px solid var(--border)', background: 'var(--bg)',
            }}>
              <span style={{
                fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                background: e.code === '200' ? 'rgba(34,197,94,0.08)' : 'rgba(226,0,26,0.08)',
                color: e.code === '200' ? '#15803d' : '#e2001a',
                fontFamily: 'monospace', flexShrink: 0, marginTop: 2, whiteSpace: 'nowrap',
              }}>{e.code}</span>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)', marginBottom: 4 }}>{e.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.6 }}>{e.desc}</div>
              </div>
            </div>
          ))}
        </div>
      ),
      code: CODE_RESPONSE,
      lang: 'json',
    },
  ];

  return (
    <ApiRefTwoCol
      title="Reachable Range"
      description="Calculate a polygon showing all reachable locations within a time, distance, fuel, or energy budget from an origin point. Returns a boundary array of lat/lon coordinates forming the isochrone polygon."
      version="v3-private"
      topBanner={<PrivatePreviewBanner api="Routing API v3" />}
      sections={sections}
    />
  );
}
