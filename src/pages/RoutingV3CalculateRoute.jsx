import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Request parameters ─────────────────────────────────────────────────── */
const PARAMS_ROUTE = [
  { name: 'locations', required: true, type: 'string (path)', desc: 'Colon-separated lat,lon pairs. Minimum 2 points (origin + destination). Up to 150 intermediate waypoints. Example: 52.509,13.429:52.503,13.439' },
  { name: 'contentType', required: true, type: 'string (path)', values: ['json', 'jsonp'], desc: 'Response format. Use json for standard requests, jsonp when a callback function name is provided.' },
  { name: 'routeType', type: 'string', default: 'fastest', values: ['fastest', 'shortest', 'eco', 'thrilling'], desc: 'Optimisation objective. thrilling maximises winding roads and hills; requires hilliness and windingness.' },
  { name: 'travelMode', type: 'string', default: 'car', values: ['car', 'truck', 'taxi', 'bus', 'van', 'motorcycle', 'bicycle', 'pedestrian'], desc: 'Vehicle type. bus, motorcycle, taxi, and van are BETA.' },
  { name: 'traffic', type: 'boolean', default: true, desc: 'Use real-time and historic traffic. Set false to ignore live incidents (IQ Routes patterns still apply).' },
  { name: 'departAt', type: 'datetime (RFC 3339)', desc: 'Departure date/time. Defaults to now. Cannot be combined with arriveAt.' },
  { name: 'arriveAt', type: 'datetime (RFC 3339)', desc: 'Desired arrival time. Cannot be combined with departAt.' },
  { name: 'maxAlternatives', type: 'integer', default: 0, desc: 'Number of alternative routes (0–5). Cannot combine with computeBestOrder=true.' },
  { name: 'avoid', type: 'string (repeatable)', values: ['tollRoads', 'motorways', 'ferries', 'unpavedRoads', 'tunnels', 'borderCrossings', 'lowEmissionZones', 'carPools', 'alreadyUsedRoads'], desc: 'Road or feature types to avoid. Repeatable: &avoid=motorways&avoid=tollRoads' },
  { name: 'hilliness', type: 'string', default: 'normal', values: ['low', 'normal', 'high'], desc: 'Preference for hilly routes. Only applicable with routeType=thrilling.' },
  { name: 'windingness', type: 'string', default: 'normal', values: ['low', 'normal', 'high'], desc: 'Preference for winding roads. Only applicable with routeType=thrilling.' },
  { name: 'instructionsType', type: 'string', values: ['coded', 'text', 'tagged'], desc: 'Activates turn-by-turn guidance. tagged wraps street names in XML-style tags for custom rendering.' },
  { name: 'language', type: 'string (IETF)', default: 'en-GB', desc: 'Language for turn-by-turn instruction text and street name localisation.' },
  { name: 'routeRepresentation', type: 'string', default: 'polyline', values: ['polyline', 'encodedPolyline', 'summaryOnly', 'none'], desc: 'Shape of the route in the response. none requires computeBestOrder=true.' },
  { name: 'computeBestOrder', type: 'boolean', default: false, desc: 'Optimise waypoint visit order. Cannot be combined with maxAlternatives > 0.' },
  { name: 'computeTravelTimeFor', type: 'string', default: 'none', values: ['none', 'all'], desc: 'When set to all, the response includes noTraffic, historicTraffic, and liveTrafficIncidents travel time variants.' },
  { name: 'vehicleHeading', type: 'integer (0–359)', desc: 'Current heading of the vehicle in degrees. Used to improve snap-to-road accuracy at route start.' },
  { name: 'sectionType', type: 'string (repeatable)', values: ['carTrain', 'country', 'ferry', 'motorway', 'pedestrian', 'roadType', 'speedLimit', 'tollRoad', 'tunnel', 'traffic', 'travelMode', 'vehicle', 'zones', 'carpool', 'importantRoadStretch', 'roadShields', 'lanes'], desc: 'Which section types to include in the response. Repeatable.' },
  { name: 'report', type: 'string', values: ['effectiveSettings'], desc: 'Include effectiveSettings in the response to see which values were actually applied.' },
];

