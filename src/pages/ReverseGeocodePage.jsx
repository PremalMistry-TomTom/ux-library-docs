import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

const REVERSE_PARAMS = [
  { name: 'position', required: true, type: 'string (path)', desc: 'Latitude and longitude to reverse geocode. Format: lat,lon. Example: 52.3731,4.8922' },
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'language', type: 'string (IETF)', default: 'en-GB', desc: 'Language for returned address names. Example: de-DE' },
  { name: 'returnSpeedLimit', type: 'boolean', default: false, desc: 'When true, includes the posted speed limit of the matched road in the response.' },
  { name: 'heading', type: 'float', desc: 'Vehicle heading in degrees (0–365). Used to disambiguate which side of a divided road to snap to.' },
  { name: 'radius', type: 'integer', desc: 'Search radius in metres for finding the nearest address. Useful in sparse areas.' },
  { name: 'number', type: 'string', desc: 'House number hint. When provided, the result is biased toward the nearest address with this number.' },
  { name: 'returnMatchType', type: 'boolean', default: false, desc: 'When true, includes the matchType field in the response (AddressPoint, HouseNumberRange, or Street).' },
  {
    name: 'entityType',
    type: 'string',
    desc: 'Comma-separated list of entity types to restrict the result to. Returns only the highest-priority matching type.',
    values: [
      'Address',
      'Neighbourhood',
      'PopulatedPlace',
      'Postcode1',
      'AdminDivision1',
      'AdminDivision2',
      'Country',
      'CountrySubdivision',
    ],
  },
  { name: 'view', type: 'string', values: ['Unified', 'AR', 'IN', 'MA', 'PK', 'RU', 'TR', 'CN'], desc: 'Geopolitical view for disputed territories.' },
  { name: 'allowFreeformAddressRanges', type: 'boolean', default: false, desc: 'When true, allows the API to return address ranges in freeform format when an exact point address is unavailable.' },
];

const CROSS_STREET_PARAMS = [
  { name: 'position', required: true, type: 'string (path)', desc: 'Latitude and longitude to look up. Format: lat,lon. Example: 52.3731,4.8922' },
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'limit', type: 'integer', default: 10, desc: 'Maximum number of cross-street results (1–100).' },
  { name: 'language', type: 'string (IETF)', default: 'en-GB', desc: 'Language for returned street names.' },
  { name: 'heading', type: 'float', desc: 'Vehicle heading in degrees (0–365). Helps select the correct road direction.' },
  { name: 'radius', type: 'integer', desc: 'Search radius in metres for finding nearby intersections.' },
  { name: 'view', type: 'string', values: ['Unified', 'AR', 'IN', 'MA', 'PK', 'RU', 'TR', 'CN'], desc: 'Geopolitical view for disputed territories.' },
];

const REVERSE_CODE = `curl "https://api.tomtom.com/search/2/reverseGeocode/52.3731,4.8922.json?key=YOUR_API_KEY&returnMatchType=true"`;

const CROSS_STREET_CODE = `curl "https://api.tomtom.com/search/2/crossStreetLookup/52.3731,4.8922.json?key=YOUR_API_KEY&limit=3"`;

export default function ReverseGeocodePage({ onNavigate }) {
  return (
    <ApiRefTwoCol
      title="Reverse Geocoding"
      description="Convert a latitude/longitude coordinate into a human-readable address, street name, or administrative area. Returns structured address components and an optional match type indicating the precision of the result."
      version="v2"
      sections={[
        {
          id: 'reverse-geocode',
          heading: 'Reverse Geocode',
          method: 'GET',
          demoId: 'reverse-geocode',
          note: 'https://api.tomtom.com/search/2/reverseGeocode/{position}.json',
          params: REVERSE_PARAMS,
          code: REVERSE_CODE,
          lang: 'bash',
        },
        {
          id: 'cross-street-lookup',
          heading: 'Cross Street Lookup',
          method: 'GET',
          note: 'https://api.tomtom.com/search/2/crossStreetLookup/{position}.json — Resolve a coordinate to the nearest road intersection or cross-street name. Useful for turn-by-turn navigation context.',
          params: CROSS_STREET_PARAMS,
          code: CROSS_STREET_CODE,
          lang: 'bash',
        },
      ]}
    />
  );
}
