import { useState } from 'react';
import { FONT_SIZES, FONT_CMP_ROWS, TYPE_SCALE } from '../data/fonts';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';

function TokenPill({ name, value }) {
  const [copied, setCopied] = useState(false);
  function handleClick() {
    navigator.clipboard?.writeText(name).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1100);
  }
  return (
    <div className={`token-pill${copied ? ' copied' : ''}`} onClick={handleClick}>
      <span className="tp-name">{name}</span>
      <span className="tp-value">{value}</span>
      <span className="tp-toast">Copied!</span>
    </div>
  );
}

function SizeItem({ dp }) {
  const [copied, setCopied] = useState(false);
  const tokenName = `tt_glb_size_${dp}`;
  const previewSize = Math.max(0.6, Math.min(parseInt(dp) / 22, 2.4));
  function handleClick() {
    navigator.clipboard?.writeText(tokenName).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1100);
  }
  return (
    <div className={`ss-item${copied ? ' copied' : ''}`} onClick={handleClick} title={`Click to copy: ${tokenName}`}>
      <span className="ss-name">size_{dp}</span>
      <span style={{ fontSize: `${previewSize}rem`, fontWeight: 700, lineHeight: 1, color: 'var(--black)' }}>{dp}</span>
      <span className="ss-val">{dp}dp</span>
      <div className="ss-toast">Copied!</div>
    </div>
  );
}

function TypeScaleRow({ token, size, weight, sampleStyle, sample }) {
  const [copied, setCopied] = useState(false);
  function handleClick() {
    navigator.clipboard?.writeText(token).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1100);
  }
  return (
    <div className="tst-row" onClick={handleClick} title="Click to copy token name" style={copied ? { background: '#fff5f5' } : {}}>
      <span><code className="ic">{token}</code></span>
      <span className="tst-meta">{size}</span>
      <span className="tst-meta">{weight}</span>
      <span className="tst-sample" style={sampleStyle}>{sample}</span>
    </div>
  );
}

