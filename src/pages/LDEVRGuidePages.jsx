import PageActions from '../components/ui/PageActions';

/* ═══════════════════════════════════════════════════════════════════════════
   LDEVR PLATFORM LANDING (Versions & Reference)
   ═══════════════════════════════════════════════════════════════════════════ */

const VERSION_CARDS = [
  {
    id: 'ldevr-tomtom-maps',
    title: 'LDEVR v1',
    desc: 'TomTom Maps platform. POST to /routing/1/calculateLongDistanceEVRoute/. Supports batch and full parameter set.',
    badge: 'V1', badgeColor: '#15803d', badgeBg: 'rgba(34,197,94,0.1)',
  },
  {
    id: 'ldevr-orbis-v2',
    title: 'LDEVR v2',
    desc: 'Orbis Maps v2 — Public Preview. Adds vehicle brand lookup, OEM eMSP support, charging park hours, toll computation, weather and data freshness.',
    badge: 'V2', badgeColor: '#7c3aed', badgeBg: 'rgba(167,139,250,0.1)',
  },
  {
    id: 'ldevr-orbis-v3',
    title: 'LDEVR v3 (Private Preview)',
    desc: 'Orbis Maps v3 — Private Preview. Adds guidance instructions with lane-level detail.',
    badge: 'V3', badgeColor: '#c2410c', badgeBg: 'rgba(251,146,60,0.1)',
  },
  {
    id: 'ldevr-migration',
    title: 'Migration Guide',
    desc: 'Migrating from LDEVR v1 to v2 — endpoint changes, new parameters, and response differences.',
    badge: null,
  },
  {
    id: 'ldevr-errors',
    title: 'Error Codes',
    desc: 'HTTP status codes and error response format for LDEVR API requests.',
    badge: null,
  },
  {
    id: 'ldevr-coverage',
    title: 'Market Coverage',
    desc: 'Countries and regions with real-time EV charging availability and toll data.',
    badge: null,
  },
];

export function LDEVRPlatformLanding({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Versions &amp; Reference</h1>
        <PageActions pageId="ldevr-platform" pageTitle="LDEVR Versions & Reference" />
      </div>
      <p className="quick-answer">
        Version history, migration guide, error codes, and coverage for the TomTom Long Distance EV Routing API.
        Three versions: v1 (TomTom Maps, Production), v2 (Orbis v2, Public Preview), v3 (Orbis v3, Private Preview).
      </p>

      <div className="zone">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {VERSION_CARDS.map(({ id, title, desc, badge, badgeColor, badgeBg }) => (
            <button
              key={id}
              onClick={() => onNavigate?.(id, 'ldevr')}
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
