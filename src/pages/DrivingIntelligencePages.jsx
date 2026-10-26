/* ─────────────────────────────────────────────────────────────────────────────
 * Driving Intelligence — DRAFT developer docs (generated with the pkd-to-docs skill)
 * Sources: PKD live doc v1, step 19368 (read 26 Oct 2026, unchanged since 22 Oct), technical direction
 * (saved 24 Sep 2026), design direction from the DI design lead (26 Oct 2026, every item PROPOSAL),
 * vision deck (8 Oct 2026), and DI engineering's SDK code, design pages and recorded decisions (read 26 Oct
 * 2026, shown as In engineering blocks). Not reviewed by the docs team. Pre-release: do not publish.
 * ───────────────────────────────────────────────────────────────────────────── */
import { useState } from 'react';
import PageActions from '../components/ui/PageActions';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import { ApiLinks } from '../components/ui/ApiLinks';
import { Figure, SequenceDiagram, LayerDiagram, StepsDiagram } from '../components/diagrams/Diagrams';
import { downloadDrivingIntelligenceContext } from '../data/claude-context-driving-intelligence';
import {
  DI_SOURCES, DI_SHAPE, DI_GAPS, DI_CONFLICTS, DI_TEMPLATE_GAPS, DI_SCREENED, DI_FOLLOWUPS,
} from '../data/gaps-driving-intelligence';

const PRODUCT = 'driving-intelligence';
const SOURCE = 'PKD (live doc v1, step 19368, read 26 Oct 2026), technical direction (saved copy, 24 Sep 2026), a design proposal (26 Oct 2026) and DI engineering\'s work in progress (read 26 Oct 2026)';

/* ─── Shared draft helpers ─────────────────────────────────────────────────── */

export function DraftBanner({ onNavigate }) {
  return (
    <div className="draft-banner" data-draft-banner style={{
      display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 14px', margin: '0 0 18px',
      border: '1px dashed var(--b-hi)', borderRadius: 10, background: 'var(--s1)', fontSize: '0.8125rem', color: 'var(--mid)',
    }}>
      <strong style={{ color: 'var(--black)', whiteSpace: 'nowrap' }}>Draft</strong>
      <span>
        Generated from the {SOURCE} with the pkd-to-docs skill. Not reviewed by the docs team. Reactive answers are in early access; the rest of Driving Intelligence is in alpha or planned. Blocks marked Proposal are not agreed; blocks marked In engineering describe work in progress, not a released interface.{' '}
        <a href="#" onClick={e => { e.preventDefault(); onNavigate?.('di-gap-report', PRODUCT); }} style={{ color: 'var(--brand)' }}>See what's still open</a>.
      </span>
    </div>
  );
}

function Direction({ children }) {
  return <Callout type="warn"><strong>Direction, not final.</strong> {children}</Callout>;
}

// Content from the DI design lead's design direction (26 Oct 2026). Ranked below the PKD and the
// technical direction; where it conflicts with the PKD, the PKD applies and the conflict is a gap.
function Proposal({ children }) {
  return (
    <div data-proposal style={{
      margin: '14px 0', padding: '12px 16px 14px', borderRadius: 10,
      border: '1px solid var(--info-border)', borderLeft: '4px solid var(--info-border)', background: 'var(--info-bg)',
    }}>
      <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--info-text)', marginBottom: 6 }}>
        Proposal, not agreed · design direction, 26 Oct 2026
      </div>
      {children}
    </div>
  );
}

// Content from DI engineering (read 26 Oct 2026): the DI SDK code (0.0.1, no public API yet), the engineering
// design for DI in the Automotive Navigation Application, and recorded engineering decisions. Code and recorded
// decisions rank above the PKD; a working design page counts as direction. Nothing here is released.
function Engineering({ children }) {
  return (
    <div data-engineering style={{
      margin: '14px 0', padding: '12px 16px 14px', borderRadius: 10,
      border: '1px solid var(--border)', borderLeft: '4px solid var(--success-border)', background: 'var(--s1)',
    }}>
      <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--success-text)', marginBottom: 6 }}>
        In engineering, not released · DI engineering, read 26 Oct 2026
      </div>
      {children}
    </div>
  );
}

function Gap({ id, children }) {
  return (
    <div data-gap={id} style={{ padding: '12px 14px', margin: '12px 0', border: '1px dashed var(--border)', borderRadius: 10, color: 'var(--muted)', fontSize: '0.8125rem' }}>
      <strong style={{ color: 'var(--mid)' }}>To be defined</strong> · {children} <code>{id}</code>
    </div>
  );
}

function Section({ id, title, children }) {
  return (
    <div className="zone">
      <h2 className="sh" id={id}>{title}</h2>
      {children}
    </div>
  );
}

function Table({ head, rows }) {
  return (
    <table className="prop-table">
      <thead><tr>{head.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>
        ))}
      </tbody>
    </table>
  );
}

const STATUS_COLORS = {
  'Defined': 'var(--success-text)',
  'Direction': 'var(--warn-text)',
  'To be defined': 'var(--muted)',
  'Alpha': 'var(--warn-text)',
  'Early access': 'var(--warn-text)',
  'Later': 'var(--muted)',
  'Exists': 'var(--success-text)',
  'Planned': 'var(--muted)',
  'Exploratory': 'var(--muted)',
  'Open': 'var(--danger-text)',
  'Proposal': 'var(--info-text)',
  'In engineering': 'var(--success-text)',
};

function Status({ s }) {
  return (
    <span style={{
      display: 'inline-block', padding: '1px 8px', borderRadius: 6, fontSize: '0.6875rem', fontWeight: 700,
      border: '1px solid var(--border)', color: STATUS_COLORS[s] || 'var(--mid)', whiteSpace: 'nowrap',
    }}>{s}</span>
  );
}

function NavButton({ onNavigate, pageId, primary, children }) {
  return (
    <button
      onClick={() => onNavigate?.(pageId, PRODUCT)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer',
        padding: '7px 18px', borderRadius: 6, fontWeight: 600, fontSize: '0.875rem',
        background: primary ? 'var(--brand)' : 'transparent',
        color: primary ? '#fff' : 'var(--black)',
        border: primary ? '1.5px solid var(--brand)' : '1.5px solid var(--border)',
      }}
    >{children}</button>
  );
}

function DownloadAIContextBtn() {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={() => { downloadDrivingIntelligenceContext(); setDone(true); setTimeout(() => setDone(false), 2500); }}
      title="Download a structured markdown file for use as context in any AI assistant"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', color: 'var(--black)',
        border: '1.5px solid var(--border)', padding: '7px 18px', borderRadius: 6, fontWeight: 600,
        fontSize: '0.875rem', cursor: 'pointer',
      }}
    >{done ? 'Downloaded' : 'Download AI context'}</button>
  );
}

function Steps({ items }) {
  return (
    <ol style={{ paddingLeft: 20, display: 'grid', gap: 8 }}>
      {items.map((it, i) => <li key={i}>{it}</li>)}
    </ol>
  );
}

const NAVSDK_LINKS = [
  { type: 'Android SDK', name: 'Maps & Navigation SDK', description: 'The DI SDK depends on its navigation module and map data. Version to be defined (DI-G3).', pageId: 'navsdk-intro', productId: 'navsdk' },
  { type: 'Android SDK', name: 'Virtual Horizon', description: 'Reports events about 10 km ahead; DI looks further and decides what is worth saying.', pageId: 'navsdk-horizon', productId: 'navsdk' },
];

/* ─── Introduction ─────────────────────────────────────────────────────────── */

export function DIIntro({ onNavigate }) {
  return (
    <div className="page">
      <h1>Driving Intelligence</h1>
      <PageActions />
      <DraftBanner onNavigate={onNavigate} />
      <p className="quick-answer">
        Driving Intelligence (DI) is the driving specialist behind a carmaker's assistant: it predicts where a drive is going,
        watches the road ahead, answers navigation questions, and returns one structured answer with its reason, which your
        assistant and screen turn into words and pixels.
      </p>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '0 0 24px' }}>
        <NavButton onNavigate={onNavigate} pageId="di-quickstart" primary>Getting started</NavButton>
        <NavButton onNavigate={onNavigate} pageId="di-integration-paths">Integration paths</NavButton>
        <DownloadAIContextBtn />
      </div>

      <ApiLinks onNavigate={onNavigate} title="Products DI builds on" items={[
        ...NAVSDK_LINKS,
        { type: 'REST API', name: 'Routing API', description: 'Used when there is no NavSDK in the car. That path is still open (DI-G10).', pageId: 'routing-api-intro', productId: 'routing-api' },
      ]} />

      <Section id="when-to-choose" title="When to choose DI">
        <p>Choose DI when your assistant needs the answer, not the raw material for one. Ask the Search API for chargers along a route and you get a list; ask DI and you get the charger to use, why, and the option it beat, checked against traffic, charge and arrival time.</p>
        <Table head={['Use DI when…', 'Use the APIs directly when…']} rows={[
          ['Your assistant should get one recommendation it can say in a sentence.', 'Your own code ranks results and draws them.'],
          ['You want alerts on drives where nothing was entered.', 'You only need data for a route the driver set.'],
          ['Stops must work at arrival time: open, charged, worth the detour.', 'You need a full list of places or chargers.'],
        ]} />
        <p>DI never talks to the driver. Your assistant owns the voice, the conversation and the person; DI is one tool it calls for anything about the drive.</p>
        <Gap id="DI-G25">Approved intended-use statement. DI is not a safety system; wording for safety-relevant moments needs sign-off.</Gap>
      </Section>

      <Section id="use-cases" title="Key use cases">
        <Table head={['The driver experiences…', 'What DI does']} rows={[
          ['Gets in; nothing entered. "Off to school, then work?"', 'Predicts the trip at key-on from this driver\'s history.'],
          ['"A10 closed, going via the A5 today."', 'Watches the usual route against today\'s traffic, closures and hazards, and speaks only when today is different.'],
          ['"A charger on the way that still gets me in before nine."', 'Answers one question with one recommendation, the reason and the option it beat.'],
          ['"Somewhere to eat on the way that\'s open when I get there."', 'Checks opening hours, charge and traffic against the arrival time.'],
          ['"Save this as the office?"', 'Spots places the driver keeps stopping at and hands them to the assistant to name.'],
        ]} />
        <p style={{ color: 'var(--muted)', fontSize: '0.8125rem' }}>Examples are from the product description and are illustrative.</p>
      </Section>

      <Section id="capabilities" title="Capabilities">
        <Table head={['Part', 'What it covers', 'Status']} rows={[
          ['Proactive', 'Trip prediction, monitoring the predicted or entered route, alerts only when today is different, favourite nudges.', <Status s="Alpha" />],
          ['Reactive', 'Road questions: charge on the way, stops along the route, route status and editing, trip planning, parking, finding a place, multi-stop trips.', <Status s="Early access" />],
          ['Personal', 'The driver\'s places and what they call them, with a nudge to save them (alpha). Preferences come later.', <Status s="Alpha" />],
          ['Road knowledge', 'Patterns and events turned into advice for this drive, always with what it is based on.', <Status s="Planned" />],
          ['The car explains itself', 'Explaining what assisted driving is doing ahead.', <Status s="Later" />],
        ]} />
        <p><a href="#" onClick={e => { e.preventDefault(); onNavigate?.('di-capabilities', PRODUCT); }} style={{ color: 'var(--brand)' }}>See every capability and where it runs</a>.</p>
      </Section>

      <Section id="architecture" title="Architecture">
        <p>DI is a cloud API and a thin in-car SDK. The API does the reasoning and everything reactive. The SDK runs in the car: it collects context, runs the driver model, and lets DI speak up unprompted.</p>
        <Figure title="Where DI sits" status="Direction"
          caption="Your assistant owns the driver and the screen; DI sits behind it and returns one structured answer. Which capabilities run in the SDK or the cloud is still open (DI-G9), and so are platforms beyond Android (DI-G22).">
          <LayerDiagram label="Driving Intelligence architecture: the driver talks to the carmaker's assistant and app, which call the DI SDK in the car, which works with the Maps and Navigation SDK and calls the DI API in the TomTom cloud, which uses TomTom engines." layers={[
            { label: 'Driver', boxes: [{ label: 'Driver', sub: 'Talks, taps, drives', tone: 'person' }], link: 'Voice and taps' },
            { label: 'Your side', owner: 'Carmaker', boxes: [
              { label: 'Assistant', sub: 'Voice, conversation, wording', tone: 'partner' },
              { label: 'App and screen', sub: 'Where a moment goes, how it looks', tone: 'partner' },
            ], link: 'Requests in; answers and moments out' },
            { label: 'In the car', owner: 'TomTom SDKs', boxes: [
              { label: 'DI SDK', sub: 'Context, driver model, the service your assistant binds to', tone: 'tomtom' },
              { label: 'Maps & Navigation SDK', sub: 'Position, route, events ahead', tone: 'external' },
            ], link: 'Car context in; structured answers out' },
            { label: 'TomTom cloud', owner: 'TomTom', boxes: [
              { label: 'DI API', sub: 'Decides what is worth saying, combines engines', tone: 'tomtom' },
              { label: 'TomTom engines', sub: 'Routing, traffic, search, EV, maps', tone: 'external' },
            ] },
          ]} />
        </Figure>
        <Table head={['Part', 'Owns']} rows={[
          ['Your assistant (orchestrator)', 'Voice, dialogue, wording, the person. Calls DI and decides what to say.'],
          ['Your application', 'Embeds and configures the DI SDK; supplies profile, saved places, recent destinations, preferences and consent.'],
          ['DI SDK (Android)', 'Subscribes to NavSDK, assembles context, runs the on-device driver model, exposes the service your assistant binds to.'],
          ['DI API (cloud)', 'Reasons over context and TomTom map, traffic, EV, hazard and place data; decides whether anything is worth saying.'],
          ['Maps & Navigation SDK', 'Positioning, map matching, routing, guidance, events along the route. No DI-specific logic.'],
        ]} />
        <Direction>The split above comes from the technical direction draft. The DI SDK is described as Android only and dependent on NavSDK.</Direction>
        <Gap id="DI-G22">Platforms other than Android.</Gap>
      </Section>

      <Section id="editions" title="Editions">
        <p>Availability by edition. Prices are not part of these docs.</p>
        <Table head={['Capability', 'Free', 'Plus']} rows={[
          ['Predict trip', 'Yes', 'Yes'],
          ['Suggest a favourite', 'Yes', 'Yes'],
          ['Alerts on an entered route', 'Yes', 'Yes'],
          ['Alerts on the predicted route, with nothing entered', '—', 'Yes'],
          ['Today against your usual, and a route that still gets you there on time', '—', 'Yes'],
          ['Hazards and closures on the predicted route, with a better way', '—', 'Yes'],
          ['Recommend and explain', '—', 'Yes'],
          ['Road questions', 'Up to a request limit, first result', 'No request limit'],
        ]} />
        <Direction>Free requires a TomTom navigation licence. A third edition, Premium, is still open.</Direction>
        <Gap id="DI-G14">The Free request limit and any rate limits.</Gap>
        <Gap id="DI-G21">Final edition names and Premium contents.</Gap>
      </Section>

      <Section id="status" title="Status and versions">
        <p>Reactive answers are available to <strong>early-access</strong> partners. Proactive moments, and the driver's places, are in <strong>Alpha</strong>. Road knowledge is planned, and the car explaining itself comes later. Nothing is generally available yet, and there is no version number.</p>
        <Gap id="DI-G15">How DI and its response schema are versioned, and where changes are announced.</Gap>
        <Gap id="DI-G24">Markets where DI is available.</Gap>
      </Section>

      <Section id="base-url-auth" title="Base URL and authentication">
        <Table head={['', '']} rows={[
          ['Base URL', <Gap id="DI-G2">Base URL and operations.</Gap>],
          ['Authentication', <Gap id="DI-G1">How partners authenticate and get keys.</Gap>],
          ['SDK package', <Gap id="DI-G3">Package coordinates and supported NavSDK versions.</Gap>],
          ['Status', 'Alpha'],
        ]} />
      </Section>
    </div>
  );
}

