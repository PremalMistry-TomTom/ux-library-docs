import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const tdStyle = { padding: '8px 12px', border: '1px solid var(--border)', fontSize: '0.8125rem', verticalAlign: 'top' };
const thStyle = { ...tdStyle, background: 'var(--s1)', fontWeight: 600 };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' };

export default function MapTomTomMaps({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Map Display API v1 — TomTom Maps</h1>
        <PageActions pageId="map-tomtom-maps" pageTitle="Map Display API v1 — TomTom Maps" />
      </div>

      <p className="quick-answer">
        The Map Display API (service version 1) is a suite of RESTful web services for rendering map
        tiles in web and mobile applications. It provides raster tiles (PNG/JPG images), vector tiles
        (protobuf data), satellite imagery, hillshade, and static map images.
      </p>

      <div className="zone">
        <h2 className="sh" id="overview">Overview</h2>
        <p>The Map Display API distributes maps in two formats:</p>
        <ul style={{ lineHeight: 1.8 }}>
          <li>
            <strong>Raster</strong> — Pre-rendered map images in PNG or JPG format.
            Available at 23 zoom levels (0–22). Satellite at 20 zoom levels (0–19).
            Hillshade at 14 zoom levels (0–13).
          </li>
          <li>
            <strong>Vector</strong> — Geographic map data in protobuf vector format.
            Fully customisable on the client side — switch layers on/off or change style
            without a new request.
          </li>
        </ul>
        <p>
          Map tiles use the Spherical Mercator projection coordinate system (EPSG:3857).
          At zoom level 0, the entire earth is one tile. At zoom level 22, the world is
          divided into 2<sup>44</sup> tiles.
        </p>
      </div>

      <div className="zone">
        <h2 className="sh" id="base-url">Base URLs</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Service</th>
              <th style={thStyle}>Base URL</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Raster tiles', 'https://api.tomtom.com/map/1/tile/{layer}/{style}/{zoom}/{X}/{Y}.png'],
              ['Satellite tiles', 'https://api.tomtom.com/map/1/tile/sat/main/{zoom}/{X}/{Y}.jpg'],
              ['Hillshade tiles', 'https://api.tomtom.com/map/1/tile/hill/main/{zoom}/{X}/{Y}.png'],
              ['Vector tiles', 'https://api.tomtom.com/map/1/tile/{layer}/{style}/{zoom}/{X}/{Y}.pbf'],
              ['Vector tile content', 'https://api.tomtom.com/map/1/tile/{layer}/{style}/{zoom}/{X}/{Y}/content.json'],
              ['Static image', 'https://api.tomtom.com/map/1/staticimage'],
              ['WMS', 'https://api.tomtom.com/map/1/wms'],
              ['WMTS', 'https://api.tomtom.com/map/1/wmts'],
              ['Copyrights', 'https://api.tomtom.com/map/1/copyrights'],
            ].map(([svc, url]) => (
              <tr key={svc}>
                <td style={tdStyle}>{svc}</td>
                <td style={tdStyle}><code style={{ fontSize: '0.75rem' }}>{url}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ marginTop: 12, color: 'var(--mid)', fontSize: '0.8125rem' }}>
          Authentication: <code>?key=&#123;Your_API_Key&#125;</code> appended to every request.
        </p>
      </div>

      <div className="zone">
        <h2 className="sh" id="raster">Raster Service</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Endpoint</th>
              <th style={thStyle}>Format</th>
              <th style={thStyle}>Zoom Levels</th>
              <th style={thStyle}>Tile Size</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Map Tile', 'PNG or JPG', '0–22', '256×256 or 512×512 px'],
              ['Satellite Tile', 'JPG', '0–19', '256×256 px'],
              ['Hillshade Tile', 'PNG', '0–13', '514×514 px'],
              ['Static Image', 'PNG', 'N/A', 'Configurable'],
              ['WMS', 'PNG/JPEG', '0–22', 'Configurable'],
              ['WMTS', 'PNG/JPEG', '0–22', '256×256 px'],
            ].map(([ep, fmt, zoom, size]) => (
              <tr key={ep}>
                <td style={tdStyle}>{ep}</td>
                <td style={tdStyle}>{fmt}</td>
                <td style={tdStyle}>{zoom}</td>
                <td style={tdStyle}>{size}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="vector">Vector Service</h2>
        <p>
          Vector tiles include pre-defined collections of map features — points, lines,
          road shapes, water polygons, building footprints — in protobuf format (formally
          described using the protobuf schema).
        </p>
        <p>Available layers: <code>basic</code>, <code>hybrid</code>, <code>labels</code>, <code>poi</code></p>
        <p>Features: country-specific shields, toll roads marking, all labels in national languages.</p>
      </div>

      <div className="zone">
        <h2 className="sh" id="see-also">See Also</h2>
        <ul style={{ lineHeight: 1.8 }}>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('map-orbis-maps', 'map-display-api')}>Map Display API — Orbis Maps</button>
          </li>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('map-migration', 'map-display-api')}>Migration Guide</button>
          </li>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('map-error-codes', 'map-display-api')}>Error Codes</button>
          </li>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('map-coverage', 'map-display-api')}>Market Coverage</button>
          </li>
        </ul>
      </div>
    </div>
  );
}
