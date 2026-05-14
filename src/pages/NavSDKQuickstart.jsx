import Callout from '../components/ui/Callout';
import PageActions from '../components/ui/PageActions';

/* ─── NavSDK animated preview ───────────────────────────────────────────────── */
function NavPreview() {
  return (
    <div style={{
      width: '100%', borderRadius: 16, overflow: 'hidden',
      border: '1px solid var(--border)', background: '#0d1a28',
      position: 'relative', height: 260,
    }}>
      {/* Map backdrop */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        viewBox="0 0 480 260" preserveAspectRatio="xMidYMid slice" fill="none">
        <rect width="480" height="260" fill="#1a2535"/>
        {[60, 120, 180, 240, 300, 360, 420].map(x => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="260" stroke="rgba(255,255,255,0.04)" strokeWidth="0.8"/>
        ))}
        {[65, 130, 195].map(y => (
          <line key={`h${y}`} x1="0" y1={y} x2="480" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="0.8"/>
        ))}
        <path d="M0 130 Q120 118 240 130 T480 125" stroke="#243040" strokeWidth="9" strokeLinecap="round"/>
        <path d="M0 130 Q120 118 240 130 T480 125" stroke="#2e3f55" strokeWidth="3" strokeLinecap="round" strokeDasharray="12,8"/>
        <path d="M240 0 Q238 130 240 260" stroke="#243040" strokeWidth="8"/>
        <path d="M240 0 Q238 130 240 260" stroke="#2e3f55" strokeWidth="2" strokeDasharray="12,8"/>
        <path d="M0 65 Q140 60 240 65 T480 62" stroke="rgba(255,255,255,0.07)" strokeWidth="3" strokeLinecap="round"/>
        <path d="M0 195 Q150 190 240 195 T480 192" stroke="rgba(255,255,255,0.07)" strokeWidth="3" strokeLinecap="round"/>
        <path d="M60 195 Q160 170 240 130 T380 80" stroke="rgba(226,0,26,0.2)" strokeWidth="10" strokeLinecap="round"/>
        <path d="M60 195 Q160 170 240 130 T380 80" stroke="#e2001a" strokeWidth="3.5" strokeLinecap="round"/>
        <circle cx="60" cy="195" r="6" fill="#22c55e"/>
        <circle cx="60" cy="195" r="11" fill="rgba(34,197,94,0.2)"/>
        <circle cx="380" cy="80" r="8" fill="#e2001a"/>
        <circle cx="380" cy="80" r="14" fill="rgba(226,0,26,0.2)"/>
        <circle cx="240" cy="130" r="10" fill="#e2001a"/>
        <circle cx="240" cy="130" r="16" fill="rgba(226,0,26,0.2)"/>
        <circle cx="240" cy="130" r="10" fill="none" stroke="white" strokeWidth="1.5"/>
        <polygon points="240,113 245,124 235,124" fill="rgba(255,255,255,0.8)"/>
        <text x="120" y="122" textAnchor="middle" fill="rgba(200,210,220,0.3)" style={{ fontSize: 8 }}>Main Street</text>
        <text x="248" y="90" textAnchor="start" fill="rgba(200,210,220,0.3)" style={{ fontSize: 8 }}>Bridge Ave</text>
      </svg>

      {/* NIP */}
      <div style={{
        position: 'absolute', top: 12, left: 12, right: 12,
        background: 'rgba(16,28,48,0.94)', backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12,
        padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 36, height: 36, background: '#1a3d2b',
          border: '1px solid rgba(63,185,80,0.4)', borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e2e8f0' }}>Turn right</div>
          <div style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.45)' }}>in 400 m onto Keizersgracht</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#e2e8f0' }}>400 m</div>
          <div style={{ fontSize: '0.5625rem', color: 'rgba(255,255,255,0.35)' }}>distance</div>
        </div>
      </div>

      <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {['+', '−'].map(b => (
          <div key={b} style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.9)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 700, color: '#333', boxShadow: '0 1px 4px rgba(0,0,0,0.25)' }}>{b}</div>
        ))}
      </div>

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'rgba(8,14,26,0.95)', borderTop: '1px solid rgba(255,255,255,0.07)',
        padding: '10px 20px', display: 'flex', justifyContent: 'space-around',
      }}>
        {[['14:38', 'Arrival'], ['28 min', 'Duration'], ['11.2 km', 'Distance']].map(([v, l]) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#e2e8f0' }}>{v}</div>
            <div style={{ fontSize: '0.5625rem', color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: 56, left: 12, background: 'rgba(0,0,0,0.5)', borderRadius: 5, padding: '3px 8px', fontSize: '0.625rem', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-mono)' }}>
        NavSDK — active navigation
      </div>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────────── */
export default function NavSDKQuickstart({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Quick Start</h1>
        <PageActions />
      </div>

      <p className="quick-answer">
        Two ways to get the NavSDK running. Pick the path that suits you — both end up at the same place.
      </p>

      <Callout type="success">
        <strong>Free to start — no credit card required.</strong>{' '}
        The NavSDK includes a free tier covering 2,500 monthly active users at no cost.
        Get your API key at{' '}
        <a href="https://developer.tomtom.com" target="_blank" rel="noreferrer" style={{ color: 'inherit', fontWeight: 600 }}>developer.tomtom.com</a>
        {' '}— the same key works for both Android and iOS.
      </Callout>

      {/* Path chooser */}
      <div className="zone">
        <h2 className="sh" id="qs-choose">Choose your path</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>

          {/* Path A — Example app */}
          <div style={{
            padding: '22px 22px 18px', borderRadius: 16,
            border: '1.5px solid var(--success-border)',
            background: 'var(--success-bg)',
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                background: 'var(--success-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success-text)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--success-text)' }}>Clone the example app</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--success-text)', opacity: 0.7, marginTop: 1 }}>~5 minutes</div>
              </div>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--success-text)', lineHeight: 1.55, margin: 0, opacity: 0.9 }}>
              A fully-working navigation app is already built. Clone it, add your API key, and run. No setup from scratch.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {['Full navigation UI out of the box', 'Map, routing, search — all wired up', 'Both Android and iOS repos available', 'Explore the code as you go'].map(item => (
                <div key={item} style={{ display: 'flex', gap: 7, alignItems: 'flex-start', fontSize: '0.8125rem', color: 'var(--success-text)', opacity: 0.85 }}>
                  <span style={{ flexShrink: 0, marginTop: 1 }}>→</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate?.('navsdk-example-quickstart', 'navsdk')}
              style={{
                marginTop: 4, padding: '9px 18px', borderRadius: 10,
                border: '1.5px solid var(--success-border)', cursor: 'pointer',
                background: 'transparent', color: 'var(--success-text)',
                fontWeight: 700, fontSize: '0.875rem',
                transition: 'background 0.15s',
              }}
            >
              Clone &amp; run →
            </button>
          </div>

          {/* Path B — Build from scratch */}
          <div style={{
            padding: '22px 22px 18px', borderRadius: 16,
            border: '1.5px solid var(--border)',
            background: 'var(--surface)',
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                background: 'rgba(226,0,26,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>Build from scratch</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--mid)', marginTop: 1 }}>~15 minutes</div>
              </div>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.55, margin: 0 }}>
              Start with an empty project. Add dependencies, initialise the SDK, and display your first map — step by step.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {['Understand every line of setup', 'Gradle / SPM dependency config', 'API key injection via BuildConfig', 'Add map display and navigation'].map(item => (
                <div key={item} style={{ display: 'flex', gap: 7, alignItems: 'flex-start', fontSize: '0.8125rem', color: 'var(--mid)' }}>
                  <span style={{ flexShrink: 0, marginTop: 1 }}>→</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate?.('navsdk-project-setup', 'navsdk')}
              style={{
                marginTop: 4, padding: '9px 18px', borderRadius: 10,
                border: 'none', cursor: 'pointer',
                background: 'var(--red)', color: '#fff',
                fontWeight: 700, fontSize: '0.875rem',
                transition: 'opacity 0.15s',
              }}
            >
              Start from scratch →
            </button>
          </div>

        </div>
      </div>

      {/* What you'll build */}
      <div className="zone">
        <h2 className="sh" id="qs-preview">What you'll build</h2>
        <p className="body" style={{ marginBottom: 16 }}>
          A working navigation app with a live TomTom map, turn-by-turn guidance, and an ETA panel.
          Both paths get you here — one just takes longer.
        </p>
        <NavPreview />
      </div>
    </div>
  );
}
