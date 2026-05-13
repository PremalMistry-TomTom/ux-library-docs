import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const tdStyle = { padding: '8px 12px', border: '1px solid var(--border)', fontSize: '0.8125rem', verticalAlign: 'top', textAlign: 'center' };
const thStyle = { ...tdStyle, background: 'var(--s1)', fontWeight: 600 };
const tdLeft = { ...tdStyle, textAlign: 'left' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' };

const CHECK = '✔';
const STAR = '★';

export default function SearchCoverage({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Search API — Market Coverage</h1>
        <PageActions pageId="search-coverage" pageTitle="Search API — Market Coverage" />
      </div>

      <p className="quick-answer">
        The Search API supports address search, POI search, and geocoding across a broad set of global
        markets. Coverage levels vary by region and data index. Markets not listed are not currently
        supported.
      </p>

      <div className="zone">
        <h2 className="sh" id="definitions">Definitions</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Symbol</th>
              <th style={{ ...thStyle, textAlign: 'left' }}>Meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>{CHECK}</td>
              <td style={tdLeft}>Market is provided with detailed data.</td>
            </tr>
            <tr>
              <td style={tdStyle}>{STAR}</td>
              <td style={tdLeft}>Market is provided, but with certain conditions. See the Region-specific content page for details.</td>
            </tr>
            <tr>
              <td style={tdStyle}>—</td>
              <td style={tdLeft}>Market data is not provided.</td>
            </tr>
          </tbody>
        </table>
        <p style={{ marginTop: 12, color: 'var(--mid)', fontSize: '0.8125rem' }}>
          Country codes follow ISO 3166-1 alpha-2 and alpha-3 formats. If a market is missing from the
          tables below, it is not currently supported. Contact{' '}
          <a href="https://support.tomtom.com/support" style={{ color: 'var(--brand)' }}>TomTom support</a> for more information.
        </p>
      </div>

      <div className="zone">
        <h2 className="sh" id="coverage-legend">Coverage Columns</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{ ...thStyle, textAlign: 'left' }}>Column</th>
              <th style={{ ...thStyle, textAlign: 'left' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Address points', 'Derived from the Point Address index in the Search API. Supported when Search and Geocoding are both enabled.'],
              ['House number', 'Derived from the Address Interpolation index in the Search API. Supported when Search and Geocoding are both enabled.'],
              ['Street level', 'Street-level address resolution is available.'],
              ['City level', 'City-level resolution is available.'],
              ['EV Static', 'Static EV charging station data is available for this market.'],
            ].map(([col, desc]) => (
              <tr key={col}>
                <td style={tdLeft}><strong>{col}</strong></td>
                <td style={tdLeft}>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="americas">Americas</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              {['Market', 'Code', 'Address points', 'House number', 'Street level', 'City level', 'EV Static'].map(h => (
                <th key={h} style={h === 'Market' ? { ...thStyle, textAlign: 'left' } : thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['United States', 'US', CHECK, CHECK, CHECK, CHECK, CHECK],
              ['Canada', 'CA', CHECK, CHECK, CHECK, CHECK, CHECK],
              ['Mexico', 'MX', CHECK, STAR, CHECK, CHECK, STAR],
              ['Brazil', 'BR', CHECK, STAR, CHECK, CHECK, '—'],
              ['Argentina', 'AR', STAR, STAR, CHECK, CHECK, '—'],
              ['Chile', 'CL', STAR, STAR, CHECK, CHECK, '—'],
              ['Colombia', 'CO', STAR, STAR, CHECK, CHECK, '—'],
            ].map(([market, code, ...cols]) => (
              <tr key={market}>
                <td style={tdLeft}>{market}</td>
                <td style={tdStyle}>{code}</td>
                {cols.map((c, i) => <td key={i} style={tdStyle}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="europe">Europe</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              {['Market', 'Code', 'Address points', 'House number', 'Street level', 'City level', 'EV Static'].map(h => (
                <th key={h} style={h === 'Market' ? { ...thStyle, textAlign: 'left' } : thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Austria', 'AT', CHECK, CHECK, CHECK, CHECK, CHECK],
              ['Belgium', 'BE', CHECK, CHECK, CHECK, CHECK, CHECK],
              ['Czech Republic', 'CZ', CHECK, CHECK, CHECK, CHECK, CHECK],
              ['Denmark', 'DK', CHECK, CHECK, CHECK, CHECK, CHECK],
              ['Finland', 'FI', CHECK, CHECK, CHECK, CHECK, CHECK],
              ['France', 'FR', CHECK, CHECK, CHECK, CHECK, CHECK],
              ['Germany', 'DE', CHECK, CHECK, CHECK, CHECK, CHECK],
              ['Hungary', 'HU', CHECK, CHECK, CHECK, CHECK, CHECK],
              ['Italy', 'IT', CHECK, CHECK, CHECK, CHECK, CHECK],
              ['Netherlands', 'NL', CHECK, CHECK, CHECK, CHECK, CHECK],
              ['Norway', 'NO', CHECK, CHECK, CHECK, CHECK, CHECK],
              ['Poland', 'PL', CHECK, CHECK, CHECK, CHECK, CHECK],
              ['Portugal', 'PT', CHECK, CHECK, CHECK, CHECK, CHECK],
              ['Romania', 'RO', CHECK, STAR, CHECK, CHECK, '—'],
              ['Spain', 'ES', CHECK, CHECK, CHECK, CHECK, CHECK],
              ['Sweden', 'SE', CHECK, CHECK, CHECK, CHECK, CHECK],
              ['Switzerland', 'CH', CHECK, CHECK, CHECK, CHECK, CHECK],
              ['United Kingdom', 'GB', CHECK, CHECK, CHECK, CHECK, CHECK],
            ].map(([market, code, ...cols]) => (
              <tr key={market}>
                <td style={tdLeft}>{market}</td>
                <td style={tdStyle}>{code}</td>
                {cols.map((c, i) => <td key={i} style={tdStyle}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="asia-pacific">Asia Pacific</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              {['Market', 'Code', 'Address points', 'House number', 'Street level', 'City level', 'EV Static'].map(h => (
                <th key={h} style={h === 'Market' ? { ...thStyle, textAlign: 'left' } : thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Australia', 'AU', CHECK, CHECK, CHECK, CHECK, CHECK],
              ['China', 'CN', STAR, STAR, STAR, CHECK, '—'],
              ['India', 'IN', STAR, STAR, CHECK, CHECK, '—'],
              ['Japan', 'JP', CHECK, CHECK, CHECK, CHECK, CHECK],
              ['New Zealand', 'NZ', CHECK, CHECK, CHECK, CHECK, '—'],
              ['South Korea', 'KR', CHECK, CHECK, CHECK, CHECK, CHECK],
              ['Singapore', 'SG', CHECK, CHECK, CHECK, CHECK, CHECK],
            ].map(([market, code, ...cols]) => (
              <tr key={market}>
                <td style={tdLeft}>{market}</td>
                <td style={tdStyle}>{code}</td>
                {cols.map((c, i) => <td key={i} style={tdStyle}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout type="info" title="Full coverage data">
        The tables above show selected markets. For the complete list including all African, Middle
        Eastern, and additional markets, refer to the{' '}
        <a href="https://developer.tomtom.com/search-api/documentation/product-information/market-coverage"
          style={{ color: 'var(--brand)' }}>Search API Market Coverage</a> page on the TomTom developer portal.
      </Callout>
    </div>
  );
}
