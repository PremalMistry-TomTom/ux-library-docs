import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const tdStyle = { padding: '8px 12px', border: '1px solid var(--border)', fontSize: '0.8125rem', verticalAlign: 'top' };
const thStyle = { ...tdStyle, background: 'var(--s1)', fontWeight: 600 };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' };

export default function LDEVROrbisV2({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Long Distance EV Routing API v2 — Orbis Maps</h1>
        <PageActions pageId="ldevr-orbis-v2" pageTitle="Long Distance EV Routing API v2 — Orbis Maps" />
      </div>

      <p className="quick-answer">
        The Long Distance EV Routing API v2 on TomTom Orbis Maps calculates routes with automatic
        charging stops using an Orbis-native base path. Route planning locations are specified as
        POST body parameters in GeoJSON format. The <code>TomTom-Api-Key</code> header replaces
        the <code>key</code> query parameter.
      </p>

      <div className="zone">
        <h2 className="sh" id="overview">Overview</h2>
        <p>
          The v2 API uses the same core routing and charging stop logic as v1 (TomTom Maps) but
          with an updated parameter model aligned to Orbis conventions. Key differences from v1:
        </p>
        <ul style={{ lineHeight: 1.8 }}>
          <li><code>routePlanningLocations</code> is now a POST body parameter (GeoJSON format), not a path parameter.</li>
          <li>API key is passed via <code>TomTom-Api-Key</code> header instead of <code>key</code> query parameter.</li>
          <li>Many query parameters moved to POST body parameters.</li>
          <li>Response field names are aligned to Orbis conventions (e.g., camelCase, SI units).</li>
        </ul>
      </div>

      <div className="zone">
        <h2 className="sh" id="base-url">Base URL</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Platform</th>
              <th style={thStyle}>Endpoint</th>
              <th style={thStyle}>Method</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>TomTom Maps (v1)</td>
              <td style={tdStyle}><code>https://api.tomtom.com/routing/1/calculateLongDistanceEVRoute/{'{'}locs{'}'}/json</code></td>
              <td style={tdStyle}><code>POST</code></td>
            </tr>
            <tr>
              <td style={tdStyle}>Orbis Maps (v2)</td>
              <td style={tdStyle}><code>https://api.tomtom.com/maps/orbis/routing/calculateLongDistanceEVRoute?apiVersion=2</code></td>
              <td style={tdStyle}><code>POST</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="response">Key Response Changes from v1</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>v1 field</th>
              <th style={thStyle}>v2 field</th>
              <th style={thStyle}>Note</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['travelTimeInSeconds', 'travelDurationInSeconds', 'Renamed'],
              ['trafficDelayInSeconds', 'trafficDelayDurationInSeconds', 'Renamed'],
              ['departureTime', 'departureDateTime', 'Renamed'],
              ['arrivalTime', 'arrivalDateTime', 'Renamed'],
              ['countryCode (alpha-3)', 'countryCodeIso2 (alpha-2)', 'Renamed and format changed'],
              ['points (array)', 'path (GeoJSON)', 'Changed to GeoJSON format'],
              ['deviationTime', 'deviationDurationInSeconds', 'Renamed'],
              ['deviationDistance', 'deviationDistanceInMeters', 'Renamed'],
              ['encodedPolyline', 'compressedPath.data', 'Restructured'],
              ['sections (array)', 'sections (map of arrays)', 'Type changed'],
            ].map(([v1f, v2f, note]) => (
              <tr key={v1f}>
                <td style={tdStyle}><code>{v1f}</code></td>
                <td style={tdStyle}><code>{v2f}</code></td>
                <td style={tdStyle}>{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="see-also">See Also</h2>
        <ul style={{ lineHeight: 1.8 }}>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('ldevr-tomtom-maps', 'ldevr')}>LDEVR v1 — TomTom Maps</button>
          </li>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('ldevr-orbis-v3', 'ldevr')}>LDEVR v3 — Orbis Maps (Private Preview)</button>
          </li>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('ldevr-migration', 'ldevr')}>Migration Guide</button>
          </li>
        </ul>
      </div>
    </div>
  );
}
