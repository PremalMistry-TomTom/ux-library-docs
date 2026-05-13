import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const tdStyle = { padding: '8px 12px', border: '1px solid var(--border)', fontSize: '0.8125rem', verticalAlign: 'top' };
const thStyle = { ...tdStyle, background: 'var(--s1)', fontWeight: 600 };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' };

export default function TrafficErrorCodes({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Traffic API — Error Codes</h1>
        <PageActions pageId="traffic-error-codes" pageTitle="Traffic API — Error Codes" />
      </div>

      <p className="quick-answer">
        The Traffic API returns standard HTTP status codes. This page documents the codes,
        their meanings, and recommended resolution steps for both the TomTom Maps and Orbis Maps
        versions.
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
              ['200 OK', '—', 'Request was successful.', 'No action needed.'],
              ['400 Bad Request', 'INVALID_PARAMETERS', 'One or more request parameters are invalid.', 'Check all query parameters and path parameters. Ensure zoom levels (0–22), tile coordinates, and bounding boxes are valid.'],
              ['400 Bad Request', 'INVALID_TILE_POSITION', '(Orbis v2) The tile position arguments (zoom/x/y) are invalid.', 'Verify tile coordinates are within valid range for the zoom level.'],
              ['400 Bad Request', 'MISSING_ATTRIBUTES', '(Orbis v2) The Attributes header is required but absent (incident details endpoint).', 'Add the Attributes request header.'],
              ['400 Bad Request', 'INVALID_BBOX', 'The bounding box is malformed or outside valid bounds.', 'Provide a valid bounding box in the format minLon,minLat,maxLon,maxLat.'],
              ['401 Unauthorized', 'UNAUTHORIZED', 'The API key is missing or invalid.', 'Provide a valid API key via the key query parameter or TomTom-Api-Key header.'],
              ['403 Forbidden', 'FORBIDDEN', 'The API key does not have permission to access this endpoint.', 'Ensure the Traffic API is enabled for your key.'],
              ['404 Not Found', 'NOT_FOUND', 'The requested resource or tile does not exist.', 'Check that the endpoint path and tile coordinates are correct.'],
              ['429 Too Many Requests', 'QUOTA_EXCEEDED', 'Request rate or daily quota exceeded.', 'Reduce request frequency or upgrade your API plan.'],
              ['500 Internal Server Error', 'INTERNAL_ERROR', 'An unexpected server-side error occurred.', 'Retry the request. If it persists, contact TomTom support.'],
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
        <p>TomTom Maps — tile endpoints return HTTP error codes without a body. JSON endpoints return:</p>
        <pre style={{ background: 'var(--s1)', padding: 12, borderRadius: 6, fontSize: '0.8125rem', overflowX: 'auto' }}>
{`{
  "httpStatusCode": 400,
  "message": "Bad request"
}`}
        </pre>
        <Callout type="info" title="Orbis Maps error format (v1 and v2)">
          <pre style={{ background: 'var(--bg)', padding: 10, borderRadius: 4, fontSize: '0.75rem', margin: 0 }}>
{`{
  "detailedError": {
    "code": "BAD_REQUEST",
    "message": "Invalid tile position arguments"
  }
}`}
          </pre>
        </Callout>
      </div>
    </div>
  );
}
