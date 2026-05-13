import PageActions from '../components/ui/PageActions';

/* ═══════════════════════════════════════════════════════════════════════════
   MAP DISPLAY GUIDES LANDING
   ═══════════════════════════════════════════════════════════════════════════ */

const GUIDE_CARDS = [
  {
    id: 'map-guide-zoom',
    title: 'Zoom Levels & Tile Grid',
    desc: 'Understanding the Spherical Mercator tile grid (EPSG:3857), zoom 0–22, tile coordinates, and resolution.',
  },
  {
    id: 'map-guide-styles',
    title: 'Map Styles & Customisation',
    desc: 'Load TomTom vector tile styles into MapLibre GL or Mapbox GL JS and customise layers and colours.',
  },
  {
    id: 'map-guide-hybrid',
    title: 'Building a Hybrid Map',
    desc: 'Combine satellite imagery tiles with road/label overlays to create a hybrid basemap.',
  },
];

export function MapDisplayGuidesLanding({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>How-to Guides</h1>
        <PageActions pageId="map-guides" pageTitle="Map Display API How-to Guides" />
      </div>
      <p className="quick-answer">
        Guides for working with the TomTom Map Display API — tile grid fundamentals,
        vector tile styling, and hybrid map composition.
      </p>

      <div className="zone">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {GUIDE_CARDS.map(({ id, title, desc }) => (
            <button
              key={id}
              onClick={() => onNavigate?.(id, 'map-display-api')}
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
   MAP DISPLAY PLATFORM LANDING (Versions & Reference)
   ═══════════════════════════════════════════════════════════════════════════ */

const VERSION_CARDS = [
  {
    id: 'map-tomtom-maps',
    title: 'Map Display API v1',
    desc: 'TomTom Maps platform. Raster tiles, satellite, hillshade, static image, WMS, WMTS at /map/1/.',
    badge: 'V1', badgeColor: '#15803d', badgeBg: 'rgba(34,197,94,0.1)',
  },
  {
    id: 'map-orbis-maps',
    title: 'Map Display API v2',
    desc: 'Orbis Maps platform. Adds 3D landmarks, extended tiles, lane-level vector tiles.',
    badge: 'V2', badgeColor: '#7c3aed', badgeBg: 'rgba(167,139,250,0.1)',
  },
  {
    id: 'map-migration',
    title: 'Migration Guide',
    desc: 'Migrating from v1 to v2 — URL changes, new tile types, and MapLibre GL integration.',
    badge: null,
  },
  {
    id: 'map-error-codes',
    title: 'Error Codes',
    desc: 'HTTP status codes and error response format for Map Display API requests.',
    badge: null,
  },
  {
    id: 'map-coverage',
    title: 'Market Coverage',
    desc: 'Global map data coverage, regional detail levels, and update frequencies.',
    badge: null,
  },
];

export function MapDisplayPlatformLanding({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Versions &amp; Reference</h1>
        <PageActions pageId="map-platform" pageTitle="Map Display API Versions & Reference" />
      </div>
      <p className="quick-answer">
        Version history, migration guide, error codes, and coverage for the TomTom Map Display API.
        V1 uses Spherical Mercator (EPSG:3857); V2 adds Orbis-native tile types.
      </p>

      <div className="zone">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {VERSION_CARDS.map(({ id, title, desc, badge, badgeColor, badgeBg }) => (
            <button
              key={id}
              onClick={() => onNavigate?.(id, 'map-display-api')}
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
