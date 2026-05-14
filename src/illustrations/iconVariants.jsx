/* ─────────────────────────────────────────────────────────────────────────────
 * iconVariants.jsx — Icon-style illustration variants for the Icon Style mode.
 * Each component reads the IlloStyleContext palette and renders a bold,
 * dark-field SVG icon (200 × 130 viewBox). One component per IlloXxx in the
 * detailed/lofi variants, named Ico<Suffix>.
 * ───────────────────────────────────────────────────────────────────────────── */
import { useIlloStyle } from '../context/IlloStyleContext';

/* ── Map / Tiles ─────────────────────────────────────────────────────────────── */

export function IcoMapDisplay() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Road grid — major roads */}
      <line x1="0" y1="65" x2="200" y2="65" stroke={palette.mid} strokeWidth="5" opacity="0.35" />
      <line x1="100" y1="0" x2="100" y2="130" stroke={palette.mid} strokeWidth="5" opacity="0.35" />
      {/* Minor roads */}
      <line x1="0" y1="32" x2="200" y2="32" stroke={palette.mid} strokeWidth="2" opacity="0.20" />
      <line x1="0" y1="98" x2="200" y2="98" stroke={palette.mid} strokeWidth="2" opacity="0.20" />
      <line x1="50" y1="0" x2="50" y2="130" stroke={palette.mid} strokeWidth="2" opacity="0.18" />
      <line x1="150" y1="0" x2="150" y2="130" stroke={palette.mid} strokeWidth="2" opacity="0.18" />
      {/* Route overlay */}
      <path d="M 20,108 C 50,90 80,65 120,40 C 148,24 168,35 185,20" fill="none" stroke={palette.accent} strokeWidth="4" strokeLinecap="round" />
      {/* GPS accuracy halo */}
      <circle cx="100" cy="65" r="18" fill={palette.accent} opacity="0.10" />
      {/* Vehicle dot */}
      <circle cx="100" cy="65" r="7" fill={palette.accent} />
      <circle cx="100" cy="65" r="3" fill={palette.dark} />
      {/* POI pins */}
      {[[60, 40], [145, 80], [155, 42]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="5" fill={palette.mid} opacity="0.65" />
          <circle cx={x} cy={y} r="2" fill={palette.dark} opacity="0.8" />
        </g>
      ))}
    </svg>
  );
}

export function IcoMapVectorTile() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* 2×2 tile grid */}
      <rect x="28" y="18" width="68" height="47" rx="3" fill={palette.mid} opacity="0.25" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
      <rect x="104" y="18" width="68" height="47" rx="3" fill={palette.mid} opacity="0.25" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
      <rect x="28" y="72" width="68" height="40" rx="3" fill={palette.mid} opacity="0.25" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
      <rect x="104" y="72" width="68" height="40" rx="3" fill={palette.mid} opacity="0.25" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
      {/* Vector path line weaving through tiles */}
      <polyline
        points="35,90 55,55 80,42 110,50 138,30 165,45"
        fill="none"
        stroke={palette.accent}
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IcoMapRasterTile() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* 2×2 grid — alternating fills for satellite photo feel */}
      <rect x="28" y="18" width="68" height="47" rx="3" fill={palette.accent} opacity="0.55" />
      <rect x="104" y="18" width="68" height="47" rx="3" fill={palette.mid} opacity="0.40" />
      <rect x="28" y="72" width="68" height="40" rx="3" fill={palette.mid} opacity="0.40" />
      <rect x="104" y="72" width="68" height="40" rx="3" fill={palette.accent} opacity="0.55" />
      {/* Tile borders */}
      <rect x="28" y="18" width="68" height="47" rx="3" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
      <rect x="104" y="18" width="68" height="47" rx="3" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
      <rect x="28" y="72" width="68" height="40" rx="3" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
      <rect x="104" y="72" width="68" height="40" rx="3" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
      {/* Texture lines in tiles */}
      <line x1="35" y1="30" x2="88" y2="30" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <line x1="35" y1="40" x2="88" y2="40" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <line x1="35" y1="50" x2="88" y2="50" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
    </svg>
  );
}

export function IcoMapSatelliteTile() {
  const { palette } = useIlloStyle();
  // Aerial photograph tile — building footprints + road grid
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Subtle ground tint */}
      <rect width="200" height="130" fill={palette.mid} opacity="0.12" />
      {/* Road grid */}
      <rect x="80" y="0" width="12" height="130" fill={palette.mid} opacity="0.22" />
      <rect x="0" y="55" width="200" height="10" fill={palette.mid} opacity="0.22" />
      <rect x="148" y="0" width="8" height="130" fill={palette.mid} opacity="0.14" />
      <rect x="0" y="100" width="200" height="6" fill={palette.mid} opacity="0.14" />
      {/* Building footprints — irregular, earthy */}
      {[
        { x: 14,  y: 10,  w: 30, h: 24, rx: 2, op: 0.65 },
        { x: 50,  y: 12,  w: 18, h: 30, rx: 1, op: 0.55 },
        { x: 14,  y: 40,  w: 44, h: 10, rx: 2, op: 0.50 },
        { x: 98,  y: 10,  w: 40, h: 20, rx: 2, op: 0.60 },
        { x: 98,  y: 36,  w: 24, h: 14, rx: 1, op: 0.45 },
        { x: 128, y: 36,  w: 18, h: 14, rx: 1, op: 0.40 },
        { x: 160, y: 10,  w: 30, h: 40, rx: 2, op: 0.55 },
        { x: 14,  y: 68,  w: 56, h: 22, rx: 2, op: 0.60 },
        { x: 98,  y: 68,  w: 34, h: 26, rx: 1, op: 0.50 },
        { x: 138, y: 68,  w: 20, h: 18, rx: 1, op: 0.42 },
        { x: 162, y: 68,  w: 26, h: 28, rx: 2, op: 0.55 },
        { x: 14,  y: 108, w: 60, h: 16, rx: 2, op: 0.45 },
        { x: 98,  y: 108, w: 46, h: 18, rx: 1, op: 0.50 },
        { x: 158, y: 108, w: 32, h: 16, rx: 2, op: 0.45 },
      ].map(({ x, y, w, h, rx, op }, i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx={rx}
          fill={palette.soft} opacity={op} />
      ))}
      {/* Tile border */}
      <rect x="1" y="1" width="198" height="128" fill="none" stroke={palette.mid} strokeWidth="1" opacity="0.25" />
    </svg>
  );
}

export function IcoMapStaticImage() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Map image frame */}
      <rect x="22" y="14" width="156" height="102" rx="7" fill={palette.mid} opacity="0.20" />
      {/* Road grid */}
      <line x1="22" y1="50" x2="178" y2="50" stroke={palette.mid} strokeWidth="3" opacity="0.22" strokeLinecap="round" />
      <line x1="22" y1="76" x2="178" y2="76" stroke={palette.mid} strokeWidth="2" opacity="0.14" strokeLinecap="round" />
      <line x1="70" y1="14" x2="70" y2="116" stroke={palette.mid} strokeWidth="3" opacity="0.22" strokeLinecap="round" />
      <line x1="130" y1="14" x2="130" y2="116" stroke={palette.mid} strokeWidth="2" opacity="0.14" strokeLinecap="round" />
      {/* Dashed bounding box */}
      <rect x="50" y="30" width="100" height="70" rx="3" fill="none"
        stroke={palette.accent} strokeWidth="1.5" strokeDasharray="5 3" opacity="0.70" />
      {/* Pin glow halo */}
      <circle cx="100" cy="63" r="18" fill={palette.danger} opacity="0.13" />
      <circle cx="100" cy="63" r="11" fill={palette.danger} opacity="0.18" />
      {/* Map pin — teardrop */}
      <path d="M 100,82 C 100,82 86,68 86,60 A 14,14 0 0 1 114,60 C 114,68 100,82 100,82 Z"
        fill={palette.danger} opacity="0.88" />
      <circle cx="100" cy="59" r="5" fill={palette.dark} opacity="0.65" />
    </svg>
  );
}

/* ── Search ──────────────────────────────────────────────────────────────────── */

export function IcoSearchFuzzy() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Soft glow rings */}
      <circle cx="90" cy="60" r="42" fill={palette.accent} opacity="0.07" />
      <circle cx="90" cy="60" r="35" fill={palette.accent} opacity="0.10" />
      {/* Magnifying glass circle */}
      <circle cx="90" cy="58" r="26" fill="none" stroke={palette.accent} strokeWidth="5" />
      {/* Handle */}
      <line x1="109" y1="77" x2="130" y2="100" stroke={palette.accent} strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

export function IcoSearchPOI() {
  const { palette } = useIlloStyle();
  // Category filter chips + active result card
  const chips = ['Cafe', 'Fuel', 'Food', 'Hotel'];
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Filter chips row */}
      {chips.map((_, i) => {
        const w = [34, 28, 30, 34][i];
        const x = [14, 54, 88, 124][i];
        const active = i === 0;
        return (
          <g key={i}>
            <rect x={x} y="14" width={w} height="16" rx="8"
              fill={active ? palette.accent : palette.mid}
              opacity={active ? 0.85 : 0.22}
              stroke={active ? palette.accent : 'none'} strokeWidth="1.5" />
            <rect x={x + 6} y="19" width={w - 12} height="5" rx="2.5"
              fill={active ? palette.dark : palette.mid} opacity={active ? 0.8 : 0.50} />
          </g>
        );
      })}
      {/* Result list */}
      {[0, 1, 2].map(i => (
        <g key={i}>
          <rect x="14" y={38 + i * 27} width="172" height="22" rx="6"
            fill={i === 0 ? palette.accent : palette.mid}
            opacity={i === 0 ? 0.14 : 0.09}
            stroke={i === 0 ? palette.accent : 'none'} strokeWidth="1" strokeOpacity="0.4" />
          {/* Category dot */}
          <circle cx="27" cy={49 + i * 27} r="5" fill={palette.accent} opacity={i === 0 ? 0.9 : 0.4} />
          {/* Name bar */}
          <rect x="38" y={45 + i * 27} width={[62, 50, 44][i]} height="6" rx="3"
            fill={i === 0 ? palette.white : palette.mid} opacity={i === 0 ? 0.55 : 0.40} />
          {/* Dist bar */}
          <rect x="38" y={53 + i * 27} width="28" height="4" rx="2" fill={palette.mid} opacity="0.28" />
          {/* Rating dots */}
          {i === 0 && [0,1,2,3,4].map(s => (
            <circle key={s} cx={150 + s * 7} cy={49 + i * 27} r="2.5" fill={s < 4 ? palette.warn : palette.mid} opacity="0.7" />
          ))}
        </g>
      ))}
    </svg>
  );
}

export function IcoSearchNearby() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Concentric dashed circles */}
      <circle cx="100" cy="62" r="50" fill="none" stroke={palette.mid} strokeWidth="2" strokeDasharray="6 5" opacity="0.5" />
      <circle cx="100" cy="62" r="35" fill="none" stroke={palette.mid} strokeWidth="2" strokeDasharray="6 4" opacity="0.7" />
      <circle cx="100" cy="62" r="20" fill="none" stroke={palette.accent} strokeWidth="2.5" strokeDasharray="5 3" opacity="0.9" />
      {/* Center pin */}
      <circle cx="100" cy="58" r="10" fill={palette.accent} />
      <circle cx="100" cy="58" r="4.5" fill={palette.dark} />
      <polygon points="100,68 94,58 106,58" fill={palette.accent} />
    </svg>
  );
}

export function IcoSearchAlongRoute() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Route arc */}
      <path d="M 20,80 C 55,80 70,38 100,38 C 130,38 145,70 180,55" fill="none" stroke={palette.accent} strokeWidth="4" strokeLinecap="round" />
      <circle cx="20" cy="80" r="6" fill={palette.accent} />
      <circle cx="180" cy="55" r="6" fill={palette.accent} />
      {/* Corridor highlight */}
      <path d="M 20,80 C 55,80 70,38 100,38 C 130,38 145,70 180,55" fill="none" stroke={palette.accent} strokeWidth="22" opacity="0.08" strokeLinecap="round" />
      {/* Fuel station pins ON the corridor */}
      {[[62, 58], [100, 38], [143, 53]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="9" fill={palette.mid} opacity="0.30" stroke={palette.accent} strokeWidth="1.5" strokeOpacity="0.6" />
          {/* Fuel pump icon — simple rect + nozzle */}
          <rect x={x - 4} y={y - 5} width="8" height="9" rx="1.5" fill={palette.accent} opacity="0.80" />
          <line x1={x + 4} y1={y - 3} x2={x + 7} y2={y - 3} stroke={palette.accent} strokeWidth="1.5" opacity="0.8" />
        </g>
      ))}
    </svg>
  );
}

export function IcoSearchAutocomplete() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Search bar */}
      <rect x="28" y="16" width="144" height="26" rx="13" fill={palette.mid} opacity="0.35" stroke={palette.accent} strokeWidth="2.5" />
      {/* Search icon inside bar */}
      <circle cx="47" cy="29" r="7" fill="none" stroke={palette.accent} strokeWidth="2.5" />
      <line x1="52" y1="34" x2="58" y2="40" stroke={palette.accent} strokeWidth="2.5" strokeLinecap="round" />
      {/* Result rows */}
      <rect x="28" y="52" width="144" height="12" rx="4" fill={palette.mid} opacity="0.30" />
      <rect x="28" y="69" width="144" height="12" rx="4" fill={palette.mid} opacity="0.22" />
      <rect x="28" y="86" width="144" height="12" rx="4" fill={palette.mid} opacity="0.15" />
      <rect x="28" y="103" width="120" height="12" rx="4" fill={palette.mid} opacity="0.10" />
      {/* Accent highlight on first row */}
      <rect x="28" y="52" width="5" height="12" rx="2" fill={palette.accent} />
    </svg>
  );
}

