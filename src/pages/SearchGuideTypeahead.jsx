import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const codeStyle = {
  background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 12,
  padding: '16px 20px', fontSize: '0.8125rem', lineHeight: 1.7,
  overflowX: 'auto', color: 'var(--black)', fontFamily: 'var(--font-mono)',
  margin: 0,
};

const CODE_TYPEAHEAD_REQUEST = `// Call on every keystroke after 2+ characters
const query = encodeURIComponent(userInput);
const res = await fetch(
  \`https://api.tomtom.com/search/2/search/\${query}.json\` +
  \`?key=\${API_KEY}\` +
  \`&typeahead=true\` +
  \`&limit=5\` +
  \`&language=en-US\` +
  \`&lat=\${userLat}&lon=\${userLon}\`
);
const data = await res.json();`;

const CODE_AUTOCOMPLETE = `// Autocomplete recognises entity types inside the query
const res = await fetch(
  \`https://api.tomtom.com/search/2/autocomplete/\${query}.json\` +
  \`?key=\${API_KEY}\` +
  \`&language=en-US\` +
  \`&limit=5\` +
  \`&lat=\${userLat}&lon=\${userLon}\`
);`;

const CODE_DEBOUNCE = `// Debounce — only fire when user pauses 200ms
let debounceTimer;
function onInput(e) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    if (e.target.value.length >= 2) {
      fetchSuggestions(e.target.value);
    }
  }, 200);
}`;

const CODE_ENTITY_RESPONSE = `// POI_NEAR_ENTITY response — present to user for selection
{
  "summary": { "queryType": "POI_NEAR_ENTITY" },
  "results": [
    {
      "type": "Geography",
      "entityType": "Municipality",
      "poi": null,
      "address": { "municipality": "San Francisco", "country": "United States" },
      "position": { "lat": 37.77493, "lon": -122.41942 }
    }
  ]
}`;

