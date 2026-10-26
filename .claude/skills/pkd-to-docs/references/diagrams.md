# Diagrams

Some topics don't land in prose: who calls whom and in what order, what runs where and who owns it, what changes from one path to another. A developer reads a sequence diagram in seconds and a paragraph describing the same handshake in a minute, and still gets it wrong. Draw when words alone leave the reader assembling a picture in their head.

## When to draw

Draw a diagram when the page explains one of these, and the sources give you enough to draw it truthfully:

| The page explains… | Draw | Component |
|---|---|---|
| A flow across two or more parties (request → reasoning → answer; an event pushed back) | Sequence | `SequenceDiagram` |
| What runs where and who owns each part (car vs cloud, partner vs TomTom) | Layers | `LayerDiagram` |
| Integration paths that differ in which components exist | One `LayerDiagram` per path, stacked; or several in a grid with `compact` (labels above boxes) | `LayerDiagram` |
| A progression or adoption ladder (step 1 → 4, alpha → GA, lifecycle) | Steps | `StepsDiagram` |

Don't draw when:
- the content is a list of items or fields (use a table);
- the sources don't say how the parts connect (a guessed diagram is worse than none — log the gap instead);
- it would repeat a diagram on another page (link to it).

Aim for the few diagrams that do the most work: usually the architecture on the intro, one sequence per flow, and the integration paths. Three to six for a service-shaped product is typical; zero is fine for a glossary.

## How to draw

Use the kit at `src/components/diagrams/Diagrams.jsx` (a copy lives in this skill's `assets/` for other repos). It draws inline SVG with the docs' CSS tokens, so diagrams follow light and dark mode and need no image files.

```jsx
import { Figure, SequenceDiagram, LayerDiagram, StepsDiagram } from '../components/diagrams/Diagrams';

<Figure title="Reactive request" caption="The assistant owns the conversation; DI returns one structured answer." status="Direction">
  <SequenceDiagram label="Reactive request flow" lanes={[
      { id: 'driver', label: 'Driver', tone: 'person' },
      { id: 'asst', label: 'Assistant', sub: 'carmaker', tone: 'partner' },
      { id: 'cloud', label: 'DI cloud', tone: 'tomtom' },
    ]}
    steps={[
      { from: 'driver', to: 'asst', label: '"Coffee in the next 45 minutes."' },
      { from: 'asst', to: 'cloud', label: 'Navigation request' },
      { from: 'cloud', to: 'cloud', label: 'Pick one answer', kind: 'self' },
      { from: 'cloud', to: 'asst', label: 'Structured answer', kind: 'return' },
      { from: 'asst', to: 'cloud', label: 'Time budget: a few seconds', kind: 'note' },
      { from: 'asst', to: 'cloud', label: 'Authentication', status: 'tbd' },
    ]} />
</Figure>
```

- **Tones say who owns what:** `tomtom` (red outline) for our components, `partner` for what the integrator owns, `person` for a human, `external` for third parties and other TomTom engines used as-is, `tbd` (dashed, muted) for anything not defined yet.
- **Undecided parts stay visible but marked:** use `status: 'tbd'` on a step or `tone: 'tbd'` on a box, tied to a gap ID in the caption ("Authentication is still open, DI-G1"). Use `status="Direction"` on the `Figure` when the drawing reflects LEANING content, and `status="Proposal"` when it draws PROPOSAL content (see `sources-and-screening.md`). A Proposal figure sits inside the page's Proposal block, and its caption says where the PKD differs and names the gap ("Delivery is open: the PKD starts with scheduled checks, DI-G12").
- **Labels come from the sources,** in the reader's terms, short (two to eight words). Driver quotes in the PKD make good first steps in a sequence.
- **Every figure has a title and a one-line caption** that states the point of the drawing, and an `label` on the diagram for screen readers. Keep the prose that explains the same thing; the diagram supports it, it doesn't replace it.
- **Layer arrows:** set `link` on a layer for an arrow to the next one; `linkAt` points it at a specific box (by index), `linkDir: 'down'` makes it one-way, `linkStatus: 'tbd'` dashes it.
- **Narrow figures:** pass `compact` to `LayerDiagram` when two or three sit side by side; it drops the 150px label column and puts each layer's label above its boxes.
- **Keep them small:** 3–6 lanes, up to about 10 steps, 2–4 layers. Split a bigger picture into two figures.

## Check

Run the diagram check with the dev server up:

```bash
node .claude/skills/pkd-to-docs/scripts/check_diagrams.mjs "<Portal card name>" <page-id> … --out /tmp/<id>-diagrams
```

It opens every page in light and dark mode, reports text clipped by the drawing's edge or overlapping other text, and saves a PNG per figure. It can't see text sitting on an arrow, so look at the PNGs too. Shorten any label that wraps to three or more lines, and check that red outlines mark only TomTom components.
