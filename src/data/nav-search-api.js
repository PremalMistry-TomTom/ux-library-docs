/* ─────────────────────────────────────────────────────────────────────────────
 * Search API navigation
 * Option A  — version-sectioned (legacy)
 * Option B  — concept-first + vDots  ← DEFAULT (products.js uses SEARCH_API_NAV_B)
 * Option C  — concept-first + version-filter control
 *
 * v1 = TomTom Maps platform (search-service folder)
 * v2 = Orbis Maps platform  (tomtom-orbis-maps folder)
 * ───────────────────────────────────────────────────────────────────────────── */

/* ── Shared concept endpoints (Option B & C) ────────────────────────────── */
const SEARCH_CONCEPT_ENDPOINTS = [
  { id: 'search-fuzzy',           label: 'Fuzzy Search',       type: 'top', ref: true, vDots: ['v1','v2'], anchors: [
      { id: 'search-fuzzy-request',  label: 'Request parameters', method: 'GET' },
      { id: 'search-fuzzy-response', label: 'Response' },
    ]},
  { id: 'search-poi',             label: 'POI Search',         type: 'top', ref: true, vDots: ['v1','v2'], anchors: [
      { id: 'search-poi-request',  label: 'Request parameters', method: 'GET' },
      { id: 'search-poi-response', label: 'Response' },
    ]},
  { id: 'search-category',        label: 'Category Search',    type: 'top', ref: true, vDots: ['v1','v2'], anchors: [
      { id: 'search-cat-request',  label: 'Request parameters', method: 'GET' },
      { id: 'search-cat-response', label: 'Response' },
    ]},
  { id: 'search-nearby',          label: 'Nearby Search',      type: 'top', ref: true, vDots: ['v1','v2'], anchors: [
      { id: 'search-nearby-request',  label: 'Request parameters', method: 'GET' },
      { id: 'search-nearby-response', label: 'Response' },
    ]},
  { id: 'search-geometry',        label: 'Geometry Search',    type: 'top', ref: true, vDots: ['v1','v2'], anchors: [
      { id: 'search-geo-request',  label: 'Request parameters', method: 'GET' },
      { id: 'search-geo-response', label: 'Response' },
    ]},
  { id: 'search-along-route',     label: 'Along-Route Search', type: 'top', ref: true, vDots: ['v1','v2'], anchors: [
      { id: 'search-sar-request',  label: 'Request parameters', method: 'POST' },
      { id: 'search-sar-body',     label: 'POST body',          method: 'POST' },
      { id: 'search-sar-response', label: 'Response' },
    ]},
  { id: 'search-autocomplete',    label: 'Autocomplete',       type: 'top', ref: true, vDots: ['v1','v2'], anchors: [
      { id: 'search-ac-request',    label: 'Request parameters', method: 'GET' },
      { id: 'search-ac-response',   label: 'Response' },
      { id: 'search-ac-highlights', label: 'Text highlighting' },
    ]},
  { id: 'search-batch',           label: 'Batch Search',       type: 'top', ref: true, vDots: ['v1'], anchors: [
      { id: 'search-batch-sync',     label: 'Synchronous batch',  method: 'POST' },
      { id: 'search-batch-async',    label: 'Asynchronous batch', method: 'POST' },
      { id: 'search-batch-response', label: 'Response' },
    ]},
  { id: 'search-place-by-id',     label: 'Place by ID',        type: 'top', ref: true, vDots: ['v1','v2'], anchors: [
      { id: 'search-pid-request',  label: 'Request parameters', method: 'GET' },
      { id: 'search-pid-response', label: 'Response' },
    ]},
  { id: 'search-additional-data', label: 'Additional Data',    type: 'top', ref: true, vDots: ['v1','v2'], anchors: [
      { id: 'search-add-request',  label: 'Request parameters', method: 'POST' },
      { id: 'search-add-response', label: 'Response' },
    ]},
  { id: 'search-poi-categories',  label: 'POI Categories',     type: 'top', ref: true, vDots: ['v1','v2'], anchors: [
      { id: 'search-poicat-request',  label: 'Request parameters', method: 'GET' },
      { id: 'search-poicat-response', label: 'Response' },
    ]},
];

