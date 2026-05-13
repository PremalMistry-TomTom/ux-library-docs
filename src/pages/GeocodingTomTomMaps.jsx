import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const tdStyle = { padding: '8px 12px', border: '1px solid var(--border)', fontSize: '0.8125rem', verticalAlign: 'top' };
const thStyle = { ...tdStyle, background: 'var(--s1)', fontWeight: 600 };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' };

export default function GeocodingTomTomMaps({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Geocoding API v1 — TomTom Maps</h1>
        <PageActions pageId="geocoding-tomtom-maps" pageTitle="Geocoding API v1 — TomTom Maps" />
      </div>

      <p className="quick-answer">
        The Geocoding API converts addresses (such as "109 Park Row, New York, United States") into
        geographic coordinates (e.g., lat: 40.71226, lon: −74.00207). It is designed for machine-to-machine
        interaction and handles incomplete, unformatted, or misspelled addresses. Service version: 2,
        served at <code>/search/2/geocode/</code>.
      </p>

      <Callout type="info" title="When to use Geocoding vs Search">
        Use the <strong>Geocoding API</strong> when you have a full or partial address and need coordinates.
        For human-facing search with live typing, use{' '}
        <button className="inline-link" style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
          onClick={() => onNavigate('search-tomtom-maps', 'search-api')}>Fuzzy Search</button>{' '}
        instead — it returns better results with fewer characters typed.
      </Callout>

      <div className="zone">
        <h2 className="sh" id="overview">Overview</h2>
        <p>
          The Geocoding API does not return Points of Interest (POIs). It returns address components,
          corresponding geographic coordinates, and a complete formatted address. Responses are available
          in JSON or XML format.
        </p>
        <p>Common use cases:</p>
        <ul style={{ lineHeight: 1.8 }}>
          <li>Get coordinates for delivery or pickup location resolution.</li>
          <li>Address validation and verification.</li>
          <li>Data cleaning and enhancement.</li>
          <li>Geospatial analysis.</li>
          <li>Get boundaries and geometries.</li>
          <li>Resolve address issues in automated systems.</li>
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
        <h2 className="sh" id="endpoints">Endpoints</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Endpoint</th>
              <th style={thStyle}>Path</th>
              <th style={thStyle}>Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Geocode', '/search/2/geocode/{query}.json', 'Use when you have a full or partial address as a single string. The query is a path parameter.'],
              ['Structured Geocode', '/search/2/structuredGeocode.json', 'Use when address data has already been split into fields: streetNumber, streetName, municipality, postalCode, country, etc.'],
            ].map(([ep, path, desc]) => (
              <tr key={ep}>
                <td style={tdStyle}><strong>{ep}</strong></td>
                <td style={tdStyle}><code>{path}</code></td>
                <td style={tdStyle}>{desc}</td>
              </tr>
            ))}
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
              ['query', 'string (required)', 'The address string to geocode (path parameter).'],
              ['language', 'string', 'IETF BCP 47 language tag for the response language (e.g., en-US).'],
              ['limit', 'integer', 'Maximum number of results to return (1–100).'],
              ['offset', 'integer', 'Starting offset for paginating through results.'],
              ['countrySet', 'string', 'Comma-separated list of ISO country codes to restrict the search.'],
              ['lat / lon', 'float', 'Coordinates to bias the search toward a specific location.'],
              ['radius', 'integer', 'Search radius in metres around the lat/lon point.'],
              ['topLeft / btmRight', 'string', 'Bounding box to restrict the search area.'],
              ['view', 'string', 'Geopolitical view (e.g., Unified, AR, IL, MA).'],
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
              onClick={() => onNavigate('geocoding-orbis-maps', 'geocoding-api')}>Geocoding API — Orbis Maps</button>
          </li>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('geocoding-migration', 'geocoding-api')}>Migration Guide</button>
          </li>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('geocoding-error-codes', 'geocoding-api')}>Error Codes</button>
          </li>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('geocoding-coverage', 'geocoding-api')}>Market Coverage</button>
          </li>
        </ul>
      </div>
    </div>
  );
}
