import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const codeStyle = {
  background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 12,
  padding: '16px 20px', fontSize: '0.8125rem', lineHeight: 1.7,
  overflowX: 'auto', color: 'var(--black)', fontFamily: 'var(--font-mono)',
  margin: 0,
};

const CODE_COORD_TO_TILE = `// Convert lat/lon + zoom to XYZ tile coordinates
function latLonToTile(lat, lon, zoom) {
  const n = Math.pow(2, zoom);
  const x = Math.floor((lon + 180) / 360 * n);
  const latRad = lat * Math.PI / 180;
  const y = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n);
  return { x, y, z: zoom };
}

// Example: Amsterdam at zoom 12
const tile = latLonToTile(52.37403, 4.90279, 12);
// → { x: 2102, y: 1361, z: 12 }

// Use in tile URL:
const url = \`https://api.tomtom.com/map/1/tile/basic/main/\${tile.z}/\${tile.x}/\${tile.y}.png?key=YOUR_API_KEY\`;`;

const CODE_TILE_SIZE = `# Standard 256px tile (bandwidth-efficient)
https://api.tomtom.com/map/1/tile/basic/main/12/2102/1361.png
  ?key=YOUR_API_KEY&tileSize=256

# High-DPI 512px tile (retina displays)
https://api.tomtom.com/map/1/tile/basic/main/12/2102/1361.png
  ?key=YOUR_API_KEY&tileSize=512`;

