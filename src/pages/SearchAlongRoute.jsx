import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Query parameters ───────────────────────────────────────────────────────── */
const PARAMS_QUERY = [
  { name: 'query', required: true, type: 'string (path)', desc: 'POI name or category to search along the route. URL-encoded path segment.' },
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'limit', type: 'integer', default: 10, desc: 'Maximum number of results to return (1–20). The along-route endpoint is capped at 20.' },
  { name: 'detourOffset', type: 'integer', desc: 'A minimum detour time in seconds. Only results that add at least this much time to the route are returned. Useful for filtering out POIs already on the direct path.' },
  { name: 'categorySet', type: 'string', desc: 'Comma-separated POI category IDs to restrict results.' },
  { name: 'brandSet', type: 'string', desc: 'Comma-separated brand names to restrict results.' },
  { name: 'openingHours', type: 'string', values: ['nextSevenDays'], desc: 'Include opening hours in the response.' },
  { name: 'language', type: 'string (IETF)', default: 'en-GB', desc: 'Language for POI names and address strings.' },
  { name: 'view', type: 'string', values: ['Unified', 'AR', 'IN', 'MA', 'PK', 'RU', 'TR', 'CN'], desc: 'Geopolitical view for disputed territories.' },
];

/* ─── Request body ───────────────────────────────────────────────────────────── */
const PARAMS_BODY = [
  { name: 'route', required: true, type: 'object', desc: 'The route corridor to search along.', children: [
    { name: 'route.points', required: true, type: 'object[]', desc: 'Ordered array of { lat, lon } coordinate objects defining the route geometry. Minimum 2 points, up to 10,000.' },
  ]},
  { name: 'maxDetourTime', required: true, type: 'integer (seconds)', desc: 'Maximum acceptable detour in seconds (1–3600). POIs that add more than this time to the journey are excluded.' },
];

/* ─── Response fields ────────────────────────────────────────────────────────── */
const RESPONSE_FIELDS = [
  { name: 'summary', type: 'object', desc: 'Metadata: numResults, totalResults, queryTime.' },
  { name: 'results', type: 'array', desc: 'Array of POI results along the route, sorted by detour time ascending.' },
  { name: 'results[].type', type: 'string', desc: 'Always POI.' },
  { name: 'results[].id', type: 'string', desc: 'Entity ID for Place by ID lookups.' },
  { name: 'results[].score', type: 'float', desc: 'Relevance score.' },
  { name: 'results[].dist', type: 'float', desc: 'Straight-line distance in metres from the nearest route point to the POI.' },
  { name: 'results[].detourTime', type: 'integer', desc: 'Extra travel time in seconds added to the route to visit this POI and return to the original path.' },
  { name: 'results[].detourOffset', type: 'integer', desc: 'Distance in metres along the route to the closest approach point for this POI.' },
  { name: 'results[].poi', type: 'object', desc: 'POI data block with name, phone, categories[], brands[], openingHours.' },
  { name: 'results[].address', type: 'object', desc: 'Structured address: streetName, municipality, postalCode, countryCode, freeformAddress.' },
  { name: 'results[].position', type: 'object', desc: '{ lat, lon } coordinates of the POI.' },
  { name: 'results[].entryPoints', type: 'array', desc: 'Physical access points with type and position.' },
];

/* ─── Code examples ──────────────────────────────────────────────────────────── */
const CODE = `# Along-Route Search — coffee shops on Berlin → Munich
curl -X POST \\
  "https://api.tomtom.com/search/2/searchAlongRoute/coffee.json\\
?key=YOUR_API_KEY&limit=5&maxDetourTime=300" \\
  -H "Content-Type: application/json" \\
  -d '{
    "route": {
      "points": [
        { "lat": 52.5200, "lon": 13.4050 },
        { "lat": 51.4400, "lon": 12.3600 },
        { "lat": 50.7753, "lon": 11.3300 },
        { "lat": 48.1351, "lon": 11.5820 }
      ]
    },
    "maxDetourTime": 300
  }'`;

const CODE_RESPONSE = `{
  "summary": {
    "queryTime": 67,
    "numResults": 5,
    "totalResults": 23
  },
  "results": [
    {
      "type": "POI",
      "id": "276009002345678",
      "score": 2.8541,
      "dist": 62.3,
      "detourTime": 84,
      "detourOffset": 147230,
      "poi": {
        "name": "Starbucks",
        "phone": "+49 341 123 4567",
        "categories": [
          { "id": "9361065", "name": "coffee shop" }
        ],
        "brands": [{ "name": "Starbucks" }]
      },
      "address": {
        "streetName": "Markt",
        "streetNumber": "3",
        "municipality": "Leipzig",
        "postalCode": "04109",
        "countryCode": "DE",
        "country": "Germany",
        "freeformAddress": "Markt 3, 04109 Leipzig"
      },
      "position": { "lat": 51.3406, "lon": 12.3747 },
      "entryPoints": [
        { "type": "main", "position": { "lat": 51.3405, "lon": 12.3746 } }
      ]
    }
  ]
}`;

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function SearchAlongRoute({ onNavigate }) {
  return (
    <ApiRefTwoCol
      title="Along-Route Search"
      description="Find Points of Interest along a route corridor, ranked by the detour time required to visit them. Ideal for suggesting fuel stops, restaurants, or charging stations without significantly extending a journey."
      version="v2"
      sections={[
        {
          id: 'request',
          heading: 'Request',
          method: 'POST',
          demoId: 'along-route-search',
          note: 'https://api.tomtom.com/search/2/searchAlongRoute/{query}.json — Route geometry is sent in the request body as JSON. maxDetourTime is a required query parameter.',
          params: PARAMS_QUERY,
          code: CODE,
          lang: 'bash',
        },
        {
          id: 'request-body',
          heading: 'Request Body',
          note: 'POST body must be Content-Type: application/json. The route.points array defines the corridor — more points produce a more accurate corridor match.',
          params: PARAMS_BODY,
          code: CODE,
          lang: 'bash',
        },
        {
          id: 'response',
          heading: 'Response',
          params: RESPONSE_FIELDS,
          code: CODE_RESPONSE,
          lang: 'json',
        },
      ]}
    />
  );
}
