import PageActions from '../components/ui/PageActions';

/* ─── Type scale data ──────────────────────────────────────────────────────── */
const TYPE_SCALE = [
  { role: 'Page title',        class: '.page-header h1', size: '1.75rem / 28px', weight: 700, family: 'display', sample: 'Calculate Route',          usage: 'Top of every page — h1 inside .page-header' },
  { role: 'Hero lede',         class: '.quick-answer',   size: '1.25rem / 20px', weight: 400, family: 'sans',    sample: 'Plans multi-stop EV routes across distances that exceed a single charge.', usage: 'One-line page summary below the page title' },
  { role: 'Section heading',   class: 'h2.sh',           size: '1.25rem / 20px', weight: 700, family: 'display', sample: 'Request parameters',       usage: 'Major section dividers — includes a full-width border rule' },
  { role: 'Sub-heading',       class: 'h3.sub',          size: '0.875rem / 14px', weight: 600, family: 'display', sample: 'Consumption model',       usage: 'Sub-sections within a zone' },
  { role: 'API section title', class: 'ApiRefTwoCol SectionHeader', size: '1.25rem / 20px', weight: 700, family: 'display', sample: 'Route planning', usage: 'Parameter group heading in API ref two-col layout' },
  { role: 'Body / description', class: 'p.body  •  ParamRow desc', size: '0.875rem / 14px', weight: 400, family: 'sans', sample: 'Colon-separated lat,lon pairs. Minimum 2 points.',  usage: 'General prose and API param descriptions' },
  { role: 'Param name',        class: 'ParamRow name',   size: '0.875rem / 14px', weight: 700, family: 'mono',   sample: 'travelMode',              usage: 'API parameter key — bold monospace' },
  { role: 'Meta / type label', class: 'ParamRow type, default', size: '0.75rem / 12px', weight: 400, family: 'sans', sample: 'string  Default: car', usage: 'Type annotation and default value beside param name' },
  { role: 'Pill label',        class: 'Possible values code', size: '0.75rem / 12px', weight: 400, family: 'mono', sample: 'fastest  shortest  eco', usage: 'Enum pill chips in possible-values lists' },
  { role: 'Eyebrow / label',   class: '.sc-label  POSSIBLE VALUES', size: '0.625rem / 10px', weight: 700, family: 'sans', sample: 'POSSIBLE VALUES', usage: 'All-caps micro labels above value lists or sections' },
  { role: 'Nav item',          class: '.sidenav-item',   size: '0.875rem / 14px', weight: 400, family: 'sans', sample: 'Calculate Route',         usage: 'Sidebar navigation links' },
  { role: 'TOC link',          class: '.toc-list a',     size: '0.75rem / 12px',  weight: 400, family: 'sans', sample: 'Route planning',           usage: 'Right-rail on-this-page anchor links' },
  { role: 'Code block',        class: 'pre, .api-ref code panel', size: '0.75rem / 12px', weight: 400, family: 'mono', sample: 'curl -X POST "https://api.tomtom.com/..."', usage: 'Fenced code blocks and the sticky API ref code panel' },
  { role: 'Inline code',       class: 'code.ic',         size: '0.875em (relative)', weight: 400, family: 'mono', sample: 'tt_sys_color_brand_primary', usage: 'Inline code spans inside prose — uses em so it scales with context' },
];

