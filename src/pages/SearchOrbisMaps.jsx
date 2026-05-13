import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const tdStyle = { padding: '8px 12px', border: '1px solid var(--border)', fontSize: '0.8125rem', verticalAlign: 'top' };
const thStyle = { ...tdStyle, background: 'var(--s1)', fontWeight: 600 };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' };

export default function SearchOrbisMaps({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Search API — Orbis Maps</h1>
        <PageActions pageId="search-orbis-maps" pageTitle="Search API — Orbis Maps" />
      </div>

      <p className="quick-answer">
        The Search API on TomTom Orbis Maps is a RESTful API for single-line fuzzy search over addresses
        and Points of Interest. It exposes the same core capabilities as the TomTom Maps version but
        with an Orbis-native base path, a unified API version mechanism via the
        <code>TomTom-Api-Version</code> header, and support for JMESPath-based response field selection.
      </p>

      <Callout type="warn" title="Public Preview">
        This API is in <strong>Public Preview</strong> on TomTom Orbis Maps. Parameters and responses
        may change before general availability. See the{' '}
        <a href="https://developer.tomtom.com/public-preview" style={{ color: 'var(--brand)' }}>Public Preview</a> page
        for details.
      </Callout>

      <div className="zone">
        <h2 className="sh" id="overview">Overview</h2>
        <p>
          New Orbis Search API endpoints are served under the <code>/maps/orbis/places/</code> prefix.
          The API is powered by TomTom Orbis Maps data and uses a header-based versioning model.
          Both the <code>apiVersion</code> URL parameter and the <code>TomTom-Api-Version</code> header
          are accepted for version negotiation.
        </p>
        <p>Services available on Orbis Maps:</p>
        <ul style={{ lineHeight: 1.8 }}>
          <li>Fuzzy Search with typeahead</li>
          <li>POI Search</li>
          <li>Category Search</li>
          <li>Nearby Search</li>
          <li>Geometry Search</li>
          <li>Along-Route Search</li>
          <li>Autocomplete</li>
          <li>Additional Data</li>
          <li>Place by ID</li>
          <li>POI Categories</li>
          <li>Abbreviated Index Values</li>
        </ul>
        <Callout type="info" title="Not yet available on Orbis Maps">
          Batch Search is not available on Orbis Maps. Use the TomTom Maps version
          (<code>/search/2/batch/</code>) for batched queries. The Filters service is also not
          available in this version.
        </Callout>
      </div>

      <div className="zone">
        <h2 className="sh" id="base-url">Base URL</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Platform</th>
              <th style={thStyle}>Base URL prefix</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>TomTom Maps (v1)</td>
              <td style={tdStyle}><code>https://api.tomtom.com/search/2/</code></td>
            </tr>
            <tr>
              <td style={tdStyle}>Orbis Maps</td>
              <td style={tdStyle}><code>https://api.tomtom.com/maps/orbis/places/</code></td>
            </tr>
          </tbody>
        </table>
        <p style={{ marginTop: 12, color: 'var(--mid)', fontSize: '0.8125rem' }}>
          Geopolitical views currently include only <code>Unified</code>, along with <code>AR</code>,{' '}
          <code>IL</code>, and <code>MA</code> (for Argentina, Israel, and Morocco respectively).
        </p>
      </div>

      <div className="zone">
        <h2 className="sh" id="versioning">Versioning</h2>
        <p>
          Either the <code>apiVersion</code> URL parameter or the <code>TomTom-Api-Version</code> header
          must be present in every request. There are no changes to parameters or responses compared
          to the TomTom Maps version.
        </p>
        <pre style={{ background: 'var(--s1)', padding: 12, borderRadius: 6, fontSize: '0.8125rem', overflowX: 'auto' }}>
{`GET https://api.tomtom.com/maps/orbis/places/search/Amsterdam.json
    ?key={Your_API_Key}
    &apiVersion=1`}
        </pre>
      </div>

      <div className="zone">
        <h2 className="sh" id="services">Services and Endpoint Paths</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Service</th>
              <th style={thStyle}>Orbis endpoint path</th>
              <th style={thStyle}>TomTom Maps equivalent</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Fuzzy Search', '/maps/orbis/places/search/{query}.json', '/search/2/search/{query}.json'],
              ['POI Search', '/maps/orbis/places/poiSearch/{query}.json', '/search/2/poiSearch/{query}.json'],
              ['Category Search', '/maps/orbis/places/categorySearch/{query}.json', '/search/2/categorySearch/{query}.json'],
              ['Nearby Search', '/maps/orbis/places/nearbySearch/.json', '/search/2/nearbySearch/.json'],
              ['Geometry Search', '/maps/orbis/places/geometrySearch/{query}.json', '/search/2/geometrySearch/{query}.json'],
              ['Along-Route Search', '/maps/orbis/places/searchAlongRoute/{query}.json', '/search/2/searchAlongRoute/{query}.json'],
              ['Autocomplete', '/maps/orbis/places/autocomplete/{query}.json', '/search/2/autocomplete/{query}.json'],
              ['Additional Data', '/maps/orbis/places/additionalData.json', '/search/2/additionalData.json'],
              ['Place by ID', '/maps/orbis/places/place.json', '/search/2/place.json'],
              ['POI Categories', '/maps/orbis/places/poiCategories.json', '/search/2/poiCategories.json'],
              ['Abbreviated Index Values', '/maps/orbis/places/abbreviatedIndexValues.json', '/search/2/abbreviatedIndexValues.json'],
            ].map(([svc, orbis, ttm]) => (
              <tr key={svc}>
                <td style={tdStyle}>{svc}</td>
                <td style={tdStyle}><code style={{ fontSize: '0.75rem' }}>{orbis}</code></td>
                <td style={tdStyle}><code style={{ fontSize: '0.75rem', color: 'var(--mid)' }}>{ttm}</code></td>
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
              onClick={() => onNavigate('search-tomtom-maps', 'search-api')}>Search API — TomTom Maps (v1)</button>
          </li>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('search-migration', 'search-api')}>Migration Guide</button>
          </li>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('search-error-codes', 'search-api')}>Error Codes</button>
          </li>
        </ul>
      </div>
    </div>
  );
}
