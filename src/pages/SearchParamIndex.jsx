import PageActions from '../components/ui/PageActions';

const V = {
  1: { bg: 'rgba(34,197,94,0.1)',   color: '#15803d' },
  2: { bg: 'rgba(167,139,250,0.1)', color: '#7c3aed' },
};

const PARAM_TABLE = [
  { name: 'key',            type: 'string',        dflt: '—',       v: [1,2], desc: 'TomTom API key. Required on all requests via ?key= query parameter.', constraint: 'Required.' },
  { name: 'query',          type: 'string',        dflt: '—',       v: [1,2], desc: 'The search query string. Must be properly URL-encoded. Can include a free-form address, POI name, or coordinate pair.', constraint: 'Required for most endpoints.' },
  { name: 'lat',            type: 'float',         dflt: '—',       v: [1,2], desc: 'Latitude of the context point for geo-biased results. WGS84 decimal degrees.', constraint: 'Must be paired with lon.' },
  { name: 'lon',            type: 'float',         dflt: '—',       v: [1,2], desc: 'Longitude of the context point for geo-biased results. WGS84 decimal degrees.', constraint: 'Must be paired with lat.' },
  { name: 'limit',          type: 'integer',       dflt: '10',      v: [1,2], desc: 'Maximum number of results to return per page. Range: 1–100.', constraint: 'Default 10. Max 100 for most endpoints.' },
  { name: 'ofs',            type: 'integer',       dflt: '0',       v: [1,2], desc: 'Starting offset for paginated results. Used with limit to page through results.', constraint: 'Max 1900.' },
  { name: 'radius',         type: 'integer (m)',   dflt: '—',       v: [1,2], desc: 'Search radius in metres around the lat/lon anchor. Constrains results to a circle.', constraint: 'Requires lat and lon.' },
  { name: 'countrySet',     type: 'string (CSV)',  dflt: '—',       v: [1,2], desc: 'Comma-separated list of ISO 3166-1 alpha-2 or alpha-3 country codes to restrict results.', values: 'e.g. US,MX,GBR' },
  { name: 'language',       type: 'string (IETF)', dflt: 'NGT',     v: [1,2], desc: 'Preferred language for result display names. Uses IETF language tag (e.g. en-GB, de-DE).', values: 'e.g. en-GB, fr-FR, de-DE', constraint: 'Falls back to local language if not available.' },
  { name: 'geobias',        type: 'string',        dflt: '—',       v: [1,2], desc: 'Geo-bias anchor in the form point:lat,lon. Ranks results closer to the point higher without hard-constraining to radius.', values: 'point:lat,lon' },
  { name: 'typeahead',      type: 'boolean',       dflt: 'false',   v: [1,2], desc: 'Enable typeahead / predictive mode. Treats the query as a prefix and returns ranked partial-match suggestions.' },
  { name: 'minFuzzyLevel',  type: 'integer',       dflt: '1',       v: [1,2], desc: 'Minimum fuzzy match level. Level 1 = exact match required for the first part; higher levels tolerate more typos.', values: '1, 2, 3, 4', constraint: 'Must be ≤ maxFuzzyLevel.' },
  { name: 'maxFuzzyLevel',  type: 'integer',       dflt: '2',       v: [1,2], desc: 'Maximum fuzzy match level. Higher levels produce more tolerant results but may include irrelevant matches.', values: '1, 2, 3, 4', constraint: 'Must be ≥ minFuzzyLevel. Default 2 balances performance and quality.' },
  { name: 'categorySet',    type: 'string (CSV)',  dflt: '—',       v: [1,2], desc: 'Comma-separated list of POI category codes to restrict results to specific categories.', constraint: 'See POI Categories endpoint for valid codes.' },
  { name: 'connectorSet',   type: 'string (CSV)',  dflt: '—',       v: [1,2], desc: 'Comma-separated list of EV connector type identifiers to filter charging stations.', values: 'e.g. IEC62196Type2CableAttached, Chademo, Tesla' },
  { name: 'brandSet',       type: 'string (CSV)',  dflt: '—',       v: [1,2], desc: 'Comma-separated list of brand names to filter POI results to specific brands.' },
  { name: 'fuelSet',        type: 'string (CSV)',  dflt: '—',       v: [1,2], desc: 'Comma-separated list of fuel types to filter fuel stations.', values: 'e.g. Petrol, Diesel, LPG' },
  { name: 'topLeft',        type: 'string',        dflt: '—',       v: [1,2], desc: 'Top-left corner of a bounding box to constrain results. Format: lat,lon.', constraint: 'Requires btmRight. Overrides lat/lon/radius.' },
  { name: 'btmRight',       type: 'string',        dflt: '—',       v: [1,2], desc: 'Bottom-right corner of a bounding box to constrain results. Format: lat,lon.', constraint: 'Requires topLeft.' },
  { name: 'view',           type: 'string',        dflt: 'Unified', v: [1,2], desc: 'Geopolitical view for disputed territory rendering.', values: 'Unified, IN, PK, IL, MA', constraint: 'Affects border display in affected regions.' },
  { name: 'idxSet',         type: 'string (CSV)',  dflt: '—',       v: [1,2], desc: 'Index abbreviation values to restrict which index types are searched.', values: 'Addr, Geo, PAD, POI, Str, XStr' },
  { name: 'openingHours',   type: 'string',        dflt: '—',       v: [1,2], desc: 'Include POI opening hours in the response.', values: 'nextSevenDays' },
  { name: 'timeZone',       type: 'string',        dflt: '—',       v: [1,2], desc: 'Include time zone information in the response for the result location.', values: 'iana' },
  { name: 'mapcodes',       type: 'string (CSV)',  dflt: '—',       v: [1,2], desc: 'Include Mapcode representations of the result position in the response.', values: 'Local, International, Alternative' },
  { name: 'relatedPois',    type: 'string',        dflt: 'off',     v: [1,2], desc: 'Include related POIs (e.g. sub-POIs or parent venue) in the response.', values: 'off, child, parent, all' },
  { name: 'minPowerKW',     type: 'float',         dflt: '—',       v: [1,2], desc: 'Minimum charger power in kW. Filters EV charging station results by minimum connector power output.' },
  { name: 'maxPowerKW',     type: 'float',         dflt: '—',       v: [1,2], desc: 'Maximum charger power in kW. Filters EV charging station results by maximum connector power output.' },
  { name: 'extendedPostalCodesFor', type: 'string (CSV)', dflt: '—', v: [1,2], desc: 'Include extended postal code data in the response for specified index types.', values: 'Addr, Geo, PAD, POI, Str, XStr, None' },
  { name: 'entityTypeSet',  type: 'string (CSV)',  dflt: '—',       v: [1,2], desc: 'Restrict geography results to specific entity types.', values: 'Country, CountrySubdivision, Municipality, MunicipalitySubdivision, Neighbourhood, PostalCodeArea' },
];

export default function SearchParamIndex({ onNavigate }) {
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
        <PageActions pageId="search-params-ref" pageTitle="Search API Parameter Index" />
      </div>
      <p className="quick-answer">
        All Search API request parameters in one place — type, default, version availability, and key constraints. Covers Fuzzy Search, POI Search, Nearby, Geometry, Along-Route, Autocomplete, and Batch.
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
          <button className="page-action-btn" onClick={() => onNavigate?.('search-fuzzy', 'search-api')}>Fuzzy Search</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('search-response-ref', 'search-api')}>Response Schema</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('search-error-codes', 'search-api')}>Error Codes</button>
        </div>
      </div>
    </div>
  );
}
