import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Request parameters ─────────────────────────────────────────────────── */
const PARAMS_QUERY = [
  {
    name: 'reportDynamicDataFreshness',
    type: 'string',
    values: ['UseFreshIncidents'],
    desc: 'Reports freshness of dynamic data used in the route calculation. When set to UseFreshIncidents, the response includes a freshness timestamp for traffic incident data.',
    children: [
      {
        name: 'reportDynamicDataFreshness: UseFreshIncidents',
        type: '',
        desc: 'Reports the freshness of traffic incident data used in route calculations.',
      },
    ],
  },
];

/* ─── Response fields ────────────────────────────────────────────────────── */
const PARAMS_RESPONSE = [
  {
    name: 'freshness',
    type: 'object',
    desc: 'Top-level freshness container in the response.',
    children: [
      {
        name: 'freshness.dynamicDataFreshness',
        type: 'array',
        desc: 'Array of freshness timestamps, one entry per requested data source.',
        children: [
          {
            name: 'dynamicDataFreshness[].UseFreshIncidents',
            type: 'string (Unix timestamp ms)',
            desc: 'Timestamp (milliseconds since January 1, 1970, 00:00:00 UTC) measuring the freshness of traffic incident data used in the route. Routes should be recalculated if significant time passes between receipt of new data. If there is no route to check freshness for, this is returned without content.',
          },
        ],
      },
    ],
  },
];

/* ─── Code examples ──────────────────────────────────────────────────────── */
const CODE_GET = `# LDEVR v2 — Report Dynamic Data Freshness
# GET request with optional reportDynamicDataFreshness parameter

curl -X GET \\
  "https://api.tomtom.com/maps/orbis/routing/calculateLongDistanceEV/\\
  reportDynamicDataFreshness?\\
  reportDynamicDataFreshness=UseFreshIncidents&\\
  apiKey=YOUR_API_KEY"`;

const CODE_POST = `# POST with reportDynamicDataFreshness as query parameter

curl -X POST \\
  "https://api.tomtom.com/maps/orbis/routing/calculateLongDistanceEV?\\
  reportDynamicDataFreshness=UseFreshIncidents" \\
  -H "Content-Type: application/json" \\
  -H "TomTom-Api-Key: YOUR_API_KEY" \\
  -d '{
    "legs": [
      { "routeStop": { "entryPoints": [{ "latitude": 52.36443, "longitude": 13.50929 }] } },
      { "routeStop": { "entryPoints": [{ "latitude": 48.85660, "longitude":  2.35220 }] } }
    ],
    "vehicleEngineType": "electric",
    "currentChargeInkWh": 45.0,
    "maxChargeInkWh": 75.0,
    "constantSpeedConsumptionInkWhPerHundredkm": "50,8.2:90,14.6:120,21.0"
  }'`;

const CODE_RESPONSE = `// Successful response — freshness data appended to route response
{
  "freshness": {
    "dynamicDataFreshness": [
      { "UseFreshIncidents": "1706896195591" }
    ]
  },
  "routes": [{
    "summary": {
      "lengthInMeters": 503200,
      "travelTimeInSeconds": 17640,
      "batteryConsumptionInkWh": 35.4,
      "remainingChargeAtArrivalInkWh": 5.0
    }
  }]
}`;

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function LDEVRDataFreshness() {
  const sections = [
    {
      id: 'ldevr-freshness-request',
      heading: 'Request parameters',
      method: 'GET',
      note: 'TomTom exposes an extension of the Long Distance EV Routing service to provide dynamic data freshness reporting. This allows clients to determine how current the traffic and incident data is that was used to compute the route.',
      params: PARAMS_QUERY,
      code: CODE_GET,
      lang: 'bash',
    },
    {
      id: 'ldevr-freshness-post',
      heading: 'POST usage',
      method: 'POST',
      params: [],
      note: 'The reportDynamicDataFreshness parameter can also be passed as a query string parameter on POST requests to the calculateLongDistanceEV endpoint.',
      code: CODE_POST,
      lang: 'bash',
    },
    {
      id: 'ldevr-freshness-response',
      heading: 'Response data',
      params: PARAMS_RESPONSE,
      code: CODE_RESPONSE,
      lang: 'json',
    },
  ];

  return (
    <ApiRefTwoCol
      title="Dynamic Data Freshness"
      description="Report how current the traffic incident data was at the time of route calculation. Set reportDynamicDataFreshness=UseFreshIncidents to receive a Unix timestamp in the response — routes should be recalculated when significant time has passed since data receipt."
      version="v2"
      sections={sections}
    />
  );
}
