import { useState, useEffect, useRef, useMemo } from 'react';
import PageActions from './PageActions';
import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import javascript from 'highlight.js/lib/languages/javascript';

hljs.registerLanguage('bash', bash);
hljs.registerLanguage('json', json);
hljs.registerLanguage('javascript', javascript);

/* ─── Attribute name colour — uses CSS var so it inverts correctly in dark mode ── */
const ATTR_COLOR = 'var(--black)';

/* ─── Apply token substitutions to a raw code string ────────────────────────── */
function applyTokens(code, tokens, sectionSelected) {
  let result = code;
  for (const [paramName, tokenStr] of Object.entries(tokens || {})) {
    const chosen = sectionSelected?.[paramName];
    if (chosen) {
      const eq = tokenStr.indexOf('=');
      if (eq !== -1) {
        result = result.replaceAll(tokenStr, tokenStr.slice(0, eq + 1) + chosen);
      }
    }
  }
  return result;
}

/* ─── Wrap each line in a <span class="cb-line"> for CSS counter line numbers ─── */
function addLineNumbers(html) {
  const lines = html.split('\n');
  if (lines[lines.length - 1] === '') lines.pop();
  return lines.map(l => `<span class="cb-line">${l}</span>`).join('\n');
}

/* ─── Inject highlight spans into hljs HTML for changed token values ─────────── */
function injectHighlights(html, tokens, sectionSelected) {
  let result = html;
  for (const [paramName, tokenStr] of Object.entries(tokens || {})) {
    const chosen = sectionSelected?.[paramName];
    if (!chosen) continue;
    const esc = chosen.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Match =value followed by &, \, newline, or < (safe for URL params and JSON strings)
    result = result.replace(
      new RegExp(`(=)(${esc})(?=[&\\\\\\n<"'\\s]|$)`, 'g'),
      `$1<span class="tt-changed">${chosen}</span>`
    );
  }
  return result;
}

