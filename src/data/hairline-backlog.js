/* Proposed hairline figures for the Icon thumbnails that have none yet.
 *
 * One entry per Icon that scripts/audit-hairline.mjs reports as a gap. Each
 * concept follows the tomtom-hairline skill: one object, what the pointer does
 * to it, what the read-out says. Draw one with the skill, add it to
 * public/hairline-local/figures/, map the Icon in src/illustrations/hairline.jsx,
 * then delete its entry here and re-run the audit.
 *
 * priority: 1 = an API or SDK intro page has no figure for this card at all;
 *           2 = discovery / landing cards only; 3 = UX Library internals. */
/* Figures planned to break up same-page repeats: cards already name these slugs
   (the fourth argument of makeThumb) and switch to them once they are drawn. */
export const HAIRLINE_REPEAT_PLAN = [
  { slug: 'nav/camera',          name: 'Camera Orbit',   for: 'Map camera & animations',
    concept: 'A small camera on a curved rail arcing over a map tile; the pointer slides it along the arc and its lens edge lights, the tile tilting to follow.', readout: 'tilt 40' },
  { slug: 'nav/location-engine', name: 'Sensor Stack',   for: 'Custom location engine',
    concept: 'A position puck fed by three sensors standing beside it (a dish, a wheel, a gyro ring); the pointer picks a source and its link to the puck lights.', readout: 'wheel' },
  { slug: 'nav/route-import',    name: 'Route Sleeve',   for: 'Import, export & modify routes',
    concept: 'A thin card with a route line on it, half in a folder sleeve; the pointer pulls it out and the route on it lights.', readout: 'out' },
  { slug: 'nav/replan',          name: 'Detour',         for: 'Continuous replanning',
    concept: 'A road with a barrier across it; as the pointer nears the barrier the route re-forms round it along a side street, bright.', readout: 'detour' },
  { slug: 'nav/safety-camera',   name: 'Speed Camera',   for: 'Safety locations',
    concept: 'A camera post beside a road with a zone strip on the road before it; the pointer moves the car puck and the zone lights as it enters.', readout: 'in zone' },
  { slug: 'nav/resume',          name: 'Pause Point',    for: 'Saving & resuming navigation',
    concept: 'A route from a puck to a pin with a bookmark marker standing on it; the pointer moves the marker along and the route behind it lights.', readout: 'saved' },
  { slug: 'nav/offline-routing', name: 'Pocket Route',   for: 'Offline routing',
    concept: 'The open drawer from Saved Region holding one map tile; the pointer over the tile draws a route across it, bright.', readout: 'route' },
  { slug: 'nav/map-update',      name: 'Patch Tile',     for: 'Incremental map updates',
    concept: 'A 3×3 grid of map tiles; the tile under the pointer lifts out and a fresh one drops into its place.', readout: 'tile 5' },
  { slug: 'nav/adas-data',       name: 'Road Profile',   for: 'ADAS data',
    concept: 'A road ahead with a raised ribbon above it tracing its gradient and curve; the pointer scrubs a marker along and the profile under it lights.', readout: '+4%' },
  { slug: 'nav/speed-alert',     name: 'Limit Ring',     for: 'Speed alerts',
    concept: 'A round sign on a post beside the road (a ring, no digits); as the pointer brings the car puck near, the ring’s rim lights.', readout: 'near' },
  { slug: 'nav/logging',         name: 'Black Box',      for: 'Logging & diagnostics',
    concept: 'A small recorder box with a strip of trace paper running out of it, dots along it for events; the pointer along the strip lights an event.', readout: 'event 3' },
  { slug: 'nav/vehicle-profile', name: 'Measured Car',   for: 'Vehicle metadata',
    concept: 'A car framed by dashed dimension guides for its length, width and height; the pointer picks one and that guide lights.', readout: 'height' },
  { slug: 'nav/carplay',         name: 'Head Unit',      for: 'CarPlay navigation',
    concept: 'A dashboard with a wide head-unit screen and a phone docked beside it on a cable; the pointer over the phone lights the route on the screen.', readout: 'linked' },
  { slug: 'nav/hillshade',       name: 'Relief Tile',    for: 'Hillshade tiles',
    concept: 'A map tile whose surface is a field of ridges; the pointer sets the sun’s direction and the ridges’ lit side swings round (a field answer, like Terrain).', readout: 'sun 135' },
  { slug: 'nav/map-image',       name: 'Map Print',      for: 'WMS map images',
    concept: 'A server box with one map sheet sliding out of a slot like a print; the pointer pulls the sheet out and its edge lights.', readout: 'sheet' },
  { slug: 'nav/toll',            name: 'Toll Gate',      for: 'Toll costs',
    concept: 'A road through a small toll booth with a barrier arm; the pointer nears and the arm lifts, bright.', readout: 'open' },
  { slug: 'nav/poi-details',     name: 'Open Sign',      for: 'POI details',
    concept: 'A shop front with a hanging sign plate (no letters); the pointer flips the plate over and the door behind it lights.', readout: 'open' },
];