export default function MapGuideZoom({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Guide: Zoom Levels and Tile Grid</h1>
        <PageActions pageId="map-guide-zoom" pageTitle="Guide: Zoom Levels and Tile Grid" />
      </div>
      <p className="quick-answer">
        Understand how the TomTom tile grid works — zoom levels, tile coordinates, real-world
        sizes, and how to convert lat/lon coordinates to XYZ tile indices.
      </p>

      {/* 1. Overview */}
      <div className="zone">
        <h2 className="sh" id="overview">What you'll learn</h2>
        <ul style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
          <li>How the XYZ tile grid works</li>
          <li>Zoom level ranges for each tile type</li>
          <li>Real-world metres per tile at each zoom level</li>
          <li>How to convert lat/lon to tile X/Y coordinates</li>
          <li>Choosing between 256px and 512px tile sizes</li>
        </ul>
      </div>

      {/* 2. Projection */}
      <div className="zone">
        <h2 className="sh" id="projection">Spherical Mercator projection</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          TomTom Maps use the <strong>Spherical Mercator projection</strong> (EPSG:3857),
          which is the standard for web mapping. The world is projected onto a flat square
          and divided into square tiles. At zoom 0, the entire world fits on a single 256×256
          pixel tile. Each subsequent zoom level quadruples the number of tiles:
        </p>
        <p style={{ fontSize: '0.8125rem', color: 'var(--mid)', fontFamily: 'var(--font-mono)', background: 'var(--s1)', padding: '0.75rem 1rem', borderRadius: 8, border: '1px solid var(--border)' }}>
          total tiles at zoom N = 2<sup>N</sup> × 2<sup>N</sup> = 4<sup>N</sup>
        </p>
      </div>

      {/* 3. Zoom level ranges */}
      <div className="zone">
        <h2 className="sh" id="zoom-ranges">Zoom level ranges by tile type</h2>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {[
            { type: 'Raster Map tiles', range: '0 – 22', levels: 23, note: '256×256 or 512×512 px PNG or JPG' },
            { type: 'Vector tiles', range: '0 – 22', levels: 23, note: 'PBF format, fully customisable styling' },
            { type: 'Satellite tiles', range: '0 – 19', levels: 20, note: '256×256 px JPG only' },
            { type: 'Hillshade tiles', range: '0 – 13', levels: 14, note: '514×514 px PNG, terrain shading' },
          ].map(({ type, range, levels, note }) => (
            <div key={type} style={{
              display: 'grid', gridTemplateColumns: '180px 80px 40px 1fr', gap: '0.75rem',
              padding: '0.5rem 0.875rem', background: 'var(--s1)',
              border: '1px solid var(--border)', borderRadius: '10px', alignItems: 'center',
            }}>
              <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--black)' }}>{type}</span>
              <code style={{ fontSize: '0.75rem', color: 'var(--brand)', fontFamily: 'var(--font-mono)' }}>{range}</code>
              <span style={{ fontSize: '0.75rem', color: 'var(--mid)', textAlign: 'center' }}>{levels}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--mid)' }}>{note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Real-world sizes */}
      <div className="zone">
        <h2 className="sh" id="tile-sizes-real">Real-world tile sizes</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          Using the formula: <em>metres per tile = 40,075,017 / 2<sup>zoom</sup></em>
        </p>
        <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
          {[
            { z: 0, m: '40,075 km', px: 'Entire world' },
            { z: 2, m: '10,019 km', px: 'Continent' },
            { z: 5, m: '1,252 km', px: 'Large country' },
            { z: 8, m: '156 km', px: 'Region' },
            { z: 10, m: '39 km', px: 'Metro area' },
            { z: 12, m: '9.8 km', px: 'District' },
            { z: 15, m: '1.2 km', px: 'Neighbourhood' },
            { z: 18, m: '153 m', px: 'Block' },
            { z: 20, m: '38 m', px: 'Building' },
            { z: 22, m: '9.5 m', px: 'Room / parking space' },
          ].map(({ z, m, px }) => (
            <div key={z} style={{
              padding: '0.625rem 0.875rem', background: 'var(--s1)',
              border: '1px solid var(--border)', borderRadius: 10, textAlign: 'center',
            }}>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--brand)' }}>z={z}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--mid)', fontFamily: 'var(--font-mono)' }}>{m}</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--muted)' }}>{px}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Coordinate conversion */}
      <div className="zone">
        <h2 className="sh" id="coordinate-conversion">Converting lat/lon to tile coordinates</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          Most map libraries (Leaflet, MapLibre) handle this automatically. If you need to
          build tile URLs manually, use this standard formula:
        </p>
        <pre style={codeStyle}>{CODE_COORD_TO_TILE}</pre>
      </div>

      {/* 6. Tile sizes */}
      <div className="zone">
        <h2 className="sh" id="pixel-sizes">256px vs. 512px tiles</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          The <code>tileSize</code> parameter controls the pixel dimensions of returned tiles:
        </p>
        <pre style={codeStyle}>{CODE_TILE_SIZE}</pre>
        <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: '1fr 1fr', marginTop: '0.75rem' }}>
          {[
            { size: '256px', when: 'Use for:', items: ['Lower-bandwidth environments', 'Older mobile devices', 'Standard displays (96 DPI)'] },
            { size: '512px', when: 'Use for:', items: ['Retina / HiDPI displays', 'High-quality print maps', 'Desktop applications'] },
          ].map(b => (
            <div key={b.size} style={{
              padding: '1rem', background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 12,
            }}>
              <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--brand)', marginBottom: '0.25rem' }}>{b.size}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--mid)', marginBottom: '0.375rem' }}>{b.when}</div>
              <ul style={{ fontSize: '0.8125rem', color: 'var(--text)', lineHeight: 1.7, paddingLeft: '1.125rem', margin: 0 }}>
                {b.items.map(i => <li key={i}>{i}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Pitfalls */}
      <div className="zone">
        <Callout type="warn" title="Common pitfalls">
          <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.8 }}>
            <li>Requesting satellite tiles above zoom 19 — they only go up to level 19; use <code>z=min(zoom,19)</code>.</li>
            <li>Using hillshade tiles above zoom 13 — they only go up to level 13.</li>
            <li>Requesting JPG format for overlay tiles (hybrid, labels) — they require PNG for transparency.</li>
            <li>Displaying 256px tiles on retina without <code>tileSize=512</code> — tiles will appear blurry.</li>
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
          <button className="page-action-btn" onClick={() => onNavigate?.('map-guide-hybrid', 'map-display-api')}>
            Guide: Hybrid maps
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('map-guide-styles', 'map-display-api')}>
            Guide: Map styles
          </button>
        </div>
      </div>
    </div>
  );
}
