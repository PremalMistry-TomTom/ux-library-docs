import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const tdStyle = { padding: '8px 12px', border: '1px solid var(--border)', fontSize: '0.8125rem', verticalAlign: 'top' };
const thStyle = { ...tdStyle, background: 'var(--s1)', fontWeight: 600 };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' };

export default function GeocodingOrbisMaps({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Geocoding API — Orbis Maps</h1>
        <PageActions pageId="geocoding-orbis-maps" pageTitle="Geocoding API — Orbis Maps" />
      </div>

      <p className="quick-answer">
        The Geocoding API on TomTom Orbis Maps converts addresses into geographic coordinates using
        an Orbis-native base path. Two service versions are available: v1 (Public Preview) and
        v2 (Public Preview). Both require the <code>TomTom-Api-Version</code> header and
        use the <code>Attributes</code> header for response field selection (required in v2).
      </p>

      <Callout type="warn" title="Public Preview">
        Both Orbis Maps Geocoding versions are in <strong>Public Preview</strong>. Review the
        migration guide before updating production integrations.
      </Callout>

      <div className="zone">
        <h2 className="sh" id="versions">Version Comparison</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Aspect</th>
              <th style={thStyle}>Orbis v1</th>
              <th style={thStyle}>Orbis v2</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Base path', '/maps/orbis/places/geocode/...', '/maps/orbis/places/geocode/...'],
              ['TomTom-Api-Version header', 'Required (value: 1)', 'Required (value: 2)'],
              ['TomTom-Api-Key header', 'Not required', 'Required'],
              ['Attributes header', 'Not required', 'Required — specifies response fields'],
              ['Structured Geocode', 'Not supported', 'Supported'],
              ['Query parameter', 'Path parameter (e.g., geocode/{query}.json)', 'Query parameter (?query=Amsterdam)'],
              ['Response format', 'JSON or XML', 'JSON only (application/json)'],
              ['Geopolitical views', 'Unified, AR, IL, MA', 'Unified, AR, IL, MA'],
            ].map(([aspect, v1, v2]) => (
              <tr key={aspect}>
                <td style={tdStyle}><strong>{aspect}</strong></td>
                <td style={tdStyle}>{v1}</td>
                <td style={tdStyle}>{v2}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
              <td style={tdStyle}>TomTom Maps (v1)</td>
              <td style={tdStyle}><code>https://api.tomtom.com/search/2/geocode/</code></td>
            </tr>
            <tr>
              <td style={tdStyle}>Orbis Maps (v1 + v2)</td>
              <td style={tdStyle}><code>https://api.tomtom.com/maps/orbis/places/geocode/</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="attributes">Attributes Header (v2 only)</h2>
        <p>
          In Orbis v2, the <code>Attributes</code> request header is <strong>required</strong> and
          specifies which response fields to return using dot-notation. Use the full path
          <code>results</code> to get all fields, or specify individual fields such as
          <code>results.title</code> for just the formatted address.
        </p>
        <pre style={{ background: 'var(--s1)', padding: 12, borderRadius: 6, fontSize: '0.8125rem', overflowX: 'auto' }}>
{`GET https://api.tomtom.com/maps/orbis/places/geocode?query=Amsterdam
Headers:
  TomTom-Api-Version: 2
  TomTom-Api-Key: {Your_API_Key}
  Attributes: results.title,results.position`}
        </pre>
      </div>

      <div className="zone">
        <h2 className="sh" id="key-changes">Key Changes in v2</h2>
        <ul style={{ lineHeight: 1.8 }}>
          <li>
            <strong>Query as a query parameter:</strong> In v1, the query is a path parameter
            (<code>/geocode/Amsterdam.json</code>). In v2, it is a query parameter
            (<code>/geocode?query=Amsterdam</code>).
          </li>
          <li>
            <strong>API Key in header:</strong> Use the <code>TomTom-Api-Key</code> header instead of
            the <code>key</code> query parameter.
          </li>
          <li>
            <strong>Response format:</strong> Only <code>application/json</code> is supported. XML and
            JSONP are removed.
          </li>
          <li>
            <strong>Attributes header required:</strong> Consumers must specify which response fields
            they want. This enables more efficient responses.
          </li>
        </ul>
      </div>

      <div className="zone">
        <h2 className="sh" id="see-also">See Also</h2>
        <ul style={{ lineHeight: 1.8 }}>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('geocoding-tomtom-maps', 'geocoding-api')}>Geocoding API — TomTom Maps</button>
          </li>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('geocoding-migration', 'geocoding-api')}>Migration Guide</button>
          </li>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('geocoding-error-codes', 'geocoding-api')}>Error Codes</button>
          </li>
        </ul>
      </div>
    </div>
  );
}
