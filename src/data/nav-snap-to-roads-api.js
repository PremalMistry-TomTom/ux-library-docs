export const SNAP_TO_ROADS_API_NAV = [
  { id: 'snap-to-roads-api-intro', label: 'Introduction', type: 'top' },
  { type: 'section', label: 'Endpoints' },
  { id: 'snap-to-roads', label: 'Snap GPS Trace', type: 'top', ref: true, anchors: [
      { id: 'request',    label: 'Snap GPS Trace',        method: 'GET' },
      { id: 'response',   label: 'Response' },
      { id: 'js-example', label: 'JavaScript Example' },
    ]},
];

export const SNAP_TO_ROADS_API_PAGE_TITLES = {
  'snap-to-roads-api-intro': 'Introduction',
  'snap-to-roads':           'Snap GPS Trace',
};
