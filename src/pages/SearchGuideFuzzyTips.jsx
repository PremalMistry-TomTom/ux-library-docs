import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const codeStyle = {
  background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 12,
  padding: '16px 20px', fontSize: '0.8125rem', lineHeight: 1.7,
  overflowX: 'auto', color: 'var(--black)', fontFamily: 'var(--font-mono)',
  margin: 0,
};

const CODE_GEOBIAS = `# Geo-bias — finds instances of pizza near the lat/lon
curl "https://api.tomtom.com/search/2/search/pizza.json\\
  ?key=YOUR_API_KEY\\
  &lat=37.8085&lon=-122.4239"`;

const CODE_RADIUS = `# Restrict results to within 1000 metres of the lat/lon
curl "https://api.tomtom.com/search/2/search/pizza.json\\
  ?key=YOUR_API_KEY\\
  &lat=37.8085&lon=-122.4239\\
  &radius=1000"`;

const CODE_IDXSET = `# Query only POI and Point Address indexes
curl "https://api.tomtom.com/search/2/search/pizza.json\\
  ?key=YOUR_API_KEY\\
  &lat=37.8085&lon=-122.4239\\
  &idxSet=POI,PAD"`;

const CODE_COUNTRY = `# Restrict to Croatia, Cyprus, Czech Republic, Denmark
curl "https://api.tomtom.com/search/2/search/pizza.json\\
  ?key=YOUR_API_KEY\\
  &countrySet=HR,CY,CZ,DK"`;

const CODE_PAGING = `# Page results 21–30 (offset=20, limit=10)
curl "https://api.tomtom.com/search/2/search/pizza.xml\\
  ?key=YOUR_API_KEY\\
  &lat=37.8085&lon=-122.4239\\
  &limit=10&ofs=20"`;

const CODE_CATEGORY = `# Pure category search — important tourist attractions
curl "https://api.tomtom.com/search/2/categorySearch/important tourist monument.json\\
  ?key=YOUR_API_KEY\\
  &lat=37.8085&lon=-122.4239"`;

const CODE_RESPONSE_SUMMARY = `{
  "summary": {
    "query": "TomTom",
    "queryType": "NON_NEAR",
    "queryTime": 38,
    "numResults": 10,
    "offset": 0,
    "totalResults": 51,
    "fuzzyLevel": 1
  }
}`;

