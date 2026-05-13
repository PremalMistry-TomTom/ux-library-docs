import { useState } from 'react';
import PageActions from '../components/ui/PageActions';
import VersionTabBar from '../components/ui/VersionTabBar';
import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Shared request parameters (v1 + v2) ─────────────────────────────────── */
const PARAMS_SHARED = [
  { name: 'query', required: true, type: 'string (path)', desc: 'Free-form search text — address, POI name, brand, category, or coordinate string. URL-encoded. Appended before the extension in the path: /search/{query}.json.' },
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key. Passed as a query parameter.' },
  { name: 'typeahead', type: 'boolean', default: false, desc: 'Enable typeahead (partial query) mode. Returns ranked suggestions for incomplete query strings — ideal for instant-search UIs.' },
  { name: 'limit', type: 'integer', default: 10, desc: 'Maximum number of results to return (1–100).' },
  { name: 'countrySet', type: 'string', desc: 'Comma-separated ISO 3166-1 alpha-2 or alpha-3 country codes to restrict results. Example: US,CA or USA,CAN.' },
  { name: 'lat', type: 'float', desc: 'Latitude for geographic point bias. Range −90 to 90. Mutually exclusive with geobias. Use with lon. Without radius, biases (non-filtering); with radius, filters to a circle.' },
  { name: 'lon', type: 'float', desc: 'Longitude for geographic point bias. Range −180 to 180. Required when lat is provided.' },
  { name: 'radius', type: 'integer', desc: 'Restricts results to within N metres of the lat/lon point. Requires lat and lon.' },
  { name: 'topLeft', type: 'string', desc: 'Hard bounding box top-left corner as "lat,lon". Results outside the box are excluded. Example: 52.43123,4.7289. Use with btmRight.' },
  { name: 'btmRight', type: 'string', desc: 'Hard bounding box bottom-right corner as "lat,lon". Results outside the box are excluded. Example: 52.27801,5.10767. Use with topLeft.' },
  { name: 'geobias', type: 'string', desc: 'Soft location preference. Does not filter results, only adjusts ranking. Formats: point:lat,lon or rectangle:topLeftLat,topLeftLon,btmRightLat,btmRightLon. Mutually exclusive with lat/lon for ranking purposes.' },
  { name: 'language', type: 'string (IETF)', default: 'en-GB', desc: 'Language for result names and address strings. Example: nl-NL, de-DE, fr-FR.' },
  { name: 'idxSet', type: 'string', desc: 'Comma-separated index types to restrict results. Values: POI, PAD (point address), Str (street), Xstr (cross street), Geo (geography), Addr (interpolated address).' },
  { name: 'extendedPostalCodesFor', type: 'string', desc: 'Comma-separated index types to include extended postal codes in results. Values: POI, PAD, Addr, Geo, Str, Xstr, or None.' },
  { name: 'categorySet', type: 'string', desc: 'Comma-separated POI category IDs to filter results to specific types. Use the POI Categories endpoint to obtain valid IDs.' },
  { name: 'brandSet', type: 'string', desc: 'Comma-separated brand names to filter POI results. Example: McDonald\'s,Burger King.' },
  { name: 'connectorSet', type: 'string', desc: 'Comma-separated EV connector type IDs. Filters results to EV charging stations with at least one matching connector type.' },
  { name: 'fuelSet', type: 'string', desc: 'Comma-separated fuel type IDs to filter fuel station results. Example: Petrol, Diesel, LPG.' },
  { name: 'vehicleTypeSet', type: 'string', desc: 'Comma-separated vehicle type IDs to restrict results. Values: Car, Truck.' },
  { name: 'minPowerKW', type: 'float', desc: 'Minimum connector power in kW for EV charging station results. Filters out low-power chargers.' },
  { name: 'maxPowerKW', type: 'float', desc: 'Maximum connector power in kW for EV charging station results.' },
  { name: 'view', type: 'string', values: ['Unified', 'AR', 'IN', 'MA', 'PK', 'RU', 'TR', 'CN'], desc: 'Geopolitical view controlling representation of disputed territories. Defaults to Unified.' },
  { name: 'openingHours', type: 'string', values: ['nextSevenDays'], desc: 'Include opening hours in POI results. nextSevenDays returns the schedule for the next 7 days.' },
  { name: 'timeZone', type: 'string', desc: 'IANA time zone ID for interpreting openingHours results. Example: Europe/Amsterdam.' },
  { name: 'mapcodes', type: 'boolean', desc: 'When true, includes Mapcode strings in the response for each result.' },
  { name: 'entityTypeSet', type: 'string', desc: 'Comma-separated entity types to filter Geography results. Values: Country, CountrySubdivision, CountrySecondarySubdivision, Municipality, MunicipalitySubdivision, Neighbourhood, PostalCodeArea.' },
  { name: 'relatedPois', type: 'string', default: 'off', values: ['off', 'child', 'parent', 'all'], desc: 'Include related POI records (e.g. individual fuel pump bays on a petrol station). child = children only, parent = parent only, all = both.' },
];

