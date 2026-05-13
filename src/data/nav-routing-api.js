export const ROUTING_API_NAV = [
  { id: 'routing-api-intro', label: 'Introduction', type: 'top' },
  { id: 'routing-quickstart', label: 'Quick Start', type: 'top' },

  /* ── Version 1 ── */
  { type: 'section', label: 'Version 1', badge: 'v1' },
  { id: 'routing-calculate-route', label: 'Calculate Route', type: 'top', ref: true, anchors: [
      { id: 'api-rc-route-planning', label: 'Route planning',               method: 'GET'  },
      { id: 'api-rc-vehicle',        label: 'Vehicle profile',              method: 'GET'  },
      { id: 'api-rc-combustion',     label: 'Combustion consumption model', method: 'GET'  },
      { id: 'api-rc-electric',       label: 'Electric consumption model',   method: 'GET'  },
      { id: 'api-rc-post-body',      label: 'POST body',                    method: 'POST' },
      { id: 'api-rc-response',       label: 'Response' },
      { id: 'api-rc-errors',         label: 'Error codes' },
    ]},
  { id: 'routing-reachable-range', label: 'Reachable Range', type: 'top', ref: true, anchors: [
      { id: 'api-rr-budget',     label: 'Budget & origin',              method: 'GET' },
      { id: 'api-rr-vehicle',    label: 'Vehicle profile',              method: 'GET' },
      { id: 'api-rr-combustion', label: 'Combustion consumption model', method: 'GET' },
      { id: 'api-rr-electric',   label: 'Electric consumption model',   method: 'GET' },
      { id: 'api-rr-response',   label: 'Response' },
      { id: 'api-rr-errors',     label: 'Error codes' },
    ]},
  { id: 'routing-batch', label: 'Batch Routing', type: 'top', ref: true, anchors: [
      { id: 'api-batch-sync',     label: 'Synchronous batch',  method: 'POST' },
      { id: 'api-batch-async',    label: 'Asynchronous batch', method: 'POST' },
      { id: 'api-batch-response', label: 'Response schema' },
      { id: 'api-batch-errors',   label: 'Error codes' },
    ]},
  { id: 'routing-instructions', label: 'Turn-by-Turn Instructions', type: 'top', ref: true, anchors: [
      { id: 'api-instr-request',  label: 'Request parameters', method: 'GET' },
      { id: 'api-instr-response', label: 'Instruction object' },
      { id: 'api-instr-coded',    label: 'Coded mode' },
    ]},
  { id: 'routing-lane-guidance', label: 'Lane Guidance', type: 'top', ref: true, anchors: [
      { id: 'api-lane-request',  label: 'Enabling lane guidance', method: 'GET' },
      { id: 'api-lane-response', label: 'Lane object schema' },
      { id: 'api-lane-render',   label: 'Rendering guidance' },
    ]},
  { id: 'routing-road-shields', label: 'Road Shield Notes', type: 'top', ref: true, anchors: [
      { id: 'api-shields-request', label: 'Enabling road shields', method: 'GET' },
      { id: 'api-shields-section', label: 'Road shield section' },
      { id: 'api-shields-object',  label: 'Shield object' },
    ]},

  /* ── Version 2 ── */
  { type: 'section', label: 'Version 2', badge: 'v2-public' },
  { id: 'routing-v2-calculate-route', label: 'Calculate Route', type: 'top', ref: true, anchors: [
      { id: 'routing-v2-route',      label: 'Route planning',               method: 'GET'  },
      { id: 'routing-v2-headers',    label: 'Request headers'                              },
      { id: 'routing-v2-vehicle',    label: 'Vehicle profile',              method: 'GET'  },
      { id: 'routing-v2-combustion', label: 'Combustion consumption model', method: 'GET'  },
      { id: 'routing-v2-electric',   label: 'Electric consumption model',   method: 'GET'  },
      { id: 'routing-v2-post-body',  label: 'POST body',                    method: 'POST' },
      { id: 'routing-v2-response',   label: 'Response & error codes'                       },
    ]},
  { id: 'routing-v2-reachable-range', label: 'Reachable Range', type: 'top', ref: true, anchors: [
      { id: 'routing-v2-rr-budget',     label: 'Budget & origin',              method: 'GET'  },
      { id: 'routing-v2-rr-vehicle',    label: 'Vehicle profile',              method: 'GET'  },
      { id: 'routing-v2-rr-combustion', label: 'Combustion consumption model', method: 'GET'  },
      { id: 'routing-v2-rr-electric',   label: 'Electric consumption model',   method: 'GET'  },
      { id: 'routing-v2-rr-post-body',  label: 'POST body',                    method: 'POST' },
      { id: 'routing-v2-rr-response',   label: 'Response data' },
    ]},
  { id: 'routing-v2-compute-toll', label: 'Compute Toll Amounts', type: 'top', ref: true, anchors: [
      { id: 'routing-v2-toll',          label: 'Request parameters', method: 'GET' },
      { id: 'routing-v2-toll-response', label: 'Response data' },
    ]},
  { id: 'routing-v2-guidance', label: 'Guidance Instructions', type: 'top', ref: true, anchors: [
      { id: 'routing-v2-guidance-request', label: 'Request parameters', method: 'GET' },
      { id: 'routing-v2-guidance-object',  label: 'Instruction object' },
      { id: 'routing-v2-guidance-lanes',   label: 'Lane information' },
    ]},
  { id: 'routing-v2-data-freshness', label: 'Dynamic Data Freshness', type: 'top', ref: true, anchors: [
      { id: 'routing-v2-freshness-request',  label: 'Request parameter', method: 'GET' },
      { id: 'routing-v2-freshness-response', label: 'Response data' },
    ]},

  /* ── Version 3 ── */
  { type: 'section', label: 'Version 3', badge: 'v3-private' },
  { id: 'routing-v3-calculate-route', label: 'Calculate Route', type: 'top', ref: true, anchors: [
      { id: 'routing-v3-route',      label: 'Route planning',               method: 'POST' },
      { id: 'routing-v3-headers',    label: 'Request headers & attributes'                 },
      { id: 'routing-v3-vehicle',    label: 'Vehicle profile',              method: 'POST' },
      { id: 'routing-v3-combustion', label: 'Combustion consumption model', method: 'POST' },
      { id: 'routing-v3-electric',   label: 'Electric consumption model',   method: 'POST' },
      { id: 'routing-v3-post-body',  label: 'Request body (legs array)',    method: 'POST' },
      { id: 'routing-v3-response',   label: 'Response & error codes'                       },
    ]},
  { id: 'routing-v3-reachable-range', label: 'Reachable Range', type: 'top', ref: true, anchors: [
      { id: 'routing-v3-rr-budget',     label: 'Budget & origin',              method: 'POST' },
      { id: 'routing-v3-rr-vehicle',    label: 'Vehicle profile',              method: 'POST' },
      { id: 'routing-v3-rr-combustion', label: 'Combustion consumption model', method: 'POST' },
      { id: 'routing-v3-rr-electric',   label: 'Electric consumption model',   method: 'POST' },
      { id: 'routing-v3-rr-post-body',  label: 'Request body',                 method: 'POST' },
      { id: 'routing-v3-rr-response',   label: 'Response & error codes'                       },
    ]},
  { id: 'routing-v3-compute-toll', label: 'Compute Toll Amounts', type: 'top', ref: true, anchors: [
      { id: 'routing-v3-toll-get',      label: 'Request parameters (GET)',  method: 'GET'  },
      { id: 'routing-v3-toll-post',     label: 'Request parameters (POST)', method: 'POST' },
      { id: 'routing-v3-toll-response', label: 'Response data' },
    ]},
  { id: 'routing-v3-guidance', label: 'Guidance Instructions', type: 'top', ref: true, anchors: [
      { id: 'routing-v3-guidance-request', label: 'Enabling guidance',   method: 'POST' },
      { id: 'routing-v3-guidance-object',  label: 'Instruction object'                  },
      { id: 'routing-v3-guidance-lanes',   label: 'Lane information'                    },
    ]},
  { id: 'routing-v3-weather', label: 'Weather Consideration', type: 'top', ref: true, anchors: [
      { id: 'routing-v3-weather-request',  label: 'Request parameters',   method: 'POST' },
      { id: 'routing-v3-weather-body',     label: 'POST body parameters', method: 'POST' },
      { id: 'routing-v3-weather-response', label: 'Response data' },
    ]},

  /* ── Guides ── */
  { type: 'section', label: 'Guides' },
  {
    label: 'EV Routing', key: 'routingEV', type: 'group', landingId: 'routing-ev',
    items: [
      { id: 'routing-ev-overview',     label: 'EV Route Planning' },
      { id: 'routing-ev-consumption',  label: 'Consumption Models' },
      { id: 'routing-ev-connectors',   label: 'Vehicle Profiles' },
    ],
  },
  {
    label: 'How-to', key: 'routingHowTo', type: 'group', landingId: 'routing-howto',
    items: [
      { id: 'routing-reconstruction', label: 'Route Reconstruction' },
      { id: 'routing-avoid-areas',    label: 'Avoiding Areas' },
      { id: 'routing-tolls',          label: 'Vignettes & Toll Systems' },
    ],
  },

  /* ── Versions & Reference ── */
  { type: 'section', label: 'Reference' },
  {
    label: 'Versions & Reference', key: 'routingRef', type: 'group', landingId: 'routing-platform',
    items: [
      { id: 'routing-tomtom-maps',  label: 'Routing API v1' },
      { id: 'routing-orbis-maps',   label: 'Routing API v2 & v3' },
      { id: 'routing-migration',    label: 'Migration Guide' },
      { id: 'routing-params-ref',   label: 'Parameter Index' },
      { id: 'routing-response-ref', label: 'Response Schema' },
      { id: 'routing-error-codes',  label: 'Error Codes' },
      { id: 'routing-coverage',     label: 'Market Coverage' },
    ],
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
 * Shared tail used by both Option B and Option C (guides / platforms / reference)
 * ───────────────────────────────────────────────────────────────────────────── */
const SHARED_TAIL = [
  { type: 'section', label: 'Guides' },
  {
    label: 'EV Routing', key: 'routingEV', type: 'group', landingId: 'routing-ev',
    items: [
      { id: 'routing-ev-overview',    label: 'EV Route Planning' },
      { id: 'routing-ev-consumption', label: 'Consumption Models' },
      { id: 'routing-ev-connectors',  label: 'Vehicle Profiles' },
    ],
  },
  {
    label: 'How-to', key: 'routingHowTo', type: 'group', landingId: 'routing-howto',
    items: [
      { id: 'routing-reconstruction', label: 'Route Reconstruction' },
      { id: 'routing-avoid-areas',    label: 'Avoiding Areas' },
      { id: 'routing-tolls',          label: 'Vignettes & Toll Systems' },
    ],
  },
  /* ── Versions & Reference ── */
  { type: 'section', label: 'Reference' },
  {
    label: 'Versions & Reference', key: 'routingRef', type: 'group', landingId: 'routing-platform',
    items: [
      { id: 'routing-tomtom-maps',  label: 'Routing API v1' },
      { id: 'routing-orbis-maps',   label: 'Routing API v2 & v3' },
      { id: 'routing-migration',    label: 'Migration Guide' },
      { id: 'routing-params-ref',   label: 'Parameter Index' },
      { id: 'routing-response-ref', label: 'Response Schema' },
      { id: 'routing-error-codes',  label: 'Error Codes' },
      { id: 'routing-coverage',     label: 'Market Coverage' },
    ],
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
 * Shared endpoint concepts used by Option B and C
 * vDots = which versions support this endpoint
 * ───────────────────────────────────────────────────────────────────────────── */
const CONCEPT_ENDPOINTS = [
  { id: 'routing-calculate-route', label: 'Calculate Route', type: 'top', ref: true, vDots: ['v1','v2','v3'], anchors: [
      { id: 'api-rc-route-planning', label: 'Route planning',               method: 'GET'  },
      { id: 'api-rc-vehicle',        label: 'Vehicle profile',              method: 'GET'  },
      { id: 'api-rc-combustion',     label: 'Combustion consumption model', method: 'GET'  },
      { id: 'api-rc-electric',       label: 'Electric consumption model',   method: 'GET'  },
      { id: 'api-rc-post-body',      label: 'POST body',                    method: 'POST' },
      { id: 'api-rc-response',       label: 'Response' },
      { id: 'api-rc-errors',         label: 'Error codes' },
    ]},
  { id: 'routing-reachable-range', label: 'Reachable Range', type: 'top', ref: true, vDots: ['v1','v2','v3'], anchors: [
      { id: 'api-rr-budget',     label: 'Budget & origin',              method: 'GET' },
      { id: 'api-rr-vehicle',    label: 'Vehicle profile',              method: 'GET' },
      { id: 'api-rr-combustion', label: 'Combustion consumption model', method: 'GET' },
      { id: 'api-rr-electric',   label: 'Electric consumption model',   method: 'GET' },
      { id: 'api-rr-response',   label: 'Response' },
      { id: 'api-rr-errors',     label: 'Error codes' },
    ]},
  { id: 'routing-batch', label: 'Batch Routing', type: 'top', ref: true, vDots: ['v1'], anchors: [
      { id: 'api-batch-sync',     label: 'Synchronous batch',  method: 'POST' },
      { id: 'api-batch-async',    label: 'Asynchronous batch', method: 'POST' },
      { id: 'api-batch-response', label: 'Response schema' },
      { id: 'api-batch-errors',   label: 'Error codes' },
    ]},
  { id: 'routing-instructions', label: 'Turn-by-Turn Instructions', type: 'top', ref: true, vDots: ['v1'], anchors: [
      { id: 'api-instr-request',  label: 'Request parameters', method: 'GET' },
      { id: 'api-instr-response', label: 'Instruction object' },
      { id: 'api-instr-coded',    label: 'Coded mode' },
    ]},
  { id: 'routing-v2-guidance', label: 'Guidance Instructions', type: 'top', ref: true, vDots: ['v2','v3'], anchors: [
      { id: 'routing-v2-guidance-request', label: 'Request parameters', method: 'GET' },
      { id: 'routing-v2-guidance-object',  label: 'Instruction object' },
      { id: 'routing-v2-guidance-lanes',   label: 'Lane information' },
    ]},
  { id: 'routing-lane-guidance', label: 'Lane Guidance', type: 'top', ref: true, vDots: ['v1','v2','v3'], anchors: [
      { id: 'api-lane-request',  label: 'Enabling lane guidance', method: 'GET' },
      { id: 'api-lane-response', label: 'Lane object schema' },
      { id: 'api-lane-render',   label: 'Rendering guidance' },
    ]},
  { id: 'routing-road-shields', label: 'Road Shield Notes', type: 'top', ref: true, vDots: ['v1'], anchors: [
      { id: 'api-shields-request', label: 'Enabling road shields', method: 'GET' },
      { id: 'api-shields-section', label: 'Road shield section' },
      { id: 'api-shields-object',  label: 'Shield object' },
    ]},
  { id: 'routing-v2-compute-toll', label: 'Compute Toll Amounts', type: 'top', ref: true, vDots: ['v2','v3'], anchors: [
      { id: 'routing-v2-toll',          label: 'Request parameters', method: 'GET' },
      { id: 'routing-v2-toll-response', label: 'Response data' },
    ]},
  { id: 'routing-v2-data-freshness', label: 'Dynamic Data Freshness', type: 'top', ref: true, vDots: ['v2'], anchors: [
      { id: 'routing-v2-freshness-request',  label: 'Request parameter', method: 'GET' },
      { id: 'routing-v2-freshness-response', label: 'Response data' },
    ]},
  { id: 'routing-v3-weather', label: 'Weather Consideration', type: 'top', ref: true, vDots: ['v3'], anchors: [
      { id: 'routing-v3-weather-request',  label: 'Request parameters',   method: 'POST' },
      { id: 'routing-v3-weather-body',     label: 'POST body parameters', method: 'POST' },
      { id: 'routing-v3-weather-response', label: 'Response data' },
    ]},
];

/* ─────────────────────────────────────────────────────────────────────────────
 * Option B — Concept-first with version dots
 * One entry per endpoint concept; dots show version coverage.
 * ───────────────────────────────────────────────────────────────────────────── */
export const ROUTING_API_NAV_B = [
  { id: 'routing-api-intro',  label: 'Introduction', type: 'top' },
  { id: 'routing-quickstart', label: 'Quick Start',  type: 'top' },
  { type: 'section', label: 'Endpoints' },
  ...CONCEPT_ENDPOINTS,
  ...SHARED_TAIL,
];

/* ─────────────────────────────────────────────────────────────────────────────
 * Option C — Version filter
 * Same concept-first structure but with a version-filter control in the nav.
 * Sidenav handles the filter-type entry and hides items not matching vDots.
 * ───────────────────────────────────────────────────────────────────────────── */
export const ROUTING_API_NAV_C = [
  { id: 'routing-api-intro',  label: 'Introduction', type: 'top' },
  { id: 'routing-quickstart', label: 'Quick Start',  type: 'top' },
  { type: 'version-filter' },
  { type: 'section', label: 'Endpoints' },
  ...CONCEPT_ENDPOINTS,
  ...SHARED_TAIL,
];

export const ROUTING_API_PAGE_TITLES = {
  /* ── Top level ── */
  'routing-api-intro':     'Introduction',
  'routing-quickstart':    'Quick Start',

  /* ── Version 1 ── */
  'routing-calculate-route':  'Calculate Route',
  'routing-reachable-range':  'Reachable Range',
  'routing-batch':            'Batch Routing',
  'routing-instructions':     'Turn-by-Turn Instructions',
  'routing-lane-guidance':    'Lane Guidance',
  'routing-road-shields':     'Road Shield Notes',

  /* ── Version 2 ── */
  'routing-v2-calculate-route':  'Calculate Route',
  'routing-v2-reachable-range':  'Reachable Range',
  'routing-v2-compute-toll':     'Compute Toll Amounts',
  'routing-v2-guidance':         'Guidance Instructions',
  'routing-v2-data-freshness':   'Dynamic Data Freshness',

  /* ── Version 3 ── */
  'routing-v3-calculate-route':  'Calculate Route',
  'routing-v3-reachable-range':  'Reachable Range',
  'routing-v3-compute-toll':     'Compute Toll Amounts',
  'routing-v3-guidance':         'Guidance Instructions',
  'routing-v3-weather':          'Weather Consideration',

  /* ── Guides ── */
  'routing-ev':            'EV Routing',
  'routing-ev-overview':   'EV Route Planning',
  'routing-ev-consumption':'Consumption Models',
  'routing-ev-connectors': 'Vehicle Profiles',
  'routing-howto':         'How-to',
  'routing-reconstruction':'Route Reconstruction',
  'routing-avoid-areas':   'Avoiding Areas',
  'routing-tolls':         'Vignettes & Toll Systems',

  /* ── Map Platforms ── */
  'routing-platform':      'Platforms & Migration',
  'routing-tomtom-maps':   'Routing API v1',
  'routing-orbis-maps':    'Routing API v2 & v3',
  'routing-migration':     'Migration Guide',

  /* ── Reference ── */
  'routing-params-ref':    'Parameter Index',
  'routing-response-ref':  'Response Schema',
  'routing-error-codes':   'Error Codes',
  'routing-coverage':      'Market Coverage',
};
