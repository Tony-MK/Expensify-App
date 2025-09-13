"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var useOnyx_1 = require("./useOnyx");
/**
 * Selects violations related to provided transaction IDs and if present, the violations of their duplicates.
 * @param transactionIDs - An array of transaction IDs to fetch their violations for.
 * @param allTransactionsViolations - A collection of all transaction violations currently in the onyx db.
 * @returns - A collection of violations related to the transaction IDs and if present, the violations of their duplicates.
 * @private
 */
function selectViolationsWithDuplicates(transactionIDs, allTransactionsViolations) {
    if (!allTransactionsViolations || !(transactionIDs === null || transactionIDs === void 0 ? void 0 : transactionIDs.length)) {
        return {};
    }
    var result = {};
    for (var _i = 0, transactionIDs_1 = transactionIDs; _i < transactionIDs_1.length; _i++) {
        var transactionID = transactionIDs_1[_i];
        var key = "".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(transactionID);
        var transactionViolations = allTransactionsViolations[key];
        if (!transactionViolations) {
            continue;
        }
        result[key] = transactionViolations;
        transactionViolations
            .filter(function (violations) { return violations.name === CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION; })
            .flatMap(function (violations) { var _a, _b; return (_b = (_a = violations === null || violations === void 0 ? void 0 : violations.data) === null || _a === void 0 ? void 0 : _a.duplicates) !== null && _b !== void 0 ? _b : []; })
            .forEach(function (duplicateID) {
            if (!duplicateID) {
                return;
            }
            var duplicateKey = "".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(duplicateID);
            var duplicateViolations = allTransactionsViolations[duplicateKey];
            if (duplicateViolations) {
                result[duplicateKey] = duplicateViolations;
            }
        });
    }
    return result;
}
/**
 * Selects transactions related to provided transaction IDs and if present, the duplicate transactions.
 * @param transactionIDs - An array of transaction IDs to fetch their transactions for.
 * @param allTransactions - A collection of all transactions currently in the onyx.
 * @param duplicateTransactionViolations - A collection of all duplicate transaction violations currently in the onyx.
 * @returns - A collection of transactions related to the transaction IDs and if present, the duplicate transactions.
 */
function selectTransactionsWithDuplicates(transactionIDs, allTransactions, duplicateTransactionViolations) {
    if (!allTransactions) {
        return {};
    }
    var result = {};
    for (var _i = 0, transactionIDs_2 = transactionIDs; _i < transactionIDs_2.length; _i++) {
        var transactionID = transactionIDs_2[_i];
        var key = "".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactionID);
        var transaction = allTransactions[key];
        if (transaction) {
            result[key] = transaction;
        }
        var transactionViolations = duplicateTransactionViolations === null || duplicateTransactionViolations === void 0 ? void 0 : duplicateTransactionViolations["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(transactionID)];
        if (!transactionViolations) {
            continue;
        }
        transactionViolations
            .filter(function (violations) { return violations.name === CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION; })
            .flatMap(function (violations) { var _a, _b; return (_b = (_a = violations === null || violations === void 0 ? void 0 : violations.data) === null || _a === void 0 ? void 0 : _a.duplicates) !== null && _b !== void 0 ? _b : []; })
            .forEach(function (duplicateID) {
            if (!duplicateID) {
                return;
            }
            var duplicateKey = "".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(duplicateID);
            var duplicateTransaction = allTransactions[duplicateKey];
            if (duplicateTransaction) {
                result[duplicateKey] = duplicateTransaction;
            }
        });
    }
    return result;
}
/**
 * A hook to fetch transactions, their violations and if present, the duplicate transactions and their violations.
 * @param transactionIDs - Array of transaction IDs to check for duplicates.
 * @returns - An object containing duplicate transactions and their violations.
 */
function useDuplicateTransactionsAndViolations(transactionIDs) {
    var violationsSelectorMemo = (0, react_1.useMemo)(function () {
        return function (allTransactionsViolations) { return selectViolationsWithDuplicates(transactionIDs, allTransactionsViolations); };
    }, [transactionIDs]);
    var duplicateTransactionViolations = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS, {
        canBeMissing: true,
        selector: violationsSelectorMemo,
    })[0];
    var transactionSelector = (0, react_1.useMemo)(function () {
        return function (allTransactions) { return selectTransactionsWithDuplicates(transactionIDs, allTransactions, duplicateTransactionViolations); };
    }, [transactionIDs, duplicateTransactionViolations]);
    var duplicateTransactions = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION, {
        canBeMissing: true,
        selector: transactionSelector,
    })[0];
    return (0, react_1.useMemo)(function () { return ({
        duplicateTransactions: duplicateTransactions,
        duplicateTransactionViolations: duplicateTransactionViolations,
    }); }, [duplicateTransactions, duplicateTransactionViolations]);
}
exports.default = useDuplicateTransactionsAndViolations;
