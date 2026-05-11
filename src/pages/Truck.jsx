import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';

export default function Truck({ onNavigate }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Truck Support</h1>
        <p className="page-subtitle">
          Configure truck and commercial vehicle routing with height, weight, hazmat, and axle load
          restrictions applied throughout the navigation UI.
        </p>
      </div>

      <div className="page-body">
        <h2 className="sh">Overview</h2>
        <p>
          The UX Library's truck support layer propagates commercial vehicle parameters — dimensions,
          weights, cargo type, and tunnel/ferry restrictions — from a single configuration object into
          routing, search, and all navigation UI components. Drivers see truck-appropriate routes,
          speed limits, and restriction warnings without any per-screen integration work.
        </p>

        <Callout type="info">
          Truck routing requires a NavSDK licence that includes commercial vehicle profiles. Contact
          your TomTom account manager if this feature is not enabled.
        </Callout>

        <h2 className="sh">Configuring the vehicle profile</h2>
        <p>
          Build a <code>TruckVehicleProfile</code> at startup and pass it to the SDK. All routing and
          on-route restriction checks will use these values automatically.
        </p>

        <CodeBlock language="kotlin" title="TruckProfileSetup.kt">{`val truckProfile = TruckVehicleProfile.Builder()
    // Physical dimensions (in metres / kg)
    .vehicleWeight(22_000)          // kg, gross vehicle weight
    .axleWeight(8_000)              // kg, per axle
    .vehicleHeight(4.1)             // metres
    .vehicleWidth(2.6)              // metres
    .vehicleLength(18.5)            // metres
    // Cargo & restrictions
    .hazmatLoad(HazmatType.EXPLOSIVE)
    .tunnelCategory(TunnelCategory.B)
    .ferryUsage(FerryUsage.AVOID)
    .build()

TomTomSDK.setVehicleProfile(truckProfile)`}</CodeBlock>

        <h2 className="sh">Route planning with truck profile</h2>
        <p>
          The route planning screen automatically adapts when a truck profile is active: weight and
          dimension warnings are surfaced per route alternative, and roads with known restrictions
          are annotated inline.
        </p>

        <CodeBlock language="kotlin">{`// Request a route with the active truck profile
val routeOptions = RouteOptions.Builder()
    .origin(currentLocation)
    .destination(destination)
    .vehicleProfile(truckProfile)
    .routeType(RouteType.FASTEST)
    .build()

navigationController.planRoute(routeOptions)`}</CodeBlock>

        <h2 className="sh">UI indicators</h2>
        <p>The following UI components surface truck-specific information automatically:</p>
        <ul>
          <li>
            <strong>Route Bar</strong> — Restriction icons (weight, height, hazmat) per segment.
          </li>
          <li>
            <strong>Instruction Panel</strong> — Low-bridge and weight-limit warnings 500 m before
            the restriction.
          </li>
          <li>
            <strong>Map</strong> — Truck-prohibited roads are visually de-emphasised on the active
            map style.
          </li>
          <li>
            <strong>Speed Limit</strong> — Displays the truck-specific speed limit where it differs
            from the general limit.
          </li>
        </ul>

        <h2 className="sh">Hazardous materials</h2>
        <p>
          When <code>HazmatType</code> is set, the SDK filters route alternatives to exclude roads
          and tunnels that prohibit the specified cargo category.
        </p>

        <CodeBlock language="kotlin">{`// Available HazmatType values
HazmatType.GENERAL             // General goods — no HAZMAT classification
HazmatType.EXPLOSIVE           // ADR Class 1
HazmatType.FLAMMABLE_GAS       // ADR Class 2
HazmatType.FLAMMABLE_LIQUID    // ADR Class 3
HazmatType.COMBUSTIBLE_LIQUID  // ADR Class 3 variant
HazmatType.ORGANIC_PEROXIDE    // ADR Class 5.2
HazmatType.RADIOACTIVE         // ADR Class 7
HazmatType.CORROSIVE           // ADR Class 8`}</CodeBlock>

        <h2 className="sh">Related</h2>
        <div className="page-related">
          <button className="page-related-chip" onClick={() => onNavigate?.('route-bar')}>
            Route Bar
          </button>
          <button className="page-related-chip" onClick={() => onNavigate?.('nav-controls')}>
            Navigation Controls
          </button>
          <button className="page-related-chip" onClick={() => onNavigate?.('vi-basics')}>
            Vehicle Integration Basics
          </button>
        </div>
      </div>
    </div>
  );
}
