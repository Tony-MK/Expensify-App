"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_native_onyx_1 = require("react-native-onyx");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const ReportPreviewActionUtils_1 = require("@libs/ReportPreviewActionUtils");
// eslint-disable-next-line no-restricted-syntax
const ReportUtils = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const InvoiceData = require("../data/Invoice");
const policies_1 = require("../utils/collections/policies");
const reports_1 = require("../utils/collections/reports");
const CURRENT_USER_ACCOUNT_ID = 1;
const CURRENT_USER_EMAIL = 'tester@mail.com';
const SESSION = {
    email: CURRENT_USER_EMAIL,
    accountID: CURRENT_USER_ACCOUNT_ID,
};
const PERSONAL_DETAILS = {
    accountID: CURRENT_USER_ACCOUNT_ID,
    login: CURRENT_USER_EMAIL,
};
const REPORT_ID = 1;
const TRANSACTION_ID = 1;
const VIOLATIONS = {};
jest.mock('@libs/ReportUtils', () => ({
    ...jest.requireActual('@libs/ReportUtils'),
    hasAnyViolations: jest.fn().mockReturnValue(false),
    getReportTransactions: jest.fn().mockReturnValue(['mockValue']),
}));
jest.mock('@libs/PolicyUtils', () => ({
    ...jest.requireActual('@libs/PolicyUtils'),
    isPreferredExporter: jest.fn().mockReturnValue(true),
    hasAccountingConnections: jest.fn().mockReturnValue(true),
}));
jest.mock('@src/libs/SearchUIUtils', () => ({
    getSuggestedSearches: jest.fn().mockReturnValue({}),
}));
describe('getReportPreviewAction', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    beforeEach(async () => {
        react_native_onyx_1.default.clear();
        await react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, SESSION);
        await react_native_onyx_1.default.set(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { [CURRENT_USER_ACCOUNT_ID]: PERSONAL_DETAILS });
    });
    it('getReportPreviewAction should return ADD_EXPENSE action for report preview with no transactions', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: CURRENT_USER_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
            isWaitingOnBankAccount: false,
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        expect((0, ReportPreviewActionUtils_1.getReportPreviewAction)(VIOLATIONS, false, report, undefined, [])).toBe(CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.ADD_EXPENSE);
    });
    it('canSubmit should return true for expense preview report with manual submit', async () => {
        const report = {
            ...(0, reports_1.createRandomReport)(REPORT_ID),
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: CURRENT_USER_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
            isWaitingOnBankAccount: false,
        };
        const policy = (0, policies_1.default)(0);
        policy.autoReportingFrequency = CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.IMMEDIATE;
        policy.type = CONST_1.default.POLICY.TYPE.CORPORATE;
        if (policy.harvesting) {
            policy.harvesting.enabled = false;
        }
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const transaction = {
            reportID: `${REPORT_ID}`,
        };
        // Simulate how components use a hook to pass the isReportArchived parameter
        const { result: isReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(report?.parentReportID));
        expect((0, ReportPreviewActionUtils_1.getReportPreviewAction)(VIOLATIONS, isReportArchived.current, report, policy, [transaction])).toBe(CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.SUBMIT);
    });
    it('canSubmit should return false for expense preview report with only pending transactions', async () => {
        const report = {
            ...(0, reports_1.createRandomReport)(REPORT_ID),
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: CURRENT_USER_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
            isWaitingOnBankAccount: false,
        };
        const policy = (0, policies_1.default)(0);
        policy.autoReportingFrequency = CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.IMMEDIATE;
        policy.type = CONST_1.default.POLICY.TYPE.CORPORATE;
        if (policy.harvesting) {
            policy.harvesting.enabled = false;
        }
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const transaction = {
            reportID: `${REPORT_ID}`,
            status: CONST_1.default.TRANSACTION.STATUS.PENDING,
            amount: 10,
            merchant: 'Merchant',
            date: '2025-01-01',
        };
        // Simulate how components use a hook to pass the isReportArchived parameter
        const { result: isReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(report?.parentReportID));
        expect((0, ReportPreviewActionUtils_1.getReportPreviewAction)(VIOLATIONS, isReportArchived.current, report, policy, [transaction])).toBe(CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.VIEW);
    });
    describe('canApprove', () => {
        it('should return true for report being processed', async () => {
            const report = {
                ...(0, reports_1.createRandomReport)(REPORT_ID),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                ownerAccountID: CURRENT_USER_ACCOUNT_ID,
                stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
                managerID: CURRENT_USER_ACCOUNT_ID,
                isWaitingOnBankAccount: false,
            };
            const policy = (0, policies_1.default)(0);
            policy.type = CONST_1.default.POLICY.TYPE.CORPORATE;
            policy.approver = CURRENT_USER_EMAIL;
            policy.approvalMode = CONST_1.default.POLICY.APPROVAL_MODE.BASIC;
            policy.preventSelfApproval = false;
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
            const transaction = {
                reportID: `${REPORT_ID}`,
            };
            const { result: isReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(report?.parentReportID));
            expect((0, ReportPreviewActionUtils_1.getReportPreviewAction)(VIOLATIONS, isReportArchived.current, report, policy, [transaction])).toBe(CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.APPROVE);
        });
        it('should return false for report with scanning expenses', async () => {
            const report = {
                ...(0, reports_1.createRandomReport)(REPORT_ID),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                ownerAccountID: CURRENT_USER_ACCOUNT_ID,
                stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
                managerID: CURRENT_USER_ACCOUNT_ID,
                isWaitingOnBankAccount: false,
            };
            const policy = (0, policies_1.default)(0);
            policy.type = CONST_1.default.POLICY.TYPE.CORPORATE;
            policy.approver = CURRENT_USER_EMAIL;
            policy.approvalMode = CONST_1.default.POLICY.APPROVAL_MODE.BASIC;
            policy.preventSelfApproval = false;
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
            const transaction = {
                reportID: `${REPORT_ID}`,
                receipt: {
                    state: CONST_1.default.IOU.RECEIPT_STATE.SCANNING,
                },
            };
            expect((0, ReportPreviewActionUtils_1.getReportPreviewAction)(VIOLATIONS, false, report, policy, [transaction])).toBe(CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.VIEW);
        });
        it('should return false for report with pending expenses', async () => {
            const report = {
                ...(0, reports_1.createRandomReport)(REPORT_ID),
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
                ownerAccountID: CURRENT_USER_ACCOUNT_ID,
                stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
                statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
                managerID: CURRENT_USER_ACCOUNT_ID,
                isWaitingOnBankAccount: false,
            };
            const policy = (0, policies_1.default)(0);
            policy.type = CONST_1.default.POLICY.TYPE.CORPORATE;
            policy.approver = CURRENT_USER_EMAIL;
            policy.approvalMode = CONST_1.default.POLICY.APPROVAL_MODE.BASIC;
            policy.preventSelfApproval = false;
            await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
            const transaction = {
                reportID: `${REPORT_ID}`,
                status: CONST_1.default.TRANSACTION.STATUS.PENDING,
                amount: 10,
                merchant: 'Merchant',
                date: '2025-01-01',
            };
            expect((0, ReportPreviewActionUtils_1.getReportPreviewAction)(VIOLATIONS, false, report, policy, [transaction])).toBe(CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.VIEW);
        });
    });
    it("canApprove should return true for the current report manager regardless of whether they're in the current approval workflow", async () => {
        const report = {
            ...(0, reports_1.createRandomReport)(REPORT_ID),
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: CURRENT_USER_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
            managerID: CURRENT_USER_ACCOUNT_ID,
            isWaitingOnBankAccount: false,
        };
        const policy = (0, policies_1.default)(0);
        policy.type = CONST_1.default.POLICY.TYPE.CORPORATE;
        policy.approver = `another+${CURRENT_USER_EMAIL}`;
        policy.approvalMode = CONST_1.default.POLICY.APPROVAL_MODE.BASIC;
        policy.preventSelfApproval = false;
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const transaction = {
            reportID: `${REPORT_ID}`,
        };
        const { result: isReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(report?.parentReportID));
        expect((0, ReportPreviewActionUtils_1.getReportPreviewAction)(VIOLATIONS, isReportArchived.current, report, policy, [transaction])).toBe(CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.APPROVE);
    });
    it('canPay should return true for expense report with payments enabled', async () => {
        const report = {
            ...(0, reports_1.createRandomReport)(REPORT_ID),
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: CURRENT_USER_ACCOUNT_ID,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.CLOSED,
            total: -100,
            isWaitingOnBankAccount: false,
        };
        const policy = (0, policies_1.default)(0);
        policy.role = CONST_1.default.POLICY.ROLE.ADMIN;
        policy.type = CONST_1.default.POLICY.TYPE.CORPORATE;
        policy.reimbursementChoice = CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_YES;
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const transaction = {
            reportID: `${REPORT_ID}`,
        };
        const { result: isReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(report?.parentReportID));
        expect((0, ReportPreviewActionUtils_1.getReportPreviewAction)(VIOLATIONS, isReportArchived.current, report, policy, [transaction])).toBe(CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.PAY);
    });
    it('canPay should return true for submitted invoice', async () => {
        const report = {
            ...(0, reports_1.createRandomReport)(REPORT_ID),
            type: CONST_1.default.REPORT.TYPE.INVOICE,
            ownerAccountID: CURRENT_USER_ACCOUNT_ID,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
            stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
            isWaitingOnBankAccount: false,
            total: 7,
        };
        const policy = (0, policies_1.default)(0);
        policy.role = CONST_1.default.POLICY.ROLE.ADMIN;
        policy.type = CONST_1.default.POLICY.TYPE.CORPORATE;
        policy.reimbursementChoice = CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_NO;
        const invoiceReceiverPolicy = (0, policies_1.default)(0);
        invoiceReceiverPolicy.role = CONST_1.default.POLICY.ROLE.ADMIN;
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const transaction = {
            reportID: `${REPORT_ID}`,
        };
        const { result: isReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(report?.parentReportID));
        expect((0, ReportPreviewActionUtils_1.getReportPreviewAction)(VIOLATIONS, isReportArchived.current, report, policy, [transaction], invoiceReceiverPolicy)).toBe(CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.PAY);
    });
    it('getReportPreviewAction should return VIEW action for zero value invoice', async () => {
        const PARENT_REPORT_ID = (REPORT_ID + 1).toString();
        const parentReport = {
            ...(0, reports_1.createRandomReport)(Number(PARENT_REPORT_ID)),
            type: CONST_1.default.REPORT.TYPE.INVOICE,
            invoiceReceiver: {
                type: CONST_1.default.REPORT.INVOICE_RECEIVER_TYPE.INDIVIDUAL,
                accountID: CURRENT_USER_ACCOUNT_ID,
            },
            policyID: '1',
        };
        const report = {
            ...(0, reports_1.createRandomReport)(REPORT_ID),
            type: CONST_1.default.REPORT.TYPE.INVOICE,
            parentReportID: PARENT_REPORT_ID,
            ownerAccountID: CURRENT_USER_ACCOUNT_ID + 1, // Different from current user
            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
            stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
            isWaitingOnBankAccount: false,
            total: 0,
            policyID: '1',
        };
        const policy = (0, policies_1.default)(0);
        policy.role = CONST_1.default.POLICY.ROLE.ADMIN;
        policy.type = CONST_1.default.POLICY.TYPE.CORPORATE;
        policy.reimbursementChoice = CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_NO;
        policy.id = '1';
        const invoiceReceiverPolicy = (0, policies_1.default)(0);
        invoiceReceiverPolicy.role = CONST_1.default.POLICY.ROLE.ADMIN;
        const transaction = {
            reportID: `${REPORT_ID}`,
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${PARENT_REPORT_ID}`, parentReport);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const { result: isReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(report.parentReportID));
        expect((0, ReportPreviewActionUtils_1.getReportPreviewAction)(VIOLATIONS, isReportArchived.current, report, policy, [transaction], invoiceReceiverPolicy)).toBe(CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.VIEW);
    });
    it('canPay should return false for archived invoice', async () => {
        const report = {
            ...(0, reports_1.createRandomReport)(REPORT_ID),
            type: CONST_1.default.REPORT.TYPE.INVOICE,
            ownerAccountID: CURRENT_USER_ACCOUNT_ID,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
            stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
            isWaitingOnBankAccount: false,
            total: 7,
        };
        const policy = (0, policies_1.default)(0);
        policy.role = CONST_1.default.POLICY.ROLE.ADMIN;
        policy.type = CONST_1.default.POLICY.TYPE.CORPORATE;
        policy.reimbursementChoice = CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_NO;
        const invoiceReceiverPolicy = (0, policies_1.default)(0);
        invoiceReceiverPolicy.role = CONST_1.default.POLICY.ROLE.ADMIN;
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        // This is what indicates that a report is archived (see ReportUtils.isArchivedReport())
        await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${report.reportID}`, {
            private_isArchived: new Date().toString(),
        });
        const transaction = {
            reportID: `${REPORT_ID}`,
        };
        const { result: isReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(report?.parentReportID));
        expect((0, ReportPreviewActionUtils_1.getReportPreviewAction)(VIOLATIONS, isReportArchived.current, report, policy, [transaction], invoiceReceiverPolicy)).toBe(CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.PAY);
    });
    it('getReportPreviewAction should return VIEW action for invoice when the chat report is archived', async () => {
        // Given the invoice data
        const { policy, convertedInvoiceChat: chatReport } = InvoiceData;
        const report = {
            ...(0, reports_1.createRandomReport)(REPORT_ID),
            type: CONST_1.default.REPORT.TYPE.INVOICE,
            ownerAccountID: CURRENT_USER_ACCOUNT_ID,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
            stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
            chatReportID: chatReport.chatReportID,
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        // This is what indicates that a report is archived (see ReportUtils.isArchivedReport())
        await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${report.chatReportID}`, {
            private_isArchived: new Date().toString(),
        });
        const transaction = {
            reportID: `${REPORT_ID}`,
        };
        // Simulate how components determined if a chat report is archived by using this hook
        const { result: isChatReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(report?.chatReportID));
        // Then the getReportPreviewAction should return the View action
        expect((0, ReportPreviewActionUtils_1.getReportPreviewAction)(VIOLATIONS, isChatReportArchived.current, report, policy, [transaction], undefined)).toBe(CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.VIEW);
    });
    it('canExport should return true for finished reports', async () => {
        const report = {
            ...(0, reports_1.createRandomReport)(REPORT_ID),
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: CURRENT_USER_ACCOUNT_ID,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.CLOSED,
            isWaitingOnBankAccount: false,
        };
        const policy = (0, policies_1.default)(0);
        policy.type = CONST_1.default.POLICY.TYPE.CORPORATE;
        policy.connections = { [CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE]: {} };
        policy.reimbursementChoice = CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_NO;
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const transaction = {
            reportID: `${REPORT_ID}`,
        };
        const { result: isReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(report?.parentReportID));
        expect((0, ReportPreviewActionUtils_1.getReportPreviewAction)(VIOLATIONS, isReportArchived.current, report, policy, [transaction])).toBe(CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.EXPORT_TO_ACCOUNTING);
    });
    it('canReview should return true for reports where there are violations, user is submitter or approver and Workflows are enabled', async () => {
        ReportUtils.hasAnyViolations.mockReturnValue(true);
        const report = {
            ...(0, reports_1.createRandomReport)(REPORT_ID),
            statusNum: 0,
            stateNum: 0,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: CURRENT_USER_ACCOUNT_ID,
            isWaitingOnBankAccount: false,
        };
        const policy = (0, policies_1.default)(0);
        policy.areWorkflowsEnabled = true;
        policy.type = CONST_1.default.POLICY.TYPE.CORPORATE;
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const REPORT_VIOLATION = {
            FIELD_REQUIRED: 'fieldRequired',
        };
        await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_VIOLATIONS}${REPORT_ID}`, REPORT_VIOLATION);
        await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${TRANSACTION_ID}`, [
            {
                name: CONST_1.default.VIOLATIONS.OVER_LIMIT,
            },
        ]);
        const transaction = {
            reportID: `${REPORT_ID}`,
        };
        const { result: isReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(report?.parentReportID));
        expect((0, ReportPreviewActionUtils_1.getReportPreviewAction)(VIOLATIONS, isReportArchived.current, report, policy, [transaction])).toBe(CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.REVIEW);
    });
    it('canReview should return true for reports with RTER violations regardless of workspace workflow configuration', async () => {
        ReportUtils.hasAnyViolations.mockReturnValue(true);
        const report = {
            ...(0, reports_1.createRandomReport)(REPORT_ID),
            statusNum: 0,
            stateNum: 0,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: CURRENT_USER_ACCOUNT_ID,
            isWaitingOnBankAccount: false,
        };
        const policy = (0, policies_1.default)(0);
        policy.areWorkflowsEnabled = true;
        policy.type = CONST_1.default.POLICY.TYPE.CORPORATE;
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const REPORT_VIOLATION = {
            FIELD_REQUIRED: 'fieldRequired',
        };
        await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_VIOLATIONS}${REPORT_ID}`, REPORT_VIOLATION);
        await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${TRANSACTION_ID}`, [
            {
                name: CONST_1.default.VIOLATIONS.RTER,
                data: {
                    pendingPattern: true,
                    rterType: CONST_1.default.RTER_VIOLATION_TYPES.SEVEN_DAY_HOLD,
                },
            },
        ]);
        const transaction = {
            reportID: `${REPORT_ID}`,
        };
        expect((0, ReportPreviewActionUtils_1.getReportPreviewAction)(VIOLATIONS, false, report, policy, [transaction])).toBe(CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.REVIEW);
    });
    it('canView should return true for reports in which we are waiting for user to add a bank account', async () => {
        const report = {
            ...(0, reports_1.createRandomReport)(REPORT_ID),
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: CURRENT_USER_ACCOUNT_ID,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.CLOSED,
            isWaitingOnBankAccount: true,
        };
        const policy = (0, policies_1.default)(0);
        policy.type = CONST_1.default.POLICY.TYPE.CORPORATE;
        policy.connections = { [CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE]: {} };
        policy.reimbursementChoice = CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_NO;
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const transaction = {
            reportID: `${REPORT_ID}`,
        };
        const { result: isReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(report?.parentReportID));
        expect((0, ReportPreviewActionUtils_1.getReportPreviewAction)(VIOLATIONS, isReportArchived.current, report, policy, [transaction])).toBe(CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.VIEW);
    });
});
