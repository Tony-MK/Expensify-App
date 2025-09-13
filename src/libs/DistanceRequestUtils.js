"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CONST_1 = require("@src/CONST");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const CurrencyUtils_1 = require("./CurrencyUtils");
const PolicyUtils_1 = require("./PolicyUtils");
const TransactionUtils_1 = require("./TransactionUtils");
const METERS_TO_KM = 0.001; // 1 kilometer is 1000 meters
const METERS_TO_MILES = 0.000621371; // There are approximately 0.000621371 miles in a meter
function getMileageRates(policy, includeDisabledRates = false, selectedRateID) {
    const mileageRates = {};
    if (!policy?.customUnits) {
        return mileageRates;
    }
    const distanceUnit = (0, PolicyUtils_1.getDistanceRateCustomUnit)(policy);
    if (!distanceUnit?.rates) {
        return mileageRates;
    }
    Object.entries(distanceUnit.rates).forEach(([rateID, rate]) => {
        if (!includeDisabledRates && rate.enabled === false && (!selectedRateID || rateID !== selectedRateID)) {
            return;
        }
        if (!distanceUnit.attributes) {
            return;
        }
        mileageRates[rateID] = {
            rate: rate.rate,
            currency: rate.currency,
            unit: distanceUnit.attributes.unit,
            name: rate.name,
            customUnitRateID: rate.customUnitRateID,
            enabled: rate.enabled,
        };
    });
    return mileageRates;
}
/**
 * Retrieves the default mileage rate based on a given policy.
 * Default rate is the first created rate when you create the policy.
 * It's NOT always the rate whose name is "Default rate" because rate name is now changeable.
 *
 * @param policy - The policy from which to extract the default mileage rate.
 *
 * @returns An object containing the rate and unit for the default mileage or null if not found.
 * @returns [rate] - The default rate for the mileage.
 * @returns [currency] - The currency associated with the rate.
 * @returns [unit] - The unit of measurement for the distance.
 */
function getDefaultMileageRate(policy) {
    if ((0, EmptyObject_1.isEmptyObject)(policy) || !policy?.customUnits) {
        return undefined;
    }
    const distanceUnit = (0, PolicyUtils_1.getDistanceRateCustomUnit)(policy);
    if (!distanceUnit?.rates || !distanceUnit.attributes) {
        return;
    }
    const mileageRates = Object.values(getMileageRates(policy));
    const distanceRate = mileageRates.at(0) ?? {};
    return {
        customUnitRateID: distanceRate.customUnitRateID,
        rate: distanceRate.rate,
        currency: distanceRate.currency,
        unit: distanceUnit.attributes.unit,
        name: distanceRate.name,
    };
}
/**
 * Converts a given distance in meters to the specified unit (kilometers or miles).
 *
 * @param distanceInMeters - The distance in meters to be converted.
 * @param unit - The desired unit of conversion, either 'km' for kilometers or 'mi' for miles.
 *
 * @returns The converted distance in the specified unit.
 */
function convertDistanceUnit(distanceInMeters, unit) {
    switch (unit) {
        case CONST_1.default.CUSTOM_UNITS.DISTANCE_UNIT_KILOMETERS:
            return distanceInMeters * METERS_TO_KM;
        case CONST_1.default.CUSTOM_UNITS.DISTANCE_UNIT_MILES:
            return distanceInMeters * METERS_TO_MILES;
        default:
            throw new Error('Unsupported unit. Supported units are "mi" or "km".');
    }
}
/**
 * @param distanceInMeters Distance traveled
 * @param unit Unit that should be used to display the distance
 * @returns The distance in requested units, rounded to 2 decimals
 */
