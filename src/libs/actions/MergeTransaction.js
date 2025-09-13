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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupMergeTransactionData = setupMergeTransactionData;
exports.setMergeTransactionKey = setMergeTransactionKey;
exports.getTransactionsForMerging = getTransactionsForMerging;
exports.mergeTransactionRequest = mergeTransactionRequest;
var react_native_onyx_1 = require("react-native-onyx");
var API = require("@libs/API");
var types_1 = require("@libs/API/types");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var CONST_1 = require("@src/CONST");
var TransactionUtils_1 = require("@src/libs/TransactionUtils");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
/**
 * Setup merge transaction data for merging flow
 */
function setupMergeTransactionData(transactionID, values) {
    react_native_onyx_1.default.set("".concat(ONYXKEYS_1.default.COLLECTION.MERGE_TRANSACTION).concat(transactionID), values);
}
/**
 * Sets merge transaction data for a specific transaction
 */
function setMergeTransactionKey(transactionID, values) {
    react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.MERGE_TRANSACTION).concat(transactionID), values);
}
/**
 * Fetches eligible transactions for merging
 */
function getTransactionsForMergingFromAPI(transactionID) {
    var parameters = {
        transactionID: transactionID,
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
    var transactionsArray = Object.values(transactions !== null && transactions !== void 0 ? transactions : {});
    var eligibleTransactions = transactionsArray.filter(function (transaction) {
        if (!transaction || transaction.transactionID === targetTransaction.transactionID) {
            return false;
        }
        var isUnreportedExpense = !(transaction === null || transaction === void 0 ? void 0 : transaction.reportID) || (transaction === null || transaction === void 0 ? void 0 : transaction.reportID) === CONST_1.default.REPORT.UNREPORTED_REPORT_ID;
        return (areTransactionsEligibleForMerge(targetTransaction, transaction) &&
            !(0, TransactionUtils_1.isTransactionPendingDelete)(transaction) &&
            (isUnreportedExpense || (!!transaction.reportID && (0, ReportUtils_1.isMoneyRequestReportEligibleForMerge)(transaction.reportID, false))));
    });
    react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.MERGE_TRANSACTION).concat(transactionID), {
        eligibleTransactions: eligibleTransactions,
    });
}
function getTransactionsForMerging(_a) {
    var isOffline = _a.isOffline, targetTransaction = _a.targetTransaction, transactions = _a.transactions, policy = _a.policy, report = _a.report, currentUserLogin = _a.currentUserLogin;
    var transactionID = targetTransaction.transactionID;
    // Collect/Control workspaces:
    // - Admins and approvers: The list of eligible expenses will only contain the expenses from the report that the admin/approver triggered the merge from. This is intentionally limited since they’ll only be reviewing one report at a time.
    // - Submitters will see all their editable expenses, including their IOUs/unreported expenses
    // IOU:
    // - There are no admins/approvers outside of the submitter in these cases, so there’s no consideration for different roles.
    // - The submitter, who is also the admin, will see all their editable expenses, including their IOUs/unreported expenses
    var isAdmin = (0, PolicyUtils_1.isPolicyAdmin)(policy, currentUserLogin);
    var isManager = (0, ReportUtils_1.isReportManager)(report);
    if ((0, PolicyUtils_1.isPaidGroupPolicy)(policy) && (isAdmin || isManager) && !(0, ReportUtils_1.isCurrentUserSubmitter)(report)) {
        var reportTransactions = (0, ReportUtils_1.getReportTransactions)(report === null || report === void 0 ? void 0 : report.reportID);
        var eligibleTransactions = reportTransactions.filter(function (transaction) {
            if (!transaction || transaction.transactionID === transactionID) {
                return false;
            }
            return areTransactionsEligibleForMerge(targetTransaction, transaction);
        });
        react_native_onyx_1.default.merge("".concat(ONYXKEYS_1.default.COLLECTION.MERGE_TRANSACTION).concat(transactionID), {
            eligibleTransactions: eligibleTransactions,
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
    var _a = __assign(__assign({}, mergeTransaction), { comment: mergeTransaction.description }), description = _a.description, transactionChanges = __rest(_a, ["description"]);
    // Compare mergeTransaction with targetTransaction and remove fields with same values
    var filteredTransactionChanges = Object.fromEntries(Object.entries(transactionChanges).filter(function (_a) {
        var _b;
        var key = _a[0], mergeValue = _a[1];
        // Special handling for comment field
        if (key === 'comment') {
            return mergeValue !== ((_b = targetTransaction.comment) === null || _b === void 0 ? void 0 : _b.comment);
        }
        // For all other fields, compare directly
        var targetValue = targetTransaction[key];
        return mergeValue !== targetValue;
    }));
    var targetTransactionUpdated = (0, TransactionUtils_1.getUpdatedTransaction)({
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
    var _a, _b;
    var _c, _d, _e, _f;
    var isUnreportedExpense = !mergeTransaction.reportID || mergeTransaction.reportID === CONST_1.default.REPORT.UNREPORTED_REPORT_ID;
    // If the target transaction we're keeping is unreported, the amount needs to be always negative. Otherwise for expense reports it needs to be the opposite sign.
    var finalAmount = isUnreportedExpense ? -Math.abs(mergeTransaction.amount) : -mergeTransaction.amount;
    // Call the merge transaction action
    var params = {
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
        receiptID: (_c = mergeTransaction.receipt) === null || _c === void 0 ? void 0 : _c.receiptID,
        reportID: mergeTransaction.reportID,
    };
    var targetTransactionUpdated = getOptimisticTargetTransactionData(targetTransaction, mergeTransaction);
    // Optimistic update the target transaction with the new values
    var optimisticTargetTransactionData = {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: "".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(targetTransaction.transactionID),
        value: __assign(__assign({}, targetTransactionUpdated), (params.receiptID && {
            receipt: {
                source: (_e = (_d = mergeTransaction.receipt) === null || _d === void 0 ? void 0 : _d.source) !== null && _e !== void 0 ? _e : (_f = targetTransaction.receipt) === null || _f === void 0 ? void 0 : _f.source,
                receiptID: params.receiptID,
            },
        })),
    };
    var failureTargetTransactionData = {
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: "".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(targetTransaction.transactionID),
        value: targetTransaction,
    };
    // Optimistic delete the source transaction and also delete its report if it was a single expense report
    var optimisticSourceTransactionData = {
        onyxMethod: react_native_onyx_1.default.METHOD.SET,
        key: "".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(sourceTransaction.transactionID),
        value: null,
    };
    var failureSourceTransactionData = {
        onyxMethod: react_native_onyx_1.default.METHOD.SET,
        key: "".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(sourceTransaction.transactionID),
        value: sourceTransaction,
    };
    var transactionsOfSourceReport = (0, ReportUtils_1.getReportTransactions)(sourceTransaction.reportID);
    var optimisticSourceReportData = transactionsOfSourceReport.length === 1
        ? [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.SET,
                key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(sourceTransaction.reportID),
                value: null,
            },
        ]
        : [];
    var failureSourceReportData = transactionsOfSourceReport.length === 1
        ? [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.SET,
                key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(sourceTransaction.reportID),
                value: (0, ReportUtils_1.getReportOrDraftReport)(sourceTransaction.reportID),
            },
        ]
        : [];
    var iouActionOfSourceTransaction = (0, ReportActionsUtils_1.getIOUActionForReportID)(sourceTransaction.reportID, sourceTransaction.transactionID);
    var optimisticSourceReportActionData = iouActionOfSourceTransaction
        ? [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(sourceTransaction.reportID),
                value: (_a = {},
                    _a[iouActionOfSourceTransaction.reportActionID] = {
                        pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE,
                    },
                    _a),
            },
        ]
        : [];
    var failureSourceReportActionData = iouActionOfSourceTransaction
        ? [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(sourceTransaction.reportID),
                value: (_b = {},
                    _b[iouActionOfSourceTransaction.reportActionID] = {
                        pendingAction: null,
                    },
                    _b),
            },
        ]
        : [];
    // Optimistic delete the merge transaction
    var optimisticMergeTransactionData = {
        onyxMethod: react_native_onyx_1.default.METHOD.SET,
        key: "".concat(ONYXKEYS_1.default.COLLECTION.MERGE_TRANSACTION).concat(mergeTransactionID),
        value: null,
    };
    // Optimistic delete duplicated transaction violations
    var optimisticTransactionViolations = [targetTransaction.transactionID, sourceTransaction.transactionID].map(function (id) {
        var violations = (0, TransactionUtils_1.getTransactionViolationsOfTransaction)(id);
        return {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: "".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(id),
            value: violations.filter(function (violation) { return violation.name !== CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION; }),
        };
    });
    var failureTransactionViolations = [targetTransaction.transactionID, sourceTransaction.transactionID].map(function (id) {
        var violations = (0, TransactionUtils_1.getTransactionViolationsOfTransaction)(id);
        return {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: "".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(id),
            value: violations,
        };
    });
    var optimisticData = __spreadArray(__spreadArray(__spreadArray(__spreadArray([
        optimisticTargetTransactionData,
        optimisticSourceTransactionData
    ], optimisticSourceReportData, true), [
        optimisticMergeTransactionData
    ], false), optimisticTransactionViolations, true), optimisticSourceReportActionData, true);
    var failureData = __spreadArray(__spreadArray(__spreadArray([
        failureTargetTransactionData,
        failureSourceTransactionData
    ], failureSourceReportData, true), failureTransactionViolations, true), failureSourceReportActionData, true);
    API.write(types_1.WRITE_COMMANDS.MERGE_TRANSACTION, params, { optimisticData: optimisticData, failureData: failureData });
}
