import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import { ApiLinks } from '../components/ui/ApiLinks';
import PageActions from '../components/ui/PageActions';

/* ─── Static IDs (no i18n needed — these are API identifiers) ────────────── */
const HP_ELEMENT_IDS  = ['SLG', 'CMP', 'JV', 'UEP', 'ETA'];
const NIP_LAYOUT_IDS  = ['LANDSCAPE_MINIMAL', 'LANDSCAPE_MEDIUM', 'LANDSCAPE_MAXIMAL', 'NORMAL_LAYOUT'];
const ETA_LAYOUT_IDS  = ['MINIMAL', 'MEDIUM', 'MAXIMAL', 'NORMAL_LAYOUT_WIDE'];
const CLUSTER_API_URL = 'https://docs.tomtom.com/automotive-solutions/en/guides/cluster';

/* ─── Lane arrow SVGs ─────────────────────────────────────────────────────── */
function LaneArrow({ type = 'straight', recommended = false }) {
  const col = recommended ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.28)';
  if (type === 'straight') return (
    <svg width="20" height="32" viewBox="0 0 10 16" fill={col}>
      <polygon points="5,0 10,5.5 7,5.5 7,16 3,16 3,5.5 0,5.5" />
    </svg>
  );
  if (type === 'right') return (
    <svg width="28" height="28" viewBox="0 0 14 14" fill={col}>
      <path d="M2 14 L2 8 Q2 3 7 3 L10.5 3 L8 0.5 L14 0.5 L14 6.5 L11.5 4 Q9 4 9 8 L9 14 Z" />
    </svg>
  );
  if (type === 'left') return (
    <svg width="28" height="28" viewBox="0 0 14 14" fill={col}>
      <path d="M12 14 L12 8 Q12 3 7 3 L3.5 3 L6 0.5 L0 0.5 L0 6.5 L2.5 4 Q5 4 5 8 L5 14 Z" />
    </svg>
  );
  return null;
}

/* ─── Cluster sub-panels (stacked top → bottom) ──────────────────────────── */

/* 1. NIP — next instruction panel */
function ClusterNIP({ layout }) {
  const isMinimal  = layout === 'LANDSCAPE_MINIMAL';
  const isMaximal  = layout === 'LANDSCAPE_MAXIMAL' || layout === 'NORMAL_LAYOUT';

  return (
    <div style={{
      padding: isMinimal ? '10px 20px' : '14px 20px',
      background: 'rgba(22, 50, 80, 0.97)',
      display: 'flex', alignItems: 'center', gap: 14,
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      flexShrink: 0,
    }}>
      {/* Turn icon */}
      <svg width={isMinimal ? 28 : 40} height={isMinimal ? 28 : 40} viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
        <path d="M3 20 L3 10 Q3 3 10 3 L15 3 L11.5 0 L20 0 L20 8 L16.5 5 Q13 5 13 10 L13 20 Z"
          fill="rgba(255,255,255,0.92)" />
      </svg>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: isMinimal ? '1rem' : '1.25rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>
          {isMinimal ? '800m' : '600 m'}
        </div>
        {!isMinimal && (
          <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', marginTop: 4, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            Walter P Chrysler…
          </div>
        )}
      </div>

      {isMaximal && (
        <div style={{
          flexShrink: 0, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: 3, padding: '2px 8px',
          fontSize: '0.75rem', color: 'white', fontWeight: 700, letterSpacing: '0.03em',
        }}>EXIT 32a</div>
      )}
    </div>
  );
}

/* 2. SLG — simple lane guidance: row of arrows beneath the instruction */
function ClusterSLG() {
  // 4 straight (non-recommended) + 2 right (recommended, matching the right-turn NIP)
  const LANES = [
    { type: 'straight', recommended: false },
    { type: 'straight', recommended: false },
    { type: 'straight', recommended: false },
    { type: 'straight', recommended: false },
    { type: 'right',    recommended: true  },
    { type: 'right',    recommended: true  },
  ];
  return (
    <div style={{
      padding: '10px 20px',
      background: 'rgba(14, 32, 54, 0.97)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      flexShrink: 0,
    }}>
      {LANES.map((lane, i) => (
        <LaneArrow key={i} type={lane.type} recommended={lane.recommended} />
      ))}
    </div>
  );
}

