"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTaxValue = exports.validateTaxCode = exports.validateTaxName = void 0;
exports.createPolicyTax = createPolicyTax;
exports.getNextTaxCode = getNextTaxCode;
exports.clearTaxRateError = clearTaxRateError;
exports.clearTaxRateFieldError = clearTaxRateFieldError;
exports.getTaxValueWithPercentage = getTaxValueWithPercentage;
exports.setPolicyTaxesEnabled = setPolicyTaxesEnabled;
exports.deletePolicyTaxes = deletePolicyTaxes;
exports.updatePolicyTaxValue = updatePolicyTaxValue;
exports.renamePolicyTax = renamePolicyTax;
exports.setPolicyTaxCode = setPolicyTaxCode;
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const Localize_1 = require("@libs/Localize");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const CONST_1 = require("@src/CONST");
const ErrorUtils_1 = require("@src/libs/ErrorUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const WorkspaceNewTaxForm_1 = require("@src/types/form/WorkspaceNewTaxForm");
// eslint-disable-next-line import/no-named-default
const WorkspaceTaxCodeForm_1 = require("@src/types/form/WorkspaceTaxCodeForm");
/**
 * Get tax value with percentage
 */
function getTaxValueWithPercentage(value) {
    return `${value}%`;
}
function covertTaxNameToID(name) {
    return `id_${name.toUpperCase().replaceAll(' ', '_')}`;
}
/**
 *  Function to validate tax name
 */
const validateTaxName = (policy, values) => {
    const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, [WorkspaceNewTaxForm_1.default.NAME]);
    const name = values[WorkspaceNewTaxForm_1.default.NAME];
    if (name.length > CONST_1.default.TAX_RATES.NAME_MAX_LENGTH) {
        errors[WorkspaceNewTaxForm_1.default.NAME] = (0, Localize_1.translateLocal)('common.error.characterLimitExceedCounter', {
            length: name.length,
            limit: CONST_1.default.TAX_RATES.NAME_MAX_LENGTH,
        });
    }
    else if (policy?.taxRates?.taxes && (0, ValidationUtils_1.isExistingTaxName)(name, policy.taxRates.taxes)) {
        errors[WorkspaceNewTaxForm_1.default.NAME] = (0, Localize_1.translateLocal)('workspace.taxes.error.taxRateAlreadyExists');
    }
    return errors;
};
exports.validateTaxName = validateTaxName;
const validateTaxCode = (policy, values) => {
    const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, [WorkspaceTaxCodeForm_1.default.TAX_CODE]);
    const taxCode = values[WorkspaceTaxCodeForm_1.default.TAX_CODE];
    if (taxCode.length > CONST_1.default.TAX_RATES.NAME_MAX_LENGTH) {
        errors[WorkspaceTaxCodeForm_1.default.TAX_CODE] = (0, Localize_1.translateLocal)('common.error.characterLimitExceedCounter', {
            length: taxCode.length,
            limit: CONST_1.default.TAX_RATES.NAME_MAX_LENGTH,
        });
    }
    else if (policy?.taxRates?.taxes && (0, ValidationUtils_1.isExistingTaxCode)(taxCode, policy.taxRates.taxes)) {
        errors[WorkspaceTaxCodeForm_1.default.TAX_CODE] = (0, Localize_1.translateLocal)('workspace.taxes.error.taxCodeAlreadyExists');
    }
    return errors;
};
exports.validateTaxCode = validateTaxCode;
/**
 *  Function to validate tax value
 */
const validateTaxValue = (values) => {
    const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, [WorkspaceNewTaxForm_1.default.VALUE]);
    const value = values[WorkspaceNewTaxForm_1.default.VALUE];
    if (!(0, ValidationUtils_1.isValidPercentage)(value)) {
        errors[WorkspaceNewTaxForm_1.default.VALUE] = (0, Localize_1.translateLocal)('workspace.taxes.error.valuePercentageRange');
    }
    return errors;
};
exports.validateTaxValue = validateTaxValue;
/**
 * Get new tax ID
 */
