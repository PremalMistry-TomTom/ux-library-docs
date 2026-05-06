import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';


/* ─── Parameter data ─────────────────────────────────────────────────────────── */
const PARAMS_ROUTE = [
  { name: 'locations', required: true, type: 'string (path)', desc: 'Colon-separated lat,lon pairs — minimum 2 (origin + destination), up to 150 intermediate waypoints. Example: 52.509,13.429:52.502,13.438' },
  { name: 'routeType', type: 'string', default: 'fastest', values: ['fastest', 'shortest', 'eco', 'thrilling'], desc: 'Optimisation objective. thrilling maximises winding roads and hills (max ~900 km); requires hilliness and windingness.' },
  { name: 'travelMode', type: 'string', default: 'car', values: ['car', 'truck', 'taxi', 'bus', 'van', 'motorcycle', 'bicycle', 'pedestrian'], desc: 'Vehicle type. bus, motorcycle, taxi, van are currently BETA.' },
  { name: 'departAt', type: 'datetime (RFC 3339)', desc: 'Departure date/time. Defaults to now. Cannot be combined with arriveAt.' },
  { name: 'arriveAt', type: 'datetime (RFC 3339)', desc: 'Desired arrival time. Cannot be combined with departAt, minDeviationDistance, or minDeviationTime.' },
  { name: 'traffic', type: 'boolean', default: true, desc: 'Use real-time and historic traffic. Set false to ignore live incidents (historic patterns still apply to IQ Routes).' },
  { name: 'maxAlternatives', type: 'integer', default: 0, desc: 'Number of alternative routes (0–5). Cannot combine with computeBestOrder=true.' },
  { name: 'avoid', type: 'string (repeatable)', values: ['motorways', 'tollRoads', 'ferries', 'unpavedRoads', 'tunnels', 'borderCrossings', 'lowEmissionZones', 'carpools', 'alreadyUsedRoads'], desc: 'Road/feature types to avoid. Repeatable: &avoid=motorways&avoid=tollRoads' },
  { name: 'language', type: 'string (IETF)', default: 'en-GB', desc: 'Language for turn-by-turn instruction text and street name localisation.' },
  { name: 'sectionType', type: 'string (repeatable)', values: ['travelMode', 'traffic', 'toll', 'tollVignette', 'country', 'motorway', 'tunnel', 'ferry', 'speedLimit', 'lowEmissionZone', 'carpool', 'roadShields', 'lanes', 'importantRoadStretch'], desc: 'Which section types to include in the response. Repeatable.' },
  { name: 'instructionsType', type: 'string', values: ['coded', 'text', 'tagged'], desc: 'Activates turn-by-turn guidance. tagged wraps street names in XML-style tags for custom rendering.' },
  { name: 'routeRepresentation', type: 'string', default: 'polyline', values: ['polyline', 'encodedPolyline', 'summaryOnly', 'none'], desc: 'Shape of the route in the response. none requires computeBestOrder=true.' },
  { name: 'computeBestOrder', type: 'boolean', default: false, desc: 'Optimise waypoint visit order (TSP). Cannot be combined with maxAlternatives > 0 or circle waypoints.' },
  { name: 'computeTravelTimeFor', type: 'string', default: 'none', values: ['none', 'all'], desc: 'When set to all, the response includes noTraffic, historicTraffic, and liveTrafficIncidents travel time variants.' },
  { name: 'report', type: 'string', values: ['effectiveSettings'], desc: 'Include effectiveSettings in the response to see which parameter values were actually applied.' },
];

