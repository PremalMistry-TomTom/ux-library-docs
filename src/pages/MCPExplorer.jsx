/* ─────────────────────────────────────────────────────────────────────────────
 * MCPExplorer — prototype page for the TomTom MCP Server docs experience.
 * Lives in the Plumbing Portal while in progress; will graduate to a public
 * page once the direction is confirmed.
 * ───────────────────────────────────────────────────────────────────────────── */

import { useState, useMemo, useRef, useEffect } from 'react';

/* ─── Tool data (sourced directly from the live MCP server schemas) ─────────── */
const TOOLS = [
  {
    name: 'tomtom-routing',
    group: 'Routing',
    desc: 'Calculate routes between ordered locations with turn-by-turn directions, distance, and travel time.',
    required: ['locations'],
    example: 'Route from TomTom HQ Amsterdam to Schiphol Airport, avoid motorways',
    restApi: 'Routing API',
  },
  {
    name: 'tomtom-ev-routing',
    group: 'Routing',
    desc: 'Plan long-distance EV routes with automatic charging stop optimisation based on battery and connector type.',
    required: ['origin', 'destination', 'currentChargePercent', 'maxChargeKWH'],
    example: 'EV route Utrecht → Paris, Tesla Model 3, 80% charge, avoid toll roads',
    restApi: 'Routing API',
  },
  {
    name: 'tomtom-reachable-range',
    group: 'Routing',
    desc: 'Calculate the geographic area reachable from a point within a time, distance, or fuel budget.',
    required: ['origin'],
    example: 'Show everywhere reachable from Amsterdam Central in 30 minutes',
    restApi: 'Routing API',
  },
  {
    name: 'tomtom-search-along-route',
    group: 'Routing',
    desc: 'Find points of interest within a corridor alongside a calculated route.',
    required: ['origin', 'destination', 'query'],
    example: 'Find coffee shops along the route from Rotterdam to Eindhoven',
    restApi: 'Search API',
  },
  {
    name: 'tomtom-fuzzy-search',
    group: 'Search',
    desc: 'Typo-tolerant search across addresses, POIs, and geographies.',
    required: ['query'],
    example: 'Italian restaurants near the Rijksmuseum, Amsterdam',
    restApi: 'Search API',
  },
  {
    name: 'tomtom-poi-search',
    group: 'Search',
    desc: 'Search for a specific business by name, or browse an entire POI category.',
    required: ['query'],
    example: 'Find all IKEA stores in the Netherlands',
    restApi: 'Search API',
  },
  {
    name: 'tomtom-nearby',
    group: 'Search',
    desc: 'Find places sorted by distance from a specific coordinate — best for "what\'s around here?" queries.',
    required: ['position'],
    example: 'Pharmacies within 500m of [4.897, 52.377]',
    restApi: 'Search API',
  },
  {
    name: 'tomtom-area-search',
    group: 'Search',
    desc: 'Find POIs strictly within a bounding box, polygon, or circular area.',
    required: ['query'],
    example: 'All hotels inside the Amsterdam canal ring polygon',
    restApi: 'Search API',
  },
  {
    name: 'tomtom-ev-search',
    group: 'Search',
    desc: 'Find EV charging stations with real-time availability, connector types, and power levels.',
    required: ['position'],
    example: 'CCS2 fast chargers above 50 kW within 10 km of Munich city centre',
    restApi: 'EV Charging API',
  },
  {
    name: 'tomtom-poi-categories',
    group: 'Search',
    desc: 'Look up valid POI category codes from natural language. Call this before filtering any search by category.',
    required: [],
    example: 'What category code should I use for gyms?',
    restApi: 'Search API',
  },
  {
    name: 'tomtom-geocode',
    group: 'Geocoding',
    desc: 'Convert a street address to geographic coordinates.',
    required: ['query'],
    example: 'Geocode "De Ruyterkade 154, Amsterdam"',
    restApi: 'Geocoding API',
  },
  {
    name: 'tomtom-reverse-geocode',
    group: 'Geocoding',
    desc: 'Convert coordinates to a human-readable address.',
    required: ['position'],
    example: 'What address is at coordinates [4.8994, 52.3791]?',
    restApi: 'Geocoding API',
  },
  {
    name: 'tomtom-traffic',
    group: 'Traffic',
    desc: 'Find and display real-time traffic incidents — accidents, closures, road works — in an area.',
    required: [],
    example: 'Traffic incidents on the A10 ring road around Amsterdam right now',
    restApi: 'Traffic API',
  },
  {
    name: 'tomtom-dynamic-map',
    group: 'Visualisation',
    desc: 'Render a custom map image with markers, drawn lines, polygons, and calculated route overlays.',
    required: [],
    example: 'Plot our 5 European office locations on a single map',
    restApi: 'Map Display API',
  },
  {
    name: 'tomtom-data-viz',
    group: 'Visualisation',
    desc: 'Visualise large GeoJSON datasets as heatmaps, cluster maps, choropleth, or polygon fills.',
    required: ['layers'],
    example: 'Render a heatmap from this GeoJSON of 10,000 delivery locations',
    restApi: 'Map Display API',
  },
];

