/* ─────────────────────────────────────────────────────────────────────────────
 * Driving Intelligence — illustrative moments for the use-case pages (DRAFT, pkd-to-docs skill)
 * Field names are the design direction's PROPOSAL (26 Oct 2026); the schema is not defined (DI-G5, DI-G35).
 * The faster-way moment is the design direction's own London example, verbatim. The others reuse its
 * field and sub-field names, take their values from the PKD's examples, and leave out what the PKD doesn't say.
 * `copy` is what an app or assistant might write from the fields: the partner owns the wording.
 * `pkd` restates each example in the product description's own terms (recommendation, reason, option it beat).
 * ───────────────────────────────────────────────────────────────────────────── */

// Fields each surface draws, from the design direction's DI-G19 proposal. The widget draws every field.
export const DI_SURFACES = {
  widget: {
    label: 'Your widget',
    sub: 'In an app built on the UX Library: the app\'s own Mini app slot',
    status: 'UX Library today',
    tone: 'ok',
    fields: null,
    note: 'Touch works only at the largest Mini app size; at smaller sizes the actions come by voice.',
  },
  bar: {
    label: 'Route Bar, minimised',
    sub: 'UX Library component',
    status: 'Planned in UX Library',
    tone: 'planned',
    fields: ['where', 'usual', 'better', 'why', 'valid_until'],
    note: 'The Route Bar is planned, and its page says it is hidden in free drive today (DI-G45).',
  },
  tile: {
    label: 'Cluster tile',
    sub: 'Behind the wheel',
    status: 'Needs a UX Library change',
    tone: 'change',
    fields: ['where', 'usual', 'better', 'actions'],
    note: 'The UX Library cluster screen stays empty until a trip is active (DI-G45).',
  },
  voice: {
    label: 'Voice',
    sub: 'Your assistant says it',
    status: 'Your assistant',
    tone: 'neutral',
    fields: ['speak', 'where', 'better', 'why', 'familiarity', 'actions'],
    note: 'Your assistant writes the sentence; DI chose what is worth saying.',
  },
};