/* ── Shared tail (Guides + Reference) ────────────────────────────────────── */
const SEARCH_SHARED_TAIL = [
  { type: 'section', label: 'Guides' },
  {
    label: 'Best Practices', key: 'searchGuides', type: 'group', landingId: 'search-guides',
    items: [
      { id: 'search-guide-typeahead',  label: 'Typeahead & Autocomplete' },
      { id: 'search-guide-ev',         label: 'EV Station Discovery' },
      { id: 'search-guide-fuzzy-tips', label: 'Fuzzy Search Tips' },
    ],
  },
  { type: 'section', label: 'Reference' },
  {
    label: 'Versions & Reference', key: 'searchRef', type: 'group', landingId: 'search-platform',
    items: [
      { id: 'search-tomtom-maps', label: 'Search API v1' },
      { id: 'search-orbis-maps',  label: 'Search API v2' },
      { id: 'search-migration',   label: 'Migration Guide' },
      { id: 'search-params-ref',   label: 'Parameter Index' },
      { id: 'search-response-ref', label: 'Response Schema' },
      { id: 'search-error-codes', label: 'Error Codes' },
      { id: 'search-coverage',    label: 'Market Coverage' },
    ],
  },
];

/* ── Option A — version-sectioned ─────────────────────────────────────────── */
export const SEARCH_API_NAV = [
  { id: 'search-api-intro',  label: 'Introduction', type: 'top' },
  { id: 'search-quickstart', label: 'Quick Start',  type: 'top' },

  { type: 'section', label: 'TomTom Maps', badge: 'v1' },
  { id: 'search-fuzzy',           label: 'Fuzzy Search',       type: 'top', ref: true, anchors: [
      { id: 'search-fuzzy-request',  label: 'Request parameters', method: 'GET' },
      { id: 'search-fuzzy-response', label: 'Response' },
    ]},
  { id: 'search-poi',             label: 'POI Search',         type: 'top', ref: true, anchors: [
      { id: 'search-poi-request',  label: 'Request parameters', method: 'GET' },
      { id: 'search-poi-response', label: 'Response' },
    ]},
  { id: 'search-category',        label: 'Category Search',    type: 'top', ref: true, anchors: [
      { id: 'search-cat-request',  label: 'Request parameters', method: 'GET' },
      { id: 'search-cat-response', label: 'Response' },
    ]},
  { id: 'search-nearby',          label: 'Nearby Search',      type: 'top', ref: true, anchors: [
      { id: 'search-nearby-request',  label: 'Request parameters', method: 'GET' },
      { id: 'search-nearby-response', label: 'Response' },
    ]},
  { id: 'search-geometry',        label: 'Geometry Search',    type: 'top', ref: true, anchors: [
      { id: 'search-geo-request',  label: 'Request parameters', method: 'GET' },
      { id: 'search-geo-response', label: 'Response' },
    ]},
  { id: 'search-along-route',     label: 'Along-Route Search', type: 'top', ref: true, anchors: [
      { id: 'search-sar-request',  label: 'Request parameters', method: 'POST' },
      { id: 'search-sar-body',     label: 'POST body',          method: 'POST' },
      { id: 'search-sar-response', label: 'Response' },
    ]},
  { id: 'search-autocomplete',    label: 'Autocomplete',       type: 'top', ref: true, anchors: [
      { id: 'search-ac-request',    label: 'Request parameters', method: 'GET' },
      { id: 'search-ac-response',   label: 'Response' },
      { id: 'search-ac-highlights', label: 'Text highlighting' },
    ]},
  { id: 'search-batch',           label: 'Batch Search',       type: 'top', ref: true, anchors: [
      { id: 'search-batch-sync',     label: 'Synchronous batch',  method: 'POST' },
      { id: 'search-batch-async',    label: 'Asynchronous batch', method: 'POST' },
      { id: 'search-batch-response', label: 'Response' },
    ]},
  { id: 'search-place-by-id',     label: 'Place by ID',        type: 'top', ref: true, anchors: [
      { id: 'search-pid-request',  label: 'Request parameters', method: 'GET' },
      { id: 'search-pid-response', label: 'Response' },
    ]},
  { id: 'search-additional-data', label: 'Additional Data',    type: 'top', ref: true },
  { id: 'search-poi-categories',  label: 'POI Categories',     type: 'top', ref: true },

  { type: 'section', label: 'Orbis Maps', badge: 'v2' },
  { id: 'search-v2-fuzzy',           label: 'Fuzzy Search',       type: 'top', ref: true },
  { id: 'search-v2-poi',             label: 'POI Search',         type: 'top', ref: true },
  { id: 'search-v2-category',        label: 'Category Search',    type: 'top', ref: true },
  { id: 'search-v2-nearby',          label: 'Nearby Search',      type: 'top', ref: true },
  { id: 'search-v2-geometry',        label: 'Geometry Search',    type: 'top', ref: true },
  { id: 'search-v2-along-route',     label: 'Along-Route Search', type: 'top', ref: true },
  { id: 'search-v2-autocomplete',    label: 'Autocomplete',       type: 'top', ref: true },
  { id: 'search-v2-place-by-id',     label: 'Place by ID',        type: 'top', ref: true },
  { id: 'search-v2-additional-data', label: 'Additional Data',    type: 'top', ref: true },
  { id: 'search-v2-poi-categories',  label: 'POI Categories',     type: 'top', ref: true },

  ...SEARCH_SHARED_TAIL,
];

