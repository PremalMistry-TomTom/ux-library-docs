import { useTranslation } from 'react-i18next';
import PageActions from '../components/ui/PageActions';
import ExampleCard from '../components/ui/ExampleCard';
import { useIlloStyle } from '../context/IlloStyleContext';
import {
  makeThumb,
  L_LDEVRRoute, L_LDEVRBatch,
  L_LDEVRVehicleBrand, L_LDEVROemEmsp, L_LDEVRComputeToll,
  L_LDEVRChargingParks, L_LDEVRWeather, L_LDEVRDataFreshness,
} from '../illustrations/lightVariants';

/* ─── Endpoint thumbnails ────────────────────────────────────────────────────── */
function ThumbEVRoute() {
  return (
    <div style={{ background: '#0c1318', borderRadius: 20, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 130" fill="none">
        <rect width="200" height="130" fill="#1a2535"/>
        <path d="M20 105 Q60 80 90 72 Q110 66 140 58 Q165 50 185 38"
          stroke="#e2001a" strokeWidth="2" strokeLinecap="round" opacity="0.85"/>
        <path d="M20 105 Q60 80 90 72 Q110 66 140 58 Q165 50 185 38"
          stroke="rgba(226,0,26,0.15)" strokeWidth="8" strokeLinecap="round"/>
        {[[90, 72], [140, 58]].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="8" fill="#0d1117" stroke="#22c55e" strokeWidth="1.5"/>
            <text x={cx} y={cy + 3.5} textAnchor="middle" fill="#22c55e" style={{ fontSize: 7, fontWeight: 700 }}>⚡</text>
          </g>
        ))}
        <circle cx="20" cy="105" r="4" fill="#3fb950"/>
        <circle cx="185" cy="38" r="4" fill="#e2001a"/>
      </svg>
      <div style={{ position: 'absolute', bottom: 8, left: 8, right: 8, background: 'rgba(8,14,26,0.9)', borderRadius: 5, padding: '5px 10px', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: '0.5rem', color: '#64748b' }}>Battery</span>
          <span style={{ fontSize: '0.5rem', color: '#22c55e', fontWeight: 700 }}>18% → 78% → 22%</span>
        </div>
        <div style={{ height: 3, background: '#1e293b', borderRadius: 2 }}>
          <div style={{ height: '100%', width: '78%', background: 'linear-gradient(90deg, #22c55e, #3fb950)', borderRadius: 2 }}/>
        </div>
      </div>
    </div>
  );
}

function ThumbBatchEV() {
  const routes = [
    { color: '#22c55e', stops: 2, w: 85 },
    { color: '#3fb950', stops: 1, w: 62 },
    { color: '#58a6ff', stops: 2, w: 91 },
    { color: '#a78bfa', stops: 3, w: 74 },
  ];
  return (
    <div style={{ background: '#0d1117', borderRadius: 20, overflow: 'hidden', height: '100%', padding: '8px 10px' }}>
      <div style={{ fontSize: '0.5rem', color: '#64748b', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Batch EV · 4 routes</div>
      {routes.map((r, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: r.color, flexShrink: 0 }}/>
          <div style={{ flex: 1, height: 3, background: '#1e293b', borderRadius: 2 }}>
            <div style={{ height: '100%', width: `${r.w}%`, background: r.color, borderRadius: 2, opacity: 0.8 }}/>
          </div>
          <span style={{ fontSize: '0.4375rem', color: '#475569', fontFamily: 'monospace', flexShrink: 0 }}>
            {r.stops}⚡
          </span>
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }}/>
        <span style={{ fontSize: '0.5rem', color: '#22c55e' }}>4/4 completed · async</span>
      </div>
    </div>
  );
}

function ThumbVehicleBrand() {
  const brands = [
    { name: 'BMW',   color: '#1c69d4', selected: true  },
    { name: 'Tesla', color: '#cc0000', selected: false },
    { name: 'Audi',  color: '#bb0a14', selected: false },
  ];
  return (
    <div style={{ background: '#0d1117', borderRadius: 20, overflow: 'hidden', height: '100%', padding: '8px 10px' }}>
      <div style={{ fontSize: '0.5rem', color: '#64748b', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Vehicle Brand Lookup</div>
      {brands.map((b, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5, padding: '4px 6px', borderRadius: 5, background: b.selected ? 'rgba(88,166,255,0.08)' : 'transparent', border: b.selected ? '1px solid rgba(88,166,255,0.2)' : '1px solid transparent' }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: b.color, flexShrink: 0 }}/>
          <span style={{ fontSize: '0.5rem', color: b.selected ? '#e2e8f0' : '#64748b', fontWeight: b.selected ? 700 : 400, flex: 1 }}>{b.name}</span>
          {b.selected && <span style={{ fontSize: '0.4375rem', color: '#22c55e' }}>✓</span>}
        </div>
      ))}
      <div style={{ marginTop: 4, padding: '3px 6px', background: 'rgba(255,255,255,0.04)', borderRadius: 3, fontFamily: 'monospace', fontSize: '0.4375rem', color: '#475569' }}>variantId: 54B9…</div>
    </div>
  );
}