export const DI_MOMENTS = [
  {
    id: 'faster-way',
    pageId: 'di-uc-faster-way',
    pkd: [
      ["Recommendation", "Go via the M1 and M25, in by 09:02."],
      ["Reason", "A 33-minute jam on the A406 at Staples Corner."],
      ["Option it beat", "The usual way, the A406, in by 09:24."],
      ["How long it holds", "Until Staples Corner."],
    ],
    mode: 'Proactive',
    status: 'Alpha',
    title: 'A faster way to work',
    summary: 'On a drive where nothing was entered, DI notices that today\'s usual way is slow, finds one that still gets the driver in on time, and sends one moment.',
    scenario: 'Wednesday on the London commute. Nothing is entered; DI predicted the drive to work. A jam on the A406 makes the M1 and M25 22 minutes faster.',
    source: 'The design direction\'s illustrative example',
    sends: null,
    moment: {
      moment: 'faster_way_to_work',
      trigger: 'road',
      speak: true,
      where: { to: 'Work', via: ['M1', 'M25'] },
      usual: { via: ['A406'], arrive: '09:24' },
      better: { arrive: '09:02', saves_min: 22 },
      why: { jam_min: 33, at: 'A406, Staples Corner' },
      familiarity: 'known_road',
      valid_until: 'Staples Corner',
      actions: ['go', 'not_today'],
    },
    surfaces: ['widget', 'bar', 'tile', 'voice'],
    copy: {
      eyebrow: 'Faster way to work',
      big: 'In by 09:02',
      why: '33-minute jam on the A406. The M1 and M25 get you there 22 minutes sooner than your usual 09:24.',
      until: 'until Staples Corner',
      rows: [['Usual, A406', '09:24'], ['M1, M25', '09:02']],
      bar: 'M1, M25 · 22 min sooner',
      voice: 'There\'s a jam on the A406. The M1 and M25 get you to work by 09:02, 22 minutes sooner. Want to switch?',
      actions: ['Go', 'Not today'],
    },
    checks: [
      'Watches the usual route against today\'s traffic, closures and hazards.',
      'Speaks up only when today is different; usual delays stay silent.',
      'Compares against the driver\'s usual route and gives arrival times, not durations.',
      'On a known road the message is shorter, and no directions are read out.',
    ],
  },
  {
    id: 'closure',
    pageId: 'di-uc-closure',
    pkd: [
      ["Recommendation", "Go via the A5 today."],
      ["Reason", "The A10 is closed."],
      ["Option it beat", "The usual way, the A10."],
      ["How long it holds", "Not in the example."],
    ],
    mode: 'Proactive',
    status: 'Alpha',
    title: 'A closure on the usual road',
    summary: 'DI spots a closure on the way the driver usually goes, and speaks once, with the way round.',
    scenario: 'No destination entered. DI predicted the drive, and the road the driver usually takes is closed today.',
    source: 'The product description\'s example line; the vision deck\'s closure scenario',
    sends: null,
    moment: {
      trigger: 'road',
      speak: true,
      where: { via: ['A5'] },
      usual: { via: ['A10'] },
      why: 'A10 closed',
      familiarity: 'known_road',
      actions: ['go', 'not_today'],
    },
    surfaces: ['widget', 'bar', 'tile', 'voice'],
    copy: {
      eyebrow: 'Closure on your usual road',
      big: 'Via the A5 today',
      why: 'The A10 is closed.',
      rows: [['Usual, A10', 'Closed'], ['Today', 'A5']],
      bar: 'A10 closed · via A5',
      voice: 'A10 closed, going via the A5 today.',
      actions: ['Go', 'Not today'],
    },
    checks: [
      'Predicts the trip at key-on, with nothing entered.',
      'Watches the usual route against today\'s closures, and speaks once.',
      'Gives the reason with the alternative: what is closed, and the way round.',
    ],
  },
  {
    id: 'save-place',
    pageId: 'di-uc-save-place',
    pkd: [
      ["Recommendation", "Save this place as the office."],
      ["Reason", "3 visits in 4 weeks."],
      ["Option it beat", "Not in the example."],
      ["How long it holds", "Not in the example."],
    ],
    mode: 'Personal',
    status: 'Alpha',
    title: 'Save a place the driver keeps going to',
    summary: 'DI learns the places a driver keeps stopping at and asks before it assumes, so your assistant can offer to save one.',
    scenario: 'The driver has stopped at the same place three times in four weeks.',
    source: 'The product description\'s example line and nudge rule',
    sends: null,
    moment: {
      trigger: 'road',
      speak: true,
      where: { to: 'the office' },
      why: '3 visits in 4 weeks',
      actions: ['save', 'not_now'],
    },
    surfaces: ['widget', 'voice'],
    copy: {
      eyebrow: 'Save a place',
      big: 'Save this as the office?',
      why: 'You\'ve stopped here 3 times in 4 weeks.',
      voice: 'Save this as the office?',
      actions: ['Save', 'Not now'],
    },
    checks: [
      'Nudges after 3 visits in 4 weeks.',
      'Asks before it assumes; the driver names the place.',
      'With the DI SDK, the driver\'s places stay in the car.',
    ],
  },
  {
    id: 'charger',
    pageId: 'di-uc-charger',
    pkd: [
      ["Recommendation", "A charger on the way."],
      ["Reason", "Charge and traffic checked against the arrival time: still in before nine."],
      ["Option it beat", "Not in the example, and the proposed fields have no place for it (DI-G35)."],
      ["How long it holds", "Not in the example."],
    ],
    mode: 'Reactive',
    status: 'Early access',
    title: 'A charger on the way',
    summary: 'The driver asks for a charger that still gets them in on time; DI returns one recommendation with its reason, checked against charge and traffic at arrival.',
    scenario: 'An electric car that has to arrive before nine.',
    source: 'The product description\'s example request',
    sends: 'A charger on the way that still gets me in before nine.',
    moment: {
      trigger: 'request',
      speak: true,
      where: { via: ['A charger on the way'] },
      better: { arrive: 'before 09:00' },
      why: 'Charge and traffic checked against your arrival time',
      actions: ['go'],
    },
    surfaces: ['widget', 'bar', 'voice'],
    copy: {
      eyebrow: 'Charger on the way',
      big: 'In before 9:00',
      why: 'Charge and traffic checked against your arrival time.',
      bar: 'Charger · still in before 9:00',
      voice: 'There\'s a charger on the way that still gets you in before nine. Want to stop there?',
      actions: ['Go'],
    },
    checks: [
      'Checks charge at arrival, including enough for the next leg.',
      'Checks traffic against the arrival time, not the time of asking.',
      'Returns one recommendation, the reason, and the option it beat.',
    ],
  },
  {
    id: 'coffee',
    pageId: 'di-uc-coffee',
    pkd: [
      ["Recommendation", "Coffee ahead on the route."],
      ["Reason", "Within 45 minutes, ahead of the driver."],
      ["Option it beat", "Not in the example, and the proposed fields have no place for it (DI-G35)."],
      ["How long it holds", "Not in the example."],
    ],
    mode: 'Reactive',
    status: 'Early access',
    title: 'Coffee in the next 45 minutes',
    summary: 'The driver asks for a stop within a time window; DI returns one place ahead on the route, not behind.',
    scenario: 'The driver wants a break within the next 45 minutes.',
    source: 'The product description\'s example request',
    sends: 'Coffee in the next 45 minutes.',
    moment: {
      trigger: 'request',
      speak: true,
      where: { via: ['Coffee, ahead on your route'] },
      why: 'Within 45 minutes, ahead of you',
      actions: ['go'],
    },
    surfaces: ['widget', 'bar', 'voice'],
    copy: {
      eyebrow: 'Coffee on the way',
      big: 'Ahead, within 45 min',
      why: 'On your route, ahead of you, not behind.',
      bar: 'Coffee · ahead',
      voice: 'There\'s coffee ahead on your route, well within 45 minutes. Shall I add it?',
      actions: ['Go'],
    },
    checks: [
      '"On the way" means ahead of the driver.',
      'Weighs the detour and traffic, not only the distance.',
      'Returns one recommendation, the reason, and the option it beat.',
    ],
  },
  {
    id: 'open-on-arrival',
    pageId: 'di-uc-open-on-arrival',
    pkd: [
      ["Recommendation", "A place to eat on the way."],
      ["Reason", "Open when the driver gets there."],
      ["Option it beat", "Not in the example, and the proposed fields have no place for it (DI-G35)."],
      ["How long it holds", "Not in the example."],
    ],
    mode: 'Reactive',
    status: 'Early access',
    title: 'Somewhere to eat, open when you arrive',
    summary: 'The driver asks for a place to eat; DI checks opening hours against the arrival time, so the place is open when they get there.',
    scenario: 'The driver wants to eat on the way.',
    source: 'The product description\'s example request',
    sends: 'Somewhere to eat on the way that\'s open when I get there.',
    moment: {
      trigger: 'request',
      speak: true,
      where: { via: ['Somewhere to eat on the way'] },
      why: 'Open when you get there, checked against your arrival time',
      actions: ['go'],
    },
    surfaces: ['widget', 'bar', 'voice'],
    copy: {
      eyebrow: 'Somewhere to eat',
      big: 'Open when you arrive',
      why: 'Opening hours checked against your arrival time, not now.',
      bar: 'Food · open on arrival',
      voice: 'There\'s a place to eat on the way that\'s open when you get there. Want to stop?',
      actions: ['Go'],
    },
    checks: [
      'A place must be open when the driver arrives, not now.',
      'Checks this for place candidates whoever found them.',
      'Returns one recommendation, the reason, and the option it beat.',
    ],
  },
];

export function diMoment(id) {
  return DI_MOMENTS.find(m => m.id === id);
}

// Fields a surface draws for this moment: the surface's subset, limited to the fields the moment has.
export function diSurfaceFields(moment, surface) {
  const keys = Object.keys(moment.moment).filter(k => k !== 'moment');
  const pick = DI_SURFACES[surface].fields;
  return pick ? pick.filter(k => keys.includes(k)) : keys;
}
