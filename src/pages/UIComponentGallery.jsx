/**
 * UIComponentGallery.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Design system audit page — lives inside the PlumbingPortal overlay.
 * Renders inside a scrollable <main> — no page shell, no .page wrapper,
 * no PageActions component.
 *
 * Every reusable UI component and inline pattern is shown with all its states
 * (default, hover, active, disabled, error) side by side so designers can
 * quickly spot inconsistencies.
 *
 * Sections:
 *  1. Design Tokens      (colours, radius, elevation, typography)
 *  2. Buttons            (page-action, primary, secondary, tab, icon)
 *  3. Badges & Tags      (HTTP methods, version, REF, meta, value pills, chips)
 *  4. Callouts           (info, warn, success, danger)
 *  5. Code Blocks        (single-label, multi-tab, copied state)
 *  6. Param Cards        (required, optional+values, nested children)
 *  7. Inline Patterns    (pill rows, error badges, section headers, version badges)
 *  8. Forms & Inputs     (text input, textarea, range slider)
 *  9. Steps              (.steps / .step / .step-num)
 * 10. Scenario Cards     (.scenario-grid use/avoid)
 * 11. Tables             (.prop-table with req/opt labels)
 * 12. Status States      (idle, loading, success, error)
 */

import { useState } from 'react';
import Callout from '../components/ui/Callout';
import { ParamRow } from '../components/ui/ApiRefTwoCol';
import CodeBlock from '../components/ui/CodeBlock';

// ─────────────────────────────────────────────────────────────────────────────
// HELPER COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

/** Dark header bar containing title + optional description, then white content */
function GallerySection({ title, desc, children }) {
  return (
    <div style={{
      background: 'var(--white)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      marginBottom: 32,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        background: 'var(--bg)',
        padding: '12px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'baseline',
        gap: 8,
      }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--black)' }}>{title}</span>
        {desc && (
          <>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>·</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{desc}</span>
          </>
        )}
      </div>
      {/* Content */}
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  );
}

/** Labelled row — small uppercase label on the left, flex items on the right */
function Row({ label, children, noBorder }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 16,
      marginBottom: noBorder ? 0 : 20,
      paddingBottom: noBorder ? 0 : 20,
      borderBottom: noBorder ? 'none' : '1px solid var(--border)',
    }}>
      {/* Left label */}
      <div style={{
        width: 140,
        flexShrink: 0,
        fontSize: '0.6875rem',
        fontWeight: 700,
        color: 'var(--muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        paddingTop: 4,
        lineHeight: 1.4,
      }}>
        {label}
      </div>
      {/* Right: flex row of states */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, flex: 1, alignItems: 'flex-start' }}>
        {children}
      </div>
    </div>
  );
}

/** Tiny uppercase muted label above a component state */
function StateLabel({ children }) {
  return (
    <span style={{
      display: 'block',
      fontSize: '0.5rem',
      fontWeight: 600,
      color: 'var(--muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      marginBottom: 4,
    }}>
      {children}
    </span>
  );
}

/** Thin horizontal rule between subsections */
function Divider() {
  return <div style={{ height: 1, background: 'var(--border)', margin: '4px 0 20px' }} />;
}

/** Wrapper to show a single state with label above */
function StateBox({ label, children }) {
  return (
    <div>
      <StateLabel>{label}</StateLabel>
      {children}
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1 — DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────────────────

const SURFACE_TOKENS = [
  { var: '--s0',      hex: '#FFFFFF', label: '--s0' },
  { var: '--s1',      hex: '#F2F2F2', label: '--s1' },
  { var: '--s2',      hex: '#E5E5E5', label: '--s2' },
  { var: '--s3',      hex: '#CCCCCC', label: '--s3' },
  { var: '--s-hi',    hex: '#333333', label: '--s-hi' },
  { var: '--brand',   hex: '#DF1B12', label: '--brand' },
  { var: '--success', hex: '#00A65E', label: '--success' },
];

const TEXT_TOKENS = [
  { var: '--t-hi',  hex: '#000000', label: '--t-hi' },
  { var: '--t-med', hex: '#5C5C5C', label: '--t-med' },
  { var: '--t-lo',  hex: '#767676', label: '--t-lo' },
  { var: '--t-dis', hex: '#B2B2B2', label: '--t-dis' },
];

const SEMANTIC_TOKENS = [
  { var: '--info-bg',       label: '--info-bg',       group: 'info' },
  { var: '--info-border',   label: '--info-border',   group: 'info' },
  { var: '--info-text',     label: '--info-text',     group: 'info' },
  { var: '--success-bg',    label: '--success-bg',    group: 'success' },
  { var: '--success-border',label: '--success-border',group: 'success' },
  { var: '--success-text',  label: '--success-text',  group: 'success' },
  { var: '--warn-bg',       label: '--warn-bg',       group: 'warn' },
  { var: '--warn-border',   label: '--warn-border',   group: 'warn' },
  { var: '--warn-text',     label: '--warn-text',     group: 'warn' },
  { var: '--danger-bg',     label: '--danger-bg',     group: 'danger' },
  { var: '--danger-border', label: '--danger-border', group: 'danger' },
  { var: '--danger-text',   label: '--danger-text',   group: 'danger' },
];

const RADIUS_TOKENS = [
  { var: '--r-sm', label: '--r-sm', value: '5px' },
  { var: '--r-md', label: '--r-md', value: '10px' },
  { var: '--r-lg', label: '--r-lg', value: '20px' },
  { var: '--r-xl', label: '--r-xl', value: '40px' },
  { var: '--r-pill',label: '--r-pill',value: '30px' },
];

const ELEVATION_TOKENS = [
  { var: '--e1', label: '--e1', desc: 'Flat — chips, buttons' },
  { var: '--e2', label: '--e2', desc: 'Cards, active items' },
  { var: '--e3', label: '--e3', desc: 'Topbar, AI input bar' },
  { var: '--e4', label: '--e4', desc: 'Map search overlay' },
  { var: '--e5', label: '--e5', desc: 'Emphasized handles' },
];

function ColorSwatch({ hex, varName, style: extraStyle }) {
  const [hovered, setHovered] = useState(false);
  const bg = varName ? `var(${varName})` : hex;
  const isDark = hex && (hex === '#333333' || hex === '#000000' || hex === '#DF1B12' || hex === '#00A65E');
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, ...extraStyle }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        title={varName}
        style={{
          width: 44,
          height: 44,
          borderRadius: 8,
          background: bg,
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'box-shadow 0.1s',
          boxShadow: hovered ? 'var(--e3)' : 'none',
          overflow: 'hidden',
          position: 'relative',
          flexShrink: 0,
        }}
      >
        {hovered && varName && (
          <span style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.4rem',
            fontFamily: 'var(--font-mono)',
            color: '#fff',
            padding: 2,
            textAlign: 'center',
            lineHeight: 1.3,
          }}>
            {varName}
          </span>
        )}
      </div>
      <span style={{ fontSize: '0.5625rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', lineHeight: 1 }}>
        {hex || varName}
      </span>
    </div>
  );
}