const GROUP_META = {
  Routing:       { color: '#3b82f6', bg: 'rgba(59,130,246,0.08)',   border: 'rgba(59,130,246,0.2)'  },
  Search:        { color: '#a855f7', bg: 'rgba(168,85,247,0.08)',   border: 'rgba(168,85,247,0.2)'  },
  Geocoding:     { color: '#22c55e', bg: 'rgba(34,197,94,0.08)',    border: 'rgba(34,197,94,0.2)'   },
  Traffic:       { color: '#ef4444', bg: 'rgba(239,68,68,0.08)',    border: 'rgba(239,68,68,0.2)'   },
  Visualisation: { color: '#f97316', bg: 'rgba(249,115,22,0.08)',   border: 'rgba(249,115,22,0.2)'  },
};

const GROUPS = ['All', ...Object.keys(GROUP_META)];

/* ─── Setup configs ──────────────────────────────────────────────────────────── */
const SETUP_CLIENTS = [
  {
    id: 'claude',
    label: 'Claude Desktop',
    file: '~/.config/claude/claude_desktop_config.json',
    snippet: `{
  "mcpServers": {
    "tomtom": {
      "command": "npx",
      "args": ["-y", "@tomtom/mcp-server"],
      "env": {
        "TOMTOM_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}`,
  },
  {
    id: 'cursor',
    label: 'Cursor',
    file: '.cursor/mcp.json (project) or ~/.cursor/mcp.json (global)',
    snippet: `{
  "mcpServers": {
    "tomtom": {
      "command": "npx",
      "args": ["-y", "@tomtom/mcp-server"],
      "env": {
        "TOMTOM_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}`,
  },
  {
    id: 'windsurf',
    label: 'Windsurf',
    file: '~/.codeium/windsurf/mcp_config.json',
    snippet: `{
  "mcpServers": {
    "tomtom": {
      "command": "npx",
      "args": ["-y", "@tomtom/mcp-server"],
      "env": {
        "TOMTOM_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}`,
  },
];