function getRoundedDistanceInUnits(distanceInMeters, unit) {
    const convertedDistance = convertDistanceUnit(distanceInMeters, unit);
    return convertedDistance.toFixed(CONST_1.default.DISTANCE_DECIMAL_PLACES);
}
/**
 * @param unit Unit that should be used to display the distance
 * @param rate Expensable amount allowed per unit
 * @param currency The currency associated with the rate
 * @param translate Translate function
 * @param toLocaleDigit Function to convert to localized digit
 * @param useShortFormUnit If true, the unit will be returned in short form (e.g., "mi", "km").
 * @returns A string that displays the rate used for expense calculation
 */
function getRateForDisplay(unit, rate, currency, translate, toLocaleDigit, isOffline, useShortFormUnit) {
    if (isOffline && !rate) {
        return translate('iou.defaultRate');
    }
    if (!rate || !currency || !unit) {
        return translate('iou.fieldPending');
    }
    const singularDistanceUnit = unit === CONST_1.default.CUSTOM_UNITS.DISTANCE_UNIT_MILES ? translate('common.mile') : translate('common.kilometer');
    const formattedRate = (0, PolicyUtils_1.getUnitRateValue)(toLocaleDigit, { rate }, useShortFormUnit);
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const currencySymbol = (0, CurrencyUtils_1.getCurrencySymbol)(currency) || `${currency} `;
    return `${currencySymbol}${formattedRate} / ${useShortFormUnit ? unit : singularDistanceUnit}`;
}
/**
 * @param hasRoute Whether the route exists for the distance expense
 * @param distanceInMeters Distance traveled
 * @param unit Unit that should be used to display the distance
 * @param rate Expensable amount allowed per unit
 * @param translate Translate function
 * @param useShortFormUnit If true, the unit will be returned in short form (e.g., "mi", "km").
 * @returns A string that describes the distance traveled
 */
function getDistanceForDisplay(hasRoute, distanceInMeters, unit, rate, translate, useShortFormUnit) {
    if (!hasRoute || !unit || !distanceInMeters) {
        return translate('iou.fieldPending');
    }
    const distanceInUnits = getRoundedDistanceInUnits(distanceInMeters, unit);
    if (useShortFormUnit) {
        return `${distanceInUnits} ${unit}`;
    }
    const distanceUnit = unit === CONST_1.default.CUSTOM_UNITS.DISTANCE_UNIT_MILES ? translate('common.miles') : translate('common.kilometers');
    const singularDistanceUnit = unit === CONST_1.default.CUSTOM_UNITS.DISTANCE_UNIT_MILES ? translate('common.mile') : translate('common.kilometer');
    const unitString = distanceInUnits === '1' ? singularDistanceUnit : distanceUnit;
    return `${distanceInUnits} ${unitString}`;
}
function getDistanceForDisplayLabel(distanceInMeters, unit) {
    const distanceInUnits = getRoundedDistanceInUnits(distanceInMeters, unit);
    return `${distanceInUnits} ${unit}`;
}
/**
 * @param hasRoute Whether the route exists for the distance expense
 * @param distanceInMeters Distance traveled
 * @param unit Unit that should be used to display the distance
 * @param rate Expensable amount allowed per unit
 * @param currency The currency associated with the rate
 * @param translate Translate function
 * @param toLocaleDigit Function to convert to localized digit
 * @returns A string that describes the distance traveled and the rate used for expense calculation
 */
function getDistanceMerchant(hasRoute, distanceInMeters, unit, rate, currency, translate, toLocaleDigit) {
    if (!hasRoute || !rate) {
        return translate('iou.fieldPending');
    }
    const distanceInUnits = getDistanceForDisplay(hasRoute, distanceInMeters, unit, rate, translate, true);
    const ratePerUnit = getRateForDisplay(unit, rate, currency, translate, toLocaleDigit, undefined, true);
    return `${distanceInUnits} @ ${ratePerUnit}`;
}
function ensureRateDefined(rate) {
    if (rate !== undefined) {
        return;
    }
    throw new Error('All default P2P rates should have a rate defined');
}
/**
 * Retrieves the rate and unit for a P2P distance expense for a given currency.
 *
 * Let's ensure this logic is consistent with the logic in the backend (Auth), since we're using the same method to calculate the rate value in distance requests created via Concierge.
 *
 * @param currency
 * @returns The rate and unit in MileageRate object.
 */
