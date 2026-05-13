import { useState } from 'react';
import PageActions from '../components/ui/PageActions';
import VersionTabBar from '../components/ui/VersionTabBar';
import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Shared request parameters (v1 + v2) ─────────────────────────────────── */
const PARAMS_SHARED = [
  { name: 'entityId', required: true, type: 'string', desc: 'The unique identifier of the place to retrieve. Supports all entity types: POI, Street, Geography, Point Address, Address Range, and Cross Street. The id field from any Search API result can be used here.' },
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'language', type: 'string (IETF)', desc: 'Language for POI names and address strings. When data in the requested language is not available, NGT (neutral ground truth) is used.' },
  { name: 'openingHours', type: 'string', values: ['nextSevenDays'], desc: 'Include opening hours in the result. nextSevenDays returns the schedule for the next 7 days from the current local time of the POI.' },
  { name: 'timeZone', type: 'string', desc: 'IANA time zone ID for interpreting openingHours. Example: Europe/Amsterdam.' },
  { name: 'mapcodes', type: 'boolean', desc: 'When true, includes Mapcode strings in the response for each result.' },
  { name: 'relatedPois', type: 'string', default: 'off', values: ['off', 'child', 'parent', 'all'], desc: 'Include related POI records. child returns child entities (e.g. terminals within an airport), parent returns the parent location, all returns both.' },
  { name: 'view', type: 'string', values: ['Unified', 'AR', 'IL', 'IN', 'MA', 'PK', 'RU', 'RS', 'TR', 'TW', 'CN'], default: 'Unified', desc: 'Geopolitical view for disputed territories.' },
];

/* ─── v2-only parameters ─────────────────────────────────────────────────── */
const PARAMS_V2_ONLY = [
  { name: 'apiVersion', required: true, type: 'string', desc: 'Orbis Maps API version. Must be "1". Alternatively pass TomTom-Api-Version: 1 as a request header.' },
];

/* ─── Response fields ────────────────────────────────────────────────────── */
const RESPONSE_FIELDS = [
  { name: 'summary', type: 'object', desc: 'Metadata about the lookup: queryType, queryTime, numResults.' },
  { name: 'summary.queryType', type: 'string', desc: 'Always NEARBY or ID_LOOKUP for a Place by ID request.' },
  { name: 'summary.queryTime', type: 'integer', desc: 'Time taken to process the request in milliseconds.' },
  { name: 'summary.numResults', type: 'integer', desc: 'Number of results returned (1 for a successful lookup).' },
  { name: 'results', type: 'array', desc: 'Array containing the single matched place record.' },
  { name: 'results[].type', type: 'string', desc: 'Entity type: POI, Street, Geography, Point Address, Address Range, or Cross Street.' },
  { name: 'results[].id', type: 'string', desc: 'The entity ID echoed back from the request.' },
  { name: 'results[].score', type: 'float', desc: 'Always 1.0 for a direct ID lookup.' },
  { name: 'results[].poi', type: 'object', desc: 'POI data block (present when type=POI).', children: [
    { name: 'poi.name', type: 'string', desc: 'Display name of the POI.' },
    { name: 'poi.phone', type: 'string', desc: 'Contact phone number.' },
    { name: 'poi.url', type: 'string', desc: 'Website URL.' },
    { name: 'poi.brands', type: 'object[]', desc: 'Array of { name } brand objects.' },
    { name: 'poi.categorySet', type: 'object[]', desc: 'Array of { id } numeric category identifiers.' },
    { name: 'poi.categories', type: 'string[]', desc: 'Human-readable category name strings.' },
    { name: 'poi.openingHours', type: 'object', desc: 'Opening schedule with mode and timeRanges when openingHours=nextSevenDays is requested.' },
    { name: 'poi.timeZone', type: 'object', desc: 'Time zone data with ianaId when timeZone is requested.' },
  ]},
  { name: 'results[].address', type: 'object', desc: 'Structured address: streetName, streetNumber, municipality, countrySubdivision, postalCode, countryCode, country, freeformAddress.' },
  { name: 'results[].position', type: 'object', desc: '{ lat, lon } coordinates of the place.' },
  { name: 'results[].viewport', type: 'object', desc: 'Suggested map viewport bounding box.' },
  { name: 'results[].entryPoints', type: 'array', desc: 'Physical access points with type and position.' },
  { name: 'results[].relatedPois', type: 'array', desc: 'Related POI records when relatedPois is requested. Each item has relationType (child or parent) and id.' },
  { name: 'results[].mapcodes', type: 'array', desc: 'Mapcode representations when mapcodes is requested. Each item has type and fullMapcode.' },
];

