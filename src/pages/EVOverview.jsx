import { useTranslation } from 'react-i18next';
import PageActions from '../components/ui/PageActions';
import { ApiLinks } from '../components/ui/ApiLinks';

const EV_APIS = [
  { name: 'Vehicle Integration API',       type: 'Android SDK', description: 'Send battery, consumption, and connector data from BMS to the Navigation SDK.', url: 'https://docs.tomtom.com/automotive-solutions/en/guides/ev-integration' },
  { name: 'Navigation SDK — Vehicle',      type: 'Android SDK', description: 'Set and update vehicle type, charge level, and listen for state changes.',       url: 'https://docs.tomtom.com/navigation/android/guides/navigation/vehicle' },
  { name: 'Long Distance EV Routing API',  type: 'REST API',    description: 'Calculate multi-stop routes with automatic charging stop planning.',             pageId: 'ldevr-calculate-route', productId: 'ldevr' },
  { name: 'EV Search',                     type: 'Android SDK', description: 'Find compatible charging stations with power, connector, and availability filters.', url: 'https://docs.tomtom.com/navigation/android/guides/search/ev-search' },
  { name: 'EV POI Details',                type: 'Android SDK', description: 'Retrieve real-time connector availability and payment details by Place ID.',       url: 'https://docs.tomtom.com/navigation/android/guides/search/ev-poi-details' },
  { name: 'EV Routing — Consumption Model',type: 'REST API',    description: 'Reference for battery curve, consumption curve, and efficiency parameter constraints.', pageId: 'routing-calculate-route', productId: 'routing-api' },
];

const SECTIONS = [
  { id: 'ev-battery',         icon: '🔋', color: '#3b82f6' },
  { id: 'ev-charging-search', icon: '🔌', color: '#10b981' },
  { id: 'ev-routing',         icon: '🗺️', color: '#8b5cf6' },
  { id: 'ev-nav-ui',          icon: '📊', color: '#f59e0b' },
  { id: 'ev-requirements',    icon: '✅', color: '#6b7280' },
];

