import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

const PATH_PARAMS = [
  {
    name: 'zoom',
    required: true,
    type: 'integer',
    desc: 'Zoom level of the tile to be rendered. Value: 0–22. At zoom 0 the world fits a single tile; at zoom 22 there are 2^44 tiles.',
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
    name: 't',
    type: 'string',
    default: '-1',
    desc: 'Traffic Model ID. Use -1 to always fetch the most recent data. When provided, the CDN returns HTTP 304 Not Modified if the incident data has not changed since the specified model. See the Traffic Model ID endpoint.',
  },
  {
    name: 'tags',
    type: 'array',
    desc: 'Controls which protobuf tags are attached to tile features. Default tags (always included unless filtered out): icon_category, icon_category_[idx], description, description_[idx], delay, road_type, left_hand_traffic, magnitude, traffic_road_coverage, clustered. On-demand tags (only if listed): end_date, id, probability_of_occurrence, number_of_reports, last_report_time, road_category, road_subcategory. An empty array returns geometry only.',
  },
];

const FLOW_TAGS = [
  {
    name: 'icon_category_[idx]',
    type: 'integer',
    desc: 'Icon category of an individual incident at index idx (ascending priority order starting from 0). Values: 0 Unknown, 1 Accident, 2 Fog, 3 Dangerous Conditions, 4 Rain, 5 Ice, 6 Jam, 7 Lane Closed, 8 Road Closed, 9 Road Works, 10 Wind, 11 Flooding, 14 Broken Down Vehicle.',
  },
  {
    name: 'icon_category',
    type: 'integer',
    desc: 'Icon category for a cluster of incidents. If all incidents in the cluster share the same type, returns that type. Otherwise returns 13 (Cluster). Same allowed values as icon_category_[idx], plus 13 Cluster.',
  },
  {
    name: 'description_[idx]',
    type: 'string',
    desc: 'Human-readable description of the individual incident at index idx.',
  },
  {
    name: 'description',
    type: 'string',
    desc: 'Human-readable description of the cluster of incidents.',
  },
  {
    name: 'delay',
    type: 'integer',
    desc: 'Delay caused by the incident in seconds, calculated against free-flow travel time. Not applicable to road closures.',
  },
  {
    name: 'road_type',
    type: 'string',
    desc: 'Road classification. Values: Motorway, International road, Major road, Secondary road, Connecting road, Major local road, Local road, Minor local road, Non public road, Parking road.',
  },
  {
    name: 'left_hand_traffic',
    type: 'boolean',
    desc: 'Present (value: true) when the road uses left-hand traffic rules. Absent on right-hand traffic roads.',
  },
  {
    name: 'magnitude',
    type: 'integer',
    values: ['0 Unknown', '1 Minor', '2 Moderate', '3 Major', '4 Indefinite (road closures)'],
    desc: 'Severity of delay associated with the incident. 0 Unknown, 1 Minor, 2 Moderate, 3 Major, 4 Indefinite (used for road closures and other delays with an unstated end time).',
  },
  {
    name: 'traffic_road_coverage',
    type: 'string',
    values: ['one_side', 'full'],
    desc: 'Whether traffic data covers one side of the road (two-way road) or the full road (one-way road).',
  },
  {
    name: 'clustered',
    type: 'integer',
    desc: 'Present when the incident belongs to a cluster. The tag value equals the ID of the parent cluster.',
  },
];