/* 3. CMP — consecutive maneuver: "Then →" */
function ClusterCMP() {
  return (
    <div style={{
      padding: '10px 20px',
      background: 'rgba(10, 24, 44, 0.97)',
      display: 'flex', alignItems: 'center', gap: 14,
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      flexShrink: 0,
    }}>
      <svg width="26" height="26" viewBox="0 0 14 14" fill="rgba(255,255,255,0.65)" style={{ flexShrink: 0 }}>
        <path d="M2 14 L2 8 Q2 3 7 3 L10.5 3 L8 0.5 L14 0.5 L14 6.5 L11.5 4 Q9 4 9 8 L9 14 Z" />
      </svg>
      <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>Then</span>
    </div>
  );
}

/* 4. JV — junction view schematic */
function ClusterJV() {
  return (
    <div style={{
      padding: '8px 20px',
      background: 'rgba(10, 24, 44, 0.97)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      flexShrink: 0,
    }}>
      <svg viewBox="0 0 50 30" width="100" height="60" fill="none">
        <line x1="25" y1="30" x2="25" y2="14" stroke="rgba(255,255,255,0.3)" strokeWidth="4"/>
        <line x1="25" y1="14" x2="10" y2="0"  stroke="rgba(255,255,255,0.2)" strokeWidth="3"/>
        <line x1="25" y1="14" x2="40" y2="0"  stroke="#e2001a" strokeWidth="3"/>
        <circle cx="25" cy="14" r="2.5" fill="#333"/>
        <polygon points="38,1 43,7 36,7" fill="#e2001a"/>
      </svg>
    </div>
  );
}

/* UEP — upcoming events */
function ClusterUEP() {
  return (
    <div style={{
      padding: '8px 20px',
      background: 'rgba(10, 24, 44, 0.97)',
      display: 'flex', alignItems: 'center', gap: 10,
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      flexShrink: 0,
    }}>
      {['📷', '⚠️', '🚧'].map(icon => (
        <span key={icon} style={{ fontSize: '1rem' }}>{icon}</span>
      ))}
    </div>
  );
}

/* 5. ETA — arrival time strip */
function ClusterETA({ layout }) {
  return (
    <div style={{
      padding: '8px 20px',
      background: 'rgba(6, 14, 28, 0.98)',
      display: 'flex', alignItems: 'center', gap: 10,
      marginTop: 'auto',
      flexShrink: 0,
    }}>
      <span style={{ fontSize: '1rem', fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>10:59 PM</span>
      {layout !== 'MINIMAL' && (
        <>
          <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.25)' }}>·</span>
          <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>26.5 km</span>
        </>
      )}
      {(layout === 'MAXIMAL' || layout === 'NORMAL_LAYOUT_WIDE') && (
        <>
          <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.25)' }}>·</span>
          <span style={{ fontSize: '0.875rem', color: '#f59e0b' }}>🔋 25%</span>
        </>
      )}
    </div>
  );
}

