/**
 * Light-blue illustration variants
 *
 * Exports the flat-blue palette (C), all L_Xxx light illustration components,
 * and the makeThumb(Dark, Light) factory that reads the global IlloStyleContext
 * and renders the appropriate variant.
 *
 * Used by:
 *  - IntroIllustrations (plumbing / style-reference page)
 *  - Overview, NavSDKIntro, RoutingAPIIntro, LDEVRIntro, ANAIntro (product intro pages)
 */

import { useIlloStyle } from '../context/IlloStyleContext';

/* ─── Palette ─────────────────────────────────────────────────────────────────── */
// C is now read from THEMES via useIlloStyle() — see IlloStyleContext.jsx

/* ─── SVG helpers (internal) ────────────────────────────────────────────────── */
function DW({ x = 0, y = 0, w = 200, h = 130, op = 0.35 }) {
  const { palette: C } = useIlloStyle();
  const size = 38; const diamonds = [];
  for (let row = -1; row < Math.ceil(h / size) + 2; row++) {
    for (let col = -1; col < Math.ceil(w / size) + 2; col++) {
      const cx = x + col * size + (row % 2 === 0 ? 0 : size / 2);
      const cy = y + row * size * 0.6;
      diamonds.push(<rect key={`${row}-${col}`} x={cx - size*0.38} y={cy - size*0.38} width={size*0.76} height={size*0.76} rx="3" fill="none" stroke={C.soft} strokeWidth="1.5" transform={`rotate(45,${cx},${cy})`} opacity={op}/>);
    }
  }
  return <>{diamonds}</>;
}
function LP({ x, y, w, h = 10, color, rx }) {
  const { palette: C } = useIlloStyle();
  return <rect x={x} y={y} width={w} height={h} rx={rx ?? h / 2} fill={color ?? C.panel}/>;
}
function NA({ cx, cy, size = 22, color }) {
  const { palette: C } = useIlloStyle();
  const _color = color ?? C.white;
  const s = size / 18;
  return (
    <g transform={`translate(${cx - 9*s},${cy - 11*s}) scale(${s})`}>
      <rect x="7" y="8" width="4" height="9" rx="2" fill={_color}/>
      <polygon points="9,0 16,8 12,8 12,7 6,7 6,8 2,8" fill={_color}/>
    </g>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   UX Library — Overview
   ══════════════════════════════════════════════════════════════════════════════ */

export function L_EV() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      {/* Title + accent subtitle */}
      <LP x="10" y="8" w="90" h="10" color={C.navy}/>
      <LP x="10" y="21" w="72" h="8" color={C.accent ?? '#22c55e'}/>
      {/* Filter pills: Speed (active), Payment, Services */}
      {[true,false,false].map((active,i) => (
        <g key={i}>
          <rect x={10+i*62} y="32" width="56" height="14" rx="7"
            fill={active?C.mid:C.panel} stroke={active?'none':C.border} strokeWidth="1"/>
          <LP x={16+i*62} y="37" w={active?44:38} h="6" color={active?C.white:C.soft}/>
        </g>
      ))}
      {/* Result rows: y=52, 78, 104 — spacing=26 */}
      {[C.accent ?? '#22c55e', C.accent ?? '#22c55e', C.mid].map((col,i) => (
        <g key={i}>
          {i>0 && <line x1="10" y1={52+i*26} x2="190" y2={52+i*26} stroke={C.border} strokeWidth="0.75" opacity="0.5"/>}
          <circle cx="22" cy={63+i*26} r="9" fill={col}/>
          <text x="22" y={67+i*26} textAnchor="middle" fill={C.white}
            style={{fontSize:8,fontWeight:700,fontFamily:'system-ui'}}>{i+1}</text>
          <LP x="38" y={57+i*26} w="86" h="9" color={C.navy}/>
          <LP x="38" y={69+i*26} w="56" h="7" color={C.soft}/>
          <LP x="158" y={59+i*26} w="30" h="8" color={C.accent ?? '#22c55e'}/>
        </g>
      ))}
    </svg>
  );
}

export function L_SearchResult() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      {/* Search bar */}
      <rect x="10" y="8" width="180" height="22" rx="8" fill={C.white} stroke={C.border} strokeWidth="1.5"/>
      <circle cx="22" cy="19" r="5" fill={C.panel}/>
      <LP x="34" y="14" w="106" h="10" color={C.panel}/>
      {/* Result rows: y=34, 62, 90 — spacing=28, row h=26 */}
      {[0,1,2].map(i => (
        <g key={i}>
          {i>0 && <line x1="10" y1={34+i*28} x2="190" y2={34+i*28} stroke={C.border} strokeWidth="0.75" opacity="0.5"/>}
          <rect x="14" y={39+i*28} width="16" height="16" rx="4" fill={C.soft} opacity="0.55"/>
          <LP x="38" y={41+i*28} w="115" h="9" color={C.navy}/>
          <LP x="38" y={53+i*28} w="52" h="7" color={C.soft}/>
        </g>
      ))}
    </svg>
  );
}

export function L_NavControls() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <clipPath id="lv-lnc-map"><rect x="30" y="0" width="170" height="130" rx="0"/></clipPath>
      <g clipPath="url(#lv-lnc-map)">
        <rect x="30" y="0" width="170" height="130" fill={C.white}/>
        <DW x={30} y={0} w={170} h={130} op={0.4}/>
        <path d="M50 100 Q100 70 140 65 T200 50" stroke={C.mid} strokeWidth="3" strokeLinecap="round" opacity="0.7"/>
        <circle cx="140" cy="65" r="6" fill={C.navy}/>
        <circle cx="140" cy="65" r="3" fill={C.white}/>
      </g>
      <rect x="0" y="0" width="30" height="130" fill={C.dark}/>
      {['🔍','⚡','🔇','⚙️'].map((b,i) => (
        <g key={b}>
          <rect x="5" y={20+i*24} width="20" height="18" rx="5" fill="rgba(255,255,255,0.15)"/>
          <text x="15" y={32+i*24} textAnchor="middle" style={{fontSize:9}}>{b}</text>
        </g>
      ))}
    </svg>
  );
}

export function L_AIVoice() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      {/* waveform + mic label */}
      <LP x="20" y="8" w="55" h="8" color={C.panel}/>
      <circle cx="85" cy="12" r="5" fill={C.mid} opacity="0.5"/>
      <path d="M83 9 Q85 7 87 9 L87 14 Q85 16 83 14 Z" fill={C.white}/>
      {[3,5,8,11,8,12,7,10,5,3,8,4].map((h,i) => (
        <rect key={i} x={20+i*7} y={30-h/2} width="4" height={h} rx="2" fill={C.mid} opacity={0.5+i*0.04}/>
      ))}
      {/* User voice bubble — shows spoken query as real text */}
      <rect x="10" y="48" width="130" height="32" rx="12" fill={C.panel}/>
      <text x="20" y="61" fill={C.navy} style={{fontSize:6,fontFamily:'system-ui',fontWeight:600}}>"Take me to nearest charger"</text>
      <text x="20" y="73" fill={C.pill2} style={{fontSize:5.5,fontFamily:'system-ui'}}>voice input</text>
      {/* System response bubble — shows structured intent + result */}
      <rect x="60" y="90" width="130" height="34" rx="12" fill={C.dark}/>
      <text x="72" y="102" fill={C.accent ?? '#22c55e'} style={{fontSize:5.5,fontFamily:'monospace',fontWeight:700}}>NAVIGATE_TO_EV_CHARGING</text>
      <text x="72" y="114" fill={C.white} style={{fontSize:5.5,fontFamily:'system-ui'}}>Ionity · 4.2 km · Route set ✓</text>
    </svg>
  );
}

export function L_Route() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <LP x="10" y="8" w="120" h="11" color={C.navy}/>
      <LP x="10" y="23" w="80" h="9" color={C.soft}/>
      <line x1="28" y1="45" x2="28" y2="118" stroke={C.soft} strokeWidth="2" strokeDasharray="4 3"/>
      {[{y:45,fill:C.accent ?? '#22c55e'},{y:72,fill:C.mid},{y:98,fill:C.mid},{y:118,fill:C.navy}].map(({y,fill},i) => (
        <g key={i}>
          <circle cx="28" cy={y} r="7" fill={fill}/>
          <LP x="42" y={y-6} w="120" h="11" color={i===0||i===3?C.navy:C.panel}/>
          {i>0&&i<3&&<LP x="42" y={y+8} w="80" h="8" color={C.soft}/>}
        </g>
      ))}
    </svg>
  );
}

export function L_ColourSystem() {
  const { palette: C } = useIlloStyle();
  const swatches = ['#e2001a','#5B8AC5','#A8C8E8','#C8DCF5','#1B3D6E',C.accent ?? '#22c55e'];
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <DW x={0} y={0} w={200} h={130} op={0.2}/>
      <LP x="60" y="10" w="80" h="12" color={C.navy}/>
      {swatches.map((c,i) => (
        <rect key={i} x={15+i*29} y="35" width="24" height="24" rx="6" fill={c} stroke={C.white} strokeWidth="1.5"/>
      ))}
      {[['Brand','#e2001a'],['Mid','#5B8AC5'],['Navy','#1B3D6E']].map(([label,col],i) => (
        <g key={label}>
          <rect x="12" y={75+i*18} width="12" height="12" rx="3" fill={col}/>
          <LP x="30" y={76+i*18} w="60" h="10" color={C.navy}/>
          <LP x="100" y={76+i*18} w="55" h="10" color={C.panel}/>
        </g>
      ))}
    </svg>
  );
}

export function L_HorizonPanel() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <clipPath id="lv-lhp-map"><rect x="0" y="0" width="130" height="130"/></clipPath>
      <g clipPath="url(#lv-lhp-map)">
        <rect width="130" height="130" fill={C.white}/>
        <DW x={0} y={0} w={130} h={130} op={0.4}/>
        <path d="M10 95 Q65 60 100 72 T130 55" stroke={C.mid} strokeWidth="3" strokeLinecap="round" opacity="0.7"/>
        <circle cx="100" cy="72" r="5" fill={C.navy}/>
        <circle cx="100" cy="72" r="3" fill={C.white}/>
      </g>
      <rect x="130" y="0" width="70" height="130" fill={C.dark}/>
      <rect x="130" y="0" width="70" height="42" fill="rgba(34,197,94,0.2)"/>
      <NA cx="150" cy="20" size={18} color={C.white}/>
      <LP x="165" y="13" w="28" h="9" color={C.white}/>
      <LP x="165" y="26" w="22" h="8" color={C.soft}/>
      {[['🚧', C.warn ?? '#fbbf24'],['⛽',C.soft]].map(([icon,col],i) => (
        <g key={icon}>
          <text x="142" y={56+i*18} style={{fontSize:11}}>{icon}</text>
          <LP x="158" y={49+i*18} w="36" h="11" color="rgba(255,255,255,0.15)"/>
        </g>
      ))}
      <line x1="130" y1="96" x2="200" y2="96" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
      {[['14:32','ETA'],[' 18m ','Time']].map(([v,l],i) => (
        <g key={l}>
          <text x={148+i*34} y="109" textAnchor="middle" fill={C.white} style={{fontSize:9,fontWeight:700,fontFamily:'system-ui'}}>{v}</text>
          <text x={148+i*34} y="121" textAnchor="middle" fill={C.soft} style={{fontSize:7,fontFamily:'system-ui'}}>{l}</text>
        </g>
      ))}
    </svg>
  );
}

export function L_Cluster() {
  const { palette: C } = useIlloStyle();
  const r = 22, circ = 2 * Math.PI * r;
  const arcLen = circ * (220/360), gapLen = circ - arcLen, ofs = -(gapLen/2);
  const speedArc = arcLen * 0.60; // 72 km/h of 120 max
  const battArc  = arcLen * 0.74;
  const da = (fill) => `${fill.toFixed(1)} ${(circ-fill).toFixed(1)}`;
  const daFull = `${arcLen.toFixed(1)} ${gapLen.toFixed(1)}`;
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      {/* Left speed gauge */}
      <circle cx="26" cy="68" r={r} fill={C.white} stroke={C.border} strokeWidth="1"/>
      <circle cx="26" cy="68" r={r} fill="none" stroke={C.panel} strokeWidth="5" strokeDasharray={daFull} strokeDashoffset={ofs} strokeLinecap="round"/>
      <circle cx="26" cy="68" r={r} fill="none" stroke={C.dark} strokeWidth="5" strokeDasharray={da(speedArc)} strokeDashoffset={ofs} strokeLinecap="round"/>
      <text x="26" y="72" textAnchor="middle" fill={C.dark} style={{fontSize:12,fontWeight:800,fontFamily:'system-ui'}}>72</text>
      <text x="26" y="81" textAnchor="middle" fill={C.mid} style={{fontSize:5,fontFamily:'system-ui'}}>km/h</text>
      {/* Centre panel — all content clipped to rounded rect */}
      <clipPath id="lv-lc-cp"><rect x="54" y="8" width="92" height="114" rx="8"/></clipPath>
      <rect x="54" y="8" width="92" height="114" rx="8" fill={C.white} stroke={C.border} strokeWidth="1"/>
      <g clipPath="url(#lv-lc-cp)">
        <DW x={54} y={8} w={92} h={50} op={0.25}/>
        <path d="M54 42 Q82 28 100 36 T146 26" stroke={C.mid} strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
        <circle cx="100" cy="35" r="3" fill={C.navy}/><circle cx="100" cy="35" r="1.5" fill={C.white}/>
        {/* NIP band */}
        <rect x="54" y="58" width="92" height="22" fill={C.dark}/>
        <NA cx="66" cy="69" size={12} color={C.white}/>
        <text x="80" y="65" fill={C.white} style={{fontSize:7,fontWeight:700,fontFamily:'system-ui'}}>600 m</text>
        <text x="80" y="76" fill={C.soft} style={{fontSize:5.5,fontFamily:'system-ui'}}>Canary Wharf</text>
        {/* Lane guidance band */}
        <rect x="54" y="80" width="92" height="18" fill={C.panel}/>
        {[0,0,0,0,1,1].map((on,i) => (
          <path key={i} d={`M${63+i*12} 93 L${63+i*12} 86 M${60+i*12} 89 L${63+i*12} 86 L${66+i*12} 89`}
            stroke={on?C.white:C.soft} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={on?1:0.35}/>
        ))}
        {/* Time / ETA band */}
        <rect x="54" y="98" width="92" height="24" fill={C.dark}/>
        <text x="60" y="113" fill={C.white} style={{fontSize:7,fontWeight:700,fontFamily:'system-ui'}}>10:59 PM</text>
        <text x="109" y="113" fill={C.soft} style={{fontSize:7,fontFamily:'system-ui'}}>· 26.5 km</text>
      </g>
      {/* Right battery gauge — cx=174 within 200px viewBox */}
      <circle cx="174" cy="68" r={r} fill={C.white} stroke={C.border} strokeWidth="1"/>
      <circle cx="174" cy="68" r={r} fill="none" stroke={C.panel} strokeWidth="5" strokeDasharray={daFull} strokeDashoffset={ofs} strokeLinecap="round"/>
      <circle cx="174" cy="68" r={r} fill="none" stroke={C.accent ?? '#22c55e'} strokeWidth="5" strokeDasharray={da(battArc)} strokeDashoffset={ofs} strokeLinecap="round"/>
      <text x="174" y="71" textAnchor="middle" fill={C.accent ?? '#22c55e'} style={{fontSize:9,fontWeight:800,fontFamily:'system-ui'}}>74%</text>
      <text x="174" y="79" textAnchor="middle" fill={C.mid} style={{fontSize:4.5,fontFamily:'system-ui'}}>BATT</text>
    </svg>
  );
}

export function L_MapStyle() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <clipPath id="lv-lms-day"><rect x="0" y="0" width="99" height="130"/></clipPath>
      <g clipPath="url(#lv-lms-day)">
        {/* Dark-blue day map — palette-driven so it adapts to theme */}
        <rect width="99" height="130" fill={C.dark}/>
        <path d="M0 70 Q50 58 100 70" stroke={C.soft} strokeWidth="6"/>
        <path d="M50 0 L50 130" stroke={C.border} strokeWidth="4"/>
        <rect x="8" y="20" width="30" height="20" rx="3" fill={C.soft}/>
        <rect x="55" y="30" width="18" height="16" rx="2" fill={C.soft}/>
        <path d="M10 55 Q50 44 100 55" stroke={C.mid} strokeWidth="2" opacity="0.7"/>
      </g>
      <clipPath id="lv-lms-night"><rect x="101" y="0" width="99" height="130"/></clipPath>
      <g clipPath="url(#lv-lms-night)">
        <rect x="101" y="0" width="99" height="130" fill={C.white}/>
        <DW x={101} y={0} w={99} h={130} op={0.4}/>
        <path d="M100 70 Q150 58 200 70" stroke={C.panel} strokeWidth="6"/>
        <path d="M150 0 L150 130" stroke={C.panel} strokeWidth="4"/>
        <rect x="108" y="20" width="30" height="20" rx="3" fill={C.panel}/>
        <rect x="155" y="30" width="18" height="16" rx="2" fill={C.panel}/>
        <path d="M100 55 Q150 44 200 55" stroke={C.mid} strokeWidth="2" opacity="0.7"/>
      </g>
      <line x1="100" y1="0" x2="100" y2="130" stroke={C.border} strokeWidth="1.5"/>
    </svg>
  );
}

