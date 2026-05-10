import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

/* ─── Token table ────────────────────────────────────────────────────────────── */
const SPACING_SCALE = [
  { token: '--space-1',  px: 4,   usage: 'Inline icon gap, tight label padding' },
  { token: '--space-2',  px: 8,   usage: 'Component padding (compact), chip gap' },
  { token: '--space-3',  px: 12,  usage: 'Card inner padding, form field gap' },
  { token: '--space-4',  px: 16,  usage: 'Default section gap, row padding' },
  { token: '--space-5',  px: 20,  usage: 'Panel padding, sidebar item height basis' },
  { token: '--space-6',  px: 24,  usage: 'Zone vertical margin, page lateral padding' },
  { token: '--space-8',  px: 32,  usage: 'Section header margin-bottom' },
  { token: '--space-10', px: 40,  usage: 'Large section gap' },
  { token: '--space-12', px: 48,  usage: 'Page-level top padding, hero padding' },
];

const LAYOUT_TOKENS = [
  { token: '--content-max-width', value: '780px', usage: 'Max prose column width in docs pages' },
  { token: '--sidebar-width',     value: '240px', usage: 'Left sidenav fixed width' },
  { token: '--toc-width',         value: '200px', usage: 'Right TOC panel fixed width' },
  { token: '--topnav-height',     value: '48px',  usage: 'Top navigation bar height' },
  { token: '--global-header-h',   value: '48px',  usage: 'Global site header height' },
];

/* ─── Visual block ───────────────────────────────────────────────────────────── */
function SpacingBlock({ px, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
      <div style={{ width: 80, flexShrink: 0, textAlign: 'right' }}>
        <span style={{ fontSize: '0.625rem', color: 'var(--muted)', fontFamily: 'monospace' }}>{px}px</span>
      </div>
      <div style={{
        height: 20, width: px * 2.5, maxWidth: 300,
        background: '#e2001a', borderRadius: 3, opacity: 0.75,
        flexShrink: 0,
      }} />
      <span style={{ fontSize: '0.75rem', color: 'var(--mid)' }}>{label}</span>
    </div>
  );
}

export default function ContentSpacing() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Content Spacing</h1>
        <PageActions />
      </div>

      <p className="quick-answer">
        The spacing scale and layout dimension tokens used across all documentation pages, component previews, and shell chrome. Every gap, padding, and margin should resolve to one of these values.
      </p>

      <Callout type="info">
        This page documents the <strong>intended</strong> spacing system. Not all legacy components have been migrated to token-based spacing — this serves as the authoritative reference for new work.
      </Callout>

      {/* Spacing scale */}
      <div className="zone" id="cs-scale">
        <h2 className="sh">Spacing scale</h2>
        <p className="body">A base-4 scale. All values are multiples of 4 px, starting from 4 px. Use the nearest token rather than arbitrary values.</p>

        <div style={{ margin: '20px 0 28px', padding: '20px 24px', background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)' }}>
          {SPACING_SCALE.map(({ token, px }) => (
            <SpacingBlock key={token} px={px} label={token} />
          ))}
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Token', 'Value', 'Typical usage'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--muted)', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SPACING_SCALE.map(({ token, px, usage }) => (
              <tr key={token} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: 'var(--text)', fontSize: '0.75rem' }}>{token}</td>
                <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: 'var(--mid)', fontSize: '0.75rem' }}>{px}px</td>
                <td style={{ padding: '8px 12px', color: 'var(--mid)', fontSize: '0.75rem' }}>{usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Layout dimensions */}
      <div className="zone" id="cs-layout">
        <h2 className="sh">Layout dimensions</h2>
        <p className="body">Fixed-width tokens used for the structural chrome — sidebar, TOC, headers.</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', marginTop: 16 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Token', 'Value', 'Usage'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--muted)', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {LAYOUT_TOKENS.map(({ token, value, usage }) => (
              <tr key={token} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: 'var(--text)', fontSize: '0.75rem' }}>{token}</td>
                <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: 'var(--mid)', fontSize: '0.75rem' }}>{value}</td>
                <td style={{ padding: '8px 12px', color: 'var(--mid)', fontSize: '0.75rem' }}>{usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Component padding guide */}
      <div className="zone" id="cs-components">
        <h2 className="sh">Component padding guide</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginTop: 16 }}>
          {[
            { name: 'Chip / badge',   h: 4,  v: 7,  note: '4 / 7 px — compact inline' },
            { name: 'Button (md)',    h: 10, v: 16, note: '10 / 16 px — default action' },
            { name: 'Button (lg)',    h: 14, v: 20, note: '14 / 20 px — primary CTA' },
            { name: 'Input field',   h: 10, v: 14, note: '10 / 14 px — form inputs' },
            { name: 'Card body',     h: 16, v: 16, note: '16 px all sides' },
            { name: 'Callout',       h: 14, v: 16, note: '14 / 16 px — notice blocks' },
            { name: 'CodeBlock',     h: 16, v: 20, note: '16 / 20 px — code fences' },
            { name: 'Zone section',  h: 0,  v: 24, note: '24 px top — page zones' },
          ].map(({ name, h, v, note }) => (
            <div key={name} style={{
              border: '1px solid var(--border)', borderRadius: 12,
              padding: '14px 16px', background: 'var(--surface)',
            }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{name}</div>
              <div style={{ fontSize: '0.625rem', fontFamily: 'monospace', color: 'var(--muted)', marginBottom: 6 }}>
                padding: {h}px {v}px
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--mid)' }}>{note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
