import { useState } from 'react';
import { RoutingCalculateRouteContent }      from './RoutingCalculateRoute';
import { RoutingV2CalculateRouteContent }    from './RoutingV2CalculateRoute';
import { RoutingV3CalculateRouteContent }    from './RoutingV3CalculateRoute';
import { RoutingReachableRangeContent }      from './RoutingReachableRange';
import { RoutingV2ReachableRangeContent }    from './RoutingV2ReachableRange';
import { RoutingV3ReachableRangeContent }    from './RoutingV3ReachableRange';
import { RoutingV2GuidanceContent }          from './RoutingV2Guidance';
import { RoutingV3GuidanceContent }          from './RoutingV3Guidance';
import { RoutingLaneGuidanceContent }        from './RoutingLaneGuidance';
import { RoutingV2ComputeTollContent }       from './RoutingV2ComputeToll';
import { RoutingV3ComputeTollContent }       from './RoutingV3ComputeToll';
import Callout                               from '../components/ui/Callout';
import PageActions                           from '../components/ui/PageActions';
import VersionTabBar                         from '../components/ui/VersionTabBar';

/* ─── 1. Calculate Route (v1 / v2 / v3) ─────────────────────────────────── */
export function RoutingCalculateRouteUnified({ onNavigate }) {
  const [tab, setTab] = useState('v1');
  return (
    <div className="page page--wide">
      <div className="page-header page-header--with-tabs">
        <h1>Calculate Route</h1>
        <PageActions />
        <VersionTabBar versions={['v1', 'v2', 'v3']} activeTab={tab} onTabChange={setTab} />
      </div>
      {tab === 'v1' && <RoutingCalculateRouteContent onNavigate={onNavigate} />}
      {tab === 'v2' && <RoutingV2CalculateRouteContent onNavigate={onNavigate} />}
      {tab === 'v3' && <RoutingV3CalculateRouteContent onNavigate={onNavigate} />}
    </div>
  );
}

/* ─── 2. Reachable Range (v1 / v2 / v3) ─────────────────────────────────── */
export function RoutingReachableRangeUnified({ onNavigate }) {
  const [tab, setTab] = useState('v1');
  return (
    <div className="page page--wide">
      <div className="page-header page-header--with-tabs">
        <h1>Reachable Range</h1>
        <PageActions />
        <VersionTabBar versions={['v1', 'v2', 'v3']} activeTab={tab} onTabChange={setTab} />
      </div>
      {tab === 'v1' && <RoutingReachableRangeContent onNavigate={onNavigate} />}
      {tab === 'v2' && <RoutingV2ReachableRangeContent onNavigate={onNavigate} />}
      {tab === 'v3' && <RoutingV3ReachableRangeContent onNavigate={onNavigate} />}
    </div>
  );
}

/* ─── 3. Guidance Instructions (v2 / v3) ────────────────────────────────── */
export function RoutingGuidanceInstructionsUnified({ onNavigate }) {
  const [tab, setTab] = useState('v2');
  return (
    <div className="page page--wide">
      <div className="page-header page-header--with-tabs">
        <h1>Guidance Instructions</h1>
        <PageActions />
        <VersionTabBar versions={['v2', 'v3']} activeTab={tab} onTabChange={setTab} />
      </div>
      {tab === 'v2' && <RoutingV2GuidanceContent onNavigate={onNavigate} />}
      {tab === 'v3' && <RoutingV3GuidanceContent onNavigate={onNavigate} />}
    </div>
  );
}

/* ─── 4. Lane Guidance (v1 / v2 / v3) ───────────────────────────────────── */
export function RoutingLaneGuidanceUnified({ onNavigate }) {
  const [tab, setTab] = useState('v1');
  return (
    <div className="page page--wide">
      <div className="page-header page-header--with-tabs">
        <h1>Lane Guidance</h1>
        <PageActions />
        <VersionTabBar versions={['v1', 'v2', 'v3']} activeTab={tab} onTabChange={setTab} />
      </div>
      {tab === 'v1' && <RoutingLaneGuidanceContent onNavigate={onNavigate} />}
      {tab === 'v2' && (
        <div className="zone">
          <Callout type="info" title="Lane guidance in v2 and v3">
            Lane guidance parameters are identical to v1 — pass sectionType=lanes on the calculateRoute request. The response lane object schema is unchanged.
          </Callout>
        </div>
      )}
      {tab === 'v3' && (
        <div className="zone">
          <Callout type="info" title="Lane guidance in v2 and v3">
            Lane guidance parameters are identical to v1 — pass sectionType=lanes on the calculateRoute request. The response lane object schema is unchanged.
          </Callout>
        </div>
      )}
    </div>
  );
}

/* ─── 5. Compute Toll (v2 / v3) ─────────────────────────────────────────── */
export function RoutingComputeTollUnified({ onNavigate }) {
  const [tab, setTab] = useState('v2');
  return (
    <div className="page page--wide">
      <div className="page-header page-header--with-tabs">
        <h1>Compute Toll Amounts</h1>
        <PageActions />
        <VersionTabBar versions={['v2', 'v3']} activeTab={tab} onTabChange={setTab} />
      </div>
      {tab === 'v2' && <RoutingV2ComputeTollContent onNavigate={onNavigate} />}
      {tab === 'v3' && <RoutingV3ComputeTollContent onNavigate={onNavigate} />}
    </div>
  );
}
