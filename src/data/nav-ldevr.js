/* ─────────────────────────────────────────────────────────────────────────────
 * Long Distance EV Routing API navigation
 * Option A  — version-sectioned
 * Option B  — concept-first + vDots  ← DEFAULT
 * Option C  — concept-first + version-filter
 *
 * v1 = TomTom Maps (tomtom-maps folder)
 * v2 = Orbis Maps v2 (tomtom-orbis-maps/v2) — Public Preview
 * v3 = Orbis Maps v3 (tomtom-orbis-maps/v3) — Private Preview
 * ───────────────────────────────────────────────────────────────────────────── */

/* ── Shared concept endpoints ───────────────────────────────────────────── */
const LDEVR_CONCEPT_ENDPOINTS = [
  { id: 'ldevr-calculate-route', label: 'Calculate EV Route',         type: 'top', ref: true, vDots: ['v1','v2','v3'], anchors: [
      { id: 'api-ldevr-route',            label: 'Route planning',             method: 'POST' },
      { id: 'api-ldevr-battery',          label: 'EV & battery profile',       method: 'POST' },
      { id: 'api-ldevr-connector',        label: 'Charging connector & power', method: 'POST' },
      { id: 'api-ldevr-consumption',      label: 'Energy consumption model',   method: 'POST' },
      { id: 'api-ldevr-response-summary', label: 'Route & battery summary' },
      { id: 'api-ldevr-response-station', label: 'Charging stop details' },
      { id: 'api-ldevr-errors',           label: 'Error codes' },
    ]},
  { id: 'ldevr-compute-toll',    label: 'Compute Toll Amounts',        type: 'top', ref: true, vDots: ['v2'], anchors: [
      { id: 'ldevr-toll-request',  label: 'Request parameters', method: 'POST' },
      { id: 'ldevr-toll-response', label: 'Response data' },
    ]},
  { id: 'ldevr-batch',           label: 'Batch EV Route',              type: 'top', ref: true, vDots: ['v1'], anchors: [
      { id: 'api-ldevr-batch-sync',     label: 'Synchronous batch',  method: 'POST' },
      { id: 'api-ldevr-batch-async',    label: 'Asynchronous batch', method: 'POST' },
      { id: 'api-ldevr-batch-response', label: 'Response schema' },
      { id: 'api-ldevr-batch-errors',   label: 'Error codes' },
    ]},
  { id: 'ldevr-weather',         label: 'Weather Consideration',       type: 'top', ref: true, vDots: ['v2'], anchors: [
      { id: 'ldevr-weather-request-params', label: 'Request parameters',   method: 'POST' },
      { id: 'ldevr-weather-body-params',    label: 'POST body parameters', method: 'POST' },
      { id: 'ldevr-weather-response',       label: 'Response data' },
    ]},
  { id: 'ldevr-vehicle-brand',   label: 'Vehicle Brand',               type: 'top', ref: true, vDots: ['v2'], anchors: [
      { id: 'ldevr-vehicle-brand-params',   label: 'Request parameters', method: 'POST' },
      { id: 'ldevr-vehicle-brand-response', label: 'Response data' },
    ]},
  { id: 'ldevr-charging-parks',  label: 'Charging Parks Opening Hours',type: 'top', ref: true, vDots: ['v2'], anchors: [
      { id: 'ldevr-parks-request',  label: 'Request parameters', method: 'POST' },
      { id: 'ldevr-parks-response', label: 'Response data' },
    ]},
  { id: 'ldevr-oem-emsp',        label: 'OEM eMSP Support',            type: 'top', ref: true, vDots: ['v2'], anchors: [
      { id: 'ldevr-emsp-headers',  label: 'Request headers',    method: 'POST' },
      { id: 'ldevr-emsp-sev',      label: 'SEV entitlement key' },
      { id: 'ldevr-emsp-response', label: 'Response data' },
    ]},
  { id: 'ldevr-data-freshness',  label: 'Dynamic Data Freshness',      type: 'top', ref: true, vDots: ['v2'], anchors: [
      { id: 'ldevr-freshness-request',  label: 'Request parameters', method: 'GET' },
      { id: 'ldevr-freshness-post',     label: 'POST usage',         method: 'POST' },
      { id: 'ldevr-freshness-response', label: 'Response data' },
    ]},
  { id: 'ldevr-guidance',        label: 'Guidance Instructions',       type: 'top', ref: true, vDots: ['v3'], anchors: [
      { id: 'ldevr-guidance-request',     label: 'Request parameters', method: 'POST' },
      { id: 'ldevr-guidance-header',      label: 'Request headers' },
      { id: 'ldevr-guidance-instruction', label: 'Instruction object' },
      { id: 'ldevr-guidance-conditional', label: 'Conditional guidance' },
    ]},
];

