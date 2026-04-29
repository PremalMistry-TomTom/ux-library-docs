import { useState } from 'react';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import { ApiLinks } from '../components/ui/ApiLinks';
import PageActions from '../components/ui/PageActions';

const MAP_DISPLAY_APIS = [
  {
    name: 'Map Display API',
    type: 'REST API',
    description: 'Tile-based mapping service powering the map view with vector tiles, raster imagery, and style bundles.',
    url: 'https://docs.tomtom.com/map-display-api/documentation/tomtom-maps/product-information/introduction',
  },
  {
    name: 'Map Display for Compose',
    type: 'Android SDK',
    description: 'Integrate a fully interactive TomTom map into a Jetpack Compose layout with a single composable.',
    url: 'https://docs.tomtom.com/navigation/android/guides/map-display/map-display-for-compose/quickstart',
  },
  {
    name: 'TomTom Map Maker',
    type: 'Tool',
    description: 'Customise traffic flow colours and incident icon styles in your map style, then publish and load directly into UX Library.',
    url: 'https://mapmaker.tomtom.com',
  },
  {
    name: 'Map Maker — Docs',
    type: 'Tool',
    description: 'Get started with Map Maker: style editor guide, layer reference, and publishing workflow.',
    url: 'https://docs.tomtom.com/map-maker/documentation/overview/introduction',
  },
];

/* ─── Shared map base ───────────────────────────────────────── */
function MapBase({ children, height = 240 }) {
  return (
    <div style={{
      width: '100%', maxWidth: 340, height, background: '#1a2535',
      borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
      position: 'relative', overflow: 'hidden', flexShrink: 0,
    }}>
      {/* Base map */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#1a2535,#0f1a28)' }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 340 240" fill="none">
          {/* Minor roads */}
          <line x1="0" y1="60" x2="340" y2="58" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
          <line x1="0" y1="120" x2="340" y2="118" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
          <line x1="0" y1="180" x2="340" y2="182" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
          <line x1="70" y1="0" x2="65" y2="240" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
          <line x1="170" y1="0" x2="172" y2="240" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
          <line x1="270" y1="0" x2="268" y2="240" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
          {/* Major roads (grey base) */}
          <path d="M0 95 Q85 88 170 95 T340 91" stroke="rgba(255,255,255,0.14)" strokeWidth="4" strokeLinecap="round"/>
          <path d="M110 0 Q114 95 115 150 T118 240" stroke="rgba(255,255,255,0.14)" strokeWidth="4" strokeLinecap="round"/>
          <path d="M0 155 Q80 148 170 155 T340 150" stroke="rgba(255,255,255,0.1)" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      </div>
      {/* Position dot */}
      <div style={{ position: 'absolute', top: '42%', left: '34%', width: 9, height: 9, borderRadius: '50%', background: '#e2001a', boxShadow: '0 0 0 3px rgba(226,0,26,0.3)', zIndex: 5 }} />
      {children}
    </div>
  );
}

/* ─── Flow colours ──────────────────────────────────────────── */
const FLOW_COLOURS = {
  free:    '#22c55e',
  slow:    '#f59e0b',
  heavy:   '#ef4444',
  standst: '#7f1d1d',
};

function FlowOverlay({ visible, style: flowStyle }) {
  if (!visible) return null;

  const segments = flowStyle === 'RELATIVE'
    ? [
        { d: 'M0 95 Q40 90 80 94',        color: FLOW_COLOURS.free,    w: 4 },
        { d: 'M80 94 Q110 92 140 96',      color: FLOW_COLOURS.slow,    w: 4 },
        { d: 'M140 96 Q160 94 200 95',     color: FLOW_COLOURS.heavy,   w: 4 },
        { d: 'M200 95 Q260 92 340 91',     color: FLOW_COLOURS.standst, w: 4 },
        { d: 'M110 0 Q113 40 114 80',      color: FLOW_COLOURS.free,    w: 4 },
        { d: 'M114 80 Q114 110 115 130',   color: FLOW_COLOURS.slow,    w: 4 },
        { d: 'M115 130 Q116 160 117 200',  color: FLOW_COLOURS.heavy,   w: 4 },
        { d: 'M117 200 Q118 220 118 240',  color: FLOW_COLOURS.free,    w: 4 },
      ]
    : [
        { d: 'M0 95 Q85 88 170 95 T340 91',     color: FLOW_COLOURS.slow,  w: 4 },
        { d: 'M110 0 Q114 95 115 150 T118 240', color: FLOW_COLOURS.heavy, w: 4 },
      ];

  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 340 240" fill="none">
      {segments.map((seg, i) => (
        <path key={i} d={seg.d} stroke={seg.color} strokeWidth={seg.w} strokeLinecap="round" opacity="0.85"/>
      ))}
    </svg>
  );
}

