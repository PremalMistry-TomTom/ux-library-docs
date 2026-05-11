import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';

export default function VIBasics({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Vehicle Integration Basics</h1>
        <p className="page-subtitle">
          Connect the UX Library to your vehicle's data bus — speed, gear, ADAS sensors, and
          display surfaces — through a single integration layer.
        </p>
      </div>

      <div className="page-body">
        <h2 className="sh">Overview</h2>
        <p>
          The Vehicle Integration Layer (VIL) is the bridge between the TomTom UX Library and your
          vehicle's hardware signals. It exposes a small, well-typed Kotlin API that your VIL
          implementation fills in; the library then uses those signals to drive speed-aware UI
          behaviours, cluster projection, HUD rendering, and ADAS warnings without requiring any
          further per-feature wiring.
        </p>
        <p>
          VIL is entirely optional for basic navigation use cases. Implement only the interfaces
          relevant to your platform — unused interfaces are no-ops by default.
        </p>

        <h2 className="sh">Architecture</h2>
        <p>
          VIL sits between your vehicle's OEM middleware (CAN bus adapters, VHAL, or proprietary
          APIs) and the TomTom SDK layer:
        </p>
        <CodeBlock language="text">{`┌─────────────────────────────────┐
│        Your Application         │
├─────────────────────────────────┤
│      TomTom UX Library          │
│  (Nav UI, Cluster, HUD, ADAS)   │
├─────────────────────────────────┤
│   Vehicle Integration Layer     │  ← You implement this
│   (VehicleDataProvider)         │
├─────────────────────────────────┤
│   OEM Middleware / VHAL / CAN   │
└─────────────────────────────────┘`}</CodeBlock>

        <h2 className="sh">Core interface</h2>
        <p>
          Implement <code>VehicleDataProvider</code> to expose vehicle signals. You only need to
          override the methods your hardware supports — defaults return <code>null</code> / sensible
          fallbacks.
        </p>

        <CodeBlock language="kotlin" title="MyVehicleDataProvider.kt">{`class MyVehicleDataProvider : VehicleDataProvider {

    // Current vehicle speed in km/h
    override fun getVehicleSpeed(): Float? = VhalBridge.getSpeed()

    // Current gear (P / R / N / D / sport modes)
    override fun getGear(): Gear? = when (VhalBridge.getGear()) {
        GEAR_PARK    -> Gear.PARK
        GEAR_REVERSE -> Gear.REVERSE
        GEAR_NEUTRAL -> Gear.NEUTRAL
        GEAR_DRIVE   -> Gear.DRIVE
        else         -> null
    }

    // Ignition state — used to suppress UI on ACC-off
    override fun getIgnitionState(): IgnitionState? =
        if (VhalBridge.isIgnitionOn()) IgnitionState.ON else IgnitionState.OFF

    // Day / night mode from the ambient light sensor
    override fun getDayNightMode(): DayNightMode? =
        if (VhalBridge.isNightMode()) DayNightMode.NIGHT else DayNightMode.DAY
}`}</CodeBlock>

        <h2 className="sh">Registering the provider</h2>
        <CodeBlock language="kotlin" title="Application.kt">{`class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        TomTomSDK.initialize(
            apiKey = BuildConfig.TOMTOM_API_KEY,
            vehicleDataProvider = MyVehicleDataProvider(),
        )
    }
}`}</CodeBlock>

        <Callout type="info">
          If your platform uses Android Automotive OS (AAOS) and VHAL, consider using the
          pre-built <code>AaosVehicleDataProvider</code> adapter from the <code>tomtom-aaos</code>
          module — it handles VHAL property polling automatically.
        </Callout>

        <h2 className="sh">Day / night theming</h2>
        <p>
          When <code>getDayNightMode()</code> is implemented, the UX Library automatically switches
          between day and night map styles and UI themes whenever the vehicle signals a mode change.
          No additional code is required in your activities.
        </p>

        <h2 className="sh">Speed-aware UI behaviours</h2>
        <p>
          With vehicle speed connected, the library enables:
        </p>
        <ul>
          <li>
            <strong>Driving mode</strong> — Complex UI interactions are suppressed above 10 km/h to
            reduce driver distraction.
          </li>
          <li>
            <strong>Speed limit comparison</strong> — The speed limit panel changes colour when the
            driver exceeds the current limit.
          </li>
          <li>
            <strong>ISA warnings</strong> — Intelligent Speed Assistance alerts trigger based on
            the live speed differential.
          </li>
        </ul>

        <h2 className="sh">Related</h2>
        <div className="page-related">
          <button className="page-related-chip" onClick={() => onNavigate?.('cluster')}>
            Cluster Display
          </button>
          <button className="page-related-chip" onClick={() => onNavigate?.('hud')}>
            Head-Up Display
          </button>
          <button className="page-related-chip" onClick={() => onNavigate?.('adas')}>
            ADAS Integration
          </button>
          <button className="page-related-chip" onClick={() => onNavigate?.('truck')}>
            Truck Support
          </button>
        </div>
      </div>
    </div>
  );
}
