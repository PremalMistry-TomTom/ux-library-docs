/* ─────────────────────────────────────────────────────────────────────────────
 * IconStyleSandbox — Phase 1 exploration of iconographic illustration style.
 * Dark field + bold palette-tied SVG symbol per card.
 * Plumbing / internal — not shipped to users.
 * ───────────────────────────────────────────────────────────────────────────── */
import { useState } from 'react';
import { useIlloStyle, THEMES } from '../context/IlloStyleContext';
import { COLOUR_FAMILIES } from './IntroIllustrations';

/* ═══════════════════════════════════════════════════════════════════════════════
   ICON COMPONENTS
   Each icon receives { accent, mid, soft, dark } from the active palette.
   viewBox: 0 0 200 130 — same as existing illustrations.
   Treatment: dark.field bg · accent primary · rgba white for structure
   ═══════════════════════════════════════════════════════════════════════════════ */

function IcoHomeScreen({ C }) {
  /* Screen with header bar + grid of zones */
  return (
    <svg viewBox="0 0 200 130" fill="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="200" height="130" fill={C.field} />
      {/* Screen bezel */}
      <rect x="28" y="18" width="144" height="94" rx="8" fill={C.panel} stroke={C.ring} strokeWidth="1.5" />
      {/* Top bar */}
      <rect x="28" y="18" width="144" height="22" rx="8" fill={C.accent} />
      <rect x="28" y="30" width="144" height="10" fill={C.accent} />
      {/* Map zone */}
      <rect x="36" y="48" width="88" height="56" rx="4" fill={C.zone} />
      {/* Map road */}
      <path d="M36 76 Q80 68 124 76" stroke={C.accent} strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      <circle cx="80" cy="72" r="4" fill={C.accent} />
      {/* Side panel */}
      <rect x="132" y="48" width="32" height="16" rx="3" fill={C.chip} />
      <rect x="132" y="70" width="32" height="16" rx="3" fill={C.chip} />
      <rect x="132" y="92" width="32" height="12" rx="3" fill={C.chip} opacity="0.5" />
    </svg>
  );
}