/* ─── Getting started ──────────────────────────────────────────────────────── */

export function DIQuickstart({ onNavigate }) {
  return (
    <div className="page">
      <h1>Getting Started</h1>
      <PageActions />
      <DraftBanner onNavigate={onNavigate} />
      <p className="quick-answer">
        Getting started means adding the DI SDK to an Android app that already uses the Maps & Navigation SDK, letting your
        assistant bind to the DI service, and sending a first request; most concrete steps are still to be defined.
      </p>

      <ApiLinks onNavigate={onNavigate} title="Products used on this page" items={[
        { type: 'Android SDK', name: 'Navigation quickstart', description: 'Set up NavSDK first; the DI SDK subscribes to its events.', pageId: 'navsdk-nav-quickstart', productId: 'navsdk' },
      ]} />

      <Section id="prerequisites" title="Before you start">
        <ul>
          <li>An Android in-car app that uses the Maps & Navigation SDK navigation module. The DI SDK reads map-matched position and route context from it.</li>
          <li>An assistant (your own or a partner's) that can bind to an Android service and call DI as a tool.</li>
          <li>Access to DI: early access for reactive answers, the alpha for proactive moments. <Gap id="DI-G16">How to request access and which environments exist.</Gap></li>
        </ul>
        <p>No NavSDK in your car? See <a href="#" onClick={e => { e.preventDefault(); onNavigate?.('di-integration-paths', PRODUCT); }} style={{ color: 'var(--brand)' }}>Integration paths</a>.</p>
      </Section>

      <Section id="project-setup" title="Project setup">
        <p>Add the DI SDK as a dependency alongside NavSDK.</p>
        <Gap id="DI-G3">Repository, artifact name, minimum Android API level and supported NavSDK versions.</Gap>
        <Engineering>
          <p style={{ margin: 0 }}>Today's build is an Android library in Kotlin (no Kotlin Multiplatform), published as <code>com.tomtom.drivingintelligence:driving-intelligence-sdk</code>, version <code>0.0.1</code>. It runs on Android API 26 and up and compiles against API 35. Its features are internal for now: the public setup API comes later, and the library doesn't depend on NavSDK yet (DI-G39).</p>
        </Engineering>
        <Direction>The DI SDK is released separately from NavSDK. Your app must force a single NavSDK version that the DI SDK release supports: a mismatch can build cleanly and fail at runtime.</Direction>
      </Section>

      <Section id="authentication" title="Authentication">
        <Gap id="DI-G1">How the DI SDK and the DI API authenticate, and how you get credentials.</Gap>
      </Section>

      <Section id="init-and-bind" title="Initialise the SDK and bind your assistant">
        <Steps items={[
          'Your app embeds and configures the DI SDK and supplies the context only it holds: active profile, saved places, recent destinations, preferences, consent.',
          'The DI SDK exposes an Android (AIDL) service. Your assistant binds to it; you do not define or maintain the interface.',
          'The same channel carries requests from your assistant and DI\'s answers back, including moments your assistant did not ask for.',
        ]} />
        <Direction>From the technical direction draft. The integration cost is described as a dependency and a manifest entry.</Direction>
        <Gap id="DI-G4">Service name, manifest entries, permissions and method signatures.</Gap>
      </Section>

      <Section id="first-request" title="Your first request">
        <p>Your assistant handles speech and dialogue, resolves references such as "the second one", and passes DI a clean navigation request, for example:</p>
        <CodeBlock label="Illustrative request text" code={'A charger on the way that still gets me in before nine.'} language="bash" />
        <p>DI returns one structured answer: the recommendation, the reason, the option it beat, urgency, how long it is valid, whether to say or show it, and how much screen it needs. Your assistant writes the words.</p>
        <Gap id="DI-G7">Request format: natural-language text, structured places and conditions, or both.</Gap>
        <Gap id="DI-G2">The operation to call. No cURL is shown because no endpoint exists yet.</Gap>
      </Section>

      <Section id="first-proactive" title="Your first proactive moment">
        <p>Proactive moments need trip history. On a fresh install DI has no history, so it predicts nothing and stays silent. Saved home, work and favourites narrow the candidates but do not replace observed trips.</p>
        <Engineering>
          <p style={{ margin: 0 }}>Debug builds of the DI SDK include a developer menu for trying the trip history and the favourite suggestion before they have a public API. Engineering checks prediction by replaying recorded drives through the prediction engine: it learns from the first part of each driver's trips and guesses the rest. Neither is a testing path for partners yet.</p>
        </Engineering>
        <Gap id="DI-G16">How to test proactive moments without weeks of driving (replay or simulated history).</Gap>
        <Gap id="DI-G12">How your assistant receives a proactive moment.</Gap>
      </Section>

      <Section id="environments" title="Environments">
        <Gap id="DI-G16">Pre-production and production environments, and how to switch between them.</Gap>
      </Section>

      <Section id="next-steps" title="Next steps">
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <NavButton onNavigate={onNavigate} pageId="di-concepts">Moments and modes</NavButton>
          <NavButton onNavigate={onNavigate} pageId="di-flows">Reactive and proactive flows</NavButton>
          <NavButton onNavigate={onNavigate} pageId="di-response-contract">Response contract</NavButton>
        </div>
        <Gap id="DI-G28">Support channel during the alpha.</Gap>
      </Section>
    </div>
  );
}

/* ─── Concepts ─────────────────────────────────────────────────────────────── */

export function DIConcepts({ onNavigate }) {
  return (
    <div className="page">
      <h1>Moments and modes</h1>
      <PageActions />
      <DraftBanner onNavigate={onNavigate} />
      <p className="quick-answer">
        Every DI output is a moment that answers where, how much and when; DI produces moments proactively, when something on
        the road is worth saying, and reactively, when the driver asks.
      </p>

      <Section id="moment" title="The moment">
        <Table head={['Question', 'What DI answers']} rows={[
          ['Where', 'Where the driver is probably going, and the stop that fits.'],
          ['How much', 'How well the driver knows the road ahead, so the screen knows how much to show. A familiar commute gets one line; somewhere new gets the full map.'],
          ['When', 'Whether anything is worth saying now, and how long it holds. "Nothing worth saying" is the most common answer.'],
        ]} />
        <p>The carmaker decides how a moment looks and sounds: a card, a voice line, or nothing until the drive.</p>
        <Proposal>
          <p style={{ margin: '0 0 8px' }}><strong>The moment is the unit.</strong> DI sends each moment once, in DI's own schema, and never outputs UI components. A screen, a cluster tile and a voice line all work from the same moment. For partners that license UX Library, the mapping from a moment to components runs in the DI SDK on the device; everyone else draws the moment themselves. See <a href="#" onClick={e => { e.preventDefault(); onNavigate?.('di-response-contract', PRODUCT); }} style={{ color: 'var(--brand)' }}>Response contract</a> for the proposed fields and the two rendering paths.</p>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--mid)' }}>The product description plans a later step in which DI also says which agreed components to show (step 3 below, planned). This proposal puts that choice in an on-device mapping rather than in DI's answer (DI-G36).</p>
        </Proposal>
      </Section>

      <Section id="modes" title="Proactive and reactive">
        <Table head={['Mode', 'Trigger', 'Typical output']} rows={[
          ['Proactive', 'Something happens on the road: a closure, a hazard, today much slower than usual, a place worth saving.', 'One alert with a better way, or silence.'],
          ['Reactive', 'The driver asks through the assistant.', 'One recommendation, the reason, and the option it beat.'],
        ]} />
        <p>Both modes enter the same reasoning path in the cloud. See <a href="#" onClick={e => { e.preventDefault(); onNavigate?.('di-flows', PRODUCT); }} style={{ color: 'var(--brand)' }}>Reactive and proactive flows</a>.</p>
      </Section>

      <Section id="two-drives" title="Two drives, one engine (proposal)">
        <Proposal>
          <p style={{ margin: '0 0 8px' }}>DI serves two kinds of trip with one engine. What changes between them is which mode comes first and how much the driver sees.</p>
          <Table head={['Drive', 'What it is', 'DI leads with', 'How it shows']} rows={[
            ['City drive', 'The everyday drive.', 'Proactive first: predict, monitor, stay quiet.', 'Barely visible: a widget, the minimised route bar, a cluster tile, voice.'],
            ['Leisure drive', 'The trip the driver plans.', 'Reactive first: the driver asks.', 'Full navigation.'],
          ]} />
          <p style={{ margin: '8px 0 0' }}>Capabilities stay distinct building blocks in both drives. Your assistant still reaches them through DI as one tool: the product description doesn't offer DI's capabilities as separate calls for now.</p>
        </Proposal>
        <Gap id="DI-G37">Whether "city drive" and "leisure drive" are product terms. The product description speaks of the daily drive and the free drive.</Gap>
      </Section>

      <Section id="common-sense" title="Planning around time">
        <p>Underneath every answer DI applies the checks any driver expects without saying them, mostly about time:</p>
        <ul>
          <li>A place must be open when the driver arrives, not now.</li>
          <li>Charge is checked at arrival, including enough for the next leg.</li>
          <li>"On the way" means ahead of the driver, and a spot across a dual carriageway isn't close.</li>
        </ul>
        <p>These checks apply to place candidates whoever found them.</p>
      </Section>

      <Section id="ownership" title="Who owns what">
        <Table head={['', 'Your assistant and app', 'DI']} rows={[
          ['Driver', 'Owns voice, conversation and the person.', 'Never talks to the driver directly.'],
          ['Screen', 'Decides where a moment goes and how it looks.', 'Decides what to show and how much.'],
          ['Memory', 'Holds the conversation ("the second one") and the person.', 'Remembers navigation: places, what the driver calls them, preferences. Does not store conversations.'],
          ['Wording', 'Writes the sentence.', 'Sends data, never pixels or prose.'],
        ]} />
        <Direction>The screen and memory rows are not signed off. With the DI SDK, navigation memory stays in the car; for cloud-only integrations it is open (DI-G11).</Direction>
      </Section>

      <Section id="how-much" title="How much you take">
        <p>You choose how much of TomTom you take, one step at a time. Each step adds to the one before: from calling the APIs yourself, to DI deciding what to say, to DI also choosing screen components, to TomTom drawing the whole screen.</p>
        <Figure title="How much you take" caption="Step 2 is DI as these pages describe it: DI decides, you draw. Steps 3 and 4 are planned. The design proposal's UX Library rendering path belongs to step 3.">
          <StepsDiagram label="Four steps: TomTom APIs and tools (exists), DI (alpha), DI with components (planned), DI in the Automotive Navigation Application (planned)." highlight={1} steps={[
            { label: 'TomTom APIs and tools', sub: 'Routing, search, traffic, EV, parking, one by one. You decide and draw.', status: 'Exists' },
            { label: 'DI', sub: 'Proactive moments and one-call answers. DI decides, you draw.', status: 'Alpha' },
            { label: 'DI with components', sub: 'DI also says which agreed components to show, and how much.', status: 'Planned' },
            { label: 'DI in the Automotive Navigation Application', sub: 'The full experience, with TomTom drawing the screen.', status: 'Planned' },
          ]} />
        </Figure>
      </Section>

      <Section id="agentic" title="Agents, DI and the design system (proposal)">
        <Proposal>
          <p style={{ margin: '0 0 8px', fontSize: '1rem', color: 'var(--black)' }}><strong>The agent decides how to reach the driver. DI decides whether it's worth it. The design system decides how it looks.</strong></p>
          <Table head={['Part', 'Decides']} rows={[
            ['Your assistant (the agent)', 'How to reach the driver: which surface, and in what words.'],
            ['DI', 'Whether the moment is worth an interruption at all.'],
            ['The design system', 'How the moment looks: UX Library or your own components, in your brand.'],
          ]} />
          <p style={{ margin: '8px 0 0' }}>SDKs are moving from fixed calls to schema-based, intent-driven outputs. For DI that makes the moment schema the contract. App Functions and MCP tools are the likely ways in for agents.</p>
        </Proposal>
        <p>The product description asks for one product and one endpoint in the same shape for every partner. The technical direction draft describes an Android service your assistant binds to. Which entry points DI offers agents is still open.</p>
        <Gap id="DI-G23">Entry points for agents (MCP tools, App Functions, the DI SDK service) and the line with TomTom's public MCP server.</Gap>
      </Section>
    </div>
  );
}

