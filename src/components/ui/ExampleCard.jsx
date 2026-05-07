import { useState } from 'react';
import CodeBlock from './CodeBlock';

/* ── Tag pill ──────────────────────────────────────────────────────────────── */
const TAG_STYLES = {
  start:       { bg: 'rgba(34,197,94,0.1)',   color: '#16a34a' },
  custom:      { bg: 'rgba(59,130,246,0.1)',  color: '#2563eb' },
  playground:  { bg: 'rgba(139,92,246,0.1)',  color: '#7c3aed' },
  feature:     { bg: 'rgba(100,116,139,0.1)', color: '#475569' },
  platform:    { bg: 'rgba(100,116,139,0.1)', color: '#475569' },
};

function Tag({ label, variant = 'feature' }) {
  const s = TAG_STYLES[variant] || TAG_STYLES.feature;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 8px', borderRadius: 99,
      fontSize: '0.625rem', fontWeight: 600, lineHeight: '16px',
      background: s.bg, color: s.color,
      letterSpacing: '0.01em', whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}

/* ── Open-in-docs icon ─────────────────────────────────────────────────────── */
function ExternalArrow() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
      <path d="M2 9L9 2M9 2H4M9 2V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Code toggle icon ──────────────────────────────────────────────────────── */
function CodeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M3.5 3.5L1 6l2.5 2.5M8.5 3.5L11 6l-2.5 2.5M7 2l-2 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Main component ────────────────────────────────────────────────────────── */
/**
 * ExampleCard — matches the TomTom Docs SDK examples card style.
 *
 * Props:
 *   title       string
 *   description string
 *   href        string   – URL to live example on docs.tomtom.com
 *   tags        Array<{ label, variant }>  variant: 'start' | 'custom' | 'playground' | 'feature' | 'platform'
 *   Thumb       React component — SVG map illustration for the card thumbnail
 *   snippet     string   – key TypeScript config to show when expanded
 */
export default function ExampleCard({ title, description, href, tags = [], Thumb, imgSrc, snippet }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`example-card${open ? ' example-card--open' : ''}`}>
      {/* Thumbnail */}
      <a className="example-card-thumb" href={href} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true">
        {imgSrc
          ? <img src={imgSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : Thumb && <Thumb />}
      </a>

      {/* Body */}
      <div className="example-card-body">
        <a className="example-card-title" href={href} target="_blank" rel="noopener noreferrer">
          {title}
        </a>
        <p className="example-card-desc">{description}</p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="example-card-tags">
            {tags.map(t => <Tag key={t.label} label={t.label} variant={t.variant} />)}
          </div>
        )}

        {/* Actions */}
        <div className="example-card-actions">
          {snippet && (
            <button
              className={`example-card-code-btn${open ? ' active' : ''}`}
              onClick={() => setOpen(v => !v)}
            >
              <CodeIcon />
              {open ? 'Hide code' : 'Key config'}
            </button>
          )}
          <a className="example-card-open" href={href} target="_blank" rel="noopener noreferrer">
            Open example <ExternalArrow />
          </a>
        </div>
      </div>

      {/* Expandable code snippet */}
      {open && snippet && (
        <div className="example-card-snippet">
          <CodeBlock code={snippet} language="typescript" label="index.ts" />
        </div>
      )}
    </div>
  );
}
