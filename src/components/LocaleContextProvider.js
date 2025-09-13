"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocaleContext = void 0;
exports.LocaleContextProvider = LocaleContextProvider;
const react_1 = require("react");
const emojis_1 = require("@assets/emojis");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useOnyx_1 = require("@hooks/useOnyx");
const DateUtils_1 = require("@libs/DateUtils");
const EmojiTrie_1 = require("@libs/EmojiTrie");
const LocaleDigitUtils_1 = require("@libs/LocaleDigitUtils");
const LocalePhoneNumber_1 = require("@libs/LocalePhoneNumber");
const Localize_1 = require("@libs/Localize");
const localeEventCallback_1 = require("@libs/Localize/localeEventCallback");
const NumberFormatUtils_1 = require("@libs/NumberFormatUtils");
const App_1 = require("@userActions/App");
const CONST_1 = require("@src/CONST");
const LOCALES_1 = require("@src/CONST/LOCALES");
const IntlStore_1 = require("@src/languages/IntlStore");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const LocaleContext = (0, react_1.createContext)({
    translate: () => '',
    numberFormat: () => '',
    getLocalDateFromDatetime: () => new Date(),
    datetimeToRelative: () => '',
    datetimeToCalendarTime: () => '',
    formatPhoneNumber: () => '',
    toLocaleDigit: () => '',
    toLocaleOrdinal: () => '',
    fromLocaleDigit: () => '',
    localeCompare: () => 0,
    preferredLocale: undefined,
});
exports.LocaleContext = LocaleContext;
const COLLATOR_OPTIONS = { usage: 'sort', sensitivity: 'variant', numeric: true, caseFirst: 'upper' };
function LocaleContextProvider({ children }) {
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const [areTranslationsLoading = true] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ARE_TRANSLATIONS_LOADING, { initWithStoredValues: false, canBeMissing: true });
    const [countryCodeByIP = 1] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COUNTRY_CODE, { canBeMissing: true });
    const [nvpPreferredLocale, nvpPreferredLocaleMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_PREFERRED_LOCALE, { canBeMissing: true });
    const [currentLocale, setCurrentLocale] = (0, react_1.useState)(() => IntlStore_1.default.getCurrentLocale());
    const localeToApply = (0, react_1.useMemo)(() => {
        if ((0, isLoadingOnyxValue_1.default)(nvpPreferredLocaleMetadata)) {
            return undefined;
        }
        if (nvpPreferredLocale && (0, LOCALES_1.isSupportedLocale)(nvpPreferredLocale)) {
            return nvpPreferredLocale;
        }
        const deviceLocale = (0, Localize_1.getDevicePreferredLocale)();
        return (0, LOCALES_1.isSupportedLocale)(deviceLocale) ? deviceLocale : CONST_1.default.LOCALES.DEFAULT;
    }, [nvpPreferredLocale, nvpPreferredLocaleMetadata]);
    (0, react_1.useEffect)(() => {
        if (!localeToApply) {
            return;
        }
        (0, App_1.setLocale)(localeToApply, nvpPreferredLocale);
        IntlStore_1.default.load(localeToApply);
        (0, localeEventCallback_1.default)(localeToApply);
        // For locales without emoji support, fallback on English
        const normalizedLocale = (0, LOCALES_1.isFullySupportedLocale)(localeToApply) ? localeToApply : CONST_1.default.LOCALES.DEFAULT;
        (0, emojis_1.importEmojiLocale)(normalizedLocale).then(() => {
            (0, EmojiTrie_1.buildEmojisTrie)(normalizedLocale);
        });
    }, [localeToApply, nvpPreferredLocale]);
    (0, react_1.useEffect)(() => {
        if (areTranslationsLoading) {
            return;
        }
        const locale = IntlStore_1.default.getCurrentLocale();
        if (!locale) {
            return;
        }
        setCurrentLocale(locale);
    }, [areTranslationsLoading]);
    const selectedTimezone = (0, react_1.useMemo)(() => currentUserPersonalDetails?.timezone?.selected, [currentUserPersonalDetails]);
    const collator = (0, react_1.useMemo)(() => new Intl.Collator(currentLocale, COLLATOR_OPTIONS), [currentLocale]);
    const translate = (0, react_1.useMemo)(() => (path, ...parameters) => (0, Localize_1.translate)(currentLocale, path, ...parameters), [currentLocale]);
    const numberFormat = (0, react_1.useMemo)(() => (number, options) => (0, NumberFormatUtils_1.format)(currentLocale, number, options), [currentLocale]);
    const getLocalDateFromDatetime = (0, react_1.useMemo)(() => (datetime, currentSelectedTimezone) => DateUtils_1.default.getLocalDateFromDatetime(currentLocale, currentSelectedTimezone ?? selectedTimezone ?? CONST_1.default.DEFAULT_TIME_ZONE.selected, datetime), [currentLocale, selectedTimezone]);
    const datetimeToRelative = (0, react_1.useMemo)(() => (datetime) => DateUtils_1.default.datetimeToRelative(currentLocale, datetime, selectedTimezone ?? CONST_1.default.DEFAULT_TIME_ZONE.selected), [currentLocale, selectedTimezone]);
    const datetimeToCalendarTime = (0, react_1.useMemo)(() => (datetime, includeTimezone, isLowercase = false) => DateUtils_1.default.datetimeToCalendarTime(currentLocale, datetime, selectedTimezone ?? CONST_1.default.DEFAULT_TIME_ZONE.selected, includeTimezone, isLowercase), [currentLocale, selectedTimezone]);
    const formatPhoneNumber = (0, react_1.useMemo)(() => (phoneNumber) => (0, LocalePhoneNumber_1.formatPhoneNumberWithCountryCode)(phoneNumber, countryCodeByIP), [countryCodeByIP]);
    const toLocaleDigit = (0, react_1.useMemo)(() => (digit) => (0, LocaleDigitUtils_1.toLocaleDigit)(currentLocale, digit), [currentLocale]);
    const toLocaleOrdinal = (0, react_1.useMemo)(() => (number, writtenOrdinals = false) => (0, LocaleDigitUtils_1.toLocaleOrdinal)(currentLocale, number, writtenOrdinals), [currentLocale]);
    const fromLocaleDigit = (0, react_1.useMemo)(() => (localeDigit) => (0, LocaleDigitUtils_1.fromLocaleDigit)(currentLocale, localeDigit), [currentLocale]);
    const localeCompare = (0, react_1.useMemo)(() => (a, b) => collator.compare(a, b), [collator]);
    const contextValue = (0, react_1.useMemo)(() => ({
        translate,
        numberFormat,
        getLocalDateFromDatetime,
        datetimeToRelative,
        datetimeToCalendarTime,
        formatPhoneNumber,
        toLocaleDigit,
        toLocaleOrdinal,
        fromLocaleDigit,
        localeCompare,
        preferredLocale: currentLocale,
    }), [
        translate,
        numberFormat,
        getLocalDateFromDatetime,
        datetimeToRelative,
        datetimeToCalendarTime,
        formatPhoneNumber,
        toLocaleDigit,
        toLocaleOrdinal,
        fromLocaleDigit,
        localeCompare,
        currentLocale,
    ]);
    return <LocaleContext.Provider value={contextValue}>{children}</LocaleContext.Provider>;
}
LocaleContextProvider.displayName = 'LocaleContextProvider';
