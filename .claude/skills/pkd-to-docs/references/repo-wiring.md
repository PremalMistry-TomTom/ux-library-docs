# Repo wiring

The prototype is a single-page React + Vite app with no router: `App.jsx` owns the current product and page, and pages navigate with `onNavigate(pageId, productId)`. A new product touches these files. Pick a kebab-case product ID (e.g. `driving-intelligence`) and prefix every page ID with a short form of it (e.g. `di-`).

| # | File | What to add |
|---|---|---|
| 1 | `src/data/nav-<id>.js` | `<ID>_NAV` array and `<ID>_PAGE_TITLES` map (every page ID). Shape in `api-template.md`. Use `{ type: 'section', label }` for groups. |
| 2 | `src/data/products.js` | Import the nav; add `'<id>': { id, name, defaultPage: '<prefix>-intro', nav, pageTitles }`. |
| 3 | `src/pages/<Name>Pages.jsx` | The page components. One file is fine for a draft product; export one component per page. |
| 4 | `src/App.jsx` | `import { … } from './pages/<Name>Pages';` with the other page imports, and one `case '<page-id>': return <Comp onNavigate={onNavigate} />;` per page inside `PageContent`'s switch, before `default:`. Missing cases fall through to the Placeholder page. |
| 5 | `src/components/layout/TOC.jsx` | One `TOC_MAP` entry per page: `'<page-id>': [{ id: '<h2 id>', label: '…' }, …]`. |
| 6 | `src/data/claude-context-<id>.js` | AI context file (see `principles.md`). |
| 7 | `src/pages/DocsPortal.jsx` | Optional: a catalogue card in `PRODUCTS.<Category>`: `{ name, desc, docsId: '<prefix>-intro', productId: '<id>', inProgress: true }`. Add it so reviewers can reach the product from the home page. |

Don't edit other products' pages; record needed backlinks in the gap report.

## Page conventions

- Wrapper: `<div className="page">`, header `<h1>` then `<PageActions />`, then `<p className="quick-answer">`.
- Sections: `<div className="zone"><h2 className="sh" id="…">…</h2>…</div>`. Every `h2` id must appear in that page's `TOC_MAP` entry.
- Shared components: `Callout` (`type`: info | warn | success | danger), `CodeBlock` (`code`, `language`, or `tabs` + children), `ApiLinks` (named export; `items: [{ type, name, description, pageId, productId }]`, pass `onNavigate`), `PrivatePreviewBanner` (`variant`, `title`, `message`).
- Colours and spacing from CSS tokens so pages work in light and dark mode: `var(--black)` for primary text (it flips in dark mode), `var(--mid)`, `var(--muted)`, `var(--border)`, `var(--s0)`/`var(--s1)` surfaces, `var(--brand)`. **`var(--text)` is not defined** in this app — it only appears to work in HTML because text inherits a colour; in SVG it falls back to black. No hard-coded white/black text.
- Diagrams: `import { Figure, SequenceDiagram, LayerDiagram, StepsDiagram } from '../components/diagrams/Diagrams';` (see `diagrams.md`).
- No hero illustrations on intros.
- Keep JSX string content plain; avoid unescaped `{` `}` in text.

## Verify

```bash
python3 .claude/skills/pkd-to-docs/scripts/check_product.py <id> [--deny deny.txt]
npx vite build --outDir /tmp/<id>-build --emptyOutDir
```

Then open the dev server (`.claude/launch.json` → "UX Library — dev"), click the product's card on the home page (some cards open the docs directly, others have a Documentation button), then dispatch `window.dispatchEvent(new CustomEvent('ux-navigate', { detail: '<prefix>-intro' }))` after selecting the product, and check each page renders, the TOC matches, and the console is clean. The site's password gate stores auth in `sessionStorage['tt-docs-auth']`.
