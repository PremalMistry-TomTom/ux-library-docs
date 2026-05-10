import { useState } from 'react';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import PageActions from '../components/ui/PageActions';
import { ApiLinks } from '../components/ui/ApiLinks';

const INTENT_ROUTING_APIS = [
  { name: 'Speech to Text Engine',    type: 'Android SDK', description: 'Converts spoken user input to text — the upstream producer of intent strings consumed by the routing layer.',     pageId: 'speech-to-text',         productId: 'ux-library' },
  { name: 'Navigation — Quickstart',  type: 'Android SDK', description: 'Navigation session that receives "start navigation" intents routed from the AI Assistant.',                         pageId: 'navsdk-nav-quickstart',  productId: 'navsdk' },
  { name: 'Search — Find a Location', type: 'Android SDK', description: 'Location search that fulfills destination intents — "Navigate to the nearest coffee shop."',                        pageId: 'navsdk-search-find',     productId: 'navsdk' },
  { name: 'Conversation Personality', type: 'Android SDK', description: 'Controls how fulfilled intents are confirmed back to the user — tone, phrasing, and response verbosity.',           pageId: 'ai-personality',         productId: 'ux-library' },
];

/* ─── Intent category data ───────────────────────────────────────────────────── */
const INTENTS = [
  {
    id: 'navigation',
    icon: '🗺️',
    label: 'Navigation',
    owner: 'taia',
    color: '#1E8AD4',
    ownerLabel: 'TAIA',
    examples: ['Take me home', 'Find the nearest petrol station', "What's the ETA?", 'Avoid the motorway'],
    description: 'Route planning, POI discovery, ETA queries, and manoeuvre guidance are owned entirely by TAIA. No OEM handler code is required.',
    code: null,
  },
  {
    id: 'media',
    icon: '🎵',
    label: 'Music & Media',
    owner: 'oem',
    color: '#7c3aed',
    ownerLabel: 'OEM',
    examples: ['Play something upbeat', 'Skip this track', 'Turn it up', 'Shuffle my playlist'],
    description: 'Media control intents are classified by TAIA and forwarded to your registered media domain handler.',
    code: `taia.registerDomainHandler("media") { intent ->
    val action = intent.slots["action"] // "play", "pause", "skip"
    val query  = intent.slots["query"]  // song, artist, or playlist
    mediaController.dispatch(action, query)
}`,
  },
  {
    id: 'climate',
    icon: '🌡️',
    label: 'Climate Control',
    owner: 'oem',
    color: '#059669',
    ownerLabel: 'OEM',
    examples: ['Make it warmer', 'Turn on the heated seat', 'Set temperature to 21', 'Turn off the AC'],
    description: 'Temperature, seat heating, and ventilation intents route to your climate domain handler via the same callback API.',
    code: `taia.registerDomainHandler("climate") { intent ->
    val target = intent.slots["target"] // "temperature", "seat_heat", "fan"
    val value  = intent.slots["value"]  // "21", "high", "off"
    climateController.apply(target, value)
}`,
  },
  {
    id: 'phone',
    icon: '📞',
    label: 'Phone & Messaging',
    owner: 'oem',
    color: '#d97706',
    ownerLabel: 'OEM',
    examples: ['Call Mum', 'Read my messages', 'Reply to John', 'Decline the call'],
    description: 'Telephony and messaging intents are forwarded to your communications handler. Contact resolution is performed by the OEM.',
    code: `taia.registerDomainHandler("communications") { intent ->
    val action  = intent.slots["action"]  // "call", "message", "read"
    val contact = intent.slots["contact"] // raw name — OEM resolves to contact ID
    commsController.handle(action, resolveContact(contact))
}`,
  },
  {
    id: 'vehicle',
    icon: '🚗',
    label: 'Vehicle Status',
    owner: 'oem',
    color: '#6b7280',
    ownerLabel: 'OEM',
    examples: ['How much fuel do I have?', 'Is the boot open?', "What's the tyre pressure?", 'Lock the doors'],
    description: 'Vehicle status queries and control intents reach your vehicle state handler which bridges to the CAN bus or vehicle abstraction layer.',
    code: `taia.registerDomainHandler("vehicle") { intent ->
    val query = intent.slots["query"] // "fuel", "door", "tyre_pressure"
    val state = vehicleStateManager.query(query)
    // Synthesise a spoken response and send it back via TTS
    taia.speak(formatVehicleResponse(query, state))
}`,
  },
  {
    id: 'general',
    icon: '💬',
    label: 'General Knowledge',
    owner: 'taia',
    color: '#1E8AD4',
    ownerLabel: 'TAIA',
    examples: ["What's the weather like?", 'How tall is the Eiffel Tower?', 'Convert 50 miles to km'],
    description: 'General knowledge queries are handled by TAIA Cloud with no OEM code needed. You can optionally intercept specific topics using a pre-handler.',
    code: null,
  },
];

