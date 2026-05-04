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
        <span style={{ fontSize: '0.9rem', lineHeight: 1.2 }}>{icon}</span>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--black)' }}>{title}</span>
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}

/* ─── Integration layer diagram ─────────────────────────────────────────────── */
function IntegrationDiagram() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxWidth: 600 }}>
      {/* OEM App layer */}
      <div style={{ background: 'rgba(0,102,204,0.09)', border: '1px solid rgba(0,102,204,0.3)', borderRadius: '8px 8px 0 0', padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#0066cc', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Your Layer</span>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['OEM HMI App', 'Vehicle ECU / IVI', 'EV Battery System', 'Dashboard Cluster'].map(item => (
            <span key={item} style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: 4, background: 'rgba(0,102,204,0.12)', border: '1px solid rgba(0,102,204,0.25)', color: '#0066cc', fontWeight: 500 }}>{item}</span>
          ))}
        </div>
      </div>

      {/* Arrows down */}
      <div style={{ display: 'flex', gap: 8, padding: '2px 0', justifyContent: 'center' }}>
        {['VIL', 'CIL'].map(label => (
          <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <div style={{ width: 1, height: 6, background: 'var(--border)' }}/>
            <span style={{ fontSize: '0.5rem', color: 'var(--muted)', fontWeight: 600 }}>{label}</span>
            <div style={{ width: 1, height: 6, background: 'var(--border)' }}/>
          </div>
        ))}
      </div>

      {/* Integration layers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
        <div style={{ background: 'rgba(63,185,80,0.08)', border: '1px solid rgba(63,185,80,0.3)', borderRadius: 6, padding: '10px 14px' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#3fb950', marginBottom: 4 }}>VIL — Vehicle Integration Layer</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            Push vehicle data <em>into</em> ANA. Feed EV state, GDPR consent, speed, and cluster data to the navigation engine.
          </div>
          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {['EV SoC', 'Connectors', 'Speed', 'GDPR', 'Cluster'].map(tag => (
              <span key={tag} style={{ fontSize: '0.58rem', padding: '1px 5px', borderRadius: 3, background: 'rgba(63,185,80,0.1)', color: '#3fb950', border: '1px solid rgba(63,185,80,0.2)' }}>{tag}</span>
            ))}
          </div>
        </div>
        <div style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 6, padding: '10px 14px' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a855f7', marginBottom: 4 }}>CIL — Car Integration Layer</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            Control ANA <em>from</em> your app. Trigger navigation, set destinations, manage routes, and query nav state.
          </div>
          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {['Navigate to', 'Route info', 'POI search', 'ETA', 'Cancel'].map(tag => (
              <span key={tag} style={{ fontSize: '0.58rem', padding: '1px 5px', borderRadius: 3, background: 'rgba(168,85,247,0.1)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.2)' }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Arrow */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2px 0' }}>
        <div style={{ width: 1, height: 12, background: 'var(--border)' }}/>
      </div>

      {/* ANA core */}
      <div style={{ background: 'rgba(226,0,26,0.08)', border: '1px solid rgba(226,0,26,0.3)', borderRadius: '0 0 8px 8px', padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#e2001a' }}/>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#e2001a' }}>ANA — Automotive Navigation Application (APK)</span>
        </div>
        <div style={{ fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.4 }}>
          TomTom-maintained navigation APK. Full AAOS navigation experience: map, search, routing, EV charging, guidance, cluster output, and OEM theming — all pre-built and tested.
        </div>
      </div>
    </div>
  );
}

/* ─── Screenshot showcase ────────────────────────────────────────────────────── */
const SCREENSHOTS = [
  {
    src: 'ana_live_traffic.png',
    label: 'Live Traffic & Smart Rerouting',
    desc: 'Real-time traffic overlays with automatic better-route suggestions during active navigation.',
  },
  {
    src: 'ana_pmd.png',
    label: 'Premium Map Display',
    desc: 'High-fidelity 3D vector maps with day and night modes, fully styled to OEM brand guidelines.',
  },
  {
    src: 'ana_ev_charging.png',
    label: 'EV Charging Station Search',
    desc: 'Connector-aware search shows nearby stations with live availability and power ratings.',
  },
  {
    src: 'ana_automatic_routes.png',
    label: 'Long-Distance EV Route Planning',
    desc: 'Automatic charging stop insertion based on battery state and connector compatibility.',
  },
];

function ScreenshotShowcase() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
      {SCREENSHOTS.map(({ src, label, desc }) => (
        <div key={src} style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--surface)' }}>
          <div style={{ height: 180, overflow: 'hidden', background: '#0d1117' }}>
            <img
              src={`${BASE}${src}`}
              alt={label}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
            />
          </div>
          <div style={{ padding: '10px 12px' }}>
            <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--black)', marginBottom: 3 }}>{label}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.5 }}>{desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Feature card thumbnails ────────────────────────────────────────────────── */
function ThumbPhoto({ src, objectPosition = 'center top' }) {
  return (
    <img
      src={`${BASE}${src}`}
      alt=""
      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition, display: 'block' }}
    />
  );
}