/* ─── Integration paths ────────────────────────────────────────────────────── */

export function DIIntegrationPaths({ onNavigate }) {
  return (
    <div className="page">
      <h1>Integration paths</h1>
      <PageActions />
      <DraftBanner onNavigate={onNavigate} />
      <p className="quick-answer">
        How much of DI you get depends on what runs in your car: with the DI SDK on top of NavSDK you get proactive and reactive
        moments; cloud-only integrations mainly get reactive answers.
      </p>

      <ApiLinks onNavigate={onNavigate} title="Products on these paths" items={[
        ...NAVSDK_LINKS,
        { type: 'REST API', name: 'Routing API', description: 'Basis of the path without NavSDK.', pageId: 'routing-api-intro', productId: 'routing-api' },
        { type: 'Android SDK', name: 'Automotive Navigation Application', description: 'Planned home of the full DI experience.', pageId: 'ana-intro', productId: 'ana' },
      ]} />

      <Section id="comparison" title="Compare the paths">
        <Table head={['Path', 'Proactive', 'Reactive', 'Personal', 'Status']} rows={[
          ['DI SDK with NavSDK', 'Yes', 'Yes', 'Yes, in the car', <Status s="Alpha" />],
          ['Without NavSDK', 'To be defined', 'Yes', 'To be defined', <Status s="Open" />],
          ['Cloud only', 'With your own prediction', 'Yes', 'To be defined', <Status s="Direction" />],
          ['Your own prediction', 'Monitoring on your destination', 'Yes', 'Depends on path', <Status s="Direction" />],
          ['DI in the Automotive Navigation Application', 'Yes', 'Yes', 'Yes', <Status s="In engineering" />],
          ['DI in an app built on the UX Library', 'Yes, with the DI SDK', 'Yes', 'Yes, in the car', <Status s="Direction" />],
        ]} />
        <Gap id="DI-G9">Which capabilities run in the cloud and which in the SDK; this decides the cells above.</Gap>
      </Section>

      <Section id="with-navsdk" title="DI SDK with NavSDK">
        <p><strong>You get:</strong> everything in your edition. DI reads navigation state straight from NavSDK, so the contract stays small.</p>
        <p><strong>You provide:</strong> the app that embeds the DI SDK, app-held context (profile, saved places, recent destinations, preferences, consent), and an assistant that binds to the DI service.</p>
        <p><strong>Not available:</strong> nothing on this path is excluded.</p>
        <Figure title="Path: DI SDK with NavSDK" status="Direction" caption="DI reads navigation state from NavSDK in the car, so you send the least.">
          <LayerDiagram label="DI SDK with NavSDK: your assistant and app bind to the DI SDK, which runs next to the Maps and Navigation SDK and calls the DI API." layers={[
            { label: 'Your side', owner: 'Carmaker', boxes: [
              { label: 'Assistant', tone: 'partner' }, { label: 'App', sub: 'Profile, places, consent', tone: 'partner' },
            ], link: 'Binds to the DI service' },
            { label: 'In the car', owner: 'TomTom SDKs', boxes: [
              { label: 'DI SDK', sub: 'Context, driver model, proactive moments', tone: 'tomtom' },
              { label: 'Maps & Navigation SDK', sub: 'Navigation state', tone: 'external' },
            ], link: 'Context and answers' },
            { label: 'TomTom cloud', boxes: [{ label: 'DI API', sub: 'Proactive and reactive', tone: 'tomtom' }] },
          ]} />
        </Figure>
      </Section>

      <Section id="without-navsdk" title="Without NavSDK">
        <p><strong>You get:</strong> DI working from the Routing API instead of in-car navigation state. The contract is wider because you send what NavSDK would have supplied.</p>
        <Figure title="Path: without NavSDK" caption="Whether the DI SDK can sit inside another navigation stack is open (DI-G10), and so is the wider context contract (DI-G8).">
          <LayerDiagram label="Without NavSDK: your assistant and your own navigation stack; the DI SDK in the car is undecided; the DI API works from the Routing API." layers={[
            { label: 'Your side', owner: 'Carmaker', boxes: [
              { label: 'Assistant', tone: 'partner' }, { label: 'Your navigation stack', tone: 'partner' },
            ], link: 'Uses the DI SDK, if it can run here' },
            { label: 'In the car', boxes: [{ label: 'DI SDK in your stack?', sub: 'Not decided (DI-G10)', tone: 'tbd' }], link: 'Wider context contract (DI-G8)' },
            { label: 'TomTom cloud', boxes: [
              { label: 'DI API', sub: 'Reactive; proactive to be defined', tone: 'tomtom' },
              { label: 'Routing API', sub: 'Instead of in-car navigation state', tone: 'external' },
            ] },
          ]} />
        </Figure>
        <Gap id="DI-G10">Whether the DI SDK can run inside another navigation stack.</Gap>
        <Gap id="DI-G8">The wider context contract for this path.</Gap>
      </Section>

      <Section id="cloud-only" title="Cloud only">
        <p><strong>You get:</strong> reactive answers, called from your assistant's cloud.</p>
        <p><strong>You provide:</strong> the request and the car context the SDK would otherwise attach.</p>
        <p><strong>Not available:</strong> prediction and free-drive alerts, unless you bring your own prediction. Personal features need the DI SDK, or a privacy agreement under which DI holds navigation memory in its cloud; until then this path mainly gets reactive answers.</p>
        <Figure title="Path: cloud only" status="Direction" caption="Your cloud calls DI directly and sends the car context itself. Where navigation memory lives on this path is open (DI-G11).">
          <LayerDiagram label="Cloud only: the assistant and app in your car, your assistant's cloud sends the request and car context to the DI API; navigation memory in the TomTom cloud is undecided." layers={[
            { label: 'In the car', owner: 'Carmaker', boxes: [
              { label: 'Assistant', tone: 'partner' }, { label: 'App', tone: 'partner' },
            ] , link: 'Your own connection' },
            { label: 'Your cloud', owner: 'Carmaker', boxes: [
              { label: 'Assistant backend', sub: 'Sends the request and the car context', tone: 'partner' },
            ], link: 'Request plus car context' },
            { label: 'TomTom cloud', boxes: [
              { label: 'DI API', sub: 'Reactive answers', tone: 'tomtom' },
              { label: 'Navigation memory', sub: 'Only with a privacy agreement (DI-G11)', tone: 'tbd' },
            ] },
          ]} />
        </Figure>
        <Direction>Cloud-only integration follows the product description. The technical direction draft treats in-car integration as the first path and cloud-to-cloud as a later option (DI-G30).</Direction>
        <Gap id="DI-G11">Where navigation memory lives on this path, and what is retained.</Gap>
        <Gap id="DI-G8">Which context you must send.</Gap>
      </Section>

      <Section id="own-prediction" title="Bring your own prediction">
        <p>If your stack already predicts destinations, skip DI's. DI's monitoring runs on whatever destination you give it: entered, predicted by DI, or predicted by you.</p>
        <Gap id="DI-G17">How to pass your prediction and its confidence.</Gap>
      </Section>

      <Section id="in-ana" title="DI in the Automotive Navigation Application">
        <p>For partners who take the Automotive Navigation Application, TomTom draws the screen as well. Planned, not yet available.</p>
        <Engineering>
          <p style={{ margin: '0 0 8px' }}>How engineering is building DI into the app:</p>
          <ul style={{ margin: '0 0 8px', paddingLeft: 20 }}>
            <li>One new component holds DI. It is the only part of the app that depends on the DI SDK, and it is created only when its configuration is present, so DI is easy to add or remove.</li>
            <li>It uses the app's existing component interfaces (navigation, personalisation, vehicle, vehicle platform, privacy). Nothing else in the app depends on it.</li>
            <li>DI pulls what it needs. The component registers providers, for position, speed, gear, home and work for example, and DI calls them on its own heartbeat. A customer that builds its own app implements the same providers.</li>
            <li>Messages for the driver go to the assistant. Screen changes the assistant asks for go through the app's existing voice path, not through DI.</li>
          </ul>
          <p style={{ margin: '0 0 6px' }}>An application outside the app reaches less of this, through the Client Integration Library:</p>
          <Table head={['What DI reads', 'Inside the app', 'From outside, over the Client Integration Library']} rows={[
            ['Position, active route, navigation state', 'Yes', 'Yes'],
            ['Arrival at the destination', 'Yes, while a route is active', 'No; trip progress is the closest'],
            ['Home, work, favourites, recent destinations', 'Yes', 'Yes'],
            ['Vehicle, battery, range', 'Yes', 'No'],
            ['Gear, speed, odometer', 'Yes', 'GNSS speed only'],
            ['Ignition, engine on or off', 'Not read yet (DI-G41)', 'No'],
            ['Consent', 'To be decided (DI-G42)', 'No'],
          ]} />
          <p style={{ margin: '8px 0 0' }}>Only a component inside the app can add predicted destinations to the app's own search results. From outside, the Client Integration Library can run a search but not contribute to one.</p>
        </Engineering>
        <Gap id="DI-G40">How DI's predictions relate to the app's existing suggested destinations.</Gap>
      </Section>

      <Section id="ux-library-apps" title="DI in an app built on the UX Library">
        <p>An app built on the UX Library is its own integrator. The UX Library has no public way to add a component, so the app embeds the DI SDK itself and implements DI's providers from the UX Library's public API (current location, home, work and recent destinations) and from its own vehicle properties.</p>
        <p>What the UX Library offers DI's moments today, read from its code:</p>
        <Table head={['UX Library part', 'Today']} rows={[
          ['Suggested destinations', 'The public API already lists the destinations the driver is likely to drive to next (Alpha). They come from rule-based suggestions that learn only from navigated trips, and carry a distance but no arrival time.'],
          ['Main screen', 'The app can put its own search panel on the main screen.'],
          ['Mini app display', 'The app owns one slot: the search panel. While the car drives without a route it shows as a single row, with the UX Library\'s upcoming-events panel below. The guidance panel is view-only, and only the largest of the four sizes takes touch.'],
          ['Route progress', 'Distance along the route and distance left. No arrival time, time left or traffic delay in the public API.'],
          ['Cluster', 'View-only, and empty until a trip is active.'],
          ['Route Bar', 'Planned, not yet in the UX Library.'],
        ]} />
        <p>So a moment can appear in the app's own slots now, as a card or a row. A route bar in the minimised state, or a cluster tile on a drive without a route, needs a UX Library change.</p>
        <Direction>This path follows the engineering design's rule that customers who don't use the Automotive Navigation Application implement the same providers. No one has built it yet.</Direction>
        <ApiLinks onNavigate={onNavigate} title="UX Library pages on this path" items={[
          { type: 'UX Library', name: 'UX Library', description: 'The public API this path builds on.', pageId: 'overview', productId: 'ux-library' },
          { type: 'UX Library', name: 'Route Bar', description: 'Planned component for the minimised state.', pageId: 'route-bar', productId: 'ux-library' },
        ]} />
        <Gap id="DI-G45">Where DI's moments can appear in an app built on the UX Library, and which UX Library changes that needs.</Gap>
      </Section>

      <Section id="raw-tools" title="TomTom APIs and agent tools">
        <p>You can always call TomTom's routing, search, traffic, EV and parking APIs yourself and decide what to show. DI is for when your assistant has seconds and one sentence, not a developer's time and a full screen.</p>
        <ApiLinks onNavigate={onNavigate} title="Raw building blocks" items={[
          { type: 'REST API', name: 'Search API', description: 'Places and points of interest.', pageId: 'search-api-intro', productId: 'search-api' },
          { type: 'REST API', name: 'Traffic API', description: 'Flow and incidents.', pageId: 'traffic-api-intro', productId: 'traffic-api' },
          { type: 'REST API', name: 'EV & Charging API', description: 'Stations and availability.', pageId: 'ev-charging-api-intro', productId: 'ev-charging-api' },
          { type: 'REST API', name: 'Parking & Fuel API', description: 'Parking availability and prices.', pageId: 'parking-fuel-api-intro', productId: 'parking-fuel-api' },
        ]} />
        <Gap id="DI-G23">Whether DI is offered as an MCP tool, and its relation to the public MCP server.</Gap>
      </Section>
    </div>
  );
}

