/* ─────────────────────────────────────────────────────────────────────────────
 * Driving Intelligence — intro, use-case landing and use-case pages (DRAFT, pkd-to-docs skill)
 * Kept apart from DrivingIntelligencePages.jsx, which another drafting pass edits.
 * Layout follows the Maps & Navigation SDK intro and domain landings. Every moment is drawn with
 * UX Library components from the design direction's proposed fields: illustrative, not an API.
 * Pre-release: do not publish.
 * ───────────────────────────────────────────────────────────────────────────── */
import { useState } from 'react';
import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import { ApiLinks } from '../components/ui/ApiLinks';
import { Figure, LayerDiagram } from '../components/diagrams/Diagrams';
import { useDemoStyle } from '../hooks/useDemoStyle';
import { useIlloStyle } from '../context/IlloStyleContext';
import {
  makeThumb, L_TrafficIncidents, L_SearchAlongRoute, L_HomeScreen, L_TrafficStats, L_ADAS,
} from '../illustrations/lightVariants';
import {
  IcoTrafficIncidents, IcoSearchAlongRoute, IcoHomeScreen, IcoTrafficStats, IcoADAS,
} from '../illustrations/iconVariants';
import {
  IlloTrafficIncidents, IlloSearchAlongRoute, IlloHomeScreen, IlloTrafficStats, IlloADAS,
} from './IntroIllustrations';
import { DraftBanner } from './DrivingIntelligencePages';
import { downloadDrivingIntelligenceContext } from '../data/claude-context-driving-intelligence';
import { DI_MOMENTS, DI_SURFACES, diMoment, diSurfaceFields } from '../data/moments-driving-intelligence';

const PRODUCT = 'driving-intelligence';
const ROUTE_RED = '#e2001a'; // the route line in every UX Library mock
const ILLUSTRATIVE = 'Illustrative. Drawn with UX Library components from the proposed moment fields. The moment format and the A2UI rendering path are proposals, not agreed (DI-G6, DI-G35, DI-G36).';

/* ─── Small page helpers (local copies; the main DI pages file keeps its own) ─── */

function Section({ id, title, children }) {
  return (
    <div className="zone">
      <h2 className="sh" id={id}>{title}</h2>
      {children}
    </div>
  );
}

function Table({ head, rows }) {
  return (
    <table className="prop-table">
      <thead><tr>{head.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
    </table>
  );
}

function Gap({ id, children }) {
  return (
    <div data-gap={id} style={{ padding: '12px 14px', margin: '12px 0', border: '1px dashed var(--border)', borderRadius: 10, color: 'var(--muted)', fontSize: '0.8125rem' }}>
      <strong style={{ color: 'var(--mid)' }}>To be defined</strong> · {children} <code>{id}</code>
    </div>
  );
}

function Direction({ children }) {
  return <Callout type="warn"><strong>Direction, not final.</strong> {children}</Callout>;
}

// Content from the DI design lead's design direction (26 Oct 2026): PROPOSAL, below the PKD.
function Proposal({ children }) {
  return (
    <div data-proposal style={{
      margin: '14px 0', padding: '12px 16px 14px', borderRadius: 10,
      border: '1px solid var(--info-border)', borderLeft: '4px solid var(--info-border)', background: 'var(--info-bg)',
    }}>
      <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--info-text)', marginBottom: 6 }}>
        Proposal, not agreed · design direction, 26 Oct 2026
      </div>
      {children}
    </div>
  );
}

const STATUS_COLORS = {
  'Alpha': 'var(--warn-text)', 'Early access': 'var(--warn-text)', 'Planned': 'var(--muted)', 'Later': 'var(--muted)',
  'Exists': 'var(--success-text)', 'Proposal': 'var(--info-text)', 'Illustrative': 'var(--info-text)',
};

function Status({ s }) {
  return (
    <span style={{
      display: 'inline-block', padding: '1px 8px', borderRadius: 6, fontSize: '0.6875rem', fontWeight: 700,
      border: '1px solid var(--border)', color: STATUS_COLORS[s] || 'var(--mid)', whiteSpace: 'nowrap',
    }}>{s}</span>
  );
}

function NavButton({ onNavigate, pageId, primary, children }) {
  return (
    <button onClick={() => onNavigate?.(pageId, PRODUCT)} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', padding: '7px 18px', borderRadius: 6,
      fontWeight: 600, fontSize: '0.875rem',
      background: primary ? 'var(--brand)' : 'transparent', color: primary ? '#fff' : 'var(--black)',
      border: primary ? '1.5px solid var(--brand)' : '1.5px solid var(--border)',
    }}>{children}</button>
  );
}

function DownloadAIContextBtn() {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={() => { downloadDrivingIntelligenceContext(); setDone(true); setTimeout(() => setDone(false), 2500); }}
      title="Download a structured markdown file for use as context in any AI assistant"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', color: 'var(--black)',
        border: '1.5px solid var(--border)', padding: '7px 18px', borderRadius: 6, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
      }}
    >{done ? 'Downloaded' : 'Download AI context'}</button>
  );
}

