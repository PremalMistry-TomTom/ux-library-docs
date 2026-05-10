import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import { ApiLinks } from '../components/ui/ApiLinks';
import PageActions from '../components/ui/PageActions';
import { useDemoStyle } from '../hooks/useDemoStyle';

/* ─── API references ─────────────────────────────────────────────────────────── */
const SEARCH_APIS = [
  { name: 'Search — Find a Location',    type: 'Android SDK', description: 'Fuzzy search, POI categories, brand search, and autocomplete to resolve user-entered locations.',                      pageId: 'navsdk-search-find',       productId: 'navsdk' },
  { name: 'Search — Quickstart',         type: 'Android SDK', description: 'Integrate the TomTom Search module and execute a first location search request in an Android app.',                     pageId: 'navsdk-search-quickstart',  productId: 'navsdk' },
  { name: 'EV Search',                   type: 'Android SDK', description: 'Search for EV charging stations by location, power output, connector type, and real-time availability.',                pageId: 'navsdk-search-ev',         productId: 'navsdk' },
  { name: 'Reverse Geocoding',           type: 'Android SDK', description: 'Convert GPS coordinates into human-readable street addresses using the TomTom Search API.',                              pageId: 'navsdk-search-reverse',    productId: 'navsdk' },
  { name: 'Bring Your Own Data',         type: 'Android SDK', description: 'Surface custom application-specific POIs — like internal locations or partner data — alongside TomTom results.',        pageId: 'navsdk-search-byod',       productId: 'navsdk' },
];

/* ─── Shared mock data ──────────────────────────────────────────────────────── */
const RESULTS = [
  { name: "Gianni's Ristorante", addr: '14 Via Roma · 0.3 km',  rating: '4.6', reviews: '1,240', price: '€€',  open: true  },
  { name: 'Pizza Napoli Express', addr: '8 Corso Italia · 0.7 km', rating: '4.2', reviews: '890',   price: '€',   open: true  },
  { name: 'La Cucina Moderna',    addr: '3 Piazza Duomo · 1.1 km', rating: '4.8', reviews: '2,100', price: '€€€', open: false },
];

