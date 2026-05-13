import { useState } from 'react';
import PageActions from '../components/ui/PageActions';
import VersionTabBar from '../components/ui/VersionTabBar';
import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Shared request parameters (v1 + v2) ─────────────────────────────────── */
const PARAMS_SHARED = [
  { name: 'geometryList', required: true, type: 'JSON array', desc: 'List of geometry objects to search within. Supported types: POLYGON (with a vertices array of "lat,lon" strings) and CIRCLE (with a position "lat,lon" string and a radius in metres). Up to 50 geometries, each with up to 50 vertices. For POST requests the array is sent in the request body; for GET requests it is URL-encoded in the query string.' },
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'query', type: 'string', desc: 'Optional free-text query string (e.g. "pizza"). Must be properly URL-encoded. Omit to return all POIs within the geometry.' },
  { name: 'limit', type: 'integer', default: 10, desc: 'Maximum number of results to return (1–100).' },
  { name: 'language', type: 'string (IETF)', desc: 'Language for result names and address strings. When data is unavailable in the requested language, the best-matched language is used.' },
  { name: 'idxSet', type: 'string', desc: 'Comma-separated index set to restrict result types (e.g. POI, PAD, Geo). Default returns POI results only.' },
  { name: 'categorySet', type: 'string', desc: 'Comma-separated POI category IDs to filter results. Use the POI Categories endpoint for valid IDs.' },
  { name: 'brandSet', type: 'string', desc: 'Comma-separated brand names to restrict results to known chains (e.g. Shell,BP).' },
  { name: 'connectorSet', type: 'string', desc: 'Comma-separated EV connector type IDs to filter EV charging station results.' },
  { name: 'fuelSet', type: 'string', desc: 'Comma-separated fuel type IDs to filter fuel station results. Example: Petrol, Diesel, LPG.' },
  { name: 'vehicleTypeSet', type: 'string', desc: 'Comma-separated vehicle type IDs to restrict results. Values: Car, Truck.' },
  { name: 'minPowerKW', type: 'float', desc: 'Minimum connector power in kW for EV charging station results.' },
  { name: 'maxPowerKW', type: 'float', desc: 'Maximum connector power in kW for EV charging station results.' },
  { name: 'topLeft', type: 'string', desc: 'Bounding box top-left corner as "lat,lon". Hard filter — results outside are excluded. Example: 52.43,4.73. Use with btmRight.' },
  { name: 'btmRight', type: 'string', desc: 'Bounding box bottom-right corner as "lat,lon". Hard filter. Example: 52.28,5.11. Use with topLeft.' },
  { name: 'geobias', type: 'string', desc: 'Location preference to bias results. Formats: point:lat,lon or rectangle:topLeftLat,topLeftLon,btmRightLat,btmRightLon. Mutually exclusive with lat/lon for ranking.' },
  { name: 'lat', type: 'float', desc: 'Latitude for result bias (-90 to +90). Mutually exclusive with geobias.' },
  { name: 'lon', type: 'float', desc: 'Longitude for result bias (-180 to +180). Mutually exclusive with geobias.' },
  { name: 'openingHours', type: 'string', values: ['nextSevenDays'], desc: 'Include opening hours in results. nextSevenDays returns the schedule for the next 7 days from the current local time of the POI.' },
  { name: 'timeZone', type: 'string', desc: 'IANA time zone ID for interpreting openingHours. Example: Europe/Amsterdam.' },
  { name: 'mapcodes', type: 'boolean', desc: 'When true, includes Mapcode strings in the response for each result.' },
  { name: 'extendedPostalCodesFor', type: 'string', desc: 'Comma-separated index types for which extended postal codes are included (e.g. POI, PAD). Use None to exclude all. Geo is excluded by default.' },
  { name: 'relatedPois', type: 'string', default: 'off', values: ['off', 'child', 'parent', 'all'], desc: 'Include related POI records. child returns child entities, parent returns parent locations, all returns both.' },
  { name: 'entityTypeSet', type: 'string', desc: 'Comma-separated entity types to filter Geography results (e.g. Country, Municipality, PostalCodeArea).' },
  { name: 'view', type: 'string', values: ['Unified', 'AR', 'IL', 'IN', 'MA', 'PK', 'RU', 'RS', 'TR', 'TW', 'CN'], desc: 'Geopolitical view for disputed territories.' },
];

