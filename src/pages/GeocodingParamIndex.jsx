import PageActions from '../components/ui/PageActions';

const V = {
  1: { bg: 'rgba(34,197,94,0.1)',   color: '#15803d' },
  2: { bg: 'rgba(167,139,250,0.1)', color: '#7c3aed' },
};

const PARAM_TABLE = [
  { name: 'key',                    type: 'string',       dflt: '—',       v: [1,2], desc: 'TomTom API key. Required on all requests via ?key= query parameter.', constraint: 'Required.' },
  { name: 'query',                  type: 'string',       dflt: '—',       v: [1,2], desc: 'Address or partial address to geocode. Must be properly URL-encoded. Can include street, city, country, or postal code.', constraint: 'Required.' },
  { name: 'lat',                    type: 'float',        dflt: '—',       v: [1,2], desc: 'Latitude of a context point for geo-biased results. WGS84 decimal degrees.', constraint: 'Must be paired with lon.' },
  { name: 'lon',                    type: 'float',        dflt: '—',       v: [1,2], desc: 'Longitude of a context point for geo-biased results. WGS84 decimal degrees.', constraint: 'Must be paired with lat.' },
  { name: 'limit',                  type: 'integer',      dflt: '10',      v: [1,2], desc: 'Maximum number of results to return. Range: 1–100.', constraint: 'Default 10.' },
  { name: 'ofs',                    type: 'integer',      dflt: '0',       v: [1,2], desc: 'Starting offset for paginated results.', constraint: 'Max 1900.' },
  { name: 'countrySet',             type: 'string (CSV)', dflt: '—',       v: [1,2], desc: 'Comma-separated list of ISO 3166-1 alpha-2 or alpha-3 country codes to restrict results.', values: 'e.g. US,GB,NLD' },
  { name: 'language',               type: 'string (IETF)',dflt: 'NGT',     v: [1,2], desc: 'Preferred language for result display names. Uses IETF language tag.', values: 'e.g. en-GB, de-DE, fr-FR' },
  { name: 'radius',                 type: 'integer (m)',  dflt: '—',       v: [1,2], desc: 'Search radius in metres around the lat/lon context point.', constraint: 'Requires lat and lon.' },
  { name: 'topLeft',                type: 'string',       dflt: '—',       v: [1,2], desc: 'Top-left corner of a bounding box to constrain results. Format: lat,lon.', constraint: 'Requires btmRight.' },
  { name: 'btmRight',               type: 'string',       dflt: '—',       v: [1,2], desc: 'Bottom-right corner of a bounding box to constrain results. Format: lat,lon.', constraint: 'Requires topLeft.' },
  { name: 'view',                   type: 'string',       dflt: 'Unified', v: [1,2], desc: 'Geopolitical view for disputed territory rendering.', values: 'Unified, IN, PK, IL, MA' },
  { name: 'mapcodes',               type: 'string (CSV)', dflt: '—',       v: [1,2], desc: 'Include Mapcode representations of the result position in the response.', values: 'Local, International, Alternative' },
  { name: 'typeahead',              type: 'boolean',      dflt: 'false',   v: [1,2], desc: 'Enable predictive / typeahead mode. Treats the query as a prefix and returns partial-match suggestions.' },
  { name: 'extendedPostalCodesFor', type: 'string (CSV)', dflt: '—',       v: [1,2], desc: 'Include extended postal code data in the response for specified index types.', values: 'Addr, Geo, PAD, Str, XStr, None' },
  { name: 'entityTypeSet',          type: 'string (CSV)', dflt: '—',       v: [1,2], desc: 'Restrict results to specific geographic entity types.', values: 'Country, CountrySubdivision, Municipality, MunicipalitySubdivision, Neighbourhood, PostalCodeArea' },
  // Structured geocode parameters
  { name: 'allowFreeformNewLine',   type: 'boolean',      dflt: 'false',   v: [1,2], desc: 'Structured geocode only. Allow newline characters in address fields as a delimiter.' },
  { name: 'countryCode',            type: 'string',       dflt: '—',       v: [1,2], desc: 'Structured geocode only. ISO 3166-1 alpha-2 country code.', constraint: 'Required for structured geocode.' },
  { name: 'streetNumber',           type: 'string',       dflt: '—',       v: [1,2], desc: 'Structured geocode only. House or building number on the street.' },
  { name: 'streetName',             type: 'string',       dflt: '—',       v: [1,2], desc: 'Structured geocode only. Name of the street without the number.' },
  { name: 'municipality',           type: 'string',       dflt: '—',       v: [1,2], desc: 'Structured geocode only. City or town name.' },
  { name: 'municipalitySubdivision', type: 'string',      dflt: '—',       v: [1,2], desc: 'Structured geocode only. Suburb, district, or neighbourhood within the municipality.' },
  { name: 'countrySubdivision',     type: 'string',       dflt: '—',       v: [1,2], desc: 'Structured geocode only. State, province, or county name.' },
  { name: 'postalCode',             type: 'string',       dflt: '—',       v: [1,2], desc: 'Structured geocode only. Postal or ZIP code.' },
];

export default function GeocodingParamIndex({ onNavigate }) {
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
        <PageActions pageId="geocoding-params-ref" pageTitle="Geocoding API Parameter Index" />
      </div>
      <p className="quick-answer">
        All Geocoding API request parameters in one place — type, default, version availability, and key constraints. Covers Geocode, Structured Geocode, and Cross Street Lookup.
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
          <button className="page-action-btn" onClick={() => onNavigate?.('geocode', 'geocoding-api')}>Geocode</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('geocoding-response-ref', 'geocoding-api')}>Response Schema</button>
          <button className="page-action-btn" onClick={() => onNavigate?.('geocoding-error-codes', 'geocoding-api')}>Error Codes</button>
        </div>
      </div>
    </div>
  );
}
