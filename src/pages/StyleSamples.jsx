import PageActions from '../components/ui/PageActions';

/*
  STYLE SAMPLES — New flat blue illustration system
  Light blue bg · navy chrome · pill placeholders · TomTom diamond watermark
  Review here before updating the full illustration library.
*/

/* ─── Shared palette ─────────────────────────────────────────────────────────── */
const C = {
  bg:       '#EAF4FF',   // page / section background
  navy:     '#1B3D6E',   // primary dark
  mid:      '#5B8AC5',   // medium blue
  soft:     '#A8C8E8',   // light blue accent
  panel:    '#C8DCF5',   // light blue panel fill
  pill1:    '#1B3D6E',   // primary pill (title)
  pill2:    '#6BA3CF',   // secondary pill (subtitle)
  pill3:    '#A8C5E8',   // tertiary pill
  border:   '#5B8AC5',   // frame / card border
  grid:     '#B8D5F0',   // dashed grid
  white:    '#FFFFFF',
};

/* ─── Reusable SVG helpers ───────────────────────────────────────────────────── */

/** Rotated-square diamond watermark pattern used as map/card background */
function DiamondWatermark({ x = 0, y = 0, w = 200, h = 130, color = C.soft, opacity = 0.35 }) {
  const size = 38;
  const diamonds = [];
  for (let row = -1; row < Math.ceil(h / size) + 2; row++) {
    for (let col = -1; col < Math.ceil(w / size) + 2; col++) {
      const cx = x + col * size + (row % 2 === 0 ? 0 : size / 2);
      const cy = y + row * size * 0.6;
      diamonds.push(<rect
        key={`${row}-${col}`}
        x={cx - size * 0.38} y={cy - size * 0.38}
        width={size * 0.76} height={size * 0.76}
        rx="3"
        fill="none" stroke={color} strokeWidth="1.5"
        transform={`rotate(45, ${cx}, ${cy})`}
        opacity={opacity}
      />);
    }
  }
  return <>{diamonds}</>;
}

/** Dashed crosshair background lines */
function CrosshairGrid({ w, h }) {
  return (
    <>
      <line x1={w * 0.33} y1="0" x2={w * 0.33} y2={h} stroke={C.grid} strokeWidth="1.5" strokeDasharray="6 5"/>
      <line x1={w * 0.67} y1="0" x2={w * 0.67} y2={h} stroke={C.grid} strokeWidth="1.5" strokeDasharray="6 5"/>
      <line x1="0" y1={h * 0.33} x2={w} y2={h * 0.33} stroke={C.grid} strokeWidth="1.5" strokeDasharray="6 5"/>
      <line x1="0" y1={h * 0.67} x2={w} y2={h * 0.67} stroke={C.grid} strokeWidth="1.5" strokeDasharray="6 5"/>
    </>
  );
}

/** Pill placeholder (rounded rectangle bar simulating text) */
function Pill({ x, y, w, h = 12, color = C.pill3, rx }) {
  return <rect x={x} y={y} width={w} height={h} rx={rx ?? h / 2} fill={color}/>;
}

/** Navigation maneuver arrow (fork-right shape) */
function NavArrow({ cx, cy, size = 18, color = C.white }) {
  const s = size / 18;
  return (
    <g transform={`translate(${cx - 9 * s}, ${cy - 11 * s}) scale(${s})`}>
      {/* Straight shaft */}
      <rect x="7" y="8" width="4" height="9" rx="2" fill={color}/>
      {/* Arrowhead up */}
      <polygon points="9,0 16,8 12,8 12,7 6,7 6,8 2,8" fill={color}/>
      {/* Fork branch going right */}
      <path d="M11 10 Q15 10 15 14 L15 17" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
    </g>
  );
}

/** Curved left-turn arrow */
function TurnArrow({ cx, cy, size = 20, color = C.white }) {
  const s = size / 20;
  return (
    <g transform={`translate(${cx}, ${cy}) scale(${s})`}>
      <path d="M0 8 Q0 -4 -10 -4 L-8 -8 L-16 -2 L-8 4 L-6 0 Q-4 0 -4 8 L-4 14 L4 14 L4 8 Z" fill={color}/>
    </g>
  );
}

/** Road shield (octagon outline) */
function RoadShield({ cx, cy, r = 8, color = C.white }) {
  const pts = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 45 - 22.5) * Math.PI / 180;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(' ');
  return <polygon points={pts} fill="none" stroke={color} strokeWidth="1.5"/>;
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SAMPLE ILLUSTRATIONS
   ═══════════════════════════════════════════════════════════════════════════════ */

