import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Parameters ─────────────────────────────────────────────────────────────── */
const PARAMS_STYLE = [
  { name: 'key', required: true, type: 'string (query)', desc: 'Your TomTom API key. Required for all map asset requests.' },
  { name: 'apiVersion', type: 'integer (query)', default: '1', desc: 'API version to call. Overrides the TomTom-Api-Version header if set. Current value: 1.' },
];

const PARAMS_STYLE_RESPONSE = [
  { name: 'version', type: 'integer', desc: 'MapLibre style spec version. Always 8.' },
  { name: 'name', type: 'string', desc: 'Human-readable style name, e.g. "basic-main".' },
  { name: 'sources', type: 'object', desc: 'Tile source definitions. Each entry has a type (vector/raster), tiles URL array, and attribution.' },
  { name: 'layers', type: 'array', desc: 'Ordered array of layer definitions following the MapLibre Style Specification. Controls rendering order and styling rules.' },
  { name: 'sprite', type: 'string (URL)', desc: 'Base URL for sprite sheet assets (PNG image + JSON index). Append .json or .png to fetch the respective file.' },
  { name: 'glyphs', type: 'string (URL template)', desc: 'URL template for SDF glyph PBF files. Contains {fontstack} and {range} placeholders.' },
];

const PARAMS_SPRITE = [
  { name: 'key', required: true, type: 'string (query)', desc: 'Your TomTom API key.' },
];

const PARAMS_SPRITE_RESPONSE = [
  { name: '{iconName}', type: 'object', desc: 'One entry per icon. Contains x, y, width, height (pixel bounds in sprite sheet), pixelRatio, and sdf (boolean, true for signed-distance field icons).' },
];

const PARAMS_GLYPHS = [
  { name: 'fontstack', required: true, type: 'string (path)', desc: 'URL-encoded font stack name, e.g. "Noto Sans Regular" or "Noto Sans Bold". Multiple fonts can be combined with commas.' },
  { name: 'range', required: true, type: 'string (path)', desc: 'Unicode range in the format start-end, e.g. "0-255". Each PBF covers 256 codepoints.' },
  { name: 'key', required: true, type: 'string (query)', desc: 'Your TomTom API key.' },
];

const PARAMS_GLYPHS_RESPONSE = [
  { name: 'body', type: 'binary (application/x-protobuf)', desc: 'Protocol Buffer file containing pre-rendered SDF (signed-distance field) glyphs for the requested font stack and Unicode range. Consumed by MapLibre GL JS text rendering.' },
];

/* ─── Code examples ──────────────────────────────────────────────────────────── */
const CODE_STYLE = `# Fetch the basic-main style JSON
curl "https://api.tomtom.com/maps/orbis/styles/maps/basic-main/style.json?key=YOUR_API_KEY"

# Other available styles:
# https://api.tomtom.com/maps/orbis/styles/maps/basic-night/style.json?key=YOUR_API_KEY
# https://api.tomtom.com/maps/orbis/styles/maps/satellite-hybrid-main/style.json?key=YOUR_API_KEY`;

const CODE_STYLE_RESPONSE = `{
  "version": 8,
  "name": "basic-main",
  "sources": {
    "vectorTiles": {
      "type": "vector",
      "tiles": [
        "https://api.tomtom.com/maps/orbis/map-display/tile/basic-main/{z}/{x}/{y}.pbf?key=YOUR_API_KEY"
      ],
      "maxzoom": 22,
      "attribution": "©TomTom"
    }
  },
  "sprite": "https://api.tomtom.com/maps/orbis/styles/sprites/sprite",
  "glyphs": "https://api.tomtom.com/maps/orbis/fonts/{fontstack}/{range}.pbf?key=YOUR_API_KEY",
  "layers": [
    { "id": "background", "type": "background", "paint": { "background-color": "#f8f4f0" } },
    { "id": "Basic_Land", "type": "fill", "source": "vectorTiles", "source-layer": "Basic_Land", ... },
    ...
  ]
}`;

const CODE_SPRITE = `# Sprite JSON index
curl "https://api.tomtom.com/maps/orbis/styles/sprites/sprite.json?key=YOUR_API_KEY"

# Sprite PNG sheet
curl "https://api.tomtom.com/maps/orbis/styles/sprites/sprite.png?key=YOUR_API_KEY" \
  --output sprite.png

# High-DPI (2×) variants
curl "https://api.tomtom.com/maps/orbis/styles/sprites/sprite@2x.json?key=YOUR_API_KEY"
curl "https://api.tomtom.com/maps/orbis/styles/sprites/sprite@2x.png?key=YOUR_API_KEY" \
  --output sprite@2x.png`;

