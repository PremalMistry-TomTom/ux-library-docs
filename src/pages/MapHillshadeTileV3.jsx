import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';
import PrivatePreviewBanner from '../components/ui/PrivatePreviewBanner';

/* ─── V3 Orbis Maps — Hillshade Tile ─────────────────────────────────────────
   Endpoint: GET /maps/orbis/display/hillshade/tile/{zoom}/{x}/{y}
   Status:   Private Preview
────────────────────────────────────────────────────────────────────────────── */

const PARAMS_REQUEST = [
  { name: 'zoom', required: true, type: 'integer (path)', desc: 'Zoom level 0–13. Hillshade tiles are only available at zoom levels 0–13.' },
  { name: 'x', required: true, type: 'integer (path)', desc: 'Tile column index at the given zoom level. Valid range: 0 to 2^zoom − 1.' },
  { name: 'y', required: true, type: 'integer (path)', desc: 'Tile row index at the given zoom level. Valid range: 0 to 2^zoom − 1.' },
  { name: 'apiVersion', required: true, type: 'integer (query)', values: ['2'], desc: 'Orbis Maps API version. Must be 2.' },
  { name: 'key', required: true, type: 'string (query)', desc: 'Your TomTom API key.' },
  { name: 'type', type: 'string (query)', values: ['main', 'hillshade', 'slope'], desc: 'Hillshade tile variant. main = combined shaded relief, hillshade = raw hillshade, slope = slope analysis.' },
];

const PARAMS_RESPONSE = [
  { name: 'body', type: 'binary (image/png)', desc: 'PNG hillshade tile. Each tile is 514×514 pixels, including a 1-pixel buffer on all edges.' },
  { name: 'Content-Type', type: 'response header', desc: 'image/png' },
  { name: 'Content-Encoding', type: 'response header', desc: 'gzip — response is gzip-compressed.' },
  { name: 'Cache-Control', type: 'response header', desc: 'Tiles are publicly cacheable. Clients and CDNs should respect the max-age directive.' },
  { name: 'ETag', type: 'response header', desc: 'Entity tag for conditional requests. Send If-None-Match on subsequent requests; a 304 Not Modified means the tile is unchanged.' },
];

const CODE_REQUEST = `# Hillshade tile — Alps region at zoom 8 (Orbis v3, main type)
curl "https://api.tomtom.com/maps/orbis/display/hillshade/tile/8/68/120?apiVersion=2&key=YOUR_API_KEY&type=main" \
  --output hillshade_z8.png

# Slope analysis variant
curl "https://api.tomtom.com/maps/orbis/display/hillshade/tile/8/68/120?apiVersion=2&key=YOUR_API_KEY&type=slope" \
  --output slope_z8.png`;

const CODE_RESPONSE = `HTTP/1.1 200 OK
Content-Type: image/png
Content-Encoding: gzip
Cache-Control: public, max-age=86400
ETag: "d3e4f5a6b7c8"

<binary PNG data — 514×514 pixels (includes 1 px border buffer on each edge)>`;

/* ─── V3 Content (named export for Unified wrapper) ─────────────────────────── */
export function MapHillshadeTileV3Content({ onNavigate }) {
  return (
    <>
      <PrivatePreviewBanner api="Map Display API v3 (Orbis Maps)" />
      <ApiRefTwoCol
        description="Retrieve 514×514 px PNG hillshade tiles via the Orbis Maps display endpoint. Supports main, hillshade, and slope tile variants for terrain visualisation. Available at zoom levels 0–13."
        sections={[
          {
            id: 'request',
            heading: 'Request',
            method: 'GET',
            note: 'https://api.tomtom.com/maps/orbis/display/hillshade/tile/{zoom}/{x}/{y}?apiVersion=2&key={key}&type={type}',
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
