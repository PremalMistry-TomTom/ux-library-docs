import { useState } from 'react';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import PageActions from '../components/ui/PageActions';
import { ApiLinks } from '../components/ui/ApiLinks';

/* ─── Shared map mock background ─────────────────────────────────────────── */
export function MapBg({ style = 'day', showTrafficFlow = false, showTrafficIncidents = false }) {
  const bgColor       = style === 'night' ? '#0d1117'                    : style === 'satellite' ? '#1a2f1a'                    : '#D4E8F8';
  const roadColor     = style === 'night' ? 'rgba(255,255,255,0.15)'     : style === 'satellite' ? 'rgba(255,255,255,0.3)'      : 'rgba(120,155,200,0.55)';
  const mainRoadColor = style === 'night' ? 'rgba(255,255,255,0.25)'     : style === 'satellite' ? 'rgba(255,220,100,0.5)'      : 'rgba(70,110,170,0.85)';
  const labelColor    = style === 'night' ? 'rgba(255,255,255,0.4)'      : style === 'satellite' ? 'rgba(255,255,255,0.6)'      : 'rgba(27,61,110,0.9)';

  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" fill="none">
      {/* background */}
      <rect width="300" height="200" fill={bgColor} />

      {/* grid streets */}
      {[30, 60, 90, 120, 150, 180, 210, 240, 270].map(x => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="200" stroke={roadColor} strokeWidth="0.8" />
      ))}
      {[40, 80, 120, 160].map(y => (
        <line key={`h${y}`} x1="0" y1={y} x2="300" y2={y} stroke={roadColor} strokeWidth="0.8" />
      ))}

      {/* main road */}
      <path d="M0 100 Q75 90 150 100 T300 95" stroke={mainRoadColor} strokeWidth="4" strokeLinecap="round" />

      {/* traffic flow overlay */}
      {showTrafficFlow && (
        <>
          <path d="M0 100 Q40 94 70 97" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
          <path d="M70 97 Q100 100 120 99" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
          <path d="M120 99 Q150 98 180 100" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
          <path d="M180 100 Q220 98 260 96 T300 95" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
        </>
      )}

      {/* traffic incident markers */}
      {showTrafficIncidents && (
        <>
          <polygon points="130,92 136,104 124,104" fill="#ef4444" opacity="0.9" />
          <text x="130" y="102" textAnchor="middle" fill="white" style={{ fontSize: 7, fontWeight: 700 }}>!</text>
          <rect x="178" y="88" width="10" height="8" rx="1" fill="#f59e0b" opacity="0.9" />
          <text x="183" y="95" textAnchor="middle" fill="white" style={{ fontSize: 5, fontWeight: 700 }}>SLOW</text>
        </>
      )}

      {/* label */}
      <text x="150" y="82" textAnchor="middle" fill={labelColor} style={{ fontSize: 7 }}>Main St</text>
    </svg>
  );
}

/* ─── Toggle switch helper ────────────────────────────────────────────────── */
function Toggle({ value, onChange, label, secondary }) {
  return (
    <div onClick={() => onChange(!value)} style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
      borderRadius: 7, cursor: 'pointer',
      background: value ? '#fff' : 'var(--bg)',
      border: '1px solid var(--border)', opacity: value ? 1 : 0.55,
      transition: 'all 0.12s',
    }}>
      <div style={{ width: 32, height: 18, borderRadius: 9, background: value ? 'var(--red)' : 'var(--border)', transition: 'background 0.15s', position: 'relative', flexShrink: 0 }}>
        <div style={{ position: 'absolute', top: 2, left: value ? 14 : 2, width: 14, height: 14, borderRadius: '50%', background: 'white', transition: 'left 0.15s' }} />
      </div>
      <div>
        <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{label}</div>
        {secondary && <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{secondary}</div>}
      </div>
    </div>
  );
}

/* ─── Radio group helper ─────────────────────────────────────────────────── */
function RadioGroup({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {options.map(opt => (
        <button key={opt.id} onClick={() => onChange(opt.id)} style={{
          padding: '6px 14px', borderRadius: 20, cursor: 'pointer', fontSize: '0.8125rem',
          fontWeight: value === opt.id ? 600 : 400,
          background: value === opt.id ? '#fff5f5' : 'var(--bg)',
          border: `1px solid ${value === opt.id ? 'var(--red)' : 'var(--border)'}`,
          color: value === opt.id ? 'var(--red)' : 'var(--mid)',
          transition: 'all 0.1s',
        }}>{opt.label}</button>
      ))}
    </div>
  );
}

/* ─── Section label ──────────────────────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--muted)', marginBottom: 8 }}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   1. MAP DISPLAY — COMPOSE
   ═══════════════════════════════════════════════════════════════════════════ */
