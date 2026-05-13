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

import { useState, useContext, createContext } from 'react';
import Callout from '../components/ui/Callout';
import { ParamRow } from '../components/ui/ApiRefTwoCol';
import CodeBlock from '../components/ui/CodeBlock';

// ─────────────────────────────────────────────────────────────────────────────
// DECISION MODE CONTEXT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * DecisionContext — shared state for the keep / merge / erase audit mode.
 * Provided by UIComponentGallery; consumed by GallerySection and Row.
 */
const DecisionContext = createContext(null);

/**
 * SectionContext — provides the current section title to Row components
 * so they can build scoped decision keys ("SectionTitle::RowLabel").
 */
const SectionContext = createContext(null);

const DECISION_CYCLE = ['undecided', 'keep', 'merge', 'erase'];

const DECISION_STYLE = {
  undecided: { bg: 'transparent',  border: 'var(--border)',  dot: '#d1d5db', label: '?',        text: 'undecided', color: '#9ca3af' },
  keep:      { bg: '#f0fdf4',      border: '#86efac',        dot: '#22c55e', label: '✓',        text: 'keep',      color: '#166534' },
  merge:     { bg: '#fffbeb',      border: '#fcd34d',        dot: '#f59e0b', label: '⇒',       text: 'merge',     color: '#92400e' },
  erase:     { bg: '#fef2f2',      border: '#fca5a5',        dot: '#ef4444', label: '✕',        text: 'erase',     color: '#991b1b' },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * usage = array of { n: string, f: number, t?: 'missing'|'ghost'|'wrong', fix?: string }
 *   n   = class name or component name
 *   f   = number of real-app files (excluding UIComponentGallery)
 *   t   = issue type:
 *           'missing' → not defined in CSS or app at all
 *           'ghost'   → defined in CSS but never applied as className
 *           'wrong'   → gallery name differs from actual code; supply `fix`
 *   fix = the correct class name when t='wrong'
 */
function UsageBar({ usage }) {
  if (!usage?.length) return null;

  const dot = (f, t) => {
    if (t === 'missing') return '#ef4444'; // red
    if (t === 'ghost')   return '#f59e0b'; // amber
    if (t === 'wrong')   return '#f97316'; // orange
    if (f === 0)         return '#ef4444';
    if (f === 1)         return '#f97316';
    if (f <= 4)          return '#eab308';
    return '#22c55e'; // green
  };

  const label = (f, t) => {
    if (t === 'missing') return 'not in CSS';
    if (t === 'ghost')   return 'CSS · never applied';
    if (t === 'wrong')   return '⚠ wrong name';
    return `${f} file${f !== 1 ? 's' : ''}`;
  };

  const usagePills    = usage.filter(u => u.t !== 'playbook');
  const playbookPills = usage.filter(u => u.t === 'playbook');

  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      {/* ── usage row ── */}
      {usagePills.length > 0 && (
        <div style={{
          padding: '8px 20px 9px',
          background: 'var(--s1)',
          display: 'flex', flexWrap: 'wrap', gap: 5, alignItems: 'center',
          borderBottom: playbookPills.length ? '1px solid var(--border)' : 'none',
        }}>
          <span style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginRight: 4, flexShrink: 0 }}>usage</span>
          {usagePills.map(({ n, f, t, fix }) => {
            const color = dot(f, t);
            return (
              <span key={n} title={fix ? `Fix: ${fix}` : undefined} style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontSize: '0.6rem', fontFamily: 'var(--font-mono)',
                padding: '2px 7px 2px 5px', borderRadius: 99,
                border: `1px solid ${color}55`,
                background: `${color}22`,
                color: 'var(--black)',
                cursor: fix ? 'help' : 'default',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
                {n}
                <span style={{ color, fontWeight: 700, fontSize: '0.58rem' }}>{label(f, t)}</span>
                {fix && <span style={{ color: '#f97316', fontSize: '0.55rem' }}>→ {fix}</span>}
              </span>
            );
          })}
        </div>
      )}
      {/* ── playbook row ── */}
      {playbookPills.length > 0 && (
        <div style={{
          padding: '7px 20px 8px',
          background: 'var(--s1)',
          borderTop: '1px solid #7c3aed22',
          display: 'flex', flexWrap: 'wrap', gap: 5, alignItems: 'center',
        }}>
          <span style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#a78bfa', marginRight: 4, flexShrink: 0 }}>playbook</span>
          {playbookPills.map(({ n }) => (
            <span key={`pb-${n}`} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontSize: '0.6rem', fontFamily: 'var(--font-mono)',
              padding: '2px 7px 2px 5px', borderRadius: 99,
              border: '1px solid #7c3aed66',
              background: '#7c3aed28',
              color: 'var(--black)',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa', flexShrink: 0 }} />
              {n}
              <span style={{ color: '#a78bfa', fontWeight: 700, fontSize: '0.58rem' }}>Playbook</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/** Dark header bar containing title + optional description, then white content */
function GallerySection({ title, desc, usage, children }) {
  const ctx = useContext(DecisionContext);
  const decision    = ctx?.decisions?.[title] ?? { status: 'undecided', mergeInto: '' };
  const ds          = DECISION_STYLE[decision.status] ?? DECISION_STYLE.undecided;
  const isActive    = !!ctx?.active;

  const cycleStatus = () => {
    const next = DECISION_CYCLE[(DECISION_CYCLE.indexOf(decision.status) + 1) % DECISION_CYCLE.length];
    ctx.setDecision(title, { ...decision, status: next });
  };

  // Count how many rows within this section have a non-undecided decision
  const rowDecisionCount = isActive
    ? Object.keys(ctx?.decisions ?? {}).filter(k => k.startsWith(`${title}::`) && (ctx.decisions[k]?.status ?? 'undecided') !== 'undecided').length
    : 0;

  // left-border accent when decision made
  const accentBorder = isActive && decision.status !== 'undecided'
    ? { borderLeft: `4px solid ${ds.dot}` }
    : {};

  return (
    <div style={{
      background: 'var(--white)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      marginBottom: 32,
      overflow: 'hidden',
      transition: 'border-left 0.15s',
      ...accentBorder,
    }}>
      {/* Header */}
      <div style={{
        background: isActive && decision.status !== 'undecided' ? ds.bg : 'var(--bg)',
        padding: '12px 20px',
        borderBottom: usage?.length ? 'none' : '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        transition: 'background 0.15s',
      }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--black)', flex: 1, minWidth: 0 }}>{title}</span>
        {desc && !isActive && (
          <>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>·</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)', flex: 1, minWidth: 0 }}>{desc}</span>
          </>
        )}

        {/* ── Decision badge (visible only in decision mode) ── */}
        {isActive && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto', flexShrink: 0 }}>
            {/* Row decision count indicator */}
            {rowDecisionCount > 0 && (
              <span style={{
                fontSize: '0.55rem', fontWeight: 700, color: '#6366f1',
                background: '#eef2ff', border: '1px solid #c7d2fe',
                padding: '2px 7px', borderRadius: 99,
                fontFamily: 'var(--font-mono)',
              }}>
                {rowDecisionCount} row{rowDecisionCount !== 1 ? 's' : ''} marked
              </span>
            )}
            {decision.status === 'merge' && (
              <input
                value={decision.mergeInto || ''}
                onChange={e => ctx.setDecision(title, { ...decision, mergeInto: e.target.value })}
                onClick={e => e.stopPropagation()}
                placeholder="merge into…"
                style={{
                  fontSize: '0.625rem', padding: '3px 8px', borderRadius: 6,
                  border: '1px solid #fcd34d', background: '#fffbeb', color: '#92400e',
                  width: 130, outline: 'none', fontFamily: 'var(--font-mono)',
                }}
              />
            )}
            <button
              onClick={cycleStatus}
              title="Section-level: click to cycle undecided → keep → merge → erase"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontSize: '0.65rem', fontWeight: 700, fontFamily: 'var(--font-mono)',
                padding: '3px 10px 3px 7px', borderRadius: 99,
                border: `1px solid ${ds.dot}55`,
                background: decision.status === 'undecided' ? 'var(--border)' : ds.bg,
                color: ds.color, cursor: 'pointer',
                transition: 'all 0.1s',
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: ds.dot, flexShrink: 0 }} />
              {ds.label} {ds.text}
            </button>
          </div>
        )}
      </div>
      <UsageBar usage={usage} />
      {/* Content */}
      <SectionContext.Provider value={{ title }}>
        <div style={{ padding: 20 }}>{children}</div>
      </SectionContext.Provider>
    </div>
  );
}

/** Labelled row — small uppercase label on the left, flex items on the right */
function Row({ label, children, noBorder }) {
  const ctx        = useContext(DecisionContext);
  const sectionCtx = useContext(SectionContext);
  const isActive   = !!ctx?.active && !!sectionCtx?.title;
  const rowKey     = isActive ? `${sectionCtx.title}::${label}` : null;
  const rowDec     = (rowKey && ctx?.decisions?.[rowKey]) || { status: 'undecided' };
  const rds        = DECISION_STYLE[rowDec.status] ?? DECISION_STYLE.undecided;

  const cycleRow = (e) => {
    e.stopPropagation();
    if (!rowKey) return;
    const next = DECISION_CYCLE[(DECISION_CYCLE.indexOf(rowDec.status) + 1) % DECISION_CYCLE.length];
    ctx.setDecision(rowKey, { ...rowDec, status: next });
  };

  // subtle row tint when decided
  const rowTint = isActive && rowDec.status !== 'undecided'
    ? { background: `${rds.dot}09`, borderRadius: 8, margin: '0 -8px', padding: '0 8px' }
    : {};

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 16,
      marginBottom: noBorder ? 0 : 20,
      paddingBottom: noBorder ? 0 : 20,
      borderBottom: noBorder ? 'none' : '1px solid var(--border)',
      ...rowTint,
    }}>
      {/* Left label column — stacks label text + decision badge in decision mode */}
      <div style={{ width: 140, flexShrink: 0, paddingTop: 4 }}>
        <div style={{
          fontSize: '0.6875rem', fontWeight: 700,
          color: isActive && rowDec.status !== 'undecided' ? rds.color : 'var(--muted)',
          textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.4,
          transition: 'color 0.15s',
        }}>
          {label}
        </div>

        {/* Row decision badge — only in decision mode */}
        {isActive && (
          <div style={{ marginTop: 5, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <button
              onClick={cycleRow}
              title="Click to cycle: undecided → keep → merge → erase"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4, alignSelf: 'flex-start',
                fontSize: '0.55rem', fontWeight: 700, fontFamily: 'var(--font-mono)',
                padding: '2px 7px 2px 5px', borderRadius: 99,
                border: `1px solid ${rds.dot}66`,
                background: rowDec.status === 'undecided' ? '#f3f4f6' : rds.bg,
                color: rds.color, cursor: 'pointer', whiteSpace: 'nowrap',
                transition: 'all 0.1s',
              }}
            >
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: rds.dot, flexShrink: 0 }} />
              {rds.label} {rds.text}
            </button>
            {rowDec.status === 'merge' && (
              <input
                value={rowDec.mergeInto || ''}
                onChange={e => ctx.setDecision(rowKey, { ...rowDec, mergeInto: e.target.value })}
                onClick={e => e.stopPropagation()}
                placeholder="into…"
                style={{
                  fontSize: '0.55rem', padding: '2px 6px', borderRadius: 5, width: 120,
                  border: '1px solid #fcd34d', background: '#fffbeb', color: '#92400e',
                  outline: 'none', fontFamily: 'var(--font-mono)',
                }}
              />
            )}
          </div>
        )}
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
    <GallerySection title="Design Tokens" desc="CSS variables from :root in index.css"
      usage={[
        { n: 'var(--border)', f: 89 },
        { n: 'var(--bg)', f: 75 },
        { n: 'var(--muted)', f: 74 },
        { n: 'var(--black)', f: 65 },
        { n: 'var(--red)', f: 38 },
        { n: 'var(--font-mono)', f: 20 },
        { n: 'var(--white)', f: 16 },
        { n: 'var(--font-display)', f: 2 },
        { n: 'var(--brand)', f: 1 },
        { n: 'var(--s0/s1/s2)', f: 0, t: 'ghost' },
        { n: 'var(--b-med/b-hi)', f: 0, t: 'ghost' },
        { n: 'var(--t-hi)', f: 0, t: 'ghost' },
      ]}>

      {/* 1a. Color palette */}
      <Row label="Surfaces">
        {SURFACE_TOKENS.map(t => (
          <ColorSwatch key={t.var} hex={t.hex} varName={t.var} />
        ))}
      </Row>

      <Row label="Text">
        {TEXT_TOKENS.map(t => (
          <ColorSwatch key={t.var} hex={t.hex} varName={t.var} />
        ))}
      </Row>

      <Row label="Semantic">
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
      <Row label="Radius">
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
      <Row label="Elevation" noBorder={false}>
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
      <Row label="Typography" noBorder>
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
    <GallerySection title="Buttons" desc="All button variants with default / hover / active / disabled states"
      usage={[
        { n: '.page-action-btn', f: 17 },
        { n: '.nav-expand-btn', f: 1 },
        { n: '.btn-primary', f: 0, t: 'missing' },
        { n: '.btn-secondary', f: 0, t: 'missing' },
        { n: '.btn-ghost', f: 0, t: 'missing' },
        { n: '.btn-danger', f: 0, t: 'missing' },
        { n: 'Button', t: 'playbook' },
      ]}>

      {/* 2a. Page action buttons */}
      <Row label="Page action">
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
      <Row label="Primary brand">
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
      <Row label="Secondary">
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
      <Row label="Tab bar">
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
      <Row label="Icon button" noBorder>
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
    <GallerySection title="Badges & Tags" desc="HTTP method tags, version badges, meta tags, value pills, status chips"
      usage={[
        { n: '.http-tag', f: 7 },
        { n: '.meta-tag', f: 7 },
        { n: '.method-tag', f: 0, t: 'wrong', fix: '.http-tag' },
        { n: '.http-get', f: 0, t: 'wrong', fix: '.http-tag-get' },
        { n: '.http-post', f: 0, t: 'wrong', fix: '.http-tag-post' },
        { n: '.version-badge', f: 0, t: 'missing' },
        { n: '.ref-badge', f: 0, t: 'missing' },
        { n: '.value-pill', f: 0, t: 'missing' },
        { n: '.chip', f: 0, t: 'missing' },
        { n: '.draft-chip', f: 0, t: 'missing' },
        { n: 'Tag', t: 'playbook' },
        { n: 'StatusTag', t: 'playbook' },
        { n: 'Chip', t: 'playbook' },
        { n: 'ChipGroup', t: 'playbook' },
        { n: 'ChipGroupToggle', t: 'playbook' },
      ]}>

      {/* 3a. HTTP method badges — CSS classes */}
      <Row label="HTTP classes">
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
      <Row label="METHOD_STYLES inline">
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
      <Row label="Version badges">
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
      <Row label="REF chip">
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
      <Row label="Meta tags">
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
      <Row label="Value pills">
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
      <Row label="Tinted chips">
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
      <Row label="Draft / warning chip" noBorder>
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
    <GallerySection title="Callouts" desc="All 4 Callout variants with realistic content"
      usage={[
        { n: 'Callout', f: 74 },
        { n: 'Alert', t: 'playbook' },
      ]}>
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
    <GallerySection title="Code Blocks" desc="Single-label, multi-tab, and copied state"
      usage={[
        { n: 'CodeBlock', f: 45 },
        { n: '.cb-pre', f: 3 },
        { n: '.cb-line', f: 4 },
      ]}>

      <Row label="Single label">
        <div style={{ flex: 1, maxWidth: 700 }}>
          <CodeBlock label="curl · Fuzzy Search">
            {CURL_SNIPPET}
          </CodeBlock>
        </div>
      </Row>

      <Divider />

      <Row label="Multi-tab" noBorder={false}>
        <div style={{ flex: 1, maxWidth: 700 }}>
          <CodeBlock tabs={['REST', 'Kotlin', 'Swift']}>
            {REST_SNIPPET}
            {KOTLIN_SNIPPET}
            {SWIFT_SNIPPET}
          </CodeBlock>
        </div>
      </Row>

      <Divider />

      <Row label="Copied state" noBorder>
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
    <GallerySection title="Param Cards" desc="Required, optional, nested children — all interactive"
      usage={[
        { n: 'ParamRow', f: 55 },
        { n: '.param-row', f: 0, t: 'missing' },
        { n: '.param-name', f: 0, t: 'missing' },
        { n: '.param-type', f: 0, t: 'missing' },
        { n: '.param-req', f: 0, t: 'missing' },
      ]}>

      <Row label="Required param">
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

      <Row label="Optional + values">
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

      <Row label="Nested children" noBorder>
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
    <GallerySection title="Inline Patterns" desc="Recurring inline-style patterns used across API reference and demo pages"
      usage={[
        { n: '.async-status-pill', f: 0, t: 'missing' },
        { n: '.error-code-row', f: 0, t: 'missing' },
        { n: '.version-dot', f: 0, t: 'missing' },
        { n: '.section-meta-header', f: 0, t: 'missing' },
      ]}>

      {/* 7a. Pill row — async polling states */}
      <Row label="Async polling pills">
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
      <Row label="Error code rows">
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
      <Row label="Section header">
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
      <Row label="Inline version dot" noBorder>
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
    <GallerySection title="Forms & Inputs" desc="Text input, textarea, range slider — all interactive states"
      usage={[
        { n: '.tt-input', f: 0, t: 'missing' },
        { n: '.tt-input-wrap', f: 0, t: 'missing' },
        { n: '.tt-input-label', f: 0, t: 'missing' },
        { n: '.tt-input-error', f: 0, t: 'missing' },
        { n: '.tt-textarea', f: 0, t: 'missing' },
        { n: '.tt-range', f: 0, t: 'missing' },
        { n: 'Input', t: 'playbook' },
        { n: 'Textarea', t: 'playbook' },
        { n: 'Slider', t: 'playbook' },
        { n: 'FormControl', t: 'playbook' },
        { n: 'FieldLabel', t: 'playbook' },
        { n: 'FieldCaption', t: 'playbook' },
        { n: 'Checkbox', t: 'playbook' },
        { n: 'Switch', t: 'playbook' },
        { n: 'Dropdown', t: 'playbook' },
        { n: 'FileInput', t: 'playbook' },
      ]}>

      {/* 8a. Text input */}
      <Row label="Text input">
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
      <Row label="Textarea">
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
      <Row label="Range slider" noBorder>
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
    <GallerySection title="Steps" desc=".steps / .step / .step-num pattern"
      usage={[
        { n: '.steps', f: 0, t: 'ghost' },
        { n: '.step', f: 0, t: 'ghost' },
        { n: '.step-num', f: 0, t: 'ghost' },
        { n: 'Stepper', t: 'playbook' },
        { n: 'StepMenu', t: 'playbook' },
        { n: 'StepsMenu', t: 'playbook' },
      ]}>
      <Row label="Steps" noBorder>
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
    <GallerySection title="Scenario Cards" desc=".scenario-grid with .use and .avoid variants"
      usage={[
        { n: '.scenario-card', f: 1 },
        { n: '.scenario-grid', f: 0, t: 'missing' },
        { n: '.scenario-card--use', f: 0, t: 'wrong', fix: '.scenario-card.use' },
        { n: '.scenario-card--avoid', f: 0, t: 'wrong', fix: '.scenario-card.avoid' },
      ]}>
      <Row label="Use / Avoid" noBorder>
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
    <GallerySection title="Tables" desc=".prop-table with .prop-req and .prop-opt labels, hover state"
      usage={[
        { n: '.prop-table', f: 45 },
        { n: '.prop-req', f: 0, t: 'ghost' },
        { n: '.prop-opt', f: 0, t: 'ghost' },
        { n: 'Table', t: 'playbook' },
      ]}>
      <Row label="Prop table" noBorder>
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
    <GallerySection title="Status States" desc="Loading / result states used across demo panels and async operations"
      usage={[
        { n: '.status-idle', f: 0, t: 'missing' },
        { n: '.status-loading', f: 0, t: 'missing' },
        { n: '.status-success', f: 0, t: 'missing' },
        { n: '.status-error', f: 0, t: 'missing' },
        { n: '.spinner', f: 0, t: 'missing' },
        { n: 'Spinner', t: 'playbook' },
        { n: 'AnimatedLoadingBar', t: 'playbook' },
        { n: 'AnimatedLoadingSpinner', t: 'playbook' },
      ]}>

      <Row label="Response states" noBorder>
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
    <GallerySection title="Navigation Cards" desc=".nav-card, .example-card — illustrated destination cards"
      usage={[
        { n: '.nav-card', f: 12 },
        { n: '.nav-card-body', f: 11 },
        { n: '.example-card', f: 1 },
        { n: '.nav-card-title', f: 0, t: 'missing' },
        { n: 'ContentCard', t: 'playbook' },
        { n: 'SearchCard', t: 'playbook' },
      ]}>
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
    <GallerySection title="Domain Cards" desc=".domain-card — product/domain landing destination cards"
      usage={[
        { n: '.domain-card', f: 1 },
        { n: '.domain-card-title', f: 1 },
        { n: '.domain-card-icon', f: 0, t: 'wrong', fix: '.domain-card-illo' },
        { n: 'Card', t: 'playbook' },
        { n: 'ComplexCard', t: 'playbook' },
      ]}>
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
    <GallerySection title="ApiLinks + ApiRef chip" desc=".api-links-block, .api-links-card, .api-ref-chip"
      usage={[
        { n: '.api-links-block', f: 1 },
        { n: '.api-links-card', f: 1 },
        { n: '.api-ref-chip', f: 1 },
      ]}>
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
    <GallerySection title="Private Preview Banner" desc=".ppb-root — shown at top of private-preview API pages"
      usage={[
        { n: 'PrivatePreviewBanner', f: 6 },
        { n: '.ppb-root', f: 1 },
        { n: '.ppb-title', f: 1 },
        { n: '.ppb-body', f: 1 },
        { n: '.ppb-badge', f: 0, t: 'wrong', fix: '.ppb-icon' },
      ]}>
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
    <GallerySection title="Benefit Cards" desc=".benefit-grid, .benefit-card — 2-col feature highlights"
      usage={[
        { n: '.benefit-card', f: 1 },
        { n: '.benefit-grid', f: 1 },
        { n: '.benefit-card-icon', f: 0, t: 'missing' },
        { n: '.benefit-card-title', f: 0, t: 'missing' },
        { n: 'Card', t: 'playbook' },
      ]}>
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
    <GallerySection title="Page Anatomy Shell" desc=".page-header, .quick-answer, .zone, .page-related, .feedback-strip"
      usage={[
        { n: '.page-header', f: 90 },
        { n: '.quick-answer', f: 86 },
        { n: '.zone', f: 84 },
        { n: '.sh', f: 87 },
        { n: '.feedback-strip', f: 17 },
        { n: '.page-related', f: 8 },
      ]}>

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
    <GallerySection title="Token Naming Anatomy" desc=".tna-* — colour-coded token name breakdown"
      usage={[
        { n: '.tna-tier', f: 1 },
        { n: '.tna-variant', f: 1 },
        { n: '.tna-root', f: 0, t: 'ghost' },
        { n: '.tna-role', f: 0, t: 'ghost' },
      ]}>
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
    <GallerySection title="Theming Card" desc=".tm-card, .tm-bar, .tm-btns, .tm-btn-primary, .tm-btn-secondary"
      usage={[
        { n: '.tm-card', f: 1 },
        { n: '.tm-bar', f: 1 },
        { n: '.tm-btns', f: 1 },
        { n: '.tm-btn-primary', f: 1 },
        { n: '.tm-btn-secondary', f: 1 },
      ]}>
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
    <GallerySection title="Spec Method Table" desc=".smt-row, .smt-val, .smt-ctx, .smt-highlight — enumerated values table"
      usage={[
        { n: '.smt-row', f: 1 },
        { n: '.smt-val', f: 1 },
        { n: '.smt-ctx', f: 1 },
        { n: '.smt-highlight', f: 1 },
      ]}>
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
    <GallerySection title="ApiRef Two-Column Layout" desc=".api-ref-sections, .api-ref-section-left/right/code/header — every API reference page frame"
      usage={[
        { n: 'ApiRefTwoCol', f: 55 },
        { n: '.api-ref-sections', f: 1 },
        { n: '.api-ref-section-left', f: 1 },
        { n: '.api-ref-section-right', f: 1 },
        { n: '.api-ref-section-code', f: 1 },
        { n: '.api-ref-section-header', f: 1 },
      ]}>
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
  const CC = '#D4D4D4'; // CONNECTOR_COLOR matching Sidenav.jsx

  /* Exact connector components from Sidenav.jsx */
  const CornerConnector = () => (
    <div style={{ width: 16, alignSelf: 'stretch', flexShrink: 0, position: 'relative' }}>
      <div style={{
        position: 'absolute', left: 7, top: 0,
        width: 9, height: 'calc(50% + 1px)',
        borderLeft: `1.5px solid ${CC}`,
        borderBottom: `1.5px solid ${CC}`,
        borderBottomLeftRadius: 6,
      }} />
    </div>
  );
  const TeeConnector = () => (
    <div style={{ width: 16, alignSelf: 'stretch', flexShrink: 0, position: 'relative' }}>
      <div style={{ position: 'absolute', left: 7, top: 0, bottom: 0, width: 1.5, background: CC }} />
      <div style={{ position: 'absolute', left: 7, top: '50%', right: 0, height: 1.5, background: CC, transform: 'translateY(-50%)' }} />
    </div>
  );
  const ChevronDown = ({ open }) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
      style={{ flexShrink: 0, transition: 'transform 0.15s', transform: open ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
      <path fillRule="evenodd" clipRule="evenodd"
        d="M7.9999 11.1011L3.41064 6.51189L4.58916 5.33337L7.9999 8.74412L11.4106 5.33337L12.5892 6.51189L7.9999 11.1011Z"
        fill="#5C5C5C"/>
    </svg>
  );
  const RefPill = () => (
    <span style={{
      fontSize: '0.5rem', fontWeight: 700, padding: '1px 5px', borderRadius: 3,
      background: 'var(--info-bg)', color: 'var(--info-text)',
      fontFamily: 'monospace', letterSpacing: '0.04em', flexShrink: 0, marginRight: 4,
    }}>REF</span>
  );
  const MethodPill = ({ m }) => {
    const MAP = { GET: ['var(--info-bg)', 'var(--info-text)'], POST: ['var(--success-bg)', 'var(--success-text)'] };
    const [bg, color] = MAP[m] || MAP.GET;
    return (
      <span style={{
        fontSize: '0.5rem', fontWeight: 700, padding: '2px 5px', borderRadius: 3,
        background: bg, color, fontFamily: 'monospace', letterSpacing: '0.05em', flexShrink: 0,
      }}>{m}</span>
    );
  };

  const SectionLabel = ({ label }) => (
    <div style={{ padding: '16px 10px 4px', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)', userSelect: 'none' }}>
      {label}
    </div>
  );

  const NavFrame = ({ children }) => (
    <div style={{ width: 220, background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', padding: '4px 0 8px' }}>
      {children}
    </div>
  );

  return (
    <GallerySection title="Sidenav Anatomy" desc=".sidenav-group · .sidenav-label · .sidenav-item · .sidenav-top-link · .sidenav-anchor-item — two nav patterns + tree connectors"
      usage={[
        { n: '.sidenav', f: 3 },
        { n: '.sidenav-item', f: 2 },
        { n: '.sidenav-group', f: 1 },
        { n: '.sidenav-label', f: 1 },
        { n: '.sidenav-items', f: 1 },
        { n: '.sidenav-top-link', f: 1 },
        { n: '.sidenav-anchor-item', f: 0, t: 'ghost' },
        { n: '.sidenav-anchor-rail', f: 0, t: 'ghost' },
        { n: '.sidenav-anchor-label', f: 0, t: 'ghost' },
        { n: 'Sidebar', t: 'playbook' },
      ]}>

      {/* ── 1. sidenav-top-link (the pattern shown in the screenshot) ── */}
      <Row label="sidenav-top-link — top-level entries (type:'top') with REF badge + anchor expansion">
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>

          {/* Default top-link */}
          <div>
            <StateLabel>default</StateLabel>
            <NavFrame>
              <span className="sidenav-top-link" style={{ cursor: 'default', display: 'flex', alignItems: 'center' }}>
                <span style={{ flex: 1 }}>Introduction</span>
              </span>
            </NavFrame>
          </div>

          {/* Active top-link */}
          <div>
            <StateLabel>active (background:var(--s1))</StateLabel>
            <NavFrame>
              <span className="sidenav-top-link active" style={{ cursor: 'default', display: 'flex', alignItems: 'center' }}>
                <span style={{ flex: 1 }}>Introduction</span>
              </span>
            </NavFrame>
          </div>

          {/* top-link with REF badge + chevron — collapsed */}
          <div>
            <StateLabel>with REF badge + chevron — collapsed</StateLabel>
            <NavFrame>
              <span className="sidenav-top-link" style={{ cursor: 'default', display: 'flex', alignItems: 'center' }}>
                <span style={{ flex: 1 }}>Parking Availability</span>
                <RefPill />
                <ChevronDown open={false} />
              </span>
            </NavFrame>
          </div>

          {/* top-link expanded — the screenshot state */}
          <div>
            <StateLabel>expanded — anchors shown below (matches screenshot)</StateLabel>
            <NavFrame>
              <span className="sidenav-top-link" style={{ cursor: 'default', display: 'flex', alignItems: 'center' }}>
                <span style={{ flex: 1 }}>Parking Availability</span>
                <RefPill />
                <ChevronDown open={true} />
              </span>
              {/* AnchorItems rendered as sidenav-items with sidenav-item children */}
              <div className="sidenav-items open">
                <span className="sidenav-item" style={{ cursor: 'default' }}>
                  <TeeConnector />
                  <span className="sidenav-item-label" style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
                    <span style={{ flex: 1 }}>Real-time Availability</span>
                    <MethodPill m="GET" />
                  </span>
                </span>
                <span className="sidenav-item" style={{ cursor: 'default' }}>
                  <TeeConnector />
                  <span className="sidenav-item-label" style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
                    <span style={{ flex: 1 }}>Response</span>
                  </span>
                </span>
                <span className="sidenav-item" style={{ cursor: 'default' }}>
                  <TeeConnector />
                  <span className="sidenav-item-label" style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
                    <span style={{ flex: 1 }}>Nearby Parking Search</span>
                    <MethodPill m="GET" />
                  </span>
                </span>
                <span className="sidenav-item active" style={{ cursor: 'default' }}>
                  <CornerConnector />
                  <span className="sidenav-item-label" style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
                    <span style={{ flex: 1 }}>Response</span>
                  </span>
                </span>
              </div>
            </NavFrame>
          </div>
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: 'var(--muted)' }}>
          Anchors are rendered as <code>.sidenav-item</code> (same class as group items) inside <code>.sidenav-items.open</code>. The last item uses <code>CornerConnector</code>; all others use <code>TeeConnector</code>.
        </div>
      </Row>

      {/* ── 2. sidenav-anchor-item (in-page section nav under a group item) ── */}
      <Row label="sidenav-anchor-item — in-page anchors under a group item (older/secondary pattern)">
        <NavFrame>
          <div className="sidenav-anchors">
            <div className="sidenav-anchor-item" style={{ cursor: 'default' }}>
              <div className="sidenav-anchor-rail" />
              <span className="sidenav-anchor-label">Request</span>
              <MethodPill m="GET" />
            </div>
            <div className="sidenav-anchor-item active" style={{ cursor: 'default' }}>
              <div className="sidenav-anchor-rail" />
              <span className="sidenav-anchor-label">Response</span>
            </div>
          </div>
        </NavFrame>
        <div style={{ marginTop: 8, fontSize: 11, color: 'var(--muted)' }}>
          <code>.sidenav-anchor-item.active</code> → <code>color:var(--red)</code> + bold label. Rail is a 16px spacer.
        </div>
      </Row>

      {/* ── 3. NavGroup with section header ── */}
      <Row label="sidenav-group — collapsible API group + section separator" noBorder>
        <NavFrame>
          {/* Section separator */}
          <SectionLabel label="Endpoints" />

          {/* Group label — open */}
          <div className="sidenav-group">
            <div className="sidenav-label open" style={{ cursor: 'default' }}>
              <span className="sidenav-label-text">Routing API</span>
              <span className="sidenav-chevron-wrap">
                <ChevronDown open={true} />
              </span>
            </div>
            <div className="sidenav-items open">
              <span className="sidenav-item" style={{ cursor: 'default' }}>
                <TeeConnector />
                <span className="sidenav-item-label">Introduction</span>
              </span>
              <span className="sidenav-item active" style={{ cursor: 'default' }}>
                <TeeConnector />
                <span className="sidenav-item-label" style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
                  <span style={{ flex: 1 }}>Calculate Route</span>
                  <ChevronDown open={true} />
                </span>
              </span>
              {/* Sub-anchors with extra indent */}
              <div className="sidenav-items open" style={{ paddingLeft: 24 }}>
                <span className="sidenav-item" style={{ cursor: 'default' }}>
                  <TeeConnector />
                  <span className="sidenav-item-label" style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
                    <span style={{ flex: 1 }}>Calculate Route</span>
                    <MethodPill m="GET" />
                  </span>
                </span>
                <span className="sidenav-item active" style={{ cursor: 'default' }}>
                  <CornerConnector />
                  <span className="sidenav-item-label">Response</span>
                </span>
              </div>
              <span className="sidenav-item" style={{ cursor: 'default' }}>
                <CornerConnector />
                <span className="sidenav-item-label">Batch Route</span>
              </span>
            </div>
          </div>

          {/* Collapsed group */}
          <div className="sidenav-group">
            <div className="sidenav-label" style={{ cursor: 'default' }}>
              <span className="sidenav-label-text">EV Routing</span>
              <span className="sidenav-chevron-wrap"><ChevronDown open={false} /></span>
            </div>
          </div>

          {/* Plumbing divider + top-link */}
          <div className="sidenav-plumbing-divider" />
          <span className="sidenav-top-link" style={{ cursor: 'default', display: 'flex', alignItems: 'center' }}>
            <span style={{ flex: 1 }}>Changelog</span>
          </span>
        </NavFrame>
        <div style={{ marginTop: 8, fontSize: 11, color: 'var(--muted)' }}>
          <code>.sidenav-label.open</code> rotates chevron to 0°. Items use <code>TeeConnector</code> except the last which uses <code>CornerConnector</code>. Active item: <code>background:var(--s1)</code> + bold.
        </div>
      </Row>

    </GallerySection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §24  GLOBAL HEADER + TOPNAV
// ─────────────────────────────────────────────────────────────────────────────

function HeaderNavSection() {
  const [mobileOpen, setMobileOpen] = useState(false);

  /* real TomTom logo SVG — matches App.jsx FixedLogo exactly */
  const TomTomLogo = () => (
    <svg width="100" height="19" viewBox="0 0 125 24" fill="none" aria-hidden="true" style={{ display: 'block' }}>
      <path fillRule="evenodd" clipRule="evenodd" d="M121.444 22.1291H124.999L125 13.0887C125 12.5 124.925 12.0676 124.859 11.7567C124.836 11.6515 124.816 11.5678 124.794 11.4864C124.092 8.90785 121.577 7.123 118.811 7.23655C117.528 7.29129 116.321 7.76661 115.225 8.64915L115.085 8.76169L114.945 8.64915C113.849 7.76661 112.642 7.29129 111.359 7.23655C108.59 7.12114 106.078 8.90785 105.376 11.4864C105.354 11.568 105.334 11.652 105.311 11.7577C105.242 12.0876 105.17 12.5049 105.17 13.0887L105.171 22.1291H108.726V13.242C108.726 11.9833 109.753 10.9593 111.015 10.9593C112.266 10.9593 113.292 11.9744 113.303 13.222C113.304 13.2264 113.304 13.2342 113.304 13.242V22.1291H116.866L116.867 13.2212C116.878 11.9744 117.904 10.9593 119.155 10.9593C120.417 10.9593 121.444 11.9833 121.444 13.242V22.1291Z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M95.1744 18.5808C93.0256 18.5808 91.2773 16.8374 91.2773 14.6945C91.2773 12.5516 93.0256 10.8081 95.1744 10.8081C97.3234 10.8081 99.0716 12.5516 99.0716 14.6945C99.0716 16.8374 97.3234 18.5808 95.1744 18.5808ZM95.1741 7.25977C91.0633 7.25977 87.7188 10.5949 87.7188 14.6944C87.7188 18.794 91.0633 22.1292 95.1741 22.1292C99.285 22.1292 102.629 18.794 102.629 14.6944C102.629 10.5949 99.285 7.25977 95.1741 7.25977Z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M82.9062 22.1324H87.5178L85.4546 18.5805C85.0074 18.58 83.1692 18.5776 83.026 18.5776C81.8791 18.5776 80.8802 17.7512 80.7994 16.7353C80.7887 16.6023 80.7791 16.4376 80.7716 16.2566V10.9014H85.4537L87.2833 7.69089H80.7716V1.86743L77.2102 4.32446V7.52023H74.9629V11.072H77.21L77.2134 15.9215C77.2134 15.9236 77.211 16.1479 77.2144 16.2125L77.228 16.4827C77.3498 18.8376 78.5126 20.5715 80.684 21.6355C81.2652 21.9202 81.908 22.0772 82.7073 22.1294L82.9062 22.1291V22.1324Z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M68.864 22.129H72.4192L72.4198 13.0887C72.4198 12.5 72.3444 12.0676 72.2785 11.7567C72.2556 11.6514 72.2355 11.5677 72.2135 11.4863C71.512 8.90779 68.9973 7.12293 66.2307 7.23648C64.9479 7.29123 63.7413 7.76655 62.6447 8.64909L62.5049 8.76163L62.3651 8.64909C61.2685 7.76655 60.0619 7.29123 58.7788 7.23648C56.01 7.12108 53.4979 8.90779 52.7962 11.4863C52.774 11.5679 52.754 11.6519 52.731 11.7577C52.6613 12.0875 52.5898 12.5049 52.5898 13.0887L52.5905 22.129H56.1459V13.2419C56.1459 11.9833 57.1727 10.9593 58.4348 10.9593C59.6856 10.9593 60.7119 11.9743 60.7229 13.222C60.7233 13.2264 60.7238 13.2342 60.7238 13.2419V22.129H64.2861L64.2869 13.2211C64.2978 11.9743 65.3242 10.9593 66.5749 10.9593C67.8372 10.9593 68.864 11.9833 68.864 13.2419V22.129Z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M42.5944 18.5808C40.4454 18.5808 38.6973 16.8374 38.6973 14.6945C38.6973 12.5516 40.4454 10.8081 42.5944 10.8081C44.7434 10.8081 46.4915 12.5516 46.4915 14.6945C46.4915 16.8374 44.7434 18.5808 42.5944 18.5808ZM42.594 7.25977C38.4831 7.25977 35.1387 10.5949 35.1387 14.6944C35.1387 18.794 38.4831 22.1292 42.594 22.1292C46.7049 22.1292 50.0493 18.794 50.0493 14.6944C50.0493 10.5949 46.7049 7.25977 42.594 7.25977Z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M30.3261 22.1325H34.9378L32.8745 18.5805C32.4273 18.58 30.5891 18.5777 30.4459 18.5777C29.299 18.5777 28.3001 17.7512 28.2193 16.7354C28.2086 16.6024 28.199 16.4376 28.1915 16.2567V10.9014H32.8736L34.7033 7.69095H28.1915V1.86749L24.6301 4.32452V7.52029H22.3828V11.0721H24.6299L24.6333 15.9216C24.6333 15.9236 24.6309 16.148 24.6343 16.2126L24.6479 16.4827C24.7697 18.8377 25.9326 20.5715 28.1039 21.6355C28.6851 21.9203 29.328 22.0772 30.1272 22.1295L30.3261 22.1291V22.1325Z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M8.28764 24.0001L11.4639 18.5139H5.11133L8.28764 24.0001Z" fill="#DF1B12"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M8.28694 12.5839C5.89835 12.5839 3.95522 10.6459 3.95522 8.26409C3.95522 5.88209 5.89835 3.94415 8.28694 3.94415C10.6755 3.94415 12.6187 5.88209 12.6187 8.26409C12.6187 10.6459 10.6755 12.5839 8.28694 12.5839ZM8.28694 0C3.7175 0 0 3.70725 0 8.26409C0 12.8208 3.7175 16.528 8.28694 16.528C12.8564 16.528 16.5739 12.8208 16.5739 8.26409C16.5739 3.70725 12.8564 0 8.28694 0Z" fill="#DF1B12"/>
    </svg>
  );

  /* shared icon helpers */
  const IcoSearch = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
  );
  const IcoWrench = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
  );
  const IcoUser = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  );
  const IcoMenu = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
  );
  const IcoX = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  );

  /* reusable full-bar specimen */
  const BarSpecimen = ({ hiddenState = false, label, extra, children }) => (
    <div style={{ width: '100%' }}>
      {label && <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{label}</div>}
      <div style={{
        position: 'relative', overflow: 'hidden',
        borderRadius: 10, border: '1px solid var(--border)',
        height: hiddenState ? 28 : 'auto',
        background: hiddenState ? 'var(--s1)' : 'transparent',
      }}>
        {hiddenState ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>
            <span style={{ fontSize: '0.7rem', color: 'var(--muted)', fontStyle: 'italic' }}>header translated off-screen — transform:translateY(-100%)</span>
          </div>
        ) : (
          <div className="global-header" style={{ position: 'relative', transform: 'none', height: 52, borderRadius: 10 }}>
            {/* fixed-logo lives in App, replicated here */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              <div style={{ marginRight: 12, cursor: 'default', display: 'flex', alignItems: 'center' }}><TomTomLogo /></div>
              <div className="gh-divider" />
              <div className="gh-left" style={{ marginLeft: 12 }}>
                <span className="gh-product-label">Docs</span>
              </div>
            </div>
            {/* centred nav */}
            <div className="gh-nav" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
              {children}
            </div>
            {/* right cluster */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {extra}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <GallerySection title="Global Header + TopNav" desc=".global-header · .gh-nav · .gh-nav-link · .gh-icon-btn · .gh-signin-btn · .gh-product-label · .gh-divider · .gh-hamburger · .gh-mobile-menu — the fixed top chrome bar and all its states"
      usage={[
        { n: '.global-header', f: 2 },
        { n: '.gh-nav', f: 1 },
        { n: '.gh-nav-link', f: 1 },
        { n: '.gh-icon-btn', f: 1 },
        { n: '.gh-signin-btn', f: 1 },
        { n: '.gh-product-label', f: 1 },
        { n: '.gh-hamburger', f: 1 },
        { n: '.gh-mobile-menu', f: 1 },
        { n: '.fixed-logo', f: 1 },
        { n: '.topnav', f: 1 },
        { n: '.topnav-crumb', f: 1 },
        { n: '.topnav-badge', f: 0, t: 'missing' },
        { n: '.topnav-version', f: 0, t: 'missing' },
        { n: 'Header', t: 'playbook' },
        { n: 'SubHeader', t: 'playbook' },
        { n: 'HeaderMenu', t: 'playbook' },
        { n: 'HeaderMenuButton', t: 'playbook' },
        { n: 'HeaderMenuDropdown', t: 'playbook' },
      ]}>

      {/* ── 1. Full anatomy ── */}
      <Row label="anatomy — all sub-elements labelled">
        <div style={{ width: '100%' }}>
          <BarSpecimen extra={
            <>
              <button className="gh-icon-btn gh-desktop-only" style={{ cursor: 'default' }}><IcoSearch /></button>
              <button className="gh-icon-btn gh-desktop-only" style={{ cursor: 'default' }}><IcoWrench /></button>
              <button className="gh-signin-btn" style={{ cursor: 'default' }}><IcoUser />&nbsp;Sign in</button>
            </>
          }>
            <a className="gh-nav-link" style={{ cursor: 'default' }}>Products</a>
            <a className="gh-nav-link" style={{ cursor: 'default' }}>Resources</a>
            <a className="gh-nav-link" style={{ cursor: 'default' }}>Pricing</a>
          </BarSpecimen>

          {/* anatomy callouts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 8, marginTop: 12 }}>
            {[
              { cls: '.fixed-logo',        note: 'position:fixed in App.jsx — sits above z-index 300' },
              { cls: '.gh-divider',        note: '1px × 18px vertical separator, bg:var(--b-med)' },
              { cls: '.gh-product-label',  note: 'display font 20 px / 700 / black — "Docs"' },
              { cls: '.gh-nav',            note: 'position:absolute; left:50%; translateX(-50%) — always centred' },
              { cls: '.gh-nav-link',       note: 'display font 0.875 rem / 700 · padding 6px 12px · radius 6px' },
              { cls: '.gh-icon-btn',       note: '44×44 px tap target · radius 8px · transparent bg' },
              { cls: '.gh-signin-btn',     note: 'pill shape · border:1.5px var(--b-med) · bg:var(--s1)' },
              { cls: '.gh-hamburger',      note: 'display:none by default; shown via media <900 px' },
            ].map(({ cls, note }) => (
              <div key={cls} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)' }}>
                <code style={{ fontSize: '0.7rem', color: 'var(--brand)', display: 'block', marginBottom: 3 }}>{cls}</code>
                <span style={{ fontSize: '0.72rem', color: 'var(--mid)', lineHeight: 1.4 }}>{note}</span>
              </div>
            ))}
          </div>
        </div>
      </Row>

      {/* ── 2. Visibility states ── */}
      <Row label="global-header visibility states">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          <div>
            <StateLabel>default — visible (isVisible=true)</StateLabel>
            <BarSpecimen extra={
              <>
                <button className="gh-icon-btn gh-desktop-only" style={{ cursor: 'default' }}><IcoSearch /></button>
                <button className="gh-signin-btn" style={{ cursor: 'default' }}><IcoUser />&nbsp;Sign in</button>
              </>
            }>
              <a className="gh-nav-link" style={{ cursor: 'default' }}>Products</a>
              <a className="gh-nav-link" style={{ cursor: 'default' }}>Resources</a>
              <a className="gh-nav-link" style={{ cursor: 'default' }}>Pricing</a>
            </BarSpecimen>
          </div>
          <div>
            <StateLabel>hidden — scrolled away (.global-header--hidden)</StateLabel>
            <BarSpecimen hiddenState />
          </div>
        </div>
      </Row>

      {/* ── 3. gh-nav-link states ── */}
      <Row label="gh-nav-link states">
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <StateBox label="default">
            <a className="gh-nav-link" style={{ cursor: 'default', display: 'inline-block' }}>Products</a>
          </StateBox>
          <StateBox label="hover / focus">
            {/* simulate hover bg */}
            <a className="gh-nav-link" style={{ cursor: 'default', display: 'inline-block', background: 'var(--s1)' }}>Resources</a>
          </StateBox>
          <StateBox label="active (.gh-nav-link--active) — Products portal open">
            <a className="gh-nav-link gh-nav-link--active" style={{ cursor: 'default', display: 'inline-block' }}>Products</a>
          </StateBox>
        </div>
        <div style={{ marginTop: 8, fontSize: '0.72rem', color: 'var(--muted)' }}>
          Active state: <code>background:var(--s1)</code> + <code>color:var(--brand) !important</code> (red). Applied when the Products portal overlay is open.
        </div>
      </Row>

      {/* ── 4. gh-icon-btn states ── */}
      <Row label="gh-icon-btn states">
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <StateBox label="default (transparent)">
            <button className="gh-icon-btn" style={{ cursor: 'default' }}><IcoSearch /></button>
          </StateBox>
          <StateBox label="hover (bg:var(--s1))">
            <button className="gh-icon-btn" style={{ cursor: 'default', background: 'var(--s1)', color: 'var(--t-hi)' }}><IcoSearch /></button>
          </StateBox>
          <StateBox label=".gh-icon-btn--active — plumbing portal open (red icon)">
            <button className="gh-icon-btn gh-icon-btn--active" style={{ cursor: 'default' }}><IcoWrench /></button>
          </StateBox>
          <StateBox label=".gh-desktop-only — hidden below 900 px">
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <button className="gh-icon-btn gh-desktop-only" style={{ cursor: 'default', opacity: 0.35 }}><IcoSearch /></button>
              <span style={{ fontSize: '0.7rem', color: 'var(--muted)', fontStyle: 'italic' }}>display:none &lt;900 px</span>
            </div>
          </StateBox>
        </div>
        <div style={{ marginTop: 8, fontSize: '0.72rem', color: 'var(--muted)' }}>
          44 × 44 px touch target. <code>.gh-icon-btn--active</code> forces <code>color:#e2001a !important</code> to indicate an open overlay (used for the Plumbing Portal <code>?</code> button).
        </div>
      </Row>

      {/* ── 5. gh-signin-btn states ── */}
      <Row label="gh-signin-btn states">
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <StateBox label="default">
            <button className="gh-signin-btn" style={{ cursor: 'default' }}><IcoUser />&nbsp;Sign in</button>
          </StateBox>
          <StateBox label="hover (bg:var(--s2), border:var(--b-hi))">
            <button className="gh-signin-btn" style={{ cursor: 'default', background: 'var(--s2)', borderColor: 'var(--b-hi)' }}><IcoUser />&nbsp;Sign in</button>
          </StateBox>
        </div>
        <div style={{ marginTop: 8, fontSize: '0.72rem', color: 'var(--muted)' }}>
          Pill shape via <code>border-radius:var(--r-pill)</code>. Default: <code>bg:var(--s1)</code> + <code>border:1.5px var(--b-med)</code>. Hover lifts to <code>--s2</code> + <code>--b-hi</code>.
        </div>
      </Row>

      {/* ── 6. Mobile states ── */}
      <Row label="mobile states — hamburger + gh-mobile-menu" noBorder>
        <div style={{ width: '100%' }}>
          {/* narrow mock bar */}
          <div style={{ maxWidth: 360, borderRadius: 10, border: '1px solid var(--border)', overflow: 'visible', position: 'relative' }}>
            <div style={{
              height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 16px', background: 'var(--s0)', borderRadius: mobileOpen ? '10px 10px 0 0' : 10,
              borderBottom: mobileOpen ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}><TomTomLogo /></div>
              <button
                className={`gh-icon-btn gh-hamburger${mobileOpen ? ' gh-icon-btn--active' : ''}`}
                style={{ display: 'flex', cursor: 'pointer' }}
                onClick={() => setMobileOpen(o => !o)}
              >
                {mobileOpen ? <IcoX /> : <IcoMenu />}
              </button>
            </div>
            {mobileOpen && (
              <div className="gh-mobile-menu" style={{ position: 'relative', border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 10px 10px', background: 'var(--s0)', padding: '8px 0 12px' }}>
                <a className="gh-mobile-link gh-mobile-link--active" style={{ display: 'block', cursor: 'default' }}>Products</a>
                <a className="gh-mobile-link" style={{ display: 'block', cursor: 'default' }}>Resources</a>
                <a className="gh-mobile-link" style={{ display: 'block', cursor: 'default' }}>Pricing</a>
                <div className="gh-mobile-divider" style={{ margin: '8px 16px', height: 1, background: 'var(--border)' }} />
                <a className="gh-mobile-signin" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--t-hi)', cursor: 'default' }}><IcoUser />Sign in</a>
              </div>
            )}
          </div>

          {/* mobile link state breakdowns */}
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginTop: 16 }}>
            <StateBox label="gh-mobile-link default">
              <a className="gh-mobile-link" style={{ display: 'block', cursor: 'default', padding: '10px 16px' }}>Products</a>
            </StateBox>
            <StateBox label="gh-mobile-link hover (bg:var(--s1))">
              <a className="gh-mobile-link" style={{ display: 'block', cursor: 'default', padding: '10px 16px', background: 'var(--s1)' }}>Resources</a>
            </StateBox>
            <StateBox label="gh-mobile-link--active (red text)">
              <a className="gh-mobile-link gh-mobile-link--active" style={{ display: 'block', cursor: 'default', padding: '10px 16px' }}>Products</a>
            </StateBox>
          </div>
          <div style={{ marginTop: 8, fontSize: '0.72rem', color: 'var(--muted)' }}>
            Toggle the ☰ button above to see the live mobile menu. <code>.gh-hamburger</code> is <code>display:none</code> at desktop widths — visible only via <code>@media (max-width:900px)</code>. Active link uses <code>color:var(--red)</code>.
          </div>
        </div>
      </Row>

      <Divider />

      {/* ── 7. TopNav breadcrumb bar ── */}
      <Row label="topnav breadcrumb bar — below global-header, above content">
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
    <GallerySection title="Tab Bar" desc=".tab-bar, .tab-btn — language/platform code switcher"
      usage={[
        { n: '.tab-bar', f: 0, t: 'ghost' },
        { n: '.tab-btn', f: 1 },
        { n: '.tab-btn--active', f: 1 },
        { n: 'TabNavigation', t: 'playbook' },
      ]}>
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
    <GallerySection title="Text Card" desc=".text-card, .text-card--active — plain bordered content card with active state"
      usage={[
        { n: '.text-card', f: 1 },
        { n: '.text-card--active', f: 0, t: 'ghost' },
        { n: 'Card', t: 'playbook' },
      ]}>
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
    <GallerySection title="Anatomy Cards" desc=".anatomy-card, .anatomy-row, .anatomy-prop, .anatomy-arrow, .anatomy-note — page section diagram"
      usage={[
        { n: '.anatomy-card', f: 1 },
        { n: '.anatomy-row', f: 1 },
        { n: '.anatomy-prop', f: 1 },
        { n: '.anatomy-arrow', f: 1 },
        { n: '.anatomy-note', f: 1 },
      ]}>
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
    <GallerySection title="Modal" desc=".md-overlay, .md-modal, .md-modal-header, .md-modal-body, .md-modal-close, .md-modal-copy"
      usage={[
        { n: '.md-overlay', f: 1 },
        { n: '.md-modal', f: 1 },
        { n: '.md-modal-header', f: 1 },
        { n: '.md-modal-body', f: 1 },
        { n: '.md-modal-close', f: 1 },
        { n: '.md-modal-copy', f: 1 },
        { n: 'Modal', t: 'playbook' },
        { n: 'ModalContextProvider', t: 'playbook' },
      ]}>
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
    <GallerySection title="AI Panel" desc=".ai-panel · .ai-panel-header · .ai-panel-source-chip · .ai-msg--user · .ai-msg--ai · .ai-msg--typing · .ai-panel-footer — purple accent throughout, not brand red"
      usage={[
        { n: 'AskAIPanel', f: 2 },
        { n: '.ai-panel', f: 1 },
        { n: '.ai-panel-source-chip', f: 1 },
        { n: '.ai-msg--user', f: 1 },
        { n: '.ai-msg--ai', f: 1 },
        { n: '.ai-panel-send', f: 1 },
      ]}>

      {/* ── Full panel specimen ── */}
      <Row label="full panel — all zones">
        <div style={{ width: 320, border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--white)', boxShadow: '-4px 0 24px rgba(0,0,0,0.06)' }}>

          {/* Header: title row + disclaimer */}
          <div className="ai-panel-header">
            <div className="ai-panel-header-top">
              <div className="ai-panel-title">
                <SparkleIcon size={13} /> Ask AI
              </div>
              <div className="ai-panel-header-actions">
                <button className="ai-panel-icon-btn" style={{ cursor: 'default' }} title="New chat">
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                </button>
                <button className="ai-panel-icon-btn" style={{ cursor: 'default' }} title="Close">
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                </button>
              </div>
            </div>
            <p className="ai-panel-disclaimer">Responses are generated using AI and may contain mistakes.</p>
          </div>

          {/* Source chip — own border-bottom section */}
          <div className="ai-panel-source">
            <span className="ai-panel-source-chip">
              <SparkleIcon size={10} /> UX Library · Calculate Route
            </span>
          </div>

          {/* Messages */}
          <div className="ai-panel-messages" style={{ minHeight: 160 }}>
            {/* AI welcome */}
            <div className="ai-msg ai-msg--ai">
              <span className="ai-msg-avatar"><SparkleIcon size={11} /></span>
              <span className="ai-msg-text">
                I have context for this page. Ask me anything about the Calculate Route endpoint.
              </span>
            </div>
            {/* User message */}
            <div className="ai-msg ai-msg--user">
              <span className="ai-msg-text">What parameters are required?</span>
            </div>
            {/* Typing dots */}
            <div className="ai-msg ai-msg--ai ai-msg--typing">
              <span className="ai-msg-avatar"><SparkleIcon size={11} /></span>
              <span className="ai-msg-dots"><span /><span /><span /></span>
            </div>
          </div>

          {/* Footer */}
          <div className="ai-panel-footer">
            <div className="ai-panel-input-wrap">
              <textarea className="ai-panel-input" placeholder="Ask a question about this page…" rows={1} readOnly />
              <button className="ai-panel-send" disabled aria-label="Send">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M13.5 8L2.5 2.5l2.8 5.5-2.8 5.5L13.5 8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
              </button>
            </div>
            <p className="ai-panel-hint">Enter to send · Esc to close</p>
          </div>
        </div>
      </Row>

      {/* ── Element states ── */}
      <Row label="ai-panel-source-chip">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <StateBox label="default (purple bg #f3f0ff, text #5b21b6)">
            <span className="ai-panel-source-chip"><SparkleIcon size={10} /> UX Library · Calculate Route</span>
          </StateBox>
        </div>
      </Row>

      <Row label="ai-msg—user vs ai-msg—ai bubbles">
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          <StateBox label="ai-msg--ai (bg:var(--bg), border:var(--border), radius:4 14 14 14)">
            <div className="ai-msg ai-msg--ai" style={{ maxWidth: 220 }}>
              <span className="ai-msg-avatar"><SparkleIcon size={11} /></span>
              <span className="ai-msg-text">Here's what the AI message bubble looks like.</span>
            </div>
          </StateBox>
          <StateBox label="ai-msg--user (bg:#5b21b6, white text, radius:14 14 4 14)">
            <div className="ai-msg ai-msg--user" style={{ maxWidth: 220 }}>
              <span className="ai-msg-text">And here is the user bubble.</span>
            </div>
          </StateBox>
        </div>
      </Row>

      <Row label="ai-panel-icon-btn states" noBorder>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <StateBox label="default (28×28, no border, transparent)">
            <button className="ai-panel-icon-btn" style={{ cursor: 'default' }}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            </button>
          </StateBox>
          <StateBox label="hover (bg:var(--bg), color:var(--black))">
            <button className="ai-panel-icon-btn" style={{ cursor: 'default', background: 'var(--bg)', color: 'var(--black)' }}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            </button>
          </StateBox>
          <StateBox label="ai-panel-send — enabled (#5b21b6)">
            <button className="ai-panel-send" style={{ cursor: 'default' }}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M13.5 8L2.5 2.5l2.8 5.5-2.8 5.5L13.5 8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
            </button>
          </StateBox>
          <StateBox label="ai-panel-send — disabled (var(--border) bg)">
            <button className="ai-panel-send" disabled>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M13.5 8L2.5 2.5l2.8 5.5-2.8 5.5L13.5 8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
            </button>
          </StateBox>
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
    <GallerySection title="Token Display + Colour Swatches" desc=".token-group, .token-table, .token-cell, .dt-swatch-row, .dt-swatch-ex, .swatch / .sw-*"
      usage={[
        { n: '.swatch', f: 7 },
        { n: '.token-group', f: 2 },
        { n: '.token-table', f: 1 },
        { n: '.token-cell', f: 1 },
        { n: '.dt-swatch-row', f: 1 },
      ]}>
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
    <GallerySection title="Typography Patterns" desc=".type-category-grid, .type-cat, .type-scale-table, .weight-preview, .font-token-group"
      usage={[
        { n: '.type-category-grid', f: 1 },
        { n: '.type-cat', f: 1 },
        { n: '.type-scale-table', f: 1 },
        { n: '.weight-preview', f: 1 },
        { n: '.font-token-group', f: 1 },
      ]}>
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
    <GallerySection title="Illo Card" desc=".illo-card-wrap, .illo-card-actions, .illo-card-gen-name, .illo-card-refresh, .illo-card-ts — AI-generated illustration tiles"
      usage={[
        { n: '.illo-card-wrap', f: 1 },
        { n: '.illo-card-actions', f: 1 },
        { n: '.illo-card-gen-name', f: 1 },
        { n: '.illo-card-refresh', f: 1 },
      ]}>
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
    <GallerySection title="Platform Switcher" desc=".platform-switcher, .platform-btn, .platform-btn-compact — SDK platform filter"
      usage={[
        { n: '.platform-switcher', f: 1 },
        { n: '.platform-btn', f: 1 },
        { n: '.platform-btn-compact', f: 1 },
        { n: 'Switcher', t: 'playbook' },
      ]}>
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
    <GallerySection title="DocsPortal2 Cards" desc=".dp2-product-card, .dp2-disc-card, .dp2-glass, .dp2-navsdk-card, .dp2-resource-card, .dp2-tool-card, .dp2-support-card"
      usage={[
        { n: '.dp2-product-card', f: 1 },
        { n: '.dp2-disc-card', f: 1 },
        { n: '.dp2-glass', f: 1 },
        { n: '.dp2-navsdk-card', f: 1 },
        { n: '.dp2-resource-card', f: 1 },
        { n: '.dp2-tool-card', f: 1 },
        { n: '.dp2-support-card', f: 1 },
        { n: 'Card', t: 'playbook' },
        { n: 'ContentCard', t: 'playbook' },
      ]}>

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
    <GallerySection title="ADAS Stack + Capabilities" desc=".adas-stack, .adas-stack-layer, .adas-stack-highlight, .adas-cap-grid, .adas-highlights"
      usage={[
        { n: '.adas-stack', f: 4 },
        { n: '.adas-stack-layer', f: 4 },
        { n: '.adas-cap-grid', f: 1 },
        { n: '.adas-highlights', f: 1 },
      ]}>
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
    <GallerySection title="Semantic Cards" desc=".sem-card, .sem-title, .sem-body — tinted semantic colour blocks"
      usage={[
        { n: '.sem-card', f: 1 },
        { n: '.sem-title', f: 1 },
        { n: '.sem-body', f: 1 },
      ]}>
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
    <GallerySection title="Token Flow" desc=".tfi-step, .tfi-icon, .tfi-icon-token/component/product, .tfi-arrow, .tfi-label — design token pipeline diagram"
      usage={[
        { n: '.tfi-step', f: 1 },
        { n: '.tfi-icon', f: 1 },
        { n: '.tfi-arrow', f: 1 },
        { n: '.tfi-label', f: 1 },
      ]}>
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
    <GallerySection title="TryIt Panel (API Demo Widget)" desc="The live-preview widget embedded in API reference pages — all states side by side"
      usage={[
        { n: 'TryItEmbed', f: 3 },
        { n: 'TryItPanel', f: 2 },
        { n: 'DEMOS', f: 3 },
      ]}>

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
    <GallerySection title="Page Actions Bar" desc=".page-actions, .page-action-btn, .page-action-btn--ai, .page-action-sep, .page-action-btn--disabled"
      usage={[
        { n: '.page-action-btn', f: 17 },
        { n: '.page-actions', f: 1 },
        { n: '.page-action-btn--ai', f: 1 },
        { n: '.page-action-sep', f: 1 },
        { n: '.md-overlay', f: 1 },
        { n: '.md-modal', f: 1 },
        { n: '.page-action-btn--disabled', f: 0, t: 'ghost' },
      ]}>
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
    <GallerySection title="Page Layout Utilities" desc=".page-subtitle, .page-body, .grid-2-col, .examples-grid, .ctx-grid"
      usage={[
        { n: '.page', f: 81 },
        { n: '.page--wide', f: 9 },
        { n: '.grid-2-col', f: 4 },
        { n: '.examples-grid', f: 3 },
        { n: '.ctx-grid', f: 2 },
        { n: '.page-subtitle', f: 1 },
      ]}>

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* ── Shared logo SVG ── */
  const Logo = ({ w = 70, h = 13 }) => (
    <svg width={w} height={h} viewBox="0 0 125 24" fill="none" style={{ display: 'block', flexShrink: 0 }}>
      <path fillRule="evenodd" clipRule="evenodd" d="M121.444 22.1291H124.999L125 13.0887C125 12.5 124.925 12.0676 124.859 11.7567C124.836 11.6515 124.816 11.5678 124.794 11.4864C124.092 8.90785 121.577 7.123 118.811 7.23655C117.528 7.29129 116.321 7.76661 115.225 8.64915L115.085 8.76169L114.945 8.64915C113.849 7.76661 112.642 7.29129 111.359 7.23655C108.59 7.12114 106.078 8.90785 105.376 11.4864C105.354 11.568 105.334 11.652 105.311 11.7577C105.242 12.0876 105.17 12.5049 105.17 13.0887L105.171 22.1291H108.726V13.242C108.726 11.9833 109.753 10.9593 111.015 10.9593C112.266 10.9593 113.292 11.9744 113.303 13.222C113.304 13.2264 113.304 13.2342 113.304 13.242V22.1291H116.866L116.867 13.2212C116.878 11.9744 117.904 10.9593 119.155 10.9593C120.417 10.9593 121.444 11.9833 121.444 13.242V22.1291Z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M95.1744 18.5808C93.0256 18.5808 91.2773 16.8374 91.2773 14.6945C91.2773 12.5516 93.0256 10.8081 95.1744 10.8081C97.3234 10.8081 99.0716 12.5516 99.0716 14.6945C99.0716 16.8374 97.3234 18.5808 95.1744 18.5808ZM95.1741 7.25977C91.0633 7.25977 87.7188 10.5949 87.7188 14.6944C87.7188 18.794 91.0633 22.1292 95.1741 22.1292C99.285 22.1292 102.629 18.794 102.629 14.6944C102.629 10.5949 99.285 7.25977 95.1741 7.25977Z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M82.9062 22.1324H87.5178L85.4546 18.5805C85.0074 18.58 83.1692 18.5776 83.026 18.5776C81.8791 18.5776 80.8802 17.7512 80.7994 16.7353C80.7887 16.6023 80.7791 16.4376 80.7716 16.2566V10.9014H85.4537L87.2833 7.69089H80.7716V1.86743L77.2102 4.32446V7.52023H74.9629V11.072H77.21L77.2134 15.9215C77.2134 15.9236 77.211 16.1479 77.2144 16.2125L77.228 16.4827C77.3498 18.8376 78.5126 20.5715 80.684 21.6355C81.2652 21.9202 81.908 22.0772 82.7073 22.1294L82.9062 22.1291V22.1324Z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M68.864 22.129H72.4192L72.4198 13.0887C72.4198 12.5 72.3444 12.0676 72.2785 11.7567C72.2556 11.6514 72.2355 11.5677 72.2135 11.4863C71.512 8.90779 68.9973 7.12293 66.2307 7.23648C64.9479 7.29123 63.7413 7.76655 62.6447 8.64909L62.5049 8.76163L62.3651 8.64909C61.2685 7.76655 60.0619 7.29123 58.7788 7.23648C56.01 7.12108 53.4979 8.90779 52.7962 11.4863C52.774 11.5679 52.754 11.6519 52.731 11.7577C52.6613 12.0875 52.5898 12.5049 52.5898 13.0887L52.5905 22.129H56.1459V13.2419C56.1459 11.9833 57.1727 10.9593 58.4348 10.9593C59.6856 10.9593 60.7119 11.9743 60.7229 13.222C60.7233 13.2264 60.7238 13.2342 60.7238 13.2419V22.129H64.2861L64.2869 13.2211C64.2978 11.9743 65.3242 10.9593 66.5749 10.9593C67.8372 10.9593 68.864 11.9833 68.864 13.2419V22.129Z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M42.5944 18.5808C40.4454 18.5808 38.6973 16.8374 38.6973 14.6945C38.6973 12.5516 40.4454 10.8081 42.5944 10.8081C44.7434 10.8081 46.4915 12.5516 46.4915 14.6945C46.4915 16.8374 44.7434 18.5808 42.5944 18.5808ZM42.594 7.25977C38.4831 7.25977 35.1387 10.5949 35.1387 14.6944C35.1387 18.794 38.4831 22.1292 42.594 22.1292C46.7049 22.1292 50.0493 18.794 50.0493 14.6944C50.0493 10.5949 46.7049 7.25977 42.594 7.25977Z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M30.3261 22.1325H34.9378L32.8745 18.5805C32.4273 18.58 30.5891 18.5777 30.4459 18.5777C29.299 18.5777 28.3001 17.7512 28.2193 16.7354C28.2086 16.6024 28.199 16.4376 28.1915 16.2567V10.9014H32.8736L34.7033 7.69095H28.1915V1.86749L24.6301 4.32452V7.52029H22.3828V11.0721H24.6299L24.6333 15.9216C24.6333 15.9236 24.6309 16.148 24.6343 16.2126L24.6479 16.4827C24.7697 18.8377 25.9326 20.5715 28.1039 21.6355C28.6851 21.9203 29.328 22.0772 30.1272 22.1295L30.3261 22.1291V22.1325Z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M8.28764 24.0001L11.4639 18.5139H5.11133L8.28764 24.0001Z" fill="#DF1B12"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M8.28694 12.5839C5.89835 12.5839 3.95522 10.6459 3.95522 8.26409C3.95522 5.88209 5.89835 3.94415 8.28694 3.94415C10.6755 3.94415 12.6187 5.88209 12.6187 8.26409C12.6187 10.6459 10.6755 12.5839 8.28694 12.5839ZM8.28694 0C3.7175 0 0 3.70725 0 8.26409C0 12.8208 3.7175 16.528 8.28694 16.528C12.8564 16.528 16.5739 12.8208 16.5739 8.26409C16.5739 3.70725 12.8564 0 8.28694 0Z" fill="#DF1B12"/>
    </svg>
  );

  /* ── Sub-components ── */
  const NavCol = ({ collapsed }) => (
    <div style={{
      width: collapsed ? 0 : 180, minWidth: collapsed ? 0 : 180,
      borderRight: collapsed ? 'none' : '1px solid var(--border)',
      background: 'var(--white)', overflow: 'hidden', transition: 'width 0.28s',
      display: 'flex', flexDirection: 'column',
    }}>
      {!collapsed && (
        <div style={{ padding: '10px 12px', flex: 1 }}>
          <div style={{ fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Routing API</div>
          {[['Introduction', false], ['Calculate Route', true], ['Batch Route', false], ['Matrix Routing', false]].map(([l, active]) => (
            <div key={l} style={{ padding: '5px 8px', fontSize: '0.68rem', color: active ? 'var(--black)' : 'var(--mid)', fontWeight: active ? 600 : 400, background: active ? 'var(--s1)' : 'transparent', borderRadius: 4, marginBottom: 2 }}>{l}</div>
          ))}
        </div>
      )}
    </div>
  );

  const ContentCol = ({ wide }) => (
    <div style={{ flex: 1, padding: wide ? '14px 24px' : '14px 18px', minWidth: 0, background: 'var(--white)' }}>
      <div style={{ height: 11, width: '55%', background: 'var(--border)', borderRadius: 4, marginBottom: 10 }} />
      {[90, 75, 82, 65].map((w, i) => (
        <div key={i} style={{ height: 7, width: `${w}%`, background: 'var(--bg)', borderRadius: 3, marginBottom: 5 }} />
      ))}
    </div>
  );

  const TocCol = ({ hidden }) => (
    <div style={{
      width: hidden ? 0 : 110, minWidth: hidden ? 0 : 110,
      borderLeft: hidden ? 'none' : '1px solid var(--border)',
      background: 'var(--white)', overflow: 'hidden', transition: 'width 0.28s',
    }}>
      {!hidden && (
        <div style={{ padding: '10px 12px' }}>
          <div style={{ fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>On this page</div>
          {[['Request', false], ['Parameters', true], ['Response', false], ['Examples', false]].map(([l, active]) => (
            <div key={l} style={{ padding: '3px 0 3px 7px', borderLeft: `2px solid ${active ? 'var(--red)' : 'var(--border)'}`, fontSize: '0.6rem', color: active ? 'var(--red)' : 'var(--muted)', fontWeight: active ? 600 : 400, marginBottom: 2 }}>{l}</div>
          ))}
        </div>
      )}
    </div>
  );

  /* Desktop header: logo left · Products/Resources/Pricing centred · icons + sign-in right */
  const HeaderBar = ({ showExpandBtn }) => (
    <div style={{ position: 'relative', height: 40, background: 'var(--white)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 14px' }}>
      {/* Left: logo + divider + Docs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, zIndex: 1 }}>
        <Logo />
        <div style={{ width: 1, height: 14, background: 'var(--border)', flexShrink: 0 }} />
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--black)', fontFamily: 'var(--font-display)' }}>Docs</span>
      </div>
      {/* Centre: nav links */}
      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 2 }}>
        {['Products', 'Resources', 'Pricing'].map(l => (
          <span key={l} style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--black)', padding: '3px 7px', borderRadius: 5, fontFamily: 'var(--font-display)' }}>{l}</span>
        ))}
      </div>
      {/* Right: search + wrench + sign in */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 2, zIndex: 1 }}>
        {showExpandBtn && (
          <div style={{ width: 20, height: 20, borderRadius: 4, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 4 }}>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6L6 2l4 4M2 10L6 6l4 4" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        )}
        <div style={{ width: 24, height: 24, borderRadius: 5, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="7" cy="7" r="4.5"/><path d="M11 11l2.5 2.5"/></svg>
        </div>
        <div style={{ width: 24, height: 24, borderRadius: 5, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
        </div>
        <div style={{ height: 22, display: 'flex', alignItems: 'center', padding: '0 8px', borderRadius: 99, border: '1.5px solid var(--border)', background: 'var(--s1)', fontSize: '0.6rem', fontWeight: 600, color: 'var(--black)', marginLeft: 2, gap: 4 }}>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Sign in
        </div>
      </div>
    </div>
  );

  /* Mobile header: logo left · hamburger right (no centred nav) */
  const MobileHeaderBar = ({ menuOpen, onToggle }) => (
    <div style={{ position: 'relative' }}>
      <div style={{ height: 40, background: 'var(--white)', borderBottom: menuOpen ? 'none' : '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 12px', justifyContent: 'space-between' }}>
        <Logo />
        <button onClick={onToggle} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--black)' }}>
          {menuOpen
            ? <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="3" y1="3" x2="13" y2="13"/><line x1="13" y1="3" x2="3" y2="13"/></svg>
            : <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="2" y1="4" x2="14" y2="4"/><line x1="2" y1="8" x2="14" y2="8"/><line x1="2" y1="12" x2="14" y2="12"/></svg>
          }
        </button>
      </div>
      {menuOpen && (
        <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)', padding: '6px 0 10px' }}>
          {['Products', 'Resources', 'Pricing'].map(l => (
            <div key={l} style={{ padding: '8px 14px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)', fontFamily: 'var(--font-display)' }}>{l}</div>
          ))}
          <div style={{ height: 1, background: 'var(--border)', margin: '6px 14px' }} />
          <div style={{ padding: '8px 14px', fontSize: '0.72rem', fontWeight: 600, color: 'var(--mid)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Sign in
          </div>
        </div>
      )}
    </div>
  );

  const TopnavBar = () => (
    <div style={{ height: 26, background: 'var(--white)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 14px', gap: 3, fontSize: '0.58rem' }}>
      <span style={{ color: 'var(--muted)' }}>Developer Portal</span>
      <span style={{ color: 'var(--border)', margin: '0 1px' }}>/</span>
      <span style={{ color: 'var(--muted)' }}>Routing</span>
      <span style={{ color: 'var(--border)', margin: '0 1px' }}>/</span>
      <span style={{ color: 'var(--black)', fontWeight: 600 }}>Calculate Route</span>
      <span style={{ marginLeft: 'auto', fontSize: '0.48rem', fontWeight: 700, padding: '1px 5px', borderRadius: 3, background: 'var(--warn-bg)', color: 'var(--warn-text)' }}>Beta</span>
      <span style={{ fontSize: '0.48rem', padding: '1px 5px', borderRadius: 3, background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--muted)' }}>v1.28</span>
    </div>
  );

  /* Tablet nav drawer overlay */
  const TabletDrawer = () => (
    <div style={{ position: 'absolute', top: 0, left: 0, width: 160, height: '100%', background: 'var(--white)', borderRight: '1px solid var(--border)', zIndex: 10, boxShadow: '4px 0 16px rgba(0,0,0,0.10)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 32, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', flexShrink: 0 }}>
        <span style={{ fontSize: '0.58rem', fontWeight: 700, color: 'var(--black)' }}>Navigation</span>
        <div style={{ width: 18, height: 18, borderRadius: 4, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round"><line x1="1" y1="1" x2="11" y2="11"/><line x1="11" y1="1" x2="1" y2="11"/></svg>
        </div>
      </div>
      <div style={{ padding: '8px 10px', flex: 1 }}>
        <div style={{ fontSize: '0.47rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>Routing API</div>
        {[['Introduction', false], ['Calculate Route', true], ['Batch Route', false]].map(([l, active]) => (
          <div key={l} style={{ padding: '4px 7px', fontSize: '0.62rem', color: active ? 'var(--black)' : 'var(--mid)', fontWeight: active ? 600 : 400, background: active ? 'var(--s1)' : 'transparent', borderRadius: 4, marginBottom: 2 }}>{l}</div>
        ))}
      </div>
    </div>
  );

  const ShellFrame = ({ children, maxWidth = 680, height = 140, label }) => (
    <div style={{ width: '100%', maxWidth }}>
      {label && <div style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{label}</div>}
      <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );

  return (
    <GallerySection title="App Shell Layout" desc=".shell (3-col grid) · .sidenav | content | .toc · desktop / tablet / mobile variants"
      usage={[
        { n: '.page', f: 81 },
        { n: '.page--wide', f: 9 },
        { n: '.content-area', f: 2 },
        { n: '.shell', f: 1 },
        { n: '.shell--no-toc', f: 1 },
        { n: '.shell--nav-collapsed', f: 1 },
      ]}>

      {/* ── Desktop variants ── */}
      <Row label="desktop — default (.shell: sidenav + content + toc)">
        <ShellFrame>
          <HeaderBar />
          <TopnavBar />
          <div style={{ display: 'flex', height: 140 }}>
            <NavCol />
            <ContentCol />
            <TocCol />
          </div>
        </ShellFrame>
      </Row>

      <Row label="desktop — .shell--no-toc (sidenav + full-width content, no TOC)">
        <ShellFrame>
          <HeaderBar />
          <TopnavBar />
          <div style={{ display: 'flex', height: 120 }}>
            <NavCol />
            <ContentCol wide />
            <TocCol hidden />
          </div>
        </ShellFrame>
      </Row>

      <Row label="desktop — .shell--nav-collapsed (sidenav hidden, expand button in header)">
        <ShellFrame>
          <HeaderBar showExpandBtn />
          <TopnavBar />
          <div style={{ display: 'flex', height: 120 }}>
            <NavCol collapsed />
            <ContentCol wide />
            <TocCol />
          </div>
        </ShellFrame>
      </Row>

      <Row label="desktop — .shell--nav-collapsed + .shell--no-toc (full-width canvas)">
        <ShellFrame>
          <HeaderBar showExpandBtn />
          <TopnavBar />
          <div style={{ display: 'flex', height: 110 }}>
            <NavCol collapsed />
            <ContentCol wide />
            <TocCol hidden />
          </div>
        </ShellFrame>
      </Row>

      {/* ── Tablet variant ── */}
      <Row label="tablet (~768 px) — sidenav hidden by default, opens as drawer overlay">
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <ShellFrame maxWidth={400} label="drawer closed">
            <HeaderBar showExpandBtn />
            <TopnavBar />
            <div style={{ display: 'flex', height: 110 }}>
              <NavCol collapsed />
              <ContentCol wide />
              <TocCol hidden />
            </div>
          </ShellFrame>
          <ShellFrame maxWidth={400} label="drawer open (overlays content)">
            <HeaderBar />
            <TopnavBar />
            <div style={{ display: 'flex', height: 110, position: 'relative' }}>
              <TabletDrawer />
              <ContentCol wide />
            </div>
          </ShellFrame>
        </div>
      </Row>

      {/* ── Mobile variant ── */}
      <Row label="mobile (~375 px) — no sidenav, no TOC, hamburger opens full-width dropdown">
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <ShellFrame maxWidth={260} label="menu closed">
            <MobileHeaderBar menuOpen={false} onToggle={() => {}} />
            <TopnavBar />
            <div style={{ padding: '12px 14px', background: 'var(--white)' }}>
              <div style={{ height: 10, width: '60%', background: 'var(--border)', borderRadius: 3, marginBottom: 8 }} />
              {[90, 75, 82].map((w, i) => <div key={i} style={{ height: 6, width: `${w}%`, background: 'var(--bg)', borderRadius: 3, marginBottom: 4 }} />)}
            </div>
          </ShellFrame>
          <ShellFrame maxWidth={260} label="menu open (Products / Resources / Pricing + Sign in)">
            <MobileHeaderBar menuOpen={true} onToggle={() => {}} />
            <div style={{ padding: '10px 14px', background: 'var(--white)' }}>
              <div style={{ height: 8, width: '70%', background: 'var(--bg)', borderRadius: 3, opacity: 0.4 }} />
            </div>
          </ShellFrame>
          <ShellFrame maxWidth={260} label="interactive — try the ☰ toggle">
            <MobileHeaderBar menuOpen={mobileMenuOpen} onToggle={() => setMobileMenuOpen(o => !o)} />
            {!mobileMenuOpen && (
              <>
                <TopnavBar />
                <div style={{ padding: '12px 14px', background: 'var(--white)' }}>
                  <div style={{ height: 10, width: '55%', background: 'var(--border)', borderRadius: 3, marginBottom: 8 }} />
                  {[85, 70, 80].map((w, i) => <div key={i} style={{ height: 6, width: `${w}%`, background: 'var(--bg)', borderRadius: 3, marginBottom: 4 }} />)}
                </div>
              </>
            )}
          </ShellFrame>
        </div>
      </Row>

      {/* ── 2-col API ref inside shell ── */}
      <Row label="desktop — .shell + .api-ref-sections (2-col API ref: prose + params left · dark code right)" noBorder>
        <ShellFrame maxWidth={760} height={260}>
          <HeaderBar />
          <TopnavBar />
          <div style={{ display: 'flex', minHeight: 260 }}>
            <NavCol />
            <div style={{ flex: 1, minWidth: 0, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <div style={{ padding: '14px 18px', borderRight: '1px solid var(--border)', background: 'var(--white)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.5rem', fontWeight: 800, padding: '2px 5px', borderRadius: 3, background: 'var(--info-bg)', color: 'var(--info-text)', letterSpacing: '0.04em' }}>GET</span>
                  <code style={{ fontSize: '0.58rem', color: 'var(--black)', fontFamily: 'var(--font-mono)' }}>/routing/1/calculateRoute</code>
                </div>
                <p style={{ fontSize: '0.66rem', color: 'var(--mid)', lineHeight: 1.6, margin: '0 0 10px' }}>Calculates a route between two or more locations using real-time traffic.</p>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.62rem' }}>
                  <thead><tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ textAlign: 'left', padding: '3px 0', color: 'var(--muted)', fontWeight: 600, fontSize: '0.52rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Parameter</th>
                    <th style={{ textAlign: 'left', padding: '3px 0', color: 'var(--muted)', fontWeight: 600, fontSize: '0.52rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Required</th>
                  </tr></thead>
                  <tbody>
                    {[['routePlanningLocations', true], ['travelMode', false], ['traffic', false]].map(([n, req]) => (
                      <tr key={n} style={{ borderBottom: '1px solid var(--bg)' }}>
                        <td style={{ padding: '3px 6px 3px 0' }}><code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--black)' }}>{n}</code></td>
                        <td style={{ padding: '3px 0' }}>
                          <span style={{ fontSize: '0.48rem', fontWeight: 700, padding: '1px 4px', borderRadius: 3, background: req ? 'var(--danger-bg)' : 'var(--bg)', color: req ? 'var(--danger-text)' : 'var(--muted)', border: `1px solid ${req ? 'var(--danger-border)' : 'var(--border)'}` }}>{req ? 'required' : 'optional'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ background: '#0d1117', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '5px 10px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontSize: '0.52rem', color: '#94a3b8', fontWeight: 600 }}>cURL</span>
                  <div style={{ flex: 1 }} />
                  <span style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.07)', borderRadius: 3, padding: '1px 6px' }}>Copy</span>
                </div>
                <pre style={{ margin: 0, padding: '10px 12px', fontSize: '0.58rem', color: '#c9d1d9', lineHeight: 1.6, flex: 1 }}>{`curl -X GET \\\n  "https://api.tomtom.com/\n  routing/1/calculateRoute/\n  52.37,4.90:48.86,2.35/\n  json?key=YOUR_KEY\n  &travelMode=car"`}</pre>
                <div style={{ padding: '4px 10px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                  <span style={{ fontSize: '0.52rem', color: '#4ade80', fontWeight: 600 }}>200 OK</span>
                  <span style={{ fontSize: '0.52rem', color: '#64748b', marginLeft: 'auto' }}>124 ms</span>
                </div>
                <pre style={{ margin: 0, padding: '8px 12px', fontSize: '0.58rem', color: '#c9d1d9', lineHeight: 1.6, borderTop: '1px solid rgba(255,255,255,0.05)', maxHeight: 72, overflow: 'hidden' }}>{`{\n  "routes": [{\n    "summary": {\n      "travelTimeInSeconds": 3720\n    }\n  }]\n}`}</pre>
              </div>
            </div>
            <TocCol />
          </div>
        </ShellFrame>
      </Row>

    </GallerySection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §42  TOC — TABLE OF CONTENTS (RIGHT SIDEBAR)
// ─────────────────────────────────────────────────────────────────────────────

function TocSection() {
  return (
    <GallerySection title="TOC — Table of Contents" desc=".toc, .toc-heading, .toc-list — right-column sticky nav, all link states"
      usage={[
        { n: '.toc-list', f: 2 },
        { n: '.toc', f: 1 },
        { n: '.toc-heading', f: 1 },
        { n: '.toc-link', f: 0, t: 'wrong', fix: '.toc-list a.active' },
        { n: '.toc-link--active', f: 0, t: 'wrong', fix: '.toc-list a.active' },
        { n: '.toc-link--h3', f: 0, t: 'wrong', fix: '.toc-list a.active' },
        { n: 'TableOfContent', t: 'playbook' },
      ]}>
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
    <GallerySection title="Sidenav — Collapse, Expand & Mobile Drawer" desc=".sidenav-collapse-btn, .nav-expand-btn, .sidenav-drawer — states missing from §23"
      usage={[
        { n: '.sidenav-collapse-btn', f: 1 },
        { n: '.sidenav-collapse-bar', f: 1 },
        { n: '.sidenav-drawer', f: 1 },
        { n: '.sidenav-drawer-backdrop', f: 1 },
        { n: '.sidenav-drawer-header', f: 1 },
        { n: '.sidenav-drawer-close', f: 1 },
        { n: '.sidenav--collapsed', f: 1 },
        { n: '.sidenav-drawer--open', f: 1 },
        { n: '.nav-expand-btn', f: 1 },
        { n: 'Sidebar', t: 'playbook' },
        { n: 'Drawer', t: 'playbook' },
      ]}>

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
                    <svg width="80" height="15" viewBox="0 0 125 24" fill="none" style={{ display: 'block' }}>
                      <path fillRule="evenodd" clipRule="evenodd" d="M121.444 22.1291H124.999L125 13.0887C125 12.5 124.925 12.0676 124.859 11.7567C124.836 11.6515 124.816 11.5678 124.794 11.4864C124.092 8.90785 121.577 7.123 118.811 7.23655C117.528 7.29129 116.321 7.76661 115.225 8.64915L115.085 8.76169L114.945 8.64915C113.849 7.76661 112.642 7.29129 111.359 7.23655C108.59 7.12114 106.078 8.90785 105.376 11.4864C105.354 11.568 105.334 11.652 105.311 11.7577C105.242 12.0876 105.17 12.5049 105.17 13.0887L105.171 22.1291H108.726V13.242C108.726 11.9833 109.753 10.9593 111.015 10.9593C112.266 10.9593 113.292 11.9744 113.303 13.222C113.304 13.2264 113.304 13.2342 113.304 13.242V22.1291H116.866L116.867 13.2212C116.878 11.9744 117.904 10.9593 119.155 10.9593C120.417 10.9593 121.444 11.9833 121.444 13.242V22.1291Z" fill="currentColor"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M95.1744 18.5808C93.0256 18.5808 91.2773 16.8374 91.2773 14.6945C91.2773 12.5516 93.0256 10.8081 95.1744 10.8081C97.3234 10.8081 99.0716 12.5516 99.0716 14.6945C99.0716 16.8374 97.3234 18.5808 95.1744 18.5808ZM95.1741 7.25977C91.0633 7.25977 87.7188 10.5949 87.7188 14.6944C87.7188 18.794 91.0633 22.1292 95.1741 22.1292C99.285 22.1292 102.629 18.794 102.629 14.6944C102.629 10.5949 99.285 7.25977 95.1741 7.25977Z" fill="currentColor"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M82.9062 22.1324H87.5178L85.4546 18.5805C85.0074 18.58 83.1692 18.5776 83.026 18.5776C81.8791 18.5776 80.8802 17.7512 80.7994 16.7353C80.7887 16.6023 80.7791 16.4376 80.7716 16.2566V10.9014H85.4537L87.2833 7.69089H80.7716V1.86743L77.2102 4.32446V7.52023H74.9629V11.072H77.21L77.2134 15.9215C77.2134 15.9236 77.211 16.1479 77.2144 16.2125L77.228 16.4827C77.3498 18.8376 78.5126 20.5715 80.684 21.6355C81.2652 21.9202 81.908 22.0772 82.7073 22.1294L82.9062 22.1291V22.1324Z" fill="currentColor"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M68.864 22.129H72.4192L72.4198 13.0887C72.4198 12.5 72.3444 12.0676 72.2785 11.7567C72.2556 11.6514 72.2355 11.5677 72.2135 11.4863C71.512 8.90779 68.9973 7.12293 66.2307 7.23648C64.9479 7.29123 63.7413 7.76655 62.6447 8.64909L62.5049 8.76163L62.3651 8.64909C61.2685 7.76655 60.0619 7.29123 58.7788 7.23648C56.01 7.12108 53.4979 8.90779 52.7962 11.4863C52.774 11.5679 52.754 11.6519 52.731 11.7577C52.6613 12.0875 52.5898 12.5049 52.5898 13.0887L52.5905 22.129H56.1459V13.2419C56.1459 11.9833 57.1727 10.9593 58.4348 10.9593C59.6856 10.9593 60.7119 11.9743 60.7229 13.222C60.7233 13.2264 60.7238 13.2342 60.7238 13.2419V22.129H64.2861L64.2869 13.2211C64.2978 11.9743 65.3242 10.9593 66.5749 10.9593C67.8372 10.9593 68.864 11.9833 68.864 13.2419V22.129Z" fill="currentColor"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M42.5944 18.5808C40.4454 18.5808 38.6973 16.8374 38.6973 14.6945C38.6973 12.5516 40.4454 10.8081 42.5944 10.8081C44.7434 10.8081 46.4915 12.5516 46.4915 14.6945C46.4915 16.8374 44.7434 18.5808 42.5944 18.5808ZM42.594 7.25977C38.4831 7.25977 35.1387 10.5949 35.1387 14.6944C35.1387 18.794 38.4831 22.1292 42.594 22.1292C46.7049 22.1292 50.0493 18.794 50.0493 14.6944C50.0493 10.5949 46.7049 7.25977 42.594 7.25977Z" fill="currentColor"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M30.3261 22.1325H34.9378L32.8745 18.5805C32.4273 18.58 30.5891 18.5777 30.4459 18.5777C29.299 18.5777 28.3001 17.7512 28.2193 16.7354C28.2086 16.6024 28.199 16.4376 28.1915 16.2567V10.9014H32.8736L34.7033 7.69095H28.1915V1.86749L24.6301 4.32452V7.52029H22.3828V11.0721H24.6299L24.6333 15.9216C24.6333 15.9236 24.6309 16.148 24.6343 16.2126L24.6479 16.4827C24.7697 18.8377 25.9326 20.5715 28.1039 21.6355C28.6851 21.9203 29.328 22.0772 30.1272 22.1295L30.3261 22.1291V22.1325Z" fill="currentColor"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M8.28764 24.0001L11.4639 18.5139H5.11133L8.28764 24.0001Z" fill="#DF1B12"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M8.28694 12.5839C5.89835 12.5839 3.95522 10.6459 3.95522 8.26409C3.95522 5.88209 5.89835 3.94415 8.28694 3.94415C10.6755 3.94415 12.6187 5.88209 12.6187 8.26409C12.6187 10.6459 10.6755 12.5839 8.28694 12.5839ZM8.28694 0C3.7175 0 0 3.70725 0 8.26409C0 12.8208 3.7175 16.528 8.28694 16.528C12.8564 16.528 16.5739 12.8208 16.5739 8.26409C16.5739 3.70725 12.8564 0 8.28694 0Z" fill="#DF1B12"/>
                    </svg>
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
// §44  VERSION BADGES
// Added: Routing API param index + response tree (2026-05-12)
// Consolidation candidate: overlaps with Badges & Tags (§22) — same pill shape,
// different semantic (version vs status). Consider folding into §22 as a variant row.
// ─────────────────────────────────────────────────────────────────────────────

function VersionBadgesSection() {
  const vBadge = { fontSize: '0.625rem', fontWeight: 700, padding: '2px 6px', borderRadius: 4, fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' };
  const versions = [
    { label: 'v1', bg: 'rgba(34,197,94,0.1)',    color: '#15803d' },
    { label: 'v2', bg: 'rgba(167,139,250,0.1)',   color: '#7c3aed' },
    { label: 'v3', bg: 'rgba(251,146,60,0.1)',    color: '#c2410c' },
  ];
  return (
    <GallerySection
      title="Version Badges"
      desc="Inline v1/v2/v3 availability pills — used in Parameter Index table and Routing Intro comparison table. No dedicated CSS class; inline styles only."
      usage={[
        { n: 'version badge (inline)', f: 2 },
      ]}>
      <Row label="sizes & states" noBorder>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <StateLabel>Single badges</StateLabel>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {versions.map(v => (
                <span key={v.label} style={{ ...vBadge, background: v.bg, color: v.color }}>{v.label}</span>
              ))}
            </div>
          </div>
          <div>
            <StateLabel>Inline cluster (param index usage)</StateLabel>
            <div style={{ display: 'flex', gap: 4 }}>
              {versions.map(v => (
                <span key={v.label} style={{ ...vBadge, background: v.bg, color: v.color }}>{v.label}</span>
              ))}
            </div>
          </div>
          <div>
            <StateLabel>Paired with version label (Routing Intro table header)</StateLabel>
            <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
              {[
                { ver: 'V1', bg: 'rgba(34,197,94,0.1)', color: '#15803d', status: 'Production', statusBg: 'rgba(34,197,94,0.12)', statusColor: '#15803d' },
                { ver: 'V2', bg: 'rgba(167,139,250,0.1)', color: '#7c3aed', status: 'Public Preview', statusBg: 'rgba(168,85,247,0.12)', statusColor: '#7c3aed' },
                { ver: 'V3', bg: 'rgba(251,146,60,0.1)', color: '#c2410c', status: 'Private Preview', statusBg: 'rgba(234,179,8,0.12)', statusColor: '#92400e' },
              ].map(v => (
                <div key={v.ver} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: v.color }}>{v.ver}</span>
                  <span style={{ ...vBadge, background: v.statusBg, color: v.statusColor, textTransform: 'uppercase' }}>{v.status}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: '10px 14px', background: 'var(--s1)', borderRadius: 8, fontSize: '0.75rem', color: 'var(--muted)', maxWidth: 480 }}>
            <strong style={{ color: 'var(--mid)' }}>Consolidation note:</strong> Same shape as method badges (GET/POST in §22) and status pills in §22. Could unify into a single semantic-color pill system. Key difference: version badges are always monospace font.
          </div>
        </div>
      </Row>
    </GallerySection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §45  PARAMETER INDEX TABLE
// Added: RoutingGuidePages.jsx — RoutingParamIndex (2026-05-12)
// Consolidation candidate: §26 Tables uses generic table styles. This is a
// specialised 5-column API param table — consider extracting as a shared
// <ParamIndexTable> component if used on more than 1 page.
// ─────────────────────────────────────────────────────────────────────────────

function ParamIndexTableSection() {
  const thStyle = {
    padding: '0.5rem 0.75rem', textAlign: 'left', fontSize: '0.6875rem',
    fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase',
    letterSpacing: '0.06em', borderBottom: '2px solid var(--border)',
    background: 'var(--s1)',
  };
  const vBadge = { fontSize: '0.625rem', fontWeight: 700, padding: '2px 6px', borderRadius: 4, fontFamily: 'var(--font-mono)' };
  const sampleRows = [
    { name: 'avoid',       type: 'string (×n)',  dflt: '—',       v: [1,2,3], desc: 'Road or feature types to exclude.', values: 'tollRoads, motorways, ferries…', constraint: 'motorways may time out on routes > 500 km.' },
    { name: 'departAt',    type: 'datetime',     dflt: 'now',     v: [1,2,3], desc: 'Departure time (RFC 3339). Cannot combine with arriveAt.' },
    { name: 'maxAlternatives', type: 'integer',  dflt: '0',       v: [1,2,3], desc: 'Number of alternative routes (0–5).', constraint: 'Cannot combine with computeBestOrder=true.' },
    { name: 'vehicleHeading', type: 'integer',   dflt: '—',       v: [1,2],   desc: 'Heading in degrees clockwise from true north (0–359°).' },
  ];
  const vColors = { 1: { bg: 'rgba(34,197,94,0.1)', color: '#15803d' }, 2: { bg: 'rgba(167,139,250,0.1)', color: '#7c3aed' }, 3: { bg: 'rgba(251,146,60,0.1)', color: '#c2410c' } };

  return (
    <GallerySection
      title="Parameter Index Table"
      desc="Cross-version A–Z parameter table — name, type, default, version availability badges, description + constraints. Used in RoutingParamIndex. Inline styles only, no CSS class."
      usage={[
        { n: 'ParamIndexTable (inline)', f: 1 },
      ]}>
      <Row label="specimen (4 of 54 rows)" noBorder>
        <div style={{ overflowX: 'auto', borderRadius: 10, border: '1px solid var(--border)', width: '100%', maxWidth: 860 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, minWidth: 160 }}>Parameter</th>
                <th style={{ ...thStyle, minWidth: 100 }}>Type</th>
                <th style={{ ...thStyle, minWidth: 64 }}>Default</th>
                <th style={{ ...thStyle, minWidth: 80 }}>Versions</th>
                <th style={{ ...thStyle }}>Description &amp; constraints</th>
              </tr>
            </thead>
            <tbody>
              {sampleRows.map((p, i) => (
                <tr key={p.name} style={{ background: i % 2 === 0 ? 'var(--bg)' : 'var(--s1)', borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.45rem 0.75rem', verticalAlign: 'top' }}>
                    <code style={{ fontSize: '0.75rem', color: 'var(--brand)', fontFamily: 'var(--font-mono)' }}>{p.name}</code>
                  </td>
                  <td style={{ padding: '0.45rem 0.75rem', verticalAlign: 'top' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{p.type}</span>
                  </td>
                  <td style={{ padding: '0.45rem 0.75rem', verticalAlign: 'top' }}>
                    <code style={{ fontSize: '0.75rem', color: 'var(--mid)', fontFamily: 'var(--font-mono)' }}>{p.dflt}</code>
                  </td>
                  <td style={{ padding: '0.45rem 0.75rem', verticalAlign: 'top' }}>
                    <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      {p.v.map(n => <span key={n} style={{ ...vBadge, background: vColors[n].bg, color: vColors[n].color }}>v{n}</span>)}
                    </div>
                  </td>
                  <td style={{ padding: '0.45rem 0.75rem', verticalAlign: 'top', color: 'var(--text)', lineHeight: 1.5 }}>
                    {p.desc}
                    {p.values && <div style={{ marginTop: 3, fontSize: '0.75rem', color: 'var(--muted)' }}>Values: <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{p.values}</code></div>}
                    {p.constraint && <div style={{ marginTop: 3, fontSize: '0.75rem', color: 'var(--muted)', fontStyle: 'italic' }}>{p.constraint}</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Row>
      <Row label="consolidation note">
        <div style={{ padding: '10px 14px', background: 'var(--s1)', borderRadius: 8, fontSize: '0.75rem', color: 'var(--muted)', maxWidth: 560 }}>
          <strong style={{ color: 'var(--mid)' }}>vs §26 Tables:</strong> Generic tables use <code style={{ fontFamily: 'var(--font-mono)' }}>.data-table</code> CSS class. This is inline-styled with version badge columns. If a second endpoint gets its own param index, extract a shared <code style={{ fontFamily: 'var(--font-mono)' }}>{'<ParamIndexTable>'}</code> component with the badge logic built in.
        </div>
      </Row>
    </GallerySection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §46  RESPONSE SCHEMA TREE
// Added: RoutingGuidePages.jsx — RoutingResponseRef (2026-05-12)
// Consolidation candidate: unique pattern currently. If used for other API
// response schemas (LDEVR, Search, etc.) extract as a shared <SchemaTree>
// component. The renderTree() function is currently inlined per page.
// ─────────────────────────────────────────────────────────────────────────────

function ResponseTreeSection() {
  const sampleTree = [
    {
      key: 'routes[]', type: 'Route[]', desc: 'Array of route objects. Index 0 is the primary route.',
      children: [
        {
          key: 'summary', type: 'RouteSummary', desc: 'Aggregate statistics for the full route.',
          children: [
            { key: 'lengthInMeters',      type: 'integer',          desc: 'Total route distance in metres.' },
            { key: 'travelTimeInSeconds', type: 'integer',          desc: 'Total travel time including real-time traffic.' },
            { key: 'arrivalTime',         type: 'string (RFC 3339)', desc: 'Estimated arrival timestamp.' },
          ],
        },
        {
          key: 'legs[]', type: 'Leg[]', desc: 'One leg per consecutive waypoint pair.',
          children: [
            { key: 'points[]', type: 'GeoPoint[]', desc: 'Ordered polyline coordinates.' },
          ],
        },
      ],
    },
    { key: 'warnings[]', type: 'Warning[]', desc: 'Non-fatal issues. Route was calculated but params may have been adjusted.' },
  ];

  const renderTree = (nodes, depth = 0) => nodes.map(node => (
    <div key={node.key} style={{ marginLeft: depth * 20 }}>
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: '0.625rem',
        padding: '0.375rem 0.75rem',
        borderLeft: depth > 0 ? '2px solid var(--border)' : 'none',
        marginLeft: depth > 0 ? '8px' : 0,
      }}>
        <code style={{ fontSize: '0.75rem', color: 'var(--brand)', fontFamily: 'var(--font-mono)', flexShrink: 0, minWidth: 160 }}>{node.key}</code>
        <span style={{ fontSize: '0.6875rem', color: 'var(--muted)', flexShrink: 0, minWidth: 80 }}>{node.type}</span>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text)' }}>{node.desc}</span>
      </div>
      {node.children && renderTree(node.children, depth + 1)}
    </div>
  ));

  return (
    <GallerySection
      title="Response Schema Tree"
      desc="Nested key→type→desc hierarchy for API response documentation. Depth-indented with border-left connectors. renderTree() currently inlined in RoutingResponseRef."
      usage={[
        { n: 'renderTree (inline)', f: 1 },
      ]}>
      <Row label="specimen" noBorder>
        <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 12, padding: '0.5rem 0', width: '100%', maxWidth: 720, overflow: 'hidden' }}>
          {renderTree(sampleTree)}
        </div>
      </Row>
      <Row label="depth levels">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.75rem', color: 'var(--muted)', maxWidth: 480 }}>
          <div><strong style={{ color: 'var(--mid)' }}>Depth 0</strong> — root fields. No left border. Key in brand red.</div>
          <div><strong style={{ color: 'var(--mid)' }}>Depth 1+</strong> — child fields. 2px left border, 8px left margin per level. 20px indent per level via marginLeft.</div>
          <div><strong style={{ color: 'var(--mid)' }}>Consolidation note:</strong> If LDEVR, Search API, or other products need response schema docs, extract as <code style={{ fontFamily: 'var(--font-mono)' }}>{'<SchemaTree nodes={} />'}</code> with the recursive renderer inside.</div>
        </div>
      </Row>
    </GallerySection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §47  GUIDE LANDING CARD
// Added: RoutingGuidePages.jsx — RoutingEVLanding + RoutingHowToLanding (2026-05-12)
// Consolidation candidate: Similar hover-border pattern to .text-card (§36) and
// Nav Cards (§15). Key difference: 20px border-radius vs text-card's tighter radius,
// no label pill, no icon. Consider unifying with text-card using a size/shape variant.
// ─────────────────────────────────────────────────────────────────────────────

function GuideLandingCardSection() {
  const cardBase = {
    background: 'var(--bg)', border: '1px solid var(--border)',
    borderRadius: '20px', padding: '1.25rem', cursor: 'pointer',
    textAlign: 'left', display: 'block', width: '100%',
  };

  return (
    <GallerySection
      title="Guide Landing Card"
      desc="Hover-border card used on EV Routing and How-to landing pages. No icon, no label pill — title + desc only. 20px radius, brand-color border on hover. Inline styles only."
      usage={[
        { n: 'guide landing card (inline)', f: 1 },
      ]}>
      <Row label="states" noBorder>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ width: 220 }}>
            <StateLabel>Default</StateLabel>
            <div style={{ ...cardBase, pointerEvents: 'none' }}>
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>EV Route Planning</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', lineHeight: 1.5 }}>Configure multi-stop EV routes with automatic charging stop insertion.</div>
            </div>
          </div>
          <div style={{ width: 220 }}>
            <StateLabel>Hover (simulated)</StateLabel>
            <div style={{ ...cardBase, borderColor: 'var(--brand)', pointerEvents: 'none' }}>
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>Consumption Models</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', lineHeight: 1.5 }}>Model combustion and electric consumption per vehicle type.</div>
            </div>
          </div>
        </div>
      </Row>
      <Row label="vs text-card (§36)">
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ width: 200 }}>
            <StateLabel>text-card (existing)</StateLabel>
            <div className="text-card" style={{ padding: '14px 16px', pointerEvents: 'none' }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Guide</div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--black)', marginBottom: 5 }}>EV Route Planning</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.55 }}>Has a label pill above the title.</div>
            </div>
          </div>
          <div style={{ width: 200 }}>
            <StateLabel>guide landing card (new)</StateLabel>
            <div style={{ ...cardBase, pointerEvents: 'none' }}>
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.375rem' }}>EV Route Planning</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', lineHeight: 1.5 }}>No label. Larger radius, larger title weight.</div>
            </div>
          </div>
          <div style={{ padding: '10px 14px', background: 'var(--s1)', borderRadius: 8, fontSize: '0.75rem', color: 'var(--muted)', maxWidth: 260, alignSelf: 'center' }}>
            <strong style={{ color: 'var(--mid)' }}>Consolidation note:</strong> Both have hover-border transition and serve as navigation cards to sub-pages. Could unify as a single card with an optional <code style={{ fontFamily: 'var(--font-mono)' }}>label</code> prop.
          </div>
        </div>
      </Row>
    </GallerySection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §48 — NAV OPTION B  (concept-first + vDots)
// ─────────────────────────────────────────────────────────────────────────────

/** Tiny coloured dot showing version coverage inline in a nav item */
function VDot({ v }) {
  const COLOR = { v1: '#22c55e', v2: '#a78bfa', v3: '#fb923c' };
  return (
    <span title={v} style={{
      width: 5, height: 5, borderRadius: '50%',
      background: COLOR[v] ?? '#9ca3af',
      flexShrink: 0,
      display: 'inline-block',
    }} />
  );
}

/** One simulated nav item with optional vDots cluster */
function NavItemRow({ label, active, vDots, indent }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: `4px ${indent ? 22 : 10}px`,
      background: active ? 'var(--s1)' : 'transparent',
      borderRadius: 4,
      marginBottom: 1,
      cursor: 'default',
    }}>
      <span style={{ fontSize: '0.6875rem', color: active ? 'var(--black)' : 'var(--mid)', fontWeight: active ? 600 : 400 }}>{label}</span>
      {vDots && (
        <span style={{ display: 'flex', gap: 3, alignItems: 'center', marginLeft: 8 }}>
          {vDots.map(v => <VDot key={v} v={v} />)}
        </span>
      )}
    </div>
  );
}

function NavOptionBSection() {
  const [activeItem, setActiveItem] = useState('Calculate Route');

  const ENDPOINTS = [
    { label: 'Calculate Route',          vDots: ['v1','v2','v3'] },
    { label: 'Reachable Range',          vDots: ['v1','v2','v3'] },
    { label: 'Lane Guidance',            vDots: ['v1','v2','v3'] },
    { label: 'Batch Routing',            vDots: ['v1'] },
    { label: 'Turn-by-Turn Instructions',vDots: ['v1'] },
    { label: 'Guidance Instructions',    vDots: ['v2','v3'] },
    { label: 'Compute Toll Amounts',     vDots: ['v2','v3'] },
    { label: 'Dynamic Data Freshness',   vDots: ['v2'] },
    { label: 'Road Shield Notes',        vDots: ['v1'] },
    { label: 'Weather Consideration',    vDots: ['v3'] },
  ];

  const V_LEGEND = [
    { v: 'v1', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', label: 'V1 · Production' },
    { v: 'v2', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', label: 'V2 · Public Preview' },
    { v: 'v3', color: '#fb923c', bg: 'rgba(251,146,60,0.1)', label: 'V3 · Private Preview' },
  ];

  return (
    <GallerySection
      title="Sidenav — Option B: Concept-first + vDots"
      desc="One entry per endpoint concept; coloured dots on the right show which versions support it"
      usage={[
        { n: 'vDots', f: 0, t: 'missing' },
        { n: 'ROUTING_API_NAV_B', f: 1 },
        { n: 'CONCEPT_ENDPOINTS', f: 1 },
      ]}
    >
      <Row label="endpoint list with version coverage dots">
        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* Simulated sidenav */}
          <div style={{ width: 220, border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', background: 'var(--white)' }}>
            {/* Top links */}
            <div style={{ padding: '10px 10px 4px' }}>
              {['Introduction', 'Quick Start'].map(l => (
                <div key={l} onClick={() => setActiveItem(l)} style={{ padding: '4px 10px', fontSize: '0.6875rem', color: activeItem === l ? 'var(--black)' : 'var(--mid)', fontWeight: activeItem === l ? 600 : 400, background: activeItem === l ? 'var(--s1)' : 'transparent', borderRadius: 4, marginBottom: 1, cursor: 'pointer' }}>{l}</div>
              ))}
            </div>
            {/* Endpoints section */}
            <div style={{ padding: '4px 0 4px' }}>
              <div style={{ padding: '6px 10px 3px', fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>Endpoints</div>
              {ENDPOINTS.map(({ label, vDots }) => (
                <div
                  key={label}
                  onClick={() => setActiveItem(label)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '4px 10px',
                    background: activeItem === label ? 'var(--s1)' : 'transparent',
                    borderRadius: 4, marginBottom: 1, cursor: 'pointer', marginLeft: 6, marginRight: 6,
                  }}
                >
                  <span style={{ fontSize: '0.6875rem', color: activeItem === label ? 'var(--black)' : 'var(--mid)', fontWeight: activeItem === label ? 600 : 400 }}>{label}</span>
                  <span style={{ display: 'flex', gap: 3, alignItems: 'center', marginLeft: 6 }}>
                    {vDots.map(v => <VDot key={v} v={v} />)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Legend + rationale */}
          <div style={{ maxWidth: 340 }}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--black)', marginBottom: 8 }}>Version dot legend</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {V_LEGEND.map(({ v, color, bg, label }) => (
                  <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0, display: 'inline-block' }} />
                    <span style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', padding: '1px 7px', borderRadius: 99, background: bg, color, fontWeight: 700, border: `1px solid ${color}55` }}>{v.toUpperCase()}</span>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--mid)' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--black)' }}>Rationale:</strong> Eliminates version-section repetition (Calculate Route × 3) while keeping
              version availability visible at a glance. Clicking an endpoint lands on the merged
              concept page — anchors let the developer jump to v1/v2/v3 sections directly.
              Reduces nav depth from ~25 items → 10 endpoint rows.
            </div>
          </div>
        </div>
      </Row>

      <Row label="dot anatomy — 5×5 px circles, flex gap-3, right-aligned" noBorder>
        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Annotation diagram */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { label: 'v1 only',    dots: ['v1'] },
              { label: 'v1 + v2',   dots: ['v1','v2'] },
              { label: 'v2 + v3',   dots: ['v2','v3'] },
              { label: 'all 3',     dots: ['v1','v2','v3'] },
            ].map(({ label, dots }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: '0.6875rem', color: 'var(--mid)', width: 60 }}>{label}</span>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: 180, padding: '4px 10px', border: '1px solid var(--border)', borderRadius: 4, background: 'var(--white)',
                }}>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--mid)' }}>Endpoint label</span>
                  <span style={{ display: 'flex', gap: 3 }}>{dots.map(v => <VDot key={v} v={v} />)}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--muted)', lineHeight: 1.65, maxWidth: 260 }}>
            Dots are <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem' }}>5×5px</code> circles with{' '}
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem' }}>border-radius: 50%</code>.{' '}
            Absent means "not supported in this version" — the absence is informative.
            Colour matches version badges throughout the app: green / purple / orange.
          </div>
        </div>
      </Row>
    </GallerySection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §49 — NAV OPTION C  (concept-first + version-filter control)
// ─────────────────────────────────────────────────────────────────────────────

function NavOptionCSection() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeItem, setActiveItem] = useState('Calculate Route');

  const V_FILTER_OPTS = [
    { id: 'all', label: 'All' },
    { id: 'v1',  label: 'V1',  color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
    { id: 'v2',  label: 'V2',  color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
    { id: 'v3',  label: 'V3',  color: '#fb923c', bg: 'rgba(251,146,60,0.12)' },
  ];

  const ENDPOINTS_C = [
    { label: 'Calculate Route',          vDots: ['v1','v2','v3'] },
    { label: 'Reachable Range',          vDots: ['v1','v2','v3'] },
    { label: 'Lane Guidance',            vDots: ['v1','v2','v3'] },
    { label: 'Batch Routing',            vDots: ['v1'] },
    { label: 'Turn-by-Turn Instructions',vDots: ['v1'] },
    { label: 'Guidance Instructions',    vDots: ['v2','v3'] },
    { label: 'Compute Toll Amounts',     vDots: ['v2','v3'] },
    { label: 'Dynamic Data Freshness',   vDots: ['v2'] },
    { label: 'Road Shield Notes',        vDots: ['v1'] },
    { label: 'Weather Consideration',    vDots: ['v3'] },
  ];

  const visible = ENDPOINTS_C.filter(e => activeFilter === 'all' || e.vDots.includes(activeFilter));

  const filterOpt = (opt) => {
    const isActive = activeFilter === opt.id;
    const color    = opt.color ?? 'var(--mid)';
    const bg       = opt.bg    ?? 'transparent';
    return (
      <button
        key={opt.id}
        onClick={() => setActiveFilter(opt.id)}
        style={{
          fontSize: '0.6rem', fontWeight: 700, padding: '3px 8px',
          borderRadius: 4,
          border: isActive ? `1.5px solid ${color}` : '1px solid var(--border)',
          background: isActive ? bg : 'transparent',
          color: isActive ? color : 'var(--mid)',
          cursor: 'pointer', transition: 'all 0.12s',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.02em',
        }}
      >
        {opt.label}
      </button>
    );
  };

  return (
    <GallerySection
      title="Sidenav — Option C: Concept-first + Version Filter"
      desc="Adds a segmented All / V1 / V2 / V3 control; endpoints whose vDots don't match the active filter are hidden"
      usage={[
        { n: 'version-filter', f: 0, t: 'missing' },
        { n: 'ROUTING_API_NAV_C', f: 0 },
      ]}
    >
      <Row label="version filter control + filtered endpoint list">
        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* Simulated sidenav */}
          <div style={{ width: 220, border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', background: 'var(--white)' }}>
            {/* Top links */}
            <div style={{ padding: '10px 10px 4px' }}>
              {['Introduction', 'Quick Start'].map(l => (
                <div key={l} onClick={() => setActiveItem(l)} style={{ padding: '4px 10px', fontSize: '0.6875rem', color: activeItem === l ? 'var(--black)' : 'var(--mid)', fontWeight: activeItem === l ? 600 : 400, background: activeItem === l ? 'var(--s1)' : 'transparent', borderRadius: 4, marginBottom: 1, cursor: 'pointer' }}>{l}</div>
              ))}
            </div>

            {/* Version filter control (type: 'version-filter') */}
            <div style={{ padding: '8px 10px 6px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
              <div style={{ fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 5 }}>Filter by version</div>
              <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                {V_FILTER_OPTS.map(filterOpt)}
              </div>
            </div>

            {/* Filtered endpoint list */}
            <div style={{ padding: '6px 0 4px' }}>
              <div style={{ padding: '4px 10px 3px', fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                Endpoints{activeFilter !== 'all' && <span style={{ marginLeft: 4, color: activeFilter === 'v1' ? '#22c55e' : activeFilter === 'v2' ? '#a78bfa' : '#fb923c' }}>({visible.length})</span>}
              </div>
              {visible.map(({ label, vDots }) => (
                <div
                  key={label}
                  onClick={() => setActiveItem(label)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '4px 10px',
                    background: activeItem === label ? 'var(--s1)' : 'transparent',
                    borderRadius: 4, marginBottom: 1, cursor: 'pointer', marginLeft: 6, marginRight: 6,
                  }}
                >
                  <span style={{ fontSize: '0.6875rem', color: activeItem === label ? 'var(--black)' : 'var(--mid)', fontWeight: activeItem === label ? 600 : 400 }}>{label}</span>
                  <span style={{ display: 'flex', gap: 3, alignItems: 'center', marginLeft: 6 }}>
                    {vDots.map(v => <VDot key={v} v={v} />)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Filter states breakdown */}
          <div style={{ maxWidth: 340 }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--black)', marginBottom: 10 }}>Filter output — active: <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', padding: '1px 7px', borderRadius: 99, background: 'var(--s1)', border: '1px solid var(--border)' }}>{activeFilter}</span></div>
            <div style={{ marginBottom: 12, fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.6 }}>
              Showing <strong style={{ color: 'var(--black)' }}>{visible.length}</strong> of {ENDPOINTS_C.length} endpoints.
              {activeFilter !== 'all' && <> Hidden items still exist in the nav data — they're just not rendered.</>}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--black)' }}>Implementation note:</strong> The <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem' }}>{'{ type: \'version-filter\' }'}</code> entry in{' '}
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem' }}>ROUTING_API_NAV_C</code>{' '}
              is a special nav node. Sidenav.jsx reads it and renders the filter control;
              endpoint items below it are conditionally rendered based on <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem' }}>vDots</code> membership.
            </div>
          </div>
        </div>
      </Row>

      <Row label="option B vs C — decision surface" noBorder>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            {
              label: 'Option B — always-on dots',
              points: ['Zero interaction required', 'All endpoints always visible', 'Dots are ambient — scannable', 'Best for devs exploring the API'],
              accent: '#a78bfa',
              bg: 'rgba(167,139,250,0.07)',
            },
            {
              label: 'Option C — explicit filter',
              points: ['Reduces noise when working in one version', 'State visible in the control', 'Requires a click to narrow scope', 'Best for versioned migration work'],
              accent: '#fb923c',
              bg: 'rgba(251,146,60,0.07)',
            },
          ].map(({ label, points, accent, bg }) => (
            <div key={label} style={{ flex: '1 1 220px', border: `1px solid ${accent}44`, borderRadius: 8, padding: '12px 14px', background: bg }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: accent, marginBottom: 8 }}>{label}</div>
              <ul style={{ margin: 0, paddingLeft: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {points.map(p => <li key={p} style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.5 }}>{p}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </Row>
    </GallerySection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT — PAGE HEADER + ALL SECTIONS
// ─────────────────────────────────────────────────────────────────────────────

export default function UIComponentGallery() {
  // ── Decision mode state ──────────────────────────────────────────────────
  const [decisionMode, setDecisionMode] = useState(false);
  const [decisions, setDecisionsState] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ux-gallery-decisions') || '{}'); }
    catch { return {}; }
  });

  const setDecision = (title, data) => {
    const next = { ...decisions, [title]: data };
    setDecisionsState(next);
    localStorage.setItem('ux-gallery-decisions', JSON.stringify(next));
  };

  const clearDecisions = () => {
    if (!window.confirm('Clear all decisions? This cannot be undone.')) return;
    setDecisionsState({});
    localStorage.removeItem('ux-gallery-decisions');
  };

  // ── Quick-jump groups: [ groupLabel, [ [href, label], ... ] ] ────────────
  const JUMP_GROUPS = [
    ['Foundations', [
      ['#s1',  'Design Tokens'],
      ['#s2',  'Token Display'],
      ['#s3',  'Typography'],
      ['#s4',  'Token Names'],
      ['#s5',  'Token Flow'],
      ['#s6',  'Theming Card'],
    ]],
    ['App Shell', [
      ['#s7',  'Shell Layout'],
      ['#s8',  'Global Header'],
      ['#s9',  'Sidenav'],
      ['#s10', 'Sidenav Full'],
      ['#s11', 'TOC'],
      ['#s12', 'Page Anatomy'],
      ['#s13', 'Page Actions'],
      ['#s14', 'Layout Utils'],
      ['#s48', 'Nav Option B'],
      ['#s49', 'Nav Option C'],
    ]],
    ['Navigation', [
      ['#s15', 'Nav Cards'],
      ['#s16', 'Domain Cards'],
      ['#s17', 'DocsPortal Cards'],
      ['#s18', 'API Links'],
      ['#s19', 'Platform Switcher'],
      ['#s20', 'Tab Bar'],
    ]],
    ['Core Components', [
      ['#s21', 'Buttons'],
      ['#s22', 'Badges & Tags'],
      ['#s23', 'Forms & Inputs'],
      ['#s24', 'Status States'],
      ['#s25', 'Steps'],
      ['#s26', 'Tables'],
      ['#s27', 'Modal'],
      ['#s28', 'Callouts'],
    ]],
    ['API Reference', [
      ['#s29', 'ApiRef Layout'],
      ['#s30', 'Code Blocks'],
      ['#s31', 'Param Cards'],
      ['#s32', 'Spec Table'],
      ['#s33', 'Inline Patterns'],
      ['#s34', 'TryIt Panel'],
      ['#s35', 'AI Panel'],
      ['#s44', 'Version Badges'],
      ['#s45', 'Param Index Table'],
      ['#s46', 'Response Tree'],
    ]],
    ['Content Patterns', [
      ['#s36', 'Text Card'],
      ['#s37', 'Anatomy Cards'],
      ['#s38', 'Scenario Cards'],
      ['#s39', 'Benefit Cards'],
      ['#s40', 'Semantic Cards'],
      ['#s41', 'Private Preview'],
      ['#s47', 'Guide Landing Card'],
    ]],
    ['Special', [
      ['#s42', 'ADAS Stack'],
      ['#s43', 'Illo Card'],
    ]],
  ];

  // ── Decision export ────────────────────────────────────────────────────────
  const exportDecisions = () => {
    const allSections = JUMP_GROUPS.flatMap(([, items]) => items.map(([id, label]) => ({ id, label })));

    // Collect all row-level decision keys grouped by section
    const rowsBySection = {};
    Object.keys(decisions).forEach(key => {
      const sep = key.indexOf('::');
      if (sep === -1) return; // section-level key, skip here
      const sectionTitle = key.slice(0, sep);
      const rowLabel     = key.slice(sep + 2);
      if (!rowsBySection[sectionTitle]) rowsBySection[sectionTitle] = [];
      const d = decisions[key];
      if ((d?.status ?? 'undecided') !== 'undecided') {
        rowsBySection[sectionTitle].push({
          row: rowLabel,
          decision: d.status,
          ...(d.mergeInto ? { mergeInto: d.mergeInto } : {}),
        });
      }
    });

    const decisionRows = allSections.map(({ id, label }) => {
      const d    = decisions[label] || { status: 'undecided' };
      const rows = rowsBySection[label] || [];
      return {
        id,
        section: label,
        decision: d.status,
        ...(d.mergeInto ? { mergeInto: d.mergeInto } : {}),
        ...(rows.length ? { rows } : {}),
      };
    });

    const summary = { keep: 0, merge: 0, erase: 0, undecided: 0 };
    decisionRows.forEach(r => { summary[r.decision] = (summary[r.decision] || 0) + 1; });

    const totalRowDecisions = Object.values(rowsBySection).reduce((n, arr) => n + arr.length, 0);

    const data = {
      exportedAt: new Date().toISOString(),
      summary: { ...summary, rowLevelDecisions: totalRowDecisions },
      decisions: decisionRows,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement('a'), { href: url, download: 'ux-refactor-decisions.json' });
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Decision progress counts ───────────────────────────────────────────────
  const allSectionLabels = JUMP_GROUPS.flatMap(([, items]) => items.map(([, label]) => label));
  const decisionCounts   = { keep: 0, merge: 0, erase: 0, undecided: 0 };
  allSectionLabels.forEach(label => {
    const s = decisions[label]?.status || 'undecided';
    decisionCounts[s] = (decisionCounts[s] || 0) + 1;
  });
  const reviewed = allSectionLabels.length - decisionCounts.undecided;

  // Row-level decision totals (keys containing '::')
  const rowDecisionTotals = { keep: 0, merge: 0, erase: 0 };
  Object.keys(decisions).forEach(key => {
    if (!key.includes('::')) return;
    const s = decisions[key]?.status;
    if (s && s !== 'undecided') rowDecisionTotals[s] = (rowDecisionTotals[s] || 0) + 1;
  });
  const totalRowMarked = rowDecisionTotals.keep + rowDecisionTotals.merge + rowDecisionTotals.erase;

  return (
    <DecisionContext.Provider value={{ active: decisionMode, decisions, setDecision }}>
    <div style={{ padding: '32px 40px' }}>

      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 6 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--black)', margin: 0 }}>
            UI Component Gallery
          </h1>
          {/* Decision mode toggle */}
          <button
            onClick={() => setDecisionMode(v => !v)}
            style={{
              flexShrink: 0,
              fontSize: '0.6875rem', fontWeight: 700,
              padding: '6px 14px', borderRadius: 20,
              border: decisionMode ? '1px solid #7c3aed' : '1px solid var(--border)',
              background: decisionMode ? '#7c3aed' : 'var(--bg)',
              color: decisionMode ? '#fff' : 'var(--mid)',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            {decisionMode ? '✕ Exit decision mode' : '⊕ Decision mode'}
          </button>
        </div>

        {/* Decision mode stats bar */}
        {decisionMode && (
          <div style={{
            marginBottom: 14, padding: '10px 14px',
            background: '#f5f3ff', border: '1px solid #c4b5fd',
            borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#5b21b6' }}>
              {reviewed} / {allSectionLabels.length} sections
            </span>
            {totalRowMarked > 0 && (
              <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#6366f1', background: '#eef2ff', border: '1px solid #c7d2fe', padding: '2px 7px', borderRadius: 99 }}>
                + {totalRowMarked} row{totalRowMarked !== 1 ? 's' : ''} marked
              </span>
            )}
            <div style={{ height: 6, flex: 1, minWidth: 120, background: '#e9d5ff', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(reviewed / allSectionLabels.length) * 100}%`, background: '#7c3aed', borderRadius: 99, transition: 'width 0.3s' }} />
            </div>
            {[
              { s: 'keep',  label: '✓ keep',  color: '#166534', bg: '#dcfce7' },
              { s: 'merge', label: '⇒ merge', color: '#92400e', bg: '#fef3c7' },
              { s: 'erase', label: '✕ erase', color: '#991b1b', bg: '#fee2e2' },
            ].map(({ s, label, color, bg }) => decisionCounts[s] > 0 && (
              <span key={s} style={{ fontSize: '0.625rem', fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: bg, color }}>{decisionCounts[s]} {label}</span>
            ))}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
              <button
                onClick={exportDecisions}
                style={{
                  fontSize: '0.625rem', fontWeight: 700, padding: '4px 10px', borderRadius: 99,
                  border: '1px solid #7c3aed', background: '#fff', color: '#7c3aed', cursor: 'pointer',
                }}
              >
                ↓ Export decisions.json
              </button>
              <button
                onClick={clearDecisions}
                style={{
                  fontSize: '0.625rem', fontWeight: 700, padding: '4px 10px', borderRadius: 99,
                  border: '1px solid #fca5a5', background: '#fff', color: '#991b1b', cursor: 'pointer',
                }}
              >
                ✕ Clear all
              </button>
            </div>
          </div>
        )}

        <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 0, lineHeight: 1.55 }}>
          Every reusable component and inline pattern with all visual states — side by side.
          Use this to spot inconsistencies before shipping design changes.
        </p>

        {/* Quick jump nav — grouped */}
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {JUMP_GROUPS.map(([groupLabel, items]) => (
            <div key={groupLabel} style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
                color: 'var(--muted)', whiteSpace: 'nowrap', minWidth: 90,
              }}>{groupLabel}</span>
              {items.map(([href, label]) => (
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
          ))}
        </div>
      </div>

      {/* ── FOUNDATIONS ── */}
      <div id="s1"><DesignTokensSection /></div>
      <div id="s2"><TokenDisplaySection /></div>
      <div id="s3"><TypographyPatternsSection /></div>
      <div id="s4"><TokenNamingSection /></div>
      <div id="s5"><TokenFlowSection /></div>
      <div id="s6"><ThemingCardSection /></div>

      {/* ── APP SHELL ── */}
      <div id="s7"><ShellLayoutSection /></div>
      <div id="s8"><HeaderNavSection /></div>
      <div id="s9"><SidenavSection /></div>
      <div id="s10"><SidenavFullSection /></div>
      <div id="s11"><TocSection /></div>
      <div id="s12"><PageAnatomySection /></div>
      <div id="s13"><PageActionsSection /></div>
      <div id="s14"><PageLayoutUtilitiesSection /></div>
      <div id="s48"><NavOptionBSection /></div>
      <div id="s49"><NavOptionCSection /></div>

      {/* ── NAVIGATION ── */}
      <div id="s15"><NavCardsSection /></div>
      <div id="s16"><DomainCardsSection /></div>
      <div id="s17"><DocsPortal2Section /></div>
      <div id="s18"><ApiLinksSection /></div>
      <div id="s19"><PlatformSwitcherSection /></div>
      <div id="s20"><TabBarSection /></div>

      {/* ── CORE COMPONENTS ── */}
      <div id="s21"><ButtonsSection /></div>
      <div id="s22"><BadgesSection /></div>
      <div id="s23"><FormsSection /></div>
      <div id="s24"><StatusSection /></div>
      <div id="s25"><StepsSection /></div>
      <div id="s26"><TablesSection /></div>
      <div id="s27"><ModalSection /></div>
      <div id="s28"><CalloutsSection /></div>

      {/* ── API REFERENCE ── */}
      <div id="s29"><ApiRefLayoutSection /></div>
      <div id="s30"><CodeBlocksSection /></div>
      <div id="s31"><ParamCardsSection /></div>
      <div id="s32"><SpecMethodTableSection /></div>
      <div id="s33"><InlinePatternsSection /></div>
      <div id="s34"><TryItPanelSection /></div>
      <div id="s35"><AIPanelSection /></div>
      <div id="s44"><VersionBadgesSection /></div>
      <div id="s45"><ParamIndexTableSection /></div>
      <div id="s46"><ResponseTreeSection /></div>

      {/* ── CONTENT PATTERNS ── */}
      <div id="s36"><TextCardSection /></div>
      <div id="s37"><AnatomyCardsSection /></div>
      <div id="s38"><ScenarioCardsSection /></div>
      <div id="s39"><BenefitCardsSection /></div>
      <div id="s40"><SemanticCardsSection /></div>
      <div id="s41"><PrivatePreviewSection /></div>
      <div id="s47"><GuideLandingCardSection /></div>

      {/* ── SPECIAL ── */}
      <div id="s42"><AdasSection /></div>
      <div id="s43"><IlloCardSection /></div>

      {/* Footer note */}
      <div style={{
        marginTop: 12, paddingTop: 20, borderTop: '1px solid var(--border)',
        fontSize: '0.75rem', color: 'var(--t-dis)', lineHeight: 1.6,
      }}>
        Internal audit page · Plumbing Portal · 49 sections · 7 groups · All components sourced from{' '}
        <code style={{ fontFamily: 'var(--font-mono)' }}>src/components/ui/</code> and{' '}
        <code style={{ fontFamily: 'var(--font-mono)' }}>src/index.css</code>
      </div>
    </div>
    </DecisionContext.Provider>
  );
}
