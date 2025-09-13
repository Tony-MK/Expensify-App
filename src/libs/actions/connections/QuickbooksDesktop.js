"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQuickbooksDesktopAutoSync = updateQuickbooksDesktopAutoSync;
exports.updateQuickbooksDesktopPreferredExporter = updateQuickbooksDesktopPreferredExporter;
exports.updateQuickbooksDesktopMarkChecksToBePrinted = updateQuickbooksDesktopMarkChecksToBePrinted;
exports.updateQuickbooksDesktopNonReimbursableBillDefaultVendor = updateQuickbooksDesktopNonReimbursableBillDefaultVendor;
exports.updateQuickbooksDesktopShouldAutoCreateVendor = updateQuickbooksDesktopShouldAutoCreateVendor;
exports.updateQuickbooksDesktopNonReimbursableExpensesAccount = updateQuickbooksDesktopNonReimbursableExpensesAccount;
exports.updateQuickbooksDesktopExpensesExportDestination = updateQuickbooksDesktopExpensesExportDestination;
exports.updateQuickbooksDesktopReimbursableExpensesAccount = updateQuickbooksDesktopReimbursableExpensesAccount;
exports.getQuickbooksDesktopCodatSetupLink = getQuickbooksDesktopCodatSetupLink;
exports.updateQuickbooksCompanyCardExpenseAccount = updateQuickbooksCompanyCardExpenseAccount;
exports.updateQuickbooksDesktopEnableNewCategories = updateQuickbooksDesktopEnableNewCategories;
exports.updateQuickbooksDesktopExportDate = updateQuickbooksDesktopExportDate;
exports.updateQuickbooksDesktopSyncClasses = updateQuickbooksDesktopSyncClasses;
exports.updateQuickbooksDesktopSyncCustomers = updateQuickbooksDesktopSyncCustomers;
exports.updateQuickbooksDesktopSyncItems = updateQuickbooksDesktopSyncItems;
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const ErrorUtils = require("@libs/ErrorUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function buildOnyxDataForMultipleQuickbooksExportConfigurations(policyID, configUpdate, configCurrentData) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                connections: {
                    [CONST_1.default.POLICY.CONNECTIONS.NAME.QBD]: {
                        config: {
                            export: configUpdate,
                            pendingFields: Object.fromEntries(Object.keys(configUpdate).map((settingName) => [settingName, CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE])),
                            errorFields: Object.fromEntries(Object.keys(configUpdate).map((settingName) => [settingName, null])),
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
                    [CONST_1.default.POLICY.CONNECTIONS.NAME.QBD]: {
                        config: {
                            export: configCurrentData,
                            pendingFields: Object.fromEntries(Object.keys(configUpdate).map((settingName) => [settingName, null])),
                            errorFields: Object.fromEntries(Object.keys(configUpdate).map((settingName) => [settingName, ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage')])),
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
                    [CONST_1.default.POLICY.CONNECTIONS.NAME.QBD]: {
                        config: {
                            pendingFields: Object.fromEntries(Object.keys(configUpdate).map((settingName) => [settingName, null])),
                            errorFields: Object.fromEntries(Object.keys(configUpdate).map((settingName) => [settingName, null])),
                        },
                    },
                },
            },
        },
    ];
    return {
        optimisticData,
        failureData,
        successData,
    };
}
function buildOnyxDataForQuickbooksExportConfiguration(policyID, settingName, settingValue, oldSettingValue) {
    const exporterOptimisticData = settingName === CONST_1.default.QUICKBOOKS_CONFIG.EXPORTER ? { exporter: settingValue } : {};
    const exporterErrorData = settingName === CONST_1.default.QUICKBOOKS_CONFIG.EXPORTER ? { exporter: oldSettingValue } : {};
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                ...exporterOptimisticData,
                connections: {
                    [CONST_1.default.POLICY.CONNECTIONS.NAME.QBD]: {
                        config: {
                            export: {
                                [settingName]: settingValue ?? null,
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
                    [CONST_1.default.POLICY.CONNECTIONS.NAME.QBD]: {
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
                    [CONST_1.default.POLICY.CONNECTIONS.NAME.QBD]: {
                        config: {
                            export: {
                                [settingName]: settingValue ?? null,
                            },
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
    return {
        optimisticData,
        failureData,
        successData,
    };
}
function buildOnyxDataForQuickbooksDesktopMappingsConfiguration(policyID, settingName, settingValue, oldSettingValue) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                connections: {
                    [CONST_1.default.POLICY.CONNECTIONS.NAME.QBD]: {
                        config: {
                            mappings: {
                                [settingName]: settingValue ?? null,
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
                    [CONST_1.default.POLICY.CONNECTIONS.NAME.QBD]: {
                        config: {
                            mappings: {
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
                    [CONST_1.default.POLICY.CONNECTIONS.NAME.QBD]: {
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
    return {
        optimisticData,
        failureData,
        successData,
    };
}
function buildOnyxDataForQuickbooksConfiguration(policyID, settingName, settingValue, oldSettingValue) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                connections: {
                    [CONST_1.default.POLICY.CONNECTIONS.NAME.QBD]: {
                        config: {
                            [settingName]: settingValue ?? null,
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
                    [CONST_1.default.POLICY.CONNECTIONS.NAME.QBD]: {
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
                    [CONST_1.default.POLICY.CONNECTIONS.NAME.QBD]: {
                        config: {
                            [settingName]: settingValue ?? null,
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
    return {
        optimisticData,
        failureData,
        successData,
    };
}
function getQuickbooksDesktopCodatSetupLink(policyID) {
    const params = { policyID };
    // eslint-disable-next-line rulesdir/no-api-side-effects-method
    return API.makeRequestWithSideEffects(types_1.SIDE_EFFECT_REQUEST_COMMANDS.CONNECT_POLICY_TO_QUICKBOOKS_DESKTOP, params);
}
function updateQuickbooksDesktopExpensesExportDestination(policyID, configUpdate, configCurrentData) {
    const onyxData = buildOnyxDataForMultipleQuickbooksExportConfigurations(policyID, configUpdate, configCurrentData);
    const parameters = {
        policyID,
        reimbursableExpensesExportDestination: configUpdate.reimbursable,
        reimbursableExpensesAccount: configUpdate?.reimbursableAccount,
        idempotencyKey: String(CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.REIMBURSABLE),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_QUICKBOOKS_DESKTOP_REIMBURSABLE_EXPENSES_EXPORT_DESTINATION, parameters, onyxData);
}
function updateQuickbooksCompanyCardExpenseAccount(policyID, configUpdate, configCurrentData) {
    const onyxData = buildOnyxDataForMultipleQuickbooksExportConfigurations(policyID, configUpdate, configCurrentData);
    const parameters = {
        policyID,
        nonReimbursableExpensesExportDestination: configUpdate.nonReimbursable,
        nonReimbursableExpensesAccount: configUpdate?.nonReimbursableAccount,
        nonReimbursableBillDefaultVendor: configUpdate.nonReimbursableBillDefaultVendor,
        idempotencyKey: String(CONST_1.default.QUICKBOOKS_CONFIG.NON_REIMBURSABLE_EXPENSES_EXPORT_DESTINATION),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_QUICKBOOKS_DESKTOP_NON_REIMBURSABLE_EXPENSES_EXPORT_DESTINATION, parameters, onyxData);
}
function updateQuickbooksDesktopShouldAutoCreateVendor(policyID, settingValue) {
    if (!policyID) {
        return;
    }
    const onyxData = buildOnyxDataForQuickbooksConfiguration(policyID, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.SHOULD_AUTO_CREATE_VENDOR, settingValue, !settingValue);
    const parameters = {
        policyID,
        settingValue: JSON.stringify(settingValue),
        idempotencyKey: String(CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.SHOULD_AUTO_CREATE_VENDOR),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_QUICKBOOKS_DESKTOP_AUTO_CREATE_VENDOR, parameters, onyxData);
}
function updateQuickbooksDesktopMarkChecksToBePrinted(policyID, settingValue) {
    const onyxData = buildOnyxDataForQuickbooksConfiguration(policyID, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.MARK_CHECKS_TO_BE_PRINTED, settingValue, !settingValue);
    const parameters = {
        policyID,
        settingValue: JSON.stringify(settingValue),
        idempotencyKey: String(CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.MARK_CHECKS_TO_BE_PRINTED),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_QUICKBOOKS_DESKTOP_MARK_CHECKS_TO_BE_PRINTED, parameters, onyxData);
}
function updateQuickbooksDesktopReimbursableExpensesAccount(policyID, settingValue, oldSettingValue) {
    const onyxData = buildOnyxDataForQuickbooksExportConfiguration(policyID, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.REIMBURSABLE_ACCOUNT, settingValue, oldSettingValue);
    const parameters = {
        policyID,
        settingValue,
        idempotencyKey: String(CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.REIMBURSABLE_ACCOUNT),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_QUICKBOOKS_DESKTOP_REIMBURSABLE_EXPENSES_ACCOUNT, parameters, onyxData);
}
function updateQuickbooksDesktopEnableNewCategories(policyID, settingValue) {
    const onyxData = buildOnyxDataForQuickbooksConfiguration(policyID, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.ENABLE_NEW_CATEGORIES, settingValue, !settingValue);
    const parameters = {
        policyID,
        settingValue: JSON.stringify(settingValue),
        idempotencyKey: String(CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.ENABLE_NEW_CATEGORIES),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_QUICKBOOKS_DESKTOP_ENABLE_NEW_CATEGORIES, parameters, onyxData);
}
function updateQuickbooksDesktopSyncClasses(policyID, settingValue, oldSettingValue) {
    const onyxData = buildOnyxDataForQuickbooksDesktopMappingsConfiguration(policyID, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.MAPPINGS.CLASSES, settingValue, oldSettingValue);
    const parameters = {
        policyID,
        settingValue,
        idempotencyKey: String(CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.MAPPINGS.CLASSES),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_QUICKBOOKS_DESKTOP_SYNC_CLASSES, parameters, onyxData);
}
function updateQuickbooksDesktopSyncCustomers(policyID, settingValue, oldSettingValue) {
    const onyxData = buildOnyxDataForQuickbooksDesktopMappingsConfiguration(policyID, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.MAPPINGS.CUSTOMERS, settingValue, oldSettingValue);
    const parameters = {
        policyID,
        settingValue,
        idempotencyKey: String(CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.MAPPINGS.CUSTOMERS),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_QUICKBOOKS_DESKTOP_SYNC_CUSTOMERS, parameters, onyxData);
}
function updateQuickbooksDesktopSyncItems(policyID, settingValue, oldSettingValue) {
    const onyxData = buildOnyxDataForQuickbooksConfiguration(policyID, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.IMPORT_ITEMS, settingValue, oldSettingValue);
    const parameters = {
        policyID,
        settingValue: JSON.stringify(settingValue),
        idempotencyKey: String(CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.IMPORT_ITEMS),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_QUICKBOOKS_DESKTOP_SYNC_ITEMS, parameters, onyxData);
}
function updateQuickbooksDesktopPreferredExporter(policyID, settingValue, oldSettingValue) {
    const onyxData = buildOnyxDataForQuickbooksExportConfiguration(policyID, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.EXPORTER, settingValue, oldSettingValue);
    const parameters = {
        policyID,
        settingValue,
        idempotencyKey: String(CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.EXPORTER),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_QUICKBOOKS_DESKTOP_EXPORT, parameters, onyxData);
}
function updateQuickbooksDesktopNonReimbursableExpensesAccount(policyID, settingValue, oldSettingValue) {
    const onyxData = buildOnyxDataForQuickbooksExportConfiguration(policyID, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.NON_REIMBURSABLE_ACCOUNT, settingValue, oldSettingValue);
    const parameters = {
        policyID,
        settingValue,
        idempotencyKey: String(CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.NON_REIMBURSABLE_ACCOUNT),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_QUICKBOOKS_DESKTOP_NON_REIMBURSABLE_EXPENSES_ACCOUNT, parameters, onyxData);
}
function updateQuickbooksDesktopNonReimbursableBillDefaultVendor(policyID, settingValue, oldSettingValue) {
    const onyxData = buildOnyxDataForQuickbooksExportConfiguration(policyID, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.NON_REIMBURSABLE_BILL_DEFAULT_VENDOR, settingValue, oldSettingValue);
    const parameters = {
        policyID,
        settingValue,
        idempotencyKey: String(CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.NON_REIMBURSABLE_BILL_DEFAULT_VENDOR),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_QUICKBOOKS_DESKTOP_NON_REIMBURSABLE_BILL_DEFAULT_VENDOR, parameters, onyxData);
}
function updateQuickbooksDesktopExportDate(policyID, settingValue, oldSettingValue) {
    const onyxData = buildOnyxDataForQuickbooksExportConfiguration(policyID, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.EXPORT_DATE, settingValue, oldSettingValue);
    const parameters = {
        policyID,
        settingValue,
        idempotencyKey: String(CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.EXPORT_DATE),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_QUICKBOOKS_DESKTOP_EXPORT_DATE, parameters, onyxData);
}
function updateQuickbooksDesktopAutoSync(policyID, settingValue) {
    const onyxData = buildOnyxDataForQuickbooksConfiguration(policyID, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.AUTO_SYNC, { enabled: settingValue }, { enabled: !settingValue });
    const parameters = {
        policyID,
        settingValue: JSON.stringify(settingValue),
        idempotencyKey: String(CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.AUTO_SYNC),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_QUICKBOOKS_DESKTOP_AUTO_SYNC, parameters, onyxData);
}
