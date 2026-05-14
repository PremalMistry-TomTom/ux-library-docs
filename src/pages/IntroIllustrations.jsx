import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useIlloStyle } from '../context/IlloStyleContext';
import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import {
  L_SearchFuzzy, L_SearchPOI, L_SearchCategory, L_SearchNearby, L_SearchAlongRoute, L_SearchAutocomplete,
  L_Geocode, L_ReverseGeocode,
  L_TrafficFlow, L_TrafficIncidents, L_TrafficFlowTile, L_TrafficModelID,
  L_EVSearchNearby, L_EVChargingAvailability, L_EVMarketCoverage,
  L_MapRasterTile, L_MapVectorTile, L_MapSatelliteTile, L_MapAssetsAPI, L_MapStaticImage,
  L_ParkingAvailability, L_ParkingPrices, L_OnStreetParking, L_FuelPrices,
  L_SnapToRoads, L_BatchSearch,
  L_POIDetails, L_POIPhotos,
  L_TrafficStats, L_AreaAnalytics, L_ODAnalysis, L_JunctionAnalytics,
} from '../illustrations/lightVariants';
import {
  IcoADAS, IcoAIConfig, IcoAIVoice, IcoAreaAnalytics, IcoBatchRouting,
  IcoCalculateRoute, IcoCluster, IcoETAPanel, IcoEV, IcoEVBattery,
  IcoEVChargingAvailability, IcoEVNavUI, IcoEVRequirements, IcoEVRouting, IcoEVSearchNearby,
  IcoFuelPrices, IcoGeocode, IcoHUD, IcoHomeScreen, IcoHorizonPanel,
  IcoInstructionPanel, IcoIntentRouting, IcoJunctionAnalytics, IcoMapDisplay,
  IcoMapRasterTile, IcoMapSatelliteTile, IcoMapStaticImage, IcoMapVectorTile, IcoMatrixRouting,
  IcoNavControls, IcoNavGuidance, IcoNavSDKAdvanced, IcoNavSDKLocation, IcoNavSDKNavigation,
  IcoNavSDKOffline, IcoNavSDKRouting, IcoNavSDKSearch, IcoNavSDKVirtualHorizon,
  IcoODAnalysis, IcoOnStreetParking, IcoPOIDetails, IcoPOIPhotos, IcoParkingAvailability,
  IcoParkingPrices, IcoReachableRange, IcoReverseGeocode, IcoRouteBar, IcoRoutingWeather,
  IcoSearchAlongRoute, IcoSearchAutocomplete, IcoSearchFuzzy, IcoSearchNearby, IcoSearchPOI,
  IcoSnapToRoads, IcoSpeechToText, IcoTrafficFlow, IcoTrafficFlowTile, IcoTrafficIncidents,
  IcoTrafficModelID, IcoTrafficStats, IcoTruck, IcoTurnInstructions, IcoVIBasics,
  IcoVoiceEngine, IcoWaypointOpt,
} from '../illustrations/iconVariants';

/* ─────────────────────────────────────────────────────────────────────────────
   INTRO HERO ILLUSTRATIONS
   All SVG mini-illustrations used in product intro pages, collected here as
   a style reference and illustration-system foundation.
   ───────────────────────────────────────────────────────────────────────────── */

/* ═══════════════════════════════════════════════════════════════════════════════
   UX LIBRARY — Overview illustrations
   ═══════════════════════════════════════════════════════════════════════════════ */

export function IlloEV() {
  const M = useDarkStyle();
  const stations = [['Belib', '22 kW', '4/5'], ['Indigo', '50 kW', '2/2'], ['Saemes', '7 kW', '6/8']];
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: M.text, marginBottom: 2 }}>Charging station</div>
      <div style={{ fontSize: '0.5rem', color: M.green, marginBottom: 7 }}>Near you · Available now</div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
        {['⚡ Speed', '💳 Payment', '🍴 Services'].map((f, i) => (
          <span key={f} style={{ fontSize: '0.5rem', padding: '2px 5px', borderRadius: 4, background: i === 0 ? M.blue : M.card, color: i === 0 ? '#fff' : M.dim, border: `1px solid ${i === 0 ? M.blue : M.line}` }}>{f}</span>
        ))}
      </div>
      {stations.map(([name, kw, avail], i) => (
        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0', borderTop: i > 0 ? `1px solid ${M.line}` : 'none' }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: M.green, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', fontWeight: 700, color: '#000', flexShrink: 0 }}>{i + 1}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.5rem', fontWeight: 700, color: M.text }}>{name}</div>
            <div style={{ fontSize: '0.5rem', color: M.dim }}>⚡ {kw} · <span style={{ color: M.green }}>{avail} avail.</span></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function IlloSearchResult() {
  const M = useDarkStyle();
  const results = [["Gianni's", '0.3 km'], ['Pizza Napoli', '0.7 km'], ['La Cucina', '1.1 km']];
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%' }}>
      <div style={{ padding: '7px 10px', background: M.card, display: 'flex', alignItems: 'center', gap: 6, borderBottom: `1px solid ${M.line}` }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={M.dim} strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <span style={{ fontSize: '0.5rem', color: M.muted }}>Search destination…</span>
      </div>
      <div style={{ padding: '3px 10px', background: M.dark, display: 'flex', alignItems: 'center', gap: 4 }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: M.green }} />
        <span style={{ fontSize: '0.5rem', color: M.green }}>3rd-party search · online</span>
      </div>
      {results.map(([name, dist], i) => (
        <div key={name} style={{ padding: '5px 10px', borderBottom: i < 2 ? `1px solid ${M.line}` : 'none', display: 'flex', gap: 7 }}>
          <div style={{ width: 18, height: 18, background: M.card, borderRadius: 4, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${M.line}` }}>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={M.blue} strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div>
            <div style={{ fontSize: '0.5rem', fontWeight: 600, color: M.text }}>{name}</div>
            <div style={{ fontSize: '0.5rem', color: M.muted }}>{dist}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function IlloNavControls() {
  const M = useDarkStyle();
  const buttons = ['🔍', '⚡', '🔇', '⚙️'];
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: M.bg }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 140" fill="none">
          <path d="M10 80 Q60 50 100 80 T190 70" stroke="#e2001a" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
          <path d="M10 80 Q60 50 100 80 T190 70" stroke="rgba(226,0,26,0.15)" strokeWidth="8" strokeLinecap="round"/>
          <circle cx="100" cy="78" r="4" fill="#e2001a" opacity="0.9"/>
          <circle cx="100" cy="78" r="8" fill="rgba(226,0,26,0.2)"/>
        </svg>
      </div>
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 28, background: M.dark, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, borderRight: `1px solid ${M.line}` }}>
        {buttons.map(b => (
          <div key={b} style={{ width: 20, height: 20, borderRadius: 4, background: M.card, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem' }}>{b}</div>
        ))}
      </div>
    </div>
  );
}

export function IlloAIVoice() {
  const M = useDarkStyle();
  const bars = [3, 5, 8, 10, 7, 9, 6, 8, 5, 3, 7, 4];
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: '8px 10px' }}>
      <div style={{ fontSize: '0.5rem', color: M.dim, marginBottom: 8 }}>TAIA — in-vehicle voice</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <div style={{ width: 20, height: 20, borderRadius: '50%', background: M.card, border: `1px solid ${M.purple}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="9" height="9" viewBox="0 0 24 24" fill={M.purple}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke={M.purple} strokeWidth="2.5" fill="none"/></svg>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {bars.map((h, i) => (
            <div key={i} style={{ width: 2.5, height: h, borderRadius: 2, background: M.purple, opacity: 0.6 + (i % 4) * 0.1 }}/>
          ))}
        </div>
      </div>
      <div style={{ background: M.card, borderRadius: '6px 6px 6px 2px', padding: '4px 8px', marginBottom: 6, maxWidth: '88%', border: `1px solid ${M.line}` }}>
        <div style={{ fontSize: '0.5rem', color: M.text, lineHeight: 1.4 }}>"Take me to the nearest fast charger"</div>
      </div>
      <div style={{ background: M.card, borderRadius: '6px 6px 2px 6px', padding: '4px 8px', marginLeft: 'auto', maxWidth: '88%', border: `1px solid ${M.line}` }}>
        <div style={{ fontSize: '0.5rem', color: M.green, marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>NAVIGATE_TO_EV_CHARGING</div>
        <div style={{ fontSize: '0.5rem', color: M.dim }}>Ionity · 4.2 km · Route set ✓</div>
      </div>
    </div>
  );
}

export function IlloRoute() {
  const M = useDarkStyle();
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: M.text, marginBottom: 2 }}>Routes</div>
      <div style={{ fontSize: '0.5rem', color: M.dim, marginBottom: 8 }}>9 hr 28 min · 679 km · <span style={{ color: M.red }}>⚡ 1 min</span></div>
      {[
        { label: '📍 Current location', type: 'origin' },
        { leg: '50 min · 54 km' },
        { label: '🔌 bp pulse', sub: '21% → 46% · 400 kW · 20 min', type: 'stop' },
        { leg: '53 min · 104 km' },
        { label: '🔌 Fastned', sub: '15% → 40% · 350 kW · 25 min', type: 'stop' },
      ].map((s, i) => s.leg ? (
        <div key={i} style={{ fontSize: '0.5rem', color: M.dim, paddingLeft: 12, marginBottom: 3 }}>— {s.leg}</div>
      ) : s.type === 'origin' ? (
        <div key={i} style={{ fontSize: '0.5rem', color: M.dim, marginBottom: 3 }}>{s.label}</div>
      ) : (
        <div key={i} style={{ background: M.card, borderRadius: 4, padding: '4px 6px', marginBottom: 4, border: `1px solid ${M.line}` }}>
          <div style={{ fontSize: '0.5rem', fontWeight: 700, color: M.text }}>{s.label}</div>
          <div style={{ fontSize: '0.5rem', color: M.dim }}>{s.sub}</div>
        </div>
      ))}
    </div>
  );
}

export function IlloColourSystem() {
  const M = useDarkStyle();
  const swatches = ['#e2001a', '#ff6b6b', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#1a1a2e', '#f0f0f0'];
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {swatches.map(c => <div key={c} style={{ width: 22, height: 22, borderRadius: 5, background: c, border: `1px solid ${M.line}` }} />)}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {[['Brand', '#e2001a'], ['Surface', '#1a1a2e'], ['Action', '#60a5fa']].map(([label, color]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: color, flexShrink: 0 }} />
            <span style={{ fontSize: '0.5rem', color: M.text, fontWeight: 600 }}>{label}</span>
            <span style={{ fontSize: '0.5rem', color: M.dim, fontFamily: 'monospace' }}>{color}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function IlloHorizonPanel() {
  const M = useDarkStyle();
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: M.bg }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 130" fill="none">
          <path d="M10 75 Q55 50 100 72 T190 65" stroke="#e2001a" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
          <path d="M50 0 L52 130" stroke={M.line} strokeWidth="1" opacity="0.3"/>
          <circle cx="102" cy="70" r="4" fill="#e2001a" opacity="0.8"/>
        </svg>
      </div>
      <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 72, background: M.dark, border: `1px solid ${M.line}`, display: 'flex', flexDirection: 'column', opacity: 0.96 }}>
        <div style={{ background: M.green, padding: '7px 8px', display: 'flex', alignItems: 'center', gap: 5, borderBottom: `1px solid rgba(0,0,0,0.15)` }}>
          <span style={{ fontSize: '0.875rem', color: 'white' }}>↖</span>
          <div>
            <div style={{ fontSize: '0.5rem', fontWeight: 700, color: 'white' }}>1.2 mi</div>
            <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>Oak St N</div>
          </div>
        </div>
        <div style={{ flex: 1, padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[['🚧', 'Roadwork', M.amber], ['⛽', 'Station', M.blue]].map(([icon, label, color]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: '0.5rem' }}>{icon}</span>
              <span style={{ fontSize: '0.5rem', color }}>{label}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: '6px 8px', borderTop: `1px solid ${M.line}`, display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.5rem', fontWeight: 700, color: '#fff' }}>14:32</div>
            <div style={{ fontSize: '0.5rem', color: M.dim }}>ETA</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.5rem', fontWeight: 700, color: '#fff' }}>18 min</div>
            <div style={{ fontSize: '0.5rem', color: M.dim }}>Time</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function IlloCluster() {
  const M = useDarkStyle();
  const LANES = [{ r: false }, { r: false }, { r: false }, { r: false }, { r: true }, { r: true }];
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', display: 'flex', alignItems: 'center', gap: 4, padding: '0 6px' }}>
      {/* Speedometer gauge */}
      <svg viewBox="0 0 60 60" style={{ width: 52, height: 52, flexShrink: 0 }}>
        <circle cx="30" cy="30" r="28" fill={M.dark}/>
        <circle cx="30" cy="34" r="22" fill="none" stroke={M.line} strokeWidth="4" strokeDasharray="115 38" strokeDashoffset="-19" strokeLinecap="round" opacity="0.35"/>
        <circle cx="30" cy="34" r="22" fill="none" stroke="#e2001a" strokeWidth="4" strokeDasharray="72 81" strokeDashoffset="-19" strokeLinecap="round"/>
        <text x="30" y="38" textAnchor="middle" fill={M.white} style={{ fontSize: 11, fontWeight: 700, fontFamily: 'system-ui' }}>72</text>
        <text x="30" y="46" textAnchor="middle" fill={M.dim} style={{ fontSize: 5, fontFamily: 'system-ui' }}>km/h</text>
      </svg>
      <div style={{ flex: 1, height: 80, display: 'flex', flexDirection: 'column', borderRadius: 5, overflow: 'hidden', border: `1px solid ${M.line}22` }}>
        <div style={{ flex: 1, background: M.dark, position: 'relative', overflow: 'hidden' }}>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 80 40" fill="none">
            <path d="M0 22 Q20 16 40 22 T80 18" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5"/>
            <path d="M0 22 Q20 16 40 22 T80 18" stroke="#e2001a" strokeWidth="2" opacity="0.7"/>
            <circle cx="40" cy="21" r="3" fill="#e2001a" opacity="0.8"/>
          </svg>
        </div>
        <div style={{ background: 'rgba(22,50,80,0.97)', padding: '3px 6px', display: 'flex', alignItems: 'center', gap: 4, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <svg width="8" height="8" viewBox="0 0 20 20" fill="rgba(255,255,255,0.9)">
            <path d="M3 20 L3 10 Q3 3 10 3 L15 3 L11.5 0 L20 0 L20 8 L16.5 5 Q13 5 13 10 L13 20 Z"/>
          </svg>
          <span style={{ fontSize: '0.5rem', fontWeight: 700, color: 'white' }}>600 m</span>
          <span style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.45)', overflow: 'hidden', whiteSpace: 'nowrap' }}>Canary Wharf</span>
        </div>
        <div style={{ background: 'rgba(14,32,54,0.97)', padding: '3px 6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {LANES.map((l, i) => (
            <svg key={i} width="5" height="8" viewBox="0 0 10 16" fill={l.r ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.25)'}>
              <polygon points="5,0 10,5.5 7,5.5 7,16 3,16 3,5.5 0,5.5"/>
            </svg>
          ))}
        </div>
        <div style={{ background: 'rgba(6,14,28,0.98)', padding: '3px 6px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <span style={{ fontSize: '0.5rem', fontWeight: 700, color: 'rgba(255,255,255,0.75)' }}>10:59 PM</span>
          <span style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.3)', marginLeft: 3 }}>· 26.5 km</span>
        </div>
      </div>
      {/* Battery gauge */}
      <svg viewBox="0 0 60 60" style={{ width: 52, height: 52, flexShrink: 0 }}>
        <circle cx="30" cy="30" r="28" fill={M.dark}/>
        <circle cx="30" cy="34" r="22" fill="none" stroke={M.line} strokeWidth="4" strokeDasharray="115 38" strokeDashoffset="-19" strokeLinecap="round" opacity="0.35"/>
        <circle cx="30" cy="34" r="22" fill="none" stroke={M.green} strokeWidth="4" strokeDasharray="85 68" strokeDashoffset="-19" strokeLinecap="round"/>
        <text x="30" y="37" textAnchor="middle" fill={M.green} style={{ fontSize: 9, fontWeight: 700, fontFamily: 'system-ui' }}>74%</text>
        <text x="30" y="46" textAnchor="middle" fill={M.dim} style={{ fontSize: 4.5, fontFamily: 'system-ui' }}>BATT</text>
      </svg>
    </div>
  );
}

export function IlloMapStyle() {
  const M = useDarkStyle();
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: '50%', overflow: 'hidden' }}>
        <svg style={{ width: '200%', height: '100%' }} viewBox="0 0 200 130" fill="none">
          <rect width="200" height="130" fill="#e8e0d5"/>
          <path d="M0 70 Q50 58 100 70 T200 62" stroke="#cfc9bf" strokeWidth="5" strokeLinecap="round"/>
          <path d="M0 70 Q50 58 100 70 T200 62" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <path d="M48 0 L50 130" stroke="#cfc9bf" strokeWidth="4"/>
          <path d="M0 55 Q50 44 100 55 T200 48" stroke={'#22c55e'} strokeWidth="2.5" strokeLinecap="round" opacity="0.85"/>
          <rect x="8" y="18" width="34" height="24" rx="2" fill="#d8d0c4"/>
          <rect x="56" y="30" width="16" height="18" rx="2" fill="#d8d0c4"/>
          <rect x="76" y="12" width="22" height="28" rx="2" fill="#d8d0c4"/>
        </svg>
      </div>
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', right: 0, overflow: 'hidden' }}>
        <svg style={{ width: '200%', height: '100%', marginLeft: '-100%' }} viewBox="0 0 200 130" fill="none">
          <rect width="200" height="130" fill="#1a2535"/>
          <path d="M0 70 Q50 58 100 70 T200 62" stroke="#263040" strokeWidth="5" strokeLinecap="round"/>
          <path d="M0 70 Q50 58 100 70 T200 62" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeLinecap="round"/>
          <path d="M0 55 Q50 44 100 55 T200 48" stroke="#e2001a" strokeWidth="2.5" strokeLinecap="round" opacity="0.75"/>
          <rect x="8" y="18" width="34" height="24" rx="2" fill="#223044"/>
          <rect x="56" y="30" width="16" height="18" rx="2" fill="#223044"/>
          <rect x="76" y="12" width="22" height="28" rx="2" fill="#223044"/>
        </svg>
      </div>
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1.5, background: 'rgba(255,255,255,0.25)', zIndex: 1 }}/>
      <div style={{ position: 'absolute', bottom: 7, left: 8, fontSize: '0.5rem', fontWeight: 700, color: 'rgba(0,0,0,0.45)', letterSpacing: '0.06em' }}>DAY</div>
      <div style={{ position: 'absolute', bottom: 7, right: 8, fontSize: '0.5rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em' }}>NIGHT</div>
      <div style={{ position: 'absolute', top: 7, left: 8, display: 'flex', alignItems: 'center', gap: 3 }}>
        <div style={{ width: 12, height: 3, borderRadius: 2, background: '#22c55e' }}/>
        <span style={{ fontSize: '0.5rem', color: 'rgba(0,0,0,0.5)', fontWeight: 600 }}>Free flow</span>
      </div>
    </div>
  );
}

export function IlloHomeScreen() {
  const M = useDarkStyle();
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: M.bg }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 200 130" fill="none">
          <path d="M10 60 Q55 40 100 62 T190 55" stroke="#e2001a" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
          <path d="M0 80 Q50 55 100 80 T200 72" stroke={M.line} strokeWidth="1.5" opacity="0.6"/>
          <path d="M50 0 L52 130" stroke={M.line} strokeWidth="1" opacity="0.4"/>
          <path d="M140 0 L135 130" stroke={M.line} strokeWidth="1" opacity="0.4"/>
        </svg>
      </div>
      <div style={{ position: 'absolute', inset: 8, border: '1.5px dashed rgba(245,158,11,0.55)', borderRadius: 4 }} />
      <div style={{ position: 'absolute', top: 16, left: 16, right: 40, bottom: 30, border: '1.5px dashed rgba(59,130,246,0.5)', borderRadius: 3 }} />
      <div style={{ position: 'absolute', bottom: 14, left: 16, right: 16, height: 22, border: '1.5px dashed rgba(226,0,26,0.6)', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        {['🔍','⚡','🔇','⚙️'].map(b => (
          <div key={b} style={{ width: 14, height: 14, borderRadius: 3, background: M.card, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem' }}>{b}</div>
        ))}
      </div>
      <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {[['#f59e0b','Nav area'],['#3b82f6','Safe area'],['#e2001a','Controls']].map(([c,l]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <div style={{ width: 6, height: 6, borderRadius: 1, background: c, opacity: 0.85 }} />
            <span style={{ fontSize: '0.5rem', color: M.dim }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function IlloETAPanel() {
  const M = useDarkStyle();
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: M.bg }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 130" fill="none">
          <path d="M10 75 Q60 55 100 72 T190 65" stroke="#e2001a" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
          <circle cx="102" cy="70" r="4" fill="#e2001a" opacity="0.8"/>
          <circle cx="102" cy="70" r="8" fill="rgba(226,0,26,0.18)"/>
        </svg>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: M.dark, borderTop: `1px solid ${M.line}`, padding: '9px 14px' }}>
        <div style={{ fontSize: '0.5rem', color: M.dim, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>ETA PANEL</div>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {[['14:32', 'ETA'], ['18 min', 'Remaining'], ['6.4 km', 'Distance']].map(([val, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: '0.5rem', color: M.dim, marginTop: 3, letterSpacing: '0.04em' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function IlloThemingTokens() {
  const M = useDarkStyle();
  const tokens = [
    { name: '--brand-primary', from: '#e2001a', to: '#0066cc', color: true },
    { name: '--corner-radius', from: '4 dp', to: '12 dp', color: false },
    { name: '--font-family',   from: 'Roboto', to: 'Inter', color: false },
  ];
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: '10px 12px' }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: M.dim, marginBottom: 9, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Token override</div>
      {tokens.map(({ name, from, to, color }) => (
        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
          {color
            ? <div style={{ width: 26, height: 14, borderRadius: 3, background: from, flexShrink: 0 }} />
            : <div style={{ width: 26, height: 14, borderRadius: 3, background: M.card, border: `1px solid ${M.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '0.5rem', color: '#e2001a', fontFamily: 'monospace' }}>{from}</span>
              </div>}
          <span style={{ fontSize: '0.5rem', color: M.dim, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>{name}</span>
          <span style={{ fontSize: '0.875rem', color: '#374151' }}>→</span>
          {color
            ? <div style={{ width: 26, height: 14, borderRadius: 3, background: to, flexShrink: 0 }} />
            : <div style={{ width: 26, height: 14, borderRadius: 3, background: M.card, border: `1px solid ${M.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '0.5rem', color: '#0066cc', fontFamily: 'monospace' }}>{to}</span>
              </div>}
        </div>
      ))}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
        <div style={{ padding: '4px 10px', borderRadius: 4, background: '#e2001a', fontSize: '0.5rem', color: '#fff', fontWeight: 700 }}>Default</div>
        <span style={{ fontSize: '0.875rem', color: '#374151' }}>→</span>
        <div style={{ padding: '4px 10px', borderRadius: 20, background: '#0066cc', fontSize: '0.5rem', color: '#fff', fontWeight: 700 }}>OEM Brand</div>
      </div>
    </div>
  );
}

export function IlloChargingSearch() {
  const M = useDarkStyle();
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: '8px 10px' }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: M.text, marginBottom: 2 }}>EV Charging</div>
      <div style={{ fontSize: '0.5rem', color: M.green, marginBottom: 7 }}>Near you · Connector matched</div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
        {['⚡ Speed', '💳 Payment', '🍴 Services'].map((f, i) => (
          <span key={f} style={{ fontSize: '0.5rem', padding: '2px 5px', borderRadius: 4, background: i === 0 ? M.blue : M.card, color: i === 0 ? '#fff' : M.dim, border: `1px solid ${i === 0 ? M.blue : M.line}` }}>{f}</span>
        ))}
      </div>
      {[['Ionity', '350 kW', '3/4'], ['Fastned', '300 kW', '2/4'], ['bp pulse', '50 kW', '5/6']].map(([name, kw, avail], i) => (
        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '4px 0', borderTop: i > 0 ? `1px solid ${M.line}` : 'none' }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: M.green, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', fontWeight: 700, color: '#000', flexShrink: 0 }}>{i+1}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.5rem', fontWeight: 700, color: M.text }}>{name}</div>
            <div style={{ fontSize: '0.5rem', color: M.dim }}>⚡ {kw}</div>
          </div>
          <span style={{ fontSize: '0.5rem', color: M.green }}>{avail}</span>
        </div>
      ))}
    </div>
  );
}

export function IlloConversationPersonality() {
  const M = useDarkStyle();
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: '8px 10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <div style={{ width: 18, height: 18, borderRadius: '50%', background: M.card, border: `1.5px solid ${M.purple}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', flexShrink: 0 }}>✦</div>
        <span style={{ fontSize: '0.5rem', fontWeight: 700, color: M.text }}>BMW Assistant</span>
        <span style={{ fontSize: '0.5rem', color: M.purple, marginLeft: 'auto' }}>Custom name ✓</span>
      </div>
      <div style={{ background: M.card, borderRadius: '4px 10px 10px 4px', padding: '4px 8px', marginBottom: 6, maxWidth: '92%' }}>
        <div style={{ fontSize: '0.5rem', color: M.dim, marginBottom: 1 }}>Default TomTom tone</div>
        <div style={{ fontSize: '0.5rem', color: M.dim, lineHeight: 1.35 }}>"Route updated. New ETA in 18 minutes."</div>
      </div>
      <div style={{ background: M.card, borderRadius: '10px 4px 10px 10px', padding: '4px 8px', marginLeft: 'auto', maxWidth: '92%', border: `1px solid ${M.purple}` }}>
        <div style={{ fontSize: '0.5rem', color: M.purple, marginBottom: 1 }}>OEM branded tone</div>
        <div style={{ fontSize: '0.5rem', color: M.text, lineHeight: 1.35 }}>"Recalculating — you'll still arrive on time, Chris."</div>
      </div>
    </div>
  );
}

export function IlloADAS() {
  const M = useDarkStyle();
  const lanes = [false, false, true, true, false];
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: M.bg }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 130" fill="none">
          <path d="M0 130 L55 58 L145 58 L200 130 Z" fill={M.card} opacity="0.9"/>
          {[65, 85, 100, 115, 135].map((x, i) => (
            <line key={i} x1={x} y1={58} x2={i === 0 ? 0 : i === 4 ? 200 : x + (i - 2) * 12} y2={130} stroke={M.line} strokeWidth="1" strokeDasharray="5 5"/>
          ))}
          <path d="M100 75 L100 120" stroke={M.line} strokeWidth="1" strokeDasharray="3 5"/>
        </svg>
      </div>
      <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 6 }}>
        {lanes.map((active, i) => (
          <svg key={i} width="13" height="20" viewBox="0 0 13 20">
            <rect x="4.5" y="7" width="4" height="11" rx="1" fill={active ? '#e2001a' : M.line}/>
            <polygon points="6.5,0 13,8 9.5,8 9.5,7 3.5,7 3.5,8 0,8" fill={active ? '#e2001a' : M.line}/>
          </svg>
        ))}
      </div>
      <div style={{ position: 'absolute', top: 8, left: 10, right: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'white', border: '3px solid #e2001a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.5rem', fontWeight: 800, color: '#111' }}>100</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: M.text }}>600 m</div>
          <div style={{ fontSize: '0.5rem', color: M.dim, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Lane change</div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAPS & NAVIGATION SDK — NavSDKIntro illustrations
   ═══════════════════════════════════════════════════════════════════════════════ */

export function IlloMapDisplay() {
  const M = useDarkStyle();
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 130" fill="none">
          <rect width="200" height="130" fill={M.bg}/>
          <path d="M0 65 Q60 55 100 65 T200 60" stroke={M.card} strokeWidth="6" strokeLinecap="round"/>
          <path d="M0 65 Q60 55 100 65 T200 60" stroke={M.line} strokeWidth="2" strokeLinecap="round"/>
          <path d="M70 0 L68 130" stroke={M.card} strokeWidth="5"/>
          <path d="M70 0 L68 130" stroke={M.line} strokeWidth="1.5"/>
          <path d="M140 0 L135 130" stroke={M.card} strokeWidth="5"/>
          <path d="M140 0 L135 130" stroke={M.line} strokeWidth="1.5"/>
          <path d="M10 100 Q50 70 100 65 T180 50" stroke="#e2001a" strokeWidth="2.5" strokeLinecap="round" opacity="0.85"/>
          <path d="M10 100 Q50 70 100 65 T180 50" stroke="rgba(226,0,26,0.2)" strokeWidth="9" strokeLinecap="round"/>
          <circle cx="100" cy="65" r="5" fill="#e2001a"/>
          <circle cx="100" cy="65" r="9" fill="rgba(226,0,26,0.22)"/>
          <circle cx="68" cy="45" r="3" fill="#58a6ff" opacity="0.8"/>
          <circle cx="140" cy="70" r="3" fill="#3fb950" opacity="0.8"/>
          <circle cx="155" cy="40" r="3" fill={'#fbbf24'} opacity="0.8"/>
        </svg>
      </div>
      <div style={{ position: 'absolute', top: 8, right: 8, background: M.dark, borderRadius: 4, padding: '3px 7px', display: 'flex', gap: 4, alignItems: 'center', border: `1px solid ${M.line}` }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: M.green }}/>
        <span style={{ fontSize: '0.5rem', color: '#fff', fontWeight: 600 }}>Map Display</span>
      </div>
    </div>
  );
}

/* ── NavSDK Domain illustrations ─────────────────────────────────────────── */

export function IlloNavSDKLocation() {
  const M = useDarkStyle();
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 130" fill="none">
          <rect width="200" height="130" fill={M.bg}/>
          {/* Map grid lines */}
          <line x1="0" y1="43" x2="200" y2="43" stroke={M.card} strokeWidth="1"/>
          <line x1="0" y1="87" x2="200" y2="87" stroke={M.card} strokeWidth="1"/>
          <line x1="67" y1="0" x2="67" y2="130" stroke={M.card} strokeWidth="1"/>
          <line x1="133" y1="0" x2="133" y2="130" stroke={M.card} strokeWidth="1"/>
          {/* GPS accuracy halo */}
          <circle cx="100" cy="65" r="30" fill="rgba(88,166,255,0.08)" stroke="#58a6ff" strokeWidth="1" strokeDasharray="4 3"/>
          <circle cx="100" cy="65" r="18" fill="rgba(88,166,255,0.12)" stroke="#58a6ff" strokeWidth="0.5"/>
          {/* Location pin */}
          <circle cx="100" cy="65" r="6" fill="#e2001a"/>
          <circle cx="100" cy="65" r="10" fill="rgba(226,0,26,0.22)"/>
          {/* Heading arrow */}
          <path d="M100 65 L108 48" stroke="#58a6ff" strokeWidth="2" strokeLinecap="round"/>
          <polygon points="108,43 104,52 112,52" fill="#58a6ff"/>
        </svg>
      </div>
      <div style={{ position: 'absolute', bottom: 8, left: 8, right: 8, background: M.dark, borderRadius: 5, padding: '5px 8px', border: `1px solid ${M.line}`, display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: M.green, flexShrink: 0 }}/>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.5rem', color: M.text, fontWeight: 700 }}>GPS · 3D Fix</div>
          <div style={{ fontSize: '0.5rem', color: M.dim }}>Accuracy: ±4 m · 9 satellites</div>
        </div>
      </div>
    </div>
  );
}

