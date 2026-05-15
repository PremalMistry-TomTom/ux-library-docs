import { useTranslation } from 'react-i18next';
import Callout from '../components/ui/Callout';
import PageActions from '../components/ui/PageActions';
import { useIlloStyle } from '../context/IlloStyleContext';
import {
  makeThumb,
  L_MapDisplay, L_SDKSearch, L_RouteOptions, L_NavGuidance, L_VirtualHorizon, L_OfflineMaps, L_CarPlay,
  L_Route,
} from '../illustrations/lightVariants';
import {
  IlloMapDisplay, IlloNavGuidance,
  IlloNavSDKLocation,
  IlloNavSDKSearch,
  IlloNavSDKRouting,
  IlloNavSDKNavigation,
  IlloNavSDKOffline,
  IlloNavSDKVirtualHorizon,
  IlloNavSDKAdvanced,
} from './IntroIllustrations';
import {
  IcoMapDisplay, IcoNavGuidance,
  IcoNavSDKLocation, IcoNavSDKSearch, IcoNavSDKRouting, IcoNavSDKNavigation,
  IcoNavSDKOffline, IcoNavSDKVirtualHorizon, IcoNavSDKAdvanced,
  IcoNavControls,
} from '../illustrations/iconVariants';

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

function WhenCard({ type = 'check', title, children }) {
  const isWarn = type === 'warn';
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 20, padding: '12px 14px', background: 'var(--surface)' }}>
      <div style={{ display: 'flex', gap: 7, alignItems: 'flex-start', marginBottom: 4 }}>
        {isWarn ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
            <path d="M8 1.5L14.928 13.5H1.072L8 1.5Z" fill="#f59e0b"/>
            <rect x="7.25" y="6" width="1.5" height="4" rx="0.75" fill="white"/>
            <circle cx="8" cy="11.5" r="0.85" fill="white"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="8" cy="8" r="7" fill="#22c55e"/>
            <path d="M5 8.2l2 2 4-4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)' }}>{title}</span>
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}

/* ─── Feature card thumbnails ──────────────────────────────────────────────── */

