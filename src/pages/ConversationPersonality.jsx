import { useState } from 'react';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import PageActions from '../components/ui/PageActions';

/* ─── Data ───────────────────────────────────────────────────────────────────── */
const TONES = [
  { id: 'professional', label: 'Professional', emoji: '💼', desc: 'Precise and formal — suited to premium brands' },
  { id: 'friendly',     label: 'Friendly',     emoji: '😊', desc: 'Warm and conversational — approachable for everyday use' },
  { id: 'concise',      label: 'Concise',      emoji: '⚡', desc: 'Minimal — just the essential information, nothing extra' },
];

const SAMPLES = {
  professional: [
    { user: 'Find a coffee shop nearby',
      bot: n => `Of course. I have located three coffee shops within 800 metres. The highest-rated is Café Nero on Market Street, 4 minutes away. Shall I set that as your destination?` },
    { user: "What's the ETA?",
      bot: n => `Based on current traffic conditions, you will arrive in approximately 14 minutes at 15:32.` },
    { user: 'Cancel the route',
      bot: n => `Route cancelled. Safe travels.` },
  ],
  friendly: [
    { user: 'Find a coffee shop nearby',
      bot: n => `Sure! I found a few nearby — Café Nero on Market Street looks great and it's only 4 minutes away. Want me to take you there?` },
    { user: "What's the ETA?",
      bot: n => `You're about 14 minutes out — should be there around 15:32 if traffic stays like this!` },
    { user: 'Cancel the route',
      bot: n => `No problem, route cancelled. Let me know if you need anything else!` },
  ],
  concise: [
    { user: 'Find a coffee shop nearby',
      bot: n => `Café Nero, Market Street. 4 min. Navigate?` },
    { user: "What's the ETA?",
      bot: n => `14 min. Arrival 15:32.` },
    { user: 'Cancel the route',
      bot: n => `Route cancelled.` },
  ],
};

const CONFIG_SCOPE = [
  { icon: '🏷️', label: 'Assistant name',     note: 'Brand-specific name users invoke and see in the UI' },
  { icon: '🎭', label: 'Response tone',       note: 'Professional, friendly, or concise response style' },
  { icon: '⏱️', label: 'Silence threshold',   note: 'Pause duration before TAIA treats an utterance as complete' },
  { icon: '🌍', label: 'Language',            note: 'Active language passed via NavigationContext locale field' },
];