export function IlloNavSDKSearch() {
  const M = useDarkStyle();
  const results = [['Vondelpark', 'Park · 0.8 km'], ['Dam Square', 'Square · 1.2 km'], ['Leidseplein', 'Square · 1.6 km']];
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%' }}>
      <div style={{ padding: '7px 10px', background: M.card, display: 'flex', alignItems: 'center', gap: 6, borderBottom: `1px solid ${M.line}` }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={M.dim} strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <span style={{ fontSize: '0.5rem', color: M.text, fontWeight: 600 }}>Vond</span>
        <span style={{ fontSize: '0.5rem', color: M.muted }}>elpark</span>
      </div>
      {results.map(([name, meta], i) => (
        <div key={name} style={{ padding: '5px 10px', borderBottom: i < 2 ? `1px solid ${M.line}` : 'none', display: 'flex', gap: 7, alignItems: 'center' }}>
          <div style={{ width: 18, height: 18, background: M.card, borderRadius: 4, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${M.line}` }}>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={M.blue} strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.5rem', fontWeight: 700, color: M.text }}>{name}</div>
            <div style={{ fontSize: '0.5rem', color: M.muted }}>{meta}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function IlloNavSDKRouting() {
  const M = useDarkStyle();
  const routes = [
    { label: 'Fastest', time: '22 min', dist: '14.2 km', tag: 'Recommended', highlight: true },
    { label: 'Eco', time: '26 min', dist: '13.5 km', tag: '–8% fuel', highlight: false },
    { label: 'Avoid tolls', time: '31 min', dist: '17.1 km', tag: 'No tolls', highlight: false },
  ];
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: M.text, marginBottom: 2 }}>Route Options</div>
      <div style={{ fontSize: '0.5rem', color: M.dim, marginBottom: 8 }}>Amsterdam → Schiphol</div>
      {routes.map((r, i) => (
        <div key={r.label} style={{ background: r.highlight ? M.card : 'transparent', border: `1px solid ${r.highlight ? M.green : M.line}`, borderRadius: 5, padding: '5px 7px', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.5rem', fontWeight: 700, color: M.text }}>{r.time}</div>
            <div style={{ fontSize: '0.5rem', color: M.dim }}>{r.dist}</div>
          </div>
          <span style={{ fontSize: '0.5rem', padding: '2px 5px', borderRadius: 3, background: M.bg, color: r.highlight ? M.green : M.dim, fontWeight: 600, border: `1px solid ${M.line}` }}>{r.tag}</span>
        </div>
      ))}
    </div>
  );
}

export function IlloNavSDKNavigation() {
  const M = useDarkStyle();
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 130" fill="none">
          <rect width="200" height="130" fill={M.bg}/>
          <path d="M20 110 Q70 70 100 72 T180 50" stroke="#e2001a" strokeWidth="2.5" strokeLinecap="round" opacity="0.85"/>
          <path d="M20 110 Q70 70 100 72 T180 50" stroke="rgba(226,0,26,0.18)" strokeWidth="9" strokeLinecap="round"/>
          <circle cx="100" cy="71" r="4" fill="#e2001a"/>
          <circle cx="100" cy="71" r="8" fill="rgba(226,0,26,0.2)"/>
        </svg>
      </div>
      {/* NIP banner */}
      <div style={{ position: 'absolute', top: 8, left: 8, right: 8, background: M.dark, borderRadius: 6, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 8, border: `1px solid ${M.green}` }}>
        <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>↖</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.5rem', fontWeight: 700, color: M.white }}>In 400 m turn left</div>
          <div style={{ fontSize: '0.5rem', color: M.dim }}>Keizersgracht</div>
        </div>
        <div style={{ fontSize: '0.625rem', fontWeight: 700, color: M.green }}>400m</div>
      </div>
      {/* Bottom bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: M.dark, borderTop: `1px solid ${M.line}`, padding: '6px 12px', display: 'flex', justifyContent: 'space-around' }}>
        {[['14:38', 'ETA'], ['18 min', 'Time'], ['6.4 km', 'Dist']].map(([v, l]) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.625rem', fontWeight: 700, color: M.white }}>{v}</div>
            <div style={{ fontSize: '0.5rem', color: M.dim }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function IlloNavSDKOffline() {
  const M = useDarkStyle();
  const regions = [['Western Europe', '1.4 GB', 100], ['Benelux', '0.3 GB', 72], ['Germany', '0.9 GB', 28]];
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={M.green} strokeWidth="2"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        <span style={{ fontSize: '0.5rem', fontWeight: 700, color: M.text }}>Offline Maps</span>
        <span style={{ fontSize: '0.5rem', color: M.green, marginLeft: 'auto' }}>3 regions</span>
      </div>
      {regions.map(([name, size, pct]) => (
        <div key={name} style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
            <span style={{ fontSize: '0.5rem', color: M.text }}>{name}</span>
            <span style={{ fontSize: '0.5rem', color: M.dim }}>{size}</span>
          </div>
          <div style={{ height: 4, background: M.card, borderRadius: 2 }}>
            <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? M.green : M.blue, borderRadius: 2 }}/>
          </div>
          {pct < 100 && <div style={{ fontSize: '0.5rem', color: M.dim, marginTop: 2 }}>{pct}% downloaded</div>}
          {pct === 100 && <div style={{ fontSize: '0.5rem', color: M.green, marginTop: 2 }}>Ready · offline</div>}
        </div>
      ))}
    </div>
  );
}

export function IlloNavSDKVirtualHorizon() {
  const M = useDarkStyle();
  const events = [
    { dist: '200 m', label: 'Speed limit 80', color: '#fbbf24', icon: '⚠️' },
    { dist: '450 m', label: 'Sharp curve right', color: M.blue, icon: '↪' },
    { dist: '900 m', label: 'Traffic incident', color: '#ef4444', icon: '⛔' },
  ];
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', position: 'relative' }}>
      {/* 3D road perspective */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 130" fill="none">
          <rect width="200" height="130" fill={M.bg}/>
          <path d="M0 130 L60 58 L140 58 L200 130 Z" fill={M.card} opacity="0.7"/>
          {[70,90,100,110,130].map((x, i) => (
            <line key={i} x1={x} y1={58} x2={i < 2 ? x-50 : i > 2 ? x+50 : x} y2={130} stroke={M.line} strokeWidth="0.8" strokeDasharray="5 4"/>
          ))}
          <circle cx="75" cy="72" r="3.5" fill="#fbbf24" opacity="0.9"/>
          <circle cx="100" cy="64" r="3" fill="#ef4444" opacity="0.9"/>
          <circle cx="118" cy="69" r="2.5" fill="#58a6ff" opacity="0.9"/>
        </svg>
      </div>
      {/* Horizon data strip */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: M.dark, borderTop: `1px solid ${M.line}`, padding: '5px 8px' }}>
        <div style={{ fontSize: '0.5rem', color: M.dim, marginBottom: 3 }}>Ahead on route</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {events.map(ev => (
            <div key={ev.label} style={{ flex: 1, background: M.card, borderRadius: 4, padding: '3px 5px', border: `1px solid ${ev.color}33` }}>
              <div style={{ fontSize: '0.5rem', color: ev.color, fontWeight: 700 }}>{ev.dist}</div>
              <div style={{ fontSize: '0.5rem', color: M.dim, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function IlloNavSDKAdvanced() {
  const M = useDarkStyle();
  const config = [
    { key: 'apiKey', val: '"tt_••••••"', color: M.green },
    { key: 'logLevel', val: '"DEBUG"', color: '#fbbf24' },
    { key: 'telemetry', val: 'enabled', color: M.blue },
    { key: 'vehicle', val: '{ type: CAR }', color: M.dim },
  ];
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      {/* Window chrome */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 8, alignItems: 'center' }}>
        {['#ef4444','#fbbf24','#22c55e'].map(c => (
          <div key={c} style={{ width: 7, height: 7, borderRadius: '50%', background: c }}/>
        ))}
        <span style={{ fontSize: '0.5rem', color: M.dim, marginLeft: 4, fontFamily: 'monospace' }}>NavSDK.init()</span>
      </div>
      {config.map(({ key, val, color }) => (
        <div key={key} style={{ display: 'flex', gap: 6, alignItems: 'baseline', marginBottom: 5 }}>
          <span style={{ fontSize: '0.5rem', color: M.dim, fontFamily: 'monospace', flexShrink: 0 }}>{key}:</span>
          <span style={{ fontSize: '0.5rem', color, fontFamily: 'monospace', fontWeight: 700 }}>{val}</span>
        </div>
      ))}
      <div style={{ marginTop: 8, padding: '5px 7px', background: M.card, borderRadius: 4, border: `1px solid ${M.line}` }}>
        <div style={{ fontSize: '0.5rem', color: M.green }}>✓ SDK initialised · v2.x</div>
      </div>
    </div>
  );
}

function IlloSDKSearch() {
  const M = useDarkStyle();
  const results = [['Amsterdam Centraal', '0.2 km'], ['Rijksmuseum', '1.4 km'], ['Vondelpark', '2.1 km']];
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%' }}>
      <div style={{ padding: '7px 10px', background: M.card, display: 'flex', alignItems: 'center', gap: 6, borderBottom: `1px solid ${M.line}` }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={M.dim} strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <span style={{ fontSize: '0.5rem', color: M.muted }}>Search destination…</span>
      </div>
      {results.map(([name, dist], i) => (
        <div key={name} style={{ padding: '6px 10px', borderBottom: i < 2 ? `1px solid ${M.line}` : 'none', display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ width: 18, height: 18, background: M.card, borderRadius: 4, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${M.line}` }}>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={M.blue} strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.5rem', fontWeight: 600, color: M.text }}>{name}</div>
            <div style={{ fontSize: '0.5rem', color: M.muted }}>{dist}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function IlloRouteOptions() {
  const M = useDarkStyle();
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: M.text, marginBottom: 2 }}>Route Options</div>
      <div style={{ fontSize: '0.5rem', color: M.dim, marginBottom: 8 }}>Amsterdam → Berlin · 3 results</div>
      {[
        { label: 'Fastest', time: '5h 52m', dist: '573 km', tag: 'Recommended', color: M.green },
        { label: 'Eco', time: '6h 10m', dist: '558 km', tag: '–12% fuel', color: M.blue },
        { label: 'Avoid tolls', time: '6h 38m', dist: '601 km', tag: 'No tolls', color: M.dim },
      ].map((r, i) => (
        <div key={r.label} style={{ background: i === 0 ? M.card : M.bg, border: `1px solid ${i === 0 ? M.green : M.line}`, borderRadius: 5, padding: '5px 7px', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.5rem', fontWeight: 700, color: M.text }}>{r.time}</div>
            <div style={{ fontSize: '0.5rem', color: M.dim }}>{r.dist}</div>
          </div>
          <span style={{ fontSize: '0.5rem', padding: '2px 5px', borderRadius: 3, background: M.card, color: r.color, fontWeight: 600, border: `1px solid ${M.line}` }}>{r.tag}</span>
        </div>
      ))}
    </div>
  );
}

export function IlloNavGuidance() {
  const M = useDarkStyle();
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: M.bg }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 130" fill="none">
          <path d="M10 100 Q60 70 100 72 T190 50" stroke="#e2001a" strokeWidth="2.5" strokeLinecap="round" opacity="0.85"/>
          <path d="M10 100 Q60 70 100 72 T190 50" stroke="rgba(226,0,26,0.2)" strokeWidth="9" strokeLinecap="round"/>
          <circle cx="100" cy="71" r="4" fill="#e2001a" opacity="0.9"/>
        </svg>
      </div>
      <div style={{ position: 'absolute', top: 8, left: 8, background: M.dark, borderRadius: 6, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 6, border: `1px solid ${M.green}` }}>
        <span style={{ fontSize: '1rem', lineHeight: 1 }}>↖</span>
        <div>
          <div style={{ fontSize: '0.5rem', fontWeight: 700, color: '#fff' }}>800 m</div>
          <div style={{ fontSize: '0.5rem', color: M.dim }}>Turn left · Keizersgracht</div>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: M.dark, borderTop: `1px solid ${M.line}`, padding: '7px 12px', display: 'flex', justifyContent: 'space-around' }}>
        {[['14:32', 'ETA'], ['22 min', 'Time'], ['8.4 km', 'Dist']].map(([v, l]) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff' }}>{v}</div>
            <div style={{ fontSize: '0.5rem', color: M.dim }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IlloOfflineMaps() {
  const M = useDarkStyle();
  const regions = [['Western Europe', '1.2 GB', 100], ['Eastern Europe', '0.8 GB', 65], ['North America', '2.1 GB', 30]];
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 2.09 4.18a2 2 0 0 1 2-2.18h3"/><path d="M16 2a4 4 0 0 1 4 4v1M16 7h6"/><line x1="23" y1="1" x2="1" y2="23" stroke="#ef4444" strokeWidth="1.5"/></svg>
        <span style={{ fontSize: '0.5rem', fontWeight: 700, color: M.text }}>Offline Maps</span>
        <span style={{ fontSize: '0.5rem', color: '#3fb950', marginLeft: 'auto' }}>Active</span>
      </div>
      {regions.map(([name, size, pct]) => (
        <div key={name} style={{ marginBottom: 7 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
            <span style={{ fontSize: '0.5rem', color: M.text }}>{name}</span>
            <span style={{ fontSize: '0.5rem', color: M.dim }}>{size}</span>
          </div>
          <div style={{ height: 4, background: M.card, borderRadius: 2 }}>
            <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? '#3fb950' : M.blue, borderRadius: 2 }}/>
          </div>
        </div>
      ))}
    </div>
  );
}

function IlloCarPlay() {
  const M = useDarkStyle();
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: M.bg }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 130" fill="none">
          <path d="M10 80 Q55 58 100 72 T190 60" stroke="#e2001a" strokeWidth="2.5" strokeLinecap="round" opacity="0.85"/>
          <path d="M10 80 Q55 58 100 72 T190 60" stroke="rgba(226,0,26,0.2)" strokeWidth="9" strokeLinecap="round"/>
          <circle cx="100" cy="71" r="4" fill="#e2001a" opacity="0.9"/>
        </svg>
      </div>
      <div style={{ position: 'absolute', top: 8, left: 8, right: 8, background: M.dark, borderRadius: 5, padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 6, border: `1px solid ${M.line}` }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={M.dim} strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
        <span style={{ fontSize: '0.5rem', color: M.dim, fontWeight: 600, letterSpacing: '0.04em' }}>CarPlay</span>
        <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: M.green }}/>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: M.dark, borderTop: `1px solid ${M.line}`, padding: '7px 12px', display: 'flex', justifyContent: 'space-around' }}>
        {[['14:32', 'ETA'], ['18 min', 'Time'], ['6.4 km', 'Dist']].map(([v, l]) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff' }}>{v}</div>
            <div style={{ fontSize: '0.5rem', color: M.dim }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IlloVirtualHorizon() {
  const M = useDarkStyle();
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: M.bg }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 130" fill="none">
          <path d="M0 130 L55 58 L145 58 L200 130 Z" fill={M.card} opacity="0.9"/>
          {[65, 80, 100, 120, 135].map((x, i) => (
            <line key={i} x1={x} y1={58} x2={i < 2 ? x - 45 : i > 2 ? x + 45 : x} y2={130} stroke={M.line} strokeWidth="1" strokeDasharray="5 5"/>
          ))}
          <circle cx="80" cy="72" r="3" fill={'#fbbf24'} opacity="0.9"/>
          <circle cx="115" cy="68" r="3" fill={'#ef4444'} opacity="0.9"/>
          <circle cx="100" cy="63" r="2.5" fill="#60a5fa" opacity="0.9"/>
        </svg>
      </div>
      <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {[['🚧','Roadwork', '#fbbf24'], ['⚠️','Sharp curve', '#ef4444'], ['⛽','Station 800m', '#60a5fa']].map(([icon, label, color]) => (
          <div key={label} style={{ background: M.dark, borderRadius: 4, padding: '2px 6px', display: 'flex', gap: 4, alignItems: 'center', border: `1px solid ${color}33` }}>
            <span style={{ fontSize: '0.5rem' }}>{icon}</span>
            <span style={{ fontSize: '0.5rem', color }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   ROUTING API — RoutingAPIIntro illustrations
   ═══════════════════════════════════════════════════════════════════════════════ */

export function IlloCalculateRoute() {
  const M = useDarkStyle();
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 130" fill="none">
        <rect width="200" height="130" fill={M.bg}/>
        {/* Road grid */}
        <path d="M0 70 Q60 58 100 70 T200 63" stroke={M.card} strokeWidth="6"/>
        <path d="M70 0 L68 130" stroke={M.card} strokeWidth="5"/>
        <path d="M140 0 L136 130" stroke={M.card} strokeWidth="5"/>
        {/* Route leg A→B: glow + stroke */}
        <path d="M22 103 Q55 78 103 56" stroke="rgba(226,0,26,0.18)" strokeWidth="9" strokeLinecap="round"/>
        <path d="M22 103 Q55 78 103 56" stroke="#e2001a" strokeWidth="2.5" strokeLinecap="round" opacity="0.9"/>
        {/* Route leg B→C: glow + stroke */}
        <path d="M103 56 Q138 40 178 26" stroke="rgba(226,0,26,0.18)" strokeWidth="9" strokeLinecap="round"/>
        <path d="M103 56 Q138 40 178 26" stroke="#e2001a" strokeWidth="2.5" strokeLinecap="round" opacity="0.9"/>
        {/* Pin A — green origin */}
        <circle cx="22" cy="103" r="9" fill="rgba(63,185,80,0.18)"/>
        <circle cx="22" cy="103" r="5.5" fill={M.green}/>
        <text x="22" y="106.5" textAnchor="middle" fill="#fff" style={{fontSize:5,fontWeight:700,fontFamily:'system-ui'}}>A</text>
        {/* Pin B — slate waypoint */}
        <circle cx="103" cy="56" r="9" fill={`${M.blue}22`}/>
        <circle cx="103" cy="56" r="5.5" fill={M.blue}/>
        <text x="103" y="59.5" textAnchor="middle" fill="#fff" style={{fontSize:5,fontWeight:700,fontFamily:'system-ui'}}>B</text>
        {/* Pin C — red destination */}
        <circle cx="178" cy="26" r="9" fill="rgba(226,0,26,0.18)"/>
        <circle cx="178" cy="26" r="5.5" fill="#e2001a"/>
        <text x="178" y="29.5" textAnchor="middle" fill="#fff" style={{fontSize:5,fontWeight:700,fontFamily:'system-ui'}}>C</text>
      </svg>
      <div style={{ position: 'absolute', bottom: 8, left: 8, right: 8, background: M.dark, borderRadius: 5, padding: '6px 10px', display: 'flex', justifyContent: 'space-around', border: `1px solid ${M.line}` }}>
        {[['2h 14m', 'Time'], ['189 km', 'Distance'], ['14:32', 'ETA']].map(([v, l]) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.625rem', fontWeight: 700, color: '#fff' }}>{v}</div>
            <div style={{ fontSize: '0.5rem', color: M.dim }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function IlloReachableRange() {
  const M = useDarkStyle();
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 130" fill="none">
        <rect width="200" height="130" fill={M.bg}/>
        <path d="M70 0 L68 130" stroke={M.card} strokeWidth="4" opacity="0.5"/>
        <path d="M130 0 L128 130" stroke={M.card} strokeWidth="4" opacity="0.5"/>
        <path d="M0 65 Q100 60 200 65" stroke={M.card} strokeWidth="4" opacity="0.5"/>
        <path d="M100 30 Q138 28 155 50 Q168 72 155 95 Q138 112 100 115 Q62 112 45 95 Q32 72 45 50 Q62 28 100 30 Z" fill="rgba(88,166,255,0.12)" stroke={M.mid} strokeWidth="1.5" opacity="0.85"/>
        <path d="M100 48 Q122 46 133 62 Q142 78 133 94 Q122 106 100 108 Q78 106 67 94 Q58 78 67 62 Q78 46 100 48 Z" fill="rgba(88,166,255,0.08)" stroke={M.mid} strokeWidth="1" opacity="0.6"/>
        <circle cx="100" cy="65" r="5" fill="#e2001a"/>
        <circle cx="100" cy="65" r="10" fill="rgba(226,0,26,0.2)"/>
      </svg>
      <div style={{ position: 'absolute', top: 8, right: 8, background: M.dark, borderRadius: 4, padding: '4px 8px', border: `1px solid ${M.mid}44` }}>
        <div style={{ fontSize: '0.5rem', color: M.mid, fontWeight: 700 }}>30 min range</div>
        <div style={{ fontSize: '0.5rem', color: M.dim }}>~27 km radius</div>
      </div>
    </div>
  );
}

export function IlloEVRouting() {
  const M = useDarkStyle();
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 130" fill="none">
        <rect width="200" height="130" fill={M.bg}/>
        <path d="M20 105 Q60 80 90 72 Q110 66 140 58 Q165 50 185 38" stroke="#e2001a" strokeWidth="2" strokeLinecap="round" opacity="0.85"/>
        <path d="M20 105 Q60 80 90 72 Q110 66 140 58 Q165 50 185 38" stroke="rgba(226,0,26,0.15)" strokeWidth="8" strokeLinecap="round"/>
        {[[90, 72], [140, 58]].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="8" fill={M.card} stroke={M.green} strokeWidth="1.5"/>
            <text x={cx} y={cy + 3.5} textAnchor="middle" fill={M.green} style={{ fontSize: 7, fontWeight: 700 }}>⚡</text>
          </g>
        ))}
        <circle cx="20" cy="105" r="4" fill={M.green}/>
        <circle cx="185" cy="38" r="4" fill="#e2001a"/>
      </svg>
      <div style={{ position: 'absolute', bottom: 8, left: 8, right: 8, background: M.dark, borderRadius: 5, padding: '5px 10px', border: `1px solid ${M.line}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: '0.5rem', color: M.dim }}>Battery</span>
          <span style={{ fontSize: '0.5rem', color: M.green, fontWeight: 700 }}>18% → 78% → 22%</span>
        </div>
        <div style={{ height: 3, background: M.card, borderRadius: 2 }}>
          <div style={{ height: '100%', width: '78%', background: `linear-gradient(90deg, ${M.green}, ${M.green})`, borderRadius: 2 }}/>
        </div>
      </div>
    </div>
  );
}

export function IlloBatchRouting() {
  const M = useDarkStyle();
  const routes = [
    { color: '#e2001a', w: 70 },
    { color: '#58a6ff', w: 88 },
    { color: '#3fb950', w: 55 },
    { color: '#a78bfa', w: 95 },
  ];
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: '8px 10px' }}>
      <div style={{ fontSize: '0.5rem', color: M.dim, marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Batch · 4 routes</div>
      {routes.map((r, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: r.color, flexShrink: 0 }}/>
          <div style={{ flex: 1, height: 3, background: M.card, borderRadius: 2, border: `1px solid ${M.line}` }}>
            <div style={{ height: '100%', width: `${r.w}%`, background: r.color, borderRadius: 2, opacity: 0.8 }}/>
          </div>
          <span style={{ fontSize: '0.5rem', color: M.muted, fontFamily: 'monospace', width: 28 }}>{r.w} km</span>
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: M.green }}/>
        <span style={{ fontSize: '0.5rem', color: M.green }}>4/4 completed · 340ms</span>
      </div>
    </div>
  );
}

export function IlloMatrixRouting() {
  const M = useDarkStyle();
  const SIZE = 4;
  const colors = ['rgba(226,0,26,0.8)', 'rgba(88,166,255,0.8)', 'rgba(63,185,80,0.6)', 'rgba(251,191,36,0.7)'];
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: '8px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6 }}>
      <div style={{ fontSize: '0.5rem', color: M.dim, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Matrix 4×4 · 16 cells</div>
      {Array.from({ length: SIZE }).map((_, row) => (
        <div key={row} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: colors[row], flexShrink: 0 }}/>
          <div style={{ flex: 1, display: 'flex', gap: 3 }}>
            {Array.from({ length: SIZE }).map((_, col) => {
              const val = ((row * 3 + col * 7) % 90) + 15;
              const intensity = val / 100;
              return (
                <div key={col} style={{ flex: 1, height: 18, borderRadius: 3, background: `rgba(226,0,26,${intensity * 0.7 + 0.1})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>{val}m</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export function IlloWaypointOpt() {
  const M = useDarkStyle();
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: '8px 10px' }}>
      <div style={{ display: 'flex', gap: 6, height: 'calc(100% - 20px)' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.5rem', color: M.dim, marginBottom: 4, textTransform: 'uppercase' }}>Before</div>
          <svg viewBox="0 0 80 90" style={{ width: '100%', height: 'calc(100% - 14px)' }}>
            {[[10,10],[60,30],[15,60],[55,80],[30,45]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="5" fill={M.muted}/>
            ))}
            <polyline points="10,10 60,30 15,60 55,80 30,45" fill="none" stroke={M.muted} strokeWidth="1.5" strokeDasharray="4 3"/>
          </svg>
        </div>
        <div style={{ width: 1, background: M.line, alignSelf: 'stretch' }}/>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.5rem', color: M.green, marginBottom: 4, textTransform: 'uppercase' }}>Optimized</div>
          <svg viewBox="0 0 80 90" style={{ width: '100%', height: 'calc(100% - 14px)' }}>
            {[[10,10],[30,45],[15,60],[55,80],[60,30]].map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="5" fill={M.green} opacity="0.9"/>
                <text x={x} y={y + 3} textAnchor="middle" fill="#000" style={{ fontSize: 5, fontWeight: 700 }}>{i + 1}</text>
              </g>
            ))}
            <polyline points="10,10 30,45 15,60 55,80 60,30" fill="none" stroke={M.green} strokeWidth="1.5" opacity="0.8"/>
          </svg>
        </div>
      </div>
      <div style={{ fontSize: '0.5rem', color: M.green, textAlign: 'center', marginTop: 3 }}>↓ 34% shorter</div>
    </div>
  );
}

export function IlloTurnInstructions() {
  const M = useDarkStyle();
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: '8px 10px' }}>
      <svg style={{ width: '100%', height: 70 }} viewBox="0 0 200 70" fill="none">
        <path d="M20 55 Q70 50 100 35 Q130 20 180 18" stroke="#e2001a" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
        <path d="M20 55 Q70 50 100 35 Q130 20 180 18" stroke="rgba(226,0,26,0.15)" strokeWidth="8" strokeLinecap="round"/>
        <circle cx="100" cy="35" r="6" fill={M.card} stroke={M.blue} strokeWidth="1.5"/>
        <path d="M100 35 L100 22 M96 26 L100 22 L104 26" stroke="#58a6ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="20" cy="55" r="4" fill="#3fb950"/>
        <circle cx="180" cy="18" r="4" fill="#e2001a"/>
      </svg>
      <div style={{ background: M.card, border: `1px solid ${M.line}`, borderRadius: 5, padding: '5px 8px' }}>
        <div style={{ fontSize: '0.5rem', color: M.dim, marginBottom: 2 }}>TURN_RIGHT · 340 m</div>
        <div style={{ fontSize: '0.5rem', color: M.text, lineHeight: 1.3 }}>Turn right onto <span style={{ color: M.blue }}>Spreeufer</span></div>
      </div>
      <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
        {['coded', 'text', 'tagged'].map(t => (
          <span key={t} style={{ fontSize: '0.4375rem', padding: '1px 5px', borderRadius: 3, background: M.card, color: M.dim, border: `1px solid ${M.line}`, fontFamily: 'monospace' }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function IlloRoadShields() {
  const M = useDarkStyle();
  const shields = [
    { ref: 'A10', color: '#1d4ed8' },
    { ref: 'E35', color: '#22c55e' },
    { ref: 'N7',  color: '#e2001a' },
    { ref: 'B14', color: '#f59e0b' },
  ];
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: '8px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ fontSize: '0.5rem', color: M.dim, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Road shields</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
        {shields.map(({ ref, color }) => (
          <div key={ref} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <div style={{ width: 34, height: 22, borderRadius: 4, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid rgba(255,255,255,0.2)' }}>
              <span style={{ fontSize: '0.5rem', fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>{ref}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 8, padding: '4px 7px', background: M.card, borderRadius: 4, border: `1px solid ${M.line}` }}>
        <span style={{ fontSize: '0.4375rem', color: M.dim, fontFamily: 'monospace' }}>Take the </span>
        <span style={{ fontSize: '0.4375rem', fontWeight: 700, color: M.blue, fontFamily: 'monospace', background: M.card, padding: '1px 4px', borderRadius: 2, border: `1px solid ${M.line}` }}>A10</span>
        <span style={{ fontSize: '0.4375rem', color: M.dim, fontFamily: 'monospace' }}> towards Charlottenburg</span>
      </div>
    </div>
  );
}

function IlloLaneGuidance() {
  const M = useDarkStyle();
  const lanes = [
    { dirs: ['←'],     drivable: false },
    { dirs: ['↑'],     drivable: false },
    { dirs: ['↑','→'], drivable: true  },
    { dirs: ['→'],     drivable: true, recommended: true },
  ];
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: '8px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
      <div style={{ fontSize: '0.5rem', color: M.dim, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lane bar · junction ahead</div>
      <div style={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
        {lanes.map((lane, i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            padding: '6px 10px', borderRadius: 6, minWidth: 36,
            background: lane.recommended ? `${M.amber}22` : lane.drivable ? M.card : 'transparent',
            border: lane.recommended ? `1px solid ${M.amber}` : `1px solid ${M.line}`,
            opacity: lane.drivable || lane.recommended ? 1 : 0.35,
          }}>
            {lane.dirs.map(d => (
              <span key={d} style={{ fontSize: '0.8125rem', lineHeight: 1, color: lane.recommended ? M.amber : lane.drivable ? M.text : M.muted }}>{d}</span>
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <div style={{ width: 6, height: 6, borderRadius: 2, background: `${M.amber}22`, border: `1px solid ${M.amber}` }}/>
          <span style={{ fontSize: '0.4375rem', color: M.dim }}>recommended</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <div style={{ width: 6, height: 6, borderRadius: 2, background: M.card, border: `1px solid ${M.line}` }}/>
          <span style={{ fontSize: '0.4375rem', color: M.dim }}>drivable</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   ROUTING API — additional endpoints (v2/v3)
   ═══════════════════════════════════════════════════════════════════════════════ */

function IlloRoutingComputeToll() {
  const M = useDarkStyle();
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ fontSize: '0.5rem', color: M.dim, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Compute Toll Amounts</div>
      <svg viewBox="0 0 200 55" style={{ width: '100%', height: 55, flexShrink: 0 }} fill="none">
        <path d="M0 38 Q100 34 200 38" stroke={M.line} strokeWidth="8" strokeLinecap="round"/>
        <rect x="98" y="16" width="4" height="28" rx="2" fill={M.muted}/>
        <rect x="100" y="16" width="48" height="5" rx="2" fill="#e2001a" opacity="0.85"/>
        <rect x="82" y="10" width="18" height="30" rx="3" fill={M.card}/>
      </svg>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3 }}>
        {[['Base toll', '€2.40', null], ['EV discount', '–€0.60', 'green'], ['Total', '€1.80', 'blue']].map(([label, val, acc]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.4375rem', color: M.dim }}>{label}</span>
            <span style={{ fontSize: '0.4375rem', fontWeight: 700, color: acc === 'green' ? M.green : acc === 'blue' ? M.blue : M.text, fontFamily: 'monospace' }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function IlloRoutingWeather() {
  const M = useDarkStyle();
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 130" fill="none">
        <rect width="200" height="130" fill={M.bg}/>
        <path d="M20 70 Q60 54 90 50" stroke="#e2001a" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
        <path d="M90 50 Q130 44 165 38" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.8" strokeDasharray="5 3"/>
        <ellipse cx="130" cy="32" rx="22" ry="11" fill="#475569" opacity="0.5"/>
        <ellipse cx="116" cy="35" rx="16" ry="9" fill="#475569" opacity="0.5"/>
        {[108, 118, 128, 138, 148].map((x, i) => (
          <line key={i} x1={x} y1={43} x2={x - 3} y2={53} stroke="#58a6ff" strokeWidth="1.2" opacity="0.45" strokeLinecap="round"/>
        ))}
        <circle cx="20" cy="70" r="5" fill={M.green}/>
        <circle cx="165" cy="38" r="5" fill="#e2001a"/>
      </svg>
      <div style={{ position: 'absolute', bottom: 8, left: 8, right: 8, background: M.dark, borderRadius: 5, padding: '5px 10px', border: `1px solid ${M.line}`, display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.5rem', color: '#fff' }}>Rain · Route adjusted</span>
        <span style={{ fontSize: '0.5rem', color: M.amber, fontWeight: 700 }}>7°C</span>
      </div>
    </div>
  );
}

function IlloRoutingDataFreshness() {
  const M = useDarkStyle();
  const items = [
    { label: 'Traffic data',  pct: 100, color: '#22c55e' },
    { label: 'Road closures', pct: 75,  color: '#22c55e' },
    { label: 'Speed limits',  pct: 40,  color: '#fbbf24' },
  ];
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: '8px 10px' }}>
      <div style={{ fontSize: '0.5rem', color: M.dim, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Data Freshness</div>
      {items.map((item) => (
        <div key={item.label} style={{ marginBottom: 8 }}>
          <span style={{ fontSize: '0.4375rem', color: M.dim, display: 'block', marginBottom: 2 }}>{item.label}</span>
          <div style={{ height: 5, background: M.card, borderRadius: 2, border: `1px solid ${M.line}` }}>
            <div style={{ height: '100%', width: `${item.pct}%`, background: item.color === '#22c55e' ? M.green : item.color === '#fbbf24' ? M.amber : item.color, borderRadius: 2, opacity: 0.85 }}/>
          </div>
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 4 }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: M.green }}/>
        <span style={{ fontSize: '0.4375rem', color: M.green }}>Live feed · auto-refresh</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   LONG-DISTANCE EV ROUTING — LDEVRIntro illustrations
   ═══════════════════════════════════════════════════════════════════════════════ */

function IlloLDEVRRoute() {
  const M = useDarkStyle();
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 130" fill="none">
        <rect width="200" height="130" fill={M.bg}/>
        <path d="M20 105 Q60 80 90 72 Q110 66 140 58 Q165 50 185 38" stroke="#e2001a" strokeWidth="2" strokeLinecap="round" opacity="0.85"/>
        <path d="M20 105 Q60 80 90 72 Q110 66 140 58 Q165 50 185 38" stroke="rgba(226,0,26,0.15)" strokeWidth="8" strokeLinecap="round"/>
        {[[90, 72], [140, 58]].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="8" fill={M.card} stroke={M.green} strokeWidth="1.5"/>
            <text x={cx} y={cy + 3.5} textAnchor="middle" fill={M.green} style={{ fontSize: 7, fontWeight: 700 }}>⚡</text>
          </g>
        ))}
        <circle cx="20" cy="105" r="4" fill={M.green}/>
        <circle cx="185" cy="38" r="4" fill="#e2001a"/>
      </svg>
      <div style={{ position: 'absolute', bottom: 8, left: 8, right: 8, background: M.dark, borderRadius: 5, padding: '5px 10px', border: `1px solid ${M.line}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: '0.5rem', color: M.dim }}>Battery</span>
          <span style={{ fontSize: '0.5rem', color: M.green, fontWeight: 700 }}>18% → 78% → 22%</span>
        </div>
        <div style={{ height: 3, background: M.card, borderRadius: 2 }}>
          <div style={{ height: '100%', width: '78%', background: `linear-gradient(90deg, ${M.green}, ${M.green})`, borderRadius: 2 }}/>
        </div>
      </div>
    </div>
  );
}

function IlloLDEVRBatch() {
  const M = useDarkStyle();
  const routes = [
    { color: '#22c55e', w: 85 },
    { color: '#3fb950', w: 62 },
    { color: '#58a6ff', w: 91 },
    { color: '#a78bfa', w: 74 },
  ];
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: '8px 10px' }}>
      <div style={{ fontSize: '0.5rem', color: M.dim, marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Batch EV · 4 routes</div>
      {routes.map((r, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: r.color, flexShrink: 0 }}/>
          <div style={{ flex: 1, height: 3, background: M.card, borderRadius: 2, border: `1px solid ${M.line}` }}>
            <div style={{ height: '100%', width: `${r.w}%`, background: r.color, borderRadius: 2, opacity: 0.8 }}/>
          </div>
          <span style={{ fontSize: '0.4375rem', color: M.muted, fontFamily: 'monospace', flexShrink: 0 }}>⚡ {i + 1}</span>
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: M.green }}/>
        <span style={{ fontSize: '0.5rem', color: M.green }}>4/4 completed · async</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   LDEVR — additional endpoints (v2)
   ═══════════════════════════════════════════════════════════════════════════════ */

function IlloLDEVRVehicleBrand() {
  const M = useDarkStyle();
  const brands = [
    { name: 'BMW',   color: '#1c69d4', selected: true  },
    { name: 'Tesla', color: '#cc0000', selected: false },
    { name: 'Audi',  color: '#bb0a14', selected: false },
  ];
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: '8px 10px' }}>
      <div style={{ fontSize: '0.5rem', color: M.dim, marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Vehicle Brand Lookup</div>
      {brands.map((b, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5, padding: '4px 6px', borderRadius: 5, background: b.selected ? M.card : 'transparent', border: b.selected ? `1px solid ${M.blue}` : `1px solid transparent` }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: b.color, flexShrink: 0 }}/>
          <span style={{ fontSize: '0.5rem', color: b.selected ? M.text : M.dim, fontWeight: b.selected ? 700 : 400, flex: 1 }}>{b.name}</span>
          {b.selected && <span style={{ fontSize: '0.4375rem', color: M.green }}>✓</span>}
        </div>
      ))}
      <div style={{ marginTop: 4, padding: '3px 6px', background: M.card, borderRadius: 3, border: `1px solid ${M.line}`, fontFamily: 'monospace', fontSize: '0.4375rem', color: M.muted }}>variantId: 54B9…</div>
    </div>
  );
}

function IlloLDEVROemEmsp() {
  const M = useDarkStyle();
  const networks = [
    { name: 'Ionity',   compat: true  },
    { name: 'Fastned',  compat: true  },
    { name: 'bp pulse', compat: false },
  ];
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: '8px 10px' }}>
      <div style={{ fontSize: '0.5rem', color: M.dim, marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.06em' }}>OEM EMSP Networks</div>
      {networks.map((n, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: n.compat ? M.green : M.muted, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.5rem', color: '#fff' }}>{n.compat ? '⚡' : '—'}</span>
          </div>
          <span style={{ fontSize: '0.4375rem', color: n.compat ? M.dim : M.muted, flex: 1 }}>{n.name}</span>
          <span style={{ fontSize: '0.4375rem', color: n.compat ? M.green : M.muted, fontFamily: 'monospace' }}>{n.compat ? 'OEM' : '—'}</span>
        </div>
      ))}
    </div>
  );
}

function IlloLDEVRComputeToll() {
  const M = useDarkStyle();
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ fontSize: '0.5rem', color: M.dim, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Compute Toll · EV</div>
      <svg viewBox="0 0 200 55" style={{ width: '100%', height: 55, flexShrink: 0 }} fill="none">
        <path d="M0 38 Q100 34 200 38" stroke={M.line} strokeWidth="8" strokeLinecap="round"/>
        <rect x="98" y="16" width="4" height="28" rx="2" fill={M.muted}/>
        <rect x="100" y="16" width="48" height="5" rx="2" fill="#e2001a" opacity="0.85"/>
        <rect x="82" y="10" width="18" height="30" rx="3" fill={M.card}/>
        <circle cx="172" cy="22" r="10" fill={`${M.green}18`} stroke={M.green} strokeWidth="1.5"/>
        <text x="172" y="26" textAnchor="middle" fill={M.green} style={{ fontSize: 8, fontWeight: 700 }}>EV</text>
      </svg>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3 }}>
        {[['Base toll', '€2.40', null], ['EV exemption', '–€1.20', 'green'], ['Total', '€1.20', 'blue']].map(([label, val, acc]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.4375rem', color: M.dim }}>{label}</span>
            <span style={{ fontSize: '0.4375rem', fontWeight: 700, color: acc === 'green' ? M.green : acc === 'blue' ? M.blue : M.text, fontFamily: 'monospace' }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function IlloLDEVRChargingParks() {
  const M = useDarkStyle();
  const hours = [['Mon–Fri', '06:00–22:00'], ['Sat', '07:00–21:00'], ['Sun', '08:00–20:00']];
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: '8px 10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
        <span style={{ fontSize: '0.5rem', color: M.dim, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Park Hours</span>
        <span style={{ fontSize: '0.5rem', color: M.green, fontWeight: 700 }}>12/16 free</span>
      </div>
      {hours.map(([day, hrs], i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, padding: '3px 6px', background: M.card, borderRadius: 4, border: `1px solid ${M.line}` }}>
          <span style={{ fontSize: '0.4375rem', color: M.dim }}>{day}</span>
          <span style={{ fontSize: '0.4375rem', color: M.muted, fontFamily: 'monospace' }}>{hrs}</span>
        </div>
      ))}
    </div>
  );
}

function IlloLDEVRWeather() {
  const M = useDarkStyle();
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 130" fill="none">
        <rect width="200" height="130" fill={M.bg}/>
        <path d="M20 68 Q60 52 90 48" stroke="#e2001a" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
        <path d="M90 48 Q130 42 165 36" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.8" strokeDasharray="5 3"/>
        {[[90, 48], [140, 42]].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="8" fill={M.card} stroke={M.green} strokeWidth="1.5"/>
            <text x={cx} y={cy + 3.5} textAnchor="middle" fill={M.green} style={{ fontSize: 7, fontWeight: 700 }}>⚡</text>
          </g>
        ))}
        <ellipse cx="128" cy="30" rx="20" ry="10" fill="#475569" opacity="0.4"/>
        {[112, 122, 132, 142].map((x, i) => (
          <line key={i} x1={x} y1={40} x2={x - 3} y2={50} stroke="#58a6ff" strokeWidth="1.2" opacity="0.45" strokeLinecap="round"/>
        ))}
        <circle cx="20" cy="68" r="4" fill={M.green}/>
        <circle cx="165" cy="36" r="4" fill="#e2001a"/>
      </svg>
      <div style={{ position: 'absolute', bottom: 8, left: 8, right: 8, background: M.dark, borderRadius: 5, padding: '5px 10px', border: `1px solid ${M.line}`, display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.5rem', color: '#fff' }}>Cold weather · EV</span>
        <span style={{ fontSize: '0.5rem', color: M.amber, fontWeight: 700 }}>–12% range</span>
      </div>
    </div>
  );
}

function IlloLDEVRDataFreshness() {
  const M = useDarkStyle();
  const items = [
    { label: 'Charger status', pct: 100, color: '#22c55e' },
    { label: 'Park capacity',  pct: 80,  color: '#22c55e' },
    { label: 'Pricing',        pct: 55,  color: '#fbbf24' },
    { label: 'Amenities',      pct: 15,  color: '#f85149' },
  ];
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: '8px 10px' }}>
      <div style={{ fontSize: '0.5rem', color: M.dim, marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Data Freshness</div>
      {items.map((item) => (
        <div key={item.label} style={{ marginBottom: 6 }}>
          <span style={{ fontSize: '0.4375rem', color: M.dim, display: 'block', marginBottom: 1 }}>{item.label}</span>
          <div style={{ height: 4, background: M.card, borderRadius: 2, border: `1px solid ${M.line}` }}>
            <div style={{ height: '100%', width: `${item.pct}%`, background: item.color === '#22c55e' ? M.green : item.color === '#fbbf24' ? M.amber : item.color === '#f85149' ? M.red : item.color, borderRadius: 2, opacity: 0.85 }}/>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   ANA (Autonomous Navigation App) — ANAIntro illustrations
   ═══════════════════════════════════════════════════════════════════════════════ */

export function IlloVIL() {
  const M = useDarkStyle();
  const signals = [['Battery SoC', '74%', M.green], ['Connector type', 'CCS2', M.blue], ['Speed', '87 km/h', M.amber], ['GDPR consent', 'Granted', M.green]];
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: M.text, marginBottom: 2 }}>VIL — Vehicle signals</div>
      <div style={{ fontSize: '0.5rem', color: M.green, marginBottom: 8 }}>← Feeding into ANA</div>
      {signals.map(([label, value, color]) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0', borderBottom: `1px solid ${M.line}` }}>
          <div style={{ flex: 1, fontSize: '0.5rem', color: M.dim }}>{label}</div>
          <span style={{ fontSize: '0.5rem', fontWeight: 600, color }}>{value}</span>
        </div>
      ))}
    </div>
  );
}

export function IlloCIL() {
  const M = useDarkStyle();
  const cmds = [['navigateTo(destination)', 'Sets active route'], ['cancelNavigation()', 'Ends session'], ['searchNearby(query)', 'Returns POI list']];
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: M.text, marginBottom: 2 }}>CIL — Control API</div>
      <div style={{ fontSize: '0.5rem', color: M.purple, marginBottom: 8 }}>→ Commanding ANA</div>
      {cmds.map(([fn, desc]) => (
        <div key={fn} style={{ background: M.card, border: `1px solid ${M.line}`, borderRadius: 4, padding: '5px 7px', marginBottom: 4 }}>
          <div style={{ fontSize: '0.5rem', fontFamily: 'monospace', color: M.purple }}>{fn}</div>
          <div style={{ fontSize: '0.5rem', color: M.dim, marginTop: 1 }}>{desc}</div>
        </div>
      ))}
    </div>
  );
}

function IlloANATheming() {
  const M = useDarkStyle();
  const tokens = [
    { name: '--brand-primary', from: '#e2001a', to: '#0066ff' },
    { name: '--corner-radius', from: '4dp', to: '12dp', text: true },
    { name: '--font-family',   from: 'Roboto', to: 'Inter', text: true },
  ];
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: '10px 12px' }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: M.dim, marginBottom: 9, textTransform: 'uppercase', letterSpacing: '0.06em' }}>OEM Theme tokens</div>
      {tokens.map(({ name, from, to, text }) => (
        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
          {!text
            ? <div style={{ width: 26, height: 14, borderRadius: 3, background: from, flexShrink: 0 }} />
            : <div style={{ width: 26, height: 14, borderRadius: 3, background: M.card, border: `1px solid ${M.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '0.5rem', color: '#e2001a', fontFamily: 'monospace' }}>{from}</span>
              </div>}
          <span style={{ fontSize: '0.5rem', color: M.dim, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>{name}</span>
          <span style={{ fontSize: '0.875rem', color: M.dim }}>→</span>
          {!text
            ? <div style={{ width: 26, height: 14, borderRadius: 3, background: to, flexShrink: 0 }} />
            : <div style={{ width: 26, height: 14, borderRadius: 3, background: M.card, border: `1px solid ${M.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '0.5rem', color: '#0066ff', fontFamily: 'monospace' }}>{to}</span>
              </div>}
        </div>
      ))}
    </div>
  );
}

function IlloANATraffic() {
  const M = useDarkStyle();
  return (
    <div style={{ background: M.bg, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <svg width="100%" height="100%" viewBox="0 0 100 70" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute' }}>
          <rect width="100" height="70" fill={M.bg}/>
          <path d="M5 65 Q35 42 55 36 T95 18" stroke={M.blue} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.65"/>
          <path d="M5 65 Q40 30 68 26 T95 18" stroke={M.green} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="5 3" fill="none" opacity="0.55"/>
          <circle cx="55" cy="36" r="4" fill={M.blue} opacity="0.8"/>
        </svg>
      </div>
      <div style={{ padding: '6px 8px', background: M.dark, borderTop: `1px solid ${M.line}` }}>
        <div style={{ fontSize: '0.5rem', fontWeight: 700, color: M.text, marginBottom: 2 }}>Better route</div>
        <div style={{ fontSize: '0.5rem', color: M.green, marginBottom: 5 }}>6 min faster · Less traffic</div>
        <div style={{ display: 'flex', gap: 4 }}>
          <div style={{ flex: 1, background: M.blue, borderRadius: 3, padding: '3px 0', textAlign: 'center', fontSize: '0.45rem', color: '#fff', fontWeight: 600 }}>Accept</div>
          <div style={{ flex: 1, background: 'transparent', border: `1px solid ${M.line}`, borderRadius: 3, padding: '3px 0', textAlign: 'center', fontSize: '0.45rem', color: M.dim }}>Dismiss</div>
        </div>
      </div>
    </div>
  );
}

function IlloANAMap() {
  const M = useDarkStyle();
  return (
    <div style={{ background: M.bg, height: '100%', position: 'relative', overflow: 'hidden' }}>
      <svg width="100%" height="100%" viewBox="0 0 120 80" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute' }}>
        <rect width="120" height="80" fill={M.bg}/>
        <path d="M0 42 Q30 38 60 42 T120 38" stroke={M.card} strokeWidth="5"/>
        <line x1="45" y1="0" x2="44" y2="80" stroke={M.card} strokeWidth="4"/>
        <line x1="88" y1="0" x2="86" y2="80" stroke={M.card} strokeWidth="4"/>
        <rect x="6" y="12" width="20" height="16" rx="1" fill={M.line}/>
        <rect x="28" y="8" width="12" height="20" rx="1" fill={M.line}/>
        <rect x="52" y="6" width="16" height="24" rx="1" fill={M.card}/>
        <rect x="92" y="10" width="18" height="17" rx="1" fill={M.line}/>
        <path d="M12 72 Q40 50 60 44 T108 24" stroke={M.blue} strokeWidth="2.5" strokeLinecap="round" opacity="0.8"/>
        <circle cx="60" cy="44" r="4" fill={M.blue}/><circle cx="60" cy="44" r="2" fill={M.dark}/>
      </svg>
      <div style={{ position: 'absolute', top: 6, left: 6, background: M.dark, borderRadius: 4, padding: '2px 5px' }}>
        <span style={{ fontSize: '0.4rem', color: M.text, fontWeight: 600 }}>3D Vector Map</span>
      </div>
    </div>
  );
}

function IlloANAEVSearch() {
  const M = useDarkStyle();
  const stations = [['Ionity','350 kW','3/4'],['Fastned','300 kW','2/4'],['bp pulse','50 kW','5/6']];
  return (
    <div style={{ background: M.bg, height: '100%', padding: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ background: M.card, border: `1px solid ${M.line}`, borderRadius: 4, padding: '3px 6px', fontSize: '0.45rem', color: M.dim }}>🔍 Charging stations near me…</div>
      <div style={{ flex: 1, display: 'flex', gap: 4 }}>
        <div style={{ width: '42%', background: M.card, borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
          <svg width="100%" height="100%" viewBox="0 0 40 60" style={{ position: 'absolute' }}>
            <rect width="40" height="60" fill={M.card}/>
            {[[12,22,M.green],[22,14,M.blue],[30,32,M.blue]].map(([cx,cy,col],i) => (
              <g key={i}><circle cx={cx} cy={cy} r="5" fill={col} opacity="0.8"/><text x={cx} y={cy+2} textAnchor="middle" fill="#fff" style={{fontSize:5}}>⚡</text></g>
            ))}
          </svg>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {stations.map(([name, kw, avail], i) => (
            <div key={name} style={{ background: M.card, border: `1px solid ${i===0?M.green:M.line}`, borderRadius: 3, padding: '3px 4px' }}>
              <div style={{ fontSize: '0.45rem', fontWeight: 600, color: M.text }}>{name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.4rem', color: M.dim }}>⚡ {kw}</span>
                <span style={{ fontSize: '0.4rem', color: M.green }}>{avail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function IlloANALDRoute() {
  const M = useDarkStyle();
  return (
    <div style={{ background: M.bg, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <svg width="100%" height="100%" viewBox="0 0 120 75" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute' }}>
          <rect width="120" height="75" fill={M.bg}/>
          <path d="M10 68 Q35 48 56 42 Q78 36 96 30 T116 18" stroke={M.blue} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.75"/>
          {[[56,42],[96,30]].map(([cx,cy],i) => (
            <g key={i}><circle cx={cx} cy={cy} r="7" fill={M.card} stroke={M.green} strokeWidth="1.5"/><text x={cx} y={cy+2} textAnchor="middle" fill={M.green} style={{fontSize:6}}>⚡</text></g>
          ))}
          <circle cx="10" cy="68" r="5" fill={M.green}/><circle cx="116" cy="18" r="5" fill={M.blue}/>
        </svg>
      </div>
      <div style={{ padding: '5px 8px', background: M.card, borderTop: `1px solid ${M.line}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <span style={{ fontSize: '0.45rem', color: M.text, fontWeight: 600 }}>5 hr 26 min · 513 km</span>
          <span style={{ fontSize: '0.45rem', color: M.green }}>78% arrival</span>
        </div>
        <div style={{ background: M.line, borderRadius: 3, height: 5, overflow: 'hidden' }}>
          <div style={{ background: M.green, width: '78%', height: '100%', borderRadius: 3 }}/>
        </div>
      </div>
    </div>
  );
}

function IlloANADriverExp() {
  const M = useDarkStyle();
  return (
    <div style={{ background: M.dark, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '5px 8px', display: 'flex', alignItems: 'center', gap: 5, borderBottom: `1px solid ${M.card}` }}>
        <div style={{ fontSize: '0.6rem', color: M.text }}>↱</div>
        <div>
          <div style={{ fontSize: '0.45rem', fontWeight: 700, color: M.text }}>Turn right · 320 m</div>
          <div style={{ fontSize: '0.4rem', color: M.dim }}>onto Main St</div>
        </div>
      </div>
      <div style={{ flex: 1, background: M.bg, position: 'relative', overflow: 'hidden' }}>
        <svg width="100%" height="100%" viewBox="0 0 100 50" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute' }}>
          <rect width="100" height="50" fill={M.bg}/>
          <path d="M5 45 Q40 28 65 32 T98 18" stroke={M.blue} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.65"/>
          <circle cx="65" cy="32" r="4" fill={M.blue}/><circle cx="65" cy="32" r="2" fill={M.dark}/>
        </svg>
      </div>
      <div style={{ display: 'flex', padding: '4px 8px', gap: 0, justifyContent: 'space-around', borderTop: `1px solid ${M.card}` }}>
        {[['14:32','ETA'],['22m','Time'],['8.4km','Dist']].map(([v,l]) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.5rem', fontWeight: 700, color: M.text }}>{v}</div>
            <div style={{ fontSize: '0.4rem', color: M.dim }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   LIGHT-BLUE ILLUSTRATION SYSTEM
   Flat blue palette · diamond watermark · pill placeholders · navy chrome
   ═══════════════════════════════════════════════════════════════════════════════ */

// C is now read from context — see IlloStyleContext.jsx THEMES

function DW({ x = 0, y = 0, w = 200, h = 130, op = 0.35 }) {
  const { palette: C } = useIlloStyle();
  const size = 38; const diamonds = [];
  for (let row = -1; row < Math.ceil(h / size) + 2; row++) {
    for (let col = -1; col < Math.ceil(w / size) + 2; col++) {
      const cx = x + col * size + (row % 2 === 0 ? 0 : size / 2);
      const cy = y + row * size * 0.6;
      diamonds.push(<rect key={`${row}-${col}`} x={cx - size*0.38} y={cy - size*0.38} width={size*0.76} height={size*0.76} rx="3" fill="none" stroke={C.soft} strokeWidth="1.5" transform={`rotate(45,${cx},${cy})`} opacity={op}/>);
    }
  }
  return <>{diamonds}</>;
}
function LP({ x, y, w, h = 10, color, rx }) {
  const { palette: C } = useIlloStyle();
  return <rect x={x} y={y} width={w} height={h} rx={rx ?? h / 2} fill={color ?? C.panel}/>;
}
function NA({ cx, cy, size = 22, color }) {
  const { palette: C } = useIlloStyle();
  const _color = color ?? C.white;
  const s = size / 18;
  return (
    <g transform={`translate(${cx - 9*s},${cy - 11*s}) scale(${s})`}>
      <rect x="7" y="8" width="4" height="9" rx="2" fill={_color}/>
      <polygon points="9,0 16,8 12,8 12,7 6,7 6,8 2,8" fill={_color}/>
    </g>
  );
}

/* ── UX Library light variants ───────────────────────────────────────────────── */

function L_EV() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      {/* Title + accent subtitle */}
      <LP x="10" y="8" w="90" h="10" color={C.navy}/>
      <LP x="10" y="21" w="72" h="8" color={C.accent ?? '#22c55e'}/>
      {/* Filter pills: Speed (active), Payment, Services */}
      {[true,false,false].map((active,i) => (
        <g key={i}>
          <rect x={10+i*62} y="32" width="56" height="14" rx="7"
            fill={active?C.mid:C.panel} stroke={active?'none':C.border} strokeWidth="1"/>
          <LP x={16+i*62} y="37" w={active?44:38} h="6" color={active?C.white:C.soft}/>
        </g>
      ))}
      {/* Result rows: y=52, 78, 104 — spacing=26 */}
      {[C.accent ?? '#22c55e', C.accent ?? '#22c55e', C.mid].map((col,i) => (
        <g key={i}>
          {i>0 && <line x1="10" y1={52+i*26} x2="190" y2={52+i*26} stroke={C.border} strokeWidth="0.75" opacity="0.5"/>}
          <circle cx="22" cy={63+i*26} r="9" fill={col}/>
          <text x="22" y={67+i*26} textAnchor="middle" fill={C.white}
            style={{fontSize:8,fontWeight:700,fontFamily:'system-ui'}}>{i+1}</text>
          <LP x="38" y={57+i*26} w="86" h="9" color={C.navy}/>
          <LP x="38" y={69+i*26} w="56" h="7" color={C.soft}/>
          <LP x="158" y={59+i*26} w="30" h="8" color={C.accent ?? '#22c55e'}/>
        </g>
      ))}
    </svg>
  );
}

function L_SearchResult() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      {/* Search bar */}
      <rect x="10" y="8" width="180" height="22" rx="8" fill={C.white} stroke={C.border} strokeWidth="1.5"/>
      <circle cx="22" cy="19" r="5" fill={C.panel}/>
      <LP x="34" y="14" w="106" h="10" color={C.panel}/>
      {/* Result rows: y=34, 62, 90 — spacing=28, row h=26 */}
      {[0,1,2].map(i => (
        <g key={i}>
          {i>0 && <line x1="10" y1={34+i*28} x2="190" y2={34+i*28} stroke={C.border} strokeWidth="0.75" opacity="0.5"/>}
          <rect x="14" y={39+i*28} width="16" height="16" rx="4" fill={C.soft} opacity="0.55"/>
          <LP x="38" y={41+i*28} w="115" h="9" color={C.navy}/>
          <LP x="38" y={53+i*28} w="52" h="7" color={C.soft}/>
        </g>
      ))}
    </svg>
  );
}

function L_NavControls() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <clipPath id="lnc-map"><rect x="30" y="0" width="170" height="130" rx="0"/></clipPath>
      <g clipPath="url(#lnc-map)">
        <rect x="30" y="0" width="170" height="130" fill={C.white}/>
        <DW x={30} y={0} w={170} h={130} op={0.4}/>
        <path d="M50 100 Q100 70 140 65 T200 50" stroke={C.mid} strokeWidth="3" strokeLinecap="round" opacity="0.7"/>
        <circle cx="140" cy="65" r="6" fill={C.navy}/>
        <circle cx="140" cy="65" r="3" fill={C.white}/>
      </g>
      <rect x="0" y="0" width="30" height="130" fill={C.dark}/>
      {['🔍','⚡','🔇','⚙️'].map((b,i) => (
        <g key={b}>
          <rect x="5" y={20+i*24} width="20" height="18" rx="5" fill="rgba(255,255,255,0.15)"/>
          <text x="15" y={32+i*24} textAnchor="middle" style={{fontSize:9}}>{b}</text>
        </g>
      ))}
    </svg>
  );
}

function L_AIVoice() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <LP x="20" y="8" w="55" h="8" color={C.panel}/>
      <circle cx="85" cy="12" r="5" fill={C.mid} opacity="0.5"/>
      <path d="M83 9 Q85 7 87 9 L87 14 Q85 16 83 14 Z" fill={C.white}/>
      {[3,5,8,11,8,12,7,10,5,3,8,4].map((h,i) => (
        <rect key={i} x={20+i*7} y={30-h/2} width="4" height={h} rx="2" fill={C.mid} opacity={0.5+i*0.04}/>
      ))}
      <rect x="10" y="48" width="130" height="32" rx="12" fill={C.panel}/>
      <text x="20" y="61" fill={C.navy} style={{fontSize:6,fontFamily:'system-ui',fontWeight:600}}>"Take me to nearest charger"</text>
      <text x="20" y="73" fill={C.pill2} style={{fontSize:5.5,fontFamily:'system-ui'}}>voice input</text>
      <rect x="60" y="90" width="130" height="34" rx="12" fill={C.dark}/>
      <text x="72" y="102" fill={'#22c55e'} style={{fontSize:5.5,fontFamily:'monospace',fontWeight:700}}>NAVIGATE_TO_EV_CHARGING</text>
      <text x="72" y="114" fill={C.white} style={{fontSize:5.5,fontFamily:'system-ui'}}>Ionity · 4.2 km · Route set ✓</text>
    </svg>
  );
}

function L_Route() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <LP x="10" y="8" w="120" h="11" color={C.navy}/>
      <LP x="10" y="23" w="80" h="9" color={C.soft}/>
      {/* Journey line */}
      <line x1="28" y1="45" x2="28" y2="118" stroke={C.soft} strokeWidth="2" strokeDasharray="4 3"/>
      {[{y:45,fill:'#22c55e',label:'Current location'},{y:72,fill:C.mid,label:'bp pulse · 20 min'},{y:98,fill:C.mid,label:'Fastned · 25 min'},{y:118,fill:C.navy,label:'Destination'}].map(({y,fill,label},i) => (
        <g key={i}>
          <circle cx="28" cy={y} r="7" fill={fill}/>
          <LP x="42" y={y-6} w="120" h="11" color={i===0||i===3?C.navy:C.panel}/>
          {i>0&&i<3&&<LP x="42" y={y+8} w="80" h="8" color={C.soft}/>}
        </g>
      ))}
    </svg>
  );
}

function L_ColourSystem() {
  const { palette: C } = useIlloStyle();
  const swatches = ['#e2001a','#5B8AC5','#A8C8E8','#C8DCF5','#1B3D6E','#22c55e'];
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <DW x={0} y={0} w={200} h={130} op={0.2}/>
      <LP x="60" y="10" w="80" h="12" color={C.navy}/>
      {swatches.map((c,i) => (
        <rect key={i} x={15+i*29} y="35" width="24" height="24" rx="6" fill={c} stroke={C.white} strokeWidth="1.5"/>
      ))}
      {[['Brand','#e2001a'],['Mid','#5B8AC5'],['Navy','#1B3D6E']].map(([label,col],i) => (
        <g key={label}>
          <rect x="12" y={75+i*18} width="12" height="12" rx="3" fill={col}/>
          <LP x="30" y={76+i*18} w="60" h="10" color={C.navy}/>
          <LP x="100" y={76+i*18} w="55" h="10" color={C.panel}/>
        </g>
      ))}
    </svg>
  );
}

function L_HorizonPanel() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <clipPath id="lhp-map"><rect x="0" y="0" width="130" height="130"/></clipPath>
      <g clipPath="url(#lhp-map)">
        <rect width="130" height="130" fill={C.white}/>
        <DW x={0} y={0} w={130} h={130} op={0.4}/>
        <path d="M10 95 Q65 60 100 72 T130 55" stroke={C.mid} strokeWidth="3" strokeLinecap="round" opacity="0.7"/>
        <circle cx="100" cy="72" r="5" fill={C.navy}/>
        <circle cx="100" cy="72" r="3" fill={C.white}/>
      </g>
      <rect x="130" y="0" width="70" height="130" fill={C.dark}/>
      <rect x="130" y="0" width="70" height="42" fill="rgba(34,197,94,0.2)"/>
      <NA cx="150" cy="20" size={18} color={C.white}/>
      <LP x="165" y="13" w="28" h="9" color={C.white}/>
      <LP x="165" y="26" w="22" h="8" color={C.soft}/>
      {[['🚧', '#fbbf24'],['⛽',C.soft]].map(([icon,col],i) => (
        <g key={icon}>
          <text x="142" y={56+i*18} style={{fontSize:11}}>{icon}</text>
          <LP x="158" y={49+i*18} w="36" h="11" color="rgba(255,255,255,0.15)"/>
        </g>
      ))}
      <line x1="130" y1="96" x2="200" y2="96" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
      {[['14:32','ETA'],[' 18m ','Time']].map(([v,l],i) => (
        <g key={l}>
          <text x={148+i*34} y="109" textAnchor="middle" fill={C.white} style={{fontSize:9,fontWeight:700,fontFamily:'system-ui'}}>{v}</text>
          <text x={148+i*34} y="121" textAnchor="middle" fill={C.soft} style={{fontSize:7,fontFamily:'system-ui'}}>{l}</text>
        </g>
      ))}
    </svg>
  );
}

function L_Cluster() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      {/* Left speed gauge */}
      {(() => {
        const r=22, circ=2*Math.PI*r, arcLen=circ*(220/360), gapLen=circ-arcLen, ofs=-(gapLen/2);
        const speedArc=arcLen*0.60, battArc=arcLen*0.74;
        const da=(f)=>`${f.toFixed(1)} ${(circ-f).toFixed(1)}`;
        const daFull=`${arcLen.toFixed(1)} ${gapLen.toFixed(1)}`;
        return (<>
          <circle cx="26" cy="68" r={r} fill={C.white} stroke={C.border} strokeWidth="1"/>
          <circle cx="26" cy="68" r={r} fill="none" stroke={C.panel} strokeWidth="5" strokeDasharray={daFull} strokeDashoffset={ofs} strokeLinecap="round"/>
          <circle cx="26" cy="68" r={r} fill="none" stroke={C.dark} strokeWidth="5" strokeDasharray={da(speedArc)} strokeDashoffset={ofs} strokeLinecap="round"/>
          <text x="26" y="72" textAnchor="middle" fill={C.dark} style={{fontSize:12,fontWeight:800,fontFamily:'system-ui'}}>72</text>
          <text x="26" y="81" textAnchor="middle" fill={C.mid} style={{fontSize:5,fontFamily:'system-ui'}}>km/h</text>
          {/* Centre panel */}
          <clipPath id="lc-cp"><rect x="54" y="8" width="92" height="114" rx="8"/></clipPath>
          <rect x="54" y="8" width="92" height="114" rx="8" fill={C.white} stroke={C.border} strokeWidth="1"/>
          <g clipPath="url(#lc-cp)">
            <DW x={54} y={8} w={92} h={50} op={0.25}/>
            <path d="M54 42 Q82 28 100 36 T146 26" stroke={C.mid} strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
            <circle cx="100" cy="35" r="3" fill={C.navy}/><circle cx="100" cy="35" r="1.5" fill={C.white}/>
            <rect x="54" y="58" width="92" height="22" fill={C.dark}/>
            <NA cx="66" cy="69" size={12} color={C.white}/>
            <text x="80" y="65" fill={C.white} style={{fontSize:7,fontWeight:700,fontFamily:'system-ui'}}>600 m</text>
            <text x="80" y="76" fill={C.soft} style={{fontSize:5.5,fontFamily:'system-ui'}}>Canary Wharf</text>
            <rect x="54" y="80" width="92" height="18" fill={C.panel}/>
            {[0,0,0,0,1,1].map((on,i) => (
              <path key={i} d={`M${63+i*12} 93 L${63+i*12} 86 M${60+i*12} 89 L${63+i*12} 86 L${66+i*12} 89`}
                stroke={on?C.white:C.soft} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={on?1:0.35}/>
            ))}
            <rect x="54" y="98" width="92" height="24" fill={C.dark}/>
            <text x="60" y="113" fill={C.white} style={{fontSize:7,fontWeight:700,fontFamily:'system-ui'}}>10:59 PM</text>
            <text x="109" y="113" fill={C.soft} style={{fontSize:7,fontFamily:'system-ui'}}>· 26.5 km</text>
          </g>
          {/* Right battery gauge */}
          <circle cx="174" cy="68" r={r} fill={C.white} stroke={C.border} strokeWidth="1"/>
          <circle cx="174" cy="68" r={r} fill="none" stroke={C.panel} strokeWidth="5" strokeDasharray={daFull} strokeDashoffset={ofs} strokeLinecap="round"/>
          <circle cx="174" cy="68" r={r} fill="none" stroke={C.accent ?? '#22c55e'} strokeWidth="5" strokeDasharray={da(battArc)} strokeDashoffset={ofs} strokeLinecap="round"/>
          <text x="174" y="71" textAnchor="middle" fill={C.accent ?? '#22c55e'} style={{fontSize:9,fontWeight:800,fontFamily:'system-ui'}}>74%</text>
          <text x="174" y="79" textAnchor="middle" fill={C.mid} style={{fontSize:4.5,fontFamily:'system-ui'}}>BATT</text>
        </>);
      })()}
    </svg>
  );
}

function L_MapStyle() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      {/* Day side */}
      <clipPath id="lms-day"><rect x="0" y="0" width="99" height="130"/></clipPath>
      <g clipPath="url(#lms-day)">
        {/* Dark-blue day map — palette-driven so it adapts to theme */}
        <rect width="99" height="130" fill={C.dark}/>
        <path d="M0 70 Q50 58 100 70" stroke={C.soft} strokeWidth="6"/>
        <path d="M50 0 L50 130" stroke={C.border} strokeWidth="4"/>
        <rect x="8" y="20" width="30" height="20" rx="3" fill={C.soft}/>
        <rect x="55" y="30" width="18" height="16" rx="2" fill={C.soft}/>
        <path d="M10 55 Q50 44 100 55" stroke={C.mid} strokeWidth="2" opacity="0.7"/>
      </g>
      {/* Night/blue side */}
      <clipPath id="lms-night"><rect x="101" y="0" width="99" height="130"/></clipPath>
      <g clipPath="url(#lms-night)">
        <rect x="101" y="0" width="99" height="130" fill={C.white}/>
        <DW x={101} y={0} w={99} h={130} op={0.4}/>
        <path d="M100 70 Q150 58 200 70" stroke={C.panel} strokeWidth="6"/>
        <path d="M150 0 L150 130" stroke={C.panel} strokeWidth="4"/>
        <rect x="108" y="20" width="30" height="20" rx="3" fill={C.panel}/>
        <rect x="155" y="30" width="18" height="16" rx="2" fill={C.panel}/>
        <path d="M100 55 Q150 44 200 55" stroke={C.mid} strokeWidth="2" opacity="0.7"/>
      </g>
      <line x1="100" y1="0" x2="100" y2="130" stroke={C.border} strokeWidth="1.5"/>
    </svg>
  );
}

function L_HomeScreen() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <rect x="20" y="8" width="160" height="114" rx="12" fill={C.white} stroke={C.border} strokeWidth="1.5"/>
      <clipPath id="lhs-map"><rect x="20" y="8" width="160" height="114" rx="12"/></clipPath>
      <g clipPath="url(#lhs-map)">
        <DW x={20} y={8} w={160} h={114} op={0.3}/>
        <path d="M20 78 Q60 55 100 70 T180 62" stroke={C.mid} strokeWidth="2.5" strokeLinecap="round" opacity="0.65"/>
        <circle cx="100" cy="69" r="4" fill={C.navy}/><circle cx="100" cy="69" r="2" fill={C.white}/>
      </g>
      <rect x="28" y="14" width="144" height="100" rx="6" fill="none" stroke={C.warn ?? '#F59E0B'} strokeWidth="1.5" strokeDasharray="5 4" opacity="0.75"/>
      <rect x="38" y="22" width="110" height="72" rx="5" fill="none" stroke={C.border} strokeWidth="1.5" strokeDasharray="5 4" opacity="0.65"/>
      <rect x="38" y="100" width="110" height="18" rx="5" fill="none" stroke={C.danger ?? '#e2001a'} strokeWidth="1.5" strokeDasharray="5 4" opacity="0.6"/>
      {[0,1,2,3].map(i => <rect key={i} x={44+i*26} y="103" width="20" height="12" rx="6" fill={C.dark} opacity="0.7"/>)}
      {[['Nav area', C.warn ?? '#F59E0B'],['Safe area', C.border],['Controls', C.danger ?? '#e2001a']].map(([label,color],i) => (
        <g key={label} transform={`translate(152,${20+i*14})`}>
          <rect width="7" height="7" rx="2" fill={color} opacity="0.85"/>
          <text x="10" y="6" fill={C.navy} style={{fontSize:5.5,fontFamily:'system-ui',fontWeight:600}}>{label}</text>
        </g>
      ))}
    </svg>
  );
}

function L_ETAPanel() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <rect x="10" y="8" width="180" height="82" rx="12" fill={C.white} stroke={C.border} strokeWidth="1.5"/>
      <clipPath id="leta-map"><rect x="10" y="8" width="180" height="82" rx="12"/></clipPath>
      <g clipPath="url(#leta-map)">
        <DW x={10} y={8} w={180} h={82} op={0.35}/>
        <path d="M30 72 Q90 42 110 55 T170 30" stroke={C.mid} strokeWidth="3.5" strokeLinecap="round" opacity="0.7"/>
        <circle cx="110" cy="55" r="7" fill={C.navy}/>
        <circle cx="110" cy="55" r="4" fill={C.white}/>
      </g>
      <rect x="10" y="94" width="180" height="32" rx="12" fill={C.dark}/>
      {[['14:32','ETA',62],['18 min','Remaining',103],['6.4 km','Distance',150]].map(([v,l,x]) => (
        <g key={l}>
          <text x={x} y="107" textAnchor="middle" fill={C.white} style={{fontSize:11,fontWeight:700,fontFamily:'system-ui'}}>{v}</text>
          <text x={x} y="119" textAnchor="middle" fill={C.soft} style={{fontSize:7,fontFamily:'system-ui'}}>{l}</text>
        </g>
      ))}
      <line x1="84" y1="98" x2="84" y2="122" stroke={C.mid} strokeWidth="1" opacity="0.4"/>
      <line x1="128" y1="98" x2="128" y2="122" stroke={C.mid} strokeWidth="1" opacity="0.4"/>
    </svg>
  );
}

function L_ThemingTokens() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <LP x="40" y="10" w="120" h="11" color={C.navy}/>
      {[{from:'#e2001a',to:'#0066cc',isColor:true},{from:'4 dp',to:'12 dp',isColor:false},{from:'Roboto',to:'Inter',isColor:false}].map(({from,to,isColor},i) => (
        <g key={i}>
          {isColor ? (
            <>
              <rect x="12" y={36+i*28} width="40" height="18" rx="5" fill={from}/>
              <rect x="148" y={36+i*28} width="40" height="18" rx="5" fill={to}/>
            </>
          ) : (
            <>
              <rect x="12" y={36+i*28} width="40" height="18" rx="5" fill={C.panel} stroke={C.border} strokeWidth="1"/>
              <text x="32" y={48+i*28} textAnchor="middle" fill={C.navy} style={{fontSize:7,fontFamily:'monospace'}}>{from}</text>
              <rect x="148" y={36+i*28} width="40" height="18" rx="5" fill={C.panel} stroke={C.border} strokeWidth="1"/>
              <text x="168" y={48+i*28} textAnchor="middle" fill={C.mid} style={{fontSize:7,fontFamily:'monospace'}}>{to}</text>
            </>
          )}
          <LP x="60" y={40+i*28} w="70" h="10" color={C.panel}/>
          <text x="100" y={50+i*28} textAnchor="middle" fill={C.mid} style={{fontSize:10}}>→</text>
        </g>
      ))}
      <rect x="26" y="118" width="60" height="8" rx="4" fill="#e2001a"/>
      <text x="100" y="125" textAnchor="middle" fill={C.mid} style={{fontSize:10}}>→</text>
      <rect x="118" y="118" width="60" height="8" rx="4" fill={C.navy}/>
    </svg>
  );
}

function L_ChargingSearch() {
  const { palette: C } = useIlloStyle();
  const operators = [['Ionity','350 kW','3/4'],['Fastned','300 kW','2/4'],['bp pulse','50 kW','5/6']];
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <text x="10" y="20" fill={C.navy} style={{fontSize:10,fontWeight:700,fontFamily:'system-ui'}}>EV Charging</text>
      <text x="10" y="31" fill={C.accent ?? '#22c55e'} style={{fontSize:6,fontFamily:'system-ui'}}>Near you · Connector matched</text>
      {[['⚡ Speed',true],['💳 Payment',false],['🍴 Services',false]].map(([label,active],i) => (
        <g key={label}>
          <rect x={10+i*62} y="36" width="56" height="14" rx="4" fill={active?C.mid:C.panel} stroke={active?C.mid:C.border} strokeWidth="1"/>
          <text x={38+i*62} y="46" textAnchor="middle" fill={active?C.white:C.soft} style={{fontSize:6,fontFamily:'system-ui',fontWeight:active?700:400}}>{label}</text>
        </g>
      ))}
      {operators.map(([name,kw,avail],i) => (
        <g key={name}>
          {i>0 && <line x1="10" y1={56+i*24} x2="190" y2={56+i*24} stroke={C.panel} strokeWidth="1"/>}
          <circle cx="24" cy={67+i*24} r="9" fill={C.accent ?? '#22c55e'}/>
          <text x="24" y={71+i*24} textAnchor="middle" fill={C.white} style={{fontSize:8,fontWeight:700,fontFamily:'system-ui'}}>{i+1}</text>
          <text x="40" y={64+i*24} fill={C.navy} style={{fontSize:8,fontWeight:700,fontFamily:'system-ui'}}>{name}</text>
          <text x="40" y={74+i*24} fill={C.soft} style={{fontSize:6,fontFamily:'system-ui'}}>⚡ {kw}</text>
          <text x="190" y={71+i*24} textAnchor="end" fill={C.accent ?? '#22c55e'} style={{fontSize:8,fontWeight:700,fontFamily:'system-ui'}}>{avail}</text>
        </g>
      ))}
    </svg>
  );
}

function L_ConversationPersonality() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <LP x="40" y="8" w="120" h="11" color={C.navy}/>
      {/* Formal tone bubble */}
      <rect x="10" y="26" width="148" height="40" rx="12" fill={C.panel}/>
      <rect x="16" y="30" width="32" height="10" rx="5" fill={C.mid} opacity="0.5"/>
      <text x="32" y="38" textAnchor="middle" fill={C.white} style={{fontSize:5.5,fontFamily:'system-ui',fontWeight:600}}>formal</text>
      <text x="22" y="52" fill={C.navy} style={{fontSize:6,fontFamily:'system-ui'}}>"Please recalculate the route."</text>
      <text x="22" y="62" fill={C.pill2} style={{fontSize:5.5,fontFamily:'system-ui',fontStyle:'italic'}}>structured · neutral</text>
      {/* Casual tone bubble */}
      <rect x="42" y="76" width="148" height="42" rx="12" fill={C.dark}/>
      <rect x="48" y="80" width="28" height="10" rx="5" fill={C.accent ?? '#22c55e'} opacity="0.5"/>
      <text x="62" y="88" textAnchor="middle" fill={C.white} style={{fontSize:5.5,fontFamily:'system-ui',fontWeight:600}}>casual</text>
      <text x="54" y="102" fill={C.white} style={{fontSize:6,fontFamily:'system-ui'}}>"Hey! Shortcut ahead — take it!"</text>
      <text x="54" y="113" fill={C.soft} style={{fontSize:5.5,fontFamily:'system-ui',fontStyle:'italic'}}>friendly · concise</text>
    </svg>
  );
}

function L_ADAS() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <path d="M40 130 L90 58 L110 58 L160 130 Z" fill={C.soft} opacity="0.55"/>
      <clipPath id="la-road"><path d="M40 130 L90 58 L110 58 L160 130 Z"/></clipPath>
      {[90,95,100,105,110].map((x,i) => (
        <line key={i} x1={x} y1={60} x2={40+(x-90)/(110-90)*120+8} y2={128} stroke={C.white} strokeWidth="1.5" strokeDasharray="6 5" opacity="0.45"/>
      ))}
      <line x1="55" y1="58" x2="145" y2="58" stroke={C.border} strokeWidth="1.5" opacity="0.8"/>
      <g transform="translate(85,72)">
        <polygon points="0,-8 7,5 -7,5" fill={C.warn ?? '#fbbf24'} stroke={C.white} strokeWidth="1"/>
        <line x1="0" y1="-3" x2="0" y2="2" stroke={C.bg} strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="0" cy="4" r="0.8" fill={C.bg}/>
      </g>
      <circle cx="115" cy="66" r="8" fill={C.mid}/>
      <circle cx="115" cy="64" r="2.5" fill={C.white} opacity="0.9"/>
      <rect x="112" y="66" width="6" height="4" rx="1" fill={C.white} opacity="0.9"/>
      <circle cx="38" cy="32" r="20" fill={C.white} stroke={C.dark} strokeWidth="2.5"/>
      <circle cx="38" cy="32" r="15" fill={C.white} stroke={C.danger ?? '#e2001a'} strokeWidth="1.5"/>
      <text x="38" y="37" textAnchor="middle" fill={C.dark} style={{fontSize:12,fontWeight:800,fontFamily:'system-ui'}}>80</text>
      {[false,false,true,true,false].map((active,i) => (
        <g key={i} transform={`translate(${85+i*18},100)`}>
          <rect x="-6" y="4" width="12" height="16" rx="2" fill={active?C.dark:C.panel} stroke={active?C.mid:C.soft} strokeWidth="1"/>
          <polygon points="0,-2 6,5 4,5 4,4 -4,4 -4,5 -6,5" fill={active?C.dark:C.panel}/>
        </g>
      ))}
      <rect x="148" y="20" width="46" height="26" rx="8" fill={C.dark}/>
      <text x="171" y="31" textAnchor="middle" fill={C.white} style={{fontSize:8,fontFamily:'system-ui'}}>600 m</text>
      <text x="171" y="41" textAnchor="middle" fill={C.soft} style={{fontSize:7,fontFamily:'system-ui'}}>Lane chg</text>
    </svg>
  );
}

/* ── Maps & Navigation SDK light variants ─────────────────────────────────────── */

function L_MapDisplay() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.white}/>
      <DW x={0} y={0} w={200} h={130} op={0.4}/>
      <path d="M0 65 Q60 55 100 65 T200 60" stroke={C.panel} strokeWidth="6" strokeLinecap="round"/>
      <path d="M70 0 L68 130" stroke={C.panel} strokeWidth="4"/>
      <path d="M140 0 L136 130" stroke={C.panel} strokeWidth="4"/>
      <path d="M20 100 Q60 72 100 65 T175 42" stroke={C.mid} strokeWidth="3" strokeLinecap="round" opacity="0.85"/>
      <path d="M20 100 Q60 72 100 65 T175 42" stroke={C.soft} strokeWidth="10" strokeLinecap="round" opacity="0.25"/>
      <circle cx="100" cy="65" r="7" fill={C.navy}/>
      <circle cx="100" cy="65" r="4" fill={C.white}/>
      <circle cx="68" cy="45" r="4" fill="#5B8AC5" opacity="0.9"/>
      <circle cx="140" cy="70" r="4" fill={C.accent ?? '#22c55e'} opacity="0.9"/>
      <rect x="8" y="8" width="60" height="20" rx="6" fill={C.dark}/>
      <LP x="16" y="13" w="44" h="9" color={C.white}/>
    </svg>
  );
}

function L_SDKSearch() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <rect x="10" y="8" width="180" height="22" rx="8" fill={C.white} stroke={C.border} strokeWidth="1.5"/>
      <circle cx="22" cy="19" r="5" fill={C.panel}/>
      <LP x="33" y="14" w="106" h="10" color={C.panel}/>
      {['Amsterdam Centraal','Rijksmuseum','Vondelpark'].map((name,i) => (
        <g key={name}>
          <rect x="10" y={38+i*29} width="180" height="24" rx="6"
            fill={C.panel} stroke={i===0?C.mid:C.border} strokeWidth={i===0?1.5:1}/>
          <rect x="18" y={44+i*29} width="12" height="12" rx="3" fill={C.soft}/>
          <LP x="36" y={44+i*29} w="92" h="9" color={C.navy}/>
          <LP x="36" y={56+i*29} w="56" h="7" color={C.pill2}/>
        </g>
      ))}
    </svg>
  );
}

function L_RouteOptions() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      {/* Title + subtitle (e.g. "Route Options" / "Amsterdam → Berlin · 3 results") */}
      <LP x="10" y="8" w="82" h="11" color={C.navy}/>
      <LP x="10" y="22" w="118" h="8" color={C.soft}/>
      {/* Row 1 — selected/recommended: bold time, distance, filled badge */}
      <rect x="10" y="34" width="180" height="30" rx="8" fill={C.panel} stroke={C.mid} strokeWidth="1.5"/>
      <LP x="18" y="40" w="62" h="11" color={C.navy}/>
      <LP x="18" y="54" w="40" h="7" color={C.soft}/>
      <rect x="138" y="40" width="46" height="16" rx="8" fill={C.mid}/>
      <LP x="144" y="45" w="34" h="8" color={C.white}/>
      {/* Row 2 — alternative: same structure, outlined badge */}
      <rect x="10" y="68" width="180" height="30" rx="8" fill={C.panel} stroke={C.border} strokeWidth="1"/>
      <LP x="18" y="74" w="62" h="11" color={C.navy}/>
      <LP x="18" y="88" w="40" h="7" color={C.soft}/>
      <rect x="138" y="74" width="46" height="16" rx="8" fill="none" stroke={C.mid} strokeWidth="1.5"/>
      <LP x="144" y="79" w="34" h="8" color={C.mid}/>
      {/* Row 3 — partial hint, implies more options */}
      <rect x="10" y="102" width="180" height="24" rx="8" fill={C.panel} stroke={C.border} strokeWidth="1"/>
      <LP x="18" y="108" w="56" h="10" color={C.navy}/>
    </svg>
  );
}

