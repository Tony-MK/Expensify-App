"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const actions_1 = require("../../__mocks__/reportData/actions");
const LHNTestUtils = require("../utils/LHNTestUtils");
const FAKE_PERSONAL_DETAILS = LHNTestUtils.fakePersonalDetails;
/* eslint-disable @typescript-eslint/naming-convention */
const FAKE_REPORT_ACTIONS = {
    [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}1`]: {
        '1': { ...actions_1.actionR14932, actorAccountID: 2 },
    },
    [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}2`]: {
        '2': { ...actions_1.actionR98765, actorAccountID: 1 },
    },
    [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}3`]: {
        '2': { ...actions_1.actionR98765, actorAccountID: 1 },
    },
    // For workspace thread test - parent report actions
    [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}workspaceParent`]: {
        '1': { ...actions_1.actionR14932, actorAccountID: 2, actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT },
    },
    // For multi-transaction IOU test - multiple transactions
    [`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}multiTxn`]: {
        '1': { ...actions_1.actionR14932, actorAccountID: 1 },
        '2': { ...actions_1.actionR98765, actorAccountID: 1 },
    },
};
/* eslint-enable @typescript-eslint/naming-convention */
const FAKE_REPORTS = {
    [`${ONYXKEYS_1.default.COLLECTION.REPORT}1`]: {
        ...LHNTestUtils.getFakeReport([1, 2], 0, true),
        invoiceReceiver: {
            type: CONST_1.default.REPORT.INVOICE_RECEIVER_TYPE.INDIVIDUAL,
            accountID: 3,
        },
    },
    // This is the parent report for the expense request test.
    // It MUST have type: 'expense' for the isExpenseRequest() check to pass.
    [`${ONYXKEYS_1.default.COLLECTION.REPORT}2`]: {
        ...LHNTestUtils.getFakeReport([1], 0, true),
        reportID: '2',
        type: CONST_1.default.REPORT.TYPE.EXPENSE,
    },
    // This is the parent report for the expense request test.
    // It MUST have type: 'expense' for the isExpenseRequest() check to pass.
    [`${ONYXKEYS_1.default.COLLECTION.REPORT}3`]: {
        ...LHNTestUtils.getFakeReport([1], 0, true),
        reportID: '3',
        parentReportID: '2',
        parentReportActionID: '2',
        type: CONST_1.default.REPORT.TYPE.EXPENSE,
    },
    // Parent workspace chat for workspace thread test
    [`${ONYXKEYS_1.default.COLLECTION.REPORT}workspaceParent`]: {
        ...LHNTestUtils.getFakeReport([1], 0, true),
        reportID: 'workspaceParent',
        chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
        policyID: '1',
    },
    // Parent policy expense chat for workspace task test
    [`${ONYXKEYS_1.default.COLLECTION.REPORT}taskParent`]: {
        ...LHNTestUtils.getFakeReport([1], 0, true),
        reportID: 'taskParent',
        chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
        policyID: '1',
    },
    // Chat report for multi-transaction IOU test
    [`${ONYXKEYS_1.default.COLLECTION.REPORT}chatReport`]: {
        ...LHNTestUtils.getFakeReport([1, 2], 0, true),
        reportID: 'chatReport',
    },
};
const FAKE_POLICIES = {
    [`${ONYXKEYS_1.default.COLLECTION.POLICY}1`]: LHNTestUtils.getFakePolicy('1'),
};
const currentUserAccountID = 5;
beforeAll(() => {
    react_native_onyx_1.default.init({
        keys: ONYXKEYS_1.default,
        initialKeyStates: {
            [ONYXKEYS_1.default.SESSION]: { email: FAKE_PERSONAL_DETAILS[currentUserAccountID]?.login, accountID: currentUserAccountID },
            [ONYXKEYS_1.default.PERSONAL_DETAILS_LIST]: FAKE_PERSONAL_DETAILS,
            ...FAKE_REPORT_ACTIONS,
            ...FAKE_REPORTS,
            ...FAKE_POLICIES,
        },
    });
    // @ts-expect-error Until we add NVP_PRIVATE_DOMAINS to ONYXKEYS, we need to mock it here
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    react_native_onyx_1.default.connect({ key: ONYXKEYS_1.default.NVP_PRIVATE_DOMAINS, callback: () => { } });
});
describe('getIcons', () => {
    it('should return a fallback icon if the report is empty', () => {
        const report = {};
        const icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS);
        expect(icons).toHaveLength(1);
    });
    it('should return the correct icons for an expense request', () => {
        const report = {
            ...LHNTestUtils.getFakeReport([1], 0, true),
            parentReportID: '3',
            parentReportActionID: '2',
            type: CONST_1.default.REPORT.TYPE.IOU,
        };
        const policy = LHNTestUtils.getFakePolicy('1');
        // Verify report type conditions
        expect((0, ReportUtils_1.isExpenseRequest)(report)).toBe(true);
        expect((0, ReportUtils_1.isThread)(report)).toBe(true);
        const icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS, null, '', -1, policy);
        expect(icons).toHaveLength(2);
        expect(icons.at(0)?.name).toBe('Email One');
    });
    it('should return the correct icons for archived non expense request/report', () => {
        const report = {
            ...LHNTestUtils.getFakeReport([1], 0, true),
            type: CONST_1.default.REPORT.CHAT_TYPE.INVOICE,
        };
        const policy = LHNTestUtils.getFakePolicy('1');
        // Verify report type conditions
        expect((0, ReportUtils_1.isArchivedNonExpenseReport)(report, true)).toBe(true);
        const icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS, null, '', -1, policy, undefined, true);
        expect(icons).toHaveLength(1);
        expect(icons.at(0)?.name).toBe(policy.name);
        expect(icons.at(0)?.type).toBe('workspace');
    });
    it('should return the correct icons for a chat thread', () => {
        const report = {
            ...LHNTestUtils.getFakeReport([1], 0, true),
            parentReportID: '1',
            parentReportActionID: '1',
        };
        // Verify report type conditions
        expect((0, ReportUtils_1.isChatThread)(report)).toBe(true);
        expect((0, ReportUtils_1.isThread)(report)).toBe(true);
        const icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS);
        expect(icons).toHaveLength(1);
        expect(icons.at(0)?.name).toBe('Email\u00A0Two');
    });
    it('should return the correct icons for a task report', () => {
        const report = {
            ...LHNTestUtils.getFakeReport([1], 0, true),
            type: CONST_1.default.REPORT.TYPE.TASK,
            ownerAccountID: 1,
        };
        // Verify report type conditions
        expect((0, ReportUtils_1.isTaskReport)(report)).toBe(true);
        const icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS);
        expect(icons).toHaveLength(1);
        expect(icons.at(0)?.name).toBe('Email One');
    });
    it('should return the correct icons for a domain room', () => {
        const report = {
            ...LHNTestUtils.getFakeReport([], 0, true),
            chatType: CONST_1.default.REPORT.CHAT_TYPE.DOMAIN_ALL,
            reportName: '#domain-test',
        };
        const icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS);
        expect(icons).toHaveLength(1);
        expect(icons.at(0)?.name).toBe('domain-test');
    });
    it('should return the correct icons for a policy room', () => {
        const report = {
            ...LHNTestUtils.getFakeReport([], 0, true),
            chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ROOM,
            policyID: '1',
        };
        const policy = LHNTestUtils.getFakePolicy('1');
        const icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS, null, '', -1, policy);
        expect(icons).toHaveLength(1);
        expect(icons.at(0)?.name).toBe('Workspace-Test-001');
    });
    it('should return the correct icons for a policy expense chat', () => {
        const report = {
            ...LHNTestUtils.getFakeReport([1], 0, true),
            chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
            policyID: '1',
        };
        const policy = LHNTestUtils.getFakePolicy('1');
        // Verify report type conditions
        expect((0, ReportUtils_1.isPolicyExpenseChat)(report)).toBe(true);
        expect((0, ReportUtils_1.isChatReport)(report)).toBe(true);
        const icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS, null, '', -1, policy);
        expect(icons).toHaveLength(2);
        expect(icons.at(0)?.type).toBe(CONST_1.default.ICON_TYPE_WORKSPACE);
        expect(icons.at(1)?.type).toBe(CONST_1.default.ICON_TYPE_AVATAR);
    });
    it('should return the correct icons for an expense report', () => {
        const report = {
            ...LHNTestUtils.getFakeReport([1], 0, true),
            type: CONST_1.default.REPORT.TYPE.EXPENSE,
            policyID: '1',
        };
        const policy = LHNTestUtils.getFakePolicy('1');
        // Verify report type conditions
        expect((0, ReportUtils_1.isExpenseReport)(report)).toBe(true);
        const icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS, null, '', -1, policy);
        expect(icons).toHaveLength(2);
        expect(icons.at(0)?.type).toBe(CONST_1.default.ICON_TYPE_AVATAR);
        expect(icons.at(1)?.type).toBe(CONST_1.default.ICON_TYPE_WORKSPACE);
    });
    it('should return the correct icons for an IOU report with one transaction', () => {
        const report = {
            ...LHNTestUtils.getFakeReport([1], 0, true),
            reportID: '1',
            type: CONST_1.default.REPORT.TYPE.IOU,
            ownerAccountID: 1,
            managerID: 2,
        };
        // Verify report type conditions
        expect((0, ReportUtils_1.isIOUReport)(report)).toBe(true);
        expect((0, ReportUtils_1.isMoneyRequestReport)(report)).toBe(true);
        const icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS);
        expect(icons).toHaveLength(1);
        expect(icons.at(0)?.name).toBe('Email One');
    });
    it('should return the correct icons for a Self DM', () => {
        const report = {
            ...LHNTestUtils.getFakeReport([currentUserAccountID], 0, true),
            chatType: CONST_1.default.REPORT.CHAT_TYPE.SELF_DM,
        };
        // Verify report type conditions
        expect((0, ReportUtils_1.isSelfDM)(report)).toBe(true);
        expect((0, ReportUtils_1.isChatReport)(report)).toBe(true);
        const icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS);
        expect(icons).toHaveLength(1);
        expect(icons.at(0)?.name).toBe('Email Five');
    });
    it('should return the correct icons for a system chat', () => {
        const report = {
            ...LHNTestUtils.getFakeReport([], 0, true),
            chatType: CONST_1.default.REPORT.CHAT_TYPE.SYSTEM,
        };
        const icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS);
        expect(icons).toHaveLength(1);
        expect(icons.at(0)?.id).toBe(CONST_1.default.ACCOUNT_ID.NOTIFICATIONS);
    });
    it('should return the correct icons for a group chat', () => {
        const report = {
            ...LHNTestUtils.getFakeReport([1, 2, 3], 0, true),
            chatType: CONST_1.default.REPORT.CHAT_TYPE.GROUP,
        };
        // Verify report type conditions
        expect((0, ReportUtils_1.isGroupChat)(report)).toBe(true);
        expect((0, ReportUtils_1.isChatReport)(report)).toBe(true);
        const icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS);
        expect(icons).toHaveLength(1);
    });
    it('should return the correct icons for a group chat without an avatar', () => {
        const report = {
            ...LHNTestUtils.getFakeReport([1, 2, 3], 0, true),
            chatType: CONST_1.default.REPORT.CHAT_TYPE.GROUP,
        };
        const icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS);
        expect(icons).toHaveLength(1);
    });
    it('should return the correct icons for a group chat with an avatar', () => {
        const report = {
            ...LHNTestUtils.getFakeReport([1, 2, 3], 0, true),
            chatType: CONST_1.default.REPORT.CHAT_TYPE.GROUP,
            avatarUrl: 'https://example.com/avatar.png',
        };
        const icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS);
        expect(icons).toHaveLength(1);
    });
    it('should return the correct icons for an invoice report', () => {
        const report = {
            ...LHNTestUtils.getFakeReport([], 0, true),
            type: CONST_1.default.REPORT.TYPE.INVOICE,
            chatReportID: '1',
            policyID: '1',
        };
        const policy = LHNTestUtils.getFakePolicy('1');
        // Verify report type conditions
        expect((0, ReportUtils_1.isInvoiceReport)(report)).toBe(true);
        const icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS, null, '', -1, policy);
        expect(icons).toHaveLength(2);
        expect(icons.at(0)?.type).toBe(CONST_1.default.ICON_TYPE_WORKSPACE);
        expect(icons.at(1)?.name).toBe('Email Three');
    });
    it('should return all participant icons for a one-on-one chat', () => {
        const report = {
            ...LHNTestUtils.getFakeReport([1], 0, true),
        };
        const icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS);
        expect(icons).toHaveLength(1);
        expect(icons.at(0)?.name).toBe('Email One');
    });
    it('should return all participant icons as a fallback', () => {
        const report = {
            ...LHNTestUtils.getFakeReport([1, 2, 3, 4], 0, true),
            type: undefined,
        };
        const icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS);
        expect(icons).toHaveLength(4);
    });
    it('should return the correct icons for a workspace thread', () => {
        const report = {
            ...LHNTestUtils.getFakeReport([1], 0, true),
            parentReportID: 'workspaceParent',
            parentReportActionID: '1',
            policyID: '1',
            type: CONST_1.default.REPORT.TYPE.CHAT,
            chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT,
        };
        const policy = LHNTestUtils.getFakePolicy('1');
        // Verify report type conditions
        expect((0, ReportUtils_1.isChatThread)(report)).toBe(true);
        expect((0, ReportUtils_1.isWorkspaceThread)(report)).toBe(true);
        const icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS, null, '', -1, policy);
        expect(icons).toHaveLength(2); // Actor + workspace icon
        expect(icons.at(0)?.type).toBe(CONST_1.default.ICON_TYPE_AVATAR);
        expect(icons.at(1)?.type).toBe(CONST_1.default.ICON_TYPE_WORKSPACE);
    });
    it('should return the correct icons for a workspace task report', () => {
        const report = {
            ...LHNTestUtils.getFakeReport([1], 0, true),
            type: CONST_1.default.REPORT.TYPE.TASK,
            ownerAccountID: 1,
            parentReportID: 'taskParent',
            policyID: '1',
        };
        const policy = LHNTestUtils.getFakePolicy('1');
        // Verify report type conditions
        expect((0, ReportUtils_1.isTaskReport)(report)).toBe(true);
        expect((0, ReportUtils_1.isWorkspaceTaskReport)(report)).toBe(true);
        const icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS, null, '', -1, policy);
        expect(icons).toHaveLength(2); // Owner + workspace icon
        expect(icons.at(0)?.type).toBe(CONST_1.default.ICON_TYPE_AVATAR);
        expect(icons.at(1)?.type).toBe(CONST_1.default.ICON_TYPE_WORKSPACE);
    });
    it('should return the correct icons for an admin room', () => {
        const report = {
            ...LHNTestUtils.getFakeReport([], 0, true),
            chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ADMINS,
            policyID: '1',
        };
        const policy = LHNTestUtils.getFakePolicy('1');
        // Verify report type conditions
        expect((0, ReportUtils_1.isAdminRoom)(report)).toBe(true);
        expect((0, ReportUtils_1.isChatRoom)(report)).toBe(true);
        const icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS, null, '', -1, policy);
        expect(icons).toHaveLength(1);
        expect(icons.at(0)?.type).toBe(CONST_1.default.ICON_TYPE_WORKSPACE);
    });
    it('should return the correct icons for an announce room', () => {
        const report = {
            ...LHNTestUtils.getFakeReport([], 0, true),
            chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ANNOUNCE,
            policyID: '1',
        };
        const policy = LHNTestUtils.getFakePolicy('1');
        // Verify report type conditions
        expect((0, ReportUtils_1.isAnnounceRoom)(report)).toBe(true);
        expect((0, ReportUtils_1.isChatRoom)(report)).toBe(true);
        const icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS, null, '', -1, policy);
        expect(icons).toHaveLength(1);
        expect(icons.at(0)?.type).toBe(CONST_1.default.ICON_TYPE_WORKSPACE);
    });
    it('should return the correct icons for an invoice room with individual receiver', () => {
        const report = {
            ...LHNTestUtils.getFakeReport([], 0, true),
            chatType: CONST_1.default.REPORT.CHAT_TYPE.INVOICE,
            policyID: '1',
            invoiceReceiver: {
                type: CONST_1.default.REPORT.INVOICE_RECEIVER_TYPE.INDIVIDUAL,
                accountID: 2,
            },
        };
        const policy = LHNTestUtils.getFakePolicy('1');
        // Verify report type conditions
        expect((0, ReportUtils_1.isInvoiceRoom)(report)).toBe(true);
        expect((0, ReportUtils_1.isIndividualInvoiceRoom)(report)).toBe(true);
        const icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS, null, '', -1, policy);
        expect(icons).toHaveLength(2); // Workspace + individual receiver
        expect(icons.at(0)?.type).toBe(CONST_1.default.ICON_TYPE_WORKSPACE);
        expect(icons.at(1)?.type).toBe(CONST_1.default.ICON_TYPE_AVATAR);
    });
    it('should return the correct icons for an invoice room with business receiver', () => {
        const receiverPolicy = LHNTestUtils.getFakePolicy('2', 'Receiver-Policy');
        const report = {
            ...LHNTestUtils.getFakeReport([], 0, true),
            chatType: CONST_1.default.REPORT.CHAT_TYPE.INVOICE,
            policyID: '1',
            invoiceReceiver: {
                type: CONST_1.default.REPORT.INVOICE_RECEIVER_TYPE.BUSINESS,
                policyID: '2',
            },
        };
        const policy = LHNTestUtils.getFakePolicy('1');
        const icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS, null, '', -1, policy, receiverPolicy);
        expect(icons).toHaveLength(2); // Workspace + receiver workspace
        expect(icons.at(0)?.type).toBe(CONST_1.default.ICON_TYPE_WORKSPACE);
        expect(icons.at(1)?.type).toBe(CONST_1.default.ICON_TYPE_WORKSPACE);
        expect(icons.at(1)?.name).toBe('Receiver-Policy');
    });
    it('should return the correct icons for a multi-transaction IOU report where current user is not manager', () => {
        const report = {
            ...LHNTestUtils.getFakeReport([1, 2], 0, true),
            reportID: 'multiTxn',
            chatReportID: 'chatReport',
            type: CONST_1.default.REPORT.TYPE.IOU,
            ownerAccountID: 1,
            managerID: 2, // Different from current user (5)
            // eslint-disable-next-line @typescript-eslint/naming-convention
            participants: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                '1': { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS },
                // eslint-disable-next-line @typescript-eslint/naming-convention
                '2': { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS },
            },
        };
        const reportActions = FAKE_REPORT_ACTIONS?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report?.reportID}`];
        const chatReport = FAKE_REPORTS?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${report?.chatReportID}`];
        // Verify report type conditions
        expect((0, ReportUtils_1.isIOUReport)(report)).toBe(true);
        expect((0, ReportUtils_1.isMoneyRequestReport)(report)).toBe(true);
        expect((0, ReportActionsUtils_1.getOneTransactionThreadReportID)(report, chatReport, reportActions)).toBeFalsy();
        const icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS);
        expect(icons).toHaveLength(2);
        expect(icons.at(0)?.name).toBe('Email\u0020One');
        expect(icons.at(1)?.name).toBe('Email\u0020Two');
    });
    it('should return the correct icons for a concierge chat', () => {
        const report = {
            ...LHNTestUtils.getFakeReport([CONST_1.default.ACCOUNT_ID.CONCIERGE], 0, true),
            participants: {
                [CONST_1.default.ACCOUNT_ID.CONCIERGE]: {
                    notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS,
                },
            },
        };
        const icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS);
        expect(icons).toHaveLength(1);
        expect(icons.at(0)?.id).toBe(CONST_1.default.ACCOUNT_ID.CONCIERGE);
    });
    it('should return the correct icons for an invoice report with individual receiver', () => {
        const report = {
            ...LHNTestUtils.getFakeReport([], 0, true),
            type: CONST_1.default.REPORT.TYPE.INVOICE,
            chatReportID: '1',
            policyID: '1',
        };
        // Verify report type conditions
        expect((0, ReportUtils_1.isInvoiceReport)(report)).toBe(true);
        const policy = LHNTestUtils.getFakePolicy('1');
        const icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS, null, '', -1, policy);
        expect(icons).toHaveLength(2);
        expect(icons.at(0)?.type).toBe(CONST_1.default.ICON_TYPE_WORKSPACE);
        expect(icons.at(1)?.name).toBe('Email Three');
    });
});