/* ─── v2-only parameters ─────────────────────────────────────────────────── */
const PARAMS_V2_ONLY = [
  { name: 'apiVersion', required: true, type: 'string', desc: 'Orbis Maps API version. Must be "1". Alternatively pass TomTom-Api-Version: 1 as a request header.' },
];

/* ─── Response fields ────────────────────────────────────────────────────── */
const RESPONSE_FIELDS = [
  { name: 'summary', type: 'object', desc: 'Metadata about the query: queryType, queryTime, numResults, totalResults, offset, and fuzzyLevel.' },
  { name: 'summary.query', type: 'string', desc: 'The query string used, or "n/a" when no text query was supplied.' },
  { name: 'summary.queryType', type: 'string', desc: 'Always NON_NEAR for geometry search.' },
  { name: 'summary.queryTime', type: 'integer', desc: 'Time taken to process the request in milliseconds.' },
  { name: 'summary.numResults', type: 'integer', desc: 'Number of results returned in this response page.' },
  { name: 'summary.totalResults', type: 'integer', desc: 'Total number of results matched across all pages.' },
  { name: 'results', type: 'array', desc: 'Array of POI or other entity results that fall within the supplied geometries.' },
  { name: 'results[].type', type: 'string', desc: 'Result type — POI, Street, Geography, Point Address, Address Range, or Cross Street.' },
  { name: 'results[].id', type: 'string', desc: 'Unique entity ID. Can be passed to Place by ID for detailed enrichment.' },
  { name: 'results[].score', type: 'float', desc: 'Relevance score for the result.' },
  { name: 'results[].poi', type: 'object', desc: 'POI data block (present for type=POI results).', children: [
    { name: 'poi.name', type: 'string', desc: 'Display name of the POI.' },
    { name: 'poi.phone', type: 'string', desc: 'Contact phone number.' },
    { name: 'poi.url', type: 'string', desc: 'Website URL.' },
    { name: 'poi.brands', type: 'object[]', desc: 'Array of { name } brand objects.' },
    { name: 'poi.categorySet', type: 'object[]', desc: 'Array of { id } category identifier objects.' },
    { name: 'poi.categories', type: 'string[]', desc: 'Human-readable category names (e.g. "pizza", "restaurant").' },
    { name: 'poi.openingHours', type: 'object', desc: 'Opening schedule when openingHours=nextSevenDays is requested.' },
  ]},
  { name: 'results[].address', type: 'object', desc: 'Structured address: streetName, streetNumber, municipality, postalCode, countryCode, freeformAddress.' },
  { name: 'results[].position', type: 'object', desc: '{ lat, lon } coordinates of the result.' },
  { name: 'results[].viewport', type: 'object', desc: 'Suggested map viewport bounding box with topLeftPoint and btmRightPoint.' },
  { name: 'results[].entryPoints', type: 'array', desc: 'Physical access points with type and position.' },
];

/* ─── Code examples ──────────────────────────────────────────────────────── */
const CODE_V1 = `# Geometry Search — pizza places within a polygon and a circle (v1 TomTom Maps)
curl -X POST \\
  -H "Content-Type: application/json" \\
  -d '{
    "geometryList": [
      {
        "type": "POLYGON",
        "vertices": [
          "37.7524,-122.4358",
          "37.7066,-122.4330",
          "37.7121,-122.3643",
          "37.7535,-122.3740"
        ]
      },
      {
        "type": "CIRCLE",
        "position": "37.7121,-121.3643",
        "radius": 6000
      }
    ]
  }' \\
  "https://api.tomtom.com/search/2/geometrySearch/pizza.json?key=YOUR_API_KEY&limit=5&language=en-GB"`;

