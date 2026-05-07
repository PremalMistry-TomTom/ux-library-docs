import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import ExampleCard from '../components/ui/ExampleCard';

/* ─── Shared helpers ────────────────────────────────────────────────────────── */
function MethodBadge({ method }) {
  const colors = { GET: '#3fb950', POST: '#58a6ff', DELETE: '#f85149' };
  return (
    <span style={{ fontSize: '0.625rem', fontWeight: 700, padding: '2px 6px', borderRadius: 3, background: `${colors[method]}22`, color: colors[method], fontFamily: 'var(--font-mono, monospace)', letterSpacing: '0.04em' }}>
      {method}
    </span>
  );
}

/* ─── Endpoint thumbnails ───────────────────────────────────────────────────── */
function ThumbCalculateRoute() {
  return (
    <div style={{ background: '#0c1318', borderRadius: 20, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 130" fill="none">
        <rect width="200" height="130" fill="#1a2535"/>
        <path d="M0 70 Q60 58 100 70 T200 63" stroke="#243040" strokeWidth="6"/>
        <path d="M70 0 L68 130" stroke="#243040" strokeWidth="5"/>
        <path d="M140 0 L136 130" stroke="#243040" strokeWidth="5"/>
        <path d="M30 100 Q65 72 100 68 T175 42" stroke="#e2001a" strokeWidth="2.5" strokeLinecap="round" opacity="0.9"/>
        <path d="M30 100 Q65 72 100 68 T175 42" stroke="rgba(226,0,26,0.18)" strokeWidth="9" strokeLinecap="round"/>
        <circle cx="30" cy="100" r="5" fill="#3fb950"/>
        <circle cx="30" cy="100" r="9" fill="rgba(63,185,80,0.2)"/>
        <circle cx="175" cy="42" r="5" fill="#e2001a"/>
        <circle cx="175" cy="42" r="9" fill="rgba(226,0,26,0.2)"/>
      </svg>
      <div style={{ position: 'absolute', bottom: 8, left: 8, right: 8, background: 'rgba(8,14,26,0.9)', borderRadius: 5, padding: '6px 10px', display: 'flex', justifyContent: 'space-around', border: '1px solid rgba(255,255,255,0.07)' }}>
        {[['2h 14m', 'Time'], ['189 km', 'Distance'], ['14:32', 'ETA']].map(([v, l]) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.625rem', fontWeight: 700, color: '#e2e8f0' }}>{v}</div>
            <div style={{ fontSize: '0.5rem', color: '#64748b' }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ThumbReachableRange() {
  return (
    <div style={{ background: '#0c1318', borderRadius: 20, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 130" fill="none">
        <rect width="200" height="130" fill="#1a2535"/>
        <path d="M70 0 L68 130" stroke="#243040" strokeWidth="4" opacity="0.5"/>
        <path d="M130 0 L128 130" stroke="#243040" strokeWidth="4" opacity="0.5"/>
        <path d="M0 65 Q100 60 200 65" stroke="#243040" strokeWidth="4" opacity="0.5"/>
        {/* Isochrone polygon */}
        <path d="M100 30 Q138 28 155 50 Q168 72 155 95 Q138 112 100 115 Q62 112 45 95 Q32 72 45 50 Q62 28 100 30 Z"
          fill="rgba(88,166,255,0.12)" stroke="#58a6ff" strokeWidth="1.5" opacity="0.85"/>
        <path d="M100 48 Q122 46 133 62 Q142 78 133 94 Q122 106 100 108 Q78 106 67 94 Q58 78 67 62 Q78 46 100 48 Z"
          fill="rgba(88,166,255,0.08)" stroke="#58a6ff" strokeWidth="1" opacity="0.6"/>
        <circle cx="100" cy="65" r="5" fill="#e2001a"/>
        <circle cx="100" cy="65" r="10" fill="rgba(226,0,26,0.2)"/>
      </svg>
      <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(8,14,26,0.85)', borderRadius: 4, padding: '4px 8px', border: '1px solid rgba(88,166,255,0.3)' }}>
        <div style={{ fontSize: '0.5rem', color: '#58a6ff', fontWeight: 700 }}>30 min range</div>
        <div style={{ fontSize: '0.5rem', color: '#64748b' }}>~27 km radius</div>
      </div>
    </div>
  );
}

function ThumbEVRoute() {
  return (
    <div style={{ background: '#0c1318', borderRadius: 20, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 130" fill="none">
        <rect width="200" height="130" fill="#1a2535"/>
        <path d="M20 105 Q60 80 90 72 Q110 66 140 58 Q165 50 185 38"
          stroke="#e2001a" strokeWidth="2" strokeLinecap="round" opacity="0.85"/>
        <path d="M20 105 Q60 80 90 72 Q110 66 140 58 Q165 50 185 38"
          stroke="rgba(226,0,26,0.15)" strokeWidth="8" strokeLinecap="round"/>
        {/* Charging stops */}
        {[[90, 72], [140, 58]].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="8" fill="#0d1117" stroke="#22c55e" strokeWidth="1.5"/>
            <text x={cx} y={cy + 3.5} textAnchor="middle" fill="#22c55e" style={{ fontSize: 7, fontWeight: 700 }}>⚡</text>
          </g>
        ))}
        <circle cx="20" cy="105" r="4" fill="#3fb950"/>
        <circle cx="185" cy="38" r="4" fill="#e2001a"/>
      </svg>
      {/* Battery bar */}
      <div style={{ position: 'absolute', bottom: 8, left: 8, right: 8, background: 'rgba(8,14,26,0.9)', borderRadius: 5, padding: '5px 10px', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: '0.5rem', color: '#64748b' }}>Battery</span>
          <span style={{ fontSize: '0.5rem', color: '#22c55e', fontWeight: 700 }}>18% → 78% → 22%</span>
        </div>
        <div style={{ height: 3, background: '#1e293b', borderRadius: 2 }}>
          <div style={{ height: '100%', width: '78%', background: 'linear-gradient(90deg, #22c55e, #3fb950)', borderRadius: 2 }}/>
        </div>
      </div>
    </div>
  );
}

function ThumbBatchRouting() {
  const routes = [
    { from: [20, 35], to: [155, 28], color: '#e2001a', w: 70 },
    { from: [20, 60], to: [155, 52], color: '#58a6ff', w: 88 },
    { from: [20, 85], to: [155, 78], color: '#3fb950', w: 55 },
    { from: [20, 110], to: [155, 102], color: '#a78bfa', w: 95 },
  ];
  return (
    <div style={{ background: '#0d1117', borderRadius: 20, overflow: 'hidden', height: '100%', padding: '8px 10px' }}>
      <div style={{ fontSize: '0.5rem', color: '#64748b', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Batch · 4 routes</div>
      {routes.map((r, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: r.color, flexShrink: 0 }}/>
          <div style={{ flex: 1, height: 3, background: '#1e293b', borderRadius: 2 }}>
            <div style={{ height: '100%', width: `${r.w}%`, background: r.color, borderRadius: 2, opacity: 0.8 }}/>
          </div>
          <span style={{ fontSize: '0.5rem', color: '#475569', fontFamily: 'monospace', width: 28 }}>{r.w} km</span>
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }}/>
        <span style={{ fontSize: '0.5rem', color: '#22c55e' }}>4/4 completed · 340ms</span>
      </div>
    </div>
  );
}

function ThumbMatrix() {
  const SIZE = 4;
  const colors = ['rgba(226,0,26,0.8)', 'rgba(88,166,255,0.8)', 'rgba(63,185,80,0.6)', 'rgba(251,191,36,0.7)'];
  return (
    <div style={{ background: '#0d1117', borderRadius: 20, overflow: 'hidden', height: '100%', padding: '8px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6 }}>
      <div style={{ fontSize: '0.5rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Matrix 4×4 · 16 cells</div>
      {Array.from({ length: SIZE }).map((_, row) => (
        <div key={row} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: colors[row], flexShrink: 0 }}/>
          <div style={{ flex: 1, display: 'flex', gap: 3 }}>
            {Array.from({ length: SIZE }).map((_, col) => {
              const val = ((row * 3 + col * 7) % 90) + 15;
              const intensity = val / 100;
              return (
                <div key={col} style={{ flex: 1, height: 18, borderRadius: 3, background: `rgba(226,0,26,${intensity * 0.7 + 0.1})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>{val}m</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function ThumbWaypointOpt() {
  return (
    <div style={{ background: '#0d1117', borderRadius: 20, overflow: 'hidden', height: '100%', padding: '8px 10px' }}>
      <div style={{ display: 'flex', gap: 6, height: 'calc(100% - 20px)' }}>
        {/* Before */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.5rem', color: '#64748b', marginBottom: 4, textTransform: 'uppercase' }}>Before</div>
          <svg viewBox="0 0 80 90" style={{ width: '100%', height: 'calc(100% - 14px)' }}>
            {[[10,10],[60,30],[15,60],[55,80],[30,45]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="5" fill="#475569"/>
            ))}
            <polyline points="10,10 60,30 15,60 55,80 30,45" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 3"/>
          </svg>
        </div>
        <div style={{ width: 1, background: 'rgba(255,255,255,0.06)', alignSelf: 'stretch' }}/>
        {/* After */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.5rem', color: '#22c55e', marginBottom: 4, textTransform: 'uppercase' }}>Optimized</div>
          <svg viewBox="0 0 80 90" style={{ width: '100%', height: 'calc(100% - 14px)' }}>
            {[[10,10],[30,45],[15,60],[55,80],[60,30]].map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="5" fill="#22c55e" opacity="0.9"/>
                <text x={x} y={y + 3} textAnchor="middle" fill="#000" style={{ fontSize: 5, fontWeight: 700 }}>{i + 1}</text>
              </g>
            ))}
            <polyline points="10,10 30,45 15,60 55,80 60,30" fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.8"/>
          </svg>
        </div>
      </div>
      <div style={{ fontSize: '0.5rem', color: '#22c55e', textAlign: 'center', marginTop: 3 }}>↓ 34% shorter</div>
    </div>
  );
}

function ThumbInstructions() {
  return (
    <div style={{ background: '#0d1117', borderRadius: 20, overflow: 'hidden', height: '100%', padding: '8px 10px' }}>
      {/* Route line with junction point */}
      <svg style={{ width: '100%', height: 70 }} viewBox="0 0 200 70" fill="none">
        <path d="M20 55 Q70 50 100 35 Q130 20 180 18" stroke="#e2001a" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
        <path d="M20 55 Q70 50 100 35 Q130 20 180 18" stroke="rgba(226,0,26,0.15)" strokeWidth="8" strokeLinecap="round"/>
        {/* Junction maneuver point */}
        <circle cx="100" cy="35" r="6" fill="#0d1117" stroke="#58a6ff" strokeWidth="1.5"/>
        {/* Turn arrow */}
        <path d="M100 35 L100 22 M96 26 L100 22 L104 26" stroke="#58a6ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="20" cy="55" r="4" fill="#3fb950"/>
        <circle cx="180" cy="18" r="4" fill="#e2001a"/>
      </svg>
      {/* Instruction card */}
      <div style={{ background: 'rgba(88,166,255,0.08)', border: '1px solid rgba(88,166,255,0.2)', borderRadius: 5, padding: '5px 8px' }}>
        <div style={{ fontSize: '0.5rem', color: '#64748b', marginBottom: 2 }}>TURN_RIGHT · 340 m</div>
        <div style={{ fontSize: '0.5625rem', color: '#e2e8f0', lineHeight: 1.3 }}>Turn right onto <span style={{ color: '#58a6ff' }}>Spreeufer</span></div>
      </div>
      <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
        {['coded', 'text', 'tagged'].map(t => (
          <span key={t} style={{ fontSize: '0.4375rem', padding: '1px 5px', borderRadius: 3, background: 'rgba(255,255,255,0.06)', color: '#475569', fontFamily: 'monospace' }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function ThumbRoadShields() {
  const shields = [
    { cat: 2, ref: 'A10',  color: '#1d4ed8', x: 30  },
    { cat: 1, ref: 'E35',  color: '#22c55e', x: 82  },
    { cat: 3, ref: 'N7',   color: '#e2001a', x: 134 },
    { cat: 4, ref: 'B14',  color: '#f59e0b', x: 30  },
  ];
  return (
    <div style={{ background: '#0d1117', borderRadius: 20, overflow: 'hidden', height: '100%', padding: '8px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ fontSize: '0.5rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Road shields · iconCategory</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
        {shields.map(({ cat, ref, color }) => (
          <div key={ref} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <div style={{ width: 34, height: 22, borderRadius: 4, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid rgba(255,255,255,0.15)' }}>
              <span style={{ fontSize: '0.5625rem', fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>{ref}</span>
            </div>
            <span style={{ fontSize: '0.4375rem', color: '#475569', fontFamily: 'monospace' }}>cat {cat}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 8, padding: '4px 7px', background: 'rgba(255,255,255,0.04)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.07)' }}>
        <span style={{ fontSize: '0.4375rem', color: '#64748b', fontFamily: 'monospace' }}>Take the </span>
        <span style={{ fontSize: '0.4375rem', fontWeight: 700, color: '#60a5fa', fontFamily: 'monospace', background: 'rgba(29,78,216,0.3)', padding: '1px 4px', borderRadius: 2 }}>A10</span>
        <span style={{ fontSize: '0.4375rem', color: '#64748b', fontFamily: 'monospace' }}> towards Charlottenburg</span>
      </div>
    </div>
  );
}

function ThumbLaneGuidance() {
  const lanes = [
    { dirs: ['←'],    drivable: false },
    { dirs: ['↑'],    drivable: false },
    { dirs: ['↑','→'],drivable: true  },
    { dirs: ['→'],    drivable: true, recommended: true },
  ];
  return (
    <div style={{ background: '#0d1117', borderRadius: 20, overflow: 'hidden', height: '100%', padding: '8px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
      <div style={{ fontSize: '0.5rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lane bar · junction ahead</div>
      <div style={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
        {lanes.map((lane, i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            padding: '6px 10px', borderRadius: 6, minWidth: 36,
            background: lane.recommended ? 'rgba(234,179,8,0.15)' : lane.drivable ? 'rgba(255,255,255,0.05)' : 'transparent',
            border: lane.recommended ? '1px solid rgba(234,179,8,0.35)' : '1px solid rgba(255,255,255,0.07)',
            opacity: lane.drivable || lane.recommended ? 1 : 0.28,
          }}>
            {lane.dirs.map(d => (
              <span key={d} style={{ fontSize: '0.8125rem', lineHeight: 1, color: lane.recommended ? '#eab308' : lane.drivable ? '#e2e8f0' : '#475569' }}>{d}</span>
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <div style={{ width: 6, height: 6, borderRadius: 2, background: 'rgba(234,179,8,0.15)', border: '1px solid rgba(234,179,8,0.35)' }}/>
          <span style={{ fontSize: '0.4375rem', color: '#64748b' }}>recommended</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <div style={{ width: 6, height: 6, borderRadius: 2, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}/>
          <span style={{ fontSize: '0.4375rem', color: '#64748b' }}>drivable</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Endpoint card ──────────────────────────────────────────────────────────── */
function EndpointCard({ Thumb, title, method, path, desc, available, tag, onNavigate, pageId }) {
  const clickable = Boolean(pageId && onNavigate && available !== false);
  return (
    <div
      onClick={clickable ? () => onNavigate(pageId) : undefined}
      style={{ cursor: clickable ? 'pointer' : 'default', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden', background: available === false ? 'var(--surface)' : 'var(--white)', opacity: available === false ? 0.55 : 1, transition: 'box-shadow 0.15s, border-color 0.15s', display: 'flex', flexDirection: 'column' }}
      onMouseEnter={clickable ? e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = 'var(--red)'; } : undefined}
      onMouseLeave={clickable ? e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; } : undefined}
    >
      <div style={{ height: 120, background: '#0d1117', overflow: 'hidden', padding: 8, flexShrink: 0 }}>
        <Thumb />
      </div>
      <div style={{ padding: '12px 14px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <MethodBadge method={method} />
          {tag && <span style={{ fontSize: '0.625rem', padding: '1px 5px', borderRadius: 3, background: tag === 'Preview' ? 'rgba(167,139,250,0.12)' : 'rgba(226,0,26,0.08)', color: tag === 'Preview' ? '#a78bfa' : '#e2001a', fontWeight: 600 }}>{tag}</span>}
          {available === false && <span style={{ fontSize: '0.625rem', color: '#64748b', marginLeft: 'auto' }}>v1 only</span>}
        </div>
        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--black)', marginBottom: 3 }}>{title}</div>
        <code style={{ display: 'block', fontSize: '0.625rem', color: 'var(--muted)', fontFamily: 'var(--font-mono, monospace)', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{path}</code>
        <div style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.5 }}>{desc}</div>
      </div>
    </div>
  );
}



/* ─── Page ──────────────────────────────────────────────────────────────────── */
const ENDPOINTS_V1 = [
  { Thumb: ThumbCalculateRoute, title: 'Calculate Route',           method: 'GET',  path: '/routing/1/calculateRoute/{locations}/json',          desc: 'Calculate one or more routes between waypoints with full vehicle profile, traffic, consumption model, and guidance support.', pageId: 'routing-calculate-route', available: true },
  { Thumb: ThumbReachableRange, title: 'Reachable Range',           method: 'GET',  path: '/routing/1/calculateReachableRange/{origin}/json',     desc: 'Calculate the isochrone polygon reachable within a given time, distance, fuel, or energy budget from an origin point.',  pageId: 'routing-reachable-range', available: true },
  { Thumb: ThumbBatchRouting,   title: 'Batch Routing',             method: 'POST', path: '/routing/1/batch/sync/json',                           desc: 'Submit up to 700 route or range calculations in a single request. Synchronous (100 items) and asynchronous modes.',       pageId: 'routing-batch',           available: true },
  { Thumb: ThumbInstructions,   title: 'Turn-by-Turn Instructions', method: 'GET',  path: '/routing/1/calculateRoute/…?instructionsType=text',    desc: 'Activate maneuver-by-maneuver guidance on any Calculate Route call. Returns text, tagged, or coded maneuver arrays.',     pageId: 'routing-instructions',    available: true },
  { Thumb: ThumbLaneGuidance,   title: 'Lane Guidance',             method: 'GET',  path: '/routing/1/calculateRoute/…?sectionType=lanes',        desc: 'Per-lane direction and drivability data at complex junctions. Requires instructionsType=tagged and sectionType=lanes.',   pageId: 'routing-lane-guidance',   available: true },
  { Thumb: ThumbRoadShields,    title: 'Road Shield Notes',         method: 'GET',  path: '/routing/1/calculateRoute/…?sectionType=roadShields',  desc: 'Shield shape category, road reference, and display text for every road segment. Use iconCategory to select the correct sign asset.', pageId: 'routing-road-shields', available: true },
];

const ENDPOINTS_V2 = [
  { ...ENDPOINTS_V1[0], available: true },
  { ...ENDPOINTS_V1[1], available: false, path: '/maps/orbis/routing/calculateReachableRange/{origin}/json' },
  { ...ENDPOINTS_V1[2], available: false },
  { ...ENDPOINTS_V1[3], available: false },
  { ...ENDPOINTS_V1[4], available: false },
  { ...ENDPOINTS_V1[5], available: false },
];


export default function RoutingAPIIntro({ onNavigate, platform = 'tomtom-maps' }) {
  const isOrbis = platform === 'orbis-maps';
  const endpoints = isOrbis ? ENDPOINTS_V2 : ENDPOINTS_V1;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Routing API</h1>
        <PageActions />
      </div>

      <p className="quick-answer">
        {isOrbis
          ? 'The Routing API on Orbis Maps (v2) calculates routes for cars with a streamlined parameter set and JSON-only responses. Currently in Public Preview.'
          : 'Calculate optimal routes between waypoints with full support for vehicle profiles, real-time traffic, EV consumption modelling, reachable range, and batch processing across ~215 countries.'}
      </p>

      {/* Capability tiles — inline under summary, v1 only */}
      {!isOrbis && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10, margin: '20px 0 0' }}>
          {[
            ['🚗', 'Vehicle profiles', 'Truck routing with height, width, weight, axle load, ADR tunnel codes, and hazardous load types. Eight travel modes.'],
            ['⚡', 'EV consumption model', 'Speed-to-kWh consumption tables, auxiliary power draw, and regenerative braking — for single-charge EV routes.'],
            ['📡', 'Live + historic traffic', 'IQ Routes™ learns from historical patterns. Real-time incident data projects travel time up to 60 days forward.'],
            ['🗣️', 'Turn-by-turn guidance', '40+ manoeuvre codes, lane guidance with separator types, road shield references, and phonetic street names.'],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ border: '1px solid var(--border)', borderRadius: 20, padding: '12px 14px', background: 'var(--surface)' }}>
              <div style={{ display: 'flex', gap: 7, alignItems: 'flex-start', marginBottom: 5 }}>
                <span style={{ fontSize: '0.9rem', lineHeight: 1.2 }}>{icon}</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--black)' }}>{title}</span>
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.55 }}>{desc}</div>
            </div>
          ))}
        </div>
      )}

      {isOrbis && (
        <Callout type="warning">
          <strong>Public Preview</strong> — Orbis Maps v2 currently supports Calculate Route (car only). Reachable Range and Batch Routing are available on TomTom Maps (v1).
        </Callout>
      )}

      {/* Endpoint grid */}
      <div className="zone">
        <h2 className="sh" id="r-endpoints">
          {isOrbis ? 'Available endpoints' : 'All endpoints'}
        </h2>
        <p className="quick-answer" style={{ marginBottom: 20 }}>
          {isOrbis
            ? 'One endpoint is available in Orbis Maps v2. The full endpoint surface — including Reachable Range, Batch, and guidance — is on TomTom Maps v1.'
            : 'Three core endpoints plus two guidance surfaces. Each can be used independently.'}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
          {endpoints.map(ep => (
            <EndpointCard key={ep.title} {...ep} onNavigate={onNavigate} />
          ))}
        </div>
      </div>

      {/* See demos */}
      <div className="zone">
        <h2 className="sh" id="r-examples">See demos</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--mid)', margin: '0 0 20px', lineHeight: 1.6 }}>
          Live demos built with the{' '}
          <a href="https://docs.tomtom.com/maps-sdk-js/overview" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--red)', textDecoration: 'none', fontWeight: 500 }}>
            TomTom Maps SDK for JavaScript
          </a>{' '}
          on top of the Routing API. Click <strong>Key config</strong> to see the API parameters in action.
        </p>
        <div className="examples-grid">

          <ExampleCard
            href="https://docs.tomtom.com/maps-sdk-js/examples/reachable-ranges"
            title="Reachable ranges"
            description="Calculate time-based accessibility zones from one or more origins and render them as colour-filled polygons on a live map."
            tags={[
              { label: 'Playground', variant: 'playground' },
              { label: 'Routing', variant: 'feature' },
              { label: 'Web', variant: 'platform' },
            ]}
            imgSrc="/example-thumbs/reachable-ranges.png"
            snippet={`// Calculate time-based reachable range
const ranges = await calculateReachableRanges({
  origins: [{ lat: 52.3086, lon: 4.7641 }],
  // Switch between 'timeMinutes', 'fuelBudgetInLiters',
  // or 'energyBudgetInkWh' for EV range rings
  budgets: [
    { budgetType: 'timeMinutes', budget: 10 },
    { budgetType: 'timeMinutes', budget: 20 },
    { budgetType: 'timeMinutes', budget: 30 },
  ],
  vehicle: {
    routeType: 'fastest',
    travelMode: 'car',
  },
});
// Render polygons with GeometriesModule
geometriesModule.showGeometries(
  ranges.map(r => reachableRangeGeometryConfig(r))
);`}
          />

          <ExampleCard
            href="https://docs.tomtom.com/maps-sdk-js/examples/route"
            title="Route with waypoints"
            description="Calculate and render an A–B route on an interactive map. Add intermediate waypoints, choose travel mode, and display route summary stats."
            tags={[
              { label: 'Getting Started', variant: 'start' },
              { label: 'Routing', variant: 'feature' },
              { label: 'Web', variant: 'platform' },
            ]}
            imgSrc="/example-thumbs/route.png"
            snippet={`// Calculate route with intermediate waypoints
const route = await calculateRoute({
  locations: [
    { lat: 48.8566, lon: 2.3522  },  // Paris
    { lat: 50.8503, lon: 4.3517  },  // Brussels (stop)
    { lat: 51.2194, lon: 4.4025  },  // Antwerp (stop)
    { lat: 52.3676, lon: 4.9041  },  // Amsterdam
  ],
  // Route options
  routeType:  'fastest',
  travelMode: 'car',
  traffic:    true,
  // Optional: avoid tolls, ferries, or motorways
  avoid: ['unpavedRoads'],
});
// Stats are in the summary object
const { travelTimeInSeconds, lengthInMeters } =
  route.routes[0].summary;`}
          />

        </div>
      </div>

      {/* Platform versions — compact row */}
      <div className="zone">
        <h2 className="sh" id="r-platforms">Platform versions</h2>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[
            {
              id: 'tomtom-maps', label: 'TomTom Maps', version: 'v1',
              base: 'api.tomtom.com/routing/1/…',
              status: 'GA', statusColor: '#22c55e',
              summary: 'Full endpoint surface — Calculate Route, Reachable Range, Batch, guidance, all travel modes.',
              pageId: 'routing-tomtom-maps',
            },
            {
              id: 'orbis-maps', label: 'Orbis Maps', version: 'v2',
              base: 'api.tomtom.com/maps/orbis/routing/…',
              status: 'Preview', statusColor: '#a78bfa',
              summary: 'Calculate Route (car only). Reachable Range and Batch not yet available. Requires TomTom-Api-Version: 2 header.',
              pageId: 'routing-orbis-maps',
            },
          ].map(p => {
            const active = isOrbis ? p.id === 'orbis-maps' : p.id === 'tomtom-maps';
            return (
              <button
                key={p.id}
                onClick={() => onNavigate?.(p.pageId)}
                style={{ flex: '1 1 260px', textAlign: 'left', padding: '14px 16px', borderRadius: 20, border: `1px solid ${active ? '#e2001a' : 'var(--border)'}`, background: active ? 'rgba(226,0,26,0.03)' : 'var(--surface)', cursor: 'pointer', transition: 'border-color 0.15s' }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.borderColor = 'rgba(226,0,26,0.4)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--black)' }}>{p.label}</span>
                  <span style={{ fontSize: '0.625rem', padding: '1px 5px', borderRadius: 3, background: 'rgba(139,148,158,0.12)', color: 'var(--muted)', fontFamily: 'monospace' }}>{p.version}</span>
                  <span style={{ fontSize: '0.625rem', padding: '1px 6px', borderRadius: 3, background: `${p.statusColor}18`, color: p.statusColor, fontWeight: 600, marginLeft: 'auto' }}>{p.status}</span>
                </div>
                <code style={{ display: 'block', fontSize: '0.625rem', color: 'var(--muted)', fontFamily: 'monospace', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.base}</code>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.5 }}>{p.summary}</p>
                <span style={{ display: 'inline-block', marginTop: 8, fontSize: '0.875rem', color: 'var(--red)', fontWeight: 600 }}>Full comparison →</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Getting started */}
      <div className="zone">
        <h2 className="sh" id="r-start">Ready to build?</h2>
        <p className="body" style={{ marginBottom: 16 }}>
          The Quick Start walks through authentication and your first route request in under 5 minutes.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            className="page-action-btn"
            style={{ background: '#e2001a', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 6, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
            onClick={() => onNavigate?.('routing-first-route')}
          >
            Quick Start
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('routing-calculate-route')}>
            Calculate Route reference
          </button>
        </div>
      </div>

      {/* Related standalone APIs */}
      <div className="zone">
        <h2 className="sh" id="r-related">Related APIs</h2>
        <p className="body" style={{ marginBottom: 16 }}>
          These APIs are separate products — each with their own endpoint, quota, and documentation.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          {[
            {
              productId: 'ldevr',
              pageId:    'ldevr-intro',
              label:     'Long Distance EV Routing API',
              desc:      'Automatic charging stop selection for trips beyond a single charge. Separate product with its own quota and tier.',
              tag:       'Separate product',
            },
            {
              productId: 'matrix-routing',
              pageId:    'matrix-intro',
              label:     'Matrix Routing v2 API',
              desc:      'Travel time and distance for every origin–destination combination. Up to 100M cells asynchronously.',
              tag:       'Separate product',
            },
            {
              productId: 'waypoint-opt',
              pageId:    'waypoint-intro',
              label:     'Waypoint Optimization API',
              desc:      'Reorder 2–12 stops for minimum travel time. Feed the result back into Calculate Route.',
              tag:       'Separate product',
            },
          ].map(r => (
            <button
              key={r.label}
              onClick={() => onNavigate?.(r.pageId, r.productId)}
              style={{ textAlign: 'left', padding: '14px 16px', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', transition: 'border-color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#e2001a'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{r.tag}</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--black)', marginBottom: 5 }}>{r.label} →</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.5 }}>{r.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <Callout type="info">
        Coverage data, changelog, and deprecation notices are in{' '}
        <button onClick={() => onNavigate?.('routing-coverage')} style={{ background: 'none', border: 'none', padding: 0, color: 'var(--red)', fontWeight: 600, cursor: 'pointer', fontSize: 'inherit', textDecoration: 'underline' }}>
          Market Coverage
        </button>{' '}
        and the Platform Reference section.
      </Callout>
    </div>
  );
}
