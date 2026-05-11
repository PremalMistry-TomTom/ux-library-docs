/* ─────────────────────────────────────────────────────────────────────────────
 * TryItDemos — plumbing page: every MCP-covered + REST-fetch endpoint in one place.
 *
 * Visual output tiers (per demo):
 *   mapCenter(result, fields)   → calls Static Image API, renders inline map
 *   tileUrl(fields, key)        → renders tile directly as <img> (no fetch)
 *   imageUrl(fields, key)       → renders static image as <img> (no fetch)
 *   tableRows(result)           → renders a summary table (analytics/matrix)
 *   renderMode badge            → 'map' | 'tile' | 'image' | 'table' | 'sdk' | 'json'
 *
 * Demos marked draft:true have unverified endpoint URLs — check API docs.
 * ───────────────────────────────────────────────────────────────────────────── */

import { useState, useEffect, useRef } from 'react';

const LS_KEY = 'tt-demo-api-key';

/* ─── Style maps ─────────────────────────────────────────────────────────────── */
const PRODUCT_STYLES = {
  'Search API':         { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
  'Geocoding API':      { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d' },
  'Routing API':        { bg: '#fff7ed', border: '#fed7aa', text: '#c2410c' },
  'Traffic API':        { bg: '#fff1f2', border: '#fecdd3', text: '#be123c' },
  'Traffic Analytics':  { bg: '#fdf4ff', border: '#e9d5ff', text: '#7e22ce' },
  'Map Display API':    { bg: '#f0f9ff', border: '#bae6fd', text: '#0369a1' },
  'EV Charging API':    { bg: '#ecfdf5', border: '#a7f3d0', text: '#065f46' },
  'LDEVR':              { bg: '#f5f3ff', border: '#ddd6fe', text: '#6d28d9' },
  'Parking & Fuel API': { bg: '#fefce8', border: '#fde68a', text: '#854d0e' },
  'Snap to Roads':      { bg: '#fff1f2', border: '#fecdd3', text: '#9f1239' },
  'Matrix Routing':     { bg: '#f8fafc', border: '#cbd5e1', text: '#334155' },
  'Waypoint API':       { bg: '#f0fdfa', border: '#99f6e4', text: '#0f766e' },
};

const METHOD_STYLES = {
  GET:  { bg: '#dcfce7', text: '#166534' },
  POST: { bg: '#fef9c3', text: '#854d0e' },
};

const RENDER_BADGES = {
  'sdk-map':     { label: '⚡ SDK Map',  bg: '#f0fdf4', text: '#15803d' },
  'sdk-polygon': { label: '⚡ SDK Map',  bg: '#f0fdf4', text: '#15803d' },
  tile:          { label: '◻ Tile',     bg: '#f0f9ff', text: '#0369a1' },
  image:         { label: '🖼 Image',   bg: '#f5f3ff', text: '#6d28d9' },
  table:         { label: '▦ Table',    bg: '#fff7ed', text: '#c2410c' },
  sdk:           { label: '⚡ SDK',     bg: '#fdf4ff', text: '#7e22ce' },
  card:          { label: '▤ Card',     bg: '#fefce8', text: '#854d0e' },
  json:          { label: '{ } JSON',   bg: '#f1f5f9', text: '#475569' },
};

/* ─── Helpers ────────────────────────────────────────────────────────────────── */
/** Round coloured marker element for TomTom SDK. */
function markerEl(color, label) {
  const el = document.createElement('div');
  el.style.cssText = `width:26px;height:26px;border-radius:50%;background:${color};color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.5625rem;font-weight:800;font-family:sans-serif;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.35);cursor:default;line-height:1;`;
  el.textContent = label;
  return el;
}

/** Add a GeoJSON LineString route layer to an SDK map. */
function addRouteLine(map, coordinates, color = '#0066cc', width = 4, id = 'route') {
  if (!coordinates?.length) return;
  map.addSource(id, { type: 'geojson', data: { type: 'Feature', geometry: { type: 'LineString', coordinates } } });
  map.addLayer({ id: `${id}-casing`, type: 'line', source: id, paint: { 'line-color': '#fff', 'line-width': width + 3, 'line-opacity': 0.6 } });
  map.addLayer({ id, type: 'line', source: id, paint: { 'line-color': color, 'line-width': width, 'line-opacity': 0.9 } });
}

/** Fit an SDK map to an array of [lon, lat] pairs. */
function fitBounds(map, tt, lngLats, padding = 60, maxZoom = 15) {
  if (!lngLats?.length) return;
  if (lngLats.length === 1) { map.setCenter(lngLats[0]); return; }
  const bounds = new tt.LngLatBounds();
  lngLats.forEach(p => bounds.extend(p));
  map.fitBounds(bounds, { padding, maxZoom });
}

function staticMapUrl(key, lon, lat, zoom = 13, w = 600, h = 260) {
  return `https://api.tomtom.com/map/1/staticimage?key=${key}&center=${lon},${lat}&zoom=${zoom}&width=${w}&height=${h}&layer=basic&style=main&format=png`;
}

function midpoint(a, b) { return (a + b) / 2; }

function parseLatLon(str) {
  const [lat, lon] = str.split(',').map(s => parseFloat(s.trim()));
  return { lat, lon };
}

/* ─── Demo definitions ───────────────────────────────────────────────────────── */
const DEMOS = [

  /* ════════════════════ SEARCH API ════════════════════ */
  {
    id: 'fuzzy-search', product: 'Search API', endpoint: 'Fuzzy Search',
    method: 'GET', renderMode: 'sdk-map',
    description: 'Typo-tolerant search across addresses, POIs and geographies.',
    fields: [
      { id: 'query', label: 'Query', placeholder: 'Amsterdam Centraal', defaultValue: 'Amsterdam Centraal', flex: true },
      { id: 'limit', label: 'Limit', placeholder: '5', defaultValue: '5', width: 60 },
    ],
    run: async ({ query, limit }, key) => {
      const r = await fetch(`https://api.tomtom.com/search/2/search/${encodeURIComponent(query)}.json?key=${key}&limit=${limit || 5}`);
      return r.json();
    },
    sdkCenter: (result) => { const p = result.results?.[0]?.position; return p ? { lon: p.lon, lat: p.lat, zoom: 12 } : null; },
    sdkSetup: (map, tt, result) => {
      const results = result?.results || [];
      const lngs = [];
      results.forEach((r, i) => {
        const { lon, lat } = r.position;
        lngs.push([lon, lat]);
        new tt.Marker({ element: markerEl('#e2001a', String(i + 1)) })
          .setLngLat([lon, lat])
          .setPopup(new tt.Popup({ offset: 16 }).setText(r.poi?.name || r.address?.freeformAddress || `Result ${i + 1}`))
          .addTo(map);
      });
      fitBounds(map, tt, lngs);
    },
  },
  {
    id: 'poi-search', product: 'Search API', endpoint: 'POI Search',
    method: 'GET', renderMode: 'sdk-map',
    description: 'Search for a specific business or POI by name with location bias.',
    fields: [
      { id: 'query',  label: 'Name',       placeholder: 'Starbucks', defaultValue: 'Starbucks', flex: true },
      { id: 'lat',    label: 'Lat',        placeholder: '52.3676',   defaultValue: '52.3676',   width: 90 },
      { id: 'lon',    label: 'Lon',        placeholder: '4.9041',    defaultValue: '4.9041',    width: 90 },
      { id: 'radius', label: 'Radius (m)', placeholder: '10000',     defaultValue: '10000',     width: 90 },
    ],
    run: async ({ query, lat, lon, radius }, key) => {
      const r = await fetch(`https://api.tomtom.com/search/2/poiSearch/${encodeURIComponent(query)}.json?key=${key}&lat=${lat}&lon=${lon}&radius=${radius || 10000}&limit=8`);
      return r.json();
    },
    sdkCenter: (_, { lat, lon }) => ({ lon: parseFloat(lon), lat: parseFloat(lat), zoom: 12 }),
    sdkSetup: (map, tt, result, values) => {
      const results = result?.results || [];
      const cLon = parseFloat(values.lon), cLat = parseFloat(values.lat);
      new tt.Marker({ element: markerEl('#64748b', '◎') }).setLngLat([cLon, cLat]).addTo(map);
      const lngs = [[cLon, cLat]];
      results.forEach((r, i) => {
        const { lon, lat } = r.position;
        lngs.push([lon, lat]);
        new tt.Marker({ element: markerEl('#e2001a', String(i + 1)) })
          .setLngLat([lon, lat])
          .setPopup(new tt.Popup({ offset: 16 }).setText(r.poi?.name || `Result ${i + 1}`))
          .addTo(map);
      });
      fitBounds(map, tt, lngs);
    },
  },
  {
    id: 'nearby-search', product: 'Search API', endpoint: 'Nearby Search',
    method: 'GET', renderMode: 'sdk-map',
    description: 'Find all places within a radius of a coordinate, sorted by distance.',
    fields: [
      { id: 'lat',    label: 'Lat',        placeholder: '52.3676', defaultValue: '52.3676', width: 100 },
      { id: 'lon',    label: 'Lon',        placeholder: '4.9041',  defaultValue: '4.9041',  width: 100 },
      { id: 'radius', label: 'Radius (m)', placeholder: '500',     defaultValue: '500',     width: 90  },
      { id: 'limit',  label: 'Limit',      placeholder: '10',      defaultValue: '10',      width: 60  },
    ],
    run: async ({ lat, lon, radius, limit }, key) => {
      const r = await fetch(`https://api.tomtom.com/search/2/nearbySearch/.json?key=${key}&lat=${lat}&lon=${lon}&radius=${radius || 500}&limit=${limit || 10}`);
      return r.json();
    },
    sdkCenter: (_, { lat, lon }) => ({ lon: parseFloat(lon), lat: parseFloat(lat), zoom: 15 }),
    sdkSetup: (map, tt, result, values) => {
      const results = result?.results || [];
      const cLon = parseFloat(values.lon), cLat = parseFloat(values.lat);
      new tt.Marker({ element: markerEl('#64748b', '◎') }).setLngLat([cLon, cLat]).addTo(map);
      const lngs = [[cLon, cLat]];
      results.forEach((r, i) => {
        const { lon, lat } = r.position;
        lngs.push([lon, lat]);
        const cat = r.poi?.categories?.[0] || '';
        new tt.Marker({ element: markerEl('#0369a1', String(i + 1)) })
          .setLngLat([lon, lat])
          .setPopup(new tt.Popup({ offset: 16 }).setText(r.poi?.name || cat || `Result ${i + 1}`))
          .addTo(map);
      });
      fitBounds(map, tt, lngs);
    },
  },
  {
    id: 'along-route-search', product: 'Search API', endpoint: 'Along-Route Search',
    method: 'POST', renderMode: 'sdk-map',
    description: 'Find POIs within a corridor along a calculated route between two points.',
    note: 'Makes two API calls: calculate route → search along it.',
    fields: [
      { id: 'query',       label: 'Query',           placeholder: 'coffee',         defaultValue: 'coffee',         width: 100 },
      { id: 'origin',      label: 'Origin (lat,lon)', placeholder: '52.3676,4.9041', defaultValue: '52.3676,4.9041', flex: true },
      { id: 'destination', label: 'Dest (lat,lon)',   placeholder: '52.0705,4.3007', defaultValue: '52.0705,4.3007', flex: true },
    ],
    run: async ({ query, origin, destination }, key) => {
      const { lat: oLat, lon: oLon } = parseLatLon(origin);
      const { lat: dLat, lon: dLon } = parseLatLon(destination);
      const routeRes = await fetch(`https://api.tomtom.com/routing/1/calculateRoute/${oLat},${oLon}:${dLat},${dLon}/json?key=${key}&routeRepresentation=polyline&computeTravelTimeFor=none`);
      const routeData = await routeRes.json();
      const pts = routeData.routes[0].legs[0].points;
      const points = pts.map(p => ({ lat: p.latitude, lon: p.longitude }));
      const r = await fetch(`https://api.tomtom.com/search/2/searchAlongRoute/${encodeURIComponent(query)}.json?key=${key}&maxDetourTime=1200&limit=5`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ route: { points } }) });
      const data = await r.json();
      data._routeCoords = pts.map(p => [p.longitude, p.latitude]);
      return data;
    },
    sdkCenter: (_, { origin, destination }) => {
      const { lat: oLat, lon: oLon } = parseLatLon(origin);
      const { lat: dLat, lon: dLon } = parseLatLon(destination);
      return { lon: midpoint(oLon, dLon), lat: midpoint(oLat, dLat), zoom: 9 };
    },
    sdkSetup: (map, tt, result, values) => {
      addRouteLine(map, result._routeCoords, '#0066cc', 3);
      const { lat: oLat, lon: oLon } = parseLatLon(values.origin);
      const { lat: dLat, lon: dLon } = parseLatLon(values.destination);
      new tt.Marker({ element: markerEl('#15803d', 'A') }).setLngLat([oLon, oLat]).addTo(map);
      new tt.Marker({ element: markerEl('#be123c', 'B') }).setLngLat([dLon, dLat]).addTo(map);
      const lngs = [[oLon, oLat], [dLon, dLat]];
      (result.results || []).forEach((r, i) => {
        const { lon, lat } = r.position;
        lngs.push([lon, lat]);
        new tt.Marker({ element: markerEl('#b45309', String(i + 1)) })
          .setLngLat([lon, lat])
          .setPopup(new tt.Popup({ offset: 16 }).setText(r.poi?.name || `POI ${i + 1}`))
          .addTo(map);
      });
      fitBounds(map, tt, lngs, 50, 13);
    },
  },
  {
    id: 'autocomplete', product: 'Search API', endpoint: 'Autocomplete',
    method: 'GET', renderMode: 'card',
    description: 'Returns query completion suggestions as the user types. Powers search-as-you-type UI.',
    fields: [
      { id: 'query',    label: 'Partial query', placeholder: 'Amster', defaultValue: 'Amster',   flex: true },
      { id: 'language', label: 'Language',      placeholder: 'en-US',  defaultValue: 'en-US',    width: 80  },
    ],
    run: async ({ query, language }, key) => {
      const r = await fetch(`https://api.tomtom.com/search/2/autocomplete/${encodeURIComponent(query)}.json?key=${key}&language=${language || 'en-US'}&limit=8`);
      return r.json();
    },
  },
  {
    id: 'batch-search', product: 'Search API', endpoint: 'Batch Search',
    method: 'POST', renderMode: 'json',
    description: 'Run multiple search queries in a single request and get batched responses.',
    fields: [
      { id: 'q1', label: 'Query 1', placeholder: 'Pizza Amsterdam',  defaultValue: 'Pizza Amsterdam',  flex: true },
      { id: 'q2', label: 'Query 2', placeholder: 'Hotels Rotterdam', defaultValue: 'Hotels Rotterdam', flex: true },
    ],
    run: async ({ q1, q2 }, key) => {
      const r = await fetch(`https://api.tomtom.com/search/2/batch/sync.json?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchItems: [
          { query: `/search/2/search/${encodeURIComponent(q1)}.json?limit=3` },
          { query: `/search/2/search/${encodeURIComponent(q2)}.json?limit=3` },
        ]}),
      });
      return r.json();
    },
  },
  {
    id: 'poi-details', product: 'Search API', endpoint: 'POI Details',
    method: 'GET', renderMode: 'card',
    description: 'Fetch rich details for a specific POI by entity ID — hours, phone, website, categories.',
    note: 'Requires an entityId from a Fuzzy or POI search result.',
    fields: [
      { id: 'entityId', label: 'Entity ID', placeholder: 'NLD/poi/p0/1001837', defaultValue: 'NLD/poi/p0/1001837', flex: true },
    ],
    run: async ({ entityId }, key) => {
      const r = await fetch(`https://api.tomtom.com/search/2/place.json?key=${key}&entityId=${encodeURIComponent(entityId)}`);
      return r.json();
    },
  },
  {
    id: 'poi-photos', product: 'Search API', endpoint: 'POI Photos',
    method: 'GET', renderMode: 'image',
    description: 'Returns photo URLs for a POI. Renders as an inline image gallery.',
    note: 'Requires an entityId. Photo availability varies by location.',
    fields: [
      { id: 'entityId', label: 'Entity ID', placeholder: 'NLD/poi/p0/1001837', defaultValue: 'NLD/poi/p0/1001837', flex: true },
    ],
    run: async ({ entityId }, key) => {
      const r = await fetch(`https://api.tomtom.com/search/2/poiPhotos/${encodeURIComponent(entityId)}?key=${key}&width=400`);
      return r.json();
    },
  },

  /* ════════════════════ GEOCODING API ════════════════════ */
  {
    id: 'geocode', product: 'Geocoding API', endpoint: 'Geocode',
    method: 'GET', renderMode: 'sdk-map',
    description: 'Convert a street address or place name to geographic coordinates.',
    fields: [
      { id: 'address', label: 'Address', placeholder: 'Eiffel Tower, Paris', defaultValue: 'Eiffel Tower, Paris', flex: true },
      { id: 'limit',   label: 'Limit',   placeholder: '3', defaultValue: '3', width: 60 },
    ],
    run: async ({ address, limit }, key) => {
      const r = await fetch(`https://api.tomtom.com/search/2/geocode/${encodeURIComponent(address)}.json?key=${key}&limit=${limit || 3}`);
      return r.json();
    },
    sdkCenter: (result) => { const p = result.results?.[0]?.position; return p ? { lon: p.lon, lat: p.lat, zoom: 14 } : null; },
    sdkSetup: (map, tt, result) => {
      const results = result?.results || [];
      const lngs = [];
      results.forEach((r, i) => {
        const { lon, lat } = r.position;
        lngs.push([lon, lat]);
        new tt.Marker({ element: markerEl('#e2001a', String(i + 1)) })
          .setLngLat([lon, lat])
          .setPopup(new tt.Popup({ offset: 16 }).setText(r.address?.freeformAddress || `Result ${i + 1}`))
          .addTo(map);
      });
      fitBounds(map, tt, lngs, 80, 16);
    },
  },
  {
    id: 'reverse-geocode', product: 'Geocoding API', endpoint: 'Reverse Geocode',
    method: 'GET', renderMode: 'sdk-map',
    description: 'Convert geographic coordinates to a human-readable street address.',
    fields: [
      { id: 'lat', label: 'Lat', placeholder: '48.8584', defaultValue: '48.8584', width: 120 },
      { id: 'lon', label: 'Lon', placeholder: '2.2945',  defaultValue: '2.2945',  width: 120 },
    ],
    run: async ({ lat, lon }, key) => {
      const r = await fetch(`https://api.tomtom.com/search/2/reverseGeocode/${lat},${lon}.json?key=${key}`);
      return r.json();
    },
    sdkCenter: (_, { lat, lon }) => ({ lon: parseFloat(lon), lat: parseFloat(lat), zoom: 16 }),
    sdkSetup: (map, tt, result, values) => {
      const lon = parseFloat(values.lon), lat = parseFloat(values.lat);
      const addr = result.addresses?.[0]?.address?.freeformAddress || 'Location';
      new tt.Marker({ element: markerEl('#e2001a', '📍') })
        .setLngLat([lon, lat])
        .setPopup(new tt.Popup({ offset: 16 }).setText(addr))
        .addTo(map);
      map.setCenter([lon, lat]);
      map.setZoom(16);
    },
  },

  /* ════════════════════ ROUTING API ════════════════════ */
  {
    id: 'calculate-route', product: 'Routing API', endpoint: 'Calculate Route',
    method: 'GET', renderMode: 'sdk-map',
    description: 'Calculate the optimal route between an origin and destination with live traffic.',
    fields: [
      { id: 'origin',      label: 'Origin (lat,lon)',      placeholder: '52.3676,4.9041',  defaultValue: '52.3676,4.9041',  flex: true },
      { id: 'destination', label: 'Destination (lat,lon)', placeholder: '51.5074,-0.1278', defaultValue: '51.5074,-0.1278', flex: true },
      { id: 'travelMode',  label: 'Mode',                  placeholder: 'car',              defaultValue: 'car',             width: 80  },
    ],
    run: async ({ origin, destination, travelMode }, key) => {
      const r = await fetch(`https://api.tomtom.com/routing/1/calculateRoute/${origin}:${destination}/json?key=${key}&travelMode=${travelMode || 'car'}&traffic=true`);
      return r.json();
    },
    sdkCenter: (_, { origin }) => { const { lat, lon } = parseLatLon(origin); return { lon, lat, zoom: 6 }; },
    sdkSetup: (map, tt, result, values) => {
      const pts = (result?.routes?.[0]?.legs || []).flatMap(leg => leg.points || []);
      const coords = pts.map(p => [p.longitude, p.latitude]);
      addRouteLine(map, coords, '#0066cc', 4);
      const { lat: oLat, lon: oLon } = parseLatLon(values.origin);
      const { lat: dLat, lon: dLon } = parseLatLon(values.destination);
      new tt.Marker({ element: markerEl('#15803d', 'A') }).setLngLat([oLon, oLat]).addTo(map);
      new tt.Marker({ element: markerEl('#e2001a', 'B') }).setLngLat([dLon, dLat]).addTo(map);
      fitBounds(map, tt, [[oLon, oLat], [dLon, dLat], ...coords.filter((_, i) => i % 20 === 0)], 60, 13);
    },
  },
  {
    id: 'reachable-range', product: 'Routing API', endpoint: 'Reachable Range',
    method: 'GET', renderMode: 'sdk-polygon',
    description: 'Calculate the polygon of area reachable within a time or distance budget. Rendered as a live isochrone overlay using the Maps Web SDK.',
    fields: [
      { id: 'lat',        label: 'Origin Lat', placeholder: '52.3676', defaultValue: '52.3676', width: 110 },
      { id: 'lon',        label: 'Origin Lon', placeholder: '4.9041',  defaultValue: '4.9041',  width: 110 },
      { id: 'timeBudget', label: 'Time (sec)', placeholder: '1800',    defaultValue: '1800',    width: 100 },
    ],
    run: async ({ lat, lon, timeBudget }, key) => {
      const r = await fetch(`https://api.tomtom.com/routing/1/calculateReachableRange/${lat},${lon}/json?key=${key}&timeBudgetInSec=${timeBudget || 1800}`);
      return r.json();
    },
  },
  {
    id: 'turn-by-turn', product: 'Routing API', endpoint: 'Turn-by-Turn Instructions',
    method: 'GET', renderMode: 'table',
    description: 'Returns step-by-step manoeuvre instructions for a route in text or coded format.',
    fields: [
      { id: 'origin',      label: 'Origin (lat,lon)',      placeholder: '52.3676,4.9041',  defaultValue: '52.3676,4.9041',  flex: true },
      { id: 'destination', label: 'Destination (lat,lon)', placeholder: '52.0705,4.3007',  defaultValue: '52.0705,4.3007',  flex: true },
    ],
    run: async ({ origin, destination }, key) => {
      const r = await fetch(`https://api.tomtom.com/routing/1/calculateRoute/${origin}:${destination}/json?key=${key}&travelMode=car&instructionsType=text`);
      return r.json();
    },
    tableRows: result => {
      const instructions = result?.routes?.[0]?.guidance?.instructions ?? [];
      const summary = result?.routes?.[0]?.summary;
      const rows = instructions.map((ins, i) => ({
        '#':            i + 1,
        'Instruction':  ins.message ?? ins.maneuver ?? '—',
        'Street':       ins.street || ins.roadNumbers?.join(' / ') || '—',
        'At (m)':       ins.routeOffsetInMeters?.toLocaleString() ?? '—',
        'Duration (s)': ins.travelTimeInSeconds ?? '—',
      }));
      if (summary && rows.length > 0) {
        const km = (summary.lengthInMeters / 1000).toFixed(1);
        const min = Math.round(summary.travelTimeInSeconds / 60);
        rows.push({
          '#':            '—',
          'Instruction':  `▸ Total route: ${km} km, ${min} min`,
          'Street':       '',
          'At (m)':       summary.lengthInMeters.toLocaleString(),
          'Duration (s)': summary.travelTimeInSeconds,
        });
      }
      return rows;
    },
  },
  {
    id: 'lane-guidance', product: 'Routing API', endpoint: 'Lane Guidance',
    method: 'GET', renderMode: 'card',
    description: 'Returns per-manoeuvre lane data — which lanes to use at each turn.',
    fields: [
      { id: 'origin',      label: 'Origin (lat,lon)',      placeholder: '52.3676,4.9041',  defaultValue: '52.3676,4.9041',  flex: true },
      { id: 'destination', label: 'Destination (lat,lon)', placeholder: '52.0705,4.3007',  defaultValue: '52.0705,4.3007',  flex: true },
    ],
    run: async ({ origin, destination }, key) => {
      const r = await fetch(`https://api.tomtom.com/routing/1/calculateRoute/${origin}:${destination}/json?key=${key}&travelMode=car&sectionType=lanes`);
      return r.json();
    },
  },
  {
    id: 'batch-routing', product: 'Routing API', endpoint: 'Batch Routing',
    method: 'POST', renderMode: 'json',
    description: 'Calculate multiple routes in a single request. Returns an array of route summaries.',
    fields: [
      { id: 'r1', label: 'Route 1 (origin:dest)', placeholder: '52.3676,4.9041:51.5074,-0.1278', defaultValue: '52.3676,4.9041:51.5074,-0.1278', flex: true },
      { id: 'r2', label: 'Route 2 (origin:dest)', placeholder: '48.8566,2.3522:52.5200,13.4050', defaultValue: '48.8566,2.3522:52.5200,13.4050', flex: true },
    ],
    run: async ({ r1, r2 }, key) => {
      const r = await fetch(`https://api.tomtom.com/routing/1/batch/sync.json?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchItems: [
          { query: `/routing/1/calculateRoute/${r1}/json?travelMode=car` },
          { query: `/routing/1/calculateRoute/${r2}/json?travelMode=car` },
        ]}),
      });
      return r.json();
    },
  },

  /* ════════════════════ TRAFFIC API ════════════════════ */
  {
    id: 'traffic-incidents', product: 'Traffic API', endpoint: 'Traffic Incidents',
    method: 'GET', renderMode: 'sdk-map',
    description: 'Fetch real-time traffic incidents within a geographic bounding box.',
    fields: [
      { id: 'bbox', label: 'Bounding box (minLon,minLat,maxLon,maxLat)', placeholder: '4.84,52.33,5.02,52.43', defaultValue: '4.84,52.33,5.02,52.43', flex: true },
    ],
    run: async ({ bbox }, key) => {
      const fields = encodeURIComponent('{incidents{type,geometry{type,coordinates},properties{iconCategory,magnitudeOfDelay,events{description,code},from,to,delay,roadNumbers}}}');
      const r = await fetch(`https://api.tomtom.com/traffic/services/5/incidentDetails?key=${key}&bbox=${bbox.trim()}&fields=${fields}&language=en-GB`);
      return r.json();
    },
    sdkCenter: (_, { bbox }) => {
      const [minLon, minLat, maxLon, maxLat] = bbox.split(',').map(Number);
      return { lon: midpoint(minLon, maxLon), lat: midpoint(minLat, maxLat), zoom: 12 };
    },
    sdkSetup: (map, tt, result, values) => {
      const incidents = result?.incidents || [];
      const lngs = [];
      incidents.forEach((inc) => {
        const coords = inc.geometry?.coordinates;
        if (!coords) return;
        const pt = Array.isArray(coords[0]) ? coords[Math.floor(coords.length / 2)] : coords;
        const [lon, lat] = pt;
        const sev = inc.properties?.magnitudeOfDelay ?? 0;
        const color = sev >= 4 ? '#dc2626' : sev >= 2 ? '#f59e0b' : '#6b7280';
        const desc = inc.properties?.events?.[0]?.description || inc.properties?.iconCategory || 'Incident';
        lngs.push([lon, lat]);
        new tt.Marker({ element: markerEl(color, '!') })
          .setLngLat([lon, lat])
          .setPopup(new tt.Popup({ offset: 16 }).setText(desc))
          .addTo(map);
      });
      /* bbox rectangle */
      const [minLon, minLat, maxLon, maxLat] = values.bbox.split(',').map(Number);
      map.addSource('bbox', { type: 'geojson', data: { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[minLon,minLat],[maxLon,minLat],[maxLon,maxLat],[minLon,maxLat],[minLon,minLat]]] } } });
      map.addLayer({ id: 'bbox-fill', type: 'fill', source: 'bbox', paint: { 'fill-color': '#0066cc', 'fill-opacity': 0.05 } });
      map.addLayer({ id: 'bbox-line', type: 'line', source: 'bbox', paint: { 'line-color': '#0066cc', 'line-width': 1.5, 'line-dasharray': [4, 3] } });
      fitBounds(map, tt, [[minLon, minLat], [maxLon, maxLat]], 40, 14);
    },
  },
  {
    id: 'traffic-flow', product: 'Traffic API', endpoint: 'Traffic Flow',
    method: 'GET', renderMode: 'card',
    description: 'Current traffic flow data for a road segment — speed, free-flow speed, confidence.',
    fields: [
      { id: 'lat',   label: 'Point Lat', placeholder: '52.41072',  defaultValue: '52.41072',  width: 120 },
      { id: 'lon',   label: 'Point Lon', placeholder: '4.84239',   defaultValue: '4.84239',   width: 120 },
      { id: 'zoom',  label: 'Zoom',      placeholder: '10',        defaultValue: '10',        width: 70  },
    ],
    run: async ({ lat, lon, zoom }, key) => {
      const r = await fetch(`https://api.tomtom.com/traffic/services/4/flowSegmentData/relative0/${zoom || 10}/json?key=${key}&point=${lat},${lon}&unit=KMPH`);
      return r.json();
    },
  },
  {
    id: 'traffic-model-id', product: 'Traffic API', endpoint: 'Traffic Model ID',
    method: 'GET', renderMode: 'json',
    description: 'Returns the current traffic model version ID — use to cache-bust traffic tile requests.',
    fields: [
      { id: 'bbox', label: 'Bounding box', placeholder: '4.84,52.33,5.02,52.43', defaultValue: '4.84,52.33,5.02,52.43', flex: true },
    ],
    run: async ({ bbox }, key) => {
      const [minLon, minLat, maxLon, maxLat] = bbox.split(',').map(Number);
      const r = await fetch(`https://api.tomtom.com/traffic/services/4/incidentViewport.json?key=${key}&boundingBox=${minLat},${minLon},${maxLat},${maxLon}&boundingZoom=11&overviewBox=${minLat},${minLon},${maxLat},${maxLon}&overviewZoom=5&copyright=false`);
      return r.json();
    },
  },

  /* ════════════════════ TRAFFIC ANALYTICS ════════════════════ */
  {
    id: 'traffic-stats', product: 'Traffic Analytics', endpoint: 'Traffic Stats',
    method: 'POST', renderMode: 'table', draft: true,
    description: 'Historical speed and travel time statistics along a road segment by time-of-day.',
    fields: [
      { id: 'origin',      label: 'Segment start (lat,lon)', placeholder: '52.3676,4.9041', defaultValue: '52.3676,4.9041', flex: true },
      { id: 'destination', label: 'Segment end (lat,lon)',   placeholder: '52.0705,4.3007', defaultValue: '52.0705,4.3007', flex: true },
    ],
    run: async ({ origin, destination }, key) => {
      const { lat: oLat, lon: oLon } = parseLatLon(origin);
      const { lat: dLat, lon: dLon } = parseLatLon(destination);
      const r = await fetch(`https://api.tomtom.com/traffic/trafficstats/routeAnalysis/1?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          network: { segmentList: [{ from: { latitude: oLat, longitude: oLon }, to: { latitude: dLat, longitude: dLon } }] },
          dateRanges: [{ from: '2024-01-01', to: '2024-01-07' }],
          timeSets: [{ label: 'Morning peak', from: '07:00', to: '09:00' }],
        }),
      });
      return r.json();
    },
    tableRows: (result) => {
      const segs = result?.segmentResults || [];
      return segs.map(s => ({ Segment: s.segmentId, 'Avg Speed': s.averageSpeed ? `${s.averageSpeed} km/h` : '—', 'Travel Time': s.travelTime ? `${s.travelTime}s` : '—' }));
    },
  },
  {
    id: 'area-analytics', product: 'Traffic Analytics', endpoint: 'Area Analytics',
    method: 'POST', renderMode: 'table', draft: true,
    description: 'Aggregate traffic flow statistics across all road segments within a polygon.',
    fields: [
      { id: 'lat', label: 'Centre Lat', placeholder: '52.3676', defaultValue: '52.3676', width: 110 },
      { id: 'lon', label: 'Centre Lon', placeholder: '4.9041',  defaultValue: '4.9041',  width: 110 },
    ],
    run: async ({ lat, lon }, key) => {
      const d = 0.05;
      const r = await fetch(`https://api.tomtom.com/traffic/trafficstats/areaAnalysis/1?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          area: { type: 'Polygon', coordinates: [[
            [lon - d, lat - d], [lon + d, lat - d],
            [lon + d, lat + d], [lon - d, lat + d], [lon - d, lat - d],
          ]]},
          dateRanges: [{ from: '2024-01-01', to: '2024-01-07' }],
        }),
      });
      return r.json();
    },
  },
  {
    id: 'od-analysis', product: 'Traffic Analytics', endpoint: 'O/D Analysis',
    method: 'POST', renderMode: 'table', draft: true,
    description: 'Origin-destination traffic flow counts between two geographic zones.',
    fields: [
      { id: 'originLat',  label: 'Origin zone Lat',  placeholder: '52.3676', defaultValue: '52.3676', width: 120 },
      { id: 'originLon',  label: 'Origin zone Lon',  placeholder: '4.9041',  defaultValue: '4.9041',  width: 120 },
      { id: 'destLat',    label: 'Dest zone Lat',    placeholder: '52.0705', defaultValue: '52.0705', width: 120 },
      { id: 'destLon',    label: 'Dest zone Lon',    placeholder: '4.3007',  defaultValue: '4.3007',  width: 120 },
    ],
    run: async ({ originLat, originLon, destLat, destLon }, key) => {
      const d = 0.03;
      const zone = (lat, lon) => [[
        [lon - d, lat - d], [lon + d, lat - d],
        [lon + d, lat + d], [lon - d, lat + d], [lon - d, lat - d],
      ]];
      const r = await fetch(`https://api.tomtom.com/traffic/trafficstats/odAnalysis/1?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originArea: { type: 'Polygon', coordinates: zone(originLat, originLon) },
          destinationArea: { type: 'Polygon', coordinates: zone(destLat, destLon) },
          dateRanges: [{ from: '2024-01-01', to: '2024-01-07' }],
        }),
      });
      return r.json();
    },
  },
  {
    id: 'junction-analytics', product: 'Traffic Analytics', endpoint: 'Junction Analytics',
    method: 'POST', renderMode: 'table', draft: true,
    description: 'Turning movement counts at a specific intersection.',
    fields: [
      { id: 'lat', label: 'Junction Lat', placeholder: '52.3676', defaultValue: '52.3676', width: 120 },
      { id: 'lon', label: 'Junction Lon', placeholder: '4.9041',  defaultValue: '4.9041',  width: 120 },
    ],
    run: async ({ lat, lon }, key) => {
      const r = await fetch(`https://api.tomtom.com/traffic/trafficstats/junctionAnalysis/1?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          junction: { latitude: parseFloat(lat), longitude: parseFloat(lon) },
          dateRanges: [{ from: '2024-01-01', to: '2024-01-07' }],
        }),
      });
      return r.json();
    },
  },

  /* ════════════════════ MAP DISPLAY API ════════════════════ */
  {
    id: 'raster-tile', product: 'Map Display API', endpoint: 'Raster Tile',
    method: 'GET', renderMode: 'tile',
    description: 'Returns a PNG map tile. Renders directly as an <img> — no SDK needed.',
    fields: [
      { id: 'z', label: 'Z', placeholder: '10', defaultValue: '10', width: 60 },
      { id: 'x', label: 'X', placeholder: '526', defaultValue: '526', width: 70 },
      { id: 'y', label: 'Y', placeholder: '340', defaultValue: '340', width: 70 },
    ],
    tileUrl: ({ z, x, y }, key) =>
      `https://api.tomtom.com/map/1/tile/basic/main/${z}/${x}/${y}.png?key=${key}&tileSize=512`,
  },
  {
    id: 'vector-tile', product: 'Map Display API', endpoint: 'Vector Tile',
    method: 'GET', renderMode: 'sdk',
    description: 'Returns a binary .pbf vector tile. Requires MapLibre GL / Web SDK to decode and render.',
    sdkNote: 'Web SDK (MapLibre GL) initialises a map in a <div>, loads the vector style, and renders tiles automatically. No direct fetch needed.',
    fields: [
      { id: 'z', label: 'Z', placeholder: '10', defaultValue: '10', width: 60 },
      { id: 'x', label: 'X', placeholder: '526', defaultValue: '526', width: 70 },
      { id: 'y', label: 'Y', placeholder: '340', defaultValue: '340', width: 70 },
    ],
    run: async ({ z, x, y }, key) => {
      const r = await fetch(`https://api.tomtom.com/map/1/tile/basic/main/${z}/${x}/${y}.pbf?key=${key}`);
      const buf = await r.arrayBuffer();
      return { info: 'Binary .pbf tile', byteLength: buf.byteLength, note: 'Decoded and rendered by MapLibre GL — use Web SDK to display' };
    },
  },
  {
    id: 'satellite-tile', product: 'Map Display API', endpoint: 'Satellite Tile',
    method: 'GET', renderMode: 'tile',
    description: 'Returns a JPEG satellite imagery tile. Renders directly as an <img>.',
    fields: [
      { id: 'z', label: 'Z', placeholder: '10', defaultValue: '10', width: 60 },
      { id: 'x', label: 'X', placeholder: '526', defaultValue: '526', width: 70 },
      { id: 'y', label: 'Y', placeholder: '340', defaultValue: '340', width: 70 },
    ],
    tileUrl: ({ z, x, y }, key) =>
      `https://api.tomtom.com/map/1/tile/sat/main/${z}/${x}/${y}.jpg?key=${key}&tileSize=512`,
  },
  {
    id: 'static-image', product: 'Map Display API', endpoint: 'Static Image',
    method: 'GET', renderMode: 'image',
    description: 'Generates a static map image at given centre and zoom. Renders as an <img> — no SDK needed.',
    fields: [
      { id: 'lon',   label: 'Centre Lon', placeholder: '4.9041',  defaultValue: '4.9041',  width: 100 },
      { id: 'lat',   label: 'Centre Lat', placeholder: '52.3676', defaultValue: '52.3676', width: 100 },
      { id: 'zoom',  label: 'Zoom',       placeholder: '13',      defaultValue: '13',      width: 70  },
      { id: 'layer', label: 'Layer',      placeholder: 'basic',   defaultValue: 'basic',   width: 80  },
    ],
    imageUrl: ({ lon, lat, zoom, layer }, key) =>
      `https://api.tomtom.com/map/1/staticimage?key=${key}&center=${lon},${lat}&zoom=${zoom || 13}&width=600&height=320&layer=${layer || 'basic'}&style=main&format=png`,
  },
  {
    id: 'map-assets', product: 'Map Display API', endpoint: 'Map Assets',
    method: 'GET', renderMode: 'sdk',
    description: 'Returns the vector style JSON that controls map appearance. Applied via Web SDK map.setStyle().',
    sdkNote: 'Call setStyle() on a Web SDK map instance with the style URL. Sprites, glyphs and tiles resolve automatically.',
    fields: [],
    run: async (_, key) => {
      const r = await fetch(`https://api.tomtom.com/maps-sdk/static/style.json?key=${key}`);
      return r.json();
    },
  },

  /* ════════════════════ EV CHARGING API ════════════════════ */
  {
    id: 'ev-station-search', product: 'EV Charging API', endpoint: 'EV Station Search + Availability',
    method: 'GET', renderMode: 'sdk-map',
    description: 'Find EV charging stations nearby with real-time connector availability.',
    fields: [
      { id: 'lat',        label: 'Lat',        placeholder: '52.3676', defaultValue: '52.3676', width: 100 },
      { id: 'lon',        label: 'Lon',        placeholder: '4.9041',  defaultValue: '4.9041',  width: 100 },
      { id: 'radius',     label: 'Radius (m)', placeholder: '5000',    defaultValue: '5000',    width: 90  },
      { id: 'minPowerKW', label: 'Min kW',     placeholder: 'any',     defaultValue: '',        width: 70  },
    ],
    run: async ({ lat, lon, radius, minPowerKW }, key) => {
      const power = minPowerKW ? `&minPowerKW=${minPowerKW}` : '';
      const r = await fetch(`https://api.tomtom.com/search/2/nearbySearch/.json?key=${key}&lat=${lat}&lon=${lon}&radius=${radius || 5000}&categorySet=7309&chargingAvailability=true${power}&limit=10`);
      return r.json();
    },
    sdkCenter: (_, { lat, lon }) => ({ lon: parseFloat(lon), lat: parseFloat(lat), zoom: 13 }),
    sdkSetup: (map, tt, result, values) => {
      const results = result?.results || [];
      const cLon = parseFloat(values.lon), cLat = parseFloat(values.lat);
      new tt.Marker({ element: markerEl('#64748b', '◎') }).setLngLat([cLon, cLat]).addTo(map);
      const lngs = [[cLon, cLat]];
      results.forEach((r) => {
        const { lon, lat } = r.position;
        lngs.push([lon, lat]);
        const avail = r.chargingPark?.connectors?.some(c => c.availability?.current?.available > 0);
        const color = avail ? '#15803d' : avail === false ? '#dc2626' : '#0369a1';
        new tt.Marker({ element: markerEl(color, '⚡') })
          .setLngLat([lon, lat])
          .setPopup(new tt.Popup({ offset: 16 }).setText(r.poi?.name || 'EV Charger'))
          .addTo(map);
      });
      fitBounds(map, tt, lngs);
    },
  },
  {
    id: 'ev-market-coverage', product: 'EV Charging API', endpoint: 'Market Coverage',
    method: 'GET', renderMode: 'json', draft: true,
    description: 'Returns the list of countries and regions where EV charging data is available.',
    fields: [],
    run: async (_, key) => {
      const r = await fetch(`https://api.tomtom.com/search/2/supportedMarkets.json?key=${key}`);
      return r.json();
    },
  },

  /* ════════════════════ LDEVR ════════════════════ */
  {
    id: 'ldevr-calculate', product: 'LDEVR', endpoint: 'Calculate EV Route',
    method: 'POST', renderMode: 'sdk-map',
    description: 'Long-distance EV route with automatic charging stop optimisation.',
    note: 'Requires an LDEVR-enabled API key — standard keys return 403.',
    fields: [
      { id: 'origin',        label: 'Origin (lat,lon)',      placeholder: '52.3676,4.9041', defaultValue: '52.3676,4.9041',  flex: true },
      { id: 'destination',   label: 'Destination (lat,lon)', placeholder: '48.8584,2.2945', defaultValue: '48.8584,2.2945',  flex: true },
      { id: 'batteryKWh',    label: 'Battery (kWh)',         placeholder: '77',             defaultValue: '77',              width: 90  },
      { id: 'chargePercent', label: 'Charge %',              placeholder: '80',             defaultValue: '80',              width: 80  },
    ],
    run: async ({ origin, destination, batteryKWh, chargePercent }, key) => {
      const { lat: oLat, lon: oLon } = parseLatLon(origin);
      const { lat: dLat, lon: dLon } = parseLatLon(destination);
      const maxKWh = parseFloat(batteryKWh) || 77;
      const startKWh = maxKWh * ((parseFloat(chargePercent) || 80) / 100);
      const r = await fetch(`https://api.tomtom.com/routing/wayfinding/ev/route/1?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startingBatteryChargeKWh: startKWh, maxChargeKWh: maxKWh,
          minChargeAtDestinationKWh: maxKWh * 0.1,
          minChargeAtChargingStopsKWh: maxKWh * 0.1,
          origin: { latitude: oLat, longitude: oLon },
          destination: { latitude: dLat, longitude: dLon },
          routeOptions: { travelMode: 'car' },
          electricVehicleConsumption: {
            constantSpeedConsumptionInkWhPerHundredkm: [
              { speedKmPerHour: 50, consumptionKWh: 12 }, { speedKmPerHour: 100, consumptionKWh: 18 }, { speedKmPerHour: 130, consumptionKWh: 23 },
            ],
            auxiliaryPowerInkW: 1.7,
          },
        }),
      });
      return r.json();
    },
    sdkCenter: (_, { origin }) => { const { lat, lon } = parseLatLon(origin); return { lon, lat, zoom: 5 }; },
    sdkSetup: (map, tt, result, values) => {
      const legs = result?.routes?.[0]?.legs || [];
      const allCoords = legs.flatMap(leg => (leg.points || []).map(p => [p.longitude, p.latitude]));
      addRouteLine(map, allCoords, '#15803d', 4);
      const { lat: oLat, lon: oLon } = parseLatLon(values.origin);
      const { lat: dLat, lon: dLon } = parseLatLon(values.destination);
      new tt.Marker({ element: markerEl('#15803d', 'A') }).setLngLat([oLon, oLat]).addTo(map);
      new tt.Marker({ element: markerEl('#e2001a', 'B') }).setLngLat([dLon, dLat]).addTo(map);
      /* charging stops at end of each intermediate leg */
      legs.slice(0, -1).forEach((leg, i) => {
        const last = leg.points?.[leg.points.length - 1];
        if (last) {
          new tt.Marker({ element: markerEl('#0369a1', '⚡') })
            .setLngLat([last.longitude, last.latitude])
            .setPopup(new tt.Popup({ offset: 16 }).setText(`Charging stop ${i + 1}`))
            .addTo(map);
        }
      });
      fitBounds(map, tt, [[oLon, oLat], [dLon, dLat]], 60, 8);
    },
  },
  {
    id: 'ldevr-weather', product: 'LDEVR', endpoint: 'Weather Consideration (v2)',
    method: 'POST', renderMode: 'json', draft: true,
    description: 'EV route calculation with real-time weather data factored into battery consumption.',
    note: 'LDEVR v2 — requires separate v2-enabled credentials.',
    fields: [
      { id: 'origin',      label: 'Origin (lat,lon)',      placeholder: '52.3676,4.9041', defaultValue: '52.3676,4.9041', flex: true },
      { id: 'destination', label: 'Destination (lat,lon)', placeholder: '48.8584,2.2945', defaultValue: '48.8584,2.2945', flex: true },
    ],
    run: async ({ origin, destination }, key) => {
      const { lat: oLat, lon: oLon } = parseLatLon(origin);
      const { lat: dLat, lon: dLon } = parseLatLon(destination);
      const r = await fetch(`https://api.tomtom.com/routing/wayfinding/ev/route/2?key=${key}&weather=true`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin: { latitude: oLat, longitude: oLon }, destination: { latitude: dLat, longitude: dLon }, maxChargeKWh: 77, startingBatteryChargeKWh: 60 }),
      });
      return r.json();
    },
  },
  {
    id: 'ldevr-vehicle-brand', product: 'LDEVR', endpoint: 'Vehicle Brand (v2)',
    method: 'GET', renderMode: 'json', draft: true,
    description: 'Returns the list of supported EV brands and models with their battery profiles.',
    fields: [],
    run: async (_, key) => {
      const r = await fetch(`https://api.tomtom.com/routing/wayfinding/ev/vehiclebrand/1?key=${key}`);
      return r.json();
    },
  },
  {
    id: 'ldevr-toll', product: 'LDEVR', endpoint: 'Compute Toll Amounts (v2)',
    method: 'POST', renderMode: 'json', draft: true,
    description: 'Calculates expected toll costs along an EV route by country and toll system.',
    fields: [
      { id: 'origin',      label: 'Origin (lat,lon)',      placeholder: '52.3676,4.9041', defaultValue: '52.3676,4.9041', flex: true },
      { id: 'destination', label: 'Destination (lat,lon)', placeholder: '48.8584,2.2945', defaultValue: '48.8584,2.2945', flex: true },
    ],
    run: async ({ origin, destination }, key) => {
      const { lat: oLat, lon: oLon } = parseLatLon(origin);
      const { lat: dLat, lon: dLon } = parseLatLon(destination);
      const r = await fetch(`https://api.tomtom.com/routing/wayfinding/ev/toll/1?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin: { latitude: oLat, longitude: oLon }, destination: { latitude: dLat, longitude: dLon } }),
      });
      return r.json();
    },
  },
  {
    id: 'ldevr-parks', product: 'LDEVR', endpoint: 'Charging Parks Hours (v2)',
    method: 'POST', renderMode: 'json', draft: true,
    description: 'Returns opening hours for EV charging parks along a route.',
    fields: [
      { id: 'origin',      label: 'Origin (lat,lon)',      placeholder: '52.3676,4.9041', defaultValue: '52.3676,4.9041', flex: true },
      { id: 'destination', label: 'Destination (lat,lon)', placeholder: '48.8584,2.2945', defaultValue: '48.8584,2.2945', flex: true },
    ],
    run: async ({ origin, destination }, key) => {
      const { lat: oLat, lon: oLon } = parseLatLon(origin);
      const { lat: dLat, lon: dLon } = parseLatLon(destination);
      const r = await fetch(`https://api.tomtom.com/routing/wayfinding/ev/chargingparks/1?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin: { latitude: oLat, longitude: oLon }, destination: { latitude: dLat, longitude: dLon } }),
      });
      return r.json();
    },
  },
  {
    id: 'ldevr-emsp', product: 'LDEVR', endpoint: 'OEM eMSP Support (v2)',
    method: 'GET', renderMode: 'json', draft: true,
    description: 'Returns the eMSP entitlement configuration for OEM fleet charging integrations.',
    note: 'This is an authentication/header contract spec. Requires OEM eMSP credentials, not a standard API key.',
    fields: [],
    run: async (_, key) => ({ note: 'OEM eMSP requires dedicated fleet credentials. See LDEVR v2 docs for SEV entitlement key setup.' }),
  },

  /* ════════════════════ PARKING & FUEL API ════════════════════ */
  {
    id: 'parking-availability', product: 'Parking & Fuel API', endpoint: 'Parking Availability',
    method: 'GET', renderMode: 'sdk-map', draft: true,
    description: 'Find parking facilities near a location with real-time space availability.',
    fields: [
      { id: 'lat',    label: 'Lat',        placeholder: '52.3676', defaultValue: '52.3676', width: 100 },
      { id: 'lon',    label: 'Lon',        placeholder: '4.9041',  defaultValue: '4.9041',  width: 100 },
      { id: 'radius', label: 'Radius (m)', placeholder: '1000',    defaultValue: '1000',    width: 90  },
    ],
    run: async ({ lat, lon, radius }, key) => {
      const r = await fetch(`https://api.tomtom.com/search/2/nearbySearch/.json?key=${key}&lat=${lat}&lon=${lon}&radius=${radius || 1000}&categorySet=7369&parkingAvailability=true&limit=10`);
      return r.json();
    },
    sdkCenter: (_, { lat, lon }) => ({ lon: parseFloat(lon), lat: parseFloat(lat), zoom: 15 }),
    sdkSetup: (map, tt, result, values) => {
      const results = result?.results || [];
      const cLon = parseFloat(values.lon), cLat = parseFloat(values.lat);
      new tt.Marker({ element: markerEl('#64748b', '◎') }).setLngLat([cLon, cLat]).addTo(map);
      const lngs = [[cLon, cLat]];
      results.forEach((r) => {
        const { lon, lat } = r.position;
        lngs.push([lon, lat]);
        new tt.Marker({ element: markerEl('#0369a1', 'P') })
          .setLngLat([lon, lat])
          .setPopup(new tt.Popup({ offset: 16 }).setText(r.poi?.name || 'Parking'))
          .addTo(map);
      });
      fitBounds(map, tt, lngs);
    },
  },
  {
    id: 'parking-prices', product: 'Parking & Fuel API', endpoint: 'Parking Prices',
    method: 'GET', renderMode: 'json', draft: true,
    description: 'Returns tariff and pricing information for a specific parking facility.',
    note: 'Requires a parking facility ID from a search result. Endpoint URL needs verification.',
    fields: [
      { id: 'id', label: 'Facility ID', placeholder: 'NLD/par/p0/1234', defaultValue: 'NLD/par/p0/1234', flex: true },
    ],
    run: async ({ id }, key) => {
      const r = await fetch(`https://api.tomtom.com/parking/1/getParkinPrices?key=${key}&id=${encodeURIComponent(id)}`);
      return r.json();
    },
  },
  {
    id: 'on-street-parking', product: 'Parking & Fuel API', endpoint: 'On-Street Parking',
    method: 'GET', renderMode: 'sdk-map', draft: true,
    description: 'Find on-street parking regulations and availability in an area.',
    fields: [
      { id: 'lat',    label: 'Lat',        placeholder: '52.3676', defaultValue: '52.3676', width: 100 },
      { id: 'lon',    label: 'Lon',        placeholder: '4.9041',  defaultValue: '4.9041',  width: 100 },
      { id: 'radius', label: 'Radius (m)', placeholder: '500',     defaultValue: '500',     width: 90  },
    ],
    run: async ({ lat, lon, radius }, key) => {
      const r = await fetch(`https://api.tomtom.com/search/2/nearbySearch/.json?key=${key}&lat=${lat}&lon=${lon}&radius=${radius || 500}&categorySet=7374&limit=10`);
      return r.json();
    },
    sdkCenter: (_, { lat, lon }) => ({ lon: parseFloat(lon), lat: parseFloat(lat), zoom: 16 }),
    sdkSetup: (map, tt, result, values) => {
      const results = result?.results || [];
      const cLon = parseFloat(values.lon), cLat = parseFloat(values.lat);
      new tt.Marker({ element: markerEl('#64748b', '◎') }).setLngLat([cLon, cLat]).addTo(map);
      const lngs = [[cLon, cLat]];
      results.forEach((r) => {
        const { lon, lat } = r.position;
        lngs.push([lon, lat]);
        new tt.Marker({ element: markerEl('#7c3aed', 'P') })
          .setLngLat([lon, lat])
          .setPopup(new tt.Popup({ offset: 16 }).setText(r.poi?.name || 'On-street parking'))
          .addTo(map);
      });
      fitBounds(map, tt, lngs);
    },
  },
  {
    id: 'fuel-prices', product: 'Parking & Fuel API', endpoint: 'Fuel Prices',
    method: 'GET', renderMode: 'sdk-map', draft: true,
    description: 'Find nearby fuel stations with live pricing per fuel type.',
    fields: [
      { id: 'lat',     label: 'Lat',        placeholder: '52.3676',  defaultValue: '52.3676',  width: 100 },
      { id: 'lon',     label: 'Lon',        placeholder: '4.9041',   defaultValue: '4.9041',   width: 100 },
      { id: 'radius',  label: 'Radius (m)', placeholder: '5000',     defaultValue: '5000',     width: 90  },
      { id: 'fuelSet', label: 'Fuel type',  placeholder: 'Petrol',   defaultValue: 'Petrol',   width: 80  },
    ],
    run: async ({ lat, lon, radius, fuelSet }, key) => {
      const r = await fetch(`https://api.tomtom.com/search/2/nearbySearch/.json?key=${key}&lat=${lat}&lon=${lon}&radius=${radius || 5000}&categorySet=7311&fuelSet=${fuelSet || 'Petrol'}&limit=10`);
      return r.json();
    },
    sdkCenter: (_, { lat, lon }) => ({ lon: parseFloat(lon), lat: parseFloat(lat), zoom: 13 }),
    sdkSetup: (map, tt, result, values) => {
      const results = result?.results || [];
      const cLon = parseFloat(values.lon), cLat = parseFloat(values.lat);
      new tt.Marker({ element: markerEl('#64748b', '◎') }).setLngLat([cLon, cLat]).addTo(map);
      const lngs = [[cLon, cLat]];
      results.forEach((r) => {
        const { lon, lat } = r.position;
        lngs.push([lon, lat]);
        new tt.Marker({ element: markerEl('#b45309', '⛽') })
          .setLngLat([lon, lat])
          .setPopup(new tt.Popup({ offset: 16 }).setText(r.poi?.name || 'Fuel station'))
          .addTo(map);
      });
      fitBounds(map, tt, lngs);
    },
  },

  /* ════════════════════ SNAP TO ROADS ════════════════════ */
  {
    id: 'snap-to-roads', product: 'Snap to Roads', endpoint: 'Snap GPS Trace',
    method: 'POST', renderMode: 'sdk-map', draft: true,
    description: 'Takes a series of GPS coordinates and snaps them to the nearest road geometry.',
    fields: [
      { id: 'points', label: 'GPS points (lat,lon per line)', placeholder: '52.3676,4.9041\n52.3700,4.9100\n52.3750,4.9150', defaultValue: '52.3676,4.9041\n52.3700,4.9100\n52.3750,4.9150', flex: true },
    ],
    run: async ({ points }, key) => {
      const pts = points.split('\n').filter(Boolean).map(line => { const { lat, lon } = parseLatLon(line.trim()); return { latitude: lat, longitude: lon }; });
      const r = await fetch(`https://api.tomtom.com/snap-to-roads/1/snap?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points: pts }),
      });
      return r.json();
    },
    sdkCenter: (_, { points }) => { const { lat, lon } = parseLatLon(points.split('\n')[0].trim()); return { lon, lat, zoom: 14 }; },
    sdkSetup: (map, tt, result, values) => {
      const inputPts = values.points.split('\n').filter(Boolean).map(l => { const { lat, lon } = parseLatLon(l); return [lon, lat]; });
      const snappedPts = (result?.snappedPoints || []).map(p => [p.location?.longitude ?? p.longitude, p.location?.latitude ?? p.latitude]);
      /* original GPS trace — grey dashed */
      if (inputPts.length > 1) {
        map.addSource('gps', { type: 'geojson', data: { type: 'Feature', geometry: { type: 'LineString', coordinates: inputPts } } });
        map.addLayer({ id: 'gps', type: 'line', source: 'gps', paint: { 'line-color': '#94a3b8', 'line-width': 2, 'line-dasharray': [3, 3] } });
      }
      /* snapped line — red */
      if (snappedPts.length > 1) addRouteLine(map, snappedPts, '#e2001a', 3, 'snapped');
      /* input markers */
      inputPts.forEach((pt, i) => new tt.Marker({ element: markerEl('#94a3b8', String(i + 1)) }).setLngLat(pt).addTo(map));
      fitBounds(map, tt, [...inputPts, ...snappedPts]);
    },
  },

  /* ════════════════════ MATRIX ROUTING ════════════════════ */
  {
    id: 'matrix-sync', product: 'Matrix Routing', endpoint: 'Synchronous Matrix',
    method: 'POST', renderMode: 'table',
    description: 'Calculate travel times and distances from N origins to M destinations in one call.',
    fields: [
      { id: 'origins',      label: 'Origins (lat,lon one per line)',      placeholder: '52.3676,4.9041\n51.5074,-0.1278', defaultValue: '52.3676,4.9041\n51.5074,-0.1278', flex: true },
      { id: 'destinations', label: 'Destinations (lat,lon one per line)', placeholder: '48.8566,2.3522\n52.5200,13.4050', defaultValue: '48.8566,2.3522\n52.5200,13.4050', flex: true },
    ],
    run: async ({ origins, destinations }, key) => {
      const parse = str => str.split('\n').filter(Boolean).map(line => { const { lat, lon } = parseLatLon(line.trim()); return { point: { latitude: lat, longitude: lon } }; });
      const r = await fetch(`https://api.tomtom.com/routing/1/matrix/sync/json?key=${key}&traffic=true`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origins: parse(origins), destinations: parse(destinations) }),
      });
      return r.json();
    },
    tableRows: (result) => {
      const cells = result?.matrix || [];
      return cells.flatMap((row, i) =>
        row.map((cell, j) => ({
          'Origin → Dest': `O${i + 1} → D${j + 1}`,
          'Travel Time': cell.response?.routeSummary?.travelTimeInSeconds ? `${Math.round(cell.response.routeSummary.travelTimeInSeconds / 60)} min` : '—',
          'Distance': cell.response?.routeSummary?.lengthInMeters ? `${(cell.response.routeSummary.lengthInMeters / 1000).toFixed(1)} km` : '—',
          'Status': cell.statusCode || '200',
        }))
      );
    },
  },
  {
    id: 'matrix-async', product: 'Matrix Routing', endpoint: 'Asynchronous Matrix',
    method: 'POST', renderMode: 'json',
    description: 'Submit a large matrix job asynchronously. Returns a job ID — poll for results.',
    note: 'This endpoint returns a 202 + Location header with the job URL. Polling is needed to fetch the result.',
    fields: [
      { id: 'origins',      label: 'Origins (lat,lon per line)',      placeholder: '52.3676,4.9041\n51.5074,-0.1278', defaultValue: '52.3676,4.9041\n51.5074,-0.1278', flex: true },
      { id: 'destinations', label: 'Destinations (lat,lon per line)', placeholder: '48.8566,2.3522\n52.5200,13.4050', defaultValue: '48.8566,2.3522\n52.5200,13.4050', flex: true },
    ],
    run: async ({ origins, destinations }, key) => {
      const parse = str => str.split('\n').filter(Boolean).map(line => { const { lat, lon } = parseLatLon(line.trim()); return { point: { latitude: lat, longitude: lon } }; });
      const r = await fetch(`https://api.tomtom.com/routing/1/matrix/async/json?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origins: parse(origins), destinations: parse(destinations) }),
      });
      const location = r.headers.get('Location');
      return { statusCode: r.status, jobLocation: location, note: 'Poll the Location URL to retrieve results when ready.' };
    },
  },

  /* ════════════════════ WAYPOINT OPTIMIZATION ════════════════════ */
  {
    id: 'waypoint-optimize', product: 'Waypoint API', endpoint: 'Optimize Waypoints',
    method: 'POST', renderMode: 'sdk-map',
    description: 'Reorders a set of waypoints to minimise total travel time — solves the TSP.',
    fields: [
      { id: 'waypoints', label: 'Waypoints (lat,lon one per line)', placeholder: '52.3676,4.9041\n52.3790,4.8990\n52.3600,4.8900\n52.3700,4.9100', defaultValue: '52.3676,4.9041\n52.3790,4.8990\n52.3600,4.8900\n52.3700,4.9100', flex: true },
    ],
    run: async ({ waypoints }, key) => {
      const pts = waypoints.split('\n').filter(Boolean).map(line => { const { lat, lon } = parseLatLon(line.trim()); return { point: { latitude: lat, longitude: lon } }; });
      const r = await fetch(`https://api.tomtom.com/routing/1/waypointoptimization/1?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ waypoints: pts }),
      });
      return r.json();
    },
    sdkCenter: (_, { waypoints }) => {
      const pts = waypoints.split('\n').filter(Boolean).map(l => parseLatLon(l.trim()));
      return { lon: pts.reduce((s, p) => s + p.lon, 0) / pts.length, lat: pts.reduce((s, p) => s + p.lat, 0) / pts.length, zoom: 13 };
    },
    sdkSetup: (map, tt, result, values) => {
      const inputPts = values.waypoints.split('\n').filter(Boolean).map(l => { const { lat, lon } = parseLatLon(l); return [lon, lat]; });
      const order = result?.optimizedOrder ?? result?.waypointOrder ?? inputPts.map((_, i) => i);
      const ordered = order.map(i => inputPts[i]).filter(Boolean);
      /* dashed connector in optimized order */
      if (ordered.length > 1) {
        map.addSource('opt', { type: 'geojson', data: { type: 'Feature', geometry: { type: 'LineString', coordinates: ordered } } });
        map.addLayer({ id: 'opt', type: 'line', source: 'opt', paint: { 'line-color': '#7c3aed', 'line-width': 2, 'line-dasharray': [4, 2] } });
      }
      /* numbered markers in optimized visit order */
      ordered.forEach((pt, i) => new tt.Marker({ element: markerEl('#7c3aed', String(i + 1)) }).setLngLat(pt).addTo(map));
      fitBounds(map, tt, inputPts);
    },
  },
];

