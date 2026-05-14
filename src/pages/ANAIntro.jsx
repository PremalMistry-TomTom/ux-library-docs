import { useTranslation } from 'react-i18next';
import Callout from '../components/ui/Callout';
import PageActions from '../components/ui/PageActions';
import { useIlloStyle } from '../context/IlloStyleContext';
import { makeThumb, L_VIL, L_CIL, L_ANATheming, L_ANA_Traffic, L_ANA_Map, L_ANA_EVSearch, L_ANA_LDRoute, L_ANA_DriverExp } from '../illustrations/lightVariants';
import {
  IcoADAS, IcoAIConfig, IcoAIVoice, IcoAreaAnalytics, IcoBatchRouting,
  IcoCalculateRoute, IcoCluster, IcoETAPanel, IcoEV, IcoEVBattery,
  IcoEVChargingAvailability, IcoEVNavUI, IcoEVRequirements, IcoEVRouting, IcoEVSearchNearby,
  IcoFuelPrices, IcoGeocode, IcoHUD, IcoHomeScreen, IcoHorizonPanel,
  IcoInstructionPanel, IcoIntentRouting, IcoJunctionAnalytics, IcoMapDisplay,
  IcoMapRasterTile, IcoMapSatelliteTile, IcoMapStaticImage, IcoMapVectorTile, IcoMatrixRouting,
  IcoNavControls, IcoNavGuidance, IcoNavSDKAdvanced, IcoNavSDKLocation, IcoNavSDKNavigation,
  IcoNavSDKOffline, IcoNavSDKRouting, IcoNavSDKSearch, IcoNavSDKVirtualHorizon,
  IcoODAnalysis, IcoOnStreetParking, IcoPOIDetails, IcoPOIPhotos, IcoParkingAvailability,
  IcoParkingPrices, IcoReachableRange, IcoReverseGeocode, IcoRouteBar, IcoRoutingWeather,
  IcoSearchAlongRoute, IcoSearchAutocomplete, IcoSearchFuzzy, IcoSearchNearby, IcoSearchPOI,
  IcoSnapToRoads, IcoSpeechToText, IcoTrafficFlow, IcoTrafficFlowTile, IcoTrafficIncidents,
  IcoTrafficModelID, IcoTrafficStats, IcoTruck, IcoTurnInstructions, IcoVIBasics,
  IcoVoiceEngine, IcoWaypointOpt,
} from '../illustrations/iconVariants';

const BASE = import.meta.env.BASE_URL;

/* ─── Inline cross-product link ─────────────────────────────────────────────── */
function DocLink({ children, pageId, productId, onNavigate }) {
  return (
    <button
      onClick={() => onNavigate?.(pageId, productId)}
      style={{ background: 'none', border: 'none', padding: 0, color: 'var(--red, #e2001a)', fontWeight: 600, cursor: 'pointer', fontSize: 'inherit', textDecoration: 'underline', textUnderlineOffset: '2px' }}
    >
      {children}
    </button>
  );
}

function WhenCard({ icon, title, children }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 20, padding: '12px 14px', background: 'var(--surface)' }}>
      <div style={{ display: 'flex', gap: 7, alignItems: 'flex-start', marginBottom: 4 }}>
        <span style={{ fontSize: '0.875rem', lineHeight: 1.2 }}>{icon}</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)' }}>{title}</span>
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}

