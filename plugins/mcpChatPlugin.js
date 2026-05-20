/**
 * mcpChatPlugin.js — Vite dev plugin
 *
 * Adds POST /api/mcp-chat to the Vite dev server.
 * Runs an Anthropic tool-use loop server-side, executes real TomTom
 * REST API calls for each tool, and returns the full conversation
 * plus all tool calls made to the browser.
 *
 * Env vars (from .env.local):
 *   ANTHROPIC_API_KEY  — Anthropic API key
 *   TOMTOM_API_KEY     — TomTom API key (falls back to demo key)
 */

const DEMO_TT_KEY = 'A4owgES2XdDEHLJBXyy69GFmxRMXfuyf';
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-3-5-haiku-20241022';

/* ─── Anthropic tool definitions ────────────────────────────────────────────── */
const TOOLS = [
  {
    name: 'tomtom-fuzzy-search',
    description: 'Typo-tolerant search for addresses, POIs, and places. Use for general "find X near Y" queries.',
    input_schema: {
      type: 'object',
      properties: {
        query:    { type: 'string', description: 'Search query — place name, address, or type of POI' },
        limit:    { type: 'number', description: 'Max results (default 5, max 10)' },
        position: { type: 'array', items: { type: 'number' }, description: 'Location bias as [longitude, latitude]' },
        radius:   { type: 'number', description: 'Search radius in metres' },
      },
      required: ['query'],
    },
  },
  {
    name: 'tomtom-geocode',
    description: 'Convert a street address to coordinates [longitude, latitude].',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Full address to geocode' },
      },
      required: ['query'],
    },
  },
  {
    name: 'tomtom-reverse-geocode',
    description: 'Convert coordinates to a human-readable address.',
    input_schema: {
      type: 'object',
      properties: {
        position: { type: 'array', items: { type: 'number' }, description: '[longitude, latitude]' },
      },
      required: ['position'],
    },
  },
  {
    name: 'tomtom-routing',
    description: 'Calculate a route between two or more locations. Returns distance, travel time, and turn-by-turn summary.',
    input_schema: {
      type: 'object',
      properties: {
        locations: {
          type: 'array',
          description: 'Ordered list of [longitude, latitude] waypoints — minimum origin + destination',
          items: { type: 'array', items: { type: 'number' } },
        },
        avoid:       { type: 'array', items: { type: 'string' }, description: 'Features to avoid: tollRoads, motorways, ferries' },
        routeType:   { type: 'string', enum: ['fast', 'short', 'efficient'], description: 'Route optimisation' },
        travelMode:  { type: 'string', enum: ['car', 'pedestrian', 'bicycle'], description: 'Mode of transport' },
      },
      required: ['locations'],
    },
  },
  {
    name: 'tomtom-reachable-range',
    description: 'Calculate the geographic area reachable from a point within a time or distance budget.',
    input_schema: {
      type: 'object',
      properties: {
        origin:            { type: 'array', items: { type: 'number' }, description: '[longitude, latitude] starting point' },
        timeBudgetInSec:   { type: 'number', description: 'Time budget in seconds (e.g. 1800 = 30 min)' },
        distanceBudgetInMeters: { type: 'number', description: 'Distance budget in metres' },
        avoid:             { type: 'array', items: { type: 'string' } },
      },
      required: ['origin'],
    },
  },
  {
    name: 'tomtom-nearby',
    description: 'Find places sorted by distance from a coordinate. Best for "what\'s near me?" queries.',
    input_schema: {
      type: 'object',
      properties: {
        position: { type: 'array', items: { type: 'number' }, description: '[longitude, latitude]' },
        radius:   { type: 'number', description: 'Radius in metres (default 1000)' },
        limit:    { type: 'number', description: 'Max results (default 5)' },
        query:    { type: 'string', description: 'Optional type filter (e.g. "restaurant")' },
      },
      required: ['position'],
    },
  },
  {
    name: 'tomtom-traffic',
    description: 'Get real-time traffic incidents (accidents, closures, roadworks) in a bounding box area.',
    input_schema: {
      type: 'object',
      properties: {
        bbox: {
          type: 'array',
          items: { type: 'number' },
          description: '[minLon, minLat, maxLon, maxLat] — keep small for best results',
        },
      },
    },
  },
  {
    name: 'tomtom-ev-search',
    description: 'Find EV charging stations with real-time availability near a location.',
    input_schema: {
      type: 'object',
      properties: {
        position:    { type: 'array', items: { type: 'number' }, description: '[longitude, latitude]' },
        radius:      { type: 'number', description: 'Radius in metres (default 5000)' },
        minPowerKW:  { type: 'number', description: 'Minimum charging power in kW' },
        limit:       { type: 'number', description: 'Max results (default 10)' },
      },
      required: ['position'],
    },
  },
];