function L_NavGuidance() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      {/* Map card — full width, bottom portion visible below NIP */}
      <rect x="8" y="8" width="184" height="84" rx="12" fill={C.white} stroke={C.border} strokeWidth="1.5"/>
      <clipPath id="lng-map"><rect x="8" y="8" width="184" height="84" rx="12"/></clipPath>
      <g clipPath="url(#lng-map)">
        <DW x={8} y={8} w={184} h={84} op={0.3}/>
        <path d="M20 76 Q80 52 125 60 T192 42" stroke={C.mid} strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>
        <circle cx="125" cy="60" r="5" fill={C.navy}/>
        <circle cx="125" cy="60" r="2.5" fill={C.white}/>
      </g>
      {/* NIP — full-width turn instruction, zoomed in */}
      <rect x="8" y="12" width="184" height="52" rx="10" fill={C.dark}/>
      {/* Arrow icon badge */}
      <rect x="18" y="20" width="34" height="34" rx="8" fill={C.white} opacity="0.12"/>
      {/* Turn-right arrow: vertical stem + horizontal arm + arrowhead */}
      <path d="M27,49 L27,30 L35,30 L35,25 L46,36 L35,47 L35,42 L31,42 L31,49 Z" fill={C.white}/>
      {/* Instruction text */}
      <text x="62" y="34" fill={C.white} style={{fontSize:11,fontWeight:700,fontFamily:'system-ui,sans-serif'}}>Turn right</text>
      <text x="62" y="50" fill={C.soft} style={{fontSize:7.5,fontFamily:'system-ui,sans-serif'}}>onto Main St · 320 m</text>
      {/* Stats band */}
      <rect x="8" y="98" width="184" height="26" rx="10" fill={C.dark}/>
      {[['14:32','ETA',47],['22 min','Time',100],['8.4 km','Dist',153]].map(([v,l,x]) => (
        <g key={l}>
          <text x={x} y="109" textAnchor="middle" fill={C.white} style={{fontSize:9,fontWeight:700,fontFamily:'system-ui,sans-serif'}}>{v}</text>
          <text x={x} y="119" textAnchor="middle" fill={C.soft} style={{fontSize:6.5,fontFamily:'system-ui,sans-serif'}}>{l}</text>
        </g>
      ))}
    </svg>
  );
}

