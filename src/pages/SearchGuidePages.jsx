import PageActions from '../components/ui/PageActions';

/* ═══════════════════════════════════════════════════════════════════════════
   SEARCH GUIDES LANDING
   ═══════════════════════════════════════════════════════════════════════════ */

const GUIDE_CARDS = [
  {
    id: 'search-guide-typeahead',
    title: 'Typeahead & Autocomplete',
    desc: 'Build instant search UIs with the Autocomplete endpoint — debouncing, result rendering, and selection handling.',
  },
  {
    id: 'search-guide-ev',
    title: 'EV Station Discovery',
    desc: 'Find EV charging stations using category set 7309 with connector type and power level filters.',
  },
  {
    id: 'search-guide-fuzzy-tips',
    title: 'Fuzzy Search Tips',
    desc: 'Tune fuzzy search precision with geoBias, countrySet, idxSet, and typeahead flags for better results.',
  },
];

export function SearchGuidesLanding({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Best Practices</h1>
        <PageActions pageId="search-guides" pageTitle="Search API Best Practices" />
      </div>
      <p className="quick-answer">
        Guides for building high-quality search experiences with the TomTom Search API.
        Covers autocomplete UX, EV station discovery patterns, and fuzzy search tuning.
      </p>

      <div className="zone">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {GUIDE_CARDS.map(({ id, title, desc }) => (
            <button
              key={id}
              onClick={() => onNavigate?.(id, 'search-api')}
              style={{
                background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: '20px', padding: '1.25rem', cursor: 'pointer',
                textAlign: 'left', transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--black)', marginBottom: '0.375rem' }}>{title}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--mid)', lineHeight: 1.5 }}>{desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SEARCH PLATFORM LANDING (Versions & Reference)
   ═══════════════════════════════════════════════════════════════════════════ */

const VERSION_CARDS = [
  {
    id: 'search-tomtom-maps',
    title: 'Search API v1',
    desc: 'Legacy TomTom Maps platform. Service version 2 at api.tomtom.com/search/2/.',
    badge: 'V1', badgeColor: '#15803d', badgeBg: 'rgba(34,197,94,0.1)',
  },
  {
    id: 'search-orbis-maps',
    title: 'Search API v2',
    desc: 'Orbis Maps platform with JMESPath filtering, Copyrights endpoint, and enhanced response data.',
    badge: 'V2', badgeColor: '#7c3aed', badgeBg: 'rgba(167,139,250,0.1)',
  },
  {
    id: 'search-migration',
    title: 'Migration Guide',
    desc: 'Migrating from Search API v1 to v2 — changed endpoints, new parameters, and response differences.',
    badge: null,
  },
  {
    id: 'search-error-codes',
    title: 'Error Codes',
    desc: 'HTTP status codes, error response format, and common error conditions for the Search API.',
    badge: null,
  },
  {
    id: 'search-coverage',
    title: 'Market Coverage',
    desc: 'Countries, regions, and data tiers available in the Search API globally.',
    badge: null,
  },
];

export function SearchPlatformLanding({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Versions &amp; Reference</h1>
        <PageActions pageId="search-platform" pageTitle="Search API Versions & Reference" />
      </div>
      <p className="quick-answer">
        Version history, migration guides, error codes, and market coverage for the TomTom Search API.
      </p>

      <div className="zone">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {VERSION_CARDS.map(({ id, title, desc, badge, badgeColor, badgeBg }) => (
            <button
              key={id}
              onClick={() => onNavigate?.(id, 'search-api')}
              style={{
                background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: '20px', padding: '1.25rem', cursor: 'pointer',
                textAlign: 'left', transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              {badge && (
                <span style={{
                  display: 'inline-block', fontSize: '0.6rem', fontWeight: 700,
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                  padding: '2px 7px', borderRadius: 4,
                  background: badgeBg, color: badgeColor, marginBottom: 8,
                }}>
                  {badge}
                </span>
              )}
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--black)', marginBottom: '0.375rem' }}>{title}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--mid)', lineHeight: 1.5 }}>{desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
