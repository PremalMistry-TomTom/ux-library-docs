import { useState } from 'react';
import PageActions from '../components/ui/PageActions';
import VersionTabBar from '../components/ui/VersionTabBar';
import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Category Search parameters (shared v1 + v2) ────────────────────────── */
const PARAMS_SEARCH = [
  { name: 'query', required: true, type: 'string (path)', desc: 'Category name or keyword to search (e.g. "restaurant", "hospital", "petrol station"). URL-encoded.' },
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'limit', type: 'integer', default: 10, desc: 'Maximum number of results to return (1–100).' },
  { name: 'lat', type: 'float', desc: 'Latitude for geographic search bias. Must be paired with lon.' },
  { name: 'lon', type: 'float', desc: 'Longitude for search bias. Must be paired with lat.' },
  { name: 'radius', type: 'integer', desc: 'Search radius in metres around lat/lon centre point.' },
  { name: 'language', type: 'string (IETF)', default: 'en-GB', desc: 'Language for result names and addresses.' },
  { name: 'countrySet', type: 'string', desc: 'Comma-separated ISO 3166-1 alpha-2 country codes to restrict results.' },
  { name: 'categorySet', type: 'string', desc: 'Comma-separated category IDs to narrow results to specific sub-types. Use the POI Categories endpoint to retrieve valid IDs.' },
  { name: 'brandSet', type: 'string', desc: 'Comma-separated brand names to filter POI results. Example: McDonald\'s,Burger King.' },
  { name: 'connectorSet', type: 'string', desc: 'Comma-separated EV connector type IDs. Filters results to EV charging stations with at least one matching connector type.' },
  { name: 'fuelSet', type: 'string', desc: 'Comma-separated fuel type IDs to filter fuel station results. Example: Petrol, Diesel, LPG.' },
  { name: 'vehicleTypeSet', type: 'string', desc: 'Comma-separated vehicle type IDs to restrict results. Values: Car, Truck.' },
  { name: 'minPowerKW', type: 'float', desc: 'Minimum connector power in kW for EV charging station results.' },
  { name: 'maxPowerKW', type: 'float', desc: 'Maximum connector power in kW for EV charging station results.' },
  { name: 'topLeft', type: 'string', desc: 'Bounding box top-left corner as "lat,lon". Hard filter — results outside are excluded. Example: 52.43,4.73. Use with btmRight.' },
  { name: 'btmRight', type: 'string', desc: 'Bounding box bottom-right corner as "lat,lon". Hard filter. Example: 52.28,5.11. Use with topLeft.' },
  { name: 'geobias', type: 'string', desc: 'Soft location bias (ranking only, not filtering). Formats: point:lat,lon or rectangle:topLeftLat,topLeftLon,btmRightLat,btmRightLon. Mutually exclusive with lat/lon for ranking.' },
  { name: 'openingHours', type: 'string', values: ['nextSevenDays'], desc: 'Include opening hours. nextSevenDays returns the schedule for the next 7 days from request time.' },
  { name: 'timeZone', type: 'string', desc: 'IANA time zone ID for interpreting openingHours. Example: Europe/Amsterdam.' },
  { name: 'mapcodes', type: 'boolean', desc: 'When true, includes Mapcode strings in the response for each result.' },
  { name: 'view', type: 'string', values: ['Unified', 'AR', 'IN', 'MA', 'PK', 'RU', 'TR', 'CN'], desc: 'Geopolitical view for disputed territories.' },
];

/* ─── v2-only parameters ─────────────────────────────────────────────────── */
const PARAMS_V2_ONLY = [
  { name: 'apiVersion', required: true, type: 'string', desc: 'Orbis Maps API version. Must be "1". Alternatively pass TomTom-Api-Version: 1 as a request header.' },
];

/* ─── POI Categories parameters ─────────────────────────────────────────── */
const PARAMS_CATEGORIES = [
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'language', type: 'string (IETF)', default: 'en-GB', desc: 'Language for category names and aliases in the response.' },
];

/* ─── Response fields: Category Search ──────────────────────────────────── */
const RESPONSE_FIELDS = [
  { name: 'summary', type: 'object', desc: 'Query metadata: numResults, totalResults, queryTime, geoBias.' },
  { name: 'results', type: 'array', desc: 'Array of POI result objects matching the category query.' },
  { name: 'results[].type', type: 'string', desc: 'Always POI for category search results.' },
  { name: 'results[].id', type: 'string', desc: 'Unique entity ID for use with Place by ID.' },
  { name: 'results[].score', type: 'float', desc: 'Relevance score.' },
  { name: 'results[].dist', type: 'float', desc: 'Distance in metres from search centre (when lat/lon provided).' },
  { name: 'results[].poi', type: 'object', desc: 'POI data block.', children: [
    { name: 'poi.name', type: 'string', desc: 'POI display name.' },
    { name: 'poi.phone', type: 'string', desc: 'Contact phone number.' },
    { name: 'poi.categories', type: 'object[]', desc: 'Array of { id, name } category objects.' },
    { name: 'poi.openingHours', type: 'object', desc: 'Opening hours with mode and timeRanges[] when requested.' },
  ]},
  { name: 'results[].address', type: 'object', desc: 'Structured address: streetName, municipality, postalCode, countryCode, freeformAddress.' },
  { name: 'results[].position', type: 'object', desc: '{ lat, lon } coordinates of the result.' },
];