/* ─── Single parameter row (exported for use in response sections) ───────────── */
export function ParamRow({
  name, required, type, default: def, desc, values, children: childParams,
  depth = 0,
  /* interactivity */
  selectedValue, onSelect,
}) {
  const [childrenOpen, setChildrenOpen] = useState(false);
  const hasChildren = childParams?.length > 0;

  // Split on last dot → muted prefix + bold leaf  (e.g. "legs[].routeStop" → "legs[]." + "routeStop")
  const safeName = name ?? '';
  const lastDot  = safeName.lastIndexOf('.');
  const prefix   = lastDot > -1 ? safeName.slice(0, lastDot) : null;
  const leaf     = lastDot > -1 ? safeName.slice(lastDot + 1) : safeName;

  // Which pill is "active" (user chose) vs "default" (shown in code by default)
  const activeValue  = selectedValue;
  const defaultValue = def;

  return (
    <div className={depth === 0 ? 'param-card' : undefined} style={depth > 0 ? { padding: '12px 0' } : { position: 'relative' }}>

      {required && depth === 0 && (
        <span style={{
          position: 'absolute', top: 12, right: 12,
          fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: '#e2001a',
          background: 'rgba(226,0,26,0.08)',
          border: '1px solid rgba(226,0,26,0.2)',
          borderRadius: 4,
          padding: '2px 6px',
          lineHeight: 1.4,
        }}>required</span>
      )}

      {/* ── Name + meta ── all tokens use monospace for visual consistency ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '4px 10px', marginBottom: 6, fontFamily: 'monospace' }}>
        <span style={{ fontSize: '0.875rem', color: ATTR_COLOR, fontWeight: 700 }}>
          {prefix && <span style={{ fontWeight: 400, opacity: 0.35 }}>{prefix}.</span>}
          {leaf}
        </span>
        {type && <><span style={{ color: 'var(--muted)', fontWeight: 400 }}>·</span><span style={{ fontSize: '0.875rem', color: 'var(--mid)', fontWeight: 400 }}>{type}</span></>}
        {def !== undefined && (
          <><span style={{ color: 'var(--muted)', fontWeight: 400 }}>·</span><span style={{ fontSize: '0.875rem', color: 'var(--mid)', fontWeight: 400 }}>
            default: <span style={{ color: 'var(--black)' }}>{String(def)}</span>
          </span></>
        )}
      </div>

      {/* ── Description ── */}
      <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.65 }}>{desc}</p>

      {/* ── Possible values ── */}
      {values && values.length > 0 && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {values.map(v => {
              const isActive  = activeValue === v;
              const isDefault = !activeValue && v === defaultValue;

              const pillBase = {
                fontSize: '0.75rem',
                padding: '2px 8px',
                borderRadius: 4,
                fontFamily: 'monospace',
                fontWeight: 500,
                transition: 'background 0.12s, border-color 0.12s, color 0.12s',
                cursor: onSelect ? 'pointer' : 'default',
              };
              const pillStyle = {
                ...pillBase,
                ...(isActive
                  ? { background: 'rgba(226,0,26,0.08)', border: '1px solid #e2001a', color: '#e2001a' }
                  : isDefault
                  ? { background: 'var(--bg)', border: '1px solid var(--mid)', color: 'var(--black)' }
                  : { background: 'transparent', border: '1px solid var(--border)', color: 'var(--mid)' }
                ),
              };

              return onSelect ? (
                <button key={v} onClick={() => onSelect(v)} style={pillStyle} title={isActive ? 'Click to reset' : `Try ${v}`}>
                  {v}
                </button>
              ) : (
                <code key={v} style={pillStyle}>{v}</code>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Show / hide child attributes toggle ── */}
      {hasChildren && (
        <button
          onClick={() => setChildrenOpen(v => !v)}
          style={{
            marginTop: 12,
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 13px 5px 11px',
            borderRadius: 20,
            border: '1px solid var(--border)',
            background: childrenOpen ? 'var(--bg)' : 'transparent',
            color: 'var(--mid)',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.12s',
          }}
        >
          <span style={{ fontSize: '1rem', lineHeight: 1, fontWeight: 300 }}>{childrenOpen ? '×' : '+'}</span>
          {childrenOpen ? 'Hide child attributes' : 'Show child attributes'}
        </button>
      )}

      {/* ── Children ── */}
      {hasChildren && childrenOpen && (
        <div style={{
          marginTop: 10,
          borderRadius: 20,
          border: '1px solid var(--border)',
          borderLeft: '3px solid var(--border)',
          background: 'var(--bg)',
          overflow: 'hidden',
          padding: '0 16px',
        }}>
          {childParams.map((p, i) => (
            <div key={p.name} style={{ borderBottom: i < childParams.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <ParamRow {...p} depth={depth + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Section header — full-width sticky title row ───────────────────────────── */
const METHOD_COLORS = { GET: '#3fb950', POST: '#58a6ff', DELETE: '#f85149', PUT: '#f59e0b' };

function SectionHeader({ title, count, method }) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--black)', fontFamily: 'var(--font-display)' }}>{title}</span>
        {method && (
          <span style={{
            fontSize: '0.625rem', fontWeight: 700, padding: '3px 8px', borderRadius: 4,
            background: `${METHOD_COLORS[method] ?? '#888'}22`,
            color: METHOD_COLORS[method] ?? '#888',
            fontFamily: 'var(--font-mono)', letterSpacing: '0.06em',
          }}>
            {method}
          </span>
        )}
      </div>
      {count > 0 && (
        <span style={{ fontSize: '0.75rem', color: 'var(--muted)', flexShrink: 0 }}>{count} {count === 1 ? 'parameter' : 'parameters'}</span>
      )}
    </>
  );
}

/* ─── Per-section sticky code panel ─────────────────────────────────────────── */
function SectionPanel({ section, sectionSelected, panelLabel }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const outerRef = useRef(null);
  const copyTimerRef = useRef(null);
  useEffect(() => () => clearTimeout(copyTimerRef.current), []);

  const liveCode = useMemo(
    () => applyTokens(section.code || '', section.tokens, sectionSelected),
    [section, sectionSelected]
  );

  const highlighted = useMemo(() => {
    const rawLang = section.lang || 'bash';
    const lang = rawLang === 'json' ? 'javascript' : rawLang;
    try {
      let html = hljs.highlight(liveCode, { language: lang, ignoreIllegals: true }).value;
      html = injectHighlights(html, section.tokens, sectionSelected);
      html = addLineNumbers(html);
      return html;
    } catch {
      return addLineNumbers(
        liveCode.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      );
    }
  }, [section, liveCode, sectionSelected]);

  const hasSelections = Object.keys(sectionSelected || {}).length > 0;

  /* Detect whether the panel content exceeds the capped height */
  useEffect(() => {
    const el = outerRef.current;
    if (!el || expanded) return;
    setOverflows(el.scrollHeight > el.clientHeight + 4);
  }, [highlighted, expanded]);

  function handleCopy() {
    navigator.clipboard?.writeText(liveCode).then(() => {
      setCopied(true);
      clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
    });
  }

  /* When expanded: break out of sticky so the full code scrolls with the page */
  const panelStyle = expanded
    ? { position: 'relative', maxHeight: 'none', overflow: 'visible' }
    : undefined;

  return (
    <div ref={outerRef} className="api-ref-section-code" style={panelStyle}>
      <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border)', position: 'relative' }}>

        {/* ── Code panel header ── */}
        <div style={{
          padding: '8px 14px',
          background: '#161b22',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 8,
        }}>
          <span style={{ fontSize: '0.625rem', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.01em', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {section.heading}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {/* Modified badge */}
            {hasSelections && (
              <span style={{
                fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.06em',
                padding: '2px 6px', borderRadius: 8,
                background: 'rgba(226,0,26,0.18)', color: '#e2001a',
                textTransform: 'uppercase',
              }}>
                modified
              </span>
            )}

            {/* Expand / collapse — only shown when content overflows */}
            {(overflows || expanded) && (
              <button
                onClick={() => setExpanded(v => !v)}
                title={expanded ? 'Collapse' : 'Expand to see full code'}
                style={{
                  fontSize: '0.625rem',
                  color: expanded ? '#22c55e' : '#94a3b8',
                  background: 'transparent',
                  border: '1px solid',
                  borderColor: expanded ? '#22c55e44' : 'rgba(255,255,255,0.1)',
                  borderRadius: 4,
                  padding: '2px 8px',
                  cursor: 'pointer',
                  transition: 'color 0.15s, border-color 0.15s',
                  fontFamily: 'inherit',
                  whiteSpace: 'nowrap',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" style={{ transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'none' }}>
                  <path d="M1 2.5L4 5.5L7 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {expanded ? 'Collapse' : 'Expand'}
              </button>
            )}

            {/* Copy button */}
            <button
              onClick={handleCopy}
              style={{
                fontSize: '0.625rem',
                color: copied ? '#22c55e' : '#94a3b8',
                background: 'transparent',
                border: '1px solid',
                borderColor: copied ? '#22c55e44' : 'rgba(255,255,255,0.1)',
                borderRadius: 4,
                padding: '2px 8px',
                cursor: 'pointer',
                transition: 'color 0.15s, border-color 0.15s',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
              }}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>

            {/* Traffic lights */}
            <div style={{ display: 'flex', gap: 5 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
            </div>
          </div>
        </div>

        {/* ── Code body ── */}
        <pre className="cb-pre">
          <code dangerouslySetInnerHTML={{ __html: highlighted }} />
        </pre>

        {/* ── Bottom fade — visible only when collapsed and overflowing ── */}
        {!expanded && overflows && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 64,
            background: 'linear-gradient(to bottom, transparent, #0d1117)',
            pointerEvents: 'none',
          }} />
        )}
      </div>
    </div>
  );
}

/* ─── Version badge config ───────────────────────────────────────────────────── */
const VERSION_BADGES = {
  'v2-private': {
    label: 'v2 · Private Preview',
    bg: 'rgba(234,179,8,0.1)',
    border: 'rgba(234,179,8,0.35)',
    color: '#92400e',
    dot: '#d97706',
  },
  'v3-public': {
    label: 'v3 · Public Preview',
    bg: 'rgba(0,112,205,0.07)',
    border: 'rgba(0,112,205,0.25)',
    color: '#1d4ed8',
    dot: '#0070cd',
  },
  'v2-public': {
    label: 'v2 · Public Preview',
    bg: 'rgba(168,85,247,0.07)',
    border: 'rgba(168,85,247,0.25)',
    color: '#7c3aed',
    dot: '#a855f7',
  },
  'v1': {
    label: 'v1 · Production',
    bg: 'rgba(34,197,94,0.07)',
    border: 'rgba(34,197,94,0.25)',
    color: '#15803d',
    dot: '#22c55e',
  },
  'v3-private': {
    label: 'v3 · Private Preview',
    bg: 'rgba(234,179,8,0.07)',
    border: 'rgba(234,179,8,0.35)',
    color: '#92400e',
    dot: '#d97706',
  },
};

function VersionBadge({ version }) {
  const cfg = VERSION_BADGES[version];
  if (!cfg) return null;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: 6,
      background: cfg.bg, border: `1px solid ${cfg.border}`,
      marginBottom: 20,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
      <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: cfg.color }}>
        {cfg.label}
      </span>
    </div>
  );
}

/* ─── Main layout ────────────────────────────────────────────────────────────── */
export default function ApiRefTwoCol({ sections, panelLabel = 'Example', version, title, description, topBanner }) {
  /* ── Per-section selected values: { [sectionId]: { [paramName]: value } } ── */
  const [selected, setSelected] = useState({});

  /* ── Selection handler — toggles off if same value clicked again ── */
  function handleSelect(sectionId, paramName, value) {
    setSelected(prev => {
      const cur = prev[sectionId]?.[paramName];
      if (cur === value) {
        const { [paramName]: _removed, ...rest } = prev[sectionId] || {};
        return { ...prev, [sectionId]: rest };
      }
      return { ...prev, [sectionId]: { ...(prev[sectionId] || {}), [paramName]: value } };
    });
  }

  const sectionsContent = (
    <div className="api-ref-sections">
      {version && (
        <div style={{ padding: '16px 0 0' }}>
          <VersionBadge version={version} />
        </div>
      )}
      {sections.map((section) => (
        <div key={section.id} className="api-ref-section" id={section.id}>

          {/* Full-width sticky title row — spans both columns */}
          <div className="api-ref-section-header">
            <SectionHeader title={section.heading} count={(section.params ?? []).length} method={section.method} />
          </div>

          {/* Left: optional note + param list */}
          <div className="api-ref-section-left">
            {section.note && (
              <p style={{ margin: '0 0 20px', fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.65 }}>
                {section.note}
              </p>
            )}
            {(section.params ?? []).map(p => (
              <ParamRow
                key={p.name}
                {...p}
                selectedValue={selected[section.id]?.[p.name]}
                onSelect={section.tokens?.[p.name] !== undefined
                  ? (value) => handleSelect(section.id, p.name, value)
                  : undefined}
              />
            ))}
            {section.extra}
          </div>

          {/* Right: sticky code panel */}
          <div className="api-ref-section-right">
            <SectionPanel
              section={section}
              sectionSelected={selected[section.id]}
              panelLabel={panelLabel}
            />
          </div>

        </div>
      ))}
    </div>
  );

  /* When a title is provided, wrap in a full page layout */
  if (title) {
    return (
      <div className="page page--wide">
        <div className="page-header">
          <h1>{title}</h1>
          <PageActions />
        </div>
        {description && (
          <p className="quick-answer">{description}</p>
        )}
        {topBanner}
        {sectionsContent}
      </div>
    );
  }

  return sectionsContent;
}