/* ── Shared tail ─────────────────────────────────────────────────────────── */
const LDEVR_SHARED_TAIL = [
  { type: 'section', label: 'Getting Started' },
  {
    label: 'Quick Start', key: 'ldEvrQuickStart', type: 'group', landingId: 'ldevr-quickstart',
    items: [
      { id: 'ldevr-auth',        label: 'Authentication' },
      { id: 'ldevr-first-route', label: 'Plan Your First EV Route' },
    ],
  },
  {
    label: 'Core Concepts', key: 'ldEvrConcepts', type: 'group', landingId: 'ldevr-concepts',
    items: [
      { id: 'ldevr-charging-stops',  label: 'Charging Stop Selection' },
      { id: 'ldevr-battery-model',   label: 'Battery & Consumption Model' },
      { id: 'ldevr-connectors',      label: 'Connector Types' },
    ],
  },
  { type: 'section', label: 'Reference' },
  {
    label: 'Versions & Reference', key: 'ldEvrRef', type: 'group', landingId: 'ldevr-platform',
    items: [
      { id: 'ldevr-tomtom-maps', label: 'LDEVR v1' },
      { id: 'ldevr-orbis-v2',    label: 'LDEVR v2' },
      { id: 'ldevr-orbis-v3',    label: 'LDEVR v3 (Private Preview)' },
      { id: 'ldevr-migration',   label: 'Migration Guide' },
      { id: 'ldevr-params-ref',   label: 'Parameter Index' },
      { id: 'ldevr-response-ref', label: 'Response Schema' },
      { id: 'ldevr-errors',      label: 'Error Codes' },
      { id: 'ldevr-coverage',    label: 'Market Coverage' },
    ],
  },
];

/* ── Option A — version-sectioned ─────────────────────────────────────────── */
export const LDEVR_NAV = [
  { id: 'ldevr-intro', label: 'Introduction', type: 'top' },

  { type: 'section', label: 'Version 1', badge: 'v1' },
  { id: 'ldevr-calculate-route', label: 'Calculate EV Route',   type: 'top', ref: true, anchors: [
      { id: 'api-ldevr-route',            label: 'Route planning',             method: 'POST' },
      { id: 'api-ldevr-battery',          label: 'EV & battery profile',       method: 'POST' },
      { id: 'api-ldevr-connector',        label: 'Charging connector & power', method: 'POST' },
      { id: 'api-ldevr-consumption',      label: 'Energy consumption model',   method: 'POST' },
      { id: 'api-ldevr-response-summary', label: 'Route & battery summary' },
      { id: 'api-ldevr-response-station', label: 'Charging stop details' },
      { id: 'api-ldevr-errors',           label: 'Error codes' },
    ]},
  { id: 'ldevr-compute-toll',    label: 'Compute Toll Amounts',  type: 'top', ref: true, anchors: [
      { id: 'ldevr-toll-request',  label: 'Request parameters', method: 'POST' },
      { id: 'ldevr-toll-response', label: 'Response data' },
    ]},
  { id: 'ldevr-batch',           label: 'Batch EV Route',        type: 'top', ref: true, anchors: [
      { id: 'api-ldevr-batch-sync',     label: 'Synchronous batch',  method: 'POST' },
      { id: 'api-ldevr-batch-async',    label: 'Asynchronous batch', method: 'POST' },
      { id: 'api-ldevr-batch-response', label: 'Response schema' },
      { id: 'api-ldevr-batch-errors',   label: 'Error codes' },
    ]},

  { type: 'section', label: 'Version 2', badge: 'v2-public' },
  { id: 'ldevr-weather',        label: 'Weather Consideration',        type: 'top', ref: true, anchors: [
      { id: 'ldevr-weather-request-params', label: 'Request parameters',   method: 'POST' },
      { id: 'ldevr-weather-body-params',    label: 'POST body parameters', method: 'POST' },
      { id: 'ldevr-weather-response',       label: 'Response data' },
    ]},
  { id: 'ldevr-vehicle-brand',  label: 'Vehicle Brand',                type: 'top', ref: true, anchors: [
      { id: 'ldevr-vehicle-brand-params',   label: 'Request parameters', method: 'POST' },
      { id: 'ldevr-vehicle-brand-response', label: 'Response data' },
    ]},
  { id: 'ldevr-charging-parks', label: 'Charging Parks Opening Hours', type: 'top', ref: true, anchors: [
      { id: 'ldevr-parks-request',  label: 'Request parameters', method: 'POST' },
      { id: 'ldevr-parks-response', label: 'Response data' },
    ]},
  { id: 'ldevr-oem-emsp',       label: 'OEM eMSP Support',             type: 'top', ref: true, anchors: [
      { id: 'ldevr-emsp-headers',  label: 'Request headers',    method: 'POST' },
      { id: 'ldevr-emsp-sev',      label: 'SEV entitlement key' },
      { id: 'ldevr-emsp-response', label: 'Response data' },
    ]},
  { id: 'ldevr-data-freshness', label: 'Dynamic Data Freshness',       type: 'top', ref: true, anchors: [
      { id: 'ldevr-freshness-request',  label: 'Request parameters', method: 'GET' },
      { id: 'ldevr-freshness-post',     label: 'POST usage',         method: 'POST' },
      { id: 'ldevr-freshness-response', label: 'Response data' },
    ]},

  { type: 'section', label: 'Version 3', badge: 'v3-private' },
  { id: 'ldevr-v3-calculate-route', label: 'Calculate EV Route', type: 'top', ref: true, anchors: [
      { id: 'ldevr-v3-route-params', label: 'Request parameters', method: 'POST' },
      { id: 'ldevr-v3-response',     label: 'Response schema' },
    ]},
  { id: 'ldevr-guidance',           label: 'Guidance Instructions',    type: 'top', ref: true, anchors: [
      { id: 'ldevr-guidance-request', label: 'Request parameters', method: 'POST' },
      { id: 'ldevr-guidance-object',  label: 'Instruction object' },
      { id: 'ldevr-guidance-lanes',   label: 'Lane information' },
    ]},

  ...LDEVR_SHARED_TAIL,
];