const FAMILIES = [
  {
    name: 'Display — Gilroy',
    var: '--font-display',
    stack: "'Gilroy', 'Proxima Nova', -apple-system, sans-serif",
    weights: ['400 Regular', '600 SemiBold', '700 Bold'],
    usage: 'Page titles (h1), section headings (h2.sh, h3.sub), nav group titles',
    specimen: 'Calculate Route',
    style: { fontFamily: 'Gilroy, "Proxima Nova", -apple-system, sans-serif', fontWeight: 700, fontSize: '2rem', letterSpacing: '-0.02em' },
  },
  {
    name: 'Body — Proxima Nova',
    var: '--font-sans',
    stack: "'Proxima Nova', -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif",
    weights: ['400 Regular', '600 SemiBold', '700 Bold'],
    usage: 'All body text, descriptions, labels, UI chrome, nav items',
    specimen: 'Colon-separated lat,lon pairs — minimum 2 points (origin + destination).',
    style: { fontFamily: "'Proxima Nova', -apple-system, sans-serif", fontWeight: 400, fontSize: '1rem', lineHeight: 1.7 },
  },
  {
    name: 'Mono — SF Mono / Fira Code',
    var: '--font-mono',
    stack: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
    weights: ['400 Regular'],
    usage: 'API param names, code blocks, inline code, value pills, tab labels',
    specimen: 'curl -X POST "https://api.tomtom.com/routing/1/calculateRoute/\n52.509,13.429:52.502,13.438/json"',
    style: { fontFamily: "'SF Mono', 'Fira Code', monospace", fontWeight: 400, fontSize: '0.875rem', lineHeight: 1.75 },
  },
];

const COLOR_ROLES = [
  { token: '--black',  light: '#1a1a1a', dark: '#e2e2ee', usage: 'Primary text: page titles, param names, section headings, anything that needs maximum contrast' },
  { token: '--mid',    light: '#4a4a4a', dark: '#b0b0c8', usage: 'Body text: descriptions, prose paragraphs, secondary content. Passes WCAG AA at all body sizes' },
  { token: '--muted',  light: '#767676', dark: '#80809a', usage: 'De-emphasised text: type annotations, defaults, meta labels, TOC links, nav sub-items' },
  { token: '--blue',   light: '#2563eb', dark: '#60a5fa', usage: 'Inline code spans (code.ic). Also links in callout and prose contexts' },
  { token: '--red (--red)', light: '#e2001a', dark: '#e2001a', usage: '"required" badges on API params, active nav indicator, CTA buttons' },
];

/* ─── Sub-components ───────────────────────────────────────────────────────── */
function FamilyCard({ name, var: cssVar, stack, weights, usage, specimen, style }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', marginBottom: 16 }}>
      {/* Specimen */}
      <div style={{ padding: '28px 28px 20px', background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ ...style, color: 'var(--black)', whiteSpace: 'pre-wrap' }}>{specimen}</div>
      </div>
      {/* Meta */}
      <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px 24px' }}>
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Family</div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--black)' }}>{name}</div>
          <code style={{ fontSize: '0.75rem', color: 'var(--blue)' }}>{cssVar}</code>
        </div>
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Weights available</div>
          {weights.map(w => (
            <div key={w} style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.6 }}>{w}</div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Used for</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.6 }}>{usage}</div>
        </div>
      </div>
    </div>
  );
}

function ScaleRow({ role, class: cls, size, weight, family, sample, usage }) {
  const fontFamily = family === 'mono'
    ? "'SF Mono','Fira Code','Cascadia Code',monospace"
    : family === 'display'
    ? "'Gilroy','Proxima Nova',-apple-system,sans-serif"
    : "'Proxima Nova',-apple-system,sans-serif";

  const [sizePart] = size.split('/');
  const remVal = parseFloat(sizePart.trim());
  const displayFontSize = Math.max(0.72, Math.min(remVal, 1.4));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 160px', gap: 16, padding: '14px 0', borderBottom: '1px solid var(--border)', alignItems: 'start' }}>
      {/* Role + size */}
      <div>
        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--black)', marginBottom: 2 }}>{role}</div>
        <code style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{size}</code>
        <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginTop: 2 }}>weight {weight} · {family}</div>
      </div>
      {/* Live specimen */}
      <div style={{
        fontFamily,
        fontSize: `${displayFontSize}rem`,
        fontWeight: weight,
        color: 'var(--black)',
        lineHeight: 1.4,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: family === 'mono' ? 'nowrap' : 'normal',
      }}>
        {sample}
      </div>
      {/* Usage */}
      <div style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.55 }}>{usage}</div>
    </div>
  );
}

