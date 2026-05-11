import { useState, useEffect, useRef } from 'react';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import PageActions from '../components/ui/PageActions';

/* ─── Shared map shell ───────────────────────────────────────────────────── */
function MapShell({ height = 280, children }) {
  return (
    <div style={{
      width: '100%', height, background: '#0d1117', borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', position: 'relative',
    }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice" fill="none">
        <rect width="400" height="280" fill="#0d1117"/>
        <path d="M0 160 Q100 130 200 145 T400 130" stroke="rgba(255,255,255,0.05)" strokeWidth="10"/>
        <path d="M0 160 Q100 130 200 145 T400 130" stroke="rgba(255,255,255,0.09)" strokeWidth="2"/>
        <path d="M155 0 L150 280" stroke="rgba(255,255,255,0.05)" strokeWidth="8"/>
        <path d="M155 0 L150 280" stroke="rgba(255,255,255,0.09)" strokeWidth="1.5"/>
        <path d="M270 0 L265 280" stroke="rgba(255,255,255,0.05)" strokeWidth="8"/>
        <path d="M270 0 L265 280" stroke="rgba(255,255,255,0.09)" strokeWidth="1.5"/>
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
      <path d="M40 220 Q120 175 200 165 T370 80" stroke="rgba(226,0,26,0.18)" strokeWidth="14" strokeLinecap="round"/>
      <path d="M40 220 Q120 175 200 165 T370 80" stroke="rgba(226,0,26,0.3)" strokeWidth="3" strokeLinecap="round"/>
      {progress > 0 && (
        <path d="M40 220 Q120 175 200 165 T370 80" stroke="#e2001a" strokeWidth="3" strokeLinecap="round"
          strokeDasharray={`${done} ${totalLen}`}/>
      )}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   1. NAV QUICKSTART
   ═══════════════════════════════════════════════════════════════════════════ */

function NavQuickstartDemo() {
  const [status, setStatus] = useState('idle');
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
        if (p >= 1) { clearInterval(timerRef.current); setStatus('arrived'); return 1; }
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

const SW_NAV_QS = `import TomTomSDKNavigation
import TomTomSDKNavigationUI

let navigationController = try NavigationController(
    routePlan: routePlan,
    locationProvider: locationProvider
)
navigationController.start()

// Observe progress
navigationController.addProgressObserver(self)

extension ViewController: NavigationProgressObserver {
    func navigationController(_ controller: NavigationController,
                               didUpdateProgress progress: RouteProgress) {
        let distanceRemaining = progress.distanceToDestination
        let timeRemaining     = progress.estimatedTimeOfArrival
    }
}`;

export function NavSDKiOSNavQuickstart({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Navigation Quickstart</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Create a <code>NavigationController</code> with a planned <code>RoutePlan</code> and a
        location provider, then call <code>start()</code> to begin a guided navigation session.
      </p>

      <div className="zone">
        <h2 className="sh" id="nqs-demo">Interactive demo</h2>
        <p className="body">Tap <strong>Start Navigation</strong> to simulate a guided session with a moving vehicle and live ETA.</p>
        <NavQuickstartDemo />
      </div>

      <div className="zone">
        <h2 className="sh" id="nqs-code">Setup code</h2>
        <CodeBlock tabs={['Swift']}>
          {SW_NAV_QS}
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="nqs-lifecycle">Lifecycle</h2>
        <p className="body">
          Stop navigation when the journey completes or the user cancels. Release the
          controller in <code>deinit</code> or <code>viewDidDisappear</code> to free resources.
        </p>
        <CodeBlock tabs={['Swift']}>
          {`// Stop and clean up
navigationController.stop()

// deinit is the right place for teardown
deinit {
    navigationController.stop()
}`}
        </CodeBlock>
      </div>

      <Callout type="info">
        <code>NavigationController</code> requires a valid <code>RoutePlan</code> produced by
        <code> OnlineRouteCalculator</code>. See the Routing Quickstart page for how to plan a route first.
      </Callout>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. TURN-BY-TURN GUIDANCE
   ═══════════════════════════════════════════════════════════════════════════ */

const MANEUVERS = [
  { icon: '↖', type: 'turnLeft',       street: 'Keizersgracht',   dist: '800 m', exit: null },
  { icon: '↗', type: 'turnRight',      street: 'Prinsengracht',   dist: '1.2 km', exit: null },
  { icon: '⬆', type: 'keepRight',      street: 'A10 motorway',    dist: '500 m', exit: '14' },
  { icon: '↩', type: 'uTurn',          street: 'Vondelstraat',    dist: '200 m', exit: null },
  { icon: '↔', type: 'roundaboutExit', street: 'Overtoom',        dist: '300 m', exit: '3rd' },
];

function TurnByTurnDemo() {
  const [step, setStep] = useState(0);
  const m = MANEUVERS[step];

  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, #1a3d2b, #0d2218)',
        borderRadius: 14, padding: '16px 20px',
        border: '1px solid rgba(63,185,80,0.25)',
        display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14,
      }}>
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
            {m.type === 'roundaboutExit' ? `Take ${m.exit} exit` : m.type.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>
            {m.street}{m.exit && m.type !== 'roundaboutExit' ? ` · Exit ${m.exit}` : ''}
          </div>
        </div>
        <div style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.25)', textAlign: 'right' }}>
          <div style={{ fontWeight: 700, fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{step + 1}/{MANEUVERS.length}</div>
          maneuver
        </div>
      </div>

      <button onClick={() => setStep(s => (s + 1) % MANEUVERS.length)} style={{
        width: '100%', padding: '10px', borderRadius: 10, cursor: 'pointer',
        background: 'var(--bg)', border: '1px solid var(--border)',
        fontSize: '0.875rem', fontWeight: 600, color: 'var(--mid)',
      }}>
        Next maneuver →
      </button>

      <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 10, background: 'var(--bg)', border: '1px solid var(--border)', fontSize: '0.75rem', fontFamily: 'monospace' }}>
        <div style={{ color: 'var(--muted)', marginBottom: 6 }}>GuidanceInstruction fields</div>
        {[
          ['maneuverType', m.type],
          ['remainingDistance', m.dist],
          ['streetName', m.street],
          ['exitNumber', m.exit ?? 'nil'],
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

const SW_TBT = `navigationController.addGuidanceListener(self)

extension ViewController: GuidanceListener {
    func navigationController(_ navigationController: NavigationController,
                               didUpdateGuidanceInstruction instruction: GuidanceInstruction) {
        DispatchQueue.main.async {
            self.updateNIP(instruction: instruction)
        }
    }

    func navigationControllerDidArriveAtDestination(_ controller: NavigationController) {
        showArrivalUI()
    }
}`;

export function NavSDKiOSNavGuidance({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Turn-by-Turn Guidance</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Conform to <code>GuidanceListener</code> to receive structured manoeuvre events —
        turn type, street name, distance, and exit number — at every decision point.
      </p>

      <div className="zone">
        <h2 className="sh" id="tbt-demo">Interactive demo</h2>
        <p className="body">Cycle through manoeuvre types and inspect the corresponding <code>GuidanceInstruction</code> fields.</p>
        <TurnByTurnDemo />
      </div>

      <div className="zone">
        <h2 className="sh" id="tbt-code">Code</h2>
        <CodeBlock tabs={['Swift']}>
          {SW_TBT}
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="tbt-fields">GuidanceInstruction fields</h2>
        <table className="prop-table">
          <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            {[
              ['maneuverType',              'ManeuverType',  'turnLeft, turnRight, keepRight, roundaboutExit, uTurn, arrive, …'],
              ['remainingDistanceInMeters', 'Double',        'Distance to this maneuver from current position'],
              ['streetName',               'String?',        'Name of the road after the maneuver'],
              ['exitNumber',               'String?',        'Motorway exit number or roundabout exit ordinal'],
              ['combinedInstruction',      'Instruction?',  'Next-next instruction for lane-level guidance panels'],
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
   3. VOICE INSTRUCTIONS
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
          <path d="M40 210 Q130 170 200 155 T365 75" stroke="rgba(226,0,26,0.2)" strokeWidth="10" strokeLinecap="round"/>
          <path d="M40 210 Q130 170 200 155 T365 75" stroke="#e2001a" strokeWidth="2.5" strokeLinecap="round"/>
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

const SW_VOICE = `import AVFoundation

let synthesizer = AVSpeechSynthesizer()
navigationController.addGuidanceListener(self)

extension ViewController: GuidanceListener {
    func navigationController(_ controller: NavigationController,
                               didEmitVoiceInstruction instruction: VoiceInstruction) {
        let utterance = AVSpeechUtterance(string: instruction.message)
        utterance.voice = AVSpeechSynthesisVoice(language: "en-US")
        utterance.rate = AVSpeechUtteranceDefaultSpeechRate
        synthesizer.speak(utterance)
    }
}

// Silence during a phone call
func muteVoiceForPhoneCall() {
    synthesizer.stopSpeaking(at: .immediate)
}`;

export function NavSDKiOSNavVoice({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Voice Instructions</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Receive TTS-ready voice prompts via <code>GuidanceListener</code> and speak them with
        <code> AVSpeechSynthesizer</code> or any custom audio engine.
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
        <CodeBlock tabs={['Swift']}>
          {SW_VOICE}
        </CodeBlock>
      </div>

      <Callout type="info">
        Use <code>AVAudioSession.sharedInstance().setCategory(.playback, mode: .voicePrompt)</code>
        so voice instructions duck background audio and play correctly over CarPlay.
      </Callout>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   4. CONTINUOUS REPLANNING
   ═══════════════════════════════════════════════════════════════════════════ */

function ReplanningDemo() {
  const [phase, setPhase] = useState('onroute');
  const animRef = useRef(null);

  function goOffRoute() {
    setPhase('offroute');
    animRef.current = setTimeout(() => {
      setPhase('replanning');
      animRef.current = setTimeout(() => setPhase('newroute'), 1200);
    }, 800);
  }
  function reset() { clearTimeout(animRef.current); setPhase('onroute'); }

  useEffect(() => () => clearTimeout(animRef.current), []);

  return (
    <div>
      <MapShell height={260}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 260" fill="none">
          <path d="M40 210 Q140 165 220 150 T370 75" stroke="rgba(226,0,26,0.2)" strokeWidth="10" strokeLinecap="round"/>
          <path d="M40 210 Q140 165 220 150 T370 75"
            stroke={phase === 'newroute' ? 'rgba(226,0,26,0.25)' : '#e2001a'} strokeWidth="2.5" strokeLinecap="round"
            strokeDasharray={phase === 'offroute' || phase === 'replanning' ? '6 4' : ''}/>

          {(phase === 'offroute' || phase === 'replanning') && (
            <path d="M160 170 Q175 210 210 220 Q240 228 255 220" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 3"/>
          )}

          {phase === 'newroute' && (
            <>
              <path d="M255 220 Q290 200 320 170 T370 75" stroke="rgba(226,0,26,0.2)" strokeWidth="10" strokeLinecap="round"/>
              <path d="M255 220 Q290 200 320 170 T370 75" stroke="#e2001a" strokeWidth="2.5" strokeLinecap="round"/>
            </>
          )}

          <circle
            cx={phase === 'onroute' ? 160 : phase === 'offroute' ? 210 : 255}
            cy={phase === 'onroute' ? 170 : phase === 'offroute' ? 220 : 220}
            r="6" fill="#e2001a" stroke="#fff" strokeWidth="2"
            style={{ transition: 'cx 0.8s ease, cy 0.8s ease' }}
          />
        </svg>

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

const SW_REPLAN = `navigationController.addRouteReplanningListener(self)

extension ViewController: RouteReplanningListener {
    func navigationController(_ controller: NavigationController,
                               didReplanRoute routePlan: RoutePlan,
                               reason: ReplanningReason) {
        // Update the route polyline on the map
        updateRouteOnMap(routePlan.route)
    }

    func navigationController(_ controller: NavigationController,
                               replanningDidFailWith error: Error) {
        // Keep current route; optionally notify the user
        print("Replanning failed: \\(error)")
    }
}`;

export function NavSDKiOSNavReplanning({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Continuous Replanning</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        The navigation engine detects off-route events and automatically recalculates a new route.
        Conform to <code>RouteReplanningListener</code> to receive the updated <code>RoutePlan</code>.
      </p>

      <div className="zone">
        <h2 className="sh" id="rp-demo">Interactive demo</h2>
        <p className="body">Click <strong>Deviate from route</strong> to simulate going off-route and watch the automatic recalculation.</p>
        <ReplanningDemo />
      </div>

      <div className="zone">
        <h2 className="sh" id="rp-code">Code</h2>
        <CodeBlock tabs={['Swift']}>
          {SW_REPLAN}
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="rp-reasons">ReplanningReason values</h2>
        <table className="prop-table">
          <thead><tr><th>Reason</th><th>Description</th></tr></thead>
          <tbody>
            {[
              ['.deviation',    'Driver went off the planned route geometry'],
              ['.trafficDelay', 'Significant traffic delay detected ahead on current route'],
              ['.manual',       'Application requested a reroute programmatically'],
            ].map(([r, d]) => (
              <tr key={r}><td><code style={{ fontSize: '0.75rem' }}>{r}</code></td><td style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>{d}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   5. SAFETY LOCATIONS
   ═══════════════════════════════════════════════════════════════════════════ */

const SAFETY_ICONS = { speedCamera: '📷', dangerZone: '⚠️', schoolZone: '🏫' };
const SAFETY_COLORS = { speedCamera: '#f59e0b', dangerZone: '#ef4444', schoolZone: '#10b981' };

const CAMERAS = [
  { id: 0, type: 'speedCamera', cx: 120, cy: 160, dist: 800 },
  { id: 1, type: 'dangerZone',  cx: 220, cy: 135, dist: 1600 },
  { id: 2, type: 'schoolZone',  cx: 300, cy: 105, dist: 2800 },
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
          <circle cx="40" cy="210" r="6" fill="#e2001a" stroke="#fff" strokeWidth="2"/>
        </svg>

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
              {current.type.replace(/([A-Z])/g, ' $1').trim()}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--mid)' }}>
              {current.dist} m ahead · Alert fires at 500 m
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

const SW_SAFETY = `navigationController.addSafetyLocationListener(self)

extension ViewController: SafetyLocationListener {
    func navigationController(_ controller: NavigationController,
                               didUpdateSafetyLocation warning: SafetyLocationWarning) {
        switch warning.safetyLocationType {
        case .speedCamera:
            let dist  = warning.distanceToWarningInMeters
            let limit = warning.speedLimit
            showCameraAlert(dist, limit)
        case .dangerZone:
            showDangerZoneAlert(warning.distanceToWarningInMeters)
        case .schoolZone:
            showSchoolZoneAlert(warning.distanceToWarningInMeters)
        }
    }
}

// Configure alert distances
let config = SafetyLocationConfiguration(
    speedCameraAlertDistanceInMeters: 500,
    dangerZoneAlertDistanceInMeters: 300
)
navigationController.safetyLocationConfiguration = config`;

export function NavSDKiOSNavSafety({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Safety Locations</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Conform to <code>SafetyLocationListener</code> to receive advance alerts for speed cameras,
        danger zones, and school zones along the active route.
      </p>

      <div className="zone">
        <h2 className="sh" id="sl-demo">Interactive demo</h2>
        <p className="body">Tap a safety icon on the route to inspect its type and alert distance.</p>
        <SafetyDemo />
      </div>

      <div className="zone">
        <h2 className="sh" id="sl-types">Safety location types</h2>
        <table className="prop-table">
          <thead><tr><th>Type</th><th>Swift enum case</th><th>Description</th></tr></thead>
          <tbody>
            {[
              ['Speed camera',  '.speedCamera', 'Fixed or mobile speed enforcement camera'],
              ['Danger zone',   '.dangerZone',  'High-risk road section with speed enforcement'],
              ['School zone',   '.schoolZone',  'Reduced speed zone near a school'],
            ].map(([t, c, d]) => (
              <tr key={t}><td style={{ fontWeight: 600 }}>{t}</td><td><code style={{ fontSize: '0.75rem' }}>{c}</code></td><td style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>{d}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="sl-code">Code</h2>
        <CodeBlock tabs={['Swift']}>
          {SW_SAFETY}
        </CodeBlock>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   6. CARPLAY
   ═══════════════════════════════════════════════════════════════════════════ */

function CarPlayDemo() {
  const [connected, setConnected] = useState(false);
  const [navActive, setNavActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);

  function connect() { setConnected(true); }
  function startNav() {
    setNavActive(true);
    setProgress(0);
    timerRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 1) { clearInterval(timerRef.current); return 1; }
        return p + 0.025;
      });
    }, 80);
  }
  function disconnect() {
    clearInterval(timerRef.current);
    setConnected(false);
    setNavActive(false);
    setProgress(0);
  }

  useEffect(() => () => clearInterval(timerRef.current), []);

  return (
    <div>
      {/* CarPlay screen mock */}
      <div style={{
        width: '100%', aspectRatio: '16/9', background: '#0a0f18', borderRadius: 16,
        border: `2px solid ${connected ? 'rgba(226,0,26,0.5)' : 'rgba(255,255,255,0.1)'}`,
        overflow: 'hidden', position: 'relative', transition: 'border-color 0.3s',
      }}>
        {/* Status bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 28,
          background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 14px',
          fontSize: '0.625rem', color: 'rgba(255,255,255,0.5)',
        }}>
          <span>{connected ? '● CarPlay Connected' : '○ CarPlay'}</span>
          <span>14:32</span>
        </div>

        {/* Map area */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 225" fill="none">
          <rect width="400" height="225" fill="#0a0f18"/>
          <path d="M0 130 Q100 105 200 120 T400 110" stroke="rgba(255,255,255,0.05)" strokeWidth="14"/>
          <path d="M0 130 Q100 105 200 120 T400 110" stroke="rgba(255,255,255,0.09)" strokeWidth="3"/>
          <path d="M160 0 L155 225" stroke="rgba(255,255,255,0.05)" strokeWidth="10"/>
          <path d="M160 0 L155 225" stroke="rgba(255,255,255,0.08)" strokeWidth="2"/>

          {navActive && (
            <>
              <path d="M40 175 Q120 145 200 135 T365 65" stroke="rgba(226,0,26,0.2)" strokeWidth="12" strokeLinecap="round"/>
              <path d="M40 175 Q120 145 200 135 T365 65" stroke="#e2001a" strokeWidth="2.5" strokeLinecap="round"
                strokeDasharray={`${progress * 320} 320`}/>
              <circle
                cx={40 + progress * 325}
                cy={175 - progress * 110}
                r="6" fill="#e2001a" stroke="#fff" strokeWidth="2"
                style={{ transition: 'cx 0.08s, cy 0.08s' }}
              />
            </>
          )}
        </svg>

        {/* NIP panel */}
        {navActive && progress < 1 && (
          <div style={{
            position: 'absolute', top: 32, left: 10,
            background: 'rgba(15,26,40,0.95)', borderRadius: 10,
            padding: '8px 12px', border: '1px solid rgba(255,255,255,0.12)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{ fontSize: '1.25rem' }}>↖</div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>Keizersgracht</div>
              <div style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.5)' }}>
                {Math.round((1 - progress) * 800)} m
              </div>
            </div>
          </div>
        )}

        {progress >= 1 && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(10,16,28,0.85)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <div style={{ fontSize: '1.5rem' }}>📍</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>Arrived</div>
          </div>
        )}

        {!connected && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 8,
          }}>
            <div style={{ fontSize: '2rem' }}>🚗</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Connect CarPlay to begin</div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        {!connected ? (
          <button onClick={connect} style={{
            flex: 1, padding: '9px', borderRadius: 10, cursor: 'pointer',
            background: '#fff5f5', border: '1px solid #e2001a',
            color: '#e2001a', fontSize: '0.875rem', fontWeight: 600,
          }}>Connect CarPlay</button>
        ) : (
          <>
            <button onClick={startNav} disabled={navActive} style={{
              flex: 1, padding: '9px', borderRadius: 10, cursor: navActive ? 'not-allowed' : 'pointer',
              background: navActive ? 'var(--bg)' : '#fff5f5',
              border: `1px solid ${navActive ? 'var(--border)' : '#e2001a'}`,
              color: navActive ? 'var(--muted)' : '#e2001a',
              fontSize: '0.875rem', fontWeight: 600, opacity: navActive ? 0.5 : 1,
            }}>Start route</button>
            <button onClick={disconnect} style={{
              padding: '9px 16px', borderRadius: 10, cursor: 'pointer',
              background: 'var(--bg)', border: '1px solid var(--border)',
              fontSize: '0.875rem', color: 'var(--mid)',
            }}>Disconnect</button>
          </>
        )}
      </div>
    </div>
  );
}

const SW_CARPLAY = `import CarPlay

class CarPlaySceneDelegate: UIResponder, CPTemplateApplicationSceneDelegate {
    var interfaceController: CPInterfaceController?
    var navigationSession: CPNavigationSession?

    func templateApplicationScene(_ scene: CPTemplateApplicationScene,
                                  didConnect interfaceController: CPInterfaceController) {
        self.interfaceController = interfaceController
        let mapTemplate = CPMapTemplate()
        mapTemplate.mapDelegate = self
        interfaceController.setRootTemplate(mapTemplate,
                                            animated: false,
                                            completion: nil)
    }

    func templateApplicationScene(_ scene: CPTemplateApplicationScene,
                                  didDisconnect interfaceController: CPInterfaceController) {
        navigationSession?.finishTrip()
        self.interfaceController = nil
    }
}

// Start a navigation trip on CarPlay
extension CarPlaySceneDelegate: CPMapTemplateDelegate {
    func startNavigation(route: CPRoute, mapTemplate: CPMapTemplate) {
        let trip = CPTrip(origin: route.origin,
                         destination: route.destination,
                         routeChoices: [CPRouteChoice(summaryVariants: ["Fastest"])])
        navigationSession = mapTemplate.startNavigationSession(for: trip)
    }
}`;

export function NavSDKiOSNavCarPlay({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>CarPlay Navigation</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Implement <code>CPTemplateApplicationSceneDelegate</code> to connect your navigation app
        to CarPlay. Use <code>CPMapTemplate</code> and <code>CPNavigationSession</code> to display
        route guidance on the vehicle's built-in display.
      </p>

      <div className="zone">
        <h2 className="sh" id="cp-demo">Interactive demo</h2>
        <p className="body">Simulate a CarPlay connection and start a navigation session on the in-car display.</p>
        <CarPlayDemo />
      </div>

      <div className="zone">
        <h2 className="sh" id="cp-code">Setup code</h2>
        <CodeBlock tabs={['Swift']}>
          {SW_CARPLAY}
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="cp-entitlement">Entitlements</h2>
        <p className="body">
          CarPlay navigation requires the <strong>Navigation App</strong> entitlement from Apple.
          Add it to your provisioning profile and include the key in your entitlements file.
        </p>
        <CodeBlock tabs={['Swift']}>
          {`// Entitlements file (MyApp.entitlements)
// com.apple.developer.carplay-maps   → YES

// Info.plist
// UIApplicationSceneManifest → scenes include CPTemplateApplicationSceneSessionRoleApplication`}
        </CodeBlock>
      </div>

      <Callout type="warn">
        The CarPlay navigation entitlement must be requested from Apple before it appears in
        the developer portal. Entitlement approval is required for App Store submission.
      </Callout>
    </div>
  );
}
