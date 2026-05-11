/* ─────────────────────────────────────────────────────────────────────────────
 * DocUseCaseTemplate — authoring guide + copy-paste starter for Use Case pages.
 * Plumbing / internal.
 * ───────────────────────────────────────────────────────────────────────────── */
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';

/* ─── Local helpers ─────────────────────────────────────────────────────────── */
function AnatomyBlock({ label, tag, desc, required }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)', alignItems: 'flex-start' }}>
      <div style={{ minWidth: 190, flexShrink: 0 }}>
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

function StepRow({ n, title, what, how }) {
  return (
    <div style={{ display: 'flex', gap: 16, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%', flexShrink: 0, marginTop: 2,
        background: 'rgba(226,0,26,0.08)', border: '1.5px solid rgba(226,0,26,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.75rem', fontWeight: 700, color: '#e2001a',
      }}>
        {n}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>{title}</div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--mid)', lineHeight: 1.55, marginBottom: 6 }}>{what}</div>
        {how && (
          <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', background: 'var(--surface)', borderRadius: 6, padding: '6px 10px', border: '1px solid var(--border)' }}>
            <strong style={{ color: 'var(--text)' }}>Pattern: </strong>{how}
          </div>
        )}
      </div>
    </div>
  );
}

function CompareCard({ label, good, description }) {
  return (
    <div style={{
      border: `1px solid ${good ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
      borderRadius: 12, padding: '14px 16px',
      background: good ? 'rgba(34,197,94,0.04)' : 'rgba(239,68,68,0.04)',
    }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
        <span>{good ? '✅' : '❌'}</span>
        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text)' }}>{label}</span>
      </div>
      <div style={{ fontSize: '0.8125rem', color: 'var(--mid)', lineHeight: 1.55 }}>{description}</div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────────── */
export default function DocUseCaseTemplate() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Use Case / Task Page Template</h1>
      </div>
      <p className="quick-answer">
        Anatomy, patterns, and a copy-paste starter for goal-oriented pages that walk a reader
        through accomplishing a specific task with the SDK.
      </p>

      <div className="page-body">

        {/* ── Purpose ── */}
        <h2 className="sh">Purpose</h2>
        <p>
          A Use Case page answers: <em>"How do I accomplish X?"</em> The reader arrives with a
          specific job — enable offline maps, add voice instructions, simulate a route — and the
          page should get them to working code as fast as possible.
        </p>
        <p>
          Unlike a Feature page, a Use Case page does not try to cover the entire API surface. It
          covers the <strong>minimum viable path</strong> to the stated goal, with clear pointers
          to the Feature reference for deeper configuration.
        </p>

        {/* ── Anatomy ── */}
        <h2 className="sh">Anatomy</h2>
        <div style={{ marginTop: 8 }}>
          <AnatomyBlock label="Page header" tag=".page-header + h1" desc="The h1 is always an action phrase: 'Enable Offline Maps', 'Add Voice Instructions', 'Simulate Navigation'. Never a noun: 'Offline Maps', 'Voice'." required />
          <AnatomyBlock label="Quick answer" tag=".quick-answer" desc="Two sentences max. Sentence 1: what the reader will end up with. Sentence 2: what they need before starting (prerequisite)." required />
          <AnatomyBlock label="Prerequisites" tag='.zone id="*-prereqs" or Callout' desc="If there is more than one prerequisite (SDK version, API key, licence), list them in a Callout warning block or a short bulleted zone. Keep it skimmable." />
          <AnatomyBlock label="Step zones" tag='.zone id="*-step-N"' desc="Each meaningful step in the task gets its own .zone. Steps are numbered and lead with a verb: 'Add the dependency', 'Initialise the SDK', 'Start the download'. Use real code on every step." required />
          <AnatomyBlock label="Code blocks on every step" tag="<CodeBlock title='filename'>" desc="Every step has at least one CodeBlock. Title it with a real filename. Show only the code relevant to that step — not a full project file." required />
          <AnatomyBlock label="End-to-end sample" tag='.zone id="*-full"' desc="After the step-by-step, provide a single CodeBlock with the complete, runnable implementation. This is the section developers bookmark." required />
          <AnatomyBlock label="What's next" tag='.zone id="*-next"' desc="2–4 related chips or a short paragraph linking to deeper feature pages. The reader has just achieved their goal — show them where to go to customise it." required />
        </div>

        {/* ── Step-writing guide ── */}
        <h2 className="sh">Writing effective steps</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 8 }}>
          <StepRow
            n="1"
            title="Verb-first headings"
            what="Every step heading starts with an imperative verb. It describes what the reader does, not what the SDK does."
            how="'Add the dependency' not 'SDK dependency'. 'Initialise the map view' not 'Initialisation'."
          />
          <StepRow
            n="2"
            title="Code before explanation"
            what="The code sample comes first in the zone, prose explanation below. Developers scan code first — don't make them wade through paragraphs to find the snippet."
            how="CodeBlock → 1–2 sentences of explanation → optional Callout for caveats."
          />
          <StepRow
            n="3"
            title="Real filenames on CodeBlocks"
            what="Every step CodeBlock has a title prop set to a real filename that matches where this code would live in a real project."
            how="title='build.gradle.kts' not title='Gradle setup'. title='MapFragment.kt' not title='Kotlin'."
          />
          <StepRow
            n="4"
            title="Highlight only the relevant lines"
            what="Show only the code changed or added in this step, not the full file. Use comments to indicate where this snippet fits in the broader file."
            how="// Add inside onCreate() or // In your Application subclass as context comments."
          />
          <StepRow
            n="5"
            title="End with the full example"
            what="After all steps, provide a single self-contained code block that contains the complete working implementation. This is the most-copied section of the page."
            how="Put it in a zone titled 'Complete example' or 'Full implementation'. Never split it across files without a clear framing comment."
          />
        </div>

        {/* ── Naming comparison ── */}
        <h2 className="sh">Page title: action phrase vs noun</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12, marginTop: 12 }}>
          <CompareCard good label="Enable Offline Maps" description="Immediately tells the reader what they'll accomplish. The verb makes the goal concrete." />
          <CompareCard label="Offline Maps" description="Ambiguous — is this a reference page? A conceptual explanation? An overview? The reader doesn't know before clicking." />
          <CompareCard good label="Add Voice Instructions" description="Clear verb-noun. The reader knows this page gets them to a working TTS integration." />
          <CompareCard label="Voice Integration" description="Sounds like a broad reference or architecture doc, not a how-to guide." />
          <CompareCard good label="Simulate a Navigation Session" description="Article + verb phrase signals a tutorial. The reader can decide if this is what they need." />
          <CompareCard label="Navigation Simulation" description="Noun phrase reads as a conceptual reference topic, not a task to complete." />
        </div>

        {/* ── Full template ── */}
        <h2 className="sh">Starter template</h2>

        <CodeBlock language="jsx" title="EnableMyFeature.jsx">{`import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';

export default function EnableMyFeature({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        {/* h1 = action phrase: verb + noun */}
        <h1>Enable My Feature</h1>
      </div>

      {/* Quick answer — what they get + what they need */}
      <p className="quick-answer">
        Set up [feature] so that [outcome]. Requires NavSDK 2.x or later and a valid API key.
      </p>

      {/* Prerequisites (only if non-trivial) ─────────────────────────────── */}
      <Callout type="warning">
        <strong>Before you start:</strong> list any SDK version, licence requirement,
        or project-level setup the reader needs before step 1.
      </Callout>

      {/* Step 1 ──────────────────────────────────────────────────────────── */}
      <div className="zone" id="mf-step-1">
        <h2 className="sh">1. Add the dependency</h2>
        {/* Code first */}
        <CodeBlock language="kotlin" title="build.gradle.kts">{\`
dependencies {
    implementation("com.tomtom.sdk:feature-module:2.x.y")
}
        \`}</CodeBlock>
        {/* Explanation after */}
        <p>
          Brief sentence explaining what this dependency brings in, if non-obvious.
        </p>
      </div>

      {/* Step 2 ──────────────────────────────────────────────────────────── */}
      <div className="zone" id="mf-step-2">
        <h2 className="sh">2. Initialise the feature</h2>
        <CodeBlock language="kotlin" title="MyApplication.kt">{\`
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        // Code for this step only
    }
}
        \`}</CodeBlock>
        <p>Explanation of why/what this initialises.</p>
      </div>

      {/* Step 3 ──────────────────────────────────────────────────────────── */}
      <div className="zone" id="mf-step-3">
        <h2 className="sh">3. Use the feature</h2>
        <CodeBlock language="kotlin" title="MyActivity.kt">{\`
// The code that triggers or uses the feature
        \`}</CodeBlock>
      </div>

      {/* Complete example ────────────────────────────────────────────────── */}
      <div className="zone" id="mf-full">
        <h2 className="sh">Complete example</h2>
        <p>
          The full implementation combining all steps above.
        </p>
        <CodeBlock language="kotlin" title="CompleteExample.kt">{\`
// Full self-contained runnable code here
        \`}</CodeBlock>
      </div>

      {/* What's next ─────────────────────────────────────────────────────── */}
      <div className="zone" id="mf-next">
        <h2 className="sh">What's next</h2>
        <p>
          You've enabled [feature]. From here you can customise its behaviour or connect it
          to other parts of the navigation stack.
        </p>
      </div>

      <div className="page-related">
        <button className="page-related-chip" onClick={() => onNavigate?.('feature-reference')}>
          Feature Reference
        </button>
        <button className="page-related-chip" onClick={() => onNavigate?.('related-use-case')}>
          Related Use Case
        </button>
      </div>
    </div>
  );
}`}</CodeBlock>

        {/* ── Use case vs feature ── */}
        <h2 className="sh">Use Case vs Feature page — when to use which</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', marginTop: 12 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)' }}>
              {['Signal', 'Use Case page', 'Feature page'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Reader's question", '"How do I accomplish X?"', '"What are all the options for Y?"'],
              ['Goal', 'Get to working code quickly', 'Understand and configure the full API'],
              ['Scope', 'Minimum viable path to one outcome', 'Complete feature surface'],
              ['Demo', 'Optional or minimal', 'Required — interactive if possible'],
              ['API table', 'Not needed (link to Feature page)', 'Required'],
              ['Structure', 'Numbered steps', 'Zones by concept: Overview, Config, API'],
              ['Entry point', 'Capability cards on Intro page', 'Sidebar nav, Use Case "What\'s next" link'],
            ].map(([sig, uc, feat]) => (
              <tr key={sig} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '9px 12px', fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text)' }}>{sig}</td>
                <td style={{ padding: '9px 12px', fontSize: '0.8125rem', color: 'var(--mid)' }}>{uc}</td>
                <td style={{ padding: '9px 12px', fontSize: '0.8125rem', color: 'var(--mid)' }}>{feat}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Callout type="info">
          A product area typically has one Intro page, 3–6 Use Case pages, and 8–20 Feature pages.
          If your Use Case page is growing an API table and sub-sections, it wants to be a Feature
          page. If your Feature page is growing numbered steps, extract them into a Use Case page.
        </Callout>

        {/* ── Related ── */}
        <h2 className="sh">Related</h2>
        <div className="page-related">
          <button className="page-related-chip">Page Guidelines</button>
          <button className="page-related-chip">Intro Page Template</button>
          <button className="page-related-chip">Feature Page Template</button>
          <button className="page-related-chip">Dos &amp; Don'ts</button>
        </div>

      </div>
    </div>
  );
}
