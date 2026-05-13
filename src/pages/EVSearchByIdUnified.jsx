import { useState } from 'react';
import PageActions from '../components/ui/PageActions';
import VersionTabBar from '../components/ui/VersionTabBar';
import { EVSearchByIdV1Content } from './EVSearchById';
import { EVSearchByIdV3Content } from './EVSearchByIdV3';

export function EVSearchByIdUnified({ onNavigate }) {
  const [tab, setTab] = useState('v1');
  return (
    <div className="page page--wide">
      <div className="page-header page-header--with-tabs">
        <h1>EV Search by ID</h1>
        <PageActions />
        <VersionTabBar versions={['v1', 'v3']} activeTab={tab} onTabChange={setTab} />
      </div>
      {tab === 'v1' && <EVSearchByIdV1Content onNavigate={onNavigate} />}
      {tab === 'v3' && <EVSearchByIdV3Content onNavigate={onNavigate} />}
    </div>
  );
}
