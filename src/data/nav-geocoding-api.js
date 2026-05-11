export const GEOCODING_API_NAV = [
  { id: 'geocoding-api-intro', label: 'Introduction', type: 'top' },
  { type: 'section', label: 'Endpoints' },
  { id: 'geocode', label: 'Geocode', type: 'top', ref: true, anchors: [
      { id: 'geocode',            label: 'Geocode',            method: 'GET' },
      { id: 'structured-geocode', label: 'Structured Geocode', method: 'GET' },
    ]},
  { id: 'reverse-geocode', label: 'Reverse Geocode', type: 'top', ref: true, anchors: [
      { id: 'reverse-geocode',    label: 'Reverse Geocode',    method: 'GET' },
      { id: 'cross-street-lookup',label: 'Cross Street Lookup',method: 'GET' },
    ]},
];

export const GEOCODING_API_PAGE_TITLES = {
  'geocoding-api-intro': 'Introduction',
  'geocode':             'Geocode',
  'reverse-geocode':     'Reverse Geocode',
};
