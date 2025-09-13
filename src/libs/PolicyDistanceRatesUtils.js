"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRateValue = validateRateValue;
exports.getOptimisticRateName = getOptimisticRateName;
exports.validateTaxClaimableValue = validateTaxClaimableValue;
exports.buildOnyxDataForPolicyDistanceRateUpdates = buildOnyxDataForPolicyDistanceRateUpdates;
var react_native_onyx_1 = require("react-native-onyx");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ErrorUtils_1 = require("./ErrorUtils");
var getPermittedDecimalSeparator_1 = require("./getPermittedDecimalSeparator");
var Localize_1 = require("./Localize");
var MoneyRequestUtils_1 = require("./MoneyRequestUtils");
var NumberUtils_1 = require("./NumberUtils");
function validateRateValue(values, customUnitRates, toLocaleDigit, currentRateValue) {
    var errors = {};
    var parsedRate = (0, MoneyRequestUtils_1.replaceAllDigits)(values.rate, toLocaleDigit);
    var decimalSeparator = toLocaleDigit('.');
    var ratesList = Object.values(customUnitRates)
        .filter(function (rate) { return currentRateValue !== rate.rate; })
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        .map(function (r) { return (__assign(__assign({}, r), { rate: parseFloat(Number(r.rate || 0).toFixed(10)) })); });
    // The following logic replicates the backend's handling of rates:
    // - Multiply the rate by 100 (CUSTOM_UNIT_RATE_BASE_OFFSET) to scale it, ensuring precision.
    // - This ensures rates are converted as follows:
    //   12       -> 1200
    //   12.1     -> 1210
    //   12.01    -> 1201
    //   12.001   -> 1200.1
    //   12.0001  -> 1200.01
    // - Using parseFloat and toFixed(10) retains the necessary precision.
    var convertedRate = parseFloat((Number(values.rate || 0) * CONST_1.default.POLICY.CUSTOM_UNIT_RATE_BASE_OFFSET).toFixed(10));
    // Allow one more decimal place for accuracy
    var rateValueRegex = RegExp(String.raw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["^-?d{0,8}([", "]d{0,", "})?$"], ["^-?\\d{0,8}([", "]\\d{0,", "})?$"])), (0, getPermittedDecimalSeparator_1.default)(decimalSeparator), CONST_1.default.MAX_TAX_RATE_DECIMAL_PLACES), 'i');
    if (!rateValueRegex.test(parsedRate) || parsedRate === '') {
        errors.rate = (0, Localize_1.translateLocal)('common.error.invalidRateError');
    }
    else if (ratesList.some(function (r) { return r.rate === convertedRate; })) {
        errors.rate = (0, Localize_1.translateLocal)('workspace.perDiem.errors.existingRateError', { rate: Number(values.rate) });
    }
    else if ((0, NumberUtils_1.parseFloatAnyLocale)(parsedRate) <= 0) {
        errors.rate = (0, Localize_1.translateLocal)('common.error.lowRateError');
    }
    return errors;
}
function validateTaxClaimableValue(values, rate) {
    var errors = {};
    if ((rate === null || rate === void 0 ? void 0 : rate.rate) && Number(values.taxClaimableValue) >= rate.rate / 100) {
        errors.taxClaimableValue = (0, Localize_1.translateLocal)('workspace.taxes.error.updateTaxClaimableFailureMessage');
    }
    return errors;
}
/**
 * Get the optimistic rate name in a way that matches BE logic
 * @param rates
 */
function getOptimisticRateName(rates) {
    if (Object.keys(rates).length === 0) {
        return CONST_1.default.CUSTOM_UNITS.DEFAULT_RATE;
    }
    var newRateCount = Object.values(rates).filter(function (rate) { var _a; return (_a = rate.name) === null || _a === void 0 ? void 0 : _a.startsWith(CONST_1.default.CUSTOM_UNITS.NEW_RATE); }).length;
    return newRateCount === 0 ? CONST_1.default.CUSTOM_UNITS.NEW_RATE : "".concat(CONST_1.default.CUSTOM_UNITS.NEW_RATE, " ").concat(newRateCount);
}
/**
 * Builds optimistic, success, and failure Onyx data for policy distance rate updates
 * @param policyID - The policy ID
 * @param customUnit - The custom unit being updated
 * @param customUnitRates - The rates being updated
 * @param fieldName - The field name being updated
 * @returns Object containing optimisticData, successData, and failureData arrays
 */
function buildOnyxDataForPolicyDistanceRateUpdates(policyID, customUnit, customUnitRates, fieldName) {
    var _a, _b, _c;
    var currentRates = customUnit.rates;
    var optimisticRates = {};
    var successRates = {};
    var failureRates = {};
    var rateIDs = customUnitRates.map(function (rate) { return rate.customUnitRateID; });
    var _loop_1 = function (rateID) {
        var _e, _f, _g, _h;
        if (rateIDs.includes(rateID)) {
            var foundRate = customUnitRates.find(function (rate) { return rate.customUnitRateID === rateID; });
            optimisticRates[rateID] = __assign(__assign({}, foundRate), { pendingFields: (_e = {}, _e[fieldName] = CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE, _e) });
            successRates[rateID] = __assign(__assign({}, foundRate), { pendingFields: (_f = {}, _f[fieldName] = null, _f) });
            failureRates[rateID] = __assign(__assign({}, currentRates[rateID]), { pendingFields: (_g = {}, _g[fieldName] = null, _g), errorFields: (_h = {}, _h[fieldName] = (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('common.genericErrorMessage'), _h) });
        }
    };
    for (var _i = 0, _d = Object.keys(customUnit.rates); _i < _d.length; _i++) {
        var rateID = _d[_i];
        _loop_1(rateID);
    }
    var optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: "".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(policyID),
            value: {
                customUnits: (_a = {},
                    _a[customUnit.customUnitID] = {
                        rates: optimisticRates,
                    },
                    _a),
            },
        },
    ];
    var successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: "".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(policyID),
            value: {
                customUnits: (_b = {},
                    _b[customUnit.customUnitID] = {
                        rates: successRates,
                    },
                    _b),
            },
        },
    ];
    var failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: "".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(policyID),
            value: {
                customUnits: (_c = {},
                    _c[customUnit.customUnitID] = {
                        rates: failureRates,
                    },
                    _c),
            },
        },
    ];
    return { optimisticData: optimisticData, successData: successData, failureData: failureData };
}
var templateObject_1;
