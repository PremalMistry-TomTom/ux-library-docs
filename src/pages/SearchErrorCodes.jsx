import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const tdStyle = { padding: '8px 12px', border: '1px solid var(--border)', fontSize: '0.8125rem', verticalAlign: 'top' };
const thStyle = { ...tdStyle, background: 'var(--s1)', fontWeight: 600 };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' };

export default function SearchErrorCodes({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Search API — Error Codes</h1>
        <PageActions pageId="search-error-codes" pageTitle="Search API — Error Codes" />
      </div>

      <p className="quick-answer">
        The Search API returns standard HTTP status codes. This page documents the possible HTTP
        status codes, their meanings, and recommended resolution steps.
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
              ['200 OK', '—', 'Request was successful. Results are returned in the response body.', 'No action needed.'],
              ['400 Bad Request', 'INVALID_PARAMETERS', 'One or more request parameters are invalid or malformed.', 'Check the request parameters. Ensure required parameters are present and correctly formatted.'],
              ['400 Bad Request', 'MISSING_QUERY', 'The query parameter is missing or empty.', 'Provide a non-empty query string in the request path.'],
              ['400 Bad Request', 'INVALID_COUNTRY_SET', 'The countrySet parameter contains an invalid ISO country code.', 'Use valid ISO 3166-1 alpha-2 or alpha-3 country codes.'],
              ['400 Bad Request', 'INVALID_GEOMETRY', 'The geometry provided in a Geometry Search or Filter request is malformed.', 'Check the geometry format. GeoJSON must be valid, and coordinates must be in longitude, latitude order.'],
              ['400 Bad Request', 'INVALID_LANGUAGE', 'The language tag is not a valid IETF BCP 47 tag.', 'Use a valid IETF BCP 47 language tag such as en-US or de-DE.'],
              ['401 Unauthorized', 'UNAUTHORIZED', 'The API key is missing, invalid, or has expired.', 'Include a valid API key in the key query parameter.'],
              ['403 Forbidden', 'FORBIDDEN', 'The API key does not have permission to access this endpoint.', 'Ensure the API key is enabled for the Search API on your account.'],
              ['404 Not Found', 'NOT_FOUND', 'The requested resource or entity was not found (e.g., entityId in Place by ID).', 'Verify the entityId or endpoint path is correct.'],
              ['429 Too Many Requests', 'QUOTA_EXCEEDED', 'The request rate or daily quota for the API key has been exceeded.', 'Reduce request frequency. Consider upgrading your plan or implementing backoff retry logic.'],
              ['500 Internal Server Error', 'INTERNAL_ERROR', 'An unexpected server-side error occurred.', 'Retry the request. If the error persists, contact TomTom support.'],
              ['503 Service Unavailable', 'SERVICE_UNAVAILABLE', 'The service is temporarily unavailable.', 'Retry after a short delay. Monitor the TomTom status page for outage information.'],
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
        <p>When an error occurs, the API returns a JSON body with details:</p>
        <pre style={{ background: 'var(--s1)', padding: 12, borderRadius: 6, fontSize: '0.8125rem', overflowX: 'auto' }}>
{`{
  "httpStatusCode": 400,
  "message": "One or more parameters were invalid.",
  "detailedError": {
    "code": "INVALID_PARAMETERS",
    "message": "Parameter 'countrySet' has an invalid value."
  }
}`}
        </pre>
        <Callout type="info" title="Orbis Maps error format">
          On the Orbis Maps platform, errors are returned in the following structure:
          <pre style={{ marginTop: 8, background: 'var(--bg)', padding: 10, borderRadius: 4, fontSize: '0.75rem' }}>
{`{
  "detailedError": {
    "code": "BAD_REQUEST",
    "message": "Invalid parameters"
  }
}`}
          </pre>
        </Callout>
      </div>

      <div className="zone">
        <h2 className="sh" id="see-also">See Also</h2>
        <ul style={{ lineHeight: 1.8 }}>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('search-tomtom-maps', 'search-api')}>Search API — TomTom Maps</button>
          </li>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('search-orbis-maps', 'search-api')}>Search API — Orbis Maps</button>
          </li>
        </ul>
      </div>
    </div>
  );
}
