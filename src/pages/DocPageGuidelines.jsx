/* ─────────────────────────────────────────────────────────────────────────────
 * DocPageGuidelines — overview of the four page types and authoring principles.
 * Plumbing / internal.
 * ───────────────────────────────────────────────────────────────────────────── */
import Callout from '../components/ui/Callout';

/* ─── Local helpers ─────────────────────────────────────────────────────────── */
function PageTypeCard({ emoji, type, tagline, when, examples }) {
  return (
    <div style={{
      border: '1px solid var(--border)', borderRadius: 16, padding: '18px 20px',
      background: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{emoji}</span>
        <div>
          <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text)' }}>{type}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{tagline}</div>
        </div>
      </div>
      <div style={{ fontSize: '0.8125rem', color: 'var(--mid)', lineHeight: 1.6 }}>
        <strong style={{ color: 'var(--text)' }}>Use when: </strong>{when}
      </div>
      <div style={{
        background: 'var(--bg)', borderRadius: 8, padding: '8px 12px',
        fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.7,
      }}>
        <strong style={{ textTransform: 'uppercase', fontSize: '0.625rem', letterSpacing: '0.07em' }}>Examples — </strong>
        {examples}
      </div>
    </div>
  );
}

function PrincipleRow({ number, title, children }) {
  return (
    <div style={{ display: 'flex', gap: 16, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
        background: 'rgba(226,0,26,0.08)', border: '1.5px solid rgba(226,0,26,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.8125rem', fontWeight: 700, color: '#e2001a',
      }}>
        {number}
      </div>
      <div>
        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--mid)', lineHeight: 1.65 }}>{children}</div>
      </div>
    </div>
  );
}

