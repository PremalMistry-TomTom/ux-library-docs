/* ─────────────────────────────────────────────────────────────────────────────
 * Map Display API navigation
 * Option A  — version-sectioned
 * Option B  — concept-first + vDots  ← DEFAULT
 * Option C  — concept-first + version-filter
 *
 * v1 = TomTom Maps (tomtom-maps folder)
 * v2 = Orbis Maps  (tomtom-orbis-maps folder)
 * ───────────────────────────────────────────────────────────────────────────── */

/* ── Shared concept endpoints ───────────────────────────────────────────── */
const MAP_CONCEPT_ENDPOINTS = [
  { id: 'map-raster-tile',   label: 'Raster Map Tile',    type: 'top', ref: true, vDots: ['v1','v2'], anchors: [
      { id: 'map-rt-request',  label: 'Request parameters', method: 'GET' },
      { id: 'map-rt-response', label: 'Response' },
      { id: 'map-rt-leaflet',  label: 'Leaflet integration' },
    ]},
  { id: 'map-vector-tile',   label: 'Vector Tile',        type: 'top', ref: true, vDots: ['v1','v2'], anchors: [
      { id: 'map-vt-request',  label: 'Request parameters', method: 'GET' },
      { id: 'map-vt-response', label: 'Response & content' },
      { id: 'map-vt-maplibre', label: 'MapLibre GL JS' },
    ]},
  { id: 'map-satellite-tile',label: 'Satellite Tile',     type: 'top', ref: true, vDots: ['v1','v3'], anchors: [
      { id: 'map-sat-request',  label: 'Request parameters', method: 'GET' },
      { id: 'map-sat-response', label: 'Response' },
      { id: 'map-sat-hybrid',   label: 'Hybrid satellite + labels' },
    ]},
  { id: 'map-hillshade-tile',label: 'Hillshade Tile',     type: 'top', ref: true, vDots: ['v1','v3'], anchors: [
      { id: 'map-hs-request',  label: 'Request parameters', method: 'GET' },
      { id: 'map-hs-response', label: 'Response' },
    ]},
  { id: 'map-static-image',  label: 'Static Image',       type: 'top', ref: true, vDots: ['v1'], anchors: [
      { id: 'map-si-request',    label: 'Request parameters', method: 'GET' },
      { id: 'map-si-response',   label: 'Response' },
      { id: 'map-si-javascript', label: 'URL builder (JavaScript)' },
    ]},
  { id: 'map-copyrights',    label: 'Copyrights',         type: 'top', ref: true, vDots: ['v1','v2'], anchors: [
      { id: 'map-copy-request',  label: 'Request parameters', method: 'GET' },
      { id: 'map-copy-response', label: 'Response' },
    ]},
  { id: 'map-3d-landmarks',  label: '3D Landmarks',       type: 'top', ref: true, vDots: ['v3'], anchors: [
      { id: 'map-3d-request',  label: 'Request parameters', method: 'GET' },
      { id: 'map-3d-response', label: 'Response' },
    ]},
  { id: 'map-extended-tiles',label: 'Extended Tiles',     type: 'top', ref: true, vDots: ['v3'], anchors: [
      { id: 'map-ext-request',  label: 'Request parameters', method: 'GET' },
      { id: 'map-ext-response', label: 'Response' },
      { id: 'map-ext-toolkit',  label: 'Extended Tiles Toolkit' },
    ]},
  { id: 'map-wms',           label: 'WMS',                type: 'top', ref: true, vDots: ['v1'], anchors: [
      { id: 'map-wms-request',  label: 'Request parameters', method: 'GET' },
      { id: 'map-wms-response', label: 'Response' },
    ]},
  { id: 'map-wmts',          label: 'WMTS',               type: 'top', ref: true, vDots: ['v1'], anchors: [
      { id: 'map-wmts-request',  label: 'Request parameters', method: 'GET' },
      { id: 'map-wmts-response', label: 'Response' },
    ]},
  { id: 'map-assets-api',    label: 'Map Assets',         type: 'top', ref: true, vDots: ['v1'] },
];

/* ── Shared tail ─────────────────────────────────────────────────────────── */
const MAP_SHARED_TAIL = [
  { type: 'section', label: 'Guides' },
  {
    label: 'How-to', key: 'mapGuides', type: 'group', landingId: 'map-guides',
    items: [
      { id: 'map-guide-zoom',      label: 'Zoom Levels & Tile Grid' },
      { id: 'map-guide-styles',    label: 'Map Styles & Customisation' },
      { id: 'map-guide-hybrid',    label: 'Building a Hybrid Map' },
    ],
  },
  { type: 'section', label: 'Reference' },
  {
    label: 'Versions & Reference', key: 'mapRef', type: 'group', landingId: 'map-platform',
    items: [
      { id: 'map-tomtom-maps', label: 'Map Display API v1' },
      { id: 'map-orbis-maps',  label: 'Map Display API v2' },
      { id: 'map-migration',   label: 'Migration Guide' },
      { id: 'map-params-ref',   label: 'Parameter Index' },
      { id: 'map-response-ref', label: 'Response Schema' },
      { id: 'map-error-codes', label: 'Error Codes' },
      { id: 'map-coverage',    label: 'Market Coverage' },
    ],
  },
];

