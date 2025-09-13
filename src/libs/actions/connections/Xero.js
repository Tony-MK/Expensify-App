"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrackingCategories = exports.getXeroSetupLink = void 0;
exports.updateXeroImportTrackingCategories = updateXeroImportTrackingCategories;
exports.updateXeroImportTaxRates = updateXeroImportTaxRates;
exports.updateXeroTenantID = updateXeroTenantID;
exports.updateXeroMappings = updateXeroMappings;
exports.updateXeroImportCustomers = updateXeroImportCustomers;
exports.updateXeroEnableNewCategories = updateXeroEnableNewCategories;
exports.updateXeroAutoSync = updateXeroAutoSync;
exports.updateXeroAccountingMethod = updateXeroAccountingMethod;
exports.updateXeroExportBillStatus = updateXeroExportBillStatus;
exports.updateXeroExportExporter = updateXeroExportExporter;
exports.updateXeroExportBillDate = updateXeroExportBillDate;
exports.updateXeroExportNonReimbursableAccount = updateXeroExportNonReimbursableAccount;
exports.updateXeroSyncInvoiceCollectionsAccountID = updateXeroSyncInvoiceCollectionsAccountID;
exports.updateXeroSyncSyncReimbursedReports = updateXeroSyncSyncReimbursedReports;
exports.updateXeroSyncReimbursementAccountID = updateXeroSyncReimbursementAccountID;
const isObject_1 = require("lodash/isObject");
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const ApiUtils_1 = require("@libs/ApiUtils");
const ErrorUtils = require("@libs/ErrorUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const getXeroSetupLink = (policyID) => {
    const params = { policyID };
    const commandURL = (0, ApiUtils_1.getCommandURL)({ command: types_1.READ_COMMANDS.CONNECT_POLICY_TO_XERO, shouldSkipWebProxy: true });
    return commandURL + new URLSearchParams(params).toString();
};
exports.getXeroSetupLink = getXeroSetupLink;
const getTrackingCategories = (policy) => {
    const { trackingCategories } = policy?.connections?.xero?.data ?? {};
    const { mappings } = policy?.connections?.xero?.config ?? {};
    if (!trackingCategories) {
        return [];
    }
    return trackingCategories.map((category) => ({
        ...category,
        value: mappings?.[`${CONST_1.default.XERO_CONFIG.TRACKING_CATEGORY_PREFIX}${category.id}`] ?? '',
    }));
};
exports.getTrackingCategories = getTrackingCategories;
function createXeroPendingFields(settingName, settingValue, pendingValue) {
    if (!(0, isObject_1.default)(settingValue)) {
        return { [settingName]: pendingValue };
    }
    return Object.keys(settingValue).reduce((acc, setting) => {
        acc[setting] = pendingValue;
        return acc;
    }, {});
}
function createXeroExportPendingFields(settingName, settingValue, pendingValue) {
    if (!(0, isObject_1.default)(settingValue)) {
        return { [settingName]: pendingValue };
    }
    return Object.keys(settingValue).reduce((acc, setting) => {
        acc[setting] = pendingValue;
        return acc;
    }, {});
}
function createXeroSyncPendingFields(settingName, settingValue, pendingValue) {
    if (!(0, isObject_1.default)(settingValue)) {
        return { [settingName]: pendingValue };
    }
    return Object.keys(settingValue).reduce((acc, setting) => {
        acc[setting] = pendingValue;
        return acc;
    }, {});
}
function createXeroErrorFields(settingName, settingValue, errorValue) {
    if (!(0, isObject_1.default)(settingValue)) {
        return { [settingName]: errorValue };
    }
    return Object.keys(settingValue).reduce((acc, setting) => {
        acc[setting] = errorValue;
        return acc;
    }, {});
}
function createXeroExportErrorFields(settingName, settingValue, errorValue) {
    if (!(0, isObject_1.default)(settingValue)) {
        return { [settingName]: errorValue };
    }
    return Object.keys(settingValue).reduce((acc, setting) => {
        acc[setting] = errorValue;
        return acc;
    }, {});
}
function createXeroSyncErrorFields(settingName, settingValue, errorValue) {
    if (!(0, isObject_1.default)(settingValue)) {
        return { [settingName]: errorValue };
    }
    return Object.keys(settingValue).reduce((acc, setting) => {
        acc[setting] = errorValue;
        return acc;
    }, {});
}
function prepareXeroOptimisticData(policyID, settingName, settingValue, oldSettingValue) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                connections: {
                    xero: {
                        config: {
                            [settingName]: settingValue ?? null,
                            pendingFields: createXeroPendingFields(settingName, settingValue, CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE),
                            errorFields: createXeroErrorFields(settingName, settingValue, null),
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
                    xero: {
                        config: {
                            [settingName]: oldSettingValue ?? null,
                            pendingFields: createXeroPendingFields(settingName, settingValue, null),
                            errorFields: createXeroErrorFields(settingName, settingValue, ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage')),
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
                    xero: {
                        config: {
                            pendingFields: createXeroPendingFields(settingName, settingValue, null),
                            errorFields: createXeroErrorFields(settingName, settingValue, null),
                        },
                    },
                },
            },
        },
    ];
    return { optimisticData, failureData, successData };
}
function prepareXeroExportOptimisticData(policyID, settingName, settingValue, oldSettingValue) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                connections: {
                    xero: {
                        config: {
                            export: {
                                [settingName]: settingValue ?? null,
                            },
                            pendingFields: createXeroExportPendingFields(settingName, settingValue, CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE),
                            errorFields: createXeroExportErrorFields(settingName, settingValue, null),
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
                    xero: {
                        config: {
                            export: {
                                [settingName]: oldSettingValue ?? null,
                            },
                            pendingFields: createXeroExportPendingFields(settingName, settingValue, null),
                            errorFields: createXeroExportErrorFields(settingName, settingValue, ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage')),
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
                    xero: {
                        config: {
                            pendingFields: createXeroExportPendingFields(settingName, settingValue, null),
                            errorFields: createXeroExportErrorFields(settingName, settingValue, null),
                        },
                    },
                },
            },
        },
    ];
    return { optimisticData, failureData, successData };
}
function prepareXeroSyncOptimisticData(policyID, settingName, settingValue, oldSettingValue) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                connections: {
                    xero: {
                        config: {
                            sync: {
                                [settingName]: settingValue ?? null,
                            },
                            pendingFields: createXeroSyncPendingFields(settingName, settingValue, CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE),
                            errorFields: createXeroSyncErrorFields(settingName, settingValue, null),
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
                    xero: {
                        config: {
                            sync: {
                                [settingName]: oldSettingValue ?? null,
                            },
                            pendingFields: createXeroSyncPendingFields(settingName, settingValue, null),
                            errorFields: createXeroSyncErrorFields(settingName, settingValue, ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage')),
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
                    xero: {
                        config: {
                            pendingFields: createXeroSyncPendingFields(settingName, settingValue, null),
                            errorFields: createXeroSyncErrorFields(settingName, settingValue, null),
                        },
                    },
                },
            },
        },
    ];
    return { optimisticData, failureData, successData };
}
function updateXeroImportTrackingCategories(policyID, importTrackingCategories, oldImportTrackingCategories) {
    const parameters = {
        policyID,
        settingValue: JSON.stringify(importTrackingCategories),
        idempotencyKey: String(CONST_1.default.XERO_CONFIG.IMPORT_TRACKING_CATEGORIES),
    };
    const { optimisticData, failureData, successData } = prepareXeroOptimisticData(policyID, CONST_1.default.XERO_CONFIG.IMPORT_TRACKING_CATEGORIES, importTrackingCategories, oldImportTrackingCategories);
    API.write(types_1.WRITE_COMMANDS.UPDATE_XERO_IMPORT_TRACKING_CATEGORIES, parameters, { optimisticData, failureData, successData });
}
function updateXeroImportTaxRates(policyID, importTaxesRate, oldImportTaxesRate) {
    const parameters = {
        policyID,
        settingValue: JSON.stringify(importTaxesRate),
        idempotencyKey: String(CONST_1.default.XERO_CONFIG.IMPORT_TAX_RATES),
    };
    const { optimisticData, failureData, successData } = prepareXeroOptimisticData(policyID, CONST_1.default.XERO_CONFIG.IMPORT_TAX_RATES, importTaxesRate, oldImportTaxesRate);
    API.write(types_1.WRITE_COMMANDS.UPDATE_XERO_IMPORT_TAX_RATES, parameters, { optimisticData, failureData, successData });
}
function updateXeroTenantID(policyID, settingValue, oldSettingValue) {
    const parameters = {
        policyID,
        settingValue: JSON.stringify(settingValue),
        idempotencyKey: String(CONST_1.default.XERO_CONFIG.TENANT_ID),
    };
    const { optimisticData, successData, failureData } = prepareXeroOptimisticData(policyID, CONST_1.default.XERO_CONFIG.TENANT_ID, settingValue, oldSettingValue);
    API.write(types_1.WRITE_COMMANDS.UPDATE_XERO_TENANT_ID, parameters, { optimisticData, successData, failureData });
}
function updateXeroMappings(policyID, mappingValue, oldMappingValue) {
    const parameters = {
        policyID,
        settingValue: JSON.stringify(mappingValue),
        idempotencyKey: String(CONST_1.default.XERO_CONFIG.MAPPINGS),
    };
    const { optimisticData, failureData, successData } = prepareXeroOptimisticData(policyID, CONST_1.default.XERO_CONFIG.MAPPINGS, mappingValue, oldMappingValue);
    API.write(types_1.WRITE_COMMANDS.UPDATE_XERO_MAPPING, parameters, { optimisticData, failureData, successData });
}
function updateXeroImportCustomers(policyID, importCustomers, oldImportCustomers) {
    const parameters = {
        policyID,
        settingValue: JSON.stringify(importCustomers),
        idempotencyKey: String(CONST_1.default.XERO_CONFIG.IMPORT_CUSTOMERS),
    };
    const { optimisticData, failureData, successData } = prepareXeroOptimisticData(policyID, CONST_1.default.XERO_CONFIG.IMPORT_CUSTOMERS, importCustomers, oldImportCustomers);
    API.write(types_1.WRITE_COMMANDS.UPDATE_XERO_IMPORT_CUSTOMERS, parameters, { optimisticData, failureData, successData });
}
function updateXeroEnableNewCategories(policyID, enableNewCategories, oldEnableNewCategories) {
    const parameters = {
        policyID,
        settingValue: JSON.stringify(enableNewCategories),
        idempotencyKey: String(CONST_1.default.XERO_CONFIG.ENABLE_NEW_CATEGORIES),
    };
    const { optimisticData, failureData, successData } = prepareXeroOptimisticData(policyID, CONST_1.default.XERO_CONFIG.ENABLE_NEW_CATEGORIES, enableNewCategories, oldEnableNewCategories);
    API.write(types_1.WRITE_COMMANDS.UPDATE_XERO_ENABLE_NEW_CATEGORIES, parameters, { optimisticData, failureData, successData });
}
function updateXeroAutoSync(policyID, autoSync, oldAutoSync) {
    if (!policyID) {
        return;
    }
    const parameters = {
        policyID,
        settingValue: JSON.stringify(autoSync),
        idempotencyKey: String(CONST_1.default.XERO_CONFIG.AUTO_SYNC),
    };
    const { optimisticData, failureData, successData } = prepareXeroOptimisticData(policyID, CONST_1.default.XERO_CONFIG.AUTO_SYNC, autoSync, oldAutoSync);
    API.write(types_1.WRITE_COMMANDS.UPDATE_XERO_AUTO_SYNC, parameters, { optimisticData, failureData, successData });
}
function updateXeroExportBillStatus(policyID, billStatus, oldBillStatus) {
    const parameters = {
        policyID,
        settingValue: JSON.stringify(billStatus),
        idempotencyKey: String(CONST_1.default.XERO_CONFIG.BILL_STATUS),
    };
    const { optimisticData, failureData, successData } = prepareXeroExportOptimisticData(policyID, CONST_1.default.XERO_CONFIG.BILL_STATUS, billStatus, oldBillStatus);
    API.write(types_1.WRITE_COMMANDS.UPDATE_XERO_EXPORT_BILL_STATUS, parameters, { optimisticData, failureData, successData });
}
function updateXeroExportExporter(policyID, exporter, oldExporter) {
    const parameters = {
        policyID,
        settingValue: exporter,
        idempotencyKey: String(CONST_1.default.XERO_CONFIG.EXPORTER),
    };
    const { optimisticData, failureData, successData } = prepareXeroExportOptimisticData(policyID, CONST_1.default.XERO_CONFIG.EXPORTER, exporter, oldExporter);
    API.write(types_1.WRITE_COMMANDS.UPDATE_XERO_EXPORT_EXPORTER, parameters, { optimisticData, failureData, successData });
}
function updateXeroExportBillDate(policyID, billDate, oldBillDate) {
    const parameters = {
        policyID,
        settingValue: billDate,
        idempotencyKey: String(CONST_1.default.XERO_CONFIG.BILL_DATE),
    };
    const { optimisticData, failureData, successData } = prepareXeroExportOptimisticData(policyID, CONST_1.default.XERO_CONFIG.BILL_DATE, billDate, oldBillDate);
    API.write(types_1.WRITE_COMMANDS.UPDATE_XERO_EXPORT_BILL_DATE, parameters, { optimisticData, failureData, successData });
}
function updateXeroExportNonReimbursableAccount(policyID, nonReimbursableAccount, oldNonReimbursableAccount) {
    const parameters = {
        policyID,
        settingValue: nonReimbursableAccount,
        idempotencyKey: String(CONST_1.default.XERO_CONFIG.NON_REIMBURSABLE_ACCOUNT),
    };
    const { optimisticData, failureData, successData } = prepareXeroExportOptimisticData(policyID, CONST_1.default.XERO_CONFIG.NON_REIMBURSABLE_ACCOUNT, nonReimbursableAccount, oldNonReimbursableAccount);
    API.write(types_1.WRITE_COMMANDS.UPDATE_XERO_EXPORT_NON_REIMBURSABLE_ACCOUNT, parameters, { optimisticData, failureData, successData });
}
function updateXeroSyncInvoiceCollectionsAccountID(policyID, invoiceCollectionsAccountID, oldInvoiceCollectionsAccountID) {
    const parameters = {
        policyID,
        settingValue: invoiceCollectionsAccountID,
        idempotencyKey: String(CONST_1.default.XERO_CONFIG.INVOICE_COLLECTIONS_ACCOUNT_ID),
    };
    const { optimisticData, failureData, successData } = prepareXeroSyncOptimisticData(policyID, CONST_1.default.XERO_CONFIG.INVOICE_COLLECTIONS_ACCOUNT_ID, invoiceCollectionsAccountID, oldInvoiceCollectionsAccountID);
    API.write(types_1.WRITE_COMMANDS.UPDATE_XERO_SYNC_INVOICE_COLLECTIONS_ACCOUNT_ID, parameters, { optimisticData, failureData, successData });
}
function updateXeroSyncReimbursementAccountID(policyID, reimbursementAccountID, oldReimbursementAccountID) {
    const parameters = {
        policyID,
        settingValue: reimbursementAccountID,
        idempotencyKey: String(CONST_1.default.XERO_CONFIG.REIMBURSEMENT_ACCOUNT_ID),
    };
    const { optimisticData, failureData, successData } = prepareXeroSyncOptimisticData(policyID, CONST_1.default.XERO_CONFIG.REIMBURSEMENT_ACCOUNT_ID, reimbursementAccountID, oldReimbursementAccountID);
    API.write(types_1.WRITE_COMMANDS.UPDATE_XERO_SYNC_REIMBURSEMENT_ACCOUNT_ID, parameters, { optimisticData, failureData, successData });
}
function updateXeroSyncSyncReimbursedReports(policyID, syncReimbursedReports, oldSyncReimbursedReports) {
    if (!policyID) {
        return;
    }
    const parameters = {
        policyID,
        settingValue: JSON.stringify(syncReimbursedReports),
        idempotencyKey: String(CONST_1.default.XERO_CONFIG.SYNC_REIMBURSED_REPORTS),
    };
    const { optimisticData, failureData, successData } = prepareXeroSyncOptimisticData(policyID, CONST_1.default.XERO_CONFIG.SYNC_REIMBURSED_REPORTS, syncReimbursedReports, oldSyncReimbursedReports);
    API.write(types_1.WRITE_COMMANDS.UPDATE_XERO_SYNC_SYNC_REIMBURSED_REPORTS, parameters, { optimisticData, failureData, successData });
}
function updateXeroAccountingMethod(policyID, accountingMethod, oldAccountingMethod) {
    if (!policyID) {
        return;
    }
    const parameters = {
        policyID,
        accountingMethod,
    };
    const { optimisticData, failureData, successData } = prepareXeroExportOptimisticData(policyID, CONST_1.default.XERO_CONFIG.ACCOUNTING_METHOD, accountingMethod, oldAccountingMethod);
    API.write(types_1.WRITE_COMMANDS.UPDATE_XERO_ACCOUNTING_METHOD, parameters, { optimisticData, failureData, successData });
}
