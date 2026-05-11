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
  blueprintMid: {
    bg:     '#EAF4FF',   // light drafting-paper blue — matches Style Samples bg
    navy:   '#1B3D6E',   // deep navy — headlines, primary text, shapes
    mid:    '#5B8AC5',   // medium blue — routes, borders, secondary
    soft:   '#A8C8E8',   // soft blue — muted fills
    panel:  '#D4E8FA',   // light panel surface
    pill2:  '#6BA3CF',
    border: '#9CC4E8',
    grid:   '#C8DCF5',
    white:  '#FFFFFF',
    dark:   '#C8DCF5',   // icon SVG background = light panel blue (key token)
    accent: '#1B5FAD',   // strong blue — icon shapes readable on light field
    warn:   '#4A7EC0',   // mid-blue
    danger: '#2E6DBF',   // deeper blue
  },
  // ─── Functional colour-scale themes ────────────────────────────────────────
  // Each family has a light and dark variant derived from the scale in the
  // Functional colour chart (indigo / bolt / shamrock / cadmium / bright / red).

  // Indigo (/0 → /100 navy-blue scale)
  indigoLight: {
    bg:     '#F5F8FA',   // /0
    navy:   '#000D15',   // /100
    mid:    '#00487F',   // /48
    soft:   '#5083A7',   // /24
    panel:  '#C9D9E4',   // /4
    pill2:  '#5083A7',
    border: '#779FBB',   // /16
    grid:   '#DCE9F4',
    white:  '#FFFFFF',
    dark:   '#002640',   // /80
    accent: '#00487F',   // /48 — primary accent
    warn:   '#276692',   // /32 — secondary
    danger: '#003F6A',   // /64 — deepest emphasis
  },
  indigoDark: {
    bg:     '#001924',   // /96
    navy:   '#C9D9E4',   // /4
    mid:    '#5083A7',   // /24
    soft:   '#003255',   // /72
    panel:  '#002640',   // /80
    pill2:  '#276692',   // /32
    border: '#003F6A',   // /64
    grid:   '#001220',
    white:  '#F5F8FA',   // /0
    dark:   '#002640',
    accent: '#5083A7',   // /24 — bright enough on dark
    warn:   '#779FBB',   // /16 — lighter
    danger: '#276692',   // /32 — medium emphasis
  },

  // Bolt (/0 → /100 cyan-blue scale)
  boltLight: {
    bg:     '#F5FBFF',   // /0
    navy:   '#001C28',   // /100
    mid:    '#00AAFF',   // /48
    soft:   '#50C4FF',   // /32
    panel:  '#C9EDFF',   // /4
    pill2:  '#50C4FF',
    border: '#77D1FF',   // /24
    grid:   '#DCF4FF',
    white:  '#FFFFFF',
    dark:   '#005580',   // /80
    accent: '#00AAFF',   // /48 — primary accent
    warn:   '#50C4FF',   // /32 — secondary
    danger: '#0086D5',   // /64 — deepest emphasis
  },
  boltDark: {
    bg:     '#001C28',   // /100
    navy:   '#C9EDFF',   // /4
    mid:    '#0086D5',   // /64
    soft:   '#003955',   // /96
    panel:  '#005580',   // /80
    pill2:  '#0071AA',   // /72
    border: '#005580',   // /80
    grid:   '#001422',
    white:  '#F5FBFF',   // /0
    dark:   '#003955',
    accent: '#50C4FF',   // /32 — bright on dark
    warn:   '#77D1FF',   // /24 — lighter
    danger: '#00AAFF',   // /48 — most saturated
  },

  // Shamrock (/0 → /100 green scale)
  shamrockLight: {
    bg:     '#F5FBF8',   // /0
    navy:   '#000F09',   // /100
    mid:    '#00A65E',   // /48
    soft:   '#50C190',   // /32
    panel:  '#C9ECDD',   // /4
    pill2:  '#50C190',
    border: '#77CFA9',   // /24
    grid:   '#DCEEE5',
    white:  '#FFFFFF',
    dark:   '#004E2C',   // /80
    accent: '#00A65E',   // /48 — primary accent
    warn:   '#50C190',   // /32 — secondary
    danger: '#00874C',   // /64 — deepest emphasis
  },
  shamrockDark: {
    bg:     '#000F09',   // /100
    navy:   '#C9ECDD',   // /4
    mid:    '#00874C',   // /64
    soft:   '#004E2C',   // /80
    panel:  '#006A3C',   // /72 — slightly lighter than bg for panels
    pill2:  '#00874C',
    border: '#006A3C',   // /72
    grid:   '#000C07',
    white:  '#F5FBF8',   // /0
    dark:   '#004E2C',
    accent: '#50C190',   // /32 — bright on dark
    warn:   '#77CFA9',   // /24 — lighter
    danger: '#00A65E',   // /48 — most saturated
  },

  // Cadmium (/0 → /100 yellow-amber scale)
  cadmiumLight: {
    bg:     '#FFF5DD',   // /0
    navy:   '#322400',   // /100
    mid:    '#C79102',   // /72
    soft:   '#FDCF53',   // /32
    panel:  '#FEECBA',   // /4
    pill2:  '#FDCF53',
    border: '#FED875',   // /24
    grid:   '#FFF4C8',
    white:  '#FFFFFF',
    dark:   '#634801',   // /96
    accent: '#C79102',   // /72 — deep enough to read on pale yellow bg
    warn:   '#FDCF53',   // /32 — mid-yellow
    danger: '#956D01',   // /80 — darkest emphasis
  },
  cadmiumDark: {
    bg:     '#322400',   // /100
    navy:   '#FEECBA',   // /4
    mid:    '#FDC530',   // /48
    soft:   '#634801',   // /96
    panel:  '#3D2C00',
    pill2:  '#956D01',   // /80
    border: '#634801',   // /96
    grid:   '#261B00',
    white:  '#FFF5DD',   // /0
    dark:   '#3D2C00',
    accent: '#FDC530',   // /48 — primary accent on dark
    warn:   '#FED875',   // /24 — lighter
    danger: '#C79102',   // /72 — deeper emphasis
  },

  // Bright (/0 → /100 orange scale)
  brightLight: {
    bg:     '#FFE7D9',   // /0
    navy:   '#321300',   // /100
    mid:    '#FF5D00',   // /48
    soft:   '#FF9355',   // /24
    panel:  '#FFD5BD',   // /4
    pill2:  '#FF9355',
    border: '#FFB58B',   // /16
    grid:   '#FFEADC',
    white:  '#FFFFFF',
    dark:   '#802F00',   // /80
    accent: '#FF5D00',   // /48 — primary accent
    warn:   '#FF9355',   // /24 — secondary
    danger: '#D54E00',   // /64 — deepest emphasis
  },
  brightDark: {
    bg:     '#321300',   // /100
    navy:   '#FFD5BD',   // /4
    mid:    '#D54E00',   // /64
    soft:   '#511D00',   // /96
    panel:  '#3D1800',
    pill2:  '#802F00',   // /80
    border: '#802F00',   // /80
    grid:   '#260F00',
    white:  '#FFE7D9',   // /0
    dark:   '#3D1800',
    accent: '#FF9355',   // /24 — bright on dark
    warn:   '#FFB58B',   // /16 — lighter
    danger: '#FF5D00',   // /48 — most saturated
  },

  // Red (/0 → /100 red scale)
  redLight: {
    bg:     '#FFF0EF',   // /0
    navy:   '#380300',   // /100
    mid:    '#DF1B12',   // /48
    soft:   '#F0514A',   // /32
    panel:  '#FBD4D2',   // /4
    pill2:  '#F47D77',   // /24
    border: '#F8ABAB',   // /16
    grid:   '#FFEAEA',
    white:  '#FFFFFF',
    dark:   '#7A0F0A',   // /80
    accent: '#DF1B12',   // /48 — primary accent
    warn:   '#F0514A',   // /32 — secondary
    danger: '#B6160F',   // /64 — deepest emphasis
  },
  redDark: {
    bg:     '#380300',   // /100
    navy:   '#FBD4D2',   // /4
    mid:    '#B6160F',   // /64
    soft:   '#54120F',   // /96
    panel:  '#420400',
    pill2:  '#7A0F0A',   // /80
    border: '#7A0F0A',   // /80
    grid:   '#2A0200',
    white:  '#FFF0EF',   // /0
    dark:   '#420400',
    accent: '#F0514A',   // /32 — bright on dark
    warn:   '#F8ABAB',   // /16 — lighter
    danger: '#DF1B12',   // /48 — most saturated
  },

  // 'dark' is the original dark/realistic style — no palette (uses ThumbXxx components)
};

