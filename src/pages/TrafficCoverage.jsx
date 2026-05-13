import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const tdStyle = { padding: '8px 12px', border: '1px solid var(--border)', fontSize: '0.8125rem', verticalAlign: 'top', textAlign: 'center' };
const thStyle = { ...tdStyle, background: 'var(--s1)', fontWeight: 600 };
const tdLeft = { ...tdStyle, textAlign: 'left' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' };

const CHECK = '✔';

export default function TrafficCoverage({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Traffic API — Market Coverage</h1>
        <PageActions pageId="traffic-coverage" pageTitle="Traffic API — Market Coverage" />
      </div>

      <p className="quick-answer">
        The Traffic API provides real-time traffic incidents and flow data across a broad set of global
        markets. Coverage is available for both the Traffic Incidents API and the Traffic Flow API.
        Markets not listed are not currently supported.
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
            <tr><td style={tdStyle}>{CHECK}</td><td style={tdLeft}>Real-time traffic data is available for this market.</td></tr>
            <tr><td style={tdStyle}>—</td><td style={tdLeft}>Not currently supported.</td></tr>
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="europe">Europe</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              {['Market', 'Code', 'Real-time Incidents', 'Real-time Flow', 'Notes'].map(h => (
                <th key={h} style={h === 'Market' ? { ...thStyle, textAlign: 'left' } : thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Austria', 'AT', CHECK, CHECK, ''],
              ['Belgium', 'BE', CHECK, CHECK, ''],
              ['Czech Republic', 'CZ', CHECK, CHECK, ''],
              ['Denmark', 'DK', CHECK, CHECK, ''],
              ['Finland', 'FI', CHECK, CHECK, ''],
              ['France', 'FR', CHECK, CHECK, ''],
              ['Germany', 'DE', CHECK, CHECK, ''],
              ['Hungary', 'HU', CHECK, CHECK, ''],
              ['Italy', 'IT', CHECK, CHECK, ''],
              ['Netherlands', 'NL', CHECK, CHECK, ''],
              ['Norway', 'NO', CHECK, CHECK, ''],
              ['Poland', 'PL', CHECK, CHECK, ''],
              ['Portugal', 'PT', CHECK, CHECK, ''],
              ['Spain', 'ES', CHECK, CHECK, ''],
              ['Sweden', 'SE', CHECK, CHECK, ''],
              ['Switzerland', 'CH', CHECK, CHECK, ''],
              ['United Kingdom', 'GB', CHECK, CHECK, ''],
            ].map(([market, code, incidents, flow, notes]) => (
              <tr key={market}>
                <td style={tdLeft}>{market}</td>
                <td style={tdStyle}>{code}</td>
                <td style={tdStyle}>{incidents}</td>
                <td style={tdStyle}>{flow}</td>
                <td style={tdLeft}>{notes}</td>
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
              {['Market', 'Code', 'Real-time Incidents', 'Real-time Flow', 'Notes'].map(h => (
                <th key={h} style={h === 'Market' ? { ...thStyle, textAlign: 'left' } : thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['United States', 'US', CHECK, CHECK, 'Major highways and urban roads covered.'],
              ['Canada', 'CA', CHECK, CHECK, ''],
              ['Mexico', 'MX', CHECK, CHECK, 'Major metropolitan areas.'],
              ['Brazil', 'BR', CHECK, CHECK, 'Major cities including São Paulo and Rio de Janeiro.'],
            ].map(([market, code, incidents, flow, notes]) => (
              <tr key={market}>
                <td style={tdLeft}>{market}</td>
                <td style={tdStyle}>{code}</td>
                <td style={tdStyle}>{incidents}</td>
                <td style={tdStyle}>{flow}</td>
                <td style={tdLeft}>{notes}</td>
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
              {['Market', 'Code', 'Real-time Incidents', 'Real-time Flow', 'Notes'].map(h => (
                <th key={h} style={h === 'Market' ? { ...thStyle, textAlign: 'left' } : thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Australia', 'AU', CHECK, CHECK, ''],
              ['Japan', 'JP', CHECK, CHECK, ''],
              ['South Korea', 'KR', CHECK, CHECK, ''],
              ['Singapore', 'SG', CHECK, CHECK, ''],
            ].map(([market, code, incidents, flow, notes]) => (
              <tr key={market}>
                <td style={tdLeft}>{market}</td>
                <td style={tdStyle}>{code}</td>
                <td style={tdStyle}>{incidents}</td>
                <td style={tdStyle}>{flow}</td>
                <td style={tdLeft}>{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout type="info" title="Full coverage data">
        For the complete coverage list, refer to the{' '}
        <a href="https://developer.tomtom.com/traffic-api/documentation/tomtom-maps/product-information/market-coverage"
          style={{ color: 'var(--brand)' }}>Traffic API Market Coverage</a> page on the TomTom developer portal.
      </Callout>
    </div>
  );
}
