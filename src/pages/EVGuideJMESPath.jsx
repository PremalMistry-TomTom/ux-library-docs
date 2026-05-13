import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const codeStyle = {
  background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 12,
  padding: '16px 20px', fontSize: '0.8125rem', lineHeight: 1.7,
  overflowX: 'auto', color: 'var(--black)', fontFamily: 'var(--font-mono)',
  margin: 0,
};

const CODE_BASIC_JMES = `# Orbis Maps v2 — EV station search with JMESPath filter
# Returns only name, position, and chargingAvailability ID
curl "https://api.tomtom.com/maps/orbis/ev/chargingAvailability.json\\
  ?key=YOUR_API_KEY\\
  &chargingAvailability=00112233-4455-6677-8899-aabbccddeeff" \\
  -H "TomTom-Api-Version: 1"`;

const CODE_JMES_SEARCH = `# Fuzzy Search with JMESPath projection (Orbis Maps Search v2)
# Projection: return only name, position, and dataSources fields
curl "https://api.tomtom.com/maps/orbis/search/2/search/electric vehicle station.json\\
  ?key=YOUR_API_KEY\\
  &lat=52.37939&lon=4.89998\\
  &radius=5000\\
  &fields=results.poi.name,results.position,results.dataSources" \\
  -H "TomTom-Api-Version: 1"`;

const CODE_JMES_EXPRESSION = `// JMESPath expressions — applied client-side with a library
// Install: npm install jmespath

import jmespath from 'jmespath';

const response = await fetchEVStations(); // full API response

// Extract only name and position from results
const simplified = jmespath.search(
  response,
  'results[*].{name: poi.name, lat: position.lat, lon: position.lon, availId: dataSources.chargingAvailability.id}'
);

// Filter to only results with availability IDs
const withAvailability = jmespath.search(
  response,
  'results[?dataSources.chargingAvailability.id]'
);

// Sort by distance (dist field, ascending)
const nearest = jmespath.search(
  response,
  'sort_by(results, &dist)[0:5]'
);`;

const CODE_JMES_AVAILABILITY = `// Extract available connectors from availability response
import jmespath from 'jmespath';

const availability = await fetchAvailability(chargingAvailabilityId);

// Get connectors with at least 1 available slot
const available = jmespath.search(
  availability,
  'connectors[?availability.current.available > \`0\`].{type: connectorType.id, kw: ratedPowerKW, free: availability.current.available}'
);

// Find the highest-power available connector
const fastest = jmespath.search(
  availability,
  'sort_by(connectors[?availability.current.available > \`0\`], &ratedPowerKW)[-1]'
);`;

const CODE_AVAILABILITY_SHAPE = `{
  "connectors": [
    {
      "connectorType": { "id": "IEC62196Type2CCS", "name": "IEC 62196 Type 2 CCS" },
      "ratedPowerKW": 150,
      "availability": {
        "current": { "available": 2, "occupied": 1, "reserved": 0, "unknown": 0 }
      }
    },
    {
      "connectorType": { "id": "IEC62196Type2CCS", "name": "IEC 62196 Type 2 CCS" },
      "ratedPowerKW": 350,
      "availability": {
        "current": { "available": 0, "occupied": 4, "reserved": 0, "unknown": 0 }
      }
    }
  ]
}`;

