import { useState, useEffect, useRef } from 'react';
import { useIlloStyle } from '../context/IlloStyleContext';
import {
  makeThumb,
  L_SearchFuzzy, L_SearchPOI, L_SearchCategory, L_SearchNearby, L_SearchAlongRoute, L_SearchAutocomplete,
  L_BatchSearch, L_POIDetails, L_POIPhotos,
  L_Geocode, L_ReverseGeocode,
  L_TrafficFlow, L_TrafficIncidents, L_TrafficFlowTile, L_TrafficModelID,
  L_EVSearchNearby, L_EVChargingAvailability, L_EVMarketCoverage,
  L_MapRasterTile, L_MapVectorTile, L_MapSatelliteTile, L_MapAssetsAPI, L_MapStaticImage,
  L_ParkingAvailability, L_ParkingPrices, L_OnStreetParking, L_FuelPrices,
  L_SnapToRoads,
  L_TrafficStats, L_AreaAnalytics, L_ODAnalysis, L_JunctionAnalytics,
  L_CalculateRoute, L_ReachableRange, L_EVRouting, L_BatchRouting, L_MatrixRouting,
  L_WaypointOpt, L_TurnInstructions, L_RoutingWeather,
  L_HomeScreen, L_ETAPanel, L_ADAS, L_Cluster, L_AIVoice, L_NavGuidance,
  L_MapDisplay, L_Route,
  L_ThemingTokens, L_ChargingSearch, L_ConversationPersonality,
  L_NavControls, L_HorizonPanel, L_EV, L_VIL,
  L_SearchResult,
} from '../illustrations/lightVariants';
import {
  IlloHomeScreen, IlloETAPanel, IlloCluster, IlloADAS, IlloAIVoice, IlloNavGuidance,
  IlloNavSDKLocation, IlloNavSDKSearch, IlloNavSDKRouting, IlloNavSDKNavigation,
  IlloNavSDKOffline, IlloNavSDKVirtualHorizon, IlloNavSDKAdvanced,
  IlloCalculateRoute, IlloReachableRange, IlloEVRouting, IlloBatchRouting, IlloMatrixRouting,
  IlloWaypointOpt, IlloTurnInstructions, IlloRoutingWeather,
  IlloMapRasterTile, IlloMapVectorTile, IlloMapSatelliteTile, IlloMapStaticImage, IlloMapDisplay,
  IlloTrafficFlow, IlloTrafficIncidents, IlloTrafficFlowTile, IlloTrafficModelID,
  IlloTrafficStats, IlloAreaAnalytics, IlloODAnalysis, IlloJunctionAnalytics,
  IlloSearchFuzzy, IlloSearchPOI, IlloSearchNearby, IlloSearchAlongRoute, IlloSearchAutocomplete,
  IlloGeocode, IlloReverseGeocode,
  IlloEVSearchNearby, IlloEVChargingAvailability,
  IlloParkingAvailability, IlloParkingPrices, IlloOnStreetParking, IlloFuelPrices,
  IlloSnapToRoads, IlloPOIDetails, IlloPOIPhotos,
  IlloNavControls, IlloHorizonPanel, IlloRouteBar, IlloInstructionPanel,
  IlloIntentRouting, IlloVoiceEngine,
  IlloEVBattery, IlloEVNavUI, IlloEV,
  IlloEVRequirements, IlloHUD, IlloTruck, IlloVIBasics,
  IlloSpeechToText, IlloAIConfig,
  IlloVIL, IlloCIL,
} from './IntroIllustrations';

const BASE = import.meta.env.BASE_URL; // e.g. '/ux-library-docs/'

/* ─── Icons ──────────────────────────────────────────────────────────────────── */
function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M10.125 18.25C5.63769 18.25 2 14.6123 2 10.125C2 5.63769 5.63769 2 10.125 2C14.6123 2 18.25 5.63769 18.25 10.125C18.25 11.9176 17.6695 13.5747 16.6861 14.9184L21.6339 19.8661C22.122 20.3543 22.122 21.1457 21.6339 21.6339C21.1457 22.122 20.3543 22.122 19.8661 21.6339L14.9184 16.6861C13.5747 17.6695 11.9176 18.25 10.125 18.25ZM10.125 15.75C13.2316 15.75 15.75 13.2316 15.75 10.125C15.75 7.0184 13.2316 4.5 10.125 4.5C7.0184 4.5 4.5 7.0184 4.5 10.125C4.5 13.2316 7.0184 15.75 10.125 15.75Z"/>
    </svg>
  );
}

function ArrowRightIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" style={{ paddingLeft: 4, flexShrink: 0 }}>
      <path d="M14.9821 10.75L11.1161 6.88398L12.8839 5.11621L19.7677 12.0001L12.8839 18.884L11.1161 17.1162L14.9823 13.25H4V10.75H14.9821Z"/>
    </svg>
  );
}

function ExternalLinkIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" style={{ paddingLeft: 4, flexShrink: 0 }}>
      <path fillRule="evenodd" clipRule="evenodd" d="M5.77778 18.2222H18.2222V15.0395H20V18.2222C20 19.2027 19.2027 20 18.2222 20H5.77778C4.79733 20 4 19.2027 4 18.2222V5.77778C4 4.79733 4.79733 4 5.77778 4H9.02435V5.77778H5.77778V18.2222ZM19.9973 10.9852L19.9973 4.01944L13.0315 4.01944L13.0315 6.11199L16.4249 6.11199L10.3027 12.234L11.7826 13.7139L17.9047 7.59186V10.9852L19.9973 10.9852Z"/>
    </svg>
  );
}

function NavigationIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <path d="M4.17755 18.1412C3.98343 18.1412 3.78931 18.0882 3.61284 18C3.34813 17.8588 3.13637 17.6118 3.04813 17.3118C2.94225 16.9588 3.01284 16.5706 3.24225 16.2706C7.84813 10.2882 10.3011 7.09412 10.6187 6.67059C10.954 6.24706 11.4481 6 12.0128 6C12.5599 6 13.0717 6.24706 13.3893 6.67059L13.4246 6.70588C13.8305 7.23529 16.107 10.2 20.7658 16.2529C21.154 16.7647 21.0658 17.5059 20.554 17.8941C20.254 18.1235 19.8658 18.1941 19.5128 18.0882L12.4187 16.0059C12.1717 15.9353 11.907 15.9353 11.6423 16.0059L4.51284 18.0882C4.38931 18.1235 4.28343 18.1412 4.17755 18.1412ZM12.0305 14.8941C12.2599 14.8941 12.4893 14.9294 12.7187 15L19.8481 17.0824C19.8834 17.1 19.9187 17.0824 19.9364 17.0647C19.9717 17.0471 19.9717 17.0118 19.9717 16.9941C19.9717 16.9765 19.9717 16.9412 19.954 16.9059C15.154 10.6765 12.8775 7.71176 12.5775 7.30588L12.5599 7.28824C12.4364 7.14706 12.2423 7.05882 12.0305 7.05882C11.8011 7.05882 11.607 7.14706 11.4834 7.32353C11.1658 7.74706 8.69519 10.9412 4.10696 16.9235C4.07166 16.9412 4.07166 16.9765 4.07166 17.0118C4.08931 17.0471 4.10696 17.0647 4.1246 17.0824C4.14225 17.1 4.17755 17.1 4.21284 17.0824L11.3423 15C11.5717 14.9294 11.8011 14.8941 12.0305 14.8941Z"/>
    </svg>
  );
}

function MapsIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <path d="M20.5235 5.28353L15.2118 3.32471C15.1941 3.30706 15.1588 3.30706 15.1412 3.30706H15.1235C15.0882 3.30706 15.0529 3.30706 15.0176 3.30706C15 3.30706 15 3.30706 14.9824 3.30706C14.9471 3.30706 14.9294 3.30706 14.8941 3.32471H14.8765L8.84118 5.17765L3.72353 3.04235C3.56471 2.97176 3.37059 2.98941 3.22941 3.09529C3.08824 3.20118 3 3.36 3 3.53647V17.6188C3 18.1835 3.33529 18.6776 3.84706 18.8894L8.61176 20.8306H8.62941C8.64706 20.8306 8.66471 20.8482 8.68235 20.8482H8.7C8.73529 20.8482 8.78824 20.8482 8.82353 20.8306H8.84118L14.8765 19.0129L19.9941 21.1482C20.0824 21.1835 20.1882 21.2 20.2941 21.2C20.4353 21.2 20.5765 21.1647 20.7 21.0941C20.9118 20.9882 21.0353 20.7941 21.0353 20.5824V6.14118C21.0353 5.80588 20.8235 5.47059 20.5235 5.28353Z"/>
    </svg>
  );
}

function PlacesIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M11.9177 19.2647C12.2001 19.2647 12.4471 19.1412 12.6236 18.9118C14.0001 17.0235 18.5001 10.6 18.5001 7.56471C18.5001 3.94706 15.553 1 11.9354 1C8.31773 1 5.35303 3.92941 5.35303 7.56471C5.35303 8.55294 5.91773 11.6235 11.2295 18.9294C11.3883 19.1412 11.653 19.2647 11.9177 19.2647ZM11.9177 2.04118C14.953 2.04118 17.4236 4.51176 17.4236 7.54706C17.4236 9.66471 14.6001 14.3235 11.9177 18.0647C9.21773 14.3412 6.41185 9.68235 6.41185 7.54706C6.41185 4.51176 8.88244 2.04118 11.9177 2.04118ZM11.9177 9.58824C13.0413 9.58824 13.9531 8.67647 13.9531 7.55294C13.9531 6.42941 13.0413 5.51765 11.9177 5.51765C10.7942 5.51765 9.88244 6.42941 9.88244 7.55294C9.88244 8.67647 10.7942 9.58824 11.9177 9.58824Z"/>
    </svg>
  );
}

function TrafficIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M13.7114 3.02353L21.8114 18.8706C22.1467 19.4706 22.1291 20.2118 21.7585 20.8118C21.4055 21.4118 20.7702 21.7647 20.082 21.7647H3.95259C3.26435 21.7647 2.62906 21.4118 2.27612 20.8118C1.92318 20.2118 1.90553 19.4706 2.24082 18.8529L9.86435 3.8H9.82906L10.2526 3.02353C10.6055 2.38824 11.2585 2 11.982 2C12.7055 2 13.3761 2.38824 13.7114 3.02353ZM20.082 20.7235C20.4173 20.7235 20.6996 20.5647 20.8585 20.282C21.0173 19.9988 21.0349 19.6635 20.8761 19.3659L12.7585 3.55294C12.5820 3.23529 12.2996 3.04118 11.982 3.04118C11.6643 3.04118 11.382 3.23529 11.2231 3.5353L3.09433 19.3659C2.95318 19.6635 2.97082 19.9988 3.12965 20.282C3.28847 20.5647 3.5708 20.7235 3.90612 20.7235H20.082ZM11.9996 16C12.5519 16 12.9996 16.4477 12.9996 17C12.9996 17.5523 12.5519 18 11.9996 18C11.4473 18 10.9996 17.5523 10.9996 17C10.9996 16.4477 11.4473 16 11.9996 16ZM11.2 9H12.8L12.5 15H11.5L11.2 9Z"/>
    </svg>
  );
}

function AutomotiveIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M6.2 7L4.1 12H19.9L17.8 7H6.2ZM5.5 5H18.5C19.1 5 19.6 5.4 19.8 5.9L22 11V19C22 19.6 21.6 20 21 20H20C19.4 20 19 19.6 19 19V18H5V19C5 19.6 4.6 20 4 20H3C2.4 20 2 19.6 2 19V11L4.2 5.9C4.4 5.4 4.9 5 5.5 5ZM7 15C7 15.6 6.6 16 6 16C5.4 16 5 15.6 5 15C5 14.4 5.4 14 6 14C6.6 14 7 14.4 7 15ZM18 16C18.6 16 19 15.6 19 15C19 14.4 18.6 14 18 14C17.4 14 17 14.4 17 15C17 15.6 17.4 16 18 16Z"/>
    </svg>
  );
}

function MobilityIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <path d="M20.6529 14.6412C19.9294 14.1824 19.0471 13.8824 18.3059 13.8294L15.3059 10.8647C15.0059 10.5294 14.3882 10 13.6118 10H6.90588C6.21765 10 5.6 10.3882 5.3 10.9882L3.72941 14.1118C3.72941 14.1294 3.72941 14.1294 3.71176 14.1471C2.70588 14.6588 2 15.7 2 16.9V18.1706C2 19.1588 2.81176 19.9706 3.8 19.9706H4.47059C4.77059 20.7647 5.54706 21.3471 6.44706 21.3471C7.34706 21.3471 8.12353 20.7647 8.42353 19.9706H14.7059C15.0059 20.7647 15.7824 21.3471 16.6824 21.3471C17.5824 21.3471 18.3588 20.7647 18.6588 19.9706H20.2C21.1882 19.9706 22 19.1588 22 18.1706V17.1471C22 15.9647 21.4824 14.9647 20.6529 14.6412ZM6.44706 20.3C5.97647 20.3 5.58824 19.9118 5.58824 19.4412C5.58824 18.9706 5.97647 18.5824 6.44706 18.5824C6.91765 18.5824 7.30588 18.9706 7.30588 19.4412C7.30588 19.9118 6.91765 20.3 6.44706 20.3ZM16.6824 20.3C16.2118 20.3 15.8235 19.9118 15.8235 19.4412C15.8235 18.9706 16.2118 18.5824 16.6824 18.5824C17.1529 18.5824 17.5412 18.9706 17.5412 19.4412C17.5412 19.9118 17.1529 20.3 16.6824 20.3ZM20.9412 18.1706C20.9412 18.5765 20.6059 18.9118 20.2 18.9118H18.6588C18.3588 18.1176 17.5824 17.5353 16.6824 17.5353C15.7824 17.5353 15.0059 18.1176 14.7059 18.9118H8.42353C8.12353 18.1176 7.34706 17.5353 6.44706 17.5353C5.54706 17.5353 4.77059 18.1176 4.47059 18.9118H3.8C3.39412 18.9118 3.05882 18.5765 3.05882 18.1706V16.9C3.05882 16.1412 3.51176 15.4882 4.18824 15.2059L4.59412 15.0118L6.23529 11.6941C6.38235 11.4 6.63529 11.0647 6.90588 11.0647H13.6118C14.0353 11.0647 14.4941 11.4176 14.6765 11.6235L17.8 14.7647L18.0353 14.7824C18.8118 14.8353 19.5529 15.1 20.1176 15.4882C20.6 15.8059 20.9412 16.4412 20.9412 17.1471V18.1706Z"/>
    </svg>
  );
}

function TerminalIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M4 4H20C21.103 4 22 4.897 22 6V18C22 19.103 21.103 20 20 20H4C2.897 20 2 19.103 2 18V6C2 4.897 2.897 4 4 4ZM4 6V18H20.002L20 6H4ZM18 14H12V16H18V14ZM8.58597 12L6.29297 9.70703L7.70697 8.29303L11.414 12L7.70697 15.707L6.29297 14.293L8.58597 12Z"/>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12.0083 2C6.47396 2 2 6.53748 2 12.151C2 16.6381 4.86662 20.4364 8.84338 21.7807C9.34058 21.8818 9.5227 21.5623 9.5227 21.2936C9.5227 21.0582 9.50631 20.2516 9.50631 19.4111C6.72225 20.0163 6.14249 18.2011 6.14249 18.2011C5.69508 17.0246 5.03215 16.7223 5.03215 16.7223C4.12092 16.1004 5.09852 16.1004 5.09852 16.1004C6.1093 16.1677 6.63969 17.1424 6.63969 17.1424C7.53432 18.6884 8.97592 18.2516 9.55588 17.9827C9.63865 17.3272 9.90394 16.8734 10.1856 16.6214C7.96514 16.3861 5.62891 15.5122 5.62891 11.6131C5.62891 10.5039 6.02634 9.59636 6.65608 8.89058C6.55672 8.63854 6.20866 7.59636 6.75564 6.2015C6.75564 6.2015 7.60069 5.93255 9.5061 7.24347C10.3219 7.02127 11.1632 6.90824 12.0083 6.90729C12.8533 6.90729 13.7148 7.02505 14.5102 7.24347C16.4159 5.93255 17.2609 6.2015 17.2609 6.2015C17.8079 7.59636 17.4596 8.63854 17.3603 8.89058C18.0066 9.59636 18.3876 10.5039 18.3876 11.6131C18.3876 15.5122 16.0514 16.3692 13.8143 16.6214C14.179 16.9407 14.4936 17.5456 14.4936 18.5036C14.4936 19.8649 14.4773 20.9574 14.4773 21.2934C14.4773 21.5623 14.6596 21.8818 15.1566 21.7809C19.1333 20.4362 22 16.6381 22 12.151C22.0163 6.53748 17.526 2 12.0083 2Z"/>
    </svg>
  );
}

function BookAltIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 2H6C4.794 2 3 2.799 3 5V8V14V17V19C3 21.201 4.794 22 6 22H21V20H6.012C5.55 19.988 5 19.806 5 19C5 18.194 5.55 18.012 6.012 18H19H20H21V17V15V4C21 2.897 20.103 2 19 2ZM19 16H5V14V8V5C5 4.194 5.55 4.012 6 4H19V15V16Z"/>
    </svg>
  );
}

/* ─── Data ───────────────────────────────────────────────────────────────────── */
const TABS = [
  { id: 'Automotive', label: 'Automotive' },
  { id: 'Navigation', label: 'Navigation' },
  { id: 'Maps',       label: 'Maps' },
  { id: 'Places',     label: 'Places' },
  { id: 'Traffic',    label: 'Traffic' },
  { id: 'Mobility',   label: 'Mobility' },
];

const SECTION_ICONS = {
  Automotive: <AutomotiveIcon />,
  Navigation: <NavigationIcon />,
  Maps:       <MapsIcon />,
  Places:     <PlacesIcon />,
  Traffic:    <TrafficIcon />,
  Mobility:   <MobilityIcon />,
};