/**
 * 1. Navigation Guidance Card (landscape)
 * Matches reference image 1 — card with NIP chrome + diamond map watermark
 */
function SampleNavCard() {
  return (
    <svg viewBox="0 0 400 210" style={{ width: '100%', height: '100%' }} fill="none">
      {/* Page background */}
      <rect width="400" height="210" fill={C.bg}/>
      <CrosshairGrid w={400} h={210}/>

      {/* Main card */}
      <rect x="40" y="18" width="320" height="174" rx="22" fill={C.white} stroke={C.border} strokeWidth="2"/>

      {/* Left panel — light blue content area */}
      <rect x="40" y="18" width="155" height="118" rx="22" fill={C.panel}/>
      <rect x="40" y="60" width="155" height="76" rx="0" fill={C.panel}/>

      {/* Text pill placeholders in panel */}
      <Pill x="60" y="36" w="116" h="13" color={C.mid}/>
      <Pill x="60" y="58" w="90"  h="11" color={C.soft}/>
      <Pill x="60" y="78" w="100" h="11" color={C.soft}/>

      {/* NIP bottom bar (dark navy) */}
      <rect x="40" y="136" width="155" height="56" rx="0" fill={C.navy}/>
      <rect x="40" y="152" width="155" height="40" rx="0" fill={C.navy}/>
      <rect x="40" y="158" width="155" height="34" rx="0" fill={C.navy}/>
      <rect x="40" y="136" width="155" height="56" rx="0" fill={C.navy}/>
      {/* Round bottom-left corner of NIP */}
      <rect x="40" y="162" width="40" height="32" fill={C.navy}/>
      <rect x="155" y="162" width="40" height="32" fill={C.navy}/>
      <path d="M40 162 L40 192 Q40 192 62 192 L155 192 L155 136 L40 136 Z" fill={C.navy} rx="0"/>

      <NavArrow cx="70" cy="164" size={22} color={C.white}/>
      <Pill x="90" y="155" w="80" h="12" color={C.white}/>
      <Pill x="90" y="172" w="58" h="10" color={C.mid}/>
      <RoadShield cx="82" cy="181" r="7" color={C.white}/>
      <Pill x="134" y="176" w="42" h="10" color={C.white}/>

      {/* Right panel — diamond watermark map */}
      <clipPath id="sc1-clip">
        <rect x="195" y="18" width="165" height="174" rx="22"/>
      </clipPath>
      <g clipPath="url(#sc1-clip)">
        <rect x="195" y="18" width="165" height="174" fill={C.white}/>
        <DiamondWatermark x={195} y={18} w={165} h={174} color={C.soft} opacity={0.5}/>
      </g>
    </svg>
  );
}

/**
 * 2. List / Search results
 * Matches reference image 2 — circle avatars with pill title + subtitle rows
 */
function SampleListRows() {
  return (
    <svg viewBox="0 0 400 210" style={{ width: '100%', height: '100%' }} fill="none">
      <rect width="400" height="210" fill={C.bg}/>

      {/* Row 1 */}
      <circle cx="128" cy="72" r="42" fill={C.panel}/>
      <Pill x="188" y="52" w="148" h="20" color={C.navy} rx="10"/>
      <Pill x="188" y="82" w="108" h="17" color={C.pill2} rx="8.5"/>

      {/* Row 2 */}
      <circle cx="128" cy="152" r="42" fill={C.panel}/>
      <Pill x="188" y="132" w="148" h="20" color={C.navy} rx="10"/>
      <Pill x="188" y="162" w="108" h="17" color={C.pill2} rx="8.5"/>
    </svg>
  );
}

/**
 * 3. Multi-device responsive frames
 * Matches reference image 3 — tablet landscape + portrait + phone, all with nav chrome
 */
