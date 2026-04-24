import { useState } from 'react';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';

/* ─── Zone diagram ──────────────────────────────────────────── */
const ZONES = [
  {
    id: 'nav',
    label: 'Navigation Application Area',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.15)',
    border: '#f59e0b',
    desc: 'The area where all navigation map content and features reside. The IVI orchestrator controls its size.',
  },
  {
    id: 'safe',
    label: 'Map Safe Area',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.15)',
    border: '#3b82f6',
    desc: 'The portion of the screen where the map renders critical content without obstruction. Contains the recenter button and compass.',
  },
  {
    id: 'display',
    label: 'Map Display Area',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.12)',
    border: '#8b5cf6',
    desc: 'The full map area. Can be covered by navigation elements or IVI widgets such as media panels.',
  },
  {
    id: 'controls',
    label: 'Map Controls Zone',
    color: '#e2001a',
    bg: 'rgba(226,0,26,0.12)',
    border: '#e2001a',
    desc: 'Primary controls surfaced on the navigation home screen — Search, Charging Finder, Mute, Quick Settings.',
  },
];

function ZonesDiagram() {
  const [activeZone, setActiveZone] = useState(null);
  const zone = ZONES.find(z => z.id === activeZone);

  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      {/* IVI mock */}
      <div style={{
        width: 300, height: 200, background: '#0c1318', borderRadius: 10,
        border: '1px solid rgba(255,255,255,0.12)', overflow: 'hidden',
        position: 'relative', flexShrink: 0,
      }}>
        {/* Map background */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#1a2535,#0f1a28)' }}>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 300 200" fill="none">
            <path d="M30 80 Q80 60 150 85 T270 75" stroke="#e2001a" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
            <path d="M0 110 Q60 70 150 110 T300 100" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5"/>
            <path d="M70 0 L75 200" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
            <path d="M200 0 L190 200" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
          </svg>
          <div style={{ position: 'absolute', top: '45%', left: '52%', width: 8, height: 8, borderRadius: '50%', background: '#e2001a', boxShadow: '0 0 0 3px rgba(226,0,26,0.3)' }} />
        </div>

        {/* Widget strip */}
        <div style={{
          position: 'absolute', top: 0, right: 0, width: 90, height: '100%',
          background: 'rgba(0,0,0,0.55)', borderLeft: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', flexDirection: 'column', padding: 8, gap: 6,
          ...(activeZone === null ? {} : {}),
        }}>
          {['MEDIA','CLIMATE','PHONE'].map(w => (
            <div key={w} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.45rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>{w}</span>
            </div>
          ))}
        </div>

        {/* Controls zone */}
        <div style={{
          position: 'absolute', bottom: 8, left: 8,
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {['🔍','⚡','🔇','⚙️'].map((icon, i) => (
            <div key={i} style={{ width: 20, height: 20, borderRadius: 4, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem' }}>{icon}</div>
          ))}
        </div>

        {/* Zone overlays */}
        {activeZone === 'display' && (
          <div style={{ position: 'absolute', inset: 0, right: 90, border: `2px solid ${ZONES[2].border}`, background: ZONES[2].bg, borderRadius: '9px 0 0 9px', pointerEvents: 'none' }} />
        )}
        {activeZone === 'nav' && (
          <div style={{ position: 'absolute', inset: 0, border: `2px solid ${ZONES[0].border}`, background: ZONES[0].bg, borderRadius: 9, pointerEvents: 'none' }} />
        )}
        {activeZone === 'safe' && (
          <div style={{ position: 'absolute', top: 12, left: 30, right: 100, bottom: 12, border: `2px solid ${ZONES[1].border}`, background: ZONES[1].bg, borderRadius: 6, pointerEvents: 'none' }} />
        )}
        {activeZone === 'controls' && (
          <div style={{ position: 'absolute', bottom: 4, left: 4, width: 32, top: 4, border: `2px solid ${ZONES[3].border}`, background: ZONES[3].bg, borderRadius: 6, pointerEvents: 'none' }} />
        )}
      </div>

      {/* Zone legend */}
      <div style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {ZONES.map(z => (
          <div
            key={z.id}
            onClick={() => setActiveZone(activeZone === z.id ? null : z.id)}
            style={{
              padding: '8px 12px', borderRadius: 7, cursor: 'pointer',
              border: `1px solid ${activeZone === z.id ? z.border : 'var(--border)'}`,
              background: activeZone === z.id ? z.bg : 'var(--bg)',
              transition: 'all 0.15s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: z.color, flexShrink: 0 }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--black)' }}>{z.label}</span>
            </div>
            {activeZone === z.id && (
              <p style={{ fontSize: '0.76rem', color: 'var(--mid)', margin: '5px 0 0 18px', lineHeight: 1.5 }}>{z.desc}</p>
            )}
          </div>
        ))}
        <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 4 }}>Click a zone to highlight it</p>
      </div>
    </div>
  );
}

/* ─── Resize demo ───────────────────────────────────────────── */
function ResizeDemo() {
  const [insets, setInsets] = useState({ top: 0, right: 30, bottom: 0, left: 0 });

  const set = (side, val) => setInsets(s => ({ ...s, [side]: Number(val) }));

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
      {/* Mock screen */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', width: 300, height: 190, background: '#0c1318', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', overflow: 'hidden', flexShrink: 0 }}>
          {/* Full map */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#1a2535,#0f1a28)' }}>
            <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 300 190" fill="none">
              <path d="M20 90 Q80 60 150 95 T280 80" stroke="#e2001a" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
              <path d="M70 0 L75 190" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
              <path d="M200 0 L190 190" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
            </svg>
            <div style={{ position: 'absolute', top: '48%', left: '50%', width: 8, height: 8, borderRadius: '50%', background: '#e2001a', boxShadow: '0 0 0 3px rgba(226,0,26,0.3)' }} />
          </div>

          {/* Navigation application area overlay (the constrained region) */}
          <div style={{
            position: 'absolute',
            top: `${insets.top}%`,
            right: `${insets.right}%`,
            bottom: `${insets.bottom}%`,
            left: `${insets.left}%`,
            border: '2px solid #f59e0b',
            borderRadius: 4,
          }}>
            <span style={{ position: 'absolute', top: 3, left: 4, fontSize: '0.45rem', color: '#f59e0b', fontFamily: 'var(--font-mono)', background: 'rgba(0,0,0,0.6)', padding: '1px 3px', borderRadius: 2 }}>nav app area</span>
          </div>

          {/* Widget strips based on insets */}
          {insets.right > 5 && (
            <div style={{ position: 'absolute', top: 0, right: 0, width: `${insets.right}%`, height: '100%', background: 'rgba(0,0,0,0.6)', borderLeft: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', padding: 4, gap: 3 }}>
              {['MEDIA','PHONE'].map(w => (
                <div key={w} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.38rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>{w}</span>
                </div>
              ))}
            </div>
          )}
          {insets.top > 5 && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: `${insets.right}%`, height: `${insets.top}%`, background: 'rgba(0,0,0,0.55)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.45rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>STATUS BAR</span>
            </div>
          )}
          {insets.bottom > 5 && (
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: `${insets.right}%`, height: `${insets.bottom}%`, background: 'rgba(0,0,0,0.55)', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.45rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>BOTTOM BAR</span>
            </div>
          )}
        </div>

        {/* Sliders */}
        <div style={{ flex: 1, minWidth: 200 }}>
          {[
            { side: 'top', label: 'Top inset' },
            { side: 'right', label: 'End (right) inset' },
            { side: 'bottom', label: 'Bottom inset' },
            { side: 'left', label: 'Start (left) inset' },
          ].map(({ side, label }) => (
            <div key={side} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{label}</span>
                <span style={{ fontSize: '0.76rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{insets[side]}%</span>
              </div>
              <input
                type="range" min="0" max="50" value={insets[side]}
                onChange={e => set(side, e.target.value)}
                style={{ width: '100%', accentColor: 'var(--red)' }}
              />
            </div>
          ))}
          <button
            onClick={() => setInsets({ top: 0, right: 30, bottom: 0, left: 0 })}
            style={{ fontSize: '0.76rem', padding: '4px 10px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 5, cursor: 'pointer' }}
          >
            Reset
          </button>
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
const STATE_DIMS = {
  activity: {
    label: 'Navigation Activity State',
    values: ['IDLE', 'FREE_DRIVING', 'GUIDANCE', 'ARRIVAL'],
    desc: 'High-level navigation activity regardless of UI interaction.',
  },
  panel: {
    label: 'UI Panel State',
    values: ['NONE', 'SEARCH', 'LOCATION_PREVIEW', 'QUICK_SETTINGS', 'ROUTE_OPTIONS', 'SETTINGS', 'WEATHER'],
    desc: 'Which navigation UI panel, if any, is currently foregrounded. NONE = default map view.',
  },
  map: {
    label: 'Map Interaction State',
    values: ['FOLLOWING', 'BROWSING'],
    desc: 'Whether the map is auto-following the vehicle or being actively panned/zoomed.',
  },
  trip: {
    label: 'Trip Planning State',
    values: ['NONE', 'IN_PROGRESS', 'CANCELLED', 'FAILURE'],
    desc: 'Lifecycle of the current trip planning session.',
  },
};

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
  const inArrival = state.activity === 'ARRIVAL';
  const panelOpen = state.panel !== 'NONE';
  const browsing = state.map === 'BROWSING';

  return (
    <div style={{
      width: '100%', height: 180, background: '#0c1318', borderRadius: 10,
      border: '1px solid rgba(255,255,255,0.12)', overflow: 'hidden', position: 'relative',
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#1a2535,#0f1a28)' }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 400 180" fill="none">
          {inGuidance && <path d="M20 100 Q100 70 200 100 T380 90" stroke="#e2001a" strokeWidth="2.5" strokeLinecap="round" opacity="0.9"/>}
          <path d="M0 130 Q80 90 200 130 T400 120" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5"/>
          <path d="M100 0 L105 180" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
          <path d="M270 0 L260 180" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
        </svg>
        <div style={{ position: 'absolute', top: '50%', left: '52%', width: 10, height: 10, borderRadius: '50%', background: browsing ? '#f59e0b' : '#e2001a', boxShadow: `0 0 0 4px ${browsing ? 'rgba(245,158,11,0.3)' : 'rgba(226,0,26,0.3)'}` }} />
        {browsing && (
          <div style={{ position: 'absolute', top: '30%', right: '35%', fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: 4 }}>
            browsing…
          </div>
        )}
      </div>

      {/* Full-screen panel overlay */}
      {panelOpen && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(12,19,24,0.92)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{state.panel}</div>
          <div style={{ width: 160, height: 2, background: '#e2001a', borderRadius: 1 }} />
          <div style={{ width: 120, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }} />
          <div style={{ width: 100, height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 3 }} />
        </div>
      )}

      {/* Guidance NIP */}
      {inGuidance && !panelOpen && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: '#1a6040', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '1.4rem', color: 'white' }}>↖</span>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>1.2 mi</div>
            <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.7)' }}>Oak Street North</div>
          </div>
        </div>
      )}

      {/* Arrival */}
      {inArrival && !panelOpen && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(12,19,24,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <div style={{ fontSize: '1.2rem' }}>📍</div>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'white' }}>You have arrived</div>
        </div>
      )}

      {/* Passive/Active badge */}
      <div style={{
        position: 'absolute', bottom: 8, right: 8,
        fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.06em',
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

function UIStateExplorer() {
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

        // Derive your own active/passive signal
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {Object.entries(STATE_DIMS).map(([dim, { label, values, desc }]) => (
          <div key={dim} style={{ padding: '12px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8 }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, marginBottom: 2, color: 'var(--black)' }}>{label}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: 10, lineHeight: 1.4 }}>{desc}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {values.map(v => (
                <button
                  key={v}
                  onClick={() => set(dim, v)}
                  style={{
                    fontSize: '0.65rem', fontFamily: 'var(--font-mono)', padding: '3px 7px',
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
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: passive ? '#15803d' : '#e2001a' }}>
            {passive ? 'Passive mode' : 'Active mode'}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--mid)', marginLeft: 8 }}>
            {passive
              ? 'Orchestrator may show domain widgets over the map.'
              : 'Orchestrator should hide or collapse domain widgets.'}
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

/* ─── Button bar configurator ───────────────────────────────── */
const BTN_POSITIONS = [
  { id: 'LEFT',   label: 'Vertical — Left',   icon: '⬅', desc: 'Vertical bar on the left side' },
  { id: 'RIGHT',  label: 'Vertical — Right',  icon: '➡', desc: 'Vertical bar on the right side' },
  { id: 'TOP',    label: 'Horizon — Top',     icon: '⬆', desc: 'Horizontal bar on the top side' },
  { id: 'BOTTOM', label: 'Horizon — Bottom',  icon: '⬇', desc: 'Horizontal bar on the bottom side' },
];

const BTN_ORDER = ['🔍', '⚡', '🔇', '⚙️'];

function ButtonBarConfig() {
  const [position, setPosition] = useState('LEFT');
  const [buttons, setButtons] = useState(BTN_ORDER);
  const [hiddenBtns, setHiddenBtns] = useState([]);

  const isVertical = position === 'LEFT' || position === 'RIGHT';

  const toggleHide = (icon) => {
    setHiddenBtns(h => h.includes(icon) ? h.filter(x => x !== icon) : [...h, icon]);
  };

  const visibleButtons = buttons.filter(b => !hiddenBtns.includes(b));

  const btnKt = `homeScreenLayout.setControlsZone(
    ControlsZone(
        position = ControlsPosition.${position},
        buttons  = listOf(${visibleButtons.map(b => {
          const map = {'🔍':'SEARCH','⚡':'CHARGING','🔇':'MUTE','⚙️':'QUICK_SETTINGS'};
          return `\n            ControlButton.${map[b]}`;
        }).join(',')}\n        )
    )
)`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Position selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {BTN_POSITIONS.map(p => (
          <button key={p.id} onClick={() => setPosition(p.id)} style={{
            padding: '8px 4px', borderRadius: 7, cursor: 'pointer', textAlign: 'center',
            background: position === p.id ? '#fff5f5' : 'var(--bg)',
            border: `1px solid ${position === p.id ? 'var(--red)' : 'var(--border)'}`,
            color: position === p.id ? 'var(--red)' : 'var(--mid)',
            transition: 'all 0.1s',
          }}>
            <div style={{ fontSize: '1rem', marginBottom: 3 }}>{p.icon}</div>
            <div style={{ fontSize: '0.68rem', fontWeight: 600 }}>{p.label}</div>
          </button>
        ))}
      </div>

      {/* Screen preview + button visibility */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ width: 280, height: 175, background: '#0c1318', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#1a2535,#0f1a28)' }}>
            <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 280 175" fill="none">
              <path d="M20 90 Q80 60 140 90 T260 80" stroke="#e2001a" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
            </svg>
            <div style={{ position: 'absolute', top: '48%', left: '50%', width: 8, height: 8, borderRadius: '50%', background: '#e2001a', boxShadow: '0 0 0 3px rgba(226,0,26,0.3)' }} />
          </div>

          {/* Controls zone */}
          {(() => {
            const style = {
              position: 'absolute',
              background: 'rgba(0,0,0,0.55)',
              display: 'flex',
              gap: 4,
              padding: 6,
              ...(position === 'LEFT'   ? { top: 0, left: 0, bottom: 0, flexDirection: 'column', width: 32, borderRight: '1px solid rgba(255,255,255,0.08)' } : {}),
              ...(position === 'RIGHT'  ? { top: 0, right: 0, bottom: 0, flexDirection: 'column', width: 32, borderLeft: '1px solid rgba(255,255,255,0.08)' } : {}),
              ...(position === 'TOP'    ? { top: 0, left: 0, right: 0, flexDirection: 'row', height: 32, borderBottom: '1px solid rgba(255,255,255,0.08)' } : {}),
              ...(position === 'BOTTOM' ? { bottom: 0, left: 0, right: 0, flexDirection: 'row', height: 32, borderTop: '1px solid rgba(255,255,255,0.08)', justifyContent: 'center' } : {}),
            };
            return (
              <div style={style}>
                {visibleButtons.map(icon => (
                  <div key={icon} style={{ width: 20, height: 20, borderRadius: 4, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', flexShrink: 0 }}>{icon}</div>
                ))}
              </div>
            );
          })()}
        </div>

        {/* Button visibility toggles */}
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{ fontSize: '0.76rem', fontWeight: 600, marginBottom: 8 }}>Button visibility</div>
          {BTN_ORDER.map(icon => {
            const labels = { '🔍': 'Search', '⚡': 'Charging Finder', '🔇': 'Mute', '⚙️': 'Quick Settings' };
            const hidden = hiddenBtns.includes(icon);
            return (
              <div key={icon} onClick={() => toggleHide(icon)} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px',
                marginBottom: 5, borderRadius: 6, cursor: 'pointer',
                background: hidden ? 'var(--bg)' : '#fff',
                border: '1px solid var(--border)', opacity: hidden ? 0.5 : 1,
                transition: 'all 0.1s',
              }}>
                <span style={{ fontSize: '0.85rem' }}>{icon}</span>
                <span style={{ fontSize: '0.78rem', flex: 1 }}>{labels[icon]}</span>
                <span style={{ fontSize: '0.65rem', color: hidden ? 'var(--muted)' : 'var(--green)', fontWeight: 600 }}>
                  {hidden ? 'hidden' : 'shown'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <CodeBlock tabs={['Kotlin']}>
        <pre>
          {'homeScreenLayout.'}<span className="hl-f">setControlsZone</span>{'(\n'}
          {'    '}<span className="hl-t">ControlsZone</span>{'(\n'}
          {'        '}<span className="hl-f">position</span>{' = '}<span className="hl-t">ControlsPosition</span>{'.'}<span className="hl-n">{position}</span>{',\n'}
          {'        '}<span className="hl-f">buttons</span>{'  = listOf('}
          {visibleButtons.map((b, i) => {
            const map = {'🔍':'SEARCH','⚡':'CHARGING','🔇':'MUTE','⚙️':'QUICK_SETTINGS'};
            return <span key={b}>{'\n            '}<span className="hl-t">ControlButton</span>{'.'}<span className="hl-n">{map[b]}</span>{i < visibleButtons.length - 1 ? ',' : ''}</span>;
          })}
          {'\n        )\n    )\n)'}
        </pre>
      </CodeBlock>
    </div>
  );
}

/* ─── Main page ─────────────────────────────────────────────── */
export default function HomeScreenLayout() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Home Screen Layout</h1>
        <div className="page-meta">
          <span className="meta-tag private">Private</span>
          <span className="meta-tag">v0.3 · Q2 2026</span>
        </div>
      </div>

      <div className="quick-answer">
        <strong>Map as wallpaper</strong> — the navigation map fills the entire IVI home screen
        as a background. Other domain widgets (media, climate, phone) layer on top. The IVI
        home-screen orchestrator controls how much space is given to navigation at any point;
        the navigation app exposes four observable UI state dimensions so the orchestrator can
        make its own widget visibility decisions without being coupled to TomTom's API.
      </div>

      {/* Overview */}
      <div className="zone">
        <h2 className="sh" id="h-overview">Overview</h2>
        <p className="body">
          Embedding the map as the IVI home screen wallpaper keeps spatial awareness continuously
          visible and reduces the interaction depth required to start navigation. The orchestrator
          retains full control of layout: it decides the size of the navigation application area
          and when to show or collapse domain widgets, based on the state signals the navigation
          app exposes.
        </p>
        <Callout type="info">
          Navigation in a <strong>dedicated window or view</strong> is a separate integration
          pattern covered in a different PRD. This page covers the <em>map as wallpaper</em>
          pattern only.
        </Callout>
      </div>

      {/* Screen zones */}
      <div className="zone">
        <h2 className="sh" id="h-zones">Screen zones</h2>
        <p className="body">
          The IVI interface is divided into named areas. Click a zone below to see where it
          sits on screen and what it contains.
        </p>
        <ZonesDiagram />
      </div>

      {/* Resize */}
      <div className="zone">
        <h2 className="sh" id="h-resize">Resize the application area</h2>
        <p className="body">
          The orchestrator can dynamically resize the navigation application area from any side
          — top, bottom, left, or right — simultaneously. The navigation app transitions smoothly
          to the new area with a configurable animation. Drag the sliders below to see how
          the application area and generated code change.
        </p>
        <Callout type="warn">
          Resizing can occur on multiple sides simultaneously. The navigation app must adhere
          to the viewable application area across <strong>all</strong> flows and screens.
          Our documentation includes recommended minimum sizes for the application area.
        </Callout>
        <ResizeDemo />
      </div>

      {/* UI State */}
      <div className="zone">
        <h2 className="sh" id="h-states">UI state API</h2>
        <p className="body">
          Rather than a binary active/passive flag, the navigation app exposes{' '}
          <strong>four orthogonal observable state dimensions</strong>. The orchestrator
          composes these into its own widget visibility logic — TomTom&apos;s API is not coupled
          to any specific OEM integration pattern.
        </p>
        <p className="body">
          Use the selector below to explore each state combination. The preview and Kotlin
          observer snippet update live.
        </p>
        <UIStateExplorer />
      </div>

      {/* Controls zone */}
      <div className="zone">
        <h2 className="sh" id="h-controls">Button bar position</h2>
        <p className="body">
          The primary controls zone — Search, Charging Finder, Mute, Quick Settings — can be
          positioned on any edge of the screen. Each position also supports customising which
          buttons are shown and in what order.
        </p>
        <ButtonBarConfig />
      </div>

      {/* Requirements summary */}
      <div className="zone">
        <h2 className="sh" id="h-requirements">Requirements summary</h2>
        <table className="prop-table">
          <thead><tr><th>Requirement</th><th>Priority</th><th>Notes</th></tr></thead>
          <tbody>
            {[
              ['Set the navigation application area', 'P0 · R2', 'All flows and screens must adhere to the configured area'],
              ['Dynamically resize from any side', 'P0 · R2', 'Top, bottom, left, right — simultaneously, with animation'],
              ['Expose 4 UI state dimensions', 'P0 · R2', 'Activity, Panel, Map Interaction, Trip Planning'],
              ['Sync animation type + duration', 'P0 · R2', 'Orchestrator-controlled so widget animations can be synchronised'],
              ['Dynamic safe area / horizon rebalancing', 'P1', 'Resize horizon panel when safe area is compromised'],
              ['Resize on all display types', 'P1', 'Center, passenger, and rear seat displays'],
              ['Button bar position control', 'P1', 'Left, right, top, bottom vertical/horizontal bar'],
              ['Button order + visibility control', 'P1', 'Per-slot configuration within each zone option'],
            ].map(([req, pri, notes]) => (
              <tr key={req}>
                <td style={{ fontWeight: 500 }}>{req}</td>
                <td>
                  <span style={{
                    fontSize: '0.68rem', fontWeight: 700, padding: '2px 6px', borderRadius: 3,
                    background: pri.includes('P0') ? '#fff5f5' : 'var(--bg)',
                    color: pri.includes('P0') ? 'var(--red)' : 'var(--muted)',
                    border: `1px solid ${pri.includes('P0') ? '#fecaca' : 'var(--border)'}`,
                    whiteSpace: 'nowrap',
                  }}>
                    {pri}
                  </span>
                </td>
                <td style={{ color: 'var(--mid)', fontSize: '0.82rem' }}>{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="feedback-strip">
        Was this page helpful?
        <button>👍 Yes</button>
        <button>👎 No</button>
      </div>
    </div>
  );
}
