export const NAV = [
  { id: 'overview',   label: 'Overview',   type: 'top' },
  { id: 'quickstart', label: 'Quickstart', type: 'top' },
  {
    label: 'Assets', key: 'assets', type: 'group', defaultOpen: false,
    items: [
      { id: 'design-tokens', label: 'Design tokens' },
      { id: 'string-ids',    label: 'String IDs' },
      { id: 'colour',         label: 'Colour' },
      { id: 'font',           label: 'Font' },
      { id: 'corner-radius',  label: 'Corner radius' },
      { id: 'icons',          label: 'Icons' },
    ],
  },
  {
    label: 'Map Customisation', key: 'mapCustomisation', type: 'group', defaultOpen: false, landingId: 'map-customisation',
    items: [
      { id: 'map-style',    label: 'Map Style' },
      { id: 'map-assets',   label: 'Map Assets' },
      { id: 'traffic',           label: 'Traffic' },
      { id: 'safety-locations',  label: 'Safety Locations' },
      { id: 'route',             label: 'Route' },
      { id: 'map-markers',  label: 'Map Markers' },
      { id: 'events',       label: 'Events' },
    ],
  },
  {
    label: 'App Customisation', key: 'appCustomisation', type: 'group', defaultOpen: false, landingId: 'app-customisation',
    items: [
      { id: 'search-engine',       label: 'Search engine' },
      { id: 'home-screen-layout',  label: 'Home Screen Layout' },
      { id: 'nav-controls',        label: 'Navigation Controls' },
      { id: 'horizon-panel',       label: 'Horizon Panel' },
      { id: 'instruction-panel',   label: 'Next Instruction Panel' },
      { id: 'eta-panel',           label: 'ETA Panel' },
      { id: 'route-bar',           label: 'Route Bar' },
    ],
  },
  {
    label: 'TomTom AI Assistant', key: 'taia', type: 'group', defaultOpen: false, landingId: 'ai-assistant',
    items: [
      { id: 'ai-overview',    label: 'Overview' },
      { id: 'voice-engine',   label: 'Voice engine' },
      { id: 'speech-to-text', label: 'Speech to Text engine' },
      { id: 'ai-config',      label: 'Configuration' },
    ],
  },
  {
    label: 'Vehicle Integration', key: 'vehicleIntegration', type: 'group', defaultOpen: false, landingId: 'vehicle-integration',
    items: [
      { id: 'vi-basics', label: 'Basics' },
      { id: 'cluster',   label: 'Displaying on Cluster' },
      { id: 'hud',       label: 'Displaying on Head Up Display' },
      { id: 'adas',      label: 'ADAS Integration' },
      { id: 'ev',        label: 'EV Support' },
      { id: 'truck',     label: 'Truck Support' },
    ],
  },
  {
    label: 'Examples', key: 'examples', type: 'group', defaultOpen: false,
    items: [
      { id: 'ivi-example',          label: 'IVI Home screen integration' },
      { id: 'homescreen-example',   label: 'Home Screen UI Customisation' },
    ],
  },
  {
    label: 'Release & Support', key: 'releaseSupport', type: 'group', defaultOpen: false, landingId: 'release-support',
    items: [
      { id: 'release-notes', label: 'Release Notes' },
      { id: 'migration',     label: 'Migration Guide' },
    ],
  },
  {
    label: 'API Reference', key: 'apiReference', type: 'group', defaultOpen: false,
    items: [
      { id: 'api-ref', label: 'Full API Reference' },
    ],
  },
  {
    label: 'Plumbing', key: 'plumbing', type: 'group', defaultOpen: true, plumbing: true,
    items: [
      { id: 'screenshot-assets', label: 'Screenshot assets & states' },
    ],
  },
];

/**
 * Returns context for the breadcrumb:
 * - type:'top'     → top-level page (Overview, Quickstart)
 * - type:'landing' → the page IS a domain landing (groupKey, groupLabel)
 * - type:'page'    → belongs to a group (groupKey, groupLabel, landingId|null)
 */
export function getPageContext(pageId) {
  for (const entry of NAV) {
    if (entry.type === 'group' && entry.landingId === pageId) {
      return { type: 'landing', groupKey: entry.key, groupLabel: entry.label };
    }
  }
  for (const entry of NAV) {
    if (entry.items) {
      const item = entry.items.find(i => i.id === pageId);
      if (item) {
        return {
          type: 'page',
          groupKey: entry.key,
          groupLabel: entry.label,
          landingId: entry.landingId || null,
        };
      }
    }
  }
  return { type: 'top', groupKey: null, groupLabel: null, landingId: null };
}

export const PAGE_TITLES = {
  overview: 'Overview', quickstart: 'Quickstart',
  'map-customisation': 'Map Customisation',
  'app-customisation': 'App Customisation',
  'ai-assistant':        'TomTom AI Assistant',
  'vehicle-integration': 'Vehicle Integration',
  'release-support':     'Release & Support',
  'design-tokens': 'Design tokens',
  colour: 'Colour', font: 'Font', 'corner-radius': 'Corner radius', icons: 'Icons', 'string-ids': 'String IDs',
  'map-style': 'Map Style', 'map-assets': 'Map Assets', 'safety-locations': 'Safety Locations', route: 'Route',
  'map-markers': 'Map Markers', events: 'Events',
  'search-engine': 'Search engine', 'home-screen-layout': 'Home Screen Layout',
  'nav-controls': 'Navigation Controls',
  'horizon-panel': 'Horizon Panel', 'instruction-panel': 'Next Instruction Panel',
  'eta-panel': 'ETA Panel', 'route-bar': 'Route Bar',
  'ai-overview': 'TomTom AI Assistant',
  'voice-engine': 'Voice engine',
  'speech-to-text': 'Speech to Text', 'ai-config': 'Configuration',
  'vi-basics': 'Basics', cluster: 'Displaying on Cluster',
  hud: 'Head Up Display', adas: 'ADAS Integration',
  ev: 'EV Support', truck: 'Truck Support',
  'ivi-example': 'IVI Home screen integration',
  'homescreen-example': 'Home Screen UI Customisation',
  'release-notes': 'Release Notes', migration: 'Migration Guide',
  'api-ref': 'API Reference',
  'screenshot-assets': 'Screenshot assets & states',
};
