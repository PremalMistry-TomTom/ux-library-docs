import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const codeStyle = {
  background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 12,
  padding: '16px 20px', fontSize: '0.8125rem', lineHeight: 1.7,
  overflowX: 'auto', color: 'var(--black)', fontFamily: 'var(--font-mono)',
  margin: 0,
};

const CODE_CONNECTOR_SEARCH = `# Find CCS2 stations (DC fast charge, Europe)
curl "https://api.tomtom.com/search/2/categorySearch/electric vehicle station.json\\
  ?key=YOUR_API_KEY\\
  &lat=52.37939&lon=4.89998\\
  &radius=5000\\
  &connectorSet=IEC62196Type2CCS"`;

const CODE_MULTI_CONNECTOR = `# Multi-connector filter: CCS2 OR CHAdeMO
curl "https://api.tomtom.com/search/2/categorySearch/electric vehicle station.json\\
  ?key=YOUR_API_KEY\\
  &lat=52.37939&lon=4.89998\\
  &radius=5000\\
  &connectorSet=IEC62196Type2CCS,Chademo"`;

const CODE_POWER_FILTER = `# Fast chargers only: CCS2, min 50 kW
curl "https://api.tomtom.com/search/2/categorySearch/electric vehicle station.json\\
  ?key=YOUR_API_KEY\\
  &lat=52.37939&lon=4.89998\\
  &radius=5000\\
  &connectorSet=IEC62196Type2CCS\\
  &minPowerKW=50\\
  &maxPowerKW=350"`;

const CODE_AVAILABILITY_FILTER = `# Check availability filtered by connector type
curl "https://api.tomtom.com/search/2/chargingAvailability.json\\
  ?key=YOUR_API_KEY\\
  &chargingAvailability=00112233-4455-6677-8899-aabbccddeeff\\
  &connectorSet=IEC62196Type2CCS\\
  &minPowerKW=50"`;

const CODE_AVAILABILITY_RESPONSE = `{
  "connectors": [
    {
      "connectorType": {
        "id": "IEC62196Type2CCS",
        "name": "IEC 62196 Type 2 CCS"
      },
      "ratedPowerKW": 150,
      "availability": {
        "current": {
          "available": 2,
          "occupied": 1,
          "reserved": 0,
          "unknown": 0
        }
      }
    },
    {
      "connectorType": {
        "id": "IEC62196Type2CCS",
        "name": "IEC 62196 Type 2 CCS"
      },
      "ratedPowerKW": 350,
      "availability": {
        "current": {
          "available": 0,
          "occupied": 4,
          "reserved": 0,
          "unknown": 0
        }
      }
    }
  ]
}`;