/* ─── Chat preview ───────────────────────────────────────────────────────────── */
function ChatPreview({ name, tone }) {
  const samples = SAMPLES[tone];
  const initial = name.trim().charAt(0).toUpperCase() || 'T';
  return (
    <div style={{ background: '#0c1318', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', height: '100%' }}>
      <div style={{ padding: '10px 16px', background: '#171e24', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#C82020' }} />
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{name.trim() || 'TAIA'}</span>
        <span style={{ marginLeft: 'auto', fontSize: '0.625rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>live preview</span>
      </div>
      <div style={{ padding: '14px 14px', display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
        {samples.map((s, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', borderRadius: '10px 10px 2px 10px', padding: '6px 11px', fontSize: '0.75rem', maxWidth: '82%' }}>
                {s.user}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#C82020', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem', fontWeight: 700, color: '#fff', marginTop: 1 }}>
                {initial}
              </div>
              <div style={{ background: 'rgba(30,138,212,0.18)', color: 'rgba(255,255,255,0.85)', borderRadius: '2px 10px 10px 10px', padding: '6px 11px', fontSize: '0.75rem', maxWidth: '88%', lineHeight: 1.55, transition: 'all 0.2s ease' }}>
                {s.bot(name.trim() || 'TAIA')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function ConversationPersonality() {
  const [name, setName] = useState('TAIA');
  const [tone, setTone] = useState('friendly');

  const displayName = name.trim() || 'TAIA';
  const configCode = `val client = TaiaClient.Builder(context)
    .apiKey("YOUR_API_KEY")
    .endpoint("https://api.taia.tomtom.com")
    .assistantName("${displayName}")
    .responseTone(ResponseTone.${tone.toUpperCase()})
    .silenceThresholdMs(1200)
    .build()`;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Conversation Personality</h1>
        <PageActions />
      </div>

      <div className="quick-answer">
        Give TAIA your brand voice — set the assistant name, response tone, and silence threshold to match your product identity without changing the underlying AI model.
      </div>

      {/* Scope */}
      <div className="zone">
        <h2 className="sh" id="cp-scope">What you can configure</h2>
        <p className="body">
          TAIA separates the AI engine from its presentation layer. The following properties are owned entirely by the OEM and applied at client initialisation time — no changes to the core model are required.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8, margin: '12px 0' }}>
          {CONFIG_SCOPE.map(({ icon, label, note }) => (
            <div key={label} style={{ padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)' }}>
              <div style={{ fontSize: '1rem', marginBottom: 4 }}>{icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.5 }}>{note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Interactive personality builder ──────────────────────────────────── */}
      <div className="zone">
        <h2 className="sh" id="cp-builder">Personality builder</h2>
        <p className="body">Adjust the name and tone to preview how TAIA responds across common driver interactions. The generated configuration updates in real time.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20, marginTop: 16, alignItems: 'stretch' }}>

          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Name */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: 8, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Assistant name
              </div>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={24}
                placeholder="e.g. Aria, Max, Nova…"
                style={{
                  width: '100%', padding: '8px 12px', boxSizing: 'border-box',
                  border: '1.5px solid var(--border)', borderRadius: 7,
                  background: 'var(--white)', color: 'var(--black)',
                  fontSize: '0.875rem', fontFamily: 'var(--font-body)',
                  outline: 'none', transition: 'border-color 0.12s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--red)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            {/* Tone */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: 8, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Response tone
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {TONES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTone(t.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '9px 13px', borderRadius: 8, textAlign: 'left',
                      border: `1.5px solid ${tone === t.id ? 'var(--red)' : 'var(--border)'}`,
                      background: tone === t.id ? 'rgba(200,32,32,0.06)' : 'var(--white)',
                      cursor: 'pointer', transition: 'all 0.12s',
                    }}
                  >
                    <span style={{ fontSize: '1rem', flexShrink: 0 }}>{t.emoji}</span>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: tone === t.id ? 'var(--red)' : 'var(--black)', marginBottom: 1 }}>{t.label}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.4 }}>{t.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat preview */}
          <ChatPreview name={name} tone={tone} />
        </div>

        {/* Generated config */}
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: 8, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Generated configuration
          </div>
          <CodeBlock language="kotlin" code={configCode} />
        </div>
      </div>

      {/* Assistant name */}
      <div className="zone">
        <h2 className="sh" id="cp-name">Assistant name</h2>
        <p className="body">
          The assistant name appears in the TAIA UI chip, is spoken by TAIA when it self-identifies, and surfaces in any conversation history screens. Set it to match your product brand — users will see and hear this name throughout the experience.
        </p>
        <Callout type="info">
          The name can be updated at runtime by rebuilding the <code className="ic">TaiaClient</code> with a new value. This supports multi-profile vehicles where different drivers may have different assistant personas configured.
        </Callout>
      </div>

      {/* Response tone */}
      <div className="zone">
        <h2 className="sh" id="cp-tone">Response tone</h2>
        <p className="body">
          Response tone controls the verbosity and formality of TAIA's natural language output. The AI model is the same across all tones — only the response shaping layer changes.
        </p>
        <table className="prop-table">
          <thead><tr><th>Tone</th><th>Style</th><th>Typical brand fit</th></tr></thead>
          <tbody>
            {[
              ['Professional', 'Full sentences, formal vocabulary, no filler words', 'Premium and luxury brands'],
              ['Friendly',     'Conversational, contractions, light affirmations',   'Mainstream and lifestyle brands'],
              ['Concise',      'Data and action only — no pleasantries or padding',  'Performance and driver-focused brands'],
            ].map(([t, style, fit]) => (
              <tr key={t}><td><code className="ic">{t}</code></td><td>{style}</td><td>{fit}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Silence threshold */}
      <div className="zone">
        <h2 className="sh" id="cp-silence">Silence threshold</h2>
        <p className="body">
          The silence threshold controls how long TAIA waits after detecting a pause before treating the utterance as complete and dispatching it. The default is 1200 ms. Tune this for your target market — some languages and driver demographics naturally include longer pauses within a single command.
        </p>
        <CodeBlock language="kotlin" code={`val client = TaiaClient.Builder(context)
    // ...other config...
    .silenceThresholdMs(800)   // Shorter: snappier but may cut off mid-sentence
    .silenceThresholdMs(1200)  // Default: balanced
    .silenceThresholdMs(2000)  // Longer: better for deliberate or accented speech
    .build()`} />
        <table className="prop-table" style={{ marginTop: 12 }}>
          <thead><tr><th>Value</th><th>Effect</th><th>Recommended for</th></tr></thead>
          <tbody>
            {[
              ['600–900 ms',    'Very fast turn-taking, risk of clipping',        'Command-style interaction, driver-focused UX'],
              ['1000–1400 ms',  'Default balanced behaviour',                     'Most markets and demographics'],
              ['1500–2000 ms+', 'Waits longer — tolerates natural speech pauses', 'Older demographics, deliberate speech patterns'],
            ].map(([v, e, r]) => <tr key={v}><td><code className="ic">{v}</code></td><td>{e}</td><td>{r}</td></tr>)}
          </tbody>
        </table>
      </div>

      <div className="feedback-strip">
        Was this page helpful?
        <button>👍 Yes</button>
        <button>👎 No</button>
      </div>
    </div>
  );
}