/* ─── Flows ────────────────────────────────────────────────────────────────── */

export function DIFlows({ onNavigate }) {
  return (
    <div className="page">
      <h1>Reactive and proactive flows</h1>
      <PageActions />
      <DraftBanner onNavigate={onNavigate} />
      <p className="quick-answer">
        A reactive moment starts with the driver asking and should come back within a few seconds; a proactive moment starts
        with something on the road, is evaluated as the drive goes, and usually ends in silence.
      </p>

      <ApiLinks onNavigate={onNavigate} title="Products used in these flows" items={NAVSDK_LINKS} />

      <Section id="reactive" title="Reactive: the driver asks">
        <Figure title="Reactive request" status="Direction"
          caption="The assistant owns the conversation; DI returns one structured answer. Without the DI SDK, your system attaches the car context. The request format is still open (DI-G7).">
          <SequenceDiagram label="Reactive flow: the driver asks the assistant, the assistant sends a navigation request to the DI SDK, the SDK adds car context and calls the DI cloud, which calls TomTom engines and returns one answer that the assistant puts into words." lanes={[
            { id: 'driver', label: 'Driver', tone: 'person' },
            { id: 'asst', label: 'Assistant', sub: 'Carmaker', tone: 'partner' },
            { id: 'sdk', label: 'DI SDK', sub: 'In the car', tone: 'tomtom' },
            { id: 'cloud', label: 'DI API', sub: 'TomTom cloud', tone: 'tomtom' },
            { id: 'eng', label: 'TomTom engines', sub: 'Routing, search, traffic, EV', tone: 'external' },
          ]} steps={[
            { from: 'driver', to: 'asst', label: '"Coffee in the next 45 minutes."' },
            { from: 'asst', to: 'sdk', label: 'Navigation request, references resolved' },
            { from: 'sdk', to: 'cloud', label: 'Request plus car context' },
            { from: 'cloud', to: 'eng', label: 'Calls engines in order' },
            { from: 'eng', to: 'cloud', label: 'Results; DI recovers if one fails', kind: 'return' },
            { from: 'cloud', to: 'cloud', label: 'Checks arrival time, picks one answer', kind: 'self' },
            { from: 'cloud', to: 'sdk', label: 'One structured answer with the reason', kind: 'return' },
            { from: 'sdk', to: 'asst', label: 'Answer for the assistant', kind: 'return' },
            { from: 'asst', to: 'driver', label: 'In the assistant\'s own words', kind: 'return' },
            { from: 'asst', to: 'cloud', label: 'Time budget: a few seconds', kind: 'note' },
          ]} />
        </Figure>
        <Steps items={[
          'Driver speaks to your assistant. The assistant handles speech and dialogue and resolves references.',
          'Assistant sends DI a navigation request.',
          'DI SDK attaches car context (or your system does, without the SDK).',
          'DI cloud calls TomTom engines in order, recovers when one fails, and builds one structured answer.',
          'Assistant phrases the answer; your app shows it if it should be shown.',
        ]} />
        <p><strong>Time budget:</strong> a few seconds.</p>
        <Direction>Time budgets are from the product description, not a service level.</Direction>
        <Gap id="DI-G7">Request format.</Gap>
      </Section>

      <Section id="proactive" title="Proactive: something happens on the road">
        <Figure title="Proactive moment" status="Direction"
          caption="Most evaluations end in silence. How a moment reaches your assistant, and who schedules evaluation, is still open (DI-G12).">
          <SequenceDiagram label="Proactive flow: NavSDK gives the DI SDK navigation context, the SDK adds app context and the destination and sends it to the DI cloud on a schedule, the cloud compares today with the driver's usual and usually returns nothing, otherwise one moment that reaches the assistant, which says or shows it." lanes={[
            { id: 'driver', label: 'Driver', tone: 'person' },
            { id: 'asst', label: 'Assistant', sub: 'Carmaker', tone: 'partner' },
            { id: 'nav', label: 'NavSDK', sub: 'In the car', tone: 'external' },
            { id: 'sdk', label: 'DI SDK', sub: 'In the car', tone: 'tomtom' },
            { id: 'cloud', label: 'DI API', sub: 'TomTom cloud', tone: 'tomtom' },
          ]} steps={[
            { from: 'nav', to: 'sdk', label: 'Position, route, events ahead' },
            { from: 'sdk', to: 'sdk', label: 'Adds app context and the destination', kind: 'self' },
            { from: 'sdk', to: 'cloud', label: 'Context, on a schedule while driving' },
            { from: 'cloud', to: 'cloud', label: 'Today against this driver\'s usual', kind: 'self' },
            { from: 'cloud', to: 'sdk', label: 'Usually: nothing worth saying', kind: 'return' },
            { from: 'cloud', to: 'sdk', label: 'Otherwise: one moment with a better way', kind: 'return' },
            { from: 'sdk', to: 'asst', label: 'Moment reaches the assistant', status: 'tbd' },
            { from: 'asst', to: 'driver', label: 'Says or shows it', kind: 'return' },
            { from: 'asst', to: 'cloud', label: 'Time budget: 10 to 20 seconds when the event is minutes away', kind: 'note' },
          ]} />
        </Figure>
        <Steps items={[
          'NavSDK emits navigation context: position, active route or most probable path, guidance state, events ahead.',
          'DI SDK adds app-held context and the current destination: entered, predicted, or yours.',
          'Context is sent for evaluation on a schedule while driving.',
          'DI cloud compares today against what is normal for this driver, road and hour. Most evaluations return nothing.',
          'If something is worth saying, DI returns a moment with a better way and how long it is valid.',
          'Your assistant decides how to say it; your app decides where it goes.',
        ]} />
        <p><strong>Time budget:</strong> 10 to 20 seconds is acceptable when the incident is minutes away.</p>
        <Direction>Evaluation starts as scheduled requests; DI pushing on change comes later.</Direction>
        <Engineering>
          <p style={{ margin: '0 0 8px' }}>The first version of the proactive session, as engineering has agreed it:</p>
          <Steps items={[
            'At key-on, the DI SDK predicts likely destinations from the trips stored on the device.',
            'While the drive goes on, the DI SDK calls the DI API on a timer. Each call carries a full snapshot: the predicted destination and its confidence, the current position, the vehicle profile, the route from the previous answer, and the notifications already sent.',
            'The DI API plans the route and runs a filter. It always returns the route, which the SDK needs to spot a deviation or the arrival, and adds a notification only when the filter finds something worth telling the driver.',
            'Driving away from the predicted route ends the session. The DI API keeps no state between calls.',
            'Road events from the horizon, such as cameras, speed limits and school zones, are not in the first version. Later the DI SDK adds them to the same call, mostly without needing a new route.',
          ]} />
          <p style={{ margin: '8px 0 0' }}>Your app will get one stream of proactive notifications from the DI SDK, mixing route-based ones and road events, with start, stop, state and the event stream as its entry points. That shape can still change.</p>
        </Engineering>
        <Gap id="DI-G12">The poll interval, and how a notification reaches your assistant.</Gap>
        <Gap id="DI-G41">Which signal starts a prediction at key-on and closes a trip.</Gap>
      </Section>

      <Section id="road-triggered" title="Road-triggered moments (proposal)">
        <Proposal>
          <p style={{ margin: '0 0 8px' }}>Agent workflows usually start with someone asking. DI's proactive flow starts with the road: a jam, a closure or a hazard on the way the driver is going. DI is the trigger for your assistant, and it decides whether the moment is worth an interruption. The moment says which kind it is in its <code>trigger</code> field.</p>
          <Table head={['', 'Request-triggered', 'Road-triggered']} rows={[
            ['Who starts it', 'The driver asks your assistant.', 'Something changes on the road ahead.'],
            ['Who decides it is worth saying', 'The driver, by asking.', 'DI.'],
            [<code>trigger</code>, <code>request</code>, <code>road</code>],
            ['Most common result', 'One answer.', 'Silence.'],
          ]} />
          <Figure title="Road-triggered moment" status="Proposal"
            caption="The road starts the exchange and DI decides whether it's worth it. How the moment reaches your assistant is open: the product description starts with the SDK or partner asking on a schedule, and DI pushing later (DI-G12).">
            <SequenceDiagram label="Road-triggered flow: a change on the road reaches DI, DI decides whether it is worth an interruption, sends one moment with trigger road to the assistant, which decides how to reach the driver and draws the same moment on each surface." lanes={[
              { id: 'road', label: 'The road ahead', sub: 'Traffic, closures, hazards', tone: 'external' },
              { id: 'di', label: 'DI', sub: 'SDK and cloud', tone: 'tomtom' },
              { id: 'asst', label: 'Assistant', sub: 'Carmaker', tone: 'partner' },
              { id: 'surf', label: 'Surfaces', sub: 'Widget, route bar, tile, voice', tone: 'partner' },
              { id: 'driver', label: 'Driver', tone: 'person' },
            ]} steps={[
              { from: 'road', to: 'di', label: 'A 33-minute jam on the usual route' },
              { from: 'di', to: 'di', label: 'Worth an interruption? Usually not', kind: 'self' },
              { from: 'di', to: 'asst', label: 'One moment, trigger: road', status: 'tbd' },
              { from: 'asst', to: 'asst', label: 'Decides how to reach the driver', kind: 'self' },
              { from: 'asst', to: 'surf', label: 'Same moment, once per surface' },
              { from: 'surf', to: 'driver', label: 'A tile, the route bar or one line', kind: 'return' },
            ]} />
          </Figure>
        </Proposal>
        <p>Until delivery is decided, the proactive flow above applies: the DI SDK or your system asks DI on a schedule, and most evaluations come back with nothing to say.</p>
        <Gap id="DI-G12">Whether DI can start the exchange with your assistant, or only answers a scheduled check.</Gap>
      </Section>

      <Section id="instant-commands" title="Instant commands">
        <p>Commands such as "start navigation" go to the navigation stack and return nothing worth talking about. The proposal is a parallel call: the command to navigation, and DI for what the assistant says.</p>
        <Gap id="DI-G18">Parallel call or a DI pre-check.</Gap>
      </Section>

      <Section id="cold-start" title="Cold start and confidence">
        <p>Prediction learns from repeated trips. Until a pattern (this driver, this hour, this day) has been seen enough times, DI makes no prediction and no proactive moment fires. A weak prediction can still help answer a question the driver asked, but never triggers an unprompted moment.</p>
        <Direction>In the technical direction draft, a prediction is refined after about a kilometre of driving, when heading rules out candidates, and an alert needs every predicted route to be clearly slower than this driver's usual for that hour.</Direction>
        <Engineering>
          <p style={{ margin: '0 0 8px' }}>How today's prediction engine decides, with its current defaults (all can be set when the SDK is set up):</p>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>A trip's start and end each join the nearest known place within 150 m, or start a new one. Trips under 200 m or 2 minutes are dropped.</li>
            <li>Each trip adds to four counts, from general to specific: all trips, trips from this place, on this kind of day (weekday or weekend), and in this two-hour window. A count with few trips is trusted less.</li>
            <li>Only places visited at least twice are scored, unless no place has two visits yet.</li>
            <li>If the top score reaches 0.40, the SDK returns one to three destinations, best first, each with a confidence from 0 to 1. Otherwise it returns no destination and says it wasn't confident.</li>
            <li>A predicted destination is a coordinate. Naming it, from a favourite, a place of interest, an address the driver entered, or reverse geocoding, is a separate step (DI-G44).</li>
          </ul>
          <p style={{ margin: '8px 0 0' }}>This scoring replaces the confidence formula in the technical direction draft. Route variants and the driver's usual travel time per route are not built yet.</p>
        </Engineering>
      </Section>
    </div>
  );
}

