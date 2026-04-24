import Callout from '../components/ui/Callout';
import { PAGE_TITLES } from '../data/navigation';

export default function Placeholder({ pageId }) {
  const title = PAGE_TITLES[pageId] || pageId;
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
