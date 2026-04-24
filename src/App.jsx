import { useState } from 'react';
import Topnav from './components/layout/Topnav';
import Sidenav from './components/layout/Sidenav';
import TOC from './components/layout/TOC';
import Overview from './pages/Overview';
import Colour from './pages/Colour';
import HomeScreenLayout from './pages/HomeScreenLayout';
import SearchEngine from './pages/SearchEngine';
import Font from './pages/Font';
import DesignTokens from './pages/DesignTokens';
import CornerRadius from './pages/CornerRadius';
import Placeholder from './pages/Placeholder';

const FULL_PAGES = new Set(['overview', 'colour', 'home-screen-layout', 'search-engine', 'font', 'design-tokens']);

function PageContent({ pageId, onNavigate }) {
  switch (pageId) {
    case 'overview':          return <Overview onNavigate={onNavigate} />;
    case 'colour':            return <Colour />;
    case 'home-screen-layout': return <HomeScreenLayout />;
    case 'search-engine':      return <SearchEngine />;
    case 'font':              return <Font />;
    case 'design-tokens':     return <DesignTokens />;
    case 'corner-radius':     return <CornerRadius />;
    default:                  return <Placeholder pageId={pageId} />;
  }
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('overview');

  function navigate(pageId) {
    setCurrentPage(pageId);
    window.scrollTo(0, 0);
  }

  return (
    <>
      <Topnav currentPage={currentPage} onHome={() => navigate('overview')} />
      <div className="shell">
        <Sidenav currentPage={currentPage} onNavigate={navigate} />
        <div className="content-area">
          <PageContent pageId={currentPage} onNavigate={navigate} />
        </div>
        <TOC currentPage={currentPage} />
      </div>
    </>
  );
}
