import PageActions from '../components/ui/PageActions';

const V = {
  1: { bg: 'rgba(34,197,94,0.1)',   color: '#15803d' },
  2: { bg: 'rgba(167,139,250,0.1)', color: '#7c3aed' },
};

const PARAM_TABLE = [
  { name: 'key',              type: 'string',       dflt: '—',       v: [1,2], desc: 'TomTom API key. Required on all requests via ?key= query parameter.', constraint: 'Required.' },
  { name: 'lat',              type: 'float',        dflt: '—',       v: [1,2], desc: 'Latitude of the search centre point. WGS84 decimal degrees.', constraint: 'Required for nearby and station search with position.' },
  { name: 'lon',              type: 'float',        dflt: '—',       v: [1,2], desc: 'Longitude of the search centre point. WGS84 decimal degrees.', constraint: 'Required for nearby and station search with position.' },
  { name: 'radius',           type: 'integer (m)',  dflt: '—',       v: [1,2], desc: 'Search radius in metres around the lat/lon anchor point.', constraint: 'Requires lat and lon.' },
  { name: 'limit',            type: 'integer',      dflt: '10',      v: [1,2], desc: 'Maximum number of EV station results to return. Range: 1–100.' },
  { name: 'categorySet',      type: 'string (CSV)', dflt: '—',       v: [1,2], desc: 'Comma-separated POI category codes to filter results. Use 7309 for EV charging stations.', values: 'e.g. 7309' },
  { name: 'connectorSet',     type: 'string (CSV)', dflt: '—',       v: [1,2], desc: 'Comma-separated EV connector type identifiers to filter charging stations to those supporting specific connector standards.', values: 'IEC62196Type1, IEC62196Type1CCS, IEC62196Type2CableAttached, IEC62196Type2Outlet, IEC62196Type2CCS, Chademo, GBT20234Part2, GBT20234Part3, Tesla, Nacs' },
  { name: 'minPowerKW',       type: 'float',        dflt: '—',       v: [1,2], desc: 'Minimum rated power in kW. Filters results to stations with at least one connector meeting this threshold.' },
  { name: 'maxPowerKW',       type: 'float',        dflt: '—',       v: [1,2], desc: 'Maximum rated power in kW. Filters results to stations with connectors at or below this power level.' },
  { name: 'language',         type: 'string (IETF)',dflt: 'NGT',     v: [1,2], desc: 'Language for result display names and category labels.', values: 'e.g. en-GB, de-DE, fr-FR' },
  { name: 'view',             type: 'string',       dflt: 'Unified', v: [1,2], desc: 'Geopolitical view for disputed territory rendering.', values: 'Unified, IN, PK, IL, MA' },
  { name: 'relatedPois',      type: 'string',       dflt: 'off',     v: [1,2], desc: 'Include related POIs (parent venue or related facilities) in the response.', values: 'off, child, parent, all' },
  { name: 'openingHours',     type: 'string',       dflt: '—',       v: [1,2], desc: 'Include opening hours data in the response.', values: 'nextSevenDays' },
  { name: 'countrySet',       type: 'string (CSV)', dflt: '—',       v: [1,2], desc: 'Comma-separated ISO 3166-1 alpha-2 or alpha-3 country codes to restrict results.', values: 'e.g. DE,NL,FR' },
  { name: 'topLeft',          type: 'string',       dflt: '—',       v: [1,2], desc: 'Top-left corner of a bounding box to constrain results. Format: lat,lon.', constraint: 'Requires btmRight.' },
  { name: 'btmRight',         type: 'string',       dflt: '—',       v: [1,2], desc: 'Bottom-right corner of a bounding box to constrain results. Format: lat,lon.', constraint: 'Requires topLeft.' },
  // Availability-specific
  { name: 'chargingAvailability', type: 'string (UUID)', dflt: '—', v: [1,2], desc: 'EV charging station availability endpoint. The station/POI identifier (UUID) for which to retrieve live connector availability.', constraint: 'Required for Charging Availability endpoint.' },
  { name: 'fuel',             type: 'string (CSV)', dflt: '—',       v: [1,2], desc: 'Filter by fuel type for fuel station searches. For EV use connectorSet.', values: 'Petrol, Diesel, LPG, CNG, LNG, E85, RechargePoint' },
  { name: 'ofs',              type: 'integer',      dflt: '0',       v: [1,2], desc: 'Starting offset for paginated results.', constraint: 'Max 1900.' },
  { name: 'extendedPostalCodesFor', type: 'string (CSV)', dflt: '—', v: [1,2], desc: 'Include extended postal code data for specified index types.', values: 'POI, Addr, None' },
];

export default function EVParamIndex({ onNavigate }) {
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
        <PageActions pageId="ev-params-ref" pageTitle="EV Charging API Parameter Index" />
      </div>
      <p className="quick-answer">
        All EV Charging Stations Availability API request parameters in one place — type, default, version availability, and key constraints. Covers Station Search, Nearby, Along-Route, By ID, Availability, and Markets endpoints.
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
          <button className="page-action-btn" onClick={() => onNavigate?.('ev-station-search', 'ev-charging-api')}>Station Search</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('ev-response-ref', 'ev-charging-api')}>Response Schema</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('ev-error-codes', 'ev-charging-api')}>Error Codes</button>
        </div>
      </div>
    </div>
  );
}