const PARAMS_VEHICLE = [
  { name: 'vehicleMaxSpeed', type: 'integer (km/h)', desc: '0 = auto-determined from road data. Values: 0–250.' },
  { name: 'vehicleWeight', type: 'integer (kg)', desc: 'Total vehicle weight. 0 = no weight restriction routing.' },
  { name: 'vehicleAxleWeight', type: 'integer (kg)', desc: 'Weight per axle. Used with truck routing for bridge and road restrictions.' },
  { name: 'vehicleNumberOfAxles', type: 'integer', desc: 'Total number of axles.' },
  { name: 'vehicleLength', type: 'float (metres)', desc: 'Vehicle length for low-clearance and road-width restrictions.' },
  { name: 'vehicleWidth', type: 'float (metres)', desc: 'Vehicle width, rounded to the nearest cm.' },
  { name: 'vehicleHeight', type: 'float (metres)', desc: 'Vehicle height for bridge and tunnel clearance restrictions.' },
  { name: 'vehicleCommercial', type: 'boolean', desc: 'Mark as a commercial vehicle to apply relevant road restrictions.' },
  { name: 'vehicleLoadType', type: 'string (repeatable)', values: ['USHazmatClass1', 'USHazmatClass2', 'USHazmatClass3', 'USHazmatClass4', 'USHazmatClass5', 'USHazmatClass6', 'USHazmatClass7', 'USHazmatClass8', 'USHazmatClass9', 'otherHazmatExplosive', 'otherHazmatGeneral', 'otherHazmatHarmfulToWater'], desc: 'Hazardous material classification for routing restrictions.' },
  { name: 'vehicleAdrTunnelRestrictionCode', type: 'string', values: ['B', 'C', 'D', 'E'], desc: 'ADR tunnel restriction code for hazmat transport through tunnels.' },
  { name: 'vehicleEngineType', type: 'string', values: ['combustion', 'electric'], desc: 'Required when using a consumption model.' },
  { name: 'hilliness', type: 'string', default: 'normal', values: ['low', 'normal', 'high'], desc: 'Preference for hilly routes. Only applicable with routeType=thrilling.' },
  { name: 'windingness', type: 'string', default: 'normal', values: ['low', 'normal', 'high'], desc: 'Preference for winding roads. Only applicable with routeType=thrilling.' },
];

const PARAMS_COMBUSTION = [
  { name: 'constantSpeedConsumptionInLitersPerHundredkm', required: true, type: 'colon-delimited speed:consumption pairs', desc: '1–25 speed/consumption pairs defining the fuel curve. Example: 50,6.3:80,7.1:120,9.0' },
  { name: 'currentFuelInLiters', type: 'float', desc: 'Current fuel level in litres. Used to calculate remaining range and trigger low-fuel warnings.' },
  { name: 'auxiliaryPowerInLitersPerHour', type: 'float', desc: 'Additional fuel consumption from accessories (AC, heating, etc.).' },
  { name: 'fuelEnergyDensityInMJoulesPerLiter', type: 'float', desc: 'Fuel energy density. Required when using efficiency parameters. Typical: 34.2 (petrol), 35.8 (diesel).' },
  { name: 'accelerationEfficiency', type: 'float', desc: 'Efficiency of kinetic energy conversion during acceleration. Must be paired with decelerationEfficiency. Product of both must be ≤ 1.' },
  { name: 'decelerationEfficiency', type: 'float', desc: 'Energy recovery efficiency during braking. Must be paired with accelerationEfficiency.' },
  { name: 'uphillEfficiency', type: 'float', desc: 'Efficiency going uphill. Must be paired with downhillEfficiency.' },
  { name: 'downhillEfficiency', type: 'float', desc: 'Energy recovery going downhill. Must be paired with uphillEfficiency.' },
];

const PARAMS_ELECTRIC = [
  { name: 'constantSpeedConsumptionInkWhPerHundredkm', required: true, type: 'colon-delimited speed:consumption pairs', desc: '1–25 speed/energy pairs defining the EV consumption curve. Example: 50,12.5:100,17.8:130,23.5' },
  { name: 'currentChargeInkWh', required: true, type: 'float', desc: 'Current battery charge in kWh. Must be paired with maxChargeInkWh.' },
  { name: 'maxChargeInkWh', required: true, type: 'float', desc: 'Total battery capacity in kWh. Must be paired with currentChargeInkWh.' },
  { name: 'auxiliaryPowerInkW', type: 'float', desc: 'Continuous power draw from HVAC, infotainment, and other accessories.' },
  { name: 'accelerationEfficiency', type: 'float', desc: 'Cannot be combined with altitude-based parameters (consumptionInkWhPerkmAltitudeGain / recuperationInkWhPerkmAltitudeLoss).' },
  { name: 'decelerationEfficiency', type: 'float', desc: 'Energy recovered during braking via regenerative braking. Pair with accelerationEfficiency.' },
  { name: 'uphillEfficiency', type: 'float', desc: 'Cannot be combined with altitude-based parameters.' },
  { name: 'downhillEfficiency', type: 'float', desc: 'Must be paired with uphillEfficiency.' },
  { name: 'consumptionInkWhPerkmAltitudeGain', type: 'float', desc: 'Energy used per 1 km of altitude gain. Cannot be combined with efficiency parameters.' },
  { name: 'recuperationInkWhPerkmAltitudeLoss', type: 'float', desc: 'Energy recovered per 1 km of altitude loss. Must be paired with consumptionInkWhPerkmAltitudeGain.' },
];

