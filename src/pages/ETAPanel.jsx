import { useState } from 'react';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import { ApiLinks } from '../components/ui/ApiLinks';

/* ─── API references ─────────────────────────────────────────────────────────── */
const ETA_APIS = [
  {
    name: 'Continuous Replanning',
    type: 'Android SDK',
    description: 'Listen for automatic route updates triggered by traffic, diversions, or off-route events — and receive updated ETA data in real time.',
    url: 'https://developer.tomtom.com/navigation/android/guides/navigation/continuous-replanning',
  },
];

const POSITIONS = [
  { id: 'TOP_LEFT',      label: 'Top Left',      anchor: { top: 8, left: 8 } },
  { id: 'TOP_CENTER',    label: 'Top Center',    anchor: { top: 8, left: '50%', transform: 'translateX(-50%)' } },
  { id: 'TOP_RIGHT',     label: 'Top Right',     anchor: { top: 8, right: 8 } },
  { id: 'BOTTOM_LEFT',   label: 'Bottom Left',   anchor: { bottom: 8, left: 8 } },
  { id: 'BOTTOM_CENTER', label: 'Bottom Center', anchor: { bottom: 8, left: '50%', transform: 'translateX(-50%)' } },
  { id: 'BOTTOM_RIGHT',  label: 'Bottom Right',  anchor: { bottom: 8, right: 8 } },
];

export const CONTENT_FIELDS = [
  { id: 'eta',      label: 'ETA',             value: '14:32', prop: 'showEta' },
  { id: 'time',     label: 'Travel time',     value: '18 min', prop: 'showTravelTime' },
  { id: 'distance', label: 'Travel distance', value: '6.4 km', prop: 'showDistance' },
  { id: 'soc',      label: 'Battery SoC',     value: '74% 🔋', prop: 'showBatterySoc' },
  { id: 'end',      label: 'End route button', value: '✕',     prop: 'showEndRoute' },
];

