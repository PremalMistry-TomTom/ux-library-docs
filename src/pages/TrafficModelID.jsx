import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

const QUERY_PARAMS = [
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
];

const RESPONSE_FIELDS = [
  { name: 'modelId', type: 'string', desc: 'Opaque string identifier representing the current traffic data model version. Example: "1610060964". Changes each time TomTom publishes a new batch of traffic data (approximately every minute).' },
];

const CODE = `curl "https://api.tomtom.com/traffic/services/4/trafficModelID/json\\
  ?key=YOUR_API_KEY"`;

const CODE_RESPONSE = `{
  "modelId": "1610060964"
}`;

const CODE_CACHE = `const API_KEY = 'your-api-key';
let currentModelId = null;

async function fetchIncidentsIfUpdated(bbox) {
  // 1. Get the latest traffic model ID
  const modelRes = await fetch(
    \`https://api.tomtom.com/traffic/services/4/trafficModelID/json?key=\${API_KEY}\`
  );
  const { modelId } = await modelRes.json();

  // 2. Skip the incident fetch if data hasn't changed
  if (modelId === currentModelId) {
    console.log('Traffic data unchanged, using cached incidents');
    return null;
  }

  // 3. Fetch incidents, passing the model ID for CDN cache validation
  const incidentRes = await fetch(
    \`https://api.tomtom.com/traffic/services/5/incidentDetails\` +
    \`?key=\${API_KEY}&bbox=\${bbox}&t=\${modelId}\`
  );

  currentModelId = modelId;
  return incidentRes.json();
}`;

export default function TrafficModelID({ onNavigate }) {
  return (
    <ApiRefTwoCol
      title="Traffic Model ID"
      description="Retrieve the identifier for the current traffic data model. The model ID changes each time TomTom publishes a new traffic data batch (approximately every minute). Pass it as the t parameter in incident and tile requests to enable server-side cache validation — the server returns HTTP 304 Not Modified when the data is unchanged, avoiding unnecessary payload transfers."
      version="v1"
      sections={[
        {
          id: 'request',
          heading: 'Request',
          method: 'GET',
          demoId: 'traffic-model-id',
          note: 'https://api.tomtom.com/traffic/services/4/trafficModelID/json — Also available as /trafficModelID/jsonp and /trafficModelID/xml.',
          params: QUERY_PARAMS,
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
        {
          id: 'cache-pattern',
          heading: 'Cache Validation Pattern',
          note: 'Poll the Traffic Model ID endpoint at your desired refresh interval (60 s is typical). Compare the returned modelId to your locally stored value. Only re-fetch incident tiles or incident details when the ID has changed. Pass the new modelId as the t query parameter to allow the CDN to serve a 304 response when tiles have not been regenerated.',
          params: [],
          code: CODE_CACHE,
          lang: 'javascript',
        },
      ]}
    />
  );
}