/* ─── Designing with DI ────────────────────────────────────────────────────── */

export function DIDesigning({ onNavigate }) {
  const rows = [
    ['Quiet until it matters', 'Interrupt only for what the driver can\'t see. Usual delays stay silent. Treat "nothing to say" as the normal result, not an empty state to fill.'],
    ['Speak in the driver\'s frame', 'Compare against their usual route, use landmarks they can see, and give arrival times rather than durations.'],
    ['Always give the reason', 'Say why, and name the option it beat. If you can\'t show a reason, don\'t show the suggestion.'],
    ['Own the road minutes ahead', 'DI covers route and map intelligence. Perception stays with the car\'s own systems.'],
    ['One answer, any surface', 'The same moment can drive a map, a tile or a spoken line. Build your rendering from the data, not from DI text.'],
    ['Design by level', 'Separate what the driver must do from what they might enjoy.'],
    ['Predictable screen', 'One suggestion at a time, one tap to dismiss, the map never more than one tap away.'],
  ];
  return (
    <div className="page">
      <h1>Designing with DI</h1>
      <PageActions />
      <DraftBanner onNavigate={onNavigate} />
      <p className="quick-answer">
        DI is designed to stay quiet, so the best integrations show less: one moment at a time, always with its reason, in
        terms of the driver's own route.
      </p>

      <Section id="principles" title="Principles for your integration">
        <Table head={['Principle', 'What it means for your assistant and screen']} rows={rows} />
        <Proposal>
          <p style={{ margin: 0 }}>The design direction proposes six principles: the first five above, then "Design by level, not by trust" in place of "Design by level". It leaves out "Predictable screen". Until that is settled, the seven above apply.</p>
        </Proposal>
        <Gap id="DI-G38">Which set of principles the docs publish.</Gap>
        <Gap id="DI-G25">How to present safety-relevant moments without implying a safety function.</Gap>
      </Section>

      <Section id="two-drives" title="Design for both drives (proposal)">
        <Proposal>
          <Table head={['Drive', 'Design for']} rows={[
            ['City drive', 'Barely visible. DI says nothing on most days. When it speaks, use the smallest surface that carries the moment: a widget, the minimised route bar, a cluster tile or one spoken line.'],
            ['Leisure drive', 'Full navigation. The driver asks, and the answer can take the map.'],
          ]} />
          <p style={{ margin: '8px 0 0' }}>See <a href="#" onClick={e => { e.preventDefault(); onNavigate?.('di-concepts', PRODUCT); }} style={{ color: 'var(--brand)' }}>Two drives, one engine</a>. Naming is open (DI-G37).</p>
        </Proposal>
      </Section>

      <Section id="how-much-screen" title="How much screen">
        <p>Each moment says how much screen it deserves, based on how well the driver knows the road. A familiar commute needs one line; somewhere new needs the full map. Use it to scale your layout rather than deciding per use case.</p>
        <Proposal>
          <p style={{ margin: 0 }}>In the proposed moment fields this is <code>familiarity</code>: a known road means a shorter message, on screen and by voice.</p>
        </Proposal>
      </Section>

      <Section id="no-nav-open" title="When navigation isn't open">
        <p>DI's lead use case is an alert on a drive where nothing was entered, which often means the navigation app isn't on screen. How to show it is still open.</p>
        <Proposal>
          <p style={{ margin: '0 0 8px' }}>Draw the same moment once per surface. Each surface uses only the fields it needs. Your assistant decides how to reach the driver; DI decides whether it's worth it; your design system decides how it looks.</p>
          <Table head={['Surface', 'Fields it uses', 'How it behaves']} rows={[
            ['Your assistant\'s own widget', 'Every field', 'Your brand\'s tokens. Offers the actions, such as Go and Not today.'],
            ['Minimised state with the route bar (UX Library)', <span><code>where</code>, <code>usual</code>, <code>better</code>, <code>why</code>, <code>valid_until</code></span>, 'No buttons. Stays on the bar until the moment expires.'],
            ['Cluster tile', <span><code>where</code>, <code>usual</code>, <code>better</code>, <code>actions</code></span>, 'Shown before the driver sets off, then quiet.'],
            ['Voice', <span><code>speak</code>, <code>where</code>, <code>better</code>, <code>why</code>, <code>familiarity</code>, <code>actions</code></span>, 'On a known road, no directions are read out.'],
          ]} />
          <p style={{ margin: '8px 0 0', fontSize: '0.8125rem', color: 'var(--mid)' }}>Field subsets come from an illustrative example, not a specification. Which surfaces you use stays your decision. Suggested owner for this pattern: the DI design lead.</p>
        </Proposal>
        <p>On an app built on the UX Library, two of these surfaces need UX Library work first: the Route Bar is planned but not yet available, and the cluster screen stays empty until a trip is active. A card in the app's own Mini app slot works today, but the Mini app takes touch only at its largest size, so at smaller sizes the actions have to come by voice. See <a href="#" onClick={e => { e.preventDefault(); onNavigate?.('di-integration-paths', PRODUCT); }} style={{ color: 'var(--brand)' }}>DI in an app built on the UX Library</a>.</p>
        <ApiLinks onNavigate={onNavigate} title="Component in this pattern" items={[
          { type: 'UX Library', name: 'Route Bar', description: 'The minimised state with the route bar is one of the proposed surfaces.', pageId: 'route-bar', productId: 'ux-library' },
        ]} />
        <Gap id="DI-G19">Which pattern DI adopts for this alert, and who owns it.</Gap>
        <Gap id="DI-G45">Which UX Library changes the pattern needs.</Gap>
      </Section>

      <Section id="components" title="Reference widgets and components">
        <p>TomTom designs reference widgets to show what's possible; you build your own.</p>
        <Proposal>
          <p style={{ margin: 0 }}>For partners that license UX Library, a moment maps to a restricted catalog of approved UX Library components, such as the minimised route bar. See <a href="#" onClick={e => { e.preventDefault(); onNavigate?.('di-response-contract', PRODUCT); }} style={{ color: 'var(--brand)' }}>Rendering</a>.</p>
        </Proposal>
        <Gap id="DI-G27">Which widgets and components, and whether the UX Library holds them.</Gap>
      </Section>
    </div>
  );
}

/* ─── Capabilities ─────────────────────────────────────────────────────────── */

export function DICapabilities({ onNavigate }) {
  return (
    <div className="page">
      <h1>Capabilities</h1>
      <PageActions />
      <DraftBanner onNavigate={onNavigate} />
      <p className="quick-answer">
        Every capability DI offers or plans, with the mode it belongs to, where it runs as far as known, and its status.
      </p>

      <Section id="table" title="Capabilities and where they run">
        <Table head={['Capability', 'Mode', 'What DI does', 'Where it runs', 'Status']} rows={[
          ['Predict trip', 'Proactive', 'Predicts destination, route and arrival at key-on with nothing entered.', 'SDK', <Status s="Alpha" />],
          ['Suggest a favourite', 'Proactive', 'Detects places the driver stops at often and hands one to the assistant to name and confirm.', 'SDK', <Status s="Alpha" />],
          ['Alerts ahead on the route', 'Proactive', 'Warns about a closure, hazard or unusual delay, with the cause and what to do instead. Silent otherwise.', 'Cloud, with SDK context', <Status s="Alpha" />],
          ['Today against your usual', 'Proactive', 'Compares live travel time with this driver\'s usual for the route and hour.', 'To be defined', <Status s="Direction" />],
          ['Road questions', 'Reactive', 'Charge on the way, stop along the route, route status and editing, trip planning, parking, find a place.', 'Cloud', <Status s="Early access" />],
          ['Multi-stop trips', 'Reactive', 'Plans trips with several stops at the level of the basics.', 'Cloud', <Status s="Direction" />],
          ['Recommend and explain', 'Both', 'Returns one answer, the reason and the option it beat.', 'Cloud', <Status s="Alpha" />],
          ['Place search fallback', 'Reactive', 'When TomTom search finds nothing, DI searches the web itself and logs that it did. You can still pass in places you found.', 'Cloud', <Status s="Direction" />],
          ['Navigation memory', 'Personal', 'Remembers places and what the driver calls them (alpha); preferences come later.', 'SDK; cloud to be defined', <Status s="Direction" />],
          ['Insights tied to the trip', 'Road knowledge', 'Events such as marathons or closures, tied to the predicted trip with a route that still works.', 'To be defined', <Status s="Planned" />],
          ['Hands-free and awareness', 'The car explains itself', 'Explains when assisted driving ends and why the car is slowing.', 'To be defined', <Status s="Later" />],
        ]} />
        <Direction>The PKD leaves the cloud/SDK split per capability open. "Where it runs" reflects the technical direction draft.</Direction>
        <Gap id="DI-G9">Final cloud or SDK placement for each capability.</Gap>
        <Gap id="DI-G2">The operations that expose these capabilities.</Gap>
      </Section>

      <Section id="not-in-scope" title="Not in scope">
        <ul>
          <li>Booking and payment.</li>
          <li>Sensor and perception integration.</li>
          <li>Running the voice or the assistant.</li>
          <li>A consumer app.</li>
          <li>Calling DI's underlying engines as separate DI capabilities. Use the TomTom APIs for that.</li>
        </ul>
      </Section>
    </div>
  );
}

