import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Request parameters ─────────────────────────────────────────────────── */
const PARAMS_REQUEST = [
  {
    name: 'reportDynamicDataFreshness',
    type: 'string',
    values: ['trafficIncidents'],
    desc: 'Requests freshness data for dynamic data used in route calculation. trafficIncidents returns per-country traffic incident data timestamps.',
    children: [
      { name: 'trafficIncidents', desc: 'Returns a timestamp keyed by ISO 3166-1 alpha-2 country code for each country the route passes through.' },
    ],
  },
];

/* ─── Response parameters ────────────────────────────────────────────────── */
const PARAMS_RESPONSE = [
  {
    name: 'summary.dynamicDataFreshness',
    type: 'object',
    desc: 'Per-country freshness timestamps for the dynamic data used in the route. Keyed by ISO 3166-1 alpha-2 country code.',
    children: [
      {
        name: 'dynamicDataFreshness.trafficIncidents',
        type: 'object',
        desc: 'Object mapping country codes to Unix timestamps (milliseconds since epoch). Example: {"DEU": 1756195597, "FRA": 1756195898}. Routes should be recalculated when significant time has elapsed since these timestamps.',
      },
    ],
  },
];

/* ─── Code examples ──────────────────────────────────────────────────────── */
const CODE_GET = `curl "https://api.tomtom.com/maps/orbis/routing/calculateRoute/\\
  52.50931,13.42936:48.85660,2.35220/json\\
  ?reportDynamicDataFreshness=trafficIncidents" \\
  -H "TomTom-Api-Key: YOUR_API_KEY"`;

const CODE_RESPONSE = `{
  "routes": [{
    "summary": {
      "lengthInMeters": 503200,
      "travelTimeInSeconds": 17640,
      "dynamicDataFreshness": {
        "trafficIncidents": {
          "DEU": 1756195597,
          "FRA": 1756195898
        }
      }
    },
    "legs": [],
    "sections": [],
    "guidance": []
  }]
}`;

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function RoutingV2DataFreshness() {
  const sections = [
    {
      id: 'routing-v2-freshness-request',
      heading: 'Request parameters',
      method: 'GET',
      note: 'Add reportDynamicDataFreshness as a query parameter to any Calculate Route v2 request to receive freshness timestamps in the response summary.',
      params: PARAMS_REQUEST,
      code: CODE_GET,
      lang: 'bash',
    },
    {
      id: 'routing-v2-freshness-response',
      heading: 'Response data',
      note: 'dynamicDataFreshness appears in the route summary. Each key is an ISO 3166-1 alpha-2 country code; the value is a Unix timestamp in milliseconds. If no freshness data is available, dynamicDataFreshness is omitted.',
      params: PARAMS_RESPONSE,
      code: CODE_RESPONSE,
      lang: 'json',
    },
  ];

  return (
    <ApiRefTwoCol
      title="Dynamic Data Freshness"
      description="Report the freshness of traffic incident data used in Routing API v2 route calculations. The response includes per-country timestamps so clients can decide when to recalculate routes."
      version="v2-public"
      sections={sections}
    />
  );
}
