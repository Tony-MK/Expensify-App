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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_onyx_1 = require("react-native-onyx");
var ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var actions_1 = require("../../__mocks__/reportData/actions");
var LHNTestUtils = require("../utils/LHNTestUtils");
var FAKE_PERSONAL_DETAILS = LHNTestUtils.fakePersonalDetails;
/* eslint-disable @typescript-eslint/naming-convention */
var FAKE_REPORT_ACTIONS = (_a = {},
    _a["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS, "1")] = {
        '1': __assign(__assign({}, actions_1.actionR14932), { actorAccountID: 2 }),
    },
    _a["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS, "2")] = {
        '2': __assign(__assign({}, actions_1.actionR98765), { actorAccountID: 1 }),
    },
    _a["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS, "3")] = {
        '2': __assign(__assign({}, actions_1.actionR98765), { actorAccountID: 1 }),
    },
    // For workspace thread test - parent report actions
    _a["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS, "workspaceParent")] = {
        '1': __assign(__assign({}, actions_1.actionR14932), { actorAccountID: 2, actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT }),
    },
    // For multi-transaction IOU test - multiple transactions
    _a["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS, "multiTxn")] = {
        '1': __assign(__assign({}, actions_1.actionR14932), { actorAccountID: 1 }),
        '2': __assign(__assign({}, actions_1.actionR98765), { actorAccountID: 1 }),
    },
    _a);
/* eslint-enable @typescript-eslint/naming-convention */
var FAKE_REPORTS = (_b = {},
    _b["".concat(ONYXKEYS_1.default.COLLECTION.REPORT, "1")] = __assign(__assign({}, LHNTestUtils.getFakeReport([1, 2], 0, true)), { invoiceReceiver: {
            type: CONST_1.default.REPORT.INVOICE_RECEIVER_TYPE.INDIVIDUAL,
            accountID: 3,
        } }),
    // This is the parent report for the expense request test.
    // It MUST have type: 'expense' for the isExpenseRequest() check to pass.
    _b["".concat(ONYXKEYS_1.default.COLLECTION.REPORT, "2")] = __assign(__assign({}, LHNTestUtils.getFakeReport([1], 0, true)), { reportID: '2', type: CONST_1.default.REPORT.TYPE.EXPENSE }),
    // This is the parent report for the expense request test.
    // It MUST have type: 'expense' for the isExpenseRequest() check to pass.
    _b["".concat(ONYXKEYS_1.default.COLLECTION.REPORT, "3")] = __assign(__assign({}, LHNTestUtils.getFakeReport([1], 0, true)), { reportID: '3', parentReportID: '2', parentReportActionID: '2', type: CONST_1.default.REPORT.TYPE.EXPENSE }),
    // Parent workspace chat for workspace thread test
    _b["".concat(ONYXKEYS_1.default.COLLECTION.REPORT, "workspaceParent")] = __assign(__assign({}, LHNTestUtils.getFakeReport([1], 0, true)), { reportID: 'workspaceParent', chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT, policyID: '1' }),
    // Parent policy expense chat for workspace task test
    _b["".concat(ONYXKEYS_1.default.COLLECTION.REPORT, "taskParent")] = __assign(__assign({}, LHNTestUtils.getFakeReport([1], 0, true)), { reportID: 'taskParent', chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT, policyID: '1' }),
    // Chat report for multi-transaction IOU test
    _b["".concat(ONYXKEYS_1.default.COLLECTION.REPORT, "chatReport")] = __assign(__assign({}, LHNTestUtils.getFakeReport([1, 2], 0, true)), { reportID: 'chatReport' }),
    _b);
var FAKE_POLICIES = (_c = {},
    _c["".concat(ONYXKEYS_1.default.COLLECTION.POLICY, "1")] = LHNTestUtils.getFakePolicy('1'),
    _c);
