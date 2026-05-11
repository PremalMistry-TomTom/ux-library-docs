export const TRAFFIC_ANALYTICS_API_NAV = [
  { id: 'traffic-analytics-api-intro', label: 'Introduction', type: 'top' },
  { type: 'section', label: 'Endpoints' },
  { id: 'traffic-route-stats', label: 'Traffic Stats', type: 'top', ref: true, anchors: [
      { id: 'route-statistics',          label: 'Route Statistics',        method: 'POST' },
      { id: 'route-statistics-response', label: 'Response' },
      { id: 'road-segment-stats',        label: 'Road Segment Statistics', method: 'POST' },
      { id: 'road-segment-response',     label: 'Road Segment Response' },
    ]},
  { id: 'traffic-area-analytics', label: 'Area Analytics', type: 'top', ref: true, anchors: [
      { id: 'request',  label: 'Request',  method: 'POST' },
      { id: 'response', label: 'Response' },
    ]},
  { id: 'traffic-od-analysis', label: 'O/D Analysis', type: 'top', ref: true, anchors: [
      { id: 'request',  label: 'Request',  method: 'POST' },
      { id: 'response', label: 'Response' },
    ]},
  { id: 'traffic-junction-analytics', label: 'Junction Analytics', type: 'top', ref: true, anchors: [
      { id: 'request',  label: 'Request',  method: 'POST' },
      { id: 'response', label: 'Response' },
    ]},
];

export const TRAFFIC_ANALYTICS_API_PAGE_TITLES = {
  'traffic-analytics-api-intro': 'Introduction',
  'traffic-route-stats':          'Traffic Stats',
  'traffic-area-analytics':       'Area Analytics',
  'traffic-od-analysis':          'O/D Analysis',
  'traffic-junction-analytics':   'Junction Analytics',
};
