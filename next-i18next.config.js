/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ph'],
  },
  fallbackLng: {
    default: ['en'],
  },
  localePath: path.resolve('./public/locales'),
  localeStructure: '{{lng}}/{{ns}}',
};
