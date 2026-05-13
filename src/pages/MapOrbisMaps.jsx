import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const tdStyle = { padding: '8px 12px', border: '1px solid var(--border)', fontSize: '0.8125rem', verticalAlign: 'top' };
const thStyle = { ...tdStyle, background: 'var(--s1)', fontWeight: 600 };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' };

export default function MapOrbisMaps({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Map Display API — Orbis Maps</h1>
        <PageActions pageId="map-orbis-maps" pageTitle="Map Display API — Orbis Maps" />
      </div>

      <p className="quick-answer">
        The Map Display API on TomTom Orbis Maps (service version 1, Public Preview) provides vector
        and raster map tiles via an Orbis-native base path. An Orbis v2 Private Preview version adds
        improved Attributes-based field control and 3D landmark tiles.
      </p>

      <Callout type="warn" title="Public Preview (v1) / Private Preview (v2)">
        Orbis Maps v1 is in <strong>Public Preview</strong>. Orbis v2 is in <strong>Private Preview</strong>.
      </Callout>

      <div className="zone">
        <h2 className="sh" id="overview">Overview</h2>
        <p>
          Maps are displayed using tiles overlaid on each other. The Map Display API distributes
          tiles in two formats:
        </p>
        <ul style={{ lineHeight: 1.8 }}>
          <li><strong>Vector tiles</strong> — Returns map data to the client. Can be styled using the Assets API with a MapLibre-compatible renderer.</li>
          <li><strong>Raster tiles</strong> — Returns pre-rendered map images. No renderer required.</li>
        </ul>
        <p>Available styles: <code>street-light</code>, <code>street-dark</code>, <code>street-light_driving</code>, <code>street-dark_driving</code>, <code>mono-light</code>, <code>mono-dark</code>, <code>street-satellite</code>.</p>
        <p>Overlaying traffic information is easy — see the Traffic API documentation for details.</p>
      </div>

      <div className="zone">
        <h2 className="sh" id="base-url">Base URLs (Orbis v1)</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Endpoint</th>
              <th style={thStyle}>Orbis v1 path</th>
              <th style={thStyle}>TomTom Maps equivalent</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Vector tiles', '/maps/orbis/display/tile/{layer}/{style}/{zoom}/{X}/{Y}.pbf', '/map/1/tile/{layer}/{style}/{zoom}/{X}/{Y}.pbf'],
              ['Raster tiles', '/maps/orbis/display/tile/{layer}/{style}/{zoom}/{X}/{Y}.png', '/map/1/tile/{layer}/{style}/{zoom}/{X}/{Y}.png'],
              ['Satellite tiles', '/maps/orbis/display/tile/sat/main/{zoom}/{X}/{Y}.jpg', '/map/1/tile/sat/main/{zoom}/{X}/{Y}.jpg'],
              ['Hillshade tiles', '/maps/orbis/display/tile/hill/main/{zoom}/{X}/{Y}.png', '/map/1/tile/hill/main/{zoom}/{X}/{Y}.png'],
              ['Copyrights', '/maps/orbis/display/copyrights', '/map/1/copyrights'],
              ['3D landmarks (Orbis only)', '/maps/orbis/display/3d/tile/{zoom}/{X}/{Y}', 'N/A'],
              ['Extended tiles (Orbis only)', '/maps/orbis/display/extended/tile/{zoom}/{X}/{Y}', 'N/A'],
            ].map(([ep, orbis, ttm]) => (
              <tr key={ep}>
                <td style={tdStyle}>{ep}</td>
                <td style={tdStyle}><code style={{ fontSize: '0.75rem' }}>{orbis}</code></td>
                <td style={tdStyle}><code style={{ fontSize: '0.75rem', color: 'var(--mid)' }}>{ttm}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="orbis-v2">Orbis v2 Endpoints (Private Preview)</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Endpoint</th>
              <th style={thStyle}>Orbis v2 path</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Vector tiles', '/maps/orbis/display/vector/tile/{zoom}/{X}/{Y}'],
              ['Raster tiles', '/maps/orbis/display/raster/tile/{zoom}/{X}/{Y}'],
              ['Satellite tiles', '/maps/orbis/display/raster/satellite/tile/{zoom}/{X}/{Y}'],
              ['Hillshade tiles', '/maps/orbis/display/raster/hillshade/tile/{zoom}/{X}/{Y}'],
            ].map(([ep, path]) => (
              <tr key={ep}>
                <td style={tdStyle}>{ep}</td>
                <td style={tdStyle}><code style={{ fontSize: '0.75rem' }}>https://api.tomtom.com{path}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ marginTop: 12, fontSize: '0.8125rem', color: 'var(--mid)' }}>
          In v2, the <code>layer</code> path parameter moves to an optional query parameter.
          The <code>TomTom-Api-Version: 2</code> header is required.
        </p>
      </div>

      <div className="zone">
        <h2 className="sh" id="see-also">See Also</h2>
        <ul style={{ lineHeight: 1.8 }}>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('map-tomtom-maps', 'map-display-api')}>Map Display API — TomTom Maps</button>
          </li>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('map-migration', 'map-display-api')}>Migration Guide</button>
          </li>
        </ul>
      </div>
    </div>
  );
}
