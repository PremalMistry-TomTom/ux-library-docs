/* ─────────────────────────────────────────────────────────────────────────────
 * HairlineLibrary — Plumbing › Illustration › Hairline library
 *
 * Documents the TomTom Docs hairline illustration library as used in this
 * prototype: every figure (Thiago Andrade's upstream set and the ones drawn
 * here), where each is used, the gaps still on Icon style with a proposed
 * concept for each, same-page repeats, and the cards that use screenshots.
 *
 * Data: src/data/hairline-audit.json (node scripts/audit-hairline.mjs) and
 * src/data/hairline-backlog.js. Re-run the audit after any change.
 * ───────────────────────────────────────────────────────────────────────────── */
import { useMemo, useState } from 'react';
import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import { HairlineFigure } from '../illustrations/hairline';
import { HairlineBar } from './IntroIllustrations';
import AUDIT from '../data/hairline-audit.json';
import { HAIRLINE_BACKLOG, HAIRLINE_REPEAT_PLAN } from '../data/hairline-backlog';

const th = { textAlign: 'left', padding: '8px 10px', borderBottom: '1px solid var(--border)', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--mid)', textTransform: 'uppercase', letterSpacing: '0.04em', background: 'var(--s1)' };
const td = { padding: '8px 10px', borderBottom: '1px solid var(--border)', fontSize: '0.8125rem', verticalAlign: 'top' };
const mono = { fontFamily: 'var(--font-mono)', fontSize: '0.75rem' };
const chip = (bg, fg) => ({ display: 'inline-block', padding: '1px 8px', borderRadius: 100, fontSize: '0.6875rem', fontWeight: 600, background: bg, color: fg, whiteSpace: 'nowrap' });
const SOURCE_CHIP = { upstream: chip('var(--info-bg)', 'var(--info-text)'), local: chip('var(--warn-bg)', 'var(--warn-text)') };
const PRIORITY = { 1: ['P1', chip('var(--danger-bg)', 'var(--danger-text)')], 2: ['P2', chip('var(--warn-bg)', 'var(--warn-text)')], 3: ['P3', chip('var(--s2)', 'var(--mid)')] };

function Stat({ n, label }) {
  return (
    <div style={{ padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 16, background: 'var(--s1)' }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.1 }}>{n}</div>
      <div style={{ fontSize: '0.75rem', color: 'var(--mid)', marginTop: 2 }}>{label}</div>
    </div>
  );
}