export function L_HomeScreen() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <rect x="20" y="8" width="160" height="114" rx="12" fill={C.white} stroke={C.border} strokeWidth="1.5"/>
      <clipPath id="lv-lhs-map"><rect x="20" y="8" width="160" height="114" rx="12"/></clipPath>
      <g clipPath="url(#lv-lhs-map)">
        <DW x={20} y={8} w={160} h={114} op={0.3}/>
        {/* Route path to show active navigation context */}
        <path d="M20 78 Q60 55 100 70 T180 62" stroke={C.mid} strokeWidth="2.5" strokeLinecap="round" opacity="0.65"/>
        <circle cx="100" cy="69" r="4" fill={C.navy}/><circle cx="100" cy="69" r="2" fill={C.white}/>
      </g>
      {/* Zone boundaries — palette-mapped so blueprint shows all-blue */}
      <rect x="28" y="14" width="144" height="100" rx="6" fill="none" stroke={C.warn ?? '#F59E0B'} strokeWidth="1.5" strokeDasharray="5 4" opacity="0.75"/>
      <rect x="38" y="22" width="110" height="72" rx="5" fill="none" stroke={C.border} strokeWidth="1.5" strokeDasharray="5 4" opacity="0.65"/>
      <rect x="38" y="100" width="110" height="18" rx="5" fill="none" stroke={C.danger ?? '#e2001a'} strokeWidth="1.5" strokeDasharray="5 4" opacity="0.6"/>
      {/* Control bar buttons */}
      {[0,1,2,3].map(i => <rect key={i} x={44+i*26} y="103" width="20" height="12" rx="6" fill={C.dark} opacity="0.7"/>)}
      {/* Legend */}
      {[['Nav area', C.warn ?? '#F59E0B'],['Safe area', C.border],['Controls', C.danger ?? '#e2001a']].map(([label,color],i) => (
        <g key={label} transform={`translate(152,${20+i*14})`}>
          <rect width="7" height="7" rx="2" fill={color} opacity="0.85"/>
          <text x="10" y="6" fill={C.navy} style={{fontSize:5.5,fontFamily:'system-ui',fontWeight:600}}>{label}</text>
        </g>
      ))}
    </svg>
  );
}

export function L_ETAPanel() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <rect x="10" y="8" width="180" height="82" rx="12" fill={C.white} stroke={C.border} strokeWidth="1.5"/>
      <clipPath id="lv-leta-map"><rect x="10" y="8" width="180" height="82" rx="12"/></clipPath>
      <g clipPath="url(#lv-leta-map)">
        <DW x={10} y={8} w={180} h={82} op={0.35}/>
        <path d="M30 72 Q90 42 110 55 T170 30" stroke={C.mid} strokeWidth="3.5" strokeLinecap="round" opacity="0.7"/>
        <circle cx="110" cy="55" r="7" fill={C.navy}/>
        <circle cx="110" cy="55" r="4" fill={C.white}/>
      </g>
      <rect x="10" y="94" width="180" height="32" rx="12" fill={C.dark}/>
      {[['14:32','ETA',62],['18 min','Remaining',103],['6.4 km','Distance',150]].map(([v,l,x]) => (
        <g key={l}>
          <text x={x} y="107" textAnchor="middle" fill={C.white} style={{fontSize:11,fontWeight:700,fontFamily:'system-ui'}}>{v}</text>
          <text x={x} y="119" textAnchor="middle" fill={C.soft} style={{fontSize:7,fontFamily:'system-ui'}}>{l}</text>
        </g>
      ))}
      <line x1="84" y1="98" x2="84" y2="122" stroke={C.mid} strokeWidth="1" opacity="0.4"/>
      <line x1="128" y1="98" x2="128" y2="122" stroke={C.mid} strokeWidth="1" opacity="0.4"/>
    </svg>
  );
}

export function L_ThemingTokens() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <LP x="40" y="10" w="120" h="11" color={C.navy}/>
      {[{from:'#e2001a',to:'#0066cc',isColor:true},{from:'4 dp',to:'12 dp',isColor:false},{from:'Roboto',to:'Inter',isColor:false}].map(({from,to,isColor},i) => (
        <g key={i}>
          {isColor ? (
            <>
              <rect x="12" y={36+i*28} width="40" height="18" rx="5" fill={from}/>
              <rect x="148" y={36+i*28} width="40" height="18" rx="5" fill={to}/>
            </>
          ) : (
            <>
              <rect x="12" y={36+i*28} width="40" height="18" rx="5" fill={C.panel} stroke={C.border} strokeWidth="1"/>
              <text x="32" y={48+i*28} textAnchor="middle" fill={C.navy} style={{fontSize:7,fontFamily:'monospace'}}>{from}</text>
              <rect x="148" y={36+i*28} width="40" height="18" rx="5" fill={C.panel} stroke={C.border} strokeWidth="1"/>
              <text x="168" y={48+i*28} textAnchor="middle" fill={C.mid} style={{fontSize:7,fontFamily:'monospace'}}>{to}</text>
            </>
          )}
          <LP x="60" y={40+i*28} w="70" h="10" color={C.panel}/>
          <text x="100" y={50+i*28} textAnchor="middle" fill={C.mid} style={{fontSize:10}}>→</text>
        </g>
      ))}
      <rect x="26" y="118" width="60" height="8" rx="4" fill="#e2001a"/>
      <text x="100" y="125" textAnchor="middle" fill={C.mid} style={{fontSize:10}}>→</text>
      <rect x="118" y="118" width="60" height="8" rx="4" fill={C.navy}/>
    </svg>
  );
}

export function L_ChargingSearch() {
  const { palette: C } = useIlloStyle();
  const operators = [['Ionity','350 kW','3/4'],['Fastned','300 kW','2/4'],['bp pulse','50 kW','5/6']];
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      {/* Header */}
      <text x="10" y="20" fill={C.navy} style={{fontSize:10,fontWeight:700,fontFamily:'system-ui'}}>EV Charging</text>
      <text x="10" y="31" fill={C.accent ?? '#22c55e'} style={{fontSize:6,fontFamily:'system-ui'}}>Near you · Connector matched</text>
      {/* Filter tabs */}
      {[['⚡ Speed',true],['💳 Payment',false],['🍴 Services',false]].map(([label,active],i) => (
        <g key={label}>
          <rect x={10+i*62} y="36" width="56" height="14" rx="4" fill={active?C.mid:C.panel} stroke={active?C.mid:C.border} strokeWidth="1"/>
          <text x={38+i*62} y="46" textAnchor="middle" fill={active?C.white:C.soft} style={{fontSize:6,fontFamily:'system-ui',fontWeight:active?700:400}}>{label}</text>
        </g>
      ))}
      {/* Operator rows */}
      {operators.map(([name,kw,avail],i) => (
        <g key={name}>
          {i>0 && <line x1="10" y1={56+i*24} x2="190" y2={56+i*24} stroke={C.panel} strokeWidth="1"/>}
          <circle cx="24" cy={67+i*24} r="9" fill={C.accent ?? '#22c55e'}/>
          <text x="24" y={71+i*24} textAnchor="middle" fill={C.white} style={{fontSize:8,fontWeight:700,fontFamily:'system-ui'}}>{i+1}</text>
          <text x="40" y={64+i*24} fill={C.navy} style={{fontSize:8,fontWeight:700,fontFamily:'system-ui'}}>{name}</text>
          <text x="40" y={74+i*24} fill={C.soft} style={{fontSize:6,fontFamily:'system-ui'}}>⚡ {kw}</text>
          <text x="190" y={71+i*24} textAnchor="end" fill={C.accent ?? '#22c55e'} style={{fontSize:8,fontWeight:700,fontFamily:'system-ui'}}>{avail}</text>
        </g>
      ))}
    </svg>
  );
}

export function L_ConversationPersonality() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <LP x="40" y="8" w="120" h="11" color={C.navy}/>
      {/* Formal tone bubble */}
      <rect x="10" y="26" width="148" height="40" rx="12" fill={C.panel}/>
      <rect x="16" y="30" width="32" height="10" rx="5" fill={C.mid} opacity="0.5"/>
      <text x="32" y="38" textAnchor="middle" fill={C.white} style={{fontSize:5.5,fontFamily:'system-ui',fontWeight:600}}>formal</text>
      <text x="22" y="52" fill={C.navy} style={{fontSize:6,fontFamily:'system-ui'}}>"Please recalculate the route."</text>
      <text x="22" y="62" fill={C.pill2} style={{fontSize:5.5,fontFamily:'system-ui',fontStyle:'italic'}}>structured · neutral</text>
      {/* Casual tone bubble */}
      <rect x="42" y="76" width="148" height="42" rx="12" fill={C.dark}/>
      <rect x="48" y="80" width="28" height="10" rx="5" fill={C.accent ?? '#22c55e'} opacity="0.5"/>
      <text x="62" y="88" textAnchor="middle" fill={C.white} style={{fontSize:5.5,fontFamily:'system-ui',fontWeight:600}}>casual</text>
      <text x="54" y="102" fill={C.white} style={{fontSize:6,fontFamily:'system-ui'}}>"Hey! Shortcut ahead — take it!"</text>
      <text x="54" y="113" fill={C.soft} style={{fontSize:5.5,fontFamily:'system-ui',fontStyle:'italic'}}>friendly · concise</text>
    </svg>
  );
}

export function L_ADAS() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      {/* Road surface — C.soft reads darker/more neutral than C.panel */}
      <path d="M40 130 L90 58 L110 58 L160 130 Z" fill={C.soft} opacity="0.55"/>
      {/* Lane centre dashes */}
      {[90,95,100,105,110].map((x,i) => (
        <line key={i} x1={x} y1={60} x2={40+(x-90)/(110-90)*120+8} y2={128} stroke={C.white} strokeWidth="1.5" strokeDasharray="6 5" opacity="0.45"/>
      ))}
      {/* Road edge lines */}
      <line x1="55" y1="58" x2="145" y2="58" stroke={C.border} strokeWidth="1.5" opacity="0.8"/>
      {/* Hazard warning icon (triangle) — no emoji */}
      <g transform="translate(85,72)">
        <polygon points="0,-8 7,5 -7,5" fill={C.warn ?? '#fbbf24'} stroke={C.white} strokeWidth="1"/>
        <line x1="0" y1="-3" x2="0" y2="2" stroke={C.bg} strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="0" cy="4" r="0.8" fill={C.bg}/>
      </g>
      {/* Fuel/POI icon (circle with dot) */}
      <circle cx="115" cy="66" r="8" fill={C.mid}/>
      <circle cx="115" cy="64" r="2.5" fill={C.white} opacity="0.9"/>
      <rect x="112" y="66" width="6" height="4" rx="1" fill={C.white} opacity="0.9"/>
      {/* Speedometer */}
      <circle cx="38" cy="32" r="20" fill={C.white} stroke={C.dark} strokeWidth="2.5"/>
      <circle cx="38" cy="32" r="15" fill={C.white} stroke={C.danger ?? '#e2001a'} strokeWidth="1.5"/>
      <text x="38" y="37" textAnchor="middle" fill={C.dark} style={{fontSize:12,fontWeight:800,fontFamily:'system-ui'}}>80</text>
      {/* Vehicle nav arrows */}
      {[false,false,true,true,false].map((active,i) => (
        <g key={i} transform={`translate(${85+i*18},100)`}>
          <rect x="-6" y="4" width="12" height="16" rx="2" fill={active?C.dark:C.panel} stroke={active?C.mid:C.soft} strokeWidth="1"/>
          <polygon points="0,-2 6,5 4,5 4,4 -4,4 -4,5 -6,5" fill={active?C.dark:C.panel}/>
        </g>
      ))}
      {/* Distance HUD badge */}
      <rect x="148" y="20" width="46" height="26" rx="8" fill={C.dark}/>
      <text x="171" y="31" textAnchor="middle" fill={C.white} style={{fontSize:8,fontFamily:'system-ui'}}>600 m</text>
      <text x="171" y="41" textAnchor="middle" fill={C.soft} style={{fontSize:7,fontFamily:'system-ui'}}>Lane chg</text>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   Maps & Navigation SDK
   ══════════════════════════════════════════════════════════════════════════════ */

export function L_MapDisplay() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.white}/>
      <DW x={0} y={0} w={200} h={130} op={0.4}/>
      <path d="M0 65 Q60 55 100 65 T200 60" stroke={C.panel} strokeWidth="6" strokeLinecap="round"/>
      <path d="M70 0 L68 130" stroke={C.panel} strokeWidth="4"/>
      <path d="M140 0 L136 130" stroke={C.panel} strokeWidth="4"/>
      <path d="M20 100 Q60 72 100 65 T175 42" stroke={C.mid} strokeWidth="3" strokeLinecap="round" opacity="0.85"/>
      <path d="M20 100 Q60 72 100 65 T175 42" stroke={C.soft} strokeWidth="10" strokeLinecap="round" opacity="0.25"/>
      <circle cx="100" cy="65" r="7" fill={C.navy}/>
      <circle cx="100" cy="65" r="4" fill={C.white}/>
      <circle cx="68" cy="45" r="4" fill="#5B8AC5" opacity="0.9"/>
      <circle cx="140" cy="70" r="4" fill={C.accent ?? '#22c55e'} opacity="0.9"/>
      <rect x="8" y="8" width="60" height="20" rx="6" fill={C.dark}/>
      <LP x="16" y="13" w="44" h="9" color={C.white}/>
    </svg>
  );
}

export function L_SDKSearch() {
  const { palette: C } = useIlloStyle();
  // Rows: height=24, gap=5 → spacing=29. Three rows: y=38,67,96 (ends 62,91,120). Bottom margin 10px.
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      {/* Search bar */}
      <rect x="10" y="8" width="180" height="22" rx="8" fill={C.white} stroke={C.border} strokeWidth="1.5"/>
      <circle cx="22" cy="19" r="5" fill={C.panel}/>
      <LP x="33" y="14" w="106" h="10" color={C.panel}/>
      {['Amsterdam Centraal','Rijksmuseum','Vondelpark'].map((name,i) => (
        <g key={name}>
          <rect x="10" y={38+i*29} width="180" height="24" rx="6"
            fill={C.panel} stroke={i===0?C.mid:C.border} strokeWidth={i===0?1.5:1}/>
          {/* Icon tile — same size all rows, fill differentiates active */}
          <rect x="18" y={44+i*29} width="12" height="12" rx="3" fill={C.soft}/>
          {/* Title LP — vertically centred in top half */}
          <LP x="36" y={44+i*29} w="92" h="9" color={C.navy}/>
          {/* Subtitle LP — vertically centred in bottom half */}
          <LP x="36" y={56+i*29} w="56" h="7" color={C.pill2}/>
        </g>
      ))}
    </svg>
  );
}

export function L_RouteOptions() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      {/* Title + subtitle (e.g. "Route Options" / "Amsterdam → Berlin · 3 results") */}
      <LP x="10" y="8" w="82" h="11" color={C.navy}/>
      <LP x="10" y="22" w="118" h="8" color={C.soft}/>
      {/* Row 1 — selected/recommended: bold time, distance, filled badge */}
      <rect x="10" y="34" width="180" height="30" rx="8" fill={C.panel} stroke={C.mid} strokeWidth="1.5"/>
      <LP x="18" y="40" w="62" h="11" color={C.navy}/>
      <LP x="18" y="54" w="40" h="7" color={C.soft}/>
      <rect x="138" y="40" width="46" height="16" rx="8" fill={C.mid}/>
      <LP x="144" y="45" w="34" h="8" color={C.white}/>
      {/* Row 2 — alternative: same structure, outlined badge */}
      <rect x="10" y="68" width="180" height="30" rx="8" fill={C.panel} stroke={C.border} strokeWidth="1"/>
      <LP x="18" y="74" w="62" h="11" color={C.navy}/>
      <LP x="18" y="88" w="40" h="7" color={C.soft}/>
      <rect x="138" y="74" width="46" height="16" rx="8" fill="none" stroke={C.mid} strokeWidth="1.5"/>
      <LP x="144" y="79" w="34" h="8" color={C.mid}/>
      {/* Row 3 — partial hint, implies more options */}
      <rect x="10" y="102" width="180" height="24" rx="8" fill={C.panel} stroke={C.border} strokeWidth="1"/>
      <LP x="18" y="108" w="56" h="10" color={C.navy}/>
    </svg>
  );
}

export function L_NavGuidance() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      {/* Map card — full width, bottom portion visible below NIP */}
      <rect x="8" y="8" width="184" height="84" rx="12" fill={C.white} stroke={C.border} strokeWidth="1.5"/>
      <clipPath id="lv-lng-map"><rect x="8" y="8" width="184" height="84" rx="12"/></clipPath>
      <g clipPath="url(#lv-lng-map)">
        <DW x={8} y={8} w={184} h={84} op={0.3}/>
        <path d="M20 76 Q80 52 125 60 T192 42" stroke={C.mid} strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>
        <circle cx="125" cy="60" r="5" fill={C.navy}/>
        <circle cx="125" cy="60" r="2.5" fill={C.white}/>
      </g>
      {/* NIP — full-width turn instruction, zoomed in */}
      <rect x="8" y="12" width="184" height="52" rx="10" fill={C.dark}/>
      {/* Arrow icon badge */}
      <rect x="18" y="20" width="34" height="34" rx="8" fill={C.white} opacity="0.12"/>
      {/* Turn-right arrow: vertical stem + horizontal arm + arrowhead */}
      <path d="M27,49 L27,30 L35,30 L35,25 L46,36 L35,47 L35,42 L31,42 L31,49 Z" fill={C.white}/>
      {/* Instruction text */}
      <text x="62" y="34" fill={C.white} style={{fontSize:11,fontWeight:700,fontFamily:'system-ui,sans-serif'}}>Turn right</text>
      <text x="62" y="50" fill={C.soft} style={{fontSize:7.5,fontFamily:'system-ui,sans-serif'}}>onto Main St · 320 m</text>
      {/* Stats band */}
      <rect x="8" y="98" width="184" height="26" rx="10" fill={C.dark}/>
      {[['14:32','ETA',47],['22 min','Time',100],['8.4 km','Dist',153]].map(([v,l,x]) => (
        <g key={l}>
          <text x={x} y="109" textAnchor="middle" fill={C.white} style={{fontSize:9,fontWeight:700,fontFamily:'system-ui,sans-serif'}}>{v}</text>
          <text x={x} y="119" textAnchor="middle" fill={C.soft} style={{fontSize:6.5,fontFamily:'system-ui,sans-serif'}}>{l}</text>
        </g>
      ))}
    </svg>
  );
}

export function L_OfflineMaps() {
  const { palette: C } = useIlloStyle();
  const regions = [['Western Europe','1.2 GB',100],['Eastern Europe','0.8 GB',65],['North America','2.1 GB',30]];
  const barColor = [C.accent ?? '#22c55e', C.mid, C.pill2];
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      {/* Header */}
      <circle cx="14" cy="16" r="6" fill={C.accent ?? '#22c55e'}/>
      <text x="26" y="20" fill={C.navy} style={{fontSize:10,fontWeight:700,fontFamily:'system-ui'}}>Offline Maps</text>
      <text x="190" y="20" textAnchor="end" fill={C.accent ?? '#22c55e'} style={{fontSize:7,fontWeight:600,fontFamily:'system-ui'}}>Active</text>
      {/* Region rows */}
      {regions.map(([name,size,pct],i) => (
        <g key={name}>
          <text x="10" y={40+i*32} fill={C.navy} style={{fontSize:8,fontWeight:600,fontFamily:'system-ui'}}>{name}</text>
          <text x="190" y={40+i*32} textAnchor="end" fill={C.soft} style={{fontSize:7,fontFamily:'system-ui'}}>{size}</text>
          <rect x="10" y={44+i*32} width="180" height="6" rx="3" fill={C.panel}/>
          <rect x="10" y={44+i*32} width={180*pct/100} height="6" rx="3" fill={barColor[i]}/>
        </g>
      ))}
    </svg>
  );
}

