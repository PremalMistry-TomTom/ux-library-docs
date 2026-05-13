import PageActions from '../components/ui/PageActions';

const tdStyle = { padding: '8px 12px', border: '1px solid var(--border)', fontSize: '0.8125rem', verticalAlign: 'top' };
const thStyle = { ...tdStyle, background: 'var(--s1)', fontWeight: 600 };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' };

export default function EVConnectorTypes({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>EV Charging API — Supported Connector Types</h1>
        <PageActions pageId="ev-connector-types" pageTitle="EV Charging API — Supported Connector Types" />
      </div>

      <p className="quick-answer">
        The EV Charging Stations Availability API supports filtering by connector type using the
        <code>connectorSet</code> parameter. The following table lists all supported connector type
        values and their associated standard or description.
      </p>

      <div className="zone">
        <h2 className="sh" id="connector-table">Connector Types</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{ ...thStyle, width: 280 }}>Connector type value</th>
              <th style={thStyle}>Standard and description</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['StandardHouseholdCountrySpecific', 'Standard household connectors for a specific region. AC single phase, standard voltage and amperage. Varies by country (see IEC 60083 and related standards).'],
              ['IEC62196Type1', 'Type 1 connector as defined in IEC 62196-2. Also called Yazaki or SAE J1772. Mostly used with 120V single phase or up to 240V single phase infrastructure.'],
              ['IEC62196Type1CCS', 'Type 1 based combo connector as defined in IEC 62196-3. Based on the Type 1 connector with two additional DC contacts for fast charging.'],
              ['IEC62196Type2CableAttached', 'Type 2 connector as defined in IEC 62196-2. Provided as a cable and plug attached to the charging point.'],
              ['IEC62196Type2Outlet', 'Type 2 connector as defined in IEC 62196-2. Provided as a socket set into the charging point.'],
              ['IEC62196Type2CCS', 'Type 2 based combo connector as defined in IEC 62196-3. Based on the Type 2 connector with two additional DC contacts for fast charging.'],
              ['IEC62196Type3', 'Type 3 connector as defined in IEC 62196-2. Also called Scame after the original manufacturer. Used with up to 240V single phase or up to 420V three phase.'],
              ['Chademo', 'CHAdeMO connector. Named after an association formed by the Tokyo Electric Power Company and industrial partners (TEPCO connector). Supports fast DC charging.'],
              ['GBT20234Part2', 'China Part 2 connector as defined in GB/T 20234.2-2015. Used with 220V single phase, extensible to three phase infrastructure.'],
              ['GBT20234Part3', 'China Part 3 connector as defined in GB/T 20234.3-2015. Supports fast DC charging.'],
              ['IEC60309AC3PhaseRed', 'Industrial Red connector as defined in IEC 60309. Three phase (3P+N+E, 6h configuration). Sometimes referred to by color and phase count.'],
              ['IEC60309AC1PhaseBlue', 'Industrial Blue connector as defined in IEC 60309. Single phase (P+N+E, 6h configuration).'],
              ['IEC60309DCWhite', 'Industrial White connector as defined in IEC 60309. DC connector.'],
              ['Tesla', 'Tesla connector — regionally specific Tesla Supercharger connector. Refers to either Tesla\'s proprietary connector (North America) or the modified Type 2 DC-over-Type-2 variant (Europe).'],
            ].map(([type, desc]) => (
              <tr key={type}>
                <td style={tdStyle}><code>{type}</code></td>
                <td style={tdStyle}>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="usage">Using connectorSet</h2>
        <p>
          Pass connector type values as a comma-separated string in the <code>connectorSet</code> query
          parameter to filter availability results:
        </p>
        <pre style={{ background: 'var(--s1)', padding: 12, borderRadius: 6, fontSize: '0.8125rem', overflowX: 'auto' }}>
{`GET https://api.tomtom.com/search/2/chargingAvailability.json
    ?key={Your_API_Key}
    &chargingAvailability={stationId}
    &connectorSet=IEC62196Type2CableAttached,IEC62196Type2CCS`}
        </pre>
      </div>
    </div>
  );
}
