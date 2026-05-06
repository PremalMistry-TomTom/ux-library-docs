import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Parameter data ─────────────────────────────────────────────────────────── */

const PARAMS_SYNC = [
  { name: 'batchItems', required: true, type: 'object[]', desc: 'Array of individual EV route requests. Maximum 100 items for synchronous mode.', children: [
    { name: 'batchItems[].query', required: true, type: 'string', desc: 'URL path and query string for a single calculateLongDistanceEVRoute request, starting with /routing/1/calculateLongDistanceEVRoute/… Do not include the base URL or API key.' },
    { name: 'batchItems[].post', required: true, type: 'object', desc: 'The full JSON request body for this item — the same structure as a standalone Calculate EV Route POST body, containing vehicleEngineType, currentChargeInkWh, maxChargeInkWh, connectorSet, constantSpeedConsumptionInkWhPerHundredkm, and any optional parameters.' },
  ]},
];

const PARAMS_ASYNC = [
  { name: 'batchItems', required: true, type: 'object[]', desc: 'Array of individual EV route requests. Up to 700 items for asynchronous mode.', children: [
    { name: 'batchItems[].query', required: true, type: 'string', desc: 'URL path and query string for a single calculateLongDistanceEVRoute request.' },
    { name: 'batchItems[].post', required: true, type: 'object', desc: 'Full JSON request body for this item — same structure as a standalone POST body.' },
  ]},
];

const PARAMS_RESPONSE = [
  { name: 'formatVersion', type: 'string', desc: 'API format version string.' },
  { name: 'batchItems', type: 'object[]', desc: 'Array of results, one per input item, in request order.', children: [
    { name: 'batchItems[].statusCode', type: 'integer', desc: 'HTTP status for this item. 200 = success, 400 = bad input. The top-level HTTP response is always 200 for a completed batch even if individual items failed.' },
    { name: 'batchItems[].response', type: 'object', desc: 'Full response payload for this item — same structure as a standalone Calculate EV Route response, including routes[], chargingInformationAtEndOfLeg[], and battery summary.' },
  ]},
  { name: 'summary', type: 'object', desc: 'Batch-level statistics.', children: [
    { name: 'summary.successfulRequests', type: 'integer', desc: 'Number of items that returned a 200 status.' },
    { name: 'summary.totalRequests',      type: 'integer', desc: 'Total number of items submitted.' },
  ]},
];

const BATCH_ERRORS = [
  { code: 'TOO_MANY_REQUESTS', title: 'Too Many Requests',  desc: 'The batch exceeds the item limit for this mode (100 for sync, 700 for async). Split into smaller batches.' },
  { code: 'BAD_INPUT',         title: 'Bad Input',          desc: 'A batchItems[].query string is malformed or a batchItems[].post body is invalid. Each item is validated independently — other items in the batch still run.' },
  { code: 'BATCH_TIMEOUT',     title: 'Batch Timeout',      desc: 'Synchronous batch exceeded the server-side time limit. Reduce item count or switch to async mode.' },
  { code: 'RESULT_EXPIRED',    title: 'Result Expired',     desc: 'Async result URL was polled after the 14-day expiry window. Results are not retained beyond this period.' },
];

/* ─── Code examples ──────────────────────────────────────────────────────────── */

