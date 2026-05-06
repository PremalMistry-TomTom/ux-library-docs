import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import PageActions from '../components/ui/PageActions';

const ZONE_COLORS = {
  nav:      { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', border: '#f59e0b' },
  safe:     { color: '#3b82f6', bg: 'rgba(59,130,246,0.15)',  border: '#3b82f6' },
  display:  { color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', border: '#8b5cf6' },
  controls: { color: '#e2001a', bg: 'rgba(226,0,26,0.12)',   border: '#e2001a' },
};

/* ─── Zone diagram ──────────────────────────────────────────── */
export function ZonesDiagram({ t }) {
  const zones = [
    { id: 'nav',      ...ZONE_COLORS.nav,      label: t('homeScreen.zones.nav.label'),      desc: t('homeScreen.zones.nav.desc') },
    { id: 'safe',     ...ZONE_COLORS.safe,     label: t('homeScreen.zones.safe.label'),     desc: t('homeScreen.zones.safe.desc') },
    { id: 'display',  ...ZONE_COLORS.display,  label: t('homeScreen.zones.display.label'),  desc: t('homeScreen.zones.display.desc') },
    { id: 'controls', ...ZONE_COLORS.controls, label: t('homeScreen.zones.controls.label'), desc: t('homeScreen.zones.controls.desc') },
  ];
  const [activeZone, setActiveZone] = useState(null);
  const zone = zones.find(z => z.id === activeZone);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* IVI mock — full width */}
      <div style={{
        width: '100%', height: 300, background: '#0c1318', borderRadius: 10,
        border: '1px solid rgba(255,255,255,0.12)', overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Map background */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#1a2535,#0f1a28)' }}>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 300 200" fill="none">
            <path d="M30 80 Q80 60 150 85 T270 75" stroke="#e2001a" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
            <path d="M0 110 Q60 70 150 110 T300 100" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5"/>
            <path d="M70 0 L75 200" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
            <path d="M200 0 L190 200" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
          </svg>
          <div style={{ position: 'absolute', top: '45%', left: '52%', width: 10, height: 10, borderRadius: '50%', background: '#e2001a', boxShadow: '0 0 0 4px rgba(226,0,26,0.3)' }} />
        </div>
        {/* Widget strip */}
        <div style={{
          position: 'absolute', top: 0, right: 0, width: '28%', height: '100%',
          background: 'rgba(0,0,0,0.55)', borderLeft: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', flexDirection: 'column', padding: '10px 12px', gap: 8,
        }}>
          {['MEDIA','CLIMATE','PHONE'].map(w => (
            <div key={w} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>{w}</span>
            </div>
          ))}
        </div>
        {/* Controls zone */}
        <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {['🔍','⚡','🔇','⚙️'].map((icon, i) => (
            <div key={i} style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>{icon}</div>
          ))}
        </div>
        {/* Zone overlays */}
        {activeZone === 'display'  && <div style={{ position: 'absolute', inset: 0, right: '28%', border: `2px solid ${ZONE_COLORS.display.border}`,  background: ZONE_COLORS.display.bg,  borderRadius: '9px 0 0 9px', pointerEvents: 'none' }} />}
        {activeZone === 'nav'      && <div style={{ position: 'absolute', inset: 0, border: `2px solid ${ZONE_COLORS.nav.border}`,      background: ZONE_COLORS.nav.bg,      borderRadius: 9, pointerEvents: 'none' }} />}
        {activeZone === 'safe'     && <div style={{ position: 'absolute', top: '5%', left: '8%', right: '31%', bottom: '5%', border: `2px solid ${ZONE_COLORS.safe.border}`, background: ZONE_COLORS.safe.bg, borderRadius: 8, pointerEvents: 'none' }} />}
        {activeZone === 'controls' && <div style={{ position: 'absolute', top: '2%', bottom: '2%', left: '1%', width: '9%', border: `2px solid ${ZONE_COLORS.controls.border}`, background: ZONE_COLORS.controls.bg, borderRadius: 8, pointerEvents: 'none' }} />}
      </div>

      {/* Zone legend — 2×2 grid below mock */}
      <div className="grid-2-col" style={{ gap: 8 }}>
        {zones.map(z => (
          <div
            key={z.id}
            onClick={() => setActiveZone(activeZone === z.id ? null : z.id)}
            style={{
              padding: '10px 14px', borderRadius: 8, cursor: 'pointer',
              border: `1px solid ${activeZone === z.id ? z.border : 'var(--border)'}`,
              background: activeZone === z.id ? z.bg : 'var(--bg)',
              transition: 'all 0.15s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: z.color, flexShrink: 0 }} />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--black)' }}>{z.label}</span>
            </div>
            {activeZone === z.id && (
              <p style={{ fontSize: '0.75rem', color: 'var(--mid)', margin: '6px 0 0 18px', lineHeight: 1.5 }}>{z.desc}</p>
            )}
          </div>
        ))}
      </div>
      <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: '-4px 0 0' }}>Click a zone to highlight it on the diagram</p>
    </div>
  );
}

