import { PAGE_TITLES } from '../../data/navigation';

export default function Topnav({ currentPage, onHome }) {
  const pageTitle = PAGE_TITLES[currentPage] || 'Overview';

  return (
    <nav className="topnav">
      <span className="topnav-logo" onClick={onHome}>
        <span>tom</span>tom
      </span>
      <div className="topnav-crumb">
        <span>UX Library</span>
        <span className="topnav-crumb-sep">›</span>
        <span className="topnav-crumb-page">{pageTitle}</span>
      </div>
      <div className="topnav-right">
        <span className="topnav-badge">Private</span>
        <span className="topnav-version">v01.08</span>
      </div>
    </nav>
  );
}
