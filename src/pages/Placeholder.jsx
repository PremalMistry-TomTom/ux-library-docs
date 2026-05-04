import { UX_LIBRARY_PAGE_TITLES } from '../data/nav-ux-library';
import Callout from '../components/ui/Callout';

export default function Placeholder({ pageId, pageTitles }) {
  const titles = pageTitles || UX_LIBRARY_PAGE_TITLES;
  const title = titles[pageId] || pageId;
  return (
    <div className="page">
      <div className="page-header">
        <h1>{title}</h1>
      </div>
      <Callout type="info">
        This page hasn&apos;t been built out yet in the prototype. It&apos;s next on the list.
      </Callout>
    </div>
  );
}
