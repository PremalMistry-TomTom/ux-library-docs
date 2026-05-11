export const EV_CHARGING_API_NAV = [
  { id: 'ev-charging-api-intro', label: 'Introduction', type: 'top' },
  { type: 'section', label: 'Endpoints' },
  { id: 'ev-station-search', label: 'EV Station Search', type: 'top', ref: true, anchors: [
      { id: 'ev-station-search',    label: 'EV Station Search',    method: 'GET'  },
      { id: 'along-route-charging', label: 'Along-Route Charging', method: 'POST' },
    ]},
  { id: 'ev-charging-availability', label: 'Charging Availability', type: 'top', ref: true, anchors: [
      { id: 'charging-availability', label: 'Charging Availability', method: 'GET' },
      { id: 'poi-categories',        label: 'POI Categories',        method: 'GET' },
    ]},
  { id: 'ev-supported-markets', label: 'Market Coverage', type: 'top', ref: true, anchors: [
      { id: 'supported-markets', label: 'Supported Markets', method: 'GET' },
    ]},
];

export const EV_CHARGING_API_PAGE_TITLES = {
  'ev-charging-api-intro':      'Introduction',
  'ev-station-search':          'EV Station Search',
  'ev-charging-availability':   'Charging Availability',
  'ev-supported-markets':       'Market Coverage',
};