const ON_DEMAND_TAGS = [
  {
    name: 'end_date',
    type: 'string',
    desc: 'Estimated end date of the incident in ISO 8601 format, when available.',
  },
  {
    name: 'id',
    type: 'string',
    desc: 'Incident ID, shared across Traffic Incident API services where available.',
  },
  {
    name: 'probability_of_occurrence',
    type: 'string',
    values: ['certain', 'probable', 'risk_of', 'improbable'],
    desc: 'Community Attribute (ACI). Likelihood that the incident is currently occurring.',
  },
  {
    name: 'number_of_reports',
    type: 'long integer',
    desc: 'Community Attribute (ACI). Number of reports submitted by end-users for this incident.',
  },
  {
    name: 'last_report_time',
    type: 'string',
    desc: 'Community Attribute (ACI). Date and time of the most recent user report, in ISO 8601 format.',
  },
  {
    name: 'road_category',
    type: 'string',
    values: ['motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'street'],
    desc: 'Detailed road category.',
  },
  {
    name: 'road_subcategory',
    type: 'string',
    desc: 'Road subcategory. For tertiary: connecting, major_local. For street: local, minor_local.',
  },
];

const CODE_FETCH = `// Fetch a vector incident tile and decode with Mapbox's vector-tile library
import Protobuf from 'pbf';
import { VectorTile } from '@mapbox/vector-tile';

const zoom = 14;
const x = 8186;
const y = 5450;
const apiKey = 'YOUR_API_KEY';

const url =
  \`https://api.tomtom.com/traffic/map/4/tile/incidents/\${zoom}/\${x}/\${y}.pbf\` +
  \`?key=\${apiKey}&tags=[icon_category,delay,magnitude,description]\`;

const response = await fetch(url);
const buffer = await response.arrayBuffer();
const tile = new VectorTile(new Protobuf(buffer));

// Two layers: 'Traffic incidents flow' and 'Traffic incidents POI'
const flowLayer = tile.layers['Traffic incidents flow'];
const poiLayer  = tile.layers['Traffic incidents POI'];

for (let i = 0; i < poiLayer.length; i++) {
  const feature = poiLayer.feature(i);
  const { icon_category, delay, magnitude, description } = feature.properties;
  console.log({ icon_category, delay, magnitude, description });
}`;

const CODE_MAPLIBRE = `// MapLibre GL — add vector incident tiles as a source and style layer
map.addSource('traffic-incidents', {
  type: 'vector',
  tiles: [
    'https://api.tomtom.com/traffic/map/4/tile/incidents/{z}/{x}/{y}.pbf' +
      '?key=YOUR_API_KEY&tags=[icon_category,magnitude,delay]',
  ],
  minzoom: 0,
  maxzoom: 22,
});

// Style incident lines by magnitude severity
map.addLayer({
  id: 'incident-lines',
  type: 'line',
  source: 'traffic-incidents',
  'source-layer': 'Traffic incidents flow',
  paint: {
    'line-color': [
      'match', ['get', 'magnitude'],
      1, '#FFCE43',   // Minor — yellow
      2, '#FF8939',   // Moderate — orange
      3, '#F40000',   // Major — red
      4, '#C1272D',   // Indefinite/closure — dark red
      '#777777',      // Unknown
    ],
    'line-width': 4,
  },
});

// HTTP status codes:
// 200  OK — binary PBF tile (Content-Encoding: gzip)
// 304  Not Modified — data unchanged since given t (Traffic Model ID)
// 400  Bad Request — invalid zoom, x, or y
// 403  Forbidden — invalid API key
// 429  Too Many Requests
// 500  Internal Server Error`;

export default function TrafficVectorIncident({ onNavigate }) {
  return (
    <ApiRefTwoCol
      title="Vector Incident Tiles"
      description="Protocol Buffer (MVT/PBF) vector tiles containing traffic incident geometry and attributes. Two layers are provided per tile: 'Traffic incidents flow' (line geometries along affected road segments) and 'Traffic incidents POI' (point geometries at incident locations). Tags include incident category, delay in seconds, magnitude of congestion, and descriptions. Suitable for client-side rendering in MapLibre GL or Mapbox GL with custom styling."
      version="v1"
      sections={[
        {
          id: 'vector-incident-request',
          heading: 'Request',
          method: 'GET',
          note: 'https://api.tomtom.com/traffic/map/4/tile/incidents/{zoom}/{x}/{y}.pbf — Note: unlike raster incident tiles, the vector endpoint does not include a style path segment.',
          params: [...PATH_PARAMS, ...QUERY_PARAMS],
          code: CODE_FETCH,
          lang: 'javascript',
        },
        {
          id: 'vector-incident-flow-tags',
          heading: 'Default protobuf tags',
          note: 'Tags are shared between the "Traffic incidents flow" (lines) and "Traffic incidents POI" (points) layers. All default tags are included unless filtered via the tags query parameter.',
          params: FLOW_TAGS,
          code: CODE_MAPLIBRE,
          lang: 'javascript',
        },
        {
          id: 'vector-incident-ondemand-tags',
          heading: 'On-demand protobuf tags',
          note: 'These tags are only included in the tile when explicitly listed in the tags query parameter. Use them to enrich the data at the cost of a slightly larger tile payload.',
          params: ON_DEMAND_TAGS,
          code: `// Request on-demand community attributes for crowdsourced incident data
const url =
  'https://api.tomtom.com/traffic/map/4/tile/incidents/14/8186/5450.pbf' +
  '?key=YOUR_API_KEY' +
  '&tags=[icon_category,magnitude,delay,probability_of_occurrence,number_of_reports,last_report_time]';

// Response tile will include community attribute tags on eligible features.
// Road geometry is stored in 0–4095 coordinate range (top-left = 0,0).`,
          lang: 'javascript',
        },
      ]}
    />
  );
}
