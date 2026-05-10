/* ─────────────────────────────────────────────────────────────────────────────
 * PlumbingPortal — global overlay for internal design-system tooling.
 * Accessible from the (?) button in the GlobalHeader regardless of which
 * product/page is active. Has its own left-panel nav and renders each of the
 * five plumbing pages in the content area.
 * ───────────────────────────────────────────────────────────────────────────── */

import { useState } from 'react';
import Typography    from './Typography';
import ScreenshotAssets from './ScreenshotAssets';
import IntroIllustrations from './IntroIllustrations';
import StyleSamples  from './StyleSamples';
import ContentSpacing from './ContentSpacing';

/* ─── Nav items ──────────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { id: 'typography',          label: 'Typography system',         icon: '🔤' },
  { id: 'screenshot-assets',   label: 'Screenshot assets & states',icon: '📸' },
  { id: 'intro-illustrations', label: 'Intro hero illustrations',  icon: '🖼️' },
  { id: 'style-samples',       label: 'Style samples',             icon: '⚡' },
  { id: 'content-spacing',     label: 'Content spacing',           icon: '📐' },
];

/* ─── Close icon ─────────────────────────────────────────────────────────────── */
function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <line x1="3" y1="3" x2="15" y2="15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
      <line x1="15" y1="3" x2="3"  y2="15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
    </svg>
  );
}

/* ─── Page renderer ──────────────────────────────────────────────────────────── */
function PlumbingPage({ pageId }) {
  switch (pageId) {
    case 'typography':          return <Typography />;
    case 'screenshot-assets':   return <ScreenshotAssets />;
    case 'intro-illustrations': return <IntroIllustrations />;
    case 'style-samples':       return <StyleSamples />;
    case 'content-spacing':     return <ContentSpacing />;
    default:                    return <Typography />;
  }
}

/* ─── Main component ─────────────────────────────────────────────────────────── */
export default function PlumbingPortal({ onClose }) {
  const [activePage, setActivePage] = useState('intro-illustrations');

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      display: 'flex', flexDirection: 'column',
      background: 'var(--bg)',
    }}>
      {/* ── Header bar ── */}
      <div style={{
        height: 48, flexShrink: 0,
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '0 20px',
        background: 'var(--surface)',
      }}>
        {/* Gear icon + title */}
        <span style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>⚙</span>
        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '0.01em' }}>
          Plumbing
        </span>
        <span style={{
          fontSize: '0.6875rem', color: 'var(--muted)', padding: '2px 8px',
          borderRadius: 20, border: '1px solid var(--border)', background: 'var(--bg)',
        }}>
          Design system internals
        </span>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 8,
            background: 'transparent', border: '1px solid var(--border)',
            cursor: 'pointer', color: 'var(--mid)', fontSize: '0.75rem', fontWeight: 600,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.color = 'var(--text)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--mid)'; }}
        >
          <CloseIcon />
          Close
        </button>
      </div>

      {/* ── Body: sidebar + content ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Left sidebar */}
        <nav style={{
          width: 240, flexShrink: 0,
          borderRight: '1px solid var(--border)',
          background: 'var(--surface)',
          overflowY: 'auto',
          padding: '16px 0',
        }}>
          <div style={{ padding: '0 16px 10px', fontSize: '0.625rem', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Pages
          </div>
          {NAV_ITEMS.map(item => {
            const active = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', padding: '9px 16px',
                  background: active ? 'var(--bg)' : 'transparent',
                  border: 'none', borderLeft: active ? '2px solid #e2001a' : '2px solid transparent',
                  cursor: 'pointer', textAlign: 'left',
                  fontSize: '0.8125rem', fontWeight: active ? 700 : 400,
                  color: active ? 'var(--text)' : 'var(--mid)',
                  transition: 'all 0.1s',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.color = 'var(--text)'; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--mid)'; } }}
              >
                <span style={{ fontSize: '1rem', lineHeight: 1, flexShrink: 0 }}>{item.icon}</span>
                <span style={{ lineHeight: 1.3 }}>{item.label}</span>
              </button>
            );
          })}

          {/* Divider + back hint */}
          <div style={{ margin: '20px 16px 0', borderTop: '1px solid var(--border)', paddingTop: 16 }}>
            <div style={{ fontSize: '0.625rem', color: 'var(--muted)', lineHeight: 1.5 }}>
              These pages are internal planning tools. Press <kbd style={{ fontSize: '0.625rem', padding: '1px 4px', borderRadius: 3, border: '1px solid var(--border)', background: 'var(--bg)' }}>?</kbd> or click the help icon to toggle this panel.
            </div>
          </div>
        </nav>

        {/* Content area */}
        <main style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)' }}>
          <PlumbingPage pageId={activePage} />
        </main>

      </div>
    </div>
  );
}
