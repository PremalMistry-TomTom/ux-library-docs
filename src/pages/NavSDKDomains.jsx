import { useTranslation } from 'react-i18next';
import PageActions from '../components/ui/PageActions';
import { useIlloStyle } from '../context/IlloStyleContext';
import {
  makeThumb,
  L_MapDisplay, L_SearchResult, L_Route, L_NavGuidance, L_HorizonPanel, L_ADAS,
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
  IlloNavSDKOffline,
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
   MAP DISPLAY
   ═══════════════════════════════════════════════════════════════════════════ */
export function NavSDKMapDisplay({ onNavigate }) {
  const cards = [
    {
      id: 'navsdk-map-compose',
      title: 'Map Display for Compose',
      desc: 'Embed the TomTom map into a Jetpack Compose UI using the TomTomMapComposable. Handles the full map lifecycle, gestures, and camera state within a composable hierarchy.',
      Thumb: makeThumb(IlloMapDisplay, L_MapDisplay, IcoMapDisplay),
    },
    {
      id: 'navsdk-map-views',
      title: 'Map Display for Views',
      desc: 'Integrate the TomTomMapView into an XML-based Android layout. Provides the same map capabilities as the Compose variant for View-system apps.',
      Thumb: makeThumb(IlloMapDisplay, L_MapDisplay, IcoMapDisplay),
    },
    {
      id: 'navsdk-map-styles',
      title: 'Map Styles',
      desc: 'Switch between built-in day and night map styles or apply a custom style URL to match your OEM brand. Controls road colours, label visibility, and landmark layers.',
      Thumb: makeThumb(IlloMapDisplay, L_MapDisplay, IcoMapDisplay),
    },
    {
      id: 'navsdk-map-camera',
      title: 'Camera & Animations',
      desc: 'Control the map camera position, zoom, tilt, and bearing programmatically. Animate transitions with built-in easing curves for smooth, driving-safe panning.',
      Thumb: makeThumb(IlloMapDisplay, L_MapDisplay, IcoMapDisplay),
    },
    {
      id: 'navsdk-map-markers',
      title: 'Markers',
      desc: 'Add custom icon markers, anchored to geographic coordinates. Supports tap interaction, clustering, and dynamic updates as route or POI data changes.',
      Thumb: makeThumb(IlloMapDisplay, L_MapDisplay, IcoMapDisplay),
    },
    {
      id: 'navsdk-map-traffic',
      title: 'Traffic',
      desc: 'Overlay real-time traffic flow and incident data directly on the map. Traffic tiles update automatically and can be toggled independently from the base map style.',
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
        Render TomTom maps inside Compose or View-based Android apps. Control map styles, camera
        animations, markers, and real-time traffic overlays — all through a single unified SDK surface.
      </p>

      <div className="zone">
        <h2 className="sh" id="md-usecases">Use cases</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {cards.map(c => (
            <UseCaseCard key={c.id} title={c.title} desc={c.desc} Thumb={c.Thumb} onClick={() => onNavigate?.(c.id)} />
          ))}
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="md-related">Related domains</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <RelatedDomainChip label="Location" pageId="navsdk-location" onNavigate={onNavigate} />
          <RelatedDomainChip label="Navigation" pageId="navsdk-navigation" onNavigate={onNavigate} />
          <RelatedDomainChip label="Virtual Horizon" pageId="navsdk-horizon" onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LOCATION
   ═══════════════════════════════════════════════════════════════════════════ */
export function NavSDKLocation({ onNavigate }) {
  const cards = [
    {
      id: 'navsdk-location-quickstart',
      title: 'Location Provider',
      desc: 'Access the device\'s fused GNSS location and expose it to the NavSDK. The built-in provider handles platform permissions, satellite fix quality, and update rates.',
      Thumb: makeThumb(IlloNavSDKLocation, L_MapDisplay, IcoNavSDKLocation),
    },
    {
      id: 'navsdk-location-quickstart',
      title: 'Background Location',
      desc: 'Continue receiving location updates when the app moves to the background, enabling continuous navigation and track recording without foreground constraints.',
      Thumb: makeThumb(IlloNavSDKLocation, L_MapDisplay, IcoNavSDKLocation),
    },
    {
      id: 'navsdk-location-quickstart',
      title: 'Custom Location Engine',
      desc: 'Supply your own location source — dead reckoning hardware, DR sensor fusion, or a simulated GPS feed — by implementing the LocationEngine interface.',
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
        Connect real-world GNSS positioning to the SDK. Use the built-in fused provider or plug in
        a custom location engine — from dead-reckoning hardware to simulation feeds.
      </p>

      <div className="zone">
        <h2 className="sh" id="loc-usecases">Use cases</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {cards.map((c, i) => (
            <UseCaseCard key={i} title={c.title} desc={c.desc} Thumb={c.Thumb} onClick={() => onNavigate?.(c.id)} />
          ))}
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="loc-related">Related domains</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <RelatedDomainChip label="Map Display" pageId="navsdk-map-display" onNavigate={onNavigate} />
          <RelatedDomainChip label="Navigation" pageId="navsdk-navigation" onNavigate={onNavigate} />
          <RelatedDomainChip label="Advanced" pageId="navsdk-advanced" onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SEARCH
   ═══════════════════════════════════════════════════════════════════════════ */
export function NavSDKSearch({ onNavigate }) {
  const cards = [
    {
      id: 'navsdk-search-find',
      title: 'Fuzzy Search',
      desc: 'Run a single typo-tolerant query across addresses, POI names, and categories. Returns ranked results with coordinates, metadata, and distance from a reference point.',
      Thumb: makeThumb(IlloNavSDKSearch, L_SearchResult, IcoNavSDKSearch),
    },
    {
      id: 'navsdk-search-find',
      title: 'Along-Route Search',
      desc: 'Find points of interest within a configurable corridor along an active route — ideal for discovering fuel, food, or charging stops without leaving the planned path.',
      Thumb: makeThumb(IlloNavSDKSearch, L_SearchResult, IcoNavSDKSearch),
    },
    {
      id: 'navsdk-search-reverse',
      title: 'Reverse Geocoding',
      desc: 'Convert a lat/lon coordinate into a human-readable address. Supports road-level, city, and postal code resolution with country-specific address formatting.',
      Thumb: makeThumb(IlloNavSDKSearch, L_SearchResult, IcoNavSDKSearch),
    },
    {
      id: 'navsdk-search-find',
      title: 'Search Suggestions',
      desc: 'Fetch real-time autocomplete suggestions as the user types, with debouncing and category classification built in. Reduces API calls while keeping results responsive.',
      Thumb: makeThumb(IlloNavSDKSearch, L_SearchResult, IcoNavSDKSearch),
    },
    {
      id: 'navsdk-search-ev',
      title: 'EV Station Search',
      desc: 'Locate EV charging stations near a point or along a route, filtered by connector type, power level, and real-time availability from the TomTom EV Charging API.',
      Thumb: makeThumb(IlloNavSDKSearch, L_SearchResult, IcoNavSDKSearch),
    },
    {
      id: 'navsdk-search-byod',
      title: 'Bring Your Own Data',
      desc: 'Augment TomTom search results with proprietary POI data. Implement the custom search provider interface to blend in-house data with TomTom\'s global index.',
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
        Add destination search, autocomplete, reverse geocoding, and along-route POI discovery
        to your navigation app. Extend with your own data sources via the custom provider interface.
      </p>

      <div className="zone">
        <h2 className="sh" id="srch-usecases">Use cases</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {cards.map((c, i) => (
            <UseCaseCard key={i} title={c.title} desc={c.desc} Thumb={c.Thumb} onClick={() => onNavigate?.(c.id)} />
          ))}
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="srch-related">Related domains</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <RelatedDomainChip label="Routing" pageId="navsdk-routing" onNavigate={onNavigate} />
          <RelatedDomainChip label="Navigation" pageId="navsdk-navigation" onNavigate={onNavigate} />
          <RelatedDomainChip label="Map Display" pageId="navsdk-map-display" onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROUTING
   ═══════════════════════════════════════════════════════════════════════════ */
export function NavSDKRouting({ onNavigate }) {
  const cards = [
    {
      id: 'navsdk-route-planning',
      title: 'Calculate Route',
      desc: 'Plan a point-to-point route with vehicle-aware settings, real-time traffic, and avoidance options. Returns full geometry, ETA, and manoeuvre guidance in one call.',
      Thumb: makeThumb(IlloNavSDKRouting, L_Route, IcoNavSDKRouting),
    },
    {
      id: 'navsdk-route-alternatives',
      title: 'Alternative Routes',
      desc: 'Request up to three route alternatives simultaneously. Each alternative is scored by travel time, distance, and eco-efficiency so drivers can choose their preference.',
      Thumb: makeThumb(IlloNavSDKRouting, L_Route, IcoNavSDKRouting),
    },
    {
      id: 'navsdk-route-sections',
      title: 'Route Sections',
      desc: 'Break a route into typed sections — motorway, tunnel, ferry, toll, traffic delay — to surface cost breakdowns, restrictions, and per-segment travel time estimates.',
      Thumb: makeThumb(IlloNavSDKRouting, L_Route, IcoNavSDKRouting),
    },
    {
      id: 'navsdk-route-import-export',
      title: 'Import, Export & Modify',
      desc: 'Serialise routes to JSON for persistence or sharing, import external GPX/GeoJSON tracks, and dynamically insert or remove waypoints during an active journey.',
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
        Plan, compare, and manage routes within the NavSDK. Calculate traffic-aware alternatives,
        inspect route sections, and modify waypoints on the fly during active navigation.
      </p>

      <div className="zone">
        <h2 className="sh" id="rt-usecases">Use cases</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {cards.map((c, i) => (
            <UseCaseCard key={i} title={c.title} desc={c.desc} Thumb={c.Thumb} onClick={() => onNavigate?.(c.id)} />
          ))}
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="rt-related">Related domains</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <RelatedDomainChip label="Navigation" pageId="navsdk-navigation" onNavigate={onNavigate} />
          <RelatedDomainChip label="Search" pageId="navsdk-search" onNavigate={onNavigate} />
          <RelatedDomainChip label="Offline" pageId="navsdk-offline" onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════════════════════════════════════ */
export function NavSDKNavigation({ onNavigate }) {
  const cards = [
    {
      id: 'navsdk-nav-quickstart',
      title: 'Start Navigation',
      desc: 'Begin a guided navigation session from a planned route. The guidance engine handles position matching, progress tracking, and automatic arrival detection.',
      Thumb: makeThumb(IlloNavSDKNavigation, L_NavGuidance, IcoNavSDKNavigation),
    },
    {
      id: 'navsdk-nav-turn-by-turn',
      title: 'Turn-by-Turn Guidance',
      desc: 'Receive structured manoeuvre events — turn type, street name, distance, and icon — at every decision point, ready to drive a custom NIP or cluster display.',
      Thumb: makeThumb(IlloNavSDKNavigation, L_NavGuidance, IcoNavSDKNavigation),
    },
    {
      id: 'navsdk-nav-voice',
      title: 'Voice Instructions',
      desc: 'Trigger TTS voice prompts at the correct distance before each manoeuvre. Supports custom TTS engines, language localisation, and mute/unmute state management.',
      Thumb: makeThumb(IlloNavSDKNavigation, L_NavGuidance, IcoNavSDKNavigation),
    },
    {
      id: 'navsdk-nav-replanning',
      title: 'Continuous Replanning',
      desc: 'Automatically recalculate the route when the driver deviates from the planned path or when a significant traffic incident appears ahead on the current route.',
      Thumb: makeThumb(IlloNavSDKNavigation, L_NavGuidance, IcoNavSDKNavigation),
    },
    {
      id: 'navsdk-nav-safety',
      title: 'Safety Locations',
      desc: 'Receive advance warnings for speed cameras, danger zones, and school areas along the route with configurable alert distances and dismissal logic.',
      Thumb: makeThumb(IlloNavSDKNavigation, L_NavGuidance, IcoNavSDKNavigation),
    },
    {
      id: 'navsdk-nav-free-driving',
      title: 'Free Driving Mode',
      desc: 'Operate the map and location engine without an active route — useful for live tracking, exploration, and map-matched display without turn-by-turn guidance.',
      Thumb: makeThumb(IlloNavSDKNavigation, L_NavGuidance, IcoNavSDKNavigation),
    },
    {
      id: 'navsdk-nav-saving',
      title: 'Saving & Resuming',
      desc: 'Persist navigation state across app restarts or process death. Resume a previously active session without requiring the driver to re-enter their destination.',
      Thumb: makeThumb(IlloNavSDKNavigation, L_NavGuidance, IcoNavSDKNavigation),
    },
    {
      id: 'navsdk-nav-traffic',
      title: 'Traffic-Aware Navigation',
      desc: 'Real-time traffic monitoring integrated into the guidance loop — automatically detects delays ahead and recalculates the fastest route without user intervention.',
      Thumb: makeThumb(IlloNavSDKNavigation, L_NavGuidance, IcoNavSDKNavigation),
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Navigation</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Drive a full turn-by-turn navigation experience — guidance events, voice instructions,
        safety alerts, continuous replanning, and session persistence — all from the NavSDK guidance engine.
      </p>

      <div className="zone">
        <h2 className="sh" id="nav-usecases">Use cases</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {cards.map((c, i) => (
            <UseCaseCard key={i} title={c.title} desc={c.desc} Thumb={c.Thumb} onClick={() => onNavigate?.(c.id)} />
          ))}
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="nav-related">Related domains</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <RelatedDomainChip label="Routing" pageId="navsdk-routing" onNavigate={onNavigate} />
          <RelatedDomainChip label="Location" pageId="navsdk-location" onNavigate={onNavigate} />
          <RelatedDomainChip label="Virtual Horizon" pageId="navsdk-horizon" onNavigate={onNavigate} />
          <RelatedDomainChip label="Offline" pageId="navsdk-offline" onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   OFFLINE
   ═══════════════════════════════════════════════════════════════════════════ */
export function NavSDKOffline({ onNavigate }) {
  const cards = [
    {
      id: 'navsdk-offline-setup',
      title: 'Map Downloads',
      desc: 'Download country or region map packages for offline use. The SDK manages tile storage, deduplication, and storage quota with a configurable cache policy.',
      Thumb: makeThumb(IlloNavSDKOffline, L_MapDisplay, IcoNavSDKOffline),
    },
    {
      id: 'navsdk-offline-setup',
      title: 'Offline Routing',
      desc: 'Calculate routes entirely on-device when a network connection is unavailable. Offline routing uses the downloaded map graph and honours vehicle profile constraints.',
      Thumb: makeThumb(IlloNavSDKOffline, L_MapDisplay, IcoNavSDKOffline),
    },
    {
      id: 'navsdk-offline-mgmt',
      title: 'Incremental Updates',
      desc: 'Keep offline maps current with delta updates that only transfer changed tiles rather than full region re-downloads — minimising bandwidth on vehicle connections.',
      Thumb: makeThumb(IlloNavSDKOffline, L_MapDisplay, IcoNavSDKOffline),
    },
    {
      id: 'navsdk-offline-mgmt',
      title: 'Manual Map Management',
      desc: 'List, delete, and inspect downloaded regions programmatically. Provides full control over offline storage lifecycle for fleet devices with limited storage capacity.',
      Thumb: makeThumb(IlloNavSDKOffline, L_MapDisplay, IcoNavSDKOffline),
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Offline</h1>
        <PageActions />
      </div>
      <p className="quick-answer">
        Enable fully offline navigation — download regions, route without connectivity, and keep
        cached maps up to date with incremental delta updates to minimise data usage.
      </p>

      <div className="zone">
        <h2 className="sh" id="off-usecases">Use cases</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {cards.map((c, i) => (
            <UseCaseCard key={i} title={c.title} desc={c.desc} Thumb={c.Thumb} onClick={() => onNavigate?.(c.id)} />
          ))}
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="off-related">Related domains</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <RelatedDomainChip label="Routing" pageId="navsdk-routing" onNavigate={onNavigate} />
          <RelatedDomainChip label="Navigation" pageId="navsdk-navigation" onNavigate={onNavigate} />
          <RelatedDomainChip label="Advanced" pageId="navsdk-advanced" onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   VIRTUAL HORIZON
   ═══════════════════════════════════════════════════════════════════════════ */
export function NavSDKVirtualHorizon({ onNavigate }) {
  const cards = [
    {
      id: 'navsdk-horizon-data',
      title: 'Horizon Engine',
      desc: 'Access a forward-looking road graph of the upcoming route. The Horizon Engine exposes curvature, gradient, lane count, and speed-limit data up to several kilometres ahead.',
      Thumb: makeThumb(IlloNavSDKVirtualHorizon, L_HorizonPanel, IcoNavSDKVirtualHorizon),
    },
    {
      id: 'navsdk-horizon-data',
      title: 'ADAS Data',
      desc: 'Feed horizon road attributes — slope, curvature, road class — into ADAS systems for predictive speed control, gear shifting, and energy regeneration optimisation.',
      Thumb: makeThumb(IlloNavSDKVirtualHorizon, L_HorizonPanel, IcoNavSDKVirtualHorizon),
    },
    {
      id: 'navsdk-horizon-safety',
      title: 'Speed Alerts',
      desc: 'Subscribe to proactive speed-limit change events from the horizon, enabling ISA (Intelligent Speed Assistance) warnings before the limit changes rather than at the sign.',
      Thumb: makeThumb(IlloNavSDKVirtualHorizon, L_HorizonPanel, IcoNavSDKVirtualHorizon),
    },
    {
      id: 'navsdk-horizon-hazards',
      title: 'Hazards',
      desc: 'Receive advance notifications of road hazards, accident hotspots, and temporary restrictions on the route ahead — sourced from TomTom\'s real-time traffic graph.',
      Thumb: makeThumb(IlloNavSDKVirtualHorizon, L_HorizonPanel, IcoNavSDKVirtualHorizon),
    },
    {
      id: 'navsdk-horizon-traffic',
      title: 'Horizon Traffic',
      desc: 'Access traffic flow conditions several kilometres ahead, allowing the system to anticipate slowdowns and suggest proactive speed reductions for comfort and fuel saving.',
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
        Look ahead on the route with the Horizon Engine. Expose curvature, gradient, speed limits,
        and traffic data up to several kilometres ahead — the foundation for ADAS, ISA, and predictive driving features.
      </p>

      <div className="zone">
        <h2 className="sh" id="vh-usecases">Use cases</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {cards.map((c, i) => (
            <UseCaseCard key={i} title={c.title} desc={c.desc} Thumb={c.Thumb} onClick={() => onNavigate?.(c.id)} />
          ))}
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="vh-related">Related domains</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <RelatedDomainChip label="Navigation" pageId="navsdk-navigation" onNavigate={onNavigate} />
          <RelatedDomainChip label="Map Display" pageId="navsdk-map-display" onNavigate={onNavigate} />
          <RelatedDomainChip label="Advanced" pageId="navsdk-advanced" onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ADVANCED
   ═══════════════════════════════════════════════════════════════════════════ */
export function NavSDKAdvanced({ onNavigate }) {
  const cards = [
    {
      id: 'navsdk-adv-simulation',
      title: 'Simulation Mode',
      desc: 'Drive a route using a simulated GPS feed at configurable speed. Essential for testing navigation UI, guidance timing, and replanning logic without physical movement.',
      Thumb: makeThumb(IlloNavSDKAdvanced, L_NavGuidance, IcoNavSDKAdvanced),
    },
    {
      id: 'navsdk-adv-map-matched',
      title: 'Map-Matched Location',
      desc: 'Snap raw GNSS coordinates onto the road graph in real time, eliminating GPS drift in tunnels and urban canyons for a stable, road-anchored position during guidance.',
      Thumb: makeThumb(IlloNavSDKAdvanced, L_NavGuidance, IcoNavSDKAdvanced),
    },
    {
      id: 'navsdk-adv-telemetry',
      title: 'Logging & Diagnostics',
      desc: 'Configure SDK log levels and telemetry event streams. Send session diagnostics to your observability stack for crash analysis, performance tuning, and QA replay.',
      Thumb: makeThumb(IlloNavSDKAdvanced, L_NavGuidance, IcoNavSDKAdvanced),
    },
    {
      id: 'navsdk-adv-vehicle',
      title: 'Vehicle Metadata',
      desc: 'Specify vehicle class, dimensions, fuel type, and speed profiles to unlock vehicle-specific routing constraints — essential for trucks, EVs, and commercial fleets.',
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
        Fine-tune the NavSDK for production. Configure simulation, map-matched positioning, telemetry,
        and vehicle metadata to unlock the full depth of the SDK for complex integration scenarios.
      </p>

      <div className="zone">
        <h2 className="sh" id="adv-usecases">Use cases</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {cards.map((c, i) => (
            <UseCaseCard key={i} title={c.title} desc={c.desc} Thumb={c.Thumb} onClick={() => onNavigate?.(c.id)} />
          ))}
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="adv-related">Related domains</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <RelatedDomainChip label="Location" pageId="navsdk-location" onNavigate={onNavigate} />
          <RelatedDomainChip label="Navigation" pageId="navsdk-navigation" onNavigate={onNavigate} />
          <RelatedDomainChip label="Offline" pageId="navsdk-offline" onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}
