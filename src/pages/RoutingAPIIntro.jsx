import { useTranslation } from 'react-i18next';
import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import ExampleCard from '../components/ui/ExampleCard';
import { useIlloStyle } from '../context/IlloStyleContext';
import {
  makeThumb,
  L_CalculateRoute, L_ReachableRange, L_BatchRouting, L_TurnInstructions, L_LaneGuidance, L_RoadShields,
  L_RoutingComputeToll, L_RoutingWeather, L_RoutingDataFreshness,
} from '../illustrations/lightVariants';

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

function ThumbComputeToll() {
  return (
    <div style={{ background: '#0d1117', borderRadius: 20, overflow: 'hidden', height: '100%', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ fontSize: '0.5rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Compute Toll Amounts</div>
      <svg viewBox="0 0 200 55" style={{ width: '100%', height: 55, flexShrink: 0 }} fill="none">
        <path d="M0 38 Q100 34 200 38" stroke="#243040" strokeWidth="8" strokeLinecap="round"/>
        <rect x="98" y="16" width="4" height="28" rx="2" fill="#475569"/>
        <rect x="100" y="16" width="48" height="5" rx="2" fill="#e2001a" opacity="0.85"/>
        <rect x="82" y="10" width="18" height="30" rx="3" fill="#1e293b"/>
      </svg>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3 }}>
        {[['Base toll', '€2.40', '#e2e8f0'], ['EV discount', '–€0.60', '#22c55e'], ['Total', '€1.80', '#58a6ff']].map(([label, val, col]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.4375rem', color: '#475569' }}>{label}</span>
            <span style={{ fontSize: '0.4375rem', fontWeight: 700, color: col, fontFamily: 'monospace' }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ThumbWeather() {
  return (
    <div style={{ background: '#0c1318', borderRadius: 20, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 130" fill="none">
        <rect width="200" height="130" fill="#1a2535"/>
        <path d="M20 70 Q60 54 90 50" stroke="#e2001a" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
        <path d="M90 50 Q130 44 165 38" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.8" strokeDasharray="5 3"/>
        <ellipse cx="130" cy="32" rx="22" ry="11" fill="#475569" opacity="0.5"/>
        <ellipse cx="116" cy="35" rx="16" ry="9" fill="#475569" opacity="0.5"/>
        {[108, 118, 128, 138, 148].map((x, i) => (
          <line key={i} x1={x} y1={43} x2={x - 3} y2={53} stroke="#58a6ff" strokeWidth="1.2" opacity="0.45" strokeLinecap="round"/>
        ))}
        <circle cx="20" cy="70" r="5" fill="#3fb950"/>
        <circle cx="165" cy="38" r="5" fill="#e2001a"/>
      </svg>
      <div style={{ position: 'absolute', bottom: 8, left: 8, right: 8, background: 'rgba(8,14,26,0.9)', borderRadius: 5, padding: '5px 10px', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.5rem', color: '#e2e8f0' }}>Rain · Route adjusted</span>
        <span style={{ fontSize: '0.5rem', color: '#fbbf24', fontWeight: 700 }}>7°C</span>
      </div>
    </div>
  );
}

function ThumbDataFreshness() {
  const items = [
    { label: 'Traffic data',  pct: 100, color: '#22c55e' },
    { label: 'Road closures', pct: 75,  color: '#22c55e' },
    { label: 'Speed limits',  pct: 40,  color: '#fbbf24' },
  ];
  return (
    <div style={{ background: '#0d1117', borderRadius: 20, overflow: 'hidden', height: '100%', padding: '8px 10px' }}>
      <div style={{ fontSize: '0.5rem', color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Data Freshness</div>
      {items.map((item) => (
        <div key={item.label} style={{ marginBottom: 8 }}>
          <span style={{ fontSize: '0.4375rem', color: '#94a3b8', display: 'block', marginBottom: 2 }}>{item.label}</span>
          <div style={{ height: 5, background: '#1e293b', borderRadius: 2 }}>
            <div style={{ height: '100%', width: `${item.pct}%`, background: item.color, borderRadius: 2, opacity: 0.85 }}/>
          </div>
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 4 }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e' }}/>
        <span style={{ fontSize: '0.4375rem', color: '#22c55e' }}>Live feed · auto-refresh</span>
      </div>
    </div>
  );
}

/* ─── Endpoint card ──────────────────────────────────────────────────────────── */
function EndpointCard({ Thumb, title, method, path, desc, available, tag, onNavigate, pageId }) {
  const clickable = Boolean(pageId && onNavigate && available !== false);
  const { theme, palette } = useIlloStyle();
  return (
    <div
      className={`nav-card${available === false ? ' nav-card--disabled' : ''}`}
      onClick={clickable ? () => onNavigate(pageId) : undefined}
    >
      <div className="nav-card-thumb" style={theme !== 'dark' ? { background: palette.bg, padding: 0 } : undefined}>
        <Thumb />
      </div>
      <div className="nav-card-body">
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
export default function RoutingAPIIntro({ onNavigate }) {
  const { t } = useTranslation('pages');

  const ENDPOINTS_V1 = [
    { Thumb: makeThumb(ThumbCalculateRoute, L_CalculateRoute), title: t('routingIntro.endpointDescs.calculateRoute', { defaultValue: 'Calculate Route' }), method: 'GET',  path: '/routing/1/calculateRoute/{locations}/json',          desc: t('routingIntro.endpointDescs.calculateRoute'), pageId: 'routing-calculate-route', available: true },
    { Thumb: makeThumb(ThumbReachableRange, L_ReachableRange), title: 'Reachable Range',           method: 'GET',  path: '/routing/1/calculateReachableRange/{origin}/json',     desc: t('routingIntro.endpointDescs.reachableRange'),  pageId: 'routing-reachable-range', available: true },
    { Thumb: makeThumb(ThumbBatchRouting,   L_BatchRouting),   title: 'Batch Routing',             method: 'POST', path: '/routing/1/batch/sync/json',                           desc: t('routingIntro.endpointDescs.batchRouting'),    pageId: 'routing-batch',           available: true },
    { Thumb: makeThumb(ThumbInstructions,   L_TurnInstructions),title: 'Turn-by-Turn Instructions',method: 'GET',  path: '/routing/1/calculateRoute/…?instructionsType=text',    desc: t('routingIntro.endpointDescs.instructions'),    pageId: 'routing-instructions',    available: true },
    { Thumb: makeThumb(ThumbLaneGuidance,   L_LaneGuidance),   title: 'Lane Guidance',             method: 'GET',  path: '/routing/1/calculateRoute/…?sectionType=lanes',        desc: t('routingIntro.endpointDescs.laneGuidance'),    pageId: 'routing-lane-guidance',   available: true },
    { Thumb: makeThumb(ThumbRoadShields,    L_RoadShields),    title: 'Road Shield Notes',         method: 'GET',  path: '/routing/1/calculateRoute/…?sectionType=roadShields',  desc: t('routingIntro.endpointDescs.roadShields'),     pageId: 'routing-road-shields',    available: true },
    { Thumb: makeThumb(ThumbComputeToll,    L_RoutingComputeToll), title: 'Compute Toll Amounts',  method: 'GET',  path: '/routing/2/calculateRoute/…?computeTravelTimeFor=all', desc: t('routingIntro.endpointDescs.computeTollAmounts', { defaultValue: 'Calculate per-road-class toll costs along the route, with EV discount and currency breakdown.' }), pageId: 'routing-compute-toll',    available: true, tag: 'v2+' },
    { Thumb: makeThumb(ThumbWeather,        L_RoutingWeather), title: 'Weather Consideration',     method: 'GET',  path: '/maps/orbis/routing/v3/…?weatherConsideration=true',   desc: t('routingIntro.endpointDescs.weatherConsideration', { defaultValue: 'Incorporate real-time weather data to adjust route timing, ETA, and safety warnings.' }), pageId: 'routing-weather',         available: true, tag: 'v3' },
    { Thumb: makeThumb(ThumbDataFreshness,  L_RoutingDataFreshness), title: 'Dynamic Data Freshness', method: 'GET', path: '/routing/2/calculateRoute/…?dateFreshness=true',     desc: t('routingIntro.endpointDescs.dynamicDataFreshness', { defaultValue: 'Control how fresh traffic, closure, and speed-limit data must be before the route is recalculated.' }), pageId: 'routing-data-freshness', available: true, tag: 'v2+' },
  ];

  const endpoints = ENDPOINTS_V1;

  return (
    <div className="page">
      <div className="page-header">
        <h1>{t('routingIntro.title')}</h1>
        <PageActions />
      </div>

      <p className="quick-answer">
        {t('routingIntro.quickAnswer')}
      </p>

      {/* Capability tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10, margin: '20px 0 0' }}>
        {[
          ['🚗', t('routingIntro.capabilities.vehicleProfiles.title'), t('routingIntro.capabilities.vehicleProfiles.desc')],
          ['⚡', t('routingIntro.capabilities.evConsumption.title'), t('routingIntro.capabilities.evConsumption.desc')],
          ['📡', t('routingIntro.capabilities.traffic.title'), t('routingIntro.capabilities.traffic.desc')],
          ['🗣️', t('routingIntro.capabilities.guidance.title'), t('routingIntro.capabilities.guidance.desc')],
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

      {/* Endpoint grid */}
      <div className="zone">
        <h2 className="sh" id="r-endpoints">{t('routingIntro.endpointsTitle')}</h2>
        <p className="quick-answer" style={{ marginBottom: 20 }}>
          {t('routingIntro.endpointsSubtitle')}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
          {endpoints.map(ep => (
            <EndpointCard key={ep.pageId} {...ep} onNavigate={onNavigate} />
          ))}
        </div>
      </div>

      {/* See demos */}
      <div className="zone">
        <h2 className="sh" id="r-examples">{t('routingIntro.demosTitle')}</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--mid)', margin: '0 0 20px', lineHeight: 1.6 }}>
          {t('routingIntro.demosIntro').split(t('routingIntro.demosIntroLinkText'))[0]}
          <a href="https://docs.tomtom.com/maps-sdk-js/overview" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--red)', textDecoration: 'none', fontWeight: 500 }}>
            {t('routingIntro.demosIntroLinkText')}
          </a>
          {t('routingIntro.demosIntro').split(t('routingIntro.demosIntroLinkText'))[1]}
        </p>
        <div className="examples-grid">

          <ExampleCard
            href="https://docs.tomtom.com/maps-sdk-js/examples/reachable-ranges"
            title={t('routingIntro.exampleTitles.reachableRanges')}
            description={t('routingIntro.exampleDescs.reachableRanges')}
            tags={[
              { label: t('routingIntro.tagLabels.playground'), variant: 'playground' },
              { label: t('routingIntro.tagLabels.routing'), variant: 'feature' },
              { label: t('routingIntro.tagLabels.web'), variant: 'platform' },
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
            title={t('routingIntro.exampleTitles.routeWithWaypoints')}
            description={t('routingIntro.exampleDescs.routeWithWaypoints')}
            tags={[
              { label: t('routingIntro.tagLabels.gettingStarted'), variant: 'start' },
              { label: t('routingIntro.tagLabels.routing'), variant: 'feature' },
              { label: t('routingIntro.tagLabels.web'), variant: 'platform' },
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

      {/* Version comparison table */}
      <div className="zone">
        <h2 className="sh" id="r-platforms">{t('routingIntro.versionsTitle')}</h2>
        {(() => {
          const V1 = { label: t('routingIntro.versionLabels.v1'), version: 'v1', status: t('routingIntro.versionStatuses.production'),     statusColor: '#15803d', statusBg: 'rgba(34,197,94,0.12)',   color: '#15803d', bg: 'rgba(34,197,94,0.1)'   };
          const V2 = { label: t('routingIntro.versionLabels.v2'), version: 'v2', status: t('routingIntro.versionStatuses.publicPreview'),  statusColor: '#7c3aed', statusBg: 'rgba(168,85,247,0.12)',  color: '#7c3aed', bg: 'rgba(168,85,247,0.1)'  };
          const V3 = { label: t('routingIntro.versionLabels.v3'), version: 'v3', status: t('routingIntro.versionStatuses.privatePreview'), statusColor: '#92400e', statusBg: 'rgba(234,179,8,0.12)',   color: '#92400e', bg: 'rgba(234,179,8,0.1)'   };
          const Y = '✓'; const N = '—';
          const rows = [
            { label: t('routingIntro.tableRows.mapPlatform'),          v1: 'TomTom Maps',              v2: 'Orbis Maps',                      v3: 'Orbis Maps'                          },
            { label: t('routingIntro.tableRows.httpMethod'),           v1: 'GET or POST',              v2: 'GET or POST',                     v3: 'POST only'                           },
            { label: t('routingIntro.tableRows.routeWaypoints'),       v1: 'Path parameters',          v2: 'Path params or POST body',        v3: 'POST body legs array'                },
            { label: t('routingIntro.tableRows.responseFields'),       v1: 'Full response',            v2: 'Full response',                   v3: 'Attributes header — selected fields' },
            { label: t('routingIntro.tableRows.baseEndpoint'),         v1: '/routing/1/…',             v2: '/routing/2/…',                    v3: '/maps/orbis/routing/v3/…'            },
            { label: t('routingIntro.tableRows.calculateRoute'),       v1: Y, v2: Y, v3: Y },
            { label: t('routingIntro.tableRows.reachableRange'),       v1: Y, v2: Y, v3: Y },
            { label: t('routingIntro.tableRows.batchRouting'),         v1: Y, v2: N, v3: N },
            { label: t('routingIntro.tableRows.guidanceInstructions'), v1: Y, v2: Y, v3: Y },
            { label: t('routingIntro.tableRows.laneGuidance'),         v1: Y, v2: Y, v3: Y },
            { label: t('routingIntro.tableRows.roadShieldNotes'),      v1: Y, v2: N, v3: N },
            { label: t('routingIntro.tableRows.computeTollAmounts'),   v1: N, v2: Y, v3: Y },
            { label: t('routingIntro.tableRows.weatherConsideration'), v1: N, v2: N, v3: Y },
            { label: t('routingIntro.tableRows.dynamicDataFreshness'), v1: N, v2: Y, v3: N },
          ];
          const cell = (val, col) => {
            const isTick = val === Y, isDash = val === N;
            return (
              <td key={col.label} style={{
                padding: '9px 14px', fontSize: '0.8125rem', textAlign: 'left',
                color: isTick ? col.color : isDash ? 'var(--border)' : 'var(--mid)',
                fontWeight: isTick ? 700 : 400,
                borderBottom: '1px solid var(--border)',
              }}>
                {val}
              </td>
            );
          };
          return (
            <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--border)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg)' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border)', width: '34%' }} />
                    {[V1, V2, V3].map(v => (
                      <th key={v.label} style={{ padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid var(--border)', width: '22%' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                          <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)' }}>{v.label}</span>
                          <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 4, background: v.statusBg, color: v.statusColor, whiteSpace: 'nowrap' }}>{v.status}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={row.label} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--bg)' }}>
                      <td style={{ padding: '9px 14px', fontWeight: 600, color: 'var(--black)', borderBottom: '1px solid var(--border)', fontSize: '0.8125rem' }}>{row.label}</td>
                      {cell(row.v1, V1)}
                      {cell(row.v2, V2)}
                      {cell(row.v3, V3)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })()}
      </div>

      {/* Getting started */}
      <div className="zone">
        <h2 className="sh" id="r-start">{t('routingIntro.readyTitle')}</h2>
        <p className="body" style={{ marginBottom: 16 }}>
          {t('routingIntro.readyBody')}
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            className="page-action-btn"
            style={{ background: '#e2001a', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 6, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
            onClick={() => onNavigate?.('routing-first-route')}
          >
            {t('routingIntro.ctaQuickStart')}
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('routing-calculate-route')}>
            {t('routingIntro.ctaCalculateRoute')}
          </button>
        </div>
      </div>

      {/* Related standalone APIs */}
      <div className="zone">
        <h2 className="sh" id="r-related">{t('routingIntro.relatedTitle')}</h2>
        <p className="body" style={{ marginBottom: 16 }}>
          {t('routingIntro.relatedBody')}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          {[
            {
              productId: 'ldevr',
              pageId:    'ldevr-intro',
              label:     t('routingIntro.relatedLdevr.label'),
              desc:      t('routingIntro.relatedLdevr.desc'),
              tag:       t('routingIntro.relatedLdevr.tag'),
            },
            {
              productId: 'matrix-routing',
              pageId:    'matrix-intro',
              label:     t('routingIntro.relatedMatrix.label'),
              desc:      t('routingIntro.relatedMatrix.desc'),
              tag:       t('routingIntro.relatedMatrix.tag'),
            },
            {
              productId: 'waypoint-opt',
              pageId:    'waypoint-intro',
              label:     t('routingIntro.relatedWaypoint.label'),
              desc:      t('routingIntro.relatedWaypoint.desc'),
              tag:       t('routingIntro.relatedWaypoint.tag'),
            },
          ].map(r => (
            <button
              key={r.label}
              className="text-card"
              onClick={() => onNavigate?.(r.pageId, r.productId)}
            >
              <div style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{r.tag}</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--black)', marginBottom: 5 }}>{r.label} →</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.5 }}>{r.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <Callout type="info">
        {t('routingIntro.callout').split(t('routingIntro.calloutLinkText'))[0]}
        <button onClick={() => onNavigate?.('routing-coverage')} style={{ background: 'none', border: 'none', padding: 0, color: 'var(--red)', fontWeight: 600, cursor: 'pointer', fontSize: 'inherit', textDecoration: 'underline' }}>
          {t('routingIntro.calloutLinkText')}
        </button>
        {t('routingIntro.callout').split(t('routingIntro.calloutLinkText'))[1]}
      </Callout>
    </div>
  );
}
