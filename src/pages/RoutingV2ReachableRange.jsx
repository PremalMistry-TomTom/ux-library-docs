import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';
import PageActions from '../components/ui/PageActions';

/* ─── Budget & origin parameters ─────────────────────────────────────────── */
const PARAMS_BUDGET = [
  { name: 'origin', required: true, type: 'string (path)', desc: 'Origin point as comma-separated latitude,longitude. Example: 52.50931,13.42936' },
  { name: 'contentType', required: true, type: 'string (path)', values: ['json', 'jsonp'], desc: 'Response format.' },
  { name: 'fuelBudgetInLiters', type: 'float', desc: 'Fuel budget in litres. The range boundary marks where the vehicle would run out of fuel. Minimum: 0.5, Maximum: 200,000.' },
  { name: 'energyBudgetInkWh', type: 'float', desc: 'Energy budget in kWh. The range boundary marks where the battery would be depleted.' },
  { name: 'timeBudgetInSec', type: 'integer', desc: 'Time budget in seconds. The range boundary is the set of points reachable within this travel time.' },
  { name: 'distanceBudgetInMeters', type: 'integer', desc: 'Distance budget in metres. The range boundary is the set of points within this driving distance.' },
  { name: 'departureTime', type: 'string (RFC 3339)', desc: 'Departure date/time. Affects traffic modelling. Defaults to now.' },
  { name: 'traffic', type: 'string', default: 'live', values: ['live', 'historical'], desc: 'Traffic model to use. live uses real-time incidents and flow. historical uses IQ Routes patterns only.' },
  { name: 'avoid', type: 'string (repeatable)', values: ['tollRoads', 'motorways', 'ferries', 'unpavedRoads', 'tunnels', 'borderCrossings', 'lowEmissionZones', 'carPools'], desc: 'Road or feature types to exclude from range calculation.' },
  { name: 'travelMode', type: 'string', default: 'car', values: ['car', 'truck', 'taxi', 'bus', 'van', 'motorcycle', 'bicycle', 'pedestrian'], desc: 'Vehicle or transport type.' },
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
  { name: 'vehicleEngineType', type: 'string', default: 'combustion', values: ['combustion', 'electric'], desc: 'Required when using a consumption model.' },
];

/* ─── Combustion consumption ─────────────────────────────────────────────── */
const PARAMS_COMBUSTION = [
  { name: 'constantSpeedConsumptionInLitersPerHundredkm', required: true, type: 'string (speed:consumption pairs)', desc: '1–25 speed/fuel pairs defining the consumption curve. Example: 50,6.3:80,7.1:120,9.0. Requires vehicleEngineType=combustion.' },
  { name: 'currentFuelInLiters', type: 'float', desc: 'Current fuel level in litres. Used to calculate remaining range.' },
  { name: 'auxiliaryPowerInLitersPerHour', type: 'float', desc: 'Additional fuel draw from accessories (AC, heating, etc.).' },
  { name: 'fuelEnergyDensityInMJoulesPerLiter', type: 'float', desc: 'Fuel energy density. Required when using efficiency parameters. Typical: 34.2 (petrol), 35.8 (diesel).' },
  { name: 'accelerationEfficiency', type: 'float', desc: 'Efficiency of kinetic energy conversion during acceleration. Must be paired with decelerationEfficiency. Product of both must be ≤ 1.' },
  { name: 'decelerationEfficiency', type: 'float', desc: 'Energy recovery efficiency during braking. Must be paired with accelerationEfficiency.' },
  { name: 'uphillEfficiency', type: 'float', desc: 'Efficiency going uphill. Must be paired with downhillEfficiency.' },
  { name: 'downhillEfficiency', type: 'float', desc: 'Energy recovery going downhill. Must be paired with uphillEfficiency.' },
];