export function L_CarPlay() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <rect x="10" y="8" width="180" height="82" rx="12" fill={C.white} stroke={C.border} strokeWidth="1.5"/>
      <clipPath id="lv-lcp-map"><rect x="10" y="8" width="180" height="82" rx="12"/></clipPath>
      <g clipPath="url(#lv-lcp-map)">
        <DW x={10} y={8} w={180} h={82} op={0.35}/>
        <path d="M25 72 Q80 48 120 55 T185 35" stroke={C.mid} strokeWidth="3" strokeLinecap="round" opacity="0.7"/>
        <circle cx="120" cy="55" r="5" fill={C.navy}/>
      </g>
      <rect x="10" y="10" width="100" height="22" rx="7" fill={C.dark}/>
      <LP x="20" y="15" w="60" h="9" color={C.white}/>
      <rect x="120" y="10" width="22" height="22" rx="7" fill={C.accent ?? '#22c55e'}/>
      <text x="131" y="24" textAnchor="middle" fill={C.white} style={{fontSize:8,fontWeight:700,fontFamily:'system-ui'}}>🍎</text>
      <rect x="10" y="94" width="180" height="28" rx="12" fill={C.dark}/>
      {[['14:32','ETA',62],['18 min','Time',103],['6.4 km','Dist',150]].map(([v,l,x]) => (
        <g key={l}>
          <text x={x} y="106" textAnchor="middle" fill={C.white} style={{fontSize:10,fontWeight:700,fontFamily:'system-ui'}}>{v}</text>
          <text x={x} y="116" textAnchor="middle" fill={C.soft} style={{fontSize:7,fontFamily:'system-ui'}}>{l}</text>
        </g>
      ))}
    </svg>
  );
}

export function L_VirtualHorizon() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      {/* Road — darker fill reads as tarmac */}
      <path d="M30 130 L85 55 L115 55 L170 130 Z" fill={C.soft} opacity="0.55"/>
      <clipPath id="lv-lvh-road"><path d="M30 130 L85 55 L115 55 L170 130 Z"/></clipPath>
      {/* Lane dashes */}
      {[88,95,100,105,112].map((x,i) => (
        <line key={i} x1={x} y1={57} x2={30+(x-88)/(112-88)*140+6} y2={128} stroke={C.white} strokeWidth="1.5" strokeDasharray="6 5" opacity="0.4"/>
      ))}
      <line x1="50" y1="55" x2="150" y2="55" stroke={C.border} strokeWidth="1.5" opacity="0.8"/>
      {/* Roadwork hazard — SVG diamond/warning shape */}
      <g transform="translate(88,68)">
        <polygon points="0,-8 7,5 -7,5" fill={C.warn ?? '#fbbf24'} stroke={C.white} strokeWidth="1"/>
        <line x1="0" y1="-3" x2="0" y2="2" stroke={C.bg} strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="0" cy="4" r="0.8" fill={C.bg}/>
      </g>
      {/* Sharp curve warning — circle with exclamation */}
      <circle cx="112" cy="62" r="8" fill={C.danger ?? '#ef4444'}/>
      <line x1="112" y1="57" x2="112" y2="62" stroke={C.white} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="112" cy="65" r="1" fill={C.white}/>
      {/* Station POI */}
      <circle cx="100" cy="58" r="6" fill={C.mid}/>
      <circle cx="100" cy="56.5" r="2" fill={C.white} opacity="0.9"/>
      <rect x="97.5" y="58.5" width="5" height="3.5" rx="0.8" fill={C.white} opacity="0.9"/>
      {/* Legend badges on right */}
      {[[C.warn ?? '#fbbf24','Roadwork'],[C.danger ?? '#ef4444','Sharp curve'],[C.soft,'Station 800m']].map(([col,label],i) => (
        <g key={label}>
          <rect x="122" y={18+i*18} width="68" height="14" rx="7" fill={C.dark} opacity="0.9"/>
          <circle cx="131" cy={25+i*18} r="4" fill={col}/>
          <text x="138" y={29+i*18} fill={C.white} style={{fontSize:5.5,fontFamily:'system-ui'}}>{label}</text>
        </g>
      ))}
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   Routing API
   ══════════════════════════════════════════════════════════════════════════════ */

export function L_CalculateRoute() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <rect x="10" y="8" width="180" height="84" rx="12" fill={C.white} stroke={C.border} strokeWidth="1.5"/>
      <clipPath id="lv-lcr-map"><rect x="10" y="8" width="180" height="84" rx="12"/></clipPath>
      <g clipPath="url(#lv-lcr-map)">
        <DW x={10} y={8} w={180} h={84} op={0.35}/>
        <path d="M28 80 Q70 52 105 50 T178 28" stroke={C.mid} strokeWidth="3.5" strokeLinecap="round" opacity="0.8"/>
        <path d="M28 80 Q70 52 105 50 T178 28" stroke={C.soft} strokeWidth="10" strokeLinecap="round" opacity="0.25"/>
        <circle cx="28" cy="80" r="8" fill={C.accent ?? '#22c55e'}/>
        <text x="28" y="84" textAnchor="middle" fill={C.white} style={{fontSize:7,fontWeight:700,fontFamily:'system-ui'}}>A</text>
        <circle cx="178" cy="28" r="8" fill={C.dark}/>
        <text x="178" y="32" textAnchor="middle" fill={C.white} style={{fontSize:7,fontWeight:700,fontFamily:'system-ui'}}>B</text>
      </g>
      <rect x="10" y="96" width="180" height="26" rx="10" fill={C.dark}/>
      {[['2h 14m','Time',60],['189 km','Distance',100],['14:32','ETA',148]].map(([v,l,x]) => (
        <g key={l}>
          <text x={x} y="107" textAnchor="middle" fill={C.white} style={{fontSize:9,fontWeight:700,fontFamily:'system-ui'}}>{v}</text>
          <text x={x} y="117" textAnchor="middle" fill={C.soft} style={{fontSize:7,fontFamily:'system-ui'}}>{l}</text>
        </g>
      ))}
    </svg>
  );
}

export function L_ReachableRange() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.white}/>
      <DW x={0} y={0} w={200} h={130} op={0.35}/>
      <path d="M100 28 Q138 26 155 48 Q168 70 155 92 Q138 110 100 113 Q62 110 45 92 Q32 70 45 48 Q62 26 100 28 Z" fill={C.soft} opacity="0.2" stroke={C.mid} strokeWidth="1.5"/>
      <path d="M100 44 Q122 42 133 60 Q142 78 133 94 Q122 106 100 108 Q78 106 67 94 Q58 78 67 60 Q78 42 100 44 Z" fill={C.soft} opacity="0.15" stroke={C.mid} strokeWidth="1"/>
      <circle cx="100" cy="65" r="8" fill={C.navy}/>
      <circle cx="100" cy="65" r="5" fill={C.white}/>
      <rect x="128" y="10" width="64" height="28" rx="8" fill={C.dark}/>
      <text x="160" y="22" textAnchor="middle" fill={C.white} style={{fontSize:9,fontWeight:700,fontFamily:'system-ui'}}>30 min range</text>
      <text x="160" y="33" textAnchor="middle" fill={C.soft} style={{fontSize:7,fontFamily:'system-ui'}}>~27 km radius</text>
    </svg>
  );
}

export function L_EVRouting() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <rect x="10" y="8" width="180" height="76" rx="12" fill={C.white} stroke={C.border} strokeWidth="1.5"/>
      <clipPath id="lv-levr-map"><rect x="10" y="8" width="180" height="76" rx="12"/></clipPath>
      <g clipPath="url(#lv-levr-map)">
        <DW x={10} y={8} w={180} h={76} op={0.35}/>
        <path d="M22 72 Q60 50 90 44 Q115 38 142 32 T182 20" stroke={C.mid} strokeWidth="3" strokeLinecap="round" opacity="0.8"/>
        {[[90,44],[142,32]].map(([cx,cy],i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="9" fill={C.white} stroke={C.accent ?? '#22c55e'} strokeWidth="2"/>
            <text x={cx} y={cy+4} textAnchor="middle" fill={C.accent ?? '#22c55e'} style={{fontSize:8}}>⚡</text>
          </g>
        ))}
        <circle cx="22" cy="72" r="5" fill={C.accent ?? '#22c55e'}/>
        <circle cx="182" cy="20" r="5" fill={C.navy}/>
      </g>
      <rect x="10" y="88" width="180" height="32" rx="10" fill={C.dark}/>
      <LP x="18" y="96" w="55" h="9" color={C.soft}/>
      <rect x="18" y="108" width="164" height="6" rx="3" fill="rgba(255,255,255,0.2)"/>
      <rect x="18" y="108" width="128" height="6" rx="3" fill={C.accent ?? '#22c55e'}/>
      <text x="170" y="114" textAnchor="middle" fill={C.white} style={{fontSize:8,fontWeight:700,fontFamily:'system-ui'}}>78%</text>
    </svg>
  );
}

export function L_BatchRouting() {
  const { palette: C } = useIlloStyle();
  // Shows multiple parallel route calculations — each row = one request
  const routes = [
    {time:'52 min',dist:'48 km',pct:72},
    {time:'1h 04m',dist:'51 km',pct:88},
    {time:'58 min',dist:'45 km',pct:60},
    {time:'47 min',dist:'62 km',pct:95},
  ];
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      {/* Header */}
      <LP x="30" y="8" w="100" h="9" color={C.navy}/>
      <rect x="152" y="6" width="38" height="13" rx="6" fill={C.dark}/>
      <text x="171" y="16" textAnchor="middle" fill={C.mid} style={{fontSize:6,fontFamily:'monospace'}}>batch</text>
      {routes.map(({time,dist,pct},i) => (
        <g key={i}>
          {/* Route number badge */}
          <circle cx="16" cy={33+i*23} r="7" fill={C.mid} opacity="0.3"/>
          <text x="16" y={37+i*23} textAnchor="middle" fill={C.navy} style={{fontSize:6.5,fontWeight:700,fontFamily:'system-ui'}}>{i+1}</text>
          {/* Mini route line visual */}
          <line x1="28" y1={33+i*23} x2="48" y2={33+i*23} stroke={C.mid} strokeWidth="2" strokeDasharray="3 2" opacity="0.6"/>
          {/* Time label */}
          <text x="52" y={37+i*23} fill={C.navy} style={{fontSize:7,fontWeight:600,fontFamily:'system-ui'}}>{time}</text>
          {/* Distance */}
          <text x="95" y={37+i*23} fill={C.soft} style={{fontSize:6,fontFamily:'system-ui'}}>{dist}</text>
          {/* Completion bar */}
          <rect x="128" y={29+i*23} width="52" height="7" rx="3.5" fill={C.panel}/>
          <rect x="128" y={29+i*23} width={52*pct/100} height="7" rx="3.5" fill={pct>80?C.mid:C.soft} opacity="0.9"/>
        </g>
      ))}
      <circle cx="10" cy="125" r="4" fill={C.accent ?? '#22c55e'}/>
      <text x="18" y="129" fill={C.mid} style={{fontSize:5.5,fontFamily:'system-ui'}}>4 routes calculated</text>
    </svg>
  );
}

export function L_MatrixRouting() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <LP x="30" y="8" w="140" h="11" color={C.navy}/>
      {Array.from({length:4}).map((_,row) => (
        Array.from({length:4}).map((_,col) => {
          const val = ((row*3+col*7)%90)+15;
          const intensity = val/100;
          return (
            <g key={`${row}-${col}`}>
              <rect x={30+col*38} y={28+row*22} width="34" height="18" rx="4"
                fill={C.mid} opacity={intensity*0.65+0.15}/>
              <text x={47+col*38} y={40+row*22} textAnchor="middle" fill={C.white}
                style={{fontSize:7,fontWeight:700,fontFamily:'system-ui'}}>{val}m</text>
            </g>
          );
        })
      ))}
    </svg>
  );
}

export function L_WaypointOpt() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <LP x="60" y="6" w="80" h="11" color={C.navy}/>
      <line x1="100" y1="20" x2="100" y2="126" stroke={C.panel} strokeWidth="1.5"/>
      <LP x="12" y="20" w="40" h="9" color={C.soft}/>
      <LP x="108" y="20" w="40" h="9" color={C.accent ?? '#22c55e'}/>
      {[[10,28],[60,42],[16,64],[54,82],[30,52]].map(([x,y],i) => (
        <circle key={i} cx={x+14} cy={y} r="6" fill={C.panel} stroke={C.mid} strokeWidth="1.5"/>
      ))}
      <polyline points="24,28 74,42 30,64 68,82 44,52" fill="none" stroke={C.soft} strokeWidth="1.5" strokeDasharray="4 3"/>
      {[[10,28],[30,52],[16,64],[54,82],[60,42]].map(([x,y],i) => (
        <g key={i}>
          <circle cx={x+108} cy={y} r="6" fill={C.accent ?? '#22c55e'}/>
          <text x={x+108} y={y+3} textAnchor="middle" fill={C.white} style={{fontSize:6,fontWeight:700,fontFamily:'system-ui'}}>{i+1}</text>
        </g>
      ))}
      <polyline points="118,28 138,52 124,64 162,82 168,42" fill="none" stroke={C.accent ?? '#22c55e'} strokeWidth="1.5" opacity="0.8"/>
      <LP x="50" y="118" w="100" h="10" color={C.navy}/>
    </svg>
  );
}

export function L_TurnInstructions() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <rect x="10" y="8" width="180" height="56" rx="10" fill={C.white} stroke={C.border} strokeWidth="1.5"/>
      <clipPath id="lv-lti-map"><rect x="10" y="8" width="180" height="56" rx="10"/></clipPath>
      <g clipPath="url(#lv-lti-map)">
        <DW x={10} y={8} w={180} h={56} op={0.3}/>
        <path d="M20 52 Q70 35 100 28 T175 18" stroke={C.mid} strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
        <circle cx="100" cy="28" r="7" fill={C.white} stroke={C.mid} strokeWidth="2"/>
        <path d="M100 28 L100 18 M96 22 L100 18 L104 22" stroke={C.mid} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="20" cy="52" r="5" fill={C.accent ?? '#22c55e'}/>
        <circle cx="175" cy="18" r="5" fill={C.navy}/>
      </g>
      <rect x="10" y="74" width="180" height="32" rx="10" fill={C.panel}/>
      <LP x="20" y="80" w="55" h="10" color={C.mid}/>
      <LP x="20" y="94" w="130" h="9" color={C.navy}/>
      <rect x="10" y="110" width="180" height="16" rx="8" fill={C.white} stroke={C.border} strokeWidth="1"/>
      {['coded','text','tagged'].map((t,i) => (
        <g key={t}>
          <rect x={20+i*55} y="113" width="36" height="10" rx="5" fill={C.panel}/>
          <text x={38+i*55} y="120" textAnchor="middle" fill={C.mid} style={{fontSize:6,fontFamily:'monospace'}}>{t}</text>
        </g>
      ))}
    </svg>
  );
}

export function L_RoadShields() {
  const { palette: C } = useIlloStyle();
  const shields = [{ref:'A10',bg:'#1d4ed8'},{ref:'E35',bg:'#22c55e'},{ref:'N7',bg:'#e2001a'},{ref:'B14',bg:'#f59e0b'}];
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <LP x="30" y="8" w="140" h="11" color={C.navy}/>
      {shields.map(({ref,bg},i) => (
        <g key={ref}>
          <rect x={20+i*44} y="28" width="36" height="24" rx="6" fill={bg}/>
          <text x={38+i*44} y="44" textAnchor="middle" fill={C.white} style={{fontSize:9,fontWeight:700,fontFamily:'monospace'}}>{ref}</text>
        </g>
      ))}
      <rect x="10" y="68" width="180" height="26" rx="8" fill={C.white} stroke={C.border} strokeWidth="1.5"/>
      <LP x="20" y="74" w="50" h="10" color={C.panel}/>
      <rect x="74" y="72" width="30" height="18" rx="4" fill="#1d4ed8"/>
      <text x="89" y="84" textAnchor="middle" fill={C.white} style={{fontSize:8,fontWeight:700,fontFamily:'monospace'}}>A10</text>
      <LP x="110" y="74" w="70" h="10" color={C.panel}/>
      <rect x="10" y="100" width="180" height="24" rx="8" fill={C.panel}/>
      <LP x="20" y="107" w="160" h="10" color={C.mid}/>
    </svg>
  );
}