/* ── Option A — version-sectioned ─────────────────────────────────────────── */
export const MAP_DISPLAY_API_NAV = [
  { id: 'map-display-api-intro', label: 'Introduction', type: 'top' },

  { type: 'section', label: 'TomTom Maps', badge: 'v1' },
  { id: 'map-raster-tile',    label: 'Raster Map Tile', type: 'top', ref: true, anchors: [
      { id: 'map-rt-request',  label: 'Request parameters', method: 'GET' },
      { id: 'map-rt-response', label: 'Response' },
      { id: 'map-rt-leaflet',  label: 'Leaflet integration' },
    ]},
  { id: 'map-vector-tile',    label: 'Vector Tile',     type: 'top', ref: true, anchors: [
      { id: 'map-vt-request',  label: 'Request parameters', method: 'GET' },
      { id: 'map-vt-response', label: 'Response & content' },
      { id: 'map-vt-maplibre', label: 'MapLibre GL JS' },
    ]},
  { id: 'map-satellite-tile', label: 'Satellite Tile',  type: 'top', ref: true, anchors: [
      { id: 'map-sat-request',  label: 'Request parameters', method: 'GET' },
      { id: 'map-sat-hybrid',   label: 'Hybrid satellite + labels' },
    ]},
  { id: 'map-hillshade-tile', label: 'Hillshade Tile',  type: 'top', ref: true },
  { id: 'map-static-image',   label: 'Static Image',    type: 'top', ref: true, anchors: [
      { id: 'map-si-request',    label: 'Request parameters', method: 'GET' },
      { id: 'map-si-javascript', label: 'URL builder' },
    ]},
  { id: 'map-copyrights',     label: 'Copyrights',      type: 'top', ref: true },
  { id: 'map-wms',            label: 'WMS',             type: 'top', ref: true },
  { id: 'map-wmts',           label: 'WMTS',            type: 'top', ref: true },
  { id: 'map-assets-api',     label: 'Map Assets',      type: 'top', ref: true },

  { type: 'section', label: 'Orbis Maps', badge: 'v2' },
  { id: 'map-v2-raster-tile',    label: 'Raster Map Tile',  type: 'top', ref: true },
  { id: 'map-v2-vector-tile',    label: 'Vector Tile',      type: 'top', ref: true },
  { id: 'map-v2-satellite-tile', label: 'Satellite Tile',   type: 'top', ref: true },
  { id: 'map-v2-hillshade-tile', label: 'Hillshade Tile',   type: 'top', ref: true },
  { id: 'map-v2-copyrights',     label: 'Copyrights',       type: 'top', ref: true },
  { id: 'map-3d-landmarks',      label: '3D Landmarks',     type: 'top', ref: true },
  { id: 'map-extended-tiles',    label: 'Extended Tiles',   type: 'top', ref: true },

  ...MAP_SHARED_TAIL,
];

/* ── Option B — concept-first + vDots ────────────────────────────────────── */
export const MAP_DISPLAY_API_NAV_B = [
  { id: 'map-display-api-intro', label: 'Introduction', type: 'top' },
  { type: 'section', label: 'Endpoints' },
  ...MAP_CONCEPT_ENDPOINTS,
  ...MAP_SHARED_TAIL,
];

/* ── Option C — concept-first + version-filter ───────────────────────────── */
export const MAP_DISPLAY_API_NAV_C = [
  { id: 'map-display-api-intro', label: 'Introduction', type: 'top' },
  { type: 'version-filter' },
  { type: 'section', label: 'Endpoints' },
  ...MAP_CONCEPT_ENDPOINTS,
  ...MAP_SHARED_TAIL,
];

export const MAP_DISPLAY_API_PAGE_TITLES = {
  'map-display-api-intro': 'Introduction',

  /* ── endpoints ── */
  'map-raster-tile':    'Raster Map Tile',
  'map-vector-tile':    'Vector Tile',
  'map-satellite-tile': 'Satellite Tile',
  'map-hillshade-tile': 'Hillshade Tile',
  'map-static-image':   'Static Image',
  'map-copyrights':     'Copyrights',
  'map-3d-landmarks':   '3D Landmarks',
  'map-extended-tiles': 'Extended Tiles',
  'map-wms':            'WMS',
  'map-wmts':           'WMTS',
  'map-assets-api':     'Map Assets',

  /* ── v2 aliases ── */
  'map-v2-raster-tile':    'Raster Map Tile',
  'map-v2-vector-tile':    'Vector Tile',
  'map-v2-satellite-tile': 'Satellite Tile',
  'map-v2-hillshade-tile': 'Hillshade Tile',
  'map-v2-copyrights':     'Copyrights',

  /* ── guides ── */
  'map-guides':          'How-to',
  'map-guide-zoom':      'Zoom Levels & Tile Grid',
  'map-guide-styles':    'Map Styles & Customisation',
  'map-guide-hybrid':    'Building a Hybrid Map',

  /* ── reference ── */
  'map-platform':    'Versions & Reference',
  'map-tomtom-maps': 'Map Display API v1',
  'map-orbis-maps':  'Map Display API v2',
  'map-migration':   'Migration Guide',
  'map-params-ref':   'Map Display API — Parameter Index',
  'map-response-ref': 'Map Display API — Response Schema',
  'map-error-codes': 'Error Codes',
  'map-coverage':    'Market Coverage',
};