/* ── Option B — concept-first + vDots ────────────────────────────────────── */
export const SEARCH_API_NAV_B = [
  { id: 'search-api-intro',  label: 'Introduction', type: 'top' },
  { id: 'search-quickstart', label: 'Quick Start',  type: 'top' },
  { type: 'section', label: 'Endpoints' },
  ...SEARCH_CONCEPT_ENDPOINTS,
  ...SEARCH_SHARED_TAIL,
];

/* ── Option C — concept-first + version-filter ───────────────────────────── */
export const SEARCH_API_NAV_C = [
  { id: 'search-api-intro',  label: 'Introduction', type: 'top' },
  { id: 'search-quickstart', label: 'Quick Start',  type: 'top' },
  { type: 'version-filter' },
  { type: 'section', label: 'Endpoints' },
  ...SEARCH_CONCEPT_ENDPOINTS,
  ...SEARCH_SHARED_TAIL,
];

export const SEARCH_API_PAGE_TITLES = {
  'search-api-intro':  'Introduction',
  'search-quickstart': 'Quick Start',

  /* ── endpoints ── */
  'search-fuzzy':           'Fuzzy Search',
  'search-poi':             'POI Search',
  'search-category':        'Category Search',
  'search-nearby':          'Nearby Search',
  'search-geometry':        'Geometry Search',
  'search-along-route':     'Along-Route Search',
  'search-autocomplete':    'Autocomplete',
  'search-batch':           'Batch Search',
  'search-place-by-id':     'Place by ID',
  'search-additional-data': 'Additional Data',
  'search-poi-categories':  'POI Categories',

  /* ── v2 aliases ── */
  'search-v2-fuzzy':           'Fuzzy Search',
  'search-v2-poi':             'POI Search',
  'search-v2-category':        'Category Search',
  'search-v2-nearby':          'Nearby Search',
  'search-v2-geometry':        'Geometry Search',
  'search-v2-along-route':     'Along-Route Search',
  'search-v2-autocomplete':    'Autocomplete',
  'search-v2-place-by-id':     'Place by ID',
  'search-v2-additional-data': 'Additional Data',
  'search-v2-poi-categories':  'POI Categories',

  /* ── guides ── */
  'search-guides':           'Best Practices',
  'search-guide-typeahead':  'Typeahead & Autocomplete',
  'search-guide-ev':         'EV Station Discovery',
  'search-guide-fuzzy-tips': 'Fuzzy Search Tips',

  /* ── reference ── */
  'search-platform':    'Versions & Reference',
  'search-tomtom-maps': 'Search API v1',
  'search-orbis-maps':  'Search API v2',
  'search-migration':   'Migration Guide',
  'search-params-ref':   'Search API — Parameter Index',
  'search-response-ref': 'Search API — Response Schema',
  'search-error-codes': 'Error Codes',
  'search-coverage':    'Market Coverage',

  /* ── legacy ids kept for compat ── */
  'poi-details':         'POI Details',
  'poi-photos':          'POI Photos',
  'search-engine':       'Search Engine',
};
