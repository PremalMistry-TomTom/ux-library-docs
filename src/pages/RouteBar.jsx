import Callout from '../components/ui/Callout';
import PageActions from '../components/ui/PageActions';
import { ApiLinks } from '../components/ui/ApiLinks';
import { useDemoStyle } from '../hooks/useDemoStyle';

const ROUTE_BAR_APIS = [
  { name: 'Turn-by-Turn Navigation',   type: 'Android SDK', description: 'Provides real-time route progress data — incidents, cameras, and remaining distance — that populates the route bar.',   pageId: 'navsdk-nav-turn-by-turn',  productId: 'navsdk' },
  { name: 'Continuous Replanning',     type: 'Android SDK', description: 'Route bar content updates automatically when the route is recalculated due to traffic or diversions.',                   pageId: 'navsdk-nav-replanning',    productId: 'navsdk' },
  { name: 'Horizon — Traffic',         type: 'Android SDK', description: 'Virtual horizon traffic events shown as ahead-of-time markers in the route bar before the vehicle reaches them.',         pageId: 'navsdk-horizon-traffic',   productId: 'navsdk' },
  { name: 'ETA Panel',                 type: 'Android SDK', description: 'ETA Panel is the companion component that shows remaining time and distance in sync with the route bar.',                 pageId: 'eta-panel',                productId: 'ux-library' },
];

/* ─── Positioning diagram ───────────────────────────────────── */
const LAYOUT_MODES = [
  {
    id: 'free',
    label: 'Free drive',
    desc: 'Route bar hidden. No active navigation.',
    showBar: false,
    showNip: false,
    showEta: false,
  },
  {
    id: 'guided',
    label: 'Guided drive',
    desc: 'Bar occupies full screen height on the right edge.',
    showBar: true,
    showNip: true,
    showEta: true,
  },
  {
    id: 'landscape',
    label: 'Landscape',
    desc: 'Bar always positioned at the right, full screen height.',
    showBar: true,
    showNip: false,
    showEta: true,
    wide: true,
  },
];

function PhoneFrame({ wide, children }) {
  const M = useDemoStyle();
  const w = wide ? 160 : 90;
  const h = wide ? 90 : 160;
  return (
    <div style={{
      width: w, height: h, borderRadius: wide ? 8 : 12,
      border: `2px solid ${M.line}`,
      background: `linear-gradient(135deg, ${M.card}, ${M.dark})`,
      position: 'relative', overflow: 'hidden', flexShrink: 0,
    }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox={`0 0 ${w} ${h}`} fill="none">
        <path d={wide ? 'M0 55 Q60 50 120 52 T160 50' : 'M0 80 Q30 75 60 78 T90 76'}
          stroke="rgba(255,255,255,0.15)" strokeWidth="3" strokeLinecap="round"/>
        <path d={wide ? 'M70 0 Q68 45 67 90' : 'M40 0 Q38 80 37 160'}
          stroke="rgba(255,255,255,0.10)" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      {children}
    </div>
  );
}

function RouteBarMock({ wide }) {
  const M = useDemoStyle();
  const w = wide ? 160 : 90;
  const h = wide ? 90 : 160;
  const barW = 14;
  const barX = w - barW - 2;
  const events = wide
    ? [{ y: 20 }, { y: 42 }, { y: 65 }]
    : [{ y: 35 }, { y: 75 }, { y: 115 }];
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox={`0 0 ${w} ${h}`} fill="none">
      <rect x={barX} y="4" width={barW} height={h - 8} rx="4" fill={`${M.dark}8c`} stroke={`${M.line}40`} strokeWidth="0.5"/>
      <line x1={barX + barW / 2} y1={h - 10} x2={barX + barW / 2} y2="10"
        stroke={`${M.muted}4d`} strokeWidth="1.5" strokeLinecap="round"/>
      <polygon points={`${barX + 2},${h - 12} ${barX + barW - 2},${h - 12} ${barX + barW / 2},${h - 18}`}
        fill="#e2001a" opacity="0.9"/>
      {events.map((e, i) => (
        <circle key={i} cx={barX + barW / 2} cy={e.y} r="3.5"
          fill={i === 0 ? M.red : i === 1 ? M.amber : M.blue} opacity="0.9"/>
      ))}
      <circle cx={barX + barW / 2} cy="8" r="3" fill={M.green} opacity="0.9"/>
    </svg>
  );
}

