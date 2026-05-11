import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

const REALTIME_PARAMS = [
  { name: 'parkingId', required: true, type: 'string', desc: 'TomTom parking facility ID. Obtain from a parking search result.' },
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
];

const REALTIME_RESPONSE = [
  { name: 'id', type: 'string', desc: 'Parking facility identifier.' },
  { name: 'name', type: 'string', desc: 'Facility display name.' },
  { name: 'totalSpaces', type: 'integer', desc: 'Total number of parking spaces.' },
  { name: 'availableSpaces', type: 'integer', desc: 'Currently available spaces. -1 if data is unavailable.' },
  { name: 'occupancyRate', type: 'number', desc: 'Fraction of spaces currently occupied (0.0–1.0).' },
  { name: 'status', type: 'string', values: ['OPEN', 'CLOSED', 'FULL', 'UNKNOWN'], desc: 'Current facility operational status.' },
  { name: 'tariffs', type: 'array', desc: 'Pricing tiers for this facility. See Parking Prices for full tariff structure.' },
  { name: 'updatedAt', type: 'string (ISO 8601)', desc: 'Timestamp of the last data update.' },
];

const SEARCH_PARAMS = [
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'lat', required: true, type: 'number', desc: 'Latitude of the centre point (WGS 84).' },
  { name: 'lon', required: true, type: 'number', desc: 'Longitude of the centre point (WGS 84).' },
  { name: 'radius', required: false, type: 'integer', default: '1000', desc: 'Search radius in metres.' },
  { name: 'limit', required: false, type: 'integer', default: '10', desc: 'Maximum number of results to return.' },
  { name: 'categories', required: false, type: 'string', values: ['OPEN_LOTS', 'COVERED_PARKING', 'UNDERGROUND', 'MULTISTORY'], desc: 'Comma-separated list of facility categories to filter by.' },
  { name: 'minAvailabilityPct', required: false, type: 'number', desc: 'Only return facilities with at least this percentage of spaces available (0–100).' },
  { name: 'openNow', required: false, type: 'boolean', default: 'false', desc: 'When true, only return facilities that are currently open.' },
];

const SEARCH_RESPONSE = [
  {
    name: 'results', type: 'array', desc: 'List of nearby parking facilities.',
    children: [
      { name: 'facilityId', type: 'string', desc: 'Unique parking facility identifier.' },
      { name: 'name', type: 'string', desc: 'Facility display name.' },
      { name: 'position', type: 'object', desc: 'Geographic coordinates of the facility entrance.' },
      { name: 'totalSpaces', type: 'integer', desc: 'Total number of parking spaces.' },
      { name: 'availableSpaces', type: 'integer', desc: 'Currently available spaces. -1 if unavailable.' },
      { name: 'status', type: 'string', values: ['OPEN', 'CLOSED', 'FULL', 'UNKNOWN'], desc: 'Current facility status.' },
      { name: 'distance', type: 'number', desc: 'Straight-line distance in metres from the query coordinate.' },
    ],
  },
];

const REALTIME_CODE = `curl "https://api.tomtom.com/parking/2/realtime/EEE60B32E17403E8CA9CDB14.json?key=YOUR_API_KEY"`;

const REALTIME_CODE_RESPONSE = `{
  "id": "EEE60B32E17403E8CA9CDB14",
  "name": "Amsterdam Centraal Parkeergarage",
  "totalSpaces": 950,
  "availableSpaces": 127,
  "occupancyRate": 0.866,
  "status": "OPEN",
  "tariffs": [
    { "duration": { "from": 0, "to": 60 }, "price": 4.50, "currency": "EUR" },
    { "duration": { "from": 60, "to": 120 }, "price": 8.00, "currency": "EUR" }
  ],
  "updatedAt": "2025-05-10T14:30:00Z"
}`;

const SEARCH_CODE = `curl "https://api.tomtom.com/parking/2/nearbySearch.json?key=YOUR_API_KEY&lat=52.3731&lon=4.8926&radius=500&openNow=true"`;

const SEARCH_CODE_RESPONSE = `{
  "results": [
    {
      "facilityId": "EEE60B32E17403E8CA9CDB14",
      "name": "Amsterdam Centraal Parkeergarage",
      "position": { "lat": 52.3786, "lon": 4.9001 },
      "totalSpaces": 950,
      "availableSpaces": 127,
      "status": "OPEN",
      "distance": 312
    },
    {
      "facilityId": "A1B2C3D4E5F678901234ABCD",
      "name": "Parking Prins Hendrikkade",
      "position": { "lat": 52.3774, "lon": 4.9058 },
      "totalSpaces": 430,
      "availableSpaces": 0,
      "status": "FULL",
      "distance": 487
    }
  ]
}`;

export default function ParkingAvailability({ onNavigate }) {
  return (
    <ApiRefTwoCol
      title="Parking Availability"
      description="Query real-time occupancy and availability for off-street parking facilities. Returns total and available spaces, occupancy rate, and facility status. Also supports a nearby search to discover facilities around a coordinate."
      version="v2"
      sections={[
        {
          id: 'realtime',
          heading: 'Real-time Availability',
          method: 'GET',
          note: 'https://api.tomtom.com/parking/2/realtime/{parkingId}.json',
          params: REALTIME_PARAMS,
          code: REALTIME_CODE,
          lang: 'bash',
        },
        {
          id: 'realtime-response',
          heading: 'Response',
          params: REALTIME_RESPONSE,
          code: REALTIME_CODE_RESPONSE,
          lang: 'json',
        },
        {
          id: 'nearby-search',
          heading: 'Nearby Parking Search',
          method: 'GET',
          note: 'https://api.tomtom.com/parking/2/nearbySearch.json',
          params: SEARCH_PARAMS,
          code: SEARCH_CODE,
          lang: 'bash',
        },
        {
          id: 'nearby-search-response',
          heading: 'Response',
          params: SEARCH_RESPONSE,
          code: SEARCH_CODE_RESPONSE,
          lang: 'json',
        },
      ]}
    />
  );
}