/* ─── Incident icons ────────────────────────────────────────── */
const INCIDENT_TYPES = [
  { id: 'ACCIDENT',  icon: '💥', label: 'Accident',   x: '42%', y: '55%', color: '#ef4444' },
  { id: 'ROAD_WORK', icon: '🚧', label: 'Road work',  x: '65%', y: '37%', color: '#f59e0b' },
  { id: 'CLOSURE',   icon: '🚫', label: 'Closure',    x: '18%', y: '37%', color: '#94a3b8' },
  { id: 'HAZARD',    icon: '⚠️', label: 'Hazard',    x: '70%', y: '68%', color: '#f97316' },
  { id: 'WEATHER',   icon: '🌧', label: 'Weather',   x: '28%', y: '72%', color: '#60a5fa' },
];

function IncidentOverlay({ visible, enabled }) {
  if (!visible) return null;
  return (
    <>
      {INCIDENT_TYPES.filter(t => enabled.includes(t.id)).map(t => (
        <div key={t.id} style={{
          position: 'absolute', left: t.x, top: t.y,
          transform: 'translate(-50%, -50%)',
          fontSize: '0.9rem', zIndex: 6,
          filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.6))',
        }}>{t.icon}</div>
      ))}
    </>
  );
}

/* ─── Traffic layer configurator ───────────────────────────── */
function LayerConfigurator() {
  const [flowOn, setFlowOn] = useState(true);
  const [incOn, setIncOn]  = useState(true);
  const [flowStyle, setFlowStyle] = useState('RELATIVE');

  const Toggle = ({ label, on, onToggle }) => (
    <div onClick={onToggle} style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
      borderRadius: 7, cursor: 'pointer', marginBottom: 6,
      background: on ? '#fff' : 'var(--bg)', border: '1px solid var(--border)',
      transition: 'all 0.12s',
    }}>
      <div style={{ width: 32, height: 18, borderRadius: 9, background: on ? 'var(--red)' : 'var(--border)', position: 'relative', flexShrink: 0, transition: 'background 0.15s' }}>
        <div style={{ position: 'absolute', top: 2, left: on ? 14 : 2, width: 14, height: 14, borderRadius: '50%', background: 'white', transition: 'left 0.15s' }} />
      </div>
      <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>{label}</span>
      <span style={{ marginLeft: 'auto', fontSize: '0.68rem', fontWeight: 600, color: on ? '#16a34a' : 'var(--muted)' }}>{on ? 'on' : 'off'}</span>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <MapBase>
          <FlowOverlay visible={flowOn} style={flowStyle} />
          <IncidentOverlay visible={incOn} enabled={INCIDENT_TYPES.map(t => t.id)} />
          {/* Flow legend */}
          {flowOn && (
            <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.65)', borderRadius: 6, padding: '5px 8px' }}>
              {[['Free flow', FLOW_COLOURS.free], ['Slow', FLOW_COLOURS.slow], ['Heavy', FLOW_COLOURS.heavy], ['Standstill', FLOW_COLOURS.standst]].map(([l, c]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                  <div style={{ width: 14, height: 3, borderRadius: 2, background: c }} />
                  <span style={{ fontSize: '0.45rem', color: 'rgba(255,255,255,0.7)', fontFamily: 'sans-serif' }}>{l}</span>
                </div>
              ))}
            </div>
          )}
        </MapBase>

        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: 8 }}>Layers</div>
          <Toggle label="Traffic flow" on={flowOn} onToggle={() => setFlowOn(v => !v)} />
          <Toggle label="Traffic incidents" on={incOn} onToggle={() => setIncOn(v => !v)} />

          {flowOn && (
            <>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', margin: '14px 0 8px' }}>Flow style</div>
              {[{ id: 'RELATIVE', label: 'Relative', desc: 'Colours show speed as % of free-flow baseline' }, { id: 'ABSOLUTE', label: 'Absolute', desc: 'Colours map to fixed speed thresholds (km/h)' }].map(opt => (
                <div key={opt.id} onClick={() => setFlowStyle(opt.id)} style={{
                  padding: '7px 10px', borderRadius: 7, cursor: 'pointer', marginBottom: 5,
                  background: flowStyle === opt.id ? '#fff5f5' : 'var(--bg)',
                  border: `1px solid ${flowStyle === opt.id ? 'var(--red)' : 'var(--border)'}`,
                  transition: 'all 0.1s',
                }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: flowStyle === opt.id ? 600 : 400, color: flowStyle === opt.id ? 'var(--red)' : 'var(--black)' }}>{opt.label}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: 2 }}>{opt.desc}</div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <CodeBlock tabs={['Kotlin']}>
        <pre>
          {'mapView.'}<span className="hl-f">setTrafficConfiguration</span>{'(\n'}
          {'    '}<span className="hl-t">TrafficConfiguration</span>{'(\n'}
          {'        '}<span className="hl-f">flowEnabled</span>{'      = '}<span className="hl-n">{flowOn ? 'true' : 'false'}</span>{',\n'}
          {'        '}<span className="hl-f">incidentsEnabled</span>{' = '}<span className="hl-n">{incOn ? 'true' : 'false'}</span>{',\n'}
          {flowOn && <span>{'        '}<span className="hl-f">flowStyle</span>{'       = '}<span className="hl-t">FlowStyle</span>{'.'}<span className="hl-n">{flowStyle}</span>{'\n'}</span>}
          {'    )\n)'}
        </pre>
      </CodeBlock>
    </div>
  );
}

