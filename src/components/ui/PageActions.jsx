import { useState, useEffect, useRef } from 'react';
import AskAIPanel from './AskAIPanel';

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
      fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.02em',
      border: '1.5px solid currentColor', borderRadius: 3,
      padding: '0 3px', lineHeight: '13px', opacity: 0.75,
      flexShrink: 0,
    }}>M↓</span>
  );
}

function ChevronDownIcon({ open }) {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true"
      style={{ transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : 'none' }}>
      <path d="M2 4.5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ opacity: 0.5, flexShrink: 0 }}>
      <path d="M7 2h3v3M10 2L5.5 6.5M5 3H3a1 1 0 00-1 1v5a1 1 0 001 1h5a1 1 0 001-1V7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
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
  return el.innerText ?? '';
}

function getPageTitle() {
  return document.querySelector('.page h1')?.textContent?.trim()
    ?? document.title
    ?? 'TomTom Developer Docs';
}

/* ─── Markdown modal ─────────────────────────────────────────────────────── */
function MarkdownModal({ onClose }) {
  const [copied, setCopied] = useState(false);
  const text = getPageText();
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;
      const focusable = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="md-overlay" onClick={onClose} aria-hidden="true">
      <div
        className="md-modal"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="md-modal-title"
        aria-hidden="false"
        ref={modalRef}
      >
        <div className="md-modal-header">
          <span className="md-modal-title" id="md-modal-title">Page content as text</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="md-modal-copy" onClick={handleCopy}>
              {copied ? <><CheckIcon /> Copied</> : <><ClipboardIcon /> Copy</>}
            </button>
            <button className="md-modal-close" onClick={onClose} aria-label="Close dialog" ref={closeBtnRef}>
              <CloseIcon />
            </button>
          </div>
        </div>
        <pre className="md-modal-body">{text}</pre>
      </div>
    </div>
  );
}

/* ─── AI split button ────────────────────────────────────────────────────── */
function AiSplitButton({ onViewMd }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen]     = useState(false);
  const groupRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (!groupRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getPageText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openInAI = (service) => {
    const title = getPageTitle();
    const url   = window.location.href;
    const q     = encodeURIComponent(
      `I'm reading TomTom developer documentation — "${title}". Help me understand it: ${url}`
    );
    const targets = {
      claude:     `https://claude.ai/new?q=${q}`,
      chatgpt:    `https://chatgpt.com/?q=${q}`,
      perplexity: `https://www.perplexity.ai/search?q=${encodeURIComponent(title + ' TomTom API documentation')}`,
    };
    window.open(targets[service], '_blank', 'noopener,noreferrer');
    setOpen(false);
  };

  return (
    <div ref={groupRef} className="pa-split-group page-action-btn--desktop">
      {/* Primary action — copy */}
      <button
        className="pa-split-primary"
        onClick={handleCopy}
        title="Copy page content as plain text"
      >
        {copied ? <CheckIcon /> : <ClipboardIcon />}
        {copied ? 'Copied!' : 'Copy as markdown'}
      </button>

      {/* Chevron — open dropdown */}
      <button
        className="pa-split-chevron"
        onClick={() => setOpen(v => !v)}
        aria-label="More AI options"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <ChevronDownIcon open={open} />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="pa-dropdown" role="menu">
          <button
            className="pa-dropdown-item"
            role="menuitem"
            onClick={() => { onViewMd(); setOpen(false); }}
          >
            <span className="pa-dropdown-item-label"><MarkdownIcon /> View as markdown</span>
          </button>

          <div className="pa-dropdown-sep" />

          <button className="pa-dropdown-item" role="menuitem" onClick={() => openInAI('claude')}>
            <span className="pa-dropdown-item-label">Open in Claude</span>
            <ExternalLinkIcon />
          </button>
          <button className="pa-dropdown-item" role="menuitem" onClick={() => openInAI('chatgpt')}>
            <span className="pa-dropdown-item-label">Open in ChatGPT</span>
            <ExternalLinkIcon />
          </button>
          <button className="pa-dropdown-item" role="menuitem" onClick={() => openInAI('perplexity')}>
            <span className="pa-dropdown-item-label">Open in Perplexity</span>
            <ExternalLinkIcon />
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── PageActions ────────────────────────────────────────────────────────── */
export default function PageActions() {
  const [showMd, setShowMd] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  const pageTitle = document.querySelector('.page h1')?.textContent?.trim() ?? '';

  return (
    <>
      <div className="page-actions">
        <button className="page-action-btn page-action-btn--ai" onClick={() => setAiOpen(true)}>
          <SparkleIcon /> Ask about this page
        </button>
        <span className="page-action-sep" aria-hidden="true" />
        <AiSplitButton onViewMd={() => setShowMd(true)} />
      </div>

      {showMd && <MarkdownModal onClose={() => setShowMd(false)} />}
      <AskAIPanel isOpen={aiOpen} onClose={() => setAiOpen(false)} pageTitle={pageTitle} />
    </>
  );
}