function ThumbOemEmsp() {
  const networks = [
    { name: 'Ionity',    kw: '350 kW', compat: true  },
    { name: 'Fastned',   kw: '300 kW', compat: true  },
    { name: 'bp pulse',  kw: '50 kW',  compat: false },
  ];
  return (
    <div style={{ background: '#0d1117', borderRadius: 20, overflow: 'hidden', height: '100%', padding: '8px 10px' }}>
      <div style={{ fontSize: '0.5rem', color: '#64748b', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.06em' }}>OEM EMSP Networks</div>
      {networks.map((n, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: n.compat ? '#22c55e' : '#475569', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.5rem', color: '#fff' }}>{n.compat ? '⚡' : '—'}</span>
          </div>
          <span style={{ fontSize: '0.4375rem', color: n.compat ? '#94a3b8' : '#475569', flex: 1 }}>{n.name}</span>
          <span style={{ fontSize: '0.4375rem', color: n.compat ? '#22c55e' : '#475569', fontFamily: 'monospace' }}>{n.compat ? 'OEM' : '—'}</span>
        </div>
      ))}
    </div>
  );
}

function ThumbComputeTollLDEVR() {
  return (
    <div style={{ background: '#0d1117', borderRadius: 20, overflow: 'hidden', height: '100%', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ fontSize: '0.5rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Compute Toll · EV</div>
      <svg viewBox="0 0 200 55" style={{ width: '100%', height: 55, flexShrink: 0 }} fill="none">
        <path d="M0 38 Q100 34 200 38" stroke="#243040" strokeWidth="8" strokeLinecap="round"/>
        <rect x="98" y="16" width="4" height="28" rx="2" fill="#475569"/>
        <rect x="100" y="16" width="48" height="5" rx="2" fill="#e2001a" opacity="0.85"/>
        <rect x="82" y="10" width="18" height="30" rx="3" fill="#1e293b"/>
        <circle cx="172" cy="22" r="10" fill="rgba(34,197,94,0.1)" stroke="#22c55e" strokeWidth="1.5"/>
        <text x="172" y="26" textAnchor="middle" fill="#22c55e" style={{ fontSize: 8, fontWeight: 700 }}>EV</text>
      </svg>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3 }}>
        {[['Base toll', '€2.40', '#e2e8f0'], ['EV exemption', '–€1.20', '#22c55e'], ['Total', '€1.20', '#58a6ff']].map(([label, val, col]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.4375rem', color: '#475569' }}>{label}</span>
            <span style={{ fontSize: '0.4375rem', fontWeight: 700, color: col, fontFamily: 'monospace' }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ThumbChargingParks() {
  const hours = [['Mon–Fri', '06:00–22:00'], ['Sat', '07:00–21:00'], ['Sun', '08:00–20:00']];
  return (
    <div style={{ background: '#0d1117', borderRadius: 20, overflow: 'hidden', height: '100%', padding: '8px 10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
        <span style={{ fontSize: '0.5rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Park Hours</span>
        <span style={{ fontSize: '0.5rem', color: '#22c55e', fontWeight: 700 }}>12/16 free</span>
      </div>
      {hours.map(([day, hrs], i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, padding: '3px 6px', background: 'rgba(255,255,255,0.04)', borderRadius: 4 }}>
          <span style={{ fontSize: '0.4375rem', color: '#94a3b8' }}>{day}</span>
          <span style={{ fontSize: '0.4375rem', color: '#475569', fontFamily: 'monospace' }}>{hrs}</span>
        </div>
      ))}
    </div>
  );
}

function ThumbWeatherLDEVR() {
  return (
    <div style={{ background: '#0c1318', borderRadius: 20, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 130" fill="none">
        <rect width="200" height="130" fill="#1a2535"/>
        <path d="M20 68 Q60 52 90 48" stroke="#e2001a" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
        <path d="M90 48 Q130 42 165 36" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.8" strokeDasharray="5 3"/>
        {[[90, 48], [140, 42]].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="8" fill="#0d1117" stroke="#22c55e" strokeWidth="1.5"/>
            <text x={cx} y={cy + 3.5} textAnchor="middle" fill="#22c55e" style={{ fontSize: 7, fontWeight: 700 }}>⚡</text>
          </g>
        ))}
        <ellipse cx="128" cy="30" rx="20" ry="10" fill="#475569" opacity="0.4"/>
        {[112, 122, 132, 142].map((x, i) => (
          <line key={i} x1={x} y1={40} x2={x - 3} y2={50} stroke="#58a6ff" strokeWidth="1.2" opacity="0.45" strokeLinecap="round"/>
        ))}
        <circle cx="20" cy="68" r="4" fill="#3fb950"/>
        <circle cx="165" cy="36" r="4" fill="#e2001a"/>
      </svg>
      <div style={{ position: 'absolute', bottom: 8, left: 8, right: 8, background: 'rgba(8,14,26,0.9)', borderRadius: 5, padding: '5px 10px', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.5rem', color: '#e2e8f0' }}>Cold weather · EV</span>
        <span style={{ fontSize: '0.5rem', color: '#fbbf24', fontWeight: 700 }}>–12% range</span>
      </div>
    </div>
  );
}

function ThumbDataFreshnessLDEVR() {
  const items = [
    { label: 'Charger status', pct: 100, color: '#22c55e' },
    { label: 'Park capacity',  pct: 80,  color: '#22c55e' },
    { label: 'Pricing',        pct: 55,  color: '#fbbf24' },
    { label: 'Amenities',      pct: 15,  color: '#f85149' },
  ];
  return (
    <div style={{ background: '#0d1117', borderRadius: 20, overflow: 'hidden', height: '100%', padding: '8px 10px' }}>
      <div style={{ fontSize: '0.5rem', color: '#64748b', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Data Freshness</div>
      {items.map((item) => (
        <div key={item.label} style={{ marginBottom: 6 }}>
          <span style={{ fontSize: '0.4375rem', color: '#64748b', display: 'block', marginBottom: 1 }}>{item.label}</span>
          <div style={{ height: 4, background: '#1e293b', borderRadius: 2 }}>
            <div style={{ height: '100%', width: `${item.pct}%`, background: item.color, borderRadius: 2, opacity: 0.85 }}/>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────────── */
export default function LDEVRIntro({ onNavigate }) {
  const { t } = useTranslation('pages');
  const { theme: illoTheme, palette: illoPalette } = useIlloStyle();

  return (
    <div className="page">
      <div className="page-header">
        <h1>{t('ldevrIntro.title')}</h1>
        <PageActions />
      </div>

      <p className="quick-answer">
        {t('ldevrIntro.quickAnswer')}
      </p>

      {/* Capability tiles — inline under summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10, margin: '20px 0 0' }}>
        {[
          ['🔋', t('ldevrIntro.capabilities.batteryModelling.title'), t('ldevrIntro.capabilities.batteryModelling.desc')],
          ['⚡', t('ldevrIntro.capabilities.stopSelection.title'), t('ldevrIntro.capabilities.stopSelection.desc')],
          ['🔌', t('ldevrIntro.capabilities.connectorMatching.title'), t('ldevrIntro.capabilities.connectorMatching.desc')],
          ['🗺️', t('ldevrIntro.capabilities.trafficEnergy.title'), t('ldevrIntro.capabilities.trafficEnergy.desc')],
        ].map(([icon, title, desc]) => (
          <div key={title} style={{ border: '1px solid var(--border)', borderRadius: 20, padding: '12px 14px', background: 'var(--surface)' }}>
            <div style={{ display: 'flex', gap: 7, alignItems: 'flex-start', marginBottom: 5 }}>
              <span style={{ fontSize: '0.9rem', lineHeight: 1.2 }}>{icon}</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--black)' }}>{title}</span>
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.55 }}>{desc}</div>
          </div>
        ))}
      </div>


      {/* Endpoints */}
      <div className="zone">
        <h2 className="sh" id="ldevr-endpoints">{t('ldevrIntro.endpointsTitle')}</h2>
        <p className="quick-answer" style={{ marginBottom: 20 }}>{t('ldevrIntro.endpointsSubtitle')}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
          {[
            { Thumb: makeThumb(ThumbEVRoute,           L_LDEVRRoute),           method: 'POST', titleKey: 'calculateEvRoute',      path: '/routing/1/calculateLongDistanceEVRoute/{locations}/json',       desc: t('ldevrIntro.endpointDescs.calculateEvRoute'),                                                                                          pageId: 'ldevr-calculate-route' },
            { Thumb: makeThumb(ThumbBatchEV,            L_LDEVRBatch),           method: 'POST', titleKey: 'batchEvRoute',          path: '/routing/1/calculateLongDistanceEVRoute/batch/sync/json',        desc: t('ldevrIntro.endpointDescs.batchEvRoute'),                                                                                                  pageId: 'ldevr-batch'           },
            { Thumb: makeThumb(ThumbVehicleBrand,       L_LDEVRVehicleBrand),    method: 'GET',  titleKey: 'vehicleBrandLookup',    path: '/maps/orbis/routing/v2/vehicles/brands',                         desc: t('ldevrIntro.endpointDescs.vehicleBrandLookup',   { defaultValue: 'Look up registered EV brands and model variants to resolve battery and connector specs automatically.' }), pageId: 'ldevr-vehicle-brand',  tag: 'v2' },
            { Thumb: makeThumb(ThumbOemEmsp,            L_LDEVROemEmsp),         method: 'GET',  titleKey: 'oemEmspSupport',        path: '/maps/orbis/routing/v2/vehicles/emsp',                           desc: t('ldevrIntro.endpointDescs.oemEmspSupport',       { defaultValue: 'Retrieve OEM-contracted EMSP charging networks compatible with the selected vehicle brand.' }),          pageId: 'ldevr-oem-emsp',       tag: 'v2' },
            { Thumb: makeThumb(ThumbComputeTollLDEVR,  L_LDEVRComputeToll),     method: 'POST', titleKey: 'computeTollAmounts',    path: '/maps/orbis/routing/v2/…?computeTravelTimeFor=all',              desc: t('ldevrIntro.endpointDescs.computeTollAmounts',   { defaultValue: 'Include per-road-class toll costs and EV exemptions in the long-distance route response.' }),             pageId: 'ldevr-compute-toll',   tag: 'v2' },
            { Thumb: makeThumb(ThumbChargingParks,      L_LDEVRChargingParks),   method: 'GET',  titleKey: 'chargingParksHours',    path: '/maps/orbis/routing/v2/chargingparks/{id}/hours',                desc: t('ldevrIntro.endpointDescs.chargingParksHours',   { defaultValue: 'Fetch opening hours and real-time availability for a specific charging park along the route.' }),           pageId: 'ldevr-charging-parks', tag: 'v2' },
            { Thumb: makeThumb(ThumbWeatherLDEVR,       L_LDEVRWeather),         method: 'POST', titleKey: 'weatherConsideration',  path: '/maps/orbis/routing/v2/…?weatherConsideration=true',             desc: t('ldevrIntro.endpointDescs.weatherConsideration', { defaultValue: 'Factor in temperature and precipitation data to refine EV range estimates and stop selection.' }),             pageId: 'ldevr-weather',        tag: 'v2' },
            { Thumb: makeThumb(ThumbDataFreshnessLDEVR, L_LDEVRDataFreshness),  method: 'POST', titleKey: 'dynamicDataFreshness',  path: '/maps/orbis/routing/v2/…?dateFreshness=true',                    desc: t('ldevrIntro.endpointDescs.dynamicDataFreshness', { defaultValue: 'Control the freshness of charger-status, park-capacity, and pricing data used during route planning.' }),         pageId: 'ldevr-data-freshness', tag: 'v2' },
          ].map(({ Thumb, method, titleKey, path, desc, pageId, tag }) => (
            <div
              key={pageId}
              className="nav-card"
              onClick={() => onNavigate?.(pageId)}
            >
              <div className="nav-card-thumb" style={illoTheme !== 'dark' ? { background: illoPalette.bg, padding: 0 } : undefined}>
                <Thumb />
              </div>
              <div className="nav-card-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: '0.625rem', fontWeight: 700, padding: '2px 6px', borderRadius: 3, background: 'rgba(88,166,255,0.12)', color: '#58a6ff', fontFamily: 'monospace', letterSpacing: '0.04em' }}>{method}</span>
                  {tag && <span style={{ fontSize: '0.625rem', padding: '1px 5px', borderRadius: 3, background: 'rgba(34,197,94,0.08)', color: '#22c55e', fontWeight: 600 }}>{tag}</span>}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--black)', marginBottom: 3 }}>{t(`ldevrIntro.tableRows.${titleKey}`, { defaultValue: titleKey })}</div>
                <code style={{ display: 'block', fontSize: '0.625rem', color: 'var(--muted)', fontFamily: 'var(--font-mono, monospace)', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{path}</code>
                <div style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.5 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* See demos */}
      <div className="zone">
        <h2 className="sh" id="ldevr-examples">{t('ldevrIntro.demosTitle')}</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--mid)', margin: '0 0 20px', lineHeight: 1.6 }}>
          {t('ldevrIntro.demosIntro').split(t('ldevrIntro.demosIntroLinkText'))[0]}
          <a href="https://docs.tomtom.com/maps-sdk-js/overview" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--red)', textDecoration: 'none', fontWeight: 500 }}>
            {t('ldevrIntro.demosIntroLinkText')}
          </a>
          {t('ldevrIntro.demosIntro').split(t('ldevrIntro.demosIntroLinkText'))[1]}
        </p>
        <div className="examples-grid">

          <ExampleCard
            href="https://docs.tomtom.com/maps-sdk-js/examples/ldevr-model-id"
            title={t('ldevrIntro.exampleTitles.ldevrModelId')}
            description={t('ldevrIntro.exampleDescs.ldevrModelId')}
            tags={[
              { label: t('ldevrIntro.tagLabels.gettingStarted'), variant: 'start' },
              { label: t('ldevrIntro.tagLabels.electricVehicles'), variant: 'feature' },
              { label: t('ldevrIntro.tagLabels.web'), variant: 'platform' },
            ]}
            imgSrc="/example-thumbs/ldevr-model-id.png"
            snippet={`// LDEVR with registered vehicle model
const route = await calculateRoute({
  locations: await Promise.all(
    ['Paris, FR', 'Amsterdam, NL'].map(geocodeOne)
  ),
  vehicle: {
    engineType: 'electric',
    model: {
      // Registered vehicle variant — battery capacity,
      // connector types and consumption curves auto-resolved
      variantId: '54B969E8-E28D-11EC-8FEA-0242AC120002',
    },
    state: {
      currentChargeInkWh: 25,
    },
    preferences: {
      chargingPreferences: {
        minChargeAtDestinationInkWh: 5,
        minChargeAtChargingStopsInkWh: 5,
      },
    },
  },
});
routingModule.showRoutes(route);`}
          />

          <ExampleCard
            href="https://docs.tomtom.com/maps-sdk-js/examples/ldevr-custom-charging-stops"
            title={t('ldevrIntro.exampleTitles.customChargingStops')}
            description={t('ldevrIntro.exampleDescs.customChargingStops')}
            tags={[
              { label: t('ldevrIntro.tagLabels.customisation'), variant: 'custom' },
              { label: t('ldevrIntro.tagLabels.electricVehicles'), variant: 'feature' },
              { label: t('ldevrIntro.tagLabels.web'), variant: 'platform' },
            ]}
            imgSrc="/example-thumbs/ldevr-custom-charging-stops.png"
            snippet={`// Map custom SVG icons to charger speed
const routingModule = await RoutingModule.get(map, {
  chargingStops: {
    // Overlay charging duration on the marker
    text: {
      title: ['format', ['get', 'chargingDuration'],
        { 'text-color': '#243882' }],
    },
    icon: {
      customIcons: [
        { id: 'slow-charger',    image: chargerSlowSVG },
        { id: 'regular-charger', image: chargerRegularSVG },
        { id: 'fast-charger',    image: chargerFastSVG },
      ],
      // 'chargingSpeed' comes from the LDEVR API response
      mapping: {
        basedOn: 'chargingSpeed',
        value: {
          slow:         'slow-charger',
          regular:      'regular-charger',
          fast:         'fast-charger',
          'ultra-fast': 'fast-charger',
        },
      },
    },
  },
});`}
          />

          <ExampleCard
            href="https://docs.tomtom.com/maps-sdk-js/examples/ldevr-detailed-vehicle"
            title={t('ldevrIntro.exampleTitles.ldevrDetailedVehicle')}
            description={t('ldevrIntro.exampleDescs.ldevrDetailedVehicle')}
            tags={[
              { label: t('ldevrIntro.tagLabels.gettingStarted'), variant: 'start' },
              { label: t('ldevrIntro.tagLabels.electricVehicles'), variant: 'feature' },
              { label: t('ldevrIntro.tagLabels.web'), variant: 'platform' },
            ]}
            imgSrc="/example-thumbs/ldevr-detailed-vehicle.png"
            snippet={`// Full vehicle specification — no model variantId needed
const route = await calculateRoute({
  locations: await Promise.all(
    ['Paris, FR', 'Amsterdam, NL'].map(geocodeOne)
  ),
  vehicle: {
    engineType: 'electric',
    // Detailed spec instead of model ID
    maxChargeInkWh: 77.4,
    connectorSet: ['IEC62196Type2Outlet', 'IEC62196Type2CableAttached'],
    auxiliaryPowerInkW: 1.7,
    // Speed-based consumption table (kWh per 100 km)
    consumptionInkWhPer100km: [
      { speed: 50,  consumption: 14.5 },
      { speed: 80,  consumption: 17.0 },
      { speed: 120, consumption: 23.2 },
    ],
    state: { currentChargeInkWh: 20 },
    preferences: {
      chargingPreferences: {
        minChargeAtDestinationInkWh: 5,
        minChargeAtChargingStopsInkWh: 5,
      },
    },
  },
});`}
          />

        </div>
      </div>

      {/* Base URL + auth */}
      <div className="zone">
        <h2 className="sh" id="ldevr-base">{t('ldevrIntro.baseUrlTitle')}</h2>
        <div style={{ border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
          {[
            { label: t('ldevrIntro.baseUrlRows.endpoint'), content: <code style={{ fontSize: '0.875rem', fontFamily: 'monospace', color: 'var(--black)' }}>POST https://api.tomtom.com/routing/1/calculateLongDistanceEVRoute/{'{locations}'}/json</code> },
            { label: t('ldevrIntro.baseUrlRows.auth'), content: <span style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>{t('ldevrIntro.baseUrlRows.authDesc')}</span> },
            { label: t('ldevrIntro.baseUrlRows.method'), content: <span style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>{t('ldevrIntro.baseUrlRows.methodDesc')}</span> },
            { label: t('ldevrIntro.baseUrlRows.planTier'), content: <span style={{ fontSize: '0.875rem', color: 'var(--mid)' }}>{t('ldevrIntro.baseUrlRows.planTierDesc')}</span> },
          ].map(({ label, content }, i, arr) => (
            <div key={label} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ padding: '10px 14px', background: 'var(--bg)', borderRight: '1px solid var(--border)', fontSize: '0.625rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center' }}>{label}</div>
              <div style={{ padding: '10px 14px' }}>{content}</div>
            </div>
          ))}
        </div>
      </div>

      {/* When to use */}
      <div className="zone">
        <h2 className="sh" id="ldevr-when">{t('ldevrIntro.whenTitle')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
          <div style={{ padding: '16px', borderRadius: 20, border: '1px solid #22c55e44', background: 'var(--bg)' }}>
            <div style={{ fontSize: '0.625rem', fontWeight: 700, color: '#22c55e', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>✅ {t('ldevrIntro.whenUseTitle')}</div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {t('ldevrIntro.whenUseItems', { returnObjects: true }).map(item => (
                <li key={item} style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.6, display: 'flex', gap: 7, marginBottom: 3 }}>
                  <span style={{ color: '#22c55e', flexShrink: 0 }}>›</span> {item}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ padding: '16px', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--bg)' }}>
            <div style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t('ldevrIntro.whenNotTitle')}</div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {t('ldevrIntro.whenNotItems', { returnObjects: true }).map(item => (
                <li key={item} style={{ fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.6, display: 'flex', gap: 7, marginBottom: 3 }}>
                  <span style={{ color: 'var(--muted)', flexShrink: 0 }}>›</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Version comparison table */}
      <div className="zone">
        <h2 className="sh" id="ldevr-platforms">{t('ldevrIntro.versionsTitle')}</h2>
        {(() => {
          const V1 = { label: t('ldevrIntro.versionLabels.v1'), status: t('ldevrIntro.versionStatuses.production'),     statusColor: '#15803d', statusBg: 'rgba(34,197,94,0.12)',  color: '#15803d' };
          const V2 = { label: t('ldevrIntro.versionLabels.v2'), status: t('ldevrIntro.versionStatuses.privatePreview'), statusColor: '#92400e', statusBg: 'rgba(234,179,8,0.12)', color: '#92400e' };
          const Y = '✓'; const N = '—';
          const rows = [
            { label: t('ldevrIntro.tableRows.mapPlatform'),          v1: 'TomTom Maps',                               v2: 'Orbis Maps'                                       },
            { label: t('ldevrIntro.tableRows.baseEndpoint'),         v1: '/routing/1/calculateLongDistanceEVRoute/…', v2: '/maps/orbis/routing/v2/…'                         },
            { label: t('ldevrIntro.tableRows.calculateEvRoute'),     v1: Y, v2: Y },
            { label: t('ldevrIntro.tableRows.batchEvRoute'),         v1: Y, v2: N },
            { label: t('ldevrIntro.tableRows.batteryConsumption'),   v1: Y, v2: Y },
            { label: t('ldevrIntro.tableRows.vehicleModelId'),       v1: Y, v2: Y },
            { label: t('ldevrIntro.tableRows.vehicleBrandLookup'),   v1: N, v2: Y },
            { label: t('ldevrIntro.tableRows.connectorMatching'),    v1: Y, v2: Y },
            { label: t('ldevrIntro.tableRows.oemEmspSupport'),       v1: N, v2: Y },
            { label: t('ldevrIntro.tableRows.computeTollAmounts'),   v1: N, v2: Y },
            { label: t('ldevrIntro.tableRows.chargingParksHours'),   v1: N, v2: Y },
            { label: t('ldevrIntro.tableRows.weatherConsideration'), v1: N, v2: Y },
            { label: t('ldevrIntro.tableRows.dynamicDataFreshness'), v1: N, v2: Y },
          ];
          const cell = (val, col) => {
            const isTick = val === Y, isDash = val === N;
            return (
              <td key={col.label} style={{
                padding: '9px 14px', fontSize: '0.8125rem', textAlign: 'left',
                color: isTick ? col.color : isDash ? 'var(--border)' : 'var(--mid)',
                fontWeight: isTick ? 700 : 400,
                borderBottom: '1px solid var(--border)',
              }}>
                {val}
              </td>
            );
          };
          return (
            <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--border)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg)' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border)', width: '44%' }} />
                    {[V1, V2].map(v => (
                      <th key={v.label} style={{ padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid var(--border)', width: '28%' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                          <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)' }}>{v.label}</span>
                          <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 4, background: v.statusBg, color: v.statusColor, whiteSpace: 'nowrap' }}>{v.status}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={row.label} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--bg)' }}>
                      <td style={{ padding: '9px 14px', fontWeight: 600, color: 'var(--black)', borderBottom: '1px solid var(--border)', fontSize: '0.8125rem' }}>{row.label}</td>
                      {cell(row.v1, V1)}
                      {cell(row.v2, V2)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })()}
      </div>

      {/* Ready to build */}
      <div className="zone">
        <h2 className="sh" id="ldevr-start">{t('ldevrIntro.readyTitle')}</h2>
        <p className="body" style={{ marginBottom: 16 }}>
          {t('ldevrIntro.readyBody')}
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            className="page-action-btn"
            style={{ background: '#e2001a', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 6, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
            onClick={() => onNavigate?.('ldevr-first-route')}
          >
            {t('ldevrIntro.ctaQuickStart')}
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('ldevr-calculate-route')}>
            {t('ldevrIntro.ctaCalculateRoute')}
          </button>
          <button className="page-action-btn" onClick={() => onNavigate?.('ldevr-battery-model')}>
            {t('ldevrIntro.ctaBatteryModel')}
          </button>
        </div>
      </div>
    </div>
  );
}
