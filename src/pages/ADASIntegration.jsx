import Callout from '../components/ui/Callout';

/* ─── Capability icons ───────────────────────────────────────────────────── */
function IconISA() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M7 15l3-4 2 2 3-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
    </svg>
  );
}
function IconPredictive() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 17l5-6 4 3 5-7 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 7h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconAlerts() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
function IconLane() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 20V4M12 20V4M19 20V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 3"/>
      <rect x="8" y="9" width="8" height="6" rx="1" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}
function IconEV() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M13 2L4.5 13.5H12L11 22L19.5 10.5H12L13 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconODD() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2"/>
      <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

/* ─── Data ───────────────────────────────────────────────────────────────── */
const HIGHLIGHTS = [
  { label: 'Standalone SDK',       sub: 'No TomTom Nav required' },
  { label: 'Euro NCAP ready',      sub: 'ISA & safety compliance' },
  { label: 'Any nav provider',     sub: 'Works alongside incumbents' },
  { label: 'Scales across tiers',  sub: 'One codebase, all trims' },
];

const CAPABILITIES = [
  {
    Icon: IconISA,
    title: 'Intelligent Speed Assistance',
    tag: 'ISA / Euro NCAP',
    line: 'Real-time and predictive speed limits for advisory and intervention control.',
  },
  {
    Icon: IconPredictive,
    title: 'Predictive Speed Control',
    tag: 'Powertrain',
    line: 'Looks ahead along the route horizon to proactively adjust speed.',
  },
  {
    Icon: IconAlerts,
    title: 'Safety Alerts',
    tag: 'Live map data',
    line: 'Warns of hazards, school zones, and danger areas before they arrive.',
  },
  {
    Icon: IconLane,
    title: 'Intelligent Lane Control',
    tag: 'HD lane geometry',
    line: 'Lane-level data for keeping and lane-change assist systems.',
  },
  {
    Icon: IconEV,
    title: 'EV Energy Optimisation',
    tag: 'Drivetrain',
    line: 'Horizon gradients inform predictive regen and efficient drive modes.',
  },
  {
    Icon: IconODD,
    title: 'Operational Design Domain',
    tag: 'Automated driving',
    line: 'Defines road conditions where automated features can safely engage.',
  },
];

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function ADASIntegration() {
  return (
    <div className="page">

      <div className="page-header">
        <h1>Advanced Driver Assistance (ADAS)</h1>
        <div className="page-meta">
          <span className="meta-tag">Android SDK</span>
          <span className="meta-tag">Vehicle Integration</span>
          <span className="meta-tag private">Request access</span>
        </div>
        <p className="page-intro">
          A standalone, modular safety layer that augments any existing navigation stack
          with horizon-aware features — without replacing your incumbent nav provider.
        </p>
      </div>

      {/* Access notice */}
      <Callout type="warn">
        Full SDK documentation and integration guides are available under a separate access agreement.
        Contact your TomTom account representative or request via the{' '}
        <a href="https://developer.tomtom.com/adas/android/introduction/introduction"
          target="_blank" rel="noopener noreferrer"
          style={{ color: 'inherit', textDecoration: 'underline' }}>
          TomTom developer portal
        </a>.
      </Callout>

      {/* At a glance */}
      <div className="zone" id="adas-overview">
        <h2 className="sh">Overview</h2>
        <div className="adas-highlights">
          {HIGHLIGHTS.map(h => (
            <div key={h.label} className="adas-highlight-chip">
              <span className="adas-chip-label">{h.label}</span>
              <span className="adas-chip-sub">{h.sub}</span>
            </div>
          ))}
        </div>
        <p className="body" style={{ marginTop: 20 }}>
          The ADAS SDK runs as a lightweight overlay on your navigation stack, consuming TomTom
          map and horizon data to deliver predictive safety — knowing what's ahead before it
          arrives. Because it's decoupled from full navigation, it eliminates redundant map
          components and scales cost-effectively across vehicle tiers from a shared codebase.
        </p>
      </div>

      {/* Capabilities */}
      <div className="zone" id="adas-capabilities">
        <h2 className="sh">Capabilities</h2>
        <div className="adas-cap-grid">
          {CAPABILITIES.map(({ Icon, title, tag, line }) => (
            <div key={title} className="adas-cap-card">
              <div className="adas-cap-icon"><Icon /></div>
              <div className="adas-cap-body">
                <div className="adas-cap-title">{title}</div>
                <span className="adas-cap-tag">{tag}</span>
                <p className="adas-cap-line">{line}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integration model */}
      <div className="zone" id="adas-integration">
        <h2 className="sh">Integration model</h2>
        <p className="body">
          The ADAS SDK sits as a thin layer above any navigation provider already in the vehicle,
          drawing only map and horizon data from TomTom.
        </p>

        <div className="adas-stack">
          <div className="adas-stack-layer adas-stack-top">
            <span className="adas-stack-label">Your application</span>
            <span className="adas-stack-note">Responds to UX state events</span>
          </div>
          <div className="adas-stack-arrow">↓</div>
          <div className="adas-stack-layer adas-stack-highlight">
            <span className="adas-stack-label">TomTom ADAS SDK</span>
            <span className="adas-stack-note">Safety &amp; horizon layer</span>
          </div>
          <div className="adas-stack-arrow">↓</div>
          <div className="adas-stack-layer">
            <span className="adas-stack-label">Your navigation provider</span>
            <span className="adas-stack-note">Incumbent or TomTom Nav SDK</span>
          </div>
          <div className="adas-stack-arrow">↓</div>
          <div className="adas-stack-layer adas-stack-muted">
            <span className="adas-stack-label">TomTom map &amp; horizon data</span>
            <span className="adas-stack-note">HD map, speed limits, live events</span>
          </div>
        </div>

        <Callout type="info">
          Already integrating TomTom Navigation SDK? ADAS features including safety alerts and
          speed assistance are built in — no separate ADAS SDK needed.
        </Callout>
      </div>

    </div>
  );
}
