/* ─────────────────────────────────────────────────────────────────────────────
 * DocDosDonts — practical do/don't reference from real decisions made
 * while building the UX Library docs.
 * Plumbing / internal.
 * ───────────────────────────────────────────────────────────────────────────── */

/* ─── Local helpers ─────────────────────────────────────────────────────────── */
function DoDontCard({ type, children }) {
  const good = type === 'do';
  return (
    <div style={{
      border: `1px solid ${good ? 'rgba(34,197,94,0.35)' : 'rgba(239,68,68,0.35)'}`,
      borderRadius: 12, padding: '14px 16px',
      background: good ? 'rgba(34,197,94,0.04)' : 'rgba(239,68,68,0.04)',
      flex: 1, minWidth: 0,
    }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center' }}>
        <span style={{ fontSize: '1rem' }}>{good ? '✅' : '❌'}</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: good ? '#16a34a' : '#dc2626' }}>
          {good ? 'Do' : "Don't"}
        </span>
      </div>
      <div style={{ fontSize: '0.8125rem', color: 'var(--mid)', lineHeight: 1.65 }}>
        {children}
      </div>
    </div>
  );
}

function DoDontPair({ category, rule, do: doText, dont: dontText, note }) {
  return (
    <div style={{ paddingBottom: 28, borderBottom: '1px solid var(--border)' }}>
      <div style={{ marginBottom: 4 }}>
        <span style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--muted)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 7px' }}>
          {category}
        </span>
      </div>
      <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>{rule}</div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <DoDontCard type="do">{doText}</DoDontCard>
        <DoDontCard type="dont">{dontText}</DoDontCard>
      </div>
      {note && (
        <div style={{ marginTop: 10, fontSize: '0.8125rem', color: 'var(--muted)', borderLeft: '2px solid var(--border)', paddingLeft: 10 }}>
          {note}
        </div>
      )}
    </div>
  );
}

function CategoryDivider({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '32px 0 20px' }}>
      <div style={{ height: 1, flex: 1, background: 'var(--border)' }} />
      <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{label}</span>
      <div style={{ height: 1, flex: 1, background: 'var(--border)' }} />
    </div>
  );
}

