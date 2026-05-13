import PageActions from '../components/ui/PageActions';

/* ═══════════════════════════════════════════════════════════════════════════
   GEOCODING GUIDES LANDING
   ═══════════════════════════════════════════════════════════════════════════ */

const GUIDE_CARDS = [
  {
    id: 'geocoding-guide-accuracy',
    title: 'Improving Accuracy',
    desc: 'Use countrySet, geoBias, and entityType filtering to get higher-precision geocode results.',
  },
  {
    id: 'geocoding-guide-batch',
    title: 'Batch Geocoding',
    desc: 'Process large lists of addresses efficiently using the Batch Search API with geocode queries.',
  },
  {
    id: 'geocoding-guide-structured',
    title: 'Structured vs Free-form',
    desc: 'When to use Structured Geocode vs free-form geocoding — tradeoffs in precision and flexibility.',
  },
];

export function GeocodingGuidesLanding({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>How-to Guides</h1>
        <PageActions pageId="geocoding-guides" pageTitle="Geocoding API How-to Guides" />
      </div>
      <p className="quick-answer">
        Guides for working with the TomTom Geocoding API — improving match accuracy,
        batch processing addresses, and choosing between geocoding approaches.
      </p>

      <div className="zone">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {GUIDE_CARDS.map(({ id, title, desc }) => (
            <button
              key={id}
              onClick={() => onNavigate?.(id, 'geocoding-api')}
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
   GEOCODING PLATFORM LANDING (Versions & Reference)
   ═══════════════════════════════════════════════════════════════════════════ */

const VERSION_CARDS = [
  {
    id: 'geocoding-tomtom-maps',
    title: 'Geocoding API v1',
    desc: 'Legacy TomTom Maps platform. Service version 2 at api.tomtom.com/search/2/geocode/.',
    badge: 'V1', badgeColor: '#15803d', badgeBg: 'rgba(34,197,94,0.1)',
  },
  {
    id: 'geocoding-orbis-v1',
    title: 'Geocoding API v2',
    desc: 'Orbis Maps v1. Adds Copyrights endpoint and extended postal codes.',
    badge: 'V2', badgeColor: '#7c3aed', badgeBg: 'rgba(167,139,250,0.1)',
  },
  {
    id: 'geocoding-orbis-v2',
    title: 'Geocoding API v3',
    desc: 'Orbis Maps v2 — Public Preview. Enhanced address parsing and global coverage improvements.',
    badge: 'V3', badgeColor: '#c2410c', badgeBg: 'rgba(251,146,60,0.1)',
  },
  {
    id: 'geocoding-migration',
    title: 'Migration Guide',
    desc: 'Migrating from Geocoding API v1/v2 to v3 — endpoint changes and new request formats.',
    badge: null,
  },
  {
    id: 'geocoding-error-codes',
    title: 'Error Codes',
    desc: 'HTTP status codes and error response format for the Geocoding API.',
    badge: null,
  },
  {
    id: 'geocoding-coverage',
    title: 'Market Coverage',
    desc: 'Countries and address precision levels available across all three geocoding API versions.',
    badge: null,
  },
];

export function GeocodingPlatformLanding({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Versions &amp; Reference</h1>
        <PageActions pageId="geocoding-platform" pageTitle="Geocoding API Versions & Reference" />
      </div>
      <p className="quick-answer">
        Version history, migration paths, error codes, and market coverage for the TomTom Geocoding API.
        Three versions are available: v1 (TomTom Maps), v2 (Orbis v1), and v3 (Orbis v2, Public Preview).
      </p>

      <div className="zone">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {VERSION_CARDS.map(({ id, title, desc, badge, badgeColor, badgeBg }) => (
            <button
              key={id}
              onClick={() => onNavigate?.(id, 'geocoding-api')}
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
