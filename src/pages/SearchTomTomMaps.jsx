import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const tdStyle = { padding: '8px 12px', border: '1px solid var(--border)', fontSize: '0.8125rem', verticalAlign: 'top' };
const thStyle = { ...tdStyle, background: 'var(--s1)', fontWeight: 600 };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' };

export default function SearchTomTomMaps({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Search API v1 — TomTom Maps</h1>
        <PageActions pageId="search-tomtom-maps" pageTitle="Search API v1 — TomTom Maps" />
      </div>

      <p className="quick-answer">
        The Search API (service version 2, served at <code>/search/2/</code>) is a RESTful API for
        single-line fuzzy search over addresses and Points of Interest. It assigns latitude/longitude
        coordinates to addresses, cross streets, geographic features, and POIs.
      </p>

      <Callout type="info" title="Platform">
        This version runs on the <strong>TomTom Maps</strong> platform.
        For the Orbis Maps version with JMESPath response filtering, see{' '}
        <button className="inline-link" style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
          onClick={() => onNavigate('search-orbis-maps', 'search-api')}>Search API — Orbis Maps</button>.
      </Callout>

      <div className="zone">
        <h2 className="sh" id="overview">Overview</h2>
        <p>
          The Search API contains multiple services designed for different search scenarios.
          Each service exposes one or more endpoints accessible via RESTful HTTP requests.
          Authentication is via the <code>key</code> query parameter.
        </p>
        <ul style={{ lineHeight: 1.8 }}>
          <li>Fuzzy search with optional typeahead and configurable fuzziness level</li>
          <li>POI search and category search</li>
          <li>Geometry search with point/radius and bounding box</li>
          <li>Mature ranking with Landmarks support</li>
          <li>Along-route search</li>
          <li>Filter service for custom and third-party POIs</li>
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
          Authentication: append <code>?key=&#123;Your_API_Key&#125;</code> to every request.
          Register at <a href="https://my.tomtom.com/" style={{ color: 'var(--brand)' }}>my.tomtom.com</a> to obtain a key.
        </p>
      </div>

      <div className="zone">
        <h2 className="sh" id="services">Services and Endpoints</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Service</th>
              <th style={thStyle}>Endpoint path</th>
              <th style={thStyle}>Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Search', '/search/2/search/{query}.json', 'Fuzzy single-line search for addresses and POIs, with optional geometry restriction.'],
              ['Autocomplete', '/search/2/autocomplete/{query}.json', 'Recognises entities in an input query and offers them as query terms for a more meaningful search call.'],
              ['Category Search', '/search/2/poiSearch/{query}.json', 'Search for POIs by category code or category name.'],
              ['Nearby Search', '/search/2/nearbySearch/.json', 'Search for POIs near a given coordinate.'],
              ['Geometry Search', '/search/2/geometrySearch/{query}.json', 'Search within a set of polygons or circles.'],
              ['Along Route Search', '/search/2/searchAlongRoute/{query}.json', 'Search for POIs along a given route, within a specified detour time.'],
              ['Filters', '/search/2/filter', 'Filter custom or third-party POIs within a geometry.'],
              ['Additional Data', '/search/2/additionalData.json', 'Returns sets of coordinates representing the outline of a city, country, or land area.'],
              ['Place by ID', '/search/2/place.json', 'Retrieves detailed information about a place by its entityId.'],
              ['POI Categories', '/search/2/poiCategories.json', 'Returns a full list of POI categories and sub-categories with translations and synonyms.'],
              ['Abbreviated Index Values', '/search/2/abbreviatedIndexValues.json', 'Returns abbreviated index value codes used in search results.'],
            ].map(([svc, path, desc]) => (
              <tr key={svc}>
                <td style={tdStyle}>{svc}</td>
                <td style={tdStyle}><code>{path}</code></td>
                <td style={tdStyle}>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="common-params">Common Parameters</h2>
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
              ['query', 'string (required)', 'The search query string (passed as a path segment).'],
              ['language', 'string', 'Language of the response. Uses IETF BCP 47 language tags (e.g., en-US).'],
              ['limit', 'integer', 'Maximum number of results to return (1–100; default varies by endpoint).'],
              ['offset', 'integer', 'Offset for pagination of results.'],
              ['countrySet', 'string', 'Comma-separated list of ISO 3166-1 alpha-2 or alpha-3 country codes to restrict search.'],
              ['lat / lon', 'float', 'Latitude and longitude for biasing results toward a specific location.'],
              ['radius', 'integer', 'Search radius in metres around the lat/lon point.'],
              ['topLeft / btmRight', 'string', 'Bounding box coordinates (top-left and bottom-right corner).'],
              ['idxSet', 'string', 'Comma-separated list of index abbreviations to include in search (e.g., Addr, POI, Geo).'],
              ['typeahead', 'boolean', 'If true, treats the query as partial input and runs predictive search.'],
              ['fuzzyLevel', 'integer', 'Fuzziness level (1–4). Level 1 = exact match; higher levels allow more misspellings.'],
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
        <h2 className="sh" id="use-cases">Common Use Cases</h2>
        <ul style={{ lineHeight: 1.8 }}>
          <li>Search for an address, a POI, or a combination of both.</li>
          <li>Search for an area — for example, "Chinatown".</li>
          <li>Search in the direction you are heading.</li>
          <li>Search for a POI near a POI or address — e.g., "Coffee near XYZ company" or "ATMs near AMC Theater".</li>
          <li>Return polygon outlines for cities or countries using Additional Data.</li>
        </ul>
      </div>

      <div className="zone">
        <h2 className="sh" id="see-also">See Also</h2>
        <ul style={{ lineHeight: 1.8 }}>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('search-orbis-maps', 'search-api')}>Search API — Orbis Maps (Public Preview)</button>
          </li>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('search-migration', 'search-api')}>Migration Guide — v1 to v2</button>
          </li>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('search-error-codes', 'search-api')}>Error Codes</button>
          </li>
          <li>
            <button style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              onClick={() => onNavigate('search-coverage', 'search-api')}>Market Coverage</button>
          </li>
        </ul>
      </div>
    </div>
  );
}