const PARAMS_HEADERS = [
  { name: 'TomTom-Api-Key', required: true, type: 'string (header)', desc: 'Your TomTom API key. Passed as a request header in v3 rather than as a query parameter.' },
  { name: 'Tracking-ID', type: 'string (header)', desc: 'Optional request identifier. Echoed back in the Tracking-ID response header.' },
  { name: 'Content-Type', type: 'string (header)', desc: 'Required for POST requests: application/json.' },
  { name: 'Authorization', type: 'string (header)', desc: 'Bearer token for OAuth authentication.' },
  { name: 'Accept-Language', type: 'string (header)', desc: 'Language code for guidance text.' },
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
      { name: 'supportingPoints[].latitude',  type: 'float', desc: 'Latitude of the supporting point.' },
      { name: 'supportingPoints[].longitude', type: 'float', desc: 'Longitude of the supporting point.' },
    ],
  },
  { name: 'avoidVignette', type: 'string[]', desc: 'Array of ISO 3166-1 alpha-3 country codes whose vignette systems to avoid. Mutually exclusive with allowVignette.' },
  { name: 'allowVignette', type: 'string[]', desc: 'Only avoid vignette toll roads in countries NOT in this list. Mutually exclusive with avoidVignette.' },
  {
    name: 'avoidAreas', type: 'object',
    desc: 'Define rectangular areas to exclude from the route. Max 10 rectangles.',
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
  { name: 'encodedPolyline', type: 'string', desc: 'Compressed polyline for route reconstruction. Use with encodedPolylinePrecision (5 or 7).' },
  {
    name: 'legs', type: 'object[]',
    desc: 'Per-leg parameter overrides. Each leg can specify its own routeType, avoid rules, supportingPoints, and stop behaviour.',
    children: [
      { name: 'legs[].routeType',        type: 'string', values: ['fastest', 'shortest', 'eco', 'thrilling'], desc: 'Override the route type for this leg only.' },
      { name: 'legs[].avoids',           type: 'string[]', desc: 'Road features to avoid on this leg.' },
      { name: 'legs[].supportingPoints', type: 'GeoPoint[]', desc: 'Coordinates for route reconstruction on this leg only.' },
      { name: 'legs[].routeStop', type: 'object', desc: 'Stop behaviour at the end of this leg.', children: [
        { name: 'routeStop.stopType',        type: 'string', values: ['VIA_POINT', 'CHARGING_STOP'], desc: 'VIA_POINT is a pass-through waypoint; CHARGING_STOP adds EV dwell time.' },
        { name: 'routeStop.passThroughTime', type: 'integer (seconds)', desc: 'Dwell time before continuing. Default: 0.' },
        { name: 'routeStop.entryPoints',     type: 'GeoPoint[]', desc: 'Preferred approach directions, ordered by priority.' },
      ]},
    ],
  },
];

/* ─── Response errors ────────────────────────────────────────────────────── */
const RESPONSE_CODES = [
  { code: '200', title: 'OK',                       desc: 'A route was calculated. The response body contains the route data.' },
  { code: '400', title: 'Bad Request',               desc: 'One or more parameters are incorrectly specified, mutually exclusive, or the route points are not connected by the road network.' },
  { code: '403', title: 'Forbidden',                 desc: 'Permission or authentication issue — forbidden, not authorized, or account inactive.' },
  { code: '404', title: 'Not Found',                 desc: 'The requested resource could not be found. May be available again in the future.' },
  { code: '405', title: 'Method Not Allowed',        desc: 'The client used an HTTP method other than GET or POST.' },
  { code: '408', title: 'Request Timeout',           desc: 'The client took too long to transmit the request.' },
  { code: '414', title: 'URI Too Long',              desc: 'The requested URI is too long. Use the POST body for long parameter lists.' },
  { code: '415', title: 'Unsupported Media Type',    desc: 'The Content-Type header is not supported.' },
  { code: '429', title: 'Too Many Requests',         desc: 'Rate limit exceeded. Reduce request frequency or contact TomTom to increase your quota.' },
  { code: '500', title: 'Internal Server Error',     desc: 'An unexpected server-side error occurred. Retry with exponential back-off.' },
];

/* ─── Code examples ──────────────────────────────────────────────────────── */
const CODE_GET = `# Routing API v3 — Calculate Route (GET)
# Endpoint: /routing/1/calculateRoute/{locations}/{contentType}

curl "https://api.tomtom.com/routing/1/calculateRoute/\\
  52.50931,13.42936:52.50274,13.43872/json\\
  ?routeType=fastest\\
  &traffic=true\\
  &travelMode=car\\
  &language=en-GB\\
  &maxAlternatives=2\\
  &instructionsType=text\\
  &sectionType=traffic&sectionType=lanes" \\
  -H "TomTom-Api-Key: YOUR_API_KEY"`;

const CODE_TRUCK = `# Truck routing with weight, height and hazmat restrictions

curl "https://api.tomtom.com/routing/1/calculateRoute/\\
  52.50931,13.42936:52.50274,13.43872/json\\
  ?travelMode=truck\\
  &vehicleWeight=24000\\
  &vehicleAxleWeight=8000\\
  &vehicleHeight=4.2\\
  &vehicleWidth=2.55\\
  &vehicleLength=16.5\\
  &vehicleCommercial=true\\
  &vehicleLoadType=USHazmatClass3\\
  &vehicleAdrTunnelRestrictionCode=D" \\
  -H "TomTom-Api-Key: YOUR_API_KEY"`;

const CODE_COMBUSTION = `# Combustion consumption model (L/100 km at 3 speed points)

curl "https://api.tomtom.com/routing/1/calculateRoute/\\
  52.50931,13.42936:52.50274,13.43872/json\\
  ?vehicleEngineType=combustion\\
  &constantSpeedConsumptionInLitersPerHundredkm=50,6.3:80,7.1:120,9.0\\
  &currentFuelInLiters=45\\
  &auxiliaryPowerInLitersPerHour=0.5\\
  &fuelEnergyDensityInMJoulesPerLiter=34.2" \\
  -H "TomTom-Api-Key: YOUR_API_KEY"`;

