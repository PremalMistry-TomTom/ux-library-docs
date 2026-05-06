import { useTranslation } from 'react-i18next';
import Callout from '../components/ui/Callout';
import PageActions from '../components/ui/PageActions';

const BASE = import.meta.env.BASE_URL;

/* ─── Inline cross-product link ─────────────────────────────────────────────── */
function DocLink({ children, pageId, productId, onNavigate }) {
  return (
    <button
      onClick={() => onNavigate?.(pageId, productId)}
      style={{ background: 'none', border: 'none', padding: 0, color: 'var(--red, #e2001a)', fontWeight: 600, cursor: 'pointer', fontSize: 'inherit', textDecoration: 'underline', textUnderlineOffset: '2px' }}
    >
      {children}
    </button>
  );
}

function WhenCard({ icon, title, children }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '12px 14px', background: 'var(--surface)' }}>
      <div style={{ display: 'flex', gap: 7, alignItems: 'flex-start', marginBottom: 4 }}>
        <span style={{ fontSize: '0.875rem', lineHeight: 1.2 }}>{icon}</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)' }}>{title}</span>
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}

/* ─── Feature card thumbnails ──────────────────────────────────────────────── */

function ThumbMapDisplay() {
  return (
    <div style={{ background: '#0c1318', borderRadius: 8, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 130" fill="none">
          <rect width="200" height="130" fill="#1a2535"/>
          {/* Road grid */}
          <path d="M0 65 Q60 55 100 65 T200 60" stroke="#243040" strokeWidth="6" strokeLinecap="round"/>
          <path d="M0 65 Q60 55 100 65 T200 60" stroke="#2a3a50" strokeWidth="2" strokeLinecap="round"/>
          <path d="M70 0 L68 130" stroke="#243040" strokeWidth="5"/>
          <path d="M70 0 L68 130" stroke="#2a3a50" strokeWidth="1.5"/>
          <path d="M140 0 L135 130" stroke="#243040" strokeWidth="5"/>
          <path d="M140 0 L135 130" stroke="#2a3a50" strokeWidth="1.5"/>
          {/* Highlight route */}
          <path d="M10 100 Q50 70 100 65 T180 50" stroke="#e2001a" strokeWidth="2.5" strokeLinecap="round" opacity="0.85"/>
          <path d="M10 100 Q50 70 100 65 T180 50" stroke="rgba(226,0,26,0.2)" strokeWidth="9" strokeLinecap="round"/>
          {/* Vehicle dot */}
          <circle cx="100" cy="65" r="5" fill="#e2001a"/>
          <circle cx="100" cy="65" r="9" fill="rgba(226,0,26,0.22)"/>
          {/* POI dots */}
          <circle cx="68" cy="45" r="3" fill="#58a6ff" opacity="0.8"/>
          <circle cx="140" cy="70" r="3" fill="#3fb950" opacity="0.8"/>
          <circle cx="155" cy="40" r="3" fill="#fbbf24" opacity="0.8"/>
        </svg>
      </div>
      {/* Layer pill */}
      <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', borderRadius: 4, padding: '3px 7px', display: 'flex', gap: 4, alignItems: 'center' }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3fb950' }}/>
        <span style={{ fontSize: '0.5rem', color: '#e2e8f0', fontWeight: 600 }}>Map Display</span>
      </div>
    </div>
  );
}

