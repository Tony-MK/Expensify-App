"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const MergeTransaction_1 = require("@libs/actions/MergeTransaction");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const mergeTransaction_1 = require("../utils/collections/mergeTransaction");
const reports_1 = require("../utils/collections/reports");
const transaction_1 = require("../utils/collections/transaction");
const TestHelper = require("../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
// Helper function to create mock violations
function createMockViolations() {
    return [
        {
            type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
            name: CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION,
            showInReview: true,
        },
        {
            type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
            name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY,
            showInReview: true,
        },
    ];
}
describe('mergeTransactionRequest', () => {
    let mockFetch;
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    beforeEach(() => {
        global.fetch = TestHelper.getGlobalFetchMock();
        mockFetch = fetch;
        return react_native_onyx_1.default.clear().then(waitForBatchedUpdates_1.default);
    });
    it('should update target transaction with merged values optimistically', async () => {
        // Given:
        // - Target transaction with original merchant and category values
        // - Source transaction that will be deleted after merge (only transaction in its report)
        // - Merge transaction containing the final values to keep
        const targetTransaction = {
            ...(0, transaction_1.default)(1),
            amount: 100,
            currency: 'USD',
            transactionID: 'target123',
            merchant: 'Original Merchant',
            category: 'Original Category',
            reportID: 'target-report-456',
        };
        const sourceExpenseReport = {
            ...(0, reports_1.createExpenseReport)(1),
            reportID: 'source-report-123',
        };
        const sourceTransaction = {
            ...(0, transaction_1.default)(2),
            transactionID: 'source456',
            reportID: sourceExpenseReport.reportID,
        };
        const mergeTransaction = {
            ...(0, mergeTransaction_1.default)(1),
            amount: 200,
            currency: 'USD',
            targetTransactionID: 'target123',
            sourceTransactionID: 'source456',
            merchant: 'Updated Merchant',
            category: 'Updated Category',
            tag: 'Updated Tag',
        };
        const mergeTransactionID = 'merge789';
        // Set up initial state in Onyx
        await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${targetTransaction.transactionID}`, targetTransaction);
        await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${sourceTransaction.transactionID}`, sourceTransaction);
        await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${sourceExpenseReport.reportID}`, sourceExpenseReport);
        await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.MERGE_TRANSACTION}${mergeTransactionID}`, mergeTransaction);
        mockFetch?.pause?.();
        // When: The merge transaction request is initiated
        // This should immediately update the UI with optimistic values
        (0, MergeTransaction_1.mergeTransactionRequest)(mergeTransactionID, mergeTransaction, targetTransaction, sourceTransaction);
        await mockFetch?.resume?.();
        await (0, waitForBatchedUpdates_1.default)();
        // Then: Verify that optimistic updates are applied correctly
        const updatedTargetTransaction = await new Promise((resolve) => {
            const connection = react_native_onyx_1.default.connect({
                key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${targetTransaction.transactionID}`,
                callback: (transaction) => {
                    react_native_onyx_1.default.disconnect(connection);
                    resolve(transaction ?? null);
                },
            });
        });
        const updatedSourceTransaction = await new Promise((resolve) => {
            const connection = react_native_onyx_1.default.connect({
                key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${sourceTransaction.transactionID}`,
                callback: (transaction) => {
                    react_native_onyx_1.default.disconnect(connection);
                    resolve(transaction ?? null);
                },
            });
        });
        const updatedSourceReport = await new Promise((resolve) => {
            const connection = react_native_onyx_1.default.connect({
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${sourceExpenseReport.reportID}`,
                callback: (report) => {
                    react_native_onyx_1.default.disconnect(connection);
                    resolve(report ?? null);
                },
            });
        });
        const updatedMergeTransaction = await new Promise((resolve) => {
            const connection = react_native_onyx_1.default.connect({
                key: `${ONYXKEYS_1.default.COLLECTION.MERGE_TRANSACTION}${mergeTransactionID}`,
                callback: (transaction) => {
                    react_native_onyx_1.default.disconnect(connection);
                    resolve(transaction ?? null);
                },
            });
        });
        // Verify target transaction is updated with merged values
        expect(updatedTargetTransaction?.modifiedAmount).toBe(mergeTransaction.amount);
        expect(updatedTargetTransaction?.modifiedMerchant).toBe(mergeTransaction.merchant);
        expect(updatedTargetTransaction?.category).toBe(mergeTransaction.category);
        expect(updatedTargetTransaction?.tag).toBe(mergeTransaction.tag);
        expect(updatedTargetTransaction?.comment?.comment).toBe(mergeTransaction.description);
        // Verify source transaction is deleted
        expect(updatedSourceTransaction).toBeNull();
        // Verify source report is deleted (since it only had one transaction)
        expect(updatedSourceReport).toBeNull();
        // Verify merge transaction is cleaned up
        expect(updatedMergeTransaction).toBeNull();
    });
    it('should restore original state when API returns error', async () => {
        // Given:
        // - Target transaction with original data that should be restored on failure
        // - Source transaction that should be restored if merge fails (only transaction in its report)
        // - Source report that should be restored if merge fails
        // - Transaction violations are set up in Onyx for both transactions
        const sourceReport = {
            ...(0, reports_1.createExpenseReport)(1),
            reportID: 'source-report-123',
        };
        const targetTransaction = {
            ...(0, transaction_1.default)(1),
            transactionID: 'target123',
            merchant: 'Original Merchant',
            category: 'Original Category',
            reportID: 'target-report-456',
        };
        const sourceTransaction = {
            ...(0, transaction_1.default)(2),
            transactionID: 'source456',
            merchant: 'Source Merchant',
            reportID: sourceReport.reportID,
        };
        const mergeTransaction = {
            ...(0, mergeTransaction_1.default)(1),
            targetTransactionID: 'target123',
            sourceTransactionID: 'source456',
            merchant: 'Updated Merchant',
            category: 'Updated Category',
        };
        const mergeTransactionID = 'merge789';
        const mockViolations = createMockViolations();
        mockFetch?.pause?.();
        // Set up initial state in Onyx
        await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${targetTransaction.transactionID}`, targetTransaction);
        await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${sourceTransaction.transactionID}`, sourceTransaction);
        await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${sourceReport.reportID}`, sourceReport);
        await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.MERGE_TRANSACTION}${mergeTransactionID}`, mergeTransaction);
        await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${targetTransaction.transactionID}`, mockViolations);
        await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${sourceTransaction.transactionID}`, mockViolations);
        await (0, waitForBatchedUpdates_1.default)();
        // When: The merge request is executed but the API will return an error
        mockFetch?.fail?.();
        (0, MergeTransaction_1.mergeTransactionRequest)(mergeTransactionID, mergeTransaction, targetTransaction, sourceTransaction);
        await (0, waitForBatchedUpdates_1.default)();
        // Resume fetch to process the failed API response
        await mockFetch?.resume?.();
        await (0, waitForBatchedUpdates_1.default)();
        // Then: Verify that original state is restored after API failure
        const restoredTargetTransaction = await new Promise((resolve) => {
            const connection = react_native_onyx_1.default.connect({
                key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${targetTransaction.transactionID}`,
                callback: (transaction) => {
                    react_native_onyx_1.default.disconnect(connection);
                    resolve(transaction ?? null);
                },
            });
        });
        const restoredSourceTransaction = await new Promise((resolve) => {
            const connection = react_native_onyx_1.default.connect({
                key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${sourceTransaction.transactionID}`,
                callback: (transaction) => {
                    react_native_onyx_1.default.disconnect(connection);
                    resolve(transaction ?? null);
                },
            });
        });
        const restoredSourceReport = await new Promise((resolve) => {
            const connection = react_native_onyx_1.default.connect({
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${sourceReport.reportID}`,
                callback: (report) => {
                    react_native_onyx_1.default.disconnect(connection);
                    resolve(report ?? null);
                },
            });
        });
        // Verify target transaction is restored to original state
        expect(restoredTargetTransaction?.merchant).toBe('Original Merchant');
        expect(restoredTargetTransaction?.category).toBe('Original Category');
        // Verify source transaction is restored (not deleted)
        expect(restoredSourceTransaction?.transactionID).toBe('source456');
        expect(restoredSourceTransaction?.merchant).toBe('Source Merchant');
        // Verify source report is restored (not deleted)
        expect(restoredSourceReport?.reportID).toBe(sourceReport.reportID);
        expect(restoredSourceReport).toEqual(sourceReport);
    });
    it('should handle transaction violations correctly during merge', async () => {
        // Given:
        // - Both transactions have DUPLICATED_TRANSACTION and MISSING_CATEGORY violations set in Onyx
        // - When merged, duplicate violations should be removed optimistically
        // - On success, only non-duplicate violations should remain
        const targetTransaction = {
            ...(0, transaction_1.default)(1),
            transactionID: 'target123',
        };
        const sourceTransaction = {
            ...(0, transaction_1.default)(2),
            transactionID: 'source456',
        };
        const mergeTransaction = {
            ...(0, mergeTransaction_1.default)(1),
            targetTransactionID: 'target123',
            sourceTransactionID: 'source456',
        };
        const mergeTransactionID = 'merge789';
        const mockViolations = createMockViolations();
        // Set up initial state with violations in Onyx
        await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${targetTransaction.transactionID}`, targetTransaction);
        await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${sourceTransaction.transactionID}`, sourceTransaction);
        await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.MERGE_TRANSACTION}${mergeTransactionID}`, mergeTransaction);
        await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${targetTransaction.transactionID}`, mockViolations);
        await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${sourceTransaction.transactionID}`, mockViolations);
        mockFetch?.pause?.();
        // When: The merge request is executed, which should handle violation updates
        // - Optimistically remove DUPLICATED_TRANSACTION violations since transactions are being merged
        // - Keep other violations like MISSING_CATEGORY intact
        (0, MergeTransaction_1.mergeTransactionRequest)(mergeTransactionID, mergeTransaction, targetTransaction, sourceTransaction);
        await mockFetch?.resume?.();
        await (0, waitForBatchedUpdates_1.default)();
        // Then: Verify that violations are updated correctly during optimistic phase
        // - DUPLICATED_TRANSACTION violations should be filtered out
        // - Other violations should remain unchanged
        const updatedTargetViolations = await new Promise((resolve) => {
            const connection = react_native_onyx_1.default.connect({
                key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${targetTransaction.transactionID}`,
                callback: (violations) => {
                    react_native_onyx_1.default.disconnect(connection);
                    resolve(violations ?? null);
                },
            });
        });
        // Should only contain non-duplicate violations
        expect(updatedTargetViolations).toEqual([
            expect.objectContaining({
                name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY,
            }),
        ]);
        // Should not contain duplicate transaction violations
        expect(updatedTargetViolations?.some((v) => v.name === CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION)).toBeFalsy();
    });
    describe('Report deletion logic', () => {
        it('should NOT delete source report optimistically when it contains multiple transactions', async () => {
            // Given: A source transaction that is one of multiple transactions in its report
            const sourceReport = {
                ...(0, reports_1.createExpenseReport)(1),
                reportID: 'source-report-123',
            };
            const targetTransaction = {
                ...(0, transaction_1.default)(1),
                transactionID: 'target123',
                reportID: 'target-report-456',
            };
            const sourceTransaction = {
                ...(0, transaction_1.default)(2),
                transactionID: 'source456',
                reportID: sourceReport.reportID,
            };
            const otherTransaction = {
                ...(0, transaction_1.default)(3),
                transactionID: 'other789',
                reportID: sourceReport.reportID,
            };
            const mergeTransaction = {
                ...(0, mergeTransaction_1.default)(1),
                targetTransactionID: 'target123',
                sourceTransactionID: 'source456',
            };
            const mergeTransactionID = 'merge789';
            // Set up initial state
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${targetTransaction.transactionID}`, targetTransaction);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${sourceTransaction.transactionID}`, sourceTransaction);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${otherTransaction.transactionID}`, otherTransaction);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${sourceReport.reportID}`, sourceReport);
            await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.MERGE_TRANSACTION}${mergeTransactionID}`, mergeTransaction);
            mockFetch?.pause?.();
            // When: The merge request is executed
            (0, MergeTransaction_1.mergeTransactionRequest)(mergeTransactionID, mergeTransaction, targetTransaction, sourceTransaction);
            await mockFetch?.resume?.();
            await (0, waitForBatchedUpdates_1.default)();
            // Then: The source report should NOT be deleted (should still exist)
            const updatedSourceReport = await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${sourceReport.reportID}`,
                    callback: (report) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(report ?? null);
                    },
                });
            });
            expect(updatedSourceReport).toEqual(sourceReport);
            expect(updatedSourceReport?.reportID).toBe(sourceReport.reportID);
        });
    });
});
describe('setupMergeTransactionData', () => {
    beforeEach(() => {
        return react_native_onyx_1.default.clear().then(waitForBatchedUpdates_1.default);
    });
    it('should set merge transaction data with initial values', async () => {
        // Given a transaction ID
        const transactionID = 'test-transaction-123';
        // When we setup merge transaction data
        (0, MergeTransaction_1.setupMergeTransactionData)(transactionID, { targetTransactionID: transactionID });
        await (0, waitForBatchedUpdates_1.default)();
        // Then merge transaction should be created with the target transaction ID
        const mergeTransaction = await new Promise((resolve) => {
            const connection = react_native_onyx_1.default.connect({
                key: `${ONYXKEYS_1.default.COLLECTION.MERGE_TRANSACTION}${transactionID}`,
                callback: (transaction) => {
                    react_native_onyx_1.default.disconnect(connection);
                    resolve(transaction ?? null);
                },
            });
        });
        expect(mergeTransaction).toEqual({
            targetTransactionID: transactionID,
        });
    });
});
describe('setMergeTransactionKey', () => {
    beforeEach(() => {
        return react_native_onyx_1.default.clear().then(waitForBatchedUpdates_1.default);
    });
    it('should merge values into existing merge transaction data', async () => {
        // Given an existing merge transaction
        const transactionID = 'test-transaction-789';
        const existingMergeTransaction = {
            targetTransactionID: transactionID,
            merchant: 'Original Merchant',
            amount: 1000,
        };
        await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.MERGE_TRANSACTION}${transactionID}`, existingMergeTransaction);
        // When we set new merge transaction values
        const newValues = {
            merchant: 'Updated Merchant',
            category: 'New Category',
            description: 'New Description',
        };
        (0, MergeTransaction_1.setMergeTransactionKey)(transactionID, newValues);
        await (0, waitForBatchedUpdates_1.default)();
        // Then it should merge the new values with existing data
        const mergeTransaction = await new Promise((resolve) => {
            const connection = react_native_onyx_1.default.connect({
                key: `${ONYXKEYS_1.default.COLLECTION.MERGE_TRANSACTION}${transactionID}`,
                callback: (transaction) => {
                    react_native_onyx_1.default.disconnect(connection);
                    resolve(transaction ?? null);
                },
            });
        });
        expect(mergeTransaction).toEqual({
            targetTransactionID: transactionID,
            merchant: 'Updated Merchant', // Updated
            amount: 1000, // Preserved
            category: 'New Category', // Added
            description: 'New Description', // Added
        });
    });
});
