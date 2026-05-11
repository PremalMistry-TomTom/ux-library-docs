import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

const ROUTE_STATS_BODY = [
  { name: 'network', required: true, type: 'object', desc: 'Defines the road network segments to analyse.' },
  { name: 'network.segmentIds', required: true, type: 'string[]', desc: 'Array of TomTom segment IDs or OpenLR binary location references. Obtain TomTom segment IDs from the Map Display API or routing response.' },
  { name: 'dateRange', required: true, type: 'object', desc: 'Date range for historical data aggregation.' },
  { name: 'dateRange.from', required: true, type: 'string (ISO 8601)', desc: 'Start date inclusive. Example: "2025-01-01".' },
  { name: 'dateRange.to', required: true, type: 'string (ISO 8601)', desc: 'End date inclusive. Example: "2025-01-31".' },
  { name: 'timeGroups', type: 'array', desc: 'Optional array of time-of-day filters. When omitted, aggregates across all hours and days.' },
  { name: 'timeGroups[].days', type: 'string[]', values: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'], desc: 'Days of the week to include in this group.' },
  { name: 'timeGroups[].timeRange', type: 'object', desc: 'Hour range for this group.' },
  { name: 'timeGroups[].timeRange.from', type: 'string (HH:mm)', desc: 'Start time inclusive. Example: "07:00".' },
  { name: 'timeGroups[].timeRange.to', type: 'string (HH:mm)', desc: 'End time exclusive. Example: "09:00".' },
];

const ROUTE_STATS_RESPONSE = [
  { name: 'segmentResults', type: 'array', desc: 'One result object per segment ID in the request.' },
  { name: 'segmentResults[].segmentId', type: 'string', desc: 'The segment identifier from the request.' },
  { name: 'segmentResults[].travelTimeSeconds', type: 'object', desc: 'Travel time statistics for the segment over the queried period.' },
  { name: 'segmentResults[].travelTimeSeconds.avg', type: 'float', desc: 'Mean travel time in seconds.' },
  { name: 'segmentResults[].travelTimeSeconds.min', type: 'float', desc: 'Minimum observed travel time in seconds.' },
  { name: 'segmentResults[].travelTimeSeconds.max', type: 'float', desc: 'Maximum observed travel time in seconds.' },
  { name: 'segmentResults[].travelTimeSeconds.p50', type: 'float', desc: 'Median (50th percentile) travel time.' },
  { name: 'segmentResults[].travelTimeSeconds.p85', type: 'float', desc: '85th percentile travel time — useful for reliability planning.' },
  { name: 'segmentResults[].travelTimeSeconds.p95', type: 'float', desc: '95th percentile travel time — worst-case estimate.' },
  { name: 'segmentResults[].speedInKmph', type: 'object', desc: 'Speed statistics in km/h.' },
  { name: 'segmentResults[].speedInKmph.avg', type: 'float', desc: 'Mean speed in km/h.' },
  { name: 'segmentResults[].speedInKmph.min', type: 'float', desc: 'Minimum observed speed in km/h.' },
  { name: 'segmentResults[].speedInKmph.max', type: 'float', desc: 'Maximum observed speed in km/h.' },
];

const ROAD_SEGMENT_BODY = [
  { name: 'segmentId', required: true, type: 'string', desc: 'A single TomTom segment ID to query.' },
  { name: 'dateRange', required: true, type: 'object', desc: 'Date range as { from, to } in ISO 8601 format.' },
  { name: 'timeGroups', type: 'array', desc: 'Optional time-of-day filters. Same structure as routeStatistics timeGroups.' },
  { name: 'statistics', type: 'string[]', values: ['SPEED', 'TRAVEL_TIME', 'CONGESTION_INDEX', 'DELAY'], desc: 'Subset of metrics to include. Defaults to all metrics when omitted.' },
];

const ROAD_SEGMENT_RESPONSE = [
  { name: 'segmentId', type: 'string', desc: 'The queried segment identifier.' },
  { name: 'statistics', type: 'object', desc: 'Computed metrics for the segment.' },
  { name: 'statistics.speedInKmph', type: 'object', desc: 'Speed percentiles: avg, min, max, p50, p85, p95.' },
  { name: 'statistics.travelTimeSeconds', type: 'object', desc: 'Travel time percentiles: avg, min, max, p50, p85, p95.' },
  { name: 'statistics.congestionIndex', type: 'float (0–10)', desc: 'Normalised congestion level. 0 = free flow, 10 = heavily congested.' },
  { name: 'statistics.delayInSeconds', type: 'object', desc: 'Extra delay compared to free-flow conditions: avg, p50, p95.' },
];

const CODE_ROUTE = `curl -X POST \\
  "https://api.tomtom.com/trafficstats/1/routeStatistics?key=YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "network": {
      "segmentIds": ["372320780", "372320781", "372320782"]
    },
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

const CODE_ROUTE_RESPONSE = `{
  "segmentResults": [
    {
      "segmentId": "372320780",
      "travelTimeSeconds": {
        "avg": 42.3,
        "min": 18.1,
        "max": 187.4,
        "p50": 38.7,
        "p85": 71.2,
        "p95": 112.8
      },
      "speedInKmph": {
        "avg": 67.4,
        "min": 8.2,
        "max": 92.0
      }
    }
  ]
}`;

const CODE_ROAD_SEGMENT = `curl -X POST \\
  "https://api.tomtom.com/trafficstats/1/roadSegmentStatistics?key=YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "segmentId": "372320780",
    "dateRange": { "from": "2025-01-01", "to": "2025-01-31" },
    "statistics": ["SPEED", "TRAVEL_TIME", "CONGESTION_INDEX"]
  }'`;

export default function TrafficRouteStats({ onNavigate }) {
  return (
    <ApiRefTwoCol
      title="Route Statistics"
      description="Compute historical travel time and speed statistics along a defined sequence of road segments. Supports percentile metrics (p50, p85, p95) for reliability analysis, configurable date ranges, and time-of-day filters. The Road Segment Stats endpoint provides the same metrics for a single segment with additional congestion and delay indices."
      version="v1"
      sections={[
        {
          id: 'route-statistics',
          heading: 'Route Statistics',
          method: 'POST',
          demoId: 'traffic-stats',
          note: 'https://api.tomtom.com/trafficstats/1/routeStatistics',
          params: ROUTE_STATS_BODY,
          code: CODE_ROUTE,
          lang: 'bash',
        },
        {
          id: 'route-statistics-response',
          heading: 'Response',
          params: ROUTE_STATS_RESPONSE,
          code: CODE_ROUTE_RESPONSE,
          lang: 'json',
        },
        {
          id: 'road-segment-stats',
          heading: 'Road Segment Statistics',
          method: 'POST',
          note: 'https://api.tomtom.com/trafficstats/1/roadSegmentStatistics — Query a single segment for detailed speed percentiles, congestion index, and delay metrics. Useful for per-link performance reporting on a traffic management dashboard.',
          params: ROAD_SEGMENT_BODY,
          code: CODE_ROAD_SEGMENT,
          lang: 'bash',
        },
        {
          id: 'road-segment-response',
          heading: 'Road Segment Response',
          params: ROAD_SEGMENT_RESPONSE,
          code: '',
          lang: 'json',
        },
      ]}
    />
  );
}
