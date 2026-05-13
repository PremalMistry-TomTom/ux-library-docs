import PageActions from '../components/ui/PageActions';

/* ═══════════════════════════════════════════════════════════════════════════
   TRAFFIC GUIDES LANDING
   ═══════════════════════════════════════════════════════════════════════════ */

const GUIDE_CARDS = [
  {
    id: 'traffic-guide-tiles',
    title: 'Rendering Traffic Tiles',
    desc: 'Overlay raster and vector traffic tiles on a map — tile URL construction, cache strategies, and refresh timing.',
  },
  {
    id: 'traffic-guide-flow',
    title: 'Flow Data in Your App',
    desc: 'Use Flow Segment Data to display per-road speed data, calculate congestion levels, and update ETAs.',
  },
  {
    id: 'traffic-guide-model',
    title: 'Using Traffic Model ID',
    desc: 'Invalidate tile caches reliably by polling the Traffic Model ID endpoint to detect data updates.',
  },
];

export function TrafficGuidesLanding({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>How-to Guides</h1>
        <PageActions pageId="traffic-guides" pageTitle="Traffic API How-to Guides" />
      </div>
      <p className="quick-answer">
        Guides for working with the TomTom Traffic API — rendering traffic overlays,
        consuming live flow data, and managing tile cache invalidation.
      </p>

      <div className="zone">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {GUIDE_CARDS.map(({ id, title, desc }) => (
            <button
              key={id}
              onClick={() => onNavigate?.(id, 'traffic-api')}
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
   TRAFFIC PLATFORM LANDING (Versions & Reference)
   ═══════════════════════════════════════════════════════════════════════════ */

const VERSION_CARDS = [
  {
    id: 'traffic-tomtom-maps',
    title: 'Traffic API v1',
    desc: 'TomTom Maps platform. Flow at /traffic/services/4/, incidents at /traffic/services/5/, tiles at /traffic/map/4/.',
    badge: 'V1', badgeColor: '#15803d', badgeBg: 'rgba(34,197,94,0.1)',
  },
  {
    id: 'traffic-orbis-maps',
    title: 'Traffic API v2',
    desc: 'Orbis Maps platform. Adds extended flow/incident tiles and production details endpoint.',
    badge: 'V2', badgeColor: '#7c3aed', badgeBg: 'rgba(167,139,250,0.1)',
  },
  {
    id: 'traffic-migration',
    title: 'Migration Guide',
    desc: 'Migrating from Traffic API v1 to v2 — base URL changes and new tile styles.',
    badge: null,
  },
  {
    id: 'traffic-error-codes',
    title: 'Error Codes',
    desc: 'HTTP status codes and error response format for the Traffic API.',
    badge: null,
  },
  {
    id: 'traffic-coverage',
    title: 'Market Coverage',
    desc: 'Real-time traffic coverage regions and data refresh rates worldwide.',
    badge: null,
  },
];

export function TrafficPlatformLanding({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Versions &amp; Reference</h1>
        <PageActions pageId="traffic-platform" pageTitle="Traffic API Versions & Reference" />
      </div>
      <p className="quick-answer">
        Version history, migration guide, error codes, and coverage information for the TomTom Traffic API.
        Data is refreshed approximately every minute; tile CDN cache is typically 30–60 seconds.
      </p>

      <div className="zone">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {VERSION_CARDS.map(({ id, title, desc, badge, badgeColor, badgeBg }) => (
            <button
              key={id}
              onClick={() => onNavigate?.(id, 'traffic-api')}
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
