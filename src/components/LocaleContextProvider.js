"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocaleContext = void 0;
exports.LocaleContextProvider = LocaleContextProvider;
var react_1 = require("react");
var emojis_1 = require("@assets/emojis");
var useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
var useOnyx_1 = require("@hooks/useOnyx");
var DateUtils_1 = require("@libs/DateUtils");
var EmojiTrie_1 = require("@libs/EmojiTrie");
var LocaleDigitUtils_1 = require("@libs/LocaleDigitUtils");
var LocalePhoneNumber_1 = require("@libs/LocalePhoneNumber");
var Localize_1 = require("@libs/Localize");
var localeEventCallback_1 = require("@libs/Localize/localeEventCallback");
var NumberFormatUtils_1 = require("@libs/NumberFormatUtils");
var App_1 = require("@userActions/App");
var CONST_1 = require("@src/CONST");
var LOCALES_1 = require("@src/CONST/LOCALES");
var IntlStore_1 = require("@src/languages/IntlStore");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
var LocaleContext = (0, react_1.createContext)({
    translate: function () { return ''; },
    numberFormat: function () { return ''; },
    getLocalDateFromDatetime: function () { return new Date(); },
    datetimeToRelative: function () { return ''; },
    datetimeToCalendarTime: function () { return ''; },
    formatPhoneNumber: function () { return ''; },
    toLocaleDigit: function () { return ''; },
    toLocaleOrdinal: function () { return ''; },
    fromLocaleDigit: function () { return ''; },
    localeCompare: function () { return 0; },
    preferredLocale: undefined,
});
exports.LocaleContext = LocaleContext;
var COLLATOR_OPTIONS = { usage: 'sort', sensitivity: 'variant', numeric: true, caseFirst: 'upper' };
function LocaleContextProvider(_a) {
    var children = _a.children;
    var currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    var _b = (0, useOnyx_1.default)(ONYXKEYS_1.default.ARE_TRANSLATIONS_LOADING, { initWithStoredValues: false, canBeMissing: true })[0], areTranslationsLoading = _b === void 0 ? true : _b;
    var _c = (0, useOnyx_1.default)(ONYXKEYS_1.default.COUNTRY_CODE, { canBeMissing: true })[0], countryCodeByIP = _c === void 0 ? 1 : _c;
    var _d = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_PREFERRED_LOCALE, { canBeMissing: true }), nvpPreferredLocale = _d[0], nvpPreferredLocaleMetadata = _d[1];
    var _e = (0, react_1.useState)(function () { return IntlStore_1.default.getCurrentLocale(); }), currentLocale = _e[0], setCurrentLocale = _e[1];
    var localeToApply = (0, react_1.useMemo)(function () {
        if ((0, isLoadingOnyxValue_1.default)(nvpPreferredLocaleMetadata)) {
            return undefined;
        }
        if (nvpPreferredLocale && (0, LOCALES_1.isSupportedLocale)(nvpPreferredLocale)) {
            return nvpPreferredLocale;
        }
        var deviceLocale = (0, Localize_1.getDevicePreferredLocale)();
        return (0, LOCALES_1.isSupportedLocale)(deviceLocale) ? deviceLocale : CONST_1.default.LOCALES.DEFAULT;
    }, [nvpPreferredLocale, nvpPreferredLocaleMetadata]);
    (0, react_1.useEffect)(function () {
        if (!localeToApply) {
            return;
        }
        (0, App_1.setLocale)(localeToApply, nvpPreferredLocale);
        IntlStore_1.default.load(localeToApply);
        (0, localeEventCallback_1.default)(localeToApply);
        // For locales without emoji support, fallback on English
        var normalizedLocale = (0, LOCALES_1.isFullySupportedLocale)(localeToApply) ? localeToApply : CONST_1.default.LOCALES.DEFAULT;
        (0, emojis_1.importEmojiLocale)(normalizedLocale).then(function () {
            (0, EmojiTrie_1.buildEmojisTrie)(normalizedLocale);
        });
    }, [localeToApply, nvpPreferredLocale]);
    (0, react_1.useEffect)(function () {
        if (areTranslationsLoading) {
            return;
        }
        var locale = IntlStore_1.default.getCurrentLocale();
        if (!locale) {
            return;
        }
        setCurrentLocale(locale);
    }, [areTranslationsLoading]);
    var selectedTimezone = (0, react_1.useMemo)(function () { var _a; return (_a = currentUserPersonalDetails === null || currentUserPersonalDetails === void 0 ? void 0 : currentUserPersonalDetails.timezone) === null || _a === void 0 ? void 0 : _a.selected; }, [currentUserPersonalDetails]);
    var collator = (0, react_1.useMemo)(function () { return new Intl.Collator(currentLocale, COLLATOR_OPTIONS); }, [currentLocale]);
    var translate = (0, react_1.useMemo)(function () {
        return function (path) {
            var parameters = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                parameters[_i - 1] = arguments[_i];
            }
            return Localize_1.translate.apply(void 0, __spreadArray([currentLocale, path], parameters, false));
        };
    }, [currentLocale]);
    var numberFormat = (0, react_1.useMemo)(function () { return function (number, options) { return (0, NumberFormatUtils_1.format)(currentLocale, number, options); }; }, [currentLocale]);
    var getLocalDateFromDatetime = (0, react_1.useMemo)(function () { return function (datetime, currentSelectedTimezone) { var _a; return DateUtils_1.default.getLocalDateFromDatetime(currentLocale, (_a = currentSelectedTimezone !== null && currentSelectedTimezone !== void 0 ? currentSelectedTimezone : selectedTimezone) !== null && _a !== void 0 ? _a : CONST_1.default.DEFAULT_TIME_ZONE.selected, datetime); }; }, [currentLocale, selectedTimezone]);
    var datetimeToRelative = (0, react_1.useMemo)(function () { return function (datetime) { return DateUtils_1.default.datetimeToRelative(currentLocale, datetime, selectedTimezone !== null && selectedTimezone !== void 0 ? selectedTimezone : CONST_1.default.DEFAULT_TIME_ZONE.selected); }; }, [currentLocale, selectedTimezone]);
    var datetimeToCalendarTime = (0, react_1.useMemo)(function () {
        return function (datetime, includeTimezone, isLowercase) {
            if (isLowercase === void 0) { isLowercase = false; }
            return DateUtils_1.default.datetimeToCalendarTime(currentLocale, datetime, selectedTimezone !== null && selectedTimezone !== void 0 ? selectedTimezone : CONST_1.default.DEFAULT_TIME_ZONE.selected, includeTimezone, isLowercase);
        };
    }, [currentLocale, selectedTimezone]);
    var formatPhoneNumber = (0, react_1.useMemo)(function () { return function (phoneNumber) { return (0, LocalePhoneNumber_1.formatPhoneNumberWithCountryCode)(phoneNumber, countryCodeByIP); }; }, [countryCodeByIP]);
    var toLocaleDigit = (0, react_1.useMemo)(function () { return function (digit) { return (0, LocaleDigitUtils_1.toLocaleDigit)(currentLocale, digit); }; }, [currentLocale]);
    var toLocaleOrdinal = (0, react_1.useMemo)(function () {
        return function (number, writtenOrdinals) {
            if (writtenOrdinals === void 0) { writtenOrdinals = false; }
            return (0, LocaleDigitUtils_1.toLocaleOrdinal)(currentLocale, number, writtenOrdinals);
        };
    }, [currentLocale]);
    var fromLocaleDigit = (0, react_1.useMemo)(function () { return function (localeDigit) { return (0, LocaleDigitUtils_1.fromLocaleDigit)(currentLocale, localeDigit); }; }, [currentLocale]);
    var localeCompare = (0, react_1.useMemo)(function () { return function (a, b) { return collator.compare(a, b); }; }, [collator]);
    var contextValue = (0, react_1.useMemo)(function () { return ({
        translate: translate,
        numberFormat: numberFormat,
        getLocalDateFromDatetime: getLocalDateFromDatetime,
        datetimeToRelative: datetimeToRelative,
        datetimeToCalendarTime: datetimeToCalendarTime,
        formatPhoneNumber: formatPhoneNumber,
        toLocaleDigit: toLocaleDigit,
        toLocaleOrdinal: toLocaleOrdinal,
        fromLocaleDigit: fromLocaleDigit,
        localeCompare: localeCompare,
        preferredLocale: currentLocale,
    }); }, [
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
