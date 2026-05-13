import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const codeStyle = {
  background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 12,
  padding: '16px 20px', fontSize: '0.8125rem', lineHeight: 1.7,
  overflowX: 'auto', color: 'var(--black)', fontFamily: 'var(--font-mono)',
  margin: 0,
};

const CODE_FLOW_SEGMENT = `# Get current speed for the road closest to a coordinate
curl "https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json\\
  ?key=YOUR_API_KEY\\
  &point=52.41072,4.84239"`;

const CODE_RELATIVE = `# Relative style — how much slower than free-flow?
curl "https://api.tomtom.com/traffic/services/4/flowSegmentData/relative/10/json\\
  ?key=YOUR_API_KEY\\
  &point=52.41072,4.84239"`;

const CODE_RESPONSE = `{
  "flowSegmentData": {
    "frc": "FRC3",
    "currentSpeed": 47,
    "freeFlowSpeed": 60,
    "currentTravelTime": 36,
    "freeFlowTravelTime": 27,
    "confidence": 0.9,
    "roadClosure": false,
    "coordinates": {
      "coordinate": [
        { "latitude": 52.40906, "longitude": 4.84354 },
        { "latitude": 52.41174, "longitude": 4.84239 }
      ]
    }
  }
}`;

const CODE_MAP_CLICK = `// Show live speed when user clicks a road on the map
map.on('click', async (e) => {
  const { lat, lng } = e.latlng;
  const res = await fetch(
    \`https://api.tomtom.com/traffic/services/4/flowSegmentData/relative0/\${map.getZoom()}/json\` +
    \`?key=\${API_KEY}&point=\${lat},\${lng}\`
  );
  const data = await res.json();
  const seg = data.flowSegmentData;

  const popup = L.popup()
    .setLatLng(e.latlng)
    .setContent(\`
      <strong>Current speed:</strong> \${seg.currentSpeed} km/h<br>
      <strong>Free-flow speed:</strong> \${seg.freeFlowSpeed} km/h<br>
      <strong>Delay:</strong> \${seg.currentTravelTime - seg.freeFlowTravelTime}s extra
    \`);
  popup.openOn(map);
});`;

