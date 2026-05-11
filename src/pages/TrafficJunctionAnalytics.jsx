import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

const BODY_PARAMS = [
  {
    name: 'junctionId',
    type: 'string',
    desc: 'TomTom junction catalogue identifier. Use this when the exact junction ID is known. Mutually exclusive with junctionGeometry.',
  },
  {
    name: 'junctionGeometry',
    type: 'object',
    desc: 'Geographic lookup for junctions when the ID is unknown. Mutually exclusive with junctionId.',
    children: [
      { name: 'junctionGeometry.centerPoint', required: true, type: 'object', desc: 'Approximate centre of the junction.' },
      { name: 'junctionGeometry.centerPoint.latitude', required: true, type: 'float', desc: 'Latitude of the junction centre.' },
      { name: 'junctionGeometry.centerPoint.longitude', required: true, type: 'float', desc: 'Longitude of the junction centre.' },
      { name: 'junctionGeometry.radius', required: true, type: 'integer', desc: 'Search radius in metres. The nearest junction within this radius is used.' },
    ],
  },
  { name: 'dateRange', required: true, type: 'object', desc: 'Date range for historical analysis.' },
  { name: 'dateRange.from', required: true, type: 'string (ISO 8601)', desc: 'Start date inclusive. Example: "2025-01-01".' },
  { name: 'dateRange.to', required: true, type: 'string (ISO 8601)', desc: 'End date inclusive. Example: "2025-01-31".' },
  { name: 'timeGroups', type: 'array', desc: 'Optional time-of-day filters. Same structure as other Traffic Analytics endpoints.' },
  { name: 'timeGroups[].days', type: 'string[]', values: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'], desc: 'Days of the week for this group.' },
  { name: 'timeGroups[].timeRange', type: 'object', desc: 'Time window as { from (HH:mm), to (HH:mm) }.' },
  { name: 'movements', type: 'array', desc: 'Optional filter to return only specific turning movements. When omitted, all observed movements at the junction are returned.' },
  { name: 'movements[].fromDirection', type: 'string', desc: 'Approach direction. Cardinal compass direction (N, NE, E, SE, S, SW, W, NW) or the incoming road name/ID.' },
  { name: 'movements[].toDirection', type: 'string', desc: 'Exit direction. Same format as fromDirection.' },
];

const RESPONSE_FIELDS = [
  { name: 'junctionId', type: 'string', desc: 'Resolved TomTom junction identifier.' },
  { name: 'junctionName', type: 'string', desc: 'Human-readable name of the junction (road names or landmark).' },
  { name: 'movementResults', type: 'array', desc: 'One result object per observed turning movement at the junction.' },
  { name: 'movementResults[].fromDirection', type: 'string', desc: 'Approach direction for this movement.' },
  { name: 'movementResults[].toDirection', type: 'string', desc: 'Exit direction for this movement.' },
  { name: 'movementResults[].count', type: 'integer', desc: 'Total number of probe-observed vehicles making this movement in the queried period.' },
  { name: 'movementResults[].averageDelayInSeconds', type: 'float', desc: 'Mean delay incurred by vehicles making this movement, compared to unimpeded throughput. Higher values indicate signal timing inefficiency or congestion.' },
  { name: 'movementResults[].queueLengthInMeters', type: 'float', desc: 'Average queue length in metres on the approach lane for this movement.' },
  { name: 'movementResults[].percentOfTotalVolume', type: 'float', desc: 'Share of total junction volume attributed to this movement (0–100).' },
];

const CODE = `curl -X POST \\
  "https://api.tomtom.com/trafficstats/1/junctionAnalytics?key=YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "junctionGeometry": {
      "centerPoint": {
        "latitude": 52.3731,
        "longitude": 4.8922
      },
      "radius": 50
    },
    "dateRange": {
      "from": "2025-01-01",
      "to": "2025-01-31"
    },
    "timeGroups": [
      {
        "days": ["MON", "TUE", "WED", "THU", "FRI"],
        "timeRange": { "from": "08:00", "to": "09:00" }
      }
    ],
    "movements": [
      { "fromDirection": "N", "toDirection": "S" },
      { "fromDirection": "E", "toDirection": "W" }
    ]
  }'`;

const CODE_RESPONSE = `{
  "junctionId": "junction-nl-4821093",
  "junctionName": "Weesperstraat / Mauritskade",
  "movementResults": [
    {
      "fromDirection": "N",
      "toDirection": "S",
      "count": 12840,
      "averageDelayInSeconds": 38.2,
      "queueLengthInMeters": 42.5,
      "percentOfTotalVolume": 28.4
    },
    {
      "fromDirection": "E",
      "toDirection": "W",
      "count": 9621,
      "averageDelayInSeconds": 52.7,
      "queueLengthInMeters": 61.3,
      "percentOfTotalVolume": 21.3
    }
  ]
}`;

export default function TrafficJunctionAnalytics({ onNavigate }) {
  return (
    <ApiRefTwoCol
      title="Junction Analytics"
      description="Retrieve turning movement counts, queue lengths, and signal delay metrics at road junctions using historical probe data. Identify which movements cause the most congestion and support signal timing optimisation, junction capacity assessment, and traffic impact studies."
      version="v1"
      sections={[
        {
          id: 'request',
          heading: 'Request',
          method: 'POST',
          demoId: 'junction-analytics',
          note: 'https://api.tomtom.com/trafficstats/1/junctionAnalytics — Provide either junctionId (from the TomTom junction catalogue) or junctionGeometry (lat/lon + radius) to identify the junction. Not both.',
          params: BODY_PARAMS,
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
