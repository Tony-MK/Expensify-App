"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const react_native_onyx_1 = require("react-native-onyx");
const extractModuleDefaultExport_1 = require("@libs/extractModuleDefaultExport");
const LOCALES_1 = require("@src/CONST/LOCALES");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const flattenObject_1 = require("./flattenObject");
// This function was added here to avoid circular dependencies
function setAreTranslationsLoading(areTranslationsLoading) {
    // eslint-disable-next-line rulesdir/prefer-actions-set-data
    react_native_onyx_1.default.set(ONYXKEYS_1.default.ARE_TRANSLATIONS_LOADING, areTranslationsLoading);
}
class IntlStore {
    static getCurrentLocale() {
        return this.currentLocale;
    }
    static load(locale) {
        if (this.currentLocale === locale) {
            return Promise.resolve();
        }
        const loaderPromise = this.loaders[locale];
        setAreTranslationsLoading(true);
        return loaderPromise()
            .then(() => {
            this.currentLocale = locale;
            // Set the default date-fns locale
            const dateUtilsLocale = this.dateUtilsCache.get(locale);
            if (dateUtilsLocale) {
                (0, date_fns_1.setDefaultOptions)({ locale: dateUtilsLocale });
            }
        })
            .then(() => {
            setAreTranslationsLoading(false);
        });
    }
    static get(key, locale) {
        const localeToUse = locale && this.cache.has(locale) ? locale : this.currentLocale;
        if (!localeToUse) {
            return null;
        }
        const translations = this.cache.get(localeToUse);
        return translations?.[key] ?? null;
    }
}
_a = IntlStore;
IntlStore.currentLocale = undefined;
/**
 * Cache for translations
 */
IntlStore.cache = new Map();
/**
 * Cache for localized date-fns
 * @private
 */
IntlStore.dateUtilsCache = new Map();
/**
 * Set of loaders for each locale.
 * Note that this can't be trivially DRYed up because dynamic imports must use string literals in metro: https://github.com/facebook/metro/issues/52
 */
