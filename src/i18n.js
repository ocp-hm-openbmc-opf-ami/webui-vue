import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

function loadLocaleMessages() {
  const locales = require.context(
    './locales',
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  );
  const messages = {};
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
}
function fallbackLanguage() {
  const locales = require.context(
    './locales',
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  );
  let languages = locales.keys().map((locale) => {
    return locale.split('.')[1].slice(1);
  });
  if (process.env.VUE_APP_CHINESE_ZH_CN_LANGUAGE_SUPPORT != 'true') {
    languages.splice(languages.indexOf('zh-CN'), 1);
  }
  if (process.env.VUE_APP_TAIWAN_ZH_TW_LANGUAGE_SUPPORT != 'true') {
    languages.splice(languages.indexOf('zh-TW'), 1);
  }
  if (process.env.VUE_APP_GERMAN_DE_LANGUAGE_SUPPORT != 'true') {
    languages.splice(languages.indexOf('de-DE'), 1);
  }
  let language = null;
  languages.forEach((lang) => {
    if (lang == navigator.language) {
      language = lang;
    }
  });
  return language ? language : 'en-US';
}

export default new VueI18n({
  // Get default locale from local storage
  locale: window.localStorage.getItem('storedLanguage')
    ? window.localStorage.getItem('storedLanguage')
    : fallbackLanguage(),
  // Locales that don't exist will fallback to English
  fallbackLocale: 'en-US',
  // Falling back to fallbackLocale generates two console warnings
  // Silent fallback suppresses console warnings when using fallback
  silentFallbackWarn: true,
  messages: loadLocaleMessages(),
});
