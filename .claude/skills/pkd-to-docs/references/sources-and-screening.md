# Sources and screening

## Reading a PKD like a customer

A PKD is written for the product team, leadership and account owners. A developer docs page is written for someone integrating the product next week. Read each PKD section and ask: *would an integrating developer act on this?*

| PKD content | Docs treatment |
|---|---|
| What it does, capabilities, use cases, examples, quotes | Intro, concept and guide pages |
| How it fits / integration model / architecture | Concepts, integration paths, architecture diagram |
| How it ships (API, SDK, MCP), contract, response shape | Reference pages (as far as defined) |
| Experience or design principles | A guidance page for integrators ("Designing with X") |
| Glossary | Glossary page, and consistent terms everywhere |
| Roadmap | Only as availability/status labels on features (Alpha, Preview, Planned). No dates unless public. |
| Tiers / editions | Feature availability by edition, **without prices or commercial reasoning** |
| Market, accounts, competitors, pricing, risks, internal decisions | **Never on a page.** Gaps or notes in the gap report only. |
| "How we talk about it" (say/avoid) | Use as a style constraint on your own wording; don't publish the list |

## Status tags

Many PKDs tag statements. Treat them as:

- **AGREED** — settled. Write it as fact.
- **LEANING** — direction, not signed off. Write it with an inline callout ("Direction, not final") and add a gap so the owner confirms before publication.
- **OPEN** — undecided. Don't write it as content. Add a gap; where a template section depends on it, show a placeholder pointing to the gap ID.
- **CHECK** — a claim to verify. Leave it out of pages; log it.
- **Untagged** — treat like AGREED if it's descriptive, like LEANING if it's a choice that could change.
- **PROPOSAL** — a suggestion from a source outside the PKD, not a decision. Write it inside a Proposal block, never as plain prose. See below.

### Proposals from outside the PKD

Sometimes the user adds a source that proposes rather than records: a design lead's direction, an architect's memo, a review's recommendations. Tag every item from it PROPOSAL, even where it sounds settled.

- **Rank it where the user says.** If they don't say, put it below the PKD and the technical direction and above decks. Note it in the gap report's sources list with its author's role and date.
- **Snapshot it like any other source.** Save the text, and notes on any reference material it points to, in the dated source folder. Screen that reference material the same way as the PKD: it often carries team, programme and vendor names.
- **Show it in a Proposal block.** Use the `Proposal` component from `assets/page-skeleton.jsx` ("Proposal, not agreed", plus the source and date). Keep proposal content inside the block and the agreed or Direction content outside it, so a reader can always tell them apart. When a whole section comes from the proposal, add "(proposal)" to its `h2` and TOC label. Say in the draft banner that blocks marked Proposal are not agreed.
- **Where it conflicts with the PKD, the PKD applies.** The page states the PKD's position outside the block, shows the proposal inside it, and points to a gap. Log each conflict as a gap (a new one, or an update to an existing one), and list it in a conflicts table in the gap-report data (`<PREFIX>_CONFLICTS`: topic, what the proposal says, what the PKD says, gap ID). This covers wording too: a proposal that uses a term on the PKD's avoid list is a conflict, and the page uses the PKD's wording.
- **A proposal that answers an OPEN item doesn't close it.** Add the proposed answer and any proposed owner (as a role) to the gap's question and source; the gap stays open until the product team decides. Where the proposal opens new questions (a version, a dependency, an owner nobody named), add gaps for them.
- **Proposed field names may appear in an example.** Unlike invented names, they come from a source, so an example can show them as JSON inside the Proposal block, labelled illustrative and "not an API". The contract sections still follow the PKD and technical direction.
- **Tell the AI context file too.** Put proposals in their own PROPOSAL section with the same warning: never present them as the contract.

Changelog notes inside the PKD ("Changed 20 Oct: previously …") matter: they tell you what is volatile. Mention volatile areas in the gap report.

## Screening: what never reaches a page

The prototype repo is public. Even after screening, a pre-release product's pages shouldn't be pushed without the user's say-so. Within pages, remove:

- **Customer and partner names** (OEMs, Tier 1s, vendors, prospects) and anything about a deal, pilot, PoC, relationship or risk with them. Rewrite as a generic pattern if it's useful ("an integration without NavSDK", "a cloud-only integration").
- **Competitors** and comparisons with them.
- **Pricing, pricing units, cost to serve, margins.** Edition/feature availability can stay if the PKD presents it as product packaging; omit anything still OPEN. Limits are different: a developer needs to know a limit exists ("the Free edition has a request limit"), so say that and gap the number — never publish the figure or its commercial reasoning.
- **People's names, owners, internal team names, meeting dates, internal metrics** (usage percentages, internal app analytics), **internal codenames** that aren't product names.
- **Internal positioning language** (objection handling, "say/avoid" lists, kill criteria, investment decisions).
- **Legal/privacy positions still under review.** Describe data handling only where it is AGREED; otherwise gap it to the owner and Legal.

Build a deny list as you read (all customer, partner, competitor and people names you saw, plus internal codenames and benchmark names) and pass it to `check_product.py --deny`. Keep that list with the source snapshot, not in the repo. Matching is case-sensitive and whole-word, so write names as they appear (`HERE`, `MINI`); prefix a line with `i:` to match regardless of case.

## Naming the product consistently

Use the product's own name and component names exactly as the PKD's glossary defines them (e.g. "DI SDK" is not "NavSDK"). If the PKD uses several names for one thing, pick the glossary's and log the inconsistency as a gap. Retired names never appear (see `principles.md`).