/* ─── Code examples ──────────────────────────────────────────────────────── */
const CODE_V1 = `# Place by ID — retrieve full details for a specific entity (v1 TomTom Maps)
curl "https://api.tomtom.com/search/2/place.json\\
?entityId=00004e4c-3100-3c00-0000-0000685e23c7\\
&key=YOUR_API_KEY\\
&language=en-GB\\
&openingHours=nextSevenDays\\
&relatedPois=child"`;

const CODE_V2 = `# Place by ID — retrieve full details for a specific entity (v2 Orbis Maps)
curl "https://api.tomtom.com/maps/orbis/places/place.json\\
?entityId=00004e4c-3100-3c00-0000-0000685e23c7\\
&key=YOUR_API_KEY\\
&apiVersion=1\\
&language=en-GB\\
&openingHours=nextSevenDays\\
&relatedPois=child"`;

const CODE_RESPONSE = `{
  "summary": {
    "queryType": "ID_LOOKUP",
    "queryTime": 12,
    "numResults": 1
  },
  "results": [
    {
      "type": "POI",
      "id": "00004e4c-3100-3c00-0000-0000685e23c7",
      "score": 1.0,
      "poi": {
        "name": "Amsterdam Airport Schiphol",
        "phone": "+31 20 794 0800",
        "url": "www.schiphol.nl",
        "brands": [],
        "categorySet": [{ "id": 7383 }],
        "categories": ["airport"],
        "openingHours": {
          "mode": "NEXT_SEVEN_DAYS",
          "timeRanges": [
            {
              "startTime": { "date": "2026-05-12", "hour": 0, "minute": 0 },
              "endTime":   { "date": "2026-05-12", "hour": 23, "minute": 59 }
            }
          ]
        }
      },
      "address": {
        "streetName": "Evert van de Beekstraat",
        "streetNumber": "202",
        "municipality": "Haarlemmermeer",
        "countrySubdivision": "North Holland",
        "postalCode": "1118 CP",
        "countryCode": "NL",
        "country": "Netherlands",
        "freeformAddress": "Evert van de Beekstraat 202, 1118 CP Haarlemmermeer"
      },
      "position": { "lat": 52.3086, "lon": 4.7639 },
      "viewport": {
        "topLeftPoint": { "lat": 52.3286, "lon": 4.7439 },
        "btmRightPoint": { "lat": 52.2886, "lon": 4.7839 }
      },
      "entryPoints": [
        { "type": "main", "position": { "lat": 52.3090, "lon": 4.7643 } }
      ],
      "relatedPois": [
        { "relationType": "child", "id": "00005e4c-3100-3c00-0000-0000685e23d1" },
        { "relationType": "child", "id": "00005e4c-3100-3c00-0000-0000685e23d2" }
      ]
    }
  ]
}`;

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function SearchPlaceById({ onNavigate }) {
  const [tab, setTab] = useState('v1');
  const v2Params = [...PARAMS_V2_ONLY, ...PARAMS_SHARED];

  return (
    <div className="page page--wide">
      <div className="page-header page-header--with-tabs">
        <h1>Place by ID</h1>
        <PageActions pageId="search-place-by-id" pageTitle="Place by ID" />
        <VersionTabBar versions={['v1', 'v2']} activeTab={tab} onTabChange={setTab} />
      </div>
      <p className="quick-answer">
        Retrieve detailed information for a specific place using its entity ID — the id field
        returned in any Search API result. Supports all place types including POIs, Streets,
        Geographies, Point Addresses, Address Ranges, and Cross Streets.
      </p>

      {tab === 'v1' && (
        <ApiRefTwoCol
          sections={[
            {
              id: 'request',
              heading: 'Request',
              method: 'GET',
              demoId: 'poi-details',
              note: 'https://api.tomtom.com/search/2/place.json — Pass the entityId as a query parameter, not as a path segment.',
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
              note: 'https://api.tomtom.com/maps/orbis/places/place.json  — Public Preview. Pass the entityId as a query parameter, not as a path segment.',
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
