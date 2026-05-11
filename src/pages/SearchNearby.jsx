import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Request parameters ────────────────────────────────────────────────────── */
const PARAMS = [
  { name: 'lat', required: true, type: 'float', desc: 'Latitude of the search centre point. Required — nearby search is purely coordinate-driven with no text query.' },
  { name: 'lon', required: true, type: 'float', desc: 'Longitude of the search centre point. Required.' },
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'radius', type: 'integer', default: 500, desc: 'Search radius in metres (1–50000). Default 500 m. Results outside this radius are not returned.' },
  { name: 'limit', type: 'integer', default: 10, desc: 'Maximum number of results to return (1–100).' },
  { name: 'categorySet', type: 'string', desc: 'Comma-separated POI category IDs to filter results to specific types. Use the POI Categories endpoint for valid IDs.' },
  { name: 'brandSet', type: 'string', desc: 'Comma-separated brand names to filter results to known chains. Example: Shell,BP.' },
  { name: 'connectorSet', type: 'string', desc: 'Comma-separated EV connector type IDs to filter EV charging station results.' },
  { name: 'openingHours', type: 'string', values: ['nextSevenDays'], desc: 'Include opening hours in results. nextSevenDays returns the schedule for the next 7 days.' },
  { name: 'language', type: 'string (IETF)', default: 'en-GB', desc: 'Language for POI names and address strings.' },
  { name: 'countrySet', type: 'string', desc: 'Comma-separated ISO 3166-1 alpha-2 codes to restrict results to specific countries.' },
  { name: 'relatedPois', type: 'string', default: 'off', values: ['off', 'child', 'parent', 'all'], desc: 'Include related POI records such as child entities or parent locations.' },
  { name: 'view', type: 'string', values: ['Unified', 'AR', 'IN', 'MA', 'PK', 'RU', 'TR', 'CN'], desc: 'Geopolitical view for disputed territories.' },
];

/* ─── Response fields ────────────────────────────────────────────────────────── */
const RESPONSE_FIELDS = [
  { name: 'summary', type: 'object', desc: 'Metadata: numResults, totalResults, queryTime, and geoBias showing the exact centre used.' },
  { name: 'results', type: 'array', desc: 'Array of nearby POI results sorted by distance ascending.' },
  { name: 'results[].type', type: 'string', desc: 'Always POI for nearby search.' },
  { name: 'results[].id', type: 'string', desc: 'Unique entity ID for enriched lookups via Place by ID.' },
  { name: 'results[].score', type: 'float', desc: 'Relevance and proximity score.' },
  { name: 'results[].dist', type: 'float', desc: 'Distance in metres from the supplied lat/lon to the result.' },
  { name: 'results[].poi', type: 'object', desc: 'POI data block.', children: [
    { name: 'poi.name', type: 'string', desc: 'Display name of the POI.' },
    { name: 'poi.phone', type: 'string', desc: 'Contact phone number.' },
    { name: 'poi.url', type: 'string', desc: 'Website URL.' },
    { name: 'poi.categories', type: 'object[]', desc: 'Array of { id, name } category objects.' },
    { name: 'poi.brands', type: 'object[]', desc: 'Array of { name } brand objects.' },
    { name: 'poi.openingHours', type: 'object', desc: 'Opening schedule when openingHours=nextSevenDays is requested.' },
  ]},
  { name: 'results[].address', type: 'object', desc: 'Structured address: streetName, municipality, postalCode, countryCode, freeformAddress.' },
  { name: 'results[].position', type: 'object', desc: '{ lat, lon } coordinates of the POI.' },
  { name: 'results[].viewport', type: 'object', desc: 'Suggested map viewport bounding box.' },
  { name: 'results[].entryPoints', type: 'array', desc: 'Physical access points with type and position.' },
];

/* ─── Code examples ──────────────────────────────────────────────────────────── */
const CODE = `# Nearby Search — petrol stations within 2 km of a location
curl "https://api.tomtom.com/search/2/nearbySearch/.json\\
?key=YOUR_API_KEY\\
&lat=48.8566&lon=2.3522\\
&radius=2000\\
&categorySet=7311\\
&limit=10\\
&language=fr-FR"`;

const CODE_RESPONSE = `{
  "summary": {
    "queryType": "NEARBY",
    "queryTime": 29,
    "numResults": 5,
    "totalResults": 18,
    "offset": 0,
    "geoBias": { "lat": 48.8566, "lon": 2.3522 }
  },
  "results": [
    {
      "type": "POI",
      "id": "250009001654321",
      "score": 2.5010,
      "dist": 214.8,
      "poi": {
        "name": "Total Énergies",
        "phone": "+33 1 23 45 67 89",
        "categories": [
          { "id": "7311", "name": "petrol station" }
        ],
        "brands": [{ "name": "TotalEnergies" }]
      },
      "address": {
        "streetName": "Boulevard du Temple",
        "streetNumber": "48",
        "municipality": "Paris",
        "postalCode": "75003",
        "countryCode": "FR",
        "country": "France",
        "freeformAddress": "48 Boulevard du Temple, 75003 Paris"
      },
      "position": { "lat": 48.8631, "lon": 2.3620 },
      "viewport": {
        "topLeftPoint": { "lat": 48.8641, "lon": 2.3610 },
        "btmRightPoint": { "lat": 48.8621, "lon": 2.3630 }
      },
      "entryPoints": [
        { "type": "main", "position": { "lat": 48.8630, "lon": 2.3619 } }
      ]
    }
  ]
}`;

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function SearchNearby({ onNavigate }) {
  return (
    <ApiRefTwoCol
      title="Nearby Search"
      description="Discover Points of Interest within a configurable radius around a coordinate — no text query required. Results are sorted by distance and can be filtered by category, brand, and connector type."
      version="v2"
      sections={[
        {
          id: 'request',
          heading: 'Request',
          method: 'GET',
          note: 'https://api.tomtom.com/search/2/nearbySearch/.json — Note the path ends with a literal dot before .json; there is no query segment.',
          params: PARAMS,
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
