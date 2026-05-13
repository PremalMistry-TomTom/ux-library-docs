import { useState } from 'react';
import PageActions from '../components/ui/PageActions';
import VersionTabBar from '../components/ui/VersionTabBar';
import { EVSearchNearbyV1Content } from './EVSearchNearby';
import { EVSearchNearbyV3Content } from './EVSearchNearbyV3';

export function EVSearchNearbyUnified({ onNavigate }) {
  const [tab, setTab] = useState('v1');
  return (
    <div className="page page--wide">
      <div className="page-header page-header--with-tabs">
        <h1>EV Search Nearby</h1>
        <PageActions />
        <VersionTabBar versions={['v1', 'v3']} activeTab={tab} onTabChange={setTab} />
      </div>
      {tab === 'v1' && <EVSearchNearbyV1Content onNavigate={onNavigate} />}
      {tab === 'v3' && <EVSearchNearbyV3Content onNavigate={onNavigate} />}
    </div>
  );
}
