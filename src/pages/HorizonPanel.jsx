import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import { ApiLinks } from '../components/ui/ApiLinks';
import PageActions from '../components/ui/PageActions';
import { useDemoStyle } from '../hooks/useDemoStyle';

/* ─── API references ─────────────────────────────────────────────────────────── */
const HORIZON_APIS = [
  {
    name: 'Horizon — Safety Locations',
    type: 'Android SDK',
    description: 'Stream safety cameras and speed zone data ahead of the vehicle along the active route.',
    pageId: 'navsdk-horizon-safety', productId: 'navsdk',
  },
  {
    name: 'Horizon — Hazards',
    type: 'Android SDK',
    description: 'Receive ahead-of-time alerts for road hazards approaching along the planned route.',
    pageId: 'navsdk-horizon-hazards', productId: 'navsdk',
  },
  {
    name: 'Horizon — Traffic',
    type: 'Android SDK',
    description: 'Access predictive traffic events and flow data from the virtual horizon engine.',
    pageId: 'navsdk-horizon-traffic', productId: 'navsdk',
  },
  {
    name: 'Horizon — POIs',
    type: 'Android SDK',
    description: 'Query points of interest along the upcoming route horizon for ahead-of-time notifications.',
    pageId: 'navsdk-horizon-data', productId: 'navsdk',
  },
  {
    name: 'Retrieving Horizon Data',
    type: 'Android SDK',
    description: 'Access the full Virtual Horizon engine to read road attributes, curvature, and elevation ahead of the vehicle.',
    pageId: 'navsdk-horizon-data', productId: 'navsdk',
  },
];

