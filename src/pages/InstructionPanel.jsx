import { useState } from 'react';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import { ApiLinks } from '../components/ui/ApiLinks';
import PageActions from '../components/ui/PageActions';

/* ─── API references ─────────────────────────────────────────────────────────── */
const NIP_APIS = [
  {
    name: 'Turn-by-Turn Navigation',
    type: 'Android SDK',
    description: 'Start and observe an active navigation session, including route progress, upcoming manoeuvres, and arrival events.',
    pageId: 'navsdk-nav-turn-by-turn', productId: 'navsdk',
  },
  {
    name: 'Voice Instructions',
    type: 'Android SDK',
    description: 'Retrieve structured manoeuvre data and voice instruction strings for custom NIP and audio guidance rendering.',
    pageId: 'navsdk-nav-voice', productId: 'navsdk',
  },
  {
    name: 'Navigation Quickstart',
    type: 'Android SDK',
    description: 'Minimal setup to start an active navigation session and observe progress events.',
    pageId: 'navsdk-nav-quickstart', productId: 'navsdk',
  },
];

const NIP_POSITIONS = [
  { id: 'TOP_LEFT',     label: 'Top Left',     anchor: { top: 0, left: 0 },   isBottom: false },
  { id: 'TOP_CENTER',   label: 'Top Center',   anchor: { top: 0, left: '50%', transform: 'translateX(-50%)' }, isBottom: false },
  { id: 'TOP_RIGHT',    label: 'Top Right',    anchor: { top: 0, right: 0 },  isBottom: false },
  { id: 'BOTTOM_LEFT',  label: 'Bottom Left',  anchor: { bottom: 0, left: 0 }, isBottom: true },
  { id: 'BOTTOM_RIGHT', label: 'Bottom Right', anchor: { bottom: 0, right: 0 }, isBottom: true },
];

export function NIPMock({ position }) {
  const pos = NIP_POSITIONS.find(p => p.id === position);
  const { isBottom, anchor } = pos;
  const radius = isBottom
    ? { borderRadius: '8px 8px 0 0', borderBottom: 'none' }
    : { borderRadius: '0 0 8px 8px', borderTop: 'none' };

  return (
    <div style={{ width: '100%', height: 320, background: '#0c1318', borderRadius: 20, border: '1px solid rgba(255,255,255,0.12)', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#1a2535,#0f1a28)' }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 300 200" fill="none">
          <path d="M20 110 Q80 75 150 105 T280 95" stroke="#e2001a" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
          <path d="M85 0 L90 200" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
          <path d="M215 0 L210 200" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
        </svg>
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: 10, height: 10, borderRadius: '50%', background: '#e2001a', boxShadow: '0 0 0 4px rgba(226,0,26,0.3)' }} />
      </div>
      <div style={{
        position: 'absolute', ...anchor, ...radius,
        background: '#1a3d2b', padding: '14px 20px',
        display: 'flex', alignItems: 'center', gap: 16,
        minWidth: 220, border: '1px solid rgba(255,255,255,0.1)',
      }}>
        <span style={{ fontSize: '2rem', color: 'white' }}>↖</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>1.2 mi</div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)' }}>Oak Street North</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.35)' }}>then</div>
          <div style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.6)' }}>↗</div>
        </div>
      </div>
    </div>
  );
}

export default function InstructionPanel({ onNavigate }) {
  const [position, setPosition] = useState('TOP_LEFT');

  return (
    <div className="page">
      <div className="page-header">
        <h1>Next Instruction Panel</h1>
        <PageActions />
      </div>

      <div className="quick-answer">
        Set where the upcoming-manoeuvre panel appears on screen — five anchor positions, expanding toward available space.
      </div>

      <ApiLinks items={NIP_APIS} onNavigate={onNavigate} />

      <div className="zone">
        <h2 className="sh" id="nip-overview">Overview</h2>
        <p className="body">
          The NIP is the most prominent element in the guidance view — it shows the upcoming
          instruction, street name, distance to manoeuvre, and a secondary preview of the
          instruction after next.
        </p>
        <p className="body">
          The NIP is one of the three components that make up the Horizon Panel. When the
          Horizon Panel is decomposed, the NIP can be positioned independently of the ETA
          Panel and Upcoming Events Panel.
        </p>
        <Callout type="info">
          Any UI triggered from the NIP — such as the full instruction list — expands toward
          the available viewable area. Top-anchored positions expand downward; bottom-anchored
          positions expand upward.
        </Callout>
      </div>

      <div className="zone">
        <h2 className="sh" id="nip-position">Position</h2>
        <p className="body">
          Choose from five positions. The preview and Kotlin configuration update live.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginBottom: 16 }}>
          {NIP_POSITIONS.map(p => (
            <button key={p.id} onClick={() => setPosition(p.id)} style={{
              padding: '6px 4px', borderRadius: 7, cursor: 'pointer', fontSize: '0.875rem',
              fontWeight: position === p.id ? 600 : 400,
              background: position === p.id ? '#fff5f5' : 'var(--bg)',
              border: `1px solid ${position === p.id ? 'var(--red)' : 'var(--border)'}`,
              color: position === p.id ? 'var(--red)' : 'var(--mid)',
              transition: 'all 0.1s',
            }}>{p.label}</button>
          ))}
        </div>
        <NIPMock position={position} />
        <div style={{ marginTop: 16 }}>
          <CodeBlock tabs={['Kotlin']}>
            <pre>
              {'nextInstructionPanel.'}<span className="hl-f">setPosition</span>{'(\n'}
              {'    '}<span className="hl-t">NIPosition</span>{'.'}<span className="hl-n">{position}</span>{'\n)'}
            </pre>
          </CodeBlock>
        </div>
      </div>

      <div className="zone">
        <h2 className="sh" id="nip-requirements">Requirements</h2>
        <table className="prop-table">
          <thead><tr><th>Requirement</th><th>Priority</th><th>Notes</th></tr></thead>
          <tbody>
            {[
              ['Theme the NIP',                              'P0',          'Colors, typography, icon assets, spacing, radius, border, docked/floating — carry-over from ANA'],
              ['Position NIP top, anchored left/right',     'P0',          'Part of VW group UX vision; very popular market request'],
              ['Position NIP top, center aligned',          'P0',          'Part of VW group UX vision'],
              ['Position NIP bottom, anchored left/right',  'P2',          'Nice to have'],
              ['Toggle on/off NIP content fields',          'OUT OF SCOPE', 'No demand; rely on adaptiveness instead'],
            ].map(([req, pri, notes]) => (
              <tr key={req}>
                <td style={{ fontWeight: 500 }}>{req}</td>
                <td>
                  <span style={{
                    fontSize: '0.875rem', fontWeight: 700, padding: '2px 6px', borderRadius: 3,
                    background: pri === 'P0' ? '#fff5f5' : 'var(--bg)',
                    color: pri === 'P0' ? 'var(--red)' : 'var(--muted)',
                    border: `1px solid ${pri === 'P0' ? '#fecaca' : 'var(--border)'}`,
                  }}>{pri}</span>
                </td>
                <td style={{ color: 'var(--mid)', fontSize: '0.875rem' }}>{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
