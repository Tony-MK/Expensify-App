"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const react_native_onyx_1 = require("react-native-onyx");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const ReportPrimaryActionUtils_1 = require("@libs/ReportPrimaryActionUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const reports_1 = require("../../__mocks__/reportData/reports");
const InvoiceData = require("../data/Invoice");
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
const CHAT_REPORT_ID = 2;
const POLICY_ID = 3;
const INVOICE_SENDER_ACCOUNT_ID = 4;
// This keeps the error "@rnmapbox/maps native code not available." from causing the tests to fail
jest.mock('@components/ConfirmedRoute.tsx');
describe('getPrimaryAction', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    beforeEach(async () => {
        jest.clearAllMocks();
        react_native_onyx_1.default.clear();
        await react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, SESSION);
        await react_native_onyx_1.default.set(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { [CURRENT_USER_ACCOUNT_ID]: PERSONAL_DETAILS });
    });
    it('should return ADD_EXPENSE for expense report with no transactions', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: CURRENT_USER_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        expect((0, ReportPrimaryActionUtils_1.getReportPrimaryAction)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [], violations: {}, policy: {}, isChatReportArchived: false })).toBe(CONST_1.default.REPORT.PRIMARY_ACTIONS.ADD_EXPENSE);
    });
    it('should return SUBMIT for expense report with manual submit', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: CURRENT_USER_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const policy = {
            autoReportingFrequency: CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.IMMEDIATE,
        };
        const transaction = {
            reportID: `${REPORT_ID}`,
        };
        expect((0, ReportPrimaryActionUtils_1.getReportPrimaryAction)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [transaction], violations: {}, policy: policy, isChatReportArchived: false })).toBe(CONST_1.default.REPORT.PRIMARY_ACTIONS.SUBMIT);
    });
    it('should not return SUBMIT option for admin with only pending transactions', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: CURRENT_USER_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const policy = {
            autoReportingFrequency: CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.IMMEDIATE,
        };
        const transaction = {
            reportID: `${REPORT_ID}`,
            status: CONST_1.default.TRANSACTION.STATUS.PENDING,
            amount: 10,
            merchant: 'Merchant',
            date: '2025-01-01',
        };
        expect((0, ReportPrimaryActionUtils_1.getReportPrimaryAction)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [transaction], violations: {}, policy: policy, isChatReportArchived: false })).toBe('');
    });
    it('should return Approve for report being processed', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: CURRENT_USER_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
            managerID: CURRENT_USER_ACCOUNT_ID,
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const policy = {
            approver: CURRENT_USER_EMAIL,
            approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.BASIC,
        };
        const transaction = {
            reportID: `${REPORT_ID}`,
            comment: {
                hold: 'Hold',
            },
        };
        expect((0, ReportPrimaryActionUtils_1.getReportPrimaryAction)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [transaction], violations: {}, policy: policy, isChatReportArchived: false })).toBe(CONST_1.default.REPORT.PRIMARY_ACTIONS.APPROVE);
    });
    it('should return empty for report being processed but transactions are scanning', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: CURRENT_USER_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
            managerID: CURRENT_USER_ACCOUNT_ID,
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const policy = {
            approver: CURRENT_USER_EMAIL,
            approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.BASIC,
        };
        const transaction = {
            reportID: `${REPORT_ID}`,
            comment: {
                hold: 'Hold',
            },
            receipt: {
                state: CONST_1.default.IOU.RECEIPT_STATE.SCANNING,
            },
        };
        expect((0, ReportPrimaryActionUtils_1.getReportPrimaryAction)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [transaction], violations: {}, policy: policy, isChatReportArchived: false })).toBe('');
    });
    it('should return empty for report being processed but transactions are pending', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: CURRENT_USER_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
            managerID: CURRENT_USER_ACCOUNT_ID,
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const policy = {
            approver: CURRENT_USER_EMAIL,
            approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.BASIC,
        };
        const transaction = {
            reportID: `${REPORT_ID}`,
            status: CONST_1.default.TRANSACTION.STATUS.PENDING,
            amount: 10,
            merchant: 'Merchant',
            date: '2025-01-01',
        };
        expect((0, ReportPrimaryActionUtils_1.getReportPrimaryAction)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [transaction], violations: {}, policy: policy, isChatReportArchived: false })).toBe('');
    });
    it('should return PAY for submitted invoice report  if paid as personal', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.INVOICE,
            ownerAccountID: INVOICE_SENDER_ACCOUNT_ID,
            parentReportID: CHAT_REPORT_ID,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
            stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
            total: 7,
        };
        const parentReport = {
            reportID: CHAT_REPORT_ID,
            invoiceReceiver: {
                type: CONST_1.default.REPORT.INVOICE_RECEIVER_TYPE.INDIVIDUAL,
                accountID: CURRENT_USER_ACCOUNT_ID,
            },
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${CHAT_REPORT_ID}`, parentReport);
        const policy = {};
        const invoiceReceiverPolicy = {
            role: CONST_1.default.POLICY.ROLE.ADMIN,
        };
        const transaction = {
            reportID: `${REPORT_ID}`,
        };
        expect((0, ReportPrimaryActionUtils_1.getReportPrimaryAction)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [transaction], violations: {}, policy, invoiceReceiverPolicy, isChatReportArchived: false })).toBe(CONST_1.default.REPORT.PRIMARY_ACTIONS.PAY);
    });
    it('should not return PAY for zero value invoice report if paid as personal', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.INVOICE,
            ownerAccountID: INVOICE_SENDER_ACCOUNT_ID,
            parentReportID: CHAT_REPORT_ID,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
            stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
            total: 0,
        };
        const parentReport = {
            reportID: CHAT_REPORT_ID,
            invoiceReceiver: {
                type: CONST_1.default.REPORT.INVOICE_RECEIVER_TYPE.INDIVIDUAL,
                accountID: CURRENT_USER_ACCOUNT_ID,
            },
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${CHAT_REPORT_ID}`, parentReport);
        const policy = {};
        const invoiceReceiverPolicy = {
            role: CONST_1.default.POLICY.ROLE.ADMIN,
        };
        const transaction = {
            reportID: `${REPORT_ID}`,
        };
        expect((0, ReportPrimaryActionUtils_1.getReportPrimaryAction)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [transaction], violations: {}, policy, invoiceReceiverPolicy, isChatReportArchived: false })).toBe('');
    });
    it('should return PAY for expense report with payments enabled', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: CURRENT_USER_ACCOUNT_ID,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.CLOSED,
            total: -300,
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const policy = {
            role: CONST_1.default.POLICY.ROLE.ADMIN,
        };
        const transaction = {
            reportID: `${REPORT_ID}`,
        };
        expect((0, ReportPrimaryActionUtils_1.getReportPrimaryAction)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [transaction], violations: {}, policy: policy, isChatReportArchived: false })).toBe(CONST_1.default.REPORT.PRIMARY_ACTIONS.PAY);
    });
    it('should return EXPORT TO ACCOUNTING for finished reports', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: CURRENT_USER_ACCOUNT_ID,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.CLOSED,
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const policy = {
            connections: {
                intacct: {
                    config: {
                        export: {
                            exporter: CURRENT_USER_EMAIL,
                        },
                    },
                },
            },
        };
        const transaction = {
            reportID: `${REPORT_ID}`,
        };
        expect((0, ReportPrimaryActionUtils_1.getReportPrimaryAction)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [transaction], violations: {}, policy: policy, isChatReportArchived: false })).toBe(CONST_1.default.REPORT.PRIMARY_ACTIONS.EXPORT_TO_ACCOUNTING);
    });
    it('should not return EXPORT TO ACCOUNTING for invoice reports', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.INVOICE,
            ownerAccountID: CURRENT_USER_ACCOUNT_ID,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.CLOSED,
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const policy = {
            connections: {
                intacct: {
                    config: {
                        export: {
                            exporter: CURRENT_USER_EMAIL,
                        },
                    },
                },
            },
        };
        const transaction = {
            reportID: `${REPORT_ID}`,
        };
        expect((0, ReportPrimaryActionUtils_1.getReportPrimaryAction)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [transaction], violations: {}, policy: policy, isChatReportArchived: false })).not.toBe(CONST_1.default.REPORT.PRIMARY_ACTIONS.EXPORT_TO_ACCOUNTING);
    });
    it('should not return EXPORT TO ACCOUNTING for reports marked manually as exported', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: CURRENT_USER_ACCOUNT_ID,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.CLOSED,
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const policy = {
            connections: {
                intacct: {
                    config: {
                        export: {
                            exporter: CURRENT_USER_EMAIL,
                        },
                    },
                },
            },
        };
        const reportActions = [
            { actionName: CONST_1.default.REPORT.ACTIONS.TYPE.EXPORTED_TO_INTEGRATION, reportActionID: '1', created: '2025-01-01', originalMessage: { markedManually: true } },
        ];
        expect((0, ReportPrimaryActionUtils_1.getReportPrimaryAction)({
            report,
            chatReport: reports_1.chatReportR14932,
            reportTransactions: [],
            violations: {},
            policy: policy,
            reportNameValuePairs: {},
            reportActions,
            isChatReportArchived: false,
        })).toBe('');
    });
    it('should return REMOVE HOLD for an approver who held the expense', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const HOLD_ACTION_ID = 'HOLD_ACTION_ID';
        const REPORT_ACTION_ID = 'REPORT_ACTION_ID';
        const TRANSACTION_ID = 'TRANSACTION_ID';
        const CHILD_REPORT_ID = 'CHILD_REPORT_ID';
        const transaction = {
            transactionID: TRANSACTION_ID,
            comment: {
                hold: HOLD_ACTION_ID,
            },
        };
        const policy = {
            approver: CURRENT_USER_ACCOUNT_ID,
            approvalMode: CONST_1.default.POLICY.APPROVAL_MODE.BASIC,
        };
        const reportAction = {
            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
            type: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
            reportActionID: REPORT_ACTION_ID,
            actorAccountID: 2, // The iou was created by a member
            childReportID: CHILD_REPORT_ID,
            message: [
                {
                    html: 'html',
                },
            ],
            originalMessage: {
                type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                IOUTransactionID: TRANSACTION_ID,
            },
        };
        const holdAction = {
            reportActionID: HOLD_ACTION_ID,
            reportID: CHILD_REPORT_ID,
            actorAccountID: CURRENT_USER_ACCOUNT_ID,
        };
        await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${REPORT_ID}`, { [REPORT_ACTION_ID]: reportAction });
        await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${CHILD_REPORT_ID}`, { [HOLD_ACTION_ID]: holdAction });
        expect((0, ReportPrimaryActionUtils_1.getReportPrimaryAction)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [transaction], violations: {}, policy, isChatReportArchived: false })).toBe(CONST_1.default.REPORT.PRIMARY_ACTIONS.REMOVE_HOLD);
    });
    it('should return REMOVE HOLD for reports with transactions on hold', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const policy = {};
        const HOLD_ACTION_ID = 'HOLD_ACTION_ID';
        const REPORT_ACTION_ID = 'REPORT_ACTION_ID';
        const TRANSACTION_ID = 'TRANSACTION_ID';
        const CHILD_REPORT_ID = 'CHILD_REPORT_ID';
        const transaction = {
            transactionID: TRANSACTION_ID,
            comment: {
                hold: HOLD_ACTION_ID,
            },
        };
        const reportAction = {
            actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
            type: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
            reportActionID: REPORT_ACTION_ID,
            actorAccountID: CURRENT_USER_ACCOUNT_ID,
            childReportID: CHILD_REPORT_ID,
            message: [
                {
                    html: 'html',
                },
            ],
            originalMessage: {
                type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                IOUTransactionID: TRANSACTION_ID,
            },
        };
        const holdAction = {
            reportActionID: HOLD_ACTION_ID,
            reportID: CHILD_REPORT_ID,
            actorAccountID: CURRENT_USER_ACCOUNT_ID,
        };
        await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${REPORT_ID}`, { [REPORT_ACTION_ID]: reportAction });
        await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${CHILD_REPORT_ID}`, { [HOLD_ACTION_ID]: holdAction });
        expect((0, ReportPrimaryActionUtils_1.getReportPrimaryAction)({ report, chatReport: reports_1.chatReportR14932, reportTransactions: [transaction], violations: {}, policy: policy, isChatReportArchived: false })).toBe(CONST_1.default.REPORT.PRIMARY_ACTIONS.REMOVE_HOLD);
    });
    it('should return MARK AS CASH if has all RTER violations', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: CURRENT_USER_ACCOUNT_ID,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.CLOSED,
            total: -300,
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const policy = {
            role: CONST_1.default.POLICY.ROLE.ADMIN,
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
        expect((0, ReportPrimaryActionUtils_1.getReportPrimaryAction)({
            report,
            chatReport: reports_1.chatReportR14932,
            reportTransactions: [transaction],
            violations: { [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${TRANSACTION_ID}`]: [violation] },
            policy: policy,
            isChatReportArchived: false,
        })).toBe(CONST_1.default.REPORT.PRIMARY_ACTIONS.MARK_AS_CASH);
    });
    it('should return MARK AS CASH for broken connection', async () => {
        const report = {
            reportID: REPORT_ID,
            ownerAccountID: CURRENT_USER_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const policy = {};
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
        expect((0, ReportPrimaryActionUtils_1.getReportPrimaryAction)({
            report,
            chatReport: reports_1.chatReportR14932,
            reportTransactions: [transaction],
            violations: { [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${TRANSACTION_ID}`]: [violation] },
            policy: policy,
            isChatReportArchived: false,
        })).toBe(CONST_1.default.REPORT.PRIMARY_ACTIONS.MARK_AS_CASH);
    });
    it('should return an empty string for invoice report when the chat report is archived', async () => {
        // Given the invoice data
        const { policy, convertedInvoiceChat: invoiceChatReport } = InvoiceData;
        const report = {
            type: CONST_1.default.REPORT.TYPE.INVOICE,
            ownerAccountID: CURRENT_USER_ACCOUNT_ID,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
            stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
            chatReportID: invoiceChatReport.chatReportID,
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        // This is what indicates that a report is archived (see ReportUtils.isArchivedReport())
        await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${report.chatReportID}`, {
            private_isArchived: new Date().toString(),
        });
        const transaction = {
            reportID: `${REPORT_ID}`,
        };
        // Simulate how components determine if a chat report is archived by using this hook
        const { result: isChatReportArchived } = (0, react_native_1.renderHook)(() => (0, useReportIsArchived_1.default)(report?.chatReportID));
        // Then the getReportPrimaryAction should return the empty string
        expect((0, ReportPrimaryActionUtils_1.getReportPrimaryAction)({
            report,
            chatReport: invoiceChatReport,
            reportTransactions: [transaction],
            violations: {},
            // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
            policy: policy,
            isChatReportArchived: isChatReportArchived.current,
        })).toBe('');
    });
});
describe('isReviewDuplicatesAction', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    beforeEach(async () => {
        jest.clearAllMocks();
        react_native_onyx_1.default.clear();
        await react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, SESSION);
        await react_native_onyx_1.default.set(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { [CURRENT_USER_ACCOUNT_ID]: PERSONAL_DETAILS });
    });
    it('should return true when report approver has duplicated transactions', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: 999,
            managerID: CURRENT_USER_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
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
        expect((0, ReportPrimaryActionUtils_1.isReviewDuplicatesAction)(report, [transaction])).toBe(true);
    });
    it('should return false when report approver has no duplicated transactions', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: 999,
            managerID: CURRENT_USER_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const TRANSACTION_ID = 'TRANSACTION_ID';
        const transaction = {
            transactionID: TRANSACTION_ID,
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${TRANSACTION_ID}`, transaction);
        expect((0, ReportPrimaryActionUtils_1.isReviewDuplicatesAction)(report, [transaction])).toBe(false);
    });
    it('should return false when current user is neither the report submitter nor approver', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: 999,
            managerID: 888,
            stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
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
        expect((0, ReportPrimaryActionUtils_1.isReviewDuplicatesAction)(report, [transaction])).toBe(false);
    });
});
describe('getTransactionThreadPrimaryAction', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    beforeEach(async () => {
        jest.clearAllMocks();
        react_native_onyx_1.default.clear();
        await react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, SESSION);
        await react_native_onyx_1.default.set(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { [CURRENT_USER_ACCOUNT_ID]: PERSONAL_DETAILS });
    });
    it('should return REMOVE HOLD for transaction thread being on hold', async () => {
        const policy = {};
        const HOLD_ACTION_ID = 'HOLD_ACTION_ID';
        const TRANSACTION_ID = 'TRANSACTION_ID';
        const CHILD_REPORT_ID = 'CHILD_REPORT_ID';
        const report = {
            reportID: CHILD_REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
        };
        const transaction = {
            transactionID: TRANSACTION_ID,
            comment: {
                hold: HOLD_ACTION_ID,
            },
        };
        const holdAction = {
            reportActionID: HOLD_ACTION_ID,
            reportID: CHILD_REPORT_ID,
            actorAccountID: CURRENT_USER_ACCOUNT_ID,
        };
        await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${CHILD_REPORT_ID}`, { [HOLD_ACTION_ID]: holdAction });
        expect((0, ReportPrimaryActionUtils_1.getTransactionThreadPrimaryAction)(report, {}, transaction, [], policy)).toBe(CONST_1.default.REPORT.TRANSACTION_PRIMARY_ACTIONS.REMOVE_HOLD);
    });
    it('should return REVIEW DUPLICATES when there are duplicated transactions', async () => {
        const report = {
            reportID: REPORT_ID,
            ownerAccountID: CURRENT_USER_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const policy = {};
        const REPORT_ACTION_ID = 'REPORT_ACTION_ID';
        const TRANSACTION_ID = 'TRANSACTION_ID';
        const transaction = {
            transactionID: TRANSACTION_ID,
            comment: {
                hold: REPORT_ACTION_ID,
            },
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${TRANSACTION_ID}`, transaction);
        await react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${TRANSACTION_ID}`, [
            {
                name: CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION,
            },
        ]);
        expect((0, ReportPrimaryActionUtils_1.getTransactionThreadPrimaryAction)({}, report, transaction, [], policy)).toBe(CONST_1.default.REPORT.TRANSACTION_PRIMARY_ACTIONS.REVIEW_DUPLICATES);
    });
    it('should return MARK AS CASH if has all RTER violations', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: CURRENT_USER_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const policy = {};
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
        expect((0, ReportPrimaryActionUtils_1.getTransactionThreadPrimaryAction)({}, report, transaction, [violation], policy)).toBe(CONST_1.default.REPORT.TRANSACTION_PRIMARY_ACTIONS.MARK_AS_CASH);
    });
    it('should return MARK AS CASH for broken connection', async () => {
        const report = {
            reportID: REPORT_ID,
            ownerAccountID: CURRENT_USER_ACCOUNT_ID,
            stateNum: CONST_1.default.REPORT.STATE_NUM.OPEN,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.OPEN,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const policy = {};
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
        expect((0, ReportPrimaryActionUtils_1.getTransactionThreadPrimaryAction)({}, report, transaction, [violation], policy)).toBe(CONST_1.default.REPORT.TRANSACTION_PRIMARY_ACTIONS.MARK_AS_CASH);
    });
    it('Should return empty string when we are waiting for user to add a bank account', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            ownerAccountID: CURRENT_USER_ACCOUNT_ID,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.CLOSED,
            isWaitingOnBankAccount: true,
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        const policy = {
            connections: {
                intacct: {
                    config: {
                        export: {
                            exporter: CURRENT_USER_EMAIL,
                        },
                    },
                },
            },
        };
        const transaction = {
            reportID: `${REPORT_ID}`,
        };
        expect((0, ReportPrimaryActionUtils_1.getReportPrimaryAction)({
            report,
            chatReport: reports_1.chatReportR14932,
            reportTransactions: [transaction],
            violations: {},
            policy: policy,
            isChatReportArchived: false,
        })).toBe('');
    });
    it('should return PAY for submitted invoice report if paid as business and the payer is the policy admin', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.INVOICE,
            ownerAccountID: INVOICE_SENDER_ACCOUNT_ID,
            parentReportID: CHAT_REPORT_ID,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
            stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
            total: 7,
        };
        const parentReport = {
            reportID: CHAT_REPORT_ID,
            invoiceReceiver: {
                type: CONST_1.default.REPORT.INVOICE_RECEIVER_TYPE.BUSINESS,
                policyID: POLICY_ID,
            },
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${CHAT_REPORT_ID}`, parentReport);
        const invoiceReceiverPolicy = {
            role: CONST_1.default.POLICY.ROLE.ADMIN,
        };
        const transaction = {
            reportID: `${REPORT_ID}`,
        };
        expect((0, ReportPrimaryActionUtils_1.getReportPrimaryAction)({
            report,
            chatReport: reports_1.chatReportR14932,
            reportTransactions: [transaction],
            violations: {},
            policy: {},
            invoiceReceiverPolicy: invoiceReceiverPolicy,
            isChatReportArchived: false,
        })).toBe(CONST_1.default.REPORT.PRIMARY_ACTIONS.PAY);
    });
    it('should not return PAY for zero value invoice report if paid as business and the payer is the policy admin', async () => {
        const report = {
            reportID: REPORT_ID,
            type: CONST_1.default.REPORT.TYPE.INVOICE,
            ownerAccountID: INVOICE_SENDER_ACCOUNT_ID,
            parentReportID: CHAT_REPORT_ID,
            statusNum: CONST_1.default.REPORT.STATUS_NUM.SUBMITTED,
            stateNum: CONST_1.default.REPORT.STATE_NUM.SUBMITTED,
            total: 0,
        };
        const parentReport = {
            reportID: CHAT_REPORT_ID,
            invoiceReceiver: {
                type: CONST_1.default.REPORT.INVOICE_RECEIVER_TYPE.BUSINESS,
                policyID: POLICY_ID,
            },
        };
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${REPORT_ID}`, report);
        await react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT}${CHAT_REPORT_ID}`, parentReport);
        const invoiceReceiverPolicy = {
            role: CONST_1.default.POLICY.ROLE.ADMIN,
        };
        const transaction = {
            reportID: `${REPORT_ID}`,
        };
        expect((0, ReportPrimaryActionUtils_1.getReportPrimaryAction)({
            report,
            chatReport: reports_1.chatReportR14932,
            reportTransactions: [transaction],
            violations: {},
            policy: {},
            invoiceReceiverPolicy: invoiceReceiverPolicy,
            isChatReportArchived: false,
        })).toBe('');
    });
    describe('isMarkAsResolvedAction', () => {
        const submitterAccountID = 1;
        const otherUserAccountID = 3;
        beforeEach(async () => {
            jest.clearAllMocks();
            react_native_onyx_1.default.clear();
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, { accountID: submitterAccountID });
        });
        it('should return true for submitter with pending auto rejected expense violation', () => {
            const report = {
                reportID: REPORT_ID,
                ownerAccountID: submitterAccountID,
            };
            const violations = [
                {
                    name: CONST_1.default.VIOLATIONS.AUTO_REPORTED_REJECTED_EXPENSE,
                    type: CONST_1.default.VIOLATION_TYPES.WARNING,
                },
            ];
            const result = (0, ReportPrimaryActionUtils_1.isMarkAsResolvedAction)(report, violations);
            expect(result).toBe(true);
        });
        it('should return true for admin with pending auto rejected expense violation', () => {
            const policy = {
                role: CONST_1.default.POLICY.ROLE.ADMIN,
            };
            const report = {
                reportID: REPORT_ID,
                ownerAccountID: otherUserAccountID, // Different from current user
            };
            const violations = [
                {
                    name: CONST_1.default.VIOLATIONS.AUTO_REPORTED_REJECTED_EXPENSE,
                    type: CONST_1.default.VIOLATION_TYPES.WARNING,
                },
            ];
            const result = (0, ReportPrimaryActionUtils_1.isMarkAsResolvedAction)(report, violations, policy);
            expect(result).toBe(true);
        });
        it('should return false for non-submitter non-admin user', () => {
            const policy = {
                role: CONST_1.default.POLICY.ROLE.USER,
            };
            const report = {
                reportID: REPORT_ID,
                ownerAccountID: otherUserAccountID, // Different from current user
            };
            const violations = [
                {
                    name: CONST_1.default.VIOLATIONS.AUTO_REPORTED_REJECTED_EXPENSE,
                    type: CONST_1.default.VIOLATION_TYPES.WARNING,
                },
            ];
            const result = (0, ReportPrimaryActionUtils_1.isMarkAsResolvedAction)(report, violations, policy);
            expect(result).toBe(false);
        });
        it('should return false when no violations are present', () => {
            const report = {
                reportID: REPORT_ID,
                ownerAccountID: submitterAccountID,
            };
            const violations = [];
            const result = (0, ReportPrimaryActionUtils_1.isMarkAsResolvedAction)(report, violations);
            expect(result).toBe(false);
        });
        it('should return false when no auto rejected expense violation is present', () => {
            const report = {
                reportID: REPORT_ID,
                ownerAccountID: submitterAccountID,
            };
            const violations = [
                {
                    name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY,
                    type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
                },
            ];
            const result = (0, ReportPrimaryActionUtils_1.isMarkAsResolvedAction)(report, violations);
            expect(result).toBe(false);
        });
        it('should return false when report or violations are undefined', () => {
            const result1 = (0, ReportPrimaryActionUtils_1.isMarkAsResolvedAction)(undefined, []);
            const result2 = (0, ReportPrimaryActionUtils_1.isMarkAsResolvedAction)({}, undefined);
            expect(result1).toBe(false);
            expect(result2).toBe(false);
        });
    });
    describe('isMarkAsResolvedReportAction', () => {
        const submitterAccountID = 1;
        const otherUserAccountID = 3;
        beforeEach(async () => {
            jest.clearAllMocks();
            react_native_onyx_1.default.clear();
            await react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, { accountID: submitterAccountID });
        });
        it('should return true for submitter with pending auto rejected expense violation in transactions', () => {
            const report = {
                reportID: REPORT_ID,
                ownerAccountID: submitterAccountID,
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
            };
            const transactions = [
                {
                    transactionID: '1',
                    reportID: REPORT_ID.toString(),
                    amount: 1000,
                    created: '2023-01-01',
                    currency: 'USD',
                    merchant: 'Test Merchant',
                },
            ];
            const violations = {
                [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}1`]: [
                    {
                        name: CONST_1.default.VIOLATIONS.AUTO_REPORTED_REJECTED_EXPENSE,
                        type: CONST_1.default.VIOLATION_TYPES.WARNING,
                    },
                ],
            };
            const reportActions = [
                {
                    reportActionID: '1',
                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                    actorAccountID: CURRENT_USER_ACCOUNT_ID,
                    created: '2023-01-01',
                    message: [{ type: 'COMMENT', text: 'Test message' }],
                    originalMessage: {
                        type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                        IOUTransactionID: '1',
                    },
                    childReportID: '1',
                },
            ];
            const result = (0, ReportPrimaryActionUtils_1.isMarkAsResolvedReportAction)(report, reports_1.chatReportR14932, transactions, violations, undefined, reportActions);
            expect(result).toBe(true);
        });
        it('should return true for admin with pending auto rejected expense violation', () => {
            const policy = {
                role: CONST_1.default.POLICY.ROLE.ADMIN,
            };
            const report = {
                reportID: REPORT_ID,
                ownerAccountID: otherUserAccountID, // Different from current user
                type: CONST_1.default.REPORT.TYPE.EXPENSE,
            };
            const transactions = [
                {
                    transactionID: '1',
                    reportID: REPORT_ID.toString(),
                    amount: 1000,
                    created: '2023-01-01',
                    currency: 'USD',
                    merchant: 'Test Merchant',
                },
            ];
            const violations = {
                [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}1`]: [
                    {
                        name: CONST_1.default.VIOLATIONS.AUTO_REPORTED_REJECTED_EXPENSE,
                        type: CONST_1.default.VIOLATION_TYPES.WARNING,
                    },
                ],
            };
            const reportActions = [
                {
                    reportActionID: '1',
                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                    actorAccountID: CURRENT_USER_ACCOUNT_ID,
                    created: '2023-01-01',
                    message: [{ type: 'COMMENT', text: 'Test message' }],
                    originalMessage: {
                        type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                        IOUTransactionID: '1',
                    },
                    childReportID: '1',
                },
            ];
            const result = (0, ReportPrimaryActionUtils_1.isMarkAsResolvedReportAction)(report, reports_1.chatReportR14932, transactions, violations, policy, reportActions);
            expect(result).toBe(true);
        });
        it('should return false for non-submitter non-admin user', () => {
            const policy = {
                role: CONST_1.default.POLICY.ROLE.USER,
            };
            const report = {
                reportID: REPORT_ID,
                ownerAccountID: otherUserAccountID, // Different from current user
            };
            const transactions = [
                {
                    transactionID: '1',
                    reportID: REPORT_ID.toString(),
                    amount: 1000,
                    created: '2023-01-01',
                    currency: 'USD',
                    merchant: 'Test Merchant',
                },
            ];
            const violations = {
                [`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}1`]: [
                    {
                        name: CONST_1.default.VIOLATIONS.AUTO_REPORTED_REJECTED_EXPENSE,
                        type: CONST_1.default.VIOLATION_TYPES.WARNING,
                    },
                ],
            };
            const reportActions = [
                {
                    reportActionID: '1',
                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                    actorAccountID: CURRENT_USER_ACCOUNT_ID,
                    created: '2023-01-01',
                    message: [{ type: 'COMMENT', text: 'Test message' }],
                    originalMessage: {
                        type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                        IOUTransactionID: '1',
                    },
                },
            ];
            const result = (0, ReportPrimaryActionUtils_1.isMarkAsResolvedReportAction)(report, reports_1.chatReportR14932, transactions, violations, policy, reportActions);
            expect(result).toBe(false);
        });
        it('should return false when no auto rejected expense violations are present', () => {
            const report = {
                reportID: REPORT_ID,
                ownerAccountID: submitterAccountID,
            };
            const transactions = [
                {
                    transactionID: '1',
                    reportID: REPORT_ID.toString(),
                    amount: 1000,
                    created: '2023-01-01',
                    currency: 'USD',
                    merchant: 'Test Merchant',
                },
            ];
            const violations = {
                transactionViolation1: [
                    {
                        name: CONST_1.default.VIOLATIONS.MISSING_CATEGORY,
                        type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
                    },
                ],
            };
            const reportActions = [
                {
                    reportActionID: '1',
                    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.IOU,
                    actorAccountID: CURRENT_USER_ACCOUNT_ID,
                    created: '2023-01-01',
                    message: [{ type: 'COMMENT', text: 'Test message' }],
                    originalMessage: {
                        type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                        IOUTransactionID: '1',
                    },
                },
            ];
            const result = (0, ReportPrimaryActionUtils_1.isMarkAsResolvedReportAction)(report, reports_1.chatReportR14932, transactions, violations, undefined, reportActions);
            expect(result).toBe(false);
        });
    });
});
