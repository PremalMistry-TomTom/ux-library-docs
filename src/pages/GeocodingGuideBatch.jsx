import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const codeStyle = {
  background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 12,
  padding: '16px 20px', fontSize: '0.8125rem', lineHeight: 1.7,
  overflowX: 'auto', color: 'var(--black)', fontFamily: 'var(--font-mono)',
  margin: 0,
};

const CODE_SINGLE = `# Single geocode request
curl "https://api.tomtom.com/search/2/geocode/\\
  De%20Ruijterkade%20154%2C%201011%20AC%2C%20Amsterdam.json\\
  ?key=YOUR_API_KEY\\
  &countrySet=NL"`;

const CODE_BATCH_JS = `// Batch geocoding with concurrency control (Node.js)
const addresses = [
  "De Ruijterkade 154, 1011 AC, Amsterdam",
  "Rue de la Paix 10, 75002 Paris",
  "1600 Pennsylvania Ave NW, Washington, DC 20500",
  // ... up to thousands of addresses
];

const CONCURRENCY = 5; // max parallel requests
const API_KEY = 'YOUR_API_KEY';

async function geocodeAddress(address) {
  const q = encodeURIComponent(address);
  const res = await fetch(
    \`https://api.tomtom.com/search/2/geocode/\${q}.json?key=\${API_KEY}\`
  );
  const data = await res.json();
  const result = data.results?.[0];
  return {
    input: address,
    lat: result?.position?.lat ?? null,
    lon: result?.position?.lon ?? null,
    confidence: result?.matchConfidence?.score ?? 0,
    matchType: result?.type ?? 'no match',
  };
}

// Process in batches of CONCURRENCY
async function batchGeocode(addresses) {
  const results = [];
  for (let i = 0; i < addresses.length; i += CONCURRENCY) {
    const batch = addresses.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(batch.map(geocodeAddress));
    results.push(...batchResults);
  }
  return results;
}

const coords = await batchGeocode(addresses);
console.log(coords.filter(r => r.confidence < 0.7)); // Flag low confidence`;

const CODE_RETRY = `// Retry with exponential backoff on 429 (rate limit)
async function geocodeWithRetry(address, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    const res = await fetch(/* ... */);
    if (res.status === 429) {
      const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
      await new Promise(r => setTimeout(r, delay));
      continue;
    }
    return await res.json();
  }
  throw new Error('Max retries exceeded');
}`;

const CODE_RESULT = `// Typical geocode result structure to parse
{
  "type": "Point Address",        // High confidence result type
  "matchConfidence": { "score": 1 },
  "address": {
    "streetNumber": "154",
    "streetName": "De Ruijterkade",
    "municipality": "Amsterdam",
    "postalCode": "1011",
    "countryCode": "NL",
    "freeformAddress": "De Ruijterkade 154, 1011 AC Amsterdam"
  },
  "position": { "lat": 52.37727, "lon": 4.90943 }
}`;

