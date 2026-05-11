import PageActions from '../components/ui/PageActions';
import { useIlloStyle } from '../context/IlloStyleContext';
import {
  makeThumb,
  L_MapDisplay, L_SearchResult, L_Route, L_NavGuidance, L_HorizonPanel, L_ADAS, L_CarPlay,
} from '../illustrations/lightVariants';
import {
  IcoADAS, IcoAIConfig, IcoAIVoice, IcoAreaAnalytics, IcoBatchRouting,
  IcoCalculateRoute, IcoCluster, IcoETAPanel, IcoEV, IcoEVBattery,
  IcoEVChargingAvailability, IcoEVNavUI, IcoEVRequirements, IcoEVRouting, IcoEVSearchNearby,
  IcoFuelPrices, IcoGeocode, IcoHUD, IcoHomeScreen, IcoHorizonPanel,
  IcoInstructionPanel, IcoIntentRouting, IcoJunctionAnalytics, IcoMapDisplay,
  IcoMapRasterTile, IcoMapSatelliteTile, IcoMapStaticImage, IcoMapVectorTile, IcoMatrixRouting,
  IcoNavControls, IcoNavGuidance, IcoNavSDKAdvanced, IcoNavSDKLocation, IcoNavSDKNavigation,
  IcoNavSDKOffline, IcoNavSDKRouting, IcoNavSDKSearch, IcoNavSDKVirtualHorizon,
  IcoODAnalysis, IcoOnStreetParking, IcoPOIDetails, IcoPOIPhotos, IcoParkingAvailability,
  IcoParkingPrices, IcoReachableRange, IcoReverseGeocode, IcoRouteBar, IcoRoutingWeather,
  IcoSearchAlongRoute, IcoSearchAutocomplete, IcoSearchFuzzy, IcoSearchNearby, IcoSearchPOI,
  IcoSnapToRoads, IcoSpeechToText, IcoTrafficFlow, IcoTrafficFlowTile, IcoTrafficIncidents,
  IcoTrafficModelID, IcoTrafficStats, IcoTruck, IcoTurnInstructions, IcoVIBasics,
  IcoVoiceEngine, IcoWaypointOpt,
} from '../illustrations/iconVariants';
import {
  IlloMapDisplay,
  IlloNavSDKLocation,
  IlloNavSDKSearch,
  IlloNavSDKRouting,
  IlloNavSDKNavigation,
  IlloNavSDKVirtualHorizon,
  IlloNavSDKAdvanced,
} from './IntroIllustrations';

/* ─── Coming Soon badge ─────────────────────────────────────────────────── */
function ComingSoonBadge() {
  return (
    <span style={{
      display: 'inline-block',
      fontSize: '0.625rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      padding: '2px 7px',
      borderRadius: 4,
      background: 'var(--bg)',
      border: '1px solid var(--border)',
      color: 'var(--muted)',
    }}>
      Coming soon
    </span>
  );
}

/* ─── Use-case card ─────────────────────────────────────────────────────── */
function UseCaseCard({ title, desc, Thumb, onClick }) {
  const { theme, palette } = useIlloStyle();
  return (
    <div
      className="nav-card"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onClick()) : undefined}
    >
      <div
        className="nav-card-thumb"
        style={theme !== 'dark' ? { background: palette.bg, padding: 0 } : undefined}
      >
        <Thumb />
      </div>
      <div className="nav-card-body">
        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--black)', marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.5, marginBottom: 10, flex: 1 }}>{desc}</div>
        {onClick ? (
          <span style={{
            display: 'inline-block',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--accent)',
            letterSpacing: '0.01em',
          }}>
            Explore →
          </span>
        ) : (
          <ComingSoonBadge />
        )}
      </div>
    </div>
  );
}

/* ─── Cross-link strip ──────────────────────────────────────────────────── */
function RelatedDomainChip({ label, pageId, onNavigate }) {
  return (
    <button
      onClick={() => onNavigate?.(pageId)}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 100,
        padding: '6px 14px',
        fontSize: '0.8125rem',
        fontWeight: 600,
        color: 'var(--mid)',
        cursor: 'pointer',
        transition: 'border-color 0.15s, color 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--black)'; e.currentTarget.style.color = 'var(--black)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--mid)'; }}
    >
      {label} →
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAP DISPLAY — iOS
   ═══════════════════════════════════════════════════════════════════════════ */
