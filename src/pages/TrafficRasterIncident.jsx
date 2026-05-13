import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

const PATH_PARAMS = [
  {
    name: 'style',
    required: true,
    type: 'string',
    values: ['s0', 's0-dark', 's1', 's2', 's3'],
    desc: 'Visual style for incident rendering. s0 and s0-dark: traffic lines without POI icons (recommended for general use; s0-dark suits dark basemaps). s1: traffic lines with coloured chevrons to indicate direction. s2 and s3: plain coloured lines without chevrons, minimal visual weight. Magnitude 0 = Unknown, 1 = Minor, 2 = Moderate, 3 = Major, 4 = Undefined (road closures, indefinite delays).',
  },
  {
    name: 'zoom',
    required: true,
    type: 'integer',
    desc: 'Zoom level of the tile to be rendered. Value: 0–22.',
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
    name: 'tileSize',
    type: 'integer',
    default: 256,
    values: [256, 512],
    desc: 'Tile pixel dimensions. Use 512 for high-DPI (Retina) displays. Default: 256.',
  },
  {
    name: 't',
    type: 'string',
    desc: 'Traffic Model ID for cache validation. The CDN returns HTTP 304 Not Modified if the incident data has not changed since the specified model was published. Use -1 (the default) to always fetch the latest data. See the Traffic Model ID endpoint.',
  },
];

const RESPONSE_PARAMS = [
  {
    name: '(binary image)',
    type: 'PNG',
    desc: 'A 256×256 or 512×512 raster PNG tile with incident overlays on a transparent background. Incidents are rendered as coloured lines and (for most styles) POI icons positioned at the incident location. Magnitude severity is encoded by colour: yellow for Minor, orange for Moderate, red for Major, dark-red/grey for Undefined closures.',
  },
  {
    name: 'Content-Type',
    type: 'header',
    desc: 'image/png on success; application/json or text/xml on error.',
  },
  {
    name: 'Cache-Control',
    type: 'header',
    desc: 'Tiles may be cached based on the Traffic Model ID. When the t parameter is provided and data is unchanged, the server returns HTTP 304.',
  },
];

const CODE_BASIC = `// Fetch a raster incident tile (s0 style, zoom 12)
const zoom = 12;
const x = 2044;
const y = 1360;
const style = 's0'; // s0 | s0-dark | s1 | s2 | s3
const apiKey = 'YOUR_API_KEY';

const url =
  \`https://api.tomtom.com/traffic/map/4/tile/incidents/\${style}/\${zoom}/\${x}/\${y}.png\` +
  \`?key=\${apiKey}&tileSize=256\`;

const response = await fetch(url);
// response.status === 200: binary PNG tile
// response.status === 304: no change since last Traffic Model ID
const blob = await response.blob();
const imgUrl = URL.createObjectURL(blob);`;

const CODE_LEAFLET = `// Overlay TomTom incident tiles on a Leaflet map
import L from 'leaflet';

const map = L.map('map').setView([52.3731, 4.8922], 12);

// Base map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
}).addTo(map);

// Traffic flow layer (below incidents)
L.tileLayer(
  'https://api.tomtom.com/traffic/map/4/tile/flow/relative0/{z}/{x}/{y}.png' +
    '?key=YOUR_API_KEY',
  { opacity: 0.8, attribution: '© TomTom' }
).addTo(map);

// Incident overlay — s0 style (recommended for light basemaps)
L.tileLayer(
  'https://api.tomtom.com/traffic/map/4/tile/incidents/s0/{z}/{x}/{y}.png' +
    '?key=YOUR_API_KEY&tileSize=256',
  { attribution: '© TomTom' }
).addTo(map);`;

const CODE_ERROR = `// Error response (JSON) — use Accept: application/json header to get JSON
{
  "detailedError": {
    "code": "INVALID_REQUEST",
    "message": "z out of range 0 <= z <= 22"
  }
}

// HTTP status codes:
// 200  OK — binary PNG tile
// 304  Not Modified — data unchanged since given Traffic Model ID (t param)
// 400  Bad Request — unknown style, out-of-range zoom/x/y, unknown format
// 403  Forbidden — invalid API key
// 429  Too Many Requests
// 500  Internal Server Error
// 503  Service Unavailable
// 596  Service Not Found — unknown service version`;

export default function TrafficRasterIncident({ onNavigate }) {
  return (
    <ApiRefTwoCol
      title="Raster Incident Tiles"
      description="PNG tiles showing traffic incident icons and severity overlays, designed for layering on raster basemaps. Incidents are colour-coded by magnitude of delay: yellow (Minor), orange (Moderate), red (Major), and dark-red or grey for road closures and indefinite delays. Five visual styles are available, including dark variants and chevron styles. Tiles are transparent PNG images that compose cleanly with flow and basemap layers."
      version="v1"
      sections={[
        {
          id: 'raster-incident-request',
          heading: 'Request',
          method: 'GET',
          note: 'https://api.tomtom.com/traffic/map/4/tile/incidents/{style}/{zoom}/{x}/{y}.png',
          params: [...PATH_PARAMS, ...QUERY_PARAMS],
          code: CODE_BASIC,
          lang: 'javascript',
        },
        {
          id: 'raster-incident-response',
          heading: 'Response',
          params: RESPONSE_PARAMS,
          code: CODE_LEAFLET,
          lang: 'javascript',
        },
        {
          id: 'raster-incident-errors',
          heading: 'Error codes',
          params: [],
          note: 'Errors are returned in XML by default. Set the Accept: application/json request header to receive errors as JSON.',
          code: CODE_ERROR,
          lang: 'javascript',
        },
      ]}
    />
  );
}
