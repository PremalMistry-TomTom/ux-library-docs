import { useTranslation } from 'react-i18next';
import Callout from '../components/ui/Callout';
import PageActions from '../components/ui/PageActions';
import { useIlloStyle } from '../context/IlloStyleContext';
import { ThemeBar } from './IntroIllustrations';

/* ─── UX Library — App Customisation imports ─────────────────────────────── */
import { ZonesDiagram, ResizeDemo, UIStateExplorer }   from './HomeScreenLayout';
import { ButtonBarConfig, SearchEntryConfig }           from './NavigationControls';
import { GuidanceMock }                                  from './HorizonPanel';
import { NIPMock }                                       from './InstructionPanel';
import { ETAMock, CONTENT_FIELDS as ETA_FIELDS }         from './ETAPanel';
import { PositioningDiagram }                            from './RouteBar';
import { SearchMock, LPPMock, TransitionExplorer, SearchUICustomiser } from './SearchEngine';

/* ─── UX Library — EV Support imports (EVSupport overview) ──────────────── */
import { ArchDiagram as EVArchDiagram, EVSearchMock, StationDetailMock, RouteMock, PreferencesMock } from './EVSupport';

/* ─── UX Library — EV sub-page imports ──────────────────────────────────── */
import { MSPBuilder }                                    from './EVChargingSearch';
import { SoCStrip, RangeRingMock, HorizonMock }          from './EVNavUI';
import { TripTimeline, StopStrategyCalculator }          from './EVRouting';
import { EVBatteryDemo }                                 from './EVBattery';

/* ─── UX Library — Map Customisation imports ─────────────────────────────── */
import { LayerConfigurator, IncidentFilter, RefreshDemo } from './Traffic';
import { StyleExplorer, TiltDemo, StyleURIDemo }          from './MapStyle';
import { VisibilityConfigurator, ZoneDiagram, StyleTabs } from './SafetyLocations';

/* ─── UX Library — Other imports ─────────────────────────────────────────── */
import { ArchDiagram as TAIAArchDiagram }                from './TAIAOverview';
import { BoundaryDiagram }                               from './SpeechToText';
import { ClusterDisplay }                                from './Cluster';

/* ─── NavSDK demo imports ────────────────────────────────────────────────── */
import {
  NavQuickstartDemo, TurnByTurnDemo, VoiceInstructionsDemo,
  ReplanningDemo, SafetyDemo, FreeDrivingDemo,
} from './NavSDKNavigationPages';
import {
  RoutingQuickstartDemo, RoutePlanningDemo, RouteAlternativesDemo,
  RouteSectionsDemo, ImportExportDemo,
} from './NavSDKRoutingPages';
import { MapComposeDemo, MapStylesDemo, MapTrafficDemo } from './NavSDKMapPages';
import { OfflineDownloadDemo }                           from './NavSDKOfflinePages';

/* ─── Status badge ───────────────────────────────────────────────────────── */
const STATUS = {
  mock:    { label: 'SVG mock',           bg: '#fefce8', color: '#92400e', border: '#fde68a' },
  needed:  { label: 'Screenshot needed',  bg: '#fff5f5', color: '#991b1b', border: '#fecaca' },
  done:    { label: 'Static .png',        bg: '#f0fdf4', color: '#14532d', border: '#bbf7d0' },
  planned: { label: 'Planned',            bg: 'var(--bg)', color: 'var(--muted)', border: 'var(--border)' },
  live:    { label: 'Live demo',          bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe' },
};

function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.planned;
  return (
    <span style={{
      fontSize: '0.875rem', fontWeight: 700, padding: '2px 7px', borderRadius: 4,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      whiteSpace: 'nowrap',
    }}>{s.label}</span>
  );
}

