import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Request parameters ────────────────────────────────────────────────────── */
const PARAMS = [
  { name: 'position', required: true, type: 'string (path)', desc: 'Comma-separated lat,lon coordinate to reverse-geocode to the nearest intersection. Example: 37.786505,-122.3862' },
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'limit', type: 'integer', default: 1, desc: 'Maximum number of intersection results to return (1–100). Default is 1.' },
  { name: 'radius', type: 'integer', default: 10000, desc: 'Maximum search radius in metres from the supplied position. Default 10 000 m (10 km).' },
  { name: 'language', type: 'string (IETF)', default: 'NGT', desc: 'Language for result names. Uses NGT (NeutralGroundTruth) when data is unavailable in the requested language.' },
  { name: 'allowFreeformNewline', type: 'boolean', default: false, desc: 'When true, the freeformAddress field may contain newline characters. When false, newlines are converted to spaces.' },
  { name: 'view', type: 'string', values: ['Unified', 'AR', 'IL', 'IN', 'MA', 'PK', 'RU', 'TR', 'CN'], desc: 'Geopolitical view for disputed territories. Default varies by origin country.' },
];

/* ─── Response fields ────────────────────────────────────────────────────────── */
const RESPONSE_FIELDS = [
  { name: 'summary', type: 'object', desc: 'Metadata: numResults (number of results in response) and queryTime (milliseconds).' },
  { name: 'addresses', type: 'array', desc: 'Array of nearest cross-street results.' },
  { name: 'addresses[].address', type: 'object', desc: 'Structured address of the nearest intersection.', children: [
    { name: 'address.streetName', type: 'string', desc: 'Combined intersection label, e.g. "Bryant Street & The Embarcadero".' },
    { name: 'address.crossStreet', type: 'string', desc: 'The street being crossed at the intersection.' },
    { name: 'address.street', type: 'string', desc: 'The primary street name at the intersection.' },
    { name: 'address.municipalitySubdivision', type: 'string', desc: 'Sub / Super City.' },
    { name: 'address.municipality', type: 'string', desc: 'City / Town.' },
    { name: 'address.municipalitySecondarySubdivision', type: 'string', desc: 'Sub Sub City.' },
    { name: 'address.neighbourhood', type: 'string', desc: 'Neighbourhood name.' },
    { name: 'address.countrySecondarySubdivision', type: 'string', desc: 'County.' },
    { name: 'address.countryTertiarySubdivision', type: 'string', desc: 'Named area.' },
    { name: 'address.countrySubdivision', type: 'string', desc: 'State or Province (abbreviated).' },
    { name: 'address.countrySubdivisionName', type: 'string', desc: 'Full state or province name (USA, Canada, GB only).' },
    { name: 'address.countrySubdivisionCode', type: 'string', desc: 'State or Province code (USA, Canada, GB only).' },
    { name: 'address.postalCode', type: 'string', desc: 'Postal or ZIP code.' },
    { name: 'address.countryCode', type: 'string', desc: 'ISO 3166-1 alpha-2 country code.' },
    { name: 'address.country', type: 'string', desc: 'Country name.' },
    { name: 'address.countryCodeISO3', type: 'string', desc: 'ISO 3166-1 alpha-3 country code.' },
    { name: 'address.freeformAddress', type: 'string', desc: 'Full address line formatted per country rules.' },
    { name: 'address.localName', type: 'string', desc: 'Name of the geographic area or locality.' },
  ]},
  { name: 'addresses[].position', type: 'string (LatLon)', desc: 'Coordinates of the result as "latitude,longitude" string. Example: "37.787075,-122.3877".' },
];

/* ─── Code examples ──────────────────────────────────────────────────────────── */
const CODE = `# Cross Street Lookup — nearest intersection in San Francisco
curl "https://api.tomtom.com/search/2/reverseGeocode/crossStreet/37.786505,-122.3862.json\\
?key=YOUR_API_KEY\\
&language=en-US"`;

const CODE_RESPONSE = `{
  "summary": {
    "numResults": 1,
    "queryTime": 176
  },
  "addresses": [
    {
      "address": {
        "streetName": "Bryant Street & The Embarcadero",
        "crossStreet": "Bryant Street",
        "street": "The Embarcadero",
        "municipality": "San Francisco",
        "neighbourhood": "South Beach",
        "countrySecondarySubdivision": "San Francisco",
        "countrySubdivision": "CA",
        "countrySubdivisionName": "California",
        "countrySubdivisionCode": "CA",
        "postalCode": "94111",
        "countryCode": "US",
        "country": "United States",
        "countryCodeISO3": "USA",
        "freeformAddress": "Bryant Street & The Embarcadero, San Francisco, CA 94111",
        "localName": "San Francisco"
      },
      "position": "37.787075,-122.3877"
    }
  ]
}`;

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function CrossStreetLookup({ onNavigate }) {
  return (
    <ApiRefTwoCol
      title="Cross Street Lookup"
      description="Translate a coordinate into the nearest road intersection address. Useful in tracking applications where a GPS coordinate must be rendered as a human-readable cross-street reference. Returns the intersection name, structured address components, and the snapped position."
      version="v1"
      sections={[
        {
          id: 'request',
          heading: 'Request',
          method: 'GET',
          demoId: 'reverse-geocode',
          note: 'https://api.tomtom.com/search/2/reverseGeocode/crossStreet/{lat},{lon}.json — The position is a path segment, not a query parameter.',
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
