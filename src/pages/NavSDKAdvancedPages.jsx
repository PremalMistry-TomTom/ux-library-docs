import { useState, useEffect, useRef } from 'react';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import PageActions from '../components/ui/PageActions';
import { ApiLinks } from '../components/ui/ApiLinks';

/* ─── Shared dark map canvas ─────────────────────────────────────────────── */
function MapCanvas({ height = 260, children }) {
  return (
    <div style={{
      width: '100%', height, background: '#0d1117', borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', position: 'relative',
    }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 260" preserveAspectRatio="none">
        {[60, 120, 180, 240, 300, 360].map(x => (
          <line key={x} x1={x} y1={0} x2={x} y2={260} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}
        {[52, 104, 156, 208].map(y => (
          <line key={y} x1={0} y1={y} x2={400} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}
        <path d="M20 130 Q100 110 200 130 T380 120" stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="none" />
        <path d="M20 130 Q100 110 200 130 T380 120" stroke="rgba(255,255,255,0.06)" strokeWidth="12" fill="none" />
      </svg>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   8. SIMULATION
   ═══════════════════════════════════════════════════════════════════════════ */
const ADV_SIMULATION_APIS = [
  { name: 'Location Quickstart',    type: 'Android SDK', description: 'LocationProvider that SimulatedLocationEngine replaces for test-drive and QA workflows.',                      pageId: 'navsdk-location-quickstart', productId: 'navsdk' },
  { name: 'Navigation Quickstart',  type: 'Android SDK', description: 'Navigation session that receives position updates from the simulated engine.',                                 pageId: 'navsdk-nav-quickstart',      productId: 'navsdk' },
  { name: 'Map Camera',             type: 'Android SDK', description: 'Camera that follows the simulated vehicle position during playback.',                                           pageId: 'navsdk-map-camera',          productId: 'navsdk' },
  { name: 'Route Planning',         type: 'Android SDK', description: 'Route object consumed by SimulatedLocationEngine to generate GPS positions along the path.',                   pageId: 'navsdk-route-planning',      productId: 'navsdk' },
];

export function NavSDKAdvSimulation({ onNavigate }) {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [progress, setProgress] = useState(0); // 0–1 along route
  const timerRef = useRef(null);

  function togglePlay() {
    if (playing) {
      clearInterval(timerRef.current);
      setPlaying(false);
    } else {
      setPlaying(true);
      timerRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 1) { clearInterval(timerRef.current); setPlaying(false); return 0; }
          return Math.min(1, p + 0.003 * speed);
        });
      }, 50);
    }
  }

  function reset() {
    clearInterval(timerRef.current);
    setPlaying(false);
    setProgress(0);
  }

  useEffect(() => () => clearInterval(timerRef.current), []);

  // Interpolate car position along the route path
  const t = progress;
  const carX = 20 + t * 360;
  const carY = 130 + Math.sin(t * Math.PI * 2) * 20 - t * 10;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Simulation Location</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Drive a simulated GPS feed along a planned route using <code>SimulatedLocationEngine</code>.
        Configure speed multiplier and update interval for demo, testing, and QA workflows.
      </p>
      <ApiLinks items={ADV_SIMULATION_APIS} onNavigate={onNavigate} />

      {/* ── Demo ── */}
      <div className="zone">
        <h2 className="sh" id="sim-demo">Simulated route playback</h2>
        <p className="body">Control playback speed and watch a simulated car drive the route.</p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          {[1, 2, 4].map(s => (
            <button key={s} onClick={() => setSpeed(s)} style={{
              padding: '5px 14px', borderRadius: 7, cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 700,
              background: speed === s ? '#fff5f5' : 'var(--bg)',
              border: `1px solid ${speed === s ? 'var(--red)' : 'var(--border)'}`,
              color: speed === s ? 'var(--red)' : 'var(--mid)',
            }}>{s}x</button>
          ))}
          <span style={{ flex: 1 }} />
          <button onClick={reset} style={{
            padding: '5px 12px', borderRadius: 7, cursor: 'pointer', fontSize: '0.8125rem',
            background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--muted)',
          }}>Reset</button>
          <button onClick={togglePlay} style={{
            padding: '6px 18px', borderRadius: 7, cursor: 'pointer', fontSize: '0.875rem', fontWeight: 700,
            background: playing ? '#fff5f5' : '#e2001a',
            border: `1px solid ${playing ? 'var(--red)' : '#e2001a'}`,
            color: playing ? 'var(--red)' : '#fff',
          }}>
            {playing ? '⏸ Pause' : '▶ Play'}
          </button>
        </div>

        <MapCanvas>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 260" preserveAspectRatio="none">
            {/* Progress trail */}
            <path
              d={`M20 130 Q100 110 ${20 + progress * 180} ${130 + Math.sin(progress * Math.PI) * 20 - progress * 5}`}
              stroke="#e2001a" strokeWidth="2.5" fill="none" strokeLinecap="round"
              opacity="0.7"
            />
            {/* Car dot */}
            <circle cx={carX} cy={carY} r="7" fill="#e2001a" />
            <circle cx={carX} cy={carY} r="12" fill="rgba(226,0,26,0.2)" />
            {/* Destination marker */}
            <circle cx="380" cy="120" r="8" fill="none" stroke="#22c55e" strokeWidth="2" />
            <circle cx="380" cy="120" r="3" fill="#22c55e" />
          </svg>
          <div style={{ position: 'absolute', top: 12, right: 16, background: 'rgba(13,17,23,0.88)', borderRadius: 8, padding: '6px 10px', border: '1px solid rgba(255,255,255,0.12)', fontFamily: 'monospace', fontSize: '0.8125rem', color: '#e2001a', fontWeight: 700 }}>
            {speed}x · {Math.round(progress * 100)}%
          </div>
        </MapCanvas>

        {/* Progress bar */}
        <div style={{ marginTop: 10, height: 4, borderRadius: 2, background: 'var(--border)' }}>
          <div style={{ height: '100%', borderRadius: 2, background: '#e2001a', width: `${progress * 100}%`, transition: 'width 0.05s linear' }} />
        </div>
      </div>

      {/* ── Setup ── */}
      <div className="zone">
        <h2 className="sh" id="sim-setup">SimulatedLocationEngine setup</h2>
        <CodeBlock tabs={['Kotlin', 'Swift']}>
          <pre>{`// Android
val simulationOptions = SimulationOptions.Builder()
    .simulationSpeed(SimulationSpeed.TIMES_2) // 1x, 2x, 4x
    .updateIntervalMs(500L)
    .build()

val simulatedEngine = SimulatedLocationEngine.Builder()
    .route(plannedRoute)
    .simulationOptions(simulationOptions)
    .build()

// Swap into the navigation session
navigation.setLocationEngine(simulatedEngine)

// Control playback
simulatedEngine.play()
simulatedEngine.pause()
simulatedEngine.stop()
simulatedEngine.setSpeed(SimulationSpeed.TIMES_4)`}</pre>
          <pre>{`// iOS
let options = SimulationOptions()
options.simulationSpeed = .times2
options.updateInterval = 0.5

let engine = SimulatedLocationEngine(
    route: plannedRoute,
    options: options
)

navigation.locationEngine = engine
engine.play()
engine.pause()
engine.stop()`}</pre>
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="sim-usecases">Use cases</h2>
        <table className="prop-table">
          <thead><tr><th>Scenario</th><th>Recommended speed</th></tr></thead>
          <tbody>
            {[
              ['UI demo / sales presentation', '2x'],
              ['QA testing guidance logic',    '1x'],
              ['Automated regression tests',   '4x'],
              ['Replaying a bug report',       '1x'],
            ].map(([s, r]) => (
              <tr key={s}>
                <td style={{ fontWeight: 500 }}>{s}</td>
                <td><code>{r}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   9. MAP-MATCHED LOCATION
   ═══════════════════════════════════════════════════════════════════════════ */
const ADV_MAP_MATCHED_APIS = [
  { name: 'Location Quickstart',    type: 'Android SDK', description: 'Raw LocationProvider that MapMatchedLocationProvider wraps and enhances with road-snapping.',                  pageId: 'navsdk-location-quickstart', productId: 'navsdk' },
  { name: 'Navigation Quickstart',  type: 'Android SDK', description: 'Navigation session that benefits from map-matched position for more accurate guidance.',                        pageId: 'navsdk-nav-quickstart',      productId: 'navsdk' },
  { name: 'Free Driving Mode',      type: 'Android SDK', description: 'Free-driving that relies on map-matched position for accurate road-snapped display without a route.',          pageId: 'navsdk-nav-free-driving',    productId: 'navsdk' },
];

export function NavSDKAdvMapMatched({ onNavigate }) {
  const [showRaw, setShowRaw] = useState(true);
  const [showMatched, setShowMatched] = useState(true);
  const frameRef = useRef(0);
  const [tick, setTick] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      frameRef.current += 1;
      setTick(frameRef.current);
    }, 400);
    return () => clearInterval(timerRef.current);
  }, []);

  // Road centerline points
  const roadPoints = [30, 40, 50, 60, 70, 80, 90].map((pct, i) => ({
    x: 30 + i * 48,
    y: 130 + Math.sin((i / 6) * Math.PI) * 25,
  }));

  const idx = tick % roadPoints.length;
  const matchedPt = roadPoints[idx];

  // Raw GPS with jitter
  const jitter = (n) => n + (Math.sin(tick * 7.3 * n) * 14);
  const rawPt = { x: jitter(matchedPt.x), y: jitter(matchedPt.y * 0.5) };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Map-Matched Location</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Subscribe to <code>MapMatchedLocationObserver</code> for a road-snapped position that
        eliminates GPS drift. The SDK applies a Kalman filter and snaps coordinates to the road graph
        in real time.
      </p>
      <ApiLinks items={ADV_MAP_MATCHED_APIS} onNavigate={onNavigate} />

      {/* ── Demo ── */}
      <div className="zone">
        <h2 className="sh" id="mm-demo">Raw GPS vs map-matched</h2>
        <p className="body">Toggle each dot to compare raw and map-matched positions in motion.</p>

        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          {[
            { id: 'raw',     label: 'Raw GPS',     color: '#f97316', on: showRaw,     set: setShowRaw },
            { id: 'matched', label: 'Map-matched',  color: '#22c55e', on: showMatched, set: setShowMatched },
          ].map(({ id, label, color, on, set }) => (
            <button key={id} onClick={() => set(v => !v)} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 8,
              cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600,
              background: on ? `${color}14` : 'var(--bg)',
              border: `1px solid ${on ? color : 'var(--border)'}`,
              color: on ? color : 'var(--muted)',
            }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: on ? color : 'var(--border)' }} />
              {label}
            </button>
          ))}
        </div>

        <MapCanvas height={220}>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 220" preserveAspectRatio="none">
            {/* Road */}
            <path
              d={`M${roadPoints.map(p => `${p.x},${p.y}`).join(' L')}`}
              stroke="rgba(255,255,255,0.15)" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round"
            />
            {/* Raw GPS dots (scattered) */}
            {showRaw && roadPoints.map((p, i) => (
              <circle key={i} cx={p.x + Math.sin(tick * 3.1 + i * 2.7) * 14} cy={p.y + Math.cos(tick * 2.3 + i) * 14}
                r="4" fill="#f97316" opacity="0.6" />
            ))}
            {/* Raw current */}
            {showRaw && <circle cx={rawPt.x} cy={Math.min(200, Math.max(20, rawPt.y + 40))} r="6" fill="#f97316" opacity="0.9" />}

            {/* Map-matched dots on road */}
            {showMatched && roadPoints.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#22c55e" opacity="0.5" />
            ))}
            {/* Map-matched current */}
            {showMatched && <circle cx={matchedPt.x} cy={matchedPt.y} r="7" fill="#22c55e" />}
            {showMatched && <circle cx={matchedPt.x} cy={matchedPt.y} r="13" fill="rgba(34,197,94,0.2)" />}
          </svg>
        </MapCanvas>
      </div>

      {/* ── Observer ── */}
      <div className="zone">
        <h2 className="sh" id="mm-observer">MapMatchedLocationObserver</h2>
        <CodeBlock tabs={['Kotlin', 'Swift']}>
          <pre>{`// Android
val mapMatchedObserver = object : MapMatchedLocationObserver {
    override fun onMapMatchedLocationUpdated(location: MapMatchedLocation) {
        val lat       = location.position.latitude
        val lon       = location.position.longitude
        val bearing   = location.bearingDegrees
        val speed     = location.speedKph

        // Matched to road
        val roadId    = location.roadSegmentId
        val laneIndex = location.matchedLaneIndex

        updateCarMarker(lat, lon, bearing)
    }
}

navigation.addMapMatchedLocationObserver(mapMatchedObserver)`}</pre>
          <pre>{`// iOS
navigation.addMapMatchedLocationObserver { location in
    let coordinate = location.coordinate
    let bearing    = location.bearing
    let speed      = location.speed

    self.updateCarMarker(coordinate: coordinate, bearing: bearing)
}`}</pre>
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="mm-how">How map matching works</h2>
        <p className="body">
          The SDK applies a Kalman filter to raw GPS observations to reduce noise, then uses
          a Hidden Markov Model (HMM) to find the most likely road segment from the downloaded
          or online road graph. The matched position is snapped to the road centerline geometry.
        </p>
        <Callout type="info">
          Map matching quality improves significantly with offline maps loaded — the SDK can use
          the full road graph rather than relying solely on tile-based geometry approximations.
        </Callout>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   10. TELEMETRY
   ═══════════════════════════════════════════════════════════════════════════ */
