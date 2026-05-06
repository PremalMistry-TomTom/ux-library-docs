import { useTranslation } from 'react-i18next';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import PageActions from '../components/ui/PageActions';

export default function VoiceEngine() {
  const { t } = useTranslation('ai');

  const providerKeys = ['custom', 'cerence', 'alexa'];
  const reqRowKeys   = ['tts', 'wake', 'vpa', 'mqtt', 'lang'];
  const reqPri = { tts: 'P1', wake: 'P1', vpa: 'P1', mqtt: 'P2', lang: 'P1' };

  const respSteps = t('voiceEngine.respSteps', { returnObjects: true }) || [];

  return (
    <div className="page">
      <div className="page-header">
        <h1>{t('voiceEngine.title')}</h1>
        <PageActions />
      </div>

      <div className="quick-answer">
        {t('voiceEngine.intro')}
      </div>

      <div className="zone">
        <h2 className="sh" id="ve-overview">{t('voiceEngine.sections.overview')}</h2>
        <p className="body">{t('voiceEngine.overviewBody')}</p>
        <Callout type="info">{t('voiceEngine.callout')}</Callout>
      </div>

      <div className="zone">
        <h2 className="sh" id="ve-responsibilities">{t('voiceEngine.sections.responsibilities')}</h2>
        <p className="body">{t('voiceEngine.respBody')}</p>
        <ol className="body" style={{ paddingLeft: 20, lineHeight: 1.8 }}>
          {(Array.isArray(respSteps) ? respSteps : []).map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>

      <div className="zone">
        <h2 className="sh" id="ve-integration">{t('voiceEngine.sections.integration')}</h2>
        <p className="body">{t('voiceEngine.ttsBody')}</p>
        <CodeBlock tabs={['Kotlin']}>
          <pre>{`// Implement the TAIA response listener
taiaClient.setResponseListener { response ->
    // Speak the voice response
    ttsEngine.speak(
        text     = response.voiceText,
        language = Locale.ENGLISH,
        priority = TextToSpeech.QUEUE_FLUSH
    )

    // Execute any navigation UI commands in parallel
    response.uiCommands.forEach { command ->
        navigationUiController.execute(command)
    }
}`}</pre>
        </CodeBlock>
        <p className="body">{t('voiceEngine.streamBody')}</p>
        <CodeBlock tabs={['Kotlin']}>
          <pre>{`// Stream partial voice responses for lower perceived latency
taiaClient.setStreamingListener { partial ->
    if (partial.isFinal) {
        ttsEngine.speak(partial.voiceText, Locale.ENGLISH, TextToSpeech.QUEUE_ADD)
    } else {
        // Optional: pre-buffer partial tokens
        ttsEngine.preload(partial.voiceText)
    }
}`}</pre>
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="ve-providers">{t('voiceEngine.sections.providers')}</h2>
        <p className="body">{t('voiceEngine.providersBody')}</p>
        <table className="prop-table" style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th>{t('voiceEngine.providersTable.colProvider')}</th>
              <th>{t('voiceEngine.providersTable.colStatus')}</th>
              <th>{t('voiceEngine.providersTable.colNotes')}</th>
            </tr>
          </thead>
          <tbody>
            {providerKeys.map(key => {
              const status = t(`voiceEngine.providersTable.rows.${key}.status`);
              const isAvail = status === 'Available' || status === '可用';
              return (
                <tr key={key}>
                  <td style={{ fontWeight: 500 }}>{t(`voiceEngine.providersTable.rows.${key}.provider`)}</td>
                  <td>
                    <span style={{
                      fontSize: '0.625rem', fontWeight: 600, padding: '2px 8px', borderRadius: 3,
                      background: isAvail ? '#f0fdf4' : 'var(--bg)',
                      color: isAvail ? '#15803d' : 'var(--muted)',
                      border: `1px solid ${isAvail ? '#bbf7d0' : 'var(--border)'}`,
                    }}>{status}</span>
                  </td>
                  <td style={{ color: 'var(--mid)', fontSize: '0.875rem' }}>{t(`voiceEngine.providersTable.rows.${key}.notes`)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="ve-requirements">{t('voiceEngine.sections.requirements')}</h2>
        <table className="prop-table">
          <thead>
            <tr>
              <th>Requirement</th>
              <th>Priority</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {reqRowKeys.map(key => {
              const pri = reqPri[key];
              return (
                <tr key={key}>
                  <td style={{ fontWeight: 500 }}>{t(`voiceEngine.requirementsTable.rows.${key}.req`)}</td>
                  <td>
                    <span style={{
                      fontSize: '0.625rem', fontWeight: 700, padding: '2px 6px', borderRadius: 3,
                      background: pri === 'P1' ? '#fff5f5' : 'var(--bg)',
                      color: pri === 'P1' ? 'var(--red)' : 'var(--muted)',
                      border: `1px solid ${pri === 'P1' ? '#fecaca' : 'var(--border)'}`,
                    }}>{pri}</span>
                  </td>
                  <td style={{ color: 'var(--mid)', fontSize: '0.875rem' }}>{t(`voiceEngine.requirementsTable.rows.${key}.notes`)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
