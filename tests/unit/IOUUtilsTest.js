"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_native_onyx_1 = require("react-native-onyx");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const DateUtils_1 = require("@libs/DateUtils");
const IOU_1 = require("@userActions/IOU");
const CONST_1 = require("@src/CONST");
const IOUUtils = require("@src/libs/IOUUtils");
const ReportUtils = require("@src/libs/ReportUtils");
const TransactionUtils = require("@src/libs/TransactionUtils");
const TransactionUtils_1 = require("@src/libs/TransactionUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const policies_1 = require("../utils/collections/policies");
const reports_1 = require("../utils/collections/reports");
const transaction_1 = require("../utils/collections/transaction");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const currencyList_json_1 = require("./currencyList.json");
const testDate = DateUtils_1.default.getDBTime();
const currentUserAccountID = 5;
function initCurrencyList() {
    react_native_onyx_1.default.init({
        keys: ONYXKEYS_1.default,
        initialKeyStates: {
            [ONYXKEYS_1.default.CURRENCY_LIST]: currencyList_json_1.default,
        },
    });
    return (0, waitForBatchedUpdates_1.default)();
}
describe('IOUUtils', () => {
    describe('isIOUReportPendingCurrencyConversion', () => {
        beforeAll(() => {
            react_native_onyx_1.default.init({
                keys: ONYXKEYS_1.default,
            });
        });
        test('Submitting an expense offline in a different currency will show the pending conversion message', () => {
            const iouReport = ReportUtils.buildOptimisticIOUReport(1, 2, 100, '1', 'USD');
            const usdPendingTransaction = TransactionUtils.buildOptimisticTransaction({
                transactionParams: {
                    amount: 100,
                    currency: 'USD',
                    reportID: iouReport.reportID,
                },
            });
            const aedPendingTransaction = TransactionUtils.buildOptimisticTransaction({
                transactionParams: {
                    amount: 100,
                    currency: 'AED',
                    reportID: iouReport.reportID,
                },
            });
            const MergeQueries = {};
            MergeQueries[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${usdPendingTransaction.transactionID}`] = usdPendingTransaction;
            MergeQueries[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${aedPendingTransaction.transactionID}`] = aedPendingTransaction;
            return react_native_onyx_1.default.mergeCollection(ONYXKEYS_1.default.COLLECTION.TRANSACTION, MergeQueries).then(() => {
                // We submitted an expense offline in a different currency, we don't know the total of the iouReport until we're back online
                expect(IOUUtils.isIOUReportPendingCurrencyConversion(iouReport)).toBe(true);
            });
        });
        test('Submitting an expense online in a different currency will not show the pending conversion message', () => {
            const iouReport = ReportUtils.buildOptimisticIOUReport(2, 3, 100, '1', 'USD');
            const usdPendingTransaction = TransactionUtils.buildOptimisticTransaction({
                transactionParams: {
                    amount: 100,
                    currency: 'USD',
                    reportID: iouReport.reportID,
                },
            });
            const aedPendingTransaction = TransactionUtils.buildOptimisticTransaction({
                transactionParams: {
                    amount: 100,
                    currency: 'AED',
                    reportID: iouReport.reportID,
                },
            });
            const MergeQueries = {};
            MergeQueries[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${usdPendingTransaction.transactionID}`] = {
                ...usdPendingTransaction,
                pendingAction: null,
            };
            MergeQueries[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${aedPendingTransaction.transactionID}`] = {
                ...aedPendingTransaction,
                pendingAction: null,
            };
            return react_native_onyx_1.default.mergeCollection(ONYXKEYS_1.default.COLLECTION.TRANSACTION, MergeQueries).then(() => {
                // We submitted an expense online in a different currency, we know the iouReport total and there's no need to show the pending conversion message
                expect(IOUUtils.isIOUReportPendingCurrencyConversion(iouReport)).toBe(false);
            });
        });
    });
    describe('calculateAmount', () => {
        beforeAll(() => initCurrencyList());
        test('103 JPY split among 3 participants including the default user should be [35, 34, 34]', () => {
            const participantsAccountIDs = [100, 101];
            expect(IOUUtils.calculateAmount(participantsAccountIDs.length, 10300, 'JPY', true)).toBe(3500);
            expect(IOUUtils.calculateAmount(participantsAccountIDs.length, 10300, 'JPY')).toBe(3400);
        });
        test('103 USD split among 3 participants including the default user should be [34.34, 34.33, 34.33]', () => {
            const participantsAccountIDs = [100, 101];
            expect(IOUUtils.calculateAmount(participantsAccountIDs.length, 10300, 'USD', true)).toBe(3434);
            expect(IOUUtils.calculateAmount(participantsAccountIDs.length, 10300, 'USD')).toBe(3433);
        });
        test('10 AFN split among 4 participants including the default user should be [1, 3, 3, 3]', () => {
            const participantsAccountIDs = [100, 101, 102];
            expect(IOUUtils.calculateAmount(participantsAccountIDs.length, 1000, 'AFN', true)).toBe(100);
            expect(IOUUtils.calculateAmount(participantsAccountIDs.length, 1000, 'AFN')).toBe(300);
        });
        test('10.12 USD split among 4 participants including the default user should be [2.53, 2.53, 2.53, 2.53]', () => {
            const participantsAccountIDs = [100, 101, 102];
            expect(IOUUtils.calculateAmount(participantsAccountIDs.length, 1012, 'USD', true)).toBe(253);
            expect(IOUUtils.calculateAmount(participantsAccountIDs.length, 1012, 'USD')).toBe(253);
        });
        test('10.12 USD split among 3 participants including the default user should be [3.38, 3.37, 3.37]', () => {
            const participantsAccountIDs = [100, 102];
            expect(IOUUtils.calculateAmount(participantsAccountIDs.length, 1012, 'USD', true)).toBe(338);
            expect(IOUUtils.calculateAmount(participantsAccountIDs.length, 1012, 'USD')).toBe(337);
        });
        test('0.02 USD split among 4 participants including the default user should be [-0.01, 0.01, 0.01, 0.01]', () => {
            const participantsAccountIDs = [100, 101, 102];
            expect(IOUUtils.calculateAmount(participantsAccountIDs.length, 2, 'USD', true)).toBe(-1);
            expect(IOUUtils.calculateAmount(participantsAccountIDs.length, 2, 'USD')).toBe(1);
        });
        test('1 RSD split among 3 participants including the default user should be [0.34, 0.33, 0.33]', () => {
            // RSD is a special case that we forced to have 2 decimals
            const participantsAccountIDs = [100, 101];
            expect(IOUUtils.calculateAmount(participantsAccountIDs.length, 100, 'RSD', true)).toBe(34);
            expect(IOUUtils.calculateAmount(participantsAccountIDs.length, 100, 'RSD')).toBe(33);
        });
        test('1 BHD split among 3 participants including the default user should be [0.34, 0.33, 0.33]', () => {
            // BHD has 3 decimal places, but it still produces parts with only 2 decimal places because of a backend limitation
            const participantsAccountIDs = [100, 101];
            expect(IOUUtils.calculateAmount(participantsAccountIDs.length, 100, 'BHD', true)).toBe(34);
            expect(IOUUtils.calculateAmount(participantsAccountIDs.length, 100, 'BHD')).toBe(33);
        });
    });
    describe('insertTagIntoTransactionTagsString', () => {
        test('Inserting a tag into tag string should update the tag', () => {
            expect(IOUUtils.insertTagIntoTransactionTagsString(':NY:Texas', 'California', 2, true)).toBe(':NY:California');
        });
        test('Inserting a tag into an index with no tags should update the tag', () => {
            expect(IOUUtils.insertTagIntoTransactionTagsString('::California', 'NY', 1, true)).toBe(':NY:California');
        });
        test('Inserting a tag with colon in name into tag string should keep the colon in tag', () => {
            expect(IOUUtils.insertTagIntoTransactionTagsString('East:NY:California', 'City \\: \\:', 1, true)).toBe('East:City \\: \\::California');
        });
        test('Remove a tag from tagString', () => {
            expect(IOUUtils.insertTagIntoTransactionTagsString('East:City \\: \\::California', '', 1, true)).toBe('East::California');
        });
        test('Return single tag directly when hasMultipleTagLists is false', () => {
            expect(IOUUtils.insertTagIntoTransactionTagsString('East:NY:California', 'NewTag', 1, false)).toBe('NewTag');
        });
        test('Return multiple tags when hasMultipleTagLists is true', () => {
            expect(IOUUtils.insertTagIntoTransactionTagsString('East:NY:California', 'NewTag', 1, true)).toBe('East:NewTag:California');
        });
    });
});
describe('isValidMoneyRequestType', () => {
    test('Return true for valid iou type', () => {
        Object.values(CONST_1.default.IOU.TYPE).forEach((iouType) => {
            expect(IOUUtils.isValidMoneyRequestType(iouType)).toBe(true);
        });
    });
    test('Return false for invalid iou type', () => {
        expect(IOUUtils.isValidMoneyRequestType('money')).toBe(false);
    });
});
describe('hasRTERWithoutViolation', () => {
    test('Return true if there is at least one rter without violation in transactionViolations with given transactionIDs.', async () => {
        const transactionIDWithViolation = 1;
        const transactionIDWithoutViolation = 2;
        const currentReportId = '';
        const transactionWithViolation = {
            ...(0, transaction_1.default)(transactionIDWithViolation),
            category: '',
            tag: '',
            created: testDate,
            reportID: currentReportId,
        };
        const transactionWithoutViolation = {
            ...(0, transaction_1.default)(transactionIDWithoutViolation),
            category: '',
            tag: '',
            created: testDate,
            reportID: currentReportId,
        };
        const transactionViolations = `transactionViolations_${transactionIDWithViolation}`;
        const violations = {
            [transactionViolations]: [
                {
                    type: 'warning',
                    name: 'rter',
                    data: {
                        tooltip: "Personal Cards: Fix your card from Account Settings. Corporate Cards: ask your Expensify admin to fix your company's card connection.",
                        rterType: 'brokenCardConnection',
                    },
                    showInReview: true,
                },
            ],
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionIDWithViolation}`, transactionWithViolation);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionIDWithoutViolation}`, transactionWithoutViolation);
        expect((0, TransactionUtils_1.hasAnyTransactionWithoutRTERViolation)([transactionWithoutViolation, transactionWithViolation], violations)).toBe(true);
    });
    test('Return false if there is no rter without violation in all transactionViolations with given transactionIDs.', async () => {
        const transactionIDWithViolation = 1;
        const currentReportId = '';
        const transactionWithViolation = {
            ...(0, transaction_1.default)(transactionIDWithViolation),
            category: '',
            tag: '',
            created: testDate,
            reportID: currentReportId,
        };
        const transactionViolations = `transactionViolations_${transactionIDWithViolation}`;
        const violations = {
            [transactionViolations]: [
                {
                    type: 'warning',
                    name: 'rter',
                    data: {
                        tooltip: "Personal Cards: Fix your card from Account Settings. Corporate Cards: ask your Expensify admin to fix your company's card connection.",
                        rterType: 'brokenCardConnection',
                    },
                    showInReview: true,
                },
            ],
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionIDWithViolation}`, transactionWithViolation);
        expect((0, TransactionUtils_1.hasAnyTransactionWithoutRTERViolation)([transactionWithViolation], violations)).toBe(false);
    });
});
describe('canSubmitReport', () => {
    test('Return true if report can be submitted', async () => {
        await react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, { accountID: currentUserAccountID });
        const fakePolicy = {
            ...(0, policies_1.default)(6),
            ownerAccountID: currentUserAccountID,
            areRulesEnabled: true,
            preventSelfApproval: false,
            autoReportingFrequency: 'immediate',
            harvesting: {
                enabled: false,
            },
        };
        const expenseReport = {
            ...(0, reports_1.createRandomReport)(6),
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            managerID: currentUserAccountID,
            ownerAccountID: currentUserAccountID,
            policyID: fakePolicy.id,
            stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
        };
        const transactionIDWithViolation = 1;
        const transactionIDWithoutViolation = 2;
        const transactionWithViolation = {
            ...(0, transaction_1.default)(transactionIDWithViolation),
            category: '',
            tag: '',
            created: testDate,
            reportID: expenseReport?.reportID,
        };
        const transactionWithoutViolation = {
            ...(0, transaction_1.default)(transactionIDWithoutViolation),
            category: '',
            tag: '',
            created: testDate,
            reportID: expenseReport?.reportID,
        };
        const transactionViolations = `transactionViolations_${transactionIDWithViolation}`;
        const violations = {
            [transactionViolations]: [
                {
                    type: 'warning',
                    name: 'rter',
                    data: {
                        tooltip: "Personal Cards: Fix your card from Account Settings. Corporate Cards: ask your Expensify admin to fix your company's card connection.",
                        rterType: 'brokenCardConnection',
                    },
                    showInReview: true,
                },
            ],
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionIDWithViolation}`, transactionWithViolation);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionIDWithoutViolation}`, transactionWithoutViolation);
        expect((0, IOU_1.canSubmitReport)(expenseReport, fakePolicy, [transactionWithViolation, transactionWithoutViolation], violations, false)).toBe(true);
    });
    test('Return true if report can be submitted after being reopened', async () => {
        await react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, { accountID: currentUserAccountID });
        const fakePolicy = {
            ...(0, policies_1.default)(6),
            ownerAccountID: currentUserAccountID,
            areRulesEnabled: true,
            preventSelfApproval: false,
            autoReportingFrequency: CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.INSTANT,
            harvesting: {
                enabled: false,
            },
        };
        const expenseReport = {
            ...(0, reports_1.createRandomReport)(6),
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            managerID: currentUserAccountID,
            ownerAccountID: currentUserAccountID,
            policyID: fakePolicy.id,
            stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${expenseReport.reportID}`, {
            [expenseReport.reportID]: {
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.REOPENED,
            },
        });
        const transactionIDWithViolation = 1;
        const transactionIDWithoutViolation = 2;
        const transactionWithViolation = {
            ...(0, transaction_1.default)(transactionIDWithViolation),
            category: '',
            tag: '',
            created: testDate,
            reportID: expenseReport?.reportID,
        };
        const transactionWithoutViolation = {
            ...(0, transaction_1.default)(transactionIDWithoutViolation),
            category: '',
            tag: '',
            created: testDate,
            reportID: expenseReport?.reportID,
        };
        const transactionViolations = `transactionViolations_${transactionIDWithViolation}`;
        const violations = {
            [transactionViolations]: [
                {
                    type: 'warning',
                    name: 'rter',
                    data: {
                        tooltip: "Personal Cards: Fix your card from Account Settings. Corporate Cards: ask your Expensify admin to fix your company's card connection.",
                        rterType: 'brokenCardConnection',
                    },
                    showInReview: true,
                },
            ],
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionIDWithViolation}`, transactionWithViolation);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionIDWithoutViolation}`, transactionWithoutViolation);
        expect((0, IOU_1.canSubmitReport)(expenseReport, fakePolicy, [transactionWithViolation, transactionWithoutViolation], violations, false)).toBe(true);
    });
    test('Return false if report can not be submitted', async () => {
        await react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, { accountID: currentUserAccountID });
        const fakePolicy = {
            ...(0, policies_1.default)(6),
            ownerAccountID: currentUserAccountID,
            areRulesEnabled: true,
            preventSelfApproval: false,
        };
        const expenseReport = {
            ...(0, reports_1.createRandomReport)(6),
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            managerID: currentUserAccountID,
            ownerAccountID: currentUserAccountID,
            policyID: fakePolicy.id,
        };
        expect((0, IOU_1.canSubmitReport)(expenseReport, fakePolicy, [], undefined, false)).toBe(false);
    });
    it('returns false if the report is archived', async () => {
        const policy = {
            ...(0, policies_1.default)(7),
            ownerAccountID: currentUserAccountID,
            areRulesEnabled: true,
            preventSelfApproval: false,
        };
        const report = {
            ...(0, reports_1.createRandomReport)(7),
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            managerID: currentUserAccountID,
            ownerAccountID: currentUserAccountID,
            policyID: policy.id,
        };
        // This is what indicates that a report is archived (see ReportUtils.isArchivedReport())
        await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${report.reportID}`, {
            private_isArchived: new Date().toString(),
        });
        // Simulate how components call canModifyTask() by using the hook useReportIsArchived() to see if the report is archived
        const { result: isReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(report?.reportID));
        expect((0, IOU_1.canSubmitReport)(report, policy, [], undefined, isReportArchived.current)).toBe(false);
    });
});
describe('Check valid amount for IOU/Expense request', () => {
    test('IOU amount should be positive', () => {
        const iouReport = ReportUtils.buildOptimisticIOUReport(1, 2, 100, '1', 'USD');
        const iouTransaction = TransactionUtils.buildOptimisticTransaction({
            transactionParams: {
                amount: 100,
                currency: 'USD',
                reportID: iouReport.reportID,
            },
        });
        const iouAmount = TransactionUtils.getAmount(iouTransaction, false, false);
        expect(iouAmount).toBeGreaterThan(0);
    });
    test('Expense amount should be negative', () => {
        const expenseReport = ReportUtils.buildOptimisticExpenseReport('212', '123', 100, 122, 'USD');
        const expenseTransaction = TransactionUtils.buildOptimisticTransaction({
            transactionParams: {
                amount: 100,
                currency: 'USD',
                reportID: expenseReport.reportID,
            },
        });
        const expenseAmount = TransactionUtils.getAmount(expenseTransaction, true, false);
        expect(expenseAmount).toBeLessThan(0);
    });
    test('Unreported expense amount should retain negative sign', () => {
        const unreportedTransaction = TransactionUtils.buildOptimisticTransaction({
            transactionParams: {
                amount: 100,
                currency: 'USD',
                reportID: CONST_1.default.REPORT.UNREPORTED_REPORT_ID,
            },
        });
        const unreportedAmount = TransactionUtils.getAmount(unreportedTransaction, true, false);
        expect(unreportedAmount).toBeLessThan(0);
    });
});
