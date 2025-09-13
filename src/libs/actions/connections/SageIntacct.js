"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToSageIntacct = connectToSageIntacct;
exports.updateSageIntacctBillable = updateSageIntacctBillable;
exports.updateSageIntacctSyncTaxConfiguration = updateSageIntacctSyncTaxConfiguration;
exports.addSageIntacctUserDimensions = addSageIntacctUserDimensions;
exports.updateSageIntacctMappingValue = updateSageIntacctMappingValue;
exports.editSageIntacctUserDimensions = editSageIntacctUserDimensions;
exports.removeSageIntacctUserDimensions = removeSageIntacctUserDimensions;
exports.removeSageIntacctUserDimensionsByName = removeSageIntacctUserDimensionsByName;
exports.updateSageIntacctExporter = updateSageIntacctExporter;
exports.clearSageIntacctErrorField = clearSageIntacctErrorField;
exports.clearSageIntacctPendingField = clearSageIntacctPendingField;
exports.updateSageIntacctExportDate = updateSageIntacctExportDate;
exports.updateSageIntacctReimbursableExpensesExportDestination = updateSageIntacctReimbursableExpensesExportDestination;
exports.updateSageIntacctNonreimbursableExpensesExportDestination = updateSageIntacctNonreimbursableExpensesExportDestination;
exports.updateSageIntacctNonreimbursableExpensesExportAccount = updateSageIntacctNonreimbursableExpensesExportAccount;
exports.updateSageIntacctDefaultVendor = updateSageIntacctDefaultVendor;
exports.updateSageIntacctAutoSync = updateSageIntacctAutoSync;
exports.updateSageIntacctImportEmployees = updateSageIntacctImportEmployees;
exports.updateSageIntacctApprovalMode = updateSageIntacctApprovalMode;
exports.updateSageIntacctSyncReimbursedReports = updateSageIntacctSyncReimbursedReports;
exports.updateSageIntacctSyncReimbursementAccountID = updateSageIntacctSyncReimbursementAccountID;
exports.updateSageIntacctEntity = updateSageIntacctEntity;
exports.updateSageIntacctAccountingMethod = updateSageIntacctAccountingMethod;
exports.changeMappingsValueFromDefaultToTag = changeMappingsValueFromDefaultToTag;
exports.UpdateSageIntacctTaxSolutionID = UpdateSageIntacctTaxSolutionID;
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const ErrorUtils = require("@libs/ErrorUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function connectToSageIntacct(policyID, credentials) {
    const parameters = {
        policyID,
        intacctCompanyID: credentials.companyID,
        intacctUserID: credentials.userID,
        intacctPassword: credentials.password,
    };
    API.write(types_1.WRITE_COMMANDS.CONNECT_POLICY_TO_SAGE_INTACCT, parameters, {});
}
function prepareOnyxDataForMappingUpdate(policyID, mappingName, mappingValue, oldMappingValue) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                connections: {
                    intacct: {
                        config: {
                            mappings: {
                                [mappingName]: mappingValue,
                            },
                            pendingFields: {
                                [mappingName]: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                            },
                            errorFields: {
                                [mappingName]: null,
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
                connections: {
                    intacct: {
                        config: {
                            mappings: {
                                [mappingName]: oldMappingValue ?? null,
                            },
                            pendingFields: {
                                [mappingName]: null,
                            },
                            errorFields: {
                                [mappingName]: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
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
                connections: {
                    intacct: {
                        config: {
                            pendingFields: {
                                [mappingName]: null,
                            },
                            errorFields: {
                                [mappingName]: undefined,
                            },
                        },
                    },
                },
            },
        },
    ];
    return { optimisticData, failureData, successData };
}
function updateSageIntacctBillable(policyID, enabled) {
    if (!policyID) {
        return;
    }
    const parameters = {
        policyID,
        enabled,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_SAGE_INTACCT_BILLABLE, parameters, prepareOnyxDataForMappingUpdate(policyID, CONST_1.default.SAGE_INTACCT_CONFIG.SYNC_ITEMS, enabled, !enabled));
}
function getCommandForMapping(mappingName) {
    switch (mappingName) {
        case CONST_1.default.SAGE_INTACCT_CONFIG.MAPPINGS.DEPARTMENTS:
            return types_1.WRITE_COMMANDS.UPDATE_SAGE_INTACCT_DEPARTMENT_MAPPING;
        case CONST_1.default.SAGE_INTACCT_CONFIG.MAPPINGS.CLASSES:
            return types_1.WRITE_COMMANDS.UPDATE_SAGE_INTACCT_CLASSES_MAPPING;
        case CONST_1.default.SAGE_INTACCT_CONFIG.MAPPINGS.LOCATIONS:
            return types_1.WRITE_COMMANDS.UPDATE_SAGE_INTACCT_LOCATIONS_MAPPING;
        case CONST_1.default.SAGE_INTACCT_CONFIG.MAPPINGS.CUSTOMERS:
            return types_1.WRITE_COMMANDS.UPDATE_SAGE_INTACCT_CUSTOMERS_MAPPING;
        case CONST_1.default.SAGE_INTACCT_CONFIG.MAPPINGS.PROJECTS:
            return types_1.WRITE_COMMANDS.UPDATE_SAGE_INTACCT_PROJECTS_MAPPING;
        default:
            return undefined;
    }
}
function updateSageIntacctMappingValue(policyID, mappingName, mappingValue, oldMappingValue) {
    const command = getCommandForMapping(mappingName);
    if (!command) {
        return;
    }
    const onyxData = prepareOnyxDataForMappingUpdate(policyID, mappingName, mappingValue, oldMappingValue);
    API.write(command, {
        policyID,
        mapping: mappingValue,
    }, onyxData);
}
function changeMappingsValueFromDefaultToTag(policyID, mappings) {
    if (mappings?.departments === CONST_1.default.SAGE_INTACCT_MAPPING_VALUE.DEFAULT) {
        updateSageIntacctMappingValue(policyID, CONST_1.default.SAGE_INTACCT_CONFIG.MAPPINGS.DEPARTMENTS, CONST_1.default.SAGE_INTACCT_MAPPING_VALUE.TAG, CONST_1.default.SAGE_INTACCT_MAPPING_VALUE.DEFAULT);
    }
    if (mappings?.classes === CONST_1.default.SAGE_INTACCT_MAPPING_VALUE.DEFAULT) {
        updateSageIntacctMappingValue(policyID, CONST_1.default.SAGE_INTACCT_CONFIG.MAPPINGS.CLASSES, CONST_1.default.SAGE_INTACCT_MAPPING_VALUE.TAG, CONST_1.default.SAGE_INTACCT_MAPPING_VALUE.DEFAULT);
    }
    if (mappings?.locations === CONST_1.default.SAGE_INTACCT_MAPPING_VALUE.DEFAULT) {
        updateSageIntacctMappingValue(policyID, CONST_1.default.SAGE_INTACCT_CONFIG.MAPPINGS.LOCATIONS, CONST_1.default.SAGE_INTACCT_MAPPING_VALUE.TAG, CONST_1.default.SAGE_INTACCT_MAPPING_VALUE.DEFAULT);
    }
}
function UpdateSageIntacctTaxSolutionID(policyID, taxSolutionID) {
    if (!policyID) {
        return;
    }
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                connections: {
                    intacct: {
                        config: {
                            tax: {
                                taxSolutionID,
                            },
                            pendingFields: {
                                tax: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                            },
                            errorFields: {
                                taxSolutionID: null,
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
                connections: {
                    intacct: {
                        config: {
                            tax: {
                                taxSolutionID: null,
                            },
                            pendingFields: {
                                tax: null,
                            },
                            errorFields: {
                                taxSolutionID: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
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
                connections: {
                    intacct: {
                        config: {
                            pendingFields: {
                                tax: null,
                            },
                            errorFields: {
                                taxSolutionID: null,
                            },
                        },
                    },
                },
            },
        },
    ];
    API.write(types_1.WRITE_COMMANDS.UPDATE_SAGE_INTACCT_TAX_SOLUTION_ID, { policyID, taxSolutionID }, { optimisticData, failureData, successData });
}
function updateSageIntacctSyncTaxConfiguration(policyID, enabled) {
    if (!policyID) {
        return;
    }
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                connections: {
                    intacct: {
                        config: {
                            tax: {
                                syncTax: enabled,
                            },
                            pendingFields: {
                                tax: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                            },
                            errorFields: {
                                tax: null,
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
                connections: {
                    intacct: {
                        config: {
                            tax: {
                                syncTax: !enabled,
                            },
                            pendingFields: {
                                tax: null,
                            },
                            errorFields: {
                                tax: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
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
                connections: {
                    intacct: {
                        config: {
                            pendingFields: {
                                tax: null,
                            },
                            errorFields: {
                                tax: undefined,
                            },
                        },
                    },
                },
            },
        },
    ];
    API.write(types_1.WRITE_COMMANDS.UPDATE_SAGE_INTACCT_SYNC_TAX_CONFIGURATION, { policyID, enabled }, { optimisticData, failureData, successData });
}
function prepareOnyxDataForUserDimensionUpdate(policyID, dimensionName, newDimensions, oldDimensions, oldDimensionName, pendingAction) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                connections: {
                    intacct: {
                        config: {
                            mappings: {
                                dimensions: newDimensions,
                            },
                            pendingFields: { [`${CONST_1.default.SAGE_INTACCT_CONFIG.DIMENSION_PREFIX}${dimensionName}`]: pendingAction },
                            errorFields: { [`${CONST_1.default.SAGE_INTACCT_CONFIG.DIMENSION_PREFIX}${dimensionName}`]: null },
                        },
                    },
                },
            },
        },
    ];
    const pendingActionAfterFailure = pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD ? pendingAction : null;
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                connections: {
                    intacct: {
                        config: {
                            mappings: {
                                dimensions: oldDimensions,
                            },
                            pendingFields: { [`${CONST_1.default.SAGE_INTACCT_CONFIG.DIMENSION_PREFIX}${oldDimensionName}`]: pendingActionAfterFailure },
                            errorFields: {
                                [`${CONST_1.default.SAGE_INTACCT_CONFIG.DIMENSION_PREFIX}${oldDimensionName}`]: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
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
                connections: {
                    intacct: {
                        config: {
                            mappings: {
                                dimensions: newDimensions,
                            },
                            pendingFields: { [`${CONST_1.default.SAGE_INTACCT_CONFIG.DIMENSION_PREFIX}${dimensionName}`]: null },
                            errorFields: { [`${CONST_1.default.SAGE_INTACCT_CONFIG.DIMENSION_PREFIX}${dimensionName}`]: null },
                        },
                    },
                },
            },
        },
    ];
    return { optimisticData, failureData, successData };
}
function addSageIntacctUserDimensions(policyID, dimensionName, mapping, existingUserDimensions) {
    const newDimensions = [...existingUserDimensions, { mapping, dimension: dimensionName }];
    API.write(types_1.WRITE_COMMANDS.UPDATE_SAGE_INTACCT_USER_DIMENSION, { policyID, dimensions: JSON.stringify(newDimensions) }, prepareOnyxDataForUserDimensionUpdate(policyID, dimensionName, newDimensions, newDimensions, dimensionName, CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD));
}
function editSageIntacctUserDimensions(policyID, previousName, name, mapping, existingUserDimensions) {
    const newDimensions = existingUserDimensions.map((userDimension) => {
        if (userDimension.dimension === previousName) {
            return { dimension: name, mapping };
        }
        return userDimension;
    });
    API.write(types_1.WRITE_COMMANDS.UPDATE_SAGE_INTACCT_USER_DIMENSION, { policyID, dimensions: JSON.stringify(newDimensions) }, prepareOnyxDataForUserDimensionUpdate(policyID, name, newDimensions, existingUserDimensions, previousName, CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE));
}
function removeSageIntacctUserDimensions(policyID, dimensionName, existingUserDimensions) {
    const newDimensions = existingUserDimensions.filter((userDimension) => dimensionName !== userDimension.dimension);
    API.write(types_1.WRITE_COMMANDS.UPDATE_SAGE_INTACCT_USER_DIMENSION, { policyID, dimensions: JSON.stringify(newDimensions) }, prepareOnyxDataForUserDimensionUpdate(policyID, dimensionName, newDimensions, existingUserDimensions, dimensionName, CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE));
}
function prepareOnyxDataForExportUpdate(policyID, settingName, settingValue, oldSettingValue) {
    const exporterOptimisticData = settingName === CONST_1.default.SAGE_INTACCT_CONFIG.EXPORTER ? { exporter: settingValue } : {};
    const exporterErrorData = settingName === CONST_1.default.SAGE_INTACCT_CONFIG.EXPORTER ? { exporter: oldSettingValue } : {};
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                ...exporterOptimisticData,
                connections: {
                    intacct: {
                        config: {
                            export: {
                                [settingName]: settingValue,
                            },
                            pendingFields: {
                                [settingName]: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                            },
                            errorFields: {
                                [settingName]: null,
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
                ...exporterErrorData,
                connections: {
                    intacct: {
                        config: {
                            export: {
                                [settingName]: oldSettingValue ?? null,
                            },
                            pendingFields: {
                                [settingName]: null,
                            },
                            errorFields: {
                                [settingName]: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
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
                connections: {
                    intacct: {
                        config: {
                            pendingFields: {
                                [settingName]: null,
                            },
                            errorFields: {
                                [settingName]: null,
                            },
                        },
                    },
                },
            },
        },
    ];
    return { optimisticData, failureData, successData };
}
function updateSageIntacctExporter(policyID, exporter, oldExporter) {
    const { optimisticData, failureData, successData } = prepareOnyxDataForExportUpdate(policyID, CONST_1.default.SAGE_INTACCT_CONFIG.EXPORTER, exporter, oldExporter);
    const parameters = {
        policyID,
        email: exporter,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_SAGE_INTACCT_EXPORTER, parameters, { optimisticData, failureData, successData });
}
function updateSageIntacctExportDate(policyID, date, oldDate) {
    const { optimisticData, failureData, successData } = prepareOnyxDataForExportUpdate(policyID, CONST_1.default.SAGE_INTACCT_CONFIG.EXPORT_DATE, date, oldDate);
    const parameters = {
        policyID,
        value: date,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_SAGE_INTACCT_EXPORT_DATE, parameters, { optimisticData, failureData, successData });
}
function updateSageIntacctReimbursableExpensesExportDestination(policyID, reimbursable, oldReimbursable) {
    const { optimisticData, failureData, successData } = prepareOnyxDataForExportUpdate(policyID, CONST_1.default.SAGE_INTACCT_CONFIG.REIMBURSABLE, reimbursable, oldReimbursable);
    const parameters = {
        policyID,
        value: reimbursable,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_SAGE_INTACCT_REIMBURSABLE_EXPENSES_EXPORT_DESTINATION, parameters, { optimisticData, failureData, successData });
}
function updateSageIntacctNonreimbursableExpensesExportDestination(policyID, nonReimbursable, oldNonReimbursable) {
    const { optimisticData, failureData, successData } = prepareOnyxDataForExportUpdate(policyID, CONST_1.default.SAGE_INTACCT_CONFIG.NON_REIMBURSABLE, nonReimbursable, oldNonReimbursable);
    const parameters = {
        policyID,
        value: nonReimbursable,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_SAGE_INTACCT_NON_REIMBURSABLE_EXPENSES_EXPORT_DESTINATION, parameters, { optimisticData, failureData, successData });
}
function updateSageIntacctReimbursableExpensesReportExportDefaultVendor(policyID, vendor, oldVendor) {
    const { optimisticData, failureData, successData } = prepareOnyxDataForExportUpdate(policyID, CONST_1.default.SAGE_INTACCT_CONFIG.REIMBURSABLE_VENDOR, vendor, oldVendor);
    const parameters = {
        policyID,
        vendorID: vendor,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_SAGE_INTACCT_REIMBURSABLE_EXPENSES_REPORT_EXPORT_DEFAULT_VENDOR, parameters, { optimisticData, failureData, successData });
}
function updateSageIntacctNonreimbursableExpensesCreditCardChargeExportDefaultVendor(policyID, vendor, oldVendor) {
    const { optimisticData, failureData, successData } = prepareOnyxDataForExportUpdate(policyID, CONST_1.default.SAGE_INTACCT_CONFIG.NON_REIMBURSABLE_CREDIT_CARD_VENDOR, vendor, oldVendor);
    const parameters = {
        policyID,
        vendorID: vendor,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_SAGE_INTACCT_NON_REIMBURSABLE_EXPENSES_CREDIT_CARD_CHARGE_EXPORT_DEFAULT_VENDOR, parameters, { optimisticData, failureData, successData });
}
function updateSageIntacctNonreimbursableExpensesExportAccount(policyID, nonReimbursableAccount, oldReimbursableAccount) {
    const { optimisticData, failureData, successData } = prepareOnyxDataForExportUpdate(policyID, CONST_1.default.SAGE_INTACCT_CONFIG.NON_REIMBURSABLE_ACCOUNT, nonReimbursableAccount, oldReimbursableAccount);
    const parameters = {
        policyID,
        creditCardAccountID: nonReimbursableAccount,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_SAGE_INTACCT_NON_REIMBURSABLE_EXPENSES_EXPORT_ACCOUNT, parameters, { optimisticData, failureData, successData });
}
function updateSageIntacctNonreimbursableExpensesExportVendor(policyID, vendor, oldVendor) {
    const { optimisticData, failureData, successData } = prepareOnyxDataForExportUpdate(policyID, CONST_1.default.SAGE_INTACCT_CONFIG.NON_REIMBURSABLE_VENDOR, vendor, oldVendor);
    const parameters = {
        policyID,
        vendorID: vendor,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_SAGE_INTACCT_NON_REIMBURSABLE_EXPENSES_EXPORT_VENDOR, parameters, { optimisticData, failureData, successData });
}
function updateSageIntacctDefaultVendor(policyID, settingName, vendor, oldVendor) {
    if (settingName === CONST_1.default.SAGE_INTACCT_CONFIG.REIMBURSABLE_VENDOR) {
        updateSageIntacctReimbursableExpensesReportExportDefaultVendor(policyID, vendor, oldVendor);
    }
    else if (settingName === CONST_1.default.SAGE_INTACCT_CONFIG.NON_REIMBURSABLE_CREDIT_CARD_VENDOR) {
        updateSageIntacctNonreimbursableExpensesCreditCardChargeExportDefaultVendor(policyID, vendor, oldVendor);
    }
    else if (settingName === CONST_1.default.SAGE_INTACCT_CONFIG.NON_REIMBURSABLE_VENDOR) {
        updateSageIntacctNonreimbursableExpensesExportVendor(policyID, vendor, oldVendor);
    }
}
function clearSageIntacctErrorField(policyID, key) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { connections: { intacct: { config: { errorFields: { [key]: null } } } } });
}
function clearSageIntacctPendingField(policyID, key) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { connections: { intacct: { config: { pendingFields: { [key]: null } } } } });
}
function removeSageIntacctUserDimensionsByName(dimensions, policyID, dimensionName) {
    const Dimensions = dimensions.filter((dimension) => dimension.dimension !== dimensionName);
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { connections: { intacct: { config: { mappings: { dimensions: Dimensions } } } } });
}
function prepareOnyxDataForConfigUpdate(policyID, settingName, settingValue, oldSettingValue) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                connections: {
                    intacct: {
                        config: {
                            [settingName]: settingValue,
                            pendingFields: {
                                [settingName]: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                            },
                            errorFields: {
                                [settingName]: null,
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
                connections: {
                    intacct: {
                        config: {
                            [settingName]: oldSettingValue ?? null,
                            pendingFields: {
                                [settingName]: null,
                            },
                            errorFields: {
                                [settingName]: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
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
                connections: {
                    intacct: {
                        config: {
                            pendingFields: {
                                [settingName]: null,
                            },
                            errorFields: {
                                [settingName]: null,
                            },
                        },
                    },
                },
            },
        },
    ];
    return { optimisticData, failureData, successData };
}
function prepareOnyxDataForSyncUpdate(policyID, settingName, settingValue, oldSettingValue) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                connections: {
                    intacct: {
                        config: {
                            sync: {
                                [settingName]: settingValue,
                            },
                            pendingFields: {
                                [settingName]: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                            },
                            errorFields: {
                                [settingName]: null,
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
                connections: {
                    intacct: {
                        config: {
                            sync: {
                                [settingName]: oldSettingValue ?? null,
                            },
                            pendingFields: {
                                [settingName]: null,
                            },
                            errorFields: {
                                [settingName]: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
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
                connections: {
                    intacct: {
                        config: {
                            pendingFields: {
                                [settingName]: null,
                            },
                            errorFields: {
                                [settingName]: null,
                            },
                        },
                    },
                },
            },
        },
    ];
    return { optimisticData, failureData, successData };
}
function prepareOnyxDataForAutoSyncUpdate(policyID, settingName, settingValue) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                connections: {
                    intacct: {
                        config: {
                            autoSync: {
                                [settingName]: settingValue,
                            },
                            pendingFields: {
                                [settingName]: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                            },
                            errorFields: {
                                [settingName]: null,
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
                connections: {
                    intacct: {
                        config: {
                            autoSync: {
                                [settingName]: !settingValue,
                            },
                            pendingFields: {
                                [settingName]: null,
                            },
                            errorFields: {
                                [settingName]: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
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
                connections: {
                    intacct: {
                        config: {
                            pendingFields: {
                                [settingName]: null,
                            },
                            errorFields: {
                                [settingName]: null,
                            },
                        },
                    },
                },
            },
        },
    ];
    return { optimisticData, failureData, successData };
}
function updateSageIntacctAutoSync(policyID, enabled) {
    if (!policyID) {
        return;
    }
    const { optimisticData, failureData, successData } = prepareOnyxDataForAutoSyncUpdate(policyID, CONST_1.default.SAGE_INTACCT_CONFIG.AUTO_SYNC_ENABLED, enabled);
    const parameters = {
        policyID,
        enabled,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_SAGE_INTACCT_AUTO_SYNC, parameters, { optimisticData, failureData, successData });
}
function updateSageIntacctImportEmployees(policyID, enabled) {
    if (!policyID) {
        return;
    }
    const { optimisticData, failureData, successData } = prepareOnyxDataForConfigUpdate(policyID, CONST_1.default.SAGE_INTACCT_CONFIG.IMPORT_EMPLOYEES, enabled, !enabled);
    const parameters = {
        policyID,
        enabled,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_SAGE_INTACCT_IMPORT_EMPLOYEES, parameters, { optimisticData, failureData, successData });
}
function updateSageIntacctApprovalMode(policyID, enabled) {
    if (!policyID) {
        return;
    }
    const approvalModeSettingValue = enabled ? CONST_1.default.SAGE_INTACCT.APPROVAL_MODE.APPROVAL_MANUAL : '';
    const oldApprovalModeSettingValue = enabled ? '' : CONST_1.default.SAGE_INTACCT.APPROVAL_MODE.APPROVAL_MANUAL;
    const { optimisticData, failureData, successData } = prepareOnyxDataForConfigUpdate(policyID, CONST_1.default.SAGE_INTACCT_CONFIG.APPROVAL_MODE, approvalModeSettingValue, oldApprovalModeSettingValue);
    const parameters = {
        policyID,
        value: approvalModeSettingValue,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_SAGE_INTACCT_APPROVAL_MODE, parameters, { optimisticData, failureData, successData });
}
function updateSageIntacctSyncReimbursedReports(policyID, enabled) {
    if (!policyID) {
        return;
    }
    const { optimisticData, failureData, successData } = prepareOnyxDataForSyncUpdate(policyID, CONST_1.default.SAGE_INTACCT_CONFIG.SYNC_REIMBURSED_REPORTS, enabled, !enabled);
    const parameters = {
        policyID,
        enabled,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_SAGE_INTACCT_SYNC_REIMBURSED_REPORTS, parameters, { optimisticData, failureData, successData });
}
function updateSageIntacctSyncReimbursementAccountID(policyID, vendorID, oldVendorID) {
    if (!policyID || !vendorID) {
        return;
    }
    const { optimisticData, failureData, successData } = prepareOnyxDataForSyncUpdate(policyID, CONST_1.default.SAGE_INTACCT_CONFIG.REIMBURSEMENT_ACCOUNT_ID, vendorID, oldVendorID);
    const parameters = {
        policyID,
        vendorID,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_SAGE_INTACCT_SYNC_REIMBURSEMENT_ACCOUNT_ID, parameters, { optimisticData, failureData, successData });
}
function updateSageIntacctEntity(policyID, entity, oldEntity) {
    const parameters = {
        policyID,
        entity,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_SAGE_INTACCT_ENTITY, parameters, prepareOnyxDataForConfigUpdate(policyID, CONST_1.default.SAGE_INTACCT_CONFIG.ENTITY, entity, oldEntity));
}
function updateSageIntacctAccountingMethod(policyID, accountingMethod, oldAccountingMethod) {
    if (!policyID) {
        return;
    }
    const parameters = {
        policyID,
        accountingMethod,
    };
    const { optimisticData, failureData, successData } = prepareOnyxDataForExportUpdate(policyID, CONST_1.default.SAGE_INTACCT_CONFIG.ACCOUNTING_METHOD, accountingMethod, oldAccountingMethod);
    API.write(types_1.WRITE_COMMANDS.UPDATE_SAGE_INTACCT_ACCOUNTING_METHOD, parameters, { optimisticData, failureData, successData });
}