/* ─── Resize demo ───────────────────────────────────────────── */
export function ResizeDemo({ t }) {
  const [insets, setInsets] = useState({ top: 0, right: 30, bottom: 0, left: 0 });
  const set = (side, val) => setInsets(s => ({ ...s, [side]: Number(val) }));

  const SLIDER_SIDES = [
    { side: 'top',    label: t('homeScreen.sliders.top') },
    { side: 'right',  label: t('homeScreen.sliders.right') },
    { side: 'bottom', label: t('homeScreen.sliders.bottom') },
    { side: 'left',   label: t('homeScreen.sliders.left') },
  ];

  const kt = `homeScreenLayout.setApplicationArea(
    ApplicationArea(
        top    = ${insets.top},
        end    = ${insets.right},
        bottom = ${insets.bottom},
        start  = ${insets.left}
    ),
    animation = ResizeAnimation(
        type     = AnimationType.EASE_IN_OUT,
        duration = 300L
    )
)`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Sliders — 2×2 grid above mock */}
      <div className="grid-2-col" style={{ gap: 12 }}>
        {SLIDER_SIDES.map(({ side, label }) => (
          <div key={side}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>{label}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{insets[side]}%</span>
            </div>
            <input
              type="range" min="0" max="50" value={insets[side]}
              onChange={e => set(side, e.target.value)}
              style={{ width: '100%', accentColor: 'var(--red)' }}
            />
          </div>
        ))}
      </div>
      <div>
        <button
          onClick={() => setInsets({ top: 0, right: 30, bottom: 0, left: 0 })}
          style={{ fontSize: '0.75rem', padding: '4px 10px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 5, cursor: 'pointer' }}
        >
          {t('homeScreen.sliders.reset')}
        </button>
      </div>
      <div>
        <div style={{ position: 'relative', width: '100%', height: 300, background: '#0c1318', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#1a2535,#0f1a28)' }}>
            <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 300 190" fill="none">
              <path d="M20 90 Q80 60 150 95 T280 80" stroke="#e2001a" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
              <path d="M70 0 L75 190" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
              <path d="M200 0 L190 190" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
            </svg>
            <div style={{ position: 'absolute', top: '48%', left: '50%', width: 8, height: 8, borderRadius: '50%', background: '#e2001a', boxShadow: '0 0 0 3px rgba(226,0,26,0.3)' }} />
          </div>
          {/* Navigation application area overlay */}
          <div style={{
            position: 'absolute',
            top: `${insets.top}%`, right: `${insets.right}%`,
            bottom: `${insets.bottom}%`, left: `${insets.left}%`,
            border: '2px solid #f59e0b', borderRadius: 4,
          }}>
            <span style={{ position: 'absolute', top: 3, left: 4, fontSize: '0.5rem', color: '#f59e0b', fontFamily: 'var(--font-mono)', background: 'rgba(0,0,0,0.6)', padding: '1px 3px', borderRadius: 2 }}>nav app area</span>
          </div>
          {insets.right > 5 && (
            <div style={{ position: 'absolute', top: 0, right: 0, width: `${insets.right}%`, height: '100%', background: 'rgba(0,0,0,0.6)', borderLeft: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', padding: 4, gap: 3 }}>
              {['MEDIA','PHONE'].map(w => (
                <div key={w} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>{w}</span>
                </div>
              ))}
            </div>
          )}
          {insets.top > 5 && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: `${insets.right}%`, height: `${insets.top}%`, background: 'rgba(0,0,0,0.55)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>STATUS BAR</span>
            </div>
          )}
          {insets.bottom > 5 && (
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: `${insets.right}%`, height: `${insets.bottom}%`, background: 'rgba(0,0,0,0.55)', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>BOTTOM BAR</span>
            </div>
          )}
        </div>
      </div>

      <CodeBlock tabs={['Kotlin']}>
        <pre>{kt.split('\n').map((line, i) => {
          if (line.includes('homeScreenLayout')) return <span key={i}><span className="hl-n">homeScreenLayout</span>{'.setApplicationArea(\n'}</span>;
          if (line.includes('ApplicationArea')) return <span key={i}>{'    '}<span className="hl-t">ApplicationArea</span>{'(\n'}</span>;
          if (line.includes('top') || line.includes('end') || line.includes('bottom') || line.includes('start')) {
            const [prop, val] = line.trim().split(' = ');
            return <span key={i}>{'        '}<span className="hl-f">{prop}</span>{' = '}<span className="hl-n">{val?.replace(',', '')}</span>{val?.includes(',') ? ',\n' : '\n'}</span>;
          }
          if (line.includes('animation')) return <span key={i}>{'    '}<span className="hl-f">animation</span>{' = '}<span className="hl-t">ResizeAnimation</span>{'(\n'}</span>;
          if (line.includes('AnimationType')) return <span key={i}>{'        '}<span className="hl-f">type</span>{' = '}<span className="hl-t">AnimationType</span>{'.'}<span className="hl-n">EASE_IN_OUT</span>{',\n'}</span>;
          if (line.includes('duration')) return <span key={i}>{'        '}<span className="hl-f">duration</span>{' = '}<span className="hl-n">300</span><span className="hl-t">L</span>{'\n'}</span>;
          return <span key={i}>{line}{'\n'}</span>;
        })}</pre>
      </CodeBlock>
    </div>
  );
}

/* ─── UI State explorer ─────────────────────────────────────── */
function isPassive(state) {
  return (
    ['FREE_DRIVING','GUIDANCE','IDLE'].includes(state.activity) &&
    state.panel === 'NONE' &&
    state.map === 'FOLLOWING'
  );
}

function StateMapMock({ state }) {
  const passive = isPassive(state);
  const inGuidance = state.activity === 'GUIDANCE';
  const inArrival  = state.activity === 'ARRIVAL';
  const panelOpen  = state.panel !== 'NONE';
  const browsing   = state.map === 'BROWSING';

  return (
    <div style={{ width: '100%', height: 300, background: '#0c1318', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#1a2535,#0f1a28)' }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 400 180" fill="none">
          {inGuidance && <path d="M20 100 Q100 70 200 100 T380 90" stroke="#e2001a" strokeWidth="2.5" strokeLinecap="round" opacity="0.9"/>}
          <path d="M0 130 Q80 90 200 130 T400 120" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5"/>
          <path d="M100 0 L105 180" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
          <path d="M270 0 L260 180" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
        </svg>
        <div style={{ position: 'absolute', top: '50%', left: '52%', width: 10, height: 10, borderRadius: '50%', background: browsing ? '#f59e0b' : '#e2001a', boxShadow: `0 0 0 4px ${browsing ? 'rgba(245,158,11,0.3)' : 'rgba(226,0,26,0.3)'}` }} />
        {browsing && <div style={{ position: 'absolute', top: '30%', right: '35%', fontSize: '0.625rem', color: 'rgba(255,255,255,0.5)', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: 4 }}>browsing…</div>}
      </div>
      {panelOpen && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(12,19,24,0.92)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <div style={{ fontSize: '0.625rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{state.panel}</div>
          <div style={{ width: 160, height: 2, background: '#e2001a', borderRadius: 1 }} />
          <div style={{ width: 120, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }} />
          <div style={{ width: 100, height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 3 }} />
        </div>
      )}
      {inGuidance && !panelOpen && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: '#1a6040', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '1.5rem', color: 'white' }}>↖</span>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'white' }}>1.2 mi</div>
            <div style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.7)' }}>Oak Street North</div>
          </div>
        </div>
      )}
      {inArrival && !panelOpen && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(12,19,24,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <div style={{ fontSize: '1.25rem' }}>📍</div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'white' }}>You have arrived</div>
        </div>
      )}
      <div style={{
        position: 'absolute', bottom: 8, right: 8,
        fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.06em',
        padding: '3px 8px', borderRadius: 10,
        background: passive ? 'rgba(22,163,74,0.3)' : 'rgba(226,0,26,0.3)',
        border: `1px solid ${passive ? 'rgba(22,163,74,0.5)' : 'rgba(226,0,26,0.5)'}`,
        color: passive ? '#86efac' : '#fca5a5',
      }}>
        {passive ? '● PASSIVE' : '● ACTIVE'}
      </div>
    </div>
  );
}