function AnatomyRow({ zone, purpose, required }) {
  return (
    <tr style={{ borderBottom: '1px solid var(--border)' }}>
      <td style={{ padding: '9px 12px', fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text)' }}>{zone}</td>
      <td style={{ padding: '9px 12px', fontSize: '0.8125rem', color: 'var(--mid)' }}>{purpose}</td>
      <td style={{ padding: '9px 12px', textAlign: 'center', fontSize: '0.875rem' }}>
        {required ? '✅' : '—'}
      </td>
    </tr>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────────── */
export default function DocPageGuidelines() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Documentation Page Guidelines</h1>
      </div>
      <p className="quick-answer">
        The four page types used across this documentation system, when to use each, and
        the shared authoring principles that keep pages consistent.
      </p>

      <div className="page-body">

        {/* ── The four page types ── */}
        <h2 className="sh">The four page types</h2>
        <p>
          Every page in this documentation system belongs to one of four types. Choosing the right
          type before writing determines the structure, tone, and components you reach for.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14, marginTop: 20 }}>
          <PageTypeCard
            emoji="🗺️"
            type="Intro / Overview"
            tagline="Orient, don't instruct"
            when="The reader is approaching a product or subsystem for the first time and needs to understand scope, architecture, and where to go next."
            examples="NavSDK Intro, Vehicle Integration Basics, UX Library Overview"
          />
          <PageTypeCard
            emoji="✅"
            type="Use Case"
            tagline="Goal first, steps second"
            when="The reader has a specific job to do — 'enable offline maps', 'add voice instructions' — and needs a direct path to accomplishing it."
            examples="Getting Started, First Map, Enable Offline"
          />
          <PageTypeCard
            emoji="⚙️"
            type="Feature / Reference"
            tagline="Complete, interactive, scannable"
            when="The reader is integrating or configuring a specific SDK feature and needs the full API surface, live examples, and all configuration options."
            examples="Map Styles, Traffic, HUD, Truck Support, ADAS Integration"
          />
          <PageTypeCard
            emoji="🎨"
            type="Design / Pattern"
            tagline="Spec, not code"
            when="The reader is a designer or front-end developer who needs the visual behaviour, states, spacing, and component anatomy — not SDK plumbing."
            examples="Navigation Controls, Route Bar, Instruction Panel, ETA Panel"
          />
        </div>

        <Callout type="info" style={{ marginTop: 20 }}>
          When in doubt about page type, ask: "Is the reader trying to understand, accomplish,
          configure, or design?" Each verb maps to one of the four types above.
        </Callout>

        {/* ── Shared anatomy ── */}
        <h2 className="sh">Shared page anatomy</h2>
        <p>
          All four types share the same outer shell. Required zones appear on every page;
          optional zones are added only when the content warrants them.
        </p>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', marginTop: 16 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)' }}>
              {['Zone / class', 'Purpose', 'Required'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnatomyRow zone=".page" purpose="Outermost scroll container. All pages live here." required />
            <AnatomyRow zone=".page-header" purpose="h1 title + optional .page-subtitle paragraph. Never include body copy here." required />
            <AnatomyRow zone=".quick-answer" purpose="One or two sentences immediately below the header that answer the most likely first question." required />
            <AnatomyRow zone=".zone" purpose="Each major content section gets its own .zone wrapper. Provides consistent top padding (24 px) and id anchor." required />
            <AnatomyRow zone="h2.sh" purpose="Section heading inside every .zone. Never use plain h2 — always add className='sh'." required />
            <AnatomyRow zone=".demo-block" purpose="Interactive preview sandbox inside feature pages. Optional; only for pages with configurable demos." />
            <AnatomyRow zone=".prop-table" purpose="API reference table: prop name, type, default, description." />
            <AnatomyRow zone=".page-related" purpose="Chip row at the bottom that links to related pages. Must use .page-related-chip buttons." required />
          </tbody>
        </table>

        {/* ── Authoring principles ── */}
        <h2 className="sh">Authoring principles</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <PrincipleRow number="1" title="Quick answer first">
            The first paragraph after the header always answers the question the reader came with.
            If you don't know what that question is, you don't know your page type yet. Keep it to
            two sentences max — technical detail belongs in the zone sections below.
          </PrincipleRow>
          <PrincipleRow number="2" title="One concept per zone">
            Each <code>.zone</code> section should cover exactly one idea. If you find yourself
            using "and" in a section heading — "Configuration and Options" — split it into two
            zones. Readers scan headings to find what they need; compound headings make that harder.
          </PrincipleRow>
          <PrincipleRow number="3" title="Show before you tell">
            Place code examples and interactive demos before or alongside the prose explanation,
            never below it. A developer reading a feature page will read the first code block and
            skip the paragraph if the code answers their question. Don't make them scroll.
          </PrincipleRow>
          <PrincipleRow number="4" title="Title CodeBlocks with real filenames">
            Every <code>{`<CodeBlock>`}</code> that is longer than 3 lines should carry a{' '}
            <code>title</code> prop set to a realistic filename
            (<code>MapActivity.kt</code>, <code>styles.xml</code>). This anchors the snippet in
            context and makes copy-paste intent unambiguous.
          </PrincipleRow>
          <PrincipleRow number="5" title="Callouts are warnings, not decorations">
            Use <code>{`<Callout type="warning">`}</code> only when skipping the information can
            break the reader's integration. Use <code>type="info"</code> for pre-requisites,
            version constraints, and non-obvious behavioural notes. Avoid using callouts for
            content that belongs in running prose — every callout should interrupt the reader for
            a reason.
          </PrincipleRow>
          <PrincipleRow number="6" title="Related chips are mandatory navigation">
            Every page ends with a <code>.page-related</code> chip row. The chips link to pages the
            reader will need next, not just thematically adjacent ones. Think about the reader's
            journey: where were they before this page? Where do they go after?
          </PrincipleRow>
          <PrincipleRow number="7" title="IDs on every zone for deep links">
            Every <code>.zone</code> container needs a unique <code>id</code> attribute so the
            right-rail TOC can link to it and external links can anchor to specific sections.
            Use kebab-case prefixed by a page abbreviation: <code>ms-styles</code>,{' '}
            <code>ms-traffic</code>, <code>ms-custom</code>.
          </PrincipleRow>
          <div style={{ paddingBottom: 20 }}>
            <PrincipleRow number="8" title="Avoid layout transitions on fluid containers">
              Never apply <code>{'transition: all'}</code> to elements that contain maps, images, or
              grids — it animates <code>width</code> on resize and causes visual lag. Scope
              transitions to specific non-layout properties:
              {' '}<code>{'transition: background 0.1s, border-color 0.1s, color 0.1s'}</code>.
            </PrincipleRow>
          </div>
        </div>

        {/* ── Naming conventions ── */}
        <h2 className="sh">Naming conventions</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', marginTop: 8 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)' }}>
              {['Thing', 'Convention', 'Example'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['JSX file', 'PascalCase, feature-first', 'NavSDKMapPages.jsx'],
              ['Named export', 'ProductFeatureName', 'NavSDKMapStyles, NavSDKMapTraffic'],
              ['Route ID', 'kebab-case, product-prefixed', 'navsdk-map-styles, ux-map-traffic'],
              ['Zone ID', 'page-abbr + section', 'ms-styles, ms-traffic, ms-custom'],
              ['Constant arrays', 'ALL_CAPS_SNAKE with MAP prefix', 'MAP_STYLES, INCIDENT_CATEGORIES'],
              ['Local helpers', 'PascalCase, no export', 'SectionLabel, Toggle, RadioGroup'],
            ].map(([thing, convention, example]) => (
              <tr key={thing} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '9px 12px', fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text)' }}>{thing}</td>
                <td style={{ padding: '9px 12px', fontSize: '0.8125rem', color: 'var(--mid)' }}>{convention}</td>
                <td style={{ padding: '9px 12px', fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text)' }}>{example}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ── Related ── */}
        <h2 className="sh">Related</h2>
        <div className="page-related">
          <button className="page-related-chip">Intro Page Template</button>
          <button className="page-related-chip">Feature Page Template</button>
          <button className="page-related-chip">Use Case Template</button>
          <button className="page-related-chip">Dos &amp; Don'ts</button>
          <button className="page-related-chip">Content Spacing</button>
        </div>

      </div>
    </div>
  );
}