/* ─── llms.txt content ───────────────────────────────────────────────────────── */
const LLMS_TXT = `# TomTom Developer Docs

> TomTom provides mapping, routing, search, traffic, and EV APIs used in
> navigation apps, fleet management, and location-aware services.

## MCP Server

Install: npx @tomtom/mcp-server
Config key: TOMTOM_API_KEY — get one free at https://developer.tomtom.com

## Tools

tomtom-routing            Routes between ordered locations. Required: locations[]
tomtom-ev-routing         EV routes with charging stops. Required: origin, destination, currentChargePercent, maxChargeKWH
tomtom-reachable-range    Area reachable in time/distance. Required: origin
tomtom-search-along-route POIs along a route corridor. Required: origin, destination, query
tomtom-fuzzy-search       Typo-tolerant address + POI search. Required: query
tomtom-poi-search         Business/POI search by name. Required: query
tomtom-nearby             Places sorted by distance. Required: position [lng, lat]
tomtom-area-search        POIs inside a polygon/bbox/circle. Required: query
tomtom-ev-search          EV stations with live availability. Required: position [lng, lat]
tomtom-poi-categories     Resolve category codes from natural language.
tomtom-geocode            Address → coordinates. Required: query
tomtom-reverse-geocode    Coordinates → address. Required: position [lng, lat]
tomtom-traffic            Real-time traffic incidents in an area.
tomtom-dynamic-map        Custom map: markers, lines, polygons.
tomtom-data-viz           GeoJSON visualisation: heatmap, clusters, choropleth.

## Coordinate convention
All tools use GeoJSON order: [longitude, latitude]. Example: [4.897, 52.377] for Amsterdam.

## Authentication
All tools read TOMTOM_API_KEY from env. Free tier: 2,500 MAU, no credit card required.
Docs: https://developer.tomtom.com`;

/* ─── Sub-components ─────────────────────────────────────────────────────────── */

function GroupPill({ group }) {
  const m = GROUP_META[group];
  if (!m) return null;
  return (
    <span style={{
      fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.04em',
      textTransform: 'uppercase', padding: '2px 7px', borderRadius: 20,
      background: m.bg, border: `1px solid ${m.border}`, color: m.color,
      whiteSpace: 'nowrap',
    }}>{group}</span>
  );
}

function ToolCard({ tool }) {
  const [copied, setCopied] = useState(false);
  const copy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <div style={{
      background: 'var(--bg)', border: '1px solid var(--border)',
      borderRadius: 16, padding: '16px', display: 'flex',
      flexDirection: 'column', gap: 10,
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <code style={{
          fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)',
          fontFamily: 'var(--font-mono)', lineHeight: 1.4,
        }}>{tool.name}</code>
        <GroupPill group={tool.group} />
      </div>

      {/* Description */}
      <p style={{ fontSize: '0.8125rem', color: 'var(--mid)', lineHeight: 1.5, margin: 0 }}>
        {tool.desc}
      </p>

      {/* Required params */}
      {tool.required.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          <span style={{ fontSize: '0.6875rem', color: 'var(--muted)', alignSelf: 'center' }}>Required:</span>
          {tool.required.map(r => (
            <code key={r} style={{
              fontSize: '0.6875rem', padding: '1px 6px', borderRadius: 4,
              background: 'var(--s1)', border: '1px solid var(--border)',
              color: 'var(--mid)', fontFamily: 'var(--font-mono)',
            }}>{r}</code>
          ))}
        </div>
      )}

      {/* Example prompt */}
      <div style={{
        background: 'var(--s1)', border: '1px solid var(--border)',
        borderRadius: 8, padding: '8px 10px',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8,
      }}>
        <span style={{
          fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.5, flex: 1,
          fontStyle: 'italic',
        }}>"{tool.example}"</span>
        <button
          onClick={() => copy(tool.example)}
          title="Copy prompt"
          style={{
            flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer',
            color: copied ? '#22c55e' : 'var(--muted)', padding: '2px 4px', borderRadius: 4,
            fontSize: '0.75rem', lineHeight: 1,
          }}
        >
          {copied ? '✓' : '⎘'}
        </button>
      </div>

      {/* REST API badge */}
      <div style={{ fontSize: '0.6875rem', color: 'var(--muted)' }}>
        → <span style={{ color: 'var(--mid)' }}>{tool.restApi}</span>
      </div>
    </div>
  );
}

