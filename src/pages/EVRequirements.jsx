import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Callout from '../components/ui/Callout';
import PageActions from '../components/ui/PageActions';
import { ApiLinks } from '../components/ui/ApiLinks';

const REQUIREMENTS_APIS = [
  { name: 'Vehicle Integration API',          type: 'Android SDK', description: 'Vehicle battery, consumption, connector, and auxiliary power parameters supplied via VehicleInfoManager.', url: 'https://docs.tomtom.com/automotive-solutions/en/guides/ev-integration' },
  { name: 'Navigation SDK — Vehicle module',  type: 'Android SDK', description: 'com.tomtom.sdk.vehicle:vehicle-provider — VehicleProvider and live SoC update API.', url: 'https://docs.tomtom.com/navigation/android/guides/navigation/vehicle' },
  { name: 'Navigation SDK — Search module',   type: 'Android SDK', description: 'com.tomtom.sdk.search:search-ev — EV Search and POI Details APIs for station discovery.', url: 'https://docs.tomtom.com/navigation/android/guides/search/ev-search' },
  { name: 'Long Distance EV Routing API',     type: 'REST API',    description: 'REST endpoint for multi-stop route planning with automatic charging stop insertion.', pageId: 'ldevr-calculate-route', productId: 'ldevr' },
];

const DEPS = [
  ['vehicleLib',    'Vehicle Integration Library',              'com.tomtom.sdk.vehicle:vehicle-integration-api'],
  ['vehicleModule', 'Navigation SDK — Vehicle module',         'com.tomtom.sdk.vehicle:vehicle-provider:2.2.0'],
  ['searchModule',  'Navigation SDK — Search module',          'com.tomtom.sdk.search:search-ev:2.2.0'],
  ['ldevrApi',      'LDEVR REST API',                         'api.tomtom.com/routing/1/calculateLongDistanceEVRoute'],
  ['evSearch',      'EV Search API',                          'Included in Navigation SDK search module'],
  ['bms',           'Vehicle BMS / SoC feed',                 'OEM-provided. Update frequency: 1 Hz minimum.'],
  ['internet',      'Active internet connection',             'Required for LDEVR and real-time station availability.'],
  ['weight',        'Vehicle weight',                         'Hardcoded at 2000 kg — cannot be overridden.'],
];

const PERMISSIONS = [
  ['android.permission.INTERNET',                 'Required', 'LDEVR API + real-time station data'],
  ['android.permission.ACCESS_NETWORK_STATE',     'Required', 'Online/offline provider switching'],
  ['android.permission.ACCESS_FINE_LOCATION',     'Required', 'Geo-bias for charging station search'],
  ['com.tomtom.sdk.VEHICLE_INTEGRATION',          'Required', 'VehicleInfoManager BMS bridge'],
];

