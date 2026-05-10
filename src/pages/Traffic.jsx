import { useState, useEffect, useRef } from 'react';
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import { ApiLinks } from '../components/ui/ApiLinks';
import PageActions from '../components/ui/PageActions';
import { useDemoStyle } from '../hooks/useDemoStyle';

const MAP_DISPLAY_APIS = [
  {
    name: 'Map Display for Compose',
    type: 'Android SDK',
    description: 'Integrate a fully interactive TomTom map into a Jetpack Compose layout — traffic layers are enabled on this map composable.',
    pageId: 'navsdk-map-compose', productId: 'navsdk',
  },
  {
    name: 'Map Traffic Layers',
    type: 'Android SDK',
    description: 'Enable and configure traffic flow and incident overlays on the NavSDK map view.',
    pageId: 'navsdk-map-traffic', productId: 'navsdk',
  },
  {
    name: 'Map Style',
    type: 'Android SDK',
    description: 'Apply custom map styles — including traffic flow colours and incident icon appearances — via design tokens.',
    pageId: 'map-style', productId: 'ux-library',
  },
  {
    name: 'TomTom Map Maker',
    type: 'Tool',
    description: 'Customise traffic flow colours and incident icon styles in your map style, then publish and load directly into UX Library.',
    url: 'https://mapmaker.tomtom.com',
  },
];

const API_KEY = 'A4owgES2XdDEHLJBXyy69GFmxRMXfuyf';
const CENTER  = [-0.1276, 51.5074]; // London

const FLOW_STYLES = {
  RELATIVE: '2/flow_relative-light',
  ABSOLUTE: '2/flow_absolute-light',
};

/* ─── Live TomTom map with SDK traffic methods ───────────────── */
function LiveTrafficMap({ flowOn, incOn, flowStyle = 'RELATIVE', zoom = 12.5 }) {
  const containerRef  = useRef(null);
  const mapRef        = useRef(null);
  // Keep latest values accessible in closures without stale captures
  const flowOnRef     = useRef(flowOn);
  const incOnRef      = useRef(incOn);

  useEffect(() => { flowOnRef.current = flowOn; }, [flowOn]);
  useEffect(() => { incOnRef.current  = incOn;  }, [incOn]);

  /* Init — load all traffic layers; stylesVisibility sets initial state */
  useEffect(() => {
    const map = tt.map({
      key: API_KEY,
      container: containerRef.current,
      center: CENTER,
      zoom,
      style: {
        map:              '2/basic_street-light-driving',
        trafficFlow:      FLOW_STYLES[flowStyle],
        trafficIncidents: '2/incidents_light',
      },
      stylesVisibility: {
        trafficFlow:      flowOn,
        trafficIncidents: incOn,
      },
      scrollZoom: false,
      dragRotate: false,
      keyboard:   false,
      boxZoom:    false,
    });
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* Toggle flow layer */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      try { flowOn ? map.showTrafficFlow() : map.hideTrafficFlow(); } catch (_) {}
    };
    map.loaded() ? apply() : map.once('load', apply);
  }, [flowOn]);

  /* Toggle incidents layer */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      try { incOn ? map.showTrafficIncidents() : map.hideTrafficIncidents(); } catch (_) {}
    };
    map.loaded() ? apply() : map.once('load', apply);
  }, [incOn]);

  /* Switch flow style (RELATIVE ↔ ABSOLUTE) — reload style, re-apply visibility */
  const prevFlowStyleRef = useRef(flowStyle);
  useEffect(() => {
    if (flowStyle === prevFlowStyleRef.current) return;
    prevFlowStyleRef.current = flowStyle;
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      map.setStyle({
        map:              '2/basic_street-light-driving',
        trafficFlow:      FLOW_STYLES[flowStyle],
        trafficIncidents: '2/incidents_light',
      });
      map.once('style.load', () => {
        try {
          flowOnRef.current ? map.showTrafficFlow()      : map.hideTrafficFlow();
          incOnRef.current  ? map.showTrafficIncidents() : map.hideTrafficIncidents();
        } catch (_) {}
      });
    };
    map.loaded() ? apply() : map.once('load', apply);
  }, [flowStyle]); // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}