/* ─── DI SDK interface ─────────────────────────────────────────────────────── */

export function DISdkInterface({ onNavigate }) {
  return (
    <div className="page">
      <h1>DI SDK interface</h1>
      <PageActions />
      <DraftBanner onNavigate={onNavigate} />
      <p className="quick-answer">
        The DI SDK ships the interface your assistant talks to: an Android service your assistant binds to, carrying requests
        in and DI's answers and unprompted moments out.
      </p>

      <ApiLinks onNavigate={onNavigate} title="SDKs this interface depends on" items={NAVSDK_LINKS} />

      <Section id="overview" title="Overview">
        <p>The DI SDK is a standalone Android module that depends on NavSDK's navigation module (map-matched position and route context) and the map data it needs. The Automotive Navigation Application is not required.</p>
        <Direction>Everything on this page comes from the technical direction draft, which describes the interface at concept level only.</Direction>
        <Proposal>
          <p style={{ margin: 0 }}>As SDKs move to schema-based, intent-driven outputs, App Functions and MCP tools are the likely ways for agents to reach DI, alongside or instead of a bound service.</p>
        </Proposal>
        <Engineering>
          <p style={{ margin: 0 }}>The engineering design for DI in the Automotive Navigation Application covers proactive moments only. It expects reactive requests to get their own entry point, such as an MCP tool or a standalone endpoint, owned by the assistant rather than the navigation app. The DI API itself is being reshaped for an assistant to call: a short request with its context goes in, and structured data with a summary comes out, with no voice.</p>
        </Engineering>
        <Gap id="DI-G23">Which entry points DI offers agents.</Gap>
      </Section>

      <Section id="responsibilities" title="Responsibilities">
        <Table head={['Component', 'Responsible for']} rows={[
          ['DI SDK', 'Subscribing to NavSDK and assembling context; sending it to the API when something meaningful changes and on request; maintaining the driver model on the device; handing recommendations to the app; exposing the service your assistant binds to.'],
          ['DI API', 'Judging how far to trust a prediction; reasoning over context and TomTom data; evaluating triggers as the drive progresses; deciding whether to speak or stay silent; returning the answer with its reason.'],
          ['Your application', 'Embedding and configuring the DI SDK; supplying profile, saved places, recent destinations, preferences and consent; exposing its own service so the assistant can steer the UI.'],
          ['NavSDK', 'Positioning, map matching, routing, guidance, most probable path, events along the route, map data. No DI-specific APIs.'],
        ]} />
        <Engineering>
          <p style={{ margin: '0 0 8px' }}>The engineering design adds how context gets in: DI pulls rather than being pushed. Your integration registers providers with the DI SDK, for position, speed, gear, home and work for example, and DI calls them on its own heartbeat, so your app doesn't need to know DI's timing. Pushing events such as engine off or arrival may be added later, when a use case needs it.</p>
          <p style={{ margin: 0 }}>The sources still disagree on whether the DI SDK reads navigation data from NavSDK itself. The technical direction draft has it subscribe to NavSDK directly. The engineering design binds navigation data through your providers, so DI needs no NavSDK instance of its own, and uses the app's NavSDK only for road events ahead. Today's SDK code says it will run its own NavSDK navigation instance, with no map and no guidance, through a factory NavSDK has deprecated and plans to remove after February 2027.</p>
        </Engineering>
        <Gap id="DI-G39">How the DI SDK gets navigation data, and which NavSDK APIs it relies on.</Gap>
      </Section>

      <Section id="messages" title="Messages">
        <Figure title="Who sends what" status="Direction"
          caption="UI commands go to your app, not to DI. Payload types (DI-G5), how proactive events arrive (DI-G12) and the service definition (DI-G4) are still open.">
          <SequenceDiagram label="DI SDK messages: the assistant sends a functional prompt to the DI SDK and gets a DI response; the DI SDK can send a proactive event; the assistant sends UI commands to your app." lanes={[
            { id: 'app', label: 'Your app', sub: 'Navigation app', tone: 'partner' },
            { id: 'asst', label: 'Assistant', sub: 'Carmaker', tone: 'partner' },
            { id: 'sdk', label: 'DI SDK service', sub: 'In the car', tone: 'tomtom' },
          ]} steps={[
            { from: 'asst', to: 'sdk', label: 'Functional prompt: the request, without the conversation' },
            { from: 'sdk', to: 'asst', label: 'DI response', kind: 'return' },
            { from: 'sdk', to: 'asst', label: 'Proactive event, not asked for', status: 'tbd' },
            { from: 'asst', to: 'app', label: 'UI command for your app to carry out' },
          ]} />
        </Figure>
        <Table head={['Message', 'Direction', 'Purpose', 'Status']} rows={[
          ['Functional prompt', 'Assistant to DI', 'The driver\'s request, rewritten by the assistant without conversational context.', <Status s="Direction" />],
          ['UI command', 'Assistant to your app', 'A command for the navigation app to execute. Goes to your app, not to DI.', <Status s="Direction" />],
          ['DI response', 'DI to assistant', 'DI\'s answer for the assistant to act on.', <Status s="Direction" />],
          ['Proactive event', 'DI to assistant', 'A moment the assistant did not ask for.', <Status s="Direction" />],
        ]} />
        <Gap id="DI-G5">Payload types. The draft lists the DI response as a string; whether that is serialised structured data is not stated.</Gap>
        <Gap id="DI-G12">How proactive events are delivered.</Gap>
      </Section>

      <Section id="binding" title="Binding to the service">
        <Gap id="DI-G4">Service name, manifest entries, permissions, method signatures and threading.</Gap>
      </Section>

      <Section id="navsdk-versions" title="NavSDK version alignment">
        <p>The DI SDK and NavSDK are released on separate schedules, and NavSDK is not binary compatible across versions. If your app resolves a NavSDK version the DI SDK wasn't built against, the build can pass and the app can fail on first call with <code>NoSuchMethodError</code> or <code>AbstractMethodError</code>.</p>
        <ul>
          <li>Force a single NavSDK version in your build.</li>
          <li>Use a NavSDK version the DI SDK release supports.</li>
          <li>Run smoke tests that call DI against the NavSDK version your app actually resolves.</li>
        </ul>
        <Gap id="DI-G3">The supported NavSDK versions for each DI SDK release.</Gap>
        <Gap id="DI-G39">Whether the DI SDK runs its own NavSDK navigation instance, which would make the planned removal of its navigation factory a date to plan around.</Gap>
      </Section>
    </div>
  );
}

/* ─── Context and data handling ────────────────────────────────────────────── */

export function DIContext({ onNavigate }) {
  return (
    <div className="page">
      <h1>Context and data handling</h1>
      <PageActions />
      <DraftBanner onNavigate={onNavigate} />
      <p className="quick-answer">
        DI works from three kinds of context: navigation state from NavSDK, what your app knows about the driver, and TomTom
        cloud data; trip history stays on the vehicle and only what a use case needs leaves it.
      </p>

      <Section id="inputs" title="What DI uses">
        <Table head={['Source', 'Context']} rows={[
          ['NavSDK', 'Position, map matching, active route or most probable path, guidance state, events along the route.'],
          ['Your app', 'Active profile, saved places, recent destinations, preferences, consent state.'],
          ['DI cloud', 'What isn\'t available in the car, such as typical traffic and parking patterns, plus TomTom map, traffic, EV, hazard and place data.'],
        ]} />
        <p>Context is limited to what the supported use cases need. DI does not ask for the vehicle's whole data set.</p>
        <Engineering>
          <p style={{ margin: 0 }}>Vehicle signals are a fourth source: gear, speed and odometer come from the vehicle platform. No ignition signal is read yet. Engineering plans to use the platform's power events (shutting down, ignition state) where the car reports them, and otherwise to infer key-on and the end of a trip from position and time.</p>
        </Engineering>
        <Gap id="DI-G41">Which signal starts a prediction at key-on and closes a trip.</Gap>
        <Figure title="What stays and what leaves" status="Direction"
          caption="Trip history stays on the vehicle; only current context and the active prediction leave it. Cloud-held navigation memory for cloud-only integrations is open (DI-G11).">
          <LayerDiagram label="Data boundary: in the car, the DI SDK trip history, your app and NavSDK; while driving the current context and active prediction go to the TomTom cloud, where the DI API and TomTom data are; cloud navigation memory is undecided." layers={[
            { label: 'In the car', owner: 'Stays on the vehicle', boxes: [
              { label: 'DI SDK', sub: 'Trip history and driver model, never sent as-is', tone: 'tomtom' },
              { label: 'Your app', sub: 'Profile, saved places, consent', tone: 'partner' },
              { label: 'Maps & Navigation SDK', sub: 'Position, route, events ahead', tone: 'external' },
            ], link: 'While driving: current context and the active prediction' },
            { label: 'TomTom cloud', owner: 'Per request', boxes: [
              { label: 'DI API', sub: 'Predicted destination not kept beyond the request', tone: 'tomtom' },
              { label: 'TomTom data', sub: 'Typical traffic, parking patterns, map, EV, places', tone: 'external' },
              { label: 'Navigation memory', sub: 'Cloud-only path: open (DI-G11)', tone: 'tbd' },
            ] },
          ]} />
        </Figure>
      </Section>

      <Section id="on-device" title="What stays on the vehicle">
        <p>The driver model runs on the device from one record per trip, kept in a rolling window and never sent as-is.</p>
        <Table head={['Trip record', 'Used for']} rows={[
          ['Origin and destination (map-matched)', 'Prediction; home and work detection'],
          ['Start and end time, day of week', 'Prediction; how long the driver stays'],
          ['Observed travel time', 'This driver\'s usual time per route and hour'],
          ['Driven path', 'Telling route variants apart'],
          ['Routed or free drive', 'Whether a destination existed'],
          ['Stops: number, duration, type', 'Separating a coffee stop from the destination; where this driver charges or parks'],
        ]} />
        <Direction>Record contents are from the technical direction draft. The store is scoped to the app install and active profile.</Direction>
        <Engineering>
          <p style={{ margin: 0 }}>Today's SDK stores less than this. Each trip keeps its start and end point and its departure and arrival times, in an on-device database with a retention policy. The SDK also keeps the places the driver stops at often, and the places the driver has said not to suggest. Driven paths, travel times and stops, which route variants and the usual travel time need, aren't stored yet.</p>
        </Engineering>
        <Gap id="DI-G42">Which consent DI needs before it stores trip history, and who asks for it.</Gap>
      </Section>

      <Section id="edge-first" title="Edge before cloud (proposal)">
        <Proposal>
          <p style={{ margin: 0 }}>Learning the driver's routine happens on the edge, in the car. Personal data stays in the car, because TomTom has no cloud store for personal profiles yet.</p>
        </Proposal>
        <p>With the DI SDK this matches the rest of this page: trip history and the driver model stay on the vehicle, and a predicted destination isn't kept beyond the request. It differs for cloud-only integrations. There, the product description lets DI hold navigation memory in its cloud once a privacy agreement is in place, and until then mainly offers reactive answers. That question stays open.</p>
        <Gap id="DI-G11">Whether cloud-only integrations can ever get cloud-held navigation memory, and on what terms.</Gap>
      </Section>

      <Section id="what-leaves" title="What leaves the vehicle">
        <p>While driving, the DI SDK sends the current navigation context, the app-held context, and the active destination prediction with its confidence. The prediction is left out once it's no longer valid.</p>
        <CodeBlock label="Shape from the technical direction draft (field names not final)" language="bash" code={
`predicted_destinations[]  : location, confidence
    routes[]              : path, average travel time for this time bucket, spread, sample count, confidence
departure                 : origin, time, day type`} />
        <Direction>A predicted destination is often the driver's home. It is sent only when a use case needs it, not kept server-side beyond the request, and not labelled as home.</Direction>
        <Engineering>
          <p style={{ margin: '0 0 8px' }}>The proactive call engineering has agreed sends a full snapshot each time: the predicted destination and its confidence, the current position, the vehicle profile, the route from the previous answer, and the notifications already sent.</p>
          <p style={{ margin: 0 }}>Engineering also plans one anonymous event at the end of each trip, to measure prediction quality without location data: whether a suggestion was shown or stayed quiet, whether the first guess was right and where the real destination ranked, a confidence band, and whether the destination was a known or a new place. No coordinates, place IDs or timestamps.</p>
        </Engineering>
        <Gap id="DI-G43">Approval for the trip-end quality event, and which service receives it.</Gap>
        <Gap id="DI-G44">Whether naming a predicted place sends its coordinate online.</Gap>
        <Gap id="DI-G8">The full context contract, and whether route geometry fits size and cadence limits.</Gap>
      </Section>

      <Section id="request" title="What your assistant sends">
        <p>Your assistant keeps the conversation and resolves references before calling DI. It sends a clean natural-language request. Partners that won't send words can send structured places plus conditions, such as open on arrival, charge level or a time window.</p>
        <Engineering>
          <p style={{ margin: 0 }}>In engineering's test scenarios for an assistant, every call stands alone: it carries the request without the conversation, plus the request context. That context is the vehicle, the route with its state (none, planning or active), the driver and the locale. DI keeps no conversation history.</p>
        </Engineering>
        <Gap id="DI-G7">Format of both request kinds.</Gap>
      </Section>

      <Section id="data-handling" title="Data handling and privacy">
        <p>With the DI SDK, navigation memory (places, what the driver calls them, preferences) stays in the car. DI doesn't store conversations.</p>
        <Direction>Memory split by domain is not signed off, and changed recently. Cloud-held personal data needs a data agreement.</Direction>
        <Gap id="DI-G11">Retention, consent and Legal requirements for cloud-only integrations.</Gap>
      </Section>
    </div>
  );
}

