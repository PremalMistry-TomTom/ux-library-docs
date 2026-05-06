import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';

const addLn = t => {
  const esc = t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const lines = esc.split('\n');
  if (lines[lines.length - 1] === '') lines.pop();
  return lines.map(l => `<span class="cb-line">${l}</span>`).join('\n');
};

/* ─── Code examples ──────────────────────────────────────────────────────────── */
const CODE_REST = `# Long Distance EV Route — TomTom Maps v1
# Route from Amsterdam to Paris with 2 planned charging stops
# Battery: 45 kWh current / 75 kWh max | CCS Combo 2 connector

curl -X POST \\
  "https://api.tomtom.com/routing/1/calculateLongDistanceEVRoute/\\
52.3676,4.9041:48.8566,2.3522/json\\
?key=YOUR_API_KEY\\
&travelMode=car\\
&vehicleEngineType=electric\\
&currentChargeInkWh=45\\
&maxChargeInkWh=75\\
&minChargeAtDestinationInkWh=5\\
&minChargeAtChargingStopsInkWh=5\\
&connectorSet=IEC62196Type2CCS\\
&minPowerKW=50\\
&constantSpeedConsumptionInkWhPerHundredkm=50%2C8.2%3A90%2C14.6%3A120%2C21.0" \\
  -H "Content-Type: application/json"`;

const CODE_KOTLIN = `// TomTom Navigation SDK for Android — Long Distance EV Routing
// Requires: com.tomtom.sdk:routing-api

import com.tomtom.sdk.routing.RoutePlanningCallback
import com.tomtom.sdk.routing.RoutePlanningResponse
import com.tomtom.sdk.routing.RoutePlanner
import com.tomtom.sdk.routing.options.*
import com.tomtom.sdk.routing.options.vehicle.*
import com.tomtom.sdk.location.GeoPoint

val origin      = GeoPoint(52.3676, 4.9041)   // Amsterdam
val destination = GeoPoint(48.8566, 2.3522)   // Paris

val evOptions = ElectricVehicleOptions(
    currentChargeInKilowattHours  = 45.0,
    maxChargeInKilowattHours      = 75.0,
    minChargeAtDestinationInKwh   = 5.0,
    minChargeAtChargingStopsInKwh = 5.0,
    chargingConnectors            = listOf(
        ChargingConnector(
            connectorType    = ConnectorType.IEC62196_TYPE2_CCS,
            powerInKilowatts = 50.0
        )
    )
)

val consumptionModel = ElectricConsumptionModel(
    speedConsumptionInKwhPer100Km = mapOf(
        50.0  to 8.2,
        90.0  to 14.6,
        120.0 to 21.0
    ),
    auxiliaryPowerInKilowatts = 1.5
)

val options = RoutePlanningOptions(
    itinerary    = Itinerary(origin = origin, destination = destination),
    routeType    = RouteType.ECO,
    vehicleOptions = VehicleOptions(
        engineType             = EngineType.ELECTRIC,
        electricVehicleOptions = evOptions,
        consumptionModel       = consumptionModel
    )
)

routePlanner.planRoute(options, object : RoutePlanningCallback {
    override fun onSuccess(result: RoutePlanningResponse) {
        val route = result.routes.first()
        val stops = route.chargingInformationAtLegs
        Log.d("EV", "Charging stops: \${stops.size}")
        stops.forEachIndexed { i, stop ->
            Log.d("EV", "Stop \$i: \${stop.chargingParkName}, +\${stop.chargingTimeInSeconds / 60} min")
        }
    }
    override fun onFailure(failure: RoutingFailure) {
        Log.e("EV", "Route failed: \${failure.message}")
    }
})`;

/* ─── Main component ─────────────────────────────────────────────────────────── */
export default function LDEVRFirstRoute({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Plan Your First EV Route</h1>
        <PageActions pageId="ldevr-first-route" pageTitle="Plan Your First EV Route" />
      </div>

      <p className="quick-answer">
        This guide walks through a complete Amsterdam → Paris EV route request — first using the
        REST API directly, then using the Kotlin Navigation SDK for Android.
      </p>

      {/* ── REST request ── */}
      <div className="zone">
        <h2 className="sh" id="first-route-rest">REST API request</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--mid)', marginBottom: 14, lineHeight: 1.6 }}>
          Pass your current battery level, connector type, and a speed–consumption table in the query
          string. The API selects optimal charging stops and returns a full itinerary.
        </p>
        <Callout type="info" title="Request format">
          Long Distance EV Route uses <strong>POST</strong>. Route points go in the URL path;
          all other parameters go in the query string.
        </Callout>
        <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border)' }}>
          <div style={{
            padding: '8px 14px', background: '#161b22',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: 600 }}>
              Amsterdam → Paris · CCS2 · 45 kWh / 75 kWh
            </span>
            <div style={{ display: 'flex', gap: 5 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
            </div>
          </div>
          <pre className="cb-pre">
            <code dangerouslySetInnerHTML={{ __html: addLn(CODE_REST) }} />
          </pre>
        </div>
      </div>

      {/* ── Kotlin SDK ── */}
      <div className="zone">
        <h2 className="sh" id="first-route-kotlin">Kotlin SDK integration</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--mid)', marginBottom: 16, lineHeight: 1.6 }}>
          The TomTom Navigation SDK for Android wraps Long Distance EV Routing with a first-class API.
          Route results are automatically passed to the navigation engine — charging stops appear as
          intermediate waypoints with station info displayed in the UI.
        </p>

        {/* Feature cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 24 }}>
          {[
            { icon: '📦', title: 'Dependency',         body: 'com.tomtom.sdk:routing-api — included by default in the Navigation SDK bundle' },
            { icon: '🔋', title: 'Live SoC updates',   body: 'Feed real-time battery readings to the SDK and it will recalculate remaining range as you drive' },
            { icon: '⚡', title: 'Station arrival UX',  body: 'Charging stop cards with plug type, network brand, and estimated charge time are rendered automatically' },
            { icon: '🔄', title: 'Replanning',          body: 'If traffic or battery conditions change significantly, the SDK triggers an automatic EV re-route silently' },
          ].map(f => (
            <div key={f.title} style={{ padding: '14px', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--bg)' }}>
              <div style={{ fontSize: '1.25rem', marginBottom: 7 }}>{f.icon}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)', marginBottom: 5 }}>{f.title}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.55 }}>{f.body}</div>
            </div>
          ))}
        </div>

        {/* Kotlin code */}
        <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border)' }}>
          <div style={{
            padding: '8px 14px', background: '#161b22',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: 600 }}>
              Kotlin · Navigation SDK for Android
            </span>
            <div style={{ display: 'flex', gap: 5 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
            </div>
          </div>
          <pre className="cb-pre">
            <code dangerouslySetInnerHTML={{ __html: addLn(CODE_KOTLIN) }} />
          </pre>
        </div>
      </div>

      {/* ── Next steps ── */}
      <div className="zone" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className="page-action-btn" onClick={() => onNavigate?.('ldevr-calculate-route', 'ldevr')}>
          Calculate EV Route →
        </button>
        <button className="page-action-btn" onClick={() => onNavigate?.('ldevr-battery-model', 'ldevr')}>
          Battery & Consumption Model →
        </button>
        <button className="page-action-btn" onClick={() => onNavigate?.('ldevr-connectors', 'ldevr')}>
          Connector Types →
        </button>
      </div>
    </div>
  );
}