function IcoETA({ C }) {
  /* Progress ring — clock + arc */
  const r = 38;
  const cx = 100, cy = 65;
  const circumference = 2 * Math.PI * r;
  const filled = circumference * 0.72; // 72% fill
  return (
    <svg viewBox="0 0 200 130" fill="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="200" height="130" fill={C.field} />
      {/* Glow */}
      <circle cx={cx} cy={cy} r={r + 14} fill={C.glow} />
      {/* Track ring */}
      <circle cx={cx} cy={cy} r={r} stroke={C.ring} strokeWidth="6" />
      {/* Progress arc */}
      <circle
        cx={cx} cy={cy} r={r}
        stroke={C.accent} strokeWidth="6"
        strokeDasharray={`${filled} ${circumference}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      {/* Center text placeholder */}
      <rect x="84" y="56" width="32" height="8" rx="2" fill={C.accent} opacity="0.9" />
      <rect x="88" y="70" width="24" height="5" rx="2" fill={C.chip} opacity="0.6" />
      {/* Tick marks */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const rad = (deg - 90) * Math.PI / 180;
        const x1 = cx + (r + 6) * Math.cos(rad);
        const y1 = cy + (r + 6) * Math.sin(rad);
        const x2 = cx + (r + 11) * Math.cos(rad);
        const y2 = cy + (r + 11) * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.ring} strokeWidth="1.5" />;
      })}
    </svg>
  );
}

function IcoSearch({ C }) {
  /* Bold magnifier — large centered */
  return (
    <svg viewBox="0 0 200 130" fill="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="200" height="130" fill={C.field} />
      {/* Glow */}
      <circle cx="90" cy="58" r="44" fill={C.glow} />
      {/* Glass body */}
      <circle cx="90" cy="58" r="30" stroke={C.ring} strokeWidth="3" />
      {/* Accent inner ring */}
      <circle cx="90" cy="58" r="30" stroke={C.accent} strokeWidth="5" strokeOpacity="0.9" />
      {/* Handle */}
      <line x1="112" y1="80" x2="134" y2="104" stroke={C.accent} strokeWidth="8" strokeLinecap="round" />
      {/* Inner highlight — small dot */}
      <circle cx="82" cy="50" r="6" fill="rgba(255,255,255,0.12)" />
    </svg>
  );
}

function IcoTheming({ C }) {
  /* Three overlapping circles — color palette metaphor */
  return (
    <svg viewBox="0 0 200 130" fill="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="200" height="130" fill={C.field} />
      {/* Circle 1 — top-left */}
      <circle cx="80" cy="52" r="32" fill={C.accent} fillOpacity="0.85" />
      {/* Circle 2 — top-right */}
      <circle cx="120" cy="52" r="32" fill={C.mid} fillOpacity="0.6" />
      {/* Circle 3 — bottom-center */}
      <circle cx="100" cy="84" r="32" fill={C.soft} fillOpacity="0.45" />
      {/* Center overlap glow */}
      <circle cx="100" cy="65" r="14" fill="rgba(255,255,255,0.15)" />
    </svg>
  );
}

function IcoEVSearch({ C }) {
  /* Pin shape with bolt inside */
  return (
    <svg viewBox="0 0 200 130" fill="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="200" height="130" fill={C.field} />
      {/* Pin shadow/glow */}
      <ellipse cx="100" cy="108" rx="16" ry="5" fill={C.glow} />
      {/* Pin body */}
      <path d="M100 18 C76 18 58 36 58 58 C58 84 100 108 100 108 C100 108 142 84 142 58 C142 36 124 18 100 18 Z"
        fill={C.accent} />
      {/* Pin inner circle */}
      <circle cx="100" cy="56" r="18" fill={C.field} fillOpacity="0.85" />
      {/* Bolt inside pin */}
      <polygon points="105,40 93,56 102,56 95,74 107,56 98,56"
        fill={C.accent} />
    </svg>
  );
}

function IcoCluster({ C }) {
  /* Speedometer arc with needle */
  const cx = 100, cy = 80;
  const r = 46;
  return (
    <svg viewBox="0 0 200 130" fill="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="200" height="130" fill={C.field} />
      {/* Glow */}
      <circle cx={cx} cy={cy} r={r + 12} fill={C.glow} />
      {/* Track */}
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        stroke={C.ring} strokeWidth="6" strokeLinecap="round" />
      {/* Filled arc ~65% */}
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(Math.PI * 0.35)} ${cy - r * Math.sin(Math.PI * 0.35)}`}
        stroke={C.accent} strokeWidth="6" strokeLinecap="round" />
      {/* Needle */}
      <line
        x1={cx} y1={cy}
        x2={cx + (r - 10) * Math.cos(Math.PI * 0.62)}
        y2={cy - (r - 10) * Math.sin(Math.PI * 0.62)}
        stroke={C.accent} strokeWidth="3" strokeLinecap="round"
      />
      {/* Center hub */}
      <circle cx={cx} cy={cy} r="6" fill={C.accent} />
      <circle cx={cx} cy={cy} r="3" fill={C.field} />
      {/* Tick marks */}
      {[-0.05, 0.15, 0.35, 0.55, 0.75, 0.95].map((t, i) => {
        const angle = Math.PI * (1 - t);
        const x1 = cx + (r + 4) * Math.cos(angle);
        const y1 = cy - (r + 4) * Math.sin(angle);
        const x2 = cx + (r + 10) * Math.cos(angle);
        const y2 = cy - (r + 10) * Math.sin(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.ring} strokeWidth="2" strokeLinecap="round" />;
      })}
    </svg>
  );
}

