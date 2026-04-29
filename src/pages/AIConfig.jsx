import { useTranslation } from 'react-i18next';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';

/* ─── Navigation context fields ─────────────────────────────────────────────── */
const CONTEXT_FIELDS = [
  { field: 'currentRoute',        type: 'Route?',           required: true,  desc: 'Active route object including waypoints, remaining distance, and ETA' },
  { field: 'vehiclePosition',     type: 'GeoPoint',         required: true,  desc: 'Current GPS location of the vehicle' },
  { field: 'vehicleHeading',      type: 'Double',           required: false, desc: 'Bearing in degrees (0–360); improves re-routing accuracy' },
  { field: 'vehicleSpeed',        type: 'Double',           required: false, desc: 'Current speed in km/h; used for speed-aware responses' },
  { field: 'savedLocations',      type: 'List<Location>',   required: true,  desc: 'Home, work, and user favourites; enables "take me home" commands' },
  { field: 'vehicleType',         type: 'VehicleType',      required: false, desc: 'CAR, TRUCK, EV — affects routing options offered by TAIA' },
  { field: 'batteryLevel',        type: 'Double?',          required: false, desc: 'State of charge 0–100 for EV routing capability' },
  { field: 'rangeEstimate',       type: 'Double?',          required: false, desc: 'Estimated remaining range in km; used for EV charging stop suggestions' },
  { field: 'recentDestinations',  type: 'List<Location>',   required: false, desc: 'Recently visited places; helps resolve ambiguous requests' },
  { field: 'mapRegion',           type: 'BoundingBox',      required: false, desc: 'Currently visible map region; used for contextual POI search' },
];

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function AIConfig() {
  const { t } = useTranslation('ai');

  return (
    <div className="page">
      <div className="page-header">
        <h1>{t('config.title')}</h1>
        <div className="page-meta">
          <span className="meta-tag">{t('config.badge')}</span>
        </div>
      </div>

      <div className="quick-answer">
        {t('config.intro')}
      </div>

      <div className="zone">
        <h2 className="sh" id="ac-overview">{t('config.sections.overview')}</h2>
        <p className="body">
          The TAIA SDK is the on-device bridge between your VPA and the TAIA cloud service. It
          handles authentication, request serialisation, MQTT event delivery for streaming
          intermediate results, and response deserialisation. Configuration is minimal — you
          provide an API key, an endpoint, and a navigation context builder.
        </p>
      </div>

      <div className="zone">
        <h2 className="sh" id="ac-dependency">{t('config.sections.dependency')}</h2>
        <p className="body">
          Add the TAIA SDK to your module&apos;s <code>build.gradle.kts</code>:
        </p>
        <CodeBlock tabs={['Kotlin']}>
          <pre>{`dependencies {
    implementation("com.tomtom.sdk.taia:taia-sdk:2.2.0")
}`}</pre>
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="ac-init">{t('config.sections.init')}</h2>
        <p className="body">
          Create a single <code>TaiaClient</code> instance at application start. It is safe to
          reuse across the application lifecycle.
        </p>
        <CodeBlock tabs={['Kotlin']}>
          <pre>{`val taiaClient = TaiaClient.Builder(context)
    .apiKey(BuildConfig.TAIA_API_KEY)
    .endpoint("https://api.tomtom.com/taia/v1/chat")
    .build()`}</pre>
        </CodeBlock>
        <Callout type="warn">
          Store your API key in <code>local.properties</code> or a secrets manager — never
          hard-code it in source files or commit it to version control.
        </Callout>
        <p className="body" style={{ marginTop: 16 }}>
          The client must be closed when the application terminates to release MQTT resources:
        </p>
        <CodeBlock tabs={['Kotlin']}>
          <pre>{`override fun onDestroy() {
    super.onDestroy()
    taiaClient.close()
}`}</pre>
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="ac-context">{t('config.sections.context')}</h2>
        <p className="body">
          Navigation context is passed with every <code>chat()</code> call. It gives TAIA the
          situational awareness needed to respond correctly — without it, TAIA cannot offer
          route alternatives, locate the vehicle on the map, or recall saved places.
        </p>
        <p className="body">
          Build the context immediately before each request to ensure it reflects the current
          vehicle state:
        </p>
        <CodeBlock tabs={['Kotlin']}>
          <pre>{`fun buildNavigationContext(): NavigationContext {
    return NavigationContext(
        currentRoute       = routeManager.activeRoute,
        vehiclePosition    = locationProvider.lastKnownLocation,
        vehicleHeading     = locationProvider.lastKnownBearing,
        vehicleSpeed       = vehicleSensors.currentSpeedKmh,
        savedLocations     = locationStore.savedLocations,
        vehicleType        = VehicleType.EV,
        batteryLevel       = evSensors.stateOfCharge,
        rangeEstimate      = evSensors.remainingRangeKm,
        recentDestinations = historyStore.recentDestinations,
        mapRegion          = mapView.visibleBoundingBox
    )
}`}</pre>
        </CodeBlock>
        <p className="body">
          The table below lists all supported context fields:
        </p>
        <table className="prop-table" style={{ marginTop: 16 }}>
          <thead>
            <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
          </thead>
          <tbody>
            {CONTEXT_FIELDS.map(f => (
              <tr key={f.field}>
                <td><code>{f.field}</code></td>
                <td style={{ fontSize: '0.78rem', color: 'var(--mid)', whiteSpace: 'nowrap' }}>{f.type}</td>
                <td style={{ textAlign: 'center', color: f.required ? 'var(--red)' : 'var(--muted)', fontWeight: f.required ? 600 : 400, fontSize: '0.8rem' }}>
                  {f.required ? 'Yes' : 'No'}
                </td>
                <td style={{ color: 'var(--mid)', fontSize: '0.82rem' }}>{f.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="zone">
        <h2 className="sh" id="ac-events">{t('config.sections.events')}</h2>
        <p className="body">
          TAIA delivers intermediate results over MQTT, enabling your TTS engine to begin speaking
          before the full response has been generated. The SDK manages the MQTT connection
          automatically; no additional configuration is required.
        </p>
        <p className="body">
          To receive streaming events, register a <code>StreamingResponseListener</code> on the
          client before making the first <code>chat()</code> call:
        </p>
        <CodeBlock tabs={['Kotlin']}>
          <pre>{`taiaClient.setStreamingListener { event ->
    when (event) {
        is TaiaEvent.PartialVoiceText -> ttsEngine.preload(event.text)
        is TaiaEvent.FinalVoiceText   -> ttsEngine.speak(event.text)
        is TaiaEvent.UiCommand        -> navigationUiController.execute(event.command)
        is TaiaEvent.Error            -> handleTaiaError(event.cause)
    }
}`}</pre>
        </CodeBlock>
        <Callout type="info">
          If you do not register a streaming listener, the SDK buffers all events and delivers
          them as a single <code>TaiaChatResponse</code> in the <code>chat()</code> callback.
          This is simpler to implement but adds latency before TTS playback begins.
        </Callout>
      </div>

      <div className="zone">
        <h2 className="sh" id="ac-session">{t('config.sections.session')}</h2>
        <p className="body">
          TAIA supports follow-up questions within a single interaction session. Pass the same
          <code> conversationId</code> across sequential turns to maintain context:
        </p>
        <CodeBlock tabs={['Kotlin']}>
          <pre>{`// First turn
val sessionId = UUID.randomUUID().toString()
taiaClient.chat(TaiaChatRequest(
    utterance      = "Find me a coffee shop on the way",
    context        = buildNavigationContext(),
    conversationId = sessionId
)) { response -> handleResponse(response) }

// Follow-up turn (driver says "show me the second one")
taiaClient.chat(TaiaChatRequest(
    utterance      = "show me the second one",
    context        = buildNavigationContext(),
    conversationId = sessionId   // same ID maintains session state
)) { response -> handleResponse(response) }`}</pre>
        </CodeBlock>
      </div>

      <div className="zone">
        <h2 className="sh" id="ac-requirements">{t('config.sections.requirements')}</h2>
        <table className="prop-table">
          <thead><tr><th>Requirement</th><th>Priority</th><th>Notes</th></tr></thead>
          <tbody>
            {[
              ['Valid API key',                       'P1', 'Obtain from TomTom Developer Portal; never commit to source control'],
              ['currentRoute in context',             'P1', 'Required for re-routing, route alternatives, ETA queries'],
              ['vehiclePosition in context',          'P1', 'Required for all location-relative commands'],
              ['savedLocations in context',           'P1', 'Required for "take me home / to work" commands'],
              ['Single TaiaClient instance',          'P1', 'Reuse across the lifecycle; create once, close in onDestroy'],
              ['batteryLevel + rangeEstimate for EV', 'P2', 'Required for EV charging stop suggestions'],
              ['conversationId for multi-turn',       'P2', 'Enables follow-up questions within the same session'],
              ['MQTT streaming listener',             'P2', 'Reduces perceived TTS latency via partial result delivery'],
            ].map(([req, pri, notes]) => (
              <tr key={req}>
                <td style={{ fontWeight: 500 }}>{req}</td>
                <td>
                  <span style={{
                    fontSize: '0.68rem', fontWeight: 700, padding: '2px 6px', borderRadius: 3,
                    background: pri === 'P1' ? '#fff5f5' : 'var(--bg)',
                    color: pri === 'P1' ? 'var(--red)' : 'var(--muted)',
                    border: `1px solid ${pri === 'P1' ? '#fecaca' : 'var(--border)'}`,
                  }}>{pri}</span>
                </td>
                <td style={{ color: 'var(--mid)', fontSize: '0.82rem' }}>{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
