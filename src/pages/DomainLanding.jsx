import { useTranslation } from 'react-i18next';
import { NAV } from '../data/navigation';
import PageActions from '../components/ui/PageActions';
import { useIlloStyle } from '../context/IlloStyleContext';
import {
  makeThumb,
  L_HomeScreen, L_AIVoice, L_Cluster, L_EVRouting,
  L_NavControls, L_HorizonPanel, L_ETAPanel, L_Route, L_NavGuidance,
  L_SearchResult, L_ChargingSearch, L_EV, L_ADAS, L_VIL,
  L_ConversationPersonality,
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
  IcoConversationPersonality,
} from '../illustrations/iconVariants';
import {
  IlloHomeScreen, IlloAIVoice, IlloCluster, IlloEVNavUI,
  IlloNavControls, IlloHorizonPanel, IlloETAPanel, IlloRouteBar, IlloInstructionPanel,
  IlloSearchFuzzy, IlloEVSearchNearby, IlloEVBattery, IlloEVRouting, IlloEV,
  IlloEVRequirements, IlloADAS, IlloVIL, IlloHUD, IlloTruck, IlloVIBasics,
  IlloConversationPersonality, IlloIntentRouting, IlloVoiceEngine,
  IlloSpeechToText, IlloAIConfig,
} from './IntroIllustrations';

/* Pages that have real content — everything else shows "Coming soon" */
const IMPLEMENTED = new Set([
  'design-tokens', 'theming', 'colour', 'font', 'corner-radius',
  'map-style', 'traffic', 'safety-locations',
  'search-engine', 'home-screen-layout', 'nav-controls',
  'horizon-panel', 'instruction-panel', 'eta-panel', 'route-bar',
  'ai-overview', 'ai-personality', 'intent-routing',
  'voice-engine', 'speech-to-text', 'ai-config',
  'cluster', 'ev', 'adas',
  'ev-overview', 'ev-battery', 'ev-charging-search', 'ev-routing', 'ev-nav-ui', 'ev-requirements',
]);

/* One-line descriptions for implemented pages */
const PAGE_DESCS = {
  // Assets
  'design-tokens': 'The full catalogue of design tokens — spacing, elevation, and motion values that drive every component.',
  'theming':        'Apply your OEM brand — colours, typography, radius, assets, and fonts — using Tokens Studio and the RRO mechanism.',
  'colour':        'Brand colour palettes, semantic colour roles, and how to override them per theme and OEM.',
  'font':          'Typography scale, supported typefaces, and how to supply a custom font family.',
  'corner-radius': 'Global and per-component corner radius tokens — from pill buttons to map cards.',
  // Map Customisation
  'map-style':        'Configure light and dark map themes, colour overrides, and brand-specific styling.',
  'traffic':          'Display real-time traffic flow and incident overlays on the map.',
  'safety-locations': 'Show speed cameras, danger zones, and school areas along the route.',
  // App Customisation
  'search-engine':      'Configure the search experience, providers, result ranking, and UI behaviour.',
  'home-screen-layout': 'Define the home screen split between the map and NIP panel.',
  'nav-controls':       'Customise on-map controls including zoom, compass, and re-centre.',
  'horizon-panel':      'Configure the panel showing upcoming manoeuvres and road hazards.',
  'instruction-panel':  'Style the next-turn instruction banner during active navigation.',
  'eta-panel':          'Configure the arrival panel showing ETA, distance, and time remaining.',
  'route-bar':          'Customise the route progress bar, waypoints, and traffic summary.',
  // TomTom AI Assistant
  'ai-overview':    'Overview of the TAIA architecture, capabilities, and integration scope.',
  'ai-personality': 'Configure the assistant name, response tone, and silence threshold to match your brand voice.',
  'intent-routing': 'Route navigation intents through TAIA and forward media, climate, and phone intents to your own domain handlers.',
  'voice-engine':   'Connect your OEM text-to-speech engine for voice output.',
  'speech-to-text': 'Integrate a speech-to-text provider for voice input and wake word handling.',
  'ai-config':      'Initialise the TAIA client, configure navigation context, and handle MQTT events.',
  // Vehicle Integration
  'cluster': 'Render NIP, lane guidance, CMP, and ETA on the instrument cluster via Intent.',
  'ev':      'Enable range-aware routing, charging station search, and automatic stop planning.',
  'adas':    'Layer TomTom safety and horizon data onto any navigation stack for ISA compliance, predictive speed control, and safety alerting.',
  // EV & Charging
  'ev-overview':        'Architecture, data flow, and where to start your EV integration.',
  'ev-battery':         'BMS integration, battery parameters, consumption curves, and vehicle class presets.',
  'ev-charging-search': 'Connector-matched station search, real-time availability, and preferred network configuration.',
  'ev-routing':         'Long-distance route planning with automatic charging stops and interactive threshold tuning.',
  'ev-nav-ui':          'In-navigation SoC strip, reachable range ring, horizon stop countdown, and low-battery re-routing.',
  'ev-requirements':    'SDK dependencies, Android permissions, and a step-by-step integration checklist.',
};

/* Related domains — shown at the bottom of the landing as a cross-link strip.
   Each entry is { groupKey, label, desc, icon, pageId } where pageId is the
   domain landing page to navigate to. */
const RELATED_DOMAINS = {
  vehicleIntegration: [
    {
      pageId: 'ev-charging',
      label: 'EV & Charging',
      desc: 'BMS wiring, battery modelling, charging search, long-distance routing, and the in-navigation EV driver UI.',
      icon: '⚡',
    },
  ],
  evCharging: [
    {
      pageId: 'vehicle-integration',
      label: 'Vehicle Integration',
      desc: 'Cluster display, HUD, ADAS horizon data, and other drivetrain connections that pair with your EV stack.',
      icon: '🚗',
    },
  ],
};

