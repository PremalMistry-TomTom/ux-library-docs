import PageActions from '../components/ui/PageActions';
import { useIlloStyle } from '../context/IlloStyleContext';
import {
  makeThumb,
  L_TrafficFlow, L_TrafficIncidents, L_TrafficFlowTile, L_TrafficModelID,
} from '../illustrations/lightVariants';
import {
  IlloTrafficFlow, IlloTrafficIncidents, IlloTrafficFlowTile, IlloTrafficModelID,
} from './IntroIllustrations';

/* ─── Hero ───────────────────────────────────────────────────────────────────── */
const HeroIllo = makeThumb(IlloTrafficFlow, L_TrafficFlow);

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function TrafficAPIIntro({ onNavigate }) {
  const { theme: illoTheme, palette: illoPalette } = useIlloStyle();

  const endpoints = [
    {
      Thumb: makeThumb(IlloTrafficFlow, L_TrafficFlow),
      method: 'GET',
      title: 'Flow Segment Data',
      desc: 'Retrieve real-time traffic flow for a road segment — current speed, free-flow speed, and confidence level.',
      pageId: 'traffic-api-intro',
      tag: 'v4',
    },
    {
      Thumb: makeThumb(IlloTrafficIncidents, L_TrafficIncidents),
      method: 'GET',
      title: 'Incident Details',
      desc: 'Get traffic incidents — accidents, road works, closures — with location, delay type, and severity within a bounding box.',
      pageId: 'traffic-api-intro',
      tag: 'v5',
    },
    {
      Thumb: makeThumb(IlloTrafficFlowTile, L_TrafficFlowTile),
      method: 'GET',
      title: 'Raster Flow Tiles',
      desc: 'PNG map tiles colour-coded by current traffic speed for overlay on raster maps. Supports 22 zoom levels.',
      pageId: 'traffic-api-intro',
      tag: 'v4',
    },
    {
      Thumb: makeThumb(IlloTrafficFlowTile, L_TrafficFlowTile),
      method: 'GET',
      title: 'Vector Flow Tiles',
      desc: 'Protocol Buffer vector tiles carrying traffic speed and flow data for client-side styled overlays.',
      pageId: 'traffic-api-intro',
      tag: 'v4',
    },
    {
      Thumb: makeThumb(IlloTrafficIncidents, L_TrafficIncidents),
      method: 'GET',
      title: 'Raster Incident Tiles',
      desc: 'Raster tiles showing traffic incident pins and severity overlays for quick visual integration.',
      pageId: 'traffic-api-intro',
      tag: 'v5',
    },
    {
      Thumb: makeThumb(IlloTrafficIncidents, L_TrafficIncidents),
      method: 'GET',
      title: 'Incident Viewport',
      desc: 'Return incidents within a viewport bounding box — optimised for map-aligned incident data fetching.',
      pageId: 'traffic-api-intro',
      tag: 'v5',
    },
    {
      Thumb: makeThumb(IlloTrafficModelID, L_TrafficModelID),
      method: 'GET',
      title: 'Traffic Model ID',
      desc: 'Return the latest traffic data model identifier — use for cache invalidation when tiles are refreshed.',
      pageId: 'traffic-api-intro',
      tag: 'v4',
    },
  ];

  const baseUrlRows = [
    {
      label: 'Base URL',
      content: <code style={{ fontSize: '0.875rem', fontFamily: 'monospace', color: 'var(--black)' }}>https://api.tomtom.com/traffic/</code>,
    },
    {
      label: 'Auth',
      content: <span style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>API key via <code>?key={'{'}<em>your-api-key</em>{'}'}</code> query parameter</span>,
    },
    {
      label: 'Versions',
      content: <span style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>Flow endpoints use <strong>v4</strong>; Incident endpoints use <strong>v5</strong></span>,
    },
    {
      label: 'Refresh',
      content: <span style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>Data updated approximately every <strong>1 minute</strong>; tile CDN cache typically 30–60 s</span>,
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Traffic API</h1>
        <PageActions />
      </div>

      <p className="quick-answer">
        The TomTom Traffic API delivers real-time traffic flow and incident data to power live traffic
        overlays, route avoidance, and ETA accuracy in your application. It provides per-segment speed
        data, incident details, and map tiles updated every minute.
      </p>

      {/* Hero illustration */}
      <div style={{ borderRadius: 20, overflow: 'hidden', height: 200, background: illoPalette.bg, marginBottom: 32 }}>
        <HeroIllo />
      </div>

      {/* Endpoint grid */}
      <div className="zone">
        <h2 className="sh" id="endpoints">Endpoints</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--mid)', margin: '0 0 20px', lineHeight: 1.6 }}>
          Flow endpoints are versioned at <code>/traffic/services/4/</code>; incident endpoints at <code>/traffic/services/5/</code>; tiles at <code>/traffic/map/4/</code>.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
          {endpoints.map(({ Thumb, method, title, desc, pageId, tag }) => (
            <div
              key={title}
              className="nav-card"
              onClick={() => onNavigate?.(pageId)}
            >
              <div className="nav-card-thumb" style={illoTheme !== 'dark' ? { background: illoPalette.bg, padding: 0 } : undefined}>
                <Thumb />
              </div>
              <div className="nav-card-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <span className={`http-tag http-tag-${method.toLowerCase()}`}>{method}</span>
                  {tag && <span className="meta-tag">{tag}</span>}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--black)', marginBottom: 3 }}>{title}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.5 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Base URL table */}
      <div className="zone">
        <h2 className="sh" id="base-url">Base URL &amp; Authentication</h2>
        <div style={{ border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
          {baseUrlRows.map(({ label, content }, i) => (
            <div key={label} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', borderBottom: i < baseUrlRows.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ padding: '10px 14px', background: 'var(--bg)', borderRight: '1px solid var(--border)', fontSize: '0.625rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center' }}>{label}</div>
              <div style={{ padding: '10px 14px' }}>{content}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Getting started */}
      <div className="zone">
        <h2 className="sh" id="getting-started">Getting started</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--mid)', marginBottom: 16, lineHeight: 1.6 }}>
          Fetch real-time flow data for a road segment near a known coordinate:
        </p>
        <pre style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', fontSize: '0.8125rem', lineHeight: 1.7, overflowX: 'auto', color: 'var(--black)' }}>{`const API_KEY = 'your-api-key';
const lat = 52.3731;
const lon = 4.8922;

// Flow Segment Data — current vs free-flow speed
const flowRes = await fetch(
  \`https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json\` +
  \`?key=\${API_KEY}&point=\${lat},\${lon}\`
);
const { flowSegmentData } = await flowRes.json();
const { currentSpeed, freeFlowSpeed, confidence } = flowSegmentData;
console.log(\`\${currentSpeed} km/h (free-flow: \${freeFlowSpeed}, confidence: \${confidence})\`);

// Raster flow tile URL for a map overlay (zoom 12, tile 2094,1362)
const tileUrl =
  \`https://api.tomtom.com/traffic/map/4/tile/flow/relative/12/2094/1362.png?key=\${API_KEY}\`;`}</pre>
      </div>
    </div>
  );
}