/* ─── Electric consumption ───────────────────────────────────────────────── */
const PARAMS_ELECTRIC = [
  { name: 'constantSpeedConsumptionInkWhPerHundredkm', required: true, type: 'string (speed:consumption pairs)', desc: '1–25 speed/energy pairs. Example: 50,12.5:100,17.8:130,23.5. Requires vehicleEngineType=electric.' },
  { name: 'currentChargeInkWh', required: true, type: 'float', desc: 'Current battery charge in kWh. Must be paired with maxChargeInkWh.' },
  { name: 'maxChargeInkWh', required: true, type: 'float', desc: 'Total battery capacity in kWh.' },
  { name: 'auxiliaryPowerInkW', type: 'float', desc: 'Continuous power draw from HVAC, infotainment, and accessories.' },
  { name: 'accelerationEfficiency', type: 'float', desc: 'Cannot be combined with altitude-based parameters.' },
  { name: 'decelerationEfficiency', type: 'float', desc: 'Energy recovered during regenerative braking. Pair with accelerationEfficiency.' },
  { name: 'uphillEfficiency', type: 'float', desc: 'Cannot be combined with altitude-based parameters.' },
  { name: 'downhillEfficiency', type: 'float', desc: 'Must be paired with uphillEfficiency.' },
  { name: 'consumptionInkWhPerkmAltitudeGain', type: 'float', desc: 'Energy used per 1 km of altitude gain. Cannot be combined with efficiency parameters.' },
  { name: 'recuperationInkWhPerkmAltitudeLoss', type: 'float', desc: 'Energy recovered per 1 km of altitude loss. Must be paired with consumptionInkWhPerkmAltitudeGain.' },
];

