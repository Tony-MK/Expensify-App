"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LOCALES_1 = require("@src/CONST/LOCALES");
const flattenObject_1 = require("@src/languages/flattenObject");
class IntlStore {
    static getCurrentLocale() {
        return this.currentLocale;
    }
    static load() {
        return Promise.resolve();
    }
    static get(key, locale) {
        const localeToUse = locale && this.localeCache.has(locale) ? locale : this.currentLocale;
        if (!localeToUse) {
            return null;
        }
        const translations = this.localeCache.get(localeToUse);
        return translations?.[key] ?? null;
    }
}
IntlStore.currentLocale = 'en';
IntlStore.localeCache = new Map([
    [
        LOCALES_1.LOCALES.EN,
        (0, flattenObject_1.default)({
            testKey1: 'English',
            testKey2: 'Test Word 2',
            testKeyGroup: {
                testFunction: ({ testVariable }) => `With variable ${testVariable}`,
            },
            pluralizationGroup: {
                countWithoutPluralRules: ({ count }) => `Count value is ${count}`,
                countWithNoCorrespondingRule: ({ count }) => ({
                    one: 'One file is being downloaded.',
                    other: `Other ${count} files are being downloaded.`,
                }),
            },
        }),
    ],
    [
        LOCALES_1.LOCALES.ES,
        (0, flattenObject_1.default)({
            testKey1: 'Spanish',
            testKey2: 'Spanish Word 2',
            pluralizationGroup: {
                couthWithCorrespondingRule: ({ count }) => ({
                    one: 'Un artículo',
                    other: `${count} artículos`,
                }),
            },
        }),
    ],
]);
IntlStore.loaders = {
    [LOCALES_1.LOCALES.EN]: () => {
        return Promise.all([Promise.resolve(), Promise.resolve()]);
    },
    [LOCALES_1.LOCALES.ES]: () => {
        return Promise.all([Promise.resolve(), Promise.resolve()]);
    },
};
exports.default = IntlStore;