/* ─── Sub-components ─────────────────────────────────────────────────────────── */
const MAX_LINES = 60;

function JsonOutput({ data }) {
  const [expanded, setExpanded] = useState(false);
  const raw = JSON.stringify(data, null, 2);
  const lines = raw.split('\n');
  const truncated = !expanded && lines.length > MAX_LINES;
  return (
    <div>
      <pre style={{ margin: 0, fontFamily: 'var(--font-mono,"Fira Code",monospace)', fontSize: '0.6875rem', lineHeight: 1.6, color: 'var(--black)', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        {truncated ? lines.slice(0, MAX_LINES).join('\n') : raw}
        {truncated && <span style={{ color: 'var(--mid)' }}>{'\n'}…{lines.length - MAX_LINES} more lines</span>}
      </pre>
      {truncated && <button onClick={() => setExpanded(true)} style={{ marginTop: 8, padding: '3px 10px', borderRadius: 5, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--mid)', fontSize: '0.625rem', cursor: 'pointer' }}>Show all {lines.length} lines</button>}
    </div>
  );
}

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      style={{ padding: '3px 10px', borderRadius: 5, border: '1px solid var(--border)', background: 'var(--bg)', color: copied ? '#15803d' : 'var(--mid)', fontSize: '0.625rem', fontWeight: 600, cursor: 'pointer' }}>
      {copied ? '✓ Copied' : '⎘ Copy'}
    </button>
  );
}

function TableOutput({ rows }) {
  if (!rows?.length) return <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--mid)' }}>No rows to display.</p>;
  const cols = Object.keys(rows[0]);
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.6875rem' }}>
        <thead>
          <tr>{cols.map(c => <th key={c} style={{ padding: '6px 10px', textAlign: 'left', background: 'var(--surface)', borderBottom: '1px solid var(--border)', fontWeight: 700, color: 'var(--mid)', letterSpacing: '0.04em' }}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>{cols.map(c => <td key={c} style={{ padding: '6px 10px', borderBottom: '1px solid var(--border)', color: 'var(--black)' }}>{row[c]}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PhotoOutput({ result }) {
  const photos = result?.photos || result?.results || [];
  const urls = photos.map(p => p.url || p.main?.url || p.sizes?.full?.url).filter(Boolean);
  if (!urls.length) return <JsonOutput data={result} />;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 12 }}>
      {urls.slice(0, 6).map((url, i) => <img key={i} src={url} alt={`Photo ${i + 1}`} style={{ height: 100, borderRadius: 6, objectFit: 'cover' }} />)}
    </div>
  );
}

function SdkPanel({ demo }) {
  return (
    <div style={{ padding: '14px 16px', background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <span style={{ fontSize: '1.1rem', lineHeight: 1, flexShrink: 0 }}>⚡</span>
        <div>
          <p style={{ margin: '0 0 6px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)' }}>Web SDK required</p>
          <p style={{ margin: 0, fontSize: '0.6875rem', color: 'var(--mid)', lineHeight: 1.6 }}>{demo.sdkNote}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── SDK Polygon Map ────────────────────────────────────────────────────────── */
const SDK_JS  = 'https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.1/maps/maps-web.min.js';
const SDK_CSS = 'https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.1/maps/maps.css';

function loadSdk() {
  return new Promise((resolve, reject) => {
    if (window.tt) { resolve(window.tt); return; }
    /* CSS */
    if (!document.querySelector(`link[href="${SDK_CSS}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet'; link.href = SDK_CSS;
      document.head.appendChild(link);
    }
    /* JS */
    if (!document.querySelector(`script[src="${SDK_JS}"]`)) {
      const script = document.createElement('script');
      script.src = SDK_JS;
      script.onload  = () => resolve(window.tt);
      script.onerror = reject;
      document.head.appendChild(script);
    } else {
      /* already injected but not yet loaded — poll */
      const interval = setInterval(() => {
        if (window.tt) { clearInterval(interval); resolve(window.tt); }
      }, 50);
    }
  });
}

function SdkPolygonMap({ result, apiKey, centerLat, centerLon }) {
  const containerRef = useRef(null);
  const mapRef       = useRef(null);

  useEffect(() => {
    if (!result || !apiKey || !containerRef.current) return;

    const boundary = result?.reachableRange?.boundary;
    const center   = result?.reachableRange?.center;
    if (!boundary?.length || !center) return;

    /* GeoJSON polygon — close the ring by repeating the first point */
    const coords = boundary.map(p => [p.longitude, p.latitude]);
    coords.push(coords[0]);
    const geojson = {
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [coords] },
    };

    let map;
    loadSdk().then(tt => {
      if (!containerRef.current) return;
      /* Ensure the container has explicit pixel dimensions before SDK measures it */
      containerRef.current.style.width  = '100%';
      containerRef.current.style.height = '340px';
      map = tt.map({
        key: apiKey,
        container: containerRef.current,
        center: [center.longitude, center.latitude],
        zoom: 10,
      });
      mapRef.current = map;

      /* resize ensures the container is fully painted before the SDK measures it */
      map.once('load', () => {
        map.resize();

        /* Fill */
        map.addSource('range', { type: 'geojson', data: geojson });
        map.addLayer({
          id: 'range-fill',
          type: 'fill',
          source: 'range',
          paint: { 'fill-color': '#e2001a', 'fill-opacity': 0.15 },
        });
        /* Outline */
        map.addLayer({
          id: 'range-line',
          type: 'line',
          source: 'range',
          paint: { 'line-color': '#e2001a', 'line-width': 2, 'line-opacity': 0.8 },
        });
        /* Origin marker */
        const el = document.createElement('div');
        el.style.cssText = 'width:12px;height:12px;border-radius:50%;background:#e2001a;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.4)';
        new tt.Marker({ element: el })
          .setLngLat([center.longitude, center.latitude])
          .addTo(map);
      });
    }).catch(err => console.warn('TomTom SDK failed to load', err));

    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  /* Re-draw whenever the API result changes */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, apiKey]);

  return (
    <div style={{ position: 'relative', borderTop: '1px solid var(--border)' }}>
      <div ref={containerRef} style={{ width: '100%', height: 340, minHeight: 340 }} />
      <span style={{
        position: 'absolute', bottom: 8, right: 8,
        fontSize: '0.5625rem', background: 'rgba(0,0,0,0.55)', color: '#fff',
        padding: '2px 6px', borderRadius: 3, pointerEvents: 'none',
      }}>
        Maps Web SDK — isochrone polygon
      </span>
    </div>
  );
}

/* ─── Generic SDK map output ─────────────────────────────────────────────────── */
function SdkMapOutput({ demo, result, values, apiKey }) {
  const containerRef = useRef(null);
  const mapRef       = useRef(null);

  useEffect(() => {
    if (!result || !apiKey || !containerRef.current) return;
    if (!demo.sdkCenter || !demo.sdkSetup) return;
    const center = demo.sdkCenter(result, values);
    if (!center) return;

    let map;
    loadSdk().then(tt => {
      if (!containerRef.current) return;
      containerRef.current.style.width  = '100%';
      containerRef.current.style.height = '320px';
      map = tt.map({
        key: apiKey,
        container: containerRef.current,
        center: [center.lon, center.lat],
        zoom: center.zoom ?? 12,
      });
      mapRef.current = map;

      map.once('load', () => {
        map.resize();
        try { demo.sdkSetup(map, tt, result, values); } catch (e) { console.warn('sdkSetup error', e); }
      });
    }).catch(err => console.warn('TomTom SDK load failed', err));

    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, apiKey]);

  return (
    <div style={{ position: 'relative', borderTop: '1px solid var(--border)' }}>
      <div ref={containerRef} style={{ width: '100%', height: 320, minHeight: 320 }} />
      <span style={{
        position: 'absolute', bottom: 8, right: 8, pointerEvents: 'none',
        fontSize: '0.5625rem', background: 'rgba(0,0,0,0.55)', color: '#fff',
        padding: '2px 6px', borderRadius: 3,
      }}>Maps Web SDK</span>
    </div>
  );
}

/* ─── Main panel ─────────────────────────────────────────────────────────────── */
function TryItPanel({ demo, apiKey }) {
  const [values, setValues] = useState(() => Object.fromEntries(demo.fields.map(f => [f.id, f.defaultValue ?? ''])));
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [elapsed, setElapsed] = useState(null);
  const [mapImgUrl, setMapImgUrl] = useState(null);
  const [tileLoaded, setTileLoaded] = useState(false);

  const ps = PRODUCT_STYLES[demo.product] || { bg: '#f1f5f9', border: '#cbd5e1', text: '#334155' };
  const ms = METHOD_STYLES[demo.method] || { bg: '#f1f5f9', text: '#334155' };
  const rb = RENDER_BADGES[demo.renderMode] || RENDER_BADGES.json;

  /* tile/image endpoints — no fetch needed */
  const isTileMode       = demo.renderMode === 'tile'        && demo.tileUrl;
  const isImageMode      = demo.renderMode === 'image'       && demo.imageUrl;
  const isSdkMode        = demo.renderMode === 'sdk';
  const isSdkPolygonMode = demo.renderMode === 'sdk-polygon';
  const isSdkMapMode     = demo.renderMode === 'sdk-map';

  const run = async () => {
    if (!apiKey) return;

    /* tile: just show the image */
    if (isTileMode || isImageMode) {
      setTileLoaded(false);
      setStatus('ok');
      return;
    }

    setStatus('running');
    setResult(null);
    setMapImgUrl(null);
    const t0 = performance.now();
    try {
      const data = await demo.run(values, apiKey);
      setElapsed(Math.round(performance.now() - t0));
      setResult(data);
      setStatus('ok');
      /* auto-render map if demo provides mapCenter */
      if (demo.mapCenter) {
        const mc = demo.mapCenter(data, values);
        if (mc) setMapImgUrl(staticMapUrl(apiKey, mc.lon, mc.lat, mc.zoom));
      }
    } catch (err) {
      setResult({ error: err.message });
      setStatus('error');
      setElapsed(null);
    }
  };

  const builtTileUrl = (isTileMode || isImageMode) && apiKey ? (isTileMode ? demo.tileUrl(values, apiKey) : demo.imageUrl(values, apiKey)) : null;
  const resultStr = result ? JSON.stringify(result, null, 2) : '';
  const resultCount = result?.results?.length ?? result?.incidents?.length ?? result?.matrix?.flat?.()?.length ?? null;

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--surface)' }}>

      {/* Header */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.5625rem', fontWeight: 700, padding: '2px 7px', borderRadius: 4, border: `1px solid ${ps.border}`, background: ps.bg, color: ps.text }}>{demo.product}</span>
        <span style={{ fontSize: '0.5625rem', fontWeight: 800, padding: '2px 6px', borderRadius: 4, background: ms.bg, color: ms.text, letterSpacing: '0.04em' }}>{demo.method}</span>
        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--black)', flex: 1 }}>{demo.endpoint}</span>
        <span style={{ fontSize: '0.5625rem', fontWeight: 600, padding: '2px 7px', borderRadius: 4, background: rb.bg, color: rb.text }}>{rb.label}</span>
        {demo.draft && <span style={{ fontSize: '0.5625rem', padding: '2px 6px', borderRadius: 4, background: '#fef9c3', color: '#854d0e', border: '1px solid #fde68a' }}>URL unverified</span>}
      </div>

      {/* Description */}
      <div style={{ padding: '8px 14px 0', fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.5 }}>
        {demo.description}
        {demo.note && (
          <div style={{ marginTop: 5, padding: '5px 9px', background: 'var(--bg)', borderRadius: 5, borderLeft: '3px solid #f59e0b', fontSize: '0.6875rem', color: 'var(--mid)' }}>
            ⚠ {demo.note}
          </div>
        )}
      </div>

      {/* Inputs + Run */}
      <div style={{ padding: '10px 14px', display: 'flex', gap: 7, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        {demo.fields.map(f => (
          <div key={f.id} style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: f.flex ? 1 : 'none', minWidth: f.width ?? 110 }}>
            <label style={{ fontSize: '0.5rem', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{f.label}</label>
            {f.placeholder?.includes('\n') ? (
              <textarea
                value={values[f.id]} rows={3}
                onChange={e => setValues(v => ({ ...v, [f.id]: e.target.value }))}
                placeholder={f.placeholder}
                style={{ padding: '5px 8px', borderRadius: 5, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--black)', fontSize: '0.6875rem', fontFamily: 'var(--font-mono,monospace)', resize: 'vertical', width: '100%', boxSizing: 'border-box' }}
              />
            ) : (
              <input
                value={values[f.id]}
                onChange={e => setValues(v => ({ ...v, [f.id]: e.target.value }))}
                placeholder={f.placeholder}
                style={{ padding: '5px 8px', borderRadius: 5, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--black)', fontSize: '0.6875rem', fontFamily: 'var(--font-mono,monospace)', width: f.flex ? '100%' : `${f.width ?? 110}px`, boxSizing: 'border-box' }}
                onFocus={e => { e.target.style.borderColor = 'var(--brand)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
              />
            )}
          </div>
        ))}
        <button
          onClick={run}
          disabled={!apiKey || status === 'running'}
          style={{ alignSelf: 'flex-end', padding: '6px 14px', borderRadius: 6, border: 'none', background: !apiKey ? 'var(--border)' : status === 'running' ? 'var(--mid)' : 'var(--brand,#e2001a)', color: '#fff', fontSize: '0.75rem', fontWeight: 700, cursor: !apiKey || status === 'running' ? 'not-allowed' : 'pointer', flexShrink: 0 }}
        >
          {status === 'running' ? '…' : isTileMode || isImageMode ? '▶ Preview' : '▶ Run'}
        </button>
      </div>

      {/* SDK panel */}
      {isSdkMode && <SdkPanel demo={demo} />}

      {/* Tile / static image output */}
      {(isTileMode || isImageMode) && status === 'ok' && builtTileUrl && (
        <div style={{ borderTop: '1px solid var(--border)' }}>
          <div style={{ padding: '5px 14px', background: 'var(--bg)', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.6875rem' }}>
            <span style={{ color: '#15803d', fontWeight: 600 }}>● Image</span>
            {!tileLoaded && <span style={{ color: 'var(--muted)' }}>Loading…</span>}
            <div style={{ flex: 1 }} />
            <a href={builtTileUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.625rem', color: 'var(--mid)' }}>Open in new tab ↗</a>
          </div>
          <img src={builtTileUrl} alt="Map tile" onLoad={() => setTileLoaded(true)} style={{ width: '100%', display: 'block', maxHeight: 380, objectFit: 'cover' }} />
        </div>
      )}

      {/* Map image + result output */}
      {result && !isTileMode && !isImageMode && (
        <div style={{ borderTop: '1px solid var(--border)' }}>
          {/* Status bar */}
          <div style={{ padding: '5px 14px', display: 'flex', alignItems: 'center', gap: 8, background: status === 'error' ? '#fff1f2' : 'var(--bg)', fontSize: '0.6875rem' }}>
            <span style={{ color: status === 'error' ? '#be123c' : '#15803d', fontWeight: 600 }}>
              <span style={{ fontSize: '0.5rem' }}>●</span> {status === 'error' ? 'Error' : 'Response'}
            </span>
            {resultCount !== null && <span style={{ color: 'var(--mid)' }}>{resultCount} results</span>}
            {elapsed !== null && <span style={{ color: 'var(--muted)' }}>{elapsed}ms</span>}
            <div style={{ flex: 1 }} />
            <CopyBtn text={resultStr} />
          </div>

          {/* Generic SDK map (markers, routes, clusters) */}
          {isSdkMapMode && result && !result.error && (
            <SdkMapOutput demo={demo} result={result} values={values} apiKey={apiKey} />
          )}

          {/* SDK polygon map (reachable range / isochrone) */}
          {isSdkPolygonMode && result && !result.error && (
            <SdkPolygonMap
              result={result}
              apiKey={apiKey}
              centerLat={parseFloat(values.lat)}
              centerLon={parseFloat(values.lon)}
            />
          )}

          {/* Static image map (legacy fallback) */}
          {mapImgUrl && (
            <div style={{ position: 'relative' }}>
              <img src={mapImgUrl} alt="Result area map" style={{ width: '100%', display: 'block', maxHeight: 280, objectFit: 'cover' }} />
              <span style={{ position: 'absolute', bottom: 6, right: 8, fontSize: '0.5625rem', background: 'rgba(0,0,0,0.55)', color: '#fff', padding: '2px 6px', borderRadius: 3 }}>Static Image API</span>
            </div>
          )}

          {/* POI photos special case */}
          {demo.renderMode === 'image' && <PhotoOutput result={result} />}

          {/* Table output */}
          {demo.renderMode === 'table' && demo.tableRows && (
            <div style={{ padding: '0 0 1px', borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
              <TableOutput rows={demo.tableRows(result)} />
            </div>
          )}

          {/* JSON */}
          <div style={{ padding: '10px 14px', background: 'var(--bg)', maxHeight: 300, overflowY: 'auto', borderTop: '1px solid var(--border)' }}>
            <JsonOutput data={result} />
          </div>
        </div>
      )}

      {/* Idle state */}
      {status === 'idle' && !isSdkMode && !isSdkPolygonMode && !isSdkMapMode && (
        <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border)', fontSize: '0.6875rem', color: 'var(--muted)', background: 'var(--bg)', fontStyle: 'italic' }}>
          {apiKey ? 'Click Run to see a live response.' : '⚠ Enter your API key above to enable live calls.'}
        </div>
      )}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function TryItDemos() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(LS_KEY) || '');
  const [keyVisible, setKeyVisible] = useState(false);

  const saveKey = val => { setApiKey(val); localStorage.setItem(LS_KEY, val); };
  const products = [...new Set(DEMOS.map(d => d.product))];
  const totalDemos = DEMOS.length;
  const draftCount = DEMOS.filter(d => d.draft).length;

  return (
    <div style={{ padding: '32px 40px', maxWidth: 920, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 6px', color: 'var(--black)' }}>Try It — endpoint demos</h1>
        <p style={{ fontSize: '0.8125rem', color: 'var(--mid)', margin: 0, lineHeight: 1.6 }}>
          {totalDemos} endpoints across {products.length} products. Each panel is the exact component that will embed on its endpoint reference page.
          {' '}<span style={{ color: '#854d0e' }}>{draftCount} marked "URL unverified" — check API docs before production.</span>
        </p>
        <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Object.entries(RENDER_BADGES).map(([k, v]) => (
            <span key={k} style={{ fontSize: '0.5625rem', fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: v.bg, color: v.text }}>
              {v.label} — {DEMOS.filter(d => d.renderMode === k).length}
            </span>
          ))}
        </div>
      </div>

      {/* API key */}
      <div style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', marginBottom: 36, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1, minWidth: 240 }}>
          <label style={{ fontSize: '0.5rem', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>TomTom API Key</label>
          <div style={{ display: 'flex', gap: 6 }}>
            <input type={keyVisible ? 'text' : 'password'} value={apiKey} onChange={e => saveKey(e.target.value)} placeholder="Paste your API key…"
              style={{ flex: 1, padding: '6px 9px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--black)', fontSize: '0.75rem', fontFamily: 'var(--font-mono,monospace)', outline: 'none' }}
              onFocus={e => { e.target.style.borderColor = 'var(--brand)'; }} onBlur={e => { e.target.style.borderColor = 'var(--border)'; }} />
            <button onClick={() => setKeyVisible(v => !v)} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', cursor: 'pointer', fontSize: '0.75rem' }}>{keyVisible ? '🙈' : '👁'}</button>
          </div>
        </div>
        <div style={{ fontSize: '0.6875rem', color: 'var(--muted)', lineHeight: 1.5 }}>
          Stored in <code style={{ fontSize: '0.625rem', padding: '1px 4px', background: 'var(--bg)', borderRadius: 3, border: '1px solid var(--border)' }}>localStorage</code> — only sent to TomTom APIs.
          {apiKey ? <span style={{ color: '#15803d', fontWeight: 600, display: 'block' }}>✓ All {totalDemos} panels live</span>
            : <span style={{ color: '#c2410c', display: 'block' }}>No key set — panels show placeholder</span>}
        </div>
      </div>

      {/* Demo groups */}
      {products.map(product => {
        const group = DEMOS.filter(d => d.product === product);
        const ps = PRODUCT_STYLES[product] || {};
        return (
          <div key={product} style={{ marginBottom: 44 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: '0.625rem', fontWeight: 700, padding: '3px 9px', borderRadius: 20, border: `1px solid ${ps.border}`, background: ps.bg, color: ps.text }}>{product}</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <span style={{ fontSize: '0.625rem', color: 'var(--muted)' }}>{group.length} endpoint{group.length !== 1 ? 's' : ''}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {group.map(demo => <TryItPanel key={demo.id} demo={demo} apiKey={apiKey} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