/* ─── State chips ────────────────────────────────────────────────────────── */
function StateChips({ states }) {
  if (!states?.length) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {states.map(s => (
        <span key={s} style={{
          fontSize: '0.875rem', padding: '2px 7px', borderRadius: 20,
          background: 'var(--bg)', border: '1px solid var(--border)',
          color: 'var(--mid)', whiteSpace: 'nowrap',
        }}>{s}</span>
      ))}
    </div>
  );
}

/* ─── Preview card — full width ──────────────────────────────────────────── */
function PreviewCard({ name, component, desc, states, status, preview, demoBg }) {
  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: 20,
      overflow: 'hidden',
      background: 'var(--surface)',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    }}>
      {/* Preview area — full width, theme-driven background */}
      <div style={{
        background: demoBg,
        width: '100%',
        overflowY: 'auto',
        overflowX: 'auto',
        padding: 24,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        transition: 'background 0.2s',
      }}>
        {preview
          ? preview.node
          : (
            <div style={{
              width: '100%', height: 120,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#374151', fontSize: '0.75rem', fontStyle: 'italic',
            }}>
              No preview yet
            </div>
          )
        }
      </div>

      {/* Metadata strip */}
      <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text)' }}>{name}</span>
          <StatusBadge status={status || 'mock'} />
        </div>
        {component && (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--muted)' }}>
            {component}
          </div>
        )}
        <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--mid)', lineHeight: 1.5 }}>{desc}</p>
        <StateChips states={states} />
      </div>
    </div>
  );
}

/* ─── Inventory sections ─────────────────────────────────────────────────── */