export const HAIRLINE_BACKLOG = [
  // ── Search & geocoding ──
  { icon: 'IcoSearchAutocomplete', priority: 1, name: 'Type Ahead',       slug: 'nav/autocomplete',
    concept: 'A search bar slab with three suggestion chips stacked under it; the chip under the pointer lifts and lights, the others settle back.', readout: 'pick 2' },
  { icon: 'IcoSearchNearby',       priority: 1, name: 'Radius Sweep',     slug: 'nav/nearby',
    concept: 'A position puck with a ring on the ground and pins scattered round it; the pointer sets the radius and the pins inside it rise.', readout: '4 inside' },
  { icon: 'IcoSearchAlongRoute',   priority: 1, name: 'Roadside Finds',   slug: 'nav/along-route',
    concept: 'A road with a dashed corridor either side; pins stand inside and outside it, and the ones in the corridor near the pointer rise.', readout: 'stop 2' },
  { icon: 'IcoReverseGeocode',     priority: 1, name: 'Pin to Door',      slug: 'nav/reverse-geocode',
    concept: 'A map pin over a row of three houses; the house under the pointer gets the pin and its door plate lights (no numbers).', readout: 'house 2' },
  { icon: 'IcoPOIPhotos',          priority: 1, name: 'Shop Snaps',       slug: 'nav/poi-photos',
    concept: 'A small shop with a fan of photo cards standing beside it; the card under the pointer stands up (riffle).', readout: 'photo 3' },

  // ── Routing ──
  { icon: 'IcoBatchRouting',       priority: 1, name: 'Route Deck',       slug: 'nav/batch',
    concept: 'A deck of thin route cards, each with a route line, fanned on a tray; the card under the pointer stands up, neighbours part by distance.', readout: 'route 4' },
  { icon: 'IcoSnapToRoads',        priority: 1, name: 'Snap Line',        slug: 'nav/snap-to-roads',
    concept: 'A road with a scatter of GPS dots beside it; the pointer passes along and the dots near it pull onto the road and join into a bright line.', readout: '12 snapped' },

  // ── Traffic & analytics ──
  { icon: 'IcoTrafficModelID',     priority: 1, name: 'Snapshot Stack',   slug: 'nav/traffic-model',
    concept: 'Three thin traffic sheets stacked like dated snapshots, each with a tab; the pointer picks one, it slides out and its tab lights.', readout: 'snap 2' },
  { icon: 'IcoJunctionAnalytics',  priority: 1, name: 'Counting Junction', slug: 'nav/junction',
    concept: 'A crossroads with a short counter post on each arm; the arm under the pointer lights and its post rises with the count.', readout: 'arm N' },

  // ── EV ──
  { icon: 'IcoEVChargingAvailability', priority: 1, name: 'Open Sockets', slug: 'nav/ev-availability',
    concept: 'A charging post with three sockets on its face, one with a plug in; the socket under the pointer lights if free, the busy one stays dim.', readout: 'socket 2' },
  { icon: 'IcoEVRequirements',     priority: 2, name: 'Plug Fit',         slug: 'nav/ev-requirements',
    concept: 'A connector plug hovering over its socket; the pointer lowers it and the pins line up and seat, the bright edge on the matched pin.', readout: 'fit' },

  // ── Parking & fuel ──
  { icon: 'IcoParkingPrices',      priority: 1, name: 'Meter Post',       slug: 'nav/parking-prices',
    concept: 'A parking meter on a post beside a bay, with a dial on its head; the pointer sets the stay and the dial hand sweeps, the bay lights.', readout: '2 h' },
  { icon: 'IcoOnStreetParking',    priority: 1, name: 'Kerbside',         slug: 'nav/on-street',
    concept: 'A street with a row of kerbside bays, a short bar standing in each; the bars near the pointer rise by their chance of being free.', readout: 'bay 3' },
  { icon: 'IcoFuelPrices',         priority: 1, name: 'Pump Stand',       slug: 'nav/fuel-prices',
    concept: 'A fuel pump with a hose and nozzle on a small forecourt; the pointer lifts the nozzle from its holster and the pump face lights.', readout: 'pump 1' },

  // ── Voice & AI ──
  { icon: 'IcoAIVoice',            priority: 2, name: 'Voice Puck',       slug: 'nav/ai-voice',
    concept: 'A round speaker puck on a dashboard with sound rings rising from it; the pointer near it makes the rings swell outward, the newest bright.', readout: 'speaking' },
  { icon: 'IcoVoiceEngine',        priority: 2, name: 'Speaker Grille',   slug: 'nav/voice-engine',
    concept: 'A car door speaker with a round grille of dots; the dots near the pointer push out like a cone moving, in a ripple.', readout: 'level 3' },
  { icon: 'IcoSpeechToText',       priority: 2, name: 'Mic Ribbon',       slug: 'nav/speech-to-text',
    concept: 'A small microphone whose sound waves straighten into a flat ribbon beside it; the pointer along the ribbon lights the words so far (no letters, dashes).', readout: 'word 4' },
  { icon: 'IcoConversationPersonality', priority: 2, name: 'Two Voices',  slug: 'nav/personality',
    concept: 'Two chat bubbles of different shapes, one round and one squared, on a slab; the pointer picks one, it lifts and its tail lights.', readout: 'voice 1' },

  // ── UX Library internals ──
  { icon: 'IcoColourSystem',       priority: 3, name: 'Swatch Fan',       slug: 'nav/colour-system',
    concept: 'A fan of swatch cards pinned at one corner; the card under the pointer swings out from the fan.', readout: 'swatch 3' },
  { icon: 'IcoMapStyle',           priority: 3, name: 'Day Night Tile',   slug: 'nav/map-style',
    concept: 'A map tile on a pivot, a day face on top and night under; the pointer tilts it over to show the other face.', readout: 'night' },
  { icon: 'IcoThemingTokens',      priority: 3, name: 'Token Blocks',     slug: 'nav/theming',
    concept: 'A row of small token blocks in a tray beside a UI panel; the block under the pointer lifts and the panel edge it drives lights.', readout: 'token 2' },
  { icon: 'IcoSearchResult',       priority: 3, name: 'Result Rows',      slug: 'nav/search-result',
    concept: 'A list slab with three result rows, each with a pin dot; the row under the pointer rises out of the list.', readout: 'row 1' },
];
