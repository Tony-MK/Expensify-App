"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBackupTransaction = createBackupTransaction;
exports.removeBackupTransaction = removeBackupTransaction;
exports.restoreOriginalTransactionFromBackup = restoreOriginalTransactionFromBackup;
exports.createDraftTransaction = createDraftTransaction;
exports.removeDraftTransaction = removeDraftTransaction;
exports.removeTransactionReceipt = removeTransactionReceipt;
exports.removeDraftTransactions = removeDraftTransactions;
exports.removeDraftSplitTransaction = removeDraftSplitTransaction;
exports.replaceDefaultDraftTransaction = replaceDefaultDraftTransaction;
exports.buildOptimisticTransactionAndCreateDraft = buildOptimisticTransactionAndCreateDraft;
const date_fns_1 = require("date-fns");
const react_native_onyx_1 = require("react-native-onyx");
const IOUUtils_1 = require("@libs/IOUUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const Transaction_1 = require("./Transaction");
let connection;
/**
 * Makes a backup copy of a transaction object that can be restored when the user cancels editing a transaction.
 */
function createBackupTransaction(transaction, isDraft) {
    if (!transaction) {
        return;
    }
    // In Strict Mode, the backup logic useEffect is triggered twice on mount. The restore logic is delayed because we need to connect to the onyx first,
    // so it's possible that the restore logic is executed after creating the backup for the 2nd time which will completely clear the backup.
    // To avoid that, we need to cancel the pending connection.
    react_native_onyx_1.default.disconnect(connection);
    const newTransaction = {
        ...transaction,
    };
    const conn = react_native_onyx_1.default.connect({
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_BACKUP}${transaction.transactionID}`,
        callback: (transactionBackup) => {
            react_native_onyx_1.default.disconnect(conn);
            if (transactionBackup) {
                // If the transactionBackup exists it means we haven't properly restored original value on unmount
                // such as on page refresh, so we will just restore the transaction from the transactionBackup here.
                react_native_onyx_1.default.set(`${isDraft ? ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT : ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`, transactionBackup);
                return;
            }
            // Use set so that it will always fully overwrite any backup transaction that could have existed before
            react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_BACKUP}${transaction.transactionID}`, newTransaction);
        },
    });
}
/**
 * Removes a transaction from Onyx that was only used temporary in the edit flow
 */
function removeBackupTransaction(transactionID) {
    if (!transactionID) {
        return;
    }
    react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_BACKUP}${transactionID}`, null);
}
function restoreOriginalTransactionFromBackup(transactionID, isDraft) {
    if (!transactionID) {
        return;
    }
    connection = react_native_onyx_1.default.connect({
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_BACKUP}${transactionID}`,
        callback: (backupTransaction) => {
            react_native_onyx_1.default.disconnect(connection);
            // Use set to completely overwrite the original transaction
            react_native_onyx_1.default.set(`${isDraft ? ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT : ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`, backupTransaction ?? null);
            removeBackupTransaction(transactionID);
        },
    });
}
function createDraftTransaction(transaction) {
    if (!transaction) {
        return;
    }
    const newTransaction = {
        ...transaction,
    };
    // Use set so that it will always fully overwrite any backup transaction that could have existed before
    react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transaction.transactionID}`, newTransaction);
}
function removeDraftTransaction(transactionID) {
    if (!transactionID) {
        return;
    }
    react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transactionID}`, null);
}
function removeDraftSplitTransaction(transactionID) {
    if (!transactionID) {
        return;
    }
    react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT}${transactionID}`, null);
}
function removeDraftTransactions(shouldExcludeInitialTransaction = false, allTransactionDrafts) {
    const draftTransactions = (0, Transaction_1.getDraftTransactions)(allTransactionDrafts);
    const draftTransactionsSet = draftTransactions.reduce((acc, item) => {
        if (shouldExcludeInitialTransaction && item.transactionID === CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID) {
            return acc;
        }
        acc[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${item.transactionID}`] = null;
        return acc;
    }, {});
    react_native_onyx_1.default.multiSet(draftTransactionsSet);
}
function replaceDefaultDraftTransaction(transaction) {
    if (!transaction) {
        return;
    }
    react_native_onyx_1.default.update([
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID}`,
            value: {
                ...transaction,
                transactionID: CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transaction.transactionID}`,
            value: null,
        },
    ]);
}
function removeTransactionReceipt(transactionID) {
    if (!transactionID) {
        return;
    }
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transactionID}`, { receipt: null });
}
function buildOptimisticTransactionAndCreateDraft({ initialTransaction, currentUserPersonalDetails, reportID }) {
    const newTransactionID = (0, Transaction_1.generateTransactionID)();
    const { currency, iouRequestType, isFromGlobalCreate, splitPayerAccountIDs } = initialTransaction ?? {};
    const newTransaction = {
        amount: 0,
        created: (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd'),
        currency,
        comment: { attendees: (0, IOUUtils_1.formatCurrentUserToAttendee)(currentUserPersonalDetails, reportID) },
        iouRequestType,
        reportID,
        transactionID: newTransactionID,
        isFromGlobalCreate,
        merchant: CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT,
        splitPayerAccountIDs,
    };
    createDraftTransaction(newTransaction);
    return newTransaction;
}