function DocLink({ children, pageId, productId = PRODUCT, onNavigate }) {
  return (
    <button onClick={() => onNavigate?.(pageId, productId)} style={{
      background: 'none', border: 'none', padding: 0, color: 'var(--red, #e2001a)', fontWeight: 600, cursor: 'pointer',
      fontSize: 'inherit', textDecoration: 'underline', textUnderlineOffset: '2px',
    }}>{children}</button>
  );
}

/* Same card as the Maps & Navigation SDK intro: check or warning icon, title, short text. */
function WhenCard({ type = 'check', title, children }) {
  const isWarn = type === 'warn';
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 20, padding: '12px 14px', background: 'var(--surface)' }}>
      <div style={{ display: 'flex', gap: 7, alignItems: 'flex-start', marginBottom: 4 }}>
        {isWarn ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }} aria-hidden="true">
            <path d="M8 1.5L14.928 13.5H1.072L8 1.5Z" fill="#f59e0b"/>
            <rect x="7.25" y="6" width="1.5" height="4" rx="0.75" fill="white"/>
            <circle cx="8" cy="11.5" r="0.85" fill="white"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }} aria-hidden="true">
            <circle cx="8" cy="8" r="7" fill="#22c55e"/>
            <path d="M5 8.2l2 2 4-4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)' }}>{title}</span>
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}

/* Same card as the Maps & Navigation SDK use-case grid: thumbnail, eyebrow, title, text, whole card clickable. */
function UseCaseCard({ Thumb, group, status, title, desc, pageId, onNavigate }) {
  const { theme, palette } = useIlloStyle();
  const go = () => onNavigate?.(pageId, PRODUCT);
  return (
    <div
      role="link" tabIndex={0} onClick={go}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), go())}
      style={{ cursor: 'pointer', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--white)', transition: 'box-shadow 0.15s, border-color 0.15s', display: 'flex', flexDirection: 'column' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'; e.currentTarget.style.borderColor = 'var(--red)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      <div style={{ height: 130, background: theme !== 'dark' ? palette.bg : '#0d1117', overflow: 'hidden', flexShrink: 0 }}>
        <Thumb />
      </div>
      <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)' }}>{group}</span>
          {status && <Status s={status} />}
        </div>
        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--black)', marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.5, flex: 1 }}>{desc}</div>
        <span style={{ marginTop: 10, fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)' }}>Explore →</span>
      </div>
    </div>
  );
}

function RelatedChip({ label, pageId, productId = PRODUCT, onNavigate }) {
  return (
    <button onClick={() => onNavigate?.(pageId, productId)} style={{
      background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 100, padding: '6px 14px',
      fontSize: '0.8125rem', fontWeight: 600, color: 'var(--mid)', cursor: 'pointer',
    }}>{label} →</button>
  );
}

const grid = (min) => ({ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`, gap: 14 });

/* ─── The moment mock ───────────────────────────────────────────────────────────
 * One moment, drawn per surface in the UX Library mock style (useDemoStyle palette, red route line).
 * Each surface shows only the fields it uses; the words come from the moment's `copy`.
 * ───────────────────────────────────────────────────────────────────────────── */

function MapCanvas({ height, children }) {
  const M = useDemoStyle();
  return (
    <div style={{ height, background: M.dark, borderRadius: 16, border: `1px solid ${M.line}`, overflow: 'hidden', position: 'relative' }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 300 190" preserveAspectRatio="none" fill="none" aria-hidden="true">
        <path d="M70 0 L76 190" stroke={M.line} strokeOpacity="0.5" strokeWidth="1" />
        <path d="M0 60 Q120 52 300 66" stroke={M.line} strokeOpacity="0.5" strokeWidth="1" />
        <path d="M20 150 Q90 70 160 104 T290 46" stroke={ROUTE_RED} strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
      </svg>
      {children}
    </div>
  );
}

function Actions({ labels, small }) {
  const M = useDemoStyle();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))`, gap: 6, marginTop: small ? 6 : 10 }}>
      {labels.map((a, i) => (
        <span key={a} style={{
          textAlign: 'center', padding: small ? '3px 4px' : '7px 0', borderRadius: 8, fontSize: small ? '0.5625rem' : '0.75rem', fontWeight: 700, whiteSpace: 'nowrap',
          background: i === 0 ? M.text : 'transparent', color: i === 0 ? M.bg : M.text, border: `1px solid ${i === 0 ? M.text : M.line}`,
        }}>{a}</span>
      ))}
    </div>
  );
}