const PRODUCTS = {
  Automotive: [
    {
      name: 'Android UX Library',
      desc: 'A complete, customisable UI component library for TomTom automotive navigation apps on Android — covering maps, EV, ADAS, and in-car experiences.',
      docsId: 'overview',
      productId: 'ux-library',
    },
    {
      name: 'Maps & Navigation SDK',
      desc: 'A modular SDK for building a fully custom automotive navigation experience on Android and iOS — map rendering, routing, turn-by-turn guidance, offline maps, and Virtual Horizon.',
      docsId: 'navsdk-intro',
      productId: 'navsdk',
      links: ['Android', 'iOS'],
      inProgress: true,
    },
    {
      name: 'Automotive Navigation App',
      desc: "TomTom's pre-built navigation APK for Android Automotive OS. Integrate via VIL and CIL — no navigation UI to build or maintain.",
      docsId: 'ana-intro',
      productId: 'ana',
      inProgress: true,
    },
    {
      name: 'ADAS SDK',
      desc: 'Bring ISA-compliant TomTom ADAS data to your vehicle and efficiently augment your existing navigation with speed alerts, curve warnings, and virtual horizon data.',
    },
  ],
  Navigation: [
    { name: 'Routing API',                  desc: 'Calculate routes with vehicle profiles, real-time traffic, reachable range, and batch routing.', docsId: 'routing-api-intro', productId: 'routing-api' },
    { name: 'Long Distance EV Routing API', desc: 'Plan long-distance EV trips with optimized charging stops based on battery state and connector availability.', docsId: 'ldevr-intro', productId: 'ldevr' },
    { name: 'Matrix Routing v2 API',        desc: 'Get route times and distances for many origin-destination pairs in a single request.', docsId: 'matrix-intro', productId: 'matrix-routing', inProgress: true },
    { name: 'Waypoint Optimization API',    desc: 'Optimize waypoint order to find the fastest possible route across multiple stops.', docsId: 'waypoint-intro', productId: 'waypoint-opt', inProgress: true },
  ],
  Maps: [
    { name: 'Global Entity Matcher',        desc: 'Simplify data exchange and geospatial data management' },
    { name: 'Map Display API',              desc: 'Display maps in raster or vector format for web or mobile apps', docsId: 'map-display-api-intro', productId: 'map-display-api' },
    { name: 'Map Feedback API',             desc: 'Submit feedback and monitor its status, via TomTom Issue Tracker system' },
    { name: 'Maps SDK for JavaScript',      desc: 'Integrate TomTom maps and services seamlessly into your web application' },
  ],
  Places: [
    { name: 'Batch Search API',                  desc: 'Run batch queries, synchronous or asynchronous, across search endpoints', docsId: 'search-api-intro', productId: 'search-api' },
    { name: 'EV Search API',                     desc: 'Search EV charging stations by location, connector type, and availability', docsId: 'ev-charging-api-intro', productId: 'ev-charging-api' },
    { name: 'Geocoding API',                     desc: 'Convert addresses into geographic coordinates for your app', docsId: 'geocoding-api-intro', productId: 'geocoding-api' },
    { name: 'Points of Interest Details API',    desc: 'Get additional information about the POIs, such as rating, price range, links…', docsId: 'search-api-intro', productId: 'search-api' },
    { name: 'Points of Interest Photos API',     desc: 'Get photos of POIs to display rich content', docsId: 'search-api-intro', productId: 'search-api' },
    { name: 'Premium Geocoding API',             desc: 'Get precise address coordinates with enhanced details for last-mile delivery' },
    { name: 'Reverse Geocoding API',             desc: 'Convert coordinates into readable addresses or place information', docsId: 'geocoding-api-intro', productId: 'geocoding-api' },
    { name: 'Search API',                        desc: 'Search addresses and POIs with fuzzy matching and geocoding', docsId: 'search-api-intro', productId: 'search-api' },
  ],
  Traffic: [
    { name: 'Area Analytics API',       desc: 'Analyze historical congestion in custom areas using travel time, speed, and density metrics', docsId: 'traffic-analytics-api-intro', productId: 'traffic-analytics-api' },
    { name: 'Connected Services API',   desc: 'Alert drivers and autonomous vehicles of real-time traffic, road, and weather hazards' },
    { name: 'Intermediate Traffic API', desc: 'Download real-time traffic, incident, and speed data to your server systems' },
    { name: 'Junction Analytics API',   desc: 'Optimize traffic signal timing using real-time intersection metrics', docsId: 'traffic-analytics-api-intro', productId: 'traffic-analytics-api' },
    { name: 'O/D Analysis API',         desc: 'Analyze historical traffic flows between origins and destinations', docsId: 'traffic-analytics-api-intro', productId: 'traffic-analytics-api' },
    { name: 'Route Monitoring API',     desc: 'Monitor routes in real time with detailed traffic flow and delay insights' },
    { name: 'Traffic API',              desc: 'Use real-time traffic data and historical analytics for your applications', docsId: 'traffic-api-intro', productId: 'traffic-api' },
    { name: 'Traffic Stats API',        desc: 'Analyze traffic stats for routes and areas', docsId: 'traffic-analytics-api-intro', productId: 'traffic-analytics-api' },
  ],
  Mobility: [
    { name: 'Fuel Prices API',          desc: 'Get current fuel prices by type at selected stations', docsId: 'parking-fuel-api-intro', productId: 'parking-fuel-api' },
    { name: 'Geofencing API',           desc: 'Create virtual boundaries around geographic areas' },
    { name: 'Location History API',     desc: 'Track and manage object locations over time, including fence entry and exit events' },
    { name: 'Notifications API',        desc: 'Read and clear the history of location-based notifications' },
    { name: 'On Street Parking API',    desc: 'Get real-time on-street parking data near your location or destination', docsId: 'parking-fuel-api-intro', productId: 'parking-fuel-api' },
    { name: 'Parking Availability API', desc: 'Get real-time parking availability, spot counts, and trends', docsId: 'parking-fuel-api-intro', productId: 'parking-fuel-api' },
    { name: 'Parking Prices API',       desc: 'Get estimated off-street parking costs, payment options, and rate details', docsId: 'parking-fuel-api-intro', productId: 'parking-fuel-api' },
    { name: 'Snap to Roads API',        desc: 'Match GPS points to roads to reconstruct a driven route', docsId: 'snap-to-roads-api-intro', productId: 'snap-to-roads-api' },
  ],
};

const TOOLS = [
  {
    name: 'TomTom Move Portal',
    img: `${BASE}tools_card_moveportal.webp`,
    desc: 'TomTom MOVE offers access to rich traffic analytics and mobility data, delivered through ready-to-use reports and data visualizations.',
    links: [
      { label: 'Documentation', external: false },
      { label: 'Move Portal',   external: true },
    ],
  },
  {
    name: 'TomTom Map Maker',
    img: `${BASE}tools_card_mapmaker.webp`,
    desc: 'Simple and advanced styling capabilities empowers you to create the map you need, perfectly fitting your unique brand and use case.',
    links: [
      { label: 'Documentation', external: false },
      { label: 'Map Maker',     external: true },
    ],
  },
  {
    name: 'Figma TomTom Maps Generator',
    img: `${BASE}tools_card_figma.webp`,
    desc: 'Figma plugin to import TomTom or custom map styles in Figma.',
    links: [
      { label: 'Documentation', external: false },
    ],
  },
  {
    name: 'MCP Server',
    img: `${BASE}tools_card_mcpserver.webp`,
    desc: 'The TomTom MCP Server brings location intelligence to AI applications through the Model Context Protocol. TomTom MCP Server is open source.',
    links: [
      { label: 'Documentation', external: false },
    ],
  },
];

const RESOURCES = [
  {
    name: 'API Explorer',
    desc: 'Try APIs and experiment with parameters without writing code',
    icon: <TerminalIcon />,
  },
  {
    name: 'Github',
    desc: 'Code snippets, repositories and examples',
    icon: <GitHubIcon />,
  },
  {
    name: 'Knowledge Base',
    desc: 'Find technical documentation including detailed articles and FAQs',
    icon: <BookAltIcon />,
  },
];

const FOOTER_COL1 = ['Careers', 'Company', 'Newsroom', 'Investors'];
const FOOTER_COL2 = ['Privacy Policy', 'Legal overview', 'Cookies', 'Terms and conditions', 'Deprecation policy'];

/* ─── Sub-components ────────────────────────────────────────────────────────── */
function ProductCard({ name, desc, docsId, productId, links, platformIds, note, inProgress, onNavigate }) {
  const hasLink = Boolean(docsId && onNavigate);
  const platformLinks = links && links.length > 0 ? links : null;

  return (
    <div
      className={`dp2-product-card${hasLink ? ' dp2-product-card--linked' : ' dp2-product-card--stub'}${inProgress ? ' dp2-product-card--in-progress' : ''}`}
      onClick={hasLink && !platformLinks ? () => onNavigate(docsId, productId) : undefined}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <h2 className="dp2-product-name">{name}</h2>
        {inProgress ? (
          <span style={{
            flexShrink: 0,
            fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.05em',
            textTransform: 'uppercase',
            padding: '3px 7px', borderRadius: 4,
            background: 'rgba(234,179,8,0.12)', color: '#92400e',
            marginTop: 2,
            whiteSpace: 'nowrap',
          }}>
            In progress
          </span>
        ) : !hasLink ? (
          <span style={{
            flexShrink: 0,
            fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.05em',
            textTransform: 'uppercase',
            padding: '3px 7px', borderRadius: 4,
            background: 'rgba(0,0,0,0.05)', color: 'var(--muted)',
            marginTop: 2,
            whiteSpace: 'nowrap',
          }}>
            Not in prototype
          </span>
        ) : null}
      </div>
      <div className="dp2-product-desc">{desc}</div>
      <div className="dp2-product-footer">
        {platformLinks ? (
          <div className="dp2-product-doc-btns">
            {platformLinks.map((label, i) => (
              <a
                key={label}
                href="#"
                className="dp2-product-doc-btn"
                onClick={e => { e.preventDefault(); onNavigate(docsId, productId, platformIds?.[i] ?? label.toLowerCase()); }}
              >
                {label}
              </a>
            ))}
          </div>
        ) : hasLink ? (
          <a
            href="#"
            className="dp2-product-doc-btn"
            onClick={e => { e.preventDefault(); onNavigate(docsId, productId); }}
          >
            Documentation
          </a>
        ) : (
          <span className="dp2-product-doc-btn dp2-product-doc-btn--disabled">
            Documentation
          </span>
        )}
      </div>
    </div>
  );
}

