"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRateValue = validateRateValue;
exports.getOptimisticRateName = getOptimisticRateName;
exports.validateTaxClaimableValue = validateTaxClaimableValue;
exports.buildOnyxDataForPolicyDistanceRateUpdates = buildOnyxDataForPolicyDistanceRateUpdates;
const react_native_onyx_1 = require("react-native-onyx");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ErrorUtils_1 = require("./ErrorUtils");
const getPermittedDecimalSeparator_1 = require("./getPermittedDecimalSeparator");
const Localize_1 = require("./Localize");
const MoneyRequestUtils_1 = require("./MoneyRequestUtils");
const NumberUtils_1 = require("./NumberUtils");
function validateRateValue(values, customUnitRates, toLocaleDigit, currentRateValue) {
    const errors = {};
    const parsedRate = (0, MoneyRequestUtils_1.replaceAllDigits)(values.rate, toLocaleDigit);
    const decimalSeparator = toLocaleDigit('.');
    const ratesList = Object.values(customUnitRates)
        .filter((rate) => currentRateValue !== rate.rate)
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        .map((r) => ({ ...r, rate: parseFloat(Number(r.rate || 0).toFixed(10)) }));
    // The following logic replicates the backend's handling of rates:
    // - Multiply the rate by 100 (CUSTOM_UNIT_RATE_BASE_OFFSET) to scale it, ensuring precision.
    // - This ensures rates are converted as follows:
    //   12       -> 1200
    //   12.1     -> 1210
    //   12.01    -> 1201
    //   12.001   -> 1200.1
    //   12.0001  -> 1200.01
    // - Using parseFloat and toFixed(10) retains the necessary precision.
    const convertedRate = parseFloat((Number(values.rate || 0) * CONST_1.default.POLICY.CUSTOM_UNIT_RATE_BASE_OFFSET).toFixed(10));
    // Allow one more decimal place for accuracy
    const rateValueRegex = RegExp(String.raw `^-?\d{0,8}([${(0, getPermittedDecimalSeparator_1.default)(decimalSeparator)}]\d{0,${CONST_1.default.MAX_TAX_RATE_DECIMAL_PLACES}})?$`, 'i');
    if (!rateValueRegex.test(parsedRate) || parsedRate === '') {
        errors.rate = (0, Localize_1.translateLocal)('common.error.invalidRateError');
    }
    else if (ratesList.some((r) => r.rate === convertedRate)) {
        errors.rate = (0, Localize_1.translateLocal)('workspace.perDiem.errors.existingRateError', { rate: Number(values.rate) });
    }
    else if ((0, NumberUtils_1.parseFloatAnyLocale)(parsedRate) <= 0) {
        errors.rate = (0, Localize_1.translateLocal)('common.error.lowRateError');
    }
    return errors;
}
function validateTaxClaimableValue(values, rate) {
    const errors = {};
    if (rate?.rate && Number(values.taxClaimableValue) >= rate.rate / 100) {
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
    const newRateCount = Object.values(rates).filter((rate) => rate.name?.startsWith(CONST_1.default.CUSTOM_UNITS.NEW_RATE)).length;
    return newRateCount === 0 ? CONST_1.default.CUSTOM_UNITS.NEW_RATE : `${CONST_1.default.CUSTOM_UNITS.NEW_RATE} ${newRateCount}`;
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
    const currentRates = customUnit.rates;
    const optimisticRates = {};
    const successRates = {};
    const failureRates = {};
    const rateIDs = customUnitRates.map((rate) => rate.customUnitRateID);
    for (const rateID of Object.keys(customUnit.rates)) {
        if (rateIDs.includes(rateID)) {
            const foundRate = customUnitRates.find((rate) => rate.customUnitRateID === rateID);
            optimisticRates[rateID] = {
                ...foundRate,
                pendingFields: { [fieldName]: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE },
            };
            successRates[rateID] = {
                ...foundRate,
                pendingFields: { [fieldName]: null },
            };
            failureRates[rateID] = {
                ...currentRates[rateID],
                pendingFields: { [fieldName]: null },
                errorFields: { [fieldName]: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('common.genericErrorMessage') },
            };
        }
    }
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                customUnits: {
                    [customUnit.customUnitID]: {
                        rates: optimisticRates,
                    },
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                customUnits: {
                    [customUnit.customUnitID]: {
                        rates: successRates,
                    },
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                customUnits: {
                    [customUnit.customUnitID]: {
                        rates: failureRates,
                    },
                },
            },
        },
    ];
    return { optimisticData, successData, failureData };
}
