import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Parameters ─────────────────────────────────────────────────────────────── */
const PARAMS_GET_CAPABILITIES = [
  { name: 'versionNumber', required: true, type: 'string (path)', values: ['1'], desc: 'Service version number. Currently 1.' },
  { name: 'apiKey', required: true, type: 'string (path)', desc: 'Your TomTom API key. Embedded in the path for WMTS (not a query parameter). Format: apiKey={Your_API_Key}.' },
  { name: 'wmtsVersion', required: true, type: 'float (path)', values: ['1.0.0'], desc: 'Version of the WMTS service. Only 1.0.0 is supported.' },
];

const PARAMS_GET_TILE = [
  { name: 'SERVICE', required: true, type: 'string (query)', values: ['WMTS'], desc: 'OGC service type identifier. Must be WMTS.' },
  { name: 'REQUEST', required: true, type: 'string (query)', values: ['GetTile'], desc: 'The request operation. Must be GetTile.' },
  { name: 'VERSION', required: true, type: 'string (query)', values: ['1.0.0'], desc: 'WMTS protocol version. Currently 1.0.0.' },
  { name: 'LAYER', required: true, type: 'string (query)', values: ['ttms'], desc: 'Identifier of the layer to retrieve. ttms = TomTom Map Standard.' },
  { name: 'STYLE', required: true, type: 'string (query)', values: ['map/1/tile/basic/main'], desc: 'Style identifier as returned by GetCapabilities. Identifies the map style.' },
  { name: 'TILEMATRIXSET', required: true, type: 'string (query)', values: ['google900913'], desc: 'Tile matrix set identifier. google900913 corresponds to EPSG:3857 (Web Mercator).' },
  { name: 'TILEMATRIX', required: true, type: 'integer (query)', desc: 'Zoom level of the tile. Corresponds to standard XYZ tile zoom levels (0–22).' },
  { name: 'TILEROW', required: true, type: 'integer (query)', desc: 'Row index of the tile within the matrix. Corresponds to the y coordinate in XYZ tile coordinates.' },
  { name: 'TILECOL', required: true, type: 'integer (query)', desc: 'Column index of the tile within the matrix. Corresponds to the x coordinate in XYZ tile coordinates.' },
  { name: 'FORMAT', type: 'string (query)', default: 'image/png', values: ['image/png'], desc: 'Image format for the tile response.' },
];

const PARAMS_RESPONSE = [
  { name: 'body', type: 'binary (image/png)', desc: 'PNG map tile for the requested TileMatrix / TileRow / TileCol.' },
  { name: 'Content-Type', type: 'response header', desc: 'image/png for GetTile; text/xml; charset=utf-8 for GetCapabilities.' },
  { name: 'Cache-Control', type: 'response header', desc: 'Tiles are publicly cacheable. Clients and CDNs should respect max-age.' },
  { name: 'Tracking-ID', type: 'response header', desc: 'Unique request identifier for support and diagnostics.' },
];

/* ─── Code examples ──────────────────────────────────────────────────────────── */
const CODE_GET_CAPABILITIES = `# GetCapabilities — returns XML service description with layer metadata
curl "https://api.tomtom.com/map/1/wmts/apiKey=YOUR_API_KEY/1.0.0/WMTSCapabilities.xml"`;

const CODE_CAPABILITIES_RESPONSE = `<?xml version="1.0" encoding="UTF-8"?>
<Capabilities xmlns="http://www.opengis.net/wmts/1.0" version="1.0.0">
  <ows:ServiceIdentification>
    <ows:Title>TomTom Web Map Tile Service</ows:Title>
    <ows:ServiceType>OGC WMTS</ows:ServiceType>
    <ows:ServiceTypeVersion>1.0.0</ows:ServiceTypeVersion>
  </ows:ServiceIdentification>

  <Contents>
    <Layer>
      <ows:Title>TomTom Map — Standard</ows:Title>
      <ows:Identifier>ttms</ows:Identifier>
      <Style isDefault="true">
        <ows:Identifier>map/1/tile/basic/main</ows:Identifier>
      </Style>
      <Format>image/png</Format>
      <TileMatrixSetLink>
        <TileMatrixSet>google900913</TileMatrixSet>
      </TileMatrixSetLink>
      <!-- Tile URL templates (a–d subdomains for parallel loading) -->
      <ResourceURL format="image/png"
        template="https://a.api.tomtom.com/{Style}/{TileMatrix}/{TileCol}/{TileRow}.png?key=YOUR_API_KEY"
        resourceType="tile"/>
    </Layer>

    <TileMatrixSet>
      <ows:Identifier>google900913</ows:Identifier>
      <ows:SupportedCRS>urn:ogc:def:crs:EPSG:6.18:3:3857</ows:SupportedCRS>
      <TileMatrix>
        <ows:Identifier>0</ows:Identifier>
        <ScaleDenominator>559082264.029</ScaleDenominator>
        <TileWidth>256</TileWidth>
        <TileHeight>256</TileHeight>
        <MatrixWidth>1</MatrixWidth>
        <MatrixHeight>1</MatrixHeight>
      </TileMatrix>
      <!-- ... zoom levels 1–22 ... -->
    </TileMatrixSet>
  </Contents>
</Capabilities>`;