function IcoADAS({ C }) {
  /* Perspective road + highlighted lane */
  return (
    <svg viewBox="0 0 200 130" fill="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="200" height="130" fill={C.field} />
      {/* Road trapezoid */}
      <path d="M60 120 L90 30 L110 30 L140 120 Z" fill={C.zone} />
      {/* Left lane — active, accent */}
      <path d="M75 120 L93 30 L100 30 L100 120 Z" fill={C.accent} fillOpacity="0.6" />
      {/* Center dashes */}
      {[100, 82, 66, 52, 40].map((y, i) => (
        <rect key={i} x="99" y={y} width="2" height={6} rx="1"
          fill="rgba(255,255,255,0.5)" />
      ))}
      {/* Road edges */}
      <line x1="60" y1="120" x2="90" y2="30" stroke={C.ring} strokeWidth="1.5" />
      <line x1="140" y1="120" x2="110" y2="30" stroke={C.ring} strokeWidth="1.5" />
      {/* Lane change arrow */}
      <path d="M100 70 L88 55 M100 70 L88 55 L92 55 M88 55 L88 60"
        stroke={C.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IcoVoice({ C }) {
  /* Waveform — 5 bars symmetric */
  const bars = [18, 32, 44, 32, 18]; // heights
  const total = bars.length;
  const gapW = 12;
  const barW = 10;
  const startX = 100 - ((total * barW + (total - 1) * gapW) / 2);
  return (
    <svg viewBox="0 0 200 130" fill="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="200" height="130" fill={C.field} />
      {/* Outer glow ring */}
      <circle cx="100" cy="65" r="48" fill={C.glow} />
      {/* Bars */}
      {bars.map((h, i) => {
        const x = startX + i * (barW + gapW);
        const y = 65 - h / 2;
        return (
          <rect key={i} x={x} y={y} width={barW} height={h} rx={5}
            fill={C.accent} fillOpacity={i === 2 ? 1 : 0.7} />
        );
      })}
      {/* Mic dot */}
      <circle cx="100" cy="104" r="4" fill={C.accent} fillOpacity="0.5" />
    </svg>
  );
}

function IcoRoute({ C }) {
  /* A → B curved route */
  return (
    <svg viewBox="0 0 200 130" fill="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="200" height="130" fill={C.field} />
      {/* Route line */}
      <path d="M44 95 C44 40 156 40 156 95"
        stroke={C.ring} strokeWidth="3" strokeDasharray="6 4" />
      <path d="M44 95 C44 40 156 40 156 95"
        stroke={C.accent} strokeWidth="4" strokeLinecap="round"
        strokeDasharray="none" opacity="0.9" />
      {/* Origin dot */}
      <circle cx="44" cy="95" r="8" fill={C.field} stroke={C.accent} strokeWidth="3" />
      <circle cx="44" cy="95" r="3" fill={C.accent} />
      {/* Destination pin */}
      <path d="M156 95 C148 95 140 88 140 78 C140 66 148 60 156 60 C164 60 172 66 172 78 C172 88 164 95 156 95 Z"
        fill={C.accent} />
      <circle cx="156" cy="78" r="5" fill={C.field} fillOpacity="0.85" />
      {/* Glow at origin */}
      <circle cx="44" cy="95" r="18" fill={C.glow} />
      {/* Glow at dest */}
      <circle cx="156" cy="78" r="22" fill={C.glow} />
    </svg>
  );
}

function IcoEVRoute({ C }) {
  /* Lightning bolt in circular frame */
  return (
    <svg viewBox="0 0 200 130" fill="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="200" height="130" fill={C.field} />
      {/* Outer glow */}
      <circle cx="100" cy="65" r="50" fill={C.glow} />
      {/* Circular frame */}
      <circle cx="100" cy="65" r="40" stroke={C.ring} strokeWidth="3" />
      {/* Inner arc — partial, accent */}
      <circle cx="100" cy="65" r="40" stroke={C.accent} strokeWidth="3"
        strokeDasharray="90 162" strokeDashoffset="-20"
        strokeLinecap="round" />
      {/* Bolt */}
      <polygon points="108,28 88,65 102,65 92,102 112,65 98,65"
        fill={C.accent} />
    </svg>
  );
}

function IcoTraffic({ C }) {
  /* Three horizontal bars — traffic flow */
  return (
    <svg viewBox="0 0 200 130" fill="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="200" height="130" fill={C.field} />
      {/* Bar 1 — free flow, accent */}
      <rect x="32" y="28" width="136" height="20" rx="10" fill={C.accent} />
      {/* Flow dots on bar 1 */}
      {[56, 80, 104, 128, 152].map(x => (
        <circle key={x} cx={x} cy="38" r="4" fill="rgba(0,0,0,0.25)" />
      ))}
      {/* Bar 2 — moderate, mid */}
      <rect x="32" y="55" width="100" height="20" rx="10" fill={C.mid} fillOpacity="0.8" />
      {[56, 80, 104].map(x => (
        <circle key={x} cx={x} cy="65" r="4" fill="rgba(0,0,0,0.2)" />
      ))}
      {/* Bar 3 — congested, warn/danger */}
      <rect x="32" y="82" width="54" height="20" rx="10" fill={C.warn} fillOpacity="0.7" />
      <circle cx="56" cy="92" r="4" fill="rgba(0,0,0,0.2)" />
      {/* End caps — showing road continues */}
      <rect x="136" y="55" width="32" height="20" rx="10" fill={C.ring} fillOpacity="0.3" />
      <rect x="86" y="82" width="82" height="20" rx="10" fill={C.ring} fillOpacity="0.2" />
    </svg>
  );
}

function IcoMapPin({ C }) {
  /* Location pin on minimal road grid */
  return (
    <svg viewBox="0 0 200 130" fill="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="200" height="130" fill={C.field} />
      {/* Road grid — very subtle */}
      {[50, 100, 150].map(x => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="130" stroke={C.ring} strokeWidth="0.75" strokeOpacity="0.5" />
      ))}
      {[40, 80].map(y => (
        <line key={`h${y}`} x1="0" y1={y} x2="200" y2={y} stroke={C.ring} strokeWidth="0.75" strokeOpacity="0.5" />
      ))}
      {/* Pin glow */}
      <circle cx="100" cy="54" r="36" fill={C.glow} />
      {/* Pin body */}
      <path d="M100 15 C80 15 64 30 64 50 C64 74 100 105 100 105 C100 105 136 74 136 50 C136 30 120 15 100 15 Z"
        fill={C.accent} />
      {/* Inner circle */}
      <circle cx="100" cy="48" r="14" fill={C.field} fillOpacity="0.85" />
      <circle cx="100" cy="48" r="6" fill={C.accent} />
    </svg>
  );
}

/* ─── All cards data ─────────────────────────────────────────────────────────── */
const ICON_CARDS = [
  { id: 'home',      title: 'Build in-car home screens',        sub: 'UX Library · Automotive',            Icon: IcoHomeScreen },
  { id: 'eta',       title: 'Show live ETA & route progress',   sub: 'UX Library · Navigation',            Icon: IcoETA        },
  { id: 'search',    title: 'Customise in-car search',          sub: 'UX Library · Automotive',            Icon: IcoSearch     },
  { id: 'theming',   title: 'Apply OEM brand tokens',           sub: 'UX Library · Theming',               Icon: IcoTheming    },
  { id: 'ev-search', title: 'Search EV stations in-car',        sub: 'UX Library · EV & Charging',         Icon: IcoEVSearch   },
  { id: 'cluster',   title: 'Drive instrument cluster',         sub: 'UX Library · Automotive',            Icon: IcoCluster    },
  { id: 'adas',      title: 'Guide lane changes with ADAS',     sub: 'UX Library · ADAS',                  Icon: IcoADAS       },
  { id: 'voice',     title: 'Add AI voice assistant',           sub: 'UX Library · TAIA',                  Icon: IcoVoice      },
  { id: 'route',     title: 'Calculate a traffic-aware route',  sub: 'Routing API',                        Icon: IcoRoute      },
  { id: 'ev-route',  title: 'Plan long-distance EV trips',      sub: 'Long Distance EV Routing API',       Icon: IcoEVRoute    },
  { id: 'traffic',   title: 'Visualise real-time traffic',      sub: 'Traffic API',                        Icon: IcoTraffic    },
  { id: 'map',       title: 'Render raster & vector map tiles', sub: 'Map Display API',                    Icon: IcoMapPin     },
];

/* ─── Density sizes ─────────────────────────────────────────────────────────── */
const DENSITY_OPTIONS = [
  { id: 'lg',  label: 'Large (130 px)',  thumbH: 130, colMin: 220 },
  { id: 'md',  label: 'Medium (90 px)', thumbH: 90,  colMin: 180 },
  { id: 'sm',  label: 'Small (60 px)',  thumbH: 60,  colMin: 140 },
];

/* ─── Compact palette picker ─────────────────────────────────────────────────── */
const THEME_ROWS = [
  { id: 'day',           label: 'Day',         dot: '#EAF4FF', textDark: true  },
  { id: 'night',         label: 'Night',       dot: '#0D1B35', textDark: false },
  { id: 'blueprintLight',label: 'Blueprint L', dot: '#F0F7FF', textDark: true  },
  { id: 'blueprintDark', label: 'Blueprint D', dot: '#071420', textDark: false },
  ...COLOUR_FAMILIES.flatMap(f => [
    { id: f.lightId, label: `${f.label} L`, dot: f.lightBg, textDark: true  },
    { id: f.darkId,  label: `${f.label} D`, dot: f.darkBg,  textDark: false },
  ]),
];

function PalettePicker({ theme, onThemeChange }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
      <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--muted)', marginRight: 2 }}>
        Palette
      </span>
      {THEME_ROWS.map(t => {
        const active = theme === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onThemeChange(t.id)}
            title={t.label}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '4px 8px', borderRadius: 20,
              background: active ? t.dot : 'transparent',
              border: active ? `2px solid ${THEMES[t.id]?.accent ?? 'var(--red)'}` : '1px solid var(--border)',
              cursor: 'pointer', fontSize: '0.6875rem', fontWeight: active ? 700 : 400,
              color: active ? (t.textDark ? '#1B3D6E' : '#fff') : 'var(--mid)',
              transition: 'background 0.1s, border-color 0.1s',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: t.dot, border: '1px solid rgba(0,0,0,0.2)', flexShrink: 0, display: 'inline-block' }} />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Card ───────────────────────────────────────────────────────────────────── */
function IconCard({ card, palette, thumbH }) {
  const C = {
    field: palette.dark,
    accent: palette.accent,
    mid:   palette.mid,
    soft:  palette.soft,
    panel: palette.panel,
    ring:  `rgba(255,255,255,0.12)`,
    zone:  `rgba(255,255,255,0.06)`,
    chip:  `rgba(255,255,255,0.08)`,
    glow:  `${palette.accent}22`,
    warn:  palette.warn,
  };

  return (
    <div style={{
      borderRadius: 16, overflow: 'hidden',
      border: '1px solid var(--border)',
      background: 'var(--surface)',
      display: 'flex', flexDirection: 'column',
      transition: 'box-shadow 0.15s, border-color 0.15s',
    }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)'; e.currentTarget.style.borderColor = palette.accent; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      {/* Illustration field — always dark */}
      <div style={{ height: thumbH, background: palette.dark, flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
        <card.Icon C={C} />
      </div>
      {/* Label */}
      <div style={{ padding: '10px 12px', flex: 1 }}>
        <div style={{ fontSize: '0.6875rem', color: 'var(--muted)', marginBottom: 3, lineHeight: 1.3 }}>{card.sub}</div>
        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.35 }}>{card.title}</div>
      </div>
    </div>
  );
}

/* ─── Comparison row — old vs new side by side ───────────────────────────────── */
function CompareRow({ palette }) {
  const C = {
    field: palette.dark,
    accent: palette.accent,
    mid:   palette.mid,
    soft:  palette.soft,
    panel: palette.panel,
    ring:  `rgba(255,255,255,0.12)`,
    zone:  `rgba(255,255,255,0.06)`,
    chip:  `rgba(255,255,255,0.08)`,
    glow:  `${palette.accent}22`,
    warn:  palette.warn,
  };

  // Show 4 representative cards at 80px for scanning comparison
  const sample = ICON_CARDS.slice(0, 4);
  const thumbH = 80;

  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 8 }}>
      {/* New icon style */}
      <div style={{ flex: 1, minWidth: 240 }}>
        <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--muted)', marginBottom: 8 }}>
          ✦ New — icon style
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {sample.map(card => (
            <div key={card.id} style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--surface)' }}>
              <div style={{ height: thumbH, background: palette.dark }}>
                <card.Icon C={C} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function IconStyleSandbox() {
  const { theme, setTheme, palette } = useIlloStyle();
  const [density, setDensity] = useState('lg');
  const [showCompare, setShowCompare] = useState(false);

  const densityOpt = DENSITY_OPTIONS.find(d => d.id === density) ?? DENSITY_OPTIONS[0];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Icon Style — Sandbox</h1>
      </div>

      <p className="quick-answer">
        Phase 1 exploration of a bolder, more iconographic illustration style. Dark field + one
        bold symbol per card. All 12 icons are palette-tied — use the picker below to see them
        across all 14 colour themes.
      </p>

      {/* ── Controls bar ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'var(--bg)', borderBottom: '1px solid var(--border)',
        padding: '12px 0', marginBottom: 24,
        backdropFilter: 'blur(12px)',
      }}>
        {/* Palette picker */}
        <div style={{ marginBottom: 10 }}>
          <PalettePicker theme={theme} onThemeChange={setTheme} />
        </div>

        {/* Density + compare */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--muted)', marginRight: 2 }}>
            Density
          </span>
          {DENSITY_OPTIONS.map(d => (
            <button key={d.id} onClick={() => setDensity(d.id)} style={{
              padding: '4px 10px', borderRadius: 20, cursor: 'pointer', fontSize: '0.75rem',
              fontWeight: density === d.id ? 700 : 400,
              background: density === d.id ? '#fff5f5' : 'transparent',
              border: `1px solid ${density === d.id ? 'var(--red)' : 'var(--border)'}`,
              color: density === d.id ? 'var(--red)' : 'var(--mid)',
              transition: 'background 0.1s, border-color 0.1s, color 0.1s',
            }}>{d.label}</button>
          ))}

          <div style={{ width: 1, height: 16, background: 'var(--border)', margin: '0 4px' }} />

          <button onClick={() => setShowCompare(v => !v)} style={{
            padding: '4px 10px', borderRadius: 20, cursor: 'pointer', fontSize: '0.75rem',
            fontWeight: showCompare ? 700 : 400,
            background: showCompare ? '#fff5f5' : 'transparent',
            border: `1px solid ${showCompare ? 'var(--red)' : 'var(--border)'}`,
            color: showCompare ? 'var(--red)' : 'var(--mid)',
            transition: 'background 0.1s, border-color 0.1s, color 0.1s',
          }}>
            ⬛ Compare at 4-across
          </button>
        </div>
      </div>

      {/* ── Compare strip ── */}
      {showCompare && (
        <div style={{ marginBottom: 32, padding: '16px 20px', background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--mid)', marginBottom: 14, lineHeight: 1.6 }}>
            4-across at 80 px thumbnail — simulating the DocsPortal grid density where the
            "wallpaper" problem occurs. Icon style maintains distinct shapes at this size.
          </div>
          <CompareRow palette={palette} />
        </div>
      )}

      {/* ── Icon grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(${densityOpt.colMin}px, 1fr))`,
        gap: density === 'sm' ? 10 : 14,
      }}>
        {ICON_CARDS.map(card => (
          <IconCard key={card.id} card={card} palette={palette} thumbH={densityOpt.thumbH} />
        ))}
      </div>

      {/* ── Notes ── */}
      <div className="zone" id="ics-notes" style={{ marginTop: 32 }}>
        <h2 className="sh">Design notes</h2>
        <ul style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 2 }}>
          <li><strong style={{ color: 'var(--text)' }}>Background</strong> — always uses <code>palette.dark</code>, which keeps each card premium dark regardless of light/dark palette.</li>
          <li><strong style={{ color: 'var(--text)' }}>Primary icon colour</strong> — <code>palette.accent</code> — the brightest, most saturated tone in each palette. Switches live with the palette selector.</li>
          <li><strong style={{ color: 'var(--text)' }}>Structure lines</strong> — <code>rgba(255,255,255,0.12)</code> — always white-tinted, never theme-coloured. Keeps structural detail from competing with the icon.</li>
          <li><strong style={{ color: 'var(--text)' }}>Glow ring</strong> — <code>accent + 13% opacity</code> — adds depth without adding noise.</li>
          <li><strong style={{ color: 'var(--text)' }}>Scanability</strong> — each icon uses a distinct silhouette shape (circle, trapezoid, pin, arc, bars) so it's identifiable at 60 px. Try the Small density above.</li>
          <li><strong style={{ color: 'var(--text)' }}>Next steps if approved</strong> — add remaining cards from DocsPortal, wire into illoStyle context as <code>'icon'</code> variant, update DocsPortal to consume it.</li>
        </ul>
      </div>

    </div>
  );
}
