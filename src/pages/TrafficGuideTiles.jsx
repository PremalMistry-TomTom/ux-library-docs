import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const codeStyle = {
  background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 12,
  padding: '16px 20px', fontSize: '0.8125rem', lineHeight: 1.7,
  overflowX: 'auto', color: 'var(--black)', fontFamily: 'var(--font-mono)',
  margin: 0,
};

const CODE_RASTER_FLOW = `# Raster flow tile — absolute style (km/h colour scale), 256px
GET https://api.tomtom.com/traffic/services/4/flowTile/absolute/{zoom}/{x}/{y}.png
  ?key=YOUR_API_KEY

# Example: zoom 10, tile 527/340
GET https://api.tomtom.com/traffic/services/4/flowTile/absolute/10/527/340.png
  ?key=YOUR_API_KEY`;

const CODE_RASTER_INCIDENT = `# Raster incident tile — icon overlay, 256px
GET https://api.tomtom.com/traffic/services/4/incidentTile/{style}/{zoom}/{x}/{y}.png
  ?key=YOUR_API_KEY
  &t={trafficModelId}

# style options: s1 (default), s2, s3, night`;

const CODE_VECTOR_FLOW = `# Vector flow tile (PBF/MVT format)
GET https://api.tomtom.com/traffic/services/4/flowTile/relative0/{zoom}/{x}/{y}.pbf
  ?key=YOUR_API_KEY`;

const CODE_LEAFLET = `// Leaflet: add TomTom raster flow tiles as an overlay layer
const map = L.map('map').setView([52.37, 4.90], 12);

// Base map
L.tileLayer(
  'https://api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.png?key=YOUR_API_KEY',
  { tileSize: 256 }
).addTo(map);

// Traffic flow overlay (transparent PNG on top)
L.tileLayer(
  'https://api.tomtom.com/traffic/services/4/flowTile/relative0-dark/{z}/{x}/{y}.png?key=YOUR_API_KEY',
  { tileSize: 256, opacity: 0.8 }
).addTo(map);`;