export function IcoGeocode() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Address card (top) */}
      <rect x="50" y="14" width="100" height="32" rx="5" fill={palette.panel ?? palette.mid} opacity="0.18" />
      <rect x="50" y="14" width="100" height="32" rx="5" fill="none" stroke={palette.mid} strokeWidth="1" opacity="0.35" />
      {/* Address icon dot */}
      <circle cx="64" cy="30" r="4" fill={palette.accent} />
      {/* Address text bars */}
      <rect x="74" y="24" width="44" height="5" rx="2" fill={palette.mid} opacity="0.7" />
      <rect x="74" y="33" width="32" height="4" rx="2" fill={palette.mid} opacity="0.4" />
      {/* Down arrow */}
      <line x1="100" y1="46" x2="100" y2="60" stroke={palette.accent} strokeWidth="2.5" strokeLinecap="round" />
      <polygon points="100,66 94,58 106,58" fill={palette.accent} />
      {/* Coordinates card (bottom) */}
      <rect x="50" y="68" width="100" height="32" rx="5" fill={palette.panel ?? palette.mid} opacity="0.18" />
      <rect x="50" y="68" width="100" height="32" rx="5" fill="none" stroke={palette.accent} strokeWidth="1.5" opacity="0.7" />
      {/* Coordinate icon — crosshair */}
      <circle cx="64" cy="84" r="4" fill="none" stroke={palette.accent} strokeWidth="1.5" />
      <line x1="64" y1="78" x2="64" y2="80" stroke={palette.accent} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="64" y1="88" x2="64" y2="90" stroke={palette.accent} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="58" y1="84" x2="60" y2="84" stroke={palette.accent} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="68" y1="84" x2="70" y2="84" stroke={palette.accent} strokeWidth="1.5" strokeLinecap="round" />
      {/* Coordinate text bars */}
      <rect x="74" y="78" width="52" height="5" rx="2" fill={palette.accent} opacity="0.7" />
      <rect x="74" y="87" width="40" height="4" rx="2" fill={palette.accent} opacity="0.45" />
    </svg>
  );
}

export function IcoReverseGeocode() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Map background tile */}
      <rect x="14" y="14" width="102" height="102" rx="6" fill={palette.mid} opacity="0.1" />
      <rect x="14" y="14" width="102" height="102" rx="6" fill="none" stroke={palette.mid} strokeWidth="1" opacity="0.25" />
      {/* Road grid lines */}
      <line x1="14" y1="65" x2="116" y2="65" stroke={palette.mid} strokeWidth="1.5" opacity="0.25" />
      <line x1="65" y1="14" x2="65" y2="116" stroke={palette.mid} strokeWidth="1.5" opacity="0.25" />
      <line x1="14" y1="40" x2="116" y2="40" stroke={palette.mid} strokeWidth="0.8" opacity="0.15" />
      <line x1="14" y1="90" x2="116" y2="90" stroke={palette.mid} strokeWidth="0.8" opacity="0.15" />
      <line x1="40" y1="14" x2="40" y2="116" stroke={palette.mid} strokeWidth="0.8" opacity="0.15" />
      <line x1="90" y1="14" x2="90" y2="116" stroke={palette.mid} strokeWidth="0.8" opacity="0.15" />
      {/* Crosshair at intersection */}
      <line x1="55" y1="65" x2="75" y2="65" stroke={palette.accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
      <line x1="65" y1="55" x2="65" y2="75" stroke={palette.accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
      {/* Pin */}
      <circle cx="65" cy="58" r="10" fill={palette.accent} />
      <circle cx="65" cy="58" r="4" fill={palette.dark} />
      <polygon points="65,70 58,58 72,58" fill={palette.accent} />
      {/* Coord card (right) */}
      <rect x="124" y="38" width="62" height="44" rx="5" fill={palette.panel ?? palette.mid} opacity="0.18" />
      <rect x="124" y="38" width="62" height="44" rx="5" fill="none" stroke={palette.mid} strokeWidth="1" opacity="0.35" />
      {/* Lat row */}
      <rect x="132" y="47" width="16" height="4" rx="2" fill={palette.mid} opacity="0.5" />
      <rect x="152" y="47" width="26" height="4" rx="2" fill={palette.accent} opacity="0.75" />
      {/* Lon row */}
      <rect x="132" y="57" width="16" height="4" rx="2" fill={palette.mid} opacity="0.5" />
      <rect x="152" y="57" width="26" height="4" rx="2" fill={palette.accent} opacity="0.75" />
      {/* Connector line from map to card */}
      <line x1="116" y1="65" x2="124" y2="65" stroke={palette.accent} strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6" />
      <circle cx="116" cy="65" r="2.5" fill={palette.accent} opacity="0.7" />
    </svg>
  );
}

/* ── Traffic ─────────────────────────────────────────────────────────────────── */

export function IcoTrafficFlow() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* City blocks */}
      <rect x="0"   y="0"  width="56" height="55" fill={palette.panel} opacity="0.5" rx="2"/>
      <rect x="72"  y="0"  width="56" height="55" fill={palette.panel} opacity="0.5" rx="2"/>
      <rect x="144" y="0"  width="56" height="55" fill={palette.panel} opacity="0.5" rx="2"/>
      <rect x="0"   y="73" width="56" height="57" fill={palette.panel} opacity="0.5" rx="2"/>
      <rect x="72"  y="73" width="56" height="57" fill={palette.panel} opacity="0.5" rx="2"/>
      <rect x="144" y="73" width="56" height="57" fill={palette.panel} opacity="0.5" rx="2"/>
      {/* Road surfaces */}
      <rect x="0"   y="55" width="200" height="18" fill={palette.bg} opacity="0.35"/>
      <rect x="56"  y="0"  width="16"  height="130" fill={palette.bg} opacity="0.35"/>
      <rect x="128" y="0"  width="16"  height="130" fill={palette.bg} opacity="0.35"/>
      {/* Traffic flow colour overlay — main horizontal road */}
      <rect x="0"   y="59" width="54"  height="8" rx="2" fill="#22c55e"        opacity="0.9"/>
      <rect x="70"  y="59" width="56"  height="8" rx="2" fill={palette.warn}   opacity="0.9"/>
      <rect x="128" y="59" width="14"  height="8" rx="2" fill="#f97316"        opacity="0.9"/>
      <rect x="144" y="59" width="56"  height="8" rx="2" fill={palette.danger} opacity="0.9"/>
      {/* Traffic flow — vertical roads */}
      <rect x="60"  y="0"  width="8" height="53" rx="2" fill="#22c55e"        opacity="0.8"/>
      <rect x="60"  y="75" width="8" height="55" rx="2" fill="#22c55e"        opacity="0.8"/>
      <rect x="132" y="0"  width="8" height="53" rx="2" fill={palette.warn}   opacity="0.8"/>
      <rect x="132" y="75" width="8" height="55" rx="2" fill={palette.danger} opacity="0.8"/>
      {/* Speed popup over the slow/orange section */}
      <rect x="116" y="30" width="52" height="22" rx="5" fill={palette.dark} opacity="0.97"/>
      <rect x="116" y="30" width="52" height="22" rx="5" fill="none" stroke={palette.border} strokeWidth="1"/>
      <circle cx="127" cy="41" r="6" fill="#f97316"/>
      <rect x="137" y="35" width="25" height="5" rx="2" fill={palette.mid} opacity="0.8"/>
      <rect x="137" y="43" width="18" height="4" rx="2" fill={palette.mid} opacity="0.45"/>
      <polygon points="136,52 150,52 143,57" fill={palette.dark} opacity="0.97"/>
    </svg>
  );
}

export function IcoTrafficFlowTile() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* 2×2 tile grid — each tile is a map fragment with road + traffic overlay */}
      {/* Tile TL — free flow (green) */}
      <rect x="8"   y="18" width="88" height="50" rx="4" fill={palette.panel} stroke={palette.border} strokeWidth="0.75"/>
      <rect x="8"   y="38" width="88" height="9"  fill={palette.bg} opacity="0.5"/>
      <rect x="47"  y="18" width="9"  height="50" fill={palette.bg} opacity="0.5"/>
      <rect x="8"   y="41" width="37" height="5" rx="1.5" fill="#22c55e"        opacity="0.9"/>
      <rect x="58"  y="41" width="38" height="5" rx="1.5" fill="#22c55e"        opacity="0.9"/>
      <rect x="49"  y="18" width="5"  height="18" rx="1.5" fill="#22c55e"       opacity="0.85"/>
      <rect x="49"  y="49" width="5"  height="19" rx="1.5" fill={palette.warn}   opacity="0.85"/>
      {/* Tile TR — slow/amber+red */}
      <rect x="104" y="18" width="88" height="50" rx="4" fill={palette.panel} stroke={palette.border} strokeWidth="0.75"/>
      <rect x="104" y="38" width="88" height="9"  fill={palette.bg} opacity="0.5"/>
      <rect x="143" y="18" width="9"  height="50" fill={palette.bg} opacity="0.5"/>
      <rect x="104" y="41" width="37" height="5" rx="1.5" fill={palette.warn}   opacity="0.9"/>
      <rect x="154" y="41" width="38" height="5" rx="1.5" fill={palette.danger} opacity="0.9"/>
      <rect x="145" y="18" width="5"  height="18" rx="1.5" fill={palette.warn}   opacity="0.85"/>
      <rect x="145" y="49" width="5"  height="19" rx="1.5" fill={palette.danger} opacity="0.85"/>
      {/* Tile BL — mixed */}
      <rect x="8"   y="74" width="88" height="48" rx="4" fill={palette.panel} stroke={palette.border} strokeWidth="0.75"/>
      <rect x="8"   y="94" width="88" height="9"  fill={palette.bg} opacity="0.5"/>
      <rect x="47"  y="74" width="9"  height="48" fill={palette.bg} opacity="0.5"/>
      <rect x="8"   y="97" width="18" height="5" rx="1.5" fill="#22c55e"        opacity="0.9"/>
      <rect x="28"  y="97" width="20" height="5" rx="1.5" fill={palette.warn}   opacity="0.9"/>
      <rect x="50"  y="97" width="18" height="5" rx="1.5" fill="#f97316"        opacity="0.9"/>
      <rect x="70"  y="97" width="26" height="5" rx="1.5" fill={palette.danger} opacity="0.9"/>
      <rect x="49"  y="74" width="5"  height="18" rx="1.5" fill="#22c55e"        opacity="0.85"/>
      <rect x="49"  y="104" width="5" height="18" rx="1.5" fill="#22c55e"        opacity="0.85"/>
      {/* Tile BR — congested (red) */}
      <rect x="104" y="74" width="88" height="48" rx="4" fill={palette.panel} stroke={palette.border} strokeWidth="0.75"/>
      <rect x="104" y="94" width="88" height="9"  fill={palette.bg} opacity="0.5"/>
      <rect x="143" y="74" width="9"  height="48" fill={palette.bg} opacity="0.5"/>
      <rect x="104" y="97" width="37" height="5" rx="1.5" fill={palette.danger} opacity="0.9"/>
      <rect x="154" y="97" width="38" height="5" rx="1.5" fill="#f97316"        opacity="0.9"/>
      <rect x="145" y="74" width="5"  height="18" rx="1.5" fill={palette.warn}   opacity="0.85"/>
      <rect x="145" y="104" width="5" height="18" rx="1.5" fill={palette.danger} opacity="0.85"/>
      {/* Coordinate badge */}
      <rect x="54" y="5" width="92" height="12" rx="6" fill={palette.mid} opacity="0.5"/>
      <rect x="58" y="7.5" width="84" height="5" rx="2.5" fill={palette.mid} opacity="0.5"/>
    </svg>
  );
}

export function IcoTrafficIncidents() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* City blocks */}
      <rect x="0"   y="0"  width="76" height="55" fill={palette.panel} opacity="0.5" rx="2"/>
      <rect x="94"  y="0"  width="106" height="55" fill={palette.panel} opacity="0.5" rx="2"/>
      <rect x="0"   y="73" width="44" height="57" fill={palette.panel} opacity="0.5" rx="2"/>
      <rect x="62"  y="73" width="36" height="57" fill={palette.panel} opacity="0.5" rx="2"/>
      <rect x="116" y="73" width="84" height="57" fill={palette.panel} opacity="0.5" rx="2"/>
      {/* Road surfaces */}
      <rect x="0"   y="55" width="200" height="18" fill={palette.bg} opacity="0.35"/>
      <rect x="76"  y="0"  width="18"  height="130" fill={palette.bg} opacity="0.35"/>
      <rect x="44"  y="55" width="18"  height="75" fill={palette.bg} opacity="0.35"/>
      {/* Subtle flow base colour on roads */}
      <rect x="0"   y="59" width="74"  height="8" rx="2" fill={palette.accent} opacity="0.4"/>
      <rect x="92"  y="59" width="108" height="8" rx="2" fill={palette.accent} opacity="0.4"/>
      {/* ── Incident 1 — Accident: red circle + ! ── */}
      <circle cx="46" cy="64" r="12" fill={palette.danger} opacity="0.92"/>
      <circle cx="46" cy="64" r="17" stroke={palette.danger} strokeWidth="1.5" fill="none" opacity="0.28"/>
      <rect x="44.5" y="57"  width="3"   height="9"   rx="1.5" fill="white"/>
      <circle cx="46" cy="70" r="2.2" fill="white"/>
      {/* ── Incident 2 — Roadworks: amber diamond ── */}
      <rect x="82" y="24" width="18" height="18" rx="2" fill={palette.warn} opacity="0.92" transform="rotate(45 91 33)"/>
      <rect x="89" y="25"  width="3.5" height="10" rx="1.5" fill={palette.dark}/>
      <circle cx="90.5" cy="38.5" r="2.2" fill={palette.dark}/>
      {/* ── Incident 3 — Road closed: grey X ── */}
      <rect x="136" y="60" width="24" height="12" rx="3" fill={palette.mid} opacity="0.9"/>
      <line x1="140" y1="63" x2="156" y2="69" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <line x1="156" y1="63" x2="140" y2="69" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      {/* ── Incident 4 — Jam: orange dot on side road ── */}
      <circle cx="108" cy="37" r="8" fill="#f97316" opacity="0.88"/>
      <rect x="106" y="31" width="3" height="7"  rx="1.5" fill="white"/>
      <circle cx="107.5" cy="41.5" r="1.8" fill="white"/>
      {/* ── Popup for accident ── */}
      <rect x="2"  y="78" width="78" height="36" rx="6" fill={palette.dark} opacity="0.97"/>
      <rect x="2"  y="78" width="78" height="36" rx="6" fill="none" stroke={palette.danger} strokeWidth="1" opacity="0.5"/>
      <circle cx="16" cy="89" r="6" fill={palette.danger} opacity="0.9"/>
      <rect x="27" y="84" width="48" height="6" rx="2.5" fill={palette.mid} opacity="0.7"/>
      <rect x="27" y="93" width="36" height="5" rx="2"   fill={palette.mid} opacity="0.4"/>
      <rect x="6"  y="104" width="68" height="4" rx="2"  fill={palette.mid} opacity="0.25"/>
      <polygon points="12,78 28,78 20,72" fill={palette.dark} opacity="0.97"/>
    </svg>
  );
}