/* ─── v1-only parameters ─────────────────────────────────────────────────── */
const PARAMS_V1_ONLY = [
  { name: 'ofs', type: 'integer', default: 0, desc: 'Pagination offset. Starting position in the result set. Use with limit for page-by-page traversal.' },
  { name: 'minFuzzyLevel', type: 'integer', default: 1, desc: 'Minimum fuzziness level for typo tolerance (1–4). 1 = exact match, 4 = high tolerance.' },
  { name: 'maxFuzzyLevel', type: 'integer', default: 2, desc: 'Maximum fuzziness level (1–4). Default is 2 for performance. Higher values match more spelling variants.' },
];

/* ─── v2-only parameters ─────────────────────────────────────────────────── */
const PARAMS_V2_ONLY = [
  { name: 'apiVersion', required: true, type: 'string', desc: 'Orbis Maps API version. Must be "1". Alternatively pass TomTom-Api-Version: 1 as a request header.' },
];

/* ─── Response fields (shared) ───────────────────────────────────────────── */
const RESPONSE_FIELDS = [
  { name: 'summary', type: 'object', desc: 'Metadata about the search request.', children: [
    { name: 'summary.query', type: 'string', desc: 'Normalised query string used internally.' },
    { name: 'summary.queryType', type: 'string', desc: 'NEARBY or NON_NEAR — whether geographic bias was applied.' },
    { name: 'summary.queryTime', type: 'integer', desc: 'Time taken to process the query in milliseconds.' },
    { name: 'summary.numResults', type: 'integer', desc: 'Number of results returned in this response.' },
    { name: 'summary.totalResults', type: 'integer', desc: 'Total number of matching results available (may be larger than limit).' },
    { name: 'summary.offset', type: 'integer', desc: 'Result offset for the current page.' },
    { name: 'summary.geoBias', type: 'object', desc: '{ lat, lon } coordinates used as the geographic centre for bias.' },
  ]},
  { name: 'results', type: 'array', desc: 'Array of search result objects, ordered by relevance score descending.' },
  { name: 'results[].type', type: 'string', desc: 'Result classification: POI, Street, Geography, Address Range, Cross Street, or Point Address.' },
  { name: 'results[].id', type: 'string', desc: 'Unique result identifier. Use with the Place by ID endpoint to retrieve enriched POI details.' },
  { name: 'results[].score', type: 'float', desc: 'Relevance score — higher is more relevant. Not comparable across different queries.' },
  { name: 'results[].dist', type: 'float', desc: 'Distance in metres from the search centre point (only present when lat/lon or geobias was provided).' },
  { name: 'results[].poi', type: 'object', desc: 'Present on POI-type results only.', children: [
    { name: 'poi.name', type: 'string', desc: 'Primary display name of the POI.' },
    { name: 'poi.phone', type: 'string', desc: 'Primary phone number.' },
    { name: 'poi.url', type: 'string', desc: 'Official website URL.' },
    { name: 'poi.categories', type: 'object[]', desc: 'Array of { id, name } category objects.' },
    { name: 'poi.brands', type: 'object[]', desc: 'Array of { name } brand objects.' },
    { name: 'poi.openingHours', type: 'object', desc: 'Opening hours object. Present when openingHours=nextSevenDays is requested.' },
  ]},
  { name: 'results[].address', type: 'object', desc: 'Structured address for the result.', children: [
    { name: 'address.streetName', type: 'string', desc: 'Street name.' },
    { name: 'address.streetNumber', type: 'string', desc: 'House or building number.' },
    { name: 'address.municipality', type: 'string', desc: 'City or town.' },
    { name: 'address.postalCode', type: 'string', desc: 'Postal or ZIP code.' },
    { name: 'address.countryCode', type: 'string', desc: 'ISO 3166-1 alpha-2 country code.' },
    { name: 'address.country', type: 'string', desc: 'Full country name.' },
    { name: 'address.freeformAddress', type: 'string', desc: 'Single-line human-readable address string.' },
  ]},
  { name: 'results[].position', type: 'object', desc: '{ lat, lon } geographic coordinates of the result centroid.' },
  { name: 'results[].viewport', type: 'object', desc: 'Suggested map viewport bounding box: { topLeftPoint: {lat,lon}, btmRightPoint: {lat,lon} }.' },
  { name: 'results[].entryPoints', type: 'array', desc: 'Array of physical entry point locations for the POI (e.g. parking entrances), each with type and position.' },
];