export function L_LaneGuidance() {
  const { palette: C } = useIlloStyle();
  const lanes = [
    {dirs:['←'],drivable:false},{dirs:['↑'],drivable:false},
    {dirs:['↑','→'],drivable:true},{dirs:['→'],drivable:true,recommended:true},
  ];
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <LP x="30" y="8" w="140" h="11" color={C.navy}/>
      {lanes.map((lane,i) => (
        <g key={i}>
          <rect x={22+i*42} y="30" width="36" height={lane.dirs.length>1?40:34} rx="8"
            fill={lane.recommended?C.warn ? `rgba(${parseInt(C.warn.slice(1,3),16)},${parseInt(C.warn.slice(3,5),16)},${parseInt(C.warn.slice(5,7),16)},0.15)` : 'rgba(234,179,8,0.15)':lane.drivable?C.panel:C.bg}
            stroke={lane.recommended?C.warn ? `rgba(${parseInt(C.warn.slice(1,3),16)},${parseInt(C.warn.slice(3,5),16)},${parseInt(C.warn.slice(5,7),16)},0.6)` : 'rgba(234,179,8,0.6)':C.border} strokeWidth={lane.recommended?1.5:1}
            opacity={lane.drivable||lane.recommended?1:0.35}/>
          {lane.dirs.map((d,j) => (
            <text key={d} x={40+i*42} y={50+j*16} textAnchor="middle"
              fill={lane.recommended?'#eab308':lane.drivable?C.navy:C.soft}
              style={{fontSize:14,lineHeight:1}}>{d}</text>
          ))}
        </g>
      ))}
      <LP x="22" y="90" w="60" h="10" color={C.panel}/>
      <text x="30" y="97" textAnchor="middle" fill="rgba(234,179,8,0.8)" style={{fontSize:7,fontWeight:600,fontFamily:'system-ui'}}>●</text>
      <LP x="40" y="90" w="40" h="10" color={C.panel}/>
      <LP x="110" y="90" w="60" h="10" color={C.panel}/>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   Long-Distance EV Routing
   ══════════════════════════════════════════════════════════════════════════════ */

export function L_LDEVRRoute() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <rect x="10" y="8" width="180" height="76" rx="12" fill={C.white} stroke={C.border} strokeWidth="1.5"/>
      <clipPath id="lv-lldr-map"><rect x="10" y="8" width="180" height="76" rx="12"/></clipPath>
      <g clipPath="url(#lv-lldr-map)">
        <DW x={10} y={8} w={180} h={76} op={0.35}/>
        <path d="M22 72 Q60 50 90 44 Q115 38 142 32 T182 20" stroke={C.mid} strokeWidth="3" strokeLinecap="round" opacity="0.8"/>
        {/* Larger, more prominent charge stop markers */}
        {[[90,44,'Stop 1'],[142,32,'Stop 2']].map(([cx,cy,label],i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="12" fill={C.dark} stroke={C.accent ?? '#22c55e'} strokeWidth="2.5"/>
            {/* Lightning bolt SVG path */}
            <path d={`M${cx-3} ${cy-6} L${cx-3} ${cy+1} L${cx+3} ${cy+1} L${cx+3} ${cy+8} L${cx+3} ${cy+1} L${cx+3} ${cy+1}`}
              stroke={C.accent ?? '#22c55e'} strokeWidth="0" fill={C.accent ?? '#22c55e'}/>
            <polygon points={`${cx-3},${cy-5} ${cx+4},${cy-1} ${cx},${cy-1} ${cx},${cy+5} ${cx-4},${cy+1} ${cx},${cy+1}`}
              fill={C.accent ?? '#22c55e'}/>
            <text x={cx} y={cy+22} textAnchor="middle" fill={C.accent ?? '#22c55e'} style={{fontSize:5.5,fontFamily:'system-ui',fontWeight:700}}>{label}</text>
          </g>
        ))}
        <circle cx="22" cy="72" r="6" fill={C.accent ?? '#22c55e'}/>
        <text x="22" y="76" textAnchor="middle" fill={C.white} style={{fontSize:6,fontWeight:700,fontFamily:'system-ui'}}>A</text>
        <circle cx="182" cy="20" r="6" fill={C.dark} stroke={C.mid} strokeWidth="1.5"/>
        <text x="182" y="24" textAnchor="middle" fill={C.white} style={{fontSize:6,fontWeight:700,fontFamily:'system-ui'}}>B</text>
      </g>
      <rect x="10" y="88" width="180" height="32" rx="10" fill={C.dark}/>
      <text x="18" y="101" fill={C.white} style={{fontSize:7,fontWeight:600,fontFamily:'system-ui'}}>Range remaining</text>
      <text x="18" y="112" fill={C.soft} style={{fontSize:6,fontFamily:'system-ui'}}>78%</text>
      <rect x="40" y="107" width="132" height="8" rx="4" fill="rgba(255,255,255,0.15)"/>
      <rect x="40" y="107" width="103" height="8" rx="4" fill={C.accent ?? '#22c55e'}/>
    </svg>
  );
}

export function L_LDEVRBatch() {
  const { palette: C } = useIlloStyle();
  // Each row = one EV route with battery state at departure and arrival
  const evRoutes = [
    {id:'EV-1',start:82,arrive:38,col:C.accent ?? '#22c55e'},
    {id:'EV-2',start:67,arrive:15,col:C.warn ?? '#fbbf24'},
    {id:'EV-3',start:91,arrive:54,col:C.accent ?? '#22c55e'},
    {id:'EV-4',start:74,arrive:28,col:C.mid},
  ];
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      {/* Header */}
      <LP x="30" y="8" w="100" h="9" color={C.navy}/>
      <rect x="152" y="6" width="38" height="13" rx="6" fill={C.dark}/>
      <text x="171" y="16" textAnchor="middle" fill={C.accent ?? '#22c55e'} style={{fontSize:6,fontFamily:'monospace'}}>EV batch</text>
      {evRoutes.map(({id,start,arrive,col},i) => (
        <g key={id}>
          <text x="10" y={36+i*23} fill={C.navy} style={{fontSize:6,fontWeight:700,fontFamily:'system-ui'}}>{id}</text>
          {/* Departure battery (filled capsule) */}
          <rect x="30" y={27+i*23} width="54" height="12" rx="3" fill={C.panel} stroke={C.border} strokeWidth="1"/>
          <rect x="31" y={28+i*23} width={52*start/100} height="10" rx="2" fill={col} opacity="0.85"/>
          <text x="57" y={36+i*23} textAnchor="middle" fill={C.white} style={{fontSize:5.5,fontFamily:'system-ui',fontWeight:700}}>{start}%</text>
          {/* Arrow */}
          <text x="91" y={36+i*23} textAnchor="middle" fill={C.mid} style={{fontSize:8}}>→</text>
          {/* Arrival battery */}
          <rect x="100" y={27+i*23} width="54" height="12" rx="3" fill={C.panel} stroke={C.border} strokeWidth="1"/>
          <rect x="101" y={28+i*23} width={52*arrive/100} height="10" rx="2" fill={arrive<20?C.danger ?? '#ef4444':C.soft} opacity="0.85"/>
          <text x="127" y={36+i*23} textAnchor="middle" fill={C.white} style={{fontSize:5.5,fontFamily:'system-ui',fontWeight:700}}>{arrive}%</text>
          {/* Charge stop count */}
          <circle cx="164" cy={33+i*23} r="8" fill={C.dark}/>
          <text x="164" y={37+i*23} textAnchor="middle" fill={C.accent ?? '#22c55e'} style={{fontSize:7,fontWeight:700}}>⚡{Math.ceil((start-arrive)/30)}</text>
        </g>
      ))}
      <circle cx="10" cy="125" r="4" fill={C.accent ?? '#22c55e'}/>
      <text x="18" y="129" fill={C.mid} style={{fontSize:5.5,fontFamily:'system-ui'}}>4 EV routes optimised</text>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   ANA — Autonomous Navigation App
   ══════════════════════════════════════════════════════════════════════════════ */

export function L_VIL() {
  const { palette: C } = useIlloStyle();
  // All rows same fill — no alternating, no semantic green/amber leaking in day mode
  const signals = [['Battery SoC','74%'],['Connector','CCS2'],['Speed','87 km/h'],['GDPR','Granted']];
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      {/* Header band */}
      <rect x="10" y="8" width="180" height="26" rx="8" fill={C.dark}/>
      <LP x="20" y="14" w="100" h="9" color={C.white}/>
      <LP x="20" y="26" w="70" h="8" color={C.soft}/>
      {/* Signal rows — consistent C.panel bg, C.mid value pill */}
      {signals.map(([label,value],i) => (
        <g key={label}>
          <rect x="10" y={42+i*20} width="180" height="16" rx="4"
            fill={C.panel} stroke={C.border} strokeWidth="1"/>
          {/* Signal name LP — wider to fill available space */}
          <LP x="18" y={46+i*20} w="108" h="8" color={C.navy}/>
          {/* Value pill — palette-consistent C.mid border+text */}
          <rect x="148" y={43+i*20} width="36" height="14" rx="7"
            fill="none" stroke={C.mid} strokeWidth="1.5"/>
          <text x="166" y={53+i*20} textAnchor="middle" fill={C.mid}
            style={{fontSize:7,fontWeight:700,fontFamily:'system-ui'}}>{value}</text>
        </g>
      ))}
    </svg>
  );
}

export function L_CIL() {
  const { palette: C } = useIlloStyle();
  // Rows: height=26, gap=4 → spacing=30. Three rows: y=42,72,102 (ends 68,98,128). 2px margin.
  const cmds = [['navigateTo(destination)','Sets active route'],['cancelNavigation()','Ends session'],['searchNearby(query)','Returns POI list']];
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      {/* Header band */}
      <rect x="10" y="8" width="180" height="26" rx="8" fill={C.dark}/>
      <LP x="20" y="14" w="90" h="9" color={C.white}/>
      <LP x="20" y="26" w="65" h="8" color={C.soft}/>
      {cmds.map(([fn,desc],i) => (
        <g key={fn}>
          <rect x="10" y={42+i*30} width="180" height="26" rx="8"
            fill={C.white} stroke={C.border} strokeWidth="1.5"/>
          {/* Method name LP — top line, vertically centred in top half */}
          <LP x="20" y={48+i*30} w="110" h="9" color={C.mid}/>
          {/* Description LP — bottom line, fits within row (ends at row bottom - 4) */}
          <LP x="20" y={60+i*30} w="78" h="7" color={C.panel}/>
        </g>
      ))}
    </svg>
  );
}

export function L_ANATheming() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <LP x="40" y="10" w="120" h="11" color={C.navy}/>
      {[{from:'#e2001a',to:'#0066ff',isColor:true},{from:'4dp',to:'12dp',isColor:false},{from:'Roboto',to:'Inter',isColor:false}].map(({from,to,isColor},i) => (
        <g key={i}>
          {isColor ? (
            <>
              <rect x="12" y={36+i*28} width="40" height="18" rx="5" fill={from}/>
              <rect x="148" y={36+i*28} width="40" height="18" rx="5" fill={to}/>
            </>
          ) : (
            <>
              <rect x="12" y={36+i*28} width="40" height="18" rx="5" fill={C.panel} stroke={C.border} strokeWidth="1"/>
              <text x="32" y={48+i*28} textAnchor="middle" fill={C.navy} style={{fontSize:7,fontFamily:'monospace'}}>{from}</text>
              <rect x="148" y={36+i*28} width="40" height="18" rx="5" fill={C.panel} stroke={C.border} strokeWidth="1"/>
              <text x="168" y={48+i*28} textAnchor="middle" fill={C.mid} style={{fontSize:7,fontFamily:'monospace'}}>{to}</text>
            </>
          )}
          <LP x="60" y={40+i*28} w="70" h="10" color={C.panel}/>
          <text x="100" y={50+i*28} textAnchor="middle" fill={C.mid} style={{fontSize:10}}>→</text>
        </g>
      ))}
      <rect x="26" y="120" width="60" height="8" rx="4" fill="#e2001a"/>
      <text x="100" y="127" textAnchor="middle" fill={C.mid} style={{fontSize:10}}>→</text>
      <rect x="118" y="120" width="60" height="8" rx="4" fill="#0066ff"/>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   ANA — new hero illustrations (Traffic, Map, EVSearch, LDRoute, DriverExp)
   ══════════════════════════════════════════════════════════════════════════════ */

/** Live Traffic & Smart Rerouting — map with two routes + better-route overlay card */
export function L_ANA_Traffic() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.white}/>
      <DW x={0} y={0} w={200} h={130} op={0.3}/>
      {/* Current route (mid blue) */}
      <path d="M25 108 Q65 78 100 68 T175 38" stroke={C.mid} strokeWidth="3.5" strokeLinecap="round" opacity="0.75"/>
      {/* Better route (accent dashed) */}
      <path d="M25 108 Q72 58 132 52 T175 38" stroke={C.accent ?? '#22c55e'} strokeWidth="2" strokeLinecap="round" strokeDasharray="6 4" opacity="0.7"/>
      {/* Nav position */}
      <circle cx="100" cy="68" r="5" fill={C.navy}/>
      <circle cx="100" cy="68" r="2.5" fill={C.white}/>
      {/* Better route overlay card */}
      <rect x="18" y="68" width="164" height="54" rx="10" fill={C.dark}/>
      <LP x="28" y="76" w="78" h="9" color={C.white}/>
      <LP x="28" y="88" w="58" h="7" color={C.accent ?? '#22c55e'}/>
      {/* Accept button */}
      <rect x="28" y="99" width="68" height="15" rx="7" fill={C.mid}/>
      <LP x="36" y="103" w="52" h="7" color={C.white}/>
      {/* Dismiss button */}
      <rect x="104" y="99" width="68" height="15" rx="7" fill="none" stroke={C.soft} strokeWidth="1.5"/>
      <LP x="112" y="103" w="52" h="7" color={C.soft}/>
    </svg>
  );
}

/** Premium Map Display — rich 3D-style map with buildings and active route */
export function L_ANA_Map() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.white}/>
      <DW x={0} y={0} w={200} h={130} op={0.35}/>
      {/* Road grid */}
      <path d="M0 68 Q50 62 100 68 T200 63" stroke={C.panel} strokeWidth="7" strokeLinecap="round"/>
      <path d="M76 0 L74 130" stroke={C.panel} strokeWidth="5"/>
      <path d="M148 0 L144 130" stroke={C.panel} strokeWidth="5"/>
      {/* Buildings (varied opacity → depth) */}
      <rect x="10" y="18" width="30" height="24" rx="2" fill={C.soft} opacity="0.55"/>
      <rect x="44" y="12" width="18" height="30" rx="2" fill={C.mid} opacity="0.28"/>
      <rect x="84" y="8" width="24" height="38" rx="2" fill={C.mid} opacity="0.32"/>
      <rect x="112" y="18" width="20" height="24" rx="2" fill={C.soft} opacity="0.48"/>
      <rect x="156" y="14" width="28" height="26" rx="2" fill={C.soft} opacity="0.42"/>
      <rect x="10" y="80" width="22" height="18" rx="2" fill={C.panel} opacity="0.6"/>
      <rect x="156" y="82" width="24" height="20" rx="2" fill={C.panel} opacity="0.5"/>
      {/* Route with halo */}
      <path d="M22 115 Q65 82 100 70 T178 40" stroke={C.mid} strokeWidth="10" strokeLinecap="round" opacity="0.18"/>
      <path d="M22 115 Q65 82 100 70 T178 40" stroke={C.navy} strokeWidth="3" strokeLinecap="round" opacity="0.85"/>
      {/* Location dot */}
      <circle cx="100" cy="70" r="6" fill={C.navy}/>
      <circle cx="100" cy="70" r="3" fill={C.white}/>
      {/* Map label badge */}
      <rect x="8" y="8" width="60" height="16" rx="8" fill={C.dark}/>
      <LP x="16" y="12" w="44" h="8" color={C.white}/>
    </svg>
  );
}

/** EV Charging Station Search — map + station list split layout */
export function L_ANA_EVSearch() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      {/* Search bar */}
      <rect x="8" y="6" width="184" height="20" rx="8" fill={C.white} stroke={C.border} strokeWidth="1.5"/>
      <circle cx="20" cy="16" r="5" fill={C.panel}/>
      <LP x="32" y="11" w="100" h="10" color={C.panel}/>
      {/* Left: mini map */}
      <rect x="8" y="32" width="84" height="90" rx="8" fill={C.white} stroke={C.border} strokeWidth="1"/>
      <clipPath id="lv-laevs-map"><rect x="8" y="32" width="84" height="90" rx="8"/></clipPath>
      <g clipPath="url(#lv-laevs-map)">
        <DW x={8} y={32} w={84} h={90} op={0.35}/>
        <path d="M8 100 Q38 78 58 82 T92 66" stroke={C.mid} strokeWidth="2" strokeLinecap="round" opacity="0.5}"/>
        {[[30,58],[58,52],[70,76]].map(([cx,cy],i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="9" fill={i===0?C.mid:C.soft} opacity={i===0?1:0.7}/>
            <polygon points={`${cx-2.5},${cy-5} ${cx+3.5},${cy-1} ${cx},${cy-1} ${cx},${cy+5} ${cx-3.5},${cy+1} ${cx},${cy+1}`} fill={C.white}/>
          </g>
        ))}
        <circle cx="50" cy="92" r="4" fill={C.navy}/>
      </g>
      {/* Right: result rows */}
      {[['Ionity','350 kW'],['Fastned','300 kW'],['bp pulse','50 kW']].map(([name,kw],i) => (
        <g key={name}>
          {i>0 && <line x1="100" y1={32+i*30} x2="192" y2={32+i*30} stroke={C.border} strokeWidth="0.75" opacity="0.5"/>}
          <circle cx="110" cy={47+i*30} r="8" fill={i===0?C.mid:C.panel} stroke={i===0?'none':C.border} strokeWidth="1"/>
          <polygon points={`${110-2.5},${47+i*30-4} ${110+3.5},${47+i*30-1} ${110},${47+i*30-1} ${110},${47+i*30+5} ${110-3.5},${47+i*30+1} ${110},${47+i*30+1}`} fill={i===0?C.white:C.soft}/>
          <LP x="124" y={41+i*30} w="58" h="8" color={C.navy}/>
          <LP x="124" y={52+i*30} w="38" h="7" color={C.soft}/>
        </g>
      ))}
    </svg>
  );
}

/** Long-Distance EV Route Planning — route + charging stops + battery bar */
export function L_ANA_LDRoute() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      {/* Map */}
      <rect x="8" y="8" width="184" height="76" rx="10" fill={C.white} stroke={C.border} strokeWidth="1.5"/>
      <clipPath id="lv-laldr-map"><rect x="8" y="8" width="184" height="76" rx="10"/></clipPath>
      <g clipPath="url(#lv-laldr-map)">
        <DW x={8} y={8} w={184} h={76} op={0.35}/>
        <path d="M20 72 Q58 50 88 44 Q118 38 146 32 T184 22" stroke={C.mid} strokeWidth="3" strokeLinecap="round" opacity="0.8}"/>
        {[[88,44],[146,32]].map(([cx,cy],i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="10" fill={C.dark} stroke={C.accent ?? '#22c55e'} strokeWidth="2"/>
            <polygon points={`${cx-3},${cy-5} ${cx+4},${cy-1} ${cx},${cy-1} ${cx},${cy+5} ${cx-4},${cy+1} ${cx},${cy+1}`} fill={C.accent ?? '#22c55e'}/>
          </g>
        ))}
        <circle cx="20" cy="72" r="6" fill={C.accent ?? '#22c55e'}/>
        <circle cx="184" cy="22" r="6" fill={C.navy}/>
      </g>
      {/* Summary bar */}
      <rect x="8" y="88" width="184" height="34" rx="10" fill={C.dark}/>
      <LP x="18" y="95" w="52" h="9" color={C.white}/>
      <LP x="18" y="107" w="36" h="7" color={C.soft}/>
      {/* Battery */}
      <rect x="80" y="93" width="104" height="8" rx="4" fill="rgba(255,255,255,0.15)"/>
      <rect x="80" y="93" width="81" height="8" rx="4" fill={C.accent ?? '#22c55e'}/>
      <text x="80" y="112" fill={C.soft} style={{fontSize:6,fontFamily:'system-ui'}}>2 stops · 5h 26m</text>
      <text x="182" y="112" textAnchor="end" fill={C.accent ?? '#22c55e'} style={{fontSize:7,fontWeight:700,fontFamily:'system-ui'}}>78%</text>
    </svg>
  );
}