const PARAMS_POST_BODY = [
  { name: 'avoidAreas', type: 'object', desc: 'Define rectangular avoid zones. Max 10 rectangles, each up to ~160×160 km. Latitudes must be between −80 and +80.', children: [
    { name: 'avoidAreas.rectangles', type: 'object[]', desc: 'Array of rectangular exclusion zones. Each defined by south-west and north-east corners.', children: [
      { name: 'rectangles[].southWestCorner', type: 'GeoPoint', desc: 'Bottom-left corner of the avoid rectangle.', children: [
        { name: 'southWestCorner.latitude',  type: 'float', desc: 'Latitude. Must be between −80 and +80.' },
        { name: 'southWestCorner.longitude', type: 'float', desc: 'Longitude. Between −180 and +180.' },
      ]},
      { name: 'rectangles[].northEastCorner', type: 'GeoPoint', desc: 'Top-right corner. Must have a higher latitude and longitude than southWestCorner.', children: [
        { name: 'northEastCorner.latitude',  type: 'float', desc: 'Latitude. Must be between −80 and +80.' },
        { name: 'northEastCorner.longitude', type: 'float', desc: 'Longitude. Between −180 and +180.' },
      ]},
    ]},
  ]},
  { name: 'avoidVignette', type: 'string[]', desc: 'Array of ISO 3166-1 alpha-3 country codes whose vignette systems to avoid. Mutually exclusive with allowVignette.' },
  { name: 'allowVignette', type: 'string[]', desc: 'Only avoid vignette toll roads in countries NOT in this list. Mutually exclusive with avoidVignette.' },
  { name: 'supportingPoints', type: 'GeoPoint[]', desc: 'Ordered list of coordinates for route reconstruction. Pass with reconstructionMode.', children: [
    { name: 'supportingPoints[].latitude',  type: 'float', desc: 'Latitude of the supporting point.' },
    { name: 'supportingPoints[].longitude', type: 'float', desc: 'Longitude of the supporting point.' },
  ]},
  { name: 'encodedPolyline', type: 'string', desc: 'Compressed polyline for route reconstruction. Use with encodedPolylinePrecision (5 or 7).' },
  { name: 'legs', type: 'object[]', desc: 'Per-leg parameter overrides. Each leg can specify its own routeType, hilliness, windingness, avoids, supportingPoints, and routeStop (pause time + entry points).', children: [
    { name: 'legs[].routeType',   type: 'string', values: ['fastest','shortest','eco','thrilling'], desc: 'Override the route optimisation objective for this leg only.' },
    { name: 'legs[].hilliness',   type: 'string', values: ['low','normal','high'], desc: 'Hilliness preference for this leg. Only effective with routeType=thrilling.' },
    { name: 'legs[].windingness', type: 'string', values: ['low','normal','high'], desc: 'Winding road preference for this leg. Only effective with routeType=thrilling.' },
    { name: 'legs[].avoids', type: 'string[]', desc: 'Road features to avoid on this leg. Overrides the top-level avoid for this segment.' },
    { name: 'legs[].supportingPoints', type: 'GeoPoint[]', desc: 'Ordered coordinates for route reconstruction on this leg only.' },
    { name: 'legs[].routeStop', type: 'object', desc: 'Defines how the vehicle behaves at the end of this leg — stop type, dwell time, and approach directions.', children: [
      { name: 'routeStop.stopType', type: 'string', values: ['VIA_POINT','CHARGING_STOP'], desc: 'VIA_POINT: pass-through waypoint with no mandatory stop. CHARGING_STOP: planned EV charging with dwell time.' },
      { name: 'routeStop.passThroughTime', type: 'integer (seconds)', desc: 'Dwell time at this stop before the vehicle continues. Default: 0.' },
      { name: 'routeStop.entryPoints', type: 'GeoPoint[]', desc: 'Preferred approach directions for the stop, ordered by priority.' },
    ]},
  ]},
  { name: 'reassessmentParameterSets', type: 'object[]', desc: 'Alternative consumption scenario parameters. Returns additional route summaries in the response for each scenario.', children: [
    { name: 'reassessmentParameterSets[].vehicleEngineType', type: 'string', values: ['combustion','electric'], desc: 'Engine type for this alternative scenario.' },
    { name: 'reassessmentParameterSets[].constantSpeedConsumptionInLitersPerHundredkm', type: 'string (colon pairs)', desc: 'Alternative combustion consumption curve for this scenario.' },
    { name: 'reassessmentParameterSets[].constantSpeedConsumptionInkWhPerHundredkm', type: 'string (colon pairs)', desc: 'Alternative electric consumption curve for this scenario.' },
    { name: 'reassessmentParameterSets[].auxiliaryPowerInLitersPerHour', type: 'float', desc: 'Auxiliary fuel draw override for this scenario.' },
    { name: 'reassessmentParameterSets[].auxiliaryPowerInkW', type: 'float', desc: 'Auxiliary electric power override for this scenario.' },
    { name: 'reassessmentParameterSets[].currentFuelInLiters', type: 'float', desc: 'Starting fuel level for this scenario (litres).' },
    { name: 'reassessmentParameterSets[].currentChargeInkWh', type: 'float', desc: 'Starting battery charge for this scenario (kWh).' },
  ]},
];