export function UIStateExplorer({ t }) {
  const stateDimensions = {
    activity: {
      label: t('homeScreen.stateDimensions.activity.label'),
      values: ['IDLE', 'FREE_DRIVING', 'GUIDANCE', 'ARRIVAL'],
      desc: t('homeScreen.stateDimensions.activity.desc'),
    },
    panel: {
      label: t('homeScreen.stateDimensions.panel.label'),
      values: ['NONE', 'SEARCH', 'LOCATION_PREVIEW', 'QUICK_SETTINGS', 'ROUTE_OPTIONS', 'SETTINGS', 'WEATHER'],
      desc: t('homeScreen.stateDimensions.panel.desc'),
    },
    map: {
      label: t('homeScreen.stateDimensions.map.label'),
      values: ['FOLLOWING', 'BROWSING'],
      desc: t('homeScreen.stateDimensions.map.desc'),
    },
    trip: {
      label: t('homeScreen.stateDimensions.trip.label'),
      values: ['NONE', 'IN_PROGRESS', 'CANCELLED', 'FAILURE'],
      desc: t('homeScreen.stateDimensions.trip.desc'),
    },
  };

  const [state, setState] = useState({ activity: 'GUIDANCE', panel: 'NONE', map: 'FOLLOWING', trip: 'NONE' });
  const passive = isPassive(state);
  const set = (dim, val) => setState(s => ({ ...s, [dim]: val }));

  const observerKt = `// Observe all four state dimensions
navApp.uiState
    .onEach { s ->
        val activityState = s.navigationActivity  // ${state.activity}
        val panelState    = s.uiPanel             // ${state.panel}
        val mapState      = s.mapInteraction      // ${state.map}
        val tripState     = s.tripPlanning        // ${state.trip}

        val isPassive = activityState in setOf(
            NavigationActivity.FREE_DRIVING,
            NavigationActivity.GUIDANCE,
            NavigationActivity.IDLE
        ) && panelState == UIPanel.NONE
          && mapState == MapInteraction.FOLLOWING

        orchestrator.setWidgetsVisible(!isPassive)
    }
    .launchIn(lifecycleScope)`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <StateMapMock state={state} />

      <div className="grid-2-col" style={{ gap: 12 }}>
        {Object.entries(stateDimensions).map(([dim, { label, values, desc }]) => (
          <div key={dim} style={{ padding: '12px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: 2, color: 'var(--black)' }}>{label}</div>
            <div style={{ fontSize: '0.625rem', color: 'var(--muted)', marginBottom: 10, lineHeight: 1.4 }}>{desc}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {values.map(v => (
                <button
                  key={v}
                  onClick={() => set(dim, v)}
                  style={{
                    fontSize: '0.625rem', fontFamily: 'var(--font-mono)', padding: '3px 7px',
                    borderRadius: 4, cursor: 'pointer', fontWeight: state[dim] === v ? 700 : 400,
                    background: state[dim] === v ? 'var(--red)' : 'var(--white)',
                    color: state[dim] === v ? 'white' : 'var(--mid)',
                    border: state[dim] === v ? '1px solid var(--red)' : '1px solid var(--border)',
                    transition: 'all 0.1s',
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
        borderRadius: 8,
        background: passive ? 'rgba(22,163,74,0.08)' : 'rgba(226,0,26,0.08)',
        border: `1px solid ${passive ? 'rgba(22,163,74,0.25)' : 'rgba(226,0,26,0.25)'}`,
      }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: passive ? '#16a34a' : '#e2001a', flexShrink: 0 }} />
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: passive ? '#15803d' : '#e2001a' }}>
            {passive ? t('homeScreen.passive') : t('homeScreen.active')}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--mid)', marginLeft: 8 }}>
            {passive ? t('homeScreen.passiveDesc') : t('homeScreen.activeDesc')}
          </span>
        </div>
      </div>

      <CodeBlock tabs={['Kotlin']}>
        <pre>
          {observerKt.split('\n').map((line, i) => {
            if (line.includes('// Observe')) return <span key={i}><span className="hl-c">{line}</span>{'\n'}</span>;
            if (line.includes('navApp')) return <span key={i}><span className="hl-n">navApp</span>{'.uiState\n'}</span>;
            if (line.includes('.onEach')) return <span key={i}>{'    .'}<span className="hl-f">onEach</span>{' { s ->\n'}</span>;
            if (line.includes('val activityState')) return <span key={i}>{'        '}<span className="hl-k">val</span>{' activityState = s.'}<span className="hl-f">navigationActivity</span>{'  '}<span className="hl-c">{'// ' + state.activity}</span>{'\n'}</span>;
            if (line.includes('val panelState'))    return <span key={i}>{'        '}<span className="hl-k">val</span>{' panelState    = s.'}<span className="hl-f">uiPanel</span>{'             '}<span className="hl-c">{'// ' + state.panel}</span>{'\n'}</span>;
            if (line.includes('val mapState'))      return <span key={i}>{'        '}<span className="hl-k">val</span>{' mapState      = s.'}<span className="hl-f">mapInteraction</span>{'       '}<span className="hl-c">{'// ' + state.map}</span>{'\n'}</span>;
            if (line.includes('val tripState'))     return <span key={i}>{'        '}<span className="hl-k">val</span>{' tripState     = s.'}<span className="hl-f">tripPlanning</span>{'         '}<span className="hl-c">{'// ' + state.trip}</span>{'\n'}</span>;
            if (line.includes('val isPassive')) return <span key={i}>{'\n        '}<span className="hl-c">{'// Derive your own active/passive signal'}</span>{'\n        '}<span className="hl-k">val</span>{' isPassive = activityState '}<span className="hl-k">in</span>{' setOf(\n'}</span>;
            if (line.includes('FREE_DRIVING')) return <span key={i}>{'            '}<span className="hl-t">NavigationActivity</span>{'.'}<span className="hl-n">FREE_DRIVING</span>{',\n'}</span>;
            if (line.includes('GUIDANCE,'))    return <span key={i}>{'            '}<span className="hl-t">NavigationActivity</span>{'.'}<span className="hl-n">GUIDANCE</span>{',\n'}</span>;
            if (line.includes('IDLE'))         return <span key={i}>{'            '}<span className="hl-t">NavigationActivity</span>{'.'}<span className="hl-n">IDLE</span>{'\n        ) && panelState == '}<span className="hl-t">UIPanel</span>{'.'}<span className="hl-n">NONE</span>{'\n          && mapState == '}<span className="hl-t">MapInteraction</span>{'.'}<span className="hl-n">FOLLOWING</span>{'\n\n'}</span>;
            if (line.includes('setWidgetsVisible')) return <span key={i}>{'        orchestrator.'}<span className="hl-f">setWidgetsVisible</span>{'(!isPassive)\n'}</span>;
            if (line.includes('.launchIn')) return <span key={i}>{'    .'}<span className="hl-f">launchIn</span>{'(lifecycleScope)\n'}</span>;
            if (line.trim() === '' || line.includes('    }') || line.includes('setOf')) return null;
            return <span key={i}>{line}{'\n'}</span>;
          })}
        </pre>
      </CodeBlock>
    </div>
  );
}

/* ─── Main page ─────────────────────────────────────────────── */
export default function HomeScreenLayout() {
  const { t } = useTranslation('pages');

  const reqRows = [
    { key: 'area',    pri: 'P0 · R2' },
    { key: 'resize',  pri: 'P0 · R2' },
    { key: 'state',   pri: 'P0 · R2' },
    { key: 'anim',    pri: 'P0 · R2' },
    { key: 'safe',    pri: 'P1' },
    { key: 'display', pri: 'P1' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>{t('homeScreen.title')}</h1>
        <PageActions />
      </div>

      <div className="quick-answer">
        {t('homeScreen.intro')}
      </div>

      {/* Overview */}
      <div className="zone">
        <h2 className="sh" id="h-overview">{t('homeScreen.sections.overview')}</h2>
        <p className="body">{t('homeScreen.overviewBody1')}</p>
        <Callout type="info">{t('homeScreen.callout1')}</Callout>
      </div>

      {/* Screen zones */}
      <div className="zone">
        <h2 className="sh" id="h-zones">{t('homeScreen.sections.zones')}</h2>
        <p className="body">{t('homeScreen.zonesIntro')}</p>
        <ZonesDiagram t={t} />
      </div>

      {/* Resize */}
      <div className="zone">
        <h2 className="sh" id="h-resize">{t('homeScreen.sections.resize')}</h2>
        <p className="body">{t('homeScreen.resizeBody')}</p>
        <Callout type="warn">{t('homeScreen.callout2')}</Callout>
        <ResizeDemo t={t} />
      </div>

      {/* UI State */}
      <div className="zone">
        <h2 className="sh" id="h-states">{t('homeScreen.sections.states')}</h2>
        <p className="body">{t('homeScreen.statesIntro')}</p>
        <UIStateExplorer t={t} />
      </div>

      <div className="zone">
        <Callout type="info">{t('homeScreen.callout3')}</Callout>
      </div>

      {/* Requirements summary */}
      <div className="zone">
        <h2 className="sh" id="h-requirements">{t('homeScreen.sections.requirements')}</h2>
        <table className="prop-table">
          <thead>
            <tr>
              <th>Requirement</th>
              <th>Priority</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {reqRows.map(({ key, pri }) => (
              <tr key={key}>
                <td style={{ fontWeight: 500 }}>{t(`homeScreen.requirementsTable.rows.${key}.req`)}</td>
                <td>
                  <span style={{
                    fontSize: '0.625rem', fontWeight: 700, padding: '2px 6px', borderRadius: 3,
                    background: pri.includes('P0') ? '#fff5f5' : 'var(--bg)',
                    color: pri.includes('P0') ? 'var(--red)' : 'var(--muted)',
                    border: `1px solid ${pri.includes('P0') ? '#fecaca' : 'var(--border)'}`,
                    whiteSpace: 'nowrap',
                  }}>
                    {t(`homeScreen.requirementsTable.rows.${key}.pri`)}
                  </span>
                </td>
                <td style={{ color: 'var(--mid)', fontSize: '0.875rem' }}>{t(`homeScreen.requirementsTable.rows.${key}.notes`)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