function L_OfflineMaps() {
  const { palette: C } = useIlloStyle();
  const regions = [['Western Europe','1.2 GB',100],['Eastern Europe','0.8 GB',65],['North America','2.1 GB',30]];
  const barColor = [C.accent ?? '#22c55e', C.mid, C.pill2];
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <circle cx="14" cy="16" r="6" fill={C.accent ?? '#22c55e'}/>
      <text x="26" y="20" fill={C.navy} style={{fontSize:10,fontWeight:700,fontFamily:'system-ui'}}>Offline Maps</text>
      <text x="190" y="20" textAnchor="end" fill={C.accent ?? '#22c55e'} style={{fontSize:7,fontWeight:600,fontFamily:'system-ui'}}>Active</text>
      {regions.map(([name,size,pct],i) => (
        <g key={name}>
          <text x="10" y={40+i*32} fill={C.navy} style={{fontSize:8,fontWeight:600,fontFamily:'system-ui'}}>{name}</text>
          <text x="190" y={40+i*32} textAnchor="end" fill={C.soft} style={{fontSize:7,fontFamily:'system-ui'}}>{size}</text>
          <rect x="10" y={44+i*32} width="180" height="6" rx="3" fill={C.panel}/>
          <rect x="10" y={44+i*32} width={180*pct/100} height="6" rx="3" fill={barColor[i]}/>
        </g>
      ))}
    </svg>
  );
}

function L_CarPlay() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <rect x="10" y="8" width="180" height="82" rx="12" fill={C.white} stroke={C.border} strokeWidth="1.5"/>
      <clipPath id="lcp-map"><rect x="10" y="8" width="180" height="82" rx="12"/></clipPath>
      <g clipPath="url(#lcp-map)">
        <DW x={10} y={8} w={180} h={82} op={0.35}/>
        <path d="M25 72 Q80 48 120 55 T185 35" stroke={C.mid} strokeWidth="3" strokeLinecap="round" opacity="0.7"/>
        <circle cx="120" cy="55" r="5" fill={C.navy}/>
      </g>
      <rect x="10" y="10" width="100" height="22" rx="7" fill={C.dark}/>
      <LP x="20" y="15" w="60" h="9" color={C.white}/>
      <rect x="120" y="10" width="22" height="22" rx="7" fill={C.accent ?? '#22c55e'}/>
      <text x="131" y="24" textAnchor="middle" fill={C.white} style={{fontSize:8,fontWeight:700,fontFamily:'system-ui'}}>🍎</text>
      <rect x="10" y="94" width="180" height="28" rx="12" fill={C.dark}/>
      {[['14:32','ETA',62],['18 min','Time',103],['6.4 km','Dist',150]].map(([v,l,x]) => (
        <g key={l}>
          <text x={x} y="106" textAnchor="middle" fill={C.white} style={{fontSize:10,fontWeight:700,fontFamily:'system-ui'}}>{v}</text>
          <text x={x} y="116" textAnchor="middle" fill={C.soft} style={{fontSize:7,fontFamily:'system-ui'}}>{l}</text>
        </g>
      ))}
    </svg>
  );
}

function L_VirtualHorizon() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <path d="M30 130 L85 55 L115 55 L170 130 Z" fill={C.soft} opacity="0.55"/>
      <clipPath id="lvh-road"><path d="M30 130 L85 55 L115 55 L170 130 Z"/></clipPath>
      {[88,95,100,105,112].map((x,i) => (
        <line key={i} x1={x} y1={57} x2={30+(x-88)/(112-88)*140+6} y2={128} stroke={C.white} strokeWidth="1.5" strokeDasharray="6 5" opacity="0.4"/>
      ))}
      <line x1="50" y1="55" x2="150" y2="55" stroke={C.border} strokeWidth="1.5" opacity="0.8"/>
      <g transform="translate(88,68)">
        <polygon points="0,-8 7,5 -7,5" fill={C.warn ?? '#fbbf24'} stroke={C.white} strokeWidth="1"/>
        <line x1="0" y1="-3" x2="0" y2="2" stroke={C.bg} strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="0" cy="4" r="0.8" fill={C.bg}/>
      </g>
      <circle cx="112" cy="62" r="8" fill={C.danger ?? '#ef4444'}/>
      <line x1="112" y1="57" x2="112" y2="62" stroke={C.white} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="112" cy="65" r="1" fill={C.white}/>
      <circle cx="100" cy="58" r="6" fill={C.mid}/>
      <circle cx="100" cy="56.5" r="2" fill={C.white} opacity="0.9"/>
      <rect x="97.5" y="58.5" width="5" height="3.5" rx="0.8" fill={C.white} opacity="0.9"/>
      {[[C.warn ?? '#fbbf24','Roadwork'],[C.danger ?? '#ef4444','Sharp curve'],[C.soft,'Station 800m']].map(([col,label],i) => (
        <g key={label}>
          <rect x="122" y={18+i*18} width="68" height="14" rx="7" fill={C.dark} opacity="0.9"/>
          <circle cx="131" cy={25+i*18} r="4" fill={col}/>
          <text x="138" y={29+i*18} fill={C.white} style={{fontSize:5.5,fontFamily:'system-ui'}}>{label}</text>
        </g>
      ))}
    </svg>
  );
}

/* ── Routing API light variants ───────────────────────────────────────────────── */

function L_CalculateRoute() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <rect x="10" y="8" width="180" height="84" rx="12" fill={C.white} stroke={C.border} strokeWidth="1.5"/>
      <clipPath id="lcr-map"><rect x="10" y="8" width="180" height="84" rx="12"/></clipPath>
      <g clipPath="url(#lcr-map)">
        <DW x={10} y={8} w={180} h={84} op={0.35}/>
        <path d="M28 80 Q70 52 105 50 T178 28" stroke={C.mid} strokeWidth="3.5" strokeLinecap="round" opacity="0.8"/>
        <path d="M28 80 Q70 52 105 50 T178 28" stroke={C.soft} strokeWidth="10" strokeLinecap="round" opacity="0.25"/>
        <circle cx="28" cy="80" r="8" fill={C.accent ?? '#22c55e'}/>
        <text x="28" y="84" textAnchor="middle" fill={C.white} style={{fontSize:7,fontWeight:700,fontFamily:'system-ui'}}>A</text>
        <circle cx="178" cy="28" r="8" fill={C.dark}/>
        <text x="178" y="32" textAnchor="middle" fill={C.white} style={{fontSize:7,fontWeight:700,fontFamily:'system-ui'}}>B</text>
      </g>
      <rect x="10" y="96" width="180" height="26" rx="10" fill={C.dark}/>
      {[['2h 14m','Time',60],['189 km','Distance',100],['14:32','ETA',148]].map(([v,l,x]) => (
        <g key={l}>
          <text x={x} y="107" textAnchor="middle" fill={C.white} style={{fontSize:9,fontWeight:700,fontFamily:'system-ui'}}>{v}</text>
          <text x={x} y="117" textAnchor="middle" fill={C.soft} style={{fontSize:7,fontFamily:'system-ui'}}>{l}</text>
        </g>
      ))}
    </svg>
  );
}

function L_ReachableRange() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.white}/>
      <DW x={0} y={0} w={200} h={130} op={0.35}/>
      <path d="M100 28 Q138 26 155 48 Q168 70 155 92 Q138 110 100 113 Q62 110 45 92 Q32 70 45 48 Q62 26 100 28 Z" fill={C.soft} opacity="0.2" stroke={C.mid} strokeWidth="1.5"/>
      <path d="M100 44 Q122 42 133 60 Q142 78 133 94 Q122 106 100 108 Q78 106 67 94 Q58 78 67 60 Q78 42 100 44 Z" fill={C.soft} opacity="0.15" stroke={C.mid} strokeWidth="1" opacity="0.6"/>
      <circle cx="100" cy="65" r="8" fill={C.navy}/>
      <circle cx="100" cy="65" r="5" fill={C.white}/>
      <rect x="128" y="10" width="64" height="28" rx="8" fill={C.dark}/>
      <text x="160" y="22" textAnchor="middle" fill={C.white} style={{fontSize:9,fontWeight:700,fontFamily:'system-ui'}}>30 min range</text>
      <text x="160" y="33" textAnchor="middle" fill={C.soft} style={{fontSize:7,fontFamily:'system-ui'}}>~27 km radius</text>
    </svg>
  );
}

function L_EVRouting() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <rect x="10" y="8" width="180" height="76" rx="12" fill={C.white} stroke={C.border} strokeWidth="1.5"/>
      <clipPath id="levr-map"><rect x="10" y="8" width="180" height="76" rx="12"/></clipPath>
      <g clipPath="url(#levr-map)">
        <DW x={10} y={8} w={180} h={76} op={0.35}/>
        <path d="M22 72 Q60 50 90 44 Q115 38 142 32 T182 20" stroke={C.mid} strokeWidth="3" strokeLinecap="round" opacity="0.8"/>
        {[[90,44],[142,32]].map(([cx,cy],i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="9" fill={C.white} stroke={C.accent ?? '#22c55e'} strokeWidth="2"/>
            <text x={cx} y={cy+4} textAnchor="middle" fill={C.accent ?? '#22c55e'} style={{fontSize:8}}>⚡</text>
          </g>
        ))}
        <circle cx="22" cy="72" r="5" fill={C.accent ?? '#22c55e'}/>
        <circle cx="182" cy="20" r="5" fill={C.navy}/>
      </g>
      <rect x="10" y="88" width="180" height="32" rx="10" fill={C.dark}/>
      <LP x="18" y="96" w="55" h="9" color={C.soft}/>
      <rect x="18" y="108" width="164" height="6" rx="3" fill="rgba(255,255,255,0.2)"/>
      <rect x="18" y="108" width="128" height="6" rx="3" fill={C.accent ?? '#22c55e'}/>
      <text x="170" y="114" textAnchor="middle" fill={C.white} style={{fontSize:8,fontWeight:700,fontFamily:'system-ui'}}>78%</text>
    </svg>
  );
}

function L_BatchRouting() {
  const { palette: C } = useIlloStyle();
  const routes = [
    {time:'52 min',dist:'48 km',pct:72},
    {time:'1h 04m',dist:'51 km',pct:88},
    {time:'58 min',dist:'45 km',pct:60},
    {time:'47 min',dist:'62 km',pct:95},
  ];
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <LP x="30" y="8" w="100" h="9" color={C.navy}/>
      <rect x="152" y="6" width="38" height="13" rx="6" fill={C.dark}/>
      <text x="171" y="16" textAnchor="middle" fill={C.mid} style={{fontSize:6,fontFamily:'monospace'}}>batch</text>
      {routes.map(({time,dist,pct},i) => (
        <g key={i}>
          <circle cx="16" cy={33+i*23} r="7" fill={C.mid} opacity="0.3"/>
          <text x="16" y={37+i*23} textAnchor="middle" fill={C.navy} style={{fontSize:6.5,fontWeight:700,fontFamily:'system-ui'}}>{i+1}</text>
          <line x1="28" y1={33+i*23} x2="48" y2={33+i*23} stroke={C.mid} strokeWidth="2" strokeDasharray="3 2" opacity="0.6"/>
          <text x="52" y={37+i*23} fill={C.navy} style={{fontSize:7,fontWeight:600,fontFamily:'system-ui'}}>{time}</text>
          <text x="95" y={37+i*23} fill={C.soft} style={{fontSize:6,fontFamily:'system-ui'}}>{dist}</text>
          <rect x="128" y={29+i*23} width="52" height="7" rx="3.5" fill={C.panel}/>
          <rect x="128" y={29+i*23} width={52*pct/100} height="7" rx="3.5" fill={pct>80?C.mid:C.soft} opacity="0.9"/>
        </g>
      ))}
      <circle cx="10" cy="125" r="4" fill={C.accent ?? '#22c55e'}/>
      <text x="18" y="129" fill={C.mid} style={{fontSize:5.5,fontFamily:'system-ui'}}>4 routes calculated</text>
    </svg>
  );
}

function L_MatrixRouting() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <LP x="30" y="8" w="140" h="11" color={C.navy}/>
      {Array.from({length:4}).map((_,row) => (
        Array.from({length:4}).map((_,col) => {
          const val = ((row*3+col*7)%90)+15;
          const intensity = val/100;
          return (
            <g key={`${row}-${col}`}>
              <rect x={30+col*38} y={28+row*22} width="34" height="18" rx="4"
                fill={C.mid} opacity={intensity*0.65+0.15}/>
              <text x={47+col*38} y={40+row*22} textAnchor="middle" fill={C.white}
                style={{fontSize:7,fontWeight:700,fontFamily:'system-ui'}}>{val}m</text>
            </g>
          );
        })
      ))}
    </svg>
  );
}

function L_WaypointOpt() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <LP x="60" y="6" w="80" h="11" color={C.navy}/>
      <line x1="100" y1="20" x2="100" y2="126" stroke={C.panel} strokeWidth="1.5"/>
      <LP x="12" y="20" w="40" h="9" color={C.soft}/>
      <LP x="108" y="20" w="40" h="9" color={C.accent ?? '#22c55e'}/>
      {[[10,28],[60,42],[16,64],[54,82],[30,52]].map(([x,y],i) => (
        <circle key={i} cx={x+14} cy={y} r="6" fill={C.panel} stroke={C.mid} strokeWidth="1.5"/>
      ))}
      <polyline points="24,28 74,42 30,64 68,82 44,52" fill="none" stroke={C.soft} strokeWidth="1.5" strokeDasharray="4 3"/>
      {[[10,28],[30,52],[16,64],[54,82],[60,42]].map(([x,y],i) => (
        <g key={i}>
          <circle cx={x+108} cy={y} r="6" fill={C.accent ?? '#22c55e'}/>
          <text x={x+108} y={y+3} textAnchor="middle" fill={C.white} style={{fontSize:6,fontWeight:700,fontFamily:'system-ui'}}>{i+1}</text>
        </g>
      ))}
      <polyline points="118,28 138,52 124,64 162,82 168,42" fill="none" stroke={C.accent ?? '#22c55e'} strokeWidth="1.5" opacity="0.8"/>
      <LP x="50" y="118" w="100" h="10" color={C.navy}/>
    </svg>
  );
}

function L_TurnInstructions() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <rect x="10" y="8" width="180" height="56" rx="10" fill={C.white} stroke={C.border} strokeWidth="1.5"/>
      <clipPath id="lti-map"><rect x="10" y="8" width="180" height="56" rx="10"/></clipPath>
      <g clipPath="url(#lti-map)">
        <DW x={10} y={8} w={180} h={56} op={0.3}/>
        <path d="M20 52 Q70 35 100 28 T175 18" stroke={C.mid} strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
        <circle cx="100" cy="28" r="7" fill={C.white} stroke={C.mid} strokeWidth="2"/>
        <path d="M100 28 L100 18 M96 22 L100 18 L104 22" stroke={C.mid} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="20" cy="52" r="5" fill={C.accent ?? '#22c55e'}/>
        <circle cx="175" cy="18" r="5" fill={C.navy}/>
      </g>
      <rect x="10" y="74" width="180" height="32" rx="10" fill={C.panel}/>
      <LP x="20" y="80" w="55" h="10" color={C.mid}/>
      <LP x="20" y="94" w="130" h="9" color={C.navy}/>
      <rect x="10" y="110" width="180" height="16" rx="8" fill={C.white} stroke={C.border} strokeWidth="1"/>
      {['coded','text','tagged'].map((t,i) => (
        <g key={t}>
          <rect x={20+i*55} y="113" width="36" height="10" rx="5" fill={C.panel}/>
          <text x={38+i*55} y="120" textAnchor="middle" fill={C.mid} style={{fontSize:6,fontFamily:'monospace'}}>{t}</text>
        </g>
      ))}
    </svg>
  );
}

function L_RoadShields() {
  const { palette: C } = useIlloStyle();
  const shields = [{ref:'A10',bg:'#1d4ed8'},{ref:'E35',bg:'#22c55e'},{ref:'N7',bg:'#e2001a'},{ref:'B14',bg:'#f59e0b'}];
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <LP x="30" y="8" w="140" h="11" color={C.navy}/>
      {shields.map(({ref,bg},i) => (
        <g key={ref}>
          <rect x={20+i*44} y="28" width="36" height="24" rx="6" fill={bg}/>
          <text x={38+i*44} y="44" textAnchor="middle" fill={C.white} style={{fontSize:9,fontWeight:700,fontFamily:'monospace'}}>{ref}</text>
        </g>
      ))}
      <rect x="10" y="68" width="180" height="26" rx="8" fill={C.white} stroke={C.border} strokeWidth="1.5"/>
      <LP x="20" y="74" w="50" h="10" color={C.panel}/>
      <rect x="74" y="72" width="30" height="18" rx="4" fill="#1d4ed8"/>
      <text x="89" y="84" textAnchor="middle" fill={C.white} style={{fontSize:8,fontWeight:700,fontFamily:'monospace'}}>A10</text>
      <LP x="110" y="74" w="70" h="10" color={C.panel}/>
      <rect x="10" y="100" width="180" height="24" rx="8" fill={C.panel}/>
      <LP x="20" y="107" w="160" h="10" color={C.mid}/>
    </svg>
  );
}

function L_LaneGuidance() {
  const { palette: C } = useIlloStyle();
  const lanes = [
    {dirs:['←'],drivable:false},{dirs:['↑'],drivable:false},
    {dirs:['↑','→'],drivable:true},{dirs:['→'],drivable:true,recommended:true},
  ];
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <LP x="30" y="8" w="140" h="11" color={C.navy}/>
      {lanes.map((lane,i) => (
        <g key={i}>
          <rect x={22+i*42} y="30" width="36" height={lane.dirs.length>1?40:34} rx="8"
            fill={lane.recommended?C.warn ? `rgba(${parseInt(C.warn.slice(1,3),16)},${parseInt(C.warn.slice(3,5),16)},${parseInt(C.warn.slice(5,7),16)},0.15)` : 'rgba(234,179,8,0.15)':lane.drivable?C.panel:C.bg}
            stroke={lane.recommended?C.warn ? `rgba(${parseInt(C.warn.slice(1,3),16)},${parseInt(C.warn.slice(3,5),16)},${parseInt(C.warn.slice(5,7),16)},0.6)` : 'rgba(234,179,8,0.6)':C.border} strokeWidth={lane.recommended?1.5:1}
            opacity={lane.drivable||lane.recommended?1:0.35}/>
          {lane.dirs.map((d,j) => (
            <text key={d} x={40+i*42} y={50+j*16} textAnchor="middle"
              fill={lane.recommended?'#eab308':lane.drivable?C.navy:C.soft}
              style={{fontSize:14,lineHeight:1}}>{d}</text>
          ))}
        </g>
      ))}
      <LP x="22" y="90" w="60" h="10" color={C.panel}/>
      <text x="30" y="97" textAnchor="middle" fill="rgba(234,179,8,0.8)" style={{fontSize:7,fontWeight:600,fontFamily:'system-ui'}}>●</text>
      <LP x="40" y="90" w="40" h="10" color={C.panel}/>
      <LP x="110" y="90" w="60" h="10" color={C.panel}/>
    </svg>
  );
}

/* ── LDEVR light variants ─────────────────────────────────────────────────────── */

function L_LDEVRRoute() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <rect x="10" y="8" width="180" height="76" rx="12" fill={C.white} stroke={C.border} strokeWidth="1.5"/>
      <clipPath id="lldr-map"><rect x="10" y="8" width="180" height="76" rx="12"/></clipPath>
      <g clipPath="url(#lldr-map)">
        <DW x={10} y={8} w={180} h={76} op={0.35}/>
        <path d="M22 72 Q60 50 90 44 Q115 38 142 32 T182 20" stroke={C.mid} strokeWidth="3" strokeLinecap="round" opacity="0.8"/>
        {[[90,44,'Stop 1'],[142,32,'Stop 2']].map(([cx,cy,label],i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="12" fill={C.dark} stroke={C.accent ?? '#22c55e'} strokeWidth="2.5"/>
            <polygon points={`${cx-3},${cy-5} ${cx+4},${cy-1} ${cx},${cy-1} ${cx},${cy+5} ${cx-4},${cy+1} ${cx},${cy+1}`}
              fill={C.accent ?? '#22c55e'}/>
            <text x={cx} y={cy+22} textAnchor="middle" fill={C.accent ?? '#22c55e'} style={{fontSize:5.5,fontFamily:'system-ui',fontWeight:700}}>{label}</text>
          </g>
        ))}
        <circle cx="22" cy="72" r="6" fill={C.accent ?? '#22c55e'}/>
        <text x="22" y="76" textAnchor="middle" fill={C.white} style={{fontSize:6,fontWeight:700,fontFamily:'system-ui'}}>A</text>
        <circle cx="182" cy="20" r="6" fill={C.dark} stroke={C.mid} strokeWidth="1.5"/>
        <text x="182" y="24" textAnchor="middle" fill={C.white} style={{fontSize:6,fontWeight:700,fontFamily:'system-ui'}}>B</text>
      </g>
      <rect x="10" y="88" width="180" height="32" rx="10" fill={C.dark}/>
      <text x="18" y="101" fill={C.white} style={{fontSize:7,fontWeight:600,fontFamily:'system-ui'}}>Range remaining</text>
      <text x="18" y="112" fill={C.soft} style={{fontSize:6,fontFamily:'system-ui'}}>78%</text>
      <rect x="40" y="107" width="132" height="8" rx="4" fill="rgba(255,255,255,0.15)"/>
      <rect x="40" y="107" width="103" height="8" rx="4" fill={C.accent ?? '#22c55e'}/>
    </svg>
  );
}

function L_LDEVRBatch() {
  const { palette: C } = useIlloStyle();
  const evRoutes = [
    {id:'EV-1',start:82,arrive:38,col:C.accent ?? '#22c55e'},
    {id:'EV-2',start:67,arrive:15,col:C.warn ?? '#fbbf24'},
    {id:'EV-3',start:91,arrive:54,col:C.accent ?? '#22c55e'},
    {id:'EV-4',start:74,arrive:28,col:C.mid},
  ];
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <LP x="30" y="8" w="100" h="9" color={C.navy}/>
      <rect x="152" y="6" width="38" height="13" rx="6" fill={C.dark}/>
      <text x="171" y="16" textAnchor="middle" fill={C.accent ?? '#22c55e'} style={{fontSize:6,fontFamily:'monospace'}}>EV batch</text>
      {evRoutes.map(({id,start,arrive,col},i) => (
        <g key={id}>
          <text x="10" y={36+i*23} fill={C.navy} style={{fontSize:6,fontWeight:700,fontFamily:'system-ui'}}>{id}</text>
          <rect x="30" y={27+i*23} width="54" height="12" rx="3" fill={C.panel} stroke={C.border} strokeWidth="1"/>
          <rect x="31" y={28+i*23} width={52*start/100} height="10" rx="2" fill={col} opacity="0.85"/>
          <text x="57" y={36+i*23} textAnchor="middle" fill={C.white} style={{fontSize:5.5,fontFamily:'system-ui',fontWeight:700}}>{start}%</text>
          <text x="91" y={36+i*23} textAnchor="middle" fill={C.mid} style={{fontSize:8}}>→</text>
          <rect x="100" y={27+i*23} width="54" height="12" rx="3" fill={C.panel} stroke={C.border} strokeWidth="1"/>
          <rect x="101" y={28+i*23} width={52*arrive/100} height="10" rx="2" fill={arrive<20?C.danger ?? '#ef4444':C.soft} opacity="0.85"/>
          <text x="127" y={36+i*23} textAnchor="middle" fill={C.white} style={{fontSize:5.5,fontFamily:'system-ui',fontWeight:700}}>{arrive}%</text>
          <circle cx="164" cy={33+i*23} r="8" fill={C.dark}/>
          <text x="164" y={37+i*23} textAnchor="middle" fill={C.accent ?? '#22c55e'} style={{fontSize:7,fontWeight:700}}>⚡{Math.ceil((start-arrive)/30)}</text>
        </g>
      ))}
      <circle cx="10" cy="125" r="4" fill={C.accent ?? '#22c55e'}/>
      <text x="18" y="129" fill={C.mid} style={{fontSize:5.5,fontFamily:'system-ui'}}>4 EV routes optimised</text>
    </svg>
  );
}

/* ── Routing API additional light variants ────────────────────────────────────── */

function L_RoutingComputeToll() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <path d="M10 68 Q100 63 190 66" stroke={C.panel} strokeWidth="10" strokeLinecap="round"/>
      <path d="M10 68 Q100 63 190 66" stroke={C.mid} strokeWidth="3" strokeLinecap="round" opacity="0.55" strokeDasharray="8 5"/>
      <rect x="98" y="46" width="4" height="30" rx="2" fill={C.navy}/>
      <rect x="100" y="46" width="48" height="5" rx="2.5" fill={C.danger ?? '#e2001a'}/>
      <rect x="82" y="38" width="18" height="32" rx="4" fill={C.dark}/>
      <rect x="86" y="43" width="10" height="12" rx="2" fill={C.mid} opacity="0.4"/>
      <rect x="12" y="82" width="176" height="40" rx="10" fill={C.white} stroke={C.border} strokeWidth="1.5"/>
      {[['Base toll','€2.40',C.navy],['EV discount','–€0.60',C.accent ?? '#22c55e'],['Total','€1.80',C.dark]].map(([label,val,col],i) => (
        <g key={label}>
          {i > 0 && <line x1="20" y1={92+i*10} x2="180" y2={92+i*10} stroke={C.border} strokeWidth="0.75" opacity="0.5"/>}
          <text x="22" y={101+i*10} fill={C.mid} style={{fontSize:6.5,fontFamily:'system-ui'}}>{label}</text>
          <text x="178" y={101+i*10} textAnchor="end" fill={col} style={{fontSize:7,fontWeight:700,fontFamily:'monospace'}}>{val}</text>
        </g>
      ))}
    </svg>
  );
}

function L_RoutingWeather() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <rect x="8" y="8" width="184" height="78" rx="12" fill={C.white} stroke={C.border} strokeWidth="1.5"/>
      <clipPath id="ii-rw-map"><rect x="8" y="8" width="184" height="78" rx="12"/></clipPath>
      <g clipPath="url(#ii-rw-map)">
        <DW x={8} y={8} w={184} h={78} op={0.3}/>
        <path d="M20 70 Q60 54 90 50" stroke={C.mid} strokeWidth="3" strokeLinecap="round" opacity="0.8"/>
        <path d="M90 50 Q130 44 165 38" stroke={C.warn ?? '#fbbf24'} strokeWidth="3" strokeLinecap="round" opacity="0.85" strokeDasharray="5 3"/>
        <circle cx="20" cy="70" r="5" fill={C.accent ?? '#22c55e'}/>
        <circle cx="165" cy="38" r="5" fill={C.navy}/>
        <ellipse cx="130" cy="30" rx="22" ry="11" fill={C.soft} opacity="0.38"/>
        <ellipse cx="116" cy="33" rx="16" ry="9" fill={C.soft} opacity="0.42"/>
        {[108,118,128,138,148].map((x,i) => (
          <line key={i} x1={x} y1={40} x2={x-3} y2={50} stroke={C.mid} strokeWidth="1.2" opacity="0.5" strokeLinecap="round"/>
        ))}
      </g>
      <rect x="8" y="90" width="184" height="32" rx="10" fill={C.dark}/>
      <text x="20" y="103" fill={C.white} style={{fontSize:7,fontWeight:700,fontFamily:'system-ui'}}>Weather ahead</text>
      <text x="20" y="115" fill={C.soft} style={{fontSize:6,fontFamily:'system-ui'}}>Rain · 7°C · Route adjusted</text>
      <rect x="148" y="95" width="36" height="18" rx="9" fill={C.warn ? `${C.warn}22` : 'rgba(251,191,36,0.12)'} stroke={C.warn ?? '#fbbf24'} strokeWidth="1"/>
      <text x="166" y="107" textAnchor="middle" fill={C.warn ?? '#fbbf24'} style={{fontSize:7,fontWeight:700,fontFamily:'system-ui'}}>7°C</text>
    </svg>
  );
}

function L_RoutingDataFreshness() {
  const { palette: C } = useIlloStyle();
  const rows = [['Traffic','14s ago',1.0],['Road closures','2m ago',0.75],['Speed limits','18m ago',0.4]];
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <LP x="10" y="8" w="100" h="11" color={C.navy}/>
      <rect x="148" y="6" width="42" height="15" rx="7" fill={C.accent ? `${C.accent}22` : 'rgba(34,197,94,0.12)'}/>
      <text x="169" y="16" textAnchor="middle" fill={C.accent ?? '#22c55e'} style={{fontSize:6.5,fontWeight:700,fontFamily:'system-ui'}}>Live</text>
      {rows.map(([label,age,freshness],i) => (
        <g key={label}>
          <rect x="10" y={28+i*30} width="180" height="22" rx="6" fill={C.white} stroke={C.border} strokeWidth="1"/>
          <LP x="18" y={34+i*30} w="76" h="9" color={C.navy}/>
          <text x="182" y={42+i*30} textAnchor="end" fill={C.soft} style={{fontSize:6,fontFamily:'system-ui'}}>{age}</text>
          <rect x="108" y={36+i*30} width="60" height="7" rx="3.5" fill={C.panel}/>
          <rect x="108" y={36+i*30} width={60*freshness} height="7" rx="3.5"
            fill={freshness>0.7?(C.accent ?? '#22c55e'):freshness>0.4?(C.warn ?? '#fbbf24'):(C.danger ?? '#e2001a')}/>
        </g>
      ))}
    </svg>
  );
}

/* ── LDEVR additional light variants ─────────────────────────────────────────── */

function L_LDEVRVehicleBrand() {
  const { palette: C } = useIlloStyle();
  const brands = [['BMW','#1c69d4'],['Tesla','#cc0000'],['Audi','#bb0a14']];
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <LP x="10" y="8" w="110" h="11" color={C.navy}/>
      {brands.map(([name,brandColor],i) => (
        <g key={name}>
          <rect x="10" y={28+i*28} width="180" height="22" rx="8"
            fill={i===0?C.panel:C.white} stroke={i===0?C.mid:C.border} strokeWidth={i===0?1.5:1}/>
          <circle cx="24" cy={39+i*28} r="7" fill={brandColor} opacity="0.85"/>
          <LP x="38" y={33+i*28} w="80" h="9" color={C.navy}/>
          <LP x="38" y={44+i*28} w="50" h="7" color={C.soft}/>
          {i===0 && <rect x="158" y={33+i*28} width="24" height="14" rx="7" fill={C.mid}/>}
          {i===0 && <text x="170" y={43+i*28} textAnchor="middle" fill={C.white} style={{fontSize:7,fontWeight:700}}>✓</text>}
        </g>
      ))}
      <rect x="10" y="114" width="180" height="12" rx="6" fill={C.dark}/>
      <text x="18" y="123" fill={C.accent ?? '#22c55e'} style={{fontSize:5.5,fontFamily:'monospace'}}>variantId: 54B969E8-E28D-…</text>
    </svg>
  );
}

function L_LDEVROemEmsp() {
  const { palette: C } = useIlloStyle();
  const networks = [['Ionity','350 kW',true],['Fastned','300 kW',true],['bp pulse','50 kW',false]];
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <LP x="10" y="8" w="130" h="11" color={C.navy}/>
      <LP x="10" y="22" w="80" h="8" color={C.soft}/>
      {networks.map(([name,kw,compat],i) => (
        <g key={name}>
          <rect x="10" y={34+i*28} width="180" height="22" rx="8"
            fill={C.white} stroke={compat?C.mid:C.border} strokeWidth={compat?1.5:1}/>
          <circle cx="26" cy={45+i*28} r="9" fill={compat?C.mid:C.panel} opacity="0.9"/>
          <polygon points={`${26-3},${45+i*28-6} ${26+4},${45+i*28-2} ${26},${45+i*28-2} ${26},${45+i*28+5} ${26-4},${45+i*28+1} ${26},${45+i*28+1}`} fill={C.white}/>
          <LP x="42" y={38+i*28} w="74" h="9" color={C.navy}/>
          <LP x="42" y={50+i*28} w="44" h="7" color={C.soft}/>
          <rect x="158" y={38+i*28} width="26" height="13" rx="6.5"
            fill={compat?(C.accent ? `${C.accent}22` : 'rgba(34,197,94,0.12)'):C.panel}
            stroke={compat?(C.accent ?? '#22c55e'):C.border} strokeWidth="1"/>
          <text x="171" y={48+i*28} textAnchor="middle"
            fill={compat?(C.accent ?? '#22c55e'):C.soft}
            style={{fontSize:6,fontWeight:700,fontFamily:'system-ui'}}>{compat?'OEM':'—'}</text>
        </g>
      ))}
    </svg>
  );
}

function L_LDEVRComputeToll() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <path d="M10 66 Q100 61 190 64" stroke={C.panel} strokeWidth="10" strokeLinecap="round"/>
      <path d="M10 66 Q100 61 190 64" stroke={C.mid} strokeWidth="3" strokeLinecap="round" opacity="0.55" strokeDasharray="8 5"/>
      <rect x="98" y="44" width="4" height="30" rx="2" fill={C.navy}/>
      <rect x="100" y="44" width="48" height="5" rx="2.5" fill={C.danger ?? '#e2001a'}/>
      <rect x="82" y="36" width="18" height="32" rx="4" fill={C.dark}/>
      <rect x="86" y="41" width="10" height="12" rx="2" fill={C.mid} opacity="0.4"/>
      <circle cx="173" cy="50" r="10" fill={C.accent ? `${C.accent}22` : 'rgba(34,197,94,0.12)'} stroke={C.accent ?? '#22c55e'} strokeWidth="1.5"/>
      <text x="173" y="54" textAnchor="middle" fill={C.accent ?? '#22c55e'} style={{fontSize:7,fontWeight:700,fontFamily:'system-ui'}}>EV</text>
      <rect x="12" y="80" width="176" height="40" rx="10" fill={C.white} stroke={C.border} strokeWidth="1.5"/>
      {[['Base toll','€2.40',C.navy],['EV exemption','–€1.20',C.accent ?? '#22c55e'],['Total','€1.20',C.dark]].map(([label,val,col],i) => (
        <g key={label}>
          {i > 0 && <line x1="20" y1={90+i*10} x2="180" y2={90+i*10} stroke={C.border} strokeWidth="0.75" opacity="0.5"/>}
          <text x="22" y={99+i*10} fill={C.mid} style={{fontSize:6.5,fontFamily:'system-ui'}}>{label}</text>
          <text x="178" y={99+i*10} textAnchor="end" fill={col} style={{fontSize:7,fontWeight:700,fontFamily:'monospace'}}>{val}</text>
        </g>
      ))}
    </svg>
  );
}

function L_LDEVRChargingParks() {
  const { palette: C } = useIlloStyle();
  const hours = [['Mon–Fri','06:00–22:00'],['Sat','07:00–21:00'],['Sun','08:00–20:00']];
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <LP x="10" y="8" w="120" h="11" color={C.navy}/>
      <LP x="10" y="22" w="80" h="8" color={C.soft}/>
      <rect x="10" y="34" width="180" height="26" rx="8" fill={C.dark}/>
      <circle cx="28" cy="47" r="10" fill={C.mid} opacity="0.3"/>
      <polygon points="28,41 35,45 28,45 28,53 21,49 28,49" fill={C.accent ?? '#22c55e'}/>
      <LP x="44" y="39" w="94" h="9" color={C.white}/>
      <LP x="44" y="51" w="58" h="7" color={C.soft}/>
      <rect x="156" y="39" width="28" height="18" rx="9" fill={C.accent ? `${C.accent}22` : 'rgba(34,197,94,0.12)'} stroke={C.accent ?? '#22c55e'} strokeWidth="1"/>
      <text x="170" y="51" textAnchor="middle" fill={C.accent ?? '#22c55e'} style={{fontSize:7,fontWeight:700,fontFamily:'system-ui'}}>12/16</text>
      {hours.map(([day,hrs],i) => (
        <g key={day}>
          <rect x="10" y={64+i*20} width="180" height="16" rx="4" fill={C.white} stroke={C.border} strokeWidth="1"/>
          <text x="18" y={75+i*20} fill={C.navy} style={{fontSize:7,fontWeight:600,fontFamily:'system-ui'}}>{day}</text>
          <text x="182" y={75+i*20} textAnchor="end" fill={C.mid} style={{fontSize:7,fontFamily:'system-ui'}}>{hrs}</text>
        </g>
      ))}
    </svg>
  );
}

