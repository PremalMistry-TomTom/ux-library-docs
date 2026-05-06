export const LDEVR_NAV = [
  { id: 'ldevr-intro', label: 'Introduction', type: 'top' },
  { type: 'section', label: 'Getting Started' },
  {
    label: 'Quick Start', key: 'ldEvrQuickStart', type: 'group', landingId: 'ldevr-quickstart',
    items: [
      { id: 'ldevr-auth',        label: 'Authentication' },
      { id: 'ldevr-first-route', label: 'Plan Your First EV Route' },
    ],
  },
  {
    label: 'Core Concepts', key: 'ldEvrConcepts', type: 'group', landingId: 'ldevr-concepts',
    items: [
      { id: 'ldevr-charging-stops',  label: 'Charging Stop Selection' },
      { id: 'ldevr-battery-model',   label: 'Battery & Consumption Model' },
      { id: 'ldevr-connectors',      label: 'Connector Types' },
    ],
  },
  { type: 'section', label: 'Endpoints' },
  { id: 'ldevr-calculate-route', label: 'Calculate EV Route', type: 'top', ref: true, anchors: [
      { id: 'api-ldevr-route',             label: 'Route planning',              method: 'POST' },
      { id: 'api-ldevr-battery',           label: 'Electric vehicle & battery',  method: 'POST' },
      { id: 'api-ldevr-connector',         label: 'Charging connector & power',  method: 'POST' },
      { id: 'api-ldevr-consumption',       label: 'Energy consumption model',    method: 'POST' },
      { id: 'api-ldevr-response-summary',  label: 'Route & battery summary' },
      { id: 'api-ldevr-response-station',  label: 'Charging stop details' },
      { id: 'api-ldevr-errors',            label: 'Error codes' },
    ]},
  { id: 'ldevr-batch', label: 'Batch EV Route', type: 'top', ref: true, anchors: [
      { id: 'api-ldevr-batch-sync',     label: 'Synchronous batch',  method: 'POST' },
      { id: 'api-ldevr-batch-async',    label: 'Asynchronous batch', method: 'POST' },
      { id: 'api-ldevr-batch-response', label: 'Response schema' },
      { id: 'api-ldevr-batch-errors',   label: 'Error codes' },
    ]},
  { type: 'section', label: 'Reference' },
  {
    label: 'API Reference', key: 'ldEvrApiRef', type: 'group',
    items: [
      { id: 'ldevr-errors',   label: 'Error Codes' },
      { id: 'ldevr-coverage', label: 'Market Coverage' },
    ],
  },
];

export const LDEVR_PAGE_TITLES = {
  'ldevr-intro':          'Introduction',
  'ldevr-quickstart':     'Quick Start',
  'ldevr-auth':           'Authentication',
  'ldevr-first-route':    'Plan Your First EV Route',
  'ldevr-concepts':       'Core Concepts',
  'ldevr-charging-stops': 'Charging Stop Selection',
  'ldevr-battery-model':  'Battery & Consumption Model',
  'ldevr-connectors':     'Connector Types',
  'ldevr-calculate-route':'Calculate EV Route',
  'ldevr-batch':                'Batch EV Route',
  'api-ldevr-batch-sync':       'Synchronous batch',
  'api-ldevr-batch-async':      'Asynchronous batch',
  'api-ldevr-batch-response':   'Response schema',
  'api-ldevr-batch-errors':     'Error codes',
  'ldevr-errors':         'Error Codes',
  'ldevr-coverage':       'Market Coverage',
};
