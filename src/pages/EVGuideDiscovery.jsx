import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const codeStyle = {
  background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 12,
  padding: '16px 20px', fontSize: '0.8125rem', lineHeight: 1.7,
  overflowX: 'auto', color: 'var(--black)', fontFamily: 'var(--font-mono)',
  margin: 0,
};

const CODE_NEARBY = `# Nearby search — EV stations within 5km of a location
curl "https://api.tomtom.com/search/2/categorySearch/electric vehicle station.json\\
  ?key=YOUR_API_KEY\\
  &lat=52.37939\\
  &lon=4.89998\\
  &radius=5000\\
  &limit=20"`;

const CODE_ALONG_ROUTE = `# Along-route search — stations with max 5 min detour
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
        { "lat": 51.50853, "lon": -0.12574 },
        { "lat": 48.85341, "lon": 2.34880 }
      ]
    }
  }'`;

const CODE_GEOMETRY = `# Geometry search — stations within a custom polygon
curl -X POST \\
  "https://api.tomtom.com/search/2/geometrySearch/electric vehicle station.json\\
    ?key=YOUR_API_KEY\\
    &limit=20" \\
  -H "Content-Type: application/json" \\
  -d '{
    "geometryList": [
      {
        "type": "POLYGON",
        "vertices": [
          "52.401,4.857",
          "52.401,4.954",
          "52.325,4.954",
          "52.325,4.857"
        ]
      }
    ]
  }'`;

const CODE_BY_ID = `# Look up a specific station by Place ID (entityId)
curl "https://api.tomtom.com/search/2/place.json\\
  ?key=YOUR_API_KEY\\
  &entityId=840DR5SS91"`;

const CODE_RESULT_FIELDS = `{
  "type": "POI",
  "poi": {
    "name": "Fastned Amsterdam Centraal",
    "categorySet": [{ "id": 7309 }]
  },
  "address": { "freeformAddress": "Prins Hendrikkade 20-21, 1012 TL Amsterdam" },
  "position": { "lat": 52.37867, "lon": 4.90268 },
  "dist": 342.6,
  "dataSources": {
    "chargingAvailability": {
      "id": "00112233-4455-6677-8899-aabbccddeeff"
    }
  }
}`;

