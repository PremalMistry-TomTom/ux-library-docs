import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import PageActions from '../components/ui/PageActions';
import { ApiLinks } from '../components/ui/ApiLinks';
import { EVSearchMock, StationDetailMock } from './EVSupport';
import { useDemoStyle } from '../hooks/useDemoStyle';

const CHARGING_SEARCH_APIS = [
  { name: 'EV Search',                type: 'Android SDK', description: 'Find compatible charging stations with connector type, power level, availability, and preferred network filters.',  pageId: 'navsdk-search-ev',    productId: 'navsdk' },
  { name: 'EV POI Details',           type: 'Android SDK', description: 'Retrieve real-time connector availability, pricing, and payment options for a specific station by Place ID.',         pageId: 'navsdk-search-find',  productId: 'navsdk' },
  { name: 'Long-Distance EV Routing', type: 'Android SDK', description: 'Route planning with automatic charging stop insertion — depends on EV Search to populate stop candidates.',           pageId: 'ev-routing',          productId: 'ux-library' },
  { name: 'Vehicle & Battery',        type: 'Android SDK', description: 'Battery model and connector profile that filters which stations appear as compatible in EV Search results.',           pageId: 'ev-battery',          productId: 'ux-library' },
];

/* ─── Mock palette is now supplied by useDemoStyle() inside MSPBuilder ─────── */

/* ─── MSP Priority Builder ───────────────────────────────────────────────────── */
const ALL_NETWORKS = [
  { id: 'Ionity',         region: 'EU',      kw: '350 kW' },
  { id: 'Fastned',        region: 'EU',      kw: '300 kW' },
  { id: 'TotalEnergies',  region: 'EU',      kw: '150 kW' },
  { id: 'bp pulse',       region: 'EU/UK',   kw: '150 kW' },
  { id: 'Electra',        region: 'EU',      kw: '300 kW' },
  { id: 'EVgo',           region: 'US',      kw: '350 kW' },
  { id: 'ChargePoint',    region: 'US/EU',   kw: '62 kW'  },
  { id: 'Tesla SC',       region: 'Global',  kw: '250 kW' },
];

