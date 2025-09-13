"use strict";
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
exports.computeReportNameIfNeeded = computeReportNameIfNeeded;
exports.getReportByTransactionID = getReportByTransactionID;
exports.shouldComputeReportName = shouldComputeReportName;
exports.updateOptimisticReportNamesFromUpdates = updateOptimisticReportNamesFromUpdates;
var react_native_onyx_1 = require("react-native-onyx");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var Formula_1 = require("./Formula");
var Log_1 = require("./Log");
var Permissions_1 = require("./Permissions");
var ReportUtils_1 = require("./ReportUtils");
/**
 * Get the object type from an Onyx key
 */
function determineObjectTypeByKey(key) {
    if (key.startsWith(ONYXKEYS_1.default.COLLECTION.REPORT)) {
        return 'report';
    }
    if (key.startsWith(ONYXKEYS_1.default.COLLECTION.POLICY)) {
        return 'policy';
    }
    if (key.startsWith(ONYXKEYS_1.default.COLLECTION.TRANSACTION)) {
        return 'transaction';
    }
    return 'unknown';
}
/**
 * Extract report ID from an Onyx key
 */
function getReportIDFromKey(key) {
    return key.replace(ONYXKEYS_1.default.COLLECTION.REPORT, '');
}
/**
 * Extract policy ID from an Onyx key
 */
function getPolicyIDFromKey(key) {
    return key.replace(ONYXKEYS_1.default.COLLECTION.POLICY, '');
}
/**
 * Extract transaction ID from an Onyx key
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- this will be used in near future
function getTransactionIDFromKey(key) {
    return key.replace(ONYXKEYS_1.default.COLLECTION.TRANSACTION, '');
}
/**
 * Get report by ID from the reports collection
 */
