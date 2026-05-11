export const TRAFFIC_API_NAV = [
  { id: 'traffic-api-intro', label: 'Introduction', type: 'top' },
  { type: 'section', label: 'Endpoints' },
  { id: 'traffic-flow-segment', label: 'Traffic Flow', type: 'top', ref: true, anchors: [
      { id: 'request',  label: 'Request',  method: 'GET' },
      { id: 'response', label: 'Response' },
    ]},
  { id: 'traffic-incident-details', label: 'Traffic Incidents', type: 'top', ref: true, anchors: [
      { id: 'incident-details',          label: 'Incident Details',  method: 'GET' },
      { id: 'incident-details-response', label: 'Response' },
      { id: 'incident-viewport',         label: 'Incident Viewport', method: 'GET' },
    ]},
  { id: 'traffic-flow-tiles', label: 'Flow Tiles', type: 'top', ref: true },
  { id: 'traffic-model-id', label: 'Traffic Model ID', type: 'top', ref: true, anchors: [
      { id: 'request',       label: 'Request',                  method: 'GET' },
      { id: 'response',      label: 'Response' },
      { id: 'cache-pattern', label: 'Cache Validation Pattern' },
    ]},
];

export const TRAFFIC_API_PAGE_TITLES = {
  'traffic-api-intro':        'Introduction',
  'traffic-flow-segment':     'Traffic Flow',
  'traffic-incident-details': 'Traffic Incidents',
  'traffic-flow-tiles':       'Flow Tiles',
  'traffic-model-id':         'Traffic Model ID',
};
