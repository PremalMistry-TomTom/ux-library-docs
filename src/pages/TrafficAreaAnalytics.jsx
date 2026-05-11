import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

const BODY_PARAMS = [
  { name: 'geopolygon', required: true, type: 'object', desc: 'Geographic polygon defining the analysis area.' },
  { name: 'geopolygon.points', required: true, type: 'array', desc: 'Array of { latitude, longitude } objects defining the polygon boundary. Minimum 3 points, maximum 100 points. The polygon is automatically closed (last point connects to first).' },
  { name: 'dateRange', required: true, type: 'object', desc: 'Date range for historical data aggregation.' },
  { name: 'dateRange.from', required: true, type: 'string (ISO 8601)', desc: 'Start date inclusive. Example: "2025-01-01".' },
  { name: 'dateRange.to', required: true, type: 'string (ISO 8601)', desc: 'End date inclusive. Example: "2025-01-31".' },
  { name: 'timeGroups', type: 'array', desc: 'Optional array of time-of-day filters. When omitted, aggregates across all hours and days.' },
  { name: 'timeGroups[].days', type: 'string[]', values: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'], desc: 'Days of the week to include in this time group.' },
  { name: 'timeGroups[].timeRange', type: 'object', desc: 'Time-of-day window for this group.' },
  { name: 'timeGroups[].timeRange.from', type: 'string (HH:mm)', desc: 'Start time inclusive. Example: "08:00".' },
  { name: 'timeGroups[].timeRange.to', type: 'string (HH:mm)', desc: 'End time exclusive. Example: "09:00".' },
  { name: 'statistics', type: 'string[]', values: ['SPEED', 'TRAVEL_TIME', 'CONGESTION_INDEX'], desc: 'Metrics to compute. Defaults to all available metrics when omitted.' },
];

const RESPONSE_FIELDS = [
  { name: 'timeRangeResults', type: 'array', desc: 'One result per time group defined in the request (or one aggregate result if no time groups were specified).' },
  { name: 'timeRangeResults[].timeGroup', type: 'object', desc: 'The time group this result corresponds to.' },
  { name: 'timeRangeResults[].timeGroup.days', type: 'string[]', desc: 'Days of week for this time group.' },
  { name: 'timeRangeResults[].timeGroup.timeRange', type: 'object', desc: 'Time-of-day window as { from, to }.' },
  { name: 'timeRangeResults[].statistics', type: 'object', desc: 'Computed metrics for this time group within the polygon.' },
  { name: 'statistics.averageSpeed', type: 'float', desc: 'Mean vehicle speed in km/h across all road segments within the polygon.' },
  { name: 'statistics.congestionIndex', type: 'float (0–10)', desc: 'Area-wide congestion level. 0 = free-flow conditions across all roads; 10 = severe congestion across most roads.' },
  { name: 'statistics.travelTimeFactor', type: 'float', desc: 'Ratio of actual travel time to free-flow travel time. 1.0 = free flow; 2.0 = twice as long as expected.' },
  { name: 'statistics.sampleSize', type: 'integer', desc: 'Number of probe data points used to compute the statistics. Higher values indicate more reliable results.' },
];

const CODE = `curl -X POST \\
  "https://api.tomtom.com/trafficstats/1/areaStatistics?key=YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "geopolygon": {
      "points": [
        { "latitude": 52.38, "longitude": 4.88 },
        { "latitude": 52.38, "longitude": 4.92 },
        { "latitude": 52.35, "longitude": 4.92 },
        { "latitude": 52.35, "longitude": 4.88 }
      ]
    },
    "dateRange": {
      "from": "2025-01-01",
      "to": "2025-01-31"
    },
    "timeGroups": [
      {
        "days": ["MON", "TUE", "WED", "THU", "FRI"],
        "timeRange": { "from": "08:00", "to": "09:00" }
      },
      {
        "days": ["MON", "TUE", "WED", "THU", "FRI"],
        "timeRange": { "from": "17:00", "to": "19:00" }
      }
    ],
    "statistics": ["SPEED", "CONGESTION_INDEX", "TRAVEL_TIME"]
  }'`;

const CODE_RESPONSE = `{
  "timeRangeResults": [
    {
      "timeGroup": {
        "days": ["MON", "TUE", "WED", "THU", "FRI"],
        "timeRange": { "from": "08:00", "to": "09:00" }
      },
      "statistics": {
        "averageSpeed": 28.4,
        "congestionIndex": 6.2,
        "travelTimeFactor": 1.84,
        "sampleSize": 14372
      }
    },
    {
      "timeGroup": {
        "days": ["MON", "TUE", "WED", "THU", "FRI"],
        "timeRange": { "from": "17:00", "to": "19:00" }
      },
      "statistics": {
        "averageSpeed": 21.1,
        "congestionIndex": 7.8,
        "travelTimeFactor": 2.43,
        "sampleSize": 18921
      }
    }
  ]
}`;

export default function TrafficAreaAnalytics({ onNavigate }) {
  return (
    <ApiRefTwoCol
      title="Area Analytics"
      description="Analyse historical congestion metrics within a custom geographic polygon. Query average speed, congestion index, and travel time factor for specific time-of-day windows across weekdays or weekends. Use this endpoint for zone-level performance reports, low-emission zone analysis, or urban mobility studies."
      version="v1"
      sections={[
        {
          id: 'request',
          heading: 'Request',
          method: 'POST',
          demoId: 'area-analytics',
          note: 'https://api.tomtom.com/trafficstats/1/areaStatistics',
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
