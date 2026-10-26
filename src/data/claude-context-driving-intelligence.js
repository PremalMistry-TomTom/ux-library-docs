// TomTom Driving Intelligence — AI context file (DRAFT, generated with the pkd-to-docs skill)
// Built from the same sources as the draft pages. Not reviewed. Pre-release: do not publish.

export const DRIVING_INTELLIGENCE_CLAUDE_CONTEXT = `# TomTom Driving Intelligence (DI) — AI context (DRAFT)

> DRAFT. Generated from the DI PKD (live doc v1, step 19368, read 26 Oct 2026, unchanged since
> 22 Oct), the DI technical direction (saved copy, 24 Sep 2026, in review) and a design direction
> from the DI design lead (26 Oct 2026), plus DI engineering's work in progress and the UX Library code
> (read 26 Oct 2026). Not reviewed by the docs team.
> Reactive is in early access, proactive in Alpha. Nothing below is a stable contract. Items marked DIRECTION are not
> signed off. Everything under "PROPOSAL" is a design proposal, not agreed: never present it as
> the contract, and where it differs from the rest of this file, the rest of this file applies.
> Items in "Not yet defined" do not exist yet: do not invent endpoints,
> field names, error codes, limits, package names or versions for them. Everything under "IN ENGINEERING"
> is internal work in progress: describe it as planned, never as a released interface.

---

## What it does

DI is the driving specialist behind a carmaker's assistant. It predicts where a drive is
going, watches the road ahead, answers navigation questions, and returns one structured
answer with its reason. It never talks to the driver: the assistant owns voice, dialogue,
wording and the person; the carmaker's app owns the screen.

Every output is a "moment" that answers three questions:
- Where: where the driver is probably going, and the stop that fits.
- How much: how well the driver knows the road ahead, so the screen knows how much to show.
- When: whether anything is worth saying now, and how long it holds. "Nothing worth saying"
  is the most common answer.

## Status

Reactive answers: early access. Proactive moments and the driver's places: Alpha. Road knowledge:
planned. The car explaining itself: later. Nothing is generally available. No version number, no
public endpoints, no published package. Source: PKD v1 step 19368, read 26 Oct 2026.

## How it fits / who owns what

- Assistant (orchestrator): speech, dialogue, resolving references ("the second one"), wording.
- Carmaker app: embeds and configures the DI SDK; supplies profile, saved places, recent
  destinations, preferences, consent; decides where a moment goes and how it looks.
- DI SDK (Android, depends on the TomTom Maps & Navigation SDK navigation module): subscribes
  to NavSDK, assembles context, runs the on-device driver model, exposes an AIDL service the
  assistant binds to. (DIRECTION)
- DI API (cloud): reasoning over context and TomTom map, traffic, EV, hazard and place data;
  decides whether to speak or stay silent. (DIRECTION)
- NavSDK: positioning, map matching, routing, guidance, most probable path, events ahead.

## Integration paths

| Path | Proactive | Reactive | Personal | Status |
|---|---|---|---|---|
| DI SDK with NavSDK | Yes | Yes | Yes, in the car | Alpha |
| Without NavSDK (Routing API) | To be defined | Yes | To be defined | Open (DI-G10) |
| Cloud only | Only with partner's own prediction | Yes | Only with a privacy agreement (DI-G11) | Direction |
| Partner's own prediction | Monitoring runs on given destination | Yes | Depends | Direction (DI-G17) |
| DI in the Automotive Navigation Application | Yes | Yes | Yes | Planned |

## Capabilities and where they run (cloud/SDK split is OPEN, DI-G9)

- Predict trip (SDK), suggest a favourite (SDK), alerts ahead on the route (cloud with SDK context): Alpha
- Road questions: charge on the way, stop along the route, route status and editing, trip
  planning, parking, find a place (cloud): Early access
- Recommend and explain (cloud): Alpha
- Today against the driver's usual, multi-stop trips, web-search fallback when TomTom search
  is empty, navigation memory (places in alpha, preferences later): Direction
- Insights tied to the trip: Planned. Hands-free explanations: Later (exploratory).
- Not in scope: booking and payment, perception, running the assistant, a consumer app,
  calling DI's engines separately.

## Contract as far as defined

Request (DI-G7): the assistant sends a clean natural-language request ("functional prompt"),
or structured places plus conditions (open on arrival, charge, time window). Format undefined.

Draft message set over the DI SDK's AIDL service (DIRECTION, concept level only):
- Functional prompt: assistant -> DI
- UI command: assistant -> navigation app (not DI)
- DI response: DI -> assistant (typed "String" in the draft; serialisation undefined, DI-G5)
- Proactive event: DI -> assistant

Response content (DIRECTION; names and types undefined, DI-G5): recommendation, reason (a
summary, not internal working), alternative it beat, what changed, evidence, urgency,
validity window (must not be shown after it), say or show, how much screen. Confidence (DI-G31)
and place source / web fallback flag (DI-G20) are undefined. Output is data, never prose.
Output format (own format with A2UI on top, or A2UI directly) is OPEN (DI-G6); the PKD's own
proposal is the first. See PROPOSAL below for proposed field names and rendering.

## Flows

Reactive: driver asks -> assistant sends request -> SDK (or partner) attaches car context ->
cloud calls TomTom engines in order, recovers from failures -> one structured answer ->
assistant phrases it. Budget: a few seconds (design target).

Proactive: NavSDK emits context -> SDK adds app context and destination (entered, predicted
or partner's) -> context sent for evaluation on a schedule while driving -> cloud compares
today with this driver's usual -> usually nothing; otherwise one moment with a better way and
a validity window. Budget: 10-20 s acceptable. Push-on-change comes later. Delivery is DI-G12.

## Gotchas

- Silence is the normal proactive result. Do not treat it as an error or retry.
- No trip history = no prediction = no proactive moments. Fresh installs stay silent.
- A weak prediction may help answer a question but never fires an unprompted moment.
- The DI SDK and NavSDK release separately and NavSDK is not binary compatible across
  versions. Force one NavSDK version; mismatches fail at runtime (NoSuchMethodError,
  AbstractMethodError), not at build time. Run smoke tests against the resolved version.
- Trip history stays on the vehicle. A predicted destination is often the driver's home: it is
  sent only when needed and not labelled as home.
- If DI fails or is slow, the assistant must fall back to its own capabilities.
- DI is not a safety system. Do not describe its output as a safety function (DI-G25).

## Not yet defined (mirrors the draft gap report)

DI-G1 authentication · DI-G2 base URL and operations · DI-G3 SDK package coordinates and supported
NavSDK versions · DI-G4 AIDL service definition · DI-G5 response schema · DI-G6 output format (A2UI) ·
DI-G7 request format · DI-G8 context contract · DI-G9 cloud/SDK split per capability · DI-G10 non-TomTom
navigation stacks · DI-G11 cloud navigation memory and data handling · DI-G12 proactive delivery ·
DI-G13 errors and timeouts · DI-G14 limits and quotas · DI-G15 versioning and changelog ·
DI-G16 environments and testing proactive · DI-G17 passing a partner's own prediction ·
DI-G18 instant commands · DI-G19 alerts when navigation is not open · DI-G20 web-fallback flag ·
DI-G21 editions · DI-G22 platforms beyond Android · DI-G23 MCP access · DI-G24 market coverage ·
DI-G25 intended-use statement · DI-G26 languages · DI-G27 reference widgets · DI-G28 support ·
DI-G29 public product names · DI-G30 technical direction currency · DI-G31 confidence ·
DI-G32 moment schema version · DI-G33 component catalog ownership and versioning ·
DI-G34 A2UI maturity and fallback · DI-G35 proposed moment fields vs the PKD list ·
DI-G36 who gets the UX Library rendering path · DI-G37 "city drive" / "leisure drive" naming ·
DI-G38 which experience principles to publish · DI-G39 how the DI SDK gets navigation data (three
sources disagree) · DI-G40 DI predictions vs the app's existing suggested destinations · DI-G41 key-on
and trip-end signal · DI-G42 consent before storing trip history · DI-G43 the trip-end quality event ·
DI-G44 naming predicted places on or off the device · DI-G45 where moments can appear in a UX Library app.

## Editions (availability only, DIRECTION)

Free (with a TomTom navigation licence): predict trip, suggest a favourite, alerts on an
entered route, road questions up to a request limit (DI-G14) with the first result.
Plus: adds alerts on the predicted route with nothing entered, today against usual, hazards
and closures on the predicted route with a better way, recommend and explain, no request limit.
A third edition is open (DI-G21).

## Glossary

Moment: one DI output (where, how much, when). Free drive: no destination entered.
Proactive / reactive: DI speaks unprompted / the driver asks. Driver model: in-car model of
this driver's trips. Orchestrator: the carmaker's main assistant. Functional prompt: the
request as the assistant passes it to DI. Horizon: NavSDK feature reporting events about
10 km ahead. DI SDK: DI's thin Android client, not NavSDK. A2UI: Agent-to-User Interface, an open protocol
for an agent to describe UI from a catalog of components the app supports. Component catalog:
the approved components an A2UI renderer may draw.

## IN ENGINEERING: work in progress (read 26 Oct 2026). Not released.

Code and recorded engineering decisions rank above the PKD; working design pages count as DIRECTION.

- DI SDK today: Android library in Kotlin, com.tomtom.drivingintelligence:driving-intelligence-sdk 0.0.1,
  minimum Android API 26, compiled against API 35. Internal only: no public API, no NavSDK dependency yet.
  It has on-device trip history (start and end point, departure and arrival time, with a retention policy),
  frequent-place detection for the favourite suggestion, a list of places not to suggest, and destination
  prediction. Debug builds have a developer menu. Not a partner testing path.
- Prediction (defaults, all configurable at setup): trip ends join the nearest place within 150 m; trips
  under 200 m or 2 minutes are dropped; four counts (all trips, from this place, weekday or weekend, two-hour
  window), with few-trip counts trusted less; only places visited twice are scored, unless none has two
  visits; at a top score of 0.40 it returns one to three destinations with a confidence from 0 to 1,
  otherwise "not confident". It also separates invalid input and unreadable history from "not confident".
  Predicted destinations are coordinates; naming them (favourite, place of interest, entered address,
  reverse geocoding) is a separate step (DI-G44). Route variants and usual travel times are not built yet.
- Proactive session, first version (decided): prediction at key-on; while driving the DI SDK calls the
  DI API on a timer with a full snapshot (predicted destination and confidence, position, vehicle profile,
  the route from the previous answer, notifications already sent); the API plans the route, filters, always
  returns the route and adds a notification only when worth telling; driving off the predicted route ends
  the session; the API keeps no state. Horizon road events come later. The SDK will give the app one
  notification stream (start, stop, state, events); the shape can change. Interval and delivery to the
  assistant are open (DI-G12).
- DI in the Automotive Navigation Application (working design): one component, behind a configuration
  flag, the only part depending on the DI SDK; it uses the app's component interfaces; DI pulls context
  from providers the integration registers (position, speed, gear, home, work), on DI's own heartbeat;
  messages for the driver go to the assistant; screen changes go through the app's voice path. Proactive
  only: reactive requests get their own entry point (an MCP tool or a standalone endpoint), owned by the
  assistant. Outside the app, the Client Integration Library gives no arrival event, vehicle data or
  consent, and cannot add to the app's search results. No ignition signal is read yet (DI-G41); consent
  is undecided (DI-G42).
- How the SDK gets navigation data is a conflict (DI-G39): the technical direction subscribes to NavSDK;
  the engineering design binds providers; the SDK code plans its own NavSDK navigation instance through a
  factory NavSDK has deprecated, removal planned after February 2027.
- DI API: being reshaped for an assistant to call. Each call stands alone with the request (without the
  conversation) and context (vehicle, route and its state: none, planning, active; driver; locale). It
  returns a status, structured data (places, routes, range, traffic) and a short English summary note;
  no voice. Field names are not published (DI-G5).
- Planned, not approved: one anonymous trip-end event for prediction quality (shown or quiet, first guess
  right and rank, confidence band, known or new place; no coordinates, IDs or timestamps) (DI-G43).

## UX Library today (from its code, read 26 Oct 2026)

An app built on the UX Library is its own DI integrator: the UX Library has no public way to add a
component. Public API: current location, home, work, recents, and suggested destinations (Alpha;
rule-based, learned from navigated trips only, distance but no arrival time). The app can put its own
search panel on the main screen and owns one Mini app slot (the search panel; a single row while driving
without a route, upcoming events below). The Mini guidance panel is view-only; only the largest Mini size
takes touch. Route progress has distances only: no arrival time or traffic delay. The cluster is view-only
and empty until a trip is active. The Route Bar is planned, not available (DI-G45).

## PROPOSAL: design direction (26 Oct 2026). Not agreed.

Ranked below the PKD and the technical direction. The PKD applies wherever they differ (conflicts
are listed in the gap report). Use this to explain the proposal, never as the contract.

- The moment is the unit. DI sends each moment once, in DI's own schema, and never outputs UI
  components.
- Proposed moment fields (names only; types and values undefined, DI-G5, DI-G35):
  trigger (road = nobody asked, or request) · speak (whether to speak at all) · where
  (destination, via) · usual and better (arrival times, minutes saved) · why (the reason) ·
  familiarity (how well the driver knows the road; known road = shorter message) ·
  valid_until (when the moment expires, e.g. a junction) · actions (e.g. go, not_today).
  Differences from the PKD list: no urgency; speak covers only part of "say or show";
  "alternative it beat" only as the usual route; validity as a place. The PKD list applies.
- Illustrative moment only, not an API, no schema version (DI-G32): a London commute where a
  jam on the A406 makes the M1 and M25 22 minutes faster (09:02 vs 09:24), valid until
  Staples Corner, actions go / not_today.
- Rendering: partners that also license UX Library get a mapping in the DI SDK, on the device,
  from the moment to A2UI against the UX Library component catalog, drawn by the A2UI Compose
  renderer. Partners without UX Library (including voice-only assistants) draw or speak the
  moment themselves. Caveats: A2UI Compose libraries are alpha (1.0.0-alpha01), fallback is the
  same mapping calling the composables directly (DI-G34); catalog changes need a version bump on
  both sides (DI-G33); a restricted catalog of approved components is the boundary, no
  generated free-form UI. The PKD plans DI choosing components as a later step (DI-G36).
- Free drive with no navigation app open (DI-G19, proposed owner: DI design lead): draw the same
  moment once per surface. Assistant's own widget: every field. Minimised state with the UX
  Library route bar: where, usual, better, why, valid_until, no buttons. Cluster tile: where,
  usual, better, actions. Voice: speak, where, better, why, familiarity, actions.
- Road-triggered proactive flow: the road starts it; DI is the trigger for the assistant and
  decides whether a moment is worth an interruption. Delivery still follows the PKD: scheduled
  asking first, push later (DI-G12).
- Two drives, one engine: city drive (everyday, proactive first, barely visible) and leisure
  drive (planned trip, reactive first, full navigation). DI is still called as one tool.
  Names not agreed (DI-G37).
- Edge before cloud: the routine is learned in the car and personal data stays there. The PKD
  still allows cloud-held memory for cloud-only partners with a privacy agreement (DI-G11).
- "The agent decides how to reach the driver. DI decides whether it's worth it. The design
  system decides how it looks." App Functions and MCP tools are the likely ways in (DI-G23).
- Principles: six, ending "Design by level, not by trust", without "Predictable screen". The
  PKD's seven apply (DI-G38).

## Links (draft pages)

di-intro · di-quickstart · di-concepts · di-integration-paths · di-flows · di-designing ·
di-capabilities · di-sdk-interface · di-context · di-response-contract · di-errors ·
di-glossary · di-gap-report

Use cases (each one moment worked end to end; the moments shown are illustrative, not the contract):
di-use-cases · di-uc-faster-way · di-uc-closure · di-uc-save-place · di-uc-charger · di-uc-coffee ·
di-uc-open-on-arrival
`;

export function downloadDrivingIntelligenceContext() {
  const blob = new Blob([DRIVING_INTELLIGENCE_CLAUDE_CONTEXT], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tomtom-driving-intelligence.md';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