const CODE_SYNC = `# Synchronous batch — up to 100 EV route requests, returns immediately
# Each item has a query (URL path) and a post (JSON body)

curl -X POST \\
  "https://api.tomtom.com/routing/1/calculateLongDistanceEVRoute/batch/sync/json\\
  ?key=YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "batchItems": [
      {
        "query": "/routing/1/calculateLongDistanceEVRoute/52.50931,13.42936:48.85341,2.34880/json",
        "post": {
          "vehicleEngineType": "electric",
          "currentChargeInkWh": 45.0,
          "maxChargeInkWh": 75.0,
          "minChargeAtDestinationInkWh": 5.0,
          "connectorSet": "IEC62196Type2CableAttached",
          "constantSpeedConsumptionInkWhPerHundredkm": "50,8.2:90,14.6:120,21.0"
        }
      },
      {
        "query": "/routing/1/calculateLongDistanceEVRoute/52.50931,13.42936:48.85341,2.34880/json?routeType=eco",
        "post": {
          "vehicleEngineType": "electric",
          "currentChargeInkWh": 45.0,
          "maxChargeInkWh": 75.0,
          "minChargeAtDestinationInkWh": 5.0,
          "connectorSet": "IEC62196Type2CableAttached",
          "constantSpeedConsumptionInkWhPerHundredkm": "50,8.2:90,14.6:120,21.0"
        }
      }
    ]
  }'`;

const CODE_ASYNC = `# Asynchronous batch — up to 700 items
# Step 1: Submit. Returns 202 + Location header.

curl -X POST \\
  "https://api.tomtom.com/routing/1/calculateLongDistanceEVRoute/batch/async/json\\
  ?key=YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "batchItems": [
      {
        "query": "/routing/1/calculateLongDistanceEVRoute/52.509,13.429:48.853,2.349/json",
        "post": {
          "vehicleEngineType": "electric",
          "currentChargeInkWh": 30.0,
          "maxChargeInkWh": 75.0,
          "connectorSet": "IEC62196Type2CableAttached,GBT20234Part3",
          "constantSpeedConsumptionInkWhPerHundredkm": "50,8.2:90,14.6:120,21.0"
        }
      }
    ]
  }'

# Response: 202 Accepted
# Location: https://api.tomtom.com/routing/1/calculateLongDistanceEVRoute/batch/{batchId}/json?key=...

# Step 2: Poll until 200 OK
curl "https://api.tomtom.com/routing/1/calculateLongDistanceEVRoute/batch/{batchId}/json\\
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
            "lengthInMeters": 1049000,
            "travelTimeInSeconds": 37800,
            "batteryConsumptionInkWh": 62.4,
            "remainingChargeAtArrivalInkWh": 7.6,
            "totalChargingTimeInSeconds": 5400
          },
          "legs": [{ "points": [ ... ] }]
        }],
        "chargingInformationAtEndOfLeg": [
          {
            "chargingConnections": [{
              "facilityType": "Charge",
              "plugType": "IEC62196Type2CableAttached"
            }],
            "chargingStops": [{
              "position": { "lat": 50.937, "lon": 6.960 },
              "chargingParkName": "Fastned Cologne",
              "chargingTimeInSeconds": 2700,
              "targetChargeInkWh": 60.0,
              "waitTimeInSeconds": 0
            }]
          }
        ]
      }
    },
    {
      "statusCode": 400,
      "response": {
        "detailedError": {
          "code": "VEHICLE_CANNOT_REACH_DESTINATION",
          "message": "Route cannot be completed with the given battery and connector settings."
        }
      }
    }
  ],
  "summary": {
    "successfulRequests": 1,
    "totalRequests": 2
  }
}`;

const CODE_ERROR = `// HTTP 400 — batch-level error
{
  "formatVersion": "0.0.12",
  "detailedError": {
    "code": "TOO_MANY_REQUESTS",
    "message": "Batch exceeds the synchronous limit of 100 items.",
    "target": "batchItems"
  }
}`;

/* ─── Page ───────────────────────────────────────────────────────────────────── */