export default function EVGuideConnectors({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Guide: Connector Type Filtering</h1>
        <PageActions pageId="ev-guide-connectors" pageTitle="Guide: Connector Type Filtering" />
      </div>
      <p className="quick-answer">
        Filter EV station search results and availability queries by connector type and
        charging power — find only the stations compatible with a specific vehicle.
      </p>

      {/* 1. Overview */}
      <div className="zone">
        <h2 className="sh" id="overview">What you'll learn</h2>
        <ul style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
          <li>The full list of supported connector type IDs</li>
          <li>Single and multi-connector filtering with <code>connectorSet</code></li>
          <li>Power range filtering with <code>minPowerKW</code> and <code>maxPowerKW</code></li>
          <li>Filtering the Charging Availability response by connector type</li>
          <li>Reading the availability response per connector group</li>
        </ul>
      </div>

      {/* 2. Connector types table */}
      <div className="zone">
        <h2 className="sh" id="connector-types">Supported connector types</h2>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {[
            { id: 'StandardHouseholdCountrySpecific', region: 'Global', type: 'AC', desc: 'Standard household plug (country-specific variant). Slow charging.' },
            { id: 'IEC62196Type1', region: 'NA / Japan', type: 'AC', desc: 'SAE J1772 / Type 1. Up to 7.4 kW single-phase.' },
            { id: 'IEC62196Type1CCS', region: 'NA / Japan', type: 'DC', desc: 'CCS1 (Combined Charging System). DC fast charging.' },
            { id: 'IEC62196Type2CableAttached', region: 'Europe', type: 'AC', desc: 'Type 2 with cable attached to the charger. Up to 22 kW.' },
            { id: 'IEC62196Type2Outlet', region: 'Europe', type: 'AC', desc: 'Type 2 socket outlet. Bring your own cable. Up to 22 kW.' },
            { id: 'IEC62196Type2CCS', region: 'Europe', type: 'DC', desc: 'CCS2 (Combined Charging System). DC fast charging up to 350 kW.' },
            { id: 'IEC62196Type3', region: 'France / Italy', type: 'AC', desc: 'Type 3 (Scame). Mostly legacy, being phased out.' },
            { id: 'Chademo', region: 'Global', type: 'DC', desc: 'CHAdeMO standard. Common in Nissan and Mitsubishi EVs.' },
            { id: 'GBT20234Part2', region: 'China', type: 'AC', desc: 'GB/T AC charging standard.' },
            { id: 'GBT20234Part3', region: 'China', type: 'DC', desc: 'GB/T DC fast charging standard.' },
            { id: 'Tesla', region: 'Global', type: 'DC', desc: 'Tesla proprietary connector. Non-adapted Supercharger.' },
            { id: 'AdaptedTesla', region: 'Europe', type: 'AC/DC', desc: 'Tesla connector adapted to local standard (e.g. Type 2 CCS in Europe).' },
          ].map(({ id, region, type, desc }) => (
            <div key={id} style={{
              display: 'grid', gridTemplateColumns: '220px 80px 50px 1fr', gap: '0.75rem',
              padding: '0.5rem 0.875rem', background: 'var(--s1)',
              border: '1px solid var(--border)', borderRadius: '10px', alignItems: 'start',
            }}>
              <code style={{ fontSize: '0.6875rem', color: 'var(--brand)', fontFamily: 'var(--font-mono)' }}>{id}</code>
              <span style={{ fontSize: '0.75rem', color: 'var(--mid)' }}>{region}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: type === 'DC' ? '#7c3aed' : '#15803d' }}>{type}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text)' }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Single connector filter */}
      <div className="zone">
        <h2 className="sh" id="single-filter">Single connector filter</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          Pass a single connector type to <code>connectorSet</code> to return only stations
          with that connector type:
        </p>
        <pre style={codeStyle}>{CODE_CONNECTOR_SEARCH}</pre>
      </div>

      {/* 4. Multi-connector filter */}
      <div className="zone">
        <h2 className="sh" id="multi-filter">Multi-connector filter</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          To match stations with <em>any</em> of several compatible connectors, pass a
          comma-separated list. The API returns stations that have at least one matching type:
        </p>
        <pre style={codeStyle}>{CODE_MULTI_CONNECTOR}</pre>
        <Callout type="info">
          The filter is an OR operation — a station is included if it has at least one
          of the specified connector types, not necessarily all of them.
        </Callout>
      </div>

      {/* 5. Power filter */}
      <div className="zone">
        <h2 className="sh" id="power-filter">Power range filtering</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          Combine <code>minPowerKW</code> and <code>maxPowerKW</code> to find stations within
          a compatible charging power range. This is essential for vehicles with a maximum
          AC or DC charge rate:
        </p>
        <pre style={codeStyle}>{CODE_POWER_FILTER}</pre>
        <div style={{ display: 'grid', gap: '0.5rem', marginTop: '0.75rem' }}>
          {[
            { power: '< 7.4 kW', type: 'AC slow charging', use: 'Overnight home/workplace charging' },
            { power: '7.4 – 22 kW', type: 'AC fast charging', use: 'Town centre, shopping car parks' },
            { power: '50 – 150 kW', type: 'DC fast charging', use: 'Service stations, major roads' },
            { power: '150 – 350 kW', type: 'DC ultra-fast charging', use: 'Highway corridors, fleet hubs' },
          ].map(({ power, type, use }) => (
            <div key={power} style={{
              display: 'grid', gridTemplateColumns: '120px 200px 1fr', gap: '0.75rem',
              padding: '0.5rem 0.875rem', background: 'var(--s1)',
              border: '1px solid var(--border)', borderRadius: '10px', alignItems: 'center',
            }}>
              <code style={{ fontSize: '0.75rem', color: 'var(--brand)', fontFamily: 'var(--font-mono)' }}>{power}</code>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--black)' }}>{type}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--mid)' }}>{use}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Availability filter */}
      <div className="zone">
        <h2 className="sh" id="availability-filter">Filtering availability by connector</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          The Charging Availability endpoint also supports <code>connectorSet</code> and
          power filters. Use these to get availability only for connectors compatible with
          a specific vehicle:
        </p>
        <pre style={codeStyle}>{CODE_AVAILABILITY_FILTER}</pre>
        <p style={{ fontSize: '0.8125rem', color: 'var(--mid)', marginTop: '1rem', marginBottom: '0.5rem' }}>
          The availability response groups connectors by type and power level:
        </p>
        <pre style={codeStyle}>{CODE_AVAILABILITY_RESPONSE}</pre>
      </div>

      {/* 7. Pitfalls */}
      <div className="zone">
        <Callout type="warn" title="Common pitfalls">
          <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.8 }}>
            <li>Using spaces in comma-separated <code>connectorSet</code> values — values must be comma-separated with no spaces.</li>
            <li>Mixing up CCS1 (North America) and CCS2 (Europe) — use the right connector ID for the vehicle's market.</li>
            <li><code>minPowerKW</code> and <code>maxPowerKW</code> apply to the connector's rated power, not the vehicle's actual charging rate.</li>
            <li>Filtering availability by connector when the station doesn't have real-time data — no data means no filtered connectors in the response.</li>
          </ul>
        </Callout>
      </div>

      {/* 8. Next steps */}
      <div className="zone">
        <h2 className="sh" id="next-steps">Next steps</h2>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="page-action-btn" onClick={() => onNavigate?.('ev-charging-availability', 'ev-charging-api')}>
            Charging Availability reference
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('ev-guide-discovery', 'ev-charging-api')}>
            Guide: Station discovery
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('ev-guide-jmespath', 'ev-charging-api')}>
            Guide: JMESPath filtering
          </button>
        </div>
      </div>
    </div>
  );
}
