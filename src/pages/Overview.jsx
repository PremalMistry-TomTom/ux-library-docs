import { useTranslation } from 'react-i18next';
import Callout from '../components/ui/Callout';
import PageActions from '../components/ui/PageActions';

/* ─── Mini mock thumbnails ──────────────────────────────────────────────────── */

function ThumbEV() {
  const M = { bg: '#0d1117', card: '#161b22', line: '#21262d', text: '#e6edf3', dim: '#8b949e', green: '#3fb950', blue: '#58a6ff' };
  const stations = [['Belib', '22 kW', '4/5'], ['Indigo', '50 kW', '2/2'], ['Saemes', '7 kW', '6/8']];
  return (
    <div style={{ background: M.bg, borderRadius: 8, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.6rem', fontWeight: 700, color: M.text, marginBottom: 2 }}>Charging station</div>
      <div style={{ fontSize: '0.55rem', color: M.green, marginBottom: 7 }}>Near you · Available now</div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
        {['⚡ Speed', '💳 Payment', '🍴 Services'].map((f, i) => (
          <span key={f} style={{ fontSize: '0.5rem', padding: '2px 5px', borderRadius: 4, background: i === 0 ? M.blue : M.card, color: i === 0 ? '#fff' : M.dim, border: `1px solid ${i === 0 ? M.blue : M.line}` }}>{f}</span>
        ))}
      </div>
      {stations.map(([name, kw, avail], i) => (
        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0', borderTop: i > 0 ? `1px solid ${M.line}` : 'none' }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: M.green, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.45rem', fontWeight: 700, color: '#000', flexShrink: 0 }}>{i + 1}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.58rem', fontWeight: 700, color: M.text }}>{name}</div>
            <div style={{ fontSize: '0.5rem', color: M.dim }}>⚡ {kw} · <span style={{ color: M.green }}>{avail} avail.</span></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ThumbSearch() {
  const M = { bg: '#0f1117', card: '#1a1d27', line: '#2a2a3a', text: '#e2e8f0', dim: '#94a3b8', muted: '#64748b', blue: '#93c5fd', green: '#86efac', orange: '#fdba74' };
  const results = [["Gianni's", '0.3 km'], ['Pizza Napoli', '0.7 km'], ['La Cucina', '1.1 km']];
  return (
    <div style={{ background: M.bg, borderRadius: 8, overflow: 'hidden', height: '100%' }}>
      <div style={{ padding: '7px 10px', background: M.card, display: 'flex', alignItems: 'center', gap: 6, borderBottom: `1px solid ${M.line}` }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={M.dim} strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <span style={{ fontSize: '0.58rem', color: M.muted }}>Search destination…</span>
      </div>
      <div style={{ padding: '3px 10px', background: '#0f2a1a', display: 'flex', alignItems: 'center', gap: 4 }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e' }} />
        <span style={{ fontSize: '0.5rem', color: M.green }}>3rd-party search · online</span>
      </div>
      {results.map(([name, dist], i) => (
        <div key={name} style={{ padding: '5px 10px', borderBottom: i < 2 ? `1px solid ${M.line}` : 'none', display: 'flex', gap: 7 }}>
          <div style={{ width: 18, height: 18, background: '#1e293b', borderRadius: 4, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={M.blue} strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div>
            <div style={{ fontSize: '0.58rem', fontWeight: 600, color: M.text }}>{name}</div>
            <div style={{ fontSize: '0.5rem', color: M.muted }}>{dist}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ThumbNavControls() {
  const buttons = ['🔍', '⚡', '🔇', '⚙️'];
  return (
    <div style={{ background: '#0c1318', borderRadius: 8, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#1a2535,#0f1a28)' }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 140" fill="none">
          <path d="M10 80 Q60 50 100 80 T190 70" stroke="#e2001a" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
          <path d="M10 80 Q60 50 100 80 T190 70" stroke="rgba(226,0,26,0.15)" strokeWidth="8" strokeLinecap="round"/>
          <circle cx="100" cy="78" r="4" fill="#e2001a" opacity="0.9"/>
          <circle cx="100" cy="78" r="8" fill="rgba(226,0,26,0.2)"/>
        </svg>
      </div>
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 28, background: 'rgba(0,0,0,0.55)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, borderRight: '1px solid rgba(255,255,255,0.08)' }}>
        {buttons.map(b => (
          <div key={b} style={{ width: 20, height: 20, borderRadius: 4, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem' }}>{b}</div>
        ))}
      </div>
    </div>
  );
}

function ThumbAI() {
  const M = { bg: '#0d1117', card: '#1c2333', line: '#21262d', blue: '#58a6ff', green: '#3fb950', purple: '#a78bfa', dim: '#8b949e' };
  const boxes = [
    { x: 5, y: 30, w: 55, h: 34, label: 'Vehicle BMS', color: M.purple },
    { x: 72, y: 22, w: 55, h: 50, label: 'Nav SDK', color: M.blue },
    { x: 142, y: 8, w: 50, h: 32, label: 'LDEVR', color: M.green },
    { x: 142, y: 52, w: 50, h: 32, label: 'EV Search', color: M.green },
  ];
  return (
    <div style={{ background: M.bg, borderRadius: 8, overflow: 'hidden', height: '100%', padding: 8 }}>
      <div style={{ fontSize: '0.55rem', color: M.dim, marginBottom: 6 }}>TAIA — system architecture</div>
      <svg viewBox="0 0 200 100" style={{ width: '100%', height: 'auto' }}>
        {boxes.map(b => (
          <g key={b.label}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="4" fill={M.card} stroke={b.color} strokeWidth="1" strokeOpacity="0.7"/>
            <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 3} textAnchor="middle" fontSize="7" fontWeight="600" fontFamily="system-ui" fill={b.color}>{b.label}</text>
          </g>
        ))}
        <line x1="60" y1="47" x2="70" y2="47" stroke={M.dim} strokeWidth="1" markerEnd="url(#a2)"/>
        <line x1="127" y1="38" x2="140" y2="30" stroke={M.dim} strokeWidth="1" markerEnd="url(#a2)"/>
        <line x1="127" y1="56" x2="140" y2="64" stroke={M.dim} strokeWidth="1" markerEnd="url(#a2)"/>
        <defs><marker id="a2" markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto"><path d="M0,0 L4,2 L0,4 Z" fill={M.dim}/></marker></defs>
      </svg>
    </div>
  );
}

function ThumbRoute() {
  const M = { bg: '#0d1117', card: '#161b22', line: '#21262d', text: '#e6edf3', dim: '#8b949e', blue: '#58a6ff', red: '#f85149' };
  return (
    <div style={{ background: M.bg, borderRadius: 8, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.58rem', fontWeight: 700, color: M.text, marginBottom: 2 }}>Routes</div>
      <div style={{ fontSize: '0.5rem', color: M.dim, marginBottom: 8 }}>9 hr 28 min · 679 km · <span style={{ color: M.red }}>⚡ 1 min</span></div>
      {[
        { label: '📍 Current location', type: 'origin' },
        { leg: '50 min · 54 km' },
        { label: '🔌 bp pulse', sub: '21% → 46% · 400 kW · 20 min', type: 'stop' },
        { leg: '53 min · 104 km' },
        { label: '🔌 Fastned', sub: '15% → 40% · 350 kW · 25 min', type: 'stop' },
      ].map((s, i) => s.leg ? (
        <div key={i} style={{ fontSize: '0.48rem', color: M.dim, paddingLeft: 12, marginBottom: 3 }}>— {s.leg}</div>
      ) : s.type === 'origin' ? (
        <div key={i} style={{ fontSize: '0.52rem', color: M.dim, marginBottom: 3 }}>{s.label}</div>
      ) : (
        <div key={i} style={{ background: M.card, borderRadius: 4, padding: '4px 6px', marginBottom: 4, border: `1px solid ${M.line}` }}>
          <div style={{ fontSize: '0.54rem', fontWeight: 700, color: M.text }}>{s.label}</div>
          <div style={{ fontSize: '0.46rem', color: M.dim }}>{s.sub}</div>
        </div>
      ))}
    </div>
  );
}

function ThumbColour() {
  const swatches = ['#e2001a', '#ff6b6b', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#1a1a2e', '#f0f0f0'];
  return (
    <div style={{ background: '#f8f8f8', borderRadius: 8, overflow: 'hidden', height: '100%', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {swatches.map(c => <div key={c} style={{ width: 22, height: 22, borderRadius: 5, background: c, border: '1px solid rgba(0,0,0,0.06)' }} />)}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {[['Brand', '#e2001a'], ['Surface', '#1a1a2e'], ['Action', '#60a5fa']].map(([label, color]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: color, flexShrink: 0 }} />
            <span style={{ fontSize: '0.55rem', color: '#444', fontWeight: 600 }}>{label}</span>
            <span style={{ fontSize: '0.5rem', color: '#999', fontFamily: 'monospace' }}>{color}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ThumbHorizonPanel() {
  return (
    <div style={{ background: '#0c1318', borderRadius: 8, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#1a2535,#0f1a28)' }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 130" fill="none">
          <path d="M10 75 Q55 50 100 72 T190 65" stroke="#e2001a" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
          <path d="M50 0 L52 130" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
          <circle cx="102" cy="70" r="4" fill="#e2001a" opacity="0.8"/>
        </svg>
      </div>
      {/* Composed horizon panel (right-aligned) */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 72, background: 'rgba(15,26,40,0.92)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column' }}>
        {/* NIP */}
        <div style={{ background: '#1a3d2b', padding: '7px 8px', display: 'flex', alignItems: 'center', gap: 5, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ fontSize: '0.9rem', color: 'white' }}>↖</span>
          <div>
            <div style={{ fontSize: '0.55rem', fontWeight: 700, color: 'white' }}>1.2 mi</div>
            <div style={{ fontSize: '0.42rem', color: 'rgba(255,255,255,0.55)' }}>Oak St N</div>
          </div>
        </div>
        {/* Upcoming */}
        <div style={{ flex: 1, padding: '6px 8px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '0.38rem', color: '#64748b', marginBottom: 4, letterSpacing: '0.05em' }}>UPCOMING</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {['🚧','⛽','☕'].map(e => <span key={e} style={{ fontSize: '0.55rem' }}>{e}</span>)}
          </div>
        </div>
        {/* ETA */}
        <div style={{ padding: '5px 8px', display: 'flex', justifyContent: 'space-between' }}>
          {[['14:32','ETA'],['18m','Time'],['6.4','km']].map(([v,l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.5rem', fontWeight: 700, color: '#e2e8f0' }}>{v}</div>
              <div style={{ fontSize: '0.38rem', color: '#64748b' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ThumbCluster() {
  // Mini lane arrows
  const LANES = [
    { r: false }, { r: false }, { r: false }, { r: false },
    { r: true  }, { r: true  },
  ];
  return (
    <div style={{ background: '#060608', borderRadius: 8, overflow: 'hidden', height: '100%', display: 'flex', alignItems: 'center', gap: 4, padding: '0 6px' }}>
      {/* Mini speedometer */}
      <svg viewBox="0 0 60 60" style={{ width: 52, height: 52, flexShrink: 0 }}>
        <circle cx="30" cy="34" r="22" fill="none" stroke="#1e1e22" strokeWidth="4"
          strokeDasharray="115 38" strokeDashoffset="-19" strokeLinecap="round"/>
        <circle cx="30" cy="34" r="22" fill="none" stroke="#e2001a" strokeWidth="4"
          strokeDasharray="72 81" strokeDashoffset="-19" strokeLinecap="round"/>
        <text x="30" y="38" textAnchor="middle" fill="white"
          style={{ fontSize: 11, fontWeight: 700, fontFamily: 'system-ui' }}>72</text>
        <text x="30" y="46" textAnchor="middle" fill="#555"
          style={{ fontSize: 5, fontFamily: 'system-ui' }}>km/h</text>
      </svg>

      {/* Nav column */}
      <div style={{ flex: 1, height: 80, display: 'flex', flexDirection: 'column', borderRadius: 5, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Map strip */}
        <div style={{ flex: 1, background: '#0c1520', position: 'relative', overflow: 'hidden' }}>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 80 40" fill="none">
            <path d="M0 22 Q20 16 40 22 T80 18" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5"/>
            <path d="M0 22 Q20 16 40 22 T80 18" stroke="#e2001a" strokeWidth="2" opacity="0.7"/>
            <circle cx="40" cy="21" r="3" fill="#e2001a" opacity="0.8"/>
          </svg>
        </div>
        {/* NIP */}
        <div style={{ background: 'rgba(22,50,80,0.97)', padding: '3px 6px', display: 'flex', alignItems: 'center', gap: 4, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <svg width="8" height="8" viewBox="0 0 20 20" fill="rgba(255,255,255,0.9)">
            <path d="M3 20 L3 10 Q3 3 10 3 L15 3 L11.5 0 L20 0 L20 8 L16.5 5 Q13 5 13 10 L13 20 Z"/>
          </svg>
          <span style={{ fontSize: '0.46rem', fontWeight: 700, color: 'white' }}>600 m</span>
          <span style={{ fontSize: '0.38rem', color: 'rgba(255,255,255,0.45)', overflow: 'hidden', whiteSpace: 'nowrap' }}>Canary Wharf</span>
        </div>
        {/* SLG lane arrows */}
        <div style={{ background: 'rgba(14,32,54,0.97)', padding: '3px 6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {LANES.map((l, i) => (
            <svg key={i} width="5" height="8" viewBox="0 0 10 16"
              fill={l.r ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.25)'}>
              <polygon points="5,0 10,5.5 7,5.5 7,16 3,16 3,5.5 0,5.5"/>
            </svg>
          ))}
        </div>
        {/* ETA */}
        <div style={{ background: 'rgba(6,14,28,0.98)', padding: '3px 6px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <span style={{ fontSize: '0.44rem', fontWeight: 700, color: 'rgba(255,255,255,0.75)' }}>10:59 PM</span>
          <span style={{ fontSize: '0.38rem', color: 'rgba(255,255,255,0.3)', marginLeft: 3 }}>· 26.5 km</span>
        </div>
      </div>

      {/* Mini battery gauge */}
      <svg viewBox="0 0 60 60" style={{ width: 52, height: 52, flexShrink: 0 }}>
        <circle cx="30" cy="34" r="22" fill="none" stroke="#1e1e22" strokeWidth="4"
          strokeDasharray="115 38" strokeDashoffset="-19" strokeLinecap="round"/>
        <circle cx="30" cy="34" r="22" fill="none" stroke="#22c55e" strokeWidth="4"
          strokeDasharray="85 68" strokeDashoffset="-19" strokeLinecap="round"/>
        <text x="30" y="37" textAnchor="middle" fill="#22c55e"
          style={{ fontSize: 9, fontWeight: 700, fontFamily: 'system-ui' }}>74%</text>
        <text x="30" y="46" textAnchor="middle" fill="#555"
          style={{ fontSize: 4.5, fontFamily: 'system-ui' }}>BATT</text>
      </svg>
    </div>
  );
}

function ThumbHomeScreen() {
  return (
    <div style={{ background: '#0c1318', borderRadius: 8, overflow: 'hidden', height: '100%', position: 'relative' }}>
      {/* Map background */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#1a2535,#0f1a28)' }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 200 130" fill="none">
          <path d="M10 60 Q55 40 100 62 T190 55" stroke="#e2001a" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
          <path d="M0 80 Q50 55 100 80 T200 72" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5"/>
          <path d="M50 0 L52 130" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
          <path d="M140 0 L135 130" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
        </svg>
      </div>
      {/* Nav area outline (amber) */}
      <div style={{ position: 'absolute', inset: 8, border: '1.5px dashed rgba(245,158,11,0.55)', borderRadius: 4 }} />
      {/* Map safe area (blue) */}
      <div style={{ position: 'absolute', top: 16, left: 16, right: 40, bottom: 30, border: '1.5px dashed rgba(59,130,246,0.5)', borderRadius: 3 }} />
      {/* Controls zone (red) */}
      <div style={{ position: 'absolute', bottom: 14, left: 16, right: 16, height: 22, border: '1.5px dashed rgba(226,0,26,0.6)', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        {['🔍','⚡','🔇','⚙️'].map(b => (
          <div key={b} style={{ width: 14, height: 14, borderRadius: 3, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.45rem' }}>{b}</div>
        ))}
      </div>
      {/* Zone legend */}
      <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {[['#f59e0b','Nav area'],['#3b82f6','Safe area'],['#e2001a','Controls']].map(([c,l]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <div style={{ width: 6, height: 6, borderRadius: 1, background: c, opacity: 0.85 }} />
            <span style={{ fontSize: '0.44rem', color: 'rgba(255,255,255,0.5)' }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Feature card ──────────────────────────────────────────────────────────── */
function FeatureCard({ id, label, desc, group, Thumb, onNavigate }) {
  return (
    <div
      onClick={() => onNavigate(id)}
      style={{ cursor: 'pointer', borderRadius: 10, border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--white)', transition: 'box-shadow 0.15s, border-color 0.15s', display: 'flex', flexDirection: 'column' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'; e.currentTarget.style.borderColor = 'var(--red)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      {/* Thumbnail */}
      <div style={{ height: 130, background: '#0d1117', overflow: 'hidden', padding: 10, flexShrink: 0 }}>
        <Thumb />
      </div>
      {/* Text */}
      <div style={{ padding: '12px 14px', flex: 1 }}>
        <div style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: 4 }}>{group}</div>
        <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--black)', marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.5 }}>{desc}</div>
      </div>
    </div>
  );
}

/* ─── Simple text card for placeholder pages ────────────────────────────────── */
function TextCard({ id, label, desc, onNavigate }) {
  return (
    <div
      onClick={() => onNavigate(id)}
      style={{ cursor: 'pointer', borderRadius: 10, border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--white)', transition: 'box-shadow 0.15s, border-color 0.15s', display: 'flex', flexDirection: 'column' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'; e.currentTarget.style.borderColor = 'var(--red)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      <div style={{ height: 130, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>
        </svg>
      </div>
      <div style={{ padding: '12px 14px', flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--black)', marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.5 }}>{desc}</div>
      </div>
    </div>
  );
}

/* ─── Section data (IDs + Thumbs only; labels/descs resolved via i18n) ─────── */
const FEATURED_IDS = [
  { id: 'ev',                  Thumb: ThumbEV },
  { id: 'cluster',             Thumb: ThumbCluster },
  { id: 'search-engine',       Thumb: ThumbSearch },
  { id: 'nav-controls',        Thumb: ThumbNavControls },
  { id: 'ai-overview',         Thumb: ThumbAI },
  { id: 'horizon-panel',       Thumb: ThumbHorizonPanel },
  { id: 'colour',              Thumb: ThumbColour },
  { id: 'home-screen-layout',  Thumb: ThumbHomeScreen },
];

const ALL_SECTION_KEYS = [
  { groupKey: 'Assets',              items: ['design-tokens', 'colour', 'font', 'corner-radius'] },
  { groupKey: 'App Customisation',   items: ['home-screen-layout', 'search-engine', 'nav-controls', 'horizon-panel', 'instruction-panel', 'eta-panel', 'route-bar'] },
  { groupKey: 'TomTom AI Assistant', items: ['ai-overview', 'voice-engine', 'speech-to-text', 'ai-config'] },
  { groupKey: 'Vehicle Integration', items: ['cluster', 'ev', 'truck'] },
];

/* ─── Page ──────────────────────────────────────────────────────────────────── */
export default function Overview({ onNavigate }) {
  const { t } = useTranslation('overview');

  const featured = FEATURED_IDS.map(({ id, Thumb }) => ({
    id, Thumb,
    label: t(`featured.${id}.label`),
    desc:  t(`featured.${id}.desc`),
    group: t(`featured.${id}.group`),
  }));

  const allSections = ALL_SECTION_KEYS.map(({ groupKey, items }) => ({
    group: t(`sections.${groupKey}`),
    items: items.map(id => ({
      id,
      label: t(`allSections.${id}.label`),
    })),
  }));

  const capabilities = [
    { icon: '🗺', key: 'map' },
    { icon: '🎨', key: 'theme' },
    { icon: '🔌', key: 'modules' },
    { icon: '📐', key: 'layouts' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>{t('title')}</h1>
        <PageActions />
      </div>
      <div className="quick-answer">{t('intro')}</div>

      {/* Hero image */}
      <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 36, background: '#0d1d2e', border: '1px solid var(--border)', position: 'relative' }}>
        <img
          src={`${import.meta.env.BASE_URL}hero.png`}
          alt="UX Library — navigation interface"
          style={{ width: '100%', display: 'block' }}
          onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
        />
        <div style={{ display: 'none', height: 260, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10, color: 'rgba(255,255,255,0.25)' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
          </svg>
          <span style={{ fontSize: '0.8rem' }}>Save your screenshot as <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>ux-library/public/hero.png</code></span>
        </div>
      </div>

      {/* What is UX Library */}
      <div className="zone">
        <h2 className="sh" id="ov-what">{t('what.heading')}</h2>
        <p className="body">{t('what.body1')}</p>
        <p className="body">{t('what.body2')}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginTop: 20 }}>
          {capabilities.map(({ icon, key }) => (
            <div key={key} style={{ padding: '14px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8 }}>
              <div style={{ fontSize: '1.3rem', marginBottom: 8 }}>{icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.84rem', marginBottom: 5, color: 'var(--black)' }}>{t(`what.capabilities.${key}.title`)}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--mid)', lineHeight: 1.55 }}>{t(`what.capabilities.${key}.body`)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured visual cards */}
      <div className="zone">
        <h2 className="sh" id="ov-explore">{t('explore.heading')}</h2>
        <p className="body" style={{ marginBottom: 20 }}>{t('explore.subheading')}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14, marginBottom: 36 }}>
          {featured.map(card => (
            <FeatureCard key={card.id} {...card} onNavigate={onNavigate} />
          ))}
        </div>

      </div>

      <Callout type="info">{t('callout')}</Callout>
    </div>
  );
}
