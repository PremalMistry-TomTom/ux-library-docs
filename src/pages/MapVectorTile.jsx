import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Parameters ─────────────────────────────────────────────────────────────── */
const PARAMS_REQUEST = [
  { name: 'versionNumber', required: true, type: 'integer (path)', values: ['1', '2'], desc: 'Service version. v1 is stable production; v2 delivers the same tiles with an updated style schema.' },
  { name: 'zoom', required: true, type: 'integer (path)', desc: 'Zoom level 0–22. Follows the Spherical Mercator (EPSG:3857) tile grid — same as raster tiles, so both can share the same tile coordinate.' },
  { name: 'x', required: true, type: 'integer (path)', desc: 'Tile column index at the given zoom level. Valid range: 0 to 2^zoom − 1.' },
  { name: 'y', required: true, type: 'integer (path)', desc: 'Tile row index at the given zoom level. Valid range: 0 to 2^zoom − 1.' },
  { name: 'key', required: true, type: 'string (query)', desc: 'Your TomTom API key. Obtain one at developer.tomtom.com.' },
  { name: 'view', type: 'string (query)', values: ['Unified', 'AR', 'IN', 'MA', 'PK', 'RU', 'TR', 'CN'], desc: 'Geopolitical view for disputed territories and borders. Unified is the default international view. Must match the view used when fetching map style JSON.' },
  { name: 'language', type: 'string (query)', default: 'NGT', desc: 'Language for label features embedded in the tile, as an IETF tag (e.g. en-GB, de). NGT = Neutral Ground Truth — labels use the local official script.' },
];

const PARAMS_RESPONSE = [
  { name: 'body', type: 'binary (application/vnd.mapbox-vector-tile)', desc: 'Protocol Buffer (PBF) encoded Mapbox Vector Tile (MVT). Contains multiple named layers (e.g. roads, buildings, water) that the rendering client styles client-side.' },
  { name: 'Content-Type', type: 'response header', desc: 'application/vnd.mapbox-vector-tile' },
  { name: 'Content-Encoding', type: 'response header', desc: 'gzip — tiles are gzip-compressed. Most HTTP clients decompress automatically; set Accept-Encoding: gzip to ensure compression is applied.' },
  { name: 'Cache-Control', type: 'response header', desc: 'Tiles are publicly cacheable. Typical max-age is 86400 s (24 hours).' },
  { name: 'ETag', type: 'response header', desc: 'Entity tag for conditional requests. Use If-None-Match to receive 304 Not Modified when tiles have not changed.' },
];

/* ─── Code examples ──────────────────────────────────────────────────────────── */
const CODE_REQUEST = `# Fetch a vector tile (PBF) for Amsterdam at zoom 14
curl -H "Accept-Encoding: gzip" \
  "https://api.tomtom.com/map/1/tile/basic/main/14/8376/5452.pbf?key=YOUR_API_KEY" \
  --output tile.pbf

# Inspect tile layers with tippecanoe / tile-join tooling
tile-decode tile.pbf

# v2 endpoint (updated style schema)
curl -H "Accept-Encoding: gzip" \
  "https://api.tomtom.com/map/2/tile/basic/main/14/8376/5452.pbf?key=YOUR_API_KEY" \
  --output tile_v2.pbf`;

const CODE_RESPONSE = `HTTP/1.1 200 OK
Content-Type: application/vnd.mapbox-vector-tile
Content-Encoding: gzip
Cache-Control: public, max-age=86400
ETag: "d7e3b1a2f4c9"

<gzip-compressed Protocol Buffer data>

# Decoded tile contains named layers, e.g.:
# - Basic_Land       (land polygons)
# - Basic_Waterarea  (water bodies)
# - Basic_Roads      (road network with attributes)
# - Basic_POI        (points of interest)
# - Basic_Address    (address labels)`;

const CODE_MAPLIBRE = `import maplibregl from 'maplibre-gl';

const API_KEY = 'YOUR_API_KEY';

const map = new maplibregl.Map({
  container: 'map',
  // Use TomTom's hosted style JSON — references tiles and glyphs automatically
  style: \`https://api.tomtom.com/maps-sdk-for-web/6.x/6.25.0/maps/sdk.min.css\`,
  center: [4.9041, 52.3676], // Amsterdam [lng, lat]
  zoom: 12,
});

// ── Manual tile source (if you want to bring your own style) ──
map.on('load', () => {
  map.addSource('tomtom-vector', {
    type: 'vector',
    tiles: [
      \`https://api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.pbf?key=\${API_KEY}\`,
    ],
    minzoom: 0,
    maxzoom: 22,
    attribution: '© TomTom',
  });

  // Render roads layer
  map.addLayer({
    id: 'roads',
    type: 'line',
    source: 'tomtom-vector',
    'source-layer': 'Basic_Roads',
    paint: {
      'line-color': '#e2001a',
      'line-width': ['interpolate', ['linear'], ['zoom'], 8, 1, 14, 4],
    },
  });
});`;

/* ─── V1 Content (named export for Unified wrapper) ─────────────────────────── */
export function MapVectorTileV1Content({ onNavigate }) {
  return (
    <ApiRefTwoCol
      description="Retrieve Mapbox Vector Tiles (MVT) in Protocol Buffer format for client-side styled, resolution-independent rendering. Vector tiles give full control over style, language, and feature selection — ideal for MapLibre GL JS, Mapbox GL JS, and custom rendering pipelines."
      sections={[
        {
          id: 'request',
          heading: 'Request',
          method: 'GET',
          demoId: 'vector-tile',
          note: 'https://api.tomtom.com/map/1/tile/basic/main/{zoom}/{x}/{y}.pbf',
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