export default function EVGuideJMESPath({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Guide: JMESPath Response Filtering</h1>
        <PageActions pageId="ev-guide-jmespath" pageTitle="Guide: JMESPath Response Filtering" />
      </div>
      <p className="quick-answer">
        Use JMESPath expressions to extract, filter, and transform EV API responses —
        reducing payload size and simplifying client-side data handling.
      </p>

      {/* 1. Overview */}
      <div className="zone">
        <h2 className="sh" id="overview">What you'll learn</h2>
        <ul style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
          <li>What JMESPath is and when to use it</li>
          <li>Server-side field projection with the Orbis Maps v2 API</li>
          <li>Client-side JMESPath filtering with the <code>jmespath</code> library</li>
          <li>Practical expressions for EV station and availability data</li>
        </ul>
      </div>

      {/* 2. What is JMESPath */}
      <div className="zone">
        <h2 className="sh" id="what-is-jmespath">What is JMESPath?</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          JMESPath is a query language for JSON. It lets you extract specific fields,
          filter arrays by conditions, and project custom shapes from a JSON document —
          similar to SQL SELECT but for JSON objects.
        </p>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          In the context of the TomTom EV Charging API:
        </p>
        <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: '1fr 1fr' }}>
          {[
            { title: 'Server-side (Orbis Maps v2)', desc: 'Use the fields parameter in the Orbis Maps v2 API to request only specific response fields. This reduces response payload size and bandwidth.' },
            { title: 'Client-side (any version)', desc: 'Apply JMESPath expressions in your application using the jmespath npm package. Works with any API version response.' },
          ].map(b => (
            <div key={b.title} style={{
              padding: '1rem', background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 12,
            }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--brand)', marginBottom: '0.375rem' }}>{b.title}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--mid)', lineHeight: 1.5 }}>{b.desc}</div>
            </div>
          ))}
        </div>
        <Callout type="info">
          Server-side field projection is only available in the <strong>TomTom Orbis Maps</strong>
          platform (v2 API). If you use the standard TomTom Maps API, apply JMESPath client-side.
        </Callout>
      </div>

      {/* 3. Orbis v2 server-side */}
      <div className="zone">
        <h2 className="sh" id="server-side">Server-side field projection (Orbis Maps)</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          The Orbis Maps API accepts a <code>fields</code> query parameter with a
          comma-separated list of JMESPath field paths. Only the requested fields are
          included in the response:
        </p>
        <pre style={codeStyle}>{CODE_JMES_SEARCH}</pre>
        <pre style={{ ...codeStyle, marginTop: '0.75rem' }}>{CODE_BASIC_JMES}</pre>
      </div>

      {/* 4. Client-side expressions */}
      <div className="zone">
        <h2 className="sh" id="client-side">Client-side JMESPath expressions</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          Install the <code>jmespath</code> package and apply expressions to any API response.
          Common patterns for EV station search results:
        </p>
        <pre style={codeStyle}>{CODE_JMES_EXPRESSION}</pre>
      </div>

      {/* 5. Availability filtering */}
      <div className="zone">
        <h2 className="sh" id="availability">Filtering availability responses</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          The availability response shape for applying JMESPath expressions:
        </p>
        <pre style={codeStyle}>{CODE_AVAILABILITY_SHAPE}</pre>
        <p style={{ fontSize: '0.8125rem', color: 'var(--mid)', marginTop: '1rem', marginBottom: '0.5rem' }}>
          Useful JMESPath expressions for the availability response:
        </p>
        <pre style={codeStyle}>{CODE_JMES_AVAILABILITY}</pre>
      </div>

      {/* 6. Quick reference */}
      <div className="zone">
        <h2 className="sh" id="quick-reference">JMESPath quick reference</h2>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {[
            { expr: 'results[*].poi.name', desc: 'Extract POI names from all results.' },
            { expr: 'results[?dist < `1000`]', desc: 'Filter results within 1000 m.' },
            { expr: 'results[?dataSources.chargingAvailability.id]', desc: 'Results with availability IDs only.' },
            { expr: 'sort_by(results, &dist)', desc: 'Sort results by distance (ascending).' },
            { expr: 'sort_by(results, &dist)[-1]', desc: 'The farthest result.' },
            { expr: 'sort_by(results, &dist)[0:5]', desc: 'The 5 nearest results.' },
            { expr: 'results[*].{name: poi.name, lat: position.lat, lon: position.lon}', desc: 'Project custom shape from results.' },
            { expr: 'connectors[?availability.current.available > `0`]', desc: 'Only connectors with available slots.' },
          ].map(({ expr, desc }) => (
            <div key={expr} style={{
              display: 'grid', gridTemplateColumns: '340px 1fr', gap: '0.75rem',
              padding: '0.5rem 0.875rem', background: 'var(--s1)',
              border: '1px solid var(--border)', borderRadius: '10px', alignItems: 'start',
            }}>
              <code style={{ fontSize: '0.6875rem', color: 'var(--brand)', fontFamily: 'var(--font-mono)' }}>{expr}</code>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text)' }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Pitfalls */}
      <div className="zone">
        <Callout type="warn" title="Common pitfalls">
          <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.8 }}>
            <li>Using server-side <code>fields</code> with the standard TomTom Maps API — it's only supported on Orbis Maps endpoints.</li>
            <li>Numeric literals in filter expressions must be wrapped in backticks: <code>{`dist < \`1000\``}</code>, not <code>dist &lt; 1000</code>.</li>
            <li>Projecting a missing field returns <code>null</code> — always check for null in projected results.</li>
            <li>Requesting only a subset of fields server-side and then trying to access other fields client-side — the missing fields won't be in the response.</li>
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
          <button className="page-action-btn" onClick={() => onNavigate?.('ev-guide-connectors', 'ev-charging-api')}>
            Guide: Connector filtering
          </button>
        </div>
      </div>
    </div>
  );
}