const MAP_COMPOSE_APIS = [
  { name: 'Map Display API',         type: 'REST API',    description: 'Vector and raster tile endpoints that back the map tiles rendered by TomTomMapComposable.',               pageId: 'map-display-api-intro', productId: 'map-display-api' },
  { name: 'Map Styles',              type: 'Android SDK', description: 'Apply built-in day/night/satellite or custom JSON styles using MapStyleConfig.',                         pageId: 'navsdk-map-styles',   productId: 'navsdk' },
  { name: 'Camera & Animations',     type: 'Android SDK', description: 'Control map viewpoint — location, zoom, tilt, rotation — and animate camera transitions.',               pageId: 'navsdk-map-camera',   productId: 'navsdk' },
  { name: 'Markers',                 type: 'Android SDK', description: 'Place custom markers at geographic coordinates with tap events and balloon popups.',                       pageId: 'navsdk-map-markers',  productId: 'navsdk' },
  { name: 'Traffic Layers',          type: 'Android SDK', description: 'Enable real-time traffic flow and incident overlays on this composable map.',                             pageId: 'navsdk-map-traffic',  productId: 'navsdk' },
];
export function NavSDKMapCompose({ onNavigate }) {
  const [layer, setLayer] = useState('base');

  const mapStyle = layer === 'satellite' ? 'satellite' : layer === 'night' ? 'night' : 'day';
  const styleUri = layer === 'satellite'
    ? 'tomtom://maps/styles/satellite'
    : layer === 'night'
    ? 'StyleDescriptor.DEFAULT_NIGHT'
    : 'StyleDescriptor.DEFAULT';

  return (
    <div className="page">
      <div className="page-header">
        <h1>Map Display for Compose</h1>
        <PageActions />
      </div>

      <div className="quick-answer">
        Embed a TomTom map into a Jetpack Compose UI using <code>TomTomMapComposable</code>. The composable handles the full map lifecycle, gestures, and camera state within a Compose hierarchy.
      </div>

      <ApiLinks items={MAP_COMPOSE_APIS} onNavigate={onNavigate} />

      <Callout type="warn">
        <strong>Android Jetpack Compose only.</strong> This page covers <code>TomTomMapComposable</code> for Compose-based apps. iOS developers use <code>TomTomMapView</code> with UIKit or wrap it in a <code>UIViewRepresentable</code> for SwiftUI.
      </Callout>

      {/* Demo */}
      <div className="zone">
        <h2 className="sh" id="mc-demo">Interactive demo</h2>
        <p className="body">Toggle between map layer options to see how <code>MapOptions.styleUri</code> changes the map appearance.</p>

        <div style={{ marginBottom: 12 }}>
          <SectionLabel>Map layer</SectionLabel>
          <RadioGroup
            options={[
              { id: 'base', label: 'Base (day)' },
              { id: 'night', label: 'Night' },
              { id: 'satellite', label: 'Satellite-style' },
            ]}
            value={layer}
            onChange={setLayer}
          />
        </div>

        <div style={{ width: '100%', height: 260, borderRadius: 16, overflow: 'hidden', position: 'relative', border: '1px solid var(--border)' }}>
          <MapBg style={mapStyle} />
          {/* Composable label */}
          <div style={{
            position: 'absolute', bottom: 10, left: 10,
            background: 'rgba(0,0,0,0.6)', borderRadius: 6, padding: '4px 10px',
            fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-mono)',
          }}>
            TomTomMapComposable
          </div>
          {/* Current user location dot */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 10, height: 10, borderRadius: '50%', background: '#e2001a', boxShadow: '0 0 0 4px rgba(226,0,26,0.25)' }} />
        </div>

        <div style={{ marginTop: 16 }}>
          <CodeBlock tabs={['Kotlin']}>
            <pre>
              <span className="hl-k">val</span>{' mapOptions = '}<span className="hl-t">MapOptions</span>{'(\n'}
              {'    styleUri = '}<span className="hl-n">{styleUri}</span>{',\n'}
              {'    cameraOptions = '}<span className="hl-t">CameraOptions</span>{'(\n'}
              {'        position = '}<span className="hl-t">GeoPoint</span>{'(lat = 52.376799, lon = 4.908162),\n'}
              {'        zoom = 12.0\n'}
              {'    )\n'}
              {')\n\n'}
              <span className="hl-t">TomTomMapComposable</span>{'(\n'}
              {'    mapOptions = mapOptions,\n'}
              {'    onMapReady = { map: '}<span className="hl-t">TomTomMap</span>{' ->\n'}
              {'        '}<span className="hl-c">{'// map is ready — store reference or add layers\n'}</span>
              {'    }\n'}
              {')'}
            </pre>
          </CodeBlock>
        </div>
      </div>

      {/* Lifecycle */}
      <div className="zone">
        <h2 className="sh" id="mc-lifecycle">Lifecycle handling</h2>
        <p className="body">
          <code>TomTomMapComposable</code> automatically ties into the Compose lifecycle. The map surface is created when the composable enters the composition and released when it leaves. No manual <code>onStart</code>/<code>onStop</code> calls are required.
        </p>
        <CodeBlock tabs={['Kotlin']}>
          <pre>
            <span className="hl-c">{'// In a NavHost destination or any composable:\n'}</span>
            <span className="hl-k">var</span>{' tomTomMap: '}<span className="hl-t">TomTomMap</span>{'? by '}<span className="hl-f">remember</span>{' { '}<span className="hl-f">mutableStateOf</span>{'(null) }\n\n'}
            <span className="hl-t">TomTomMapComposable</span>{'(\n'}
            {'    mapOptions = '}<span className="hl-t">MapOptions</span>{'(),\n'}
            {'    onMapReady = { map -> tomTomMap = map }\n'}
            {')\n\n'}
            <span className="hl-c">{'// React to map in your composable:\n'}</span>
            <span className="hl-t">LaunchedEffect</span>{'(tomTomMap) {\n'}
            {'    tomTomMap?.'}<span className="hl-f">moveCamera</span>{'('}<span className="hl-t">CameraOptions</span>{'(zoom = 14.0))\n}'}
          </pre>
        </CodeBlock>
      </div>

      {/* MapOptions */}
      <div className="zone">
        <h2 className="sh" id="mc-options">MapOptions reference</h2>
        <table className="prop-table">
          <thead><tr><th>Property</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            {[
              ['styleUri', 'String?', 'Style descriptor URI. Use StyleDescriptor constants or a custom URL.'],
              ['cameraOptions', 'CameraOptions?', 'Initial camera position, zoom, tilt, and bearing.'],
              ['mapKey', 'String?', 'Override the global API key for this map instance.'],
              ['renderingThreadingMode', 'ThreadingMode', 'SINGLE_THREAD or MULTI_THREAD (default).'],
            ].map(([prop, type, desc]) => (
              <tr key={prop}>
                <td><code>{prop}</code></td>
                <td style={{ color: 'var(--mid)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>{type}</td>
                <td style={{ color: 'var(--mid)', fontSize: '0.875rem' }}>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* iOS note */}
      <div className="zone">
        <h2 className="sh" id="mc-ios">iOS equivalent</h2>
        <p className="body">On iOS, use <code>TomTomMapView</code> directly in UIKit or wrap it with <code>UIViewRepresentable</code> for SwiftUI:</p>
        <CodeBlock tabs={['Swift']}>
          <pre>
            <span className="hl-c">{'// UIKit\n'}</span>
            <span className="hl-k">let</span>{' mapOptions = '}<span className="hl-t">MapOptions</span>{'()\n'}
            <span className="hl-k">let</span>{' mapView = '}<span className="hl-t">TomTomMapView</span>{'(mapOptions: mapOptions)\n'}
            {'view.'}<span className="hl-f">addSubview</span>{'(mapView)\n\n'}
            <span className="hl-c">{'// SwiftUI wrapper\n'}</span>
            <span className="hl-k">struct</span>{' '}<span className="hl-t">TomTomMapRepresentable</span>{': '}<span className="hl-t">UIViewRepresentable</span>{' {\n'}
            {'    '}<span className="hl-k">func</span>{' '}<span className="hl-f">makeUIView</span>{'(context: '}<span className="hl-t">Context</span>{') -> '}<span className="hl-t">TomTomMapView</span>{' {\n'}
            {'        '}<span className="hl-t">TomTomMapView</span>{'(mapOptions: '}<span className="hl-t">MapOptions</span>{'())\n'}
            {'    }\n'}
            {'    '}<span className="hl-k">func</span>{' '}<span className="hl-f">updateUIView</span>{'(_ uiView: '}<span className="hl-t">TomTomMapView</span>{', context: '}<span className="hl-t">Context</span>{') {}\n}'}
          </pre>
        </CodeBlock>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. MAP DISPLAY — VIEWS
   ═══════════════════════════════════════════════════════════════════════════ */
const MAP_VIEWS_APIS = [
  { name: 'Map Display API',          type: 'REST API',    description: 'Vector and raster tile endpoints that back the map tiles rendered by TomTomMapFragment.',                pageId: 'map-display-api-intro', productId: 'map-display-api' },
  { name: 'Map Display for Compose',  type: 'Android SDK', description: 'Jetpack Compose alternative to TomTomMapFragment — preferred for new Compose-based apps.',              pageId: 'navsdk-map-compose',  productId: 'navsdk' },
  { name: 'Map Styles',               type: 'Android SDK', description: 'Apply built-in day/night/satellite or custom JSON styles using MapStyleConfig.',                         pageId: 'navsdk-map-styles',   productId: 'navsdk' },
  { name: 'Camera & Animations',      type: 'Android SDK', description: 'Control map viewpoint — location, zoom, tilt, rotation — and animate camera transitions.',               pageId: 'navsdk-map-camera',   productId: 'navsdk' },
];
export function NavSDKMapViews({ onNavigate }) {
  const [showFragment, setShowFragment] = useState(true);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Map Display for Views</h1>
        <PageActions />
      </div>

      <div className="quick-answer">
        Integrate the TomTom map into an XML-based Android layout using <code>TomTomMapFragment</code>. Provides the same map capabilities as the Compose variant for View-system apps.
      </div>

      <ApiLinks items={MAP_VIEWS_APIS} onNavigate={onNavigate} />

      <Callout type="warn">
        <strong>Android Views only.</strong> This page covers <code>TomTomMapFragment</code> for XML layout-based apps. For Compose apps, see <strong>Map Display for Compose</strong>. iOS developers use <code>TomTomMapView</code> with UIKit.
      </Callout>

      {/* Demo */}
      <div className="zone">
        <h2 className="sh" id="mv-demo">Fragment container preview</h2>
        <p className="body">The <code>TomTomMapFragment</code> fills any <code>FragmentContainerView</code> in your layout. Toggle below to simulate fragment attach/detach.</p>

        <div style={{ marginBottom: 12 }}>
          <Toggle value={showFragment} onChange={setShowFragment} label="Fragment attached" secondary="MapFragment.getMapAsync() called" />
        </div>

        <div style={{ width: '100%', height: 260, borderRadius: 16, overflow: 'hidden', position: 'relative', border: '2px dashed var(--border)', background: 'var(--bg)' }}>
          {showFragment ? (
            <>
              <MapBg style="day" />
              <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.55)', borderRadius: 5, padding: '3px 8px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-mono)' }}>
                TomTomMapFragment
              </div>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 10, height: 10, borderRadius: '50%', background: '#e2001a', boxShadow: '0 0 0 4px rgba(226,0,26,0.25)' }} />
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--muted)', fontSize: '0.875rem' }}>
              FragmentContainerView — no fragment attached
            </div>
          )}
        </div>
      </div>

      {/* XML Layout */}
      <div className="zone">
        <h2 className="sh" id="mv-xml">XML layout declaration</h2>
        <p className="body">Declare a <code>FragmentContainerView</code> in your activity layout and reference the <code>TomTomMapFragment</code> class:</p>
        <CodeBlock tabs={['XML']}>
          <pre>
            {'<'}<span className="hl-t">androidx.fragment.app.FragmentContainerView</span>{'\n'}
            {'    android:id="@+id/map_fragment_container"\n'}
            {'    android:name="com.tomtom.sdk.maps.display.ui.MapFragment"\n'}
            {'    android:layout_width="match_parent"\n'}
            {'    android:layout_height="match_parent" />'}
          </pre>
        </CodeBlock>
      </div>

      {/* Activity setup */}
      <div className="zone">
        <h2 className="sh" id="mv-activity">Activity setup</h2>
        <CodeBlock tabs={['Kotlin']}>
          <pre>
            <span className="hl-k">class</span>{' '}<span className="hl-t">MainActivity</span>{' : '}<span className="hl-t">AppCompatActivity</span>{'() {\n\n'}
            {'    '}<span className="hl-k">private var</span>{' tomTomMap: '}<span className="hl-t">TomTomMap</span>{'? = null\n\n'}
            {'    '}<span className="hl-k">override fun</span>{' '}<span className="hl-f">onCreate</span>{'(savedInstanceState: '}<span className="hl-t">Bundle</span>{'?) {\n'}
            {'        '}<span className="hl-k">super</span>{'.'}<span className="hl-f">onCreate</span>{'(savedInstanceState)\n'}
            {'        '}<span className="hl-f">setContentView</span>{'(R.layout.activity_main)\n\n'}
            {'        '}<span className="hl-k">val</span>{' mapFragment = supportFragmentManager\n'}
            {'            .'}<span className="hl-f">findFragmentById</span>{'(R.id.map_fragment_container)\n'}
            {'                '}<span className="hl-k">as</span>{' '}<span className="hl-t">MapFragment</span>{'\n\n'}
            {'        mapFragment.'}<span className="hl-f">getMapAsync</span>{' { map ->\n'}
            {'            tomTomMap = map\n'}
            {'        }\n'}
            {'    }\n}'}
          </pre>
        </CodeBlock>
      </div>

      {/* iOS equivalent */}
      <div className="zone">
        <h2 className="sh" id="mv-ios">iOS equivalent</h2>
        <p className="body">On iOS, <code>TomTomMapView</code> is added directly as a subview — there is no fragment system:</p>
        <CodeBlock tabs={['Swift']}>
          <pre>
            <span className="hl-k">class</span>{' '}<span className="hl-t">ViewController</span>{': '}<span className="hl-t">UIViewController</span>{' {\n'}
            {'    '}<span className="hl-k">var</span>{' mapView: '}<span className="hl-t">TomTomMapView</span>{'!\n\n'}
            {'    '}<span className="hl-k">override func</span>{' '}<span className="hl-f">viewDidLoad</span>{'() {\n'}
            {'        '}<span className="hl-k">super</span>{'.'}<span className="hl-f">viewDidLoad</span>{'()\n'}
            {'        mapView = '}<span className="hl-t">TomTomMapView</span>{'(mapOptions: '}<span className="hl-t">MapOptions</span>{'())\n'}
            {'        mapView.translatesAutoresizingMaskIntoConstraints = false\n'}
            {'        view.'}<span className="hl-f">addSubview</span>{'(mapView)\n'}
            {'        '}<span className="hl-t">NSLayoutConstraint</span>{'.'}<span className="hl-f">activate</span>{'([\n'}
            {'            mapView.'}<span className="hl-f">topAnchor</span>{'.'}<span className="hl-f">constraint</span>{'(equalTo: view.topAnchor),\n'}
            {'            mapView.'}<span className="hl-f">leadingAnchor</span>{'.'}<span className="hl-f">constraint</span>{'(equalTo: view.leadingAnchor),\n'}
            {'            mapView.'}<span className="hl-f">trailingAnchor</span>{'.'}<span className="hl-f">constraint</span>{'(equalTo: view.trailingAnchor),\n'}
            {'            mapView.'}<span className="hl-f">bottomAnchor</span>{'.'}<span className="hl-f">constraint</span>{'(equalTo: view.bottomAnchor),\n'}
            {'        ])\n'}
            {'    }\n}'}
          </pre>
        </CodeBlock>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. MAP STYLES
   ═══════════════════════════════════════════════════════════════════════════ */
