export const WAYPOINT_NAV = [
  { id: 'waypoint-intro', label: 'Introduction', type: 'top' },
  {
    label: 'API Reference', key: 'waypointApiRef', type: 'group',
    items: [
      { id: 'waypoint-optimize',  label: 'Optimize Waypoints' },
      { id: 'waypoint-errors',    label: 'Error Codes' },
    ],
  },
];

export const WAYPOINT_PAGE_TITLES = {
  'waypoint-intro':    'Introduction',
  'waypoint-optimize': 'Optimize Waypoints',
  'waypoint-errors':   'Error Codes',
};