export function IcoTrafficStats() {
  const { palette } = useIlloStyle();
  // 12-bar chart — week data, coloured by speed band
  const bars = [
    { h: 28, col: 'green' },  // Mon
    { h: 42, col: 'green' },
    { h: 55, col: 'amber' },  // Tue
    { h: 60, col: 'amber' },
    { h: 72, col: 'red' },    // Wed peak
    { h: 68, col: 'red' },
    { h: 50, col: 'amber' },  // Thu
    { h: 45, col: 'amber' },
    { h: 62, col: 'red' },    // Fri peak
    { h: 35, col: 'green' },  // Sat
    { h: 20, col: 'green' },
    { h: 18, col: 'green' },  // Sun
  ];
  const color = { green: palette.accent, amber: palette.warn, red: palette.danger };
  const bw = 11, gap = 3, ox = 18, baseline = 108;
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Baseline */}
      <line x1={ox - 2} y1={baseline} x2={ox + bars.length * (bw + gap) + 2} y2={baseline} stroke={palette.mid} strokeWidth="1.5" opacity="0.4" />
      {/* Bars */}
      {bars.map(({ h, col }, i) => (
        <rect key={i}
          x={ox + i * (bw + gap)} y={baseline - h}
          width={bw} height={h} rx="3"
          fill={color[col]} opacity={0.75}
        />
      ))}
      {/* Y-axis reference lines */}
      {[25, 50, 75].map(y => (
        <line key={y} x1={ox - 2} y1={baseline - y} x2={ox + bars.length * (bw + gap)} y2={baseline - y}
          stroke={palette.mid} strokeWidth="0.75" opacity="0.18" strokeDasharray="4 3" />
      ))}
    </svg>
  );
}

export function IcoTrafficModelID() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Connection lines */}
      <line x1="50" y1="30" x2="100" y2="65" stroke={palette.mid} strokeWidth="2" opacity="0.5" />
      <line x1="150" y1="30" x2="100" y2="65" stroke={palette.mid} strokeWidth="2" opacity="0.5" />
      <line x1="50" y1="100" x2="100" y2="65" stroke={palette.mid} strokeWidth="2" opacity="0.5" />
      <line x1="150" y1="100" x2="100" y2="65" stroke={palette.mid} strokeWidth="2" opacity="0.5" />
      <line x1="50" y1="30" x2="150" y2="30" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
      <line x1="50" y1="100" x2="150" y2="100" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
      {/* Nodes */}
      <circle cx="50" cy="30" r="10" fill={palette.mid} />
      <circle cx="150" cy="30" r="10" fill={palette.mid} />
      <circle cx="50" cy="100" r="10" fill={palette.mid} />
      <circle cx="150" cy="100" r="10" fill={palette.mid} />
      {/* Center node */}
      <circle cx="100" cy="65" r="14" fill={palette.accent} />
      <circle cx="100" cy="65" r="7" fill={palette.dark} />
    </svg>
  );
}

/* ── EV / Charging ───────────────────────────────────────────────────────────── */

export function IcoEV() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Large bold lightning bolt */}
      <polygon
        points="115,12 80,70 102,70 85,118 128,55 104,55"
        fill={palette.accent}
      />
    </svg>
  );
}

export function IcoEVBattery() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Battery outline */}
      <rect x="22" y="38" width="140" height="54" rx="7" fill="none" stroke={palette.accent} strokeWidth="3" />
      {/* Terminal nub */}
      <rect x="162" y="54" width="16" height="22" rx="4" fill={palette.accent} />
      {/* Charge fill */}
      <rect x="28" y="44" width="80" height="42" rx="4" fill={palette.mid} opacity="0.50" />
      {/* Bolt inside */}
      <polygon points="84,52 70,68 80,68 68,80 90,62 80,62" fill={palette.accent} />
    </svg>
  );
}

export function IcoEVRouting() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Route arc */}
      <path d="M 20,72 C 50,72 65,38 100,38 C 135,38 150,72 180,72" fill="none" stroke={palette.mid} strokeWidth="3.5" strokeLinecap="round" opacity="0.50" />
      {/* Origin + destination */}
      <circle cx="20" cy="72" r="6" fill={palette.accent} />
      <circle cx="180" cy="72" r="6" fill={palette.accent} />
      {/* Two charging stop circles */}
      {[[72, 55], [128, 55]].map(([x, y]) => (
        <g key={x}>
          <circle cx={x} cy={y} r="10" fill={palette.mid} opacity="0.25" stroke={palette.accent} strokeWidth="1.5" />
          {/* Bolt */}
          <polygon points={`${x + 2},${y - 6} ${x - 3},${y + 1} ${x},${y + 1} ${x - 2},${y + 6} ${x + 3},${y - 1} ${x},${y - 1}`} fill={palette.accent} opacity="0.90" />
        </g>
      ))}
      {/* SOC trajectory bar */}
      <rect x="20" y="88" width="160" height="8" rx="4" fill={palette.mid} opacity="0.18" />
      {/* SOC segments */}
      <rect x="20" y="88" width="52" height="8" rx="4" fill={palette.accent} opacity="0.70" />
      <rect x="72" y="88" width="56" height="8" rx="4" fill={palette.accent} opacity="0.55" />
      <rect x="128" y="88" width="52" height="8" rx="4" fill={palette.accent} opacity="0.38" />
      {/* Segment separators */}
      <line x1="72" y1="86" x2="72" y2="98" stroke={palette.dark} strokeWidth="2" />
      <line x1="128" y1="86" x2="128" y2="98" stroke={palette.dark} strokeWidth="2" />
    </svg>
  );
}

export function IcoEVSearchNearby() {
  const { palette } = useIlloStyle();
  const stations = [
    { avail: true,  pct: 0.75 },
    { avail: true,  pct: 0.45 },
    { avail: false, pct: 0.06 },
  ];
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Search header */}
      <rect x="16" y="8" width="168" height="20" rx="6" fill={palette.mid} opacity="0.18" />
      <circle cx="32" cy="18" r="5.5" fill="none" stroke={palette.accent} strokeWidth="1.5" opacity="0.70" />
      <line x1="36" y1="22" x2="40" y2="26" stroke={palette.accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.70" />
      <rect x="48" y="14" width="70" height="5" rx="2.5" fill={palette.mid} opacity="0.40" />
      <rect x="48" y="21" width="44" height="4" rx="2" fill={palette.mid} opacity="0.25" />
      {stations.map(({ avail, pct }, i) => (
        <g key={i}>
          {/* Row bg */}
          <rect x="16" y={34 + i * 29} width="168" height="25" rx="6"
            fill={avail ? palette.accent : palette.mid} opacity={avail ? 0.09 : 0.07} />
          {/* EV station icon — bolt in circle */}
          <circle cx="30" cy={46 + i * 29} r="8"
            fill={avail ? palette.accent : palette.mid} opacity={avail ? 0.20 : 0.15} />
          <polygon
            points={`30,${40 + i * 29} 27,${46 + i * 29} 30,${46 + i * 29} 27,${52 + i * 29} 33,${45 + i * 29} 30,${45 + i * 29}`}
            fill={avail ? palette.accent : palette.mid} opacity={avail ? 0.90 : 0.45} />
          {/* Operator name bar */}
          <rect x="44" y={41 + i * 29} width={[56, 48, 52][i]} height="6" rx="3"
            fill={palette.white} opacity="0.40" />
          {/* Power bar */}
          <rect x="44" y={50 + i * 29} width="26" height="4" rx="2"
            fill={palette.mid} opacity="0.32" />
          {/* Availability bar */}
          <rect x="118" y={40 + i * 29} width="52" height="11" rx="3.5"
            fill={palette.mid} opacity="0.16" />
          <rect x="118" y={40 + i * 29} width={Math.round(52 * pct)} height="11" rx="3.5"
            fill={avail ? palette.accent : palette.danger} opacity="0.68" />
        </g>
      ))}
    </svg>
  );
}

export function IcoEVChargingAvailability() {
  const { palette } = useIlloStyle();
  const connectors = [
    { status: 'available', color: null, barW: [34, 22] },
    { status: 'charging',  color: null, barW: [28, 18] },
    { status: 'offline',   color: null, barW: [40, 14] },
    { status: 'available', color: null, barW: [32, 20] },
  ];
  const getColor = (s) => s === 'available' ? palette.accent : s === 'charging' ? palette.warn : palette.mid;
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Header — station card */}
      <rect x="16" y="8" width="168" height="14" rx="5" fill={palette.mid} opacity="0.18" />
      <polygon points="28,11 24,17 27,17 23,22 33,16 30,16" fill={palette.accent} opacity="0.85" />
      <rect x="38" y="11" width="56" height="4" rx="2" fill={palette.mid} opacity="0.45" />
      <rect x="38" y="17" width="38" height="3" rx="1.5" fill={palette.mid} opacity="0.28" />
      {connectors.map(({ status, barW }, i) => {
        const col = getColor(status);
        const isActive = status !== 'offline';
        return (
          <g key={i}>
            <rect x="16" y={28 + i * 23} width="168" height="19" rx="5"
              fill={palette.mid} opacity="0.10"
              stroke={col} strokeWidth="0.75" strokeOpacity={isActive ? 0.35 : 0.15} />
            {/* Plug body */}
            <rect x="24" y={32 + i * 23} width="9" height="11" rx="2"
              fill={col} opacity={isActive ? 0.75 : 0.30} />
            {/* Plug prongs */}
            <rect x="26" y={30 + i * 23} width="2" height="3" rx="1"
              fill={col} opacity={isActive ? 0.70 : 0.28} />
            <rect x="30" y={30 + i * 23} width="2" height="3" rx="1"
              fill={col} opacity={isActive ? 0.70 : 0.28} />
            {/* Connector type bar */}
            <rect x="40" y={32 + i * 23} width={barW[0]} height="5" rx="2.5"
              fill={palette.white} opacity="0.38" />
            {/* kW bar */}
            <rect x="40" y={39 + i * 23} width={barW[1]} height="4" rx="2"
              fill={palette.mid} opacity="0.32" />
            {/* Status badge */}
            <rect x="148" y={31 + i * 23} width="30" height="13" rx="4"
              fill={col} opacity={isActive ? 0.22 : 0.12} />
            <circle cx="156" cy={37 + i * 23} r="3.5"
              fill={col} opacity={isActive ? 0.85 : 0.35} />
            <rect x="163" y={35 + i * 23} width="12" height="4" rx="2"
              fill={col} opacity={isActive ? 0.72 : 0.35} />
          </g>
        );
      })}
    </svg>
  );
}

export function IcoEVRequirements() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Checklist rows */}
      <circle cx="35" cy="38" r="7" fill="none" stroke={palette.mid} strokeWidth="2.5" />
      <rect x="50" y="33" width="80" height="9" rx="3" fill={palette.mid} opacity="0.55" />
      <circle cx="35" cy="62" r="7" fill="none" stroke={palette.mid} strokeWidth="2.5" />
      <rect x="50" y="57" width="70" height="9" rx="3" fill={palette.mid} opacity="0.45" />
      <circle cx="35" cy="86" r="7" fill="none" stroke={palette.accent} strokeWidth="2.5" />
      <rect x="50" y="81" width="75" height="9" rx="3" fill={palette.mid} opacity="0.35" />
      {/* Check mark on first two */}
      <polyline points="29,38 33,43 41,33" fill="none" stroke={palette.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="29,62 33,67 41,57" fill="none" stroke={palette.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Bolt icon on right */}
      <polygon points="165,22 148,68 160,68 143,108 176,55 162,55" fill={palette.accent} />
    </svg>
  );
}

export function IcoEVNavUI() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Phone / screen outline */}
      <rect x="55" y="10" width="90" height="110" rx="10" fill="none" stroke={palette.mid} strokeWidth="3" />
      <rect x="60" y="18" width="80" height="90" rx="5" fill={palette.mid} opacity="0.15" />
      {/* Screen content — bolt symbol */}
      <polygon points="106,30 94,52 102,52 90,72 114,46 104,46" fill={palette.accent} />
      {/* Battery bar */}
      <rect x="70" y="80" width="60" height="14" rx="4" fill="none" stroke={palette.mid} strokeWidth="2" />
      <rect x="130" y="85" width="6" height="4" rx="1" fill={palette.mid} />
      <rect x="72" y="82" width="38" height="10" rx="3" fill={palette.accent} opacity="0.7" />
      {/* Home bar */}
      <rect x="80" y="112" width="40" height="4" rx="2" fill={palette.mid} opacity="0.4" />
    </svg>
  );
}

/* ── Routing ─────────────────────────────────────────────────────────────────── */

