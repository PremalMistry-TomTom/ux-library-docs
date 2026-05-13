import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const tdStyle = { padding: '8px 12px', border: '1px solid var(--border)', fontSize: '0.8125rem', verticalAlign: 'top' };
const thStyle = { ...tdStyle, background: 'var(--s1)', fontWeight: 600 };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' };

export default function LDEVRTomTomMaps({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Long Distance EV Routing API v1 — TomTom Maps</h1>
        <PageActions pageId="ldevr-tomtom-maps" pageTitle="Long Distance EV Routing API v1 — TomTom Maps" />
      </div>

      <p className="quick-answer">
        The Long Distance EV Routing API (service version 1 on TomTom Maps) calculates a route between
        an origin and destination with automatically inserted charging stops based on the vehicle's
        consumption and charging model. Each charging stop becomes an additional leg in the route response.
      </p>

      <div className="zone">
        <h2 className="sh" id="overview">Overview</h2>
        <p>
          The LDEVR service endpoint is a POST-based RESTful API. The route planning locations are
          specified as a path parameter containing GeoJSON-formatted waypoints. Key response elements:
        </p>
        <ul style={{ lineHeight: 1.8 }}>
          <li>Each charging stop becomes an additional leg in the route response.</li>
          <li>Each additional leg contains a <code>chargingInformationAtEndOfLeg</code> element in its leg summary.</li>
          <li>Both the route summary and leg summary include a <code>remainingChargeAtArrivalInkWh</code> element.</li>
          <li>The route summary includes a <code>totalChargingTimeInSeconds</code> element.</li>
          <li>The <code>chargingInformationAtEndOfLeg</code> field includes: target battery charge, charging time, and details about the charging stop.</li>
        </ul>
      </div>

      <div className="zone">
        <h2 className="sh" id="base-url">Base URL</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Environment</th>
              <th style={thStyle}>Base URL</th>
              <th style={thStyle}>Method</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>Production</td>
              <td style={tdStyle}><code>https://api.tomtom.com/routing/1/calculateLongDistanceEVRoute/{'{'}routePlanningLocations{'}'}/json</code></td>
              <td style={tdStyle}><code>POST</code></td>
            </tr>
          </tbody>
        </table>
        <p style={{ marginTop: 12, color: 'var(--mid)', fontSize: '0.8125rem' }}>
          Authentication: <code>?key=&#123;Your_API_Key&#125;</code> query parameter.
        </p>
      </div>

      <div className="zone">
        <h2 className="sh" id="common-params">Key Request Parameters</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Parameter</th>
              <th style={thStyle}>Location</th>
              <th style={thStyle}>Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['routePlanningLocations', 'Path', 'Colon-separated list of waypoints in lat,lon format.'],
              ['key', 'Query', 'Your TomTom API key.'],
              ['departAt', 'Query', 'Departure date and time. Format: dateTime.'],
              ['arriveAt', 'Query', 'Desired arrival date and time.'],
              ['vehicleMaxSpeed', 'Query', 'Maximum vehicle speed in km/h.'],
              ['vehicleWeight', 'Query', 'Vehicle weight including cargo in kg.'],
              ['vehicleEngineType', 'Query', 'Engine type (electric, combustion).'],
              ['travelMode', 'Query', 'Travel mode (car, truck, taxi, etc.).'],
              ['avoid', 'Query', 'Comma-separated list of road types to avoid.'],
              ['traffic', 'Query', 'Boolean — consider real-time traffic.'],
              ['currentChargeInkWh', 'POST body', 'Vehicle current battery charge in kWh.'],
              ['maxChargeInkWh', 'POST body', 'Vehicle maximum battery capacity in kWh.'],
              ['minChargeAtDestinationInkWh', 'POST body', 'Minimum required charge at destination.'],
              ['minChargeAtChargingStopsInkWh', 'POST body', 'Minimum charge level when arriving at charging stops.'],
            ].map(([p, loc, d]) => (
              <tr key={p}>
                <td style={tdStyle}><code>{p}</code></td>
                <td style={tdStyle}>{loc}</td>
                <td style={tdStyle}>{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="use-cases">Common Use Cases</h2>
        <ul style={{ lineHeight: 1.8 }}>
          <li>Calculate departure times by planning routes using desired arrival times.</li>
          <li>Evaluate the amount of energy needed for any route.</li>
          <li>Plan the fastest, shortest, or eco route from A to B with real-time and historical traffic.</li>
          <li>Plan a route through up to 150 intermediate waypoints.</li>
          <li>Plan routes that avoid toll roads, ferries, or other road types.</li>
        </ul>
      </div>

      <div className="zone">
        <h2 className="sh" id="see-also">See Also</h2>
        <ul style={{ lineHeight: 1.8 }}>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('ldevr-orbis-v2', 'ldevr')}>LDEVR v2 — Orbis Maps</button>
          </li>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('ldevr-orbis-v3', 'ldevr')}>LDEVR v3 — Orbis Maps (Private Preview)</button>
          </li>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('ldevr-migration', 'ldevr')}>Migration Guide</button>
          </li>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('ldevr-errors', 'ldevr')}>Error Codes</button>
          </li>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('ldevr-coverage', 'ldevr')}>Market Coverage</button>
          </li>
        </ul>
      </div>
    </div>
  );
}