function WidgetCard({ m, small, compact }) {
  const M = useDemoStyle();
  const c = m.copy;
  return (
    <div style={{
      background: M.bg, border: `1px solid ${M.line}`, borderRadius: small ? 12 : 18, padding: small ? '8px 10px' : '12px 14px',
      boxShadow: '0 4px 14px rgba(0,0,0,0.12)', color: M.text,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'baseline' }}>
        <span style={{ fontSize: small ? '0.5625rem' : '0.625rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: M.dim }}>{c.eyebrow}</span>
        {c.until && !small && <span style={{ fontSize: '0.625rem', color: M.dim }}>{c.until}</span>}
      </div>
      <div style={{ fontSize: small ? '0.875rem' : compact ? '1.0625rem' : '1.25rem', fontWeight: 700, lineHeight: 1.15, marginTop: 2 }}>{c.big}</div>
      {!small && !compact && <div style={{ fontSize: '0.75rem', color: M.dim, lineHeight: 1.45, marginTop: 4 }}>{c.why}</div>}
      {!small && <Actions labels={c.actions} small={compact} />}
    </div>
  );
}

function MockWidget({ m, height, compact }) {
  return (
    <MapCanvas height={height}>
      <div style={{ position: 'absolute', left: 12, right: 12, bottom: 12, maxWidth: 300 }}>
        <WidgetCard m={m} compact={compact} />
      </div>
    </MapCanvas>
  );
}

function MockRouteBar({ m, height }) {
  const M = useDemoStyle();
  const road = m.moment.trigger === 'road';
  return (
    <MapCanvas height={height}>
      {/* minimised state: map, a guidance-free top, the bar on the right edge */}
      <div style={{ position: 'absolute', top: 12, bottom: 12, right: 14, width: 14, borderRadius: 6, background: M.bg, border: `1px solid ${M.line}` }}>
        <div style={{ position: 'absolute', left: 6, top: 8, bottom: 14, width: 2, background: M.line }} />
        {road
          ? <div style={{ position: 'absolute', left: 3, width: 8, top: '30%', height: '16%', borderRadius: 3, background: ROUTE_RED }} title="Jam or closure on the usual way" />
          : <div style={{ position: 'absolute', left: 2, width: 10, height: 10, top: '38%', borderRadius: '50%', background: M.green }} title="The stop" />}
        <div style={{ position: 'absolute', left: 4, top: 4, width: 6, height: 6, borderRadius: '50%', background: M.green }} />
        <div style={{ position: 'absolute', left: 2, bottom: 2, width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderBottom: `8px solid ${ROUTE_RED}` }} />
      </div>
      <div style={{
        position: 'absolute', right: 36, top: road ? '27%' : '34%', maxWidth: '60%',
        background: M.bg, border: `1px solid ${M.line}`, borderRadius: 10, padding: '6px 10px', color: M.text,
        fontSize: '0.75rem', fontWeight: 700, boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
      }}>
        {m.copy.bar}
        {m.copy.until && <div style={{ fontSize: '0.625rem', fontWeight: 500, color: M.dim, marginTop: 2 }}>{m.copy.until}</div>}
      </div>
    </MapCanvas>
  );
}

function MockClusterTile({ m, height, compact }) {
  const M = useDemoStyle();
  const c = m.copy;
  const dial = { position: 'absolute', top: '50%', width: height * 0.62, height: height * 0.62, marginTop: -height * 0.31, borderRadius: '50%', border: `2px solid ${M.line}` };
  return (
    <div style={{ height, background: M.dark, borderRadius: 28, border: `1px solid ${M.line}`, position: 'relative', overflow: 'hidden' }}>
      <div style={{ ...dial, left: -height * 0.18 }} aria-hidden="true" />
      <div style={{ ...dial, right: -height * 0.18 }} aria-hidden="true" />
      <div style={{
        position: 'absolute', left: compact ? '9%' : '22%', right: compact ? '9%' : '22%', top: '50%', transform: 'translateY(-50%)',
        background: M.bg, border: `1px solid ${M.line}`, borderRadius: 14, padding: compact ? '8px 10px' : '10px 12px', color: M.clusterText,
      }}>
        <div style={{ fontSize: compact ? '0.5625rem' : '0.625rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: M.clusterSub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.eyebrow}</div>
        {c.rows
          ? c.rows.map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: compact ? '0.6875rem' : '0.75rem', marginTop: 4, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
              <span style={{ color: M.clusterSub }}>{k}</span><strong>{v}</strong>
            </div>
          ))
          : <div style={{ fontSize: '0.875rem', fontWeight: 700, marginTop: 2 }}>{c.big}</div>}
        <Actions labels={c.actions} small />
      </div>
    </div>
  );
}

function MockVoice({ m, height, compact }) {
  const M = useDemoStyle();
  const bars = [10, 22, 14, 30, 18, 26, 12];
  return (
    <div style={{ height, background: M.dark, borderRadius: 16, border: `1px solid ${M.line}`, display: 'grid', placeItems: 'center', padding: 16 }}>
      <div style={{ display: 'grid', gap: 12, justifyItems: 'center', textAlign: 'center', maxWidth: 360 }}>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', height: 30 }} aria-hidden="true">
          {bars.map((h, i) => <span key={i} style={{ width: 4, height: h, borderRadius: 2, background: M.text, opacity: 0.7 }} />)}
        </div>
        <div style={{ fontSize: compact ? '0.8125rem' : '0.9375rem', lineHeight: 1.45, color: M.text }}>“{m.copy.voice}”</div>
      </div>
    </div>
  );
}

const MOCKS = { widget: MockWidget, bar: MockRouteBar, tile: MockClusterTile, voice: MockVoice };

function SurfaceStatus({ surface }) {
  const s = DI_SURFACES[surface];
  const color = { ok: 'var(--success-text)', planned: 'var(--muted)', change: 'var(--warn-text)', neutral: 'var(--mid)' }[s.tone];
  return <span style={{ fontSize: '0.6875rem', fontWeight: 700, color, whiteSpace: 'nowrap' }}>{s.status}</span>;
}

export function MomentMock({ moment, surface, height = 220, compact = false }) {
  const Mock = MOCKS[surface];
  return <Mock m={moment} height={height} compact={compact} />;
}

/* Thumbnail for use-case cards: the moment as a small widget on the map. */
function momentThumb(m) {
  return function MomentThumb() {
    return (
      <MapCanvas height={130}>
        <div style={{ position: 'absolute', left: 10, bottom: 10, right: 34 }}>
          <WidgetCard m={m} small />
        </div>
      </MapCanvas>
    );
  };
}

/* The moment as JSON, one line per field; the lines a surface draws are highlighted. */
function inline(v) {
  if (Array.isArray(v)) return `[${v.map(inline).join(', ')}]`;
  if (v && typeof v === 'object') return `{ ${Object.entries(v).map(([k, x]) => `"${k}": ${inline(x)}`).join(', ')} }`;
  return JSON.stringify(v);
}

function MomentJson({ moment, highlight }) {
  const entries = Object.entries(moment);
  return (
    <div className="code-block" style={{ margin: 0 }}>
      <div className="code-bar"><span className="code-bar-label">Illustrative moment (proposed fields)</span></div>
      <pre style={{ margin: 0, padding: '12px 0', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.55)' }}>
        <span style={{ display: 'block', padding: '0 16px' }}>{'{'}</span>
        {entries.map(([k, v], i) => {
          const on = highlight ? highlight.includes(k) : true;
          return (
            <span key={k} style={{
              display: 'block', padding: '0 16px 0 13px', borderLeft: `3px solid ${on && highlight ? ROUTE_RED : 'transparent'}`,
              background: on && highlight ? 'rgba(255,255,255,0.07)' : 'transparent', color: on ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.4)',
            }}>
              {'  '}<span style={{ color: on ? '#9cdcfe' : 'inherit' }}>"{k}"</span>: {inline(v)}{i < entries.length - 1 ? ',' : ''}
            </span>
          );
        })}
        <span style={{ display: 'block', padding: '0 16px' }}>{'}'}</span>
      </pre>
    </div>
  );
}

/* Pick a surface: the JSON highlights the fields it uses, the mock draws them. */
export function MomentExplorer({ moment: m }) {
  const [surface, setSurface] = useState(m.surfaces[0]);
  const s = DI_SURFACES[surface];
  const fields = diSurfaceFields(m, surface);
  return (
    <div>
      <div role="tablist" aria-label="Surfaces" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        {m.surfaces.map(k => (
          <button key={k} role="tab" aria-selected={k === surface} onClick={() => setSurface(k)} style={{
            cursor: 'pointer', padding: '6px 14px', borderRadius: 999, fontSize: '0.8125rem', fontWeight: 600,
            border: `1px solid ${k === surface ? 'var(--black)' : 'var(--border)'}`,
            background: k === surface ? 'var(--black)' : 'var(--surface)', color: k === surface ? 'var(--white)' : 'var(--mid)',
          }}>{DI_SURFACES[k].label}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, alignItems: 'start' }}>
        <div style={{ minWidth: 0 }}><MomentJson moment={m.moment} highlight={surface === 'widget' ? null : fields} /></div>
        <div style={{ minWidth: 0, display: 'grid', gap: 8 }}>
          <MomentMock moment={m} surface={surface} height={240} />
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap', fontSize: '0.75rem' }}>
            <span style={{ color: 'var(--mid)' }}>{s.sub}</span>
            <SurfaceStatus surface={surface} />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--mid)' }}>
            <strong style={{ color: 'var(--black)' }}>Uses:</strong> {surface === 'widget' ? 'every field' : fields.map((f, i) => <span key={f}>{i ? ', ' : ''}<code>{f}</code></span>)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{s.note}</div>
        </div>
      </div>
    </div>
  );
}

/* One moment on all four surfaces, side by side. Off the intro for now: it repeated the use-case cards. */
function MomentStrip({ moment: m, onNavigate }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', margin: '0 0 36px' }}>
      <div style={{ padding: 14, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        {m.surfaces.map(k => (
          <div key={k} style={{ display: 'grid', gap: 6, minWidth: 0 }}>
            <MomentMock moment={m} surface={k} height={180} compact />
            <div style={{ display: 'grid', gap: 2, fontSize: '0.75rem' }}>
              <strong style={{ color: 'var(--black)' }}>{DI_SURFACES[k].label}</strong>
              <SurfaceStatus surface={k} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', background: 'var(--s1)', display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--mid)', maxWidth: '70ch' }}>
          <strong style={{ color: 'var(--black)' }}>One moment, four surfaces.</strong> DI sends the moment once; each surface draws the fields it needs. {ILLUSTRATIVE}
        </span>
        <DocLink pageId={m.pageId} onNavigate={onNavigate}>See this use case</DocLink>
      </div>
    </div>
  );
}

/* ─── What each use case runs on (TomTom products; checked by check_product.py) ─── */

const ROUTE_BAR = { type: 'UX Library', name: 'Route Bar', description: 'Planned. Its minimised state is one surface for this moment.', pageId: 'route-bar', productId: 'ux-library' };
const CLUSTER = { type: 'UX Library', name: 'Displaying on Cluster', description: 'The cluster tile. Today the cluster is empty until a trip is active.', pageId: 'cluster', productId: 'ux-library' };
const HOME = { type: 'UX Library', name: 'Home Screen Layout', description: 'The home screen your app\'s own slot sits on.', pageId: 'home-screen-layout', productId: 'ux-library' };
const ROUTING = { type: 'REST API', name: 'Routing API', description: 'Arrival times for the usual way and the alternative.', pageId: 'routing-api-intro', productId: 'routing-api' };
const INCIDENTS = { type: 'REST API', name: 'Traffic API: Incident Details', description: 'Jams and closures on the way the driver is going.', pageId: 'traffic-incident-details', productId: 'traffic-api' };
const HORIZON = { type: 'Android SDK', name: 'Virtual Horizon: Traffic', description: 'Traffic events ahead on the route, from the Maps & Navigation SDK.', pageId: 'navsdk-horizon-traffic', productId: 'navsdk' };
const ALONG = { type: 'REST API', name: 'Search API: Along Route', description: 'Place candidates ahead on the route.', pageId: 'search-along-route', productId: 'search-api' };
const POI = { type: 'REST API', name: 'Search API: POI Search', description: 'Places, with the details DI checks against arrival.', pageId: 'search-poi', productId: 'search-api' };

const USE_CASE_LINKS = {
  'faster-way': [INCIDENTS, ROUTING, HORIZON, HOME, ROUTE_BAR, CLUSTER],
  'closure': [INCIDENTS, ROUTING, HORIZON, HOME, ROUTE_BAR, CLUSTER],
  'save-place': [
    { type: 'Android SDK', name: 'Maps & Navigation SDK', description: 'Map-matched positions and stops the driver model learns from.', pageId: 'navsdk-intro', productId: 'navsdk' },
    HOME,
  ],
  'charger': [
    { type: 'REST API', name: 'EV Charging API: Search Along Route', description: 'Chargers ahead on the route.', pageId: 'ev-search-along-route', productId: 'ev-charging-api' },
    ROUTING,
    { type: 'UX Library', name: 'EV In-Navigation UI', description: 'Where charging stops show during a drive.', pageId: 'ev-nav-ui', productId: 'ux-library' },
    HOME, ROUTE_BAR,
  ],
  'coffee': [ALONG, POI, ROUTING, HOME, ROUTE_BAR],
  'open-on-arrival': [ALONG, POI, ROUTING, HOME, ROUTE_BAR],
};

/* ─── Introduction ─────────────────────────────────────────────────────────── */

const CAPABILITY_CARDS = [
  { part: 'Proactive', status: 'Alpha', Thumb: makeThumb(IlloTrafficIncidents, L_TrafficIncidents, IcoTrafficIncidents), pageId: 'di-flows',
    desc: 'Predicts the trip with nothing entered, watches the road, and speaks only when today is different.' },
  { part: 'Reactive', status: 'Early access', Thumb: makeThumb(IlloSearchAlongRoute, L_SearchAlongRoute, IcoSearchAlongRoute), pageId: 'di-flows',
    desc: 'Road questions: charge on the way, stops along the route, route status, trip planning, parking, finding a place.' },
  { part: 'Personal', status: 'Alpha', Thumb: makeThumb(IlloHomeScreen, L_HomeScreen, IcoHomeScreen), pageId: 'di-context',
    desc: 'The driver\'s places and what they call them, with a nudge to save them. Preferences come later.' },
  { part: 'Road knowledge', status: 'Planned', Thumb: makeThumb(IlloTrafficStats, L_TrafficStats, IcoTrafficStats), pageId: 'di-capabilities',
    desc: 'Patterns and events turned into advice for this drive, always with what it is based on.' },
  { part: 'The car explains itself', status: 'Later', Thumb: makeThumb(IlloADAS, L_ADAS, IcoADAS), pageId: 'di-capabilities',
    desc: 'Explaining what assisted driving is doing ahead. Exploratory.' },
];

export function DIIntroduction({ onNavigate }) {
  return (
    <div className="page">
      <h1>Driving Intelligence</h1>
      <PageActions />
      <DraftBanner onNavigate={onNavigate} />
      <p className="quick-answer">
        Driving Intelligence (DI) is the driving specialist behind a carmaker's assistant: it predicts where a drive is going,
        watches the road ahead, answers navigation questions, and returns one structured answer with its reason, which your
        assistant and screen turn into words and pixels.
      </p>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '0 0 24px' }}>
        <NavButton onNavigate={onNavigate} pageId="di-quickstart" primary>Getting started</NavButton>
        <NavButton onNavigate={onNavigate} pageId="di-use-cases">See the use cases</NavButton>
        <DownloadAIContextBtn />
      </div>

      <ApiLinks onNavigate={onNavigate} title="Products DI builds on" items={[
        { type: 'Android SDK', name: 'Maps & Navigation SDK', description: 'The DI SDK depends on its navigation module and map data. Version to be defined (DI-G3).', pageId: 'navsdk-intro', productId: 'navsdk' },
        { type: 'Android SDK', name: 'Virtual Horizon', description: 'Reports events about 10 km ahead; DI looks further and decides what is worth saying.', pageId: 'navsdk-horizon', productId: 'navsdk' },
        { type: 'REST API', name: 'Routing API', description: 'Used when there is no NavSDK in the car. That path is still open (DI-G10).', pageId: 'routing-api-intro', productId: 'routing-api' },
        { type: 'UX Library', name: 'UX Library', description: 'Components the use cases are drawn with. Drawing DI\'s moments with them is a proposal (DI-G36).', pageId: 'overview', productId: 'ux-library' },
      ]} />

      <Section id="when-to-choose" title="When to choose DI">
        <div style={grid(220)}>
          <WhenCard title="One answer, said in a sentence">
            Your assistant gets the recommendation, its reason and the option it beat, not a list to rank. Ask the Search API for chargers and you get a list; ask DI and you get the one to use.
          </WhenCard>
          <WhenCard title="Alerts with nothing entered">
            DI predicts where the drive is going and watches the road, so it can speak up on drives where nobody set a route.
          </WhenCard>
          <WhenCard title="Stops that work on arrival">
            Opening hours, charge and traffic are checked against the arrival time, whoever found the place.
          </WhenCard>
          <WhenCard title="Your assistant, your screen">
            DI never talks to the driver. Your assistant owns the voice and the conversation; DI is one tool it calls for anything about the drive.
          </WhenCard>
          <WhenCard type="warn" title="You still draw the moment">
            DI sends data, never pixels or prose. Draw it with your own components or with the{' '}
            <DocLink pageId="overview" productId="ux-library" onNavigate={onNavigate}>UX Library</DocLink>, and let your assistant write the words.
          </WhenCard>
          <WhenCard type="warn" title="Proactive needs the car">
            Prediction and free-drive alerts need the DI SDK with the{' '}
            <DocLink pageId="navsdk-intro" productId="navsdk" onNavigate={onNavigate}>Maps & Navigation SDK</DocLink>, or your own prediction. See{' '}
            <DocLink pageId="di-integration-paths" onNavigate={onNavigate}>Integration paths</DocLink>.
          </WhenCard>
        </div>
        <Gap id="DI-G25">Approved intended-use statement. DI is not a safety system; wording for safety-relevant moments needs sign-off.</Gap>
      </Section>

      <Section id="use-cases" title="Key use cases">
        <p className="quick-answer" style={{ marginBottom: 20 }}>
          What DI does on a drive, each drawn with UX Library components. Open a card for the request, the moment DI returns, and how to draw it.
        </p>
        <div style={grid(220)}>
          {DI_MOMENTS.map(m => (
            <UseCaseCard key={m.id} Thumb={momentThumb(m)} group={m.mode} status={m.status} title={m.title} desc={m.summary} pageId={m.pageId} onNavigate={onNavigate} />
          ))}
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.8125rem', marginTop: 12 }}>
          Examples come from the product description and the design direction, and are illustrative. <DocLink pageId="di-use-cases" onNavigate={onNavigate}>All use cases</DocLink>
        </p>
      </Section>

      <Section id="capabilities" title="Capabilities">
        <p className="quick-answer" style={{ marginBottom: 20 }}>Five parts, one product. The status shows what partners can use today and what is coming.</p>
        <div style={grid(220)}>
          {CAPABILITY_CARDS.map(c => (
            <UseCaseCard key={c.part} Thumb={c.Thumb} group="Capability" status={c.status} title={c.part} desc={c.desc} pageId={c.pageId} onNavigate={onNavigate} />
          ))}
        </div>
        <p style={{ marginTop: 12 }}><DocLink pageId="di-capabilities" onNavigate={onNavigate}>See every capability and where it runs</DocLink></p>
      </Section>

      <Section id="architecture" title="Architecture">
        <p>DI is a cloud API and a thin in-car SDK. The API does the reasoning and everything reactive. The SDK runs in the car: it collects context, runs the driver model, and lets DI speak up unprompted.</p>
        <Figure title="Where DI sits" status="Direction"
          caption="Your assistant owns the driver and the screen; DI sits behind it and returns one structured answer. Which capabilities run in the SDK or the cloud is still open (DI-G9), and so are platforms beyond Android (DI-G22).">
          <LayerDiagram label="Driving Intelligence architecture: the driver talks to the carmaker's assistant and app, which call the DI SDK in the car, which works with the Maps and Navigation SDK and calls the DI API in the TomTom cloud, which uses TomTom engines." layers={[
            { label: 'Driver', boxes: [{ label: 'Driver', sub: 'Talks, taps, drives', tone: 'person' }], link: 'Voice and taps' },
            { label: 'Your side', owner: 'Carmaker', boxes: [
              { label: 'Assistant', sub: 'Voice, conversation, wording', tone: 'partner' },
              { label: 'App and screen', sub: 'Where a moment goes, how it looks', tone: 'partner' },
            ], link: 'Requests in; answers and moments out' },
            { label: 'In the car', owner: 'TomTom SDKs', boxes: [
              { label: 'DI SDK', sub: 'Context, driver model, the service your assistant binds to', tone: 'tomtom' },
              { label: 'Maps & Navigation SDK', sub: 'Position, route, events ahead', tone: 'external' },
            ], link: 'Car context in; structured answers out' },
            { label: 'TomTom cloud', owner: 'TomTom', boxes: [
              { label: 'DI API', sub: 'Decides what is worth saying, combines engines', tone: 'tomtom' },
              { label: 'TomTom engines', sub: 'Routing, traffic, search, EV, maps', tone: 'external' },
            ] },
          ]} />
        </Figure>
        <Table head={['Part', 'Owns']} rows={[
          ['Your assistant (orchestrator)', 'Voice, dialogue, wording, the person. Calls DI and decides what to say.'],
          ['Your application', 'Embeds and configures the DI SDK; supplies profile, saved places, recent destinations, preferences and consent.'],
          ['DI SDK (Android)', 'Subscribes to NavSDK, assembles context, runs the on-device driver model, exposes the service your assistant binds to.'],
          ['DI API (cloud)', 'Reasons over context and TomTom map, traffic, EV, hazard and place data; decides whether anything is worth saying.'],
          ['Maps & Navigation SDK', 'Positioning, map matching, routing, guidance, events along the route. No DI-specific logic.'],
        ]} />
        <Direction>The split above comes from the technical direction draft. The DI SDK is described as Android only and dependent on NavSDK.</Direction>
        <Gap id="DI-G22">Platforms other than Android.</Gap>
      </Section>

      <Section id="editions" title="Editions">
        <p>Availability by edition. Prices are not part of these docs.</p>
        <Table head={['Capability', 'Free', 'Plus']} rows={[
          ['Predict trip', 'Yes', 'Yes'],
          ['Suggest a favourite', 'Yes', 'Yes'],
          ['Alerts on an entered route', 'Yes', 'Yes'],
          ['Alerts on the predicted route, with nothing entered', '—', 'Yes'],
          ['Today against your usual, and a route that still gets you there on time', '—', 'Yes'],
          ['Hazards and closures on the predicted route, with a better way', '—', 'Yes'],
          ['Recommend and explain', '—', 'Yes'],
          ['Road questions', 'Up to a request limit, first result', 'No request limit'],
        ]} />
        <Direction>Free requires a TomTom navigation licence. A third edition, Premium, is still open.</Direction>
        <Gap id="DI-G14">The Free request limit and any rate limits.</Gap>
        <Gap id="DI-G21">Final edition names and Premium contents.</Gap>
      </Section>

      <Section id="status" title="Status and versions">
        <p>Reactive answers are available to <strong>early-access</strong> partners. Proactive moments, and the driver's places, are in <strong>Alpha</strong>. Road knowledge is planned, and the car explaining itself comes later. Nothing is generally available yet, and there is no version number.</p>
        <Gap id="DI-G15">How DI and its response schema are versioned, and where changes are announced.</Gap>
        <Gap id="DI-G24">Markets where DI is available.</Gap>
      </Section>

      <Section id="base-url-auth" title="Base URL and authentication">
        <Table head={['', '']} rows={[
          ['Base URL', <Gap id="DI-G2">Base URL and operations.</Gap>],
          ['Authentication', <Gap id="DI-G1">How partners authenticate and get keys.</Gap>],
          ['SDK package', <Gap id="DI-G3">Package coordinates and supported NavSDK versions.</Gap>],
          ['Status', 'Alpha'],
        ]} />
      </Section>
    </div>
  );
}

/* ─── Use-case landing ─────────────────────────────────────────────────────── */

export function DIUseCases({ onNavigate }) {
  return (
    <div className="page">
      <h1>Use cases</h1>
      <PageActions />
      <DraftBanner onNavigate={onNavigate} />
      <p className="quick-answer">
        Six things DI does on a drive, each worked through the same way: what the driver says, what your assistant sends,
        the moment DI returns, and how to draw it with UX Library components.
      </p>
      <Proposal>
        <p style={{ margin: 0 }}>The moments on these pages use the design direction's proposed fields, and the drawings use UX Library components. Both are illustrative: there is no moment schema yet, and drawing moments with UX Library components is a proposal.</p>
      </Proposal>

      <Section id="all" title="Use cases">
        <div style={grid(220)}>
          {DI_MOMENTS.map(m => (
            <UseCaseCard key={m.id} Thumb={momentThumb(m)} group={m.mode} status={m.status} title={m.title} desc={m.summary} pageId={m.pageId} onNavigate={onNavigate} />
          ))}
        </div>
      </Section>

      <Section id="recipe" title="How each use case is built">
        <Table head={['Step', 'What the page shows']} rows={[
          ['In the driver\'s words', 'The request, or the line the moment becomes, and the situation.'],
          ['What your assistant sends', 'The request text for a reactive answer. Nothing for a proactive moment: the road starts it.'],
          ['What DI returns', 'The moment as illustrative JSON, and the same answer in the product description\'s terms.'],
          ['Draw it', 'The moment on each surface, with the fields that surface uses and the UX Library component behind it.'],
          ['What DI checks', 'The common-sense checks behind the answer.'],
        ]} />
      </Section>

      <Section id="related" title="Related">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <RelatedChip label="Reactive and proactive flows" pageId="di-flows" onNavigate={onNavigate} />
          <RelatedChip label="Response contract" pageId="di-response-contract" onNavigate={onNavigate} />
          <RelatedChip label="Designing with DI" pageId="di-designing" onNavigate={onNavigate} />
          <RelatedChip label="Integration paths" pageId="di-integration-paths" onNavigate={onNavigate} />
        </div>
      </Section>
    </div>
  );
}

/* ─── One use case (data-driven from moments-driving-intelligence.js) ─────────── */

export function DIUseCasePage({ id, onNavigate }) {
  const m = diMoment(id);
  const i = DI_MOMENTS.indexOf(m);
  const prev = DI_MOMENTS[(i + DI_MOMENTS.length - 1) % DI_MOMENTS.length];
  const next = DI_MOMENTS[(i + 1) % DI_MOMENTS.length];
  const reactive = m.moment.trigger === 'request';
  return (
    <div className="page">
      <h1>{m.title}</h1>
      <PageActions />
      <DraftBanner onNavigate={onNavigate} />
      <p className="quick-answer">{m.summary}</p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '-6px 0 20px' }}>
        <Status s={m.mode} /><Status s={m.status} /><Status s="Illustrative" />
      </div>

      <ApiLinks onNavigate={onNavigate} title="What this use case runs on" items={USE_CASE_LINKS[m.id]} />

      <Section id="driver" title="In the driver's words">
        <blockquote style={{ margin: '0 0 12px', padding: '14px 18px', borderLeft: `3px solid ${ROUTE_RED}`, background: 'var(--s1)', borderRadius: 10, fontSize: '1.125rem', lineHeight: 1.45, color: 'var(--black)' }}>
          “{reactive ? m.sends : m.copy.voice}”
        </blockquote>
        <p>{reactive ? 'The driver asks your assistant. ' : 'Nobody asked; your assistant says this. '}{m.scenario}</p>
        <p style={{ color: 'var(--muted)', fontSize: '0.8125rem' }}>Source: {m.source}. Illustrative.</p>
      </Section>

      <Section id="request" title="What your assistant sends">
        {reactive ? (
          <>
            <p>Your assistant handles speech and dialogue, resolves references such as "the second one", and passes DI a clean request:</p>
            <CodeBlock label="Illustrative request text" code={m.sends} language="bash" />
            <p>Partners that won't send words can send structured places plus conditions instead, such as open on arrival, charge or a time window.</p>
            <Gap id="DI-G7">Request format: natural-language text, structured places and conditions, or both.</Gap>
          </>
        ) : (
          <>
            <p>Nothing. The road starts this moment. While the car drives, the DI SDK, or your system, checks with DI on a schedule, and most checks come back with nothing worth saying.</p>
            <Proposal>
              <p style={{ margin: 0 }}>DI is the trigger for your assistant: the moment arrives with <code>trigger: "road"</code>, and DI has already decided it is worth an interruption.</p>
            </Proposal>
            <Gap id="DI-G12">How the moment reaches your assistant: a scheduled check first, DI pushing later.</Gap>
          </>
        )}
      </Section>

      <Section id="moment" title="What DI returns">
        <Proposal>
          <MomentJson moment={m.moment} />
          <p style={{ margin: '10px 0 0', fontSize: '0.8125rem' }}>
            Proposed field names, illustrative values. {m.id === 'faster-way' ? 'This is the design direction\'s own example.' : 'Fields the source example doesn\'t give are left out.'}
          </p>
        </Proposal>
        <p>The same answer in the product description's terms, which apply until the two lists are reconciled:</p>
        <Table head={['Product description', 'In this example']} rows={[
          ...m.pkd,
          ['Urgency', 'No proposed field (DI-G35).'],
        ]} />
        <Gap id="DI-G5">Field names, types and allowed values of the response.</Gap>
      </Section>

      <Section id="draw" title="Draw it">
        <p>Pick a surface. The JSON highlights the fields that surface uses, and the drawing shows them with UX Library components. Your app decides where the moment goes; your assistant writes the words.</p>
        <Proposal>
          <MomentExplorer moment={m} />
          <p style={{ margin: '12px 0 0', fontSize: '0.75rem', color: 'var(--mid)' }}>{ILLUSTRATIVE}</p>
        </Proposal>
        <Gap id="DI-G45">Where DI's moments can appear in an app built on the UX Library, and which UX Library changes that needs.</Gap>
      </Section>

      <Section id="checks" title="What DI checks">
        <ul style={{ paddingLeft: 20, display: 'grid', gap: 4 }}>{m.checks.map(c => <li key={c}>{c}</li>)}</ul>
        <p>See <DocLink pageId="di-concepts" onNavigate={onNavigate}>Planning around time</DocLink> for the checks DI applies to every answer.</p>
      </Section>

      <div className="zone">
        <h2 className="sh" id="related">Related</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <RelatedChip label={reactive ? 'Reactive flow' : 'Proactive flow'} pageId="di-flows" onNavigate={onNavigate} />
          <RelatedChip label="Response contract" pageId="di-response-contract" onNavigate={onNavigate} />
          <RelatedChip label="Designing with DI" pageId="di-designing" onNavigate={onNavigate} />
          <RelatedChip label={`Previous: ${prev.title}`} pageId={prev.pageId} onNavigate={onNavigate} />
          <RelatedChip label={`Next: ${next.title}`} pageId={next.pageId} onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}
