/* ─────────────────────────────────────────────────────────────────────────────
 * TryItEmbed — self-contained "Try it live" widget for API reference pages.
 *
 * Uses the app's built-in demo API key — no key input needed.
 *
 * Usage (in an ApiRefTwoCol section):
 *   sections={[{ id: 'request', demoId: 'fuzzy-search', ... }]}
 * ───────────────────────────────────────────────────────────────────────────── */

import { DEMOS, TryItPanel } from '../../pages/TryItDemos';

import { TOMTOM_API_KEY } from '../../config/tomtomKey';
const DEMO_API_KEY = TOMTOM_API_KEY;

export default function TryItEmbed({ demoId }) {
  const demo = DEMOS.find(d => d.id === demoId);
  if (!demo) return null;

  return (
    <div style={{ marginTop: 28 }}>
      <TryItPanel demo={demo} apiKey={DEMO_API_KEY} />
    </div>
  );
}