/** Driver Experience — full navigation HMI: NIP + map + controls + ETA bar */
export function L_ANA_DriverExp() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      {/* Map body */}
      <rect x="8" y="36" width="184" height="56" fill={C.white}/>
      <clipPath id="lv-lade-map"><rect x="8" y="36" width="184" height="56"/></clipPath>
      <g clipPath="url(#lv-lade-map)">
        <rect x="8" y="36" width="184" height="56" fill={C.white}/>
        <DW x={8} y={36} w={184} h={56} op={0.3}/>
        <path d="M20 80 Q75 58 118 62 T185 48" stroke={C.mid} strokeWidth="3" strokeLinecap="round" opacity="0.7"/>
        <circle cx="118" cy="62" r="5" fill={C.navy}/><circle cx="118" cy="62" r="2.5" fill={C.white}/>
      </g>
      {/* NIP */}
      <rect x="8" y="8" width="184" height="30" rx="8" fill={C.dark}/>
      <path d="M18,30 L18,17 L24,17 L24,13 L32,21 L24,29 L24,25 L21,25 L21,30 Z" fill={C.white}/>
      <text x="40" y="22" fill={C.white} style={{fontSize:9,fontWeight:700,fontFamily:'system-ui,sans-serif'}}>Turn right</text>
      <text x="40" y="32" fill={C.soft} style={{fontSize:6.5,fontFamily:'system-ui,sans-serif'}}>onto Main St · 320 m</text>
      {/* Side controls */}
      <rect x="164" y="38" width="24" height="52" rx="6" fill={C.dark} opacity="0.85"/>
      {['+','−','◎'].map((lbl,i) => (
        <text key={lbl} x="176" y={54+i*16} textAnchor="middle" fill={C.white} style={{fontSize:9}}>{lbl}</text>
      ))}
      {/* ETA bar */}
      <rect x="8" y="94" width="184" height="28" rx="8" fill={C.dark}/>
      {[['14:32','ETA',47],['22 min','Time',100],['8.4 km','Dist',153]].map(([v,l,x]) => (
        <g key={l}>
          <text x={x} y="106" textAnchor="middle" fill={C.white} style={{fontSize:9,fontWeight:700,fontFamily:'system-ui,sans-serif'}}>{v}</text>
          <text x={x} y="117" textAnchor="middle" fill={C.soft} style={{fontSize:6.5,fontFamily:'system-ui,sans-serif'}}>{l}</text>
        </g>
      ))}
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   Routing API — additional endpoints (v2 / v3)
   ══════════════════════════════════════════════════════════════════════════════ */

export function L_RoutingComputeToll() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      {/* Road surface */}
      <path d="M10 68 Q100 63 190 66" stroke={C.panel} strokeWidth="10" strokeLinecap="round"/>
      <path d="M10 68 Q100 63 190 66" stroke={C.mid} strokeWidth="3" strokeLinecap="round" opacity="0.55" strokeDasharray="8 5"/>
      {/* Toll gate pole */}
      <rect x="98" y="46" width="4" height="30" rx="2" fill={C.navy}/>
      {/* Barrier arm */}
      <rect x="100" y="46" width="48" height="5" rx="2.5" fill={C.danger ?? '#e2001a'}/>
      {/* Gate booth */}
      <rect x="82" y="38" width="18" height="32" rx="4" fill={C.dark}/>
      <rect x="86" y="43" width="10" height="12" rx="2" fill={C.mid} opacity="0.4"/>
      {/* Cost breakdown card */}
      <rect x="12" y="82" width="176" height="40" rx="10" fill={C.white} stroke={C.border} strokeWidth="1.5"/>
      {[['Base toll','€2.40',C.navy],['EV discount','–€0.60',C.accent ?? '#22c55e'],['Total','€1.80',C.dark]].map(([label,val,col],i) => (
        <g key={label}>
          {i > 0 && <line x1="20" y1={92+i*10} x2="180" y2={92+i*10} stroke={C.border} strokeWidth="0.75" opacity="0.5"/>}
          <text x="22" y={101+i*10} fill={C.mid} style={{fontSize:6.5,fontFamily:'system-ui'}}>{label}</text>
          <text x="178" y={101+i*10} textAnchor="end" fill={col} style={{fontSize:7,fontWeight:700,fontFamily:'monospace'}}>{val}</text>
        </g>
      ))}
    </svg>
  );
}

export function L_RoutingWeather() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <rect x="8" y="8" width="184" height="78" rx="12" fill={C.white} stroke={C.border} strokeWidth="1.5"/>
      <clipPath id="lv-rw-map"><rect x="8" y="8" width="184" height="78" rx="12"/></clipPath>
      <g clipPath="url(#lv-rw-map)">
        <DW x={8} y={8} w={184} h={78} op={0.3}/>
        {/* Clear section of route */}
        <path d="M20 70 Q60 54 90 50" stroke={C.mid} strokeWidth="3" strokeLinecap="round" opacity="0.8"/>
        {/* Adverse weather section — warn colour dashed */}
        <path d="M90 50 Q130 44 165 38" stroke={C.warn ?? '#fbbf24'} strokeWidth="3" strokeLinecap="round" opacity="0.85" strokeDasharray="5 3"/>
        <circle cx="20" cy="70" r="5" fill={C.accent ?? '#22c55e'}/>
        <circle cx="165" cy="38" r="5" fill={C.navy}/>
        {/* Cloud */}
        <ellipse cx="130" cy="30" rx="22" ry="11" fill={C.soft} opacity="0.38"/>
        <ellipse cx="116" cy="33" rx="16" ry="9" fill={C.soft} opacity="0.42"/>
        {/* Rain */}
        {[108,118,128,138,148].map((x,i) => (
          <line key={i} x1={x} y1={40} x2={x-3} y2={50} stroke={C.mid} strokeWidth="1.2" opacity="0.5" strokeLinecap="round"/>
        ))}
      </g>
      <rect x="8" y="90" width="184" height="32" rx="10" fill={C.dark}/>
      <text x="20" y="103" fill={C.white} style={{fontSize:7,fontWeight:700,fontFamily:'system-ui'}}>Weather ahead</text>
      <text x="20" y="115" fill={C.soft} style={{fontSize:6,fontFamily:'system-ui'}}>Rain · 7°C · Route adjusted</text>
      <rect x="148" y="95" width="36" height="18" rx="9" fill={C.warn ? `${C.warn}22` : 'rgba(251,191,36,0.12)'} stroke={C.warn ?? '#fbbf24'} strokeWidth="1"/>
      <text x="166" y="107" textAnchor="middle" fill={C.warn ?? '#fbbf24'} style={{fontSize:7,fontWeight:700,fontFamily:'system-ui'}}>7°C</text>
    </svg>
  );
}

export function L_RoutingDataFreshness() {
  const { palette: C } = useIlloStyle();
  const rows = [['Traffic','14s ago',1.0],['Road closures','2m ago',0.75],['Speed limits','18m ago',0.4]];
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <LP x="10" y="8" w="100" h="11" color={C.navy}/>
      <rect x="148" y="6" width="42" height="15" rx="7" fill={C.accent ? `${C.accent}22` : 'rgba(34,197,94,0.12)'}/>
      <text x="169" y="16" textAnchor="middle" fill={C.accent ?? '#22c55e'} style={{fontSize:6.5,fontWeight:700,fontFamily:'system-ui'}}>Live</text>
      {rows.map(([label,age,freshness],i) => (
        <g key={label}>
          <rect x="10" y={28+i*30} width="180" height="22" rx="6" fill={C.white} stroke={C.border} strokeWidth="1"/>
          <LP x="18" y={34+i*30} w="76" h="9" color={C.navy}/>
          <text x="182" y={42+i*30} textAnchor="end" fill={C.soft} style={{fontSize:6,fontFamily:'system-ui'}}>{age}</text>
          <rect x="108" y={36+i*30} width="60" height="7" rx="3.5" fill={C.panel}/>
          <rect x="108" y={36+i*30} width={60*freshness} height="7" rx="3.5"
            fill={freshness>0.7?(C.accent ?? '#22c55e'):freshness>0.4?(C.warn ?? '#fbbf24'):(C.danger ?? '#e2001a')}/>
        </g>
      ))}
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   LDEVR — additional endpoints (v2)
   ══════════════════════════════════════════════════════════════════════════════ */

export function L_LDEVRVehicleBrand() {
  const { palette: C } = useIlloStyle();
  const brands = [['BMW','#1c69d4'],['Tesla','#cc0000'],['Audi','#bb0a14']];
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <LP x="10" y="8" w="110" h="11" color={C.navy}/>
      {brands.map(([name,brandColor],i) => (
        <g key={name}>
          <rect x="10" y={28+i*28} width="180" height="22" rx="8"
            fill={i===0?C.panel:C.white} stroke={i===0?C.mid:C.border} strokeWidth={i===0?1.5:1}/>
          <circle cx="24" cy={39+i*28} r="7" fill={brandColor} opacity="0.85"/>
          <LP x="38" y={33+i*28} w="80" h="9" color={C.navy}/>
          <LP x="38" y={44+i*28} w="50" h="7" color={C.soft}/>
          {i===0 && <rect x="158" y={33+i*28} width="24" height="14" rx="7" fill={C.mid}/>}
          {i===0 && <text x="170" y={43+i*28} textAnchor="middle" fill={C.white} style={{fontSize:7,fontWeight:700}}>✓</text>}
        </g>
      ))}
      <rect x="10" y="114" width="180" height="12" rx="6" fill={C.dark}/>
      <text x="18" y="123" fill={C.accent ?? '#22c55e'} style={{fontSize:5.5,fontFamily:'monospace'}}>variantId: 54B969E8-E28D-…</text>
    </svg>
  );
}

export function L_LDEVROemEmsp() {
  const { palette: C } = useIlloStyle();
  const networks = [['Ionity','350 kW',true],['Fastned','300 kW',true],['bp pulse','50 kW',false]];
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <LP x="10" y="8" w="130" h="11" color={C.navy}/>
      <LP x="10" y="22" w="80" h="8" color={C.soft}/>
      {networks.map(([name,kw,compat],i) => (
        <g key={name}>
          <rect x="10" y={34+i*28} width="180" height="22" rx="8"
            fill={C.white} stroke={compat?C.mid:C.border} strokeWidth={compat?1.5:1}/>
          <circle cx="26" cy={45+i*28} r="9" fill={compat?C.mid:C.panel} opacity="0.9"/>
          <polygon points={`${26-3},${45+i*28-6} ${26+4},${45+i*28-2} ${26},${45+i*28-2} ${26},${45+i*28+5} ${26-4},${45+i*28+1} ${26},${45+i*28+1}`} fill={C.white}/>
          <LP x="42" y={38+i*28} w="74" h="9" color={C.navy}/>
          <LP x="42" y={50+i*28} w="44" h="7" color={C.soft}/>
          <rect x="158" y={38+i*28} width="26" height="13" rx="6.5"
            fill={compat?(C.accent ? `${C.accent}22` : 'rgba(34,197,94,0.12)'):C.panel}
            stroke={compat?(C.accent ?? '#22c55e'):C.border} strokeWidth="1"/>
          <text x="171" y={48+i*28} textAnchor="middle"
            fill={compat?(C.accent ?? '#22c55e'):C.soft}
            style={{fontSize:6,fontWeight:700,fontFamily:'system-ui'}}>{compat?'OEM':'—'}</text>
        </g>
      ))}
    </svg>
  );
}

export function L_LDEVRComputeToll() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <path d="M10 66 Q100 61 190 64" stroke={C.panel} strokeWidth="10" strokeLinecap="round"/>
      <path d="M10 66 Q100 61 190 64" stroke={C.mid} strokeWidth="3" strokeLinecap="round" opacity="0.55" strokeDasharray="8 5"/>
      <rect x="98" y="44" width="4" height="30" rx="2" fill={C.navy}/>
      <rect x="100" y="44" width="48" height="5" rx="2.5" fill={C.danger ?? '#e2001a'}/>
      <rect x="82" y="36" width="18" height="32" rx="4" fill={C.dark}/>
      <rect x="86" y="41" width="10" height="12" rx="2" fill={C.mid} opacity="0.4"/>
      {/* EV exemption badge */}
      <circle cx="173" cy="50" r="10" fill={C.accent ? `${C.accent}22` : 'rgba(34,197,94,0.12)'} stroke={C.accent ?? '#22c55e'} strokeWidth="1.5"/>
      <text x="173" y="54" textAnchor="middle" fill={C.accent ?? '#22c55e'} style={{fontSize:7,fontWeight:700,fontFamily:'system-ui'}}>EV</text>
      <rect x="12" y="80" width="176" height="40" rx="10" fill={C.white} stroke={C.border} strokeWidth="1.5"/>
      {[['Base toll','€2.40',C.navy],['EV exemption','–€1.20',C.accent ?? '#22c55e'],['Total','€1.20',C.dark]].map(([label,val,col],i) => (
        <g key={label}>
          {i > 0 && <line x1="20" y1={90+i*10} x2="180" y2={90+i*10} stroke={C.border} strokeWidth="0.75" opacity="0.5"/>}
          <text x="22" y={99+i*10} fill={C.mid} style={{fontSize:6.5,fontFamily:'system-ui'}}>{label}</text>
          <text x="178" y={99+i*10} textAnchor="end" fill={col} style={{fontSize:7,fontWeight:700,fontFamily:'monospace'}}>{val}</text>
        </g>
      ))}
    </svg>
  );
}

export function L_LDEVRChargingParks() {
  const { palette: C } = useIlloStyle();
  const hours = [['Mon–Fri','06:00–22:00'],['Sat','07:00–21:00'],['Sun','08:00–20:00']];
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <LP x="10" y="8" w="120" h="11" color={C.navy}/>
      <LP x="10" y="22" w="80" h="8" color={C.soft}/>
      {/* Park header card */}
      <rect x="10" y="34" width="180" height="26" rx="8" fill={C.dark}/>
      <circle cx="28" cy="47" r="10" fill={C.mid} opacity="0.3"/>
      <polygon points="28,41 35,45 28,45 28,53 21,49 28,49" fill={C.accent ?? '#22c55e'}/>
      <LP x="44" y="39" w="94" h="9" color={C.white}/>
      <LP x="44" y="51" w="58" h="7" color={C.soft}/>
      <rect x="156" y="39" width="28" height="18" rx="9" fill={C.accent ? `${C.accent}22` : 'rgba(34,197,94,0.12)'} stroke={C.accent ?? '#22c55e'} strokeWidth="1"/>
      <text x="170" y="51" textAnchor="middle" fill={C.accent ?? '#22c55e'} style={{fontSize:7,fontWeight:700,fontFamily:'system-ui'}}>12/16</text>
      {/* Hours schedule */}
      {hours.map(([day,hrs],i) => (
        <g key={day}>
          <rect x="10" y={64+i*20} width="180" height="16" rx="4" fill={C.white} stroke={C.border} strokeWidth="1"/>
          <text x="18" y={75+i*20} fill={C.navy} style={{fontSize:7,fontWeight:600,fontFamily:'system-ui'}}>{day}</text>
          <text x="182" y={75+i*20} textAnchor="end" fill={C.mid} style={{fontSize:7,fontFamily:'system-ui'}}>{hrs}</text>
        </g>
      ))}
    </svg>
  );
}

export function L_LDEVRWeather() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <rect x="8" y="8" width="184" height="76" rx="12" fill={C.white} stroke={C.border} strokeWidth="1.5"/>
      <clipPath id="lv-llwea-map"><rect x="8" y="8" width="184" height="76" rx="12"/></clipPath>
      <g clipPath="url(#lv-llwea-map)">
        <DW x={8} y={8} w={184} h={76} op={0.3}/>
        <path d="M20 68 Q60 52 90 48" stroke={C.mid} strokeWidth="3" strokeLinecap="round" opacity="0.8"/>
        <path d="M90 48 Q130 42 165 36" stroke={C.warn ?? '#fbbf24'} strokeWidth="3" strokeLinecap="round" opacity="0.85" strokeDasharray="5 3"/>
        {[[90,48],[142,42]].map(([cx,cy],i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="9" fill={C.dark} stroke={C.accent ?? '#22c55e'} strokeWidth="1.5"/>
            <polygon points={`${cx-2.5},${cy-4} ${cx+3.5},${cy-1} ${cx},${cy-1} ${cx},${cy+4} ${cx-3.5},${cy+1} ${cx},${cy+1}`} fill={C.accent ?? '#22c55e'}/>
          </g>
        ))}
        <ellipse cx="130" cy="28" rx="22" ry="11" fill={C.soft} opacity="0.35"/>
        <ellipse cx="116" cy="31" rx="16" ry="9" fill={C.soft} opacity="0.4"/>
        {[110,120,130,140,150].map((x,i) => (
          <line key={i} x1={x} y1={38} x2={x-3} y2={48} stroke={C.mid} strokeWidth="1.2" opacity="0.5" strokeLinecap="round"/>
        ))}
        <circle cx="20" cy="68" r="5" fill={C.accent ?? '#22c55e'}/>
        <circle cx="165" cy="36" r="5" fill={C.navy}/>
      </g>
      <rect x="8" y="88" width="184" height="32" rx="10" fill={C.dark}/>
      <text x="18" y="101" fill={C.white} style={{fontSize:7,fontWeight:700,fontFamily:'system-ui'}}>Range impact</text>
      <text x="18" y="113" fill={C.soft} style={{fontSize:6,fontFamily:'system-ui'}}>Cold weather · –12% range</text>
      <rect x="130" y="93" width="56" height="22" rx="8" fill={C.warn ? `${C.warn}22` : 'rgba(251,191,36,0.12)'} stroke={C.warn ?? '#fbbf24'} strokeWidth="1"/>
      <text x="158" y="105" textAnchor="middle" fill={C.warn ?? '#fbbf24'} style={{fontSize:9,fontWeight:700,fontFamily:'system-ui'}}>–12%</text>
      <text x="158" y="113" textAnchor="middle" fill={C.warn ?? '#fbbf24'} style={{fontSize:5.5,fontFamily:'system-ui'}}>range</text>
    </svg>
  );
}

