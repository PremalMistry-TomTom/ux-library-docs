import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Parameters ─────────────────────────────────────────────────────────────── */
const PARAMS_MAP_COPYRIGHTS = [
  { name: 'versionNumber', required: true, type: 'integer (path)', values: ['1', '2'], desc: 'Service version number. Use 2 for the current version.' },
  { name: 'key', required: true, type: 'string (query)', desc: 'Your TomTom API key. Obtain one at developer.tomtom.com.' },
];

const PARAMS_CAPTION = [
  { name: 'versionNumber', required: true, type: 'integer (path)', values: ['1', '2'], desc: 'Service version number. Use 2 for the current version.' },
  { name: 'key', required: true, type: 'string (query)', desc: 'Your TomTom API key. Obtain one at developer.tomtom.com.' },
];

const PARAMS_COPYRIGHTS_RESPONSE = [
  { name: 'body', type: 'text/plain', desc: 'Full copyright and attribution text in plain text format. Must be displayed when using TomTom map data in your application.' },
  { name: 'ETag', type: 'response header', desc: 'Entity tag for conditional requests. Use If-None-Match to avoid re-downloading unchanged copyright text.' },
  { name: 'Tracking-ID', type: 'response header', desc: 'Unique request identifier. Include this when contacting TomTom support.' },
];

const PARAMS_CAPTION_RESPONSE = [
  { name: 'formatVersion', type: 'string', desc: 'Version of the response format. Example: "0.0.1".' },
  { name: 'copyrightsCaption', type: 'string', desc: 'Short copyright caption string suitable for display in a map attribution control. Example: "©TomTom".' },
];

/* ─── Code examples ──────────────────────────────────────────────────────────── */
const CODE_MAP_COPYRIGHTS = `# Fetch full copyright text (plain text)
curl "https://api.tomtom.com/map/2/copyrights?key=YOUR_API_KEY"

# Response:
# © 1992 - 2025 TomTom. All rights reserved. This material is proprietary
# and the subject of copyright protection, database right protection and
# other intellectual property rights owned by TomTom or its suppliers.
# The use of this material is subject to the terms of a license agreement.
# ...`;

const CODE_CAPTION = `# Fetch short copyright caption (JSON)
curl "https://api.tomtom.com/map/2/copyrights/caption.json?key=YOUR_API_KEY"`;

const CODE_CAPTION_RESPONSE = `{
  "formatVersion": "0.0.1",
  "copyrightsCaption": "©TomTom"
}`;

const CODE_ATTRIBUTION = `// Display copyright attribution in a map UI
const API_KEY = 'YOUR_API_KEY';

async function loadCopyrightCaption() {
  const response = await fetch(
    \`https://api.tomtom.com/map/2/copyrights/caption.json?key=\${API_KEY}\`
  );
  const data = await response.json();
  return data.copyrightsCaption; // "©TomTom"
}

// Add to a MapLibre GL JS map attribution control
async function addAttribution(map) {
  const caption = await loadCopyrightCaption();

  // MapLibre picks up attributions from the style source,
  // but you can also set it on the map control:
  const attribution = new maplibregl.AttributionControl({
    customAttribution: caption,
    compact: false,
  });
  map.addControl(attribution, 'bottom-right');
}

// Or display inline anywhere in your UI
async function renderAttribution() {
  const caption = await loadCopyrightCaption();
  document.getElementById('map-attribution').textContent = caption;
}`;

/* ─── V1 Content (named export for Unified wrapper) ─────────────────────────── */
export function MapCopyrightsV1Content({ onNavigate }) {
  return (
    <ApiRefTwoCol
      description="Returns copyright and attribution text required to be displayed when using TomTom map data. Two endpoints are available: a full plain-text copyright statement and a short caption JSON suitable for map attribution controls."
      sections={[
        {
          id: 'map-copyrights',
          heading: 'Map Copyrights',
          method: 'GET',
          note: 'https://api.tomtom.com/map/2/copyrights?key={Your_API_Key}',
          params: PARAMS_MAP_COPYRIGHTS,
          code: CODE_MAP_COPYRIGHTS,
          lang: 'bash',
        },
        {
          id: 'copyrights-response',
          heading: 'Copyrights response',
          params: PARAMS_COPYRIGHTS_RESPONSE,
          code: `HTTP/1.1 200 OK
Content-Type: text/plain
ETag: "c4d5e6f7a8b9"
Tracking-ID: AbCd1234EfGh5678

© 1992 - 2025 TomTom. All rights reserved. This material is proprietary and the subject
of copyright protection, database right protection and other intellectual property rights
owned by TomTom or its suppliers. The use of this material is subject to the terms of a
license agreement. Any unauthorized copying or disclosure of this material will lead to
criminal and civil liabilities.
Data Source © 2025 TomTom,
based on https://www.tomtom.com/legal/en_gb/product-attributions/`,
          lang: 'bash',
        },
        {
          id: 'caption',
          heading: 'Caption (short form)',
          method: 'GET',
          note: 'https://api.tomtom.com/map/2/copyrights/caption.json?key={Your_API_Key}',
          params: PARAMS_CAPTION,
          code: CODE_CAPTION,
          lang: 'bash',
        },
        {
          id: 'caption-response',
          heading: 'Caption response',
          params: PARAMS_CAPTION_RESPONSE,
          code: CODE_CAPTION_RESPONSE,
          lang: 'json',
        },
        {
          id: 'attribution',
          heading: 'Attribution integration',
          params: [],
          code: CODE_ATTRIBUTION,
          lang: 'javascript',
        },
      ]}
    />
  );
}
