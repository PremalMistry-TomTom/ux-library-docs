import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const codeStyle = {
  background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 12,
  padding: '16px 20px', fontSize: '0.8125rem', lineHeight: 1.7,
  overflowX: 'auto', color: 'var(--black)', fontFamily: 'var(--font-mono)',
  margin: 0,
};

const CODE_METADATA = `# List available style resources
curl "https://api.tomtom.com/map/1/style/metadata.json?key=YOUR_API_KEY"`;

const CODE_STYLE_JSON = `# Fetch a specific merged style (for MapLibre GL / Mapbox GL)
curl "https://api.tomtom.com/map/1/style/20.0.0-8/merged.json?key=YOUR_API_KEY"`;

const CODE_SPRITE = `# Fetch sprite metadata (icon atlas for the style)
curl "https://api.tomtom.com/map/1/sprite/20.0.0-8/metadata.json?key=YOUR_API_KEY"

# Fetch sprite image (PNG atlas)
curl "https://api.tomtom.com/map/1/sprite/20.0.0-8/sprite@2x.png?key=YOUR_API_KEY"`;

const CODE_MAPLIBRE = `// Use TomTom style with MapLibre GL JS
import maplibregl from 'maplibre-gl';

const map = new maplibregl.Map({
  container: 'map',
  style: \`https://api.tomtom.com/map/1/style/20.0.0-8/merged.json?key=YOUR_API_KEY\`,
  center: [4.90279, 52.37403],
  zoom: 12,
});`;

const CODE_NIGHT = `// Switch to night style
map.setStyle(
  \`https://api.tomtom.com/map/1/style/20.0.0-8/merged.json?key=YOUR_API_KEY&mapTheme=night\`
);`;

const CODE_CUSTOM_LAYER = `// Override a specific layer colour in the style
map.on('style.load', () => {
  // Change water fill colour
  map.setPaintProperty('water', 'fill-color', '#1a3a5c');

  // Hide administrative boundaries
  map.setLayoutProperty('Admin-order1-boundary', 'visibility', 'none');
});`;

