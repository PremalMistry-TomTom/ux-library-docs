import { createContext, useContext, useState, useEffect } from 'react';

/* ─── Theme palettes ─────────────────────────────────────────────────────────
   Each theme is a single palette object. To add a new theme:
     1. Add an entry to THEMES with the same token keys.
     2. Add it to the StyleToggle in IntroIllustrations.jsx.
   That's it — every illustration picks it up automatically.
   ─────────────────────────────────────────────────────────────────────────── */
export const THEMES = {
  day: {
    bg:     '#EAF4FF',
    navy:   '#1B3D6E',
    mid:    '#5B8AC5',
    soft:   '#A8C8E8',
    panel:  '#C8DCF5',
    pill2:  '#6BA3CF',
    border: '#5B8AC5',
    grid:   '#B8D5F0',
    white:  '#FFFFFF',
    // dark: a panel that stays dark against the light bg (same as navy in day)
    dark:   '#1B3D6E',
    // Semantic accent tokens — readable on #EAF4FF light background
    accent: '#15803D',   // forest green (replaces #22c55e)
    warn:   '#92400E',   // amber-brown (replaces #fbbf24)
    danger: '#DC2626',   // red (replaces red tones)
  },
  night: {
    bg:     '#0D1B35',
    navy:   '#C8DEFF',
    mid:    '#7BA8D4',
    soft:   '#3D5A8A',
    panel:  '#1A2D55',
    pill2:  '#4A6A9E',
    border: '#3D6094',
    grid:   '#152240',
    white:  '#E8F0FF',
    // dark: a panel that stays dark against the dark bg
    dark:   '#1A2D55',
    // Semantic accent tokens — readable on #0D1B35 dark background
    accent: '#4ADE80',   // bright green (replaces #22c55e)
    warn:   '#FBBF24',   // amber (replaces #fbbf24)
    danger: '#F87171',   // soft red (replaces red tones)
  },
  blueprintLight: {
    bg:     '#F0F7FF',   // crisp drafting-paper white with a hint of blue
    navy:   '#0B2D5C',   // deep navy — headlines, primary text
    mid:    '#2878CC',   // strong blue — routes, active elements
    soft:   '#6EA8D8',   // light-medium blue — secondary elements
    panel:  '#DCE9FA',   // light blue panel surface (graph-paper feel)
    pill2:  '#4A7EC0',   // pill/tag blue
    border: '#5C8EC8',   // clear blue borders
    grid:   '#C8DDEE',   // very light blue for map grid
    white:  '#FFFFFF',   // true white for text on dark surfaces
    dark:   '#0B2D5C',   // always-dark panel (deep navy)
    // Accent tokens — all-blue palette, no semantic green/amber
    accent: '#0EA5E9',   // sky blue (replaces #22c55e)
    warn:   '#3B82F6',   // blue for warnings (replaces #fbbf24)
    danger: '#6366F1',   // indigo for danger tones (replaces reds)
  },
  blueprintDark: {
    bg:     '#071420',   // deepest navy — page background
    navy:   '#C2DFFF',   // lightest — headlines, primary text LP bars
    mid:    '#4B9EE8',   // bright blue — routes, active elements
    soft:   '#2B5882',   // medium — secondary elements
    panel:  '#0D1E32',   // dark panel surface
    pill2:  '#3A7DC0',   // pill/tag blue
    border: '#1A3A5C',   // borders and dividers
    grid:   '#091628',   // map grid background
    white:  '#D6EAFF',   // near-white for text on dark surfaces
    dark:   '#0D1E32',   // always-dark panel (same as panel in blueprintDark)
    // Accent tokens — replace ALL hardcoded colours so nothing but blue shows
    accent: '#58C4FF',   // replaces #22c55e  (EV green → bright cyan-blue)
    warn:   '#6B9FD8',   // replaces #fbbf24  (amber → muted mid-blue)
    danger: '#8BB8F0',   // replaces red tones → lighter steel-blue
  },
  // 'dark' is the original dark/realistic style — no palette (uses ThumbXxx components)
};

/* Coupled pair: day mode ↔ 'day' palette, night mode ↔ 'blueprintDark' palette.
   Any theme outside this pair is treated as a manual override and left alone. */
const SITE_COUPLED = { day: 'light', blueprintDark: 'dark' };
const DEFAULT_THEME = 'day';

/** Maps the current site dark/light mode to its default illustration palette. */
function themeForSite() {
  return document.documentElement.getAttribute('data-theme') === 'dark'
    ? 'blueprintDark'
    : 'day';
}

export const IlloStyleContext = createContext({
  theme:      DEFAULT_THEME,
  setTheme:   () => {},
  palette:    THEMES[DEFAULT_THEME],
  illoStyle:  'detailed',
  setIlloStyle: () => {},
});

export function IlloStyleProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem('illoStyle');
      // migrate old values: 'light' → 'day', 'blueprint'|'blueprintLight' → 'blueprintDark', 'dark' → 'night'
      if (stored === 'light' || stored === 'blueprintLight') return 'day';
      if (stored === 'dark')      return 'night';
      if (stored === 'blueprint') return 'blueprintDark';
      if (THEMES[stored])         return stored;
      // No stored preference — auto-pick from site day/night mode
      return themeForSite();
    } catch { return DEFAULT_THEME; }
  });

  const [illoStyle, setIlloStyleState] = useState(() => {
    try {
      const stored = localStorage.getItem('illoStylePref');
      if (stored === 'lofi' || stored === 'detailed') return stored;
    } catch {}
    return 'detailed'; // default: always show detailed wireframes
  });

  // Follow site day↔dark toggles when the current theme is part of the coupled pair
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(prev => {
        if (!(prev in SITE_COUPLED)) return prev;   // manual override — leave it alone
        const next = themeForSite();
        try { localStorage.setItem('illoStyle', next); } catch {}
        return next;
      });
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  const set = (v) => {
    setTheme(v);
    try { localStorage.setItem('illoStyle', v); } catch {}
  };

  const setIlloStyle = (v) => {
    setIlloStyleState(v);
    try { localStorage.setItem('illoStylePref', v); } catch {}
  };

  return (
    <IlloStyleContext.Provider value={{ theme, setTheme: set, palette: THEMES[theme] ?? THEMES.day, illoStyle, setIlloStyle }}>
      {children}
    </IlloStyleContext.Provider>
  );
}

export function useIlloStyle() {
  return useContext(IlloStyleContext);
}