function getRateForP2P(currency, transaction) {
    const currencyWithExistingRate = CONST_1.default.CURRENCY_TO_DEFAULT_MILEAGE_RATE[currency] ? currency : CONST_1.default.CURRENCY.USD;
    const mileageRate = CONST_1.default.CURRENCY_TO_DEFAULT_MILEAGE_RATE[currencyWithExistingRate];
    ensureRateDefined(mileageRate.rate);
    // Ensure the rate is updated when the currency changes, otherwise use the stored rate
    const rate = (0, TransactionUtils_1.getCurrency)(transaction) === currency ? (transaction?.comment?.customUnit?.defaultP2PRate ?? mileageRate.rate) : mileageRate.rate;
    return {
        ...mileageRate,
        currency: currencyWithExistingRate,
        rate,
    };
}
/**
 * Calculates the expense amount based on distance, unit, and rate.
 *
 * @param distance - The distance traveled in meters
 * @param unit - The unit of measurement for the distance
 * @param rate - Rate used for calculating the expense amount
 * @returns The computed expense amount (rounded) in "cents".
 */
function getDistanceRequestAmount(distance, unit, rate) {
    const convertedDistance = convertDistanceUnit(distance, unit);
    const roundedDistance = parseFloat(convertedDistance.toFixed(2));
    return Math.round(roundedDistance * rate);
}
/**
 * Converts the distance from kilometers or miles to meters.
 *
 * @param distance - The distance to be converted.
 * @param unit - The unit of measurement for the distance.
 * @returns The distance in meters.
 */
function convertToDistanceInMeters(distance, unit) {
    if (unit === CONST_1.default.CUSTOM_UNITS.DISTANCE_UNIT_KILOMETERS) {
        return distance / METERS_TO_KM;
    }
    return distance / METERS_TO_MILES;
}
/**
 * Returns custom unit rate ID for the distance transaction
 */
function getCustomUnitRateID({ reportID, isPolicyExpenseChat, policy, lastSelectedDistanceRates, }) {
    let customUnitRateID = CONST_1.default.CUSTOM_UNITS.FAKE_P2P_ID;
    if (!reportID) {
        return customUnitRateID;
    }
    if ((0, EmptyObject_1.isEmptyObject)(policy)) {
        return customUnitRateID;
    }
    if (isPolicyExpenseChat) {
        const distanceUnit = Object.values(policy.customUnits ?? {}).find((unit) => unit.name === CONST_1.default.CUSTOM_UNITS.NAME_DISTANCE);
        const lastSelectedDistanceRateID = lastSelectedDistanceRates?.[policy.id];
        const lastSelectedDistanceRate = lastSelectedDistanceRateID ? distanceUnit?.rates[lastSelectedDistanceRateID] : undefined;
        if (lastSelectedDistanceRate?.enabled && lastSelectedDistanceRateID) {
            customUnitRateID = lastSelectedDistanceRateID;
        }
        else {
            const defaultMileageRate = getDefaultMileageRate(policy);
            if (!defaultMileageRate?.customUnitRateID) {
                return customUnitRateID;
            }
            customUnitRateID = defaultMileageRate.customUnitRateID;
        }
    }
    return customUnitRateID;
}
/**
 * Get taxable amount from a specific distance rate, taking into consideration the tax claimable amount configured for the distance rate
 */
