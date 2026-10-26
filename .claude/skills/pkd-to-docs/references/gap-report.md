# Gap report

The gap report is the product team's to-do list: everything a developer needs that the sources can't answer yet. It is the most important output — a short page set with a precise gap report beats a long page set that papers over holes.

## Where it goes

1. A page in the product's nav: `<prefix>-gap-report`, under a final section `{ type: 'section', label: 'Draft status' }`, labelled **"Draft gap report"**. It carries a banner saying it is for the product and docs teams, not customers.
2. A markdown copy next to the source snapshot (outside the repo): `<product>-gap-report-<YYYY-MM-DD>.md`. The markdown copy may include internal context (owners by name, account drivers); the in-repo page uses roles only.

## Structure

1. **Header** — product, sources read with their dates/versions, shape classification and the evidence for it, pages drafted.
2. **Summary** — counts by severity, and the three gaps that block the most pages.
3. **Gaps table** — one row per gap:

| Field | Content |
|---|---|
| ID | `<PREFIX>-G1`, `<PREFIX>-G2`, … (e.g. `DI-G1`), so they can't collide with names in the sources. Keep them stable across reruns. |
| Question | What must be decided or provided, as a question |
| Why a developer needs it | One line, from the integrator's side |
| Blocks | Page and section IDs that show a placeholder for it |
| Source | Where the PKD/doc touches it, with its tag (OPEN, LEANING, CHECK, missing) |
| Suggested owner | In the markdown copy: the person from the PKD's decision table. On the in-repo page: their role (product lead, engineering lead, design lead, Legal, docs team). Where the PKD names nobody, write "Unassigned" — an unowned decision is itself worth flagging. |
| Severity | **Blocker** (no integration possible), **Major** (integration possible, likely wrong), **Minor** (polish) |

4. **Template gaps** — places where the product doesn't fit the API/SDK templates (e.g. a service shape needing concept and flow pages). These go to the docs team, not the product team.
5. **Screened out** — categories removed from pages (e.g. "customer names (n)", "pricing"), without the content itself, so reviewers know what was left out on purpose.
6. **Cross-product follow-ups** — backlinks other products' pages should add, naming changes for other teams.

## Always check these areas

Every product needs answers here; each one missing is a gap: authentication and keys · environments (sandbox/production) · base URL or package coordinates · versioning and status · request/response contract · errors and retries · limits, quotas, time budgets · data handling and privacy · platform support · editions/availability · changelog/migration · support channel · AI/agent access (MCP, llms.txt).
