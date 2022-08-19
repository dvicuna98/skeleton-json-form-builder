import Vue from 'vue';
import VueI18n from 'vue-i18n';


Vue.use(VueI18n);

const englishTranslate = require('../languages/en.json');
const spanishTranslate = require('../languages/es.json');
const messages = { 'en': englishTranslate, 'es': spanishTranslate };
const i18n = new VueI18n({ locale: 'es', fallbackLocale: 'en', messages, });

export default i18n;