import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

const PATH_PARAMS = [
  {
    name: 'type',
    required: true,
    type: 'string',
    values: ['absolute', 'relative', 'relative-delay'],
    desc: 'Type of traffic flow data encoded in the tile. absolute: traffic_level tag contains speed in km/h. relative: traffic_level is a fractional value (0.0–1.0) relative to free-flow speed. relative-delay: same as relative but only segments that differ from free-flow are included.',
  },
  {
    name: 'zoom',
    required: true,
    type: 'integer',
    desc: 'Zoom level of the tile. Value: 0–22. At zoom 0 the world fits on a single tile; at zoom 22 there are 2^44 tiles.',
  },
  {
    name: 'x',
    required: true,
    type: 'integer',
    desc: 'x coordinate of the tile on the XYZ zoom grid. Value: 0 to 2^zoom − 1.',
  },
  {
    name: 'y',
    required: true,
    type: 'integer',
    desc: 'y coordinate of the tile on the XYZ zoom grid. Value: 0 to 2^zoom − 1.',
  },
];

const QUERY_PARAMS = [
  {
    name: 'key',
    required: true,
    type: 'string',
    desc: 'Your TomTom API key.',
  },
  {
    name: 'roadTypes',
    type: 'array',
    desc: 'Filter road types included in the tile. Provide as a square-bracket enclosed list, e.g. [0,2,4]. Values: 0 Motorway, 1 International road, 2 Major road, 3 Secondary road, 4 Connecting road, 5 Major local road, 6 Local road, 7 Minor local road, 8 Other roads. An empty array returns an empty tile.',
  },
  {
    name: 'trafficLevelStep',
    type: 'float',
    desc: 'Minimum difference between consecutive traffic_level tag values. For relative/relative-delay: range 0.0–1.0 (exclusive). For absolute: any positive value. Reduces tile size by quantising speed values.',
  },
  {
    name: 'margin',
    type: 'float',
    default: 0.1,
    desc: 'Size of the tile margin relative to the tile size. Range: 0.0–0.1. Default: 0.1.',
  },
  {
    name: 'tags',
    type: 'array',
    desc: 'Controls which protobuf tags are included in the tile. Default tags (always included unless filtered out): road_type, traffic_level, traffic_road_coverage, left_hand_traffic, road_closure. On-demand tags (only included if listed): road_category, road_subcategory. An empty array returns geometry only.',
  },
];

const DEFAULT_TAGS = [
  {
    name: 'road_type',
    type: 'string',
    desc: 'Road classification. Values: Motorway, International road, Major road, Secondary road, Connecting road, Major local road, Local road, Minor local road, Non public road, Parking road.',
  },
  {
    name: 'traffic_level',
    type: 'double',
    desc: 'Traffic speed on the segment. For absolute type: speed in km/h (≥ 0). For relative and relative-delay: fractional value 0.00–1.00 where 1.0 = free-flow speed.',
  },
  {
    name: 'traffic_road_coverage',
    type: 'string',
    values: ['one_side', 'full'],
    desc: 'Whether traffic data covers one side of the road (two-way road) or the full road (one-way road).',
  },
  {
    name: 'left_hand_traffic',
    type: 'boolean',
    desc: 'Present (value: true) when the road uses left-hand traffic rules. Absent on right-hand traffic roads.',
  },
  {
    name: 'road_closure',
    type: 'boolean',
    desc: 'Present (value: true) when the road is closed to traffic. Absent when the road is open and passable.',
  },
];

