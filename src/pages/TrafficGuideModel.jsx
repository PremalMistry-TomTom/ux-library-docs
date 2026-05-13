import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const codeStyle = {
  background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 12,
  padding: '16px 20px', fontSize: '0.8125rem', lineHeight: 1.7,
  overflowX: 'auto', color: 'var(--black)', fontFamily: 'var(--font-mono)',
  margin: 0,
};

const CODE_GET_MODEL_ID = `# Option 1: Get the current Traffic Model ID from Incident Viewport
curl "https://api.tomtom.com/traffic/services/4/incidentViewport.json\\
  ?key=YOUR_API_KEY\\
  &boundingCoordinates=4.84239,52.41072,4.9239,52.51072\\
  &overview=false"

# The response includes: "modelId": "1111"`;

const CODE_HEADER = `# Option 2: Extract Traffic Model ID from response headers
# Make any incident tile request WITHOUT a t= parameter
curl -I "https://api.tomtom.com/traffic/services/4/incidentTile/s1/10/527/340.png\\
  ?key=YOUR_API_KEY"

# Response headers include:
# Traffic-Model-Id: 1111`;

const CODE_USE_MODEL_ID = `# Use the SAME t= value on ALL related calls
TRAFFIC_MODEL_ID=1111

# Incident tile with model ID
curl "https://api.tomtom.com/traffic/services/4/incidentTile/s1/10/527/340.png\\
  ?key=YOUR_API_KEY&t=\${TRAFFIC_MODEL_ID}"

# Incident details with model ID
curl "https://api.tomtom.com/traffic/services/5/incidentDetails\\
  ?key=YOUR_API_KEY\\
  &bbox=4.84239,52.41072,4.9239,52.51072\\
  &t=\${TRAFFIC_MODEL_ID}"`;

const CODE_REFRESH = `// Refresh strategy: get a new model ID every 60 seconds
let trafficModelId = null;

async function refreshModelId() {
  const res = await fetch(
    'https://api.tomtom.com/traffic/services/4/incidentTile/s1/10/527/340.png' +
    '?key=YOUR_API_KEY',
    { method: 'HEAD' }
  );
  trafficModelId = res.headers.get('Traffic-Model-Id');
}

// Refresh on load and every 60 seconds
refreshModelId();
setInterval(refreshModelId, 60_000);`;

export default function TrafficGuideModel({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Guide: Traffic Model ID</h1>
        <PageActions pageId="traffic-guide-model" pageTitle="Guide: Traffic Model ID" />
      </div>
      <p className="quick-answer">
        The Traffic Model ID synchronises data across multiple Traffic API calls — without it,
        your flow tiles and incident data may be from different moments in time, causing
        visual inconsistencies.
      </p>

      {/* 1. Overview */}
      <div className="zone">
        <h2 className="sh" id="overview">What you'll learn</h2>
        <ul style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
          <li>Why the Traffic Model ID matters</li>
          <li>How to obtain the current Traffic Model ID</li>
          <li>How to use it across multiple Traffic API calls</li>
          <li>How to keep it fresh with a refresh strategy</li>
        </ul>
      </div>

      {/* 2. Why it matters */}
      <div className="zone">
        <h2 className="sh" id="why">Why the Traffic Model ID matters</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          Traffic data is updated every minute. If you load flow tiles and incident details in
          separate requests, the data update may occur <em>between</em> those two calls — so
          your tiles and incident list reflect different moments in time.
        </p>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          The Traffic Model ID is a reference value that pins all your calls to the same
          snapshot of traffic data:
        </p>
        <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: '1fr 1fr' }}>
          {[
            {
              title: 'Without Traffic Model ID',
              problem: true,
              items: ['Tile 1 loaded at t=0 (model 1110)', 'Data update at t=0.5', 'Incident details loaded at t=1 (model 1111)', 'Tiles show data from model 1110, incidents from 1111 — mismatch'],
            },
            {
              title: 'With Traffic Model ID',
              problem: false,
              items: ['Obtain current model ID: 1111', 'Tile 1 requested with t=1111', 'Incident details requested with t=1111', 'Both use the same data snapshot — consistent'],
            },
          ].map(b => (
            <div key={b.title} style={{
              padding: '1rem', background: 'var(--s1)',
              border: `1px solid ${b.problem ? 'var(--danger-border)' : 'var(--success-border)'}`,
              borderRadius: 12,
            }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--black)', marginBottom: '0.5rem' }}>{b.title}</div>
              <ul style={{ fontSize: '0.8125rem', color: 'var(--mid)', lineHeight: 1.7, paddingLeft: '1.125rem', margin: 0 }}>
                {b.items.map(i => <li key={i}>{i}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Key facts */}
      <div className="zone">
        <h2 className="sh" id="key-facts">Key facts</h2>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {[
            { fact: 'Updated every minute', desc: 'A new Traffic Model ID is generated every minute as traffic data refreshes.' },
            { fact: 'Valid for 2 minutes', desc: 'Once obtained, a Traffic Model ID is valid for 2 minutes before it times out.' },
            { fact: 'Shared across endpoints', desc: 'At any moment, all Traffic API endpoints share the same set of valid Traffic Model IDs.' },
            { fact: 'Optional parameter', desc: 'Requests without t= use the latest model — but can\'t be coordinated with other calls.' },
          ].map(({ fact, desc }) => (
            <div key={fact} style={{
              display: 'grid', gridTemplateColumns: '200px 1fr', gap: '0.75rem',
              padding: '0.625rem 0.875rem', background: 'var(--s1)',
              border: '1px solid var(--border)', borderRadius: '10px', alignItems: 'start',
            }}>
              <span style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--black)' }}>{fact}</span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--mid)' }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Getting the model ID */}
      <div className="zone">
        <h2 className="sh" id="get-model-id">Obtaining the Traffic Model ID</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          There are four ways to get the current Traffic Model ID. The most efficient is
          a HEAD request to any incident tile:
        </p>
        <pre style={codeStyle}>{CODE_GET_MODEL_ID}</pre>
        <p style={{ fontSize: '0.8125rem', color: 'var(--mid)', marginTop: '1rem', marginBottom: '0.5rem' }}>
          Or extract it from the response headers of any tile request:
        </p>
        <pre style={codeStyle}>{CODE_HEADER}</pre>
      </div>

      {/* 5. Using it */}
      <div className="zone">
        <h2 className="sh" id="using">Using the Traffic Model ID</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          Pass the same <code>t=</code> value to every Traffic API call that should display
          data from the same moment:
        </p>
        <pre style={codeStyle}>{CODE_USE_MODEL_ID}</pre>
      </div>

      {/* 6. Refresh strategy */}
      <div className="zone">
        <h2 className="sh" id="refresh">Refresh strategy</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          For live traffic applications, refresh the Traffic Model ID every 60 seconds and
          re-request all traffic layers with the new ID:
        </p>
        <pre style={codeStyle}>{CODE_REFRESH}</pre>
        <Callout type="warn">
          Do not cache a Traffic Model ID for longer than 2 minutes. An expired ID will cause
          the API to return a 400 error. Always obtain a fresh ID before a batch of related requests.
        </Callout>
      </div>

      {/* 7. Next steps */}
      <div className="zone">
        <h2 className="sh" id="next-steps">Next steps</h2>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="page-action-btn" onClick={() => onNavigate?.('traffic-model-id', 'traffic-api')}>
            Traffic Model ID reference
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('traffic-incident-details', 'traffic-api')}>
            Incident Details
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('traffic-guide-tiles', 'traffic-api')}>
            Guide: Traffic tiles
          </button>
        </div>
      </div>
    </div>
  );
}