export function NavSDKiOSMapDisplay({ onNavigate }) {
  const cards = [
    {
      id: 'navsdk-ios-map-swiftui',
      title: 'Map for SwiftUI',
      desc: 'Embed the TomTom map into a SwiftUI view hierarchy using the TomTomMapView representable wrapper. Integrates naturally with SwiftUI state, bindings, and the view lifecycle for declarative map management.',
      Thumb: makeThumb(IlloMapDisplay, L_MapDisplay, IcoMapDisplay),
    },
    {
      id: 'navsdk-ios-map-uikit',
      title: 'Map for UIKit',
      desc: 'Add the TomTomMapView directly to a UIViewController-based layout. Provides the same map capabilities as the SwiftUI variant, with full UIKit delegate pattern support for view-based iOS apps.',
      Thumb: makeThumb(IlloMapDisplay, L_MapDisplay, IcoMapDisplay),
    },
    {
      id: 'navsdk-ios-map-styles',
      title: 'Map Styles',
      desc: 'Switch between built-in day and night map styles or apply a custom style URL to match your OEM brand. Controls road colours, label visibility, and landmark layers via the StyleManager API.',
      Thumb: makeThumb(IlloMapDisplay, L_MapDisplay, IcoMapDisplay),
    },
    {
      id: 'navsdk-ios-map-camera',
      title: 'Camera & Animations',
      desc: 'Control map camera position, zoom, tilt, and bearing programmatically using CameraUpdate. Animate transitions with built-in easing curves for smooth, driving-safe panning without blocking the main thread.',
      Thumb: makeThumb(IlloMapDisplay, L_MapDisplay, IcoMapDisplay),
    },
    {
      id: 'navsdk-ios-map-markers',
      title: 'Annotations & Overlays',
      desc: 'Add custom icon annotations anchored to geographic coordinates via the MapAnnotation API. Supports tap interaction, clustering, polyline and polygon overlays, and dynamic updates as route or POI data changes.',
      Thumb: makeThumb(IlloMapDisplay, L_MapDisplay, IcoMapDisplay),
    },
    {
      id: 'navsdk-ios-map-traffic',
      title: 'Traffic Layer',
      desc: 'Overlay real-time traffic flow and incident data on the map using the TrafficDisplayOptions. Traffic tiles update automatically on a configurable interval and can be toggled independently from the base style.',
      Thumb: makeThumb(IlloMapDisplay, L_MapDisplay, IcoMapDisplay),
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Map Display</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Render TomTom maps inside SwiftUI or UIKit iOS apps. Control map styles, camera
        animations, annotations, and real-time traffic overlays — all through a unified Swift SDK surface.
      </p>

      <div className="zone">
        <h2 className="sh" id="ios-md-usecases">Use cases</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {cards.map((c, i) => (
            <UseCaseCard key={i} title={c.title} desc={c.desc} Thumb={c.Thumb} onClick={() => onNavigate?.(c.id)} />
          ))}
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="ios-md-related">Related domains</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <RelatedDomainChip label="Location" pageId="navsdk-ios-location" onNavigate={onNavigate} />
          <RelatedDomainChip label="Navigation" pageId="navsdk-ios-navigation" onNavigate={onNavigate} />
          <RelatedDomainChip label="CarPlay" pageId="navsdk-ios-carplay" onNavigate={onNavigate} />
          <RelatedDomainChip label="Virtual Horizon" pageId="navsdk-ios-horizon" onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LOCATION — iOS
   ═══════════════════════════════════════════════════════════════════════════ */
export function NavSDKiOSLocation({ onNavigate }) {
  const cards = [
    {
      id: 'navsdk-ios-location-quickstart',
      title: 'CLLocation Provider',
      desc: 'Connect the iOS CLLocationManager to the NavSDK location pipeline. The built-in provider handles CoreLocation authorisation prompts, satellite fix quality checks, and configurable desiredAccuracy and distanceFilter settings.',
      Thumb: makeThumb(IlloNavSDKLocation, L_MapDisplay, IcoNavSDKLocation),
    },
    {
      id: 'navsdk-ios-location-quickstart',
      title: 'Background Location',
      desc: 'Continue receiving location updates when the app is backgrounded using UIBackgroundModes location entitlement. Enables continuous navigation and track recording while the user switches to other apps.',
      Thumb: makeThumb(IlloNavSDKLocation, L_MapDisplay, IcoNavSDKLocation),
    },
    {
      id: 'navsdk-ios-location-quickstart',
      title: 'Custom Location Engine',
      desc: 'Supply your own positioning source — dead reckoning hardware, sensor-fused GNSS, or a simulated CLLocation feed — by implementing the LocationEngine protocol and injecting it into the NavSDK configuration.',
      Thumb: makeThumb(IlloNavSDKLocation, L_MapDisplay, IcoNavSDKLocation),
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Location</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Connect real-world GNSS positioning to the iOS NavSDK via CoreLocation. Use the built-in
        CLLocation provider or plug in a custom location engine — from sensor-fused hardware to simulation feeds.
      </p>

      <div className="zone">
        <h2 className="sh" id="ios-loc-usecases">Use cases</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {cards.map((c, i) => (
            <UseCaseCard key={i} title={c.title} desc={c.desc} Thumb={c.Thumb} onClick={() => onNavigate?.(c.id)} />
          ))}
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="ios-loc-related">Related domains</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <RelatedDomainChip label="Map Display" pageId="navsdk-ios-map-display" onNavigate={onNavigate} />
          <RelatedDomainChip label="Navigation" pageId="navsdk-ios-navigation" onNavigate={onNavigate} />
          <RelatedDomainChip label="Advanced" pageId="navsdk-ios-advanced" onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SEARCH — iOS
   ═══════════════════════════════════════════════════════════════════════════ */
export function NavSDKiOSSearch({ onNavigate }) {
  const cards = [
    {
      id: 'navsdk-ios-search-find',
      title: 'Fuzzy Search',
      desc: 'Run a single typo-tolerant query across addresses, POI names, and categories using the Swift SearchEngine. Returns ranked results with coordinates, metadata, and distance from a CLLocationCoordinate2D reference point.',
      Thumb: makeThumb(IlloNavSDKSearch, L_SearchResult, IcoNavSDKSearch),
    },
    {
      id: 'navsdk-ios-search-find',
      title: 'Along-Route Search',
      desc: 'Find points of interest within a configurable corridor along an active route — ideal for discovering fuel, food, or EV charging stops without deviating from the planned path.',
      Thumb: makeThumb(IlloNavSDKSearch, L_SearchResult, IcoNavSDKSearch),
    },
    {
      id: 'navsdk-ios-search-reverse',
      title: 'Reverse Geocoding',
      desc: 'Convert a CLLocationCoordinate2D into a human-readable address via the ReverseGeocodingEngine. Supports road-level, city, and postal code resolution with country-specific address formatting.',
      Thumb: makeThumb(IlloNavSDKSearch, L_SearchResult, IcoNavSDKSearch),
    },
    {
      id: 'navsdk-ios-search-find',
      title: 'Autocomplete',
      desc: 'Fetch real-time search suggestions as the user types, with built-in debouncing and category classification. Pairs naturally with UISearchController or a SwiftUI TextField for a responsive destination-entry experience.',
      Thumb: makeThumb(IlloNavSDKSearch, L_SearchResult, IcoNavSDKSearch),
    },
    {
      id: 'navsdk-ios-search-ev',
      title: 'EV Station Search',
      desc: 'Locate EV charging stations near a coordinate or along a route, filtered by connector type, power level, and real-time availability. Results are returned as typed Swift value types for safe, ergonomic handling.',
      Thumb: makeThumb(IlloNavSDKSearch, L_SearchResult, IcoNavSDKSearch),
    },
    {
      id: 'navsdk-ios-search-byod',
      title: 'Custom Search Provider',
      desc: 'Augment TomTom search results with proprietary POI data. Implement the SearchProvider protocol in Swift to blend in-house data with TomTom\'s global index in a single unified results list.',
      Thumb: makeThumb(IlloNavSDKSearch, L_SearchResult, IcoNavSDKSearch),
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Search</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Add destination search, autocomplete, reverse geocoding, and along-route POI discovery to
        your iOS navigation app. Extend with your own Swift data sources via the custom provider protocol.
      </p>

      <div className="zone">
        <h2 className="sh" id="ios-srch-usecases">Use cases</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {cards.map((c, i) => (
            <UseCaseCard key={i} title={c.title} desc={c.desc} Thumb={c.Thumb} onClick={() => onNavigate?.(c.id)} />
          ))}
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="ios-srch-related">Related domains</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <RelatedDomainChip label="Routing" pageId="navsdk-ios-routing" onNavigate={onNavigate} />
          <RelatedDomainChip label="Navigation" pageId="navsdk-ios-navigation" onNavigate={onNavigate} />
          <RelatedDomainChip label="Map Display" pageId="navsdk-ios-map-display" onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROUTING — iOS
   ═══════════════════════════════════════════════════════════════════════════ */
export function NavSDKiOSRouting({ onNavigate }) {
  const cards = [
    {
      id: 'navsdk-ios-route-planning',
      title: 'Calculate Route',
      desc: 'Plan a point-to-point route with vehicle-aware settings, real-time traffic, and avoidance options using the Swift RoutingEngine. Returns full geometry, ETA, and manoeuvre guidance as strongly-typed Swift value types.',
      Thumb: makeThumb(IlloNavSDKRouting, L_Route, IcoNavSDKRouting),
    },
    {
      id: 'navsdk-ios-route-alternatives',
      title: 'Alternative Routes',
      desc: 'Request up to three route alternatives simultaneously. Each alternative is scored by travel time, distance, and eco-efficiency so drivers can choose their preference before starting navigation.',
      Thumb: makeThumb(IlloNavSDKRouting, L_Route, IcoNavSDKRouting),
    },
    {
      id: 'navsdk-ios-route-sections',
      title: 'Route Sections',
      desc: 'Break a route into typed Swift enum sections — motorway, tunnel, ferry, toll, traffic delay — to surface cost breakdowns, restrictions, and per-segment travel time estimates in the guidance UI.',
      Thumb: makeThumb(IlloNavSDKRouting, L_Route, IcoNavSDKRouting),
    },
    {
      id: 'navsdk-ios-route-import-export',
      title: 'Import, Export & Modify',
      desc: 'Serialise routes to JSON using Swift Codable for persistence or sharing, import external GPX and GeoJSON tracks, and dynamically insert or remove waypoints during an active navigation session.',
      Thumb: makeThumb(IlloNavSDKRouting, L_Route, IcoNavSDKRouting),
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Routing</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Plan, compare, and manage routes in the iOS NavSDK. Calculate traffic-aware alternatives,
        inspect typed route sections, and modify waypoints on the fly using idiomatic Swift APIs.
      </p>

      <div className="zone">
        <h2 className="sh" id="ios-rt-usecases">Use cases</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {cards.map((c, i) => (
            <UseCaseCard key={i} title={c.title} desc={c.desc} Thumb={c.Thumb} onClick={() => onNavigate?.(c.id)} />
          ))}
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="ios-rt-related">Related domains</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <RelatedDomainChip label="Navigation" pageId="navsdk-ios-navigation" onNavigate={onNavigate} />
          <RelatedDomainChip label="Search" pageId="navsdk-ios-search" onNavigate={onNavigate} />
          <RelatedDomainChip label="CarPlay" pageId="navsdk-ios-carplay" onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   NAVIGATION — iOS
   ═══════════════════════════════════════════════════════════════════════════ */
export function NavSDKiOSNavigation({ onNavigate }) {
  const cards = [
    {
      id: 'navsdk-ios-nav-quickstart',
      title: 'Start Navigation',
      desc: 'Begin a guided navigation session from a planned route by calling NavigationEngine.start(route:). The guidance engine handles map-matched position updates, progress tracking, and automatic arrival detection.',
      Thumb: makeThumb(IlloNavSDKNavigation, L_NavGuidance, IcoNavSDKNavigation),
    },
    {
      id: 'navsdk-ios-nav-guidance',
      title: 'Turn-by-Turn Guidance',
      desc: 'Receive structured GuidanceInstruction events — manoeuvre type, street name, distance, and icon — at every decision point via the GuidanceEngineDelegate. Ready to drive a custom NIP or instrument cluster display.',
      Thumb: makeThumb(IlloNavSDKNavigation, L_NavGuidance, IcoNavSDKNavigation),
    },
    {
      id: 'navsdk-ios-nav-voice',
      title: 'Voice Instructions',
      desc: 'Trigger TTS voice prompts at the correct distance before each manoeuvre using AVSpeechSynthesizer or a custom audio engine. Supports language localisation, mute/unmute state, and Bluetooth audio session routing.',
      Thumb: makeThumb(IlloNavSDKNavigation, L_NavGuidance, IcoNavSDKNavigation),
    },
    {
      id: 'navsdk-ios-nav-replanning',
      title: 'Continuous Replanning',
      desc: 'Automatically recalculate the route when the driver deviates from the planned path or when a significant traffic incident appears ahead. Rerouting callbacks are delivered on the main actor for safe SwiftUI state updates.',
      Thumb: makeThumb(IlloNavSDKNavigation, L_NavGuidance, IcoNavSDKNavigation),
    },
    {
      id: 'navsdk-ios-nav-safety',
      title: 'Safety Locations',
      desc: 'Receive advance warnings for speed cameras, danger zones, and school areas along the route via SafetyLocationDelegate, with configurable alert distances and dismissal logic.',
      Thumb: makeThumb(IlloNavSDKNavigation, L_NavGuidance, IcoNavSDKNavigation),
    },
    {
      id: 'navsdk-ios-nav-carplay',
      title: 'CarPlay Integration',
      desc: 'Mirror the active navigation session to Apple CarPlay using the CarPlay framework. The SDK provides a ready-made CPMapTemplate configuration that bridges NavSDK guidance events to CarPlay\'s restricted UI template system.',
      Thumb: makeThumb(IlloNavSDKNavigation, L_CarPlay, IcoNavSDKNavigation),
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Navigation</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Drive a full turn-by-turn navigation experience on iOS — guidance events, AVSpeechSynthesizer
        voice instructions, safety alerts, continuous replanning, and CarPlay mirroring — all from the NavSDK guidance engine.
      </p>

      <div className="zone">
        <h2 className="sh" id="ios-nav-usecases">Use cases</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {cards.map((c, i) => (
            <UseCaseCard key={i} title={c.title} desc={c.desc} Thumb={c.Thumb} onClick={() => onNavigate?.(c.id)} />
          ))}
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="ios-nav-related">Related domains</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <RelatedDomainChip label="Routing" pageId="navsdk-ios-routing" onNavigate={onNavigate} />
          <RelatedDomainChip label="Location" pageId="navsdk-ios-location" onNavigate={onNavigate} />
          <RelatedDomainChip label="CarPlay" pageId="navsdk-ios-carplay" onNavigate={onNavigate} />
          <RelatedDomainChip label="Virtual Horizon" pageId="navsdk-ios-horizon" onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CARPLAY — iOS exclusive
   ═══════════════════════════════════════════════════════════════════════════ */
export function NavSDKiOSCarPlay({ onNavigate }) {
  const cards = [
    {
      id: 'navsdk-ios-nav-carplay',
      title: 'CarPlay Navigation Session',
      desc: 'Activate a full CarPlay navigation session from an existing NavSDK guidance session. The SDK manages synchronisation between the phone and CarPlay scenes, ensuring ETA, manoeuvre, and progress state stay in lock-step.',
      Thumb: makeThumb(IlloNavSDKNavigation, L_CarPlay, IcoNavSDKNavigation),
    },
    {
      id: 'navsdk-ios-nav-carplay',
      title: 'CarPlay Map Template',
      desc: 'Configure a CPMapTemplate with TomTom map tiles rendered in the CarPlay scene. Respects Apple\'s safe-zone guidelines and CarPlay UI restrictions — no custom overlays outside the approved template hierarchy.',
      Thumb: makeThumb(IlloNavSDKNavigation, L_CarPlay, IcoNavSDKNavigation),
    },
    {
      id: 'navsdk-ios-nav-carplay',
      title: 'CarPlay Voice Prompts',
      desc: 'Route NavSDK turn-by-turn voice instructions through the CarPlay audio session. Integrates with AVAudioSession category management so prompts play correctly over the vehicle\'s head unit speakers without interrupting media.',
      Thumb: makeThumb(IlloNavSDKNavigation, L_CarPlay, IcoNavSDKNavigation),
    },
    {
      id: 'navsdk-ios-nav-carplay',
      title: 'CarPlay Deep Link',
      desc: 'Accept a destination passed from Siri or a third-party CarPlay app via CPNavigationSession. Translate the incoming MKMapItem into a NavSDK route request and start navigation without user interaction on the phone.',
      Thumb: makeThumb(IlloNavSDKNavigation, L_CarPlay, IcoNavSDKNavigation),
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>CarPlay</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Extend TomTom navigation to Apple CarPlay. Mirror active guidance sessions to the
        vehicle head unit, configure CPMapTemplates, route voice prompts through the car's speakers,
        and accept deep-link destinations from Siri — all within Apple's strict CarPlay template guidelines.
      </p>

      <div className="zone">
        <h2 className="sh" id="ios-cp-usecases">Use cases</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {cards.map((c, i) => (
            <UseCaseCard key={i} title={c.title} desc={c.desc} Thumb={c.Thumb} onClick={() => onNavigate?.(c.id)} />
          ))}
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="ios-cp-related">Related domains</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <RelatedDomainChip label="Navigation" pageId="navsdk-ios-navigation" onNavigate={onNavigate} />
          <RelatedDomainChip label="Routing" pageId="navsdk-ios-routing" onNavigate={onNavigate} />
          <RelatedDomainChip label="Map Display" pageId="navsdk-ios-map-display" onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   VIRTUAL HORIZON — iOS
   ═══════════════════════════════════════════════════════════════════════════ */
export function NavSDKiOSVirtualHorizon({ onNavigate }) {
  const cards = [
    {
      id: 'navsdk-ios-horizon-data',
      title: 'Horizon Engine',
      desc: 'Access a forward-looking road graph of the upcoming route via the HorizonEngine Swift API. Exposes curvature, gradient, lane count, and speed-limit data up to several kilometres ahead as a stream of HorizonElement updates.',
      Thumb: makeThumb(IlloNavSDKVirtualHorizon, L_HorizonPanel, IcoNavSDKVirtualHorizon),
    },
    {
      id: 'navsdk-ios-horizon-data',
      title: 'ADAS Data',
      desc: 'Feed horizon road attributes — slope, curvature, road class — into ADAS systems for predictive speed control, gear shifting, and energy regeneration optimisation. Data is delivered as typed Swift structs for low-latency processing.',
      Thumb: makeThumb(IlloNavSDKVirtualHorizon, L_HorizonPanel, IcoNavSDKVirtualHorizon),
    },
    {
      id: 'navsdk-ios-horizon-safety',
      title: 'Speed Alerts',
      desc: 'Subscribe to proactive speed-limit change events from the horizon via SpeedAlertDelegate, enabling ISA (Intelligent Speed Assistance) warnings before the limit changes rather than at the physical sign.',
      Thumb: makeThumb(IlloNavSDKVirtualHorizon, L_HorizonPanel, IcoNavSDKVirtualHorizon),
    },
    {
      id: 'navsdk-ios-horizon-hazards',
      title: 'Hazards',
      desc: 'Receive advance notifications of road hazards, accident hotspots, and temporary restrictions on the route ahead — sourced from TomTom\'s real-time traffic graph and delivered via the HazardDelegate protocol.',
      Thumb: makeThumb(IlloNavSDKVirtualHorizon, L_HorizonPanel, IcoNavSDKVirtualHorizon),
    },
    {
      id: 'navsdk-ios-horizon-data',
      title: 'Horizon Traffic',
      desc: 'Access traffic flow conditions several kilometres ahead via the horizon data stream, allowing the system to anticipate slowdowns and suggest proactive speed reductions for driver comfort and fuel saving.',
      Thumb: makeThumb(IlloNavSDKVirtualHorizon, L_HorizonPanel, IcoNavSDKVirtualHorizon),
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Virtual Horizon</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Look ahead on the route with the iOS Horizon Engine. Expose curvature, gradient, speed limits,
        and traffic data up to several kilometres ahead — the foundation for ADAS, ISA, and predictive driving features on iPhone.
      </p>

      <div className="zone">
        <h2 className="sh" id="ios-vh-usecases">Use cases</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {cards.map((c, i) => (
            <UseCaseCard key={i} title={c.title} desc={c.desc} Thumb={c.Thumb} onClick={() => onNavigate?.(c.id)} />
          ))}
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="ios-vh-related">Related domains</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <RelatedDomainChip label="Navigation" pageId="navsdk-ios-navigation" onNavigate={onNavigate} />
          <RelatedDomainChip label="Map Display" pageId="navsdk-ios-map-display" onNavigate={onNavigate} />
          <RelatedDomainChip label="Advanced" pageId="navsdk-ios-advanced" onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ADVANCED — iOS
   ═══════════════════════════════════════════════════════════════════════════ */
export function NavSDKiOSAdvanced({ onNavigate }) {
  const cards = [
    {
      id: 'navsdk-ios-adv-simulation',
      title: 'Simulation Mode',
      desc: 'Drive a route using a simulated CLLocation feed at configurable speed via SimulatedLocationEngine. Essential for testing navigation UI, guidance timing, and replanning logic in the iOS Simulator without physical movement.',
      Thumb: makeThumb(IlloNavSDKAdvanced, L_NavGuidance, IcoNavSDKAdvanced),
    },
    {
      id: 'navsdk-ios-adv-location',
      title: 'Map-Matched Location',
      desc: 'Snap raw CLLocation coordinates onto the road graph in real time using the SDK\'s map-matching layer, eliminating GPS drift in tunnels and urban canyons for a stable, road-anchored position during active guidance.',
      Thumb: makeThumb(IlloNavSDKAdvanced, L_NavGuidance, IcoNavSDKAdvanced),
    },
    {
      id: 'navsdk-ios-adv-telemetry',
      title: 'Logging & Diagnostics',
      desc: 'Configure SDK log levels and telemetry event streams using the NavSDKConfiguration builder. Forward session diagnostics to your observability stack — OSLog, Crashlytics, or a custom sink — for crash analysis and QA replay.',
      Thumb: makeThumb(IlloNavSDKAdvanced, L_NavGuidance, IcoNavSDKAdvanced),
    },
    {
      id: 'navsdk-ios-adv-vehicle',
      title: 'Vehicle Metadata',
      desc: 'Specify vehicle class, dimensions, fuel type, and speed profiles via the VehicleProfile Swift struct to unlock vehicle-specific routing constraints — essential for trucks, EVs, and commercial fleet applications.',
      Thumb: makeThumb(IlloNavSDKAdvanced, L_NavGuidance, IcoNavSDKAdvanced),
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Advanced</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Fine-tune the iOS NavSDK for production. Configure simulation with SimulatedLocationEngine,
        map-matched positioning, OSLog-based telemetry, and vehicle metadata to unlock the full depth
        of the SDK for complex Swift integration scenarios.
      </p>

      <div className="zone">
        <h2 className="sh" id="ios-adv-usecases">Use cases</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {cards.map((c, i) => (
            <UseCaseCard key={i} title={c.title} desc={c.desc} Thumb={c.Thumb} onClick={() => onNavigate?.(c.id)} />
          ))}
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="ios-adv-related">Related domains</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <RelatedDomainChip label="Location" pageId="navsdk-ios-location" onNavigate={onNavigate} />
          <RelatedDomainChip label="Navigation" pageId="navsdk-ios-navigation" onNavigate={onNavigate} />
          <RelatedDomainChip label="CarPlay" pageId="navsdk-ios-carplay" onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}
