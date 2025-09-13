"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectPolicyToNetSuite = connectPolicyToNetSuite;
exports.updateNetSuiteSubsidiary = updateNetSuiteSubsidiary;
exports.updateNetSuiteSyncTaxConfiguration = updateNetSuiteSyncTaxConfiguration;
exports.updateNetSuiteExporter = updateNetSuiteExporter;
exports.updateNetSuiteExportDate = updateNetSuiteExportDate;
exports.updateNetSuiteReimbursableExpensesExportDestination = updateNetSuiteReimbursableExpensesExportDestination;
exports.updateNetSuiteNonReimbursableExpensesExportDestination = updateNetSuiteNonReimbursableExpensesExportDestination;
exports.updateNetSuiteDefaultVendor = updateNetSuiteDefaultVendor;
exports.updateNetSuiteReimbursablePayableAccount = updateNetSuiteReimbursablePayableAccount;
exports.updateNetSuitePayableAcct = updateNetSuitePayableAcct;
exports.updateNetSuiteJournalPostingPreference = updateNetSuiteJournalPostingPreference;
exports.updateNetSuiteReceivableAccount = updateNetSuiteReceivableAccount;
exports.updateNetSuiteInvoiceItemPreference = updateNetSuiteInvoiceItemPreference;
exports.updateNetSuiteInvoiceItem = updateNetSuiteInvoiceItem;
exports.updateNetSuiteTaxPostingAccount = updateNetSuiteTaxPostingAccount;
exports.updateNetSuiteProvincialTaxPostingAccount = updateNetSuiteProvincialTaxPostingAccount;
exports.updateNetSuiteAllowForeignCurrency = updateNetSuiteAllowForeignCurrency;
exports.updateNetSuiteExportToNextOpenPeriod = updateNetSuiteExportToNextOpenPeriod;
exports.updateNetSuiteImportMapping = updateNetSuiteImportMapping;
exports.updateNetSuiteCrossSubsidiaryCustomersConfiguration = updateNetSuiteCrossSubsidiaryCustomersConfiguration;
exports.updateNetSuiteCustomSegments = updateNetSuiteCustomSegments;
exports.updateNetSuiteCustomLists = updateNetSuiteCustomLists;
exports.updateNetSuiteAutoSync = updateNetSuiteAutoSync;
exports.updateNetSuiteSyncReimbursedReports = updateNetSuiteSyncReimbursedReports;
exports.updateNetSuiteSyncPeople = updateNetSuiteSyncPeople;
exports.updateNetSuiteAutoCreateEntities = updateNetSuiteAutoCreateEntities;
exports.updateNetSuiteEnableNewCategories = updateNetSuiteEnableNewCategories;
exports.updateNetSuiteCustomFormIDOptionsEnabled = updateNetSuiteCustomFormIDOptionsEnabled;
exports.updateNetSuiteReimbursementAccountID = updateNetSuiteReimbursementAccountID;
exports.updateNetSuiteCollectionAccount = updateNetSuiteCollectionAccount;
exports.updateNetSuiteExportReportsTo = updateNetSuiteExportReportsTo;
exports.updateNetSuiteExportVendorBillsTo = updateNetSuiteExportVendorBillsTo;
exports.updateNetSuiteExportJournalsTo = updateNetSuiteExportJournalsTo;
exports.updateNetSuiteApprovalAccount = updateNetSuiteApprovalAccount;
exports.updateNetSuiteCustomFormIDOptions = updateNetSuiteCustomFormIDOptions;
exports.updateNetSuiteCustomersJobsMapping = updateNetSuiteCustomersJobsMapping;
exports.updateNetSuiteAccountingMethod = updateNetSuiteAccountingMethod;
const isObject_1 = require("lodash/isObject");
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const ErrorUtils = require("@libs/ErrorUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function connectPolicyToNetSuite(policyID, credentials) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY_CONNECTION_SYNC_PROGRESS}${policyID}`,
            value: {
                stageInProgress: CONST_1.default.POLICY.CONNECTIONS.SYNC_STAGE_NAME.NETSUITE_SYNC_CONNECTION,
                connectionName: CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE,
                timestamp: new Date().toISOString(),
            },
        },
    ];
    const parameters = {
        policyID,
        ...credentials,
    };
    API.write(types_1.WRITE_COMMANDS.CONNECT_POLICY_TO_NETSUITE, parameters, { optimisticData });
}
function createPendingFields(settingName, settingValue, pendingValue) {
    if (!(0, isObject_1.default)(settingValue)) {
        return { [settingName]: pendingValue };
    }
    return Object.keys(settingValue).reduce((acc, setting) => {
        acc[setting] = pendingValue;
        return acc;
    }, {});
}
function createErrorFields(settingName, settingValue, errorValue) {
    if (!(0, isObject_1.default)(settingValue)) {
        return { [settingName]: errorValue };
    }
    return Object.keys(settingValue).reduce((acc, setting) => {
        acc[setting] = errorValue;
        return acc;
    }, {});
}
function updateNetSuiteOnyxData(policyID, settingName, settingValue, oldSettingValue) {
    const exporterOptimisticData = settingName === CONST_1.default.NETSUITE_CONFIG.EXPORTER ? { exporter: settingValue } : {};
    const exporterErrorData = settingName === CONST_1.default.NETSUITE_CONFIG.EXPORTER ? { exporter: oldSettingValue } : {};
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                ...exporterOptimisticData,
                connections: {
                    netsuite: {
                        options: {
                            config: {
                                [settingName]: settingValue ?? null,
                                pendingFields: createPendingFields(settingName, settingValue, CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE),
                                errorFields: createErrorFields(settingName, settingValue, null),
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
                    netsuite: {
                        options: {
                            config: {
                                [settingName]: oldSettingValue ?? null,
                                pendingFields: createPendingFields(settingName, settingValue, null),
                                errorFields: createErrorFields(settingName, settingValue, ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage')),
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
                    netsuite: {
                        options: {
                            config: {
                                [settingName]: settingValue ?? null,
                                pendingFields: createPendingFields(settingName, settingValue, null),
                                errorFields: createErrorFields(settingName, settingValue, null),
                            },
                        },
                    },
                },
            },
        },
    ];
    return { optimisticData, failureData, successData };
}
function updateNetSuiteSyncOptionsOnyxData(policyID, settingName, settingValue, oldSettingValue, modifiedFieldID, pendingAction) {
    let syncOptionsOptimisticValue;
    if (pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE) {
        syncOptionsOptimisticValue = {
            [settingName]: settingValue ?? null,
        };
    }
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                connections: {
                    netsuite: {
                        options: {
                            config: {
                                syncOptions: syncOptionsOptimisticValue,
                                pendingFields: {
                                    [modifiedFieldID ?? settingName]: pendingAction ?? CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                                },
                                errorFields: {
                                    [modifiedFieldID ?? settingName]: null,
                                },
                            },
                        },
                    },
                },
            },
        },
    ];
    let syncOptionsAfterFailure;
    let pendingFieldsAfterFailure;
    if (pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD) {
        syncOptionsAfterFailure = {
            [settingName]: oldSettingValue ?? null,
        };
        pendingFieldsAfterFailure = {
            [modifiedFieldID ?? settingName]: null,
        };
    }
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                connections: {
                    netsuite: {
                        options: {
                            config: {
                                syncOptions: syncOptionsAfterFailure,
                                pendingFields: pendingFieldsAfterFailure,
                                errorFields: {
                                    [modifiedFieldID ?? settingName]: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
                                },
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
                    netsuite: {
                        options: {
                            config: {
                                pendingFields: {
                                    [modifiedFieldID ?? settingName]: null,
                                },
                                errorFields: {
                                    [modifiedFieldID ?? settingName]: null,
                                },
                            },
                        },
                    },
                },
            },
        },
    ];
    return { optimisticData, failureData, successData };
}
function updateNetSuiteSubsidiary(policyID, newSubsidiary, oldSubsidiary) {
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    connections: {
                        netsuite: {
                            options: {
                                config: {
                                    subsidiary: newSubsidiary.subsidiary,
                                    subsidiaryID: newSubsidiary.subsidiaryID,
                                    pendingFields: {
                                        subsidiary: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                                    },
                                    errorFields: {
                                        subsidiary: null,
                                    },
                                },
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
                    connections: {
                        netsuite: {
                            options: {
                                config: {
                                    subsidiary: newSubsidiary.subsidiary,
                                    subsidiaryID: newSubsidiary.subsidiaryID,
                                    errorFields: {
                                        subsidiary: null,
                                    },
                                    pendingFields: {
                                        subsidiary: null,
                                    },
                                },
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
                    connections: {
                        netsuite: {
                            options: {
                                config: {
                                    subsidiary: oldSubsidiary.subsidiary,
                                    subsidiaryID: oldSubsidiary.subsidiaryID,
                                    errorFields: {
                                        subsidiary: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
                                    },
                                    pendingFields: {
                                        subsidiary: null,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        ],
    };
    const params = {
        policyID,
        ...newSubsidiary,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_NETSUITE_SUBSIDIARY, params, onyxData);
}
function updateNetSuiteImportMapping(policyID, mappingName, mappingValue, oldMappingValue) {
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    connections: {
                        netsuite: {
                            options: {
                                config: {
                                    syncOptions: {
                                        mapping: {
                                            [mappingName]: mappingValue,
                                        },
                                    },
                                    errorFields: {
                                        [mappingName]: null,
                                    },
                                    pendingFields: {
                                        [mappingName]: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                                    },
                                },
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
                    connections: {
                        netsuite: {
                            options: {
                                config: {
                                    syncOptions: {
                                        mapping: {
                                            [mappingName]: mappingValue,
                                        },
                                    },
                                    errorFields: {
                                        [mappingName]: null,
                                    },
                                    pendingFields: {
                                        [mappingName]: null,
                                    },
                                },
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
                    connections: {
                        netsuite: {
                            options: {
                                config: {
                                    syncOptions: {
                                        mapping: {
                                            [mappingName]: oldMappingValue,
                                        },
                                    },
                                    errorFields: {
                                        [mappingName]: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
                                    },
                                    pendingFields: {
                                        [mappingName]: null,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        ],
    };
    const params = {
        policyID,
        mapping: mappingValue,
    };
    let commandName;
    switch (mappingName) {
        case 'departments':
            commandName = types_1.WRITE_COMMANDS.UPDATE_NETSUITE_DEPARTMENTS_MAPPING;
            break;
        case 'classes':
            commandName = types_1.WRITE_COMMANDS.UPDATE_NETSUITE_CLASSES_MAPPING;
            break;
        case 'locations':
            commandName = types_1.WRITE_COMMANDS.UPDATE_NETSUITE_LOCATIONS_MAPPING;
            break;
        case 'customers':
            commandName = types_1.WRITE_COMMANDS.UPDATE_NETSUITE_CUSTOMERS_MAPPING;
            break;
        case 'jobs':
            commandName = types_1.WRITE_COMMANDS.UPDATE_NETSUITE_JOBS_MAPPING;
            break;
        default:
            return;
    }
    API.write(commandName, params, onyxData);
}
function updateNetSuiteCustomersJobsMapping(policyID, mappingValue, oldMappingValue) {
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
                value: {
                    connections: {
                        netsuite: {
                            options: {
                                config: {
                                    syncOptions: {
                                        mapping: {
                                            customers: mappingValue.customersMapping,
                                            jobs: mappingValue.jobsMapping,
                                        },
                                    },
                                    errorFields: {
                                        customers: null,
                                        jobs: null,
                                    },
                                    pendingFields: {
                                        customers: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                                        jobs: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                                    },
                                },
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
                    connections: {
                        netsuite: {
                            options: {
                                config: {
                                    syncOptions: {
                                        mapping: {
                                            customers: mappingValue.customersMapping,
                                            jobs: mappingValue.jobsMapping,
                                        },
                                    },
                                    errorFields: {
                                        customers: null,
                                        jobs: null,
                                    },
                                    pendingFields: {
                                        customers: null,
                                        jobs: null,
                                    },
                                },
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
                    connections: {
                        netsuite: {
                            options: {
                                config: {
                                    syncOptions: {
                                        mapping: {
                                            customers: oldMappingValue.customersMapping,
                                            jobs: oldMappingValue.jobsMapping,
                                        },
                                    },
                                    errorFields: {
                                        customers: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
                                        jobs: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
                                    },
                                    pendingFields: {
                                        customers: null,
                                        jobs: null,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        ],
    };
    const params = {
        policyID,
        ...mappingValue,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_NETSUITE_CUSTOMERS_JOBS_MAPPING, params, onyxData);
}
function updateNetSuiteSyncTaxConfiguration(policyID, isSyncTaxEnabled) {
    const onyxData = updateNetSuiteSyncOptionsOnyxData(policyID, CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.SYNC_TAX, isSyncTaxEnabled, !isSyncTaxEnabled);
    const params = {
        policyID,
        enabled: isSyncTaxEnabled,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_NETSUITE_SYNC_TAX_CONFIGURATION, params, onyxData);
}
function updateNetSuiteCrossSubsidiaryCustomersConfiguration(policyID, isCrossSubsidiaryCustomersEnabled) {
    const onyxData = updateNetSuiteSyncOptionsOnyxData(policyID, CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.CROSS_SUBSIDIARY_CUSTOMERS, isCrossSubsidiaryCustomersEnabled, !isCrossSubsidiaryCustomersEnabled);
    const params = {
        policyID,
        enabled: isCrossSubsidiaryCustomersEnabled,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_NETSUITE_CROSS_SUBSIDIARY_CUSTOMER_CONFIGURATION, params, onyxData);
}
function updateNetSuiteCustomSegments(policyID, records, oldRecords, modifiedSegmentID, pendingAction) {
    const onyxData = updateNetSuiteSyncOptionsOnyxData(policyID, CONST_1.default.NETSUITE_CONFIG.IMPORT_CUSTOM_FIELDS.CUSTOM_SEGMENTS, records, oldRecords, modifiedSegmentID, pendingAction);
    API.write(types_1.WRITE_COMMANDS.UPDATE_NETSUITE_CUSTOM_SEGMENTS, {
        policyID,
        customSegments: JSON.stringify(records),
    }, onyxData);
}
function updateNetSuiteCustomLists(policyID, records, oldRecords, modifiedListID, pendingAction) {
    const onyxData = updateNetSuiteSyncOptionsOnyxData(policyID, CONST_1.default.NETSUITE_CONFIG.IMPORT_CUSTOM_FIELDS.CUSTOM_LISTS, records, oldRecords, modifiedListID, pendingAction);
    API.write(types_1.WRITE_COMMANDS.UPDATE_NETSUITE_CUSTOM_LISTS, {
        policyID,
        customLists: JSON.stringify(records),
    }, onyxData);
}
function updateNetSuiteExporter(policyID, exporter, oldExporter) {
    const onyxData = updateNetSuiteOnyxData(policyID, CONST_1.default.NETSUITE_CONFIG.EXPORTER, exporter, oldExporter);
    const parameters = {
        policyID,
        email: exporter,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_NETSUITE_EXPORTER, parameters, onyxData);
}
function updateNetSuiteExportDate(policyID, date, oldDate) {
    const onyxData = updateNetSuiteOnyxData(policyID, CONST_1.default.NETSUITE_CONFIG.EXPORT_DATE, date, oldDate);
    const parameters = {
        policyID,
        value: date,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_NETSUITE_EXPORT_DATE, parameters, onyxData);
}
function updateNetSuiteReimbursableExpensesExportDestination(policyID, destination, oldDestination) {
    const onyxData = updateNetSuiteOnyxData(policyID, CONST_1.default.NETSUITE_CONFIG.REIMBURSABLE_EXPENSES_EXPORT_DESTINATION, destination, oldDestination);
    const parameters = {
        policyID,
        value: destination,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_NETSUITE_REIMBURSABLE_EXPENSES_EXPORT_DESTINATION, parameters, onyxData);
}
function updateNetSuiteNonReimbursableExpensesExportDestination(policyID, destination, oldDestination) {
    const onyxData = updateNetSuiteOnyxData(policyID, CONST_1.default.NETSUITE_CONFIG.NON_REIMBURSABLE_EXPENSES_EXPORT_DESTINATION, destination, oldDestination);
    const parameters = {
        policyID,
        value: destination,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_NETSUITE_NONREIMBURSABLE_EXPENSES_EXPORT_DESTINATION, parameters, onyxData);
}
function updateNetSuiteDefaultVendor(policyID, vendorID, oldVendorID) {
    const onyxData = updateNetSuiteOnyxData(policyID, CONST_1.default.NETSUITE_CONFIG.DEFAULT_VENDOR, vendorID, oldVendorID);
    const parameters = {
        policyID,
        vendorID,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_NETSUITE_DEFAULT_VENDOR, parameters, onyxData);
}
function updateNetSuiteReimbursablePayableAccount(policyID, bankAccountID, oldBankAccountID) {
    const onyxData = updateNetSuiteOnyxData(policyID, CONST_1.default.NETSUITE_CONFIG.REIMBURSABLE_PAYABLE_ACCOUNT, bankAccountID, oldBankAccountID);
    const parameters = {
        policyID,
        bankAccountID,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_NETSUITE_REIMBURSABLE_PAYABLE_ACCOUNT, parameters, onyxData);
}
function updateNetSuitePayableAcct(policyID, bankAccountID, oldBankAccountID) {
    const onyxData = updateNetSuiteOnyxData(policyID, CONST_1.default.NETSUITE_CONFIG.PAYABLE_ACCT, bankAccountID, oldBankAccountID);
    const parameters = {
        policyID,
        bankAccountID,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_NETSUITE_PAYABLE_ACCT, parameters, onyxData);
}
function updateNetSuiteJournalPostingPreference(policyID, postingPreference, oldPostingPreference) {
    const onyxData = updateNetSuiteOnyxData(policyID, CONST_1.default.NETSUITE_CONFIG.JOURNAL_POSTING_PREFERENCE, postingPreference, oldPostingPreference);
    const parameters = {
        policyID,
        value: postingPreference,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_NETSUITE_JOURNAL_POSTING_PREFERENCE, parameters, onyxData);
}
function updateNetSuiteReceivableAccount(policyID, bankAccountID, oldBankAccountID) {
    const onyxData = updateNetSuiteOnyxData(policyID, CONST_1.default.NETSUITE_CONFIG.RECEIVABLE_ACCOUNT, bankAccountID, oldBankAccountID);
    const parameters = {
        policyID,
        bankAccountID,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_NETSUITE_RECEIVABLE_ACCOUNT, parameters, onyxData);
}
function updateNetSuiteInvoiceItemPreference(policyID, value, oldValue) {
    const onyxData = updateNetSuiteOnyxData(policyID, CONST_1.default.NETSUITE_CONFIG.INVOICE_ITEM_PREFERENCE, value, oldValue);
    const parameters = {
        policyID,
        value,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_NETSUITE_INVOICE_ITEM_PREFERENCE, parameters, onyxData);
}
function updateNetSuiteInvoiceItem(policyID, itemID, oldItemID) {
    const onyxData = updateNetSuiteOnyxData(policyID, CONST_1.default.NETSUITE_CONFIG.INVOICE_ITEM, itemID, oldItemID);
    const parameters = {
        policyID,
        itemID,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_NETSUITE_INVOICE_ITEM, parameters, onyxData);
}
function updateNetSuiteTaxPostingAccount(policyID, bankAccountID, oldBankAccountID) {
    const onyxData = updateNetSuiteOnyxData(policyID, CONST_1.default.NETSUITE_CONFIG.TAX_POSTING_ACCOUNT, bankAccountID, oldBankAccountID);
    const parameters = {
        policyID,
        bankAccountID,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_NETSUITE_TAX_POSTING_ACCOUNT, parameters, onyxData);
}
function updateNetSuiteProvincialTaxPostingAccount(policyID, bankAccountID, oldBankAccountID) {
    const onyxData = updateNetSuiteOnyxData(policyID, CONST_1.default.NETSUITE_CONFIG.PROVINCIAL_TAX_POSTING_ACCOUNT, bankAccountID, oldBankAccountID);
    const parameters = {
        policyID,
        bankAccountID,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_NETSUITE_PROVINCIAL_TAX_POSTING_ACCOUNT, parameters, onyxData);
}
function updateNetSuiteAllowForeignCurrency(policyID, value, oldValue) {
    const onyxData = updateNetSuiteOnyxData(policyID, CONST_1.default.NETSUITE_CONFIG.ALLOW_FOREIGN_CURRENCY, value, oldValue);
    const parameters = {
        policyID,
        enabled: value,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_NETSUITE_ALLOW_FOREIGN_CURRENCY, parameters, onyxData);
}
function updateNetSuiteExportToNextOpenPeriod(policyID, value, oldValue) {
    const onyxData = updateNetSuiteOnyxData(policyID, CONST_1.default.NETSUITE_CONFIG.EXPORT_TO_NEXT_OPEN_PERIOD, value, oldValue);
    const parameters = {
        policyID,
        enabled: value,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_NETSUITE_EXPORT_TO_NEXT_OPEN_PERIOD, parameters, onyxData);
}
function updateNetSuiteAutoSync(policyID, value) {
    if (!policyID) {
        return;
    }
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                connections: {
                    netsuite: {
                        config: {
                            autoSync: {
                                enabled: value,
                            },
                            pendingFields: {
                                autoSync: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                            },
                            errorFields: {
                                autoSync: null,
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
                    netsuite: {
                        config: {
                            autoSync: {
                                enabled: !value,
                            },
                            pendingFields: {
                                autoSync: null,
                            },
                            errorFields: {
                                autoSync: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
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
                    netsuite: {
                        config: {
                            autoSync: {
                                enabled: value,
                            },
                            pendingFields: {
                                autoSync: null,
                            },
                            errorFields: {
                                autoSync: null,
                            },
                        },
                    },
                },
            },
        },
    ];
    const parameters = {
        policyID,
        enabled: value,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_NETSUITE_AUTO_SYNC, parameters, { optimisticData, failureData, successData });
}
function updateNetSuiteSyncReimbursedReports(policyID, value) {
    const onyxData = updateNetSuiteSyncOptionsOnyxData(policyID, CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.SYNC_REIMBURSED_REPORTS, value, !value);
    const parameters = {
        policyID,
        enabled: value,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_NETSUITE_SYNC_REIMBURSED_REPORTS, parameters, onyxData);
}
function updateNetSuiteSyncPeople(policyID, value) {
    const onyxData = updateNetSuiteSyncOptionsOnyxData(policyID, CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.SYNC_PEOPLE, value, !value);
    const parameters = {
        policyID,
        enabled: value,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_NETSUITE_SYNC_PEOPLE, parameters, onyxData);
}
function updateNetSuiteAutoCreateEntities(policyID, value) {
    const onyxData = updateNetSuiteOnyxData(policyID, CONST_1.default.NETSUITE_CONFIG.AUTO_CREATE_ENTITIES, value, !value);
    const parameters = {
        policyID,
        enabled: value,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_NETSUITE_AUTO_CREATE_ENTITIES, parameters, onyxData);
}
function updateNetSuiteEnableNewCategories(policyID, value) {
    const onyxData = updateNetSuiteSyncOptionsOnyxData(policyID, CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.ENABLE_NEW_CATEGORIES, value, !value);
    const parameters = {
        policyID,
        enabled: value,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_NETSUITE_ENABLE_NEW_CATEGORIES, parameters, onyxData);
}
function updateNetSuiteCustomFormIDOptionsEnabled(policyID, value) {
    const data = {
        enabled: value,
    };
    const oldData = {
        enabled: !value,
    };
    const onyxData = updateNetSuiteOnyxData(policyID, CONST_1.default.NETSUITE_CONFIG.CUSTOM_FORM_ID_OPTIONS, data, oldData);
    const parameters = {
        policyID,
        enabled: value,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_NETSUITE_CUSTOM_FORM_ID_OPTIONS_ENABLED, parameters, onyxData);
}
function updateNetSuiteReimbursementAccountID(policyID, bankAccountID, oldBankAccountID) {
    const onyxData = updateNetSuiteOnyxData(policyID, CONST_1.default.NETSUITE_CONFIG.REIMBURSEMENT_ACCOUNT_ID, bankAccountID, oldBankAccountID);
    const parameters = {
        policyID,
        bankAccountID,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_NETSUITE_REIMBURSEMENT_ACCOUNT_ID, parameters, onyxData);
}
function updateNetSuiteCollectionAccount(policyID, bankAccountID, oldBankAccountID) {
    const onyxData = updateNetSuiteOnyxData(policyID, CONST_1.default.NETSUITE_CONFIG.COLLECTION_ACCOUNT, bankAccountID, oldBankAccountID);
    const parameters = {
        policyID,
        bankAccountID,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_NETSUITE_COLLECTION_ACCOUNT, parameters, onyxData);
}
function updateNetSuiteExportReportsTo(policyID, approvalLevel, oldApprovalLevel) {
    const onyxData = updateNetSuiteSyncOptionsOnyxData(policyID, CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.EXPORT_REPORTS_TO, approvalLevel, oldApprovalLevel);
    const parameters = {
        policyID,
        value: approvalLevel,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_NETSUITE_EXPORT_REPORTS_TO, parameters, onyxData);
}
function updateNetSuiteAccountingMethod(policyID, accountingMethod, oldAccountingMethod) {
    if (!policyID) {
        return;
    }
    const onyxData = updateNetSuiteOnyxData(policyID, CONST_1.default.NETSUITE_CONFIG.ACCOUNTING_METHOD, accountingMethod, oldAccountingMethod);
    const parameters = {
        policyID,
        accountingMethod,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_NETSUITE_ACCOUNTING_METHOD, parameters, onyxData);
}
function updateNetSuiteExportVendorBillsTo(policyID, approvalLevel, oldApprovalLevel) {
    const onyxData = updateNetSuiteSyncOptionsOnyxData(policyID, CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.EXPORT_VENDOR_BILLS_TO, approvalLevel, oldApprovalLevel);
    const parameters = {
        policyID,
        value: approvalLevel,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_NETSUITE_VENDOR_BILLS_TO, parameters, onyxData);
}
function updateNetSuiteExportJournalsTo(policyID, approvalLevel, oldApprovalLevel) {
    const onyxData = updateNetSuiteSyncOptionsOnyxData(policyID, CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.EXPORT_JOURNALS_TO, approvalLevel, oldApprovalLevel);
    const parameters = {
        policyID,
        value: approvalLevel,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_NETSUITE_JOURNALS_TO, parameters, onyxData);
}
function updateNetSuiteApprovalAccount(policyID, value, oldValue) {
    const onyxData = updateNetSuiteOnyxData(policyID, CONST_1.default.NETSUITE_CONFIG.APPROVAL_ACCOUNT, value, oldValue);
    const parameters = {
        policyID,
        value,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_NETSUITE_APPROVAL_ACCOUNT, parameters, onyxData);
}
function updateNetSuiteCustomFormIDOptions(policyID, value, isReimbursable, exportDestination, oldCustomFormID) {
    const customFormIDKey = isReimbursable ? CONST_1.default.NETSUITE_CONFIG.CUSTOM_FORM_ID_TYPE.REIMBURSABLE : CONST_1.default.NETSUITE_CONFIG.CUSTOM_FORM_ID_TYPE.NON_REIMBURSABLE;
    const data = {
        [customFormIDKey]: {
            [CONST_1.default.NETSUITE_MAP_EXPORT_DESTINATION[exportDestination]]: value,
        },
    };
    const oldData = {
        [customFormIDKey]: oldCustomFormID?.[customFormIDKey] ?? null,
    };
    const onyxData = updateNetSuiteOnyxData(policyID, CONST_1.default.NETSUITE_CONFIG.CUSTOM_FORM_ID_OPTIONS, data, oldData);
    const commandName = isReimbursable ? types_1.WRITE_COMMANDS.UPDATE_NETSUITE_CUSTOM_FORM_ID_OPTIONS_REIMBURSABLE : types_1.WRITE_COMMANDS.UPDATE_NETSUITE_CUSTOM_FORM_ID_OPTIONS_NON_REIMBURSABLE;
    const parameters = {
        policyID,
        formType: CONST_1.default.NETSUITE_MAP_EXPORT_DESTINATION[exportDestination],
        formID: value,
    };
    API.write(commandName, parameters, onyxData);
}
