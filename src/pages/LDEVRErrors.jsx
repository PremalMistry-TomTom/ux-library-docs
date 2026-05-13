import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const tdStyle = { padding: '8px 12px', border: '1px solid var(--border)', fontSize: '0.8125rem', verticalAlign: 'top' };
const thStyle = { ...tdStyle, background: 'var(--s1)', fontWeight: 600 };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' };

export default function LDEVRErrors({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Long Distance EV Routing API — Error Codes</h1>
        <PageActions pageId="ldevr-errors" pageTitle="Long Distance EV Routing API — Error Codes" />
      </div>

      <p className="quick-answer">
        The Long Distance EV Routing API returns standard HTTP status codes. This page documents the
        codes, their meanings, and recommended resolution steps across all versions (v1, v2, and v3).
      </p>

      <div className="zone">
        <h2 className="sh" id="http-status">HTTP Status Codes</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>HTTP Status</th>
              <th style={thStyle}>Error Code</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Resolution</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['200 OK', '—', 'Request was successful. Route is returned in the response body.', 'No action needed.'],
              ['400 Bad Request', 'INVALID_PARAMETERS', 'One or more parameters are invalid or malformed.', 'Check all POST body and query parameters. Ensure route planning locations are valid coordinates and battery parameters are within vehicle specifications.'],
              ['400 Bad Request', 'MISSING_ROUTE_LOCATIONS', 'Route planning locations are missing or invalid.', 'Provide at least two valid waypoints. In v2/v3, use the POST body routePlanningLocations parameter in GeoJSON MultiPoint format.'],
              ['400 Bad Request', 'INVALID_BATTERY_PARAMS', 'Battery parameters are missing or invalid.', 'Ensure currentChargeInkWh, maxChargeInkWh, and minimum charge parameters are provided and logical (e.g., current ≤ max).'],
              ['400 Bad Request', 'NO_ROUTE_FOUND', 'No valid route could be calculated for the given parameters.', 'Check that the origin and destination are reachable and adjust avoid parameters or vehicle constraints.'],
              ['400 Bad Request', 'MISSING_ATTRIBUTES', '(v3 only) The Attributes header is absent or empty.', 'Add the required Attributes header with dot-notation field paths (e.g., routes.summary,routes.legs).'],
              ['401 Unauthorized', 'UNAUTHORIZED', 'The API key is missing or invalid.', 'Provide a valid API key via the key query parameter (v1) or TomTom-Api-Key header (v2/v3).'],
              ['403 Forbidden', 'FORBIDDEN', 'The API key does not have access to the LDEVR API.', 'Enable the Long Distance EV Routing API for your key on my.tomtom.com.'],
              ['429 Too Many Requests', 'QUOTA_EXCEEDED', 'Request rate or daily quota exceeded.', 'Reduce request frequency or upgrade your plan.'],
              ['500 Internal Server Error', 'INTERNAL_ERROR', 'An unexpected server-side error occurred.', 'Retry the request. Contact TomTom support if the error persists.'],
              ['503 Service Unavailable', 'SERVICE_UNAVAILABLE', 'Service temporarily unavailable.', 'Retry after a short delay.'],
            ].map(([status, code, desc, resolution]) => (
              <tr key={status + code}>
                <td style={tdStyle}><code>{status}</code></td>
                <td style={tdStyle}><code>{code}</code></td>
                <td style={tdStyle}>{desc}</td>
                <td style={tdStyle}>{resolution}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="error-format">Error Response Format</h2>
        <p>v1 (TomTom Maps) error response:</p>
        <pre style={{ background: 'var(--s1)', padding: 12, borderRadius: 6, fontSize: '0.8125rem', overflowX: 'auto' }}>
{`{
  "formatVersion": "0.0.12",
  "error": {
    "description": "No route found."
  }
}`}
        </pre>
        <Callout type="info" title="v2 and v3 (Orbis Maps) error format">
          <pre style={{ background: 'var(--bg)', padding: 10, borderRadius: 4, fontSize: '0.75rem', margin: 0 }}>
{`{
  "detailedError": {
    "code": "BAD_REQUEST",
    "message": "Invalid route planning locations"
  }
}`}
          </pre>
        </Callout>
      </div>
    </div>
  );
}
