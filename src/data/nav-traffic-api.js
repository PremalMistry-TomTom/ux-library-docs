/* ─────────────────────────────────────────────────────────────────────────────
 * Traffic API navigation
 * Option A  — version-sectioned
 * Option B  — concept-first + vDots  ← DEFAULT
 * Option C  — concept-first + version-filter
 *
 * v1 = TomTom Maps (tomtom-maps folder)
 * v2 = Orbis Maps  (tomtom-orbis-maps folder)
 * ───────────────────────────────────────────────────────────────────────────── */

/* ── Shared concept endpoints ───────────────────────────────────────────── */
const TRAFFIC_CONCEPT_ENDPOINTS = [
  { id: 'traffic-flow-segment',  label: 'Flow Segment Data',    type: 'top', ref: true, vDots: ['v1','v2'], anchors: [
      { id: 'traffic-fsd-request',  label: 'Request parameters', method: 'GET' },
      { id: 'traffic-fsd-response', label: 'Response schema' },
    ]},
  { id: 'traffic-raster-flow',   label: 'Raster Flow Tiles',    type: 'top', ref: true, vDots: ['v1','v2'], anchors: [
      { id: 'traffic-rf-request',  label: 'Request parameters', method: 'GET' },
      { id: 'traffic-rf-response', label: 'Response' },
      { id: 'traffic-rf-styles',   label: 'Flow styles' },
    ]},
  { id: 'traffic-vector-flow',   label: 'Vector Flow Tiles',    type: 'top', ref: true, vDots: ['v1','v2'], anchors: [
      { id: 'traffic-vf-request',  label: 'Request parameters', method: 'GET' },
      { id: 'traffic-vf-response', label: 'Response' },
      { id: 'traffic-vf-structure','label': 'Tile structure' },
    ]},
  { id: 'traffic-flow-tiles',    label: 'Flow Tiles Overview',  type: 'top', ref: true, vDots: ['v1','v2'], anchors: [
      { id: 'traffic-ft-raster', label: 'Raster tiles',  method: 'GET' },
      { id: 'traffic-ft-vector', label: 'Vector tiles',  method: 'GET' },
    ]},
  { id: 'traffic-incident-details', label: 'Incident Details',  type: 'top', ref: true, vDots: ['v1','v2'], anchors: [
      { id: 'traffic-inc-request',  label: 'Request parameters', method: 'GET' },
      { id: 'traffic-inc-response', label: 'Response schema' },
      { id: 'traffic-inc-viewport', label: 'Incident Viewport',  method: 'GET' },
    ]},
  { id: 'traffic-raster-incident',  label: 'Raster Incident Tiles', type: 'top', ref: true, vDots: ['v1','v2'], anchors: [
      { id: 'traffic-ri-request',  label: 'Request parameters', method: 'GET' },
      { id: 'traffic-ri-response', label: 'Response' },
    ]},
  { id: 'traffic-vector-incident',  label: 'Vector Incident Tiles', type: 'top', ref: true, vDots: ['v1','v2'], anchors: [
      { id: 'traffic-vi-request',  label: 'Request parameters', method: 'GET' },
      { id: 'traffic-vi-structure','label': 'Tile structure' },
    ]},
  { id: 'traffic-model-id',     label: 'Traffic Model ID',     type: 'top', ref: true, vDots: ['v1','v2'], anchors: [
      { id: 'traffic-mid-request',       label: 'Request parameters',     method: 'GET' },
      { id: 'traffic-mid-response',      label: 'Response' },
      { id: 'traffic-mid-cache-pattern', label: 'Cache validation pattern' },
    ]},
];