/* ─── Response data ─────────────────────────────────────────────────────────── */
const SUMMARY_FIELDS_BASE = [
  { name: 'lengthInMeters',        type: 'number',           desc: 'Total route distance in metres.' },
  { name: 'travelTimeInSeconds',   type: 'number',           desc: 'Estimated travel time with traffic.' },
  { name: 'trafficDelayInSeconds', type: 'number',           desc: 'Delay caused by traffic events compared to free-flow speed.' },
  { name: 'trafficLengthInMeters', type: 'number',           desc: 'Length of route segments affected by traffic incidents.' },
  { name: 'departureTime',         type: 'string (ISO 8601)',desc: 'Actual departure time used for calculation.' },
  { name: 'arrivalTime',           type: 'string (ISO 8601)',desc: 'Estimated arrival time.' },
];

const SUMMARY_FIELDS_V1 = [
  ...SUMMARY_FIELDS_BASE,
  { name: 'noTrafficTravelTimeInSeconds',           type: 'number', desc: 'Hypothetical travel time assuming no traffic. Only returned when computeTravelTimeFor=all.' },
  { name: 'historicTrafficTravelTimeInSeconds',     type: 'number', desc: 'Travel time based on historic traffic patterns. Only returned when computeTravelTimeFor=all.' },
  { name: 'liveTrafficIncidentsTravelTimeInSeconds',type: 'number', desc: 'Travel time factoring in live traffic incidents only. Only returned when computeTravelTimeFor=all.' },
  { name: 'batteryConsumptionInkWh',                type: 'number', desc: 'Total EV battery consumption. Negative values indicate net energy recuperation over the route.' },
  { name: 'fuelConsumptionInLiters',                type: 'number', desc: 'Total fuel consumption for combustion vehicle routes.' },
];

const ROUTING_SECTION_TYPES = [
  { type: 'TRAVEL_MODE',            fields: 'travelMode' },
  { type: 'TRAFFIC',                fields: 'simpleCategory, effectiveSpeedInKmh, delayInSeconds, magnitudeOfDelay (0–4), tec' },
  { type: 'TOLL',                   fields: 'tollPaymentTypes (CASH, CREDIT_CARD, ETC_TRANSPONDER, SUBSCRIPTION…)' },
  { type: 'SPEED_LIMIT',            fields: 'maxSpeedLimitInKmh' },
  { type: 'COUNTRY',                fields: 'countryCode (ISO 3166-1 alpha-3)' },
  { type: 'TUNNEL',                 fields: 'startPointIndex, endPointIndex' },
  { type: 'MOTORWAY',               fields: 'startPointIndex, endPointIndex' },
  { type: 'FERRY',                  fields: 'startPointIndex, endPointIndex' },
  { type: 'LOW_EMISSION_ZONE',      fields: 'startPointIndex, endPointIndex' },
  { type: 'ROAD_SHIELDS',           fields: 'roadShieldReferences[] — reference, shieldContent, affixes' },
  { type: 'IMPORTANT_ROAD_STRETCH', fields: 'importantRoadStretchIndex, streetName, roadNumbers' },
  { type: 'LANES',                  fields: 'lanes[] — directional options, separator types' },
];

