import { lazy, Suspense } from 'react';
import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';

const TryItEmbed = lazy(() => import('../components/demos/TryItEmbed'));

/* ─── Code examples ──────────────────────────────────────────────────────────── */
const CODE_AUTH = `curl "https://api.tomtom.com/search/2/search/pizza.json?key=YOUR_API_KEY"`;

const CODE_FIRST_SEARCH = `# Fuzzy search for pizza near San Francisco
curl "https://api.tomtom.com/search/2/search/pizza.json\\
  ?key=YOUR_API_KEY\\
  &lat=37.8085\\
  &lon=-122.4239\\
  &limit=5"`;

const CODE_RESPONSE = `{
  "summary": {
    "query": "pizza",
    "queryType": "NON_NEAR",
    "numResults": 5,
    "offset": 0,
    "totalResults": 51,
    "fuzzyLevel": 1
  },
  "results": [
    {
      "type": "POI",
      "id": "840DR5SS91",
      "score": 4.0,
      "poi": {
        "name": "Pizzeria Delfina",
        "categories": ["pizza restaurant"]
      },
      "address": {
        "freeformAddress": "3611 18th St, San Francisco, CA 94110",
        "municipality": "San Francisco",
        "countryCode": "US"
      },
      "position": { "lat": 37.76218, "lon": -122.42641 },
      "dataSources": {
        "chargingAvailability": null
      }
    }
  ]
}`;

export default function SearchQuickstart({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Quick Start</h1>
        <PageActions pageId="search-quickstart" pageTitle="Search API Quick Start" />
      </div>
      <p className="quick-answer">
        Make your first Search API request in minutes. Authenticate with an API key, call
        Fuzzy Search with a keyword and location, and get back ranked POI and address results.
      </p>

      {/* ── 1. Authentication ── */}
      <div className="zone">
        <h2 className="sh" id="authentication">Authentication</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
          All Search API requests require an API key passed as the <code>key</code> query
          parameter. Get one free at the{' '}
          <a href="https://developer.tomtom.com" target="_blank" rel="noreferrer"
            style={{ color: 'var(--brand)' }}>TomTom Developer Portal</a>.
        </p>
        <CodeBlock code={CODE_AUTH} language="bash" />
        <Callout type="info" title="Keep your key secret">
          Never expose your API key in client-side JavaScript. For browser apps, proxy
          requests through your own backend.
        </Callout>
      </div>

      {/* ── 2. Your first search ── */}
      <div className="zone">
        <h2 className="sh" id="first-search">Your first search</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          The example below searches for pizza near San Francisco. Provide <code>lat</code> and{' '}
          <code>lon</code> to geo-bias results toward the user's location — results outside
          the area can still appear.
        </p>

        <Suspense fallback={<div style={{ height: 200, background: 'var(--s1)', borderRadius: 12 }} />}>
          <TryItEmbed demoId="fuzzy-search" />
        </Suspense>

        <p style={{ color: 'var(--mid)', fontSize: '0.8125rem', margin: '1rem 0 0.5rem' }}>
          Equivalent cURL request:
        </p>
        <CodeBlock code={CODE_FIRST_SEARCH} language="bash" />

        <p style={{ color: 'var(--mid)', fontSize: '0.8125rem', margin: '1rem 0 0.5rem' }}>
          Abbreviated response:
        </p>
        <CodeBlock code={CODE_RESPONSE} language="json" />
      </div>

      {/* ── 3. Understanding the response ── */}
      <div className="zone">
        <h2 className="sh" id="response-structure">Understanding the response</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          Every Fuzzy Search response has the same top-level structure:
        </p>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {[
            { key: 'summary', desc: 'Query metadata: original query string, type (NON_NEAR, NEAR, or CITY), result count, offset, and fuzzy match level used.' },
            { key: 'results[]', desc: 'Ordered array of results by relevance score. Index 0 is the best match. Up to 100 results per page via limit.' },
            { key: 'results[0].type', desc: 'Result category: POI (place of interest), Street, Point Address, Cross Street, Geography, or POI_NEAR_ENTITY.' },
            { key: 'results[0].poi', desc: 'Present only on POI results. Contains name, categories, phone, URL, and opening hours.' },
            { key: 'results[0].address', desc: 'Structured address with streetNumber, streetName, municipality, countryCode, and freeformAddress.' },
            { key: 'results[0].position', desc: 'Centroid latitude/longitude of the result as { lat, lon }.' },
            { key: 'results[0].score', desc: 'Relevance score (higher = better match). Used internally; not a distance or confidence value.' },
          ].map(({ key, desc }) => (
            <div key={key} style={{
              display: 'grid', gridTemplateColumns: '220px 1fr', gap: '0.75rem',
              padding: '0.625rem 0.875rem', background: 'var(--s1)',
              border: '1px solid var(--border)', borderRadius: '10px', alignItems: 'start',
            }}>
              <code style={{ fontSize: '0.75rem', color: 'var(--brand)', fontFamily: 'var(--font-mono)' }}>{key}</code>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text)' }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. Version comparison ── */}
      <div className="zone">
        <h2 className="sh" id="version-comparison">Which version should I use?</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          The Search API has two versions on different map data platforms.
        </p>
        <div style={{ display: 'grid', gap: '0.875rem' }}>
          {[
            {
              version: 'v1', label: 'Production', color: '#22c55e',
              platform: 'TomTom Maps', methods: 'GET',
              baseUrl: '/search/2/search/{query}.json',
              summary: 'Stable and production-ready. Use for all new integrations today. Full support for Fuzzy Search, POI Search, Geocoding, Autocomplete, Batch, and EV station search.',
            },
            {
              version: 'v2', label: 'Public Preview', color: '#a78bfa',
              platform: 'Orbis Maps', methods: 'GET',
              baseUrl: '/maps/orbis/search/fuzzySearch',
              summary: 'Next-generation map platform with improved POI data coverage, enhanced category taxonomy, and the new Attributes header for selective field responses.',
            },
          ].map(v => (
            <div key={v.version} style={{
              padding: '1rem 1.125rem', background: 'var(--bg)',
              border: '1px solid var(--border)', borderRadius: '20px',
              display: 'grid', gridTemplateColumns: '56px 1fr', gap: '0.875rem', alignItems: 'start',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  display: 'inline-block', padding: '2px 8px',
                  background: v.color + '22', border: `1px solid ${v.color}66`,
                  borderRadius: '6px', fontSize: '0.6875rem', fontWeight: 700,
                  color: v.color, marginBottom: '0.25rem',
                }}>{v.version}</div>
                <div style={{ fontSize: '0.625rem', color: 'var(--muted)', lineHeight: 1.2 }}>{v.label}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.25rem' }}>{v.summary}</div>
                <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                    <strong style={{ color: 'var(--mid)' }}>Platform:</strong> {v.platform}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                    <strong style={{ color: 'var(--mid)' }}>Methods:</strong> {v.methods}
                  </span>
                  <code style={{ fontSize: '0.6875rem', color: 'var(--mid)', fontFamily: 'var(--font-mono)' }}>{v.baseUrl}</code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. Next steps ── */}
      <div className="zone">
        <h2 className="sh" id="next-steps">Next steps</h2>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="page-action-btn" onClick={() => onNavigate?.('search-fuzzy', 'search-api')}>
            Fuzzy Search reference
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('search-poi', 'search-api')}>
            POI Search
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('search-autocomplete', 'search-api')}>
            Autocomplete
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('search-tomtom-maps', 'search-api')}>
            Search API v1
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('search-orbis-maps', 'search-api')}>
            Search API v2
          </button>
        </div>
      </div>
    </div>
  );
}
