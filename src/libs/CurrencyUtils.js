"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrencyDecimals = getCurrencyDecimals;
exports.getCurrencyUnit = getCurrencyUnit;
exports.getLocalizedCurrencySymbol = getLocalizedCurrencySymbol;
exports.getCurrencySymbol = getCurrencySymbol;
exports.getCurrencyKeyByCountryCode = getCurrencyKeyByCountryCode;
exports.convertToBackendAmount = convertToBackendAmount;
exports.convertToFrontendAmountAsInteger = convertToFrontendAmountAsInteger;
exports.convertToFrontendAmountAsString = convertToFrontendAmountAsString;
exports.convertToDisplayString = convertToDisplayString;
exports.convertAmountToDisplayString = convertAmountToDisplayString;
exports.convertToDisplayStringWithoutCurrency = convertToDisplayStringWithoutCurrency;
exports.isValidCurrencyCode = isValidCurrencyCode;
exports.convertToShortDisplayString = convertToShortDisplayString;
exports.getCurrency = getCurrency;
exports.sanitizeCurrencyCode = sanitizeCurrencyCode;
const react_native_onyx_1 = require("react-native-onyx");
const CONST_1 = require("@src/CONST");
const IntlStore_1 = require("@src/languages/IntlStore");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const NumberFormatUtils_1 = require("./NumberFormatUtils");
let currencyList = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.CURRENCY_LIST,
    callback: (val) => {
        if (!val || Object.keys(val).length === 0) {
            return;
        }
        currencyList = val;
    },
});
/**
 * Returns the number of digits after the decimal separator for a specific currency.
 * For currencies that have decimal places > 2, floor to 2 instead:
 * https://github.com/Expensify/App/issues/15878#issuecomment-1496291464
 *
 * @param currency - IOU currency
 */
function getCurrencyDecimals(currency = CONST_1.default.CURRENCY.USD) {
    const decimals = currencyList?.[currency]?.decimals;
    return decimals ?? 2;
}
function getCurrency(currency = CONST_1.default.CURRENCY.USD) {
    const currencyItem = currencyList?.[currency];
    return currencyItem;
}
/**
 * Returns the currency's minor unit quantity
 * e.g. Cent in USD
 *
 * @param currency - IOU currency
 */
function getCurrencyUnit(currency = CONST_1.default.CURRENCY.USD) {
    return 10 ** getCurrencyDecimals(currency);
}
/**
 * Get localized currency symbol for currency(ISO 4217) Code
 */
function getLocalizedCurrencySymbol(currencyCode) {
    const parts = (0, NumberFormatUtils_1.formatToParts)(IntlStore_1.default.getCurrentLocale(), 0, {
        style: 'currency',
        currency: currencyCode,
    });
    return parts.find((part) => part.type === 'currency')?.value;
}
/**
 * Get the currency symbol for a currency(ISO 4217) Code
 */
function getCurrencySymbol(currencyCode) {
    return currencyList?.[currencyCode]?.symbol;
}
/**
 * Takes an amount as a floating point number and converts it to an integer equivalent to the amount in "cents".
 * This is because the backend always stores amounts in "cents". The backend works in integer cents to avoid precision errors
 * when doing math operations.
 *
 * @note we do not currently support any currencies with more than two decimal places. Decimal past the second place will be rounded. Sorry Tunisia :(
 */
function convertToBackendAmount(amountAsFloat) {
    return Math.round(amountAsFloat * 100);
}
/**
 * Takes an amount in "cents" as an integer and converts it to a floating point amount used in the frontend.
 *
 * @note we do not support any currencies with more than two decimal places.
 */
function convertToFrontendAmountAsInteger(amountAsInt, currency = CONST_1.default.CURRENCY.USD) {
    const decimals = getCurrencyDecimals(currency);
    return Number((Math.trunc(amountAsInt) / 100.0).toFixed(decimals));
}
/**
 * Takes an amount in "cents" as an integer and converts it to a string amount used in the frontend.
 *
 * @note we do not support any currencies with more than two decimal places.
 */
function convertToFrontendAmountAsString(amountAsInt, currency = CONST_1.default.CURRENCY.USD, withDecimals = true) {
    if (amountAsInt === null || amountAsInt === undefined) {
        return '';
    }
    const decimals = withDecimals ? getCurrencyDecimals(currency) : 0;
    return convertToFrontendAmountAsInteger(amountAsInt, currency).toFixed(decimals);
}
/**
 * Given an amount in the "cents", convert it to a string for display in the UI.
 * The backend always handle things in "cents" (subunit equal to 1/100)
 *
 * @param amountInCents – should be an integer. Anything after a decimal place will be dropped.
 * @param currency - IOU currency
 */
