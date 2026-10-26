/* ─────────────────────────────────────────────────────────────────────────────
 * Driving Intelligence — navigation (DRAFT, generated with the pkd-to-docs skill)
 * Shape: service (cloud API + thin Android SDK, called by the carmaker's assistant).
 * No endpoints or versions are defined yet, so there are no endpoint pages and no vDots.
 * ───────────────────────────────────────────────────────────────────────────── */

export const DI_NAV = [
  { id: 'di-intro', label: 'Introduction', type: 'top' },
  { id: 'di-quickstart', label: 'Getting Started', type: 'top' },

  { type: 'section', label: 'Use cases' },
  {
    label: 'All use cases', key: 'diUseCases', type: 'group', landingId: 'di-use-cases',
    items: [
      { id: 'di-uc-faster-way', label: 'A faster way to work' },
      { id: 'di-uc-closure', label: 'A closure on the usual road' },
      { id: 'di-uc-save-place', label: 'Save a place' },
      { id: 'di-uc-charger', label: 'A charger on the way' },
      { id: 'di-uc-coffee', label: 'Coffee in the next 45 minutes' },
      { id: 'di-uc-open-on-arrival', label: 'Somewhere to eat, open on arrival' },
    ],
  },

  { type: 'section', label: 'Concepts' },
  { id: 'di-concepts', label: 'Moments and modes', type: 'top' },
  { id: 'di-integration-paths', label: 'Integration paths', type: 'top' },
  { id: 'di-flows', label: 'Reactive and proactive flows', type: 'top' },
  { id: 'di-designing', label: 'Designing with DI', type: 'top' },

  { type: 'section', label: 'Reference' },
  { id: 'di-capabilities', label: 'Capabilities', type: 'top' },
  { id: 'di-sdk-interface', label: 'DI SDK interface', type: 'top' },
  { id: 'di-context', label: 'Context and data handling', type: 'top' },
  { id: 'di-response-contract', label: 'Response contract', type: 'top' },
  { id: 'di-errors', label: 'Errors and fallback', type: 'top' },
  { id: 'di-glossary', label: 'Glossary', type: 'top' },

  { type: 'section', label: 'Draft status' },
  { id: 'di-gap-report', label: 'Draft gap report', type: 'top' },
];

export const DI_PAGE_TITLES = {
  'di-intro': 'Introduction',
  'di-quickstart': 'Getting Started',
  'di-use-cases': 'Use cases',
  'di-uc-faster-way': 'A faster way to work',
  'di-uc-closure': 'A closure on the usual road',
  'di-uc-save-place': 'Save a place',
  'di-uc-charger': 'A charger on the way',
  'di-uc-coffee': 'Coffee in the next 45 minutes',
  'di-uc-open-on-arrival': 'Somewhere to eat, open on arrival',
  'di-concepts': 'Moments and modes',
  'di-integration-paths': 'Integration paths',
  'di-flows': 'Reactive and proactive flows',
  'di-designing': 'Designing with DI',
  'di-capabilities': 'Capabilities',
  'di-sdk-interface': 'DI SDK interface',
  'di-context': 'Context and data handling',
  'di-response-contract': 'Response contract',
  'di-errors': 'Errors and fallback',
  'di-glossary': 'Glossary',
  'di-gap-report': 'Draft gap report',
};