/* ── Shared tail ─────────────────────────────────────────────────────────── */
const TRAFFIC_SHARED_TAIL = [
  { type: 'section', label: 'Guides' },
  {
    label: 'How-to', key: 'trafficGuides', type: 'group', landingId: 'traffic-guides',
    items: [
      { id: 'traffic-guide-tiles',   label: 'Rendering Traffic Tiles' },
      { id: 'traffic-guide-flow',    label: 'Flow Data in Your App' },
      { id: 'traffic-guide-model',   label: 'Using Traffic Model ID' },
    ],
  },
  { type: 'section', label: 'Reference' },
  {
    label: 'Versions & Reference', key: 'trafficRef', type: 'group', landingId: 'traffic-platform',
    items: [
      { id: 'traffic-tomtom-maps', label: 'Traffic API v1' },
      { id: 'traffic-orbis-maps',  label: 'Traffic API v2' },
      { id: 'traffic-migration',   label: 'Migration Guide' },
      { id: 'traffic-params-ref',   label: 'Parameter Index' },
      { id: 'traffic-response-ref', label: 'Response Schema' },
      { id: 'traffic-error-codes', label: 'Error Codes' },
      { id: 'traffic-coverage',    label: 'Market Coverage' },
    ],
  },
];

/* ── Option A — version-sectioned ─────────────────────────────────────────── */
export const TRAFFIC_API_NAV = [
  { id: 'traffic-api-intro',   label: 'Introduction',    type: 'top' },
  { id: 'traffic-quickstart',  label: 'Getting Started', type: 'top' },
  { id: 'traffic-explorer',    label: 'API Explorer',    type: 'top', vDots: ['v1','v2'] },

  { type: 'section', label: 'TomTom Maps', badge: 'v1' },
  { id: 'traffic-flow-segment',     label: 'Flow Segment Data',      type: 'top', ref: true, anchors: [
      { id: 'traffic-fsd-request',  label: 'Request parameters',    method: 'GET' },
      { id: 'traffic-fsd-response', label: 'Response schema' },
    ]},
  { id: 'traffic-raster-flow',      label: 'Raster Flow Tiles',      type: 'top', ref: true, anchors: [
      { id: 'traffic-rf-request',  label: 'Request parameters', method: 'GET' },
      { id: 'traffic-rf-styles',   label: 'Flow styles' },
    ]},
  { id: 'traffic-vector-flow',      label: 'Vector Flow Tiles',      type: 'top', ref: true, anchors: [
      { id: 'traffic-vf-request',   label: 'Request parameters', method: 'GET' },
      { id: 'traffic-vf-structure', label: 'Tile structure' },
    ]},
  { id: 'traffic-incident-details', label: 'Incident Details',        type: 'top', ref: true, anchors: [
      { id: 'traffic-inc-request',  label: 'Request parameters', method: 'GET' },
      { id: 'traffic-inc-response', label: 'Response schema' },
      { id: 'traffic-inc-viewport', label: 'Incident Viewport',  method: 'GET' },
    ]},
  { id: 'traffic-raster-incident',  label: 'Raster Incident Tiles',   type: 'top', ref: true },
  { id: 'traffic-vector-incident',  label: 'Vector Incident Tiles',   type: 'top', ref: true },
  { id: 'traffic-flow-tiles',       label: 'Flow Tiles Overview',     type: 'top', ref: true },
  { id: 'traffic-model-id',         label: 'Traffic Model ID',        type: 'top', ref: true, anchors: [
      { id: 'traffic-mid-request',       label: 'Request parameters',     method: 'GET' },
      { id: 'traffic-mid-response',      label: 'Response' },
      { id: 'traffic-mid-cache-pattern', label: 'Cache validation pattern' },
    ]},

  { type: 'section', label: 'Orbis Maps', badge: 'v2' },
  { id: 'traffic-v2-flow-segment',    label: 'Flow Segment Data',    type: 'top', ref: true },
  { id: 'traffic-v2-raster-flow',     label: 'Raster Flow Tiles',    type: 'top', ref: true },
  { id: 'traffic-v2-vector-flow',     label: 'Vector Flow Tiles',    type: 'top', ref: true },
  { id: 'traffic-v2-incidents',       label: 'Incident Details',     type: 'top', ref: true },
  { id: 'traffic-v2-raster-incident', label: 'Raster Incident Tiles',type: 'top', ref: true },
  { id: 'traffic-v2-vector-incident', label: 'Vector Incident Tiles',type: 'top', ref: true },
  { id: 'traffic-v2-model-id',        label: 'Traffic Model ID',     type: 'top', ref: true },
  { id: 'traffic-v2-extended-flow',   label: 'Extended Flow Tiles',  type: 'top', ref: true },
  { id: 'traffic-v2-extended-inc',    label: 'Extended Incident Tiles', type: 'top', ref: true },

  ...TRAFFIC_SHARED_TAIL,
];

