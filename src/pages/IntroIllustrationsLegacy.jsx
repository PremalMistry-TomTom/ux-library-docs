import React from 'react';
import { IlloStyleContext, THEMES } from '../context/IlloStyleContext';
import IntroIllustrations from './IntroIllustrations';

/* ─────────────────────────────────────────────────────────────────────────────
   INTRO ILLUSTRATIONS — LEGACY REFERENCE PAGE
   Shows every original IlloXxx component frozen in the original dark palette.
   No toggles, no theming — this is the canonical reference for human artists
   who want to see the precise colour, layout and density used before the
   palette system was introduced.
   ───────────────────────────────────────────────────────────────────────────── */

/* Original dark palette — hand-matched to the hardcoded values the components
   used before useDarkStyle() was introduced.  Do NOT change these values. */
const LEGACY_PALETTE = {
  bg:     '#0d1117',   // deep GitHub-dark page background
  navy:   '#f0f6fc',   // near-white primary text
  mid:    '#8b949e',   // muted grey secondary text
  soft:   '#3d4f6b',   // subtle panel accent
  panel:  '#161b22',   // card / raised surface background
  pill2:  '#2d3748',   // pill / chip background
  border: '#30363d',   // dividers, borders
  grid:   '#0c1318',   // map grid / tile dark background
  white:  '#ffffff',   // true white for labels on dark surfaces
  dark:   '#0d1117',   // always-dark panel (same as bg)
  accent: '#22c55e',   // green — available, success, charging
  warn:   '#fbbf24',   // amber — warning, horizon
  danger: '#e2001a',   // TomTom red — routes, danger
};

/* Force the context value — all IlloXxx hooks get the frozen palette regardless
   of what the outer IlloStyleProvider or user preference says. */
const FROZEN_VALUE = {
  theme:    'night',
  setTheme: () => {},
  palette:  LEGACY_PALETTE,
};

export default function IntroIllustrationsLegacy() {
  return (
    <IlloStyleContext.Provider value={FROZEN_VALUE}>
      {/* ── Legend banner ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: '#161b22',
        borderBottom: '1px solid #30363d',
        padding: '10px 24px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f0f6fc', letterSpacing: '0.02em' }}>
          🗂 Legacy Reference
        </span>
        <span style={{ fontSize: '0.6875rem', color: '#8b949e' }}>
          Original dark palette — frozen, no theming. Use this as the canonical source for human artist recreations.
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
          {[
            ['bg',    '#0d1117'],
            ['panel', '#161b22'],
            ['text',  '#f0f6fc'],
            ['green', '#22c55e'],
            ['blue',  '#58a6ff'],
            ['red',   '#e2001a'],
          ].map(([label, color]) => (
            <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: color, border: '1px solid rgba(255,255,255,0.15)', flexShrink: 0 }} />
              <span style={{ fontSize: '0.5625rem', color: '#8b949e', fontFamily: 'monospace' }}>{color}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Render the full illustrations page with:
          - noThemeBar  → hides the sticky ThemeBar (we supply our own banner above)
          - forcedIlloStyle="detailed" → always shows HTML IlloXxx components */}
      <IntroIllustrations noThemeBar forcedIlloStyle="detailed" />
    </IlloStyleContext.Provider>
  );
}
