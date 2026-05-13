import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const codeStyle = {
  background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 12,
  padding: '16px 20px', fontSize: '0.8125rem', lineHeight: 1.7,
  overflowX: 'auto', color: 'var(--black)', fontFamily: 'var(--font-mono)',
  margin: 0,
};

const CODE_HYBRID_LAYERS = `// Hybrid map: satellite base + roads/labels overlay
// tile URL format: /map/1/tile/{layer}/{style}/{zoom}/{x}/{y}.{format}

// Layer options:
//   basic  — full map (roads, polygons, labels)
//   hybrid — roads + labels only (no fill polygons) — TRANSPARENT PNG
//   labels — labels only (no roads) — TRANSPARENT PNG`;

const CODE_LEAFLET_HYBRID = `// Leaflet: Hybrid map (satellite + roads overlay)
const map = L.map('map').setView([52.37403, 4.90279], 14);

// Layer 1: Satellite base (JPG, opaque)
const satellite = L.tileLayer(
  'https://api.tomtom.com/map/1/tile/sat/main/{z}/{x}/{y}.jpg' +
  '?key=YOUR_API_KEY',
  { tileSize: 256, maxZoom: 19 }
).addTo(map);

// Layer 2: Hybrid overlay (PNG with transparency — roads + labels)
const hybrid = L.tileLayer(
  'https://api.tomtom.com/map/1/tile/hybrid/main/{z}/{x}/{y}.png' +
  '?key=YOUR_API_KEY',
  { tileSize: 256, maxZoom: 19, opacity: 1 }
).addTo(map);`;

const CODE_LABELS_ONLY = `// Labels-only overlay (use when traffic tubes cover map labels)
const labels = L.tileLayer(
  'https://api.tomtom.com/map/1/tile/labels/main/{z}/{x}/{y}.png' +
  '?key=YOUR_API_KEY',
  { tileSize: 256 }
);`;

const CODE_NIGHT_HYBRID = `// Night hybrid: dark satellite-style base + night road overlay
// Note: hybrid layer uses 'night' style variant for dark road colours
const hybridNight = L.tileLayer(
  'https://api.tomtom.com/map/1/tile/hybrid/night/{z}/{x}/{y}.png' +
  '?key=YOUR_API_KEY',
  { tileSize: 256 }
);`;

const CODE_TRAFFIC_HYBRID = `// Full stack: satellite + roads + traffic flow
const satellite = L.tileLayer('...sat/main/{z}/{x}/{y}.jpg?key=...').addTo(map);
const hybridRoads = L.tileLayer('...hybrid/main/{z}/{x}/{y}.png?key=...').addTo(map);
const trafficFlow = L.tileLayer(
  'https://api.tomtom.com/traffic/services/4/flowTile/relative0-dark/{z}/{x}/{y}.png?key=...',
  { opacity: 0.7 }
).addTo(map);
const hybridLabels = L.tileLayer('...labels/main/{z}/{x}/{y}.png?key=...').addTo(map);`;

