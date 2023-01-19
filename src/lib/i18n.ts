import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .use(
    Backend
    // resourcesToBackend(
    //   (language: string, namespace: string) =>
    //     import(`./locales/${language}/${namespace}.json`)
    // )
  )
  .init({
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
