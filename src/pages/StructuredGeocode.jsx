import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Request parameters ────────────────────────────────────────────────────── */
const PARAMS = [
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'countryCode', required: true, type: 'string', desc: 'ISO 3166-1 alpha-2 country code of the country being targeted. Example: NL, US, DE.' },
  { name: 'streetNumber', type: 'string', desc: 'Building or house number for the structured address.' },
  { name: 'streetName', type: 'string', desc: 'Street name without the building number.' },
  { name: 'crossStreet', type: 'string', desc: 'Cross street name for intersection lookups.' },
  { name: 'municipality', type: 'string', desc: 'City or town name. Example: Amsterdam, Redmond.' },
  { name: 'municipalitySubdivision', type: 'string', desc: 'Sub-locality or district within the municipality (Sub / Super City).' },
  { name: 'countryTertiarySubdivision', type: 'string', desc: 'Third-level administrative subdivision — named area.' },
  { name: 'countrySecondarySubdivision', type: 'string', desc: 'Second-level administrative subdivision (county).' },
  { name: 'countrySubdivision', type: 'string', desc: 'First-level administrative subdivision — state or province. Example: WA, CA.' },
  { name: 'postalCode', type: 'string', desc: 'Postal or ZIP code. Example: 1011 AC, 98052.' },
  { name: 'limit', type: 'integer', default: 10, desc: 'Maximum number of results to return (1–100).' },
  { name: 'ofs', type: 'integer', default: 0, desc: 'Starting offset of the returned results within the full result set. Max 1900.' },
  { name: 'language', type: 'string (IETF)', default: 'en-GB', desc: 'Language for result names and addresses. Uses best-matched language when specified data is unavailable.' },
  { name: 'extendedPostalCodesFor', type: 'string', desc: 'Comma-separated index types for which extended postal codes are included. Example: POI,Addr,PAD,Street. Use None to disable.' },
  { name: 'entityTypeSet', type: 'string', desc: 'Comma-separated entity types to restrict Geography results. Values: Country, CountrySubdivision, CountrySecondarySubdivision, CountryTertiarySubdivision, Municipality, MunicipalitySubdivision, Neighbourhood, PostalCodeArea.' },
  { name: 'mapcodes', type: 'string', values: ['Local', 'International', 'Alternative'], desc: 'Include mapcode representations in results. Values: Local, International, Alternative.' },
  { name: 'view', type: 'string', values: ['Unified', 'AR', 'IL', 'IN', 'MA', 'PK', 'RU', 'TR', 'CN', 'TW'], desc: 'Geopolitical view for disputed territories. Default varies by origin country.' },
];

