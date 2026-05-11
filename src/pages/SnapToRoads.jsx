import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

const PARAMS = [
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'points', required: true, type: 'string', desc: 'GPS points to snap, each as lat:lon. Repeat the parameter for multiple points, e.g. &points=52.37:4.89&points=52.38:4.90. Minimum 2 points.' },
  { name: 'heading', required: false, type: 'string', desc: 'Comma-separated heading values in degrees (0–360) — one per point. Helps resolve ambiguous snapping near intersections.' },
  { name: 'radius', required: false, type: 'integer', default: '50', desc: 'Snapping search radius in metres per point. Increase for low-accuracy GPS traces.' },
  { name: 'includeSpeedLimits', required: false, type: 'boolean', default: 'false', desc: 'When true, the response includes speed limit information for each snapped segment.' },
  { name: 'fields', required: false, type: 'string', desc: 'Comma-separated list of response fields to include. Omit to receive all fields.' },
];

const RESPONSE_FIELDS = [
  {
    name: 'snappedPoints', type: 'array', desc: 'List of snapped positions corresponding to each input point.',
    children: [
      { name: 'originalIndex', type: 'integer', desc: 'Zero-based index of the input point this result corresponds to.' },
      { name: 'location', type: 'object', desc: 'Snapped position on the road network.' },
      { name: 'location.lat', type: 'number', desc: 'Snapped latitude.' },
      { name: 'location.lon', type: 'number', desc: 'Snapped longitude.' },
      { name: 'placeId', type: 'string', desc: 'Identifier for the road segment the point was snapped to.' },
      { name: 'distance', type: 'number', desc: 'Distance in metres between the original GPS point and the snapped position.' },
      {
        name: 'speedLimitInfo', type: 'object', desc: 'Speed limit on the snapped segment. Only present when includeSpeedLimits=true.',
        children: [
          { name: 'unitOfMeasure', type: 'string', values: ['KPH', 'MPH'], desc: 'Unit of the speed limit value.' },
          { name: 'maxSpeedLimit', type: 'integer', desc: 'Posted maximum speed limit on this segment.' },
        ],
      },
    ],
  },
];

const GET_CODE = `curl "https://api.tomtom.com/maps/orbis/roads/snap-to-roads/v1?key=YOUR_API_KEY&points=52.3731:4.8926&points=52.3758:4.8942&points=52.3782:4.8971&includeSpeedLimits=true"`;

const GET_RESPONSE = `{
  "snappedPoints": [
    {
      "originalIndex": 0,
      "location": { "lat": 52.3732, "lon": 4.8924 },
      "placeId": "ChIJ_-road-segment-id-001",
      "distance": 3.2,
      "speedLimitInfo": { "unitOfMeasure": "KPH", "maxSpeedLimit": 50 }
    },
    {
      "originalIndex": 1,
      "location": { "lat": 52.3759, "lon": 4.8941 },
      "placeId": "ChIJ_-road-segment-id-002",
      "distance": 1.8,
      "speedLimitInfo": { "unitOfMeasure": "KPH", "maxSpeedLimit": 50 }
    },
    {
      "originalIndex": 2,
      "location": { "lat": 52.3781, "lon": 4.8973 },
      "placeId": "ChIJ_-road-segment-id-003",
      "distance": 5.1,
      "speedLimitInfo": { "unitOfMeasure": "KPH", "maxSpeedLimit": 30 }
    }
  ]
}`;

const JS_CODE = `const points = [
  { lat: 52.3731, lon: 4.8926 },
  { lat: 52.3758, lon: 4.8942 },
  { lat: 52.3782, lon: 4.8971 },
];

const query = points
  .map(p => \`points=\${p.lat}:\${p.lon}\`)
  .join('&');

const url =
  \`https://api.tomtom.com/maps/orbis/roads/snap-to-roads/v1?\${query}\` +
  \`&includeSpeedLimits=true&key=YOUR_API_KEY\`;

const response = await fetch(url);
const data = await response.json();

data.snappedPoints.forEach(pt => {
  console.log(
    \`Point \${pt.originalIndex}: snapped to \`,
    pt.location,
    \`(\${pt.distance.toFixed(1)} m from original)\`
  );
});`;

export default function SnapToRoads({ onNavigate }) {
  return (
    <ApiRefTwoCol
      title="Snap to Roads"
      description="Align a raw GPS trace to the road network, correcting positional noise from low-accuracy receivers. Returns a cleaned sequence of positions snapped to actual road geometry, along with optional speed limit data per segment. Essential for fleet telematics, driver behaviour analysis, and route reconstruction."
      version="v1"
      sections={[
        {
          id: 'request',
          heading: 'Snap GPS Trace',
          method: 'GET',
          note: 'https://api.tomtom.com/maps/orbis/roads/snap-to-roads/v1',
          params: PARAMS,
          code: GET_CODE,
          lang: 'bash',
        },
        {
          id: 'response',
          heading: 'Response',
          params: RESPONSE_FIELDS,
          code: GET_RESPONSE,
          lang: 'json',
        },
        {
          id: 'js-example',
          heading: 'JavaScript Example',
          note: 'Multi-point GPS trace using the Fetch API',
          params: [],
          code: JS_CODE,
          lang: 'javascript',
        },
      ]}
    />
  );
}