/* ─── Speedometer gauge ───────────────────────────────────────────────────── */
function SpeedGauge({ speed = 72 }) {
  const r = 38;
  const cx = 52, cy = 56;
  const C = 2 * Math.PI * r;
  const arcLen = C * (240 / 360);
  const offset = C * (150 / 360);
  const pct    = Math.min(speed / 160, 1);
  const fillLen = arcLen * pct;
  const needleAngle = -120 + pct * 240;
  const rad = (needleAngle - 90) * Math.PI / 180;
  const nx = cx + 28 * Math.cos(rad);
  const ny = cy + 28 * Math.sin(rad);

  return (
    <svg viewBox="0 0 104 104" style={{ width: 208, height: 208, flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e1e22" strokeWidth="5"
        strokeDasharray={`${arcLen} ${C - arcLen}`} strokeDashoffset={-offset} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e2001a" strokeWidth="5"
        strokeDasharray={`${fillLen} ${C - fillLen}`} strokeDashoffset={-offset}
        strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.3s' }} />
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      <circle cx={cx} cy={cy} r="3" fill="#444" />
      <text x={cx} y={cy + 6} textAnchor="middle" fill="white"
        style={{ fontSize: 15, fontWeight: 700, fontFamily: 'system-ui' }}>{speed}</text>
      <text x={cx} y={cy + 15} textAnchor="middle" fill="#555"
        style={{ fontSize: 6, fontFamily: 'system-ui' }}>km/h</text>
      {[0, 40, 80, 120, 160].map(v => {
        const a = (-120 + (v / 160) * 240 - 90) * Math.PI / 180;
        return <text key={v} x={cx + 46 * Math.cos(a)} y={cy + 46 * Math.sin(a) + 2}
          textAnchor="middle" fill="#3a3a3a" style={{ fontSize: 5, fontFamily: 'system-ui' }}>{v}</text>;
      })}
    </svg>
  );
}

/* ─── Battery gauge ───────────────────────────────────────────────────────── */
function BatteryGauge({ soc = 74 }) {
  const r = 38;
  const cx = 52, cy = 56;
  const C = 2 * Math.PI * r;
  const arcLen = C * (240 / 360);
  const offset = C * (150 / 360);
  const pct    = soc / 100;
  const fillLen = arcLen * pct;
  const color  = soc > 40 ? '#22c55e' : soc > 20 ? '#f59e0b' : '#ef4444';
  const needleAngle = -120 + pct * 240;
  const rad = (needleAngle - 90) * Math.PI / 180;
  const nx = cx + 28 * Math.cos(rad);
  const ny = cy + 28 * Math.sin(rad);

  return (
    <svg viewBox="0 0 104 104" style={{ width: 208, height: 208, flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e1e22" strokeWidth="5"
        strokeDasharray={`${arcLen} ${C - arcLen}`} strokeDashoffset={-offset} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={`${fillLen} ${C - fillLen}`} strokeDashoffset={-offset}
        strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.3s' }} />
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      <circle cx={cx} cy={cy} r="3" fill="#444" />
      <text x={cx} y={cy + 5} textAnchor="middle" fill={color}
        style={{ fontSize: 13, fontWeight: 700, fontFamily: 'system-ui' }}>{soc}%</text>
      <text x={cx} y={cy + 15} textAnchor="middle" fill="#555"
        style={{ fontSize: 5.5, fontFamily: 'system-ui' }}>BATTERY</text>
    </svg>
  );
}

/* ─── Map background ──────────────────────────────────────────────────────── */
function ClusterMapBg() {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      viewBox="0 0 220 130" preserveAspectRatio="xMidYMid slice" fill="none">
      <line x1="0" y1="40"  x2="220" y2="40"  stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
      <line x1="0" y1="75"  x2="220" y2="75"  stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
      <line x1="0" y1="110" x2="220" y2="110" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
      <line x1="50"  y1="0" x2="50"  y2="130" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
      <line x1="110" y1="0" x2="110" y2="130" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
      <line x1="170" y1="0" x2="170" y2="130" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
      <path d="M0 55 Q60 50 110 56 T220 52"  stroke="rgba(255,255,255,0.12)" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M0 90 Q70 85 110 90 T220 87"  stroke="rgba(255,255,255,0.09)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M110 0 Q112 55 110 95 T108 130" stroke="rgba(255,255,255,0.11)" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M0 55 Q60 50 110 56 T220 52" stroke="#e2001a" strokeWidth="3.5"
        strokeLinecap="round" opacity="0.8"/>
      <ellipse cx="185" cy="110" rx="40" ry="18" fill="rgba(20,50,90,0.35)"/>
      <circle cx="110" cy="55" r="4.5" fill="#e2001a" opacity="0.9"/>
      <circle cx="110" cy="55" r="8"   fill="rgba(226,0,26,0.2)"/>
    </svg>
  );
}

/* ─── Full cluster display ────────────────────────────────────────────────── */
export function ClusterDisplay({ showMap, showVignette, nipLayout, etaLayout, hpElements, showHp }) {
  const hasSLG = hpElements.includes('SLG');
  const hasCMP = hpElements.includes('CMP');
  const hasJV  = hpElements.includes('JV');
  const hasUEP = hpElements.includes('UEP');
  const hasETA = hpElements.includes('ETA');

  // Nav column visible if HP is on and there's anything to show
  const showNavCol = showHp && (nipLayout || hasSLG || hasCMP || hasJV || hasUEP || hasETA);

  return (
    <div style={{
      width: '100%',
      background: '#060608',
      borderRadius: 20,
      border: '2px solid #1c1c20',
      boxShadow: 'inset 0 0 30px rgba(0,0,0,0.6), 0 4px 20px rgba(0,0,0,0.4)',
      display: 'flex',
      alignItems: 'center',
      padding: '20px 12px',
      gap: 8,
      overflow: 'hidden',
    }}>
      <SpeedGauge speed={72} />

      {/* Center area: map + nav column side by side */}
      <div style={{
        flex: 1,
        height: 208,
        display: 'flex',
        borderRadius: 6,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.05)',
      }}>
        {/* Map area */}
        {showMap && (
          <div style={{ flex: 1, position: 'relative', background: '#0c1520', minWidth: 0 }}>
            <ClusterMapBg />
            {showVignette && (
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.65) 100%)',
              }} />
            )}
          </div>
        )}

        {/* Nav column — stacked panels */}
        {showNavCol && (
          <div style={{
            width: showMap ? '42%' : '100%',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(8, 18, 34, 0.98)',
            borderLeft: showMap ? '1px solid rgba(255,255,255,0.06)' : 'none',
            overflow: 'hidden',
          }}>
            {/* 1 · NIP */}
            <ClusterNIP layout={nipLayout} />
            {/* 2 · SLG */}
            {hasSLG && <ClusterSLG />}
            {/* 3 · CMP */}
            {hasCMP && <ClusterCMP />}
            {/* 4 · JV or UEP (horizon panel events) */}
            {hasJV  && <ClusterJV />}
            {hasUEP && !hasJV && <ClusterUEP />}
            {/* 5 · ETA — pushed to bottom */}
            {hasETA && <ClusterETA layout={etaLayout} />}
          </div>
        )}

        {/* Empty state */}
        {!showMap && !showNavCol && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0c' }}>
            <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.12)', fontFamily: 'var(--font-mono)' }}>
              display off
            </span>
          </div>
        )}
      </div>

      <BatteryGauge soc={74} />
    </div>
  );
}