export function L_LDEVRDataFreshness() {
  const { palette: C } = useIlloStyle();
  const rows = [['Charger status','8s ago',1.0],['Park capacity','45s ago',0.8],['Pricing','3m ago',0.55],['Amenities','2h ago',0.15]];
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <LP x="10" y="8" w="120" h="11" color={C.navy}/>
      <rect x="148" y="6" width="42" height="15" rx="7" fill={C.accent ? `${C.accent}22` : 'rgba(34,197,94,0.12)'}/>
      <text x="169" y="16" textAnchor="middle" fill={C.accent ?? '#22c55e'} style={{fontSize:6.5,fontWeight:700,fontFamily:'system-ui'}}>Live</text>
      {rows.map(([label,age,freshness],i) => (
        <g key={label}>
          <rect x="10" y={26+i*24} width="180" height="18" rx="5" fill={C.white} stroke={C.border} strokeWidth="1"/>
          <LP x="18" y={31+i*24} w="68" h="8" color={C.navy}/>
          <text x="178" y={38+i*24} textAnchor="end" fill={C.soft} style={{fontSize:5.5,fontFamily:'system-ui'}}>{age}</text>
          <rect x="98" y={32+i*24} width="58" height="6" rx="3" fill={C.panel}/>
          <rect x="98" y={32+i*24} width={58*freshness} height="6" rx="3"
            fill={freshness>0.7?(C.accent ?? '#22c55e'):freshness>0.35?(C.warn ?? '#fbbf24'):(C.danger ?? '#e2001a')}/>
        </g>
      ))}
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   SEARCH & PLACES API
   ══════════════════════════════════════════════════════════════════════════════ */

export function L_SearchFuzzy() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg} rx="12"/>
      <DW/>
      {/* Search bar */}
      <rect x="8" y="8" width="184" height="20" rx="10" fill={C.panel}/>
      <circle cx="22" cy="18" r="5" stroke={C.mid} strokeWidth="1.5" fill="none"/>
      <line x1="26" y1="22" x2="29" y2="25" stroke={C.mid} strokeWidth="1.5" strokeLinecap="round"/>
      <LP x="34" y="13" w="80" h="10" color={C.soft}/>
      <LP x="168" y="13" w="16" h="10" color={C.mid}/>
      {/* Results — mixed addresses + POIs */}
      {[
        [C.accent,  '📍', C.navy, C.soft],
        [C.mid,     '🏪', C.navy, C.soft],
        [C.soft,    '📍', C.navy, C.soft],
        [C.accent,  '🏥', C.navy, C.soft],
      ].map(([dot, , title, sub], i) => (
        <g key={i}>
          <rect x="8" y={36 + i * 23} width="184" height="21" rx="4" fill={i === 0 ? C.panel : 'none'} opacity={i===0?1:0.5}/>
          <circle cx="19" cy={36 + i * 23 + 10} r="5" fill={dot} opacity="0.8"/>
          <LP x="30" y={36 + i * 23 + 5} w={60 + (i%3)*20} h="6" color={title}/>
          <LP x="30" y={36 + i * 23 + 14} w={40 + (i%2)*15} h="5" color={sub}/>
          {i < 3 && <line x1="8" y1={57 + i*23} x2="192" y2={57 + i*23} stroke={C.border} strokeWidth="0.5" opacity="0.4"/>}
        </g>
      ))}
      {/* "Fuzzy" badge */}
      <rect x="140" y="9" width="52" height="12" rx="6" fill={C.mid}/>
      <LP x="146" y="12" w="40" h="6" color={C.white}/>
    </svg>
  );
}

export function L_SearchPOI() {
  const { palette: C } = useIlloStyle();
  const categories = [C.accent, C.mid, C.warn, C.danger, C.soft];
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg} rx="12"/>
      <DW/>
      {/* Category chips */}
      <LP x="8" y="8" w="30" h="14" color={C.mid} rx="7"/>
      <LP x="42" y="8" w="36" h="14" color={C.panel} rx="7"/>
      <LP x="82" y="8" w="28" h="14" color={C.panel} rx="7"/>
      <LP x="114" y="8" w="34" h="14" color={C.panel} rx="7"/>
      {/* POI result cards 2×2 */}
      {[0,1,2,3].map(i => {
        const col = i % 2, row = Math.floor(i / 2);
        const x = 8 + col * 97, y = 30 + row * 48;
        return (
          <g key={i}>
            <rect x={x} y={y} width="89" height="42" rx="8" fill={C.panel}/>
            <circle cx={x+14} cy={y+13} r="8" fill={categories[i]} opacity="0.8"/>
            <LP x={x+26} y={y+8} w={50} h="7" color={C.navy}/>
            <LP x={x+26} y={y+19} w={38} h="5" color={C.soft}/>
            <LP x={x+8} y={y+30} w={72} h="5" color={C.soft}/>
          </g>
        );
      })}
      {/* Count badge */}
      <rect x="152" y="9" width="40" height="12" rx="6" fill={C.navy}/>
      <LP x="158" y="12" w="28" h="6" color={C.white}/>
    </svg>
  );
}

export function L_SearchCategory() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg} rx="12"/>
      <DW/>
      {/* Header */}
      <LP x="8" y="8" w="90" h="9" color={C.navy}/>
      <LP x="8" y="22" w="60" h="7" color={C.soft}/>
      {/* Category tree */}
      {[
        { x:8,  y:38, w:80, active:true,  children:true  },
        { x:20, y:54, w:68, active:false, children:false },
        { x:20, y:68, w:72, active:true,  children:false },
        { x:20, y:82, w:60, active:false, children:false },
        { x:8,  y:96, w:76, active:false, children:true  },
      ].map((r, i) => (
        <g key={i}>
          {r.active && <rect x={r.x} y={r.y-2} width={r.w+4} height="13" rx="4" fill={C.mid} opacity="0.18"/>}
          <LP x={r.x+2} y={r.y} w={r.w} h="9" color={r.active ? C.mid : C.navy}/>
          {r.children && <LP x={r.x+r.w+6} y={r.y+1} w="12" h="7" color={C.soft}/>}
        </g>
      ))}
      {/* Result count pill */}
      <rect x="130" y="38" width="62" height="80" rx="8" fill={C.panel}/>
      <LP x="138" y="48" w="46" h="7" color={C.navy}/>
      <LP x="138" y="60" w="36" h="6" color={C.soft}/>
      <LP x="138" y="72" w="40" h="6" color={C.soft}/>
      <LP x="138" y="84" w="28" h="6" color={C.soft}/>
      <rect x="138" y="96" width="46" height="12" rx="6" fill={C.accent} opacity="0.9"/>
      <LP x="144" y="99" w="34" h="6" color={C.white}/>
    </svg>
  );
}

export function L_SearchNearby() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.grid} rx="12"/>
      <DW/>
      {/* Map roads */}
      <path d="M0 65 Q100 60 200 65" stroke={C.bg} strokeWidth="8" opacity="0.6"/>
      <path d="M100 0 L100 130" stroke={C.bg} strokeWidth="6" opacity="0.5"/>
      <path d="M40 0 L60 130" stroke={C.bg} strokeWidth="4" opacity="0.3"/>
      {/* Radius circle */}
      <circle cx="100" cy="65" r="45" stroke={C.mid} strokeWidth="1.5" strokeDasharray="4 3" fill={C.mid} fillOpacity="0.08"/>
      {/* POI pins */}
      {[[75,42],[128,50],[115,82],[70,88],[95,55]].map(([px,py],i) => (
        <g key={i}>
          <circle cx={px} cy={py} r="6" fill={i===4 ? C.navy : C.accent} opacity={i===4?1:0.85}/>
          {i===4 && <circle cx={px} cy={py} r="10" stroke={C.navy} strokeWidth="1.5" fill="none"/>}
        </g>
      ))}
      {/* Radius label */}
      <rect x="118" y="16" width="74" height="22" rx="6" fill={C.panel}/>
      <LP x="124" y="20" w="62" h="7" color={C.navy}/>
      <LP x="124" y="30" w="44" h="5" color={C.soft}/>
    </svg>
  );
}

export function L_SearchAlongRoute() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.grid} rx="12"/>
      <DW/>
      {/* Route */}
      <path d="M20 108 Q60 80 100 65 T180 22" stroke={C.mid} strokeWidth="3" strokeLinecap="round" opacity="0.9"/>
      <path d="M20 108 Q60 80 100 65 T180 22" stroke={C.mid} strokeWidth="10" strokeLinecap="round" opacity="0.12"/>
      <circle cx="20" cy="108" r="5" fill={C.accent}/>
      <circle cx="180" cy="22" r="5" fill={C.navy}/>
      {/* POIs along route */}
      {[[60,84,'🏪'],[100,65,'⛽'],[140,43,'🏨']].map(([px,py,],i) => (
        <g key={i}>
          <line x1={px} y1={py} x2={px+(i===1?0:i===0?-8:8)} y2={py-18} stroke={C.soft} strokeWidth="1" strokeDasharray="2 2"/>
          <rect x={px-16+(i===1?0:i===0?-8:8)} y={py-32+(i===1?0:0)} width="32" height="14" rx="4" fill={C.panel}/>
          <LP x={px-10+(i===1?0:i===0?-8:8)} y={py-29+(i===1?0:0)} w="20" h="6" color={C.navy}/>
        </g>
      ))}
      {/* Panel */}
      <rect x="8" y="8" width="80" height="28" rx="6" fill={C.panel}/>
      <LP x="14" y="13" w="60" h="6" color={C.navy}/>
      <LP x="14" y="23" w="44" h="5" color={C.soft}/>
    </svg>
  );
}

export function L_SearchAutocomplete() {
  const { palette: C } = useIlloStyle();
  const suggestions = [true, false, false, false];
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg} rx="12"/>
      <DW/>
      {/* Search input */}
      <rect x="8" y="8" width="184" height="22" rx="11" fill={C.panel} stroke={C.mid} strokeWidth="1.5"/>
      <circle cx="22" cy="19" r="5" stroke={C.mid} strokeWidth="1.5" fill="none"/>
      <line x1="26" y1="23" x2="29" y2="26" stroke={C.mid} strokeWidth="1.5" strokeLinecap="round"/>
      <LP x="34" y="14" w="60" h="10" color={C.navy}/>
      {/* Cursor blink */}
      <rect x="96" y="14" width="1.5" height="10" rx="1" fill={C.mid}/>
      {/* Dropdown shadow */}
      <rect x="8" y="36" width="184" height="90" rx="8" fill={C.panel} opacity="0.95"/>
      {/* Suggestions */}
      {suggestions.map((active, i) => (
        <g key={i}>
          {active && <rect x="8" y={36+i*22} width="184" height="22" rx={i===0?'8 8 0 0':'0'} fill={C.mid} opacity="0.18"/>}
          <circle cx="22" cy={36+i*22+11} r="5" fill={active ? C.accent : C.soft} opacity={active?1:0.5}/>
          <LP x="32" y={36+i*22+6} w={80+(i%3)*15} h="7" color={active ? C.navy : C.soft}/>
          {i < 3 && <line x1="16" y1={58+i*22} x2="192" y2={58+i*22} stroke={C.border} strokeWidth="0.5" opacity="0.3"/>}
        </g>
      ))}
      {/* Entity tag */}
      <rect x="148" y="44" width="36" height="12" rx="6" fill={C.accent} opacity="0.85"/>
      <LP x="153" y="47" w="26" h="6" color={C.white}/>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   GEOCODING API
   ══════════════════════════════════════════════════════════════════════════════ */

export function L_Geocode() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg} rx="12"/>
      <DW/>
      {/* Address input */}
      <rect x="8" y="8" width="92" height="36" rx="8" fill={C.panel}/>
      <LP x="14" y="13" w="80" h="7" color={C.navy}/>
      <LP x="14" y="24" w="64" h="6" color={C.soft}/>
      <LP x="14" y="34" w="50" h="5" color={C.soft} rx="3"/>
      {/* Arrow */}
      <path d="M104 26 L118 26 M114 22 L118 26 L114 30" stroke={C.mid} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Map output */}
      <rect x="122" y="8" width="70" height="80" rx="8" fill={C.grid}/>
      {/* Map roads */}
      <line x1="122" y1="48" x2="192" y2="48" stroke={C.bg} strokeWidth="3" opacity="0.6"/>
      <line x1="157" y1="8" x2="157" y2="88" stroke={C.bg} strokeWidth="3" opacity="0.5"/>
      {/* Pin */}
      <circle cx="157" cy="44" r="8" fill={C.accent}/>
      <circle cx="157" cy="44" r="14" stroke={C.accent} strokeWidth="1.5" fill="none" opacity="0.4"/>
      <line x1="157" y1="52" x2="157" y2="58" stroke={C.accent} strokeWidth="2"/>
      {/* Coordinate card */}
      <rect x="8" y="54" width="110" height="38" rx="8" fill={C.panel}/>
      <LP x="14" y="60" w="50" h="6" color={C.soft}/>
      <LP x="14" y="70" w="90" h="7" color={C.navy}/>
      <LP x="14" y="81" w="70" h="5" color={C.mid}/>
      {/* Confidence badge */}
      <rect x="8" y="98" width="60" height="14" rx="7" fill={C.accent} opacity="0.9"/>
      <LP x="14" y="102" w="48" h="6" color={C.white}/>
    </svg>
  );
}

export function L_ReverseGeocode() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.grid} rx="12"/>
      <DW/>
      {/* Map */}
      <path d="M0 65 Q100 60 200 65" stroke={C.bg} strokeWidth="8" opacity="0.5"/>
      <path d="M80 0 L75 130" stroke={C.bg} strokeWidth="5" opacity="0.4"/>
      <path d="M140 0 L145 130" stroke={C.bg} strokeWidth="4" opacity="0.3"/>
      {/* Click point */}
      <circle cx="110" cy="58" r="6" fill={C.navy}/>
      <circle cx="110" cy="58" r="12" stroke={C.navy} strokeWidth="1.5" fill="none" strokeDasharray="3 2"/>
      {/* Arrow */}
      <path d="M118 58 L130 58 M126 54 L130 58 L126 62" stroke={C.mid} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Address result card */}
      <rect x="8" y="80" width="184" height="44" rx="8" fill={C.panel}/>
      <LP x="16" y="87" w="60" h="6" color={C.soft}/>
      <LP x="16" y="97" w="140" h="8" color={C.navy}/>
      <LP x="16" y="109" w="90" h="6" color={C.soft}/>
      {/* Coordinate input chip */}
      <rect x="8" y="8" width="120" height="18" rx="9" fill={C.panel}/>
      <LP x="14" y="12" w="108" h="8" color={C.mid}/>
      {/* Speed limit bonus */}
      <rect x="150" y="8" width="42" height="18" rx="9" fill={C.dark} opacity="0.85"/>
      <LP x="156" y="12" w="30" h="8" color={C.white}/>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   TRAFFIC API
   ══════════════════════════════════════════════════════════════════════════════ */

export function L_TrafficFlow() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.grid} rx="12"/>
      <DW/>
      {/* Road grid */}
      <path d="M0 65 Q100 60 200 65" stroke={C.bg} strokeWidth="10" opacity="0.5"/>
      <path d="M0 40 Q80 36 200 40" stroke={C.bg} strokeWidth="6" opacity="0.35"/>
      <path d="M70 0 L68 130" stroke={C.bg} strokeWidth="6" opacity="0.4"/>
      <path d="M135 0 L138 130" stroke={C.bg} strokeWidth="5" opacity="0.35"/>
      {/* Flow colouring — green/amber/red segments */}
      <path d="M0 65 Q30 62 50 63" stroke={C.accent} strokeWidth="7" strokeLinecap="round" opacity="0.85"/>
      <path d="M50 63 Q80 61 100 63" stroke={C.warn} strokeWidth="7" strokeLinecap="round" opacity="0.85"/>
      <path d="M100 63 Q130 62 155 64" stroke={C.danger} strokeWidth="7" strokeLinecap="round" opacity="0.85"/>
      <path d="M155 64 Q175 63 200 65" stroke={C.accent} strokeWidth="7" strokeLinecap="round" opacity="0.85"/>
      {/* Legend */}
      <rect x="8" y="88" width="184" height="34" rx="6" fill={C.panel}/>
      {[[C.accent,'Free flow'],[C.warn,'Slow'],[C.danger,'Congested']].map(([col,],i) => (
        <g key={i}>
          <rect x={14+i*62} y="96" width="12" height="6" rx="3" fill={col}/>
          <LP x={29+i*62} y="96" w="38" h="6" color={C.navy}/>
        </g>
      ))}
      {/* Speed badge */}
      <rect x="8" y="8" width="60" height="20" rx="6" fill={C.panel}/>
      <LP x="14" y="12" w="48" h="7" color={C.navy}/>
      <LP x="14" y="22" w="32" h="5" color={C.soft}/>
    </svg>
  );
}

export function L_TrafficIncidents() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.grid} rx="12"/>
      <DW/>
      {/* Roads */}
      <path d="M0 65 Q100 60 200 65" stroke={C.bg} strokeWidth="9" opacity="0.5"/>
      <path d="M95 0 L95 130" stroke={C.bg} strokeWidth="6" opacity="0.4"/>
      {/* Incident markers */}
      {[[55,63,'⚠️'],[95,40,'🚧'],[148,64,'⛔']].map(([px,py,],i) => (
        <g key={i}>
          <circle cx={px} cy={py} r="10" fill={i===2?C.danger:C.warn} opacity="0.9"/>
          <circle cx={px} cy={py} r="15" stroke={i===2?C.danger:C.warn} strokeWidth="1" fill="none" opacity="0.4"/>
        </g>
      ))}
      {/* Detail card */}
      <rect x="8" y="8" width="118" height="46" rx="8" fill={C.panel}/>
      <rect x="8" y="8" width="118" height="12" rx="8" fill={C.danger} opacity="0.85"/>
      <LP x="14" y="11" w="80" h="6" color={C.white}/>
      <LP x="14" y="26" w="100" h="7" color={C.navy}/>
      <LP x="14" y="37" w="80" h="6" color={C.soft}/>
      <LP x="14" y="46" w="60" h="5" color={C.soft}/>
      {/* Delay badge */}
      <rect x="140" y="8" width="52" height="20" rx="6" fill={C.warn} opacity="0.9"/>
      <LP x="146" y="12" w="40" h="7" color={C.dark}/>
      <LP x="146" y="22" w="30" h="5" color={C.dark}/>
      {/* Tile grid lines */}
      {[0,1].map(col => [0,1].map(row => (
        <rect key={`${col}${row}`} x={130+col*35} y={44+row*35} width="33" height="33" rx="2"
          fill="none" stroke={C.border} strokeWidth="0.5" opacity="0.5"/>
      )))}
    </svg>
  );
}