/* ─── Tablet frame (same as MapStyle) ───────────────────────── */
function TabletFrame({ children, overlayChildren }) {
  return (
    <div style={{
      position: 'relative', width: '100%',
      background: '#181818', borderRadius: 18,
      padding: '14px 16px',
      boxShadow: '0 16px 48px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.15)',
      border: '1px solid rgba(255,255,255,0.07)',
    }}>
      {/* Camera */}
      <div style={{ position: 'absolute', top: 7, left: '50%', transform: 'translateX(-50%)', width: 6, height: 6, borderRadius: '50%', background: '#2e2e2e', boxShadow: 'inset 0 0 0 1.5px #111' }} />
      {/* Volume buttons */}
      {[28, 52, 72].map((top, i) => (
        <div key={i} style={{ position: 'absolute', left: -2, top, width: 3, height: i === 0 ? 16 : 22, background: '#242424', borderRadius: '2px 0 0 2px' }} />
      ))}
      {/* Power button */}
      <div style={{ position: 'absolute', right: -2, top: 40, width: 3, height: 28, background: '#242424', borderRadius: '0 2px 2px 0' }} />
      {/* Screen */}
      <div style={{ borderRadius: 20, overflow: 'hidden', height: 380, position: 'relative', background: '#000' }}>
        {children}
        {overlayChildren}
        {/* Home bar */}
        <div style={{ position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)', width: 100, height: 3, background: 'rgba(255,255,255,0.2)', borderRadius: 2, pointerEvents: 'none' }} />
      </div>
    </div>
  );
}

/* ─── Toggle switch ──────────────────────────────────────────── */
function Toggle({ label, on, onToggle }) {
  const M = useDemoStyle();
  return (
    <div onClick={onToggle} style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
      borderRadius: 7, cursor: 'pointer', marginBottom: 6,
      background: on ? M.card : 'var(--bg)', border: '1px solid var(--border)',
      transition: 'all 0.12s',
    }}>
      <div style={{ width: 32, height: 18, borderRadius: 9, background: on ? 'var(--red)' : 'var(--border)', position: 'relative', flexShrink: 0, transition: 'background 0.15s' }}>
        <div style={{ position: 'absolute', top: 2, left: on ? 14 : 2, width: 14, height: 14, borderRadius: '50%', background: 'white', transition: 'left 0.15s' }} />
      </div>
      <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{label}</span>
      <span style={{ marginLeft: 'auto', fontSize: '0.875rem', fontWeight: 600, color: on ? '#16a34a' : 'var(--muted)' }}>{on ? 'on' : 'off'}</span>
    </div>
  );
}

/* ─── Incident types ─────────────────────────────────────────── */
const INCIDENT_TYPES = [
  { id: 'ACCIDENT',  icon: '💥', label: 'Accident',  x: '42%', y: '52%' },
  { id: 'ROAD_WORK', icon: '🚧', label: 'Road work', x: '63%', y: '36%' },
  { id: 'CLOSURE',   icon: '🚫', label: 'Closure',   x: '22%', y: '38%' },
  { id: 'HAZARD',    icon: '⚠️', label: 'Hazard',   x: '70%', y: '65%' },
  { id: 'WEATHER',   icon: '🌧', label: 'Weather',  x: '30%', y: '70%' },
];

/* ─── Traffic layer configurator ─────────────────────────────── */
export function LayerConfigurator() {
  const M = useDemoStyle();
  const [flowOn,    setFlowOn]    = useState(true);
  const [incOn,     setIncOn]     = useState(true);
  const [flowStyle, setFlowStyle] = useState('RELATIVE');

  const code = `mapView.setTrafficConfiguration(
    TrafficConfiguration(
        flowEnabled      = ${flowOn},
        incidentsEnabled = ${incOn},${flowOn ? `\n        flowStyle       = FlowStyle.${flowStyle}` : ''}
    )
)`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TabletFrame>
        <LiveTrafficMap flowOn={flowOn} incOn={incOn} flowStyle={flowStyle} />
      </TabletFrame>

      <div className="grid-2-col">
        {/* Layer toggles */}
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: 8 }}>Layers</div>
          <Toggle label="Traffic flow"      on={flowOn} onToggle={() => setFlowOn(v => !v)} />
          <Toggle label="Traffic incidents" on={incOn}  onToggle={() => setIncOn(v => !v)} />
        </div>

        {/* Flow style */}
        {flowOn && (
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: 8 }}>Flow style</div>
            {[
              { id: 'RELATIVE', label: 'Relative', desc: 'Speed as % of free-flow baseline' },
              { id: 'ABSOLUTE', label: 'Absolute', desc: 'Fixed speed thresholds (km/h)' },
            ].map(opt => (
              <div key={opt.id} onClick={() => setFlowStyle(opt.id)} style={{
                padding: '7px 10px', borderRadius: 7, cursor: 'pointer', marginBottom: 5,
                background: flowStyle === opt.id ? `${M.red}12` : 'var(--bg)',
                border: `1px solid ${flowStyle === opt.id ? 'var(--red)' : 'var(--border)'}`,
                transition: 'all 0.1s',
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: flowStyle === opt.id ? 600 : 400, color: flowStyle === opt.id ? 'var(--red)' : 'var(--black)' }}>{opt.label}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginTop: 2 }}>{opt.desc}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CodeBlock language="kotlin" code={code} />
    </div>
  );
}

