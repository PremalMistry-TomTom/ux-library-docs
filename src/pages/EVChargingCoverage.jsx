import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const tdStyle = { padding: '8px 12px', border: '1px solid var(--border)', fontSize: '0.8125rem', verticalAlign: 'top', textAlign: 'center' };
const thStyle = { ...tdStyle, background: 'var(--s1)', fontWeight: 600 };
const tdLeft = { ...tdStyle, textAlign: 'left' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' };

const CHECK = '✔';

export default function EVChargingCoverage({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>EV Charging API — Market Coverage</h1>
        <PageActions pageId="ev-charging-coverage" pageTitle="EV Charging API — Market Coverage" />
      </div>

      <p className="quick-answer">
        The EV Charging Stations Availability API provides near-real-time charging availability data
        for a growing list of markets. Markets listed below support at least one category of EV
        charging station availability data.
      </p>

      <div className="zone">
        <h2 className="sh" id="europe">Europe</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              {['Market', 'Code', 'Real-time Availability', 'Notes'].map(h => (
                <th key={h} style={h === 'Market' ? { ...thStyle, textAlign: 'left' } : thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Austria', 'AT', CHECK, ''],
              ['Belgium', 'BE', CHECK, ''],
              ['Czech Republic', 'CZ', CHECK, ''],
              ['Denmark', 'DK', CHECK, ''],
              ['Finland', 'FI', CHECK, ''],
              ['France', 'FR', CHECK, ''],
              ['Germany', 'DE', CHECK, ''],
              ['Hungary', 'HU', CHECK, ''],
              ['Italy', 'IT', CHECK, ''],
              ['Netherlands', 'NL', CHECK, ''],
              ['Norway', 'NO', CHECK, ''],
              ['Poland', 'PL', CHECK, ''],
              ['Portugal', 'PT', CHECK, ''],
              ['Spain', 'ES', CHECK, ''],
              ['Sweden', 'SE', CHECK, ''],
              ['Switzerland', 'CH', CHECK, ''],
              ['United Kingdom', 'GB', CHECK, ''],
            ].map(([market, code, avail, notes]) => (
              <tr key={market}>
                <td style={tdLeft}>{market}</td>
                <td style={tdStyle}>{code}</td>
                <td style={tdStyle}>{avail}</td>
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
              {['Market', 'Code', 'Real-time Availability', 'Notes'].map(h => (
                <th key={h} style={h === 'Market' ? { ...thStyle, textAlign: 'left' } : thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['United States', 'US', CHECK, ''],
              ['Canada', 'CA', CHECK, ''],
            ].map(([market, code, avail, notes]) => (
              <tr key={market}>
                <td style={tdLeft}>{market}</td>
                <td style={tdStyle}>{code}</td>
                <td style={tdStyle}>{avail}</td>
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
              {['Market', 'Code', 'Real-time Availability', 'Notes'].map(h => (
                <th key={h} style={h === 'Market' ? { ...thStyle, textAlign: 'left' } : thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Australia', 'AU', CHECK, ''],
              ['South Korea', 'KR', CHECK, ''],
            ].map(([market, code, avail, notes]) => (
              <tr key={market}>
                <td style={tdLeft}>{market}</td>
                <td style={tdStyle}>{code}</td>
                <td style={tdStyle}>{avail}</td>
                <td style={tdLeft}>{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout type="info" title="Full coverage data">
        For the complete and up-to-date list of supported markets, refer to the{' '}
        <a href="https://developer.tomtom.com/ev-charging-stations-availability-api/documentation/product-information/market-coverage"
          style={{ color: 'var(--brand)' }}>EV Charging API Market Coverage</a> page on the TomTom developer portal.
      </Callout>
    </div>
  );
}
