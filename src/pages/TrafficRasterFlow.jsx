import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

const PATH_PARAMS = [
  {
    name: 'style',
    required: true,
    type: 'string',
    values: ['absolute', 'relative', 'relative0', 'relative0-dark', 'relative-delay', 'reduced-sensitivity'],
    desc: 'Colour scheme applied to the rendered tile. absolute colours roads by absolute speed in km/h (grey → red → yellow → green). relative and relative0 colour roads relative to free-flow speed, highlighting congestion. relative0 and relative0-dark are the recommended styles. relative-delay only highlights roads that differ from free-flow. reduced-sensitivity uses relative speeds but requires a larger difference before changing colour.',
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
    name: 'thickness',
    type: 'integer',
    default: 10,
    desc: 'Segment width multiplier (1–20). Controls the visual thickness of traffic overlay lines. Only available with styles: absolute, relative, relative-delay, reduced-sensitivity. Default: 10.',
  },
];

const RESPONSE_PARAMS = [
  {
    name: '(binary image)',
    type: 'PNG',
    desc: 'A 256×256 or 512×512 raster PNG tile with colour-coded traffic flow roads on a transparent background. Ready for use as an overlay layer on any raster map. Roads are colour-coded according to the chosen style — e.g., red for stationary traffic, green for free-flow.',
  },
  {
    name: 'Content-Type',
    type: 'header',
    desc: 'image/png on success; application/json or text/xml on error.',
  },
  {
    name: 'Cache-Control',
    type: 'header',
    desc: 'private, no-cache, no-store, max-age=0, must-revalidate — tiles reflect real-time traffic and must not be cached.',
  },
];

const CODE_BASIC = `// Fetch a raster flow tile (relative0 style, zoom 12)
const zoom = 12;
const x = 2044;
const y = 1360;
const style = 'relative0';
const apiKey = 'YOUR_API_KEY';

const url =
  \`https://api.tomtom.com/traffic/map/4/tile/flow/\${style}/\${zoom}/\${x}/\${y}.png\` +
  \`?key=\${apiKey}&tileSize=256\`;

const response = await fetch(url);
const blob = await response.blob();
const imgUrl = URL.createObjectURL(blob);

// Assign to an <img> element or use as a tile layer URL template`;

const CODE_LEAFLET = `// Add a TomTom raster flow tile layer to a Leaflet map
import L from 'leaflet';

const map = L.map('map').setView([52.3731, 4.8922], 12);

// Base map layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
}).addTo(map);

// Traffic flow overlay — relative0 style (recommended)
L.tileLayer(
  'https://api.tomtom.com/traffic/map/4/tile/flow/relative0/{z}/{x}/{y}.png' +
    '?key=YOUR_API_KEY&tileSize=256',
  { opacity: 0.85, attribution: '© TomTom' }
).addTo(map);`;

const CODE_ERROR = `// Error response (JSON) — returned when a parameter is invalid
{
  "detailedError": {
    "code": "INVALID_REQUEST",
    "message": "z out of range 0 <= z <= 22"
  }
}

// HTTP status codes:
// 200  OK — binary PNG tile
// 400  Bad Request — unknown style, out-of-range zoom/x/y, invalid thickness,
//                    invalid style + thickness combination
// 403  Forbidden — invalid API key
// 429  Too Many Requests
// 500  Internal Server Error
// 503  Service Unavailable
// 596  Service Not Found — unknown service version`;

export default function TrafficRasterFlow({ onNavigate }) {
  return (
    <ApiRefTwoCol
      title="Raster Flow Tiles"
      description="PNG map tiles colour-coded by real-time traffic speed, designed for overlay on raster maps. Each 256×256 (or 512×512) tile is transparent, so it can be layered on top of any base map. Choose from six colour styles ranging from absolute speed (km/h) to relative-to-free-flow comparisons. Tiles are served fresh on every request and must not be cached."
      version="v1"
      sections={[
        {
          id: 'raster-flow-request',
          heading: 'Request',
          method: 'GET',
          note: 'https://api.tomtom.com/traffic/map/4/tile/flow/{style}/{zoom}/{x}/{y}.png',
          params: [...PATH_PARAMS, ...QUERY_PARAMS],
          code: CODE_BASIC,
          lang: 'javascript',
        },
        {
          id: 'raster-flow-response',
          heading: 'Response',
          params: RESPONSE_PARAMS,
          code: CODE_LEAFLET,
          lang: 'javascript',
        },
        {
          id: 'raster-flow-errors',
          heading: 'Error codes',
          params: [],
          note: 'Errors are returned in XML by default, or JSON if the Accept: application/json request header is set.',
          code: CODE_ERROR,
          lang: 'javascript',
        },
      ]}
    />
  );
}