const ROUTING_ERRORS = [
  { code: 'MAP_MATCHING_FAILURE',       title: 'Map Matching Failure',      desc: 'A waypoint could not be matched to a drivable road. Check coordinate precision and that the location is accessible.' },
  { code: 'NO_ROUTE_FOUND',             title: 'No Route Found',            desc: 'No valid route exists between the given waypoints, possibly due to avoid constraints or inaccessible areas.' },
  { code: 'BAD_INPUT',                  title: 'Bad Input',                 desc: 'Invalid parameter combination — e.g., computeBestOrder=true with maxAlternatives > 0, or mutually exclusive consumption model parameters.' },
  { code: 'COMPUTE_TIME_LIMIT_EXCEEDED',title: 'Compute Time Limit',        desc: 'Route calculation exceeded the ~30 second server-side timeout. Reduce waypoint count or route complexity.' },
  { code: 'CANNOT_RESTORE_BASEROUTE',   title: 'Cannot Restore Base Route', desc: 'Route reconstruction failed — supporting points or encoded polyline could not be matched.' },
];

const CODE_ERROR_ROUTING = `// HTTP 400 — error response
{
  "formatVersion": "0.0.12",
  "detailedError": {
    "code": "MAP_MATCHING_FAILURE",
    "message": "Waypoint at index 0 could not be matched to the road network.",
    "target": "calculateRoute",
    "details": [{
      "code": "InvalidCoordinates",
      "message": "Coordinate is outside the supported routing area.",
      "target": "locations[0]"
    }]
  }
}`;

/* ─── Code examples ──────────────────────────────────────────────────────────── */
const CODE_BASIC = `# Basic car route — fastest, live traffic
curl "https://api.tomtom.com/routing/1/calculateRoute/\\
52.50931,13.42936:52.50274,13.43872/json\\
?routeType=fastest&traffic=true&travelMode=car\\
&key=YOUR_API_KEY"`;

const CODE_KOTLIN = `val options = RoutePlanningOptions(
    itinerary = Itinerary(
        origin = Place(GeoPoint(52.50931, 13.42936)),
        destination = Place(GeoPoint(52.50274, 13.43872))
    ),
    routeType = RouteType.Fastest,
    travelMode = TravelMode.Car,
    considerTraffic = TrafficConsiderationMode.LiveAndHistoricTraffic
)

routingClient.planRoute(options) { result ->
    result.fold(
        onSuccess = { response ->
            val route = response.routes.first()
            println("Time: \${route.summary.travelTime.seconds}s")
            println("Distance: \${route.summary.length.value}m")
        },
        onFailure = { error -> Log.e("Routing", error.message) }
    )
}`;

const CODE_TRUCK = `# Truck routing with hazmat and size restrictions
curl -X POST \\
  "https://api.tomtom.com/routing/1/calculateRoute/\\
52.50931,13.42936:52.50274,13.43872/json\\
?travelMode=truck\\
&vehicleWeight=24000\\
&vehicleHeight=4.2\\
&vehicleWidth=2.5\\
&vehicleLength=16.5\\
&vehicleLoadType=USHazmatClass3\\
&vehicleAdrTunnelRestrictionCode=D\\
&key=YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "avoidAreas": {
      "rectangles": [{
        "southWestCorner": {"latitude": 52.48, "longitude": 13.41},
        "northEastCorner": {"latitude": 52.52, "longitude": 13.46}
      }]
    }
  }'`;

const CODE_EV_BASIC = `# EV route with consumption model
curl "https://api.tomtom.com/routing/1/calculateRoute/\\
52.50931,13.42936:52.50274,13.43872/json\\
?vehicleEngineType=electric\\
&constantSpeedConsumptionInkWhPerHundredkm=50,12.5:100,17.8:130,23.5\\
&currentChargeInkWh=32\\
&maxChargeInkWh=50\\
&auxiliaryPowerInkW=1.5\\
&key=YOUR_API_KEY"`;

