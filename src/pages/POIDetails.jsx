import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Request parameters ────────────────────────────────────────────────────── */
const PARAMS = [
  { name: 'entityId', required: true, type: 'string', desc: 'The entity ID of the POI obtained from a search result (results[].id). Passed as a query parameter.' },
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'language', type: 'string (IETF)', default: 'en-GB', desc: 'Language for POI names, address strings, and attribute labels in the response.' },
  { name: 'relatedPois', type: 'string', default: 'off', values: ['off', 'child', 'parent', 'all'], desc: 'Include related POI records. child returns sub-entities (e.g. fuel pump bays on a station), parent returns the umbrella location, all returns both.' },
];

/* ─── Response fields ────────────────────────────────────────────────────────── */
const RESPONSE_FIELDS = [
  { name: 'results', type: 'array', desc: 'Single-element array containing the enriched POI record.' },
  { name: 'results[0].type', type: 'string', desc: 'Always POI.' },
  { name: 'results[0].id', type: 'string', desc: 'Entity ID confirming the returned record.' },
  { name: 'results[0].poi', type: 'object', desc: 'Enriched POI data block — richer than standard search results.', children: [
    { name: 'poi.name', type: 'string', desc: 'Primary display name.' },
    { name: 'poi.phone', type: 'string', desc: 'Primary phone number.' },
    { name: 'poi.url', type: 'string', desc: 'Official website URL.' },
    { name: 'poi.categories', type: 'object[]', desc: 'Array of { id, name } category objects.' },
    { name: 'poi.brands', type: 'object[]', desc: 'Array of { name } brand objects.' },
    { name: 'poi.openingHours', type: 'object', desc: 'Full opening schedule.', children: [
      { name: 'openingHours.mode', type: 'string', desc: 'Always nextSevenDays in the Place by ID response.' },
      { name: 'openingHours.timeRanges', type: 'object[]', desc: 'Array of opening windows with startTime and endTime, each containing date, hour, and minute fields.' },
    ]},
    { name: 'poi.priceRange', type: 'object', desc: 'Price range indication.', children: [
      { name: 'priceRange.label', type: 'string', desc: 'Human-readable label: $, $$, $$$, $$$$.' },
      { name: 'priceRange.value', type: 'integer', desc: 'Numeric tier (1–4).' },
    ]},
    { name: 'poi.ratings', type: 'object', desc: 'Aggregated ratings.', children: [
      { name: 'ratings.value', type: 'float', desc: 'Average rating (0.0–10.0).' },
      { name: 'ratings.totalRatings', type: 'integer', desc: 'Number of ratings contributing to the average.' },
    ]},
    { name: 'poi.classifications', type: 'object[]', desc: 'Extended classification data with code and names arrays.' },
    { name: 'poi.photos', type: 'object[]', desc: 'Array of { id } photo objects. Use each id with the POI Photos endpoint to fetch the actual image.' },
  ]},
  { name: 'results[0].address', type: 'object', desc: 'Full structured address with streetName, streetNumber, municipality, postalCode, countryCode, country, freeformAddress.' },
  { name: 'results[0].position', type: 'object', desc: '{ lat, lon } coordinates.' },
  { name: 'results[0].viewport', type: 'object', desc: 'Suggested map viewport bounding box.' },
  { name: 'results[0].entryPoints', type: 'array', desc: 'Physical access points with type (main/minor) and position.' },
  { name: 'results[0].relatedPois', type: 'array', desc: 'Related POI records when relatedPois is not off. Each contains relationType, id, and summary POI data.' },
];

/* ─── Code examples ──────────────────────────────────────────────────────────── */
const CODE = `# Place by ID — retrieve enriched details for a specific POI
# entity ID obtained from a previous search result
curl "https://api.tomtom.com/search/2/place.json\\
?key=YOUR_API_KEY\\
&entityId=528009010952022\\
&language=en-GB\\
&relatedPois=child"`;

const CODE_RESPONSE = `{
  "results": [
    {
      "type": "POI",
      "id": "528009010952022",
      "poi": {
        "name": "Pizza Hut",
        "phone": "+31 20 123 4567",
        "url": "https://www.pizzahut.nl",
        "categories": [
          { "id": "7315036", "name": "pizza restaurant" }
        ],
        "brands": [{ "name": "Pizza Hut" }],
        "openingHours": {
          "mode": "nextSevenDays",
          "timeRanges": [
            { "startTime": { "date": "2026-05-10", "hour": 11, "minute": 0 }, "endTime": { "date": "2026-05-10", "hour": 23, "minute": 0 } },
            { "startTime": { "date": "2026-05-11", "hour": 11, "minute": 0 }, "endTime": { "date": "2026-05-11", "hour": 23, "minute": 0 } }
          ]
        },
        "priceRange": {
          "label": "$$",
          "value": 2
        },
        "ratings": {
          "value": 7.4,
          "totalRatings": 312
        },
        "classifications": [
          {
            "code": "RESTAURANT",
            "names": [
              { "nameLocale": "en-GB", "name": "restaurant" },
              { "nameLocale": "nl-NL", "name": "restaurant" }
            ]
          }
        ],
        "photos": [
          { "id": "POI_f5ccc7a1-dde3-44e5-8ca0-ee7bd3d7ad1e" },
          { "id": "POI_9a3b10c2-f451-4c21-9d84-552e7c9fb3ab" }
        ]
      },
      "address": {
        "streetName": "Damstraat",
        "streetNumber": "12",
        "municipality": "Amsterdam",
        "postalCode": "1012 JL",
        "countryCode": "NL",
        "country": "Netherlands",
        "freeformAddress": "Damstraat 12, 1012 JL Amsterdam"
      },
      "position": { "lat": 52.3731, "lon": 4.8920 },
      "viewport": {
        "topLeftPoint": { "lat": 52.3741, "lon": 4.8910 },
        "btmRightPoint": { "lat": 52.3721, "lon": 4.8930 }
      },
      "entryPoints": [
        { "type": "main", "position": { "lat": 52.37308, "lon": 4.89198 } }
      ],
      "relatedPois": [
        {
          "relationType": "child",
          "id": "528009010952023",
          "poi": { "name": "Pizza Hut (Drive-Thru)", "categories": [{ "id": "7315036", "name": "pizza restaurant" }] },
          "position": { "lat": 52.3730, "lon": 4.8921 }
        }
      ]
    }
  ]
}`;

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function POIDetails({ onNavigate }) {
  return (
    <ApiRefTwoCol
      title="POI Details"
      description="Retrieve enriched details for a specific Point of Interest using its entity ID from a search result. Returns ratings, price range, full opening hours for all days of the week, contact info, photo IDs, and related POI records."
      version="v2"
      sections={[
        {
          id: 'request',
          heading: 'Request',
          method: 'GET',
          note: 'https://api.tomtom.com/search/2/place.json — entityId is a required query parameter obtained from results[].id in any search response.',
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
