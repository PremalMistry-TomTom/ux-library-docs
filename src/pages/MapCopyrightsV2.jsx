import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── V2 Orbis Maps — Copyrights ─────────────────────────────────────────────
   Endpoints: GET /maps/orbis/copyrights
              GET /maps/orbis/copyrights/caption
   Status:    Public Preview
────────────────────────────────────────────────────────────────────────────── */

const PARAMS_COPYRIGHTS = [
  { name: 'key', required: true, type: 'string (query)', desc: 'Your TomTom API key.' },
];

const PARAMS_CAPTION = [
  { name: 'key', required: true, type: 'string (query)', desc: 'Your TomTom API key.' },
];

const PARAMS_COPYRIGHTS_RESPONSE = [
  { name: 'body', type: 'text/plain', desc: 'Full copyright and attribution text in plain text format. Must be displayed when using TomTom map data in your application.' },
  { name: 'ETag', type: 'response header', desc: 'Entity tag for conditional requests. Use If-None-Match to avoid re-downloading unchanged copyright text.' },
];

const PARAMS_CAPTION_RESPONSE = [
  { name: 'formatVersion', type: 'string', desc: 'Version of the response format. Example: "0.0.1".' },
  { name: 'copyrightsCaption', type: 'string', desc: 'Short copyright caption string suitable for display in a map attribution control. Example: "©TomTom".' },
];

const CODE_COPYRIGHTS = `# Fetch full copyright text (Orbis v2)
curl "https://api.tomtom.com/maps/orbis/copyrights?key=YOUR_API_KEY"`;

const CODE_CAPTION = `# Fetch short copyright caption (Orbis v2)
curl "https://api.tomtom.com/maps/orbis/copyrights/caption?key=YOUR_API_KEY"`;

const CODE_CAPTION_RESPONSE = `{
  "formatVersion": "0.0.1",
  "copyrightsCaption": "©TomTom"
}`;

/* ─── V2 Content (named export for Unified wrapper) ─────────────────────────── */
export function MapCopyrightsV2Content({ onNavigate }) {
  return (
    <ApiRefTwoCol
      description="Returns copyright and attribution text for Orbis Maps. Two endpoints are available: a full plain-text copyright statement and a short caption JSON suitable for map attribution controls."
      sections={[
        {
          id: 'request',
          heading: 'Copyrights',
          method: 'GET',
          note: 'https://api.tomtom.com/maps/orbis/copyrights?key={key}',
          params: PARAMS_COPYRIGHTS,
          code: CODE_COPYRIGHTS,
          lang: 'bash',
        },
        {
          id: 'copyrights-response',
          heading: 'Copyrights response',
          params: PARAMS_COPYRIGHTS_RESPONSE,
          code: `HTTP/1.1 200 OK
Content-Type: text/plain
ETag: "e5f6a7b8c9d0"

© 1992 - 2025 TomTom. All rights reserved. This material is proprietary and the subject
of copyright protection, database right protection and other intellectual property rights
owned by TomTom or its suppliers.`,
          lang: 'bash',
        },
        {
          id: 'caption',
          heading: 'Caption (short form)',
          method: 'GET',
          note: 'https://api.tomtom.com/maps/orbis/copyrights/caption?key={key}',
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
      ]}
    />
  );
}