export default function SearchGuideTypeahead({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Guide: Typeahead Search UX</h1>
        <PageActions pageId="search-guide-typeahead" pageTitle="Guide: Typeahead Search UX" />
      </div>
      <p className="quick-answer">
        Learn how to build a fast, responsive as-you-type search experience using the
        TomTom Search API's <code>typeahead</code> parameter and the Autocomplete endpoint.
      </p>

      {/* 1. Overview */}
      <div className="zone">
        <h2 className="sh" id="overview">What you'll learn</h2>
        <ul style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
          <li>The difference between Fuzzy Search with <code>typeahead=true</code> and the Autocomplete endpoint</li>
          <li>How to debounce requests to reduce API calls</li>
          <li>Handling the <code>POI_NEAR_ENTITY</code> query type for two-stage search</li>
          <li>Parameter tuning for live search boxes</li>
        </ul>
      </div>

      {/* 2. Two approaches */}
      <div className="zone">
        <h2 className="sh" id="approaches">Two approaches to typeahead</h2>
        <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: '1fr 1fr' }}>
          {[
            {
              title: 'Fuzzy Search + typeahead=true',
              when: 'Best for: address bars, destination search',
              desc: 'Returns full result objects (POI, address, geography) ranked by relevance. Set typeahead=true to enable prefix matching on the last word of the query.',
            },
            {
              title: 'Autocomplete endpoint',
              when: 'Best for: structured search boxes, disambiguation',
              desc: 'Recognises named entities inside the query and suggests query terms rather than full results. Produces a two-stage UX: suggest → refine.',
            },
          ].map(a => (
            <div key={a.title} style={{
              padding: '1rem', background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 12,
            }}>
              <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--black)', marginBottom: '0.25rem' }}>{a.title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--brand)', marginBottom: '0.5rem' }}>{a.when}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--mid)', lineHeight: 1.5 }}>{a.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Fuzzy + typeahead */}
      <div className="zone">
        <h2 className="sh" id="fuzzy-typeahead">Fuzzy Search with typeahead</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          Add <code>typeahead=true</code> to a standard Fuzzy Search call. The API matches
          the last word as a prefix rather than a complete token. Include a <code>lat/lon</code>
          anchor and set <code>limit=5</code> for a compact suggestion list:
        </p>
        <pre style={codeStyle}>{CODE_TYPEAHEAD_REQUEST}</pre>
      </div>

      {/* 4. Debounce */}
      <div className="zone">
        <h2 className="sh" id="debounce">Debouncing requests</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          Fire a new request only when the user pauses typing — 150–250 ms is the recommended
          window. Cancel in-flight requests if a new keystroke arrives:
        </p>
        <pre style={codeStyle}>{CODE_DEBOUNCE}</pre>
        <Callout type="info">
          Do not fire requests for queries shorter than 2 characters. For very fast typists,
          also cancel the previous fetch if a new one starts (use an AbortController).
        </Callout>
      </div>

      {/* 5. Autocomplete */}
      <div className="zone">
        <h2 className="sh" id="autocomplete">Autocomplete endpoint</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          The Autocomplete API at <code>/search/2/autocomplete/{'{query}'}.json</code>
          recognises entities (brands, cities, POI categories) and returns query segment
          terms rather than full result objects:
        </p>
        <pre style={codeStyle}>{CODE_AUTOCOMPLETE}</pre>
      </div>

      {/* 6. POI_NEAR_ENTITY */}
      <div className="zone">
        <h2 className="sh" id="poi-near-entity">Handling POI_NEAR_ENTITY responses</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          When the user types something like "coffee near san jose", the API may return a
          <code> POI_NEAR_ENTITY</code> queryType. This means the entity (San Jose) needs to
          be confirmed before POI results can be returned. Present these to the user as
          disambiguation options, then fire a second query with the selected entity:
        </p>
        <pre style={codeStyle}>{CODE_ENTITY_RESPONSE}</pre>
        <Callout type="warn" title="Two-stage flow">
          A <code>POI_NEAR_ENTITY</code> result is not a final answer — it is a geography or
          entity the user should confirm. Display it in the suggestion list and, when selected,
          fire a second Fuzzy Search query with the confirmed lat/lon.
        </Callout>
      </div>

      {/* 7. Parameter reference */}
      <div className="zone">
        <h2 className="sh" id="parameters">Parameter reference</h2>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {[
            { param: 'typeahead', values: 'true / false', desc: 'Enable prefix matching on the last query word. Default: false.' },
            { param: 'limit', values: '1–100', desc: 'Number of suggestions to return. Keep 5–10 for inline dropdowns.' },
            { param: 'language', values: 'IETF BCP 47', desc: 'Response language for POI names and addresses (e.g. en-US, de-DE).' },
            { param: 'lat / lon', values: 'float', desc: 'Geo-bias anchor point. Critical for relevant local results.' },
            { param: 'countrySet', values: 'ISO 3166', desc: 'Restrict to one or more countries (e.g. countrySet=US,CA).' },
            { param: 'idxSet', values: 'POI,PAD,Str,Geo,Xstr,Addr', desc: 'Limit which index types are queried. Default queries all.' },
          ].map(({ param, values, desc }) => (
            <div key={param} style={{
              display: 'grid', gridTemplateColumns: '160px 120px 1fr', gap: '0.75rem',
              padding: '0.625rem 0.875rem', background: 'var(--s1)',
              border: '1px solid var(--border)', borderRadius: '10px', alignItems: 'start',
            }}>
              <code style={{ fontSize: '0.75rem', color: 'var(--brand)', fontFamily: 'var(--font-mono)' }}>{param}</code>
              <span style={{ fontSize: '0.75rem', color: 'var(--mid)', fontFamily: 'var(--font-mono)' }}>{values}</span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text)' }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 8. Pitfalls */}
      <div className="zone">
        <Callout type="warn" title="Common pitfalls">
          <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.8 }}>
            <li>Not debouncing — sends dozens of requests per keystroke and degrades performance.</li>
            <li>Omitting <code>lat/lon</code> — results are globally ranked and won't feel local.</li>
            <li>Showing <code>POI_NEAR_ENTITY</code> results as final answers — always fire a second query on selection.</li>
            <li>Querying on 0 or 1 character — returns noisy results and wastes quota.</li>
          </ul>
        </Callout>
      </div>

      {/* 9. Next steps */}
      <div className="zone">
        <h2 className="sh" id="next-steps">Next steps</h2>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="page-action-btn" onClick={() => onNavigate?.('search-autocomplete', 'search-api')}>
            Autocomplete reference
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('search-fuzzy', 'search-api')}>
            Fuzzy Search reference
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('search-guide-fuzzy-tips', 'search-api')}>
            Guide: Fuzzy Search tips
          </button>
        </div>
      </div>
    </div>
  );
}
