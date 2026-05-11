import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

const PARAMS = [
  { name: 'lat', required: true, type: 'number', desc: 'Latitude of the query point (WGS 84). Provided as a path parameter.' },
  { name: 'lon', required: true, type: 'number', desc: 'Longitude of the query point (WGS 84). Provided as a path parameter.' },
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'radius', required: false, type: 'integer', default: '500', desc: 'Search radius in metres around the query point.' },
  { name: 'limit', required: false, type: 'integer', default: '20', desc: 'Maximum number of street segments to return.' },
];

const RESPONSE_FIELDS = [
  {
    name: 'segments', type: 'array', desc: 'List of on-street parking segments near the query point.',
    children: [
      { name: 'segmentId', type: 'string', desc: 'Unique identifier for the street segment.' },
      { name: 'geometry', type: 'object', desc: 'GeoJSON LineString representing the segment geometry.' },
      { name: 'maxDuration', type: 'integer', desc: 'Maximum permitted parking duration in minutes. Null if no time limit.' },
      {
        name: 'restrictions', type: 'array', desc: 'List of parking restrictions active on this segment.',
        children: [
          { name: 'type', type: 'string', values: ['NO_PARKING', 'NO_STOPPING', 'PERMIT_ONLY', 'LOADING_ONLY', 'TIME_LIMITED'], desc: 'Type of restriction.' },
          { name: 'dayOfWeek', type: 'array', desc: 'Days of the week the restriction applies, e.g. ["MON","TUE","WED","THU","FRI"].' },
          { name: 'timeFrom', type: 'string', desc: 'Start time of the restriction window in HH:MM format.' },
          { name: 'timeTo', type: 'string', desc: 'End time of the restriction window in HH:MM format.' },
        ],
      },
      {
        name: 'tariff', type: 'object', desc: 'Pricing information for paid on-street parking. Null if free.',
        children: [
          { name: 'price', type: 'number', desc: 'Price per unit.' },
          { name: 'currency', type: 'string', desc: 'ISO 4217 currency code.' },
          { name: 'priceUnit', type: 'string', values: ['PER_HOUR', 'PER_30_MIN'], desc: 'The billing unit for the price.' },
        ],
      },
    ],
  },
];

const CODE = `curl "https://api.tomtom.com/parking/2/onstreet/geo/52.3731/4.8926.json?key=YOUR_API_KEY&radius=300"`;

const CODE_RESPONSE = `{
  "segments": [
    {
      "segmentId": "SGM_NL_AMS_00142",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [4.8918, 52.3729],
          [4.8932, 52.3734]
        ]
      },
      "maxDuration": 120,
      "restrictions": [
        {
          "type": "NO_PARKING",
          "dayOfWeek": ["MON", "TUE", "WED", "THU", "FRI"],
          "timeFrom": "07:00",
          "timeTo": "09:00"
        }
      ],
      "tariff": {
        "price": 3.00,
        "currency": "EUR",
        "priceUnit": "PER_HOUR"
      }
    },
    {
      "segmentId": "SGM_NL_AMS_00143",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [4.8932, 52.3734],
          [4.8948, 52.3739]
        ]
      },
      "maxDuration": null,
      "restrictions": [
        {
          "type": "PERMIT_ONLY",
          "dayOfWeek": ["MON", "TUE", "WED", "THU", "FRI", "SAT"],
          "timeFrom": "00:00",
          "timeTo": "23:59"
        }
      ],
      "tariff": null
    }
  ]
}`;

export default function OnStreetParking({ onNavigate }) {
  return (
    <ApiRefTwoCol
      title="On-Street Parking"
      description="Query on-street parking segments near a geographic coordinate. Returns segment geometry, time-based restrictions, maximum stay durations, and tariff information where applicable. Coverage varies by city — on-street data is generally less comprehensive than off-street facility data."
      version="v2"
      sections={[
        {
          id: 'request',
          heading: 'On-Street Segments Near Coordinate',
          method: 'GET',
          demoId: 'on-street-parking',
          note: 'https://api.tomtom.com/parking/2/onstreet/geo/{lat}/{lon}.json',
          params: PARAMS,
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
