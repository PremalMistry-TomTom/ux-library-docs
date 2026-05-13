import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const codeStyle = {
  background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 12,
  padding: '16px 20px', fontSize: '0.8125rem', lineHeight: 1.7,
  overflowX: 'auto', color: 'var(--black)', fontFamily: 'var(--font-mono)',
  margin: 0,
};

const CODE_GEOBIAS = `# Geo-bias the geocoder to a region
curl "https://api.tomtom.com/search/2/geocode/De%20Ruijterkade%20154%2C%201011%20AC%2C%20Amsterdam.json\\
  ?key=YOUR_API_KEY\\
  &lat=52.3773&lon=4.9084"`;

const CODE_RADIUS = `# Hard-restrict to within 1000m of lat/lon
curl "https://api.tomtom.com/search/2/geocode/De%20Ruijterkade%20154.json\\
  ?key=YOUR_API_KEY\\
  &lat=52.3773&lon=4.9084\\
  &radius=1000"`;

const CODE_COUNTRY_RESTRICT = `# Restrict to Netherlands only
curl "https://api.tomtom.com/search/2/geocode/De%20Ruijterkade%20154.json\\
  ?key=YOUR_API_KEY\\
  &countrySet=NL"`;

const CODE_IDXSET = `# Geocode: point addresses and streets only (no POI)
curl "https://api.tomtom.com/search/2/geocode/De%20Ruijterkade%20154.json\\
  ?key=YOUR_API_KEY\\
  &idxSet=PAD,Str,Xstr,Geo,Addr"`;

const CODE_ENTITY_TYPE = `# Only return PostalCodeArea results for a postcode query
curl "https://api.tomtom.com/search/2/geocode/EC1A%201BB.json\\
  ?key=YOUR_API_KEY\\
  &entityTypeSet=PostalCodeArea\\
  &countrySet=GB"`;

const CODE_CONFIDENCE = `{
  "results": [
    {
      "type": "Point Address",
      "score": 13.2504415512,
      "matchConfidence": { "score": 1 },
      "address": { "freeformAddress": "De Ruijterkade 154, 1011 AC Amsterdam" },
      "position": { "lat": 52.37727, "lon": 4.90943 }
    }
  ]
}`;