IntlStore.loaders = {
    [LOCALES_1.LOCALES.DE]: () => _a.cache.has(LOCALES_1.LOCALES.DE)
        ? Promise.all([Promise.resolve(), Promise.resolve()])
        : Promise.all([
            Promise.resolve().then(() => require('./de')).then((module) => {
                _a.cache.set(LOCALES_1.LOCALES.DE, (0, flattenObject_1.default)((0, extractModuleDefaultExport_1.default)(module)));
            }),
            Promise.resolve().then(() => require('date-fns/locale/de')).then((module) => {
                _a.dateUtilsCache.set(LOCALES_1.LOCALES.DE, module.de);
            }),
        ]),
    [LOCALES_1.LOCALES.EN]: () => _a.cache.has(LOCALES_1.LOCALES.EN)
        ? Promise.all([Promise.resolve(), Promise.resolve()])
        : Promise.all([
            Promise.resolve().then(() => require('./en')).then((module) => {
                _a.cache.set(LOCALES_1.LOCALES.EN, (0, flattenObject_1.default)((0, extractModuleDefaultExport_1.default)(module)));
            }),
            Promise.resolve().then(() => require('date-fns/locale/en-GB')).then((module) => {
                _a.dateUtilsCache.set(LOCALES_1.LOCALES.EN, module.enGB);
            }),
        ]),
    [LOCALES_1.LOCALES.ES]: () => _a.cache.has(LOCALES_1.LOCALES.ES)
        ? Promise.all([Promise.resolve(), Promise.resolve()])
        : Promise.all([
            Promise.resolve().then(() => require('./es')).then((module) => {
                _a.cache.set(LOCALES_1.LOCALES.ES, (0, flattenObject_1.default)((0, extractModuleDefaultExport_1.default)(module)));
            }),
            Promise.resolve().then(() => require('date-fns/locale/es')).then((module) => {
                _a.dateUtilsCache.set(LOCALES_1.LOCALES.ES, module.es);
            }),
        ]),
    [LOCALES_1.LOCALES.FR]: () => _a.cache.has(LOCALES_1.LOCALES.FR)
        ? Promise.all([Promise.resolve(), Promise.resolve()])
        : Promise.all([
            Promise.resolve().then(() => require('./fr')).then((module) => {
                _a.cache.set(LOCALES_1.LOCALES.FR, (0, flattenObject_1.default)((0, extractModuleDefaultExport_1.default)(module)));
            }),
            Promise.resolve().then(() => require('date-fns/locale/fr')).then((module) => {
                _a.dateUtilsCache.set(LOCALES_1.LOCALES.FR, module.fr);
            }),
        ]),
    [LOCALES_1.LOCALES.IT]: () => _a.cache.has(LOCALES_1.LOCALES.IT)
        ? Promise.all([Promise.resolve(), Promise.resolve()])
        : Promise.all([
            Promise.resolve().then(() => require('./it')).then((module) => {
                _a.cache.set(LOCALES_1.LOCALES.IT, (0, flattenObject_1.default)((0, extractModuleDefaultExport_1.default)(module)));
            }),
            Promise.resolve().then(() => require('date-fns/locale/it')).then((module) => {
                _a.dateUtilsCache.set(LOCALES_1.LOCALES.IT, module.it);
            }),
        ]),
    [LOCALES_1.LOCALES.JA]: () => _a.cache.has(LOCALES_1.LOCALES.JA)
        ? Promise.all([Promise.resolve(), Promise.resolve()])
        : Promise.all([
            Promise.resolve().then(() => require('./ja')).then((module) => {
                _a.cache.set(LOCALES_1.LOCALES.JA, (0, flattenObject_1.default)((0, extractModuleDefaultExport_1.default)(module)));
            }),
            Promise.resolve().then(() => require('date-fns/locale/ja')).then((module) => {
                _a.dateUtilsCache.set(LOCALES_1.LOCALES.JA, module.ja);
            }),
        ]),
    [LOCALES_1.LOCALES.NL]: () => _a.cache.has(LOCALES_1.LOCALES.NL)
        ? Promise.all([Promise.resolve(), Promise.resolve()])
        : Promise.all([
            Promise.resolve().then(() => require('./nl')).then((module) => {
                _a.cache.set(LOCALES_1.LOCALES.NL, (0, flattenObject_1.default)((0, extractModuleDefaultExport_1.default)(module)));
            }),
            Promise.resolve().then(() => require('date-fns/locale/nl')).then((module) => {
                _a.dateUtilsCache.set(LOCALES_1.LOCALES.NL, module.nl);
            }),
        ]),
    [LOCALES_1.LOCALES.PL]: () => _a.cache.has(LOCALES_1.LOCALES.PL)
        ? Promise.all([Promise.resolve(), Promise.resolve()])
        : Promise.all([
            Promise.resolve().then(() => require('./pl')).then((module) => {
                _a.cache.set(LOCALES_1.LOCALES.PL, (0, flattenObject_1.default)((0, extractModuleDefaultExport_1.default)(module)));
            }),
            Promise.resolve().then(() => require('date-fns/locale/pl')).then((module) => {
                _a.dateUtilsCache.set(LOCALES_1.LOCALES.PL, module.pl);
            }),
        ]),
    [LOCALES_1.LOCALES.PT_BR]: () => _a.cache.has(LOCALES_1.LOCALES.PT_BR)
        ? Promise.all([Promise.resolve(), Promise.resolve()])
        : Promise.all([
            Promise.resolve().then(() => require('./pt-BR')).then((module) => {
                _a.cache.set(LOCALES_1.LOCALES.PT_BR, (0, flattenObject_1.default)((0, extractModuleDefaultExport_1.default)(module)));
            }),
            Promise.resolve().then(() => require('date-fns/locale/pt-BR')).then((module) => {
                _a.dateUtilsCache.set(LOCALES_1.LOCALES.PT_BR, module.ptBR);
            }),
        ]),
    [LOCALES_1.LOCALES.ZH_HANS]: () => _a.cache.has(LOCALES_1.LOCALES.ZH_HANS)
        ? Promise.all([Promise.resolve(), Promise.resolve()])
        : Promise.all([
            Promise.resolve().then(() => require('./zh-hans')).then((module) => {
                _a.cache.set(LOCALES_1.LOCALES.ZH_HANS, (0, flattenObject_1.default)((0, extractModuleDefaultExport_1.default)(module)));
            }),
            Promise.resolve().then(() => require('date-fns/locale/zh-CN')).then((module) => {
                _a.dateUtilsCache.set(LOCALES_1.LOCALES.ZH_HANS, module.zhCN);
            }),
        ]),
};
exports.default = IntlStore;
