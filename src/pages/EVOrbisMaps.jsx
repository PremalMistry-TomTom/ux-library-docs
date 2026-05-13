import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const tdStyle = { padding: '8px 12px', border: '1px solid var(--border)', fontSize: '0.8125rem', verticalAlign: 'top' };
const thStyle = { ...tdStyle, background: 'var(--s1)', fontWeight: 600 };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' };

export default function EVOrbisMaps({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>EV Charging Stations Availability API — Orbis Maps</h1>
        <PageActions pageId="ev-orbis-maps" pageTitle="EV Charging Stations Availability API — Orbis Maps" />
      </div>

      <p className="quick-answer">
        The EV Charging Stations Availability API on TomTom Orbis Maps provides the same near-real-time
        availability data as the TomTom Maps version, delivered via an Orbis-native base path. This version
        is restricted to <strong>Private Preview</strong> access.
      </p>

      <Callout type="warn" title="Private Preview">
        This TomTom Orbis Maps API is restricted to <strong>Private Preview</strong>. Contact TomTom
        to request access.
      </Callout>

      <div className="zone">
        <h2 className="sh" id="overview">Overview</h2>
        <p>
          The Orbis Maps EV Charging Stations Availability API provides the same core capabilities as
          the TomTom Maps version: real-time availability aggregated by connector type and power level,
          refreshed every 3 minutes.
        </p>
        <p>Use cases:</p>
        <ul style={{ lineHeight: 1.8 }}>
          <li>Check how many vehicle-compatible charging spots are available at a selected station.</li>
          <li>Check connector type and power compatibility for all spots at a station.</li>
        </ul>
      </div>

      <div className="zone">
        <h2 className="sh" id="base-url">Base URL</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Platform</th>
              <th style={thStyle}>Base URL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>TomTom Maps</td>
              <td style={tdStyle}><code>https://api.tomtom.com/search/2/</code></td>
            </tr>
            <tr>
              <td style={tdStyle}>Orbis Maps</td>
              <td style={tdStyle}><code>https://api.tomtom.com/maps/orbis/places/</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="endpoint">Endpoint</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Platform</th>
              <th style={thStyle}>Endpoint path</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>TomTom Maps</td>
              <td style={tdStyle}><code>/search/2/chargingAvailability.json</code></td>
            </tr>
            <tr>
              <td style={tdStyle}>Orbis Maps</td>
              <td style={tdStyle}><code>/maps/orbis/places/chargingAvailability.json</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="see-also">See Also</h2>
        <ul style={{ lineHeight: 1.8 }}>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('ev-tomtom-maps', 'ev-charging-api')}>EV Charging API — TomTom Maps</button>
          </li>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('ev-connector-types', 'ev-charging-api')}>Supported Connector Types</button>
          </li>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('ev-error-codes', 'ev-charging-api')}>Error Codes</button>
          </li>
        </ul>
      </div>
    </div>
  );
}