/* ─── TomTom REST API executor ───────────────────────────────────────────────── */
async function executeTool(name, input, apiKey) {
  const key = apiKey || DEMO_TT_KEY;
  const BASE = 'https://api.tomtom.com';

  try {
    switch (name) {

      case 'tomtom-fuzzy-search': {
        const { query, limit = 5, position, radius } = input;
        let url = `${BASE}/search/2/search/${encodeURIComponent(query)}.json?key=${key}&limit=${Math.min(limit, 10)}`;
        if (position?.length === 2) url += `&lat=${position[1]}&lon=${position[0]}`;
        if (radius) url += `&radius=${radius}`;
        const r = await fetch(url);
        const d = await r.json();
        return (d.results || []).slice(0, limit).map(res => ({
          name:     res.poi?.name || res.address?.freeformAddress,
          address:  res.address?.freeformAddress,
          position: res.position ? [res.position.lon, res.position.lat] : null,
          category: res.poi?.categories?.[0] || null,
          distance: res.dist ? `${Math.round(res.dist)}m` : null,
        }));
      }

      case 'tomtom-geocode': {
        const { query } = input;
        const r = await fetch(`${BASE}/search/2/geocode/${encodeURIComponent(query)}.json?key=${key}&limit=1`);
        const d = await r.json();
        const res = d.results?.[0];
        if (!res) return { error: 'No results found' };
        return {
          address:  res.address?.freeformAddress,
          position: [res.position.lon, res.position.lat],
          type:     res.type,
        };
      }

      case 'tomtom-reverse-geocode': {
        const { position: [lon, lat] } = input;
        const r = await fetch(`${BASE}/search/2/reverseGeocode/${lat},${lon}.json?key=${key}`);
        const d = await r.json();
        const res = d.addresses?.[0];
        if (!res) return { error: 'No address found' };
        return {
          address:   res.address?.freeformAddress,
          street:    res.address?.streetName,
          city:      res.address?.municipality,
          country:   res.address?.country,
          postCode:  res.address?.postalCode,
        };
      }

      case 'tomtom-routing': {
        const { locations, avoid = [], routeType = 'fast', travelMode = 'car' } = input;
        const coords = locations.map(([lon, lat]) => `${lat},${lon}`).join(':');
        let url = `${BASE}/routing/1/calculateRoute/${coords}/json?key=${key}&routeType=${routeType}&travelMode=${travelMode}`;
        if (avoid.length) url += `&avoid=${avoid.join(',')}`;
        const r = await fetch(url);
        const d = await r.json();
        const route = d.routes?.[0];
        if (!route) return { error: 'No route found' };
        const s = route.summary;
        return {
          distance:     `${(s.lengthInMeters / 1000).toFixed(1)} km`,
          travelTime:   `${Math.round(s.travelTimeInSeconds / 60)} min`,
          trafficDelay: s.trafficDelayInSeconds > 60 ? `${Math.round(s.trafficDelayInSeconds / 60)} min delay` : 'no delay',
          legs:         route.legs?.length || 1,
          departurePoint: locations[0],
          arrivalPoint:   locations[locations.length - 1],
        };
      }

      case 'tomtom-reachable-range': {
        const { origin: [lon, lat], timeBudgetInSec, distanceBudgetInMeters, avoid = [] } = input;
        let url = `${BASE}/routing/1/calculateReachableRange/${lat},${lon}/json?key=${key}`;
        if (timeBudgetInSec)        url += `&timeBudgetInSec=${timeBudgetInSec}`;
        if (distanceBudgetInMeters) url += `&distanceBudgetInMeters=${distanceBudgetInMeters}`;
        if (avoid.length)           url += `&avoid=${avoid.join(',')}`;
        const r = await fetch(url);
        const d = await r.json();
        const boundary = d.reachableRange?.boundary;
        if (!boundary) return { error: 'Could not calculate reachable range' };
        // Return summary stats rather than full polygon (too large)
        const lats = boundary.map(p => p.latitude);
        const lons = boundary.map(p => p.longitude);
        const spanKmNS = ((Math.max(...lats) - Math.min(...lats)) * 111).toFixed(0);
        const spanKmEW = ((Math.max(...lons) - Math.min(...lons)) * 111 * Math.cos(lat * Math.PI / 180)).toFixed(0);
        return {
          budget:        timeBudgetInSec ? `${Math.round(timeBudgetInSec / 60)} min` : `${(distanceBudgetInMeters / 1000).toFixed(0)} km`,
          approximateSpan: `~${spanKmNS} km north-south × ${spanKmEW} km east-west`,
          boundaryPoints: boundary.length,
          center:        [lon, lat],
        };
      }

      case 'tomtom-nearby': {
        const { position: [lon, lat], radius = 1000, limit = 5, query = '' } = input;
        let url = `${BASE}/search/2/nearbySearch/.json?key=${key}&lat=${lat}&lon=${lon}&radius=${radius}&limit=${Math.min(limit, 10)}`;
        if (query) url += `&query=${encodeURIComponent(query)}`;
        const r = await fetch(url);
        const d = await r.json();
        return (d.results || []).slice(0, limit).map(res => ({
          name:     res.poi?.name || res.address?.freeformAddress,
          address:  res.address?.freeformAddress,
          distance: res.dist ? `${Math.round(res.dist)}m` : null,
          category: res.poi?.categories?.[0] || null,
          position: res.position ? [res.position.lon, res.position.lat] : null,
        }));
      }

      case 'tomtom-traffic': {
        const { bbox } = input;
        // Default to Amsterdam if no bbox provided
        const box = bbox || [4.85, 52.35, 4.95, 52.40];
        const [minLon, minLat, maxLon, maxLat] = box;
        const url = `${BASE}/traffic/services/5/incidentDetails?key=${key}&bbox=${minLon},${minLat},${maxLon},${maxLat}&fields={incidents{type,geometry{type,coordinates},properties{iconCategory,magnitudeOfDelay,from,to,length,delay,roadNumbers}}}&language=en-GB`;
        const r = await fetch(url);
        const d = await r.json();
        const incidents = d.incidents || [];
        const summary = { total: incidents.length, byCategoryName: {} };
        const CATEGORY_NAMES = { 0:'Accident', 1:'Fog', 2:'Dangerous Conditions', 3:'Rain', 4:'Ice', 5:'Lane Restriction', 6:'Lane Closure', 7:'Road Closure', 8:'Road Works', 9:'Wind', 10:'Flooding', 11:'Detour' };
        incidents.forEach(inc => {
          const cat = CATEGORY_NAMES[inc.properties?.iconCategory] || 'Other';
          summary.byCategoryName[cat] = (summary.byCategoryName[cat] || 0) + 1;
        });
        return {
          total: incidents.length,
          summary: summary.byCategoryName,
          incidents: incidents.slice(0, 5).map(inc => ({
            type:   CATEGORY_NAMES[inc.properties?.iconCategory] || 'Incident',
            from:   inc.properties?.from,
            to:     inc.properties?.to,
            delay:  inc.properties?.delay ? `${Math.round(inc.properties.delay / 60)} min` : null,
            road:   inc.properties?.roadNumbers?.[0] || null,
          })),
        };
      }

      case 'tomtom-ev-search': {
        const { position: [lon, lat], radius = 5000, minPowerKW, limit = 10 } = input;
        let url = `${BASE}/search/2/nearbySearch/.json?key=${key}&lat=${lat}&lon=${lon}&radius=${radius}&limit=${Math.min(limit, 20)}&categorySet=7309`;
        if (minPowerKW) url += `&minPowerKW=${minPowerKW}`;
        const r = await fetch(url);
        const d = await r.json();
        return (d.results || []).slice(0, limit).map(res => ({
          name:      res.poi?.name,
          address:   res.address?.freeformAddress,
          distance:  res.dist ? `${Math.round(res.dist)}m` : null,
          position:  res.position ? [res.position.lon, res.position.lat] : null,
          connectors: res.chargingPark?.connectors?.map(c => `${c.connectorType?.value} ${c.ratedPowerKW}kW`) || [],
        }));
      }

      default:
        return { error: `Unknown tool: ${name}` };
    }
  } catch (err) {
    return { error: err.message };
  }
}

