import { useState } from 'react';
import PageActions from '../components/ui/PageActions';
import VersionTabBar from '../components/ui/VersionTabBar';
import { EVChargingAvailabilityV1Content } from './EVChargingAvailability';
import { EVChargingAvailabilityV3Content } from './EVChargingAvailabilityV3';

export function EVChargingAvailabilityUnified({ onNavigate }) {
  const [tab, setTab] = useState('v1');
  return (
    <div className="page page--wide">
      <div className="page-header page-header--with-tabs">
        <h1>Charging Availability</h1>
        <PageActions />
        <VersionTabBar versions={['v1', 'v3']} activeTab={tab} onTabChange={setTab} />
      </div>
      {tab === 'v1' && <EVChargingAvailabilityV1Content onNavigate={onNavigate} />}
      {tab === 'v3' && <EVChargingAvailabilityV3Content onNavigate={onNavigate} />}
    </div>
  );
}