function getReportByID(reportID, allReports) {
    return allReports["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(reportID)];
}
/**
 * Get policy by ID from the policies collection
 */
function getPolicyByID(policyID, allPolicies) {
    if (!policyID) {
        return;
    }
    return allPolicies["".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(policyID)];
}
/**
 * Get transaction by ID from the transactions collection
 */
function getTransactionByID(transactionID, allTransactions) {
    return allTransactions["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactionID)];
}
/**
 * Get all reports associated with a policy ID
 */
function getReportsForNameComputation(policyID, allReports, context) {
    if (policyID === CONST_1.default.POLICY.ID_FAKE) {
        return [];
    }
    return Object.values(allReports).filter(function (report) {
        if ((report === null || report === void 0 ? void 0 : report.policyID) !== policyID) {
            return false;
        }
        // Filter by type - only reports that support custom names
        if (!isValidReportType(report.type)) {
            return false;
        }
        // Filter by state - exclude reports in high states (like approved or higher)
        var stateThreshold = CONST_1.default.REPORT.STATE_NUM.APPROVED;
        if (report.stateNum && report.stateNum > stateThreshold) {
            return false;
        }
        // Filter by isArchived - exclude archived reports
        var reportNameValuePairs = context.allReportNameValuePairs["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS).concat(report === null || report === void 0 ? void 0 : report.reportID)];
        if ((0, ReportUtils_1.isArchivedReport)(reportNameValuePairs)) {
            return false;
        }
        return true;
    });
}
/**
 * Get the report associated with a transaction ID
 */
function getReportByTransactionID(transactionID, context) {
    if (!transactionID) {
        return undefined;
    }
    var transaction = getTransactionByID(transactionID, context.allTransactions);
    if (!(transaction === null || transaction === void 0 ? void 0 : transaction.reportID)) {
        return undefined;
    }
    // Get the report using the transaction's reportID from context
    return getReportByID(transaction.reportID, context.allReports);
}
/**
 * Generate the Onyx key for a report
 */
function getReportKey(reportID) {
    return "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(reportID);
}
/**
 * Check if a report should have its name automatically computed
 */
function shouldComputeReportName(report, policy) {
    var _a;
    if (!report || !policy) {
        return false;
    }
    if (!isValidReportType(report.type)) {
        return false;
    }
    // Only compute names for expense reports with policies that have title fields
    // Check if the policy has a title field with a formula
    var titleField = (0, ReportUtils_1.getTitleReportField)((_a = policy.fieldList) !== null && _a !== void 0 ? _a : {});
    if (!(titleField === null || titleField === void 0 ? void 0 : titleField.defaultValue)) {
        return false;
    }
    return true;
}
function isValidReportType(reportType) {
    if (!reportType) {
        return false;
    }
    return (reportType === CONST_1.default.REPORT.TYPE.EXPENSE ||
        reportType === CONST_1.default.REPORT.TYPE.INVOICE ||
        reportType === CONST_1.default.REPORT.UNSUPPORTED_TYPE.BILL ||
        reportType === CONST_1.default.REPORT.UNSUPPORTED_TYPE.PAYCHECK ||
        reportType === 'trip');
}
/**
 * Compute a new report name if needed based on an optimistic update
 */
function computeReportNameIfNeeded(report, incomingUpdate, context) {
    var _a;
    var allPolicies = context.allPolicies;
    // If no report is provided, extract it from the update (for new reports)
    var targetReport = report !== null && report !== void 0 ? report : incomingUpdate.value;
    if (!targetReport) {
        return null;
    }
    var policy = getPolicyByID(targetReport.policyID, allPolicies);
    if (!shouldComputeReportName(targetReport, policy)) {
        return null;
    }
    var titleField = (0, ReportUtils_1.getTitleReportField)((_a = policy === null || policy === void 0 ? void 0 : policy.fieldList) !== null && _a !== void 0 ? _a : {});
    if (!(titleField === null || titleField === void 0 ? void 0 : titleField.defaultValue)) {
        return null;
    }
    // Quick check: see if the update might affect the report name
    var updateType = determineObjectTypeByKey(incomingUpdate.key);
    var formula = titleField.defaultValue;
    var formulaParts = (0, Formula_1.parse)(formula);
    var transaction;
    if (updateType === 'transaction') {
        transaction = getTransactionByID(incomingUpdate.value.transactionID, context.allTransactions);
    }
    // Check if any formula part might be affected by this update
    var isAffected = formulaParts.some(function (part) {
        if (part.type === Formula_1.FORMULA_PART_TYPES.REPORT) {
            // Checking if the formula part is affected in this manner works, but it could certainly be more precise.
            // For example, a policy update only affects the part if the formula in the policy changed, or if the report part references a field on the policy.
            // However, if we run into performance problems, this would be a good place to optimize.
            return updateType === 'report' || updateType === 'transaction' || updateType === 'policy';
        }
        if (part.type === Formula_1.FORMULA_PART_TYPES.FIELD) {
            return updateType === 'report';
        }
        return false;
    });
    if (!isAffected) {
        return null;
    }
    // Build context with the updated data
    var updatedReport = updateType === 'report' && targetReport.reportID === getReportIDFromKey(incomingUpdate.key) ? __assign(__assign({}, targetReport), incomingUpdate.value) : targetReport;
    var updatedPolicy = updateType === 'policy' && targetReport.policyID === getPolicyIDFromKey(incomingUpdate.key) ? __assign(__assign({}, (policy !== null && policy !== void 0 ? policy : {})), incomingUpdate.value) : policy;
    var updatedTransaction = updateType === 'transaction' ? __assign(__assign({}, (transaction !== null && transaction !== void 0 ? transaction : {})), incomingUpdate.value) : undefined;
    // Compute the new name
    var formulaContext = {
        report: updatedReport,
        policy: updatedPolicy,
        transaction: updatedTransaction,
    };
    var newName = (0, Formula_1.compute)(formula, formulaContext);
    // Only return an update if the name actually changed
    if (newName && newName !== targetReport.reportName) {
        Log_1.default.info('[OptimisticReportNames] Report name computed', false, {
            updateType: updateType,
            isNewReport: !report,
        });
        return newName;
    }
    return null;
}
/**
 * Update optimistic report names based on incoming updates
 * This is the main middleware function that processes optimistic data
 */
function updateOptimisticReportNamesFromUpdates(updates, context) {
    var betas = context.betas, allReports = context.allReports, betaConfiguration = context.betaConfiguration;
    // Check if the feature is enabled
    if (!Permissions_1.default.isBetaEnabled(CONST_1.default.BETAS.AUTH_AUTO_REPORT_TITLE, betas, betaConfiguration)) {
        return updates;
    }
    Log_1.default.info('[OptimisticReportNames] Processing optimistic updates for report names', false, {
        updatesCount: updates.length,
    });
    var additionalUpdates = [];
    for (var _i = 0, updates_1 = updates; _i < updates_1.length; _i++) {
        var update = updates_1[_i];
        var objectType = determineObjectTypeByKey(update.key);
        switch (objectType) {
            case 'report': {
                var reportID = getReportIDFromKey(update.key);
                var report = getReportByID(reportID, allReports);
                // Handle both existing and new reports with the same function
                var reportNameUpdate = computeReportNameIfNeeded(report, update, context);
                if (reportNameUpdate) {
                    additionalUpdates.push({
                        key: getReportKey(reportID),
                        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                        value: {
                            reportName: reportNameUpdate,
                        },
                    });
                }
                break;
            }
            case 'policy': {
                var policyID = getPolicyIDFromKey(update.key);
                var affectedReports = getReportsForNameComputation(policyID, allReports, context);
                for (var _a = 0, affectedReports_1 = affectedReports; _a < affectedReports_1.length; _a++) {
                    var report = affectedReports_1[_a];
                    var reportNameUpdate = computeReportNameIfNeeded(report, update, context);
                    if (reportNameUpdate) {
                        additionalUpdates.push({
                            key: getReportKey(report.reportID),
                            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                            value: {
                                reportName: reportNameUpdate,
                            },
                        });
                    }
                }
                break;
            }
            case 'transaction': {
                var report = void 0;
                var transactionUpdate = update.value;
                if (transactionUpdate.reportID) {
                    report = getReportByID(transactionUpdate.reportID, allReports);
                }
                else {
                    report = getReportByTransactionID(getTransactionIDFromKey(update.key), context);
                }
                if (report) {
                    var reportNameUpdate = computeReportNameIfNeeded(report, update, context);
                    if (reportNameUpdate) {
                        additionalUpdates.push({
                            key: getReportKey(report.reportID),
                            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                            value: {
                                reportName: reportNameUpdate,
                            },
                        });
                    }
                }
                break;
            }
            default:
                continue;
        }
    }
    Log_1.default.info('[OptimisticReportNames] Processing completed', false, {
        additionalUpdatesCount: additionalUpdates.length,
    });
    return updates.concat(additionalUpdates);
}
