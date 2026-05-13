import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const codeStyle = {
  background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 12,
  padding: '16px 20px', fontSize: '0.8125rem', lineHeight: 1.7,
  overflowX: 'auto', color: 'var(--black)', fontFamily: 'var(--font-mono)',
  margin: 0,
};

const CODE_STRUCTURED = `curl "https://api.tomtom.com/search/2/structuredGeocode.json\\
  ?key=YOUR_API_KEY\\
  &streetName=De%20Ruijterkade\\
  &streetNumber=154\\
  &postalCode=1011%20AC\\
  &municipality=Amsterdam\\
  &countryCode=NL"`;

const CODE_PARTIAL = `# Partial structured geocode — city + country is enough for a municipality result
curl "https://api.tomtom.com/search/2/structuredGeocode.json\\
  ?key=YOUR_API_KEY\\
  &municipality=Amsterdam\\
  &countryCode=NL"`;

const CODE_US_EXAMPLE = `# US address with state subdivision
curl "https://api.tomtom.com/search/2/structuredGeocode.json\\
  ?key=YOUR_API_KEY\\
  &streetNumber=1600\\
  &streetName=Pennsylvania%20Ave%20NW\\
  &municipality=Washington\\
  &countrySubdivision=DC\\
  &postalCode=20500\\
  &countryCode=US"`;

const CODE_RESPONSE = `{
  "summary": { "numResults": 1, "totalResults": 1 },
  "results": [
    {
      "type": "Point Address",
      "matchConfidence": { "score": 1 },
      "address": {
        "streetNumber": "154",
        "streetName": "De Ruijterkade",
        "municipality": "Amsterdam",
        "postalCode": "1011",
        "extendedPostalCode": "1011 AC",
        "countryCode": "NL",
        "freeformAddress": "De Ruijterkade 154, 1011 AC Amsterdam"
      },
      "position": { "lat": 52.37727, "lon": 4.90943 }
    }
  ]
}`;

