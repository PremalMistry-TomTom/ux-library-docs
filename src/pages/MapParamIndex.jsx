import PageActions from '../components/ui/PageActions';

const V = {
  1: { bg: 'rgba(34,197,94,0.1)',   color: '#15803d' },
  2: { bg: 'rgba(167,139,250,0.1)', color: '#7c3aed' },
};

const PARAM_TABLE = [
  { name: 'key',        type: 'string',       dflt: '—',       v: [1,2], desc: 'TomTom API key. Required on all requests via ?key= query parameter.', constraint: 'Required.' },
  { name: 'zoom',       type: 'integer',      dflt: '—',       v: [1,2], desc: 'Tile zoom level. Range: 0–22. Controls map scale and level of detail.', constraint: 'Required for tile endpoints.' },
  { name: 'x',          type: 'integer',      dflt: '—',       v: [1,2], desc: 'Tile column (X) index in the tile grid at the specified zoom level.', constraint: 'Required for tile endpoints.' },
  { name: 'y',          type: 'integer',      dflt: '—',       v: [1,2], desc: 'Tile row (Y) index in the tile grid at the specified zoom level.', constraint: 'Required for tile endpoints.' },
  { name: 'layer',      type: 'string',       dflt: 'basic',   v: [1,2], desc: 'Tile content layer to request.', values: 'basic, hybrid, labels', constraint: 'hybrid and labels are overlay tiles — must use format=png.' },
  { name: 'style',      type: 'string',       dflt: 'main',    v: [1,2], desc: 'Map rendering style.', values: 'main, night', constraint: 'night style available for basic and labels layers.' },
  { name: 'format',     type: 'string',       dflt: 'png',     v: [1,2], desc: 'Response image format for raster map tiles.', values: 'png, png8, jpg, jpeg', constraint: 'png required for hybrid and labels overlay layers (transparency needed).' },
  { name: 'tileSize',   type: 'integer',      dflt: '256',     v: [1,2], desc: 'Tile size in pixels.', values: '256, 512', constraint: '512 is suited for high-DPI/retina displays.' },
  { name: 'view',       type: 'string',       dflt: 'Unified', v: [1,2], desc: 'Geopolitical view for disputed territory and border rendering.', values: 'Unified, IN, PK, IL, MA', constraint: 'Affects borders in regions with disputed territories.' },
  { name: 'language',   type: 'string (IETF)',dflt: 'NGT',     v: [1,2], desc: 'Language for map labels. Uses IETF language tag. NGT = neutral ground truth (local name scripts).', values: 'e.g. en-GB, de-DE, fr-FR, NGT, NGT-Latn' },
  // Vector tile
  { name: 'projection', type: 'string',       dflt: 'EPSG3857', v: [1,2], desc: 'Coordinate projection for the tile grid.', values: 'EPSG3857 (Web Mercator)' },
  // Static image
  { name: 'bbox',       type: 'string',       dflt: '—',       v: [1],   desc: 'Static Image only. Bounding box of the area to render. Format: minLon,minLat,maxLon,maxLat.', constraint: 'Mutually exclusive with center+zoom.' },
  { name: 'center',     type: 'string',       dflt: '—',       v: [1],   desc: 'Static Image only. Centre point of the rendered map area. Format: lon,lat.', constraint: 'Requires zoom. Mutually exclusive with bbox.' },
  { name: 'width',      type: 'integer',      dflt: '512',     v: [1],   desc: 'Static Image only. Output image width in pixels. Max 8192.', constraint: 'Static image endpoint only.' },
  { name: 'height',     type: 'integer',      dflt: '512',     v: [1],   desc: 'Static Image only. Output image height in pixels. Max 8192.', constraint: 'Static image endpoint only.' },
  { name: 'mapstyle',   type: 'string',       dflt: '—',       v: [2],   desc: 'Map styles endpoint. Style identifier to retrieve the style JSON definition.', constraint: 'Map Styles endpoint only.' },
];

export default function MapParamIndex({ onNavigate }) {
  const thStyle = {
    padding: '0.5rem 0.75rem', textAlign: 'left', fontSize: '0.6875rem',
    fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase',
    letterSpacing: '0.06em', borderBottom: '2px solid var(--border)',
    background: 'var(--s1)',
  };
  const vBadge = {
    fontSize: '0.625rem', fontWeight: 700, padding: '2px 6px',
    borderRadius: 4, fontFamily: 'var(--font-mono)',
  };

  return (
    <div className="page page--wide">
      <div className="page-header">
        <h1>Parameter Index</h1>
        <PageActions pageId="map-params-ref" pageTitle="Map Display API Parameter Index" />
      </div>
      <p className="quick-answer">
        All Map Display API request parameters in one place — type, default, version availability, and key constraints. Covers Raster Tiles, Vector Tiles, Satellite, Hillshade, Static Image, WMS, and WMTS endpoints.
      </p>

      <div className="zone">
        <h2 className="sh" id="all-params">Parameters (A–Z)</h2>
        <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, minWidth: 220 }}>Parameter</th>
                <th style={{ ...thStyle, minWidth: 110 }}>Type</th>
                <th style={{ ...thStyle, minWidth: 80 }}>Default</th>
                <th style={{ ...thStyle, minWidth: 90 }}>Versions</th>
                <th style={{ ...thStyle }}>Description &amp; constraints</th>
              </tr>
            </thead>
            <tbody>
              {PARAM_TABLE.map((p, i) => (
                <tr key={p.name} style={{ background: i % 2 === 0 ? 'var(--bg)' : 'var(--s1)', borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.5rem 0.75rem', verticalAlign: 'top' }}>
                    <code style={{ fontSize: '0.75rem', color: 'var(--brand)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{p.name}</code>
                  </td>
                  <td style={{ padding: '0.5rem 0.75rem', verticalAlign: 'top' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{p.type}</span>
                  </td>
                  <td style={{ padding: '0.5rem 0.75rem', verticalAlign: 'top' }}>
                    <code style={{ fontSize: '0.75rem', color: 'var(--mid)', fontFamily: 'var(--font-mono)' }}>{p.dflt}</code>
                  </td>
                  <td style={{ padding: '0.5rem 0.75rem', verticalAlign: 'top' }}>
                    <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      {p.v.map(n => (
                        <span key={n} style={{ ...vBadge, background: V[n].bg, color: V[n].color }}>v{n}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '0.5rem 0.75rem', verticalAlign: 'top', color: 'var(--text)', lineHeight: 1.5 }}>
                    {p.desc}
                    {p.values && (
                      <div style={{ marginTop: 4, fontSize: '0.75rem', color: 'var(--muted)' }}>
                        Values: <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--mid)', fontSize: '0.75rem' }}>{p.values}</code>
                      </div>
                    )}
                    {p.constraint && (
                      <div style={{ marginTop: 4, fontSize: '0.75rem', color: 'var(--muted)', fontStyle: 'italic' }}>{p.constraint}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="zone">
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="page-action-btn" onClick={() => onNavigate?.('map-raster-tile', 'map-display-api')}>Raster Tiles</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('map-response-ref', 'map-display-api')}>Response Schema</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('map-error-codes', 'map-display-api')}>Error Codes</button>
        </div>
      </div>
    </div>
  );
}