function SampleMultiDevice() {
  return (
    <svg viewBox="0 0 500 240" style={{ width: '100%', height: '100%' }} fill="none">
      <rect width="500" height="240" fill={C.bg}/>
      {/* Outer dashed bounding box */}
      <rect x="14" y="14" width="472" height="212" rx="6" stroke={C.grid} strokeWidth="2" strokeDasharray="8 6" fill="none"/>

      {/* ── Tablet landscape (large, back-left) ── */}
      <rect x="110" y="42" width="260" height="176" rx="14" fill={C.white} stroke={C.border} strokeWidth="2"/>
      {/* Map area with diamond watermark */}
      <clipPath id="sc3-tab-l">
        <rect x="110" y="42" width="260" height="130" rx="14"/>
      </clipPath>
      <g clipPath="url(#sc3-tab-l)">
        <rect x="110" y="42" width="260" height="130" fill={C.white}/>
        <DiamondWatermark x={110} y={42} w={260} h={130} color={C.soft} opacity={0.4}/>
      </g>
      {/* NIP header */}
      <rect x="152" y="42" width="176" height="44" rx="10" fill={C.navy}/>
      <TurnArrow cx="170" cy="64" size={18} color={C.white}/>
      <Pill x="186" y="55" w="80" h="11" color={C.white} rx="5.5"/>
      <Pill x="186" y="71" w="56" h="9" color={C.mid} rx="4.5"/>
      {/* Bottom bar */}
      <rect x="110" y="172" width="260" height="46" rx="14" fill={C.navy}/>
      <rect x="110" y="172" width="260" height="20" fill={C.navy}/>
      {[0,1,2,3].map(i => (
        <Pill key={i} x={128 + i * 58} y={180} w={44} h={12} color={C.white} rx="6"/>
      ))}
      {[0,1,2,3].map(i => (
        <Pill key={i} x={128 + i * 58} y={196} w={36} h={9} color={C.mid} rx="4.5"/>
      ))}

      {/* ── Tablet portrait (tall, center-front) ── */}
      <rect x="228" y="22" width="150" height="196" rx="14" fill={C.white} stroke={C.border} strokeWidth="2.5"/>
      <clipPath id="sc3-tab-p">
        <rect x="228" y="22" width="150" height="146" rx="14"/>
      </clipPath>
      <g clipPath="url(#sc3-tab-p)">
        <rect x="228" y="22" width="150" height="146" fill={C.white}/>
        <DiamondWatermark x={228} y={22} w={150} h={146} color={C.soft} opacity={0.4}/>
      </g>
      <rect x="246" y="22" width="114" height="42" rx="9" fill={C.navy}/>
      <TurnArrow cx="260" cy="43" size={16} color={C.white}/>
      <Pill x="272" y="33" w="70" h="10" color={C.white} rx="5"/>
      <Pill x="272" y="47" w="50" h="9" color={C.mid} rx="4.5"/>
      <rect x="228" y="168" width="150" height="50" rx="14" fill={C.navy}/>
      <rect x="228" y="168" width="150" height="20" fill={C.navy}/>
      {[0,1,2].map(i => (
        <Pill key={i} x={240 + i * 44} y={174} w={36} h={11} color={C.white} rx="5.5"/>
      ))}
      {[0,1,2].map(i => (
        <Pill key={i} x={240 + i * 44} y={189} w={28} h={9} color={C.mid} rx="4.5"/>
      ))}

      {/* ── Phone (small, right) ── */}
      <rect x="390" y="60" width="82" height="140" rx="12" fill={C.white} stroke={C.border} strokeWidth="2"/>
      <clipPath id="sc3-phone">
        <rect x="390" y="60" width="82" height="100" rx="12"/>
      </clipPath>
      <g clipPath="url(#sc3-phone)">
        <rect x="390" y="60" width="82" height="100" fill={C.white}/>
        <DiamondWatermark x={390} y={60} w={82} h={100} color={C.soft} opacity={0.4}/>
      </g>
      <rect x="398" y="60" width="66" height="30" rx="8" fill={C.navy}/>
      <TurnArrow cx="408" cy="75" size={13} color={C.white}/>
      <Pill x="420" y="66" w="36" h="8" color={C.white} rx="4"/>
      <Pill x="420" y="78" w="26" h="7" color={C.mid} rx="3.5"/>
      <rect x="390" y="160" width="82" height="40" rx="12" fill={C.navy}/>
      <rect x="390" y="160" width="82" height="14" fill={C.navy}/>
      {[0,1].map(i => (
        <Pill key={i} x={398 + i * 34} y={165} w={26} h={9} color={C.white} rx="4.5"/>
      ))}
      {[0,1].map(i => (
        <Pill key={i} x={398 + i * 34} y={178} w={20} h={7} color={C.mid} rx="3.5"/>
      ))}
    </svg>
  );
}

/**
 * 4. Colour — eyedropper icon illustration
 * Matches reference image 4
 */
