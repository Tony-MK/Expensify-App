"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const useOnyx_1 = require("./useOnyx");
/**
 * Selects violations related to provided transaction IDs and if present, the violations of their duplicates.
 * @param transactionIDs - An array of transaction IDs to fetch their violations for.
 * @param allTransactionsViolations - A collection of all transaction violations currently in the onyx db.
 * @returns - A collection of violations related to the transaction IDs and if present, the violations of their duplicates.
 * @private
 */
function selectViolationsWithDuplicates(transactionIDs, allTransactionsViolations) {
    if (!allTransactionsViolations || !transactionIDs?.length) {
        return {};
    }
    const result = {};
    for (const transactionID of transactionIDs) {
        const key = `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`;
        const transactionViolations = allTransactionsViolations[key];
        if (!transactionViolations) {
            continue;
        }
        result[key] = transactionViolations;
        transactionViolations
            .filter((violations) => violations.name === CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION)
            .flatMap((violations) => violations?.data?.duplicates ?? [])
            .forEach((duplicateID) => {
            if (!duplicateID) {
                return;
            }
            const duplicateKey = `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${duplicateID}`;
            const duplicateViolations = allTransactionsViolations[duplicateKey];
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
    const result = {};
    for (const transactionID of transactionIDs) {
        const key = `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`;
        const transaction = allTransactions[key];
        if (transaction) {
            result[key] = transaction;
        }
        const transactionViolations = duplicateTransactionViolations?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`];
        if (!transactionViolations) {
            continue;
        }
        transactionViolations
            .filter((violations) => violations.name === CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION)
            .flatMap((violations) => violations?.data?.duplicates ?? [])
            .forEach((duplicateID) => {
            if (!duplicateID) {
                return;
            }
            const duplicateKey = `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${duplicateID}`;
            const duplicateTransaction = allTransactions[duplicateKey];
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
    const violationsSelectorMemo = (0, react_1.useMemo)(() => {
        return (allTransactionsViolations) => selectViolationsWithDuplicates(transactionIDs, allTransactionsViolations);
    }, [transactionIDs]);
    const [duplicateTransactionViolations] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS, {
        canBeMissing: true,
        selector: violationsSelectorMemo,
    });
    const transactionSelector = (0, react_1.useMemo)(() => {
        return (allTransactions) => selectTransactionsWithDuplicates(transactionIDs, allTransactions, duplicateTransactionViolations);
    }, [transactionIDs, duplicateTransactionViolations]);
    const [duplicateTransactions] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION, {
        canBeMissing: true,
        selector: transactionSelector,
    });
    return (0, react_1.useMemo)(() => ({
        duplicateTransactions,
        duplicateTransactionViolations,
    }), [duplicateTransactions, duplicateTransactionViolations]);
}
exports.default = useDuplicateTransactionsAndViolations;