export default function LDEVRBatch({ onNavigate }) {
  const syncSections = [
    {
      id: 'api-ldevr-batch-sync',
      heading: 'Synchronous batch',
      method: 'POST',
      params: PARAMS_SYNC,
      note: 'Returns all EV route results immediately in a single response. Maximum 100 items. Each item must include both a query string (URL path) and a post body (vehicle and battery parameters).',
      code: CODE_SYNC,
      lang: 'bash',
    },
    {
      id: 'api-ldevr-batch-async',
      heading: 'Asynchronous batch',
      method: 'POST',
      params: PARAMS_ASYNC,
      note: (
        <>
          Returns <code style={{ fontFamily: 'monospace', color: 'var(--blue)', fontSize: '0.75rem' }}>202 Accepted</code> immediately
          with a <code style={{ fontFamily: 'monospace', color: 'var(--blue)', fontSize: '0.75rem' }}>Location</code> header.
          Poll that URL until <code style={{ fontFamily: 'monospace', color: 'var(--blue)', fontSize: '0.75rem' }}>200 OK</code>.
          Results are retained for 14 days. Maximum 700 items.
        </>
      ),
      extra: (
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--black)', marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
            Async polling states
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { status: '202 Accepted',  color: '#f59e0b', desc: 'Batch is still processing. Continue polling.' },
              { status: '200 OK',        color: '#22c55e', desc: 'Batch complete. Response body contains all results.' },
              { status: '404 Not Found', color: '#e2001a', desc: 'Batch ID is invalid or the result has expired (> 14 days).' },
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

  const responseSections = [
    {
      id: 'api-ldevr-batch-response',
      heading: 'Response schema',
      params: PARAMS_RESPONSE,
      note: (
        <>
          The top-level HTTP status is always <code style={{ fontFamily: 'monospace', color: 'var(--blue)', fontSize: '0.75rem' }}>200</code> for
          a completed batch even when individual items failed. Check each{' '}
          <code style={{ fontFamily: 'monospace', color: 'var(--blue)', fontSize: '0.75rem' }}>batchItems[].statusCode</code> for per-item
          success. Each successful item includes the full <code style={{ fontFamily: 'monospace', color: 'var(--blue)', fontSize: '0.75rem' }}>chargingInformationAtEndOfLeg[]</code> array.
        </>
      ),
      code: CODE_RESPONSE,
      lang: 'json',
    },
    {
      id: 'api-ldevr-batch-errors',
      heading: 'Error codes',
      params: [],
      note: 'Batch-level errors return a non-200 HTTP status and affect the whole batch. Item-level errors are in batchItems[].statusCode and do not affect other items.',
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
        <h1>Batch EV Route</h1>
        <PageActions />
      </div>

      <p className="quick-answer">
        Submit multiple Calculate EV Route requests in a single call. Synchronous mode returns
        up to 100 results immediately. Asynchronous mode handles up to 700 items and returns
        a polling URL — useful for fleet range pre-computation, vehicle capability screening,
        or comparing fastest vs eco routes across many origin-destination pairs.
      </p>

      <Callout type="info">
        Unlike the Routing API batch, each EV batch item requires <strong>both</strong> a{' '}
        <code style={{ fontFamily: 'monospace' }}>query</code> (URL path and query string) and
        a <code style={{ fontFamily: 'monospace' }}>post</code> object (the vehicle and battery
        parameters). The <code style={{ fontFamily: 'monospace' }}>post</code> body follows the
        same schema as a standalone{' '}
        <button
          onClick={() => onNavigate?.('ldevr-calculate-route')}
          style={{ background: 'none', border: 'none', padding: 0, color: 'var(--red)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', textDecoration: 'underline', fontWeight: 600 }}
        >
          Calculate EV Route
        </button>{' '}
        request body.
      </Callout>

      <div className="zone">
        <ApiRefTwoCol sections={syncSections} panelLabel="Example" />
      </div>

      <div className="zone">
        <h2 className="sh" id="ldevr-batch-response">Response</h2>
        <ApiRefTwoCol sections={responseSections} panelLabel="Response example" />
      </div>

      <div className="zone" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className="page-action-btn" onClick={() => onNavigate?.('ldevr-calculate-route')}>
          Calculate EV Route →
        </button>
      </div>
    </div>
  );
}
