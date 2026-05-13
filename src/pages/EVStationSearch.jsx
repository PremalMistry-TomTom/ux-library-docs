import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

const SEARCH_PARAMS = [
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'lat', required: true, type: 'float', desc: 'Latitude of the search centre. Range: −90 to 90.' },
  { name: 'lon', required: true, type: 'float', desc: 'Longitude of the search centre. Range: −180 to 180.' },
  { name: 'radius', type: 'integer', default: 10000, desc: 'Search radius in metres around lat/lon. Maximum: 50000.' },
  { name: 'limit', type: 'integer', default: 10, desc: 'Maximum number of results (1–100).' },
  { name: 'language', type: 'string (IETF)', default: 'en-GB', desc: 'Language for result names. Example: de-DE' },
  { name: 'countrySet', type: 'string', desc: 'Comma-separated ISO 3166-1 codes to restrict results. Example: DE,NL' },
  {
    name: 'connectorSet',
    type: 'string',
    desc: 'Comma-separated list of connector types to filter stations by. Only stations with at least one matching connector are returned.',
    values: [
      'IEC62196Type1',
      'IEC62196Type1CCS',
      'IEC62196Type2CableAttached',
      'IEC62196Type2Outlet',
      'IEC62196Type2CCS',
      'IEC62196Type3',
      'Chademo',
      'GBT20234Part2',
      'GBT20234Part3',
      'Iec60309AC1PhaseBlue',
      'Iec60309DCWhite',
      'Tesla',
      'AdaptedTesla',
      'Nema5_20',
      'Nema6_20',
      'Nema14_30',
      'Nema14_50',
    ],
  },
  { name: 'minPowerKW', type: 'float', desc: 'Minimum rated power per connector in kilowatts. Filters out low-power chargers.' },
  { name: 'maxPowerKW', type: 'float', desc: 'Maximum rated power per connector in kilowatts.' },
  { name: 'operatorSet', type: 'string', desc: 'Comma-separated charging network operator IDs to restrict results.' },
  { name: 'openingHours', type: 'string', values: ['nextSevenDays'], desc: 'Include opening hours in the response. Currently supports nextSevenDays.' },
  { name: 'chargingAvailability', type: 'boolean', default: false, desc: 'When true, includes real-time connector availability data for each station. Coverage varies by market — see Supported Markets.' },
];

const ALONG_ROUTE_PARAMS = [
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'limit', type: 'integer', default: 10, desc: 'Maximum number of stations to return (1–20).' },
  { name: 'connectorSet', type: 'string', desc: 'Comma-separated connector types to filter by. Same values as EV Station Search.' },
  { name: 'minPowerKW', type: 'float', desc: 'Minimum connector power in kilowatts.' },
  { name: 'maxPowerKW', type: 'float', desc: 'Maximum connector power in kilowatts.' },
];

const SEARCH_CODE = `curl "https://api.tomtom.com/search/2/nearbySearch/.json?key=YOUR_API_KEY&lat=52.3731&lon=4.8922&radius=5000&categorySet=7309&connectorSet=IEC62196Type2CableAttached,IEC62196Type2CCS&chargingAvailability=true&limit=10"`;

const ALONG_ROUTE_CODE = `curl -X POST \\
  "https://api.tomtom.com/search/2/searchAlongRoute/EV+Charging+Station.json?key=YOUR_API_KEY&limit=5&connectorSet=IEC62196Type2CCS" \\
  -H "Content-Type: application/json" \\
  -d '{
    "route": {
      "points": [
        { "lat": 52.3731, "lon": 4.8922 },
        { "lat": 51.9225, "lon": 4.4792 },
        { "lat": 51.5074, "lon": -0.1278 }
      ]
    },
    "maxDetourTime": 300
  }'`;

export function EVStationSearchV1Content({ onNavigate }) {
  return (
    <ApiRefTwoCol
      description="Find electric vehicle charging stations near a coordinate using TomTom's Search API with category set 7309. Filter by connector type, power level, and operator. Optionally include real-time slot availability. Also covers the Along-Route Charging endpoint for finding stations along a planned route."
      sections={[
        {
          id: 'ev-station-search',
          heading: 'EV Station Search',
          method: 'GET',
          demoId: 'ev-station-search',
          note: 'https://api.tomtom.com/search/2/nearbySearch/.json — Pass categorySet=7309 to target EV charging stations specifically. Use chargingAvailability=true to include live connector slot data alongside POI results.',
          params: SEARCH_PARAMS,
          code: SEARCH_CODE,
          lang: 'bash',
        },
        {
          id: 'along-route-charging',
          heading: 'Along-Route Charging',
          method: 'POST',
          note: 'https://api.tomtom.com/search/2/searchAlongRoute/EV+Charging+Station.json — Submit a route as an array of lat/lon points. The API returns stations within the route corridor, ranked by deviation from the original path. maxDetourTime (seconds) limits how far off-route a station can be.',
          params: ALONG_ROUTE_PARAMS,
          code: ALONG_ROUTE_CODE,
          lang: 'bash',
        },
      ]}
    />
  );
}
