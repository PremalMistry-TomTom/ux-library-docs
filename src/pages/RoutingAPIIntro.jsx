import { useState } from 'react';
import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

/* Wrap each line (plain text or pre-highlighted HTML) for CSS counter line numbers */
const addLn = t => {
  const lines = t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').split('\n');
  if (lines[lines.length - 1] === '') lines.pop();
  return lines.map(l => `<span class="cb-line">${l}</span>`).join('\n');
};
const addLnHtml = html => {
  const lines = html.split('\n');
  if (lines[lines.length - 1] === '') lines.pop();
  return lines.map(l => `<span class="cb-line">${l}</span>`).join('\n');
};

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
    <div style={{ background: '#0c1318', borderRadius: 8, overflow: 'hidden', height: '100%', position: 'relative' }}>
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
    <div style={{ background: '#0c1318', borderRadius: 8, overflow: 'hidden', height: '100%', position: 'relative' }}>
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
    <div style={{ background: '#0c1318', borderRadius: 8, overflow: 'hidden', height: '100%', position: 'relative' }}>
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
    <div style={{ background: '#0d1117', borderRadius: 8, overflow: 'hidden', height: '100%', padding: '8px 10px' }}>
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
    <div style={{ background: '#0d1117', borderRadius: 8, overflow: 'hidden', height: '100%', padding: '8px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6 }}>
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
    <div style={{ background: '#0d1117', borderRadius: 8, overflow: 'hidden', height: '100%', padding: '8px 10px' }}>
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
    <div style={{ background: '#0d1117', borderRadius: 8, overflow: 'hidden', height: '100%', padding: '8px 10px' }}>
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
    <div style={{ background: '#0d1117', borderRadius: 8, overflow: 'hidden', height: '100%', padding: '8px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
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
    <div style={{ background: '#0d1117', borderRadius: 8, overflow: 'hidden', height: '100%', padding: '8px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
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
      style={{ cursor: clickable ? 'pointer' : 'default', borderRadius: 10, border: '1px solid var(--border)', overflow: 'hidden', background: available === false ? 'var(--surface)' : 'var(--white)', opacity: available === false ? 0.55 : 1, transition: 'box-shadow 0.15s, border-color 0.15s', display: 'flex', flexDirection: 'column' }}
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
        <div style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.5 }}>{desc}</div>
      </div>
    </div>
  );
}

/* ─── Platform comparison card ───────────────────────────────────────────────── */
function PlatformCard({ id, label, version, badge, active, features, onNavigate, pageId }) {
  return (
    <div
      onClick={pageId ? () => onNavigate?.(pageId) : undefined}
      style={{ flex: 1, border: `1px solid ${active ? '#e2001a' : 'var(--border)'}`, borderRadius: 10, padding: '16px 20px', background: active ? 'rgba(226,0,26,0.03)' : 'var(--surface)', cursor: pageId ? 'pointer' : 'default', transition: 'border-color 0.2s' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--black)' }}>{label}</span>
            <span style={{ fontSize: '0.625rem', padding: '1px 5px', borderRadius: 3, background: 'rgba(139,148,158,0.12)', color: 'var(--muted)', fontFamily: 'monospace' }}>{version}</span>
            {badge && <span style={{ fontSize: '0.625rem', padding: '1px 6px', borderRadius: 3, background: 'rgba(167,139,250,0.12)', color: '#a78bfa', fontWeight: 600 }}>{badge}</span>}
          </div>
          {active && <span style={{ fontSize: '0.625rem', color: '#e2001a', fontWeight: 600 }}>Current</span>}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {features.map(([icon, text, ok]) => (
          <div key={text} style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.75rem', flexShrink: 0, marginTop: 1 }}>{icon}</span>
            <span style={{ fontSize: '0.75rem', color: ok ? 'var(--black)' : 'var(--muted)', lineHeight: 1.4 }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Code tab component ─────────────────────────────────────────────────────── */
function CodeTabs({ tabs }) {
  const [active, setActive] = useState(tabs[0].id);
  const current = tabs.find(t => t.id === active);
  return (
    <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', background: '#0d1117', borderBottom: '1px solid rgba(255,255,255,0.07)', paddingLeft: 4 }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            style={{ padding: '9px 16px', background: 'transparent', border: 'none', color: active === tab.id ? '#e2e8f0' : '#64748b', fontSize: '0.75rem', fontWeight: active === tab.id ? 600 : 400, cursor: 'pointer', borderBottom: `2px solid ${active === tab.id ? '#e2001a' : 'transparent'}`, transition: 'color 0.15s', whiteSpace: 'nowrap' }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <pre className="cb-pre">
        <code dangerouslySetInnerHTML={{ __html: current.html ? addLnHtml(current.html) : addLn(current.code) }} />
      </pre>
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

const TABS_TOMTOM = [
  {
    id: 'rest',
    label: 'REST',
    code: `# Route: Berlin Mitte (52.509, 13.429) → Checkpoint Charlie (52.503, 13.439)
# Fastest car route with live traffic and turn-by-turn instructions

curl "https://api.tomtom.com/routing/1/calculateRoute/\\
  52.50931,13.42936:52.50274,13.43872/json\\
  ?routeType=fastest\\
  &travelMode=car\\
  &traffic=true\\
  &instructionsType=text\\
  &language=en-GB\\
  &key=YOUR_API_KEY"`,
  },
  {
    id: 'kotlin',
    label: 'Kotlin SDK',
    code: `// Gradle: implementation("com.tomtom.sdk:routing-online:\$tomtomSdkVersion")
// Route: Berlin Mitte → Checkpoint Charlie

val routingClient = OnlineRoutingClient.create(
    context  = applicationContext,
    apiKey   = "YOUR_API_KEY"
)

val options = RoutePlanningOptions(
    itinerary = Itinerary(
        origin      = Place(GeoPoint(52.50931, 13.42936)),
        destination = Place(GeoPoint(52.50274, 13.43872))
    ),
    routeType       = RouteType.Fastest,
    travelMode      = TravelMode.Car,
    considerTraffic = TrafficConsiderationMode.LiveAndHistoricTraffic
)

routingClient.planRoute(options) { result ->
    result.fold(
        onSuccess = { response ->
            val route      = response.routes.first()
            val travelTime = route.summary.travelTime.seconds   // 396
            val distance   = route.summary.length.inMeters      // 1879
        },
        onFailure = { error -> Log.e("Routing", error.message) }
    )
}`,
  },
  {
    id: 'response',
    label: 'Response',
    code: `{
  "routes": [
    {
      "summary": {
        "lengthInMeters": 1879,
        "travelTimeInSeconds": 396,
        "trafficDelayInSeconds": 34,
        "trafficLengthInMeters": 421,
        "departureTime": "2025-10-30T10:00:00+01:00",
        "arrivalTime":   "2025-10-30T10:06:36+01:00"
      },
      "legs": [
        {
          "summary": {
            "lengthInMeters": 1879,
            "travelTimeInSeconds": 396
          },
          "points": [
            { "latitude": 52.50931, "longitude": 13.42936 },
            { "latitude": 52.50753, "longitude": 13.43201 },
            { "latitude": 52.50274, "longitude": 13.43872 }
          ]
        }
      ],
      "sections": [
        {
          "startPointIndex": 0,
          "endPointIndex": 6,
          "sectionType": "TRAVEL_MODE",
          "travelMode": "car"
        },
        {
          "startPointIndex": 3,
          "endPointIndex": 6,
          "sectionType": "TRAFFIC",
          "simpleCategory": "JAM",
          "effectiveSpeedInKmh": 14,
          "delayInSeconds": 34
        }
      ]
    }
  ]
}`,
  },
];

const TABS_ORBIS = [
  {
    id: 'rest',
    label: 'REST',
    code: `# Route: Berlin Mitte → Checkpoint Charlie
# Orbis Maps v2 — requires TomTom-Api-Version header

curl "https://api.tomtom.com/maps/orbis/routing/calculateRoute/\\
  52.50931,13.42936:52.50274,13.43872/json\\
  ?routeType=fast\\
  &travelMode=car\\
  &traffic=live\\
  &key=YOUR_API_KEY" \\
  -H "TomTom-Api-Version: 2"`,
  },
  {
    id: 'response',
    label: 'Response',
    code: `{
  "routes": [
    {
      "summary": {
        "lengthInMeters": 1879,
        "travelTimeInSeconds": 396,
        "trafficDelayInSeconds": 0,
        "departureTime": "2025-10-30T10:00:00+01:00",
        "arrivalTime":   "2025-10-30T10:06:36+01:00"
      },
      "legs": [
        {
          "summary": { "lengthInMeters": 1879, "travelTimeInSeconds": 396 },
          "points": [
            { "latitude": 52.50931, "longitude": 13.42936 },
            { "latitude": 52.50274, "longitude": 13.43872 }
          ]
        }
      ]
    }
  ]
}

// Note: guidance, roadShields, noTrafficTravelTime
// and historicTravelTime are not available in Orbis v2`,
  },
];

export default function RoutingAPIIntro({ onNavigate, platform = 'tomtom-maps' }) {
  const isOrbis = platform === 'orbis-maps';
  const endpoints = isOrbis ? ENDPOINTS_V2 : ENDPOINTS_V1;
  const codeTabs = isOrbis ? TABS_ORBIS : TABS_TOMTOM;

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

      {isOrbis && (
        <Callout type="warning">
          <strong>Public Preview</strong> — Orbis Maps v2 currently supports Calculate Route (car only). Reachable Range and Batch Routing are available on TomTom Maps (v1).
        </Callout>
      )}

      {/* Platform comparison */}
      <div className="zone">
        <h2 className="sh" id="r-platforms">Platform versions</h2>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <PlatformCard
            id="tomtom-maps"
            label="TomTom Maps"
            version="v1"
            active={!isOrbis}
            onNavigate={onNavigate}
            pageId="routing-tomtom-maps"
            features={[
              ['✅', 'Calculate Route, Reachable Range, and Batch Routing endpoints', true],
              ['✅', 'All travel modes: car, truck, taxi, bus, van, motorcycle, bicycle, pedestrian', true],
              ['✅', 'Turn-by-turn guidance, lane info, road shields, and junction manoeuvre codes', true],
              ['✅', 'Full vehicle profile: dimensions, axle weight, ADR tunnel codes, load types', true],
              ['✅', 'Combustion and electric consumption models with efficiency parameters', true],
              ['✅', 'JSON, XML, and JSONP response formats', true],
              ['✅', '~215 countries, real-time traffic in 75+ countries', true],
            ]}
          />
          <PlatformCard
            id="orbis-maps"
            label="Orbis Maps"
            version="v2"
            badge="Preview"
            active={isOrbis}
            onNavigate={onNavigate}
            pageId="routing-orbis-maps"
            features={[
              ['✅', 'Calculate Route endpoint — streamlined for car routing', true],
              ['✅', 'Traffic parameter as string: live or historical', true],
              ['✅', 'Route types renamed: fast, short, efficient, thrilling', true],
              ['✅', 'JSON-only responses; encoded polyline at precision 7', true],
              ['⚠️', 'Car travel mode only — truck, bus, bicycle not yet supported', false],
              ['⚠️', 'No guidance instructions or lane data in response', false],
              ['⚠️', 'Reachable Range and Batch Routing not yet available', false],
            ]}
          />
        </div>
      </div>

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

      {/* Key capabilities (v1 only — these are all TomTom Maps features) */}
      {!isOrbis && (
        <div className="zone">
          <h2 className="sh" id="r-capabilities">Key capabilities</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {[
              ['🚗', 'Vehicle profiles', 'Full truck routing with height, width, weight, axle load, ADR tunnel codes, and hazardous load types.'],
              ['⚡', 'EV consumption model', 'Battery curve modelling with speed-to-kWh tables, auxiliary power, and regenerative braking — for single-charge EV route calculation.'],
              ['📡', 'Live + historic traffic', 'IQ Routes™ learns from historical patterns. Real-time traffic projects up to 60 days forward.'],
              ['🗺️', 'Isochrone / range', 'Time-, distance-, fuel-, or energy-budget polygons with optional smoothing levels.'],
              ['🔀', 'Per-leg options', 'Override route type, avoidances, waypoint pause time, or supporting points on each individual leg via POST body.'],
              ['🗣️', 'Turn-by-turn guidance', '40+ manoeuvre codes, lane guidance with separator types, road shield atlas references, and phonetic street names.'],
              ['📦', 'Batch', 'Up to 700 Calculate Route or Reachable Range requests in a single call. Synchronous (≤100) and asynchronous modes.'],
              ['🌍', 'Global coverage', '~215 countries and territories, vignette avoidance per country code, and South Korea regional endpoint.'],
            ].map(([icon, title, desc]) => (
              <div key={title} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '12px 14px', background: 'var(--surface)' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.875rem', lineHeight: 1.2 }}>{icon}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)' }}>{title}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.5 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick start code example */}
      <div className="zone">
        <h2 className="sh" id="r-quickstart">Quick start</h2>
        <p className="body" style={{ marginBottom: 16 }}>
          {isOrbis
            ? 'Calculate a route on Orbis Maps v2 by adding the TomTom-Api-Version: 2 header and using the new base path and route type names.'
            : 'The fastest path to a working route. Swap in your API key and two coordinate pairs — the response returns distance, travel time, and the polyline.'}
        </p>
        <CodeTabs tabs={codeTabs} />
      </div>

      {/* Base URL */}
      <div className="zone">
        <h2 className="sh" id="r-baseurl">Base URL</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'TomTom Maps (v1)', url: 'https://api.tomtom.com', note: 'South Korea: kr-api.tomtom.com', active: !isOrbis },
            { label: 'Orbis Maps (v2)', url: 'https://api.tomtom.com/maps/orbis/routing', note: 'Requires TomTom-Api-Version: 2 header', active: isOrbis },
          ].map(({ label, url, note, active }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: active ? 'rgba(226,0,26,0.04)' : 'var(--surface)', border: `1px solid ${active ? 'rgba(226,0,26,0.25)' : 'var(--border)'}`, borderRadius: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 2 }}>{label}</div>
                <code style={{ fontSize: '0.75rem', color: 'var(--black)', fontFamily: 'var(--font-mono, monospace)' }}>{url}</code>
              </div>
              <div style={{ fontSize: '0.625rem', color: 'var(--muted)', textAlign: 'right', flexShrink: 0 }}>{note}</div>
            </div>
          ))}
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
              style={{ textAlign: 'left', padding: '14px 16px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', transition: 'border-color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#e2001a'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{r.tag}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)', marginBottom: 5 }}>{r.label} →</div>
              <div style={{ fontSize: '0.625rem', color: 'var(--mid)', lineHeight: 1.5 }}>{r.desc}</div>
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