/* ─── Integration layer diagram ─────────────────────────────────────────────── */
function IntegrationDiagram({ t }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxWidth: 600 }}>
      {/* OEM App layer */}
      <div style={{ background: 'rgba(0,102,204,0.09)', border: '1px solid rgba(0,102,204,0.3)', borderRadius: '8px 8px 0 0', padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0066cc', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t('anaIntro.archLayers.yourLayer')}</span>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['OEM HMI App', 'Vehicle ECU / IVI', 'EV Battery System', 'Dashboard Cluster'].map(item => (
            <span key={item} style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: 4, background: 'rgba(0,102,204,0.12)', border: '1px solid rgba(0,102,204,0.25)', color: '#0066cc', fontWeight: 500 }}>{item}</span>
          ))}
        </div>
      </div>

      {/* Arrows down */}
      <div style={{ display: 'flex', gap: 8, padding: '2px 0', justifyContent: 'center' }}>
        {['VIL', 'CIL'].map(label => (
          <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <div style={{ width: 1, height: 6, background: 'var(--border)' }}/>
            <span style={{ fontSize: '0.5rem', color: 'var(--muted)', fontWeight: 600 }}>{label}</span>
            <div style={{ width: 1, height: 6, background: 'var(--border)' }}/>
          </div>
        ))}
      </div>

      {/* Integration layers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
        <div style={{ background: 'rgba(63,185,80,0.08)', border: '1px solid rgba(63,185,80,0.3)', borderRadius: 6, padding: '10px 14px' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#3fb950', marginBottom: 4 }}>{t('anaIntro.archLayers.vilTitle')}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            {t('anaIntro.archLayers.vilDesc')}
          </div>
          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {['EV SoC', 'Connectors', 'Speed', 'GDPR', 'Cluster'].map(tag => (
              <span key={tag} style={{ fontSize: '0.875rem', padding: '1px 5px', borderRadius: 3, background: 'rgba(63,185,80,0.1)', color: '#3fb950', border: '1px solid rgba(63,185,80,0.2)' }}>{tag}</span>
            ))}
          </div>
        </div>
        <div style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 6, padding: '10px 14px' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#a855f7', marginBottom: 4 }}>{t('anaIntro.archLayers.cilTitle')}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            {t('anaIntro.archLayers.cilDesc')}
          </div>
          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {['Navigate to', 'Route info', 'POI search', 'ETA', 'Cancel'].map(tag => (
              <span key={tag} style={{ fontSize: '0.875rem', padding: '1px 5px', borderRadius: 3, background: 'rgba(168,85,247,0.1)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.2)' }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Arrow */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2px 0' }}>
        <div style={{ width: 1, height: 12, background: 'var(--border)' }}/>
      </div>

      {/* ANA core */}
      <div style={{ background: 'rgba(226,0,26,0.08)', border: '1px solid rgba(226,0,26,0.3)', borderRadius: '0 0 8px 8px', padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#e2001a' }}/>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#e2001a' }}>{t('anaIntro.archLayers.anaTitle')}</span>
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.4 }}>
          {t('anaIntro.archLayers.anaDesc')}
        </div>
      </div>
    </div>
  );
}

