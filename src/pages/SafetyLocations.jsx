import { useState } from 'react';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import { ApiLinks } from '../components/ui/ApiLinks';
import PageActions from '../components/ui/PageActions';

const SAFETY_APIS = [
  {
    name: 'Map Display for Compose',
    type: 'Android SDK',
    description: 'Integrate a fully interactive TomTom map into a Jetpack Compose layout with a single composable.',
    pageId: 'navsdk-map-compose', productId: 'navsdk',
  },
  {
    name: 'Navigation — Safety Locations',
    type: 'Android SDK',
    description: 'Register speed camera and hazard alerts triggered as the vehicle approaches safety locations along the route.',
    pageId: 'navsdk-nav-safety', productId: 'navsdk',
  },
  {
    name: 'Horizon — Safety Locations',
    type: 'Android SDK',
    description: 'Stream safety cameras and speed zone data ahead of the vehicle using the Virtual Horizon engine.',
    pageId: 'navsdk-horizon-safety', productId: 'navsdk',
  },
  {
    name: 'TomTom Map Maker',
    type: 'Tool',
    description: 'Customise safety location icon styles — size, colour, and appearance — in your map style and publish directly to UX Library.',
    url: 'https://mapmaker.tomtom.com',
  },
];

/* ─── Shared map base ───────────────────────────────────────── */
function MapBase({ children, height = 260 }) {
  return (
    <div style={{
      width: '100%', maxWidth: 360, height, background: '#1a2535',
      borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)',
      position: 'relative', overflow: 'hidden', flexShrink: 0,
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#1a2535,#0f1a28)' }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 360 260" fill="none">
          <line x1="0" y1="65" x2="360" y2="63" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
          <line x1="0" y1="130" x2="360" y2="128" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
          <line x1="0" y1="195" x2="360" y2="197" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
          <line x1="75"  y1="0" x2="72"  y2="260" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
          <line x1="180" y1="0" x2="182" y2="260" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
          <line x1="285" y1="0" x2="283" y2="260" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
          <path d="M30 230 Q90 200 140 170 Q200 140 240 100 Q280 65 330 40"
            stroke="rgba(255,255,255,0.22)" strokeWidth="5" strokeLinecap="round"/>
          <path d="M0 105 Q80 100 180 102 T360 98"
            stroke="rgba(255,255,255,0.12)" strokeWidth="3" strokeLinecap="round"/>
          <path d="M200 0 Q195 80 195 130 T193 260"
            stroke="rgba(255,255,255,0.10)" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      </div>
      {/* Nav arrow */}
      <div style={{
        position: 'absolute', bottom: '24%', left: '20%',
        width: 0, height: 0,
        borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
        borderBottom: '12px solid #e2001a',
        filter: 'drop-shadow(0 0 4px rgba(226,0,26,0.6))',
        transform: 'rotate(45deg)',
        zIndex: 5,
      }} />
      {children}
    </div>
  );
}

/* ─── Safety location type definitions ──────────────────────── */
const SAFETY_TYPES = [
  {
    id: 'SPEED_CAMERA',
    label: 'Speed cameras',
    icon: '📷',
    color: '#ef4444',
    description: 'Fixed speed enforcement cameras on roads.',
    positions: [{ x: '62%', y: '38%' }, { x: '28%', y: '64%' }],
  },
  {
    id: 'MOBILE_SPEED_CAMERA',
    label: 'Mobile speed cameras',
    icon: '🚔',
    color: '#f59e0b',
    description: 'Temporary or mobile enforcement points.',
    positions: [{ x: '74%', y: '22%' }],
  },
  {
    id: 'SPEED_ZONE',
    label: 'Speed zones',
    icon: '🟦',
    color: '#3b82f6',
    description: 'Speed-limited sections shown as tube overlays with start/end markers.',
    isTube: true,
    tubeStart: { x1: 102, y1: 170, x2: 175, y2: 135 },
  },
  {
    id: 'DANGER_ZONE',
    label: 'Danger zones',
    icon: '⚠️',
    color: '#f97316',
    description: 'Hazardous road sections shown as tube overlays with start/end markers.',
    isTube: true,
    tubeStart: { x1: 218, y1: 108, x2: 272, y2: 72 },
  },
];

function TubeOverlay({ type, visible }) {
  if (!visible || !type.isTube) return null;
  const { tubeStart: t, color } = type;
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 360 260" fill="none">
      <line x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
        stroke={color} strokeWidth="7" strokeLinecap="round" opacity="0.5"/>
      <circle cx={t.x1} cy={t.y1} r="5" fill={color} opacity="0.9"/>
      <circle cx={t.x1} cy={t.y1} r="8" fill="none" stroke={color} strokeWidth="2" opacity="0.5"/>
      <circle cx={t.x2} cy={t.y2} r="5" fill={color} opacity="0.9"/>
      <circle cx={t.x2} cy={t.y2} r="8" fill="none" stroke={color} strokeWidth="2" opacity="0.5"/>
    </svg>
  );
}