function SampleColour() {
  return (
    <svg viewBox="0 0 400 240" style={{ width: '100%', height: '100%' }} fill="none">
      <rect width="400" height="240" rx="20" fill="#F4F8FE"/>
      {/* Dropper body (angled ~-45deg, centered) */}
      <g transform="translate(200,112) rotate(-40)">
        {/* Glass barrel */}
        <rect x="-9" y="-52" width="18" height="52" rx="6" fill={C.panel} stroke={C.mid} strokeWidth="2"/>
        {/* Liquid fill inside barrel */}
        <rect x="-7" y="-18" width="14" height="18" rx="3" fill={C.mid} opacity="0.8"/>
        {/* Rubber bulb */}
        <ellipse cx="0" cy="-62" rx="14" ry="16" fill={C.navy}/>
        {/* Tip */}
        <path d="M-4 0 L4 0 L2 18 Q0 24 -2 18 Z" fill={C.mid}/>
        {/* Drop */}
        <ellipse cx="0" cy="28" rx="5" ry="7" fill={C.mid}/>
        {/* Sparkle lines */}
        <line x1="18" y1="-68" x2="26" y2="-74" stroke={C.soft} strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="22" y1="-58" x2="32" y2="-58" stroke={C.soft} strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="18" y1="-48" x2="26" y2="-42" stroke={C.soft} strokeWidth="2.5" strokeLinecap="round"/>
      </g>
      {/* Label */}
      <text x="200" y="185" textAnchor="middle" fill={C.navy}
        style={{ fontSize: 28, fontWeight: 700, fontFamily: 'system-ui, sans-serif', letterSpacing: '-0.5px' }}>
        Colour
      </text>
    </svg>
  );
}

/**
 * 5. Typography — Abc letterform illustration
 * Matches reference image 5
 */
function SampleTypography() {
  return (
    <svg viewBox="0 0 400 240" style={{ width: '100%', height: '100%' }} fill="none">
      {/* White-to-light-blue gradient bg */}
      <defs>
        <linearGradient id="typo-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#D8EAF8"/>
        </linearGradient>
      </defs>
      <rect width="400" height="240" rx="20" fill="url(#typo-bg)"/>
      {/* A — dark navy, bold */}
      <text x="85" y="162" textAnchor="middle" fill={C.navy}
        style={{ fontSize: 130, fontWeight: 800, fontFamily: 'system-ui, sans-serif' }}>
        A
      </text>
      {/* b — medium blue, offset behind */}
      <text x="198" y="162" textAnchor="middle" fill={C.mid} opacity="0.9"
        style={{ fontSize: 130, fontWeight: 800, fontFamily: 'system-ui, sans-serif' }}>
        b
      </text>
      {/* c — light blue, most transparent */}
      <text x="298" y="162" textAnchor="middle" fill={C.soft} opacity="0.85"
        style={{ fontSize: 130, fontWeight: 800, fontFamily: 'system-ui, sans-serif' }}>
        c
      </text>
      {/* Label */}
      <text x="200" y="210" textAnchor="middle" fill={C.navy}
        style={{ fontSize: 24, fontWeight: 700, fontFamily: 'system-ui, sans-serif' }}>
        Typography
      </text>
    </svg>
  );
}

/**
 * 6. EV Charging (flat blue re-interpretation)
 * List of charging stations in the new abstract style
 */