/* ─── Anthropic tool-use loop ────────────────────────────────────────────────── */
async function runChat(messages, anthropicKey) {
  const toolCalls = [];
  const conversation = messages.map(m => ({ role: m.role, content: m.content }));

  const SYSTEM = `You are a TomTom developer assistant embedded in TomTom's developer documentation portal.
Help users explore TomTom APIs through real, live queries. When asked about locations, routes, places, or traffic — use the available tools to fetch real data.
Be concise. After using a tool, summarise the result in plain language — don't repeat raw JSON.
If coordinates are needed, geocode the place name first.
Always clarify units (km, min, kW) in your responses.`;

  let iterations = 0;
  const MAX_ITER = 5; // prevent infinite loops

  while (iterations < MAX_ITER) {
    iterations++;
    const response = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: SYSTEM,
        messages: conversation,
        tools: TOOLS,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Anthropic API error ${response.status}: ${err}`);
    }

    const result = await response.json();

    // End of conversation
    if (result.stop_reason === 'end_turn') {
      const text = result.content
        .filter(c => c.type === 'text')
        .map(c => c.text)
        .join('\n');
      return { text, toolCalls };
    }

    // Tool use — execute and continue
    if (result.stop_reason === 'tool_use') {
      conversation.push({ role: 'assistant', content: result.content });
      const toolResultBlocks = [];

      for (const block of result.content) {
        if (block.type === 'tool_use') {
          const ttKey = process.env.TOMTOM_API_KEY || DEMO_TT_KEY;
          const toolResult = await executeTool(block.name, block.input, ttKey);
          toolCalls.push({
            tool:   block.name,
            input:  block.input,
            result: toolResult,
          });
          toolResultBlocks.push({
            type:        'tool_result',
            tool_use_id: block.id,
            content:     JSON.stringify(toolResult),
          });
        }
      }

      conversation.push({ role: 'user', content: toolResultBlocks });
      continue;
    }

    // Unexpected stop reason
    break;
  }

  return { text: 'No response generated.', toolCalls };
}

/* ─── Body reader helper ─────────────────────────────────────────────────────── */
function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => (data += chunk));
    req.on('end', () => {
      try { resolve(JSON.parse(data)); }
      catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}

/* ─── Vite plugin ────────────────────────────────────────────────────────────── */
export function mcpChatPlugin() {
  return {
    name: 'mcp-chat',

    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url !== '/api/mcp-chat' || req.method !== 'POST') {
          next();
          return;
        }

        const anthropicKey = process.env.ANTHROPIC_API_KEY;
        if (!anthropicKey) {
          res.statusCode = 503;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'ANTHROPIC_API_KEY not set in .env.local' }));
          return;
        }

        let body;
        try {
          body = await readBody(req);
        } catch {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Invalid JSON body' }));
          return;
        }

        const { messages } = body;
        if (!Array.isArray(messages) || messages.length === 0) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'messages array required' }));
          return;
        }

        try {
          console.log(`[mcp-chat] 💬 "${messages[messages.length - 1]?.content?.slice?.(0, 60)}..."`);
          const result = await runChat(messages, anthropicKey);
          console.log(`[mcp-chat] ✅ ${result.toolCalls.length} tool calls made`);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result));
        } catch (err) {
          console.error('[mcp-chat] ❌', err.message);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    },
  };
}