const CODE_ELECTRIC = `# EV consumption curve (kWh/100 km at 3 speed points)

curl "https://api.tomtom.com/routing/1/calculateRoute/\\
  52.50931,13.42936:52.50274,13.43872/json\\
  ?vehicleEngineType=electric\\
  &constantSpeedConsumptionInkWhPerHundredkm=50,12.5:100,17.8:130,23.5\\
  &currentChargeInkWh=32\\
  &maxChargeInkWh=50\\
  &auxiliaryPowerInkW=1.5\\
  &decelerationEfficiency=0.33" \\
  -H "TomTom-Api-Key: YOUR_API_KEY"`;

const CODE_POST = `# POST body — avoid area + per-leg overrides

curl -X POST \\
  "https://api.tomtom.com/routing/1/calculateRoute/\\
  52.50931,13.42936:52.50274,13.43872/json" \\
  -H "TomTom-Api-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "avoidAreas": {
      "rectangles": [{
        "southWestCorner": { "latitude": 52.48, "longitude": 13.41 },
        "northEastCorner":  { "latitude": 52.52, "longitude": 13.46 }
      }]
    },
    "legs": [
      {
        "routeType": "eco",
        "routeStop": { "stopType": "VIA_POINT", "passThroughTime": 300 }
      }
    ]
  }'`;

const CODE_RESPONSE = `// HTTP 200 — route summary
{
  "routes": [{
    "summary": {
      "lengthInMeters": 1879,
      "travelTimeInSeconds": 396,
      "trafficDelayInSeconds": 34,
      "departureTime": "2025-10-30T10:00:00+01:00",
      "arrivalTime":   "2025-10-30T10:06:36+01:00"
    },
    "legs": [{
      "summary": { "lengthInMeters": 1879, "travelTimeInSeconds": 396 },
      "points": [
        { "latitude": 52.50931, "longitude": 13.42936 },
        { "latitude": 52.50274, "longitude": 13.43872 }
      ]
    }],
    "sections": [
      { "startPointIndex": 0, "endPointIndex": 6,
        "sectionType": "TRAVEL_MODE", "travelMode": "car" },
      { "startPointIndex": 3, "endPointIndex": 6,
        "sectionType": "TRAFFIC",
        "simpleCategory": "JAM",
        "effectiveSpeedInKmh": 14, "delayInSeconds": 34 }
    ]
  }]
}`;

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function RoutingV3CalculateRoute() {
  const sections = [
    {
      id: 'routing-v3-route',
      heading: 'Route planning',
      method: 'GET',
      note: 'Calculates a route between two or more waypoints. Uses the same endpoint path as v1 but requires TomTom-Api-Key as a request header rather than a query parameter.',
      params: PARAMS_ROUTE,
      code: CODE_GET,
      lang: 'bash',
    },
    {
      id: 'routing-v3-headers',
      heading: 'Request headers',
      params: PARAMS_HEADERS,
      code: CODE_GET,
      lang: 'bash',
    },
    {
      id: 'routing-v3-vehicle',
      heading: 'Vehicle profile',
      method: 'GET',
      params: PARAMS_VEHICLE,
      code: CODE_TRUCK,
      lang: 'bash',
    },
    {
      id: 'routing-v3-combustion',
      heading: 'Combustion consumption model',
      method: 'GET',
      note: 'Requires vehicleEngineType=combustion. Returns fuelConsumptionInLiters in the route summary.',
      params: PARAMS_COMBUSTION,
      code: CODE_COMBUSTION,
      lang: 'bash',
    },
    {
      id: 'routing-v3-electric',
      heading: 'Electric consumption model',
      method: 'GET',
      note: 'Requires vehicleEngineType=electric. Returns batteryConsumptionInkWh in the route summary.',
      params: PARAMS_ELECTRIC,
      code: CODE_ELECTRIC,
      lang: 'bash',
    },
    {
      id: 'routing-v3-post-body',
      heading: 'POST body',
      method: 'POST',
      note: 'POST-only fields. Use a JSON body for avoid areas, vignette control, per-leg overrides, or route reconstruction.',
      params: PARAMS_POST_BODY,
      code: CODE_POST,
      lang: 'bash',
    },
    {
      id: 'routing-v3-response',
      heading: 'Response & error codes',
      params: [],
      note: 'The response structure follows the same format as v1. Route geometry is in legs[].points, traffic data in sections[].',
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
    <ApiRefTwoCol
      title="Calculate Route"
      description="Full Routing API v3 calculateRoute reference. Supports GET and POST with the same comprehensive vehicle profile, consumption model, and guidance parameters as v1, with v3 URL patterns and header-based authentication."
      version="v3-public"
      sections={sections}
    />
  );
}