function getTaxableAmount(policy, customUnitRateID, distance) {
    const distanceUnit = (0, PolicyUtils_1.getDistanceRateCustomUnit)(policy);
    const customUnitRate = (0, PolicyUtils_1.getDistanceRateCustomUnitRate)(policy, customUnitRateID);
    if (!distanceUnit?.customUnitID || !customUnitRate) {
        return 0;
    }
    const unit = distanceUnit?.attributes?.unit ?? CONST_1.default.CUSTOM_UNITS.DISTANCE_UNIT_MILES;
    const rate = customUnitRate?.rate ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const amount = getDistanceRequestAmount(distance, unit, rate);
    const taxClaimablePercentage = customUnitRate.attributes?.taxClaimablePercentage ?? CONST_1.default.DEFAULT_NUMBER_ID;
    return amount * taxClaimablePercentage;
}
function getDistanceUnit(transaction, mileageRate) {
    return transaction?.comment?.customUnit?.distanceUnit ?? mileageRate?.unit ?? CONST_1.default.CUSTOM_UNITS.DISTANCE_UNIT_MILES;
}
/**
 * Get the selected rate for a transaction, from the policy or P2P default rate.
 * Use the distanceUnit stored on the transaction by default to prevent policy changes modifying existing transactions. Otherwise, get the unit from the rate.
 *
 * Let's ensure this logic is consistent with the logic in the backend (Auth), since we're using the same method to calculate the rate value in distance requests created via Concierge.
 */
function getRate({ transaction, policy, policyDraft, useTransactionDistanceUnit = true, }) {
    let mileageRates = getMileageRates(policy, true, transaction?.comment?.customUnit?.customUnitRateID);
    if ((0, EmptyObject_1.isEmptyObject)(mileageRates) && policyDraft) {
        mileageRates = getMileageRates(policyDraft, true, transaction?.comment?.customUnit?.customUnitRateID);
    }
    const policyCurrency = policy?.outputCurrency ?? (0, PolicyUtils_1.getPersonalPolicy)()?.outputCurrency ?? CONST_1.default.CURRENCY.USD;
    const defaultMileageRate = getDefaultMileageRate(policy);
    const customUnitRateID = (0, TransactionUtils_1.getRateID)(transaction);
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const customMileageRate = (customUnitRateID && mileageRates?.[customUnitRateID]) || defaultMileageRate;
    const mileageRate = (0, TransactionUtils_1.isCustomUnitRateIDForP2P)(transaction) ? getRateForP2P(policyCurrency, transaction) : customMileageRate;
    const unit = getDistanceUnit(useTransactionDistanceUnit ? transaction : undefined, mileageRate);
    return {
        ...mileageRate,
        unit,
        currency: mileageRate?.currency ?? policyCurrency,
    };
}
/**
 * Get the updated distance unit from the selected rate instead of the distanceUnit stored on the transaction.
 * Useful for updating the transaction distance unit when the distance or rate changes.
 *
 * For example, if an expense is '10 mi @ $1.00 / mi' and the rate is updated to '$1.00 / km',
 * then the updated distance unit should be 'km' from the updated rate, not 'mi' from the currently stored transaction distance unit.
 */
function getUpdatedDistanceUnit({ transaction, policy, policyDraft }) {
    return getRate({ transaction, policy, policyDraft, useTransactionDistanceUnit: false }).unit;
}
/**
 * Get the mileage rate by its ID in the form it's configured for the policy.
 * If not found, return undefined.
 */
function getRateByCustomUnitRateID({ customUnitRateID, policy }) {
    return getMileageRates(policy, true, customUnitRateID)[customUnitRateID];
}
exports.default = {
    getDefaultMileageRate,
    getDistanceMerchant,
    getDistanceRequestAmount,
    getRateForDisplay,
    getMileageRates,
    getDistanceForDisplay,
    getRoundedDistanceInUnits,
    getRateForP2P,
    getCustomUnitRateID,
    convertToDistanceInMeters,
    getTaxableAmount,
    getDistanceUnit,
    getUpdatedDistanceUnit,
    getRate,
    getRateByCustomUnitRateID,
    getDistanceForDisplayLabel,
    convertDistanceUnit,
};
