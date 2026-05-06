import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import PageActions from '../components/ui/PageActions';

const BTN_ORDER = ['🔍', '⚡', '🔇', '⚙️'];
const BTN_ENUM  = { '🔍': 'SEARCH', '⚡': 'CHARGING', '🔇': 'MUTE', '⚙️': 'QUICK_SETTINGS' };

function MapMockBase({ children }) {
  return (
    <div style={{ width: '100%', height: 300, background: '#0c1318', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#1a2535,#0f1a28)' }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 280 175" fill="none">
          <path d="M20 90 Q80 60 140 90 T260 80" stroke="#e2001a" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
        </svg>
        <div style={{ position: 'absolute', top: '48%', left: '50%', width: 8, height: 8, borderRadius: '50%', background: '#e2001a', boxShadow: '0 0 0 3px rgba(226,0,26,0.3)' }} />
      </div>
      {children}
    </div>
  );
}

export function ButtonBarConfig({ t }) {
  const BTN_POSITIONS = [
    { id: 'LEFT',   label: t('navControls.positionOptions.vertLeft'),    icon: '⬅' },
    { id: 'RIGHT',  label: t('navControls.positionOptions.vertRight'),   icon: '➡' },
    { id: 'TOP',    label: t('navControls.positionOptions.horizTop'),    icon: '⬆' },
    { id: 'BOTTOM', label: t('navControls.positionOptions.horizBottom'), icon: '⬇' },
  ];
  const BTN_LABELS = {
    '🔍': t('navControls.buttons.search'),
    '⚡': t('navControls.buttons.charging'),
    '🔇': t('navControls.buttons.mute'),
    '⚙️': t('navControls.buttons.settings'),
  };

  const [position, setPosition] = useState('LEFT');
  const [hiddenBtns, setHiddenBtns] = useState([]);

  const toggleHide = icon => setHiddenBtns(h => h.includes(icon) ? h.filter(x => x !== icon) : [...h, icon]);
  const visibleButtons = BTN_ORDER.filter(b => !hiddenBtns.includes(b));

  const barStyle = {
    position: 'absolute', background: 'rgba(0,0,0,0.55)', display: 'flex', gap: 6, padding: 8,
    ...(position === 'LEFT'   ? { top: 0, left: 0, bottom: 0, flexDirection: 'column', width: 44, borderRight: '1px solid rgba(255,255,255,0.08)' } : {}),
    ...(position === 'RIGHT'  ? { top: 0, right: 0, bottom: 0, flexDirection: 'column', width: 44, borderLeft: '1px solid rgba(255,255,255,0.08)' } : {}),
    ...(position === 'TOP'    ? { top: 0, left: 0, right: 0, flexDirection: 'row', height: 44, borderBottom: '1px solid rgba(255,255,255,0.08)' } : {}),
    ...(position === 'BOTTOM' ? { bottom: 0, left: 0, right: 0, flexDirection: 'row', height: 44, borderTop: '1px solid rgba(255,255,255,0.08)', justifyContent: 'center' } : {}),
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {BTN_POSITIONS.map(p => (
          <button key={p.id} onClick={() => setPosition(p.id)} style={{
            padding: '8px 4px', borderRadius: 7, cursor: 'pointer', textAlign: 'center',
            background: position === p.id ? '#fff5f5' : 'var(--bg)',
            border: `1px solid ${position === p.id ? 'var(--red)' : 'var(--border)'}`,
            color: position === p.id ? 'var(--red)' : 'var(--mid)',
            transition: 'all 0.1s',
          }}>
            <div style={{ fontSize: '1rem', marginBottom: 3 }}>{p.icon}</div>
            <div style={{ fontSize: '0.625rem', fontWeight: 600 }}>{p.label}</div>
          </button>
        ))}
      </div>

      <MapMockBase>
        <div style={barStyle}>
          {visibleButtons.map(icon => (
            <div key={icon} style={{ width: 28, height: 28, borderRadius: 5, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', flexShrink: 0 }}>{icon}</div>
          ))}
        </div>
      </MapMockBase>

      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: 8 }}>Button visibility</div>
        <div className="grid-2-col" style={{ gap: 6 }}>
          {BTN_ORDER.map(icon => {
            const hidden = hiddenBtns.includes(icon);
            return (
              <div key={icon} onClick={() => toggleHide(icon)} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
                borderRadius: 6, cursor: 'pointer',
                background: hidden ? 'var(--bg)' : 'var(--white)',
                border: '1px solid var(--border)', opacity: hidden ? 0.5 : 1,
                transition: 'all 0.1s',
              }}>
                <span style={{ fontSize: '0.875rem' }}>{icon}</span>
                <span style={{ fontSize: '0.75rem', flex: 1 }}>{BTN_LABELS[icon]}</span>
                <span style={{ fontSize: '0.625rem', color: hidden ? 'var(--muted)' : '#16a34a', fontWeight: 600 }}>
                  {hidden ? t('navControls.buttons.hidden') : t('navControls.buttons.shown')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <CodeBlock tabs={['Kotlin']}>
        <pre>
          {'homeScreenLayout.'}<span className="hl-f">setControlsZone</span>{'(\n'}
          {'    '}<span className="hl-t">ControlsZone</span>{'(\n'}
          {'        '}<span className="hl-f">position</span>{' = '}<span className="hl-t">ControlsPosition</span>{'.'}<span className="hl-n">{position}</span>{',\n'}
          {'        '}<span className="hl-f">buttons</span>{'  = listOf('}
          {visibleButtons.map((b, i) => (
            <span key={b}>{'\n            '}<span className="hl-t">ControlButton</span>{'.'}<span className="hl-n">{BTN_ENUM[b]}</span>{i < visibleButtons.length - 1 ? ',' : ''}</span>
          ))}
          {'\n        )\n    )\n)'}
        </pre>
      </CodeBlock>
    </div>
  );
}

export function SearchEntryConfig({ t }) {
  const [asButton, setAsButton] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {[{ v: false, key: 'panel' }, { v: true, key: 'button' }].map(({ v, key }) => (
          <button key={String(v)} onClick={() => setAsButton(v)} style={{
            padding: '7px 14px', borderRadius: 7, cursor: 'pointer', fontSize: '0.75rem',
            fontWeight: asButton === v ? 600 : 400,
            background: asButton === v ? '#fff5f5' : 'var(--bg)',
            border: `1px solid ${asButton === v ? 'var(--red)' : 'var(--border)'}`,
            color: asButton === v ? 'var(--red)' : 'var(--mid)',
            transition: 'all 0.1s',
          }}>{t(`navControls.searchOptions.${key}`)}</button>
        ))}
      </div>

      <MapMockBase>
        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 32, background: 'rgba(0,0,0,0.55)', borderRight: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: 4, padding: 6 }}>
          {(asButton ? ['🔍', '⚡', '🔇', '⚙️'] : ['⚡', '🔇', '⚙️']).map(icon => (
            <div key={icon} style={{ width: 20, height: 20, borderRadius: 4, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem' }}>{icon}</div>
          ))}
        </div>
        {!asButton && (
          <div style={{ position: 'absolute', bottom: 12, left: 40, right: 12, background: 'rgba(26,37,53,0.92)', borderRadius: 8, padding: '8px 10px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '0.625rem' }}>🔍</span>
              <span style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)' }}>Search destination…</span>
            </div>
          </div>
        )}
      </MapMockBase>

      <CodeBlock tabs={['Kotlin']}>
        <pre>
          {'homeScreenLayout.'}<span className="hl-f">setSearchEntryPoint</span>{'(\n'}
          {'    '}<span className="hl-t">SearchEntryPoint</span>{'.'}<span className="hl-n">{asButton ? 'BUTTON_IN_CONTROLS_ZONE' : 'DESTINATION_ENTRY_PANEL'}</span>{'\n)'}
        </pre>
      </CodeBlock>
    </div>
  );
}

export default function NavigationControls() {
  const { t } = useTranslation('pages');

  const reqRows = [
    { key: 'theme',     pri: 'P0' },
    { key: 'left',      pri: 'P0' },
    { key: 'right',     pri: 'P0' },
    { key: 'toggle',    pri: 'P1' },
    { key: 'searchBtn', pri: 'P1' },
    { key: 'both',      pri: 'P2' },
    { key: 'custom',    pri: 'P2' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>{t('navControls.title')}</h1>
        <PageActions />
      </div>

      <div className="quick-answer">
        {t('navControls.intro')}
      </div>

      <div className="zone">
        <h2 className="sh" id="nc-overview">{t('navControls.sections.overview')}</h2>
        <p className="body">{t('navControls.overviewBody1')}</p>
        <Callout type="info">{t('navControls.callout')}</Callout>
      </div>

      <div className="zone">
        <h2 className="sh" id="nc-position">{t('navControls.sections.position')}</h2>
        <p className="body">{t('navControls.positionBody')}</p>
        <ButtonBarConfig t={t} />
      </div>

      <div className="zone">
        <h2 className="sh" id="nc-entry">{t('navControls.sections.search')}</h2>
        <p className="body">{t('navControls.searchBody')}</p>
        <SearchEntryConfig t={t} />
      </div>

      <div className="zone">
        <h2 className="sh" id="nc-requirements">{t('navControls.sections.requirements')}</h2>
        <table className="prop-table">
          <thead>
            <tr>
              <th>{t('navControls.requirementsTable.colReq')}</th>
              <th>{t('navControls.requirementsTable.colPri')}</th>
              <th>{t('navControls.requirementsTable.colNotes')}</th>
            </tr>
          </thead>
          <tbody>
            {reqRows.map(({ key, pri }) => (
              <tr key={key}>
                <td style={{ fontWeight: 500 }}>{t(`navControls.requirementsTable.rows.${key}.req`)}</td>
                <td>
                  <span style={{
                    fontSize: '0.625rem', fontWeight: 700, padding: '2px 6px', borderRadius: 3,
                    background: pri === 'P0' ? '#fff5f5' : 'var(--bg)',
                    color: pri === 'P0' ? 'var(--red)' : 'var(--muted)',
                    border: `1px solid ${pri === 'P0' ? '#fecaca' : 'var(--border)'}`,
                  }}>{pri}</span>
                </td>
                <td style={{ color: 'var(--mid)', fontSize: '0.875rem' }}>{t(`navControls.requirementsTable.rows.${key}.notes`)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
