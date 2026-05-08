/**
 * Analytics helpers — thin wrapper around Plausible's manual pageview API.
 *
 * We use `script.manual.js` because the app is a SPA with state-based
 * navigation (no URL changes), so Plausible's auto mode would only fire
 * once per session. Instead we call trackPage() on every navigate().
 *
 * Plausible setup:
 *  1. Create a free account at https://plausible.io
 *  2. Add site with domain: premalmistry-tomtom.github.io
 *  3. That's it — data appears within minutes of first visit.
 *
 * Docs: https://plausible.io/docs/manual-pageviews
 */

/**
 * Track a pageview.
 * @param {string} pageId   - e.g. 'ldevr-intro', 'ev-routing', 'overview'
 * @param {string} productId - e.g. 'ux-library', 'ldevr', 'routing-api'
 */
export function trackPage(pageId, productId) {
  if (typeof window === 'undefined') return;
  if (!window.plausible) return; // script not loaded (dev / ad-blocker)

  // Build a virtual URL so Plausible shows readable paths in the dashboard
  // e.g. /ux-library/ev-routing  or  /ldevr/ldevr-intro
  const product = productId || 'portal';
  const virtualUrl = `/${product}/${pageId}`;

  window.plausible('pageview', {
    u: `https://premalmistry-tomtom.github.io${virtualUrl}`,
  });
}

/**
 * Track a named custom event (e.g. clicked a live demo link).
 * @param {string} name   - event name shown in Plausible dashboard
 * @param {object} [props] - optional key/value properties
 */
export function trackEvent(name, props) {
  if (typeof window === 'undefined') return;
  if (!window.plausible) return;
  window.plausible(name, props ? { props } : undefined);
}
