import PageActions from '../components/ui/PageActions';

/* ═══════════════════════════════════════════════════════════════════════════
   EV CHARGING GUIDES LANDING
   ═══════════════════════════════════════════════════════════════════════════ */

const GUIDE_CARDS = [
  {
    id: 'ev-guide-discovery',
    title: 'Station Discovery Patterns',
    desc: 'Find EV charging stations near a coordinate, along a route, and within a custom geometry using category set 7309.',
  },
  {
    id: 'ev-guide-connectors',
    title: 'Connector Type Filtering',
    desc: 'Filter stations by connector type (CCS, CHAdeMO, Type 2, etc.) using the connectorSet parameter.',
  },
  {
    id: 'ev-guide-jmespath',
    title: 'JMESPath Response Filtering',
    desc: 'Use JMESPath expressions in V2 to extract only the fields you need from the search response (Orbis Maps only).',
  },
];

export function EVChargingGuidesLanding({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>How-to Guides</h1>
        <PageActions pageId="ev-charging-guides" pageTitle="EV & Charging API How-to Guides" />
      </div>
      <p className="quick-answer">
        Guides for building EV-ready applications with the TomTom EV &amp; Charging API —
        station discovery patterns, connector filtering, and V2-specific response manipulation.
      </p>

      <div className="zone">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {GUIDE_CARDS.map(({ id, title, desc }) => (
            <button
              key={id}
              onClick={() => onNavigate?.(id, 'ev-charging-api')}
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
   EV CHARGING PLATFORM LANDING (Versions & Reference)
   ═══════════════════════════════════════════════════════════════════════════ */

const VERSION_CARDS = [
  {
    id: 'ev-tomtom-maps',
    title: 'EV & Charging API v1',
    desc: 'TomTom Maps platform. EV station search and charging availability at /search/2/.',
    badge: 'V1', badgeColor: '#15803d', badgeBg: 'rgba(34,197,94,0.1)',
  },
  {
    id: 'ev-orbis-maps',
    title: 'EV & Charging API v2',
    desc: 'Orbis Maps platform. Adds JMESPath filtering and enhanced charging park data.',
    badge: 'V2', badgeColor: '#7c3aed', badgeBg: 'rgba(167,139,250,0.1)',
  },
  {
    id: 'ev-connector-types',
    title: 'Supported Connector Types',
    desc: 'Full reference list of connector type IDs — CCS, CHAdeMO, Type 2, Tesla, and more.',
    badge: null,
  },
  {
    id: 'ev-error-codes',
    title: 'Error Codes',
    desc: 'HTTP status codes and error response format for EV & Charging API requests.',
    badge: null,
  },
  {
    id: 'ev-charging-coverage',
    title: 'Market Coverage',
    desc: 'Countries with real-time charging availability data vs. static station data.',
    badge: null,
  },
];

export function EVChargingPlatformLanding({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Versions &amp; Reference</h1>
        <PageActions pageId="ev-charging-platform" pageTitle="EV & Charging API Versions & Reference" />
      </div>
      <p className="quick-answer">
        Version history, connector type reference, error codes, and market coverage for the
        TomTom EV &amp; Charging API. Real-time availability in Europe and North America; static data globally.
      </p>

      <div className="zone">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {VERSION_CARDS.map(({ id, title, desc, badge, badgeColor, badgeBg }) => (
            <button
              key={id}
              onClick={() => onNavigate?.(id, 'ev-charging-api')}
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
