import { useTranslation } from 'react-i18next';
import Callout from '../components/ui/Callout';

export default function DesignTokens() {
  const { t } = useTranslation('pages');
  return (
    <div className="page">
      <div className="page-header">
        <h1>{t('designTokens.title')}</h1>
        <p className="page-intro">
          Design tokens are the named, versioned design decisions that power TomTom's UI — colours,
          type styles, spacing, and more — expressed as platform-agnostic variables that resolve to
          concrete values at build time.
        </p>
      </div>

      {/* Introduction */}
      <div className="zone">
        <h2 className="sh" id="dt-intro">{t('designTokens.sections.intro')}</h2>
        <div className="token-flow-intro">
          <div className="tfi-step">
            <div className="tfi-icon tfi-icon-token">🎨</div>
            <div className="tfi-label">Design Token</div>
          </div>
          <div className="tfi-arrow">→</div>
          <div className="tfi-step">
            <div className="tfi-icon tfi-icon-component">🧩</div>
            <div className="tfi-label">Component</div>
          </div>
          <div className="tfi-arrow">→</div>
          <div className="tfi-step">
            <div className="tfi-icon tfi-icon-product">📱</div>
            <div className="tfi-label">Product</div>
          </div>
        </div>
        <p className="body">
          Instead of hardcoding <code className="ic">#C82020</code> in your component, you
          reference <code className="ic">tt_sys_color_brand_primary</code>. If TomTom updates its
          brand colour, every component updates automatically — you change the token value once.
        </p>
      </div>

      {/* Benefits */}
      <div className="zone">
        <h2 className="sh" id="dt-benefits">{t('designTokens.sections.benefits')}</h2>
        <div className="benefit-grid">
          {[
            ['🎨', 'Theme switching', 'Swap entire colour modes (light/dark/OEM brand) by changing token values, not component code.'],
            ['📐', 'Consistency', 'Every component that references the same token automatically stays in sync.'],
            ['⚡', 'Speed', 'Build new screens faster — pull from a shared, pre-approved token set instead of designing from scratch.'],
            ['🔒', 'Guardrails', 'Tokens enforce constraints. If a value isn\'t in the system, it needs a design decision — not a one-off hex.'],
          ].map(([icon, title, desc]) => (
            <div key={title} className="benefit-card">
              <div className="benefit-icon">{icon}</div>
              <div className="benefit-title">{title}</div>
              <div className="benefit-desc">{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Token structure */}
      <div className="zone">
        <h2 className="sh" id="dt-structure">{t('designTokens.sections.structure')}</h2>
        <p className="body">
          TomTom uses a three-tier token architecture. Each tier builds on the one below it.
        </p>
        <table className="prop-table">
          <thead><tr><th>Tier</th><th>Description</th></tr></thead>
          <tbody>
            {[
              ['Global tokens', 'Raw values — hex codes, pixel sizes, font names. Never reference these in components directly. Example: tt_glb_color_red_300 = #C82020.'],
              ['System tokens', 'System tokens give semantic meaning to global values. tt_sys_color_brand_primary doesn\'t say "blue" — it says "primary brand colour". This level is where themes are swapped; changing a system token value propagates to all components that reference it.'],
              ['Component tokens', 'Component tokens apply system tokens to specific UI element properties. They allow fine-grained control of individual components without breaking the overall token structure. A component token always resolves through the system layer to a global value at runtime.'],
            ].map(([tier, desc]) => (
              <tr key={tier}>
                <td style={{ whiteSpace: 'nowrap' }}><code className="ic">{tier}</code></td>
                <td>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Token names */}
      <div className="zone">
        <h2 className="sh" id="dt-names">{t('designTokens.sections.names')}</h2>
        <p className="body">
          TomTom follows a naming convention: <code className="ic">[Prefix]_[Tier]_[Type]_[Name]_[Variant]</code>
        </p>
        <div className="token-name-anatomy">
          <div className="tna-token">tt_glb_color_blue_400</div>
          <div className="tna-parts">
            <div className="tna-part tna-prefix">
              <span className="tna-highlight">tt</span>
              <span className="tna-part-label">Prefix</span>
            </div>
            <div className="tna-sep">_</div>
            <div className="tna-part tna-tier">
              <span className="tna-highlight">glb</span>
              <span className="tna-part-label">Tier</span>
            </div>
            <div className="tna-sep">_</div>
            <div className="tna-part tna-type">
              <span className="tna-highlight" style={{ background: '#fff7ed', color: '#c2410c' }}>color</span>
              <span className="tna-part-label">Type</span>
            </div>
            <div className="tna-sep">_</div>
            <div className="tna-part tna-name">
              <span className="tna-highlight">blue</span>
              <span className="tna-part-label">Name</span>
            </div>
            <div className="tna-sep">_</div>
            <div className="tna-part tna-variant">
              <span className="tna-highlight">400</span>
              <span className="tna-part-label">Variant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Structure overview */}
      <div className="zone">
        <h2 className="sh" id="dt-overview">Token structure overview</h2>
        <p className="body">
          Only Prefix, Tier, and Type are required — the remaining parts are used when the token
          needs to express more specificity.
        </p>
        <table className="prop-table">
          <thead><tr><th>Part</th><th>Description</th></tr></thead>
          <tbody>
            {[
              ['Prefix', 'Identifies which organisation the token belongs to. tt is always the TomTom prefix.'],
              ['Tier', 'Shows which level the token belongs to: glb (global), sys (system), cmp (component).'],
              ['Type', 'Specifies the design property: color, font, size, spacing, radius, opacity.'],
              ['Property', 'Further qualifies the type: background, foreground, border, surface, etc.'],
              ['Segment', 'Names the logical role: primary, secondary, brand, guidance, alert, etc.'],
              ['Nested elements', 'Identifies sub-elements within a larger component, e.g. a label inside a button chip: chip_label.'],
              ['State', 'Interaction state of the element: default, focused, pressed, disabled, selected.'],
            ].map(([part, desc]) => (
              <tr key={part}>
                <td><code className="ic">{part}</code></td>
                <td>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Token examples */}
      <div className="zone">
        <h2 className="sh" id="dt-examples">Design token examples</h2>
        <p className="body">
          Tokens span all visual properties. Below are representative examples of each tier applied
          to colour.
        </p>

        <h3 className="sub">Global colour tokens</h3>
        <div className="dt-swatch-row">
          {[
            ['#F0F7FF','#333','blue_100'],['#78BEEC','#333','blue_300'],
            ['#1E8AD4','#fff','blue_400'],['#155E9C','#fff','blue_500'],
            ['#072948','#fff','blue_700'],['#C82020','#fff','red_300'],
            ['#009E64','#fff','green_300'],['#FFCA40','#333','yellow_200'],
          ].map(([bg, color, label]) => (
            <div key={label} className="dt-swatch-ex" style={{ background: bg, color }}>{label}</div>
          ))}
        </div>

        <h3 className="sub">System colour tokens</h3>
        <div className="dt-sys-list">
          {[
            ['#072948', 'tt_sys_color_surface_primary', 'Main navigation canvas — resolves to blue_700'],
            ['#C82020', 'tt_sys_color_brand_primary', 'TomTom brand red — resolves to red_300'],
            ['#1E8AD4', 'tt_sys_color_action_secondary', 'Interactive blue — resolves to blue_400'],
            ['#009E64', 'tt_sys_color_guidance_routeLine', 'Route polyline on map — resolves to green_300'],
          ].map(([bg, token, desc]) => (
            <div key={token} className="dt-sys-ex">
              <div className="dt-sys-dot" style={{ background: bg }} />
              <div className="dt-sys-info">
                <code className="ic" style={{ fontSize: '0.7rem' }}>{token}</code>
                <span className="dt-sys-desc">{desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Naming principles */}
      <div className="zone">
        <h2 className="sh" id="dt-naming">TomTom token logic and naming principles</h2>
        <p className="body">
          TomTom tokens follow internally agreed naming standards at the token type level.
        </p>
        <table className="prop-table">
          <thead><tr><th>Type</th><th>Name progression</th><th>Notes</th></tr></thead>
          <tbody>
            {[
              ['Font', 'tt_glb_font_family', 'Maps to a typeface name (e.g. Noto Sans)'],
              ['Colours', 'tt_glb_color_[name]_[scale]', 'Scale runs from 100 (lightest) to 900 (darkest)'],
              ['Size / Width / Height', 'tt_glb_size_[dp]', 'Layout dimension in dp (8 · 12 · 16 · 20 · 24 · 28 · 32 · 40 · 56 · 80)'],
              ['Spacing', 'tt_glb_spacing_[value]', 'Space between related elements — always a multiple of 4'],
              ['Display (typography)', 'tt_sys_font_display_[size]', 'Applies to prominent, large-format text. Sizes: s · m · l · xl · xxl'],
            ].map(([type, name, notes]) => (
              <tr key={type}>
                <td>{type}</td>
                <td><code className="ic">{name}</code></td>
                <td>{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Callout type="info">
          Additional conventions:
          <ul style={{ marginTop: 6, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.84rem' }}>
            <li>Always reference a <code className="ic">tt_</code> prefixed token — never hardcode raw values</li>
            <li>System tokens are designed to support both <strong>scalable</strong> and <strong>themeable</strong> values</li>
            <li>Token names use camelCase for multi-word segments: <code className="ic">routeLine</code>, not <code className="ic">route_line</code></li>
          </ul>
        </Callout>
      </div>

      {/* Themes and modes */}
      <div className="zone">
        <h2 className="sh" id="dt-themes">{t('designTokens.sections.themes')}</h2>
        <p className="body">
          Using design tokens, you can apply multiple modes to all relevant design properties —
          colour, typography, and sizing — simultaneously, without touching component code. There
          are three distinct mode types: <strong>Colour mode</strong> (light/dark),{' '}
          <strong>Size mode</strong> (S/M/L), and <strong>Brand mode</strong> (TomTom/OEM).
        </p>

        <div className="theme-mode-grid">
          <div className="tm-card">
            <div className="tm-label">Light mode</div>
            <div style={{ background: '#f8f8f8', padding: 0 }}>
              <div className="tm-bar" style={{ background: '#ffffff', borderBottom: '1px solid #e0e0e0' }}>
                <div className="tm-dot" style={{ background: '#C82020' }} />
                <span style={{ fontSize: '0.64rem', color: '#1a1a1a', fontWeight: 700 }}>TomTom</span>
              </div>
              <div className="tm-btns">
                <button className="tm-btn-primary">Navigate</button>
                <button className="tm-btn-secondary" style={{ color: '#4a4a4a', borderColor: '#e0e0e0' }}>Search</button>
              </div>
              <div style={{ padding: '0 10px 8px', fontSize: '0.62rem', color: '#767676', fontFamily: 'var(--font-mono)' }}>
                tt_sys_color_surface_primary → #F5F5F5
              </div>
            </div>
          </div>
          <div className="tm-card">
            <div className="tm-label">Dark mode</div>
            <div style={{ background: '#0c1318', padding: 0 }}>
              <div className="tm-bar" style={{ background: '#171e24', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="tm-dot" style={{ background: '#C82020' }} />
                <span style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.9)', fontWeight: 700 }}>TomTom</span>
              </div>
              <div className="tm-btns">
                <button className="tm-btn-primary">Navigate</button>
                <button className="tm-btn-secondary" style={{ color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.15)' }}>Search</button>
              </div>
              <div style={{ padding: '0 10px 8px', fontSize: '0.62rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)' }}>
                tt_sys_color_surface_primary → #0C1318
              </div>
            </div>
          </div>
        </div>

        <Callout type="warn">
          Never hardcode hex values in component code. If a value doesn&apos;t have a token,
          request one from the design system team — do not work around the system with inline
          values.
        </Callout>
      </div>

      <div className="feedback-strip">
        Was this page helpful?
        <button>👍 Yes</button>
        <button>👎 No</button>
      </div>
    </div>
  );
}
