import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import { useIlloStyle } from '../context/IlloStyleContext';
import {
  makeThumb,
  L_TrafficFlow, L_TrafficIncidents, L_TrafficFlowTile, L_TrafficModelID,
} from '../illustrations/lightVariants';

/* ─── Shared helpers ─────────────────────────────────────────────────────────── */
function MethodBadge({ method }) {
  const colors = { GET: '#3fb950', POST: '#58a6ff', DELETE: '#f85149' };
  return (
    <span style={{ fontSize: '0.625rem', fontWeight: 700, padding: '2px 6px', borderRadius: 3, background: `${colors[method]}22`, color: colors[method], fontFamily: 'var(--font-mono, monospace)', letterSpacing: '0.04em' }}>
      {method}
    </span>
  );
}

function EndpointCard({ Illo, title, method = 'GET', path, desc }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', background: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 140, flexShrink: 0, overflow: 'hidden' }}>
        <Illo />
      </div>
      <div style={{ padding: '10px 14px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <MethodBadge method={method} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)' }}>{title}</span>
        </div>
        {path && <code style={{ fontSize: '0.5625rem', color: 'var(--muted)', fontFamily: 'var(--font-mono, monospace)', wordBreak: 'break-all' }}>{path}</code>}
        {desc && <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.55 }}>{desc}</p>}
      </div>
    </div>
  );
}

/* ─── Thumbs ─────────────────────────────────────────────────────────────────── */
function ThumbFlow() { return <L_TrafficFlow />; }
function ThumbIncidents() { return <L_TrafficIncidents />; }
function ThumbFlowTile() { return <L_TrafficFlowTile />; }
function ThumbModelID() { return <L_TrafficModelID />; }

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function TrafficAPIIntro({ onNavigate }) {
  const { palette } = useIlloStyle();

  const endpoints = [
    {
      Illo: makeThumb(ThumbFlow, L_TrafficFlow),
      title: 'Traffic Flow',
      method: 'GET',
      path: '/traffic/services/4/flowSegmentData/{style}/{zoom}/json',
      desc: 'Retrieve real-time traffic flow data for a road segment, including current and free-flow speeds.',
    },
    {
      Illo: makeThumb(ThumbIncidents, L_TrafficIncidents),
      title: 'Traffic Incidents',
      method: 'GET',
      path: '/traffic/services/5/incidentDetails',
      desc: 'Get detailed traffic incidents — accidents, road works, closures — within a bounding box.',
    },
    {
      Illo: makeThumb(ThumbFlowTile, L_TrafficFlowTile),
      title: 'Flow Tiles',
      method: 'GET',
      path: '/traffic/map/4/tile/flow/{style}/{zoom}/{x}/{y}.png',
      desc: 'Raster or vector map tiles colour-coded by current traffic flow speed for overlay on maps.',
    },
    {
      Illo: makeThumb(ThumbModelID, L_TrafficModelID),
      title: 'Traffic Model ID',
      method: 'GET',
      path: '/traffic/services/4/trafficModelID.json',
      desc: 'Return the identifier of the latest traffic data model, used for cache invalidation.',
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
      <div style={{ borderRadius: 20, overflow: 'hidden', height: 200, background: palette.bg, marginBottom: 32 }}>
        <L_TrafficFlow />
      </div>

      {/* Endpoint grid */}
      <div className="zone">
        <h2 className="sh" id="endpoints">Endpoints</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {endpoints.map(ep => (
            <EndpointCard key={ep.title} {...ep} />
          ))}
        </div>
      </div>

      {/* Base URL */}
      <div className="zone">
        <h2 className="sh" id="base-url">Base URL</h2>
        <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, color: 'var(--black)' }}>
          GET https://api.tomtom.com/traffic/services/4/flowSegmentData/{'{'}style{'}'}/{'{'}zoom{'}'}/json?key={'{'}your-api-key{'}'}
        </div>
      </div>

      <Callout type="info" title="Authentication">
        All requests require a valid API key passed as <code>key={'{'}your-api-key{'}'}</code> in the query string.
        You can obtain a key from the <a href="https://developer.tomtom.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--red)' }}>TomTom Developer Portal</a>.
      </Callout>
    </div>
  );
}