function L_LDEVRWeather() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <rect x="8" y="8" width="184" height="76" rx="12" fill={C.white} stroke={C.border} strokeWidth="1.5"/>
      <clipPath id="ii-llwea-map"><rect x="8" y="8" width="184" height="76" rx="12"/></clipPath>
      <g clipPath="url(#ii-llwea-map)">
        <DW x={8} y={8} w={184} h={76} op={0.3}/>
        <path d="M20 68 Q60 52 90 48" stroke={C.mid} strokeWidth="3" strokeLinecap="round" opacity="0.8"/>
        <path d="M90 48 Q130 42 165 36" stroke={C.warn ?? '#fbbf24'} strokeWidth="3" strokeLinecap="round" opacity="0.85" strokeDasharray="5 3"/>
        {[[90,48],[142,42]].map(([cx,cy],i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="9" fill={C.dark} stroke={C.accent ?? '#22c55e'} strokeWidth="1.5"/>
            <polygon points={`${cx-2.5},${cy-4} ${cx+3.5},${cy-1} ${cx},${cy-1} ${cx},${cy+4} ${cx-3.5},${cy+1} ${cx},${cy+1}`} fill={C.accent ?? '#22c55e'}/>
          </g>
        ))}
        <ellipse cx="130" cy="28" rx="22" ry="11" fill={C.soft} opacity="0.35"/>
        <ellipse cx="116" cy="31" rx="16" ry="9" fill={C.soft} opacity="0.4"/>
        {[110,120,130,140,150].map((x,i) => (
          <line key={i} x1={x} y1={38} x2={x-3} y2={48} stroke={C.mid} strokeWidth="1.2" opacity="0.5" strokeLinecap="round"/>
        ))}
        <circle cx="20" cy="68" r="5" fill={C.accent ?? '#22c55e'}/>
        <circle cx="165" cy="36" r="5" fill={C.navy}/>
      </g>
      <rect x="8" y="88" width="184" height="32" rx="10" fill={C.dark}/>
      <text x="18" y="101" fill={C.white} style={{fontSize:7,fontWeight:700,fontFamily:'system-ui'}}>Range impact</text>
      <text x="18" y="113" fill={C.soft} style={{fontSize:6,fontFamily:'system-ui'}}>Cold weather · –12% range</text>
      <rect x="130" y="93" width="56" height="22" rx="8" fill={C.warn ? `${C.warn}22` : 'rgba(251,191,36,0.12)'} stroke={C.warn ?? '#fbbf24'} strokeWidth="1"/>
      <text x="158" y="105" textAnchor="middle" fill={C.warn ?? '#fbbf24'} style={{fontSize:9,fontWeight:700,fontFamily:'system-ui'}}>–12%</text>
      <text x="158" y="113" textAnchor="middle" fill={C.warn ?? '#fbbf24'} style={{fontSize:5.5,fontFamily:'system-ui'}}>range</text>
    </svg>
  );
}

function L_LDEVRDataFreshness() {
  const { palette: C } = useIlloStyle();
  const rows = [['Charger status','8s ago',1.0],['Park capacity','45s ago',0.8],['Pricing','3m ago',0.55],['Amenities','2h ago',0.15]];
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <LP x="10" y="8" w="120" h="11" color={C.navy}/>
      <rect x="148" y="6" width="42" height="15" rx="7" fill={C.accent ? `${C.accent}22` : 'rgba(34,197,94,0.12)'}/>
      <text x="169" y="16" textAnchor="middle" fill={C.accent ?? '#22c55e'} style={{fontSize:6.5,fontWeight:700,fontFamily:'system-ui'}}>Live</text>
      {rows.map(([label,age,freshness],i) => (
        <g key={label}>
          <rect x="10" y={26+i*24} width="180" height="18" rx="5" fill={C.white} stroke={C.border} strokeWidth="1"/>
          <LP x="18" y={31+i*24} w="68" h="8" color={C.navy}/>
          <text x="178" y={38+i*24} textAnchor="end" fill={C.soft} style={{fontSize:5.5,fontFamily:'system-ui'}}>{age}</text>
          <rect x="98" y={32+i*24} width="58" height="6" rx="3" fill={C.panel}/>
          <rect x="98" y={32+i*24} width={58*freshness} height="6" rx="3"
            fill={freshness>0.7?(C.accent ?? '#22c55e'):freshness>0.35?(C.warn ?? '#fbbf24'):(C.danger ?? '#e2001a')}/>
        </g>
      ))}
    </svg>
  );
}

/* ── ANA light variants ───────────────────────────────────────────────────────── */

function L_VIL() {
  const { palette: C } = useIlloStyle();
  const signals = [['Battery SoC','74%'],['Connector','CCS2'],['Speed','87 km/h'],['GDPR','Granted']];
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <rect x="10" y="8" width="180" height="26" rx="8" fill={C.dark}/>
      <LP x="20" y="14" w="100" h="9" color={C.white}/>
      <LP x="20" y="26" w="70" h="8" color={C.soft}/>
      {signals.map(([label,value],i) => (
        <g key={label}>
          <rect x="10" y={42+i*20} width="180" height="16" rx="4"
            fill={C.panel} stroke={C.border} strokeWidth="1"/>
          <LP x="18" y={46+i*20} w="108" h="8" color={C.navy}/>
          <rect x="148" y={43+i*20} width="36" height="14" rx="7"
            fill="none" stroke={C.mid} strokeWidth="1.5"/>
          <text x="166" y={53+i*20} textAnchor="middle" fill={C.mid}
            style={{fontSize:7,fontWeight:700,fontFamily:'system-ui'}}>{value}</text>
        </g>
      ))}
    </svg>
  );
}

function L_CIL() {
  const { palette: C } = useIlloStyle();
  const cmds = [['navigateTo(destination)','Sets active route'],['cancelNavigation()','Ends session'],['searchNearby(query)','Returns POI list']];
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <rect x="10" y="8" width="180" height="26" rx="8" fill={C.dark}/>
      <LP x="20" y="14" w="90" h="9" color={C.white}/>
      <LP x="20" y="26" w="65" h="8" color={C.soft}/>
      {cmds.map(([fn,desc],i) => (
        <g key={fn}>
          <rect x="10" y={42+i*30} width="180" height="26" rx="8"
            fill={C.white} stroke={C.border} strokeWidth="1.5"/>
          <LP x="20" y={48+i*30} w="110" h="9" color={C.mid}/>
          <LP x="20" y={60+i*30} w="78" h="7" color={C.panel}/>
        </g>
      ))}
    </svg>
  );
}

function L_ANATheming() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <LP x="40" y="10" w="120" h="11" color={C.navy}/>
      {[{from:'#e2001a',to:'#0066ff',isColor:true},{from:'4dp',to:'12dp',isColor:false},{from:'Roboto',to:'Inter',isColor:false}].map(({from,to,isColor},i) => (
        <g key={i}>
          {isColor ? (
            <>
              <rect x="12" y={36+i*28} width="40" height="18" rx="5" fill={from}/>
              <rect x="148" y={36+i*28} width="40" height="18" rx="5" fill={to}/>
            </>
          ) : (
            <>
              <rect x="12" y={36+i*28} width="40" height="18" rx="5" fill={C.panel} stroke={C.border} strokeWidth="1"/>
              <text x="32" y={48+i*28} textAnchor="middle" fill={C.navy} style={{fontSize:7,fontFamily:'monospace'}}>{from}</text>
              <rect x="148" y={36+i*28} width="40" height="18" rx="5" fill={C.panel} stroke={C.border} strokeWidth="1"/>
              <text x="168" y={48+i*28} textAnchor="middle" fill={C.mid} style={{fontSize:7,fontFamily:'monospace'}}>{to}</text>
            </>
          )}
          <LP x="60" y={40+i*28} w="70" h="10" color={C.panel}/>
          <text x="100" y={50+i*28} textAnchor="middle" fill={C.mid} style={{fontSize:10}}>→</text>
        </g>
      ))}
      <rect x="26" y="120" width="60" height="8" rx="4" fill="#e2001a"/>
      <text x="100" y="127" textAnchor="middle" fill={C.mid} style={{fontSize:10}}>→</text>
      <rect x="118" y="120" width="60" height="8" rx="4" fill="#0066ff"/>
    </svg>
  );
}

/* ── ANA new hero illustrations (local copies — same as lightVariants.jsx exports) ── */

function L_ANA_Traffic() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.white}/>
      <DW x={0} y={0} w={200} h={130} op={0.3}/>
      <path d="M25 108 Q65 78 100 68 T175 38" stroke={C.mid} strokeWidth="3.5" strokeLinecap="round" opacity="0.75"/>
      <path d="M25 108 Q72 58 132 52 T175 38" stroke={C.accent ?? '#22c55e'} strokeWidth="2" strokeLinecap="round" strokeDasharray="6 4" opacity="0.7"/>
      <circle cx="100" cy="68" r="5" fill={C.navy}/><circle cx="100" cy="68" r="2.5" fill={C.white}/>
      <rect x="18" y="68" width="164" height="54" rx="10" fill={C.dark}/>
      <LP x="28" y="76" w="78" h="9" color={C.white}/>
      <LP x="28" y="88" w="58" h="7" color={C.accent ?? '#22c55e'}/>
      <rect x="28" y="99" width="68" height="15" rx="7" fill={C.mid}/>
      <LP x="36" y="103" w="52" h="7" color={C.white}/>
      <rect x="104" y="99" width="68" height="15" rx="7" fill="none" stroke={C.soft} strokeWidth="1.5"/>
      <LP x="112" y="103" w="52" h="7" color={C.soft}/>
    </svg>
  );
}

function L_ANA_Map() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.white}/>
      <DW x={0} y={0} w={200} h={130} op={0.35}/>
      <path d="M0 68 Q50 62 100 68 T200 63" stroke={C.panel} strokeWidth="7" strokeLinecap="round"/>
      <path d="M76 0 L74 130" stroke={C.panel} strokeWidth="5"/>
      <path d="M148 0 L144 130" stroke={C.panel} strokeWidth="5"/>
      <rect x="10" y="18" width="30" height="24" rx="2" fill={C.soft} opacity="0.55"/>
      <rect x="44" y="12" width="18" height="30" rx="2" fill={C.mid} opacity="0.28"/>
      <rect x="84" y="8" width="24" height="38" rx="2" fill={C.mid} opacity="0.32"/>
      <rect x="112" y="18" width="20" height="24" rx="2" fill={C.soft} opacity="0.48"/>
      <rect x="156" y="14" width="28" height="26" rx="2" fill={C.soft} opacity="0.42"/>
      <rect x="10" y="80" width="22" height="18" rx="2" fill={C.panel} opacity="0.6"/>
      <rect x="156" y="82" width="24" height="20" rx="2" fill={C.panel} opacity="0.5"/>
      <path d="M22 115 Q65 82 100 70 T178 40" stroke={C.mid} strokeWidth="10" strokeLinecap="round" opacity="0.18"/>
      <path d="M22 115 Q65 82 100 70 T178 40" stroke={C.navy} strokeWidth="3" strokeLinecap="round" opacity="0.85"/>
      <circle cx="100" cy="70" r="6" fill={C.navy}/><circle cx="100" cy="70" r="3" fill={C.white}/>
      <rect x="8" y="8" width="60" height="16" rx="8" fill={C.dark}/>
      <LP x="16" y="12" w="44" h="8" color={C.white}/>
    </svg>
  );
}

function L_ANA_EVSearch() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <rect x="8" y="6" width="184" height="20" rx="8" fill={C.white} stroke={C.border} strokeWidth="1.5"/>
      <circle cx="20" cy="16" r="5" fill={C.panel}/>
      <LP x="32" y="11" w="100" h="10" color={C.panel}/>
      <rect x="8" y="32" width="84" height="90" rx="8" fill={C.white} stroke={C.border} strokeWidth="1"/>
      <clipPath id="ii-laevs-map"><rect x="8" y="32" width="84" height="90" rx="8"/></clipPath>
      <g clipPath="url(#ii-laevs-map)">
        <DW x={8} y={32} w={84} h={90} op={0.35}/>
        {[[30,58],[58,52],[70,76]].map(([cx,cy],i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="9" fill={i===0?C.mid:C.soft} opacity={i===0?1:0.7}/>
            <polygon points={`${cx-2.5},${cy-5} ${cx+3.5},${cy-1} ${cx},${cy-1} ${cx},${cy+5} ${cx-3.5},${cy+1} ${cx},${cy+1}`} fill={C.white}/>
          </g>
        ))}
        <circle cx="50" cy="92" r="4" fill={C.navy}/>
      </g>
      {[['Ionity','350 kW'],['Fastned','300 kW'],['bp pulse','50 kW']].map(([name,kw],i) => (
        <g key={name}>
          {i>0 && <line x1="100" y1={32+i*30} x2="192" y2={32+i*30} stroke={C.border} strokeWidth="0.75" opacity="0.5"/>}
          <circle cx="110" cy={47+i*30} r="8" fill={i===0?C.mid:C.panel} stroke={i===0?'none':C.border} strokeWidth="1"/>
          <polygon points={`${110-2.5},${47+i*30-4} ${110+3.5},${47+i*30-1} ${110},${47+i*30-1} ${110},${47+i*30+5} ${110-3.5},${47+i*30+1} ${110},${47+i*30+1}`} fill={i===0?C.white:C.soft}/>
          <LP x="124" y={41+i*30} w="58" h="8" color={C.navy}/>
          <LP x="124" y={52+i*30} w="38" h="7" color={C.soft}/>
        </g>
      ))}
    </svg>
  );
}

function L_ANA_LDRoute() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <rect x="8" y="8" width="184" height="76" rx="10" fill={C.white} stroke={C.border} strokeWidth="1.5"/>
      <clipPath id="ii-laldr-map"><rect x="8" y="8" width="184" height="76" rx="10"/></clipPath>
      <g clipPath="url(#ii-laldr-map)">
        <DW x={8} y={8} w={184} h={76} op={0.35}/>
        <path d="M20 72 Q58 50 88 44 Q118 38 146 32 T184 22" stroke={C.mid} strokeWidth="3" strokeLinecap="round" opacity="0.8"/>
        {[[88,44],[146,32]].map(([cx,cy],i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="10" fill={C.dark} stroke={C.accent ?? '#22c55e'} strokeWidth="2"/>
            <polygon points={`${cx-3},${cy-5} ${cx+4},${cy-1} ${cx},${cy-1} ${cx},${cy+5} ${cx-4},${cy+1} ${cx},${cy+1}`} fill={C.accent ?? '#22c55e'}/>
          </g>
        ))}
        <circle cx="20" cy="72" r="6" fill={C.accent ?? '#22c55e'}/><circle cx="184" cy="22" r="6" fill={C.navy}/>
      </g>
      <rect x="8" y="88" width="184" height="34" rx="10" fill={C.dark}/>
      <LP x="18" y="95" w="52" h="9" color={C.white}/>
      <LP x="18" y="107" w="36" h="7" color={C.soft}/>
      <rect x="80" y="93" width="104" height="8" rx="4" fill="rgba(255,255,255,0.15)"/>
      <rect x="80" y="93" width="81" height="8" rx="4" fill={C.accent ?? '#22c55e'}/>
      <text x="80" y="112" fill={C.soft} style={{fontSize:6,fontFamily:'system-ui'}}>2 stops · 5h 26m</text>
      <text x="182" y="112" textAnchor="end" fill={C.accent ?? '#22c55e'} style={{fontSize:7,fontWeight:700,fontFamily:'system-ui'}}>78%</text>
    </svg>
  );
}

