"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const react_native_onyx_1 = require("react-native-onyx");
const Log_1 = require("@libs/Log");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
// This migration changes the property name on a transaction from receiptFilename to filename so that it matches what is stored in the database
function default_1() {
    return new Promise((resolve) => {
        // Connect to the TRANSACTION collection key in Onyx to get all of the stored transactions.
        // Go through each transaction and change the property name
        const connection = react_native_onyx_1.default.connect({
            key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
            waitForCollectionCallback: true,
            callback: (transactions) => {
                react_native_onyx_1.default.disconnect(connection);
                if (!transactions || (0, EmptyObject_1.isEmptyObject)(transactions)) {
                    Log_1.default.info('[Migrate Onyx] Skipped migration RenameReceiptFilename because there are no transactions');
                    return resolve();
                }
                const transactionsWithReceipt = Object.values(transactions).filter((transaction) => transaction?.receiptFilename);
                if (!transactionsWithReceipt?.length) {
                    Log_1.default.info('[Migrate Onyx] Skipped migration RenameReceiptFilename because there were no transactions with the receiptFilename property');
                    return resolve();
                }
                Log_1.default.info('[Migrate Onyx] Running  RenameReceiptFilename migration');
                const dataToSave = transactionsWithReceipt?.reduce((acc, transaction) => {
                    if (!transaction) {
                        return acc;
                    }
                    Log_1.default.info(`[Migrate Onyx] Renaming receiptFilename ${transaction.receiptFilename} to filename`);
                    acc[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`] = {
                        filename: transaction.receiptFilename,
                        receiptFilename: null,
                    };
                    return acc;
                }, {});
                // eslint-disable-next-line rulesdir/prefer-actions-set-data
                react_native_onyx_1.default.mergeCollection(ONYXKEYS_1.default.COLLECTION.TRANSACTION, dataToSave).then(() => {
                    Log_1.default.info(`[Migrate Onyx] Ran migration RenameReceiptFilename and renamed ${Object.keys(dataToSave)?.length} properties`);
                    resolve();
                });
            },
        });
    });
}
