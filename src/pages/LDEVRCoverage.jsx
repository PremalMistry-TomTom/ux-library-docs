import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const tdStyle = { padding: '8px 12px', border: '1px solid var(--border)', fontSize: '0.8125rem', verticalAlign: 'top', textAlign: 'center' };
const thStyle = { ...tdStyle, background: 'var(--s1)', fontWeight: 600 };
const tdLeft = { ...tdStyle, textAlign: 'left' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' };

const CHECK = '✔';
const STAR = '★';

export default function LDEVRCoverage({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Long Distance EV Routing API — Market Coverage</h1>
        <PageActions pageId="ldevr-coverage" pageTitle="Long Distance EV Routing API — Market Coverage" />
      </div>

      <p className="quick-answer">
        The Long Distance EV Routing API calculates routes with automatic charging stops using
        EV charging station data. Coverage depends on the availability of EV charging station data
        and routing data for the market.
      </p>

      <div className="zone">
        <h2 className="sh" id="overview">Coverage Overview</h2>
        <p>
          Route calculation coverage follows the Routing API market coverage. EV charging stop
          insertion requires EV charging station data to be available in the market.
          The LDEVR API uses EV charging data updated regularly from TomTom's POI database.
        </p>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{ ...thStyle, textAlign: 'left' }}>Coverage type</th>
              <th style={{ ...thStyle, textAlign: 'left' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={tdLeft}><strong>Route calculation</strong></td><td style={tdLeft}>Available wherever the Routing API has road network data.</td></tr>
            <tr><td style={tdLeft}><strong>EV charging stops</strong></td><td style={tdLeft}>Available in markets where EV charging station data exists in TomTom's POI database.</td></tr>
            <tr><td style={tdLeft}><strong>Charging availability</strong></td><td style={tdLeft}>Real-time availability data integrated via the EV Charging Stations Availability API.</td></tr>
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="europe">Europe</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              {['Market', 'Code', 'Route Calculation', 'EV Charging Stops', 'Notes'].map(h => (
                <th key={h} style={h === 'Market' ? { ...thStyle, textAlign: 'left' } : thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Austria', 'AT', CHECK, CHECK, ''],
              ['Belgium', 'BE', CHECK, CHECK, ''],
              ['Denmark', 'DK', CHECK, CHECK, ''],
              ['Finland', 'FI', CHECK, CHECK, ''],
              ['France', 'FR', CHECK, CHECK, ''],
              ['Germany', 'DE', CHECK, CHECK, ''],
              ['Italy', 'IT', CHECK, CHECK, ''],
              ['Netherlands', 'NL', CHECK, CHECK, ''],
              ['Norway', 'NO', CHECK, CHECK, ''],
              ['Poland', 'PL', CHECK, CHECK, ''],
              ['Portugal', 'PT', CHECK, CHECK, ''],
              ['Spain', 'ES', CHECK, CHECK, ''],
              ['Sweden', 'SE', CHECK, CHECK, ''],
              ['Switzerland', 'CH', CHECK, CHECK, ''],
              ['United Kingdom', 'GB', CHECK, CHECK, ''],
            ].map(([market, code, route, ev, notes]) => (
              <tr key={market}>
                <td style={tdLeft}>{market}</td>
                <td style={tdStyle}>{code}</td>
                <td style={tdStyle}>{route}</td>
                <td style={tdStyle}>{ev}</td>
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
              {['Market', 'Code', 'Route Calculation', 'EV Charging Stops', 'Notes'].map(h => (
                <th key={h} style={h === 'Market' ? { ...thStyle, textAlign: 'left' } : thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['United States', 'US', CHECK, CHECK, ''],
              ['Canada', 'CA', CHECK, CHECK, ''],
            ].map(([market, code, route, ev, notes]) => (
              <tr key={market}>
                <td style={tdLeft}>{market}</td>
                <td style={tdStyle}>{code}</td>
                <td style={tdStyle}>{route}</td>
                <td style={tdStyle}>{ev}</td>
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
              {['Market', 'Code', 'Route Calculation', 'EV Charging Stops', 'Notes'].map(h => (
                <th key={h} style={h === 'Market' ? { ...thStyle, textAlign: 'left' } : thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Australia', 'AU', CHECK, CHECK, ''],
              ['Japan', 'JP', CHECK, STAR, 'EV charging station data coverage varies.'],
              ['South Korea', 'KR', CHECK, STAR, 'EV charging station data coverage varies.'],
            ].map(([market, code, route, ev, notes]) => (
              <tr key={market}>
                <td style={tdLeft}>{market}</td>
                <td style={tdStyle}>{code}</td>
                <td style={tdStyle}>{route}</td>
                <td style={tdStyle}>{ev}</td>
                <td style={tdLeft}>{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout type="info" title="Full coverage data">
        For the complete and up-to-date market coverage list, refer to the{' '}
        <a href="https://developer.tomtom.com/long-distance-ev-routing-api/documentation/tomtom-maps/product-information/market-coverage"
          style={{ color: 'var(--brand)' }}>LDEVR API Market Coverage</a> page on the TomTom developer portal.
      </Callout>
    </div>
  );
}
