import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const TOC_MAP = {
  colour: [
    { id: 'c-global',    label: 'Global colours' },
    { id: 'c-extended',  label: 'Extended collection' },
    { id: 'c-system',    label: 'System colours' },
    { id: 'c-surfaces',  label: 'a. Surfaces',          indent: true },
    { id: 'c-brand',     label: 'b. Brand',             indent: true },
    { id: 'c-guidance',  label: 'c. Guidance',          indent: true },
    { id: 'c-alerts',    label: 'd. Alerts & warnings', indent: true },
    { id: 'c-actions',   label: 'e. Actions',           indent: true },
    { id: 'c-ui',        label: 'f. UI controls',       indent: true },
    { id: 'c-signage',   label: 'g. Road signage',      indent: true },
    { id: 'c-poi',       label: 'h. POI categories',    indent: true },
    { id: 'c-semantics', label: 'Semantic definitions' },
  ],
  'home-screen-layout': [
    { id: 'h-overview',      label: 'Overview' },
    { id: 'h-zones',         label: 'Screen zones' },
    { id: 'h-resize',        label: 'Resize application area' },
    { id: 'h-states',        label: 'UI state API' },
    { id: 'h-requirements',  label: 'Requirements' },
  ],
  traffic: [
    { id: 'tr-overview',     label: 'Overview' },
    { id: 'tr-layers',       label: 'Flow & incidents layers' },
    { id: 'tr-incidents',    label: 'Incident types' },
    { id: 'tr-refresh',      label: 'Refresh interval' },
    { id: 'tr-provider',     label: 'Custom provider' },
    { id: 'tr-requirements', label: 'Requirements' },
  ],
  'safety-locations': [
    { id: 'sl-overview',     label: 'Overview' },
    { id: 'sl-types',        label: 'Safety location types' },
    { id: 'sl-zones',        label: 'Speed & danger zones' },
    { id: 'sl-style',        label: 'Style customisation' },
    { id: 'sl-requirements', label: 'Requirements' },
  ],
  'map-style': [
    { id: 'ms-overview',      label: 'Overview' },
    { id: 'ms-variants',      label: 'Style variants' },
    { id: 'ms-uri',           label: 'Style URIs' },
    { id: 'ms-custom',        label: 'Customising a style' },
    { id: 'ms-tilt',          label: 'Adding tilt' },
    { id: 'ms-requirements',  label: 'Requirements' },
  ],
  'nav-controls': [
    { id: 'nc-overview',     label: 'Overview' },
    { id: 'nc-position',     label: 'Position & visibility' },
    { id: 'nc-entry',        label: 'Search entry point' },
    { id: 'nc-requirements', label: 'Requirements' },
  ],
  'horizon-panel': [
    { id: 'hp-overview',     label: 'Overview' },
    { id: 'hp-decompose',    label: 'Composed vs decomposed' },
    { id: 'hp-position',     label: 'Position (composed)' },
    { id: 'hp-requirements', label: 'Requirements' },
  ],
  'instruction-panel': [
    { id: 'nip-overview',     label: 'Overview' },
    { id: 'nip-position',     label: 'Position' },
    { id: 'nip-requirements', label: 'Requirements' },
  ],
  'eta-panel': [
    { id: 'eta-overview',     label: 'Overview' },
    { id: 'eta-position',     label: 'Position' },
    { id: 'eta-content',      label: 'Content fields' },
    { id: 'eta-requirements', label: 'Requirements' },
  ],
  'route-bar': [
    { id: 'rb-overview',     label: 'Overview' },
    { id: 'rb-position',     label: 'Positioning' },
    { id: 'rb-requirements', label: 'Requirements' },
  ],
  'search-engine': [
    { id: 'se-overview',      label: 'Overview' },
    { id: 'se-provider',      label: 'Provider setup' },
    { id: 'se-transitions',   label: 'Connectivity transitions' },
    { id: 'se-ui-custom',     label: 'Search UI customisation' },
    { id: 'se-lpp',           label: 'Location preview panel' },
    { id: 'se-entry-points',  label: 'POI entry points' },
    { id: 'se-requirements',  label: 'Requirements' },
  ],
  font: [
    { id: 'f-global',          label: 'Global tokens' },
    { id: 'f-family',          label: 'Font family',     indent: true },
    { id: 'f-weight',          label: 'Font weight',     indent: true },
    { id: 'f-size',            label: 'Font size',       indent: true },
    { id: 'f-system',          label: 'System tokens' },
    { id: 'f-system-anatomy',  label: 'Token anatomy',   indent: true },
    { id: 'f-system-scale',    label: 'Token scale',     indent: true },
    { id: 'f-component',       label: 'Component tokens' },
    { id: 'f-theming',         label: 'Theming & scaling' },
  ],
  'corner-radius': [
    { id: 'cr-intro',    label: 'Introduction' },
    { id: 'cr-sizes',    label: 'Radius sizes' },
    { id: 'cr-examples', label: 'Examples' },
  ],
  'ai-overview': [
    { id: 'ai-overview',      label: 'Overview' },
    { id: 'ai-architecture',  label: 'Architecture' },
    { id: 'ai-scope',         label: 'Scope of responsibility' },
    { id: 'ai-capabilities',  label: 'Capabilities' },
    { id: 'ai-requirements',  label: 'Requirements' },
  ],
  'voice-engine': [
    { id: 've-overview',        label: 'Overview' },
    { id: 've-responsibilities', label: 'OEM responsibilities' },
    { id: 've-integration',     label: 'Connecting your TTS engine' },
    { id: 've-providers',       label: 'VPA providers' },
    { id: 've-requirements',    label: 'Requirements' },
  ],
  'speech-to-text': [
    { id: 'stt-overview',     label: 'Overview' },
    { id: 'stt-boundary',     label: 'The TAIA input boundary' },
    { id: 'stt-integration',  label: 'STT integration pattern' },
    { id: 'stt-wake',         label: 'Wake word handling' },
    { id: 'stt-requirements', label: 'Requirements' },
  ],
  'ai-config': [
    { id: 'ac-overview',      label: 'Overview' },
    { id: 'ac-dependency',    label: 'Adding the dependency' },
    { id: 'ac-init',          label: 'Initialising the TAIA client' },
    { id: 'ac-context',       label: 'Navigation context' },
    { id: 'ac-events',        label: 'MQTT event delivery' },
    { id: 'ac-session',       label: 'Multi-turn conversations' },
    { id: 'ac-requirements',  label: 'Requirements' },
  ],
  'ev': [
    { id: 'ev-overview',      label: 'Overview' },
    { id: 'ev-architecture',  label: 'Architecture' },
    { id: 'ev-vehicle',       label: 'Vehicle setup' },
    { id: 'ev-search',        label: 'EV charging search' },
    { id: 'ev-routing',       label: 'Long distance routing' },
    { id: 'ev-preferences',   label: 'Route preferences' },
    { id: 'ev-requirements',  label: 'Requirements' },
  ],
  'ev-overview': [
    { id: 'evo-arch',   label: 'Architecture' },
    { id: 'evo-guide',  label: 'Setup guide' },
    { id: 'evo-order',  label: 'Initialisation order' },
  ],
  'ev-battery': [
    { id: 'evb-presets',  label: 'Vehicle presets' },
    { id: 'evb-provider', label: 'Vehicle provider' },
    { id: 'evb-aux',      label: 'Auxiliary consumption' },
    { id: 'evb-offset',   label: 'Battery offset' },
    { id: 'evb-params',   label: 'Parameter reference' },
  ],
  'ev-charging-search': [
    { id: 'evcs-ui',      label: 'Search UI' },
    { id: 'evcs-options', label: 'Search API options' },
    { id: 'evcs-msp',     label: 'Preferred networks' },
  ],
  'ev-routing': [
    { id: 'evr-strategy', label: 'Charging strategy' },
    { id: 'evr-prefs',    label: 'Route preferences' },
    { id: 'evr-api',      label: 'API request' },
    { id: 'evr-response', label: 'Response fields' },
    { id: 'evr-trip',     label: 'Trip summary' },
  ],
  'ev-nav-ui': [
    { id: 'evui-soc',     label: 'SoC display' },
    { id: 'evui-range',   label: 'Range ring' },
    { id: 'evui-reroute', label: 'Rerouting' },
  ],
  'ev-requirements': [
    { id: 'evreq-checklist',  label: 'Checklist' },
    { id: 'evreq-deps',       label: 'Dependencies' },
    { id: 'evreq-permissions', label: 'Permissions' },
  ],
  'adas': [
    { id: 'adas-overview',      label: 'Overview' },
    { id: 'adas-capabilities',  label: 'Capabilities' },
    { id: 'adas-integration',   label: 'Integration model' },
  ],
  'cluster': [
    { id: 'cl-overview',     label: 'Overview' },
    { id: 'cl-start',        label: 'Starting the activity' },
    { id: 'cl-config',       label: 'Configuration' },
    { id: 'cl-position',     label: 'Positioning components' },
    { id: 'cl-runtime',      label: 'Runtime updates' },
    { id: 'cl-requirements', label: 'Requirements' },
  ],
  'screenshot-assets': [
    { id: 'sa-how',                   label: 'How to use' },
    { id: 'sa-home-screen-layout',    label: 'Home Screen Layout' },
    { id: 'sa-nav-controls',          label: 'Navigation Controls' },
    { id: 'sa-horizon-panel',         label: 'Horizon Panel' },
    { id: 'sa-instruction-panel',     label: 'Next Instruction Panel' },
    { id: 'sa-eta-panel',             label: 'ETA Panel' },
    { id: 'sa-route-bar',             label: 'Route Bar' },
    { id: 'sa-search-engine',         label: 'Search Engine' },
    { id: 'sa-ev',                    label: 'EV Support' },
    { id: 'sa-ai-overview',           label: 'TAIA' },
  ],
  'design-tokens': [
    { id: 'dt-intro',    label: 'Introduction' },
    { id: 'dt-benefits', label: 'Benefits' },
    { id: 'dt-structure', label: 'Token structure' },
    { id: 'dt-names',    label: 'Token names' },
    { id: 'dt-overview', label: 'Structure overview' },
    { id: 'dt-examples', label: 'Token examples' },
    { id: 'dt-naming',   label: 'Naming principles' },
    { id: 'dt-themes',   label: 'Themes & modes' },
  ],

  /* ── Routing API ──────────────────────────────────────────────────────── */
  'routing-api-intro': [
    { id: 'r-endpoints', label: 'All endpoints' },
    { id: 'r-examples',  label: 'See demos' },
    { id: 'r-guides',    label: 'Guides' },
    { id: 'r-platforms', label: 'Versions & Platforms' },
    { id: 'r-reference', label: 'Reference' },
    { id: 'r-related',   label: 'Related APIs' },
  ],
  'navsdk-quickstart': [
    { id: 'qs-choose',  label: 'Choose your path' },
    { id: 'qs-preview', label: 'What you\'ll build' },
  ],
  'navsdk-example-quickstart': [
    { id: 'eq-key',   label: 'Get your API key' },
    { id: 'eq-clone', label: 'Clone & configure' },
    { id: 'eq-run',   label: 'Build & run' },
    { id: 'eq-next',  label: 'Next steps' },
  ],
  'navsdk-example-app': [
    { id: 'eq-key',   label: 'Get your API key' },
    { id: 'eq-clone', label: 'Clone & configure' },
    { id: 'eq-run',   label: 'Build & run' },
    { id: 'eq-next',  label: 'Next steps' },
  ],
  'routing-quickstart': [
    { id: 'authentication',     label: 'Authentication' },
    { id: 'first-route',        label: 'Your first route' },
    { id: 'response-structure', label: 'Response structure' },
    { id: 'version-comparison', label: 'Which version?' },
  ],
  'routing-ev-overview': [
    { id: 'how-it-works',    label: 'How EV routing works' },
    { id: 'key-params',      label: 'Key parameters' },
    { id: 'code-example',    label: 'Code example' },
    { id: 'version-support', label: 'Version support' },
  ],
  'routing-ev-consumption': [
    { id: 'electric-model',   label: 'Electric consumption model' },
    { id: 'combustion-model', label: 'Combustion model' },
  ],
  'routing-ev-connectors': [
    { id: 'vehicle-dimensions', label: 'Vehicle dimensions' },
    { id: 'battery-params',     label: 'Battery parameters' },
    { id: 'syntax-versions',    label: 'v1/v2 vs v3 syntax' },
  ],
  'routing-reconstruction': [
    { id: 'how-it-works', label: 'How reconstruction works' },
  ],
  'routing-avoid-areas': [
    { id: 'avoid-areas',        label: 'avoidAreas parameter' },
    { id: 'avoid-query-params', label: 'Query-param avoids' },
  ],
  'routing-tolls': [
    { id: 'toll-avoidance',    label: 'Toll road avoidance' },
    { id: 'vignette-coverage', label: 'Vignette coverage' },
  ],
  'routing-tomtom-maps': [
    { id: 'overview',  label: 'Platform overview' },
    { id: 'geocoding', label: 'Geocoding compatibility' },
  ],
  'routing-orbis-maps': [
    { id: 'overview', label: 'Platform overview' },
  ],
  'routing-migration': [
    { id: 'key-changes',     label: 'Key changes' },
    { id: 'code-comparison', label: 'Code comparison' },
  ],
  'routing-params-ref': [
    { id: 'all-params', label: 'Common parameters (A–Z)' },
  ],
  'routing-response-ref': [
    { id: 'schema', label: 'Response object tree' },
  ],
  'routing-error-codes': [
    { id: 'error-table', label: 'Error reference' },
  ],
  'routing-coverage': [
    { id: 'definitions',    label: 'Definitions' },
    { id: 'coverage-legend', label: 'Coverage columns' },
    { id: 'americas',       label: 'Americas' },
    { id: 'asia-pacific',   label: 'Asia Pacific' },
    { id: 'europe',         label: 'Europe' },
    { id: 'mea',            label: 'Middle East & Africa' },
  ],

  /* ── LDEVR ──────────────────────────────────────────────────────────────── */
  'ldevr-intro': [
    { id: 'ldevr-endpoints', label: 'Endpoints' },
    { id: 'ldevr-examples',  label: 'Guides' },
    { id: 'versions',        label: 'Versions' },
    { id: 'ldevr-base',      label: 'Base URL' },
  ],
  'ldevr-quickstart': [
    { id: 'authentication',    label: 'Authentication' },
    { id: 'first-route',       label: 'Your first EV route' },
    { id: 'response-structure', label: 'Understanding the response' },
    { id: 'version-comparison', label: 'Which version?' },
  ],
  'ldevr-platform': [
    { id: 'versions', label: 'All versions' },
  ],
  'ldevr-tomtom-maps': [
    { id: 'overview',    label: 'Overview' },
    { id: 'endpoints',   label: 'Endpoints' },
    { id: 'base-url',    label: 'Base URL' },
  ],
  'ldevr-orbis-v2': [
    { id: 'overview',    label: 'Overview' },
    { id: 'new-params',  label: 'New parameters' },
    { id: 'base-url',    label: 'Base URL' },
  ],
  'ldevr-orbis-v3': [
    { id: 'overview',    label: 'Overview' },
    { id: 'new-params',  label: 'New parameters' },
    { id: 'base-url',    label: 'Base URL' },
  ],
  'ldevr-migration': [
    { id: 'v1-to-v2',        label: 'v1 → v2' },
    { id: 'v2-to-v3',        label: 'v2 → v3' },
    { id: 'code-comparison', label: 'Code comparison' },
  ],
  'ldevr-params-ref': [
    { id: 'all-params', label: 'Parameters (A–Z)' },
  ],
  'ldevr-response-ref': [
    { id: 'schema', label: 'Response object tree' },
  ],
  'ldevr-errors': [
    { id: 'error-table', label: 'Error reference' },
    { id: 'error-format', label: 'Error format' },
  ],
  'ldevr-coverage': [
    { id: 'regional-coverage', label: 'Regional coverage' },
  ],
  'ldevr-battery-model': [
    { id: 'lbm-consumption',  label: 'Speed consumption curve' },
    { id: 'lbm-battery-curve',label: 'Battery charge curve' },
    { id: 'lbm-efficiency',   label: 'Efficiency parameters' },
    { id: 'lbm-aux',          label: 'Auxiliary power' },
  ],
  'ldevr-charging-stops': [
    { id: 'lcs-strategy',    label: 'Charging stop strategy' },
    { id: 'lcs-thresholds',  label: 'SoC thresholds' },
    { id: 'lcs-manual',      label: 'Manual waypoints' },
    { id: 'lcs-preferences', label: 'Charging preferences' },
  ],
  'ldevr-connectors': [
    { id: 'lco-structure',  label: 'Connector object' },
    { id: 'lco-power',      label: 'Effective power' },
    { id: 'lco-current',    label: 'Current types' },
    { id: 'lco-plug-types', label: 'Plug type reference' },
  ],

  /* ── Search API ─────────────────────────────────────────────────────────── */
  'search-api-intro': [
    { id: 'endpoints', label: 'Endpoints' },
    { id: 'guides',    label: 'Guides' },
    { id: 'versions',  label: 'Versions' },
    { id: 'base-url',  label: 'Base URL' },
  ],
  'search-quickstart': [
    { id: 'authentication',    label: 'Authentication' },
    { id: 'first-search',      label: 'Your first search' },
    { id: 'response-structure', label: 'Understanding the response' },
    { id: 'version-comparison', label: 'Which version?' },
  ],
  'search-guides': [
    { id: 'guides', label: 'All guides' },
  ],
  'search-platform': [
    { id: 'versions', label: 'All versions' },
  ],
  'search-tomtom-maps': [
    { id: 'overview',   label: 'Overview' },
    { id: 'endpoints',  label: 'Endpoints' },
    { id: 'base-url',   label: 'Base URL' },
  ],
  'search-orbis-maps': [
    { id: 'overview',   label: 'Overview' },
    { id: 'endpoints',  label: 'Endpoints' },
    { id: 'base-url',   label: 'Base URL' },
  ],
  'search-migration': [
    { id: 'key-changes',      label: 'Key changes' },
    { id: 'code-comparison',  label: 'Code comparison' },
    { id: 'removed',          label: 'Services not available' },
  ],
  'search-params-ref': [
    { id: 'all-params', label: 'Parameters (A–Z)' },
  ],
  'search-response-ref': [
    { id: 'schema', label: 'Response object tree' },
  ],
  'search-error-codes': [
    { id: 'error-table',  label: 'Error reference' },
    { id: 'error-format', label: 'Error format' },
  ],
  'search-coverage': [
    { id: 'regional-coverage', label: 'Regional coverage' },
  ],
  'search-guide-typeahead': [
    { id: 'overview',        label: 'Overview' },
    { id: 'implementation',  label: 'Implementation' },
    { id: 'example',         label: 'Example' },
  ],
  'search-guide-ev': [
    { id: 'overview',       label: 'Overview' },
    { id: 'category-set',   label: 'Category set 7309' },
    { id: 'filtering',      label: 'Connector filtering' },
    { id: 'example',        label: 'Example' },
  ],
  'search-guide-fuzzy-tips': [
    { id: 'overview',  label: 'Overview' },
    { id: 'params',    label: 'Key parameters' },
    { id: 'example',   label: 'Example' },
  ],
  'search-geometry': [
    { id: 'request',  label: 'Request' },
    { id: 'response', label: 'Response' },
  ],
  'search-place-by-id': [
    { id: 'request',  label: 'Request' },
    { id: 'response', label: 'Response' },
  ],
  'search-poi-categories': [
    { id: 'request',  label: 'Request' },
    { id: 'response', label: 'Response' },
  ],
  'search-additional-data': [
    { id: 'request',  label: 'Request' },
    { id: 'response', label: 'Response' },
  ],
  'poi-details': [
    { id: 'request',  label: 'Request' },
    { id: 'response', label: 'Response' },
  ],
  'poi-photos': [
    { id: 'request',  label: 'Request' },
    { id: 'response', label: 'Response' },
    { id: 'usage',    label: 'Usage' },
  ],

  /* ── Geocoding API ──────────────────────────────────────────────────────── */
  'geocoding-api-intro': [
    { id: 'endpoints', label: 'Endpoints' },
    { id: 'guides',    label: 'Guides' },
    { id: 'versions',  label: 'Versions' },
    { id: 'base-url',  label: 'Base URL' },
  ],
  'geocoding-quickstart': [
    { id: 'authentication',    label: 'Authentication' },
    { id: 'first-geocode',     label: 'Your first geocode' },
    { id: 'response-structure', label: 'Understanding the response' },
    { id: 'version-comparison', label: 'Which version?' },
  ],
  'geocoding-guides': [
    { id: 'guides', label: 'All guides' },
  ],
  'geocoding-platform': [
    { id: 'versions', label: 'All versions' },
  ],
  'geocoding-tomtom-maps': [
    { id: 'overview',  label: 'Overview' },
    { id: 'endpoints', label: 'Endpoints' },
    { id: 'base-url',  label: 'Base URL' },
  ],
  'geocoding-orbis-maps': [
    { id: 'overview',  label: 'Overview' },
    { id: 'endpoints', label: 'Endpoints' },
    { id: 'base-url',  label: 'Base URL' },
  ],
  'geocoding-migration': [
    { id: 'v1-migration',    label: 'TomTom Maps → v1' },
    { id: 'v2-migration',    label: 'TomTom Maps → v2' },
    { id: 'code-comparison', label: 'Code comparison' },
  ],
  'geocoding-params-ref': [
    { id: 'all-params', label: 'Parameters (A–Z)' },
  ],
  'geocoding-response-ref': [
    { id: 'schema', label: 'Response object tree' },
  ],
  'geocoding-error-codes': [
    { id: 'error-table',  label: 'Error reference' },
    { id: 'error-format', label: 'Error format' },
  ],
  'geocoding-coverage': [
    { id: 'regional-coverage', label: 'Regional coverage' },
  ],
  'geocoding-guide-accuracy': [
    { id: 'overview',       label: 'Overview' },
    { id: 'match-type',     label: 'Match confidence' },
    { id: 'params',         label: 'Accuracy parameters' },
    { id: 'example',        label: 'Example' },
  ],
  'geocoding-guide-batch': [
    { id: 'overview',    label: 'Overview' },
    { id: 'request',     label: 'Request format' },
    { id: 'response',    label: 'Response format' },
    { id: 'example',     label: 'Example' },
  ],
  'geocoding-guide-structured': [
    { id: 'overview',       label: 'Overview' },
    { id: 'when-to-use',    label: 'When to use' },
    { id: 'params',         label: 'Address fields' },
    { id: 'example',        label: 'Example' },
  ],
  'geocode': [
    { id: 'geocode',          label: 'Geocode' },
    { id: 'structured-geocode', label: 'Structured geocode' },
  ],
  'reverse-geocode': [
    { id: 'reverse-geocode',  label: 'Reverse geocode' },
    { id: 'cross-street-lookup', label: 'Cross street lookup' },
  ],
  'structured-geocode': [
    { id: 'request',  label: 'Request' },
    { id: 'response', label: 'Response' },
  ],
  'cross-street-lookup': [
    { id: 'request',  label: 'Request' },
    { id: 'response', label: 'Response' },
  ],

  /* ── Traffic API ────────────────────────────────────────────────────────── */
  'traffic-api-intro': [
    { id: 'endpoints', label: 'Endpoints' },
    { id: 'guides',    label: 'Guides' },
    { id: 'versions',  label: 'Versions' },
    { id: 'base-url',  label: 'Base URL' },
  ],
  'traffic-quickstart': [
    { id: 'authentication',    label: 'Authentication' },
    { id: 'first-request',     label: 'Your first request' },
    { id: 'response-structure', label: 'Understanding the response' },
    { id: 'version-comparison', label: 'Which version?' },
  ],
  'traffic-guides': [
    { id: 'guides', label: 'All guides' },
  ],
  'traffic-platform': [
    { id: 'versions', label: 'All versions' },
  ],
  'traffic-tomtom-maps': [
    { id: 'overview',  label: 'Overview' },
    { id: 'endpoints', label: 'Endpoints' },
    { id: 'base-url',  label: 'Base URL' },
  ],
  'traffic-orbis-maps': [
    { id: 'overview',  label: 'Overview' },
    { id: 'endpoints', label: 'Endpoints' },
    { id: 'base-url',  label: 'Base URL' },
  ],
  'traffic-migration': [
    { id: 'general-changes',  label: 'General changes' },
    { id: 'flow-vector-tiles', label: 'Flow vector tiles' },
    { id: 'incident-details', label: 'Incident details' },
    { id: 'code-comparison',  label: 'Code comparison' },
  ],
  'traffic-params-ref': [
    { id: 'all-params', label: 'Parameters (A–Z)' },
  ],
  'traffic-response-ref': [
    { id: 'schema', label: 'Response object tree' },
  ],
  'traffic-error-codes': [
    { id: 'error-table',  label: 'Error reference' },
    { id: 'error-format', label: 'Error format' },
  ],
  'traffic-coverage': [
    { id: 'regional-coverage', label: 'Regional coverage' },
  ],
  'traffic-guide-tiles': [
    { id: 'overview',     label: 'Overview' },
    { id: 'tile-url',     label: 'Tile URL structure' },
    { id: 'styles',       label: 'Available styles' },
    { id: 'example',      label: 'Example' },
  ],
  'traffic-guide-flow': [
    { id: 'overview',     label: 'Overview' },
    { id: 'flow-data',    label: 'Flow data fields' },
    { id: 'thresholds',   label: 'Speed thresholds' },
    { id: 'example',      label: 'Example' },
  ],
  'traffic-guide-model': [
    { id: 'overview',     label: 'Overview' },
    { id: 'model-id',     label: 'Model ID endpoint' },
    { id: 'use-cases',    label: 'Use cases' },
    { id: 'example',      label: 'Example' },
  ],
  'traffic-raster-flow': [
    { id: 'raster-flow-request',  label: 'Request' },
    { id: 'raster-flow-response', label: 'Response' },
    { id: 'raster-flow-errors',   label: 'Error codes' },
  ],
  'traffic-vector-flow': [
    { id: 'vector-flow-request',      label: 'Request' },
    { id: 'vector-flow-default-tags', label: 'Default tags' },
    { id: 'vector-flow-ondemand-tags',label: 'On-demand tags' },
  ],
  'traffic-raster-incident': [
    { id: 'raster-incident-request',  label: 'Request' },
    { id: 'raster-incident-response', label: 'Response' },
    { id: 'raster-incident-errors',   label: 'Error codes' },
  ],
  'traffic-vector-incident': [
    { id: 'vector-incident-request',    label: 'Request' },
    { id: 'vector-incident-flow-tags',  label: 'Flow tags' },
    { id: 'vector-incident-ondemand-tags', label: 'On-demand tags' },
  ],
  'traffic-flow-tiles': [
    { id: 'raster-flow-tiles',  label: 'Raster flow tiles' },
    { id: 'vector-flow-tiles',  label: 'Vector flow tiles' },
    { id: 'incident-tiles',     label: 'Incident tiles' },
    { id: 'tile-response',      label: 'Tile response' },
  ],
  'traffic-flow-segment': [
    { id: 'request',  label: 'Request' },
    { id: 'response', label: 'Response' },
  ],
  'traffic-model-id': [
    { id: 'request',       label: 'Request' },
    { id: 'response',      label: 'Response' },
    { id: 'cache-pattern', label: 'Cache pattern' },
  ],
  'traffic-incident-details': [
    { id: 'incident-details',          label: 'Incident details' },
    { id: 'incident-details-response', label: 'Response' },
    { id: 'incident-viewport',         label: 'Incident viewport' },
  ],

  /* ── Map Display API ────────────────────────────────────────────────────── */
  'map-display-api-intro': [
    { id: 'endpoints', label: 'Endpoints' },
    { id: 'guides',    label: 'Guides' },
    { id: 'versions',  label: 'Versions' },
    { id: 'base-url',  label: 'Base URL' },
  ],
  'map-quickstart': [
    { id: 'authentication',    label: 'Authentication' },
    { id: 'first-tile',        label: 'Your first tile' },
    { id: 'tile-response',     label: 'Understanding the tile system' },
    { id: 'version-comparison', label: 'Which version?' },
  ],
  'map-guides': [
    { id: 'guides', label: 'All guides' },
  ],
  'map-platform': [
    { id: 'versions', label: 'All versions' },
  ],
  'map-tomtom-maps': [
    { id: 'overview',  label: 'Overview' },
    { id: 'endpoints', label: 'Endpoints' },
    { id: 'base-url',  label: 'Base URL' },
  ],
  'map-orbis-maps': [
    { id: 'overview',  label: 'Overview' },
    { id: 'endpoints', label: 'Endpoints' },
    { id: 'base-url',  label: 'Base URL' },
  ],
  'map-migration': [
    { id: 'general-changes', label: 'General changes' },
    { id: 'vector-tile',     label: 'Vector tile' },
    { id: 'raster-tile',     label: 'Raster tile' },
    { id: 'code-comparison', label: 'Code comparison' },
  ],
  'map-params-ref': [
    { id: 'all-params', label: 'Parameters (A–Z)' },
  ],
  'map-response-ref': [
    { id: 'schema', label: 'Response object tree' },
  ],
  'map-error-codes': [
    { id: 'error-table',  label: 'Error reference' },
    { id: 'error-format', label: 'Error format' },
  ],
  'map-coverage': [
    { id: 'regional-coverage', label: 'Regional coverage' },
  ],
  'map-guide-zoom': [
    { id: 'overview',      label: 'Overview' },
    { id: 'tile-grid',     label: 'Tile grid (XYZ)' },
    { id: 'zoom-levels',   label: 'Zoom 0–22' },
    { id: 'resolution',    label: 'Resolution' },
  ],
  'map-guide-styles': [
    { id: 'overview',      label: 'Overview' },
    { id: 'style-json',    label: 'Style JSON' },
    { id: 'customisation', label: 'Customising layers' },
    { id: 'example',       label: 'Example' },
  ],
  'map-guide-hybrid': [
    { id: 'overview',    label: 'Overview' },
    { id: 'layers',      label: 'Layer stack' },
    { id: 'example',     label: 'Example' },
  ],

  /* ── EV Charging API ────────────────────────────────────────────────────── */
  'ev-charging-api-intro': [
    { id: 'endpoints', label: 'Endpoints' },
    { id: 'guides',    label: 'Guides' },
    { id: 'versions',  label: 'Versions' },
    { id: 'base-url',  label: 'Base URL' },
  ],
  'ev-quickstart': [
    { id: 'authentication',    label: 'Authentication' },
    { id: 'first-search',      label: 'Your first station search' },
    { id: 'response-structure', label: 'Understanding the response' },
    { id: 'version-comparison', label: 'Which version?' },
  ],
  'ev-charging-guides': [
    { id: 'guides', label: 'All guides' },
  ],
  'ev-charging-platform': [
    { id: 'versions', label: 'All versions' },
  ],
  'ev-tomtom-maps': [
    { id: 'overview',  label: 'Overview' },
    { id: 'endpoints', label: 'Endpoints' },
    { id: 'base-url',  label: 'Base URL' },
  ],
  'ev-orbis-maps': [
    { id: 'overview',  label: 'Overview' },
    { id: 'endpoints', label: 'Endpoints' },
    { id: 'base-url',  label: 'Base URL' },
  ],
  'ev-connector-types': [
    { id: 'connector-table', label: 'Connector types' },
    { id: 'usage',           label: 'Usage' },
  ],
  'ev-params-ref': [
    { id: 'all-params', label: 'Parameters (A–Z)' },
  ],
  'ev-response-ref': [
    { id: 'schema', label: 'Response object tree' },
  ],
  'ev-error-codes': [
    { id: 'error-table',  label: 'Error reference' },
    { id: 'error-format', label: 'Error format' },
  ],
  'ev-charging-coverage': [
    { id: 'regional-coverage', label: 'Regional coverage' },
  ],
  'ev-supported-markets': [
    { id: 'supported-markets', label: 'Supported markets' },
  ],
  'ev-guide-discovery': [
    { id: 'overview',      label: 'Overview' },
    { id: 'near-point',    label: 'Near a coordinate' },
    { id: 'along-route',   label: 'Along a route' },
    { id: 'in-geometry',   label: 'Within geometry' },
    { id: 'example',       label: 'Example' },
  ],
  'ev-guide-connectors': [
    { id: 'overview',        label: 'Overview' },
    { id: 'connector-types', label: 'Connector types' },
    { id: 'filtering',       label: 'Filtering' },
    { id: 'example',         label: 'Example' },
  ],
  'ev-guide-jmespath': [
    { id: 'overview',    label: 'Overview' },
    { id: 'syntax',      label: 'JMESPath syntax' },
    { id: 'examples',    label: 'Examples' },
  ],
};

export default function TOC({ currentPage }) {
  const { t } = useTranslation('common');
  const [activeId, setActiveId] = useState('');
  const items = TOC_MAP[currentPage] || [];

  useEffect(() => {
    if (!items.length) return;
    const ids = items.map(i => i.id);
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-60px 0px -70% 0px', threshold: 0 }
    );
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [currentPage]);

  if (!items.length) return <aside className="toc" />;

  return (
    <aside className="toc">
      <div className="toc-heading">{t('ui.onThisPage')}</div>
      <ul className="toc-list">
        {items.map(item => {
          const label = t(`toc.${currentPage}.${item.id}`, { defaultValue: item.label });
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`${item.indent ? 'indent' : ''}${activeId === item.id ? ' active' : ''}`}
              >
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