const CODE_V2 = `# Geometry Search — pizza places within a polygon and a circle (v2 Orbis Maps)
curl -X POST \\
  -H "Content-Type: application/json" \\
  -d '{
    "geometryList": [
      {
        "type": "POLYGON",
        "vertices": [
          "37.7524,-122.4358",
          "37.7066,-122.4330",
          "37.7121,-122.3643",
          "37.7535,-122.3740"
        ]
      },
      {
        "type": "CIRCLE",
        "position": "37.7121,-121.3643",
        "radius": 6000
      }
    ]
  }' \\
  "https://api.tomtom.com/maps/orbis/places/geometrySearch/pizza.json?key=YOUR_API_KEY&apiVersion=1&limit=5&language=en-GB"`;

const CODE_RESPONSE = `{
  "summary": {
    "query": "pizza",
    "queryType": "NON_NEAR",
    "queryTime": 31,
    "numResults": 3,
    "offset": 0,
    "totalResults": 14,
    "fuzzyLevel": 1
  },
  "results": [
    {
      "type": "POI",
      "id": "g6JpZK84MDAwNjEwMDE4NjUxNDKhY6NVU0GhdqdVbmlmaWVk",
      "score": 5.0,
      "poi": {
        "name": "Upper Crust Pizza & Pasta",
        "phone": "+(1)-(831)-4762333",
        "url": "www.uppercrustsc.com",
        "brands": [{ "name": "Upper Crust" }],
        "categorySet": [{ "id": 7315015 }],
        "categories": ["pizza", "restaurant"]
      },
      "address": {
        "streetName": "Mission Street",
        "streetNumber": "1246",
        "municipality": "Santa Cruz",
        "postalCode": "95060",
        "countryCode": "US",
        "country": "United States",
        "freeformAddress": "1246 Mission Street, Santa Cruz, CA 95060"
      },
      "position": { "lat": 37.7524, "lon": -122.4358 },
      "viewport": {
        "topLeftPoint": { "lat": 37.7534, "lon": -122.4368 },
        "btmRightPoint": { "lat": 37.7514, "lon": -122.4348 }
      },
      "entryPoints": [
        { "type": "main", "position": { "lat": 37.7523, "lon": -122.4357 } }
      ]
    }
  ]
}`;

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function SearchGeometry({ onNavigate }) {
  const [tab, setTab] = useState('v1');
  const v2Params = [...PARAMS_V2_ONLY, ...PARAMS_SHARED];

  return (
    <div className="page page--wide">
      <div className="page-header page-header--with-tabs">
        <h1>Geometry Search</h1>
        <PageActions pageId="search-geometry" pageTitle="Geometry Search" />
        <VersionTabBar versions={['v1', 'v2']} activeTab={tab} onTabChange={setTab} />
      </div>
      <p className="quick-answer">
        Search for Points of Interest and other place types within one or more geometric areas.
        Supports POLYGON shapes defined by vertices and CIRCLE shapes defined by a centre position
        and radius. POST is recommended for all datasets; GET may only be used for small payloads.
      </p>

      {tab === 'v1' && (
        <ApiRefTwoCol
          sections={[
            {
              id: 'request',
              heading: 'Request',
              method: 'GET',
              note: 'https://api.tomtom.com/search/2/geometrySearch/{query}.json — POST the geometryList array in the request body as JSON. For GET requests, URL-encode the geometryList array as a query parameter.',
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
              note: 'https://api.tomtom.com/maps/orbis/places/geometrySearch/{query}.json  — Public Preview. POST the geometryList array in the request body as JSON. For GET requests, URL-encode the geometryList array as a query parameter.',
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
