/* ─────────────────────────────────────────────────────────────────────────────
 * DocIntroTemplate — authoring guide + copy-paste template for Intro pages.
 * Plumbing / internal.
 * ───────────────────────────────────────────────────────────────────────────── */
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';

/* ─── Local helpers ─────────────────────────────────────────────────────────── */
function CheckRow({ label, detail }) {
  return (
    <div style={{ display: 'flex', gap: 10, padding: '7px 0', borderBottom: '1px solid var(--border)', alignItems: 'flex-start' }}>
      <span style={{ color: '#22c55e', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
      <div>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }}>{label}</span>
        {detail && <div style={{ fontSize: '0.8125rem', color: 'var(--mid)', lineHeight: 1.55, marginTop: 2 }}>{detail}</div>}
      </div>
    </div>
  );
}

function AnatomyBlock({ label, tag, desc, required }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)', alignItems: 'flex-start' }}>
      <div style={{ minWidth: 180, flexShrink: 0 }}>
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

/* ─── Page ──────────────────────────────────────────────────────────────────── */
export default function DocIntroTemplate() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Intro / Overview Page Template</h1>
      </div>
      <p className="quick-answer">
        Anatomy, checklist, and a copy-paste starter for orientation pages that introduce a
        product, subsystem, or major capability group.
      </p>

      <div className="page-body">

        {/* ── Purpose ── */}
        <h2 className="sh">Purpose</h2>
        <p>
          An Intro page answers the question: <em>"What is this and should I be here?"</em> It
          helps readers decide whether this product is right for their use case before they invest
          time going deeper. It is not a tutorial and not a reference — resist the temptation to
          cover configuration options or API surface on this page.
        </p>
        <p>
          A well-written Intro page has three outcomes: the reader understands the capability scope,
          knows the trade-offs or prerequisites, and has a clear next step to take.
        </p>

        {/* ── Anatomy ── */}
        <h2 className="sh">Anatomy</h2>
        <div style={{ marginTop: 8 }}>
          <AnatomyBlock label="Page header" tag=".page-header + h1" desc="Product or subsystem name as the h1. Add a .page-subtitle paragraph (1 sentence) if the title alone is ambiguous." required />
          <AnatomyBlock label="Quick answer" tag=".quick-answer" desc="One or two sentences that describe what this is and the key differentiator. Written for someone scanning, not reading. Place it immediately after .page-header, before any .zone." required />
          <AnatomyBlock label="Hero / banner" tag="<img> in borderRadius wrapper" desc="A full-width product screenshot or illustration at max-height 320 px. Always provide an onError fallback SVG — the asset may not be present in all environments." />
          <AnatomyBlock label="When to use" tag='.zone id="*-when"' desc="A card grid (auto-fill, minmax 220 px) with ✅ (choose this when) and ⚠️ (watch out for) items. 4–6 cards is the sweet spot." required />
          <AnatomyBlock label="Capability cards" tag='.zone id="*-capabilities"' desc="Thumbnail cards for each major feature area. Each card navigates to the relevant feature page when clicked. Use onNavigate(pageId) for wiring." required />
          <AnatomyBlock label="Architecture diagram" tag='.zone id="*-arch"' desc="A layered box diagram showing how this product fits in the stack — app layer, SDK layer, platform layer. Use inline SVG or styled divs (not an image file)." />
          <AnatomyBlock label="Platform support" tag='.zone id="*-platforms"' desc="Side-by-side cards listing OS versions, UI frameworks, and notable feature differences between Android and iOS." />
          <AnatomyBlock label="Getting started CTA" tag='.zone id="*-start"' desc="A prominent call-to-action button linking to the first Getting Started page. Secondary button links to a quick example or sample app." required />
          <AnatomyBlock label="Related chips" tag=".page-related" desc="3–5 chips linking to the most likely next pages: Getting Started, a feature page, and a sibling SDK intro." required />
        </div>

        {/* ── Checklist ── */}
        <h2 className="sh">Authoring checklist</h2>
        <div style={{ marginTop: 4 }}>
          <CheckRow label="Title matches the product name in the sidebar nav" />
          <CheckRow label=".quick-answer answers 'What is this?' in ≤ 2 sentences" />
          <CheckRow label="When-to-use grid has at least one ⚠️ card (honest trade-offs)" detail="Purely positive intro pages feel like marketing copy. One honest caveat builds trust." />
          <CheckRow label="Capability cards link to real pageIds" detail="Use onNavigate(pageId) — don't leave the onClick undefined." />
          <CheckRow label="Architecture diagram is inline (no external image)" detail="Images break across environments; SVG or styled-div diagrams are always present." />
          <CheckRow label="Hero image has an onError fallback" detail="Omit the <img> entirely if the asset doesn't exist yet — use an SVG placeholder instead." />
          <CheckRow label="Getting started CTA is the last zone before related chips" />
          <CheckRow label="All zone elements carry unique id attributes" detail="e.g. id='ns-when', id='ns-arch'. Required for TOC deep-links." />
        </div>

        {/* ── Template ── */}
        <h2 className="sh">Starter template</h2>
        <p>
          Copy this file, replace the placeholder content, and add the export to <code>App.jsx</code>{' '}
          and the product's nav data.
        </p>

        <CodeBlock language="jsx" title="MyFeatureIntro.jsx">{`import Callout from '../components/ui/Callout';
import PageActions from '../components/ui/PageActions';

/* ─── When-to-use card ────────────────────────────────────────────────────── */
function WhenCard({ icon, title, children }) {
  return (
    <div style={{
      border: '1px solid var(--border)', borderRadius: 20,
      padding: '12px 14px', background: 'var(--surface)',
    }}>
      <div style={{ display: 'flex', gap: 7, alignItems: 'flex-start', marginBottom: 4 }}>
        <span style={{ fontSize: '0.875rem', lineHeight: 1.2 }}>{icon}</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)' }}>{title}</span>
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function MyFeatureIntro({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>My Feature Name</h1>
        <PageActions />
      </div>

      {/* Quick answer — 1–2 sentences, no h2, no zone wrapper */}
      <p className="quick-answer">
        Short description of what this is and when to reach for it.
      </p>

      {/* When to use ─────────────────────────────────────────────── */}
      <div className="zone" id="mf-when">
        <h2 className="sh">When to use</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 12,
        }}>
          <WhenCard icon="✅" title="Choose this when…">
            Describe a clear fit scenario.
          </WhenCard>
          <WhenCard icon="✅" title="Also good for…">
            Another valid use case.
          </WhenCard>
          <WhenCard icon="⚠️" title="Watch out for…">
            Be honest about a real trade-off or prerequisite.
          </WhenCard>
        </div>
      </div>

      {/* Capabilities ────────────────────────────────────────────── */}
      <div className="zone" id="mf-capabilities">
        <h2 className="sh">What's included</h2>
        {/* Replace with capability cards — see NavSDKIntro for CapabilityCard pattern */}
      </div>

      {/* Architecture (optional) ────────────────────────────────── */}
      <div className="zone" id="mf-arch">
        <h2 className="sh">Architecture</h2>
        <p>Describe how this fits in the stack. Provide an inline diagram (no image file).</p>
      </div>

      {/* Getting started ─────────────────────────────────────────── */}
      <div className="zone" id="mf-start">
        <h2 className="sh">Get started</h2>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            style={{
              background: '#e2001a', color: '#fff', border: 'none',
              padding: '8px 18px', borderRadius: 6, fontWeight: 600,
              fontSize: '0.875rem', cursor: 'pointer',
            }}
            onClick={() => onNavigate?.('my-feature-getting-started')}
          >
            Get started
          </button>
          <button
            className="page-action-btn"
            onClick={() => onNavigate?.('my-feature-first-example')}
          >
            View quick example
          </button>
        </div>
      </div>

      <Callout type="info">
        Add a prerequisite, version constraint, or important behavioural note here.
      </Callout>

      {/* Related ─────────────────────────────────────────────────── */}
      <div className="page-related">
        <button className="page-related-chip" onClick={() => onNavigate?.('my-feature-getting-started')}>
          Getting Started
        </button>
        <button className="page-related-chip" onClick={() => onNavigate?.('my-feature-quickstart')}>
          Quick Start
        </button>
      </div>
    </div>
  );
}`}</CodeBlock>

        {/* ── Writing tips ── */}
        <h2 className="sh">Writing tips</h2>

        <Callout type="warning">
          Intro pages are not product brochures. Every "✅ choose this when" card should have a
          corresponding "⚠️ watch out for" or "consider instead" card. A page with no caveats
          tells the reader nothing useful.
        </Callout>

        <ul style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 2, marginTop: 12 }}>
          <li>Write the <code>.quick-answer</code> paragraph last — it's the hardest sentence to get right.</li>
          <li>Keep capability card descriptions to 1–2 lines. If you need more, the feature deserves its own page.</li>
          <li>The Getting Started CTA should go to a page that shows working code within the first 3 scrolls.</li>
          <li>Don't duplicate content from the Getting Started page on this Intro page. Reference it instead.</li>
          <li>Intro pages are evergreen — avoid time-sensitive language ("we just added…", "coming soon").</li>
        </ul>

        {/* ── Related ── */}
        <h2 className="sh">Related</h2>
        <div className="page-related">
          <button className="page-related-chip">Page Guidelines</button>
          <button className="page-related-chip">Feature Page Template</button>
          <button className="page-related-chip">Use Case Template</button>
          <button className="page-related-chip">Dos &amp; Don'ts</button>
        </div>

      </div>
    </div>
  );
}
