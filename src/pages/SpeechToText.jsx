import { useTranslation } from 'react-i18next';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';

/* ─── Boundary diagram ───────────────────────────────────────────────────────── */
const M = {
  bg:    '#0f1117',
  card:  '#1a1d27',
  line:  '#2a2a3a',
  text:  '#e2e8f0',
  dim:   '#94a3b8',
  muted: '#64748b',
  blue:  '#93c5fd',
  teal:  '#5eead4',
  amber: '#fbbf24',
};

export function BoundaryDiagram() {
  return (
    <div style={{ margin: '24px 0', overflowX: 'auto' }}>
      <svg viewBox="0 0 600 140" style={{ width: '100%', maxWidth: 600, display: 'block', background: M.bg, borderRadius: 10, border: `1px solid ${M.line}` }}>

        {/* OEM side */}
        <rect x="10" y="15" width="280" height="110" rx="6" fill="none" stroke="#2a3a4a" strokeWidth="1" strokeDasharray="4 3" />
        <text x="150" y="29" textAnchor="middle" fill="#3a5a7a" fontSize="9" fontFamily="system-ui">OEM / Integrator</text>

        {/* TAIA side */}
        <rect x="310" y="15" width="278" height="110" rx="6" fill="none" stroke="#2a4a2a" strokeWidth="1" strokeDasharray="4 3" />
        <text x="449" y="29" textAnchor="middle" fill="#2a5a2a" fontSize="9" fontFamily="system-ui">TomTom TAIA</text>

        {/* Mic */}
        <circle cx="50" cy="80" r="16" fill="#1e293b" stroke={M.line} strokeWidth="1.5" />
        <text x="50" y="76" textAnchor="middle" dominantBaseline="middle" fontSize="13">🎤</text>
        <text x="50" y="104" textAnchor="middle" fill={M.dim} fontSize="8" fontFamily="system-ui">Audio</text>

        {/* STT box */}
        <rect x="85" y="62" width="90" height="36" rx="5" fill="#1a2535" stroke="#2a3a5a" strokeWidth="1.5" />
        <text x="130" y="76" textAnchor="middle" dominantBaseline="middle" fill={M.blue} fontSize="10" fontWeight="600" fontFamily="system-ui">STT Engine</text>
        <text x="130" y="89" textAnchor="middle" dominantBaseline="middle" fill={M.muted} fontSize="8" fontFamily="system-ui">OEM provided</text>

        {/* Arrow: mic → STT */}
        <line x1="67" y1="80" x2="83" y2="80" stroke={M.dim} strokeWidth="1.5" markerEnd="url(#arr)" />

        {/* VPA box */}
        <rect x="195" y="62" width="90" height="36" rx="5" fill="#1a2535" stroke="#2a3a5a" strokeWidth="1.5" />
        <text x="240" y="76" textAnchor="middle" dominantBaseline="middle" fill={M.blue} fontSize="10" fontWeight="600" fontFamily="system-ui">VPA Cloud</text>
        <text x="240" y="89" textAnchor="middle" dominantBaseline="middle" fill={M.muted} fontSize="8" fontFamily="system-ui">domain routing</text>

        {/* Arrow: STT → VPA */}
        <line x1="176" y1="80" x2="193" y2="80" stroke={M.dim} strokeWidth="1.5" markerEnd="url(#arr)" />
        <text x="184" y="74" textAnchor="middle" fill={M.muted} fontSize="7.5" fontFamily="system-ui">text</text>

        {/* TAIA SDK box */}
        <rect x="320" y="62" width="100" height="36" rx="5" fill="#1e2535" stroke="#3a4a6a" strokeWidth="1.5" />
        <text x="370" y="76" textAnchor="middle" dominantBaseline="middle" fill={M.teal} fontSize="10" fontWeight="600" fontFamily="system-ui">TAIA SDK</text>
        <text x="370" y="89" textAnchor="middle" dominantBaseline="middle" fill={M.muted} fontSize="8" fontFamily="system-ui">on-device</text>

        {/* Arrow: VPA → TAIA SDK */}
        <line x1="286" y1="80" x2="318" y2="80" stroke={M.amber} strokeWidth="2" markerEnd="url(#arramber)" />
        <text x="302" y="74" textAnchor="middle" fill={M.amber} fontSize="7.5" fontFamily="system-ui" fontWeight="600">transcript</text>

        {/* TAIA Cloud box */}
        <rect x="440" y="62" width="100" height="36" rx="5" fill="#152030" stroke="#1e4a6a" strokeWidth="1.5" />
        <text x="490" y="76" textAnchor="middle" dominantBaseline="middle" fill={M.teal} fontSize="10" fontWeight="600" fontFamily="system-ui">TAIA Cloud</text>
        <text x="490" y="89" textAnchor="middle" dominantBaseline="middle" fill={M.muted} fontSize="8" fontFamily="system-ui">POST /chat</text>

        {/* Arrow: SDK → Cloud */}
        <line x1="421" y1="80" x2="438" y2="80" stroke={M.teal} strokeWidth="1.5" markerEnd="url(#arrteal)" />

        {/* Arrow markers */}
        <defs>
          <marker id="arr" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L7,3 z" fill={M.dim} />
          </marker>
          <marker id="arramber" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L7,3 z" fill={M.amber} />
          </marker>
          <marker id="arrteal" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L7,3 z" fill={M.teal} />
          </marker>
        </defs>

        {/* Boundary label */}
        <line x1="300" y1="20" x2="300" y2="120" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" />
        <text x="300" y="14" textAnchor="middle" fill="#ef4444" fontSize="8" fontFamily="system-ui" fontWeight="600">TAIA boundary</text>
      </svg>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function SpeechToText() {
  const { t } = useTranslation('ai');
  const reqRowKeys = ['stt', 'wake', 'final', 'lang', 'rephrased', 'conv'];
  const reqPri = { stt: 'P1', wake: 'P1', final: 'P1', lang: 'P1', rephrased: 'P2', conv: 'P2' };
  const wakePoints = t('speechToText.wakePoints', { returnObjects: true }) || [];

  return (
    <div className="page">
      <div className="page-header">
        <h1>{t('speechToText.title')}</h1>
        <div className="page-meta">
          <span className="meta-tag">{t('speechToText.badge')}</span>
        </div>
      </div>

      <div className="quick-answer">
        {t('speechToText.intro')}
      </div>

      <div className="zone">
        <h2 className="sh" id="stt-overview">{t('speechToText.sections.overview')}</h2>
        <p className="body">
          The diagram below shows where the STT boundary lies. Everything to the left of the red
          dashed line is owned by the integrator. TAIA only receives the text transcript — it has
          no awareness of the audio, the microphone, or the wake word that triggered the interaction.
        </p>
        <BoundaryDiagram />
        <p className="body">
          This design gives you full control over STT provider, audio quality settings, noise
          cancellation, and language model customisation without any dependency on TomTom.
        </p>
      </div>

      <div className="zone">
        <h2 className="sh" id="stt-boundary">{t('speechToText.sections.boundary')}</h2>
        <p className="body">
          TAIA&apos;s <code>POST /chat</code> endpoint accepts a structured JSON body. The
          driver&apos;s utterance is passed as the <code>utterance</code> field — a plain text
          string produced by your STT engine:
        </p>
        <CodeBlock tabs={['Kotlin']}>
          <pre>{`// Build the TAIA chat request from an STT result
val chatRequest = TaiaChatRequest(
    utterance      = sttResult.transcript,          // plain text from your STT engine
    rephrasedQuery = vpaCloud.rephrasedInstruction, // optional VPA-processed version
    context        = buildNavigationContext(),
    conversationId = session.conversationId
)

taiaClient.chat(chatRequest) { response ->
    ttsEngine.speak(response.voiceText)
    navigationUiController.execute(response.uiCommands)
}`}</pre>
        </CodeBlock>
        <Callout type="info">
          The <code>rephrasedQuery</code> field is optional. When present, it is the VPA
          cloud&apos;s rephrased version of the utterance after domain arbitration — for example,
          stripping filler words or resolving ambiguous references like "there" or "that place".
        </Callout>
      </div>

      <div className="zone">
        <h2 className="sh" id="stt-integration">{t('speechToText.sections.integration')}</h2>
        <p className="body">
          The recommended pattern is to implement a <code>SpeechRecognitionListener</code> in your
          VPA layer and forward the final result to TAIA via the SDK:
        </p>
        <CodeBlock tabs={['Kotlin']}>
          <pre>{`class NavigationVoiceHandler(
    private val taiaClient: TaiaClient,
    private val contextProvider: NavigationContextProvider
) : SpeechRecognitionListener {

    override fun onSpeechRecognised(result: SpeechResult) {
        if (!result.isNavigationIntent) return   // VPA domain routing

        val request = TaiaChatRequest(
            utterance = result.transcript,
            context   = contextProvider.current()
        )

        taiaClient.chat(request) { response ->
            ttsEngine.speak(response.voiceText)
            navigationUiController.execute(response.uiCommands)
        }
    }

    override fun onError(error: SpeechError) {
        ttsEngine.speak("Sorry, I didn't catch that.")
    }
}`}</pre>
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="stt-wake">{t('speechToText.sections.wake')}</h2>
        <p className="body">{t('speechToText.wakeBody')}</p>
        <ul className="body" style={{ paddingLeft: 20, lineHeight: 1.8 }}>
          {(Array.isArray(wakePoints) ? wakePoints : []).map((pt, i) => <li key={i}>{pt}</li>)}
        </ul>
      </div>

      <div className="zone">
        <h2 className="sh" id="stt-requirements">{t('speechToText.sections.requirements')}</h2>
        <table className="prop-table">
          <thead><tr><th>Requirement</th><th>Priority</th><th>Notes</th></tr></thead>
          <tbody>
            {reqRowKeys.map(key => {
              const pri = reqPri[key];
              return (
                <tr key={key}>
                  <td style={{ fontWeight: 500 }}>{t(`speechToText.requirementsTable.rows.${key}.req`)}</td>
                  <td>
                    <span style={{
                      fontSize: '0.68rem', fontWeight: 700, padding: '2px 6px', borderRadius: 3,
                      background: pri === 'P1' ? '#fff5f5' : 'var(--bg)',
                      color: pri === 'P1' ? 'var(--red)' : 'var(--muted)',
                      border: `1px solid ${pri === 'P1' ? '#fecaca' : 'var(--border)'}`,
                    }}>{pri}</span>
                  </td>
                  <td style={{ color: 'var(--mid)', fontSize: '0.82rem' }}>{t(`speechToText.requirementsTable.rows.${key}.notes`)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
