export const MATRIX_NAV = [
  { id: 'matrix-intro', label: 'Introduction', type: 'top' },
  {
    label: 'API Reference', key: 'matrixApiRef', type: 'group',
    items: [
      { id: 'matrix-synchronous',  label: 'Synchronous Matrix' },
      { id: 'matrix-asynchronous', label: 'Asynchronous Matrix' },
      { id: 'matrix-errors',       label: 'Error Codes' },
    ],
  },
];

export const MATRIX_PAGE_TITLES = {
  'matrix-intro':         'Introduction',
  'matrix-synchronous':   'Synchronous Matrix',
  'matrix-asynchronous':  'Asynchronous Matrix',
  'matrix-errors':        'Error Codes',
};
