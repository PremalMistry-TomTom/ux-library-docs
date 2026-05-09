import PageActions from '../components/ui/PageActions';
import { useIlloStyle } from '../context/IlloStyleContext';
import {
  makeThumb,
  L_SearchFuzzy, L_SearchPOI, L_SearchCategory, L_SearchNearby,
  L_SearchAlongRoute, L_SearchAutocomplete, L_BatchSearch, L_POIDetails, L_POIPhotos,
} from '../illustrations/lightVariants';
import {
  IlloSearchFuzzy, IlloSearchPOI, IlloSearchNearby,
  IlloSearchAlongRoute, IlloSearchAutocomplete, IlloPOIDetails, IlloPOIPhotos,
} from './IntroIllustrations';

/* ─── Hero ───────────────────────────────────────────────────────────────────── */
const HeroIllo = makeThumb(IlloSearchFuzzy, L_SearchFuzzy);

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function SearchAPIIntro({ onNavigate }) {
  const { theme: illoTheme, palette: illoPalette } = useIlloStyle();

  const endpoints = [
    {
      Thumb: makeThumb(IlloSearchFuzzy, L_SearchFuzzy),
      method: 'GET',
      title: 'Fuzzy Search',
      desc: 'Unified endpoint accepting free-form text — addresses, POIs, and coordinates resolved in a single query.',
      pageId: 'search-fuzzy',
      tag: 'v2',
    },
    {
      Thumb: makeThumb(IlloSearchPOI, L_SearchPOI),
      method: 'GET',
      title: 'POI Search',
      desc: 'Search exclusively for Points of Interest by name with optional category and brand filters.',
      pageId: 'search-poi',
      tag: 'v2',
    },
    {
      Thumb: makeThumb(null, L_SearchCategory),
      method: 'GET',
      title: 'Category Search',
      desc: 'Find POIs by category type such as restaurants, hospitals, or petrol stations.',
      pageId: 'search-category',
      tag: 'v2',
    },
    {
      Thumb: makeThumb(IlloSearchNearby, L_SearchNearby),
      method: 'GET',
      title: 'Nearby Search',
      desc: 'Discover POIs within a radius around a given lat/lon coordinate without a text query.',
      pageId: 'search-nearby',
      tag: 'v2',
    },
    {
      Thumb: makeThumb(IlloSearchAlongRoute, L_SearchAlongRoute),
      method: 'POST',
      title: 'Along-Route Search',
      desc: 'Find POIs along a route corridor, ranked by deviation from the original path.',
      pageId: 'search-along-route',
      tag: 'v2',
    },
    {
      Thumb: makeThumb(IlloSearchAutocomplete, L_SearchAutocomplete),
      method: 'GET',
      title: 'Autocomplete',
      desc: 'Return type-ahead entity suggestions for partial queries to power instant search UIs.',
      pageId: 'search-autocomplete',
      tag: 'v2',
    },
    {
      Thumb: makeThumb(null, L_BatchSearch),
      method: 'POST',
      title: 'Batch Search',
      desc: 'Execute multiple search queries in a single HTTP request, synchronously or asynchronously.',
      pageId: 'search-batch',
      tag: 'v2',
    },
    {
      Thumb: makeThumb(IlloPOIDetails, L_POIDetails),
      method: 'GET',
      title: 'POI Details',
      desc: 'Retrieve enriched POI data including ratings, price range, opening hours, and contact info.',
      pageId: 'poi-details',
      tag: 'v2',
    },
    {
      Thumb: makeThumb(IlloPOIPhotos, L_POIPhotos),
      method: 'GET',
      title: 'POI Photos',
      desc: 'Fetch photos associated with a POI to display visual content in your app.',
      pageId: 'poi-photos',
      tag: 'v2',
    },
  ];

  const baseUrlRows = [
    {
      label: 'Base URL',
      content: <code style={{ fontSize: '0.875rem', fontFamily: 'monospace', color: 'var(--black)' }}>https://api.tomtom.com/search/2/</code>,
    },
    {
      label: 'Auth',
      content: <span style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>API key via <code>?key={'{'}<em>your-api-key</em>{'}'}</code> query parameter</span>,
    },
    {
      label: 'Version',
      content: <span style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>Service version <strong>2</strong> — stable, globally available</span>,
    },
    {
      label: 'Formats',
      content: <span style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>JSON (default), XML — specified as file extension in the path</span>,
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Search API</h1>
        <PageActions />
      </div>

      <p className="quick-answer">
        The TomTom Search API provides a comprehensive set of endpoints for finding addresses, Points of
        Interest, and places by text query, category, or proximity. It powers fuzzy matching, autocomplete,
        along-route discovery, and batch processing — all backed by TomTom's global map data.
      </p>

      {/* Hero illustration */}
      <div style={{ borderRadius: 20, overflow: 'hidden', height: 200, background: illoPalette.bg, marginBottom: 32 }}>
        <HeroIllo />
      </div>

      {/* Endpoint grid */}
      <div className="zone">
        <h2 className="sh" id="endpoints">Endpoints</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--mid)', margin: '0 0 20px', lineHeight: 1.6 }}>
          All endpoints live under <code>/search/2/</code> and accept an API key as a query parameter.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
          {endpoints.map(({ Thumb, method, title, desc, pageId, tag }) => (
            <div
              key={pageId}
              className="nav-card"
              onClick={() => onNavigate?.(pageId)}
            >
              <div className="nav-card-thumb" style={illoTheme !== 'dark' ? { background: illoPalette.bg, padding: 0 } : undefined}>
                <Thumb />
              </div>
              <div className="nav-card-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: '0.625rem', fontWeight: 700, padding: '2px 6px', borderRadius: 3, background: method === 'GET' ? 'rgba(63,185,80,0.12)' : 'rgba(88,166,255,0.12)', color: method === 'GET' ? '#3fb950' : '#58a6ff', fontFamily: 'monospace', letterSpacing: '0.04em' }}>{method}</span>
                  {tag && <span style={{ fontSize: '0.625rem', padding: '1px 5px', borderRadius: 3, background: 'rgba(34,197,94,0.08)', color: '#22c55e', fontWeight: 600 }}>{tag}</span>}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--black)', marginBottom: 3 }}>{title}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.5 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Base URL table */}
      <div className="zone">
        <h2 className="sh" id="base-url">Base URL &amp; Authentication</h2>
        <div style={{ border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
          {baseUrlRows.map(({ label, content }, i) => (
            <div key={label} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', borderBottom: i < baseUrlRows.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ padding: '10px 14px', background: 'var(--bg)', borderRight: '1px solid var(--border)', fontSize: '0.625rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center' }}>{label}</div>
              <div style={{ padding: '10px 14px' }}>{content}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Getting started */}
      <div className="zone">
        <h2 className="sh" id="getting-started">Getting started</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--mid)', marginBottom: 16, lineHeight: 1.6 }}>
          Make your first fuzzy search request with a single <code>fetch</code> call:
        </p>
        <pre style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', fontSize: '0.8125rem', lineHeight: 1.7, overflowX: 'auto', color: 'var(--black)' }}>{`// Fuzzy Search — find a place by free-form text
const API_KEY = 'your-api-key';
const query   = 'Amsterdam';

const res = await fetch(
  \`https://api.tomtom.com/search/2/search/\${encodeURIComponent(query)}.json\` +
  \`?key=\${API_KEY}&limit=5&countrySet=NL\`
);
const { results } = await res.json();

// Each result contains position, address, and optionally a POI block
results.forEach(r => {
  console.log(r.address.freeformAddress, r.position);
});`}</pre>
      </div>
    </div>
  );
}
