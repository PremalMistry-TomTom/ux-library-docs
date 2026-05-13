import { useState } from 'react';
import PageActions from '../components/ui/PageActions';
import VersionTabBar from '../components/ui/VersionTabBar';
import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Shared request parameters (v1 + v2) ─────────────────────────────────── */
const PARAMS_SHARED = [
  { name: 'lat', required: true, type: 'float', desc: 'Latitude of the search centre point. Required — nearby search is purely coordinate-driven with no text query.' },
  { name: 'lon', required: true, type: 'float', desc: 'Longitude of the search centre point. Required.' },
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'radius', type: 'integer', default: 500, desc: 'Search radius in metres (1–50000). Default 500 m. Results outside this radius are not returned.' },
  { name: 'limit', type: 'integer', default: 10, desc: 'Maximum number of results to return (1–100).' },
  { name: 'categorySet', type: 'string', desc: 'Comma-separated POI category IDs to filter results to specific types. Use the POI Categories endpoint for valid IDs.' },
  { name: 'brandSet', type: 'string', desc: 'Comma-separated brand names to filter results to known chains. Example: Shell,BP.' },
  { name: 'connectorSet', type: 'string', desc: 'Comma-separated EV connector type IDs to filter EV charging station results.' },
  { name: 'fuelSet', type: 'string', desc: 'Comma-separated fuel type IDs to filter fuel station results. Example: Petrol, Diesel, LPG.' },
  { name: 'vehicleTypeSet', type: 'string', desc: 'Comma-separated vehicle type IDs to restrict results. Values: Car, Truck.' },
  { name: 'minPowerKW', type: 'float', desc: 'Minimum connector power in kW for EV charging station results. Filters out low-power chargers.' },
  { name: 'maxPowerKW', type: 'float', desc: 'Maximum connector power in kW for EV charging station results.' },
  { name: 'topLeft', type: 'string', desc: 'Bounding box top-left corner as "lat,lon". Hard filter — results outside are excluded. Example: 52.43,4.73. Use with btmRight.' },
  { name: 'btmRight', type: 'string', desc: 'Bounding box bottom-right corner as "lat,lon". Hard filter. Example: 52.28,5.11. Use with topLeft.' },
  { name: 'geobias', type: 'string', desc: 'Soft location bias (ranking only, not filtering). Formats: point:lat,lon or rectangle:topLeftLat,topLeftLon,btmRightLat,btmRightLon. Mutually exclusive with lat/lon for ranking.' },
  { name: 'openingHours', type: 'string', values: ['nextSevenDays'], desc: 'Include opening hours in results. nextSevenDays returns the schedule for the next 7 days.' },
  { name: 'timeZone', type: 'string', desc: 'IANA time zone ID for interpreting openingHours. Example: Europe/Amsterdam.' },
  { name: 'mapcodes', type: 'boolean', desc: 'When true, includes Mapcode strings in the response for each result.' },
  { name: 'language', type: 'string (IETF)', default: 'en-GB', desc: 'Language for POI names and address strings.' },
  { name: 'countrySet', type: 'string', desc: 'Comma-separated ISO 3166-1 alpha-2 codes to restrict results to specific countries.' },
  { name: 'extendedPostalCodesFor', type: 'string', desc: 'Comma-separated index types to include extended postal codes in results. Values: POI, PAD, Addr, Geo, Str, Xstr, or None.' },
  { name: 'relatedPois', type: 'string', default: 'off', values: ['off', 'child', 'parent', 'all'], desc: 'Include related POI records such as child entities or parent locations.' },
  { name: 'entityTypeSet', type: 'string', desc: 'Comma-separated entity types to filter Geography results. Values: Country, CountrySubdivision, CountrySecondarySubdivision, Municipality, MunicipalitySubdivision, Neighbourhood, PostalCodeArea.' },
  { name: 'view', type: 'string', values: ['Unified', 'AR', 'IN', 'MA', 'PK', 'RU', 'TR', 'CN'], desc: 'Geopolitical view for disputed territories.' },
];

/* ─── v2-only parameters ─────────────────────────────────────────────────── */
const PARAMS_V2_ONLY = [
  { name: 'apiVersion', required: true, type: 'string', desc: 'Orbis Maps API version. Must be "1". Alternatively pass TomTom-Api-Version: 1 as a request header.' },
];

/* ─── Response fields ────────────────────────────────────────────────────── */
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

/* ─── Code examples ──────────────────────────────────────────────────────── */
const CODE_V1 = `# Nearby Search — petrol stations within 2 km (v1 TomTom Maps)
curl "https://api.tomtom.com/search/2/nearbySearch/.json\\
?key=YOUR_API_KEY\\
&lat=48.8566&lon=2.3522\\
&radius=2000\\
&categorySet=7311\\
&limit=10\\
&language=fr-FR"`;

const CODE_V2 = `# Nearby Search — petrol stations within 2 km (v2 Orbis Maps)
curl "https://api.tomtom.com/maps/orbis/places/nearbySearch/.json\\
?key=YOUR_API_KEY\\
&apiVersion=1\\
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

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function SearchNearby({ onNavigate }) {
  const [tab, setTab] = useState('v1');
  const v2Params = [...PARAMS_V2_ONLY, ...PARAMS_SHARED];

  return (
    <div className="page page--wide">
      <div className="page-header page-header--with-tabs">
        <h1>Nearby Search</h1>
        <PageActions pageId="search-nearby" pageTitle="Nearby Search" />
        <VersionTabBar versions={['v1', 'v2']} activeTab={tab} onTabChange={setTab} />
      </div>
      <p className="quick-answer">
        Discover Points of Interest within a configurable radius around a coordinate — no text
        query required. Results are sorted by distance and can be filtered by category, brand,
        and connector type.
      </p>

      {tab === 'v1' && (
        <ApiRefTwoCol
          sections={[
            {
              id: 'request',
              heading: 'Request',
              method: 'GET',
              demoId: 'nearby-search',
              note: 'https://api.tomtom.com/search/2/nearbySearch/.json — Note the path ends with a literal dot before .json; there is no query segment.',
              params: PARAMS_SHARED,
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
              method: 'GET',
              note: 'https://api.tomtom.com/maps/orbis/places/nearbySearch/.json  — Public Preview. Note the path ends with a literal dot before .json; there is no query segment.',
              params: v2Params,
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
