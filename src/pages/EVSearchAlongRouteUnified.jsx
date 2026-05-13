import { useState } from 'react';
import PageActions from '../components/ui/PageActions';
import VersionTabBar from '../components/ui/VersionTabBar';
import { EVSearchAlongRouteV1Content } from './EVSearchAlongRoute';
import { EVSearchAlongRouteV3Content } from './EVSearchAlongRouteV3';

export function EVSearchAlongRouteUnified({ onNavigate }) {
  const [tab, setTab] = useState('v1');
  return (
    <div className="page page--wide">
      <div className="page-header page-header--with-tabs">
        <h1>EV Search Along Route</h1>
        <PageActions />
        <VersionTabBar versions={['v1', 'v3']} activeTab={tab} onTabChange={setTab} />
      </div>
      {tab === 'v1' && <EVSearchAlongRouteV1Content onNavigate={onNavigate} />}
      {tab === 'v3' && <EVSearchAlongRouteV3Content onNavigate={onNavigate} />}
    </div>
  );
}
