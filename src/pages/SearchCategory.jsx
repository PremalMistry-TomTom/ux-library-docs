import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Category Search parameters ─────────────────────────────────────────────── */
const PARAMS_SEARCH = [
  { name: 'query', required: true, type: 'string (path)', desc: 'Category name or keyword to search (e.g. "restaurant", "hospital", "petrol station"). URL-encoded.' },
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'limit', type: 'integer', default: 10, desc: 'Maximum number of results to return (1–100).' },
  { name: 'lat', type: 'float', desc: 'Latitude for geographic search bias. Must be paired with lon.' },
  { name: 'lon', type: 'float', desc: 'Longitude for search bias. Must be paired with lat.' },
  { name: 'radius', type: 'integer', desc: 'Search radius in metres around lat/lon centre point.' },
  { name: 'language', type: 'string (IETF)', default: 'en-GB', desc: 'Language for result names and addresses.' },
  { name: 'countrySet', type: 'string', desc: 'Comma-separated ISO 3166-1 alpha-2 country codes to restrict results.' },
  { name: 'openingHours', type: 'string', values: ['nextSevenDays'], desc: 'Include opening hours. nextSevenDays returns the schedule for the next 7 days from request time.' },
  { name: 'view', type: 'string', values: ['Unified', 'AR', 'IN', 'MA', 'PK', 'RU', 'TR', 'CN'], desc: 'Geopolitical view for disputed territories.' },
  { name: 'boundingBox', type: 'string', desc: 'Restrict results to a bounding box: minLon,minLat,maxLon,maxLat.' },
  { name: 'categorySet', type: 'string', desc: 'Comma-separated category IDs to narrow results to specific sub-types. Use the POI Categories endpoint to retrieve valid IDs.' },
];

/* ─── POI Categories parameters ─────────────────────────────────────────────── */
const PARAMS_CATEGORIES = [
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'language', type: 'string (IETF)', default: 'en-GB', desc: 'Language for category names and aliases in the response.' },
];

/* ─── Response fields: Category Search ──────────────────────────────────────── */
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

/* ─── Response fields: POI Categories ───────────────────────────────────────── */
const RESPONSE_FIELDS_CATEGORIES = [
  { name: 'poiCategories', type: 'array', desc: 'Flat list of all available POI category objects.' },
  { name: 'poiCategories[].id', type: 'integer', desc: 'Unique numeric category ID. Use in categorySet parameters across all Search API endpoints.' },
  { name: 'poiCategories[].name', type: 'string', desc: 'Primary category name in the requested language.' },
  { name: 'poiCategories[].childCategoryIds', type: 'integer[]', desc: 'IDs of subcategories that belong to this category.' },
  { name: 'poiCategories[].synonyms', type: 'string[]', desc: 'Alternative names and aliases that resolve to this category.' },
];

/* ─── Code examples ──────────────────────────────────────────────────────────── */
const CODE = `# Category Search — hospitals near Berlin
curl "https://api.tomtom.com/search/2/categorySearch/hospital.json\\
?key=YOUR_API_KEY\\
&lat=52.5200&lon=13.4050\\
&radius=10000\\
&limit=5\\
&language=de-DE"

# List all available POI category IDs
curl "https://api.tomtom.com/search/2/poiCategories.json\\
?key=YOUR_API_KEY&language=en-GB"`;

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

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function SearchCategory({ onNavigate }) {
  return (
    <ApiRefTwoCol
      title="Category Search"
      description="Find Points of Interest by category type — restaurants, hospitals, petrol stations, and hundreds of other types. Also documents the POI Categories endpoint for retrieving all valid category IDs to use in categorySet filters."
      version="v2"
      sections={[
        {
          id: 'category-search',
          heading: 'Category Search Request',
          method: 'GET',
          note: 'https://api.tomtom.com/search/2/categorySearch/{query}.json',
          params: PARAMS_SEARCH,
          code: CODE,
          lang: 'bash',
        },
        {
          id: 'poi-categories',
          heading: 'POI Categories Request',
          method: 'GET',
          note: 'https://api.tomtom.com/search/2/poiCategories.json — Returns the complete list of category IDs and names. Use these IDs in the categorySet parameter on any Search API endpoint.',
          params: PARAMS_CATEGORIES,
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
        {
          id: 'response-categories',
          heading: 'POI Categories Response',
          params: RESPONSE_FIELDS_CATEGORIES,
          code: CODE_RESPONSE,
          lang: 'json',
        },
      ]}
    />
  );
}
