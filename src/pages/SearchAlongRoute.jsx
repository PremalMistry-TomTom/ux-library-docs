import { useState } from 'react';
import PageActions from '../components/ui/PageActions';
import VersionTabBar from '../components/ui/VersionTabBar';
import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Query parameters (shared v1 + v2) ──────────────────────────────────── */
const PARAMS_QUERY = [
  { name: 'query', required: true, type: 'string (path)', desc: 'POI name or category to search along the route. URL-encoded path segment.' },
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'maxDetourTime', required: true, type: 'integer', desc: 'Maximum acceptable detour in seconds (1–3600). POIs that add more than this time to the journey are excluded.' },
  { name: 'limit', type: 'integer', default: 10, desc: 'Maximum number of results to return (1–20). The along-route endpoint is capped at 20.' },
  { name: 'detourOffset', type: 'integer', desc: 'A minimum detour time in seconds. Only results that add at least this much time to the route are returned. Useful for filtering out POIs already on the direct path.' },
  { name: 'sortBy', type: 'string', values: ['detourTime', 'detourOffset'], desc: 'Sort order for results. detourTime (default) = sort by added travel time. detourOffset = sort by distance along route to closest approach point.' },
  { name: 'spreadingMode', type: 'string', values: ['auto', 'plan'], desc: 'Controls how results are distributed along the route. auto = results concentrated near start. plan = results evenly distributed along the route.' },
  { name: 'categorySet', type: 'string', desc: 'Comma-separated POI category IDs to restrict results.' },
  { name: 'brandSet', type: 'string', desc: 'Comma-separated brand names to restrict results.' },
  { name: 'connectorSet', type: 'string', desc: 'Comma-separated EV connector type IDs. Filters results to EV charging stations with at least one matching connector type.' },
  { name: 'fuelSet', type: 'string', desc: 'Comma-separated fuel type IDs to filter fuel station results. Example: Petrol, Diesel, LPG.' },
  { name: 'vehicleTypeSet', type: 'string', desc: 'Comma-separated vehicle type IDs to restrict results. Values: Car, Truck.' },
  { name: 'minPowerKW', type: 'float', desc: 'Minimum connector power in kW for EV charging station results.' },
  { name: 'maxPowerKW', type: 'float', desc: 'Maximum connector power in kW for EV charging station results.' },
  { name: 'typeahead', type: 'boolean', default: false, desc: 'Enable typeahead (partial query) mode. Returns ranked suggestions for incomplete query strings.' },
  { name: 'openingHours', type: 'string', values: ['nextSevenDays'], desc: 'Include opening hours in the response.' },
  { name: 'timeZone', type: 'string', desc: 'IANA time zone ID for interpreting openingHours. Example: Europe/Amsterdam.' },
  { name: 'mapcodes', type: 'boolean', desc: 'When true, includes Mapcode strings in the response for each result.' },
  { name: 'language', type: 'string (IETF)', default: 'en-GB', desc: 'Language for POI names and address strings.' },
  { name: 'view', type: 'string', values: ['Unified', 'AR', 'IN', 'MA', 'PK', 'RU', 'TR', 'CN'], desc: 'Geopolitical view for disputed territories.' },
];

/* ─── v2-only parameters ─────────────────────────────────────────────────── */
const PARAMS_V2_ONLY = [
  { name: 'apiVersion', required: true, type: 'string', desc: 'Orbis Maps API version. Must be "1". Alternatively pass TomTom-Api-Version: 1 as a request header.' },
];

/* ─── Request body ───────────────────────────────────────────────────────── */
const PARAMS_BODY = [
  { name: 'route', required: true, type: 'object', desc: 'The route corridor to search along.', children: [
    { name: 'route.points', required: true, type: 'object[]', desc: 'Ordered array of { lat, lon } coordinate objects defining the route geometry. Minimum 2 points, up to 10,000.' },
  ]},
];

/* ─── Response fields ────────────────────────────────────────────────────── */
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

/* ─── Code examples ──────────────────────────────────────────────────────── */
const CODE_V1 = `# Along-Route Search — coffee shops on Berlin → Munich (v1 TomTom Maps)
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
    }
  }'`;

const CODE_V2 = `# Along-Route Search — coffee shops on Berlin → Munich (v2 Orbis Maps)
curl -X POST \\
  "https://api.tomtom.com/maps/orbis/places/searchAlongRoute/coffee.json\\
?key=YOUR_API_KEY&apiVersion=1&limit=5&maxDetourTime=300" \\
  -H "Content-Type: application/json" \\
  -d '{
    "route": {
      "points": [
        { "lat": 52.5200, "lon": 13.4050 },
        { "lat": 51.4400, "lon": 12.3600 },
        { "lat": 50.7753, "lon": 11.3300 },
        { "lat": 48.1351, "lon": 11.5820 }
      ]
    }
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

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function SearchAlongRoute({ onNavigate }) {
  const [tab, setTab] = useState('v1');
  const v2QueryParams = [...PARAMS_V2_ONLY, ...PARAMS_QUERY];

  return (
    <div className="page page--wide">
      <div className="page-header page-header--with-tabs">
        <h1>Along-Route Search</h1>
        <PageActions pageId="search-along-route" pageTitle="Along-Route Search" />
        <VersionTabBar versions={['v1', 'v2']} activeTab={tab} onTabChange={setTab} />
      </div>
      <p className="quick-answer">
        Find Points of Interest along a route corridor, ranked by the detour time required to
        visit them. Ideal for suggesting fuel stops, restaurants, or charging stations without
        significantly extending a journey.
      </p>

      {tab === 'v1' && (
        <ApiRefTwoCol
          sections={[
            {
              id: 'request',
              heading: 'Request',
              method: 'POST',
              demoId: 'along-route-search',
              note: 'https://api.tomtom.com/search/2/searchAlongRoute/{query}.json — Route geometry is sent in the request body as JSON. maxDetourTime is a required query parameter.',
              params: PARAMS_QUERY,
              code: CODE_V1,
              lang: 'bash',
            },
            {
              id: 'request-body',
              heading: 'Request Body',
              note: 'POST body must be Content-Type: application/json. The route.points array defines the corridor — more points produce a more accurate corridor match.',
              params: PARAMS_BODY,
              code: CODE_V1,
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
      )}

      {tab === 'v2' && (
        <ApiRefTwoCol
          sections={[
            {
              id: 'request-v2',
              heading: 'Request',
              method: 'POST',
              note: 'https://api.tomtom.com/maps/orbis/places/searchAlongRoute/{query}.json  — Public Preview. Route geometry is sent in the request body as JSON. maxDetourTime is a required query parameter.',
              params: v2QueryParams,
              code: CODE_V2,
              lang: 'bash',
            },
            {
              id: 'request-body-v2',
              heading: 'Request Body',
              note: 'POST body must be Content-Type: application/json. The route.points array defines the corridor — more points produce a more accurate corridor match.',
              params: PARAMS_BODY,
              code: CODE_V2,
              lang: 'bash',
            },
            {
              id: 'response-v2',
              heading: 'Response',
              params: RESPONSE_FIELDS,
              code: CODE_RESPONSE,
              lang: 'json',
            },
          ]}
        />
      )}
    </div>
  );
}