function ThumbSearch() {
  const M = { bg: '#0f1117', card: '#1a1d27', line: '#2a2a3a', text: '#e2e8f0', dim: '#94a3b8', muted: '#64748b', blue: '#58a6ff' };
  const results = [['Amsterdam Centraal', '0.2 km'], ['Rijksmuseum', '1.4 km'], ['Vondelpark', '2.1 km']];
  return (
    <div style={{ background: M.bg, borderRadius: 8, overflow: 'hidden', height: '100%' }}>
      <div style={{ padding: '7px 10px', background: M.card, display: 'flex', alignItems: 'center', gap: 6, borderBottom: `1px solid ${M.line}` }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={M.dim} strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <span style={{ fontSize: '0.5rem', color: M.muted }}>Search destination…</span>
      </div>
      {results.map(([name, dist], i) => (
        <div key={name} style={{ padding: '6px 10px', borderBottom: i < 2 ? `1px solid ${M.line}` : 'none', display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ width: 18, height: 18, background: '#1e293b', borderRadius: 4, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={M.blue} strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.5rem', fontWeight: 600, color: M.text }}>{name}</div>
            <div style={{ fontSize: '0.5rem', color: M.muted }}>{dist}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ThumbRouting() {
  const M = { bg: '#0d1117', card: '#161b22', line: '#21262d', text: '#e6edf3', dim: '#8b949e', blue: '#58a6ff', green: '#3fb950', red: '#e2001a' };
  return (
    <div style={{ background: M.bg, borderRadius: 8, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: M.text, marginBottom: 2 }}>Route Options</div>
      <div style={{ fontSize: '0.5rem', color: M.dim, marginBottom: 8 }}>Amsterdam → Berlin · 3 results</div>
      {[
        { label: 'Fastest', time: '5h 52m', dist: '573 km', tag: 'Recommended', color: M.green },
        { label: 'Eco', time: '6h 10m', dist: '558 km', tag: '–12% fuel', color: M.blue },
        { label: 'Avoid tolls', time: '6h 38m', dist: '601 km', tag: 'No tolls', color: M.dim },
      ].map((r, i) => (
        <div key={r.label} style={{ background: i === 0 ? 'rgba(63,185,80,0.08)' : M.card, border: `1px solid ${i === 0 ? 'rgba(63,185,80,0.25)' : M.line}`, borderRadius: 5, padding: '5px 7px', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.5rem', fontWeight: 700, color: M.text }}>{r.time}</div>
            <div style={{ fontSize: '0.5rem', color: M.dim }}>{r.dist}</div>
          </div>
          <span style={{ fontSize: '0.5rem', padding: '2px 5px', borderRadius: 3, background: 'rgba(255,255,255,0.06)', color: r.color, fontWeight: 600 }}>{r.tag}</span>
        </div>
      ))}
    </div>
  );
}

function ThumbNavigation() {
  return (
    <div style={{ background: '#0c1318', borderRadius: 8, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#1a2535,#0f1a28)' }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 130" fill="none">
          <path d="M10 100 Q60 70 100 72 T190 50" stroke="#e2001a" strokeWidth="2.5" strokeLinecap="round" opacity="0.85"/>
          <path d="M10 100 Q60 70 100 72 T190 50" stroke="rgba(226,0,26,0.2)" strokeWidth="9" strokeLinecap="round"/>
          <circle cx="100" cy="71" r="4" fill="#e2001a" opacity="0.9"/>
        </svg>
      </div>
      {/* NIP */}
      <div style={{ position: 'absolute', top: 8, left: 8, background: '#1a3d2b', borderRadius: 6, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 6, border: '1px solid rgba(63,185,80,0.3)' }}>
        <span style={{ fontSize: '1rem', lineHeight: 1 }}>↖</span>
        <div>
          <div style={{ fontSize: '0.5rem', fontWeight: 700, color: '#fff' }}>800 m</div>
          <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.55)' }}>Turn left · Keizersgracht</div>
        </div>
      </div>
      {/* ETA bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(8,14,26,0.94)', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '7px 12px', display: 'flex', justifyContent: 'space-around' }}>
        {[['14:32', 'ETA'], ['22 min', 'Time'], ['8.4 km', 'Dist']].map(([v, l]) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.625rem', fontWeight: 700, color: '#e2e8f0' }}>{v}</div>
            <div style={{ fontSize: '0.5rem', color: '#64748b' }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ThumbOffline() {
  const M = { bg: '#0d1117', card: '#161b22', line: '#21262d', text: '#e6edf3', dim: '#8b949e', blue: '#58a6ff' };
  const regions = [['Western Europe', '1.2 GB', 100], ['Eastern Europe', '0.8 GB', 65], ['North America', '2.1 GB', 30]];
  return (
    <div style={{ background: M.bg, borderRadius: 8, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 2.09 4.18a2 2 0 0 1 2-2.18h3"/><path d="M16 2a4 4 0 0 1 4 4v1M16 7h6"/><line x1="23" y1="1" x2="1" y2="23" stroke="#ef4444" strokeWidth="1.5"/></svg>
        <span style={{ fontSize: '0.5rem', fontWeight: 700, color: M.text }}>Offline Maps</span>
        <span style={{ fontSize: '0.5rem', color: '#3fb950', marginLeft: 'auto' }}>Active</span>
      </div>
      {regions.map(([name, size, pct]) => (
        <div key={name} style={{ marginBottom: 7 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
            <span style={{ fontSize: '0.5rem', color: M.text }}>{name}</span>
            <span style={{ fontSize: '0.5rem', color: M.dim }}>{size}</span>
          </div>
          <div style={{ height: 4, background: M.card, borderRadius: 2 }}>
            <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? '#3fb950' : M.blue, borderRadius: 2 }}/>
          </div>
        </div>
      ))}
    </div>
  );
}

function ThumbCarPlay() {
  return (
    <div style={{ background: '#0c1318', borderRadius: 8, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#1a2535,#0f1a28)' }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 130" fill="none">
          <path d="M10 80 Q55 58 100 72 T190 60" stroke="#e2001a" strokeWidth="2.5" strokeLinecap="round" opacity="0.85"/>
          <path d="M10 80 Q55 58 100 72 T190 60" stroke="rgba(226,0,26,0.2)" strokeWidth="9" strokeLinecap="round"/>
          <circle cx="100" cy="71" r="4" fill="#e2001a" opacity="0.9"/>
        </svg>
      </div>
      {/* CarPlay chrome */}
      <div style={{ position: 'absolute', top: 8, left: 8, right: 8, background: 'rgba(0,0,0,0.7)', borderRadius: 5, padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 6, border: '1px solid rgba(255,255,255,0.1)' }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
        <span style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600, letterSpacing: '0.04em' }}>CarPlay</span>
        <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }}/>
      </div>
      {/* ETA bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(8,14,26,0.94)', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '7px 12px', display: 'flex', justifyContent: 'space-around' }}>
        {[['14:32', 'ETA'], ['18 min', 'Time'], ['6.4 km', 'Dist']].map(([v, l]) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.625rem', fontWeight: 700, color: '#e2e8f0' }}>{v}</div>
            <div style={{ fontSize: '0.5rem', color: '#64748b' }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ThumbVirtualHorizon() {
  return (
    <div style={{ background: '#060608', borderRadius: 8, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#0a1420,#101820)' }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 130" fill="none">
          {/* Road perspective */}
          <path d="M0 130 L55 58 L145 58 L200 130 Z" fill="#151a26" opacity="0.9"/>
          {[65, 80, 100, 120, 135].map((x, i) => (
            <line key={i} x1={x} y1={58} x2={i < 2 ? x - 45 : i > 2 ? x + 45 : x} y2={130}
              stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="5 5"/>
          ))}
          {/* Horizon markers */}
          <circle cx="80" cy="72" r="3" fill="#fbbf24" opacity="0.9"/>
          <circle cx="115" cy="68" r="3" fill="#ef4444" opacity="0.9"/>
          <circle cx="100" cy="63" r="2.5" fill="#60a5fa" opacity="0.9"/>
        </svg>
      </div>
      {/* Data overlay */}
      <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {[['🚧','Roadwork', '#fbbf24'], ['⚠️','Sharp curve', '#ef4444'], ['⛽','Station 800m', '#60a5fa']].map(([icon, label, color]) => (
          <div key={label} style={{ background: 'rgba(0,0,0,0.65)', borderRadius: 4, padding: '2px 6px', display: 'flex', gap: 4, alignItems: 'center', border: `1px solid ${color}33` }}>
            <span style={{ fontSize: '0.5rem' }}>{icon}</span>
            <span style={{ fontSize: '0.5rem', color }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Capability card ────────────────────────────────────────────────────────── */
function CapabilityCard({ Thumb, title, desc, tag, onNavigate, pageId }) {
  const clickable = Boolean(pageId && onNavigate);
  return (
    <div
      style={{ cursor: clickable ? 'pointer' : 'default', borderRadius: 10, border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--white)', transition: 'box-shadow 0.15s, border-color 0.15s', display: 'flex', flexDirection: 'column' }}
      onClick={clickable ? () => onNavigate(pageId) : undefined}
      onMouseEnter={clickable ? e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'; e.currentTarget.style.borderColor = 'var(--red)'; } : undefined}
      onMouseLeave={clickable ? e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; } : undefined}
    >
      <div style={{ height: 130, background: '#0d1117', overflow: 'hidden', padding: 10, flexShrink: 0 }}>
        <Thumb />
      </div>
      <div style={{ padding: '12px 14px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--black)' }}>{title}</div>
          {tag && <span style={{ fontSize: '0.625rem', padding: '1px 6px', borderRadius: 3, background: 'rgba(226,0,26,0.08)', color: '#e2001a', fontWeight: 600 }}>{tag}</span>}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.5 }}>{desc}</div>
      </div>
    </div>
  );
}

/* ─── Architecture diagram ──────────────────────────────────────────────────── */
function ArchDiagram() {
  const layers = [
    { label: 'Your App', color: '#0066cc', bg: 'rgba(0,102,204,0.1)', border: 'rgba(0,102,204,0.35)', desc: 'Custom UI & Business Logic' },
    { label: 'Navigation Engine', color: '#e2001a', bg: 'rgba(226,0,26,0.1)', border: 'rgba(226,0,26,0.3)', desc: 'Turn-by-turn · Guidance · Announcements' },
    { label: 'Map & Routing SDK', color: '#3fb950', bg: 'rgba(63,185,80,0.08)', border: 'rgba(63,185,80,0.3)', desc: 'Map Display · Search · Routing · Location' },
    { label: 'TomTom Platform', color: '#8b949e', bg: 'rgba(139,148,158,0.06)', border: 'rgba(139,148,158,0.2)', desc: 'Maps · Traffic · POI · EV Data · ADAS' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 560 }}>
      {layers.map((layer, i) => (
        <div key={layer.label} style={{ background: layer.bg, border: `1px solid ${layer.border}`, borderRadius: 8, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: layer.bg, border: `1.5px solid ${layer.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '0.625rem', fontWeight: 700, color: layer.color }}>{i + 1}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)', marginBottom: 1 }}>{layer.label}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{layer.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Platform card ─────────────────────────────────────────────────────────── */
function PlatformCard({ platform, icon, items, active }) {
  return (
    <div style={{ flex: 1, border: `1px solid ${active ? '#e2001a' : 'var(--border)'}`, borderRadius: 10, padding: '16px 20px', background: active ? 'rgba(226,0,26,0.03)' : 'var(--surface)', transition: 'border-color 0.2s' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: '1.5rem' }}>{icon}</span>
        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--black)' }}>{platform}</span>
        {active && <span style={{ marginLeft: 'auto', fontSize: '0.625rem', fontWeight: 600, color: '#e2001a', background: 'rgba(226,0,26,0.08)', padding: '2px 7px', borderRadius: 4 }}>Current</span>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map(([title, desc]) => (
          <div key={title} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#e2001a', marginTop: 6, flexShrink: 0 }}/>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--black)' }}>{title}</span>
              {desc && <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}> — {desc}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────────── */
const CAPABILITIES_SHARED = [
  {
    Thumb: ThumbMapDisplay,
    title: 'Map Display',
    desc: 'Render TomTom vector maps with full control over style, camera, layers, markers, and traffic overlays.',
    pageId: 'navsdk-map-display',
  },
  {
    Thumb: ThumbSearch,
    title: 'Search',
    desc: 'Plug in address search, fuzzy POI search, and EV charging search through a unified search interface.',
    pageId: 'navsdk-search',
  },
  {
    Thumb: ThumbRouting,
    title: 'Routing',
    desc: 'Calculate multi-waypoint routes with vehicle profiles, traffic, EV range, and alternative route support.',
    pageId: 'navsdk-routing',
  },
  {
    Thumb: ThumbNavigation,
    title: 'Navigation',
    desc: 'Full turn-by-turn guidance with voice announcements, lane guidance, and real-time re-routing.',
    pageId: 'navsdk-nav-guidance',
  },
  {
    Thumb: ThumbVirtualHorizon,
    title: 'Virtual Horizon',
    desc: 'Access ADAS-quality road attribute data ahead of the vehicle for speed limit, curve, and hazard warnings.',
    pageId: 'navsdk-vh-overview',
  },
];

const CAPABILITIES_ANDROID = [
  ...CAPABILITIES_SHARED,
  {
    Thumb: ThumbOffline,
    title: 'Offline Maps',
    desc: 'Download regional map packages for full offline navigation without a data connection.',
    pageId: 'navsdk-offline-overview',
    tag: 'Android',
  },
];

const CAPABILITIES_IOS = [
  ...CAPABILITIES_SHARED,
  {
    Thumb: ThumbCarPlay,
    title: 'CarPlay',
    desc: 'Integrate with Apple CarPlay using a navigation session API built for the CarPlay framework.',
    pageId: 'navsdk-carplay',
    tag: 'iOS',
  },
];

export default function NavSDKIntro({ onNavigate, platform = 'android' }) {
  const isAndroid = platform !== 'ios';
  const capabilities = isAndroid ? CAPABILITIES_ANDROID : CAPABILITIES_IOS;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Maps &amp; Navigation SDK</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        {isAndroid
          ? 'The Maps & Navigation SDK gives you the building blocks for a fully custom Android navigation experience — from vector map rendering to full turn-by-turn guidance, with optional Jetpack Compose UI components.'
          : 'The Maps & Navigation SDK gives you the building blocks for a fully custom iOS navigation experience — from vector map rendering to full turn-by-turn guidance, with native SwiftUI and UIKit APIs.'}
      </p>

      {/* Hero */}
      <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 36, background: '#0d1d2e', border: '1px solid var(--border)', position: 'relative' }}>
        <img
          src={`${BASE}navsdk_banner.png`}
          alt="Maps & Navigation SDK"
          style={{ width: '100%', display: 'block', maxHeight: 320, objectFit: 'cover', objectPosition: 'center 30%' }}
          onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
        />
        <div style={{ display: 'none', height: 220, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10, color: 'rgba(255,255,255,0.25)' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
          </svg>
          <span style={{ fontSize: '0.75rem' }}>Maps &amp; Navigation SDK</span>
        </div>
      </div>

      {/* What is the SDK */}
      <div className="zone">
        <h2 className="sh" id="ns-what">What is the Maps &amp; Navigation SDK?</h2>
        <p className="body">
          The Maps &amp; Navigation SDK is TomTom's modular development toolkit for OEMs and automotive software teams who need precise control over every aspect of the in-car navigation experience. Unlike a pre-built application, the SDK provides lower-level primitives — map rendering, routing engine, navigation session management — that you compose into your own UI.
        </p>
        {isAndroid ? (
          <p className="body">
            The Android SDK supports both Jetpack Compose and the traditional XML Views system, making it suitable for new Compose-first projects and existing AAOS codebases alike. For teams who want ready-made navigation components, the{' '}
            <DocLink pageId="overview" productId="ux-library" onNavigate={onNavigate}>UX Library</DocLink>{' '}
            sits directly on top of this SDK and removes the UI build from scratch.
          </p>
        ) : (
          <p className="body">
            The iOS SDK targets SwiftUI and UIKit with native Swift APIs. It supports CarPlay integration, giving you a navigation session that adapts to both the head unit and the CarPlay display from a single codebase.
          </p>
        )}
      </div>

      {/* Platform support */}
      <div className="zone">
        <h2 className="sh" id="ns-platforms">Platform support</h2>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <PlatformCard
            platform="Android"
            icon="🤖"
            active={isAndroid}
            items={[
              ['Jetpack Compose', 'First-class Compose API for MapDisplay and all UI components'],
              ['XML Views', 'Full Views-based API for existing codebases and AAOS systems'],
              ['Min SDK', 'Android 8.0 (API level 26)'],
              ['Offline maps', 'Downloadable region packages'],
              ['UX Library', 'Optional pre-built Compose navigation components'],
            ]}
          />
          <PlatformCard
            platform="iOS"
            icon=""
            active={!isAndroid}
            items={[
              ['SwiftUI', 'Native SwiftUI MapView and composable navigation components'],
              ['UIKit', 'UIKit-compatible APIs for existing applications'],
              ['Min version', 'iOS 14.0+'],
              ['CarPlay', 'CarPlay-compatible navigation session support'],
            ]}
          />
        </div>
      </div>

      {/* When to choose */}
      <div className="zone">
        <h2 className="sh" id="ns-when">When to choose the Maps &amp; Navigation SDK</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          <WhenCard icon="✅" title="Full UI ownership">
            Design and maintain your own navigation experience end to end. No TomTom UI patterns to inherit — your designers own every pixel.
          </WhenCard>
          <WhenCard icon="✅" title="Modular by design">
            Use only the layers you need: just map rendering, just routing, or the full guidance stack. Pay no overhead for features you don't ship.
          </WhenCard>
          <WhenCard icon="✅" title="Android & iOS">
            One SDK family covers both platforms — Compose and Views on Android, SwiftUI and UIKit on iOS — with a consistent API surface.
          </WhenCard>
          <WhenCard icon="✅" title="Extensible">
            Plug in your own search provider, custom route post-processing, third-party voice engine, or ADAS data feed alongside the SDK.
          </WhenCard>
          {isAndroid ? (
            <WhenCard icon="⚠️" title="You build the UI">
              Significant development investment. For ready-made navigation components on Android,{' '}
              <DocLink pageId="overview" productId="ux-library" onNavigate={onNavigate}>UX Library</DocLink>{' '}
              gives you a full Compose UI stack built on top of this SDK.
            </WhenCard>
          ) : (
            <WhenCard icon="⚠️" title="You build the UI">
              Significant development investment. There is no pre-built UI library for iOS — your team designs and builds all navigation UI on top of the SDK primitives.
            </WhenCard>
          )}
          {isAndroid ? (
            <WhenCard icon="⚠️" title="Longer time to market">
              Expect months of development for a production-grade experience. For faster delivery on Android, start with{' '}
              <DocLink pageId="overview" productId="ux-library" onNavigate={onNavigate}>UX Library</DocLink>. For a
              fully pre-built solution, consider{' '}
              <DocLink pageId="ana-intro" productId="ana" onNavigate={onNavigate}>ANA</DocLink>.
            </WhenCard>
          ) : (
            <WhenCard icon="⚠️" title="Longer time to market">
              Expect months of development for a production-grade iOS experience. For a fully pre-built automotive navigation solution, consider{' '}
              <DocLink pageId="ana-intro" productId="ana" onNavigate={onNavigate}>ANA</DocLink>{' '}
              (Android only).
            </WhenCard>
          )}
        </div>
      </div>

      {/* Architecture */}
      <div className="zone">
        <h2 className="sh" id="ns-arch">SDK architecture</h2>
        <p className="body" style={{ marginBottom: 20 }}>
          The SDK is structured as four co-operating layers. Your application sits at the top and depends only on the layers below it — TomTom platform calls are fully abstracted.
        </p>
        <ArchDiagram />
      </div>

      {/* Capabilities */}
      <div className="zone">
        <h2 className="sh" id="ns-capabilities">Key capabilities</h2>
        <p className="quick-answer" style={{ marginBottom: 20 }}>
          {isAndroid
            ? 'Each capability is independently usable. Use only the map, or combine all layers to build a complete Android navigation application.'
            : 'Each capability is independently usable. Use only the map, or combine all layers to build a complete iOS navigation application.'}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {capabilities.map(cap => (
            <CapabilityCard key={cap.title} {...cap} onNavigate={onNavigate} />
          ))}
        </div>
      </div>

      {/* Getting started */}
      <div className="zone">
        <h2 className="sh" id="ns-start">Ready to get started?</h2>
        <p className="body" style={{ marginBottom: 16 }}>
          {isAndroid
            ? 'The quickest path to a working map is the Getting Started guide — it walks through project setup, SDK initialisation, and displaying your first map in under 15 minutes.'
            : 'Follow the iOS Getting Started guide to configure your Xcode project, add the Swift Package, and display your first map.'}
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            className="page-action-btn"
            style={{ background: '#e2001a', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 6, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
            onClick={() => onNavigate?.('navsdk-project-setup')}
          >
            Get started
          </button>
          <button
            className="page-action-btn"
            onClick={() => onNavigate?.('navsdk-example-quickstart')}
          >
            {isAndroid ? 'Run the Example App' : 'Run the Sample App'}
          </button>
        </div>
      </div>

      <Callout type="info">
        This documentation covers SDK v2. If you are migrating from SDK v1, see the <strong>Migration Guide</strong> in Getting Started.
      </Callout>
    </div>
  );
}
