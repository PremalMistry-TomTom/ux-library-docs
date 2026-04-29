import { useTranslation } from 'react-i18next';
import Callout from '../components/ui/Callout';

/* ─── Architecture diagram — CSS stack (same pattern as ADAS) ────────────── */
export function ArchDiagram() {
  return (
    <div className="adas-stack" style={{ maxWidth: 580, margin: '20px 0' }}>

      {/* Input */}
      <div className="adas-stack-layer adas-stack-muted" style={{ borderRadius: '8px 8px 0 0' }}>
        <div className="adas-stack-text">
          <span className="adas-stack-label">Driver voice input</span>
          <span className="adas-stack-note">Spoken utterance to the vehicle</span>
        </div>
      </div>
      <div className="adas-stack-arrow">↓</div>

      {/* OEM: STT Engine */}
      <div className="adas-stack-layer">
        <div className="adas-stack-text">
          <span className="adas-stack-label">STT Engine</span>
          <span className="adas-stack-note">Converts speech to a text transcript</span>
        </div>
        <span className="adas-stack-badge adas-stack-badge-oem">OEM</span>
      </div>
      <div className="adas-stack-arrow">↓</div>

      {/* OEM: VPA Cloud */}
      <div className="adas-stack-layer adas-stack-oem">
        <div className="adas-stack-text">
          <span className="adas-stack-label">VPA Cloud</span>
          <span className="adas-stack-note">Routes intent to the navigation domain</span>
        </div>
        <span className="adas-stack-badge adas-stack-badge-oem">OEM</span>
      </div>
      <div className="adas-stack-arrow">↓</div>

      {/* TomTom: TAIA SDK */}
      <div className="adas-stack-layer adas-stack-highlight">
        <div className="adas-stack-text">
          <span className="adas-stack-label">TAIA SDK</span>
          <span className="adas-stack-note">On-device bridge — packages utterance with live navigation context</span>
        </div>
        <span className="adas-stack-badge adas-stack-badge-tt">TomTom</span>
      </div>
      <div className="adas-stack-arrow">↓</div>

      {/* TomTom: TAIA Cloud */}
      <div className="adas-stack-layer adas-stack-highlight" style={{ borderRadius: '0 0 8px 8px' }}>
        <div className="adas-stack-text">
          <span className="adas-stack-label">TAIA Cloud</span>
          <span className="adas-stack-note">Processes intent, generates UI commands and voice response</span>
        </div>
        <span className="adas-stack-badge adas-stack-badge-tt">TomTom</span>
      </div>
      <div className="adas-stack-arrow">↓</div>

      {/* Outputs — parallel */}
      <div className="adas-stack-outputs">
        <div className="adas-stack-output adas-stack-output-tt">
          <span className="adas-stack-label">Navigation App</span>
          <span className="adas-stack-note">Executes UI commands</span>
          <span className="adas-stack-badge adas-stack-badge-tt">TomTom</span>
        </div>
        <div className="adas-stack-output adas-stack-output-oem">
          <span className="adas-stack-label">TTS Engine</span>
          <span className="adas-stack-note">Speaks the voice response</span>
          <span className="adas-stack-badge adas-stack-badge-oem">OEM</span>
        </div>
      </div>

    </div>
  );
}

