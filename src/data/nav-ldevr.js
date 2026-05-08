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
  { type: 'section', label: 'v1 · Production' },
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
  { type: 'section', label: 'v2 · Private Preview' },
  { id: 'ldevr-weather',        label: 'Weather Consideration',         type: 'top', ref: true, anchors: [
      { id: 'ldevr-weather-request-params', label: 'Request parameters',       method: 'POST' },
      { id: 'ldevr-weather-body-params',    label: 'POST body parameters',     method: 'POST' },
      { id: 'ldevr-weather-response',       label: 'Response data' },
    ]},
  { id: 'ldevr-vehicle-brand',  label: 'Vehicle Brand',                 type: 'top', ref: true, anchors: [
      { id: 'ldevr-vehicle-brand-params',   label: 'Request parameters',       method: 'POST' },
      { id: 'ldevr-vehicle-brand-response', label: 'Response data' },
    ]},
  { id: 'ldevr-compute-toll',   label: 'Compute Toll Amounts',          type: 'top', ref: true, anchors: [
      { id: 'ldevr-toll-request',  label: 'Request parameters',                method: 'POST' },
      { id: 'ldevr-toll-response', label: 'Response data' },
    ]},
  { id: 'ldevr-charging-parks', label: 'Charging Parks Opening Hours',  type: 'top', ref: true, anchors: [
      { id: 'ldevr-parks-request',  label: 'Request parameters',               method: 'POST' },
      { id: 'ldevr-parks-response', label: 'Response data' },
    ]},
  { id: 'ldevr-oem-emsp',       label: 'OEM eMSP Support',              type: 'top', ref: true, anchors: [
      { id: 'ldevr-emsp-headers', label: 'Request headers',                    method: 'POST' },
      { id: 'ldevr-emsp-sev',     label: 'SEV entitlement key' },
      { id: 'ldevr-emsp-response', label: 'Response data' },
    ]},
  { id: 'ldevr-data-freshness', label: 'Dynamic Data Freshness',        type: 'top', ref: true, anchors: [
      { id: 'ldevr-freshness-request', label: 'Request parameters',            method: 'GET' },
      { id: 'ldevr-freshness-post',    label: 'POST usage',                    method: 'POST' },
      { id: 'ldevr-freshness-response', label: 'Response data' },
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
  // v2 Extensions
  'ldevr-weather':        'Weather Consideration',
  'ldevr-vehicle-brand':  'Vehicle Brand',
  'ldevr-compute-toll':   'Compute Toll Amounts',
  'ldevr-charging-parks': 'Charging Parks Opening Hours',
  'ldevr-oem-emsp':       'OEM eMSP Support',
  'ldevr-data-freshness': 'Dynamic Data Freshness',
};
