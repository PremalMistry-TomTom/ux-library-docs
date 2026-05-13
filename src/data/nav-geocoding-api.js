/* ─────────────────────────────────────────────────────────────────────────────
 * Geocoding API navigation  (forward geocode + reverse geocode unified)
 * Option A  — version-sectioned
 * Option B  — concept-first + vDots  ← DEFAULT
 * Option C  — concept-first + version-filter
 *
 * v1 = TomTom Maps (geocoding-api root + reverse-geocoding-api root)
 * v2 = Orbis Maps v1 (tomtom-orbis-maps/v1) — still referred to as "v2" in portal
 * v3 = Orbis Maps v2 (tomtom-orbis-maps/v2) — "v3" in portal
 *
 * Note: Orbis v1 and v2 split the geocode service differently.
 * Portal simplification: v1 = legacy, v2 = Orbis v1, v3 = Orbis v2
 * ───────────────────────────────────────────────────────────────────────────── */

/* ── Shared concept endpoints ───────────────────────────────────────────── */
const GEOCODING_CONCEPT_ENDPOINTS = [
  { id: 'geocode',            label: 'Geocode',              type: 'top', ref: true, vDots: ['v1','v2','v3'], anchors: [
      { id: 'geocode-request',  label: 'Request parameters', method: 'GET' },
      { id: 'geocode-response', label: 'Response schema' },
    ]},
  { id: 'structured-geocode', label: 'Structured Geocode',   type: 'top', ref: true, vDots: ['v1','v2','v3'], anchors: [
      { id: 'sg-request',       label: 'Request parameters', method: 'GET' },
      { id: 'sg-response',      label: 'Response schema' },
    ]},
  { id: 'reverse-geocode',    label: 'Reverse Geocode',      type: 'top', ref: true, vDots: ['v1','v2','v3'], anchors: [
      { id: 'rg-request',       label: 'Request parameters', method: 'GET' },
      { id: 'rg-response',      label: 'Response schema' },
    ]},
  { id: 'cross-street-lookup',label: 'Cross-Street Lookup',  type: 'top', ref: true, vDots: ['v1'], anchors: [
      { id: 'cs-request',       label: 'Request parameters', method: 'GET' },
      { id: 'cs-response',      label: 'Response schema' },
    ]},
];

/* ── Shared tail ─────────────────────────────────────────────────────────── */
const GEOCODING_SHARED_TAIL = [
  { type: 'section', label: 'Guides' },
  {
    label: 'How-to', key: 'geocodingGuides', type: 'group', landingId: 'geocoding-guides',
    items: [
      { id: 'geocoding-guide-accuracy',   label: 'Improving Accuracy' },
      { id: 'geocoding-guide-batch',      label: 'Batch Geocoding' },
      { id: 'geocoding-guide-structured', label: 'Structured vs Free-form' },
    ],
  },
  { type: 'section', label: 'Reference' },
  {
    label: 'Versions & Reference', key: 'geocodingRef', type: 'group', landingId: 'geocoding-platform',
    items: [
      { id: 'geocoding-tomtom-maps', label: 'Geocoding API v1' },
      { id: 'geocoding-orbis-v1',    label: 'Geocoding API v2' },
      { id: 'geocoding-orbis-v2',    label: 'Geocoding API v3' },
      { id: 'geocoding-migration',   label: 'Migration Guide' },
      { id: 'geocoding-params-ref',   label: 'Parameter Index' },
      { id: 'geocoding-response-ref', label: 'Response Schema' },
      { id: 'geocoding-error-codes', label: 'Error Codes' },
      { id: 'geocoding-coverage',    label: 'Market Coverage' },
    ],
  },
];

