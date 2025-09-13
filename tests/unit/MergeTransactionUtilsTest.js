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
var Localize_1 = require("@libs/Localize");
var MergeTransactionUtils_1 = require("@libs/MergeTransactionUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var CONST_1 = require("@src/CONST");
var mergeTransaction_1 = require("../utils/collections/mergeTransaction");
var transaction_1 = require("../utils/collections/transaction");
describe('MergeTransactionUtils', function () {
    describe('getSourceTransactionFromMergeTransaction', function () {
        it('should return undefined when mergeTransaction is undefined', function () {
            // Given a null merge transaction
            var mergeTransaction = undefined;
            // When we try to get the source transaction
            var result = (0, MergeTransactionUtils_1.getSourceTransactionFromMergeTransaction)(mergeTransaction);
            // Then it should return undefined because the merge transaction is undefined
            expect(result).toBeUndefined();
        });
        it('should return undefined when sourceTransactionID is not found in eligibleTransactions', function () {
            // Given a merge transaction with a sourceTransactionID that doesn't match any eligible transactions
            var transaction1 = (0, transaction_1.default)(0);
            var transaction2 = (0, transaction_1.default)(1);
            var mergeTransaction = __assign(__assign({}, (0, mergeTransaction_1.default)(0)), { sourceTransactionID: 'nonexistent', eligibleTransactions: [transaction1, transaction2] });
            // When we try to get the source transaction
            var result = (0, MergeTransactionUtils_1.getSourceTransactionFromMergeTransaction)(mergeTransaction);
            // Then it should return undefined because the source transaction ID doesn't match any eligible transaction
            expect(result).toBeUndefined();
        });
        it('should return the correct transaction when sourceTransactionID matches an eligible transaction', function () {
            // Given a merge transaction with a sourceTransactionID that matches one of the eligible transactions
            var sourceTransaction = __assign(__assign({}, (0, transaction_1.default)(0)), { receipt: undefined });
            var otherTransaction = (0, transaction_1.default)(1);
            sourceTransaction.transactionID = 'source123';
            var mergeTransaction = __assign(__assign({}, (0, mergeTransaction_1.default)(0)), { sourceTransactionID: 'source123', eligibleTransactions: [sourceTransaction, otherTransaction] });
            // When we try to get the source transaction
            var result = (0, MergeTransactionUtils_1.getSourceTransactionFromMergeTransaction)(mergeTransaction);
            // Then it should return the matching transaction from the eligible transactions
            expect(result).toBe(sourceTransaction);
            expect(result === null || result === void 0 ? void 0 : result.transactionID).toBe('source123');
        });
    });
    describe('shouldNavigateToReceiptReview', function () {
        it('should return false when any transaction has no receipt', function () {
            // Given transactions where one has no receipt
            var transaction1 = (0, transaction_1.default)(0);
            var transaction2 = (0, transaction_1.default)(1);
            transaction1.receipt = { receiptID: 123 };
            transaction2.receipt = undefined;
            var transactions = [transaction1, transaction2];
            // When we check if should navigate to receipt review
            var result = (0, MergeTransactionUtils_1.shouldNavigateToReceiptReview)(transactions);
            // Then it should return false because not all transactions have receipts
            expect(result).toBe(false);
        });
        it('should return true when all transactions have receipts with receiptIDs', function () {
            // Given transactions where all have receipts with receiptIDs
            var transaction1 = (0, transaction_1.default)(0);
            var transaction2 = (0, transaction_1.default)(1);
            transaction1.receipt = { receiptID: 123 };
            transaction2.receipt = { receiptID: 456 };
            var transactions = [transaction1, transaction2];
            // When we check if should navigate to receipt review
            var result = (0, MergeTransactionUtils_1.shouldNavigateToReceiptReview)(transactions);
            // Then it should return true because all transactions have valid receipts
            expect(result).toBe(true);
        });
    });
    describe('getMergeFieldValue', function () {
        it('should return empty string when transaction is undefined', function () {
            // Given an undefined transaction
            var transactionDetails = undefined;
            var transaction = undefined;
            // When we try to get a merge field value
            var result = (0, MergeTransactionUtils_1.getMergeFieldValue)(transactionDetails, transaction, 'merchant');
            // Then it should return an empty string because the transaction is undefined
            expect(result).toBe('');
        });
        it('should return merchant value from transaction', function () {
            // Given a transaction with a merchant value
            var transaction = (0, transaction_1.default)(0);
            transaction.merchant = 'Test Merchant';
            transaction.modifiedMerchant = 'Test Merchant';
            // When we get the merchant field value
            var result = (0, MergeTransactionUtils_1.getMergeFieldValue)((0, ReportUtils_1.getTransactionDetails)(transaction), transaction, 'merchant');
            // Then it should return the merchant value from the transaction
            expect(result).toBe('Test Merchant');
        });
        it('should return category value from transaction', function () {
            // Given a transaction with a category value
            var transaction = (0, transaction_1.default)(0);
            transaction.category = 'Food';
            // When we get the category field value
            var result = (0, MergeTransactionUtils_1.getMergeFieldValue)((0, ReportUtils_1.getTransactionDetails)(transaction), transaction, 'category');
            // Then it should return the category value from the transaction
            expect(result).toBe('Food');
        });
        it('should return currency value from transaction', function () {
            // Given a transaction with a currency value
            var transaction = (0, transaction_1.default)(0);
            transaction.currency = CONST_1.default.CURRENCY.EUR;
            // When we get the currency field value
            var result = (0, MergeTransactionUtils_1.getMergeFieldValue)((0, ReportUtils_1.getTransactionDetails)(transaction), transaction, 'currency');
            // Then it should return the currency value from the transaction
            expect(result).toBe(CONST_1.default.CURRENCY.EUR);
        });
        it('should handle amount field for unreported expense correctly', function () {
            // Given a transaction that is an unreported expense (no reportID or unreported reportID)
            var transaction = (0, transaction_1.default)(0);
            transaction.amount = -1000; // Stored as negative
            transaction.reportID = CONST_1.default.REPORT.UNREPORTED_REPORT_ID;
            // When we get the amount field value
            var result = (0, MergeTransactionUtils_1.getMergeFieldValue)((0, ReportUtils_1.getTransactionDetails)(transaction), transaction, 'amount');
            // Then it should return the amount as positive because it's an unreported expense
            expect(result).toBe(1000);
        });
        it('should return empty string when merchant is missing', function () {
            // Given a transaction with a missing merchant
            var transaction = __assign(__assign({}, (0, transaction_1.default)(0)), { merchant: CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT, modifiedMerchant: '' });
            // When we get the merchant field value
            var result = (0, MergeTransactionUtils_1.getMergeFieldValue)((0, ReportUtils_1.getTransactionDetails)(transaction), transaction, 'merchant');
            // Then it should return an empty string because the merchant is missing
            expect(result).toBe('');
        });
    });
    describe('getMergeFieldTranslationKey', function () {
        it('should return correct translation key for amount field', function () {
            // When we get the translation key for amount field
            var result = (0, MergeTransactionUtils_1.getMergeFieldTranslationKey)('amount');
            // Then it should return the correct translation key for amount
            expect(result).toBe('iou.amount');
        });
        it('should return correct translation key for merchant field', function () {
            // When we get the translation key for merchant field
            var result = (0, MergeTransactionUtils_1.getMergeFieldTranslationKey)('merchant');
            // Then it should return the correct translation key for merchant
            expect(result).toBe('common.merchant');
        });
        it('should return correct translation key for category field', function () {
            // When we get the translation key for category field
            var result = (0, MergeTransactionUtils_1.getMergeFieldTranslationKey)('category');
            // Then it should return the correct translation key for category
            expect(result).toBe('common.category');
        });
        it('should return correct translation key for description field', function () {
            // When we get the translation key for description field
            var result = (0, MergeTransactionUtils_1.getMergeFieldTranslationKey)('description');
            // Then it should return the correct translation key for description
            expect(result).toBe('common.description');
        });
        it('should return correct translation key for reimbursable field', function () {
            // When we get the translation key for reimbursable field
            var result = (0, MergeTransactionUtils_1.getMergeFieldTranslationKey)('reimbursable');
            // Then it should return the correct translation key for reimbursable
            expect(result).toBe('common.reimbursable');
        });
        it('should return correct translation key for billable field', function () {
            // When we get the translation key for billable field
            var result = (0, MergeTransactionUtils_1.getMergeFieldTranslationKey)('billable');
            // Then it should return the correct translation key for billable
            expect(result).toBe('common.billable');
        });
    });
    describe('isEmptyMergeValue', function () {
        it('should return true for null value', function () {
            // Given a null value
            var value = null;
            // When we check if it's empty
            var result = (0, MergeTransactionUtils_1.isEmptyMergeValue)(value);
            // Then it should return true because null is considered empty
            expect(result).toBe(true);
        });
        it('should return true for undefined value', function () {
            // Given an undefined value
            var value = undefined;
            // When we check if it's empty
            var result = (0, MergeTransactionUtils_1.isEmptyMergeValue)(value);
            // Then it should return true because undefined is considered empty
            expect(result).toBe(true);
        });
        it('should return true for empty string', function () {
            // Given an empty string
            var value = '';
            // When we check if it's empty
            var result = (0, MergeTransactionUtils_1.isEmptyMergeValue)(value);
            // Then it should return true because empty string is considered empty
            expect(result).toBe(true);
        });
        it('should return false for false boolean value', function () {
            // Given a false boolean value
            var value = false;
            // When we check if it's empty
            var result = (0, MergeTransactionUtils_1.isEmptyMergeValue)(value);
            // Then it should return false because false is a valid value, not empty
            expect(result).toBe(false);
        });
        it('should return false for zero number', function () {
            // Given a zero number value
            var value = 0;
            // When we check if it's empty
            var result = (0, MergeTransactionUtils_1.isEmptyMergeValue)(value);
            // Then it should return false because zero is a valid number, not empty
            expect(result).toBe(false);
        });
        it('should return false for non-empty string', function () {
            // Given a non-empty string
            var value = 'test';
            // When we check if it's empty
            var result = (0, MergeTransactionUtils_1.isEmptyMergeValue)(value);
            // Then it should return false because the string has content
            expect(result).toBe(false);
        });
    });
    describe('getMergeableDataAndConflictFields', function () {
        it('should merge matching values and identify conflicts for different ones', function () {
            // When target and source have some same, and some different values
            var targetTransaction = __assign(__assign({}, (0, transaction_1.default)(0)), { amount: 1000, currency: CONST_1.default.CURRENCY.USD, merchant: 'Same Merchant', modifiedMerchant: 'Same Merchant', category: 'Food', tag: '', comment: { comment: 'Different description 1' }, reimbursable: true, billable: false, managedCard: false, created: '2025-01-01T00:00:00.000Z' });
            var sourceTransaction = __assign(__assign({}, (0, transaction_1.default)(1)), { amount: 1000, currency: CONST_1.default.CURRENCY.AUD, merchant: '', modifiedMerchant: '', category: 'Food', tag: 'Same Tag', comment: { comment: 'Different description 2' }, reimbursable: false, billable: undefined, managedCard: false, created: '2025-01-02T00:00:00.000Z' });
            var result = (0, MergeTransactionUtils_1.getMergeableDataAndConflictFields)(targetTransaction, sourceTransaction);
            // Only the different values are in the conflict fields
            expect(result.conflictFields).toEqual(['amount', 'created', 'description', 'reimbursable', 'reportID']);
            // The same values or either target or source has value are in the mergeable data
            expect(result.mergeableData).toEqual({
                merchant: 'Same Merchant',
                category: 'Food',
                tag: 'Same Tag',
                billable: false,
            });
        });
        it('should merge amount field correctly when they are same', function () {
            var targetTransaction = __assign(__assign({}, (0, transaction_1.default)(1)), { amount: 1000, currency: CONST_1.default.CURRENCY.USD });
            var sourceTransaction = __assign(__assign({}, (0, transaction_1.default)(2)), { amount: 1000, currency: CONST_1.default.CURRENCY.USD });
            var result = (0, MergeTransactionUtils_1.getMergeableDataAndConflictFields)(targetTransaction, sourceTransaction);
            expect(result.conflictFields).not.toContain('amount');
            expect(result.mergeableData).toMatchObject({
                amount: 1000, // Unreported expenses return positive values
            });
        });
        it('should merge amount field when target transaction is card transaction', function () {
            var targetTransaction = __assign(__assign({}, (0, transaction_1.default)(1)), { amount: 1000, currency: CONST_1.default.CURRENCY.USD, managedCard: true });
            var sourceTransaction = __assign(__assign({}, (0, transaction_1.default)(2)), { amount: 1000, currency: CONST_1.default.CURRENCY.AUD, managedCard: false });
            var result = (0, MergeTransactionUtils_1.getMergeableDataAndConflictFields)(targetTransaction, sourceTransaction);
            expect(result.conflictFields).not.toContain('amount');
            expect(result.mergeableData).toMatchObject({
                amount: 1000, // Card transactions also return positive values when unreported
                currency: CONST_1.default.CURRENCY.USD,
            });
        });
    });
    describe('buildMergedTransactionData', function () {
        it('should build merged transaction data correctly', function () {
            var targetTransaction = __assign(__assign({}, (0, transaction_1.default)(0)), { amount: 1000, merchant: 'Original Merchant', category: 'Original Category', tag: 'Original Tag', comment: {
                    comment: 'Original description',
                    waypoints: { waypoint0: { name: 'Original waypoint' } },
                }, reimbursable: true, billable: false, receipt: { receiptID: 1234, source: 'original.jpg' } });
            var mergeTransaction = __assign(__assign({}, (0, mergeTransaction_1.default)(0)), { amount: 2000, merchant: 'Merged Merchant', category: 'Merged Category', tag: 'Merged Tag', description: 'Merged description', reimbursable: false, billable: true, receipt: { receiptID: 1235, source: 'merged.jpg' }, created: '2025-01-02T00:00:00.000Z', reportID: '1' });
            var result = (0, MergeTransactionUtils_1.buildMergedTransactionData)(targetTransaction, mergeTransaction);
            // The result should be the target transaction with the merge transaction updates
            expect(result).toEqual(__assign(__assign({}, targetTransaction), { amount: 2000, modifiedAmount: 2000, merchant: 'Merged Merchant', modifiedMerchant: 'Merged Merchant', modifiedCurrency: 'USD', category: 'Merged Category', tag: 'Merged Tag', comment: __assign(__assign({}, targetTransaction.comment), { comment: 'Merged description' }), reimbursable: false, billable: true, filename: 'merged.jpg', receipt: { receiptID: 1235, source: 'merged.jpg' }, created: '2025-01-02T00:00:00.000Z', modifiedCreated: '2025-01-02T00:00:00.000Z', reportID: '1' }));
        });
    });
    describe('selectTargetAndSourceTransactionsForMerge', function () {
        it('should handle undefined transactions gracefully', function () {
            var result = (0, MergeTransactionUtils_1.selectTargetAndSourceTransactionsForMerge)(undefined, undefined);
            expect(result).toEqual({
                targetTransaction: undefined,
                sourceTransaction: undefined,
            });
        });
        it('should make card transaction the target when 2nd transaction is card transaction', function () {
            var cashTransaction = __assign(__assign({}, (0, transaction_1.default)(0)), { transactionID: 'cash1', managedCard: undefined });
            var cardTransaction = __assign(__assign({}, (0, transaction_1.default)(1)), { transactionID: 'card1', managedCard: true });
            var result = (0, MergeTransactionUtils_1.selectTargetAndSourceTransactionsForMerge)(cashTransaction, cardTransaction);
            expect(result).toEqual({
                targetTransaction: cardTransaction,
                sourceTransaction: cashTransaction,
            });
        });
        it('should keep original order when 1st transaction is card transaction', function () {
            var cardTransaction = __assign(__assign({}, (0, transaction_1.default)(0)), { transactionID: 'card1', managedCard: true });
            var cashTransaction = __assign(__assign({}, (0, transaction_1.default)(1)), { transactionID: 'cash1', managedCard: undefined });
            var result = (0, MergeTransactionUtils_1.selectTargetAndSourceTransactionsForMerge)(cardTransaction, cashTransaction);
            expect(result).toEqual({
                targetTransaction: cardTransaction,
                sourceTransaction: cashTransaction,
            });
        });
        it('should keep original order when both are cash transactions', function () {
            var cashTransaction1 = __assign(__assign({}, (0, transaction_1.default)(0)), { transactionID: 'cash1', managedCard: undefined });
            var cashTransaction2 = __assign(__assign({}, (0, transaction_1.default)(1)), { transactionID: 'cash2', managedCard: undefined });
            var result = (0, MergeTransactionUtils_1.selectTargetAndSourceTransactionsForMerge)(cashTransaction1, cashTransaction2);
            expect(result).toEqual({
                targetTransaction: cashTransaction1,
                sourceTransaction: cashTransaction2,
            });
        });
    });
    describe('getDisplayValue', function () {
        it('should return empty string for empty values', function () {
            // Given a transaction with empty merchant
            var transaction = __assign(__assign({}, (0, transaction_1.default)(0)), { merchant: '', modifiedMerchant: '' });
            // When we get display value for merchant
            var result = (0, MergeTransactionUtils_1.getDisplayValue)('merchant', transaction, Localize_1.translateLocal);
            // Then it should return empty string
            expect(result).toBe('');
        });
        it('should return "Yes"/"No" for boolean values', function () {
            // Given a transaction with boolean fields
            var transaction = __assign(__assign({}, (0, transaction_1.default)(0)), { reimbursable: true, billable: false });
            // When we get display values for boolean fields
            var reimbursableResult = (0, MergeTransactionUtils_1.getDisplayValue)('reimbursable', transaction, Localize_1.translateLocal);
            var billableResult = (0, MergeTransactionUtils_1.getDisplayValue)('billable', transaction, Localize_1.translateLocal);
            // Then it should return translated Yes/No values
            expect(reimbursableResult).toBe('common.yes');
            expect(billableResult).toBe('common.no');
        });
        it('should format amount with currency', function () {
            // Given a transaction with amount and USD currency
            var transaction = __assign(__assign({}, (0, transaction_1.default)(0)), { amount: -1000, currency: CONST_1.default.CURRENCY.USD });
            // When we get display value for amount
            var result = (0, MergeTransactionUtils_1.getDisplayValue)('amount', transaction, Localize_1.translateLocal);
            // Then it should return formatted currency string
            expect(result).toBe('$10.00');
        });
        it('should clean HTML and line breaks from description', function () {
            // Given a transaction with HTML description containing line breaks
            var transaction = __assign(__assign({}, (0, transaction_1.default)(0)), { comment: {
                    comment: '<p>This is a <strong>test</strong> description</p>\nwith line breaks\r\nand more text',
                } });
            // When we get display value for description
            var result = (0, MergeTransactionUtils_1.getDisplayValue)('description', transaction, Localize_1.translateLocal);
            // Then it should return cleaned text without HTML and with spaces instead of line breaks
            expect(result).toBe('This is a test description with line breaks and more text');
        });
        it('should sanitize tag with colons', function () {
            // Given a transaction with tag containing colons
            var transaction = __assign(__assign({}, (0, transaction_1.default)(0)), { tag: 'Department::Engineering::Frontend' });
            // When we get display value for tag
            var result = (0, MergeTransactionUtils_1.getDisplayValue)('tag', transaction, Localize_1.translateLocal);
            // Then it should return sanitized tag names separated by commas
            expect(result).toBe('Department, Engineering, Frontend');
        });
        it('should return string values directly', function () {
            // Given a transaction with string fields
            var transaction = __assign(__assign({}, (0, transaction_1.default)(0)), { merchant: 'Starbucks Coffee', modifiedMerchant: '', category: 'Food & Dining' });
            // When we get display values for string fields
            var merchantResult = (0, MergeTransactionUtils_1.getDisplayValue)('merchant', transaction, Localize_1.translateLocal);
            var categoryResult = (0, MergeTransactionUtils_1.getDisplayValue)('category', transaction, Localize_1.translateLocal);
            // Then it should return the string values
            expect(merchantResult).toBe('Starbucks Coffee');
            expect(categoryResult).toBe('Food & Dining');
        });
    });
});