function Checklist({ t }) {
  const steps = [
    { phase: t('requirements.checklist.phase1'), items: [
      { id: 'dep-vehicle',  text: t('requirements.checklist.items.depVehicle') },
      { id: 'dep-search',   text: t('requirements.checklist.items.depSearch') },
      { id: 'permissions',  text: t('requirements.checklist.items.permissions') },
    ]},
    { phase: t('requirements.checklist.phase2'), items: [
      { id: 'bms-connect',  text: t('requirements.checklist.items.bmsConnect') },
      { id: 'battery-params',text: t('requirements.checklist.items.batteryParams') },
      { id: 'consumption',  text: t('requirements.checklist.items.consumption') },
      { id: 'connectors',   text: t('requirements.checklist.items.connectors') },
    ]},
    { phase: t('requirements.checklist.phase3'), items: [
      { id: 'vehicle-provider', text: t('requirements.checklist.items.vehicleProvider') },
      { id: 'soc-init',      text: t('requirements.checklist.items.socInit') },
      { id: 'soc-update',    text: t('requirements.checklist.items.socUpdate') },
    ]},
    { phase: t('requirements.checklist.phase4'), items: [
      { id: 'ev-search',    text: t('requirements.checklist.items.evSearch') },
      { id: 'msp',          text: t('requirements.checklist.items.msp') },
      { id: 'ldevr',        text: t('requirements.checklist.items.ldevr') },
    ]},
    { phase: t('requirements.checklist.phase5'), items: [
      { id: 'soc-strip',    text: t('requirements.checklist.items.socStrip') },
      { id: 'range-ring',   text: t('requirements.checklist.items.rangeRing') },
      { id: 'horizon-stop', text: t('requirements.checklist.items.horizonStop') },
      { id: 'reroute',      text: t('requirements.checklist.items.reroute') },
    ]},
  ];

  const allIds = steps.flatMap(s => s.items.map(i => i.id));
  const [checked, setChecked] = useState(new Set());
  const toggle = id => setChecked(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const pct = Math.round((checked.size / allIds.length) * 100);

  return (
    <div>
      {/* Progress bar */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--black)' }}>{t('requirements.checklist.progress')}</span>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: pct === 100 ? '#10b981' : '#3b82f6' }}>{checked.size}/{allIds.length}</span>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: 'var(--border)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? '#10b981' : '#3b82f6', borderRadius: 3, transition: 'width 0.3s ease' }} />
        </div>
      </div>

      {steps.map((phase, pi) => (
        <div key={phase.phase} style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--red)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>{pi + 1}</div>
            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--black)' }}>{phase.phase}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 32 }}>
            {phase.items.map(item => (
              <label key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                <div
                  onClick={() => toggle(item.id)}
                  style={{
                    width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1,
                    background: checked.has(item.id) ? '#10b981' : 'var(--white)',
                    border: `1.5px solid ${checked.has(item.id) ? '#10b981' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s', cursor: 'pointer',
                  }}
                >
                  {checked.has(item.id) && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: '0.875rem', color: checked.has(item.id) ? 'var(--muted)' : 'var(--black)', textDecoration: checked.has(item.id) ? 'line-through' : 'none', lineHeight: 1.5, transition: 'all 0.15s' }}>
                  {item.text}
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {pct === 100 && (
        <div style={{ padding: '12px 16px', borderRadius: 20, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', fontSize: '0.875rem', color: '#10b981', fontWeight: 600 }}>
          ✅ {t('requirements.checklist.complete')}
        </div>
      )}
    </div>
  );
}

export default function EVRequirements({ onNavigate }) {
  const { t } = useTranslation('ev');

  return (
    <div className="page">
      <div className="page-header">
        <h1>{t('requirements.title')}</h1>
        <PageActions />
      </div>
      <div className="quick-answer">{t('requirements.intro')}</div>

      <ApiLinks items={REQUIREMENTS_APIS} onNavigate={onNavigate} />

      {/* Integration checklist */}
      <div className="zone">
        <h2 className="sh" id="evreq-checklist">{t('requirements.checklist.heading')}</h2>
        <p className="body">{t('requirements.checklist.body')}</p>
        <Checklist t={t} />
      </div>

      {/* SDK dependencies */}
      <div className="zone">
        <h2 className="sh" id="evreq-deps">{t('requirements.heading')}</h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="prop-table">
            <thead>
              <tr><th>{t('requirements.colDep')}</th><th>{t('requirements.colVersion')}</th></tr>
            </thead>
            <tbody>
              {DEPS.map(([key, label, detail]) => (
                <tr key={key}>
                  <td>{label}</td>
                  <td><code style={{ fontSize: '0.75rem' }}>{detail}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Android permissions */}
      <div className="zone">
        <h2 className="sh" id="evreq-permissions">{t('requirements.permissions.heading')}</h2>
        <p className="body">{t('requirements.permissions.body')}</p>
        <div style={{ overflowX: 'auto' }}>
          <table className="prop-table">
            <thead>
              <tr><th>{t('requirements.permissions.colPermission')}</th><th>{t('requirements.permissions.colRequired')}</th><th>{t('requirements.permissions.colReason')}</th></tr>
            </thead>
            <tbody>
              {PERMISSIONS.map(([perm, req, reason]) => (
                <tr key={perm}>
                  <td><code style={{ fontSize: '0.75rem' }}>{perm}</code></td>
                  <td><span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--red)' }}>{req}</span></td>
                  <td style={{ color: 'var(--mid)' }}>{reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout type="warn">{t('requirements.permissions.callout')}</Callout>
      </div>

      <div className="feedback-strip">
        Was this page helpful?
        <button>👍 Yes</button>
        <button>👎 No</button>
      </div>
    </div>
  );
}
