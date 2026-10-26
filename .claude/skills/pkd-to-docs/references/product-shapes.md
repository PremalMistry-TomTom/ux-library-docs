# Product shapes

Pick the shape from what the developer installs or calls. A product can be more than one; then it gets more than one page set, under one product ID.

| Shape | Developer… | Evidence in sources | Page set |
|---|---|---|---|
| **API** | calls HTTP endpoints with a key | base URLs, endpoints, request/response, "REST", "cloud API" | `api-template.md` |
| **SDK** | adds a library to an app (Android/iOS/Web) | packages, init, platform, "SDK", "client library", AIDL/Swift/Kotlin | `sdk-template.md` |
| **SDK module** | adds one module to an existing SDK | "module of NavSDK", depends on an SDK they already use | SDK template, scoped: intro + feature pages + links to parent SDK pages |
| **New endpoint** | calls one new endpoint of an existing API | "new endpoint", added to an existing API | One endpoint reference page + entries in the parent API's nav, parameter index, response schema, migration and coverage pages |
| **Service** | integrates an outcome that spans a cloud API, a thin client SDK and/or an MCP tool, usually called by another system (an assistant, an agent, an orchestrator) | "cloud API and a thin SDK", "tool", "orchestrator calls", structured responses for an LLM | Both templates under one product, plus **service pages**: concepts, integration paths, contract, flows |

## Service pages (in addition to API + SDK pages)

Agent-facing or assistant-facing products need pages the classic templates don't have. Add these when the shape is **service**:

1. **Concepts** — the product's core unit of output (e.g. a "moment", a "recommendation"), the modes (e.g. proactive vs reactive), and what the caller owns vs what the product owns.
2. **Integration paths** — one section per path the PKD describes (e.g. with our SDK / without it / cloud only), each with what the partner gets, what they must provide, and what isn't available on that path. A comparison table at the top.
3. **Response contract** — the structured output fields as far as defined, each marked Defined / Direction / To be defined. Illustrative JSON only, labelled as such.
4. **Flows** — one per mode, as numbered steps across the parties (driver/user, caller, SDK, cloud), with the time budget if the sources give one.
5. **Designing with the product** — the PKD's experience principles rewritten as integration guidance (what to show, when to stay quiet).
6. **Glossary** — the PKD's glossary, screened.
7. **Client interface reference** — when the SDK exposes an in-app or in-car interface instead of HTTP (an AIDL service, an intent, a binder): one page listing the messages or methods, direction (caller → product, product → caller), payload as far as defined, and threading/lifecycle notes. Use a table, not `ApiRefTwoCol`.

For a service, merge the API quickstart and the SDK getting-started into one **Getting Started** page with a section per integration path; a developer starts from their path, not from the component.

If the PKD itself says the API/SDK split per capability is undecided, keep a single "Capabilities" table with a "Where it runs" column (Cloud / SDK / Either / To be defined) instead of guessing which reference page each capability belongs to.
