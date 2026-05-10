import { useState, useEffect, useRef } from 'react';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import PageActions from '../components/ui/PageActions';

/* ─── Shared dark map shell ──────────────────────────────────────────────── */
function MapShell({ height = 280, children }) {
  return (
    <div style={{
      width: '100%', height, background: '#0d1117', borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', position: 'relative',
    }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice" fill="none">
        <rect width="400" height="280" fill="#0d1117"/>
        <path d="M0 160 Q100 130 200 145 T400 130" stroke="#1a2535" strokeWidth="10"/>
        <path d="M0 160 Q100 130 200 145 T400 130" stroke="#243040" strokeWidth="2"/>
        <path d="M155 0 L150 280" stroke="#1a2535" strokeWidth="8"/>
        <path d="M155 0 L150 280" stroke="#243040" strokeWidth="1.5"/>
        <path d="M270 0 L265 280" stroke="#1a2535" strokeWidth="8"/>
        <path d="M270 0 L265 280" stroke="#243040" strokeWidth="1.5"/>
      </svg>
      {children}
    </div>
  );
}

/* ─── Shared route line ──────────────────────────────────────────────────── */
function RouteLine({ progress = 0 }) {
  const totalLen = 320;
  const done = totalLen * progress;
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 280" fill="none">
      {/* Glow */}
      <path d="M40 220 Q120 175 200 165 T370 80" stroke="rgba(226,0,26,0.18)" strokeWidth="14" strokeLinecap="round"/>
      {/* Remaining */}
      <path d="M40 220 Q120 175 200 165 T370 80" stroke="rgba(226,0,26,0.3)" strokeWidth="3" strokeLinecap="round"/>
      {/* Completed */}
      {progress > 0 && (
        <path d="M40 220 Q120 175 200 165 T370 80" stroke="#e2001a" strokeWidth="3" strokeLinecap="round"
          strokeDasharray={`${done} ${totalLen}`}/>
      )}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   6. NAV QUICKSTART
   ═══════════════════════════════════════════════════════════════════════════ */

function NavQuickstartDemo() {
  const [status, setStatus] = useState('idle'); // idle | navigating | arrived
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);

  function startNav() {
    setStatus('navigating');
    setProgress(0);
  }

  useEffect(() => {
    if (status !== 'navigating') return;
    timerRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 1) {
          clearInterval(timerRef.current);
          setStatus('arrived');
          return 1;
        }
        return p + 0.018;
      });
    }, 60);
    return () => clearInterval(timerRef.current);
  }, [status]);

  const pct = Math.round(progress * 100);
  const remaining = Math.round((1 - progress) * 22);

  return (
    <MapShell height={290}>
      <RouteLine progress={progress} />

      {/* Chevron vehicle */}
      {status !== 'idle' && (
        <div style={{
          position: 'absolute',
          left: `${10 + progress * 78}%`,
          top: `${78 - progress * 48}%`,
          width: 18, height: 18,
          background: '#e2001a', borderRadius: '50%',
          border: '2.5px solid #fff',
          boxShadow: '0 0 0 4px rgba(226,0,26,0.3)',
          transition: 'left 0.06s linear, top 0.06s linear',
          zIndex: 3,
        }}/>
      )}

      {/* NIP */}
      {status === 'navigating' && (
        <div style={{
          position: 'absolute', top: 10, left: 10,
          background: 'rgba(15,26,40,0.95)', borderRadius: 10,
          padding: '8px 12px', border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{ fontSize: '1.5rem', lineHeight: 1 }}>↖</div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>
              {remaining > 10 ? `${remaining} min` : `${remaining * 60} m`}
            </div>
            <div style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.5)' }}>Turn left · Keizersgracht</div>
          </div>
        </div>
      )}

      {/* ETA bar */}
      {status === 'navigating' && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'rgba(10,16,28,0.97)', borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', gap: 20 }}>
            {[['14:' + (32 + Math.floor(progress * 22)).toString().padStart(2, '0'), 'ETA'],
              [remaining + ' min', 'Remaining'],
              [((1 - progress) * 8.4).toFixed(1) + ' km', 'Distance']].map(([v, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e2e8f0' }}>{v}</div>
                <div style={{ fontSize: '0.5rem', color: '#64748b' }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ width: 80, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
            <div style={{ width: `${pct}%`, height: '100%', background: '#e2001a', borderRadius: 2, transition: 'width 0.06s' }}/>
          </div>
        </div>
      )}

      {status === 'arrived' && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(10,16,28,0.85)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <div style={{ fontSize: '2rem' }}>📍</div>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff' }}>You have arrived</div>
          <button onClick={() => { setStatus('idle'); setProgress(0); }} style={{
            background: '#e2001a', color: '#fff', border: 'none', borderRadius: 8,
            padding: '6px 16px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', marginTop: 4,
          }}>Done</button>
        </div>
      )}

      {status === 'idle' && (
        <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)' }}>
          <button onClick={startNav} style={{
            background: '#e2001a', color: '#fff', border: 'none', borderRadius: 20,
            padding: '9px 24px', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(226,0,26,0.4)',
          }}>Start Navigation</button>
        </div>
      )}
    </MapShell>
  );
}

const KT_NAV_QS = `// 1. Create the navigation engine
val tomTomNavigation = TomTomNavigation.create(
    context = applicationContext,
    navigationConfiguration = NavigationConfiguration(
        apiKey = "YOUR_API_KEY",
        locationEngine = AndroidLocationEngine(applicationContext)
    )
)

// 2. Plan a route
routingApi.planRoute(options) { result ->
    result.onSuccess { routes ->
        // 3. Start navigation
        tomTomNavigation.start(routes.first())
    }
}

// 4. Observe progress
tomTomNavigation.addRouteProgressObserver { progress ->
    val distanceRemaining = progress.distanceAlongRoute
    val timeRemaining = progress.remainingTime
}`;

const SW_NAV_QS = `// 1. Create the navigation engine
let tomTomNavigation = TomTomNavigation.create(
    configuration: NavigationConfiguration(
        apiKey: "YOUR_API_KEY",
        locationProvider: DefaultLocationProvider()
    )
)

// 2. Plan a route
routingApi.planRoute(options) { result in
    switch result {
    case .success(let routes):
        // 3. Start navigation
        tomTomNavigation.start(route: routes.first!)
    case .failure: break
    }
}

// 4. Observe progress
tomTomNavigation.addObserver(self) // conform to NavigationObserver
func navigation(_ navigation: TomTomNavigation, didUpdateRouteProgress progress: RouteProgress) {
    let distanceRemaining = progress.distanceAlongRoute
}`;

export function NavSDKNavQuickstart({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Navigation Quickstart</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Create the <code>TomTomNavigation</code> engine, attach it to a planned route,
        and observe real-time progress in four steps.
      </p>

      <div className="zone">
        <h2 className="sh" id="nqs-demo">Interactive demo</h2>
        <p className="body">Tap <strong>Start Navigation</strong> to simulate a guided session with a moving vehicle and live ETA.</p>
        <NavQuickstartDemo />
      </div>

      <div className="zone">
        <h2 className="sh" id="nqs-code">Setup code</h2>
        <CodeBlock tabs={['Kotlin', 'Swift']}>
          {KT_NAV_QS}
          {SW_NAV_QS}
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="nqs-lifecycle">Lifecycle</h2>
        <p className="body">
          The navigation engine must be bound to a location source before starting. Call
          <code> stop()</code> when the journey completes or the user cancels, and
          <code> destroy()</code> when the host component is torn down to release resources.
        </p>
        <CodeBlock tabs={['Kotlin', 'Swift']}>
          {`override fun onDestroy() {
    super.onDestroy()
    tomTomNavigation.stop()
    tomTomNavigation.close()   // releases all held resources
}`}
          {`deinit {
    tomTomNavigation.stop()
    tomTomNavigation.close()
}`}
        </CodeBlock>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   7. TURN-BY-TURN
   ═══════════════════════════════════════════════════════════════════════════ */

const MANEUVERS = [
  { icon: '↖', type: 'TURN_LEFT',       street: 'Keizersgracht',   dist: '800 m', exit: null },
  { icon: '↗', type: 'TURN_RIGHT',      street: 'Prinsengracht',   dist: '1.2 km', exit: null },
  { icon: '⬆', type: 'KEEP_RIGHT',      street: 'A10 motorway',    dist: '500 m', exit: '14' },
  { icon: '↩', type: 'U_TURN',          street: 'Vondelstraat',    dist: '200 m', exit: null },
  { icon: '↔', type: 'ROUNDABOUT_EXIT', street: 'Overtoom',        dist: '300 m', exit: '3rd' },
];

function TurnByTurnDemo() {
  const [step, setStep] = useState(0);
  const m = MANEUVERS[step];

  return (
    <div>
      {/* NIP mock */}
      <div style={{
        background: 'linear-gradient(135deg, #1a3d2b, #0d2218)',
        borderRadius: 14, padding: '16px 20px',
        border: '1px solid rgba(63,185,80,0.25)',
        display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14,
      }}>
        {/* Maneuver icon */}
        <div style={{
          width: 56, height: 56, borderRadius: 12,
          background: 'rgba(226,0,26,0.15)', border: '2px solid rgba(226,0,26,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2rem', flexShrink: 0,
        }}>
          {m.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', lineHeight: 1, marginBottom: 4 }}>
            {m.dist}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', marginBottom: 2 }}>
            {m.type === 'ROUNDABOUT_EXIT' ? `Take ${m.exit} exit` : m.type.replace(/_/g, ' ').toLowerCase()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>
            {m.street}{m.exit && m.type !== 'ROUNDABOUT_EXIT' ? ` · Exit ${m.exit}` : ''}
          </div>
        </div>
        <div style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.25)', textAlign: 'right' }}>
          <div style={{ fontWeight: 700, fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{step + 1}/{MANEUVERS.length}</div>
          maneuver
        </div>
      </div>

      {/* Next maneuver btn */}
      <button onClick={() => setStep(s => (s + 1) % MANEUVERS.length)} style={{
        width: '100%', padding: '10px', borderRadius: 10, cursor: 'pointer',
        background: 'var(--bg)', border: '1px solid var(--border)',
        fontSize: '0.875rem', fontWeight: 600, color: 'var(--mid)',
      }}>
        Next maneuver →
      </button>

      {/* API field callout */}
      <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 10, background: 'var(--bg)', border: '1px solid var(--border)', fontSize: '0.75rem', fontFamily: 'monospace' }}>
        <div style={{ color: 'var(--muted)', marginBottom: 6 }}>GuidanceInstruction fields</div>
        {[
          ['maneuverType', m.type],
          ['remainingDistance', m.dist],
          ['streetName', m.street],
          ['exitNumber', m.exit ?? 'null'],
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', gap: 8, marginBottom: 3 }}>
            <span style={{ color: '#3b82f6', minWidth: 140 }}>{k}</span>
            <span style={{ color: '#e2e8f0' }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const KT_TBT = `tomTomNavigation.addGuidanceStateObserver { guidanceState ->
    when (guidanceState) {
        is GuidanceState.GuidanceUpdated -> {
            val instruction = guidanceState.currentInstruction

            // Maneuver type and details
            val type = instruction.maneuverType          // e.g. TURN_LEFT
            val dist = instruction.remainingDistanceInMeters
            val street = instruction.streetName
            val exit = instruction.exitNumber            // for motorway exits

            // Update your custom NIP
            nipView.setManeuver(type, dist, street, exit)
        }
        is GuidanceState.Arrived -> {
            showArrivalUI()
        }
        is GuidanceState.NoGuidance -> { /* off-route or not started */ }
    }
}`;

const SW_TBT = `// Conform to NavigationObserver
extension ViewController: NavigationObserver {
    func navigation(_ navigation: TomTomNavigation,
                    didUpdateGuidanceState state: GuidanceState) {
        switch state {
        case .guidance(let update):
            let instruction = update.currentInstruction

            let type = instruction.maneuverType
            let dist = instruction.remainingDistanceInMeters
            let street = instruction.streetName
            let exit = instruction.exitNumber

            nipView.setManeuver(type, dist, street, exit)

        case .arrived:
            showArrivalUI()

        case .noGuidance:
            break
        }
    }
}`;

export function NavSDKNavTurnByTurn({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Turn-by-Turn Guidance</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Subscribe to <code>GuidanceStateObserver</code> to receive structured manoeuvre events —
        turn type, street name, distance, and exit number — at every decision point.
      </p>

      <div className="zone">
        <h2 className="sh" id="tbt-demo">Interactive demo</h2>
        <p className="body">Cycle through manoeuvre types and inspect the corresponding <code>GuidanceInstruction</code> fields.</p>
        <TurnByTurnDemo />
      </div>

      <div className="zone">
        <h2 className="sh" id="tbt-code">Code</h2>
        <CodeBlock tabs={['Kotlin', 'Swift']}>
          {KT_TBT}
          {SW_TBT}
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="tbt-fields">GuidanceInstruction fields</h2>
        <table className="prop-table">
          <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            {[
              ['maneuverType',               'ManeuverType',  'TURN_LEFT, TURN_RIGHT, KEEP_RIGHT, ROUNDABOUT_EXIT, U_TURN, ARRIVE, …'],
              ['remainingDistanceInMeters',  'Double',        'Distance to this maneuver from current position'],
              ['streetName',                 'String?',       'Name of the road after the maneuver'],
              ['exitNumber',                 'String?',       'Motorway exit number or roundabout exit ordinal'],
              ['combinedInstruction',        'Instruction?',  'Next-next instruction for lane-level guidance panels'],
            ].map(([f, t, d]) => (
              <tr key={f}><td><code style={{ fontSize: '0.75rem' }}>{f}</code></td><td><code style={{ fontSize: '0.75rem' }}>{t}</code></td><td style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>{d}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   8. VOICE INSTRUCTIONS
   ═══════════════════════════════════════════════════════════════════════════ */

const VOICE_TRIGGERS = [
  { dist: 2000, label: '2 km ahead', prompt: 'In 2 kilometres, turn left onto Keizersgracht.' },
  { dist: 500,  label: '500 m ahead', prompt: 'In 500 metres, turn left onto Keizersgracht.' },
  { dist: 200,  label: '200 m ahead', prompt: 'Turn left onto Keizersgracht.' },
];

function VoiceInstructionsDemo() {
  const [triggered, setTriggered] = useState(null);

  return (
    <div>
      <MapShell height={240}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 240" fill="none">
          {/* Route */}
          <path d="M40 210 Q130 170 200 155 T365 75" stroke="rgba(226,0,26,0.2)" strokeWidth="10" strokeLinecap="round"/>
          <path d="M40 210 Q130 170 200 155 T365 75" stroke="#e2001a" strokeWidth="2.5" strokeLinecap="round"/>
          {/* Distance rings on route */}
          {VOICE_TRIGGERS.map((t, i) => {
            const cx = 80 + i * 90;
            const cy = 180 - i * 40;
            return (
              <g key={t.dist}>
                <circle cx={cx} cy={cy} r={22} stroke={triggered === i ? '#f59e0b' : 'rgba(255,255,255,0.08)'} strokeWidth="1.5" strokeDasharray="4 3"/>
                <circle cx={cx} cy={cy} r={4} fill={triggered === i ? '#f59e0b' : 'rgba(255,255,255,0.25)'} style={{ cursor: 'pointer' }} onClick={() => setTriggered(i)}/>
                <text x={cx} y={cy - 28} textAnchor="middle" fill={triggered === i ? '#f59e0b' : 'rgba(255,255,255,0.4)'} fontSize="8" fontWeight="bold">{t.label}</text>
              </g>
            );
          })}
          {/* Vehicle */}
          <circle cx="40" cy="210" r="6" fill="#e2001a" stroke="#fff" strokeWidth="2"/>
        </svg>
      </MapShell>

      {triggered !== null && (
        <div style={{
          marginTop: 12, padding: '12px 16px', borderRadius: 12,
          background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.05))',
          border: '1px solid rgba(245,158,11,0.3)',
          display: 'flex', alignItems: 'flex-start', gap: 10,
        }}>
          <span style={{ fontSize: '1.25rem' }}>🔊</span>
          <div>
            <div style={{ fontSize: '0.625rem', fontWeight: 700, color: '#f59e0b', marginBottom: 4 }}>
              VOICE PROMPT @ {VOICE_TRIGGERS[triggered].label}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--black)', fontStyle: 'italic' }}>
              "{VOICE_TRIGGERS[triggered].prompt}"
            </div>
          </div>
        </div>
      )}
      {triggered === null && (
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--muted)', marginTop: 8 }}>
          Tap a distance ring to hear what voice prompt fires
        </p>
      )}
    </div>
  );
}

const KT_VOICE = `// Subscribe to voice instructions
tomTomNavigation.addVoiceInstructionObserver { instruction ->
    // instruction.message is the TTS string
    textToSpeech.speak(instruction.message, TextToSpeech.QUEUE_FLUSH, null, null)
}

// Custom TTS engine
class MyTtsEngine : TTSEngine {
    override fun speak(message: String) {
        // Use third-party TTS provider
        thirdPartyTts.synthesise(message)
    }
    override fun stop() = thirdPartyTts.stop()
    override fun shutdown() = thirdPartyTts.destroy()
}

tomTomNavigation.setTtsEngine(MyTtsEngine())`;

const SW_VOICE = `// Conform to VoiceInstructionObserver
extension ViewController: VoiceInstructionObserver {
    func navigation(_ navigation: TomTomNavigation,
                    didUpdateVoiceInstruction instruction: VoiceInstruction) {
        let utterance = AVSpeechUtterance(string: instruction.message)
        utterance.voice = AVSpeechSynthesisVoice(language: "en-US")
        AVSpeechSynthesizer().speak(utterance)
    }
}

// Custom TTSProvider
class MyTtsProvider: TTSProvider {
    func speak(_ message: String) {
        thirdPartyTts.synthesise(message)
    }
    func stop() { thirdPartyTts.stop() }
}

tomTomNavigation.setTtsProvider(MyTtsProvider())`;

export function NavSDKNavVoice({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Voice Instructions</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Receive TTS-ready voice prompts at the correct distance before each manoeuvre.
        Plug in Android TTS, <code>AVSpeechSynthesizer</code>, or a fully custom engine.
      </p>

      <div className="zone">
        <h2 className="sh" id="vi-demo">Interactive demo</h2>
        <p className="body">Tap a distance ring to preview the voice prompt that fires at that distance.</p>
        <VoiceInstructionsDemo />
      </div>

      <div className="zone">
        <h2 className="sh" id="vi-timing">Instruction timing</h2>
        <p className="body">
          The SDK fires <code>VoiceInstruction</code> events at three pre-calculated distances before
          each maneuver. The exact metre values adapt to current speed and road type.
        </p>
        <table className="prop-table">
          <thead><tr><th>Trigger</th><th>Default distance</th><th>Prompt style</th></tr></thead>
          <tbody>
            {[
              ['Early',    '~2 km', '"In 2 kilometres, turn left onto …"'],
              ['Main',     '~500 m', '"In 500 metres, turn left onto …"'],
              ['Imminent', '~200 m', '"Turn left onto …"'],
            ].map(([t, d, p]) => (
              <tr key={t}><td style={{ fontWeight: 600 }}>{t}</td><td><code>{d}</code></td><td style={{ fontSize: '0.875rem', color: 'var(--mid)', fontStyle: 'italic' }}>{p}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="vi-code">Code</h2>
        <CodeBlock tabs={['Kotlin', 'Swift']}>
          {KT_VOICE}
          {SW_VOICE}
        </CodeBlock>
      </div>

      <Callout type="info">
        Android uses the <code>TTSEngine</code> interface; iOS uses <code>TTSProvider</code>.
        Both receive the same pre-formatted prompt string — you only need to call
        your preferred synthesiser's speak method.
      </Callout>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   9. CONTINUOUS REPLANNING
   ═══════════════════════════════════════════════════════════════════════════ */

function ReplanningDemo() {
  const [phase, setPhase] = useState('onroute'); // onroute | offroute | replanning | newroute
  const animRef = useRef(null);

  function goOffRoute() {
    setPhase('offroute');
    animRef.current = setTimeout(() => {
      setPhase('replanning');
      animRef.current = setTimeout(() => setPhase('newroute'), 1200);
    }, 800);
  }
  function reset() {
    clearTimeout(animRef.current);
    setPhase('onroute');
  }

  useEffect(() => () => clearTimeout(animRef.current), []);

  return (
    <div>
      <MapShell height={260}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 260" fill="none">
          {/* Original route */}
          <path d="M40 210 Q140 165 220 150 T370 75" stroke="rgba(226,0,26,0.2)" strokeWidth="10" strokeLinecap="round"/>
          <path d="M40 210 Q140 165 220 150 T370 75"
            stroke={phase === 'newroute' ? 'rgba(226,0,26,0.25)' : '#e2001a'} strokeWidth="2.5" strokeLinecap="round"
            strokeDasharray={phase === 'offroute' || phase === 'replanning' ? '6 4' : ''}/>

          {/* Off-route deviation path */}
          {(phase === 'offroute' || phase === 'replanning') && (
            <path d="M160 170 Q175 210 210 220 Q240 228 255 220" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 3"/>
          )}

          {/* New recalculated route */}
          {phase === 'newroute' && (
            <>
              <path d="M255 220 Q290 200 320 170 T370 75" stroke="rgba(226,0,26,0.2)" strokeWidth="10" strokeLinecap="round"/>
              <path d="M255 220 Q290 200 320 170 T370 75" stroke="#e2001a" strokeWidth="2.5" strokeLinecap="round"/>
            </>
          )}

          {/* Vehicle */}
          <circle
            cx={phase === 'onroute' ? 160 : phase === 'offroute' ? 210 : phase === 'replanning' ? 255 : 255}
            cy={phase === 'onroute' ? 170 : phase === 'offroute' ? 220 : phase === 'replanning' ? 220 : 220}
            r="6" fill="#e2001a" stroke="#fff" strokeWidth="2"
            style={{ transition: 'cx 0.8s ease, cy 0.8s ease' }}
          />
        </svg>

        {/* Status overlay */}
        <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(15,26,40,0.9)', borderRadius: 8, padding: '6px 12px', border: `1px solid ${phase === 'offroute' ? 'rgba(245,158,11,0.4)' : phase === 'replanning' ? 'rgba(226,0,26,0.4)' : 'rgba(255,255,255,0.1)'}` }}>
          <div style={{ fontSize: '0.625rem', fontWeight: 700, color: phase === 'offroute' ? '#f59e0b' : phase === 'replanning' ? '#e2001a' : '#3fb950' }}>
            {phase === 'onroute' ? 'ON ROUTE' : phase === 'offroute' ? 'OFF ROUTE' : phase === 'replanning' ? 'REPLANNING…' : 'NEW ROUTE READY'}
          </div>
        </div>
      </MapShell>

      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button onClick={goOffRoute} disabled={phase !== 'onroute'} style={{
          flex: 1, padding: '9px', borderRadius: 10, cursor: phase === 'onroute' ? 'pointer' : 'not-allowed',
          background: phase === 'onroute' ? '#fff5f5' : 'var(--bg)',
          border: `1px solid ${phase === 'onroute' ? '#e2001a' : 'var(--border)'}`,
          color: phase === 'onroute' ? '#e2001a' : 'var(--muted)',
          fontSize: '0.875rem', fontWeight: 600, opacity: phase === 'onroute' ? 1 : 0.5,
        }}>Deviate from route</button>
        <button onClick={reset} style={{
          padding: '9px 16px', borderRadius: 10, cursor: 'pointer',
          background: 'var(--bg)', border: '1px solid var(--border)',
          fontSize: '0.875rem', color: 'var(--mid)',
        }}>Reset</button>
      </div>
    </div>
  );
}

const KT_REPLAN = `// Observe deviation
tomTomNavigation.addRouteDeviationObserver { deviation ->
    when (deviation) {
        is RouteDeviation.RouteDeviated -> {
            val distOff = deviation.distanceFromRoute   // metres from original route
            Log.d("Nav", "Off route by \${distOff}m")
        }
        is RouteDeviation.NoDeviation -> { /* back on track */ }
    }
}

// Configure replanning behaviour
val replanningOptions = ReplanningOptions(
    enabled = true,
    deviationThresholdInMeters = 50.0     // trigger after 50 m off-route
)
tomTomNavigation.setReplanningOptions(replanningOptions)

// Listen for new route
tomTomNavigation.addNewRouteObserver { newRoute ->
    // Route was automatically recalculated
    Log.d("Nav", "New route calculated: \${newRoute.summary.travelTime}s")
}`;

const SW_REPLAN = `// Observe deviation
class NavDelegate: NavigationObserver {
    func navigation(_ navigation: TomTomNavigation,
                    didUpdateRouteDeviation deviation: RouteDeviation) {
        switch deviation {
        case .deviated(let info):
            let dist = info.distanceFromRoute
            print("Off route by \\(dist)m")
        case .noDeviation:
            break
        }
    }

    func navigation(_ navigation: TomTomNavigation,
                    didCalculateNewRoute route: Route) {
        print("New route: \\(route.summary.travelTime)s")
    }
}

// Configure replanning
let replanningOptions = ReplanningOptions(
    enabled: true,
    deviationThresholdInMeters: 50.0
)
tomTomNavigation.replanningOptions = replanningOptions`;

export function NavSDKNavReplanning({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Continuous Replanning</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        The navigation engine detects off-route events and automatically recalculates a new
        route. Configure the deviation threshold and listen for the new route via observers.
      </p>

      <div className="zone">
        <h2 className="sh" id="rp-demo">Interactive demo</h2>
        <p className="body">Click <strong>Deviate from route</strong> to simulate going off-route and watch the automatic recalculation.</p>
        <ReplanningDemo />
      </div>

      <div className="zone">
        <h2 className="sh" id="rp-code">Code</h2>
        <CodeBlock tabs={['Kotlin', 'Swift']}>
          {KT_REPLAN}
          {SW_REPLAN}
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="rp-options">ReplanningOptions</h2>
        <table className="prop-table">
          <thead><tr><th>Option</th><th>Default</th><th>Description</th></tr></thead>
          <tbody>
            {[
              ['enabled',                      'true',    'Enable or disable automatic replanning'],
              ['deviationThresholdInMeters',   '50.0',    'Distance off-route before replanning triggers'],
              ['replanningMode',               'FASTEST', 'FASTEST, ECO, or match original route options'],
            ].map(([o, d, desc]) => (
              <tr key={o}><td><code style={{ fontSize: '0.75rem' }}>{o}</code></td><td><code>{d}</code></td><td style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>{desc}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   10. SAFETY LOCATIONS
   ═══════════════════════════════════════════════════════════════════════════ */

const SAFETY_ICONS = { SPEED_CAMERA: '📷', DANGER_ZONE: '⚠️', SCHOOL_ZONE: '🏫' };
const SAFETY_COLORS = { SPEED_CAMERA: '#f59e0b', DANGER_ZONE: '#ef4444', SCHOOL_ZONE: '#10b981' };

const CAMERAS = [
  { id: 0, type: 'SPEED_CAMERA', cx: 120, cy: 160, dist: 800 },
  { id: 1, type: 'DANGER_ZONE',  cx: 220, cy: 135, dist: 1600 },
  { id: 2, type: 'SCHOOL_ZONE',  cx: 300, cy: 105, dist: 2800 },
];

function SafetyDemo() {
  const [active, setActive] = useState(null);

  const current = active !== null ? CAMERAS[active] : null;

  return (
    <div>
      <MapShell height={250}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 250" fill="none">
          <path d="M40 210 Q140 165 220 140 T370 75" stroke="rgba(226,0,26,0.15)" strokeWidth="10" strokeLinecap="round"/>
          <path d="M40 210 Q140 165 220 140 T370 75" stroke="#e2001a" strokeWidth="2.5" strokeLinecap="round"/>
          {CAMERAS.map((c, i) => (
            <g key={c.id} style={{ cursor: 'pointer' }} onClick={() => setActive(active === i ? null : i)}>
              <circle cx={c.cx} cy={c.cy} r={active === i ? 18 : 12}
                fill={`${SAFETY_COLORS[c.type]}25`}
                stroke={SAFETY_COLORS[c.type]}
                strokeWidth={active === i ? 2 : 1.5}
                style={{ transition: 'r 0.15s' }}/>
            </g>
          ))}
          {/* Vehicle */}
          <circle cx="40" cy="210" r="6" fill="#e2001a" stroke="#fff" strokeWidth="2"/>
        </svg>

        {/* Emoji labels */}
        {CAMERAS.map((c, i) => (
          <div key={c.id} style={{
            position: 'absolute',
            left: `${c.cx / 4}%`,
            top: `${c.cy / 2.5}%`,
            fontSize: '1rem',
            cursor: 'pointer',
            transform: 'translate(-50%, -50%)',
            filter: active === i ? 'drop-shadow(0 0 6px white)' : 'none',
          }} onClick={() => setActive(active === i ? null : i)}>
            {SAFETY_ICONS[c.type]}
          </div>
        ))}
      </MapShell>

      {current ? (
        <div style={{
          marginTop: 10, padding: '12px 16px', borderRadius: 12,
          background: `${SAFETY_COLORS[current.type]}10`,
          border: `1px solid ${SAFETY_COLORS[current.type]}40`,
          display: 'flex', gap: 12, alignItems: 'center',
        }}>
          <span style={{ fontSize: '1.5rem' }}>{SAFETY_ICONS[current.type]}</span>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: SAFETY_COLORS[current.type] }}>
              {current.type.replace(/_/g, ' ')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--mid)' }}>
              {current.dist} m ahead · Alert will fire at 500 m
            </div>
          </div>
        </div>
      ) : (
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--muted)', marginTop: 8 }}>
          Tap an icon to inspect the safety location type
        </p>
      )}
    </div>
  );
}

const KT_SAFETY = `tomTomNavigation.addSafetyLocationWarningObserver { warning ->
    when (warning.safetyLocationType) {
        SafetyLocationType.SPEED_CAMERA -> {
            val distToCamera = warning.distanceToWarningInMeters
            val speedLimit = warning.speedLimit   // km/h
            showCameraAlert(distToCamera, speedLimit)
        }
        SafetyLocationType.DANGER_ZONE -> {
            showDangerZoneAlert(warning.distanceToWarningInMeters)
        }
        SafetyLocationType.SCHOOL_ZONE -> {
            showSchoolZoneAlert(warning.distanceToWarningInMeters)
        }
    }
}

// Configure alert distances
val safetyConfig = SafetyLocationConfiguration(
    speedCameraAlertDistanceInMeters = 500.0,
    dangerZoneAlertDistanceInMeters = 300.0
)
tomTomNavigation.setSafetyLocationConfiguration(safetyConfig)`;

const SW_SAFETY = `extension ViewController: SafetyLocationObserver {
    func navigation(_ navigation: TomTomNavigation,
                    didUpdateSafetyLocationWarning warning: SafetyLocationWarning) {
        switch warning.safetyLocationType {
        case .speedCamera:
            let dist = warning.distanceToWarningInMeters
            let limit = warning.speedLimit
            showCameraAlert(dist, limit)
        case .dangerZone:
            showDangerZoneAlert(warning.distanceToWarningInMeters)
        case .schoolZone:
            showSchoolZoneAlert(warning.distanceToWarningInMeters)
        }
    }
}

// Configure
let config = SafetyLocationConfiguration(
    speedCameraAlertDistanceInMeters: 500,
    dangerZoneAlertDistanceInMeters: 300
)
tomTomNavigation.safetyLocationConfiguration = config`;

export function NavSDKNavSafety({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Safety Locations</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Subscribe to <code>SafetyLocationWarningObserver</code> to receive advance alerts for
        speed cameras, danger zones, and school zones along the active route.
      </p>

      <div className="zone">
        <h2 className="sh" id="sl-demo">Interactive demo</h2>
        <p className="body">Tap a safety icon on the route to inspect its type and alert distance.</p>
        <SafetyDemo />
      </div>

      <div className="zone">
        <h2 className="sh" id="sl-types">Safety location types</h2>
        <table className="prop-table">
          <thead><tr><th>Type</th><th>Android</th><th>iOS</th></tr></thead>
          <tbody>
            {[
              ['Speed camera',  'SafetyLocationType.SPEED_CAMERA', '.speedCamera'],
              ['Danger zone',   'SafetyLocationType.DANGER_ZONE',  '.dangerZone'],
              ['School zone',   'SafetyLocationType.SCHOOL_ZONE',  '.schoolZone'],
            ].map(([t, a, i]) => (
              <tr key={t}><td style={{ fontWeight: 600 }}>{t}</td><td><code style={{ fontSize: '0.75rem' }}>{a}</code></td><td><code style={{ fontSize: '0.75rem' }}>{i}</code></td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="sl-code">Code</h2>
        <CodeBlock tabs={['Kotlin', 'Swift']}>
          {KT_SAFETY}
          {SW_SAFETY}
        </CodeBlock>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   11. FREE DRIVING
   ═══════════════════════════════════════════════════════════════════════════ */

function FreeDrivingDemo() {
  const [moving, setMoving] = useState(false);
  const [pos, setPos] = useState({ x: 200, y: 145 });
  const [speed, setSpeed] = useState(52);
  const [road, setRoad] = useState('Overtoom');
  const timerRef = useRef(null);

  const WAYPOINTS = [
    { x: 200, y: 145, speed: 52, road: 'Overtoom' },
    { x: 240, y: 130, speed: 68, road: 'A10 Ring' },
    { x: 290, y: 118, speed: 100, road: 'A10 Ring' },
    { x: 330, y: 100, speed: 85, road: 'A10 Ring' },
    { x: 200, y: 145, speed: 52, road: 'Overtoom' },
  ];
  const wpRef = useRef(0);

  function startStop() {
    if (moving) {
      clearInterval(timerRef.current);
      setMoving(false);
      wpRef.current = 0;
      setPos(WAYPOINTS[0]);
      setSpeed(WAYPOINTS[0].speed);
      setRoad(WAYPOINTS[0].road);
    } else {
      setMoving(true);
      wpRef.current = 0;
      timerRef.current = setInterval(() => {
        wpRef.current = (wpRef.current + 1) % WAYPOINTS.length;
        const wp = WAYPOINTS[wpRef.current];
        setPos({ x: wp.x, y: wp.y });
        setSpeed(wp.speed);
        setRoad(wp.road);
      }, 900);
    }
  }
  useEffect(() => () => clearInterval(timerRef.current), []);

  const limitExceeded = speed > 80;

  return (
    <div>
      <MapShell height={260}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 260" fill="none">
          {/* No route line — free driving */}
          <circle cx={pos.x} cy={pos.y} r="7" fill="#e2001a" stroke="#fff" strokeWidth="2"
            style={{ transition: 'cx 0.85s ease, cy 0.85s ease' }}/>
          <circle cx={pos.x} cy={pos.y} r="16" fill="rgba(226,0,26,0.15)"
            style={{ transition: 'cx 0.85s ease, cy 0.85s ease' }}/>
        </svg>

        {/* Speed limit badge */}
        <div style={{
          position: 'absolute', top: 10, left: 10,
          width: 52, height: 52, borderRadius: '50%',
          background: '#fff', border: `4px solid ${limitExceeded ? '#ef4444' : '#1a2535'}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          boxShadow: limitExceeded ? '0 0 12px rgba(239,68,68,0.5)' : 'none',
          transition: 'border-color 0.3s, box-shadow 0.3s',
        }}>
          <div style={{ fontSize: '0.5rem', fontWeight: 700, color: '#64748b', lineHeight: 1 }}>km/h</div>
          <div style={{ fontSize: '1rem', fontWeight: 900, color: '#1a2535', lineHeight: 1 }}>80</div>
        </div>

        {/* Current speed */}
        <div style={{ position: 'absolute', top: 10, left: 72, background: 'rgba(15,26,40,0.9)', borderRadius: 8, padding: '6px 12px', border: `1px solid ${limitExceeded ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}` }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: limitExceeded ? '#ef4444' : '#fff', lineHeight: 1 }}>{speed}</div>
          <div style={{ fontSize: '0.5rem', color: '#64748b' }}>Current speed</div>
        </div>

        {/* Road name */}
        <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', background: 'rgba(15,26,40,0.9)', borderRadius: 8, padding: '5px 14px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.75rem', fontWeight: 700, color: '#e2e8f0', whiteSpace: 'nowrap' }}>
          {road}
        </div>
      </MapShell>

      <button onClick={startStop} style={{
        width: '100%', marginTop: 10, padding: '10px', borderRadius: 10, cursor: 'pointer',
        background: moving ? 'var(--bg)' : '#fff5f5',
        border: `1px solid ${moving ? 'var(--border)' : '#e2001a'}`,
        color: moving ? 'var(--mid)' : '#e2001a',
        fontSize: '0.875rem', fontWeight: 700,
      }}>
        {moving ? 'Stop free driving' : 'Start free driving'}
      </button>
    </div>
  );
}

const KT_FREE = `// Start free driving mode (no active route required)
tomTomNavigation.startFreeDriving()

// Observe map-matched position
tomTomNavigation.addFreeDrivingStateObserver { state ->
    when (state) {
        is FreeDrivingState.FreeDriving -> {
            val matchedPos = state.matchedLocation       // road-snapped position
            val speedLimit = state.speedLimit            // km/h or mph
            val roadName = state.roadName                // current road name
            val currentSpeed = state.vehicleSpeed        // from location engine

            // Update speed limit display and road name badge
            updateSpeedDisplay(speedLimit, currentSpeed)
            roadNameBadge.text = roadName
        }
        is FreeDrivingState.Idle -> { /* not active */ }
    }
}

// Stop when done
tomTomNavigation.stopFreeDriving()`;

const SW_FREE = `// Start free driving mode
tomTomNavigation.startFreeDriving()

// Observe via FreeDrivingObserver
extension ViewController: FreeDrivingObserver {
    func navigation(_ navigation: TomTomNavigation,
                    didUpdateFreeDrivingState state: FreeDrivingState) {
        switch state {
        case .freeDriving(let info):
            let matchedPos = info.matchedLocation
            let speedLimit = info.speedLimit
            let roadName = info.roadName
            let currentSpeed = info.vehicleSpeed

            updateSpeedDisplay(speedLimit: speedLimit, current: currentSpeed)
            roadNameLabel.text = roadName

        case .idle:
            break
        }
    }
}

tomTomNavigation.stopFreeDriving()`;

export function NavSDKNavFreeDriving({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Free Driving Mode</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Activate map-matched positioning without an active route. Speed limits, road names, and
        position snap remain live — ideal for tracking, exploration, and no-destination display.
      </p>

      <div className="zone">
        <h2 className="sh" id="fd-demo">Interactive demo</h2>
        <p className="body">Start free driving to see a vehicle moving on the map with live speed and road-name display — no route line drawn.</p>
        <FreeDrivingDemo />
      </div>

      <div className="zone">
        <h2 className="sh" id="fd-code">Code</h2>
        <CodeBlock tabs={['Kotlin', 'Swift']}>
          {KT_FREE}
          {SW_FREE}
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="fd-use-cases">Use cases</h2>
        <ul style={{ paddingLeft: 20, color: 'var(--mid)', fontSize: '0.875rem', lineHeight: 2 }}>
          <li>Fleet tracking — display vehicle position without a pre-planned destination</li>
          <li>Speed limit assist — alert driver when current speed exceeds the road limit</li>
          <li>Road-name display on cluster or HUD without active navigation</li>
          <li>Exploration mode — map follows vehicle position after the user dismisses guidance</li>
        </ul>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   12. SAVING & RESUMING
   ═══════════════════════════════════════════════════════════════════════════ */

const KT_SAVE = `// Save navigation state (e.g. onPause or onStop)
val serializer = NavigationStateSerializer(tomTomNavigation)
val stateBundle: Bundle = serializer.save()

// Persist to SharedPreferences or file
val stateBytes = stateBundle.toByteArray()   // implement serialization to bytes
prefs.edit().putString("nav_state", Base64.encode(stateBytes)).apply()

// Restore on next launch
val savedBytes = Base64.decode(prefs.getString("nav_state", null) ?: return)
val restoredBundle = Bundle.fromByteArray(savedBytes)
val restored = serializer.restore(restoredBundle)

if (restored != null) {
    tomTomNavigation.resume(restored)
    Log.d("Nav", "Navigation resumed from saved state")
}`;

const SW_SAVE = `// iOS has LIMITED session persistence.
// There is no NavigationStateSerializer equivalent on iOS.
// Recommended approach: save the route JSON and planned options,
// then re-plan and resume from the nearest matched position.

// Save route before app backgrounds
let routeData = try RouteSerializer.toJSON(currentRoute)
UserDefaults.standard.set(routeData, forKey: "saved_route")
UserDefaults.standard.set(progress.distanceAlongRoute, forKey: "saved_progress")

// Resume: re-plan and fast-forward to last known position
let savedRoute = try RouteSerializer.fromJSON(routeData)
tomTomNavigation.start(route: savedRoute)
// The location engine will re-match position automatically`;

function SavingDemo() {
  const [state, setState] = useState('driving'); // driving | saved | restored
  const [progress] = useState(0.38);

  return (
    <div>
      <MapShell height={240}>
        <RouteLine progress={progress} />
        {/* Vehicle at 38% progress */}
        <div style={{
          position: 'absolute', left: '42%', top: '54%',
          width: 14, height: 14, borderRadius: '50%',
          background: '#e2001a', border: '2px solid #fff',
          boxShadow: '0 0 0 4px rgba(226,0,26,0.25)',
          zIndex: 3,
        }}/>

        {/* State indicator */}
        <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(15,26,40,0.9)', borderRadius: 8, padding: '6px 12px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.625rem', fontWeight: 700, color: state === 'saved' ? '#f59e0b' : state === 'restored' ? '#3fb950' : '#e2e8f0' }}>
          {state === 'driving' ? '● NAVIGATING' : state === 'saved' ? '⏸ STATE SAVED' : '▶ RESUMED'}
        </div>

        {/* Progress */}
        <div style={{ position: 'absolute', bottom: 10, left: 12, right: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.5rem', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>
            <span>38% complete</span><span>62% remaining</span>
          </div>
          <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
            <div style={{ width: '38%', height: '100%', background: '#e2001a', borderRadius: 2 }}/>
          </div>
        </div>
      </MapShell>

      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button onClick={() => setState('saved')} disabled={state !== 'driving'} style={{
          flex: 1, padding: '8px', borderRadius: 10, cursor: state === 'driving' ? 'pointer' : 'not-allowed',
          background: 'var(--bg)', border: '1px solid var(--border)', fontSize: '0.75rem', fontWeight: 600,
          color: state === 'driving' ? 'var(--mid)' : 'var(--muted)', opacity: state === 'driving' ? 1 : 0.5,
        }}>Save &amp; exit app</button>
        <button onClick={() => setState('restored')} disabled={state !== 'saved'} style={{
          flex: 1, padding: '8px', borderRadius: 10, cursor: state === 'saved' ? 'pointer' : 'not-allowed',
          background: state === 'saved' ? '#fff5f5' : 'var(--bg)',
          border: `1px solid ${state === 'saved' ? '#e2001a' : 'var(--border)'}`,
          fontSize: '0.75rem', fontWeight: 600,
          color: state === 'saved' ? '#e2001a' : 'var(--muted)', opacity: state === 'saved' ? 1 : 0.5,
        }}>Relaunch &amp; resume</button>
        <button onClick={() => setState('driving')} style={{
          padding: '8px 12px', borderRadius: 10, cursor: 'pointer',
          background: 'var(--bg)', border: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--mid)',
        }}>Reset</button>
      </div>
    </div>
  );
}

export function NavSDKNavSaving({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Saving &amp; Resuming</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Persist navigation state across app restarts. Android provides <code>NavigationStateSerializer</code>
        for full session round-trips; iOS requires a manual route-JSON save approach.
      </p>

      <div className="zone">
        <h2 className="sh" id="sv-demo">Interactive demo</h2>
        <p className="body">Simulate saving state when the app exits and resuming on relaunch.</p>
        <SavingDemo />
      </div>

      <div className="zone">
        <h2 className="sh" id="sv-code">Code</h2>
        <CodeBlock tabs={['Kotlin', 'Swift']}>
          {KT_SAVE}
          {SW_SAVE}
        </CodeBlock>
        <Callout type="warn">
          iOS does not have a <code>NavigationStateSerializer</code> equivalent. Session persistence
          on iOS requires saving the route JSON and progress manually, then re-planning on relaunch.
          The navigation engine will automatically re-match position on restart.
        </Callout>
      </div>

      <div className="zone">
        <h2 className="sh" id="sv-android">Android — NavigationStateSerializer</h2>
        <p className="body">
          <code>NavigationStateSerializer</code> captures the full navigation session state including
          the active route, current progress, waypoints, and guidance engine state. The resulting
          <code> Bundle</code> can be serialised to bytes and stored in any persistence layer
          (SharedPreferences, Room, file) for later restoration.
        </p>
        <table className="prop-table">
          <thead><tr><th>Method</th><th>Returns</th><th>Description</th></tr></thead>
          <tbody>
            {[
              ['save()',              'Bundle',     'Captures current navigation session state'],
              ['restore(bundle)',     'NavState?',  'Restores a previously saved navigation state'],
            ].map(([m, r, d]) => (
              <tr key={m}><td><code style={{ fontSize: '0.75rem' }}>{m}</code></td><td><code>{r}</code></td><td style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>{d}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── NavSDKNavTraffic ───────────────────────────────────────────────────────── */
export function NavSDKNavTraffic() {
  const [trafficEnabled, setTrafficEnabled] = React.useState(true);
  const [avoidTolls, setAvoidTolls]         = React.useState(false);
  const [avoidHighways, setAvoidHighways]   = React.useState(false);
  const [delayThreshold, setDelayThreshold] = React.useState(3);
  const [activeTab, setActiveTab]           = React.useState('kotlin');
  const [simPhase, setSimPhase]             = React.useState(0); // 0=normal,1=delay-detected,2=rerouting,3=rerouted

  React.useEffect(() => {
    if (!trafficEnabled) { setSimPhase(0); return; }
    const t = setInterval(() => setSimPhase(p => (p + 1) % 4), 2200);
    return () => clearInterval(t);
  }, [trafficEnabled]);

  const phases = [
    { label: 'On route',           color: '#22c55e', icon: '🛣️'  },
    { label: 'Delay detected',     color: '#f59e0b', icon: '⚠️'  },
    { label: 'Calculating detour', color: '#3b82f6', icon: '🔄' },
    { label: 'Rerouted!',          color: '#10b981', icon: '✅' },
  ];
  const ph = phases[simPhase];

  const kotlinCode = `// 1. Enable traffic-aware navigation
val navigationOptions = StartNavigationOptions(
    route = plannedRoute,
    routePlanningOptions = RoutePlanningOptions(
        costModel = RouteCostModel(
            routeType = RouteType.FASTEST,
        ),
    ),
)
tomTomNavigation.start(navigationOptions)

// 2. Configure automatic rerouting on traffic
val rerouteConfig = RerouteOptions(
    reroutingEnabled = true,
    // Trigger reroute when delay exceeds threshold (seconds)
    delayThresholdSeconds = ${delayThreshold * 60},
    // Avoid options carried into reroute calls
    avoidOptions = AvoidOptions(
        avoidTollRoads   = ${avoidTolls},
        avoidMotorways   = ${avoidHighways},
    ),
)
tomTomNavigation.setRerouteOptions(rerouteConfig)

// 3. Observe rerouting events
tomTomNavigation.addProgressObserver(object : RouteProgressObserver {
    override fun onRouteProgressChanged(progress: RouteProgress) {
        // progress.remainingRoute gives updated ETA with live traffic
    }
})

tomTomNavigation.addRerouteObserver(object : RerouteObserver {
    override fun onRerouteStarted()        { /* show "recalculating…" UI */ }
    override fun onRerouteFinished(route: Route) { /* update drawn polyline */ }
    override fun onRerouteFailed(error: RerouteError) { /* handle error */ }
})`;

  const swiftCode = `// 1. Enable traffic-aware navigation
let navigationOptions = NavigationOptions(
    route: plannedRoute,
    routePlanningOptions: RoutePlanningOptions(
        routeType: .fastest
    )
)
tomTomNavigation.start(with: navigationOptions)

// 2. Configure rerouting
let rerouteConfig = RerouteOptions(
    reroutingEnabled: true,
    delayThresholdSeconds: ${delayThreshold * 60},
    avoidOptions: AvoidOptions(
        avoidTollRoads: ${avoidTolls},
        avoidMotorways: ${avoidHighways}
    )
)
tomTomNavigation.setRerouteOptions(rerouteConfig)

// 3. Observe rerouting via delegate
extension MyViewController: NavigationDelegate {
    func navigationDidStartRerouting(_ navigation: TomTomNavigation) {
        // show "recalculating…" overlay
    }
    func navigation(_ navigation: TomTomNavigation, didFinishRerouting route: Route) {
        mapView.routeLayer.update(route: route)
    }
    func navigation(_ navigation: TomTomNavigation, didFailReroutingWith error: Error) {
        // handle gracefully
    }
}`;

  return (
    <div className="page-content">
      <div className="zone">
        <h1 className="ph">Traffic-Aware Navigation</h1>
        <p className="lead">
          TomTom NavSDK integrates real-time traffic data directly into the guidance loop — automatically detecting delays ahead and recalculating the fastest route without any user intervention.
        </p>
      </div>

      {/* Live simulation */}
      <div className="zone">
        <h2 className="sh" id="demo">Live traffic rerouting demo</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Map mock */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', minHeight: 280, position: 'relative' }}>
            {/* Road grid */}
            <svg width="100%" height="280" viewBox="0 0 320 280" style={{ display: 'block' }}>
              {/* Background */}
              <rect width="320" height="280" fill="var(--surface)" />
              {/* Grid streets */}
              {[60,120,180,240].map(x => <line key={x} x1={x} y1={0} x2={x} y2={280} stroke="var(--border)" strokeWidth={1.5} />)}
              {[70,140,210].map(y => <line key={y} x1={0} y1={y} x2={320} y2={y} stroke="var(--border)" strokeWidth={1.5} />)}
              {/* Original route (dashed when rerouting) */}
              <path d="M 40 240 L 40 120 L 180 120 L 180 40 L 280 40" stroke={simPhase >= 1 && simPhase <= 2 ? '#f59e0b' : '#94a3b8'} strokeWidth={3} fill="none"
                strokeDasharray={simPhase >= 1 ? '6 4' : 'none'} opacity={simPhase === 3 ? 0.3 : 1} />
              {/* Traffic jam indicator */}
              {trafficEnabled && (
                <rect x={150} y={108} width={60} height={24} rx={4} fill={simPhase >= 1 ? '#ef444422' : 'transparent'}
                  stroke={simPhase >= 1 ? '#ef4444' : 'transparent'} strokeWidth={1.5} />
              )}
              {simPhase >= 1 && trafficEnabled && (
                <text x={180} y={124} textAnchor="middle" fontSize="10" fill="#ef4444" fontWeight="700">JAM +{delayThreshold}min</text>
              )}
              {/* New rerouted path */}
              {simPhase === 3 && (
                <path d="M 40 240 L 40 210 L 240 210 L 240 40 L 280 40" stroke="#10b981" strokeWidth={3} fill="none" />
              )}
              {/* Rerouting animation dots */}
              {simPhase === 2 && [0,1,2].map(i => (
                <circle key={i} cx={60 + i * 60} cy={180} r={4} fill="#3b82f6" opacity={(i + simPhase) % 3 === 0 ? 1 : 0.3} />
              ))}
              {/* Car position */}
              <circle cx={simPhase === 3 ? 140 : 40} cy={simPhase === 3 ? 210 : 200} r={8} fill={ph.color} />
              <text x={simPhase === 3 ? 140 : 40} y={simPhase === 3 ? 214 : 204} textAnchor="middle" fontSize="9" fill="white">🚗</text>
              {/* Origin / Destination */}
              <circle cx={40} cy={240} r={6} fill="#6366f1" />
              <text x={40} y={244} textAnchor="middle" fontSize="8" fill="white">A</text>
              <circle cx={280} cy={40} r={6} fill="#ef4444" />
              <text x={280} y={44} textAnchor="middle" fontSize="8" fill="white">B</text>
            </svg>
            {/* Phase badge */}
            <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, textAlign: 'center' }}>
              <span style={{ background: ph.color + '22', color: ph.color, border: `1px solid ${ph.color}55`, padding: '4px 14px', borderRadius: 30, fontSize: '0.8125rem', fontWeight: 700 }}>
                {ph.icon} {ph.label}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Toggle row */}
            {[
              { label: 'Real-time traffic rerouting', state: trafficEnabled, setState: setTrafficEnabled, note: 'Monitors traffic ahead continuously' },
              { label: 'Avoid toll roads', state: avoidTolls, setState: setAvoidTolls, note: 'Propagated to reroute requests' },
              { label: 'Avoid highways', state: avoidHighways, setState: setAvoidHighways, note: 'Slower but toll-free alternatives' },
            ].map(({ label, state, setState, note }) => (
              <label key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', padding: '12px 14px', borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div onClick={() => setState(s => !s)} style={{ width: 40, height: 22, borderRadius: 11, background: state ? 'var(--accent)' : 'var(--border)', position: 'relative', flexShrink: 0, marginTop: 1, transition: 'background .2s', cursor: 'pointer' }}>
                  <div style={{ position: 'absolute', top: 3, left: state ? 20 : 3, width: 16, height: 16, borderRadius: 8, background: 'white', transition: 'left .2s' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--fg)' }}>{label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 2 }}>{note}</div>
                </div>
              </label>
            ))}

            {/* Delay threshold */}
            <div style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--fg)' }}>Reroute delay threshold</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent)' }}>{delayThreshold} min</span>
              </div>
              <input type="range" min={1} max={15} value={delayThreshold} onChange={e => setDelayThreshold(+e.target.value)}
                aria-label={`Reroute delay threshold: ${delayThreshold} minutes`}
                style={{ width: '100%', accentColor: 'var(--accent)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--muted)', marginTop: 4 }}>
                <span>1 min (sensitive)</span><span>15 min (tolerant)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="zone">
        <h2 className="sh" id="how">How traffic rerouting works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
          {[
            { step: '01', title: 'Traffic monitoring',  desc: 'SDK polls real-time traffic feeds every 30–60 seconds along the remaining route' },
            { step: '02', title: 'Delay detection',     desc: `If projected delay exceeds the threshold (${delayThreshold} min), a reroute is triggered` },
            { step: '03', title: 'Route recalculation', desc: 'A new route is calculated server-side using live traffic, respecting current avoid options' },
            { step: '04', title: 'Seamless handoff',    desc: 'Guidance switches to the new route at the next safe merge point — no user action needed' },
          ].map(({ step, title, desc }) => (
            <div key={step} style={{ padding: '16px', borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.625rem', fontWeight: 800, color: 'var(--accent)', letterSpacing: '0.06em', marginBottom: 6 }}>STEP {step}</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--fg)', marginBottom: 6 }}>{title}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Code */}
      <div className="zone">
        <h2 className="sh" id="code">Implementation</h2>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {['kotlin', 'swift'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              style={{ padding: '6px 18px', borderRadius: 8, border: '1px solid var(--border)', background: activeTab === t ? 'var(--accent)' : 'var(--surface)', color: activeTab === t ? 'white' : 'var(--fg)', fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer' }}>
              {t === 'kotlin' ? 'Kotlin (Android)' : 'Swift (iOS)'}
            </button>
          ))}
        </div>
        <pre style={{ background: 'var(--code-bg, #1e1e1e)', color: '#d4d4d4', padding: 20, borderRadius: 10, fontSize: '0.8125rem', lineHeight: 1.6, overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
          <code>{activeTab === 'kotlin' ? kotlinCode : swiftCode}</code>
        </pre>
      </div>

      {/* TrafficObserver API */}
      <div className="zone">
        <h2 className="sh" id="observer">Traffic observer events</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--surface)' }}>
                {['Callback', 'Trigger', 'Typical use'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', borderBottom: '2px solid var(--border)', color: 'var(--muted)', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['onRerouteStarted()', 'Delay threshold exceeded; new route calculation begins', 'Show "Recalculating…" spinner in guidance panel'],
                ['onRerouteFinished(route)', 'New route successfully calculated', 'Update map polyline, ETA label, remaining distance'],
                ['onRerouteFailed(error)', 'Route calculation failed (no connectivity, no viable route)', 'Keep current route, optionally notify user'],
                ['onTrafficChanged(segments)', 'Traffic severity changed on remaining route segments', 'Update traffic overlay colors on map'],
                ['onETAChanged(seconds)', 'Predicted arrival time changed due to traffic conditions', 'Refresh ETA in guidance HUD'],
              ].map(([cb, trigger, use]) => (
                <tr key={cb} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: '0.8125rem', color: 'var(--accent)', whiteSpace: 'nowrap' }}>{cb}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--mid)' }}>{trigger}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--muted)' }}>{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Traffic data sources */}
      <div className="zone">
        <h2 className="sh" id="data">Traffic data sources</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
          {[
            { icon: '🛰️', title: 'Real-time flow',     desc: 'Live speed and density from probe vehicles and sensors, updated every 2 minutes' },
            { icon: '🚨', title: 'Incident data',       desc: 'Accidents, road closures, construction — sourced from authorities and crowdsourcing' },
            { icon: '📊', title: 'Historical patterns', desc: 'Day-of-week / time-of-day traffic models used when live data is unavailable' },
            { icon: '🌐', title: 'TomTom Traffic API',  desc: 'Server-side fusion of all sources into a unified traffic model for routing' },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ padding: '16px', borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', gap: 12 }}>
              <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{icon}</span>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--fg)', marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', lineHeight: 1.5 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform notes */}
      <div className="zone">
        <Callout type="info">
          <strong>Android &amp; iOS parity:</strong> Traffic-aware navigation and rerouting are fully supported on both platforms. The API surface is nearly identical — Kotlin uses observer interfaces while Swift uses delegate protocols.
        </Callout>
        <div style={{ marginTop: 12 }}>
          <Callout type="warn">
            Real-time traffic rerouting requires an active internet connection. For offline navigation, the SDK falls back to a static route without traffic updates. Configure a network-availability callback to inform users when traffic data is unavailable.
          </Callout>
        </div>
      </div>
    </div>
  );
}