function SampleEVCharging() {
  return (
    <svg viewBox="0 0 400 210" style={{ width: '100%', height: '100%' }} fill="none">
      <rect width="400" height="210" fill={C.bg}/>
      <CrosshairGrid w={400} h={210}/>

      {/* Card */}
      <rect x="30" y="16" width="340" height="178" rx="18" fill={C.white} stroke={C.border} strokeWidth="1.5"/>

      {/* Header bar */}
      <rect x="30" y="16" width="340" height="44" rx="18" fill={C.navy}/>
      <rect x="30" y="38" width="340" height="22" fill={C.navy}/>
      {/* EV plug icon (simplified) */}
      <rect x="52" y="26" width="6" height="12" rx="3" fill={C.white}/>
      <rect x="62" y="26" width="6" height="12" rx="3" fill={C.white}/>
      <path d="M50 38 L70 38 L70 44 Q70 50 60 50 Q50 50 50 44 Z" fill={C.white}/>
      <Pill x="80" y="28" w="110" h="12" color={C.white}/>
      <Pill x="80" y="44" w="72"  h="10" color={C.mid}/>
      {/* Filter pills */}
      <rect x="260" y="26" width="46" height="20" rx="10" fill={C.mid}/>
      <Pill x="264" y="31" w="38" h="10" color={C.white}/>
      <rect x="310" y="26" width="46" height="20" rx="10" fill="none" stroke={C.soft} strokeWidth="1.5"/>
      <Pill x="314" y="31" w="38" h="10" color={C.panel}/>

      {/* Station rows */}
      {[
        { y: 76,  numColor: '#22c55e', label1w: 80, label2w: 60, badge: '3/4' },
        { y: 114, numColor: '#22c55e', label1w: 72, label2w: 54, badge: '2/4' },
        { y: 152, numColor: C.mid,     label1w: 68, label2w: 48, badge: '5/6' },
      ].map(({ y, numColor, label1w, label2w, badge }, i) => (
        <g key={i}>
          {/* Number badge */}
          <circle cx="56" cy={y} r="13" fill={numColor}/>
          <text x="56" y={y + 4} textAnchor="middle" fill={C.white}
            style={{ fontSize: 10, fontWeight: 700, fontFamily: 'system-ui' }}>{i + 1}</text>
          {/* Labels */}
          <Pill x="78" y={y - 10} w={label1w} h="12" color={C.navy}/>
          <Pill x="78" y={y + 6}  w={label2w} h="10" color={C.soft}/>
          {/* Availability badge */}
          <rect x={340 - 44} y={y - 10} width="44" height="24" rx="12" fill="none" stroke={C.soft} strokeWidth="1.5"/>
          <text x={340 - 22} y={y + 5} textAnchor="middle" fill={numColor}
            style={{ fontSize: 9, fontWeight: 700, fontFamily: 'system-ui' }}>{badge}</text>
          {/* Divider */}
          {i < 2 && <line x1="40" y1={y + 28} x2="360" y2={y + 28} stroke={C.panel} strokeWidth="1"/>}
        </g>
      ))}
    </svg>
  );
}

/**
 * 7. Route Bar / ETA panel (flat blue)
 * Bottom panel with ETA data in abstract pill style
 */
