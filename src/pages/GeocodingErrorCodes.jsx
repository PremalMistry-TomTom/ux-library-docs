import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const tdStyle = { padding: '8px 12px', border: '1px solid var(--border)', fontSize: '0.8125rem', verticalAlign: 'top' };
const thStyle = { ...tdStyle, background: 'var(--s1)', fontWeight: 600 };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' };

export default function GeocodingErrorCodes({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Geocoding API — Error Codes</h1>
        <PageActions pageId="geocoding-error-codes" pageTitle="Geocoding API — Error Codes" />
      </div>

      <p className="quick-answer">
        The Geocoding API returns standard HTTP status codes. This page documents the HTTP status codes,
        associated error codes, descriptions, and recommended resolutions.
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
              ['200 OK', '—', 'Request was successful. Results are in the response body.', 'No action needed.'],
              ['400 Bad Request', 'INVALID_PARAMETERS', 'One or more parameters are invalid or malformed.', 'Check parameter names and values. Ensure the query string is properly URL-encoded.'],
              ['400 Bad Request', 'MISSING_QUERY', 'The query string is empty or missing.', 'Provide a valid non-empty address string.'],
              ['400 Bad Request', 'INVALID_COUNTRY_SET', 'One or more country codes in countrySet are invalid.', 'Use valid ISO 3166-1 alpha-2 or alpha-3 codes.'],
              ['400 Bad Request', 'INVALID_LANGUAGE', 'The language tag is not a valid IETF BCP 47 tag.', 'Use a valid language tag such as en-US, de-DE, or fr-FR.'],
              ['400 Bad Request', 'MISSING_ATTRIBUTES', '(Orbis v2 only) The Attributes header is absent.', 'Add the Attributes request header with the desired response fields (e.g., Attributes: results).'],
              ['401 Unauthorized', 'UNAUTHORIZED', 'The API key is missing, invalid, or has expired.', 'Include a valid API key via the key query parameter or TomTom-Api-Key header.'],
              ['403 Forbidden', 'FORBIDDEN', 'The API key does not have permission to access this endpoint.', 'Enable the Geocoding API for your API key on my.tomtom.com.'],
              ['404 Not Found', 'NOT_FOUND', 'The endpoint path or resource was not found.', 'Verify the endpoint URL is correct and the query is not empty.'],
              ['429 Too Many Requests', 'QUOTA_EXCEEDED', 'Request rate or daily quota exceeded.', 'Reduce request rate or upgrade your plan. Implement exponential backoff retry logic.'],
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
        <p>TomTom Maps error response:</p>
        <pre style={{ background: 'var(--s1)', padding: 12, borderRadius: 6, fontSize: '0.8125rem', overflowX: 'auto' }}>
{`{
  "httpStatusCode": 400,
  "message": "Missing required parameter.",
  "detailedError": {
    "code": "MISSING_QUERY",
    "message": "Query parameter is empty."
  }
}`}
        </pre>
        <Callout type="info" title="Orbis Maps error format">
          <pre style={{ background: 'var(--bg)', padding: 10, borderRadius: 4, fontSize: '0.75rem', margin: 0 }}>
{`{
  "detailedError": {
    "code": "BAD_REQUEST",
    "message": "Invalid parameters"
  }
}`}
          </pre>
        </Callout>
      </div>
    </div>
  );
}