/* Domain intro blurbs */
const DOMAIN_INTROS = {
  assets:           'Design tokens, theming workflow, palettes, type, and icons — the foundation every component and OEM theme is built on.',
  mapCustomisation:   'Style the map, overlay traffic and safety data, and customise route lines and markers.',
  appCustomisation:   'Tailor search, home layout, guidance panels, and controls to your product.',
  taia:               'Natural-language navigation commands and hands-free interaction via the TomTom AI Assistant.',
  vehicleIntegration: 'Connect navigation data to the cluster, HUD, ADAS, and drivetrain systems.',
  releaseSupport:     'Release notes, migration guides, and support resources.',
  evCharging:         'Full EV integration journey — from BMS wiring and battery modelling through charging search, long-distance routing, and the in-navigation driver UI.',
};

const CARD_ILLOS = {
  // App Customisation
  'search-engine':      makeThumb(IlloSearchFuzzy,            L_SearchResult, IcoSearchFuzzy),
  'home-screen-layout': makeThumb(IlloHomeScreen,             L_HomeScreen, IcoHomeScreen),
  'nav-controls':       makeThumb(IlloNavControls,            L_NavControls, IcoNavControls),
  'horizon-panel':      makeThumb(IlloHorizonPanel,           L_HorizonPanel, IcoHorizonPanel),
  'instruction-panel':  makeThumb(IlloInstructionPanel,       L_NavGuidance, IcoInstructionPanel),
  'eta-panel':          makeThumb(IlloETAPanel,               L_ETAPanel, IcoETAPanel),
  'route-bar':          makeThumb(IlloRouteBar,               L_Route, IcoRouteBar),
  // EV & Charging
  'ev-overview':        makeThumb(IlloEV,                     L_EV, IcoEV),
  'ev-battery':         makeThumb(IlloEVBattery,              L_EV, IcoEVBattery),
  'ev-charging-search': makeThumb(IlloEVSearchNearby,         L_ChargingSearch, IcoEVSearchNearby),
  'ev-routing':         makeThumb(IlloEVRouting,              L_EVRouting, IcoEVRouting),
  'ev-nav-ui':          makeThumb(IlloEVNavUI,                L_EVRouting, IcoEVNavUI),
  'ev-requirements':    makeThumb(IlloEVRequirements,         L_EV, IcoEVRequirements),
  // Vehicle Integration
  'vi-basics':          makeThumb(IlloVIBasics,               L_VIL, IcoVIBasics),
  'cluster':            makeThumb(IlloCluster,                L_Cluster, IcoCluster),
  'hud':                makeThumb(IlloHUD,                    L_ADAS, IcoHUD),
  'adas':               makeThumb(IlloADAS,                   L_ADAS, IcoADAS),
  'truck':              makeThumb(IlloTruck,                  L_Cluster, IcoTruck),
  // TomTom AI Assistant
  'ai-overview':        makeThumb(IlloAIVoice,                L_AIVoice, IcoAIVoice),
  'ai-personality':     makeThumb(IlloConversationPersonality,L_ConversationPersonality, IcoConversationPersonality),
  'intent-routing':     makeThumb(IlloIntentRouting,          L_AIVoice, IcoIntentRouting),
  'voice-engine':       makeThumb(IlloVoiceEngine,            L_AIVoice, IcoVoiceEngine),
  'speech-to-text':     makeThumb(IlloSpeechToText,           L_AIVoice, IcoSpeechToText),
  'ai-config':          makeThumb(IlloAIConfig,               L_AIVoice, IcoAIConfig),
};

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function DomainLanding({ groupKey, onNavigate }) {
  const { t } = useTranslation('common');
  const group = NAV.find(g => g.key === groupKey);
  if (!group) return null;

  const groupLabel = t(`nav.groups.${groupKey}`, { defaultValue: group.label });
  const intro      = DOMAIN_INTROS[groupKey];
  const related    = RELATED_DOMAINS[groupKey];
  const { palette } = useIlloStyle();

  return (
    <div className="page">
      <div className="page-header">
        <h1>{groupLabel}</h1>
        <PageActions />
      </div>
      {intro && <div className="quick-answer">{intro}</div>}

      <div className="domain-grid">
        {group.items.map(item => {
          const label       = t(`nav.items.${item.id}`, { defaultValue: item.label });
          const desc        = PAGE_DESCS[item.id];
          const implemented = IMPLEMENTED.has(item.id);
          const CardIllo    = CARD_ILLOS[item.id];

          return (
            <button
              key={item.id}
              className={`domain-card${!implemented ? ' domain-card--soon' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              {CardIllo && implemented && (
                <div className="domain-card-illo" style={{ background: palette.bg }}>
                  <CardIllo />
                </div>
              )}
              <div className="domain-card-bottom">
                <div className="domain-card-body">
                  <span className="domain-card-title">{label}</span>
                  {implemented && desc && (
                    <p className="domain-card-desc">{desc}</p>
                  )}
                  {!implemented && (
                    <span className="domain-card-soon-badge">Coming soon</span>
                  )}
                </div>
                <span className="domain-card-arrow"><ArrowIcon /></span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Related domains strip */}
      {related?.length > 0 && (
        <div style={{ marginTop: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>
              Related topics
            </span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {related.map(item => (
              <button
                key={item.pageId}
                onClick={() => onNavigate(item.pageId)}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'border-color 0.15s, box-shadow 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <span style={{ fontSize: '1.5rem', lineHeight: 1, flexShrink: 0 }}>{item.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--black)', marginBottom: 3 }}>{item.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.5 }}>{item.desc}</div>
                </div>
                <span style={{ color: 'var(--muted)', flexShrink: 0 }}><ArrowIcon /></span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