function FigureCard({ f }) {
  return (
    <div className="illo-card-wrap">
      <div className="hl-card">
        <div className="hl-card-figure"><HairlineFigure slug={f.slug} /></div>
        <div className="hl-card-label" style={{ gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>{f.name}</span>
            <span style={SOURCE_CHIP[f.source]}>{f.source === 'local' ? 'Drawn here' : 'Thiago’s set'}</span>
          </div>
          <span style={{ ...mono, color: 'var(--mid)' }}>{f.slug}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--mid)' }}>For: {f.for}</span>
          <span style={{ fontSize: '0.75rem', color: f.uses ? 'var(--black)' : 'var(--danger-text)' }}>
            {f.uses ? `${f.uses} card${f.uses > 1 ? 's' : ''} · ${f.pages.join(', ')}` : 'Not used yet'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function HairlineLibrary() {
  const t = AUDIT.totals;
  const [filter, setFilter] = useState('all');
  const figures = useMemo(() => AUDIT.figures.filter(f =>
    filter === 'all' ? true : filter === 'unused' ? !f.uses : f.source === filter), [filter]);
  const backlogByIcon = Object.fromEntries(HAIRLINE_BACKLOG.map(b => [b.icon, b]));
  const PLAN_BY_SLUG = Object.fromEntries([...HAIRLINE_BACKLOG, ...HAIRLINE_REPEAT_PLAN].map(b => [b.slug, b]));
  const gaps = AUDIT.gaps.map(g => ({ ...g, plan: backlogByIcon[g.icon] }))
    .sort((a, b) => (a.plan?.priority ?? 9) - (b.plan?.priority ?? 9) || b.uses - a.uses);
  const repeats = [...AUDIT.dupes].sort((a, b) => b.cards.length - a.cards.length);
  const pct = Math.round((t.covered / t.slots) * 100);

  return (
    <div className="page" style={{ paddingTop: 0 }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
        <HairlineBar />
      </div>
      <div style={{ padding: '0 24px' }}>
        <div className="page-header" style={{ marginTop: 24 }}>
          <h1>Hairline library</h1>
          <PageActions />
        </div>
        <p className="quick-answer">
          The TomTom Docs illustration style: isometric line figures, 5:4, one highlight, a short story on hover.
          This page lists every figure, where it is used, and what is still missing across the docs.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10, margin: '16px 0 8px' }}>
          <Stat n={`${pct}%`} label={`of ${t.slots} illustration slots on ${t.pages} pages use hairline`} />
          <Stat n={t.figures} label={`figures (${t.upstream} Thiago’s set, ${t.local} drawn here)`} />
          <Stat n={t.gapIcons} label={`thumbnails without a figure (${t.gapSlots} cards)`} />
          <Stat n={t.duplicates} label="pages repeat one figure on several cards" />
          <Stat n={t.bypass} label="cards use screenshots or banners instead" />
        </div>
        <p style={{ fontSize: '0.6875rem', color: 'var(--mid)', margin: '0 0 24px' }}>
          Audit run {new Date(AUDIT.generatedAt).toLocaleString()} · <code>node scripts/audit-hairline.mjs</code>
        </p>

        {/* ── Sources ── */}
        <h2 id="sources">Sources</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
          <thead><tr><th style={th}>Where</th><th style={th}>What</th><th style={th}>Owner</th></tr></thead>
          <tbody>
            <tr><td style={td}><code style={mono}>public/hairline/</code></td><td style={td}>Thiago Andrade’s figures and the Hairline kernel, copied from <a href="https://github.com/thiagoandrade-tomtom/tomtom-docs-illustrations" target="_blank" rel="noreferrer">tomtom-docs-illustrations</a> by <code style={mono}>scripts/sync-hairline.sh</code>. Never edit; the sync replaces the folder.</td><td style={td}>Thiago (upstream)</td></tr>
            <tr><td style={td}><code style={mono}>public/hairline-local/</code></td><td style={td}>Figures drawn for this prototype with the <code style={mono}>tomtom-hairline</code> skill, same format, slugs under <code style={mono}>nav/</code>. Candidates to send upstream.</td><td style={td}>This prototype</td></tr>
            <tr><td style={td}><code style={mono}>src/illustrations/hairline.jsx</code></td><td style={td}>The renderer, and <code style={mono}>HAIRLINE_FOR</code>: which figure stands in for which Icon thumbnail. Unmapped Icons keep their Icon drawing.</td><td style={td}>This prototype</td></tr>
            <tr><td style={td}><code style={mono}>src/index.css</code> “Hairline”</td><td style={td}>Colour (Blueprint, Black and white, TomTom red) and theme (light, dark) tokens, the same as Thiago’s gallery, and the 5:4 thumbnail box.</td><td style={td}>This prototype</td></tr>
          </tbody>
        </table>

        {/* ── Library ── */}
        <h2 id="library">Library</h2>
        <div style={{ display: 'flex', gap: 6, margin: '8px 0 14px', flexWrap: 'wrap' }}>
          {[['all', `All ${t.figures}`], ['upstream', `Thiago’s set ${t.upstream}`], ['local', `Drawn here ${t.local}`], ['unused', `Unused ${t.unusedFigures}`]].map(([id, label]) => (
            <button key={id} onClick={() => setFilter(id)} aria-pressed={filter === id}
              style={{ padding: '5px 12px', borderRadius: 100, cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600,
                border: filter === id ? '2px solid var(--black)' : '1.5px solid var(--border)',
                background: filter === id ? 'var(--black)' : 'transparent', color: filter === id ? 'var(--bg)' : 'var(--mid)' }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14, marginBottom: 32 }}>
          {figures.map(f => <FigureCard key={f.slug} f={f} />)}
        </div>

        {/* ── Gaps ── */}
        <h2 id="gaps">Gaps: thumbnails with no figure yet</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>
          These cards still show the Icon drawing, tagged “Needs a hairline figure”. Each has a proposed concept for the
          <code style={mono}> tomtom-hairline</code> skill. P1 = an API or SDK intro page, P2 = discovery and landing cards, P3 = UX Library internals.
        </p>
        <div style={{ overflowX: 'auto', marginBottom: 32 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
            <thead><tr><th style={th}></th><th style={th}>Thumbnail</th><th style={th}>Cards</th><th style={th}>Proposed figure</th><th style={th}>Concept</th></tr></thead>
            <tbody>
              {gaps.map(g => {
                const [p, ps] = PRIORITY[g.plan?.priority] ?? ['—', chip('var(--s2)', 'var(--mid)')];
                return (
                  <tr key={g.icon || g.light}>
                    <td style={td}><span style={ps}>{p}</span></td>
                    <td style={td}><code style={mono}>{g.icon || g.light}</code><div style={{ fontSize: '0.6875rem', color: 'var(--mid)', marginTop: 2 }}>{g.pages.join(', ')}</div></td>
                    <td style={td}><strong>{g.uses}</strong><div style={{ fontSize: '0.6875rem', color: 'var(--mid)', marginTop: 2 }}>{g.labels.slice(0, 3).join(' · ')}</div></td>
                    <td style={td}>{g.plan ? <><strong>{g.plan.name}</strong><div style={{ ...mono, color: 'var(--mid)' }}>{g.plan.slug}</div></> : <span style={{ color: 'var(--danger-text)' }}>No concept yet</span>}</td>
                    <td style={td}>{g.plan?.concept}{g.plan && <div style={{ ...mono, color: 'var(--mid)', marginTop: 2 }}>read-out: {g.plan.readout}</div>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Planned ── */}
        <h2 id="planned">Planned figures</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>
          {t.planned} figures are named by cards but not drawn yet ({t.plannedCards} cards). Until a figure exists its cards show their Icon’s figure,
          or the Icon drawing. Add the figure to <code style={mono}>public/hairline-local/figures/</code> and its cards switch on their own.
        </p>
        <div style={{ overflowX: 'auto', marginBottom: 32 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
            <thead><tr><th style={th}>Figure</th><th style={th}>Cards</th><th style={th}>Concept</th></tr></thead>
            <tbody>
              {AUDIT.planned.map(p => {
                const plan = PLAN_BY_SLUG[p.slug];
                return (
                  <tr key={p.slug}>
                    <td style={td}><strong>{plan?.name ?? '—'}</strong><div style={{ ...mono, color: 'var(--mid)' }}>{p.slug}</div></td>
                    <td style={td}><strong>{p.cards}</strong><div style={{ fontSize: '0.6875rem', color: 'var(--mid)', marginTop: 2 }}>{p.pages.join(', ')}</div></td>
                    <td style={td}>{plan?.concept ?? <span style={{ color: 'var(--danger-text)' }}>No concept yet</span>}{plan && <div style={{ ...mono, color: 'var(--mid)', marginTop: 2 }}>read-out: {plan.readout}</div>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Repeats ── */}
        <h2 id="repeats">Repeats: one figure on several cards of a page</h2>
        <Callout type="warn" title="Inherited from the Icon style">
          The Icon thumbnails were shared across cards, so hairline repeated them too. Cards can now name their own figure (the fourth argument of
          makeThumb). {t.duplicates} repeats show today; {t.duplicatesWhenDrawn} remain once the planned figures are drawn, mostly Android and iOS twin cards
          on the discovery page. The Nav SDK domain files hold eight domain pages each, so a repeat there may be on two different pages. Worst first:
        </Callout>
        <div style={{ overflowX: 'auto', margin: '12px 0 32px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
            <thead><tr><th style={th}>Page</th><th style={th}>Figure</th><th style={th}>Cards sharing it</th></tr></thead>
            <tbody>
              {repeats.map(r => (
                <tr key={r.page + r.slug}>
                  <td style={td}>{r.page}</td>
                  <td style={td}><code style={mono}>{r.slug}</code></td>
                  <td style={td}><strong>{r.cards.length}</strong> · <span style={{ color: 'var(--mid)' }}>{r.cards.join(' · ')}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Screenshots ── */}
        <h2 id="screenshots">Cards that use screenshots or banners</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>
          These do not go through the illustration system. Product screenshots are probably right as they are; hero banners and tool cards are a design decision.
        </p>
        <div style={{ overflowX: 'auto', marginBottom: 32 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 520 }}>
            <thead><tr><th style={th}>Page</th><th style={th}>Image</th><th style={th}>Card</th></tr></thead>
            <tbody>
              {AUDIT.bypass.map((b, i) => (
                <tr key={i}><td style={td}>{b.page}</td><td style={td}><code style={mono}>{b.what}</code></td><td style={td}>{b.label || '—'}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── How to ── */}
        <h2 id="add-a-figure">Add a figure</h2>
        <ol style={{ fontSize: '0.875rem', lineHeight: 1.7, paddingLeft: 20 }}>
          <li>Install the skill once: <code style={mono}>npx skills add thiagoandrade-tomtom/tomtom-docs-illustrations</code>, then ask for the figure with the concept from the gaps table.</li>
          <li>Check it until it passes: <code style={mono}>node &lt;skill&gt;/look.mjs &lt;name&gt;.js --answer=x,y,z --edge=x,y,z</code>, and read the look sheet, not just the exit code.</li>
          <li>Copy it to <code style={mono}>public/hairline-local/figures/nav/</code> and add its name, purpose and alt text to that folder’s <code style={mono}>index.json</code>.</li>
          <li>Map the Icon to it in <code style={mono}>HAIRLINE_FOR</code> (<code style={mono}>src/illustrations/hairline.jsx</code>) and delete its entry from <code style={mono}>src/data/hairline-backlog.js</code>.</li>
          <li>Re-run the audit so this page updates.</li>
        </ol>
        <CodeBlock code={`scripts/sync-hairline.sh          # pull Thiago's latest figures\nnode scripts/audit-hairline.mjs   # refresh this page's data`} language="bash" />
        <div style={{ height: 48 }} />
      </div>
    </div>
  );
}
