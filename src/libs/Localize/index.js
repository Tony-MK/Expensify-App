"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translate = translate;
exports.translateLocal = translateLocal;
exports.formatList = formatList;
exports.formatMessageElementList = formatMessageElementList;
exports.getDevicePreferredLocale = getDevicePreferredLocale;
const RNLocalize = require("react-native-localize");
const react_native_onyx_1 = require("react-native-onyx");
const Log_1 = require("@libs/Log");
const memoize_1 = require("@libs/memoize");
const CONFIG_1 = require("@src/CONFIG");
const CONST_1 = require("@src/CONST");
const IntlStore_1 = require("@src/languages/IntlStore");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
// Current user mail is needed for handling missing translations
let userEmail = '';
// TODO: Remove this Onyx.connectWithoutView after deprecating translateLocal (#64943) and completing Onyx.connect deprecation - see https://github.com/Expensify/App/issues/66329
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.SESSION,
    callback: (val) => {
        if (!val) {
            return;
        }
        userEmail = val?.email ?? '';
    },
});
// Note: This has to be initialized inside a function and not at the top level of the file, because Intl is polyfilled,
// and if React Native executes this code upon import, then the polyfill will not be available yet and it will barf
let CONJUNCTION_LIST_FORMATS_FOR_LOCALES;
function init() {
    CONJUNCTION_LIST_FORMATS_FOR_LOCALES = Object.values(CONST_1.default.LOCALES).reduce((memo, locale) => {
        // eslint-disable-next-line no-param-reassign
        memo[locale] = new Intl.ListFormat(locale, { style: 'long', type: 'conjunction' });
        return memo;
    }, {});
}
// Memoized function to create PluralRules instances
const createPluralRules = (locale) => new Intl.PluralRules(locale);
const memoizedCreatePluralRules = (0, memoize_1.default)(createPluralRules);
/**
 * Helper function to get the translated string for given
 * locale and phrase. This function is used to avoid
 * duplicate code in getTranslatedPhrase and translate functions.
 *
 * This function first checks if the phrase is already translated
 * and in the cache, it returns the translated value from the cache.
 *
 * If the phrase is not translated, it checks if the phrase is
 * available in the given locale. If it is, it translates the
 * phrase and stores the translated value in the cache and returns
 * the translated value.
 */
function getTranslatedPhrase(language, phraseKey, ...parameters) {
    const translatedPhrase = IntlStore_1.default.get(phraseKey, language);
    if (translatedPhrase) {
        if (typeof translatedPhrase === 'function') {
            /**
             * If the result of `translatedPhrase` is an object, check if it contains the 'count' parameter
             * to handle pluralization logic.
             * Alternatively, before evaluating the translated result, we can check if the 'count' parameter
             * exists in the passed parameters.
             */
            const translateFunction = translatedPhrase;
            const translateResult = translateFunction(...parameters);
            if (typeof translateResult === 'string') {
                return translateResult;
            }
            const phraseObject = parameters[0];
            if (typeof phraseObject?.count !== 'number') {
                throw new Error(`Invalid plural form for '${phraseKey}'`);
            }
            const pluralRule = memoizedCreatePluralRules(language).select(phraseObject.count);
            const pluralResult = translateResult[pluralRule];
            if (pluralResult) {
                if (typeof pluralResult === 'string') {
                    return pluralResult;
                }
                return pluralResult(phraseObject.count);
            }
            if (typeof translateResult.other === 'string') {
                return translateResult.other;
            }
            return translateResult.other(phraseObject.count);
        }
        return translatedPhrase;
    }
    Log_1.default.alert(`${phraseKey} was not found in the ${language} locale`);
    return null;
}
const memoizedGetTranslatedPhrase = (0, memoize_1.default)(getTranslatedPhrase, {
    maxArgs: 2,
    equality: 'shallow',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    skipCache: (params) => !(0, EmptyObject_1.isEmptyObject)(params.at(2)),
});
/**
 * Return translated string for given locale and phrase
 *
 * @param [locale] eg 'en', 'es'
 * @param [parameters] Parameters to supply if the phrase is a template literal.
 */
function translate(locale, path, ...parameters) {
    if (!locale) {
        // If no language is provided, return the path as is
        return Array.isArray(path) ? path.join('.') : path;
    }
    const translatedPhrase = memoizedGetTranslatedPhrase(locale, path, ...parameters);
    if (translatedPhrase !== null && translatedPhrase !== undefined) {
        return translatedPhrase;
    }
    // Phrase is not found in default language, on production and staging log an alert to server
    // on development throw an error
    if (CONFIG_1.default.IS_IN_PRODUCTION || CONFIG_1.default.IS_IN_STAGING) {
        const phraseString = Array.isArray(path) ? path.join('.') : path;
        Log_1.default.alert(`${phraseString} was not found in the ${locale} locale`);
        if (userEmail.includes(CONST_1.default.EMAIL.EXPENSIFY_EMAIL_DOMAIN)) {
            return CONST_1.default.MISSING_TRANSLATION;
        }
        return phraseString;
    }
    throw new Error(`${path} was not found in the ${locale} locale`);
}
/**
 * Uses the locale in this file updated by the Onyx subscriber.
 */
function translateLocal(phrase, ...parameters) {
    const currentLocale = IntlStore_1.default.getCurrentLocale();
    return translate(currentLocale, phrase, ...parameters);
}
function getPreferredListFormat() {
    if (!CONJUNCTION_LIST_FORMATS_FOR_LOCALES) {
        init();
    }
    return CONJUNCTION_LIST_FORMATS_FOR_LOCALES[IntlStore_1.default.getCurrentLocale() ?? CONST_1.default.LOCALES.DEFAULT];
}
/**
 * Format an array into a string with comma and "and" ("a dog, a cat and a chicken")
 */
function formatList(components) {
    const listFormat = getPreferredListFormat();
    return listFormat.format(components);
}
function formatMessageElementList(elements) {
    const listFormat = getPreferredListFormat();
    const parts = listFormat.formatToParts(elements.map((e) => e.content));
    const resultElements = [];
    let nextElementIndex = 0;
    for (const part of parts) {
        if (part.type === 'element') {
            /**
             * The standard guarantees that all input elements will be present in the constructed parts, each exactly
             * once, and without any modifications: https://tc39.es/ecma402/#sec-createpartsfromlist
             */
            const element = elements[nextElementIndex++];
            resultElements.push(element);
        }
        else {
            const literalElement = {
                kind: 'text',
                content: part.value,
            };
            resultElements.push(literalElement);
        }
    }
    return resultElements;
}
/**
 * Returns the user device's preferred language.
 */
function getDevicePreferredLocale() {
    return RNLocalize.findBestAvailableLanguage(Object.values(CONST_1.default.LOCALES))?.languageTag ?? CONST_1.default.LOCALES.DEFAULT;
}