function IconOverlay({ type, visible }) {
  if (!visible || type.isTube) return null;
  return (
    <>
      {type.positions.map((pos, i) => (
        <div key={i} style={{
          position: 'absolute', left: pos.x, top: pos.y,
          transform: 'translate(-50%, -50%)',
          background: type.color, borderRadius: 6,
          padding: '3px 6px', fontSize: 14,
          boxShadow: `0 0 0 3px ${type.color}40`,
          zIndex: 10, lineHeight: 1,
        }}>
          {type.icon}
        </div>
      ))}
    </>
  );
}

/* ─── Visibility configurator ───────────────────────────────── */
function VisibilityConfigurator() {
  const [hidden, setHidden] = useState(new Set());

  function toggle(id) {
    setHidden(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const hiddenList = SAFETY_TYPES.filter(t => hidden.has(t.id));
  const codeStr = hiddenList.length === 0
    ? `// All safety locations are shown by default\nnavigationVisualization.showAllSafetyLocations()`
    : `val hiddenTypes = setOf(\n${hiddenList.map(t => `    SafetyLocationType.${t.id}`).join(',\n')}\n)\nnavigationVisualization.hideSafetyLocations(hiddenTypes)`;

  return (
    <>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start', margin: '24px 0' }}>
        <MapBase>
          {SAFETY_TYPES.map(type => (
            <IconOverlay key={type.id} type={type} visible={!hidden.has(type.id)} />
          ))}
          {SAFETY_TYPES.map(type => (
            <TubeOverlay key={type.id} type={type} visible={!hidden.has(type.id)} />
          ))}
        </MapBase>

        <div style={{ flex: 1, minWidth: 220 }}>
          {SAFETY_TYPES.map(type => {
            const on = !hidden.has(type.id);
            return (
              <div key={type.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '12px 0', borderBottom: '1px solid var(--border)',
              }}>
                <button
                  onClick={() => toggle(type.id)}
                  style={{
                    width: 32, height: 18, borderRadius: 9, border: 'none',
                    background: on ? type.color : 'var(--mid)',
                    position: 'relative', cursor: 'pointer', flexShrink: 0, marginTop: 2,
                    transition: 'background 0.2s',
                  }}
                  aria-label={`Toggle ${type.label}`}
                >
                  <span style={{
                    position: 'absolute', top: 3,
                    left: on ? 17 : 3,
                    width: 12, height: 12, borderRadius: '50%', background: '#fff',
                    transition: 'left 0.2s',
                  }} />
                </button>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>
                    {type.icon} {type.label}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--mid)', marginTop: 2 }}>
                    {type.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <CodeBlock tabs={['Kotlin']}><pre>{codeStr}</pre></CodeBlock>
    </>
  );
}

/* ─── Zone diagram ──────────────────────────────────────────── */
function ZoneDiagram() {
  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start', margin: '24px 0' }}>
      <MapBase>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 360 260" fill="none">
          <line x1="100" y1="172" x2="178" y2="136" stroke="#3b82f6" strokeWidth="8" strokeLinecap="round" opacity="0.55"/>
          <circle cx="100" cy="172" r="5" fill="#3b82f6" opacity="0.95"/>
          <circle cx="100" cy="172" r="9" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.5"/>
          <circle cx="178" cy="136" r="5" fill="#3b82f6" opacity="0.95"/>
          <circle cx="178" cy="136" r="9" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.5"/>
          <line x1="215" y1="110" x2="275" y2="72" stroke="#f97316" strokeWidth="8" strokeLinecap="round" opacity="0.55"/>
          <circle cx="215" cy="110" r="5" fill="#f97316" opacity="0.95"/>
          <circle cx="215" cy="110" r="9" fill="none" stroke="#f97316" strokeWidth="2" opacity="0.5"/>
          <circle cx="275" cy="72" r="5" fill="#f97316" opacity="0.95"/>
          <circle cx="275" cy="72" r="9" fill="none" stroke="#f97316" strokeWidth="2" opacity="0.5"/>
        </svg>
        <div style={{ position: 'absolute', left: '22%', top: '57%', fontSize: 10, color: '#3b82f6', fontWeight: 700, background: 'rgba(0,0,0,0.5)', borderRadius: 4, padding: '2px 5px' }}>Speed zone</div>
        <div style={{ position: 'absolute', left: '58%', top: '28%', fontSize: 10, color: '#f97316', fontWeight: 700, background: 'rgba(0,0,0,0.5)', borderRadius: 4, padding: '2px 5px' }}>Danger zone</div>
      </MapBase>

      <div style={{ flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          { color: '#3b82f6', label: 'Speed zone', desc: 'A stretch of road with a defined speed limit enforcement zone.' },
          { color: '#f97316', label: 'Danger zone', desc: 'A stretch of road marked as a hazardous area.' },
        ].map(item => (
          <div key={item.label} style={{
            display: 'flex', gap: 12, alignItems: 'flex-start',
            background: 'var(--bg)', borderRadius: 20, padding: 12,
            border: `1px solid ${item.color}30`,
          }}>
            <div style={{ width: 32, height: 8, borderRadius: 4, background: item.color, opacity: 0.8, flexShrink: 0, marginTop: 6 }}/>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>{item.label}</div>
              <div style={{ fontSize: 12, color: 'var(--mid)', marginTop: 3 }}>{item.desc}</div>
            </div>
          </div>
        ))}
        <p className="body" style={{ margin: 0 }}>
          Both zone types render a <strong>Start Marker</strong> and <strong>End Marker</strong> at the boundary of the zone.
        </p>
      </div>
    </div>
  );
}

/* ─── Style customisation ───────────────────────────────────── */
function StyleTabs() {
  const [tab, setTab] = useState(0);
  const tabs = [
    {
      label: 'Speed camera',
      code: `val customStyle = SafetyLocationStyle(
    speedCameraIcon = R.drawable.my_speed_camera,
    speedCameraColour = Color.RED,
    speedCameraActiveColour = Color.YELLOW
)`,
    },
    {
      label: 'Speed zone',
      code: `val customStyle = SafetyLocationStyle(
    speedZoneTubeColour = Color.parseColor("#3b82f6"),
    speedZoneStartMarkerIcon = R.drawable.my_zone_start,
    speedZoneEndMarkerIcon = R.drawable.my_zone_end
)`,
    },
    {
      label: 'Apply style',
      code: `val styleConfig = StyleConfiguration(
    safetyLocationStyle = customStyle
)
navigationVisualization.updateStyle(styleConfig)`,
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', gap: 8, margin: '20px 0 12px', flexWrap: 'wrap' }}>
        {tabs.map((t, i) => (
          <button key={i} onClick={() => setTab(i)} style={{
            padding: '6px 14px', borderRadius: 20, fontSize: 13, cursor: 'pointer', border: 'none',
            background: tab === i ? 'var(--accent)' : 'var(--bg)',
            color: tab === i ? '#fff' : 'var(--mid)',
            fontWeight: tab === i ? 600 : 400,
          }}>
            {t.label}
          </button>
        ))}
      </div>
      <CodeBlock tabs={['Kotlin']}><pre>{tabs[tab].code}</pre></CodeBlock>
    </>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export default function SafetyLocations({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Safety Locations</h1>
        <PageActions />
      </div>

      <div className="quick-answer">
        Speed cameras, enforcement zones, and danger areas — rendered automatically once Navigation Visualisation is initialised.
      </div>

      <ApiLinks items={SAFETY_APIS} onNavigate={onNavigate} />

      <div className="zone">
        <h2 className="sh" id="sl-overview">Overview</h2>
        <p className="body">
          Safety locations are displayed on the map during active navigation once
          <code>NavigationVisualizationFactory</code> is initialised. All four types are visible
          by default.
        </p>
        <p className="body">Add the required dependency to your module's <code>build.gradle</code>:</p>
        <CodeBlock tabs={['Kotlin']}><pre>{`implementation("com.tomtom.sdk.maps.visualization:navigation:2.2.0")`}</pre></CodeBlock>
        <p className="body">Then create the visualisation instance:</p>
        <CodeBlock tabs={['Kotlin']}><pre>{`val navigationVisualization = NavigationVisualizationFactory.create(\n    tomTomMap = tomTomMap,\n    navigation = tomtomNavigation\n)`}</pre></CodeBlock>
        <Callout type="info">
          Safety locations are shown on the map only during an active navigation session.
          They are hidden automatically when navigation ends.
        </Callout>
      </div>

      <div className="zone">
        <h2 className="sh" id="sl-types">Safety location types</h2>
        <p className="body">
          Four types of safety location are shown on the map during navigation. All are visible
          by default. Use the toggles below to hide individual types and see the generated API call.
        </p>
        <VisibilityConfigurator />
      </div>

      <div className="zone">
        <h2 className="sh" id="sl-zones">Speed zones &amp; danger zones</h2>
        <p className="body">
          Speed zones and danger zones are rendered as coloured tube overlays along the road
          segment, with distinct start and end markers. This makes it easy to see exactly where
          a zone begins and ends as you approach.
        </p>
        <ZoneDiagram />
      </div>

      <div className="zone">
        <h2 className="sh" id="sl-style">Style customisation</h2>
        <p className="body">
          Use <code>SafetyLocationStyle</code> to override default icon drawables and colours
          for each safety location type. Pass the style to <code>StyleConfiguration</code> and
          apply it via <code>navigationVisualization.updateStyle()</code>.
        </p>
        <StyleTabs />
      </div>

      <div className="zone">
        <h2 className="sh" id="sl-requirements">Requirements</h2>
        <table className="prop-table">
          <thead><tr><th>Requirement</th><th>Priority</th><th>Notes</th></tr></thead>
          <tbody>
            {[
              ['Initialise NavigationVisualizationFactory', 'P0', 'Required before any safety locations are shown'],
              ['All four location types shown by default', 'P0', 'Speed cameras, mobile cameras, speed zones, danger zones'],
              ['Hide individual location types', 'P1', 'Use hideSafetyLocations() with a set of SafetyLocationType values'],
              ['Speed and danger zones as tube overlays', 'P0', 'Rendered with start and end markers along the route segment'],
              ['Custom icons and colours via SafetyLocationStyle', 'P2', 'Applied through StyleConfiguration.safetyLocationStyle'],
            ].map(([req, pri, notes]) => (
              <tr key={req}>
                <td style={{ fontWeight: 500 }}>{req}</td>
                <td>
                  <span style={{
                    fontSize: '0.875rem', fontWeight: 700, padding: '2px 6px', borderRadius: 3,
                    background: pri === 'P0' ? '#fff5f5' : 'var(--bg)',
                    color: pri === 'P0' ? 'var(--red)' : 'var(--muted)',
                    border: `1px solid ${pri === 'P0' ? '#fecaca' : 'var(--border)'}`,
                  }}>{pri}</span>
                </td>
                <td style={{ color: 'var(--mid)', fontSize: '0.875rem' }}>{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