const CODE_GUIDANCE = `# Route with turn-by-turn instructions and lane data
curl "https://api.tomtom.com/routing/1/calculateRoute/\\
52.50931,13.42936:52.50274,13.43872/json\\
?instructionsType=text\\
&language=en-GB\\
&sectionType=travelMode&sectionType=traffic&sectionType=lanes\\
&key=YOUR_API_KEY"

# Response includes:
# guidance.instructions[].maneuver  (e.g. TURN_RIGHT, ROUNDABOUT_EXIT_RIGHT)
# guidance.instructions[].message   (e.g. "Turn right onto Kurfürstendamm")
# guidance.instructions[].lanes[]   (directional options per lane)`;

const CODE_ALTERNATIVES = `# Request 3 alternative routes
curl "https://api.tomtom.com/routing/1/calculateRoute/\\
52.50931,13.42936:52.50274,13.43872/json\\
?maxAlternatives=3\\
&alternativeType=betterRoute\\
&computeTravelTimeFor=all\\
&key=YOUR_API_KEY"

# Each alternative in response includes:
# summary.deviationPoint   — where it diverges from the main route
# summary.deviationDistance
# summary.planningReason   — "Blockage" or "Better_Proposal"
# summary.noTrafficTravelTimeInSeconds
# summary.historicTrafficTravelTimeInSeconds
# summary.liveTrafficIncidentsTravelTimeInSeconds`;

const CODE_RESPONSE = `{
  "routes": [{
    "summary": {
      "lengthInMeters": 1879,
      "travelTimeInSeconds": 396,
      "trafficDelayInSeconds": 34,
      "trafficLengthInMeters": 421,
      "departureTime": "2025-10-30T10:00:00+01:00",
      "arrivalTime": "2025-10-30T10:06:36+01:00"
    },
    "legs": [{
      "summary": { "lengthInMeters": 1879, "travelTimeInSeconds": 396 },
      "points": [
        { "latitude": 52.50931, "longitude": 13.42936 },
        { "latitude": 52.50753, "longitude": 13.43201 },
        { "latitude": 52.50274, "longitude": 13.43872 }
      ]
    }],
    "sections": [
      {
        "startPointIndex": 0, "endPointIndex": 6,
        "sectionType": "TRAVEL_MODE",
        "travelMode": "car"
      },
      {
        "startPointIndex": 3, "endPointIndex": 6,
        "sectionType": "TRAFFIC",
        "simpleCategory": "JAM",
        "effectiveSpeedInKmh": 14,
        "delayInSeconds": 34,
        "magnitudeOfDelay": 2
      }
    ]
  }]
}`;