const CODE_GET_TILE = `# GetTile — retrieve a single map tile via KVP encoding
curl "https://api.tomtom.com/map/1/wms/?key=YOUR_API_KEY\
&SERVICE=WMTS\
&REQUEST=GetTile\
&VERSION=1.0.0\
&LAYER=ttms\
&STYLE=map/1/tile/basic/main\
&TILEMATRIXSET=google900913\
&TILEMATRIX=12\
&TILEROW=1362\
&TILECOL=2094\
&FORMAT=image/png" \
  --output tile.png`;

const CODE_ARCGIS = `// Add TomTom WMTS as an ArcGIS Online layer
// In ArcGIS Online: Add Layer → Add Layer from Web → WMTS
// Paste the GetCapabilities URL:
// https://api.tomtom.com/map/1/wmts/apiKey=YOUR_API_KEY/1.0.0/WMTSCapabilities.xml

// Or via the ArcGIS Maps SDK for JavaScript:
import WMTSLayer from '@arcgis/core/layers/WMTSLayer';

const wmtsLayer = new WMTSLayer({
  url: 'https://api.tomtom.com/map/1/wmts/apiKey=YOUR_API_KEY/1.0.0/WMTSCapabilities.xml',
  activeLayer: {
    id: 'ttms',
  },
});

const map = new Map({
  basemap: {
    baseLayers: [wmtsLayer],
  },
});`;

const CODE_LEAFLET = `import L from 'leaflet';

// TomTom WMTS tiles follow the standard XYZ template after parsing capabilities.
// Use the ResourceURL template from GetCapabilities directly:

const API_KEY = 'YOUR_API_KEY';

const wmtsLayer = L.tileLayer(
  \`https://api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.png?key=\${API_KEY}\`,
  {
    attribution: '© TomTom',
    maxZoom: 22,
    tileSize: 256,
  }
);

const map = L.map('map', {
  center: [52.3676, 4.9041],
  zoom: 12,
  layers: [wmtsLayer],
});`;

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function MapWMTS({ onNavigate }) {
  return (
    <ApiRefTwoCol
      title="WMTS (Web Map Tile Service)"
      description="OGC-compliant WMTS 1.0.0 endpoint for GIS tile integrations. GetCapabilities returns an XML service description with layer metadata and tile URL templates. GetTile retrieves individual 256×256 px map tiles using the google900913 (EPSG:3857) tile matrix set. Compatible with ArcGIS, QGIS, and any OGC WMTS client."
      version="v1"
      sections={[
        {
          id: 'get-capabilities',
          heading: 'GetCapabilities',
          method: 'GET',
          note: 'https://api.tomtom.com/map/1/wmts/apiKey={Your_API_Key}/1.0.0/WMTSCapabilities.xml',
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
          id: 'get-tile',
          heading: 'GetTile',
          method: 'GET',
          note: 'https://api.tomtom.com/map/1/wms/?key={key}&SERVICE=WMTS&REQUEST=GetTile&LAYER=ttms&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}',
          params: PARAMS_GET_TILE,
          code: CODE_GET_TILE,
          lang: 'bash',
        },
        {
          id: 'response',
          heading: 'Response',
          params: PARAMS_RESPONSE,
          code: `HTTP/1.1 200 OK
Content-Type: image/png
Cache-Control: public, max-age=86400
Tracking-ID: AbCd1234EfGh5678

<binary PNG tile data — 256×256 pixels>`,
          lang: 'bash',
        },
        {
          id: 'arcgis',
          heading: 'ArcGIS integration',
          params: [],
          code: CODE_ARCGIS,
          lang: 'javascript',
        },
        {
          id: 'leaflet',
          heading: 'Leaflet integration',
          params: [],
          code: CODE_LEAFLET,
          lang: 'javascript',
        },
      ]}
    />
  );
}