export default function GeocodingGuideAccuracy({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Guide: Improving Geocoding Accuracy</h1>
        <PageActions pageId="geocoding-guide-accuracy" pageTitle="Guide: Improving Geocoding Accuracy" />
      </div>
      <p className="quick-answer">
        Learn how to use geo-biasing, country restrictions, index selection, and entity type
        filtering to get the most accurate geocoding results from the TomTom Geocoding API.
      </p>

      {/* 1. Overview */}
      <div className="zone">
        <h2 className="sh" id="overview">What you'll learn</h2>
        <ul style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
          <li>When to use freeform vs. structured geocoding</li>
          <li>Geo-biasing with <code>lat/lon</code> and hard-restricting with <code>radius</code></li>
          <li>Narrowing by country with <code>countrySet</code></li>
          <li>Selecting indexes with <code>idxSet</code></li>
          <li>Filtering entity types with <code>entityTypeSet</code></li>
          <li>Reading <code>matchConfidence.score</code> to validate results</li>
        </ul>
      </div>

      {/* 2. When to use Geocoding vs. Search */}
      <div className="zone">
        <h2 className="sh" id="when-to-use">When to use the Geocoding API</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          The Geocoding API is optimised for batch processing of complete, unambiguous postal
          addresses — not for interactive user input:
        </p>
        <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: '1fr 1fr' }}>
          {[
            { title: 'Use Geocoding API', items: ['Fleet/logistics: bulk address→coordinate conversion', 'Food delivery: last-mile pickup/drop-off', 'Ride hailing: passenger pick-up and drop-off', 'Data analysis: spatial analysis from address data', 'Address verification and data enrichment'] },
            { title: 'Use Fuzzy Search instead', items: ['Interactive search boxes (letter-by-letter input)', 'Typeahead / autocomplete UX', 'When the user might enter a POI name, not an address', 'When queries are ambiguous or short fragments'] },
          ].map(b => (
            <div key={b.title} style={{
              padding: '1rem', background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 12,
            }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--black)', marginBottom: '0.5rem' }}>{b.title}</div>
              <ul style={{ fontSize: '0.8125rem', color: 'var(--mid)', lineHeight: 1.7, paddingLeft: '1.125rem', margin: 0 }}>
                {b.items.map(i => <li key={i}>{i}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Geo-bias */}
      <div className="zone">
        <h2 className="sh" id="geobias">Geo-biasing with lat/lon</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          When your application knows the general area of the address (e.g. the user's city),
          provide <code>lat/lon</code> to bias results toward that area. This is non-restrictive
          — for very common street names it will find the nearby instance:
        </p>
        <pre style={codeStyle}>{CODE_GEOBIAS}</pre>
      </div>

      {/* 4. Radius */}
      <div className="zone">
        <h2 className="sh" id="radius">Hard-restricting with radius</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          Add <code>radius</code> (metres) to make the geo-bias a hard restriction.
          Results outside the circle are excluded:
        </p>
        <pre style={codeStyle}>{CODE_RADIUS}</pre>
      </div>

      {/* 5. Country restrict */}
      <div className="zone">
        <h2 className="sh" id="country">Restricting by country</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          Use <code>countrySet</code> with ISO 3166 alpha-2 codes to restrict results to
          specific countries. This avoids cross-border matches for addresses with common
          street names:
        </p>
        <pre style={codeStyle}>{CODE_COUNTRY_RESTRICT}</pre>
      </div>

      {/* 6. idxSet */}
      <div className="zone">
        <h2 className="sh" id="idxset">Index selection with idxSet</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          The Geocoding API supports the same <code>idxSet</code> parameter as Fuzzy Search,
          but does not include the <code>POI</code> index (POIs are excluded by default).
          Reduce noise by specifying only the indexes relevant to your use case:
        </p>
        <pre style={codeStyle}>{CODE_IDXSET}</pre>
      </div>

      {/* 7. entityTypeSet */}
      <div className="zone">
        <h2 className="sh" id="entity-type">Filtering with entityTypeSet</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          Use <code>entityTypeSet</code> to return only a specific type of geographic entity.
          This is especially useful for postal code resolution:
        </p>
        <pre style={codeStyle}>{CODE_ENTITY_TYPE}</pre>
        <div style={{ display: 'grid', gap: '0.5rem', marginTop: '0.75rem' }}>
          {[
            'Country', 'CountrySubdivision', 'CountrySecondarySubdivision',
            'CountryTertiarySubdivision', 'Municipality', 'MunicipalitySubdivision',
            'Neighbourhood', 'PostalCodeArea',
          ].map(t => (
            <div key={t} style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '0.375rem 0.875rem', background: 'var(--s1)',
              border: '1px solid var(--border)', borderRadius: '8px',
            }}>
              <code style={{ fontSize: '0.75rem', color: 'var(--brand)', fontFamily: 'var(--font-mono)' }}>{t}</code>
            </div>
          ))}
        </div>
      </div>

      {/* 8. matchConfidence */}
      <div className="zone">
        <h2 className="sh" id="confidence">Using matchConfidence.score</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          Each result includes a <code>matchConfidence.score</code> in the range [0, 1].
          A score of 1 is a perfect match; lower scores indicate typo corrections or
          partial matches. Use this to flag uncertain results for manual review:
        </p>
        <pre style={codeStyle}>{CODE_CONFIDENCE}</pre>
        <Callout type="info">
          For batch geocoding, consider rejecting or flagging results with
          <code> matchConfidence.score &lt; 0.7</code> for human review.
        </Callout>
      </div>

      {/* 9. Pitfalls */}
      <div className="zone">
        <Callout type="warn" title="Common pitfalls">
          <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.8 }}>
            <li>Using Geocoding API for interactive search — use Fuzzy Search with <code>typeahead=true</code> instead.</li>
            <li>Not URL-encoding the query — spaces and special characters must be percent-encoded.</li>
            <li>Ignoring <code>matchConfidence.score</code> — blindly trusting low-confidence results causes data quality issues.</li>
            <li>Using <code>radius</code> without <code>lat/lon</code> — has no effect.</li>
          </ul>
        </Callout>
      </div>

      {/* 10. Next steps */}
      <div className="zone">
        <h2 className="sh" id="next-steps">Next steps</h2>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="page-action-btn" onClick={() => onNavigate?.('geocode', 'geocoding-api')}>
            Geocode reference
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('structured-geocode', 'geocoding-api')}>
            Structured Geocode
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('geocoding-guide-batch', 'geocoding-api')}>
            Guide: Batch geocoding
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('geocoding-guide-structured', 'geocoding-api')}>
            Guide: Structured Geocode
          </button>
        </div>
      </div>
    </div>
  );
}
