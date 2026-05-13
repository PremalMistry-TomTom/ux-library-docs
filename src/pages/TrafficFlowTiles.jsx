import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

const FLOW_TILE_PATH_PARAMS = [
  { name: 'style', required: true, type: 'string', values: ['absolute', 'relative', 'relative-delay', 'reduced-sensitivity'], desc: 'Flow colour scheme. absolute = speed in km/h; relative = ratio vs free-flow (red/green); relative-delay = delay seconds; reduced-sensitivity = relative with gentler colour gradient.' },
  { name: 'zoom', required: true, type: 'integer', desc: 'Map zoom level (0–22).' },
  { name: 'x', required: true, type: 'integer', desc: 'Tile column index in the XYZ tile scheme.' },
  { name: 'y', required: true, type: 'integer', desc: 'Tile row index in the XYZ tile scheme.' },
  { name: 'format', required: true, type: 'string', values: ['png', 'pbf'], desc: 'png returns a raster PNG tile; pbf returns a Mapbox Vector Tile (MVT/PBF) for client-side styling.' },
];

const FLOW_TILE_QUERY_PARAMS = [
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'tileSize', type: 'integer', default: 256, values: [256, 512], desc: 'Tile pixel dimensions. Use 512 for high-DPI (Retina) displays.' },
  { name: 'thickness', type: 'integer', default: 5, desc: 'Road overlay line weight (1–20). Controls visual thickness of the traffic overlay lines on raster tiles.' },
  { name: 'opacity', type: 'float (0–1)', default: 1, desc: 'Opacity of the traffic overlay on raster tiles.' },
];

const INCIDENT_TILE_PATH_PARAMS = [
  { name: 'style', required: true, type: 'integer', desc: 'Incident icon style set. 1–9 available; style 1 is the default TomTom icon set.' },
  { name: 'zoom', required: true, type: 'integer', desc: 'Map zoom level (0–22).' },
  { name: 'x', required: true, type: 'integer', desc: 'Tile column index.' },
  { name: 'y', required: true, type: 'integer', desc: 'Tile row index.' },
];

const INCIDENT_TILE_QUERY_PARAMS = [
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'tileSize', type: 'integer', default: 256, values: [256, 512], desc: 'Tile pixel dimensions.' },
  { name: 't', type: 'string', desc: 'Traffic model ID for cache validation. When provided, the CDN returns HTTP 304 if the tile has not changed since the given model was published.' },
];

const FLOW_TILE_RESPONSE = [
  { name: '(binary)', type: 'PNG / PBF', desc: 'For PNG format: a 256×256 (or 512×512) raster image with traffic flow coloured roads on a transparent background, ready for use as a map overlay layer. For PBF format: a Mapbox Vector Tile containing road geometries and traffic speed properties for client-side rendering and styling.' },
];

const CODE_RASTER = `# Raster PNG flow tile — zoom 12, tile 2094/1362, relative style
curl "https://api.tomtom.com/traffic/map/4/tile/flow/relative/12/2094/1362.png\\
  ?key=YOUR_API_KEY\\
  &tileSize=256" --output flow-tile.png`;

const CODE_VECTOR = `# Vector PBF flow tile — zoom 12, tile 2094/1362, absolute style
curl "https://api.tomtom.com/traffic/map/4/tile/flow/absolute/12/2094/1362.pbf\\
  ?key=YOUR_API_KEY" --output flow-tile.pbf`;

const CODE_INCIDENT = `# Raster incident tile — style 1, zoom 12, tile 2094/1362
curl "https://api.tomtom.com/traffic/map/4/tile/incidents/1/12/2094/1362.png\\
  ?key=YOUR_API_KEY\\
  &tileSize=256" --output incident-tile.png`;

const CODE_LEAFLET = `// Add a TomTom traffic flow tile layer to a Leaflet map
import L from 'leaflet';

const map = L.map('map').setView([52.3731, 4.8922], 12);

// Base map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Traffic flow overlay
L.tileLayer(
  'https://api.tomtom.com/traffic/map/4/tile/flow/relative/{z}/{x}/{y}.png' +
  '?key=YOUR_API_KEY&tileSize=256',
  { opacity: 0.8, attribution: '© TomTom' }
).addTo(map);

// Incident overlay
L.tileLayer(
  'https://api.tomtom.com/traffic/map/4/tile/incidents/1/{z}/{x}/{y}.png' +
  '?key=YOUR_API_KEY',
  { attribution: '© TomTom' }
).addTo(map);`;

export default function TrafficFlowTiles({ onNavigate }) {
  return (
    <ApiRefTwoCol
      title="Traffic Flow & Incident Tiles"
      description="Fetch raster PNG or vector PBF map tiles showing real-time traffic conditions. Flow tiles colour-code roads by current speed or delay. Incident tiles display icons for accidents, closures, and events. Both follow the standard XYZ tile scheme for easy integration with any mapping SDK."
      version="v1"
      sections={[
        {
          id: 'raster-flow-tiles',
          heading: 'Raster & Vector Flow Tiles',
          method: 'GET',
          note: 'https://api.tomtom.com/traffic/map/4/tile/flow/{style}/{zoom}/{x}/{y}.{format}',
          params: [...FLOW_TILE_PATH_PARAMS, ...FLOW_TILE_QUERY_PARAMS],
          code: CODE_RASTER,
          lang: 'bash',
        },
        {
          id: 'vector-flow-tiles',
          heading: 'Vector Flow Tile (PBF)',
          params: [],
          code: CODE_VECTOR,
          lang: 'bash',
        },
        {
          id: 'incident-tiles',
          heading: 'Raster Incident Tiles',
          method: 'GET',
          note: 'https://api.tomtom.com/traffic/map/4/tile/incidents/{style}/{zoom}/{x}/{y}.png — Returns a PNG tile with incident icons rendered at the correct map position. Combine with flow tiles for a complete traffic overlay.',
          params: [...INCIDENT_TILE_PATH_PARAMS, ...INCIDENT_TILE_QUERY_PARAMS],
          code: CODE_INCIDENT,
          lang: 'bash',
        },
        {
          id: 'tile-response',
          heading: 'Response',
          params: FLOW_TILE_RESPONSE,
          code: CODE_LEAFLET,
          lang: 'javascript',
        },
      ]}
    />
  );
}
