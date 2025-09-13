"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeReportNameIfNeeded = computeReportNameIfNeeded;
exports.getReportByTransactionID = getReportByTransactionID;
exports.shouldComputeReportName = shouldComputeReportName;
exports.updateOptimisticReportNamesFromUpdates = updateOptimisticReportNamesFromUpdates;
const react_native_onyx_1 = require("react-native-onyx");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const Formula_1 = require("./Formula");
const Log_1 = require("./Log");
const Permissions_1 = require("./Permissions");
const ReportUtils_1 = require("./ReportUtils");
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
    return allReports[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`];
}
/**
 * Get policy by ID from the policies collection
 */
function getPolicyByID(policyID, allPolicies) {
    if (!policyID) {
        return;
    }
    return allPolicies[`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`];
}
/**
 * Get transaction by ID from the transactions collection
 */
function getTransactionByID(transactionID, allTransactions) {
    return allTransactions[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`];
}
/**
 * Get all reports associated with a policy ID
 */
function getReportsForNameComputation(policyID, allReports, context) {
    if (policyID === CONST_1.default.POLICY.ID_FAKE) {
        return [];
    }
    return Object.values(allReports).filter((report) => {
        if (report?.policyID !== policyID) {
            return false;
        }
        // Filter by type - only reports that support custom names
        if (!isValidReportType(report.type)) {
            return false;
        }
        // Filter by state - exclude reports in high states (like approved or higher)
        const stateThreshold = CONST_1.default.REPORT.STATE_NUM.APPROVED;
        if (report.stateNum && report.stateNum > stateThreshold) {
            return false;
        }
        // Filter by isArchived - exclude archived reports
        const reportNameValuePairs = context.allReportNameValuePairs[`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${report?.reportID}`];
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
    const transaction = getTransactionByID(transactionID, context.allTransactions);
    if (!transaction?.reportID) {
        return undefined;
    }
    // Get the report using the transaction's reportID from context
    return getReportByID(transaction.reportID, context.allReports);
}
/**
 * Generate the Onyx key for a report
 */
function getReportKey(reportID) {
    return `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`;
}
/**
 * Check if a report should have its name automatically computed
 */
function shouldComputeReportName(report, policy) {
    if (!report || !policy) {
        return false;
    }
    if (!isValidReportType(report.type)) {
        return false;
    }
    // Only compute names for expense reports with policies that have title fields
    // Check if the policy has a title field with a formula
    const titleField = (0, ReportUtils_1.getTitleReportField)(policy.fieldList ?? {});
    if (!titleField?.defaultValue) {
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
    const { allPolicies } = context;
    // If no report is provided, extract it from the update (for new reports)
    const targetReport = report ?? incomingUpdate.value;
    if (!targetReport) {
        return null;
    }
    const policy = getPolicyByID(targetReport.policyID, allPolicies);
    if (!shouldComputeReportName(targetReport, policy)) {
        return null;
    }
    const titleField = (0, ReportUtils_1.getTitleReportField)(policy?.fieldList ?? {});
    if (!titleField?.defaultValue) {
        return null;
    }
    // Quick check: see if the update might affect the report name
    const updateType = determineObjectTypeByKey(incomingUpdate.key);
    const formula = titleField.defaultValue;
    const formulaParts = (0, Formula_1.parse)(formula);
    let transaction;
    if (updateType === 'transaction') {
        transaction = getTransactionByID(incomingUpdate.value.transactionID, context.allTransactions);
    }
    // Check if any formula part might be affected by this update
    const isAffected = formulaParts.some((part) => {
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
    const updatedReport = updateType === 'report' && targetReport.reportID === getReportIDFromKey(incomingUpdate.key) ? { ...targetReport, ...incomingUpdate.value } : targetReport;
    const updatedPolicy = updateType === 'policy' && targetReport.policyID === getPolicyIDFromKey(incomingUpdate.key) ? { ...(policy ?? {}), ...incomingUpdate.value } : policy;
    const updatedTransaction = updateType === 'transaction' ? { ...(transaction ?? {}), ...incomingUpdate.value } : undefined;
    // Compute the new name
    const formulaContext = {
        report: updatedReport,
        policy: updatedPolicy,
        transaction: updatedTransaction,
    };
    const newName = (0, Formula_1.compute)(formula, formulaContext);
    // Only return an update if the name actually changed
    if (newName && newName !== targetReport.reportName) {
        Log_1.default.info('[OptimisticReportNames] Report name computed', false, {
            updateType,
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
    const { betas, allReports, betaConfiguration } = context;
    // Check if the feature is enabled
    if (!Permissions_1.default.isBetaEnabled(CONST_1.default.BETAS.AUTH_AUTO_REPORT_TITLE, betas, betaConfiguration)) {
        return updates;
    }
    Log_1.default.info('[OptimisticReportNames] Processing optimistic updates for report names', false, {
        updatesCount: updates.length,
    });
    const additionalUpdates = [];
    for (const update of updates) {
        const objectType = determineObjectTypeByKey(update.key);
        switch (objectType) {
            case 'report': {
                const reportID = getReportIDFromKey(update.key);
                const report = getReportByID(reportID, allReports);
                // Handle both existing and new reports with the same function
                const reportNameUpdate = computeReportNameIfNeeded(report, update, context);
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
                const policyID = getPolicyIDFromKey(update.key);
                const affectedReports = getReportsForNameComputation(policyID, allReports, context);
                for (const report of affectedReports) {
                    const reportNameUpdate = computeReportNameIfNeeded(report, update, context);
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
                let report;
                const transactionUpdate = update.value;
                if (transactionUpdate.reportID) {
                    report = getReportByID(transactionUpdate.reportID, allReports);
                }
                else {
                    report = getReportByTransactionID(getTransactionIDFromKey(update.key), context);
                }
                if (report) {
                    const reportNameUpdate = computeReportNameIfNeeded(report, update, context);
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