function buildSections(t) {
  return [
    /* ══════════════════════════════════════ UX Library — App Customisation ══ */
    {
      id: 'home-screen-layout', group: 'Home Screen Layout', navGroup: 'App Customisation',
      desc: 'Application area zones, dynamic resize, and UI state signalling.',
      screens: [
        { name: 'Zone overview', component: 'ZonesDiagram', desc: '4 named zones annotated over a dark map.', states: ['Nav area highlighted', 'Safe area highlighted', 'Display area highlighted', 'Controls zone highlighted'], preview: { node: <ZonesDiagram t={t} /> } },
        { name: 'Resize demo',   component: 'ResizeDemo',   desc: 'Map fills screen with configurable insets on all 4 sides.', states: ['Default 0,0,0,0', 'Right inset 35%', 'Right inset 50%', 'Top 10% + Right 35%', 'Bottom 20%'], preview: { node: <ResizeDemo t={t} /> } },
        { name: 'UI state — Passive', component: 'UIStateExplorer', desc: '4-dimension state signal in passive mode.', states: ['Idle browsing', 'Route planning', 'Search open', 'LPP open'], preview: { node: <UIStateExplorer t={t} /> } },
      ],
    },
    {
      id: 'nav-controls', group: 'Navigation Controls', navGroup: 'App Customisation',
      desc: 'Button bar position, button visibility toggles, and search entry point.',
      screens: [
        { name: 'Button bar config',   component: 'ButtonBarConfig',   desc: 'Map controls bar with position and per-button visibility toggles.', states: ['All buttons visible', 'Search hidden', 'Mute hidden', 'Settings hidden', 'All hidden'], preview: { node: <ButtonBarConfig t={t} /> } },
        { name: 'Search entry point',  component: 'SearchEntryConfig', desc: 'Search as full panel or as a button inside the button bar.', states: ['Default (panel visible)', 'Button visible in bar', 'Button hidden'], preview: { node: <SearchEntryConfig t={t} /> } },
      ],
    },
    {
      id: 'horizon-panel', group: 'Horizon Panel', navGroup: 'App Customisation',
      desc: 'Composed guidance panel combining NIP, Upcoming Events strip, and ETA bar.',
      screens: [
        { name: 'Composed — right docked', component: 'GuidanceMock', desc: 'Full composed panel (NIP + Upcoming + ETA) anchored to the right edge.', states: ['Composed — right'], preview: { node: <GuidanceMock position="RIGHT" decomposed={false} /> } },
        { name: 'Composed — left docked',  component: 'GuidanceMock', desc: 'Full composed panel anchored to the left edge.', states: ['Composed — left'], preview: { node: <GuidanceMock position="LEFT"  decomposed={false} /> } },
        { name: 'Decomposed panels',       component: 'GuidanceMock', desc: 'NIP, Upcoming Events, and ETA rendered as separate floating panels.', states: ['NIP only', 'NIP + upcoming strip', 'NIP + ETA bar'], preview: { node: <GuidanceMock position="RIGHT" decomposed={true} /> } },
      ],
    },
    {
      id: 'instruction-panel', group: 'Next Instruction Panel', navGroup: 'App Customisation',
      desc: 'Standalone NIP positioned freely anywhere on the map surface.',
      screens: [
        { name: 'NIP positions', component: 'NIPMock', desc: 'The NIP can be anchored to 5 positions relative to the navigation area.', states: ['Top left', 'Top centre', 'Top right', 'Bottom left', 'Bottom right'], preview: { node: <NIPMock position="TOP_LEFT" /> } },
      ],
    },
    {
      id: 'eta-panel', group: 'ETA Panel', navGroup: 'App Customisation',
      desc: 'Standalone ETA bar showing remaining time, distance, and arrival time.',
      screens: [
        { name: 'ETA panel positions', component: 'ETAMock', desc: 'The ETA bar supports 6 anchor positions.', states: ['Bottom left', 'Bottom centre', 'Bottom right', 'Top left', 'Top centre', 'Top right'], preview: { node: <ETAMock position="BOTTOM_LEFT" visibleFields={ETA_FIELDS.filter(f => f.id !== 'soc')} /> } },
      ],
    },
    {
      id: 'route-bar', group: 'Route Bar', navGroup: 'App Customisation',
      desc: 'Upcoming events visualised as a scrollable strip along the active route.',
      screens: [
        { name: 'Positioning diagram', component: 'PositioningDiagram', desc: 'Shows where the Route Bar sits in the layout relative to NIP and ETA.', states: ['Free drive (hidden)', 'Guided drive', 'Landscape'], status: 'planned', preview: { node: <PositioningDiagram /> } },
      ],
    },
    {
      id: 'search-engine', group: 'Search Engine', navGroup: 'App Customisation',
      desc: 'Search provider integration, connectivity states, and LPP enrichment.',
      screens: [
        { name: 'Online search (third-party)',  component: 'SearchMock',         desc: 'Search bar and results in online mode with third-party provider attribution.', states: ['Empty state', 'With results', '"Powered by Google" badge'], preview: { node: <SearchMock /> } },
        { name: 'Offline search (TomTom)',      component: 'SearchMock',         desc: 'TomTom-only offline search — no attribution badge.', states: ['Empty state', 'With results'], preview: { node: <SearchMock isOnline={false} /> } },
        { name: 'Connectivity transitions',     component: 'TransitionExplorer', desc: 'Modal or inline indicator when the provider switches on connectivity change.', states: ['Online → offline', 'Offline → online'], preview: { node: <TransitionExplorer /> } },
        { name: 'Search UI customisation',      component: 'SearchUICustomiser', desc: 'Interactive explorer for Basic, Enriched, Filtered, and Attribution UI variants.', states: ['Basic', 'Enriched', 'With filters', 'Google attribution'], preview: { node: <SearchUICustomiser /> } },
        { name: 'Location Preview Panel',       component: 'LPPMock',            desc: 'Bottom sheet showing place details after selecting a search result.', states: ['Default (no route)', 'With route options', 'POI details', 'Address only'], preview: { node: <LPPMock /> } },
      ],
    },

    /* ═══════════════════════════════════════ UX Library — Map Customisation ═ */
    {
      id: 'map-style', group: 'Map Style', navGroup: 'Map Customisation',
      desc: 'Style switcher, camera tilt/pitch controls, and style URI builder.',
      screens: [
        { name: 'Style explorer',  component: 'StyleExplorer', desc: 'Switch between Day, Night, and Custom OEM palette map styles.', states: ['Day', 'Night', 'Custom OEM'], status: 'live', preview: { node: <StyleExplorer /> } },
        { name: 'Style URI builder', component: 'StyleURIDemo', desc: 'Compose a style URI from host, version, and variant parameters.', states: ['Default', 'Custom host', 'Versioned'], status: 'live', preview: { node: <StyleURIDemo /> } },
        { name: 'Tilt / pitch demo', component: 'TiltDemo',     desc: 'Camera tilt control from 0° to 60° with live map preview.', states: ['0° (top-down)', '30°', '60° (perspective)'], status: 'live', preview: { node: <TiltDemo /> } },
      ],
    },
    {
      id: 'traffic', group: 'Traffic', navGroup: 'Map Customisation',
      desc: 'Traffic flow and incident overlay configuration, filtering, and refresh.',
      screens: [
        { name: 'Layer configurator', component: 'LayerConfigurator', desc: 'Toggle flow (RELATIVE / ABSOLUTE) and incident layers independently on the map.', states: ['Flow only', 'Incidents only', 'Flow + incidents', 'All off'], status: 'live', preview: { node: <LayerConfigurator /> } },
        { name: 'Incident filter',    component: 'IncidentFilter',    desc: 'Filter incident categories — construction, accident, congestion, hazard.', states: ['All categories', 'Accidents only', 'Construction only', 'Custom selection'], status: 'live', preview: { node: <IncidentFilter /> } },
        { name: 'Refresh demo',       component: 'RefreshDemo',       desc: 'Configure automatic traffic data refresh interval (15 s – 5 min).', states: ['15 s', '30 s', '1 min', '5 min', 'Manual only'], status: 'live', preview: { node: <RefreshDemo /> } },
      ],
    },
    {
      id: 'safety-locations', group: 'Safety Locations', navGroup: 'Map Customisation',
      desc: 'Safety location visibility, zone types, and custom iconography.',
      screens: [
        { name: 'Visibility configurator', component: 'VisibilityConfigurator', desc: 'Enable / disable speed cameras, danger zones, and school zones independently.', states: ['All visible', 'Cameras only', 'Zones only', 'All hidden'], status: 'live', preview: { node: <VisibilityConfigurator /> } },
        { name: 'Zone diagram',            component: 'ZoneDiagram',            desc: 'Visual breakdown of all supported zone types and their alert radii.', states: ['Static'], status: 'mock', preview: { node: <ZoneDiagram /> } },
        { name: 'Style tabs',              component: 'StyleTabs',              desc: 'Switch between icon packs (default, compact, high-visibility) for safety markers.', states: ['Default', 'Compact', 'High-visibility'], status: 'live', preview: { node: <StyleTabs /> } },
      ],
    },

    /* ═══════════════════════════════════════ UX Library — EV & Charging ═════ */
    {
      id: 'ev-support', group: 'EV Support — Overview', navGroup: 'EV & Charging',
      desc: 'Architecture overview, charging station search, and LDEVR route planning.',
      screens: [
        { name: 'Architecture diagram',  component: 'EVArchDiagram',    desc: 'Data flow: Vehicle BMS → Vehicle Integration API → NavSDK → LDEVR / EV Search API.', states: ['Static'], preview: { node: <EVArchDiagram /> } },
        { name: 'EV charging search',    component: 'EVSearchMock',     desc: 'Charging station list with speed / payment / services filter chips.', states: ['Speed filter', 'Payment filter', 'Services filter'], preview: { node: <EVSearchMock /> } },
        { name: 'Station detail panel',  component: 'StationDetailMock',desc: 'Full station detail: name, address, connectors with live availability.', states: ['CCS + Type 2', 'Compatible', 'Incompatible connector'], preview: { node: <StationDetailMock /> } },
        { name: 'LDEVR route preview',   component: 'RouteMock',        desc: 'Route timeline with charging stops showing arrival SoC, target SoC, charge time.', states: ['Plan charging: ON', 'Plan charging: OFF', 'Out-of-range warning'], preview: { node: <RouteMock /> } },
        { name: 'Route preferences',     component: 'PreferencesMock',  desc: 'Min battery sliders and avoid-tolls/unpaved toggles.', states: ['Default 15%/15%', 'High threshold 30%/25%', 'Avoid tolls on'], preview: { node: <PreferencesMock /> } },
      ],
    },
    {
      id: 'ev-charging-search', group: 'EV Charging Search', navGroup: 'EV & Charging',
      desc: 'MSP operator builder and charging network preference configuration.',
      screens: [
        { name: 'MSP operator builder', component: 'MSPBuilder', desc: 'Interactive configurator for Mobility Service Provider preferences — operator priority, contract type, and connector compatibility.', states: ['Default operators', 'Custom priority order', 'Contract filter active'], status: 'live', preview: { node: <MSPBuilder t={t} /> } },
      ],
    },
    {
      id: 'ev-routing', group: 'EV Long-Distance Routing', navGroup: 'EV & Charging',
      desc: 'Trip timeline with charging waypoints and stop strategy optimisation.',
      screens: [
        { name: 'Trip timeline',           component: 'TripTimeline',           desc: 'Full trip visualisation with charging stops, SoC levels, and estimated charge times at each stop.', states: ['2-stop route', 'Direct (no stops)', 'Detour charging'], status: 'live', preview: { node: <TripTimeline /> } },
        { name: 'Stop strategy calculator', component: 'StopStrategyCalculator', desc: 'Interactive planner comparing fast-charge few-stops vs slow-charge many-stops strategies.', states: ['Fastest strategy', 'Fewest stops', 'Cheapest stops', 'Custom'], status: 'live', preview: { node: <StopStrategyCalculator t={t} /> } },
      ],
    },
    {
      id: 'ev-nav-ui', group: 'EV In-Navigation UI', navGroup: 'EV & Charging',
      desc: 'State-of-charge strip, range ring, and horizon panel during active EV navigation.',
      screens: [
        { name: 'SoC strip',     component: 'SoCStrip',   desc: 'Compact battery state-of-charge bar shown at the bottom of the navigation view.', states: ['High SoC (>60%)', 'Low SoC (<20%)', 'Charging'], status: 'live', preview: { node: <SoCStrip state="driving" /> } },
        { name: 'Range ring',    component: 'RangeRingMock', desc: 'Circular range overlay on the map showing reachable distance on current charge.', states: ['Normal range', 'Low range warning', 'After charging'], status: 'live', preview: { node: <RangeRingMock state="driving" /> } },
        { name: 'EV horizon panel', component: 'HorizonMock', desc: 'Horizon panel variant showing upcoming charging stops and SoC forecast along the route.', states: ['Upcoming stop 12 km', 'At charging stop', 'Final destination'], status: 'live', preview: { node: <HorizonMock state="driving" /> } },
      ],
    },
    {
      id: 'ev-battery', group: 'EV Vehicle & Battery', navGroup: 'EV & Charging',
      desc: 'Vehicle class presets and battery model configuration for LDEVR integration.',
      screens: [
        { name: 'Battery model configurator', component: 'EVBatteryDemo', desc: 'Select a vehicle class preset (compact, sedan, SUV, van) and see the corresponding LDEVR battery model parameters.', states: ['Compact EV', 'Sedan EV', 'SUV EV', 'Commercial van'], status: 'live', preview: { node: <EVBatteryDemo /> } },
      ],
    },

    /* ═══════════════════════════════════════ UX Library — TAIA & Cluster ════ */
    {
      id: 'ai-overview', group: 'TomTom AI Assistant (TAIA)', navGroup: 'TomTom AI Assistant',
      desc: 'Architecture diagrams for the full TAIA voice pipeline.',
      screens: [
        { name: 'Full architecture diagram', component: 'TAIAArchDiagram', desc: 'Complete voice pipeline: Driver → STT → VPA Cloud → TAIA SDK → TAIA Cloud → TTS.', states: ['Static'], preview: { node: <TAIAArchDiagram /> } },
        { name: 'STT boundary diagram',      component: 'BoundaryDiagram', desc: 'Shows the TAIA integration boundary — OEM owns audio/STT/VPA; TAIA receives text.', states: ['Static'], preview: { node: <BoundaryDiagram /> } },
      ],
    },
    {
      id: 'cluster', group: 'Instrument Cluster', navGroup: 'Vehicle Integration',
      desc: 'Cluster display composition — speedometer, map pane, NIP, ETA, horizon panel, and lane guidance.',
      screens: [
        { name: 'Cluster display — default', component: 'ClusterDisplay', desc: 'Full cluster composition with speedometer, map and navigation overlays.', states: ['Speedometer + map', 'With NIP', 'With ETA bar', 'With horizon panel', 'Lane guidance active'], status: 'live', preview: { node: <ClusterDisplay showMap showVignette={false} nipLayout="TOP" etaLayout="BOTTOM" hpElements={[]} showHp={false} /> } },
      ],
    },

    /* ══════════════════════════════════════════════════════════ NavSDK ═══════ */
    {
      id: 'navsdk-map', group: 'NavSDK — Map Display', navGroup: 'NavSDK',
      desc: 'TomTomMapComposable layer toggle, style switching, and traffic overlay configuration.',
      screens: [
        { name: 'Map compose — layer toggle', component: 'MapComposeDemo', desc: 'Switch between Base (day), Night, and Satellite map layers. Demonstrates MapOptions.styleUri changes.', states: ['Base (day)', 'Night', 'Satellite'], status: 'live', preview: { node: <MapComposeDemo /> } },
        { name: 'Map styles',                 component: 'MapStylesDemo',  desc: 'Day, Night, and Custom OEM palette styles applied via StyleDescriptor.', states: ['Day', 'Night', 'Custom OEM'], status: 'live', preview: { node: <MapStylesDemo /> } },
        { name: 'Traffic layers',             component: 'MapTrafficDemo', desc: 'Toggle traffic flow (RELATIVE / ABSOLUTE) and incident overlays independently.', states: ['Flow only', 'Incidents only', 'Flow + incidents', 'All off'], status: 'live', preview: { node: <MapTrafficDemo /> } },
      ],
    },
    {
      id: 'navsdk-navigation', group: 'NavSDK — Navigation', navGroup: 'NavSDK',
      desc: 'Turn-by-turn guidance, voice instructions, replanning, safety alerts, and free-driving mode.',
      screens: [
        { name: 'Navigation quickstart',     component: 'NavQuickstartDemo',      desc: 'Simple start/stop navigation flow with progress animation — the bare minimum NavSDK integration.', states: ['Idle', 'Navigating', 'Arrived'], status: 'live', preview: { node: <NavQuickstartDemo /> } },
        { name: 'Turn-by-turn instructions', component: 'TurnByTurnDemo',         desc: 'NIP mock cycling through manoeuvre types — turn, roundabout, arrive, merge — with GuidanceInstruction field callout.', states: ['Turn left', 'Take motorway', 'Roundabout exit', 'U-turn', 'Arrive'], status: 'live', preview: { node: <TurnByTurnDemo /> } },
        { name: 'Voice instructions',        component: 'VoiceInstructionsDemo',  desc: 'TTS trigger demo — tap any upcoming instruction to fire the audio event and see which TextToSpeechEngine callback is invoked.', states: ['Triggered', 'Idle'], status: 'live', preview: { node: <VoiceInstructionsDemo /> } },
        { name: 'Continuous replanning',     component: 'ReplanningDemo',         desc: 'Four-phase animation: on route → off route → replanning → new route calculated. Demonstrates NavigationEventObserver.onOffRouteDetected.', states: ['On route', 'Off route', 'Replanning', 'New route'], status: 'live', preview: { node: <ReplanningDemo /> } },
        { name: 'Safety alerts',             component: 'SafetyDemo',             desc: 'Speed camera, dangerous curve, and school zone alert cards as they appear at approach distance thresholds.', states: ['Speed camera', 'Dangerous curve', 'School zone', 'No alerts'], status: 'live', preview: { node: <SafetyDemo /> } },
        { name: 'Free-driving mode',         component: 'FreeDrivingDemo',        desc: 'Animated vehicle position on map in free-drive (no active route) — shows road label, speed, and heading arrow.', states: ['Moving', 'Stopped'], status: 'live', preview: { node: <FreeDrivingDemo /> } },
      ],
    },
    {
      id: 'navsdk-routing', group: 'NavSDK — Routing', navGroup: 'NavSDK',
      desc: 'Route calculation quickstart, planning options, alternatives, section highlighting, and import/export.',
      screens: [
        { name: 'Routing quickstart',     component: 'RoutingQuickstartDemo',  desc: 'One-tap route calculation flow — idle → calculating → route displayed. Wraps RoutingEngine.planRoute().', states: ['Idle', 'Calculating', 'Route ready'], status: 'live', preview: { node: <RoutingQuickstartDemo /> } },
        { name: 'Route planning options', component: 'RoutePlanningDemo',      desc: 'Travel mode and avoidances selector — changes TravelMode and RouteAvoidance in RoutePlanningOptions.', states: ['CAR / ECO', 'TRUCK', 'PEDESTRIAN', 'Avoid tolls', 'Avoid motorways'], status: 'live', preview: { node: <RoutePlanningDemo /> } },
        { name: 'Route alternatives',     component: 'RouteAlternativesDemo',  desc: 'Three route options (fastest, eco, no tolls) — select to highlight and see time/distance summary.', states: ['Fastest selected', 'Eco selected', 'No tolls selected'], status: 'live', preview: { node: <RouteAlternativesDemo /> } },
        { name: 'Route sections',         component: 'RouteSectionsDemo',      desc: 'Tap any section type (motorway, urban, toll) to highlight matching segments on the route polyline.', states: ['Motorways', 'Urban roads', 'Toll segments', 'None selected'], status: 'live', preview: { node: <RouteSectionsDemo /> } },
        { name: 'Import / Export',        component: 'ImportExportDemo',       desc: 'Export a route as GPX/JSON, re-import it, and add intermediate waypoints — with tab navigation between modes.', states: ['Export tab', 'Import tab', 'Waypoints tab'], status: 'live', preview: { node: <ImportExportDemo /> } },
      ],
    },
    {
      id: 'navsdk-offline', group: 'NavSDK — Offline Maps', navGroup: 'NavSDK',
      desc: 'Offline map region download management — progress tracking and status indicators.',
      screens: [
        { name: 'Region download manager', component: 'OfflineDownloadDemo', desc: 'Three region cards with progress bars. Tap "Download Germany" to animate the download progress live.', states: ['Queued', 'Downloading', 'Ready'], status: 'live', preview: { node: <OfflineDownloadDemo /> } },
      ],
    },
  ];
}

