import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

const AVAILABILITY_PARAMS = [
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'chargingAvailability', type: 'string', desc: 'Connector set ID returned in the dataSources.chargingAvailability.id field of an EV Station Search result. Either this or id is required.' },
  { name: 'id', type: 'string', desc: 'Charging park POI ID. Alternative to chargingAvailability. Use when you already have the park identifier from a previous search.' },
  {
    name: 'connectorSet',
    type: 'string',
    desc: 'Comma-separated connector types to filter the availability response by. Only connector types matching this list are returned.',
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
      'Tesla',
      'AdaptedTesla',
    ],
  },
];

const POI_CATEGORIES_PARAMS = [
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'language', type: 'string (IETF)', default: 'en-GB', desc: 'Language for category names returned in the response.' },
];

const AVAILABILITY_CODE = `# Using a chargingAvailability ID from a prior search result
curl "https://api.tomtom.com/search/2/chargingAvailability.json?key=YOUR_API_KEY&chargingAvailability=CONNECTOR_SET_ID"

# Using a charging park POI ID directly
curl "https://api.tomtom.com/search/2/chargingAvailability.json?key=YOUR_API_KEY&id=CHARGING_PARK_ID"`;

const POI_CATEGORIES_CODE = `curl "https://api.tomtom.com/search/2/poiCategories.json?key=YOUR_API_KEY&language=en-GB"`;

export function EVChargingAvailabilityV1Content({ onNavigate }) {
  return (
    <ApiRefTwoCol
      description="Query real-time connector availability at a charging station — how many connectors are available, occupied, or in an unknown state, per connector type. Coverage varies by country; use the Supported Markets endpoint to check before integrating."
      sections={[
        {
          id: 'charging-availability',
          heading: 'Charging Availability',
          method: 'GET',
          note: 'https://api.tomtom.com/search/2/chargingAvailability.json — Provide either a chargingAvailability ID (from a search result\'s dataSources.chargingAvailability.id field) or a charging park id. The response includes per-connector-type counts and a lastUpdated timestamp. Real-time data coverage varies by country — see Supported Markets.',
          params: AVAILABILITY_PARAMS,
          code: AVAILABILITY_CODE,
          lang: 'bash',
        },
        {
          id: 'poi-categories',
          heading: 'POI Categories',
          method: 'GET',
          note: 'https://api.tomtom.com/search/2/poiCategories.json — Returns the full list of POI category IDs and names. Use this to discover the numeric IDs (such as 7309 for EV charging stations) needed for categorySet filtering in EV Station Search and other nearby search queries.',
          params: POI_CATEGORIES_PARAMS,
          code: POI_CATEGORIES_CODE,
          lang: 'bash',
        },
      ]}
    />
  );
}