export function MSPBuilder({ t }) {
  const M = useDemoStyle();
  const [active, setActive] = useState(['Ionity', 'Fastned', 'TotalEnergies']);

  const toggle = id => {
    setActive(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const moveUp = id => {
    setActive(prev => {
      const i = prev.indexOf(id);
      if (i <= 0) return prev;
      const next = [...prev];
      [next[i - 1], next[i]] = [next[i], next[i - 1]];
      return next;
    });
  };

  const moveDown = id => {
    setActive(prev => {
      const i = prev.indexOf(id);
      if (i < 0 || i >= prev.length - 1) return prev;
      const next = [...prev];
      [next[i], next[i + 1]] = [next[i + 1], next[i]];
      return next;
    });
  };

  const mspArray = JSON.stringify(active, null, 2);
  const code = `POST .../calculateLongDistanceEVRoute/...

{
  "preferredMSPs": ${mspArray},
  // ...battery and connector params
}`;

  return (
    <div>
      <div className="grid-2-col">
        {/* Available networks */}
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: 8, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            {t('chargingSearch.msp.available')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {ALL_NETWORKS.map(n => {
              const on = active.includes(n.id);
              return (
                <div key={n.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 12px', borderRadius: 20,
                  border: `1.5px solid ${on ? M.blue : 'var(--border)'}`,
                  background: on ? `${M.blue}0f` : 'var(--white)',
                  cursor: 'pointer', transition: 'all 0.12s',
                }} onClick={() => toggle(n.id)}>
                  <div style={{
                    width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                    background: on ? M.blue : 'var(--bg)',
                    border: `1.5px solid ${on ? M.blue : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {on && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--black)' }}>{n.id}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>{n.region} · {n.kw}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority order */}
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: 8, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            {t('chargingSearch.msp.priority')}
          </div>
          {active.length === 0 ? (
            <div style={{ padding: '20px 14px', borderRadius: 20, border: '1px dashed var(--border)', color: 'var(--muted)', fontSize: '0.75rem', textAlign: 'center' }}>
              {t('chargingSearch.msp.empty')}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {active.map((id, i) => (
                <div key={id} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 12px', borderRadius: 20,
                  border: `1.5px solid ${M.blue}`,
                  background: `${M.blue}14`,
                }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: M.blue, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                  <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 600, color: 'var(--black)' }}>{id}</span>
                  <div style={{ display: 'flex', gap: 2 }}>
                    <button onClick={() => moveUp(id)} disabled={i === 0} style={{
                      width: 22, height: 22, borderRadius: 4, border: '1px solid var(--border)',
                      background: 'var(--white)', cursor: i === 0 ? 'default' : 'pointer',
                      opacity: i === 0 ? 0.3 : 1, fontSize: '0.875rem', color: 'var(--black)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>↑</button>
                    <button onClick={() => moveDown(id)} disabled={i === active.length - 1} style={{
                      width: 22, height: 22, borderRadius: 4, border: '1px solid var(--border)',
                      background: 'var(--white)', cursor: i === active.length - 1 ? 'default' : 'pointer',
                      opacity: i === active.length - 1 ? 0.3 : 1, fontSize: '0.875rem', color: 'var(--black)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>↓</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: 8, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              {t('chargingSearch.msp.output')}
            </div>
            <CodeBlock language="json" code={code} />
          </div>
        </div>
      </div>
      <Callout type="info">{t('chargingSearch.msp.callout')}</Callout>
    </div>
  );
}

/* ─── Code snippets ─────────────────────────────────────────────────────────── */
const CODE_SEARCH = `val options = EvSearchOptions.Builder()
    .geoBias(GeoPoint(latitude = 48.8566, longitude = 2.3522))
    .radius(Distance.kilometers(5.0))
    .minPower(Power.kilowatts(50.0))
    .connectors(listOf(ConnectorType.CCS))
    .status(Status.Available)
    .accessTypes(listOf(AccessType.Public))
    .limit(10)
    .nearbyPoiCategories(setOf(
        StandardCategoryId.Restaurant,
        StandardCategoryId.CafePub,
    ))
    .build()

search.evSearch(options) { result ->
    when (result) {
        is Success -> result.value.results.forEach { station ->
            val name     = station.place.name
            val distance = station.detour?.distance
            val points   = station.place.details?.chargingPark?.chargingPoints
        }
        is Failure -> handleError(result.failure)
    }
}`;

const CODE_POI_DETAILS = `val options = buildEvPoiDetailsOptions(placeId) {
    locale = Locale.FRANCE
}

when (val result = search.requestEvPoiDetails(options)) {
    is Success -> {
        result.value.evPoiDetails.forEach { details ->
            val connectors     = details.place.details?.chargingPark?.connectors
            val chargingPoints = details.place.details?.chargingPark?.chargingPoints
            // chargingPoints[n].status → Available / Occupied / Unknown
        }
    }
    is Failure -> handleError(result.failure)
}`;

const SEARCH_FILTERS = [
  ['geoBias',             'GeoPoint',               'Search centre coordinates.'],
  ['radius',              'Distance',               'Search radius. e.g. Distance.kilometers(5.0)'],
  ['minPower / maxPower', 'Power (kW)',              'Charging speed range filter.'],
  ['connectors',          'List<ConnectorType>',    'Auto-populated from vehicle profile when set.'],
  ['status',              'Status',                 'Status.Available filters to open connectors only.'],
  ['accessTypes',         'List<AccessType>',       'Public, Restricted, or Private.'],
  ['limit',               'Int',                    'Maximum number of results.'],
  ['nearbyPoiCategories', 'Set<StandardCategoryId>','Restaurant, HotelMotel, CafePub, PublicAmenity, Shop, ParkRecreationArea.'],
];

export default function EVChargingSearch({ onNavigate }) {
  const { t } = useTranslation('ev');
  const [activeFilter, setActiveFilter] = useState('speed');

  return (
    <div className="page">
      <div className="page-header">
        <h1>{t('chargingSearch.title')}</h1>
        <PageActions />
      </div>
      <div className="quick-answer">{t('chargingSearch.intro')}</div>

      <ApiLinks items={CHARGING_SEARCH_APIS} onNavigate={onNavigate} />

      {/* Search & station detail mocks */}
      <div className="zone">
        <h2 className="sh" id="evcs-ui">{t('evSearch.heading')}</h2>
        <p className="body">{t('evSearch.body')}</p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {['speed', 'payment', 'services'].map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{
              padding: '6px 14px', borderRadius: 20, cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600,
              background: activeFilter === f ? 'var(--red)' : 'var(--white)',
              color: activeFilter === f ? '#fff' : 'var(--black)',
              border: activeFilter === f ? '1px solid var(--red)' : '1px solid var(--border)',
              transition: 'all 0.15s',
            }}>{t(`evSearch.${f}Filters`)}</button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <EVSearchMock activeFilter={activeFilter} />
          <StationDetailMock />
        </div>
      </div>

      {/* Search API options */}
      <div className="zone">
        <h2 className="sh" id="evcs-options">{t('evSearch.searchOptions.heading')}</h2>
        <p className="body">{t('evSearch.searchOptions.body')}</p>
        <CodeBlock language="kotlin" code={CODE_SEARCH} />

        <h3 className="sub">{t('evSearch.realtimeDetails.heading')}</h3>
        <p className="body">{t('evSearch.realtimeDetails.body')}</p>
        <CodeBlock language="kotlin" code={CODE_POI_DETAILS} />

        <h3 className="sub">{t('evSearch.filterTable.heading')}</h3>
        <div className="table-scroll">
          <table className="prop-table">
            <thead>
              <tr><th>{t('evSearch.filterTable.colOption')}</th><th>{t('evSearch.filterTable.colType')}</th><th>{t('evSearch.filterTable.colDesc')}</th></tr>
            </thead>
            <tbody>
              {SEARCH_FILTERS.map(([o, ty, d]) => (
                <tr key={o}><td><code>{o}</code></td><td style={{ whiteSpace: 'nowrap' }}>{ty}</td><td>{d}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preferred charging networks */}
      <div className="zone">
        <h2 className="sh" id="evcs-msp">{t('chargingSearch.msp.heading')}</h2>
        <p className="body">{t('chargingSearch.msp.body')}</p>
        <MSPBuilder t={t} />
      </div>

      <div className="feedback-strip">
        Was this page helpful?
        <button>👍 Yes</button>
        <button>👎 No</button>
      </div>
    </div>
  );
}