export default function TrafficGuideFlow({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Guide: Traffic Flow Data</h1>
        <PageActions pageId="traffic-guide-flow" pageTitle="Guide: Traffic Flow Data" />
      </div>
      <p className="quick-answer">
        Learn how to query real-time road speeds using the Flow Segment Data endpoint —
        understand the data fields, style modes, and how to wire it to a map click event.
      </p>

      {/* 1. Overview */}
      <div className="zone">
        <h2 className="sh" id="overview">What you'll learn</h2>
        <ul style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
          <li>How Flow Segment Data works and what it returns</li>
          <li>Absolute vs. relative style modes</li>
          <li>Reading the key response fields</li>
          <li>Building a clickable speed popup on a map</li>
          <li>Functional Road Class (FRC) values</li>
        </ul>
      </div>

      {/* 2. How it works */}
      <div className="zone">
        <h2 className="sh" id="how-it-works">How Flow Segment Data works</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          The Flow Segment Data endpoint takes a geographic coordinate and returns speed data
          for the road segment closest to that point. It is designed to work alongside the
          Flow Tile API — use tiles for visual display and Flow Segment Data for clickable
          detail popups:
        </p>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {[
            { field: 'currentSpeed', desc: 'Current observed speed on the segment in km/h or mph (set unit=mph for mph).' },
            { field: 'freeFlowSpeed', desc: 'The speed on this road at free-flow conditions (no congestion).' },
            { field: 'currentTravelTime', desc: 'Estimated travel time for the segment at current speed, in seconds.' },
            { field: 'freeFlowTravelTime', desc: 'Estimated travel time at free-flow speed. Difference from currentTravelTime = delay.' },
            { field: 'confidence', desc: 'Data quality indicator from 0 to 1. 0.9+ is high quality; below 0.5 may be estimated.' },
            { field: 'roadClosure', desc: 'true if the segment is currently closed to traffic.' },
            { field: 'frc', desc: 'Functional Road Class. FRC0 = motorway; FRC7 = local road.' },
            { field: 'coordinates', desc: 'The geometry of the matched road segment as an array of lat/lon coordinate pairs.' },
          ].map(({ field, desc }) => (
            <div key={field} style={{
              display: 'grid', gridTemplateColumns: '200px 1fr', gap: '0.75rem',
              padding: '0.5rem 0.875rem', background: 'var(--s1)',
              border: '1px solid var(--border)', borderRadius: '10px', alignItems: 'start',
            }}>
              <code style={{ fontSize: '0.75rem', color: 'var(--brand)', fontFamily: 'var(--font-mono)' }}>{field}</code>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text)' }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Absolute style */}
      <div className="zone">
        <h2 className="sh" id="absolute">Absolute style</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          Use <code>style=absolute</code> to get raw km/h (or mph with <code>unit=mph</code>)
          values. Best for applications that display actual speed numbers:
        </p>
        <pre style={codeStyle}>{CODE_FLOW_SEGMENT}</pre>
        <p style={{ fontSize: '0.8125rem', color: 'var(--mid)', marginTop: '1rem', marginBottom: '0.5rem' }}>
          Sample response:
        </p>
        <pre style={codeStyle}>{CODE_RESPONSE}</pre>
      </div>

      {/* 4. Relative style */}
      <div className="zone">
        <h2 className="sh" id="relative">Relative style</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          Use <code>style=relative</code> or <code>style=relative0</code> to express speed
          as a ratio of free-flow. This is the same data shown in the coloured tile overlays
          and is ideal for displaying congestion severity rather than raw speed:
        </p>
        <pre style={codeStyle}>{CODE_RELATIVE}</pre>
        <Callout type="info">
          <code>relative</code> omits values at 100% free-flow (no delay). <code>relative0</code>
          includes 100% data. Use <code>relative0</code> when you want to confirm a road is
          fully clear, not just "not congested."
        </Callout>
      </div>

      {/* 5. FRC values */}
      <div className="zone">
        <h2 className="sh" id="frc">Functional Road Class (FRC)</h2>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {[
            { frc: 'FRC0', name: 'Motorway / Freeway', desc: 'Major motorways, interstate highways.' },
            { frc: 'FRC1', name: 'Major Road', desc: 'Important inter-urban roads.' },
            { frc: 'FRC2', name: 'Other Major Road', desc: 'Major roads, not motorway.' },
            { frc: 'FRC3', name: 'Secondary Road', desc: 'Secondary roads.' },
            { frc: 'FRC4', name: 'Local Connecting Road', desc: 'Roads connecting local areas.' },
            { frc: 'FRC5', name: 'Local Road', desc: 'Road of local importance.' },
            { frc: 'FRC6', name: 'Local Road', desc: 'Minor local road.' },
            { frc: 'FRC7', name: 'Local Road', desc: 'Small road or path.' },
          ].map(({ frc, name, desc }) => (
            <div key={frc} style={{
              display: 'grid', gridTemplateColumns: '60px 180px 1fr', gap: '0.75rem',
              padding: '0.5rem 0.875rem', background: 'var(--s1)',
              border: '1px solid var(--border)', borderRadius: '10px', alignItems: 'center',
            }}>
              <code style={{ fontSize: '0.75rem', color: 'var(--brand)', fontFamily: 'var(--font-mono)' }}>{frc}</code>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--black)' }}>{name}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--mid)' }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Map click integration */}
      <div className="zone">
        <h2 className="sh" id="map-click">Map click integration</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
          The Flow Segment Data endpoint is designed to be called when a user clicks on a
          road segment in a flow tile overlay. Use the map's zoom level as the <code>zoom</code>
          path parameter:
        </p>
        <pre style={codeStyle}>{CODE_MAP_CLICK}</pre>
      </div>

      {/* 7. Pitfalls */}
      <div className="zone">
        <Callout type="warn" title="Common pitfalls">
          <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.8 }}>
            <li>Clicking on an area with no road data returns an error — always handle empty or error responses.</li>
            <li>Using zoom=0 — low zoom levels aggregate too broadly; use the actual map zoom level for accurate segment data.</li>
            <li>Confusing <code>currentSpeed</code> with <code>freeFlowSpeed</code> — delay = currentTravelTime minus freeFlowTravelTime.</li>
            <li>Ignoring <code>confidence</code> below 0.5 — low-confidence data may be estimated and unreliable.</li>
          </ul>
        </Callout>
      </div>

      {/* 8. Next steps */}
      <div className="zone">
        <h2 className="sh" id="next-steps">Next steps</h2>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="page-action-btn" onClick={() => onNavigate?.('traffic-flow-segment', 'traffic-api')}>
            Flow Segment Data reference
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('traffic-guide-tiles', 'traffic-api')}>
            Guide: Traffic tiles
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('traffic-guide-model', 'traffic-api')}>
            Guide: Traffic Model ID
          </button>
        </div>
      </div>
    </div>
  );
}