const LOG_EVENTS = [
  { level: 'INFO',    msg: 'Navigation session started',              ts: '14:22:01.043' },
  { level: 'DEBUG',   msg: 'Route recalculated — traffic diversion',   ts: '14:22:03.817' },
  { level: 'VERBOSE', msg: 'GPS fix quality: EXCELLENT (12 sats)',      ts: '14:22:04.002' },
  { level: 'INFO',    msg: 'Manoeuvre: TURN_RIGHT in 300m',             ts: '14:22:05.443' },
  { level: 'WARN',    msg: 'Speed exceeded limit by 8 km/h',            ts: '14:22:06.109' },
  { level: 'DEBUG',   msg: 'Map-matched position updated',              ts: '14:22:06.801' },
  { level: 'INFO',    msg: 'Approaching waypoint 1 of 2',               ts: '14:22:09.220' },
  { level: 'ERROR',   msg: 'Network request timeout — using cached ETA', ts: '14:22:11.004' },
];

const LEVEL_COLORS = {
  VERBOSE: 'rgba(255,255,255,0.3)',
  DEBUG:   '#94a3b8',
  INFO:    '#60a5fa',
  WARN:    '#f59e0b',
  ERROR:   '#ef4444',
};

const ADV_TELEMETRY_APIS = [
  { name: 'Navigation Quickstart',  type: 'Android SDK', description: 'TomTomNavigation engine whose events are streamed and logged via TelemetryOptions.',                           pageId: 'navsdk-nav-quickstart',      productId: 'navsdk' },
  { name: 'AI Configuration (UX)',  type: 'Android SDK', description: 'TAIA SDK configuration whose request/response events can be routed to the telemetry stream.',                 pageId: 'ai-config',                  productId: 'ux-library' },
  { name: 'Vehicle Metadata',       type: 'Android SDK', description: 'Vehicle profile data that is included in telemetry event payloads for fleet analytics.',                       pageId: 'navsdk-adv-vehicle',         productId: 'navsdk' },
];