/* ─── Response fields ────────────────────────────────────────────────────────── */
const RESPONSE_FIELDS = [
  { name: 'summary', type: 'object', desc: 'Metadata: query, queryTime, numResults, totalResults, offset, fuzzyLevel, geoBias.' },
  { name: 'results', type: 'array', desc: 'Array of geocode results sorted by score descending.' },
  { name: 'results[].type', type: 'string', desc: 'Result type: Street, Geography, Point Address, Address Range, or Cross Street.' },
  { name: 'results[].id', type: 'string', desc: 'Non-stable unique identifier for this result.' },
  { name: 'results[].score', type: 'double', desc: 'Relevance score — higher score means higher probability of a match.' },
  { name: 'results[].matchConfidence', type: 'object', desc: 'Textual match confidence. Contains score (0–1) representing how closely the result matches the query.' },
  { name: 'results[].address', type: 'object', desc: 'Structured address block.', children: [
    { name: 'address.streetNumber', type: 'string', desc: 'Building number on the street.' },
    { name: 'address.streetName', type: 'string', desc: 'Street name.' },
    { name: 'address.municipalitySubdivision', type: 'string', desc: 'Sub / Super City.' },
    { name: 'address.municipality', type: 'string', desc: 'City / Town.' },
    { name: 'address.countrySecondarySubdivision', type: 'string', desc: 'County.' },
    { name: 'address.countrySubdivision', type: 'string', desc: 'State or Province (abbreviated).' },
    { name: 'address.countrySubdivisionName', type: 'string', desc: 'Full state or province name (USA, Canada, GB only).' },
    { name: 'address.postalCode', type: 'string', desc: 'Postal or ZIP code.' },
    { name: 'address.extendedPostalCode', type: 'string', desc: 'Extended postal code (region-dependent).' },
    { name: 'address.countryCode', type: 'string', desc: 'ISO 3166-1 alpha-2 country code.' },
    { name: 'address.country', type: 'string', desc: 'Country name.' },
    { name: 'address.countryCodeISO3', type: 'string', desc: 'ISO 3166-1 alpha-3 country code.' },
    { name: 'address.freeformAddress', type: 'string', desc: 'Full address line formatted per country rules.' },
    { name: 'address.localName', type: 'string', desc: 'Name of the geographic area or locality.' },
  ]},
  { name: 'results[].position', type: 'object', desc: '{ lat, lon } coordinates of the result.' },
  { name: 'results[].viewport', type: 'object', desc: 'Suggested map viewport bounding box with topLeftPoint and btmRightPoint.' },
  { name: 'results[].entryPoints', type: 'array', desc: 'Physical access points with type (main/minor) and position.' },
  { name: 'results[].addressRanges', type: 'object', desc: 'Address ranges on a street segment (only for Address Range type). Contains rangeLeft, rangeRight, from, to.' },
  { name: 'results[].dataSources', type: 'object', desc: 'Reference IDs for the Additional Data service. Contains geometry.id for Geography results.' },
  { name: 'results[].mapcodes', type: 'array', desc: 'Mapcode representations when mapcodes param is requested. Each entry has type, fullMapcode, territory, code.' },
];

/* ─── Code examples ──────────────────────────────────────────────────────────── */
const CODE = `# Structured Geocode — street address in Amsterdam
curl "https://api.tomtom.com/search/2/structuredGeocode.json?key=YOUR_API_KEY\\
&countryCode=NL\\
&streetName=De+Ruijterkade\\
&streetNumber=154\\
&postalCode=1011+AC\\
&municipality=Amsterdam"`;

const CODE_RESPONSE = `{
  "summary": {
    "query": "De Ruijterkade 154 1011 AC Amsterdam NL",
    "queryTime": 18,
    "numResults": 1,
    "offset": 0,
    "totalResults": 1,
    "fuzzyLevel": 1
  },
  "results": [
    {
      "type": "Point Address",
      "id": "NLD/PAD/p0/1234567",
      "score": 9.982,
      "matchConfidence": { "score": 1 },
      "address": {
        "streetNumber": "154",
        "streetName": "De Ruijterkade",
        "municipality": "Amsterdam",
        "municipalitySubdivision": "Centrum",
        "countrySecondarySubdivision": "Amsterdam",
        "countrySubdivision": "Noord-Holland",
        "postalCode": "1011 AC",
        "countryCode": "NL",
        "country": "Netherlands",
        "countryCodeISO3": "NLD",
        "freeformAddress": "De Ruijterkade 154, 1011 AC Amsterdam",
        "localName": "Amsterdam"
      },
      "position": { "lat": 52.37888, "lon": 4.90028 },
      "matchConfidence": { "score": 1.0 },
      "viewport": {
        "topLeftPoint": { "lat": 52.37978, "lon": 4.89915 },
        "btmRightPoint": { "lat": 52.37798, "lon": 4.90141 }
      },
      "entryPoints": [
        { "type": "main", "position": { "lat": 52.37882, "lon": 4.90033 } }
      ]
    }
  ]
}`;

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function StructuredGeocode({ onNavigate }) {
  return (
    <ApiRefTwoCol
      title="Structured Geocode"
      description="Geocode an address that is already split into discrete fields — street number, street name, municipality, postal code, and country code — for higher match precision than free-form input. No POI results are returned; the geocoder matches against street, address, geography, and intersection indexes."
      version="v2"
      sections={[
        {
          id: 'request',
          heading: 'Request',
          method: 'GET',
          demoId: 'geocode',
          note: 'https://api.tomtom.com/search/2/structuredGeocode.json — Supply at least countryCode plus one address field. Parameters may be provided in any order.',
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