export default function GeocodingGuideStructured({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Guide: Structured Geocoding</h1>
        <PageActions pageId="geocoding-guide-structured" pageTitle="Guide: Structured Geocoding" />
      </div>
      <p className="quick-answer">
        Use the Structured Geocode endpoint when your address components are already parsed
        into separate fields — it delivers more precise results than a freeform query string.
      </p>

      {/* 1. Overview */}
      <div className="zone">
        <h2 className="sh" id="overview">What you'll learn</h2>
        <ul style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
          <li>When to prefer structured over freeform geocoding</li>
          <li>All available address component parameters</li>
          <li>Partial structured queries</li>
          <li>Country-specific field usage (US states, UK postcodes)</li>
        </ul>
      </div>

      {/* 2. Freeform vs. structured */}
      <div className="zone">
        <h2 className="sh" id="when-to-use">Freeform vs. structured geocode</h2>
        <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: '1fr 1fr' }}>
          {[
            {
              title: 'Freeform /geocode/{query}',
              desc: 'Pass the full address as one URL-encoded string. Best when address is already a single text field, typos are common, or format varies by country.',
            },
            {
              title: 'Structured /structuredGeocode',
              desc: 'Pass each component as a separate query parameter. Best when address is stored in separate fields in your database and you want the highest match accuracy.',
            },
          ].map(b => (
            <div key={b.title} style={{
              padding: '1rem', background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 12,
            }}>
              <code style={{ display: 'block', fontSize: '0.75rem', color: 'var(--brand)', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)' }}>{b.title}</code>
              <div style={{ fontSize: '0.8125rem', color: 'var(--mid)', lineHeight: 1.5 }}>{b.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Full structured example */}
      <div className="zone">
        <h2 className="sh" id="full-example">Full structured example</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          The endpoint is <code>/search/2/structuredGeocode.json</code>. Pass address fields
          as query parameters — <code>countryCode</code> (ISO 3166-1 alpha-2) is required;
          all other fields are optional but improve accuracy:
        </p>
        <pre style={codeStyle}>{CODE_STRUCTURED}</pre>
        <p style={{ fontSize: '0.8125rem', color: 'var(--mid)', marginTop: '1rem', marginBottom: '0.5rem' }}>
          Sample response:
        </p>
        <pre style={codeStyle}>{CODE_RESPONSE}</pre>
      </div>

      {/* 4. Parameter reference */}
      <div className="zone">
        <h2 className="sh" id="parameters">Address component parameters</h2>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {[
            { param: 'countryCode', required: true, desc: 'ISO 3166-1 alpha-2 country code (e.g. NL, US, GB, DE). Required.' },
            { param: 'streetNumber', required: false, desc: 'House or building number.' },
            { param: 'streetName', required: false, desc: 'Street name without house number.' },
            { param: 'crossStreet', required: false, desc: 'Cross street name for intersection searches.' },
            { param: 'municipality', required: false, desc: 'City or town name.' },
            { param: 'municipalitySubdivision', required: false, desc: 'Borough, district, or neighbourhood within a city.' },
            { param: 'countryTertiarySubdivision', required: false, desc: 'Third-level administrative subdivision (varies by country).' },
            { param: 'countrySecondarySubdivision', required: false, desc: 'Second-level subdivision — e.g. county in the US.' },
            { param: 'countrySubdivision', required: false, desc: 'First-level subdivision — e.g. state (US), province (CA), county (GB).' },
            { param: 'postalCode', required: false, desc: 'Postal or ZIP code.' },
          ].map(({ param, required, desc }) => (
            <div key={param} style={{
              display: 'grid', gridTemplateColumns: '220px 60px 1fr', gap: '0.75rem',
              padding: '0.5rem 0.875rem', background: 'var(--s1)',
              border: '1px solid var(--border)', borderRadius: '10px', alignItems: 'start',
            }}>
              <code style={{ fontSize: '0.75rem', color: 'var(--brand)', fontFamily: 'var(--font-mono)' }}>{param}</code>
              <span style={{
                fontSize: '0.6875rem', fontWeight: 700, color: required ? '#15803d' : 'var(--muted)',
                textTransform: 'uppercase', letterSpacing: '0.03em',
              }}>{required ? 'required' : 'optional'}</span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text)' }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Partial structured */}
      <div className="zone">
        <h2 className="sh" id="partial">Partial structured queries</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          You don't need all fields. Structured geocoding is tolerant of incomplete data —
          a city-level query returns a municipality result with a lower confidence score:
        </p>
        <pre style={codeStyle}>{CODE_PARTIAL}</pre>
      </div>

      {/* 6. US example */}
      <div className="zone">
        <h2 className="sh" id="country-specific">Country-specific fields</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          For US addresses, use <code>countrySubdivision</code> for the state abbreviation
          (e.g. DC, CA, NY). For UK addresses, use <code>postalCode</code> with the full
          postcode (e.g. EC1A 1BB):
        </p>
        <pre style={codeStyle}>{CODE_US_EXAMPLE}</pre>
      </div>

      {/* 7. Pitfalls */}
      <div className="zone">
        <Callout type="warn" title="Common pitfalls">
          <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.8 }}>
            <li>Omitting <code>countryCode</code> — it is the only required parameter; requests without it will fail.</li>
            <li>Putting the full address in <code>streetName</code> — use <code>streetNumber</code> separately for better accuracy.</li>
            <li>Not URL-encoding field values — spaces and special characters must be percent-encoded.</li>
            <li>Using freeform geocode when components are already parsed — structured gives better accuracy.</li>
          </ul>
        </Callout>
      </div>

      {/* 8. Next steps */}
      <div className="zone">
        <h2 className="sh" id="next-steps">Next steps</h2>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="page-action-btn" onClick={() => onNavigate?.('structured-geocode', 'geocoding-api')}>
            Structured Geocode reference
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('geocoding-guide-accuracy', 'geocoding-api')}>
            Guide: Improving accuracy
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('geocoding-guide-batch', 'geocoding-api')}>
            Guide: Batch geocoding
          </button>
        </div>
      </div>
    </div>
  );
}