function CapabilityGrid({ capabilities }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '8px', margin: '16px 0' }}>
      {capabilities.map((cap, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '7px 10px', background: 'var(--bg)',
          border: '1px solid var(--border)', borderRadius: 6,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal, #5eead4)', flexShrink: 0 }} />
          <span style={{ fontSize: '0.82rem', color: 'var(--text)' }}>{cap}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function TAIAOverview() {
  const { t } = useTranslation('ai');

  const scopeRowKeys = ['wakeWord', 'stt', 'tts', 'intent', 'voiceResp', 'uiCmd', 'brand', 'nonNav', 'domain'];
  const taiaCols = { wakeWord: '✗', stt: '✗', tts: '✗', intent: '✓', voiceResp: '✓', uiCmd: '✓', brand: '✗', nonNav: '✗', domain: '✗' };
  const oemCols  = { wakeWord: '✓', stt: '✓', tts: '✓', intent: '✗', voiceResp: '✗', uiCmd: '✗', brand: '✓', nonNav: '✓', domain: '✓' };

  const reqRowKeys = ['sdk', 'apiKey', 'stt', 'tts', 'vpa', 'context', 'internet', 'lang'];

  const capabilities = t('overview.capList', { returnObjects: true }) || [];

  return (
    <div className="page">
      <div className="page-header">
        <h1>{t('overview.title')}</h1>
        <div className="page-meta">
          <span className="meta-tag">{t('overview.badge')}</span>
        </div>
      </div>

      <div className="quick-answer">
        {t('overview.intro')}
      </div>

      <div className="zone">
        <h2 className="sh" id="ai-overview">{t('overview.sections.overview')}</h2>
        <p className="body">{t('overview.overviewBody')}</p>
        <Callout type="info">{t('overview.cloudCallout')}</Callout>
      </div>

      <div className="zone">
        <h2 className="sh" id="ai-architecture">{t('overview.sections.architecture')}</h2>
        <ArchDiagram />
      </div>

      <div className="zone">
        <h2 className="sh" id="ai-scope">{t('overview.sections.scope')}</h2>
        <p className="body">{t('overview.scopeIntro')}</p>
        <table className="prop-table" style={{ marginTop: 16 }}>
          <thead>
            <tr>
              <th>{t('overview.scopeTable.colArea')}</th>
              <th>{t('overview.scopeTable.colTaia')}</th>
              <th>{t('overview.scopeTable.colOem')}</th>
              <th>{t('overview.scopeTable.colNotes')}</th>
            </tr>
          </thead>
          <tbody>
            {scopeRowKeys.map(key => (
              <tr key={key}>
                <td style={{ fontWeight: 500 }}>{t(`overview.scopeTable.rows.${key}.area`)}</td>
                <td style={{ textAlign: 'center', fontSize: '1rem', color: taiaCols[key] === '✓' ? 'var(--green, #22c55e)' : 'var(--muted)' }}>{taiaCols[key]}</td>
                <td style={{ textAlign: 'center', fontSize: '1rem', color: oemCols[key] === '✓' ? 'var(--green, #22c55e)' : 'var(--muted)' }}>{oemCols[key]}</td>
                <td style={{ color: 'var(--mid)', fontSize: '0.82rem' }}>{t(`overview.scopeTable.rows.${key}.notes`)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="ai-capabilities">{t('overview.sections.capabilities')}</h2>
        <p className="body">{t('overview.capabilitiesIntro')}</p>
        <CapabilityGrid capabilities={Array.isArray(capabilities) ? capabilities : []} />
      </div>

      <div className="zone">
        <h2 className="sh" id="ai-requirements">{t('overview.sections.requirements')}</h2>
        <table className="prop-table">
          <thead>
            <tr>
              <th>{t('overview.requirementsTable.colReq')}</th>
              <th>{t('overview.requirementsTable.colPri')}</th>
              <th>{t('overview.requirementsTable.colNotes')}</th>
            </tr>
          </thead>
          <tbody>
            {reqRowKeys.map(key => (
              <tr key={key}>
                <td style={{ fontWeight: 500 }}>{t(`overview.requirementsTable.rows.${key}.req`)}</td>
                <td>
                  <span style={{
                    fontSize: '0.68rem', fontWeight: 700, padding: '2px 6px', borderRadius: 3,
                    background: '#fff5f5', color: 'var(--red)', border: '1px solid #fecaca',
                  }}>P1</span>
                </td>
                <td style={{ color: 'var(--mid)', fontSize: '0.82rem' }}>{t(`overview.requirementsTable.rows.${key}.notes`)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