export default function EVGuideDiscovery({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Guide: Station Discovery Patterns</h1>
        <PageActions pageId="ev-guide-discovery" pageTitle="Guide: Station Discovery Patterns" />
      </div>
      <p className="quick-answer">
        Three patterns for discovering EV charging stations: nearby radius search, along a
        route with detour tolerance, and within a custom polygon geometry.
      </p>

      {/* 1. Overview */}
      <div className="zone">
        <h2 className="sh" id="overview">What you'll learn</h2>
        <ul style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
          <li>Nearby search — stations within a radius of a coordinate</li>
          <li>Along-route search — stations reachable with a limited detour</li>
          <li>Geometry search — stations within a custom polygon</li>
          <li>Place by ID — retrieving a specific known station</li>
          <li>Key response fields for EV station results</li>
        </ul>
      </div>

      {/* 2. Category ID */}
      <div className="zone">
        <h2 className="sh" id="category">EV station category: 7309</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          All discovery patterns use category ID <code>7309</code> (Electric Vehicle Station).
          You can pass this via <code>categorySet=7309</code> or use the text query
          "electric vehicle station" in the category search endpoint. Both return the same
          station dataset.
        </p>
      </div>

      {/* 3. Nearby */}
      <div className="zone">
        <h2 className="sh" id="nearby">Pattern 1: Nearby radius search</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          The most common pattern — find stations within a given radius of the user's
          current location or a destination point. Use <code>lat/lon</code> + <code>radius</code>
          (in metres):
        </p>
        <pre style={codeStyle}>{CODE_NEARBY}</pre>
      </div>

      {/* 4. Along route */}
      <div className="zone">
        <h2 className="sh" id="along-route">Pattern 2: Along-route search</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          Find stations with an acceptable detour from a planned route. POST a simplified
          list of route waypoints and specify <code>maxDetourTime</code> in seconds.
          Combine with <code>connectorSet</code> and <code>minPowerKW</code> for vehicle-compatible results:
        </p>
        <pre style={codeStyle}>{CODE_ALONG_ROUTE}</pre>
        <Callout type="info">
          <code>maxDetourTime</code> is the total extra time added to the route (in seconds)
          by diverting to and from the charging station. The API only returns stations where
          the round-trip detour is within this limit.
        </Callout>
      </div>

      {/* 5. Geometry */}
      <div className="zone">
        <h2 className="sh" id="geometry">Pattern 3: Geometry (polygon) search</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          Restrict results to a custom polygon or circle geometry. Useful for zone-based
          fleet charging management or service area coverage:
        </p>
        <pre style={codeStyle}>{CODE_GEOMETRY}</pre>
      </div>

      {/* 6. Place by ID */}
      <div className="zone">
        <h2 className="sh" id="place-by-id">Place by ID — specific station lookup</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          If you already know a station's Place ID (from a previous search result or a
          stored reference), retrieve its full details with the Place by ID endpoint:
        </p>
        <pre style={codeStyle}>{CODE_BY_ID}</pre>
      </div>

      {/* 7. Key result fields */}
      <div className="zone">
        <h2 className="sh" id="result-fields">Key EV station result fields</h2>
        <pre style={codeStyle}>{CODE_RESULT_FIELDS}</pre>
        <div style={{ display: 'grid', gap: '0.5rem', marginTop: '0.75rem' }}>
          {[
            { field: 'poi.name', desc: 'Station operator name (e.g. Fastned, ChargePoint, Ionity).' },
            { field: 'poi.categorySet[].id', desc: 'Category IDs — 7309 confirms this is an EV station.' },
            { field: 'position', desc: 'Lat/lon of the station for map display.' },
            { field: 'dist', desc: 'Distance from the query point in metres (nearby search only).' },
            { field: 'dataSources.chargingAvailability.id', desc: 'Pass to the Charging Availability endpoint for real-time connector status.' },
          ].map(({ field, desc }) => (
            <div key={field} style={{
              display: 'grid', gridTemplateColumns: '280px 1fr', gap: '0.75rem',
              padding: '0.5rem 0.875rem', background: 'var(--s1)',
              border: '1px solid var(--border)', borderRadius: '10px', alignItems: 'start',
            }}>
              <code style={{ fontSize: '0.6875rem', color: 'var(--brand)', fontFamily: 'var(--font-mono)' }}>{field}</code>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text)' }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 8. Pitfalls */}
      <div className="zone">
        <Callout type="warn" title="Common pitfalls">
          <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.8 }}>
            <li>Nearby search without <code>lat/lon</code> — results are globally ranked without location context.</li>
            <li>Along-route search with too many waypoints — simplify the route to key points for best performance.</li>
            <li>Assuming all stations have a <code>chargingAvailability.id</code> — not all stations have real-time data coverage.</li>
            <li>Requesting too high a <code>limit</code> on along-route search — the API returns up to the limit but performance degrades with large result sets.</li>
          </ul>
        </Callout>
      </div>

      {/* 9. Next steps */}
      <div className="zone">
        <h2 className="sh" id="next-steps">Next steps</h2>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="page-action-btn" onClick={() => onNavigate?.('ev-station-search', 'ev-charging-api')}>
            EV Station Search reference
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('ev-search-along-route', 'ev-charging-api')}>
            Along Route Search
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('ev-guide-connectors', 'ev-charging-api')}>
            Guide: Connector filtering
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('ev-charging-availability', 'ev-charging-api')}>
            Charging Availability
          </button>
        </div>
      </div>
    </div>
  );
}