export function IcoCalculateRoute() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Subtle road grid */}
      <path d="M0 72 Q60 64 100 72 T200 68" stroke={palette.mid} strokeWidth="5" opacity="0.15"/>
      <path d="M72 0 L70 130" stroke={palette.mid} strokeWidth="4" opacity="0.12"/>
      <path d="M138 0 L136 130" stroke={palette.mid} strokeWidth="4" opacity="0.12"/>
      {/* Route leg A→B: glow + stroke */}
      <path d="M24 98 C50 98 78 50 103 50" stroke={palette.accent} strokeWidth="8" strokeLinecap="round" opacity="0.18"/>
      <path d="M24 98 C50 98 78 50 103 50" stroke={palette.accent} strokeWidth="2.5" strokeLinecap="round" opacity="0.85"/>
      {/* Route leg B→C: glow + stroke */}
      <path d="M103 50 C128 50 152 25 178 25" stroke={palette.accent} strokeWidth="8" strokeLinecap="round" opacity="0.18"/>
      <path d="M103 50 C128 50 152 25 178 25" stroke={palette.accent} strokeWidth="2.5" strokeLinecap="round" opacity="0.85"/>
      {/* Pin A — origin */}
      <circle cx="24" cy="98" r="8" fill={palette.accent} opacity="0.20"/>
      <circle cx="24" cy="98" r="5.5" fill={palette.accent}/>
      <text x="24" y="101.5" textAnchor="middle" fontSize="6" fontWeight="bold" fill={palette.dark} fontFamily="system-ui">A</text>
      {/* Pin B — waypoint */}
      <circle cx="103" cy="50" r="8" fill={palette.mid} opacity="0.20"/>
      <circle cx="103" cy="50" r="5.5" fill={palette.mid}/>
      <text x="103" y="53.5" textAnchor="middle" fontSize="6" fontWeight="bold" fill={palette.dark} fontFamily="system-ui">B</text>
      {/* Pin C — destination */}
      <circle cx="178" cy="25" r="8" fill={palette.danger ?? '#e2001a'} opacity="0.20"/>
      <circle cx="178" cy="25" r="5.5" fill={palette.danger ?? '#e2001a'}/>
      <text x="178" y="28.5" textAnchor="middle" fontSize="6" fontWeight="bold" fill={palette.white} fontFamily="system-ui">C</text>
      {/* Stats bar */}
      <rect x="12" y="110" width="176" height="14" rx="5" fill={palette.mid} opacity="0.18"/>
      {[['2h 14m', 42], ['189 km', 100], ['14:32', 158]].map(([v, x]) => (
        <text key={x} x={x} y="120" textAnchor="middle" fontSize="7" fontWeight="700" fill={palette.white} fontFamily="system-ui" opacity="0.80">{v}</text>
      ))}
    </svg>
  );
}

export function IcoBatchRouting() {
  const { palette } = useIlloStyle();
  // 4 concurrent route progress bars with different completion %
  const routes = [
    { pct: 0.85, color: palette.accent  },
    { pct: 0.60, color: palette.mid     },
    { pct: 0.40, color: palette.accent  },
    { pct: 0.72, color: palette.mid     },
  ];
  const trackW = 130, ox = 30, oy = 20, rowH = 24;
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {routes.map(({ pct, color }, i) => {
        const y = oy + i * rowH;
        return (
          <g key={i}>
            {/* Origin dot */}
            <circle cx={ox} cy={y + 5} r="4" fill={color} opacity={0.6 + i * 0.05} />
            {/* Track */}
            <rect x={ox + 8} y={y + 2} width={trackW} height="6" rx="3" fill={palette.mid} opacity="0.15" />
            {/* Fill */}
            <rect x={ox + 8} y={y + 2} width={trackW * pct} height="6" rx="3" fill={color} opacity={i % 2 === 0 ? 0.85 : 0.55} />
            {/* km badge at right */}
            <rect x={ox + 8 + trackW + 6} y={y} width="26" height="10" rx="3" fill={color} opacity="0.18" />
            <rect x={ox + 8 + trackW + 9} y={y + 3} width="20" height="4" rx="2" fill={color} opacity="0.60" />
          </g>
        );
      })}
      {/* Parallel dispatch badge at bottom */}
      <rect x="30" y="116" width="140" height="10" rx="4" fill={palette.mid} opacity="0.12" />
      <rect x="30" y="116" width="140" height="10" rx="4" fill="none" stroke={palette.accent} strokeWidth="1" strokeOpacity="0.40" />
      {[0,1,2,3].map(i => (
        <rect key={i} x={38 + i * 32} y="119" width="20" height="4" rx="2" fill={palette.accent} opacity="0.55" />
      ))}
    </svg>
  );
}

export function IcoMatrixRouting() {
  const { palette } = useIlloStyle();
  // Left column dots at x=45, y: 32,65,98
  // Right column dots at x=155, y: 32,65,98
  const leftY = [32, 65, 98];
  const rightY = [32, 65, 98];
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Lines from each left to each right */}
      {leftY.map((ly) =>
        rightY.map((ry, ri) => (
          <line key={`${ly}-${ry}`} x1="45" y1={ly} x2="155" y2={ry} stroke={palette.mid} strokeWidth="1.5" opacity="0.40" />
        ))
      )}
      {/* Left dots */}
      {leftY.map((y) => (
        <circle key={y} cx="45" cy={y} r="8" fill={palette.accent} />
      ))}
      {/* Right dots */}
      {rightY.map((y) => (
        <circle key={y} cx="155" cy={y} r="8" fill={palette.mid} />
      ))}
    </svg>
  );
}

export function IcoIntentRouting() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Speech bubble */}
      <rect x="15" y="28" width="72" height="48" rx="10" fill={palette.mid} opacity="0.45" stroke={palette.mid} strokeWidth="2.5" />
      {/* Bubble tail */}
      <polygon points="40,76 28,96 58,76" fill={palette.mid} opacity="0.45" />
      {/* Lines in bubble */}
      <rect x="24" y="38" width="54" height="7" rx="2" fill={palette.soft} opacity="0.5" />
      <rect x="24" y="50" width="40" height="7" rx="2" fill={palette.soft} opacity="0.35" />
      {/* Arrow */}
      <line x1="98" y1="60" x2="116" y2="60" stroke={palette.accent} strokeWidth="3.5" strokeLinecap="round" />
      <polygon points="114,55 124,60 114,65" fill={palette.accent} />
      {/* Route fork (Y-shape) */}
      <line x1="130" y1="60" x2="150" y2="60" stroke={palette.accent} strokeWidth="3.5" strokeLinecap="round" />
      <line x1="150" y1="60" x2="172" y2="38" stroke={palette.accent} strokeWidth="3" strokeLinecap="round" />
      <line x1="150" y1="60" x2="172" y2="82" stroke={palette.accent} strokeWidth="3" strokeLinecap="round" />
      <circle cx="172" cy="38" r="5" fill={palette.accent} />
      <circle cx="172" cy="82" r="5" fill={palette.accent} />
    </svg>
  );
}

export function IcoReachableRange() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Concentric irregular curves */}
      <ellipse cx="100" cy="62" rx="76" ry="50" fill="none" stroke={palette.mid} strokeWidth="2" opacity="0.35" />
      <ellipse cx="100" cy="62" rx="52" ry="34" fill="none" stroke={palette.mid} strokeWidth="2" opacity="0.55" />
      <ellipse cx="100" cy="62" rx="28" ry="19" fill="none" stroke={palette.accent} strokeWidth="2.5" opacity="0.80" />
      {/* Center pin */}
      <circle cx="100" cy="57" r="10" fill={palette.accent} />
      <circle cx="100" cy="57" r="4.5" fill={palette.dark} />
      <polygon points="100,67 93,57 107,57" fill={palette.accent} />
    </svg>
  );
}

export function IcoWaypointOpt() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Divider */}
      <line x1="100" y1="15" x2="100" y2="115" stroke={palette.mid} strokeWidth="1" opacity="0.25" strokeDasharray="3 4" />
      {/* LEFT — unordered zigzag route */}
      <path d="M 18,65 L 32,40 L 46,80 L 60,38 L 74,72 L 88,65" fill="none" stroke={palette.mid} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
      <circle cx="18" cy="65" r="5" fill={palette.mid} opacity="0.7" />
      <circle cx="88" cy="65" r="5" fill={palette.mid} opacity="0.7" />
      {[32, 46, 60, 74].map((x, i) => {
        const y = [40, 80, 38, 72][i];
        return <circle key={x} cx={x} cy={y} r="3.5" fill={palette.mid} opacity="0.45" />;
      })}
      {/* RIGHT — optimised smooth route */}
      <path d="M 112,65 C 122,55 132,55 142,65 C 152,75 162,65 182,65" fill="none" stroke={palette.accent} strokeWidth="3" strokeLinecap="round" />
      <circle cx="112" cy="65" r="5" fill={palette.accent} />
      <circle cx="182" cy="65" r="5" fill={palette.accent} />
      {[127, 142, 157].map((x, i) => {
        const y = [57, 65, 70][i];
        return <circle key={x} cx={x} cy={y} r="3.5" fill={palette.accent} opacity="0.75" />;
      })}
      {/* Optimised label — checkmark */}
      <circle cx="147" cy="30" r="11" fill={palette.accent} opacity="0.18" />
      <polyline points="141,30 146,35 154,25" fill="none" stroke={palette.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IcoRoutingWeather() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Route arc — bottom of frame */}
      <path d="M 22,108 C 60,98 100,95 178,108" fill="none" stroke={palette.mid} strokeWidth="3.5" strokeLinecap="round" opacity="0.45" />
      <circle cx="22" cy="108" r="5" fill={palette.accent} opacity="0.8" />
      <circle cx="178" cy="108" r="5" fill={palette.accent} opacity="0.8" />
      {/* Leg 1 — sunshine (clear) */}
      <circle cx="55" cy="52" r="14" fill={palette.warn} opacity="0.80" />
      {[0,45,90,135,180,225,270,315].map(a => {
        const r = (a * Math.PI) / 180;
        return <line key={a} x1={55 + 17 * Math.cos(r)} y1={52 + 17 * Math.sin(r)}
          x2={55 + 22 * Math.cos(r)} y2={52 + 22 * Math.sin(r)}
          stroke={palette.warn} strokeWidth="2.5" strokeLinecap="round" opacity="0.65" />;
      })}
      {/* Leg 2 — snow (cold) */}
      <circle cx="100" cy="52" r="12" fill={palette.mid} opacity="0.55" />
      {[0,60,120,180,240,300].map(a => {
        const r = (a * Math.PI) / 180;
        return <line key={a} x1={100 + 13 * Math.cos(r)} y1={52 + 13 * Math.sin(r)}
          x2={100 + 20 * Math.cos(r)} y2={52 + 20 * Math.sin(r)}
          stroke={palette.white} strokeWidth="2" strokeLinecap="round" opacity="0.50" />;
      })}
      {/* Leg 3 — rain */}
      <ellipse cx="148" cy="46" rx="20" ry="12" fill={palette.mid} opacity="0.50" />
      {[138, 148, 158].map(x => (
        <line key={x} x1={x} y1="60" x2={x - 4} y2="72" stroke={palette.accent} strokeWidth="2.5" strokeLinecap="round" />
      ))}
      {/* Temp icons under each leg — placeholder bars */}
      {[55, 100, 145].map((x, i) => (
        <rect key={x} x={x - 12} y="82" width="24" height="6" rx="3"
          fill={i === 0 ? palette.warn : i === 1 ? palette.navy : palette.accent}
          opacity={i === 1 ? 0.5 : 0.6} />
      ))}
    </svg>
  );
}

export function IcoSnapToRoads() {
  const { palette } = useIlloStyle();
  // Curving road + raw GPS scatter (grey) + snapped points (blue/accent) on line
  const roadPts = [[20,80],[55,65],[100,55],[145,60],[180,50]];
  const rawGPS = [[38,52],[55,90],[78,42],[100,78],[124,38],[148,82],[168,45]];
  const snapped = [[38,72],[55,66],[78,58],[100,55],[124,57],[148,60],[168,52]];
  const pathD = roadPts.map(([x,y], i) => (i === 0 ? `M ${x},${y}` : `L ${x},${y}`)).join(' ');
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Road */}
      <path d={pathD} fill="none" stroke={palette.mid} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" opacity="0.30" />
      <path d={pathD} fill="none" stroke={palette.mid} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
      {/* Raw GPS points — faint grey scatter */}
      {rawGPS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill={palette.mid} opacity="0.35" />
      ))}
      {/* Snap lines — dashed, from raw to snapped */}
      {rawGPS.map(([rx, ry], i) => (
        <line key={i} x1={rx} y1={ry} x2={snapped[i][0]} y2={snapped[i][1]}
          stroke={palette.accent} strokeWidth="1" strokeDasharray="3 2" opacity="0.45" />
      ))}
      {/* Snapped points — accent, on the road line */}
      {snapped.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4.5" fill={palette.accent} opacity="0.85" />
      ))}
    </svg>
  );
}

/* ── Navigation / Guidance ───────────────────────────────────────────────────── */

export function IcoNavGuidance() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Large map canvas — two-thirds of frame */}
      <rect x="10" y="10" width="180" height="80" rx="8" fill={palette.mid} opacity="0.14" />
      {/* Road grid lines on map */}
      <line x1="10" y1="50" x2="190" y2="50" stroke={palette.mid} strokeWidth="1" opacity="0.20" />
      <line x1="100" y1="10" x2="100" y2="90" stroke={palette.mid} strokeWidth="1" opacity="0.20" />
      {/* Route arc on map */}
      <path d="M 30,75 C 55,65 80,30 130,28 C 155,28 175,45 185,75" fill="none" stroke={palette.accent} strokeWidth="3.5" strokeLinecap="round" />
      {/* Vehicle dot */}
      <circle cx="100" cy="45" r="6" fill={palette.accent} />
      {/* Search bar at top of map */}
      <rect x="20" y="16" width="120" height="14" rx="7" fill={palette.mid} opacity="0.35" />
      <circle cx="33" cy="23" r="4" fill="none" stroke={palette.mid} strokeWidth="1.5" opacity="0.6" />
      <rect x="42" y="20" width="60" height="5" rx="2.5" fill={palette.mid} opacity="0.40" />
      {/* Bottom action row — recent place chips */}
      <rect x="10" y="96" width="180" height="26" rx="7" fill={palette.mid} opacity="0.14" />
      {[18, 80, 142].map(x => (
        <rect key={x} x={x} y={103} width="44" height="12" rx="6" fill={palette.mid} opacity="0.30" />
      ))}
      {[18, 80, 142].map((x, i) => (
        <circle key={x} cx={x + 7} cy="109" r="3" fill={[palette.accent, palette.warn, palette.mid][i]} opacity="0.7" />
      ))}
    </svg>
  );
}

