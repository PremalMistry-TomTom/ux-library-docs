export const ROUTING_API_NAV = [
  { id: 'routing-api-intro', label: 'Introduction', type: 'top' },
  {
    label: 'Quick Start', key: 'routingQuickStart', type: 'group', landingId: 'routing-quickstart',
    items: [
      { id: 'routing-auth',         label: 'Authentication' },
      { id: 'routing-first-route',  label: 'Your First Route' },
      { id: 'routing-response',     label: 'Response Structure' },
    ],
  },
  {
    label: 'Core Concepts', key: 'routingConcepts', type: 'group', landingId: 'routing-concepts',
    items: [
      { id: 'routing-route-types',      label: 'Route Types & Traffic' },
      { id: 'routing-travel-modes',     label: 'Travel Modes' },
      { id: 'routing-vehicle-profiles', label: 'Vehicle Profiles' },
      { id: 'routing-consumption',      label: 'Consumption Models' },
    ],
  },
  { id: 'routing-calculate-route', label: 'Calculate Route', type: 'top', anchors: [
      { id: 'api-rc-route-planning', label: 'Route planning',              method: 'GET'  },
      { id: 'api-rc-vehicle',        label: 'Vehicle profile',             method: 'GET'  },
      { id: 'api-rc-combustion',     label: 'Combustion consumption model',method: 'GET'  },
      { id: 'api-rc-electric',       label: 'Electric consumption model',  method: 'GET'  },
      { id: 'api-rc-post-body',      label: 'POST body',                   method: 'POST' },
      { id: 'api-rc-response',       label: 'Route summary' },
      { id: 'api-rc-errors',         label: 'Error codes' },
    ]},
  { id: 'routing-reachable-range', label: 'Reachable Range', type: 'top' },
  { id: 'routing-batch',           label: 'Batch Routing',   type: 'top' },
  {
    label: 'Guidance', key: 'routingGuidance', type: 'group', landingId: 'routing-guidance',
    items: [
      { id: 'routing-instructions',  label: 'Turn-by-Turn Instructions' },
      { id: 'routing-lane-guidance', label: 'Lane Guidance' },
    ],
  },
  {
    label: 'Advanced', key: 'routingAdvanced', type: 'group', landingId: 'routing-advanced',
    items: [
      { id: 'routing-reconstruction', label: 'Route Reconstruction' },
      { id: 'routing-avoid-areas',    label: 'Avoiding Areas' },
      { id: 'routing-tolls',          label: 'Vignettes & Toll Systems' },
    ],
  },
  {
    label: 'Platform Reference', key: 'routingPlatform', type: 'group', landingId: 'routing-platform',
    items: [
      { id: 'routing-tomtom-maps', label: 'TomTom Maps (v1)' },
      { id: 'routing-orbis-maps',  label: 'Orbis Maps (v2)' },
      { id: 'routing-migration',   label: 'Migration Guide v1 → v2' },
    ],
  },
  {
    label: 'API Reference', key: 'routingApiRef', type: 'group',
    items: [
      { id: 'routing-params-ref',   label: 'All Parameters' },
      { id: 'routing-response-ref', label: 'Response Schema' },
      { id: 'routing-error-codes',  label: 'Error Codes' },
      { id: 'routing-coverage',     label: 'Market Coverage' },
    ],
  },
];

export const ROUTING_API_PAGE_TITLES = {
  'routing-api-intro':           'Introduction',
  'routing-quickstart':          'Quick Start',
  'routing-auth':                'Authentication',
  'routing-first-route':         'Your First Route',
  'routing-response':            'Response Structure',
  'routing-concepts':            'Core Concepts',
  'routing-route-types':         'Route Types & Traffic',
  'routing-travel-modes':        'Travel Modes',
  'routing-vehicle-profiles':    'Vehicle Profiles',
  'routing-consumption':         'Consumption Models',
  'routing-calculate-route':     'Calculate Route',
  'routing-reachable-range':     'Reachable Range',
  'routing-batch':               'Batch Routing',
  'routing-guidance':            'Guidance',
  'routing-instructions':        'Turn-by-Turn Instructions',
  'routing-lane-guidance':       'Lane Guidance',
  'routing-advanced':            'Advanced',
  'routing-reconstruction':      'Route Reconstruction',
  'routing-avoid-areas':         'Avoiding Areas',
  'routing-tolls':               'Vignettes & Toll Systems',
  'routing-platform':            'Platform Reference',
  'routing-tomtom-maps':         'TomTom Maps (v1)',
  'routing-orbis-maps':          'Orbis Maps (v2)',
  'routing-migration':           'Migration Guide v1 → v2',
  'routing-params-ref':          'All Parameters',
  'routing-response-ref':        'Response Schema',
  'routing-error-codes':         'Error Codes',
  'routing-coverage':            'Market Coverage',
};