export function PositioningDiagram() {
  const M = useDemoStyle();
  return (
    <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', margin: '24px 0' }}>
      {LAYOUT_MODES.map(mode => (
        <div key={mode.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <PhoneFrame wide={mode.wide}>
            {mode.showBar && <RouteBarMock wide={mode.wide} />}
            {mode.showNip && (
              <div style={{
                position: 'absolute', top: 6, left: 6, right: 20,
                background: 'rgba(0,0,0,0.7)', borderRadius: 5, padding: '4px 6px',
                fontSize: 7, color: M.white, fontWeight: 600,
              }}>↑ 800 ft</div>
            )}
            {mode.showEta && (
              <div style={{
                position: 'absolute', bottom: 6, left: 6,
                background: 'rgba(0,0,0,0.7)', borderRadius: 4, padding: '3px 5px',
                fontSize: 6, color: M.dim,
              }}>5:53 · 4.0 mi</div>
            )}
          </PhoneFrame>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--text)' }}>{mode.label}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', maxWidth: 110, marginTop: 3, lineHeight: 1.4 }}>{mode.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export default function RouteBar({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Route Bar</h1>
        <PageActions />
      </div>

      <div className="quick-answer">
        A vertical progress bar showing upcoming traffic, cameras, and hazards at their proportional positions along the active route. Planned — not yet available.
      </div>

      <ApiLinks items={ROUTE_BAR_APIS} onNavigate={onNavigate} />

      <div className="zone">
        <h2 className="sh" id="rb-overview">Overview</h2>
        <Callout type="warn">
          The Route Bar is a <strong>planned component</strong> not yet available in UX Library.
          This page documents the intended behaviour and API surface based on the PRD. Design is
          being refined in collaboration with the VW group UX vision.
        </Callout>
        <p className="body" style={{ marginTop: 16 }}>
          The Route Bar provides a spatial representation of the journey ahead, placing upcoming
          events at their approximate position along the route. Unlike the Horizon Panel — which
          shows only the next instruction — the Route Bar gives a "route at a glance" overview
          that helps drivers anticipate traffic, plan rest stops, and track progress toward waypoints.
        </p>
        <p className="body">
          The planned data API will expose route events as a stream so OEMs can build a fully
          custom Route Bar if the default UX Library component does not satisfy their requirements.
        </p>
      </div>

      <div className="zone">
        <h2 className="sh" id="rb-position">Positioning</h2>
        <p className="body">
          The Route Bar is anchored to the right edge of the screen and occupies the full
          available screen height during active navigation. It is hidden in free-drive mode
          and automatically shown when a route is active. In landscape orientation, it
          remains on the right side using the full vertical height.
        </p>
        <PositioningDiagram />
      </div>

      <div className="zone">
        <h2 className="sh" id="rb-requirements">Requirements</h2>
        <table className="prop-table">
          <thead><tr><th>Requirement</th><th>Priority</th><th>Notes</th></tr></thead>
          <tbody>
            {[
              ['Introduce route bar as a UI component',        'P1', 'Very popular market request; part of VW group UX vision'],
              ['Show on right edge, full height during nav',   'P1', 'Hidden in free-drive; auto-shown when route is active'],
              ['All 6 event categories with correct icons',    'P1', 'Hazards, cameras, traffic, route info, POI, better route'],
              ['Continuous segment events (jams, speed zones)','P1', 'Tube overlay on the bar segment, not just an icon'],
              ['Default event filter set',                     'P1', '2 cameras, next traffic, all tubes, 2 POI, stops, destination'],
              ['Configurable event filters',                   'P2', 'Integrator can override which event types are shown'],
              ['Stacking & z-index handling',                  'P1', 'Closest event in front; cascade when threshold exceeded'],
              ['Configurable stacking threshold (50% default)','P2', 'Adjustable via development/API settings'],
              ['Theme the route bar',                          'P1', 'Follow standard UX Library token tier structure'],
              ['Expose route event data API',                  'P?', 'Technical discovery required; enables fully custom route bar UIs'],
            ].map(([req, pri, notes]) => (
              <tr key={req}>
                <td style={{ fontWeight: 500 }}>{req}</td>
                <td>
                  <span style={{
                    fontSize: '0.875rem', fontWeight: 700, padding: '2px 6px', borderRadius: 3,
                    background: pri === 'P1' ? '#fff5f5' : 'var(--bg)',
                    color: pri === 'P1' ? 'var(--red)' : 'var(--muted)',
                    border: `1px solid ${pri === 'P1' ? '#fecaca' : 'var(--border)'}`,
                  }}>{pri}</span>
                </td>
                <td style={{ color: 'var(--mid)', fontSize: '0.875rem' }}>{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