/* ─── Main page ───────────────────────────────────────────────────────────── */
export default function Cluster() {
  const { t } = useTranslation('pages');

  const [showMap,      setShowMap]      = useState(true);
  const [showVignette, setShowVignette] = useState(true);
  const [showHp,       setShowHp]       = useState(true);
  const [nipLayout,    setNipLayout]    = useState('LANDSCAPE_MEDIUM');
  const [etaLayout,    setEtaLayout]    = useState('MEDIUM');
  const [hpElements,   setHpElements]   = useState(['SLG', 'CMP', 'ETA']);

  const toggleHpEl = id =>
    setHpElements(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  /* Translated data arrays derived from locale */
  const hpElementsData = HP_ELEMENT_IDS.map(id => ({
    id,
    label: t(`cluster.hpElements.${id}.label`),
    desc:  t(`cluster.hpElements.${id}.desc`),
  }));
  const nipLayoutsData = NIP_LAYOUT_IDS.map(id => ({
    id,
    label: t(`cluster.nipLayouts.${id}.label`),
    desc:  t(`cluster.nipLayouts.${id}.desc`),
  }));
  const etaLayoutsData = ETA_LAYOUT_IDS.map(id => ({
    id,
    label: t(`cluster.etaLayouts.${id}.label`),
    desc:  t(`cluster.etaLayouts.${id}.desc`),
  }));

  const clusterApis = [{
    name: 'Cluster Activity',
    type: 'Android SDK',
    description: t('cluster.apiDesc'),
    url: CLUSTER_API_URL,
  }];

  const toggleItems = [
    { key: 'map',          label: t('cluster.toggles.map'),          value: showMap,      set: setShowMap },
    { key: 'horizonPanel', label: t('cluster.toggles.horizonPanel'), value: showHp,       set: setShowHp },
    { key: 'vignette',     label: t('cluster.toggles.vignette'),     value: showVignette, set: setShowVignette },
  ];

  const configJson = JSON.stringify({
    displayHpComponent:        showHp,
    displayMapComponent:       showMap,
    displayVignette:           showVignette,
    hpElementsToShowOnCluster: hpElements,
    nipLayoutType:             nipLayout,
    etaLayoutType:             etaLayout,
  }, null, 2);

  return (
    <div className="page">
      <div className="page-header">
        <h1>{t('cluster.title')}</h1>
        <PageActions />
      </div>

      <div className="quick-answer">
        {t('cluster.intro')}
      </div>

      <ApiLinks items={clusterApis} />

      {/* ── Overview ───────────────────────────────────────────── */}
      <div className="zone">
        <h2 className="sh" id="cl-overview">{t('cluster.sections.overview')}</h2>
        <p className="body">{t('cluster.overviewBody')}</p>
        <Callout type="info">{t('cluster.overviewCallout')}</Callout>
      </div>

      {/* ── Starting the activity ──────────────────────────────── */}
      <div className="zone">
        <h2 className="sh" id="cl-start">{t('cluster.sections.start')}</h2>
        <p className="body">
          {t('cluster.startBody').split('clusterConfigurationUpdate').map((part, i, arr) =>
            i < arr.length - 1
              ? <span key={i}>{part}<code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85em' }}>clusterConfigurationUpdate</code></span>
              : <span key={i}>{part}</span>
          )}
        </p>
        <CodeBlock tabs={['Kotlin', 'ADB']}>
          {[
            <pre key="kt">
              <span className="hl-k">val</span>{' config = '}<span className="hl-s">"""</span>{'\n'}
              <span className="hl-s">{'{'}</span>{'\n'}
              <span className="hl-s">{'  "displayHpComponent": true,'}</span>{'\n'}
              <span className="hl-s">{'  "displayMapComponent": true,'}</span>{'\n'}
              <span className="hl-s">{'  "hpElementsToShowOnCluster": ["SLG", "CMP", "ETA"],'}</span>{'\n'}
              <span className="hl-s">{'  "nipLayoutType": "LANDSCAPE_MEDIUM",'}</span>{'\n'}
              <span className="hl-s">{'  "etaLayoutType": "MEDIUM"'}</span>{'\n'}
              <span className="hl-s">{'}'}</span>{'\n'}
              <span className="hl-s">"""</span>{'.'}<span className="hl-f">trimIndent</span>{'()\n\n'}
              <span className="hl-k">val</span>{' intent = '}<span className="hl-t">Intent</span>{'()\n'}
              {'intent.'}<span className="hl-f">action</span>{' = '}<span className="hl-s">"com.tomtom.automotive.clusterui.cluster.COMPONENT_VISIBILITY"</span>{'\n'}
              {'intent.'}<span className="hl-f">addCategory</span>{'('}<span className="hl-s">"android.car.cluster.NAVIGATION"</span>{')\n'}
              {'intent.'}<span className="hl-f">putExtra</span>{'('}<span className="hl-s">"clusterConfigurationUpdate"</span>{', config)\n'}
              <span className="hl-f">startActivity</span>{'(intent)'}
            </pre>,
            <pre key="adb">
              {'adb shell am start \\\n'}
              {'  -a '}<span className="hl-s">"com.tomtom.automotive.clusterui.cluster.COMPONENT_VISIBILITY"</span>{' \\\n'}
              {'  -c '}<span className="hl-s">"android.car.cluster.NAVIGATION"</span>{' \\\n'}
              {'  --es '}<span className="hl-s">"clusterConfigurationUpdate"</span>{' \\\n'}
              {'  '}<span className="hl-s">{"'{ \"displayHpComponent\": true }'"}</span>
            </pre>,
          ]}
        </CodeBlock>
      </div>

      {/* ── Live configuration builder ─────────────────────────── */}
      <div className="zone">
        <h2 className="sh" id="cl-config">{t('cluster.sections.config')}</h2>
        <p className="body">{t('cluster.configBody')}</p>

        <div style={{ marginBottom: 20 }}>
          <ClusterDisplay
            showMap={showMap} showVignette={showVignette} showHp={showHp}
            nipLayout={nipLayout} etaLayout={etaLayout} hpElements={hpElements}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 20 }}>
          {/* Component toggles */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: 10 }}>
              {t('cluster.componentVisibility')}
            </div>
            {toggleItems.map(({ key, label, value, set }) => (
              <div key={key} onClick={() => set(v => !v)} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px',
                marginBottom: 5, borderRadius: 7, cursor: 'pointer',
                background: value ? '#fff' : 'var(--bg)',
                border: '1px solid var(--border)', opacity: value ? 1 : 0.5,
                transition: 'all 0.12s',
              }}>
                <div style={{ width: 30, height: 16, borderRadius: 20, background: value ? 'var(--red)' : 'var(--border)', transition: 'background 0.15s', position: 'relative', flexShrink: 0 }}>
                  <div style={{ position: 'absolute', top: 1.5, left: value ? 13 : 1.5, width: 13, height: 13, borderRadius: '50%', background: 'white', transition: 'left 0.15s' }} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>{label}</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.875rem', color: value ? '#16a34a' : 'var(--muted)', fontWeight: 600 }}>
                  {value ? t('cluster.shown') : t('cluster.hidden')}
                </span>
              </div>
            ))}
          </div>

          {/* HP elements */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: 10 }}>
              hpElementsToShowOnCluster
            </div>
            {hpElementsData.map(({ id, label, desc }) => {
              const active = hpElements.includes(id);
              return (
                <div key={id} onClick={() => showHp && toggleHpEl(id)} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px',
                  marginBottom: 5, borderRadius: 7, cursor: showHp ? 'pointer' : 'default',
                  background: active ? '#fff' : 'var(--bg)',
                  border: '1px solid var(--border)', opacity: (!showHp || !active) ? 0.4 : 1,
                  transition: 'all 0.12s',
                }}>
                  <div style={{ width: 28, height: 16, borderRadius: 20, background: active ? 'var(--red)' : 'var(--border)', transition: 'background 0.15s', position: 'relative', flexShrink: 0 }}>
                    <div style={{ position: 'absolute', top: 1.5, left: active ? 11 : 1.5, width: 13, height: 13, borderRadius: '50%', background: 'white', transition: 'left 0.15s' }} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, minWidth: 28 }}>{id}</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--muted)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{desc}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* NIP layout */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: 8 }}>nipLayoutType</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 6 }}>
            {nipLayoutsData.map(({ id, label, desc }) => (
              <button key={id} onClick={() => setNipLayout(id)} style={{
                padding: '8px 10px', borderRadius: 7, cursor: 'pointer', textAlign: 'left',
                fontWeight: nipLayout === id ? 600 : 400,
                background: nipLayout === id ? '#fff5f5' : 'var(--bg)',
                border: `1px solid ${nipLayout === id ? 'var(--red)' : 'var(--border)'}`,
                color: nipLayout === id ? 'var(--red)' : 'var(--mid)',
                transition: 'all 0.1s',
              }}>
                <div style={{ fontSize: '0.75rem' }}>{label}</div>
                <div style={{ fontSize: '0.875rem', opacity: 0.6, marginTop: 2 }}>{desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ETA layout */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: 8 }}>etaLayoutType</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 6 }}>
            {etaLayoutsData.map(({ id, label, desc }) => (
              <button key={id} onClick={() => setEtaLayout(id)} style={{
                padding: '8px 10px', borderRadius: 7, cursor: 'pointer', textAlign: 'left',
                fontWeight: etaLayout === id ? 600 : 400,
                background: etaLayout === id ? '#fff5f5' : 'var(--bg)',
                border: `1px solid ${etaLayout === id ? 'var(--red)' : 'var(--border)'}`,
                color: etaLayout === id ? 'var(--red)' : 'var(--mid)',
                transition: 'all 0.1s',
              }}>
                <div style={{ fontSize: '0.75rem' }}>{label}</div>
                <div style={{ fontSize: '0.875rem', opacity: 0.6, marginTop: 2 }}>{desc}</div>
              </button>
            ))}
          </div>
        </div>

        <CodeBlock tabs={['Kotlin']}>
          <pre>
            <span className="hl-k">val</span>{' config = '}<span className="hl-s">"""</span>{'\n'}
            {configJson.split('\n').map((line, i) => (
              <span key={i} className="hl-s">{line}{'\n'}</span>
            ))}
            <span className="hl-s">"""</span>{'.'}<span className="hl-f">trimIndent</span>{'()\n\n'}
            <span className="hl-k">val</span>{' intent = '}<span className="hl-t">Intent</span>{'()\n'}
            {'intent.'}<span className="hl-f">action</span>{' = '}<span className="hl-s">"com.tomtom.automotive.clusterui.cluster.COMPONENT_VISIBILITY"</span>{'\n'}
            {'intent.'}<span className="hl-f">addCategory</span>{'('}<span className="hl-s">"android.car.cluster.NAVIGATION"</span>{')\n'}
            {'intent.'}<span className="hl-f">putExtra</span>{'('}<span className="hl-s">"clusterConfigurationUpdate"</span>{', config)\n'}
            <span className="hl-f">startActivity</span>{'(intent)'}
          </pre>
        </CodeBlock>
      </div>

      {/* ── Positioning ────────────────────────────────────────── */}
      <div className="zone">
        <h2 className="sh" id="cl-position">{t('cluster.sections.position')}</h2>
        <p className="body">
          {t('cluster.positionBody')
            .split(/(hpComponentRect|safeAreaComponentRect|displayPX: true)/)
            .map((part, i) =>
              ['hpComponentRect', 'safeAreaComponentRect', 'displayPX: true'].includes(part)
                ? <code key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85em' }}>{part}</code>
                : part
            )}
        </p>
        <CodeBlock tabs={['Kotlin']}>
          <pre>
            <span className="hl-s">"""</span>{'\n'}
            <span className="hl-s">{'{'}</span>{'\n'}
            <span className="hl-s">{'  "hpComponentRect": {'}</span>{'\n'}
            <span className="hl-s">{'    "topMargin": 0, "startMargin": 0,'}</span>{'\n'}
            <span className="hl-s">{'    "width": 403,  "height": 640'}</span>{'\n'}
            <span className="hl-s">{'  },'}</span>{'\n'}
            <span className="hl-s">{'  "safeAreaComponentRect": {'}</span>{'\n'}
            <span className="hl-s">{'    "topMargin": 0, "startMargin": 574,'}</span>{'\n'}
            <span className="hl-s">{'    "width": 574,  "height": 840'}</span>{'\n'}
            <span className="hl-s">{'  },'}</span>{'\n'}
            <span className="hl-s">{'  "displayPX": true'}</span>{'\n'}
            <span className="hl-s">{'}'}</span>{'\n'}
            <span className="hl-s">"""</span>{'.'}<span className="hl-f">trimIndent</span>{'()'}
          </pre>
        </CodeBlock>
      </div>

      {/* ── Runtime updates ────────────────────────────────────── */}
      <div className="zone">
        <h2 className="sh" id="cl-runtime">{t('cluster.sections.runtime')}</h2>
        <p className="body">{t('cluster.runtimeBody')}</p>
        <CodeBlock tabs={['Kotlin']}>
          <pre>
            <span className="hl-c">{'// Toggle map off at runtime — all other settings unchanged\n'}</span>
            <span className="hl-f">sendClusterUpdate</span>{'('}<span className="hl-s">"""{"{ \"displayMapComponent\": false }"}"""</span>{')\n\n'}
            <span className="hl-k">private fun</span>{' '}<span className="hl-f">sendClusterUpdate</span>{'(json: '}<span className="hl-t">String</span>{') {\n'}
            {'    '}<span className="hl-k">val</span>{' intent = '}<span className="hl-t">Intent</span>{'()\n'}
            {'    intent.'}<span className="hl-f">action</span>{' = '}<span className="hl-s">"com.tomtom.automotive.clusterui.cluster.COMPONENT_VISIBILITY"</span>{'\n'}
            {'    intent.'}<span className="hl-f">addCategory</span>{'('}<span className="hl-s">"android.car.cluster.NAVIGATION"</span>{')\n'}
            {'    intent.'}<span className="hl-f">putExtra</span>{'('}<span className="hl-s">"clusterConfigurationUpdate"</span>{', json)\n'}
            {'    '}<span className="hl-f">startActivity</span>{'(intent)\n}'}
          </pre>
        </CodeBlock>
      </div>

      {/* ── Requirements ───────────────────────────────────────── */}
      <div className="zone">
        <h2 className="sh" id="cl-requirements">{t('cluster.sections.requirements')}</h2>
        <table className="prop-table">
          <thead>
            <tr>
              <th>{t('cluster.requirementsTable.colReq')}</th>
              <th>{t('cluster.requirementsTable.colPri')}</th>
              <th>{t('cluster.requirementsTable.colNotes')}</th>
            </tr>
          </thead>
          <tbody>
            {[
              { key: 'startIntent',   pri: 'P0' },
              { key: 'showMap',       pri: 'P0' },
              { key: 'showHp',        pri: 'P0' },
              { key: 'nipLayout',     pri: 'P0' },
              { key: 'slg',           pri: 'P0' },
              { key: 'cmp',           pri: 'P0' },
              { key: 'eta',           pri: 'P0' },
              { key: 'jv',            pri: 'P1' },
              { key: 'uep',           pri: 'P1' },
              { key: 'positionRect',  pri: 'P1' },
              { key: 'runtimeUpdate', pri: 'P1' },
              { key: 'vignette',      pri: 'P2' },
              { key: 'displayPx',     pri: 'P2' },
            ].map(({ key, pri }) => (
              <tr key={key}>
                <td style={{ fontWeight: 500 }}>{t(`cluster.requirementsTable.rows.${key}.req`)}</td>
                <td>
                  <span style={{
                    fontSize: '0.875rem', fontWeight: 700, padding: '2px 6px', borderRadius: 3,
                    background: pri === 'P0' ? '#fff5f5' : 'var(--bg)',
                    color: pri === 'P0' ? 'var(--red)' : 'var(--muted)',
                    border: `1px solid ${pri === 'P0' ? '#fecaca' : 'var(--border)'}`,
                  }}>{pri}</span>
                </td>
                <td style={{ color: 'var(--mid)', fontSize: '0.875rem' }}>{t(`cluster.requirementsTable.rows.${key}.notes`)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
