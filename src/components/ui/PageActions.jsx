import { useState } from 'react';

/* ─── Icons ──────────────────────────────────────────────────────────────── */
function SparkleIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 1v3M8 12v3M1 8h3M12 8h3M3.22 3.22l2.12 2.12M10.66 10.66l2.12 2.12M3.22 12.78l2.12-2.12M10.66 5.34l2.12-2.12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="5" y="1" width="6" height="3" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M4 2.5H3a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1v-10a1 1 0 00-1-1h-1" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function MarkdownIcon() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.02em',
      border: '1.5px solid currentColor', borderRadius: 3,
      padding: '0 3px', lineHeight: '14px', opacity: 0.75,
    }}>M↓</span>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function getPageText() {
  const el = document.querySelector('.page');
  if (!el) return '';
  // Walk text nodes to produce something readable as markdown-ish plain text
  return el.innerText ?? '';
}

/* ─── Markdown modal ─────────────────────────────────────────────────────── */
function MarkdownModal({ onClose }) {
  const [copied, setCopied] = useState(false);
  const text = getPageText();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="md-overlay" onClick={onClose}>
      <div className="md-modal" onClick={e => e.stopPropagation()}>
        <div className="md-modal-header">
          <span className="md-modal-title">Page content as text</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="md-modal-copy" onClick={handleCopy}>
              {copied ? <><CheckIcon /> Copied</> : <><ClipboardIcon /> Copy</>}
            </button>
            <button className="md-modal-close" onClick={onClose} aria-label="Close">
              <CloseIcon />
            </button>
          </div>
        </div>
        <pre className="md-modal-body">{text}</pre>
      </div>
    </div>
  );
}

/* ─── PageActions ────────────────────────────────────────────────────────── */
export default function PageActions() {
  const [copied, setCopied] = useState(false);
  const [showMd, setShowMd] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getPageText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="page-actions">
        <button className="page-action-btn page-action-btn--disabled" disabled title="Coming soon">
          <SparkleIcon /> Ask about this page
        </button>
        <span className="page-action-sep" aria-hidden="true" />
        <button className="page-action-btn" onClick={handleCopy}>
          {copied ? <CheckIcon /> : <ClipboardIcon />}
          {copied ? 'Copied!' : 'Copy for LLM'}
        </button>
        <span className="page-action-sep" aria-hidden="true" />
        <button className="page-action-btn" onClick={() => setShowMd(true)}>
          <MarkdownIcon /> View as Markdown
        </button>
      </div>

      {showMd && <MarkdownModal onClose={() => setShowMd(false)} />}
    </>
  );
}
