import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Parameter data ─────────────────────────────────────────────────────────── */

const PARAMS_SYNC = [
  { name: 'batchItems', required: true, type: 'object[]', desc: 'Array of individual route or range requests. Maximum 100 items for synchronous mode.', children: [
    { name: 'batchItems[].query', required: true, type: 'string', desc: 'The URL path and query string for a single calculateRoute or calculateReachableRange request, starting with /routing/1/... Do not include the base URL or API key.' },
  ]},
];

const PARAMS_ASYNC = [
  { name: 'batchItems', required: true, type: 'object[]', desc: 'Array of individual route or range requests. Up to 700 items for asynchronous mode.', children: [
    { name: 'batchItems[].query', required: true, type: 'string', desc: 'The URL path and query string for a single calculateRoute or calculateReachableRange request.' },
  ]},
];

const PARAMS_RESPONSE = [
  { name: 'formatVersion', type: 'string', desc: 'API format version string.' },
  { name: 'batchItems', type: 'object[]', desc: 'Array of individual results, one per input item, in the same order as the request.', children: [
    { name: 'batchItems[].statusCode', type: 'integer', desc: 'HTTP status code for this individual item. 200 = success, 400 = bad input for this item. The top-level HTTP response is always 200 for a completed batch, even if some items failed.' },
    { name: 'batchItems[].response', type: 'object', desc: 'Full response payload for this item — same structure as a standalone calculateRoute or calculateReachableRange response.' },
  ]},
  { name: 'summary', type: 'object', desc: 'Batch-level statistics.', children: [
    { name: 'summary.successfulRequests', type: 'integer', desc: 'Number of items that returned a 200 status.' },
    { name: 'summary.totalRequests',      type: 'integer', desc: 'Total number of items submitted.' },
  ]},
];

const BATCH_ERRORS = [
  { code: 'TOO_MANY_REQUESTS',    title: 'Too Many Requests',    desc: 'The batch exceeds the item limit for this mode (100 for sync, 700 for async). Split into smaller batches.' },
  { code: 'BAD_INPUT',            title: 'Bad Input',            desc: 'A batchItems[].query string is malformed or references an unsupported endpoint. Each item is validated independently — other items in the batch still run.' },
  { code: 'BATCH_TIMEOUT',        title: 'Batch Timeout',        desc: 'Synchronous batch exceeded the server-side time limit. Reduce item count or switch to async mode for large batches.' },
  { code: 'RESULT_EXPIRED',       title: 'Result Expired',       desc: 'Async result URL was polled after the 14-day expiry window. Results are not retained beyond this period.' },
];

/* ─── Code examples ──────────────────────────────────────────────────────────── */

const CODE_SYNC = `# Synchronous batch — up to 100 items, returns immediately
# Mix of calculateRoute and calculateReachableRange in one call

curl -X POST \\
  "https://api.tomtom.com/routing/1/batch/sync/json\\
  ?key=YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "batchItems": [
      {
        "query": "/routing/1/calculateRoute/52.50931,13.42936:52.50274,13.43872/json?routeType=fastest&travelMode=car&traffic=true"
      },
      {
        "query": "/routing/1/calculateRoute/52.50931,13.42936:52.50274,13.43872/json?routeType=shortest&travelMode=car"
      },
      {
        "query": "/routing/1/calculateReachableRange/52.50931,13.42936/json?timeBudgetInSec=1800&travelMode=car"
      }
    ]
  }'`;

const CODE_ASYNC = `# Asynchronous batch — up to 700 items
# Step 1: Submit. Returns 202 + Location header.

curl -X POST \\
  "https://api.tomtom.com/routing/1/batch/async/json\\
  ?key=YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "batchItems": [
      { "query": "/routing/1/calculateRoute/52.509,13.429:52.503,13.439/json?routeType=fastest" },
      { "query": "/routing/1/calculateRoute/52.520,13.400:52.480,13.460/json?routeType=eco" }
    ]
  }'

# Response: 202 Accepted
# Location: https://api.tomtom.com/routing/1/batch/{batchId}/json?key=...

# Step 2: Poll until 200 OK (or 202 while still processing)
curl "https://api.tomtom.com/routing/1/batch/{batchId}/json\\
  ?key=YOUR_API_KEY"`;

const CODE_RESPONSE = `// HTTP 200 — batch complete
{
  "formatVersion": "0.0.12",
  "batchItems": [
    {
      "statusCode": 200,
      "response": {
        "routes": [{
          "summary": {
            "lengthInMeters": 1879,
            "travelTimeInSeconds": 396,
            "trafficDelayInSeconds": 34,
            "departureTime": "2025-10-30T10:00:00+01:00",
            "arrivalTime": "2025-10-30T10:06:36+01:00"
          },
          "legs": [{ "points": [ ... ] }]
        }]
      }
    },
    {
      "statusCode": 200,
      "response": {
        "routes": [{
          "summary": {
            "lengthInMeters": 2104,
            "travelTimeInSeconds": 468
          }
        }]
      }
    },
    {
      "statusCode": 400,
      "response": {
        "detailedError": {
          "code": "NO_ROUTE_FOUND",
          "message": "No valid route exists between the given waypoints."
        }
      }
    }
  ],
  "summary": {
    "successfulRequests": 2,
    "totalRequests": 3
  }
}`;