function ThumbVIL() {
  const M = { bg: '#0d1117', card: '#161b22', line: '#21262d', text: '#e6edf3', dim: '#8b949e', green: '#3fb950' };
  const signals = [['Battery SoC', '74%', '#3fb950'], ['Connector type', 'CCS2', '#58a6ff'], ['Speed', '87 km/h', '#fbbf24'], ['GDPR consent', 'Granted', '#3fb950']];
  return (
    <div style={{ background: M.bg, borderRadius: 8, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.52rem', fontWeight: 700, color: M.text, marginBottom: 2 }}>VIL — Vehicle signals</div>
      <div style={{ fontSize: '0.44rem', color: M.green, marginBottom: 8 }}>← Feeding into ANA</div>
      {signals.map(([label, value, color]) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0', borderBottom: `1px solid ${M.line}` }}>
          <div style={{ flex: 1, fontSize: '0.5rem', color: M.dim }}>{label}</div>
          <span style={{ fontSize: '0.52rem', fontWeight: 600, color }}>{value}</span>
        </div>
      ))}
    </div>
  );
}

function ThumbCIL() {
  const M = { bg: '#0d1117', card: '#161b22', line: '#21262d', text: '#e6edf3', dim: '#8b949e', purple: '#a855f7' };
  const cmds = [['navigateTo(destination)', 'Sets active route'], ['cancelNavigation()', 'Ends session'], ['searchNearby(query)', 'Returns POI list']];
  return (
    <div style={{ background: M.bg, borderRadius: 8, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.52rem', fontWeight: 700, color: M.text, marginBottom: 2 }}>CIL — Control API</div>
      <div style={{ fontSize: '0.44rem', color: M.purple, marginBottom: 8 }}>→ Commanding ANA</div>
      {cmds.map(([fn, desc]) => (
        <div key={fn} style={{ background: M.card, border: `1px solid ${M.line}`, borderRadius: 4, padding: '5px 7px', marginBottom: 4 }}>
          <div style={{ fontSize: '0.5rem', fontFamily: 'monospace', color: M.purple }}>{fn}</div>
          <div style={{ fontSize: '0.44rem', color: M.dim, marginTop: 1 }}>{desc}</div>
        </div>
      ))}
    </div>
  );
}

function ThumbTheming() {
  const tokens = [
    { name: '--brand-primary', from: '#e2001a', to: '#0066ff' },
    { name: '--corner-radius', from: '4dp', to: '12dp', text: true },
    { name: '--font-family', from: 'Roboto', to: 'Inter', text: true },
  ];
  return (
    <div style={{ background: '#0d1117', borderRadius: 8, overflow: 'hidden', height: '100%', padding: '10px 12px' }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: '#8b949e', marginBottom: 9, textTransform: 'uppercase', letterSpacing: '0.06em' }}>OEM Theme tokens</div>
      {tokens.map(({ name, from, to, text }) => (
        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
          {!text
            ? <div style={{ width: 26, height: 14, borderRadius: 3, background: from, flexShrink: 0 }} />
            : <div style={{ width: 26, height: 14, borderRadius: 3, background: '#161b22', border: '1px solid #21262d', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '0.38rem', color: '#e2001a', fontFamily: 'monospace' }}>{from}</span>
              </div>}
          <span style={{ fontSize: '0.44rem', color: '#8b949e', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>{name}</span>
          <span style={{ fontSize: '0.6rem', color: '#374151' }}>→</span>
          {!text
            ? <div style={{ width: 26, height: 14, borderRadius: 3, background: to, flexShrink: 0 }} />
            : <div style={{ width: 26, height: 14, borderRadius: 3, background: '#161b22', border: '1px solid #21262d', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '0.38rem', color: '#0066ff', fontFamily: 'monospace' }}>{to}</span>
              </div>}
        </div>
      ))}
    </div>
  );
}

/* ─── Feature card ───────────────────────────────────────────────────────────── */
function FeatureCard({ Thumb, src, objectPosition, title, desc, tag, pageId, onNavigate }) {
  const clickable = Boolean(pageId && onNavigate);
  return (
    <div
      style={{ cursor: clickable ? 'pointer' : 'default', borderRadius: 10, border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--white)', transition: 'box-shadow 0.15s, border-color 0.15s', display: 'flex', flexDirection: 'column' }}
      onClick={clickable ? () => onNavigate(pageId) : undefined}
      onMouseEnter={clickable ? e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'; e.currentTarget.style.borderColor = 'var(--red)'; } : undefined}
      onMouseLeave={clickable ? e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; } : undefined}
    >
      <div style={{ height: 130, background: '#0d1117', overflow: 'hidden', flexShrink: 0 }}>
        {src
          ? <ThumbPhoto src={src} objectPosition={objectPosition} />
          : <div style={{ padding: 10, height: '100%' }}><Thumb /></div>
        }
      </div>
      <div style={{ padding: '12px 14px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--black)' }}>{title}</div>
          {tag && <span style={{ fontSize: '0.62rem', padding: '1px 6px', borderRadius: 3, background: 'rgba(226,0,26,0.08)', color: '#e2001a', fontWeight: 600 }}>{tag}</span>}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.5 }}>{desc}</div>
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────────── */
const FEATURES = [
  {
    src: 'ana_live_traffic.png',
    objectPosition: 'center 30%',
    title: 'Driver Experience',
    desc: 'Full turn-by-turn navigation UI — search, route planning, guidance, ETA panel, traffic alerts, and arrival — all pre-built and tested.',
    pageId: 'ana-driver-experience',
  },
  {
    Thumb: ThumbVIL,
    title: 'Vehicle Integration Layer',
    desc: 'Feed vehicle signals into ANA: EV battery state, connector type, GDPR consent, and cluster output. VIL is your data pipe into the navigation engine.',
    pageId: 'ana-vil',
  },
  {
    Thumb: ThumbCIL,
    title: 'Car Integration Layer',
    desc: 'Command ANA from your app: trigger navigation to a destination, cancel routes, search nearby POIs, and query live navigation state.',
    pageId: 'ana-cil',
    tag: 'Control API',
  },
  {
    Thumb: ThumbTheming,
    title: 'OEM Theming',
    desc: 'Override design tokens — colours, typography, corner radius, and icon sets — to match your brand without touching ANA internals.',
    pageId: 'ana-theming',
  },
  {
    src: 'ana_ev_charging.png',
    objectPosition: 'center 20%',
    title: 'EV Support',
    desc: 'Connector-aware charging station search, battery-integrated long-range routing, and real-time SoC display built in from day one.',
    pageId: 'ana-vil-ev',
    tag: 'EV',
  },
];

export default function ANAIntro({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Introduction</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        The Automotive Navigation Application (ANA) is TomTom's pre-built navigation APK for Android Automotive OS. OEMs integrate it as a complete navigation solution and connect to it through two lightweight layers — VIL and CIL — rather than building navigation from scratch.
      </p>

      {/* Hero — real ANA UI screenshot */}
      <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 36, border: '1px solid var(--border)' }}>
        <img
          src={`${BASE}ana_live_traffic.png`}
          alt="ANA — live traffic and better route suggestion on AAOS"
          style={{ width: '100%', display: 'block' }}
        />
      </div>

      {/* What is ANA */}
      <div className="zone">
        <h2 className="sh" id="ana-what">What is ANA?</h2>
        <p className="body">
          ANA is a fully functional navigation application delivered as an Android APK. TomTom maintains the application — including maps, routing engine, UI, and feature updates — and ships it to OEMs as a versioned release. OEMs do not build or maintain the navigation UI themselves.
        </p>
        <p className="body">
          Instead of exposing a large SDK surface, ANA offers two narrow integration points: the <strong>Vehicle Integration Layer (VIL)</strong> for feeding vehicle data into the app, and the <strong>Car Integration Layer (CIL)</strong> for controlling the app from other vehicle software. Both are lightweight APIs that can be implemented in a few days.
        </p>
      </div>

      {/* Screenshot showcase */}
      <div className="zone">
        <h2 className="sh" id="ana-screenshots">In-car experience</h2>
        <p className="quick-answer" style={{ marginBottom: 20 }}>
          ANA delivers a complete AAOS navigation experience out of the box — from premium map rendering to automated EV route planning.
        </p>
        <ScreenshotShowcase />
      </div>

      {/* When to choose ANA */}
      <div className="zone">
        <h2 className="sh" id="ana-when">When to choose ANA</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          <WhenCard icon="✅" title="Fast time to market">
            No navigation UI to build or test — integration is measured in weeks, not months.
          </WhenCard>
          <WhenCard icon="✅" title="TomTom-maintained UX">
            Map content, routing algorithms, and UI improvements ship as APK updates with no OEM effort.
          </WhenCard>
          <WhenCard icon="✅" title="Full EV support">
            Battery-integrated route planning, connector-aware search, and SoC display are included out of the box.
          </WhenCard>
          <WhenCard icon="✅" title="AAOS-certified">
            ANA is designed and tested for Android Automotive OS and passes AAOS compatibility requirements.
          </WhenCard>
          <WhenCard icon="⚠️" title="Limited UI customisation">
            ANA supports token-based theming but the navigation UI layout is fixed. For more UI flexibility, see{' '}
            <DocLink pageId="overview" productId="ux-library" onNavigate={onNavigate}>UX Library</DocLink> for
            customisable pre-built components, or the{' '}
            <DocLink pageId="navsdk-intro" productId="navsdk" onNavigate={onNavigate}>Maps &amp; Navigation SDK</DocLink>{' '}
            for a fully custom experience.
          </WhenCard>
          <WhenCard icon="⚠️" title="APK dependency">
            Your IVI integrates ANA as a separate APK. You do not own the navigation source code.
          </WhenCard>
        </div>
      </div>

      {/* Integration architecture */}
      <div className="zone">
        <h2 className="sh" id="ana-arch">Integration architecture</h2>
        <p className="body" style={{ marginBottom: 20 }}>
          ANA sits between your vehicle software and the TomTom platform. VIL flows data up; CIL sends commands down. Your HMI app never calls TomTom APIs directly.
        </p>
        <IntegrationDiagram />
      </div>

      {/* Features */}
      <div className="zone">
        <h2 className="sh" id="ana-features">What's included</h2>
        <p className="quick-answer" style={{ marginBottom: 20 }}>
          ANA ships with a complete set of navigation features. OEMs configure rather than build.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {FEATURES.map(f => (
            <FeatureCard key={f.title} {...f} onNavigate={onNavigate} />
          ))}
        </div>
      </div>

      {/* Getting started CTA */}
      <div className="zone">
        <h2 className="sh" id="ana-start">Ready to integrate?</h2>
        <p className="body" style={{ marginBottom: 16 }}>
          Start with the System Overview to understand how ANA fits into your IVI stack, then follow the Quick Start guide to get navigation running in your first session.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            className="page-action-btn"
            style={{ background: '#e2001a', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 6, fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}
            onClick={() => onNavigate?.('ana-system-overview')}
          >
            System Overview
          </button>
          <button
            className="page-action-btn"
            onClick={() => onNavigate?.('ana-quick-start')}
          >
            Quick Start
          </button>
        </div>
      </div>

      <Callout type="info">
        ANA is targeted at Android Automotive OS. It is not a general Android app and does not run on standard Android phones or tablets. For phone or tablet navigation, use the Maps &amp; Navigation SDK.
      </Callout>
    </div>
  );
}
