import { useEffect, useState } from 'react';

const TOC_MAP = {
  colour: [
    { id: 'c-global',    label: 'Global colours' },
    { id: 'c-extended',  label: 'Extended collection' },
    { id: 'c-system',    label: 'System colours' },
    { id: 'c-surfaces',  label: 'a. Surfaces',          indent: true },
    { id: 'c-brand',     label: 'b. Brand',             indent: true },
    { id: 'c-guidance',  label: 'c. Guidance',          indent: true },
    { id: 'c-alerts',    label: 'd. Alerts & warnings', indent: true },
    { id: 'c-actions',   label: 'e. Actions',           indent: true },
    { id: 'c-ui',        label: 'f. UI controls',       indent: true },
    { id: 'c-signage',   label: 'g. Road signage',      indent: true },
    { id: 'c-poi',       label: 'h. POI categories',    indent: true },
    { id: 'c-semantics', label: 'Semantic definitions' },
  ],
  'home-screen-layout': [
    { id: 'h-preview',   label: 'Preview' },
    { id: 'h-when',      label: 'When to use it' },
    { id: 'h-start',     label: 'Start here' },
    { id: 'h-customise', label: 'Customise' },
  ],
  'search-engine': [
    { id: 'se-overview',      label: 'Overview' },
    { id: 'se-provider',      label: 'Provider setup' },
    { id: 'se-transitions',   label: 'Connectivity transitions' },
    { id: 'se-ui-custom',     label: 'Search UI customisation' },
    { id: 'se-lpp',           label: 'Location preview panel' },
    { id: 'se-entry-points',  label: 'POI entry points' },
    { id: 'se-requirements',  label: 'Requirements' },
  ],
  font: [
    { id: 'f-global',          label: 'Global tokens' },
    { id: 'f-family',          label: 'Font family',     indent: true },
    { id: 'f-weight',          label: 'Font weight',     indent: true },
    { id: 'f-size',            label: 'Font size',       indent: true },
    { id: 'f-system',          label: 'System tokens' },
    { id: 'f-system-anatomy',  label: 'Token anatomy',   indent: true },
    { id: 'f-system-scale',    label: 'Token scale',     indent: true },
    { id: 'f-component',       label: 'Component tokens' },
    { id: 'f-theming',         label: 'Theming & scaling' },
  ],
  'corner-radius': [
    { id: 'cr-intro',    label: 'Introduction' },
    { id: 'cr-sizes',    label: 'Radius sizes' },
    { id: 'cr-examples', label: 'Examples' },
  ],
  'design-tokens': [
    { id: 'dt-intro',    label: 'Introduction' },
    { id: 'dt-benefits', label: 'Benefits' },
    { id: 'dt-structure', label: 'Token structure' },
    { id: 'dt-names',    label: 'Token names' },
    { id: 'dt-overview', label: 'Structure overview' },
    { id: 'dt-examples', label: 'Token examples' },
    { id: 'dt-naming',   label: 'Naming principles' },
    { id: 'dt-themes',   label: 'Themes & modes' },
  ],
};

export default function TOC({ currentPage }) {
  const [activeId, setActiveId] = useState('');
  const items = TOC_MAP[currentPage] || [];

  useEffect(() => {
    if (!items.length) return;
    const ids = items.map(i => i.id);
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-60px 0px -70% 0px', threshold: 0 }
    );
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [currentPage]);

  if (!items.length) return <aside className="toc" />;

  return (
    <aside className="toc">
      <div className="toc-heading">On this page</div>
      <ul className="toc-list">
        {items.map(item => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`${item.indent ? 'indent' : ''}${activeId === item.id ? ' active' : ''}`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
