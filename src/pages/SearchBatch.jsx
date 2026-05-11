import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

/* ─── Sync batch parameters ──────────────────────────────────────────────────── */
const PARAMS_SYNC = [
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key. Passed as a query parameter on the batch endpoint URL.' },
];

/* ─── Async batch parameters ─────────────────────────────────────────────────── */
const PARAMS_ASYNC = [
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'waitTimeSeconds', type: 'integer', default: 30, desc: 'Long-poll wait time (0–60 seconds) on the async result endpoint. If the batch finishes within this window, the response is returned immediately; otherwise HTTP 202 is returned and you poll again.' },
];

/* ─── Request body ───────────────────────────────────────────────────────────── */
const PARAMS_BODY = [
  { name: 'batchItems', required: true, type: 'object[]', desc: 'Array of individual search requests to execute. Sync endpoint: up to 100 items. Async endpoint: up to 10,000 items.', children: [
    { name: 'batchItems[].query', required: true, type: 'string', desc: 'The relative URL of a single search request including its path and all query parameters (excluding the API key). Must begin with /. Example: /search/2/search/pizza.json?lat=52.3731&lon=4.8922&limit=5' },
  ]},
];

/* ─── Response fields ────────────────────────────────────────────────────────── */
const RESPONSE_FIELDS = [
  { name: 'summary', type: 'object', desc: 'Aggregate metadata for the batch.', children: [
    { name: 'summary.successfulRequests', type: 'integer', desc: 'Number of batch items that returned HTTP 200.' },
    { name: 'summary.totalRequests', type: 'integer', desc: 'Total number of items submitted in the batch.' },
  ]},
  { name: 'batchItems', type: 'array', desc: 'Array of result objects, one per input item, in the same order as the request.' },
  { name: 'batchItems[].statusCode', type: 'integer', desc: 'HTTP status code for this individual query (200, 400, 404, etc.).' },
  { name: 'batchItems[].response', type: 'object', desc: 'The full response body for this query — identical in shape to the corresponding standalone endpoint response (summary + results[]).' },
];

/* ─── Async poll response ────────────────────────────────────────────────────── */
const RESPONSE_FIELDS_ASYNC = [
  { name: 'batchId', type: 'string', desc: 'UUID identifier for the asynchronous batch job. Present in the Location header and optionally in the 202 response body.' },
  { name: 'status', type: 'string', desc: 'Processing status: running (still computing) or completed (ready to retrieve).' },
];

/* ─── Code examples ──────────────────────────────────────────────────────────── */
const CODE_SYNC = `# Synchronous batch — up to 100 items, returns immediately
curl -X POST \\
  "https://api.tomtom.com/search/2/batch/sync.json?key=YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "batchItems": [
      { "query": "/search/2/search/pizza.json?lat=52.3731&lon=4.8922&limit=3" },
      { "query": "/search/2/nearbySearch/.json?lat=48.8566&lon=2.3522&radius=500&categorySet=7311" },
      { "query": "/search/2/poiSearch/starbucks.json?lat=51.5074&lon=-0.1278&limit=2" }
    ]
  }'`;

const CODE_ASYNC = `# Step 1: Submit async batch — up to 10,000 items
# Response: HTTP 202 with Location header containing the batchId URL
curl -X POST \\
  "https://api.tomtom.com/search/2/batch.json?key=YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "batchItems": [ /* ... up to 10,000 items ... */ ] }'

# Step 2: Poll for results using the batchId from the Location header
curl "https://api.tomtom.com/search/2/batch/{batchId}?key=YOUR_API_KEY&waitTimeSeconds=30"
# Returns HTTP 200 + results when done, HTTP 202 if still processing`;

const CODE_RESPONSE = `// Synchronous batch response
{
  "summary": {
    "successfulRequests": 3,
    "totalRequests": 3
  },
  "batchItems": [
    {
      "statusCode": 200,
      "response": {
        "summary": {
          "query": "pizza",
          "numResults": 3,
          "totalResults": 234
        },
        "results": [
          {
            "type": "POI",
            "id": "528009010952022",
            "score": 2.9803,
            "poi": { "name": "Pizza Hut", "categories": [{ "id": "7315036", "name": "pizza restaurant" }] },
            "address": { "freeformAddress": "Damstraat 12, Amsterdam" },
            "position": { "lat": 52.3731, "lon": 4.8920 }
          }
        ]
      }
    },
    {
      "statusCode": 200,
      "response": {
        "summary": { "numResults": 2, "totalResults": 7 },
        "results": [/* petrol station results */]
      }
    },
    {
      "statusCode": 200,
      "response": {
        "summary": { "numResults": 2, "totalResults": 47 },
        "results": [/* Starbucks results */]
      }
    }
  ]
}`;

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function SearchBatch({ onNavigate }) {
  return (
    <ApiRefTwoCol
      title="Batch Search"
      description="Execute multiple search queries in a single HTTP request. The synchronous endpoint supports up to 100 items and returns results immediately. The asynchronous endpoint supports up to 10,000 items and uses a poll-based model."
      version="v2"
      sections={[
        {
          id: 'sync-request',
          heading: 'Synchronous Batch',
          method: 'POST',
          note: 'https://api.tomtom.com/search/2/batch/sync.json — Executes up to 100 items and returns all results in a single response. Response time scales with the number of items.',
          params: PARAMS_SYNC,
          code: CODE_SYNC,
          lang: 'bash',
        },
        {
          id: 'async-request',
          heading: 'Asynchronous Batch',
          method: 'POST',
          note: 'https://api.tomtom.com/search/2/batch.json — Submits up to 10,000 items. Returns HTTP 202 with a Location header. Poll the Location URL until HTTP 200 is returned. Optionally include waitTimeSeconds (0–60) for long-polling on the GET endpoint.',
          params: PARAMS_ASYNC,
          code: CODE_ASYNC,
          lang: 'bash',
        },
        {
          id: 'request-body',
          heading: 'Request Body',
          note: 'Both sync and async endpoints accept the same body shape. Each batchItems[].query is a relative URL for a single search call — include the path and all query parameters except the API key.',
          params: PARAMS_BODY,
          code: CODE_SYNC,
          lang: 'bash',
        },
        {
          id: 'response',
          heading: 'Response',
          params: RESPONSE_FIELDS,
          code: CODE_RESPONSE,
          lang: 'json',
        },
        {
          id: 'async-status',
          heading: 'Async Poll Response',
          note: 'While processing, GET /search/2/batch/{batchId} returns HTTP 202. Once complete, it returns HTTP 200 with the full batchItems array. The batchId is available in the Location response header of the initial POST.',
          params: RESPONSE_FIELDS_ASYNC,
          code: CODE_ASYNC,
          lang: 'bash',
        },
      ]}
    />
  );
}
