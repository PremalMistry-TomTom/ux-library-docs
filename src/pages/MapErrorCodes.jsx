import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const tdStyle = { padding: '8px 12px', border: '1px solid var(--border)', fontSize: '0.8125rem', verticalAlign: 'top' };
const thStyle = { ...tdStyle, background: 'var(--s1)', fontWeight: 600 };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' };

export default function MapErrorCodes({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Map Display API — Error Codes</h1>
        <PageActions pageId="map-error-codes" pageTitle="Map Display API — Error Codes" />
      </div>

      <p className="quick-answer">
        The Map Display API returns standard HTTP status codes for both tile and metadata endpoints.
        Tile endpoints typically return the HTTP code without a body. JSON endpoints return a structured
        error body.
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
              ['200 OK', '—', 'Request was successful. Tile or data is returned.', 'No action needed.'],
              ['400 Bad Request', 'INVALID_PARAMETERS', 'One or more parameters are invalid.', 'Check zoom level (0–22), tile coordinates (x, y), layer name, and style name.'],
              ['400 Bad Request', 'INVALID_TILE_POSITION', '(Orbis v2) Invalid zoom/x/y tile position arguments.', 'Ensure tile coordinates are within valid bounds for the zoom level.'],
              ['400 Bad Request', 'INVALID_ZOOM', 'The requested zoom level is out of range.', 'Raster: 0–22. Satellite: 0–19. Hillshade: 0–13.'],
              ['401 Unauthorized', 'UNAUTHORIZED', 'The API key is missing or invalid.', 'Provide a valid API key via the key query parameter or TomTom-Api-Key header.'],
              ['403 Forbidden', 'FORBIDDEN', 'The API key does not have access to this endpoint.', 'Enable the Map Display API for your key on my.tomtom.com.'],
              ['404 Not Found', 'NOT_FOUND', 'The requested tile or resource does not exist.', 'Check that the layer, style, and tile coordinates are valid.'],
              ['429 Too Many Requests', 'QUOTA_EXCEEDED', 'Request rate or daily quota exceeded.', 'Reduce request frequency or upgrade your plan.'],
              ['500 Internal Server Error', 'INTERNAL_ERROR', 'An unexpected server-side error occurred.', 'Retry the request. Contact support if the error persists.'],
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
        <p>Tile requests return HTTP error codes without a body. Static image and metadata endpoints return:</p>
        <pre style={{ background: 'var(--s1)', padding: 12, borderRadius: 6, fontSize: '0.8125rem', overflowX: 'auto' }}>
{`{
  "httpStatusCode": 400,
  "message": "Bad request."
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
