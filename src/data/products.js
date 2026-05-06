import { UX_LIBRARY_NAV, UX_LIBRARY_PAGE_TITLES } from './nav-ux-library';
import { NAVSDK_NAV, NAVSDK_PAGE_TITLES } from './nav-navsdk';
import { ANA_NAV, ANA_PAGE_TITLES } from './nav-ana';
import { ROUTING_API_NAV, ROUTING_API_PAGE_TITLES } from './nav-routing-api';
import { LDEVR_NAV, LDEVR_PAGE_TITLES } from './nav-ldevr';
import { MATRIX_NAV, MATRIX_PAGE_TITLES } from './nav-matrix';
import { WAYPOINT_NAV, WAYPOINT_PAGE_TITLES } from './nav-waypoint';

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
    pageTitles: NAVSDK_PAGE_TITLES,
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
    platforms: ['tomtom-maps', 'orbis-maps'],
    platformLabels: { 'tomtom-maps': 'TomTom Maps', 'orbis-maps': 'Orbis Maps' },
    defaultPlatform: 'tomtom-maps',
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