export default function SearchGuideFuzzyTips({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Guide: Fuzzy Search Tips</h1>
        <PageActions pageId="search-guide-fuzzy-tips" pageTitle="Guide: Fuzzy Search Tips" />
      </div>
      <p className="quick-answer">
        Practical tips and best practices for getting the most relevant results from the
        TomTom Fuzzy Search endpoint — geo-biasing, index selection, pagination, and
        understanding the response summary.
      </p>

      {/* 1. Overview */}
      <div className="zone">
        <h2 className="sh" id="overview">What you'll learn</h2>
        <ul style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
          <li>Using <code>lat/lon</code> to geo-bias results to a user's location</li>
          <li>Adding <code>radius</code> to restrict results to a fixed area</li>
          <li>Selecting specific index types with <code>idxSet</code></li>
          <li>Restricting to a subset of countries with <code>countrySet</code></li>
          <li>Paginating results with <code>limit</code> and <code>ofs</code></li>
          <li>Reading the response summary to understand result quality</li>
        </ul>
      </div>

      {/* 2. Geo-biasing */}
      <div className="zone">
        <h2 className="sh" id="geobias">Geo-biasing with lat/lon</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          Always pass a <code>lat/lon</code> pair to bias results toward the user's location.
          This is a <em>non-restrictive</em> bias — for common queries it finds nearby instances,
          but very rare or unique results may still appear from farther away:
        </p>
        <pre style={codeStyle}>{CODE_GEOBIAS}</pre>
      </div>

      {/* 3. Radius */}
      <div className="zone">
        <h2 className="sh" id="radius">Using radius</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          If geo-biasing alone isn't strong enough, add <code>radius</code> (in metres) to
          restrict results to a circular area around the <code>lat/lon</code>:
        </p>
        <pre style={codeStyle}>{CODE_RADIUS}</pre>
        <Callout type="info">
          <code>radius</code> only works when <code>lat</code> and <code>lon</code> are
          also provided. It converts the non-restrictive bias into a hard geographic filter.
        </Callout>
      </div>

      {/* 4. idxSet */}
      <div className="zone">
        <h2 className="sh" id="idxset">Selecting indexes with idxSet</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          The <code>idxSet</code> parameter controls which data indexes are queried.
          Limiting to a subset improves performance and result relevance:
        </p>
        <pre style={codeStyle}>{CODE_IDXSET}</pre>
        <div style={{ display: 'grid', gap: '0.5rem', marginTop: '0.75rem' }}>
          {[
            { id: 'POI', desc: 'Points of interest — restaurants, hotels, attractions, etc.' },
            { id: 'PAD', desc: 'Point Addresses — exact house/building addresses.' },
            { id: 'Str', desc: 'Streets — street-level results without a house number.' },
            { id: 'Geo', desc: 'Geographies — cities, regions, countries, neighbourhoods.' },
            { id: 'Xstr', desc: 'Cross Streets / intersections.' },
            { id: 'Addr', desc: 'Address range interpolation (when PAD is unavailable).' },
            { id: 'EPP', desc: 'Extended Postal Codes — highly accurate postal code search (UK, Ireland).' },
          ].map(({ id, desc }) => (
            <div key={id} style={{
              display: 'grid', gridTemplateColumns: '60px 1fr', gap: '0.75rem',
              padding: '0.5rem 0.875rem', background: 'var(--s1)',
              border: '1px solid var(--border)', borderRadius: '10px', alignItems: 'center',
            }}>
              <code style={{ fontSize: '0.75rem', color: 'var(--brand)', fontFamily: 'var(--font-mono)' }}>{id}</code>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text)' }}>{desc}</span>
            </div>
          ))}
        </div>
        <Callout type="info">
          Do not include spaces between comma-separated values in <code>idxSet</code>.
          Correct: <code>idxSet=POI,PAD,Str</code>. Incorrect: <code>idxSet=POI, PAD, Str</code>.
        </Callout>
      </div>

      {/* 5. countrySet */}
      <div className="zone">
        <h2 className="sh" id="countryset">Restricting to countries</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          Use <code>countrySet</code> to restrict results to specific countries using
          ISO 3166 alpha-2 or alpha-3 codes:
        </p>
        <pre style={codeStyle}>{CODE_COUNTRY}</pre>
      </div>

      {/* 6. Pagination */}
      <div className="zone">
        <h2 className="sh" id="pagination">Pagination and infinite scroll</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          Use <code>limit</code> and <code>ofs</code> (offset) to page through results.
          The response summary <code>totalResults</code> tells you how many hits exist in total:
        </p>
        <pre style={codeStyle}>{CODE_PAGING}</pre>
      </div>

      {/* 7. Category search */}
      <div className="zone">
        <h2 className="sh" id="category-search">Pure category search</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          For category-specific discovery, use the <code>/categorySearch/</code> endpoint.
          It searches only the POI index by category name or ID:
        </p>
        <pre style={codeStyle}>{CODE_CATEGORY}</pre>
      </div>

      {/* 8. Response summary */}
      <div className="zone">
        <h2 className="sh" id="response-summary">Reading the response summary</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          Every Fuzzy Search response includes a <code>summary</code> object. Key fields:
        </p>
        <pre style={codeStyle}>{CODE_RESPONSE_SUMMARY}</pre>
        <div style={{ display: 'grid', gap: '0.5rem', marginTop: '0.75rem' }}>
          {[
            { field: 'queryType', desc: 'NON_NEAR = straightforward result; POI_NEAR_GEO / POI_NEAR_POI = near-entity query.' },
            { field: 'fuzzyLevel', desc: 'Range 1–4. 1 = most accurate (exact match). 4 = most lenient (heavy spell-correction). Default max is 2.' },
            { field: 'totalResults', desc: 'Total matching documents in the database (not just this page).' },
            { field: 'numResults', desc: 'Number of results in this response page.' },
            { field: 'offset', desc: 'Current page offset. Use for pagination.' },
          ].map(({ field, desc }) => (
            <div key={field} style={{
              display: 'grid', gridTemplateColumns: '160px 1fr', gap: '0.75rem',
              padding: '0.5rem 0.875rem', background: 'var(--s1)',
              border: '1px solid var(--border)', borderRadius: '10px', alignItems: 'start',
            }}>
              <code style={{ fontSize: '0.75rem', color: 'var(--brand)', fontFamily: 'var(--font-mono)' }}>{field}</code>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text)' }}>{desc}</span>
            </div>
          ))}
        </div>
        <Callout type="info">
          Most queries default to <code>maxFuzzyLevel=2</code> for performance. Override with
          <code> maxFuzzyLevel=3</code> or <code>maxFuzzyLevel=4</code> if you need to
          catch heavily misspelled queries.
        </Callout>
      </div>

      {/* 9. Pitfalls */}
      <div className="zone">
        <Callout type="warn" title="Common pitfalls">
          <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.8 }}>
            <li>Using <code>radius</code> without <code>lat/lon</code> — has no effect.</li>
            <li>Spaces in <code>idxSet</code> values — will cause unexpected results or errors.</li>
            <li>Setting <code>maxFuzzyLevel=4</code> for all queries — slows response and returns unusual results.</li>
            <li>Not checking <code>totalResults</code> before showing a "no results" state — you may just be on the wrong page.</li>
          </ul>
        </Callout>
      </div>

      {/* 10. Next steps */}
      <div className="zone">
        <h2 className="sh" id="next-steps">Next steps</h2>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="page-action-btn" onClick={() => onNavigate?.('search-fuzzy', 'search-api')}>
            Fuzzy Search reference
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('search-category', 'search-api')}>
            Category Search
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('search-guide-typeahead', 'search-api')}>
            Guide: Typeahead UX
          </button>
        </div>
      </div>
    </div>
  );
}