export function L_TrafficFlowTile() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.dark} rx="12"/>
      {/* 3×2 tile grid */}
      {[0,1,2].map(col => [0,1].map(row => {
        const x = 10 + col * 62, y = 10 + row * 58;
        const flowColors = [[C.accent,C.warn],[C.danger,C.accent],[C.warn,C.danger]];
        const [c1,c2] = flowColors[col];
        return (
          <g key={`${col}${row}`}>
            <rect x={x} y={y} width="58" height="54" rx="4" fill={C.panel} stroke={C.border} strokeWidth="0.5"/>
            {/* mini flow roads */}
            <line x1={x} y1={y+27} x2={x+58} y2={y+27} stroke={C.bg} strokeWidth="4" opacity="0.4"/>
            <line x1={x+29} y1={y} x2={x+29} y2={y+54} stroke={C.bg} strokeWidth="3" opacity="0.3"/>
            <line x1={x} y1={y+27} x2={x+29} y2={y+27} stroke={c1} strokeWidth="4" strokeLinecap="round" opacity="0.9"/>
            <line x1={x+29} y1={y+27} x2={x+58} y2={y+27} stroke={c2} strokeWidth="4" strokeLinecap="round" opacity="0.9"/>
          </g>
        );
      }))}
      {/* Zoom badge */}
      <rect x="8" y="122" width="184" height="1" fill={C.border} opacity="0.3"/>
      <rect x="10" y="10" width="180" height="110" rx="6" fill="none" stroke={C.border} strokeWidth="0.5" strokeDasharray="4 3" opacity="0.5"/>
      <rect x="72" y="4" width="56" height="14" rx="7" fill={C.mid}/>
      <LP x="78" y="7" w="44" h="8" color={C.white}/>
    </svg>
  );
}

export function L_TrafficModelID() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg} rx="12"/>
      <DW/>
      {/* Header */}
      <LP x="8" y="8" w="100" h="9" color={C.navy}/>
      <LP x="8" y="22" w="70" h="7" color={C.soft}/>
      {/* Model ID card */}
      <rect x="8" y="36" width="184" height="32" rx="8" fill={C.panel}/>
      <LP x="16" y="42" w="50" h="6" color={C.soft}/>
      <LP x="16" y="53" w="120" h="9" color={C.mid}/>
      {/* Timestamp */}
      <rect x="8" y="76" width="184" height="22" rx="6" fill={C.panel}/>
      <LP x="16" y="81" w="44" h="5" color={C.soft}/>
      <LP x="16" y="89" w="80" h="7" color={C.navy}/>
      {/* Usage pill */}
      <rect x="8" y="106" width="100" height="16" rx="8" fill={C.mid} opacity="0.8"/>
      <LP x="14" y="110" w="88" h="8" color={C.white}/>
      <rect x="116" y="106" width="76" height="16" rx="8" fill={C.panel}/>
      <LP x="122" y="110" w="64" h="8" color={C.navy}/>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   EV & CHARGING APIS
   ══════════════════════════════════════════════════════════════════════════════ */

export function L_EVSearchNearby() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.grid} rx="12"/>
      <DW/>
      {/* Roads */}
      <path d="M0 65 Q100 62 200 65" stroke={C.bg} strokeWidth="7" opacity="0.5"/>
      <path d="M100 0 L100 130" stroke={C.bg} strokeWidth="5" opacity="0.4"/>
      {/* Search radius */}
      <circle cx="100" cy="65" r="44" stroke={C.accent} strokeWidth="1.5" strokeDasharray="4 3" fill={C.accent} fillOpacity="0.07"/>
      {/* EV station pins */}
      {[[72,48],[118,52],[88,82],[115,78],[100,55]].map(([px,py],i) => (
        <g key={i}>
          <rect x={px-8} y={py-9} width="16" height="18" rx="4" fill={i===4?C.navy:C.accent} opacity={i===4?1:0.85}/>
          <text x={px} y={py+3} textAnchor="middle" fill={C.white} fontSize="8" fontWeight="700">⚡</text>
        </g>
      ))}
      {/* Result panel */}
      <rect x="8" y="8" width="72" height="36" rx="6" fill={C.panel}/>
      <LP x="14" y="13" w="60" h="6" color={C.navy}/>
      <LP x="14" y="23" w="44" h="6" color={C.accent}/>
      <LP x="14" y="33" w="52" h="5" color={C.soft}/>
      {/* Filter chips */}
      <rect x="144" y="8" width="48" height="14" rx="7" fill={C.mid} opacity="0.9"/>
      <LP x="150" y="11" w="36" h="8" color={C.white}/>
    </svg>
  );
}

export function L_EVChargingAvailability() {
  const { palette: C } = useIlloStyle();
  const statuses = [C.accent, C.accent, C.warn, C.accent, C.danger, C.soft];
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg} rx="12"/>
      <DW/>
      {/* Station header */}
      <rect x="8" y="8" width="184" height="28" rx="8" fill={C.panel}/>
      <LP x="16" y="13" w="90" h="7" color={C.navy}/>
      <LP x="16" y="24" w="60" h="5" color={C.soft}/>
      <rect x="148" y="13" width="36" height="14" rx="7" fill={C.accent} opacity="0.9"/>
      <LP x="154" y="17" w="24" h="6" color={C.white}/>
      {/* Connector grid */}
      {statuses.map((col, i) => {
        const col2 = i % 3, row = Math.floor(i / 3);
        const x = 8 + col2 * 62, y = 44 + row * 42;
        return (
          <g key={i}>
            <rect x={x} y={y} width="58" height="36" rx="6" fill={C.panel}/>
            <circle cx={x+29} cy={y+13} r="8" fill={col} opacity="0.85"/>
            <LP x={x+8} y={y+26} w="42" h="5" color={C.soft}/>
          </g>
        );
      })}
      {/* Refresh badge */}
      <rect x="8" y="122" width="184" height="1" fill={C.border} opacity="0.3"/>
      <rect x="66" y="4" width="68" height="1" fill="none"/>
    </svg>
  );
}

export function L_EVMarketCoverage() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg} rx="12"/>
      <DW/>
      {/* World map rough outline */}
      <ellipse cx="100" cy="65" rx="88" ry="52" stroke={C.border} strokeWidth="1" fill={C.grid} opacity="0.5"/>
      {/* Coverage dots by region */}
      {[[45,40,'EU'],[100,42,'UK'],[60,70,'AF'],[140,45,'AS'],[160,60,'JP'],[30,58,'NA'],[75,88,'LA']].map(([px,py,],i) => (
        <g key={i}>
          <circle cx={px} cy={py} r={i<3?8:6} fill={i<5?C.accent:C.soft} opacity={i<5?0.85:0.5}/>
        </g>
      ))}
      {/* Legend */}
      <rect x="8" y="90" width="184" height="32" rx="6" fill={C.panel}/>
      <circle cx="18" cy="106" r="5" fill={C.accent}/>
      <LP x="26" y="102" w="50" h="6" color={C.navy}/>
      <LP x="26" y="111" w="36" h="5" color={C.soft}/>
      <circle cx="108" cy="106" r="5" fill={C.soft}/>
      <LP x="116" y="102" w="50" h="6" color={C.navy}/>
      <LP x="116" y="111" w="36" h="5" color={C.soft}/>
      {/* Count badge */}
      <rect x="68" y="8" width="64" height="18" rx="9" fill={C.navy}/>
      <LP x="74" y="12" w="52" h="10" color={C.white}/>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   MAP DISPLAY API
   ══════════════════════════════════════════════════════════════════════════════ */

export function L_MapRasterTile() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg} rx="12"/>
      {/* Tile grid 3×2 */}
      {[0,1,2].map(col => [0,1].map(row => {
        const x = 8+col*62, y=8+row*58;
        return (
          <g key={`${col}${row}`}>
            <rect x={x} y={y} width="58" height="54" rx="3" fill={C.grid}/>
            {/* Mini map content */}
            <path d={`M${x} ${y+27} Q${x+20} ${y+24} ${x+58} ${y+27}`} stroke={C.bg} strokeWidth="4" opacity="0.7"/>
            <path d={`M${x+18} ${y} L${x+18} ${y+54}`} stroke={C.bg} strokeWidth="3" opacity="0.5"/>
            {col===1 && row===0 && <circle cx={x+29} cy={y+27} r="6" fill={C.accent} opacity="0.9"/>}
          </g>
        );
      }))}
      {/* Tile notation */}
      <rect x="70" y="4" width="60" height="14" rx="7" fill={C.mid}/>
      <LP x="76" y="7" w="48" h="8" color={C.white}/>
      {/* Format badge */}
      <rect x="8" y="120" width="50" height="6" rx="3" fill={C.panel}/>
      <rect x="62" y="120" width="50" height="6" rx="3" fill={C.panel}/>
      <rect x="116" y="120" width="50" height="6" rx="3" fill={C.panel}/>
    </svg>
  );
}

export function L_MapVectorTile() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.dark} rx="12"/>
      {/* Vector layer stack — roads */}
      <rect x="10" y="10" width="180" height="110" rx="6" fill={C.panel} opacity="0.15"/>
      {/* Layer 1: land */}
      <rect x="20" y="20" width="160" height="90" rx="4" fill={C.grid} opacity="0.6"/>
      {/* Layer 2: water */}
      <ellipse cx="80" cy="75" rx="28" ry="18" fill={C.mid} opacity="0.4"/>
      {/* Layer 3: roads */}
      <path d="M20 65 Q100 60 180 65" stroke={C.bg} strokeWidth="4" opacity="0.7"/>
      <path d="M100 20 L100 110" stroke={C.bg} strokeWidth="3" opacity="0.6"/>
      {/* Layer 4: buildings */}
      {[[55,38],[68,36],[115,38],[128,40],[115,52],[55,52]].map(([bx,by],i) => (
        <rect key={i} x={bx} y={by} width="10" height="10" rx="1" fill={C.soft} opacity="0.7"/>
      ))}
      {/* Layer labels */}
      {['Roads','Water','Buildings','Labels'].map((lbl,i) => (
        <g key={lbl}>
          <rect x="136" y={20+i*24} width="54" height="16" rx="4" fill={C.panel} opacity="0.8"/>
          <LP x="142" y={24+i*24} w="42" h="8" color={C.navy}/>
        </g>
      ))}
      {/* Vector badge */}
      <rect x="20" y="6" width="50" height="12" rx="6" fill={C.accent} opacity="0.9"/>
      <LP x="26" y="9" w="38" h="6" color={C.white}/>
    </svg>
  );
}

export function L_MapSatelliteTile() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.dark} rx="12"/>
      {/* Satellite imagery simulation */}
      <rect x="8" y="8" width="184" height="114" rx="8" fill={C.grid} opacity="0.4"/>
      {/* Terrain patches */}
      <rect x="8"  y="8"  width="60" height="50" rx="2" fill={C.soft} opacity="0.3"/>
      <rect x="70" y="8"  width="80" height="35" rx="2" fill={C.mid}  opacity="0.25"/>
      <rect x="152" y="8" width="40" height="60" rx="2" fill={C.soft} opacity="0.2"/>
      <rect x="8"  y="60" width="90" height="62" rx="2" fill={C.panel} opacity="0.3"/>
      {/* Water body */}
      <ellipse cx="145" cy="90" rx="40" ry="28" fill={C.mid} opacity="0.35"/>
      {/* Road overlay */}
      <path d="M8 75 Q100 70 192 75" stroke={C.bg} strokeWidth="2" opacity="0.5"/>
      <path d="M100 8 L100 122" stroke={C.bg} strokeWidth="1.5" opacity="0.4"/>
      {/* Resolution badge */}
      <rect x="8" y="8" width="68" height="20" rx="6" fill={C.dark} opacity="0.8"/>
      <LP x="14" y="12" w="56" h="6" color={C.navy}/>
      <LP x="14" y="21" w="40" h="5" color={C.soft}/>
      {/* Zoom indicator */}
      <rect x="148" y="110" width="44" height="12" rx="6" fill={C.mid} opacity="0.9"/>
      <LP x="154" y="113" w="32" h="6" color={C.white}/>
    </svg>
  );
}

export function L_MapAssetsAPI() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg} rx="12"/>
      <DW/>
      {/* Three asset type cards */}
      {[
        { label:'Styles', sub:'MapLibre JSON', icon:'🎨', col: C.mid },
        { label:'Sprites', sub:'PNG + JSON', icon:'🖼️', col: C.accent },
        { label:'Fonts', sub:'PBF glyphs', icon:'✏️', col: C.soft },
      ].map((a, i) => (
        <g key={a.label}>
          <rect x={8+i*64} y="8" width="58" height="54" rx="8" fill={C.panel}/>
          <circle cx={8+i*64+29} cy="30" r="12" fill={a.col} opacity="0.25"/>
          <text x={8+i*64+29} y="34" textAnchor="middle" fontSize="12">{a.icon}</text>
          <LP x={8+i*64+6} y="46" w="46" h="6" color={C.navy}/>
          <LP x={8+i*64+6} y="55" w="38" h="5" color={C.soft}/>
        </g>
      ))}
      {/* Orbis-only badge */}
      <rect x="8" y="70" width="90" height="14" rx="7" fill={C.accent} opacity="0.9"/>
      <LP x="14" y="74" w="78" h="6" color={C.white}/>
      {/* Style preview */}
      <rect x="8" y="92" width="184" height="30" rx="6" fill={C.panel}/>
      <LP x="14" y="98" w="60" h="6" color={C.soft}/>
      <LP x="14" y="108" w="160" h="8" color={C.navy}/>
    </svg>
  );
}

export function L_MapStaticImage() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg} rx="12"/>
      <DW/>
      {/* Static map frame */}
      <rect x="8" y="8" width="120" height="90" rx="8" fill={C.grid}/>
      <path d="M8 53 Q68 48 128 53" stroke={C.bg} strokeWidth="6" opacity="0.5"/>
      <path d="M68 8 L68 98" stroke={C.bg} strokeWidth="4" opacity="0.4"/>
      {/* Center pin */}
      <circle cx="68" cy="53" r="8" fill={C.accent} opacity="0.9"/>
      <line x1="68" y1="61" x2="68" y2="68" stroke={C.accent} strokeWidth="2"/>
      {/* Watermark */}
      <LP x="14" y="90" w="60" h="5" color={C.soft} rx="3"/>
      {/* Size params panel */}
      <rect x="136" y="8" width="56" height="90" rx="8" fill={C.panel}/>
      <LP x="142" y="15" w="44" h="6" color={C.soft}/>
      <LP x="142" y="26" w="34" h="8" color={C.navy}/>
      <LP x="142" y="40" w="44" h="6" color={C.soft}/>
      <LP x="142" y="51" w="28" h="8" color={C.navy}/>
      <LP x="142" y="65" w="44" h="6" color={C.soft}/>
      <LP x="142" y="76" w="38" h="8" color={C.mid}/>
      {/* Output badge */}
      <rect x="8" y="106" width="50" height="16" rx="8" fill={C.mid} opacity="0.9"/>
      <LP x="14" y="110" w="38" h="8" color={C.white}/>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   PARKING & FUEL APIS
   ══════════════════════════════════════════════════════════════════════════════ */

export function L_ParkingAvailability() {
  const { palette: C } = useIlloStyle();
  const spots = [C.accent,C.accent,C.soft,C.accent,C.danger,C.accent,C.soft,C.accent,C.accent,C.danger,C.accent,C.soft];
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg} rx="12"/>
      <DW/>
      {/* Car park header */}
      <rect x="8" y="8" width="184" height="26" rx="8" fill={C.panel}/>
      <LP x="16" y="13" w="80" h="7" color={C.navy}/>
      <LP x="16" y="24" w="50" h="5" color={C.soft}/>
      <rect x="148" y="13" width="36" height="14" rx="7" fill={C.accent} opacity="0.9"/>
      <LP x="154" y="17" w="24" h="6" color={C.white}/>
      {/* Parking space grid */}
      {spots.map((col, i) => {
        const col2 = i % 6, row = Math.floor(i / 6);
        return (
          <g key={i}>
            <rect x={8+col2*29} y={42+row*30} width="25" height="26" rx="3"
              fill={col} opacity={col===C.soft?0.35:0.8}/>
            {col === C.danger && (
              <text x={8+col2*29+12} y={42+row*30+16} textAnchor="middle" fontSize="9" fill={C.white}>P</text>
            )}
          </g>
        );
      })}
      {/* Levels */}
      <rect x="182" y="42" width="10" height="52" rx="3" fill={C.panel}/>
      {[0,1,2].map(i => <LP key={i} x="184" y={44+i*16} w="6" h="10" color={i===0?C.mid:C.soft}/>)}
    </svg>
  );
}

export function L_ParkingPrices() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg} rx="12"/>
      <DW/>
      {/* Price header */}
      <rect x="8" y="8" width="184" height="24" rx="8" fill={C.panel}/>
      <LP x="16" y="13" w="90" h="7" color={C.navy}/>
      <LP x="16" y="23" w="60" h="5" color={C.soft}/>
      {/* Duration tiers */}
      {[['0–1 hr', '€2.50'], ['1–3 hr', '€4.00'], ['3–8 hr', '€7.50'], ['All day', '€12.00']].map(([dur, price], i) => (
        <g key={i}>
          <rect x="8" y={40+i*20} width="184" height="18" rx="4"
            fill={i===0?C.mid:C.panel} opacity={i===0?0.18:0.7}/>
          <LP x="16" y={45+i*20} w="60" h="7" color={C.navy}/>
          <LP x="136" y={44+i*20} w="48" h="9" color={i===0?C.mid:C.navy}/>
        </g>
      ))}
      {/* Payment methods */}
      <rect x="8" y="124" width="1" height="1" fill="none"/>
      <LP x="8" y="124" w="44" h="1" color={C.border}/>
      {['💳','📱','💶'].map((_, i) => (
        <rect key={i} x={8+i*44} y="106" width="38" height="16" rx="6" fill={C.panel}/>
      ))}
      <LP x="14" y="110" w="26" h="8" color={C.soft}/>
      <LP x="58" y="110" w="26" h="8" color={C.soft}/>
      <LP x="102" y="110" w="26" h="8" color={C.soft}/>
    </svg>
  );
}