/* ─── Incident type filter ───────────────────────────────────── */
export function IncidentFilter() {
  const M = useDemoStyle();
  const [enabled, setEnabled] = useState(INCIDENT_TYPES.map(t => t.id));
  const toggle = id => setEnabled(e => e.includes(id) ? e.filter(x => x !== id) : [...e, id]);

  const code = `mapView.setIncidentFilter(
    IncidentFilter(
        types = setOf(
${INCIDENT_TYPES.filter(t => enabled.includes(t.id)).map(t => `            IncidentType.${t.id}`).join(',\n')}
        )
    )
)`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TabletFrame
        overlayChildren={
          <>
            {INCIDENT_TYPES.filter(t => enabled.includes(t.id)).map(t => (
              <div key={t.id} style={{
                position: 'absolute', left: t.x, top: t.y,
                transform: 'translate(-50%, -50%)',
                fontSize: '1rem', zIndex: 6,
                filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.7))',
                pointerEvents: 'none',
              }}>{t.icon}</div>
            ))}
          </>
        }
      >
        <LiveTrafficMap flowOn={false} incOn={true} zoom={12.5} />
      </TabletFrame>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
        {INCIDENT_TYPES.map(t => {
          const on = enabled.includes(t.id);
          return (
            <div key={t.id} onClick={() => toggle(t.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
              borderRadius: 7, cursor: 'pointer',
              background: on ? M.card : 'var(--bg)', border: '1px solid var(--border)',
              opacity: on ? 1 : 0.45, transition: 'all 0.12s',
            }}>
              <span style={{ fontSize: '1rem' }}>{t.icon}</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, flex: 1 }}>{t.label}</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: on ? '#16a34a' : 'var(--muted)' }}>{on ? 'shown' : 'hidden'}</span>
            </div>
          );
        })}
      </div>

      <CodeBlock language="kotlin" code={code} />
    </div>
  );
}

/* ─── Refresh interval demo ──────────────────────────────────── */
export function RefreshDemo() {
  const M = useDemoStyle();
  const PRESETS = [
    { id: 30,  label: '30 s',  note: 'Near real-time. Higher data usage.' },
    { id: 60,  label: '1 min', note: 'Balanced. Recommended default.' },
    { id: 120, label: '2 min', note: 'Reduced data. Suitable for limited connectivity.' },
    { id: 300, label: '5 min', note: 'Minimal refresh. Best-effort traffic only.' },
  ];
  const [interval, setInterval] = useState(60);
  const sel = PRESETS.find(p => p.id === interval);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {PRESETS.map(p => (
          <button key={p.id} onClick={() => setInterval(p.id)} style={{
            padding: '8px 4px', borderRadius: 7, cursor: 'pointer', textAlign: 'center',
            background: interval === p.id ? `${M.red}12` : 'var(--bg)',
            border: `1px solid ${interval === p.id ? 'var(--red)' : 'var(--border)'}`,
            color: interval === p.id ? 'var(--red)' : 'var(--mid)',
            transition: 'all 0.1s',
          }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>{p.label}</div>
          </button>
        ))}
      </div>
      <div style={{ padding: '10px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 7, fontSize: '0.75rem', color: 'var(--mid)' }}>
        {sel?.note}
      </div>
      <CodeBlock language="kotlin" code={`mapView.setTrafficConfiguration(\n    TrafficConfiguration(\n        flowEnabled         = true,\n        incidentsEnabled     = true,\n        refreshIntervalSec   = ${interval}\n    )\n)`} />
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────── */
export default function TrafficPage({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Traffic</h1>
        <PageActions />
      </div>

      <div className="quick-answer">
        Toggle and configure live traffic flow tiles and incident icons on the navigation map — each layer is independently controlled.
      </div>

      <ApiLinks items={MAP_DISPLAY_APIS} onNavigate={onNavigate} />

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
          absolute flow colouring. The live map and code update instantly.
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
        <CodeBlock language="kotlin" code={`class MyTrafficProvider : TrafficProvider {\n\n    override fun getFlowTileUrl(zoom: Int, x: Int, y: Int): String =\n        "https://traffic.example.com/flow/\$zoom/\$x/\$y.png"\n\n    override fun getIncidentsFeedUrl(): String =\n        "https://traffic.example.com/incidents.geojson"\n}\n\n// Register before map init\nTrafficConfiguration.setProvider(MyTrafficProvider())`} />
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
