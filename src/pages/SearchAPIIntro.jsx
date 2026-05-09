import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
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

/* ─── Shared helpers ─────────────────────────────────────────────────────────── */
function MethodBadge({ method }) {
  const colors = { GET: '#3fb950', POST: '#58a6ff', DELETE: '#f85149' };
  return (
    <span style={{ fontSize: '0.625rem', fontWeight: 700, padding: '2px 6px', borderRadius: 3, background: `${colors[method]}22`, color: colors[method], fontFamily: 'var(--font-mono, monospace)', letterSpacing: '0.04em' }}>
      {method}
    </span>
  );
}

function EndpointCard({ Illo, title, method = 'GET', path, desc }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', background: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 140, flexShrink: 0, overflow: 'hidden' }}>
        <Illo />
      </div>
      <div style={{ padding: '10px 14px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <MethodBadge method={method} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)' }}>{title}</span>
        </div>
        {desc && <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.55 }}>{desc}</p>}
      </div>
    </div>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────────────────── */
const HeroIllo = makeThumb(IlloSearchFuzzy, L_SearchFuzzy);

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function SearchAPIIntro({ onNavigate }) {
  const { palette } = useIlloStyle();

  const endpoints = [
    {
      Illo: makeThumb(IlloSearchFuzzy, L_SearchFuzzy),
      title: 'Fuzzy Search',
      method: 'GET',
      path: '/search/2/search/{query}.json',
      desc: 'Unified search endpoint accepting free-form text — addresses, POIs, and coordinates in a single query.',
    },
    {
      Illo: makeThumb(IlloSearchPOI, L_SearchPOI),
      title: 'POI Search',
      method: 'GET',
      path: '/search/2/poiSearch/{query}.json',
      desc: 'Search exclusively for Points of Interest by name with optional category and brand filters.',
    },
    {
      Illo: makeThumb(null, L_SearchCategory),
      title: 'Category Search',
      method: 'GET',
      path: '/search/2/categorySearch/{query}.json',
      desc: 'Find POIs by category type such as restaurants, hospitals, or petrol stations.',
    },
    {
      Illo: makeThumb(IlloSearchNearby, L_SearchNearby),
      title: 'Nearby Search',
      method: 'GET',
      path: '/search/2/nearbySearch/.json',
      desc: 'Discover POIs within a radius around a given lat/lon coordinate without a text query.',
    },
    {
      Illo: makeThumb(IlloSearchAlongRoute, L_SearchAlongRoute),
      title: 'Along-Route Search',
      method: 'POST',
      path: '/search/2/searchAlongRoute/{query}.json',
      desc: 'Find POIs along a route corridor, ranked by deviation from the original path.',
    },
    {
      Illo: makeThumb(IlloSearchAutocomplete, L_SearchAutocomplete),
      title: 'Autocomplete',
      method: 'GET',
      path: '/search/2/autocomplete/{query}.json',
      desc: 'Return type-ahead suggestions for partial search queries to power instant search UIs.',
    },
    {
      Illo: makeThumb(null, L_BatchSearch),
      title: 'Batch Search',
      method: 'POST',
      path: '/search/2/batch/sync.json',
      desc: 'Execute multiple search queries in a single HTTP request, synchronously or asynchronously.',
    },
    {
      Illo: makeThumb(IlloPOIDetails, L_POIDetails),
      title: 'POI Details',
      method: 'GET',
      path: '/search/2/poiDetails.json',
      desc: 'Retrieve enriched POI data including ratings, price range, hours, and contact information.',
    },
    {
      Illo: makeThumb(IlloPOIPhotos, L_POIPhotos),
      title: 'POI Photos',
      method: 'GET',
      path: '/search/2/poiPhotos.json',
      desc: 'Fetch photos associated with a POI to display visual content in your app.',
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Search API</h1>
        <PageActions />
      </div>

      <p className="quick-answer">
        The TomTom Search API provides a comprehensive set of endpoints for finding addresses, Points of Interest,
        and places by text query, category, or proximity. It powers fuzzy matching, autocomplete, along-route
        discovery, and batch processing — all backed by TomTom's global map data.
      </p>

      {/* Hero illustration */}
      <div style={{ borderRadius: 20, overflow: 'hidden', height: 200, background: palette.bg, marginBottom: 32 }}>
        <HeroIllo />
      </div>

      {/* Endpoint grid */}
      <div className="zone">
        <h2 className="sh" id="endpoints">Endpoints</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {endpoints.map(ep => (
            <EndpointCard key={ep.title} {...ep} />
          ))}
        </div>
      </div>

      {/* Base URL */}
      <div className="zone">
        <h2 className="sh" id="base-url">Base URL</h2>
        <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, color: 'var(--black)' }}>
          GET https://api.tomtom.com/search/2/search/{'{'}query{'}'}.json?key={'{'}your-api-key{'}'}
        </div>
      </div>

      <Callout type="info" title="Authentication">
        All requests require a valid API key passed as <code>key={'{'}your-api-key{'}'}</code> in the query string.
        You can obtain a key from the <a href="https://developer.tomtom.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--red)' }}>TomTom Developer Portal</a>.
      </Callout>
    </div>
  );
}
