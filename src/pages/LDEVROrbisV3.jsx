import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import PrivatePreviewBanner from '../components/ui/PrivatePreviewBanner';

const tdStyle = { padding: '8px 12px', border: '1px solid var(--border)', fontSize: '0.8125rem', verticalAlign: 'top' };
const thStyle = { ...tdStyle, background: 'var(--s1)', fontWeight: 600 };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' };

export default function LDEVROrbisV3({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Long Distance EV Routing API v3 — Orbis Maps</h1>
        <PageActions pageId="ldevr-orbis-v3" pageTitle="Long Distance EV Routing API v3 — Orbis Maps" />
      </div>

      <PrivatePreviewBanner />

      <p className="quick-answer">
        The Long Distance EV Routing API v3 on TomTom Orbis Maps is a Private Preview version that
        introduces comprehensive guidance instructions, a restructured Attributes mechanism for
        response field selection, GeoJSON-native geometry throughout, and significant parameter
        renames aligned to SI units.
      </p>

      <div className="zone">
        <h2 className="sh" id="overview">What's New in v3</h2>
        <p>v3 introduces major changes from v2. Key highlights:</p>
        <ul style={{ lineHeight: 1.8 }}>
          <li><strong>Attributes header is required</strong> — Specifies which response fields to return using dot-notation.</li>
          <li><strong>Guidance instructions</strong> — Full turn-by-turn guidance enabled via the <code>guidance</code> POST body parameter (value: <code>instructions</code>).</li>
          <li><strong>GeoJSON geometry throughout</strong> — All coordinates use GeoJSON format. Route path renamed from <code>points</code> to <code>path</code>.</li>
          <li><strong>camelCase enum values</strong> — All enum values changed from <code>UPPER_SNAKE_CASE</code> to <code>camelCase</code>.</li>
          <li><strong>Attributes-Exclude header</strong> — Optional header to exclude specific response fields.</li>
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
              <td style={tdStyle}>Orbis Maps v3</td>
              <td style={tdStyle}><code>https://api.tomtom.com/maps/orbis/routing/calculateLongDistanceEVRoute?apiVersion=3</code></td>
              <td style={tdStyle}><code>POST</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="key-changes">Key Parameter Changes from v2</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>v2 parameter</th>
              <th style={thStyle}>v3 parameter / change</th>
              <th style={thStyle}>Note</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['departAt (query)', 'departureDateTime (POST body)', 'Moved from query to POST body'],
              ['arriveAt (query)', 'arrivalDateTime (POST body)', 'Moved from query to POST body'],
              ['vehicleHeading (query)', 'vehicleHeadingInDegrees (POST body)', 'Renamed and moved'],
              ['vehicleMaxSpeed (query)', 'vehicleMaxSpeedInKilometersPerHour (POST body)', 'Renamed with units, moved'],
              ['vehicleWeight (query)', 'vehicleWeightInKilograms (POST body)', 'Renamed with units, moved'],
              ['maxAlternatives (query)', 'maxPathAlternativeRoutes (POST body)', 'Renamed and moved'],
              ['avoid (query)', 'avoids (POST body, array)', 'Renamed, changed to array, moved'],
              ['traffic (query)', 'traffic (POST body)', 'Moved to POST body'],
              ['travelMode (query)', 'travelMode (POST body)', 'Moved to POST body'],
              ['sectionType (query)', 'Attributes header', 'Replaced by Attributes mechanism'],
              ['instructionsType (query)', 'guidance (POST body)', 'Changed to new guidance parameter'],
              ['pauseTimeInSeconds', 'pauseDurationInSeconds', 'Renamed'],
            ].map(([v2p, v3p, note]) => (
              <tr key={v2p}>
                <td style={tdStyle}><code>{v2p}</code></td>
                <td style={tdStyle}><code>{v3p}</code></td>
                <td style={tdStyle}>{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="response-changes">Key Response Changes from v2</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>v2 field</th>
              <th style={thStyle}>v3 field</th>
              <th style={thStyle}>Note</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['simpleCategory', 'iconCategory', 'Renamed; values changed to camelCase strings'],
              ['delayInSeconds', 'delayDurationInSeconds', 'Renamed'],
              ['magnitudeOfDelay', 'delayMagnitude', 'Renamed; values changed to camelCase'],
              ['encodedPolyline', 'compressedPath.data', 'Restructured'],
              ['countryCode (alpha-3)', 'countryCodeIso2 (alpha-2)', 'Format changed'],
              ['startPointIndex', 'startPathIndex', 'Renamed in section objects'],
              ['endPointIndex', 'endPathIndex', 'Renamed in section objects'],
              ['progress', 'progressPoints', 'Renamed and restructured'],
              ['batteryConsumptionInkWh', 'batteryConsumptionInKilowattHours', 'Renamed with units'],
              ['routes[].guidance.instructions[]', 'routes[].instructions[]', 'Simplified — guidance wrapper removed'],
              ['instruction.point', 'instruction.maneuverPoint (GeoJSON)', 'Changed to GeoJSON Point'],
            ].map(([v2f, v3f, note]) => (
              <tr key={v2f}>
                <td style={tdStyle}><code>{v2f}</code></td>
                <td style={tdStyle}><code>{v3f}</code></td>
                <td style={tdStyle}>{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="maneuver-codes">Maneuver Code Changes (v2 → v3)</h2>
        <p>All enum values changed from <code>UPPER_SNAKE_CASE</code> to <code>camelCase</code>. Notable renames:</p>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>v2 (UPPER_SNAKE_CASE)</th>
              <th style={thStyle}>v3 (camelCase)</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['STRAIGHT', 'continueStraight'],
              ['BEAR_RIGHT', 'turnSlightRight'],
              ['BEAR_LEFT', 'turnSlightLeft'],
              ['SHARP_RIGHT', 'turnSharpRight'],
              ['SHARP_LEFT', 'turnSharpLeft'],
              ['ROUNDABOUT_CROSS', 'roundaboutStraight'],
              ['MOTORWAY_EXIT_LEFT', 'exitMotorwayLeft'],
              ['MOTORWAY_EXIT_RIGHT', 'exitMotorwayRight'],
              ['TAKE_FERRY', 'takeShipFerry'],
            ].map(([v2, v3]) => (
              <tr key={v2}>
                <td style={tdStyle}><code>{v2}</code></td>
                <td style={tdStyle}><code>{v3}</code></td>
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
              onClick={() => onNavigate('ldevr-orbis-v2', 'ldevr')}>LDEVR v2 — Orbis Maps</button>
          </li>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('ldevr-migration', 'ldevr')}>Migration Guide</button>
          </li>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('ldevr-errors', 'ldevr')}>Error Codes</button>
          </li>
        </ul>
      </div>
    </div>
  );
}