export default function Font() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Font</h1>
        <p className="page-intro">
          Typography tokens ensure consistency, legibility, and brand flexibility across all TomTom
          products. They define how text appears in the UI — from large titles and guidance
          instructions to body text and button labels — and are optimised for automotive use.
        </p>
      </div>

      <p className="body">
        The system uses scalable, token-based typography that adjusts to different themes, screen
        sizes, and OEM requirements. Tokens are organised across three layers:{' '}
        <strong>global</strong> (raw values), <strong>system</strong> (semantic styles), and{' '}
        <strong>component</strong> (UI-specific overrides).
      </p>

      {/* Global tokens */}
      <div className="zone">
        <h2 className="sh" id="f-global">Global tokens</h2>
        <p className="body">
          Global tokens define the raw building blocks of type. They are neutral and brand-agnostic
          — they can be overridden to align with OEM identity without disrupting the structure of
          the system.
        </p>

        <div className="font-token-group">
          <h3 className="sub" id="f-family">Font family</h3>
          <p className="body">The typeface applied across the entire UI. TomTom ships with Noto Sans as the default.</p>
          <div className="token-pill-row">
            <TokenPill name="tt_glb_font_family" value="Noto Sans" />
          </div>
          <div className="font-preview">
            <span style={{ fontSize: '2rem', fontWeight: 400 }}>Aa</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 400, color: 'var(--mid)' }}>Noto Sans — Regular</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--mid)' }}>Noto Sans — Bold</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
              ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789
            </span>
          </div>
        </div>

        <div className="font-token-group">
          <h3 className="sub" id="f-weight">Font weight</h3>
          <p className="body">Controls the thickness of the font. Only two weights are used in the system to keep visual hierarchy clear.</p>
          <div className="token-pill-row">
            <TokenPill name="tt_glb_font_weight_regular" value="400" />
            <TokenPill name="tt_glb_font_weight_bold" value="700" />
          </div>
          <div className="weight-preview">
            <div className="wp-item">
              <span style={{ fontWeight: 400, fontSize: '1.2rem' }}>Navigation</span>
              <span className="wp-label">weight_regular · 400</span>
            </div>
            <div className="wp-item">
              <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>Navigation</span>
              <span className="wp-label">weight_bold · 700</span>
            </div>
          </div>
        </div>

        <div className="font-token-group">
          <h3 className="sub" id="f-size">Font size</h3>
          <p className="body">
            A global size scale that ensures consistent scaling across all typography and other UI
            elements (spacing, icon sizing). The scale is shared across the token hierarchy.
          </p>
          <div className="size-scale-row">
            {FONT_SIZES.map(([step]) => (
              <SizeItem key={step} dp={step} />
            ))}
          </div>
        </div>
      </div>

      {/* System tokens */}
      <div className="zone">
        <h2 className="sh" id="f-system">System tokens</h2>
        <p className="body">
          System tokens give semantic meaning to type styles. Each token combines a font family,
          weight, and size into a single reusable style. They are grouped into five categories
          covering the full range of UI text roles.
        </p>

        <div className="type-category-grid">
          {[
            ['Display', 'Prominent, large-scale text. Driving instructions, speed readouts.'],
            ['Title', 'Headers and key content lines. Panel headings, screen titles.'],
            ['Subtitle', 'Secondary headings and content divisions.'],
            ['Body', 'Core reading content and supporting text.'],
            ['Label', 'Short, actionable text in buttons, chips, and UI controls.'],
          ].map(([label, desc]) => (
            <div key={label} className="type-cat">
              <div className="type-cat-label">{label}</div>
              <div className="type-cat-desc">{desc}</div>
            </div>
          ))}
        </div>

        <h3 className="sub" id="f-system-anatomy">Token anatomy</h3>
        <p className="body">
          Each system token combines the three global properties into a reusable style. Example —{' '}
          <code className="ic">tt_sys_font_display_xxl</code>:
        </p>
        <div className="anatomy-card">
          <div className="anatomy-row">
            <div className="anatomy-prop">Font</div>
            <div className="anatomy-arrow">→</div>
            <code className="ic">tt_glb_font_family</code>
            <span className="anatomy-note">Noto Sans</span>
          </div>
          <div className="anatomy-row">
            <div className="anatomy-prop">Weight</div>
            <div className="anatomy-arrow">→</div>
            <code className="ic">tt_glb_font_weight_bold</code>
            <span className="anatomy-note">700</span>
          </div>
          <div className="anatomy-row">
            <div className="anatomy-prop">Size</div>
            <div className="anatomy-arrow">→</div>
            <code className="ic">tt_sys_fontSize_xxl</code>
            <span className="anatomy-note">→ tt_glb_size_80</span>
          </div>
        </div>

        <Callout type="info">
          Each category contains multiple size &amp; style variations (
          <code className="ic">s</code> <code className="ic">m</code>{' '}
          <code className="ic">l</code> <code className="ic">xl</code>{' '}
          <code className="ic">xxl</code>) to support different use cases. Use the smallest size
          that maintains legibility in your target display context.
        </Callout>

        <h3 className="sub" id="f-system-scale">System token scale</h3>
        <div className="type-scale-table">
          <div className="tst-header">
            <span>Token</span><span>Size</span><span>Weight</span><span>Sample</span>
          </div>
          {TYPE_SCALE.map(row => (
            <TypeScaleRow key={row.token} {...row} />
          ))}
        </div>
      </div>

      {/* Component tokens */}
      <div className="zone">
        <h2 className="sh" id="f-component">Component tokens</h2>
        <p className="body">
          Component tokens apply specific font styles to unique UI elements such as guidance
          prompts or list items. They pull values from the system-level tokens, ensuring components
          stay consistent while allowing fine-tuned overrides if needed.
        </p>

        <table className="prop-table" style={{ marginBottom: 24 }}>
          <thead>
            <tr><th>Component</th><th>Token</th><th>System Reference</th></tr>
          </thead>
          <tbody>
            {FONT_CMP_ROWS.map(([component, token, sysRef]) => (
              <tr key={token}>
                <td style={{ fontSize: '0.84rem', color: 'var(--mid)' }}>{component}</td>
                <td><code className="ic" style={{ cursor: 'pointer' }}>{token}</code></td>
                <td><code className="ic">{sysRef}</code></td>
              </tr>
            ))}
          </tbody>
        </table>

        <CodeBlock label="Kotlin — using a component font token">
          <pre>
            <span className="hl-c">{'// Apply component token to a custom NIP view'}</span>{'\n'}
            <span className="hl-k">val</span>{' distanceStyle = TomTomFonts.'}<span className="hl-n">tt_cmp_font_nip_distance</span>{'  '}<span className="hl-c">{'// → tt_sys_font_display_l'}</span>{'\n'}
            <span className="hl-k">val</span>{' addressStyle  = TomTomFonts.'}<span className="hl-n">tt_cmp_font_nip_body</span>{'      '}<span className="hl-c">{'// → tt_sys_font_body_l'}</span>{'\n\n'}
            {'distanceTextView.'}<span className="hl-f">setTextAppearance</span>{'(distanceStyle)'}{'\n'}
            {'addressTextView.'}<span className="hl-f">setTextAppearance</span>{'(addressStyle)'}
          </pre>
        </CodeBlock>
      </div>

      {/* Theming and scaling */}
      <div className="zone">
        <h2 className="sh" id="f-theming">Theming and scaling</h2>
        <p className="body">
          Typography is theme-aware. Each size mode (<code className="ic">S</code>{' '}
          <code className="ic">M</code> <code className="ic">L</code>) applies proportional scaling
          to font sizes and line heights to ensure readability on small and large screens.
        </p>
        <p className="body">Example — <code className="ic">tt_sys_fontSize_M</code>:</p>

        <div className="scale-mode-table">
          <div className="smt-row smt-header">
            <span>Theme</span><span>Size</span><span>Typical context</span>
          </div>
          <div className="smt-row">
            <span><code className="ic">S</code></span>
            <span className="smt-val" style={{ fontSize: '1.4rem', fontWeight: 700 }}>28dp</span>
            <span className="smt-ctx">Compact in-dash displays, cluster views</span>
          </div>
          <div className="smt-row smt-highlight">
            <span><code className="ic">M</code> <span className="smt-default">default</span></span>
            <span className="smt-val" style={{ fontSize: '1.6rem', fontWeight: 700 }}>32dp</span>
            <span className="smt-ctx">Standard IVI screen (8–10")</span>
          </div>
          <div className="smt-row">
            <span><code className="ic">L</code></span>
            <span className="smt-val" style={{ fontSize: '2rem', fontWeight: 700 }}>46dp</span>
            <span className="smt-ctx">Large displays, high-speed driving contexts</span>
          </div>
        </div>

        <Callout type="warn">
          Never hardcode font sizes. Always reference a system token — the theme will resolve the
          correct dp value at runtime based on the active size mode.
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
