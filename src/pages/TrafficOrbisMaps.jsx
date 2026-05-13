import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const tdStyle = { padding: '8px 12px', border: '1px solid var(--border)', fontSize: '0.8125rem', verticalAlign: 'top' };
const thStyle = { ...tdStyle, background: 'var(--s1)', fontWeight: 600 };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' };

export default function TrafficOrbisMaps({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Traffic API — Orbis Maps</h1>
        <PageActions pageId="traffic-orbis-maps" pageTitle="Traffic API — Orbis Maps" />
      </div>

      <p className="quick-answer">
        The Traffic API on TomTom Orbis Maps (service version 1) provides real-time traffic flow and
        incident data as raster and vector tiles overlaid on Orbis Maps map tiles. An Orbis v2 private
        preview version is also available with an improved Attributes mechanism for response field control.
      </p>

      <Callout type="warn" title="Public Preview (v1) / Private Preview (v2)">
        Orbis Traffic v1 is in <strong>Public Preview</strong>. Orbis Traffic v2 is in{' '}
        <strong>Private Preview</strong> for testing purposes only.
      </Callout>

      <div className="zone">
        <h2 className="sh" id="overview">Overview</h2>
        <p>
          The Orbis Maps Traffic API distributes traffic data as tiles that can be overlaid on
          Map Display tiles. Available in two formats:
        </p>
        <ul style={{ lineHeight: 1.8 }}>
          <li><strong>Vector tiles</strong> — Returns traffic data (not images) to the client. Can be styled using the Assets API.</li>
          <li><strong>Raster tiles</strong> — Returns pre-rendered traffic images. Displayed without a renderer.</li>
        </ul>
        <p>Available styles: <code>flow-relative_light</code>, <code>flow-relative_dark</code>, <code>incidents_light</code>, <code>incidents_dark</code>.</p>
      </div>

      <div className="zone">
        <h2 className="sh" id="base-url">Base URLs</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Endpoint</th>
              <th style={thStyle}>Orbis v1 path</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Flow vector tiles', '/maps/orbis/traffic/tile/flow/{zoom}/{x}/{y}.pbf'],
              ['Flow raster tiles', '/maps/orbis/traffic/tile/flow/{zoom}/{x}/{y}.png'],
              ['Incident vector tiles', '/maps/orbis/traffic/tile/incidents/{zoom}/{x}/{y}.pbf'],
              ['Incident raster tiles', '/maps/orbis/traffic/tile/incidents/{zoom}/{x}/{y}.png'],
              ['Incident details', '/maps/orbis/traffic/incidentDetails'],
            ].map(([ep, path]) => (
              <tr key={ep}>
                <td style={tdStyle}>{ep}</td>
                <td style={tdStyle}><code style={{ fontSize: '0.75rem' }}>https://api.tomtom.com{path}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="versioning">Versioning</h2>
        <p>
          The <code>TomTom-Api-Version</code> header (value: <code>1</code>) is required for all
          Orbis v1 requests. The <code>key</code> query parameter is used for authentication.
        </p>
        <pre style={{ background: 'var(--s1)', padding: 12, borderRadius: 6, fontSize: '0.8125rem', overflowX: 'auto' }}>
{`GET https://api.tomtom.com/maps/orbis/traffic/tile/flow/12/2048/1366.pbf
    ?key={Your_API_Key}&apiVersion=1`}
        </pre>
      </div>

      <div className="zone">
        <h2 className="sh" id="endpoints">Endpoints (v1)</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Endpoint</th>
              <th style={thStyle}>Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Vector Flow Tiles', 'Provides traffic flow data as vector tiles at zoom levels 0–22. Contains relative speed, road category, and road closure data.'],
              ['Raster Flow Tiles', 'Provides traffic flow data as rendered images. Supports light and dark styles.'],
              ['Incident Details', 'Provides detailed information about traffic incidents inside a given bounding box. Returns GeoJSON format.'],
              ['Vector Incident Tiles', 'Provides traffic incidents as vector tiles at zoom levels 0–22.'],
              ['Raster Incident Tiles', 'Provides traffic incidents as rendered images. Supports light and dark styles.'],
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
        <h2 className="sh" id="orbis-v2">Orbis v2 (Private Preview)</h2>
        <p>
          Orbis v2 introduces a unified <strong>Attributes mechanism</strong> for controlling response
          content across all endpoints. Key changes from v1:
        </p>
        <ul style={{ lineHeight: 1.8 }}>
          <li>New base paths: <code>/maps/orbis/traffic/flow/vector/tile/</code>, <code>/maps/orbis/traffic/incidents/details</code></li>
          <li><code>TomTom-Api-Version: 2</code> is required.</li>
          <li><code>TomTom-Api-Key</code> header is recommended over <code>key</code> query parameter.</li>
          <li>The <code>Attributes</code> and <code>Attributes-Exclude</code> headers replace <code>tags</code>, <code>fields</code>, and filter query parameters.</li>
          <li>Error responses use <code>{ 'detailedError.code' }</code> and <code>{ 'detailedError.message' }</code> fields.</li>
          <li>Integer enum values changed to descriptive strings (e.g., <code>iconCategory</code>: <code>0</code> → <code>"unknown"</code>).</li>
        </ul>
        <p>
          See the{' '}
          <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
            onClick={() => onNavigate('traffic-migration', 'traffic-api')}>Traffic API Migration Guide</button>{' '}
          for a full comparison.
        </p>
      </div>

      <div className="zone">
        <h2 className="sh" id="see-also">See Also</h2>
        <ul style={{ lineHeight: 1.8 }}>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('traffic-tomtom-maps', 'traffic-api')}>Traffic API — TomTom Maps</button>
          </li>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('traffic-migration', 'traffic-api')}>Migration Guide</button>
          </li>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('traffic-error-codes', 'traffic-api')}>Error Codes</button>
          </li>
        </ul>
      </div>
    </div>
  );
}
