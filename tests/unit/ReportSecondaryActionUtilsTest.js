"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const ReportSecondaryActionUtils_1 = require("@libs/ReportSecondaryActionUtils");
const CONST_1 = require("@src/CONST");
const ReportActionsUtils = require("@src/libs/ReportActionsUtils");
const ReportUtils = require("@src/libs/ReportUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const actions_1 = require("../../__mocks__/reportData/actions");
const reports_1 = require("../../__mocks__/reportData/reports");
const EMPLOYEE_ACCOUNT_ID = 1;
const EMPLOYEE_EMAIL = 'employee@mail.com';
const MANAGER_ACCOUNT_ID = 2;
const MANAGER_EMAIL = 'manager@mail.com';
const APPROVER_ACCOUNT_ID = 3;
const APPROVER_EMAIL = 'approver@mail.com';
const ADMIN_ACCOUNT_ID = 4;
const ADMIN_EMAIL = 'admin@mail.com';
const SESSION = {
    email: EMPLOYEE_EMAIL,
    accountID: EMPLOYEE_ACCOUNT_ID,
};
const PERSONAL_DETAILS = {
    accountID: EMPLOYEE_ACCOUNT_ID,
    login: EMPLOYEE_EMAIL,
};
const REPORT_ID = 1;
const POLICY_ID = 'POLICY_ID';
const OLD_POLICY_ID = 'OLD_POLICY_ID';
describe('getSecondaryAction', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    beforeEach(async () => {
        jest.clearAllMocks();
        react_native_onyx_1.default.clear();
        await react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, SESSION);
        await react_native_onyx_1.default.set(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { [EMPLOYEE_ACCOUNT_ID]: PERSONAL_DETAILS, [APPROVER_ACCOUNT_ID]: { accountID: APPROVER_ACCOUNT_ID, login: APPROVER_EMAIL } });
    });
    it('should always return default options', () => {
        const report = {};
        const policy = {};
        const result = [CONST_1.default.REPORT.SECONDARY_ACTIONS.EXPORT, CONST_1.default.REPORT.SECONDARY_ACTIONS.DOWNLOAD_PDF, CONST_1.default.REPORT.SECONDARY_ACTIONS.VIEW_DETAILS];
        expect((0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [], violations: {}, policy })).toEqual(result);
    });
    it('includes ADD_EXPENSE option for empty report', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
        };
        const policy = {
            autoReportingFrequency: CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.INSTANT,
            harvesting: {
                enabled: true,
            },
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const TRANSACTION_ID = 'TRANSACTION_ID';
        const transaction = {
            transactionID: TRANSACTION_ID,
        };
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [transaction], violations: {}, policy });
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.ADD_EXPENSE)).toBe(true);
    });
    it('includes SUBMIT option', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
            total: 10,
        };
        const policy = {
            autoReportingFrequency: CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.INSTANT,
            harvesting: {
                enabled: true,
            },
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [], violations: {}, policy });
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.SUBMIT)).toBe(true);
    });
    it('includes SUBMIT option for admin', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
            total: 10,
        };
        const policy = {
            autoReportingFrequency: CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.INSTANT,
            harvesting: {
                enabled: true,
            },
            role: CONST_1.default.POLICY.ROLE.ADMIN,
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [], violations: {}, policy });
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.SUBMIT)).toBe(true);
    });
    it('should not include SUBMIT option for the user who is not submitter/admin/manager', async () => {
        const report = {
            reportID: '1',
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
            total: 10,
            ownerAccountID: APPROVER_ACCOUNT_ID,
            managerID: 0,
        };
        const policy = {
            autoReportingFrequency: CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.INSTANT,
            harvesting: {
                enabled: true,
            },
            role: CONST_1.default.POLICY.ROLE.AUDITOR,
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [], violations: {}, policy });
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.SUBMIT)).toBe(false);
    });
    it('should not include SUBMIT option for admin with only pending transactions', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
            total: 10,
        };
        const policy = {
            autoReportingFrequency: CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.INSTANT,
            harvesting: {
                enabled: true,
            },
            role: CONST_1.default.POLICY.ROLE.ADMIN,
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const transaction = {
            transactionID: 'TRANSACTION_ID',
            status: CONST_1.default.TRANSACTION.STATUS.PENDING,
            amount: 10,
            merchant: 'Merchant',
            date: '2025-01-01',
        };
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [transaction], violations: {}, policy });
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.SUBMIT)).toBe(false);
    });
    it('includes APPROVE option for approver and report with duplicates', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
            managerID: EMPLOYEE_ACCOUNT_ID,
        };
        const policy = {
            approver: EMPLOYEE_EMAIL,
        };
        const TRANSACTION_ID = 'TRANSACTION_ID';
        const transaction = {
            transactionID: TRANSACTION_ID,
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${TRANSACTION_ID}`, transaction);
        await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${TRANSACTION_ID}`, [
            {
                name: CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION,
            },
        ]);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [transaction], violations: {}, policy });
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.APPROVE)).toBe(true);
    });
    it('does not include APPROVE option for approver and report with only pending transactions', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
            managerID: EMPLOYEE_ACCOUNT_ID,
        };
        const policy = {
            approver: EMPLOYEE_EMAIL,
        };
        const TRANSACTION_ID = 'TRANSACTION_ID';
        const transaction = {
            transactionID: TRANSACTION_ID,
            status: CONST_1.default.TRANSACTION.STATUS.PENDING,
            amount: 10,
            merchant: 'Merchant',
            date: '2025-01-01',
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${TRANSACTION_ID}`, transaction);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [transaction], violations: {}, policy });
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.APPROVE)).toBe(false);
    });
    it('includes APPROVE option for report with RTER violations when it is submitted', () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            managerID: EMPLOYEE_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
        };
        const policy = {
            approver: EMPLOYEE_EMAIL,
        };
        const TRANSACTION_ID = 'TRANSACTION_ID';
        const transaction = {
            transactionID: TRANSACTION_ID,
        };
        const violation = {
            name: CONST_1.default.VIOLATIONS.RTER,
            data: {
                pendingPattern: true,
                rterType: CONST_1.default.RTER_VIOLATION_TYPES.SEVEN_DAY_HOLD,
            },
        };
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({
            report,
            chatReport: reports_1.chatReportR14932,
            reportTransactions: [transaction],
            violations: { [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${TRANSACTION_ID}`]: [violation] },
            policy,
        });
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.APPROVE)).toBe(true);
    });
    it('does not include APPROVE option for report with RTER violations when it is not submitted', () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            managerID: EMPLOYEE_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
        };
        const policy = {
            approver: EMPLOYEE_EMAIL,
        };
        const TRANSACTION_ID = 'TRANSACTION_ID';
        const transaction = {
            transactionID: TRANSACTION_ID,
        };
        const violation = {
            name: CONST_1.default.VIOLATIONS.RTER,
            data: {
                pendingPattern: true,
                rterType: CONST_1.default.RTER_VIOLATION_TYPES.SEVEN_DAY_HOLD,
            },
        };
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({
            report,
            chatReport: reports_1.chatReportR14932,
            reportTransactions: [transaction],
            violations: { [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${TRANSACTION_ID}`]: [violation] },
            policy,
        });
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.APPROVE)).toBe(false);
    });
    it('includes APPROVE option for admin with report having broken connection when it is submitted', () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
            managerID: EMPLOYEE_ACCOUNT_ID,
        };
        const policy = { role: CONST_1.default.POLICY.ROLE.ADMIN, autoReporting: true, autoReportingFrequency: CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.INSTANT };
        const TRANSACTION_ID = 'TRANSACTION_ID';
        const transaction = {
            transactionID: TRANSACTION_ID,
        };
        const violation = {
            name: CONST_1.default.VIOLATIONS.RTER,
            data: {
                rterType: CONST_1.default.RTER_VIOLATION_TYPES.BROKEN_CARD_CONNECTION,
            },
        };
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({
            report,
            chatReport: reports_1.chatReportR14932,
            reportTransactions: [transaction],
            violations: { [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${TRANSACTION_ID}`]: [violation] },
            policy,
        });
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.APPROVE)).toBe(true);
    });
    it('does not include APPROVE option for admin with report having broken connection that is not submitted', () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
            managerID: EMPLOYEE_ACCOUNT_ID,
        };
        const policy = { role: CONST_1.default.POLICY.ROLE.ADMIN };
        const TRANSACTION_ID = 'TRANSACTION_ID';
        const transaction = {
            transactionID: TRANSACTION_ID,
        };
        const violation = {
            name: CONST_1.default.VIOLATIONS.RTER,
            data: {
                rterType: CONST_1.default.RTER_VIOLATION_TYPES.BROKEN_CARD_CONNECTION,
            },
        };
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({
            report,
            chatReport: reports_1.chatReportR14932,
            reportTransactions: [transaction],
            violations: { [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${TRANSACTION_ID}`]: [violation] },
            policy,
        });
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.APPROVE)).toBe(false);
    });
    it('does not include APPROVE option for report with transactions that are being scanned', () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
            managerID: EMPLOYEE_ACCOUNT_ID,
        };
        const policy = {
            approver: EMPLOYEE_EMAIL,
        };
        const TRANSACTION_ID = 'TRANSACTION_ID';
        const transaction = {
            transactionID: TRANSACTION_ID,
            receipt: {
                state: CONST_1.default.IOU.RECEIPT_STATE.SCANNING,
            },
        };
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [transaction], violations: {}, policy });
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.APPROVE)).toBe(false);
    });
    it('includes UNAPPROVE option', () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED,
            managerID: EMPLOYEE_ACCOUNT_ID,
        };
        const policy = { approver: EMPLOYEE_EMAIL };
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [], violations: {}, policy });
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.UNAPPROVE)).toBe(true);
    });
    it('includes UNAPPROVE option for admin on finally approved report', () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED,
            managerID: MANAGER_ACCOUNT_ID,
        };
        const policy = {
            approver: APPROVER_EMAIL,
            role: CONST_1.default.POLICY.ROLE.ADMIN,
        };
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [], violations: {}, policy });
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.UNAPPROVE)).toBe(true);
    });
    it('includes UNAPPROVE option for manager on finally approved report', () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED,
            managerID: EMPLOYEE_ACCOUNT_ID,
        };
        const policy = {
            approver: APPROVER_EMAIL,
        };
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [], violations: {}, policy });
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.UNAPPROVE)).toBe(true);
    });
    it('does not include UNAPPROVE option for non-admin, non-manager on finally approved report', () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED,
            managerID: MANAGER_ACCOUNT_ID,
        };
        const policy = {
            approver: APPROVER_EMAIL,
        };
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [], violations: {}, policy });
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.UNAPPROVE)).toBe(false);
    });
    it('does not include UNAPPROVE option for non-approved report', () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
            managerID: EMPLOYEE_ACCOUNT_ID,
        };
        const policy = {
            approver: EMPLOYEE_EMAIL,
            role: CONST_1.default.POLICY.ROLE.ADMIN,
        };
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [], violations: {}, policy });
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.UNAPPROVE)).toBe(false);
    });
    it('does not include UNAPPROVE option for settled report', () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.REIMBURSED,
            managerID: EMPLOYEE_ACCOUNT_ID,
        };
        const policy = {
            approver: EMPLOYEE_EMAIL,
            role: CONST_1.default.POLICY.ROLE.ADMIN,
        };
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [], violations: {}, policy });
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.UNAPPROVE)).toBe(false);
    });
    it('does not include UNAPPROVE option for payment processing report', () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED,
            managerID: EMPLOYEE_ACCOUNT_ID,
            isWaitingOnBankAccount: true,
        };
        const policy = {
            approver: EMPLOYEE_EMAIL,
            role: CONST_1.default.POLICY.ROLE.ADMIN,
        };
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [], violations: {}, policy });
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.UNAPPROVE)).toBe(false);
    });
    it('includes CANCEL_PAYMENT option for report paid elsewhere', () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.REIMBURSED,
        };
        const policy = {
            role: CONST_1.default.POLICY.ROLE.ADMIN,
        };
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [], violations: {}, policy });
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.CANCEL_PAYMENT)).toBe(true);
    });
    it('includes CANCEL_PAYMENT option for report before nacha cutoff', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED,
            isWaitingOnBankAccount: true,
        };
        const policy = { role: CONST_1.default.POLICY.ROLE.ADMIN };
        const TRANSACTION_ID = 'transaction_id';
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const ACTION_ID = 'action_id';
        const reportAction = {
            actionID: ACTION_ID,
            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
            message: {
                IOUTransactionID: TRANSACTION_ID,
                type: CONST_1.default.IOU.REPORT_ACTION_TYPE.PAY,
            },
            created: '2025-03-06 18:00:00.000',
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${REPORT_ID}`, { [ACTION_ID]: reportAction });
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({
            report,
            chatReport: reports_1.chatReportR14932,
            reportTransactions: [
                {
                    transactionID: TRANSACTION_ID,
                },
            ],
            violations: {},
            policy,
        });
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.CANCEL_PAYMENT)).toBe(true);
    });
    it('includes HOLD option ', () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
        };
        const transaction = {
            comment: {},
        };
        const policy = {};
        jest.spyOn(ReportUtils, 'canHoldUnholdReportAction').mockReturnValueOnce({ canHoldRequest: true, canUnholdRequest: true });
        jest.spyOn(ReportActionsUtils, 'getOneTransactionThreadReportID').mockReturnValueOnce(actions_1.originalMessageR14932.IOUTransactionID);
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [transaction], violations: {}, policy, reportActions: [actions_1.actionR14932] });
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.HOLD)).toBe(true);
    });
    it('includes CHANGE_WORKSPACE option for submitted IOU report and manager being the payer of the new policy', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.IOU,
            ownerAccountID: MANAGER_ACCOUNT_ID,
            managerID: EMPLOYEE_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
        };
        const personalDetails = {
            [EMPLOYEE_ACCOUNT_ID]: { login: EMPLOYEE_EMAIL },
            [MANAGER_ACCOUNT_ID]: { login: MANAGER_EMAIL },
        };
        const policy = {
            id: POLICY_ID,
            type: CONST_1.default.POLICY.TYPE.TEAM,
            reimbursementChoice: CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_MANUAL,
            isPolicyExpenseChatEnabled: true,
            employeeList: {
                [EMPLOYEE_EMAIL]: { email: EMPLOYEE_EMAIL, role: CONST_1.default.POLICY.ROLE.ADMIN },
                [MANAGER_EMAIL]: { email: MANAGER_EMAIL, role: CONST_1.default.POLICY.ROLE.USER },
            },
        };
        const policies = { [`${ONYXKEYS_1.default.COLLECTION.POLICY}${POLICY_ID}`]: policy };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${POLICY_ID}`, policy);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        await react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, { email: EMPLOYEE_EMAIL, accountID: EMPLOYEE_ACCOUNT_ID });
        await react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, personalDetails);
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [], violations: {}, policy, policies });
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.CHANGE_WORKSPACE)).toBe(true);
    });
    it('includes CHANGE_WORKSPACE option for open expense report submitter', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
            stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
        };
        const personalDetails = {
            [ADMIN_ACCOUNT_ID]: { login: ADMIN_EMAIL },
            [MANAGER_ACCOUNT_ID]: { login: MANAGER_EMAIL },
        };
        const policy = {
            id: POLICY_ID,
            type: CONST_1.default.POLICY.TYPE.TEAM,
            role: CONST_1.default.POLICY.ROLE.ADMIN,
            isPolicyExpenseChatEnabled: true,
            employeeList: {
                [ADMIN_EMAIL]: { email: ADMIN_EMAIL, role: CONST_1.default.POLICY.ROLE.ADMIN },
                [EMPLOYEE_EMAIL]: { email: EMPLOYEE_EMAIL, role: CONST_1.default.POLICY.ROLE.USER },
            },
        };
        const policies = { [`${ONYXKEYS_1.default.COLLECTION.POLICY}${POLICY_ID}`]: policy };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${POLICY_ID}`, policy);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        await react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, { email: EMPLOYEE_EMAIL, accountID: EMPLOYEE_ACCOUNT_ID });
        await react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, personalDetails);
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [], violations: {}, policy, policies });
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.CHANGE_WORKSPACE)).toBe(true);
    });
    it('includes CHANGE_WORKSPACE option for submitter, submitted report without approvals', async () => {
        const oldPolicy = {
            id: OLD_POLICY_ID,
            type: CONST_1.default.POLICY.TYPE.TEAM,
            approver: MANAGER_EMAIL,
            employeeList: {
                [MANAGER_EMAIL]: { email: MANAGER_EMAIL, role: CONST_1.default.POLICY.ROLE.USER },
                [EMPLOYEE_EMAIL]: { email: EMPLOYEE_EMAIL, role: CONST_1.default.POLICY.ROLE.USER },
            },
        };
        const newPolicy = {
            id: POLICY_ID,
            type: CONST_1.default.POLICY.TYPE.TEAM,
            isPolicyExpenseChatEnabled: true,
            employeeList: {
                [MANAGER_EMAIL]: { email: MANAGER_EMAIL, role: CONST_1.default.POLICY.ROLE.USER },
                [EMPLOYEE_EMAIL]: { email: EMPLOYEE_EMAIL, role: CONST_1.default.POLICY.ROLE.USER },
            },
        };
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            managerID: MANAGER_ACCOUNT_ID,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
            stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
            policyID: oldPolicy.id,
        };
        const personalDetails = {
            [EMPLOYEE_ACCOUNT_ID]: { login: EMPLOYEE_EMAIL },
            [MANAGER_ACCOUNT_ID]: { login: MANAGER_EMAIL, accountID: MANAGER_ACCOUNT_ID },
        };
        const policies = { [`${ONYXKEYS_1.default.COLLECTION.POLICY}${OLD_POLICY_ID}`]: oldPolicy, [`${ONYXKEYS_1.default.COLLECTION.POLICY}${POLICY_ID}`]: newPolicy };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${OLD_POLICY_ID}`, oldPolicy);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${POLICY_ID}`, newPolicy);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        await react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, { email: EMPLOYEE_EMAIL, accountID: EMPLOYEE_ACCOUNT_ID });
        await react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, personalDetails);
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({
            report,
            chatReport: reports_1.chatReportR14932,
            reportTransactions: [],
            violations: {},
            policy: oldPolicy,
            policies,
        });
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.CHANGE_WORKSPACE)).toBe(true);
    });
    it('includes CHANGE_WORKSPACE option for approver', async () => {
        const oldPolicy = {
            id: OLD_POLICY_ID,
            type: CONST_1.default.POLICY.TYPE.TEAM,
            approver: APPROVER_EMAIL,
            employeeList: {
                [APPROVER_EMAIL]: { email: APPROVER_EMAIL, role: CONST_1.default.POLICY.ROLE.USER },
                [EMPLOYEE_EMAIL]: { email: EMPLOYEE_EMAIL, role: CONST_1.default.POLICY.ROLE.USER },
            },
        };
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            managerID: APPROVER_ACCOUNT_ID,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
            stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
            policyID: oldPolicy.id,
        };
        const personalDetails = {
            [EMPLOYEE_ACCOUNT_ID]: { login: EMPLOYEE_EMAIL },
            [APPROVER_ACCOUNT_ID]: { login: APPROVER_EMAIL, accountID: APPROVER_ACCOUNT_ID },
        };
        const policy = {
            id: POLICY_ID,
            type: CONST_1.default.POLICY.TYPE.TEAM,
            approver: APPROVER_EMAIL,
            isPolicyExpenseChatEnabled: true,
            employeeList: {
                [APPROVER_EMAIL]: { email: APPROVER_EMAIL, role: CONST_1.default.POLICY.ROLE.USER },
                [EMPLOYEE_EMAIL]: { email: EMPLOYEE_EMAIL, role: CONST_1.default.POLICY.ROLE.USER },
            },
        };
        const policies = { [`${ONYXKEYS_1.default.COLLECTION.POLICY}${POLICY_ID}`]: policy, [`${ONYXKEYS_1.default.COLLECTION.POLICY}${OLD_POLICY_ID}`]: oldPolicy };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${POLICY_ID}`, policy);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${OLD_POLICY_ID}`, oldPolicy);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        await react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, { email: APPROVER_EMAIL, accountID: APPROVER_ACCOUNT_ID });
        await react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, personalDetails);
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [], violations: {}, policy, policies });
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.CHANGE_WORKSPACE)).toBe(true);
    });
    it('includes CHANGE_WORKSPACE option for admin', async () => {
        const oldPolicy = {
            id: OLD_POLICY_ID,
            type: CONST_1.default.POLICY.TYPE.TEAM,
            role: CONST_1.default.POLICY.ROLE.ADMIN,
            employeeList: {
                [ADMIN_EMAIL]: { email: ADMIN_EMAIL, role: CONST_1.default.POLICY.ROLE.ADMIN },
                [EMPLOYEE_EMAIL]: { email: EMPLOYEE_EMAIL, role: CONST_1.default.POLICY.ROLE.USER },
            },
        };
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            managerID: MANAGER_ACCOUNT_ID,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.REIMBURSED,
            stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
            policyID: oldPolicy.id,
        };
        const policy = {
            id: POLICY_ID,
            type: CONST_1.default.POLICY.TYPE.TEAM,
            role: CONST_1.default.POLICY.ROLE.ADMIN,
            isPolicyExpenseChatEnabled: true,
            employeeList: {
                [ADMIN_EMAIL]: { email: ADMIN_EMAIL, role: CONST_1.default.POLICY.ROLE.ADMIN },
                [EMPLOYEE_EMAIL]: { login: EMPLOYEE_EMAIL, role: CONST_1.default.POLICY.ROLE.USER },
            },
        };
        const policies = { [`${ONYXKEYS_1.default.COLLECTION.POLICY}${POLICY_ID}`]: policy, [`${ONYXKEYS_1.default.COLLECTION.POLICY}${OLD_POLICY_ID}`]: oldPolicy };
        const personalDetails = {
            [EMPLOYEE_ACCOUNT_ID]: { login: EMPLOYEE_EMAIL },
            [ADMIN_ACCOUNT_ID]: { login: ADMIN_EMAIL },
            [MANAGER_ACCOUNT_ID]: { login: MANAGER_EMAIL },
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${OLD_POLICY_ID}`, oldPolicy);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${POLICY_ID}`, policy);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        await react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, { email: ADMIN_EMAIL, accountID: ADMIN_ACCOUNT_ID });
        await react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, personalDetails);
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [], violations: {}, policy, policies });
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.CHANGE_WORKSPACE)).toBe(true);
    });
    it('includes DELETE option for expense report submitter', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
            stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
        };
        const policy = {};
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [{}], violations: {}, policy });
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.DELETE)).toBe(true);
    });
    it('includes DELETE option for invoice report submitter when total is zero', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.INVOICE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
            stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
            total: 0,
        };
        const policy = {
            role: CONST_1.default.POLICY.ROLE.USER,
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryTransactionThreadActions)(report, {}, [], policy);
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.DELETE)).toBe(true);
    });
    it('includes DELETE option for owner of unreported transaction', () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.CHAT,
            chatType: CONST_1.default.REPORT.CHAT_TYPE.SELF_DM,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
        };
        const TRANSACTION_ID = 'TRANSACTION_ID';
        const transaction = {
            transactionID: TRANSACTION_ID,
            reportID: CONST_1.default.REPORT.UNREPORTED_REPORT_ID,
        };
        const reportActions = [
            {
                reportActionID: '1',
                actorAccountID: EMPLOYEE_ACCOUNT_ID,
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                originalMessage: {
                    IOUTransactionID: TRANSACTION_ID,
                    IOUReportID: CONST_1.default.REPORT.UNREPORTED_REPORT_ID,
                },
            },
        ];
        const policy = {};
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [transaction], violations: {}, policy, reportActions });
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.DELETE)).toBe(true);
    });
    it('includes DELETE option for owner of single processing IOU transaction', () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.IOU,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
            stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
        };
        const TRANSACTION_ID = 'TRANSACTION_ID';
        const transaction = {
            transactionID: TRANSACTION_ID,
            reportID: REPORT_ID,
        };
        const reportActions = [
            {
                reportActionID: '1',
                actorAccountID: EMPLOYEE_ACCOUNT_ID,
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                originalMessage: {
                    IOUTransactionID: TRANSACTION_ID,
                    IOUReportID: REPORT_ID,
                },
            },
        ];
        const policy = {};
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [transaction], violations: {}, policy, reportActions });
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.DELETE)).toBe(true);
    });
    it('does not include DELETE option for IOU report', () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.IOU,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
            stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
        };
        const TRANSACTION_ID = 'TRANSACTION_ID';
        const TRANSACTION_ID_2 = 'TRANSACTION_ID_2';
        const transaction1 = {
            transactionID: TRANSACTION_ID,
            reportID: REPORT_ID,
        };
        const transaction2 = {
            transactionID: TRANSACTION_ID_2,
            reportID: REPORT_ID,
        };
        const reportActions = [
            {
                reportActionID: '1',
                actorAccountID: EMPLOYEE_ACCOUNT_ID,
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                originalMessage: {
                    IOUTransactionID: TRANSACTION_ID,
                    IOUReportID: REPORT_ID,
                },
            },
            {
                reportActionID: '2',
                actorAccountID: EMPLOYEE_ACCOUNT_ID,
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                originalMessage: {
                    IOUTransactionID: TRANSACTION_ID_2,
                    IOUReportID: REPORT_ID,
                },
            },
        ];
        const policy = {};
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [transaction1, transaction2], violations: {}, policy, reportActions });
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.DELETE)).toBe(false);
    });
    it('includes DELETE option for owner of single processing expense transaction', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
            stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
        };
        const TRANSACTION_ID = 'TRANSACTION_ID';
        const transaction = {
            transactionID: TRANSACTION_ID,
            reportID: REPORT_ID,
        };
        const policy = {};
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [transaction], violations: {}, policy });
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.DELETE)).toBe(true);
    });
    it('includes DELETE option for owner of processing expense report', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
            stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
        };
        const TRANSACTION_ID = 'TRANSACTION_ID';
        const TRANSACTION_ID_2 = 'TRANSACTION_ID_2';
        const transaction1 = {
            transactionID: TRANSACTION_ID,
            reportID: REPORT_ID,
        };
        const transaction2 = {
            transactionID: TRANSACTION_ID_2,
            reportID: REPORT_ID,
        };
        const policy = {};
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [transaction1, transaction2], violations: {}, policy });
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.DELETE)).toBe(true);
    });
    it('does not include DELETE option for corporate liability card transaction', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
            stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
        };
        const TRANSACTION_ID = 'TRANSACTION_ID';
        const transaction = {
            transactionID: TRANSACTION_ID,
            reportID: REPORT_ID,
            managedCard: true,
            comment: {
                liabilityType: CONST_1.default.TRANSACTION.LIABILITY_TYPE.RESTRICT,
            },
        };
        const policy = {};
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [transaction], violations: {}, policy });
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.DELETE)).toBe(false);
    });
    it('does not include DELETE option for report that has been forwarded', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            managerID: MANAGER_ACCOUNT_ID,
            policyID: POLICY_ID,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
            stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
        };
        const TRANSACTION_ID = 'TRANSACTION_ID';
        const transaction = {
            transactionID: TRANSACTION_ID,
            reportID: REPORT_ID,
        };
        const policy = {
            id: POLICY_ID,
            approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.BASIC,
            approver: APPROVER_EMAIL,
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${POLICY_ID}`, policy);
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [transaction], violations: {}, policy });
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.DELETE)).toBe(false);
    });
    it('include DELETE option for demo transaction', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
            stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
        };
        const TRANSACTION_ID = 'TRANSACTION_ID';
        const transaction = {
            transactionID: TRANSACTION_ID,
            reportID: REPORT_ID,
            comment: {
                isDemoTransaction: true,
            },
        };
        const policy = {
            id: POLICY_ID,
            approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.BASIC,
            approver: APPROVER_EMAIL,
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${POLICY_ID}`, policy);
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [transaction], violations: {}, policy });
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.DELETE)).toBe(true);
    });
});
describe('getSecondaryExportReportActions', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    beforeEach(async () => {
        jest.clearAllMocks();
        react_native_onyx_1.default.clear();
        await react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, SESSION);
        await react_native_onyx_1.default.set(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { [EMPLOYEE_ACCOUNT_ID]: PERSONAL_DETAILS });
    });
    it('should always return default options', () => {
        const report = {};
        const policy = {};
        const result = [CONST_1.default.REPORT.EXPORT_OPTIONS.DOWNLOAD_CSV, CONST_1.default.REPORT.EXPORT_OPTIONS.EXPENSE_LEVEL_EXPORT, CONST_1.default.REPORT.EXPORT_OPTIONS.REPORT_LEVEL_EXPORT];
        expect((0, ReportSecondaryActionUtils_1.getSecondaryExportReportActions)(report, policy)).toEqual(result);
    });
    it('does not include EXPORT option for invoice reports', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.INVOICE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
        };
        const policy = {
            connections: {
                [CONST_1.default.POLICY.CONNECTIONS.NAME.QBO]: {},
            },
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryExportReportActions)(report, policy);
        expect(result.includes(CONST_1.default.REPORT.EXPORT_OPTIONS.EXPORT_TO_INTEGRATION)).toBe(false);
    });
    it('includes EXPORT option for expense report with payments enabled', () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED,
        };
        const policy = {
            role: CONST_1.default.POLICY.ROLE.ADMIN,
            reimbursementChoice: CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_YES,
            connections: { [CONST_1.default.POLICY.CONNECTIONS.NAME.QBD]: {} },
        };
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryExportReportActions)(report, policy);
        expect(result.includes(CONST_1.default.REPORT.EXPORT_OPTIONS.EXPORT_TO_INTEGRATION)).toBe(true);
    });
    it('includes EXPORT option for expense report with payments disabled', () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED,
        };
        const policy = {
            role: CONST_1.default.POLICY.ROLE.ADMIN,
            connections: { [CONST_1.default.POLICY.CONNECTIONS.NAME.QBD]: { config: { autosync: { enabled: true } } } },
        };
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryExportReportActions)(report, policy);
        expect(result.includes(CONST_1.default.REPORT.EXPORT_OPTIONS.EXPORT_TO_INTEGRATION)).toBe(true);
    });
    it('includes MARK_AS_EXPORTED option for invoice report sender', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.INVOICE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
        };
        const policy = {
            connections: { [CONST_1.default.POLICY.CONNECTIONS.NAME.QBD]: {} },
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryExportReportActions)(report, policy);
        expect(result.includes(CONST_1.default.REPORT.EXPORT_OPTIONS.MARK_AS_EXPORTED)).toBe(true);
    });
    it('includes MARK_AS_EXPORTED option for expense report preferred exporter', () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED,
        };
        const policy = {
            connections: { [CONST_1.default.POLICY.CONNECTIONS.NAME.QBD]: { config: { export: { exporter: EMPLOYEE_EMAIL }, autoSync: { enabled: false } } } },
        };
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryExportReportActions)(report, policy);
        expect(result.includes(CONST_1.default.REPORT.EXPORT_OPTIONS.MARK_AS_EXPORTED)).toBe(true);
    });
    it('includes MARK_AS_EXPORTED option for expense report with payments enabled', () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED,
        };
        const policy = {
            role: CONST_1.default.POLICY.ROLE.ADMIN,
            reimbursementChoice: CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_YES,
            connections: { [CONST_1.default.POLICY.CONNECTIONS.NAME.QBD]: {} },
        };
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryExportReportActions)(report, policy);
        expect(result.includes(CONST_1.default.REPORT.EXPORT_OPTIONS.MARK_AS_EXPORTED)).toBe(true);
    });
    it('includes MARK_AS_EXPORTED option for expense report with payments disabled', () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED,
        };
        const policy = {
            role: CONST_1.default.POLICY.ROLE.ADMIN,
            connections: { [CONST_1.default.POLICY.CONNECTIONS.NAME.QBD]: { config: { autosync: { enabled: true } } } },
        };
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryExportReportActions)(report, policy);
        expect(result.includes(CONST_1.default.REPORT.EXPORT_OPTIONS.MARK_AS_EXPORTED)).toBe(true);
    });
    it('includes MARK_AS_EXPORTED option for expense report preferred exporter', () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED,
        };
        const policy = {
            connections: { [CONST_1.default.POLICY.CONNECTIONS.NAME.QBD]: { config: { export: { exporter: EMPLOYEE_EMAIL }, autoSync: { enabled: false } } } },
        };
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryExportReportActions)(report, policy);
        expect(result.includes(CONST_1.default.REPORT.EXPORT_OPTIONS.MARK_AS_EXPORTED)).toBe(true);
    });
    it('includes MARK_AS_EXPORTED option for expense report admin', () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.APPROVED,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.APPROVED,
        };
        const policy = {
            connections: { [CONST_1.default.POLICY.CONNECTIONS.NAME.QBD]: { config: { export: { exporter: ADMIN_EMAIL }, autoSync: { enabled: true } } } },
            role: CONST_1.default.POLICY.ROLE.ADMIN,
        };
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryExportReportActions)(report, policy);
        expect(result.includes(CONST_1.default.REPORT.EXPORT_OPTIONS.MARK_AS_EXPORTED)).toBe(true);
    });
    it('includes REMOVE HOLD option for admin if he is not the holder', () => {
        const report = {};
        const policy = {
            role: CONST_1.default.POLICY.ROLE.ADMIN,
        };
        const reportTransactions = [
            {
                comment: {
                    hold: 'REPORT_ACTION_ID',
                },
            },
        ];
        jest.spyOn(ReportActionsUtils, 'getOneTransactionThreadReportID').mockReturnValue(actions_1.originalMessageR14932.IOUTransactionID);
        jest.spyOn(ReportUtils, 'isHoldCreator').mockReturnValue(false);
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({ report, chatReport: reports_1.chatReportR14932, reportTransactions, violations: {}, policy });
        expect(result).toContain(CONST_1.default.REPORT.SECONDARY_ACTIONS.REMOVE_HOLD);
    });
});
describe('getSecondaryTransactionThreadActions', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    beforeEach(async () => {
        jest.clearAllMocks();
        react_native_onyx_1.default.clear();
        await react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, SESSION);
        await react_native_onyx_1.default.set(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { [EMPLOYEE_ACCOUNT_ID]: PERSONAL_DETAILS });
    });
    it('should always return VIEW_DETAILS', () => {
        const report = {};
        const policy = {};
        const result = [CONST_1.default.REPORT.TRANSACTION_SECONDARY_ACTIONS.VIEW_DETAILS];
        expect((0, ReportSecondaryActionUtils_1.getSecondaryTransactionThreadActions)(report, {}, [], policy)).toEqual(result);
    });
    it('includes HOLD option', () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
        };
        const transaction = {
            comment: {},
        };
        const policy = {};
        jest.spyOn(ReportUtils, 'canHoldUnholdReportAction').mockReturnValueOnce({ canHoldRequest: true, canUnholdRequest: true });
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryTransactionThreadActions)(report, transaction, [actions_1.actionR14932], policy);
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.HOLD)).toBe(true);
    });
    it('includes REMOVE HOLD option for transaction thread report admin if he is not the holder', () => {
        const report = {};
        const transactionThreadReport = {};
        const policy = {
            role: CONST_1.default.POLICY.ROLE.ADMIN,
        };
        const transaction = {
            comment: {
                hold: 'REPORT_ACTION_ID',
            },
        };
        jest.spyOn(ReportUtils, 'isHoldCreator').mockReturnValue(false);
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryTransactionThreadActions)(report, transaction, [], policy, transactionThreadReport);
        expect(result).toContain(CONST_1.default.REPORT.SECONDARY_ACTIONS.REMOVE_HOLD);
        // Do not show if admin is the holder
        jest.spyOn(ReportUtils, 'isHoldCreator').mockReturnValue(true);
        const result2 = (0, ReportSecondaryActionUtils_1.getSecondaryTransactionThreadActions)(report, transaction, [], policy, transactionThreadReport);
        expect(result2).not.toContain(CONST_1.default.REPORT.SECONDARY_ACTIONS.REMOVE_HOLD);
    });
    it('includes DELETE option for expense report submitter', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
            stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
        };
        const policy = {};
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryTransactionThreadActions)(report, {}, [], policy);
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.DELETE)).toBe(true);
    });
    it('should not include CHANGE_WORKSPACE option for exported report', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.IOU,
            ownerAccountID: MANAGER_ACCOUNT_ID,
            managerID: EMPLOYEE_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
        };
        const personalDetails = {
            [EMPLOYEE_ACCOUNT_ID]: { login: EMPLOYEE_EMAIL },
            [MANAGER_ACCOUNT_ID]: { login: MANAGER_EMAIL },
        };
        const policy = {
            id: POLICY_ID,
            type: CONST_1.default.POLICY.TYPE.TEAM,
            reimbursementChoice: CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_MANUAL,
            isPolicyExpenseChatEnabled: true,
            employeeList: {
                [EMPLOYEE_EMAIL]: { email: EMPLOYEE_EMAIL, role: CONST_1.default.POLICY.ROLE.ADMIN },
                [MANAGER_EMAIL]: { email: MANAGER_EMAIL, role: CONST_1.default.POLICY.ROLE.USER },
            },
        };
        const reportActions = [
            {
                actionName: CONST_1.default.REPORT.ACTIONS.TYPE.EXPORTED_TO_INTEGRATION,
                originalMessage: { markedManually: true },
            },
        ];
        const policies = { [`${ONYXKEYS_1.default.COLLECTION.POLICY}${POLICY_ID}`]: policy };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${POLICY_ID}`, policy);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        await react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, { email: EMPLOYEE_EMAIL, accountID: EMPLOYEE_ACCOUNT_ID });
        await react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, personalDetails);
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryReportActions)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [], violations: {}, policy, policies, reportActions });
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.CHANGE_WORKSPACE)).toBe(false);
    });
    it('includes the SPLIT option if the current user belongs to the workspace', async () => {
        const report = {
            reportID: REPORT_ID,
            policyID: POLICY_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            managerID: EMPLOYEE_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
        };
        const transaction = {
            transactionID: 'TRANSACTION_ID',
            status: CONST_1.default.TRANSACTION.STATUS.POSTED,
            amount: 10,
            merchant: 'Merchant',
            date: '2025-01-01',
        };
        const policy = {
            id: POLICY_ID,
            type: CONST_1.default.POLICY.TYPE.TEAM,
            isPolicyExpenseChatEnabled: true,
            employeeList: {
                [EMPLOYEE_EMAIL]: { email: EMPLOYEE_EMAIL, role: CONST_1.default.POLICY.ROLE.USER },
                [ADMIN_EMAIL]: { email: ADMIN_EMAIL, role: CONST_1.default.POLICY.ROLE.ADMIN },
            },
            role: CONST_1.default.POLICY.ROLE.ADMIN,
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${POLICY_ID}`, policy);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryTransactionThreadActions)(report, transaction, [actions_1.actionR14932], policy);
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.SPLIT)).toBe(true);
    });
    it('does not include the SPLIT option if the current user does not belong to the workspace', async () => {
        const report = {
            reportID: REPORT_ID,
            policyID: POLICY_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            managerID: EMPLOYEE_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
        };
        const transaction = {
            transactionID: 'TRANSACTION_ID',
            status: CONST_1.default.TRANSACTION.STATUS.POSTED,
            amount: 10,
            merchant: 'Merchant',
            date: '2025-01-01',
        };
        const policy = {
            id: POLICY_ID,
            type: CONST_1.default.POLICY.TYPE.TEAM,
            isPolicyExpenseChatEnabled: true,
            employeeList: {
                [ADMIN_EMAIL]: { email: ADMIN_EMAIL, role: CONST_1.default.POLICY.ROLE.ADMIN },
            },
            role: CONST_1.default.POLICY.ROLE.ADMIN,
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${POLICY_ID}`, policy);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryTransactionThreadActions)(report, transaction, [actions_1.actionR14932], policy);
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.SPLIT)).toBe(false);
    });
    it('does not include the SPLIT option if the policy is not expense chat enabled', async () => {
        const report = {
            reportID: REPORT_ID,
            policyID: POLICY_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: EMPLOYEE_ACCOUNT_ID,
            managerID: EMPLOYEE_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
        };
        const transaction = {
            transactionID: 'TRANSACTION_ID',
            status: CONST_1.default.TRANSACTION.STATUS.POSTED,
            amount: 10,
            merchant: 'Merchant',
            date: '2025-01-01',
        };
        const policy = {
            id: POLICY_ID,
            type: CONST_1.default.POLICY.TYPE.TEAM,
            isPolicyExpenseChatEnabled: false,
            employeeList: {
                [EMPLOYEE_EMAIL]: { email: EMPLOYEE_EMAIL, role: CONST_1.default.POLICY.ROLE.USER },
                [ADMIN_EMAIL]: { email: ADMIN_EMAIL, role: CONST_1.default.POLICY.ROLE.ADMIN },
            },
            role: CONST_1.default.POLICY.ROLE.ADMIN,
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.POLICY}${POLICY_ID}`, policy);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const result = (0, ReportSecondaryActionUtils_1.getSecondaryTransactionThreadActions)(report, transaction, [actions_1.actionR14932], policy);
        expect(result.includes(CONST_1.default.REPORT.SECONDARY_ACTIONS.SPLIT)).toBe(false);
    });
});
