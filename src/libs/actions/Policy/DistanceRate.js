"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enablePolicyDistanceRates = enablePolicyDistanceRates;
exports.openPolicyDistanceRatesPage = openPolicyDistanceRatesPage;
exports.createPolicyDistanceRate = createPolicyDistanceRate;
exports.clearCreateDistanceRateItemAndError = clearCreateDistanceRateItemAndError;
exports.clearDeleteDistanceRateError = clearDeleteDistanceRateError;
exports.setPolicyDistanceRatesUnit = setPolicyDistanceRatesUnit;
exports.clearPolicyDistanceRatesErrorFields = clearPolicyDistanceRatesErrorFields;
exports.clearPolicyDistanceRateErrorFields = clearPolicyDistanceRateErrorFields;
exports.updatePolicyDistanceRateValue = updatePolicyDistanceRateValue;
exports.updatePolicyDistanceRateName = updatePolicyDistanceRateName;
exports.setPolicyDistanceRatesEnabled = setPolicyDistanceRatesEnabled;
exports.deletePolicyDistanceRates = deletePolicyDistanceRates;
exports.updateDistanceTaxClaimableValue = updateDistanceTaxClaimableValue;
exports.updateDistanceTaxRate = updateDistanceTaxRate;
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const ErrorUtils = require("@libs/ErrorUtils");
const getIsNarrowLayout_1 = require("@libs/getIsNarrowLayout");
const PolicyDistanceRatesUtils_1 = require("@libs/PolicyDistanceRatesUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
/**
 * Takes array of customUnitRates and removes pendingFields and errorFields from each rate - we don't want to send those via API
 */
function prepareCustomUnitRatesArray(customUnitRates) {
    const customUnitRateArray = [];
    customUnitRates.forEach((rate) => {
        const cleanedRate = { ...rate };
        delete cleanedRate.pendingFields;
        delete cleanedRate.errorFields;
        customUnitRateArray.push(cleanedRate);
    });
    return customUnitRateArray;
}
function openPolicyDistanceRatesPage(policyID) {
    if (!policyID) {
        return;
    }
    const params = { policyID };
    API.read(types_1.READ_COMMANDS.OPEN_POLICY_DISTANCE_RATES_PAGE, params);
}
function enablePolicyDistanceRates(policyID, enabled, customUnit) {
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    areDistanceRatesEnabled: enabled,
                    pendingFields: {
                        areDistanceRatesEnabled: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    pendingFields: {
                        areDistanceRatesEnabled: null,
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    areDistanceRatesEnabled: !enabled,
                    pendingFields: {
                        areDistanceRatesEnabled: null,
                    },
                },
            },
        ],
    };
    if (!enabled && customUnit) {
        const customUnitID = customUnit.customUnitID;
        const rateEntries = Object.entries(customUnit.rates ?? {});
        // find the rate to be enabled after disabling the distance rate feature
        const rateEntryToBeEnabled = rateEntries.at(0);
        onyxData.optimisticData?.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                customUnits: {
                    [customUnitID]: {
                        rates: Object.fromEntries(rateEntries.map((rateEntry) => {
                            const [rateID, rate] = rateEntry;
                            return [
                                rateID,
                                {
                                    ...rate,
                                    enabled: rateID === rateEntryToBeEnabled?.at(0),
                                },
                            ];
                        })),
                    },
                },
            },
        });
    }
    const parameters = { policyID, enabled };
    API.writeWithNoDuplicatesEnableFeatureConflicts(types_1.WRITE_COMMANDS.ENABLE_POLICY_DISTANCE_RATES, parameters, onyxData);
    if (enabled && (0, getIsNarrowLayout_1.default)()) {
        (0, PolicyUtils_1.goBackWhenEnableFeature)(policyID);
    }
}
function createPolicyDistanceRate(policyID, customUnitID, customUnitRate) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                customUnits: {
                    [customUnitID]: {
                        rates: {
                            [customUnitRate.customUnitRateID]: {
                                ...customUnitRate,
                                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                            },
                        },
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
                    [customUnitID]: {
                        rates: {
                            [customUnitRate.customUnitRateID]: {
                                pendingAction: null,
                            },
                        },
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
                    [customUnitID]: {
                        rates: {
                            [customUnitRate.customUnitRateID]: {
                                errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
                            },
                        },
                    },
                },
            },
        },
    ];
    const params = {
        policyID,
        customUnitID,
        customUnitRate: JSON.stringify(customUnitRate),
    };
    API.write(types_1.WRITE_COMMANDS.CREATE_POLICY_DISTANCE_RATE, params, { optimisticData, successData, failureData });
}
function clearCreateDistanceRateItemAndError(policyID, customUnitID, customUnitRateIDToClear) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
        customUnits: {
            [customUnitID]: {
                rates: {
                    [customUnitRateIDToClear]: null,
                },
            },
        },
    });
}
function clearPolicyDistanceRatesErrorFields(policyID, customUnitID, updatedErrorFields) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
        customUnits: {
            [customUnitID]: {
                errorFields: updatedErrorFields,
            },
        },
    });
}
function clearDeleteDistanceRateError(policyID, customUnitID, rateID) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
        customUnits: {
            [customUnitID]: {
                rates: {
                    [rateID]: {
                        errors: null,
                    },
                },
            },
        },
    });
}
function clearPolicyDistanceRateErrorFields(policyID, customUnitID, rateID, updatedErrorFields) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
        customUnits: {
            [customUnitID]: {
                rates: {
                    [rateID]: {
                        errorFields: updatedErrorFields,
                    },
                },
            },
        },
    });
}
function setPolicyDistanceRatesUnit(policyID, currentCustomUnit, newCustomUnit) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                customUnits: {
                    [newCustomUnit.customUnitID]: {
                        ...newCustomUnit,
                        pendingFields: { attributes: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE },
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
                    [newCustomUnit.customUnitID]: {
                        pendingFields: { attributes: null },
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
                    [currentCustomUnit.customUnitID]: {
                        ...currentCustomUnit,
                        errorFields: { attributes: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage') },
                        pendingFields: { attributes: null },
                    },
                },
            },
        },
    ];
    const params = {
        policyID,
        customUnit: JSON.stringify((0, PolicyUtils_1.removePendingFieldsFromCustomUnit)(newCustomUnit)),
    };
    API.write(types_1.WRITE_COMMANDS.SET_POLICY_DISTANCE_RATES_UNIT, params, { optimisticData, successData, failureData });
}
function updatePolicyDistanceRateValue(policyID, customUnit, customUnitRates) {
    const { optimisticData, successData, failureData } = (0, PolicyDistanceRatesUtils_1.buildOnyxDataForPolicyDistanceRateUpdates)(policyID, customUnit, customUnitRates, 'rate');
    const params = {
        policyID,
        customUnitID: customUnit.customUnitID,
        customUnitRateArray: JSON.stringify(prepareCustomUnitRatesArray(customUnitRates)),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_POLICY_DISTANCE_RATE_VALUE, params, { optimisticData, successData, failureData });
}
function updatePolicyDistanceRateName(policyID, customUnit, customUnitRates) {
    const { optimisticData, successData, failureData } = (0, PolicyDistanceRatesUtils_1.buildOnyxDataForPolicyDistanceRateUpdates)(policyID, customUnit, customUnitRates, 'name');
    const params = {
        policyID,
        customUnitID: customUnit.customUnitID,
        customUnitRateArray: JSON.stringify(prepareCustomUnitRatesArray(customUnitRates)),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_POLICY_DISTANCE_RATE_NAME, params, { optimisticData, successData, failureData });
}
function setPolicyDistanceRatesEnabled(policyID, customUnit, customUnitRates) {
    const currentRates = customUnit.rates;
    const optimisticRates = {};
    const successRates = {};
    const failureRates = {};
    const rateIDs = customUnitRates.map((rate) => rate.customUnitRateID);
    for (const rateID of Object.keys(currentRates)) {
        if (rateIDs.includes(rateID)) {
            const foundRate = customUnitRates.find((rate) => rate.customUnitRateID === rateID);
            optimisticRates[rateID] = { ...foundRate, pendingFields: { enabled: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE } };
            successRates[rateID] = { ...foundRate, pendingFields: { enabled: null } };
            failureRates[rateID] = {
                ...currentRates[rateID],
                pendingFields: { enabled: null },
                errorFields: { enabled: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage') },
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
    const params = {
        policyID,
        customUnitID: customUnit.customUnitID,
        customUnitRateArray: JSON.stringify(prepareCustomUnitRatesArray(customUnitRates)),
    };
    API.write(types_1.WRITE_COMMANDS.SET_POLICY_DISTANCE_RATES_ENABLED, params, { optimisticData, successData, failureData });
}
function deletePolicyDistanceRates(policyID, customUnit, rateIDsToDelete, transactionIDsAffected, transactionViolations) {
    const currentRates = customUnit.rates;
    const optimisticRates = {};
    const successRates = {};
    const failureRates = {};
    for (const rateID of Object.keys(currentRates)) {
        if (rateIDsToDelete.includes(rateID)) {
            optimisticRates[rateID] = {
                ...currentRates[rateID],
                enabled: false,
                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
            };
            failureRates[rateID] = {
                ...currentRates[rateID],
                pendingAction: null,
                errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
            };
        }
        else {
            optimisticRates[rateID] = currentRates[rateID];
            successRates[rateID] = {
                ...currentRates[rateID],
                pendingAction: null,
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
    const optimisticTransactionsViolations = [];
    const failureTransactionsViolations = [];
    for (const transactionID of transactionIDsAffected) {
        const currentTransactionViolations = transactionViolations?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`] ?? [];
        if (currentTransactionViolations.some((violation) => violation.name === CONST_1.default.VIOLATIONS.CUSTOM_UNIT_OUT_OF_POLICY)) {
            return;
        }
        optimisticTransactionsViolations.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`,
            value: [
                ...currentTransactionViolations,
                {
                    type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
                    name: CONST_1.default.VIOLATIONS.CUSTOM_UNIT_OUT_OF_POLICY,
                    showInReview: true,
                },
            ],
        });
        failureTransactionsViolations.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`,
            value: currentTransactionViolations,
        });
    }
    optimisticData.push(...optimisticTransactionsViolations);
    failureData.push(...failureTransactionsViolations);
    const params = {
        policyID,
        customUnitID: customUnit.customUnitID,
        customUnitRateID: rateIDsToDelete,
    };
    API.write(types_1.WRITE_COMMANDS.DELETE_POLICY_DISTANCE_RATES, params, { optimisticData, successData, failureData });
}
function updateDistanceTaxClaimableValue(policyID, customUnit, customUnitRates) {
    const { optimisticData, successData, failureData } = (0, PolicyDistanceRatesUtils_1.buildOnyxDataForPolicyDistanceRateUpdates)(policyID, customUnit, customUnitRates, 'taxClaimablePercentage');
    const params = {
        policyID,
        customUnitID: customUnit.customUnitID,
        customUnitRateArray: JSON.stringify(prepareCustomUnitRatesArray(customUnitRates)),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_DISTANCE_TAX_CLAIMABLE_VALUE, params, { optimisticData, successData, failureData });
}
function updateDistanceTaxRate(policyID, customUnit, customUnitRates) {
    const { optimisticData, successData, failureData } = (0, PolicyDistanceRatesUtils_1.buildOnyxDataForPolicyDistanceRateUpdates)(policyID, customUnit, customUnitRates, 'taxRateExternalID');
    const params = {
        policyID,
        customUnitID: customUnit.customUnitID,
        customUnitRateArray: JSON.stringify(prepareCustomUnitRatesArray(customUnitRates)),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_POLICY_DISTANCE_TAX_RATE_VALUE, params, { optimisticData, successData, failureData });
}