function CodeCompare({ doCode, dontCode, language = 'jsx' }) {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
      {[{ label: 'Do', code: doCode, good: true }, { label: "Don't", code: dontCode, good: false }].map(({ label, code, good }) => (
        <div key={label} style={{ flex: 1, minWidth: 260 }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4, color: good ? '#16a34a' : '#dc2626' }}>
            {good ? '✅' : '❌'} {label}
          </div>
          <pre style={{
            margin: 0, padding: '12px 14px', borderRadius: 8,
            background: 'var(--surface)', border: `1px solid ${good ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
            fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text)',
            overflowX: 'auto', lineHeight: 1.6,
          }}>
            <code>{code}</code>
          </pre>
        </div>
      ))}
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────────── */
export default function DocDosDonts() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Dos &amp; Don'ts</h1>
      </div>
      <p className="quick-answer">
        Practical rules derived from real decisions and mistakes made while building the UX Library
        documentation. Organised by category.
      </p>

      <div className="page-body">

        {/* ── Intro ── */}
        <p>
          These rules are not theoretical preferences — each one came from a real problem that was
          encountered, debugged, and fixed during this project. Where possible the "Don't" example
          shows the actual incorrect pattern and the "Do" shows the fix applied.
        </p>

        {/* ═══ CSS & LAYOUT ═══════════════════════════════════════════════════ */}
        <CategoryDivider label="CSS & Layout" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          <DoDontPair
            category="CSS"
            rule="Scope transitions to non-layout properties on fluid containers"
            do={<>Use <code>transition: 'background 0.1s, border-color 0.1s, color 0.1s'</code> — only the visual properties that should animate.</>}
            dont={<>Use <code>transition: 'all 0.3s'</code> on a container with a fluid width. This animates the <code>width</code> property, causing the map or preview to lag noticeably when the viewport is resized.</>}
            note="Real bug: the map style preview container in NavSDKMapPages had transition: all — the map would visually jump/lag on every viewport resize. Fixed by removing the transition from the container entirely."
          />

          <DoDontPair
            category="CSS Grid"
            rule="Use auto-fit/auto-fill for option grids, not a hardcoded column count"
            do={<><code>{'gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))"'}</code> — collapses naturally to 2 columns at narrow viewports without a media query.</>}
            dont={<><code>{'gridTemplateColumns: "repeat(3, 1fr)"'}</code> — always renders 3 columns regardless of viewport width. At 320 px the buttons are clipped or overflow.</>}
            note="Real bug: the style picker in NavSDKMapPages was hardcoded to 3 columns. Switching to auto-fit fixed the responsiveness without adding any media queries."
          />

          <DoDontPair
            category="CSS"
            rule="Use container queries for layout shifts, not viewport media queries"
            do="Use .content-area's container-type: inline-size and @container queries when the layout change is relative to the content pane width, not the full viewport."
            dont="Use @media (max-width: 768px) for layout inside the doc content pane — the sidebar can be open or closed, so the content pane width does not map 1:1 to the viewport width."
          />

          <DoDontPair
            category="Preview"
            rule="Always use explicit pixel values when sizing the preview iframe"
            do={<>Pass explicit <code>{'width: 1280, height: 900'}</code> to preview_resize. The browser will use these exact values.</>}
            dont={<>Use <code>{'preset: "desktop"'}</code> in preview_resize. This resets to "native" viewport which can set the content width to 1 px, effectively making the preview invisible.</>}
            note="Real incident: using preset: 'desktop' collapsed the preview to 1 px width, requiring a full server restart to recover."
          />

        </div>

        {/* ═══ INTERACTIVE DEMOS ══════════════════════════════════════════════ */}
        <CategoryDivider label="Interactive Demos" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          <DoDontPair
            category="State"
            rule="Guard array.find() with a ?? fallback to survive HMR id changes"
            do={<><code>{'OPTIONS.find(o => o.id === active) ?? OPTIONS[0]'}</code> — if HMR changes the constant IDs, the component degrades gracefully to the first item instead of crashing.</>}
            dont={<><code>{'OPTIONS.find(o => o.id === active)'}</code> alone — during HMR hot reload, the saved <code>active</code> state may reference an id that no longer exists, causing the component to render <code>undefined</code>.</>}
          />

          <DoDontPair
            category="Demo"
            rule="Controls bar goes above the preview, never below or in a sidebar"
            do="Place the controls (RadioGroup, Toggles) in a flex row at the top of the demo block, separated from the preview by a bottom border."
            dont="Place controls below the preview or in a column beside it. Below means the user doesn't know controls exist until they scroll. A sidebar column causes awkward reflow at narrow widths."
          />

          <DoDontPair
            category="Demo"
            rule="Preview fills its container width — never use a fixed pixel width"
            do={<>Use <code>{'width: "100%"'}</code> on the preview container. The outer card is already constrained by the page layout.</>}
            dont={<>Use <code>{'width: 480'}</code> or any fixed pixel width. At 320 px viewport the preview overflows and causes horizontal scroll on the entire page.</>}
          />

        </div>

        {/* ═══ CODE BLOCKS ════════════════════════════════════════════════════ */}
        <CategoryDivider label="Code Blocks" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          <DoDontPair
            category="CodeBlock"
            rule="Always title CodeBlocks with real filenames"
            do={<>Set <code>{'title="MapActivity.kt"'}</code>, <code>{'title="build.gradle.kts"'}</code> — names a real developer would recognise and search for in their IDE.</>}
            dont={<>Leave the title empty or set it to <code>{'title="Kotlin"'}</code> or <code>{'title="Code"'}</code> — these tell the reader nothing about where this code belongs in their project.</>}
          />

          <DoDontPair
            category="CodeBlock"
            rule="Wrap JSX template literal variables with {'${VAR}'}"
            do={<>Inside JSX: <code>{'<CodeBlock>{`...${"${MY_VAR}"}...`}</CodeBlock>'}</code> — use the JS expression form so JSX doesn't parse the dollar sign as a literal.</>}
            dont={<>Write <code>{'`...${MY_VAR}...`'}</code> directly in JSX text — the parser treats it as a JSX expression and throws a compile error or renders incorrectly.</>}
            note="Real bug: template literal variables in CodeBlock content need to be wrapped as JS string expressions in JSX: {'${VAR}'}"
          />

          <DoDontPair
            category="CodeBlock"
            rule="Use backtick template literals consistently inside CodeBlock content"
            do={<>Pass content as a backtick template string:<br /><code>{'{`class Foo { ... }`}'}</code></>}
            dont={<>Use double-quoted strings for multi-line code:<br /><code>{"\"class Foo {\\n  ...\\n}\""}</code> — escape sequences make the code hard to read and maintain.</>}
          />

        </div>

        {/* ═══ PAGE STRUCTURE ═════════════════════════════════════════════════ */}
        <CategoryDivider label="Page Structure" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          <DoDontPair
            category="Heading"
            rule="Always use className='sh' on section headings, never bare h2"
            do={<><code>{'<h2 className="sh">Section title</h2>'}</code> — the <code>sh</code> class applies consistent font size, weight, spacing, and colour from the design system.</>}
            dont={<><code>{'<h2>Section title</h2>'}</code> without the class. The bare h2 inherits browser defaults that break visual consistency with the rest of the doc pages.</>}
          />

          <DoDontPair
            category="Navigation"
            rule="Every page ends with a .page-related chip row"
            do={<>Close every page with: <code>{'<div className="page-related"><button className="page-related-chip" onClick={...}>Link</button></div>'}</code></>}
            dont="End a page at the last zone without related chips. Readers at the bottom of the page have no navigation path to the next logical page without scrolling back to the sidebar."
          />

          <DoDontPair
            category="IDs"
            rule="Give every .zone a unique, page-prefixed id attribute"
            do={<><code>{'<div className="zone" id="ms-styles">'}</code> — the prefix <code>ms</code> (map styles) + descriptor ensures ids are unique across all pages.</>}
            dont={<><code>{'<div className="zone">'}</code> without an id, or non-unique ids like <code>id="overview"</code>. Missing ids break the right-rail TOC links and make external deep-links impossible.</>}
          />

          <DoDontPair
            category="Callout"
            rule="Use Callouts for interruptions, not for running content"
            do={<>Use <code>{'<Callout type="warning">'}</code> for things that can break the reader's integration if skipped. Use <code>type="info"</code> for version constraints and non-obvious caveats.</>}
            dont="Use a Callout for content that belongs in a normal paragraph. Every Callout competes for attention — overuse means none of them get read. Maximum 2 callouts per page."
          />

        </div>

        {/* ═══ WRITING ════════════════════════════════════════════════════════ */}
        <CategoryDivider label="Writing" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          <DoDontPair
            category="Intro pages"
            rule="Include at least one honest ⚠️ trade-off on every Intro page"
            do={<>Add a <code>WhenCard icon="⚠️"</code> that describes a real trade-off: "You build the UI" or "Longer time to market than the UX Library".</>}
            dont="Fill the When-to-use grid exclusively with ✅ cards. A page with no caveats reads as marketing material and signals that the author hasn't thought critically about the product's limits."
          />

          <DoDontPair
            category="Use case pages"
            rule="Title use-case pages with action phrases, not nouns"
            do={<>"Enable Offline Maps", "Add Voice Instructions", "Simulate a Navigation Session" — verbs that match what the reader types into a search box.</>}
            dont={<>"Offline Maps", "Voice", "Simulation" — noun titles match reference docs, not task guides. Readers scanning the sidebar can't tell if the page will help them accomplish the task.</>}
          />

          <DoDontPair
            category="All pages"
            rule="Write .quick-answer for someone scanning, not reading"
            do="Two sentences max. Sentence 1 answers 'what is this'. Sentence 2 adds the single most important qualifier (prerequisite, trade-off, or differentiator)."
            dont="Use the .quick-answer paragraph as an introduction. Long paragraphs in this slot push the first interactive content below the fold and lose readers who are scanning."
          />

          <DoDontPair
            category="All pages"
            rule="Avoid time-sensitive language on evergreen doc pages"
            do={<>"NavSDK 2.1 or later is required." — a factual statement that remains accurate.</>}
            dont={<>"We recently added offline support" or "Coming soon: …" — these become stale and confuse readers who encounter them months later.</>}
          />

        </div>

        {/* ═══ CODE SAMPLES ═══════════════════════════════════════════════════ */}
        <CategoryDivider label="Code Samples (Android / iOS)" />

        <p style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.65, marginBottom: 16 }}>
          Quick reference for the code patterns and idioms used consistently across all
          NavSDK and iOS pages. Follow these to keep samples cohesive.
        </p>

        <CodeCompare
          doCode={`// ✅ Use .find() with a fallback
const current = OPTIONS.find(o => o.id === activeId) ?? OPTIONS[0];`}
          dontCode={`// ❌ .find() can return undefined during HMR
const current = OPTIONS.find(o => o.id === activeId);
// current.desc → TypeError if not found`}
        />

        <CodeCompare
          doCode={`// ✅ Scoped transition — no layout properties
style={{ transition: 'background 0.1s, border-color 0.1s, color 0.1s' }}`}
          dontCode={`// ❌ transition: all animates width on resize
style={{ transition: 'all 0.3s' }}`}
        />

        <CodeCompare
          doCode={`// ✅ Responsive grid
gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))'`}
          dontCode={`// ❌ Fixed 3-col grid — overflows at narrow widths
gridTemplateColumns: 'repeat(3, 1fr)'`}
        />

        {/* ── Related ── */}
        <h2 className="sh">Related</h2>
        <div className="page-related">
          <button className="page-related-chip">Page Guidelines</button>
          <button className="page-related-chip">Intro Page Template</button>
          <button className="page-related-chip">Feature Page Template</button>
          <button className="page-related-chip">Use Case Template</button>
        </div>

      </div>
    </div>
  );
}
