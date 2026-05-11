/* ─────────────────────────────────────────────────────────────────────────────
 * DocFeatureTemplate — authoring guide + copy-paste template for Feature pages.
 * Plumbing / internal.
 * ───────────────────────────────────────────────────────────────────────────── */
import { useState } from 'react';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';

/* ─── Local helpers ─────────────────────────────────────────────────────────── */
function AnatomyBlock({ label, tag, desc, required }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)', alignItems: 'flex-start' }}>
      <div style={{ minWidth: 200, flexShrink: 0 }}>
        <code style={{ fontSize: '0.75rem', color: required ? '#e2001a' : 'var(--text)' }}>{tag}</code>
      </div>
      <div>
        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--mid)', lineHeight: 1.55 }}>{desc}</div>
      </div>
      <div style={{ flexShrink: 0, marginLeft: 'auto', fontSize: '0.75rem', color: required ? '#e2001a' : 'var(--muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>
        {required ? 'Required' : 'Optional'}
      </div>
    </div>
  );
}

/* ─── Live micro-demo of the pattern itself ─────────────────────────────────── */
const DEMO_OPTIONS = [
  { id: 'day',     label: 'Day',     color: '#D4E8F8', road: 'rgba(70,110,170,0.85)' },
  { id: 'night',   label: 'Night',   color: '#0d1117', road: 'rgba(255,255,255,0.25)' },
  { id: 'traffic', label: 'Traffic', color: '#D4E8F8', road: 'rgba(70,110,170,0.85)' },
];