function CopyButton({ text, label = 'Copy' }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button onClick={copy} style={{
      background: copied ? 'rgba(34,197,94,0.1)' : 'var(--s1)',
      border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : 'var(--border)'}`,
      color: copied ? '#22c55e' : 'var(--mid)',
      borderRadius: 6, padding: '4px 10px', fontSize: '0.75rem',
      fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
    }}>
      {copied ? '✓ Copied' : label}
    </button>
  );
}

/* ─── Tool call card (shown inside chat assistant messages) ──────────────────── */
function ToolCallCard({ toolCall }) {
  const [expanded, setExpanded] = useState(false);
  const toolDef = TOOLS.find(t => t.name === toolCall.tool);
  const group   = toolDef?.group || 'Search';
  const m       = GROUP_META[group] || GROUP_META['Search'];

  const resultStr = typeof toolCall.result === 'object'
    ? JSON.stringify(toolCall.result, null, 2)
    : String(toolCall.result);

  return (
    <div style={{
      border: `1px solid ${m.border}`, background: m.bg,
      borderRadius: 8, overflow: 'hidden', fontSize: '0.75rem',
    }}>
      {/* Header row */}
      <button
        onClick={() => setExpanded(v => !v)}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 6, textAlign: 'left',
        }}
      >
        <span style={{ color: m.color, fontSize: '0.625rem' }}>⚙</span>
        <code style={{ color: m.color, fontFamily: 'var(--font-mono)', fontWeight: 700, flex: 1 }}>
          {toolCall.tool}
        </code>
        <span style={{ color: m.color, opacity: 0.6, fontSize: '0.625rem' }}>
          {expanded ? '▲ hide' : '▼ details'}
        </span>
      </button>

      {expanded && (
        <div style={{ padding: '0 10px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {/* Input */}
          <div>
            <div style={{
              fontSize: '0.5625rem', color: m.color, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3,
            }}>Input</div>
            <pre style={{
              margin: 0, fontSize: '0.6875rem', lineHeight: 1.5, color: 'var(--text)',
              fontFamily: 'var(--font-mono)', background: 'rgba(0,0,0,0.07)',
              padding: '6px 8px', borderRadius: 4, overflowX: 'auto',
              whiteSpace: 'pre-wrap', wordBreak: 'break-all',
            }}>
              {JSON.stringify(toolCall.input, null, 2)}
            </pre>
          </div>
          {/* Result */}
          <div>
            <div style={{
              fontSize: '0.5625rem', color: m.color, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3,
            }}>Result</div>
            <pre style={{
              margin: 0, fontSize: '0.6875rem', lineHeight: 1.5, color: 'var(--text)',
              fontFamily: 'var(--font-mono)', background: 'rgba(0,0,0,0.07)',
              padding: '6px 8px', borderRadius: 4, overflowX: 'auto',
              whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: 200, overflowY: 'auto',
            }}>
              {resultStr.length > 900 ? resultStr.slice(0, 900) + '\n…' : resultStr}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Animated loading dots ──────────────────────────────────────────────────── */
function LoadingDots() {
  const [dots, setDots] = useState(1);
  useEffect(() => {
    const t = setInterval(() => setDots(d => (d === 3 ? 1 : d + 1)), 400);
    return () => clearInterval(t);
  }, []);
  return (
    <span style={{ color: 'var(--muted)', letterSpacing: '0.15em', fontSize: '1.1rem' }}>
      {'•'.repeat(dots)}
    </span>
  );
}

/* ─── Chat section ───────────────────────────────────────────────────────────── */
function ChatSection() {
  // chatMessages: { role: 'user'|'assistant', content: string, toolCalls?: [...] }
  const [chatMessages, setChatMessages] = useState([]);
  const [input, setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);
  const bottomRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, loading]);

  const send = async (text) => {
    const content = (text || input).trim();
    if (!content || loading) return;

    const userMsg    = { role: 'user', content };
    const newHistory = [...chatMessages, userMsg];
    setChatMessages(newHistory);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/mcp-chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          messages: newHistory.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);

      setChatMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.text, toolCalls: data.toolCalls || [] },
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const SUGGESTIONS = [
    'EV charging stations near Amsterdam Central Station',
    'Drive time from Amsterdam to Brussels, avoiding motorways',
    'Italian restaurants near the Eiffel Tower in Paris',
    'What address is at coordinates 52.3791, 4.8994?',
    'Traffic incidents on the A10 ring road around Amsterdam right now',
    'Everywhere reachable from Utrecht in 30 minutes by car',
  ];

  const isEmpty = chatMessages.length === 0;
  const avatarStyle = {
    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
    background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.75rem', color: '#3b82f6',
  };

  return (
    <section style={{ marginBottom: 40 }}>
      {/* Section title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>4 — Try it live</h2>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.6875rem', fontWeight: 600, color: '#22c55e' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
          Live
        </span>
      </div>
      <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginBottom: 16, marginTop: 0 }}>
        Ask about any location, route, or place. Claude will call real TomTom APIs and explain the results.
      </p>

      {/* Chat panel */}
      <div style={{
        border: '1px solid var(--border)', borderRadius: 16,
        overflow: 'hidden', background: 'var(--bg)',
        display: 'flex', flexDirection: 'column',
      }}>

        {/* Message area */}
        <div style={{
          minHeight: 300, maxHeight: 500,
          overflowY: 'auto', padding: '20px',
          display: 'flex', flexDirection: 'column', gap: 16,
        }}>

          {isEmpty ? (
            /* ── Empty state ── */
            <div style={{
              margin: 'auto', textAlign: 'center', width: '100%',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
              paddingTop: 12,
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', color: '#3b82f6',
              }}>◈</div>
              <div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
                  Ask me about any location
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>
                  I'll call real TomTom APIs and show you exactly what came back.
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 560 }}>
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => send(s)} style={{
                    background: 'var(--s1)', border: '1px solid var(--border)',
                    borderRadius: 20, padding: '6px 14px',
                    fontSize: '0.75rem', color: 'var(--mid)', cursor: 'pointer',
                    fontWeight: 500,
                  }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* ── Message thread ── */
            <>
              {chatMessages.map((msg, i) => (
                <div key={i} style={{
                  display: 'flex',
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                  gap: 10, alignItems: 'flex-start',
                }}>
                  {/* AI avatar */}
                  {msg.role === 'assistant' && (
                    <div style={avatarStyle}>◈</div>
                  )}

                  <div style={{ maxWidth: '78%', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {/* Bubble */}
                    <div style={{
                      padding: '10px 14px',
                      borderRadius: msg.role === 'user'
                        ? '14px 14px 4px 14px'
                        : '14px 14px 14px 4px',
                      background: msg.role === 'user' ? '#e2001a' : 'var(--s1)',
                      color:      msg.role === 'user' ? '#fff'     : 'var(--text)',
                      fontSize: '0.875rem', lineHeight: 1.6,
                      border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
                      whiteSpace: 'pre-wrap',
                    }}>
                      {msg.content}
                    </div>

                    {/* Tool calls */}
                    {msg.toolCalls?.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {msg.toolCalls.map((tc, j) => (
                          <ToolCallCard key={j} toolCall={tc} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading bubble */}
              {loading && (
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={avatarStyle}>◈</div>
                  <div style={{
                    padding: '10px 16px',
                    borderRadius: '14px 14px 14px 4px',
                    background: 'var(--s1)', border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <LoadingDots />
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>calling TomTom APIs</span>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div style={{
                  padding: '10px 14px', borderRadius: 10,
                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                  color: '#ef4444', fontSize: '0.8125rem', lineHeight: 1.5,
                }}>
                  <strong>Error:</strong> {error}
                  {error.includes('ANTHROPIC_API_KEY') && (
                    <div style={{ marginTop: 6, color: 'var(--muted)' }}>
                      Add <code style={{ fontFamily: 'var(--font-mono)', color: '#ef4444' }}>ANTHROPIC_API_KEY=sk-...</code> to your <code style={{ fontFamily: 'var(--font-mono)', color: '#ef4444' }}>.env.local</code> and restart the dev server.
                    </div>
                  )}
                </div>
              )}

              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Input bar */}
        <div style={{
          borderTop: '1px solid var(--border)',
          padding: '10px 14px',
          display: 'flex', gap: 8, alignItems: 'flex-end',
          background: 'var(--surface)',
        }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Ask about any location, route, or place…"
            rows={1}
            style={{
              flex: 1, resize: 'none',
              border: '1px solid var(--border)', borderRadius: 10,
              padding: '8px 12px',
              background: 'var(--bg)', color: 'var(--text)',
              fontSize: '0.875rem', lineHeight: 1.5,
              outline: 'none', fontFamily: 'inherit',
              minHeight: 38, maxHeight: 120, overflowY: 'auto',
            }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            style={{
              padding: '8px 18px', borderRadius: 10, border: 'none',
              background: (!input.trim() || loading) ? 'var(--s2)' : '#e2001a',
              color:      (!input.trim() || loading) ? 'var(--muted)' : '#fff',
              fontWeight: 700, fontSize: '0.875rem',
              cursor: (!input.trim() || loading) ? 'default' : 'pointer',
              transition: 'background 0.15s, color 0.15s',
              height: 38, flexShrink: 0,
            }}
          >
            {loading ? '…' : '↑'}
          </button>
        </div>
      </div>

      {/* Clear button */}
      {chatMessages.length > 0 && (
        <button
          onClick={() => { setChatMessages([]); setError(null); }}
          style={{
            marginTop: 8, background: 'none', border: 'none',
            color: 'var(--muted)', fontSize: '0.75rem', cursor: 'pointer',
            padding: '4px 0', display: 'block',
          }}
        >
          ↺ Clear conversation
        </button>
      )}
    </section>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────────────── */
export default function MCPExplorer() {
  const [activeGroup, setActiveGroup] = useState('All');
  const [search, setSearch] = useState('');
  const [activeClient, setActiveClient] = useState('claude');
  const [showLlmsTxt, setShowLlmsTxt] = useState(false);

  const client = SETUP_CLIENTS.find(c => c.id === activeClient);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return TOOLS.filter(t => {
      const groupMatch = activeGroup === 'All' || t.group === activeGroup;
      const searchMatch = !q || t.name.includes(q) || t.desc.toLowerCase().includes(q) || t.group.toLowerCase().includes(q);
      return groupMatch && searchMatch;
    });
  }, [activeGroup, search]);

  const counts = useMemo(() => {
    const c = { All: TOOLS.length };
    TOOLS.forEach(t => { c[t.group] = (c[t.group] || 0) + 1; });
    return c;
  }, []);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 32px 80px' }}>

      {/* ── Page header ── */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          {/* MCP icon */}
          <div style={{
            width: 36, height: 36, borderRadius: 9, flexShrink: 0,
            background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="5"  cy="12" r="2" fill="#3b82f6"/>
              <circle cx="19" cy="5"  r="2" fill="#3b82f6"/>
              <circle cx="19" cy="19" r="2" fill="#3b82f6"/>
              <line x1="7" y1="11" x2="17" y2="6"  stroke="#3b82f6" strokeWidth="1.5"/>
              <line x1="7" y1="13" x2="17" y2="18" stroke="#3b82f6" strokeWidth="1.5"/>
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
              TomTom MCP Server
            </h1>
            <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', margin: 0 }}>
              Use TomTom APIs directly from Claude, Cursor, Copilot, and Windsurf
            </p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <span style={{
              fontSize: '0.6875rem', fontWeight: 700, padding: '3px 10px',
              borderRadius: 20, background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.25)', color: '#22c55e',
            }}>
              {TOOLS.length} tools live
            </span>
            <span style={{
              fontSize: '0.6875rem', fontWeight: 600, padding: '3px 10px',
              borderRadius: 20, background: 'var(--s1)', border: '1px solid var(--border)',
              color: 'var(--muted)',
            }}>
              🔬 Prototype
            </span>
          </div>
        </div>

        {/* Context note */}
        <div style={{
          background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)',
          borderRadius: 10, padding: '10px 14px',
          fontSize: '0.8125rem', color: 'var(--mid)', lineHeight: 1.6,
        }}>
          <strong style={{ color: 'var(--black)' }}>This page is live proof.</strong>{' '}
          The TomTom MCP server is connected to this session right now — every tool below is real and callable.
          A developer using Claude + TomTom MCP can build navigation features without reading a single REST doc.
          This page will become the entry point for that experience.
        </div>
      </div>

      {/* ── Setup ── */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>
          1 — Install
        </h2>

        {/* Client tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 0, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
          {SETUP_CLIENTS.map(c => (
            <button key={c.id} onClick={() => setActiveClient(c.id)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '7px 14px',
              fontSize: '0.8125rem', fontWeight: activeClient === c.id ? 700 : 500,
              color: activeClient === c.id ? 'var(--black)' : 'var(--muted)',
              borderBottom: activeClient === c.id ? '2px solid var(--black)' : '2px solid transparent',
              marginBottom: -1,
            }}>{c.label}</button>
          ))}
        </div>

        {/* Config block */}
        <div style={{
          background: '#0f1923', borderRadius: '0 12px 12px 12px',
          border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden',
        }}>
          {/* File path */}
          <div style={{
            padding: '8px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <code style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)' }}>
              {client.file}
            </code>
            <CopyButton text={client.snippet} label="Copy config" />
          </div>
          {/* Snippet */}
          <pre style={{
            margin: 0, padding: '16px', overflowX: 'auto',
            fontSize: '0.8125rem', lineHeight: 1.65,
            color: '#e2e8f0', fontFamily: 'var(--font-mono)',
          }}>{client.snippet}</pre>
        </div>

        <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginTop: 10 }}>
          Get your free API key at{' '}
          <a href="https://developer.tomtom.com" target="_blank" rel="noreferrer"
            style={{ color: 'var(--red)', fontWeight: 600 }}>developer.tomtom.com</a>.
          Free tier includes 2,500 monthly active users.
        </p>
      </section>

      {/* ── Tools ── */}
      <section style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
            2 — Tools
          </h2>
          {/* Search */}
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filter tools…"
            style={{
              padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border)',
              background: 'var(--bg)', color: 'var(--text)', fontSize: '0.8125rem',
              width: 180, outline: 'none',
            }}
          />
        </div>

        {/* Group filter */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
          {GROUPS.map(g => {
            const active = activeGroup === g;
            const meta = GROUP_META[g];
            return (
              <button key={g} onClick={() => setActiveGroup(g)} style={{
                padding: '4px 12px', borderRadius: 20, fontSize: '0.8125rem',
                fontWeight: active ? 700 : 500, cursor: 'pointer',
                border: active
                  ? `1px solid ${meta ? meta.border : 'var(--border)'}`
                  : '1px solid var(--border)',
                background: active
                  ? (meta ? meta.bg : 'var(--s1)')
                  : 'var(--bg)',
                color: active
                  ? (meta ? meta.color : 'var(--black)')
                  : 'var(--muted)',
              }}>
                {g}
                <span style={{ marginLeft: 5, opacity: 0.6, fontSize: '0.6875rem' }}>
                  {counts[g] || 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tool grid */}
        {filtered.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 12,
          }}>
            {filtered.map(t => <ToolCard key={t.name} tool={t} />)}
          </div>
        ) : (
          <div style={{
            textAlign: 'center', padding: '40px 20px',
            color: 'var(--muted)', fontSize: '0.875rem',
          }}>
            No tools match "{search}"
          </div>
        )}
      </section>

      {/* ── Example prompts ── */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>
          3 — Try these prompts
        </h2>
        <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginBottom: 16, marginTop: -8 }}>
          Copy any prompt into Claude, Cursor, or your AI assistant with the MCP server configured.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 10 }}>
          {[
            { prompt: 'Plan an EV road trip from Amsterdam to Barcelona. I have a Tesla Model 3 with 75 kWh battery at 90% charge. Show charging stops on a map.', tags: ['EV routing', 'Visualisation'] },
            { prompt: 'Find the 5 nearest fast food restaurants to TomTom HQ in Amsterdam and show them on a map with walking times.', tags: ['Search', 'Routing'] },
            { prompt: "Show me a heatmap of all Starbucks locations in London. Use GeoJSON.", tags: ['Search', 'Data viz'] },
            { prompt: "I'm at 52.3791, 4.8994. What address is this? Are there any parking garages within 300m?", tags: ['Geocoding', 'Nearby'] },
            { prompt: 'What is the reachable range from Utrecht Central Station in 45 minutes by car, considering live traffic?', tags: ['Routing'] },
            { prompt: 'Show me all current traffic incidents on the M25 motorway in London. Filter for road closures only.', tags: ['Traffic'] },
          ].map(({ prompt, tags }, i) => (
            <div key={i} style={{
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '14px',
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text)', lineHeight: 1.6, margin: 0, flex: 1 }}>
                "{prompt}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {tags.map(tag => {
                    const m = GROUP_META[tag] || GROUP_META['Search'];
                    return (
                      <span key={tag} style={{
                        fontSize: '0.625rem', fontWeight: 700, padding: '1px 6px',
                        borderRadius: 20, background: m.bg, border: `1px solid ${m.border}`,
                        color: m.color,
                      }}>{tag}</span>
                    );
                  })}
                </div>
                <CopyButton text={prompt} label="Copy" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Chat ── */}
      <ChatSection />

      {/* ── llms.txt ── */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 2px' }}>
              5 — llms.txt
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', margin: 0 }}>
              A plain-text file at <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>/llms.txt</code> that
              AI agents fetch for context before using TomTom APIs.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setShowLlmsTxt(v => !v)} style={{
              background: 'var(--s1)', border: '1px solid var(--border)',
              color: 'var(--mid)', borderRadius: 6, padding: '4px 12px',
              fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
            }}>
              {showLlmsTxt ? 'Hide' : 'Preview'}
            </button>
            {showLlmsTxt && <CopyButton text={LLMS_TXT} label="Copy llms.txt" />}
          </div>
        </div>

        {showLlmsTxt && (
          <div style={{
            background: '#0f1923', borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden',
          }}>
            <pre style={{
              margin: 0, padding: '20px',
              fontSize: '0.8125rem', lineHeight: 1.7,
              color: '#e2e8f0', fontFamily: 'var(--font-mono)',
              overflowX: 'auto',
            }}>{LLMS_TXT}</pre>
          </div>
        )}

        {!showLlmsTxt && (
          <div style={{
            background: 'var(--s1)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '16px 20px',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12,
          }}>
            {[
              { label: 'File', value: '/llms.txt' },
              { label: 'Format', value: 'Plain text, Markdown' },
              { label: 'Standard', value: 'llmstxt.org' },
              { label: 'Tools listed', value: `${TOOLS.length} tools` },
              { label: 'Coordinate note', value: 'GeoJSON [lng, lat]' },
              { label: 'Auth note', value: 'TOMTOM_API_KEY env var' },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text)', fontFamily: label === 'File' || label === 'Auth note' ? 'var(--font-mono)' : undefined }}>{value}</div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
