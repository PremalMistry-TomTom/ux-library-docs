import { UX_LIBRARY_NAV, UX_LIBRARY_PAGE_TITLES } from './nav-ux-library';
import { NAVSDK_NAV, NAVSDK_PAGE_TITLES, NAVSDK_IOS_NAV, NAVSDK_IOS_PAGE_TITLES } from './nav-navsdk';
import { ANA_NAV, ANA_PAGE_TITLES } from './nav-ana';
import { ROUTING_API_NAV_B as ROUTING_API_NAV, ROUTING_API_PAGE_TITLES } from './nav-routing-api';
import { LDEVR_NAV_B as LDEVR_NAV, LDEVR_PAGE_TITLES } from './nav-ldevr';
import { MATRIX_NAV, MATRIX_PAGE_TITLES } from './nav-matrix';
import { WAYPOINT_NAV, WAYPOINT_PAGE_TITLES } from './nav-waypoint';
import { SEARCH_API_NAV_B as SEARCH_API_NAV, SEARCH_API_PAGE_TITLES } from './nav-search-api';
import { GEOCODING_API_NAV_B as GEOCODING_API_NAV, GEOCODING_API_PAGE_TITLES } from './nav-geocoding-api';
import { TRAFFIC_API_NAV_B as TRAFFIC_API_NAV, TRAFFIC_API_PAGE_TITLES } from './nav-traffic-api';
import { EV_CHARGING_API_NAV_B as EV_CHARGING_API_NAV, EV_CHARGING_API_PAGE_TITLES } from './nav-ev-charging-api';
import { MAP_DISPLAY_API_NAV_B as MAP_DISPLAY_API_NAV, MAP_DISPLAY_API_PAGE_TITLES } from './nav-map-display-api';
import { PARKING_FUEL_API_NAV, PARKING_FUEL_API_PAGE_TITLES } from './nav-parking-fuel-api';
import { TRAFFIC_ANALYTICS_API_NAV, TRAFFIC_ANALYTICS_API_PAGE_TITLES } from './nav-traffic-analytics-api';
import { SNAP_TO_ROADS_API_NAV, SNAP_TO_ROADS_API_PAGE_TITLES } from './nav-snap-to-roads-api';

export const PRODUCTS = {
  'ux-library': {
    id: 'ux-library',
    name: 'UX Library',
    nameZh: 'UX 组件库',
    defaultPage: 'overview',
    nav: UX_LIBRARY_NAV,
    pageTitles: UX_LIBRARY_PAGE_TITLES,
  },
  'navsdk': {
    id: 'navsdk',
    name: 'Maps & Navigation SDK',
    nameZh: '地图与导航 SDK',
    defaultPage: 'navsdk-intro',
    platforms: ['android', 'ios'],
    defaultPlatform: 'android',
    nav: NAVSDK_NAV,
    iosNav: NAVSDK_IOS_NAV,
    pageTitles: NAVSDK_PAGE_TITLES,
    iosPageTitles: NAVSDK_IOS_PAGE_TITLES,
  },
  'ana': {
    id: 'ana',
    name: 'Automotive Navigation Application',
    nameZh: '车载导航应用',
    defaultPage: 'ana-intro',
    nav: ANA_NAV,
    pageTitles: ANA_PAGE_TITLES,
  },
  'routing-api': {
    id: 'routing-api',
    name: 'Routing API',
    defaultPage: 'routing-api-intro',
    nav: ROUTING_API_NAV,
    pageTitles: ROUTING_API_PAGE_TITLES,
  },
  'ldevr': {
    id: 'ldevr',
    name: 'Long Distance EV Routing API',
    defaultPage: 'ldevr-intro',
    nav: LDEVR_NAV,
    pageTitles: LDEVR_PAGE_TITLES,
  },
  'matrix-routing': {
    id: 'matrix-routing',
    name: 'Matrix Routing v2 API',
    defaultPage: 'matrix-intro',
    nav: MATRIX_NAV,
    pageTitles: MATRIX_PAGE_TITLES,
  },
  'waypoint-opt': {
    id: 'waypoint-opt',
    name: 'Waypoint Optimization API',
    defaultPage: 'waypoint-intro',
    nav: WAYPOINT_NAV,
    pageTitles: WAYPOINT_PAGE_TITLES,
  },
  'search-api': {
    id: 'search-api',
    name: 'Search API',
    defaultPage: 'search-api-intro',
    nav: SEARCH_API_NAV,
    pageTitles: SEARCH_API_PAGE_TITLES,
  },
  'geocoding-api': {
    id: 'geocoding-api',
    name: 'Geocoding API',
    defaultPage: 'geocoding-api-intro',
    nav: GEOCODING_API_NAV,
    pageTitles: GEOCODING_API_PAGE_TITLES,
  },
  'traffic-api': {
    id: 'traffic-api',
    name: 'Traffic API',
    defaultPage: 'traffic-api-intro',
    nav: TRAFFIC_API_NAV,
    pageTitles: TRAFFIC_API_PAGE_TITLES,
  },
  'ev-charging-api': {
    id: 'ev-charging-api',
    name: 'EV & Charging API',
    defaultPage: 'ev-charging-api-intro',
    nav: EV_CHARGING_API_NAV,
    pageTitles: EV_CHARGING_API_PAGE_TITLES,
  },
  'map-display-api': {
    id: 'map-display-api',
    name: 'Map Display API',
    defaultPage: 'map-display-api-intro',
    nav: MAP_DISPLAY_API_NAV,
    pageTitles: MAP_DISPLAY_API_PAGE_TITLES,
  },
  'parking-fuel-api': {
    id: 'parking-fuel-api',
    name: 'Parking & Fuel API',
    defaultPage: 'parking-fuel-api-intro',
    nav: PARKING_FUEL_API_NAV,
    pageTitles: PARKING_FUEL_API_PAGE_TITLES,
  },
  'traffic-analytics-api': {
    id: 'traffic-analytics-api',
    name: 'Traffic Analytics API',
    defaultPage: 'traffic-analytics-api-intro',
    nav: TRAFFIC_ANALYTICS_API_NAV,
    pageTitles: TRAFFIC_ANALYTICS_API_PAGE_TITLES,
  },
  'snap-to-roads-api': {
    id: 'snap-to-roads-api',
    name: 'Snap to Roads API',
    defaultPage: 'snap-to-roads-api-intro',
    nav: SNAP_TO_ROADS_API_NAV,
    pageTitles: SNAP_TO_ROADS_API_PAGE_TITLES,
  },
};

export function getProduct(productId) {
  return PRODUCTS[productId] ?? PRODUCTS['ux-library'];
}

export function getPageContext(pageId, nav) {
  for (const entry of nav) {
    if (entry.type === 'group' && entry.landingId === pageId) {
      return { type: 'landing', groupKey: entry.key, groupLabel: entry.label };
    }
  }
  for (const entry of nav) {
    if (entry.items) {
      const item = entry.items.find(i => i.id === pageId);
      if (item) {
        return {
          type: 'page',
          groupKey: entry.key,
          groupLabel: entry.label,
          landingId: entry.landingId || null,
        };
      }
    }
  }
  return { type: 'top', groupKey: null, groupLabel: null, landingId: null };
}