function L_ANA_DriverExp() {
  const { palette: C } = useIlloStyle();
  return (
    <svg viewBox="0 0 200 130" style={{width:'100%',height:'100%'}} fill="none">
      <rect width="200" height="130" fill={C.bg}/>
      <rect x="8" y="36" width="184" height="56" fill={C.white}/>
      <clipPath id="ii-lade-map"><rect x="8" y="36" width="184" height="56"/></clipPath>
      <g clipPath="url(#ii-lade-map)">
        <rect x="8" y="36" width="184" height="56" fill={C.white}/>
        <DW x={8} y={36} w={184} h={56} op={0.3}/>
        <path d="M20 80 Q75 58 118 62 T185 48" stroke={C.mid} strokeWidth="3" strokeLinecap="round" opacity="0.7"/>
        <circle cx="118" cy="62" r="5" fill={C.navy}/><circle cx="118" cy="62" r="2.5" fill={C.white}/>
      </g>
      <rect x="8" y="8" width="184" height="30" rx="8" fill={C.dark}/>
      <path d="M18,30 L18,17 L24,17 L24,13 L32,21 L24,29 L24,25 L21,25 L21,30 Z" fill={C.white}/>
      <text x="40" y="22" fill={C.white} style={{fontSize:9,fontWeight:700,fontFamily:'system-ui,sans-serif'}}>Turn right</text>
      <text x="40" y="32" fill={C.soft} style={{fontSize:6.5,fontFamily:'system-ui,sans-serif'}}>onto Main St · 320 m</text>
      <rect x="164" y="38" width="24" height="52" rx="6" fill={C.dark} opacity="0.85"/>
      {['+','−','◎'].map((lbl,i) => (
        <text key={lbl} x="176" y={54+i*16} textAnchor="middle" fill={C.white} style={{fontSize:9}}>{lbl}</text>
      ))}
      <rect x="8" y="94" width="184" height="28" rx="8" fill={C.dark}/>
      {[['14:32','ETA',47],['22 min','Time',100],['8.4 km','Dist',153]].map(([v,l,x]) => (
        <g key={l}>
          <text x={x} y="106" textAnchor="middle" fill={C.white} style={{fontSize:9,fontWeight:700,fontFamily:'system-ui,sans-serif'}}>{v}</text>
          <text x={x} y="117" textAnchor="middle" fill={C.soft} style={{fontSize:6.5,fontFamily:'system-ui,sans-serif'}}>{l}</text>
        </g>
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Search & Places — dark variants
   ───────────────────────────────────────────────────────────────────────────── */

function useDarkStyle() {
  const { palette: C } = useIlloStyle();
  return {
    bg:     C.bg,
    card:   C.panel,
    line:   C.border,
    text:   C.navy,
    dim:    C.mid,
    muted:  C.soft,
    green:  C.accent,
    blue:   C.mid,     // C.soft was too light (#A8C8E8) in day; C.mid (#5B8AC5) has better contrast
    red:    C.danger,
    amber:  C.warn,
    purple: C.accent,  // day: forest green, night: bright green, blueprint: theme accent
    dark:   C.dark,
    white:  C.white,
  };
}

export function IlloIntentRouting() {
  const M = useDarkStyle();
  const routes = [
    { label: 'NAVIGATE_TO', color: '#e2001a' },
    { label: 'PLAY_MEDIA',  color: M.blue },
    { label: 'SET_CLIMATE', color: M.amber },
    { label: 'CALL_CONTACT',color: M.green },
  ];
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ background: M.card, border: `1px solid ${M.line}`, borderRadius: 6, padding: '5px 8px' }}>
        <div style={{ fontSize: '0.5rem', color: M.dim, marginBottom: 2 }}>User utterance</div>
        <div style={{ fontSize: '0.5rem', color: M.text }}>"Navigate home, then play my playlist"</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <div style={{ width: 1, height: 6, background: M.line }} />
        <div style={{ background: M.card, border: `1.5px solid ${M.purple}`, borderRadius: 4, padding: '3px 14px' }}>
          <span style={{ fontSize: '0.5rem', color: M.purple, fontWeight: 700 }}>TAIA Intent Router</span>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          {routes.map(({ label, color }) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <div style={{ width: 1, height: 6, background: M.line }} />
              <div style={{ fontSize: '0.4rem', color, fontFamily: 'monospace', fontWeight: 700, background: `${color}18`, border: `1px solid ${color}55`, borderRadius: 3, padding: '2px 5px', textAlign: 'center', whiteSpace: 'nowrap' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function IlloVoiceEngine() {
  const M = useDarkStyle();
  const waveH = [4, 8, 13, 18, 13, 9, 16, 11, 7, 14, 10, 6, 15, 9, 5];
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: '10px 12px' }}>
      <div style={{ fontSize: '0.5rem', color: M.dim, marginBottom: 8 }}>Voice Engine — TTS output</div>
      <div style={{ background: M.card, border: `1px solid ${M.line}`, borderRadius: 6, padding: '5px 8px', marginBottom: 10 }}>
        <div style={{ fontSize: '0.5rem', color: M.text, lineHeight: 1.4 }}>"Turn left onto High Street in 200 metres"</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <div style={{ flex: 1, height: 1, background: M.line }} />
        <span style={{ fontSize: '0.5rem', color: M.blue, fontWeight: 700 }}>OEM TTS Engine</span>
        <div style={{ flex: 1, height: 1, background: M.line }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, height: 24 }}>
        {waveH.map((h, i) => (
          <div key={i} style={{ width: 3, height: h, borderRadius: 2, background: M.blue, opacity: 0.45 + (i % 3) * 0.18 }} />
        ))}
      </div>
    </div>
  );
}

export function IlloEVBattery() {
  const M = useDarkStyle();
  const params = [
    ['Capacity',   '77 kWh',   M.text],
    ['Connector',  'CCS2',     M.blue],
    ['Consumption','18 Wh/km', M.text],
    ['Max charge', '150 kW',   M.amber],
  ];
  const cells = [M.green, M.green, M.green, M.amber, M.line];
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10, display: 'flex', gap: 8 }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 2, flexShrink: 0 }}>
        <div style={{ width: 10, height: 4, borderRadius: '2px 2px 0 0', background: M.line, margin: '0 auto' }} />
        <div style={{ width: 26, border: `1.5px solid ${M.line}`, borderRadius: 3, padding: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {cells.map((c, i) => (
            <div key={i} style={{ height: 5, borderRadius: 1, background: c, opacity: i === 4 ? 0.35 : 1 }} />
          ))}
        </div>
        <div style={{ fontSize: '0.5rem', fontWeight: 700, color: M.green, marginTop: 2 }}>74%</div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5, paddingTop: 4 }}>
        <div style={{ fontSize: '0.5rem', fontWeight: 700, color: M.text, marginBottom: 2 }}>Vehicle &amp; Battery</div>
        {params.map(([k, v, c]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${M.line}`, paddingBottom: 3 }}>
            <span style={{ fontSize: '0.5rem', color: M.dim }}>{k}</span>
            <span style={{ fontSize: '0.5rem', fontWeight: 600, color: c }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function IlloEVNavUI() {
  const M = useDarkStyle();
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, bottom: 52 }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 80" fill="none">
          <path d="M10 65 Q55 38 100 58 L165 28" stroke="#e2001a" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
          <circle cx="100" cy="57" r="4" fill="#e2001a" opacity="0.8"/>
          <circle cx="165" cy="28" r="6" fill={M.green} opacity="0.9"/>
          <text x="165" y="31" textAnchor="middle" fill="white" style={{ fontSize: 6, fontFamily: 'system-ui', fontWeight: 700 }}>⚡</text>
        </svg>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: M.dark, borderTop: `1px solid ${M.line}55`, padding: '7px 12px' }}>
        <div style={{ fontSize: '0.5rem', color: M.dim, marginBottom: 5 }}>Ionity · 48 km · <span style={{ color: M.green }}>3/4 avail.</span></div>
        <div style={{ height: 4, background: M.line, borderRadius: 3, overflow: 'hidden', marginBottom: 4 }}>
          <div style={{ height: '100%', width: '63%', background: M.green, borderRadius: 3 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.5rem', color: M.green, fontWeight: 700 }}>63% SoC</span>
          <span style={{ fontSize: '0.5rem', color: M.dim }}>→ 25% at stop</span>
        </div>
      </div>
    </div>
  );
}

export function IlloRouteBar() {
  const M = useDarkStyle();
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, bottom: 52 }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 80" fill="none">
          <path d="M10 55 Q60 32 100 52 T190 45" stroke="#e2001a" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
          <circle cx="100" cy="51" r="4" fill="#e2001a" opacity="0.8"/>
        </svg>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: M.dark, borderTop: `1px solid ${M.line}55`, padding: '8px 12px' }}>
        <div style={{ height: 4, background: M.line, borderRadius: 3, overflow: 'hidden', marginBottom: 6, position: 'relative' }}>
          <div style={{ height: '100%', width: '38%', background: '#e2001a', borderRadius: 3 }} />
          <div style={{ position: 'absolute', left: '38%', top: '50%', transform: 'translate(-50%,-50%)', width: 8, height: 8, borderRadius: '50%', background: M.white, border: '2px solid #e2001a' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.5rem', color: M.dim }}>Home</span>
          <span style={{ fontSize: '0.5rem', color: M.white, fontWeight: 600 }}>18 min · 6.4 km</span>
          <span style={{ fontSize: '0.5rem', color: M.dim }}>Office</span>
        </div>
      </div>
    </div>
  );
}

export function IlloInstructionPanel() {
  const M = useDarkStyle();
  return (
    <div style={{ background: M.bg, borderRadius: 20, overflow: 'hidden', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 46, bottom: 0, left: 0, right: 0 }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 90" fill="none">
          <path d="M10 60 Q60 38 100 58 T190 50" stroke="#e2001a" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
          <circle cx="100" cy="57" r="4" fill="#e2001a" opacity="0.8"/>
        </svg>
      </div>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: M.dark, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: 6, background: '#e2001a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M3 20 L3 10 Q3 3 10 3 L15 3 L11.5 0 L20 0 L20 8 L16.5 5 Q13 5 13 10 L13 20 Z"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: M.white }}>200 m</div>
          <div style={{ fontSize: '0.5rem', color: M.dim }}>High Street</div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: '0.5rem', fontWeight: 600, color: M.white }}>14:32</div>
          <div style={{ fontSize: '0.5rem', color: M.dim }}>ETA</div>
        </div>
      </div>
    </div>
  );
}

export function IlloSpeechToText() {
  const M = useDarkStyle();
  const bars = [4, 7, 12, 9, 14, 10, 7, 13, 8, 5, 11, 9, 6, 10];
  return (
    <svg viewBox="0 0 280 175" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect width="280" height="175" fill={M.bg}/>
      {/* Mic */}
      <rect x="127" y="28" width="26" height="44" rx="13" fill={M.blue} opacity="0.9"/>
      <path d="M108 65 Q108 94 140 94 Q172 94 172 65" stroke={M.blue} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <line x1="140" y1="94" x2="140" y2="112" stroke={M.blue} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="123" y1="112" x2="157" y2="112" stroke={M.blue} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Waveform */}
      {bars.map((h, i) => (
        <rect key={i} x={188 + i * 7} y={87 - h} width="4" height={h * 2} rx="2" fill={M.green} opacity="0.75"/>
      ))}
      {/* Transcription lines */}
      <rect x="30" y="130" width="115" height="6" rx="3" fill={M.muted} opacity="0.45"/>
      <rect x="30" y="144" width="85" height="6" rx="3" fill={M.muted} opacity="0.3"/>
    </svg>
  );
}

export function IlloAIConfig() {
  const M = useDarkStyle();
  const lines = [
    { x: 48, w: 55, col: M.blue },
    { x: 56, w: 80, col: M.muted },
    { x: 56, w: 95, col: M.green },
    { x: 56, w: 65, col: M.muted },
    { x: 48, w: 55, col: M.amber },
    { x: 56, w: 72, col: M.blue },
  ];
  return (
    <svg viewBox="0 0 280 175" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect width="280" height="175" fill={M.bg}/>
      <rect x="28" y="28" width="224" height="119" rx="12" fill={M.card} stroke={M.line}/>
      {/* Traffic lights */}
      <circle cx="47" cy="46" r="5" fill={M.red} opacity="0.8"/>
      <circle cx="61" cy="46" r="5" fill={M.amber} opacity="0.8"/>
      <circle cx="75" cy="46" r="5" fill={M.green} opacity="0.8"/>
      {/* Code lines */}
      {lines.map((l, i) => (
        <rect key={i} x={l.x} y={62 + i * 13} width={l.w} height="5" rx="2" fill={l.col} opacity="0.65"/>
      ))}
    </svg>
  );
}

export function IlloVIBasics() {
  const M = useDarkStyle();
  return (
    <svg viewBox="0 0 280 175" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect width="280" height="175" fill={M.bg}/>
      {/* NavSDK box */}
      <rect x="16" y="62" width="78" height="48" rx="8" fill={M.card} stroke={M.blue} strokeWidth="1.5"/>
      <text x="55" y="84" textAnchor="middle" fill={M.blue} fontSize="8" fontFamily="monospace" fontWeight="bold">NavSDK</text>
      <text x="55" y="97" textAnchor="middle" fill={M.dim} fontSize="7">engine</text>
      {/* Arrow */}
      <path d="M94 86 L126 86" stroke={M.line} strokeWidth="1.5" markerEnd="none"/>
      <path d="M122 82 L126 86 L122 90" stroke={M.line} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* VIL box */}
      <rect x="126" y="62" width="78" height="48" rx="8" fill={M.card} stroke={M.green} strokeWidth="1.5"/>
      <text x="165" y="84" textAnchor="middle" fill={M.green} fontSize="8" fontFamily="monospace" fontWeight="bold">VIL</text>
      <text x="165" y="97" textAnchor="middle" fill={M.dim} fontSize="7">integration</text>
      {/* Arrow */}
      <path d="M204 86 L236 86" stroke={M.line} strokeWidth="1.5"/>
      <path d="M232 82 L236 86 L232 90" stroke={M.line} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* App box */}
      <rect x="236" y="62" width="28" height="48" rx="6" fill={M.card} stroke={M.line}/>
      <text x="250" y="82" textAnchor="middle" fill={M.dim} fontSize="6" fontFamily="monospace">OEM</text>
      <text x="250" y="94" textAnchor="middle" fill={M.dim} fontSize="6" fontFamily="monospace">App</text>
    </svg>
  );
}

export function IlloHUD() {
  const M = useDarkStyle();
  return (
    <svg viewBox="0 0 280 175" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect width="280" height="175" fill={M.bg}/>
      {/* Windshield */}
      <path d="M38 148 Q35 60 78 36 L202 36 Q245 60 242 148 Z" fill={M.dark} stroke={M.line} strokeWidth="1.5" opacity="0.65"/>
      {/* HUD projection box */}
      <rect x="82" y="72" width="116" height="55" rx="7" fill="none" stroke={M.blue} strokeWidth="1.2" strokeDasharray="5,3" opacity="0.75"/>
      {/* Speed */}
      <text x="140" y="97" textAnchor="middle" fill={M.white} fontSize="18" fontWeight="bold" fontFamily="monospace">72</text>
      <text x="140" y="110" textAnchor="middle" fill={M.dim} fontSize="8">km/h</text>
      {/* Manoeuvre text */}
      <text x="140" y="122" textAnchor="middle" fill={M.blue} fontSize="7">600 m · ↱  High Street</text>
    </svg>
  );
}

export function IlloTruck() {
  const M = useDarkStyle();
  return (
    <svg viewBox="0 0 280 175" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect width="280" height="175" fill={M.bg}/>
      {/* Trailer body */}
      <rect x="12" y="75" width="182" height="64" rx="4" fill={M.card} stroke={M.line}/>
      {/* Cab */}
      <path d="M194 75 L194 139 L268 139 L268 100 L236 75 Z" fill={M.card} stroke={M.line}/>
      {/* Cab window */}
      <path d="M200 77 L200 98 L262 98 L262 77 Z" fill={M.dark} opacity="0.55" rx="2"/>
      {/* Wheels */}
      <circle cx="55" cy="145" r="12" fill={M.line}/><circle cx="55" cy="145" r="6" fill={M.card}/>
      <circle cx="143" cy="145" r="12" fill={M.line}/><circle cx="143" cy="145" r="6" fill={M.card}/>
      <circle cx="232" cy="145" r="12" fill={M.line}/><circle cx="232" cy="145" r="6" fill={M.card}/>
      {/* Dashboard screen */}
      <rect x="212" y="80" width="40" height="22" rx="3" fill={M.dark} stroke={M.blue} strokeWidth="1"/>
      <rect x="216" y="84" width="14" height="4" rx="1" fill={M.blue} opacity="0.8"/>
      <rect x="216" y="92" width="10" height="4" rx="1" fill={M.muted} opacity="0.5"/>
    </svg>
  );
}

export function IlloEVRequirements() {
  const M = useDarkStyle();
  const items = [
    { label: 'NavSDK ≥ 1.4.0', done: true },
    { label: 'EV Extension SDK', done: true },
    { label: 'INTERNET permission', done: true },
    { label: 'BMS data binding', done: false },
  ];
  return (
    <svg viewBox="0 0 280 175" fill="none" style={{ width: '100%', height: '100%' }}>
      <rect width="280" height="175" fill={M.bg}/>
      {items.map((item, i) => (
        <g key={i} transform={`translate(30, ${28 + i * 34})`}>
          <rect width="220" height="24" rx="6" fill={M.card} stroke={M.line}/>
          <circle cx="16" cy="12" r="7" fill={item.done ? M.green : M.muted} opacity={item.done ? 0.9 : 0.4}/>
          {item.done && <path d="M13 12 L15 14 L19 9" stroke={M.bg} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>}
          <rect x="30" y="9" width={item.done ? 120 : 80} height="6" rx="3" fill={M.text} opacity="0.28"/>
        </g>
      ))}
    </svg>
  );
}

export function IlloSearchFuzzy() {
  const D = useDarkStyle();
  const rows = [['📍 Place name', '0.3 km', D.blue], ['🏪 Fuzzy match', '0.7 km', D.dim], ['📍 Street addr.', '1.1 km', D.blue], ['🏥 Category hit', '1.4 km', D.dim]];
  return (
    <div style={{ background: D.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: D.card, borderRadius: 8, padding: '5px 8px', marginBottom: 8, border: `1px solid ${D.line}` }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={D.dim} strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <span style={{ fontSize: '0.5rem', color: D.dim, flex: 1 }}>Search anywhere…</span>
        <span style={{ fontSize: '0.45rem', padding: '1px 5px', borderRadius: 4, background: D.blue, color: '#fff' }}>Fuzzy</span>
      </div>
      {rows.map(([name, dist, col], i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 2px', borderBottom: i < 3 ? `1px solid ${D.line}` : 'none' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: i === 0 ? D.red : D.card, border: `1.5px solid ${col}`, flexShrink: 0 }}/>
          <span style={{ fontSize: '0.5rem', color: D.text, flex: 1 }}>{name}</span>
          <span style={{ fontSize: '0.5rem', color: D.dim }}>{dist}</span>
        </div>
      ))}
    </div>
  );
}

export function IlloSearchPOI() {
  const D = useDarkStyle();
  const cats = [['☕ Cafe', D.amber], ['⛽ Fuel', D.blue], ['🍕 Food', D.red], ['🏨 Hotel', D.purple]];
  const pois = [['Café Central', '0.2 km', '★ 4.7'], ['Brasserie Nord', '0.5 km', '★ 4.4'], ['La Terrasse', '0.9 km', '★ 4.2']];
  return (
    <div style={{ background: D.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ display: 'flex', gap: 5, marginBottom: 8, flexWrap: 'wrap' }}>
        {cats.map(([l, c], i) => (
          <span key={i} style={{ fontSize: '0.45rem', padding: '2px 6px', borderRadius: 10, background: i === 0 ? c : D.card, color: i === 0 ? '#000' : D.dim, border: `1px solid ${i === 0 ? c : D.line}` }}>{l}</span>
        ))}
      </div>
      {pois.map(([name, dist, rating], i) => (
        <div key={i} style={{ display: 'flex', gap: 6, padding: '5px 0', borderTop: i > 0 ? `1px solid ${D.line}` : 'none' }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: D.card, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', flexShrink: 0 }}>☕</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.5rem', fontWeight: 700, color: D.text }}>{name}</div>
            <div style={{ fontSize: '0.45rem', color: D.dim }}>{dist} · <span style={{ color: D.amber }}>{rating}</span></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function IlloSearchCategory() {
  const D = useDarkStyle();
  const tree = [['🍽️ Food & Drink', true, 0], ['  ☕ Cafe/Bar', false, 1], ['  🍕 Restaurant', true, 1], ['  🍺 Pub', false, 1], ['🛍️ Shopping', false, 0]];
  return (
    <div style={{ background: D.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: D.text, marginBottom: 2 }}>Category Search</div>
      <div style={{ fontSize: '0.45rem', color: D.dim, marginBottom: 8 }}>Browse POI taxonomy</div>
      {tree.map(([label, active, indent], i) => (
        <div key={i} style={{ padding: `3px ${4 + indent * 10}px`, background: active ? 'rgba(88,166,255,0.12)' : 'none', borderRadius: 4, marginBottom: 1 }}>
          <span style={{ fontSize: '0.5rem', color: active ? D.blue : D.dim, fontWeight: active ? 700 : 400 }}>{label}</span>
        </div>
      ))}
      <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: D.green }}/>
        <span style={{ fontSize: '0.45rem', color: D.green }}>243 results found</span>
      </div>
    </div>
  );
}

export function IlloSearchNearby() {
  const D = useDarkStyle();
  const pins = [['Cafe Nord', '0.2 km'], ['Hotel Arc', '0.5 km'], ['Park Mall', '0.8 km']];
  return (
    <div style={{ background: D.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ position: 'relative', height: 70, background: '#0f1a28', borderRadius: 8, marginBottom: 8, overflow: 'hidden' }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 160 70" fill="none">
          <circle cx="80" cy="35" r="25" stroke={D.blue} strokeWidth="1" strokeDasharray="3 3" opacity="0.4"/>
          <circle cx="80" cy="35" r="15" stroke={D.blue} strokeWidth="0.5" opacity="0.25"/>
          <circle cx="80" cy="35" r="5" fill={D.red}/>
          {[[58,20],[100,28],[65,52]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r="4" fill={D.blue} opacity="0.8"/>)}
        </svg>
      </div>
      {pins.map(([name, dist], i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', borderTop: i > 0 ? `1px solid ${D.line}` : 'none' }}>
          <span style={{ fontSize: '0.5rem', color: D.text }}>{name}</span>
          <span style={{ fontSize: '0.5rem', color: D.dim }}>{dist}</span>
        </div>
      ))}
    </div>
  );
}

export function IlloSearchAlongRoute() {
  const D = useDarkStyle();
  return (
    <div style={{ background: D.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: D.text, marginBottom: 2 }}>Along Route Search</div>
      <div style={{ position: 'relative', height: 80, background: '#0f1a28', borderRadius: 8, marginBottom: 8, overflow: 'hidden' }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 160 80" fill="none">
          <path d="M15 65 Q50 50 80 40 Q110 30 145 15" stroke={D.red} strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M15 65 Q50 50 80 40 Q110 30 145 15" stroke="rgba(226,0,26,0.15)" strokeWidth="10" strokeLinecap="round"/>
          {[[55,48],[85,38],[115,27]].map(([x,y],i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="7" fill={D.card} stroke={D.blue} strokeWidth="1.5"/>
              <text x={x} y={y+3} textAnchor="middle" fill={D.blue} style={{fontSize:7}}>⛽</text>
            </g>
          ))}
        </svg>
      </div>
      <div style={{ fontSize: '0.45rem', color: D.green }}>⚡ 3 fuel stations · within 2 km deviation</div>
    </div>
  );
}

export function IlloSearchAutocomplete() {
  const D = useDarkStyle();
  const suggestions = ['Amsterdam Centr…', 'Amsterdam Airport', 'Amsterdam Noord'];
  return (
    <div style={{ background: D.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: D.card, borderRadius: 8, padding: '5px 8px', marginBottom: 6, border: `1px solid ${D.blue}` }}>
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={D.blue} strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <span style={{ fontSize: '0.5rem', color: D.text }}>Amster<span style={{ color: D.blue }}>|</span></span>
      </div>
      {suggestions.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 6px', background: i === 0 ? 'rgba(88,166,255,0.1)' : 'none', borderRadius: 4, marginBottom: 2 }}>
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={D.dim} strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span style={{ fontSize: '0.5rem', color: i === 0 ? D.text : D.dim }}>{s}</span>
        </div>
      ))}
      <div style={{ marginTop: 4, fontSize: '0.45rem', color: D.dim }}>⌛ Debounce 300ms · typeahead</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Geocoding — dark variants
   ───────────────────────────────────────────────────────────────────────────── */

export function IlloGeocode() {
  const D = useDarkStyle();
  return (
    <div style={{ background: D.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: D.text, marginBottom: 6 }}>Geocoding</div>
      <div style={{ background: D.card, borderRadius: 6, padding: '6px 8px', marginBottom: 6, border: `1px solid ${D.line}` }}>
        <div style={{ fontSize: '0.45rem', color: D.dim, marginBottom: 2 }}>ADDRESS INPUT</div>
        <div style={{ fontSize: '0.5rem', color: D.text }}>Hullenbergweg 11, Amsterdam</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={D.blue} strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
      </div>
      <div style={{ background: 'rgba(88,166,255,0.08)', borderRadius: 6, padding: '6px 8px', border: `1px solid rgba(88,166,255,0.2)` }}>
        <div style={{ fontSize: '0.45rem', color: D.blue, marginBottom: 2 }}>COORDINATES</div>
        <div style={{ fontSize: '0.5rem', color: D.text, fontFamily: 'monospace' }}>52.2977°N 4.9418°E</div>
        <div style={{ fontSize: '0.45rem', color: D.dim, marginTop: 2 }}>Confidence: 0.97 · match: street</div>
      </div>
    </div>
  );
}

export function IlloReverseGeocode() {
  const D = useDarkStyle();
  return (
    <div style={{ background: D.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: D.text, marginBottom: 6 }}>Reverse Geocode</div>
      <div style={{ position: 'relative', height: 64, background: '#0f1a28', borderRadius: 8, marginBottom: 6, overflow: 'hidden' }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 160 64" fill="none">
          <circle cx="80" cy="32" r="5" fill={D.red}/>
          <line x1="80" y1="0" x2="80" y2="27" stroke={D.dim} strokeWidth="0.5" strokeDasharray="3 2"/>
          <line x1="80" y1="37" x2="80" y2="64" stroke={D.dim} strokeWidth="0.5" strokeDasharray="3 2"/>
          <line x1="0" y1="32" x2="75" y2="32" stroke={D.dim} strokeWidth="0.5" strokeDasharray="3 2"/>
          <line x1="85" y1="32" x2="160" y2="32" stroke={D.dim} strokeWidth="0.5" strokeDasharray="3 2"/>
          <text x="85" y="16" fill={D.blue} style={{fontSize:8}}>52.29°N</text>
          <text x="85" y="50" fill={D.blue} style={{fontSize:8}}>4.94°E</text>
        </svg>
      </div>
      <div style={{ background: D.card, borderRadius: 6, padding: '5px 8px', border: `1px solid ${D.line}` }}>
        <div style={{ fontSize: '0.45rem', color: D.dim, marginBottom: 1 }}>RESOLVED ADDRESS</div>
        <div style={{ fontSize: '0.5rem', color: D.text }}>Hullenbergweg 11, Amsterdam</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Traffic — dark variants
   ───────────────────────────────────────────────────────────────────────────── */

export function IlloTrafficFlow() {
  const D = useDarkStyle();
  return (
    <div style={{ background: D.bg, borderRadius: 20, overflow: 'hidden', height: '100%' }}>
      <svg width="100%" height="100%" viewBox="0 0 160 110" preserveAspectRatio="xMidYMid slice">
        <rect width="160" height="110" fill={D.bg}/>
        {/* City blocks */}
        <rect x="0"   y="0"  width="44" height="42" fill={D.card} opacity="0.55" rx="2"/>
        <rect x="58"  y="0"  width="44" height="42" fill={D.card} opacity="0.55" rx="2"/>
        <rect x="116" y="0"  width="44" height="42" fill={D.card} opacity="0.55" rx="2"/>
        <rect x="0"   y="56" width="44" height="54" fill={D.card} opacity="0.55" rx="2"/>
        <rect x="58"  y="56" width="44" height="54" fill={D.card} opacity="0.55" rx="2"/>
        <rect x="116" y="56" width="44" height="54" fill={D.card} opacity="0.55" rx="2"/>
        {/* Road surfaces */}
        <rect x="0"  y="42" width="160" height="14" fill="#1a2535"/>
        <rect x="44" y="0"  width="14"  height="110" fill="#1a2535"/>
        <rect x="102" y="0" width="14"  height="110" fill="#1a2535"/>
        {/* Traffic color overlay — main horizontal road */}
        <rect x="0"   y="45" width="42"  height="6" rx="1.5" fill="#22c55e" opacity="0.92"/>
        <rect x="56"  y="45" width="44"  height="6" rx="1.5" fill="#fbbf24" opacity="0.92"/>
        <rect x="102" y="45" width="14"  height="6" rx="1.5" fill="#f97316" opacity="0.92"/>
        <rect x="116" y="45" width="44"  height="6" rx="1.5" fill="#ef4444" opacity="0.92"/>
        {/* Traffic color overlay — vertical roads */}
        <rect x="47" y="0"   width="6" height="40" rx="1.5" fill="#22c55e" opacity="0.8"/>
        <rect x="47" y="58"  width="6" height="52" rx="1.5" fill="#22c55e" opacity="0.8"/>
        <rect x="105" y="0"  width="6" height="40" rx="1.5" fill="#fbbf24" opacity="0.8"/>
        <rect x="105" y="58" width="6" height="52" rx="1.5" fill="#ef4444" opacity="0.8"/>
        {/* Speed popup over the orange section */}
        <rect x="90" y="22" width="46" height="20" rx="4" fill="#0b1622" opacity="0.97"/>
        <rect x="90" y="22" width="46" height="20" rx="4" fill="none" stroke={D.line} strokeWidth="0.75"/>
        <circle cx="99" cy="32" r="4" fill="#f97316"/>
        <rect x="107" y="27" width="22" height="4" rx="1.5" fill="#e2e8f0"/>
        <rect x="107" y="34" width="16" height="3" rx="1"   fill="#475569"/>
        <polygon points="106,42 118,42 112,47" fill="#0b1622"/>
        {/* Legend strip */}
        <rect x="0" y="96" width="160" height="14" fill="#070d18" opacity="0.9"/>
        <circle cx="11"  cy="103" r="3.5" fill="#22c55e"/>
        <rect x="17"  y="101" width="24" height="3.5" rx="1" fill="#3d5572"/>
        <circle cx="55"  cy="103" r="3.5" fill="#fbbf24"/>
        <rect x="61"  y="101" width="18" height="3.5" rx="1" fill="#3d5572"/>
        <circle cx="93"  cy="103" r="3.5" fill="#ef4444"/>
        <rect x="99"  y="101" width="22" height="3.5" rx="1" fill="#3d5572"/>
      </svg>
    </div>
  );
}

export function IlloTrafficIncidents() {
  const D = useDarkStyle();
  return (
    <div style={{ background: D.bg, borderRadius: 20, overflow: 'hidden', height: '100%' }}>
      <svg width="100%" height="100%" viewBox="0 0 160 110" preserveAspectRatio="xMidYMid slice">
        <rect width="160" height="110" fill={D.bg}/>
        {/* City blocks */}
        <rect x="0"   y="0"  width="62" height="42" fill={D.card} opacity="0.5" rx="2"/>
        <rect x="76"  y="0"  width="84" height="42" fill={D.card} opacity="0.5" rx="2"/>
        <rect x="0"   y="56" width="34" height="54" fill={D.card} opacity="0.5" rx="2"/>
        <rect x="48"  y="56" width="30" height="54" fill={D.card} opacity="0.5" rx="2"/>
        <rect x="92"  y="56" width="68" height="54" fill={D.card} opacity="0.5" rx="2"/>
        {/* Road surfaces */}
        <rect x="0"  y="42"  width="160" height="14" fill="#1a2535"/>
        <rect x="62" y="0"   width="14"  height="110" fill="#1a2535"/>
        <rect x="34" y="42"  width="14"  height="68" fill="#1a2535"/>
        {/* Slight flow color on roads (background context) */}
        <rect x="0"  y="46" width="60" height="5" rx="1" fill="#22c55e" opacity="0.5"/>
        <rect x="74" y="46" width="86" height="5" rx="1" fill="#22c55e" opacity="0.5"/>
        <rect x="65" y="0"  width="5"  height="40" rx="1" fill="#22c55e" opacity="0.45"/>
        <rect x="65" y="58" width="5"  height="52" rx="1" fill="#22c55e" opacity="0.45"/>
        {/* ── Incident marker 1 — Accident (red circle + !) ── */}
        <circle cx="38" cy="49" r="9" fill="#ef4444" opacity="0.95"/>
        <circle cx="38" cy="49" r="12" stroke="#ef4444" strokeWidth="1" fill="none" opacity="0.3"/>
        <rect x="36.5" y="43" width="3" height="8"  rx="1.5" fill="white"/>
        <circle cx="38" cy="54.5" r="1.8" fill="white"/>
        {/* ── Incident marker 2 — Roadworks (amber diamond) ── */}
        <rect x="60" y="28" width="13" height="13" rx="1.5" fill="#fbbf24" opacity="0.95" transform="rotate(45 66.5 34.5)"/>
        <rect x="64.5" y="29.5" width="4" height="7"  rx="1" fill="#1a1a1a"/>
        <rect x="64.5" y="38"  width="4" height="2"   rx="1" fill="#1a1a1a"/>
        {/* ── Incident marker 3 — Road closed (slate bar) ── */}
        <rect x="103" y="44" width="18" height="10" rx="3" fill="#475569" opacity="0.95"/>
        <line x1="106" y1="47" x2="118" y2="51" stroke="white" strokeWidth="1.5"/>
        <line x1="118" y1="47" x2="106" y2="51" stroke="white" strokeWidth="1.5"/>
        {/* ── Incident popup for accident ── */}
        <rect x="2" y="62" width="64" height="26" rx="4" fill="#0b1622" opacity="0.97"/>
        <rect x="2" y="62" width="64" height="26" rx="4" fill="none" stroke="#ef4444" strokeWidth="0.75" opacity="0.6"/>
        <circle cx="12" cy="70" r="4" fill="#ef4444"/>
        <rect x="20" y="66.5" width="38" height="3.5" rx="1.5" fill="#e2e8f0"/>
        <rect x="20" y="72.5" width="28" height="3"   rx="1"   fill="#475569"/>
        <rect x="6"  y="78"  width="54" height="2.5"  rx="1"   fill="#1e3050"/>
        <polygon points="10,62 22,62 16,58" fill="#0b1622"/>
        {/* Count badge top-right */}
        <rect x="128" y="6" width="28" height="14" rx="7" fill="#ef4444" opacity="0.9"/>
        <rect x="131" y="10" width="22" height="4" rx="2" fill="white" opacity="0.9"/>
      </svg>
    </div>
  );
}

export function IlloTrafficFlowTile() {
  const D = useDarkStyle();
  return (
    <div style={{ background: D.bg, borderRadius: 20, overflow: 'hidden', height: '100%' }}>
      <svg width="100%" height="100%" viewBox="0 0 160 110" preserveAspectRatio="xMidYMid slice">
        <rect width="160" height="110" fill={D.bg}/>
        {/* 2×2 tile grid — each tile is a map fragment */}
        {/* Tile borders */}
        <rect x="4"  y="16" width="74" height="44" rx="3" fill={D.card} stroke={D.line} strokeWidth="0.75"/>
        <rect x="82" y="16" width="74" height="44" rx="3" fill={D.card} stroke={D.line} strokeWidth="0.75"/>
        <rect x="4"  y="64" width="74" height="40" rx="3" fill={D.card} stroke={D.line} strokeWidth="0.75"/>
        <rect x="82" y="64" width="74" height="40" rx="3" fill={D.card} stroke={D.line} strokeWidth="0.75"/>

        {/* ── Tile TL: green (free flow) road network ── */}
        <rect x="4"  y="36" width="74" height="7" fill="#162030"/>
        <rect x="46" y="16" width="7"  height="44" fill="#162030"/>
        <rect x="4"  y="38" width="40" height="4" rx="1" fill="#22c55e" opacity="0.9"/>
        <rect x="50" y="38" width="28" height="4" rx="1" fill="#22c55e" opacity="0.9"/>
        <rect x="48" y="16" width="4"  height="18" rx="1" fill="#22c55e" opacity="0.85"/>
        <rect x="48" y="46" width="4"  height="14" rx="1" fill="#4ade80" opacity="0.85"/>

        {/* ── Tile TR: amber/slow ── */}
        <rect x="82" y="36" width="74" height="7" fill="#162030"/>
        <rect x="124" y="16" width="7" height="44" fill="#162030"/>
        <rect x="82"  y="38" width="40" height="4" rx="1" fill="#fbbf24" opacity="0.9"/>
        <rect x="126" y="38" width="30" height="4" rx="1" fill="#fbbf24" opacity="0.9"/>
        <rect x="126" y="16" width="4"  height="18" rx="1" fill="#22c55e" opacity="0.85"/>
        <rect x="126" y="46" width="4"  height="14" rx="1" fill="#fbbf24" opacity="0.85"/>

        {/* ── Tile BL: mixed ── */}
        <rect x="4"  y="80" width="74" height="7" fill="#162030"/>
        <rect x="46" y="64" width="7"  height="40" fill="#162030"/>
        <rect x="4"  y="82" width="20" height="4" rx="1" fill="#22c55e" opacity="0.9"/>
        <rect x="26" y="82" width="24" height="4" rx="1" fill="#fbbf24" opacity="0.9"/>
        <rect x="50" y="82" width="28" height="4" rx="1" fill="#f97316" opacity="0.9"/>
        <rect x="48" y="64" width="4"  height="14" rx="1" fill="#22c55e" opacity="0.85"/>
        <rect x="48" y="80" width="4"  height="24" rx="1" fill="#22c55e" opacity="0.85"/>

        {/* ── Tile BR: red/congested ── */}
        <rect x="82" y="80" width="74" height="7" fill="#162030"/>
        <rect x="124" y="64" width="7" height="40" fill="#162030"/>
        <rect x="82"  y="82" width="40" height="4" rx="1" fill="#ef4444" opacity="0.9"/>
        <rect x="126" y="82" width="30" height="4" rx="1" fill="#f97316" opacity="0.9"/>
        <rect x="126" y="64" width="4"  height="14" rx="1" fill="#fbbf24" opacity="0.85"/>
        <rect x="126" y="80" width="4"  height="24" rx="1" fill="#ef4444" opacity="0.85"/>

        {/* Tile coordinate badge */}
        <rect x="4"  y="4"  width="76" height="10" rx="3" fill="#0b1622" opacity="0.9"/>
        <rect x="7"  y="6.5" width="70" height="4" rx="1" fill="#3d5572"/>

        {/* PNG badge bottom-right */}
        <rect x="112" y="98" width="44" height="10" rx="3" fill="#0b1622" opacity="0.9"/>
        <rect x="115" y="100.5" width="38" height="4" rx="1" fill="#3d5572"/>
      </svg>
    </div>
  );
}

export function IlloTrafficModelID() {
  const D = useDarkStyle();
  return (
    <div style={{ background: D.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: D.text, marginBottom: 6 }}>Traffic Model ID</div>
      <div style={{ background: D.card, borderRadius: 8, padding: '8px 10px', border: `1px solid ${D.line}`, marginBottom: 8 }}>
        <div style={{ fontSize: '0.45rem', color: D.dim, marginBottom: 3 }}>CURRENT MODEL</div>
        <div style={{ fontSize: '0.625rem', fontWeight: 700, color: D.blue, fontFamily: 'monospace' }}>#1680</div>
        <div style={{ fontSize: '0.45rem', color: D.dim, marginTop: 2 }}>Updated: 2024-01-15 09:42 UTC</div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {[['#1678', D.dim], ['#1679', D.dim], ['#1680', D.blue]].map(([id, col], i) => (
          <div key={i} style={{ flex: 1, background: D.card, borderRadius: 4, padding: '3px 4px', textAlign: 'center', border: `1px solid ${col}` }}>
            <div style={{ fontSize: '0.45rem', color: col, fontFamily: 'monospace' }}>{id}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   EV & Charging — dark variants
   ───────────────────────────────────────────────────────────────────────────── */

export function IlloEVSearchNearby() {
  const D = useDarkStyle();
  const stations = [['Belib+', '22 kW', '3/4 avail.', D.green], ['Fastned', '150 kW', '1/2 avail.', D.green], ['Ionity', '350 kW', '0/4 avail.', '#ef4444']];
  return (
    <div style={{ background: D.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: D.text, marginBottom: 2 }}>EV Stations Nearby</div>
      <div style={{ fontSize: '0.45rem', color: D.green, marginBottom: 7 }}>⚡ Radius: 5 km · 3 found</div>
      {stations.map(([name, kw, avail, col], i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0', borderTop: i > 0 ? `1px solid ${D.line}` : 'none' }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: col, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.4rem', flexShrink: 0 }}>⚡</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.5rem', fontWeight: 700, color: D.text }}>{name}</div>
            <div style={{ fontSize: '0.45rem', color: D.dim }}>{kw} · <span style={{ color: col }}>{avail}</span></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function IlloEVChargingAvailability() {
  const D = useDarkStyle();
  const connectors = [['CCS2', '150kW', D.green, 'Available'], ['Type2', '22kW', D.green, 'Available'], ['CHAdeMO', '50kW', D.amber, 'Charging'], ['CCS2', '150kW', '#ef4444', 'Offline']];
  return (
    <div style={{ background: D.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: D.text, marginBottom: 6 }}>Connector Status</div>
      {connectors.map(([type, kw, col, status], i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 0', borderTop: i > 0 ? `1px solid ${D.line}` : 'none' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: col, flexShrink: 0 }}/>
          <span style={{ fontSize: '0.5rem', color: D.text, flex: 1 }}>{type} · {kw}</span>
          <span style={{ fontSize: '0.45rem', color: col }}>{status}</span>
        </div>
      ))}
    </div>
  );
}

function IlloEVMarketCoverage() {
  const D = useDarkStyle();
  const regions = [['NL', 98, D.green], ['DE', 87, D.blue], ['FR', 74, D.blue], ['UK', 61, D.amber], ['ES', 43, '#f97316']];
  return (
    <div style={{ background: D.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: D.text, marginBottom: 6 }}>EV Market Coverage</div>
      {regions.map(([country, pct, col], i) => (
        <div key={i} style={{ marginBottom: 5 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
            <span style={{ fontSize: '0.45rem', color: D.text }}>{country}</span>
            <span style={{ fontSize: '0.45rem', color: col, fontFamily: 'monospace' }}>{pct}%</span>
          </div>
          <div style={{ height: 4, background: D.card, borderRadius: 2 }}>
            <div style={{ height: '100%', width: `${pct}%`, background: col, borderRadius: 2 }}/>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Map Display — dark variants
   ───────────────────────────────────────────────────────────────────────────── */

export function IlloMapRasterTile() {
  const D = useDarkStyle();
  const colors = ['#1a2535','#1e2d40','#243347','#1a2535','#1e2d40','#243347','#1a2535','#1e2d40','#243347'];
  return (
    <div style={{ background: D.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: D.text, marginBottom: 2 }}>Raster Map Tile</div>
      <div style={{ fontSize: '0.45rem', color: D.dim, marginBottom: 6, fontFamily: 'monospace' }}>z=14 / x=8390 / y=5441</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2, marginBottom: 6 }}>
        {colors.map((c, i) => (
          <div key={i} style={{ height: 28, borderRadius: 2, background: c, position: 'relative', overflow: 'hidden' }}>
            {i === 4 && <div style={{ position: 'absolute', inset: 0, background: 'rgba(226,0,26,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.6rem' }}>📍</span>
            </div>}
          </div>
        ))}
      </div>
      <div style={{ fontSize: '0.45rem', color: D.dim }}>PNG · 256×256 · TomTom raster</div>
    </div>
  );
}

export function IlloMapVectorTile() {
  const D = useDarkStyle();
  return (
    <div style={{ background: D.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: D.text, marginBottom: 2 }}>Vector Map Tile</div>
      <div style={{ fontSize: '0.45rem', color: D.dim, marginBottom: 6, fontFamily: 'monospace' }}>.pbf · styleable</div>
      <div style={{ height: 74, background: '#0f1a28', borderRadius: 6, overflow: 'hidden' }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 140 74" fill="none">
          <rect width="140" height="74" fill="#0f1a28"/>
          <path d="M10 37 L50 20 L90 37 L130 20" stroke={D.blue} strokeWidth="1.5" opacity="0.6"/>
          <path d="M0 55 L40 45 L80 55 L140 42" stroke={D.dim} strokeWidth="0.8" opacity="0.4"/>
          <rect x="40" y="25" width="20" height="14" fill="rgba(88,166,255,0.15)" stroke={D.blue} strokeWidth="0.5"/>
          <rect x="75" y="15" width="16" height="12" fill="rgba(88,166,255,0.1)" stroke={D.dim} strokeWidth="0.5"/>
          <circle cx="65" cy="50" r="4" fill={D.red} opacity="0.8"/>
        </svg>
      </div>
      <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
        {['roads','labels','pois'].map((l, i) => (
          <span key={i} style={{ fontSize: '0.4rem', padding: '1px 5px', borderRadius: 4, background: D.card, color: D.blue, border: `1px solid ${D.line}` }}>{l}</span>
        ))}
      </div>
    </div>
  );
}

export function IlloMapSatelliteTile() {
  const D = useDarkStyle();
  return (
    <div style={{ background: D.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: D.text, marginBottom: 2 }}>Satellite Tile</div>
      <div style={{ fontSize: '0.45rem', color: D.dim, marginBottom: 6, fontFamily: 'monospace' }}>Aerial · 256×256</div>
      <div style={{ height: 74, borderRadius: 6, overflow: 'hidden', position: 'relative', background: '#1a2a1a' }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 140 74" fill="none">
          <rect width="140" height="74" fill="#1a2a1a"/>
          <rect x="0" y="0" width="140" height="74" fill="url(#sat-grad)"/>
          <defs><radialGradient id="sat-grad" cx="50%" cy="50%" r="60%"><stop offset="0%" stopColor="#2a3a2a"/><stop offset="100%" stopColor="#1a2a1a"/></radialGradient></defs>
          {[[20,15,40,20],[70,10,25,15],[10,40,30,25],[80,35,40,30],[50,55,35,15]].map(([x,y,w,h],i) => (
            <rect key={i} x={x} y={y} width={w} height={h} fill={`rgba(${[80,100,70,90,60][i]},${[100,80,110,90,80][i]},${[60,70,50,60,55][i]},0.4)`} rx="1"/>
          ))}
          <rect x="20" y="30" width="8" height="30" fill="rgba(200,200,200,0.3)" rx="1"/>
          <rect x="60" y="20" width="60" height="4" fill="rgba(200,200,200,0.2)" rx="1"/>
        </svg>
      </div>
    </div>
  );
}

function IlloMapAssetsAPI() {
  const D = useDarkStyle();
  const assets = [['sprite_day.png', '2.4 MB', '🖼️'], ['sprite_night.png', '2.4 MB', '🌙'], ['font_roboto.pbf', '1.1 MB', '🔤'], ['style.json', '48 KB', '{}']];
  return (
    <div style={{ background: D.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: D.text, marginBottom: 6 }}>Map Assets API</div>
      {assets.map(([name, size, icon], i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 0', borderTop: i > 0 ? `1px solid ${D.line}` : 'none' }}>
          <span style={{ fontSize: '0.65rem' }}>{icon}</span>
          <span style={{ fontSize: '0.45rem', color: D.text, flex: 1 }}>{name}</span>
          <span style={{ fontSize: '0.4rem', color: D.dim, fontFamily: 'monospace' }}>{size}</span>
        </div>
      ))}
    </div>
  );
}

export function IlloMapStaticImage() {
  const D = useDarkStyle();
  return (
    <div style={{ background: D.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: D.text, marginBottom: 2 }}>Static Map Image</div>
      <div style={{ fontSize: '0.45rem', color: D.dim, marginBottom: 6, fontFamily: 'monospace' }}>600×400 · zoom=14</div>
      <div style={{ height: 74, background: '#0f1a28', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 140 74" fill="none">
          <rect width="140" height="74" fill="#0f1a28"/>
          <path d="M10 37 Q40 25 70 37 Q100 49 130 37" stroke={D.dim} strokeWidth="8" opacity="0.3"/>
          <path d="M0 50 Q35 38 70 50 Q105 62 140 50" stroke={D.dim} strokeWidth="5" opacity="0.2"/>
          <circle cx="70" cy="37" r="7" fill={D.red}/>
          <circle cx="70" cy="37" r="14" fill="rgba(226,0,26,0.15)"/>
          <rect x="4" y="4" width="132" height="66" rx="3" stroke={D.dim} strokeWidth="0.5" strokeDasharray="3 2"/>
        </svg>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Parking & Fuel — dark variants
   ───────────────────────────────────────────────────────────────────────────── */

export function IlloParkingAvailability() {
  const D = useDarkStyle();
  const zones = [['Zone A', '12/15', 80, D.green], ['Zone B', '3/10', 30, '#ef4444'], ['Zone C', '8/12', 67, D.amber], ['Zone D', '0/8', 0, '#ef4444']];
  return (
    <div style={{ background: D.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: D.text, marginBottom: 6 }}>Parking Availability</div>
      {zones.map(([zone, spaces, pct, col], i) => (
        <div key={i} style={{ marginBottom: 5 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
            <span style={{ fontSize: '0.45rem', color: D.text }}>{zone}</span>
            <span style={{ fontSize: '0.45rem', color: col, fontFamily: 'monospace' }}>{spaces}</span>
          </div>
          <div style={{ height: 4, background: D.card, borderRadius: 2 }}>
            <div style={{ height: '100%', width: `${pct}%`, background: col, borderRadius: 2 }}/>
          </div>
        </div>
      ))}
    </div>
  );
}

export function IlloParkingPrices() {
  const D = useDarkStyle();
  const tiers = [['0–1 hr', '€2.50'], ['1–3 hr', '€4.00'], ['3–8 hr', '€7.50'], ['All day', '€12.00']];
  return (
    <div style={{ background: D.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: D.text, marginBottom: 2 }}>Parking Prices</div>
      <div style={{ fontSize: '0.45rem', color: D.dim, marginBottom: 7 }}>Hullenbergweg Garage</div>
      {tiers.map(([dur, price], i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px', background: i === 0 ? 'rgba(88,166,255,0.1)' : 'none', borderRadius: 4, marginBottom: 2 }}>
          <span style={{ fontSize: '0.5rem', color: D.text }}>{dur}</span>
          <span style={{ fontSize: '0.5rem', fontWeight: 700, color: i === 0 ? D.blue : D.dim }}>{price}</span>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 5, marginTop: 5 }}>
        {['💳','📱','💶'].map((m, i) => (
          <span key={i} style={{ fontSize: '0.6rem', padding: '2px 6px', borderRadius: 4, background: D.card, border: `1px solid ${D.line}` }}>{m}</span>
        ))}
      </div>
    </div>
  );
}

export function IlloOnStreetParking() {
  const D = useDarkStyle();
  const zones = [[D.green,'A','Free'],[D.amber,'B','Limited'],['#ef4444','C','No park.'],[ D.green,'D','Free']];
  return (
    <div style={{ background: D.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: D.text, marginBottom: 6 }}>On-Street Parking</div>
      <div style={{ height: 50, background: '#0f1a28', borderRadius: 6, marginBottom: 6, overflow: 'hidden' }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 140 50" fill="none">
          <rect width="140" height="50" fill="#0f1a28"/>
          <rect x="0" y="20" width="140" height="10" fill="#1e2d40"/>
          {zones.map(([col,,], i) => <rect key={i} x={8+i*34} y="15" width="26" height="8" rx="2" fill={col} opacity="0.75"/>)}
          {zones.map(([col,,], i) => <rect key={i} x={8+i*34} y="27" width="26" height="8" rx="2" fill={col} opacity="0.45"/>)}
        </svg>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {zones.map(([col, zone, label], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <div style={{ width: 6, height: 6, borderRadius: 1, background: col }}/>
            <span style={{ fontSize: '0.4rem', color: D.dim }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function IlloFuelPrices() {
  const D = useDarkStyle();
  const fuels = [['⛽ Unleaded 95', '€1.84', D.blue], ['🟡 Diesel', '€1.72', D.amber], ['🟢 LPG', '€0.96', D.green], ['⚡ Fast DC', '€0.58/kWh', D.purple]];
  return (
    <div style={{ background: D.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: D.text, marginBottom: 2 }}>Fuel Prices</div>
      <div style={{ fontSize: '0.45rem', color: D.dim, marginBottom: 7 }}>TotalEnergies · 0.4 km</div>
      {fuels.map(([label, price, col], i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderTop: i > 0 ? `1px solid ${D.line}` : 'none' }}>
          <span style={{ fontSize: '0.5rem', color: D.dim }}>{label}</span>
          <span style={{ fontSize: '0.5rem', fontWeight: 700, color: col }}>{price}</span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Snap to Roads / Batch Search — dark variants
   ───────────────────────────────────────────────────────────────────────────── */

export function IlloSnapToRoads() {
  const D = useDarkStyle();
  return (
    <div style={{ background: D.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: D.text, marginBottom: 2 }}>Snap to Roads</div>
      <div style={{ height: 80, background: '#0f1a28', borderRadius: 8, overflow: 'hidden', marginBottom: 6 }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 160 80" fill="none">
          <path d="M20 60 Q60 55 100 45 Q130 38 145 25" stroke={D.dim} strokeWidth="4" strokeLinecap="round" opacity="0.4"/>
          {[[28,62],[55,55],[85,48],[110,42],[138,28]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r="3.5" fill={D.blue} opacity="0.9"/>)}
          {[[25,65],[58,52],[82,50],[112,40],[141,26]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r="3" fill={D.dim} strokeDasharray="1 1" opacity="0.5"/>)}
          {[[28,62],[25,65],[55,55],[58,52],[85,48],[82,50],[110,42],[112,40],[138,28],[141,26]].map(([x1,y1,x2,y2],i) => i%2===1 && null)}
          <path d="M25 65 L28 62 M58 52 L55 55 M82 50 L85 48 M112 40 L110 42 M141 26 L138 28" stroke={D.green} strokeWidth="1" strokeDasharray="2 1" opacity="0.7"/>
        </svg>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}><div style={{ width: 8, height: 3, background: D.blue, borderRadius: 1 }}/><span style={{ fontSize: '0.4rem', color: D.dim }}>Snapped</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}><div style={{ width: 8, height: 3, background: D.dim, borderRadius: 1, opacity: 0.5 }}/><span style={{ fontSize: '0.4rem', color: D.dim }}>Raw GPS</span></div>
      </div>
    </div>
  );
}

function IlloBatchSearch() {
  const D = useDarkStyle();
  const queries = [['🔍 Hotels near AMS', '42 results', D.green], ['🔍 EV stations · 5km', '18 results', D.green], ['🔍 Restaurants open', '0 results', '#ef4444'], ['🔍 Parking garages', '11 results', D.green]];
  return (
    <div style={{ background: D.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: D.text, marginBottom: 2 }}>Batch Search</div>
      <div style={{ fontSize: '0.45rem', color: D.dim, marginBottom: 6 }}>4 queries · single request</div>
      {queries.map(([q, r, col], i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderTop: i > 0 ? `1px solid ${D.line}` : 'none' }}>
          <span style={{ fontSize: '0.45rem', color: D.dim }}>{q}</span>
          <span style={{ fontSize: '0.45rem', color: col, fontFamily: 'monospace' }}>{r}</span>
        </div>
      ))}
      <div style={{ marginTop: 4, fontSize: '0.45rem', color: D.green }}>⚡ 240ms total · parallel</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   POI Details / Photos — dark variants
   ───────────────────────────────────────────────────────────────────────────── */

export function IlloPOIDetails() {
  const D = useDarkStyle();
  return (
    <div style={{ background: D.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
        <div style={{ width: 30, height: 30, borderRadius: 6, background: D.card, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>🏨</div>
        <div>
          <div style={{ fontSize: '0.5rem', fontWeight: 700, color: D.text }}>Hotel Amsterdam</div>
          <div style={{ fontSize: '0.45rem', color: D.amber }}>★★★★ · 4.6 (892 reviews)</div>
          <div style={{ fontSize: '0.45rem', color: D.dim }}>Damrak 1, Amsterdam</div>
        </div>
      </div>
      {[['📞 Phone', '+31 20 555 0100'], ['🌐 Website', 'hotel-amsterdam.nl'], ['🕐 Hours', 'Open 24/7'], ['♿ Access', 'Wheelchair OK']].map(([icon, val], i) => (
        <div key={i} style={{ display: 'flex', gap: 6, padding: '2px 0', borderTop: i > 0 ? `1px solid ${D.line}` : 'none' }}>
          <span style={{ fontSize: '0.5rem', width: 60, color: D.dim }}>{icon}</span>
          <span style={{ fontSize: '0.45rem', color: D.text }}>{val}</span>
        </div>
      ))}
    </div>
  );
}

export function IlloPOIPhotos() {
  const D = useDarkStyle();
  const colors = ['#1e3a2a','#1a2535','#2a2020','#1a2535','#1e3a2a','#2a2020'];
  const emojis = ['🏨','🍽️','🛎️','🌳','🏊','🏋️'];
  return (
    <div style={{ background: D.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: D.text, marginBottom: 2 }}>POI Photos</div>
      <div style={{ fontSize: '0.45rem', color: D.dim, marginBottom: 6 }}>6 images · Hotel Amsterdam</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 3 }}>
        {colors.map((c, i) => (
          <div key={i} style={{ height: 34, borderRadius: 4, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem' }}>
            {emojis[i]}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Traffic Analytics — dark variants
   ───────────────────────────────────────────────────────────────────────────── */

export function IlloTrafficStats() {
  const D = useDarkStyle();
  const bars = [30, 45, 60, 75, 55, 40, 80, 65, 50, 35, 70, 85];
  return (
    <div style={{ background: D.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: D.text, marginBottom: 2 }}>Traffic Statistics</div>
      <div style={{ fontSize: '0.45rem', color: D.dim, marginBottom: 8 }}>Avg speed · Mon–Sun · 07:00–20:00</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 50 }}>
        {bars.map((h, i) => (
          <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '2px 2px 0 0', background: h > 60 ? D.blue : h > 40 ? D.amber : '#ef4444', opacity: 0.8 }}/>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
        {['M','T','W','T','F','S','S'].map((d, i) => (
          <span key={i} style={{ fontSize: '0.4rem', color: D.dim, flex: 1, textAlign: 'center' }}>{d}</span>
        ))}
      </div>
    </div>
  );
}

export function IlloAreaAnalytics() {
  const D = useDarkStyle();
  const cells = [0.2,0.6,0.9,0.4,0.7,0.8,0.3,0.5,0.7,0.6,0.4,0.9,0.2,0.5,0.8,0.3];
  return (
    <div style={{ background: D.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: D.text, marginBottom: 2 }}>Area Analytics</div>
      <div style={{ fontSize: '0.45rem', color: D.dim, marginBottom: 6 }}>Traffic density heatmap</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2 }}>
        {cells.map((v, i) => (
          <div key={i} style={{ height: 20, borderRadius: 2, background: `rgba(226,0,26,${v * 0.8 + 0.1})` }}/>
        ))}
      </div>
      <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
        <div style={{ flex: 1, height: 4, background: 'linear-gradient(90deg,rgba(226,0,26,0.1),rgba(226,0,26,0.9))', borderRadius: 2 }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: 50 }}>
          <span style={{ fontSize: '0.4rem', color: D.dim }}>Low</span>
          <span style={{ fontSize: '0.4rem', color: D.dim }}>High</span>
        </div>
      </div>
    </div>
  );
}

export function IlloODAnalysis() {
  const D = useDarkStyle();
  const SIZE = 4;
  const labels = ['A','B','C','D'];
  const matrix = [[0,0.3,0.7,0.2],[0.4,0,0.5,0.8],[0.6,0.2,0,0.3],[0.1,0.7,0.4,0]];
  return (
    <div style={{ background: D.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: D.text, marginBottom: 6 }}>O/D Analysis</div>
      <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', marginBottom: 2 }}>
        <div style={{ width: 12 }}/>
        {labels.map((l, i) => <div key={i} style={{ flex: 1, fontSize: '0.4rem', color: D.dim, textAlign: 'center' }}>{l}</div>)}
      </div>
      {matrix.map((row, ri) => (
        <div key={ri} style={{ display: 'flex', gap: 2, alignItems: 'center', marginBottom: 2 }}>
          <div style={{ width: 12, fontSize: '0.4rem', color: D.dim }}>{labels[ri]}</div>
          {row.map((v, ci) => (
            <div key={ci} style={{ flex: 1, height: 16, borderRadius: 2, background: ri === ci ? D.card : `rgba(88,166,255,${v * 0.8 + 0.1})` }}/>
          ))}
        </div>
      ))}
    </div>
  );
}

export function IlloJunctionAnalytics() {
  const D = useDarkStyle();
  return (
    <div style={{ background: D.bg, borderRadius: 20, overflow: 'hidden', height: '100%', padding: 10 }}>
      <div style={{ fontSize: '0.5rem', fontWeight: 700, color: D.text, marginBottom: 6 }}>Junction Analytics</div>
      <div style={{ height: 70, background: '#0f1a28', borderRadius: 6, overflow: 'hidden' }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 140 70" fill="none">
          <line x1="70" y1="0" x2="70" y2="70" stroke={D.dim} strokeWidth="8" opacity="0.3"/>
          <line x1="0" y1="35" x2="140" y2="35" stroke={D.dim} strokeWidth="8" opacity="0.3"/>
          <circle cx="70" cy="35" r="10" fill="rgba(88,166,255,0.15)" stroke={D.blue} strokeWidth="1"/>
          {[  [70,5,70,25],[70,45,70,65],[5,35,50,35],[90,35,135,35]  ].map(([x1,y1,x2,y2],i) => (
            <path key={i} d={`M${x1} ${y1} L${x2} ${y2}`} stroke={D.blue} strokeWidth="1.5" strokeLinecap="round"
              markerEnd="url(#arr)" opacity="0.75"/>
          ))}
          <defs><marker id="arr" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto"><polygon points="0 0,4 2,0 4" fill={D.blue}/></marker></defs>
          {[[70,5,'↑ 340'],[70,65,'↓ 280'],[5,28,'← 190'],[95,28,'→ 420']].map(([x,y,label],i) => (
            <text key={i} x={x} y={y} textAnchor="middle" fill={D.blue} style={{fontSize:7}}>{label}</text>
          ))}
        </svg>
      </div>
      <div style={{ marginTop: 5, fontSize: '0.45rem', color: D.dim }}>vehicles/hr · 15-min intervals</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Gallery components
   ───────────────────────────────────────────────────────────────────────────── */

/* ─── SVG copy helper ────────────────────────────────────────────────────────
   Serialises the rendered card div into an SVG <foreignObject> wrapper so the
   design team can paste a self-contained SVG into Figma / Illustrator.
   The asset name is embedded as the SVG <title> for identification.
   ─────────────────────────────────────────────────────────────────────────── */
function copyCardAsSvg(cardEl, label) {
  if (!cardEl) return Promise.reject(new Error('No element'));
  const { width, height } = cardEl.getBoundingClientRect();
  const clone = cardEl.cloneNode(true);

  // Inline all computed styles so they survive outside the app context
  const allEls = [clone, ...clone.querySelectorAll('*')];
  const srcEls  = [cardEl, ...cardEl.querySelectorAll('*')];
  srcEls.forEach((srcEl, i) => {
    const computed = window.getComputedStyle(srcEl);
    // Copy a focused set of CSS properties that matter for visual fidelity
    const props = [
      'color','background-color','border-color','border-width','border-style','border-radius',
      'font-size','font-weight','font-family','line-height','text-align',
      'display','flex-direction','align-items','justify-content','gap','flex','flex-shrink','flex-wrap',
      'padding','padding-top','padding-right','padding-bottom','padding-left',
      'margin','margin-top','margin-right','margin-bottom','margin-left',
      'width','height','min-height','max-height','min-width','max-width',
      'position','top','right','bottom','left','overflow','z-index',
      'opacity','transform','white-space','text-overflow',
    ];
    props.forEach(p => {
      try { allEls[i].style[p] = computed.getPropertyValue(p); } catch (_) {}
    });
  });

  const ns  = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('xmlns', ns);
  svg.setAttribute('xmlns:xhtml', 'http://www.w3.org/1999/xhtml');
  svg.setAttribute('width',  String(Math.round(width)));
  svg.setAttribute('height', String(Math.round(height)));
  svg.setAttribute('viewBox', `0 0 ${Math.round(width)} ${Math.round(height)}`);

  const title = document.createElementNS(ns, 'title');
  title.textContent = label || 'Illustration';
  svg.appendChild(title);

  const fo = document.createElementNS(ns, 'foreignObject');
  fo.setAttribute('width',  '100%');
  fo.setAttribute('height', '100%');
  fo.setAttribute('x', '0');
  fo.setAttribute('y', '0');

  // foreignObject needs an XHTML namespace on the root element
  clone.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
  fo.appendChild(clone);
  svg.appendChild(fo);

  const serializer = new XMLSerializer();
  const svgString  = serializer.serializeToString(svg);
  return navigator.clipboard.writeText(svgString);
}

/* Tiny context so IlloCard can read showRegenerate without prop-drilling 100+ calls */
const RegenerateCtx = React.createContext(false);

function relTime(ts) {
  const secs = Math.floor((Date.now() - ts) / 1000);
  if (secs < 15)  return 'just now';
  if (secs < 60)  return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function IlloCard({ dark: Dark, light: Light, icon: Icon, label, emoji, source, prompt, illoStyle = 'lofi' }) {
  const { palette } = useIlloStyle();
  const showRegenerate = React.useContext(RegenerateCtx);
  const Illo = illoStyle === 'icon' && Icon ? Icon
             : illoStyle === 'detailed' && Dark ? Dark
             : Light;
  const cardRef = useRef(null);

  /* Derive component name once — used for display and localStorage key */
  const componentName = illoStyle === 'icon'     ? Icon?.name
                      : illoStyle === 'detailed' ? Dark?.name
                      : Light?.name;

  const [copied, setCopied]         = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshed, setRefreshed]   = useState(false);
  const [refreshErr, setRefreshErr] = useState(null);

  /* Persist last-updated timestamp per component in localStorage */
  const [lastUpdated, setLastUpdated] = useState(() => {
    const stored = componentName && localStorage.getItem(`illo-ts-${componentName}`);
    return stored ? parseInt(stored, 10) : null;
  });
  const [, tickRelTime] = useState(0);
  useEffect(() => {
    if (!lastUpdated) return;
    const t = setInterval(() => tickRelTime(n => n + 1), 30_000);
    return () => clearInterval(t);
  }, [lastUpdated]);

  const handleCopy = useCallback(() => {
    copyCardAsSvg(cardRef.current, label)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      })
      .catch(() => {/* clipboard denied — silent fail */});
  }, [label]);

  const handleRefresh = useCallback(async (e) => {
    e.stopPropagation();
    if (refreshing) return;

    /* Resolve style key — componentName already derived above */
    const style = illoStyle === 'icon' ? 'icon'
                : illoStyle === 'detailed' ? 'detailed'
                : 'lofi';
    if (!componentName) return;

    setRefreshing(true);
    setRefreshErr(null);
    setRefreshed(false);

    try {
      /* 1 — Queue the request */
      const res = await fetch('/api/refresh-illo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ componentName, style, promptDesc: prompt, label }),
      });
      const data = await res.json();
      if (!data.queued) throw new Error(data.error ?? 'Queue failed');
      const id = data.queued;

      /* 2 — Poll for completion (every 2 s, up to 120 s) */
      const deadline = Date.now() + 120_000;
      await new Promise((resolve, reject) => {
        const tick = async () => {
          if (Date.now() > deadline) { reject(new Error('Timed out — agent took too long')); return; }
          try {
            const r = await fetch(`/api/refresh-status/${id}`);
            const d = await r.json();
            if (d.done)  { resolve(); return; }
            if (d.error) { reject(new Error(d.error)); return; }
            /* still pending */
            setTimeout(tick, 2000);
          } catch (pollErr) {
            reject(pollErr);
          }
        };
        setTimeout(tick, 2000);
      });

      setRefreshed(true);
      const ts = Date.now();
      setLastUpdated(ts);
      if (componentName) localStorage.setItem(`illo-ts-${componentName}`, String(ts));
      setTimeout(() => setRefreshed(false), 3000);
    } catch (err) {
      setRefreshErr(err.message);
      setTimeout(() => setRefreshErr(null), 6000);
    } finally {
      setRefreshing(false);
    }
  }, [illoStyle, Icon, Dark, Light, prompt, label, refreshing, componentName]);

  /* Refresh button label + colours */
  const btnLabel  = refreshing ? 'Generating…' : refreshed ? '✓ Updated' : refreshErr ? '✗ Error' : 'Regenerate';
  const btnBg     = refreshing ? 'rgba(255,255,255,0.18)'
                  : refreshed  ? 'rgba(34,197,94,0.35)'
                  : refreshErr ? 'rgba(239,68,68,0.35)'
                  : 'rgba(255,255,255,0.10)';

  return (
    <div className="illo-card-wrap">
      {/* ── Card ── */}
      <div
        ref={cardRef}
        onClick={handleCopy}
        title={`Click to copy "${label}" as SVG`}
        style={{
          border: `1px solid ${copied ? '#22c55e' : 'var(--border)'}`,
          borderRadius: 20,
          overflow: 'hidden',
          background: palette.bg,
          position: 'relative',
          height: 180,
          cursor: 'pointer',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          boxShadow: copied ? '0 0 0 3px rgba(34,197,94,0.2)' : 'none',
        }}
        onMouseEnter={e => { if (!copied) e.currentTarget.style.borderColor = 'var(--black)'; }}
        onMouseLeave={e => { if (!copied) e.currentTarget.style.borderColor = 'var(--border)'; }}
      >
        {/* Copied toast — top-right */}
        {copied && (
          <div style={{
            position: 'absolute', top: 8, right: 8, zIndex: 10,
            background: '#22c55e', color: '#fff',
            fontSize: '0.625rem', fontWeight: 700,
            padding: '3px 8px', borderRadius: 20,
            pointerEvents: 'none',
          }}>
            ✓ Copied SVG
          </div>
        )}

        {/* Copy hint pill — top-right on hover */}
        <div
          className="illo-card-copy-hint"
          style={{
            position: 'absolute', top: 8, right: 8, zIndex: 9,
            background: 'rgba(0,0,0,0.52)', color: '#fff',
            fontSize: '0.5625rem', fontWeight: 600,
            padding: '2px 7px', borderRadius: 20,
            pointerEvents: 'none', opacity: 0,
            transition: 'opacity 0.15s',
          }}
        >
          ⎘ Copy SVG
        </div>

        {/* Full-bleed illustration */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <Illo />
        </div>

        {/* Frosted glass text overlay */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          background: 'rgba(0, 0, 0, 0.44)',
          padding: '7px 12px 10px',
          borderTop: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: source ? 2 : 0 }}>
            {emoji && <span style={{ fontSize: '0.875rem', lineHeight: 1 }}>{emoji}</span>}
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>{label}</span>
          </div>
          {source && (
            <span style={{
              fontSize: '0.5625rem', color: 'rgba(255,255,255,0.5)',
              fontFamily: 'var(--font-mono, monospace)',
            }}>
              {source}
            </span>
          )}
        </div>
      </div>

      {/* ── Action bar — only shown when Regenerate mode is enabled ── */}
      {showRegenerate && (
        <div
          className="illo-card-actions"
          style={refreshing ? { opacity: 1, transform: 'translateY(0)', pointerEvents: 'auto' } : undefined}
        >
          <button
            className="illo-card-refresh"
            onClick={handleRefresh}
            disabled={refreshing}
            title={refreshErr ?? `Regenerate "${label}" with AI`}
            style={{ '--refresh-bg': btnBg }}
          >
            <span className={refreshing ? 'illo-refresh-spin' : ''} aria-hidden="true">↻</span>
            <span>{btnLabel}</span>
          </button>
          {refreshing && componentName && (
            <span className="illo-card-gen-name">{componentName}</span>
          )}
          {refreshErr && (
            <span className="illo-card-refresh-err" title={refreshErr}>
              {refreshErr.length > 48 ? refreshErr.slice(0, 48) + '…' : refreshErr}
            </span>
          )}
          {lastUpdated && !refreshing && !refreshErr && (
            <span className="illo-card-ts">Updated {relTime(lastUpdated)}</span>
          )}
        </div>
      )}
    </div>
  );
}

function SectionHeader({ emoji, title, subtitle, color = '#e2001a' }) {
  return (
    <div style={{ marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <span style={{ fontSize: '1.25rem' }}>{emoji}</span>
        <h2 className="sh" style={{ margin: 0, color }}>{title}</h2>
      </div>
      {subtitle && <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--mid)', lineHeight: 1.5 }}>{subtitle}</p>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────────────────────────── */

export const THEME_OPTIONS = [
  {
    id: 'day',
    icon: '☀️',
    label: 'Day',
    desc: 'Light sky · deep navy · TomTom red',
    activeBg: '#EAF4FF',
    activeColor: '#1B3D6E',
    activeBorder: '#5B8AC5',
    swatch: ['#EAF4FF','#1B3D6E','#e2001a'],
  },
  {
    id: 'night',
    icon: '🌙',
    label: 'Night',
    desc: 'Deep navy · pale blue · TomTom red',
    activeBg: '#0D1B35',
    activeColor: '#C8DEFF',
    activeBorder: '#7BA8D4',
    swatch: ['#0D1B35','#C8DEFF','#e2001a'],
  },
  {
    id: 'blueprintLight',
    icon: '📋',
    label: 'Blueprint',
    desc: 'Drafting paper · deep navy · blue',
    activeBg: '#F0F7FF',
    activeColor: '#0B2D5C',
    activeBorder: '#2878CC',
    swatch: ['#F0F7FF','#0B2D5C','#2878CC'],
  },
  {
    id: 'blueprintDark',
    icon: '🔵',
    label: 'Blueprint Dark',
    desc: 'Deepest navy · pale blue · bright blue',
    activeBg: '#071420',
    activeColor: '#C2DFFF',
    activeBorder: '#4B9EE8',
    swatch: ['#071420','#C2DFFF','#4B9EE8'],
  },
  {
    id: 'blueprintMid',
    icon: '🌤️',
    label: 'Blueprint Light',
    desc: 'Light panel blue · deep navy shapes · blue accent',
    activeBg: '#EAF4FF',
    activeColor: '#1B3D6E',
    activeBorder: '#5B8AC5',
    swatch: ['#EAF4FF','#C8DCF5','#1B5FAD'],
  },
];

/* ─── Functional colour-scale families (light + dark per family) ─────────────
   Derived from the Functional colour chart: indigo / bolt / shamrock /
   cadmium / bright / red. Each entry supplies both variant IDs so the
   ThemeBar can render a paired L·D toggle per family.
   ─────────────────────────────────────────────────────────────────────────── */
export const COLOUR_FAMILIES = [
  {
    id: 'indigo',   label: 'Indigo',
    accent: '#00487F',   textOnAccent: '#fff',
    lightId: 'indigoLight',   darkId: 'indigoDark',
    lightBg: '#F5F8FA',       darkBg: '#001924',
  },
  {
    id: 'bolt',     label: 'Bolt',
    accent: '#00AAFF',   textOnAccent: '#fff',
    lightId: 'boltLight',     darkId: 'boltDark',
    lightBg: '#F5FBFF',       darkBg: '#001C28',
  },
  {
    id: 'shamrock', label: 'Shamrock',
    accent: '#00A65E',   textOnAccent: '#fff',
    lightId: 'shamrockLight', darkId: 'shamrockDark',
    lightBg: '#F5FBF8',       darkBg: '#000F09',
  },
  {
    id: 'cadmium',  label: 'Cadmium',
    accent: '#C79102',   textOnAccent: '#fff',
    lightId: 'cadmiumLight',  darkId: 'cadmiumDark',
    lightBg: '#FFF5DD',       darkBg: '#322400',
  },
  {
    id: 'bright',   label: 'Bright',
    accent: '#FF5D00',   textOnAccent: '#fff',
    lightId: 'brightLight',   darkId: 'brightDark',
    lightBg: '#FFE7D9',       darkBg: '#321300',
  },
  {
    id: 'red',      label: 'Red',
    accent: '#DF1B12',   textOnAccent: '#fff',
    lightId: 'redLight',      darkId: 'redDark',
    lightBg: '#FFF0EF',       darkBg: '#380300',
  },
];

const STYLE_OPTIONS = [
  { id: 'lofi',     icon: '◻',  label: 'Lo-Fi Wireframe',     desc: 'Geometric SVG shapes · full palette system' },
  { id: 'detailed', icon: '▦',  label: 'Detailed Wireframe',  desc: 'Rich HTML mockups · themed UI chrome' },
  { id: 'icon',     icon: '◆',  label: 'Icon Style',          desc: 'Bold symbols · dark field · palette accent' },
];

export function ThemeBar({ theme, onThemeChange, illoStyle, onStyleChange, onPluginClick, compact = false, showRegenerate = false, onToggleRegenerate }) {
  const activeTheme = THEME_OPTIONS.find(o => o.id === theme) || THEME_OPTIONS[0];
  const activeStyle = STYLE_OPTIONS.find(o => o.id === illoStyle) || STYLE_OPTIONS[0];
  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--bg)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--border)',
    }}>

      {/* ── Row 1: Style selector — hidden when compact ── */}
      {!compact && <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 24px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
      }}>
        <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--mid)', flexShrink: 0, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Style</span>
        <div style={{ display: 'flex', gap: 6 }}>
          {STYLE_OPTIONS.map(o => {
            const isActive = illoStyle === o.id;
            return (
              <button
                key={o.id}
                onClick={() => onStyleChange(o.id)}
                title={o.desc}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '5px 14px', borderRadius: 100,
                  border: isActive ? '2px solid var(--black)' : '1.5px solid var(--border)',
                  background: isActive ? 'var(--black)' : 'transparent',
                  color: isActive ? 'var(--bg)' : 'var(--mid)',
                  cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600,
                  transition: 'all 0.15s', whiteSpace: 'nowrap',
                }}
              >
                <span style={{ fontSize: '0.875rem', lineHeight: 1 }}>{o.icon}</span>
                {o.label}
              </button>
            );
          })}
        </div>
        <span style={{ fontSize: '0.6875rem', color: 'var(--mid)', marginLeft: 4 }}>{activeStyle.desc}</span>

        {/* Right-aligned controls */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>

          {/* AI Regenerate toggle — WIP, hidden from stakeholders by default */}
          {onToggleRegenerate && (
            <button
              onClick={onToggleRegenerate}
              title={showRegenerate ? 'Hide AI Regenerate buttons' : 'Show AI Regenerate buttons (WIP)'}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 100,
                border: showRegenerate ? '1.5px solid var(--black)' : '1px solid var(--border)',
                background: showRegenerate ? 'var(--black)' : 'transparent',
                cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600,
                color: showRegenerate ? 'var(--bg)' : 'var(--mid)',
                whiteSpace: 'nowrap', transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: '0.875rem', lineHeight: 1 }}>↻</span>
              Regenerate
            </button>
          )}

          {/* Figma plugin */}
          <button
            onClick={onPluginClick}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 100,
              border: '1px solid var(--border)', background: 'transparent',
              cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600,
              color: 'var(--mid)', whiteSpace: 'nowrap', flexShrink: 0,
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#2878CC'; e.currentTarget.style.color = 'var(--black)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--mid)'; }}
          >
            <svg width="11" height="11" viewBox="0 0 38 57" fill="none" style={{ flexShrink: 0 }}>
              <path d="M19 28.5C19 25.98 20 23.56 21.78 21.78C23.56 20 25.98 19 28.5 19C31.02 19 33.44 20 35.22 21.78C37 23.56 38 25.98 38 28.5C38 31.02 37 33.44 35.22 35.22C33.44 37 31.02 38 28.5 38H19V28.5Z" fill="#1ABCFE"/>
              <path d="M0 47.5C0 44.98 1 42.56 2.78 40.78C4.56 39 6.98 38 9.5 38H19V47.5C19 50.02 18 52.44 16.22 54.22C14.44 56 12.02 57 9.5 57C6.98 57 4.56 56 2.78 54.22C1 52.44 0 50.02 0 47.5Z" fill="#0ACF83"/>
              <path d="M19 0V19H28.5C31.02 19 33.44 18 35.22 16.22C37 14.44 38 12.02 38 9.5C38 6.98 37 4.56 35.22 2.78C33.44 1 31.02 0 28.5 0H19Z" fill="#FF7262"/>
              <path d="M0 9.5C0 12.02 1 14.44 2.78 16.22C4.56 18 6.98 19 9.5 19H19V0H9.5C6.98 0 4.56 1 2.78 2.78C1 4.56 0 6.98 0 9.5Z" fill="#F24E1E"/>
              <path d="M0 28.5C0 31.02 1 33.44 2.78 35.22C4.56 37 6.98 38 9.5 38H19V19H9.5C6.98 19 4.56 20 2.78 21.78C1 23.56 0 25.98 0 28.5Z" fill="#A259FF"/>
            </svg>
            Figma Plugin
          </button>
        </div>
      </div>}

      {/* ── Row 2: Palette picker — system themes ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 24px',
        borderBottom: '1px solid var(--border)',
        flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--mid)', flexShrink: 0, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Palette</span>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          {THEME_OPTIONS.map(o => {
            const isActive = theme === o.id;
            return (
              <button
                key={o.id}
                onClick={() => onThemeChange(o.id)}
                title={o.desc}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '5px 12px', borderRadius: 100,
                  border: isActive ? `2px solid ${o.activeBorder}` : '1.5px solid var(--border)',
                  background: isActive ? o.activeBg : 'transparent',
                  color: isActive ? o.activeColor : 'var(--mid)',
                  cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600,
                  transition: 'all 0.15s', whiteSpace: 'nowrap',
                  boxShadow: isActive ? `0 0 0 3px ${o.activeBorder}22` : 'none',
                }}
              >
                <span style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                  {o.swatch.map((c, i) => (
                    <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: c, border: '1px solid rgba(0,0,0,0.1)', flexShrink: 0 }}/>
                  ))}
                </span>
                {o.icon} {o.label}
              </button>
            );
          })}
        </div>
        <span style={{ fontSize: '0.6875rem', color: 'var(--mid)', marginLeft: 4 }}>{activeTheme.desc}</span>
      </div>

      {/* ── Row 3: Functional colour-family L·D toggles ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 24px',
        flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--mid)', flexShrink: 0, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Colour</span>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          {COLOUR_FAMILIES.map(fam => {
            const lightActive = theme === fam.lightId;
            const darkActive  = theme === fam.darkId;
            const anyActive   = lightActive || darkActive;
            const borderCol   = anyActive ? `${fam.accent}88` : 'var(--border)';
            return (
              <div
                key={fam.id}
                style={{
                  display: 'flex', alignItems: 'center',
                  border: `${anyActive ? 2 : 1.5}px solid ${borderCol}`,
                  borderRadius: 100, overflow: 'hidden',
                  background: anyActive ? `${fam.accent}15` : 'transparent',
                  transition: 'border-color 0.15s, background 0.15s',
                }}
              >
                {/* dot + label — non-interactive, just visual */}
                <span style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '4px 7px 4px 10px', userSelect: 'none', pointerEvents: 'none',
                }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: fam.accent, flexShrink: 0,
                    boxShadow: '0 0 0 1.5px rgba(0,0,0,0.12)',
                  }}/>
                  <span style={{
                    fontSize: '0.75rem', fontWeight: 600,
                    color: anyActive ? fam.accent : 'var(--mid)',
                    transition: 'color 0.15s',
                  }}>{fam.label}</span>
                </span>
                {/* Light variant */}
                <button
                  onClick={() => onThemeChange(lightActive ? 'day' : fam.lightId)}
                  title={lightActive ? 'Reset to Day' : `${fam.label} · Light`}
                  style={{
                    padding: '5px 9px',
                    borderLeft: `1px solid ${borderCol}`,
                    background: lightActive ? fam.accent : 'transparent',
                    color: lightActive ? fam.textOnAccent : 'var(--mid)',
                    cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700,
                    transition: 'background 0.15s, color 0.15s',
                    lineHeight: 1, border: 'none',
                    borderLeft: `1px solid ${borderCol}`,
                  }}
                >☀</button>
                {/* Dark variant */}
                <button
                  onClick={() => onThemeChange(darkActive ? 'day' : fam.darkId)}
                  title={darkActive ? 'Reset to Day' : `${fam.label} · Dark`}
                  style={{
                    padding: '5px 9px',
                    borderLeft: `1px solid ${borderCol}`,
                    background: darkActive ? fam.accent : 'transparent',
                    color: darkActive ? fam.textOnAccent : 'var(--mid)',
                    cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700,
                    transition: 'background 0.15s, color 0.15s',
                    lineHeight: 1, border: 'none',
                    borderLeft: `1px solid ${borderCol}`,
                  }}
                >🌙</button>
              </div>
            );
          })}
        </div>
        {/* Active colour family description */}
        {COLOUR_FAMILIES.some(f => theme === f.lightId || theme === f.darkId) && (
          <span style={{ fontSize: '0.6875rem', color: 'var(--mid)', marginLeft: 4 }}>
            {(() => {
              const fam = COLOUR_FAMILIES.find(f => theme === f.lightId || theme === f.darkId);
              return `${fam.label} · ${theme === fam.lightId ? 'Light' : 'Dark'}`;
            })()}
          </span>
        )}
      </div>

    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Figma plugin download panel
   ───────────────────────────────────────────────────────────────────────────── */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

function FigmaPluginPanel({ onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 20, padding: 28, maxWidth: 520, width: '100%',
        boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 20 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: 'linear-gradient(135deg,#0B2D5C,#2878CC)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.25rem',
          }}>🎨</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--black)', marginBottom: 2 }}>
              Figma Illustration Scaffold
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.5 }}>
              50 components · 4 theme modes · named layers · token variables
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '1.25rem', color: 'var(--mid)', padding: '0 2px', lineHeight: 1,
          }}>✕</button>
        </div>

        {/* Downloads */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <a
            href={`${BASE}/figma-plugin/code.js`}
            download="code.js"
            style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 14px', borderRadius: 10,
              background: 'linear-gradient(135deg,#0B2D5C,#2878CC)',
              color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '0.8125rem',
            }}
          >
            <span style={{ fontSize: '1rem' }}>⬇</span> Download code.js
          </a>
          <a
            href={`${BASE}/figma-plugin/manifest.json`}
            download="manifest.json"
            style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 14px', borderRadius: 10,
              border: '1px solid var(--border)', background: 'var(--bg)',
              color: 'var(--black)', textDecoration: 'none', fontWeight: 600, fontSize: '0.8125rem',
            }}
          >
            <span style={{ fontSize: '1rem' }}>⬇</span> Download manifest.json
          </a>
        </div>

        {/* Steps */}
        <div style={{
          background: 'var(--bg)', borderRadius: 12, padding: '14px 16px',
          border: '1px solid var(--border)', marginBottom: 16,
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)', marginBottom: 10 }}>
            Setup instructions
          </div>
          {[
            ['1', 'Save both files into a new folder on your machine'],
            ['2', 'Figma Desktop → Plugins → Development → New Plugin'],
            ['3', 'Choose "Link existing plugin" → select the folder'],
            ['4', 'Run: Plugins → Development → UX Library — Illustration Scaffold'],
          ].map(([n, step]) => (
            <div key={n} style={{ display: 'flex', gap: 10, marginBottom: 7, alignItems: 'flex-start' }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                background: 'var(--border)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '0.625rem', fontWeight: 700, color: 'var(--black)',
              }}>{n}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.5, paddingTop: 2 }}>{step}</div>
            </div>
          ))}
        </div>

        {/* What you get */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            ['📐', '50 components', 'All 5 product sections'],
            ['🎨', '4 theme modes', 'Blueprint L/D · Day · Night'],
            ['🏷️', 'Named layers', '/bg /route /card /badge …'],
            ['🔗', 'Token variables', 'Every fill bound to a variable'],
          ].map(([emoji, title, sub]) => (
            <div key={title} style={{
              background: 'var(--bg)', borderRadius: 10, padding: '10px 12px',
              border: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 2 }}>
                <span style={{ fontSize: '0.875rem' }}>{emoji}</span>
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--black)' }}>{title}</span>
              </div>
              <div style={{ fontSize: '0.625rem', color: 'var(--muted)' }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function IntroIllustrations({ noThemeBar = false, forcedIlloStyle = null }) {
  const { theme, setTheme, illoStyle: ctxIlloStyle, setIlloStyle: ctxSetIlloStyle } = useIlloStyle();

  // Use global context for style pref so it persists across navigation.
  // forcedIlloStyle overrides everything (used by IntroIllustrationsLegacy).
  const illoStyle = forcedIlloStyle ?? ctxIlloStyle;

  function handleStyleChange(val) {
    ctxSetIlloStyle(val);
  }

  const [showPlugin, setShowPlugin] = React.useState(false);
  const [showRegenerate, setShowRegenerate] = React.useState(false);

  return (
    <RegenerateCtx.Provider value={showRegenerate}>
    <div className="page" style={{ paddingTop: 0 }}>
      {showPlugin && <FigmaPluginPanel onClose={() => setShowPlugin(false)} />}

      {/* ── Sticky theme bar — hidden on legacy page ── */}
      {!noThemeBar && <ThemeBar theme={theme} onThemeChange={setTheme} illoStyle={illoStyle} onStyleChange={handleStyleChange} onPluginClick={() => setShowPlugin(true)} showRegenerate={showRegenerate} onToggleRegenerate={() => setShowRegenerate(v => !v)} />}

      <div style={{ padding: '0 24px' }}>
        <div className="page-header" style={{ marginTop: 24 }}>
          <h1>Intro Hero Illustrations</h1>
          <PageActions />
        </div>

        <p className="quick-answer">
          All 82+ hero illustrations across every product intro and API reference page, unified under one theme system. Switching a theme recolours every single illustration live — shapes and layout stay identical.
        </p>

        {/* ── Link to legacy reference ── */}
        {!noThemeBar && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <a
              href="#"
              onClick={e => { e.preventDefault(); window.dispatchEvent(new CustomEvent('ux-navigate', { detail: 'intro-illustrations-legacy' })); }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 100,
                border: '1px solid var(--border)', background: 'var(--surface)',
                fontSize: '0.75rem', fontWeight: 600, color: 'var(--mid)',
                textDecoration: 'none', transition: 'border-color 0.15s, color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--black)'; e.currentTarget.style.color = 'var(--black)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--mid)'; }}
            >
              🗂 View original dark reference →
            </a>
            <span style={{ fontSize: '0.6875rem', color: 'var(--muted)' }}>All Detailed Wireframe components frozen in the original hardcoded dark palette</span>
          </div>
        )}

      {/* ── UX Library ── */}
      <div className="zone">
        <SectionHeader
          emoji="🗺️"
          title="UX Library — Overview"
          subtitle="Capability and domain thumbnails from the UX Library introduction page."
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          <IlloCard dark={IlloEV} icon={IcoEV}                      light={L_EV}                     label="EV Charging"                emoji="⚡" source="Overview · ThumbEV"                    prompt="Dark list of 3 stations showing provider name, power rating and available slot count with a green indicator. Speed, payment and services filter chips run across the top; the whole card is a compact real-time availability widget." illoStyle={illoStyle}/>
          <IlloCard dark={IlloSearchResult} icon={IcoSearchFuzzy}             light={L_SearchResult}            label="Search Results"             emoji="🔍" source="Overview · ThumbSearch"                prompt="Dark search bar above a dropdown of 3 nearby restaurant results, each with a location-pin icon, name and walking distance. A coloured status stripe below the bar reads '3rd-party search · online' to surface the integration layer." illoStyle={illoStyle}/>
          <IlloCard dark={IlloNavControls} icon={IcoNavControls}              light={L_NavControls}             label="Nav Controls"               emoji="🎛️" source="Overview · ThumbNavControls"           prompt="Dark map canvas with a TomTom-red active-route arc and four icon-only control buttons (search, EV, mute, settings) overlaid at the bottom edge. The composition shows in-journey navigation UI sitting on top of a live map." illoStyle={illoStyle}/>
          <IlloCard dark={IlloAIVoice} icon={IcoAIVoice}                  light={L_AIVoice}                 label="AI Voice (TAIA)"            emoji="🎙️" source="Overview · ThumbAI"                    prompt="Waveform-style voice assistant panel with animated amplitude bars and a partial response text bubble. The illustration captures the AI in mid-response — audio active, text streaming — communicating real-time interaction." illoStyle={illoStyle}/>
          <IlloCard dark={IlloRoute} icon={IcoCalculateRoute}                    light={L_Route}                   label="EV Route with Stops"        emoji="🔋" source="Overview · ThumbRoute"                 prompt="Route arc on a dark map with two green charging-stop circles between origin and destination pins. A bottom info bar shows battery SOC transitioning 18% → 78% → 22% across the three journey legs." illoStyle={illoStyle}/>
          <IlloCard dark={IlloColourSystem} icon={IcoAIConfig}             light={L_ColourSystem}            label="Colour System"              emoji="🎨" source="Overview · ThumbColour"                prompt="Light-background grid of named colour swatches (brand red, navy, greys) with hex labels and a split showing day vs night variants. Intentionally bright to show white surfaces and the full semantic palette together." illoStyle={illoStyle}/>
          <IlloCard dark={IlloHorizonPanel} icon={IcoHorizonPanel}             light={L_HorizonPanel}            label="Horizon Panel"              emoji="🌅" source="Overview · ThumbHorizonPanel"          prompt="Narrow horizontal HUD strip showing a junction manoeuvre arrow, street name and countdown distance — mimicking an ADAS horizon readout in an instrument cluster. The constrained landscape format communicates the strip's physical placement." illoStyle={illoStyle}/>
          <IlloCard dark={IlloCluster} icon={IcoCluster}                  light={L_Cluster}                 label="Instrument Cluster"         emoji="🚗" source="Overview · ThumbCluster"               prompt="Circular speedometer dial with a TomTom-red active zone, a turn-guidance icon and a small distance readout alongside it. The compact round format reflects real physical cluster dimensions and extreme DPI constraints." illoStyle={illoStyle}/>
          <IlloCard dark={IlloMapStyle} icon={IcoMapDisplay}                 light={L_MapStyle}                label="Day / Night Map Style"      emoji="🌙" source="Overview · ThumbMapStyle"              prompt="Two map panels side-by-side — warm sand + yellow roads for day, deep navy + teal roads for night — sharing identical geometry. The split layout communicates live theme-switching without any change to underlying map data." illoStyle={illoStyle}/>
          <IlloCard dark={IlloHomeScreen} icon={IcoHomeScreen}               light={L_HomeScreen}              label="Home Screen Layout"         emoji="📱" source="Overview · ThumbHomeScreen"            prompt="Full-screen in-vehicle home layout: large map canvas, destination search bar at the top, and a row of recent-place chips at the bottom. The composition prioritises map real-estate while keeping all key actions within thumb-reach." illoStyle={illoStyle}/>
          <IlloCard dark={IlloETAPanel} icon={IcoETAPanel}                 light={L_ETAPanel}                label="ETA Panel"                  emoji="⏱️" source="Overview · ThumbETAPanel"              prompt="Bottom-sheet panel showing arrival time in large type, distance remaining and a thin route-progress bar — nothing else. Minimal data-ink ratio reflects glanceable driving UI where a single glance must communicate journey state." illoStyle={illoStyle}/>
          <IlloCard dark={IlloThemingTokens} icon={IcoHomeScreen}            light={L_ThemingTokens}           label="Design Token Override"      emoji="🎨" source="Overview · ThumbTheming"               prompt="Rows of named design tokens (primary, surface, accent, border) each with a colour swatch and an override arrow pointing to the OEM brand value. The illustration communicates how one JSON file rewires the entire visual theme." illoStyle={illoStyle}/>
          <IlloCard dark={IlloChargingSearch} icon={IcoEVSearchNearby}           light={L_ChargingSearch}          label="Charging Station Search"    emoji="🔌" source="Overview · ThumbChargingSearch"        prompt="Map view with a user-location pin at centre surrounded by EV station pins at varying distances, some green (available), one red (full). A side strip shows the active filter state and total station count for the visible radius." illoStyle={illoStyle}/>
          <IlloCard dark={IlloConversationPersonality} icon={IcoAIVoice}  light={L_ConversationPersonality} label="Conversation Personality"   emoji="💬" source="Overview · ThumbConversationPersonality" prompt="Two speech-bubble exchanges showing the same driver query answered in distinct tones — formal vs casual — with different bubble border styles. The visual contrast communicates that personality is an OEM-configurable overlay, not a logic change." illoStyle={illoStyle}/>
          <IlloCard dark={IlloADAS} icon={IcoADAS}                     light={L_ADAS}                    label="ADAS — Lane Guidance"       emoji="🛣️" source="Overview · ThumbADAS"                  prompt="Top-down road cross-section with three lane marks, the ego lane highlighted in TomTom red and a dashed arrow showing a recommended lane change. The bird's-eye perspective communicates sub-lane navigation precision." illoStyle={illoStyle}/>
          {/* App Customisation — new panels */}
          <IlloCard dark={IlloInstructionPanel} icon={IcoInstructionPanel}         light={L_NavGuidance}             label="Instruction Panel"          emoji="↖️" source="DomainLanding · InstructionPanel"      prompt="Full-width next-turn banner showing a large directional arrow, bold street name, and countdown distance — the complete NIP layout used during active guidance." illoStyle={illoStyle}/>
          <IlloCard dark={IlloRouteBar} icon={IcoRouteBar}                 light={L_Route}                   label="Route Bar"                  emoji="📍" source="DomainLanding · RouteBar"               prompt="Horizontal route progress bar with waypoint chips and a traffic summary strip below — showing time and distance remaining across the active journey." illoStyle={illoStyle}/>
          {/* EV & Charging — new pages */}
          <IlloCard dark={IlloEVBattery} icon={IcoEVBattery}                light={L_EV}                      label="EV Battery Model"           emoji="🔋" source="DomainLanding · EVBattery"              prompt="BMS integration panel with battery capacity figure, consumption curve graph, and a vehicle class preset selector — the foundation for range-accurate routing." illoStyle={illoStyle}/>
          <IlloCard dark={IlloEVRouting} icon={IcoEVRouting}                light={L_EVRouting}               label="Long-Distance EV Routing"   emoji="⚡" source="DomainLanding · EVRouting"              prompt="City-to-city route arc with two charging stop circles and a SOC trajectory bar spanning the full journey below — showing how automatic stop planning works." illoStyle={illoStyle}/>
          <IlloCard dark={IlloEVNavUI} icon={IcoEVNavUI}                  light={L_EVRouting}               label="EV In-Navigation UI"        emoji="🔌" source="DomainLanding · EVNavUI"                prompt="In-guidance SoC strip at the bottom, reachable range ring on the map, and horizon charging stop countdown — all composited over the active navigation view." illoStyle={illoStyle}/>
          <IlloCard dark={IlloEVRequirements} icon={IcoEVRequirements}           light={L_EV}                      label="EV Requirements"            emoji="📋" source="DomainLanding · EVRequirements"          prompt="Four-item integration checklist with green ticks for completed steps — SDK dependencies, Android permissions, BMS connection, and charging-park API key." illoStyle={illoStyle}/>
          {/* Vehicle Integration — new pages */}
          <IlloCard dark={IlloVIBasics} icon={IcoVIBasics}                 light={L_VIL}                     label="Vehicle Integration Basics" emoji="🔧" source="DomainLanding · VIBasics"               prompt="Three-layer stack: NavSDK app at top, VIL middleware in the centre, and vehicle hardware APIs at the bottom — with bidirectional arrows showing the integration flow." illoStyle={illoStyle}/>
          <IlloCard dark={IlloHUD} icon={IcoHUD}                      light={L_ADAS}                    label="Head-Up Display"            emoji="🪟" source="DomainLanding · HUD"                     prompt="Windshield outline with a projected speed figure and a manoeuvre arrow rendered as a semi-transparent HUD overlay — communicating the combiner display format." illoStyle={illoStyle}/>
          <IlloCard dark={IlloTruck} icon={IcoTruck}                    light={L_Cluster}                 label="Truck & Commercial"         emoji="🚛" source="DomainLanding · Truck"                    prompt="Truck cab silhouette with a dashboard-mounted navigation screen showing a route summary with height and weight restriction icons along the corridor." illoStyle={illoStyle}/>
          {/* TomTom AI — new pages */}
          <IlloCard dark={IlloIntentRouting} icon={IcoIntentRouting}            light={L_AIVoice}                 label="Intent Routing"             emoji="🔀" source="DomainLanding · IntentRouting"           prompt="Speech bubble with a navigation command splitting into two outbound arrows — one to TAIA navigation handler, one forwarded to an OEM domain handler — showing intent classification." illoStyle={illoStyle}/>
          <IlloCard dark={IlloVoiceEngine} icon={IcoVoiceEngine}              light={L_AIVoice}                 label="Voice Engine"               emoji="🔊" source="DomainLanding · VoiceEngine"             prompt="TTS provider wiring diagram: TAIA text response feeds into an OEM voice engine block, with audio output waveform and a latency badge — communicating the TTS integration boundary." illoStyle={illoStyle}/>
          <IlloCard dark={IlloSpeechToText} icon={IcoSpeechToText}             light={L_AIVoice}                 label="Speech to Text"             emoji="🎤" source="DomainLanding · SpeechToText"            prompt="Microphone icon above an amplitude waveform that resolves into a transcribed text line — capturing the wake-word detection and STT pipeline in one compact visual." illoStyle={illoStyle}/>
          <IlloCard dark={IlloAIConfig} icon={IcoAIConfig}                 light={L_AIVoice}                 label="TAIA Configuration"         emoji="⚙️" source="DomainLanding · AIConfig"               prompt="Code-editor window with traffic-light dots showing TAIA SDK initialisation, navigation context binding, and an MQTT event handler wired up — the complete client setup." illoStyle={illoStyle}/>
        </div>
      </div>

      {/* ── Maps & Navigation SDK ── */}
      <div className="zone">
        <SectionHeader
          emoji="📡"
          title="Maps & Navigation SDK"
          subtitle="Capability card thumbnails from the NavSDK introduction page."
          color="#0066cc"
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          <IlloCard dark={IlloMapDisplay} icon={IcoMapDisplay}     light={L_MapDisplay}     label="Map Display"       emoji="🗺️" source="NavSDKIntro · ThumbMapDisplay"     prompt="Rendered map tile showing roads, a GPS accuracy halo and a pulsing TomTom-red route overlay at zoom 14. The illustration shows the SDK's core tile rendering with real-time data layers composited as one view." illoStyle={illoStyle}/>
          <IlloCard dark={IlloSDKSearch} icon={IcoNavSDKSearch}      light={L_SDKSearch}      label="Search"            emoji="🔍" source="NavSDKIntro · ThumbSearch"          prompt="Search input with three autocomplete suggestions in a dark dropdown, each prefixed with a type icon (place, address, POI). The card shows the SDK's built-in search widget with suggestion debouncing and type classification." illoStyle={illoStyle}/>
          <IlloCard dark={IlloRouteOptions} icon={IcoCalculateRoute}   light={L_RouteOptions}   label="Route Options"     emoji="🚦" source="NavSDKIntro · ThumbRouting"         prompt="Three overlapping route lines in different colours (fast, eco, scenic) over the same map area with time and distance labels beside each. The side-by-side alternatives communicate the SDK's multi-route preference API." illoStyle={illoStyle}/>
          <IlloCard dark={IlloNavGuidance} icon={IcoNavGuidance}    light={L_NavGuidance}    label="Navigation (NIP)"  emoji="↖️" source="NavSDKIntro · ThumbNavigation"      prompt="Large directional manoeuvre arrow (turn left), street name in bold below it, and a distance countdown in the corner — the complete NIP layout. High contrast and minimal chrome reflect in-car legibility requirements at speed." illoStyle={illoStyle}/>
          <IlloCard dark={IlloOfflineMaps} icon={IcoNavSDKOffline}    light={L_OfflineMaps}    label="Offline Maps"      emoji="📴" source="NavSDKIntro · ThumbOffline"          prompt="Download progress UI showing a country region being cached with a file-size figure and a percentage bar. Cloud-to-device arrow communicates the offline-first tile delivery model." illoStyle={illoStyle}/>
          <IlloCard dark={IlloCarPlay} icon={IcoNavControls}        light={L_CarPlay}        label="CarPlay"           emoji="🍎" source="NavSDKIntro · ThumbCarPlay"          prompt="Apple CarPlay-styled screen template with TomTom navigation constrained to the safe-zone and two large dashboard buttons. Rounded iOS chrome and simplified layout reflect strict CarPlay template guidelines." illoStyle={illoStyle}/>
          <IlloCard dark={IlloVirtualHorizon} icon={IcoHorizonPanel} light={L_VirtualHorizon} label="Virtual Horizon"   emoji="🛤️" source="NavSDKIntro · ThumbVirtualHorizon"  prompt="3D perspective road wireframe showing upcoming curves and gradient changes with data-annotation overlays. The forward-looking view illustrates ADAS horizon data feeding predictive cruise-control algorithms." illoStyle={illoStyle}/>
        </div>
      </div>

      {/* ── NavSDK Domain pages ── */}
      <div className="zone">
        <SectionHeader
          emoji="🗂️"
          title="NavSDK — Domain Pages"
          subtitle="Domain landing card thumbnails for the 8 NavSDK capability domains."
          color="#0066cc"
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          <IlloCard dark={IlloMapDisplay} icon={IcoMapDisplay}           light={L_MapDisplay}     label="Map Display"          emoji="🗺️" source="NavSDKDomains · MapDisplay"       prompt="Dark map canvas with a TomTom-red route arc, a vehicle dot, and coloured POI pins — the NavSDK core map rendering view with real-time data layers composited." illoStyle={illoStyle}/>
          <IlloCard dark={IlloNavSDKLocation} icon={IcoNavSDKLocation}       light={L_MapDisplay}     label="Location"             emoji="📍" source="NavSDKDomains · Location"         prompt="Bird's-eye map grid with a GPS accuracy halo ring radiating from a red location dot and a blue heading arrow — communicating real-time GNSS positioning with satellite count and fix quality." illoStyle={illoStyle}/>
          <IlloCard dark={IlloNavSDKSearch} icon={IcoNavSDKSearch}         light={L_SearchResult}   label="SDK Search"           emoji="🔍" source="NavSDKDomains · Search"           prompt="Autocomplete search bar with the user's partial query and three location results below — each showing a place category and walking distance — mirroring the SDK's fuzzy search suggestion flow." illoStyle={illoStyle}/>
          <IlloCard dark={IlloNavSDKRouting} icon={IcoNavSDKRouting}        light={L_Route}          label="SDK Routing"          emoji="🚦" source="NavSDKDomains · Routing"         prompt="Three alternative route options listed with time and distance, the fastest highlighted in green — showing the SDK's multi-route planning API with preference-based selection." illoStyle={illoStyle}/>
          <IlloCard dark={IlloNavSDKNavigation} icon={IcoNavSDKNavigation}     light={L_NavGuidance}    label="Navigation"           emoji="↖️" source="NavSDKDomains · Navigation"      prompt="Active navigation view with a NIP turn-instruction banner at the top and a three-field ETA/time/distance bar at the bottom, composited over a live route map." illoStyle={illoStyle}/>
          <IlloCard dark={IlloNavSDKOffline} icon={IcoNavSDKOffline}        light={L_MapDisplay}     label="Offline"              emoji="📴" source="NavSDKDomains · Offline"         prompt="Offline map download manager showing three regions with progress bars — one complete in green, two in progress — communicating the SDK's tile pre-caching and incremental update model." illoStyle={illoStyle}/>
          <IlloCard dark={IlloNavSDKVirtualHorizon} icon={IcoNavSDKVirtualHorizon} light={L_HorizonPanel}   label="Virtual Horizon"      emoji="🛤️" source="NavSDKDomains · VirtualHorizon"  prompt="3D road perspective with coloured ADAS event pins ahead (speed limit, curve, incident) and a horizon data strip at the bottom showing distance-keyed events on the upcoming route." illoStyle={illoStyle}/>
          <IlloCard dark={IlloNavSDKAdvanced} icon={IcoNavSDKAdvanced}       light={L_NavGuidance}    label="Advanced"             emoji="⚙️" source="NavSDKDomains · Advanced"        prompt="Code editor window showing SDK initialisation config keys (apiKey, logLevel, telemetry, vehicle) with syntax-highlighted values and a green success confirmation badge." illoStyle={illoStyle}/>
        </div>
      </div>

      {/* ── Routing API ── */}
      <div className="zone">
        <SectionHeader
          emoji="🧭"
          title="Routing API"
          subtitle="Endpoint card thumbnails from the Routing API introduction page."
          color="#3fb950"
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          <IlloCard dark={IlloCalculateRoute} icon={IcoCalculateRoute}        light={L_CalculateRoute}        label="Calculate Route"       emoji="📍" source="RoutingAPIIntro · ThumbCalculateRoute"    prompt="Point-to-point route on a dark map with a green origin pin and red destination pin joined by a TomTom-red arc. ETA and distance labels are overlaid directly on the route line, not in a separate panel." illoStyle={illoStyle}/>
          <IlloCard dark={IlloReachableRange} icon={IcoReachableRange}        light={L_ReachableRange}        label="Reachable Range"       emoji="⭕" source="RoutingAPIIntro · ThumbReachableRange"    prompt="Filled isochrone polygon radiating from a centre pin, shading from solid at the core to near-transparent at the outer edge. The fade communicates decreasing reach confidence within a fixed time or fuel budget." illoStyle={illoStyle}/>
          <IlloCard dark={IlloEVRouting} icon={IcoEVRouting}             light={L_EVRouting}             label="EV Route"              emoji="⚡" source="RoutingAPIIntro · ThumbEVRoute"           prompt="Route arc connecting two city markers with two intermediate charging stops as green circles. A battery SOC bar below shows the charge level dropping and recovering across each leg of the journey." illoStyle={illoStyle}/>
          <IlloCard dark={IlloBatchRouting} icon={IcoBatchRouting}          light={L_BatchRouting}          label="Batch Routing"         emoji="📦" source="RoutingAPIIntro · ThumbBatchRouting"      prompt="Four horizontal progress bars in brand colours representing concurrent route calculations with km values beside each. A green status line confirms all four resolved in parallel within 400ms." illoStyle={illoStyle}/>
          <IlloCard dark={IlloMatrixRouting} icon={IcoMatrixRouting}         light={L_MatrixRouting}         label="Matrix Routing"        emoji="⚡" source="RoutingAPIIntro · ThumbMatrix"            prompt="4×4 heat-matrix grid where each cell shows an origin-to-destination travel time, encoded by red intensity. The diagonal cells (same point) are the darkest reference anchors, establishing the visual key." illoStyle={illoStyle}/>
          <IlloCard dark={IlloWaypointOpt} icon={IcoWaypointOpt}           light={L_WaypointOpt}           label="Waypoint Optimization" emoji="📍" source="RoutingAPIIntro · ThumbWaypointOpt"       prompt="Before/after split: left shows a zigzag unordered stop sequence; right shows a smooth efficient path with numbered circles. The contrast communicates TSP-style waypoint reordering in a single API call." illoStyle={illoStyle}/>
          <IlloCard dark={IlloTurnInstructions} icon={IcoTurnInstructions}      light={L_TurnInstructions}      label="Turn Instructions"     emoji="↗️" source="RoutingAPIIntro · ThumbInstructions"      prompt="Vertical list of four manoeuvre steps (straight, left turn, right turn, roundabout) with monochrome icons and distance labels. The list format directly mirrors the structured guidance array returned in the JSON response." illoStyle={illoStyle}/>
          <IlloCard dark={IlloRoadShields} icon={IcoNavGuidance}           light={L_RoadShields}           label="Road Shields"          emoji="🛡️" source="RoutingAPIIntro · ThumbRoadShields"       prompt="A row of motorway, national and regional road shield shapes in country-specific colours and typefaces. The shields show how route summaries embed official signage references inside instruction text." illoStyle={illoStyle}/>
          <IlloCard dark={IlloLaneGuidance} icon={IcoADAS}          light={L_LaneGuidance}          label="Lane Guidance"         emoji="🛣️" source="RoutingAPIIntro · ThumbLaneGuidance"      prompt="Five lane arrows in a row with the recommended lane in TomTom red and the others in muted grey. The per-lane state communicates high-resolution junction data available beyond standard turn-by-turn guidance." illoStyle={illoStyle}/>
          <IlloCard dark={IlloRoutingComputeToll} icon={IcoCalculateRoute}    light={L_RoutingComputeToll}    label="Compute Toll Amounts"  emoji="💳" source="RoutingAPIIntro · ThumbComputeToll"       prompt="Route summary with itemised toll costs broken down by road segment and a total cost badge. The itemised layout communicates financial transparency for pre-trip planning and fleet cost estimation." illoStyle={illoStyle}/>
          <IlloCard dark={IlloRoutingWeather} icon={IcoRoutingWeather}        light={L_RoutingWeather}        label="Weather Consideration" emoji="🌧️" source="RoutingAPIIntro · ThumbWeather"           prompt="Route arc with weather-condition icons pinned at waypoints (sun, cloud, rain) and adjusted travel-time labels beside each. The visual shows how real-time weather degrades speed estimates and influences route selection." illoStyle={illoStyle}/>
          <IlloCard dark={IlloRoutingDataFreshness} icon={IcoTrafficStats}  light={L_RoutingDataFreshness}  label="Dynamic Data Freshness" emoji="🔄" source="RoutingAPIIntro · ThumbDataFreshness"  prompt="Panel showing a traffic data model version number, last-updated timestamp and a coloured freshness indicator dot. The visual communicates that route quality is tied directly to the recency of the underlying traffic model." illoStyle={illoStyle}/>
        </div>
      </div>

      {/* ── Long Distance EV Routing ── */}
      <div className="zone">
        <SectionHeader
          emoji="🔋"
          title="Long-Distance EV Routing (LDEVR)"
          subtitle="Endpoint card thumbnails from the LDEVR introduction page."
          color="#22c55e"
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          <IlloCard dark={IlloLDEVRRoute} icon={IcoEVRouting}            light={L_LDEVRRoute}            label="Calculate EV Route"    emoji="⚡" source="LDEVRIntro · ThumbEVRoute"              prompt="Long-distance route arc spanning two charging stops, with SOC arcs dropping then recovering between each segment. The battery trajectory illustrates how the API selects stops to keep SOC above a safe minimum threshold." illoStyle={illoStyle}/>
          <IlloCard dark={IlloLDEVRBatch} icon={IcoBatchRouting}            light={L_LDEVRBatch}            label="Batch EV Route"        emoji="📦" source="LDEVRIntro · ThumbBatchEV"             prompt="Side-by-side columns showing two EV route strategies — fewer stops vs faster charging — each with total trip duration. The comparison layout communicates the batch endpoint surfacing driver trade-offs in a single response." illoStyle={illoStyle}/>
          <IlloCard dark={IlloLDEVRVehicleBrand} icon={IcoVIBasics}     light={L_LDEVRVehicleBrand}     label="Vehicle Brand Lookup"  emoji="🚗" source="LDEVRIntro · ThumbVehicleBrand"        prompt="Vehicle selector card with make/model dropdown, battery capacity figure and a simplified charging-curve graph. The spec panel reflects the API's certified range and consumption data returned by vehicle brand ID." illoStyle={illoStyle}/>
          <IlloCard dark={IlloLDEVROemEmsp} icon={IcoEVRequirements}          light={L_LDEVROemEmsp}          label="OEM EMSP Support"      emoji="🔌" source="LDEVRIntro · ThumbOemEmsp"             prompt="Connector-type grid overlaid with OEM card brand logos showing which EMSP credentials authenticate at which network. The matrix communicates multi-network authentication routing across roaming agreements." illoStyle={illoStyle}/>
          <IlloCard dark={IlloLDEVRComputeToll} icon={IcoCalculateRoute}      light={L_LDEVRComputeToll}      label="Compute Toll · EV"     emoji="💳" source="LDEVRIntro · ThumbComputeTollLDEVR"   prompt="Itemised toll-cost table with an EV-exemption badge applied to certain road segments and a total cost summary. The layout shows the EV-specific toll logic that waives or reduces fees for zero-emission vehicles." illoStyle={illoStyle}/>
          <IlloCard dark={IlloLDEVRChargingParks} icon={IcoEVChargingAvailability}    light={L_LDEVRChargingParks}    label="Charging Parks Hours"  emoji="🅿️" source="LDEVRIntro · ThumbChargingParks"       prompt="Station detail card with a weekly opening-hours grid and a peak-availability heatmap row below it. The illustration communicates the structured operating-hours data the API exposes per charging park location." illoStyle={illoStyle}/>
          <IlloCard dark={IlloLDEVRWeather} icon={IcoRoutingWeather}          light={L_LDEVRWeather}          label="Weather Consideration" emoji="🌧️" source="LDEVRIntro · ThumbWeatherLDEVR"         prompt="EV route with temperature and precipitation icons at each leg segment showing cold-weather range penalty as a percentage delta. The delta labels communicate the consumption model's per-condition range reduction." illoStyle={illoStyle}/>
          <IlloCard dark={IlloLDEVRDataFreshness} icon={IcoTrafficStats}    light={L_LDEVRDataFreshness}    label="Data Freshness"        emoji="🔄" source="LDEVRIntro · ThumbDataFreshnessLDEVR" prompt="EV charging data model version badge with a last-updated timestamp and a coloured staleness indicator dot. The visual reinforces that charging-availability accuracy degrades as data ages." illoStyle={illoStyle}/>
        </div>
      </div>

      {/* ── ANA ── */}
      <div className="zone">
        <SectionHeader
          emoji="🤖"
          title="ANA — Autonomous Navigation App"
          subtitle="Hero illustrations and integration layer thumbnails from the ANA introduction page."
          color="#a855f7"
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          <IlloCard dark={IlloANADriverExp} icon={IcoNavGuidance} light={L_ANA_DriverExp} label="Driver Experience"         emoji="🧭" source="ANAIntro · ThumbANADriverExp"  prompt="Full HMI home screen with a large map region occupying two-thirds of the area, an ETA/destination bar at the bottom and media/call shortcuts in a corner. The balanced hierarchy shows navigation, infotainment and communication coexisting." illoStyle={illoStyle}/>
          <IlloCard dark={IlloANATraffic} icon={IcoTrafficFlow}   light={L_ANA_Traffic}   label="Live Traffic & Rerouting"  emoji="🚦" source="ANAIntro · ThumbANATraffic"    prompt="Map showing a congested segment crossed out in red and a highlighted green alternative route. A rerouting toast at the top communicates automatic traffic-avoidance firing without driver input." illoStyle={illoStyle}/>
          <IlloCard dark={IlloANAMap} icon={IcoMapDisplay}       light={L_ANA_Map}       label="Premium Map Display"        emoji="🗺️" source="ANAIntro · ThumbANAMap"        prompt="Richly styled TomTom day-theme map tile with sharp road labels, coloured category POI icons and smooth building footprints. The visual quality signals premium map differentiation versus generic basemaps." illoStyle={illoStyle}/>
          <IlloCard dark={IlloANAEVSearch} icon={IcoEVSearchNearby}  light={L_ANA_EVSearch}  label="EV Charging Search"         emoji="⚡" source="ANAIntro · ThumbANAEVSearch"   prompt="Side panel sliding over the map listing three nearby EV stations with connector type, power and availability status. The overlay approach shows integrated charging search without leaving the navigation context." illoStyle={illoStyle}/>
          <IlloCard dark={IlloANALDRoute} icon={IcoEVRouting}   light={L_ANA_LDRoute}   label="Long-Distance EV Route"     emoji="🔋" source="ANAIntro · ThumbANALDRoute"    prompt="City-to-city route arc with two charging waypoints and a SOC trajectory bar spanning the full journey below it. The illustration previews how LDEVR results surface inside the ANA in-car navigation UI." illoStyle={illoStyle}/>
          <IlloCard dark={IlloVIL} icon={IcoNavSDKNavigation}          light={L_VIL}           label="Vehicle Integration Layer"  emoji="🔧" source="ANAIntro · ThumbVIL"           prompt="Layered stack diagram — ANA app → VIL middleware → vehicle hardware APIs — with connector arrows between each layer. The VIL box abstracts OEM-specific vehicle signals into a uniform SDK interface." illoStyle={illoStyle}/>
          <IlloCard dark={IlloCIL} icon={IcoNavSDKNavigation}          light={L_CIL}           label="Control Integration Layer"  emoji="🕹️" source="ANAIntro · ThumbCIL"           prompt="Layered stack with OS UI framework → CIL → app components and bidirectional gesture/event arrows between layers. The CIL acts as the translation layer between platform input events and ANA's internal navigation controls." illoStyle={illoStyle}/>
          <IlloCard dark={IlloANATheming} icon={IcoHomeScreen}   light={L_ANATheming}    label="OEM Theme Tokens"           emoji="🎨" source="ANAIntro · ThumbTheming"       prompt="Token swatch grid with TomTom defaults in one column and OEM brand override values in an adjacent column, row by row. The side-by-side format communicates that brand customisation is additive — one file, no code changes." illoStyle={illoStyle}/>
        </div>
      </div>

      {/* ── Search & Places API ── */}
      <div className="zone">
        <SectionHeader
          emoji="🔍"
          title="Search & Places API"
          subtitle="Endpoint illustrations for TomTom's search surface: fuzzy, POI, category, nearby, along-route and autocomplete."
          color="#58a6ff"
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          <IlloCard dark={IlloSearchFuzzy} icon={IcoSearchFuzzy}       light={L_SearchFuzzy}       label="Fuzzy Search"           emoji="🔍" source="Search API · fuzzy"          prompt="Dark search bar above a scrollable result list mixing address pins and POI icons, with a 'Fuzzy' badge in the input. Results show emoji type markers, name and distance; the top-ranked row carries a subtle highlight." illoStyle={illoStyle}/>
          <IlloCard dark={IlloSearchPOI} icon={IcoSearchPOI}         light={L_SearchPOI}         label="POI Search"             emoji="📍" source="Search API · poi"            prompt="Category filter chips (Cafe, Fuel, Food, Hotel) at the top, the active chip highlighted, with three POI result rows below each showing icon, name, distance and star rating. The chip row communicates single-category filtering." illoStyle={illoStyle}/>
          <IlloCard dark={IlloSearchCategory} icon={IcoSearchPOI}    light={L_SearchCategory}    label="Category Search"        emoji="🗂️" source="Search API · category"       prompt="Tree-style taxonomy list with indented children, active node highlighted in blue and a result-count badge at the bottom. The tree communicates drilling into a POI hierarchy (Food & Drink → Restaurant) before triggering a search." illoStyle={illoStyle}/>
          <IlloCard dark={IlloSearchNearby} icon={IcoSearchNearby}      light={L_SearchNearby}      label="Nearby Search"          emoji="📡" source="Search API · nearby"         prompt="Radar-style map circle with a red user-location dot at centre, three blue POI pins within the ring and a named result list below with distances. The concentric ring visualises the search radius parameter." illoStyle={illoStyle}/>
          <IlloCard dark={IlloSearchAlongRoute} icon={IcoSearchAlongRoute}  light={L_SearchAlongRoute}  label="Along Route Search"     emoji="🛣️" source="Search API · along-route"    prompt="TomTom-red route arc on a dark map with three fuel-station icons sitting inside the corridor, each shown as a blue circle. A caption reads '3 fuel stations · within 2 km deviation' to communicate the detour tolerance." illoStyle={illoStyle}/>
          <IlloCard dark={IlloSearchAutocomplete} icon={IcoSearchAutocomplete} light={L_SearchAutocomplete} label="Autocomplete"         emoji="⌨️" source="Search API · autocomplete"   prompt="Search input showing partial text 'Amster|' with a cursor and three ranked dropdown suggestions (airport, centre, Noord). A 'Debounce 300ms' footer communicates the real-time typeahead request cadence." illoStyle={illoStyle}/>
        </div>
      </div>

      {/* ── Geocoding API ── */}
      <div className="zone">
        <SectionHeader
          emoji="📌"
          title="Geocoding API"
          subtitle="Convert addresses to coordinates and coordinates back to human-readable addresses."
          color="#a78bfa"
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          <IlloCard dark={IlloGeocode} icon={IcoGeocode}        light={L_Geocode}        label="Geocode"         emoji="📌" source="Geocoding API · geocode"         prompt="Two stacked cards connected by a downward arrow: address text on top ('Hullenbergweg 11, Amsterdam'), coordinate output below ('52.2977°N 4.9418°E') with a confidence score. The card-to-card layout visualises the one-way text-to-coordinates transformation." illoStyle={illoStyle}/>
          <IlloCard dark={IlloReverseGeocode} icon={IcoReverseGeocode} light={L_ReverseGeocode} label="Reverse Geocode" emoji="🔄" source="Geocoding API · reverse-geocode" prompt="Miniature map with a red pin at a lat/lon crosshair intersection, with coordinate labels on the axes and an output address card below. The map-to-text layout communicates the inverse geocoding direction clearly." illoStyle={illoStyle}/>
        </div>
      </div>

      {/* ── Traffic API ── */}
      <div className="zone">
        <SectionHeader
          emoji="🚦"
          title="Traffic API"
          subtitle="Live and historical traffic flow, incidents, tiles and model versioning."
          color="#ef4444"
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          <IlloCard dark={IlloTrafficFlow} icon={IcoTrafficFlow}      light={L_TrafficFlow}      label="Traffic Flow"      emoji="🟢" source="Traffic API · flow"       prompt="Four equal-length horizontal bars colour-coded green → amber → orange → red, each labelled with a km/h speed and a congestion description. Bar length is constant; only colour encodes severity to maximise legibility at small size." illoStyle={illoStyle}/>
          <IlloCard dark={IlloTrafficIncidents} icon={IcoTrafficIncidents} light={L_TrafficIncidents} label="Traffic Incidents" emoji="⚠️" source="Traffic API · incidents"  prompt="Three incident rows — roadworks, accident, road closure — each with an emoji icon, type name in a severity colour and a road/km reference. The list directly mirrors the structured incident feed the API returns for a bounding box." illoStyle={illoStyle}/>
          <IlloCard dark={IlloTrafficFlowTile} icon={IcoTrafficFlowTile}  light={L_TrafficFlowTile}  label="Flow Tile"         emoji="🗺️" source="Traffic API · flow-tile"  prompt="4×3 mosaic of colour blocks ranging green to red representing flow-speed intensity across adjacent 256×256 map tiles. A z/x/y coordinate header and 'PNG · traffic overlay' footer identify this as the raster tile endpoint." illoStyle={illoStyle}/>
          <IlloCard dark={IlloTrafficModelID} icon={IcoTrafficModelID}   light={L_TrafficModelID}   label="Traffic Model ID"  emoji="🔢" source="Traffic API · model-id"   prompt="A large model ID (#1680) in a highlighted card with an update timestamp, flanked by two older version badges in muted style. The visual communicates the polling pattern: check for a new model ID, then fetch fresh flow data only if it changed." illoStyle={illoStyle}/>
        </div>
      </div>

      {/* ── EV & Charging API ── */}
      <div className="zone">
        <SectionHeader
          emoji="⚡"
          title="EV & Charging API"
          subtitle="EV-specific search endpoints: nearby stations, connector availability and market coverage."
          color="#22c55e"
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          <IlloCard dark={IlloEVSearchNearby} icon={IcoEVSearchNearby}          light={L_EVSearchNearby}          label="EV Stations Nearby"      emoji="⚡" source="EV API · nearby"          prompt="Compact list of three charging operators with power rating and coloured availability text (green = available, red = full). The ⚡ dot icons adopt the availability colour as status signal, matching EV app conventions." illoStyle={illoStyle}/>
          <IlloCard dark={IlloEVChargingAvailability} icon={IcoEVChargingAvailability}  light={L_EVChargingAvailability}  label="Charging Availability"   emoji="🔌" source="EV API · availability"    prompt="Four connector-type rows (CCS2, Type2, CHAdeMO, CCS2) each with a coloured status dot and a label (Available, Charging, Offline). The table communicates per-connector granularity, not just per-station availability." illoStyle={illoStyle}/>
          <IlloCard dark={IlloEVMarketCoverage} icon={IcoAreaAnalytics}        light={L_EVMarketCoverage}        label="EV Market Coverage"      emoji="🗺️" source="EV API · market-coverage" prompt="Vertical list of five countries with percentage coverage bars graduating from green (high density) to orange (low density). The bars communicate relative EV charging network completeness across the TomTom data footprint." illoStyle={illoStyle}/>
        </div>
      </div>

      {/* ── Map Display API ── */}
      <div className="zone">
        <SectionHeader
          emoji="🗺️"
          title="Map Display API"
          subtitle="Raster tiles, vector tiles, satellite imagery, map assets and static image generation."
          color="#0066cc"
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          <IlloCard dark={IlloMapRasterTile} icon={IcoMapRasterTile}   light={L_MapRasterTile}   label="Raster Map Tile"   emoji="🟦" source="Map Display API · raster"  prompt="3×3 mosaic of dark map tile blocks, the centre cell featuring a red location pin and a glow. A z/x/y coordinate header and 'PNG · 256×256' footer frame this as a standard slippy-map tile request." illoStyle={illoStyle}/>
          <IlloCard dark={IlloMapVectorTile} icon={IcoMapVectorTile}   light={L_MapVectorTile}   label="Vector Map Tile"   emoji="📐" source="Map Display API · vector"  prompt="Stylised vector map showing road lines, building footprint rectangles and a red POI circle on a dark canvas. Layer badges at the bottom (roads, labels, pois) communicate that vector tiles are multi-layer and styleable on the client." illoStyle={illoStyle}/>
          <IlloCard dark={IlloMapSatelliteTile} icon={IcoMapSatelliteTile} light={L_MapSatelliteTile} label="Satellite Tile"  emoji="🛰️" source="Map Display API · satellite" prompt="Simulated aerial photograph tile with irregular building footprints in muted earthy tones and a road corridor crossing the frame. The organic, non-geometric shapes contrast with vector tiles and communicate real-world imagery data." illoStyle={illoStyle}/>
          <IlloCard dark={IlloMapAssetsAPI} icon={IcoMapDisplay}    light={L_MapAssetsAPI}    label="Map Assets API"    emoji="📦" source="Map Display API · assets"  prompt="File-list card showing four named map asset files — day/night sprite sheets, font PBF and style JSON — with file sizes. The file-explorer layout communicates that the endpoint delivers discrete assets consumed by a map renderer." illoStyle={illoStyle}/>
          <IlloCard dark={IlloMapStaticImage} icon={IcoMapStaticImage}  light={L_MapStaticImage}  label="Static Map Image"  emoji="🖼️" source="Map Display API · static"  prompt="Dark map thumbnail with a red pin at centre, a glow halo and a dashed bounding-box border. The '600×400 · zoom=14' caption communicates the parameterised static-image request format." illoStyle={illoStyle}/>
        </div>
      </div>

      {/* ── Parking & Fuel API ── */}
      <div className="zone">
        <SectionHeader
          emoji="🅿️"
          title="Parking & Fuel API"
          subtitle="Real-time parking availability and prices, on-street kerbside predictions, and fuel station pricing."
          color="#fbbf24"
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          <IlloCard dark={IlloParkingAvailability} icon={IcoParkingAvailability} light={L_ParkingAvailability} label="Parking Availability" emoji="🅿️" source="Parking API · availability" prompt="Four parking zones each with a name, a used/capacity fraction and a colour-coded percentage bar (green = space, red = full). Bar colour is the primary signal; the fraction provides the precise data." illoStyle={illoStyle}/>
          <IlloCard dark={IlloParkingPrices} icon={IcoParkingPrices}       light={L_ParkingPrices}       label="Parking Prices"       emoji="💶" source="Parking API · prices"       prompt="Duration-tiered price table (0–1 hr, 1–3 hr, 3–8 hr, all day) with the lowest tier highlighted and prices right-aligned. Payment method badges at the bottom (card, contactless, cash) show accepted payment types." illoStyle={illoStyle}/>
          <IlloCard dark={IlloOnStreetParking} icon={IcoOnStreetParking}     light={L_OnStreetParking}     label="On-Street Parking"    emoji="🚗" source="Parking API · on-street"    prompt="Bird's-eye road cross-section with kerbside segments coloured green, amber and red for predicted availability probability on both sides of the road. A legend strip maps the three states: Available, Limited, Restricted." illoStyle={illoStyle}/>
          <IlloCard dark={IlloFuelPrices} icon={IcoFuelPrices}          light={L_FuelPrices}          label="Fuel Prices"          emoji="⛽" source="Fuel Prices API · prices"  prompt="Fuel-type list (Unleaded, Diesel, LPG, Fast DC) with each price right-aligned in a distinct accent colour. Station name and distance above the list frame this as a single-station detail card, not a comparison view." illoStyle={illoStyle}/>
        </div>
      </div>

      {/* ── Snap to Roads ── */}
      <div className="zone">
        <SectionHeader
          emoji="📍"
          title="Snap to Roads API"
          subtitle="Correct noisy GPS traces by snapping points to the nearest road geometry."
          color="#3fb950"
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          <IlloCard dark={IlloSnapToRoads} icon={IcoSnapToRoads} light={L_SnapToRoads} label="Snap to Roads" emoji="📍" source="Snap-to-Roads API · snap" prompt="Road path with blue snapped points sitting on the line and faint grey raw-GPS points offset beside them, connected by short correction lines. The before/after proximity shows the sub-metre correction the API applies to noisy trace data." illoStyle={illoStyle}/>
        </div>
      </div>

      {/* ── Batch Search ── */}
      <div className="zone">
        <SectionHeader
          emoji="📦"
          title="Batch Search API"
          subtitle="Send multiple search queries in a single HTTP request and receive all results in one response."
          color="#58a6ff"
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          <IlloCard dark={IlloBatchSearch} icon={IcoSearchFuzzy} light={L_BatchSearch} label="Batch Search" emoji="📦" source="Batch Search API · batch" prompt="Four query rows each showing a search description, result count and a status dot (green = hit, red = zero results). A footer shows total elapsed time — all four queries resolving in a single round-trip under 250ms." illoStyle={illoStyle}/>
        </div>
      </div>

      {/* ── POI Details & Photos ── */}
      <div className="zone">
        <SectionHeader
          emoji="🏢"
          title="POI Details & Photos"
          subtitle="Rich point-of-interest metadata including contact details, opening hours, and crowd-sourced photos."
          color="#a78bfa"
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          <IlloCard dark={IlloPOIDetails} icon={IcoPOIDetails} light={L_POIDetails} label="POI Details" emoji="🏢" source="POI API · details" prompt="Hotel POI card with brand icon, star rating and four structured data rows — phone, website, opening hours, accessibility. The row layout reflects the rich JSON fields the Details endpoint returns beyond basic name and coordinates." illoStyle={illoStyle}/>
          <IlloCard dark={IlloPOIPhotos} icon={IcoPOIPhotos}  light={L_POIPhotos}  label="POI Photos"  emoji="📷" source="POI API · photos"  prompt="3×2 photo-grid mosaic with each cell showing an emoji representing a scene category (exterior, dining, lobby, garden, pool, gym). The grid communicates that photos are categorised and available at defined sizes via the API." illoStyle={illoStyle}/>
        </div>
      </div>

      {/* ── Traffic Analytics ── */}
      <div className="zone">
        <SectionHeader
          emoji="📊"
          title="Traffic Analytics"
          subtitle="Historical traffic statistics, area analytics heatmaps, origin/destination flow matrices and junction counts."
          color="#e2001a"
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          <IlloCard dark={IlloTrafficStats} icon={IcoTrafficStats}      light={L_TrafficStats}      label="Traffic Statistics"  emoji="📊" source="Traffic Analytics · stats"    prompt="Bar chart of 12 bars spanning a week, coloured blue/amber/red by speed bucket to show the typical daily congestion pattern. Day-of-week labels and a muted title communicate this is historical (not live) analytics data." illoStyle={illoStyle}/>
          <IlloCard dark={IlloAreaAnalytics} icon={IcoAreaAnalytics}     light={L_AreaAnalytics}     label="Area Analytics"      emoji="🔥" source="Traffic Analytics · area"     prompt="4×4 heatmap grid with red-intensity cells representing aggregated traffic density per micro-zone, plus a Low→High gradient legend strip. The grid is the simplest encoding of spatial density without any geographic basemap." illoStyle={illoStyle}/>
          <IlloCard dark={IlloODAnalysis} icon={IcoODAnalysis}        light={L_ODAnalysis}        label="O/D Analysis"        emoji="🔄" source="Traffic Analytics · od"       prompt="4×4 origin/destination matrix with blue-intensity cells showing flow volume between zone pairs and grey diagonal cells for same-zone trips. Row and column headers A–D communicate the zone-pair addressing model." illoStyle={illoStyle}/>
          <IlloCard dark={IlloJunctionAnalytics} icon={IcoJunctionAnalytics} light={L_JunctionAnalytics} label="Junction Analytics"  emoji="🔀" source="Traffic Analytics · junction" prompt="Crossroads diagram with four directional arrows and vehicle-per-hour counts (340, 280, 190, 420) annotated at each arm, plus a blue junction circle. The per-approach flow counts communicate single-junction monitoring granularity." illoStyle={illoStyle}/>
        </div>
      </div>

      {/* ── Style notes ── */}
      <div className="zone">
        <h2 className="sh" id="style-notes">Illustration style notes</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
          {[
            ['🎨', 'Dark backgrounds', 'All illustrations use dark map/app canvases. Primary: #0d1117, #1a2535, #0c1318. Light-mode illustrations (e.g. Colour system) are the exception.'],
            ['🔴', 'TomTom Red routes', 'Active routes use #e2001a with a low-opacity glow halo (rgba(226,0,26,0.15–0.2)) at 8–9 px width.'],
            ['🟢', 'Status greens', 'Available, success, and charging states use #3fb950 (brand) or #22c55e (brighter accent). Battery charges are #22c55e → #3fb950 gradient.'],
            ['🔵', 'Data / info accents', '#58a6ff for neutral data, #a78bfa for AI/assistant features, #fbbf24 for warnings and horizon events.'],
            ['📐', 'Corner radius', 'All illustration containers and inner panels use borderRadius: 20. Inner cards use 4–6 px.'],
            ['✏️', 'Typography scale', 'Labels: 0.5rem (8px). Values: 0.625–0.875rem. Section heads: 0.75rem bold. All use system-ui or monospace.'],
            ['🔡', 'Emoji anchors', 'Emoji icons (⚡ 🔌 🔍 🚗 ↖ etc.) are used at 0.875–1rem as compact, recognisable symbols inside illustrations.'],
            ['📦', 'viewBox convention', 'SVG maps use viewBox="0 0 200 130". Mini UI diagrams use 80×90 or smaller. Always proportional.'],
          ].map(([emoji, title, desc]) => (
            <div key={title} style={{ border: '1px solid var(--border)', borderRadius: 20, padding: '14px 16px', background: 'var(--surface)' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 6 }}>
                <span style={{ fontSize: '1rem', lineHeight: 1.2 }}>{emoji}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)' }}>{title}</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.55 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
      </div>{/* /padding wrapper */}
    </div>
    </RegenerateCtx.Provider>
  );
}
