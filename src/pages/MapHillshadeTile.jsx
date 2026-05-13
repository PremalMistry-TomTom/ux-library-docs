import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Parameters ─────────────────────────────────────────────────────────────── */
const PARAMS_REQUEST = [
  { name: 'versionNumber', required: true, type: 'integer (path)', values: ['1'], desc: 'Service version number. Currently 1.' },
  { name: 'layer', required: true, type: 'string (path)', values: ['hill'], desc: 'Layer of the tile to be requested. Only hill is supported for hillshade tiles.' },
  { name: 'type', required: true, type: 'string (path)', values: ['main'], desc: 'Type of the tile to be requested. Only main is supported.' },
  { name: 'zoom', required: true, type: 'integer (path)', desc: 'Zoom level 0–13. Hillshade tiles are only available at zoom levels 0 through 13 (14 zoom levels total). See Zoom Levels and Tile Grid.' },
  { name: 'x', required: true, type: 'integer (path)', desc: 'Tile column index on the zoom grid. Valid range: 0 to 2^zoom − 1.' },
  { name: 'y', required: true, type: 'integer (path)', desc: 'Tile row index on the zoom grid. Valid range: 0 to 2^zoom − 1.' },
  { name: 'format', required: true, type: 'string (path)', values: ['png'], desc: 'Response image format. Only PNG is supported.' },
  { name: 'key', required: true, type: 'string (query)', desc: 'Your TomTom API key. Obtain one at developer.tomtom.com.' },
];

const PARAMS_RESPONSE = [
  { name: 'body', type: 'binary (image/png)', desc: 'PNG hillshade tile image. Each tile is 514×514 pixels, including a 1-pixel buffer taken from neighbouring tiles on all edges.' },
  { name: 'Content-Type', type: 'response header', desc: 'Always image/png for this endpoint.' },
  { name: 'Content-Encoding', type: 'response header', desc: 'gzip — response is gzip-compressed.' },
  { name: 'Cache-Control', type: 'response header', desc: 'Tiles are publicly cacheable. Clients and CDNs should respect the max-age directive to minimise API calls.' },
  { name: 'ETag', type: 'response header', desc: 'Entity tag for conditional requests. Send If-None-Match on subsequent requests; a 304 Not Modified response means the tile is unchanged.' },
  { name: 'Tracking-ID', type: 'response header', desc: 'Unique request identifier. Include this when contacting TomTom support to help diagnose issues.' },
];

/* ─── Elevation decoding ─────────────────────────────────────────────────────── */
const PARAMS_ELEVATION = [
  { name: 'Red', type: 'integer', desc: 'Red channel value of the pixel (0–255). Used in the elevation decode formula.' },
  { name: 'Green', type: 'integer', desc: 'Green channel value of the pixel (0–255). Used in the elevation decode formula.' },
  { name: 'Blue', type: 'integer', desc: 'Blue channel value of the pixel (0–255). Used in the elevation decode formula.' },
  { name: 'height', type: 'float (metres)', desc: 'Decoded elevation in metres above sea level. Formula: height = -10000 + ((R × 256 × 256 + G × 256 + B) × 0.1)' },
];

/* ─── Code examples ──────────────────────────────────────────────────────────── */
const CODE_REQUEST = `# Hillshade tile at zoom 8 (area covering Alps region)
curl "https://api.tomtom.com/map/1/tile/hill/main/8/68/120.png?key=YOUR_API_KEY" \
  --output hillshade_z8.png

# Higher detail at zoom 13
curl "https://api.tomtom.com/map/1/tile/hill/main/13/2196/3879.png?key=YOUR_API_KEY" \
  --output hillshade_z13.png`;

const CODE_RESPONSE = `HTTP/1.1 200 OK
Content-Type: image/png
Content-Encoding: gzip
Cache-Control: public, max-age=86400
ETag: "b2c3d4e5f6a7"
Tracking-ID: XyZw1234AbCd5678

<binary PNG data — 514×514 pixels (includes 1 px border buffer on each edge)>`;

const CODE_ELEVATION = `// Decode elevation from a hillshade tile pixel
// Each pixel encodes elevation as R, G, B channel values

function decodeElevation(r, g, b) {
  return -10000 + ((r * 256 * 256 + g * 256 + b) * 0.1);
}

// Example pixel: rgb(1, 134, 170) → 1 metre above sea level
console.log(decodeElevation(1, 134, 170)); // → 1.0

// Fetch tile and decode pixel at a specific location
async function getElevationAtTile(zoom, x, y, pixelX, pixelY, apiKey) {
  const url = \`https://api.tomtom.com/map/1/tile/hill/main/\${zoom}/\${x}/\${y}.png?key=\${apiKey}\`;
  const response = await fetch(url);
  const blob = await response.blob();

  // Render to canvas to read pixel data
  const img = await createImageBitmap(blob);
  const canvas = new OffscreenCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const { data } = ctx.getImageData(pixelX, pixelY, 1, 1);
  const [r, g, b] = data;
  return decodeElevation(r, g, b);
}`;

const CODE_MAPLIBRE = `import maplibregl from 'maplibre-gl';

const API_KEY = 'YOUR_API_KEY';

const map = new maplibregl.Map({
  container: 'map',
  style: {
    version: 8,
    sources: {
      'hillshade-source': {
        type: 'raster-dem',
        tiles: [
          \`https://api.tomtom.com/map/1/tile/hill/main/{z}/{x}/{y}.png?key=\${API_KEY}\`,
        ],
        tileSize: 514,
        maxzoom: 13,
        encoding: 'terrarium', // matches TomTom's RGB elevation encoding
      },
    },
    layers: [
      {
        id: 'hillshade',
        type: 'hillshade',
        source: 'hillshade-source',
        paint: {
          'hillshade-illumination-direction': 335,
          'hillshade-exaggeration': 0.5,
        },
      },
    ],
  },
  center: [8.2275, 46.8182], // Switzerland
  zoom: 8,
});`;

/* ─── V1 Content (named export for Unified wrapper) ─────────────────────────── */
export function MapHillshadeTileV1Content({ onNavigate }) {
  return (
    <ApiRefTwoCol
      description="Retrieve 514×514 px PNG hillshade tiles that encode terrain elevation data. Each pixel encodes an elevation value in its R, G, B channels using a compact formula, enabling client-side shaded-relief rendering with MapLibre GL JS or any raster-DEM renderer."
      sections={[
        {
          id: 'request',
          heading: 'Request',
          method: 'GET',
          note: 'https://api.tomtom.com/map/1/tile/hill/main/{zoom}/{x}/{y}.png',
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
          id: 'elevation',
          heading: 'Elevation encoding',
          params: PARAMS_ELEVATION,
          code: CODE_ELEVATION,
          lang: 'javascript',
        },
        {
          id: 'maplibre',
          heading: 'MapLibre GL JS integration',
          params: [],
          code: CODE_MAPLIBRE,
          lang: 'javascript',
        },
      ]}
    />
  );
}
