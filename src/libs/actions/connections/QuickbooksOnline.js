"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldShowQBOReimbursableExportDestinationAccountError = shouldShowQBOReimbursableExportDestinationAccountError;
exports.getQuickbooksOnlineSetupLink = getQuickbooksOnlineSetupLink;
exports.updateQuickbooksOnlineEnableNewCategories = updateQuickbooksOnlineEnableNewCategories;
exports.updateQuickbooksOnlineAutoCreateVendor = updateQuickbooksOnlineAutoCreateVendor;
exports.updateQuickbooksOnlineReimbursableExpensesAccount = updateQuickbooksOnlineReimbursableExpensesAccount;
exports.updateQuickbooksOnlineAutoSync = updateQuickbooksOnlineAutoSync;
exports.updateQuickbooksOnlineSyncPeople = updateQuickbooksOnlineSyncPeople;
exports.updateQuickbooksOnlineReimbursementAccountID = updateQuickbooksOnlineReimbursementAccountID;
exports.updateQuickbooksOnlinePreferredExporter = updateQuickbooksOnlinePreferredExporter;
exports.updateQuickbooksOnlineReceivableAccount = updateQuickbooksOnlineReceivableAccount;
exports.updateQuickbooksOnlineExportDate = updateQuickbooksOnlineExportDate;
exports.updateQuickbooksOnlineNonReimbursableExpensesAccount = updateQuickbooksOnlineNonReimbursableExpensesAccount;
exports.updateQuickbooksOnlineCollectionAccountID = updateQuickbooksOnlineCollectionAccountID;
exports.updateQuickbooksOnlineNonReimbursableBillDefaultVendor = updateQuickbooksOnlineNonReimbursableBillDefaultVendor;
exports.updateQuickbooksOnlineSyncTax = updateQuickbooksOnlineSyncTax;
exports.updateQuickbooksOnlineSyncClasses = updateQuickbooksOnlineSyncClasses;
exports.updateQuickbooksOnlineSyncLocations = updateQuickbooksOnlineSyncLocations;
exports.updateQuickbooksOnlineSyncCustomers = updateQuickbooksOnlineSyncCustomers;
exports.updateQuickbooksOnlineAccountingMethod = updateQuickbooksOnlineAccountingMethod;
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const ApiUtils_1 = require("@libs/ApiUtils");
const ErrorUtils = require("@libs/ErrorUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function getQuickbooksOnlineSetupLink(policyID) {
    const params = { policyID };
    const commandURL = (0, ApiUtils_1.getCommandURL)({
        command: types_1.READ_COMMANDS.CONNECT_POLICY_TO_QUICKBOOKS_ONLINE,
        shouldSkipWebProxy: true,
    });
    return commandURL + new URLSearchParams(params).toString();
}
function shouldShowQBOReimbursableExportDestinationAccountError(policy) {
    const qboConfig = policy?.connections?.quickbooksOnline?.config;
    return (0, PolicyUtils_1.isPolicyAdmin)(policy) && !!qboConfig?.reimbursableExpensesExportDestination && !qboConfig.reimbursableExpensesAccount;
}
function buildOnyxDataForMultipleQuickbooksConfigurations(policyID, configUpdate, configCurrentData) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                connections: {
                    [CONST_1.default.POLICY.CONNECTIONS.NAME.QBO]: {
                        config: {
                            ...configUpdate,
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
                    [CONST_1.default.POLICY.CONNECTIONS.NAME.QBO]: {
                        config: {
                            ...configCurrentData,
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
                    [CONST_1.default.POLICY.CONNECTIONS.NAME.QBO]: {
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
function buildOnyxDataForQuickbooksConfiguration(policyID, settingName, settingValue, oldSettingValue) {
    const exporterOptimisticData = settingName === CONST_1.default.QUICKBOOKS_CONFIG.EXPORT ? { exporter: settingValue } : {};
    const exporterErrorData = settingName === CONST_1.default.QUICKBOOKS_CONFIG.EXPORT ? { exporter: oldSettingValue } : {};
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                ...exporterOptimisticData,
                connections: {
                    [CONST_1.default.POLICY.CONNECTIONS.NAME.QBO]: {
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
                ...exporterErrorData,
                connections: {
                    [CONST_1.default.POLICY.CONNECTIONS.NAME.QBO]: {
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
                    [CONST_1.default.POLICY.CONNECTIONS.NAME.QBO]: {
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
function updateQuickbooksOnlineAutoSync(policyID, settingValue) {
    if (!policyID) {
        return;
    }
    const onyxData = buildOnyxDataForQuickbooksConfiguration(policyID, CONST_1.default.QUICKBOOKS_CONFIG.AUTO_SYNC, { enabled: settingValue }, { enabled: !settingValue });
    const parameters = {
        policyID,
        settingValue: JSON.stringify(settingValue),
        idempotencyKey: String(CONST_1.default.QUICKBOOKS_CONFIG.AUTO_SYNC),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_QUICKBOOKS_ONLINE_AUTO_SYNC, parameters, onyxData);
}
function updateQuickbooksOnlineEnableNewCategories(policyID, settingValue) {
    const onyxData = buildOnyxDataForQuickbooksConfiguration(policyID, CONST_1.default.QUICKBOOKS_CONFIG.ENABLE_NEW_CATEGORIES, settingValue, !settingValue);
    const parameters = {
        policyID,
        settingValue: JSON.stringify(settingValue),
        idempotencyKey: String(CONST_1.default.QUICKBOOKS_CONFIG.ENABLE_NEW_CATEGORIES),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_QUICKBOOKS_ONLINE_ENABLE_NEW_CATEGORIES, parameters, onyxData);
}
function updateQuickbooksOnlineAutoCreateVendor(policyID, configUpdate, configCurrentData) {
    if (!policyID) {
        return;
    }
    const onyxData = buildOnyxDataForMultipleQuickbooksConfigurations(policyID, configUpdate, configCurrentData);
    const parameters = {
        policyID,
        autoCreateVendor: JSON.stringify(configUpdate.autoCreateVendor),
        nonReimbursableBillDefaultVendor: JSON.stringify(configUpdate.nonReimbursableBillDefaultVendor),
        idempotencyKey: CONST_1.default.QUICKBOOKS_CONFIG.AUTO_CREATE_VENDOR,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_QUICKBOOKS_ONLINE_AUTO_CREATE_VENDOR, parameters, onyxData);
}
function updateQuickbooksOnlineSyncPeople(policyID, settingValue) {
    if (!policyID) {
        return;
    }
    const onyxData = buildOnyxDataForQuickbooksConfiguration(policyID, CONST_1.default.QUICKBOOKS_CONFIG.SYNC_PEOPLE, settingValue, !settingValue);
    const parameters = {
        policyID,
        settingValue: JSON.stringify(settingValue),
        idempotencyKey: String(CONST_1.default.QUICKBOOKS_CONFIG.SYNC_PEOPLE),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_QUICKBOOKS_ONLINE_SYNC_PEOPLE, parameters, onyxData);
}
function updateQuickbooksOnlineReimbursableExpensesAccount(policyID, settingValue, oldSettingValue) {
    const onyxData = buildOnyxDataForQuickbooksConfiguration(policyID, CONST_1.default.QUICKBOOKS_CONFIG.REIMBURSABLE_EXPENSES_ACCOUNT, settingValue, oldSettingValue);
    const parameters = {
        policyID,
        settingValue: JSON.stringify(settingValue),
        idempotencyKey: String(CONST_1.default.QUICKBOOKS_CONFIG.REIMBURSABLE_EXPENSES_ACCOUNT),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_QUICKBOOKS_ONLINE_REIMBURSABLE_EXPENSES_ACCOUNT, parameters, onyxData);
}
function updateQuickbooksOnlineSyncLocations(policyID, settingValue, oldSettingValue) {
    const onyxData = buildOnyxDataForQuickbooksConfiguration(policyID, CONST_1.default.QUICKBOOKS_CONFIG.SYNC_LOCATIONS, settingValue, oldSettingValue);
    const parameters = {
        policyID,
        settingValue: JSON.stringify(settingValue),
        idempotencyKey: String(CONST_1.default.QUICKBOOKS_CONFIG.SYNC_LOCATIONS),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_QUICKBOOKS_ONLINE_SYNC_LOCATIONS, parameters, onyxData);
}
function updateQuickbooksOnlineSyncCustomers(policyID, settingValue, oldSettingValue) {
    const onyxData = buildOnyxDataForQuickbooksConfiguration(policyID, CONST_1.default.QUICKBOOKS_CONFIG.SYNC_CUSTOMERS, settingValue, oldSettingValue);
    const parameters = {
        policyID,
        settingValue: JSON.stringify(settingValue),
        idempotencyKey: String(CONST_1.default.QUICKBOOKS_CONFIG.SYNC_CUSTOMERS),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_QUICKBOOKS_ONLINE_SYNC_CUSTOMERS, parameters, onyxData);
}
function updateQuickbooksOnlineSyncClasses(policyID, settingValue, oldSettingValue) {
    const onyxData = buildOnyxDataForQuickbooksConfiguration(policyID, CONST_1.default.QUICKBOOKS_CONFIG.SYNC_CLASSES, settingValue, oldSettingValue);
    const parameters = {
        policyID,
        settingValue: JSON.stringify(settingValue),
        idempotencyKey: String(CONST_1.default.QUICKBOOKS_CONFIG.SYNC_CLASSES),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_QUICKBOOKS_ONLINE_SYNC_CLASSES, parameters, onyxData);
}
function updateQuickbooksOnlineNonReimbursableBillDefaultVendor(policyID, settingValue, oldSettingValue) {
    const onyxData = buildOnyxDataForQuickbooksConfiguration(policyID, CONST_1.default.QUICKBOOKS_CONFIG.NON_REIMBURSABLE_BILL_DEFAULT_VENDOR, settingValue, oldSettingValue);
    const parameters = {
        policyID,
        settingValue: JSON.stringify(settingValue),
        idempotencyKey: String(CONST_1.default.QUICKBOOKS_CONFIG.NON_REIMBURSABLE_BILL_DEFAULT_VENDOR),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_QUICKBOOKS_ONLINE_NON_REIMBURSABLE_BILL_DEFAULT_VENDOR, parameters, onyxData);
}
function updateQuickbooksOnlineReceivableAccount(policyID, settingValue, oldSettingValue) {
    if (!policyID) {
        return;
    }
    const { optimisticData, failureData, successData } = buildOnyxDataForQuickbooksConfiguration(policyID, CONST_1.default.QUICKBOOKS_CONFIG.RECEIVABLE_ACCOUNT, settingValue, oldSettingValue);
    const parameters = {
        policyID,
        settingValue: JSON.stringify(settingValue),
        idempotencyKey: String(CONST_1.default.QUICKBOOKS_CONFIG.RECEIVABLE_ACCOUNT),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_QUICKBOOKS_ONLINE_RECEIVABLE_ACCOUNT, parameters, { optimisticData, failureData, successData });
}
function updateQuickbooksOnlineExportDate(policyID, settingValue, oldSettingValue) {
    const { optimisticData, failureData, successData } = buildOnyxDataForQuickbooksConfiguration(policyID, CONST_1.default.QUICKBOOKS_CONFIG.EXPORT_DATE, settingValue, oldSettingValue);
    const parameters = {
        policyID,
        settingValue: JSON.stringify(settingValue),
        idempotencyKey: String(CONST_1.default.QUICKBOOKS_CONFIG.EXPORT_DATE),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_QUICKBOOKS_ONLINE_EXPORT_DATE, parameters, { optimisticData, failureData, successData });
}
function updateQuickbooksOnlineNonReimbursableExpensesAccount(policyID, settingValue, oldSettingValue) {
    const { optimisticData, failureData, successData } = buildOnyxDataForQuickbooksConfiguration(policyID, CONST_1.default.QUICKBOOKS_CONFIG.NON_REIMBURSABLE_EXPENSES_ACCOUNT, settingValue, oldSettingValue);
    const parameters = {
        policyID,
        settingValue: JSON.stringify(settingValue),
        idempotencyKey: String(CONST_1.default.QUICKBOOKS_CONFIG.NON_REIMBURSABLE_EXPENSES_ACCOUNT),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_QUICKBOOKS_ONLINE_NON_REIMBURSABLE_EXPENSES_ACCOUNT, parameters, { optimisticData, failureData, successData });
}
function updateQuickbooksOnlineCollectionAccountID(policyID, settingValue, oldSettingValue) {
    if (settingValue === oldSettingValue || !policyID) {
        return;
    }
    const { optimisticData, failureData, successData } = buildOnyxDataForQuickbooksConfiguration(policyID, CONST_1.default.QUICKBOOKS_CONFIG.COLLECTION_ACCOUNT_ID, settingValue, oldSettingValue);
    const parameters = {
        policyID,
        settingValue: JSON.stringify(settingValue),
        idempotencyKey: String(CONST_1.default.QUICKBOOKS_CONFIG.COLLECTION_ACCOUNT_ID),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_QUICKBOOKS_ONLINE_COLLECTION_ACCOUNT_ID, parameters, { optimisticData, failureData, successData });
}
function updateQuickbooksOnlineAccountingMethod(policyID, accountingMethod, oldAccountingMethod) {
    if (!policyID) {
        return;
    }
    const onyxData = buildOnyxDataForQuickbooksConfiguration(policyID, CONST_1.default.QUICKBOOKS_CONFIG.ACCOUNTING_METHOD, accountingMethod, oldAccountingMethod);
    const parameters = {
        policyID,
        accountingMethod,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_QUICKBOOKS_ONLINE_ACCOUNTING_METHOD, parameters, onyxData);
}
function updateQuickbooksOnlineSyncTax(policyID, settingValue) {
    const onyxData = buildOnyxDataForQuickbooksConfiguration(policyID, CONST_1.default.QUICKBOOKS_CONFIG.SYNC_TAX, settingValue, !settingValue);
    const parameters = {
        policyID,
        settingValue: JSON.stringify(settingValue),
        idempotencyKey: String(CONST_1.default.QUICKBOOKS_CONFIG.SYNC_TAX),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_QUICKBOOKS_ONLINE_SYNC_TAX, parameters, onyxData);
}
function updateQuickbooksOnlineReimbursementAccountID(policyID, settingValue, oldSettingValue) {
    if (settingValue === oldSettingValue) {
        return;
    }
    const onyxData = buildOnyxDataForQuickbooksConfiguration(policyID, CONST_1.default.QUICKBOOKS_CONFIG.REIMBURSEMENT_ACCOUNT_ID, settingValue, oldSettingValue);
    const parameters = {
        policyID,
        settingValue: JSON.stringify(settingValue),
        idempotencyKey: String(CONST_1.default.QUICKBOOKS_CONFIG.REIMBURSEMENT_ACCOUNT_ID),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_QUICKBOOKS_ONLINE_REIMBURSEMENT_ACCOUNT_ID, parameters, onyxData);
}
function updateQuickbooksOnlinePreferredExporter(policyID, settingValue, oldSettingValue) {
    if (!policyID) {
        return;
    }
    const onyxData = buildOnyxDataForQuickbooksConfiguration(policyID, CONST_1.default.QUICKBOOKS_CONFIG.EXPORT, settingValue, oldSettingValue);
    const parameters = {
        policyID,
        settingValue: settingValue.exporter,
        idempotencyKey: String(CONST_1.default.QUICKBOOKS_CONFIG.EXPORT),
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_QUICKBOOKS_ONLINE_EXPORT, parameters, onyxData);
}
