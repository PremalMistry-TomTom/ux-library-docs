/* ─────────────────────────────────────────────────────────────────────────────
 * EV & Charging API navigation
 * Combines ev-charging-stations-availability-api + ev-search-api
 *
 * Option A  — version-sectioned
 * Option B  — concept-first + vDots  ← DEFAULT
 * Option C  — concept-first + version-filter
 *
 * v1 = TomTom Maps (root documentation folders)
 * v2 = Orbis Maps  (tomtom-orbis-maps folders)
 * ───────────────────────────────────────────────────────────────────────────── */

/* ── Shared concept endpoints ───────────────────────────────────────────── */
const EV_CONCEPT_ENDPOINTS = [
  { id: 'ev-station-search',       label: 'EV Station Search',        type: 'top', ref: true, vDots: ['v1','v3'], anchors: [
      { id: 'ev-ss-request',         label: 'Request parameters',    method: 'GET'  },
      { id: 'ev-ss-response',        label: 'Response schema' },
    ]},
  { id: 'ev-search-nearby',        label: 'EV Search Nearby',         type: 'top', ref: true, vDots: ['v1','v3'], anchors: [
      { id: 'ev-nearby-request',     label: 'Request parameters',    method: 'GET'  },
      { id: 'ev-nearby-response',    label: 'Response schema' },
    ]},
  { id: 'ev-search-along-route',   label: 'EV Search Along Route',    type: 'top', ref: true, vDots: ['v1','v3'], anchors: [
      { id: 'ev-sar-request',        label: 'Request parameters',    method: 'POST' },
      { id: 'ev-sar-body',           label: 'POST body',             method: 'POST' },
      { id: 'ev-sar-response',       label: 'Response schema' },
    ]},
  { id: 'ev-search-by-id',         label: 'EV Search by ID',          type: 'top', ref: true, vDots: ['v1','v3'], anchors: [
      { id: 'ev-byid-request',       label: 'Request parameters',    method: 'GET'  },
      { id: 'ev-byid-response',      label: 'Response schema' },
    ]},
  { id: 'ev-charging-availability',label: 'Charging Availability',    type: 'top', ref: true, vDots: ['v1','v3'], anchors: [
      { id: 'ev-avail-request',      label: 'Request parameters',    method: 'GET'  },
      { id: 'ev-avail-response',     label: 'Response schema' },
      { id: 'ev-avail-connectors',   label: 'Connector types' },
    ]},
];

/* ── Shared tail ─────────────────────────────────────────────────────────── */
const EV_SHARED_TAIL = [
  { type: 'section', label: 'Guides' },
  {
    label: 'How-to', key: 'evGuides', type: 'group', landingId: 'ev-charging-guides',
    items: [
      { id: 'ev-guide-discovery',  label: 'Station Discovery Patterns' },
      { id: 'ev-guide-connectors', label: 'Connector Type Filtering' },
      { id: 'ev-guide-jmespath',   label: 'JMESPath Response Filtering' },
    ],
  },
  { type: 'section', label: 'Reference' },
  {
    label: 'Versions & Reference', key: 'evRef', type: 'group', landingId: 'ev-charging-platform',
    items: [
      { id: 'ev-tomtom-maps',        label: 'EV & Charging API v1' },
      { id: 'ev-orbis-maps',         label: 'EV & Charging API v3 (Private Preview)' },
      { id: 'ev-connector-types',    label: 'Supported Connector Types' },
      { id: 'ev-params-ref',   label: 'Parameter Index' },
      { id: 'ev-response-ref', label: 'Response Schema' },
      { id: 'ev-error-codes',        label: 'Error Codes' },
      { id: 'ev-charging-coverage',  label: 'Market Coverage' },
    ],
  },
];

