import PageActions from '../components/ui/PageActions';

const V = {
  1: { bg: 'rgba(34,197,94,0.1)',   color: '#15803d' },
  2: { bg: 'rgba(167,139,250,0.1)', color: '#7c3aed' },
};

const PARAM_TABLE = [
  { name: 'key',               type: 'string',       dflt: '—',      v: [1,2], desc: 'TomTom API key. Required on all requests via ?key= query parameter.', constraint: 'Required.' },
  { name: 'zoom',              type: 'integer',      dflt: '—',      v: [1,2], desc: 'Tile zoom level. Range: 0–22. At zoom 0 the entire world fits in a single tile.', constraint: 'Required for tile endpoints.' },
  { name: 'x',                 type: 'integer',      dflt: '—',      v: [1,2], desc: 'Tile column index at the given zoom level. 0-based, left to right.', constraint: 'Required for tile endpoints.' },
  { name: 'y',                 type: 'integer',      dflt: '—',      v: [1,2], desc: 'Tile row index at the given zoom level. 0-based, top to bottom.', constraint: 'Required for tile endpoints.' },
  { name: 'style',             type: 'string',       dflt: 'absolute',  v: [1,2], desc: 'Visual style of the traffic flow tile.', values: 'absolute, relative, relative-delay, reduced-sensitivity', constraint: 'Flow tiles only.' },
  { name: 'tileSize',          type: 'integer',      dflt: '256',    v: [1,2], desc: 'Tile size in pixels.', values: '256, 512' },
  { name: 'format',            type: 'string',       dflt: 'png',    v: [1,2], desc: 'Response image format for raster tiles.', values: 'png, png8 (for flow); png, gif, png8, svg, pbf (for incidents)' },
  { name: 'language',          type: 'string (IETF)',dflt: 'NGT',    v: [1],   desc: 'Language for road name labels on traffic tiles. IETF language tag.', values: 'e.g. en-GB, de-DE, fr-FR' },
  { name: 't',                 type: 'string',       dflt: 'now',    v: [1],   desc: 'Time for which to request traffic data. Accepts "now" or a Unix epoch timestamp in seconds.', values: 'now, Unix timestamp' },
  { name: 'trafficModelId',    type: 'string',       dflt: '—',      v: [1],   desc: 'Traffic model identifier. Obtained from the Traffic Model ID endpoint to ensure tile consistency across a session.', constraint: 'Use to synchronise tile requests. Obtained from /incidentViewport or /modelId endpoint.' },
  { name: 'categoryFilter',    type: 'string (CSV)', dflt: '—',      v: [1],   desc: 'Filter incident tiles by incident category codes. Comma-separated.', values: '0 = Unknown, 1 = Accident, 2 = Fog, 3 = Dangerous Conditions, 4 = Rain, 5 = Ice, 6 = Jam, 7 = Lane Closed, 8 = Road Closed, 9 = Road Works, 10 = Wind, 11 = Flooding, 12–14 = Detour variants', constraint: 'Incident tiles only.' },
  { name: 'timeValidityFilter', type: 'string',      dflt: 'present', v: [1], desc: 'Filter incidents by time validity.', values: 'present, future, all', constraint: 'Incident tiles only.' },
  { name: 'projection',        type: 'string',       dflt: 'EPSG3857', v: [1,2], desc: 'Coordinate projection for the tile grid.', values: 'EPSG3857 (Web Mercator)' },
  { name: 'thickness',         type: 'string',       dflt: 'w10',    v: [1],   desc: 'Tube thickness for vector flow tiles.', values: 'w10 (10 pixels), w7 (7 pixels), w5 (5 pixels)', constraint: 'Vector flow tiles only.' },
  { name: 'tags',              type: 'string (CSV)', dflt: '—',      v: [1],   desc: 'PBF tag fields to include in vector incident tiles. Controls response verbosity.', values: 'icon_category, description, delay, road_category, road_subcategory, magnitude, cluster_size', constraint: 'Vector incident tiles (pbf format) only.' },
  { name: 'unit',              type: 'string',       dflt: 'KMPH',   v: [1],   desc: 'Speed unit for flow segment data.', values: 'KMPH, MPH', constraint: 'Flow Segment Data endpoint only.' },
  { name: 'point',             type: 'string',       dflt: '—',      v: [1],   desc: 'Coordinate point for flow segment data query. Format: lat,lon.', constraint: 'Required for Flow Segment Data endpoint.' },
  { name: 'openLr',            type: 'boolean',      dflt: 'false',  v: [1],   desc: 'Include OpenLR location reference codes in the flow segment response.', constraint: 'Flow Segment Data only.' },
];

export default function TrafficParamIndex({ onNavigate }) {
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
        <PageActions pageId="traffic-params-ref" pageTitle="Traffic API Parameter Index" />
      </div>
      <p className="quick-answer">
        All Traffic API request parameters in one place — type, default, version availability, and key constraints. Covers Raster/Vector Flow Tiles, Raster/Vector Incident Tiles, Flow Segment Data, and Traffic Model ID.
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
          <button className="page-action-btn" onClick={() => onNavigate?.('traffic-raster-flow', 'traffic-api')}>Raster Flow Tiles</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('traffic-response-ref', 'traffic-api')}>Response Schema</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('traffic-error-codes', 'traffic-api')}>Error Codes</button>
        </div>
      </div>
    </div>
  );
}
