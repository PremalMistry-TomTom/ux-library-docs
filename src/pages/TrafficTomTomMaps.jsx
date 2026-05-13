import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const tdStyle = { padding: '8px 12px', border: '1px solid var(--border)', fontSize: '0.8125rem', verticalAlign: 'top' };
const thStyle = { ...tdStyle, background: 'var(--s1)', fontWeight: 600 };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' };

export default function TrafficTomTomMaps({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Traffic API v1 — TomTom Maps</h1>
        <PageActions pageId="traffic-tomtom-maps" pageTitle="Traffic API v1 — TomTom Maps" />
      </div>

      <p className="quick-answer">
        The Traffic API (service versions 4 &amp; 5) is a suite of RESTful web services for overlaying
        real-time traffic information on maps in web and mobile applications. It provides Traffic Incidents
        and Traffic Flow data, updated every minute, served as raster and vector tiles.
      </p>

      <div className="zone">
        <h2 className="sh" id="overview">Overview</h2>
        <p>The Traffic API consists of two services:</p>
        <ul style={{ lineHeight: 1.8 }}>
          <li>
            <strong>Traffic Incidents</strong> — Provides an accurate view of traffic jams and incidents
            around a road network. Updated every minute. Details include: start/end location, road name,
            type of delay, length of delay, significance, and distance.
          </li>
          <li>
            <strong>Traffic Flow</strong> — Provides real-time observed speeds and travel times for all
            key roads in a network. Updated every minute. Details include: current speed, freeflow speed,
            and quality indicator.
          </li>
        </ul>
        <p>
          Traffic data is displayed using tiles — raster (PNG images) or vector (binary protobuf data)
          — that can be overlaid on map tiles.
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
              ['Traffic Flow tiles', 'https://api.tomtom.com/traffic/map/4/tile/flow/{type}/{zoom}/{x}/{y}.pbf'],
              ['Traffic Incidents tiles', 'https://api.tomtom.com/traffic/map/4/tile/incidents/{zoom}/{x}/{y}.pbf'],
              ['Incident Details (v4)', 'https://api.tomtom.com/traffic/services/4/incidentDetails/{style}/{bbox}/{zoom}/{modelID}/{format}'],
              ['Incident Details (v5)', 'https://api.tomtom.com/traffic/services/5/incidentDetails'],
              ['Traffic Model ID', 'https://api.tomtom.com/traffic/services/4/trafficModelId.json'],
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
        <h2 className="sh" id="traffic-flow">Traffic Flow Service</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Endpoint</th>
              <th style={thStyle}>Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Vector Flow Tiles', 'Returns traffic flow data as vector tiles (protobuf). Contains road-level speed data.'],
              ['Raster Flow Tiles', 'Returns traffic flow data as rendered PNG images. Available in 23 zoom levels.'],
              ['Flow Segment Data', 'Returns real-time traffic data for a road segment closest to the given coordinates.'],
            ].map(([ep, desc]) => (
              <tr key={ep}>
                <td style={tdStyle}><strong>{ep}</strong></td>
                <td style={tdStyle}>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="traffic-incidents">Traffic Incidents Service</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Endpoint</th>
              <th style={thStyle}>Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Vector Incident Tiles', 'Returns traffic incident data as vector tiles for map overlay.'],
              ['Raster Incident Tiles', 'Returns traffic incident data as rendered PNG images.'],
              ['Incident Details (v4)', 'Returns details about traffic incidents within a given bounding box. Supports XML, JSON, JSONP output.'],
              ['Incident Details (v5)', 'Updated incident details endpoint with improved filtering and GeoJSON geometry.'],
              ['Incident Viewport', 'Returns a traffic model ID for a given viewport.'],
              ['Traffic Model ID', 'Returns the current traffic model ID required by Incident Details requests.'],
            ].map(([ep, desc]) => (
              <tr key={ep}>
                <td style={tdStyle}><strong>{ep}</strong></td>
                <td style={tdStyle}>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="common-use-cases">Common Use Cases</h2>
        <ul style={{ lineHeight: 1.8 }}>
          <li>Display real-time traffic incident data on a map.</li>
          <li>Display real-time traffic segment speed data on a map with colored tubes.</li>
          <li>Show traffic delay data with location, length, and delay details.</li>
          <li>Indicate severity of current traffic conditions.</li>
          <li>Combine Traffic Flow Speed information with other real-time data for traffic management monitoring.</li>
        </ul>
      </div>

      <div className="zone">
        <h2 className="sh" id="see-also">See Also</h2>
        <ul style={{ lineHeight: 1.8 }}>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('traffic-orbis-maps', 'traffic-api')}>Traffic API — Orbis Maps</button>
          </li>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('traffic-migration', 'traffic-api')}>Migration Guide</button>
          </li>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('traffic-error-codes', 'traffic-api')}>Error Codes</button>
          </li>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('traffic-coverage', 'traffic-api')}>Market Coverage</button>
          </li>
        </ul>
      </div>
    </div>
  );
}