const CODE_ERROR = `// HTTP 400 — batch-level error (not an item error)
{
  "formatVersion": "0.0.12",
  "detailedError": {
    "code": "TOO_MANY_REQUESTS",
    "message": "Batch exceeds the synchronous limit of 100 items.",
    "target": "batchItems"
  }
}`;

/* ─── Page ───────────────────────────────────────────────────────────────────── */

export default function RoutingBatch({ onNavigate }) {
  const syncSections = [
    {
      id: 'api-batch-sync',
      heading: 'Synchronous batch',
      method: 'POST',
      params: PARAMS_SYNC,
      note: 'Returns results immediately in a single response. Maximum 100 items. Use this for real-time multi-route comparisons, ETA matrices, or when results are needed in a single round trip.',
      code: CODE_SYNC,
      lang: 'json',
    },
    {
      id: 'api-batch-async',
      heading: 'Asynchronous batch',
      method: 'POST',
      params: PARAMS_ASYNC,
      note: (
        <>
          Returns <code style={{ fontFamily: 'monospace', color: 'var(--blue)', fontSize: '0.75rem' }}>202 Accepted</code> immediately
          with a <code style={{ fontFamily: 'monospace', color: 'var(--blue)', fontSize: '0.75rem' }}>Location</code> header.
          Poll that URL until a <code style={{ fontFamily: 'monospace', color: 'var(--blue)', fontSize: '0.75rem' }}>200 OK</code> is
          returned. Results are retained for 14 days. Maximum 700 items.
        </>
      ),
      extra: (
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)', marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
            Async polling states
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { status: '202 Accepted',   color: '#f59e0b', desc: 'Batch is still processing. Continue polling.' },
              { status: '200 OK',         color: '#22c55e', desc: 'Batch complete. Response body contains all results.' },
              { status: '404 Not Found',  color: '#e2001a', desc: 'Batch ID is invalid or the result has expired (> 14 days).' },
            ].map(({ status, color, desc }) => (
              <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--bg)' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: `${color}18`, color, fontFamily: 'monospace', flexShrink: 0 }}>{status}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--mid)' }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      ),
      code: CODE_ASYNC,
    },
  ];

  const responseData = [
    {
      id: 'api-batch-response',
      heading: 'Response schema',
      params: PARAMS_RESPONSE,
      note: (
        <>
          The top-level HTTP status is always <code style={{ fontFamily: 'monospace', color: 'var(--blue)', fontSize: '0.75rem' }}>200</code> for
          a completed batch, even when individual items failed. Check each{' '}
          <code style={{ fontFamily: 'monospace', color: 'var(--blue)', fontSize: '0.75rem' }}>batchItems[].statusCode</code> to determine
          per-item success. Item order matches the request order.
        </>
      ),
      code: CODE_RESPONSE,
      lang: 'json',
    },
    {
      id: 'api-batch-errors',
      heading: 'Error codes',
      params: [],
      note: 'Batch-level errors return a non-200 HTTP status and affect the whole batch. Item-level errors are embedded in batchItems[].statusCode and do not affect other items.',
      extra: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
          {BATCH_ERRORS.map(e => (
            <div key={e.code} style={{
              display: 'flex', alignItems: 'flex-start', gap: 14,
              padding: '12px 14px', borderRadius: 20,
              border: '1px solid var(--border)', background: 'var(--bg)',
            }}>
              <span style={{
                fontSize: '0.875rem', fontWeight: 700, padding: '3px 9px',
                borderRadius: 20, background: 'rgba(226,0,26,0.08)',
                color: '#e2001a', fontFamily: 'monospace', letterSpacing: '0.02em',
                flexShrink: 0, marginTop: 1, whiteSpace: 'nowrap',
              }}>{e.code}</span>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)', marginBottom: 4 }}>{e.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: 1.6 }}>{e.desc}</div>
              </div>
            </div>
          ))}
        </div>
      ),
      code: CODE_ERROR,
      lang: 'json',
    },
  ];

  return (
    <div className="page page--wide">
      <div className="page-header">
        <h1>Batch Routing</h1>
        <PageActions />
      </div>

      <p className="quick-answer">
        Submit multiple Calculate Route or Reachable Range requests in a single call.
        Synchronous mode returns up to 100 results immediately. Asynchronous mode handles
        up to 700 items and returns a polling URL — ideal for fleet ETA calculations,
        delivery matrices, and offline route pre-computation.
      </p>

      <Callout type="info">
        Each <code style={{ fontFamily: 'monospace' }}>batchItems[].query</code> is a full URL path and query string,
        starting with <code style={{ fontFamily: 'monospace' }}>/routing/1/calculateRoute/…</code> or{' '}
        <code style={{ fontFamily: 'monospace' }}>/routing/1/calculateReachableRange/…</code>.
        Do not include the base URL or API key in the query string — those are applied at the batch level.
      </Callout>

      <div className="zone">
        <ApiRefTwoCol sections={syncSections} panelLabel="Example" />
      </div>

      <div className="zone">
        <h2 className="sh" id="batch-response">Response</h2>
        <ApiRefTwoCol sections={responseData} panelLabel="Response example" />
      </div>

      <div className="zone" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className="page-action-btn" onClick={() => onNavigate?.('routing-calculate-route')}>
          Calculate Route →
        </button>
        <button className="page-action-btn" onClick={() => onNavigate?.('routing-reachable-range')}>
          Reachable Range →
        </button>
      </div>
    </div>
  );
}
