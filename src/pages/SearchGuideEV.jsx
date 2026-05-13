import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const codeStyle = {
  background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 12,
  padding: '16px 20px', fontSize: '0.8125rem', lineHeight: 1.7,
  overflowX: 'auto', color: 'var(--black)', fontFamily: 'var(--font-mono)',
  margin: 0,
};

const CODE_NEARBY = `# Find EV charging stations near current location (category 7309)
curl "https://api.tomtom.com/search/2/search/electric vehicle station.json\\
  ?key=YOUR_API_KEY\\
  &lat=52.37939\\
  &lon=4.89998\\
  &radius=5000\\
  &idxSet=POI\\
  &categorySet=7309\\
  &limit=20"`;

const CODE_CONNECTOR_FILTER = `# Filter by connector type AND power range
curl "https://api.tomtom.com/search/2/categorySearch/electric vehicle station.json\\
  ?key=YOUR_API_KEY\\
  &lat=52.37939\\
  &lon=4.89998\\
  &radius=5000\\
  &connectorSet=IEC62196Type2CCS,IEC62196Type2CableAttached\\
  &minPowerKW=22\\
  &maxPowerKW=350"`;

const CODE_ALONG_ROUTE = `# Search along a route (POST with route geometry)
curl -X POST \\
  "https://api.tomtom.com/search/2/searchAlongRoute/electric vehicle station.json\\
    ?key=YOUR_API_KEY\\
    &maxDetourTime=300\\
    &connectorSet=IEC62196Type2CCS\\
    &minPowerKW=50\\
    &limit=10" \\
  -H "Content-Type: application/json" \\
  -d '{
    "route": {
      "points": [
        { "lat": 52.50931, "lon": 13.42936 },
        { "lat": 50.10820, "lon": 8.68413 }
      ]
    }
  }'`;

const CODE_AVAILABILITY_LOOKUP = `# Get chargingAvailability ID from search result
# dataSources.chargingAvailability.id
curl "https://api.tomtom.com/search/2/chargingAvailability.json\\
  ?key=YOUR_API_KEY\\
  &chargingAvailability=00112233-4455-6677-8899-aabbccddeeff\\
  &connectorSet=IEC62196Type2CCS\\
  &minPowerKW=50"`;

export default function SearchGuideEV({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Guide: EV Station Search</h1>
        <PageActions pageId="search-guide-ev" pageTitle="Guide: EV Station Search" />
      </div>
      <p className="quick-answer">
        Learn how to find EV charging stations using the Search API — nearby search, connector
        type filtering, along-route discovery, and real-time availability lookups.
      </p>

      {/* 1. Overview */}
      <div className="zone">
        <h2 className="sh" id="overview">What you'll learn</h2>
        <ul style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
          <li>Finding EV stations using POI category ID <code>7309</code></li>
          <li>Filtering by connector type and power range</li>
          <li>Searching along a route for charging stops</li>
          <li>Linking a search result to real-time availability data</li>
        </ul>
      </div>

      {/* 2. Category ID 7309 */}
      <div className="zone">
        <h2 className="sh" id="category-id">The EV station category: 7309</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          TomTom's POI database uses numeric category IDs. Electric vehicle charging stations
          are categorised under ID <code>7309</code>. Use the <code>categorySet</code> parameter
          to restrict results to EV stations only, or pass the text query
          "electric vehicle station" directly:
        </p>
        <pre style={codeStyle}>{CODE_NEARBY}</pre>
      </div>

      {/* 3. Connector filtering */}
      <div className="zone">
        <h2 className="sh" id="connector-filter">Filtering by connector and power</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          The <code>connectorSet</code> parameter accepts a comma-separated list of connector
          type IDs. Combine with <code>minPowerKW</code> and <code>maxPowerKW</code> to find
          only compatible fast-chargers:
        </p>
        <pre style={codeStyle}>{CODE_CONNECTOR_FILTER}</pre>
        <div style={{ marginTop: '1rem', display: 'grid', gap: '0.5rem' }}>
          {[
            { id: 'IEC62196Type2CCS', label: 'CCS2 (Europe)', desc: 'DC fast charging up to 350 kW' },
            { id: 'IEC62196Type1CCS', label: 'CCS1 (N. America)', desc: 'DC fast charging' },
            { id: 'IEC62196Type2CableAttached', label: 'Type 2 (cable)', desc: 'AC charging up to 22 kW' },
            { id: 'Chademo', label: 'CHAdeMO', desc: 'DC fast charging, common in Japanese vehicles' },
            { id: 'Tesla', label: 'Tesla Supercharger', desc: 'Tesla proprietary network' },
            { id: 'GBT20234Part3', label: 'GB/T DC', desc: 'China DC charging standard' },
          ].map(({ id, label, desc }) => (
            <div key={id} style={{
              display: 'grid', gridTemplateColumns: '220px 140px 1fr', gap: '0.75rem',
              padding: '0.5rem 0.875rem', background: 'var(--s1)',
              border: '1px solid var(--border)', borderRadius: '10px', alignItems: 'center',
            }}>
              <code style={{ fontSize: '0.6875rem', color: 'var(--brand)', fontFamily: 'var(--font-mono)' }}>{id}</code>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--black)' }}>{label}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--mid)' }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Along route */}
      <div className="zone">
        <h2 className="sh" id="along-route">Searching along a route</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          The Along Route Search endpoint (POST) finds stations within a detour from a route
          polyline. Use <code>maxDetourTime</code> (seconds) to control how far off-route a
          station can be:
        </p>
        <pre style={codeStyle}>{CODE_ALONG_ROUTE}</pre>
        <Callout type="info">
          The route geometry should be a simplified set of waypoints. The API computes the
          detour from the closest point on the route to each result. Up to 200 route points
          are supported.
        </Callout>
      </div>

      {/* 5. Availability link */}
      <div className="zone">
        <h2 className="sh" id="availability">Linking to real-time availability</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          When a POI result has a <code>dataSources.chargingAvailability.id</code> field,
          pass that ID to the Charging Availability endpoint to get live connector status.
          You can also filter the availability query by connector type and power:
        </p>
        <pre style={codeStyle}>{CODE_AVAILABILITY_LOOKUP}</pre>
        <Callout type="info">
          Availability data is refreshed every 3 minutes. Not all stations have real-time data —
          if <code>dataSources.chargingAvailability</code> is absent from a search result, the
          station does not have live data in TomTom's network.
        </Callout>
      </div>

      {/* 6. Pitfalls */}
      <div className="zone">
        <Callout type="warn" title="Common pitfalls">
          <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.8 }}>
            <li>Using text search without <code>categorySet=7309</code> can return non-EV results for generic queries.</li>
            <li>Not providing <code>lat/lon</code> returns globally ranked results, not local ones.</li>
            <li>Requesting availability for stations without a <code>dataSources.chargingAvailability.id</code> returns a 404.</li>
            <li>Using <code>radius</code> without <code>lat/lon</code> has no effect.</li>
          </ul>
        </Callout>
      </div>

      {/* 7. Next steps */}
      <div className="zone">
        <h2 className="sh" id="next-steps">Next steps</h2>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="page-action-btn" onClick={() => onNavigate?.('ev-station-search', 'ev-charging-api')}>
            EV Station Search reference
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('search-along-route', 'search-api')}>
            Along Route Search
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('ev-charging-availability', 'ev-charging-api')}>
            Charging Availability
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('ev-guide-connectors', 'ev-charging-api')}>
            Guide: Connector filtering
          </button>
        </div>
      </div>
    </div>
  );
}
