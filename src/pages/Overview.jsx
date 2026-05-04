import { useTranslation } from 'react-i18next';
import Callout from '../components/ui/Callout';
import PageActions from '../components/ui/PageActions';

/* ─── Cross-link helpers ─────────────────────────────────────────────────────── */
function DocLink({ pageId, productId, onNavigate, children }) {
  return (
    <button
      onClick={() => onNavigate?.(pageId, productId)}
      style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer', color: 'var(--red)', textDecoration: 'underline', font: 'inherit', fontSize: 'inherit', lineHeight: 'inherit' }}
    >
      {children}
    </button>
  );
}

function WhenCard({ icon, title, children }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '12px 14px', background: 'var(--surface)' }}>
      <div style={{ display: 'flex', gap: 7, alignItems: 'flex-start', marginBottom: 4 }}>
        <span style={{ fontSize: '0.9rem', lineHeight: 1.2 }}>{icon}</span>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--black)' }}>{title}</span>
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}

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
  const M = { bg: '#0d1117', card: '#1c2333', line: '#21262d', purple: '#a78bfa', green: '#3fb950', dim: '#8b949e' };
  const bars = [3, 5, 8, 10, 7, 9, 6, 8, 5, 3, 7, 4];
  return (
    <div style={{ background: M.bg, borderRadius: 8, overflow: 'hidden', height: '100%', padding: '8px 10px' }}>
      <div style={{ fontSize: '0.55rem', color: M.dim, marginBottom: 8 }}>TAIA — in-vehicle voice</div>
      {/* Listening indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#2d1f4a', border: `1px solid ${M.purple}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="9" height="9" viewBox="0 0 24 24" fill={M.purple}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke={M.purple} strokeWidth="2.5" fill="none"/></svg>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {bars.map((h, i) => (
            <div key={i} style={{ width: 2.5, height: h, borderRadius: 2, background: M.purple, opacity: 0.6 + (i % 4) * 0.1 }}/>
          ))}
        </div>
      </div>
      {/* User utterance */}
      <div style={{ background: '#2d1f4a', borderRadius: '6px 6px 6px 2px', padding: '4px 8px', marginBottom: 6, maxWidth: '88%' }}>
        <div style={{ fontSize: '0.5rem', color: '#d4bbff', lineHeight: 1.4 }}>"Take me to the nearest fast charger"</div>
      </div>
      {/* AI response */}
      <div style={{ background: M.card, borderRadius: '6px 6px 2px 6px', padding: '4px 8px', marginLeft: 'auto', maxWidth: '88%', border: `1px solid ${M.line}` }}>
        <div style={{ fontSize: '0.44rem', color: M.green, marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>NAVIGATE_TO_EV_CHARGING</div>
        <div style={{ fontSize: '0.5rem', color: M.dim }}>Ionity · 4.2 km · Route set ✓</div>
      </div>
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

function ThumbMapStyle() {
  return (
    <div style={{ background: '#0c1318', borderRadius: 8, overflow: 'hidden', height: '100%', position: 'relative' }}>
      {/* Day half */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: '50%', overflow: 'hidden' }}>
        <svg style={{ width: '200%', height: '100%' }} viewBox="0 0 200 130" fill="none">
          <rect width="200" height="130" fill="#e8e0d5"/>
          <rect x="0" y="0" width="200" height="130" fill="#e8e0d5"/>
          <path d="M0 70 Q50 58 100 70 T200 62" stroke="#cfc9bf" strokeWidth="5" strokeLinecap="round"/>
          <path d="M0 70 Q50 58 100 70 T200 62" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <path d="M48 0 L50 130" stroke="#cfc9bf" strokeWidth="4"/>
          <path d="M48 0 L50 130" stroke="white" strokeWidth="1.5"/>
          <path d="M0 55 Q50 44 100 55 T200 48" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" opacity="0.85"/>
          <rect x="8" y="18" width="34" height="24" rx="2" fill="#d8d0c4"/>
          <rect x="56" y="30" width="16" height="18" rx="2" fill="#d8d0c4"/>
          <rect x="76" y="12" width="22" height="28" rx="2" fill="#d8d0c4"/>
        </svg>
      </div>
      {/* Night half */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', right: 0, overflow: 'hidden' }}>
        <svg style={{ width: '200%', height: '100%', marginLeft: '-100%' }} viewBox="0 0 200 130" fill="none">
          <rect width="200" height="130" fill="#1a2535"/>
          <path d="M0 70 Q50 58 100 70 T200 62" stroke="#263040" strokeWidth="5" strokeLinecap="round"/>
          <path d="M0 70 Q50 58 100 70 T200 62" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeLinecap="round"/>
          <path d="M48 0 L50 130" stroke="#263040" strokeWidth="4"/>
          <path d="M48 0 L50 130" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5"/>
          <path d="M0 55 Q50 44 100 55 T200 48" stroke="#e2001a" strokeWidth="2.5" strokeLinecap="round" opacity="0.75"/>
          <rect x="8" y="18" width="34" height="24" rx="2" fill="#223044"/>
          <rect x="56" y="30" width="16" height="18" rx="2" fill="#223044"/>
          <rect x="76" y="12" width="22" height="28" rx="2" fill="#223044"/>
        </svg>
      </div>
      {/* Divider */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1.5, background: 'rgba(255,255,255,0.25)', zIndex: 1 }}/>
      {/* Labels */}
      <div style={{ position: 'absolute', bottom: 7, left: 8, fontSize: '0.42rem', fontWeight: 700, color: 'rgba(0,0,0,0.45)', letterSpacing: '0.06em' }}>DAY</div>
      <div style={{ position: 'absolute', bottom: 7, right: 8, fontSize: '0.42rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em' }}>NIGHT</div>
      {/* Traffic legend */}
      <div style={{ position: 'absolute', top: 7, left: 8, display: 'flex', alignItems: 'center', gap: 3 }}>
        <div style={{ width: 12, height: 3, borderRadius: 2, background: '#22c55e' }}/>
        <span style={{ fontSize: '0.4rem', color: 'rgba(0,0,0,0.4)', fontWeight: 600 }}>Free flow</span>
      </div>
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

/* ─── Use-case Thumb components ─────────────────────────────────────────────── */

function ThumbETAPanel() {
  return (
    <div style={{ background: '#0c1318', borderRadius: 8, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#0f1a28,#1a2535)' }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 130" fill="none">
          <path d="M10 75 Q60 55 100 72 T190 65" stroke="#e2001a" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
          <circle cx="102" cy="70" r="4" fill="#e2001a" opacity="0.8"/>
          <circle cx="102" cy="70" r="8" fill="rgba(226,0,26,0.18)"/>
        </svg>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(8,14,26,0.96)', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '9px 14px' }}>
        <div style={{ fontSize: '0.38rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>ETA PANEL</div>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {[['14:32', 'ETA'], ['18 min', 'Remaining'], ['6.4 km', 'Distance']].map(([val, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0', lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: '0.42rem', color: '#475569', marginTop: 3, letterSpacing: '0.04em' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ThumbTheming() {
  const M = { bg: '#0d1117', card: '#1c2333', line: '#21262d', dim: '#8b949e' };
  const tokens = [
    { name: '--brand-primary',  from: '#e2001a', to: '#0066cc', color: true },
    { name: '--corner-radius',  from: '4 dp',    to: '12 dp',   color: false },
    { name: '--font-family',    from: 'Roboto',  to: 'Inter',   color: false },
  ];
  return (
    <div style={{ background: M.bg, borderRadius: 8, overflow: 'hidden', height: '100%', padding: '10px 12px' }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: M.dim, marginBottom: 9, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Token override</div>
      {tokens.map(({ name, from, to, color }) => (
        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
          {color
            ? <div style={{ width: 26, height: 14, borderRadius: 3, background: from, flexShrink: 0 }} />
            : <div style={{ width: 26, height: 14, borderRadius: 3, background: M.card, border: `1px solid ${M.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '0.4rem', color: '#e2001a', fontFamily: 'monospace' }}>{from}</span>
              </div>}
          <span style={{ fontSize: '0.44rem', color: M.dim, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>{name}</span>
          <span style={{ fontSize: '0.6rem', color: '#374151' }}>→</span>
          {color
            ? <div style={{ width: 26, height: 14, borderRadius: 3, background: to, flexShrink: 0 }} />
            : <div style={{ width: 26, height: 14, borderRadius: 3, background: M.card, border: `1px solid ${M.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '0.4rem', color: '#0066cc', fontFamily: 'monospace' }}>{to}</span>
              </div>}
        </div>
      ))}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
        <div style={{ padding: '4px 10px', borderRadius: 4, background: '#e2001a', fontSize: '0.48rem', color: '#fff', fontWeight: 700 }}>Default</div>
        <span style={{ fontSize: '0.65rem', color: '#374151' }}>→</span>
        <div style={{ padding: '4px 10px', borderRadius: 12, background: '#0066cc', fontSize: '0.48rem', color: '#fff', fontWeight: 700 }}>OEM Brand</div>
      </div>
    </div>
  );
}

function ThumbChargingSearch() {
  const M = { bg: '#0d1117', card: '#161b22', line: '#21262d', text: '#e6edf3', dim: '#8b949e', blue: '#58a6ff', green: '#3fb950' };
  return (
    <div style={{ background: M.bg, borderRadius: 8, overflow: 'hidden', height: '100%', padding: '8px 10px' }}>
      <div style={{ fontSize: '0.52rem', fontWeight: 700, color: M.text, marginBottom: 2 }}>EV Charging</div>
      <div style={{ fontSize: '0.46rem', color: M.green, marginBottom: 7 }}>Near you · Connector matched</div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
        {['⚡ Speed', '💳 Payment', '🍴 Services'].map((f, i) => (
          <span key={f} style={{ fontSize: '0.46rem', padding: '2px 5px', borderRadius: 4, background: i === 0 ? M.blue : M.card, color: i === 0 ? '#fff' : M.dim, border: `1px solid ${i === 0 ? M.blue : M.line}` }}>{f}</span>
        ))}
      </div>
      {[['Ionity', '350 kW', '3/4'], ['Fastned', '300 kW', '2/4'], ['bp pulse', '50 kW', '5/6']].map(([name, kw, avail], i) => (
        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '4px 0', borderTop: i > 0 ? `1px solid ${M.line}` : 'none' }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: M.green, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.42rem', fontWeight: 700, color: '#000', flexShrink: 0 }}>{i+1}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.54rem', fontWeight: 700, color: M.text }}>{name}</div>
            <div style={{ fontSize: '0.46rem', color: M.dim }}>⚡ {kw}</div>
          </div>
          <span style={{ fontSize: '0.46rem', color: M.green }}>{avail}</span>
        </div>
      ))}
    </div>
  );
}

function ThumbConversationPersonality() {
  const M = { bg: '#0d1117', card: '#1c2333', line: '#21262d', purple: '#a78bfa', dim: '#8b949e', text: '#e6edf3' };
  return (
    <div style={{ background: M.bg, borderRadius: 8, overflow: 'hidden', height: '100%', padding: '8px 10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#1a1a4a', border: `1.5px solid ${M.purple}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', flexShrink: 0 }}>✦</div>
        <span style={{ fontSize: '0.58rem', fontWeight: 700, color: M.text }}>BMW Assistant</span>
        <span style={{ fontSize: '0.4rem', color: M.purple, marginLeft: 'auto' }}>Custom name ✓</span>
      </div>
      <div style={{ background: M.card, borderRadius: '4px 10px 10px 4px', padding: '4px 8px', marginBottom: 6, maxWidth: '92%' }}>
        <div style={{ fontSize: '0.4rem', color: M.dim, marginBottom: 1 }}>Default TomTom tone</div>
        <div style={{ fontSize: '0.48rem', color: '#94a3b8', lineHeight: 1.35 }}>"Route updated. New ETA in 18 minutes."</div>
      </div>
      <div style={{ background: '#1a1a4a', borderRadius: '10px 4px 10px 10px', padding: '4px 8px', marginLeft: 'auto', maxWidth: '92%', border: `1px solid ${M.purple}44` }}>
        <div style={{ fontSize: '0.4rem', color: M.purple, marginBottom: 1 }}>OEM branded tone</div>
        <div style={{ fontSize: '0.48rem', color: '#d4bbff', lineHeight: 1.35 }}>"Recalculating — you'll still arrive on time, Chris."</div>
      </div>
    </div>
  );
}

function ThumbADAS() {
  const lanes = [false, false, true, true, false];
  return (
    <div style={{ background: '#060608', borderRadius: 8, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#0a1420 0%,#101820 100%)' }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 130" fill="none">
          <path d="M0 130 L55 58 L145 58 L200 130 Z" fill="#151a26" opacity="0.9"/>
          {[65, 85, 100, 115, 135].map((x, i) => (
            <line key={i} x1={x} y1={58} x2={i === 0 ? 0 : i === 4 ? 200 : x + (i - 2) * 12} y2={130} stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="5 5"/>
          ))}
          <path d="M100 75 L100 120" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="3 5"/>
        </svg>
      </div>
      <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 6 }}>
        {lanes.map((active, i) => (
          <svg key={i} width="13" height="20" viewBox="0 0 13 20">
            <rect x="4.5" y="7" width="4" height="11" rx="1" fill={active ? '#e2001a' : 'rgba(255,255,255,0.15)'}/>
            <polygon points="6.5,0 13,8 9.5,8 9.5,7 3.5,7 3.5,8 0,8" fill={active ? '#e2001a' : 'rgba(255,255,255,0.15)'}/>
          </svg>
        ))}
      </div>
      <div style={{ position: 'absolute', top: 8, left: 10, right: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'white', border: '3px solid #e2001a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.52rem', fontWeight: 800, color: '#111' }}>100</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'white' }}>600 m</div>
          <div style={{ fontSize: '0.38rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Lane change</div>
        </div>
      </div>
    </div>
  );
}

/* ─── Domain card ────────────────────────────────────────────────────────────── */
function DomainCard({ id, label, desc, pages, Thumb, onNavigate }) {
  return (
    <div
      onClick={() => onNavigate(id)}
      style={{ cursor: 'pointer', borderRadius: 10, border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--white)', transition: 'box-shadow 0.15s, border-color 0.15s', display: 'flex', flexDirection: 'column' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'; e.currentTarget.style.borderColor = 'var(--red)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      <div style={{ height: 130, background: '#0d1117', overflow: 'hidden', padding: 10, flexShrink: 0 }}>
        <Thumb />
      </div>
      <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--black)', marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.5, marginBottom: 10, flex: 1 }}>{desc}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {pages.map(p => (
            <span key={p} style={{ fontSize: '0.64rem', padding: '2px 7px', borderRadius: 4, background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--mid)', whiteSpace: 'nowrap' }}>{p}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Domain data (one card per nav group, in nav order) ─────────────────────── */
const DOMAIN_CARDS = [
  { id: 'assets',              key: 'assets',             Thumb: ThumbColour,
    pages: ['Colour', 'Font', 'Corner Radius', 'Icons', 'Design Tokens'] },
  { id: 'map-customisation',   key: 'mapCustomisation',   Thumb: ThumbMapStyle,
    pages: ['Map Style', 'Traffic', 'Safety Locations', 'Route', 'Map Markers'] },
  { id: 'app-customisation',   key: 'appCustomisation',   Thumb: ThumbHomeScreen,
    pages: ['Home Screen Layout', 'Search Engine', 'Nav Controls', 'Horizon Panel'] },
  { id: 'ev-charging',         key: 'evCharging',         Thumb: ThumbEV,
    pages: ['Vehicle & Battery', 'Charging Search', 'Long-Distance Routing', 'In-Navigation UI'] },
  { id: 'vehicle-integration', key: 'vehicleIntegration', Thumb: ThumbCluster,
    pages: ['Basics', 'Cluster', 'Head-Up Display', 'ADAS Integration', 'Truck Support'] },
  { id: 'ai-assistant',        key: 'aiAssistant',        Thumb: ThumbAI,
    pages: ['Overview', 'Voice Engine', 'Speech to Text', 'Configuration'] },
];

/* ─── Use-case card (thumbnail + group tag + title + desc) ──────────────────── */
function UseCaseCard({ id, label, desc, group, Thumb, onNavigate }) {
  return (
    <div
      onClick={() => onNavigate(id)}
      style={{ cursor: 'pointer', borderRadius: 10, border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--white)', transition: 'box-shadow 0.15s, border-color 0.15s', display: 'flex', flexDirection: 'column' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'; e.currentTarget.style.borderColor = 'var(--red)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      <div style={{ height: 130, background: '#0d1117', overflow: 'hidden', padding: 10, flexShrink: 0 }}>
        <Thumb />
      </div>
      <div style={{ padding: '12px 14px', flex: 1 }}>
        <div style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: 4 }}>{group}</div>
        <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--black)', marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.5 }}>{desc}</div>
      </div>
    </div>
  );
}

const USE_CASE_CARDS = [
  { id: 'home-screen-layout', key: 'homeScreenLayout', Thumb: ThumbHomeScreen },
  { id: 'eta-panel',          key: 'etaPanel',         Thumb: ThumbETAPanel },
  { id: 'search-engine',      key: 'searchEngine',     Thumb: ThumbSearch },
  { id: 'theming',            key: 'theming',          Thumb: ThumbTheming },
  { id: 'ev-charging-search', key: 'evChargingSearch', Thumb: ThumbChargingSearch },
  { id: 'cluster',            key: 'cluster',          Thumb: ThumbCluster },
  { id: 'ai-personality',     key: 'aiPersonality',    Thumb: ThumbConversationPersonality },
  { id: 'adas',               key: 'adas',             Thumb: ThumbADAS },
];

/* ─── Page ──────────────────────────────────────────────────────────────────── */
export default function Overview({ onNavigate }) {
  const { t } = useTranslation('overview');

  const domains = DOMAIN_CARDS.map(({ id, key, Thumb, pages }) => ({
    id, Thumb, pages,
    label: t(`domains.${key}.label`),
    desc:  t(`domains.${key}.desc`),
  }));

  const useCases = USE_CASE_CARDS.map(({ id, key, Thumb }) => ({
    id, Thumb,
    label: t(`useCases.${key}.label`),
    desc:  t(`useCases.${key}.desc`),
    group: t(`useCases.${key}.group`),
  }));

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
      </div>

      {/* When to choose UX Library */}
      <div className="zone">
        <h2 className="sh" id="ov-when">When to choose UX Library</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          <WhenCard icon="✅" title="Ready-made navigation UI">
            Complete Compose components for map display, guidance, search, ETA panel, and EV charging — no UI design from scratch.
          </WhenCard>
          <WhenCard icon="✅" title="Fully themeable">
            Override colours, typography, corner radius, and icon sets via design tokens to match your OEM brand identity.
          </WhenCard>
          <WhenCard icon="✅" title="Built on NavSDK">
            Sits directly on top of the{' '}
            <DocLink pageId="navsdk-intro" productId="navsdk" onNavigate={onNavigate}>Maps &amp; Navigation SDK</DocLink>.
            All NavSDK capabilities remain accessible beneath the component layer.
          </WhenCard>
          <WhenCard icon="✅" title="Production-tested patterns">
            Components follow the same UX patterns used in TomTom's own navigation application — proven in real vehicles.
          </WhenCard>
          <WhenCard icon="⚠️" title="Android only">
            UX Library targets Jetpack Compose on Android. iOS is not currently supported — use the{' '}
            <DocLink pageId="navsdk-intro" productId="navsdk" onNavigate={onNavigate}>Maps &amp; Navigation SDK</DocLink>{' '}
            directly on iOS.
          </WhenCard>
          <WhenCard icon="⚠️" title="TomTom UI structure">
            The component architecture follows TomTom's UX patterns. For a completely bespoke layout, build directly on the{' '}
            <DocLink pageId="navsdk-intro" productId="navsdk" onNavigate={onNavigate}>Maps &amp; Navigation SDK</DocLink>{' '}
            instead.
          </WhenCard>
        </div>
      </div>

      {/* Key use cases */}
      <div className="zone">
        <h2 className="sh" id="ov-usecases">{t('useCases.heading')}</h2>
        <p className="quick-answer" style={{ marginBottom: 20 }}>{t('useCases.subheading')}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {useCases.map(card => (
            <UseCaseCard key={card.id} {...card} onNavigate={onNavigate} />
          ))}
        </div>
      </div>

      {/* Domain cards */}
      <div className="zone">
        <h2 className="sh" id="ov-explore">{t('explore.heading')}</h2>
        <p className="quick-answer" style={{ marginBottom: 20 }}>{t('explore.subheading')}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14, marginBottom: 36 }}>
          {domains.map(card => (
            <DomainCard key={card.id} {...card} onNavigate={onNavigate} />
          ))}
        </div>
      </div>

      <Callout type="info">{t('callout')}</Callout>
    </div>
  );
}
