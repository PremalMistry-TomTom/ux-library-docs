import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';

/* ─── Code examples ──────────────────────────────────────────────────────────── */
const CODE_AUTH = `curl "https://api.tomtom.com/map/1/tile/basic/main/10/527/340.png?key=YOUR_API_KEY"`;

const CODE_FIRST_TILE = `# Raster map tile — zoom 10, basic/main style, 512 px
# Tile x=527, y=340 covers central Netherlands at zoom 10
curl "https://api.tomtom.com/map/1/tile/basic/main/10/527/340.png\\
  ?key=YOUR_API_KEY\\
  &tileSize=512" \\
  --output tile.png`;

const CODE_RESPONSE = `# Response: binary PNG image (200 OK)
# Content-Type: image/png
# Content-Length: ~12000 bytes

# Saved as tile.png — ready to display in a browser <img> or mapping library`;

export default function MapDisplayQuickstart({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Getting Started</h1>
        <PageActions pageId="map-quickstart" pageTitle="Map Display API — Getting Started" />
      </div>
      <p className="quick-answer">
        Understand how the Map Display API works, authenticate with an API key, and know which
        version to use. Ready to build? Jump straight into the live API Explorer.
      </p>

      {/* ── 1. Authentication ── */}
      <div className="zone">
        <h2 className="sh" id="authentication">Authentication</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
          All Map Display API requests require an API key passed as the <code>key</code> query
          parameter. You can generate a key in the{' '}
          <a href="https://developer.tomtom.com" target="_blank" rel="noreferrer"
            style={{ color: 'var(--brand)' }}>TomTom Developer Portal</a>.
        </p>
        <CodeBlock code={CODE_AUTH} language="bash" />
        <Callout type="info" title="Keep your key secret">
          Never expose your API key in client-side JavaScript. For browser apps, proxy
          tile requests through your own backend or use a server-side tile proxy.
        </Callout>
      </div>

      {/* ── 2. Your first tile ── */}
      <div className="zone">
        <h2 className="sh" id="first-tile">Your first tile</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          The tile URL format is{' '}
          <code>/map/1/tile/{'{layer}'}/{'{style}'}/{'{z}'}/{'{x}'}/{'{y}'}.{'{format}'}</code>.
          The example below requests a 512 px raster tile at zoom 10 over central Netherlands.
        </p>

        {/* Explorer CTA */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 16, padding: '14px 18px',
          background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 16,
          marginBottom: '1rem',
        }}>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--black)', marginBottom: 3 }}>
              Try it live in the API Explorer
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', lineHeight: 1.45 }}>
              Render tiles in real time, switch styles and zoom levels, preview static images — all in one place.
            </div>
          </div>
          <button
            className="page-action-btn"
            style={{ flexShrink: 0 }}
            onClick={() => onNavigate?.('map-display-explorer', 'map-display-api')}
          >
            Open API Explorer →
          </button>
        </div>

        <p style={{ color: 'var(--mid)', fontSize: '0.8125rem', margin: '0 0 0.5rem' }}>
          Equivalent cURL request:
        </p>
        <CodeBlock code={CODE_FIRST_TILE} language="bash" />

        <p style={{ color: 'var(--mid)', fontSize: '0.8125rem', margin: '1rem 0 0.5rem' }}>
          Response:
        </p>
        <CodeBlock code={CODE_RESPONSE} language="bash" />
      </div>

      {/* ── 3. Understanding the tile system ── */}
      <div className="zone">
        <h2 className="sh" id="response-structure">Understanding the tile system</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          Each URL parameter controls what you see in the tile:
        </p>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {[
            { key: 'layer', desc: 'Visual content: basic (full map), hybrid (roads+labels over transparent fill for satellite overlay), labels (text-only), poi (points of interest icons).' },
            { key: 'style', desc: 'Colour scheme: main (day), night. For satellite tiles use sat. Raster also supports street-light and street-dark in Orbis v2.' },
            { key: 'z / x / y', desc: 'XYZ tile coordinates. z is zoom level 0–22. x and y identify the tile column and row. Libraries like Leaflet and MapLibre compute these automatically.' },
            { key: 'format', desc: 'Image format: png (supports transparency — required for hybrid/labels overlay), jpg (smaller, for satellite base tiles), pbf (vector tiles).' },
            { key: 'tileSize', desc: 'Tile pixel size: 256 (default) or 512. Use 512 for high-DPI / Retina displays. The tile coordinate system stays the same regardless of tileSize.' },
            { key: 'language', desc: 'ISO 639-1 language code (e.g. en, de, fr) for map label language. Defaults to the language of the country in the tile.' },
          ].map(({ key, desc }) => (
            <div key={key} style={{
              display: 'grid', gridTemplateColumns: '220px 1fr', gap: '0.75rem',
              padding: '0.625rem 0.875rem', background: 'var(--s1)',
              border: '1px solid var(--border)', borderRadius: '10px', alignItems: 'start',
            }}>
              <code style={{ fontSize: '0.75rem', color: 'var(--brand)', fontFamily: 'var(--font-mono)' }}>{key}</code>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text)' }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. Version comparison ── */}
      <div className="zone">
        <h2 className="sh" id="version-comparison">Which version should I use?</h2>
        <p style={{ color: 'var(--text)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          The Map Display API has two versions on different map data platforms.
        </p>
        <div style={{ display: 'grid', gap: '0.875rem' }}>
          {[
            {
              version: 'v1', label: 'Production', color: '#22c55e',
              platform: 'TomTom Maps', methods: 'GET',
              baseUrl: '/map/1/tile/{layer}/{style}/{z}/{x}/{y}.png',
              summary: 'Stable and production-ready. Supports raster tiles, vector tiles, satellite imagery, hillshade, static images, WMS/WMTS, and map asset downloads.',
            },
            {
              version: 'v2', label: 'Public Preview', color: '#a78bfa',
              platform: 'Orbis Maps', methods: 'GET',
              baseUrl: '/maps/orbis/display/raster/tile/{z}/{x}/{y}',
              summary: 'Redesigned tile URLs — layer and style move to query parameters. New street-light and street-dark styles. Versioning via apiVersion query param or TomTom-Api-Version header.',
            },
          ].map(v => (
            <div key={v.version} style={{
              padding: '1rem 1.125rem', background: 'var(--bg)',
              border: '1px solid var(--border)', borderRadius: '20px',
              display: 'grid', gridTemplateColumns: '56px 1fr', gap: '0.875rem', alignItems: 'start',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  display: 'inline-block', padding: '2px 8px',
                  background: v.color + '22', border: `1px solid ${v.color}66`,
                  borderRadius: '6px', fontSize: '0.6875rem', fontWeight: 700,
                  color: v.color, marginBottom: '0.25rem',
                }}>{v.version}</div>
                <div style={{ fontSize: '0.625rem', color: 'var(--muted)', lineHeight: 1.2 }}>{v.label}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.25rem' }}>{v.summary}</div>
                <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                    <strong style={{ color: 'var(--mid)' }}>Platform:</strong> {v.platform}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                    <strong style={{ color: 'var(--mid)' }}>Methods:</strong> {v.methods}
                  </span>
                  <code style={{ fontSize: '0.6875rem', color: 'var(--mid)', fontFamily: 'var(--font-mono)' }}>{v.baseUrl}</code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. Next steps ── */}
      <div className="zone">
        <h2 className="sh" id="next-steps">Next steps</h2>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="page-action-btn" onClick={() => onNavigate?.('map-raster-tile', 'map-display-api')}>
            Raster Tile reference
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('map-vector-tile', 'map-display-api')}>
            Vector Tile reference
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('map-satellite-tile', 'map-display-api')}>
            Satellite Tile
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('map-tomtom-maps', 'map-display-api')}>
            Map Display API v1
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('map-orbis-maps', 'map-display-api')}>
            Map Display API v2
          </button>
        </div>
      </div>
    </div>
  );
}
