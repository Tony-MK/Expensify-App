"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const OnyxUtils_1 = require("react-native-onyx/dist/OnyxUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const OnyxDerived_1 = require("@userActions/OnyxDerived");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const CollectionDataSet_1 = require("@src/types/utils/CollectionDataSet");
const policies_1 = require("../utils/collections/policies");
const reportActions_1 = require("../utils/collections/reportActions");
const reports_1 = require("../utils/collections/reports");
const transaction_1 = require("../utils/collections/transaction");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const currentUserAccountID = 5;
const currentUserEmail = 'bjorn@vikings.net';
const secondUserAccountID = 6;
const policy = {
    id: '1',
    name: 'Vikings Policy',
    role: 'user',
    type: CONST_1.default.POLICY.TYPE.TEAM,
    owner: '',
    outputCurrency: '',
    isPolicyExpenseChatEnabled: false,
};
describe('canEditFieldOfMoneyRequest', () => {
    describe('move expense', () => {
        beforeAll(() => {
            react_native_onyx_1.default.init({ keys: ONYXKEYS_1.default });
            const policyCollectionDataSet = (0, CollectionDataSet_1.toCollectionDataSet)(ONYXKEYS_1.default.COLLECTION.POLICY, [policy], (current) => current.id);
            react_native_onyx_1.default.multiSet({
                [ONYXKEYS_1.default.SESSION]: { email: currentUserEmail, accountID: currentUserAccountID },
                ...policyCollectionDataSet,
            });
            (0, OnyxDerived_1.default)();
            return (0, waitForBatchedUpdates_1.default)();
        });
        describe('type is invoice', () => {
            const reportActionID = 2;
            const IOUReportID = '1234';
            const IOUTransactionID = '123';
            const randomReportAction = (0, reportActions_1.default)(reportActionID);
            const policyID = '2424';
            const amount = 39;
            const policy1 = { ...(0, policies_1.default)(Number(policyID), CONST_1.default.POLICY.TYPE.TEAM), areInvoicesEnabled: true, role: CONST_1.default.POLICY.ROLE.ADMIN };
            // Given that there is at least one outstanding expense report in a policy
            const outstandingExpenseReport = {
                ...(0, reports_1.createExpenseReport)(483),
                policyID,
                stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
                ownerAccountID: currentUserAccountID,
            };
            // When a user creates an invoice in the same policy
            const reportAction = {
                ...randomReportAction,
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                actorAccountID: currentUserAccountID,
                childStateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
                childStatusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
                originalMessage: {
                    // eslint-disable-next-line deprecation/deprecation
                    ...randomReportAction.originalMessage,
                    IOUReportID,
                    IOUTransactionID,
                    type: CONST_1.default.IOU.ACTION.CREATE,
                    amount,
                    currency: CONST_1.default.CURRENCY.USD,
                },
            };
            const moneyRequestTransaction = { ...(0, transaction_1.default)(Number(IOUTransactionID)), reportID: IOUReportID, transactionID: IOUTransactionID, amount };
            const invoiceReport = {
                ...(0, reports_1.createInvoiceReport)(Number(IOUReportID)),
                policyID,
                ownerAccountID: currentUserAccountID,
                state: CONST_1.default.REPORT.ACTIONS.TYPE.SUBMITTED,
                stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
                managerID: 8723,
            };
            beforeEach(() => {
                react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${IOUTransactionID}`, moneyRequestTransaction);
                react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${IOUReportID}`, invoiceReport);
                react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${483}`, outstandingExpenseReport);
                react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, policy1);
                return (0, waitForBatchedUpdates_1.default)();
            });
            afterEach(() => {
                react_native_onyx_1.default.clear();
                return (0, waitForBatchedUpdates_1.default)();
            });
            it('should return false for invoice report action if it is not outstanding report', async () => {
                const outstandingReportsByPolicyID = await OnyxUtils_1.default.get(ONYXKEYS_1.default.DERIVED.OUTSTANDING_REPORTS_BY_POLICY_ID);
                const canEditReportField = (0, ReportUtils_1.canEditFieldOfMoneyRequest)(reportAction, CONST_1.default.EDIT_REQUEST_FIELD.REPORT, undefined, undefined, outstandingReportsByPolicyID);
                expect(canEditReportField).toBe(false);
            });
            it('should return true for invoice report action when there are outstanding reports', async () => {
                await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${IOUReportID}`, outstandingExpenseReport);
                await (0, waitForBatchedUpdates_1.default)();
                const outstandingReportsByPolicyID = await OnyxUtils_1.default.get(ONYXKEYS_1.default.DERIVED.OUTSTANDING_REPORTS_BY_POLICY_ID);
                const canEditReportField = (0, ReportUtils_1.canEditFieldOfMoneyRequest)(reportAction, CONST_1.default.EDIT_REQUEST_FIELD.REPORT, undefined, undefined, outstandingReportsByPolicyID);
                expect(canEditReportField).toBe(true);
            });
        });
        describe('type is expense', () => {
            // Test constants for expense report scenarios
            const EXPENSE_OUTSTANDING_REPORT_1_ID = 11;
            const EXPENSE_OUTSTANDING_REPORT_2_ID = 22;
            const EXPENSE_IOU_REPORT_ID = 33;
            const EXPENSE_IOU_TRANSACTION_ID = 44;
            const EXPENSE_AMOUNT = 50;
            const EXPENSE_NON_SUBMITTER_ACCOUNT_ID = 9999;
            const reportActionID = 11;
            const IOUReportID = EXPENSE_IOU_REPORT_ID;
            const IOUTransactionID = EXPENSE_IOU_TRANSACTION_ID;
            const randomReportAction = (0, reportActions_1.default)(reportActionID);
            const policyID = '11';
            const expensePolicy = { ...(0, policies_1.default)(Number(policyID), CONST_1.default.POLICY.TYPE.TEAM), role: CONST_1.default.POLICY.ROLE.USER };
            // Create outstanding expense reports in the same policy (different IDs than our main expense report)
            const outstandingExpenseReport1 = {
                ...(0, reports_1.createExpenseReport)(EXPENSE_OUTSTANDING_REPORT_1_ID),
                policyID,
                stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
                ownerAccountID: currentUserAccountID,
            };
            const outstandingExpenseReport2 = {
                ...(0, reports_1.createExpenseReport)(EXPENSE_OUTSTANDING_REPORT_2_ID),
                policyID,
                stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
                ownerAccountID: currentUserAccountID,
            };
            const reportAction = {
                ...randomReportAction,
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                actorAccountID: currentUserAccountID,
                childStateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                childStatusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
                originalMessage: {
                    // eslint-disable-next-line deprecation/deprecation
                    ...randomReportAction.originalMessage,
                    IOUReportID,
                    IOUTransactionID,
                    type: CONST_1.default.IOU.ACTION.CREATE,
                    amount: EXPENSE_AMOUNT,
                    currency: CONST_1.default.CURRENCY.USD,
                },
            };
            const moneyRequestTransaction = { ...(0, transaction_1.default)(Number(IOUTransactionID)), reportID: IOUReportID, transactionID: IOUTransactionID, amount: EXPENSE_AMOUNT };
            const expenseReport = {
                ...(0, reports_1.createExpenseReport)(Number(IOUReportID)),
                policyID,
                ownerAccountID: currentUserAccountID,
                stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
            };
            beforeEach(() => {
                const policyCollectionDataSet = (0, CollectionDataSet_1.toCollectionDataSet)(ONYXKEYS_1.default.COLLECTION.POLICY, [expensePolicy], (current) => current.id);
                react_native_onyx_1.default.multiSet({
                    [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${IOUTransactionID}`]: moneyRequestTransaction,
                    ...policyCollectionDataSet,
                });
                return (0, waitForBatchedUpdates_1.default)();
            });
            afterEach(() => {
                react_native_onyx_1.default.clear();
                return (0, waitForBatchedUpdates_1.default)();
            });
            it('should return true for submitter when there are multiple outstanding reports', async () => {
                // Given that there are multiple outstanding expense reports in the same policy
                await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${IOUReportID}`, expenseReport);
                await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${EXPENSE_OUTSTANDING_REPORT_1_ID}`, outstandingExpenseReport1);
                await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${EXPENSE_OUTSTANDING_REPORT_2_ID}`, outstandingExpenseReport2);
                await (0, waitForBatchedUpdates_1.default)();
                const outstandingReportsByPolicyID = await OnyxUtils_1.default.get(ONYXKEYS_1.default.DERIVED.OUTSTANDING_REPORTS_BY_POLICY_ID);
                // When the submitter tries to move an expense between reports
                const canEditReportField = (0, ReportUtils_1.canEditFieldOfMoneyRequest)(reportAction, CONST_1.default.EDIT_REQUEST_FIELD.REPORT, undefined, undefined, outstandingReportsByPolicyID);
                // Then they should be able to move the expense since there are multiple outstanding expense reports
                expect(canEditReportField).toBe(true);
            });
            it('should return false when the current user is not the submitter or admin and the report is open', async () => {
                // Given that there are outstanding expense reports but the current user is not the submitter
                const nonSubmitterExpenseReport = {
                    ...expenseReport,
                    ownerAccountID: EXPENSE_NON_SUBMITTER_ACCOUNT_ID,
                    stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
                    statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
                };
                await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${IOUReportID}`, nonSubmitterExpenseReport);
                await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${EXPENSE_OUTSTANDING_REPORT_1_ID}`, outstandingExpenseReport1);
                await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${EXPENSE_OUTSTANDING_REPORT_2_ID}`, outstandingExpenseReport2);
                await (0, waitForBatchedUpdates_1.default)();
                const outstandingReportsByPolicyID = await OnyxUtils_1.default.get(ONYXKEYS_1.default.DERIVED.OUTSTANDING_REPORTS_BY_POLICY_ID);
                // When a user tries to move an expense between reports
                const canEditReportField = (0, ReportUtils_1.canEditFieldOfMoneyRequest)(reportAction, CONST_1.default.EDIT_REQUEST_FIELD.REPORT, undefined, undefined, outstandingReportsByPolicyID);
                // Then they should not be able to move the expense since only the submitter or admin can edit the report when the report is open
                expect(canEditReportField).toBe(false);
            });
            it('should return false when there is only one outstanding report and the current user is not the submitter', async () => {
                // Given that other reports in the policy are not outstanding (approved and reimbursed)
                const approvedReport1 = {
                    ...outstandingExpenseReport1,
                    stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
                    statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED,
                };
                const reimbursedReport2 = {
                    ...outstandingExpenseReport2,
                    stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
                    statusNum: CONST_1.default.REPORT.STATUS_NUM.REIMBURSED,
                };
                await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${IOUReportID}`, {
                    ...expenseReport,
                    ownerAccountID: secondUserAccountID,
                });
                await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${EXPENSE_OUTSTANDING_REPORT_1_ID}`, approvedReport1);
                await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${EXPENSE_OUTSTANDING_REPORT_2_ID}`, reimbursedReport2);
                await (0, waitForBatchedUpdates_1.default)();
                const outstandingReportsByPolicyID = await OnyxUtils_1.default.get(ONYXKEYS_1.default.DERIVED.OUTSTANDING_REPORTS_BY_POLICY_ID);
                // When trying to move an expense between reports
                const canEditReportField = (0, ReportUtils_1.canEditFieldOfMoneyRequest)(reportAction, CONST_1.default.EDIT_REQUEST_FIELD.REPORT, undefined, undefined, outstandingReportsByPolicyID);
                // Then they should not be able to move the expense since there's only one outstanding report
                expect(canEditReportField).toBe(false);
            });
            it('should return false when the expense report is not outstanding report', async () => {
                // Given that there are multiple outstanding expense reports in the same policy
                await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${IOUReportID}`, { ...expenseReport, stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED, statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED });
                await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${EXPENSE_OUTSTANDING_REPORT_1_ID}`, outstandingExpenseReport1);
                await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${EXPENSE_OUTSTANDING_REPORT_2_ID}`, outstandingExpenseReport2);
                await (0, waitForBatchedUpdates_1.default)();
                const outstandingReportsByPolicyID = await OnyxUtils_1.default.get(ONYXKEYS_1.default.DERIVED.OUTSTANDING_REPORTS_BY_POLICY_ID);
                // When the submitter tries to move an expense between reports
                const canEditReportField = (0, ReportUtils_1.canEditFieldOfMoneyRequest)(reportAction, CONST_1.default.EDIT_REQUEST_FIELD.REPORT, undefined, undefined, outstandingReportsByPolicyID);
                // Then they should be able to move the expense since there are multiple outstanding expense reports
                expect(canEditReportField).toBe(false);
            });
        });
    });
});