/* ── Option B — concept-first + vDots ────────────────────────────────────── */
export const TRAFFIC_API_NAV_B = [
  { id: 'traffic-api-intro',   label: 'Introduction',    type: 'top' },
  { id: 'traffic-quickstart',  label: 'Getting Started', type: 'top' },
  { id: 'traffic-explorer',    label: 'API Explorer',    type: 'top', vDots: ['v1','v2'] },
  { type: 'section', label: 'Endpoints' },
  ...TRAFFIC_CONCEPT_ENDPOINTS,
  ...TRAFFIC_SHARED_TAIL,
];

/* ── Option C — concept-first + version-filter ───────────────────────────── */
export const TRAFFIC_API_NAV_C = [
  { id: 'traffic-api-intro',   label: 'Introduction',    type: 'top' },
  { id: 'traffic-quickstart',  label: 'Getting Started', type: 'top' },
  { id: 'traffic-explorer',    label: 'API Explorer',    type: 'top', vDots: ['v1','v2'] },
  { type: 'version-filter' },
  { type: 'section', label: 'Endpoints' },
  ...TRAFFIC_CONCEPT_ENDPOINTS,
  ...TRAFFIC_SHARED_TAIL,
];

export const TRAFFIC_API_PAGE_TITLES = {
  'traffic-api-intro':        'Introduction',
  'traffic-quickstart':       'Getting Started',
  'traffic-explorer':         'API Explorer',

  /* ── endpoints ── */
  'traffic-flow-segment':      'Flow Segment Data',
  'traffic-raster-flow':       'Raster Flow Tiles',
  'traffic-vector-flow':       'Vector Flow Tiles',
  'traffic-flow-tiles':        'Flow Tiles Overview',
  'traffic-incident-details':  'Incident Details',
  'traffic-raster-incident':   'Raster Incident Tiles',
  'traffic-vector-incident':   'Vector Incident Tiles',
  'traffic-model-id':          'Traffic Model ID',

  /* ── v2 aliases ── */
  'traffic-v2-flow-segment':     'Flow Segment Data',
  'traffic-v2-raster-flow':      'Raster Flow Tiles',
  'traffic-v2-vector-flow':      'Vector Flow Tiles',
  'traffic-v2-incidents':        'Incident Details',
  'traffic-v2-raster-incident':  'Raster Incident Tiles',
  'traffic-v2-vector-incident':  'Vector Incident Tiles',
  'traffic-v2-model-id':         'Traffic Model ID',
  'traffic-v2-extended-flow':    'Extended Flow Tiles',
  'traffic-v2-extended-inc':     'Extended Incident Tiles',

  /* ── guides ── */
  'traffic-guides':           'How-to',
  'traffic-guide-tiles':      'Rendering Traffic Tiles',
  'traffic-guide-flow':       'Flow Data in Your App',
  'traffic-guide-model':      'Using Traffic Model ID',

  /* ── reference ── */
  'traffic-platform':    'Versions & Reference',
  'traffic-tomtom-maps': 'Traffic API v1',
  'traffic-orbis-maps':  'Traffic API v2',
  'traffic-migration':   'Migration Guide',
  'traffic-params-ref':   'Traffic API — Parameter Index',
  'traffic-response-ref': 'Traffic API — Response Schema',
  'traffic-error-codes': 'Error Codes',
  'traffic-coverage':    'Market Coverage',
};