function MiniMapDemo() {
  const [active, setActive] = useState('day');
  const opt = DEMO_OPTIONS.find(o => o.id === active);

  return (
    <div style={{
      border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden',
      background: 'var(--surface)',
    }}>
      {/* Controls bar */}
      <div style={{
        padding: '12px 16px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--muted)', marginRight: 4 }}>
          Style
        </span>
        {DEMO_OPTIONS.map(o => (
          <button
            key={o.id}
            onClick={() => setActive(o.id)}
            style={{
              padding: '5px 12px', borderRadius: 20, cursor: 'pointer', fontSize: '0.8125rem',
              fontWeight: active === o.id ? 600 : 400,
              background: active === o.id ? '#fff5f5' : 'var(--bg)',
              border: `1px solid ${active === o.id ? 'var(--red)' : 'var(--border)'}`,
              color: active === o.id ? 'var(--red)' : 'var(--mid)',
              transition: 'background 0.1s, border-color 0.1s, color 0.1s',
            }}
          >
            {o.label}
          </button>
        ))}
      </div>
      {/* Preview */}
      <div style={{ width: '100%', height: 200, position: 'relative' }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          viewBox="0 0 300 180" preserveAspectRatio="xMidYMid slice" fill="none">
          <rect width="300" height="180" fill={opt.color} />
          {[30, 60, 90, 120, 150, 180, 210, 240, 270].map(x => (
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2="180" stroke="rgba(120,155,200,0.3)" strokeWidth="0.7" />
          ))}
          {[40, 80, 120, 160].map(y => (
            <line key={`h${y}`} x1="0" y1={y} x2="300" y2={y} stroke="rgba(120,155,200,0.3)" strokeWidth="0.7" />
          ))}
          <path d="M0 90 Q75 80 150 90 T300 85" stroke={opt.road} strokeWidth="4" strokeLinecap="round" />
          {active === 'traffic' && <>
            <path d="M0 90 Q40 84 70 87" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
            <path d="M70 87 Q100 90 130 89" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
            <path d="M130 89 Q170 88 200 90 T300 85" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
          </>}
          <text x="150" y="74" textAnchor="middle" fill={active === 'night' ? 'rgba(255,255,255,0.4)' : 'rgba(27,61,110,0.9)'} style={{ fontSize: 7 }}>Main St</text>
        </svg>
      </div>
      {/* Footer label */}
      <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--muted)' }}>
        ↑ This is the interactive demo block pattern — a controls bar above a live preview.
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────────── */
export default function DocFeatureTemplate() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Feature / Reference Page Template</h1>
      </div>
      <p className="quick-answer">
        Anatomy, patterns, and a copy-paste starter for pages that document a configurable SDK
        feature — map styles, traffic layers, navigation controls, and similar.
      </p>

      <div className="page-body">

        {/* ── Purpose ── */}
        <h2 className="sh">Purpose</h2>
        <p>
          A Feature page answers: <em>"How do I configure this, and what does each option do?"</em>{' '}
          It is the most content-dense page type. It combines a live interactive demo, full API
          reference, platform code samples, configuration options, and cross-links to related
          features — all on one scrollable page.
        </p>
        <p>
          Each discrete SDK feature gets its own named export in a grouping file (e.g.{' '}
          <code>NavSDKMapPages.jsx</code> exports <code>NavSDKMapStyles</code>,{' '}
          <code>NavSDKMapCamera</code>, <code>NavSDKMapTraffic</code>, etc.). This keeps imports
          manageable while keeping related feature code co-located.
        </p>

        {/* ── Anatomy ── */}
        <h2 className="sh">Anatomy</h2>
        <div style={{ marginTop: 8 }}>
          <AnatomyBlock label="Page header + subtitle" tag=".page-header + .page-subtitle" desc="Feature name as h1 (max 4 words). The .page-subtitle is a one-liner — the first sentence of the 'what is this' answer." required />
          <AnatomyBlock label="Requirements callout" tag="<Callout type='warning'>" desc="If the feature requires a specific SDK version, licence, or prerequisite, lead with a warning Callout. Place it before or immediately after the first zone." />
          <AnatomyBlock label="Interactive demo block" tag=".demo-block or plain border div" desc="The most important section. Always has a controls bar on top and a live preview below. Controls use the RadioGroup or Toggle helpers. Preview fills its container — never fixed pixel width." required />
          <AnatomyBlock label="Controls bar" tag="inline-styled flex row" desc="Radio options, toggles, or dropdowns that drive the demo. Use the RadioGroup helper for single-select, Toggle for binary options. Add a SectionLabel above each group." required />
          <AnatomyBlock label="Code block zone" tag='.zone id="*-code"' desc="The implementation code for the currently selected demo state, shown with platform tabs (Android / iOS) where relevant. Title each CodeBlock with a real filename." required />
          <AnatomyBlock label="Prop / API reference table" tag='.zone id="*-api" .prop-table' desc="Full API surface in a table: property/method name, type, default, description. Only list props that affect behaviour — skip internal implementation details." required />
          <AnatomyBlock label="Configuration zone(s)" tag='.zone id="*-config"' desc="If the feature has significant configuration depth (e.g. refresh intervals, filter categories), give each logical group its own zone with a descriptive heading." />
          <AnatomyBlock label="Custom provider pattern" tag='.zone id="*-custom"' desc="If the feature is extensible (e.g. custom traffic provider, custom style source), show the interface signature and a minimal implementation." />
          <AnatomyBlock label="Related chips" tag=".page-related" desc="3–5 chips. Include the parent intro page, at least one peer feature, and the next logical step in the reader's journey." required />
        </div>

        {/* ── Demo block pattern ── */}
        <h2 className="sh">The interactive demo pattern</h2>
        <p>
          The demo block is the most impactful part of a feature page — it lets the reader see the
          effect of each configuration option instantly. Below is a live example of the pattern,
          followed by the code to reproduce it.
        </p>

        <div style={{ marginTop: 16, marginBottom: 24 }}>
          <MiniMapDemo />
        </div>

        <CodeBlock language="jsx" title="FeatureDemoBlock.jsx">{`/* ─── Demo state data ─────────────────────────────────────────────────────── */
const OPTIONS = [
  { id: 'option-a', label: 'Option A', /* ...extra render data */ },
  { id: 'option-b', label: 'Option B' },
  { id: 'option-c', label: 'Option C' },
];

function MyFeatureDemo() {
  const [active, setActive] = useState(OPTIONS[0].id);
  const current = OPTIONS.find(o => o.id === active) ?? OPTIONS[0];

  return (
    <div style={{
      border: '1px solid var(--border)', borderRadius: 16,
      overflow: 'hidden', background: 'var(--surface)',
    }}>
      {/* Controls bar — always at the top */}
      <div style={{
        padding: '12px 16px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
      }}>
        <SectionLabel>Option</SectionLabel>
        {OPTIONS.map(opt => (
          <button
            key={opt.id}
            onClick={() => setActive(opt.id)}
            style={{
              padding: '5px 12px', borderRadius: 20, cursor: 'pointer',
              fontSize: '0.8125rem',
              fontWeight: active === opt.id ? 600 : 400,
              background: active === opt.id ? '#fff5f5' : 'var(--bg)',
              border: \`1px solid \${active === opt.id ? 'var(--red)' : 'var(--border)'}\`,
              color: active === opt.id ? 'var(--red)' : 'var(--mid)',
              // ✅ Scope transition to non-layout properties only
              transition: 'background 0.1s, border-color 0.1s, color 0.1s',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Preview — fluid width, never fixed px */}
      <div style={{
        width: '100%', height: 260, position: 'relative',
        // ❌ Never: transition: 'all 0.3s' — animates width on resize
      }}>
        <MyPreviewComponent option={current} />
      </div>

      {/* Optional description row */}
      <div style={{
        padding: '10px 16px', borderTop: '1px solid var(--border)',
        fontSize: '0.8125rem', color: 'var(--muted)',
      }}>
        {current.desc}
      </div>
    </div>
  );
}`}</CodeBlock>

        <Callout type="warning">
          Never put <code>{'transition: all'}</code> on the demo preview container — it animates{' '}
          <code>width</code> during viewport resize, causing the map or preview to lag. Scope
          transitions to non-layout CSS properties only.
        </Callout>

        {/* ── Prop table pattern ── */}
        <h2 className="sh">Prop / API reference table</h2>
        <p>
          Every feature page should document the complete configuration surface in a table. Use the
          <code>.prop-table</code> class on the <code>{'<table>'}</code> for consistent styling.
        </p>

        <CodeBlock language="jsx" title="PropTableExample.jsx">{`<table className="prop-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
  <thead>
    <tr style={{ borderBottom: '2px solid var(--border)' }}>
      {['Property', 'Type', 'Default', 'Description'].map(h => (
        <th key={h} style={{
          textAlign: 'left', padding: '8px 12px',
          color: 'var(--muted)', fontWeight: 600,
          fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>{h}</th>
      ))}
    </tr>
  </thead>
  <tbody>
    {PROPS.map(({ name, type, defaultVal, desc }) => (
      <tr key={name} style={{ borderBottom: '1px solid var(--border)' }}>
        <td style={{ padding: '9px 12px', fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text)', fontWeight: 600 }}>{name}</td>
        <td style={{ padding: '9px 12px', fontFamily: 'monospace', fontSize: '0.75rem', color: '#0066cc' }}>{type}</td>
        <td style={{ padding: '9px 12px', fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--muted)' }}>{defaultVal}</td>
        <td style={{ padding: '9px 12px', fontSize: '0.8125rem', color: 'var(--mid)' }}>{desc}</td>
      </tr>
    ))}
  </tbody>
</table>`}</CodeBlock>

        {/* ── Helpers reference ── */}
        <h2 className="sh">Reusable UI helpers</h2>
        <p>
          These small components appear on nearly every feature page. Copy them verbatim at the top
          of your file — they are <strong>not exported</strong> from a shared module so each page
          can evolve them independently.
        </p>

        <CodeBlock language="jsx" title="helpers.jsx — copy into your page file">{`/* ─── Section label ──────────────────────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: '0.6875rem', fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.07em',
      color: 'var(--muted)', marginBottom: 8,
    }}>
      {children}
    </div>
  );
}

/* ─── Toggle switch ──────────────────────────────────────────────────────── */
function Toggle({ value, onChange, label, secondary }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 12px', borderRadius: 7, cursor: 'pointer',
        background: value ? 'var(--surface)' : 'var(--bg)',
        border: '1px solid var(--border)',
        opacity: value ? 1 : 0.55,
        transition: 'all 0.12s',
      }}
    >
      <div style={{
        width: 32, height: 18, borderRadius: 9,
        background: value ? 'var(--red)' : 'var(--border)',
        transition: 'background 0.15s', position: 'relative', flexShrink: 0,
      }}>
        <div style={{
          position: 'absolute', top: 2, left: value ? 14 : 2,
          width: 14, height: 14, borderRadius: '50%',
          background: 'white', transition: 'left 0.15s',
        }} />
      </div>
      <div>
        <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{label}</div>
        {secondary && <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{secondary}</div>}
      </div>
    </div>
  );
}

/* ─── Radio group (pill buttons) ─────────────────────────────────────────── */
function RadioGroup({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {options.map(opt => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          style={{
            padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
            fontSize: '0.8125rem',
            fontWeight: value === opt.id ? 600 : 400,
            background: value === opt.id ? '#fff5f5' : 'var(--bg)',
            border: \`1px solid \${value === opt.id ? 'var(--red)' : 'var(--border)'}\`,
            color: value === opt.id ? 'var(--red)' : 'var(--mid)',
            transition: 'all 0.1s',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}`}</CodeBlock>

        {/* ── Grid patterns ── */}
        <h2 className="sh">Responsive grid patterns</h2>
        <p>
          All option grids (style picker, category selector, etc.) must use{' '}
          <code>repeat(auto-fit, minmax(…, 1fr))</code> — never a hardcoded column count.
          Below are the standard breakpoints used across feature pages.
        </p>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', marginTop: 12 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)' }}>
              {['Use case', 'gridTemplateColumns value', 'Notes'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Style/option picker buttons', "repeat(auto-fit, minmax(110px, 1fr))", 'Collapses to 2 cols at ~320px'],
              ['Feature capability cards', "repeat(auto-fill, minmax(220px, 1fr))", 'Standard card grid'],
              ['Wide reference cards', "repeat(auto-fill, minmax(280px, 1fr))", 'For cards with more prose'],
              ['When-to-use grid', "repeat(auto-fill, minmax(220px, 1fr))", 'Same as capability cards'],
              ['Prop table', 'n/a — always full-width table', 'Never put prop tables in a grid'],
            ].map(([use, col, note]) => (
              <tr key={use} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '9px 12px', fontSize: '0.8125rem', color: 'var(--text)', fontWeight: 600 }}>{use}</td>
                <td style={{ padding: '9px 12px', fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--mid)' }}>{col}</td>
                <td style={{ padding: '9px 12px', fontSize: '0.8125rem', color: 'var(--muted)' }}>{note}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ── Full page starter ── */}
        <h2 className="sh">Minimal page starter</h2>
        <CodeBlock language="jsx" title="MyFeaturePage.jsx">{`import { useState } from 'react';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import PageActions from '../components/ui/PageActions';

/* ─── Helpers (copy-paste, not imported) ─────────────────────────────────── */
function SectionLabel({ children }) { /* see helpers section above */ }
function Toggle({ value, onChange, label, secondary }) { /* ... */ }
function RadioGroup({ options, value, onChange }) { /* ... */ }

/* ─── Demo data ──────────────────────────────────────────────────────────── */
const OPTIONS = [
  { id: 'a', label: 'Option A', desc: 'Description shown below the preview.' },
  { id: 'b', label: 'Option B', desc: '...' },
];

const PROPS = [
  { name: 'optionA', type: 'Boolean', defaultVal: 'false', desc: 'Enables option A behaviour.' },
];

/* ─── Demo component ─────────────────────────────────────────────────────── */
function MyFeatureDemo() {
  const [active, setActive] = useState(OPTIONS[0].id);
  const current = OPTIONS.find(o => o.id === active) ?? OPTIONS[0];
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', background: 'var(--surface)' }}>
      {/* Controls */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <SectionLabel>Style</SectionLabel>
        {OPTIONS.map(o => (
          <button key={o.id} onClick={() => setActive(o.id)} style={{
            padding: '5px 12px', borderRadius: 20, cursor: 'pointer', fontSize: '0.8125rem',
            fontWeight: active === o.id ? 600 : 400,
            background: active === o.id ? '#fff5f5' : 'var(--bg)',
            border: \`1px solid \${active === o.id ? 'var(--red)' : 'var(--border)'}\`,
            color: active === o.id ? 'var(--red)' : 'var(--mid)',
            transition: 'background 0.1s, border-color 0.1s, color 0.1s',
          }}>{o.label}</button>
        ))}
      </div>
      {/* Preview */}
      <div style={{ width: '100%', height: 240, position: 'relative' }}>
        {/* Your preview content here */}
      </div>
      {/* Description */}
      <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', fontSize: '0.8125rem', color: 'var(--muted)' }}>
        {current.desc}
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export function MyFeaturePage({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Feature Name</h1>
        <p className="page-subtitle">One-sentence description.</p>
      </div>

      {/* Interactive demo — first thing visible after the header */}
      <div className="zone" id="mfp-demo">
        <h2 className="sh">Overview</h2>
        <MyFeatureDemo />
      </div>

      {/* Code ─────────────────────────────────────────────────────────── */}
      <div className="zone" id="mfp-code">
        <h2 className="sh">Code</h2>
        <CodeBlock language="kotlin" title="MyFeatureActivity.kt">{\`// Code for currently selected demo state\`}</CodeBlock>
      </div>

      {/* API reference ────────────────────────────────────────────────── */}
      <div className="zone" id="mfp-api">
        <h2 className="sh">API reference</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
          {/* ... prop table rows */}
        </table>
      </div>

      {/* Callout for version requirements */}
      <Callout type="info">
        Add version requirements, licence notes, or behavioural caveats here.
      </Callout>

      {/* Related ─────────────────────────────────────────────────────── */}
      <div className="page-related">
        <button className="page-related-chip" onClick={() => onNavigate?.('related-page-id')}>
          Related Page
        </button>
      </div>
    </div>
  );
}`}</CodeBlock>

        {/* ── Related ── */}
        <h2 className="sh">Related</h2>
        <div className="page-related">
          <button className="page-related-chip">Page Guidelines</button>
          <button className="page-related-chip">Intro Page Template</button>
          <button className="page-related-chip">Use Case Template</button>
          <button className="page-related-chip">Dos &amp; Don'ts</button>
          <button className="page-related-chip">Content Spacing</button>
        </div>

      </div>
    </div>
  );
}