export function NavSDKAdvTelemetry({ onNavigate }) {
  const [logLevel, setLogLevel] = useState('DEBUG');
  const [scrolling, setScrolling] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);
  const timerRef = useRef(null);

  const levels = ['VERBOSE', 'DEBUG', 'INFO', 'WARN', 'ERROR'];
  const levelIndex = levels.indexOf(logLevel);
  const filteredEvents = LOG_EVENTS.filter(e => levels.indexOf(e.level) >= levelIndex);

  function startStream() {
    setScrolling(true);
    setVisibleCount(0);
    let i = 0;
    timerRef.current = setInterval(() => {
      i += 1;
      setVisibleCount(i);
      if (i >= filteredEvents.length) {
        clearInterval(timerRef.current);
        setScrolling(false);
      }
    }, 350);
  }

  useEffect(() => () => clearInterval(timerRef.current), []);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Telemetry Configuration</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Configure <code>TelemetryOptions</code> to control event streaming, log levels, and custom
        analytics callbacks. Android supports full telemetry; iOS provides basic diagnostic logging.
      </p>
      <ApiLinks items={ADV_TELEMETRY_APIS} onNavigate={onNavigate} />
      <Callout type="info">
        Full telemetry event streaming is available on <strong>Android</strong>. On iOS, only
        basic diagnostic logging (<code>LogLevel</code>) is supported — custom analytics event
        callbacks are not available.
      </Callout>

      {/* ── Demo ── */}
      <div className="zone">
        <h2 className="sh" id="tel-demo">Live telemetry stream</h2>
        <p className="body">Set a log level filter and watch the SDK event stream.</p>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10, alignItems: 'center' }}>
          {levels.map(l => (
            <button key={l} onClick={() => { setLogLevel(l); setVisibleCount(0); }} style={{
              padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700,
              background: logLevel === l ? `${LEVEL_COLORS[l]}18` : 'var(--bg)',
              border: `1px solid ${logLevel === l ? LEVEL_COLORS[l] : 'var(--border)'}`,
              color: logLevel === l ? LEVEL_COLORS[l] : 'var(--muted)',
            }}>{l}</button>
          ))}
          <span style={{ flex: 1 }} />
          <button onClick={startStream} disabled={scrolling} style={{
            padding: '5px 14px', borderRadius: 7, cursor: scrolling ? 'not-allowed' : 'pointer',
            background: scrolling ? 'var(--bg)' : '#e2001a',
            border: '1px solid var(--border)', color: scrolling ? 'var(--muted)' : '#fff',
            fontWeight: 700, fontSize: '0.8125rem', opacity: scrolling ? 0.6 : 1,
          }}>Stream events</button>
        </div>

        <div style={{
          background: '#0a0d12', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)',
          padding: '12px', fontFamily: 'monospace', fontSize: '0.75rem', minHeight: 180, maxHeight: 240, overflowY: 'auto',
        }}>
          {filteredEvents.slice(0, visibleCount).map((e, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 4 }}>
              <span style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0 }}>{e.ts}</span>
              <span style={{ color: LEVEL_COLORS[e.level], fontWeight: 700, width: 54, flexShrink: 0 }}>{e.level}</span>
              <span style={{ color: 'rgba(255,255,255,0.65)' }}>{e.msg}</span>
            </div>
          ))}
          {visibleCount === 0 && (
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>Waiting for events…</span>
          )}
        </div>
      </div>

      {/* ── TelemetryOptions ── */}
      <div className="zone">
        <h2 className="sh" id="tel-options">TelemetryOptions</h2>
        <CodeBlock tabs={['Kotlin', 'Swift']}>
          <pre>{`// Android
val telemetryOptions = TelemetryOptions.Builder()
    .enabled(true)
    .logLevel(LogLevel.DEBUG)
    .eventTypes(
        TelemetryEventType.NAVIGATION,
        TelemetryEventType.ROUTING,
        TelemetryEventType.LOCATION
    )
    .build()

TomTomNavigation.Builder()
    .telemetryOptions(telemetryOptions)
    .build(context)`}</pre>
          <pre>{`// iOS — basic logging only
let options = NavigationOptions()
options.logLevel = .debug   // .verbose | .debug | .info | .warn | .error
// Note: custom analytics event callbacks are not available on iOS`}</pre>
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="tel-callback">Custom analytics callback (Android)</h2>
        <CodeBlock tabs={['Kotlin']}>
          <pre>{`val analyticsReporter = object : TelemetryEventListener {
    override fun onTelemetryEvent(event: TelemetryEvent) {
        val type      = event.type         // TelemetryEventType
        val timestamp = event.timestamp    // Instant
        val payload   = event.payload      // Map<String, Any>

        // Forward to your analytics stack
        Analytics.track(
            name  = type.name,
            props = payload
        )
    }
}

telemetryOptions.addEventListener(analyticsReporter)`}</pre>
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="tel-levels">LogLevel reference</h2>
        <table className="prop-table">
          <thead><tr><th>Level</th><th>Use</th></tr></thead>
          <tbody>
            {[
              ['VERBOSE', 'All internal SDK events — very noisy, development only'],
              ['DEBUG',   'Useful debugging info, route recalculation triggers'],
              ['INFO',    'Key lifecycle events — session start/stop, manoeuvres'],
              ['WARN',    'Non-fatal anomalies — degraded GPS, cache misses'],
              ['ERROR',   'Failures requiring attention — network timeouts, invalid routes'],
            ].map(([l, d]) => (
              <tr key={l}>
                <td><code style={{ color: LEVEL_COLORS[l] }}>{l}</code></td>
                <td style={{ color: 'var(--mid)', fontSize: '0.875rem' }}>{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   11. VEHICLE METADATA
   ═══════════════════════════════════════════════════════════════════════════ */
const VEHICLE_TYPES = ['CAR', 'TRUCK', 'BUS'];
const FUEL_TYPES = ['COMBUSTION', 'ELECTRIC', 'HYBRID'];

const ADV_VEHICLE_APIS = [
  { name: 'Route Planning',         type: 'Android SDK', description: 'RoutePlanningOptions that consumes VehicleProviderOptions — truck dimensions, EV parameters applied here.',   pageId: 'navsdk-route-planning',     productId: 'navsdk' },
  { name: 'Navigation Quickstart',  type: 'Android SDK', description: 'Navigation session that uses vehicle metadata for speed profiles and restriction warnings.',                    pageId: 'navsdk-nav-quickstart',     productId: 'navsdk' },
  { name: 'EV Routing (UX)',        type: 'Android SDK', description: 'UX Library EV routing page that relies on batteryCapacityKwh and consumptionModel from this vehicle profile.',pageId: 'ev-routing',                productId: 'ux-library' },
  { name: 'EV Battery & Range (UX)',type: 'Android SDK', description: 'Battery state display that uses vehicleType EV and batteryCapacityKwh configured here.',                       pageId: 'ev-battery',                productId: 'ux-library' },
];

export function NavSDKAdvVehicle({ onNavigate }) {
  const [vehicleType, setVehicleType] = useState('CAR');
  const [fuelType, setFuelType] = useState('COMBUSTION');
  const [width, setWidth] = useState(2.1);
  const [height, setHeight] = useState(1.5);
  const [weight, setWeight] = useState(1800);
  const [batteryKwh, setBatteryKwh] = useState(75);

  const isTruck = vehicleType === 'TRUCK' || vehicleType === 'BUS';
  const isEV    = fuelType === 'ELECTRIC' || fuelType === 'HYBRID';

  const vehicleColors = { CAR: '#60a5fa', TRUCK: '#f59e0b', BUS: '#a78bfa' };
  const fuelColors    = { COMBUSTION: '#94a3b8', ELECTRIC: '#22c55e', HYBRID: '#34d399' };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Vehicle Metadata</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Configure <code>VehicleProviderOptions</code> with vehicle type, physical dimensions, weight,
        and fuel type to enable vehicle-specific routing — truck restrictions, bridge limits, height
        clearances, and EV consumption modelling.
      </p>
      <ApiLinks items={ADV_VEHICLE_APIS} onNavigate={onNavigate} />

      {/* ── Interactive configurator ── */}
      <div className="zone">
        <h2 className="sh" id="veh-demo">Vehicle configurator</h2>

        {/* Type & fuel toggles */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Vehicle type</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {VEHICLE_TYPES.map(v => (
                <button key={v} onClick={() => setVehicleType(v)} style={{
                  flex: 1, padding: '7px 4px', borderRadius: 8, cursor: 'pointer',
                  fontSize: '0.75rem', fontWeight: 700,
                  background: vehicleType === v ? `${vehicleColors[v]}18` : 'var(--bg)',
                  border: `1px solid ${vehicleType === v ? vehicleColors[v] : 'var(--border)'}`,
                  color: vehicleType === v ? vehicleColors[v] : 'var(--mid)',
                  transition: 'all 0.12s',
                }}>{v}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fuel type</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {FUEL_TYPES.map(f => (
                <button key={f} onClick={() => setFuelType(f)} style={{
                  flex: 1, padding: '7px 4px', borderRadius: 8, cursor: 'pointer',
                  fontSize: '0.7rem', fontWeight: 700,
                  background: fuelType === f ? `${fuelColors[f]}18` : 'var(--bg)',
                  border: `1px solid ${fuelType === f ? fuelColors[f] : 'var(--border)'}`,
                  color: fuelType === f ? fuelColors[f] : 'var(--mid)',
                  transition: 'all 0.12s',
                }}>{f}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Dimension sliders */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[
            { label: 'Width (m)',   val: width,  set: setWidth,  min: 1.5, max: 3.5, step: 0.1 },
            { label: 'Height (m)',  val: height, set: setHeight, min: 1.2, max: 4.5, step: 0.1 },
          ].map(({ label, val, set, min, max, step }) => (
            <div key={label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--mid)' }}>{label}</span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--black)' }}>{val.toFixed(1)}</span>
              </div>
              <input type="range" min={min} max={max} step={step} value={val} onChange={e => set(+e.target.value)} aria-label={`${label}: ${val.toFixed(1)}`} style={{ width: '100%' }} />
            </div>
          ))}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--mid)' }}>Weight (kg)</span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--black)' }}>{weight.toLocaleString()}</span>
            </div>
            <input type="range" min={800} max={44000} step={200} value={weight} onChange={e => setWeight(+e.target.value)} aria-label={`Weight: ${weight.toLocaleString()} kg`} style={{ width: '100%' }} />
          </div>
          {isEV && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--mid)' }}>Battery (kWh)</span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#22c55e' }}>{batteryKwh}</span>
              </div>
              <input type="range" min={20} max={200} step={5} value={batteryKwh} onChange={e => setBatteryKwh(+e.target.value)} aria-label={`Battery capacity: ${batteryKwh} kWh`} style={{ width: '100%' }} />
            </div>
          )}
        </div>

        {/* Routing constraints preview */}
        <div style={{ background: '#0a0d12', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', padding: '14px 16px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
            Active routing constraints
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {isTruck && <Chip label="Truck restrictions" color="#f59e0b" />}
            {isTruck && weight > 3500 && <Chip label={`Weight limit >3.5t`} color="#f97316" />}
            {height > 2.5 && <Chip label={`Height clearance >${height.toFixed(1)}m`} color="#f59e0b" />}
            {width > 2.5 && <Chip label={`Width restriction >${width.toFixed(1)}m`} color="#f59e0b" />}
            {isEV && <Chip label="EV consumption model" color="#22c55e" />}
            {isEV && <Chip label={`Battery ${batteryKwh} kWh`} color="#34d399" />}
            {vehicleType === 'BUS' && <Chip label="Bus-only lanes" color="#a78bfa" />}
            {!isTruck && !isEV && height <= 2.5 && width <= 2.5 && (
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8125rem' }}>Standard car routing — no special constraints</span>
            )}
          </div>
        </div>
      </div>

      {/* ── VehicleProviderOptions ── */}
      <div className="zone">
        <h2 className="sh" id="veh-options">VehicleProviderOptions</h2>
        <CodeBlock tabs={['Kotlin', 'Swift']}>
          <pre>{`// Android
val vehicleOptions = VehicleProviderOptions.Builder()
    .vehicleType(VehicleType.${vehicleType})
    .dimensions(
        VehicleDimensions(
            widthMeters  = ${width.toFixed(1)},
            heightMeters = ${height.toFixed(1)},
            lengthMeters = ${vehicleType === 'TRUCK' ? '12.0' : vehicleType === 'BUS' ? '15.0' : '4.5'},
            weightKg     = ${weight}
        )
    )
    .fuelType(FuelType.${fuelType})
${isEV ? `    .evOptions(
        EvVehicleOptions(
            batteryCapacityKWh = ${batteryKwh}.0,
            consumptionModel   = ConsumptionModel.DEFAULT
        )
    )` : '    // No EV options for combustion vehicles'}
    .build()

TomTomNavigation.Builder()
    .vehicleProviderOptions(vehicleOptions)
    .build(context)`}</pre>
          <pre>{`// iOS
var options = VehicleProviderOptions()
options.vehicleType    = .${vehicleType.toLowerCase()}
options.widthMeters    = ${width.toFixed(1)}
options.heightMeters   = ${height.toFixed(1)}
options.weightKg       = ${weight}
options.fuelType       = .${fuelType.toLowerCase()}
${isEV ? `options.batteryCapacityKWh = ${batteryKwh}` : '// No EV options for combustion vehicles'}

navigation.vehicleProviderOptions = options`}</pre>
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="veh-routing">How vehicle metadata affects routing</h2>
        <table className="prop-table">
          <thead><tr><th>Constraint</th><th>Triggered by</th><th>Effect</th></tr></thead>
          <tbody>
            {[
              ['Truck restrictions', 'TRUCK / BUS type', 'Avoids roads with no-truck signs'],
              ['Bridge weight limit', 'weight > limit', 'Routes around restricted bridges'],
              ['Height clearance', 'heightMeters', 'Avoids tunnels and low bridges'],
              ['Width restriction', 'widthMeters', 'Avoids narrow roads and barriers'],
              ['EV range planning', 'ELECTRIC fuelType', 'Adds charging stops if needed'],
              ['Bus-only lanes', 'BUS type', 'Permits bus lanes in routing'],
            ].map(([c, t, e]) => (
              <tr key={c}>
                <td style={{ fontWeight: 600 }}>{c}</td>
                <td><code style={{ fontSize: '0.8125rem' }}>{t}</code></td>
                <td style={{ color: 'var(--mid)', fontSize: '0.875rem' }}>{e}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Inline chip helper ─────────────────────────────────────────────────── */
function Chip({ label, color }) {
  return (
    <span style={{
      fontSize: '0.6875rem', fontWeight: 700, padding: '3px 8px', borderRadius: 5,
      background: `${color}14`, border: `1px solid ${color}44`, color,
    }}>
      {label}
    </span>
  );
}
