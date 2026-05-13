import { useState } from 'react';
import PageActions from '../components/ui/PageActions';
import VersionTabBar from '../components/ui/VersionTabBar';
import { EVStationSearchV1Content } from './EVStationSearch';
import { EVStationSearchV3Content } from './EVStationSearchV3';

export function EVStationSearchUnified({ onNavigate }) {
  const [tab, setTab] = useState('v1');
  return (
    <div className="page page--wide">
      <div className="page-header page-header--with-tabs">
        <h1>EV Station Search</h1>
        <PageActions />
        <VersionTabBar versions={['v1', 'v3']} activeTab={tab} onTabChange={setTab} />
      </div>
      {tab === 'v1' && <EVStationSearchV1Content onNavigate={onNavigate} />}
      {tab === 'v3' && <EVStationSearchV3Content onNavigate={onNavigate} />}
    </div>
  );
}
