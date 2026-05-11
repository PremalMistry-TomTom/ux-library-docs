export const PARKING_FUEL_API_NAV = [
  { id: 'parking-fuel-api-intro', label: 'Introduction', type: 'top' },
  { type: 'section', label: 'Endpoints' },
  { id: 'parking-availability', label: 'Parking Availability', type: 'top', ref: true, anchors: [
      { id: 'realtime',               label: 'Real-time Availability', method: 'GET' },
      { id: 'realtime-response',      label: 'Response' },
      { id: 'nearby-search',          label: 'Nearby Parking Search',  method: 'GET' },
      { id: 'nearby-search-response', label: 'Response' },
    ]},
  { id: 'parking-prices', label: 'Parking Prices', type: 'top', ref: true, anchors: [
      { id: 'request',  label: 'Parking Prices', method: 'GET' },
      { id: 'response', label: 'Response' },
    ]},
  { id: 'on-street-parking', label: 'On-Street Parking', type: 'top', ref: true, anchors: [
      { id: 'request',  label: 'On-Street Segments Near Coordinate', method: 'GET' },
      { id: 'response', label: 'Response' },
    ]},
  { id: 'fuel-prices', label: 'Fuel Prices', type: 'top', ref: true, anchors: [
      { id: 'request',  label: 'Nearby Fuel Price Search', method: 'GET' },
      { id: 'response', label: 'Response' },
    ]},
];

export const PARKING_FUEL_API_PAGE_TITLES = {
  'parking-fuel-api-intro': 'Introduction',
  'parking-availability':   'Parking Availability',
  'parking-prices':         'Parking Prices',
  'on-street-parking':      'On-Street Parking',
  'fuel-prices':            'Fuel Prices',
};
