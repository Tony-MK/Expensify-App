"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupMergeTransactionData = setupMergeTransactionData;
exports.setMergeTransactionKey = setMergeTransactionKey;
exports.getTransactionsForMerging = getTransactionsForMerging;
exports.mergeTransactionRequest = mergeTransactionRequest;
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const TransactionUtils_1 = require("@src/libs/TransactionUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
/**
 * Setup merge transaction data for merging flow
 */
function setupMergeTransactionData(transactionID, values) {
    react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.MERGE_TRANSACTION}${transactionID}`, values);
}
/**
 * Sets merge transaction data for a specific transaction
 */
function setMergeTransactionKey(transactionID, values) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.MERGE_TRANSACTION}${transactionID}`, values);
}
/**
 * Fetches eligible transactions for merging
 */
function getTransactionsForMergingFromAPI(transactionID) {
    const parameters = {
        transactionID,
    };
    API.read(types_1.READ_COMMANDS.GET_TRANSACTIONS_FOR_MERGING, parameters);
}
function areTransactionsEligibleForMerge(transaction1, transaction2) {
    // Do not allow merging two card transactions
    if ((0, TransactionUtils_1.isCardTransaction)(transaction1) && (0, TransactionUtils_1.isCardTransaction)(transaction2)) {
        return false;
    }
    // Do not allow merging two $0 transactions
    if ((0, TransactionUtils_1.getAmount)(transaction1, false, false) === 0 && (0, TransactionUtils_1.getAmount)(transaction2, false, false) === 0) {
        return false;
    }
    // Temporary exclude IOU reports from eligible list
    // See: https://github.com/Expensify/App/issues/70329#issuecomment-3277062003
    if ((0, ReportUtils_1.isIOUReport)(transaction1.reportID) || (0, ReportUtils_1.isIOUReport)(transaction2.reportID)) {
        return false;
    }
    return true;
}
/**
 * Fetches eligible transactions for merging locally
 * This is FE version of READ_COMMANDS.GET_TRANSACTIONS_FOR_MERGING API call
 */
function getTransactionsForMergingLocally(transactionID, targetTransaction, transactions) {
    const transactionsArray = Object.values(transactions ?? {});
    const eligibleTransactions = transactionsArray.filter((transaction) => {
        if (!transaction || transaction.transactionID === targetTransaction.transactionID) {
            return false;
        }
        const isUnreportedExpense = !transaction?.reportID || transaction?.reportID === CONST_1.default.REPORT.UNREPORTED_REPORT_ID;
        return (areTransactionsEligibleForMerge(targetTransaction, transaction) &&
            !(0, TransactionUtils_1.isTransactionPendingDelete)(transaction) &&
            (isUnreportedExpense || (!!transaction.reportID && (0, ReportUtils_1.isMoneyRequestReportEligibleForMerge)(transaction.reportID, false))));
    });
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.MERGE_TRANSACTION}${transactionID}`, {
        eligibleTransactions,
    });
}
function getTransactionsForMerging({ isOffline, targetTransaction, transactions, policy, report, currentUserLogin, }) {
    const transactionID = targetTransaction.transactionID;
    // Collect/Control workspaces:
    // - Admins and approvers: The list of eligible expenses will only contain the expenses from the report that the admin/approver triggered the merge from. This is intentionally limited since they’ll only be reviewing one report at a time.
    // - Submitters will see all their editable expenses, including their IOUs/unreported expenses
    // IOU:
    // - There are no admins/approvers outside of the submitter in these cases, so there’s no consideration for different roles.
    // - The submitter, who is also the admin, will see all their editable expenses, including their IOUs/unreported expenses
    const isAdmin = (0, PolicyUtils_1.isPolicyAdmin)(policy, currentUserLogin);
    const isManager = (0, ReportUtils_1.isReportManager)(report);
    if ((0, PolicyUtils_1.isPaidGroupPolicy)(policy) && (isAdmin || isManager) && !(0, ReportUtils_1.isCurrentUserSubmitter)(report)) {
        const reportTransactions = (0, ReportUtils_1.getReportTransactions)(report?.reportID);
        const eligibleTransactions = reportTransactions.filter((transaction) => {
            if (!transaction || transaction.transactionID === transactionID) {
                return false;
            }
            return areTransactionsEligibleForMerge(targetTransaction, transaction);
        });
        react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.MERGE_TRANSACTION}${transactionID}`, {
            eligibleTransactions,
        });
        return;
    }
    if (isOffline) {
        getTransactionsForMergingLocally(transactionID, targetTransaction, transactions);
    }
    else {
        getTransactionsForMergingFromAPI(transactionID);
    }
}
function getOptimisticTargetTransactionData(targetTransaction, mergeTransaction) {
    const { description, ...transactionChanges } = { ...mergeTransaction, comment: mergeTransaction.description };
    // Compare mergeTransaction with targetTransaction and remove fields with same values
    const filteredTransactionChanges = Object.fromEntries(Object.entries(transactionChanges).filter(([key, mergeValue]) => {
        // Special handling for comment field
        if (key === 'comment') {
            return mergeValue !== targetTransaction.comment?.comment;
        }
        // For all other fields, compare directly
        const targetValue = targetTransaction[key];
        return mergeValue !== targetValue;
    }));
    const targetTransactionUpdated = (0, TransactionUtils_1.getUpdatedTransaction)({
        transaction: targetTransaction,
        transactionChanges: filteredTransactionChanges,
        isFromExpenseReport: (0, ReportUtils_1.isExpenseReport)(mergeTransaction.reportID),
    });
    return targetTransactionUpdated;
}
/**
 * Merges two transactions by updating the target transaction with selected fields and deleting the source transaction
 */