function SampleETAPanel() {
  return (
    <svg viewBox="0 0 400 210" style={{ width: '100%', height: '100%' }} fill="none">
      <rect width="400" height="210" fill={C.bg}/>

      {/* Map area with diamond watermark */}
      <rect x="24" y="16" width="352" height="130" rx="16" fill={C.white} stroke={C.border} strokeWidth="1.5"/>
      <clipPath id="sc7-map">
        <rect x="24" y="16" width="352" height="130" rx="16"/>
      </clipPath>
      <g clipPath="url(#sc7-map)">
        <DiamondWatermark x={24} y={16} w={352} h={130} color={C.soft} opacity={0.35}/>
        {/* Route line (light, abstract) */}
        <path d="M60 120 Q140 60 200 80 Q280 100 340 40" stroke={C.mid} strokeWidth="4"
          strokeLinecap="round" opacity="0.6"/>
        {/* Vehicle dot */}
        <circle cx="200" cy="80" r="9" fill={C.navy}/>
        <circle cx="200" cy="80" r="5" fill={C.white}/>
      </g>

      {/* ETA bar */}
      <rect x="24" y="150" width="352" height="56" rx="16" fill={C.navy}/>
      {/* Three data columns */}
      {[
        { label: 'ETA',      value: '14:32', x: 90  },
        { label: 'Remaining',value: '18 min',x: 200 },
        { label: 'Distance', value: '6.4 km',x: 310 },
      ].map(({ label, value, x }) => (
        <g key={label}>
          <text x={x} y="170" textAnchor="middle" fill={C.white}
            style={{ fontSize: 14, fontWeight: 700, fontFamily: 'system-ui' }}>{value}</text>
          <text x={x} y="186" textAnchor="middle" fill={C.soft}
            style={{ fontSize: 9, fontFamily: 'system-ui', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</text>
        </g>
      ))}
      {/* Dividers */}
      <line x1="148" y1="158" x2="148" y2="198" stroke={C.mid} strokeWidth="1" opacity="0.5"/>
      <line x1="252" y1="158" x2="252" y2="198" stroke={C.mid} strokeWidth="1" opacity="0.5"/>
    </svg>
  );
}

/**
 * 8. Home Screen Layout zones (flat blue)
 */
function SampleHomeScreen() {
  return (
    <svg viewBox="0 0 400 210" style={{ width: '100%', height: '100%' }} fill="none">
      <rect width="400" height="210" fill={C.bg}/>
      <CrosshairGrid w={400} h={210}/>

      {/* Device frame */}
      <rect x="50" y="16" width="300" height="178" rx="18" fill={C.white} stroke={C.border} strokeWidth="2"/>

      {/* Map area */}
      <clipPath id="sc8-map">
        <rect x="50" y="16" width="300" height="178" rx="18"/>
      </clipPath>
      <g clipPath="url(#sc8-map)">
        <DiamondWatermark x={50} y={16} w={300} h={178} color={C.soft} opacity={0.3}/>
      </g>

      {/* Nav area zone (amber dashed) */}
      <rect x="62" y="26" width="276" height="158" rx="8" fill="none"
        stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.7"/>

      {/* Map safe area (blue dashed) */}
      <rect x="74" y="36" width="220" height="108" rx="6" fill="none"
        stroke={C.border} strokeWidth="1.5" strokeDasharray="5 4" opacity="0.6"/>

      {/* Controls zone bottom (red dashed) */}
      <rect x="74" y="152" width="220" height="28" rx="6" fill="none"
        stroke="#e2001a" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.5"/>

      {/* Control button pills */}
      {[0, 1, 2, 3].map(i => (
        <rect key={i} x={82 + i * 54} y="158" width="42" height="16" rx="8"
          fill={C.navy} opacity="0.7"/>
      ))}

      {/* Zone legend */}
      {[['#F59E0B', 'Nav area'], [C.border, 'Safe area'], ['#e2001a', 'Controls']].map(([color, label], i) => (
        <g key={label} transform={`translate(298, ${38 + i * 18})`}>
          <rect width="8" height="8" rx="2" fill={color} opacity="0.8"/>
          <text x="12" y="7" fill={C.navy} style={{ fontSize: 8, fontFamily: 'system-ui', fontWeight: 600 }}>{label}</text>
        </g>
      ))}
    </svg>
  );
}

/**
 * 9. ADAS / Virtual Horizon (flat blue perspective road)
 */
function SampleADAS() {
  return (
    <svg viewBox="0 0 400 210" style={{ width: '100%', height: '100%' }} fill="none">
      <rect width="400" height="210" fill={C.bg}/>

      {/* Road perspective trapezoid */}
      <path d="M60 210 L150 90 L250 90 L340 210 Z" fill={C.panel} opacity="0.6"/>

      {/* Lane dividers (perspective lines) */}
      {[145, 165, 185, 200, 215, 235, 255].map((x, i) => (
        <line key={i}
          x1={x} y1={90}
          x2={60 + (x - 145) / (255 - 145) * (340 - 60)} y2={210}
          stroke={C.mid} strokeWidth="1" strokeDasharray="6 5" opacity="0.4"/>
      ))}

      {/* Horizon line */}
      <line x1="80" y1="90" x2="320" y2="90" stroke={C.soft} strokeWidth="1.5" opacity="0.5"/>

      {/* Road diamond watermark in perspective zone */}
      <clipPath id="sc9-road">
        <path d="M60 210 L150 90 L250 90 L340 210 Z"/>
      </clipPath>
      <g clipPath="url(#sc9-road)" opacity="0.25">
        <DiamondWatermark x={60} y={90} w={280} h={120} color={C.navy} opacity={1}/>
      </g>

      {/* Horizon event markers */}
      <circle cx="160" cy="104" r="10" fill={C.navy}/>
      <text x="160" y="108" textAnchor="middle" fill={C.white} style={{ fontSize: 10 }}>⚠</text>
      <circle cx="240" cy="98" r="10" fill={C.mid}/>
      <text x="240" y="102" textAnchor="middle" fill={C.white} style={{ fontSize: 9 }}>⛽</text>

      {/* Speed limit badge */}
      <circle cx="68" cy="48" r="28" fill={C.white} stroke={C.navy} strokeWidth="3"/>
      <circle cx="68" cy="48" r="22" fill={C.white} stroke="#e2001a" strokeWidth="2"/>
      <text x="68" y="53" textAnchor="middle" fill={C.navy} style={{ fontSize: 16, fontWeight: 800, fontFamily: 'system-ui' }}>80</text>

      {/* Lane arrows at bottom */}
      {[false, false, true, true, false].map((active, i) => (
        <g key={i} transform={`translate(${156 + i * 22}, 178)`}>
          <rect x="-7" y="4" width="14" height="18" rx="2"
            fill={active ? C.navy : C.panel} stroke={active ? C.navy : C.soft} strokeWidth="1"/>
          <polygon points="0,-2 7,6 4.5,6 4.5,4 -4.5,4 -4.5,6 -7,6"
            fill={active ? C.navy : C.panel}/>
        </g>
      ))}

      {/* Info label top right */}
      <rect x="296" y="30" width="88" height="36" rx="10" fill={C.navy}/>
      <text x="340" y="44" textAnchor="middle" fill={C.white} style={{ fontSize: 9, fontFamily: 'system-ui' }}>600 m</text>
      <text x="340" y="57" textAnchor="middle" fill={C.soft} style={{ fontSize: 8, fontFamily: 'system-ui' }}>Lane change</text>
    </svg>
  );
}

/**
 * 10. Instrument Cluster (flat blue)
 */
function SampleCluster() {
  return (
    <svg viewBox="0 0 400 210" style={{ width: '100%', height: '100%' }} fill="none">
      <rect width="400" height="210" fill={C.bg}/>

      {/* Speed gauge (left) */}
      <circle cx="88" cy="108" r="62" fill={C.panel} opacity="0.5"/>
      <circle cx="88" cy="108" r="52" fill={C.white} stroke={C.border} strokeWidth="2"/>
      {/* Arc track */}
      <path d="M40 148 A52 52 0 1 1 136 148" stroke={C.panel} strokeWidth="8" fill="none" strokeLinecap="round"/>
      {/* Arc fill (speed) */}
      <path d="M40 148 A52 52 0 0 1 88 56" stroke={C.navy} strokeWidth="8" fill="none" strokeLinecap="round"/>
      <text x="88" y="114" textAnchor="middle" fill={C.navy} style={{ fontSize: 26, fontWeight: 800, fontFamily: 'system-ui' }}>72</text>
      <text x="88" y="128" textAnchor="middle" fill={C.mid} style={{ fontSize: 10, fontFamily: 'system-ui' }}>km/h</text>

      {/* Center nav panel */}
      <rect x="162" y="46" width="176" height="130" rx="12" fill={C.white} stroke={C.border} strokeWidth="1.5"/>
      {/* Map strip */}
      <clipPath id="sc10-map">
        <rect x="162" y="46" width="176" height="84" rx="12"/>
      </clipPath>
      <g clipPath="url(#sc10-map)">
        <DiamondWatermark x={162} y={46} w={176} h={84} color={C.soft} opacity={0.4}/>
        <path d="M162 100 Q220 70 250 88 T338 72" stroke={C.mid} strokeWidth="3" strokeLinecap="round" opacity="0.7"/>
        <circle cx="250" cy="88" r="6" fill={C.navy}/>
        <circle cx="250" cy="88" r="3" fill={C.white}/>
      </g>
      {/* NIP strip */}
      <rect x="162" y="130" width="176" height="30" rx="0" fill={C.navy}/>
      <rect x="162" y="146" width="176" height="30" rx="12" fill={C.navy}/>
      <NavArrow cx="180" cy="145" size={16} color={C.white}/>
      <Pill x="196" y="135" w="80" h="10" color={C.white}/>
      <Pill x="196" y="149" w="56" h="9" color={C.mid}/>
      {/* ETA row */}
      <rect x="162" y="158" width="176" height="18" rx="12" fill={C.navy}/>
      <rect x="162" y="158" width="176" height="10" fill={C.navy}/>
      {[['10:59', 124], ['26.5 km', 222], ['18 min', 310]].map(([v, x], i) => (
        <text key={i} x={x} y="170" textAnchor="middle" fill={i === 0 ? C.white : C.soft}
          style={{ fontSize: 8, fontWeight: i === 0 ? 700 : 400, fontFamily: 'system-ui' }}>{v}</text>
      ))}

      {/* Battery gauge (right) */}
      <circle cx="352" cy="108" r="52" fill={C.white} stroke={C.border} strokeWidth="2"/>
      <path d="M304 148 A52 52 0 1 1 400 148" stroke={C.panel} strokeWidth="8" fill="none" strokeLinecap="round"/>
      <path d="M304 148 A52 52 0 0 1 384 88" stroke="#22c55e" strokeWidth="8" fill="none" strokeLinecap="round"/>
      <text x="352" y="108" textAnchor="middle" fill="#22c55e" style={{ fontSize: 18, fontWeight: 800, fontFamily: 'system-ui' }}>74%</text>
      <text x="352" y="122" textAnchor="middle" fill={C.mid} style={{ fontSize: 9, fontFamily: 'system-ui' }}>BATTERY</text>
    </svg>
  );
}

/* ─── Sample card wrapper ─────────────────────────────────────────────────────── */
function SampleCard({ Sample, label, note }) {
  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: 20,
      overflow: 'hidden',
      background: 'var(--surface)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{ background: C.bg, aspectRatio: '400/210', overflow: 'hidden' }}>
        <Sample />
      </div>
      <div style={{ padding: '12px 14px' }}>
        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--black)', marginBottom: 4 }}>{label}</div>
        {note && <div style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.5 }}>{note}</div>}
      </div>
    </div>
  );
}