/* ─── New dark Thumb components for hero illustrations ───────────────────────── */
function ThumbANATraffic() {
  const { palette: C } = useIlloStyle();
  const M = { bg: C.bg, dark: C.dark, card: C.panel, line: C.border, text: C.navy, dim: C.mid, green: C.accent, blue: C.mid };
  return (
    <div style={{ background: M.bg, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <svg width="100%" height="100%" viewBox="0 0 100 70" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute' }}>
          <rect width="100" height="70" fill={M.bg}/>
          <path d="M5 65 Q35 42 55 36 T95 18" stroke={M.blue} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.65"/>
          <path d="M5 65 Q40 30 68 26 T95 18" stroke={M.green} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="5 3" fill="none" opacity="0.55"/>
          <circle cx="55" cy="36" r="4" fill={M.blue} opacity="0.8"/>
        </svg>
      </div>
      <div style={{ padding: '6px 8px', background: M.dark, borderTop: `1px solid ${M.line}` }}>
        <div style={{ fontSize: '0.5rem', fontWeight: 700, color: M.text, marginBottom: 2 }}>Better route</div>
        <div style={{ fontSize: '0.5rem', color: M.green, marginBottom: 5 }}>6 min faster · Less traffic</div>
        <div style={{ display: 'flex', gap: 4 }}>
          <div style={{ flex: 1, background: M.blue, borderRadius: 3, padding: '3px 0', textAlign: 'center', fontSize: '0.45rem', color: '#fff', fontWeight: 600 }}>Accept</div>
          <div style={{ flex: 1, background: 'transparent', border: `1px solid ${M.line}`, borderRadius: 3, padding: '3px 0', textAlign: 'center', fontSize: '0.45rem', color: M.dim }}>Dismiss</div>
        </div>
      </div>
    </div>
  );
}

function ThumbANAMap() {
  const { palette: C } = useIlloStyle();
  const M = { bg: C.bg, dark: C.dark, card: C.panel, line: C.border, text: C.navy, dim: C.mid, blue: C.mid };
  return (
    <div style={{ background: M.bg, height: '100%', position: 'relative', overflow: 'hidden' }}>
      <svg width="100%" height="100%" viewBox="0 0 120 80" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute' }}>
        <rect width="120" height="80" fill={M.bg}/>
        {/* Road grid */}
        <path d="M0 42 Q30 38 60 42 T120 38" stroke={M.card} strokeWidth="5"/>
        <line x1="45" y1="0" x2="44" y2="80" stroke={M.card} strokeWidth="4"/>
        <line x1="88" y1="0" x2="86" y2="80" stroke={M.card} strokeWidth="4"/>
        {/* Buildings */}
        <rect x="6" y="12" width="20" height="16" rx="1" fill={M.line}/>
        <rect x="28" y="8" width="12" height="20" rx="1" fill={M.line}/>
        <rect x="52" y="6" width="16" height="24" rx="1" fill={M.card}/>
        <rect x="92" y="10" width="18" height="17" rx="1" fill={M.line}/>
        {/* Route */}
        <path d="M12 72 Q40 50 60 44 T108 24" stroke={M.blue} strokeWidth="2.5" strokeLinecap="round" opacity="0.8"/>
        <circle cx="60" cy="44" r="4" fill={M.blue}/>
        <circle cx="60" cy="44" r="2" fill={M.dark}/>
      </svg>
      <div style={{ position: 'absolute', top: 6, left: 6, background: M.dark, borderRadius: 4, padding: '2px 5px' }}>
        <span style={{ fontSize: '0.4rem', color: M.text, fontWeight: 600 }}>3D Vector Map</span>
      </div>
    </div>
  );
}

function ThumbANAEVSearch() {
  const { palette: C } = useIlloStyle();
  const M = { bg: C.bg, card: C.panel, line: C.border, text: C.navy, dim: C.mid, green: C.accent, blue: C.mid };
  const stations = [['Ionity','350 kW','3/4'], ['Fastned','300 kW','2/4'], ['bp pulse','50 kW','5/6']];
  return (
    <div style={{ background: M.bg, height: '100%', padding: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ background: M.card, border: `1px solid ${M.line}`, borderRadius: 4, padding: '3px 6px', fontSize: '0.45rem', color: M.dim }}>🔍 Charging stations near me…</div>
      <div style={{ flex: 1, display: 'flex', gap: 4 }}>
        <div style={{ width: '42%', background: M.card, borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
          <svg width="100%" height="100%" viewBox="0 0 40 60" style={{ position: 'absolute' }}>
            <rect width="40" height="60" fill={M.card}/>
            {[[12,22,M.green],[22,14,M.blue],[30,32,M.blue]].map(([cx,cy,col],i) => (
              <g key={i}><circle cx={cx} cy={cy} r="5" fill={col} opacity="0.8"/><text x={cx} y={cy+2} textAnchor="middle" fill="#fff" style={{fontSize:5}}>⚡</text></g>
            ))}
          </svg>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {stations.map(([name, kw, avail], i) => (
            <div key={name} style={{ background: M.card, border: `1px solid ${i===0?M.green:M.line}`, borderRadius: 3, padding: '3px 4px' }}>
              <div style={{ fontSize: '0.45rem', fontWeight: 600, color: M.text }}>{name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.4rem', color: M.dim }}>⚡ {kw}</span>
                <span style={{ fontSize: '0.4rem', color: M.green }}>{avail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ThumbANALDRoute() {
  const { palette: C } = useIlloStyle();
  const M = { bg: C.bg, card: C.panel, line: C.border, text: C.navy, dim: C.mid, green: C.accent, blue: C.mid };
  return (
    <div style={{ background: M.bg, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <svg width="100%" height="100%" viewBox="0 0 120 75" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute' }}>
          <rect width="120" height="75" fill={M.bg}/>
          <path d="M10 68 Q35 48 56 42 Q78 36 96 30 T116 18" stroke={M.blue} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.75"/>
          {[[56,42],[96,30]].map(([cx,cy],i) => (
            <g key={i}><circle cx={cx} cy={cy} r="7" fill={M.card} stroke={M.green} strokeWidth="1.5"/><text x={cx} y={cy+2} textAnchor="middle" fill={M.green} style={{fontSize:6}}>⚡</text></g>
          ))}
          <circle cx="10" cy="68" r="5" fill={M.green}/>
          <circle cx="116" cy="18" r="5" fill={M.blue}/>
        </svg>
      </div>
      <div style={{ padding: '5px 8px', background: M.card, borderTop: `1px solid ${M.line}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <span style={{ fontSize: '0.45rem', color: M.text, fontWeight: 600 }}>5 hr 26 min · 513 km</span>
          <span style={{ fontSize: '0.45rem', color: M.green }}>78% arrival</span>
        </div>
        <div style={{ background: M.line, borderRadius: 3, height: 5, overflow: 'hidden' }}>
          <div style={{ background: M.green, width: '78%', height: '100%', borderRadius: 3 }}/>
        </div>
      </div>
    </div>
  );
}

function ThumbANADriverExp() {
  const { palette: C } = useIlloStyle();
  const M = { bg: C.bg, dark: C.dark, card: C.panel, line: C.border, text: C.navy, dim: C.mid, blue: C.mid };
  return (
    <div style={{ background: M.dark, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* NIP */}
      <div style={{ padding: '5px 8px', display: 'flex', alignItems: 'center', gap: 5, borderBottom: `1px solid ${M.card}` }}>
        <div style={{ fontSize: '0.6rem', color: M.text }}>↱</div>
        <div>
          <div style={{ fontSize: '0.45rem', fontWeight: 700, color: M.text }}>Turn right · 320 m</div>
          <div style={{ fontSize: '0.4rem', color: M.dim }}>onto Main St</div>
        </div>
      </div>
      {/* Map */}
      <div style={{ flex: 1, background: M.bg, position: 'relative', overflow: 'hidden' }}>
        <svg width="100%" height="100%" viewBox="0 0 100 50" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute' }}>
          <rect width="100" height="50" fill={M.bg}/>
          <path d="M5 45 Q40 28 65 32 T98 18" stroke={M.blue} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.65"/>
          <circle cx="65" cy="32" r="4" fill={M.blue}/><circle cx="65" cy="32" r="2" fill={M.dark}/>
        </svg>
      </div>
      {/* ETA bar */}
      <div style={{ display: 'flex', padding: '4px 8px', gap: 0, justifyContent: 'space-around', borderTop: `1px solid ${M.card}` }}>
        {[['14:32','ETA'],['22m','Time'],['8.4km','Dist']].map(([v,l]) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.5rem', fontWeight: 700, color: M.text }}>{v}</div>
            <div style={{ fontSize: '0.4rem', color: M.dim }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Feature card thumbnails ────────────────────────────────────────────────── */
function ThumbPhoto({ src, objectPosition = 'center top' }) {
  return (
    <img
      src={`${BASE}${src}`}
      alt=""
      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition, display: 'block' }}
    />
  );
}

function ThumbVIL() {
  const { palette: C } = useIlloStyle();
  const M = { bg: C.bg, card: C.panel, line: C.border, text: C.navy, dim: C.mid, green: C.accent };
  const signals = [['Battery SoC', '74%', C.accent], ['Connector type', 'CCS2', C.mid], ['Speed', '87 km/h', C.warn], ['GDPR consent', 'Granted', C.accent]];
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: M.text, marginBottom: 2 }}>VIL — Vehicle signals</div>
      <div style={{ fontSize: '0.5rem', color: M.green, marginBottom: 8 }}>← Feeding into ANA</div>
      {signals.map(([label, value, color]) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0', borderBottom: `1px solid ${M.line}` }}>
          <div style={{ flex: 1, fontSize: '0.5rem', color: M.dim }}>{label}</div>
          <span style={{ fontSize: '0.5rem', fontWeight: 600, color }}>{value}</span>
        </div>
      ))}
    </div>
  );
}

function ThumbCIL() {
  const { palette: C } = useIlloStyle();
  const M = { bg: C.bg, card: C.panel, line: C.border, text: C.navy, dim: C.mid, purple: C.accent };
  const cmds = [['navigateTo(destination)', 'Sets active route'], ['cancelNavigation()', 'Ends session'], ['searchNearby(query)', 'Returns POI list']];
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: M.text, marginBottom: 2 }}>CIL — Control API</div>
      <div style={{ fontSize: '0.5rem', color: M.purple, marginBottom: 8 }}>→ Commanding ANA</div>
      {cmds.map(([fn, desc]) => (
        <div key={fn} style={{ background: M.card, border: `1px solid ${M.line}`, borderRadius: 4, padding: '5px 7px', marginBottom: 4 }}>
          <div style={{ fontSize: '0.5rem', fontFamily: 'monospace', color: M.purple }}>{fn}</div>
          <div style={{ fontSize: '0.5rem', color: M.dim, marginTop: 1 }}>{desc}</div>
        </div>
      ))}
    </div>
  );
}

function ThumbTheming() {
  const { palette: C } = useIlloStyle();
  const tokens = [
    { name: '--brand-primary', from: '#e2001a', to: '#0066ff' },
    { name: '--corner-radius', from: '4dp', to: '12dp', text: true },
    { name: '--font-family', from: 'Roboto', to: 'Inter', text: true },
  ];
  return (
    <div style={{ background: C.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: '10px 12px' }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: C.mid, marginBottom: 9, textTransform: 'uppercase', letterSpacing: '0.06em' }}>OEM Theme tokens</div>
      {tokens.map(({ name, from, to, text }) => (
        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
          {!text
            ? <div style={{ width: 26, height: 14, borderRadius: 3, background: from, flexShrink: 0 }} />
            : <div style={{ width: 26, height: 14, borderRadius: 3, background: C.panel, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '0.5rem', color: '#e2001a', fontFamily: 'monospace' }}>{from}</span>
              </div>}
          <span style={{ fontSize: '0.5rem', color: C.mid, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>{name}</span>
          <span style={{ fontSize: '0.875rem', color: C.navy }}>→</span>
          {!text
            ? <div style={{ width: 26, height: 14, borderRadius: 3, background: to, flexShrink: 0 }} />
            : <div style={{ width: 26, height: 14, borderRadius: 3, background: C.panel, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '0.5rem', color: '#0066ff', fontFamily: 'monospace' }}>{to}</span>
              </div>}
        </div>
      ))}
    </div>
  );
}

/* ─── Feature card ───────────────────────────────────────────────────────────── */
function FeatureCard({ Thumb, src, objectPosition, title, desc, tag, pageId, onNavigate }) {
  const clickable = Boolean(pageId && onNavigate);
  const { theme, palette } = useIlloStyle();
  return (
    <div
      style={{ cursor: clickable ? 'pointer' : 'default', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--white)', transition: 'box-shadow 0.15s, border-color 0.15s', display: 'flex', flexDirection: 'column' }}
      onClick={clickable ? () => onNavigate(pageId) : undefined}
      onMouseEnter={clickable ? e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'; e.currentTarget.style.borderColor = 'var(--red)'; } : undefined}
      onMouseLeave={clickable ? e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; } : undefined}
    >
      <div style={{ height: 130, background: theme !== 'dark' && !src ? palette.bg : '#0d1117', overflow: 'hidden', flexShrink: 0 }}>
        {src
          ? <ThumbPhoto src={src} objectPosition={objectPosition} />
          : <div style={{ padding: theme !== 'dark' ? 0 : 10, height: '100%' }}><Thumb /></div>
        }
      </div>
      <div style={{ padding: '12px 14px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--black)' }}>{title}</div>
          {tag && <span style={{ fontSize: '0.875rem', padding: '1px 6px', borderRadius: 3, background: 'rgba(226,0,26,0.08)', color: '#e2001a', fontWeight: 600 }}>{tag}</span>}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.5 }}>{desc}</div>
      </div>
    </div>
  );
}

/* ─── In-car showcase ────────────────────────────────────────────────────────── */
function ScreenshotShowcase({ t }) {
  const { theme, palette } = useIlloStyle();
  const ITEMS = [
    { labelKey: 'liveTraffic', Thumb: makeThumb(ThumbANATraffic,   L_ANA_Traffic, IcoTrafficFlow)   },
    { labelKey: 'premiumMap',  Thumb: makeThumb(ThumbANAMap,       L_ANA_Map, IcoMapDisplay)        },
    { labelKey: 'evCharging',  Thumb: makeThumb(ThumbANAEVSearch,  L_ANA_EVSearch, IcoEVSearchNearby)   },
    { labelKey: 'ldEvRoute',   Thumb: makeThumb(ThumbANALDRoute,   L_ANA_LDRoute, IcoEVRouting)    },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
      {ITEMS.map(({ labelKey, Thumb }) => (
        <div key={labelKey} style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--surface)' }}>
          <div style={{ height: 160, overflow: 'hidden', background: theme !== 'dark' ? palette.bg : '#0d1117' }}>
            <Thumb />
          </div>
          <div style={{ padding: '10px 12px' }}>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--black)', marginBottom: 3 }}>{t(`anaIntro.screenshots.${labelKey}.label`)}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.5 }}>{t(`anaIntro.screenshots.${labelKey}.desc`)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────────── */
export default function ANAIntro({ onNavigate }) {
  const { t } = useTranslation('pages');

  const FEATURES = [
    {
      Thumb: makeThumb(ThumbANADriverExp, L_ANA_DriverExp, IcoNavGuidance),
      title: t('anaIntro.features.driverExperience.title'),
      desc: t('anaIntro.features.driverExperience.desc'),
      pageId: 'ana-driver-experience',
    },
    {
      Thumb: makeThumb(ThumbVIL,    L_VIL, IcoNavSDKNavigation),
      title: t('anaIntro.features.vil.title'),
      desc: t('anaIntro.features.vil.desc'),
      pageId: 'ana-vil',
    },
    {
      Thumb: makeThumb(ThumbCIL,    L_CIL, IcoNavSDKNavigation),
      title: t('anaIntro.features.cil.title'),
      desc: t('anaIntro.features.cil.desc'),
      pageId: 'ana-cil',
      tag: t('anaIntro.features.cil.tag'),
    },
    {
      Thumb: makeThumb(ThumbTheming,L_ANATheming, IcoHomeScreen),
      title: t('anaIntro.features.theming.title'),
      desc: t('anaIntro.features.theming.desc'),
      pageId: 'ana-theming',
    },
    {
      Thumb: makeThumb(ThumbANAEVSearch, L_ANA_EVSearch, IcoEVSearchNearby),
      title: t('anaIntro.features.evSupport.title'),
      desc: t('anaIntro.features.evSupport.desc'),
      pageId: 'ana-vil-ev',
      tag: t('anaIntro.features.evSupport.tag'),
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>{t('anaIntro.title')}</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        {t('anaIntro.quickAnswer')}
      </p>
      <a
        href="https://www.tomtom.com/en_gb/automotive/contact/"
        target="_blank"
        rel="noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '7px 16px', borderRadius: 8, marginBottom: 28,
          border: 'none', background: 'var(--red)',
          color: '#fff', fontWeight: 700, fontSize: '0.875rem',
          textDecoration: 'none',
        }}
      >
        Contact Sales →
      </a>

      {/* Hero — real ANA UI screenshot */}
      <div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 36, border: '1px solid var(--border)' }}>
        <img
          src={`${BASE}ana_live_traffic.png`}
          alt={t('anaIntro.heroAlt')}
          style={{ width: '100%', display: 'block' }}
        />
      </div>

      {/* When to choose ANA */}
      <div className="zone">
        <h2 className="sh" id="ana-when">{t('anaIntro.whenTitle')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          <WhenCard icon="✅" title={t('anaIntro.whenCards.fastTimeToMarket.title')}>
            {t('anaIntro.whenCards.fastTimeToMarket.desc')}
          </WhenCard>
          <WhenCard icon="✅" title={t('anaIntro.whenCards.tomtomMaintained.title')}>
            {t('anaIntro.whenCards.tomtomMaintained.desc')}
          </WhenCard>
          <WhenCard icon="✅" title={t('anaIntro.whenCards.fullEvSupport.title')}>
            {t('anaIntro.whenCards.fullEvSupport.desc')}
          </WhenCard>
          <WhenCard icon="✅" title={t('anaIntro.whenCards.aaOsCertified.title')}>
            {t('anaIntro.whenCards.aaOsCertified.desc')}
          </WhenCard>
          <WhenCard icon="⚠️" title={t('anaIntro.whenCards.limitedCustomisation.title')}>
            {t('anaIntro.whenCards.limitedCustomisation.descPart1')}
            <DocLink pageId="overview" productId="ux-library" onNavigate={onNavigate}>{t('anaIntro.whenCards.limitedCustomisation.uxLibraryLink')}</DocLink>
            {t('anaIntro.whenCards.limitedCustomisation.descPart2')}
            <DocLink pageId="navsdk-intro" productId="navsdk" onNavigate={onNavigate}>{t('anaIntro.whenCards.limitedCustomisation.navSdkLink')}</DocLink>
            {t('anaIntro.whenCards.limitedCustomisation.descPart3')}
          </WhenCard>
          <WhenCard icon="⚠️" title={t('anaIntro.whenCards.apkDependency.title')}>
            {t('anaIntro.whenCards.apkDependency.desc')}
          </WhenCard>
        </div>
      </div>

      {/* Screenshot showcase */}
      <div className="zone">
        <h2 className="sh" id="ana-screenshots">{t('anaIntro.screenshotsTitle')}</h2>
        <p className="quick-answer" style={{ marginBottom: 20 }}>
          {t('anaIntro.screenshotsSubtitle')}
        </p>
        <ScreenshotShowcase t={t} />
      </div>

      {/* Features */}
      <div className="zone">
        <h2 className="sh" id="ana-features">{t('anaIntro.featuresTitle')}</h2>
        <p className="quick-answer" style={{ marginBottom: 20 }}>
          {t('anaIntro.featuresSubtitle')}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {FEATURES.map(f => (
            <FeatureCard key={f.pageId} {...f} onNavigate={onNavigate} />
          ))}
        </div>
      </div>

      {/* Integration architecture */}
      <div className="zone">
        <h2 className="sh" id="ana-arch">{t('anaIntro.archTitle')}</h2>
        <p className="body" style={{ marginBottom: 20 }}>
          {t('anaIntro.archBody')}
        </p>
        <IntegrationDiagram t={t} />
      </div>

      {/* Getting started CTA */}
      <div className="zone">
        <h2 className="sh" id="ana-start">{t('anaIntro.readyTitle')}</h2>
        <p className="body" style={{ marginBottom: 16 }}>
          {t('anaIntro.readyBody')}
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            className="page-action-btn"
            style={{ background: '#e2001a', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 6, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
            onClick={() => onNavigate?.('ana-system-overview')}
          >
            {t('anaIntro.ctaSystemOverview')}
          </button>
          <button
            className="page-action-btn"
            onClick={() => onNavigate?.('ana-quick-start')}
          >
            {t('anaIntro.ctaQuickStart')}
          </button>
        </div>
      </div>

      <Callout type="info">
        {t('anaIntro.callout')}
      </Callout>
    </div>
  );
}