export default function GeocodingGuideBatch({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Guide: Batch Geocoding</h1>
        <PageActions pageId="geocoding-guide-batch" pageTitle="Guide: Batch Geocoding" />
      </div>
      <p className="quick-answer">
        Process thousands of addresses in parallel using concurrent geocode requests —
        with concurrency controls, retry logic, and confidence-based quality filtering.
      </p>

      {/* 1. Overview */}
      <div className="zone">
        <h2 className="sh" id="overview">What you'll learn</h2>
        <ul style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
          <li>How to geocode addresses in parallel with concurrency control</li>
          <li>Handling rate limits with exponential backoff</li>
          <li>Filtering low-confidence results for quality assurance</li>
          <li>Parsing the result object to extract coordinates and match type</li>
        </ul>
      </div>

      {/* 2. The pattern */}
      <div className="zone">
        <h2 className="sh" id="pattern">The batch geocoding pattern</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          The Geocoding API doesn't have a native bulk endpoint — each address requires its own
          GET request. Process multiple addresses in parallel with a concurrency limit
          (typically 5–10 simultaneous requests) to maximise throughput without exceeding
          rate limits:
        </p>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {[
            { step: '1', label: 'Prepare your address list', desc: 'Normalise addresses: remove extra whitespace, correct obvious typos, ensure country is included if possible.' },
            { step: '2', label: 'Process in parallel batches', desc: 'Use Promise.all() for CONCURRENCY addresses at a time. 5 is a safe starting point; adjust based on your quota.' },
            { step: '3', label: 'Validate confidence scores', desc: 'Check matchConfidence.score on each result. Flag scores below 0.7 for manual review.' },
            { step: '4', label: 'Handle 429 with retry', desc: 'If the rate limit is hit, back off exponentially before retrying.' },
          ].map(({ step, label, desc }) => (
            <div key={step} style={{
              display: 'grid', gridTemplateColumns: '36px 1fr', gap: '0.75rem',
              padding: '0.75rem 0.875rem', background: 'var(--s1)',
              border: '1px solid var(--border)', borderRadius: '10px', alignItems: 'start',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', background: 'var(--brand)',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
              }}>{step}</div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--black)' }}>{label}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--mid)', marginTop: '0.25rem' }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Single request */}
      <div className="zone">
        <h2 className="sh" id="single-request">Single geocode request</h2>
        <pre style={codeStyle}>{CODE_SINGLE}</pre>
      </div>

      {/* 4. Batch implementation */}
      <div className="zone">
        <h2 className="sh" id="batch-implementation">Batch implementation</h2>
        <pre style={codeStyle}>{CODE_BATCH_JS}</pre>
      </div>

      {/* 5. Retry */}
      <div className="zone">
        <h2 className="sh" id="retry">Handling rate limits</h2>
        <pre style={codeStyle}>{CODE_RETRY}</pre>
        <Callout type="info">
          HTTP 429 responses include a <code>Retry-After</code> header. Use that value
          (in seconds) as the initial backoff delay if available. For HTTP 5xx errors,
          retry up to 3 times with exponential backoff.
        </Callout>
      </div>

      {/* 6. Result parsing */}
      <div className="zone">
        <h2 className="sh" id="result-parsing">Parsing the result</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          The key fields for batch geocoding are the <code>type</code>, <code>matchConfidence.score</code>,
          <code> position</code>, and <code>address</code> object:
        </p>
        <pre style={codeStyle}>{CODE_RESULT}</pre>
        <div style={{ display: 'grid', gap: '0.5rem', marginTop: '0.75rem' }}>
          {[
            { type: 'Point Address', score: '~1.0', confidence: 'Very high — exact house number match.' },
            { type: 'Address Range', score: '0.7–0.9', confidence: 'High — street-level, interpolated house number.' },
            { type: 'Street', score: '0.5–0.7', confidence: 'Medium — only street matched, no number.' },
            { type: 'Geography', score: '0.3–0.5', confidence: 'Low — city or region level only.' },
          ].map(r => (
            <div key={r.type} style={{
              display: 'grid', gridTemplateColumns: '160px 80px 1fr', gap: '0.75rem',
              padding: '0.5rem 0.875rem', background: 'var(--s1)',
              border: '1px solid var(--border)', borderRadius: '10px', alignItems: 'start',
            }}>
              <code style={{ fontSize: '0.75rem', color: 'var(--brand)', fontFamily: 'var(--font-mono)' }}>{r.type}</code>
              <span style={{ fontSize: '0.75rem', color: 'var(--mid)' }}>{r.score}</span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text)' }}>{r.confidence}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Pitfalls */}
      <div className="zone">
        <Callout type="warn" title="Common pitfalls">
          <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.8 }}>
            <li>Too-high concurrency — start at 5 and increase gradually while monitoring for 429s.</li>
            <li>Not handling empty results — always check <code>data.results?.length</code> before accessing <code>results[0]</code>.</li>
            <li>Ignoring <code>matchConfidence.score</code> — Geography-level matches are often wrong for precise use cases like delivery addresses.</li>
            <li>Not URL-encoding the query — spaces and characters like comma must be percent-encoded.</li>
          </ul>
        </Callout>
      </div>

      {/* 8. Next steps */}
      <div className="zone">
        <h2 className="sh" id="next-steps">Next steps</h2>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="page-action-btn" onClick={() => onNavigate?.('geocode', 'geocoding-api')}>
            Geocode reference
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('geocoding-guide-accuracy', 'geocoding-api')}>
            Guide: Improving accuracy
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('geocoding-guide-structured', 'geocoding-api')}>
            Guide: Structured Geocode
          </button>
        </div>
      </div>
    </div>
  );
}
