import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Request parameters ────────────────────────────────────────────────────── */
const PARAMS = [
  { name: 'query', required: true, type: 'string (path)', desc: 'POI name, brand, or keyword to search for. URL-encoded. Appended in the path: /search/2/poiSearch/{query}.json.' },
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'limit', type: 'integer', default: 10, desc: 'Maximum number of results to return (1–100).' },
  { name: 'lat', type: 'float', desc: 'Latitude for geographic search bias. Must be paired with lon.' },
  { name: 'lon', type: 'float', desc: 'Longitude for geographic search bias. Must be paired with lat.' },
  { name: 'radius', type: 'integer', desc: 'Search radius in metres around lat/lon. Constrains results to within this circle.' },
  { name: 'language', type: 'string (IETF)', default: 'en-GB', desc: 'Language for POI names and address strings in the response.' },
  { name: 'countrySet', type: 'string', desc: 'Comma-separated ISO 3166-1 alpha-2 country codes to restrict results. Example: GB,IE.' },
  { name: 'categorySet', type: 'string', desc: 'Comma-separated POI category IDs to filter results. Obtain valid IDs from the POI Categories endpoint.' },
  { name: 'brandSet', type: 'string', desc: 'Comma-separated brand names to narrow results to specific chains or labels. Example: Starbucks,Costa.' },
  { name: 'connectorSet', type: 'string', desc: 'Comma-separated EV connector type IDs. Filters results to EV charging stations with matching connector types.' },
  { name: 'openingHours', type: 'string', values: ['nextSevenDays'], desc: 'Include opening hours in results. nextSevenDays returns the schedule for the 7 days following the request.' },
  { name: 'relatedPois', type: 'string', default: 'off', values: ['off', 'child', 'parent', 'all'], desc: 'Return related POI records — child entities (e.g. fuel pump bays), parent locations, or all.' },
  { name: 'view', type: 'string', values: ['Unified', 'AR', 'IN', 'MA', 'PK', 'RU', 'TR', 'CN'], desc: 'Geopolitical view for disputed territories. Defaults to Unified.' },
  { name: 'boundingBox', type: 'string', desc: 'Bounding box to restrict results: minLon,minLat,maxLon,maxLat. Example: -0.5,51.2,0.3,51.7.' },
];

/* ─── Response fields ────────────────────────────────────────────────────────── */
const RESPONSE_FIELDS = [
  { name: 'summary', type: 'object', desc: 'Query metadata including numResults, totalResults, queryTime, and optional geoBias.' },
  { name: 'results', type: 'array', desc: 'Array of POI result objects ordered by relevance score.' },
  { name: 'results[].type', type: 'string', desc: 'Always POI for this endpoint.' },
  { name: 'results[].id', type: 'string', desc: 'Unique entity identifier usable with the Place by ID endpoint.' },
  { name: 'results[].score', type: 'float', desc: 'Relevance score — higher is more relevant.' },
  { name: 'results[].dist', type: 'float', desc: 'Distance in metres from the search centre (present when lat/lon was supplied).' },
  { name: 'results[].poi', type: 'object', desc: 'POI-specific data block.', children: [
    { name: 'poi.name', type: 'string', desc: 'Display name of the POI.' },
    { name: 'poi.phone', type: 'string', desc: 'Primary phone number.' },
    { name: 'poi.url', type: 'string', desc: 'Official website URL.' },
    { name: 'poi.categories', type: 'object[]', desc: 'Array of { id, name } category classification objects.' },
    { name: 'poi.brands', type: 'object[]', desc: 'Array of { name } brand objects if the POI belongs to a known chain.' },
    { name: 'poi.openingHours', type: 'object', desc: 'Opening hours data when openingHours=nextSevenDays is requested. Contains mode and timeRanges[].' },
  ]},
  { name: 'results[].address', type: 'object', desc: 'Structured address with streetName, streetNumber, municipality, postalCode, countryCode, country, freeformAddress.' },
  { name: 'results[].position', type: 'object', desc: '{ lat, lon } coordinates of the POI.' },
  { name: 'results[].viewport', type: 'object', desc: 'Suggested map viewport: { topLeftPoint, btmRightPoint } each as { lat, lon }.' },
  { name: 'results[].entryPoints', type: 'array', desc: 'Physical entry points for the POI with type (main/minor) and position.' },
  { name: 'results[].relatedPois', type: 'array', desc: 'Related POI records when relatedPois is not off. Each has relationType (child/parent) and id.' },
];

/* ─── Code examples ──────────────────────────────────────────────────────────── */
const CODE = `# POI Search — find Starbucks near London
curl "https://api.tomtom.com/search/2/poiSearch/starbucks.json\\
?key=YOUR_API_KEY\\
&lat=51.5074&lon=-0.1278\\
&radius=3000\\
&limit=10\\
&brandSet=Starbucks\\
&openingHours=nextSevenDays"`;

const CODE_RESPONSE = `{
  "summary": {
    "query": "starbucks",
    "queryType": "NEARBY",
    "queryTime": 38,
    "numResults": 5,
    "totalResults": 47,
    "offset": 0,
    "geoBias": { "lat": 51.5074, "lon": -0.1278 }
  },
  "results": [
    {
      "type": "POI",
      "id": "826009001012345",
      "score": 3.1200,
      "dist": 187.3,
      "poi": {
        "name": "Starbucks",
        "phone": "+44 20 7123 4567",
        "url": "https://www.starbucks.co.uk",
        "categories": [
          { "id": "9361065", "name": "coffee shop" }
        ],
        "brands": [{ "name": "Starbucks" }],
        "openingHours": {
          "mode": "nextSevenDays",
          "timeRanges": [
            {
              "startTime": { "date": "2026-05-10", "hour": 7, "minute": 0 },
              "endTime": { "date": "2026-05-10", "hour": 21, "minute": 0 }
            }
          ]
        }
      },
      "address": {
        "streetName": "Oxford Street",
        "streetNumber": "201",
        "municipality": "London",
        "postalCode": "W1D 2JD",
        "countryCode": "GB",
        "country": "United Kingdom",
        "freeformAddress": "201 Oxford Street, London W1D 2JD"
      },
      "position": { "lat": 51.5159, "lon": -0.1423 },
      "viewport": {
        "topLeftPoint": { "lat": 51.5169, "lon": -0.1433 },
        "btmRightPoint": { "lat": 51.5149, "lon": -0.1413 }
      },
      "entryPoints": [
        { "type": "main", "position": { "lat": 51.5158, "lon": -0.1422 } }
      ]
    }
  ]
}`;

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function SearchPOI({ onNavigate }) {
  return (
    <ApiRefTwoCol
      title="POI Search"
      description="Search exclusively for Points of Interest by name, with optional filtering by category, brand, and connector type. Returns enriched POI data including contact details, opening hours, and entry points."
      version="v2"
      sections={[
        {
          id: 'request',
          heading: 'Request',
          method: 'GET',
          demoId: 'poi-search',
          note: 'https://api.tomtom.com/search/2/poiSearch/{query}.json',
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
