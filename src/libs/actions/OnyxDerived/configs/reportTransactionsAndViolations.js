"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createOnyxDerivedValueConfig_1 = require("@userActions/OnyxDerived/createOnyxDerivedValueConfig");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var previousTransactions = {};
var previousViolations = {};
exports.default = (0, createOnyxDerivedValueConfig_1.default)({
    key: ONYXKEYS_1.default.DERIVED.REPORT_TRANSACTIONS_AND_VIOLATIONS,
    dependencies: [ONYXKEYS_1.default.COLLECTION.TRANSACTION, ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS],
    compute: function (_a, _b) {
        var transactions = _a[0], violations = _a[1];
        var sourceValues = _b.sourceValues, currentValue = _b.currentValue;
        if (!transactions) {
            return {};
        }
        // If there is a source value for transactions or transaction violations, we need to process only the transactions that have been updated or added
        // If not, we need to process all transactions
        var transactionsUpdates = sourceValues === null || sourceValues === void 0 ? void 0 : sourceValues[ONYXKEYS_1.default.COLLECTION.TRANSACTION];
        var transactionViolationsUpdates = sourceValues === null || sourceValues === void 0 ? void 0 : sourceValues[ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS];
        var transactionsToProcess = Object.keys(transactions);
        if (transactionsUpdates) {
            transactionsToProcess = Object.keys(transactionsUpdates);
        }
        else if (transactionViolationsUpdates) {
            transactionsToProcess = Object.keys(transactionViolationsUpdates).map(function (transactionViolation) {
                return transactionViolation.replace(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS, ONYXKEYS_1.default.COLLECTION.TRANSACTION);
            });
        }
        var reportTransactionsAndViolations = currentValue !== null && currentValue !== void 0 ? currentValue : {};
        for (var _i = 0, transactionsToProcess_1 = transactionsToProcess; _i < transactionsToProcess_1.length; _i++) {
            var transactionKey = transactionsToProcess_1[_i];
            var transaction = transactions[transactionKey];
            var reportID = transaction === null || transaction === void 0 ? void 0 : transaction.reportID;
            // If the reportID of the transaction has changed (e.g. the transaction was split into multiple reports), we need to delete the transaction from the previous reportID and the violations from the previous reportID
            var previousTransaction = previousTransactions === null || previousTransactions === void 0 ? void 0 : previousTransactions[transactionKey];
            var previousReportID = previousTransaction === null || previousTransaction === void 0 ? void 0 : previousTransaction.reportID;
            if (previousReportID && previousReportID !== reportID && reportTransactionsAndViolations[previousReportID]) {
                delete reportTransactionsAndViolations[previousReportID].transactions[transactionKey];
                var transactionID_1 = previousTransaction === null || previousTransaction === void 0 ? void 0 : previousTransaction.transactionID;
                if (transactionID_1) {
                    delete reportTransactionsAndViolations[previousReportID].violations["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(transactionID_1)];
                }
            }
            if (!reportID) {
                continue;
            }
            if (!reportTransactionsAndViolations[reportID]) {
                reportTransactionsAndViolations[reportID] = {
                    transactions: {},
                    violations: {},
                };
            }
            var transactionID = transaction.transactionID;
            var violationKey = "".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(transactionID);
            var transactionViolations = violations === null || violations === void 0 ? void 0 : violations[violationKey];
            var previousTransactionViolations = previousViolations === null || previousViolations === void 0 ? void 0 : previousViolations[violationKey];
            var violationInSourceValues = transactionViolationsUpdates === null || transactionViolationsUpdates === void 0 ? void 0 : transactionViolationsUpdates[violationKey];
            // If violations exist and have length > 0, add them to the structure
            if (transactionViolations && transactionViolations.length > 0) {
                reportTransactionsAndViolations[reportID].violations[violationKey] = transactionViolations;
            }
            else if (violationInSourceValues === undefined || (previousTransactionViolations && previousTransactionViolations.length > 0)) {
                // If violations were removed (previous had violations but current doesn't) or explicitly set to undefined, remove them from the structure
                delete reportTransactionsAndViolations[reportID].violations[violationKey];
            }
            reportTransactionsAndViolations[reportID].transactions[transactionKey] = transaction;
        }
        previousTransactions = transactions;
        previousViolations = violations;
        return reportTransactionsAndViolations;
    },
});