export default function MapGuideHybrid({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Guide: Hybrid Maps</h1>
        <PageActions pageId="map-guide-hybrid" pageTitle="Guide: Hybrid Maps" />
      </div>
      <p className="quick-answer">
        Build a hybrid map by layering a satellite base with a roads-and-labels overlay —
        all using transparent PNG tiles from the Map Display API.
      </p>

      {/* 1. Overview */}
      <div className="zone">
        <h2 className="sh" id="overview">What you'll learn</h2>
        <ul style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
          <li>The three tile layers: <code>basic</code>, <code>hybrid</code>, and <code>labels</code></li>
          <li>How to layer satellite + hybrid in Leaflet</li>
          <li>Adding traffic flow on top of a hybrid map</li>
          <li>Night-mode hybrid maps</li>
          <li>Why overlay tiles must use PNG format</li>
        </ul>
      </div>

      {/* 2. Tile layers explained */}
      <div className="zone">
        <h2 className="sh" id="layers">The three map layers</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          The Maps Raster service provides three distinct layers. <code>basic</code> is a
          complete map. <code>hybrid</code> and <code>labels</code> are overlay tiles that
          use transparency to show through to lower layers:
        </p>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {[
            { layer: 'basic', formats: 'png, jpg', transparent: false, desc: 'Complete map tile: road shapes, geographic fill polygons, borders, and labels. Use as a standalone base map.' },
            { layer: 'hybrid', formats: 'png only', transparent: true, desc: 'Roads, borders, and labels — but NO geographic fill polygons. Overlay on satellite to create a hybrid map. Requires PNG for transparency.' },
            { layer: 'labels', formats: 'png only', transparent: true, desc: 'Labels only — same placement as the basic tile. Use to keep labels visible when other overlays (e.g. traffic tubes) cover the basic layer.' },
          ].map(({ layer, formats, transparent, desc }) => (
            <div key={layer} style={{
              display: 'grid', gridTemplateColumns: '100px 100px 80px 1fr', gap: '0.75rem',
              padding: '0.625rem 0.875rem', background: 'var(--s1)',
              border: '1px solid var(--border)', borderRadius: '10px', alignItems: 'start',
            }}>
              <code style={{ fontSize: '0.75rem', color: 'var(--brand)', fontFamily: 'var(--font-mono)' }}>{layer}</code>
              <code style={{ fontSize: '0.6875rem', color: 'var(--mid)', fontFamily: 'var(--font-mono)' }}>{formats}</code>
              <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: transparent ? '#15803d' : 'var(--muted)' }}>
                {transparent ? 'transparent' : 'opaque'}
              </span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text)' }}>{desc}</span>
            </div>
          ))}
        </div>
        <pre style={{ ...codeStyle, marginTop: '0.75rem' }}>{CODE_HYBRID_LAYERS}</pre>
      </div>

      {/* 3. Leaflet hybrid */}
      <div className="zone">
        <h2 className="sh" id="leaflet-hybrid">Hybrid map in Leaflet</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          Layer order in Leaflet: add satellite first (lowest layer), then hybrid on top.
          Both use the same tile grid, so they align perfectly:
        </p>
        <pre style={codeStyle}>{CODE_LEAFLET_HYBRID}</pre>
        <Callout type="info">
          Satellite tiles are only available up to zoom 19. Cap both layers at
          <code> maxZoom: 19</code> or fall back to basic map tiles above that level.
        </Callout>
      </div>

      {/* 4. Labels only */}
      <div className="zone">
        <h2 className="sh" id="labels-overlay">Labels-only overlay</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          When you add traffic flow tiles between the base map and labels, road labels can
          be obscured by the coloured tubes. Add a <code>labels</code> overlay on top of
          everything to keep them visible:
        </p>
        <pre style={codeStyle}>{CODE_LABELS_ONLY}</pre>
      </div>

      {/* 5. Night hybrid */}
      <div className="zone">
        <h2 className="sh" id="night">Night-mode hybrid</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          Switch to the <code>night</code> style variant for the hybrid overlay to get
          dark-themed road and label colours that complement dark satellite imagery at night:
        </p>
        <pre style={codeStyle}>{CODE_NIGHT_HYBRID}</pre>
      </div>

      {/* 6. Full stack with traffic */}
      <div className="zone">
        <h2 className="sh" id="full-stack">Full stack with traffic overlay</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          For a complete live traffic satellite view, stack four layers in this order
          (bottom to top):
        </p>
        <ol style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.8, paddingLeft: '1.25rem', marginBottom: '0.75rem' }}>
          <li>Satellite base (JPG)</li>
          <li>Hybrid roads overlay (PNG, no fill polygons)</li>
          <li>Traffic flow overlay (PNG, transparent)</li>
          <li>Labels overlay (PNG, keeps labels visible over traffic)</li>
        </ol>
        <pre style={codeStyle}>{CODE_TRAFFIC_HYBRID}</pre>
      </div>

      {/* 7. Pitfalls */}
      <div className="zone">
        <Callout type="warn" title="Common pitfalls">
          <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.8 }}>
            <li>Requesting <code>hybrid</code> or <code>labels</code> tiles as JPG — these layers require PNG for transparency. JPG requests return an opaque tile.</li>
            <li>Not capping satellite zoom at 19 — requesting satellite tiles above zoom 19 returns an error.</li>
            <li>Adding layers in the wrong order — satellite must be underneath hybrid, not on top.</li>
            <li>Using <code>basic</code> layer instead of <code>hybrid</code> for the overlay — basic tiles include fill polygons and will completely cover the satellite layer.</li>
          </ul>
        </Callout>
      </div>

      {/* 8. Next steps */}
      <div className="zone">
        <h2 className="sh" id="next-steps">Next steps</h2>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="page-action-btn" onClick={() => onNavigate?.('map-raster-tile', 'map-display-api')}>
            Raster Tile reference
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('map-satellite-tile', 'map-display-api')}>
            Satellite Tile reference
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('traffic-guide-tiles', 'traffic-api')}>
            Guide: Traffic tiles
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('map-guide-styles', 'map-display-api')}>
            Guide: Map styles
          </button>
        </div>
      </div>
    </div>
  );
}