const ON_DEMAND_TAGS = [
  {
    name: 'road_category',
    type: 'string',
    values: ['motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'street'],
    desc: 'Detailed road category. Only included when explicitly requested via the tags parameter.',
  },
  {
    name: 'road_subcategory',
    type: 'string',
    desc: 'Road subcategory, where applicable. For tertiary: connecting, major_local. For street: local, minor_local. Only included when requested via the tags parameter.',
  },
];

const CODE_FETCH = `// Fetch a vector flow tile (PBF) and decode with Mapbox's vector-tile library
import Protobuf from 'pbf';
import { VectorTile } from '@mapbox/vector-tile';

const zoom = 12;
const x = 2044;
const y = 1360;
const type = 'relative'; // absolute | relative | relative-delay
const apiKey = 'YOUR_API_KEY';

const url =
  \`https://api.tomtom.com/traffic/map/4/tile/flow/\${type}/\${zoom}/\${x}/\${y}.pbf\` +
  \`?key=\${apiKey}&tags=[road_type,traffic_level,traffic_road_coverage,road_closure]\`;

const response = await fetch(url);
const buffer = await response.arrayBuffer();
const tile = new VectorTile(new Protobuf(buffer));

const layer = tile.layers['Traffic flow'];
for (let i = 0; i < layer.length; i++) {
  const feature = layer.feature(i);
  const { road_type, traffic_level, road_closure } = feature.properties;
  console.log({ road_type, traffic_level, road_closure });
}`;

const CODE_HOST_CYCLING = `// Cycle through a–d subdomains to load 4 tiles simultaneously
// (avoids browser per-host connection limits)
const hosts = ['a', 'b', 'c', 'd'];

function flowTileUrl(zoom, x, y, type = 'relative0') {
  const host = hosts[(x + y) % hosts.length];
  return (
    \`https://\${host}.api.tomtom.com/traffic/map/4/tile/flow/\${type}/\${zoom}/\${x}/\${y}.pbf\` +
    \`?key=YOUR_API_KEY\`
  );
}

// MapLibre GL source definition
map.addSource('traffic-flow', {
  type: 'vector',
  tiles: [
    'https://a.api.tomtom.com/traffic/map/4/tile/flow/relative/{z}/{x}/{y}.pbf?key=YOUR_API_KEY',
  ],
  minzoom: 0,
  maxzoom: 22,
});

map.addLayer({
  id: 'traffic-flow-line',
  type: 'line',
  source: 'traffic-flow',
  'source-layer': 'Traffic flow',
  paint: {
    'line-color': [
      'interpolate', ['linear'], ['get', 'traffic_level'],
      0,   '#FF0000',  // standstill
      0.5, '#FFA500',  // slow
      1.0, '#00CC00',  // free-flow
    ],
    'line-width': 3,
  },
});`;

export default function TrafficVectorFlow({ onNavigate }) {
  return (
    <ApiRefTwoCol
      title="Vector Flow Tiles"
      description="Protocol Buffer (MVT/PBF) vector tiles carrying real-time traffic speed and flow data. Each tile contains road geometries serialised with Google Protocol Buffers and tagged with traffic attributes such as speed level, road type, and closure status. Vector tiles enable client-side styling and are suitable for integration with MapLibre GL or Mapbox GL. Road geometry is encoded in a 4096-unit coordinate space."
      version="v1"
      sections={[
        {
          id: 'vector-flow-request',
          heading: 'Request',
          method: 'GET',
          note: 'https://api.tomtom.com/traffic/map/4/tile/flow/{type}/{zoom}/{x}/{y}.pbf',
          params: [...PATH_PARAMS, ...QUERY_PARAMS],
          code: CODE_FETCH,
          lang: 'javascript',
        },
        {
          id: 'vector-flow-default-tags',
          heading: 'Default protobuf tags',
          note: 'These tags are included in every tile unless filtered out via the tags query parameter. The tile layer name is "Traffic flow".',
          params: DEFAULT_TAGS,
          code: CODE_HOST_CYCLING,
          lang: 'javascript',
        },
        {
          id: 'vector-flow-ondemand-tags',
          heading: 'On-demand protobuf tags',
          note: 'These tags are only included when explicitly requested via the tags query parameter.',
          params: ON_DEMAND_TAGS,
          code: `// Request only specific tags to reduce tile payload size
const url =
  'https://api.tomtom.com/traffic/map/4/tile/flow/relative/12/2044/1360.pbf' +
  '?key=YOUR_API_KEY' +
  '&tags=[road_type,traffic_level]' +   // only these tags
  '&roadTypes=[0,1,2]' +                // motorways + international + major roads only
  '&trafficLevelStep=0.1';              // quantise traffic_level to 0.1 steps

// HTTP status codes:
// 200  OK — binary PBF tile (Content-Type: image/pbf, Content-Encoding: gzip)
// 400  Bad Request — invalid zoom, x, y, or unsupported parameter combination
// 403  Forbidden — invalid API key
// 429  Too Many Requests
// 500  Internal Server Error`,
          lang: 'javascript',
        },
      ]}
    />
  );
}