export default function RoutingCalculateRoute({ onNavigate, platform = 'tomtom-maps' }) {
  const isOrbis = platform === 'orbis-maps';

  /* ─── Parameter sections — each carries its own contextual code example ──── */
  const routeParams = isOrbis
    ? PARAMS_ROUTE
        .map(p => p.name === 'routeType'
          ? { ...p, values: ['fast', 'short', 'efficient', 'thrilling'] }
          : p.name === 'traffic'
            ? { ...p, type: 'string', default: undefined, values: ['live', 'historical'], desc: 'Traffic model to apply. live uses real-time incidents and flow data. historical uses IQ Routes patterns.' }
            : p
        )
        .filter(p => !['computeTravelTimeFor', 'instructionsType'].includes(p.name))
    : PARAMS_ROUTE;

  const CODE_ORBIS_BASIC = `curl "https://api.tomtom.com/maps/orbis/routing/calculateRoute/\\
52.50931,13.42936:52.50274,13.43872/json\\
?routeType=fast\\
&traffic=live\\
&travelMode=car\\
&key=YOUR_API_KEY" \\
  -H "TomTom-Api-Version: 2"`;

  const sections = isOrbis
    ? [{ id: 'api-rc-route-planning', heading: 'Route planning', method: 'GET', params: routeParams, code: CODE_ORBIS_BASIC }]
    : [
        {
          id: 'api-rc-route-planning',
          heading: 'Route planning',
          method: 'GET',
          params: routeParams,
          tokens: {
            routeType: 'routeType=fastest',
            travelMode: 'travelMode=car',
          },
          code: `# Route: Berlin Mitte (52.509, 13.429) → Checkpoint Charlie (52.503, 13.439)
# Turn-by-turn instructions, live traffic, lane sections

curl "https://api.tomtom.com/routing/1/calculateRoute/\\
  52.50931,13.42936:52.50274,13.43872/json\\
  ?routeType=fastest\\
  &travelMode=car\\
  &traffic=true\\
  &language=en-GB\\
  &departAt=2025-10-30T10:00:00\\
  &avoid=tollRoads\\
  &maxAlternatives=2\\
  &instructionsType=text\\
  &sectionType=traffic&sectionType=lanes\\
  &key=YOUR_API_KEY"`,
        },
        {
          id: 'api-rc-vehicle',
          heading: 'Vehicle profile',
          method: 'GET',
          params: PARAMS_VEHICLE,
          code: `# Heavy truck: 24-tonne gross, 4.2 m tall, hazmat Class 3 (flammable liquids)
# ADR tunnel code D restricts transit through certain European tunnels

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
  &vehicleAdrTunnelRestrictionCode=D\\
  &vehicleEngineType=combustion\\
  &key=YOUR_API_KEY"`,
        },
        {
          id: 'api-rc-combustion',
          heading: 'Combustion consumption model',
          method: 'GET',
          params: PARAMS_COMBUSTION,
          note: 'Requires vehicleEngineType=combustion. Enables fuelConsumptionInLiters in the response summary. The product of any paired efficiency values (acceleration×deceleration, uphill×downhill) must be ≤ 1.',
          code: `# Petrol engine — fuel curve at 3 speed points (L/100 km)
# currentFuelInLiters enables remaining-range calculation in response

curl "https://api.tomtom.com/routing/1/calculateRoute/\\
  52.50931,13.42936:52.50274,13.43872/json\\
  ?vehicleEngineType=combustion\\
  &constantSpeedConsumptionInLitersPerHundredkm=50,6.3:80,7.1:120,9.0\\
  &currentFuelInLiters=45\\
  &auxiliaryPowerInLitersPerHour=0.5\\
  &fuelEnergyDensityInMJoulesPerLiter=34.2\\
  &key=YOUR_API_KEY"

# Response includes:
#   summary.fuelConsumptionInLiters   — total fuel used
#   summary.remainingFuelInLiters     — fuel left on arrival`,
        },
        {
          id: 'api-rc-electric',
          heading: 'Electric consumption model',
          method: 'GET',
          params: PARAMS_ELECTRIC,
          note: 'Requires vehicleEngineType=electric. Enables batteryConsumptionInkWh in the response (can be negative — indicates recuperation). Efficiency parameters and altitude parameters are mutually exclusive.',
          code: `# EV consumption curve: 50 km/h → 12.5 kWh/100 km, 130 km/h → 23.5 kWh/100 km
# 1.5 kW auxiliary load covers HVAC + infotainment at highway speed

curl "https://api.tomtom.com/routing/1/calculateRoute/\\
  52.50931,13.42936:52.50274,13.43872/json\\
  ?vehicleEngineType=electric\\
  &constantSpeedConsumptionInkWhPerHundredkm=50,12.5:100,17.8:130,23.5\\
  &currentChargeInkWh=32\\
  &maxChargeInkWh=50\\
  &auxiliaryPowerInkW=1.5\\
  &decelerationEfficiency=0.33\\
  &key=YOUR_API_KEY"

# Response includes:
#   summary.batteryConsumptionInkWh   — net energy used (negative = recuperated)`,
        },
        {
          id: 'api-rc-post-body',
          heading: 'POST body',
          method: 'POST',
          params: PARAMS_POST_BODY,
          note: 'POST-only fields. Use a JSON body when you need avoid areas, per-leg overrides, or route reconstruction.',
          lang: 'json',
          code: `// POST body — avoid area + per-leg stop override
// Send as JSON alongside URL query parameters.

{
  "avoidAreas": {
    "rectangles": [
      {
        "southWestCorner": { "latitude": 52.48, "longitude": 13.41 },
        "northEastCorner":  { "latitude": 52.52, "longitude": 13.46 }
      }
    ]
  },

  "legs": [
    {
      "routeType": "eco",

      "routeStop": {
        "stopType": "VIA_POINT",
        "passThroughTime": 300
      }
    },
    {
      "routeType": "thrilling",
      "hilliness":   "high",
      "windingness": "high"
    }
  ]
}`,
        },
      ];

  /* ─── Response + Error sections ── */
  const sectionTypesExtra = !isOrbis ? (
    <div style={{ marginTop: 8 }}>
      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)', marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
        Section types
      </div>
      <p style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.5, marginBottom: 12 }}>
        Sections divide the route into typed segments. Each has{' '}
        <code style={{ fontFamily: 'monospace', color: 'var(--blue)', fontSize: '0.75rem' }}>startPointIndex</code> and{' '}
        <code style={{ fontFamily: 'monospace', color: 'var(--blue)', fontSize: '0.75rem' }}>endPointIndex</code>{' '}
        into the legs points array, plus type-specific fields.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 8 }}>
        {ROUTING_SECTION_TYPES.map(({ type, fields }) => (
          <div key={type} style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '8px 12px', background: 'var(--bg)' }}>
            <code style={{ fontSize: '0.875rem', fontFamily: 'monospace', color: 'var(--blue)', fontWeight: 700 }}>{type}</code>
            <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginTop: 3, lineHeight: 1.4 }}>{fields}</div>
          </div>
        ))}
      </div>
    </div>
  ) : undefined;

  const responseData = [
    {
      id: 'api-rc-response',
      heading: 'Route summary',
      note: (
        <>
          Returns a <code style={{ fontFamily: 'monospace', color: 'var(--blue)', fontSize: '0.75rem' }}>routes</code> array.
          Each route contains a <code style={{ fontFamily: 'monospace', color: 'var(--blue)', fontSize: '0.75rem' }}>summary</code> with
          travel time and distance, a <code style={{ fontFamily: 'monospace', color: 'var(--blue)', fontSize: '0.75rem' }}>legs</code> array
          with per-leg points, and (when requested) a <code style={{ fontFamily: 'monospace', color: 'var(--blue)', fontSize: '0.75rem' }}>sections</code> array
          and <code style={{ fontFamily: 'monospace', color: 'var(--blue)', fontSize: '0.75rem' }}>guidance</code> object.
        </>
      ),
      params: isOrbis ? SUMMARY_FIELDS_BASE : SUMMARY_FIELDS_V1,
      extra: sectionTypesExtra,
      code: CODE_RESPONSE,
      lang: 'json',
    },
    {
      id: 'api-rc-errors',
      heading: 'Error codes',
      params: [],
      note: 'When a request fails the API returns an HTTP error status and a JSON body describing the problem.',
      extra: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
          {ROUTING_ERRORS.map(e => (
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
      code: CODE_ERROR_ROUTING,
      lang: 'json',
    },
  ];

  return (
    <div className="page page--wide">
      <div className="page-header">
        <h1>Calculate Route</h1>
        <PageActions />
      </div>


      <p className="quick-answer">
        {isOrbis
          ? 'Calculates an optimal car route between two or more waypoints using the Orbis Maps v2 engine. Returns a JSON route with summary, leg data, and a coordinate polyline.'
          : 'Calculates one or more optimal routes between waypoints. Supports full vehicle profiles, real-time and historic traffic, combustion and electric consumption models, turn-by-turn guidance, and up to 5 alternative routes.'}
      </p>

      {isOrbis && (
        <Callout type="info">
          Orbis Maps v2 supports <strong>car</strong> routing only. Route types use new names: <code style={{ fontFamily: 'monospace' }}>fast</code>, <code style={{ fontFamily: 'monospace' }}>short</code>, <code style={{ fontFamily: 'monospace' }}>efficient</code>, <code style={{ fontFamily: 'monospace' }}>thrilling</code>. Guidance instructions and road shield sections are not available.
        </Callout>
      )}

      {/* ── Two-column: params left, sticky code right ── */}
      <div className="zone">
        <ApiRefTwoCol
          sections={sections}
          panelLabel="Example"
        />
      </div>

      {/* ── Response + Errors ── */}
      <div className="zone">
        <h2 className="sh" id="rc-response">Response</h2>
        <ApiRefTwoCol
          sections={responseData}
          panelLabel="Response example"
        />
      </div>

      {/* Related */}
      <div className="zone" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {!isOrbis && (
          <button className="page-action-btn" onClick={() => onNavigate?.('ldevr-calculate-route', 'ldevr')}>
            Long Distance EV Routing →
          </button>
        )}
        <button className="page-action-btn" onClick={() => onNavigate?.('routing-reachable-range')}>
          Reachable Range →
        </button>
        {!isOrbis && (
          <button className="page-action-btn" onClick={() => onNavigate?.('routing-batch')}>
            Batch Routing →
          </button>
        )}
      </div>
    </div>
  );
}
