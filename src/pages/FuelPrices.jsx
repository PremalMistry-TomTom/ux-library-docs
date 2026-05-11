import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

const PARAMS = [
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'lat', required: true, type: 'number', desc: 'Latitude of the centre point (WGS 84).' },
  { name: 'lon', required: true, type: 'number', desc: 'Longitude of the centre point (WGS 84).' },
  { name: 'radius', required: false, type: 'integer', default: '3000', desc: 'Search radius in metres.' },
  { name: 'limit', required: false, type: 'integer', default: '10', desc: 'Maximum number of stations to return.' },
  {
    name: 'fuelType', required: false, type: 'string',
    values: ['PETROL_UNLEADED', 'PETROL_SUPER_UNLEADED', 'DIESEL', 'PREMIUM_DIESEL', 'LPG', 'NATURAL_GAS', 'HYDROGEN', 'E85', 'E10', 'B7', 'B30'],
    desc: 'Filter results to stations selling this fuel type.',
  },
  { name: 'countryCode', required: false, type: 'string', desc: 'ISO 3166-1 alpha-2 country code to restrict results, e.g. GB, NL, DE.' },
  { name: 'sort', required: false, type: 'string', values: ['DISTANCE', 'PRICE_ASCENDING'], default: 'DISTANCE', desc: 'Sort order for results.' },
];

const RESPONSE_FIELDS = [
  {
    name: 'results', type: 'array', desc: 'List of fuel stations near the query point.',
    children: [
      { name: 'stationId', type: 'string', desc: 'Unique fuel station identifier.' },
      { name: 'stationName', type: 'string', desc: 'Name of the fuel station.' },
      { name: 'brandName', type: 'string', desc: 'Fuel brand or operator name, e.g. Shell, BP, Total.' },
      { name: 'position', type: 'object', desc: 'Geographic coordinates of the station.' },
      { name: 'position.lat', type: 'number', desc: 'Station latitude.' },
      { name: 'position.lon', type: 'number', desc: 'Station longitude.' },
      { name: 'distance', type: 'number', desc: 'Straight-line distance in metres from the query coordinate.' },
      {
        name: 'fuelPrices', type: 'array', desc: 'List of fuel prices available at this station.',
        children: [
          { name: 'fuelType', type: 'string', desc: 'Fuel type identifier, e.g. DIESEL, PETROL_UNLEADED.' },
          { name: 'price', type: 'number', desc: 'Price per standard unit (litre or gallon depending on country).' },
          { name: 'currency', type: 'string', desc: 'ISO 4217 currency code.' },
          { name: 'updatedAt', type: 'string (ISO 8601)', desc: 'Timestamp when this price was last confirmed.' },
        ],
      },
    ],
  },
];

const CODE = `curl "https://api.tomtom.com/fuel/1/prices/nearbySearch.json?key=YOUR_API_KEY&lat=51.5074&lon=-0.1278&radius=2000&fuelType=DIESEL&sort=PRICE_ASCENDING"`;

const CODE_RESPONSE = `{
  "results": [
    {
      "stationId": "UK_GBR_LDN_FUEL_004812",
      "stationName": "BP Victoria",
      "brandName": "BP",
      "position": { "lat": 51.4952, "lon": -0.1441 },
      "distance": 1423,
      "fuelPrices": [
        {
          "fuelType": "DIESEL",
          "price": 1.549,
          "currency": "GBP",
          "updatedAt": "2025-05-10T06:00:00Z"
        },
        {
          "fuelType": "PETROL_UNLEADED",
          "price": 1.489,
          "currency": "GBP",
          "updatedAt": "2025-05-10T06:00:00Z"
        }
      ]
    },
    {
      "stationId": "UK_GBR_LDN_FUEL_009231",
      "stationName": "Shell Lambeth",
      "brandName": "Shell",
      "position": { "lat": 51.5012, "lon": -0.1183 },
      "distance": 1876,
      "fuelPrices": [
        {
          "fuelType": "DIESEL",
          "price": 1.569,
          "currency": "GBP",
          "updatedAt": "2025-05-10T08:15:00Z"
        }
      ]
    }
  ]
}`;

export default function FuelPrices({ onNavigate }) {
  return (
    <ApiRefTwoCol
      title="Fuel Prices"
      description="Search for fuel stations near a location and retrieve current prices by fuel type. Prices are refreshed approximately every 10 minutes. Results can be sorted by distance or ascending price."
      version="v1"
      sections={[
        {
          id: 'request',
          heading: 'Nearby Fuel Price Search',
          method: 'GET',
          demoId: 'fuel-prices',
          note: 'https://api.tomtom.com/fuel/1/prices/nearbySearch.json',
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