export function IcoNavControls() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Map canvas — road grid */}
      <line x1="0" y1="55" x2="200" y2="55" stroke={palette.mid} strokeWidth="4" opacity="0.25" />
      <line x1="90" y1="0" x2="90" y2="130" stroke={palette.mid} strokeWidth="4" opacity="0.25" />
      <line x1="0" y1="100" x2="200" y2="100" stroke={palette.mid} strokeWidth="2" opacity="0.14" />
      {/* TomTom-red active route arc */}
      <path d="M 10,108 C 40,90 70,55 100,42 C 130,30 165,45 190,20" fill="none" stroke={palette.accent} strokeWidth="4.5" strokeLinecap="round" />
      {/* Vehicle dot on route */}
      <circle cx="100" cy="42" r="6" fill={palette.accent} />
      <circle cx="100" cy="42" r="3" fill={palette.dark} />
      {/* Bottom control bar */}
      <rect x="0" y="100" width="200" height="30" fill={palette.dark} opacity="0.75" />
      {/* 4 icon-only control buttons */}
      {[28, 76, 124, 172].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy="115" r="11" fill={palette.mid} opacity="0.28" />
          {/* Simple geometric icon per button */}
          {i === 0 && <> {/* search */}
            <circle cx={x} cy={114} r="5" fill="none" stroke={palette.white} strokeWidth="1.8" opacity="0.7" />
            <line x1={x+4} y1={118} x2={x+7} y2={121} stroke={palette.white} strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
          </>}
          {i === 1 && <> {/* EV bolt */}
            <polygon points={`${x+1},108 ${x-3},115 ${x},115 ${x-2},122 ${x+3},114 ${x},114`} fill={palette.accent} opacity="0.85" />
          </>}
          {i === 2 && <> {/* mute */}
            <line x1={x-5} y1={110} x2={x+5} y2={120} stroke={palette.white} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            <line x1={x+5} y1={110} x2={x-5} y2={120} stroke={palette.white} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          </>}
          {i === 3 && <> {/* settings gear rings */}
            <circle cx={x} cy="115" r="5" fill="none" stroke={palette.white} strokeWidth="1.8" opacity="0.7" />
            <circle cx={x} cy="115" r="2" fill={palette.white} opacity="0.6" />
          </>}
        </g>
      ))}
    </svg>
  );
}

export function IcoTurnInstructions() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Bold left-turn arrow */}
      <path d="M 62,100 L 62,55 Q 62,38 45,38 L 30,38" fill="none" stroke={palette.accent} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
      <polygon points="18,38 38,28 38,48" fill={palette.accent} />
      {/* Text lines beside */}
      <rect x="78" y="34" width="96" height="10" rx="3" fill={palette.mid} opacity="0.55" />
      <rect x="78" y="52" width="80" height="10" rx="3" fill={palette.mid} opacity="0.40" />
      <rect x="78" y="70" width="88" height="10" rx="3" fill={palette.mid} opacity="0.28" />
    </svg>
  );
}

export function IcoInstructionPanel() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Banner rect */}
      <rect x="14" y="20" width="172" height="60" rx="8" fill={palette.mid} opacity="0.30" stroke={palette.mid} strokeWidth="2" />
      {/* Turn arrow (left side of panel) */}
      <path d="M 52,68 L 52,44 Q 52,34 40,34 L 28,34" fill="none" stroke={palette.accent} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <polygon points="18,34 30,27 30,41" fill={palette.accent} />
      {/* Text lines (right side) */}
      <rect x="70" y="32" width="100" height="9" rx="3" fill={palette.soft} opacity="0.5" />
      <rect x="70" y="47" width="80" height="9" rx="3" fill={palette.soft} opacity="0.35" />
      <rect x="70" y="62" width="90" height="9" rx="3" fill={palette.soft} opacity="0.22" />
      {/* Below-panel info row */}
      <rect x="14" y="90" width="80" height="24" rx="5" fill={palette.mid} opacity="0.20" />
      <rect x="106" y="90" width="80" height="24" rx="5" fill={palette.mid} opacity="0.20" />
    </svg>
  );
}

export function IcoRouteBar() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* ── Route progress track ── */}
      <rect x="18" y="38" width="164" height="10" rx="5" fill={palette.mid} opacity="0.22" />
      {/* Completed segment (accent fill ~58%) */}
      <rect x="18" y="38" width="95" height="10" rx="5" fill={palette.accent} opacity="0.85" />
      {/* Origin dot */}
      <circle cx="18" cy="43" r="6" fill={palette.accent} />
      <circle cx="18" cy="43" r="2.5" fill={palette.dark} />
      {/* Waypoint 1 — passed (accent) */}
      <circle cx="70" cy="43" r="5" fill={palette.accent} />
      <circle cx="70" cy="43" r="2" fill={palette.dark} />
      {/* Waypoint 2 — upcoming (mid) */}
      <circle cx="120" cy="43" r="5" fill={palette.mid} opacity="0.5" />
      <circle cx="120" cy="43" r="2" fill={palette.dark} />
      {/* Destination flag */}
      <circle cx="182" cy="43" r="6" fill={palette.mid} opacity="0.4" />
      <rect x="182" y="37" width="8" height="5" rx="1" fill={palette.mid} opacity="0.55" />
      <line x1="182" y1="37" x2="182" y2="49" stroke={palette.mid} strokeWidth="1.5" opacity="0.55" strokeLinecap="round" />
      {/* Vehicle arrow at progress head */}
      <polygon points="113,32 107,40 119,40" fill={palette.accent} />
      {/* ── Traffic summary strip ── */}
      <rect x="18" y="62" width="164" height="26" rx="5" fill={palette.mid} opacity="0.1" />
      <rect x="18" y="62" width="164" height="26" rx="5" fill="none" stroke={palette.mid} strokeWidth="1" opacity="0.2" />
      {/* Clock icon */}
      <circle cx="34" cy="75" r="7" fill="none" stroke={palette.mid} strokeWidth="1.5" opacity="0.6" />
      <line x1="34" y1="71" x2="34" y2="75" stroke={palette.mid} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="34" y1="75" x2="37" y2="75" stroke={palette.mid} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      {/* Time remaining bar */}
      <rect x="46" y="71" width="38" height="5" rx="2" fill={palette.accent} opacity="0.8" />
      <rect x="46" y="79" width="28" height="4" rx="2" fill={palette.mid} opacity="0.4" />
      {/* Divider */}
      <line x1="100" y1="66" x2="100" y2="84" stroke={palette.mid} strokeWidth="1" opacity="0.25" />
      {/* Distance icon — road dash */}
      <line x1="110" y1="75" x2="120" y2="75" stroke={palette.mid} strokeWidth="2" strokeDasharray="3 2" strokeLinecap="round" opacity="0.5" />
      <circle cx="107" cy="75" r="2" fill={palette.mid} opacity="0.5" />
      <circle cx="123" cy="75" r="2" fill={palette.mid} opacity="0.5" />
      {/* Distance remaining bar */}
      <rect x="130" y="71" width="42" height="5" rx="2" fill={palette.mid} opacity="0.55" />
      <rect x="130" y="79" width="30" height="4" rx="2" fill={palette.mid} opacity="0.35" />
    </svg>
  );
}

export function IcoHUD() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Windshield arch */}
      <path d="M 18,118 Q 18,22 100,22 Q 182,22 182,118" fill="none" stroke={palette.mid} strokeWidth="3" opacity="0.5" />
      {/* HUD combiner glass — semi-transparent panel */}
      <rect x="52" y="42" width="96" height="52" rx="8" fill={palette.mid} opacity="0.10" stroke={palette.accent} strokeWidth="1.5" strokeOpacity="0.45" />
      {/* Speed — three bold rect blocks simulating digits */}
      <rect x="64" y="52" width="12" height="22" rx="3" fill={palette.accent} opacity="0.85" />
      <rect x="80" y="52" width="12" height="22" rx="3" fill={palette.accent} opacity="0.85" />
      <rect x="96" y="52" width="12" height="22" rx="3" fill={palette.accent} opacity="0.85" />
      {/* Unit bar below digits */}
      <rect x="64" y="78" width="44" height="5" rx="2.5" fill={palette.mid} opacity="0.45" />
      {/* Turn arrow — right turn */}
      <path d="M 126,75 L 126,58 L 140,58" fill="none" stroke={palette.accent} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.80" />
      <polygon points="140,52 148,58 140,64" fill={palette.accent} opacity="0.80" />
    </svg>
  );
}

/* ── Automotive ──────────────────────────────────────────────────────────────── */

export function IcoADAS() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Top-down 3-lane road cross-section */}
      {/* Road surface */}
      <rect x="24" y="18" width="152" height="94" rx="6" fill={palette.mid} opacity="0.14" />
      {/* Lane dividers */}
      <line x1="76" y1="18" x2="76" y2="112" stroke={palette.mid} strokeWidth="1.5" opacity="0.30" strokeDasharray="10 6" />
      <line x1="124" y1="18" x2="124" y2="112" stroke={palette.mid} strokeWidth="1.5" opacity="0.30" strokeDasharray="10 6" />
      {/* Ego vehicle — centre lane, highlighted */}
      <rect x="82" y="58" width="36" height="28" rx="6" fill={palette.accent} opacity="0.20" stroke={palette.accent} strokeWidth="2" />
      {/* Car body */}
      <rect x="86" y="62" width="28" height="20" rx="4" fill={palette.accent} opacity="0.55" />
      {/* Recommended lane change arrow */}
      <path d="M 100,55 L 100,48 L 122,48" fill="none" stroke={palette.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 3" />
      <polygon points="122,44 130,48 122,52" fill={palette.accent} />
      {/* Nearby vehicles in other lanes */}
      <rect x="32" y="50" width="28" height="20" rx="4" fill={palette.mid} opacity="0.40" />
      <rect x="140" y="70" width="28" height="20" rx="4" fill={palette.mid} opacity="0.35" />
    </svg>
  );
}

export function IcoHorizonPanel() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Dark instrument cluster context — outer bezel */}
      <rect x="10" y="36" width="180" height="58" rx="8" fill={palette.mid} opacity="0.10" stroke={palette.mid} strokeWidth="1" strokeOpacity="0.22" />
      {/* Narrow HUD strip — the key element */}
      <rect x="10" y="48" width="180" height="34" rx="6" fill={palette.mid} opacity="0.22" stroke={palette.mid} strokeWidth="1" strokeOpacity="0.35" />
      {/* Manoeuvre arrow — left turn */}
      <g>
        <line x1="36" y1="72" x2="36" y2="58" stroke={palette.accent} strokeWidth="4" strokeLinecap="round" />
        <line x1="36" y1="58" x2="24" y2="58" stroke={palette.accent} strokeWidth="4" strokeLinecap="round" />
        <polygon points="24,58 32,52 32,64" fill={palette.accent} />
      </g>
      {/* Street name placeholder bar */}
      <rect x="52" y="55" width="70" height="8" rx="4" fill={palette.white} opacity="0.45" />
      {/* Sub-label bar */}
      <rect x="52" y="67" width="44" height="6" rx="3" fill={palette.mid} opacity="0.40" />
      {/* Distance countdown — right side, bold */}
      <rect x="146" y="53" width="36" height="12" rx="4" fill={palette.accent} opacity="0.22" />
      <rect x="148" y="56" width="24" height="6" rx="3" fill={palette.accent} opacity="0.80" />
      <rect x="148" y="65" width="16" height="4" rx="2" fill={palette.mid} opacity="0.40" />
      {/* Dividers */}
      <line x1="140" y1="52" x2="140" y2="80" stroke={palette.mid} strokeWidth="0.75" opacity="0.30" />
      <line x1="46" y1="52" x2="46" y2="80" stroke={palette.mid} strokeWidth="0.75" opacity="0.25" />
    </svg>
  );
}

export function IcoVIBasics() {
  const { palette } = useIlloStyle();
  // Three-layer integration stack: App → VIL → Vehicle hardware
  const layers = [
    { label: 'Nav App', fill: palette.accent, op: 0.80, y: 18, h: 26 },
    { label: 'VIL',     fill: palette.mid,    op: 0.55, y: 52, h: 26 },
    { label: 'Vehicle', fill: palette.navy,   op: 0.70, y: 86, h: 26 },
  ];
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {layers.map(({ fill, op, y, h }, i) => (
        <g key={i}>
          <rect x="40" y={y} width="120" height={h} rx="7" fill={fill} opacity={op * 0.25} stroke={fill} strokeWidth="1.5" strokeOpacity={op * 0.7} />
          {/* Label bar placeholder */}
          <rect x="56" y={y + 10} width="50" height="6" rx="3" fill={fill} opacity={op * 0.7} />
        </g>
      ))}
      {/* Bidirectional arrows between layers */}
      {[44, 78].map((y, i) => (
        <g key={y}>
          <line x1="85" y1={y} x2="85" y2={y + 8} stroke={palette.white} strokeWidth="2" opacity="0.45" />
          <polygon points={`85,${y} 82,${y + 5} 88,${y + 5}`} fill={palette.white} opacity="0.45" />
          <line x1="115" y1={y + 8} x2="115" y2={y} stroke={palette.white} strokeWidth="2" opacity="0.45" />
          <polygon points={`115,${y + 8} 112,${y + 3} 118,${y + 3}`} fill={palette.white} opacity="0.45" />
        </g>
      ))}
    </svg>
  );
}

export function IcoTruck() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Trailer body */}
      <rect x="10" y="36" width="106" height="58" rx="5" fill={palette.mid} opacity="0.28"
        stroke={palette.mid} strokeWidth="1.5" strokeOpacity="0.45" />
      <line x1="63" y1="36" x2="63" y2="94" stroke={palette.mid} strokeWidth="1" opacity="0.22" />
      <line x1="10" y1="65" x2="116" y2="65" stroke={palette.mid} strokeWidth="0.75" opacity="0.16" />
      {/* Cab body */}
      <rect x="116" y="48" width="64" height="46" rx="6" fill={palette.mid} opacity="0.38"
        stroke={palette.mid} strokeWidth="1.5" strokeOpacity="0.48" />
      {/* Nav screen inside cab windshield */}
      <rect x="122" y="53" width="52" height="28" rx="5" fill={palette.dark} opacity="0.60" />
      {/* Route path on screen */}
      <path d="M 126,78 L 140,70 L 158,66 L 170,58"
        fill="none" stroke={palette.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.82" />
      {/* Height restriction badge on route */}
      <circle cx="141" cy="70" r="5" fill={palette.warn} opacity="0.85" />
      <rect x="139" y="68" width="4" height="5" rx="1" fill={palette.dark} opacity="0.72" />
      {/* Weight restriction badge on route */}
      <circle cx="158" cy="66" r="5" fill={palette.warn} opacity="0.68" />
      <rect x="155" y="65" width="6" height="2" rx="1" fill={palette.dark} opacity="0.72" />
      <rect x="155" y="68" width="6" height="2" rx="1" fill={palette.dark} opacity="0.72" />
      {/* Wheels */}
      <circle cx="36" cy="94" r="13" fill={palette.dark} stroke={palette.accent} strokeWidth="3" />
      <circle cx="36" cy="94" r="5" fill={palette.mid} opacity="0.45" />
      <circle cx="88" cy="94" r="13" fill={palette.dark} stroke={palette.accent} strokeWidth="3" />
      <circle cx="88" cy="94" r="5" fill={palette.mid} opacity="0.45" />
      <circle cx="144" cy="94" r="11" fill={palette.dark} stroke={palette.mid} strokeWidth="2.5" strokeOpacity="0.55" />
      <circle cx="144" cy="94" r="4" fill={palette.mid} opacity="0.40" />
    </svg>
  );
}