function mergeTransactionRequest(mergeTransactionID, mergeTransaction, targetTransaction, sourceTransaction) {
    const isUnreportedExpense = !mergeTransaction.reportID || mergeTransaction.reportID === CONST_1.default.REPORT.UNREPORTED_REPORT_ID;
    // If the target transaction we're keeping is unreported, the amount needs to be always negative. Otherwise for expense reports it needs to be the opposite sign.
    const finalAmount = isUnreportedExpense ? -Math.abs(mergeTransaction.amount) : -mergeTransaction.amount;
    // Call the merge transaction action
    const params = {
        transactionID: mergeTransaction.targetTransactionID,
        transactionIDList: [mergeTransaction.sourceTransactionID],
        created: mergeTransaction.created,
        merchant: mergeTransaction.merchant,
        amount: finalAmount,
        currency: mergeTransaction.currency,
        category: mergeTransaction.category,
        comment: mergeTransaction.description,
        billable: mergeTransaction.billable,
        reimbursable: mergeTransaction.reimbursable,
        tag: mergeTransaction.tag,
        receiptID: mergeTransaction.receipt?.receiptID,
        reportID: mergeTransaction.reportID,
    };
    const targetTransactionUpdated = getOptimisticTargetTransactionData(targetTransaction, mergeTransaction);
    // Optimistic update the target transaction with the new values
    const optimisticTargetTransactionData = {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${targetTransaction.transactionID}`,
        value: {
            ...targetTransactionUpdated,
            // Update receipt if receiptID is provided
            ...(params.receiptID && {
                receipt: {
                    source: mergeTransaction.receipt?.source ?? targetTransaction.receipt?.source,
                    receiptID: params.receiptID,
                },
            }),
        },
    };
    const failureTargetTransactionData = {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${targetTransaction.transactionID}`,
        value: targetTransaction,
    };
    // Optimistic delete the source transaction and also delete its report if it was a single expense report
    const optimisticSourceTransactionData = {
        onyxMethod: react_native_onyx_1.default.METHOD.SET,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${sourceTransaction.transactionID}`,
        value: null,
    };
    const failureSourceTransactionData = {
        onyxMethod: react_native_onyx_1.default.METHOD.SET,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${sourceTransaction.transactionID}`,
        value: sourceTransaction,
    };
    const transactionsOfSourceReport = (0, ReportUtils_1.getReportTransactions)(sourceTransaction.reportID);
    const optimisticSourceReportData = transactionsOfSourceReport.length === 1
        ? [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.SET,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${sourceTransaction.reportID}`,
                value: null,
            },
        ]
        : [];
    const failureSourceReportData = transactionsOfSourceReport.length === 1
        ? [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.SET,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${sourceTransaction.reportID}`,
                value: (0, ReportUtils_1.getReportOrDraftReport)(sourceTransaction.reportID),
            },
        ]
        : [];
    const iouActionOfSourceTransaction = (0, ReportActionsUtils_1.getIOUActionForReportID)(sourceTransaction.reportID, sourceTransaction.transactionID);
    const optimisticSourceReportActionData = iouActionOfSourceTransaction
        ? [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${sourceTransaction.reportID}`,
                value: {
                    [iouActionOfSourceTransaction.reportActionID]: {
                        pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
                    },
                },
            },
        ]
        : [];
    const failureSourceReportActionData = iouActionOfSourceTransaction
        ? [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${sourceTransaction.reportID}`,
                value: {
                    [iouActionOfSourceTransaction.reportActionID]: {
                        pendingAction: null,
                    },
                },
            },
        ]
        : [];
    // Optimistic delete the merge transaction
    const optimisticMergeTransactionData = {
        onyxMethod: react_native_onyx_1.default.METHOD.SET,
        key: `${ONYXKEYS_1.default.COLLECTION.MERGE_TRANSACTION}${mergeTransactionID}`,
        value: null,
    };
    // Optimistic delete duplicated transaction violations
    const optimisticTransactionViolations = [targetTransaction.transactionID, sourceTransaction.transactionID].map((id) => {
        const violations = (0, TransactionUtils_1.getTransactionViolationsOfTransaction)(id);
        return {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${id}`,
            value: violations.filter((violation) => violation.name !== CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION),
        };
    });
    const failureTransactionViolations = [targetTransaction.transactionID, sourceTransaction.transactionID].map((id) => {
        const violations = (0, TransactionUtils_1.getTransactionViolationsOfTransaction)(id);
        return {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${id}`,
            value: violations,
        };
    });
    const optimisticData = [
        optimisticTargetTransactionData,
        optimisticSourceTransactionData,
        ...optimisticSourceReportData,
        optimisticMergeTransactionData,
        ...optimisticTransactionViolations,
        ...optimisticSourceReportActionData,
    ];
    const failureData = [
        failureTargetTransactionData,
        failureSourceTransactionData,
        ...failureSourceReportData,
        ...failureTransactionViolations,
        ...failureSourceReportActionData,
    ];
    API.write(types_1.WRITE_COMMANDS.MERGE_TRANSACTION, params, { optimisticData, failureData });
}