export function L_OnStreetParking() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.grid} rx="12"/>
      <DW/>
      {/* Street */}
      <path d="M0 65 Q100 62 200 65" stroke={C.bg} strokeWidth="22" opacity="0.55"/>
      {/* Kerbside zones — probability colour */}
      <rect x="10" y="54" width="28" height="10" rx="2" fill={C.accent} opacity="0.85"/>
      <rect x="42" y="54" width="28" height="10" rx="2" fill={C.accent} opacity="0.7"/>
      <rect x="74" y="54" width="28" height="10" rx="2" fill={C.warn} opacity="0.75"/>
      <rect x="106" y="54" width="28" height="10" rx="2" fill={C.danger} opacity="0.7"/>
      <rect x="138" y="54" width="28" height="10" rx="2" fill={C.warn} opacity="0.6"/>
      <rect x="168" y="54" width="24" height="10" rx="2" fill={C.accent} opacity="0.75"/>
      {/* Same on other side */}
      <rect x="10"  y="66" width="28" height="10" rx="2" fill={C.soft} opacity="0.5"/>
      <rect x="42"  y="66" width="28" height="10" rx="2" fill={C.accent} opacity="0.6"/>
      <rect x="74"  y="66" width="28" height="10" rx="2" fill={C.accent} opacity="0.75"/>
      <rect x="106" y="66" width="28" height="10" rx="2" fill={C.danger} opacity="0.55"/>
      <rect x="138" y="66" width="28" height="10" rx="2" fill={C.soft} opacity="0.45"/>
      {/* Legend */}
      <rect x="8" y="90" width="184" height="32" rx="6" fill={C.panel}/>
      {[[C.accent,'Available'],[C.warn,'Limited'],[C.danger,'Restricted']].map(([col,],i) => (
        <g key={i}>
          <rect x={14+i*62} y="100" width="12" height="6" rx="3" fill={col}/>
          <LP x={29+i*62} y="100" w="40" h="6" color={C.navy}/>
        </g>
      ))}
      {/* Probability badge */}
      <rect x="8" y="8" width="90" height="18" rx="9" fill={C.panel}/>
      <LP x="14" y="12" w="78" h="10" color={C.navy}/>
    </svg>
  );
}

export function L_FuelPrices() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg} rx="12"/>
      <DW/>
      {/* Station card */}
      <rect x="8" y="8" width="184" height="30" rx="8" fill={C.panel}/>
      <rect x="8" y="8" width="40" height="30" rx="8" fill={C.mid} opacity="0.6"/>
      <text x="28" y="27" textAnchor="middle" fontSize="16">⛽</text>
      <LP x="54" y="13" w="90" h="7" color={C.navy}/>
      <LP x="54" y="24" w="60" h="5" color={C.soft}/>
      {/* Fuel type rows */}
      {[['Unleaded 95','green'],['Diesel','mid'],['Premium 98','warn'],['LPG','soft']].map(([name,tok],i) => (
        <g key={i}>
          <rect x="8" y={46+i*18} width="184" height="16" rx="4"
            fill={i===0?C.panel:C.panel} opacity={i%2===0?0.7:0.5}/>
          <rect x="8" y={46+i*18} width="6" height="16" rx="2" fill={C[tok]||C.mid} opacity="0.9"/>
          <LP x="20" y={50+i*18} w="80" h="7" color={C.navy}/>
          <LP x="148" y={49+i*18} w="36" h="9" color={C.mid}/>
        </g>
      ))}
      {/* Refresh badge */}
      <rect x="8" y="120" width="184" height="1" fill={C.border} opacity="0.3"/>
      <rect x="8" y="118" width="90" height="8" rx="4" fill={C.panel}/>
      <LP x="14" y="121" w="78" h="4" color={C.soft}/>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   SNAP TO ROADS API
   ══════════════════════════════════════════════════════════════════════════════ */

export function L_SnapToRoads() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.grid} rx="12"/>
      <DW/>
      {/* Road */}
      <path d="M15 100 Q60 72 100 65 T185 35" stroke={C.bg} strokeWidth="10" opacity="0.5"/>
      {/* Raw GPS trace — jittery */}
      <path d="M15 105 Q35 85 58 80 Q72 77 88 72 Q105 68 118 62 Q138 55 152 47 Q168 40 185 38"
        stroke={C.warn} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 2" opacity="0.8"/>
      {/* Snapped trace — clean on road */}
      <path d="M15 100 Q60 72 100 65 T185 35"
        stroke={C.accent} strokeWidth="2.5" strokeLinecap="round" opacity="0.9"/>
      {/* Snap arrows */}
      {[[58,78,58,73],[100,68,100,65],[148,50,148,46]].map(([x1,y1,x2,y2],i) => (
        <g key={i}>
          <circle cx={x1} cy={y1} r="3" fill={C.warn} opacity="0.8"/>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.soft} strokeWidth="1" strokeDasharray="1.5 1.5"/>
          <circle cx={x2} cy={y2} r="3" fill={C.accent} opacity="0.9"/>
        </g>
      ))}
      {/* Legend */}
      <rect x="8" y="8" width="140" height="28" rx="6" fill={C.panel}/>
      <LP x="14" y="13" w="6" h="6" color={C.warn}/>
      <LP x="24" y="13" w="50" h="6" color={C.navy}/>
      <LP x="14" y="23" w="6" h="6" color={C.accent}/>
      <LP x="24" y="23" w="50" h="6" color={C.navy}/>
      {/* Speed limit badge */}
      <rect x="158" y="8" width="34" height="28" rx="6" fill={C.panel}/>
      <LP x="164" y="13" w="22" h="6" color={C.soft}/>
      <LP x="164" y="23" w="22" h="8" color={C.navy}/>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   BATCH SEARCH API
   ══════════════════════════════════════════════════════════════════════════════ */

export function L_BatchSearch() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg} rx="12"/>
      <DW/>
      {/* Input batch */}
      <rect x="8" y="8" width="80" height="110" rx="8" fill={C.panel}/>
      <LP x="14" y="14" w="60" h="7" color={C.navy}/>
      {[0,1,2,3,4].map(i => (
        <g key={i}>
          <rect x="14" y={28+i*17} width="68" height="13" rx="4"
            fill={i===0?C.mid:C.grid} opacity={i===0?0.2:0.5}/>
          <circle cx="20" cy={28+i*17+6} r="4" fill={i===0?C.mid:C.soft} opacity="0.8"/>
          <LP x="28" y={30+i*17} w={32+(i%3)*8} h="5" color={i===0?C.mid:C.navy}/>
        </g>
      ))}
      <LP x="14" y="102" w="44" h="6" color={C.soft}/>
      {/* Arrow */}
      <path d="M92 65 L106 65 M102 61 L106 65 L102 69" stroke={C.mid} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Results batch */}
      <rect x="110" y="8" width="82" height="110" rx="8" fill={C.panel}/>
      <LP x="116" y="14" w="60" h="7" color={C.navy}/>
      {[0,1,2,3,4].map(i => (
        <g key={i}>
          <rect x="116" y={28+i*17} width="70" height="13" rx="4" fill={C.panel} opacity="0.7"/>
          <circle cx="122" cy={28+i*17+6} r="4" fill={C.accent} opacity={0.9-i*0.12}/>
          <LP x="130" y={30+i*17} w={28+(i%3)*10} h="5" color={C.navy}/>
          <LP x="130" y={30+i*17+8} w={22+(i%2)*8} h="4" color={C.soft}/>
        </g>
      ))}
      {/* Async badge */}
      <rect x="116" y="102" width="54" height="10" rx="5" fill={C.accent} opacity="0.85"/>
      <LP x="122" y="105" w="42" h="5" color={C.white}/>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   POI DETAILS & PHOTOS APIS
   ══════════════════════════════════════════════════════════════════════════════ */

export function L_POIDetails() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg} rx="12"/>
      <DW/>
      {/* POI header */}
      <rect x="8" y="8" width="184" height="28" rx="8" fill={C.panel}/>
      <circle cx="22" cy="22" r="8" fill={C.mid} opacity="0.7"/>
      <LP x="36" y="12" w="90" h="8" color={C.navy}/>
      <LP x="36" y="24" w="60" h="6" color={C.soft}/>
      {/* Star rating */}
      {[0,1,2,3,4].map(i => (
        <text key={i} x={140+i*10} y="25" fontSize="9" fill={i<4?C.warn:C.soft} opacity={i<4?1:0.4}>★</text>
      ))}
      {/* Info rows */}
      <rect x="8" y="44" width="184" height="12" rx="4" fill={C.panel} opacity="0.7"/>
      <LP x="14" y="47" w="28" h="6" color={C.soft}/>
      <LP x="60" y="47" w="100" h="6" color={C.navy}/>
      <rect x="8" y="60" width="184" height="12" rx="4" fill={C.panel} opacity="0.7"/>
      <LP x="14" y="63" w="28" h="6" color={C.soft}/>
      <LP x="60" y="63" w="80" h="6" color={C.navy}/>
      <rect x="8" y="76" width="184" height="12" rx="4" fill={C.panel} opacity="0.7"/>
      <LP x="14" y="79" w="28" h="6" color={C.soft}/>
      <LP x="60" y="79" w="110" h="6" color={C.mid}/>
      {/* Popular hours mini-chart */}
      <rect x="8" y="96" width="184" height="26" rx="6" fill={C.panel}/>
      <LP x="14" y="101" w="50" h="6" color={C.soft}/>
      {[14,22,28,18,30,28,20,10,8].map((h,i) => (
        <rect key={i} x={80+i*10} y={115-h/2} width="7" height={h/2} rx="1" fill={C.mid} opacity="0.7"/>
      ))}
    </svg>
  );
}

export function L_POIPhotos() {
  const { palette: C } = useIlloStyle();
  const photoColors = [C.mid, C.soft, C.accent, C.panel, C.grid, C.soft];
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg} rx="12"/>
      <DW/>
      {/* Large featured photo */}
      <rect x="8" y="8" width="120" height="80" rx="8" fill={photoColors[0]} opacity="0.7"/>
      {/* Landscape lines in photo */}
      <rect x="8" y="56" width="120" height="32" rx="0 0 8 8" fill={C.dark} opacity="0.3"/>
      <LP x="14" y="62" w="80" h="7" color={C.white}/>
      <LP x="14" y="73" w="50" h="5" color={C.white}/>
      {/* Small photo grid */}
      {[0,1,2].map(i => (
        <rect key={i} x={132} y={8+i*28} width="60" height="24" rx="4"
          fill={photoColors[i+2]} opacity="0.65"/>
      ))}
      {/* Orbis-only badge */}
      <rect x="8" y="96" width="76" height="16" rx="8" fill={C.accent} opacity="0.9"/>
      <LP x="14" y="100" w="64" h="8" color={C.white}/>
      {/* Resolution chip */}
      <rect x="90" y="96" width="80" height="16" rx="8" fill={C.panel}/>
      <LP x="96" y="100" w="68" h="8" color={C.navy}/>
      {/* Count */}
      <rect x="8" y="118" width="50" height="8" rx="4" fill={C.panel}/>
      <LP x="14" y="121" w="38" h="4" color={C.soft}/>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   TRAFFIC ANALYTICS (standalone)
   ══════════════════════════════════════════════════════════════════════════════ */

export function L_TrafficStats() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg} rx="12"/>
      <DW/>
      <LP x="8" y="8" w="110" h="9" color={C.navy}/>
      <LP x="8" y="22" w="70" h="6" color={C.soft}/>
      {/* Speed trend chart */}
      <rect x="8" y="34" width="184" height="60" rx="6" fill={C.panel}/>
      {/* Y axis labels */}
      <LP x="12" y="38" w="14" h="5" color={C.soft}/>
      <LP x="12" y="54" w="14" h="5" color={C.soft}/>
      <LP x="12" y="70" w="14" h="5" color={C.soft}/>
      {/* Speed lines */}
      <path d="M30 82 L50 70 L70 65 L90 58 L110 62 L130 55 L150 60 L170 52 L188 48"
        stroke={C.mid} strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M30 88 L50 82 L70 76 L90 72 L110 78 L130 72 L150 75 L170 68 L188 65"
        stroke={C.soft} strokeWidth="1.5" strokeLinecap="round" fill="none" strokeDasharray="3 2"/>
      {/* Percentile bands */}
      <path d="M30 82 L50 70 L70 65 L90 58 L110 62 L130 55 L150 60 L170 52 L188 48 L188 65 L170 68 L150 75 L130 72 L110 78 L90 72 L70 76 L50 82 L30 88 Z"
        fill={C.mid} opacity="0.1"/>
      {/* Legend */}
      <rect x="8" y="100" width="184" height="22" rx="6" fill={C.panel}/>
      <LP x="14" y="105" w="6" h="6" color={C.mid}/>
      <LP x="24" y="105" w="50" h="6" color={C.navy}/>
      <LP x="80" y="105" w="6" h="6" color={C.soft}/>
      <LP x="90" y="105" w="50" h="6" color={C.navy}/>
      <LP x="14" y="114" w="80" h="5" color={C.soft}/>
    </svg>
  );
}

export function L_AreaAnalytics() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.grid} rx="12"/>
      <DW/>
      {/* Map base */}
      <path d="M0 65 Q100 60 200 65" stroke={C.bg} strokeWidth="7" opacity="0.4"/>
      <path d="M100 0 L100 130" stroke={C.bg} strokeWidth="5" opacity="0.35"/>
      {/* Analysis zone polygon */}
      <path d="M50 30 L130 25 L155 75 L120 105 L45 100 L25 60 Z"
        fill={C.mid} fillOpacity="0.18" stroke={C.mid} strokeWidth="1.5" strokeDasharray="4 3"/>
      {/* Congestion heatmap cells inside zone */}
      {[[65,45],[90,42],[110,50],[80,68],[105,70],[130,60],[70,85],[100,85]].map(([px,py],i) => (
        <circle key={i} cx={px} cy={py} r={8-i%3} fill={[C.accent,C.warn,C.danger,C.accent,C.mid][i%5]} opacity={0.5+i%3*0.1}/>
      ))}
      {/* Stats card */}
      <rect x="8" y="8" width="80" height="46" rx="6" fill={C.panel}/>
      <LP x="14" y="13" w="60" h="6" color={C.navy}/>
      <LP x="14" y="23" w="44" h="8" color={C.mid}/>
      <LP x="14" y="36" w="60" h="5" color={C.soft}/>
      <LP x="14" y="45" w="44" h="5" color={C.soft}/>
    </svg>
  );
}

export function L_ODAnalysis() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg} rx="12"/>
      <DW/>
      {/* Origin zones */}
      {[[15,20],[15,65],[15,105]].map(([x,y],i) => (
        <g key={i}>
          <rect x={x} y={y-12} width="30" height="24" rx="6" fill={C.mid} opacity={0.8-i*0.15}/>
          <LP x={x+4} y={y-5} w="22" h="8" color={C.white}/>
        </g>
      ))}
      {/* Flow lines (OD pairs) */}
      {[[30,20,160,28],[30,65,160,65],[30,105,160,98],[30,20,160,98],[30,65,160,28]].map(([x1,y1,x2,y2],i) => (
        <path key={i} d={`M${x1} ${y1} C80 ${y1} 120 ${y2} ${x2} ${y2}`}
          stroke={C.soft} strokeWidth={3-i*0.4} opacity={0.6-i*0.08} fill="none"/>
      ))}
      {/* Destination zones */}
      {[[160,28],[160,65],[160,98]].map(([x,y],i) => (
        <g key={i}>
          <rect x={x} y={y-12} width="30" height="24" rx="6" fill={C.accent} opacity={0.85-i*0.12}/>
          <LP x={x+4} y={y-5} w="22" h="8" color={C.white}/>
        </g>
      ))}
      {/* Matrix result */}
      <rect x="60" y="6" width="80" height="14" rx="7" fill={C.panel}/>
      <LP x="66" y="9" w="68" h="8" color={C.navy}/>
    </svg>
  );
}

export function L_JunctionAnalytics() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.grid} rx="12"/>
      <DW/>
      {/* Roads meeting at junction */}
      <path d="M0 65 L200 65" stroke={C.bg} strokeWidth="12" opacity="0.5"/>
      <path d="M100 0 L100 130" stroke={C.bg} strokeWidth="10" opacity="0.5"/>
      {/* Junction box */}
      <rect x="80" y="45" width="40" height="40" rx="4" fill={C.bg} opacity="0.7"/>
      {/* Turn movement arrows */}
      {[[88,55,88,70,'↓'],[100,73,115,73,'→'],[112,55,112,55,'↑'],[88,65,100,65,'⬐']].map(([,,,,txt],i) => (
        <text key={i} x={[88,108,112,94][i]} y={[75,68,60,68][i]} fontSize="8" fill={C.mid} textAnchor="middle">{['↓','→','↑','↳'][i]}</text>
      ))}
      {/* Flow indicator bars */}
      {[[8,8,70,'N approach'],[8,28,50,'S approach'],[8,48,85,'E approach'],[8,68,40,'W approach']].map(([x,y,w,],i) => (
        <g key={i}>
          <rect x={130} y={8+i*24} width="62" height="18" rx="4" fill={C.panel}/>
          <LP x={136} y={12+i*24} w="50" h="5" color={C.soft}/>
          <rect x={136} y={20+i*24} width={50} height="4" rx="2" fill={C.grid}/>
          <rect x={136} y={20+i*24} width={[38,26,44,20][i]} height="4" rx="2" fill={[C.accent,C.mid,C.warn,C.soft][i]}/>
        </g>
      ))}
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   makeThumb factory
   Returns a React component that reads IlloStyleContext and renders Dark or Light.
   Safe to call at module level (hook is only invoked at render time).
   ══════════════════════════════════════════════════════════════════════════════ */

export function makeThumb(Dark, Light) {
  function IlloSwitch() {
    const { illoStyle } = useIlloStyle();
    return (illoStyle === 'detailed' && Dark) ? <Dark /> : <Light />;
  }
  IlloSwitch.displayName = `IlloSwitch(${Dark?.name || 'Dark'}/${Light?.name || 'Light'})`;
  return IlloSwitch;
}