/* ── App UX ──────────────────────────────────────────────────────────────────── */

export function IcoHomeScreen() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Full-screen map canvas — two-thirds of height */}
      <rect x="0" y="0" width="200" height="88" fill={palette.mid} opacity="0.12" />
      {/* Road grid on map */}
      <line x1="0" y1="44" x2="200" y2="44" stroke={palette.mid} strokeWidth="4" opacity="0.22" />
      <line x1="100" y1="0" x2="100" y2="88" stroke={palette.mid} strokeWidth="4" opacity="0.22" />
      <line x1="0" y1="70" x2="200" y2="70" stroke={palette.mid} strokeWidth="2" opacity="0.12" />
      {/* Route on map */}
      <path d="M 15,80 C 50,70 75,44 110,35 C 140,28 168,38 188,15" fill="none" stroke={palette.accent} strokeWidth="3.5" strokeLinecap="round" />
      {/* Destination search bar — top overlay */}
      <rect x="14" y="8" width="172" height="18" rx="9" fill={palette.dark} opacity="0.70" />
      <circle cx="28" cy="17" r="4" fill="none" stroke={palette.mid} strokeWidth="1.5" opacity="0.6" />
      <rect x="38" y="13" width="70" height="6" rx="3" fill={palette.mid} opacity="0.35" />
      {/* Bottom tray — recent places */}
      <rect x="0" y="88" width="200" height="42" fill={palette.dark} opacity="0.85" />
      <line x1="0" y1="88" x2="200" y2="88" stroke={palette.mid} strokeWidth="0.75" opacity="0.30" />
      {/* Place chips */}
      {[14, 72, 130].map((x, i) => (
        <g key={x}>
          <rect x={x} y="96" width="50" height="22" rx="8" fill={palette.mid} opacity="0.22" />
          <circle cx={x + 10} cy="107" r="5" fill={[palette.accent, palette.warn, palette.mid][i]} opacity="0.70" />
          <rect x={x + 20} y="103" width="24" height="5" rx="2.5" fill={palette.mid} opacity="0.40" />
          <rect x={x + 20} y="110" width="16" height="4" rx="2" fill={palette.mid} opacity="0.25" />
        </g>
      ))}
    </svg>
  );
}

export function IcoETAPanel() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Panel card */}
      <rect x="14" y="18" width="172" height="94" rx="14" fill={palette.mid} opacity="0.13" stroke={palette.mid} strokeWidth="1" strokeOpacity="0.22" />
      {/* Drag handle */}
      <rect x="82" y="27" width="36" height="4" rx="2" fill={palette.mid} opacity="0.40" />
      {/* ETA block — left: large arrival time representation */}
      <rect x="26" y="40" width="56" height="28" rx="7" fill={palette.accent} opacity="0.22" />
      <rect x="32" y="47" width="36" height="14" rx="4" fill={palette.accent} opacity="0.75" />
      {/* Distance block — right */}
      <rect x="98" y="40" width="80" height="12" rx="4" fill={palette.mid} opacity="0.45" />
      <rect x="98" y="57" width="56" height="8" rx="3" fill={palette.mid} opacity="0.28" />
      {/* Divider */}
      <line x1="26" y1="79" x2="174" y2="79" stroke={palette.mid} strokeWidth="1" opacity="0.20" />
      {/* Progress track */}
      <rect x="26" y="86" width="148" height="9" rx="4.5" fill={palette.mid} opacity="0.18" />
      {/* Progress fill ~60% */}
      <rect x="26" y="86" width="90" height="9" rx="4.5" fill={palette.accent} opacity="0.80" />
      {/* Thumb */}
      <circle cx="116" cy="90" r="7" fill={palette.accent} stroke={palette.dark} strokeWidth="2.5" />
    </svg>
  );
}

export function IcoCluster() {
  const { palette } = useIlloStyle();
  // Speedometer arc helper — returns SVG arc path for a given angle range
  const arc = (cx, cy, r, startDeg, endDeg) => {
    const toRad = d => (d * Math.PI) / 180;
    const x1 = cx + r * Math.cos(toRad(startDeg));
    const y1 = cy + r * Math.sin(toRad(startDeg));
    const x2 = cx + r * Math.cos(toRad(endDeg));
    const y2 = cy + r * Math.sin(toRad(endDeg));
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };
  const cx = 80, cy = 68, R = 46;
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Dial background ring */}
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={palette.mid} strokeWidth="8" opacity="0.22" />
      {/* Full track */}
      <path d={arc(cx, cy, R, 150, 390)} fill="none" stroke={palette.mid} strokeWidth="6" opacity="0.30" strokeLinecap="round" />
      {/* Active speed zone — TomTom red, ~60% of arc */}
      <path d={arc(cx, cy, R, 150, 312)} fill="none" stroke={palette.accent} strokeWidth="6" strokeLinecap="round" />
      {/* Needle */}
      <line
        x1={cx} y1={cy}
        x2={cx + (R - 10) * Math.cos((312 * Math.PI) / 180)}
        y2={cy + (R - 10) * Math.sin((312 * Math.PI) / 180)}
        stroke={palette.white} strokeWidth="3" strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r="5" fill={palette.accent} />
      {/* Tick marks */}
      {[150, 190, 230, 270, 310, 350, 390].map((deg, i) => {
        const r1 = R - 2, r2 = R + 2;
        const rad = (deg * Math.PI) / 180;
        return <line key={i}
          x1={cx + r1 * Math.cos(rad)} y1={cy + r1 * Math.sin(rad)}
          x2={cx + r2 * Math.cos(rad)} y2={cy + r2 * Math.sin(rad)}
          stroke={palette.white} strokeWidth="2" opacity="0.5"
        />;
      })}
      {/* Turn arrow — right of dial */}
      <g transform="translate(148,42)">
        <rect width="38" height="38" rx="8" fill={palette.mid} opacity="0.18" />
        {/* Arrow pointing right-then-up (right turn) */}
        <polyline points="9,27 9,16 25,16" fill="none" stroke={palette.accent} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <polygon points="25,10 32,16 25,22" fill={palette.accent} />
      </g>
      {/* Distance bar — beneath turn arrow */}
      <rect x="148" y="88" width="38" height="8" rx="4" fill={palette.mid} opacity="0.22" />
      <rect x="148" y="88" width="24" height="8" rx="4" fill={palette.white} opacity="0.55" />
    </svg>
  );
}

/* ── Voice / AI ──────────────────────────────────────────────────────────────── */

export function IcoVoiceEngine() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* TAIA input block — left */}
      <rect x="14" y="30" width="52" height="36" rx="8" fill={palette.mid} opacity="0.20" stroke={palette.mid} strokeWidth="1.5" strokeOpacity="0.45" />
      <rect x="22" y="40" width="36" height="5" rx="2.5" fill={palette.accent} opacity="0.80" />
      <rect x="22" y="50" width="26" height="4" rx="2" fill={palette.mid} opacity="0.50" />
      {/* Arrow: TAIA → engine */}
      <line x1="66" y1="48" x2="84" y2="48" stroke={palette.accent} strokeWidth="2.5" strokeLinecap="round" opacity="0.70" />
      <polygon points="84,43 92,48 84,53" fill={palette.accent} opacity="0.70" />
      {/* OEM Voice Engine block — centre */}
      <rect x="92" y="24" width="60" height="48" rx="10" fill={palette.accent} opacity="0.18" stroke={palette.accent} strokeWidth="2" strokeOpacity="0.60" />
      {/* Speaker cone inside engine block */}
      <polygon points="108,38 108,58 118,52 118,44" fill={palette.accent} opacity="0.75" />
      <path d="M 122,40 Q 130,48 122,56" fill="none" stroke={palette.accent} strokeWidth="2.5" strokeLinecap="round" opacity="0.70" />
      <path d="M 126,36 Q 138,48 126,60" fill="none" stroke={palette.accent} strokeWidth="2" strokeLinecap="round" opacity="0.45" />
      {/* Arrow: engine → output */}
      <line x1="152" y1="48" x2="168" y2="48" stroke={palette.mid} strokeWidth="2.5" strokeLinecap="round" opacity="0.65" />
      <polygon points="168,43 176,48 168,53" fill={palette.mid} opacity="0.65" />
      {/* Audio waveform output — right */}
      {[4, 9, 14, 9, 5].map((h, i) => (
        <rect key={i} x={178 + i * 4} y={48 - h} width="2.5" height={h * 2} rx="1.5"
          fill={palette.mid} opacity={0.35 + i * 0.08} />
      ))}
    </svg>
  );
}

export function IcoAIVoice() {
  const { palette } = useIlloStyle();
  // Amplitude bars — taller in centre, shorter at edges
  const bars = [4, 8, 14, 20, 28, 22, 16, 10, 6, 12, 24, 18, 8];
  const bw = 7, gap = 4, ox = 22, cy = 52;
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Waveform amplitude bars */}
      {bars.map((h, i) => (
        <rect key={i}
          x={ox + i * (bw + gap)} y={cy - h}
          width={bw} height={h * 2} rx="3.5"
          fill={i >= 4 && i <= 8 ? palette.accent : palette.mid}
          opacity={i >= 4 && i <= 8 ? 0.85 : 0.40}
        />
      ))}
      {/* Response text bubble */}
      <rect x="20" y="86" width="160" height="28" rx="10" fill={palette.mid} opacity="0.20" stroke={palette.mid} strokeWidth="1" strokeOpacity="0.30" />
      {/* Bubble tail */}
      <polygon points="40,114 30,124 56,114" fill={palette.mid} opacity="0.20" />
      {/* Streaming text placeholder bars */}
      <rect x="30" y="93" width="100" height="6" rx="3" fill={palette.white} opacity="0.40" />
      <rect x="30" y="102" width="70" height="6" rx="3" fill={palette.mid} opacity="0.30" />
      {/* Active cursor dot */}
      <circle cx="106" cy="105" r="3" fill={palette.accent} opacity="0.85" />
    </svg>
  );
}

export function IcoSpeechToText() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Waveform top half */}
      <polyline
        points="18,55 32,30 46,65 60,22 74,60 88,38 100,55 112,32 126,62 140,20 154,58 168,40 182,55"
        fill="none"
        stroke={palette.accent}
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Divider */}
      <line x1="18" y1="72" x2="182" y2="72" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
      {/* Text line rects */}
      <rect x="18" y="82" width="164" height="10" rx="3" fill={palette.mid} opacity="0.50" />
      <rect x="18" y="97" width="130" height="10" rx="3" fill={palette.mid} opacity="0.35" />
      <rect x="18" y="112" width="148" height="10" rx="3" fill={palette.mid} opacity="0.22" />
    </svg>
  );
}

export function IcoAIConfig() {
  const { palette } = useIlloStyle();
  // Code editor window — TAIA SDK initialisation
  const lines = [
    { indent: 0, w: 80, color: palette.accent,  op: 0.72 },
    { indent: 1, w: 60, color: palette.mid,     op: 0.50 },
    { indent: 1, w: 72, color: palette.accent,  op: 0.58 },
    { indent: 0, w: 66, color: palette.warn,    op: 0.72 },
    { indent: 2, w: 52, color: palette.mid,     op: 0.45 },
    { indent: 2, w: 44, color: palette.accent,  op: 0.52 },
    { indent: 0, w: 36, color: palette.mid,     op: 0.35 },
  ];
  const lineH = 11, oy = 40, indent = 14;
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Editor window frame */}
      <rect x="14" y="10" width="172" height="112" rx="8" fill={palette.mid} opacity="0.14"
        stroke={palette.mid} strokeWidth="1" strokeOpacity="0.22" />
      {/* Title bar */}
      <rect x="14" y="10" width="172" height="24" rx="8" fill={palette.mid} opacity="0.24" />
      <rect x="14" y="26" width="172" height="8" fill={palette.mid} opacity="0.24" />
      {/* Traffic light dots */}
      <circle cx="28" cy="22" r="4" fill={palette.danger} opacity="0.75" />
      <circle cx="40" cy="22" r="4" fill={palette.warn}   opacity="0.75" />
      <circle cx="52" cy="22" r="4" fill={palette.accent} opacity="0.75" />
      {/* Tab label bar */}
      <rect x="80" y="19" width="52" height="5" rx="2.5" fill={palette.mid} opacity="0.40" />
      {/* Code lines */}
      {lines.map(({ indent: ind, w, color, op }, i) => (
        <g key={i}>
          <rect x="18" y={oy + i * lineH + 2} width="6" height="5" rx="1.5"
            fill={palette.mid} opacity="0.20" />
          <rect x={32 + ind * indent} y={oy + i * lineH + 2} width={w} height="6" rx="2.5"
            fill={color} opacity={op} />
          {ind > 0 && (
            <rect x={32 + ind * indent + w + 6} y={oy + i * lineH + 3}
              width={[0, 26, 18, 0, 16, 12, 0][i]} height="4" rx="2"
              fill={palette.mid} opacity="0.25" />
          )}
        </g>
      ))}
    </svg>
  );
}

/* ── POI / Parking ───────────────────────────────────────────────────────────── */