export function GuidanceMock({ position, decomposed }) {
  const M = useDemoStyle();
  const panelStyle = {
    LEFT:   { left: 0 },
    CENTER: { left: '50%', transform: 'translateX(-50%)' },
    RIGHT:  { right: 0 },
  }[position];

  const PANEL_W = 200;

  return (
    <div style={{ width: '100%', height: 320, background: M.dark, borderRadius: 20, border: `1px solid ${M.line}`, overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${M.dark}cc, ${M.dark})` }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 300 210" fill="none">
          <path d="M20 115 Q80 80 150 110 T280 100" stroke="#e2001a" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
          <path d="M80 0 L85 210" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
          <path d="M215 0 L210 210" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
        </svg>
        <div style={{ position: 'absolute', top: '52%', left: '52%', width: 8, height: 8, borderRadius: '50%', background: '#e2001a', boxShadow: '0 0 0 3px rgba(226,0,26,0.3)' }} />
      </div>

      {decomposed ? (
        <>
          {/* NIP — top */}
          <div style={{ position: 'absolute', top: 0, width: PANEL_W, ...panelStyle, background: `${M.green}30`, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1px solid ${M.line}`, borderLeft: `1px solid ${M.line}`, borderRight: `1px solid ${M.line}`, borderRadius: '0 0 10px 10px' }}>
            <span style={{ fontSize: '1.5rem', color: M.white }}>↖</span>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: M.white }}>1.2 mi</div>
              <div style={{ fontSize: '0.875rem', color: M.dim }}>Oak St North</div>
            </div>
          </div>
          {/* Upcoming Events — middle (floating) */}
          <div style={{ position: 'absolute', top: 110, width: PANEL_W, ...panelStyle, background: `${M.dark}e0`, borderRadius: 20, padding: '10px 14px', border: `1px solid ${M.line}` }}>
            <div style={{ fontSize: '0.875rem', color: M.dim, marginBottom: 5, letterSpacing: '0.05em' }}>UPCOMING</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['🚧', '⛽', '☕'].map(e => <span key={e} style={{ fontSize: '0.875rem' }}>{e}</span>)}
            </div>
          </div>
          {/* ETA — bottom */}
          <div style={{ position: 'absolute', bottom: 12, width: PANEL_W, ...panelStyle, background: `${M.dark}ee`, borderRadius: 20, padding: '10px 14px', border: `1px solid ${M.line}`, display: 'flex', gap: 14 }}>
            {[['14:32', 'ETA'], ['18m', 'Time'], ['6.4', 'km']].map(([v, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: M.white }}>{v}</div>
                <div style={{ fontSize: '0.875rem', color: M.dim }}>{l}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Composed — single full-height panel */
        <div style={{
          position: 'absolute', top: 0, bottom: 0, width: PANEL_W, ...panelStyle,
          background: `${M.dark}e6`, border: `1px solid ${M.line}`,
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ background: `${M.green}30`, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '1.5rem', color: M.white }}>↖</span>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: M.white }}>1.2 mi</div>
              <div style={{ fontSize: '0.875rem', color: M.dim }}>Oak St North</div>
            </div>
          </div>
          <div style={{ flex: 1, padding: '10px 14px', borderTop: `1px solid ${M.line}`, borderBottom: `1px solid ${M.line}` }}>
            <div style={{ fontSize: '0.875rem', color: M.dim, marginBottom: 6, letterSpacing: '0.05em' }}>UPCOMING</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['🚧', '⛽', '☕'].map(e => <span key={e} style={{ fontSize: '0.875rem' }}>{e}</span>)}
            </div>
          </div>
          <div style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between' }}>
            {[['14:32', 'ETA'], ['18m', 'Time'], ['6.4km', 'Dist']].map(([v, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: M.white }}>{v}</div>
                <div style={{ fontSize: '0.875rem', color: M.dim }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function HorizonPanel({ onNavigate }) {
  const { t } = useTranslation('pages');
  const [decomposed, setDecomposed] = useState(false);
  const [position, setPosition] = useState('LEFT');

  const H_POSITIONS = [
    { id: 'LEFT',   label: t('horizonPanel.left') },
    { id: 'CENTER', label: t('horizonPanel.center') },
    { id: 'RIGHT',  label: t('horizonPanel.right') },
  ];

  const reqRows = [
    { key: 'theme',      pri: 'P0' },
    { key: 'decompose',  pri: 'P0' },
    { key: 'reposition', pri: 'P2' },
    { key: 'reverse',    pri: 'OUT OF SCOPE' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>{t('horizonPanel.title')}</h1>
        <PageActions />
      </div>

      <div className="quick-answer">
        {t('horizonPanel.intro')}
      </div>

      <ApiLinks items={HORIZON_APIS} onNavigate={onNavigate} />

      <div className="zone">
        <h2 className="sh" id="hp-overview">{t('horizonPanel.sections.overview')}</h2>
        <p className="body">{t('horizonPanel.overviewBody1')}</p>
        <p className="body">{t('horizonPanel.overviewBody2')}</p>
      </div>

      <div className="zone">
        <h2 className="sh" id="hp-decompose">{t('horizonPanel.sections.decompose')}</h2>
        <p className="body">{t('horizonPanel.decomposeBody')}</p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[{ v: false, key: 'composed' }, { v: true, key: 'decomposed' }].map(({ v, key }) => (
            <button key={String(v)} onClick={() => setDecomposed(v)} style={{
              padding: '7px 16px', borderRadius: 7, cursor: 'pointer', fontSize: '0.75rem',
              fontWeight: decomposed === v ? 600 : 400,
              background: decomposed === v ? '#fff5f5' : 'var(--bg)',
              border: `1px solid ${decomposed === v ? 'var(--red)' : 'var(--border)'}`,
              color: decomposed === v ? 'var(--red)' : 'var(--mid)',
              transition: 'all 0.1s',
            }}>{t(`horizonPanel.${key}`)}</button>
          ))}
        </div>

        <GuidanceMock position={position} decomposed={decomposed} />

        <Callout type="info" style={{ marginTop: 16 }}>
          {t('horizonPanel.decomposeCallout')}
        </Callout>

        <div style={{ marginTop: 16 }}>
          <CodeBlock tabs={['Kotlin']}>
            <pre>
              {decomposed ? (
                <>
                  <span className="hl-c">{'// Decompose into independent sub-components\n'}</span>
                  {'horizonPanel.'}<span className="hl-f">decompose</span>{'(\n'}
                  {'    '}<span className="hl-t">DecomposedLayout</span>{'(\n'}
                  {'        '}<span className="hl-f">nextInstructionPanel</span>{' = '}<span className="hl-t">NIPConfig</span>{'(position = '}<span className="hl-t">NIPosition</span>{'.'}<span className="hl-n">TOP_LEFT</span>{'),\n'}
                  {'        '}<span className="hl-f">etaPanel</span>{' = '}<span className="hl-t">ETAConfig</span>{'(position = '}<span className="hl-t">ETAPosition</span>{'.'}<span className="hl-n">BOTTOM_LEFT</span>{'),\n'}
                  {'        '}<span className="hl-f">upcomingEventsPanel</span>{' = '}<span className="hl-t">UpcomingEventsConfig</span>{'(visible = '}<span className="hl-n">true</span>{')\n'}
                  {'    )\n)'}
                </>
              ) : (
                <>
                  <span className="hl-c">{'// Composed Horizon Panel (default)\n'}</span>
                  {'horizonPanel.'}<span className="hl-f">setPosition</span>{'('}<span className="hl-t">HorizonPosition</span>{'.'}<span className="hl-n">{position}</span>{')'}
                </>
              )}
            </pre>
          </CodeBlock>
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="hp-position">{t('horizonPanel.sections.position')}</h2>
        <p className="body">{t('horizonPanel.positionBody')}</p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {H_POSITIONS.map(p => (
            <button key={p.id} onClick={() => setPosition(p.id)} style={{
              flex: 1, padding: '7px 4px', borderRadius: 7, cursor: 'pointer', fontSize: '0.75rem',
              fontWeight: position === p.id ? 600 : 400,
              background: position === p.id ? '#fff5f5' : 'var(--bg)',
              border: `1px solid ${position === p.id ? 'var(--red)' : 'var(--border)'}`,
              color: position === p.id ? 'var(--red)' : 'var(--mid)',
              transition: 'all 0.1s',
            }}>{p.label}</button>
          ))}
        </div>
        <GuidanceMock position={position} decomposed={false} />
        <div style={{ marginTop: 16 }}>
          <CodeBlock tabs={['Kotlin']}>
            <pre>
              {'horizonPanel.'}<span className="hl-f">setPosition</span>{'('}<span className="hl-t">HorizonPosition</span>{'.'}<span className="hl-n">{position}</span>{')'}
            </pre>
          </CodeBlock>
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="hp-requirements">{t('horizonPanel.sections.requirements')}</h2>
        <table className="prop-table">
          <thead>
            <tr>
              <th>{t('horizonPanel.requirementsTable.colReq')}</th>
              <th>{t('horizonPanel.requirementsTable.colPri')}</th>
              <th>{t('horizonPanel.requirementsTable.colNotes')}</th>
            </tr>
          </thead>
          <tbody>
            {reqRows.map(({ key, pri }) => (
              <tr key={key}>
                <td style={{ fontWeight: 500 }}>{t(`horizonPanel.requirementsTable.rows.${key}.req`)}</td>
                <td>
                  <span style={{
                    fontSize: '0.875rem', fontWeight: 700, padding: '2px 6px', borderRadius: 3,
                    background: pri === 'P0' ? '#fff5f5' : 'var(--bg)',
                    color: pri === 'P0' ? 'var(--red)' : 'var(--muted)',
                    border: `1px solid ${pri === 'P0' ? '#fecaca' : 'var(--border)'}`,
                  }}>{pri}</span>
                </td>
                <td style={{ color: 'var(--mid)', fontSize: '0.875rem' }}>{t(`horizonPanel.requirementsTable.rows.${key}.notes`)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