function ThumbMapDisplay() {
  return (
    <div style={{ background: '#0c1318', borderRadius: 20, overflow: 'hidden', height: '100%', position: 'relative' }}>
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
  const { palette: C } = useIlloStyle();
  const M = { bg: C.bg, card: C.panel, line: C.border, text: C.navy, dim: C.mid, muted: C.soft, blue: C.mid };
  const results = [['Amsterdam Centraal', '0.2 km'], ['Rijksmuseum', '1.4 km'], ['Vondelpark', '2.1 km']];
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%' }}>
      <div style={{ padding: '7px 10px', background: M.card, display: 'flex', alignItems: 'center', gap: 6, borderBottom: `1px solid ${M.line}` }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={M.dim} strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <span style={{ fontSize: '0.5rem', color: M.muted }}>Search destination…</span>
      </div>
      {results.map(([name, dist], i) => (
        <div key={name} style={{ padding: '6px 10px', borderBottom: i < 2 ? `1px solid ${M.line}` : 'none', display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ width: 18, height: 18, background: M.card, borderRadius: 4, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
  const { palette: C } = useIlloStyle();
  const M = { bg: C.bg, card: C.panel, line: C.border, text: C.navy, dim: C.mid, blue: C.mid, green: C.accent, red: '#e2001a' };
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: M.text, marginBottom: 2 }}>Route Options</div>
      <div style={{ fontSize: '0.5rem', color: M.dim, marginBottom: 8 }}>Amsterdam → Berlin · 3 results</div>
      {[
        { label: 'Fastest', time: '5h 52m', dist: '573 km', tag: 'Recommended', color: M.green },
        { label: 'Eco', time: '6h 10m', dist: '558 km', tag: '–12% fuel', color: M.blue },
        { label: 'Avoid tolls', time: '6h 38m', dist: '601 km', tag: 'No tolls', color: M.dim },
      ].map((r, i) => (
        <div key={r.label} style={{ background: i === 0 ? `${C.accent}12` : M.card, border: `1px solid ${i === 0 ? `${C.accent}40` : M.line}`, borderRadius: 5, padding: '5px 7px', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.5rem', fontWeight: 700, color: M.text }}>{r.time}</div>
            <div style={{ fontSize: '0.5rem', color: M.dim }}>{r.dist}</div>
          </div>
          <span style={{ fontSize: '0.5rem', padding: '2px 5px', borderRadius: 3, background: `${C.border}20`, color: r.color, fontWeight: 600 }}>{r.tag}</span>
        </div>
      ))}
    </div>
  );
}

function ThumbNavigation() {
  return (
    <div style={{ background: '#0c1318', borderRadius: 20, overflow: 'hidden', height: '100%', position: 'relative' }}>
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
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#e2e8f0' }}>{v}</div>
            <div style={{ fontSize: '0.5rem', color: '#64748b' }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ThumbOffline() {
  const { palette: C } = useIlloStyle();
  const M = { bg: C.bg, card: C.panel, line: C.border, text: C.navy, dim: C.mid, blue: C.mid };
  const regions = [['Western Europe', '1.2 GB', 100], ['Eastern Europe', '0.8 GB', 65], ['North America', '2.1 GB', 30]];
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 2.09 4.18a2 2 0 0 1 2-2.18h3"/><path d="M16 2a4 4 0 0 1 4 4v1M16 7h6"/><line x1="23" y1="1" x2="1" y2="23" stroke={C.danger} strokeWidth="1.5"/></svg>
        <span style={{ fontSize: '0.5rem', fontWeight: 700, color: M.text }}>Offline Maps</span>
        <span style={{ fontSize: '0.5rem', color: C.accent, marginLeft: 'auto' }}>Active</span>
      </div>
      {regions.map(([name, size, pct]) => (
        <div key={name} style={{ marginBottom: 7 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
            <span style={{ fontSize: '0.5rem', color: M.text }}>{name}</span>
            <span style={{ fontSize: '0.5rem', color: M.dim }}>{size}</span>
          </div>
          <div style={{ height: 4, background: M.card, borderRadius: 2 }}>
            <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? C.accent : M.blue, borderRadius: 2 }}/>
          </div>
        </div>
      ))}
    </div>
  );
}

function ThumbCarPlay() {
  const { palette: C } = useIlloStyle();
  return (
    <div style={{ background: C.bg, borderRadius: 20, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: C.bg }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 130" fill="none">
          <rect width="200" height="130" fill={C.bg}/>
          <path d="M10 80 Q55 58 100 72 T190 60" stroke={C.grid} strokeWidth="8" strokeLinecap="round"/>
          <path d="M10 80 Q55 58 100 72 T190 60" stroke="#e2001a" strokeWidth="2.5" strokeLinecap="round" opacity="0.85"/>
          <path d="M10 80 Q55 58 100 72 T190 60" stroke="rgba(226,0,26,0.2)" strokeWidth="9" strokeLinecap="round"/>
          <circle cx="100" cy="71" r="4" fill="#e2001a" opacity="0.9"/>
        </svg>
      </div>
      {/* CarPlay chrome */}
      <div style={{ position: 'absolute', top: 8, left: 8, right: 8, background: C.dark, borderRadius: 5, padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 6, border: `1px solid ${C.border}` }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
        <span style={{ fontSize: '0.5rem', color: C.white, fontWeight: 600, letterSpacing: '0.04em' }}>CarPlay</span>
        <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: C.accent }}/>
      </div>
      {/* ETA bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: C.dark, borderTop: `1px solid ${C.border}`, padding: '7px 12px', display: 'flex', justifyContent: 'space-around' }}>
        {[['14:32', 'ETA'], ['18 min', 'Time'], ['6.4 km', 'Dist']].map(([v, l]) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: C.white }}>{v}</div>
            <div style={{ fontSize: '0.5rem', color: C.mid }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ThumbVirtualHorizon() {
  const { palette: C } = useIlloStyle();
  return (
    <div style={{ background: C.bg, borderRadius: 20, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: C.bg }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 130" fill="none">
          <rect width="200" height="130" fill={C.bg}/>
          {/* Road perspective */}
          <path d="M0 130 L55 58 L145 58 L200 130 Z" fill={C.panel} opacity="0.9"/>
          {[65, 80, 100, 120, 135].map((x, i) => (
            <line key={i} x1={x} y1={58} x2={i < 2 ? x - 45 : i > 2 ? x + 45 : x} y2={130}
              stroke={C.border} strokeWidth="1" strokeDasharray="5 5"/>
          ))}
          {/* Horizon markers */}
          <circle cx="80" cy="72" r="3" fill={C.warn} opacity="0.9"/>
          <circle cx="115" cy="68" r="3" fill={C.danger} opacity="0.9"/>
          <circle cx="100" cy="63" r="2.5" fill={C.mid} opacity="0.9"/>
        </svg>
      </div>
      {/* Data overlay */}
      <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {[['🚧','Roadwork', C.warn], ['⚠️','Sharp curve', C.danger], ['⛽','Station 800m', C.mid]].map(([icon, label, color]) => (
          <div key={label} style={{ background: C.dark, borderRadius: 4, padding: '2px 6px', display: 'flex', gap: 4, alignItems: 'center', border: `1px solid ${color}44` }}>
            <span style={{ fontSize: '0.5rem' }}>{icon}</span>
            <span style={{ fontSize: '0.5rem', color }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Use-case card (key use cases grid) ────────────────────────────────────── */
function UseCaseCard({ Thumb, group, title, desc, pageId, onNavigate }) {
  const { theme, palette } = useIlloStyle();
  const clickable = Boolean(pageId && onNavigate);
  return (
    <div
      style={{ cursor: clickable ? 'pointer' : 'default', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--white)', transition: 'box-shadow 0.15s, border-color 0.15s', display: 'flex', flexDirection: 'column' }}
      onClick={clickable ? () => onNavigate(pageId) : undefined}
      onMouseEnter={clickable ? e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'; e.currentTarget.style.borderColor = 'var(--red)'; } : undefined}
      onMouseLeave={clickable ? e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; } : undefined}
    >
      <div style={{ height: 130, background: theme !== 'dark' ? palette.bg : '#0d1117', overflow: 'hidden', flexShrink: 0 }}>
        <Thumb />
      </div>
      <div style={{ padding: '12px 14px', flex: 1 }}>
        <div style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: 4 }}>{group}</div>
        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--black)', marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.5 }}>{desc}</div>
      </div>
    </div>
  );
}

const USE_CASE_CARDS = [
  {
    Thumb:  makeThumb(IlloMapDisplay,           L_MapDisplay, IcoMapDisplay),
    group:  'Map Display',
    title:  'Render a Map',
    desc:   'Embed a fully interactive TomTom map into a Jetpack Compose or Android Views layout with styles, camera control, and live traffic.',
    pageId: 'navsdk-map-compose',
  },
  {
    Thumb:  makeThumb(IlloNavSDKNavigation,     L_NavGuidance, IcoNavSDKNavigation),
    group:  'Navigation',
    title:  'Start Turn-by-Turn Navigation',
    desc:   'Initiate a guided session with manoeuvre events, progress tracking, continuous replanning, and free-driving support.',
    pageId: 'navsdk-nav-quickstart',
  },
  {
    Thumb:  makeThumb(IlloNavSDKRouting,        L_Route, IcoNavSDKRouting),
    group:  'Routing',
    title:  'Calculate Route with Alternatives',
    desc:   'Request traffic-aware routes with up to three alternatives, compare section breakdowns, and import or export active routes.',
    pageId: 'navsdk-route-alternatives',
  },
  {
    Thumb:  makeThumb(IlloNavSDKNavigation,     L_NavGuidance, IcoNavSDKNavigation),
    group:  'Navigation',
    title:  'Add Voice Instructions',
    desc:   'Connect a text-to-speech engine to receive NIP events and synthesise turn-by-turn voice prompts during active guidance.',
    pageId: 'navsdk-nav-voice',
  },
  {
    Thumb:  makeThumb(IlloNavSDKOffline,        L_OfflineMaps, IcoNavSDKOffline),
    group:  'Offline',
    title:  'Enable Offline Maps',
    desc:   'Pre-download map regions for fully on-device routing and rendering without any network connectivity.',
    pageId: 'navsdk-offline-setup',
  },
  {
    Thumb:  makeThumb(IlloNavSDKLocation,       L_MapDisplay, IcoNavSDKLocation),
    group:  'Location',
    title:  'GPS Location Provider',
    desc:   'Attach the fused GNSS provider or a custom dead-reckoning engine to feed real-time position into the navigation stack.',
    pageId: 'navsdk-location-quickstart',
  },
  {
    Thumb:  makeThumb(IlloNavSDKVirtualHorizon, L_VirtualHorizon, IcoNavSDKVirtualHorizon),
    group:  'Virtual Horizon',
    title:  'Virtual Horizon & ADAS Data',
    desc:   'Read curvature, gradient, speed limits, and ahead-of-route events from the Horizon Engine for ADAS features.',
    pageId: 'navsdk-horizon-data',
  },
  {
    Thumb:  makeThumb(IlloNavSDKSearch,         L_SDKSearch, IcoNavSDKSearch),
    group:  'Search',
    title:  'Fuzzy Search',
    desc:   'Query the TomTom search API for destinations, POIs, and reverse-geocoded coordinates with autocomplete and along-route variants.',
    pageId: 'navsdk-search-find',
  },
  {
    Thumb:  makeThumb(IlloNavSDKAdvanced,       L_NavGuidance, IcoNavSDKAdvanced),
    group:  'Advanced',
    title:  'Simulate Navigation for Testing',
    desc:   'Drive the navigation engine along a pre-planned route at configurable speed to test guidance logic without a real vehicle.',
    pageId: 'navsdk-adv-simulation',
  },
];

/* ─── Capability card ────────────────────────────────────────────────────────── */
function CapabilityCard({ Thumb, title, desc, tag, onNavigate, pageId }) {
  const clickable = Boolean(pageId && onNavigate);
  const { theme, palette } = useIlloStyle();
  return (
    <div
      style={{ cursor: clickable ? 'pointer' : 'default', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--white)', transition: 'box-shadow 0.15s, border-color 0.15s', display: 'flex', flexDirection: 'column' }}
      onClick={clickable ? () => onNavigate(pageId) : undefined}
      onMouseEnter={clickable ? e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'; e.currentTarget.style.borderColor = 'var(--red)'; } : undefined}
      onMouseLeave={clickable ? e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; } : undefined}
    >
      <div style={{ height: 130, background: theme !== 'dark' ? palette.bg : '#0d1117', overflow: 'hidden', padding: theme !== 'dark' ? 0 : 10, flexShrink: 0 }}>
        <Thumb />
      </div>
      <div style={{ padding: '12px 14px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--black)' }}>{title}</div>
          {tag && <span style={{ fontSize: '0.875rem', padding: '1px 6px', borderRadius: 3, background: 'rgba(226,0,26,0.08)', color: '#e2001a', fontWeight: 600 }}>{tag}</span>}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.5 }}>{desc}</div>
      </div>
    </div>
  );
}

/* ─── Architecture diagram ──────────────────────────────────────────────────── */
function ArchDiagram({ t }) {
  const SDK_MODULES = [
    'Navigation Engine', 'Map Display', 'Routing', 'Search', 'Location', 'Virtual Horizon', 'Offline Maps',
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 600 }}>

      {/* Your App — top layer, developer's code */}
      <div style={{
        background: 'var(--s1)', border: '1px solid var(--border)',
        borderLeft: '3px solid #e2001a', borderRadius: 12,
        padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 26, height: 26, borderRadius: 6, flexShrink: 0,
          background: 'rgba(226,0,26,0.08)', border: '1px solid rgba(226,0,26,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M3 5l5-4 5 4v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5z" stroke="#e2001a" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M6 16v-5h4v5" stroke="#e2001a" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)', marginBottom: 1 }}>Your App</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Custom UI &amp; Business Logic</div>
        </div>
      </div>

      {/* Maps & Navigation SDK — single container wrapping modules + bundled platform */}
      <div style={{ border: '1px solid var(--border)', borderLeft: '3px solid #3b82f6', borderRadius: 12, overflow: 'hidden' }}>

        {/* SDK header */}
        <div style={{
          background: 'var(--bg)', borderBottom: '1px solid var(--border)',
          padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 26, height: 26, borderRadius: 6, flexShrink: 0,
            background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M5 3L1 8l4 5" stroke="#3b82f6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11 3l4 5-4 5" stroke="#3b82f6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)' }}>
            Maps &amp; Navigation SDK
          </span>
        </div>

        {/* Module pills */}
        <div style={{ padding: '10px 16px 12px', background: 'var(--s1)', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {SDK_MODULES.map(m => (
            <span key={m} style={{
              fontSize: '0.75rem', padding: '3px 10px', borderRadius: 6,
              background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--mid)',
            }}>{m}</span>
          ))}
        </div>

        {/* Bundled platform layers — inside the SDK boundary */}
        <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>

          {/* Zone label */}
          <div style={{ padding: '5px 16px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '0.5625rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.7 }}>Bundled</span>
          </div>

          {/* TomTom APIs */}
          <div style={{
            padding: '5px 16px', display: 'flex', alignItems: 'center', gap: 10,
            borderBottom: '1px solid var(--border)',
          }}>
            <div style={{
              width: 26, height: 26, borderRadius: 6, flexShrink: 0,
              background: 'var(--s1)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6.5" stroke="var(--muted)" strokeWidth="1.25"/>
                <path d="M8 1.5C8 1.5 5 4 5 8s3 6.5 3 6.5M8 1.5C8 1.5 11 4 11 8s-3 6.5-3 6.5M1.5 8h13" stroke="var(--muted)" strokeWidth="1.25" strokeLinecap="round"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--muted)', marginRight: 6 }}>TomTom APIs</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)', opacity: 0.7 }}>Routing · Traffic · Search · EV Data · ADAS</span>
            </div>
          </div>

          {/* TomTom Orbis Maps — foundation */}
          <div style={{
            padding: '5px 16px 8px', display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 26, height: 26, borderRadius: 6, flexShrink: 0,
              background: 'var(--s1)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <path d="M2 12L6 4l3 5 2-3 3 6H2z" stroke="var(--muted)" strokeWidth="1.25" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--muted)', marginRight: 6 }}>TomTom Orbis Maps</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)', opacity: 0.7 }}>Vector tiles · Map styles · Geocoding data · Real-time traffic feeds</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

/* ─── Platform card ─────────────────────────────────────────────────────────── */
function PlatformCard({ platform, items, active }) {
  return (
    <div style={{ flex: 1, border: `1px solid ${active ? '#e2001a' : 'var(--border)'}`, borderRadius: 20, padding: '16px 20px', background: active ? 'rgba(226,0,26,0.03)' : 'var(--surface)', transition: 'border-color 0.2s' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        {active && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#e2001a', flexShrink: 0 }} />}
        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--black)' }}>{platform}</span>
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
export default function NavSDKIntro({ onNavigate, platform = 'android' }) {
  const { t } = useTranslation('pages');
  const isAndroid = platform !== 'ios';

  const CAPABILITIES_SHARED = [
    {
      Thumb: makeThumb(IlloMapDisplay,     L_MapDisplay, IcoMapDisplay),
      title: t('navsdkIntro.capabilities.mapDisplay.title'),
      desc: t('navsdkIntro.capabilities.mapDisplay.desc'),
      pageId: 'navsdk-map-compose',
    },
    {
      Thumb: makeThumb(ThumbSearch,       L_SDKSearch, IcoNavSDKSearch),
      title: t('navsdkIntro.capabilities.search.title'),
      desc: t('navsdkIntro.capabilities.search.desc'),
      pageId: 'navsdk-search-quickstart',
    },
    {
      Thumb: makeThumb(ThumbRouting,      L_RouteOptions, IcoNavSDKRouting),
      title: t('navsdkIntro.capabilities.routing.title'),
      desc: t('navsdkIntro.capabilities.routing.desc'),
      pageId: 'navsdk-routing-quickstart',
    },
    {
      Thumb: makeThumb(IlloNavGuidance,   L_NavGuidance, IcoNavGuidance),
      title: t('navsdkIntro.capabilities.navigation.title'),
      desc: t('navsdkIntro.capabilities.navigation.desc'),
      pageId: 'navsdk-nav-quickstart',
    },
    {
      Thumb: makeThumb(ThumbVirtualHorizon, L_VirtualHorizon, IcoNavSDKVirtualHorizon),
      title: t('navsdkIntro.capabilities.virtualHorizon.title'),
      desc: t('navsdkIntro.capabilities.virtualHorizon.desc'),
      pageId: 'navsdk-horizon-data',
    },
  ];

  const CAPABILITIES_ANDROID = [
    ...CAPABILITIES_SHARED,
    {
      Thumb: makeThumb(ThumbOffline,      L_OfflineMaps, IcoNavSDKOffline),
      title: t('navsdkIntro.capabilities.offlineMaps.title'),
      desc: t('navsdkIntro.capabilities.offlineMaps.desc'),
      pageId: 'navsdk-offline-quickstart',
      tag: t('navsdkIntro.capabilities.offlineMaps.tag'),
    },
  ];

  const CAPABILITIES_IOS = [
    ...CAPABILITIES_SHARED,
    {
      Thumb: makeThumb(ThumbCarPlay,      L_CarPlay, IcoNavControls),
      title: t('navsdkIntro.capabilities.carPlay.title'),
      desc: t('navsdkIntro.capabilities.carPlay.desc'),
      pageId: 'navsdk-nav-quickstart',
      tag: t('navsdkIntro.capabilities.carPlay.tag'),
    },
  ];

  const capabilities = isAndroid ? CAPABILITIES_ANDROID : CAPABILITIES_IOS;

  return (
    <div className="page">
      <div className="page-header">
        <h1>{t('navsdkIntro.title')}</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        {isAndroid
          ? t('navsdkIntro.quickAnswerAndroid')
          : t('navsdkIntro.quickAnswerIos')}
      </p>

      {/* CTAs */}
      <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginBottom: 12 }}>
        Free tier includes 2,500 monthly active users — no credit card required.{' '}
        Get your API key at{' '}
        <a href="https://developer.tomtom.com" target="_blank" rel="noreferrer" style={{ color: 'var(--red)', fontWeight: 600 }}>developer.tomtom.com</a>.
      </p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 28 }}>
        <button
          onClick={() => onNavigate?.('navsdk-quickstart', 'navsdk')}
          style={{ background: '#e2001a', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: 6, fontWeight: 700, fontSize: '0.9375rem', cursor: 'pointer', letterSpacing: '-0.01em' }}
        >
          Quick Start →
        </button>
        <button
          onClick={() => onNavigate?.('navsdk-example-quickstart', 'navsdk')}
          style={{ background: 'transparent', color: 'var(--text)', border: '1.5px solid var(--border)', padding: '7px 18px', borderRadius: 6, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
        >
          Clone example app
        </button>
      </div>

      {/* Hero + proof strip */}
      <div className="ns-hero-banner" style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 36, border: '1px solid var(--border)', position: 'relative' }}>
        <img
          src={`${BASE}navsdk_banner.png`}
          alt={t('navsdkIntro.heroAlt')}
          style={{ width: '100%', display: 'block', maxHeight: 320, objectFit: 'cover', objectPosition: 'center 30%' }}
          onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
        />
        <div className="ns-hero-fallback" style={{ display: 'none', height: 220, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
          </svg>
          <span style={{ fontSize: '0.75rem' }}>{t('navsdkIntro.heroFallback')}</span>
        </div>

        {/* Proof strip — no gradient; bg inherited from .ns-hero-banner */}
        <div className="ns-proof-strip" style={{
          padding: '10px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 12, flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* App icon */}
            <div style={{ width: 28, height: 28, borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
              <svg width="28" height="28" viewBox="0 0 1028 1028" fill="none">
                <rect x="2" y="2" width="1024" height="1024" fill="white"/>
                <g clipPath="url(#ttapp-hero-clip)">
                  <path d="M606.721 703.224L516.438 859.161L426.155 703.224H606.721Z" fill="#DF1B12"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M516.446 177C646.325 177 751.987 282.374 751.987 411.895C751.986 541.41 646.324 646.781 516.446 646.781C386.568 646.78 280.906 541.409 280.905 411.895C280.905 282.374 386.568 177.001 516.446 177ZM516.446 289.104C448.555 289.104 393.328 344.19 393.328 411.895C393.329 479.593 448.555 534.677 516.446 534.677C584.337 534.677 639.571 479.593 639.572 411.895C639.572 344.19 584.337 289.104 516.446 289.104Z" fill="#DF1B12"/>
                </g>
                <defs>
                  <clipPath id="ttapp-hero-clip"><rect width="1028" height="1028" fill="white"/></clipPath>
                </defs>
              </svg>
            </div>
            <div>
              <span className="ns-proof-title" style={{ fontSize: '0.75rem', fontWeight: 700 }}>Proven in production</span>
              <span className="ns-proof-sub" style={{ fontSize: '0.75rem', marginLeft: 6 }}>TomTom App — 235+ countries, real-time traffic &amp; EV routing</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            {[
              { href: 'https://apps.apple.com/app/tomtom-maps-traffic/id1438106561', label: 'App Store' },
              { href: 'https://play.google.com/store/apps/details?id=com.tomtom.speedcams.android.map', label: 'Google Play' },
            ].map(({ href, label }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer"
                className="ns-proof-btn"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 6, fontSize: '0.6875rem', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}
              >{label}</a>
            ))}
          </div>
        </div>
      </div>

      {/* When to choose */}
      <div className="zone">
        <h2 className="sh" id="ns-when">{t('navsdkIntro.whenTitle')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          <WhenCard type="check" title={t('navsdkIntro.whenCards.fullUiOwnership.title')}>
            {t('navsdkIntro.whenCards.fullUiOwnership.desc')}
          </WhenCard>
          <WhenCard type="check" title={t('navsdkIntro.whenCards.modularByDesign.title')}>
            {t('navsdkIntro.whenCards.modularByDesign.desc')}
          </WhenCard>
          <WhenCard type="check" title={t('navsdkIntro.whenCards.androidAndIos.title')}>
            {t('navsdkIntro.whenCards.androidAndIos.desc')}
          </WhenCard>
          <WhenCard type="check" title={t('navsdkIntro.whenCards.extensible.title')}>
            {t('navsdkIntro.whenCards.extensible.desc')}
          </WhenCard>
          {isAndroid ? (
            <WhenCard type="warn" title={t('navsdkIntro.whenCards.youBuildUiAndroid.title')}>
              {t('navsdkIntro.whenCards.youBuildUiAndroid.descPart1')}
              <DocLink pageId="overview" productId="ux-library" onNavigate={onNavigate}>{t('navsdkIntro.whenCards.youBuildUiAndroid.uxLibraryLink')}</DocLink>
              {t('navsdkIntro.whenCards.youBuildUiAndroid.descPart2')}
            </WhenCard>
          ) : (
            <WhenCard type="warn" title={t('navsdkIntro.whenCards.youBuildUiIos.title')}>
              {t('navsdkIntro.whenCards.youBuildUiIos.desc')}
            </WhenCard>
          )}
          {isAndroid ? (
            <WhenCard type="warn" title={t('navsdkIntro.whenCards.longerTimeAndroid.title')}>
              {t('navsdkIntro.whenCards.longerTimeAndroid.descPart1')}
              <DocLink pageId="overview" productId="ux-library" onNavigate={onNavigate}>{t('navsdkIntro.whenCards.longerTimeAndroid.uxLibraryLink')}</DocLink>
              {t('navsdkIntro.whenCards.longerTimeAndroid.descPart2')}
              <DocLink pageId="ana-intro" productId="ana" onNavigate={onNavigate}>{t('navsdkIntro.whenCards.longerTimeAndroid.anaLink')}</DocLink>
              {t('navsdkIntro.whenCards.longerTimeAndroid.descPart3')}
            </WhenCard>
          ) : (
            <WhenCard type="warn" title={t('navsdkIntro.whenCards.longerTimeIos.title')}>
              {t('navsdkIntro.whenCards.longerTimeIos.descPart1')}
              <DocLink pageId="ana-intro" productId="ana" onNavigate={onNavigate}>{t('navsdkIntro.whenCards.longerTimeIos.anaLink')}</DocLink>
              {t('navsdkIntro.whenCards.longerTimeIos.descPart2')}
            </WhenCard>
          )}
        </div>
      </div>

      {/* Key use cases */}
      <div className="zone">
        <h2 className="sh" id="ns-usecases">Key use cases</h2>
        <p className="quick-answer" style={{ marginBottom: 20 }}>
          The most commonly needed NavSDK capabilities — click any card to jump straight to the documentation.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {USE_CASE_CARDS.map(card => (
            <UseCaseCard key={`${card.pageId}-${card.title}`} {...card} onNavigate={onNavigate} />
          ))}
        </div>
      </div>

      {/* Capabilities */}
      <div className="zone">
        <h2 className="sh" id="ns-capabilities">{t('navsdkIntro.capabilitiesTitle')}</h2>
        <p className="quick-answer" style={{ marginBottom: 20 }}>
          {isAndroid
            ? t('navsdkIntro.capabilitiesSubtitleAndroid')
            : t('navsdkIntro.capabilitiesSubtitleIos')}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {capabilities.map(cap => (
            <CapabilityCard key={cap.title} {...cap} onNavigate={onNavigate} />
          ))}
        </div>
      </div>

      {/* Architecture */}
      <div className="zone">
        <h2 className="sh" id="ns-arch">{t('navsdkIntro.archTitle')}</h2>
        <p className="body" style={{ marginBottom: 20 }}>
          {t('navsdkIntro.archBody')}
        </p>
        <ArchDiagram t={t} />
      </div>

      {/* SDK Editions — platform-aware */}
      <div className="zone">
        <h2 className="sh" id="ns-editions">SDK editions</h2>
        {(() => {
          const Y = '✓'; const N = '—';
          const cellStyle = (val, col) => {
            const isTick = val === Y, isDash = val === N;
            return (
              <td style={{
                padding: '9px 14px', fontSize: '0.8125rem', textAlign: 'left',
                color: isTick ? col.color : isDash ? 'var(--border)' : 'var(--mid)',
                fontWeight: isTick ? 700 : 400,
                borderBottom: '1px solid var(--border)',
              }}>{val}</td>
            );
          };

          if (isAndroid) {
            const COMPLETE = { label: 'Complete', status: 'Production',  statusColor: '#15803d', statusBg: 'rgba(34,197,94,0.12)',  color: '#15803d' };
            const BETA     = { label: 'Beta',     status: 'Preview',     statusColor: '#7c3aed', statusBg: 'rgba(168,85,247,0.12)', color: '#7c3aed' };
            const EXTENDED = { label: 'Extended', status: 'Enterprise',  statusColor: '#92400e', statusBg: 'rgba(234,179,8,0.12)',  color: '#92400e' };
            const rows = [
              { label: 'SDK flavor',               c: 'complete',               b: 'complete',               e: 'extended'           },
              { label: 'Access',                   c: 'Free tier · Self-serve', b: 'Opt-in — contact sales', e: 'Sales contract'     },
              { label: 'Package manager',          c: 'Maven (public)',         b: 'Maven (public)',         e: 'Maven (private)'    },
              { label: 'Min SDK',                  c: 'API 26+ (Android 8)',    b: 'API 26+ (Android 8)',    e: 'API 26+ (Android 8)'},
              { label: 'UI framework',             c: 'Compose · XML Views',   b: 'Compose · XML Views',   e: 'Compose · XML Views'},
              { label: 'Map Display',              c: Y, b: Y, e: Y },
              { label: 'Navigation Engine',        c: Y, b: Y, e: Y },
              { label: 'Routing',                  c: Y, b: Y, e: Y },
              { label: 'Search',                   c: Y, b: Y, e: Y },
              { label: 'Location',                 c: Y, b: Y, e: Y },
              { label: 'Virtual Horizon',          c: Y, b: Y, e: Y },
              { label: 'Offline Maps',             c: Y, b: Y, e: Y },
              { label: 'Online First',             c: N, b: Y, e: Y },
              { label: 'EV Experience',            c: N, b: Y, e: Y },
              { label: 'Extended configurability', c: N, b: N, e: Y },
            ];
            return (
              <>
                <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--border)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg)' }}>
                        <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border)', width: '34%' }} />
                        {[COMPLETE, BETA, EXTENDED].map(v => (
                          <th key={v.label} style={{ padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid var(--border)', width: '22%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: v.color }}>{v.label}</span>
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
                          {cellStyle(row.c, COMPLETE)}
                          {cellStyle(row.b, BETA)}
                          {cellStyle(row.e, EXTENDED)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 20 }}>
                  {[
                    { badge: 'Complete', badgeColor: '#15803d', badgeBg: 'rgba(34,197,94,0.12)',  title: 'Complete edition', desc: 'All core navigation modules. Self-serve via public Maven — no approval needed.', pageId: 'navsdk-quickstart' },
                    { badge: 'Beta',     badgeColor: '#7c3aed', badgeBg: 'rgba(168,85,247,0.12)', title: 'Beta features',    desc: 'Online First and EV Experience. Opt-in required — contact sales to request access.', href: 'https://www.tomtom.com/contact-sales' },
                    { badge: 'Extended', badgeColor: '#92400e', badgeBg: 'rgba(234,179,8,0.12)',  title: 'Extended edition', desc: 'Full configurability for custom integrations. Requires a sales contract and private registry credentials.', href: 'https://www.tomtom.com/contact-sales' },
                  ].map(card => (
                    <button key={card.badge} className="text-card"
                      onClick={() => card.pageId ? onNavigate?.(card.pageId, 'navsdk') : window.open(card.href, '_blank')}>
                      <div style={{ marginBottom: 10 }}>
                        <span style={{ fontSize: '0.6rem', fontWeight: 700, padding: '2px 7px', borderRadius: 3, background: card.badgeBg, color: card.badgeColor, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{card.badge}</span>
                      </div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--black)', marginBottom: 5 }}>{card.title}</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--mid)', lineHeight: 1.5 }}>{card.desc}</div>
                    </button>
                  ))}
                </div>
              </>
            );
          }

          /* ── iOS ─────────────────────────────────────────────────────────── */
          const IOS = { label: 'Navigation SDK', status: 'On request', statusColor: '#92400e', statusBg: 'rgba(234,179,8,0.12)', color: '#92400e' };
          const iosRows = [
            { label: 'SDK version',      v: '0.72.1'                         },
            { label: 'Access',           v: 'Contact sales — available on request' },
            { label: 'Package manager',  v: 'SPM or CocoaPods'               },
            { label: 'Min iOS version',  v: 'iOS 15.0+'                      },
            { label: 'UI framework',     v: 'SwiftUI · UIKit'                 },
            { label: 'Map Display',      v: Y },
            { label: 'Navigation Engine',v: Y },
            { label: 'Routing',          v: Y },
            { label: 'Search',           v: Y },
            { label: 'Location',         v: Y },
            { label: 'Virtual Horizon',  v: Y },
            { label: 'Offline Maps',     v: Y },
            { label: 'EV Route Planning',v: Y },
            { label: 'CarPlay',          v: Y },
            { label: 'Online First',     v: N },
            { label: 'AAOS (Android)',   v: N },
          ];
          return (
            <>
              <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--border)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg)' }}>
                      <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border)', width: '50%' }} />
                      <th style={{ padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid var(--border)', width: '50%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: IOS.color }}>{IOS.label}</span>
                          <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 4, background: IOS.statusBg, color: IOS.statusColor, whiteSpace: 'nowrap' }}>{IOS.status}</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {iosRows.map((row, i) => (
                      <tr key={row.label} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--bg)' }}>
                        <td style={{ padding: '9px 14px', fontWeight: 600, color: 'var(--black)', borderBottom: '1px solid var(--border)', fontSize: '0.8125rem' }}>{row.label}</td>
                        {cellStyle(row.v, IOS)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 20 }}>
                {[
                  { badge: 'iOS', badgeColor: '#92400e', badgeBg: 'rgba(234,179,8,0.12)', title: 'Navigation SDK for iOS', desc: 'SwiftUI and UIKit support including CarPlay. Available on request via SPM or CocoaPods.', href: 'https://www.tomtom.com/contact-sales' },
                  { badge: 'iOS', badgeColor: '#92400e', badgeBg: 'rgba(234,179,8,0.12)', title: 'Request access', desc: 'Contact TomTom sales to get credentials and start integrating the iOS Navigation SDK.', href: 'https://www.tomtom.com/contact-sales' },
                  { badge: 'iOS', badgeColor: '#92400e', badgeBg: 'rgba(234,179,8,0.12)', title: 'iOS Quick Start', desc: 'Project setup, API key configuration, and your first navigation session on iOS.', pageId: 'navsdk-ios-getting-started' },
                ].map(card => (
                  <button key={card.title} className="text-card"
                    onClick={() => card.pageId ? onNavigate?.(card.pageId, 'navsdk') : window.open(card.href, '_blank')}>
                    <div style={{ marginBottom: 10 }}>
                      <span style={{ fontSize: '0.6rem', fontWeight: 700, padding: '2px 7px', borderRadius: 3, background: card.badgeBg, color: card.badgeColor, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{card.badge}</span>
                    </div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--black)', marginBottom: 5 }}>{card.title}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--mid)', lineHeight: 1.5 }}>{card.desc}</div>
                  </button>
                ))}
              </div>
            </>
          );
        })()}
      </div>


      <Callout type="info">
        {t('navsdkIntro.callout').split(t('navsdkIntro.calloutMigrationGuide'))[0]}
        <strong>{t('navsdkIntro.calloutMigrationGuide')}</strong>
        {t('navsdkIntro.callout').split(t('navsdkIntro.calloutMigrationGuide'))[1]}
      </Callout>
    </div>
  );
}
