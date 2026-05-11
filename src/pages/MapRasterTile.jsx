import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Parameters ─────────────────────────────────────────────────────────────── */
const PARAMS_REQUEST = [
  { name: 'versionNumber', required: true, type: 'integer (path)', values: ['1'], desc: 'Service version number. Currently 1.' },
  { name: 'layer', required: true, type: 'string (path)', values: ['basic', 'hybrid', 'labels'], desc: 'Map layer type. basic = full base map, hybrid = satellite imagery with roads and labels overlaid, labels = labels only.' },
  { name: 'style', required: true, type: 'string (path)', values: ['main', 'night'], desc: 'Colour scheme. main = daytime palette, night = dark palette for low-light environments.' },
  { name: 'zoom', required: true, type: 'integer (path)', desc: 'Zoom level 0–22. At zoom 0 the whole world fits in one tile; each increment doubles the tile count. Follows the Spherical Mercator (EPSG:3857) tile grid.' },
  { name: 'x', required: true, type: 'integer (path)', desc: 'Tile column index at the given zoom level. Valid range: 0 to 2^zoom − 1.' },
  { name: 'y', required: true, type: 'integer (path)', desc: 'Tile row index at the given zoom level. Valid range: 0 to 2^zoom − 1.' },
  { name: 'format', required: true, type: 'string (path)', values: ['png'], desc: 'Response image format. Only PNG is supported for raster map tiles.' },
  { name: 'key', required: true, type: 'string (query)', desc: 'Your TomTom API key. Obtain one at developer.tomtom.com.' },
  { name: 'tileSize', type: 'integer (query)', default: 256, values: ['256', '512'], desc: 'Tile dimension in pixels. 512 px tiles require twice the bandwidth but reduce the number of requests needed.' },
  { name: 'language', type: 'string (query)', default: 'NGT', desc: 'Language for map labels, as an IETF language tag (e.g. en-GB, de, fr). NGT = Neutral Ground Truth — labels use the local official script.' },
  { name: 'view', type: 'string (query)', values: ['Unified', 'AR', 'IN', 'MA', 'PK', 'RU', 'TR', 'CN'], desc: 'Geopolitical view for disputed territories and borders. Unified is the default international view.' },
];

const PARAMS_RESPONSE = [
  { name: 'body', type: 'binary (image/png)', desc: 'PNG tile image. Empty (fully transparent) tiles are returned with HTTP 200, not 404. This means the absence of data is valid.' },
  { name: 'Content-Type', type: 'response header', desc: 'Always image/png for this endpoint.' },
  { name: 'Cache-Control', type: 'response header', desc: 'Tiles are publicly cacheable. Typical max-age is 86400 s (24 hours). Clients and CDNs should respect this to minimise API calls.' },
  { name: 'ETag', type: 'response header', desc: 'Entity tag for conditional requests. Send If-None-Match on subsequent requests; a 304 Not Modified response means the tile is unchanged.' },
  { name: 'Tracking-ID', type: 'response header', desc: 'Unique request identifier. Include this when contacting TomTom support to help diagnose issues.' },
];

/* ─── Code examples ──────────────────────────────────────────────────────────── */
const CODE_REQUEST = `# Basic 256 px raster tile — zoom 12, Amsterdam area
curl "https://api.tomtom.com/map/1/tile/basic/main/12/2094/1362.png?key=YOUR_API_KEY"

# 512 px tile (same location, half the request count for high-DPI displays)
curl "https://api.tomtom.com/map/1/tile/basic/main/12/2094/1362.png?key=YOUR_API_KEY&tileSize=512"

# Hybrid tile (satellite + roads) in night style with German labels
curl "https://api.tomtom.com/map/1/tile/hybrid/night/12/2094/1362.png?key=YOUR_API_KEY&language=de"

# Labels-only tile (transparent background, suitable for overlays)
curl "https://api.tomtom.com/map/1/tile/labels/main/12/2094/1362.png?key=YOUR_API_KEY"`;

const CODE_RESPONSE = `HTTP/1.1 200 OK
Content-Type: image/png
Cache-Control: public, max-age=86400
ETag: "a3f1c2d4e5b6"
Tracking-ID: BdYetm4FME67JGre4ojbUw

<binary PNG data — 256×256 or 512×512 pixels>

# Empty tile (valid, no map data at this location):
HTTP/1.1 200 OK
Content-Type: image/png
Content-Length: 68

<minimal transparent PNG>`;

const CODE_LEAFLET = `import L from 'leaflet';

const API_KEY = 'YOUR_API_KEY';

// Add TomTom raster tiles to a Leaflet map
const tomtomLayer = L.tileLayer(
  \`https://api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.png?key=\${API_KEY}&tileSize=256\`,
  {
    attribution: '© TomTom',
    maxZoom: 22,
    tileSize: 256,
  }
);

const map = L.map('map', {
  center: [52.3676, 4.9041], // Amsterdam
  zoom: 12,
  layers: [tomtomLayer],
});

// Switch to night style
function setNightMode() {
  tomtomLayer.setUrl(
    \`https://api.tomtom.com/map/1/tile/basic/night/{z}/{x}/{y}.png?key=\${API_KEY}\`
  );
}`;

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function MapRasterTile({ onNavigate }) {
  return (
    <ApiRefTwoCol
      title="Raster Map Tile"
      description="Retrieve a 256 or 512 px PNG map tile at any zoom level using the standard XYZ tile scheme. Compatible with Leaflet, OpenLayers, Google Maps API, and any slippy-map library that accepts a tile URL template."
      version="v1"
      sections={[
        {
          id: 'request',
          heading: 'Request',
          method: 'GET',
          note: 'https://api.tomtom.com/map/1/tile/{layer}/{style}/{zoom}/{x}/{y}.png',
          params: PARAMS_REQUEST,
          code: CODE_REQUEST,
          lang: 'bash',
        },
        {
          id: 'response',
          heading: 'Response',
          params: PARAMS_RESPONSE,
          code: CODE_RESPONSE,
          lang: 'bash',
        },
        {
          id: 'leaflet',
          heading: 'Leaflet integration',
          params: [],
          code: CODE_LEAFLET,
          lang: 'javascript',
        },
      ]}
    />
  );
}
