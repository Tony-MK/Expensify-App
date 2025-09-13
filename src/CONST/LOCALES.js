"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRANSLATION_TARGET_LOCALES = exports.SORTED_LOCALES = exports.LOCALE_TO_LANGUAGE_STRING = exports.LOCALES = exports.FULLY_SUPPORTED_LOCALES = exports.EXTENDED_LOCALES = exports.BETA_LOCALES = void 0;
exports.isSupportedLocale = isSupportedLocale;
exports.isFullySupportedLocale = isFullySupportedLocale;
exports.isTranslationTargetLocale = isTranslationTargetLocale;
/**
 * These locales are fully supported.
 */
const FULLY_SUPPORTED_LOCALES = {
    EN: 'en',
    ES: 'es',
};
exports.FULLY_SUPPORTED_LOCALES = FULLY_SUPPORTED_LOCALES;
/**
 * These are newly-added locales that aren't yet fully supported. i.e:
 *
 * - No emoji keyword support
 * - Unaudited translations
 */
const BETA_LOCALES = {
    DE: 'de',
    FR: 'fr',
    IT: 'it',
    JA: 'ja',
    NL: 'nl',
    PL: 'pl',
    PT_BR: 'pt-BR',
    ZH_HANS: 'zh-hans',
};
exports.BETA_LOCALES = BETA_LOCALES;
/**
 * These are additional locales that are not valid values of the preferredLocale NVP.
 */
const EXTENDED_LOCALES = {
    ES_ES_ONFIDO: 'es_ES',
};
exports.EXTENDED_LOCALES = EXTENDED_LOCALES;
/**
 * Locales that are valid values of the preferredLocale NVP.
 */
const LOCALES = {
    DEFAULT: FULLY_SUPPORTED_LOCALES.EN,
    ...FULLY_SUPPORTED_LOCALES,
    ...BETA_LOCALES,
};
exports.LOCALES = LOCALES;
/**
 * Locales that are valid translation targets. This does not include English, because it's used as the source of truth.
 */
const { DEFAULT, EN, ...TRANSLATION_TARGET_LOCALES } = { ...LOCALES };
exports.TRANSLATION_TARGET_LOCALES = TRANSLATION_TARGET_LOCALES;
/**
 * These strings are never translated.
 */
const LOCALE_TO_LANGUAGE_STRING = {
    [FULLY_SUPPORTED_LOCALES.EN]: 'English',
    [FULLY_SUPPORTED_LOCALES.ES]: 'Español',
    [BETA_LOCALES.DE]: 'Deutsch',
    [BETA_LOCALES.FR]: 'Français',
    [BETA_LOCALES.IT]: 'Italiano',
    [BETA_LOCALES.JA]: '日本語',
    [BETA_LOCALES.NL]: 'Nederlands',
    [BETA_LOCALES.PL]: 'Polski',
    [BETA_LOCALES.PT_BR]: 'Português (BR)',
    [BETA_LOCALES.ZH_HANS]: '中文 (简体)',
};
exports.LOCALE_TO_LANGUAGE_STRING = LOCALE_TO_LANGUAGE_STRING;
// Sort all locales alphabetically by their display names
const SORTED_LOCALES = Object.values({ ...FULLY_SUPPORTED_LOCALES, ...BETA_LOCALES }).sort((a, b) => LOCALE_TO_LANGUAGE_STRING[a].localeCompare(LOCALE_TO_LANGUAGE_STRING[b]));
exports.SORTED_LOCALES = SORTED_LOCALES;
function isSupportedLocale(locale) {
    return Object.values(LOCALES).includes(locale);
}
function isFullySupportedLocale(locale) {
    return Object.values(FULLY_SUPPORTED_LOCALES).includes(locale);
}
function isTranslationTargetLocale(locale) {
    return Object.values(TRANSLATION_TARGET_LOCALES).includes(locale);
}