var currentUserAccountID = 5;
beforeAll(function () {
    var _a;
    var _b;
    react_native_onyx_1.default.init({
        keys: ONYXKEYS_1.default,
        initialKeyStates: __assign(__assign(__assign((_a = {}, _a[ONYXKEYS_1.default.SESSION] = { email: (_b = FAKE_PERSONAL_DETAILS[currentUserAccountID]) === null || _b === void 0 ? void 0 : _b.login, accountID: currentUserAccountID }, _a[ONYXKEYS_1.default.PERSONAL_DETAILS_LIST] = FAKE_PERSONAL_DETAILS, _a), FAKE_REPORT_ACTIONS), FAKE_REPORTS), FAKE_POLICIES),
    });
    // @ts-expect-error Until we add NVP_PRIVATE_DOMAINS to ONYXKEYS, we need to mock it here
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    react_native_onyx_1.default.connect({ key: ONYXKEYS_1.default.NVP_PRIVATE_DOMAINS, callback: function () { } });
});
describe('getIcons', function () {
    it('should return a fallback icon if the report is empty', function () {
        var report = {};
        var icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS);
        expect(icons).toHaveLength(1);
    });
    it('should return the correct icons for an expense request', function () {
        var _a;
        var report = __assign(__assign({}, LHNTestUtils.getFakeReport([1], 0, true)), { parentReportID: '3', parentReportActionID: '2', type: CONST_1.default.REPORT.TYPE.IOU });
        var policy = LHNTestUtils.getFakePolicy('1');
        // Verify report type conditions
        expect((0, ReportUtils_1.isExpenseRequest)(report)).toBe(true);
        expect((0, ReportUtils_1.isThread)(report)).toBe(true);
        var icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS, null, '', -1, policy);
        expect(icons).toHaveLength(2);
        expect((_a = icons.at(0)) === null || _a === void 0 ? void 0 : _a.name).toBe('Email One');
    });
    it('should return the correct icons for archived non expense request/report', function () {
        var _a, _b;
        var report = __assign(__assign({}, LHNTestUtils.getFakeReport([1], 0, true)), { type: CONST_1.default.REPORT.CHAT_TYPE.INVOICE });
        var policy = LHNTestUtils.getFakePolicy('1');
        // Verify report type conditions
        expect((0, ReportUtils_1.isArchivedNonExpenseReport)(report, true)).toBe(true);
        var icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS, null, '', -1, policy, undefined, true);
        expect(icons).toHaveLength(1);
        expect((_a = icons.at(0)) === null || _a === void 0 ? void 0 : _a.name).toBe(policy.name);
        expect((_b = icons.at(0)) === null || _b === void 0 ? void 0 : _b.type).toBe('workspace');
    });
    it('should return the correct icons for a chat thread', function () {
        var _a;
        var report = __assign(__assign({}, LHNTestUtils.getFakeReport([1], 0, true)), { parentReportID: '1', parentReportActionID: '1' });
        // Verify report type conditions
        expect((0, ReportUtils_1.isChatThread)(report)).toBe(true);
        expect((0, ReportUtils_1.isThread)(report)).toBe(true);
        var icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS);
        expect(icons).toHaveLength(1);
        expect((_a = icons.at(0)) === null || _a === void 0 ? void 0 : _a.name).toBe('Email\u00A0Two');
    });
    it('should return the correct icons for a task report', function () {
        var _a;
        var report = __assign(__assign({}, LHNTestUtils.getFakeReport([1], 0, true)), { type: CONST_1.default.REPORT.TYPE.TASK, ownerAccountID: 1 });
        // Verify report type conditions
        expect((0, ReportUtils_1.isTaskReport)(report)).toBe(true);
        var icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS);
        expect(icons).toHaveLength(1);
        expect((_a = icons.at(0)) === null || _a === void 0 ? void 0 : _a.name).toBe('Email One');
    });
    it('should return the correct icons for a domain room', function () {
        var _a;
        var report = __assign(__assign({}, LHNTestUtils.getFakeReport([], 0, true)), { chatType: CONST_1.default.REPORT.CHAT_TYPE.DOMAIN_ALL, reportName: '#domain-test' });
        var icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS);
        expect(icons).toHaveLength(1);
        expect((_a = icons.at(0)) === null || _a === void 0 ? void 0 : _a.name).toBe('domain-test');
    });
    it('should return the correct icons for a policy room', function () {
        var _a;
        var report = __assign(__assign({}, LHNTestUtils.getFakeReport([], 0, true)), { chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ROOM, policyID: '1' });
        var policy = LHNTestUtils.getFakePolicy('1');
        var icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS, null, '', -1, policy);
        expect(icons).toHaveLength(1);
        expect((_a = icons.at(0)) === null || _a === void 0 ? void 0 : _a.name).toBe('Workspace-Test-001');
    });
    it('should return the correct icons for a policy expense chat', function () {
        var _a, _b;
        var report = __assign(__assign({}, LHNTestUtils.getFakeReport([1], 0, true)), { chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT, policyID: '1' });
        var policy = LHNTestUtils.getFakePolicy('1');
        // Verify report type conditions
        expect((0, ReportUtils_1.isPolicyExpenseChat)(report)).toBe(true);
        expect((0, ReportUtils_1.isChatReport)(report)).toBe(true);
        var icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS, null, '', -1, policy);
        expect(icons).toHaveLength(2);
        expect((_a = icons.at(0)) === null || _a === void 0 ? void 0 : _a.type).toBe(CONST_1.default.ICON_TYPE_WORKSPACE);
        expect((_b = icons.at(1)) === null || _b === void 0 ? void 0 : _b.type).toBe(CONST_1.default.ICON_TYPE_AVATAR);
    });
    it('should return the correct icons for an expense report', function () {
        var _a, _b;
        var report = __assign(__assign({}, LHNTestUtils.getFakeReport([1], 0, true)), { type: CONST_1.default.REPORT.TYPE.EXPENSE, policyID: '1' });
        var policy = LHNTestUtils.getFakePolicy('1');
        // Verify report type conditions
        expect((0, ReportUtils_1.isExpenseReport)(report)).toBe(true);
        var icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS, null, '', -1, policy);
        expect(icons).toHaveLength(2);
        expect((_a = icons.at(0)) === null || _a === void 0 ? void 0 : _a.type).toBe(CONST_1.default.ICON_TYPE_AVATAR);
        expect((_b = icons.at(1)) === null || _b === void 0 ? void 0 : _b.type).toBe(CONST_1.default.ICON_TYPE_WORKSPACE);
    });
    it('should return the correct icons for an IOU report with one transaction', function () {
        var _a;
        var report = __assign(__assign({}, LHNTestUtils.getFakeReport([1], 0, true)), { reportID: '1', type: CONST_1.default.REPORT.TYPE.IOU, ownerAccountID: 1, managerID: 2 });
        // Verify report type conditions
        expect((0, ReportUtils_1.isIOUReport)(report)).toBe(true);
        expect((0, ReportUtils_1.isMoneyRequestReport)(report)).toBe(true);
        var icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS);
        expect(icons).toHaveLength(1);
        expect((_a = icons.at(0)) === null || _a === void 0 ? void 0 : _a.name).toBe('Email One');
    });
    it('should return the correct icons for a Self DM', function () {
        var _a;
        var report = __assign(__assign({}, LHNTestUtils.getFakeReport([currentUserAccountID], 0, true)), { chatType: CONST_1.default.REPORT.CHAT_TYPE.SELF_DM });
        // Verify report type conditions
        expect((0, ReportUtils_1.isSelfDM)(report)).toBe(true);
        expect((0, ReportUtils_1.isChatReport)(report)).toBe(true);
        var icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS);
        expect(icons).toHaveLength(1);
        expect((_a = icons.at(0)) === null || _a === void 0 ? void 0 : _a.name).toBe('Email Five');
    });
    it('should return the correct icons for a system chat', function () {
        var _a;
        var report = __assign(__assign({}, LHNTestUtils.getFakeReport([], 0, true)), { chatType: CONST_1.default.REPORT.CHAT_TYPE.SYSTEM });
        var icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS);
        expect(icons).toHaveLength(1);
        expect((_a = icons.at(0)) === null || _a === void 0 ? void 0 : _a.id).toBe(CONST_1.default.ACCOUNT_ID.NOTIFICATIONS);
    });
    it('should return the correct icons for a group chat', function () {
        var report = __assign(__assign({}, LHNTestUtils.getFakeReport([1, 2, 3], 0, true)), { chatType: CONST_1.default.REPORT.CHAT_TYPE.GROUP });
        // Verify report type conditions
        expect((0, ReportUtils_1.isGroupChat)(report)).toBe(true);
        expect((0, ReportUtils_1.isChatReport)(report)).toBe(true);
        var icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS);
        expect(icons).toHaveLength(1);
    });
    it('should return the correct icons for a group chat without an avatar', function () {
        var report = __assign(__assign({}, LHNTestUtils.getFakeReport([1, 2, 3], 0, true)), { chatType: CONST_1.default.REPORT.CHAT_TYPE.GROUP });
        var icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS);
        expect(icons).toHaveLength(1);
    });
    it('should return the correct icons for a group chat with an avatar', function () {
        var report = __assign(__assign({}, LHNTestUtils.getFakeReport([1, 2, 3], 0, true)), { chatType: CONST_1.default.REPORT.CHAT_TYPE.GROUP, avatarUrl: 'https://example.com/avatar.png' });
        var icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS);
        expect(icons).toHaveLength(1);
    });
    it('should return the correct icons for an invoice report', function () {
        var _a, _b;
        var report = __assign(__assign({}, LHNTestUtils.getFakeReport([], 0, true)), { type: CONST_1.default.REPORT.TYPE.INVOICE, chatReportID: '1', policyID: '1' });
        var policy = LHNTestUtils.getFakePolicy('1');
        // Verify report type conditions
        expect((0, ReportUtils_1.isInvoiceReport)(report)).toBe(true);
        var icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS, null, '', -1, policy);
        expect(icons).toHaveLength(2);
        expect((_a = icons.at(0)) === null || _a === void 0 ? void 0 : _a.type).toBe(CONST_1.default.ICON_TYPE_WORKSPACE);
        expect((_b = icons.at(1)) === null || _b === void 0 ? void 0 : _b.name).toBe('Email Three');
    });
    it('should return all participant icons for a one-on-one chat', function () {
        var _a;
        var report = __assign({}, LHNTestUtils.getFakeReport([1], 0, true));
        var icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS);
        expect(icons).toHaveLength(1);
        expect((_a = icons.at(0)) === null || _a === void 0 ? void 0 : _a.name).toBe('Email One');
    });
    it('should return all participant icons as a fallback', function () {
        var report = __assign(__assign({}, LHNTestUtils.getFakeReport([1, 2, 3, 4], 0, true)), { type: undefined });
        var icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS);
        expect(icons).toHaveLength(4);
    });
    it('should return the correct icons for a workspace thread', function () {
        var _a, _b;
        var report = __assign(__assign({}, LHNTestUtils.getFakeReport([1], 0, true)), { parentReportID: 'workspaceParent', parentReportActionID: '1', policyID: '1', type: CONST_1.default.REPORT.TYPE.CHAT, chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_EXPENSE_CHAT });
        var policy = LHNTestUtils.getFakePolicy('1');
        // Verify report type conditions
        expect((0, ReportUtils_1.isChatThread)(report)).toBe(true);
        expect((0, ReportUtils_1.isWorkspaceThread)(report)).toBe(true);
        var icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS, null, '', -1, policy);
        expect(icons).toHaveLength(2); // Actor + workspace icon
        expect((_a = icons.at(0)) === null || _a === void 0 ? void 0 : _a.type).toBe(CONST_1.default.ICON_TYPE_AVATAR);
        expect((_b = icons.at(1)) === null || _b === void 0 ? void 0 : _b.type).toBe(CONST_1.default.ICON_TYPE_WORKSPACE);
    });
    it('should return the correct icons for a workspace task report', function () {
        var _a, _b;
        var report = __assign(__assign({}, LHNTestUtils.getFakeReport([1], 0, true)), { type: CONST_1.default.REPORT.TYPE.TASK, ownerAccountID: 1, parentReportID: 'taskParent', policyID: '1' });
        var policy = LHNTestUtils.getFakePolicy('1');
        // Verify report type conditions
        expect((0, ReportUtils_1.isTaskReport)(report)).toBe(true);
        expect((0, ReportUtils_1.isWorkspaceTaskReport)(report)).toBe(true);
        var icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS, null, '', -1, policy);
        expect(icons).toHaveLength(2); // Owner + workspace icon
        expect((_a = icons.at(0)) === null || _a === void 0 ? void 0 : _a.type).toBe(CONST_1.default.ICON_TYPE_AVATAR);
        expect((_b = icons.at(1)) === null || _b === void 0 ? void 0 : _b.type).toBe(CONST_1.default.ICON_TYPE_WORKSPACE);
    });
    it('should return the correct icons for an admin room', function () {
        var _a;
        var report = __assign(__assign({}, LHNTestUtils.getFakeReport([], 0, true)), { chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ADMINS, policyID: '1' });
        var policy = LHNTestUtils.getFakePolicy('1');
        // Verify report type conditions
        expect((0, ReportUtils_1.isAdminRoom)(report)).toBe(true);
        expect((0, ReportUtils_1.isChatRoom)(report)).toBe(true);
        var icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS, null, '', -1, policy);
        expect(icons).toHaveLength(1);
        expect((_a = icons.at(0)) === null || _a === void 0 ? void 0 : _a.type).toBe(CONST_1.default.ICON_TYPE_WORKSPACE);
    });
    it('should return the correct icons for an announce room', function () {
        var _a;
        var report = __assign(__assign({}, LHNTestUtils.getFakeReport([], 0, true)), { chatType: CONST_1.default.REPORT.CHAT_TYPE.POLICY_ANNOUNCE, policyID: '1' });
        var policy = LHNTestUtils.getFakePolicy('1');
        // Verify report type conditions
        expect((0, ReportUtils_1.isAnnounceRoom)(report)).toBe(true);
        expect((0, ReportUtils_1.isChatRoom)(report)).toBe(true);
        var icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS, null, '', -1, policy);
        expect(icons).toHaveLength(1);
        expect((_a = icons.at(0)) === null || _a === void 0 ? void 0 : _a.type).toBe(CONST_1.default.ICON_TYPE_WORKSPACE);
    });
    it('should return the correct icons for an invoice room with individual receiver', function () {
        var _a, _b;
        var report = __assign(__assign({}, LHNTestUtils.getFakeReport([], 0, true)), { chatType: CONST_1.default.REPORT.CHAT_TYPE.INVOICE, policyID: '1', invoiceReceiver: {
                type: CONST_1.default.REPORT.INVOICE_RECEIVER_TYPE.INDIVIDUAL,
                accountID: 2,
            } });
        var policy = LHNTestUtils.getFakePolicy('1');
        // Verify report type conditions
        expect((0, ReportUtils_1.isInvoiceRoom)(report)).toBe(true);
        expect((0, ReportUtils_1.isIndividualInvoiceRoom)(report)).toBe(true);
        var icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS, null, '', -1, policy);
        expect(icons).toHaveLength(2); // Workspace + individual receiver
        expect((_a = icons.at(0)) === null || _a === void 0 ? void 0 : _a.type).toBe(CONST_1.default.ICON_TYPE_WORKSPACE);
        expect((_b = icons.at(1)) === null || _b === void 0 ? void 0 : _b.type).toBe(CONST_1.default.ICON_TYPE_AVATAR);
    });
    it('should return the correct icons for an invoice room with business receiver', function () {
        var _a, _b, _c;
        var receiverPolicy = LHNTestUtils.getFakePolicy('2', 'Receiver-Policy');
        var report = __assign(__assign({}, LHNTestUtils.getFakeReport([], 0, true)), { chatType: CONST_1.default.REPORT.CHAT_TYPE.INVOICE, policyID: '1', invoiceReceiver: {
                type: CONST_1.default.REPORT.INVOICE_RECEIVER_TYPE.BUSINESS,
                policyID: '2',
            } });
        var policy = LHNTestUtils.getFakePolicy('1');
        var icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS, null, '', -1, policy, receiverPolicy);
        expect(icons).toHaveLength(2); // Workspace + receiver workspace
        expect((_a = icons.at(0)) === null || _a === void 0 ? void 0 : _a.type).toBe(CONST_1.default.ICON_TYPE_WORKSPACE);
        expect((_b = icons.at(1)) === null || _b === void 0 ? void 0 : _b.type).toBe(CONST_1.default.ICON_TYPE_WORKSPACE);
        expect((_c = icons.at(1)) === null || _c === void 0 ? void 0 : _c.name).toBe('Receiver-Policy');
    });
    it('should return the correct icons for a multi-transaction IOU report where current user is not manager', function () {
        var _a, _b;
        var report = __assign(__assign({}, LHNTestUtils.getFakeReport([1, 2], 0, true)), { reportID: 'multiTxn', chatReportID: 'chatReport', type: CONST_1.default.REPORT.TYPE.IOU, ownerAccountID: 1, managerID: 2, 
            // eslint-disable-next-line @typescript-eslint/naming-convention
            participants: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                '1': { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS },
                // eslint-disable-next-line @typescript-eslint/naming-convention
                '2': { notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS },
            } });
        var reportActions = FAKE_REPORT_ACTIONS === null || FAKE_REPORT_ACTIONS === void 0 ? void 0 : FAKE_REPORT_ACTIONS["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(report === null || report === void 0 ? void 0 : report.reportID)];
        var chatReport = FAKE_REPORTS === null || FAKE_REPORTS === void 0 ? void 0 : FAKE_REPORTS["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(report === null || report === void 0 ? void 0 : report.chatReportID)];
        // Verify report type conditions
        expect((0, ReportUtils_1.isIOUReport)(report)).toBe(true);
        expect((0, ReportUtils_1.isMoneyRequestReport)(report)).toBe(true);
        expect((0, ReportActionsUtils_1.getOneTransactionThreadReportID)(report, chatReport, reportActions)).toBeFalsy();
        var icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS);
        expect(icons).toHaveLength(2);
        expect((_a = icons.at(0)) === null || _a === void 0 ? void 0 : _a.name).toBe('Email\u0020One');
        expect((_b = icons.at(1)) === null || _b === void 0 ? void 0 : _b.name).toBe('Email\u0020Two');
    });
    it('should return the correct icons for a concierge chat', function () {
        var _a;
        var _b;
        var report = __assign(__assign({}, LHNTestUtils.getFakeReport([CONST_1.default.ACCOUNT_ID.CONCIERGE], 0, true)), { participants: (_a = {},
                _a[CONST_1.default.ACCOUNT_ID.CONCIERGE] = {
                    notificationPreference: CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.ALWAYS,
                },
                _a) });
        var icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS);
        expect(icons).toHaveLength(1);
        expect((_b = icons.at(0)) === null || _b === void 0 ? void 0 : _b.id).toBe(CONST_1.default.ACCOUNT_ID.CONCIERGE);
    });
    it('should return the correct icons for an invoice report with individual receiver', function () {
        var _a, _b;
        var report = __assign(__assign({}, LHNTestUtils.getFakeReport([], 0, true)), { type: CONST_1.default.REPORT.TYPE.INVOICE, chatReportID: '1', policyID: '1' });
        // Verify report type conditions
        expect((0, ReportUtils_1.isInvoiceReport)(report)).toBe(true);
        var policy = LHNTestUtils.getFakePolicy('1');
        var icons = (0, ReportUtils_1.getIcons)(report, FAKE_PERSONAL_DETAILS, null, '', -1, policy);
        expect(icons).toHaveLength(2);
        expect((_a = icons.at(0)) === null || _a === void 0 ? void 0 : _a.type).toBe(CONST_1.default.ICON_TYPE_WORKSPACE);
        expect((_b = icons.at(1)) === null || _b === void 0 ? void 0 : _b.name).toBe('Email Three');
    });
});