function ToolCard({ name, img, desc, links }) {
  return (
    <div className="dp2-tool-card">
      <img src={img} alt="" className="dp2-tool-img" />
      <div className="dp2-tool-body">
        <h2 className="dp2-tool-name">{name}</h2>
        <div className="dp2-tool-desc">{desc}</div>
        <div className="dp2-tool-links">
          {links.map(link => (
            <a key={link.label} href="#" className="dp2-doc-link" onClick={e => e.preventDefault()}>
              {link.label} {link.external ? <ExternalLinkIcon size={16} /> : <ArrowRightIcon size={16} />}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResourceCard({ name, desc, icon }) {
  return (
    <div className="dp2-resource-card">
      <div className="dp2-resource-icon-area">{icon}</div>
      <div className="dp2-resource-body">
        <h2 className="dp2-resource-name">{name}</h2>
        <div className="dp2-resource-desc">{desc}</div>
      </div>
    </div>
  );
}

function TechSupportCard() {
  return (
    <div className="dp2-support-card">
      <div>
        <a href="#" className="dp2-doc-link dp2-support-title" onClick={e => e.preventDefault()}>
          Technical support <ExternalLinkIcon size={16} />
        </a>
        <div className="dp2-support-desc">Get technical support for TomTom APIs and SDKs.</div>
      </div>
    </div>
  );
}

/* ─── Mosaic data ────────────────────────────────────────────────────────────── */
const MOSAIC_FILTERS = [
  { id: 'automotive', label: 'Automotive', color: '#e2001a' },
  { id: 'navigation', label: 'Navigation', color: '#58a6ff' },
  { id: 'maps',       label: 'Maps',       color: '#3fb950' },
  { id: 'traffic',    label: 'Traffic',    color: '#f97316' },
  { id: 'mobility',   label: 'Mobility',   color: '#a78bfa' },
];

/* ─── Solution / use-case filters (maps to TomTom.com Solutions taxonomy) ──── */
const SOLUTION_FILTERS = [
  { id: 'nav-automotive',      label: 'Navigation for Automotive', color: '#e2001a' },
  { id: 'electrification',     label: 'Electrification',           color: '#22c55e' },
  { id: 'traffic-intelligence',label: 'Traffic & Mobility',        color: '#f97316' },
  { id: 'location-intel',      label: 'Location Intelligence',     color: '#58a6ff' },
  { id: 'fleet-logistics',     label: 'Fleet & Logistics',         color: '#a78bfa' },
];

const MOSAIC_CARDS = [
  // ── Automotive ──────────────────────────────────────────────────────────────
  { id: 'm-ux-home',        Illo: makeThumb(IlloHomeScreen,      L_HomeScreen),          cats: ['automotive'],              solutions: ['nav-automotive'],                        emoji: '📱', title: 'Build in-car home screens',              problem: 'Lay out map, search and media controls inside a vehicle touchscreen with safe-zone–compliant components.',        product: 'UX Library',                    docsId: 'home-screen-layout',  productId: 'ux-library'  },
  { id: 'm-ux-eta',         Illo: makeThumb(IlloETAPanel,        L_ETAPanel),            cats: ['automotive','navigation'], solutions: ['nav-automotive'],                        emoji: '⏱️', title: 'Show live ETA & route progress',          problem: 'Surface arrival time, distance remaining and a progress bar in a glanceable driving-safe panel.',                product: 'UX Library',                    docsId: 'eta-panel',           productId: 'ux-library'  },
  { id: 'm-ux-search',      Illo: makeThumb(IlloSearchAutocomplete,L_SearchAutocomplete),cats: ['automotive'],              solutions: ['nav-automotive','location-intel'],        emoji: '🔍', title: 'Customise the in-car search engine',     problem: 'Replace the search provider, configure offline-to-online connectivity transitions, and enrich results with custom metadata.', product: 'UX Library',             docsId: 'search-engine',       productId: 'ux-library'  },
  { id: 'm-ux-theming',     Illo: makeThumb(IlloHomeScreen,      L_ThemingTokens),       cats: ['automotive'],              solutions: ['nav-automotive'],                        emoji: '🎨', title: 'Apply OEM brand tokens to nav UI',        problem: 'Override colours, typography, corner radius, and icon sets across all navigation components via a single token file.', product: 'UX Library',                   docsId: 'theming',             productId: 'ux-library'  },
  { id: 'm-ux-charging-search',Illo:makeThumb(IlloEVSearchNearby,L_ChargingSearch),      cats: ['automotive','mobility'],   solutions: ['electrification','nav-automotive'],      emoji: '⚡', title: 'Search EV stations from within the car', problem: 'Surface connector-aware charging results filtered by type, power, and live availability inside the vehicle navigation UI.', product: 'UX Library',                  docsId: 'ev-charging-search',  productId: 'ux-library'  },
  { id: 'm-ev-battery',     Illo: makeThumb(IlloEVBattery,         L_EV),              cats: ['automotive','mobility'],   solutions: ['electrification'],                       title: 'Integrate vehicle & battery data',       product: 'UX Library',  docsId: 'ev-battery',          productId: 'ux-library'  },
  { id: 'm-ev-navui',       Illo: makeThumb(IlloEVNavUI,           L_EVRouting),       cats: ['automotive','navigation'], solutions: ['electrification','nav-automotive'],       title: 'Add EV in-navigation SoC UI',            product: 'UX Library',  docsId: 'ev-nav-ui',           productId: 'ux-library'  },
  { id: 'm-ux-cluster',     Illo: makeThumb(IlloCluster,         L_Cluster),             cats: ['automotive'],              solutions: ['nav-automotive'],                        emoji: '🚗', title: 'Drive instrument cluster displays',       problem: 'Render speed, guidance and turn icons inside a circular cluster at extreme DPI and tiny screen sizes.',              product: 'UX Library',                    docsId: 'cluster',             productId: 'ux-library'  },
  { id: 'm-ux-personality',  Illo: makeThumb(IlloAIVoice,        L_ConversationPersonality),cats: ['automotive'],           solutions: ['nav-automotive'],                        emoji: '✦',  title: 'Customise AI assistant personality',     problem: "Set a custom name, conversation style, and branded tone for the in-vehicle voice assistant — aligned with your OEM identity.", product: 'UX Library / TAIA',           docsId: 'ai-personality',      productId: 'ux-library'  },
  { id: 'm-ux-navcontrols', Illo: makeThumb(IlloNavControls,      L_NavControls),     cats: ['automotive'],              solutions: ['nav-automotive'],                        title: 'Customise on-map nav controls',          product: 'UX Library',  docsId: 'nav-controls',        productId: 'ux-library'  },
  { id: 'm-ux-horizon',     Illo: makeThumb(IlloHorizonPanel,      L_HorizonPanel),    cats: ['automotive'],              solutions: ['nav-automotive'],                        title: 'Configure the Horizon Panel',            product: 'UX Library',  docsId: 'horizon-panel',       productId: 'ux-library'  },
  { id: 'm-ux-instruction', Illo: makeThumb(IlloInstructionPanel,  L_ETAPanel),        cats: ['automotive','navigation'], solutions: ['nav-automotive'],                        title: 'Style the instruction banner',           product: 'UX Library',  docsId: 'instruction-panel',   productId: 'ux-library'  },
  { id: 'm-ux-routebar',    Illo: makeThumb(IlloRouteBar,          L_Route),           cats: ['automotive','navigation'], solutions: ['nav-automotive'],                        title: 'Customise the route progress bar',       product: 'UX Library',  docsId: 'route-bar',           productId: 'ux-library'  },
  { id: 'm-ux-adas',        Illo: makeThumb(IlloADAS,            L_ADAS),                cats: ['automotive','navigation'], solutions: ['nav-automotive'],                        emoji: '🛣️', title: 'Guide lane changes with ADAS data',      problem: 'Highlight the recommended lane on a multi-lane road and show curve, gradient and sign warnings ahead.',              product: 'UX Library',                    docsId: 'adas',                productId: 'ux-library'  },
  { id: 'm-ux-voice',       Illo: makeThumb(IlloAIVoice,         L_AIVoice),             cats: ['automotive'],              solutions: ['nav-automotive'],                        emoji: '🎙️', title: 'Add AI voice assistant to a car app',    problem: 'Stream conversational responses with animated waveforms and integrate configurable OEM personality tones.',           product: 'UX Library / TAIA',             docsId: 'ai-overview',         productId: 'ux-library'  },
  { id: 'm-taia-intent',    Illo: makeThumb(IlloIntentRouting,     L_AIVoice),         cats: ['automotive'],              solutions: ['nav-automotive'],                        title: 'Route TAIA intents to domain handlers',  product: 'UX Library / TAIA',  docsId: 'intent-routing',  productId: 'ux-library'  },
  { id: 'm-taia-voice',     Illo: makeThumb(IlloVoiceEngine,       L_AIVoice),         cats: ['automotive'],              solutions: ['nav-automotive'],                        title: 'Connect an OEM TTS voice engine',        product: 'UX Library / TAIA',  docsId: 'voice-engine',    productId: 'ux-library'  },
  // ── EV & Charging domain pages ──────────────────────────────────────────────
  { id: 'm-evd-overview',   Illo: makeThumb(IlloEV,             L_EV),          cats: ['automotive','mobility'], solutions: ['electrification','nav-automotive'], title: 'EV integration overview',                product: 'UX Library · EV & Charging', docsId: 'ev-overview',      productId: 'ux-library' },
  { id: 'm-evd-routing',    Illo: makeThumb(IlloEVRouting,      L_EVRouting),   cats: ['automotive','mobility'], solutions: ['electrification','nav-automotive'], title: 'Long-distance EV routing UI',             product: 'UX Library · EV & Charging', docsId: 'ev-routing',       productId: 'ux-library' },
  { id: 'm-evd-reqs',       Illo: makeThumb(IlloEVRequirements, L_EV),          cats: ['automotive','mobility'], solutions: ['electrification'],                  title: 'EV integration requirements',             product: 'UX Library · EV & Charging', docsId: 'ev-requirements',  productId: 'ux-library' },
  // ── Vehicle Integration domain pages ────────────────────────────────────────
  { id: 'm-vid-basics',     Illo: makeThumb(IlloVIBasics,       L_VIL),         cats: ['automotive'],            solutions: ['nav-automotive'],                   title: 'Vehicle integration basics',              product: 'UX Library · Vehicle Integration', docsId: 'vi-basics',   productId: 'ux-library' },
  { id: 'm-vid-hud',        Illo: makeThumb(IlloHUD,            L_ADAS),        cats: ['automotive'],            solutions: ['nav-automotive'],                   title: 'Display guidance on a HUD',               product: 'UX Library · Vehicle Integration', docsId: 'hud',         productId: 'ux-library' },
  { id: 'm-vid-truck',      Illo: makeThumb(IlloTruck,          L_Cluster),     cats: ['automotive'],            solutions: ['nav-automotive'],                   title: 'Truck & commercial vehicle support',      product: 'UX Library · Vehicle Integration', docsId: 'truck',       productId: 'ux-library' },
  // ── TomTom AI Assistant domain pages ────────────────────────────────────────
  { id: 'm-taia-stt',       Illo: makeThumb(IlloSpeechToText,   L_AIVoice),     cats: ['automotive'],            solutions: ['nav-automotive'],                   title: 'Connect a speech-to-text engine',         product: 'UX Library · TAIA',          docsId: 'speech-to-text',   productId: 'ux-library' },
  { id: 'm-taia-config',    Illo: makeThumb(IlloAIConfig,       L_AIVoice),     cats: ['automotive'],            solutions: ['nav-automotive'],                   title: 'Configure TAIA client & MQTT',            product: 'UX Library · TAIA',          docsId: 'ai-config',        productId: 'ux-library' },
  { id: 'm-ana',            Illo: makeThumb(IlloNavGuidance,     L_NavGuidance),         cats: ['automotive','navigation'], solutions: ['nav-automotive'],                        emoji: '🧭', title: 'Integrate a pre-built navigation APK',   problem: 'Drop TomTom navigation into Android Automotive OS via VIL/CIL without building a nav UI from scratch.',              product: 'Automotive Navigation App',     docsId: 'ana-intro',           productId: 'ana'         },
  { id: 'm-ana-vil',        Illo: makeThumb(IlloCluster,         L_Cluster),             cats: ['automotive'],              solutions: ['nav-automotive','electrification'],      emoji: '🔌', title: 'Feed vehicle signals into ANA via VIL',  problem: 'Pipe EV battery state, connector type, speed, GDPR consent, and cluster output into the navigation app through a single data interface.', product: 'ANA — Vehicle Integration Layer', docsId: 'ana-intro',        productId: 'ana'         },
  { id: 'm-ana-cil',        Illo: makeThumb(IlloNavGuidance,     L_NavGuidance),         cats: ['automotive'],              solutions: ['nav-automotive'],                        emoji: '🎛️', title: 'Command ANA from your app via CIL',      problem: 'Trigger navigation to a destination, cancel routes, search nearby POIs, and query live navigation state from a companion app or HMI.', product: 'ANA — Control API',            docsId: 'ana-intro',           productId: 'ana'         },
  // ── Navigation ──────────────────────────────────────────────────────────────
  { id: 'm-route',      Illo: makeThumb(IlloCalculateRoute,  L_CalculateRoute),  cats: ['navigation'],             solutions: ['nav-automotive','fleet-logistics'],  emoji: '📍', title: 'Calculate a traffic-aware route',     problem: 'Get turn-by-turn routes with real-time traffic, vehicle profiles, toll avoidance and ETA in one request.',  product: 'Routing API',                   docsId: 'routing-api-intro', productId: 'routing-api'  },
  { id: 'm-range',      Illo: makeThumb(IlloReachableRange,  L_ReachableRange),  cats: ['navigation','mobility'],  solutions: ['nav-automotive','electrification'],  emoji: '⭕', title: 'Show reachable range from a point',   problem: 'Generate an isochrone polygon showing how far a vehicle can travel within a time or fuel/charge budget.',    product: 'Routing API',                   docsId: 'routing-api-intro', productId: 'routing-api'  },
  { id: 'm-ev-route',   Illo: makeThumb(IlloEVRouting,       L_EVRouting),       cats: ['navigation','mobility'],  solutions: ['electrification'],                  emoji: '⚡', title: 'Plan long-distance EV trips',         problem: 'Route an EV across hundreds of kilometres with optimised charging stops based on battery SOC and speed.',    product: 'Long Distance EV Routing API',  docsId: 'ldevr-intro',    productId: 'ldevr'          },
  { id: 'm-batch-rt',   Illo: makeThumb(IlloBatchRouting,    L_BatchRouting),    cats: ['navigation'],             solutions: ['fleet-logistics'],                  emoji: '📦', title: 'Batch-calculate routes for a fleet',  problem: 'Submit dozens of origin-destination pairs in a single request and get all routes back in parallel.',         product: 'Routing API',                   docsId: 'routing-api-intro', productId: 'routing-api'  },
  { id: 'm-matrix',     Illo: makeThumb(IlloMatrixRouting,   L_MatrixRouting),   cats: ['navigation'],             solutions: ['fleet-logistics'],                  emoji: '⚡', title: 'Build an origin-destination matrix',  problem: 'Get travel times and distances for every combination of a set of origins and destinations in one call.',      product: 'Matrix Routing API',            docsId: 'matrix-intro',   productId: 'matrix-routing' },
  { id: 'm-waypoint',   Illo: makeThumb(IlloWaypointOpt,     L_WaypointOpt),     cats: ['navigation','mobility'],  solutions: ['fleet-logistics'],                  emoji: '📍', title: 'Optimise multi-stop delivery order',  problem: 'Reorder a list of stops into the fastest possible visiting sequence using TSP-style waypoint optimisation.',  product: 'Waypoint Optimization API',     docsId: 'waypoint-intro', productId: 'waypoint-opt'   },
  { id: 'm-instruct',   Illo: makeThumb(IlloTurnInstructions,L_TurnInstructions),cats: ['navigation'],             solutions: ['nav-automotive'],                   emoji: '↗️', title: 'Parse structured turn instructions',  problem: 'Extract a machine-readable list of manoeuvre steps with icons, road names and distances for custom guidance.', product: 'Routing API',                   docsId: 'routing-api-intro', productId: 'routing-api'  },
  { id: 'm-weather-rt', Illo: makeThumb(IlloRoutingWeather,  L_RoutingWeather),  cats: ['navigation','traffic'],   solutions: ['nav-automotive','fleet-logistics'], emoji: '🌧️', title: 'Adjust routes for weather',           problem: 'Incorporate real-time weather conditions into route time estimates and select alternatives when rain slows traffic.',product:'Routing API',                  docsId: 'routing-api-intro', productId: 'routing-api'  },
  // ── Maps ─────────────────────────────────────────────────────────────────────
  { id: 'm-raster',     Illo: makeThumb(IlloMapRasterTile,   L_MapRasterTile),   cats: ['maps'],                   solutions: ['location-intel'],                   emoji: '🟦', title: 'Render raster map tiles',             problem: 'Fetch 256×256 PNG tiles at any zoom and stitch them into a slippy-map with a single z/x/y URL template.',    product: 'Map Display API',               docsId: 'map-display-api-intro', productId: 'map-display-api' },
  { id: 'm-vector',     Illo: makeThumb(IlloMapVectorTile,   L_MapVectorTile),   cats: ['maps'],                   solutions: ['location-intel'],                   emoji: '📐', title: 'Style vector maps on the client',     problem: 'Download multi-layer vector tiles and apply custom styles at render time — roads, labels and POIs as layers.',  product: 'Map Display API',               docsId: 'map-display-api-intro', productId: 'map-display-api' },
  { id: 'm-satellite',  Illo: makeThumb(IlloMapSatelliteTile,L_MapSatelliteTile),cats: ['maps'],                   solutions: ['location-intel'],                   emoji: '🛰️', title: 'Display satellite imagery',           problem: 'Show real-world aerial photos alongside vector overlays for hybrid map views or site-survey contexts.',       product: 'Map Display API',               docsId: 'map-display-api-intro', productId: 'map-display-api' },
  { id: 'm-static',     Illo: makeThumb(IlloMapStaticImage,  L_MapStaticImage),  cats: ['maps'],                   solutions: ['location-intel'],                   emoji: '🖼️', title: 'Generate static map thumbnails',      problem: 'Produce a server-rendered PNG of any location at a fixed size — perfect for notifications, emails and previews.',product: 'Map Display API',               docsId: 'map-display-api-intro', productId: 'map-display-api' },
  { id: 'm-mapdisplay', Illo: makeThumb(IlloMapDisplay,      L_MapDisplay),      cats: ['maps','automotive'],      solutions: ['location-intel','nav-automotive'],  emoji: '🗺️', title: 'Embed a live map in an app',          problem: 'Composite raster tiles, traffic overlays and route arcs into a single map view inside any SDK or web app.',    product: 'Map Display API / NavSDK',      docsId: 'navsdk-intro',   productId: 'navsdk'         },
  // ── Traffic ───────────────────────────────────────────────────────────────────
  { id: 'm-tf-flow',    Illo: makeThumb(IlloTrafficFlow,     L_TrafficFlow),     cats: ['traffic'],                solutions: ['traffic-intelligence'],             emoji: '🟢', title: 'Stream live traffic flow data',       problem: 'Get current free-flow speed vs actual speed for any road segment to colour-code congestion in real time.',     product: 'Traffic API',                   docsId: 'traffic-api-intro', productId: 'traffic-api'  },
  { id: 'm-tf-inc',     Illo: makeThumb(IlloTrafficIncidents,L_TrafficIncidents),cats: ['traffic'],                solutions: ['traffic-intelligence','nav-automotive'],emoji: '⚠️', title: 'Overlay live traffic incidents',   problem: 'Fetch accidents, road works and closures with severity, road name and coordinates to alert drivers proactively.', product: 'Traffic API',                  docsId: 'traffic-api-intro', productId: 'traffic-api'  },
  { id: 'm-tf-tile',    Illo: makeThumb(IlloTrafficFlowTile, L_TrafficFlowTile), cats: ['traffic','maps'],         solutions: ['traffic-intelligence','location-intel'],emoji: '🗺️', title: 'Add traffic overlay tiles to a map',problem: 'Request flow-speed raster tiles that snap directly onto a slippy map as a transparent congestion heatmap.',    product: 'Traffic API',                   docsId: 'traffic-api-intro', productId: 'traffic-api'  },
  { id: 'm-tf-model',   Illo: makeThumb(IlloTrafficModelID,  L_TrafficModelID),  cats: ['traffic'],                solutions: ['traffic-intelligence'],             emoji: '🔢', title: 'Version traffic data freshness',      problem: 'Poll a model ID before downloading flow data so you only fetch when the underlying traffic model has updated.',  product: 'Traffic API',                   docsId: 'traffic-api-intro', productId: 'traffic-api'  },
  { id: 'm-ta-stats',   Illo: makeThumb(IlloTrafficStats,    L_TrafficStats),    cats: ['traffic'],                solutions: ['traffic-intelligence','fleet-logistics'],emoji: '📊', title: 'Analyse historical congestion trends',problem: 'Query week-by-week traffic speed distributions on any road segment to find peak hours and seasonal patterns.',  product: 'Traffic Analytics API',         docsId: 'traffic-analytics-api-intro', productId: 'traffic-analytics-api' },
  { id: 'm-ta-area',    Illo: makeThumb(IlloAreaAnalytics,   L_AreaAnalytics),   cats: ['traffic'],                solutions: ['traffic-intelligence'],             emoji: '🔥', title: 'Heatmap traffic density by zone',     problem: 'Aggregate flow data across custom area polygons into intensity grids for urban planning and congestion studies.', product: 'Traffic Analytics API',        docsId: 'traffic-analytics-api-intro', productId: 'traffic-analytics-api' },
  { id: 'm-ta-od',      Illo: makeThumb(IlloODAnalysis,      L_ODAnalysis),      cats: ['traffic'],                solutions: ['traffic-intelligence'],             emoji: '🔄', title: 'Measure origin-destination flows',    problem: 'Build an OD matrix showing how many trips move between each pair of zones — essential for transport modelling.', product: 'Traffic Analytics API',        docsId: 'traffic-analytics-api-intro', productId: 'traffic-analytics-api' },
  { id: 'm-ta-junct',   Illo: makeThumb(IlloJunctionAnalytics,L_JunctionAnalytics),cats: ['traffic'],              solutions: ['traffic-intelligence'],             emoji: '🔀', title: 'Count vehicles at an intersection',   problem: 'Retrieve per-approach vehicle counts at any junction to optimise signal timing and model turning movements.',    product: 'Traffic Analytics API',         docsId: 'traffic-analytics-api-intro', productId: 'traffic-analytics-api' },
  // ── Mobility ─────────────────────────────────────────────────────────────────
  { id: 'm-fuzzy',      Illo: makeThumb(IlloSearchFuzzy,     L_SearchFuzzy),     cats: ['mobility'],               solutions: ['location-intel'],                   emoji: '🔍', title: 'Search addresses and places by text', problem: 'Run typo-tolerant fuzzy queries across addresses, POIs and structured places — one endpoint for all search types.', product: 'Search API',                  docsId: 'search-api-intro', productId: 'search-api'   },
  { id: 'm-poi',        Illo: makeThumb(IlloSearchPOI,       L_SearchPOI),       cats: ['mobility'],               solutions: ['location-intel'],                   emoji: '📍', title: 'Find POIs by category or brand',      problem: 'Filter millions of points of interest by category hierarchy, brand name, opening hours or accessibility features.', product: 'Search API',                 docsId: 'search-api-intro', productId: 'search-api'   },
  { id: 'm-nearby',     Illo: makeThumb(IlloSearchNearby,    L_SearchNearby),    cats: ['mobility'],               solutions: ['location-intel'],                   emoji: '📡', title: 'Discover nearby places by radius',   problem: 'Search within a radius or bounding box from a GPS coordinate to surface contextually relevant places.',          product: 'Search API',                  docsId: 'search-api-intro', productId: 'search-api'   },
  { id: 'm-along',      Illo: makeThumb(IlloSearchAlongRoute,L_SearchAlongRoute),cats: ['mobility','navigation'],  solutions: ['nav-automotive','location-intel'],  emoji: '🛣️', title: 'Search for stops along a route',   problem: 'Find fuel stations, restaurants and charging points within a configurable detour corridor from any route.',       product: 'Search API',                  docsId: 'search-api-intro', productId: 'search-api'   },
  { id: 'm-autocmp',    Illo: makeThumb(IlloSearchAutocomplete,L_SearchAutocomplete),cats: ['mobility'],           solutions: ['location-intel'],                   emoji: '⌨️', title: 'Autocomplete a search input',         problem: 'Return ranked suggestions on every keystroke with debounce support — reduces API calls and speeds up users.',    product: 'Search API',                  docsId: 'search-api-intro', productId: 'search-api'   },
  { id: 'm-geocode',    Illo: makeThumb(IlloGeocode,         L_Geocode),         cats: ['mobility'],               solutions: ['location-intel'],                   emoji: '📌', title: 'Geocode an address to coordinates',   problem: 'Turn a free-text address string into a precise latitude/longitude pair with confidence score and matched components.', product: 'Geocoding API',             docsId: 'geocoding-api-intro', productId: 'geocoding-api' },
  { id: 'm-revgeo',     Illo: makeThumb(IlloReverseGeocode,  L_ReverseGeocode),  cats: ['mobility'],               solutions: ['location-intel'],                   emoji: '🔄', title: 'Reverse geocode a map tap',           problem: 'Resolve any latitude/longitude into a human-readable address — essential for showing where a user tapped on a map.', product: 'Geocoding API',            docsId: 'geocoding-api-intro', productId: 'geocoding-api' },
  { id: 'm-ev-near',    Illo: makeThumb(IlloEVSearchNearby,  L_EVSearchNearby),  cats: ['mobility','navigation'],  solutions: ['electrification','location-intel'], emoji: '⚡', title: 'Find nearby EV charging stations',   problem: 'Search EV stations by location, connector type and power level with live availability status per connector.',    product: 'EV & Charging API',           docsId: 'ev-charging-api-intro', productId: 'ev-charging-api' },
  { id: 'm-ev-avail',   Illo: makeThumb(IlloEVChargingAvailability,L_EVChargingAvailability),cats: ['mobility'],   solutions: ['electrification'],                  emoji: '🔌', title: 'Check real-time connector availability',problem: 'Query per-connector status (available/charging/offline) at a specific station before routing a driver there.', product: 'EV & Charging API',          docsId: 'ev-charging-api-intro', productId: 'ev-charging-api' },
  { id: 'm-parking',    Illo: makeThumb(IlloParkingAvailability,L_ParkingAvailability),cats: ['mobility'],         solutions: ['location-intel'],                   emoji: '🅿️', title: 'Show real-time parking availability', problem: 'Get live used/capacity fractions for off-street car parks so drivers can see spaces before they arrive.',        product: 'Parking & Fuel API',          docsId: 'parking-fuel-api-intro', productId: 'parking-fuel-api' },
  { id: 'm-park-price', Illo: makeThumb(IlloParkingPrices,   L_ParkingPrices),   cats: ['mobility'],               solutions: ['location-intel'],                   emoji: '💶', title: 'Display parking prices by duration',  problem: 'Return tiered pricing tables for off-street car parks so drivers can compare costs before choosing a location.',   product: 'Parking & Fuel API',          docsId: 'parking-fuel-api-intro', productId: 'parking-fuel-api' },
  { id: 'm-onstreet',   Illo: makeThumb(IlloOnStreetParking, L_OnStreetParking), cats: ['mobility'],               solutions: ['location-intel'],                   emoji: '🚗', title: 'Predict on-street parking probability',problem: 'Get kerbside availability predictions per road segment — colour-coded green/amber/red — before the last mile.',   product: 'Parking & Fuel API',          docsId: 'parking-fuel-api-intro', productId: 'parking-fuel-api' },
  { id: 'm-fuel',       Illo: makeThumb(IlloFuelPrices,      L_FuelPrices),      cats: ['mobility'],               solutions: ['location-intel','fleet-logistics'], emoji: '⛽', title: 'Show live fuel prices at stations',   problem: 'Retrieve current prices per fuel type at nearby stations so drivers can compare costs on the route.',             product: 'Parking & Fuel API',          docsId: 'parking-fuel-api-intro', productId: 'parking-fuel-api' },
  { id: 'm-snap',       Illo: makeThumb(IlloSnapToRoads,     L_SnapToRoads),     cats: ['mobility','navigation'],  solutions: ['fleet-logistics'],                  emoji: '📍', title: 'Snap a GPS trace to road geometry',  problem: 'Correct noisy raw GPS points to the nearest road centreline — essential for trip reconstruction and analytics.',  product: 'Snap to Roads API',           docsId: 'snap-to-roads-api-intro', productId: 'snap-to-roads-api' },
  { id: 'm-poi-det',    Illo: makeThumb(IlloPOIDetails,      L_POIDetails),      cats: ['mobility'],               solutions: ['location-intel'],                   emoji: '🏢', title: 'Enrich POIs with contact & hours',    problem: 'Fetch phone, website, opening hours, star rating and accessibility info for any POI beyond its basic name/pin.',  product: 'Search API (POI Details)',    docsId: 'search-api-intro', productId: 'search-api'   },
  { id: 'm-poi-photos', Illo: makeThumb(IlloPOIPhotos, L_POIPhotos),             cats: ['mobility'],               solutions: ['location-intel'],                   emoji: '📷', title: 'Display crowd-sourced POI photos',    problem: 'Load categorised photos (exterior, interior, menu) for any point of interest to show rich preview content.',      product: 'Search API (POI Photos)',     docsId: 'search-api-intro', productId: 'search-api'   },
  // ── NavSDK Domains ───────────────────────────────────────────────────────────
  { id: 'm-navsdk-map',      Illo: makeThumb(IlloMapDisplay,             L_MapDisplay),   cats: ['maps','automotive'],       solutions: ['nav-automotive','location-intel'],  emoji: '🗺️', title: 'Render and style a NavSDK map',          problem: 'Embed a live, fully-styled TomTom map in Compose or Views and control camera, markers, and traffic overlays from a single SDK surface.',       product: 'NavSDK · Map Display',       docsId: 'navsdk-map-display',  productId: 'navsdk' },
  { id: 'm-navsdk-loc',      Illo: makeThumb(IlloNavSDKLocation,         L_MapDisplay),   cats: ['navigation','mobility'],   solutions: ['nav-automotive','fleet-logistics'], emoji: '📍', title: 'Connect GPS positioning to the NavSDK',  problem: 'Feed device GNSS into the SDK via the built-in fused provider or plug in dead-reckoning hardware via the custom LocationEngine interface.',     product: 'NavSDK · Location',          docsId: 'navsdk-location',     productId: 'navsdk' },
  { id: 'm-navsdk-srch',     Illo: makeThumb(IlloNavSDKSearch,           L_SearchResult), cats: ['navigation','maps'],       solutions: ['nav-automotive','location-intel'],  emoji: '🔍', title: 'Add fuzzy search and autocomplete',       problem: 'Search addresses, POIs, and categories with typo tolerance and real-time suggestions — plus along-route and reverse geocoding in one SDK.',    product: 'NavSDK · Search',            docsId: 'navsdk-search',       productId: 'navsdk' },
  { id: 'm-navsdk-route',    Illo: makeThumb(IlloNavSDKRouting,          L_Route),        cats: ['navigation'],             solutions: ['nav-automotive','fleet-logistics'], emoji: '🚦', title: 'Calculate and compare SDK routes',        problem: 'Plan traffic-aware routes with up to three alternatives, inspect route sections for tolls and restrictions, and import or export route data.',   product: 'NavSDK · Routing',           docsId: 'navsdk-routing',      productId: 'navsdk' },
  { id: 'm-navsdk-nav',      Illo: makeThumb(IlloNavSDKNavigation,       L_NavGuidance),  cats: ['automotive','navigation'], solutions: ['nav-automotive'],                   emoji: '↖️', title: 'Drive turn-by-turn navigation',           problem: 'Start a guided session with manoeuvre events, voice instructions, safety alerts, and continuous replanning from the NavSDK guidance engine.',    product: 'NavSDK · Navigation',        docsId: 'navsdk-navigation',   productId: 'navsdk' },
  { id: 'm-navsdk-off',      Illo: makeThumb(IlloNavSDKOffline,          L_MapDisplay),   cats: ['maps','navigation'],       solutions: ['nav-automotive','fleet-logistics'], emoji: '📴', title: 'Enable fully offline map and routing',    problem: 'Pre-download country or region map packages and route on-device without connectivity — incremental delta updates minimise bandwidth costs.',    product: 'NavSDK · Offline',           docsId: 'navsdk-offline',      productId: 'navsdk' },
  { id: 'm-navsdk-vh',       Illo: makeThumb(IlloNavSDKVirtualHorizon,   L_HorizonPanel), cats: ['automotive','navigation'], solutions: ['nav-automotive'],                   emoji: '🛤️', title: 'Access the Virtual Horizon for ADAS',     problem: 'Read curvature, gradient, speed limits, and traffic up to several kilometres ahead — the data foundation for ISA, predictive cruise, and ADAS.', product: 'NavSDK · Virtual Horizon',   docsId: 'navsdk-horizon',      productId: 'navsdk' },
  { id: 'm-navsdk-adv',      Illo: makeThumb(IlloNavSDKAdvanced,         L_NavGuidance),  cats: ['automotive'],             solutions: ['nav-automotive'],                   emoji: '⚙️', title: 'Configure advanced NavSDK settings',      problem: 'Set up simulation mode, map-matched positioning, telemetry levels, and vehicle metadata to tune SDK behaviour for production integration.',       product: 'NavSDK · Advanced',          docsId: 'navsdk-advanced',     productId: 'navsdk' },
  { id: 'm-navsdk-voice',    Illo: makeThumb(IlloNavSDKNavigation,       L_NavGuidance),  cats: ['automotive'],             solutions: ['nav-automotive'],                   emoji: '🔊', title: 'Add voice navigation instructions',       problem: 'Trigger TTS voice prompts at the correct look-ahead distance before each manoeuvre, with custom engine support and mute state management.',     product: 'NavSDK · Navigation',        docsId: 'navsdk-navigation',   productId: 'navsdk' },
  { id: 'm-navsdk-replan',   Illo: makeThumb(IlloNavSDKRouting,          L_Route),        cats: ['navigation','automotive'], solutions: ['nav-automotive','fleet-logistics'], emoji: '🔄', title: 'Automatically replan on deviation',        problem: 'Detect when a driver leaves the planned route or encounters a significant incident ahead and silently recalculate to the destination.',           product: 'NavSDK · Navigation',        docsId: 'navsdk-navigation',   productId: 'navsdk' },
  { id: 'm-navsdk-sim',      Illo: makeThumb(IlloNavSDKAdvanced,         L_NavGuidance),  cats: ['automotive'],             solutions: ['nav-automotive'],                   emoji: '🎮', title: 'Simulate navigation for testing',          problem: 'Drive a route with a simulated GPS feed at configurable speed to test guidance UI, voice timing, and replanning logic without physical movement.',  product: 'NavSDK · Advanced',          docsId: 'navsdk-advanced',     productId: 'navsdk' },
  { id: 'm-navsdk-hazard',   Illo: makeThumb(IlloNavSDKVirtualHorizon,   L_HorizonPanel), cats: ['automotive','navigation'], solutions: ['nav-automotive'],                   emoji: '⚠️', title: 'Alert drivers to road hazards ahead',     problem: 'Subscribe to speed-limit changes, hazard events, and traffic slowdowns from the Virtual Horizon to warn drivers before they encounter them.',    product: 'NavSDK · Virtual Horizon',   docsId: 'navsdk-horizon',      productId: 'navsdk' },
];

/* ─── Mosaic view ─────────────────────────────────────────────────────────────── */
function FilterRow({ label, filters, active, onToggle, onClear }) {
  const allOn = active.length === 0;
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <span style={{
        fontSize: '0.6rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase',
        letterSpacing: '0.08em', flexShrink: 0, width: 72, textAlign: 'right', paddingRight: 4,
      }}>{label}</span>
      <button
        onClick={onClear}
        style={{
          padding: '5px 14px', borderRadius: 100, cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600,
          border: allOn ? '2px solid var(--black)' : '1.5px solid var(--border)',
          background: allOn ? 'var(--black)' : 'transparent',
          color: allOn ? 'var(--bg)' : 'var(--mid)',
          transition: 'all 0.12s',
        }}
      >All</button>
      {filters.map(f => {
        const on = active.includes(f.id);
        return (
          <button
            key={f.id}
            onClick={() => onToggle(f.id)}
            style={{
              padding: '5px 14px', borderRadius: 100, cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600,
              border: on ? `2px solid ${f.color}` : '1.5px solid var(--border)',
              background: on ? `${f.color}18` : 'transparent',
              color: on ? f.color : 'var(--mid)',
              transition: 'all 0.12s',
            }}
          >{f.label}</button>
        );
      })}
    </div>
  );
}

const DISC_TABS = [
  { id: 'all',                  label: 'All' },
  { id: 'nav-automotive',       label: 'Navigation for Automotive' },
  { id: 'electrification',      label: 'Electrification' },
  { id: 'traffic-intelligence', label: 'Traffic & Mobility' },
  { id: 'location-intel',       label: 'Location Intelligence' },
  { id: 'fleet-logistics',      label: 'Fleet & Logistics' },
];

function ViewToggle({ view, setView }) {
  return (
    <div className="dp2-view-toggle">
      {[
        { id: 'catalogue', icon: '≡', label: 'Catalogue' },
        { id: 'mosaic',    icon: '⊞', label: 'Discovery' },
      ].map(v => (
        <button
          key={v.id}
          onClick={() => setView(v.id)}
          className={`dp2-view-btn${view === v.id ? ' dp2-view-btn--active' : ''}`}
        >
          <span style={{ fontSize: '0.875rem', lineHeight: 1 }}>{v.icon}</span>
          {v.label}
        </button>
      ))}
    </div>
  );
}

function MosaicView({ onNavigate, view, setView }) {
  const { palette } = useIlloStyle();
  const [activeCat, setActiveCat] = useState('all');

  const cards = activeCat === 'all'
    ? MOSAIC_CARDS
    : MOSAIC_CARDS.filter(c => c.solutions?.includes(activeCat));

  return (
    <div>
      {/* Sticky bar: view toggle + filter tabs */}
      <div className="dp2-tabbar-wrap">
        <div className="dp2-viewbar-inner">
          <ViewToggle view={view} setView={setView} />
          <div className="dp2-tabbar-pill">
            {DISC_TABS.map(tab => (
              <button
                key={tab.id}
                className={`dp2-tab-btn${activeCat === tab.id ? ' dp2-tab-btn--active' : ''}`}
                onClick={() => setActiveCat(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '32px 32px 64px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
          gap: 14,
        }}>
          {cards.map(card => (
            <MosaicCard key={card.id} card={card} palette={palette} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MosaicCard({ card, palette, onNavigate }) {
  const [hovered, setHovered] = useState(false);
  const cats = card.cats.map(id => MOSAIC_FILTERS.find(f => f.id === id)).filter(Boolean);
  const hasLink = Boolean(card.docsId && onNavigate);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={hasLink ? () => onNavigate(card.docsId, card.productId) : undefined}
      style={{
        borderRadius: 20,
        border: `1px solid ${hovered && hasLink ? 'var(--black)' : 'var(--border)'}`,
        background: 'var(--surface)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: hasLink ? 'pointer' : 'default',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        boxShadow: hovered && hasLink ? '0 4px 16px rgba(0,0,0,0.1)' : 'none',
      }}
    >
      {/* Illustration */}
      <div style={{ height: 130, background: palette.bg, flexShrink: 0, overflow: 'hidden' }}>
        <card.Illo />
      </div>

      {/* Body */}
      <div style={{ padding: '10px 14px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>

        {/* Title */}
        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--black)', lineHeight: 1.3 }}>{card.title}</span>

        {/* Product footer */}
        <div style={{
          paddingTop: 8, borderTop: '1px solid var(--border)',
          fontSize: '0.625rem', fontWeight: 600, color: 'var(--muted)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontFamily: 'var(--font-mono, monospace)' }}>{card.product}</span>
          {hasLink && <span style={{ color: 'var(--mid)', fontSize: '0.75rem' }}>→</span>}
        </div>
      </div>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────────── */
export default function DocsPortal({ onNavigate }) {
  const [view, setView] = useState('catalogue'); // 'catalogue' | 'mosaic'
  const [activeTab, setActiveTab] = useState('Automotive');
  const sectionRefs = useRef({});
  const tabBarRef = useRef(null);

  // Update active tab based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      // offset = sticky tabbar top (app-top-offset ~102px) + tabbar height (~56px) + buffer
      const tabBarEl = tabBarRef.current;
      const stickyTop = tabBarEl ? (tabBarEl.getBoundingClientRect().bottom + 40) : 180;
      for (let i = TABS.length - 1; i >= 0; i--) {
        const el = sectionRefs.current[TABS[i].id];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= stickyTop) {
            setActiveTab(TABS[i].id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function scrollToSection(id) {
    setActiveTab(id);
    const el = sectionRefs.current[id];
    if (el) {
      const tabBarEl = tabBarRef.current;
      const offset = tabBarEl
        ? (tabBarEl.getBoundingClientRect().bottom - tabBarEl.getBoundingClientRect().top +
           (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--app-top-offset')) || 102) + 16)
        : 175;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  return (
    <div className="dp2-root">

      {/* ── Hero ── */}
      <section className="dp2-hero">
        <div
          className="dp2-hero-bg"
          style={{ backgroundImage: `url('${BASE}hero_background_globe.svg')` }}
        />
        <div className="dp2-hero-inner">
          {/* Left: heading + search */}
          <div className="dp2-hero-left">
            <h4 className="dp2-hero-heading">
              Start building with TomTom APIs, SDKs, and location technology.
            </h4>
            <div className="dp2-search-bar">
              <span className="dp2-search-icon"><SearchIcon /></span>
              <span className="dp2-search-placeholder">Search Documentation, API and SDKs</span>
            </div>
          </div>

          {/* Right: NavSDK banner */}
          <div className="dp2-hero-right">
            <div className="dp2-navsdk-wrap">
              <img src={`${BASE}navsdk_banner.png`} alt="NavSDK Banner" className="dp2-navsdk-img" />
              <div className="dp2-navsdk-card">
                <span className="dp2-navsdk-badge">NEW</span>
                <h2 className="dp2-navsdk-title">Try our latest Maps and Navigation SDK</h2>
                <div className="dp2-navsdk-sub">Get instant access to test our automotive-grade Maps and Navigation SDK</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mosaic view ── */}
      {view === 'mosaic' && <MosaicView onNavigate={onNavigate} view={view} setView={setView} />}

      {/* ── Catalogue view ── */}
      {view === 'catalogue' && <>

      {/* ── Sticky Tab Bar ── */}
      <div className="dp2-tabbar-wrap" ref={tabBarRef}>
        <div className="dp2-viewbar-inner">
          <ViewToggle view={view} setView={setView} />
          <div className="dp2-tabbar-pill">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`dp2-tab-btn${activeTab === tab.id ? ' dp2-tab-btn--active' : ''}`}
                onClick={() => scrollToSection(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Products ── */}
      <div className="dp2-block-container" id="products-section">
        {TABS.map(tab => (
          <div
            key={tab.id}
            className="dp2-section-group"
            ref={el => { sectionRefs.current[tab.id] = el; }}
            id={tab.id}
          >
            <h3 className="dp2-section-heading">
              <span className="dp2-section-icon">{SECTION_ICONS[tab.id]}</span>
              {tab.label}
            </h3>
            <div className="dp2-product-grid">
              {PRODUCTS[tab.id].map(p => (
                <ProductCard key={p.name} {...p} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        ))}

        {/* ── Tools ── */}
        <div className="dp2-tools-section">
          <h3 className="dp2-tools-heading" id="tools">Tools</h3>
          <p className="dp2-tools-sub">Giving you access to even more environments to craft maps for your unique needs.</p>
          <div className="dp2-tool-grid">
            {TOOLS.map(t => (
              <ToolCard key={t.name} {...t} />
            ))}
          </div>
        </div>

        {/* ── Resources ── */}
        <div className="dp2-resources-section">
          <div className="dp2-resource-grid">
            {RESOURCES.map(r => (
              <ResourceCard key={r.name} {...r} />
            ))}
            <TechSupportCard />
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="dp2-footer">
        <div className="dp2-footer-inner">
          <ul className="dp2-footer-row">
            {FOOTER_COL1.map(l => <li key={l}><a href="#" onClick={e => e.preventDefault()}>{l}</a></li>)}
          </ul>
          <ul className="dp2-footer-row">
            {FOOTER_COL2.map(l => <li key={l}><a href="#" onClick={e => e.preventDefault()}>{l}</a></li>)}
          </ul>
          <div className="dp2-footer-copy">Copyright © 2026 TomTom International BV. All rights reserved.</div>
        </div>
      </footer>

      </> /* end catalogue view */}

    </div>
  );
}