function convertToDisplayString(amountInCents = 0, currency = CONST_1.default.CURRENCY.USD) {
    const convertedAmount = convertToFrontendAmountAsInteger(amountInCents, currency);
    /**
     * Fallback currency to USD if it empty string or undefined
     */
    let currencyWithFallback = currency;
    if (!currency) {
        currencyWithFallback = CONST_1.default.CURRENCY.USD;
    }
    return (0, NumberFormatUtils_1.format)(IntlStore_1.default.getCurrentLocale(), convertedAmount, {
        style: 'currency',
        currency: currencyWithFallback,
        // We are forcing the number of decimals because we override the default number of decimals in the backend for some currencies
        // See: https://github.com/Expensify/PHP-Libs/pull/834
        minimumFractionDigits: getCurrencyDecimals(currency),
        // For currencies that have decimal places > 2, floor to 2 instead as we don't support more than 2 decimal places.
        maximumFractionDigits: 2,
    });
}
/**
 * Given the amount in the "cents", convert it to a short string (no decimals) for display in the UI.
 * The backend always handle things in "cents" (subunit equal to 1/100)
 *
 * @param amountInCents – should be an integer. Anything after a decimal place will be dropped.
 * @param currency - IOU currency
 */
function convertToShortDisplayString(amountInCents = 0, currency = CONST_1.default.CURRENCY.USD) {
    const convertedAmount = convertToFrontendAmountAsInteger(amountInCents, currency);
    return (0, NumberFormatUtils_1.format)(IntlStore_1.default.getCurrentLocale(), convertedAmount, {
        style: 'currency',
        currency,
        // There will be no decimals displayed (e.g. $9)
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
}
/**
 * Given an amount, convert it to a string for display in the UI.
 *
 * @param amount – should be a float.
 * @param currency - IOU currency
 */
function convertAmountToDisplayString(amount = 0, currency = CONST_1.default.CURRENCY.USD) {
    const convertedAmount = amount / 100.0;
    return (0, NumberFormatUtils_1.format)(IntlStore_1.default.getCurrentLocale(), convertedAmount, {
        style: 'currency',
        currency,
        minimumFractionDigits: CONST_1.default.MIN_TAX_RATE_DECIMAL_PLACES,
        maximumFractionDigits: CONST_1.default.MAX_TAX_RATE_DECIMAL_PLACES,
    });
}
/**
 * Acts the same as `convertAmountToDisplayString` but the result string does not contain currency
 */
function convertToDisplayStringWithoutCurrency(amountInCents, currency = CONST_1.default.CURRENCY.USD) {
    const convertedAmount = convertToFrontendAmountAsInteger(amountInCents, currency);
    return (0, NumberFormatUtils_1.formatToParts)(IntlStore_1.default.getCurrentLocale(), convertedAmount, {
        style: 'currency',
        currency,
        // We are forcing the number of decimals because we override the default number of decimals in the backend for some currencies
        // See: https://github.com/Expensify/PHP-Libs/pull/834
        minimumFractionDigits: getCurrencyDecimals(currency),
        // For currencies that have decimal places > 2, floor to 2 instead as we don't support more than 2 decimal places.
        maximumFractionDigits: 2,
    })
        .filter((x) => x.type !== 'currency')
        .filter((x) => x.type !== 'literal' || x.value.trim().length !== 0)
        .map((x) => x.value)
        .join('');
}
/**
 * Checks if passed currency code is a valid currency based on currency list
 */
function isValidCurrencyCode(currencyCode) {
    const currency = currencyList?.[currencyCode];
    return !!currency;
}
function sanitizeCurrencyCode(currencyCode) {
    return isValidCurrencyCode(currencyCode) ? currencyCode : CONST_1.default.CURRENCY.USD;
}
function getCurrencyKeyByCountryCode(currencies, countryCode) {
    if (!currencies || !countryCode) {
        return CONST_1.default.CURRENCY.USD;
    }
    for (const [key, value] of Object.entries(currencies)) {
        if (value?.countries?.includes(countryCode)) {
            return key;
        }
    }
    return CONST_1.default.CURRENCY.USD;
}
