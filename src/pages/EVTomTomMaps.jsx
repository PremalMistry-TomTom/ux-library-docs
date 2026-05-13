import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const tdStyle = { padding: '8px 12px', border: '1px solid var(--border)', fontSize: '0.8125rem', verticalAlign: 'top' };
const thStyle = { ...tdStyle, background: 'var(--s1)', fontWeight: 600 };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' };

export default function EVTomTomMaps({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>EV Charging Stations Availability API v1 — TomTom Maps</h1>
        <PageActions pageId="ev-tomtom-maps" pageTitle="EV Charging Stations Availability API v1 — TomTom Maps" />
      </div>

      <p className="quick-answer">
        The EV Charging Stations Availability API (service version 2) provides real-time information
        about the availability of charging spots at a given charging station. Data is refreshed every
        3 minutes. Results include connector type, charging power specification, and number of available
        and occupied slots.
      </p>

      <div className="zone">
        <h2 className="sh" id="overview">Overview</h2>
        <p>
          Use this API to determine if and how many compatible charging spots are currently available
          at a charging station. The API aggregates availability by connector type and charging power level.
        </p>
        <p>Common use cases:</p>
        <ul style={{ lineHeight: 1.8 }}>
          <li>Check how many vehicle-compatible charging spots are available at a station.</li>
          <li>Check the current status, connector type, and power compatibility of all spots at a station.</li>
        </ul>
        <p>Key features:</p>
        <ul style={{ lineHeight: 1.8 }}>
          <li>Number of charging spots by availability status, aggregated by connector type and charging power.</li>
          <li>Filtering results per connector type and charging power.</li>
          <li>Data refreshed every 3 minutes for near real-time accuracy.</li>
        </ul>
      </div>

      <div className="zone">
        <h2 className="sh" id="base-url">Base URL</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Environment</th>
              <th style={thStyle}>Base URL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>Production</td>
              <td style={tdStyle}><code>https://api.tomtom.com/search/2/</code></td>
            </tr>
          </tbody>
        </table>
        <p style={{ marginTop: 12, color: 'var(--mid)', fontSize: '0.8125rem' }}>
          Authentication: <code>?key=&#123;Your_API_Key&#125;</code> appended to every request.
        </p>
      </div>

      <div className="zone">
        <h2 className="sh" id="endpoint">Endpoint</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Endpoint</th>
              <th style={thStyle}>Path</th>
              <th style={thStyle}>Method</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>EV Charging Stations Availability</td>
              <td style={tdStyle}><code>/search/2/chargingAvailability.json</code></td>
              <td style={tdStyle}><code>GET</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="params">Request Parameters</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Parameter</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['key', 'string (required)', 'Your TomTom API key.'],
              ['chargingAvailability', 'string (required)', 'The ID of the charging station (entityId) to check availability for.'],
              ['connectorSet', 'string', 'Comma-separated list of connector types to filter results. See Supported Connector Types.'],
              ['minPowerKW', 'float', 'Minimum charging power in kW to include in results.'],
              ['maxPowerKW', 'float', 'Maximum charging power in kW to include in results.'],
            ].map(([p, t, d]) => (
              <tr key={p}>
                <td style={tdStyle}><code>{p}</code></td>
                <td style={tdStyle}>{t}</td>
                <td style={tdStyle}>{d}</td>
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
              onClick={() => onNavigate('ev-orbis-maps', 'ev-charging-api')}>EV Charging API — Orbis Maps</button>
          </li>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('ev-connector-types', 'ev-charging-api')}>Supported Connector Types</button>
          </li>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('ev-error-codes', 'ev-charging-api')}>Error Codes</button>
          </li>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('ev-charging-coverage', 'ev-charging-api')}>Market Coverage</button>
          </li>
        </ul>
      </div>
    </div>
  );
}
