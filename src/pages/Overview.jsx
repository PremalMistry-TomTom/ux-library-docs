import Callout from '../components/ui/Callout';

const SECTIONS = [
  {
    group: 'Assets',
    items: [
      { id: 'design-tokens',  label: 'Design tokens',      desc: 'Token architecture, naming conventions & tier structure' },
      { id: 'colour',         label: 'Colour',             desc: 'Global palettes, system tokens & semantic definitions' },
      { id: 'font',           label: 'Font',               desc: 'Typography tokens, scale & component mappings' },
      { id: 'corner-radius',  label: 'Corner radius',      desc: 'Radius scale from null (0dp) through to full (50%)' },
    ],
  },
  {
    group: 'App Customisation',
    items: [
      { id: 'home-screen-layout', label: 'Home Screen Layout', desc: 'Map as wallpaper, application area sizing & UI state signals' },
      { id: 'search-engine',      label: 'Search engine',      desc: 'Replace the search provider, connectivity transitions & UI enrichment' },
    ],
  },
];

function NavCard({ id, label, desc, onNavigate }) {
  return (
    <div
      onClick={() => onNavigate(id)}
      style={{
        flex: '1 1 200px', padding: '14px 16px',
        background: 'var(--bg)', border: '1px solid var(--border)',
        borderRadius: 8, cursor: 'pointer', transition: 'box-shadow 0.12s, border-color 0.12s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
        e.currentTarget.style.borderColor = 'var(--red)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
    >
      <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: 4, color: 'var(--black)' }}>{label}</div>
      <div style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.5 }}>{desc}</div>
    </div>
  );
}

export default function Overview({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>UX Library</h1>
        <p className="page-intro">
          A composable Android UI layer on top of NavSDK that helps you build driving applications —
          Automotive AAOS, Logistics, Fleet — without writing a full navigation UI from scratch.
        </p>
      </div>

      {/* Hero image */}
      <div style={{
        borderRadius: 12, overflow: 'hidden', marginBottom: 36,
        background: '#0d1d2e', border: '1px solid var(--border)',
        position: 'relative',
      }}>
        <img
          src="/hero.png"
          alt="UX Library — navigation interface showing map, instruction panel, route overview and quick settings"
          style={{ width: '100%', display: 'block' }}
          onError={e => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextSibling.style.display = 'flex';
          }}
        />
        {/* Fallback shown if hero.png is missing */}
        <div style={{
          display: 'none', height: 260, alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 10, color: 'rgba(255,255,255,0.25)',
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <span style={{ fontSize: '0.8rem' }}>Save your screenshot as <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>ux-library/public/hero.png</code></span>
        </div>
      </div>

      {/* What is UX Library */}
      <div className="zone">
        <h2 className="sh" id="ov-what">What is UX Library?</h2>
        <p className="body">
          UX Library is TomTom's customisation layer for navigation applications. It sits between
          NavSDK (the routing, map rendering and positioning engine) and the OEM application,
          providing production-ready UI components, design tokens, and a stable API surface for
          tailoring every visible aspect of the navigation experience.
        </p>
        <p className="body">
          OEMs get a coherent, ANA-consistent baseline out of the box. From there, every layer is
          overridable — colours, typography, layout, component structure, and even core functional
          components like the search engine — without forking or maintaining a parallel UI codebase.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginTop: 20 }}>
          {[
            { icon: '🗺', title: 'Map as wallpaper',    body: 'The navigation map fills the entire IVI home screen as a persistent background layer.' },
            { icon: '🎨', title: 'Full theming',         body: 'Override any design token — colour, radius, typography — to match OEM brand guidelines.' },
            { icon: '🔌', title: 'Replaceable modules',  body: 'Swap search, voice, or routing providers without changing any UI code.' },
            { icon: '📐', title: 'Composable layouts',   body: 'Resize the navigation area from any edge. Other domain widgets layer on top.' },
          ].map(({ icon, title, body }) => (
            <div key={title} style={{ padding: '14px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8 }}>
              <div style={{ fontSize: '1.3rem', marginBottom: 8 }}>{icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.84rem', marginBottom: 5, color: 'var(--black)' }}>{title}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--mid)', lineHeight: 1.55 }}>{body}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Explore sections */}
      <div className="zone">
        <h2 className="sh" id="ov-explore">Explore this library</h2>

        {SECTIONS.map(({ group, items }) => (
          <div key={group} style={{ marginBottom: 24 }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: 10 }}>{group}</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {items.map(item => (
                <NavCard key={item.id} {...item} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <Callout type="info">
        This is a prototype. Pages with full interactive content are{' '}
        <strong>Colour</strong>, <strong>Home Screen Layout</strong>, <strong>Search engine</strong>,{' '}
        <strong>Font</strong>, <strong>Corner radius</strong>, and <strong>Design Tokens</strong>.
        All other nav items are placeholders to be built out.
      </Callout>
    </div>
  );
}
