import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

const PARAMS = [
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
];

const CODE = `curl "https://api.tomtom.com/search/2/charger/supportedMarkets.json?key=YOUR_API_KEY"`;

export default function EVSupportedMarkets({ onNavigate }) {
  return (
    <ApiRefTwoCol
      title="Supported Markets"
      description="Return the list of countries where TomTom EV charging data is available, along with the coverage type for each. Use this endpoint to verify whether real-time availability or static station data is supported in your target markets before building features that depend on live connector status."
      version="v2"
      sections={[
        {
          id: 'supported-markets',
          heading: 'Supported Markets',
          method: 'GET',
          demoId: 'ev-market-coverage',
          note: 'https://api.tomtom.com/search/2/charger/supportedMarkets.json — Returns an array of country objects. Each entry includes an ISO 3166-1 alpha-2 country code, a human-readable country name, and a coverageType field. REAL_TIME means live connector availability data is available via the Charging Availability endpoint. STATIC means station locations are available but connector slot counts are not updated in real time. NONE means no EV charging data is currently available for that market.',
          params: PARAMS,
          code: CODE,
          lang: 'bash',
        },
      ]}
    />
  );
}