/* ─── POST body ──────────────────────────────────────────────────────────── */
const PARAMS_POST_BODY = [
  {
    name: 'supportingPoints', type: 'object[]',
    desc: 'Ordered list of coordinates for route reconstruction. Each point snaps the calculated route to the road network near that location.',
    children: [
      { name: 'supportingPoints[].latitude', type: 'float', desc: 'Latitude of the supporting point.' },
      { name: 'supportingPoints[].longitude', type: 'float', desc: 'Longitude of the supporting point.' },
    ],
  },
  { name: 'avoidVignette', type: 'string[]', desc: 'Array of ISO 3166-1 alpha-3 country codes whose vignette systems to avoid. Mutually exclusive with allowVignette.' },
  { name: 'allowVignette', type: 'string[]', desc: 'Only avoid vignette toll roads in countries NOT in this list. Mutually exclusive with avoidVignette.' },
  {
    name: 'avoidAreas', type: 'object',
    desc: 'Define rectangular areas to exclude from the range calculation. Max 10 rectangles.',
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
];

/* ─── Response codes ─────────────────────────────────────────────────────── */
const RESPONSE_CODES = [
  { code: '200', title: 'OK', desc: 'The reachable range was calculated. The response body contains the boundary polygon.' },
  { code: '400', title: 'Bad Request', desc: 'One or more parameters are incorrectly specified or mutually exclusive (e.g. more than one budget parameter provided).' },
  { code: '403', title: 'Forbidden', desc: 'Permission or authentication issue — forbidden, not authorized, or account inactive.' },
  { code: '404', title: 'Not Found', desc: 'The requested resource could not be found. May be available again in the future.' },
  { code: '405', title: 'Method Not Allowed', desc: 'The client used an HTTP method other than GET or POST.' },
  { code: '408', title: 'Request Timeout', desc: 'The client took too long to transmit the request.' },
];

/* ─── Response parameters ────────────────────────────────────────────────── */
const PARAMS_RESPONSE = [
  {
    name: 'reachableRange',
    type: 'object',
    desc: 'Top-level container for the reachable range result.',
    children: [
      {
        name: 'reachableRange.center',
        type: 'object',
        desc: 'The origin point used for the calculation.',
        children: [
          { name: 'center.latitude', type: 'float', desc: 'Latitude of the origin point.' },
          { name: 'center.longitude', type: 'float', desc: 'Longitude of the origin point.' },
        ],
      },
      {
        name: 'reachableRange.boundary',
        type: 'object[]',
        desc: 'Array of points forming the polygon boundary of the reachable area.',
        children: [
          { name: 'boundary[].latitude', type: 'float', desc: 'Latitude of the boundary point.' },
          { name: 'boundary[].longitude', type: 'float', desc: 'Longitude of the boundary point.' },
        ],
      },
    ],
  },
];

/* ─── Code examples ──────────────────────────────────────────────────────── */
const CODE_GET = `curl "https://api.tomtom.com/maps/orbis/routing/calculateReachableRange/\\
  52.50931,13.42936/json\\
  ?timeBudgetInSec=1800\\
  &travelMode=car\\
  &traffic=live" \\
  -H "TomTom-Api-Key: YOUR_API_KEY"`;

const CODE_TRUCK = `curl "https://api.tomtom.com/maps/orbis/routing/calculateReachableRange/\\
  52.50931,13.42936/json\\
  ?timeBudgetInSec=3600\\
  &travelMode=truck\\
  &vehicleWeight=24000\\
  &vehicleHeight=4.2\\
  &vehicleEngineType=combustion\\
  &constantSpeedConsumptionInLitersPerHundredkm=50,6.3:80,7.1:120,9.0\\
  &currentFuelInLiters=200" \\
  -H "TomTom-Api-Key: YOUR_API_KEY"`;

const CODE_ELECTRIC = `curl "https://api.tomtom.com/maps/orbis/routing/calculateReachableRange/\\
  52.50931,13.42936/json\\
  ?energyBudgetInkWh=30\\
  &travelMode=car\\
  &vehicleEngineType=electric\\
  &constantSpeedConsumptionInkWhPerHundredkm=50,12.5:100,17.8:130,23.5\\
  &currentChargeInkWh=32\\
  &maxChargeInkWh=50\\
  &auxiliaryPowerInkW=1.5" \\
  -H "TomTom-Api-Key: YOUR_API_KEY"`;

const CODE_POST = `curl -X POST \\
  "https://api.tomtom.com/maps/orbis/routing/calculateReachableRange/\\
  52.50931,13.42936/json?timeBudgetInSec=1800" \\
  -H "TomTom-Api-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "avoidAreas": {
      "rectangles": [{
        "southWestCorner": { "latitude": 52.48, "longitude": 13.41 },
        "northEastCorner":  { "latitude": 52.52, "longitude": 13.46 }
      }]
    }
  }'`;

const CODE_RESPONSE = `{
  "reachableRange": {
    "center": {
      "latitude": 52.50931,
      "longitude": 13.42936
    },
    "boundary": [
      { "latitude": 52.6214, "longitude": 13.3412 },
      { "latitude": 52.6501, "longitude": 13.4298 },
      { "latitude": 52.6423, "longitude": 13.5621 },
      { "latitude": 52.5912, "longitude": 13.6234 },
      { "latitude": 52.4901, "longitude": 13.6198 },
      { "latitude": 52.3987, "longitude": 13.5012 },
      { "latitude": 52.3812, "longitude": 13.3456 }
    ]
  }
}`;

/* ─── Main component ─────────────────────────────────────────────────────── */
export function RoutingV2ReachableRangeContent() {
  const sections = [
    {
      id: 'routing-v2-rr-budget',
      heading: 'Budget & origin',
      method: 'GET',
      note: 'Exactly one budget parameter must be provided. The origin is passed in the URL path. Authentication uses the TomTom-Api-Key header.',
      params: PARAMS_BUDGET,
      code: CODE_GET,
      lang: 'bash',
    },
    {
      id: 'routing-v2-rr-vehicle',
      heading: 'Vehicle profile',
      method: 'GET',
      params: PARAMS_VEHICLE,
      code: CODE_TRUCK,
      lang: 'bash',
    },
    {
      id: 'routing-v2-rr-combustion',
      heading: 'Combustion consumption model',
      method: 'GET',
      note: 'Requires vehicleEngineType=combustion and a fuelBudgetInLiters budget. Enables the fuel-aware range boundary calculation.',
      params: PARAMS_COMBUSTION,
      code: CODE_TRUCK,
      lang: 'bash',
    },
    {
      id: 'routing-v2-rr-electric',
      heading: 'Electric consumption model',
      method: 'GET',
      note: 'Requires vehicleEngineType=electric and energyBudgetInkWh. Returns the area reachable before the battery is depleted.',
      params: PARAMS_ELECTRIC,
      code: CODE_ELECTRIC,
      lang: 'bash',
    },
    {
      id: 'routing-v2-rr-post-body',
      heading: 'POST body',
      method: 'POST',
      note: 'Use a POST body to specify avoid areas or vignette preferences.',
      params: PARAMS_POST_BODY,
      code: CODE_POST,
      lang: 'bash',
    },
    {
      id: 'routing-v2-rr-response',
      heading: 'Response & error codes',
      note: 'The response contains a reachableRange object with the boundary polygon as an array of lat/lon points.',
      params: PARAMS_RESPONSE,
      extra: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
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
    <>
      <p className="quick-answer">Calculate the geographic area reachable from a given origin within a fuel, energy, time, or distance budget. Returns a polygon representing the boundary of the reachable area.</p>
      <ApiRefTwoCol
        sections={sections}
      />
    </>
  );
}

export default function RoutingV2ReachableRange() {
  return (
    <div className="page page--wide">
      <div className="page-header">
        <h1>Reachable Range</h1>
        <PageActions />
      </div>
      <RoutingV2ReachableRangeContent />
    </div>
  );
}