/* ─── Code examples ──────────────────────────────────────────────────────── */
const CODE_V1 = `# Fuzzy search — pizza near Amsterdam (v1 TomTom Maps)
curl "https://api.tomtom.com/search/2/search/pizza.json\\
?key=YOUR_API_KEY\\
&lat=52.3731&lon=4.8922\\
&radius=5000\\
&limit=5\\
&openingHours=nextSevenDays"`;

const CODE_V2 = `# Fuzzy search — pizza near Amsterdam (v2 Orbis Maps)
curl "https://api.tomtom.com/maps/orbis/places/search/pizza.json\\
?key=YOUR_API_KEY\\
&apiVersion=1\\
&geobias=point:52.3731,4.8922\\
&radius=5000\\
&limit=5\\
&openingHours=nextSevenDays"`;

const CODE_RESPONSE = `{
  "summary": {
    "query": "pizza",
    "queryType": "NEARBY",
    "queryTime": 43,
    "numResults": 5,
    "totalResults": 234,
    "offset": 0,
    "geoBias": { "lat": 52.3731, "lon": 4.8922 }
  },
  "results": [
    {
      "type": "POI",
      "id": "528009010952022",
      "score": 2.9803,
      "dist": 312.5,
      "poi": {
        "name": "Pizza Hut",
        "phone": "+31 20 123 4567",
        "url": "https://www.pizzahut.nl",
        "categories": [{ "id": "7315036", "name": "pizza restaurant" }],
        "brands": [{ "name": "Pizza Hut" }],
        "openingHours": {
          "mode": "nextSevenDays",
          "timeRanges": [
            {
              "startTime": { "date": "2026-05-12", "hour": 11, "minute": 0 },
              "endTime":   { "date": "2026-05-12", "hour": 23, "minute": 0 }
            }
          ]
        }
      },
      "address": {
        "streetName": "Damstraat", "streetNumber": "12",
        "municipality": "Amsterdam", "postalCode": "1012 JL",
        "countryCode": "NL", "country": "Netherlands",
        "freeformAddress": "Damstraat 12, 1012 JL Amsterdam"
      },
      "position": { "lat": 52.3731, "lon": 4.8920 },
      "viewport": {
        "topLeftPoint": { "lat": 52.3741, "lon": 4.8910 },
        "btmRightPoint": { "lat": 52.3721, "lon": 4.8930 }
      },
      "entryPoints": [
        { "type": "main", "position": { "lat": 52.37308, "lon": 4.89198 } }
      ]
    }
  ]
}`;

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function SearchFuzzy({ onNavigate }) {
  const [tab, setTab] = useState('v1');
  const v1Params = [...PARAMS_SHARED, ...PARAMS_V1_ONLY];
  const v2Params = [...PARAMS_V2_ONLY, ...PARAMS_SHARED];

  return (
    <div className="page page--wide">
      <div className="page-header page-header--with-tabs">
        <h1>Fuzzy Search</h1>
        <PageActions pageId="search-fuzzy" pageTitle="Fuzzy Search" />
        <VersionTabBar versions={['v1', 'v2']} activeTab={tab} onTabChange={setTab} />
      </div>
      <p className="quick-answer">
        Single unified endpoint that resolves free-form text — addresses, POI names, brands,
        categories, and coordinates — in one call. Supports typo tolerance via configurable
        fuzziness levels. Ideal as a general-purpose search bar backend.
      </p>

      {tab === 'v1' && (
        <ApiRefTwoCol
          sections={[
            {
              id: 'request',
              heading: 'Request',
              method: 'GET',
              demoId: 'fuzzy-search',
              note: 'https://api.tomtom.com/search/2/search/{query}.json',
              params: v1Params,
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
              note: 'https://api.tomtom.com/maps/orbis/places/search/{query}.json  — Public Preview',
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