/* ─── Incident type filter ──────────────────────────────────── */
function IncidentFilter() {
  const [enabled, setEnabled] = useState(INCIDENT_TYPES.map(t => t.id));
  const toggle = id => setEnabled(e => e.includes(id) ? e.filter(x => x !== id) : [...e, id]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <MapBase>
          <IncidentOverlay visible enabled={enabled} />
        </MapBase>

        <div style={{ flex: 1, minWidth: 200 }}>
          {INCIDENT_TYPES.map(t => {
            const on = enabled.includes(t.id);
            return (
              <div key={t.id} onClick={() => toggle(t.id)} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px',
                borderRadius: 7, cursor: 'pointer', marginBottom: 6,
                background: on ? '#fff' : 'var(--bg)', border: '1px solid var(--border)',
                opacity: on ? 1 : 0.45, transition: 'all 0.12s',
              }}>
                <span style={{ fontSize: '1rem' }}>{t.icon}</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 500, flex: 1 }}>{t.label}</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 600, color: on ? '#16a34a' : 'var(--muted)' }}>{on ? 'shown' : 'hidden'}</span>
              </div>
            );
          })}
        </div>
      </div>

      <CodeBlock tabs={['Kotlin']}>
        <pre>
          {'mapView.'}<span className="hl-f">setIncidentFilter</span>{'(\n'}
          {'    '}<span className="hl-t">IncidentFilter</span>{'(\n'}
          {'        '}<span className="hl-f">types</span>{' = setOf(\n'}
          {INCIDENT_TYPES.filter(t => enabled.includes(t.id)).map((t, i, arr) => (
            <span key={t.id}>
              {'            '}<span className="hl-t">IncidentType</span>{'.'}<span className="hl-n">{t.id}</span>{i < arr.length - 1 ? ',\n' : '\n'}
            </span>
          ))}
          {'        )\n    )\n)'}
        </pre>
      </CodeBlock>
    </div>
  );
}