/* ─── Style guide swatches ───────────────────────────────────────────────────── */
function Palette() {
  const swatches = [
    { name: 'Navy',       color: C.navy,   hex: '#1B3D6E', use: 'Headers, chrome, primary text' },
    { name: 'Mid blue',   color: C.mid,    hex: '#5B8AC5', use: 'Borders, accents, secondary' },
    { name: 'Soft blue',  color: C.soft,   hex: '#A8C8E8', use: 'Pill text, watermark, muted' },
    { name: 'Panel',      color: C.panel,  hex: '#C8DCF5', use: 'Background panels, circles' },
    { name: 'Background', color: C.bg,     hex: '#EAF4FF', use: 'Page / section background' },
    { name: 'White',      color: C.white,  hex: '#FFFFFF', use: 'Cards, text on navy' },
  ];
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      {swatches.map(s => (
        <div key={s.name} style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 100 }}>
          <div style={{ width: '100%', height: 40, borderRadius: 10, background: s.color, border: '1px solid var(--border)' }}/>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)' }}>{s.name}</div>
          <div style={{ fontSize: '0.625rem', color: 'var(--muted)', fontFamily: 'monospace' }}>{s.hex}</div>
          <div style={{ fontSize: '0.625rem', color: 'var(--muted)', lineHeight: 1.4 }}>{s.use}</div>
        </div>
      ))}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function StyleSamples() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Style Samples — New Illustration System</h1>
        <PageActions />
      </div>

      <p className="quick-answer">
        10 sample illustrations in the new flat blue style — light backgrounds, navy chrome panels, pill
        placeholders, TomTom diamond watermark texture, and device frame outlines. Review these before
        we replace the existing dark-map illustrations across all intro pages.
      </p>

      {/* ── Palette ── */}
      <div className="zone">
        <h2 className="sh" id="ss-palette">Colour palette</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--mid)', marginBottom: 20 }}>
          Monochromatic blue system — navy anchor, mid accent, soft fill, panel wash, light background.
        </p>
        <Palette />
      </div>

      {/* ── Design System samples ── */}
      <div className="zone">
        <h2 className="sh" id="ss-ds">Design System illustrations</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          <SampleCard Sample={SampleColour}     label="Colour"     note="Eyedropper icon · icon-forward style" />
          <SampleCard Sample={SampleTypography} label="Typography" note="Abc letterform · three-weight opacity" />
        </div>
      </div>

      {/* ── Navigation UI samples ── */}
      <div className="zone">
        <h2 className="sh" id="ss-nav">Navigation UI illustrations</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          <SampleCard Sample={SampleNavCard}     label="Navigation Card (NIP)"    note="Card with left-panel UI chrome + diamond map watermark" />
          <SampleCard Sample={SampleETAPanel}    label="ETA Panel"                note="Map route + bottom data bar with three fields" />
          <SampleCard Sample={SampleHomeScreen}  label="Home Screen Layout"       note="Zone diagram with dashed bounding areas" />
          <SampleCard Sample={SampleMultiDevice} label="Multi-device responsive"  note="Tablet landscape · tablet portrait · phone frames" />
        </div>
      </div>

      {/* ── Feature illustrations ── */}
      <div className="zone">
        <h2 className="sh" id="ss-feature">Feature illustrations</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          <SampleCard Sample={SampleListRows}   label="Search / List rows"    note="Circle avatars + title/subtitle pill rows" />
          <SampleCard Sample={SampleEVCharging} label="EV Charging stations"  note="Card with header chrome + ranked station list" />
          <SampleCard Sample={SampleCluster}    label="Instrument Cluster"    note="Dual gauge arcs + centre nav panel" />
          <SampleCard Sample={SampleADAS}       label="ADAS / Virtual Horizon" note="Road perspective + lane arrows + speed limit" />
        </div>
      </div>

    </div>
  );
}
