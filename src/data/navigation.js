export const NAV = [
  { id: 'overview',   label: 'Overview',   type: 'top' },
  { id: 'quickstart', label: 'Quickstart', type: 'top' },
  {
    label: 'Assets', type: 'group', defaultOpen: true,
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
    label: 'Map Customisation', type: 'group', defaultOpen: true,
    items: [
      { id: 'map-style',    label: 'Map Style' },
      { id: 'map-assets',   label: 'Map Assets' },
      { id: 'route',        label: 'Route' },
      { id: 'map-markers',  label: 'Map Markers' },
      { id: 'events',       label: 'Events' },
    ],
  },
  {
    label: 'App Customisation', type: 'group', defaultOpen: true,
    items: [
      { id: 'search-engine',       label: 'Search engine' },
      { id: 'home-screen-layout',  label: 'Home Screen Layout' },
      { id: 'nav-settings',        label: 'Navigation Settings' },
      { id: 'nav-controls',        label: 'Navigation Controls' },
      { id: 'eta-panel',           label: 'ETA Panel' },
      { id: 'instruction-panel',   label: 'Instruction Panel' },
      { id: 'horizon-panel',       label: 'Horizon Panel' },
    ],
  },
  {
    label: 'TomTom AI Assistant', type: 'group', defaultOpen: false,
    items: [
      { id: 'voice-engine',   label: 'Voice engine' },
      { id: 'speech-to-text', label: 'Speech to Text engine' },
      { id: 'ai-config',      label: 'Configuration' },
    ],
  },
  {
    label: 'Vehicle Integration', type: 'group', defaultOpen: false,
    items: [
      { id: 'vi-basics', label: 'Basics' },
      { id: 'cluster',   label: 'Displaying on Cluster' },
      { id: 'hud',       label: 'Displaying on Head Up Display' },
      { id: 'adas',      label: 'Integrating ADAS to Navigation' },
      { id: 'ev',        label: 'EV Support' },
      { id: 'truck',     label: 'Truck Support' },
    ],
  },
  {
    label: 'Examples', type: 'group', defaultOpen: false,
    items: [
      { id: 'ivi-example',          label: 'IVI Home screen integration' },
      { id: 'homescreen-example',   label: 'Home Screen UI Customisation' },
    ],
  },
  {
    label: 'Release & Support', type: 'group', defaultOpen: false,
    items: [
      { id: 'release-notes', label: 'Release Notes' },
      { id: 'migration',     label: 'Migration Guide' },
    ],
  },
  {
    label: 'API Reference', type: 'group', defaultOpen: false,
    items: [
      { id: 'api-ref', label: 'Full API Reference' },
    ],
  },
];

export const PAGE_TITLES = {
  overview: 'Overview', quickstart: 'Quickstart',
  'design-tokens': 'Design tokens',
  colour: 'Colour', font: 'Font', 'corner-radius': 'Corner radius', icons: 'Icons', 'string-ids': 'String IDs',
  'map-style': 'Map Style', 'map-assets': 'Map Assets', route: 'Route',
  'map-markers': 'Map Markers', events: 'Events',
  'search-engine': 'Search engine', 'home-screen-layout': 'Home Screen Layout',
  'nav-settings': 'Navigation Settings', 'nav-controls': 'Navigation Controls',
  'eta-panel': 'ETA Panel', 'instruction-panel': 'Instruction Panel',
  'horizon-panel': 'Horizon Panel', 'voice-engine': 'Voice engine',
  'speech-to-text': 'Speech to Text', 'ai-config': 'Configuration',
  'vi-basics': 'Basics', cluster: 'Displaying on Cluster',
  hud: 'Head Up Display', adas: 'ADAS to Navigation',
  ev: 'EV Support', truck: 'Truck Support',
  'ivi-example': 'IVI Home screen integration',
  'homescreen-example': 'Home Screen UI Customisation',
  'release-notes': 'Release Notes', migration: 'Migration Guide',
  'api-ref': 'API Reference',
};
