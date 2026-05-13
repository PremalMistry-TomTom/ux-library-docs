import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';
import PrivatePreviewBanner from '../components/ui/PrivatePreviewBanner';

/* ─── V3 Orbis Maps — Satellite Tile ─────────────────────────────────────────
   Endpoint: GET /maps/orbis/display/satellite/tile/{zoom}/{x}/{y}
   Status:   Private Preview
────────────────────────────────────────────────────────────────────────────── */

const PARAMS_REQUEST = [
  { name: 'zoom', required: true, type: 'integer (path)', desc: 'Zoom level 0–19. Satellite imagery is only available up to zoom 19. Follows the Spherical Mercator (EPSG:3857) tile grid.' },
  { name: 'x', required: true, type: 'integer (path)', desc: 'Tile column index at the given zoom level. Valid range: 0 to 2^zoom − 1.' },
  { name: 'y', required: true, type: 'integer (path)', desc: 'Tile row index at the given zoom level. Valid range: 0 to 2^zoom − 1.' },
  { name: 'apiVersion', required: true, type: 'integer (query)', values: ['2'], desc: 'Orbis Maps API version. Must be 2.' },
  { name: 'key', required: true, type: 'string (query)', desc: 'Your TomTom API key.' },
];

const PARAMS_RESPONSE = [
  { name: 'body', type: 'binary (image/jpeg)', desc: 'JPEG satellite tile image, 256 × 256 pixels.' },
  { name: 'Content-Type', type: 'response header', desc: 'image/jpeg' },
  { name: 'Cache-Control', type: 'response header', desc: 'Satellite tiles are publicly cacheable. Typical max-age is 86400 s (24 hours).' },
  { name: 'ETag', type: 'response header', desc: 'Entity tag for conditional GET requests. Use If-None-Match to receive 304 Not Modified when imagery has not changed.' },
];

const CODE_REQUEST = `# Satellite tile — Amsterdam area at zoom 17 (Orbis v3)
curl "https://api.tomtom.com/maps/orbis/display/satellite/tile/17/67296/43062?apiVersion=2&key=YOUR_API_KEY" \
  --output amsterdam_sat.jpg`;

const CODE_RESPONSE = `HTTP/1.1 200 OK
Content-Type: image/jpeg
Cache-Control: public, max-age=86400
ETag: "c4d5e6f7b8a9"

<binary JPEG data — 256×256 pixels>`;

/* ─── V3 Content (named export for Unified wrapper) ─────────────────────────── */
export function MapSatelliteTileV3Content({ onNavigate }) {
  return (
    <>
      <PrivatePreviewBanner api="Map Display API v3 (Orbis Maps)" />
      <ApiRefTwoCol
        description="Retrieve aerial and satellite imagery tiles via the Orbis Maps display endpoint. Available from zoom 0 to zoom 19. Returns JPEG tiles at 256 × 256 pixels."
        sections={[
          {
            id: 'request',
            heading: 'Request',
            method: 'GET',
            note: 'https://api.tomtom.com/maps/orbis/display/satellite/tile/{zoom}/{x}/{y}?apiVersion=2&key={key}',
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
    </>
  );
}