/* ── Option A — version-sectioned ─────────────────────────────────────────── */
export const GEOCODING_API_NAV = [
  { id: 'geocoding-api-intro', label: 'Introduction', type: 'top' },

  { type: 'section', label: 'TomTom Maps', badge: 'v1' },
  { id: 'geocode',             label: 'Geocode',            type: 'top', ref: true, anchors: [
      { id: 'geocode-request',  label: 'Request parameters', method: 'GET' },
      { id: 'geocode-response', label: 'Response schema' },
    ]},
  { id: 'structured-geocode',  label: 'Structured Geocode', type: 'top', ref: true, anchors: [
      { id: 'sg-request',  label: 'Request parameters', method: 'GET' },
      { id: 'sg-response', label: 'Response schema' },
    ]},
  { id: 'reverse-geocode',     label: 'Reverse Geocode',    type: 'top', ref: true, anchors: [
      { id: 'rg-request',  label: 'Request parameters', method: 'GET' },
      { id: 'rg-response', label: 'Response schema' },
    ]},
  { id: 'cross-street-lookup', label: 'Cross-Street Lookup',type: 'top', ref: true, anchors: [
      { id: 'cs-request',  label: 'Request parameters', method: 'GET' },
      { id: 'cs-response', label: 'Response schema' },
    ]},

  { type: 'section', label: 'Orbis Maps v1', badge: 'v2' },
  { id: 'geocode-v2',           label: 'Geocode',            type: 'top', ref: true },
  { id: 'structured-geocode-v2',label: 'Structured Geocode', type: 'top', ref: true },
  { id: 'reverse-geocode-v2',   label: 'Reverse Geocode',    type: 'top', ref: true },

  { type: 'section', label: 'Orbis Maps v2', badge: 'v3' },
  { id: 'geocode-v3',           label: 'Geocode',            type: 'top', ref: true },
  { id: 'structured-geocode-v3',label: 'Structured Geocode', type: 'top', ref: true },
  { id: 'reverse-geocode-v3',   label: 'Reverse Geocode',    type: 'top', ref: true },

  ...GEOCODING_SHARED_TAIL,
];

/* ── Option B — concept-first + vDots ────────────────────────────────────── */
export const GEOCODING_API_NAV_B = [
  { id: 'geocoding-api-intro', label: 'Introduction', type: 'top' },
  { type: 'section', label: 'Endpoints' },
  ...GEOCODING_CONCEPT_ENDPOINTS,
  ...GEOCODING_SHARED_TAIL,
];

/* ── Option C — concept-first + version-filter ───────────────────────────── */
export const GEOCODING_API_NAV_C = [
  { id: 'geocoding-api-intro', label: 'Introduction', type: 'top' },
  { type: 'version-filter' },
  { type: 'section', label: 'Endpoints' },
  ...GEOCODING_CONCEPT_ENDPOINTS,
  ...GEOCODING_SHARED_TAIL,
];

export const GEOCODING_API_PAGE_TITLES = {
  'geocoding-api-intro':  'Introduction',

  /* ── endpoints ── */
  'geocode':             'Geocode',
  'structured-geocode':  'Structured Geocode',
  'reverse-geocode':     'Reverse Geocode',
  'cross-street-lookup': 'Cross-Street Lookup',

  /* ── v2 aliases ── */
  'geocode-v2':            'Geocode',
  'structured-geocode-v2': 'Structured Geocode',
  'reverse-geocode-v2':    'Reverse Geocode',

  /* ── v3 aliases ── */
  'geocode-v3':            'Geocode',
  'structured-geocode-v3': 'Structured Geocode',
  'reverse-geocode-v3':    'Reverse Geocode',

  /* ── guides ── */
  'geocoding-guides':            'How-to',
  'geocoding-guide-accuracy':    'Improving Accuracy',
  'geocoding-guide-batch':       'Batch Geocoding',
  'geocoding-guide-structured':  'Structured vs Free-form',

  /* ── reference ── */
  'geocoding-platform':    'Versions & Reference',
  'geocoding-tomtom-maps': 'Geocoding API v1',
  'geocoding-orbis-v1':    'Geocoding API v2',
  'geocoding-orbis-v2':    'Geocoding API v3',
  'geocoding-migration':   'Migration Guide',
  'geocoding-params-ref':   'Geocoding API — Parameter Index',
  'geocoding-response-ref': 'Geocoding API — Response Schema',
  'geocoding-error-codes': 'Error Codes',
  'geocoding-coverage':    'Market Coverage',
};
