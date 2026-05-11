export const SEARCH_API_NAV = [
  { id: 'search-api-intro', label: 'Introduction', type: 'top' },
  { type: 'section', label: 'Endpoints' },
  { id: 'search-fuzzy', label: 'Fuzzy Search', type: 'top', ref: true, anchors: [
      { id: 'request',  label: 'Request',  method: 'GET' },
      { id: 'response', label: 'Response' },
    ]},
  { id: 'search-poi', label: 'POI Search', type: 'top', ref: true, anchors: [
      { id: 'request',  label: 'Request',  method: 'GET' },
      { id: 'response', label: 'Response' },
    ]},
  { id: 'search-category', label: 'Category Search', type: 'top', ref: true },
  { id: 'search-nearby', label: 'Nearby Search', type: 'top', ref: true, anchors: [
      { id: 'request',  label: 'Request',  method: 'GET' },
      { id: 'response', label: 'Response' },
    ]},
  { id: 'search-along-route', label: 'Along-Route Search', type: 'top', ref: true, anchors: [
      { id: 'request',      label: 'Request',      method: 'POST' },
      { id: 'request-body', label: 'Request Body' },
      { id: 'response',     label: 'Response' },
    ]},
  { id: 'search-autocomplete', label: 'Autocomplete', type: 'top', ref: true, anchors: [
      { id: 'request',           label: 'Request',          method: 'GET' },
      { id: 'response',          label: 'Response' },
      { id: 'highlight-example', label: 'Text Highlighting' },
    ]},
  { id: 'search-batch', label: 'Batch Search', type: 'top', ref: true, anchors: [
      { id: 'sync-request',  label: 'Synchronous Batch',  method: 'POST' },
      { id: 'async-request', label: 'Asynchronous Batch', method: 'POST' },
      { id: 'request-body',  label: 'Request Body' },
      { id: 'response',      label: 'Response' },
      { id: 'async-status',  label: 'Async Poll Response' },
    ]},
  { id: 'poi-details', label: 'POI Details', type: 'top', ref: true, anchors: [
      { id: 'request',  label: 'Request',  method: 'GET' },
      { id: 'response', label: 'Response' },
    ]},
  { id: 'poi-photos', label: 'POI Photos', type: 'top', ref: true, anchors: [
      { id: 'request',  label: 'Request',  method: 'GET' },
      { id: 'response', label: 'Response' },
      { id: 'usage',    label: 'Browser Usage' },
    ]},
];

export const SEARCH_API_PAGE_TITLES = {
  'search-api-intro':   'Introduction',
  'search-fuzzy':       'Fuzzy Search',
  'search-poi':         'POI Search',
  'search-category':    'Category Search',
  'search-nearby':      'Nearby Search',
  'search-along-route': 'Along-Route Search',
  'search-autocomplete':'Autocomplete',
  'search-batch':       'Batch Search',
  'poi-details':        'POI Details',
  'poi-photos':         'POI Photos',
};