/* ─── Response fields: POI Categories ───────────────────────────────────── */
const RESPONSE_FIELDS_CATEGORIES = [
  { name: 'poiCategories', type: 'array', desc: 'Flat list of all available POI category objects.' },
  { name: 'poiCategories[].id', type: 'integer', desc: 'Unique numeric category ID. Use in categorySet parameters across all Search API endpoints.' },
  { name: 'poiCategories[].name', type: 'string', desc: 'Primary category name in the requested language.' },
  { name: 'poiCategories[].childCategoryIds', type: 'integer[]', desc: 'IDs of subcategories that belong to this category.' },
  { name: 'poiCategories[].synonyms', type: 'string[]', desc: 'Alternative names and aliases that resolve to this category.' },
];

/* ─── Code examples ──────────────────────────────────────────────────────── */
const CODE_V1 = `# Category Search — hospitals near Berlin (v1 TomTom Maps)
curl "https://api.tomtom.com/search/2/categorySearch/hospital.json\\
?key=YOUR_API_KEY\\
&lat=52.5200&lon=13.4050\\
&radius=10000\\
&limit=5\\
&language=de-DE"

# List all available POI category IDs
curl "https://api.tomtom.com/search/2/poiCategories.json\\
?key=YOUR_API_KEY&language=en-GB"`;

const CODE_V2 = `# Category Search — hospitals near Berlin (v2 Orbis Maps)
curl "https://api.tomtom.com/maps/orbis/places/categorySearch/hospital.json\\
?key=YOUR_API_KEY\\
&apiVersion=1\\
&geobias=point:52.5200,13.4050\\
&radius=10000\\
&limit=5\\
&language=de-DE"

# List all available POI category IDs (Orbis)
curl "https://api.tomtom.com/maps/orbis/places/poiCategories.json\\
?key=YOUR_API_KEY&apiVersion=1&language=en-GB"`;

const CODE_RESPONSE = `// categorySearch response
{
  "summary": {
    "query": "hospital",
    "queryType": "NEARBY",
    "queryTime": 52,
    "numResults": 5,
    "totalResults": 38
  },
  "results": [
    {
      "type": "POI",
      "id": "276009001987654",
      "score": 2.7418,
      "dist": 843.2,
      "poi": {
        "name": "Charité – Universitätsmedizin Berlin",
        "phone": "+49 30 450 50",
        "categories": [
          { "id": "7321", "name": "hospital" }
        ]
      },
      "address": {
        "streetName": "Charitéplatz",
        "streetNumber": "1",
        "municipality": "Berlin",
        "postalCode": "10117",
        "countryCode": "DE",
        "freeformAddress": "Charitéplatz 1, 10117 Berlin"
      },
      "position": { "lat": 52.5247, "lon": 13.3789 }
    }
  ]
}

// poiCategories response
{
  "poiCategories": [
    {
      "id": 7321,
      "name": "hospital",
      "childCategoryIds": [7321005, 7321010],
      "synonyms": ["clinic", "medical center", "emergency room"]
    },
    {
      "id": 9361065,
      "name": "coffee shop",
      "childCategoryIds": [],
      "synonyms": ["café", "coffeehouse", "espresso bar"]
    }
  ]
}`;

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function SearchCategory({ onNavigate }) {
  const [tab, setTab] = useState('v1');
  const v2SearchParams = [...PARAMS_V2_ONLY, ...PARAMS_SEARCH];

  return (
    <div className="page page--wide">
      <div className="page-header page-header--with-tabs">
        <h1>Category Search</h1>
        <PageActions pageId="search-category" pageTitle="Category Search" />
        <VersionTabBar versions={['v1', 'v2']} activeTab={tab} onTabChange={setTab} />
      </div>
      <p className="quick-answer">
        Find Points of Interest by category type — restaurants, hospitals, petrol stations, and
        hundreds of other types. Also documents the POI Categories endpoint for retrieving all
        valid category IDs to use in categorySet filters.
      </p>

      {tab === 'v1' && (
        <ApiRefTwoCol
          sections={[
            {
              id: 'category-search',
              heading: 'Category Search Request',
              method: 'GET',
              note: 'https://api.tomtom.com/search/2/categorySearch/{query}.json',
              params: PARAMS_SEARCH,
              code: CODE_V1,
              lang: 'bash',
            },
            {
              id: 'poi-categories',
              heading: 'POI Categories Request',
              method: 'GET',
              note: 'https://api.tomtom.com/search/2/poiCategories.json — Returns the complete list of category IDs and names. Use these IDs in the categorySet parameter on any Search API endpoint.',
              params: PARAMS_CATEGORIES,
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
            {
              id: 'response-categories',
              heading: 'POI Categories Response',
              params: RESPONSE_FIELDS_CATEGORIES,
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
              id: 'category-search-v2',
              heading: 'Category Search Request',
              method: 'GET',
              note: 'https://api.tomtom.com/maps/orbis/places/categorySearch/{query}.json  — Public Preview',
              params: v2SearchParams,
              code: CODE_V2,
              lang: 'bash',
            },
            {
              id: 'poi-categories-v2',
              heading: 'POI Categories Request',
              method: 'GET',
              note: 'https://api.tomtom.com/maps/orbis/places/poiCategories.json — Returns the complete list of category IDs and names. Use these IDs in the categorySet parameter on any Search API endpoint.',
              params: PARAMS_CATEGORIES,
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
            {
              id: 'response-categories-v2',
              heading: 'POI Categories Response',
              params: RESPONSE_FIELDS_CATEGORIES,
              code: CODE_RESPONSE,
              lang: 'json',
            },
          ]}
        />
      )}
    </div>
  );
}
