import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── V2 Orbis Maps — Raster Map Tile ────────────────────────────────────────
   Endpoint: GET /maps/orbis/display/raster/tile/{zoom}/{x}/{y}
   Status:   Public Preview
────────────────────────────────────────────────────────────────────────────── */

const PARAMS_REQUEST = [
  { name: 'zoom', required: true, type: 'integer (path)', desc: 'Zoom level 0–22. Follows the Spherical Mercator (EPSG:3857) tile grid.' },
  { name: 'x', required: true, type: 'integer (path)', desc: 'Tile column index at the given zoom level. Valid range: 0 to 2^zoom − 1.' },
  { name: 'y', required: true, type: 'integer (path)', desc: 'Tile row index at the given zoom level. Valid range: 0 to 2^zoom − 1.' },
  { name: 'apiVersion', required: true, type: 'integer (query)', values: ['2'], desc: 'Orbis Maps API version. Must be 2.' },
  { name: 'key', required: true, type: 'string (query)', desc: 'Your TomTom API key.' },
  { name: 'style', type: 'string (query)', values: ['basic.main', 'basic.night'], desc: 'Map style. basic.main = daytime palette, basic.night = dark palette for low-light environments.' },
];

const PARAMS_RESPONSE = [
  { name: 'body', type: 'binary (image/png)', desc: 'PNG tile image. Empty (fully transparent) tiles are returned with HTTP 200, not 404.' },
  { name: 'Content-Type', type: 'response header', desc: 'image/png' },
  { name: 'Cache-Control', type: 'response header', desc: 'Tiles are publicly cacheable. Typical max-age is 86400 s (24 hours).' },
  { name: 'ETag', type: 'response header', desc: 'Entity tag for conditional requests. Send If-None-Match on subsequent requests; a 304 Not Modified response means the tile is unchanged.' },
];

const CODE_REQUEST = `# Raster tile — zoom 12, Amsterdam area, daytime style
curl "https://api.tomtom.com/maps/orbis/display/raster/tile/12/2094/1362?apiVersion=2&key=YOUR_API_KEY&style=basic.main"

# Night style
curl "https://api.tomtom.com/maps/orbis/display/raster/tile/12/2094/1362?apiVersion=2&key=YOUR_API_KEY&style=basic.night"`;

const CODE_RESPONSE = `HTTP/1.1 200 OK
Content-Type: image/png
Cache-Control: public, max-age=86400
ETag: "b3f2d1e4c5a6"

<binary PNG data>`;

/* ─── V2 Content (named export for Unified wrapper) ─────────────────────────── */
export function MapRasterTileV2Content({ onNavigate }) {
  return (
    <ApiRefTwoCol
      description="Retrieve raster PNG map tiles using the Orbis Maps display endpoint. Supports basic.main (daytime) and basic.night styles. Compatible with any slippy-map library that accepts a tile URL template."
      sections={[
        {
          id: 'request',
          heading: 'Request',
          method: 'GET',
          note: 'https://api.tomtom.com/maps/orbis/display/raster/tile/{zoom}/{x}/{y}?apiVersion=2&key={key}&style={style}',
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
