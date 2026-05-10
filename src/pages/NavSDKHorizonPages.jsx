import { useState, useEffect, useRef } from 'react';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import PageActions from '../components/ui/PageActions';

/* ─── Shared Android-only banner ─────────────────────────────────────────── */
function AndroidOnlyBanner() {
  return (
    <Callout type="warn">
      <strong>Virtual Horizon is available on Android only.</strong> There is no iOS equivalent
      for the Horizon Engine or any of the Horizon-based features.
    </Callout>
  );
}

/* ─── Shared dark road canvas ────────────────────────────────────────────── */
function RoadCanvas({ height = 240, children }) {
  return (
    <div style={{
      width: '100%', height, background: '#0d1117', borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', position: 'relative',
    }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 240" preserveAspectRatio="none">
        {/* Road surface */}
        <path d="M160 240 L175 140 Q195 80 210 40 L230 40 Q245 80 265 140 L280 240 Z" fill="rgba(255,255,255,0.06)" />
        {/* Center lane dashes */}
        <path d="M200 230 L202 180" stroke="rgba(255,255,255,0.25)" strokeWidth="3" strokeDasharray="12 8" strokeLinecap="round" />
        <path d="M202 170 L204 120" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeDasharray="10 7" strokeLinecap="round" />
        <path d="M204 110 L206 70" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="8 6" strokeLinecap="round" />
      </svg>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   4. HORIZON DATA
   ═══════════════════════════════════════════════════════════════════════════ */
const HORIZON_ATTRS = [
  { id: 'curvature', label: 'Curvature', unit: 'rad/m', value: 0.012, desc: 'Road bend sharpness ahead' },
  { id: 'slope',     label: 'Slope',     unit: '%',     value: 3.4,   desc: 'Grade: + uphill, − downhill' },
  { id: 'speedLimit',label: 'Speed limit',unit: 'km/h',value: 90,    desc: 'Limit at look-ahead distance' },
  { id: 'laneCount', label: 'Lane count',unit: 'lanes', value: 2,    desc: 'Number of lanes on segment' },
  { id: 'roadClass', label: 'Road class', unit: '',     value: 'MOTORWAY', desc: 'FRC road functional class' },
];

export function NavSDKHorizonData() {
  const [activeAttr, setActiveAttr] = useState('curvature');
  const [distance, setDistance] = useState(500);

  const attr = HORIZON_ATTRS.find(a => a.id === activeAttr);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Retrieving Horizon Data</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Use <code>HorizonEngine</code> to observe a forward-looking road graph. Subscribe via
        <code> HorizonObserver</code> to receive <code>HorizonElementProperties</code> including
        curvature, slope, speed limits, lane count, and road class for the path ahead.
      </p>

      <AndroidOnlyBanner />

      {/* ── Demo ── */}
      <div className="zone">
        <h2 className="sh" id="hd-demo">Road attributes visualizer</h2>
        <p className="body">Select an attribute to see how it looks on the horizon road diagram.</p>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          {HORIZON_ATTRS.map(a => (
            <button key={a.id} onClick={() => setActiveAttr(a.id)} style={{
              padding: '5px 12px', borderRadius: 7, cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600,
              background: activeAttr === a.id ? '#fff5f5' : 'var(--bg)',
              border: `1px solid ${activeAttr === a.id ? 'var(--red)' : 'var(--border)'}`,
              color: activeAttr === a.id ? 'var(--red)' : 'var(--mid)',
              transition: 'all 0.12s',
            }}>{a.label}</button>
          ))}
        </div>

        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
          <label style={{ fontSize: '0.8125rem', color: 'var(--mid)', whiteSpace: 'nowrap' }}>Look-ahead: {distance} m</label>
          <input type="range" min={100} max={2000} step={50} value={distance} onChange={e => setDistance(+e.target.value)} style={{ flex: 1 }} />
        </div>

        <RoadCanvas>
          {/* Attribute visualization overlay */}
          {activeAttr === 'curvature' && (
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 240" preserveAspectRatio="none">
              <path d="M200 230 Q195 140 185 80 Q180 50 175 40" stroke="#e2001a" strokeWidth="2.5" strokeDasharray="6 4" fill="none" opacity="0.7" />
              <text x="160" y="55" fill="#e2001a" fontSize="10" fontFamily="monospace">curve→</text>
            </svg>
          )}
          {activeAttr === 'slope' && (
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 240" preserveAspectRatio="none">
              <defs>
                <linearGradient id="slopeGrad" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.35" />
                </linearGradient>
              </defs>
              <path d="M165 240 L178 140 Q198 80 212 40 L228 40 Q242 80 262 140 L275 240 Z" fill="url(#slopeGrad)" />
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
              {[183, 200, 217].slice(0, 2).map((x, i) => (
                <line key={i} x1={x} y1={240} x2={x + 5} y2={60} stroke="#f59e0b" strokeWidth="1" strokeDasharray="8 6" opacity="0.6" />
              ))}
            </svg>
          )}
          {/* Label */}
          <div style={{ position: 'absolute', top: 12, left: 16, background: 'rgba(13,17,23,0.88)', borderRadius: 8, padding: '8px 12px', border: '1px solid rgba(255,255,255,0.12)' }}>
            <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{attr.label}</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#e2001a', fontFamily: 'monospace' }}>
              {attr.value}{attr.unit && <span style={{ fontSize: '0.75rem', fontWeight: 400, marginLeft: 2, color: 'rgba(255,255,255,0.4)' }}>{attr.unit}</span>}
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>@ {distance} m ahead</div>
          </div>
          {/* Car dot */}
          <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', width: 10, height: 10, borderRadius: '50%', background: '#e2001a', boxShadow: '0 0 0 4px rgba(226,0,26,0.25)' }} />
        </RoadCanvas>
      </div>

      {/* ── HorizonEngine setup ── */}
      <div className="zone">
        <h2 className="sh" id="hd-engine">HorizonEngine setup</h2>
        <CodeBlock tabs={['Kotlin']}>
          <pre>{`val horizonOptions = HorizonOptions.Builder()
    .mainPathLookAheadDistanceMeters(2000.0)
    .branchLookAheadDistanceMeters(500.0)
    .updateIntervalMs(500L)
    .build()

val horizonEngine = HorizonEngine.Builder()
    .navigationTomTom(navigation)
    .horizonOptions(horizonOptions)
    .build()`}</pre>
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="hd-observer">HorizonObserver callback</h2>
        <CodeBlock tabs={['Kotlin']}>
          <pre>{`val horizonObserver = object : HorizonObserver {
    override fun onHorizonUpdated(horizon: Horizon) {
        val mainPath = horizon.mainPath
        val branches = horizon.branches

        // Walk elements on the main path
        mainPath.elements.forEach { element ->
            val props = element.properties

            val curvature  = props.curvature          // HorizonElementProperties
            val slope      = props.slope               // Double (%)
            val speedLimit = props.speedLimitKph       // Double?
            val laneCount  = props.laneCount           // Int
            val roadClass  = props.roadClass           // RoadClass enum
            val distance   = element.distanceFromVehicle // metres ahead
        }
    }
}

horizonEngine.addHorizonObserver(horizonObserver)

// Clean up
horizonEngine.removeHorizonObserver(horizonObserver)`}</pre>
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="hd-path">HorizonPath branches</h2>
        <p className="body">
          At junctions the horizon forks. Each branch carries the same element properties
          as the main path but for the alternative road ahead.
        </p>
        <CodeBlock tabs={['Kotlin']}>
          <pre>{`horizon.branches.forEach { branch ->
    val probability = branch.probability   // 0.0–1.0 likelihood
    val elements    = branch.elements

    // Typically read the first element for the next road attribute
    elements.firstOrNull()?.let { el ->
        val speedLimit = el.properties.speedLimitKph
        val roadClass  = el.properties.roadClass
    }
}`}</pre>
        </CodeBlock>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   5. HORIZON SAFETY
   ═══════════════════════════════════════════════════════════════════════════ */
const SIGN_TYPES = [
  { id: 'NO_SIGN',     label: 'No sign',     color: '#64748b', desc: 'Urban implicit limit (no physical sign)' },
  { id: 'SIGN',        label: 'Sign',        color: '#22c55e', desc: 'Standard static speed limit sign' },
  { id: 'VARIABLE',    label: 'Variable',    color: '#f59e0b', desc: 'Electronic variable message sign' },
  { id: 'SCHOOL_ZONE', label: 'School zone', color: '#f97316', desc: 'Active school-zone reduced limit' },
];

export function NavSDKHorizonSafety() {
  const [speedLimit, setSpeedLimit] = useState(90);
  const [signType, setSignType] = useState('SIGN');
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
  const signProgress = 1 - dist / 800; // 0 = far, 1 = arrived

  return (
    <div className="page">
      <div className="page-header">
        <h1>Safety Locations via Horizon</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Subscribe to horizon-based speed limit change events for Intelligent Speed Assistance (ISA).
        Receive warnings <em>before</em> the speed limit changes — not at the sign.
      </p>

      <AndroidOnlyBanner />

      {/* ── Demo ── */}
      <div className="zone">
        <h2 className="sh" id="hs-demo">ISA speed change preview</h2>
        <p className="body">Configure sign type and speed limit, then simulate the vehicle approaching.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 6 }}>Speed limit (km/h)</div>
            <input type="range" min={30} max={130} step={10} value={speedLimit} onChange={e => setSpeedLimit(+e.target.value)} style={{ width: '100%' }} />
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
            {/* Speed sign approaching from distance */}
            <circle cx="300" cy={220 - signProgress * 180} r={14 + signProgress * 4}
              fill="white" stroke={sign.color} strokeWidth={2 + signProgress * 1.5} opacity={0.3 + signProgress * 0.7} />
            <text x="300" y={225 - signProgress * 180} textAnchor="middle"
              fill="#1a1a1a" fontSize={9 + signProgress * 3} fontWeight="bold" fontFamily="sans-serif">
              {speedLimit}
            </text>
            {/* Warning zone */}
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
          {/* Car */}
          <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', width: 10, height: 10, borderRadius: '50%', background: '#e2001a', boxShadow: '0 0 0 4px rgba(226,0,26,0.25)' }} />
          {/* Simulate button */}
          <button onClick={simulate} style={{
            position: 'absolute', bottom: 12, right: 12,
            background: '#e2001a', color: '#fff', border: 'none', borderRadius: 7,
            padding: '7px 14px', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
          }}>Simulate</button>
        </RoadCanvas>
      </div>

      {/* ── Speed limit events ── */}
      <div className="zone">
        <h2 className="sh" id="hs-isa">ISA speed limit events</h2>
        <CodeBlock tabs={['Kotlin']}>
          <pre>{`val isaObserver = object : HorizonObserver {
    override fun onHorizonUpdated(horizon: Horizon) {
        val mainPath = horizon.mainPath

        mainPath.elements.forEach { element ->
            val props = element.properties
            val distance = element.distanceFromVehicle

            props.speedLimitChangeEvent?.let { event ->
                val newLimit  = event.newSpeedLimitKph
                val signType  = event.signType  // SpeedLimitSignType enum
                val isWarning = distance > 0    // true = ahead of sign

                when (signType) {
                    SpeedLimitSignType.NO_SIGN     -> handleImplicitLimit(newLimit, distance)
                    SpeedLimitSignType.SIGN        -> handleSignPosted(newLimit, distance)
                    SpeedLimitSignType.VARIABLE    -> handleVariableLimit(newLimit, distance)
                    SpeedLimitSignType.SCHOOL_ZONE -> handleSchoolZone(newLimit, distance)
                }
            }
        }
    }
}

horizonEngine.addHorizonObserver(isaObserver)`}</pre>
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="hs-types">SpeedLimitSignType values</h2>
        <table className="prop-table">
          <thead><tr><th>Value</th><th>Description</th></tr></thead>
          <tbody>
            {SIGN_TYPES.map(s => (
              <tr key={s.id}>
                <td><code>{s.id}</code></td>
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
   6. HORIZON HAZARDS
   ═══════════════════════════════════════════════════════════════════════════ */
const HAZARD_TYPES = [
  { id: 'ACCIDENT',     label: 'Accident',    icon: '⚠', color: '#ef4444' },
  { id: 'ROAD_WORK',    label: 'Road work',   icon: '🚧', color: '#f59e0b' },
  { id: 'OBSTACLE',     label: 'Obstacle',    icon: '⬡', color: '#f97316' },
  { id: 'TRAFFIC_JAM',  label: 'Traffic jam', icon: '🚗', color: '#a78bfa' },
];

export function NavSDKHorizonHazards() {
  const [hazardType, setHazardType] = useState('ACCIDENT');
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
        <h1>Hazards</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Use <code>HorizonHazardObserver</code> to receive distance-ahead notifications for accidents,
        road works, obstacles, and traffic jams — configurable threshold per hazard type.
      </p>

      <AndroidOnlyBanner />

      {/* ── Demo ── */}
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
          <input type="range" min={200} max={2000} step={100} value={threshold} onChange={e => setThreshold(+e.target.value)} style={{ flex: 1 }} />
        </div>

        <RoadCanvas height={230}>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 230" preserveAspectRatio="none">
            {/* Hazard icon on road ahead */}
            <circle cx="200" cy={230 - signProgress * 200} r={16}
              fill={`${hazard.color}22`} stroke={hazard.color} strokeWidth="1.5"
              opacity={Math.max(0.2, signProgress)}
            />
            <text x="200" y={236 - signProgress * 200} textAnchor="middle" fontSize="12">
              {hazard.icon}
            </text>

            {/* Alert zone line */}
            {threshold < 1500 && (
              <line x1="0" y1={230 - (threshold / 1500) * 200} x2="400" y2={230 - (threshold / 1500) * 200}
                stroke={isInRange ? hazard.color : 'rgba(255,255,255,0.15)'}
                strokeWidth="1" strokeDasharray="6 4" />
            )}

            {/* Status */}
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

      {/* ── HorizonHazardObserver ── */}
      <div className="zone">
        <h2 className="sh" id="hh-observer">HorizonHazardObserver</h2>
        <CodeBlock tabs={['Kotlin']}>
          <pre>{`val hazardObserver = object : HorizonHazardObserver {
    override fun onHazardDetected(hazard: HorizonHazard) {
        val type       = hazard.type            // HazardType enum
        val distance   = hazard.distanceMeters  // metres ahead
        val severity   = hazard.severity        // LOW, MEDIUM, HIGH

        when (type) {
            HazardType.ACCIDENT    -> showAccidentAlert(distance)
            HazardType.ROAD_WORK   -> showRoadWorkWarning(distance)
            HazardType.OBSTACLE    -> showObstacleNotification(distance)
            HazardType.TRAFFIC_JAM -> showTrafficAlert(distance)
        }
    }

    override fun onHazardCleared(hazardId: String) {
        dismissAlert(hazardId)
    }
}

horizonEngine.addHazardObserver(hazardObserver)`}</pre>
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="hh-threshold">Distance threshold configuration</h2>
        <CodeBlock tabs={['Kotlin']}>
          <pre>{`val hazardOptions = HorizonHazardOptions.Builder()
    .alertDistanceMeters(HazardType.ACCIDENT,    1500.0)
    .alertDistanceMeters(HazardType.ROAD_WORK,   800.0)
    .alertDistanceMeters(HazardType.OBSTACLE,    500.0)
    .alertDistanceMeters(HazardType.TRAFFIC_JAM, 2000.0)
    .build()

horizonEngine.setHazardOptions(hazardOptions)`}</pre>
        </CodeBlock>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   7. HORIZON TRAFFIC
   ═══════════════════════════════════════════════════════════════════════════ */
const DELAY_LEVELS = [
  { level: 0, label: 'Free flow',   color: '#22c55e', delayS: 0 },
  { level: 1, label: 'Minor delay', color: '#84cc16', delayS: 30 },
  { level: 2, label: 'Moderate',    color: '#f59e0b', delayS: 90 },
  { level: 3, label: 'Severe',      color: '#ef4444', delayS: 240 },
  { level: 4, label: 'Standstill',  color: '#7f1d1d', delayS: 600 },
];

export function NavSDKHorizonTraffic() {
  const [selectedLevel, setSelectedLevel] = useState(2);

  const segment = DELAY_LEVELS.find(d => d.level === selectedLevel);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Horizon Traffic</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Subscribe to traffic flow conditions ahead via the Horizon Engine. Access
        <code> FlowObstacle</code> data with delay seconds and magnitude to anticipate slowdowns
        before entering congestion.
      </p>

      <AndroidOnlyBanner />

      {/* ── Demo ── */}
      <div className="zone">
        <h2 className="sh" id="ht-demo">Traffic density preview</h2>
        <p className="body">Select a delay magnitude to see how the road segment ahead is coloured.</p>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          {DELAY_LEVELS.map(d => (
            <button key={d.level} onClick={() => setSelectedLevel(d.level)} style={{
              padding: '5px 12px', borderRadius: 7, cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600,
              background: selectedLevel === d.level ? `${d.color}20` : 'var(--bg)',
              border: `1px solid ${selectedLevel === d.level ? d.color : 'var(--border)'}`,
              color: selectedLevel === d.level ? d.color : 'var(--mid)',
              transition: 'all 0.12s',
            }}>{d.label}</button>
          ))}
        </div>

        <RoadCanvas height={230}>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 230" preserveAspectRatio="none">
            {/* Traffic-coloured road segment ahead */}
            <defs>
              <linearGradient id="trafficGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor={segment.color} stopOpacity="0" />
                <stop offset="60%" stopColor={segment.color} stopOpacity="0.55" />
                <stop offset="100%" stopColor={segment.color} stopOpacity="0.35" />
              </linearGradient>
            </defs>
            <path d="M165 230 L178 140 Q198 75 212 40 L228 40 Q242 75 262 140 L275 230 Z" fill="url(#trafficGrad)" />

            {/* Delay info */}
            <rect x="10" y="10" width="170" height="44" rx="8" fill="rgba(13,17,23,0.85)" stroke={segment.color} strokeWidth="1" />
            <text x="20" y="28" fill={segment.color} fontSize="11" fontFamily="monospace" fontWeight="700">{segment.label}</text>
            <text x="20" y="46" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">
              Delay: {segment.delayS === 0 ? 'none' : `+${segment.delayS}s`} · magnitude {segment.level}/4
            </text>
          </svg>

          {/* Car */}
          <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', width: 10, height: 10, borderRadius: '50%', background: '#e2001a', boxShadow: '0 0 0 4px rgba(226,0,26,0.25)' }} />
        </RoadCanvas>
      </div>

      {/* ── FlowObstacle ── */}
      <div className="zone">
        <h2 className="sh" id="ht-flow">FlowObstacle API</h2>
        <CodeBlock tabs={['Kotlin']}>
          <pre>{`val trafficObserver = object : HorizonObserver {
    override fun onHorizonUpdated(horizon: Horizon) {
        horizon.mainPath.elements.forEach { element ->
            val flow = element.properties.flowObstacle ?: return@forEach

            val delay     = flow.delaySeconds          // seconds of delay
            val magnitude = flow.magnitudeOfDelay      // 1–4 (1=minor, 4=standstill)
            val distance  = element.distanceFromVehicle

            if (magnitude >= 2 && distance < 3000) {
                // Anticipate slowdown — advise driver or adjust speed
                handleUpcomingCongestion(magnitude, delay, distance)
            }
        }
    }
}

horizonEngine.addHorizonObserver(trafficObserver)`}</pre>
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="ht-magnitude">magnitudeOfDelay reference</h2>
        <table className="prop-table">
          <thead><tr><th>Value</th><th>Label</th><th>Approx. delay</th></tr></thead>
          <tbody>
            {DELAY_LEVELS.filter(d => d.level > 0).map(d => (
              <tr key={d.level}>
                <td style={{ fontWeight: 700 }}>{d.level}</td>
                <td style={{ color: d.color, fontWeight: 600 }}>{d.label}</td>
                <td style={{ color: 'var(--mid)', fontSize: '0.875rem' }}>
                  {d.delayS < 60 ? `~${d.delayS}s` : `~${Math.round(d.delayS / 60)} min`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="ht-proactive">Proactive speed advisory</h2>
        <p className="body">
          By reading traffic magnitude several kilometres ahead, the system can suggest a proactive
          speed reduction that smooths the driver into congestion rather than requiring hard braking.
        </p>
        <CodeBlock tabs={['Kotlin']}>
          <pre>{`// Example: proactive speed advisory based on horizon traffic
fun handleUpcomingCongestion(magnitude: Int, delaySeconds: Int, distanceMeters: Double) {
    val advisorySpeedKph = when (magnitude) {
        1 -> currentSpeedKph - 10
        2 -> currentSpeedKph - 20
        3 -> currentSpeedKph - 30
        4 -> maxOf(0.0, currentSpeedKph - 40)
        else -> currentSpeedKph
    }

    if (distanceMeters < 1500) {
        displaySpeedAdvisory(advisorySpeedKph, distanceMeters)
    }
}`}</pre>
        </CodeBlock>
      </div>
    </div>
  );
}
