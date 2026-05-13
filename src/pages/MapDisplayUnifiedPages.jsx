import { useState } from 'react';
import PageActions from '../components/ui/PageActions';
import VersionTabBar from '../components/ui/VersionTabBar';
import { MapRasterTileV1Content } from './MapRasterTile';
import { MapRasterTileV2Content } from './MapRasterTileV2';
import { MapVectorTileV1Content } from './MapVectorTile';
import { MapVectorTileV2Content } from './MapVectorTileV2';
import { MapSatelliteTileV1Content } from './MapSatelliteTile';
import { MapSatelliteTileV3Content } from './MapSatelliteTileV3';
import { MapHillshadeTileV1Content } from './MapHillshadeTile';
import { MapHillshadeTileV3Content } from './MapHillshadeTileV3';
import { MapCopyrightsV1Content } from './MapCopyrights';
import { MapCopyrightsV2Content } from './MapCopyrightsV2';

export function MapRasterTileUnified({ onNavigate }) {
  const [tab, setTab] = useState('v1');
  return (
    <div className="page page--wide">
      <div className="page-header page-header--with-tabs">
        <h1>Raster Map Tile</h1>
        <PageActions />
        <VersionTabBar versions={['v1', 'v2']} activeTab={tab} onTabChange={setTab} />
      </div>
      {tab === 'v1' && <MapRasterTileV1Content onNavigate={onNavigate} />}
      {tab === 'v2' && <MapRasterTileV2Content onNavigate={onNavigate} />}
    </div>
  );
}

export function MapVectorTileUnified({ onNavigate }) {
  const [tab, setTab] = useState('v1');
  return (
    <div className="page page--wide">
      <div className="page-header page-header--with-tabs">
        <h1>Vector Tile</h1>
        <PageActions />
        <VersionTabBar versions={['v1', 'v2']} activeTab={tab} onTabChange={setTab} />
      </div>
      {tab === 'v1' && <MapVectorTileV1Content onNavigate={onNavigate} />}
      {tab === 'v2' && <MapVectorTileV2Content onNavigate={onNavigate} />}
    </div>
  );
}

export function MapSatelliteTileUnified({ onNavigate }) {
  const [tab, setTab] = useState('v1');
  return (
    <div className="page page--wide">
      <div className="page-header page-header--with-tabs">
        <h1>Satellite Tile</h1>
        <PageActions />
        <VersionTabBar versions={['v1', 'v3']} activeTab={tab} onTabChange={setTab} />
      </div>
      {tab === 'v1' && <MapSatelliteTileV1Content onNavigate={onNavigate} />}
      {tab === 'v3' && <MapSatelliteTileV3Content onNavigate={onNavigate} />}
    </div>
  );
}

export function MapHillshadeTileUnified({ onNavigate }) {
  const [tab, setTab] = useState('v1');
  return (
    <div className="page page--wide">
      <div className="page-header page-header--with-tabs">
        <h1>Hillshade Tile</h1>
        <PageActions />
        <VersionTabBar versions={['v1', 'v3']} activeTab={tab} onTabChange={setTab} />
      </div>
      {tab === 'v1' && <MapHillshadeTileV1Content onNavigate={onNavigate} />}
      {tab === 'v3' && <MapHillshadeTileV3Content onNavigate={onNavigate} />}
    </div>
  );
}

export function MapCopyrightsUnified({ onNavigate }) {
  const [tab, setTab] = useState('v1');
  return (
    <div className="page page--wide">
      <div className="page-header page-header--with-tabs">
        <h1>Copyrights</h1>
        <PageActions />
        <VersionTabBar versions={['v1', 'v2']} activeTab={tab} onTabChange={setTab} />
      </div>
      {tab === 'v1' && <MapCopyrightsV1Content onNavigate={onNavigate} />}
      {tab === 'v2' && <MapCopyrightsV2Content onNavigate={onNavigate} />}
    </div>
  );
}
