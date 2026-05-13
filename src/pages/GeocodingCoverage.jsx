import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const tdStyle = { padding: '8px 12px', border: '1px solid var(--border)', fontSize: '0.8125rem', verticalAlign: 'top', textAlign: 'center' };
const thStyle = { ...tdStyle, background: 'var(--s1)', fontWeight: 600 };
const tdLeft = { ...tdStyle, textAlign: 'left' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' };

const CHECK = '✔';
const STAR = '★';

export default function GeocodingCoverage({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Geocoding API — Market Coverage</h1>
        <PageActions pageId="geocoding-coverage" pageTitle="Geocoding API — Market Coverage" />
      </div>

      <p className="quick-answer">
        The Geocoding API supports address-to-coordinate resolution across a broad range of global
        markets. Coverage levels vary by region and data quality. Markets not listed are not currently
        supported.
      </p>

      <div className="zone">
        <h2 className="sh" id="legend">Legend</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Symbol</th>
              <th style={{ ...thStyle, textAlign: 'left' }}>Meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={tdStyle}>{CHECK}</td><td style={tdLeft}>Full geocoding support with detailed data.</td></tr>
            <tr><td style={tdStyle}>{STAR}</td><td style={tdLeft}>Supported with region-specific limitations.</td></tr>
            <tr><td style={tdStyle}>—</td><td style={tdLeft}>Not supported.</td></tr>
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="americas">Americas</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              {['Market', 'Code', 'Address points', 'House number', 'Street level', 'City level'].map(h => (
                <th key={h} style={h === 'Market' ? { ...thStyle, textAlign: 'left' } : thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['United States', 'US', CHECK, CHECK, CHECK, CHECK],
              ['Canada', 'CA', CHECK, CHECK, CHECK, CHECK],
              ['Mexico', 'MX', CHECK, STAR, CHECK, CHECK],
              ['Brazil', 'BR', CHECK, STAR, CHECK, CHECK],
              ['Argentina', 'AR', STAR, STAR, CHECK, CHECK],
              ['Chile', 'CL', STAR, STAR, CHECK, CHECK],
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
              {['Market', 'Code', 'Address points', 'House number', 'Street level', 'City level'].map(h => (
                <th key={h} style={h === 'Market' ? { ...thStyle, textAlign: 'left' } : thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Austria', 'AT', CHECK, CHECK, CHECK, CHECK],
              ['Belgium', 'BE', CHECK, CHECK, CHECK, CHECK],
              ['Denmark', 'DK', CHECK, CHECK, CHECK, CHECK],
              ['Finland', 'FI', CHECK, CHECK, CHECK, CHECK],
              ['France', 'FR', CHECK, CHECK, CHECK, CHECK],
              ['Germany', 'DE', CHECK, CHECK, CHECK, CHECK],
              ['Italy', 'IT', CHECK, CHECK, CHECK, CHECK],
              ['Netherlands', 'NL', CHECK, CHECK, CHECK, CHECK],
              ['Norway', 'NO', CHECK, CHECK, CHECK, CHECK],
              ['Poland', 'PL', CHECK, CHECK, CHECK, CHECK],
              ['Portugal', 'PT', CHECK, CHECK, CHECK, CHECK],
              ['Spain', 'ES', CHECK, CHECK, CHECK, CHECK],
              ['Sweden', 'SE', CHECK, CHECK, CHECK, CHECK],
              ['Switzerland', 'CH', CHECK, CHECK, CHECK, CHECK],
              ['United Kingdom', 'GB', CHECK, CHECK, CHECK, CHECK],
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
              {['Market', 'Code', 'Address points', 'House number', 'Street level', 'City level'].map(h => (
                <th key={h} style={h === 'Market' ? { ...thStyle, textAlign: 'left' } : thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Australia', 'AU', CHECK, CHECK, CHECK, CHECK],
              ['Japan', 'JP', CHECK, CHECK, CHECK, CHECK],
              ['New Zealand', 'NZ', CHECK, CHECK, CHECK, CHECK],
              ['South Korea', 'KR', CHECK, CHECK, CHECK, CHECK],
              ['Singapore', 'SG', CHECK, CHECK, CHECK, CHECK],
              ['India', 'IN', STAR, STAR, CHECK, CHECK],
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
        For the complete coverage list across all regions, refer to the{' '}
        <a href="https://developer.tomtom.com/geocoding-api/documentation/product-information/market-coverage"
          style={{ color: 'var(--brand)' }}>Geocoding API Market Coverage</a> page on the TomTom developer portal.
      </Callout>
    </div>
  );
}