/* Coupled pair: light-mode site ↔ 'blueprintMid' palette, dark-mode site ↔ 'blueprintDark'.
   Any theme outside this pair is treated as a manual override and left alone. */
const SITE_COUPLED = { blueprintMid: 'light', blueprintDark: 'dark' };
const DEFAULT_THEME = 'blueprintMid';

/** Maps the current site dark/light mode to its default illustration palette. */
function themeForSite() {
  return document.documentElement.getAttribute('data-theme') === 'dark'
    ? 'blueprintDark'
    : 'blueprintMid';
}

export const IlloStyleContext = createContext({
  theme:      DEFAULT_THEME,
  setTheme:   () => {},
  palette:    THEMES[DEFAULT_THEME],
  illoStyle:  'icon',
  setIlloStyle: () => {},
});

export function IlloStyleProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem('illoStyle');
      // migrate old values: 'light' → 'blueprintMid', 'day' → 'blueprintMid',
      // 'blueprint'|'blueprintLight' → 'blueprintDark', 'dark' → 'night'
      if (stored === 'light' || stored === 'day') return 'blueprintMid';
      if (stored === 'dark')      return 'night';
      if (stored === 'blueprint' || stored === 'blueprintLight') return 'blueprintDark';
      if (THEMES[stored])         return stored;
      // No stored preference — auto-pick from site day/night mode
      return themeForSite();
    } catch { return DEFAULT_THEME; }
  });

  const [illoStyle, setIlloStyleState] = useState(() => {
    try {
      const stored = localStorage.getItem('illoStylePref');
      if (stored === 'lofi' || stored === 'detailed' || stored === 'icon') return stored;
    } catch {}
    return 'icon'; // default: icon style
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
    if (v !== 'lofi' && v !== 'detailed' && v !== 'icon') return;
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