export function IcoPOIDetails() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Card background */}
      <rect x="18" y="12" width="164" height="106" rx="10" fill={palette.mid} opacity="0.18" stroke={palette.mid} strokeWidth="1" strokeOpacity="0.3" />
      {/* Brand icon area */}
      <rect x="28" y="22" width="28" height="28" rx="8" fill={palette.accent} opacity="0.22" stroke={palette.accent} strokeWidth="1.5" strokeOpacity="0.6" />
      {/* Hotel 'H' shape */}
      <line x1="34" y1="28" x2="34" y2="44" stroke={palette.accent} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="28" x2="50" y2="44" stroke={palette.accent} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="34" y1="36" x2="50" y2="36" stroke={palette.accent} strokeWidth="2.5" strokeLinecap="round" />
      {/* Name bar */}
      <rect x="64" y="26" width="72" height="8" rx="4" fill={palette.white} opacity="0.50" />
      {/* Star rating */}
      {[0,1,2,3,4].map(s => (
        <polygon key={s}
          points={`${64 + s*13},41 ${65.5 + s*13},36.5 ${67 + s*13},41 ${62.5 + s*13},38 ${71.5 + s*13},38`}
          fill={s < 4 ? palette.warn : palette.mid} opacity={s < 4 ? 0.80 : 0.25} />
      ))}
      {/* Data rows */}
      {[
        { icon: true, w: 90, w2: 40 },
        { icon: true, w: 70, w2: 52 },
        { icon: true, w: 80, w2: 36 },
        { icon: true, w: 60, w2: 48 },
      ].map(({ w, w2 }, i) => (
        <g key={i}>
          <line x1="28" y1={58 + i * 15} x2="178" y2={58 + i * 15} stroke={palette.mid} strokeWidth="0.75" opacity="0.20" />
          <circle cx="34" cy={65 + i * 15} r="3" fill={palette.mid} opacity="0.40" />
          <rect x="44" y={62 + i * 15} width={w} height="5" rx="2.5" fill={palette.mid} opacity="0.38" />
          <rect x={44 + w + 6} y={62 + i * 15} width={w2} height="5" rx="2.5" fill={palette.accent} opacity="0.30" />
        </g>
      ))}
    </svg>
  );
}

export function IcoPOIPhotos() {
  const { palette } = useIlloStyle();
  // 3×2 photo grid mosaic
  const cols = 3, rows = 2;
  const gw = 56, gh = 46, gap = 6, ox = 16, oy = 16;
  const fills = [palette.navy, palette.mid, palette.accent, palette.navy, palette.accent, palette.mid];
  const ops   = [0.45, 0.30, 0.25, 0.28, 0.18, 0.38];
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {Array.from({ length: rows }).map((_, ri) =>
        Array.from({ length: cols }).map((_, ci) => {
          const idx = ri * cols + ci;
          const x = ox + ci * (gw + gap);
          const y = oy + ri * (gh + gap);
          // simple scene abstraction: sky + ground or landscape shape
          return (
            <g key={idx}>
              <rect x={x} y={y} width={gw} height={gh} rx="5" fill={fills[idx]} opacity={ops[idx]} />
              {/* Horizon line */}
              <line x1={x} y1={y + gh * 0.55} x2={x + gw} y2={y + gh * 0.55} stroke={palette.white} strokeWidth="0.75" opacity="0.18" />
              {/* Simple shape */}
              {idx % 3 === 0 && <circle cx={x + gw * 0.7} cy={y + gh * 0.3} r={gh * 0.18} fill={palette.warn} opacity="0.55" />}
              {idx % 3 === 1 && <polygon points={`${x + gw * 0.5},${y + gh * 0.15} ${x + gw * 0.2},${y + gh * 0.55} ${x + gw * 0.8},${y + gh * 0.55}`} fill={palette.mid} opacity="0.45" />}
              {idx % 3 === 2 && <rect x={x + 4} y={y + gh * 0.25} width={gw - 8} height={gh * 0.12} rx="2" fill={palette.accent} opacity="0.50" />}
            </g>
          );
        })
      )}
    </svg>
  );
}

export function IcoOnStreetParking() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Large bold P */}
      <text x="100" y="88" textAnchor="middle" fontSize="80" fontWeight="bold" fill={palette.accent} fontFamily="sans-serif">P</text>
      {/* Road lane lines below */}
      <line x1="20" y1="112" x2="180" y2="112" stroke={palette.mid} strokeWidth="3" opacity="0.55" />
      <line x1="20" y1="120" x2="180" y2="120" stroke={palette.mid} strokeWidth="3" opacity="0.35" />
      {/* Lane center dashes */}
      <line x1="20" y1="116" x2="180" y2="116" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="14 8" />
    </svg>
  );
}

export function IcoParkingAvailability() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Parking space outline */}
      <rect x="30" y="22" width="140" height="70" rx="6" fill="none" stroke={palette.mid} strokeWidth="3" />
      {/* Lane lines */}
      <line x1="83" y1="22" x2="83" y2="92" stroke={palette.mid} strokeWidth="2" opacity="0.4" />
      <line x1="117" y1="22" x2="117" y2="92" stroke={palette.mid} strokeWidth="2" opacity="0.4" />
      {/* Availability dots */}
      <circle cx="57" cy="57" r="12" fill="#4caf50" />
      <circle cx="100" cy="57" r="12" fill="#4caf50" />
      <circle cx="143" cy="57" r="12" fill="#e53935" />
      <text x="57" y="62" textAnchor="middle" fontSize="12" fill={palette.dark} fontWeight="bold">✓</text>
      <text x="100" y="62" textAnchor="middle" fontSize="12" fill={palette.dark} fontWeight="bold">✓</text>
      <text x="143" y="62" textAnchor="middle" fontSize="12" fill={palette.dark} fontWeight="bold">✕</text>
    </svg>
  );
}

export function IcoParkingPrices() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* P badge circle */}
      <circle cx="62" cy="65" r="38" fill={palette.accent} opacity="0.85" />
      <text x="62" y="80" textAnchor="middle" fontSize="44" fontWeight="bold" fill={palette.dark} fontFamily="sans-serif">P</text>
      {/* Price tag shape */}
      <rect x="112" y="38" width="68" height="42" rx="6" fill={palette.mid} opacity="0.40" stroke={palette.mid} strokeWidth="2" />
      <circle cx="172" cy="46" r="5" fill={palette.dark} stroke={palette.mid} strokeWidth="2" />
      <text x="146" y="66" textAnchor="middle" fontSize="16" fontWeight="bold" fill={palette.accent} fontFamily="monospace">$2.5</text>
    </svg>
  );
}

export function IcoFuelPrices() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Fuel pump body */}
      <rect x="38" y="28" width="68" height="90" rx="8" fill={palette.mid} opacity="0.45" stroke={palette.mid} strokeWidth="2" />
      {/* Pump top nozzle arm */}
      <rect x="96" y="28" width="36" height="12" rx="4" fill={palette.mid} opacity="0.6" />
      <rect x="128" y="28" width="10" height="38" rx="4" fill={palette.mid} opacity="0.6" />
      <path d="M 128,66 Q 118,80 118,90" fill="none" stroke={palette.mid} strokeWidth="4" strokeLinecap="round" />
      <rect x="112" y="86" width="10" height="22" rx="3" fill={palette.mid} opacity="0.7" />
      {/* Price display on pump */}
      <rect x="48" y="44" width="48" height="30" rx="5" fill={palette.dark} stroke={palette.accent} strokeWidth="2" />
      <text x="72" y="63" textAnchor="middle" fontSize="13" fontWeight="bold" fill={palette.accent} fontFamily="monospace">1.89</text>
      {/* Pump base */}
      <rect x="38" y="108" width="68" height="10" rx="4" fill={palette.mid} opacity="0.3" />
    </svg>
  );
}

/* ── NavSDK ───────────────────────────────────────────────────────────────────
 * All SDK icons share bracket marks at left/right edges + an inner symbol.
 * ─────────────────────────────────────────────────────────────────────────── */


export function IcoNavSDKNavigation() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* NIP banner — top turn instruction */}
      <rect x="38" y="18" width="124" height="34" rx="7" fill={palette.mid} opacity="0.22" />
      {/* Turn-left arrow in banner */}
      <polyline points="70,28 70,40 88,40" fill="none" stroke={palette.accent} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <polygon points="88,34 96,40 88,46" fill={palette.accent} />
      {/* Street name bar (placeholder rect) */}
      <rect x="100" y="30" width="50" height="7" rx="3" fill={palette.white} opacity="0.45" />
      <rect x="100" y="41" width="34" height="5" rx="2.5" fill={palette.mid} opacity="0.35" />
      {/* Route map area */}
      <rect x="38" y="58" width="124" height="46" rx="7" fill={palette.mid} opacity="0.14" />
      <path d="M 50,95 C 68,95 72,68 100,68 C 128,68 132,82 150,82" fill="none" stroke={palette.accent} strokeWidth="3.5" strokeLinecap="round" />
      {/* ETA bar */}
      <rect x="38" y="108" width="50" height="10" rx="4" fill={palette.accent} opacity="0.75" />
      <rect x="94" y="108" width="36" height="10" rx="4" fill={palette.mid} opacity="0.28" />
      <rect x="136" y="108" width="26" height="10" rx="4" fill={palette.mid} opacity="0.28" />
    </svg>
  );
}

export function IcoNavSDKLocation() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* GPS accuracy rings */}
      <circle cx="100" cy="65" r="42" fill="none" stroke={palette.accent} strokeWidth="1.5" opacity="0.18" />
      <circle cx="100" cy="65" r="28" fill="none" stroke={palette.accent} strokeWidth="1.5" opacity="0.30" />
      <circle cx="100" cy="65" r="14" fill="none" stroke={palette.accent} strokeWidth="1.5" opacity="0.50" />
      {/* Location dot */}
      <circle cx="100" cy="65" r="7" fill={palette.accent} />
      {/* Heading arrow (north-east) */}
      <line x1="100" y1="65" x2="120" y2="44" stroke={palette.white} strokeWidth="3" strokeLinecap="round" />
      <polygon points="120,44 110,46 118,54" fill={palette.white} />
      {/* Grid crosshairs — faint */}
      <line x1="100" y1="22" x2="100" y2="108" stroke={palette.mid} strokeWidth="1" opacity="0.18" strokeDasharray="3 4" />
      <line x1="58" y1="65" x2="142" y2="65" stroke={palette.mid} strokeWidth="1" opacity="0.18" strokeDasharray="3 4" />
    </svg>
  );
}

export function IcoNavSDKSearch() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Search bar */}
      <rect x="32" y="20" width="136" height="22" rx="11" fill={palette.mid} opacity="0.28" stroke={palette.accent} strokeWidth="1.5" />
      {/* Magnifying glass icon inside bar */}
      <circle cx="50" cy="31" r="6" fill="none" stroke={palette.accent} strokeWidth="2.5" />
      <line x1="55" y1="36" x2="60" y2="42" stroke={palette.accent} strokeWidth="2.5" strokeLinecap="round" />
      {/* Partial query bar */}
      <rect x="68" y="27" width="44" height="7" rx="3.5" fill={palette.white} opacity="0.45" />
      {/* Three autocomplete result rows */}
      {[0, 1, 2].map(i => (
        <g key={i}>
          <rect x="32" y={52 + i * 22} width="136" height="18" rx="5"
            fill={i === 0 ? palette.accent : palette.mid}
            opacity={i === 0 ? 0.18 : 0.12} />
          {/* pin icon */}
          <circle cx="48" cy={61 + i * 22} r="4" fill={i === 0 ? palette.accent : palette.mid} opacity={i === 0 ? 0.9 : 0.5} />
          {/* name bar */}
          <rect x="58" y={57 + i * 22} width={i === 0 ? 56 : i === 1 ? 48 : 40} height="6" rx="3"
            fill={i === 0 ? palette.white : palette.mid} opacity={i === 0 ? 0.6 : 0.4} />
          {/* distance bar */}
          <rect x="58" y={65 + i * 22} width="24" height="4" rx="2" fill={palette.mid} opacity="0.28" />
        </g>
      ))}
    </svg>
  );
}

export function IcoNavSDKRouting() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Origin / destination dots */}
      <circle cx="42" cy="65" r="7" fill={palette.accent} />
      <circle cx="158" cy="65" r="7" fill={palette.accent} />
      {/* Three alternative routes — fastest (accent), slower (mid), scenic (mid dimmer) */}
      {/* Route 1 — fastest, straight-ish */}
      <path d="M 49,65 C 80,65 120,65 151,65" fill="none" stroke={palette.accent} strokeWidth="4" strokeLinecap="round" />
      {/* Route 2 — curves up */}
      <path d="M 49,65 C 80,42 120,42 151,65" fill="none" stroke={palette.mid} strokeWidth="3" strokeLinecap="round" opacity="0.55" />
      {/* Route 3 — curves down */}
      <path d="M 49,65 C 80,90 120,90 151,65" fill="none" stroke={palette.mid} strokeWidth="3" strokeLinecap="round" opacity="0.30" />
      {/* Time badge on fastest */}
      <rect x="88" y="50" width="24" height="13" rx="5" fill={palette.accent} opacity="0.85" />
      <rect x="90" y="53" width="12" height="4" rx="2" fill={palette.white} opacity="0.7" />
      <rect x="90" y="59" width="8" height="3" rx="1.5" fill={palette.white} opacity="0.45" />
    </svg>
  );
}

export function IcoNavSDKOffline() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Map region outline */}
      <rect x="35" y="20" width="130" height="72" rx="8" fill={palette.mid} opacity="0.16" stroke={palette.mid} strokeWidth="1.5" strokeOpacity="0.4" />
      {/* Download arrow */}
      <line x1="100" y1="28" x2="100" y2="56" stroke={palette.accent} strokeWidth="4" strokeLinecap="round" />
      <polygon points="100,62 88,48 112,48" fill={palette.accent} />
      {/* Three progress bars representing map regions */}
      {[
        { y: 76, w: 92, label: 'done' },
        { y: 86, w: 60, label: 'partial' },
        { y: 96, w: 30, label: 'start' },
      ].map(({ y, w }, i) => (
        <g key={i}>
          <rect x="35" y={y} width="130" height="7" rx="3.5" fill={palette.mid} opacity="0.18" />
          <rect x="35" y={y} width={w} height="7" rx="3.5"
            fill={i === 0 ? palette.accent : palette.mid}
            opacity={i === 0 ? 0.85 : 0.55} />
        </g>
      ))}
    </svg>
  );
}

