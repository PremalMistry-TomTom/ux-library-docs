export const ROUTING_API_NAV = [
  { id: 'routing-api-intro', label: 'Introduction', type: 'top' },

  { type: 'section', label: 'Getting Started' },
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

  /* ── Endpoint groups ──────────────────────────────────────────────────────── */
  {
    type: 'endpoint', label: 'Calculate Route', key: 'ep-calculate-route',
    versions: [
      { id: 'routing-calculate-route', version: 'v1', label: 'v1 Production', anchors: [
          { id: 'api-rc-route-planning', label: 'Route planning',               method: 'GET'  },
          { id: 'api-rc-vehicle',        label: 'Vehicle profile',              method: 'GET'  },
          { id: 'api-rc-combustion',     label: 'Combustion consumption model', method: 'GET'  },
          { id: 'api-rc-electric',       label: 'Electric consumption model',   method: 'GET'  },
          { id: 'api-rc-post-body',      label: 'POST body',                    method: 'POST' },
          { id: 'api-rc-response',       label: 'Route summary' },
          { id: 'api-rc-errors',         label: 'Error codes' },
        ]},
      { id: 'routing-v2-calculate-route', version: 'v2', label: 'v2 Preview', anchors: [
          { id: 'routing-v2-route',      label: 'Route planning',               method: 'GET'  },
          { id: 'routing-v2-headers',    label: 'Request headers'                              },
          { id: 'routing-v2-vehicle',    label: 'Vehicle profile',              method: 'GET'  },
          { id: 'routing-v2-combustion', label: 'Combustion consumption model', method: 'GET'  },
          { id: 'routing-v2-electric',   label: 'Electric consumption model',   method: 'GET'  },
          { id: 'routing-v2-post-body',  label: 'POST body',                    method: 'POST' },
          { id: 'routing-v2-response',   label: 'Response & error codes'                       },
        ]},
      { id: 'routing-v3-calculate-route', version: 'v3', label: 'v3 Preview', anchors: [
          { id: 'routing-v3-route',      label: 'Route planning',               method: 'GET'  },
          { id: 'routing-v3-headers',    label: 'Request headers'                              },
          { id: 'routing-v3-vehicle',    label: 'Vehicle profile',              method: 'GET'  },
          { id: 'routing-v3-combustion', label: 'Combustion consumption model', method: 'GET'  },
          { id: 'routing-v3-electric',   label: 'Electric consumption model',   method: 'GET'  },
          { id: 'routing-v3-post-body',  label: 'POST body',                    method: 'POST' },
          { id: 'routing-v3-response',   label: 'Response & error codes'                       },
        ]},
    ],
  },
  {
    type: 'endpoint', label: 'Reachable Range', key: 'ep-reachable-range',
    versions: [
      { id: 'routing-reachable-range', version: 'v1', label: 'v1 Production', anchors: [
          { id: 'api-rr-budget',     label: 'Budget & origin',              method: 'GET' },
          { id: 'api-rr-vehicle',    label: 'Vehicle profile',              method: 'GET' },
          { id: 'api-rr-combustion', label: 'Combustion consumption model', method: 'GET' },
          { id: 'api-rr-electric',   label: 'Electric consumption model',   method: 'GET' },
          { id: 'api-rr-response',   label: 'Response' },
          { id: 'api-rr-errors',     label: 'Error codes' },
        ]},
      { id: 'routing-v2-reachable-range', version: 'v2', label: 'v2 Preview', anchors: [
          { id: 'routing-v2-rr-budget',     label: 'Budget & origin',              method: 'GET'  },
          { id: 'routing-v2-rr-vehicle',    label: 'Vehicle profile',              method: 'GET'  },
          { id: 'routing-v2-rr-combustion', label: 'Combustion consumption model', method: 'GET'  },
          { id: 'routing-v2-rr-electric',   label: 'Electric consumption model',   method: 'GET'  },
          { id: 'routing-v2-rr-post-body',  label: 'POST body',                    method: 'POST' },
          { id: 'routing-v2-rr-response',   label: 'Response data' },
        ]},
      { id: 'routing-v3-reachable-range', version: 'v3', label: 'v3 Preview', anchors: [
          { id: 'routing-v3-rr-budget',     label: 'Budget & origin',              method: 'GET'  },
          { id: 'routing-v3-rr-vehicle',    label: 'Vehicle profile',              method: 'GET'  },
          { id: 'routing-v3-rr-combustion', label: 'Combustion consumption model', method: 'GET'  },
          { id: 'routing-v3-rr-electric',   label: 'Electric consumption model',   method: 'GET'  },
          { id: 'routing-v3-rr-post-body',  label: 'POST body',                    method: 'POST' },
          { id: 'routing-v3-rr-response',   label: 'Response & error codes'                       },
        ]},
    ],
  },
  {
    type: 'endpoint', label: 'Batch Routing', key: 'ep-batch',
    versions: [
      { id: 'routing-batch', version: 'v1', label: 'v1 Production', anchors: [
          { id: 'api-batch-sync',     label: 'Synchronous batch',  method: 'POST' },
          { id: 'api-batch-async',    label: 'Asynchronous batch', method: 'POST' },
          { id: 'api-batch-response', label: 'Response schema' },
          { id: 'api-batch-errors',   label: 'Error codes' },
        ]},
    ],
  },
  {
    type: 'endpoint', label: 'Guidance Instructions', key: 'ep-guidance',
    versions: [
      { id: 'routing-instructions', version: 'v1', label: 'v1 Production', anchors: [
          { id: 'api-instr-request',  label: 'Request parameters', method: 'GET' },
          { id: 'api-instr-response', label: 'Instruction object' },
          { id: 'api-instr-coded',    label: 'Coded mode' },
        ]},
      { id: 'routing-v2-guidance', version: 'v2', label: 'v2 Preview', anchors: [
          { id: 'routing-v2-guidance-request', label: 'Request parameters', method: 'GET' },
          { id: 'routing-v2-guidance-object',  label: 'Instruction object' },
          { id: 'routing-v2-guidance-lanes',   label: 'Lane information' },
        ]},
      { id: 'routing-v3-guidance', version: 'v3', label: 'v3 Preview', anchors: [
          { id: 'routing-v3-guidance-request', label: 'Enabling guidance',   method: 'GET' },
          { id: 'routing-v3-guidance-object',  label: 'Instruction object'                },
          { id: 'routing-v3-guidance-lanes',   label: 'Lane information'                  },
        ]},
    ],
  },
  {
    type: 'endpoint', label: 'Lane Guidance', key: 'ep-lane',
    versions: [
      { id: 'routing-lane-guidance', version: 'v1', label: 'v1 Production', anchors: [
          { id: 'api-lane-request',  label: 'Enabling lane guidance', method: 'GET' },
          { id: 'api-lane-response', label: 'Lane object schema' },
          { id: 'api-lane-render',   label: 'Rendering guidance' },
        ]},
    ],
  },
  {
    type: 'endpoint', label: 'Road Shield Notes', key: 'ep-shields',
    versions: [
      { id: 'routing-road-shields', version: 'v1', label: 'v1 Production', anchors: [
          { id: 'api-shields-request', label: 'Enabling road shields', method: 'GET' },
          { id: 'api-shields-section', label: 'Road shield section' },
          { id: 'api-shields-object',  label: 'Shield object' },
        ]},
    ],
  },
  {
    type: 'endpoint', label: 'Compute Toll Amounts', key: 'ep-tolls',
    versions: [
      { id: 'routing-v2-compute-toll', version: 'v2', label: 'v2 Preview', anchors: [
          { id: 'routing-v2-toll',          label: 'Request parameters', method: 'GET' },
          { id: 'routing-v2-toll-response', label: 'Response data' },
        ]},
      { id: 'routing-v3-compute-toll', version: 'v3', label: 'v3 Preview', anchors: [
          { id: 'routing-v3-toll-get',      label: 'Request parameters (GET)',  method: 'GET'  },
          { id: 'routing-v3-toll-post',     label: 'Request parameters (POST)', method: 'POST' },
          { id: 'routing-v3-toll-response', label: 'Response data' },
        ]},
    ],
  },
  {
    type: 'endpoint', label: 'Dynamic Data Freshness', key: 'ep-freshness',
    versions: [
      { id: 'routing-v2-data-freshness', version: 'v2', label: 'v2 Preview', anchors: [
          { id: 'routing-v2-freshness-request',  label: 'Request parameter', method: 'GET' },
          { id: 'routing-v2-freshness-response', label: 'Response data' },
        ]},
    ],
  },
  {
    type: 'endpoint', label: 'Weather Consideration', key: 'ep-weather',
    versions: [
      { id: 'routing-v3-weather', version: 'v3', label: 'v3 Preview', anchors: [
          { id: 'routing-v3-weather-request',  label: 'Request parameters',   method: 'POST' },
          { id: 'routing-v3-weather-body',     label: 'POST body parameters', method: 'POST' },
          { id: 'routing-v3-weather-response', label: 'Response data' },
        ]},
    ],
  },

  { type: 'section', label: 'Advanced & Reference' },
  { id: 'routing-v3-overview', label: 'Routing API v3', type: 'top' },
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
  // v1 endpoints
  'routing-calculate-route':     'Calculate Route',
  'routing-reachable-range':     'Reachable Range',
  'routing-batch':               'Batch Routing',
  'routing-instructions':        'Turn-by-Turn Instructions',
  'routing-lane-guidance':       'Lane Guidance',
  'routing-road-shields':        'Road Shield Notes',
  'api-rr-budget':               'Budget & origin',
  'api-rr-vehicle':              'Vehicle profile',
  'api-rr-combustion':           'Combustion consumption model',
  'api-rr-electric':             'Electric consumption model',
  'api-rr-response':             'Response',
  'api-rr-errors':               'Error codes',
  'api-batch-sync':              'Synchronous batch',
  'api-batch-async':             'Asynchronous batch',
  'api-batch-response':          'Response schema',
  'api-batch-errors':            'Error codes',
  'api-instr-request':           'Request parameters',
  'api-instr-response':          'Instruction object',
  'api-instr-coded':             'Coded mode',
  'api-lane-request':            'Enabling lane guidance',
  'api-lane-response':           'Lane object schema',
  'api-lane-render':             'Rendering guidance',
  'api-shields-request':         'Enabling road shields',
  'api-shields-section':         'Road shield section',
  'api-shields-object':          'Shield object',
  // v2 endpoints
  'routing-v2-calculate-route':  'Calculate Route',
  'routing-v2-reachable-range':  'Reachable Range',
  'routing-v2-compute-toll':     'Compute Toll Amounts',
  'routing-v2-guidance':         'Guidance Instructions',
  'routing-v2-data-freshness':   'Dynamic Data Freshness',
  // v3 endpoints
  'routing-v3-overview':         'Routing API v3',
  'routing-v3-calculate-route':  'Calculate Route',
  'routing-v3-guidance':         'Guidance Instructions',
  'routing-v3-reachable-range':  'Reachable Range',
  'routing-v3-compute-toll':     'Compute Toll Amounts',
  'routing-v3-weather':          'Weather Consideration',
  // Advanced & Reference
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
