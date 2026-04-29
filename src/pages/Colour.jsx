import { useTranslation } from 'react-i18next';
import { SCALES, EXTENDED, SYSTEM } from '../data/colours';
import { Swatch, TokenDot } from '../components/ui/Swatch';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import PageActions from '../components/ui/PageActions';

function ScaleRow({ label, prefix, steps, narrow }) {
  return (
    <div className="scale-group">
      <div className="scale-label">
        {label} <span className="scale-prefix">{prefix}</span>
      </div>
      <div className={`scale-row${narrow ? ' scale-row--narrow' : ''}`}>
        {steps.map(([step, hex]) => (
          <Swatch key={step} name={`${prefix}${step}`} hex={hex} />
        ))}
      </div>
    </div>
  );
}

function TokenTableSection({ id, label, desc, rows }) {
  return (
    <div className="token-group">
      <div className="token-group-label" id={id}>{label}</div>
      {desc && <p className="body" style={{ marginBottom: 10 }}>{desc}</p>}
      <table className="token-table">
        <thead>
          <tr><th>Token</th><th>Value</th><th>Description</th></tr>
        </thead>
        <tbody>
          {rows.map(([token, hex, description]) => (
            <tr key={token}>
              <td>
                <div className="token-cell">
                  <TokenDot hex={hex} />
                  <code className="ic">{token}</code>
                </div>
              </td>
              <td><span className="token-hex">{hex}</span></td>
              <td><span className="token-desc">{description}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Colour() {
  const { t } = useTranslation('pages');
  return (
    <div className="page">
      <div className="page-header">
        <h1>{t('colour.title')}</h1>
        <PageActions />
      </div>
      <div className="quick-answer">
        Global palette tokens and semantic system aliases — the colour foundation every component and theme is built on.
      </div>

      {/* Global colours */}
      <div className="zone">
        <h2 className="sh" id="c-global">{t('colour.sections.global')}</h2>
        <p className="body">
          Global colours are the foundational palette — neutral, versatile, and context-agnostic.
          Reference system colour tokens in your code, not these values directly.
        </p>

        <ScaleRow label="Blue"   prefix="tt_glb_color_blue_"   steps={SCALES.blue} />
        <ScaleRow label="Grey"   prefix="tt_glb_color_grey_"   steps={SCALES.grey} />
        <ScaleRow label="Black & White" prefix="tt_glb_color_" steps={SCALES.bw} narrow />
        <ScaleRow label="Green"  prefix="tt_glb_color_green_"  steps={SCALES.green} />
        <ScaleRow label="Red"    prefix="tt_glb_color_red_"    steps={SCALES.red} />
        <ScaleRow label="Orange" prefix="tt_glb_color_orange_" steps={SCALES.orange} />
        <ScaleRow label="Yellow" prefix="tt_glb_color_yellow_" steps={SCALES.yellow} />

        <div className="localised-row">
          <ScaleRow label="Localised USA" prefix="tt_glb_color_usaGreen_" steps={SCALES.usa} />
          <ScaleRow label="Localised EU"  prefix="tt_glb_color_euBlue_"   steps={SCALES.eu} />
        </div>
      </div>

      {/* Extended */}
      <div className="zone">
        <h2 className="sh" id="c-extended">
          Extended Colour Collection{' '}
          <span style={{ fontSize: '0.72rem', fontWeight: 400, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
            tt_glb_color_
          </span>
        </h2>
        <p className="body">
          Supplementary palette for POI categories, road signage, guidance states, and map
          overlays. Do not use for general UI chrome.
        </p>
        <div className="ctx-grid">
          {EXTENDED.map(([name, hex]) => (
            <Swatch key={name} name={name} hex={hex} compact />
          ))}
        </div>
        <Callout type="info">
          <strong>Blue</strong> — primary interactive, map surfaces &nbsp;·&nbsp;
          <strong>Grey / Black</strong> — structural neutrals &nbsp;·&nbsp;
          <strong>Red</strong> — brand + critical alerts (red_300 = TomTom red) &nbsp;·&nbsp;
          <strong>Green / Yellow / Orange</strong> — guidance cues &nbsp;·&nbsp;
          <strong>Extended</strong> — POI categories, overlays, localised signage only
        </Callout>
        <CodeBlock label="Kotlin — always reference tokens, never hardcode">
          <pre>
            <span className="hl-c">{'// Do NOT hardcode hex values — always reference tokens'}</span>{'\n'}
            <span className="hl-k">val</span>{' brandColor   = TomTomColors.'}<span className="hl-n">tt_glb_color_red_300</span>{'       '}<span className="hl-c">{'// TomTom red'}</span>{'\n'}
            <span className="hl-k">val</span>{' mapSurface   = TomTomColors.'}<span className="hl-n">tt_glb_color_blue_700</span>{'      '}<span className="hl-c">{'// dark nav canvas'}</span>{'\n'}
            <span className="hl-k">val</span>{' safeRoute    = TomTomColors.'}<span className="hl-n">tt_glb_color_green_300</span>{'     '}<span className="hl-c">{'// guidance line'}</span>{'\n'}
            <span className="hl-k">val</span>{' alertWarning = TomTomColors.'}<span className="hl-n">tt_glb_color_yellow_200</span>{'    '}<span className="hl-c">{'// caution state'}</span>
          </pre>
        </CodeBlock>
      </div>

      {/* System colours */}
      <div className="zone">
        <h2 className="sh" id="c-system">{t('colour.sections.system')}</h2>
        <p className="body">
          Semantic tokens — they carry intent, not just hue. Components reference these tokens,
          never global colours directly.
        </p>

        <TokenTableSection
          id="c-surfaces" label="a. Surfaces"
          desc={<>Defines the background stack from navigation canvas to panel overlays. Night-mode panels use <code className="ic">surface.secondary_jet</code>.</>}
          rows={SYSTEM.surfaces}
        />
        <TokenTableSection
          id="c-brand" label="b. Brand"
          desc={<>TomTom red across interactive states. Use <code className="ic">brand.primary</code> for CTAs and logo marks. Never derive your own pressed/disabled — use the provided tokens.</>}
          rows={SYSTEM.brand}
        />
        <TokenTableSection
          id="c-guidance" label="c. Guidance"
          desc="Route polylines, waypoints, and turn-arrow overlays. Calibrated for legibility against the default map style at day and night."
          rows={SYSTEM.guidance}
        />
        <TokenTableSection
          id="c-alerts" label="d. Alerts & Warnings"
          desc="Map directly to severity levels. Do not substitute across levels — all four are contrast-tested on light and dark panels."
          rows={SYSTEM.alerts}
        />
        <TokenTableSection id="c-actions" label="e. Actions" rows={SYSTEM.actions} />
        <TokenTableSection id="c-ui"      label="f. UI Controls" rows={SYSTEM.ui} />
        <TokenTableSection id="c-signage" label="g. Road Signage" rows={SYSTEM.signage} />
        <TokenTableSection id="c-poi"     label="h. POI Categories" rows={SYSTEM.poi} />
      </div>

      {/* Semantic definitions */}
      <div className="zone">
        <h2 className="sh" id="c-semantics">{t('colour.sections.semantics')}</h2>
        <p className="body">
          Role definitions describe intent — not just the current value. Understanding the role
          prevents incorrect substitutions.
        </p>
        {[
          ['surface', 'The map canvas and container layer. Should always resolve to a spatially coherent background — do not use for text, icons, or interactive chrome.'],
          ['primary / secondary', 'Most prominent and supporting roles within a component group. Primary carries the highest visual weight and most important action.'],
          ['accented', 'Temporary emphasis — focus rings, hover states, selection highlights. Must not be used as a fill on large surfaces.'],
          ['pressed', 'Active/held state. Always darker than the default state. Do not apply to hover states — those use accented.'],
        ].map(([title, body]) => (
          <div key={title} className="sem-card">
            <div className="sem-title">{title}</div>
            <div className="sem-body">{body}</div>
          </div>
        ))}
      </div>

      <div className="feedback-strip">
        Was this page helpful?
        <button>👍 Yes</button>
        <button>👎 No</button>
      </div>
    </div>
  );
}
