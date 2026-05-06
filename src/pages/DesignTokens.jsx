import { useTranslation } from 'react-i18next';
import Callout from '../components/ui/Callout';
import PageActions from '../components/ui/PageActions';

export default function DesignTokens() {
  const { t } = useTranslation('pages');
  const dt = key => t(`designTokens.${key}`);

  return (
    <div className="page">
      <div className="page-header">
        <h1>{dt('title')}</h1>
        <PageActions />
      </div>
      <div className="quick-answer">
        {dt('quickAnswer')}
      </div>

      {/* Introduction */}
      <div className="zone">
        <h2 className="sh" id="dt-intro">{dt('sections.intro')}</h2>
        <div className="token-flow-intro">
          <div className="tfi-step">
            <div className="tfi-icon tfi-icon-token">🎨</div>
            <div className="tfi-label">{dt('flowDesignToken')}</div>
          </div>
          <div className="tfi-arrow">→</div>
          <div className="tfi-step">
            <div className="tfi-icon tfi-icon-component">🧩</div>
            <div className="tfi-label">{dt('flowComponent')}</div>
          </div>
          <div className="tfi-arrow">→</div>
          <div className="tfi-step">
            <div className="tfi-icon tfi-icon-product">📱</div>
            <div className="tfi-label">{dt('flowProduct')}</div>
          </div>
        </div>
        <p className="body">
          {dt('introBody1')} <code className="ic">#C82020</code> {dt('introBody2')}{' '}
          <code className="ic">tt_sys_color_brand_primary</code>. {dt('introBody3')}
        </p>
      </div>

      {/* Benefits */}
      <div className="zone">
        <h2 className="sh" id="dt-benefits">{dt('sections.benefits')}</h2>
        <div className="benefit-grid">
          {[
            ['🎨', dt('benefit0Title'), dt('benefit0Desc')],
            ['📐', dt('benefit1Title'), dt('benefit1Desc')],
            ['⚡', dt('benefit2Title'), dt('benefit2Desc')],
            ['🔒', dt('benefit3Title'), dt('benefit3Desc')],
          ].map(([icon, title, desc]) => (
            <div key={title} className="benefit-card">
              <div className="benefit-icon">{icon}</div>
              <div className="benefit-title">{title}</div>
              <div className="benefit-desc">{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Token structure */}
      <div className="zone">
        <h2 className="sh" id="dt-structure">{dt('sections.structure')}</h2>
        <p className="body">{dt('structureBody')}</p>
        <table className="prop-table">
          <thead><tr><th>{dt('colTier')}</th><th>{dt('colDescription')}</th></tr></thead>
          <tbody>
            {[
              [dt('globalTokensTitle'),    dt('globalTokensDesc')],
              [dt('systemTokensTitle'),    dt('systemTokensDesc')],
              [dt('componentTokensTitle'), dt('componentTokensDesc')],
            ].map(([tier, desc]) => (
              <tr key={tier}>
                <td style={{ whiteSpace: 'nowrap' }}><code className="ic">{tier}</code></td>
                <td>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Token names */}
      <div className="zone">
        <h2 className="sh" id="dt-names">{dt('sections.names')}</h2>
        <p className="body">
          {dt('namesBody')} <code className="ic">[Prefix]_[Tier]_[Type]_[Name]_[Variant]</code>
        </p>
        <div className="token-name-anatomy">
          <div className="tna-token">tt_glb_color_blue_400</div>
          <div className="tna-parts">
            <div className="tna-part tna-prefix">
              <span className="tna-highlight">tt</span>
              <span className="tna-part-label">{dt('partPrefix')}</span>
            </div>
            <div className="tna-sep">_</div>
            <div className="tna-part tna-tier">
              <span className="tna-highlight">glb</span>
              <span className="tna-part-label">{dt('partTier')}</span>
            </div>
            <div className="tna-sep">_</div>
            <div className="tna-part tna-type">
              <span className="tna-highlight" style={{ background: '#fff7ed', color: '#c2410c' }}>color</span>
              <span className="tna-part-label">{dt('partType')}</span>
            </div>
            <div className="tna-sep">_</div>
            <div className="tna-part tna-name">
              <span className="tna-highlight">blue</span>
              <span className="tna-part-label">{dt('partName')}</span>
            </div>
            <div className="tna-sep">_</div>
            <div className="tna-part tna-variant">
              <span className="tna-highlight">400</span>
              <span className="tna-part-label">{dt('partVariant')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Structure overview */}
      <div className="zone">
        <h2 className="sh" id="dt-overview">{dt('overviewTitle')}</h2>
        <p className="body">{dt('overviewBody')}</p>
        <table className="prop-table">
          <thead><tr><th>{dt('colPart')}</th><th>{dt('colDescription')}</th></tr></thead>
          <tbody>
            {[0,1,2,3,4,5,6].map(i => (
              <tr key={i}>
                <td><code className="ic">{dt(`part${i}Title`)}</code></td>
                <td>{dt(`part${i}Desc`)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Token examples */}
      <div className="zone">
        <h2 className="sh" id="dt-examples">{dt('examplesTitle')}</h2>
        <p className="body">{dt('examplesBody')}</p>

        <h3 className="sub">{dt('globalColourTitle')}</h3>
        <div className="dt-swatch-row">
          {[
            ['#F0F7FF','#333','blue_100'],['#78BEEC','#333','blue_300'],
            ['#1E8AD4','#fff','blue_400'],['#155E9C','#fff','blue_500'],
            ['#072948','#fff','blue_700'],['#C82020','#fff','red_300'],
            ['#009E64','#fff','green_300'],['#FFCA40','#333','yellow_200'],
          ].map(([bg, color, label]) => (
            <div key={label} className="dt-swatch-ex" style={{ background: bg, color }}>{label}</div>
          ))}
        </div>

        <h3 className="sub">{dt('systemColourTitle')}</h3>
        <div className="dt-sys-list">
          {[
            ['#072948', 'tt_sys_color_surface_primary',    dt('sys0Desc')],
            ['#C82020', 'tt_sys_color_brand_primary',      dt('sys1Desc')],
            ['#1E8AD4', 'tt_sys_color_action_secondary',   dt('sys2Desc')],
            ['#009E64', 'tt_sys_color_guidance_routeLine', dt('sys3Desc')],
          ].map(([bg, token, desc]) => (
            <div key={token} className="dt-sys-ex">
              <div className="dt-sys-dot" style={{ background: bg }} />
              <div className="dt-sys-info">
                <code className="ic" style={{ fontSize: '0.875rem' }}>{token}</code>
                <span className="dt-sys-desc">{desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Naming principles */}
      <div className="zone">
        <h2 className="sh" id="dt-naming">{dt('namingTitle')}</h2>
        <p className="body">{dt('namingBody')}</p>
        <table className="prop-table">
          <thead><tr><th>{dt('colType')}</th><th>{dt('colNameProg')}</th><th>{dt('colNotes')}</th></tr></thead>
          <tbody>
            {[
              [dt('naming0Type'), 'tt_glb_font_family',          dt('naming0Notes')],
              [dt('naming1Type'), 'tt_glb_color_[name]_[scale]', dt('naming1Notes')],
              [dt('naming2Type'), 'tt_glb_size_[dp]',            dt('naming2Notes')],
              [dt('naming3Type'), 'tt_glb_spacing_[value]',      dt('naming3Notes')],
              [dt('naming4Type'), 'tt_sys_font_display_[size]',  dt('naming4Notes')],
            ].map(([type, name, notes]) => (
              <tr key={type}>
                <td>{type}</td>
                <td><code className="ic">{name}</code></td>
                <td>{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Callout type="info">
          {dt('calloutHeader')}
          <ul style={{ marginTop: 6, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.875rem' }}>
            <li>{dt('calloutItem0a')} <code className="ic">tt_</code> {dt('calloutItem0b')}</li>
            <li>{dt('calloutItem1a')} <strong>{dt('scalable')}</strong> {dt('calloutItem1b')} <strong>{dt('themeable')}</strong> {dt('calloutItem1c')}</li>
            <li>{dt('calloutItem2a')} <code className="ic">routeLine</code>{dt('calloutItem2b')} <code className="ic">route_line</code></li>
          </ul>
        </Callout>
      </div>

      {/* Themes and modes */}
      <div className="zone">
        <h2 className="sh" id="dt-themes">{dt('sections.themes')}</h2>
        <p className="body">
          {dt('themesBody1')}{' '}
          <strong>{dt('colourMode')}</strong> {dt('themesBody2')}{' '}
          <strong>{dt('sizeMode')}</strong> {dt('themesBody3')}{' '}
          <strong>{dt('brandMode')}</strong> {dt('themesBody4')}
        </p>

        <div className="theme-mode-grid">
          <div className="tm-card">
            <div className="tm-label">{dt('lightMode')}</div>
            <div style={{ background: '#f8f8f8', padding: 0 }}>
              <div className="tm-bar" style={{ background: '#ffffff', borderBottom: '1px solid #e0e0e0' }}>
                <div className="tm-dot" style={{ background: '#C82020' }} />
                <span style={{ fontSize: '0.875rem', color: '#1a1a1a', fontWeight: 700 }}>TomTom</span>
              </div>
              <div className="tm-btns">
                <button className="tm-btn-primary">{dt('navigate')}</button>
                <button className="tm-btn-secondary" style={{ color: '#4a4a4a', borderColor: '#e0e0e0' }}>{dt('search')}</button>
              </div>
              <div style={{ padding: '0 10px 8px', fontSize: '0.875rem', color: '#767676', fontFamily: 'var(--font-mono)' }}>
                tt_sys_color_surface_primary → #F5F5F5
              </div>
            </div>
          </div>
          <div className="tm-card">
            <div className="tm-label">{dt('darkMode')}</div>
            <div style={{ background: '#0c1318', padding: 0 }}>
              <div className="tm-bar" style={{ background: '#171e24', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="tm-dot" style={{ background: '#C82020' }} />
                <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.9)', fontWeight: 700 }}>TomTom</span>
              </div>
              <div className="tm-btns">
                <button className="tm-btn-primary">{dt('navigate')}</button>
                <button className="tm-btn-secondary" style={{ color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.15)' }}>{dt('search')}</button>
              </div>
              <div style={{ padding: '0 10px 8px', fontSize: '0.875rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)' }}>
                tt_sys_color_surface_primary → #0C1318
              </div>
            </div>
          </div>
        </div>

        <Callout type="warn">
          {dt('themesCallout')}
        </Callout>
      </div>

      <div className="feedback-strip">
        {t('common:ui.wasHelpful', 'Was this page helpful?')}
        <button>{t('common:ui.yes', '👍 Yes')}</button>
        <button>{t('common:ui.no', '👎 No')}</button>
      </div>
    </div>
  );
}