const MAP_STYLES = [
  { id: 'day',       label: 'Default (Day)',    descriptor: 'StyleDescriptor.DEFAULT',       style: 'day' },
  { id: 'night',     label: 'Default (Night)',  descriptor: 'StyleDescriptor.DEFAULT_NIGHT', style: 'night' },
  { id: 'satellite', label: 'Custom URL',       descriptor: '"tomtom://maps/styles/satellite"', style: 'satellite' },
];

const MAP_STYLES_APIS = [
  { name: 'Map Display API',          type: 'REST API',    description: 'Vector tile endpoint that serves the layer data styled by MapStyleConfig — supports custom style JSON.',  pageId: 'map-display-api-intro', productId: 'map-display-api' },
  { name: 'Map Display for Compose',  type: 'Android SDK', description: 'Composable map where MapStyleConfig is applied — start here to use styles in a Compose app.',          pageId: 'navsdk-map-compose',  productId: 'navsdk' },
  { name: 'Map Style (UX Library)',   type: 'Android SDK', description: 'UX Library map style page — configure built-in style variants and connect a TomTom Map Maker style.',    pageId: 'map-style',           productId: 'ux-library' },
  { name: 'TomTom Map Maker',         type: 'Tool',        description: 'Design and publish custom map styles — colours, typography, layer visibility — then load in the SDK.',   url: 'https://mapmaker.tomtom.com' },
];
export function NavSDKMapStyles({ onNavigate }) {
  const [activeStyle, setActiveStyle] = useState('day');
  const current = MAP_STYLES.find(s => s.id === activeStyle);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Map Styles</h1>
        <PageActions />
      </div>

      <div className="quick-answer">
        Switch between built-in day and night map styles or apply a custom style URL. Controls road colours, label visibility, POI icons, and landmark layers.
      </div>

      <ApiLinks items={MAP_STYLES_APIS} onNavigate={onNavigate} />

      {/* Demo */}
      <div className="zone">
        <h2 className="sh" id="ms-demo">Interactive demo</h2>
        <p className="body">Select a style to see how the map appearance changes at runtime.</p>

        <div style={{ marginBottom: 12 }}>
          <SectionLabel>Style preset</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {MAP_STYLES.map(s => (
              <button key={s.id} onClick={() => setActiveStyle(s.id)} style={{
                padding: '10px 8px', borderRadius: 8, cursor: 'pointer', textAlign: 'center',
                fontWeight: activeStyle === s.id ? 600 : 400,
                background: activeStyle === s.id ? '#fff5f5' : 'var(--bg)',
                border: `1px solid ${activeStyle === s.id ? 'var(--red)' : 'var(--border)'}`,
                color: activeStyle === s.id ? 'var(--red)' : 'var(--mid)',
                fontSize: '0.8125rem', transition: 'all 0.1s',
              }}>{s.label}</button>
            ))}
          </div>
        </div>

        <div style={{ width: '100%', height: 260, borderRadius: 16, overflow: 'hidden', position: 'relative', border: '1px solid var(--border)', transition: 'all 0.3s' }}>
          <MapBg style={current.style} />
          <div style={{
            position: 'absolute', bottom: 10, right: 10,
            background: 'rgba(0,0,0,0.6)', borderRadius: 6, padding: '4px 10px',
            fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-mono)',
          }}>{current.descriptor}</div>
        </div>

        <div style={{ marginTop: 16 }}>
          <CodeBlock tabs={['Kotlin', 'Swift']}>
            {[
              <pre key="kt">
                <span className="hl-c">{'// Apply a style to an existing TomTomMap instance\n'}</span>
                {'tomTomMap.'}<span className="hl-f">setStyleDescriptor</span>{'('}<span className="hl-n">{current.descriptor}</span>{')\n\n'}
                <span className="hl-c">{'// Or set during map initialisation\n'}</span>
                <span className="hl-t">MapOptions</span>{'(styleUri = '}<span className="hl-n">{current.descriptor}</span>{')'}
              </pre>,
              <pre key="sw">
                <span className="hl-c">{'// Apply a style descriptor\n'}</span>
                {'mapView.'}<span className="hl-f">applyStyleDescriptor</span>{'('}<span className="hl-t">StyleDescriptor</span>{'.'}<span className="hl-n">{activeStyle === 'night' ? 'defaultNight' : activeStyle === 'satellite' ? 'custom(url:)' : 'default'}</span>{')\n\n'}
                <span className="hl-c">{'// Or pass during map view init\n'}</span>
                <span className="hl-k">let</span>{' options = '}<span className="hl-t">MapOptions</span>{'(mapStyle: .'}<span className="hl-n">{activeStyle === 'night' ? 'defaultNight' : 'default'}</span>{')\n'}
                <span className="hl-t">TomTomMapView</span>{'(mapOptions: options)'}
              </pre>,
            ]}
          </CodeBlock>
        </div>
      </div>

      {/* Built-in styles */}
      <div className="zone">
        <h2 className="sh" id="ms-builtins">Built-in style descriptors</h2>
        <table className="prop-table">
          <thead><tr><th>Constant</th><th>Platform</th><th>Description</th></tr></thead>
          <tbody>
            {[
              ['StyleDescriptor.DEFAULT', 'Android / iOS', 'Full-colour day style with roads, POIs, and labels.'],
              ['StyleDescriptor.DEFAULT_NIGHT', 'Android / iOS', 'Dark map style optimised for night driving.'],
              ['StyleDescriptor.BASIC', 'Android', 'Minimal style with roads and basic labels only.'],
              ['Custom URL', 'Android / iOS', 'Pass any TomTom style URL for OEM brand styles.'],
            ].map(([c, p, d]) => (
              <tr key={c}>
                <td><code>{c}</code></td>
                <td style={{ fontSize: '0.8125rem', color: 'var(--mid)' }}>{p}</td>
                <td style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Custom style */}
      <div className="zone">
        <h2 className="sh" id="ms-custom">Custom style URL</h2>
        <p className="body">Any hosted TomTom style can be referenced by URL. This enables full OEM branding — custom road colours, typography, and landmark visibility.</p>
        <CodeBlock tabs={['Kotlin', 'Swift']}>
          {[
            <pre key="kt">
              <span className="hl-k">val</span>{' customStyle = '}<span className="hl-s">"https://api.tomtom.com/maps/orbis/styles/v1/tomtom/basic_main/style.json?key=\${API_KEY}"</span>{'\n'}
              {'tomTomMap.'}<span className="hl-f">setStyleDescriptor</span>{'(customStyle)'}
            </pre>,
            <pre key="sw">
              <span className="hl-k">let</span>{' url = URL(string: '}<span className="hl-s">'"https://api.tomtom.com/maps/orbis/styles/v1/tomtom/basic_main/style.json?key=\(apiKey)"'</span>{')!\n'}
              {'mapView.'}<span className="hl-f">applyStyleDescriptor</span>{'('}<span className="hl-t">StyleDescriptor</span>{'.'}<span className="hl-f">custom</span>{'(url: url))'}
            </pre>,
          ]}
        </CodeBlock>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   4. CAMERA & ANIMATIONS
   ═══════════════════════════════════════════════════════════════════════════ */
const CAMERA_PRESETS = [
  { id: 'overview', label: 'Overview', zoom: 8,  tilt: 0,  bearing: 0,   desc: 'Zoom 8, flat' },
  { id: 'street',   label: 'Street',   zoom: 15, tilt: 45, bearing: 30,  desc: 'Zoom 15, 45° tilt' },
  { id: 'driving',  label: 'Driving',  zoom: 17, tilt: 60, bearing: 135, desc: 'Zoom 17, 60° tilt' },
  { id: 'satellite',label: 'Aerial',   zoom: 12, tilt: 25, bearing: 45,  desc: 'Zoom 12, 25° tilt' },
];

const MAP_CAMERA_APIS = [
  { name: 'Map Display for Compose', type: 'Android SDK', description: 'Compose map where camera updates are applied — TomTomMapComposable exposes a CameraOptions API.',      pageId: 'navsdk-map-compose',    productId: 'navsdk' },
  { name: 'Map Display for Views',   type: 'Android SDK', description: 'Views map with the same camera control interface for XML layout-based applications.',                   pageId: 'navsdk-map-views',      productId: 'navsdk' },
  { name: 'Turn-by-Turn Navigation', type: 'Android SDK', description: 'Navigation session auto-controls the camera to follow the vehicle — override here to customise.',       pageId: 'navsdk-nav-turn-by-turn', productId: 'navsdk' },
  { name: 'Simulation Location',     type: 'Android SDK', description: 'Simulate GPS movement to test camera follow modes and routing without physical travel.',                 pageId: 'navsdk-adv-simulation', productId: 'navsdk' },
];
export function NavSDKMapCamera({ onNavigate }) {
  const [preset, setPreset] = useState('overview');
  const [animated, setAnimated] = useState(true);
  const current = CAMERA_PRESETS.find(p => p.id === preset);

  // Visual tilt simulation
  const tiltFactor = current.tilt / 70;
  const perspectiveScale = 1 - tiltFactor * 0.25;
  const verticalShift = tiltFactor * 20;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Camera &amp; Animations</h1>
        <PageActions />
      </div>

      <div className="quick-answer">
        Control the map camera position, zoom, tilt, and bearing programmatically. Use animated transitions for smooth, driving-safe panning or instant moves for immediate repositioning.
      </div>

      <ApiLinks items={MAP_CAMERA_APIS} onNavigate={onNavigate} />

      {/* Demo */}
      <div className="zone">
        <h2 className="sh" id="cam-demo">Interactive demo</h2>
        <p className="body">Select a camera preset and toggle between animated and instant transitions.</p>

        <div style={{ marginBottom: 8 }}>
          <SectionLabel>Camera preset</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
            {CAMERA_PRESETS.map(p => (
              <button key={p.id} onClick={() => setPreset(p.id)} style={{
                padding: '8px 6px', borderRadius: 8, cursor: 'pointer', textAlign: 'center',
                fontWeight: preset === p.id ? 600 : 400, fontSize: '0.8125rem',
                background: preset === p.id ? '#fff5f5' : 'var(--bg)',
                border: `1px solid ${preset === p.id ? 'var(--red)' : 'var(--border)'}`,
                color: preset === p.id ? 'var(--red)' : 'var(--mid)',
                transition: 'all 0.1s',
              }}>
                <div>{p.label}</div>
                <div style={{ fontSize: '0.6875rem', opacity: 0.6, marginTop: 2 }}>{p.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <Toggle value={animated} onChange={setAnimated} label="Animated transition" secondary={animated ? 'animateCamera()' : 'moveCamera()'} />
        </div>

        {/* Map with perspective effect */}
        <div style={{
          width: '100%', height: 260, borderRadius: 16, overflow: 'hidden',
          position: 'relative', border: '1px solid var(--border)',
          perspective: '600px',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            transform: `rotateX(${tiltFactor * 25}deg) scale(${perspectiveScale}) translateY(${verticalShift}px)`,
            transformOrigin: 'bottom center',
            transition: animated ? 'transform 0.6s cubic-bezier(0.4,0,0.2,1)' : 'none',
          }}>
            <MapBg style="day" />
          </div>
          {/* Zoom indicator */}
          <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.55)', borderRadius: 6, padding: '4px 10px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-mono)' }}>
            zoom: {current.zoom} · tilt: {current.tilt}° · bearing: {current.bearing}°
          </div>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 10, height: 10, borderRadius: '50%', background: '#e2001a', boxShadow: '0 0 0 4px rgba(226,0,26,0.25)' }} />
        </div>

        <div style={{ marginTop: 16 }}>
          <CodeBlock tabs={['Kotlin', 'Swift']}>
            {[
              <pre key="kt">
                <span className="hl-k">val</span>{' cameraOptions = '}<span className="hl-t">CameraOptions</span>{'(\n'}
                {'    position = '}<span className="hl-t">GeoPoint</span>{'(lat = 52.376799, lon = 4.908162),\n'}
                {'    zoom = '}<span className="hl-n">{current.zoom}</span>{'.0,\n'}
                {'    tilt = '}<span className="hl-n">{current.tilt}</span>{'.0,\n'}
                {'    bearing = '}<span className="hl-n">{current.bearing}</span>{'.0\n'}
                {')\n\n'}
                {animated
                  ? <><span className="hl-c">{'// Smooth animated transition\n'}</span>{'tomTomMap.'}<span className="hl-f">animateCamera</span>{'(cameraOptions)'}</>
                  : <><span className="hl-c">{'// Instant jump\n'}</span>{'tomTomMap.'}<span className="hl-f">moveCamera</span>{'(cameraOptions)'}</>
                }
              </pre>,
              <pre key="sw">
                <span className="hl-k">let</span>{' cameraUpdate = '}<span className="hl-t">CameraUpdate</span>{'(\n'}
                {'    coordinate: '}<span className="hl-t">CLLocationCoordinate2D</span>{'(latitude: 52.376799, longitude: 4.908162),\n'}
                {'    zoom: '}<span className="hl-n">{current.zoom}</span>{',\n'}
                {'    tilt: '}<span className="hl-n">{current.tilt}</span>{',\n'}
                {'    bearing: '}<span className="hl-n">{current.bearing}</span>{'\n'}
                {')\n\n'}
                {animated
                  ? <><span className="hl-f">mapView</span>{'.'}<span className="hl-f">animateCamera</span>{'(to: cameraUpdate)'}</>
                  : <><span className="hl-f">mapView</span>{'.'}<span className="hl-f">moveCamera</span>{'(to: cameraUpdate)'}</>
                }
              </pre>,
            ]}
          </CodeBlock>
        </div>
      </div>

      {/* CameraOptions reference */}
      <div className="zone">
        <h2 className="sh" id="cam-options">CameraOptions parameters</h2>
        <table className="prop-table">
          <thead><tr><th>Parameter</th><th>Range</th><th>Description</th></tr></thead>
          <tbody>
            {[
              ['position', 'GeoPoint', 'Geographic centre of the camera view.'],
              ['zoom', '1 – 22', 'Zoom level. 1 = world, 15 = streets, 22 = buildings.'],
              ['tilt', '0° – 70°', 'Camera tilt. 0 = top-down, 70 = near-horizon perspective.'],
              ['bearing', '0° – 360°', 'Map rotation. 0 = north-up, 90 = east-up.'],
            ].map(([p, r, d]) => (
              <tr key={p}>
                <td><code>{p}</code></td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--mid)' }}>{r}</td>
                <td style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Listener */}
      <div className="zone">
        <h2 className="sh" id="cam-listener">Camera change listener</h2>
        <CodeBlock tabs={['Kotlin', 'Swift']}>
          {[
            <pre key="kt">
              {'tomTomMap.'}<span className="hl-f">addOnCameraChangeListener</span>{' {\n'}
              {'    '}<span className="hl-k">val</span>{' cam = tomTomMap.'}<span className="hl-f">{'currentCamera'}</span>{'\n'}
              {'    '}<span className="hl-c">{'// cam.zoom, cam.tilt, cam.bearing, cam.position\n'}</span>
              {'}'}
            </pre>,
            <pre key="sw">
              {'mapView.'}<span className="hl-f">cameraDelegate</span>{' = self\n\n'}
              <span className="hl-k">func</span>{' '}<span className="hl-f">onCameraChanged</span>{'(camera: '}<span className="hl-t">CameraPosition</span>{') {\n'}
              {'    '}<span className="hl-c">// camera.zoom, camera.tilt, camera.bearing\n'</span>
              {'}'}
            </pre>,
          ]}
        </CodeBlock>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   5. MARKERS
   ═══════════════════════════════════════════════════════════════════════════ */
const DEMO_MARKERS = [
  { id: 1, x: 80,  y: 80,  label: 'Café',    color: '#e2001a' },
  { id: 2, x: 160, y: 110, label: 'Hotel',   color: '#e2001a' },
  { id: 3, x: 230, y: 70,  label: 'Parking', color: '#3b82f6' },
  { id: 4, x: 120, y: 150, label: 'Museum',  color: '#8b5cf6' },
];

function MarkerPin({ x, y, label, color, selected, onClick }) {
  return (
    <g onClick={onClick} style={{ cursor: 'pointer' }}>
      {selected && <circle cx={x} cy={y - 14} r="10" fill={color} opacity="0.2" />}
      <path
        d={`M${x},${y} C${x - 8},${y - 8} ${x - 8},${y - 20} ${x},${y - 20} C${x + 8},${y - 20} ${x + 8},${y - 8} ${x},${y}`}
        fill={color}
        stroke="white"
        strokeWidth="1"
      />
      <circle cx={x} cy={y - 14} r="3.5" fill="white" />
      {selected && (
        <rect x={x - 24} y={y - 38} width={48} height={16} rx="4" fill="rgba(0,0,0,0.75)" />
      )}
      {selected && (
        <text x={x} y={y - 27} textAnchor="middle" fill="white" style={{ fontSize: 8, fontWeight: 600 }}>{label}</text>
      )}
    </g>
  );
}

const MAP_MARKERS_APIS = [
  { name: 'Search API',              type: 'REST API',    description: 'Fuzzy and POI search results are the primary source of GeoPoint data placed as map markers.',               pageId: 'search-api-intro',    productId: 'search-api' },
  { name: 'Map Display for Compose', type: 'Android SDK', description: 'Composable map that hosts the marker layer — markers are placed via the TomTomMapComposable API.',         pageId: 'navsdk-map-compose',  productId: 'navsdk' },
  { name: 'Find a Location',         type: 'Android SDK', description: 'Search SDK that delivers the GeoPoint coordinates placed as markers.',                                        pageId: 'navsdk-search-find',  productId: 'navsdk' },
];
export function NavSDKMapMarkers({ onNavigate }) {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [clustering, setClustering] = useState(false);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Markers</h1>
        <PageActions />
      </div>

      <div className="quick-answer">
        Add custom icon markers anchored to geographic coordinates. Supports tap interaction, marker clustering, and dynamic updates as route or POI data changes.
      </div>

      <ApiLinks items={MAP_MARKERS_APIS} onNavigate={onNavigate} />

      {/* Demo */}
      <div className="zone">
        <h2 className="sh" id="mk-demo">Interactive demo</h2>
        <p className="body">Tap markers to select them. Toggle clustering to see how nearby markers collapse into a cluster badge.</p>

        <div style={{ marginBottom: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Toggle value={clustering} onChange={setClustering} label="Clustering enabled" />
        </div>

        <div style={{ width: '100%', height: 260, borderRadius: 16, overflow: 'hidden', position: 'relative', border: '1px solid var(--border)' }}>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice">
            {/* map bg roads */}
            <rect width="300" height="200" fill="#1e2d40" />
            {[30, 60, 90, 120, 150, 180, 210, 240, 270].map(x => (
              <line key={`v${x}`} x1={x} y1="0" x2={x} y2="200" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
            ))}
            {[40, 80, 120, 160].map(y => (
              <line key={`h${y}`} x1="0" y1={y} x2="300" y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
            ))}
            <path d="M0 100 Q75 90 150 100 T300 95" stroke="#c8a96e" strokeWidth="4" strokeLinecap="round" />

            {clustering ? (
              /* Cluster badge */
              <>
                <circle cx={155} cy={105} r="18" fill="#e2001a" stroke="white" strokeWidth="2" />
                <text x={155} y={109} textAnchor="middle" fill="white" style={{ fontSize: 11, fontWeight: 700 }}>4</text>
              </>
            ) : (
              DEMO_MARKERS.map(m => (
                <MarkerPin
                  key={m.id} x={m.x} y={m.y} label={m.label} color={m.color}
                  selected={selectedMarker === m.id}
                  onClick={() => setSelectedMarker(prev => prev === m.id ? null : m.id)}
                />
              ))
            )}
          </svg>
          {selectedMarker && !clustering && (
            <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10, background: 'rgba(15,26,40,0.92)', borderRadius: 10, padding: '10px 14px', border: '1px solid rgba(255,255,255,0.12)', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.8)' }}>
              Selected: <strong style={{ color: 'white' }}>{DEMO_MARKERS.find(m => m.id === selectedMarker)?.label}</strong> — use <code style={{ color: '#e2001a' }}>marker.addClickListener {'{}'}</code> to handle taps
            </div>
          )}
        </div>

        <div style={{ marginTop: 16 }}>
          <CodeBlock tabs={['Kotlin', 'Swift']}>
            {[
              <pre key="kt">
                <span className="hl-c">{'// Add a marker\n'}</span>
                <span className="hl-k">val</span>{' markerOptions = '}<span className="hl-t">MarkerOptions</span>{'(\n'}
                {'    coordinate = '}<span className="hl-t">GeoPoint</span>{'(lat = 52.376799, lon = 4.908162),\n'}
                {'    pinImage = '}<span className="hl-t">ImageFactory</span>{'.'}<span className="hl-f">fromResource</span>{'(R.drawable.ic_pin),\n'}
                {'    label = '}<span className="hl-t">MarkerLabel</span>{'(text = '}<span className="hl-s">"Café"</span>{')\n'}
                {')\n'}
                <span className="hl-k">val</span>{' marker = tomTomMap.'}<span className="hl-f">addMarker</span>{'(markerOptions)\n\n'}
                <span className="hl-c">{'// Tap listener\n'}</span>
                {'marker.'}<span className="hl-f">addClickListener</span>{' {\n'}
                {'    '}<span className="hl-c">{'// handle tap\n'}</span>
                {'}\n\n'}
                <span className="hl-c">{'// Enable clustering\n'}</span>
                {'tomTomMap.'}<span className="hl-f">setMarkerClusteringEnabled</span>{'('}<span className="hl-n">{String(clustering)}</span>{')'}
              </pre>,
              <pre key="sw">
                <span className="hl-k">let</span>{' markerOptions = '}<span className="hl-t">MarkerOptions</span>{'(\n'}
                {'    coordinate: '}<span className="hl-t">CLLocationCoordinate2D</span>{'(latitude: 52.376799, longitude: 4.908162),\n'}
                {'    pinImage: '}<span className="hl-t">UIImage</span>{'(named: '}<span className="hl-s">"ic_pin"</span>{')!\n'}
                {')\n'}
                <span className="hl-k">let</span>{' marker = try? mapView.'}<span className="hl-f">addMarker</span>{'(options: markerOptions)\n\n'}
                <span className="hl-c">{'// Tap listener\n'}</span>
                {'marker?.'}<span className="hl-f">addClickListener</span>{' {\n'}
                {'    '}<span className="hl-c">{'// handle tap\n'}</span>
                {'}'}
              </pre>,
            ]}
          </CodeBlock>
        </div>
      </div>

      {/* MarkerOptions */}
      <div className="zone">
        <h2 className="sh" id="mk-options">MarkerOptions reference</h2>
        <table className="prop-table">
          <thead><tr><th>Option</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            {[
              ['coordinate', 'GeoPoint / CLLocationCoordinate2D', 'Geographic anchor position.'],
              ['pinImage', 'ImageDescriptor / UIImage', 'Custom icon bitmap. Falls back to default red pin.'],
              ['label', 'MarkerLabel?', 'Text label shown above the marker when selected.'],
              ['anchor', 'Anchor', 'Image anchor point relative to coordinate (default: BOTTOM_CENTER).'],
              ['tag', 'Any?', 'Arbitrary data attached to the marker for identification.'],
            ].map(([o, t, d]) => (
              <tr key={o}>
                <td><code>{o}</code></td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--mid)' }}>{t}</td>
                <td style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   6. TRAFFIC
   ═══════════════════════════════════════════════════════════════════════════ */
const FLOW_TYPES = [
  { id: 'RELATIVE', label: 'Relative', desc: 'Colour relative to free-flow speed' },
  { id: 'ABSOLUTE', label: 'Absolute', desc: 'Colour based on absolute speed' },
  { id: 'RELATIVE_DELAY', label: 'Relative delay', desc: 'Colour based on minutes of delay' },
];

const MAP_TRAFFIC_APIS = [
  { name: 'Traffic API — Flow',      type: 'REST API',    description: 'Live traffic flow data — speed, jam factor, freeflow — that the SDK fetches to colour the traffic overlay.', pageId: 'traffic-api-intro',       productId: 'traffic-api' },
  { name: 'Map Display API',         type: 'REST API',    description: 'Flow tile endpoint served as a map tile layer overlay alongside the base vector tiles.',                      pageId: 'map-display-api-intro',   productId: 'map-display-api' },
  { name: 'Navigation Traffic',      type: 'Android SDK', description: 'Traffic incidents shown along the active navigation route — extends map traffic with route context.',          pageId: 'navsdk-nav-traffic',      productId: 'navsdk' },
  { name: 'Map Display for Compose', type: 'Android SDK', description: 'Composable map where traffic layers are toggled via MapOptionsState.',                                         pageId: 'navsdk-map-compose',      productId: 'navsdk' },
];
export function NavSDKMapTraffic({ onNavigate }) {
  const [showFlow, setShowFlow] = useState(true);
  const [showIncidents, setShowIncidents] = useState(false);
  const [flowType, setFlowType] = useState('RELATIVE');

  return (
    <div className="page">
      <div className="page-header">
        <h1>Traffic</h1>
        <PageActions />
      </div>

      <div className="quick-answer">
        Overlay real-time traffic flow and incident data on the map. Traffic tiles update automatically and can be toggled independently from the base map style.
      </div>

      <ApiLinks items={MAP_TRAFFIC_APIS} onNavigate={onNavigate} />

      {/* Demo */}
      <div className="zone">
        <h2 className="sh" id="tr-demo">Interactive demo</h2>
        <p className="body">Toggle traffic flow and incidents independently. Switch FlowType to change how traffic speed is visualised.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          <Toggle value={showFlow} onChange={setShowFlow} label="Traffic flow" secondary="Coloured road segments" />
          <Toggle value={showIncidents} onChange={setShowIncidents} label="Incidents" secondary="Accident & delay markers" />
        </div>

        {showFlow && (
          <div style={{ marginBottom: 12 }}>
            <SectionLabel>FlowType</SectionLabel>
            <RadioGroup options={FLOW_TYPES} value={flowType} onChange={setFlowType} />
          </div>
        )}

        <div style={{ width: '100%', height: 260, borderRadius: 16, overflow: 'hidden', position: 'relative', border: '1px solid var(--border)' }}>
          <MapBg style="day" showTrafficFlow={showFlow} showTrafficIncidents={showIncidents} />
          {showFlow && (
            <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 4, flexDirection: 'column', background: 'rgba(0,0,0,0.55)', borderRadius: 8, padding: '8px 10px' }}>
              {[['#22c55e', 'Free'], ['#f59e0b', 'Slow'], ['#ef4444', 'Jammed']].map(([c, l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 12, height: 4, borderRadius: 2, background: c }} />
                  <span style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.7)' }}>{l}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: 16 }}>
          <CodeBlock tabs={['Kotlin', 'Swift']}>
            {[
              <pre key="kt">
                <span className="hl-c">{'// Enable traffic flow overlay\n'}</span>
                {'tomTomMap.'}<span className="hl-f">setTrafficFlowEnabled</span>{'('}<span className="hl-n">{String(showFlow)}</span>{')\n'}
                {'tomTomMap.'}<span className="hl-f">setTrafficFlowType</span>{'('}<span className="hl-t">FlowType</span>{'.'}<span className="hl-n">{flowType}</span>{')\n\n'}
                <span className="hl-c">{'// Enable incidents overlay\n'}</span>
                {'tomTomMap.'}<span className="hl-f">setTrafficIncidentsEnabled</span>{'('}<span className="hl-n">{String(showIncidents)}</span>{')'}
              </pre>,
              <pre key="sw">
                <span className="hl-c">{'// Enable traffic flow\n'}</span>
                {'mapView.'}<span className="hl-f">setTrafficFlow</span>{'(enabled: '}<span className="hl-n">{String(showFlow)}</span>{', flowType: .'}<span className="hl-n">{flowType.toLowerCase()}</span>{')\n\n'}
                <span className="hl-c">{'// Enable incidents\n'}</span>
                {'mapView.'}<span className="hl-f">setTrafficIncidents</span>{'(enabled: '}<span className="hl-n">{String(showIncidents)}</span>{')'}
              </pre>,
            ]}
          </CodeBlock>
        </div>
      </div>

      {/* FlowType reference */}
      <div className="zone">
        <h2 className="sh" id="tr-flowtype">FlowType reference</h2>
        <table className="prop-table">
          <thead><tr><th>Type</th><th>Colours represent</th><th>Best for</th></tr></thead>
          <tbody>
            {[
              ['RELATIVE', 'Speed vs free-flow (green → red)', 'General driver awareness — most intuitive.'],
              ['ABSOLUTE', 'Actual speed in km/h', 'Showing raw speed data without context.'],
              ['RELATIVE_DELAY', 'Minutes of delay vs free-flow', 'ETA-sensitive UIs where time loss matters.'],
            ].map(([t, c, b]) => (
              <tr key={t}>
                <td><code>{t}</code></td>
                <td style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>{c}</td>
                <td style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Real-time updates */}
      <div className="zone">
        <h2 className="sh" id="tr-realtime">Real-time updates</h2>
        <p className="body">
          Traffic tiles are fetched and updated automatically by the SDK at regular intervals. The update frequency is controlled by the SDK's internal traffic refresh policy — no polling is required from application code.
        </p>
        <Callout type="info">
          Traffic data requires an active network connection. In offline mode, traffic overlays are automatically hidden. See the <strong>Offline</strong> section for map caching options.
        </Callout>
      </div>
    </div>
  );
}

export function MapComposeDemo() {
  const [layer, setLayer] = useState('base');
  const mapStyle = layer === 'satellite' ? 'satellite' : layer === 'night' ? 'night' : 'day';
  const RadioGroup2 = ({ options, value, onChange }) => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
      {options.map(o => (
        <button key={o.id} onClick={() => onChange(o.id)} style={{
          padding: '6px 14px', borderRadius: 20, cursor: 'pointer', fontSize: '0.8125rem',
          background: value === o.id ? '#e2001a' : 'var(--bg)',
          color: value === o.id ? '#fff' : 'var(--mid)',
          border: `1px solid ${value === o.id ? '#e2001a' : 'var(--border)'}`,
          fontWeight: value === o.id ? 700 : 400,
        }}>{o.label}</button>
      ))}
    </div>
  );
  return (
    <div>
      <RadioGroup2
        options={[{ id: 'base', label: 'Base (day)' }, { id: 'night', label: 'Night' }, { id: 'satellite', label: 'Satellite' }]}
        value={layer} onChange={setLayer}
      />
      <div style={{ width: '100%', height: 280, borderRadius: 16, overflow: 'hidden', position: 'relative', border: '1px solid var(--border)' }}>
        <MapBg style={mapStyle} />
        <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(0,0,0,0.6)', borderRadius: 6, padding: '4px 10px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', fontFamily: 'monospace' }}>TomTomMapComposable · styleUri: {mapStyle === 'day' ? 'DEFAULT' : mapStyle === 'night' ? 'DEFAULT_NIGHT' : 'satellite'}</div>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 10, height: 10, borderRadius: '50%', background: '#e2001a', boxShadow: '0 0 0 4px rgba(226,0,26,0.25)' }} />
      </div>
    </div>
  );
}

export function MapStylesDemo() {
  const [activeStyle, setActiveStyle] = useState('day');
  const styles = [
    { id: 'day',    label: 'Day',    uri: 'StyleDescriptor.DEFAULT' },
    { id: 'night',  label: 'Night',  uri: 'StyleDescriptor.DEFAULT_NIGHT' },
    { id: 'custom', label: 'Custom', uri: 'StyleDescriptor.fromUri(...)' },
  ];
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        {styles.map(s => (
          <button key={s.id} onClick={() => setActiveStyle(s.id)} style={{
            padding: '6px 14px', borderRadius: 20, cursor: 'pointer', fontSize: '0.8125rem',
            background: activeStyle === s.id ? '#e2001a' : 'var(--bg)',
            color: activeStyle === s.id ? '#fff' : 'var(--mid)',
            border: `1px solid ${activeStyle === s.id ? '#e2001a' : 'var(--border)'}`,
            fontWeight: activeStyle === s.id ? 700 : 400,
          }}>{s.label}</button>
        ))}
      </div>
      <div style={{ width: '100%', height: 260, borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', position: 'relative' }}>
        <MapBg style={activeStyle === 'custom' ? 'night' : activeStyle} />
        {activeStyle === 'custom' && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,80,60,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ background: 'rgba(0,0,0,0.7)', color: '#4ade80', fontSize: '0.75rem', fontFamily: 'monospace', padding: '6px 12px', borderRadius: 6 }}>OEM custom palette applied</span>
          </div>
        )}
        <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(0,0,0,0.6)', borderRadius: 6, padding: '4px 10px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', fontFamily: 'monospace' }}>{styles.find(s => s.id === activeStyle)?.uri}</div>
      </div>
    </div>
  );
}

export function MapTrafficDemo() {
  const [showFlow, setShowFlow] = useState(true);
  const [showIncidents, setShowIncidents] = useState(false);
  const [flowType, setFlowType] = useState('RELATIVE');
  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        {[{ key: 'showFlow', label: 'Traffic flow', val: showFlow, set: setShowFlow }, { key: 'showIncidents', label: 'Incidents', val: showIncidents, set: setShowIncidents }].map(({ key, label, val, set }) => (
          <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: '0.8125rem', color: 'var(--mid)' }}>
            <input type="checkbox" checked={val} onChange={e => set(e.target.checked)} />
            {label}
          </label>
        ))}
        {showFlow && (
          <select value={flowType} onChange={e => setFlowType(e.target.value)} style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}>
            <option value="RELATIVE">RELATIVE</option>
            <option value="ABSOLUTE">ABSOLUTE</option>
          </select>
        )}
      </div>
      <div style={{ width: '100%', height: 260, borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', position: 'relative' }}>
        <MapBg style="night" showTrafficFlow={showFlow} showTrafficIncidents={showIncidents} />
      </div>
    </div>
  );
}
