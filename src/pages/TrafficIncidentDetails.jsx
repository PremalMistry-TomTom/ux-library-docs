import ApiRefTwoCol from '../components/ui/ApiRefTwoCol';

const INCIDENT_DETAILS_PARAMS = [
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'bbox', required: true, type: 'string', desc: 'Bounding box as minLon,minLat,maxLon,maxLat (EPSG:4326). Example: 4.84,52.34,4.95,52.41.' },
  { name: 'fields', type: 'string', desc: 'JSON selector string specifying which response fields to include. Example: {incidents{type,geometry{type,coordinates},properties{iconCategory}}}.' },
  { name: 'language', type: 'string', default: 'en-GB', desc: 'BCP 47 language tag for incident description text. Example: de-DE, fr-FR.' },
  { name: 't', type: 'string', desc: 'Traffic model ID for cache validation. Obtain from the Traffic Model ID endpoint. When provided, the server returns HTTP 304 if data has not changed.' },
  { name: 'expandCluster', type: 'boolean', default: false, desc: 'When true, returns individual incidents instead of cluster groups at lower zoom levels.' },
  { name: 'originalPosition', type: 'boolean', default: false, desc: 'When true, the geometry represents the original reported position of the incident rather than the snapped road position.' },
  { name: 'categoryFilter', type: 'string', desc: 'Comma-separated list of iconCategory codes (0–13) to filter results. Example: 1,2,6 returns accidents, fog, and road works only.' },
  { name: 'timeValidityFilter', type: 'string', default: 'present', values: ['present', 'future', 'past'], desc: 'Filter incidents by temporal validity. present = currently active; future = upcoming; past = recently cleared.' },
];

const INCIDENT_RESPONSE_FIELDS = [
  { name: 'incidents', type: 'FeatureCollection', desc: 'GeoJSON FeatureCollection containing all matching incident features.' },
  { name: 'incidents.features[]', type: 'array', desc: 'Array of GeoJSON Feature objects, one per incident or cluster.' },
  { name: 'features[].type', type: 'string', desc: 'Always "Feature".' },
  { name: 'features[].geometry', type: 'object', desc: 'GeoJSON geometry object. Point for single incidents, LineString for road-length incidents.' },
  { name: 'features[].properties', type: 'object', desc: 'Incident metadata container.' },
  { name: 'properties.id', type: 'string', desc: 'Unique incident identifier.' },
  { name: 'properties.iconCategory', type: 'integer (0–13)', desc: 'Incident type code. 0=Unknown, 1=Accident, 2=Fog, 3=Dangerous Conditions, 4=Rain, 5=Ice, 6=Jam, 7=Lane Closed, 8=Road Closed, 9=Road Works, 10=Wind, 11=Flooding, 12=Broken Down Vehicle, 13=Weather.' },
  { name: 'properties.magnitudeOfDelay', type: 'integer (0–4)', desc: 'Severity of delay. 0=Unknown, 1=Minor (<10 min), 2=Moderate (10–30 min), 3=Major (30–60 min), 4=Undefined (road closed).' },
  { name: 'properties.delay', type: 'integer', desc: 'Estimated delay in seconds caused by this incident.' },
  { name: 'properties.startTime', type: 'string (ISO 8601)', desc: 'Timestamp when the incident started or was first reported.' },
  { name: 'properties.endTime', type: 'string (ISO 8601)', desc: 'Estimated or confirmed time when the incident will be cleared.' },
  { name: 'properties.from', type: 'string', desc: 'Human-readable start location description (road name or landmark).' },
  { name: 'properties.to', type: 'string', desc: 'Human-readable end location description.' },
  { name: 'properties.length', type: 'integer', desc: 'Length of the affected road section in metres.' },
  { name: 'properties.events[]', type: 'array', desc: 'Array of event objects with description, code, and iconCategory fields providing more detail.' },
  { name: 'properties.events[].description', type: 'string', desc: 'Human-readable description of the event in the requested language.' },
  { name: 'properties.events[].code', type: 'integer', desc: 'TPEG event code identifying the type of traffic event.' },
  { name: 'properties.events[].iconCategory', type: 'integer', desc: 'Icon category for this specific event (may differ from the parent incident category).' },
];

const VIEWPORT_PARAMS = [
  { name: 'key', required: true, type: 'string', desc: 'Your TomTom API key.' },
  { name: 'boundingBox', required: true, type: 'string', desc: 'Viewport bounding box as minLat,minLon,maxLat,maxLon. Optimised for map viewport queries.' },
  { name: 'overviewBox', type: 'string', desc: 'A larger overview bounding box for secondary cluster context outside the main viewport.' },
  { name: 'copyRightInformation', type: 'boolean', default: false, desc: 'When true, includes data attribution information in the response.' },
  { name: 'style', type: 'integer', default: 'S3', desc: 'Cluster grouping style. S1=smallest clusters, S3=default, S5=largest clusters.' },
  { name: 'zoom', type: 'integer', desc: 'Map zoom level (0–22). Affects cluster aggregation level.' },
];

const CODE_DETAILS = `curl "https://api.tomtom.com/traffic/services/5/incidentDetails\\
  ?key=YOUR_API_KEY\\
  &bbox=4.84,52.34,4.95,52.41\\
  &language=en-GB\\
  &expandCluster=false"`;

const CODE_DETAILS_RESPONSE = `{
  "incidents": {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [4.8922, 52.3731]
        },
        "properties": {
          "id": "incident-12345",
          "iconCategory": 1,
          "magnitudeOfDelay": 2,
          "delay": 720,
          "startTime": "2025-05-10T08:15:00Z",
          "endTime": "2025-05-10T10:00:00Z",
          "from": "Amstel",
          "to": "Weesperplein",
          "length": 320,
          "events": [
            {
              "description": "Two-vehicle collision blocking one lane",
              "code": 201,
              "iconCategory": 1
            }
          ]
        }
      }
    ]
  }
}`;

const CODE_VIEWPORT = `curl "https://api.tomtom.com/traffic/services/5/incidentViewport\\
  ?key=YOUR_API_KEY\\
  &boundingBox=52.34,4.84,52.41,4.95\\
  &zoom=12\\
  &style=S3"`;

export default function TrafficIncidentDetails({ onNavigate }) {
  return (
    <ApiRefTwoCol
      title="Incident Details"
      description="Retrieve real-time traffic incidents — accidents, road works, closures, weather events — within a bounding box. Returns GeoJSON features with location, severity, delay estimate, and event descriptions. Use the Incident Viewport endpoint for map-aligned queries that return pre-clustered results optimised for a specific zoom level."
      version="v5"
      sections={[
        {
          id: 'incident-details',
          heading: 'Incident Details',
          method: 'GET',
          demoId: 'traffic-incidents',
          note: 'https://api.tomtom.com/traffic/services/5/incidentDetails',
          params: INCIDENT_DETAILS_PARAMS,
          code: CODE_DETAILS,
          lang: 'bash',
        },
        {
          id: 'incident-details-response',
          heading: 'Response',
          params: INCIDENT_RESPONSE_FIELDS,
          code: CODE_DETAILS_RESPONSE,
          lang: 'json',
        },
        {
          id: 'incident-viewport',
          heading: 'Incident Viewport',
          method: 'GET',
          note: 'https://api.tomtom.com/traffic/services/5/incidentViewport — Returns incidents pre-clustered and optimised for a map viewport at a specific zoom level. Useful for rendering incident markers in a mapping SDK without client-side clustering.',
          params: VIEWPORT_PARAMS,
          code: CODE_VIEWPORT,
          lang: 'bash',
        },
      ]}
    />
  );
}
