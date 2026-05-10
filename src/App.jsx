import { useState, useEffect, useCallback } from 'react';
import { getProduct } from './data/products';
import { IlloStyleProvider } from './context/IlloStyleContext';
import Topnav from './components/layout/Topnav';
import GlobalHeader from './components/layout/GlobalHeader';
import { useGlobalHeader } from './hooks/useGlobalHeader';
import DocsPortal from './pages/DocsPortal';

/* ─── Sidebar collapse toggle button ────────────────────────────────────── */
/* Re-expand tab — fixed to left edge, only visible when sidebar is collapsed */
function NavExpandBtn({ onExpand }) {
  return (
    <button
      className="nav-expand-btn"
      onClick={onExpand}
      title="Show sidebar  [ ]"
      aria-label="Show sidebar"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2 2l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}

/* ─── Shared logo — pinned top-left, independent of both headers ─────────── */
function FixedLogo({ onClick }) {
  return (
    <span className="fixed-logo" onClick={onClick} role="button" aria-label="Go to overview">
      <svg width="100" height="19" viewBox="0 0 125 24" fill="none" aria-hidden="true">
        <path fillRule="evenodd" clipRule="evenodd" d="M121.444 22.1291H124.999L125 13.0887C125 12.5 124.925 12.0676 124.859 11.7567C124.836 11.6515 124.816 11.5678 124.794 11.4864C124.092 8.90785 121.577 7.123 118.811 7.23655C117.528 7.29129 116.321 7.76661 115.225 8.64915L115.085 8.76169L114.945 8.64915C113.849 7.76661 112.642 7.29129 111.359 7.23655C108.59 7.12114 106.078 8.90785 105.376 11.4864C105.354 11.568 105.334 11.652 105.311 11.7577C105.242 12.0876 105.17 12.5049 105.17 13.0887L105.171 22.1291H108.726V13.242C108.726 11.9833 109.753 10.9593 111.015 10.9593C112.266 10.9593 113.292 11.9744 113.303 13.222C113.304 13.2264 113.304 13.2342 113.304 13.242V22.1291H116.866L116.867 13.2212C116.878 11.9744 117.904 10.9593 119.155 10.9593C120.417 10.9593 121.444 11.9833 121.444 13.242V22.1291Z" fill="currentColor"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M95.1744 18.5808C93.0256 18.5808 91.2773 16.8374 91.2773 14.6945C91.2773 12.5516 93.0256 10.8081 95.1744 10.8081C97.3234 10.8081 99.0716 12.5516 99.0716 14.6945C99.0716 16.8374 97.3234 18.5808 95.1744 18.5808ZM95.1741 7.25977C91.0633 7.25977 87.7188 10.5949 87.7188 14.6944C87.7188 18.794 91.0633 22.1292 95.1741 22.1292C99.285 22.1292 102.629 18.794 102.629 14.6944C102.629 10.5949 99.285 7.25977 95.1741 7.25977Z" fill="currentColor"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M82.9062 22.1324H87.5178L85.4546 18.5805C85.0074 18.58 83.1692 18.5776 83.026 18.5776C81.8791 18.5776 80.8802 17.7512 80.7994 16.7353C80.7887 16.6023 80.7791 16.4376 80.7716 16.2566V10.9014H85.4537L87.2833 7.69089H80.7716V1.86743L77.2102 4.32446V7.52023H74.9629V11.072H77.21L77.2134 15.9215C77.2134 15.9236 77.211 16.1479 77.2144 16.2125L77.228 16.4827C77.3498 18.8376 78.5126 20.5715 80.684 21.6355C81.2652 21.9202 81.908 22.0772 82.7073 22.1294L82.9062 22.1291V22.1324Z" fill="currentColor"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M68.864 22.129H72.4192L72.4198 13.0887C72.4198 12.5 72.3444 12.0676 72.2785 11.7567C72.2556 11.6514 72.2355 11.5677 72.2135 11.4863C71.512 8.90779 68.9973 7.12293 66.2307 7.23648C64.9479 7.29123 63.7413 7.76655 62.6447 8.64909L62.5049 8.76163L62.3651 8.64909C61.2685 7.76655 60.0619 7.29123 58.7788 7.23648C56.01 7.12108 53.4979 8.90779 52.7962 11.4863C52.774 11.5679 52.754 11.6519 52.731 11.7577C52.6613 12.0875 52.5898 12.5049 52.5898 13.0887L52.5905 22.129H56.1459V13.2419C56.1459 11.9833 57.1727 10.9593 58.4348 10.9593C59.6856 10.9593 60.7119 11.9743 60.7229 13.222C60.7233 13.2264 60.7238 13.2342 60.7238 13.2419V22.129H64.2861L64.2869 13.2211C64.2978 11.9743 65.3242 10.9593 66.5749 10.9593C67.8372 10.9593 68.864 11.9833 68.864 13.2419V22.129Z" fill="currentColor"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M42.5944 18.5808C40.4454 18.5808 38.6973 16.8374 38.6973 14.6945C38.6973 12.5516 40.4454 10.8081 42.5944 10.8081C44.7434 10.8081 46.4915 12.5516 46.4915 14.6945C46.4915 16.8374 44.7434 18.5808 42.5944 18.5808ZM42.594 7.25977C38.4831 7.25977 35.1387 10.5949 35.1387 14.6944C35.1387 18.794 38.4831 22.1292 42.594 22.1292C46.7049 22.1292 50.0493 18.794 50.0493 14.6944C50.0493 10.5949 46.7049 7.25977 42.594 7.25977Z" fill="currentColor"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M30.3261 22.1325H34.9378L32.8745 18.5805C32.4273 18.58 30.5891 18.5777 30.4459 18.5777C29.299 18.5777 28.3001 17.7512 28.2193 16.7354C28.2086 16.6024 28.199 16.4376 28.1915 16.2567V10.9014H32.8736L34.7033 7.69095H28.1915V1.86749L24.6301 4.32452V7.52029H22.3828V11.0721H24.6299L24.6333 15.9216C24.6333 15.9236 24.6309 16.148 24.6343 16.2126L24.6479 16.4827C24.7697 18.8377 25.9326 20.5715 28.1039 21.6355C28.6851 21.9203 29.328 22.0772 30.1272 22.1295L30.3261 22.1291V22.1325Z" fill="currentColor"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M8.28764 24.0001L11.4639 18.5139H5.11133L8.28764 24.0001Z" fill="#DF1B12"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M8.28694 12.5839C5.89835 12.5839 3.95522 10.6459 3.95522 8.26409C3.95522 5.88209 5.89835 3.94415 8.28694 3.94415C10.6755 3.94415 12.6187 5.88209 12.6187 8.26409C12.6187 10.6459 10.6755 12.5839 8.28694 12.5839ZM8.28694 0C3.7175 0 0 3.70725 0 8.26409C0 12.8208 3.7175 16.528 8.28694 16.528C12.8564 16.528 16.5739 12.8208 16.5739 8.26409C16.5739 3.70725 12.8564 0 8.28694 0Z" fill="#DF1B12"/>
      </svg>
    </span>
  );
}
import Sidenav from './components/layout/Sidenav';
import TOC, { TOC_MAP } from './components/layout/TOC';
import Overview from './pages/Overview';
import Colour from './pages/Colour';
import HomeScreenLayout from './pages/HomeScreenLayout';
import SearchEngine from './pages/SearchEngine';
import Font from './pages/Font';
import DesignTokens from './pages/DesignTokens';
import Theming from './pages/Theming';
import CornerRadius from './pages/CornerRadius';
import MapStyle from './pages/MapStyle';
import TrafficPage from './pages/Traffic';
import SafetyLocations from './pages/SafetyLocations';
import NavigationControls from './pages/NavigationControls';
import HorizonPanel from './pages/HorizonPanel';
import InstructionPanel from './pages/InstructionPanel';
import ETAPanel from './pages/ETAPanel';
import RouteBar from './pages/RouteBar';
import TAIAOverview from './pages/TAIAOverview';
import ConversationPersonality from './pages/ConversationPersonality';
import IntentRouting from './pages/IntentRouting';
import VoiceEngine from './pages/VoiceEngine';
import SpeechToText from './pages/SpeechToText';
import AIConfig from './pages/AIConfig';
import EVSupport from './pages/EVSupport';
import EVOverview from './pages/EVOverview';
import EVBattery from './pages/EVBattery';
import EVChargingSearch from './pages/EVChargingSearch';
import EVRouting from './pages/EVRouting';
import EVNavUI from './pages/EVNavUI';
import EVRequirements from './pages/EVRequirements';
import Cluster from './pages/Cluster';
import ADASIntegration from './pages/ADASIntegration';
import ScreenshotAssets from './pages/ScreenshotAssets';
import Typography from './pages/Typography';
import IntroIllustrations from './pages/IntroIllustrations';
import IntroIllustrationsLegacy from './pages/IntroIllustrationsLegacy';
import StyleSamples from './pages/StyleSamples';
import DomainLanding from './pages/DomainLanding';
import NavSDKIntro from './pages/NavSDKIntro';
import {
  NavSDKMapDisplay, NavSDKLocation, NavSDKSearch, NavSDKRouting,
  NavSDKNavigation, NavSDKOffline, NavSDKVirtualHorizon, NavSDKAdvanced,
} from './pages/NavSDKDomains';
import {
  NavSDKMapCompose, NavSDKMapViews, NavSDKMapStyles,
  NavSDKMapCamera, NavSDKMapMarkers, NavSDKMapTraffic,
} from './pages/NavSDKMapPages';
import {
  NavSDKProjectSetup, NavSDKSdkInit, NavSDKFirstMap,
  NavSDKLocalization, NavSDKMigration,
} from './pages/NavSDKGettingStarted';
import {
  NavSDKOfflineQuickstart, NavSDKOfflineSetup, NavSDKOfflineMgmt,
} from './pages/NavSDKOfflinePages';
import {
  NavSDKHorizonData, NavSDKHorizonSafety, NavSDKHorizonHazards, NavSDKHorizonTraffic,
} from './pages/NavSDKHorizonPages';
import {
  NavSDKAdvSimulation, NavSDKAdvMapMatched, NavSDKAdvTelemetry, NavSDKAdvVehicle,
} from './pages/NavSDKAdvancedPages';
import ANAIntro from './pages/ANAIntro';
import RoutingAPIIntro from './pages/RoutingAPIIntro';
import RoutingCalculateRoute from './pages/RoutingCalculateRoute';
import RoutingReachableRange from './pages/RoutingReachableRange';
import RoutingBatch from './pages/RoutingBatch';
import RoutingInstructions from './pages/RoutingInstructions';
import RoutingLaneGuidance from './pages/RoutingLaneGuidance';
import RoutingRoadShields from './pages/RoutingRoadShields';
import LDEVRIntro from './pages/LDEVRIntro';
import LDEVRFirstRoute from './pages/LDEVRFirstRoute';
import LDEVRCalculateRoute from './pages/RoutingEVRoute';
import LDEVRBatch from './pages/LDEVRBatch';
import LDEVRChargingStops from './pages/LDEVRChargingStops';
import LDEVRBatteryModel from './pages/LDEVRBatteryModel';
import LDEVRConnectors from './pages/LDEVRConnectors';
// LDEVR v2 Extensions
import LDEVRWeather from './pages/LDEVRWeather';
import LDEVRVehicleBrand from './pages/LDEVRVehicleBrand';
import LDEVRComputeToll from './pages/LDEVRComputeToll';
import LDEVRChargingParks from './pages/LDEVRChargingParks';
import LDEVROemEmsp from './pages/LDEVROemEmsp';
import LDEVRDataFreshness from './pages/LDEVRDataFreshness';
// Routing API v2
import RoutingV2CalculateRoute from './pages/RoutingV2CalculateRoute';
import RoutingV2ReachableRange from './pages/RoutingV2ReachableRange';
import RoutingV2ComputeToll from './pages/RoutingV2ComputeToll';
import RoutingV2Guidance from './pages/RoutingV2Guidance';
import RoutingV2DataFreshness from './pages/RoutingV2DataFreshness';
// Routing API v3
import RoutingV3Overview from './pages/RoutingV3Overview';
import RoutingV3CalculateRoute from './pages/RoutingV3CalculateRoute';
import RoutingV3Guidance from './pages/RoutingV3Guidance';
import RoutingV3ReachableRange from './pages/RoutingV3ReachableRange';
import RoutingV3ComputeToll from './pages/RoutingV3ComputeToll';
import RoutingV3Weather from './pages/RoutingV3Weather';
import MatrixRoutingIntro from './pages/MatrixRoutingIntro';
import WaypointOptIntro from './pages/WaypointOptIntro';
import SearchAPIIntro from './pages/SearchAPIIntro';
import GeocodingAPIIntro from './pages/GeocodingAPIIntro';
import TrafficAPIIntro from './pages/TrafficAPIIntro';
import EVChargingAPIIntro from './pages/EVChargingAPIIntro';
import MapDisplayAPIIntro from './pages/MapDisplayAPIIntro';
import ParkingFuelAPIIntro from './pages/ParkingFuelAPIIntro';
import TrafficAnalyticsAPIIntro from './pages/TrafficAnalyticsAPIIntro';
import SnapToRoadsAPIIntro from './pages/SnapToRoadsAPIIntro';
import Placeholder from './pages/Placeholder';
import {
  NavSDKLocationQuickstart,
  NavSDKSearchQuickstart,
  NavSDKSearchFind,
  NavSDKSearchEv,
  NavSDKSearchReverse,
  NavSDKSearchByod,
} from './pages/NavSDKLocationPages';
import {
  NavSDKRoutingQuickstart, NavSDKRoutePlanning, NavSDKRouteAlternatives,
  NavSDKRouteSections, NavSDKRouteImportExport,
} from './pages/NavSDKRoutingPages';
import {
  NavSDKNavQuickstart, NavSDKNavTurnByTurn, NavSDKNavVoice, NavSDKNavReplanning,
  NavSDKNavSafety, NavSDKNavFreeDriving, NavSDKNavSaving, NavSDKNavTraffic,
} from './pages/NavSDKNavigationPages';

const FULL_PAGES = new Set([
  'overview', 'colour', 'home-screen-layout', 'search-engine', 'font', 'design-tokens', 'theming',
  'map-style', 'traffic', 'safety-locations',
  'nav-controls', 'horizon-panel', 'instruction-panel', 'eta-panel', 'route-bar',
  'ai-overview', 'ai-personality', 'intent-routing', 'voice-engine', 'speech-to-text', 'ai-config',
  'ev', 'cluster', 'adas',
  'ev-overview', 'ev-battery', 'ev-charging-search', 'ev-routing', 'ev-nav-ui', 'ev-requirements',
  'screenshot-assets', 'typography',
]);

function PageContent({ pageId, onNavigate, product, platform }) {
  switch (pageId) {
    case 'overview':           return <Overview onNavigate={onNavigate} />;
    case 'colour':             return <Colour />;
    case 'home-screen-layout': return <HomeScreenLayout />;
    case 'search-engine':      return <SearchEngine />;
    case 'font':               return <Font />;
    case 'design-tokens':      return <DesignTokens />;
    case 'theming':            return <Theming />;
    case 'corner-radius':      return <CornerRadius />;
    case 'map-style':          return <MapStyle />;
    case 'traffic':            return <TrafficPage />;
    case 'safety-locations':   return <SafetyLocations />;
    case 'nav-controls':       return <NavigationControls />;
    case 'horizon-panel':      return <HorizonPanel />;
    case 'instruction-panel':  return <InstructionPanel />;
    case 'eta-panel':          return <ETAPanel />;
    case 'route-bar':          return <RouteBar />;
    case 'ai-overview':        return <TAIAOverview />;
    case 'ai-personality':     return <ConversationPersonality />;
    case 'intent-routing':     return <IntentRouting />;
    case 'voice-engine':       return <VoiceEngine />;
    case 'speech-to-text':     return <SpeechToText />;
    case 'ai-config':          return <AIConfig />;
    case 'ev':                 return <EVOverview onNavigate={onNavigate} />;
    case 'ev-overview':        return <EVOverview onNavigate={onNavigate} />;
    case 'ev-battery':         return <EVBattery />;
    case 'ev-charging-search': return <EVChargingSearch />;
    case 'ev-routing':         return <EVRouting />;
    case 'ev-nav-ui':          return <EVNavUI onNavigate={onNavigate} />;
    case 'ev-requirements':    return <EVRequirements onNavigate={onNavigate} />;
    case 'ev-charging':        return <DomainLanding groupKey="evCharging" onNavigate={onNavigate} />;
    case 'cluster':            return <Cluster />;
    case 'adas':               return <ADASIntegration />;
    case 'typography':             return <Typography />;
    case 'screenshot-assets':      return <ScreenshotAssets />;
    case 'intro-illustrations':        return <IntroIllustrations />;
    case 'intro-illustrations-legacy': return <IntroIllustrationsLegacy />;
    case 'style-samples':          return <StyleSamples />;
    // NavSDK
    case 'navsdk-intro':           return <NavSDKIntro onNavigate={onNavigate} platform={platform} />;
    case 'navsdk-map-display':     return <NavSDKMapDisplay onNavigate={onNavigate} />;
    case 'navsdk-location':        return <NavSDKLocation onNavigate={onNavigate} />;
    case 'navsdk-search':          return <NavSDKSearch onNavigate={onNavigate} />;
    case 'navsdk-routing':         return <NavSDKRouting onNavigate={onNavigate} />;
    case 'navsdk-navigation':      return <NavSDKNavigation onNavigate={onNavigate} />;
    case 'navsdk-offline':         return <NavSDKOffline onNavigate={onNavigate} />;
    case 'navsdk-horizon':         return <NavSDKVirtualHorizon onNavigate={onNavigate} />;
    case 'navsdk-advanced':        return <NavSDKAdvanced onNavigate={onNavigate} />;
    // NavSDK Map sub-pages
    case 'navsdk-map-compose':     return <NavSDKMapCompose />;
    case 'navsdk-map-views':       return <NavSDKMapViews />;
    case 'navsdk-map-styles':      return <NavSDKMapStyles />;
    case 'navsdk-map-camera':      return <NavSDKMapCamera />;
    case 'navsdk-map-markers':     return <NavSDKMapMarkers />;
    case 'navsdk-map-traffic':     return <NavSDKMapTraffic />;
    // NavSDK Getting Started
    case 'navsdk-project-setup':   return <NavSDKProjectSetup />;
    case 'navsdk-sdk-init':        return <NavSDKSdkInit />;
    case 'navsdk-first-map':       return <NavSDKFirstMap />;
    case 'navsdk-localization':    return <NavSDKLocalization />;
    case 'navsdk-migration':       return <NavSDKMigration />;
    // NavSDK Location
    case 'navsdk-location-quickstart': return <NavSDKLocationQuickstart />;
    // NavSDK Search
    case 'navsdk-search-quickstart': return <NavSDKSearchQuickstart />;
    case 'navsdk-search-find':       return <NavSDKSearchFind />;
    case 'navsdk-search-ev':         return <NavSDKSearchEv />;
    case 'navsdk-search-reverse':    return <NavSDKSearchReverse />;
    case 'navsdk-search-byod':       return <NavSDKSearchByod />;
    // NavSDK Routing sub-pages
    case 'navsdk-routing-quickstart': return <NavSDKRoutingQuickstart onNavigate={onNavigate} />;
    case 'navsdk-route-planning':     return <NavSDKRoutePlanning onNavigate={onNavigate} />;
    case 'navsdk-route-alternatives': return <NavSDKRouteAlternatives onNavigate={onNavigate} />;
    case 'navsdk-route-sections':     return <NavSDKRouteSections onNavigate={onNavigate} />;
    case 'navsdk-route-import-export': return <NavSDKRouteImportExport onNavigate={onNavigate} />;
    // NavSDK Navigation sub-pages
    case 'navsdk-nav-quickstart':    return <NavSDKNavQuickstart onNavigate={onNavigate} />;
    case 'navsdk-nav-turn-by-turn':  return <NavSDKNavTurnByTurn onNavigate={onNavigate} />;
    case 'navsdk-nav-voice':         return <NavSDKNavVoice onNavigate={onNavigate} />;
    case 'navsdk-nav-replanning':    return <NavSDKNavReplanning onNavigate={onNavigate} />;
    case 'navsdk-nav-safety':        return <NavSDKNavSafety onNavigate={onNavigate} />;
    case 'navsdk-nav-free-driving':  return <NavSDKNavFreeDriving onNavigate={onNavigate} />;
    case 'navsdk-nav-saving':        return <NavSDKNavSaving onNavigate={onNavigate} />;
    case 'navsdk-nav-traffic':       return <NavSDKNavTraffic onNavigate={onNavigate} />;
    // NavSDK Offline sub-pages
    case 'navsdk-offline-quickstart': return <NavSDKOfflineQuickstart />;
    case 'navsdk-offline-setup':      return <NavSDKOfflineSetup />;
    case 'navsdk-offline-mgmt':       return <NavSDKOfflineMgmt />;
    // NavSDK Horizon sub-pages
    case 'navsdk-horizon-data':       return <NavSDKHorizonData />;
    case 'navsdk-horizon-safety':     return <NavSDKHorizonSafety />;
    case 'navsdk-horizon-hazards':    return <NavSDKHorizonHazards />;
    case 'navsdk-horizon-traffic':    return <NavSDKHorizonTraffic />;
    // NavSDK Advanced sub-pages
    case 'navsdk-adv-simulation':     return <NavSDKAdvSimulation />;
    case 'navsdk-adv-map-matched':    return <NavSDKAdvMapMatched />;
    case 'navsdk-adv-telemetry':      return <NavSDKAdvTelemetry />;
    case 'navsdk-adv-vehicle':        return <NavSDKAdvVehicle />;
    // ANA
    case 'ana-intro':              return <ANAIntro onNavigate={onNavigate} />;
    // Routing API
    case 'routing-api-intro':        return <RoutingAPIIntro onNavigate={onNavigate} platform={platform} />;
    case 'routing-calculate-route':  return <RoutingCalculateRoute onNavigate={onNavigate} platform={platform} />;
    case 'routing-reachable-range':  return <RoutingReachableRange onNavigate={onNavigate} />;
    case 'routing-batch':            return <RoutingBatch onNavigate={onNavigate} />;
    case 'routing-instructions':     return <RoutingInstructions onNavigate={onNavigate} />;
    case 'routing-lane-guidance':    return <RoutingLaneGuidance onNavigate={onNavigate} />;
    case 'routing-road-shields':     return <RoutingRoadShields onNavigate={onNavigate} />;
    // Long Distance EV Routing API
    case 'ldevr-intro':            return <LDEVRIntro onNavigate={onNavigate} />;
    case 'ldevr-first-route':      return <LDEVRFirstRoute onNavigate={onNavigate} />;
    case 'ldevr-calculate-route':  return <LDEVRCalculateRoute onNavigate={onNavigate} platform="tomtom-maps" />;
    case 'ldevr-batch':            return <LDEVRBatch onNavigate={onNavigate} />;
    case 'ldevr-concepts':         return <DomainLanding groupKey="ldEvrConcepts" onNavigate={onNavigate} />;
    case 'ldevr-charging-stops':   return <LDEVRChargingStops onNavigate={onNavigate} />;
    case 'ldevr-battery-model':    return <LDEVRBatteryModel />;
    case 'ldevr-connectors':       return <LDEVRConnectors />;
    // LDEVR v2 Extensions
    case 'ldevr-weather':          return <LDEVRWeather          onNavigate={onNavigate} />;
    case 'ldevr-vehicle-brand':    return <LDEVRVehicleBrand     onNavigate={onNavigate} />;
    case 'ldevr-compute-toll':     return <LDEVRComputeToll      onNavigate={onNavigate} />;
    case 'ldevr-charging-parks':   return <LDEVRChargingParks    onNavigate={onNavigate} />;
    case 'ldevr-oem-emsp':         return <LDEVROemEmsp          onNavigate={onNavigate} />;
    case 'ldevr-data-freshness':   return <LDEVRDataFreshness    onNavigate={onNavigate} />;
    // Routing API v2 / v3
    case 'routing-v2-calculate-route': return <RoutingV2CalculateRoute  onNavigate={onNavigate} />;
    case 'routing-v2-reachable-range': return <RoutingV2ReachableRange  onNavigate={onNavigate} />;
    case 'routing-v2-compute-toll':    return <RoutingV2ComputeToll     onNavigate={onNavigate} />;
    case 'routing-v2-guidance':        return <RoutingV2Guidance        onNavigate={onNavigate} />;
    case 'routing-v2-data-freshness':  return <RoutingV2DataFreshness   onNavigate={onNavigate} />;
    case 'routing-v3-overview':        return <RoutingV3Overview        onNavigate={onNavigate} />;
    case 'routing-v3-calculate-route': return <RoutingV3CalculateRoute  onNavigate={onNavigate} />;
    case 'routing-v3-guidance':        return <RoutingV3Guidance        onNavigate={onNavigate} />;
    case 'routing-v3-reachable-range': return <RoutingV3ReachableRange  onNavigate={onNavigate} />;
    case 'routing-v3-compute-toll':    return <RoutingV3ComputeToll     onNavigate={onNavigate} />;
    case 'routing-v3-weather':         return <RoutingV3Weather         onNavigate={onNavigate} />;
    // Matrix Routing v2
    case 'matrix-intro':           return <MatrixRoutingIntro onNavigate={onNavigate} />;
    // Waypoint Optimization
    case 'waypoint-intro':         return <WaypointOptIntro onNavigate={onNavigate} />;
    // Search API
    case 'search-api-intro':       return <SearchAPIIntro onNavigate={onNavigate} />;
    // Geocoding API
    case 'geocoding-api-intro':    return <GeocodingAPIIntro onNavigate={onNavigate} />;
    // Traffic API
    case 'traffic-api-intro':      return <TrafficAPIIntro onNavigate={onNavigate} />;
    // EV & Charging API
    case 'ev-charging-api-intro':  return <EVChargingAPIIntro onNavigate={onNavigate} />;
    // Map Display API
    case 'map-display-api-intro':  return <MapDisplayAPIIntro onNavigate={onNavigate} />;
    // Parking & Fuel API
    case 'parking-fuel-api-intro': return <ParkingFuelAPIIntro onNavigate={onNavigate} />;
    // Traffic Analytics API
    case 'traffic-analytics-api-intro': return <TrafficAnalyticsAPIIntro onNavigate={onNavigate} />;
    // Snap to Roads API
    case 'snap-to-roads-api-intro': return <SnapToRoadsAPIIntro onNavigate={onNavigate} />;
    // Domain landing pages
    case 'assets':                 return <DomainLanding groupKey="assets"             onNavigate={onNavigate} />;
    case 'map-customisation':      return <DomainLanding groupKey="mapCustomisation"   onNavigate={onNavigate} />;
    case 'app-customisation':      return <DomainLanding groupKey="appCustomisation"   onNavigate={onNavigate} />;
    case 'ai-assistant':           return <DomainLanding groupKey="taia"               onNavigate={onNavigate} />;
    case 'vehicle-integration':    return <DomainLanding groupKey="vehicleIntegration" onNavigate={onNavigate} />;
    case 'release-support':        return <DomainLanding groupKey="releaseSupport"     onNavigate={onNavigate} />;
    default:                       return <Placeholder pageId={pageId} pageTitles={product?.pageTitles} />;
  }
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('overview');
  const [currentProduct, setCurrentProduct] = useState('ux-library');
  const [currentPlatform, setCurrentPlatform] = useState('android');
  const [isDark, setIsDark] = useState(() => localStorage.getItem('ux-theme') === 'dark');
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [docsPortalOpen, setDocsPortalOpen] = useState(true);
  const [navCollapsed, setNavCollapsed] = useState(false);

  // [ key toggles sidebar on desktop
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
      if (e.key === '[' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        setNavCollapsed(c => !c);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ux-navigate custom event — emitted by links inside page components
  useEffect(() => {
    function handleUxNavigate(e) {
      navigate(e.detail);
      setDocsPortalOpen(false);   // always close portal so the target page is visible
    }
    window.addEventListener('ux-navigate', handleUxNavigate);
    return () => window.removeEventListener('ux-navigate', handleUxNavigate);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep isDark in sync if a child component (e.g. illustration style toggle)
  // writes data-theme directly — so the Topnav toggle icon stays accurate.
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const dark = document.documentElement.getAttribute('data-theme') === 'dark';
      setIsDark(prev => prev === dark ? prev : dark);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);
  const { isVisible: isGlobalVisible, reveal, cancelReveal, onMouseEnterGlobal, onMouseLeaveGlobal } = useGlobalHeader();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('ux-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  function navigate(pageId, productId, platform) {
    if (productId && productId !== currentProduct) {
      setCurrentProduct(productId);
      const targetProduct = getProduct(productId);
      setCurrentPlatform(platform ?? targetProduct.defaultPlatform ?? 'android');
    } else if (platform !== undefined && platform !== null) {
      setCurrentPlatform(platform);
    }
    setCurrentPage(pageId);
    setNavDrawerOpen(false);
    window.scrollTo(0, 0);
  }

  const product = getProduct(currentProduct);

  return (
    <IlloStyleProvider>
      {/* Single logo — stays pinned top-left regardless of header state */}
      <FixedLogo onClick={() => setDocsPortalOpen(true)} />

      {/* GlobalHeader: always visible on DocsPortal, auto-hide on docs pages */}
      <GlobalHeader
        isVisible={docsPortalOpen ? true : isGlobalVisible}
        onMouseEnter={onMouseEnterGlobal}
        onMouseLeave={onMouseLeaveGlobal}
        onProductsClick={() => setDocsPortalOpen(v => !v)}
        onDocsClick={() => setDocsPortalOpen(true)}
        docsPortalOpen={docsPortalOpen}
      />

      {/* Topnav: only shown inside the UX Library docs, not on the DocsPortal */}
      {!docsPortalOpen && (
        <Topnav
          currentPage={currentPage}
          onHome={() => { navigate(product.defaultPage); setDocsPortalOpen(false); }}
          onNavigate={id => { navigate(id); setDocsPortalOpen(false); }}
          isDark={isDark}
          onToggleTheme={() => setIsDark(d => !d)}
          onMouseEnter={reveal}
          onMouseLeave={cancelReveal}
          onOpenNavDrawer={() => setNavDrawerOpen(true)}
          productId={currentProduct}
          platform={currentPlatform}
          onPlatformChange={p => setCurrentPlatform(p)}
        />
      )}

      {docsPortalOpen ? (
        <DocsPortal
          onNavigate={(pageId, productId, platform) => { navigate(pageId, productId, platform); setDocsPortalOpen(false); }}
        />
      ) : (
        <div className={`shell${navCollapsed ? ' shell--nav-collapsed' : ''}${!(TOC_MAP[currentPage]?.length) ? ' shell--no-toc' : ''}`}>
          {navCollapsed && <NavExpandBtn onExpand={() => setNavCollapsed(false)} />}
          <Sidenav
            currentPage={currentPage}
            onNavigate={navigate}
            drawerOpen={navDrawerOpen}
            onDrawerClose={() => setNavDrawerOpen(false)}
            isDark={isDark}
            onToggleTheme={() => setIsDark(d => !d)}
            nav={product.nav}
            title={product.name}
            navCollapsed={navCollapsed}
            onCollapse={() => setNavCollapsed(true)}
          />
          <div className="content-area">
            <PageContent pageId={currentPage} onNavigate={navigate} product={product} platform={currentPlatform} />
          </div>
          <TOC currentPage={currentPage} />
        </div>
      )}
    </IlloStyleProvider>
  );
}