function ColorRow({ token, light, dark, usage }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '48px 48px 180px 1fr', gap: 16, padding: '12px 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
      <div style={{ width: 36, height: 36, borderRadius: 6, background: light, border: '1px solid var(--border)', flexShrink: 0 }} title={`Light: ${light}`} />
      <div style={{ width: 36, height: 36, borderRadius: 6, background: dark, border: '1px solid rgba(255,255,255,0.15)', flexShrink: 0 }} title={`Dark: ${dark}`} />
      <div>
        <code style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--black)' }}>{token}</code>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 2 }}>{light} → {dark}</div>
      </div>
      <div style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.6 }}>{usage}</div>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function Typography() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Typography system</h1>
        <PageActions />
      </div>

      <p className="quick-answer">
        The docs site uses <strong>three font families</strong> and a scale of <strong>{TYPE_SCALE.length} named roles</strong>. This page is the single source of truth — every size, weight, and colour value used across all pages.
      </p>

      {/* ── Font families ── */}
      <div className="zone">
        <h2 className="sh" id="typo-families">Font families</h2>
        <p className="body" style={{ marginBottom: 20 }}>
          Fonts are loaded as local <code className="ic">@font-face</code> rules in <code className="ic">index.css</code> from <code className="ic">/public/fonts/</code>. Each family is exposed as a CSS variable on <code className="ic">:root</code> so components never hardcode font names.
        </p>
        {FAMILIES.map(f => <FamilyCard key={f.name} {...f} />)}
      </div>

      {/* ── Type scale ── */}
      <div className="zone">
        <h2 className="sh" id="typo-scale">Type scale</h2>
        <p className="body" style={{ marginBottom: 16 }}>
          All sizes are in <code className="ic">rem</code> relative to the <code className="ic">{'html { font-size: 16px }'}</code> root. Columns show the live rendered specimen at its actual size (capped to fit the row).
        </p>

        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 160px', gap: 16, padding: '8px 0 6px', borderBottom: '2px solid var(--border)' }}>
          {['Role / selector', 'Live specimen', 'Used in'].map(h => (
            <div key={h} style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</div>
          ))}
        </div>

        {TYPE_SCALE.map(row => <ScaleRow key={row.role} {...row} />)}
      </div>

      {/* ── Colour roles ── */}
      <div className="zone">
        <h2 className="sh" id="typo-colors">Text colour roles</h2>
        <p className="body" style={{ marginBottom: 16 }}>
          Never use hardcoded hex values for text. Use the semantic CSS variables below — they automatically invert for dark mode. Left swatch = light mode, right swatch = dark mode.
        </p>

        {/* Column headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '48px 48px 180px 1fr', gap: 16, padding: '8px 0 6px', borderBottom: '2px solid var(--border)' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Light</div>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Dark</div>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Token</div>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>When to use</div>
        </div>
        {COLOR_ROLES.map(r => <ColorRow key={r.token} {...r} />)}
      </div>

      {/* ── Rules ── */}
      <div className="zone">
        <h2 className="sh" id="typo-rules">Rules & anti-patterns</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { type: 'use',   text: 'Use CSS variables (--black, --mid, --muted) for all text colours' },
            { type: 'avoid', text: 'Never hardcode hex colours like #1e293b — they break dark mode' },
            { type: 'use',   text: 'Use rem units. The root is 16px — 1rem = 16px' },
            { type: 'avoid', text: 'Never use px for font sizes in components; rem scales with the root' },
            { type: 'use',   text: 'Use var(--font-mono) for all code, param names, and pill values' },
            { type: 'avoid', text: 'Never write fontFamily: "monospace" directly — use the CSS variable' },
            { type: 'use',   text: 'p.body (0.875rem, --mid, lh 1.75) is the standard prose style' },
            { type: 'avoid', text: 'Avoid making text smaller than 0.68rem — it fails legibility at all DPIs' },
            { type: 'use',   text: 'Keep size steps to the 7 canonical sizes in the scale above' },
            { type: 'avoid', text: 'Avoid one-off sizes like 0.71rem, 0.77rem — they break rhythm' },
          ].map((item, i) => (
            <div key={i} className={`scenario-card ${item.type}`} style={{ lineHeight: 1.6, fontSize: '0.875rem' }}>
              <div className="sc-label" style={{ marginBottom: 6 }}>{item.type === 'use' ? '✓ Do' : '✗ Avoid'}</div>
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
