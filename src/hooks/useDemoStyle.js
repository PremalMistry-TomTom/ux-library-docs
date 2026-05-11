/* ─────────────────────────────────────────────────────────────────────────────
 * useDemoStyle — shared palette bridge for interactive demo components.
 *
 * Maps IlloStyleContext palette tokens → semantic token set used by all demo
 * mock-device UIs (EV Nav, EV Routing, EV Charging Search, etc.).
 *
 * Mirrors useDarkStyle() in IntroIllustrations.jsx so heroes and demos share
 * a single visual system.  Import here instead of duplicating the mapping.
 * ───────────────────────────────────────────────────────────────────────────── */

import { useIlloStyle } from '../context/IlloStyleContext';

export function useDemoStyle() {
  const { palette: C } = useIlloStyle();
  return {
    bg:     C.bg,       // page / device background
    card:   C.panel,    // card / surface
    card2:  C.pill2,    // secondary card / nested surface
    line:   C.border,   // dividers and strokes
    text:   C.navy,     // primary text
    dim:    C.mid,      // secondary / dimmed text
    muted:  C.soft,     // tertiary / muted text
    green:  C.accent,   // healthy / positive state
    blue:   C.mid,      // informational / link color
    red:    C.danger,   // critical / destructive
    amber:  C.warn,     // warning / low state
    purple: C.accent,   // decorative accent (maps to same as green in most themes)
    dark:   C.dark,
    white:  C.white,
    // Cluster-specific: always readable on C.dark background in any theme.
    // In dark themes C.navy is light; in light themes C.navy is dark navy — both
    // contrast against their respective C.dark value.
    clusterText: C.navy,  // primary text on cluster (M.dark) panels
    clusterSub:  C.mid,   // secondary / ghost text on cluster panels
  };
}