export function ETAMock({ position, visibleFields }) {
  const pos = POSITIONS.find(p => p.id === position);
  return (
    <div style={{ width: '100%', height: 300, background: '#0c1318', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#1a2535,#0f1a28)' }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 300 190" fill="none">
          <path d="M20 100 Q80 70 150 100 T280 90" stroke="#e2001a" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
          <path d="M80 0 L85 190" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
          <path d="M210 0 L205 190" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
        </svg>
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: 8, height: 8, borderRadius: '50%', background: '#e2001a', boxShadow: '0 0 0 3px rgba(226,0,26,0.3)' }} />
      </div>
      <div style={{
        position: 'absolute', ...pos.anchor,
        background: 'rgba(15,26,40,0.93)', borderRadius: 10,
        padding: '12px 16px', border: '1px solid rgba(255,255,255,0.12)',
        display: 'flex', alignItems: 'center', gap: 16, minWidth: 120,
      }}>
        {visibleFields.length === 0
          ? <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.2)' }}>all hidden</span>
          : visibleFields.map(f => (
            <div key={f.id} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#e2e8f0', lineHeight: 1 }}>{f.value}</div>
              <div style={{ fontSize: '0.62rem', color: '#64748b', marginTop: 3 }}>{f.label}</div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default function ETAPanel() {
  const [position, setPosition] = useState('BOTTOM_LEFT');
  const [hiddenFields, setHiddenFields] = useState(['soc']);

  const toggleField = id => setHiddenFields(h => h.includes(id) ? h.filter(x => x !== id) : [...h, id]);
  const visibleFields = CONTENT_FIELDS.filter(f => !hiddenFields.includes(f.id));

  return (
    <div className="page">
      <div className="page-header">
        <h1>ETA Panel</h1>
        <div className="page-meta">
          <span className="meta-tag private">Private</span>
          <span className="meta-tag">v0.1 · Q2 2026</span>
        </div>
      </div>

      <div className="quick-answer">
        <strong>ETA Panel</strong> — shows route progress information (arrival time, travel
        time, distance, battery SoC) during active guidance. Position and visible fields are
        fully configurable by the OEM.
      </div>

      <ApiLinks items={ETA_APIS} />

      <div className="zone">
        <h2 className="sh" id="eta-overview">Overview</h2>
        <p className="body">
          The ETA Panel is active during the guidance navigation state. It is a standalone
          panel that can be positioned independently of the Next Instruction Panel and Horizon
          Panel. When the user taps the ETA Panel it expands to show route options — the
          expansion direction follows the configured anchor position.
        </p>
        <Callout type="info">
          The ETA Panel is one of three components that make up the Horizon Panel in its
          composed state. See <strong>Horizon Panel</strong> for the composite view and
          decomposition options.
        </Callout>
      </div>

      <div className="zone">
        <h2 className="sh" id="eta-position">Position</h2>
        <p className="body">
          Choose from six anchor positions. The route options panel expands downward when
          top-anchored and upward when bottom-anchored.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 16 }}>
          {POSITIONS.map(p => (
            <button key={p.id} onClick={() => setPosition(p.id)} style={{
              padding: '6px 4px', borderRadius: 7, cursor: 'pointer', fontSize: '0.72rem',
              fontWeight: position === p.id ? 600 : 400,
              background: position === p.id ? '#fff5f5' : 'var(--bg)',
              border: `1px solid ${position === p.id ? 'var(--red)' : 'var(--border)'}`,
              color: position === p.id ? 'var(--red)' : 'var(--mid)',
              transition: 'all 0.1s',
            }}>{p.label}</button>
          ))}
        </div>
        <ETAMock position={position} visibleFields={visibleFields} />
        <div style={{ marginTop: 16 }}>
          <CodeBlock tabs={['Kotlin']}>
            <pre>
              {'etaPanel.'}<span className="hl-f">setPosition</span>{'('}<span className="hl-t">ETAPosition</span>{'.'}<span className="hl-n">{position}</span>{')'}
            </pre>
          </CodeBlock>
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="eta-content">Content fields</h2>
        <p className="body">
          Toggle individual fields on or off. The panel width adapts to the visible set.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 16 }}>
          {CONTENT_FIELDS.map(f => {
            const hidden = hiddenFields.includes(f.id);
            return (
              <div key={f.id} onClick={() => toggleField(f.id)} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
                borderRadius: 7, cursor: 'pointer',
                background: hidden ? 'var(--bg)' : '#fff',
                border: '1px solid var(--border)', opacity: hidden ? 0.5 : 1,
                transition: 'all 0.12s',
              }}>
                <div style={{ width: 32, height: 18, borderRadius: 9, background: hidden ? 'var(--border)' : 'var(--red)', transition: 'background 0.15s', position: 'relative', flexShrink: 0 }}>
                  <div style={{ position: 'absolute', top: 2, left: hidden ? 2 : 14, width: 14, height: 14, borderRadius: '50%', background: 'white', transition: 'left 0.15s' }} />
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>{f.label}</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.68rem', color: hidden ? 'var(--muted)' : '#16a34a', fontWeight: 600 }}>{hidden ? 'hidden' : 'shown'}</span>
              </div>
            );
          })}
        </div>
        <ETAMock position={position} visibleFields={visibleFields} />
        <div style={{ marginTop: 16 }}>
          <CodeBlock tabs={['Kotlin']}>
            <pre>
              {'etaPanel.'}<span className="hl-f">setContent</span>{'(\n'}
              {'    '}<span className="hl-t">ETAContent</span>{'(\n'}
              {CONTENT_FIELDS.map(f => (
                <span key={f.id}>
                  {'        '}<span className="hl-f">{f.prop}</span>{' = '}<span className="hl-n">{hiddenFields.includes(f.id) ? 'false' : 'true'}</span>{',\n'}
                </span>
              ))}
              {'    )\n)'}
            </pre>
          </CodeBlock>
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="eta-requirements">Requirements</h2>
        <table className="prop-table">
          <thead><tr><th>Requirement</th><th>Priority</th><th>Notes</th></tr></thead>
          <tbody>
            {[
              ['Theme the ETA panel',                'P0', 'Colors, typography, icon assets, spacing, radius, border, docked/floating — carry-over from ANA'],
              ['Change position of ETA panel',       'P0', 'Top/bottom × left/center/right — very popular market request, part of VW group UX vision'],
              ['Show/hide ETA field',                'P1', 'Toggle individual content fields'],
              ['Show/hide Travel time',              'P1', 'Toggle individual content fields'],
              ['Show/hide Travel distance',          'P1', 'Toggle individual content fields'],
              ['Show/hide Battery SoC',              'P1', 'Toggle individual content fields'],
              ['Show/hide End route button',         'P1', 'Toggle individual content fields'],
              ['Move End route button to opposite side', 'P1', 'Part of VW group UX vision'],
              ['Full layout control within ETA panel', 'P2', 'CSS-like control via Jetpack Compose; discovery required'],
            ].map(([req, pri, notes]) => (
              <tr key={req}>
                <td style={{ fontWeight: 500 }}>{req}</td>
                <td>
                  <span style={{
                    fontSize: '0.68rem', fontWeight: 700, padding: '2px 6px', borderRadius: 3,
                    background: pri === 'P0' ? '#fff5f5' : 'var(--bg)',
                    color: pri === 'P0' ? 'var(--red)' : 'var(--muted)',
                    border: `1px solid ${pri === 'P0' ? '#fecaca' : 'var(--border)'}`,
                  }}>{pri}</span>
                </td>
                <td style={{ color: 'var(--mid)', fontSize: '0.82rem' }}>{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
