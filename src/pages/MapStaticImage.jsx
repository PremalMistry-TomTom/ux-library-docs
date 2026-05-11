import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Parameters ─────────────────────────────────────────────────────────────── */
const PARAMS_REQUEST = [
  { name: 'key', required: true, type: 'string (query)', desc: 'Your TomTom API key. Obtain one at developer.tomtom.com.' },
  { name: 'center', type: 'string (query)', desc: 'Centre point of the map as lon,lat (e.g. 4.9041,52.3676). Longitude −180 to 180; latitude −85 to 85. Mutually exclusive with bbox — provide one or the other, not both.' },
  { name: 'bbox', type: 'string (query)', desc: 'Bounding box as minLon,minLat,maxLon,maxLat (e.g. 4.72,52.28,5.08,52.46). Constraint: maxLat must be greater than minLat. Mutually exclusive with center. When bbox is used, zoom is ignored.' },
  { name: 'zoom', type: 'integer (query)', default: 12, desc: 'Zoom level 0–22. Used with center to define the map extent. Ignored when bbox is provided.' },
  { name: 'width', type: 'integer (query)', default: 512, desc: 'Output image width in pixels. Valid range: 1–8192.' },
  { name: 'height', type: 'integer (query)', default: 512, desc: 'Output image height in pixels. Valid range: 1–8192.' },
  { name: 'format', type: 'string (query)', default: 'png', values: ['png', 'jpg', 'jpeg'], desc: 'Output image format. png returns image/png; jpg and jpeg both return image/jpeg.' },
  { name: 'layer', type: 'string (query)', default: 'basic', values: ['basic', 'hybrid', 'labels'], desc: 'Map layer type. basic = full base map, hybrid = aerial imagery with roads and labels overlaid, labels = labels only (transparent background).' },
  { name: 'style', type: 'string (query)', default: 'main', values: ['main', 'night'], desc: 'Colour scheme. main = daytime palette, night = dark palette. Applies to raster layers only; not available for satellite imagery in hybrid mode.' },
  { name: 'language', type: 'string (query)', default: 'NGT', desc: 'Language for map labels as an IETF tag (e.g. en-GB, de, fr, zh-CN). NGT = Neutral Ground Truth — labels use the local official script.' },
  { name: 'view', type: 'string (query)', values: ['Unified', 'AR', 'IN', 'MA', 'PK', 'RU', 'TR', 'CN', 'KR'], desc: 'Geopolitical view for disputed territories. Unified is the default international view.' },
];

const PARAMS_RESPONSE = [
  { name: 'body', type: 'binary (image/png or image/jpeg)', desc: 'Single static map image at the requested dimensions. The Content-Type reflects the format parameter.' },
  { name: 'Content-Type', type: 'response header', desc: 'image/png when format=png; image/jpeg when format=jpg or jpeg.' },
  { name: 'Content-Length', type: 'response header', desc: 'Size of the response body in bytes.' },
  { name: 'Access-Control-Allow-Origin', type: 'response header', desc: '* — CORS is enabled for all origins, so images can be fetched directly from browser JavaScript.' },
  { name: 'Tracking-ID', type: 'response header', desc: 'Unique request identifier. Include this when contacting TomTom support.' },
];

/* ─── Code examples ──────────────────────────────────────────────────────────── */
const CODE_REQUEST = `# Static map centred on Amsterdam, 800×400 px, PNG
curl "https://api.tomtom.com/map/1/staticimage?key=YOUR_API_KEY&zoom=12&center=4.9041,52.3676&width=800&height=400&format=png"

# Bounding-box crop — the Netherlands
curl "https://api.tomtom.com/map/1/staticimage?key=YOUR_API_KEY&bbox=3.358,50.750,7.228,53.555&width=600&height=800&format=png&language=nl"

# Night style, hybrid layer, 1200×628 px (social-media share size)
curl "https://api.tomtom.com/map/1/staticimage?key=YOUR_API_KEY&zoom=14&center=2.3522,48.8566&width=1200&height=628&format=jpg&layer=hybrid&style=night"

# Labels-only overlay at zoom 10
curl "https://api.tomtom.com/map/1/staticimage?key=YOUR_API_KEY&zoom=10&center=13.4050,52.5200&width=512&height=512&format=png&layer=labels&language=de"`;

const CODE_RESPONSE = `HTTP/1.1 200 OK
Content-Type: image/png
Content-Length: 142857
Access-Control-Allow-Origin: *
Tracking-ID: DfAguv6HMG89LItg6qlDWy

<binary PNG data — 800×400 pixels>

# Error: mutually exclusive parameters
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "detailedError": {
    "code": "BAD_REQUEST",
    "message": "Parameters 'center' and 'bbox' are mutually exclusive.",
    "details": [
      { "code": "INVALID_PARAMETER", "message": "Only one of center or bbox may be specified." }
    ]
  }
}`;

const CODE_JS = `const API_KEY = 'YOUR_API_KEY';

/**
 * Build a TomTom static map image URL.
 *
 * @param {Object} opts
 * @param {[number, number]} [opts.center]  - [longitude, latitude]
 * @param {[number,number,number,number]} [opts.bbox] - [minLon, minLat, maxLon, maxLat]
 * @param {number} [opts.zoom=12]
 * @param {number} [opts.width=512]
 * @param {number} [opts.height=512]
 * @param {'png'|'jpg'} [opts.format='png']
 * @param {'basic'|'hybrid'|'labels'} [opts.layer='basic']
 * @param {'main'|'night'} [opts.style='main']
 * @param {string} [opts.language='NGT']
 */
function staticMapUrl({
  center,
  bbox,
  zoom = 12,
  width = 512,
  height = 512,
  format = 'png',
  layer = 'basic',
  style = 'main',
  language = 'NGT',
} = {}) {
  const base = 'https://api.tomtom.com/map/1/staticimage';
  const params = new URLSearchParams({ key: API_KEY, width, height, format, layer, style, language });

  if (bbox) {
    params.set('bbox', bbox.join(','));
  } else if (center) {
    params.set('center', center.join(','));
    params.set('zoom', zoom);
  } else {
    throw new Error('Provide either center or bbox');
  }

  return \`\${base}?\${params}\`;
}

// Examples
const reportMap = staticMapUrl({
  center: [4.9041, 52.3676],
  zoom: 13,
  width: 800,
  height: 400,
  format: 'jpg',
});

const nightMap = staticMapUrl({
  bbox: [4.72, 52.28, 5.08, 52.46],
  width: 1200,
  height: 630,
  style: 'night',
  language: 'en-GB',
});

// Use as <img> src directly (CORS is enabled)
document.getElementById('map-preview').src = reportMap;`;

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function MapStaticImage({ onNavigate }) {
  return (
    <ApiRefTwoCol
      title="Static Image"
      description="Generate a single static map image at a defined centre point or bounding box, with configurable dimensions up to 8192 × 8192 px. Useful for reports, email previews, social media cards, PDF exports, and any context where an interactive map is not possible."
      version="v1"
      sections={[
        {
          id: 'request',
          heading: 'Request',
          method: 'GET',
          demoId: 'static-image',
          note: 'https://api.tomtom.com/map/1/staticimage',
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
          id: 'javascript',
          heading: 'URL builder (JavaScript)',
          params: [],
          code: CODE_JS,
          lang: 'javascript',
        },
      ]}
    />
  );
}