function getNextTaxCode(name, taxRates) {
    const newID = covertTaxNameToID(name);
    if (!taxRates?.[newID]) {
        return newID;
    }
    // If the tax ID already exists, we need to find a unique ID
    let nextID = 1;
    while (taxRates?.[covertTaxNameToID(`${name}_${nextID}`)]) {
        nextID++;
    }
    return covertTaxNameToID(`${name}_${nextID}`);
}
function createPolicyTax(policyID, taxRate) {
    if (!taxRate.code) {
        console.debug('Policy or tax rates not found');
        return;
    }
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    taxRates: {
                        taxes: {
                            [taxRate.code]: {
                                ...taxRate,
                                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                            },
                        },
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    taxRates: {
                        taxes: {
                            [taxRate.code]: {
                                errors: null,
                                pendingAction: null,
                            },
                        },
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    taxRates: {
                        taxes: {
                            [taxRate.code]: {
                                errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('workspace.taxes.error.createFailureMessage'),
                            },
                        },
                    },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        taxFields: JSON.stringify({
            name: taxRate.name,
            value: taxRate.value,
            enabled: true,
            taxCode: taxRate.code,
        }),
    };
    API.write(types_1.WRITE_COMMANDS.CREATE_POLICY_TAX, parameters, onyxData);
}
function clearTaxRateFieldError(policyID, taxID, field) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
        taxRates: {
            taxes: {
                [taxID]: {
                    pendingFields: {
                        [field]: null,
                    },
                    errorFields: {
                        [field]: null,
                    },
                },
            },
        },
    });
}
function clearTaxRateError(policyID, taxID, pendingAction) {
    if (pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD) {
        react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
            taxRates: {
                taxes: {
                    [taxID]: null,
                },
            },
        });
        return;
    }
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, {
        taxRates: {
            taxes: {
                [taxID]: { pendingAction: null, errors: null, errorFields: null },
            },
        },
    });
}
function setPolicyTaxesEnabled(policy, taxesIDsToUpdate, isEnabled) {
    if (!policy) {
        return;
    }
    const originalTaxes = { ...policy.taxRates?.taxes };
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policy.id}`,
                value: {
                    taxRates: {
                        taxes: taxesIDsToUpdate.reduce((acc, taxID) => {
                            acc[taxID] = {
                                isDisabled: !isEnabled,
                                pendingFields: { isDisabled: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE },
                                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                                errorFields: { isDisabled: null },
                            };
                            return acc;
                        }, {}),
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policy.id}`,
                value: {
                    taxRates: {
                        taxes: taxesIDsToUpdate.reduce((acc, taxID) => {
                            acc[taxID] = { pendingFields: { isDisabled: null }, errorFields: { isDisabled: null }, pendingAction: null };
                            return acc;
                        }, {}),
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policy.id}`,
                value: {
                    taxRates: {
                        taxes: taxesIDsToUpdate.reduce((acc, taxID) => {
                            acc[taxID] = {
                                isDisabled: !!originalTaxes[taxID].isDisabled,
                                pendingFields: { isDisabled: null },
                                pendingAction: null,
                                errorFields: { isDisabled: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('workspace.taxes.error.updateFailureMessage') },
                            };
                            return acc;
                        }, {}),
                    },
                },
            },
        ],
    };
    const parameters = {
        policyID: policy.id,
        taxFieldsArray: JSON.stringify(taxesIDsToUpdate.map((taxID) => ({ taxCode: taxID, enabled: isEnabled }))),
    };
    API.write(types_1.WRITE_COMMANDS.SET_POLICY_TAXES_ENABLED, parameters, onyxData);
}
function deletePolicyTaxes(policy, taxesToDelete, localeCompare) {
    const policyTaxRates = policy?.taxRates?.taxes;
    const foreignTaxDefault = policy?.taxRates?.foreignTaxDefault;
    const firstTaxID = Object.keys(policyTaxRates ?? {})
        .sort((a, b) => localeCompare(a, b))
        .at(0);
    const distanceRateCustomUnit = (0, PolicyUtils_1.getDistanceRateCustomUnit)(policy);
    const customUnitID = distanceRateCustomUnit?.customUnitID;
    const ratesToUpdate = Object.values(distanceRateCustomUnit?.rates ?? {}).filter((rate) => !!rate.attributes?.taxRateExternalID && taxesToDelete.includes(rate.attributes?.taxRateExternalID));
    if (!policyTaxRates) {
        console.debug('Policy or tax rates not found');
        return;
    }
    const isForeignTaxRemoved = foreignTaxDefault && taxesToDelete.includes(foreignTaxDefault);
    const optimisticRates = {};
    const successRates = {};
    const failureRates = {};
    ratesToUpdate.forEach((rate) => {
        const rateID = rate.customUnitRateID;
        optimisticRates[rateID] = {
            attributes: {
                taxRateExternalID: null,
                taxClaimablePercentage: null,
            },
            pendingFields: {
                taxRateExternalID: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                taxClaimablePercentage: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
            },
        };
        successRates[rateID] = { pendingFields: { taxRateExternalID: null, taxClaimablePercentage: null } };
        failureRates[rateID] = {
            attributes: { ...rate?.attributes },
            pendingFields: { taxRateExternalID: null, taxClaimablePercentage: null },
            errorFields: {
                taxRateExternalID: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('common.genericErrorMessage'),
                taxClaimablePercentage: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('common.genericErrorMessage'),
            },
        };
    });
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policy.id}`,
                value: {
                    taxRates: {
                        pendingFields: { foreignTaxDefault: isForeignTaxRemoved ? CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE : null },
                        foreignTaxDefault: isForeignTaxRemoved ? firstTaxID : foreignTaxDefault,
                        taxes: taxesToDelete.reduce((acc, taxID) => {
                            acc[taxID] = { pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE, errors: null, isDisabled: true };
                            return acc;
                        }, {}),
                    },
                    customUnits: distanceRateCustomUnit &&
                        customUnitID && {
                        [customUnitID]: {
                            rates: optimisticRates,
                        },
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policy.id}`,
                value: {
                    taxRates: {
                        pendingFields: { foreignTaxDefault: null },
                        taxes: taxesToDelete.reduce((acc, taxID) => {
                            acc[taxID] = null;
                            return acc;
                        }, {}),
                    },
                    customUnits: distanceRateCustomUnit &&
                        customUnitID && {
                        [customUnitID]: {
                            rates: successRates,
                        },
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policy.id}`,
                value: {
                    taxRates: {
                        pendingFields: { foreignTaxDefault: null },
                        taxes: taxesToDelete.reduce((acc, taxID) => {
                            acc[taxID] = {
                                pendingAction: null,
                                errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('workspace.taxes.error.deleteFailureMessage'),
                                isDisabled: !!policyTaxRates?.[taxID]?.isDisabled,
                            };
                            return acc;
                        }, {}),
                    },
                    customUnits: distanceRateCustomUnit &&
                        customUnitID && {
                        [customUnitID]: {
                            rates: failureRates,
                        },
                    },
                },
            },
        ],
    };
    const parameters = {
        policyID: policy.id,
        taxNames: JSON.stringify(taxesToDelete.map((taxID) => policyTaxRates[taxID].name)),
    };
    API.write(types_1.WRITE_COMMANDS.DELETE_POLICY_TAXES, parameters, onyxData);
}
function updatePolicyTaxValue(policyID, taxID, taxValue, originalTaxRate) {
    const stringTaxValue = `${taxValue}%`;
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    taxRates: {
                        taxes: {
                            [taxID]: {
                                value: stringTaxValue,
                                pendingFields: { value: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE },
                                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                                errorFields: { value: null },
                            },
                        },
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    taxRates: {
                        taxes: {
                            [taxID]: { pendingFields: { value: null }, pendingAction: null, errorFields: { value: null } },
                        },
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    taxRates: {
                        taxes: {
                            [taxID]: {
                                value: originalTaxRate.value,
                                pendingFields: { value: null },
                                pendingAction: null,
                                errorFields: { value: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('workspace.taxes.error.updateFailureMessage') },
                            },
                        },
                    },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        taxCode: taxID,
        taxRate: stringTaxValue,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_POLICY_TAX_VALUE, parameters, onyxData);
}
function renamePolicyTax(policyID, taxID, newName, originalTaxRate) {
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    taxRates: {
                        taxes: {
                            [taxID]: {
                                name: newName,
                                pendingFields: { name: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE },
                                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                                errorFields: { name: null },
                            },
                        },
                    },
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    taxRates: {
                        taxes: {
                            [taxID]: { pendingFields: { name: null }, pendingAction: null, errorFields: { name: null } },
                        },
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    taxRates: {
                        taxes: {
                            [taxID]: {
                                name: originalTaxRate.name,
                                pendingFields: { name: null },
                                pendingAction: null,
                                errorFields: { name: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('workspace.taxes.error.updateFailureMessage') },
                            },
                        },
                    },
                },
            },
        ],
    };
    const parameters = {
        policyID,
        taxCode: taxID,
        newName,
    };
    API.write(types_1.WRITE_COMMANDS.RENAME_POLICY_TAX, parameters, onyxData);
}
function setPolicyTaxCode(policyID, oldTaxCode, newTaxCode, originalTaxRate, oldForeignTaxDefault, oldDefaultExternalID, distanceRateCustomUnit) {
    const optimisticDistanceRateCustomUnit = distanceRateCustomUnit && {
        ...distanceRateCustomUnit,
        rates: {
            ...Object.keys(distanceRateCustomUnit.rates).reduce((rates, rateID) => {
                if (distanceRateCustomUnit.rates[rateID].attributes?.taxRateExternalID === oldTaxCode) {
                    // eslint-disable-next-line no-param-reassign
                    rates[rateID] = {
                        attributes: {
                            taxRateExternalID: newTaxCode,
                        },
                    };
                }
                return rates;
            }, {}),
        },
    };
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    taxRates: {
                        defaultExternalID: oldTaxCode === oldDefaultExternalID ? newTaxCode : oldDefaultExternalID,
                        foreignTaxDefault: oldTaxCode === oldForeignTaxDefault ? newTaxCode : oldForeignTaxDefault,
                        taxes: {
                            [oldTaxCode]: null,
                            [newTaxCode]: {
                                ...originalTaxRate,
                                pendingFields: { ...originalTaxRate.pendingFields, code: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE },
                                pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                                errorFields: { code: null },
                                previousTaxCode: oldTaxCode,
                            },
                        },
                    },
                    ...(!!distanceRateCustomUnit && { customUnits: { [distanceRateCustomUnit.customUnitID]: optimisticDistanceRateCustomUnit } }),
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    taxRates: {
                        defaultExternalID: oldTaxCode === oldDefaultExternalID ? newTaxCode : oldDefaultExternalID,
                        foreignTaxDefault: oldTaxCode === oldForeignTaxDefault ? newTaxCode : oldForeignTaxDefault,
                        taxes: {
                            [oldTaxCode]: null,
                            [newTaxCode]: {
                                ...originalTaxRate,
                                code: newTaxCode,
                                pendingFields: { ...originalTaxRate.pendingFields, code: null },
                                pendingAction: null,
                                errorFields: { code: null },
                            },
                        },
                    },
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    taxRates: {
                        defaultExternalID: oldDefaultExternalID,
                        foreignTaxDefault: oldForeignTaxDefault,
                        taxes: {
                            [newTaxCode]: null,
                            [oldTaxCode]: {
                                ...originalTaxRate,
                                code: originalTaxRate.code,
                                pendingFields: { ...originalTaxRate.pendingFields, code: null },
                                pendingAction: null,
                                errorFields: { code: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('workspace.taxes.error.updateFailureMessage') },
                            },
                        },
                    },
                    ...(!!distanceRateCustomUnit && { customUnits: { [distanceRateCustomUnit.customUnitID]: distanceRateCustomUnit } }),
                },
            },
        ],
    };
    const parameters = {
        policyID,
        oldTaxCode,
        newTaxCode,
        taxID: originalTaxRate.name ?? '',
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_POLICY_TAX_CODE, parameters, onyxData);
}