/* ── Option B — concept-first + vDots ────────────────────────────────────── */
export const LDEVR_NAV_B = [
  { id: 'ldevr-intro', label: 'Introduction', type: 'top' },
  { type: 'section', label: 'Endpoints' },
  ...LDEVR_CONCEPT_ENDPOINTS,
  ...LDEVR_SHARED_TAIL,
];

/* ── Option C — concept-first + version-filter ───────────────────────────── */
export const LDEVR_NAV_C = [
  { id: 'ldevr-intro', label: 'Introduction', type: 'top' },
  { type: 'version-filter' },
  { type: 'section', label: 'Endpoints' },
  ...LDEVR_CONCEPT_ENDPOINTS,
  ...LDEVR_SHARED_TAIL,
];

export const LDEVR_PAGE_TITLES = {
  'ldevr-intro': 'Introduction',

  /* ── endpoints ── */
  'ldevr-calculate-route':  'Calculate EV Route',
  'ldevr-compute-toll':     'Compute Toll Amounts',
  'ldevr-batch':            'Batch EV Route',
  'ldevr-weather':          'Weather Consideration',
  'ldevr-vehicle-brand':    'Vehicle Brand',
  'ldevr-charging-parks':   'Charging Parks Opening Hours',
  'ldevr-oem-emsp':         'OEM eMSP Support',
  'ldevr-data-freshness':   'Dynamic Data Freshness',
  'ldevr-guidance':         'Guidance Instructions',
  'ldevr-v3-calculate-route':'Calculate EV Route',

  /* ── getting started ── */
  'ldevr-quickstart':      'Quick Start',
  'ldevr-auth':            'Authentication',
  'ldevr-first-route':     'Plan Your First EV Route',
  'ldevr-concepts':        'Core Concepts',
  'ldevr-charging-stops':  'Charging Stop Selection',
  'ldevr-battery-model':   'Battery & Consumption Model',
  'ldevr-connectors':      'Connector Types',

  /* ── reference ── */
  'ldevr-platform':    'Versions & Reference',
  'ldevr-tomtom-maps': 'LDEVR v1',
  'ldevr-orbis-v2':    'LDEVR v2',
  'ldevr-orbis-v3':    'LDEVR v3 (Private Preview)',
  'ldevr-migration':   'Migration Guide',
  'ldevr-params-ref':   'LDEVR — Parameter Index',
  'ldevr-response-ref': 'LDEVR — Response Schema',
  'ldevr-errors':      'Error Codes',
  'ldevr-coverage':    'Market Coverage',
};