/* ─── Response contract ────────────────────────────────────────────────────── */

export function DIResponseContract({ onNavigate }) {
  return (
    <div className="page">
      <h1>Response contract</h1>
      <PageActions />
      <DraftBanner onNavigate={onNavigate} />
      <p className="quick-answer">
        DI returns structured data, never prose: one recommendation with its reason, the option it beat, urgency, validity, and
        how it should be presented; your assistant writes the words.
      </p>

      <Section id="overview" title="Overview">
        <p>A few flexible operations return the same structure, rather than one endpoint per use case. The reason is a summary, not DI's internal working. Supporting data is included so your assistant can reason on top; an arrival-time answer can carry the traffic, delays and incidents behind it.</p>
      </Section>

      <Section id="fields" title="Fields">
        <Table head={['Content', 'Meaning', 'Status']} rows={[
          ['Where, how much, when', 'The three questions every moment answers.', <Status s="Defined" />],
          ['Recommendation', 'The one answer.', <Status s="Direction" />],
          ['Reason', 'Why, as a short summary tied to the road.', <Status s="Direction" />],
          ['Alternative it beat', 'The option DI rejected and why.', <Status s="Direction" />],
          ['What changed', 'For proactive moments, what is different today.', <Status s="Direction" />],
          ['Evidence', 'What the claim is based on, such as live against usual travel time and how many trips the usual comes from.', <Status s="Direction" />],
          ['Urgency', 'How soon it matters.', <Status s="Direction" />],
          ['Validity', 'How long it holds; after that it must not be shown.', <Status s="Direction" />],
          ['Say or show', 'Whether to speak it, show it, or both.', <Status s="Direction" />],
          ['How much screen', 'How much of the screen it deserves.', <Status s="Direction" />],
          ['Confidence', 'How sure DI is, including when context was partial.', <Status s="To be defined" />],
          ['Place source', 'Whether a place came from TomTom data or a web fallback.', <Status s="To be defined" />],
        ]} />
        <Engineering>
          <p style={{ margin: 0 }}>The DI API's reactive answer, as engineering is reshaping it: a status, structured data (places, routes, range, traffic), and a short summary note in English for the assistant, with no voice output. Test scenarios grade what the driver hears and what the screen ends up showing, not which calls were made. The proactive call always returns the route, and adds a notification only when there is something worth telling.</p>
        </Engineering>
        <Gap id="DI-G5">Field names, types and allowed values.</Gap>
        <Gap id="DI-G31">How confidence and partial context are expressed.</Gap>
        <Gap id="DI-G20">Whether web-fallback places are flagged.</Gap>
      </Section>

      <Section id="moment-fields" title="Moment fields (proposal)">
        <Proposal>
          <p style={{ margin: '0 0 8px' }}>DI sends a moment in its own schema, never UI components. The design direction proposes these fields. Names are as proposed; types and allowed values are not defined.</p>
          <Table head={['Field', 'What it says', 'In the example below']} rows={[
            [<code>trigger</code>, 'What started the moment: road (nobody asked) or request.', <code>road</code>],
            [<code>speak</code>, 'Whether to speak at all.', <code>true</code>],
            [<code>where</code>, 'The destination, and the roads the better way goes via.', 'To work, via the M1 and M25'],
            [<code>usual</code>, 'How the driver usually goes, and when that arrives.', 'Via the A406, arriving 09:24'],
            [<code>better</code>, 'The better way: when it arrives and how many minutes it saves.', 'Arriving 09:02, 22 minutes sooner'],
            [<code>why</code>, 'The reason, tied to the road.', 'A 33-minute jam on the A406 at Staples Corner'],
            [<code>familiarity</code>, 'How well the driver knows the road. A known road means a shorter message.', <code>known_road</code>],
            [<code>valid_until</code>, 'When the moment expires, such as a junction.', 'Staples Corner'],
            [<code>actions</code>, 'What the driver can do.', <span><code>go</code>, <code>not_today</code></span>],
          ]} />
          <p style={{ margin: '12px 0 6px' }}><strong>Against the product description's list</strong></p>
          <Table head={['Product description', 'Proposed field']} rows={[
            ['Recommendation', <span><code>where</code>, <code>better</code></span>],
            ['Reason', <code>why</code>],
            ['Alternative it beat', <span><code>usual</code>, for proactive moments. Not covered for a reactive answer.</span>],
            ['Urgency', 'No field'],
            ['How long it is valid', <span><code>valid_until</code>, a place in the example, not a time</span>],
            ['Say or show', <span><code>speak</code> says whether to speak. Showing is not covered.</span>],
            ['How much screen', <code>familiarity</code>],
            ['Not in the list', <span><code>trigger</code>, <code>actions</code></span>],
          ]} />
        </Proposal>
        <p>Until the two lists are reconciled, the product description's list under Fields, above, is the basis for these docs.</p>
        <Gap id="DI-G35">Which list the contract is built on, and how urgency, say or show, and validity are expressed.</Gap>
      </Section>

      <Section id="example" title="Example">
        <Proposal>
          <p style={{ margin: '0 0 8px' }}><strong>Illustrative only.</strong> A first draft of the moment schema, not an API: field names can change and there is no schema version yet. A London commute on a Wednesday: a jam on the A406 makes the M1 and M25 22 minutes faster.</p>
          <CodeBlock label="Illustrative moment (proposal)" language="json" code={
`{
  "moment": "faster_way_to_work",
  "trigger": "road",
  "speak": true,
  "where": { "to": "Work", "via": ["M1", "M25"] },
  "usual": { "via": ["A406"], "arrive": "09:24" },
  "better": { "arrive": "09:02", "saves_min": 22 },
  "why": { "jam_min": 33, "at": "A406, Staples Corner" },
  "familiarity": "known_road",
  "valid_until": "Staples Corner",
  "actions": ["go", "not_today"]
}`} />
          <p style={{ margin: '8px 0 0' }}>Your assistant might say: "There's a jam on the A406. The M1 and M25 get you to work by 09:02, 22 minutes sooner. Want to switch?" On a known road, it doesn't read out directions.</p>
          <p style={{ margin: '8px 0 0', fontSize: '0.8125rem', color: 'var(--mid)' }}>The example also carries <code>moment</code>, a name for the kind of moment, which is not in the proposed field list (DI-G35).</p>
        </Proposal>
        <Gap id="DI-G32">How the moment schema is versioned.</Gap>
        <p style={{ marginTop: 18 }}>The technical direction draft gives another proactive moment, on a predicted drive home, as content:</p>
        <Table head={['Content', 'Illustrative value']} rows={[
          ['What changed', 'Both of the driver\'s usual routes home are about 20 minutes slower than normal tonight.'],
          ['Evidence', 'Live travel time against this driver\'s usual for this route and hour, with sample count.'],
          ['Recommendation', 'Go via the A10 east and Gooiseweg.'],
          ['Alternative it beat', 'The usual routes: about 12 minutes slower.'],
          ['Validity', 'Until the drive passes the point where the routes split.'],
        ]} />
        <p>Your assistant might say: "Both the ways you usually go home are about 20 minutes slower tonight. Going via the A10 east and Gooiseweg is about 12 minutes quicker."</p>
        <Gap id="DI-G5">A real example payload, once the schema exists.</Gap>
      </Section>

      <Section id="rendering" title="Rendering (proposal)">
        <p>DI's answer stops at the moment. Drawing it, on a screen or by voice, is on your side.</p>
        <Proposal>
          <Table head={['Path', 'For', 'How it works', 'Status']} rows={[
            ['UX Library and A2UI', 'Partners that also license UX Library and run the DI SDK', 'A mapping in the DI SDK turns each moment into A2UI on the device, against the UX Library component catalog. The A2UI Compose renderer draws it. To your app it looks as if DI sent UI.', <Status s="Planned" />],
            ['Draw it yourself', 'Partners without UX Library, including voice-only assistants', 'Your app or assistant takes the moment as it is and draws it with its own components, or speaks it.', <Status s="Alpha" />],
          ]} />
          <Figure title="Two ways to draw a moment" status="Proposal" minWidth={720}
            caption="DI sends the same moment on both paths. Only the UX Library path adds an on-device mapping to A2UI. Who gets that path, and when, is open (DI-G36).">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
              <LayerDiagram compact width={420} label="UX Library path: the DI API returns a moment; the DI SDK in the car maps it to A2UI against the UX Library catalog; the A2UI Compose renderer in your app draws approved components." layers={[
                { label: 'TomTom cloud', boxes: [{ label: 'DI API', sub: 'Decides; returns one moment', tone: 'tomtom' }], link: 'The moment', linkDir: 'down' },
                { label: 'In the car', boxes: [{ label: 'DI SDK', sub: 'Maps the moment to A2UI', tone: 'tomtom' }], link: 'A2UI, UX Library catalog', linkDir: 'down' },
                { label: 'Your app', boxes: [{ label: 'A2UI Compose renderer', sub: 'Draws approved UX Library components', tone: 'external' }] },
              ]} />
              <LayerDiagram compact width={420} label="Draw it yourself: DI returns a moment; your app draws it with your own components, or your assistant speaks it." layers={[
                { label: 'TomTom', boxes: [{ label: 'DI', sub: 'Decides; returns one moment', tone: 'tomtom' }], link: 'The moment', linkDir: 'down' },
                { label: 'Your side', boxes: [
                  { label: 'Your components', sub: 'On your screen', tone: 'partner' },
                  { label: 'Your assistant', sub: 'By voice only', tone: 'partner' },
                ] },
              ]} />
            </div>
          </Figure>
          <p style={{ margin: '10px 0 6px' }}><strong>Caveats</strong></p>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>The A2UI Compose libraries are alpha (1.0.0-alpha01). The fallback is the same mapping calling the UX Library composables directly, with the same catalog.</li>
            <li>The DI SDK and UX Library share the catalog. A catalog change needs a version bump on both sides.</li>
            <li>DI never generates free-form UI. A restricted catalog of approved components is the boundary of what can appear: generated free-form UI is not allowed in a car.</li>
          </ul>
        </Proposal>
        <p>The product description plans DI choosing from agreed components, UX Library or the partner's own, as step 3, after the current alpha. Until then, every partner draws the moment.</p>
        <ApiLinks onNavigate={onNavigate} title="Products on the UX Library path" items={[
          { type: 'UX Library', name: 'UX Library', description: 'The component catalog a moment would map to. Catalog version to be defined (DI-G33).', pageId: 'overview', productId: 'ux-library' },
          { type: 'UX Library', name: 'Route Bar', description: 'Its minimised state is one of the proposed surfaces for a moment.', pageId: 'route-bar', productId: 'ux-library' },
        ]} />
        <Gap id="DI-G36">Who gets the UX Library path: with or without the DI SDK, and for a partner's own component catalog.</Gap>
        <Gap id="DI-G33">Who owns the catalog, how it is versioned, and how DI SDK and UX Library releases stay in step.</Gap>
        <Gap id="DI-G34">Which A2UI version the DI SDK targets, and when the fallback applies.</Gap>
      </Section>

      <Section id="format" title="Output format">
        <p>The product description leaves the format open: DI's own format with A2UI on top, or A2UI directly. A2UI is an open protocol for an agent to describe UI from a catalog of components the app supports. The product description's own proposal is the first option.</p>
        <Proposal>
          <p style={{ margin: 0 }}>Keep DI's own moment format. Add A2UI only on the device, and only for partners that license UX Library (see Rendering, above). Partners without UX Library get the moment and draw it themselves, on screen or by voice.</p>
        </Proposal>
        <Gap id="DI-G6">DI's own format with A2UI on top, or A2UI directly.</Gap>
      </Section>

      <Section id="wording" title="Wording">
        <p>Your assistant owns every word the driver hears. Use the reason and the alternative to explain; don't read the data out field by field.</p>
        <Gap id="DI-G26">Languages and locales for requests and reasons.</Gap>
      </Section>
    </div>
  );
}

