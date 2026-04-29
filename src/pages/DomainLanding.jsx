import { useTranslation } from 'react-i18next';
import { NAV } from '../data/navigation';

/* Pages that have real content — everything else shows "Coming soon" */
const IMPLEMENTED = new Set([
  'design-tokens', 'colour', 'font', 'corner-radius',
  'map-style', 'traffic', 'safety-locations',
  'search-engine', 'home-screen-layout', 'nav-controls',
  'horizon-panel', 'instruction-panel', 'eta-panel', 'route-bar',
  'ai-overview', 'voice-engine', 'speech-to-text', 'ai-config',
  'cluster', 'ev', 'adas',
]);

/* One-line descriptions for implemented pages */
const PAGE_DESCS = {
  // Assets
  'design-tokens': 'The full catalogue of design tokens — spacing, elevation, and motion values that drive every component.',
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
  'voice-engine':   'Connect your OEM text-to-speech engine for voice output.',
  'speech-to-text': 'Integrate a speech-to-text provider for voice input and wake word handling.',
  'ai-config':      'Initialise the TAIA client, configure navigation context, and handle MQTT events.',
  // Vehicle Integration
  'cluster': 'Render NIP, lane guidance, CMP, and ETA on the instrument cluster via Intent.',
  'ev':      'Enable range-aware routing, charging station search, and automatic stop planning.',
  'adas':    'Layer TomTom safety and horizon data onto any navigation stack for ISA compliance, predictive speed control, and safety alerting.',
};

/* Domain intro blurbs */
const DOMAIN_INTROS = {
  assets:           'Design tokens, colour palettes, typography, and icon assets — the building blocks every component and theme is derived from.',
  mapCustomisation:   'Customise how the map looks and behaves — including style, traffic overlays, safety cameras, route lines, and map markers.',
  appCustomisation:   'Tailor the in-app UI to your product — configure search, home screen layout, navigation panels, and ETA display.',
  taia:               'Integrate the TomTom AI Assistant for natural-language navigation commands and hands-free interaction.',
  vehicleIntegration: 'Connect navigation data to vehicle systems including instrument cluster, head-up display, ADAS, and drivetrain integrations.',
  releaseSupport:     'Stay up to date with release notes, migration guides, and support resources.',
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

  return (
    <div className="page">
      <div className="page-header">
        <h1>{groupLabel}</h1>
        {intro && <p className="page-intro">{intro}</p>}
      </div>

      <div className="domain-grid">
        {group.items.map(item => {
          const label       = t(`nav.items.${item.id}`, { defaultValue: item.label });
          const desc        = PAGE_DESCS[item.id];
          const implemented = IMPLEMENTED.has(item.id);

          return (
            <button
              key={item.id}
              className={`domain-card${!implemented ? ' domain-card--soon' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
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
            </button>
          );
        })}
      </div>
    </div>
  );
}
