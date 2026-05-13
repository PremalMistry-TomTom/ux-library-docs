import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── V2 Orbis Maps — Vector Tile ────────────────────────────────────────────
   Endpoint: GET /maps/orbis/display/vector/tile/{zoom}/{x}/{y}.pbf
   Status:   Public Preview
────────────────────────────────────────────────────────────────────────────── */

const PARAMS_REQUEST = [
  { name: 'zoom', required: true, type: 'integer (path)', desc: 'Zoom level 0–22. Follows the Spherical Mercator (EPSG:3857) tile grid.' },
  { name: 'x', required: true, type: 'integer (path)', desc: 'Tile column index at the given zoom level. Valid range: 0 to 2^zoom − 1.' },
  { name: 'y', required: true, type: 'integer (path)', desc: 'Tile row index at the given zoom level. Valid range: 0 to 2^zoom − 1.' },
  { name: 'apiVersion', required: true, type: 'integer (query)', values: ['2'], desc: 'Orbis Maps API version. Must be 2.' },
  { name: 'key', required: true, type: 'string (query)', desc: 'Your TomTom API key.' },
];

const PARAMS_RESPONSE = [
  { name: 'body', type: 'binary (application/vnd.mapbox-vector-tile)', desc: 'Protocol Buffer (PBF) encoded Mapbox Vector Tile (MVT). Contains named layers styled client-side.' },
  { name: 'Content-Type', type: 'response header', desc: 'application/vnd.mapbox-vector-tile' },
  { name: 'Content-Encoding', type: 'response header', desc: 'gzip — tiles are gzip-compressed. Most HTTP clients decompress automatically.' },
  { name: 'Cache-Control', type: 'response header', desc: 'Tiles are publicly cacheable. Typical max-age is 86400 s (24 hours).' },
  { name: 'ETag', type: 'response header', desc: 'Entity tag for conditional requests. Use If-None-Match to receive 304 Not Modified when tiles have not changed.' },
];

const CODE_REQUEST = `# Vector tile (PBF) — Amsterdam area at zoom 14
curl -H "Accept-Encoding: gzip" \
  "https://api.tomtom.com/maps/orbis/display/vector/tile/14/8376/5452.pbf?apiVersion=2&key=YOUR_API_KEY" \
  --output tile.pbf`;

const CODE_RESPONSE = `HTTP/1.1 200 OK
Content-Type: application/vnd.mapbox-vector-tile
Content-Encoding: gzip
Cache-Control: public, max-age=86400
ETag: "e8f1c2d3a4b5"

<gzip-compressed Protocol Buffer data>`;

/* ─── V2 Content (named export for Unified wrapper) ─────────────────────────── */
export function MapVectorTileV2Content({ onNavigate }) {
  return (
    <ApiRefTwoCol
      description="Retrieve Mapbox Vector Tiles (MVT) in Protocol Buffer format using the Orbis Maps display endpoint. Tiles are gzip-compressed and compatible with MapLibre GL JS, Mapbox GL JS, and custom rendering pipelines."
      sections={[
        {
          id: 'request',
          heading: 'Request',
          method: 'GET',
          note: 'https://api.tomtom.com/maps/orbis/display/vector/tile/{zoom}/{x}/{y}.pbf?apiVersion=2&key={key}',
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
      ]}
    />
  );
}