/* ─── Architecture stack ─────────────────────────────────────────────────────── */
function ArchStack() {
  const layers = [
    { label: 'Vehicle BMS',            note: 'State of charge, voltage, temperature', badge: 'OEM',    side: 'oem' },
    { label: 'Vehicle Integration API',note: 'VehicleInfoManager — bridges BMS into SDK', badge: 'TomTom', side: 'tt' },
    { label: 'Navigation SDK',         note: 'VehicleProvider — single source of truth', badge: 'TomTom', side: 'tt' },
  ];
  const outputs = [
    { label: 'EV Search API',    note: 'Connector-matched station search',    badge: 'TomTom' },
    { label: 'LDEVR API',        note: 'Automatic charging stop planning',    badge: 'TomTom' },
    { label: 'In-Nav UI',        note: 'SoC strip, range ring, horizon stop', badge: 'OEM+TT' },
  ];

  return (
    <div style={{ maxWidth: 560, margin: '20px 0' }}>
      {layers.map((l, i) => (
        <div key={l.label}>
          <div className={`adas-stack-layer ${l.side === 'oem' ? 'adas-stack-oem' : 'adas-stack-highlight'}`}
            style={{ borderRadius: i === 0 ? '8px 8px 0 0' : i === layers.length - 1 ? '0 0 0 0' : 0 }}>
            <div className="adas-stack-text">
              <span className="adas-stack-label">{l.label}</span>
              <span className="adas-stack-note">{l.note}</span>
            </div>
            <span className={`adas-stack-badge ${l.side === 'oem' ? 'adas-stack-badge-oem' : 'adas-stack-badge-tt'}`}>{l.badge}</span>
          </div>
          {i < layers.length - 1 && <div className="adas-stack-arrow">↓</div>}
        </div>
      ))}
      <div className="adas-stack-arrow">↓</div>
      <div className="adas-stack-outputs">
        {outputs.map(o => (
          <div key={o.label} className="adas-stack-output adas-stack-output-tt">
            <span className="adas-stack-label">{o.label}</span>
            <span className="adas-stack-note">{o.note}</span>
            <span className={`adas-stack-badge ${o.badge === 'OEM+TT' ? 'adas-stack-badge-oem' : 'adas-stack-badge-tt'}`}>{o.badge}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EVOverview({ onNavigate }) {
  const { t } = useTranslation('ev');

  return (
    <div className="page">
      <div className="page-header">
        <h1>{t('overview.title')}</h1>
        <PageActions />
      </div>

      <div className="quick-answer">{t('overview.intro')}</div>

      <ApiLinks items={EV_APIS} onNavigate={onNavigate} />

      {/* Architecture */}
      <div className="zone">
        <h2 className="sh" id="evo-arch">{t('overview.arch.heading')}</h2>
        <p className="body">{t('overview.arch.body')}</p>
        <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
          <ArchStack />
        </div>
        <p className="body" style={{ marginTop: 16 }}>{t('overview.arch.body2')}</p>
      </div>

      {/* In-drive monitoring loop */}
      <div className="zone">
        <h2 className="sh" id="evo-monitoring">{t('overview.monitoring.heading')}</h2>
        <p className="body">{t('overview.monitoring.body')}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 16 }}>
          {[
            { trigger: 'SoC updated (1 Hz from BMS)', action: 'SDK updates range ring and verifies charging stop plan is still reachable.', severity: 'normal' },
            { trigger: 'Consumption diverges from model', action: 'Arrival SoC estimate revised. If a stop becomes unreachable, nearest compatible charger substituted.', severity: 'warn' },
            { trigger: 'SoC drops below minChargeAtChargingStops', action: 'Route re-evaluated. New charging stop inserted ahead of current position.', severity: 'warn' },
            { trigger: 'Driver skips a planned charging stop', action: 'Full route recalculated from current position. SoC at destination re-evaluated with updated stop sequence.', severity: 'warn' },
            { trigger: 'betterRoute detected during navigation', action: 'SDK may suggest route replacement with fewer or faster stops if traffic or consumption data improves the plan.', severity: 'info' },
          ].map(({ trigger, action, severity }, i, arr) => {
            const colors = { normal: '#3fb950', warn: '#d29922', info: '#58a6ff' };
            const c = colors[severity];
            return (
              <div key={trigger} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: c, border: `2px solid ${c}`, marginTop: 6, flexShrink: 0 }} />
                  {i < arr.length - 1 && <div style={{ width: 2, height: 40, background: 'var(--border)', margin: '2px 0' }} />}
                </div>
                <div style={{ paddingBottom: i < arr.length - 1 ? 0 : 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: c, marginBottom: 2 }}>{trigger}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.55, marginBottom: i < arr.length - 1 ? 16 : 0 }}>{action}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section guide */}
      <div className="zone">
        <h2 className="sh" id="evo-guide">{t('overview.guide.heading')}</h2>
        <p className="body">{t('overview.guide.body')}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10, marginTop: 14 }}>
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => onNavigate && onNavigate(s.id)}
              style={{
                padding: '14px 16px', borderRadius: 20, textAlign: 'left', cursor: 'pointer',
                border: `1.5px solid var(--border)`, background: 'var(--white)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.background = `${s.color}0d`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--white)'; }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--black)', marginBottom: 4 }}>
                {t(`overview.sections.${s.id.replace('ev-', '').replace(/-/g, '_')}.label`)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.5 }}>
                {t(`overview.sections.${s.id.replace('ev-', '').replace(/-/g, '_')}.desc`)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Integration order */}
      <div className="zone">
        <h2 className="sh" id="evo-order">{t('overview.order.heading')}</h2>
        <p className="body">{t('overview.order.body')}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 12 }}>
          {[0,1,2,3,4].map(i => (
            <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--red)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                {i < 4 && <div style={{ width: 2, height: 28, background: 'var(--border)', margin: '2px 0' }} />}
              </div>
              <div style={{ paddingTop: 6, paddingBottom: i < 4 ? 0 : 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--black)', marginBottom: 2 }}>{t(`overview.order.steps.s${i}.title`)}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.55, marginBottom: i < 4 ? 16 : 0 }}>{t(`overview.order.steps.s${i}.desc`)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="feedback-strip">
        Was this page helpful?
        <button>👍 Yes</button>
        <button>👎 No</button>
      </div>
    </div>
  );
}