/* ─── Search panel mock ─────────────────────────────────────────────────────── */
export function SearchMock({ isOnline = true, showAttribution = false, showEnrichment = false, showFilters = false }) {
  const M = useDemoStyle();
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', width: 290, flexShrink: 0, border: `1px solid ${M.line}` }}>
      {/* Search bar */}
      <div style={{ padding: '9px 12px', background: M.card, display: 'flex', alignItems: 'center', gap: 8, borderBottom: `1px solid ${M.line}` }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={M.dim} strokeWidth="2.5">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <span style={{ fontSize: '0.75rem', color: M.muted, flex: 1 }}>Search destination…</span>
        {showAttribution && (
          <span style={{ fontSize: '0.875rem', color: M.dim, background: M.card, padding: '1px 5px', borderRadius: 3, whiteSpace: 'nowrap' }}>
            Powered by Google
          </span>
        )}
      </div>

      {/* Connectivity strip */}
      <div style={{ padding: '5px 12px', background: isOnline ? `${M.green}22` : `${M.amber}22`, display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: isOnline ? M.green : M.amber, flexShrink: 0 }} />
        <span style={{ fontSize: '0.875rem', color: isOnline ? M.green : M.orange }}>
          {isOnline ? '3rd-party search · online' : 'TomTom onboard · offline'}
        </span>
      </div>

      {/* Filter chips */}
      {showFilters && (
        <div style={{ padding: '7px 12px', display: 'flex', gap: 5, borderBottom: `1px solid ${M.line}` }}>
          {['★ 4+', 'Open now', '€€', 'Italian'].map(f => (
            <span key={f} style={{ fontSize: '0.875rem', background: M.card, color: M.blue, padding: '2px 7px', borderRadius: 20, whiteSpace: 'nowrap', border: `1px solid ${M.line}` }}>{f}</span>
          ))}
        </div>
      )}

      {/* Results */}
      {RESULTS.map((r, i) => (
        <div key={i} style={{ padding: '8px 12px', borderBottom: `1px solid ${M.line}`, display: 'flex', gap: 9, alignItems: 'flex-start' }}>
          <div style={{ width: 28, height: 28, background: M.card, borderRadius: 5, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={M.blue} strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: M.text, marginBottom: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div>
            <div style={{ fontSize: '0.875rem', color: M.muted }}>{r.addr}</div>
            {showEnrichment && (
              <div style={{ display: 'flex', gap: 5, marginTop: 3 }}>
                <span style={{ fontSize: '0.875rem', color: M.amber }}>★ {r.rating}</span>
                <span style={{ fontSize: '0.875rem', color: M.muted }}>({r.reviews})</span>
                <span style={{ fontSize: '0.875rem', color: M.dim }}>{r.price}</span>
                <span style={{ fontSize: '0.875rem', color: r.open ? M.green : M.red }}>{r.open ? 'Open' : 'Closed'}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Location Preview Panel mock ───────────────────────────────────────────── */
export function LPPMock({ enriched = false, attribution = false }) {
  const M = useDemoStyle();
  return (
    <div style={{ background: M.card, borderRadius: 20, overflow: 'hidden', width: 290, flexShrink: 0, border: `1px solid ${M.line}` }}>
      <div style={{ padding: '14px 14px 10px' }}>
        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: M.text, marginBottom: 3 }}>Gianni's Ristorante</div>
        <div style={{ fontSize: '0.75rem', color: M.dim, marginBottom: enriched ? 8 : 10 }}>14 Via Roma, Milan · 0.3 km</div>
        {enriched && (
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 5 }}>
              <span style={{ fontSize: '0.875rem', color: M.amber }}>★ 4.6</span>
              <span style={{ fontSize: '0.875rem', color: M.muted }}>(1,240 reviews)</span>
              <span style={{ fontSize: '0.875rem', color: M.dim }}>€€ · Italian</span>
            </div>
            <div style={{ fontSize: '0.875rem', color: M.green, marginBottom: 6 }}>Open · Closes 23:00</div>
            <div style={{ fontSize: '0.875rem', color: M.dim, fontStyle: 'italic', marginBottom: 8, lineHeight: 1.5 }}>
              "Amazing pasta, great atmosphere — highly recommend!"
            </div>
          </>
        )}
      </div>
      <div style={{ padding: '0 14px 12px', display: 'flex', gap: 8 }}>
        <button style={{ flex: 1, padding: '7px 0', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Drive</button>
        <button style={{ flex: 1, padding: '7px 0', background: M.card, color: M.blue, border: `1px solid ${M.line}`, borderRadius: 6, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Route</button>
      </div>
      {attribution && (
        <div style={{ padding: '6px 14px', borderTop: `1px solid ${M.line}`, background: M.bg, fontSize: '0.875rem', color: M.muted }}>
          Powered by Google
        </div>
      )}
    </div>
  );
}

/* ─── Provider setup demo ───────────────────────────────────────────────────── */
function ProviderSetup() {
  const [mode, setMode] = useState('online');
  const isOnline = mode === 'online';

  return (
    <div>
      <div style={{ display: 'flex', marginBottom: 16, background: 'var(--bg)', borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border)', width: 'fit-content', padding: 3, gap: 3 }}>
        {[['online', '🌐  Online (3rd party)'], ['offline', '📡  Offline only (TomTom)']].map(([id, label]) => (
          <button key={id} onClick={() => setMode(id)} style={{
            padding: '7px 18px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
            border: mode === id ? '1px solid var(--red)' : '1px solid transparent',
            borderRadius: 6,
            background: mode === id ? 'var(--red)' : 'var(--white)',
            color: mode === id ? '#fff' : 'var(--black)',
            transition: 'all 0.15s',
          }}>{label}</button>
        ))}
      </div>

      <SearchMock isOnline={isOnline} showAttribution={isOnline} />
      <p style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.7, margin: '12px 0' }}>
        {isOnline
          ? 'When online, all queries go to the 3rd-party provider. TomTom onboard search remains on standby as an automatic fallback — the orchestrator never needs to manage the switch.'
          : 'With no online provider set, TomTom onboard search handles all queries regardless of connectivity. Useful for OEMs that do not require a 3rd-party integration.'}
      </p>
      <CodeBlock label="Kotlin">
        <pre>
          {isOnline ? (
            <>
              <span className="hl-k">val</span>{' '}<span className="hl-n">searchConfig</span>{' = '}<span className="hl-t">SearchConfiguration</span>{'(\n'}
              {'    '}<span className="hl-n">onlineProvider</span>{'  = '}<span className="hl-t">StlaSearchProvider</span>{'(\n'}
              {'        '}<span className="hl-n">apiKey</span>{' = '}<span className="hl-s">"your-api-key"</span>{'\n'}
              {'    ),\n'}
              {'    '}<span className="hl-n">offlineProvider</span>{' = '}<span className="hl-t">TomTomOfflineSearchProvider</span>{'()\n'}
              {')\n\n'}
              <span className="hl-n">homeScreenLayout</span>{'.'}<span className="hl-f">setSearchConfiguration</span>{'('}<span className="hl-n">searchConfig</span>{')'}
            </>
          ) : (
            <>
              <span className="hl-c">// No 3rd-party provider — TomTom onboard only</span>{'\n'}
              <span className="hl-k">val</span>{' '}<span className="hl-n">searchConfig</span>{' = '}<span className="hl-t">SearchConfiguration</span>{'(\n'}
              {'    '}<span className="hl-n">onlineProvider</span>{'  = null,\n'}
              {'    '}<span className="hl-n">offlineProvider</span>{' = '}<span className="hl-t">TomTomOfflineSearchProvider</span>{'()\n'}
              {')\n\n'}
              <span className="hl-n">homeScreenLayout</span>{'.'}<span className="hl-f">setSearchConfiguration</span>{'('}<span className="hl-n">searchConfig</span>{')'}
            </>
          )}
        </pre>
      </CodeBlock>
    </div>
  );
}

/* ─── Connectivity transition explorer ─────────────────────────────────────── */
const TRANSITIONS = [
  {
    id: 'idle',
    label: 'Connectivity changes — search not active',
    trigger: 'The user is not currently using search when connectivity changes.',
    behavior: 'The destination entry panel always shows the default online search state, regardless of current connectivity. The UI pre-assumes online when idle — no flicker or state change is shown.',
    state: 'idle',
  },
  {
    id: 'activating',
    label: 'Connectivity drops while activating search',
    trigger: 'The user taps the search box; connectivity dropped just before or during activation.',
    behavior: 'All 3rd-party elements (attribution badge, enriched filters) are hidden immediately. The panel falls back silently to TomTom onboard search — no error is shown.',
    state: 'offline',
  },
  {
    id: 'typing',
    label: 'Connectivity changes while typing a query',
    trigger: 'The user is mid-query when the connectivity state changes.',
    behavior: 'The typed query is preserved — no re-entry required. Results are re-fetched from the now-active provider. A banner indicates whether results came from online or onboard search.',
    state: 'transition',
  },
  {
    id: 'selecting',
    label: 'Connectivity drops while selecting a result',
    trigger: 'The user selects an online search result; connectivity has just dropped.',
    behavior: 'The cached result data is shown in the Location Preview Panel. No new requests are attempted. Drive and Route actions continue to work using the cached location data.',
    state: 'cached',
  },
  {
    id: 'lpp',
    label: 'Connectivity drops while viewing Location Preview',
    trigger: 'The user is already viewing a Location Preview when connectivity drops.',
    behavior: 'The cached Location Preview remains visible and is not replaced with an offline result. Drive and Route actions always work. The UI does not reload or show an error.',
    state: 'cached',
  },
];

const STATE_STYLE = {
  idle:       { bg: '#0f2a1a', dot: '#22c55e', label: 'Online · search idle',        color: '#86efac' },
  offline:    { bg: '#1f1505', dot: '#f97316', label: 'Offline fallback active',       color: '#fdba74' },
  transition: { bg: '#1a1a0a', dot: '#eab308', label: 'Connectivity transitioning',   color: '#fde047' },
  cached:     { bg: '#0f1a2a', dot: '#3b82f6', label: 'Showing cached content',       color: '#93c5fd' },
};

export function TransitionExplorer() {
  const [active, setActive] = useState(0);
  const scenario = TRANSITIONS[active];
  const s = STATE_STYLE[scenario.state];

  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 260, flexShrink: 0 }}>
        {TRANSITIONS.map((t, i) => (
          <button key={t.id} onClick={() => setActive(i)} style={{
            padding: '9px 12px', borderRadius: 20, cursor: 'pointer', textAlign: 'left',
            background: active === i ? 'var(--code-bg)' : 'transparent',
            border: active === i ? '1px solid var(--red)' : '1px solid var(--border)',
            color: active === i ? '#e2e8f0' : 'var(--mid)',
            fontSize: '0.75rem', fontWeight: active === i ? 600 : 400,
            transition: 'all 0.15s',
          }}>
            <span style={{ display: 'block', fontSize: '0.875rem', color: 'var(--muted)', fontWeight: 400, marginBottom: 2 }}>Scenario {i + 1}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, minWidth: 260 }}>
        <div style={{ padding: '10px 14px', background: s.bg, borderRadius: 20, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
          <span style={{ fontSize: '0.75rem', color: s.color, fontWeight: 600 }}>{s.label}</span>
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>Trigger</div>
          <p style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.65, margin: 0 }}>{scenario.trigger}</p>
        </div>
        <div>
          <div style={{ fontSize: '0.875rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>Expected behaviour</div>
          <p style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.65, margin: 0 }}>{scenario.behavior}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Search UI customisation demo ─────────────────────────────────────────── */
const UI_TABS = [
  { id: 'basic',       label: 'Basic',               showAttribution: false, showEnrichment: false, showFilters: false },
  { id: 'attribution', label: '+ Attribution',       showAttribution: true,  showEnrichment: false, showFilters: false },
  { id: 'enriched',    label: '+ Enriched results',  showAttribution: true,  showEnrichment: true,  showFilters: false },
  { id: 'filters',     label: '+ Filters',           showAttribution: true,  showEnrichment: true,  showFilters: true  },
];

export function SearchUICustomiser() {
  const [tab, setTab] = useState('basic');
  const cfg = UI_TABS.find(t => t.id === tab);

  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {UI_TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '7px 14px', borderRadius: 20, cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600,
            background: tab === t.id ? 'var(--red)' : 'var(--white)',
            color: tab === t.id ? '#fff' : 'var(--black)',
            border: tab === t.id ? '1px solid var(--red)' : '1px solid var(--border)',
            transition: 'all 0.15s',
          }}>{t.label}</button>
        ))}
      </div>

      <SearchMock isOnline={true} {...cfg} />
      <div style={{ marginTop: 16 }} />
      <CodeBlock label="Kotlin">
        <pre>
          {tab === 'basic' && (
            <>
              <span className="hl-c">// Default search panel — no customisation needed</span>{'\n'}
              <span className="hl-k">val</span>{' '}<span className="hl-n">config</span>{' = '}<span className="hl-t">SearchConfiguration</span>{'(\n'}
              {'    '}<span className="hl-n">onlineProvider</span>{' = '}<span className="hl-t">StlaSearchProvider</span>{'(apiKey)\n'}
              {')\n'}
              <span className="hl-n">homeScreenLayout</span>{'.'}<span className="hl-f">setSearchConfiguration</span>{'('}<span className="hl-n">config</span>{')'}
            </>
          )}
          {tab === 'attribution' && (
            <>
              <span className="hl-c">// Legal requirement for STLA R2 — must be shown</span>{'\n'}
              <span className="hl-n">searchPanel</span>{'.'}<span className="hl-f">setAttribution</span>{'(\n'}
              {'    '}<span className="hl-t">SearchAttribution</span>{'(\n'}
              {'        '}<span className="hl-n">providerName</span>{'     = '}<span className="hl-s">"Google"</span>{',\n'}
              {'        '}<span className="hl-n">showInSearchBar</span>{'  = '}<span className="hl-k">true</span>{',\n'}
              {'        '}<span className="hl-n">showInResultsList</span>{' = '}<span className="hl-k">true</span>{'\n'}
              {'    )\n'}
              {')'}
            </>
          )}
          {tab === 'enriched' && (
            <>
              <span className="hl-c">// Enrich results with 3rd-party metadata</span>{'\n'}
              <span className="hl-n">searchPanel</span>{'.'}<span className="hl-f">setResultsEnrichment</span>{'(\n'}
              {'    '}<span className="hl-t">ResultsEnrichment</span>{'(\n'}
              {'        '}<span className="hl-n">showRating</span>{'       = '}<span className="hl-k">true</span>{',\n'}
              {'        '}<span className="hl-n">showPriceRange</span>{'   = '}<span className="hl-k">true</span>{',\n'}
              {'        '}<span className="hl-n">showOpenStatus</span>{'   = '}<span className="hl-k">true</span>{',\n'}
              {'        '}<span className="hl-n">showAccessibility</span>{' = '}<span className="hl-k">true</span>{'\n'}
              {'    )\n'}
              {')'}
            </>
          )}
          {tab === 'filters' && (
            <>
              <span className="hl-c">// Category-specific filters + sort options</span>{'\n'}
              <span className="hl-n">searchPanel</span>{'.'}<span className="hl-f">setFilterConfiguration</span>{'(\n'}
              {'    '}<span className="hl-t">FilterConfiguration</span>{'(\n'}
              {'        '}<span className="hl-n">category</span>{'    = '}<span className="hl-t">PoiCategory</span>{'.'}<span className="hl-n">RESTAURANT</span>{',\n'}
              {'        '}<span className="hl-n">filters</span>{'     = '}<span className="hl-f">listOf</span>{'(\n'}
              {'            '}<span className="hl-t">Filter</span>{'.'}<span className="hl-n">RATING</span>{', '}<span className="hl-t">Filter</span>{'.'}<span className="hl-n">OPENING_HOURS</span>{',\n'}
              {'            '}<span className="hl-t">Filter</span>{'.'}<span className="hl-n">PRICE_RANGE</span>{', '}<span className="hl-t">Filter</span>{'.'}<span className="hl-n">CUISINE</span>{'\n'}
              {'        ),\n'}
              {'        '}<span className="hl-n">sortOptions</span>{'  = '}<span className="hl-f">listOf</span>{'(\n'}
              {'            '}<span className="hl-t">SortBy</span>{'.'}<span className="hl-n">RELEVANCE</span>{', '}<span className="hl-t">SortBy</span>{'.'}<span className="hl-n">DISTANCE</span>{'\n'}
              {'        )\n'}
              {'    )\n'}
              {')'}
            </>
          )}
        </pre>
      </CodeBlock>
    </div>
  );
}

/* ─── LPP customisation demo ────────────────────────────────────────────────── */
function Toggle({ value, onChange, label }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.875rem', color: 'var(--mid)', userSelect: 'none' }}>
      <div onClick={() => onChange(!value)} style={{ width: 36, height: 20, borderRadius: 20, cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0, background: value ? 'var(--red)' : 'var(--border)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 2, left: value ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
      </div>
      {label}
    </label>
  );
}

function LPPCustomiser() {
  const [enriched, setEnriched] = useState(false);
  const [attribution, setAttribution] = useState(false);

  return (
    <div>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Toggle value={enriched} onChange={setEnriched} label="Show enriched data (rating, hours, reviews)" />
          <Toggle value={attribution} onChange={setAttribution} label="Show provider attribution" />
        </div>
      </div>
      <LPPMock enriched={enriched} attribution={attribution} />
      <div style={{ marginTop: 16 }} />
      <CodeBlock label="Kotlin">
        <pre>
          <span className="hl-n">locationPreviewPanel</span>{'.'}<span className="hl-f">setConfiguration</span>{'(\n'}
          {'    '}<span className="hl-t">LPPConfiguration</span>{'(\n'}
          {'        '}<span className="hl-n">enrichedData</span>{'    = '}<span className="hl-k">{String(enriched)}</span>{',\n'}
          {'        '}<span className="hl-n">showAttribution</span>{' = '}<span className="hl-k">{String(attribution)}</span>{',\n'}
          {enriched ? (
            <>
              {'        '}<span className="hl-n">dataFields</span>{'     = '}<span className="hl-f">listOf</span>{'(\n'}
              {'            '}<span className="hl-t">LPPField</span>{'.'}<span className="hl-n">RATING</span>{',\n'}
              {'            '}<span className="hl-t">LPPField</span>{'.'}<span className="hl-n">REVIEWS</span>{',\n'}
              {'            '}<span className="hl-t">LPPField</span>{'.'}<span className="hl-n">PRICE_RANGE</span>{',\n'}
              {'            '}<span className="hl-t">LPPField</span>{'.'}<span className="hl-n">OPENING_HOURS</span>{',\n'}
              {'            '}<span className="hl-t">LPPField</span>{'.'}<span className="hl-n">USER_REVIEWS</span>{'\n'}
              {'        ),\n'}
            </>
          ) : (
            <>
              {'        '}<span className="hl-c">// dataFields defaults to address + distance</span>{'\n'}
            </>
          )}
          {'    )\n'}
          {')'}
        </pre>
      </CodeBlock>
    </div>
  );
}

/* ─── Priority badge ────────────────────────────────────────────────────────── */
function Pri({ children }) {
  const isP0 = children.includes('P0');
  return (
    <span style={{
      fontSize: '0.875rem', fontWeight: 700, padding: '2px 6px', borderRadius: 3, whiteSpace: 'nowrap',
      background: isP0 ? '#fff5f5' : 'var(--bg)',
      color: isP0 ? 'var(--red)' : 'var(--muted)',
      border: `1px solid ${isP0 ? '#fecaca' : 'var(--border)'}`,
    }}>{children}</span>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────────── */
export default function SearchEngine({ onNavigate }) {
  const { t } = useTranslation('pages');

  return (
    <div className="page">
      <div className="page-header">
        <h1>{t('searchEngine.title')}</h1>
        <PageActions />
      </div>

      <div className="quick-answer">
        {t('searchEngine.intro')}
      </div>

      <ApiLinks items={SEARCH_APIS} onNavigate={onNavigate} />

      {/* Overview */}
      <div className="zone">
        <h2 className="sh" id="se-overview">{t('searchEngine.sections.overview')}</h2>
        <p className="body">
          The STLA R2 programme requires Stellantis to use Google Search when the vehicle is online — a contractual
          and ecosystem requirement — while preserving TomTom onboard search for offline scenarios. UX Library achieves
          this by abstracting the search provider behind a configurable interface: the same panels, entry points, and
          UX flows work with any provider that implements it.
        </p>
        <p className="body">
          The integration covers the full search surface: destination entry, search results panel, persistent map POIs,
          horizon panel, route overview stops, favourites, and recents. All six entry points route POI detail requests
          to the correct provider based on the origin of the POI.
        </p>
      </div>

      {/* Provider setup */}
      <div className="zone">
        <h2 className="sh" id="se-provider">{t('searchEngine.sections.provider')}</h2>
        <p className="body">
          Configure the search provider once at initialisation. Set an <code className="ic">onlineProvider</code> for
          3rd-party queries and an <code className="ic">offlineProvider</code> for onboard fallback. Toggle below to see
          how the search panel and generated Kotlin code adapt to each configuration.
        </p>
        <ProviderSetup />
        <Callout type="info">{t('searchEngine.callout1')}</Callout>
      </div>

      {/* Connectivity transitions */}
      <div className="zone">
        <h2 className="sh" id="se-transitions">{t('searchEngine.sections.transitions')}</h2>
        <p className="body">
          Connectivity can change at any point during a search session. UX Library defines specific behaviour for
          each transition so the experience stays coherent. Click a scenario to see the trigger and expected behaviour.
        </p>
        <TransitionExplorer />
      </div>

      {/* Search UI customisation */}
      <div className="zone">
        <h2 className="sh" id="se-ui-custom">{t('searchEngine.sections.uiCustom')}</h2>
        <p className="body">
          The search panel supports progressive enrichment. Start with the default layout, then layer in provider
          attribution, enriched result metadata, and category-specific filters. Click through the tabs below to see
          each layer and the corresponding Kotlin configuration.
        </p>
        <SearchUICustomiser />
        <Callout type="warn">{t('searchEngine.callout2')}</Callout>
      </div>

      {/* LPP */}
      <div className="zone">
        <h2 className="sh" id="se-lpp">{t('searchEngine.sections.lpp')}</h2>
        <p className="body">
          The Location Preview Panel (LPP) can display additional attributes supplied by the 3rd-party provider —
          ratings, review counts, price classification, opening hours, and user review snippets. Toggle the options
          below to preview the LPP in each configuration.
        </p>
        <LPPCustomiser />
        <Callout type="info">{t('searchEngine.callout3')}</Callout>
      </div>

      {/* POI entry points */}
      <div className="zone">
        <h2 className="sh" id="se-entry-points">{t('searchEngine.sections.entryPoints')}</h2>
        <p className="body">
          POI details can be opened from six places in the navigation UI. UX Library ensures all six route the detail
          request to the correct provider based on the origin of the POI.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {[
            ['1', 'Search result',          'User selects a result from the search panel.',                          'online'],
            ['2', 'Persistent map POI',     'User taps a POI icon rendered on the map.',                            'source'],
            ['3', 'Horizon panel',          'User selects a POI from the upcoming horizon strip.',                  'source'],
            ['4', 'Route overview stop',    'User taps a stop in the planned route summary.',                       'source'],
            ['5', 'Personal location',      'User opens a saved favourite or recent destination.',                  'source'],
            ['6', 'Add stop (route active)','User adds a waypoint while actively navigating.',                     'online'],
          ].map(([num, name, desc, type]) => (
            <div key={num} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 14px', background: 'var(--code-bg)', border: '1px solid var(--border)', borderRadius: 20 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--red)', color: '#fff', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{num}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 2, color: '#e2e8f0' }}>{name}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.5 }}>{desc}</div>
              </div>
              <span style={{
                fontSize: '0.875rem', padding: '2px 8px', borderRadius: 4, flexShrink: 0, alignSelf: 'flex-start', marginTop: 2, fontWeight: 600,
                background: type === 'online' ? '#0f2a1a' : '#1e293b',
                color: type === 'online' ? '#86efac' : '#93c5fd',
              }}>
                {type === 'online' ? 'online provider' : 'follow POI source'}
              </span>
            </div>
          ))}
        </div>

        <Callout type="info">{t('searchEngine.callout4')}</Callout>
      </div>

      {/* Requirements summary */}
      <div className="zone">
        <h2 className="sh" id="se-requirements">{t('searchEngine.sections.requirements')}</h2>
        <table className="prop-table">
          <thead><tr><th>Requirement</th><th>Area</th><th>Priority</th></tr></thead>
          <tbody>
            {[
              ['Replace default search provider with 3rd-party (online)',    'Provider setup',      'P0'],
              ['TomTom onboard fallback when offline',                        'Provider setup',      'P0'],
              ['All 5 online ↔ offline transition scenarios',                'Transitions',         'P0'],
              ['TomTom personal locations with 3rd-party provider active',   'Personal locations',  'P0'],
              ['TomTom reverse geocoding for lat/long personal locations',   'Personal locations',  'P0'],
              ['POI enrichment sourced from origin provider',               'Personal locations',  'P0'],
              ['"Powered by Google" attribution in search bar + results',   'Search UI',           'P0 · R2 legal'],
              ['Info overlay (ⓘ button) in search panel',                   'Search UI',           'P0 · R2 legal'],
              ['Enriched result attributes (rating, price, accessibility)', 'Search UI',           'P0 · R2'],
              ['Category-specific filters and sort options',                'Search UI',           'P0 · R2'],
              ['Full UI control of search panel via Jetpack Compose',       'Search UI',           'P1'],
              ['Additional data attributes in Location Preview Panel',      'LPP',                 'P0 · R2'],
              ['"Powered by Google" attribution in LPP',                    'LPP',                 'P0 · R2 legal'],
              ['Full UI control of LPP via Jetpack Compose',               'LPP',                 'P1'],
              ['All 6 POI entry points work with replaced search provider', 'Entry points',        'P0'],
              ['POI source-aware detail request routing',                   'Entry points',        'P0'],
              ['Free driving state preserved with replaced search provider','Free driving',        'P0'],
            ].map(([req, area, pri]) => (
              <tr key={req}>
                <td style={{ fontWeight: 500 }}>{req}</td>
                <td style={{ color: 'var(--mid)', fontSize: '0.875rem' }}>{area}</td>
                <td><Pri>{pri}</Pri></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="feedback-strip">
        Was this page helpful?
        <button>👍 Yes</button>
        <button>👎 No</button>
      </div>
    </div>
  );
}
