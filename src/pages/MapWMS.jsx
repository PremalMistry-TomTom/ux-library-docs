import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Parameters ─────────────────────────────────────────────────────────────── */
const PARAMS_GIS_URL = [
  { name: 'versionNumber', required: true, type: 'string (path)', values: ['1'], desc: 'Service version number. Currently 1.' },
  { name: 'key', required: true, type: 'string (query)', desc: 'Your TomTom API key. Provide this URL to GIS software (ArcGIS, QGIS) which will append its own WMS parameters.' },
];

const PARAMS_GET_CAPABILITIES = [
  { name: 'versionNumber', required: true, type: 'string (path)', values: ['1'], desc: 'Service version number. Currently 1.' },
  { name: 'key', required: true, type: 'string (query)', desc: 'Your TomTom API key.' },
  { name: 'service', required: true, type: 'string (query)', values: ['WMS'], desc: 'The OGC service type. Must be WMS.' },
  { name: 'request', required: true, type: 'string (query)', values: ['GetCapabilities'], desc: 'The request type. Must be GetCapabilities.' },
  { name: 'version', type: 'float (query)', default: '1.1.1', desc: 'WMS service version. Default and only supported value is 1.1.1.' },
];

const PARAMS_GET_MAP = [
  { name: 'versionNumber', required: true, type: 'string (path)', values: ['1'], desc: 'Service version number. Currently 1.' },
  { name: 'key', required: true, type: 'string (query)', desc: 'Your TomTom API key.' },
  { name: 'request', required: true, type: 'string (query)', values: ['GetMap'], desc: 'The request type. Must be GetMap.' },
  { name: 'srs', required: true, type: 'string (query)', values: ['EPSG:3857', 'EPSG:4326'], desc: 'Spatial reference system describing the bbox. EPSG:3857 is recommended, especially at higher zoom levels. Functionally equivalent to EPSG:900913/EPSG:3785.' },
  { name: 'bbox', required: true, type: 'string (query)', desc: 'Bounding box in the projection specified by srs. Format: minLon,minLat,maxLon,maxLat.' },
  { name: 'width', required: true, type: 'integer (query)', desc: 'Width of the resulting image in pixels. Maximum value: 2048.' },
  { name: 'height', required: true, type: 'integer (query)', desc: 'Height of the resulting image in pixels. Maximum value: 2048.' },
  { name: 'format', required: true, type: 'string (query)', values: ['image/png', 'image/jpeg'], desc: 'Image format for the response.' },
  { name: 'layers', required: true, type: 'string (query)', values: ['basic'], desc: 'Map layers to request. Currently only the basic layer is available.' },
  { name: 'styles', required: true, type: 'string (query)', desc: 'Map styles. Must be present but left blank — no styles are currently available. Forward-compatibility parameter.' },
  { name: 'service', type: 'string (query)', values: ['WMS'], desc: 'Optional. The OGC service type. Value: WMS.' },
  { name: 'version', type: 'float (query)', default: '1.1.1', desc: 'Optional. WMS service version. Default: 1.1.1.' },
];

const PARAMS_RESPONSE = [
  { name: 'body', type: 'image/png or image/jpeg', desc: 'The composed map image for the requested bounding box and dimensions (GetMap). GetCapabilities returns application/vnd.ogc.wms_xml.' },
  { name: 'Content-Type', type: 'response header', desc: 'image/png, image/jpeg, or application/vnd.ogc.wms_xml depending on request type.' },
  { name: 'Tracking-ID', type: 'response header', desc: 'Unique request identifier for support and diagnostics.' },
];

/* ─── Code examples ──────────────────────────────────────────────────────────── */
const CODE_GIS_URL = `# GIS Software URL — paste this into ArcGIS, QGIS, etc.
https://api.tomtom.com/map/1/wms/?key=YOUR_API_KEY

# The GIS software will append SERVICE, REQUEST, and other WMS parameters automatically.`;

const CODE_GET_CAPABILITIES = `# GetCapabilities — returns XML service description
curl "https://api.tomtom.com/map/1/wms/?key=YOUR_API_KEY&service=WMS&request=GetCapabilities&version=1.1.1"`;

