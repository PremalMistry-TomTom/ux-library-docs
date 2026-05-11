import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

const PATH_PARAMS = [
  { name: 'style', required: true, type: 'string', values: ['absolute', 'relative', 'relative-delay', 'reduced-sensitivity'], desc: 'Speed representation style. absolute = km/h or mph; relative = ratio of current to free-flow speed; relative-delay = delay in seconds; reduced-sensitivity = relative with smoothed output.' },
  { name: 'zoom', required: true, type: 'integer', desc: 'Zoom level context (0–22). Controls road segment granularity used for the lookup.' },
  { name: 'format', required: true, type: 'string', values: ['json', 'jsonp', 'xml'], desc: 'Response format.' },
];

const QUERY_PARAMS = [
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'point', type: 'float,float', desc: 'Coordinate to query as lat,lon. Example: 52.3731,4.8922. Required when boundingBox is not provided.' },
  { name: 'boundingBox', type: 'string', desc: 'Alternative to point. A bounding box as minLat,minLon,maxLat,maxLon. Returns data for the segment with the highest traffic volume within the box.' },
  { name: 'unit', type: 'string', default: 'KMPH', values: ['KMPH', 'MPH'], desc: 'Speed unit used in the response.' },
  { name: 'thickness', type: 'integer', default: 10, desc: 'Road segment selection sensitivity (1–10). Lower values select only major roads; higher values include minor roads.' },
  { name: 'openLr', type: 'boolean', default: false, desc: 'When true, includes an OpenLR location reference for the segment in the response.' },
];

const RESPONSE_FIELDS = [
  { name: 'flowSegmentData', type: 'object', desc: 'Root response container.' },
  { name: 'flowSegmentData.frc', type: 'string', desc: 'Functional Road Class. FRC0 = motorway/freeway; FRC7 = local/access road.' },
  { name: 'flowSegmentData.currentSpeed', type: 'integer', desc: 'Observed current speed in the requested unit (KMPH or MPH).' },
  { name: 'flowSegmentData.freeFlowSpeed', type: 'integer', desc: 'Expected free-flow speed under ideal conditions in the requested unit.' },
  { name: 'flowSegmentData.currentTravelTime', type: 'integer', desc: 'Current travel time along the segment in seconds.' },
  { name: 'flowSegmentData.freeFlowTravelTime', type: 'integer', desc: 'Free-flow travel time along the segment in seconds.' },
  { name: 'flowSegmentData.confidence', type: 'float (0–1)', desc: 'Data reliability score. 1.0 = high confidence from real-time probe data; lower values indicate estimated or historical data.' },
  { name: 'flowSegmentData.roadClosure', type: 'boolean', desc: 'True if the segment is currently closed to traffic.' },
  { name: 'flowSegmentData.coordinates', type: 'object', desc: 'Geometry of the road segment as an ordered list of lat/lon coordinate pairs.' },
  { name: 'flowSegmentData.coordinates.coordinate', type: 'array', desc: 'Array of { latitude, longitude } objects defining the polyline of the segment.' },
  { name: 'flowSegmentData.openLrCode', type: 'string', desc: 'OpenLR binary location reference for the segment (only when openLr=true).' },
];

const CODE = `curl "https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json\\
  ?key=YOUR_API_KEY\\
  &point=52.3731,4.8922\\
  &unit=KMPH\\
  &thickness=5"`;

const CODE_RESPONSE = `{
  "flowSegmentData": {
    "frc": "FRC3",
    "currentSpeed": 62,
    "freeFlowSpeed": 90,
    "currentTravelTime": 29,
    "freeFlowTravelTime": 20,
    "confidence": 0.95,
    "roadClosure": false,
    "coordinates": {
      "coordinate": [
        { "latitude": 52.3731, "longitude": 4.8920 },
        { "latitude": 52.3738, "longitude": 4.8934 },
        { "latitude": 52.3745, "longitude": 4.8951 }
      ]
    }
  }
}`;

export default function TrafficFlowSegment({ onNavigate }) {
  return (
    <ApiRefTwoCol
      title="Flow Segment Data"
      description="Get real-time traffic flow for the road segment nearest to a given coordinate — current speed, free-flow speed, travel time ratio, and data confidence. Use this endpoint to display live congestion indicators, adjust ETAs, or detect road closures."
      version="v4"
      sections={[
        {
          id: 'request',
          heading: 'Request',
          method: 'GET',
          note: 'https://api.tomtom.com/traffic/services/4/flowSegmentData/{style}/{zoom}/{format}',
          params: [
            ...PATH_PARAMS,
            ...QUERY_PARAMS,
          ],
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
