"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const TransactionPreviewUtils_1 = require("@libs/TransactionPreviewUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const CONST_1 = require("@src/CONST");
const ReportUtils = require("@src/libs/ReportUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const basicProps = {
    iouReport: (0, ReportUtils_1.buildOptimisticIOUReport)(123, 234, 1000, '1', 'USD'),
    transaction: (0, TransactionUtils_1.buildOptimisticTransaction)({
        transactionParams: {
            amount: 100,
            currency: 'USD',
            reportID: '1',
            comment: '',
            attendees: [],
            created: '2024-01-01',
        },
    }),
    translate: jest.fn().mockImplementation((key) => key),
    action: (0, ReportUtils_1.buildOptimisticIOUReportAction)({
        type: 'create',
        amount: 100,
        currency: 'USD',
        comment: '',
        participants: [],
        transactionID: '1',
        paymentType: undefined,
        iouReportID: '1',
    }),
    violations: [],
    transactionDetails: {},
    isBillSplit: false,
    shouldShowRBR: false,
    isReportAPolicyExpenseChat: false,
    areThereDuplicates: false,
};
describe('TransactionPreviewUtils', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    beforeEach(() => {
        return react_native_onyx_1.default.clear().then(waitForBatchedUpdates_1.default);
    });
    describe('getTransactionPreviewTextAndTranslationPaths', () => {
        it('should return an empty RBR message when shouldShowRBR is false and no transaction is given', () => {
            const result = (0, TransactionPreviewUtils_1.getTransactionPreviewTextAndTranslationPaths)({ ...basicProps, shouldShowRBR: false });
            expect(result.RBRMessage.text).toEqual('');
        });
        it('returns correct hold message when the transaction is on hold', () => {
            const functionArgs = {
                ...basicProps,
                transaction: { ...basicProps.transaction, comment: { hold: 'true' } },
                originalTransaction: undefined,
                shouldShowRBR: true,
            };
            const result = (0, TransactionPreviewUtils_1.getTransactionPreviewTextAndTranslationPaths)(functionArgs);
            expect(result.RBRMessage.translationPath).toContain('iou.expenseWasPutOnHold');
        });
        it('returns correct receipt error message when the transaction has receipt error', () => {
            const functionArgs = {
                ...basicProps,
                transaction: {
                    ...basicProps.transaction,
                    errors: {
                        error1: {
                            error: CONST_1.default.IOU.RECEIPT_ERROR,
                            source: 'source.com',
                            filename: 'file_name.png',
                            action: 'replaceReceipt',
                            retryParams: { transactionID: basicProps.transaction.transactionID, source: 'source.com' },
                        },
                    },
                },
                originalTransaction: undefined,
                shouldShowRBR: true,
            };
            const result = (0, TransactionPreviewUtils_1.getTransactionPreviewTextAndTranslationPaths)(functionArgs);
            expect(result.RBRMessage.translationPath).toContain('iou.error.receiptFailureMessageShort');
        });
        it('should handle missing iouReport and transaction correctly', () => {
            const functionArgs = { ...basicProps, iouReport: undefined, transaction: undefined, originalTransaction: undefined };
            const result = (0, TransactionPreviewUtils_1.getTransactionPreviewTextAndTranslationPaths)(functionArgs);
            expect(result.RBRMessage.text).toEqual('');
            expect(result.previewHeaderText).toContainEqual({ translationPath: 'iou.cash' });
            expect(result.displayAmountText.text).toEqual('$0.00');
        });
        it('returns merchant missing and amount missing message when appropriate', () => {
            const functionArgs = {
                ...basicProps,
                transaction: { ...basicProps.transaction, merchant: '', amount: 0 },
                originalTransaction: undefined,
                shouldShowRBR: true,
            };
            const result = (0, TransactionPreviewUtils_1.getTransactionPreviewTextAndTranslationPaths)(functionArgs);
            expect(result.RBRMessage.translationPath).toEqual('violations.reviewRequired');
        });
        it('should display showCashOrCard in previewHeaderText', () => {
            const functionArgsWithCardTransaction = {
                ...basicProps,
                transaction: {
                    ...basicProps.transaction,
                    managedCard: true,
                },
                originalTransaction: undefined,
            };
            const cardTransaction = (0, TransactionPreviewUtils_1.getTransactionPreviewTextAndTranslationPaths)(functionArgsWithCardTransaction);
            const cashTransaction = (0, TransactionPreviewUtils_1.getTransactionPreviewTextAndTranslationPaths)({ ...basicProps });
            expect(cardTransaction.previewHeaderText).toEqual(expect.arrayContaining([{ translationPath: 'iou.card' }]));
            expect(cashTransaction.previewHeaderText).toEqual(expect.arrayContaining([{ translationPath: 'iou.cash' }]));
        });
        it('displays appropriate header text if the transaction is bill split', () => {
            const functionArgs = { ...basicProps, isBillSplit: true, originalTransaction: undefined };
            const result = (0, TransactionPreviewUtils_1.getTransactionPreviewTextAndTranslationPaths)(functionArgs);
            expect(result.previewHeaderText).toEqual(expect.arrayContaining([{ translationPath: 'iou.split' }]));
        });
        it('displays description when receipt is being scanned', () => {
            const functionArgs = { ...basicProps, transaction: { ...basicProps.transaction, receipt: { state: CONST_1.default.IOU.RECEIPT_STATE.SCANNING } }, originalTransaction: undefined };
            const result = (0, TransactionPreviewUtils_1.getTransactionPreviewTextAndTranslationPaths)(functionArgs);
            expect(result.previewHeaderText).toEqual(expect.arrayContaining([{ translationPath: 'common.receipt' }]));
        });
        it('should apply correct text when transaction is pending and not a bill split', () => {
            const functionArgs = { ...basicProps, transaction: { ...basicProps.transaction, status: CONST_1.default.TRANSACTION.STATUS.PENDING }, originalTransaction: undefined };
            const result = (0, TransactionPreviewUtils_1.getTransactionPreviewTextAndTranslationPaths)(functionArgs);
            expect(result.previewHeaderText).toEqual(expect.arrayContaining([{ translationPath: 'iou.pending' }]));
        });
        it('handles currency and amount display during scanning correctly', () => {
            const functionArgs = {
                ...basicProps,
                transactionDetails: { amount: 300, currency: 'EUR' },
                transaction: { ...basicProps.transaction, receipt: { state: CONST_1.default.IOU.RECEIPT_STATE.SCANNING } },
                originalTransaction: undefined,
            };
            const result = (0, TransactionPreviewUtils_1.getTransactionPreviewTextAndTranslationPaths)(functionArgs);
            expect(result.displayAmountText.translationPath).toEqual('iou.receiptStatusTitle');
        });
        it('handles currency and amount display correctly for scan split bill manually completed', async () => {
            const modifiedAmount = 300;
            const currency = 'EUR';
            const originalTransactionID = '2';
            const functionArgs = {
                ...basicProps,
                transactionDetails: { amount: modifiedAmount / 2, currency },
                transaction: { ...basicProps.transaction, amount: modifiedAmount / 2, currency, comment: { originalTransactionID, source: CONST_1.default.IOU.TYPE.SPLIT } },
                isBillSplit: true,
            };
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${originalTransactionID}`, {
                reportID: CONST_1.default.REPORT.SPLIT_REPORT_ID,
                transactionID: originalTransactionID,
                comment: {
                    splits: [
                        { accountID: 1, email: 'aa@gmail.com' },
                        { accountID: 2, email: 'cc@gmail.com' },
                    ],
                },
                modifiedAmount,
                amount: 0,
                currency,
            });
            const result = (0, TransactionPreviewUtils_1.getTransactionPreviewTextAndTranslationPaths)(functionArgs);
            expect(result.displayAmountText.text).toEqual((0, CurrencyUtils_1.convertAmountToDisplayString)(modifiedAmount, currency));
        });
        it('shows approved message when the iouReport is canceled', () => {
            const functionArgs = { ...basicProps, iouReport: { ...basicProps.iouReport, isCancelledIOU: true }, originalTransaction: undefined };
            const result = (0, TransactionPreviewUtils_1.getTransactionPreviewTextAndTranslationPaths)(functionArgs);
            expect(result.previewHeaderText).toContainEqual({ translationPath: 'iou.canceled' });
        });
        it('should include "Approved" in the preview when the report is approved, regardless of whether RBR is shown', () => {
            const functionArgs = {
                ...basicProps,
                iouReport: { ...basicProps.iouReport, stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED, statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED },
                shouldShowRBR: true,
                originalTransaction: undefined,
            };
            jest.spyOn(ReportUtils, 'isPaidGroupPolicyExpenseReport').mockReturnValue(true);
            const result = (0, TransactionPreviewUtils_1.getTransactionPreviewTextAndTranslationPaths)(functionArgs);
            expect(result.previewHeaderText).toContainEqual({ translationPath: 'iou.approved' });
        });
        it('should display the correct amount for a bill split transaction', () => {
            const functionArgs = { ...basicProps, isBillSplit: true };
            const result = (0, TransactionPreviewUtils_1.getTransactionPreviewTextAndTranslationPaths)(functionArgs);
            expect(result.displayAmountText.text).toEqual('$1.00');
        });
        it('should display the correct amount for a bill split transaction after updating the amount', () => {
            const functionArgs = { ...basicProps, isBillSplit: true, transaction: { ...basicProps.transaction, modifiedAmount: 50 } };
            const result = (0, TransactionPreviewUtils_1.getTransactionPreviewTextAndTranslationPaths)(functionArgs);
            expect(result.displayAmountText.text).toEqual('$0.50');
        });
    });
    describe('createTransactionPreviewConditionals', () => {
        beforeAll(() => {
            react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, { accountID: 999 });
        });
        afterAll(() => {
            react_native_onyx_1.default.clear([ONYXKEYS_1.default.SESSION]);
        });
        it('should determine RBR visibility according to violation and hold conditions', () => {
            const functionArgs = {
                ...basicProps,
                violations: [{ name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY, type: CONST_1.default.VIOLATION_TYPES.VIOLATION, transactionID: 123, showInReview: true }],
            };
            const result = (0, TransactionPreviewUtils_1.createTransactionPreviewConditionals)(functionArgs);
            expect(result.shouldShowRBR).toBeTruthy();
        });
        it('should determine RBR visibility according to whether there is a receipt error', () => {
            const functionArgs = {
                ...basicProps,
                transaction: {
                    ...basicProps.transaction,
                    errors: {
                        error1: {
                            error: CONST_1.default.IOU.RECEIPT_ERROR,
                            source: 'source.com',
                            filename: 'file_name.png',
                            action: 'replaceReceipt',
                            retryParams: { transactionID: basicProps.transaction.transactionID, source: 'source.com' },
                        },
                    },
                },
            };
            const result = (0, TransactionPreviewUtils_1.createTransactionPreviewConditionals)(functionArgs);
            expect(result.shouldShowRBR).toBeTruthy();
        });
        it("should not show category if it's not a policy expense chat", () => {
            const functionArgs = { ...basicProps, isReportAPolicyExpenseChat: false };
            const result = (0, TransactionPreviewUtils_1.createTransactionPreviewConditionals)(functionArgs);
            expect(result.shouldShowCategory).toBeFalsy();
        });
        it('should show keep button when there are duplicates', () => {
            const functionArgs = { ...basicProps, areThereDuplicates: true };
            const result = (0, TransactionPreviewUtils_1.createTransactionPreviewConditionals)(functionArgs);
            expect(result.shouldShowKeepButton).toBeTruthy();
        });
        it('should show split share if amount is positive and bill is split', () => {
            const functionArgs = {
                ...basicProps,
                isBillSplit: true,
                transactionDetails: {
                    amount: 1,
                },
                action: {
                    ...basicProps.action,
                    originalMessage: {
                        participantAccountIDs: [999],
                        amount: 100,
                        currency: 'USD',
                        type: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                    },
                },
            };
            const result = (0, TransactionPreviewUtils_1.createTransactionPreviewConditionals)(functionArgs);
            expect(result.shouldShowSplitShare).toBeTruthy();
        });
        it('should show skeleton if transaction data is empty and action is not deleted', () => {
            const functionArgs = { ...basicProps, transaction: undefined };
            const result = (0, TransactionPreviewUtils_1.createTransactionPreviewConditionals)(functionArgs);
            expect(result.shouldShowSkeleton).toBeTruthy();
        });
        it('should show merchant if merchant data is valid and significant', () => {
            const functionArgs = { ...basicProps, transactionDetails: { merchant: 'Valid Merchant' } };
            const result = (0, TransactionPreviewUtils_1.createTransactionPreviewConditionals)(functionArgs);
            expect(result.shouldShowMerchant).toBeTruthy();
        });
        it('should not show description when merchant is displayed', () => {
            const functionArgs = { ...basicProps, transactionDetails: { merchant: 'Valid Merchant', comment: 'Valid Comment' } };
            const result = (0, TransactionPreviewUtils_1.createTransactionPreviewConditionals)(functionArgs);
            expect(result.shouldShowDescription).toBeFalsy();
        });
        it("should show tag if it's a policy expense chat and tag is present", () => {
            const functionArgs = { ...basicProps, isReportAPolicyExpenseChat: true, transactionDetails: { tag: 'Transport' } };
            const result = (0, TransactionPreviewUtils_1.createTransactionPreviewConditionals)(functionArgs);
            expect(result.shouldShowTag).toBeTruthy();
        });
        it('should correctly show violation message if there are multiple violations', () => {
            const functionArgs = {
                ...basicProps,
                violations: [
                    { name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY, type: CONST_1.default.VIOLATION_TYPES.VIOLATION, showInReview: true },
                    { name: CONST_1.default.VIOLATIONS.CUSTOM_RULES, type: CONST_1.default.VIOLATION_TYPES.WARNING, showInReview: true },
                ],
                transactionDetails: { amount: 200 },
            };
            const result = (0, TransactionPreviewUtils_1.createTransactionPreviewConditionals)(functionArgs);
            expect(result.shouldShowRBR).toBeTruthy();
        });
        it('should ensure RBR is not shown when no violation and no hold', () => {
            const functionArgs = { ...basicProps, isTransactionOnHold: false };
            const result = (0, TransactionPreviewUtils_1.createTransactionPreviewConditionals)(functionArgs);
            expect(result.shouldShowRBR).toBeFalsy();
        });
        it('should show description if no merchant is presented and is not scanning', () => {
            const functionArgs = { ...basicProps, transactionDetails: { comment: 'A valid comment', merchant: '' } };
            const result = (0, TransactionPreviewUtils_1.createTransactionPreviewConditionals)(functionArgs);
            expect(result.shouldShowDescription).toBeTruthy();
        });
        it('should show split share only if user is part of the split bill transaction', () => {
            const functionArgs = {
                ...basicProps,
                isBillSplit: true,
                transactionDetails: { amount: 100 },
                action: {
                    ...basicProps.action,
                    originalMessage: {
                        participantAccountIDs: [999],
                        amount: 100,
                        currency: 'USD',
                        type: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                    },
                },
            };
            const result = (0, TransactionPreviewUtils_1.createTransactionPreviewConditionals)(functionArgs);
            expect(result.shouldShowSplitShare).toBeTruthy();
        });
        it('should not show split share if user is not a participant', () => {
            const functionArgs = {
                ...basicProps,
                isBillSplit: true,
                transactionDetails: { amount: 100 },
            };
            const result = (0, TransactionPreviewUtils_1.createTransactionPreviewConditionals)(functionArgs);
            expect(result.shouldShowSplitShare).toBeFalsy();
        });
    });
    describe('getViolationTranslatePath', () => {
        const message = 'Message';
        const reviewRequired = { translationPath: 'violations.reviewRequired' };
        const longMessage = 'x'.repeat(CONST_1.default.REPORT_VIOLATIONS.RBR_MESSAGE_MAX_CHARACTERS_FOR_PREVIEW + 1);
        const mockViolations = (count) => [
            { name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY, type: CONST_1.default.VIOLATION_TYPES.VIOLATION, showInReview: true },
            { name: CONST_1.default.VIOLATIONS.CUSTOM_RULES, type: CONST_1.default.VIOLATION_TYPES.VIOLATION, showInReview: true },
            { name: CONST_1.default.VIOLATIONS.HOLD, type: CONST_1.default.VIOLATION_TYPES.VIOLATION, showInReview: true },
        ].slice(0, count);
        test('returns translationPath when there is at least one violation and transaction is on hold', () => {
            expect((0, TransactionPreviewUtils_1.getViolationTranslatePath)(mockViolations(1), false, message, true)).toEqual(reviewRequired);
        });
        test('returns translationPath if violation message is too long', () => {
            expect((0, TransactionPreviewUtils_1.getViolationTranslatePath)(mockViolations(1), false, longMessage, false)).toEqual(reviewRequired);
        });
        test('returns translationPath when there are multiple violations', () => {
            expect((0, TransactionPreviewUtils_1.getViolationTranslatePath)(mockViolations(2), false, message, false)).toEqual(reviewRequired);
        });
        test('returns translationPath when there is at least one violation and there are field errors', () => {
            expect((0, TransactionPreviewUtils_1.getViolationTranslatePath)(mockViolations(1), true, message, false)).toEqual(reviewRequired);
        });
        test('returns text when there are no violations, no hold, no field errors, and message is short', () => {
            expect((0, TransactionPreviewUtils_1.getViolationTranslatePath)(mockViolations(0), false, message, false)).toEqual({ text: message });
        });
        test('returns translationPath when there are no violations but message is too long', () => {
            expect((0, TransactionPreviewUtils_1.getViolationTranslatePath)(mockViolations(0), false, longMessage, false)).toEqual(reviewRequired);
        });
    });
    describe('getUniqueActionErrorsForTransaction', () => {
        test('returns an empty array if there are no actions', () => {
            expect((0, TransactionPreviewUtils_1.getUniqueActionErrorsForTransaction)({}, undefined)).toEqual([]);
        });
        test('returns unique error messages from report actions', () => {
            const actions = {
                /* eslint-disable @typescript-eslint/naming-convention */
                1: { errors: { a: 'Error A', b: 'Error B' } },
                2: { errors: { c: 'Error C', a: 'Error A2' } },
                3: { errors: { a: 'Error A', d: 'Error D' } },
                /* eslint-enable @typescript-eslint/naming-convention */
            };
            const expectedErrors = ['Error B', 'Error C', 'Error D'];
            expect((0, TransactionPreviewUtils_1.getUniqueActionErrorsForTransaction)(actions, undefined).sort()).toEqual(expectedErrors.sort());
        });
        test('returns the latest error message if multiple errors exist under a single action', () => {
            const actions = {
                /* eslint-disable @typescript-eslint/naming-convention */
                1: { errors: { z: 'Error Z2', a: 'Error A', f: 'Error Z' } },
                /* eslint-enable @typescript-eslint/naming-convention */
            };
            expect((0, TransactionPreviewUtils_1.getUniqueActionErrorsForTransaction)(actions, undefined)).toEqual(['Error Z2']);
        });
        test('filters out non-string error messages', () => {
            const actions = {
                /* eslint-disable @typescript-eslint/naming-convention */
                1: { errors: { a: 404, b: 'Error B' } },
                2: { errors: { c: null, d: 'Error D' } },
                /* eslint-enable @typescript-eslint/naming-convention */
            };
            expect((0, TransactionPreviewUtils_1.getUniqueActionErrorsForTransaction)(actions, undefined)).toEqual(['Error B', 'Error D']);
        });
    });
});
