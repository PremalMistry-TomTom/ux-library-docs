import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Parameters ─────────────────────────────────────────────────────────────── */
const PARAMS_REQUEST = [
  { name: 'versionNumber', required: true, type: 'integer (path)', values: ['1'], desc: 'Service version number. Currently 1.' },
  { name: 'layer', required: true, type: 'string (path)', values: ['sat'], desc: 'Must be sat for satellite/aerial imagery tiles.' },
  { name: 'style', required: true, type: 'string (path)', values: ['main'], desc: 'Tile style. Only main is available for satellite tiles.' },
  { name: 'zoom', required: true, type: 'integer (path)', desc: 'Zoom level 0–19. Satellite imagery is only available up to zoom 19 — requests for zoom 20–22 return HTTP 400. Follows the Spherical Mercator (EPSG:3857) tile grid.' },
  { name: 'x', required: true, type: 'integer (path)', desc: 'Tile column index at the given zoom level. Valid range: 0 to 2^zoom − 1.' },
  { name: 'y', required: true, type: 'integer (path)', desc: 'Tile row index at the given zoom level. Valid range: 0 to 2^zoom − 1.' },
  { name: 'format', required: true, type: 'string (path)', values: ['jpg'], desc: 'Response image format. Only JPEG is supported for satellite tiles; PNG is not available.' },
  { name: 'key', required: true, type: 'string (query)', desc: 'Your TomTom API key. Obtain one at developer.tomtom.com.' },
];

const PARAMS_RESPONSE = [
  { name: 'body', type: 'binary (image/jpeg)', desc: 'JPEG tile image, 256 × 256 pixels. JPEG compression provides smaller file sizes than PNG, suitable for photographic aerial imagery.' },
  { name: 'Content-Type', type: 'response header', desc: 'image/jpeg' },
  { name: 'Cache-Control', type: 'response header', desc: 'Satellite tiles are publicly cacheable. Typical max-age is 86400 s (24 hours).' },
  { name: 'ETag', type: 'response header', desc: 'Entity tag for conditional GET requests. Use If-None-Match on subsequent requests to receive 304 Not Modified when imagery has not changed.' },
  { name: 'Tracking-ID', type: 'response header', desc: 'Unique request identifier. Include this when contacting TomTom support.' },
];

/* ─── Code examples ──────────────────────────────────────────────────────────── */
const CODE_REQUEST = `# Satellite tile for Amsterdam area at zoom 17
curl "https://api.tomtom.com/map/1/tile/sat/main/17/67296/43062.jpg?key=YOUR_API_KEY" \
  --output amsterdam_sat.jpg

# Zoom 12 overview tile
curl "https://api.tomtom.com/map/1/tile/sat/main/12/2094/1362.jpg?key=YOUR_API_KEY" \
  --output amsterdam_overview.jpg

# Maximum available zoom (19) for high-detail imagery
curl "https://api.tomtom.com/map/1/tile/sat/main/19/269183/172248.jpg?key=YOUR_API_KEY" \
  --output amsterdam_detail.jpg

# Note: zoom levels 20–22 are NOT available for satellite tiles
# GET /map/1/tile/sat/main/20/... → HTTP 400 Bad Request`;

const CODE_RESPONSE = `HTTP/1.1 200 OK
Content-Type: image/jpeg
Cache-Control: public, max-age=86400
ETag: "f9a2c4b1e3d8"
Tracking-ID: CeZftm5GLF78KHsf5pkCVx

<binary JPEG data — 256×256 pixels>

# Error: zoom level out of range for satellite
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "detailedError": {
    "code": "BAD_REQUEST",
    "message": "Zoom level 20 is not available for satellite layer. Maximum zoom is 19."
  }
}`;

const CODE_HYBRID = `import L from 'leaflet';

const API_KEY = 'YOUR_API_KEY';

// ── Satellite base layer ──
const satelliteLayer = L.tileLayer(
  \`https://api.tomtom.com/map/1/tile/sat/main/{z}/{x}/{y}.jpg?key=\${API_KEY}\`,
  {
    attribution: '© TomTom, © Airbus DS',
    maxZoom: 19, // satellite tiles only go to zoom 19
    tileSize: 256,
  }
);

// ── Labels overlay (transparent PNG on top of satellite) ──
const labelsLayer = L.tileLayer(
  \`https://api.tomtom.com/map/1/tile/labels/main/{z}/{x}/{y}.png?key=\${API_KEY}\`,
  {
    attribution: '',
    maxZoom: 22,
    opacity: 1,
  }
);

// ── Hybrid: satellite + labels ──
const map = L.map('map', {
  center: [52.3676, 4.9041],
  zoom: 14,
  layers: [satelliteLayer, labelsLayer],
});`;

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function MapSatelliteTile({ onNavigate }) {
  return (
    <ApiRefTwoCol
      title="Satellite Tile"
      description="Retrieve aerial and satellite imagery tiles in JPEG format at 256 × 256 pixels. Satellite tiles are available from zoom 0 to a maximum of zoom 19. Combine with a labels-only raster layer for a hybrid satellite view."
      version="v1"
      sections={[
        {
          id: 'request',
          heading: 'Request',
          method: 'GET',
          demoId: 'satellite-tile',
          note: 'https://api.tomtom.com/map/1/tile/sat/main/{zoom}/{x}/{y}.jpg',
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
          id: 'hybrid',
          heading: 'Hybrid satellite + labels (Leaflet)',
          params: [],
          code: CODE_HYBRID,
          lang: 'javascript',
        },
      ]}
    />
  );
}
