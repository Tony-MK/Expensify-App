"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkspaceRules = getWorkspaceRules;
exports.getWorkflowRules = getWorkflowRules;
exports.getAllValidConnectedIntegration = getAllValidConnectedIntegration;
const PolicyUtils_1 = require("@libs/PolicyUtils");
const WorkspaceAutoReportingFrequencyPage_1 = require("@pages/workspace/workflows/WorkspaceAutoReportingFrequencyPage");
const connections_1 = require("@userActions/connections");
const CONST_1 = require("@src/CONST");
function getWorkspaceRules(policy, translate) {
    const workflowApprovalsUnavailable = (0, PolicyUtils_1.getWorkflowApprovalsUnavailable)(policy);
    const autoPayApprovedReportsUnavailable = !policy?.areWorkflowsEnabled || policy?.reimbursementChoice !== CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_YES || !(0, PolicyUtils_1.hasVBBA)(policy?.id);
    const total = [];
    if (policy?.maxExpenseAmountNoReceipt !== CONST_1.default.DISABLED_MAX_EXPENSE_VALUE) {
        total.push(translate('workspace.rules.individualExpenseRules.receiptRequiredAmount'));
    }
    if (policy?.maxExpenseAmount !== CONST_1.default.DISABLED_MAX_EXPENSE_VALUE) {
        total.push(translate('workspace.rules.individualExpenseRules.maxExpenseAmount'));
    }
    if (policy?.maxExpenseAge !== CONST_1.default.DISABLED_MAX_EXPENSE_VALUE) {
        total.push(translate('workspace.rules.individualExpenseRules.maxExpenseAge'));
    }
    if (policy?.defaultBillable) {
        total.push(translate('workspace.rules.individualExpenseRules.billable'));
    }
    if (policy?.prohibitedExpenses && Object.values(policy?.prohibitedExpenses).find((value) => value)) {
        total.push(translate('workspace.rules.individualExpenseRules.prohibitedExpenses'));
    }
    if (policy?.eReceipts) {
        total.push(translate('workspace.rules.individualExpenseRules.eReceipts'));
    }
    if (policy?.isAttendeeTrackingEnabled) {
        total.push(translate('workspace.rules.individualExpenseRules.attendeeTracking'));
    }
    if (policy?.preventSelfApproval && !workflowApprovalsUnavailable) {
        total.push(translate('workspace.rules.expenseReportRules.preventSelfApprovalsTitle'));
    }
    if (policy?.shouldShowAutoApprovalOptions && !workflowApprovalsUnavailable) {
        total.push(translate('workspace.rules.expenseReportRules.autoApproveCompliantReportsTitle'));
    }
    if (policy?.shouldShowAutoReimbursementLimitOption && !autoPayApprovedReportsUnavailable) {
        total.push(translate('workspace.rules.expenseReportRules.autoPayApprovedReportsTitle'));
    }
    return total.length > 0 ? total : null;
}
function getWorkflowRules(policy, translate) {
    const total = [];
    const { bankAccountID } = policy?.achAccount ?? {};
    const hasDelayedSubmissionError = !!(policy?.errorFields?.autoReporting ?? policy?.errorFields?.autoReportingFrequency);
    const hasApprovalError = !!policy?.errorFields?.approvalMode;
    const shouldShowBankAccount = !!bankAccountID && policy?.reimbursementChoice === CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_YES;
    if (policy?.autoReportingFrequency !== CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.INSTANT && !hasDelayedSubmissionError) {
        const title = (0, WorkspaceAutoReportingFrequencyPage_1.getAutoReportingFrequencyDisplayNames)(translate)[(0, PolicyUtils_1.getCorrectedAutoReportingFrequency)(policy) ?? CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.WEEKLY];
        total.push(`${title} ${translate('workspace.duplicateWorkspace.delayedSubmission')}`);
    }
    if ([CONST_1.default.POLICY.APPROVAL_MODE.BASIC, CONST_1.default.POLICY.APPROVAL_MODE.ADVANCED].some((approvalMode) => approvalMode === policy?.approvalMode) && !hasApprovalError) {
        total.push(translate('common.approvals'));
    }
    if (policy?.reimbursementChoice !== CONST_1.default.POLICY.REIMBURSEMENT_CHOICES.REIMBURSEMENT_NO) {
        if (shouldShowBankAccount) {
            total.push(`1 ${translate('workspace.duplicateWorkspace.reimbursementAccount')}`);
        }
        else {
            total.push(translate('common.payments'));
        }
    }
    return total.length > 0 ? total : null;
}
function getAllValidConnectedIntegration(policy, accountingIntegrations) {
    return (accountingIntegrations ?? Object.values(CONST_1.default.POLICY.CONNECTIONS.NAME)).filter((integration) => !!policy?.connections?.[integration] && !(0, connections_1.isAuthenticationError)(policy, integration));
}
