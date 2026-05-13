import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const tdStyle = { padding: '8px 12px', border: '1px solid var(--border)', fontSize: '0.8125rem', verticalAlign: 'top' };
const thStyle = { ...tdStyle, background: 'var(--s1)', fontWeight: 600 };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' };

export default function EVErrorCodes({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>EV Charging API — Error Codes</h1>
        <PageActions pageId="ev-error-codes" pageTitle="EV Charging API — Error Codes" />
      </div>

      <p className="quick-answer">
        The EV Charging Stations Availability API returns standard HTTP status codes. This page documents
        the possible codes, their meanings, and recommended resolution steps.
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
              ['200 OK', '—', 'Request was successful. Availability data is returned.', 'No action needed.'],
              ['400 Bad Request', 'INVALID_PARAMETERS', 'One or more request parameters are invalid.', 'Check that the chargingAvailability (station ID) is a valid entityId, and that connectorSet values are from the supported list.'],
              ['400 Bad Request', 'MISSING_STATION_ID', 'The chargingAvailability parameter is missing.', 'Provide the entityId of the charging station.'],
              ['400 Bad Request', 'INVALID_CONNECTOR_TYPE', 'One or more connector type values are not supported.', 'Use only values from the Supported Connector Types list.'],
              ['401 Unauthorized', 'UNAUTHORIZED', 'The API key is missing or invalid.', 'Include a valid API key in the key query parameter.'],
              ['403 Forbidden', 'FORBIDDEN', 'The API key does not have access to the EV Charging API.', 'Enable the EV Charging Stations Availability API for your key.'],
              ['404 Not Found', 'STATION_NOT_FOUND', 'The specified charging station ID was not found.', 'Verify the entityId using the Search API (category set 7309) to find valid station IDs.'],
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
        <pre style={{ background: 'var(--s1)', padding: 12, borderRadius: 6, fontSize: '0.8125rem', overflowX: 'auto' }}>
{`{
  "httpStatusCode": 400,
  "message": "Bad request",
  "detailedError": {
    "code": "INVALID_PARAMETERS",
    "message": "The 'connectorSet' parameter contains an invalid value."
  }
}`}
        </pre>
      </div>
    </div>
  );
}