function DesignTokensSection() {
  return (
    <GallerySection title="1 — Design Tokens" desc="CSS variables from :root in index.css">

      {/* 1a. Color palette */}
      <Row label="1a · Surfaces">
        {SURFACE_TOKENS.map(t => (
          <ColorSwatch key={t.var} hex={t.hex} varName={t.var} />
        ))}
      </Row>

      <Row label="1a · Text">
        {TEXT_TOKENS.map(t => (
          <ColorSwatch key={t.var} hex={t.hex} varName={t.var} />
        ))}
      </Row>

      <Row label="1a · Semantic">
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {['info', 'success', 'warn', 'danger'].map(group => (
            <div key={group} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: '0.5625rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{group}</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {SEMANTIC_TOKENS.filter(t => t.group === group).map(t => (
                  <ColorSwatch key={t.var} varName={t.var} hex="" />
                ))}
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {['bg', 'border', 'text'].map(part => (
                  <span key={part} style={{ width: 44, textAlign: 'center', fontSize: '0.45rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{part}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Row>

      <Divider />

      {/* 1b. Border radius */}
      <Row label="1b · Radius">
        {RADIUS_TOKENS.map(t => (
          <div key={t.var} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: `var(${t.var})`,
              border: '1px solid var(--b-lo)',
              background: 'var(--bg)',
            }} />
            <span style={{ fontSize: '0.5rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', lineHeight: 1.2, textAlign: 'center' }}>{t.label}</span>
            <span style={{ fontSize: '0.5rem', color: 'var(--t-dis)', lineHeight: 1 }}>{t.value}</span>
          </div>
        ))}
      </Row>

      <Divider />

      {/* 1c. Elevation */}
      <Row label="1c · Elevation" noBorder={false}>
        {ELEVATION_TOKENS.map(t => (
          <div key={t.var} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: 56,
              height: 44,
              borderRadius: 8,
              background: 'var(--white)',
              border: '1px solid var(--border)',
              boxShadow: `var(${t.var})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }} />
            <span style={{ fontSize: '0.5rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', lineHeight: 1.2 }}>{t.label}</span>
            <span style={{ fontSize: '0.45rem', color: 'var(--t-dis)', lineHeight: 1, textAlign: 'center', maxWidth: 60 }}>{t.desc}</span>
          </div>
        ))}
      </Row>

      <Divider />

      {/* 1d. Typography scale */}
      <Row label="1d · Typography" noBorder>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
          <div>
            <StateLabel>h1 · page title</StateLabel>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--black)', margin: 0 }}>Page title specimen</h1>
          </div>
          <div>
            <StateLabel>h2.sh · section heading</StateLabel>
            <h2 className="sh" style={{ margin: 0 }}>Section heading specimen</h2>
          </div>
          <div>
            <StateLabel>h3.sub · sub heading</StateLabel>
            <h3 className="sub" style={{ margin: 0 }}>Sub heading specimen</h3>
          </div>
          <div>
            <StateLabel>p.body · body text</StateLabel>
            <p className="body" style={{ margin: 0 }}>Body paragraph text — the quick brown fox jumps over the lazy dog. Colon-separated lat,lon pairs.</p>
          </div>
          <div>
            <StateLabel>p.quick-answer · summary lede</StateLabel>
            <p className="quick-answer" style={{ margin: 0 }}>Quick answer / summary — a concise one-sentence page description shown below the h1.</p>
          </div>
          <div>
            <StateLabel>code.ic · inline code</StateLabel>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--mid)' }}>
              Use <code className="ic">travelMode=car</code> to specify the routing profile. Pass <code className="ic">maxAlternatives=3</code> to request alternatives.
            </p>
          </div>
        </div>
      </Row>
    </GallerySection>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2 — BUTTONS
// ─────────────────────────────────────────────────────────────────────────────

function ButtonsSection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <GallerySection title="2 — Buttons" desc="All button variants with default / hover / active / disabled states">

      {/* 2a. Page action buttons */}
      <Row label="2a · Page action">
        <StateBox label="Default">
          <button className="page-action-btn">Ask AI</button>
        </StateBox>
        <StateBox label="Hover (simulated)">
          <button className="page-action-btn" style={{ background: 'var(--bg)', color: 'var(--black)' }}>Ask AI</button>
        </StateBox>
        <StateBox label="Active / copied">
          <button className="page-action-btn" style={{ color: 'var(--green)' }}>✓ Copied!</button>
        </StateBox>
        <StateBox label="Disabled">
          <button className="page-action-btn" disabled style={{ opacity: 0.4, cursor: 'not-allowed' }}>Ask AI</button>
        </StateBox>
        <StateBox label="AI variant">
          <button className="page-action-btn page-action-btn--ai">✦ Ask about this page</button>
        </StateBox>
        <StateBox label="Icon + label">
          <button className="page-action-btn">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }}>
              <rect x="5" y="1" width="6" height="3" rx="1" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M4 2.5H3a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1v-10a1 1 0 00-1-1h-1" stroke="currentColor" strokeWidth="1.4"/>
            </svg>
            Copy for LLM
          </button>
        </StateBox>
      </Row>

      <Divider />

      {/* 2b. Primary / brand button */}
      <Row label="2b · Primary brand">
        <StateBox label="Default">
          <button style={{
            background: 'var(--brand)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--r-pill)',
            padding: '9px 20px',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}>Send</button>
        </StateBox>
        <StateBox label="Hover (simulated)">
          <button style={{
            background: '#c01810',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--r-pill)',
            padding: '9px 20px',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}>Send</button>
        </StateBox>
        <StateBox label="Active (pressed)">
          <button style={{
            background: '#a01310',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--r-pill)',
            padding: '9px 20px',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
            transform: 'scale(0.97)',
          }}>Send</button>
        </StateBox>
        <StateBox label="Disabled">
          <button disabled style={{
            background: 'var(--brand)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--r-pill)',
            padding: '9px 20px',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            fontSize: '0.875rem',
            opacity: 0.4,
            cursor: 'not-allowed',
          }}>Send</button>
        </StateBox>
      </Row>

      <Divider />

      {/* 2c. Secondary / outline button */}
      <Row label="2c · Secondary">
        <StateBox label="Default">
          <button style={{
            background: 'transparent',
            color: 'var(--mid)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '6px 12px',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}>Night</button>
        </StateBox>
        <StateBox label="Hover (simulated)">
          <button style={{
            background: 'var(--bg)',
            color: 'var(--black)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '6px 12px',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}>Night</button>
        </StateBox>
        <StateBox label="Active / selected">
          <button style={{
            background: 'var(--bg)',
            color: 'var(--brand)',
            border: '1px solid var(--brand)',
            borderRadius: 8,
            padding: '6px 12px',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}>Night</button>
        </StateBox>
        <StateBox label="Disabled">
          <button disabled style={{
            background: 'transparent',
            color: 'var(--t-dis)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '6px 12px',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.75rem',
            fontWeight: 600,
            opacity: 0.5,
            cursor: 'not-allowed',
          }}>Night</button>
        </StateBox>
        <StateBox label="Sign in (pill)">
          <button className="gh-signin-btn">Sign in</button>
        </StateBox>
      </Row>

      <Divider />

      {/* 2d. Tab buttons */}
      <Row label="2d · Tab bar">
        <StateBox label="Tab bar (interactive)">
          <div className="tab-bar" style={{ marginBottom: 0 }}>
            {['REST', 'Kotlin', 'Swift', 'Python'].map((tab, i) => (
              <button
                key={tab}
                className={`tab-btn${activeTab === i ? ' active' : ''}`}
                onClick={() => setActiveTab(i)}
              >
                {tab}
              </button>
            ))}
          </div>
        </StateBox>
        <StateBox label="Active state">
          <button className="tab-btn active" style={{ display: 'inline-flex' }}>REST</button>
        </StateBox>
        <StateBox label="Inactive">
          <button className="tab-btn" style={{ display: 'inline-flex' }}>Kotlin</button>
        </StateBox>
        <StateBox label="Hover (simulated)">
          <button className="tab-btn" style={{ display: 'inline-flex', color: 'var(--black)' }}>Swift</button>
        </StateBox>
      </Row>

      <Divider />

      {/* 2e. Icon buttons */}
      <Row label="2e · Icon button" noBorder>
        <StateBox label="Default (.gh-icon-btn)">
          <button className="gh-icon-btn" title="Toggle theme" aria-label="Toggle theme">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>
        </StateBox>
        <StateBox label="Hover (simulated)">
          <button className="gh-icon-btn" style={{ background: 'var(--s1)', color: 'var(--t-hi)' }} title="Toggle theme">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            </svg>
          </button>
        </StateBox>
        <StateBox label="Close (portal)">
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 8,
            background: 'transparent', border: '1px solid var(--border)',
            cursor: 'pointer', color: 'var(--mid)', fontSize: '0.75rem', fontWeight: 600,
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <line x1="3" y1="3" x2="15" y2="15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
              <line x1="15" y1="3" x2="3" y2="15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
            </svg>
            Close
          </button>
        </StateBox>
        <StateBox label="Theme toggle">
          <button className="theme-toggle" title="Toggle theme">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>
        </StateBox>
      </Row>
    </GallerySection>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3 — BADGES & TAGS
// ─────────────────────────────────────────────────────────────────────────────

function BadgesSection() {
  return (
    <GallerySection title="3 — Badges & Tags" desc="HTTP method tags, version badges, meta tags, value pills, status chips">

      {/* 3a. HTTP method badges — CSS classes */}
      <Row label="3a · HTTP classes">
        <StateBox label="GET">
          <span className="http-tag http-tag-get">GET</span>
        </StateBox>
        <StateBox label="POST">
          <span className="http-tag http-tag-post">POST</span>
        </StateBox>
        <StateBox label="PUT">
          <span className="http-tag http-tag-put">PUT</span>
        </StateBox>
        <StateBox label="PATCH">
          <span className="http-tag http-tag-patch">PATCH</span>
        </StateBox>
        <StateBox label="DELETE">
          <span className="http-tag http-tag-delete">DELETE</span>
        </StateBox>
      </Row>

      {/* 3a. METHOD_STYLES inline pattern (from ApiRefTwoCol SectionHeader) */}
      <Row label="3a · METHOD_STYLES inline">
        {[
          { method: 'GET',    bg: 'var(--info-bg)',    color: 'var(--info-text)'    },
          { method: 'POST',   bg: 'var(--success-bg)', color: 'var(--success-text)' },
          { method: 'DELETE', bg: 'var(--danger-bg)',  color: 'var(--danger-text)'  },
          { method: 'PUT',    bg: 'var(--warn-bg)',    color: 'var(--warn-text)'    },
        ].map(({ method, bg, color }) => (
          <StateBox key={method} label={method}>
            <span style={{
              fontSize: '0.625rem', fontWeight: 700, padding: '3px 8px', borderRadius: 4,
              background: bg, color, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em',
            }}>
              {method}
            </span>
          </StateBox>
        ))}
      </Row>

      <Divider />

      {/* 3b. Version / status badges */}
      <Row label="3b · Version badges">
        <StateBox label="v1 Production">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', borderRadius: 6,
            background: 'var(--success-bg)', border: '1px solid var(--success-border)',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success-text)', flexShrink: 0, display: 'inline-block' }} />
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--success-text)' }}>
              v1 · Production
            </span>
          </div>
        </StateBox>
        <StateBox label="v2 Public Preview">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', borderRadius: 6,
            background: 'var(--info-bg)', border: '1px solid var(--info-border)',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--info-text)', flexShrink: 0, display: 'inline-block' }} />
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--info-text)' }}>
              v2 · Public Preview
            </span>
          </div>
        </StateBox>
        <StateBox label="v3 Private Preview">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', borderRadius: 6,
            background: 'var(--warn-bg)', border: '1px solid var(--warn-border)',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--warn-text)', flexShrink: 0, display: 'inline-block' }} />
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--warn-text)' }}>
              v3 · Private Preview
            </span>
          </div>
        </StateBox>
      </Row>

      <Divider />

      {/* 3c. REF badge (sidenav chip) */}
      <Row label="3c · REF chip">
        <StateBox label="Default">
          <span className="api-ref-chip">REF</span>
        </StateBox>
        <StateBox label="Hover (simulated)">
          <span className="api-ref-chip" style={{ background: 'var(--danger-bg)', borderColor: 'var(--red)', color: 'var(--red)' }}>REF</span>
        </StateBox>
        <StateBox label="With icon">
          <span className="api-ref-chip">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            API ref
          </span>
        </StateBox>
      </Row>

      <Divider />

      {/* 3d. Meta tags */}
      <Row label="3d · Meta tags">
        <StateBox label="Default">
          <span className="meta-tag">v1 · Production</span>
        </StateBox>
        <StateBox label="Private Preview">
          <span className="meta-tag private">Private Preview</span>
        </StateBox>
        <StateBox label="Topnav badge">
          <span className="topnav-badge">Preview</span>
        </StateBox>
        <StateBox label="Topnav version">
          <span className="topnav-version">v2.1</span>
        </StateBox>
        <StateBox label="Plumbing pill">
          <span style={{
            fontSize: '0.6875rem', color: 'var(--muted)', padding: '2px 8px',
            borderRadius: 20, border: '1px solid var(--border)', background: 'var(--bg)',
          }}>
            Design system internals
          </span>
        </StateBox>
      </Row>

      <Divider />

      {/* 3e. Value pills (3 states from ParamRow) */}
      <Row label="3e · Value pills">
        <StateBox label="Active (selected)">
          <code style={{
            fontSize: '0.75rem', padding: '2px 8px', borderRadius: 4,
            fontFamily: 'var(--font-mono)', fontWeight: 500,
            background: 'rgba(226,0,26,0.08)', border: '1px solid #e2001a', color: '#e2001a',
          }}>fastest</code>
        </StateBox>
        <StateBox label="Default value">
          <code style={{
            fontSize: '0.75rem', padding: '2px 8px', borderRadius: 4,
            fontFamily: 'var(--font-mono)', fontWeight: 500,
            background: 'var(--bg)', border: '1px solid var(--mid)', color: 'var(--black)',
          }}>car</code>
        </StateBox>
        <StateBox label="Inactive">
          <code style={{
            fontSize: '0.75rem', padding: '2px 8px', borderRadius: 4,
            fontFamily: 'var(--font-mono)', fontWeight: 500,
            background: 'transparent', border: '1px solid var(--border)', color: 'var(--mid)',
          }}>eco</code>
        </StateBox>
        <StateBox label="Row of 3">
          <div style={{ display: 'flex', gap: 6 }}>
            {['fastest', 'shortest', 'eco', 'thrilling'].map((v, i) => (
              <code key={v} style={{
                fontSize: '0.75rem', padding: '2px 8px', borderRadius: 4,
                fontFamily: 'var(--font-mono)', fontWeight: 500,
                ...(i === 0
                  ? { background: 'rgba(226,0,26,0.08)', border: '1px solid #e2001a', color: '#e2001a' }
                  : i === 1
                  ? { background: 'var(--bg)', border: '1px solid var(--mid)', color: 'var(--black)' }
                  : { background: 'transparent', border: '1px solid var(--border)', color: 'var(--mid)' }),
              }}>{v}</code>
            ))}
          </div>
        </StateBox>
      </Row>

      <Divider />

      {/* 3f. Tinted chip pattern (color + '22' / '44' alpha) */}
      <Row label="3f · Tinted chips">
        {[
          { label: 'Green / success', bg: '#00A65E22', border: '#00A65E44', color: '#00A65E', text: 'Available' },
          { label: 'Amber / warn',    bg: '#D9770622', border: '#D9770644', color: '#D97706', text: 'Limited' },
          { label: 'Red / danger',    bg: '#DF1B1222', border: '#DF1B1244', color: '#DF1B12', text: 'Unavailable' },
          { label: 'Blue / info',     bg: '#2563EB22', border: '#2563EB44', color: '#2563EB', text: 'Preview' },
        ].map(({ label, bg, border, color, text }) => (
          <StateBox key={label} label={label}>
            <span style={{
              fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.04em',
              padding: '3px 8px', borderRadius: 4,
              background: bg, border: `1px solid ${border}`, color,
            }}>{text}</span>
          </StateBox>
        ))}
      </Row>

      <Divider />

      {/* 3g. Draft badge */}
      <Row label="3g · Draft / warning chip" noBorder>
        <StateBox label="URL unverified">
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.03em',
            padding: '3px 10px', borderRadius: 20,
            background: 'var(--warn-bg)', border: '1px solid var(--warn-border)', color: 'var(--warn-text)',
          }}>
            ⚠ URL unverified
          </span>
        </StateBox>
        <StateBox label="Required badge">
          <span style={{
            fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.06em',
            textTransform: 'uppercase', color: '#e2001a',
            background: 'rgba(226,0,26,0.08)', border: '1px solid rgba(226,0,26,0.2)',
            borderRadius: 4, padding: '2px 6px', lineHeight: 1.4,
          }}>required</span>
        </StateBox>
        <StateBox label="Modified badge">
          <span style={{
            fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.06em',
            padding: '2px 6px', borderRadius: 8,
            background: 'rgba(226,0,26,0.18)', color: '#e2001a',
            textTransform: 'uppercase',
          }}>modified</span>
        </StateBox>
        <StateBox label="Ownership: OEM">
          <span className="adas-stack-badge adas-stack-badge-oem">OEM</span>
        </StateBox>
        <StateBox label="Ownership: TomTom">
          <span className="adas-stack-badge adas-stack-badge-tt">TomTom</span>
        </StateBox>
      </Row>
    </GallerySection>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4 — CALLOUTS
// ─────────────────────────────────────────────────────────────────────────────

function CalloutsSection() {
  return (
    <GallerySection title="4 — Callouts" desc="All 4 Callout variants with realistic content">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <Callout type="info">
          <strong>API key required.</strong> All endpoints require a valid API key passed as the <code className="ic">key</code> query parameter or the <code className="ic">Authorization</code> header. See the Authentication guide to get started.
        </Callout>
        <Callout type="warn">
          <strong>Breaking change in v3.</strong> The <code className="ic">travelMode=pedestrian</code> value was renamed to <code className="ic">walk</code>. Update your integration before the v2 deprecation date on 2025-09-01.
        </Callout>
        <Callout type="success">
          <strong>Generally Available.</strong> This endpoint is production-ready and covered by the standard SLA. Rate limits and pricing apply as per your plan.
        </Callout>
        <Callout type="danger">
          <strong>Endpoint deprecated.</strong> This endpoint will be removed on 2025-12-01. Migrate to the <code className="ic">/routing/2/calculateRoute</code> endpoint which provides the same functionality with improved performance.
        </Callout>
      </div>
    </GallerySection>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5 — CODE BLOCKS
// ─────────────────────────────────────────────────────────────────────────────

const CURL_SNIPPET = `curl -X GET \\
  "https://api.tomtom.com/search/2/search/pizza.json?\\
key={YOUR_API_KEY}&\\
lat=52.509&lon=13.429&\\
radius=1000&limit=10" \\
  -H "Accept: application/json"`;

const REST_SNIPPET = `GET /search/2/search/Amsterdam.json?key={API_KEY}
Accept: application/json`;

const KOTLIN_SNIPPET = `val client = TomTomSearch.create {
    apiKey = BuildConfig.TOMTOM_API_KEY
}
val query = SearchQuery.create("Amsterdam") {
    coordinates = GeoCoordinates(52.376, 4.908)
    limit = 10
}
val result = client.search(query)`;

const SWIFT_SNIPPET = `let search = TomTomSearch(
    apiKey: Bundle.main.infoDictionary?["TOMTOM_API_KEY"] as? String ?? ""
)
let query = SearchQuery(term: "Amsterdam")
search.search(query: query) { result in
    switch result {
    case .success(let response): print(response.results)
    case .failure(let error):    print(error)
    }
}`;

function CodeBlocksSection() {
  return (
    <GallerySection title="5 — Code Blocks" desc="Single-label, multi-tab, and copied state">

      <Row label="5a · Single label">
        <div style={{ flex: 1, maxWidth: 700 }}>
          <CodeBlock label="curl · Fuzzy Search">
            {CURL_SNIPPET}
          </CodeBlock>
        </div>
      </Row>

      <Divider />

      <Row label="5b · Multi-tab" noBorder={false}>
        <div style={{ flex: 1, maxWidth: 700 }}>
          <CodeBlock tabs={['REST', 'Kotlin', 'Swift']}>
            {REST_SNIPPET}
            {KOTLIN_SNIPPET}
            {SWIFT_SNIPPET}
          </CodeBlock>
        </div>
      </Row>

      <Divider />

      <Row label="5c · Copied state" noBorder>
        <StateBox label="Copy btn: default">
          <button className="copy-btn">Copy</button>
        </StateBox>
        <StateBox label="Copy btn: copied">
          <button className="copy-btn copied">✓ Copied</button>
        </StateBox>
        <StateBox label="Code bar label">
          <div style={{ background: 'var(--code-bg)', borderRadius: 8, padding: '9px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="code-bar-label">curl · Fuzzy Search</span>
            <button className="copy-btn">Copy</button>
          </div>
        </StateBox>
        <StateBox label="Tab bar">
          <div style={{ background: 'var(--code-bg)', borderRadius: 8, padding: '4px 8px', display: 'flex', alignItems: 'center' }}>
            <div className="code-tabs">
              <span className="code-tab active">REST</span>
              <span className="code-tab">Kotlin</span>
              <span className="code-tab">Swift</span>
            </div>
          </div>
        </StateBox>
      </Row>
    </GallerySection>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// SECTION 6 — PARAM CARDS
// ─────────────────────────────────────────────────────────────────────────────

function ParamCardsSection() {
  const [limitValue, setLimitValue] = useState(null);
  const [modeValue, setModeValue] = useState(null);

  return (
    <GallerySection title="6 — Param Cards" desc="Required, optional, nested children — all interactive">

      <Row label="6a · Required param">
        <div style={{ flex: 1, maxWidth: 540 }}>
          <ParamRow
            name="query"
            required
            type="string"
            desc="Free-text search string. Can contain a street name, city, country, or POI name. The API applies fuzzy matching so minor typos are tolerated."
          />
        </div>
      </Row>

      <Divider />

      <Row label="6b · Optional + values">
        <div style={{ flex: 1, maxWidth: 540 }}>
          <ParamRow
            name="limit"
            type="integer"
            default={5}
            desc="Maximum number of results returned. Higher values increase response size; keep this low for autocomplete scenarios."
            values={['5', '10', '20', '50']}
            selectedValue={limitValue}
            onSelect={(v) => setLimitValue(val => val === v ? null : v)}
          />
        </div>
        <div style={{ flex: 1, maxWidth: 540 }}>
          <ParamRow
            name="travelMode"
            type="string"
            default="car"
            desc="Specifies the routing profile. Affects road restrictions and speed profiles used during route calculation."
            values={['car', 'truck', 'walk', 'bicycle', 'bus']}
            selectedValue={modeValue}
            onSelect={(v) => setModeValue(val => val === v ? null : v)}
          />
        </div>
      </Row>

      <Divider />

      <Row label="6c · Nested children" noBorder>
        <div style={{ flex: 1, maxWidth: 540 }}>
          <ParamRow
            name="chargingModes"
            type="array"
            desc="Array of charging mode objects. Each object defines a connector type and maximum charging power supported by the vehicle."
            children={[
              {
                name: 'chargingModes.currentType',
                type: 'string',
                desc: 'Electrical current type for this charging mode.',
                values: ['AC1', 'AC3', 'DC'],
              },
              {
                name: 'chargingModes.efficiency',
                type: 'number',
                default: 0.95,
                desc: 'Ratio of energy stored to energy drawn from the charging station (0–1).',
              },
              {
                name: 'chargingModes.maxPower',
                type: 'object',
                desc: 'Maximum power the vehicle can accept for this mode.',
                children: [
                  { name: 'maxPower.value', type: 'number', desc: 'Numeric power value.' },
                  { name: 'maxPower.unit',  type: 'string', default: 'kW', desc: 'Unit — always kW.' },
                ],
              },
            ]}
          />
        </div>
      </Row>
    </GallerySection>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// SECTION 7 — INLINE PATTERNS
// ─────────────────────────────────────────────────────────────────────────────

function InlinePatternsSection() {
  return (
    <GallerySection title="7 — Inline Patterns" desc="Recurring inline-style patterns used across API reference and demo pages">

      {/* 7a. Pill row — async polling states */}
      <Row label="7a · Async polling pills">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { status: 202, label: 'Processing', color: '#D97706', bg: '#FFF5DD', border: '#D9770644' },
            { status: 200, label: 'Complete',   color: '#00A65E', bg: '#F5FBF8', border: '#00A65E44' },
            { status: 404, label: 'Not found',  color: '#DF1B12', bg: '#FFF0EF', border: '#DF1B1244' },
          ].map(({ status, label, color, bg, border }) => (
            <div key={status} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              borderRadius: 20, border: `1px solid ${border}`,
              background: bg, padding: '6px 14px',
              fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
            }}>
              <span style={{
                fontWeight: 700, color, background: `${color}22`,
                border: `1px solid ${color}44`, borderRadius: 4,
                padding: '1px 6px', fontSize: '0.6875rem',
              }}>{status}</span>
              <span style={{ color: 'var(--mid)', fontFamily: 'var(--font-sans)' }}>{label}</span>
              <span style={{ marginLeft: 'auto', color: 'var(--t-dis)', fontSize: '0.625rem' }}>
                {status === 202 ? 'polling…' : `${Math.round(Math.random() * 200 + 50)}ms`}
              </span>
            </div>
          ))}
        </div>
      </Row>

      <Divider />

      {/* 7b. Error code badge row */}
      <Row label="7b · Error code rows">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, maxWidth: 560 }}>
          {[
            { code: 400, title: 'Bad Request',   desc: 'The request was malformed. Check query parameter values.' },
            { code: 403, title: 'Forbidden',      desc: 'API key is missing, invalid, or does not have permission for this endpoint.' },
            { code: 429, title: 'Too Many Requests', desc: 'Rate limit exceeded. Implement exponential backoff and retry.' },
          ].map(({ code, title, desc }) => (
            <div key={code} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 12px', background: 'var(--bg)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <span style={{
                flexShrink: 0, fontSize: '0.6875rem', fontWeight: 700,
                fontFamily: 'var(--font-mono)', padding: '3px 8px', borderRadius: 4,
                background: 'rgba(226,0,26,0.08)', border: '1px solid rgba(226,0,26,0.2)',
                color: '#e2001a', lineHeight: 1.4,
              }}>{code}</span>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--black)', marginBottom: 2 }}>{title}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--mid)', lineHeight: 1.5 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Row>

      <Divider />

      {/* 7c. Section header with method badge (api-ref-section-header style) */}
      <Row label="7c · Section header">
        <div style={{ flex: 1, maxWidth: 700 }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: '1px solid var(--border)', padding: '14px 0',
            height: 60,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--black)', fontFamily: 'var(--font-display)' }}>
                Calculate route
              </span>
              <span style={{
                fontSize: '0.625rem', fontWeight: 700, padding: '3px 8px', borderRadius: 4,
                background: 'var(--success-bg)', color: 'var(--success-text)',
                fontFamily: 'var(--font-mono)', letterSpacing: '0.06em',
              }}>POST</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)', flexShrink: 0 }}>8 parameters</span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: '1px solid var(--border)', padding: '14px 0', marginTop: 4,
            height: 60,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--black)', fontFamily: 'var(--font-display)' }}>
                Fuzzy search
              </span>
              <span style={{
                fontSize: '0.625rem', fontWeight: 700, padding: '3px 8px', borderRadius: 4,
                background: 'var(--info-bg)', color: 'var(--info-text)',
                fontFamily: 'var(--font-mono)', letterSpacing: '0.06em',
              }}>GET</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)', flexShrink: 0 }}>5 parameters</span>
          </div>
        </div>
      </Row>

      <Divider />

      {/* 7d. Version badge (ApiRefTwoCol inline style) */}
      <Row label="7d · Inline version dot" noBorder>
        <StateBox label="v1 Production">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', borderRadius: 6,
            background: 'var(--success-bg)', border: '1px solid var(--success-border)',
            marginBottom: 8,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success-text)', flexShrink: 0, display: 'inline-block' }} />
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--success-text)' }}>
              V1 · PRODUCTION
            </span>
          </div>
        </StateBox>
        <StateBox label="v2 Public Preview">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', borderRadius: 6,
            background: 'var(--info-bg)', border: '1px solid var(--info-border)',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--info-text)', flexShrink: 0, display: 'inline-block' }} />
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--info-text)' }}>
              V2 · PUBLIC PREVIEW
            </span>
          </div>
        </StateBox>
        <StateBox label="v3 Private Preview">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', borderRadius: 6,
            background: 'var(--warn-bg)', border: '1px solid var(--warn-border)',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--warn-text)', flexShrink: 0, display: 'inline-block' }} />
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--warn-text)' }}>
              V3 · PRIVATE PREVIEW
            </span>
          </div>
        </StateBox>
      </Row>
    </GallerySection>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// SECTION 8 — FORMS & INPUTS
// ─────────────────────────────────────────────────────────────────────────────

function FormsSection() {
  const [textVal, setTextVal] = useState('');
  const [textareaVal, setTextareaVal] = useState('');
  const [sliderVal, setSliderVal] = useState(50);

  return (
    <GallerySection title="8 — Forms & Inputs" desc="Text input, textarea, range slider — all interactive states">

      {/* 8a. Text input */}
      <Row label="8a · Text input">
        <StateBox label="Default (empty)">
          <input
            type="text"
            placeholder="Search for a location..."
            style={{
              padding: '8px 12px', borderRadius: 'var(--r-sm)',
              border: '1px solid var(--border)', background: 'var(--white)',
              fontSize: '0.875rem', color: 'var(--black)', outline: 'none',
              fontFamily: 'var(--font-sans)', width: 200,
            }}
          />
        </StateBox>
        <StateBox label="Focus (blue border)">
          <input
            type="text"
            defaultValue=""
            placeholder="Search for a location..."
            style={{
              padding: '8px 12px', borderRadius: 'var(--r-sm)',
              border: '1.5px solid var(--blue)', background: 'var(--white)',
              fontSize: '0.875rem', color: 'var(--black)', outline: 'none',
              fontFamily: 'var(--font-sans)', width: 200,
              boxShadow: '0 0 0 3px rgba(37,99,235,0.12)',
            }}
          />
        </StateBox>
        <StateBox label="Filled">
          <input
            type="text"
            value="Amsterdam, Netherlands"
            readOnly
            style={{
              padding: '8px 12px', borderRadius: 'var(--r-sm)',
              border: '1px solid var(--border)', background: 'var(--white)',
              fontSize: '0.875rem', color: 'var(--black)', outline: 'none',
              fontFamily: 'var(--font-sans)', width: 200,
            }}
          />
        </StateBox>
        <StateBox label="Error (red border)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <input
              type="text"
              value="invalid-key-123"
              readOnly
              style={{
                padding: '8px 12px', borderRadius: 'var(--r-sm)',
                border: '1.5px solid var(--brand)', background: 'var(--white)',
                fontSize: '0.875rem', color: 'var(--black)', outline: 'none',
                fontFamily: 'var(--font-sans)', width: 200,
                boxShadow: '0 0 0 3px rgba(223,27,18,0.10)',
              }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--brand)' }}>Invalid API key format</span>
          </div>
        </StateBox>
        <StateBox label="Disabled">
          <input
            type="text"
            disabled
            placeholder="Disabled input"
            style={{
              padding: '8px 12px', borderRadius: 'var(--r-sm)',
              border: '1px solid var(--border)', background: 'var(--bg)',
              fontSize: '0.875rem', color: 'var(--t-dis)', outline: 'none',
              fontFamily: 'var(--font-sans)', width: 200,
              cursor: 'not-allowed', opacity: 0.7,
            }}
          />
        </StateBox>
      </Row>

      <Divider />

      {/* 8b. Textarea */}
      <Row label="8b · Textarea">
        <StateBox label="Default (empty)">
          <textarea
            rows={3}
            placeholder="Enter your prompt here..."
            style={{
              padding: '8px 12px', borderRadius: 'var(--r-sm)',
              border: '1px solid var(--border)', background: 'var(--white)',
              fontSize: '0.875rem', color: 'var(--black)', outline: 'none',
              fontFamily: 'var(--font-sans)', width: 240, resize: 'vertical',
              lineHeight: 1.6,
            }}
          />
        </StateBox>
        <StateBox label="Focus (blue border)">
          <textarea
            rows={3}
            defaultValue=""
            placeholder="Enter your prompt here..."
            style={{
              padding: '8px 12px', borderRadius: 'var(--r-sm)',
              border: '1.5px solid var(--blue)', background: 'var(--white)',
              fontSize: '0.875rem', color: 'var(--black)', outline: 'none',
              fontFamily: 'var(--font-sans)', width: 240, resize: 'vertical',
              lineHeight: 1.6, boxShadow: '0 0 0 3px rgba(37,99,235,0.12)',
            }}
          />
        </StateBox>
        <StateBox label="Filled">
          <textarea
            rows={3}
            readOnly
            value={`Find 5 EV charging stations\nnear my location within 2km\nwith at least 1 DC fast charger.`}
            style={{
              padding: '8px 12px', borderRadius: 'var(--r-sm)',
              border: '1px solid var(--border)', background: 'var(--white)',
              fontSize: '0.875rem', color: 'var(--black)', outline: 'none',
              fontFamily: 'var(--font-sans)', width: 240, resize: 'vertical',
              lineHeight: 1.6,
            }}
          />
        </StateBox>
        <StateBox label="Error">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <textarea
              rows={3}
              readOnly
              value="Too long (max 500 chars)..."
              style={{
                padding: '8px 12px', borderRadius: 'var(--r-sm)',
                border: '1.5px solid var(--brand)', background: 'var(--white)',
                fontSize: '0.875rem', color: 'var(--black)', outline: 'none',
                fontFamily: 'var(--font-sans)', width: 200, resize: 'vertical',
                lineHeight: 1.6, boxShadow: '0 0 0 3px rgba(223,27,18,0.10)',
              }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--brand)' }}>Exceeds 500 character limit</span>
          </div>
        </StateBox>
      </Row>

      <Divider />

      {/* 8c. Range slider */}
      <Row label="8c · Range slider" noBorder>
        <StateBox label={`Charge level: ${sliderVal}%`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 260 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--mid)' }}>Current SoC</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 700, color: 'var(--success)' }}>{sliderVal}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={sliderVal}
              onChange={e => setSliderVal(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--success)', height: 4 }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.625rem', color: 'var(--t-dis)' }}>0%</span>
              <span style={{ fontSize: '0.625rem', color: 'var(--t-dis)' }}>50%</span>
              <span style={{ fontSize: '0.625rem', color: 'var(--t-dis)' }}>100%</span>
            </div>
          </div>
        </StateBox>
        <StateBox label="Blue accent (AI input)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 200 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--mid)' }}>Max alternatives</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 700, color: 'var(--blue)' }}>3</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              defaultValue={3}
              style={{ width: '100%', accentColor: '#2563eb' }}
            />
          </div>
        </StateBox>
      </Row>
    </GallerySection>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// SECTION 9 — STEPS
// ─────────────────────────────────────────────────────────────────────────────

function StepsSection() {
  return (
    <GallerySection title="9 — Steps" desc=".steps / .step / .step-num pattern">
      <Row label="9 · Steps" noBorder>
        <div style={{ flex: 1, maxWidth: 560 }}>
          <div className="steps">
            <div className="step">
              <div className="step-num">1</div>
              <div className="step-body">
                <div className="step-title">Install SDK</div>
                <div className="step-desc">Add the TomTom Nav SDK to your project via Gradle or Swift Package Manager. Ensure your minimum API level meets the SDK requirements.</div>
              </div>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <div className="step-body">
                <div className="step-title">Authenticate</div>
                <div className="step-desc">Create a <code className="ic">TomTomSDKConfiguration</code> object with your API key. Never hardcode keys in source files — use a secure environment variable or secret manager.</div>
              </div>
            </div>
            <div className="step">
              <div className="step-num" style={{ background: 'var(--brand)', borderColor: 'var(--brand)', color: '#fff' }}>3</div>
              <div className="step-body">
                <div className="step-title">Make your first call</div>
                <div className="step-desc">Call <code className="ic">search.search(query:)</code> with a <code className="ic">SearchQuery</code> to get nearby places. The SDK handles retries and caching automatically.</div>
              </div>
            </div>
          </div>
        </div>
      </Row>
    </GallerySection>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// SECTION 10 — SCENARIO CARDS
// ─────────────────────────────────────────────────────────────────────────────

function ScenarioCardsSection() {
  return (
    <GallerySection title="10 — Scenario Cards" desc=".scenario-grid with .use and .avoid variants">
      <Row label="10 · Use / Avoid" noBorder>
        <div className="scenario-grid" style={{ flex: 1 }}>
          <div className="scenario-card use">
            <div className="sc-label">Use</div>
            <ul>
              <li>Cache route calculations on the client when the origin and destination haven't changed</li>
              <li>Use <code className="ic">travelMode=car</code> for everyday navigation — it gives the best road coverage</li>
              <li>Batch multiple one-to-many requests into a single Matrix Routing call to reduce latency</li>
            </ul>
          </div>
          <div className="scenario-card avoid">
            <div className="sc-label">Avoid</div>
            <ul>
              <li>Don't call Calculate Route on every map pan — debounce and throttle aggressively</li>
              <li>Don't hardcode bounding box coordinates — derive them from the user's viewport dynamically</li>
              <li>Don't mix <code className="ic">avoid=motorways</code> with <code className="ic">travelMode=truck</code> — conflicting constraints produce longer routes</li>
            </ul>
          </div>
        </div>
      </Row>
    </GallerySection>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// SECTION 11 — TABLES
// ─────────────────────────────────────────────────────────────────────────────

function TablesSection() {
  return (
    <GallerySection title="11 — Tables" desc=".prop-table with .prop-req and .prop-opt labels, hover state">
      <Row label="11 · Prop table" noBorder>
        <div style={{ flex: 1 }}>
          <table className="prop-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Type</th>
                <th>Required</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code className="ic">query</code></td>
                <td><code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>string</code></td>
                <td><span className="prop-req">Required</span></td>
                <td>—</td>
                <td style={{ color: 'var(--mid)', fontSize: '0.8125rem' }}>Free-text search term passed to the fuzzy search engine.</td>
              </tr>
              <tr>
                <td><code className="ic">limit</code></td>
                <td><code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>integer</code></td>
                <td><span className="prop-opt">Optional</span></td>
                <td><code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>5</code></td>
                <td style={{ color: 'var(--mid)', fontSize: '0.8125rem' }}>Maximum number of results per page. Range: 1–100.</td>
              </tr>
              <tr>
                <td><code className="ic">lat</code></td>
                <td><code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>number</code></td>
                <td><span className="prop-opt">Optional</span></td>
                <td>—</td>
                <td style={{ color: 'var(--mid)', fontSize: '0.8125rem' }}>Latitude bias point for ranking results by proximity.</td>
              </tr>
              <tr>
                <td><code className="ic">radius</code></td>
                <td><code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>integer</code></td>
                <td><span className="prop-req">Required</span></td>
                <td>—</td>
                <td style={{ color: 'var(--mid)', fontSize: '0.8125rem' }}>Search radius in metres. Must be positive and &lt; 50,000.</td>
              </tr>
              <tr style={{ opacity: 0.5 }}>
                <td><code className="ic">language</code></td>
                <td><code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>string</code></td>
                <td><span className="prop-opt">Optional</span></td>
                <td><code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>NGT</code></td>
                <td style={{ color: 'var(--mid)', fontSize: '0.8125rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--t-dis)', marginRight: 6, fontStyle: 'italic' }}>(hover this row)</span>
                  Language for results — BCP 47 code or NGT for natural ground truth.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Row>
    </GallerySection>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// SECTION 12 — STATUS STATES
// ─────────────────────────────────────────────────────────────────────────────

function StatusDots() {
  return (
    <span style={{
      display: 'inline-flex', gap: 4, alignItems: 'center', marginRight: 4,
    }}>
      {['#ff5f57','#febc2e','#28c840'].map((c, i) => (
        <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'inline-block' }} />
      ))}
    </span>
  );
}

function StatusSection() {
  return (
    <GallerySection title="12 — Status States" desc="Loading / result states used across demo panels and async operations">

      <Row label="12 · Response states" noBorder>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', flex: 1 }}>

          {/* Idle */}
          <div style={{ flex: '1 1 180px' }}>
            <StateLabel>Idle</StateLabel>
            <div style={{
              border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg)',
              padding: '16px 18px', minHeight: 80,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <p style={{ fontStyle: 'italic', color: 'var(--t-lo)', fontSize: '0.8125rem', margin: 0, textAlign: 'center', lineHeight: 1.55 }}>
                Click Preview to see a live response
              </p>
            </div>
          </div>

          {/* Loading */}
          <div style={{ flex: '1 1 180px' }}>
            <StateLabel>Loading</StateLabel>
            <div style={{
              border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg)',
              padding: '16px 18px', minHeight: 80,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8,
            }}>
              <style>{`
                @keyframes gallery-dots {
                  0%, 80%, 100% { opacity: 0.2; transform: scale(0.9); }
                  40% { opacity: 1; transform: scale(1.1); }
                }
              `}</style>
              <div style={{ display: 'flex', gap: 6 }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: 'var(--blue)',
                    display: 'inline-block',
                    animation: `gallery-dots 1.2s ease-in-out ${i * 0.16}s infinite`,
                  }} />
                ))}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--t-lo)' }}>Requesting…</span>
            </div>
          </div>

          {/* Success */}
          <div style={{ flex: '1 1 220px' }}>
            <StateLabel>Success (200 OK)</StateLabel>
            <div style={{
              border: '1px solid var(--border)', borderRadius: 8,
              background: 'var(--code-bg)', overflow: 'hidden',
            }}>
              <div style={{
                padding: '8px 14px',
                background: '#161b22',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: '0.6875rem', color: '#4ade80', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                  Response
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '0.625rem', color: '#94a3b8' }}>124ms</span>
                  <StatusDots />
                </div>
              </div>
              <pre style={{ margin: 0, padding: '12px 16px', fontSize: '0.75rem', color: '#e2e8f0', lineHeight: 1.6 }}>
{`{
  "results": [
    {
      "id": "POI:528009004684813",
      "score": 10.651,
      "info": "search:ta:276009",
      "type": "POI"
    }
  ],
  "summary": {
    "numResults": 1,
    "totalResults": 43
  }
}`}
              </pre>
            </div>
          </div>

          {/* Error */}
          <div style={{ flex: '1 1 220px' }}>
            <StateLabel>Error (403 Forbidden)</StateLabel>
            <div style={{
              border: '1px solid var(--danger-border)', borderRadius: 8,
              background: 'var(--danger-bg)', overflow: 'hidden',
            }}>
              <div style={{
                padding: '8px 14px',
                background: 'rgba(162,20,13,0.12)',
                borderBottom: '1px solid var(--danger-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: '0.6875rem', color: 'var(--danger-text)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--danger-text)', display: 'inline-block' }} />
                  Error
                </span>
                <span style={{ fontSize: '0.625rem', color: 'var(--danger-text)', opacity: 0.7 }}>403</span>
              </div>
              <div style={{ padding: '12px 14px' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--danger-text)', marginBottom: 4 }}>
                  Forbidden
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--danger-text)', opacity: 0.8, lineHeight: 1.55 }}>
                  The supplied API key does not have access to this endpoint. Check your key is active and has the required product permissions.
                </div>
              </div>
            </div>
          </div>

        </div>
      </Row>
    </GallerySection>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// §13  NAVIGATION CARDS
// ─────────────────────────────────────────────────────────────────────────────

function NavCardsSection() {
  const Thumb = ({ bg = '#e8f0fe', accent = '#4f46e5' }) => (
    <div style={{ width: '100%', height: '100%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: accent, opacity: 0.18 }} />
      <div style={{ position: 'absolute', width: 28, height: 28, borderRadius: 8, background: accent, opacity: 0.35 }} />
    </div>
  );

  return (
    <GallerySection title="Navigation Cards" desc=".nav-card, .example-card — illustrated destination cards">
      <Row label="nav-card — default / hover">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {/* Default */}
          <div style={{ width: 200 }}>
            <StateLabel>Default</StateLabel>
            <div className="nav-card" style={{ pointerEvents: 'none' }}>
              <div className="nav-card-thumb"><Thumb bg="#e8f0fe" accent="#4f46e5" /></div>
              <div className="nav-card-body">
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--black)', marginBottom: 4 }}>Routing API</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.5, margin: 0 }}>Calculate routes between locations with live traffic.</p>
              </div>
            </div>
          </div>
          {/* Hover (CSS :hover — simulated with box-shadow) */}
          <div style={{ width: 200 }}>
            <StateLabel>Hover (simulated)</StateLabel>
            <div className="nav-card" style={{ borderColor: 'var(--black)', boxShadow: 'var(--e2)', pointerEvents: 'none' }}>
              <div className="nav-card-thumb"><Thumb bg="#fef3c7" accent="#d97706" /></div>
              <div className="nav-card-body">
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--black)', marginBottom: 4 }}>Search API</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.5, margin: 0 }}>Find POIs and addresses worldwide.</p>
              </div>
            </div>
          </div>
          {/* Disabled */}
          <div style={{ width: 200 }}>
            <StateLabel>Disabled (.nav-card--disabled)</StateLabel>
            <div className="nav-card nav-card--disabled">
              <div className="nav-card-thumb"><Thumb bg="#f0fdf4" accent="#16a34a" /></div>
              <div className="nav-card-body">
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--black)', marginBottom: 4 }}>EV Routing</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.5, margin: 0 }}>Coming soon.</p>
              </div>
            </div>
          </div>
        </div>
      </Row>
      <Row label="example-card (nav-card variant)" noBorder>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ width: 200 }}>
            <StateLabel>Default</StateLabel>
            <a className="nav-card example-card" href="#" onClick={e => e.preventDefault()}>
              <div className="example-card-thumb">
                <Thumb bg="#fdf4ff" accent="#9333ea" />
              </div>
              <div className="example-card-body">
                <span className="example-card-title">EV Station Finder</span>
                <p className="example-card-desc">Interactive demo — search nearby charging stations and show live availability.</p>
                <div className="example-card-tags">
                  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 99, fontSize: '0.625rem', fontWeight: 600, background: 'var(--success-bg)', color: 'var(--success-text)' }}>Live</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 99, fontSize: '0.625rem', fontWeight: 600, background: 'var(--info-bg)', color: 'var(--info-text)' }}>Custom</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </Row>
    </GallerySection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §14  DOMAIN CARDS
// ─────────────────────────────────────────────────────────────────────────────

function DomainCardsSection() {
  const Illo = ({ bg = '#e8f0fe' }) => (
    <div style={{ width: '100%', height: '100%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,0,0,0.08)' }} />
    </div>
  );
  const ArrowIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );

  return (
    <GallerySection title="Domain Cards" desc=".domain-card — product/domain landing destination cards">
      <Row label="variants">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {/* Default */}
          <div style={{ width: 190 }}>
            <StateLabel>Default</StateLabel>
            <div className="domain-card" style={{ display: 'flex', flexDirection: 'column', pointerEvents: 'none' }}>
              <div className="domain-card-illo"><Illo bg="#dbeafe" /></div>
              <div className="domain-card-bottom">
                <div className="domain-card-body">
                  <span className="domain-card-title">Navigation SDK</span>
                  <p className="domain-card-desc">Turn-by-turn guidance with real-time rerouting.</p>
                </div>
                <span className="domain-card-arrow"><ArrowIcon /></span>
              </div>
            </div>
          </div>
          {/* Hover */}
          <div style={{ width: 190 }}>
            <StateLabel>Hover (simulated)</StateLabel>
            <div className="domain-card" style={{ borderColor: 'var(--black)', boxShadow: 'var(--e2)', display: 'flex', flexDirection: 'column', pointerEvents: 'none' }}>
              <div className="domain-card-illo"><Illo bg="#dcfce7" /></div>
              <div className="domain-card-bottom" style={{ background: 'var(--bg)' }}>
                <div className="domain-card-body">
                  <span className="domain-card-title">Traffic API</span>
                  <p className="domain-card-desc">Real-time flow, incidents, and historical data.</p>
                </div>
                <span className="domain-card-arrow"><ArrowIcon /></span>
              </div>
            </div>
          </div>
          {/* Soon */}
          <div style={{ width: 190 }}>
            <StateLabel>Coming soon (.domain-card--soon)</StateLabel>
            <div className="domain-card domain-card--soon" style={{ display: 'flex', flexDirection: 'column', pointerEvents: 'none' }}>
              <div className="domain-card-illo"><Illo bg="#fdf4ff" /></div>
              <div className="domain-card-bottom">
                <div className="domain-card-body">
                  <span className="domain-card-title">Fleet SDK</span>
                  <p className="domain-card-desc" />
                  <span className="domain-card-soon-badge">Coming soon</span>
                </div>
                <span className="domain-card-arrow"><ArrowIcon /></span>
              </div>
            </div>
          </div>
        </div>
      </Row>
    </GallerySection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §15  API LINKS & API REF CHIP
// ─────────────────────────────────────────────────────────────────────────────

function ApiLinksSection() {
  return (
    <GallerySection title="ApiLinks + ApiRef chip" desc=".api-links-block, .api-links-card, .api-ref-chip">
      <Row label="api-links-grid — 3 cards">
        <div style={{ width: '100%', maxWidth: 640 }}>
          <div className="api-links-block">
            <div className="api-links-header">APIs used on this page</div>
            <div className="api-links-grid">
              {[
                { type: 'REST API',    col: { bg: '#fff5f5', border: '#fecaca', text: '#c0392b' }, name: 'Long Distance EV Route API', desc: 'Multi-stop EV route planning with charging stops' },
                { type: 'Android SDK', col: { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' }, name: 'Navigation SDK for Android',   desc: 'Turn-by-turn guidance with live rerouting' },
                { type: 'iOS SDK',     col: { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d' }, name: 'Navigation SDK for iOS',       desc: 'SwiftUI and UIKit navigation integration' },
              ].map(item => (
                <a key={item.name} className="api-links-card" href="#" onClick={e => e.preventDefault()}>
                  <span className="api-links-badge" style={{ background: item.col.bg, border: `1px solid ${item.col.border}`, color: item.col.text }}>{item.type}</span>
                  <span className="api-links-name">{item.name}</span>
                  <span className="api-links-desc">{item.desc}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </Row>
      <Row label="api-links-card — hover state">
        <div>
          <StateLabel>Hover (simulated)</StateLabel>
          <a className="api-links-card" href="#" onClick={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 4, borderColor: 'var(--brand)', boxShadow: '0 4px 20px rgba(223,27,18,0.12)', maxWidth: 260 }}>
            <span className="api-links-badge" style={{ background: '#fff5f5', border: '1px solid #fecaca', color: '#c0392b' }}>REST API</span>
            <span className="api-links-name">Routing API</span>
            <span className="api-links-desc">Calculate routes with live traffic and waypoints</span>
          </a>
        </div>
      </Row>
      <Row label="api-ref-chip — inline link" noBorder>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <StateLabel>Default</StateLabel>
          <a className="api-ref-chip" href="#" onClick={e => e.preventDefault()}>
            Routing API
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
          <StateLabel>Hover (simulated)</StateLabel>
          <a className="api-ref-chip" href="#" onClick={e => e.preventDefault()} style={{ background: 'var(--danger-bg)', borderColor: 'var(--red)', color: 'var(--red)' }}>
            LDEVR API
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        </div>
      </Row>
    </GallerySection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §16  PRIVATE PREVIEW BANNER
// ─────────────────────────────────────────────────────────────────────────────

function PrivatePreviewSection() {
  const LightningIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2L4.5 13.5H11L10 22L20.5 10H14L13 2Z"/>
    </svg>
  );
  return (
    <GallerySection title="Private Preview Banner" desc=".ppb-root — shown at top of private-preview API pages">
      <Row label="default" noBorder>
        <div style={{ width: '100%', maxWidth: 640 }}>
          <div className="ppb-root">
            <div className="ppb-icon"><LightningIcon /></div>
            <div className="ppb-body">
              <p className="ppb-title">Private Preview — Long Distance EV Route API v2</p>
              <p className="ppb-desc">
                This version is currently available to selected partners only. Features, request formats, and
                response schemas are subject to change before general availability. Do not use in production.
                To request access,{' '}
                <a href="#" onClick={e => e.preventDefault()} className="ppb-link">contact TomTom developer support</a>.
              </p>
            </div>
          </div>
        </div>
      </Row>
    </GallerySection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §17  BENEFIT CARDS
// ─────────────────────────────────────────────────────────────────────────────

function BenefitCardsSection() {
  return (
    <GallerySection title="Benefit Cards" desc=".benefit-grid, .benefit-card — 2-col feature highlights">
      <Row label="2-col grid" noBorder>
        <div style={{ width: '100%', maxWidth: 560 }}>
          <div className="benefit-grid">
            {[
              { icon: '⚡', title: 'Real-time charging data',  desc: 'Live availability from 800+ network operators across 50 countries.' },
              { icon: '🔋', title: 'Battery-aware routing',    desc: 'Factor in current SoC, charging curves, and auxiliary power draw.' },
              { icon: '🗺️', title: 'Seamless SDK integration', desc: 'Results plug directly into the Navigation SDK — no mapping required.' },
              { icon: '🔄', title: 'Automatic re-routing',     desc: 'Dynamically updates the plan if conditions change mid-journey.' },
            ].map(b => (
              <div key={b.title} className="benefit-card">
                <div className="benefit-icon">{b.icon}</div>
                <div className="benefit-title">{b.title}</div>
                <div className="benefit-desc">{b.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </Row>
    </GallerySection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §18  PAGE ANATOMY SHELL
// ─────────────────────────────────────────────────────────────────────────────

function PageAnatomySection() {
  return (
    <GallerySection title="Page Anatomy Shell" desc=".page-header, .quick-answer, .zone, .page-related, .feedback-strip">

      {/* page-header */}
      <Row label=".page-header">
        <div style={{ width: '100%', maxWidth: 640, border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          <div className="page-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.375rem', fontWeight: 800, color: 'var(--black)', fontFamily: 'var(--font-display)' }}>
                Long Distance EV Route API
              </h1>
            </div>
            {/* PageActions placeholder */}
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="page-action-btn" style={{ pointerEvents: 'none' }}>★ Bookmark</button>
              <button className="page-action-btn" style={{ pointerEvents: 'none' }}>⎘ Copy link</button>
            </div>
          </div>
          {/* quick-answer */}
          <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', background: 'var(--white)' }}>
            <p className="quick-answer" style={{ margin: 0 }}>
              Plan a multi-stop EV journey from origin to destination with automatic charging stop selection,
              battery-aware routing, and live charging availability.
            </p>
          </div>
          <div style={{ padding: '12px 20px', fontSize: '0.75rem', color: 'var(--muted)' }}>
            ↑ <code>.page-header</code> + <code>.quick-answer</code> — every page starts with these two blocks
          </div>
        </div>
      </Row>

      {/* zone */}
      <Row label=".zone — content section with .sh heading">
        <div style={{ width: '100%', maxWidth: 640 }}>
          <div className="zone">
            <h2 className="sh" id="anatomy-demo-sh">Request Parameters</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.6, margin: '0 0 12px' }}>
              All route coordinates go in the URL path. Battery and connector settings go in the query string.
            </p>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', borderTop: '1px dashed var(--border)', paddingTop: 8, marginTop: 8 }}>
              ↑ <code>.zone</code> wrapper + <code>h2.sh</code> section heading
            </div>
          </div>
        </div>
      </Row>

      {/* page-related */}
      <Row label=".page-related + .page-related-chip">
        <div style={{ width: '100%', maxWidth: 640 }}>
          <div className="page-related">
            <button className="page-related-chip">Introduction</button>
            <button className="page-related-chip">Battery Model</button>
            <button className="page-related-chip">Connector Types</button>
            <button className="page-related-chip">Charging Stops</button>
            <button className="page-related-chip">Batch Requests</button>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 8 }}>
            ↑ <code>.page-related</code> chip row — always at page bottom, 3–5 chips
          </div>
        </div>
      </Row>

      {/* feedback-strip */}
      <Row label=".feedback-strip" noBorder>
        <div style={{ width: '100%', maxWidth: 640 }}>
          <div className="feedback-strip">
            <span>Was this page helpful?</span>
            <button>👍 Yes</button>
            <button>👎 No</button>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 6 }}>
            ↑ <code>.feedback-strip</code> — optional CTA below page-related
          </div>
        </div>
      </Row>
    </GallerySection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §19  TOKEN NAMING ANATOMY
// ─────────────────────────────────────────────────────────────────────────────

function TokenNamingSection() {
  return (
    <GallerySection title="Token Naming Anatomy" desc=".tna-* — colour-coded token name breakdown">
      <Row label="full token anatomy" noBorder>
        <div>
          <div className="tna-token">--color-brand-primary-default</div>
          <div className="tna-parts">
            <div className="tna-part tna-prefix">
              <div className="tna-highlight">color</div>
              <div className="tna-part-label">Category</div>
            </div>
            <div className="tna-sep">-</div>
            <div className="tna-part tna-tier">
              <div className="tna-highlight">brand</div>
              <div className="tna-part-label">Tier</div>
            </div>
            <div className="tna-sep">-</div>
            <div className="tna-part tna-type">
              <div className="tna-highlight">primary</div>
              <div className="tna-part-label">Type</div>
            </div>
            <div className="tna-sep">-</div>
            <div className="tna-part tna-name">
              <div className="tna-highlight">default</div>
              <div className="tna-part-label">Variant</div>
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 16, lineHeight: 1.6 }}>
            Each segment highlighted with its semantic colour token:
            <code style={{ margin: '0 4px', fontSize: '0.7rem' }}>.tna-prefix</code>→ info,
            <code style={{ margin: '0 4px', fontSize: '0.7rem' }}>.tna-tier</code>→ success,
            <code style={{ margin: '0 4px', fontSize: '0.7rem' }}>.tna-type</code>→ warn,
            <code style={{ margin: '0 4px', fontSize: '0.7rem' }}>.tna-name</code>→ danger/purple.
          </p>
        </div>
      </Row>
    </GallerySection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §20  THEMING CARD
// ─────────────────────────────────────────────────────────────────────────────

function ThemingCardSection() {
  return (
    <GallerySection title="Theming Card" desc=".tm-card, .tm-bar, .tm-btns, .tm-btn-primary, .tm-btn-secondary">
      <Row label="tm-card specimen" noBorder>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {/* Light variant */}
          <div style={{ width: 180 }}>
            <StateLabel>Light theme</StateLabel>
            <div className="tm-card" style={{ width: 180 }}>
              <div className="tm-bar" style={{ height: 8, background: 'var(--brand)', borderRadius: '0 0 4px 4px' }} />
              <div style={{ padding: '10px 10px 4px', display: 'flex', gap: 6 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--bg)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ height: 8, background: 'var(--border)', borderRadius: 3, marginBottom: 5 }} />
                  <div style={{ height: 6, width: '70%', background: 'var(--border)', borderRadius: 3 }} />
                </div>
              </div>
              <div className="tm-btns">
                <button className="tm-btn-primary" style={{ pointerEvents: 'none' }}>Primary</button>
                <button className="tm-btn-secondary" style={{ pointerEvents: 'none', color: 'var(--mid)', borderColor: 'var(--border)' }}>Secondary</button>
              </div>
              <div style={{ display: 'flex', gap: 4, padding: '4px 10px 10px', alignItems: 'center' }}>
                <div className="tm-dot" style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--brand)' }} />
                <div className="tm-label" style={{ fontSize: '0.625rem', color: 'var(--muted)', fontWeight: 600 }}>TomTom Red</div>
              </div>
            </div>
          </div>
          {/* Dark variant hint */}
          <div style={{ width: 180 }}>
            <StateLabel>Dark theme (tm-card in dark mode)</StateLabel>
            <div className="tm-card" style={{ width: 180, background: '#1a1a2e', borderColor: '#2d2d4e' }}>
              <div className="tm-bar" style={{ height: 8, background: 'var(--brand)', borderRadius: '0 0 4px 4px' }} />
              <div style={{ padding: '10px 10px 4px', display: 'flex', gap: 6 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: '#2d2d4e' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ height: 8, background: '#2d2d4e', borderRadius: 3, marginBottom: 5 }} />
                  <div style={{ height: 6, width: '70%', background: '#2d2d4e', borderRadius: 3 }} />
                </div>
              </div>
              <div className="tm-btns">
                <button className="tm-btn-primary" style={{ pointerEvents: 'none' }}>Primary</button>
                <button className="tm-btn-secondary" style={{ pointerEvents: 'none', color: '#94a3b8', borderColor: '#2d2d4e' }}>Secondary</button>
              </div>
              <div style={{ display: 'flex', gap: 4, padding: '4px 10px 10px', alignItems: 'center' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--brand)' }} />
                <div style={{ fontSize: '0.625rem', color: '#64748b', fontWeight: 600 }}>TomTom Red</div>
              </div>
            </div>
          </div>
        </div>
      </Row>
    </GallerySection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §21  SPEC METHOD TABLE
// ─────────────────────────────────────────────────────────────────────────────

function SpecMethodTableSection() {
  const rows = [
    { val: 'car',          ctx: 'travelMode',   highlight: false },
    { val: 'truck',        ctx: 'travelMode',   highlight: false },
    { val: 'electric',     ctx: 'vehicleEngineType', highlight: true  },
    { val: 'combustion',   ctx: 'vehicleEngineType', highlight: false },
    { val: 'IEC62196Type2CCS', ctx: 'connectorSet', highlight: false },
  ];
  return (
    <GallerySection title="Spec Method Table" desc=".smt-row, .smt-val, .smt-ctx, .smt-highlight — enumerated values table">
      <Row label="table with highlight row" noBorder>
        <div style={{ width: '100%', maxWidth: 480, border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          {/* Header */}
          <div className="smt-row smt-header">
            <span>Value</span>
            <span>Parameter</span>
            <span>Notes</span>
          </div>
          {/* Rows */}
          {rows.map(r => (
            <div key={r.val} className={`smt-row${r.highlight ? ' smt-highlight' : ''}`}>
              <span className="smt-val">{r.val}</span>
              <span className="smt-ctx">{r.ctx}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--mid)' }}>
                {r.highlight ? <><span className="smt-default">default</span> Uses EV consumption model</> : '—'}
              </span>
            </div>
          ))}
        </div>
      </Row>
    </GallerySection>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// §22  APREF TWO-COLUMN LAYOUT
// ─────────────────────────────────────────────────────────────────────────────

function ApiRefLayoutSection() {
  return (
    <GallerySection title="ApiRef Two-Column Layout" desc=".api-ref-sections, .api-ref-section-left/right/code/header — every API reference page frame">
      <Row label="full layout specimen" noBorder>
        <div style={{ width: '100%', maxWidth: 760, border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          <div className="api-ref-sections" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 200 }}>
            {/* Left prose column */}
            <div className="api-ref-section-left" style={{ padding: '20px 24px', borderRight: '1px solid var(--border)' }}>
              <div className="api-ref-section-header" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: '0.625rem', fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: '#e6f4ea', color: '#1e7e34', border: '1px solid #c3e6cb' }}>GET</span>
                <code style={{ fontSize: '0.75rem', color: 'var(--black)', fontFamily: 'var(--font-mono)' }}>/routing/1/calculateRoute</code>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--mid)', lineHeight: 1.6, margin: '0 0 12px' }}>
                Calculates a route between two or more locations using real-time traffic data.
              </p>
              <table className="prop-table" style={{ width: '100%' }}>
                <thead>
                  <tr><th>Parameter</th><th>Type</th><th>Required</th></tr>
                </thead>
                <tbody>
                  <tr><td><code>routePlanningLocations</code></td><td><code>string</code></td><td><span className="prop-req">required</span></td></tr>
                  <tr><td><code>travelMode</code></td><td><code>string</code></td><td><span className="prop-opt">optional</span></td></tr>
                </tbody>
              </table>
            </div>
            {/* Right code column */}
            <div className="api-ref-section-right" style={{ padding: 0, background: '#0d1117' }}>
              <div className="api-ref-section-code" style={{ padding: '16px 20px' }}>
                <pre style={{ margin: 0, fontSize: '0.7rem', color: '#c9d1d9', lineHeight: 1.6 }}>
{`GET https://api.tomtom.com/
  routing/1/calculateRoute/
  52.3676,4.9041:48.8566,2.3522/
  json?key=YOUR_API_KEY
      &travelMode=car`}
                </pre>
              </div>
            </div>
          </div>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 8 }}>
          ↑ <code>.api-ref-sections</code> grid → <code>.api-ref-section-left</code> (prose+params) | <code>.api-ref-section-right</code> (code, dark bg) with <code>.api-ref-section-header</code> and <code>.api-ref-section-code</code> inside
        </div>
      </Row>
    </GallerySection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §23  SIDENAV ANATOMY
// ─────────────────────────────────────────────────────────────────────────────

function SidenavSection() {
  const MethodPill = ({ m }) => {
    const cols = { GET: '#e6f4ea:#c3e6cb:#1e7e34', POST: '#e8f0fe:#c5d3f8:#1d4ed8', DEL: '#fff5f5:#fecaca:#c0392b' };
    const [bg, border, text] = (cols[m] || cols.GET).split(':');
    return <span style={{ fontSize: '0.5rem', fontWeight: 700, padding: '1px 5px', borderRadius: 3, background: bg, border: `1px solid ${border}`, color: text, lineHeight: 1 }}>{m}</span>;
  };
  return (
    <GallerySection title="Sidenav Anatomy" desc=".sidenav-group, .sidenav-label, .sidenav-item, .sidenav-anchors, .sidenav-anchor-item">
      <Row label="group + items + anchors" noBorder>
        <div style={{ width: 220, background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          {/* Group with label */}
          <div className="sidenav-group">
            <div className="sidenav-label open" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6, cursor: 'default', fontSize: '0.75rem', fontWeight: 600, color: 'var(--black)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
              <span className="sidenav-label-text">Routing API</span>
            </div>
            <div className="sidenav-items open" style={{ display: 'block' }}>
              {/* Default item */}
              <div className="sidenav-item" style={{ display: 'flex', alignItems: 'center', padding: '7px 12px 7px 20px', fontSize: '0.8125rem', color: 'var(--mid)', cursor: 'default' }}>
                <span className="sidenav-item-label">Introduction</span>
              </div>
              {/* Active item + anchors */}
              <div className="sidenav-item active" style={{ display: 'flex', alignItems: 'center', padding: '7px 12px 7px 20px', fontSize: '0.8125rem', cursor: 'default' }}>
                <span className="sidenav-item-label">Calculate Route</span>
              </div>
              <div className="sidenav-anchors">
                <div className="sidenav-anchor-item" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 6px', fontSize: '0.75rem', color: 'var(--mid)', cursor: 'default' }}>
                  <div className="sidenav-anchor-rail" />
                  <span className="sidenav-anchor-label">Request</span>
                  <MethodPill m="GET" />
                </div>
                <div className="sidenav-anchor-item active" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 6px', fontSize: '0.75rem', color: 'var(--red)', cursor: 'default' }}>
                  <div className="sidenav-anchor-rail" />
                  <span className="sidenav-anchor-label" style={{ fontWeight: 600 }}>Response</span>
                </div>
              </div>
              {/* Disabled item */}
              <div className="sidenav-item" style={{ display: 'flex', alignItems: 'center', padding: '7px 12px 7px 20px', fontSize: '0.8125rem', color: 'var(--mid)', opacity: 0.55, cursor: 'default' }}>
                <span className="sidenav-item-label">Batch Route</span>
              </div>
            </div>
          </div>
          {/* Divider */}
          <div className="sidenav-plumbing-divider" />
          {/* Top-level link */}
          <div className="sidenav-top-link" style={{ padding: '7px 12px', fontSize: '0.8125rem', color: 'var(--mid)', cursor: 'default' }}>
            Changelog
          </div>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 8 }}>
          Active item uses <code>.sidenav-item.active</code> → <code>background: var(--s1)</code> + bold label.
          Active anchor uses <code>.sidenav-anchor-item.active</code> → <code>color: var(--red)</code>
        </div>
      </Row>
    </GallerySection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §24  GLOBAL HEADER + TOPNAV
// ─────────────────────────────────────────────────────────────────────────────

function HeaderNavSection() {
  return (
    <GallerySection title="Global Header + TopNav" desc=".global-header, .gh-nav, .topnav, .topnav-crumb-* — the two fixed chrome bars">
      <Row label="global-header bar">
        <div style={{ width: '100%', maxWidth: 680 }}>
          <div className="global-header" style={{
            position: 'relative', height: 48, padding: '0 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'var(--white)', borderBottom: '1px solid var(--border)',
            borderRadius: 8,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--red)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>TomTom</div>
              <div style={{ height: 16, width: 1, background: 'var(--border)' }} />
              <div className="gh-nav" style={{ display: 'flex', gap: 4 }}>
                {['Maps', 'Routing', 'Navigation', 'EV'].map(l => (
                  <button key={l} style={{ padding: '4px 10px', fontSize: '0.75rem', fontWeight: 500, color: 'var(--mid)', background: 'none', border: 'none', cursor: 'default', borderRadius: 6 }}>{l}</button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <button className="gh-icon-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border)', background: 'none', cursor: 'default' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              </button>
              <button className="gh-signin-btn" style={{ padding: '5px 14px', fontSize: '0.75rem', fontWeight: 600, background: 'var(--red)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'default' }}>Sign in</button>
            </div>
          </div>
        </div>
      </Row>
      <Row label="topnav breadcrumb bar" noBorder>
        <div style={{ width: '100%', maxWidth: 680 }}>
          <div className="topnav" style={{
            position: 'relative', height: 40, padding: '0 20px',
            display: 'flex', alignItems: 'center', gap: 0,
            background: 'var(--white)', borderBottom: '1px solid var(--border)',
            borderRadius: 8,
          }}>
            <div className="topnav-crumb" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', overflow: 'hidden' }}>
              <span className="topnav-crumb-root">Developer Portal</span>
              <span className="topnav-crumb-sep">/</span>
              <span className="topnav-crumb-domain">Routing</span>
              <span className="topnav-crumb-sep">/</span>
              <span className="topnav-crumb-page">Calculate Route</span>
            </div>
            <div className="topnav-right">
              <span className="topnav-badge">Beta</span>
              <span className="topnav-version">v1.28</span>
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 6 }}>
            <code>.topnav-badge</code> uses warn tokens · <code>.topnav-version</code> uses border+bg tokens
          </div>
        </div>
      </Row>
    </GallerySection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §25  TAB BAR
// ─────────────────────────────────────────────────────────────────────────────

function TabBarSection() {
  const [active, setActive] = useState('rest');
  return (
    <GallerySection title="Tab Bar" desc=".tab-bar, .tab-btn — language/platform code switcher">
      <Row label="interactive" noBorder>
        <div style={{ width: '100%', maxWidth: 480 }}>
          <div className="tab-bar">
            {['rest', 'kotlin', 'swift', 'js'].map(t => (
              <button
                key={t}
                className={`tab-btn${active === t ? ' active' : ''}`}
                onClick={() => setActive(t)}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
          <div style={{ padding: '12px 16px', background: '#0d1117', borderRadius: '0 0 8px 8px', fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
            {active === 'rest'   && '# REST example for selected tab'}
            {active === 'kotlin' && '// Kotlin example for selected tab'}
            {active === 'swift'  && '// Swift example for selected tab'}
            {active === 'js'     && '// JavaScript example for selected tab'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 8 }}>
            Active tab: <code>.tab-btn.active</code> → <code>color: var(--red)</code> + <code>border-bottom-color: var(--red)</code>
          </div>
        </div>
      </Row>
    </GallerySection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §26  TEXT CARD
// ─────────────────────────────────────────────────────────────────────────────

function TextCardSection() {
  return (
    <GallerySection title="Text Card" desc=".text-card, .text-card--active — plain bordered content card with active state">
      <Row label="states" noBorder>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ width: 200 }}>
            <StateLabel>Default</StateLabel>
            <div className="text-card" style={{ padding: '14px 16px', pointerEvents: 'none' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--black)', marginBottom: 5 }}>Quick Start</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.55 }}>Set up your first routing request in under 5 minutes.</div>
            </div>
          </div>
          <div style={{ width: 200 }}>
            <StateLabel>Hover (simulated)</StateLabel>
            <div className="text-card" style={{ padding: '14px 16px', borderColor: 'var(--black)', boxShadow: 'var(--e2)', pointerEvents: 'none' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--black)', marginBottom: 5 }}>API Reference</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.55 }}>Full endpoint listing with parameters and response schemas.</div>
            </div>
          </div>
          <div style={{ width: 200 }}>
            <StateLabel>Active (.text-card--active)</StateLabel>
            <div className="text-card text-card--active" style={{ padding: '14px 16px', pointerEvents: 'none' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--black)', marginBottom: 5 }}>Selected Page</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.55 }}>Red border, very light red background tint.</div>
            </div>
          </div>
        </div>
      </Row>
    </GallerySection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §27  ANATOMY CARDS
// ─────────────────────────────────────────────────────────────────────────────

function AnatomyCardsSection() {
  return (
    <GallerySection title="Anatomy Cards" desc=".anatomy-card, .anatomy-row, .anatomy-prop, .anatomy-arrow, .anatomy-note — page section diagram">
      <Row label="specimen" noBorder>
        <div style={{ width: '100%', maxWidth: 560 }}>
          <div className="anatomy-card">
            <div className="anatomy-row">
              <span className="anatomy-prop">.page</span>
              <span className="anatomy-arrow">→</span>
              <span>Root page scroll container, max-width 800px, padded</span>
              <span className="anatomy-note">required</span>
            </div>
            <div className="anatomy-row">
              <span className="anatomy-prop">.page-header</span>
              <span className="anatomy-arrow">→</span>
              <span>Flex row: h1 title + PageActions buttons</span>
              <span className="anatomy-note">required</span>
            </div>
            <div className="anatomy-row">
              <span className="anatomy-prop">.quick-answer</span>
              <span className="anatomy-arrow">→</span>
              <span>1–2 sentence summary below the title</span>
              <span className="anatomy-note">required</span>
            </div>
            <div className="anatomy-row">
              <span className="anatomy-prop">.zone</span>
              <span className="anatomy-arrow">→</span>
              <span>Content section wrapper with <code>h2.sh</code> heading</span>
              <span className="anatomy-note">repeatable</span>
            </div>
          </div>
        </div>
      </Row>
    </GallerySection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §28  MODAL
// ─────────────────────────────────────────────────────────────────────────────

function ModalSection() {
  const [open, setOpen] = useState(false);
  return (
    <GallerySection title="Modal" desc=".md-overlay, .md-modal, .md-modal-header, .md-modal-body, .md-modal-close, .md-modal-copy">
      <Row label="trigger + overlay" noBorder>
        <div>
          <button className="page-action-btn" onClick={() => setOpen(true)}>Open modal demo</button>
          {open && (
            <>
              <div
                className="md-overlay"
                onClick={() => setOpen(false)}
                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000 }}
              />
              <div className="md-modal" style={{
                position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                zIndex: 1001, width: 480, maxWidth: '90vw',
                background: 'var(--white)', borderRadius: 12, overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
              }}>
                <div className="md-modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
                  <span className="md-modal-title" style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--black)' }}>Copy for LLM context</span>
                  <button className="md-modal-close" onClick={() => setOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border)', background: 'none', cursor: 'pointer', color: 'var(--muted)' }}>✕</button>
                </div>
                <div className="md-modal-body" style={{ padding: '16px 20px' }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--mid)', marginBottom: 12, lineHeight: 1.6 }}>
                    The text below is formatted for LLM context windows. Copy it and paste into your AI tool of choice.
                  </p>
                  <pre style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.5, overflow: 'auto', maxHeight: 140 }}>
# Calculate Route — TomTom Routing API{'\n'}GET /routing/1/calculateRoute/:locations/json{'\n'}Parameters: travelMode, traffic, routeType...
                  </pre>
                  <button className="md-modal-copy" onClick={() => setOpen(false)} style={{ marginTop: 12, padding: '8px 18px', background: 'var(--black)', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
                    Copy to clipboard
                  </button>
                </div>
              </div>
            </>
          )}
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 8 }}>
            <code>.md-overlay</code> dims the page · <code>.md-modal</code> is the white card · <code>.md-modal-close</code> is the ✕ button
          </div>
        </div>
      </Row>
    </GallerySection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §29  AI PANEL
// ─────────────────────────────────────────────────────────────────────────────

function AIPanelSection() {
  const SparkleIcon = () => (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
      <path d="M8 1v3M8 12v3M1 8h3M12 8h3M3.22 3.22l2.12 2.12M10.66 10.66l2.12 2.12M3.22 12.78l2.12-2.12M10.66 5.34l2.12-2.12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
  return (
    <GallerySection title="AI Panel" desc=".ai-panel, .ai-panel-header, .ai-msg--user, .ai-msg--ai, .ai-msg--typing, .ai-panel-footer">
      <Row label="static panel specimen" noBorder>
        <div style={{ width: 320, border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--white)' }}>
          {/* Header */}
          <div className="ai-panel-header" style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', background: 'var(--white)' }}>
            <div className="ai-panel-header-top" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span className="ai-panel-title" style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--black)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <SparkleIcon /> Ask AI
              </span>
              <div className="ai-panel-header-actions" style={{ display: 'flex', gap: 4 }}>
                <button className="ai-panel-icon-btn" style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid var(--border)', background: 'none', cursor: 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: '0.75rem' }}>✕</button>
              </div>
            </div>
            <div className="ai-panel-source" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.6875rem', color: 'var(--muted)' }}>
              Context:
              <span className="ai-panel-source-chip" style={{ padding: '2px 8px', borderRadius: 99, background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--mid)', fontSize: '0.625rem', fontWeight: 600 }}>
                Calculate Route
              </span>
            </div>
          </div>
          {/* Messages */}
          <div className="ai-panel-messages" style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 140 }}>
            {/* AI message */}
            <div className="ai-msg ai-msg--ai" style={{ display: 'flex', gap: 8, alignSelf: 'flex-start', maxWidth: '88%' }}>
              <span className="ai-msg-avatar" style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--s1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--red)' }}><SparkleIcon /></span>
              <span className="ai-msg-text" style={{ fontSize: '0.8125rem', color: 'var(--black)', background: 'var(--bg)', padding: '7px 10px', borderRadius: '0 8px 8px 8px', lineHeight: 1.5 }}>
                Hi! I have context for this page. Ask me anything about the Calculate Route endpoint.
              </span>
            </div>
            {/* User message */}
            <div className="ai-msg ai-msg--user" style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '88%', alignSelf: 'flex-end' }}>
              <span className="ai-msg-text" style={{ fontSize: '0.8125rem', color: '#fff', background: 'var(--red)', padding: '7px 10px', borderRadius: '8px 0 8px 8px', lineHeight: 1.5 }}>
                What parameters are required?
              </span>
            </div>
            {/* Typing dots */}
            <div className="ai-msg ai-msg--ai ai-msg--typing" style={{ display: 'flex', gap: 8, alignSelf: 'flex-start' }}>
              <span className="ai-msg-avatar" style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--s1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--red)' }}><SparkleIcon /></span>
              <span className="ai-msg-dots" style={{ display: 'flex', gap: 3, alignItems: 'center', padding: '8px 10px', background: 'var(--bg)', borderRadius: '0 8px 8px 8px' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--muted)', display: 'inline-block' }} />
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--muted)', display: 'inline-block' }} />
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--muted)', display: 'inline-block' }} />
              </span>
            </div>
          </div>
          {/* Footer */}
          <div className="ai-panel-footer" style={{ padding: '8px 12px', borderTop: '1px solid var(--border)' }}>
            <div className="ai-panel-input-wrap" style={{ display: 'flex', gap: 6, alignItems: 'center', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px' }}>
              <input className="ai-panel-input" placeholder="Ask a question…" style={{ flex: 1, border: 'none', background: 'none', fontSize: '0.8125rem', color: 'var(--black)', outline: 'none' }} readOnly />
              <button className="ai-panel-send" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, borderRadius: 6, background: 'var(--red)', border: 'none', cursor: 'default', color: '#fff', fontSize: '0.875rem' }}>→</button>
            </div>
            <p className="ai-panel-disclaimer" style={{ fontSize: '0.625rem', color: 'var(--muted)', textAlign: 'center', margin: '6px 0 0', lineHeight: 1.4 }}>
              AI answers may be inaccurate. Verify against the docs.
            </p>
          </div>
        </div>
      </Row>
    </GallerySection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §30  TOKEN DISPLAY + COLOUR SWATCHES
// ─────────────────────────────────────────────────────────────────────────────

function TokenDisplaySection() {
  return (
    <GallerySection title="Token Display + Colour Swatches" desc=".token-group, .token-table, .token-cell, .dt-swatch-row, .dt-swatch-ex, .swatch / .sw-*">
      <Row label="token-group + token-table">
        <div style={{ width: '100%', maxWidth: 540 }}>
          <div className="token-group">
            <div className="token-group-label">Brand Colours</div>
            <table className="token-table">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Value</th>
                  <th>Preview</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: '--brand', hex: '#DF1B12' },
                  { name: '--brand-hover', hex: '#C01008' },
                  { name: '--brand-light', hex: '#FF6B61' },
                ].map(t => (
                  <tr key={t.name}>
                    <td><div className="token-cell"><code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{t.name}</code></div></td>
                    <td><code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--mid)' }}>{t.hex}</code></td>
                    <td><div style={{ width: 28, height: 18, borderRadius: 4, background: t.hex, border: '1px solid rgba(0,0,0,0.08)' }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Row>
      <Row label="dt-swatch-row — design token swatches">
        <div>
          <div className="dt-swatch-row">
            {[
              { label: '--brand', bg: '#DF1B12', color: '#fff' },
              { label: '--warn-bg', bg: '#fef9c3', color: '#854d0e' },
              { label: '--info-bg', bg: '#e0f2fe', color: '#0369a1' },
              { label: '--success-bg', bg: '#dcfce7', color: '#15803d' },
              { label: '--danger-bg', bg: '#fee2e2', color: '#b91c1c' },
            ].map(s => (
              <div key={s.label} className="dt-swatch-ex" style={{ background: s.bg, color: s.color }}>{s.label}</div>
            ))}
          </div>
        </div>
      </Row>
      <Row label="swatch — click-to-copy colour card" noBorder>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { name: 'brand-red', hex: '#DF1B12' },
            { name: 'brand-dark', hex: '#C01008' },
            { name: 'blue-500',  hex: '#3b82f6' },
          ].map(s => (
            <div key={s.name} style={{ width: 80, borderRadius: 8, border: '1px solid var(--border)', overflow: 'hidden', cursor: 'pointer' }}>
              <div className="sw-color" style={{ background: s.hex }} />
              <div className="sw-info" style={{ padding: '6px 8px' }}>
                <div className="sw-name">{s.name}</div>
                <div className="sw-hex">{s.hex}</div>
              </div>
            </div>
          ))}
        </div>
      </Row>
    </GallerySection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §31  TYPOGRAPHY PATTERNS
// ─────────────────────────────────────────────────────────────────────────────

function TypographyPatternsSection() {
  return (
    <GallerySection title="Typography Patterns" desc=".type-category-grid, .type-cat, .type-scale-table, .weight-preview, .font-token-group">
      <Row label="type-category-grid (5-col)">
        <div style={{ width: '100%' }}>
          <div className="type-category-grid" style={{ maxWidth: 640 }}>
            {[
              { label: 'Display', desc: 'Hero headings, page titles' },
              { label: 'Heading', desc: 'Section h2/h3 headings' },
              { label: 'Body',    desc: 'Paragraph and prose text' },
              { label: 'Label',   desc: 'UI labels, caps headers' },
              { label: 'Code',    desc: 'Mono, code blocks, tokens' },
            ].map(c => (
              <div key={c.label} className="type-cat">
                <div className="type-cat-label">{c.label}</div>
                <div className="type-cat-desc">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </Row>
      <Row label="weight-preview row">
        <div style={{ width: '100%', maxWidth: 560 }}>
          <div className="weight-preview">
            {[
              { w: 400, label: 'Regular' },
              { w: 500, label: 'Medium' },
              { w: 600, label: 'SemiBold' },
              { w: 700, label: 'Bold' },
              { w: 800, label: 'ExtraBold' },
            ].map(({ w, label }) => (
              <div key={w} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontWeight: w, fontSize: '1rem', color: 'var(--black)' }}>Ag</span>
                <span style={{ fontSize: '0.625rem', color: 'var(--muted)', fontWeight: 600 }}>{label}</span>
                <span style={{ fontSize: '0.625rem', color: 'var(--muted)' }}>{w}</span>
              </div>
            ))}
          </div>
        </div>
      </Row>
      <Row label="font-token-group" noBorder>
        <div style={{ width: '100%', maxWidth: 480 }}>
          <div className="font-token-group">
            <div style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid var(--border)' }}>Display / Inter</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.2, color: 'var(--black)' }}>The quick brown fox</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 6 }}>
              <code>var(--font-display)</code> · used for <code>h1</code>, hero headings
            </div>
          </div>
        </div>
      </Row>
    </GallerySection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §32  ILLO CARD
// ─────────────────────────────────────────────────────────────────────────────

function IlloCardSection() {
  return (
    <GallerySection title="Illo Card" desc=".illo-card-wrap, .illo-card-actions, .illo-card-gen-name, .illo-card-refresh, .illo-card-ts — AI-generated illustration tiles">
      <Row label="specimen (hover to reveal actions)" noBorder>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {/* Default */}
          <div>
            <StateLabel>Default (no hover)</StateLabel>
            <div className="illo-card-wrap" style={{
              position: 'relative', width: 160, height: 160, borderRadius: 12,
              border: '1px solid var(--border)', overflow: 'hidden',
              background: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ fontSize: '2.5rem' }}>🗺️</div>
              <div className="illo-card-gen-name" style={{ position: 'absolute', bottom: 6, left: 8, fontSize: '0.5625rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>RouteMap_v3.svg</div>
              <div className="illo-card-ts" style={{ position: 'absolute', bottom: 6, right: 8, fontSize: '0.5rem', color: 'var(--muted)' }}>2min ago</div>
            </div>
          </div>
          {/* Hover (actions revealed) */}
          <div>
            <StateLabel>Hover (actions visible)</StateLabel>
            <div className="illo-card-wrap" style={{
              position: 'relative', width: 160, height: 160, borderRadius: 12,
              border: '1px solid var(--border)', overflow: 'hidden',
              background: 'linear-gradient(135deg, #fdf4ff 0%, #ede9fe 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ fontSize: '2.5rem' }}>⚡</div>
              {/* Actions overlay */}
              <div className="illo-card-actions" style={{
                position: 'absolute', top: 0, right: 0, left: 0,
                padding: '8px', display: 'flex', justifyContent: 'flex-end', gap: 4,
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.85) 0%, transparent 100%)',
              }}>
                <button className="illo-card-refresh" style={{
                  width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border)',
                  background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'default', fontSize: '0.875rem',
                }}>↻</button>
              </div>
              <div className="illo-card-gen-name" style={{ position: 'absolute', bottom: 6, left: 8, fontSize: '0.5625rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>EVStation_v1.svg</div>
            </div>
          </div>
          {/* Error state */}
          <div>
            <StateLabel>Refresh error</StateLabel>
            <div className="illo-card-wrap" style={{
              position: 'relative', width: 160, height: 160, borderRadius: 12,
              border: '1px solid var(--danger-border)', overflow: 'hidden',
              background: 'var(--danger-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8,
            }}>
              <div className="illo-card-refresh-err" style={{ fontSize: '0.75rem', color: 'var(--danger-text)', textAlign: 'center', padding: '0 12px', lineHeight: 1.5 }}>Generation failed — try again</div>
              <button className="illo-card-refresh" style={{
                padding: '5px 12px', borderRadius: 6, border: '1px solid var(--danger-border)',
                background: 'var(--white)', cursor: 'default', fontSize: '0.75rem', color: 'var(--danger-text)', fontWeight: 600,
              }}>Retry</button>
            </div>
          </div>
        </div>
      </Row>
    </GallerySection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §33  PLATFORM SWITCHER
// ─────────────────────────────────────────────────────────────────────────────

function PlatformSwitcherSection() {
  const [activePlatform, setActivePlatform] = useState('android');
  return (
    <GallerySection title="Platform Switcher" desc=".platform-switcher, .platform-btn, .platform-btn-compact — SDK platform filter">
      <Row label="full + compact variants" noBorder>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div>
            <StateLabel>Full (.platform-switcher)</StateLabel>
            <div className="platform-switcher" style={{ display: 'inline-flex', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
              {['android', 'ios', 'web'].map(p => (
                <button
                  key={p}
                  className={`platform-btn${activePlatform === p ? ' active' : ''}`}
                  onClick={() => setActivePlatform(p)}
                  style={{
                    padding: '6px 16px', fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer',
                    background: activePlatform === p ? 'var(--black)' : 'transparent',
                    color: activePlatform === p ? '#fff' : 'var(--mid)',
                    borderRight: p !== 'web' ? '1px solid var(--border)' : 'none',
                  }}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <StateLabel>Compact (.platform-btn-compact)</StateLabel>
            <div style={{ display: 'flex', gap: 4 }}>
              {['android', 'ios', 'web'].map(p => (
                <button
                  key={p}
                  className={`platform-btn-compact${activePlatform === p ? ' active' : ''}`}
                  onClick={() => setActivePlatform(p)}
                  style={{
                    padding: '4px 10px', fontSize: '0.6875rem', fontWeight: 600,
                    border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer',
                    background: activePlatform === p ? 'var(--black)' : 'var(--bg)',
                    color: activePlatform === p ? '#fff' : 'var(--mid)',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Row>
    </GallerySection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §34  DOCSPORTAL2 CARDS
// ─────────────────────────────────────────────────────────────────────────────

function DocsPortal2Section() {
  const Illo = ({ bg = '#dbeafe', icon = '🗺️' }) => (
    <div style={{ width: '100%', height: '100%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>{icon}</div>
  );

  return (
    <GallerySection title="DocsPortal2 Cards" desc=".dp2-product-card, .dp2-disc-card, .dp2-glass, .dp2-navsdk-card, .dp2-resource-card, .dp2-tool-card, .dp2-support-card">

      {/* Product card (plain) */}
      <Row label="dp2-product-card — plain + linked + in-progress">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { label: 'Routing API', linked: true, inProgress: false, desc: 'Fastest + shortest routes with real-time traffic.' },
            { label: 'Fleet SDK',   linked: false, inProgress: true,  desc: 'Vehicle tracking and dispatch tools.' },
          ].map(({ label, linked, inProgress, desc }) => (
            <div key={label} style={{ width: 200 }}>
              <StateLabel>{linked ? 'Linked' : 'In Progress'}</StateLabel>
              <div
                className={`dp2-product-card${linked ? ' dp2-product-card--linked' : ' dp2-product-card--stub'}${inProgress ? ' dp2-product-card--in-progress' : ''}`}
                style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: 12, background: 'var(--white)', cursor: linked ? 'pointer' : 'default', opacity: inProgress ? 0.7 : 1 }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>🗺️</div>
                <h2 className="dp2-product-name" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--black)', margin: '0 0 4px' }}>{label}</h2>
                <div className="dp2-product-desc" style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.5 }}>{desc}</div>
                <div className="dp2-product-footer" style={{ marginTop: 10, display: 'flex', gap: 6 }}>
                  {linked
                    ? <span className="dp2-product-doc-btn" style={{ fontSize: '0.6875rem', padding: '3px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--mid)', cursor: 'default' }}>Docs →</span>
                    : <span className="dp2-product-doc-btn dp2-product-doc-btn--disabled" style={{ fontSize: '0.6875rem', padding: '3px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--muted)', opacity: 0.55, cursor: 'default' }}>Coming soon</span>
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
      </Row>

      {/* Disc card */}
      <Row label="dp2-disc-card — discovery card with illo + body">
        <div style={{ width: 220, border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--white)' }}
          className="dp2-disc-card dp2-disc-card--linked">
          <div className="dp2-disc-card-illo" style={{ height: 100 }}><Illo bg="#dcfce7" icon="⚡" /></div>
          <div className="dp2-disc-card-body" style={{ padding: '12px 14px' }}>
            <div className="dp2-disc-card-label" style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--muted)', marginBottom: 4 }}>EV</div>
            <h2 className="dp2-disc-card-title" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--black)', margin: '0 0 4px' }}>Plan a multi-stop EV journey</h2>
          </div>
        </div>
      </Row>

      {/* Glass card */}
      <Row label="dp2-glass — hover reveal overlay">
        <div style={{ width: 220, position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}
          className="dp2-product-card dp2-product-card--illo dp2-product-card--linked">
          <div className="dp2-illo-fill" style={{ height: 140 }}><Illo bg="#e0f2fe" icon="🧭" /></div>
          <div className="dp2-glass" style={{ padding: '12px 14px', background: 'var(--white)' }}>
            <div className="dp2-glass-default">
              <h2 className="dp2-glass-title" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--black)', margin: '0 0 4px' }}>Navigation SDK</h2>
            </div>
            <div className="dp2-glass-body" style={{ marginTop: 6 }}>
              <p className="dp2-glass-desc" style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.5, margin: 0 }}>Turn-by-turn guidance with live rerouting and EV charging stops.</p>
            </div>
          </div>
        </div>
      </Row>

      {/* Resource card */}
      <Row label="dp2-resource-card + dp2-tool-card + dp2-support-card">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {/* Resource */}
          <div className="dp2-resource-card" style={{ width: 180, padding: '14px', border: '1px solid var(--border)', borderRadius: 12, background: 'var(--white)' }}>
            <div className="dp2-resource-icon-area" style={{ fontSize: '1.5rem', marginBottom: 8 }}>📚</div>
            <div className="dp2-resource-body">
              <h2 className="dp2-resource-name" style={{ fontSize: '0.8125rem', fontWeight: 700, margin: '0 0 4px' }}>SDK Changelog</h2>
              <div className="dp2-resource-desc" style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.5 }}>Version history and migration guides.</div>
            </div>
          </div>
          {/* Tool */}
          <div className="dp2-tool-card" style={{ width: 180, padding: '14px', border: '1px solid var(--border)', borderRadius: 12, background: 'var(--white)' }}>
            <div style={{ width: 32, height: 32, background: 'var(--bg)', borderRadius: 8, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔧</div>
            <div className="dp2-tool-body">
              <h2 className="dp2-tool-name" style={{ fontSize: '0.8125rem', fontWeight: 700, margin: '0 0 4px' }}>API Explorer</h2>
              <div className="dp2-tool-desc" style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.5 }}>Interactive endpoint tester.</div>
            </div>
          </div>
          {/* Support */}
          <div className="dp2-support-card" style={{ width: 180, padding: '14px', border: '1px solid var(--border)', borderRadius: 12, background: 'var(--white)' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>🎧</div>
            <span className="dp2-support-title" style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--black)', display: 'block', marginBottom: 4 }}>Developer Support</span>
            <div className="dp2-support-desc" style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.5 }}>Get technical help for TomTom APIs.</div>
          </div>
        </div>
      </Row>

      {/* dp2-navsdk-wrap + card */}
      <Row label="dp2-navsdk-wrap — image background + dp2-navsdk-card overlay (position:absolute)" noBorder>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 10, lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--black)' }}>Structure:</strong>{' '}
          <code>.dp2-navsdk-wrap</code> (position:relative, overflow:hidden) wraps a{' '}
          <code>.dp2-navsdk-img</code> background image/fill, with{' '}
          <code>.dp2-navsdk-card</code> absolutely positioned over it (bottom:16px, left:16px).
        </div>
        {/* Default */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div>
            <StateLabel>Default</StateLabel>
            <div className="dp2-navsdk-wrap">
              {/* Background image fill */}
              <div className="dp2-navsdk-img" style={{ background: 'linear-gradient(160deg, #1e1b4b 0%, #312e81 60%, #1e3a5f 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
                🧭
              </div>
              {/* Floating card overlay */}
              <div className="dp2-navsdk-card">
                <div className="dp2-navsdk-badge">Navigation SDK</div>
                <h2 className="dp2-navsdk-title">Build turn-by-turn navigation</h2>
                <p className="dp2-navsdk-sub">For Android and iOS — batteries included.</p>
                <div className="dp2-navsdk-cta">Get started →</div>
              </div>
            </div>
          </div>
          {/* Hover */}
          <div>
            <StateLabel>Hover — card lifts (.dp2-navsdk-wrap:hover .dp2-navsdk-card)</StateLabel>
            <div className="dp2-navsdk-wrap" style={{ cursor: 'default' }}>
              <div className="dp2-navsdk-img" style={{ background: 'linear-gradient(160deg, #064e3b 0%, #065f46 60%, #0f4c75 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
                📍
              </div>
              <div className="dp2-navsdk-card" style={{ transform: 'translateY(-4px) translateX(4px) scale(1.02)' }}>
                <div className="dp2-navsdk-badge">Maps SDK</div>
                <h2 className="dp2-navsdk-title">Render interactive maps</h2>
                <p className="dp2-navsdk-sub">Web, Android and iOS — fully customisable styles.</p>
                <div className="dp2-navsdk-cta">Get started →</div>
              </div>
            </div>
          </div>
        </div>
      </Row>
    </GallerySection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §35  ADAS STACK + CAPABILITIES
// ─────────────────────────────────────────────────────────────────────────────

function AdasSection() {
  return (
    <GallerySection title="ADAS Stack + Capabilities" desc=".adas-stack, .adas-stack-layer, .adas-stack-highlight, .adas-cap-grid, .adas-highlights">
      <Row label="adas-stack — layered architecture diagram">
        <div style={{ width: '100%', maxWidth: 480 }}>
          <div className="adas-stack">
            {[
              { label: 'ADAS Application Layer', badge: 'OEM', badgeCls: 'adas-stack-badge adas-stack-badge-oem', cls: 'adas-stack-muted' },
              { label: 'TomTom ADAS SDK',         badge: 'TomTom', badgeCls: 'adas-stack-badge adas-stack-badge-tt', cls: 'adas-stack-highlight' },
              { label: 'Maps & Routing APIs',      badge: 'TomTom', badgeCls: 'adas-stack-badge adas-stack-badge-tt', cls: '' },
              { label: 'Platform / OS',            badge: 'OEM', badgeCls: 'adas-stack-badge adas-stack-badge-oem', cls: 'adas-stack-muted' },
            ].map((layer, i) => (
              <div key={i} className={`adas-stack-layer${layer.cls ? ` ${layer.cls}` : ''}`} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', border: '1px solid var(--border)',
                background: layer.cls === 'adas-stack-highlight' ? 'var(--info-bg)' : layer.cls === 'adas-stack-muted' ? 'var(--bg)' : 'var(--white)',
              }}>
                <span className="adas-stack-text" style={{ fontSize: '0.8125rem', fontWeight: layer.cls === 'adas-stack-highlight' ? 700 : 400, color: 'var(--black)' }}>{layer.label}</span>
                <span className="adas-stack-label" style={{ fontSize: '0.625rem', fontWeight: 700, padding: '2px 7px', borderRadius: 99, background: layer.badgeCls.includes('tt') ? 'var(--danger-bg)' : 'var(--bg)', color: layer.badgeCls.includes('tt') ? 'var(--red)' : 'var(--muted)', border: '1px solid var(--border)' }}>{layer.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </Row>
      <Row label="adas-cap-grid — capability cards" noBorder>
        <div style={{ width: '100%' }}>
          <div className="adas-cap-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, maxWidth: 540 }}>
            {[
              { icon: '🚦', title: 'Speed Alerts',   tag: 'ISA' },
              { icon: '⚠️', title: 'Hazard Warning',  tag: 'ADAS' },
              { icon: '🔄', title: 'Lane Guidance',   tag: 'TJA' },
            ].map(c => (
              <div key={c.title} className="adas-cap-card" style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: 10, background: 'var(--white)' }}>
                <div className="adas-cap-icon" style={{ fontSize: '1.25rem', marginBottom: 6 }}>{c.icon}</div>
                <div className="adas-cap-title" style={{ fontSize: '0.8125rem', fontWeight: 700, marginBottom: 3 }}>{c.title}</div>
                <span className="adas-cap-tag" style={{ fontSize: '0.5625rem', fontWeight: 700, padding: '1px 6px', borderRadius: 99, background: 'var(--info-bg)', color: 'var(--info-text)', border: '1px solid var(--info-border)' }}>{c.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </Row>
    </GallerySection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §36  SEMANTIC CARDS
// ─────────────────────────────────────────────────────────────────────────────

function SemanticCardsSection() {
  return (
    <GallerySection title="Semantic Cards" desc=".sem-card, .sem-title, .sem-body — tinted semantic colour blocks">
      <Row label="four semantic variants" noBorder>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 480 }}>
          {[
            { title: 'Info',    body: 'Neutral informational context. No urgency.',   bg: 'var(--info-bg)',    border: 'var(--info-border)',    text: 'var(--info-text)' },
            { title: 'Success', body: 'Confirmation that something worked correctly.', bg: 'var(--success-bg)', border: 'var(--success-border)', text: 'var(--success-text)' },
            { title: 'Warning', body: 'Something to watch out for — not yet broken.',  bg: 'var(--warn-bg)',    border: 'var(--warn-border)',    text: 'var(--warn-text)' },
            { title: 'Danger',  body: 'Critical issue or destructive action ahead.',   bg: 'var(--danger-bg)',  border: 'var(--danger-border)',  text: 'var(--danger-text)' },
          ].map(s => (
            <div key={s.title} className="sem-card" style={{ borderLeftColor: s.border, borderLeftWidth: 3, borderLeftStyle: 'solid', background: s.bg, borderTopColor: s.border, borderRightColor: s.border, borderBottomColor: s.border, borderWidth: 1, borderStyle: 'solid' }}>
              <div className="sem-title" style={{ color: s.text }}>{s.title}</div>
              <div className="sem-body">{s.body}</div>
            </div>
          ))}
        </div>
      </Row>
    </GallerySection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §37  TOKEN FLOW (tfi-*)
// ─────────────────────────────────────────────────────────────────────────────

function TokenFlowSection() {
  return (
    <GallerySection title="Token Flow" desc=".tfi-step, .tfi-icon, .tfi-icon-token/component/product, .tfi-arrow, .tfi-label — design token pipeline diagram">
      <Row label="3-step flow" noBorder>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
          {[
            { icon: '🎨', cls: 'tfi-icon-token',     label: 'Design Tokens',    desc: 'Raw values' },
            { arrow: true },
            { icon: '🧩', cls: 'tfi-icon-component', label: 'Components',       desc: 'Semantic use' },
            { arrow: true },
            { icon: '📦', cls: 'tfi-icon-product',   label: 'Product UI',       desc: 'In-product' },
          ].map((s, i) => s.arrow ? (
            <div key={i} className="tfi-arrow" style={{ fontSize: '1.25rem', color: 'var(--border)', alignSelf: 'flex-start', paddingTop: 10 }}>→</div>
          ) : (
            <div key={i} className="tfi-step">
              <div className={`tfi-icon ${s.cls}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>{s.icon}</div>
              <div className="tfi-label" style={{ textAlign: 'center', lineHeight: 1.3 }}>
                <div style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--black)' }}>{s.label}</div>
                <div style={{ fontSize: '0.625rem', color: 'var(--muted)' }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Row>
    </GallerySection>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// §38  TRYIT PANEL (API DEMO WIDGET)
// ─────────────────────────────────────────────────────────────────────────────

function TryItPanelSection() {
  const [status, setStatus] = useState('idle'); // idle | running | ok | error

  const FAKE_RESULT = {
    summary: { numResults: 3, totalResults: 42, queryTime: 87 },
    results: [
      { id: 'POI:528009004684813', score: 10.651, type: 'POI', poi: { name: 'Piccadilly Circus Underground' }, address: { freeformAddress: 'Piccadilly Circus, London' }, position: { lat: 51.5099, lon: -0.1342 } },
      { id: 'POI:528009004684814', score: 9.2,   type: 'POI', poi: { name: 'Piccadilly Circus (Stop A)' },   address: { freeformAddress: 'London W1J 9HP' },               position: { lat: 51.5098, lon: -0.1340 } },
    ],
  };

  const runDemo = () => {
    setStatus('running');
    setTimeout(() => setStatus('ok'), 900);
  };
  const reset = () => setStatus('idle');

  const productStyle = { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' };
  const methodStyle  = { bg: '#dcfce7', text: '#166534' };

  return (
    <GallerySection title="TryIt Panel (API Demo Widget)" desc="The live-preview widget embedded in API reference pages — all states side by side">

      {/* Anatomy labels */}
      <Row label="component anatomy">
        <div style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.8 }}>
          <strong style={{ color: 'var(--black)' }}>Structure (all inline styles, no custom CSS classes):</strong><br/>
          <code>container</code> → border + borderRadius:12 + bg:var(--surface)<br/>
          <code>header bar</code> → product badge | method badge | endpoint name | ▶ Preview button<br/>
          <code>description</code> → small muted text + optional ⚠ note callout<br/>
          <code>inputs row</code> → flex row of labelled mono-font input fields<br/>
          <code>status bar</code> → ● Response/Error + count + elapsed + copy button<br/>
          <code>output area</code> → SDK map | JSON scroll | table | tile image<br/>
          <code>idle state</code> → italic muted "Click Preview…" placeholder
        </div>
      </Row>

      {/* Idle */}
      <Row label="idle state">
        <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--surface)', width: '100%', maxWidth: 540 }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.5625rem', fontWeight: 700, padding: '2px 7px', borderRadius: 4, border: `1px solid ${productStyle.border}`, background: productStyle.bg, color: productStyle.text }}>Search API</span>
            <span style={{ fontSize: '0.5625rem', fontWeight: 800, padding: '2px 6px', borderRadius: 4, background: methodStyle.bg, color: methodStyle.text, letterSpacing: '0.04em' }}>GET</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--black)', flex: 1 }}>Fuzzy Search</span>
            <button onClick={runDemo} style={{ padding: '4px 12px', borderRadius: 5, border: 'none', background: 'var(--brand,#e2001a)', color: '#fff', fontSize: '0.6875rem', fontWeight: 700, cursor: 'pointer' }}>
              ▶ Preview
            </button>
          </div>
          <div style={{ padding: '8px 14px 0', fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.5 }}>
            Typo-tolerant search across addresses, POIs and geographies.
          </div>
          <div style={{ padding: '10px 14px', display: 'flex', gap: 7, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            {[{ label: 'Query', placeholder: 'Piccadilly Circus', flex: true }, { label: 'Limit', placeholder: '5', width: 60 }].map(f => (
              <div key={f.label} style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: f.flex ? 1 : 'none', minWidth: f.width ?? 110 }}>
                <label style={{ fontSize: '0.5rem', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{f.label}</label>
                <input readOnly placeholder={f.placeholder} style={{ padding: '5px 8px', borderRadius: 5, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--black)', fontSize: '0.6875rem', fontFamily: 'var(--font-mono,monospace)', width: f.flex ? '100%' : `${f.width}px`, boxSizing: 'border-box' }} />
              </div>
            ))}
          </div>
          <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border)', fontSize: '0.6875rem', color: 'var(--muted)', background: 'var(--bg)', fontStyle: 'italic' }}>
            Click Preview to see a live response.
          </div>
        </div>
      </Row>

      {/* Running */}
      <Row label="running state (button disabled, spinner text)">
        <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--surface)', width: '100%', maxWidth: 540 }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.5625rem', fontWeight: 700, padding: '2px 7px', borderRadius: 4, border: `1px solid ${productStyle.border}`, background: productStyle.bg, color: productStyle.text }}>Search API</span>
            <span style={{ fontSize: '0.5625rem', fontWeight: 800, padding: '2px 6px', borderRadius: 4, background: methodStyle.bg, color: methodStyle.text }}>GET</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--black)', flex: 1 }}>Fuzzy Search</span>
            <button disabled style={{ padding: '4px 12px', borderRadius: 5, border: 'none', background: 'var(--mid)', color: '#fff', fontSize: '0.6875rem', fontWeight: 700, cursor: 'not-allowed' }}>…</button>
          </div>
          <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border)', fontSize: '0.6875rem', color: 'var(--muted)', background: 'var(--bg)', fontStyle: 'italic' }}>
            Fetching…
          </div>
        </div>
      </Row>

      {/* Success with response */}
      <Row label="success state — response bar + JSON output">
        <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--surface)', width: '100%', maxWidth: 540 }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontSize: '0.5625rem', fontWeight: 700, padding: '2px 7px', borderRadius: 4, border: `1px solid ${productStyle.border}`, background: productStyle.bg, color: productStyle.text }}>Search API</span>
            <span style={{ fontSize: '0.5625rem', fontWeight: 800, padding: '2px 6px', borderRadius: 4, background: methodStyle.bg, color: methodStyle.text }}>GET</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--black)', flex: 1 }}>Fuzzy Search</span>
            <button style={{ padding: '4px 12px', borderRadius: 5, border: 'none', background: 'var(--brand,#e2001a)', color: '#fff', fontSize: '0.6875rem', fontWeight: 700, cursor: 'pointer' }}>▶ Preview</button>
          </div>
          <div style={{ padding: '8px 14px 0', fontSize: '0.75rem', color: 'var(--mid)' }}>Typo-tolerant search across addresses, POIs and geographies.</div>
          <div style={{ padding: '8px 14px 10px', display: 'flex', gap: 7 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
              <label style={{ fontSize: '0.5rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Query</label>
              <input readOnly defaultValue="Piccadilly Circus" style={{ padding: '5px 8px', borderRadius: 5, border: '1px solid var(--brand,#e2001a)', background: 'var(--bg)', fontSize: '0.6875rem', fontFamily: 'var(--font-mono,monospace)', width: '100%', boxSizing: 'border-box', color: 'var(--black)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <label style={{ fontSize: '0.5rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Limit</label>
              <input readOnly defaultValue="5" style={{ padding: '5px 8px', borderRadius: 5, border: '1px solid var(--border)', background: 'var(--bg)', fontSize: '0.6875rem', fontFamily: 'var(--font-mono,monospace)', width: 60, color: 'var(--black)' }} />
            </div>
          </div>
          {/* Status bar */}
          <div style={{ borderTop: '1px solid var(--border)' }}>
            <div style={{ padding: '5px 14px', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg)', fontSize: '0.6875rem' }}>
              <span style={{ color: '#15803d', fontWeight: 600 }}><span style={{ fontSize: '0.5rem' }}>●</span> Response</span>
              <span style={{ color: 'var(--mid)' }}>2 results</span>
              <span style={{ color: 'var(--muted)' }}>87ms</span>
              <div style={{ flex: 1 }} />
              <button style={{ marginLeft: 'auto', background: 'rgba(0,0,0,0.06)', border: 'none', color: 'var(--mid)', fontSize: '0.75rem', borderRadius: 4, padding: '3px 8px', cursor: 'pointer' }}>Copy</button>
            </div>
            {/* JSON */}
            <div style={{ padding: '10px 14px', background: 'var(--bg)', maxHeight: 160, overflowY: 'auto', borderTop: '1px solid var(--border)', fontSize: '0.6875rem', fontFamily: 'var(--font-mono,monospace)', color: 'var(--mid)', lineHeight: 1.6 }}>
              <pre style={{ margin: 0 }}>{JSON.stringify(FAKE_RESULT, null, 2)}</pre>
            </div>
          </div>
        </div>
      </Row>

      {/* Error */}
      <Row label="error state — red status bar" noBorder>
        <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--surface)', width: '100%', maxWidth: 540 }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontSize: '0.5625rem', fontWeight: 700, padding: '2px 7px', borderRadius: 4, border: `1px solid ${productStyle.border}`, background: productStyle.bg, color: productStyle.text }}>Search API</span>
            <span style={{ fontSize: '0.5625rem', fontWeight: 800, padding: '2px 6px', borderRadius: 4, background: methodStyle.bg, color: methodStyle.text }}>GET</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--black)', flex: 1 }}>Fuzzy Search</span>
            <button style={{ padding: '4px 12px', borderRadius: 5, border: 'none', background: 'var(--brand,#e2001a)', color: '#fff', fontSize: '0.6875rem', fontWeight: 700, cursor: 'pointer' }}>▶ Preview</button>
          </div>
          <div style={{ borderTop: '1px solid var(--border)' }}>
            <div style={{ padding: '5px 14px', display: 'flex', alignItems: 'center', gap: 8, background: '#fff1f2', fontSize: '0.6875rem' }}>
              <span style={{ color: '#be123c', fontWeight: 600 }}><span style={{ fontSize: '0.5rem' }}>●</span> Error</span>
              <div style={{ flex: 1 }} />
            </div>
            <div style={{ padding: '10px 14px', background: 'var(--bg)', borderTop: '1px solid var(--border)', fontSize: '0.6875rem', fontFamily: 'var(--font-mono,monospace)', color: '#be123c', lineHeight: 1.6 }}>
              <pre style={{ margin: 0 }}>{`{ "error": "401 Unauthorized — check your API key" }`}</pre>
            </div>
          </div>
        </div>
      </Row>

    </GallerySection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §39  PAGE ACTIONS BAR
// ─────────────────────────────────────────────────────────────────────────────

function PageActionsSection() {
  const SparkleIcon = () => (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path d="M8 1v3M8 12v3M1 8h3M12 8h3M3.22 3.22l2.12 2.12M10.66 10.66l2.12 2.12M3.22 12.78l2.12-2.12M10.66 5.34l2.12-2.12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
  const ClipboardIcon = () => (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <rect x="5" y="1" width="6" height="3" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M4 2.5H3a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1v-10a1 1 0 00-1-1h-1" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  );

  return (
    <GallerySection title="Page Actions Bar" desc=".page-actions, .page-action-btn, .page-action-btn--ai, .page-action-sep, .page-action-btn--disabled">
      <Row label="full bar — all button types">
        <div style={{ width: '100%', maxWidth: 560 }}>
          <div className="page-actions" style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
            {/* AI button */}
            <button className="page-action-btn page-action-btn--ai" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <SparkleIcon /> Ask AI
            </button>
            {/* Separator */}
            <div className="page-action-sep" style={{ width: 1, height: 16, background: 'var(--border)', margin: '0 2px' }} />
            {/* Copy link */}
            <button className="page-action-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <ClipboardIcon /> Copy link
            </button>
            {/* Copy for LLM */}
            <button className="page-action-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: '0.625rem', fontWeight: 700, border: '1.5px solid currentColor', borderRadius: 3, padding: '0 2px', lineHeight: '13px', opacity: 0.75 }}>M↓</span>
              Copy for LLM
            </button>
            {/* Separator */}
            <div className="page-action-sep" style={{ width: 1, height: 16, background: 'var(--border)', margin: '0 2px' }} />
            {/* Disabled */}
            <button className="page-action-btn page-action-btn--disabled" disabled>
              Bookmark
            </button>
          </div>
        </div>
      </Row>

      <Row label="individual button states">
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <StateLabel>Default</StateLabel>
            <button className="page-action-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <ClipboardIcon /> Copy link
            </button>
          </div>
          <div>
            <StateLabel>Hover (simulated)</StateLabel>
            <button className="page-action-btn" style={{ background: 'var(--border)', color: 'var(--black)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <ClipboardIcon /> Copy link
            </button>
          </div>
          <div>
            <StateLabel>AI variant</StateLabel>
            <button className="page-action-btn page-action-btn--ai" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <SparkleIcon /> Ask AI
            </button>
          </div>
          <div>
            <StateLabel>AI hover (simulated)</StateLabel>
            <button className="page-action-btn page-action-btn--ai" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'var(--s1)', borderColor: 'var(--red)', color: 'var(--red)' }}>
              <SparkleIcon /> Ask AI
            </button>
          </div>
          <div>
            <StateLabel>Disabled</StateLabel>
            <button className="page-action-btn page-action-btn--disabled" disabled>Bookmark</button>
          </div>
        </div>
      </Row>

      <Row label="copy-btn (inside code blocks)" noBorder>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div>
            <StateLabel>Default</StateLabel>
            <div style={{ background: 'var(--code-bg)', borderRadius: 6, padding: '4px 6px', display: 'inline-flex' }}>
              <button className="copy-btn">Copy</button>
            </div>
          </div>
          <div>
            <StateLabel>Hover (simulated)</StateLabel>
            <div style={{ background: 'var(--code-bg)', borderRadius: 6, padding: '4px 6px', display: 'inline-flex' }}>
              <button className="copy-btn" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>Copy</button>
            </div>
          </div>
          <div>
            <StateLabel>Copied (.copied)</StateLabel>
            <div style={{ background: 'var(--code-bg)', borderRadius: 6, padding: '4px 6px', display: 'inline-flex' }}>
              <button className="copy-btn copied" style={{ color: '#4ade80' }}>Copied!</button>
            </div>
          </div>
        </div>
      </Row>
    </GallerySection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §40  PAGE LAYOUT UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

function PageLayoutUtilitiesSection() {
  return (
    <GallerySection title="Page Layout Utilities" desc=".page-subtitle, .page-body, .grid-2-col, .examples-grid, .ctx-grid">

      {/* page-subtitle */}
      <Row label=".page-subtitle — optional one-liner below h1">
        <div style={{ width: '100%', maxWidth: 560, border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
            <h1 style={{ margin: '0 0 4px', fontSize: '1.375rem', fontWeight: 800, color: 'var(--black)', fontFamily: 'var(--font-display)' }}>Vehicle Interface</h1>
            <p className="page-subtitle" style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--mid)', lineHeight: 1.55 }}>Displays map, guidance and media controls on the vehicle touchscreen.</p>
          </div>
          <div style={{ padding: '8px 20px', fontSize: '0.75rem', color: 'var(--muted)' }}>
            ↑ <code>h1</code> + <code>.page-subtitle</code> — subtitle is a single sentence, max 12 words
          </div>
        </div>
      </Row>

      {/* page-body */}
      <Row label=".page-body — doc-template content wrapper">
        <div style={{ width: '100%', maxWidth: 560, border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          <div className="page-body" style={{ padding: '16px 20px' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.6, margin: '0 0 8px' }}>
              <code>.page-body</code> is the main scrolling prose container used in doc template pages
              (<code>DocIntroTemplate</code>, <code>DocFeatureTemplate</code>, <code>DocUseCaseTemplate</code>).
              It sets <code>max-width</code>, padding, and line-height for long-form content.
            </p>
          </div>
        </div>
      </Row>

      {/* grid-2-col */}
      <Row label=".grid-2-col — responsive 2-column grid (collapses to 1 on mobile)">
        <div style={{ width: '100%', maxWidth: 480 }}>
          <div className="grid-2-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {['Card A', 'Card B', 'Card C', 'Card D'].map(c => (
              <div key={c} style={{ padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--black)', textAlign: 'center' }}>{c}</div>
            ))}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 8 }}>
            Collapses to 1 column below 760px. Used for feature cards, EV options, navigation controls.
          </div>
        </div>
      </Row>

      {/* examples-grid */}
      <Row label=".examples-grid — ExampleCard grid (auto-fill, min 280px columns)" noBorder>
        <div style={{ width: '100%', maxWidth: 560 }}>
          <div className="examples-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {['EV Station Finder', 'Route Planner', 'Traffic Heatmap'].map(t => (
              <a key={t} className="nav-card example-card" href="#" onClick={e => e.preventDefault()}>
                <div className="example-card-thumb" style={{ height: 80, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🗺️</div>
                <div className="example-card-body">
                  <span className="example-card-title">{t}</span>
                  <p className="example-card-desc">Interactive live demo with TomTom Maps SDK.</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </Row>
    </GallerySection>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// §41  APP SHELL LAYOUT
// ─────────────────────────────────────────────────────────────────────────────

function ShellLayoutSection() {
  const NavCol = ({ collapsed }) => (
    <div style={{
      width: collapsed ? 0 : 200,
      minWidth: collapsed ? 0 : 200,
      borderRight: collapsed ? 'none' : '1px solid var(--border)',
      background: 'var(--white)',
      overflow: 'hidden',
      transition: 'width 0.32s',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {!collapsed && (
        <div style={{ padding: '12px 16px', flex: 1 }}>
          <div style={{ fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Routing API</div>
          {['Introduction', 'Calculate Route ●', 'Batch Route', 'Matrix Routing'].map((l, i) => (
            <div key={l} style={{ padding: '5px 8px', fontSize: '0.7rem', color: i === 1 ? 'var(--black)' : 'var(--mid)', fontWeight: i === 1 ? 600 : 400, background: i === 1 ? 'var(--s1)' : 'transparent', borderRadius: 4, marginBottom: 2 }}>{l.replace(' ●', '')}</div>
          ))}
        </div>
      )}
    </div>
  );

  const ContentCol = () => (
    <div style={{ flex: 1, padding: '16px 20px', minWidth: 0, background: 'var(--white)' }}>
      <div style={{ height: 12, width: '60%', background: 'var(--border)', borderRadius: 4, marginBottom: 8 }} />
      <div style={{ height: 8, width: '90%', background: 'var(--bg)', borderRadius: 3, marginBottom: 5 }} />
      <div style={{ height: 8, width: '75%', background: 'var(--bg)', borderRadius: 3, marginBottom: 5 }} />
      <div style={{ height: 8, width: '82%', background: 'var(--bg)', borderRadius: 3 }} />
    </div>
  );

  const TocCol = ({ hidden }) => (
    <div style={{
      width: hidden ? 0 : 120,
      minWidth: hidden ? 0 : 120,
      borderLeft: hidden ? 'none' : '1px solid var(--border)',
      background: 'var(--white)',
      overflow: 'hidden',
      transition: 'width 0.32s',
    }}>
      {!hidden && (
        <div style={{ padding: '12px 14px' }}>
          <div style={{ fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>On this page</div>
          {['Request', 'Parameters', 'Response', 'Examples'].map((l, i) => (
            <div key={l} style={{ padding: '3px 0 3px 8px', borderLeft: `1px solid ${i === 1 ? 'var(--red)' : 'var(--border)'}`, fontSize: '0.6rem', color: i === 1 ? 'var(--red)' : 'var(--muted)', fontWeight: i === 1 ? 600 : 400, marginBottom: 2 }}>{l}</div>
          ))}
        </div>
      )}
    </div>
  );

  const HeaderBar = () => (
    <div style={{ height: 36, background: 'var(--white)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8 }}>
      <div style={{ fontWeight: 800, fontSize: '0.7rem', color: 'var(--red)', fontFamily: 'var(--font-display)' }}>TomTom</div>
      <div style={{ height: 12, width: 1, background: 'var(--border)' }} />
      {['Maps', 'Nav', 'EV'].map(l => <span key={l} style={{ fontSize: '0.6rem', color: 'var(--mid)', padding: '2px 6px' }}>{l}</span>)}
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
        <div style={{ width: 18, height: 18, borderRadius: 4, border: '1px solid var(--border)' }} />
        <div style={{ width: 44, height: 18, borderRadius: 4, background: 'var(--red)' }} />
      </div>
    </div>
  );

  const TopnavBar = () => (
    <div style={{ height: 28, background: 'var(--white)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 4, fontSize: '0.6rem' }}>
      <span style={{ color: 'var(--muted)' }}>Developer Portal</span>
      <span style={{ color: 'var(--border)' }}>/</span>
      <span style={{ color: 'var(--muted)' }}>Routing</span>
      <span style={{ color: 'var(--border)' }}>/</span>
      <span style={{ color: 'var(--black)', fontWeight: 500 }}>Calculate Route</span>
      <span style={{ marginLeft: 'auto', fontSize: '0.5rem', fontWeight: 700, padding: '1px 5px', borderRadius: 3, background: 'var(--warn-bg)', color: 'var(--warn-text)', border: '1px solid var(--warn-border)' }}>Beta</span>
      <span style={{ fontSize: '0.5rem', padding: '1px 5px', borderRadius: 3, background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--muted)' }}>v1.28</span>
    </div>
  );

  return (
    <GallerySection title="App Shell Layout" desc=".shell (3-col grid) · .sidenav | content | .toc — four grid variants">
      <Row label=".shell — default (sidenav + content + toc)">
        <div style={{ width: '100%', maxWidth: 680, border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          <HeaderBar />
          <TopnavBar />
          <div style={{ display: 'flex', height: 140 }}>
            <NavCol />
            <ContentCol />
            <TocCol />
          </div>
        </div>
      </Row>

      <Row label=".shell--no-toc — sidenav + content (API detail pages, wide layouts)">
        <div style={{ width: '100%', maxWidth: 680, border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          <HeaderBar />
          <TopnavBar />
          <div style={{ display: 'flex', height: 120 }}>
            <NavCol />
            <ContentCol />
            <TocCol hidden />
          </div>
        </div>
      </Row>

      <Row label=".shell--nav-collapsed — sidenav hidden + content + toc">
        <div style={{ width: '100%', maxWidth: 680, border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          <HeaderBar />
          <TopnavBar />
          <div style={{ display: 'flex', height: 120 }}>
            <NavCol collapsed />
            <ContentCol />
            <TocCol />
          </div>
        </div>
      </Row>

      <Row label=".shell--nav-collapsed.shell--no-toc — full-width content">
        <div style={{ width: '100%', maxWidth: 680, border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          <HeaderBar />
          <TopnavBar />
          <div style={{ display: 'flex', height: 120 }}>
            <NavCol collapsed />
            <ContentCol />
            <TocCol hidden />
          </div>
        </div>
      </Row>

      {/* ── Two-column API ref layout inside shell ── */}
      <Row label=".shell + .api-ref-sections — 2-col API reference layout (left: prose+params · right: dark code)" noBorder>
        <div style={{ width: '100%', maxWidth: 760, border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          <HeaderBar />
          <TopnavBar />
          <div style={{ display: 'flex', minHeight: 260 }}>
            {/* Left nav */}
            <NavCol />
            {/* Two-col content area */}
            <div style={{ flex: 1, minWidth: 0, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              {/* Left prose column */}
              <div style={{ padding: '16px 20px', borderRight: '1px solid var(--border)', background: 'var(--white)' }}>
                {/* Section header with method + endpoint */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.5625rem', fontWeight: 800, padding: '2px 6px', borderRadius: 4, background: '#dcfce7', color: '#166534', letterSpacing: '0.04em' }}>GET</span>
                  <code style={{ fontSize: '0.625rem', color: 'var(--black)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>/routing/1/calculateRoute</code>
                </div>
                {/* Prose */}
                <p style={{ fontSize: '0.7rem', color: 'var(--mid)', lineHeight: 1.6, margin: '0 0 12px' }}>
                  Calculates a route between two or more locations using real-time traffic.
                </p>
                {/* Param table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.65rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      <th style={{ textAlign: 'left', padding: '4px 6px 4px 0', color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.55rem' }}>Parameter</th>
                      <th style={{ textAlign: 'left', padding: '4px 0', color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.55rem' }}>Required</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'routePlanningLocations', req: true },
                      { name: 'travelMode', req: false },
                      { name: 'traffic', req: false },
                    ].map(p => (
                      <tr key={p.name} style={{ borderBottom: '1px solid var(--bg)' }}>
                        <td style={{ padding: '4px 6px 4px 0' }}><code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--black)' }}>{p.name}</code></td>
                        <td style={{ padding: '4px 0' }}>
                          <span style={{ fontSize: '0.5rem', fontWeight: 700, padding: '1px 5px', borderRadius: 3, background: p.req ? 'var(--danger-bg)' : 'var(--bg)', color: p.req ? 'var(--danger-text)' : 'var(--muted)', border: `1px solid ${p.req ? 'var(--danger-border)' : 'var(--border)'}` }}>
                            {p.req ? 'required' : 'optional'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Right code column */}
              <div style={{ background: '#0d1117', display: 'flex', flexDirection: 'column' }}>
                {/* Code bar */}
                <div style={{ padding: '6px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: '0.55rem', color: '#94a3b8', fontWeight: 600 }}>cURL</span>
                  <div style={{ flex: 1 }} />
                  <button style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '0.6rem', borderRadius: 4, padding: '2px 7px', cursor: 'default' }}>Copy</button>
                </div>
                <pre style={{ margin: 0, padding: '12px 14px', fontSize: '0.6rem', color: '#c9d1d9', lineHeight: 1.65, flex: 1 }}>
{`curl -X GET \\
  "https://api.tomtom.com/
  routing/1/calculateRoute/
  52.37,4.90:48.86,2.35/
  json?key=YOUR_KEY
  &travelMode=car"`}
                </pre>
                {/* Response bar */}
                <div style={{ padding: '5px 12px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.03)' }}>
                  <span style={{ fontSize: '0.55rem', color: '#4ade80', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} /> Response
                  </span>
                  <span style={{ fontSize: '0.55rem', color: '#64748b', marginLeft: 'auto' }}>124ms</span>
                </div>
                <pre style={{ margin: 0, padding: '10px 14px', fontSize: '0.6rem', color: '#c9d1d9', lineHeight: 1.65, background: '#0d1117', borderTop: '1px solid rgba(255,255,255,0.05)', maxHeight: 80, overflow: 'hidden' }}>
{`{
  "routes": [{
    "summary": {
      "travelTimeInSeconds": 3720,
      "lengthInMeters": 499200
    }
  }]
}`}
                </pre>
              </div>
            </div>
            {/* Right TOC */}
            <TocCol />
          </div>
        </div>
      </Row>
    </GallerySection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §42  TOC — TABLE OF CONTENTS (RIGHT SIDEBAR)
// ─────────────────────────────────────────────────────────────────────────────

function TocSection() {
  return (
    <GallerySection title="TOC — Table of Contents" desc=".toc, .toc-heading, .toc-list — right-column sticky nav, all link states">
      <Row label="full toc component">
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start' }}>

          {/* Default specimen */}
          <div>
            <StateLabel>Default (no active)</StateLabel>
            <aside className="toc" style={{ position: 'relative', width: 160, padding: '0 0 0 0' }}>
              <div className="toc-heading">On this page</div>
              <ul className="toc-list" style={{ paddingLeft: 0 }}>
                {['Overview', 'Request format', 'Parameters', 'Response schema', 'Error codes', 'Examples'].map(l => (
                  <li key={l}><a href="#" onClick={e => e.preventDefault()}>{l}</a></li>
                ))}
                <li><a href="#" onClick={e => e.preventDefault()} className="indent">cURL</a></li>
                <li><a href="#" onClick={e => e.preventDefault()} className="indent">Kotlin</a></li>
              </ul>
            </aside>
          </div>

          {/* Active + hover states */}
          <div>
            <StateLabel>With active item + indent links</StateLabel>
            <aside className="toc" style={{ position: 'relative', width: 160 }}>
              <div className="toc-heading">On this page</div>
              <ul className="toc-list" style={{ paddingLeft: 0 }}>
                <li><a href="#" onClick={e => e.preventDefault()}>Overview</a></li>
                <li><a href="#" onClick={e => e.preventDefault()}>Request format</a></li>
                <li><a href="#" onClick={e => e.preventDefault()} className="active">Parameters</a></li>
                <li><a href="#" onClick={e => e.preventDefault()} className="indent active">travelMode</a></li>
                <li><a href="#" onClick={e => e.preventDefault()} className="indent">routeType</a></li>
                <li><a href="#" onClick={e => e.preventDefault()}>Response schema</a></li>
                <li><a href="#" onClick={e => e.preventDefault()}>Examples</a></li>
              </ul>
            </aside>
          </div>

          {/* Hover simulated */}
          <div>
            <StateLabel>Hover state (simulated)</StateLabel>
            <aside className="toc" style={{ position: 'relative', width: 160 }}>
              <div className="toc-heading">On this page</div>
              <ul className="toc-list" style={{ paddingLeft: 0 }}>
                <li><a href="#" onClick={e => e.preventDefault()}>Overview</a></li>
                <li><a href="#" onClick={e => e.preventDefault()} style={{ color: 'var(--red)', borderLeftColor: 'var(--red)' }}>Request format</a></li>
                <li><a href="#" onClick={e => e.preventDefault()}>Parameters</a></li>
                <li><a href="#" onClick={e => e.preventDefault()}>Response schema</a></li>
              </ul>
            </aside>
          </div>

        </div>
      </Row>

      <Row label="token values" noBorder>
        <div style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.8 }}>
          Default link: <code>color: var(--muted)</code> · <code>border-left: 1px solid var(--border)</code><br/>
          Hover / active: <code>color: var(--red)</code> · <code>border-left-color: var(--red)</code><br/>
          Indent: <code>padding-left: 20px</code> · <code>font-size: 0.75rem</code>
        </div>
      </Row>
    </GallerySection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §43  SIDENAV — COLLAPSE, EXPAND & MOBILE DRAWER
// ─────────────────────────────────────────────────────────────────────────────

function SidenavFullSection() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const ChevronIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
  );
  const CollapseIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 19l-7-7 7-7M18 19l-7-7 7-7"/></svg>
  );
  const ExpandIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M13 5l7 7-7 7M6 5l7 7-7 7"/></svg>
  );
  const CloseIcon = () => (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 3l10 10M13 3L3 13"/></svg>
  );

  return (
    <GallerySection title="Sidenav — Collapse, Expand & Mobile Drawer" desc=".sidenav-collapse-btn, .nav-expand-btn, .sidenav-drawer — states missing from §23">

      {/* Desktop collapse / expand */}
      <Row label="desktop collapse bar (.sidenav-collapse-bar + .sidenav-collapse-btn) + nav-expand-btn">
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* Sidenav with collapse bar */}
          <div>
            <StateLabel>Sidenav expanded — collapse bar fixed bottom-left</StateLabel>
            <div style={{ position: 'relative', width: 200, height: 200, border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', background: 'var(--white)' }}>
              <div style={{ padding: '12px 16px' }}>
                <div style={{ fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Routing API</div>
                {['Introduction', 'Calculate Route', 'Matrix Routing'].map((l, i) => (
                  <div key={l} style={{ padding: '5px 8px', fontSize: '0.7rem', color: i === 1 ? 'var(--black)' : 'var(--mid)', fontWeight: i === 1 ? 600 : 400, background: i === 1 ? 'var(--s1)' : 'transparent', borderRadius: 4, marginBottom: 2 }}>{l}</div>
                ))}
              </div>
              {/* Collapse btn — simulated at bottom of container */}
              <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
                <button
                  className="sidenav-collapse-btn"
                  onClick={() => setCollapsed(true)}
                  title="Collapse sidebar"
                  style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid transparent', background: 'transparent', color: 'var(--muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <CollapseIcon />
                </button>
              </div>
            </div>
          </div>

          {/* Collapsed state — nav-expand-btn visible */}
          <div>
            <StateLabel>Nav collapsed — .nav-expand-btn appears</StateLabel>
            <div style={{ position: 'relative', width: 200, height: 200, border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', background: 'var(--bg)' }}>
              <div style={{ padding: '12px 16px', opacity: 0.4, fontSize: '0.7rem', color: 'var(--muted)' }}>← nav is hidden</div>
              {/* Expand btn */}
              <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
                <button
                  className="nav-expand-btn"
                  onClick={() => setCollapsed(false)}
                  title="Expand sidebar"
                  style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--mid)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--e2)' }}
                >
                  <ExpandIcon />
                </button>
              </div>
            </div>
          </div>

          {/* Interactive toggle */}
          <div>
            <StateLabel>Interactive ↔</StateLabel>
            <div style={{ position: 'relative', width: 200, height: 200, border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', background: 'var(--white)' }}>
              <div style={{ padding: '12px 16px', opacity: collapsed ? 0 : 1, transition: 'opacity 0.2s' }}>
                <div style={{ fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Routing API</div>
                {['Introduction', 'Calculate Route'].map((l, i) => (
                  <div key={l} style={{ padding: '5px 8px', fontSize: '0.7rem', color: i === 1 ? 'var(--black)' : 'var(--mid)', background: i === 1 ? 'var(--s1)' : 'transparent', borderRadius: 4, marginBottom: 2 }}>{l}</div>
                ))}
              </div>
              {collapsed && <div style={{ padding: '12px 16px', fontSize: '0.7rem', color: 'var(--muted)', opacity: 0.5 }}>← collapsed</div>}
              <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
                {!collapsed ? (
                  <button className="sidenav-collapse-btn" onClick={() => setCollapsed(true)} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid transparent', background: 'transparent', color: 'var(--muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CollapseIcon />
                  </button>
                ) : (
                  <button className="nav-expand-btn" onClick={() => setCollapsed(false)} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--mid)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--e2)' }}>
                    <ExpandIcon />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Row>

      {/* Mobile drawer */}
      <Row label=".sidenav-drawer (mobile) — open/close with backdrop" noBorder>
        <div>
          <button className="page-action-btn" onClick={() => setDrawerOpen(true)}>☰ Open mobile drawer</button>

          {drawerOpen && (
            <>
              {/* Backdrop */}
              <div
                className="sidenav-drawer-backdrop"
                onClick={() => setDrawerOpen(false)}
                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.32)', zIndex: 590 }}
              />
              {/* Drawer */}
              <div
                className="sidenav-drawer sidenav-drawer--open"
                style={{ position: 'fixed', top: 0, left: 0, width: 260, height: '100dvh', zIndex: 600, background: 'var(--white)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', boxShadow: '4px 0 24px rgba(0,0,0,0.12)' }}
              >
                {/* Header */}
                <div className="sidenav-drawer-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', height: 44, borderBottom: '1px solid var(--border)', flexShrink: 0, background: 'var(--white)' }}>
                  <div className="sidenav-drawer-header-actions" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--red)', fontFamily: 'var(--font-display)' }}>TomTom</div>
                  </div>
                  <button className="sidenav-drawer-close" onClick={() => setDrawerOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', height: 30, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--muted)', borderRadius: 6, fontSize: '0.75rem' }}>
                    <CloseIcon /> Close
                  </button>
                </div>

                {/* Scroll area */}
                <div className="sidenav-drawer-scroll" style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
                  <div className="sidenav-drawer-title" style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--black)', padding: '10px 10px 4px', letterSpacing: '-0.01em' }}>Routing API</div>
                  {/* Nav items */}
                  {['Introduction', 'Calculate Route', 'Batch Route', 'Matrix Routing', 'Waypoints'].map((l, i) => (
                    <div key={l} style={{ padding: '8px 16px', fontSize: '0.875rem', color: i === 1 ? 'var(--black)' : 'var(--mid)', fontWeight: i === 1 ? 600 : 400, background: i === 1 ? 'var(--s1)' : 'transparent', cursor: 'pointer' }}>{l}</div>
                  ))}
                  <div style={{ height: 1, background: 'var(--border)', margin: '8px 10px', opacity: 0.6 }} />
                  {['Long Distance EV Route', 'Traffic API', 'Search API'].map(l => (
                    <div key={l} style={{ padding: '8px 16px', fontSize: '0.875rem', color: 'var(--mid)', cursor: 'pointer' }}>{l}</div>
                  ))}
                </div>

                {/* Footer */}
                <div className="sidenav-drawer-footer" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderTop: '1px solid var(--border)', background: 'var(--white)' }}>
                  <span style={{ fontSize: '0.625rem', fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--muted)' }}>v1.28</span>
                  <span style={{ fontSize: '0.625rem', color: 'var(--muted)' }}>Developer Portal</span>
                </div>
              </div>
            </>
          )}

          <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 8, lineHeight: 1.6 }}>
            <code>.sidenav-drawer</code> — <code>position:fixed</code>, slides in from left with <code>transform:translateX(0)</code><br/>
            <code>.sidenav-drawer-backdrop</code> — full-screen dim layer behind the drawer<br/>
            <code>.sidenav-drawer--open</code> — modifier that removes the <code>translateX(-100%)</code> offscreen state
          </div>
        </div>
      </Row>
    </GallerySection>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// ROOT — PAGE HEADER + ALL SECTIONS
// ─────────────────────────────────────────────────────────────────────────────

export default function UIComponentGallery() {
  return (
    <div style={{ padding: '32px 40px', maxWidth: 900, margin: '0 auto' }}>

      {/* Page header — intentionally minimal; this page lives inside the portal overlay */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--black)',
          margin: '0 0 6px',
        }}>
          UI Component Gallery
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 0, lineHeight: 1.55 }}>
          Every reusable component and inline pattern with all visual states — side by side.
          Use this to spot inconsistencies before shipping design changes.
        </p>
        {/* Quick jump nav */}
        <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {[
            ['#s1', '1 Tokens'],
            ['#s2', '2 Buttons'],
            ['#s3', '3 Badges'],
            ['#s4', '4 Callouts'],
            ['#s5', '5 Code'],
            ['#s6', '6 Params'],
            ['#s7', '7 Patterns'],
            ['#s8', '8 Forms'],
            ['#s9', '9 Steps'],
            ['#s10', '10 Scenarios'],
            ['#s11', '11 Tables'],
            ['#s12', '12 Status'],
            ['#s13', '13 Nav Cards'],
            ['#s14', '14 Domain Cards'],
            ['#s15', '15 ApiLinks'],
            ['#s16', '16 PPB'],
            ['#s17', '17 Benefits'],
            ['#s18', '18 Page Shell'],
            ['#s19', '19 Token Names'],
            ['#s20', '20 Theming'],
            ['#s21', '21 Spec Table'],
            ['#s22', '22 ApiRef Layout'],
            ['#s23', '23 Sidenav'],
            ['#s24', '24 Header/Nav'],
            ['#s25', '25 Tab Bar'],
            ['#s26', '26 Text Card'],
            ['#s27', '27 Anatomy Cards'],
            ['#s28', '28 Modal'],
            ['#s29', '29 AI Panel'],
            ['#s30', '30 Token Display'],
            ['#s31', '31 Typography'],
            ['#s32', '32 Illo Card'],
            ['#s33', '33 Platform'],
            ['#s34', '34 dp2 Cards'],
            ['#s35', '35 ADAS Stack'],
            ['#s36', '36 Sem Cards'],
            ['#s37', '37 Token Flow'],
            ['#s38', '38 TryIt Panel'],
            ['#s39', '39 Page Actions'],
            ['#s40', '40 Layout Utils'],
            ['#s41', '41 Shell Layout'],
            ['#s42', '42 TOC'],
            ['#s43', '43 Sidenav Full'],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              style={{
                fontSize: '0.6875rem', fontWeight: 600,
                padding: '3px 10px', borderRadius: 20,
                border: '1px solid var(--border)', background: 'var(--bg)',
                color: 'var(--mid)', textDecoration: 'none',
                transition: 'background 0.1s, color 0.1s',
              }}
              onMouseEnter={e => { e.target.style.background = 'var(--border)'; e.target.style.color = 'var(--black)'; }}
              onMouseLeave={e => { e.target.style.background = 'var(--bg)'; e.target.style.color = 'var(--mid)'; }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* ── Sections ── */}
      <div id="s1"><DesignTokensSection /></div>
      <div id="s2"><ButtonsSection /></div>
      <div id="s3"><BadgesSection /></div>
      <div id="s4"><CalloutsSection /></div>
      <div id="s5"><CodeBlocksSection /></div>
      <div id="s6"><ParamCardsSection /></div>
      <div id="s7"><InlinePatternsSection /></div>
      <div id="s8"><FormsSection /></div>
      <div id="s9"><StepsSection /></div>
      <div id="s10"><ScenarioCardsSection /></div>
      <div id="s11"><TablesSection /></div>
      <div id="s12"><StatusSection /></div>
      <div id="s13"><NavCardsSection /></div>
      <div id="s14"><DomainCardsSection /></div>
      <div id="s15"><ApiLinksSection /></div>
      <div id="s16"><PrivatePreviewSection /></div>
      <div id="s17"><BenefitCardsSection /></div>
      <div id="s18"><PageAnatomySection /></div>
      <div id="s19"><TokenNamingSection /></div>
      <div id="s20"><ThemingCardSection /></div>
      <div id="s21"><SpecMethodTableSection /></div>
      <div id="s22"><ApiRefLayoutSection /></div>
      <div id="s23"><SidenavSection /></div>
      <div id="s24"><HeaderNavSection /></div>
      <div id="s25"><TabBarSection /></div>
      <div id="s26"><TextCardSection /></div>
      <div id="s27"><AnatomyCardsSection /></div>
      <div id="s28"><ModalSection /></div>
      <div id="s29"><AIPanelSection /></div>
      <div id="s30"><TokenDisplaySection /></div>
      <div id="s31"><TypographyPatternsSection /></div>
      <div id="s32"><IlloCardSection /></div>
      <div id="s33"><PlatformSwitcherSection /></div>
      <div id="s34"><DocsPortal2Section /></div>
      <div id="s35"><AdasSection /></div>
      <div id="s36"><SemanticCardsSection /></div>
      <div id="s37"><TokenFlowSection /></div>
      <div id="s38"><TryItPanelSection /></div>
      <div id="s39"><PageActionsSection /></div>
      <div id="s40"><PageLayoutUtilitiesSection /></div>
      <div id="s41"><ShellLayoutSection /></div>
      <div id="s42"><TocSection /></div>
      <div id="s43"><SidenavFullSection /></div>

      {/* Footer note */}
      <div style={{
        marginTop: 12, paddingTop: 20, borderTop: '1px solid var(--border)',
        fontSize: '0.75rem', color: 'var(--t-dis)', lineHeight: 1.6,
      }}>
        Internal audit page · Plumbing Portal · 43 sections · All components sourced from{' '}
        <code style={{ fontFamily: 'var(--font-mono)' }}>src/components/ui/</code> and{' '}
        <code style={{ fontFamily: 'var(--font-mono)' }}>src/index.css</code>
      </div>
    </div>
  );
}
