import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

const GEOCODE_PARAMS = [
  { name: 'query', required: true, type: 'string (path)', desc: 'URL-encoded address string to geocode. Example: 1+Microsoft+Way+Redmond+WA' },
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'limit', type: 'integer', default: 10, desc: 'Maximum number of results to return (1–100).' },
  { name: 'language', type: 'string (IETF)', default: 'en-GB', desc: 'Language for result names and addresses. Example: fr-FR' },
  { name: 'countrySet', type: 'string', desc: 'Comma-separated ISO 3166-1 alpha-2 or alpha-3 codes to restrict results to specific countries. Example: US,CA' },
  { name: 'lat', type: 'float', desc: 'Latitude for geographic bias. Must be paired with lon. Range: −90 to 90.' },
  { name: 'lon', type: 'float', desc: 'Longitude for geographic bias. Must be paired with lat. Range: −180 to 180.' },
  { name: 'radius', type: 'integer', desc: 'Bias radius in metres around lat/lon. Applied only when lat and lon are provided.' },
  { name: 'boundingBox', type: 'string', desc: 'Restrict results to a bounding box. Format: topLeftLat,topLeftLon:btmRightLat,btmRightLon. Example: 53.0,4.5:52.0,5.5' },
  { name: 'view', type: 'string', values: ['Unified', 'AR', 'IN', 'MA', 'PK', 'RU', 'TR', 'CN'], desc: 'Geopolitical view to use for disputed territories. Unified returns the most inclusive view.' },
  { name: 'extendedPostalCodesFor', type: 'string', desc: 'Comma-separated list of field types to include extended postal codes for. Example: POI,Addr,PAD,Street,Geo,City.' },
];

const STRUCTURED_PARAMS = [
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'countryCode', required: true, type: 'string', desc: 'ISO 3166-1 alpha-2 or alpha-3 country code. Example: US' },
  { name: 'streetNumber', type: 'string', desc: 'Building or house number.' },
  { name: 'streetName', type: 'string', desc: 'Street name without the building number.' },
  { name: 'crossStreet', type: 'string', desc: 'Cross street name for intersection lookups.' },
  { name: 'municipality', type: 'string', desc: 'City or town name.' },
  { name: 'municipalitySubdivision', type: 'string', desc: 'Sub-locality or district within the municipality.' },
  { name: 'countryTertiarySubdivision', type: 'string', desc: 'Third-level administrative subdivision (e.g. named area).' },
  { name: 'countrySecondarySubdivision', type: 'string', desc: 'Second-level administrative subdivision (e.g. county).' },
  { name: 'countrySubdivision', type: 'string', desc: 'First-level administrative subdivision (e.g. state or province). Example: WA' },
  { name: 'postalCode', type: 'string', desc: 'Postal or ZIP code. Example: 98052' },
  { name: 'limit', type: 'integer', default: 10, desc: 'Maximum number of results to return (1–100).' },
  { name: 'language', type: 'string (IETF)', default: 'en-GB', desc: 'Language for result names and addresses.' },
  { name: 'view', type: 'string', values: ['Unified', 'AR', 'IN', 'MA', 'PK', 'RU', 'TR', 'CN'], desc: 'Geopolitical view for disputed territories.' },
];

const GEOCODE_CODE = `curl "https://api.tomtom.com/search/2/geocode/1+Microsoft+Way+Redmond+WA.json?key=YOUR_API_KEY&limit=1"`;

const STRUCTURED_CODE = `curl "https://api.tomtom.com/search/2/structuredGeocode.json?key=YOUR_API_KEY&countryCode=US&streetNumber=1&streetName=Microsoft+Way&municipality=Redmond&countrySubdivision=WA&postalCode=98052"`;

export default function GeocodePage({ onNavigate }) {
  return (
    <ApiRefTwoCol
      title="Geocoding"
      description="Convert an address or place name into geographic coordinates (latitude and longitude). Returns structured address components and a confidence score. Supports both free-form address strings and field-by-field structured input."
      version="v2"
      sections={[
        {
          id: 'geocode',
          heading: 'Geocode',
          method: 'GET',
          note: 'https://api.tomtom.com/search/2/geocode/{query}.json',
          params: GEOCODE_PARAMS,
          code: GEOCODE_CODE,
          lang: 'bash',
        },
        {
          id: 'structured-geocode',
          heading: 'Structured Geocode',
          method: 'GET',
          note: 'https://api.tomtom.com/search/2/structuredGeocode.json — Geocode addresses already split into discrete fields (street number, city, postal code) for higher match precision than free-form input.',
          params: STRUCTURED_PARAMS,
          code: STRUCTURED_CODE,
          lang: 'bash',
        },
      ]}
    />
  );
}