/* ─── Routing flow diagram ───────────────────────────────────────────────────── */
function RoutingDiagram({ selected }) {
  const intent = INTENTS.find(i => i.id === selected);
  const isOEM  = intent?.owner === 'oem';
  const oemColor  = intent?.color || '#7c3aed';
  const taiaColor = '#1E8AD4';

  const node = (active, color, children) => ({
    padding: '8px 16px', borderRadius: 7, textAlign: 'center',
    fontSize: '0.75rem', fontWeight: active ? 700 : 400,
    border: `1.5px solid ${active ? color : 'var(--border)'}`,
    background: active ? `${color}18` : 'var(--bg)',
    color: active ? color : 'var(--muted)',
    transition: 'all 0.25s ease', minWidth: 110,
  });

  const arrow = (active, color) => ({
    fontSize: '1rem', transition: 'color 0.25s ease',
    color: active ? color : 'var(--border)',
  });

  const top = !!intent;

  return (
    <div style={{ padding: '20px 16px', background: 'var(--bg)', borderRadius: 20, border: '1px solid var(--border)', marginTop: 16 }}>

      {/* Row 1: Driver → STT → TAIA SDK → Classifier */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        <div style={node(top, taiaColor)}>🎤 Driver</div>
        <span style={arrow(top, taiaColor)}>→</span>
        <div style={node(top, taiaColor)}>STT Engine</div>
        <span style={arrow(top, taiaColor)}>→</span>
        <div style={node(top, taiaColor)}>TAIA SDK</div>
        <span style={arrow(top, taiaColor)}>→</span>
        <div style={node(top, taiaColor)}>Intent Classifier</div>
      </div>

      {/* Fork: two paths */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 48 }}>

        {/* TAIA path */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span style={arrow(!isOEM && top, taiaColor)}>↓</span>
          <div style={node(!isOEM && top, taiaColor)}>TAIA Cloud</div>
          <span style={arrow(!isOEM && top, taiaColor)}>↓</span>
          <div style={node(!isOEM && top, taiaColor)}>Navigation App</div>
          <div style={{ marginTop: 4, fontSize: '0.875rem', fontWeight: 600, color: !isOEM && top ? taiaColor : 'var(--border)', transition: 'color 0.25s' }}>
            TomTom owned
          </div>
        </div>

        {/* OEM path */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span style={arrow(isOEM && top, oemColor)}>↓</span>
          <div style={node(isOEM && top, oemColor)}>OEM Handler</div>
          <span style={arrow(isOEM && top, oemColor)}>↓</span>
          <div style={node(isOEM && top, oemColor)}>Vehicle Domain</div>
          <div style={{ marginTop: 4, fontSize: '0.875rem', fontWeight: 600, color: isOEM && top ? oemColor : 'var(--border)', transition: 'color 0.25s' }}>
            OEM owned
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function IntentRouting({ onNavigate }) {
  const [selected, setSelected] = useState('navigation');
  const intent = INTENTS.find(i => i.id === selected);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Intent Routing</h1>
        <PageActions />
      </div>

      <div className="quick-answer">
        TAIA classifies every utterance and routes it to the right handler — navigation stays within TAIA, everything else is forwarded to your registered OEM domain handlers via a clean callback API.
      </div>

      <ApiLinks items={INTENT_ROUTING_APIS} onNavigate={onNavigate} />

      {/* How it works */}
      <div className="zone">
        <h2 className="sh" id="ir-how">How intent routing works</h2>
        <p className="body">
          Every utterance passes through the TAIA Intent Classifier running on-device. Intents are assigned to one of two paths before any cloud call is made:
        </p>
        <table className="prop-table">
          <thead><tr><th>Path</th><th>Owner</th><th>Covers</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>TAIA path</strong></td>
              <td>TomTom</td>
              <td>Navigation, POI search, ETA, manoeuvres, general knowledge</td>
            </tr>
            <tr>
              <td><strong>OEM path</strong></td>
              <td>OEM</td>
              <td>Media, climate, phone, messaging, vehicle status, custom domains</td>
            </tr>
          </tbody>
        </table>
        <Callout type="info">
          Routing is intent-based, not keyword-based. "Play something on the radio" and "next song please" both route to the media handler regardless of phrasing — the classifier understands the underlying intent.
        </Callout>
      </div>

      {/* ── Interactive routing simulator ─────────────────────────────────────── */}
      <div className="zone">
        <h2 className="sh" id="ir-simulator">Routing simulator</h2>
        <p className="body">Select an intent category to see how it flows through the system and what handler code is needed.</p>

        {/* Category grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 7, margin: '16px 0 0' }}>
          {INTENTS.map(it => (
            <button
              key={it.id}
              onClick={() => setSelected(it.id)}
              style={{
                padding: '10px 12px', borderRadius: 20, textAlign: 'left',
                border: `1.5px solid ${selected === it.id ? it.color : 'var(--border)'}`,
                background: selected === it.id ? `${it.color}12` : 'var(--white)',
                cursor: 'pointer', transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>{it.icon}</span>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: selected === it.id ? it.color : 'var(--black)', marginBottom: 1 }}>{it.label}</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: it.color }}>{it.ownerLabel}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Routing diagram */}
        <RoutingDiagram selected={selected} />

        {/* Selected intent detail */}
        {intent && (
          <div style={{ marginTop: 14, padding: '16px', borderRadius: 20, border: `1px solid ${intent.color}35`, background: `${intent.color}08` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: '1rem' }}>{intent.icon}</span>
              <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{intent.label}</span>
              <span style={{
                fontSize: '0.875rem', fontWeight: 700, padding: '2px 7px', borderRadius: 4,
                background: `${intent.color}20`, color: intent.color,
              }}>
                {intent.ownerLabel} owned
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--mid)', margin: '0 0 10px', lineHeight: 1.55 }}>{intent.description}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: intent.code ? 14 : 0 }}>
              {intent.examples.map(ex => (
                <span key={ex} style={{ fontSize: '0.75rem', padding: '3px 9px', borderRadius: 20, background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--mid)', fontStyle: 'italic' }}>
                  "{ex}"
                </span>
              ))}
            </div>
            {intent.code && <CodeBlock language="kotlin" code={intent.code} />}
          </div>
        )}
      </div>

      {/* Registering handlers */}
      <div className="zone">
        <h2 className="sh" id="ir-register">Registering domain handlers</h2>
        <p className="body">
          Register all handlers once during application startup, before any user interaction. Each handler receives a structured <code className="ic">TaiaIntent</code> object containing the detected domain, action, and extracted slot values.
        </p>
        <CodeBlock language="kotlin" code={`// Register all OEM domain handlers at startup
taia.registerDomainHandler("media")          { intent -> mediaHandler.handle(intent) }
taia.registerDomainHandler("climate")        { intent -> climateHandler.handle(intent) }
taia.registerDomainHandler("communications") { intent -> commsHandler.handle(intent) }
taia.registerDomainHandler("vehicle")        { intent -> vehicleHandler.handle(intent) }

// Catch-all for any unregistered or future intent domains
taia.setUnhandledIntentHandler { intent ->
    Log.w("TAIA", "Unhandled: \${intent.domain}/\${intent.action}")
}`} />
        <Callout type="warn">
          Handlers are invoked on a background thread. Dispatch any UI updates to the main thread using <code className="ic">runOnUiThread</code> or a coroutine with <code className="ic">Dispatchers.Main</code>.
        </Callout>
      </div>

      {/* TaiaIntent structure */}
      <div className="zone">
        <h2 className="sh" id="ir-intent">TaiaIntent structure</h2>
        <p className="body">Every handler receives a <code className="ic">TaiaIntent</code> with the following fields.</p>
        <table className="prop-table">
          <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            {[
              ['domain',     'String',              'The registered handler name — e.g. "media", "climate"'],
              ['action',     'String',              'The specific action within the domain — e.g. "play", "skip"'],
              ['slots',      'Map<String, String>',  'Key-value pairs extracted from the utterance — e.g. "query" → "jazz"'],
              ['confidence', 'Double',              'Classifier confidence score 0.0–1.0; consider ignoring below 0.7'],
              ['rawText',    'String',              'The original STT transcript — useful for logging and debugging'],
            ].map(([f, ty, d]) => (
              <tr key={f}><td><code className="ic">{f}</code></td><td><code className="ic">{ty}</code></td><td>{d}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Custom domains */}
      <div className="zone">
        <h2 className="sh" id="ir-custom">Custom intent domains</h2>
        <p className="body">
          You can register custom domains for vehicle-specific features that TAIA does not know about out of the box — driving modes, massage seats, ambient lighting, or anything unique to your platform.
        </p>
        <CodeBlock language="kotlin" code={`// Custom domains are submitted to TomTom during integration onboarding
// with a list of training utterances. At runtime, register them identically
// to built-in domains:

taia.registerDomainHandler("comfort_mode") { intent ->
    // "Activate highway mode" → action: "activate", slots: { mode: "highway" }
    val mode = intent.slots["mode"]
    vehicleProfileManager.activateProfile(mode)
}

taia.registerDomainHandler("ambient_lighting") { intent ->
    // "Set the mood lighting to blue" → action: "set", slots: { color: "blue" }
    val color = intent.slots["color"]
    lightingController.setAmbient(color)
}`} />
        <Callout type="info">
          Custom domain utterance sets are submitted to TomTom during your integration onboarding. Contact your TomTom integration engineer to add or update training data.
        </Callout>
      </div>

      <div className="feedback-strip">
        Was this page helpful?
        <button>👍 Yes</button>
        <button>👎 No</button>
      </div>
    </div>
  );
}