export default function TrafficGuideTiles({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Guide: Traffic Tiles</h1>
        <PageActions pageId="traffic-guide-tiles" pageTitle="Guide: Traffic Tiles" />
      </div>
      <p className="quick-answer">
        Learn how to overlay traffic flow and incident tiles on your map — raster tiles for
        simple integration, vector tiles for fully custom styling.
      </p>

      {/* 1. Overview */}
      <div className="zone">
        <h2 className="sh" id="overview">What you'll learn</h2>
        <ul style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
          <li>Raster flow tiles vs. vector flow tiles — when to use each</li>
          <li>All available flow tile styles and their colour semantics</li>
          <li>Raster and vector incident tiles</li>
          <li>How to overlay traffic tiles in Leaflet</li>
          <li>Using the Traffic Model ID for consistency across tile calls</li>
        </ul>
      </div>

      {/* 2. Tile types */}
      <div className="zone">
        <h2 className="sh" id="tile-types">Traffic tile types</h2>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {[
            { type: 'Raster Flow', format: 'PNG', version: 'v4', desc: '256×256 or 512×512 transparent PNG. Shows traffic speed using colour bands. Layer on top of any base map. Zero client-side rendering needed.' },
            { type: 'Vector Flow', format: 'PBF', version: 'v4', desc: 'Mapbox Vector Tile format. Use with a MapLibre GL style to render custom colours, line widths, and detail levels on the client.' },
            { type: 'Raster Incident', format: 'PNG', version: 'v4', desc: '256×256 transparent PNG with incident icons (construction, accident, etc.). Layer on top of your base map.' },
            { type: 'Vector Incident', format: 'PBF', version: 'v4', desc: 'Vector tiles with structured incident geometry. Enables custom icon rendering and interactive click events.' },
          ].map(t => (
            <div key={t.type} style={{
              display: 'grid', gridTemplateColumns: '180px 60px 60px 1fr', gap: '0.75rem',
              padding: '0.625rem 0.875rem', background: 'var(--s1)',
              border: '1px solid var(--border)', borderRadius: '10px', alignItems: 'start',
            }}>
              <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--black)' }}>{t.type}</span>
              <code style={{ fontSize: '0.75rem', color: 'var(--brand)', fontFamily: 'var(--font-mono)' }}>{t.format}</code>
              <code style={{ fontSize: '0.6875rem', color: 'var(--mid)', fontFamily: 'var(--font-mono)' }}>{t.version}</code>
              <span style={{ fontSize: '0.8125rem', color: 'var(--mid)' }}>{t.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Flow tile styles */}
      <div className="zone">
        <h2 className="sh" id="flow-styles">Flow tile styles</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          The <code>style</code> path segment controls the colour scheme of flow tiles:
        </p>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {[
            { style: 'absolute', desc: 'Colour based on absolute speed in km/h. Dark grey = standstill; green = 120+ km/h.' },
            { style: 'relative', desc: 'Colour based on speed relative to free-flow. Red = heavy delay; green = free-flow.' },
            { style: 'relative0', desc: 'Same as relative but includes full free-flow in green (0 delay = bright green).' },
            { style: 'relative0-dark', desc: 'Dark variant of relative0 — better contrast on dark base maps.' },
            { style: 'reduced-sensitivity', desc: 'Less sensitive to minor delays; useful for high-level traffic overview maps.' },
          ].map(({ style, desc }) => (
            <div key={style} style={{
              display: 'grid', gridTemplateColumns: '200px 1fr', gap: '0.75rem',
              padding: '0.5rem 0.875rem', background: 'var(--s1)',
              border: '1px solid var(--border)', borderRadius: '10px', alignItems: 'start',
            }}>
              <code style={{ fontSize: '0.75rem', color: 'var(--brand)', fontFamily: 'var(--font-mono)' }}>{style}</code>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text)' }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Raster tile URLs */}
      <div className="zone">
        <h2 className="sh" id="raster-urls">Raster tile URLs</h2>
        <pre style={codeStyle}>{CODE_RASTER_FLOW}</pre>
        <p style={{ marginTop: '1rem', fontSize: '0.8125rem', color: 'var(--mid)', marginBottom: '0.5rem' }}>
          Raster incident tiles:
        </p>
        <pre style={codeStyle}>{CODE_RASTER_INCIDENT}</pre>
      </div>

      {/* 5. Vector tile URL */}
      <div className="zone">
        <h2 className="sh" id="vector-url">Vector tile URL</h2>
        <pre style={codeStyle}>{CODE_VECTOR_FLOW}</pre>
        <Callout type="info">
          Vector flow tiles require a client-side renderer (MapLibre GL or Mapbox GL JS) with
          a custom layer style. The tile contains speed and road type attributes you can use
          for custom colour rules.
        </Callout>
      </div>

      {/* 6. Leaflet integration */}
      <div className="zone">
        <h2 className="sh" id="leaflet">Leaflet integration example</h2>
        <pre style={codeStyle}>{CODE_LEAFLET}</pre>
      </div>

      {/* 7. Traffic Model ID */}
      <div className="zone">
        <h2 className="sh" id="model-id">Keeping tiles in sync</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          When displaying multiple tile layers (e.g. flow + incidents), use the same Traffic
          Model ID (<code>t</code> parameter) on all requests to ensure they show data from
          the same moment in time. The Traffic Model ID is valid for 2 minutes and is
          returned in the response headers of any tile request.
        </p>
        <Callout type="info" title="Traffic Model ID">
          Without a consistent <code>t</code> parameter, flow and incident tiles may show
          data from different moments — causing visual mismatches at tile boundaries.
          See the Traffic Model ID guide for how to obtain and use it.
        </Callout>
      </div>

      {/* 8. Pitfalls */}
      <div className="zone">
        <Callout type="warn" title="Common pitfalls">
          <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.8 }}>
            <li>Using <code>.jpg</code> for overlay tiles — flow and incident tiles must be <code>.png</code> (they use transparency).</li>
            <li>Not matching the Traffic Model ID across tile layers — data will be from different minutes.</li>
            <li>Using flow tiles without a base map — they are transparent overlays and show nothing on their own.</li>
            <li>Mixing v4 and v5 incident endpoints without updating the Traffic Model ID format.</li>
          </ul>
        </Callout>
      </div>

      {/* 9. Next steps */}
      <div className="zone">
        <h2 className="sh" id="next-steps">Next steps</h2>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="page-action-btn" onClick={() => onNavigate?.('traffic-flow-tiles', 'traffic-api')}>
            Flow Tiles reference
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('traffic-raster-flow', 'traffic-api')}>
            Raster Flow Tiles
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('traffic-raster-incident', 'traffic-api')}>
            Raster Incident Tiles
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('traffic-guide-model', 'traffic-api')}>
            Guide: Traffic Model ID
          </button>
        </div>
      </div>
    </div>
  );
}