const CODE_SPRITE_RESPONSE = `{
  "amenity_parking": {
    "x": 0,
    "y": 0,
    "width": 17,
    "height": 17,
    "pixelRatio": 1,
    "sdf": false
  },
  "road_shield_motorway": {
    "x": 17,
    "y": 0,
    "width": 22,
    "height": 22,
    "pixelRatio": 1,
    "sdf": true
  }
  // ... hundreds of icons
}`;

const CODE_GLYPHS = `# Fetch Latin glyph SDF PBF (codepoints 0–255) for Noto Sans Regular
curl "https://api.tomtom.com/maps/orbis/fonts/Noto%20Sans%20Regular/0-255.pbf?key=YOUR_API_KEY" \
  --output glyphs_latin.pbf

# Cyrillic range
curl "https://api.tomtom.com/maps/orbis/fonts/Noto%20Sans%20Regular/1024-1279.pbf?key=YOUR_API_KEY" \
  --output glyphs_cyrillic.pbf

# MapLibre requests glyphs automatically from the style's glyphs URL template.
# You do not need to call this endpoint manually in normal usage.`;

const CODE_MAPLIBRE = `import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const API_KEY = 'YOUR_API_KEY';

// Option A: Use TomTom's hosted style JSON — sprites and glyphs are wired automatically
const map = new maplibregl.Map({
  container: 'map',
  style: \`https://api.tomtom.com/maps/orbis/styles/maps/basic-main/style.json?key=\${API_KEY}\`,
  center: [4.9041, 52.3676], // Amsterdam
  zoom: 12,
});

// Option B: Provide the style inline with explicit asset URLs
const map2 = new maplibregl.Map({
  container: 'map2',
  style: {
    version: 8,
    sources: {
      tomtom: {
        type: 'vector',
        tiles: [
          \`https://api.tomtom.com/maps/orbis/map-display/tile/basic-main/{z}/{x}/{y}.pbf?key=\${API_KEY}\`,
        ],
        maxzoom: 22,
        attribution: '©TomTom',
      },
    },
    sprite: \`https://api.tomtom.com/maps/orbis/styles/sprites/sprite\`,
    glyphs: \`https://api.tomtom.com/maps/orbis/fonts/{fontstack}/{range}.pbf?key=\${API_KEY}\`,
    layers: [
      // ... your custom layer definitions
    ],
  },
  center: [4.9041, 52.3676],
  zoom: 12,
});`;

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function MapAssetsApi({ onNavigate }) {
  return (
    <ApiRefTwoCol
      title="Map Assets API"
      description="Fetch the vector tile style JSON, sprite sheets, and SDF glyph fonts needed to render vector tiles client-side with MapLibre GL JS or Mapbox GL JS. In most cases, pointing your map renderer at the style JSON URL is sufficient — it references sprites and glyphs automatically."
      version="v1"
      sections={[
        {
          id: 'style-json',
          heading: 'Style JSON',
          method: 'GET',
          note: 'https://api.tomtom.com/maps/orbis/styles/maps/{styleName}/style.json?key={Your_API_Key}',
          params: PARAMS_STYLE,
          code: CODE_STYLE,
          lang: 'bash',
        },
        {
          id: 'style-response',
          heading: 'Style JSON response',
          params: PARAMS_STYLE_RESPONSE,
          code: CODE_STYLE_RESPONSE,
          lang: 'json',
        },
        {
          id: 'sprites',
          heading: 'Sprites',
          method: 'GET',
          note: 'https://api.tomtom.com/maps/orbis/styles/sprites/sprite.json?key={Your_API_Key}',
          params: PARAMS_SPRITE,
          code: CODE_SPRITE,
          lang: 'bash',
        },
        {
          id: 'sprite-response',
          heading: 'Sprite JSON response',
          params: PARAMS_SPRITE_RESPONSE,
          code: CODE_SPRITE_RESPONSE,
          lang: 'json',
        },
        {
          id: 'glyphs',
          heading: 'Glyphs',
          method: 'GET',
          note: 'https://api.tomtom.com/maps/orbis/fonts/{fontstack}/{range}.pbf?key={Your_API_Key}',
          params: PARAMS_GLYPHS,
          code: CODE_GLYPHS,
          lang: 'bash',
        },
        {
          id: 'glyphs-response',
          heading: 'Glyphs response',
          params: PARAMS_GLYPHS_RESPONSE,
          code: `HTTP/1.1 200 OK
Content-Type: application/x-protobuf
Cache-Control: public, max-age=86400

<Protocol Buffer SDF glyph data — consumed by MapLibre GL JS text rendering>`,
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