export default function MapGuideStyles({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Guide: Map Styles</h1>
        <PageActions pageId="map-guide-styles" pageTitle="Guide: Map Styles" />
      </div>
      <p className="quick-answer">
        Learn how to use and customise TomTom map styles — fetch style JSON for vector
        map rendering, switch between day and night themes, and override individual
        layers for brand customisation.
      </p>

      {/* 1. Overview */}
      <div className="zone">
        <h2 className="sh" id="overview">What you'll learn</h2>
        <ul style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
          <li>What the Map Styles service provides</li>
          <li>Fetching style metadata and merged style JSON</li>
          <li>Using TomTom styles with MapLibre GL</li>
          <li>Switching between main (day) and night themes</li>
          <li>Customising individual layers</li>
        </ul>
      </div>

      {/* 2. What map styles are */}
      <div className="zone">
        <h2 className="sh" id="what-are-styles">What the Map Styles service provides</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          The Map Styles service delivers the resources required to render vector map tiles.
          It consists of four methods:
        </p>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {[
            { method: 'Metadata method', desc: 'Lists available resources of a selected type (styles, sprites, glyphs).' },
            { method: 'Resource method', desc: 'Retrieves a specific named resource file.' },
            { method: 'Merged style method', desc: 'Returns a complete Mapbox/MapLibre GL style JSON with all layers pre-merged.' },
            { method: 'Merged sprite method', desc: 'Returns a combined sprite sheet with all map icons for the selected style version.' },
          ].map(({ method, desc }) => (
            <div key={method} style={{
              display: 'grid', gridTemplateColumns: '200px 1fr', gap: '0.75rem',
              padding: '0.5rem 0.875rem', background: 'var(--s1)',
              border: '1px solid var(--border)', borderRadius: '10px', alignItems: 'start',
            }}>
              <span style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--brand)' }}>{method}</span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--mid)' }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Fetch metadata */}
      <div className="zone">
        <h2 className="sh" id="metadata">Fetching style metadata</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          Start by listing available style versions:
        </p>
        <pre style={codeStyle}>{CODE_METADATA}</pre>
      </div>

      {/* 4. Fetch style JSON */}
      <div className="zone">
        <h2 className="sh" id="style-json">Fetching merged style JSON</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          The merged style endpoint returns a complete Mapbox/MapLibre GL style document —
          all layers, sources, and sprite references in one JSON:
        </p>
        <pre style={codeStyle}>{CODE_STYLE_JSON}</pre>
        <p style={{ fontSize: '0.8125rem', color: 'var(--mid)', marginTop: '1rem', marginBottom: '0.5rem' }}>
          Fetch sprite resources separately if needed:
        </p>
        <pre style={codeStyle}>{CODE_SPRITE}</pre>
      </div>

      {/* 5. MapLibre integration */}
      <div className="zone">
        <h2 className="sh" id="maplibre">MapLibre GL integration</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          Pass the merged style URL directly to MapLibre GL's <code>style</code> option.
          MapLibre will fetch the style JSON and automatically request the vector tiles,
          sprites, and glyphs it needs:
        </p>
        <pre style={codeStyle}>{CODE_MAPLIBRE}</pre>
      </div>

      {/* 6. Day/Night theme */}
      <div className="zone">
        <h2 className="sh" id="day-night">Day and night themes</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          Append <code>mapTheme=night</code> to the style URL to switch to the dark night
          theme. You can dynamically change the style at runtime with <code>map.setStyle()</code>:
        </p>
        <pre style={codeStyle}>{CODE_NIGHT}</pre>
        <Callout type="info">
          When switching styles, any programmatic layer customisations made with
          <code> setPaintProperty</code> or <code>setLayoutProperty</code> must be
          reapplied on the <code>style.load</code> event.
        </Callout>
      </div>

      {/* 7. Custom layers */}
      <div className="zone">
        <h2 className="sh" id="custom-layers">Customising individual layers</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          After the style loads, override individual layer properties to match your brand.
          Use <code>map.setPaintProperty()</code> for colours and <code>map.setLayoutProperty()</code>
          for visibility:
        </p>
        <pre style={codeStyle}>{CODE_CUSTOM_LAYER}</pre>
        <Callout type="info">
          For more advanced customisation, download the style JSON, modify it locally, and
          host it on your own server. Use{' '}
          <a href="https://mapmaker.tomtom.com" target="_blank" rel="noreferrer"
            style={{ color: 'var(--brand)' }}>TomTom Map Maker</a>
          {' '}for a visual style editor.
        </Callout>
      </div>

      {/* 8. URL parameters */}
      <div className="zone">
        <h2 className="sh" id="parameters">Style endpoint parameters</h2>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {[
            { param: 'resourceType', desc: 'style, sprite, or glyph.' },
            { param: 'resourceVersion', desc: 'Style version string (e.g. 20.0.0-8). Get from metadata endpoint.' },
            { param: 'resourceVariant', desc: 'Style variant (e.g. main, night).' },
            { param: 'mapTheme', desc: 'main (day) or night. Appended to merged style requests.' },
          ].map(({ param, desc }) => (
            <div key={param} style={{
              display: 'grid', gridTemplateColumns: '160px 1fr', gap: '0.75rem',
              padding: '0.5rem 0.875rem', background: 'var(--s1)',
              border: '1px solid var(--border)', borderRadius: '10px', alignItems: 'start',
            }}>
              <code style={{ fontSize: '0.75rem', color: 'var(--brand)', fontFamily: 'var(--font-mono)' }}>{param}</code>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text)' }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 9. Pitfalls */}
      <div className="zone">
        <Callout type="warn" title="Common pitfalls">
          <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.8 }}>
            <li>Hardcoding a style version — use the metadata endpoint to discover the latest version dynamically.</li>
            <li>Not reapplying customisations after <code>setStyle()</code> — layer property overrides are lost when the style changes.</li>
            <li>Fetching the style JSON client-side with the API key in the URL — the key will be exposed. Proxy style requests through your backend.</li>
          </ul>
        </Callout>
      </div>

      {/* 10. Next steps */}
      <div className="zone">
        <h2 className="sh" id="next-steps">Next steps</h2>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="page-action-btn" onClick={() => onNavigate?.('map-assets-api', 'map-display-api')}>
            Map Assets reference
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('map-vector-tile', 'map-display-api')}>
            Vector Tiles
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('map-guide-zoom', 'map-display-api')}>
            Guide: Zoom levels
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('map-guide-hybrid', 'map-display-api')}>
            Guide: Hybrid maps
          </button>
        </div>
      </div>
    </div>
  );
}
