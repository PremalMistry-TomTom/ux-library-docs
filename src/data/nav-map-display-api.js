export const MAP_DISPLAY_API_NAV = [
  { id: 'map-display-api-intro', label: 'Introduction', type: 'top' },
  { type: 'section', label: 'Endpoints' },
  { id: 'map-raster-tile', label: 'Raster Tile', type: 'top', ref: true, anchors: [
      { id: 'request', label: 'Request', method: 'GET' },
      { id: 'response', label: 'Response' },
      { id: 'leaflet',  label: 'Leaflet integration' },
    ]},
  { id: 'map-vector-tile', label: 'Vector Tile', type: 'top', ref: true, anchors: [
      { id: 'request',  label: 'Request',  method: 'GET' },
      { id: 'response', label: 'Response' },
      { id: 'maplibre', label: 'MapLibre GL JS integration' },
    ]},
  { id: 'map-satellite-tile', label: 'Satellite Tile', type: 'top', ref: true, anchors: [
      { id: 'request',  label: 'Request',  method: 'GET' },
      { id: 'response', label: 'Response' },
      { id: 'hybrid',   label: 'Hybrid satellite + labels' },
    ]},
  { id: 'map-assets-api', label: 'Map Assets', type: 'top', ref: true },
  { id: 'map-static-image', label: 'Static Image', type: 'top', ref: true, anchors: [
      { id: 'request',    label: 'Request',                method: 'GET' },
      { id: 'response',   label: 'Response' },
      { id: 'javascript', label: 'URL builder (JavaScript)' },
    ]},
];

export const MAP_DISPLAY_API_PAGE_TITLES = {
  'map-display-api-intro': 'Introduction',
  'map-raster-tile':       'Raster Tile',
  'map-vector-tile':       'Vector Tile',
  'map-satellite-tile':    'Satellite Tile',
  'map-assets-api':        'Map Assets',
  'map-static-image':      'Static Image',
};
