import { useTranslation } from 'react-i18next';
import Callout from '../components/ui/Callout';
import PageActions from '../components/ui/PageActions';

const RADIUS_TOKENS = [
  { token: 'tt_sys_size_radius_null', dp: 0,      label: 'null' },
  { token: 'tt_sys_size_radius_xs',   dp: 2,      label: 'xs' },
  { token: 'tt_sys_size_radius_s',    dp: 4,      label: 's' },
  { token: 'tt_sys_size_radius_r',    dp: 6,      label: 'r' },
  { token: 'tt_sys_size_radius_m',    dp: 8,      label: 'm' },
  { token: 'tt_sys_size_radius_l',    dp: 12,     label: 'l' },
  { token: 'tt_sys_size_radius_xl',   dp: 16,     label: 'xl' },
  { token: 'tt_sys_size_radius_xxl',  dp: 24,     label: 'xxl' },
  { token: 'tt_sys_size_radius_full', dp: '50%',  label: 'full' },
];

function RadiusCard({ token, dp, label }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 10,
      padding: '14px 16px', background: 'var(--bg)',
      border: '1px solid var(--border)', borderRadius: 20,
    }}>
      <div style={{
        width: '100%', aspectRatio: '3 / 2',
        background: '#dbeafe',
        border: '2px dashed #93c5fd',
        borderRadius: typeof dp === 'number' ? dp * 1.5 : dp,
      }} />
      <div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
          color: 'var(--blue)', fontWeight: 500, marginBottom: 3,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {token}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
          {typeof dp === 'number' ? `${dp}dp` : dp}
        </div>
      </div>
    </div>
  );
}

export default function CornerRadius() {
  const { t } = useTranslation('pages');
  return (
    <div className="page">
      <div className="page-header">
        <h1>{t('cornerRadius.title')}</h1>
        <PageActions />
      </div>
      <div className="quick-answer">
        Global and per-component corner radius tokens — consistent shape language from pill buttons to map cards.
      </div>

      {/* Introduction */}
      <div className="zone">
        <h2 className="sh" id="cr-intro">{t('cornerRadius.sections.intro')}</h2>
        <p className="body">
          Radius values are assigned to the corners of a container or element within a component.
          The radius token is a single value that is applied to all four corners.
        </p>
        <p className="body">
          Corner radius tokens live at the system tier (<code className="ic">tt_sys_size_radius_*</code>)
          and are resolved from the global size scale. Using tokens instead of hardcoded values
          ensures shape adjusts correctly when themes or OEM overrides are applied.
        </p>
        <Callout type="info">
          Always reference a radius token — never hardcode a pixel or dp value directly in a
          component. If a radius doesn&apos;t exist in the scale, request it from the design
          system team.
        </Callout>
      </div>

      {/* Radius sizes */}
      <div className="zone">
        <h2 className="sh" id="cr-sizes">{t('cornerRadius.sections.sizes')}</h2>
        <p className="body">
          To allow for variation in the UI, the system layer has a range of radius sizes to
          choose from. The scale runs from <code className="ic">null</code> (sharp, 0dp) through
          graduated steps to <code className="ic">full</code> (pill/circle, 50%).
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 10,
          marginBottom: 24,
        }}>
          {RADIUS_TOKENS.map(t => (
            <RadiusCard key={t.token} {...t} />
          ))}
        </div>

        <table className="prop-table">
          <thead>
            <tr><th>Token</th><th>Value</th><th>Usage</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><code className="ic">tt_sys_size_radius_null</code></td>
              <td>0dp</td>
              <td>Sharp corners — data tables, full-bleed map tiles</td>
            </tr>
            <tr>
              <td><code className="ic">tt_sys_size_radius_xs</code></td>
              <td>2dp</td>
              <td>Subtle rounding — chips, badges, small tags</td>
            </tr>
            <tr>
              <td><code className="ic">tt_sys_size_radius_s</code></td>
              <td>4dp</td>
              <td>Input fields, compact buttons, list items</td>
            </tr>
            <tr>
              <td><code className="ic">tt_sys_size_radius_r</code></td>
              <td>6dp</td>
              <td>Default interactive controls</td>
            </tr>
            <tr>
              <td><code className="ic">tt_sys_size_radius_m</code></td>
              <td>8dp</td>
              <td>Cards, panels, modal sheets</td>
            </tr>
            <tr>
              <td><code className="ic">tt_sys_size_radius_l</code></td>
              <td>12dp</td>
              <td>NIP panels, bottom sheets, prominent containers</td>
            </tr>
            <tr>
              <td><code className="ic">tt_sys_size_radius_xl</code></td>
              <td>16dp</td>
              <td>Large cards, preview frames, media containers</td>
            </tr>
            <tr>
              <td><code className="ic">tt_sys_size_radius_xxl</code></td>
              <td>24dp</td>
              <td>Hero surfaces, floating action areas</td>
            </tr>
            <tr>
              <td><code className="ic">tt_sys_size_radius_full</code></td>
              <td>50%</td>
              <td>Pills, icon buttons, avatar containers</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Examples */}
      <div className="zone">
        <h2 className="sh" id="cr-examples">{t('cornerRadius.sections.examples')}</h2>
        <p className="body">
          The three special values cover the most common shape needs without requiring
          arbitrary intermediate values.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {[
            {
              label: 'null',
              token: 'tt_sys_size_radius_null',
              desc: 'Sets the radius to 0. Use for flush, tile-like surfaces that need to butt against other elements cleanly.',
              radius: 0,
            },
            {
              label: 'xs–xxl',
              token: 'tt_sys_size_radius_xs … tt_sys_size_radius_xxl',
              desc: 'A range of values increasing in size. They can be adjusted by the OEM theme — always reference the token, not the dp value directly.',
              radius: 8,
            },
            {
              label: 'full',
              token: 'tt_sys_size_radius_full',
              desc: 'Sets the corner radius to 100%. Regardless of the object size, the radius will always be full — creating a pill or circle shape.',
              radius: '50%',
            },
          ].map(({ label, token, desc, radius }) => (
            <div key={label} style={{
              display: 'flex', gap: 16, alignItems: 'flex-start',
              padding: '14px 16px', background: 'var(--bg)',
              border: '1px solid var(--border)', borderRadius: 20,
            }}>
              <div style={{
                flexShrink: 0, width: 52, height: 52,
                background: '#dbeafe', border: '2px dashed #93c5fd',
                borderRadius: typeof radius === 'number' ? radius * 1.5 : radius,
              }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{label}.</span>
                  <code className="ic" style={{ fontSize: '0.75rem' }}>{token}</code>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.6, margin: 0 }}>
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Callout type="warn">
          Do not mix radius tokens from different tiers. Component tokens may reference system
          radius values — if a component already has a radius token, use that rather than
          applying a system token directly.
        </Callout>
      </div>

      <div className="feedback-strip">
        Was this page helpful?
        <button>👍 Yes</button>
        <button>👎 No</button>
      </div>
    </div>
  );
}
