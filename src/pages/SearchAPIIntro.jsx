import PageActions from '../components/ui/PageActions';
import { useIlloStyle } from '../context/IlloStyleContext';
import {
  makeThumb,
  L_SearchFuzzy, L_SearchPOI, L_SearchCategory, L_SearchNearby,
  L_SearchAlongRoute, L_SearchAutocomplete, L_BatchSearch, L_POIDetails, L_POIPhotos,
} from '../illustrations/lightVariants';
import {
  IcoADAS, IcoAIConfig, IcoAIVoice, IcoAreaAnalytics, IcoBatchRouting,
  IcoCalculateRoute, IcoCluster, IcoETAPanel, IcoEV, IcoEVBattery,
  IcoEVChargingAvailability, IcoEVNavUI, IcoEVRequirements, IcoEVRouting, IcoEVSearchNearby,
  IcoFuelPrices, IcoGeocode, IcoHUD, IcoHomeScreen, IcoHorizonPanel,
  IcoInstructionPanel, IcoIntentRouting, IcoJunctionAnalytics, IcoMapDisplay,
  IcoMapRasterTile, IcoMapSatelliteTile, IcoMapStaticImage, IcoMapVectorTile, IcoMatrixRouting,
  IcoNavControls, IcoNavGuidance, IcoNavSDKAdvanced, IcoNavSDKLocation, IcoNavSDKNavigation,
  IcoNavSDKOffline, IcoNavSDKRouting, IcoNavSDKSearch, IcoNavSDKVirtualHorizon,
  IcoODAnalysis, IcoOnStreetParking, IcoPOIDetails, IcoPOIPhotos, IcoParkingAvailability,
  IcoParkingPrices, IcoReachableRange, IcoReverseGeocode, IcoRouteBar, IcoRoutingWeather,
  IcoSearchAlongRoute, IcoSearchAutocomplete, IcoSearchFuzzy, IcoSearchNearby, IcoSearchPOI,
  IcoSnapToRoads, IcoSpeechToText, IcoTrafficFlow, IcoTrafficFlowTile, IcoTrafficIncidents,
  IcoTrafficModelID, IcoTrafficStats, IcoTruck, IcoTurnInstructions, IcoVIBasics,
  IcoVoiceEngine, IcoWaypointOpt,
} from '../illustrations/iconVariants';
import {
  IlloSearchFuzzy, IlloSearchPOI, IlloSearchNearby,
  IlloSearchAlongRoute, IlloSearchAutocomplete, IlloPOIDetails, IlloPOIPhotos,
} from './IntroIllustrations';

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function SearchAPIIntro({ onNavigate }) {
  const { theme: illoTheme, palette: illoPalette } = useIlloStyle();

  const endpoints = [
    {
      Thumb: makeThumb(IlloSearchFuzzy, L_SearchFuzzy, IcoSearchFuzzy),
      method: 'GET',
      title: 'Fuzzy Search',
      desc: 'Unified endpoint accepting free-form text — addresses, POIs, and coordinates resolved in a single query.',
      pageId: 'search-fuzzy',
      tag: 'v2',
    },
    {
      Thumb: makeThumb(IlloSearchPOI, L_SearchPOI, IcoSearchPOI),
      method: 'GET',
      title: 'POI Search',
      desc: 'Search exclusively for Points of Interest by name with optional category and brand filters.',
      pageId: 'search-poi',
      tag: 'v2',
    },
    {
      Thumb: makeThumb(null, L_SearchCategory, IcoSearchPOI),
      method: 'GET',
      title: 'Category Search',
      desc: 'Find POIs by category type such as restaurants, hospitals, or petrol stations.',
      pageId: 'search-category',
      tag: 'v2',
    },
    {
      Thumb: makeThumb(IlloSearchNearby, L_SearchNearby, IcoSearchNearby),
      method: 'GET',
      title: 'Nearby Search',
      desc: 'Discover POIs within a radius around a given lat/lon coordinate without a text query.',
      pageId: 'search-nearby',
      tag: 'v2',
    },
    {
      Thumb: makeThumb(IlloSearchAlongRoute, L_SearchAlongRoute, IcoSearchAlongRoute),
      method: 'POST',
      title: 'Along-Route Search',
      desc: 'Find POIs along a route corridor, ranked by deviation from the original path.',
      pageId: 'search-along-route',
      tag: 'v2',
    },
    {
      Thumb: makeThumb(IlloSearchAutocomplete, L_SearchAutocomplete, IcoSearchAutocomplete),
      method: 'GET',
      title: 'Autocomplete',
      desc: 'Return type-ahead entity suggestions for partial queries to power instant search UIs.',
      pageId: 'search-autocomplete',
      tag: 'v2',
    },
    {
      Thumb: makeThumb(null, L_BatchSearch, IcoSearchFuzzy),
      method: 'POST',
      title: 'Batch Search',
      desc: 'Execute multiple search queries in a single HTTP request, synchronously or asynchronously.',
      pageId: 'search-batch',
      tag: 'v2',
    },
    {
      Thumb: makeThumb(IlloPOIDetails, L_POIDetails, IcoPOIDetails),
      method: 'GET',
      title: 'POI Details',
      desc: 'Retrieve enriched POI data including ratings, price range, opening hours, and contact info.',
      pageId: 'poi-details',
      tag: 'v2',
    },
    {
      Thumb: makeThumb(IlloPOIPhotos, L_POIPhotos, IcoPOIPhotos),
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

      {/* Quickstart CTA */}
      <div className="zone" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button
          onClick={() => onNavigate?.('search-quickstart', 'search-api')}
          style={{ background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 20, padding: '10px 20px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
        >
          Quickstart →
        </button>
        <button
          onClick={() => onNavigate?.('search-fuzzy', 'search-api')}
          style={{ background: 'var(--bg)', color: 'var(--black)', border: '1px solid var(--border)', borderRadius: 20, padding: '10px 20px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
        >
          API Reference
        </button>
      </div>

      {/* Endpoint grid — rule 4: before version table */}
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
                  <span className={`http-tag http-tag-${method.toLowerCase()}`}>{method}</span>
                  {tag && <span className="meta-tag">{tag}</span>}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--black)', marginBottom: 3 }}>{title}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.5 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guides — rule 5: before version table */}
      <div className="zone">
        <h2 className="sh" id="guides">Guides</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
          {[
            { id: 'search-guide-typeahead', title: 'Typeahead & Autocomplete', desc: 'Build instant search UIs with debouncing, result rendering, and selection handling.' },
            { id: 'search-guide-ev',        title: 'EV Station Discovery',     desc: 'Find EV charging stations using category set 7309 with connector type filters.' },
            { id: 'search-guide-fuzzy-tips',title: 'Fuzzy Search Tips',        desc: 'Tune precision with geoBias, countrySet, idxSet, and typeahead flags.' },
          ].map(({ id, title, desc }) => (
            <button key={id} onClick={() => onNavigate?.(id, 'search-api')}
              style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 20, padding: '1.25rem', cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--black)', marginBottom: '0.375rem' }}>{title}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--mid)', lineHeight: 1.5 }}>{desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Version comparison table — rule 4: after endpoints and guides */}
      <div className="zone">
        <h2 className="sh" id="versions">Versions</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '10px 14px', textAlign: 'left', width: '34%', color: 'var(--muted)', fontWeight: 600, fontSize: '0.75rem' }}>Feature</th>
                {[
                  { label: 'V1', platform: 'TomTom Maps', status: 'Production', statusBg: 'rgba(34,197,94,0.1)',   statusColor: '#15803d', color: '#15803d' },
                  { label: 'V2', platform: 'Orbis Maps',  status: 'Production', statusBg: 'rgba(34,197,94,0.1)',   statusColor: '#15803d', color: '#7c3aed' },
                ].map(v => (
                  <th key={v.label} style={{ padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid var(--border)', width: '33%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: v.color }}>{v.label}</span>
                      <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 4, background: v.statusBg, color: v.statusColor, whiteSpace: 'nowrap' }}>{v.status}</span>
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--muted)', marginTop: 2 }}>{v.platform}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Fuzzy Search',         '✓', '✓'],
                ['POI / Category Search','✓', '✓'],
                ['Nearby Search',        '✓', '✓'],
                ['Geometry Search',      '✓', '✓'],
                ['Along-Route Search',   '✓', '✓'],
                ['Autocomplete',         '✓', '✓'],
                ['Batch Search',         '✓', '✓'],
                ['Place by ID',          '✓', '✓'],
                ['Additional Data',      '✓', '✓'],
                ['POI Categories',       '✓', '✓'],
                ['JMESPath filtering',   '—', '✓'],
                ['Copyrights endpoint',  '—', '✓'],
              ].map(([feat, v1, v2], i) => (
                <tr key={feat} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'var(--bg)' }}>
                  <td style={{ padding: '9px 14px', color: 'var(--black)', fontWeight: 500 }}>{feat}</td>
                  {[v1, v2].map((val, j) => (
                    <td key={j} style={{ padding: '9px 14px', color: val === '✓' ? '#15803d' : 'var(--t-dis)', fontWeight: val === '✓' ? 700 : 400 }}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
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
    </div>
  );
}