/* ─── Summary counts ─────────────────────────────────────────────────────── */
function countByStatus(sections) {
  const counts = { mock: 0, needed: 0, done: 0, planned: 0, live: 0, total: 0 };
  sections.forEach(s => s.screens.forEach(sc => {
    const st = sc.status || 'mock';
    counts[st] = (counts[st] || 0) + 1;
    counts.total += 1;
  }));
  return counts;
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function ScreenshotAssets() {
  const { t } = useTranslation('pages');
  const { theme, setTheme, palette, illoStyle, setIlloStyle } = useIlloStyle();

  const SECTIONS = buildSections(t);
  const counts = countByStatus(SECTIONS);
  const totalStates = SECTIONS.reduce((n, s) =>
    n + s.screens.reduce((m, sc) => m + (sc.states?.length ?? 0), 0), 0);

  /* Use the context palette background as the demo background */
  const demoBg = palette.bg;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Interactive Demos</h1>
        <PageActions />
      </div>

      <div className="quick-answer">
        Every interactive demo and UI mock across the UX Library and NavSDK — the reference inventory for design team exploration, screenshot capture planning, and handoff. Use the theme palette below to preview each demo in any colour family.
      </div>

      <Callout type="warn">
        This page is for internal planning only. <strong>Live demos</strong> are fully interactive React components. <strong>SVG mocks</strong> are JSX representations. The goal is to agree on, refine, and capture real device screenshots for all states.
      </Callout>

      {/* Summary strip */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '24px 0' }}>
        {[
          { label: 'Total screens', value: counts.total,   color: 'var(--text)' },
          { label: 'Total states',  value: totalStates,    color: 'var(--text)' },
          { label: 'Live demos',    value: counts.live,    color: '#1e40af' },
          { label: 'SVG mocks',     value: counts.mock,    color: '#92400e' },
          { label: 'Screenshot needed', value: counts.needed, color: '#991b1b' },
          { label: 'Planned',       value: counts.planned, color: 'var(--muted)' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            padding: '10px 16px', borderRadius: 20, border: '1px solid var(--border)',
            background: 'var(--bg)', minWidth: 110, textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color, lineHeight: 1.1 }}>{value}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginTop: 3, lineHeight: 1.3 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* How to use */}
      <div className="zone" id="sa-how">
        <h2 className="sh">How to use this page</h2>
        <p className="body">
          Each section maps to a documentation page. Live previews show the current interactive demo or SVG mock. State chips list distinct variants that need individual screenshots. Status badges track progress from <strong>SVG mock</strong> → <strong>Screenshot needed</strong> → <strong>Static .png</strong>.
        </p>
        <p className="body">
          Use the theme palette below to apply any colour family to all demo backgrounds simultaneously — the same palette system as the Intro Hero Illustrations page. When a screenshot is ready, update the <code>status</code> field in <code>src/pages/ScreenshotAssets.jsx</code>.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
          {Object.entries(STATUS).map(([key, s]) => (
            <span key={key} style={{ fontSize: '0.875rem', fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>{s.label}</span>
          ))}
        </div>
      </div>

      {/* Full ThemeBar — compact mode (palette picker only, no style/plugin row) */}
      <ThemeBar
        theme={theme}
        onThemeChange={setTheme}
        illoStyle={illoStyle}
        onStyleChange={setIlloStyle}
        compact={true}
      />

      {/* Sections */}
      {SECTIONS.map(section => (
        <div className="zone" key={section.id} id={`sa-${section.id}`}>

          {/* Section header */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
            <h2 className="sh" style={{ margin: 0 }}>{section.group}</h2>
            <span style={{
              fontSize: '0.875rem', fontWeight: 600, padding: '2px 7px', borderRadius: 4,
              background: 'var(--bg)', color: 'var(--muted)', border: '1px solid var(--border)',
            }}>{section.navGroup}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)', marginLeft: 'auto' }}>
              {section.screens.length} screen{section.screens.length !== 1 ? 's' : ''}{' · '}
              {section.screens.reduce((n, s) => n + (s.states?.length ?? 0), 0)} states
            </span>
          </div>
          <p className="body" style={{ marginTop: 0, marginBottom: 16 }}>{section.desc}</p>

          {/* Full-width card stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {section.screens.map(screen => (
              <PreviewCard
                key={screen.name}
                name={screen.name}
                component={screen.component}
                desc={screen.desc}
                states={screen.states}
                status={screen.status}
                preview={screen.preview}
                demoBg={demoBg}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