export function IcoNavSDKVirtualHorizon() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Perspective road — two converging lines */}
      <polygon points="100,45 36,105 164,105" fill={palette.mid} opacity="0.14" />
      <line x1="100" y1="45" x2="55" y2="105" stroke={palette.mid} strokeWidth="2" opacity="0.45" />
      <line x1="100" y1="45" x2="145" y2="105" stroke={palette.mid} strokeWidth="2" opacity="0.45" />
      {/* Horizon line */}
      <line x1="38" y1="68" x2="162" y2="68" stroke={palette.mid} strokeWidth="1.5" opacity="0.30" strokeDasharray="6 4" />
      {/* ADAS event pins ahead on road — speed limit, curve, incident */}
      <circle cx="100" cy="56" r="6" fill={palette.accent} />
      <circle cx="80" cy="74" r="5" fill={palette.warn} opacity="0.85" />
      <circle cx="120" cy="74" r="5" fill={palette.mid} opacity="0.65" />
      {/* Distance strip at bottom */}
      <rect x="36" y="110" width="128" height="10" rx="5" fill={palette.mid} opacity="0.16" />
      <rect x="36" y="110" width="40" height="10" rx="5" fill={palette.accent} opacity="0.55" />
    </svg>
  );
}

export function IcoNavSDKAdvanced() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Code editor window */}
      <rect x="32" y="22" width="136" height="82" rx="8" fill={palette.mid} opacity="0.16" stroke={palette.mid} strokeWidth="1" strokeOpacity="0.3" />
      {/* Traffic lights */}
      <circle cx="46" cy="32" r="4" fill={palette.danger} opacity="0.85" />
      <circle cx="58" cy="32" r="4" fill={palette.warn} opacity="0.85" />
      <circle cx="70" cy="32" r="4" fill={palette.accent} opacity="0.85" />
      {/* Divider */}
      <line x1="32" y1="42" x2="168" y2="42" stroke={palette.mid} strokeWidth="1" opacity="0.3" />
      {/* Config key/value rows */}
      {[
        { kw: 28, vw: 36 },
        { kw: 40, vw: 24 },
        { kw: 22, vw: 46 },
        { kw: 34, vw: 30 },
      ].map(({ kw, vw }, i) => (
        <g key={i}>
          <rect x="44" y={50 + i * 14} width={kw} height="6" rx="3" fill={palette.mid} opacity="0.55" />
          <rect x={44 + kw + 6} y={50 + i * 14} width={vw} height="6" rx="3" fill={palette.accent} opacity="0.70" />
        </g>
      ))}
      {/* Green success badge */}
      <rect x="44" y="108" width="20" height="8" rx="4" fill={palette.accent} opacity="0.80" />
    </svg>
  );
}

/* ── Analytics ───────────────────────────────────────────────────────────────── */

export function IcoAreaAnalytics() {
  const { palette } = useIlloStyle();
  // 5 country coverage bars: green (high) → amber → red (low)
  const rows = [
    { w: 116, color: palette.accent,  op: 0.82 },
    { w:  90, color: palette.accent,  op: 0.65 },
    { w:  70, color: palette.warn,    op: 0.82 },
    { w:  48, color: palette.warn,    op: 0.72 },
    { w:  22, color: palette.danger,  op: 0.78 },
  ];
  const trackW = 120, ox = 62, oy = 11, rowH = 21;
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {rows.map(({ w, color, op }, i) => (
        <g key={i}>
          {/* Flag block */}
          <rect x="14" y={oy + i * rowH + 2} width="36" height="16" rx="4" fill={palette.mid} opacity="0.18" />
          <rect x="14" y={oy + i * rowH + 2} width="36" height="5" rx="2" fill={color} opacity={op * 0.38} />
          <rect x="14" y={oy + i * rowH + 8} width="36" height="5" rx="0" fill={palette.mid} opacity="0.10" />
          {/* Track */}
          <rect x={ox} y={oy + i * rowH + 4} width={trackW} height="12" rx="5" fill={palette.mid} opacity="0.14" />
          {/* Coverage fill */}
          <rect x={ox} y={oy + i * rowH + 4} width={w} height="12" rx="5" fill={color} opacity={op} />
          {/* End cap dot */}
          <circle cx={ox + w} cy={oy + i * rowH + 10} r="4" fill={color} opacity={Math.min(op + 0.10, 1.0)} />
        </g>
      ))}
    </svg>
  );
}

export function IcoJunctionAnalytics() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Road arms — 4-way, width proportional to vehicle count */}
      {/* Vertical road */}
      <rect x="88" y="0" width="24" height="130" fill={palette.mid} opacity="0.22" />
      {/* Horizontal road */}
      <rect x="0" y="52" width="200" height="26" fill={palette.mid} opacity="0.22" />
      {/* Junction centre */}
      <rect x="88" y="52" width="24" height="26" fill={palette.mid} opacity="0.35" />
      {/* Flow arrows — width = vehicle count */}
      {/* North inbound — heavy */}
      <rect x="92" y="8" width="16" height="42" rx="3" fill={palette.accent} opacity="0.55" />
      <polygon points="100,50 93,40 107,40" fill={palette.accent} />
      {/* South inbound — medium */}
      <rect x="94" y="80" width="12" height="40" rx="3" fill={palette.mid} opacity="0.55" />
      <polygon points="100,78 94,88 106,88" fill={palette.mid} opacity="0.8" />
      {/* East inbound — heavy */}
      <rect x="116" y="56" width="68" height="18" rx="3" fill={palette.accent} opacity="0.55" />
      <polygon points="116,65 126,58 126,72" fill={palette.accent} />
      {/* West inbound — light */}
      <rect x="16" y="58" width="70" height="14" rx="3" fill={palette.mid} opacity="0.40" />
      <polygon points="86,65 76,59 76,71" fill={palette.mid} opacity="0.7" />
      {/* Count badge — top approach */}
      <rect x="110" y="20" width="28" height="12" rx="4" fill={palette.accent} opacity="0.25" />
      <rect x="113" y="23" width="16" height="5" rx="2.5" fill={palette.accent} opacity="0.80" />
    </svg>
  );
}

export function IcoODAnalysis() {
  const { palette } = useIlloStyle();
  // 4×4 OD matrix — blue intensity cells
  const matrix = [
    [0.90, 0.50, 0.25, 0.10],
    [0.40, 0.80, 0.30, 0.20],
    [0.15, 0.35, 0.70, 0.40],
    [0.08, 0.18, 0.45, 0.85],
  ];
  const cw = 36, ch = 24, gap = 3, ox = 16, oy = 12;
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Diagonal label — origin/destination axis */}
      <line x1={ox} y1={oy} x2={ox + 4 * (cw + gap)} y2={oy + 4 * (ch + gap)} stroke={palette.mid} strokeWidth="0.75" opacity="0.22" strokeDasharray="3 3" />
      {matrix.map((row, ri) =>
        row.map((op, ci) => (
          <rect key={`${ri}-${ci}`}
            x={ox + ci * (cw + gap)} y={oy + ri * (ch + gap)}
            width={cw} height={ch} rx="4"
            fill={palette.navy} opacity={op * 0.85}
            stroke={ri === ci ? palette.accent : 'none'} strokeWidth="1.5" strokeOpacity="0.6"
          />
        ))
      )}
      {/* Flow arrows on right side */}
      {[0, 1, 2].map(i => (
        <g key={i}>
          <line x1="170" y1={oy + i * (ch + gap) + ch * 0.5}
            x2="192" y2={oy + (i + 1) * (ch + gap) + ch * 0.5}
            stroke={palette.accent} strokeWidth={2.5 - i * 0.5} opacity={0.6 - i * 0.1} strokeLinecap="round" />
        </g>
      ))}
      {/* Arrowheads */}
      <polygon points="126,51 134,55 126,59" fill={palette.accent} opacity="0.65" />
      <polygon points="126,61 134,65 126,69" fill={palette.accent} opacity="0.50" />
    </svg>
  );
}

/* ─── Colour System ──────────────────────────────────────────────────────────── */
export function IcoColourSystem() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Swatch grid — 3 cols × 2 rows */}
      {[
        { x: 38, y: 30, fill: palette.accent },
        { x: 82, y: 30, fill: palette.mid },
        { x: 126, y: 30, fill: palette.soft },
        { x: 38, y: 72, fill: palette.white, opacity: 0.9 },
        { x: 82, y: 72, fill: palette.panel },
        { x: 126, y: 72, fill: palette.navy ?? palette.border },
      ].map(({ x, y, fill, opacity = 1 }, i) => (
        <rect key={i} x={x} y={y} width={36} height={26} rx="7" fill={fill} opacity={opacity} />
      ))}
      {/* Colour-picker cursor on top-left swatch */}
      <circle cx="62" cy="43" r="6" fill="none" stroke={palette.white} strokeWidth="2" opacity="0.7" />
      <circle cx="62" cy="43" r="2" fill={palette.white} opacity="0.9" />
    </svg>
  );
}

/* ─── Map Style ──────────────────────────────────────────────────────────────── */
export function IcoMapStyle() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Left panel — day tile */}
      <rect x="22" y="20" width="72" height="90" rx="10" fill={palette.panel} />
      <rect x="30" y="30" width="56" height="28" rx="4" fill={palette.soft} opacity="0.6" />
      <rect x="30" y="65" width="36" height="4" rx="2" fill={palette.mid} opacity="0.7" />
      <rect x="30" y="74" width="50" height="4" rx="2" fill={palette.mid} opacity="0.5" />
      <rect x="30" y="83" width="28" height="4" rx="2" fill={palette.mid} opacity="0.4" />
      {/* Right panel — night tile (darker) */}
      <rect x="106" y="20" width="72" height="90" rx="10" fill={palette.border} opacity="0.5" />
      <rect x="114" y="30" width="56" height="28" rx="4" fill={palette.mid} opacity="0.35" />
      <rect x="114" y="65" width="36" height="4" rx="2" fill={palette.accent} opacity="0.8" />
      <rect x="114" y="74" width="50" height="4" rx="2" fill={palette.accent} opacity="0.55" />
      <rect x="114" y="83" width="28" height="4" rx="2" fill={palette.accent} opacity="0.4" />
      {/* Toggle arrow between the two */}
      <text x="100" y="70" textAnchor="middle" fontSize="13" fill={palette.white} opacity="0.5">⇄</text>
    </svg>
  );
}

/* ─── Theming Tokens ─────────────────────────────────────────────────────────── */
export function IcoThemingTokens() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Token rows: swatch → arrow → new value */}
      {[
        { y: 28, before: palette.soft,   after: palette.accent, label: 'primary' },
        { y: 54, before: palette.panel,  after: palette.mid,    label: 'surface' },
        { y: 80, before: palette.border, after: palette.accent, label: 'action'  },
      ].map(({ y, before, after }, i) => (
        <g key={i}>
          {/* Before swatch */}
          <rect x="22" y={y} width="22" height="18" rx="5" fill={before} opacity="0.7" />
          {/* Arrow */}
          <text x="60" y={y + 13} fontSize="11" fill={palette.white} opacity="0.45">→</text>
          {/* After swatch */}
          <rect x="76" y={y} width="22" height="18" rx="5" fill={after} />
          {/* Label line */}
          <rect x="110" y={y + 4} width="68" height="4" rx="2" fill={palette.white} opacity="0.2" />
          <rect x="110" y={y + 12} width="44" height="3" rx="1.5" fill={palette.white} opacity="0.12" />
        </g>
      ))}
    </svg>
  );
}

/* ─── Search Result ──────────────────────────────────────────────────────────── */
export function IcoSearchResult() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* Search bar */}
      <rect x="22" y="18" width="156" height="22" rx="11" fill={palette.panel} />
      <circle cx="38" cy="29" r="5" fill="none" stroke={palette.mid} strokeWidth="1.8" />
      <line x1="42" y1="33" x2="46" y2="37" stroke={palette.mid} strokeWidth="1.8" strokeLinecap="round" />
      <rect x="52" y="25" width="60" height="3" rx="1.5" fill={palette.mid} opacity="0.5" />
      {/* Result rows */}
      {[47, 72, 97].map((y, i) => (
        <g key={i}>
          <rect x="22" y={y} width="156" height="18" rx="5" fill={palette.panel} opacity={0.6 - i * 0.1} />
          <rect x="30" y={y + 5} width="10" height="8" rx="2" fill={palette.mid} opacity="0.7" />
          <rect x="46" y={y + 5} width={70 - i * 10} height="3" rx="1.5" fill={palette.white} opacity="0.7" />
          <rect x="46" y={y + 11} width={50 - i * 5} height="2.5" rx="1.25" fill={palette.mid} opacity="0.5" />
          {i === 0 && <circle cx="163" cy={y + 9} r="4" fill={palette.accent} opacity="0.9" />}
        </g>
      ))}
    </svg>
  );
}

/* ─── Conversation Personality ───────────────────────────────────────────────── */
export function IcoConversationPersonality() {
  const { palette } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="130" fill={palette.dark} />
      {/* User bubble — left */}
      <rect x="18" y="18" width="90" height="34" rx="10" fill={palette.panel} />
      <polygon points="24,52 18,64 36,52" fill={palette.panel} />
      <rect x="26" y="28" width="60" height="4" rx="2" fill={palette.mid} opacity="0.8" />
      <rect x="26" y="37" width="44" height="3" rx="1.5" fill={palette.mid} opacity="0.5" />
      {/* AI bubble — right, accent tinted */}
      <rect x="92" y="68" width="90" height="34" rx="10" fill={palette.accent} opacity="0.22" />
      <rect x="92" y="68" width="90" height="34" rx="10" fill="none" stroke={palette.accent} strokeWidth="1.5" opacity="0.55" />
      <polygon points="176,102 182,114 164,102" fill={palette.accent} opacity="0.22" />
      <rect x="100" y="78" width="60" height="4" rx="2" fill={palette.accent} opacity="0.9" />
      <rect x="100" y="87" width="44" height="3" rx="1.5" fill={palette.accent} opacity="0.6" />
      {/* Personality label */}
      <rect x="18" y="98" width="50" height="16" rx="8" fill={palette.mid} opacity="0.35" />
      <rect x="23" y="104" width="40" height="3" rx="1.5" fill={palette.white} opacity="0.55" />
    </svg>
  );
}
