import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Request parameters ────────────────────────────────────────────────────── */
const PARAMS = [
  { name: 'id', required: true, type: 'string', desc: 'Photo ID obtained from the poi.photos[].id field in a Place by ID response. Format: POI_{uuid}.' },
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'width', type: 'integer', desc: 'Desired image width in pixels (up to 2048). The image is resized proportionally. Omit to receive the original resolution.' },
  { name: 'height', type: 'integer', desc: 'Desired image height in pixels (up to 1536). Combined with width, both dimensions are respected while preserving aspect ratio.' },
];

/* ─── Response description ───────────────────────────────────────────────────── */
const RESPONSE_FIELDS = [
  { name: '(HTTP 200)', type: 'binary image', desc: 'JPEG image data returned directly. Content-Type is image/jpeg. Use as an <img> src or stream to disk.' },
  { name: '(HTTP 302)', type: 'redirect', desc: 'Some requests return a redirect to a CDN URL. Follow the Location header to retrieve the image. Most HTTP clients (curl -L, fetch) follow redirects automatically.' },
  { name: 'Content-Type', type: 'string', desc: 'image/jpeg — the photo is always served as a JPEG regardless of the original upload format.' },
  { name: 'Cache-Control', type: 'string', desc: 'CDN cache headers are present on the final image response. Photos can be safely cached and displayed in your app.' },
];

/* ─── Code examples ──────────────────────────────────────────────────────────── */
const CODE = `# Fetch a POI photo at 800×600 px
# photo ID comes from POI Details response: poi.photos[].id
curl -L -o photo.jpg \\
  "https://api.tomtom.com/search/2/poiPhoto\\
?key=YOUR_API_KEY\\
&id=POI_f5ccc7a1-dde3-44e5-8ca0-ee7bd3d7ad1e\\
&width=800\\
&height=600"`;

const CODE_BROWSER = `// Browser / React usage — use the endpoint URL directly as an <img> src
const API_KEY = 'YOUR_API_KEY';

function POIPhoto({ photoId, width = 400, height = 300 }) {
  const src =
    \`https://api.tomtom.com/search/2/poiPhoto\` +
    \`?key=\${API_KEY}&id=\${encodeURIComponent(photoId)}\` +
    \`&width=\${width}&height=\${height}\`;

  return (
    <img
      src={src}
      alt="POI photo"
      width={width}
      height={height}
      loading="lazy"
    />
  );
}

// Full flow: search → details → photo
async function getFirstPOIPhoto(query, lat, lon) {
  // 1. Search for POI
  const searchRes = await fetch(
    \`https://api.tomtom.com/search/2/poiSearch/\${encodeURIComponent(query)}.json\` +
    \`?key=\${API_KEY}&lat=\${lat}&lon=\${lon}&limit=1\`
  );
  const { results } = await searchRes.json();
  const entityId = results[0]?.id;
  if (!entityId) throw new Error('No results');

  // 2. Get enriched details including photo IDs
  const detailRes = await fetch(
    \`https://api.tomtom.com/search/2/place.json?key=\${API_KEY}&entityId=\${entityId}\`
  );
  const detail = await detailRes.json();
  const photoId = detail.results[0]?.poi?.photos?.[0]?.id;
  if (!photoId) throw new Error('No photos available');

  // 3. Return img URL — use directly in <img src={...} />
  return \`https://api.tomtom.com/search/2/poiPhoto?key=\${API_KEY}&id=\${photoId}&width=800\`;
}`;

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function POIPhotos({ onNavigate }) {
  return (
    <ApiRefTwoCol
      title="POI Photos"
      description="Fetch photos associated with a Point of Interest. Photo IDs are obtained from the poi.photos[].id field in the POI Details response. The endpoint returns the JPEG image directly — use the URL as an img src or follow the CDN redirect."
      version="v2"
      sections={[
        {
          id: 'request',
          heading: 'Request',
          method: 'GET',
          demoId: 'poi-photos',
          note: 'https://api.tomtom.com/search/2/poiPhoto — Returns binary image data (image/jpeg), not JSON. The photo ID must come from a Place by ID response (poi.photos[].id). Some requests may return HTTP 302; follow the redirect to reach the CDN URL.',
          params: PARAMS,
          code: CODE,
          lang: 'bash',
        },
        {
          id: 'response',
          heading: 'Response',
          note: 'This endpoint does not return JSON. It serves the JPEG image directly or via a CDN redirect. HTTP 404 is returned if the photo ID is invalid or the photo is no longer available.',
          params: RESPONSE_FIELDS,
          code: CODE,
          lang: 'bash',
        },
        {
          id: 'usage',
          heading: 'Browser Usage',
          note: 'The photo URL can be used directly as an <img> src — the browser follows any redirect automatically. For a full search → details → photo flow, see the example.',
          params: [],
          code: CODE_BROWSER,
          lang: 'javascript',
        },
      ]}
    />
  );
}
