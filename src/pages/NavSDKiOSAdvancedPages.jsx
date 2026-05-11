import { useState, useEffect, useRef } from 'react';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import PageActions from '../components/ui/PageActions';

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

/* ─── Shared road canvas for horizon ────────────────────────────────────── */
function RoadCanvas({ height = 240, children }) {
  return (
    <div style={{
      width: '100%', height, background: '#0d1117', borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', position: 'relative',
    }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 240" preserveAspectRatio="none">
        <path d="M160 240 L175 140 Q195 80 210 40 L230 40 Q245 80 265 140 L280 240 Z" fill="rgba(255,255,255,0.06)" />
        <path d="M200 230 L202 180" stroke="rgba(255,255,255,0.25)" strokeWidth="3" strokeDasharray="12 8" strokeLinecap="round" />
        <path d="M202 170 L204 120" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeDasharray="10 7" strokeLinecap="round" />
        <path d="M204 110 L206 70" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="8 6" strokeLinecap="round" />
      </svg>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   1. SIMULATION
   ═══════════════════════════════════════════════════════════════════════════ */

export function NavSDKiOSAdvSimulation({ onNavigate }) {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [progress, setProgress] = useState(0);
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

  const carX = 20 + progress * 360;
  const carY = 130 + Math.sin(progress * Math.PI * 2) * 20 - progress * 10;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Simulation Location</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Replace the real <code>DefaultCLLocationProvider</code> with a
        <code> SimulatedLocationProvider</code> to drive a GPS feed along a planned route —
        ideal for demos, QA, and automated testing.
      </p>

      <div className="zone">
        <h2 className="sh" id="sim-demo">Simulated route playback</h2>
        <p className="body">Control playback speed and watch a simulated vehicle drive the route.</p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          {[1, 2, 4].map(s => (
            <button key={s} onClick={() => setSpeed(s)} style={{
              padding: '5px 14px', borderRadius: 7, cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 700,
              background: speed === s ? '#fff5f5' : 'var(--bg)',
              border: `1px solid ${speed === s ? '#e2001a' : 'var(--border)'}`,
              color: speed === s ? '#e2001a' : 'var(--mid)',
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
            border: `1px solid ${playing ? '#e2001a' : '#e2001a'}`,
            color: playing ? '#e2001a' : '#fff',
          }}>
            {playing ? '⏸ Pause' : '▶ Play'}
          </button>
        </div>

        <MapCanvas>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 260" preserveAspectRatio="none">
            <path
              d={`M20 130 Q100 110 ${20 + progress * 180} ${130 + Math.sin(progress * Math.PI) * 20 - progress * 5}`}
              stroke="#e2001a" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7"
            />
            <circle cx={carX} cy={carY} r="7" fill="#e2001a" />
            <circle cx={carX} cy={carY} r="12" fill="rgba(226,0,26,0.2)" />
            <circle cx="380" cy="120" r="8" fill="none" stroke="#22c55e" strokeWidth="2" />
            <circle cx="380" cy="120" r="3" fill="#22c55e" />
          </svg>
          <div style={{ position: 'absolute', top: 12, right: 16, background: 'rgba(13,17,23,0.88)', borderRadius: 8, padding: '6px 10px', border: '1px solid rgba(255,255,255,0.12)', fontFamily: 'monospace', fontSize: '0.8125rem', color: '#e2001a', fontWeight: 700 }}>
            {speed}x · {Math.round(progress * 100)}%
          </div>
        </MapCanvas>

        <div style={{ marginTop: 10, height: 4, borderRadius: 2, background: 'var(--border)' }}>
          <div style={{ height: '100%', borderRadius: 2, background: '#e2001a', width: `${progress * 100}%`, transition: 'width 0.05s linear' }} />
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="sim-setup">SimulatedLocationProvider setup</h2>
        <CodeBlock tabs={['Swift']}>
          {`import TomTomSDKLocationProvider

let simulatedProvider = SimulatedLocationProvider(route: plannedRoute)
simulatedProvider.simulationSpeed = 40  // metres per second
simulatedProvider.start()

// Pass to NavigationController instead of DefaultCLLocationProvider
let navigationController = try NavigationController(
    routePlan: routePlan,
    locationProvider: simulatedProvider
)
navigationController.start()

// Control playback
simulatedProvider.pause()
simulatedProvider.resume()
simulatedProvider.stop()`}
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="sim-usecases">Use cases</h2>
        <table className="prop-table">
          <thead><tr><th>Scenario</th><th>Recommended speed (m/s)</th></tr></thead>
          <tbody>
            {[
              ['UI demo / sales presentation', '~28 (≈ 100 km/h)'],
              ['QA testing guidance logic',    '~14 (≈ 50 km/h)'],
              ['Automated regression tests',   '~56 (≈ 200 km/h, 4x)'],
              ['Replaying a bug report',       '~14 (real-world speed)'],
            ].map(([s, r]) => (
              <tr key={s}><td style={{ fontWeight: 500 }}>{s}</td><td><code>{r}</code></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. MAP-MATCHED LOCATION
   ═══════════════════════════════════════════════════════════════════════════ */

export function NavSDKiOSAdvLocation({ onNavigate }) {
  const [showRaw, setShowRaw] = useState(true);
  const [showMatched, setShowMatched] = useState(true);
  const [tick, setTick] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setTick(t => t + 1), 400);
    return () => clearInterval(timerRef.current);
  }, []);

  const roadPoints = [0, 1, 2, 3, 4, 5, 6].map((_, i) => ({
    x: 30 + i * 48,
    y: 130 + Math.sin((i / 6) * Math.PI) * 25,
  }));

  const idx = tick % roadPoints.length;
  const matchedPt = roadPoints[idx];
  const rawPt = {
    x: matchedPt.x + Math.sin(tick * 7.3 * matchedPt.x) * 14,
    y: matchedPt.y + Math.sin(tick * 2.3 * matchedPt.y * 0.5) * 14,
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Map-Matched Location</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        NavSDK automatically snaps the vehicle's raw GPS position to the road graph during navigation.
        Enable <code>locationMatchingEnabled</code> (on by default) and the SDK applies a Kalman
        filter plus road-graph matching in real time.
      </p>

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
            <path
              d={`M${roadPoints.map(p => `${p.x},${p.y}`).join(' L')}`}
              stroke="rgba(255,255,255,0.15)" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round"
            />
            {showRaw && roadPoints.map((p, i) => (
              <circle key={i} cx={p.x + Math.sin(tick * 3.1 + i * 2.7) * 14} cy={p.y + Math.cos(tick * 2.3 + i) * 14}
                r="4" fill="#f97316" opacity="0.6" />
            ))}
            {showRaw && <circle cx={rawPt.x} cy={Math.min(200, Math.max(20, rawPt.y + 40))} r="6" fill="#f97316" opacity="0.9" />}
            {showMatched && roadPoints.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#22c55e" opacity="0.5" />
            ))}
            {showMatched && <circle cx={matchedPt.x} cy={matchedPt.y} r="7" fill="#22c55e" />}
            {showMatched && <circle cx={matchedPt.x} cy={matchedPt.y} r="13" fill="rgba(34,197,94,0.2)" />}
          </svg>
        </MapCanvas>
      </div>

      <div className="zone">
        <h2 className="sh" id="mm-code">Map matching setup</h2>
        <p className="body">
          Map matching is enabled by default when you create a <code>NavigationController</code>.
          Supply a raw <code>DefaultCLLocationProvider</code> and the SDK handles snapping
          automatically. Disable it only when you need raw GPS coordinates.
        </p>
        <CodeBlock tabs={['Swift']}>
          {`// Map matching is ON by default — no extra code required
let rawProvider = DefaultCLLocationProvider()
let navigationController = try NavigationController(
    routePlan: routePlan,
    locationProvider: rawProvider
    // locationMatchingEnabled: true   ← default
)

// Access the matched position from progress updates
navigationController.addProgressObserver(self)

extension ViewController: NavigationProgressObserver {
    func navigationController(_ controller: NavigationController,
                               didUpdateProgress progress: RouteProgress) {
        // progress.matchedLocation is road-snapped
        let snapped = progress.matchedLocation
        updateCarMarker(coordinate: snapped.coordinate,
                        bearing: snapped.bearing)
    }
}`}
        </CodeBlock>
      </div>

      <Callout type="info">
        Map matching quality improves when the device has a strong GPS fix and when the SDK
        has access to the full road graph. In offline or low-signal scenarios the SDK falls back
        to a best-effort Kalman-filtered position.
      </Callout>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. TELEMETRY / LOGGING
   ═══════════════════════════════════════════════════════════════════════════ */

const LOG_EVENTS = [
  { level: 'info',    msg: 'Navigation session started',              ts: '14:22:01.043' },
  { level: 'debug',   msg: 'Route recalculated — traffic diversion',  ts: '14:22:03.817' },
  { level: 'verbose', msg: 'GPS fix quality: EXCELLENT (12 sats)',    ts: '14:22:04.002' },
  { level: 'info',    msg: 'Manoeuvre: turnRight in 300m',            ts: '14:22:05.443' },
  { level: 'warning', msg: 'Speed exceeded limit by 8 km/h',          ts: '14:22:06.109' },
  { level: 'debug',   msg: 'Map-matched position updated',            ts: '14:22:06.801' },
  { level: 'info',    msg: 'Approaching waypoint 1 of 2',             ts: '14:22:09.220' },
  { level: 'error',   msg: 'Network request timeout — using cached ETA', ts: '14:22:11.004' },
];

const LEVEL_COLORS = {
  verbose: 'rgba(255,255,255,0.3)',
  debug:   '#94a3b8',
  info:    '#60a5fa',
  warning: '#f59e0b',
  error:   '#ef4444',
};

export function NavSDKiOSAdvTelemetry({ onNavigate }) {
  const [logLevel, setLogLevel] = useState('debug');
  const [scrolling, setScrolling] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const timerRef = useRef(null);

  const levels = ['verbose', 'debug', 'info', 'warning', 'error'];
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
        <h1>Diagnostics &amp; Logging</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Configure <code>LogLevel</code> on the navigation engine to filter diagnostic output.
        iOS supports basic log levels; use OS logging infrastructure to forward events to your
        analytics stack.
      </p>

      <Callout type="info">
        iOS exposes <code>LogLevel</code> configuration for diagnostic logging.
        Full telemetry event streaming with custom analytics callbacks is an Android-only feature.
      </Callout>

      <div className="zone">
        <h2 className="sh" id="tel-demo">Live log stream</h2>
        <p className="body">Set a log level filter and watch the simulated SDK event stream.</p>

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
              <span style={{ color: LEVEL_COLORS[e.level], fontWeight: 700, width: 58, flexShrink: 0 }}>{e.level}</span>
              <span style={{ color: 'rgba(255,255,255,0.65)' }}>{e.msg}</span>
            </div>
          ))}
          {visibleCount === 0 && (
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>Waiting for events…</span>
          )}
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="tel-options">LogLevel configuration</h2>
        <CodeBlock tabs={['Swift']}>
          {`import TomTomSDKNavigation

// Set before creating NavigationController
TomTomLogging.setLogLevel(.debug)   // .verbose | .debug | .info | .warning | .error | .none

// Forward to os_log / unified logging
import os.log

let logger = Logger(subsystem: "com.myapp.navigation", category: "NavSDK")

// Capture SDK logs via a custom log handler
TomTomLogging.setLogHandler { level, message, file, line in
    switch level {
    case .error:   logger.error("\\(message)")
    case .warning: logger.warning("\\(message)")
    case .info:    logger.info("\\(message)")
    default:       logger.debug("\\(message)")
    }
}`}
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="tel-levels">LogLevel reference</h2>
        <table className="prop-table">
          <thead><tr><th>Level</th><th>Use</th></tr></thead>
          <tbody>
            {[
              ['verbose', 'All internal SDK events — very noisy, development only'],
              ['debug',   'Useful debugging info, route recalculation triggers'],
              ['info',    'Key lifecycle events — session start/stop, manoeuvres'],
              ['warning', 'Non-fatal anomalies — degraded GPS, cache misses'],
              ['error',   'Failures requiring attention — network timeouts, invalid routes'],
            ].map(([l, d]) => (
              <tr key={l}>
                <td><code style={{ color: LEVEL_COLORS[l] }}>.{l}</code></td>
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
   4. VEHICLE PROFILE
   ═══════════════════════════════════════════════════════════════════════════ */

const VEHICLE_TYPES = ['car', 'truck', 'bus'];
const FUEL_TYPES = ['combustion', 'electric', 'hybrid'];

export function NavSDKiOSAdvVehicle({ onNavigate }) {
  const [vehicleType, setVehicleType] = useState('car');
  const [fuelType, setFuelType] = useState('combustion');
  const [width, setWidth] = useState(2.1);
  const [height, setHeight] = useState(1.5);
  const [weight, setWeight] = useState(1800);
  const [batteryKwh, setBatteryKwh] = useState(75);

  const isTruck = vehicleType === 'truck' || vehicleType === 'bus';
  const isEV    = fuelType === 'electric' || fuelType === 'hybrid';

  const vehicleColors = { car: '#60a5fa', truck: '#f59e0b', bus: '#a78bfa' };
  const fuelColors    = { combustion: '#94a3b8', electric: '#22c55e', hybrid: '#34d399' };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Vehicle Profile</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Configure <code>VehicleOptions</code> with vehicle type, physical dimensions, weight,
        and fuel type to enable vehicle-specific routing — truck restrictions, bridge clearances,
        and EV consumption modelling.
      </p>

      <div className="zone">
        <h2 className="sh" id="veh-demo">Vehicle configurator</h2>

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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[
            { label: 'Width (m)',  val: width,  set: setWidth,  min: 1.5, max: 3.5, step: 0.1 },
            { label: 'Height (m)', val: height, set: setHeight, min: 1.2, max: 4.5, step: 0.1 },
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

        {/* Constraints preview */}
        <div style={{ background: '#0a0d12', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', padding: '14px 16px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
            Active routing constraints
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {isTruck && <VehicleChip label="Truck restrictions" color="#f59e0b" />}
            {isTruck && weight > 3500 && <VehicleChip label={`Weight >3.5t`} color="#f97316" />}
            {height > 2.5 && <VehicleChip label={`Height >${height.toFixed(1)}m`} color="#f59e0b" />}
            {width > 2.5 && <VehicleChip label={`Width >${width.toFixed(1)}m`} color="#f59e0b" />}
            {isEV && <VehicleChip label="EV consumption model" color="#22c55e" />}
            {isEV && <VehicleChip label={`Battery ${batteryKwh} kWh`} color="#34d399" />}
            {!isTruck && !isEV && height <= 2.5 && width <= 2.5 && (
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8125rem' }}>Standard car routing — no special constraints</span>
            )}
          </div>
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="veh-code">VehicleOptions setup</h2>
        <CodeBlock tabs={['Swift']}>
          {`import TomTomSDKRouting

var vehicleOptions = VehicleOptions()
vehicleOptions.vehicleType    = .${vehicleType}
vehicleOptions.widthMeters    = ${width.toFixed(1)}
vehicleOptions.heightMeters   = ${height.toFixed(1)}
vehicleOptions.weightKg       = ${weight}
vehicleOptions.fuelType       = .${fuelType}
${isEV ? `vehicleOptions.batteryCapacityKWh = ${batteryKwh}` : '// No EV options for combustion vehicles'}

// Apply to route planning
let options = RoutePlanningOptions(
    routeType: .fastest,
    travelMode: .${vehicleType === 'car' ? 'car' : vehicleType === 'truck' ? 'truck' : 'bus'},
    vehicleOptions: vehicleOptions
)
routeCalculator.calculateRoutes(itinerary: itinerary, options: options) { result in
    // handle result
}`}
        </CodeBlock>
      </div>
    </div>
  );
}

function VehicleChip({ label, color }) {
  return (
    <span style={{
      fontSize: '0.6875rem', fontWeight: 700, padding: '3px 8px', borderRadius: 5,
      background: `${color}14`, border: `1px solid ${color}44`, color,
    }}>
      {label}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   5. HORIZON DATA
   ═══════════════════════════════════════════════════════════════════════════ */

const HORIZON_ATTRS = [
  { id: 'curvature',  label: 'Curvature',   unit: 'rad/m', value: 0.012,     desc: 'Road bend sharpness ahead' },
  { id: 'slope',      label: 'Slope',       unit: '%',     value: 3.4,       desc: 'Grade: + uphill, − downhill' },
  { id: 'speedLimit', label: 'Speed limit', unit: 'km/h',  value: 90,        desc: 'Limit at look-ahead distance' },
  { id: 'laneCount',  label: 'Lane count',  unit: 'lanes', value: 2,         desc: 'Number of lanes on segment' },
  { id: 'roadClass',  label: 'Road class',  unit: '',      value: 'MOTORWAY', desc: 'Functional road classification' },
];

export function NavSDKiOSHorizonData({ onNavigate }) {
  const [activeAttr, setActiveAttr] = useState('curvature');
  const [distance, setDistance] = useState(500);

  const attr = HORIZON_ATTRS.find(a => a.id === activeAttr);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Horizon Data</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Use <code>HorizonEngine</code> to observe a forward-looking road graph. Conform to
        <code> HorizonEngineObserver</code> to receive road attributes — speed limits, curvature,
        gradient, and lane count — for the path ahead.
      </p>

      <div className="zone">
        <h2 className="sh" id="hd-demo">Road attributes visualizer</h2>
        <p className="body">Select an attribute to see how it appears on the horizon road view.</p>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          {HORIZON_ATTRS.map(a => (
            <button key={a.id} onClick={() => setActiveAttr(a.id)} style={{
              padding: '5px 12px', borderRadius: 7, cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600,
              background: activeAttr === a.id ? '#fff5f5' : 'var(--bg)',
              border: `1px solid ${activeAttr === a.id ? '#e2001a' : 'var(--border)'}`,
              color: activeAttr === a.id ? '#e2001a' : 'var(--mid)',
              transition: 'all 0.12s',
            }}>{a.label}</button>
          ))}
        </div>

        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
          <label style={{ fontSize: '0.8125rem', color: 'var(--mid)', whiteSpace: 'nowrap' }}>Look-ahead: {distance} m</label>
          <input type="range" min={100} max={2000} step={50} value={distance} onChange={e => setDistance(+e.target.value)} aria-label={`Look-ahead distance: ${distance} metres`} style={{ flex: 1 }} />
        </div>

        <RoadCanvas>
          {activeAttr === 'curvature' && (
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 240" preserveAspectRatio="none">
              <path d="M200 230 Q195 140 185 80 Q180 50 175 40" stroke="#e2001a" strokeWidth="2.5" strokeDasharray="6 4" fill="none" opacity="0.7" />
              <text x="160" y="55" fill="#e2001a" fontSize="10" fontFamily="monospace">curve→</text>
            </svg>
          )}
          {activeAttr === 'slope' && (
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 240" preserveAspectRatio="none">
              <defs>
                <linearGradient id="slopeGradIOS" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.35" />
                </linearGradient>
              </defs>
              <path d="M165 240 L178 140 Q198 80 212 40 L228 40 Q242 80 262 140 L275 240 Z" fill="url(#slopeGradIOS)" />
              <text x="250" y="100" fill="#60a5fa" fontSize="10" fontFamily="monospace">+3.4%</text>
            </svg>
          )}
          {activeAttr === 'speedLimit' && (
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 240" preserveAspectRatio="none">
              <circle cx="310" cy={240 - (distance / 2000) * 200} r="20" fill="white" stroke="#e2001a" strokeWidth="3" />
              <text x="310" y={244 - (distance / 2000) * 200} textAnchor="middle" fill="#1a1a1a" fontSize="11" fontWeight="bold" fontFamily="sans-serif">90</text>
            </svg>
          )}
          {activeAttr === 'laneCount' && (
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 240" preserveAspectRatio="none">
              {[183, 200].map((x, i) => (
                <line key={i} x1={x} y1={240} x2={x + 5} y2={60} stroke="#f59e0b" strokeWidth="1" strokeDasharray="8 6" opacity="0.6" />
              ))}
            </svg>
          )}

          <div style={{ position: 'absolute', top: 12, left: 16, background: 'rgba(13,17,23,0.88)', borderRadius: 8, padding: '8px 12px', border: '1px solid rgba(255,255,255,0.12)' }}>
            <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{attr.label}</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#e2001a', fontFamily: 'monospace' }}>
              {attr.value}{attr.unit && <span style={{ fontSize: '0.75rem', fontWeight: 400, marginLeft: 2, color: 'rgba(255,255,255,0.4)' }}>{attr.unit}</span>}
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>@ {distance} m ahead</div>
          </div>
          <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', width: 10, height: 10, borderRadius: '50%', background: '#e2001a', boxShadow: '0 0 0 4px rgba(226,0,26,0.25)' }} />
        </RoadCanvas>
      </div>

      <div className="zone">
        <h2 className="sh" id="hd-engine">HorizonEngine setup</h2>
        <CodeBlock tabs={['Swift']}>
          {`import TomTomSDKHorizonEngine

let horizonEngine = navigationController.horizonEngine
horizonEngine.addObserver(self)

extension ViewController: HorizonEngineObserver {
    func horizonEngine(_ engine: HorizonEngine,
                       didUpdateHorizon horizon: HorizonResult) {
        for element in horizon.elements {
            let distance   = element.distanceToStart     // metres ahead
            let speedLimit = element.speedLimit          // km/h, optional
            let curvature  = element.curvature           // rad/m
            let gradient   = element.gradient            // %
            let laneCount  = element.laneCount           // Int
            let roadClass  = element.roadClass           // RoadClass

            if let limit = speedLimit {
                print("Speed limit at \\(distance)m: \\(limit) km/h")
            }
        }
    }
}`}
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="hd-attrs">HorizonElement attributes</h2>
        <table className="prop-table">
          <thead><tr><th>Property</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            {[
              ['distanceToStart', 'Double',   'Metres from current vehicle position to element start'],
              ['speedLimit',      'Double?',   'Speed limit at this element in km/h (nil if unknown)'],
              ['curvature',       'Double',   'Road curvature in rad/m — higher = sharper bend'],
              ['gradient',        'Double',   'Road grade in % — positive = uphill, negative = downhill'],
              ['laneCount',       'Int',      'Number of lanes on this road segment'],
              ['roadClass',       'RoadClass', 'Functional road class (motorway, primary, secondary, …)'],
            ].map(([p, t, d]) => (
              <tr key={p}><td><code style={{ fontSize: '0.75rem' }}>{p}</code></td><td><code style={{ fontSize: '0.75rem' }}>{t}</code></td><td style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>{d}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   6. HORIZON SAFETY / ISA
   ═══════════════════════════════════════════════════════════════════════════ */

const SIGN_TYPES = [
  { id: 'noSign',     label: 'No sign',     color: '#64748b', desc: 'Urban implicit limit (no physical sign)' },
  { id: 'sign',       label: 'Sign',        color: '#22c55e', desc: 'Standard static speed limit sign' },
  { id: 'variable',   label: 'Variable',    color: '#f59e0b', desc: 'Electronic variable message sign' },
  { id: 'schoolZone', label: 'School zone', color: '#f97316', desc: 'Active school-zone reduced limit' },
];

export function NavSDKiOSHorizonSafety({ onNavigate }) {
  const [speedLimit, setSpeedLimit] = useState(90);
  const [signType, setSignType] = useState('sign');
  const [countdown, setCountdown] = useState(null);
  const timerRef = useRef(null);

  const sign = SIGN_TYPES.find(s => s.id === signType);

  function simulate() {
    setCountdown(800);
    timerRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 0) { clearInterval(timerRef.current); return 0; }
        return c - 50;
      });
    }, 200);
  }

  useEffect(() => () => clearInterval(timerRef.current), []);

  const dist = countdown ?? 800;
  const signProgress = 1 - dist / 800;

  return (
    <div className="page">
      <div className="page-header">
        <h1>ISA Speed Limit Alerts</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Subscribe to horizon-based speed limit change events for Intelligent Speed Assistance (ISA).
        Receive warnings <em>before</em> the speed limit changes, not at the sign.
      </p>

      <div className="zone">
        <h2 className="sh" id="hs-demo">ISA speed change preview</h2>
        <p className="body">Configure sign type and speed limit, then simulate the vehicle approaching.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 6 }}>Speed limit (km/h)</div>
            <input type="range" min={30} max={130} step={10} value={speedLimit} onChange={e => setSpeedLimit(+e.target.value)} aria-label={`Speed limit: ${speedLimit} km/h`} style={{ width: '100%' }} />
            <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.875rem', color: 'var(--black)', marginTop: 4 }}>{speedLimit} km/h</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 6 }}>Sign type</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {SIGN_TYPES.map(s => (
                <button key={s.id} onClick={() => setSignType(s.id)} style={{
                  padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, textAlign: 'left',
                  background: signType === s.id ? `${s.color}18` : 'var(--bg)',
                  border: `1px solid ${signType === s.id ? s.color : 'var(--border)'}`,
                  color: signType === s.id ? s.color : 'var(--mid)',
                }}>{s.label}</button>
              ))}
            </div>
          </div>
        </div>

        <RoadCanvas height={220}>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 220" preserveAspectRatio="none">
            <circle cx="300" cy={220 - signProgress * 180} r={14 + signProgress * 4}
              fill="white" stroke={sign.color} strokeWidth={2 + signProgress * 1.5} opacity={0.3 + signProgress * 0.7} />
            <text x="300" y={225 - signProgress * 180} textAnchor="middle"
              fill="#1a1a1a" fontSize={9 + signProgress * 3} fontWeight="bold" fontFamily="sans-serif">
              {speedLimit}
            </text>
            {dist < 600 && dist > 0 && (
              <rect x="10" y="8" width="160" height="28" rx="6" fill="rgba(226,0,26,0.15)" stroke="#e2001a" strokeWidth="1" />
            )}
            {dist < 600 && dist > 0 && (
              <text x="90" y="26" textAnchor="middle" fill="#e2001a" fontSize="10" fontFamily="monospace" fontWeight="600">
                Speed change in {dist}m
              </text>
            )}
            {dist === 0 && (
              <rect x="10" y="8" width="160" height="28" rx="6" fill="rgba(34,197,94,0.15)" stroke="#22c55e" strokeWidth="1" />
            )}
            {dist === 0 && (
              <text x="90" y="26" textAnchor="middle" fill="#22c55e" fontSize="10" fontFamily="monospace" fontWeight="600">
                New limit: {speedLimit} km/h
              </text>
            )}
          </svg>
          <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', width: 10, height: 10, borderRadius: '50%', background: '#e2001a', boxShadow: '0 0 0 4px rgba(226,0,26,0.25)' }} />
          <button onClick={simulate} style={{
            position: 'absolute', bottom: 12, right: 12,
            background: '#e2001a', color: '#fff', border: 'none', borderRadius: 7,
            padding: '7px 14px', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
          }}>Simulate</button>
        </RoadCanvas>
      </div>

      <div className="zone">
        <h2 className="sh" id="hs-code">ISA speed limit events</h2>
        <CodeBlock tabs={['Swift']}>
          {`import TomTomSDKHorizonEngine

horizonEngine.addObserver(self)

extension ViewController: HorizonEngineObserver {
    func horizonEngine(_ engine: HorizonEngine,
                       didUpdateHorizon horizon: HorizonResult) {
        for element in horizon.elements where element.speedLimitChange != nil {
            guard let change = element.speedLimitChange else { continue }
            let newLimit   = change.newSpeedLimit       // km/h
            let signType   = change.signType            // SpeedLimitSignType
            let distance   = element.distanceToStart    // metres ahead

            switch signType {
            case .noSign:     handleImplicitLimit(newLimit, distance)
            case .sign:       handleSignPosted(newLimit, distance)
            case .variable:   handleVariableLimit(newLimit, distance)
            case .schoolZone: handleSchoolZone(newLimit, distance)
            }
        }
    }
}`}
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="hs-types">SpeedLimitSignType values</h2>
        <table className="prop-table">
          <thead><tr><th>Value</th><th>Description</th></tr></thead>
          <tbody>
            {SIGN_TYPES.map(s => (
              <tr key={s.id}>
                <td><code>.{s.id}</code></td>
                <td style={{ color: 'var(--mid)', fontSize: '0.875rem' }}>{s.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   7. HORIZON HAZARDS
   ═══════════════════════════════════════════════════════════════════════════ */

const HAZARD_TYPES = [
  { id: 'accident',    label: 'Accident',    icon: '⚠', color: '#ef4444' },
  { id: 'roadWork',    label: 'Road work',   icon: '🚧', color: '#f59e0b' },
  { id: 'obstacle',    label: 'Obstacle',    icon: '⬡', color: '#f97316' },
  { id: 'trafficJam',  label: 'Traffic jam', icon: '🚗', color: '#a78bfa' },
];

export function NavSDKiOSHorizonHazards({ onNavigate }) {
  const [hazardType, setHazardType] = useState('accident');
  const [threshold, setThreshold] = useState(1000);
  const [hazardDist, setHazardDist] = useState(1200);
  const animRef = useRef(null);

  const hazard = HAZARD_TYPES.find(h => h.id === hazardType);
  const isInRange = hazardDist <= threshold;

  function animateApproach() {
    setHazardDist(1500);
    animRef.current = setInterval(() => {
      setHazardDist(d => {
        if (d <= 0) { clearInterval(animRef.current); return 0; }
        return Math.max(0, d - 80);
      });
    }, 150);
  }

  useEffect(() => () => clearInterval(animRef.current), []);

  const signProgress = Math.min(1, (1500 - hazardDist) / 1500);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Horizon Hazards</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Receive distance-ahead notifications for accidents, road works, obstacles, and traffic jams
        via the <code>HorizonEngine</code> hazard element stream — with configurable alert thresholds
        per hazard type.
      </p>

      <div className="zone">
        <h2 className="sh" id="hh-demo">Hazard distance demo</h2>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {HAZARD_TYPES.map(h => (
            <button key={h.id} onClick={() => setHazardType(h.id)} style={{
              padding: '5px 12px', borderRadius: 7, cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600,
              background: hazardType === h.id ? `${h.color}18` : 'var(--bg)',
              border: `1px solid ${hazardType === h.id ? h.color : 'var(--border)'}`,
              color: hazardType === h.id ? h.color : 'var(--mid)',
              transition: 'all 0.12s',
            }}>{h.label}</button>
          ))}
        </div>

        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
          <label style={{ fontSize: '0.8125rem', color: 'var(--mid)', whiteSpace: 'nowrap' }}>Alert threshold: {threshold} m</label>
          <input type="range" min={200} max={2000} step={100} value={threshold} onChange={e => setThreshold(+e.target.value)} aria-label={`Alert threshold: ${threshold} metres`} style={{ flex: 1 }} />
        </div>

        <RoadCanvas height={230}>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 230" preserveAspectRatio="none">
            <circle cx="200" cy={230 - signProgress * 200} r={16}
              fill={`${hazard.color}22`} stroke={hazard.color} strokeWidth="1.5"
              opacity={Math.max(0.2, signProgress)}
            />
            <text x="200" y={236 - signProgress * 200} textAnchor="middle" fontSize="12">
              {hazard.icon}
            </text>
            {threshold < 1500 && (
              <line x1="0" y1={230 - (threshold / 1500) * 200} x2="400" y2={230 - (threshold / 1500) * 200}
                stroke={isInRange ? hazard.color : 'rgba(255,255,255,0.15)'}
                strokeWidth="1" strokeDasharray="6 4" />
            )}
            {isInRange && hazardDist > 0 && (
              <rect x="10" y="8" width="200" height="24" rx="5" fill={`${hazard.color}22`} stroke={hazard.color} strokeWidth="1" />
            )}
            {isInRange && hazardDist > 0 && (
              <text x="110" y="24" textAnchor="middle" fill={hazard.color} fontSize="10" fontFamily="monospace" fontWeight="600">
                {hazard.label} in {hazardDist}m ⚠
              </text>
            )}
          </svg>
          <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', width: 10, height: 10, borderRadius: '50%', background: '#e2001a', boxShadow: '0 0 0 4px rgba(226,0,26,0.25)' }} />
          <button onClick={animateApproach} style={{
            position: 'absolute', bottom: 12, right: 12,
            background: '#e2001a', color: '#fff', border: 'none', borderRadius: 7,
            padding: '7px 14px', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
          }}>Approach</button>
          <div style={{ position: 'absolute', bottom: 12, left: 12, fontSize: '0.6875rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>
            {hazardDist} m ahead
          </div>
        </RoadCanvas>
      </div>

      <div className="zone">
        <h2 className="sh" id="hh-code">Hazard detection via HorizonEngine</h2>
        <CodeBlock tabs={['Swift']}>
          {`import TomTomSDKHorizonEngine

horizonEngine.addObserver(self)

extension ViewController: HorizonEngineObserver {
    func horizonEngine(_ engine: HorizonEngine,
                       didUpdateHorizon horizon: HorizonResult) {
        for element in horizon.elements {
            guard let hazard = element.hazard else { continue }
            let distance = element.distanceToStart

            switch hazard.type {
            case .accident:
                if distance < 1500 { showAccidentAlert(distance) }
            case .roadWork:
                if distance < 800  { showRoadWorkWarning(distance) }
            case .obstacle:
                if distance < 500  { showObstacleNotification(distance) }
            case .trafficJam:
                if distance < 2000 { showTrafficAlert(distance) }
            }
        }
    }
}`}
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="hh-types">Hazard types</h2>
        <table className="prop-table">
          <thead><tr><th>HazardType</th><th>Swift case</th><th>Typical alert distance</th></tr></thead>
          <tbody>
            {[
              ['Accident',    '.accident',   '1 500 m'],
              ['Road work',   '.roadWork',   '800 m'],
              ['Obstacle',    '.obstacle',   '500 m'],
              ['Traffic jam', '.trafficJam', '2 000 m'],
            ].map(([t, c, d]) => (
              <tr key={t}><td style={{ fontWeight: 600 }}>{t}</td><td><code>{c}</code></td><td style={{ color: 'var(--mid)', fontSize: '0.875rem' }}>{d}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