/* ── Option A — version-sectioned ─────────────────────────────────────────── */
export const EV_CHARGING_API_NAV = [
  { id: 'ev-charging-api-intro', label: 'Introduction', type: 'top' },

  { type: 'section', label: 'TomTom Maps', badge: 'v1' },
  { id: 'ev-station-search',        label: 'EV Station Search',        type: 'top', ref: true, anchors: [
      { id: 'ev-ss-request',  label: 'Request parameters', method: 'GET' },
      { id: 'ev-ss-response', label: 'Response schema' },
    ]},
  { id: 'ev-search-nearby',         label: 'EV Search Nearby',         type: 'top', ref: true, anchors: [
      { id: 'ev-nearby-request',  label: 'Request parameters', method: 'GET' },
      { id: 'ev-nearby-response', label: 'Response schema' },
    ]},
  { id: 'ev-search-along-route',    label: 'EV Search Along Route',    type: 'top', ref: true, anchors: [
      { id: 'ev-sar-request',  label: 'Request parameters', method: 'POST' },
      { id: 'ev-sar-response', label: 'Response schema' },
    ]},
  { id: 'ev-search-by-id',          label: 'EV Search by ID',          type: 'top', ref: true, anchors: [
      { id: 'ev-byid-request',  label: 'Request parameters', method: 'GET' },
      { id: 'ev-byid-response', label: 'Response schema' },
    ]},
  { id: 'ev-charging-availability', label: 'Charging Availability',    type: 'top', ref: true, anchors: [
      { id: 'ev-avail-request',    label: 'Request parameters', method: 'GET' },
      { id: 'ev-avail-response',   label: 'Response schema' },
      { id: 'ev-avail-connectors', label: 'Connector types' },
    ]},

  { type: 'section', label: 'Orbis Maps', badge: 'v3' },
  { id: 'ev-v2-station-search',      label: 'EV Station Search',     type: 'top', ref: true },
  { id: 'ev-v2-search-nearby',       label: 'EV Search Nearby',      type: 'top', ref: true },
  { id: 'ev-v2-search-along-route',  label: 'EV Search Along Route', type: 'top', ref: true },
  { id: 'ev-v2-search-by-id',        label: 'EV Search by ID',       type: 'top', ref: true },
  { id: 'ev-v2-charging-availability', label: 'Charging Availability', type: 'top', ref: true },

  ...EV_SHARED_TAIL,
];

/* ── Option B — concept-first + vDots ────────────────────────────────────── */
export const EV_CHARGING_API_NAV_B = [
  { id: 'ev-charging-api-intro', label: 'Introduction', type: 'top' },
  { type: 'section', label: 'Endpoints' },
  ...EV_CONCEPT_ENDPOINTS,
  ...EV_SHARED_TAIL,
];

/* ── Option C — concept-first + version-filter ───────────────────────────── */
export const EV_CHARGING_API_NAV_C = [
  { id: 'ev-charging-api-intro', label: 'Introduction', type: 'top' },
  { type: 'version-filter' },
  { type: 'section', label: 'Endpoints' },
  ...EV_CONCEPT_ENDPOINTS,
  ...EV_SHARED_TAIL,
];

export const EV_CHARGING_API_PAGE_TITLES = {
  'ev-charging-api-intro': 'Introduction',

  /* ── endpoints ── */
  'ev-station-search':        'EV Station Search',
  'ev-search-nearby':         'EV Search Nearby',
  'ev-search-along-route':    'EV Search Along Route',
  'ev-search-by-id':          'EV Search by ID',
  'ev-charging-availability': 'Charging Availability',

  /* ── v2 aliases ── */
  'ev-v2-station-search':       'EV Station Search',
  'ev-v2-search-nearby':        'EV Search Nearby',
  'ev-v2-search-along-route':   'EV Search Along Route',
  'ev-v2-search-by-id':         'EV Search by ID',
  'ev-v2-charging-availability':'Charging Availability',

  /* ── guides ── */
  'ev-charging-guides':     'How-to',
  'ev-guide-discovery':     'Station Discovery Patterns',
  'ev-guide-connectors':    'Connector Type Filtering',
  'ev-guide-jmespath':      'JMESPath Response Filtering',

  /* ── reference ── */
  'ev-charging-platform':   'Versions & Reference',
  'ev-tomtom-maps':         'EV & Charging API v1',
  'ev-orbis-maps':          'EV & Charging API v3 (Private Preview)',
  'ev-connector-types':     'Supported Connector Types',
  'ev-params-ref':   'EV & Charging API — Parameter Index',
  'ev-response-ref': 'EV & Charging API — Response Schema',
  'ev-error-codes':         'Error Codes',
  'ev-charging-coverage':   'Market Coverage',

  /* ── legacy ── */
  'ev-supported-markets':   'Market Coverage',
};
