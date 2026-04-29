import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon   from './locales/en/common.json';
import zhCommon   from './locales/zh/common.json';
import enOverview from './locales/en/overview.json';
import zhOverview from './locales/zh/overview.json';
import enEv       from './locales/en/ev.json';
import zhEv       from './locales/zh/ev.json';
import enAi       from './locales/en/ai.json';
import zhAi       from './locales/zh/ai.json';
import enPages    from './locales/en/pages.json';
import zhPages    from './locales/zh/pages.json';

const savedLang = typeof localStorage !== 'undefined'
  ? (localStorage.getItem('ux-lang') || 'en')
  : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: enCommon, overview: enOverview, ev: enEv, ai: enAi, pages: enPages },
      zh: { common: zhCommon, overview: zhOverview, ev: zhEv, ai: zhAi, pages: zhPages },
    },
    lng: savedLang,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'overview', 'ev', 'ai', 'pages'],
    interpolation: { escapeValue: false },
  });

export default i18n;