/* ─── Errors and fallback ──────────────────────────────────────────────────── */

export function DIErrors({ onNavigate }) {
  return (
    <div className="page">
      <h1>Errors and fallback</h1>
      <PageActions />
      <DraftBanner onNavigate={onNavigate} />
      <p className="quick-answer">
        If DI can't answer, fails or runs past its time budget, your assistant should fall back to its own capabilities; a DI
        failure must never break the assistant.
      </p>

      <Section id="fallback" title="Fall back gracefully">
        <ul>
          <li>Treat DI as one tool among several. If it can't fulfil a request, errors, or exceeds the agreed response time, continue with your existing capabilities.</li>
          <li>Inside DI, when one TomTom engine fails, DI tries to recover and still return one answer.</li>
        </ul>
      </Section>

      <Section id="silence-vs-failure" title="Silence is not failure">
        <p>"Nothing worth saying" is DI's most common proactive answer. Don't show an error, retry, or fill the space when DI stays silent.</p>
        <Engineering>
          <p style={{ margin: 0 }}>Inside the DI SDK, prediction already tells three cases apart when it returns no destination: the input was invalid, the trip history couldn't be read in time, or it wasn't confident enough. Only the last is the silent case. On the proactive call, no notification next to the route means nothing worth saying.</p>
        </Engineering>
        <Gap id="DI-G13">How a response distinguishes "nothing worth saying" from "could not answer".</Gap>
      </Section>

      <Section id="time-budgets" title="Time budgets">
        <Table head={['Mode', 'Budget']} rows={[
          ['Reactive', 'A few seconds'],
          ['Proactive', '10 to 20 seconds is acceptable when the event is minutes away'],
        ]} />
        <Direction>Budgets are design targets from the product description, not service levels.</Direction>
        <Gap id="DI-G13">Exact timeouts.</Gap>
      </Section>

      <Section id="codes" title="Error codes">
        <Gap id="DI-G13">Error codes, messages and which errors can be retried.</Gap>
      </Section>

      <Section id="limits" title="Limits">
        <Gap id="DI-G14">Request limits per edition, rate limits and evaluation cadence.</Gap>
      </Section>
    </div>
  );
}

/* ─── Glossary ─────────────────────────────────────────────────────────────── */

export function DIGlossary({ onNavigate }) {
  return (
    <div className="page">
      <h1>Glossary</h1>
      <PageActions />
      <DraftBanner onNavigate={onNavigate} />
      <p className="quick-answer">Terms used across the Driving Intelligence docs, as the product defines them.</p>

      <Section id="terms" title="Terms">
        <Table head={['Term', 'Meaning']} rows={[
          ['A2UI', 'Agent-to-User Interface: an open protocol for an agent to describe UI from a catalog of components the app supports.'],
          ['Automotive Navigation Application', 'TomTom\'s in-car navigation app.'],
          ['City drive (proposal)', 'An everyday drive: proactive first, barely visible. Name not agreed (DI-G37).'],
          ['Component catalog', 'The set of approved components an A2UI renderer may draw. In the design proposal, the UX Library catalog.'],
          ['DI API', 'DI\'s cloud service, where reasoning happens.'],
          ['DI SDK', 'DI\'s thin in-car client for Android. Not the Maps & Navigation SDK.'],
          ['Driver model', 'The in-car model that learns this driver\'s trips and predicts where a drive is going.'],
          ['Free drive', 'A drive with no destination entered.'],
          ['Functional prompt', 'The driver\'s request as the assistant passes it to DI, without conversational context.'],
          ['Horizon', 'The NavSDK feature that reports events about 10 km ahead.'],
          ['Leisure drive (proposal)', 'A trip the driver plans: reactive first, full navigation. Name not agreed (DI-G37).'],
          ['Maps & Navigation SDK (NavSDK)', 'TomTom\'s navigation SDK. The DI SDK depends on it.'],
          ['Moment', 'One DI output, answering where, how much and when.'],
          ['Most probable path', 'The road NavSDK expects the car to take when no route is set.'],
          ['Orchestrator', 'The carmaker\'s main assistant. Owns the conversation and decides which specialist to ask.'],
          ['Proactive / reactive', 'DI speaks up unprompted / the driver asks.'],
          ['Route variant', 'One of the distinct ways a driver usually drives between two places.'],
          ['Trigger (proposal)', 'What started a moment: the road, when nobody asked, or a request.'],
          ['UX Library', 'TomTom\'s modular UI components, an alternative to taking the Automotive Navigation Application whole.'],
        ]} />
        <Gap id="DI-G29">Public names of the SDK and the API.</Gap>
      </Section>
    </div>
  );
}

/* ─── Draft gap report ─────────────────────────────────────────────────────── */

const SEV_ORDER = { Blocker: 0, Major: 1, Minor: 2 };

export function DIGapReport({ onNavigate }) {
  const counts = DI_GAPS.reduce((a, g) => ({ ...a, [g.severity]: (a[g.severity] || 0) + 1 }), {});
  const sorted = [...DI_GAPS].sort((a, b) => SEV_ORDER[a.severity] - SEV_ORDER[b.severity]);
  return (
    <div className="page">
      <h1>Draft gap report</h1>
      <PageActions />
      <DraftBanner onNavigate={onNavigate} />
      <p className="quick-answer">
        Everything a developer needs to integrate Driving Intelligence that the sources can't answer yet, for the product and
        docs teams to close before these pages are published.
      </p>
      <Callout type="warn"><strong>For the product and docs teams, not customers.</strong> Owners are roles; named owners are in the copy kept with the source snapshot.</Callout>

      <Section id="sources" title="Sources read">
        <Table head={['Source', 'Version', 'Used for']} rows={DI_SOURCES.map(s => [s.name, s.version, s.role])} />
        <p>Precedence when sources disagree: code or spec, then technical direction, then PKD, then the design direction, then decks. Code now exists, but no public interface: the DI SDK (0.0.1) and the DI API are internal work in progress. Pages show engineering content in an "In engineering, not released" block; recorded engineering decisions and code rank above the PKD, and working design pages count as direction. Everything from the design direction is a proposal: pages show it in a "Proposal, not agreed" block, and where it conflicts with the PKD, the PKD applies and the conflict is a gap.</p>
      </Section>

      <Section id="shape" title="Shape">
        <p><strong>{DI_SHAPE.shape}.</strong> {DI_SHAPE.summary}</p>
        <ul>{DI_SHAPE.evidence.map((e, i) => <li key={i}>{e}</li>)}</ul>
      </Section>

      <Section id="summary" title="Summary">
        <p><strong>{counts.Blocker || 0}</strong> blockers · <strong>{counts.Major || 0}</strong> major · <strong>{counts.Minor || 0}</strong> minor.</p>
        <p>The three gaps that block the most pages: <strong>DI-G5</strong> response schema, <strong>DI-G2</strong> base URL and operations, <strong>DI-G7</strong> request format. Without them there is nothing to call and nothing to parse.</p>
        <p>Volatile areas: navigation memory and place search fallback (both recently changed in the PKD), the output format and rendering (now with a design proposal), and the moment schema itself.</p>
        <p>This rerun read the PKD again on 26 Oct and found it unchanged since 22 Oct. It added the design direction as a source, updated DI-G5, DI-G6, DI-G11, DI-G12, DI-G19, DI-G23, DI-G25 and DI-G27, and added DI-G32 to DI-G38.</p>
        <p>A fourth pass the same evening added DI engineering's work in progress and the UX Library's code as sources. It updated DI-G3, DI-G5, DI-G7, DI-G12, DI-G16, DI-G23 and DI-G30, and added DI-G39 to DI-G45. The proactive call is now decided for its first version (DI-G12 narrows to the interval and delivery to the assistant); how the DI SDK gets navigation data is a new conflict between three sources (DI-G39).</p>
      </Section>

      <Section id="conflicts" title="Proposals that conflict with the PKD">
        <p>The PKD applies in each case. The page shows the proposal in a Proposal block and points to the gap.</p>
        <Table head={['Topic', 'Design direction proposes', 'PKD says', 'Gap']}
          rows={DI_CONFLICTS.map(c => [c.topic, c.proposal, c.pkd, <code style={{ whiteSpace: 'nowrap' }}>{c.gap}</code>])} />
      </Section>

      <Section id="gaps" title="Gaps">
        <Table head={['ID', 'Severity', 'Question', 'Why a developer needs it', 'Blocks', 'Source', 'Suggested owner']}
          rows={sorted.map(g => [<code style={{ whiteSpace: 'nowrap' }}>{g.id}</code>, g.severity, g.q, g.why, <code style={{ fontSize: '0.6875rem' }}>{g.blocks}</code>, g.source, g.owner])} />
      </Section>

      <Section id="template-gaps" title="Template gaps (for the docs team)">
        <ul>{DI_TEMPLATE_GAPS.map((t, i) => <li key={i}>{t}</li>)}</ul>
      </Section>

      <Section id="screened" title="Screened out">
        <ul>{DI_SCREENED.map((t, i) => <li key={i}>{t}</li>)}</ul>
      </Section>

      <Section id="follow-ups" title="Cross-product follow-ups">
        <ul>{DI_FOLLOWUPS.map((t, i) => <li key={i}>{t}</li>)}</ul>
      </Section>
    </div>
  );
}
