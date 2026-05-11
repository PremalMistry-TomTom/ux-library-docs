import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

const BODY_PARAMS = [
  { name: 'origins', required: true, type: 'array', desc: 'Array of origin point objects. Each point represents a zone or location from which trips depart.' },
  { name: 'origins[].latitude', required: true, type: 'float', desc: 'Latitude of the origin point.' },
  { name: 'origins[].longitude', required: true, type: 'float', desc: 'Longitude of the origin point.' },
  { name: 'destinations', required: true, type: 'array', desc: 'Array of destination point objects. Each point represents a zone or location where trips arrive.' },
  { name: 'destinations[].latitude', required: true, type: 'float', desc: 'Latitude of the destination point.' },
  { name: 'destinations[].longitude', required: true, type: 'float', desc: 'Longitude of the destination point.' },
  { name: 'dateRange', required: true, type: 'object', desc: 'Date range for historical data aggregation.' },
  { name: 'dateRange.from', required: true, type: 'string (ISO 8601)', desc: 'Start date inclusive. Example: "2025-01-01".' },
  { name: 'dateRange.to', required: true, type: 'string (ISO 8601)', desc: 'End date inclusive. Example: "2025-01-31".' },
  { name: 'timeGroups', type: 'array', desc: 'Optional time-of-day filters to analyse specific periods such as AM peak, PM peak, or off-peak.' },
  { name: 'timeGroups[].days', type: 'string[]', values: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'], desc: 'Days of the week to include in this group.' },
  { name: 'timeGroups[].timeRange', type: 'object', desc: 'Time-of-day window as { from (HH:mm), to (HH:mm) }.' },
];

const RESPONSE_FIELDS = [
  { name: 'odMatrixResults', type: 'array', desc: 'One result object per origin-destination pair with observed travel data.' },
  { name: 'odMatrixResults[].originIndex', type: 'integer', desc: 'Zero-based index into the origins array from the request.' },
  { name: 'odMatrixResults[].destinationIndex', type: 'integer', desc: 'Zero-based index into the destinations array from the request.' },
  { name: 'odMatrixResults[].travelTimeSeconds', type: 'object', desc: 'Observed travel time statistics for this O/D pair.' },
  { name: 'travelTimeSeconds.avg', type: 'float', desc: 'Mean travel time in seconds.' },
  { name: 'travelTimeSeconds.min', type: 'float', desc: 'Minimum observed travel time.' },
  { name: 'travelTimeSeconds.max', type: 'float', desc: 'Maximum observed travel time.' },
  { name: 'travelTimeSeconds.p50', type: 'float', desc: 'Median travel time.' },
  { name: 'odMatrixResults[].distanceInMeters', type: 'float', desc: 'Typical route distance in metres for this O/D pair, based on the most commonly observed routes.' },
  { name: 'odMatrixResults[].tripCount', type: 'integer', desc: 'Number of probe-observed trips between this origin and destination in the queried period. Pairs with very low counts are suppressed for privacy.' },
];

const CODE = `curl -X POST \\
  "https://api.tomtom.com/trafficstats/1/odMatrix?key=YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "origins": [
      { "latitude": 52.3731, "longitude": 4.8922 },
      { "latitude": 52.3612, "longitude": 4.9088 }
    ],
    "destinations": [
      { "latitude": 52.3080, "longitude": 4.7661 },
      { "latitude": 52.3402, "longitude": 4.8903 }
    ],
    "dateRange": {
      "from": "2025-01-01",
      "to": "2025-01-31"
    },
    "timeGroups": [
      {
        "days": ["MON", "TUE", "WED", "THU", "FRI"],
        "timeRange": { "from": "07:00", "to": "09:00" }
      }
    ]
  }'`;

const CODE_RESPONSE = `{
  "odMatrixResults": [
    {
      "originIndex": 0,
      "destinationIndex": 0,
      "travelTimeSeconds": {
        "avg": 1842.0,
        "min": 1204.0,
        "max": 3601.0,
        "p50": 1763.0
      },
      "distanceInMeters": 14820.0,
      "tripCount": 3241
    },
    {
      "originIndex": 0,
      "destinationIndex": 1,
      "travelTimeSeconds": {
        "avg": 682.0,
        "min": 441.0,
        "max": 1540.0,
        "p50": 638.0
      },
      "distanceInMeters": 5310.0,
      "tripCount": 1876
    }
  ]
}`;

export default function TrafficODAnalysis({ onNavigate }) {
  return (
    <ApiRefTwoCol
      title="O/D Analysis"
      description="Measure historical traffic flows and travel times between origin-destination pairs using probe data. Returns an OD matrix with travel time statistics and trip counts for each pair. Use this endpoint for transport demand modelling, strategic corridor analysis, and understanding commuter movement patterns."
      version="v1"
      sections={[
        {
          id: 'request',
          heading: 'Request',
          method: 'POST',
          note: 'https://api.tomtom.com/trafficstats/1/odMatrix — Origin and destination arrays are matched by index in the response. O/D pairs with fewer trips than the privacy threshold are omitted from the results.',
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