/* ─── Refresh interval demo ─────────────────────────────────── */
function RefreshDemo() {
  const PRESETS = [
    { id: 30,  label: '30 s',   note: 'Near real-time. Higher data usage.' },
    { id: 60,  label: '1 min',  note: 'Balanced. Recommended default.' },
    { id: 120, label: '2 min',  note: 'Reduced data. Suitable for limited connectivity.' },
    { id: 300, label: '5 min',  note: 'Minimal refresh. Best-effort traffic only.' },
  ];
  const [interval, setInterval] = useState(60);
  const sel = PRESETS.find(p => p.id === interval);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {PRESETS.map(p => (
          <button key={p.id} onClick={() => setInterval(p.id)} style={{
            padding: '8px 4px', borderRadius: 7, cursor: 'pointer', textAlign: 'center',
            background: interval === p.id ? '#fff5f5' : 'var(--bg)',
            border: `1px solid ${interval === p.id ? 'var(--red)' : 'var(--border)'}`,
            color: interval === p.id ? 'var(--red)' : 'var(--mid)',
            transition: 'all 0.1s',
          }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{p.label}</div>
          </button>
        ))}
      </div>
      <div style={{ padding: '10px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 7, fontSize: '0.8rem', color: 'var(--mid)' }}>
        {sel?.note}
      </div>
      <CodeBlock tabs={['Kotlin']}>
        <pre>
          {'mapView.'}<span className="hl-f">setTrafficConfiguration</span>{'(\n'}
          {'    '}<span className="hl-t">TrafficConfiguration</span>{'(\n'}
          {'        '}<span className="hl-f">flowEnabled</span>{'         = '}<span className="hl-n">true</span>{',\n'}
          {'        '}<span className="hl-f">incidentsEnabled</span>{'     = '}<span className="hl-n">true</span>{',\n'}
          {'        '}<span className="hl-f">refreshIntervalSec</span>{'   = '}<span className="hl-n">{interval}</span>{'\n'}
          {'    )\n)'}
        </pre>
      </CodeBlock>
    </div>
  );
}

/* ─── Main page ─────────────────────────────────────────────── */
export default function TrafficPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Traffic</h1>
        <PageActions />
      </div>

      <div className="quick-answer">
        UX Library renders <strong>live traffic data</strong> directly on the map — colour-coded
        flow tiles showing road speeds and incident icons marking accidents, roadworks, closures,
        hazards, and weather events. Both layers are independently configurable and can be
        toggled, filtered, and refreshed on a custom schedule.
      </div>

      <ApiLinks items={MAP_DISPLAY_APIS} title="APIs & Resources" />

      <div className="zone">
        <h2 className="sh" id="tr-overview">Overview</h2>
        <p className="body">
          Traffic in UX Library is composed of two independent layers that render on top of the
          base map style. The <strong>flow layer</strong> colours road segments based on current
          speed relative to the free-flow baseline (or against fixed thresholds). The{' '}
          <strong>incidents layer</strong> places icons at the exact position of reported events.
        </p>
        <p className="body">
          Both layers are updated on a configurable refresh cycle and require an active internet
          connection. When connectivity is unavailable, the last known traffic state is held and
          a staleness indicator is shown by UX Library automatically.
        </p>
        <Callout type="info">
          Traffic layers are enabled by default when UX Library initialises with an online
          configuration. Call <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85em' }}>setTrafficConfiguration()</code> to
          explicitly control layer visibility, flow style, and refresh behaviour.
        </Callout>
      </div>

      <div className="zone">
        <h2 className="sh" id="tr-layers">Flow &amp; incidents layers</h2>
        <p className="body">
          Toggle the flow and incident layers independently and switch between relative and
          absolute flow colouring. The map preview and code update live.
        </p>
        <LayerConfigurator />
      </div>

      <div className="zone">
        <h2 className="sh" id="tr-incidents">Incident types</h2>
        <p className="body">
          Control which incident categories are shown on the map. Filtering happens client-side —
          all incident data is still received, only the rendered set changes.
        </p>
        <IncidentFilter />
      </div>

      <div className="zone">
        <h2 className="sh" id="tr-refresh">Refresh interval</h2>
        <p className="body">
          Traffic data is refreshed on a regular cycle. A shorter interval gives more accurate
          conditions at the cost of increased data usage. Select an interval to see the trade-off
          and the corresponding configuration.
        </p>
        <RefreshDemo />
      </div>

      <div className="zone">
        <h2 className="sh" id="tr-provider">Custom traffic provider</h2>
        <p className="body">
          By default UX Library uses TomTom's traffic API. A custom provider can be substituted
          by implementing the <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85em' }}>TrafficProvider</code> interface
          and registering it before the map initialises.
        </p>
        <Callout type="warn">
          A custom provider must supply both flow tile URLs and incident GeoJSON feeds in the
          formats expected by UX Library. Partial implementations (flow only, or incidents only)
          are supported — unused channels can return empty responses.
        </Callout>
        <CodeBlock tabs={['Kotlin']}>
          <pre>
            <span className="hl-k">class</span>{' '}<span className="hl-t">MyTrafficProvider</span>{' : '}<span className="hl-t">TrafficProvider</span>{' {\n\n'}
            {'    '}<span className="hl-k">override fun</span>{' '}<span className="hl-f">getFlowTileUrl</span>{'(zoom: '}<span className="hl-t">Int</span>{', x: '}<span className="hl-t">Int</span>{', y: '}<span className="hl-t">Int</span>{'): '}<span className="hl-t">String</span>{' =\n'}
            {'        '}<span className="hl-s">{'"https://traffic.example.com/flow/$zoom/$x/$y.png"'}</span>{'\n\n'}
            {'    '}<span className="hl-k">override fun</span>{' '}<span className="hl-f">getIncidentsFeedUrl</span>{'(): '}<span className="hl-t">String</span>{' =\n'}
            {'        '}<span className="hl-s">{'"https://traffic.example.com/incidents.geojson"'}</span>{'\n}\n\n'}
            <span className="hl-c">{'// Register before map init\n'}</span>
            <span className="hl-t">TrafficConfiguration</span>{'.'}<span className="hl-f">setProvider</span>{'('}<span className="hl-t">MyTrafficProvider</span>{'())'}
          </pre>
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="tr-requirements">Requirements</h2>
        <table className="prop-table">
          <thead><tr><th>Requirement</th><th>Priority</th><th>Notes</th></tr></thead>
          <tbody>
            {[
              ['Traffic flow layer (relative colouring)',           'P0', 'Enabled by default; green → amber → red → dark red'],
              ['Traffic incidents layer',                           'P0', 'Enabled by default; all 5 incident types'],
              ['Toggle flow layer on/off',                          'P0', 'Independent of incidents layer'],
              ['Toggle incidents layer on/off',                     'P0', 'Independent of flow layer'],
              ['Absolute flow colouring mode',                      'P1', 'Fixed km/h thresholds instead of % of free-flow'],
              ['Per-type incident filtering',                       'P1', 'Filter any combination of Accident/RoadWork/Closure/Hazard/Weather'],
              ['Configurable refresh interval',                     'P1', '30 s – 300 s; default 60 s'],
              ['Staleness indicator when connectivity lost',        'P1', 'UX Library shows indicator automatically; no integrator action needed'],
              ['Custom traffic provider',                           'P2', 'Implement TrafficProvider interface; flow tiles + incident GeoJSON feed'],
            ].map(([req, pri, notes]) => (
              <tr key={req}>
                <td style={{ fontWeight: 500 }}>{req}</td>
                <td>
                  <span style={{
                    fontSize: '0.68rem', fontWeight: 700, padding: '2px 6px', borderRadius: 3,
                    background: pri === 'P0' ? '#fff5f5' : 'var(--bg)',
                    color: pri === 'P0' ? 'var(--red)' : 'var(--muted)',
                    border: `1px solid ${pri === 'P0' ? '#fecaca' : 'var(--border)'}`,
                  }}>{pri}</span>
                </td>
                <td style={{ color: 'var(--mid)', fontSize: '0.82rem' }}>{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