const CODE_CAPABILITIES_RESPONSE = `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
<!DOCTYPE WMT_MS_Capabilities SYSTEM
  "http://schemas.opengis.net/wms/1.1.1/capabilities_1_1_1.dtd">
<WMT_MS_Capabilities version="1.1.1">
  <Service>
    <Name>OGC:WMS</Name>
    <Title>TomTom WMS</Title>
    <Abstract>OGC-compliant Web Map Service interface as an online mapping service.</Abstract>
    <OnlineResource xlink:href="https://api.tomtom.com/map/1/wms/?key=YOUR_API_KEY"/>
  </Service>
  <Capability>
    <Request>
      <GetMap>
        <Format>image/jpeg</Format>
        <Format>image/png</Format>
        ...
      </GetMap>
    </Request>
    <Layer>
      <Title>World Map</Title>
      <SRS>EPSG:4326</SRS>
      <SRS>EPSG:3857</SRS>
      <Layer queryable="0" opaque="1">
        <Name>basic</Name>
        <Title>TomTom Map</Title>
      </Layer>
    </Layer>
  </Capability>
</WMT_MS_Capabilities>`;

const CODE_GET_MAP = `# GetMap — returns a composed map image for a bounding box
curl "https://api.tomtom.com/map/1/wms/?key=YOUR_API_KEY\
&service=WMS\
&version=1.1.1\
&request=GetMap\
&bbox=1.355233,42.982261,24.980233,56.526017\
&srs=EPSG:4326\
&width=1305\
&height=748\
&layers=basic\
&styles=\
&format=image/png" \
  --output map.png`;

const CODE_HOST_CYCLING = `// Host name cycling improves parallel tile loading in browsers
// Browsers limit concurrent connections per hostname.
// Cycle through a–d subdomains for up to 4× throughput.

const HOSTS = ['a', 'b', 'c', 'd'];

function buildWmsUrl(index, params, apiKey) {
  const host = \`\${HOSTS[index % 4]}.api.tomtom.com\`;
  const qs = new URLSearchParams({
    key: apiKey,
    service: 'WMS',
    version: '1.1.1',
    request: 'GetMap',
    layers: 'basic',
    styles: '',
    format: 'image/png',
    ...params,
  });
  return \`https://\${host}/map/1/wms/?\${qs}\`;
}

// Example: two tiles, each on a different subdomain
const tile1 = buildWmsUrl(0, { bbox: '...', srs: 'EPSG:4326', width: 256, height: 256 }, 'YOUR_API_KEY');
const tile2 = buildWmsUrl(1, { bbox: '...', srs: 'EPSG:4326', width: 256, height: 256 }, 'YOUR_API_KEY');`;

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function MapWMS({ onNavigate }) {
  return (
    <ApiRefTwoCol
      title="WMS (Web Map Service)"
      description="OGC-compliant WMS 1.1.1 endpoint for GIS integrations. Supports GetCapabilities to describe available layers and GetMap to retrieve composed map images for any bounding box and image size. Compatible with ArcGIS, QGIS, and any OGC WMS client."
      version="v1"
      sections={[
        {
          id: 'gis-url',
          heading: 'GIS Software URL',
          method: 'GET',
          note: 'https://api.tomtom.com/map/1/wms/?key={Your_API_Key}',
          params: PARAMS_GIS_URL,
          code: CODE_GIS_URL,
          lang: 'bash',
        },
        {
          id: 'get-capabilities',
          heading: 'GetCapabilities',
          method: 'GET',
          note: 'https://api.tomtom.com/map/1/wms/?key={key}&service=WMS&request=GetCapabilities',
          params: PARAMS_GET_CAPABILITIES,
          code: CODE_GET_CAPABILITIES,
          lang: 'bash',
        },
        {
          id: 'capabilities-response',
          heading: 'GetCapabilities response',
          params: [],
          code: CODE_CAPABILITIES_RESPONSE,
          lang: 'xml',
        },
        {
          id: 'get-map',
          heading: 'GetMap',
          method: 'GET',
          note: 'https://api.tomtom.com/map/1/wms/?key={key}&request=GetMap&bbox={bbox}&srs={srs}&width={w}&height={h}&format={fmt}&layers=basic&styles=',
          params: PARAMS_GET_MAP,
          code: CODE_GET_MAP,
          lang: 'bash',
        },
        {
          id: 'response',
          heading: 'Response',
          params: PARAMS_RESPONSE,
          code: `HTTP/1.1 200 OK
Content-Type: image/png
Tracking-ID: AbCd1234EfGh5678

<binary PNG image — composed map for the requested bbox>`,
          lang: 'bash',
        },
        {
          id: 'host-cycling',
          heading: 'Host name cycling',
          params: [],
          code: CODE_HOST_CYCLING,
          lang: 'javascript',
        },
      ]}
    />
  );
}
