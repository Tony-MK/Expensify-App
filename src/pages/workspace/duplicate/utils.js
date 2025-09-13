"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkspaceRules = getWorkspaceRules;
exports.getWorkflowRules = getWorkflowRules;
exports.getAllValidConnectedIntegration = getAllValidConnectedIntegration;
var PolicyUtils_1 = require("@libs/PolicyUtils");
var WorkspaceAutoReportingFrequencyPage_1 = require("@pages/workspace/workflows/WorkspaceAutoReportingFrequencyPage");
var connections_1 = require("@userActions/connections");
var CONST_1 = require("@src/CONST");
function getWorkspaceRules(policy, translate) {
    var workflowApprovalsUnavailable = (0, PolicyUtils_1.getWorkflowApprovalsUnavailable)(policy);
    var autoPayApprovedReportsUnavailable = !(policy === null || policy === void 0 ? void 0 : policy.areWorkflowsEnabled) || (policy === null || policy === void 0 ? void 0 : policy.reimbursementChoice) !== CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_YES || !(0, PolicyUtils_1.hasVBBA)(policy === null || policy === void 0 ? void 0 : policy.id);
    var total = [];
    if ((policy === null || policy === void 0 ? void 0 : policy.maxExpenseAmountNoReceipt) !== CONST_1.default.DISABLED_MAX_EXPENSE_VALUE) {
        total.push(translate('workspace.rules.individualExpenseRules.receiptRequiredAmount'));
    }
    if ((policy === null || policy === void 0 ? void 0 : policy.maxExpenseAmount) !== CONST_1.default.DISABLED_MAX_EXPENSE_VALUE) {
        total.push(translate('workspace.rules.individualExpenseRules.maxExpenseAmount'));
    }
    if ((policy === null || policy === void 0 ? void 0 : policy.maxExpenseAge) !== CONST_1.default.DISABLED_MAX_EXPENSE_VALUE) {
        total.push(translate('workspace.rules.individualExpenseRules.maxExpenseAge'));
    }
    if (policy === null || policy === void 0 ? void 0 : policy.defaultBillable) {
        total.push(translate('workspace.rules.individualExpenseRules.billable'));
    }
    if ((policy === null || policy === void 0 ? void 0 : policy.prohibitedExpenses) && Object.values(policy === null || policy === void 0 ? void 0 : policy.prohibitedExpenses).find(function (value) { return value; })) {
        total.push(translate('workspace.rules.individualExpenseRules.prohibitedExpenses'));
    }
    if (policy === null || policy === void 0 ? void 0 : policy.eReceipts) {
        total.push(translate('workspace.rules.individualExpenseRules.eReceipts'));
    }
    if (policy === null || policy === void 0 ? void 0 : policy.isAttendeeTrackingEnabled) {
        total.push(translate('workspace.rules.individualExpenseRules.attendeeTracking'));
    }
    if ((policy === null || policy === void 0 ? void 0 : policy.preventSelfApproval) && !workflowApprovalsUnavailable) {
        total.push(translate('workspace.rules.expenseReportRules.preventSelfApprovalsTitle'));
    }
    if ((policy === null || policy === void 0 ? void 0 : policy.shouldShowAutoApprovalOptions) && !workflowApprovalsUnavailable) {
        total.push(translate('workspace.rules.expenseReportRules.autoApproveCompliantReportsTitle'));
    }
    if ((policy === null || policy === void 0 ? void 0 : policy.shouldShowAutoReimbursementLimitOption) && !autoPayApprovedReportsUnavailable) {
        total.push(translate('workspace.rules.expenseReportRules.autoPayApprovedReportsTitle'));
    }
    return total.length > 0 ? total : null;
}
function getWorkflowRules(policy, translate) {
    var _a, _b, _c, _d, _e, _f;
    var total = [];
    var bankAccountID = ((_a = policy === null || policy === void 0 ? void 0 : policy.achAccount) !== null && _a !== void 0 ? _a : {}).bankAccountID;
    var hasDelayedSubmissionError = !!((_c = (_b = policy === null || policy === void 0 ? void 0 : policy.errorFields) === null || _b === void 0 ? void 0 : _b.autoReporting) !== null && _c !== void 0 ? _c : (_d = policy === null || policy === void 0 ? void 0 : policy.errorFields) === null || _d === void 0 ? void 0 : _d.autoReportingFrequency);
    var hasApprovalError = !!((_e = policy === null || policy === void 0 ? void 0 : policy.errorFields) === null || _e === void 0 ? void 0 : _e.approvalMode);
    var shouldShowBankAccount = !!bankAccountID && (policy === null || policy === void 0 ? void 0 : policy.reimbursementChoice) === CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_YES;
    if ((policy === null || policy === void 0 ? void 0 : policy.autoReportingFrequency) !== CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.INSTANT && !hasDelayedSubmissionError) {
        var title = (0, WorkspaceAutoReportingFrequencyPage_1.getAutoReportingFrequencyDisplayNames)(translate)[(_f = (0, PolicyUtils_1.getCorrectedAutoReportingFrequency)(policy)) !== null && _f !== void 0 ? _f : CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.WEEKLY];
        total.push("".concat(title, " ").concat(translate('workspace.duplicateWorkspace.delayedSubmission')));
    }
    if ([CONST_1.default.POLICY.APPROVAL_MODE.BASIC, CONST_1.default.POLICY.APPROVAL_MODE.ADVANCED].some(function (approvalMode) { return approvalMode === (policy === null || policy === void 0 ? void 0 : policy.approvalMode); }) && !hasApprovalError) {
        total.push(translate('common.approvals'));
    }
    if ((policy === null || policy === void 0 ? void 0 : policy.reimbursementChoice) !== CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_NO) {
        if (shouldShowBankAccount) {
            total.push("1 ".concat(translate('workspace.duplicateWorkspace.reimbursementAccount')));
        }
        else {
            total.push(translate('common.payments'));
        }
    }
    return total.length > 0 ? total : null;
}
function getAllValidConnectedIntegration(policy, accountingIntegrations) {
    return (accountingIntegrations !== null && accountingIntegrations !== void 0 ? accountingIntegrations : Object.values(CONST_1.default.POLICY.CONNECTIONS.NAME)).filter(function (integration) { var _a; return !!((_a = policy === null || policy === void 0 ? void 0 : policy.connections) === null || _a === void 0 ? void 0 : _a[integration]) && !(0, connections_1.isAuthenticationError)(policy, integration); });
}
