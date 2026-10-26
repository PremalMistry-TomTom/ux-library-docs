// Skeleton for one draft page. Copy into src/pages/<Name>Pages.jsx and fill in.
// Every page keeps: h1 → PageActions → DraftBanner → quick-answer → zones with h2 ids (all listed in TOC_MAP).
import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import { ApiLinks } from '../components/ui/ApiLinks';

const SOURCE = 'PKD, 22 Oct 2026'; // the source version this draft was built from
const PROPOSAL_SOURCE = 'design direction, 26 Oct 2026'; // only when a PROPOSAL source was used; names it in every Proposal block

/* Shown on every page: says this is a draft and which source it came from.
   Pass `proposals` when the product's pages contain Proposal blocks. */
export function DraftBanner({ onNavigate, gapPage = 'xx-gap-report', productId = 'xx', proposals = false }) {
  return (
    <div className="draft-banner" data-draft-banner style={{
      display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 14px', margin: '0 0 18px',
      border: '1px dashed var(--b-hi)', borderRadius: 10, background: 'var(--s1)', fontSize: '0.8125rem', color: 'var(--mid)',
    }}>
      <strong style={{ color: 'var(--black)', whiteSpace: 'nowrap' }}>Draft</strong>
      <span>
        Generated from the {SOURCE} with the pkd-to-docs skill. Not reviewed by the docs team.{proposals ? ' Blocks marked Proposal are not agreed.' : ''}{' '}
        <a href="#" onClick={e => { e.preventDefault(); onNavigate?.(gapPage, productId); }} style={{ color: 'var(--brand)' }}>See what's still open</a>.
      </span>
    </div>
  );
}

/* Inline marker for content the sources tag LEANING. */
export function Direction({ children }) {
  return <Callout type="warn"><strong>Direction, not final.</strong> {children}</Callout>;
}

/* Frame for content tagged PROPOSAL: suggestions from a source outside the PKD (see
   references/sources-and-screening.md). Everything inside it is the proposal; the PKD's position and the
   gap go outside it. Styled apart from Direction so the two never read alike. */
export function Proposal({ children }) {
  return (
    <div data-proposal style={{
      margin: '14px 0', padding: '12px 16px 14px', borderRadius: 10,
      border: '1px solid var(--info-border)', borderLeft: '4px solid var(--info-border)', background: 'var(--info-bg)',
    }}>
      <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--info-text)', marginBottom: 6 }}>
        Proposal, not agreed · {PROPOSAL_SOURCE}
      </div>
      {children}
    </div>
  );
}

/* Placeholder where a template section needs something the sources don't define. */
export function Gap({ id, children }) {
  return (
    <div data-gap={id} style={{ padding: '12px 14px', border: '1px dashed var(--border)', borderRadius: 10, color: 'var(--muted)', fontSize: '0.8125rem' }}>
      <strong style={{ color: 'var(--mid)' }}>To be defined</strong> · {children} <code>{id}</code>
    </div>
  );
}

export function ExamplePage({ onNavigate }) {
  return (
    <div className="page">
      <h1>Page title</h1>
      <PageActions />
      <DraftBanner onNavigate={onNavigate} />
      <p className="quick-answer">One sentence: what this is and what the developer gets from it.</p>

      <ApiLinks onNavigate={onNavigate} items={[
        { type: 'REST API', name: 'Calculate Route (v1)', description: 'Used for…', pageId: 'routing-calculate-route', productId: 'routing-api' },
      ]} />

      <div className="zone">
        <h2 className="sh" id="section-one">Section one</h2>
        <p>Content from the inventory.</p>
        <Gap id="G3">Authentication for the cloud API.</Gap>
      </div>

      {/* A whole section from a PROPOSAL source: "(proposal)" in the h2 and its TOC label. */}
      <div className="zone">
        <h2 className="sh" id="section-two">Section two (proposal)</h2>
        <Proposal>
          <p style={{ margin: 0 }}>What the proposal says, in the reader's terms.</p>
        </Proposal>
        <p>Where the PKD differs, what it says. It applies until the conflict is decided.</p>
        <Gap id="G12">The decision the conflict needs.</Gap>
      </div>
    </div>
  );
}
