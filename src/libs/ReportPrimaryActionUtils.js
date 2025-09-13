"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReportPrimaryAction = getReportPrimaryAction;
exports.getTransactionThreadPrimaryAction = getTransactionThreadPrimaryAction;
exports.isAddExpenseAction = isAddExpenseAction;
exports.isPrimaryPayAction = isPrimaryPayAction;
exports.isExportAction = isExportAction;
exports.isMarkAsResolvedAction = isMarkAsResolvedAction;
exports.isMarkAsResolvedReportAction = isMarkAsResolvedReportAction;
exports.getAllExpensesToHoldIfApplicable = getAllExpensesToHoldIfApplicable;
exports.isReviewDuplicatesAction = isReviewDuplicatesAction;
const CONST_1 = require("@src/CONST");
const Member_1 = require("./actions/Policy/Member");
const Report_1 = require("./actions/Report");
const PolicyUtils_1 = require("./PolicyUtils");
const ReportActionsUtils_1 = require("./ReportActionsUtils");
const ReportUtils_1 = require("./ReportUtils");
const SessionUtils_1 = require("./SessionUtils");
const TransactionUtils_1 = require("./TransactionUtils");
function isAddExpenseAction(report, reportTransactions, isChatReportArchived) {
    if (isChatReportArchived) {
        return false;
    }
    const isExpenseReport = (0, ReportUtils_1.isExpenseReport)(report);
    const canAddTransaction = (0, ReportUtils_1.canAddTransaction)(report);
    return isExpenseReport && canAddTransaction && reportTransactions.length === 0;
}
function isSubmitAction(report, reportTransactions, policy, reportNameValuePairs, reportActions) {
    if ((0, ReportUtils_1.isArchivedReport)(reportNameValuePairs)) {
        return false;
    }
    const isExpenseReport = (0, ReportUtils_1.isExpenseReport)(report);
    const isReportSubmitter = (0, ReportUtils_1.isCurrentUserSubmitter)(report);
    const isOpenReport = (0, ReportUtils_1.isOpenReport)(report);
    const isManualSubmitEnabled = (0, PolicyUtils_1.getCorrectedAutoReportingFrequency)(policy) === CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.MANUAL;
    const transactionAreComplete = reportTransactions.every((transaction) => transaction.amount !== 0 || transaction.modifiedAmount !== 0);
    if (reportTransactions.length > 0 && reportTransactions.every((transaction) => (0, TransactionUtils_1.isPending)(transaction))) {
        return false;
    }
    const isAnyReceiptBeingScanned = reportTransactions?.some((transaction) => (0, TransactionUtils_1.isScanning)(transaction));
    const hasReportBeenRetracted = (0, ReportUtils_1.hasReportBeenReopened)(report, reportActions) || (0, ReportUtils_1.hasReportBeenRetracted)(report, reportActions);
    if (isAnyReceiptBeingScanned) {
        return false;
    }
    const submitToAccountID = (0, PolicyUtils_1.getSubmitToAccountID)(policy, report);
    if (submitToAccountID === report.ownerAccountID && policy?.preventSelfApproval) {
        return false;
    }
    const baseIsSubmit = isExpenseReport && isReportSubmitter && isOpenReport && reportTransactions.length !== 0 && transactionAreComplete;
    if (hasReportBeenRetracted && baseIsSubmit) {
        return true;
    }
    return isManualSubmitEnabled && baseIsSubmit;
}
function isApproveAction(report, reportTransactions, policy) {
    const isAnyReceiptBeingScanned = reportTransactions?.some((transaction) => (0, TransactionUtils_1.isScanning)(transaction));
    if (isAnyReceiptBeingScanned) {
        return false;
    }
    const currentUserAccountID = (0, Report_1.getCurrentUserAccountID)();
    const managerID = report?.managerID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const isCurrentUserManager = managerID === currentUserAccountID;
    if (!isCurrentUserManager) {
        return false;
    }
    const isExpenseReport = (0, ReportUtils_1.isExpenseReport)(report);
    const isApprovalEnabled = policy?.approvalMode && policy.approvalMode !== CONST_1.default.POLICY.APPROVAL_MODE.OPTIONAL;
    if (!isExpenseReport || !isApprovalEnabled || reportTransactions.length === 0) {
        return false;
    }
    if (reportTransactions.length > 0 && reportTransactions.every((transaction) => (0, TransactionUtils_1.isPending)(transaction))) {
        return false;
    }
    const isPreventSelfApprovalEnabled = policy?.preventSelfApproval;
    const isReportSubmitter = (0, ReportUtils_1.isCurrentUserSubmitter)(report);
    if (isPreventSelfApprovalEnabled && isReportSubmitter) {
        return false;
    }
    return (0, ReportUtils_1.isProcessingReport)(report);
}
function isPrimaryPayAction(report, policy, reportNameValuePairs, isChatReportArchived, invoiceReceiverPolicy) {
    if ((0, ReportUtils_1.isArchivedReport)(reportNameValuePairs) || isChatReportArchived) {
        return false;
    }
    const isExpenseReport = (0, ReportUtils_1.isExpenseReport)(report);
    const isReportPayer = (0, ReportUtils_1.isPayer)((0, SessionUtils_1.getSession)(), report, false, policy);
    const arePaymentsEnabled = (0, PolicyUtils_1.arePaymentsEnabled)(policy);
    const isReportApproved = (0, ReportUtils_1.isReportApproved)({ report });
    const isReportClosed = (0, ReportUtils_1.isClosedReport)(report);
    const isProcessingReport = (0, ReportUtils_1.isProcessingReport)(report);
    const isApprovalEnabled = policy ? policy.approvalMode && policy.approvalMode !== CONST_1.default.POLICY.APPROVAL_MODE.OPTIONAL : false;
    const isSubmittedWithoutApprovalsEnabled = !isApprovalEnabled && isProcessingReport;
    const isReportFinished = (isReportApproved && !report.isWaitingOnBankAccount) || isSubmittedWithoutApprovalsEnabled || isReportClosed;
    const { reimbursableSpend } = (0, ReportUtils_1.getMoneyRequestSpendBreakdown)(report);
    if (isReportPayer && isExpenseReport && arePaymentsEnabled && isReportFinished && reimbursableSpend > 0) {
        return true;
    }
    if (!isProcessingReport) {
        return false;
    }
    const isIOUReport = (0, ReportUtils_1.isIOUReport)(report);
    if (isIOUReport && isReportPayer && reimbursableSpend > 0) {
        return true;
    }
    const isInvoiceReport = (0, ReportUtils_1.isInvoiceReport)(report);
    if (!isInvoiceReport) {
        return false;
    }
    const parentReport = (0, ReportUtils_1.getParentReport)(report);
    if (parentReport?.invoiceReceiver?.type === CONST_1.default.REPORT.INVOICE_RECEIVER_TYPE.INDIVIDUAL && reimbursableSpend > 0) {
        return parentReport?.invoiceReceiver?.accountID === (0, Report_1.getCurrentUserAccountID)();
    }
    return invoiceReceiverPolicy?.role === CONST_1.default.POLICY.ROLE.ADMIN && reimbursableSpend > 0;
}
function isExportAction(report, policy, reportActions) {
    if (!policy) {
        return false;
    }
    const connectedIntegration = (0, PolicyUtils_1.getValidConnectedIntegration)(policy);
    const isInvoiceReport = (0, ReportUtils_1.isInvoiceReport)(report);
    if (!connectedIntegration || isInvoiceReport) {
        return false;
    }
    const isReportExporter = (0, PolicyUtils_1.isPreferredExporter)(policy);
    if (!isReportExporter) {
        return false;
    }
    const syncEnabled = (0, PolicyUtils_1.hasIntegrationAutoSync)(policy, connectedIntegration);
    const isExported = (0, ReportUtils_1.isExported)(reportActions);
    if (isExported) {
        return false;
    }
    const hasExportError = (0, ReportUtils_1.hasExportError)(reportActions);
    if (syncEnabled && !hasExportError) {
        return false;
    }
    if (report.isWaitingOnBankAccount) {
        return false;
    }
    const isReportReimbursed = (0, ReportUtils_1.isSettled)(report);
    const isReportApproved = (0, ReportUtils_1.isReportApproved)({ report });
    const isReportClosed = (0, ReportUtils_1.isClosedReport)(report);
    if (isReportApproved || isReportReimbursed || isReportClosed) {
        return true;
    }
    return false;
}
function isRemoveHoldAction(report, chatReport, reportTransactions) {
    const isReportOnHold = reportTransactions.some(TransactionUtils_1.isOnHold);
    if (!isReportOnHold) {
        return false;
    }
    const reportActions = (0, ReportActionsUtils_1.getAllReportActions)(report.reportID);
    const transactionThreadReportID = (0, ReportActionsUtils_1.getOneTransactionThreadReportID)(report, chatReport, reportActions);
    if (!transactionThreadReportID) {
        return false;
    }
    // Transaction is attached to expense report but hold action is attached to transaction thread report
    const isHolder = reportTransactions.some((transaction) => (0, ReportUtils_1.isHoldCreator)(transaction, transactionThreadReportID));
    return isHolder;
}
function isReviewDuplicatesAction(report, reportTransactions) {
    const hasDuplicates = reportTransactions.some((transaction) => (0, TransactionUtils_1.isDuplicate)(transaction));
    if (!hasDuplicates) {
        return false;
    }
    const isReportApprover = (0, ReportUtils_1.isReportManager)(report);
    const isReportSubmitter = (0, ReportUtils_1.isCurrentUserSubmitter)(report);
    const isProcessingReport = (0, ReportUtils_1.isProcessingReport)(report);
    const isReportOpen = (0, ReportUtils_1.isOpenReport)(report);
    const isSubmitterOrApprover = isReportSubmitter || isReportApprover;
    const isReportActive = isReportOpen || isProcessingReport;
    if (isSubmitterOrApprover && isReportActive) {
        return true;
    }
    return false;
}
function isMarkAsCashAction(report, reportTransactions, violations, policy) {
    const isOneExpenseReport = (0, ReportUtils_1.isExpenseReport)(report) && reportTransactions.length === 1;
    if (!isOneExpenseReport) {
        return false;
    }
    const transactionIDs = reportTransactions.map((t) => t.transactionID);
    const hasAllPendingRTERViolations = (0, TransactionUtils_1.allHavePendingRTERViolation)(reportTransactions, violations);
    if (hasAllPendingRTERViolations) {
        return true;
    }
    const isReportSubmitter = (0, ReportUtils_1.isCurrentUserSubmitter)(report);
    const isReportApprover = (0, Member_1.isApprover)(policy, (0, Report_1.getCurrentUserAccountID)());
    const isAdmin = policy?.role === CONST_1.default.POLICY.ROLE.ADMIN;
    const shouldShowBrokenConnectionViolation = (0, TransactionUtils_1.shouldShowBrokenConnectionViolationForMultipleTransactions)(transactionIDs, report, policy, violations);
    const userControlsReport = isReportSubmitter || isReportApprover || isAdmin;
    return userControlsReport && shouldShowBrokenConnectionViolation;
}
function isMarkAsResolvedReportAction(report, chatReport, reportTransactions, violations, policy, reportActions) {
    if (!report || !reportTransactions || !violations) {
        return false;
    }
    const transactionThreadReportID = (0, ReportActionsUtils_1.getOneTransactionThreadReportID)(report, chatReport, reportActions);
    const isOneExpenseReport = reportTransactions.length === 1;
    const transaction = reportTransactions.at(0);
    if ((!!reportActions && !transactionThreadReportID) || !isOneExpenseReport || !transaction) {
        return false;
    }
    const isReportSubmitter = (0, ReportUtils_1.isCurrentUserSubmitter)(report);
    const isAdmin = (0, PolicyUtils_1.isPolicyAdmin)(policy);
    if (!isReportSubmitter && !isAdmin) {
        return false;
    }
    return (0, TransactionUtils_1.getTransactionViolations)(transaction, violations)?.some((violation) => violation.name === CONST_1.default.VIOLATIONS.AUTO_REPORTED_REJECTED_EXPENSE);
}
function isMarkAsResolvedAction(report, violations, policy) {
    if (!report || !violations) {
        return false;
    }
    const isReportSubmitter = (0, ReportUtils_1.isCurrentUserSubmitter)(report);
    const isAdmin = (0, PolicyUtils_1.isPolicyAdmin)(policy);
    if (!isReportSubmitter && !isAdmin) {
        return false;
    }
    return violations?.some((violation) => violation.name === CONST_1.default.VIOLATIONS.AUTO_REPORTED_REJECTED_EXPENSE);
}
function getAllExpensesToHoldIfApplicable(report, reportActions) {
    if (!report || !reportActions || !(0, ReportUtils_1.hasOnlyHeldExpenses)(report?.reportID)) {
        return [];
    }
    return reportActions?.filter((action) => (0, ReportActionsUtils_1.isMoneyRequestAction)(action) && action.childType === CONST_1.default.REPORT.TYPE.CHAT && (0, ReportUtils_1.canHoldUnholdReportAction)(action).canUnholdRequest);
}
function getReportPrimaryAction(params) {
    const { report, reportTransactions, violations, policy, reportNameValuePairs, reportActions, isChatReportArchived, chatReport, invoiceReceiverPolicy, isPaidAnimationRunning, isSubmittingAnimationRunning, } = params;
    if (isPaidAnimationRunning) {
        return CONST_1.default.REPORT.PRIMARY_ACTIONS.PAY;
    }
    if (isSubmittingAnimationRunning) {
        return CONST_1.default.REPORT.PRIMARY_ACTIONS.SUBMIT;
    }
    if (!report) {
        return '';
    }
    const isPayActionWithAllExpensesHeld = isPrimaryPayAction(report, policy, reportNameValuePairs, isChatReportArchived) && (0, ReportUtils_1.hasOnlyHeldExpenses)(report?.reportID);
    if (isMarkAsResolvedReportAction(report, chatReport, reportTransactions, violations, policy, reportActions)) {
        return CONST_1.default.REPORT.PRIMARY_ACTIONS.MARK_AS_RESOLVED;
    }
    if (isAddExpenseAction(report, reportTransactions, isChatReportArchived)) {
        return CONST_1.default.REPORT.PRIMARY_ACTIONS.ADD_EXPENSE;
    }
    if (isMarkAsCashAction(report, reportTransactions, violations, policy)) {
        return CONST_1.default.REPORT.PRIMARY_ACTIONS.MARK_AS_CASH;
    }
    if (isReviewDuplicatesAction(report, reportTransactions)) {
        return CONST_1.default.REPORT.PRIMARY_ACTIONS.REVIEW_DUPLICATES;
    }
    if (isApproveAction(report, reportTransactions, policy)) {
        return CONST_1.default.REPORT.PRIMARY_ACTIONS.APPROVE;
    }
    if (isRemoveHoldAction(report, chatReport, reportTransactions) || isPayActionWithAllExpensesHeld) {
        return CONST_1.default.REPORT.PRIMARY_ACTIONS.REMOVE_HOLD;
    }
    if (isSubmitAction(report, reportTransactions, policy, reportNameValuePairs, reportActions)) {
        return CONST_1.default.REPORT.PRIMARY_ACTIONS.SUBMIT;
    }
    if (isPrimaryPayAction(report, policy, reportNameValuePairs, isChatReportArchived, invoiceReceiverPolicy)) {
        return CONST_1.default.REPORT.PRIMARY_ACTIONS.PAY;
    }
    if (isExportAction(report, policy, reportActions)) {
        return CONST_1.default.REPORT.PRIMARY_ACTIONS.EXPORT_TO_ACCOUNTING;
    }
    if (getAllExpensesToHoldIfApplicable(report, reportActions).length) {
        return CONST_1.default.REPORT.PRIMARY_ACTIONS.REMOVE_HOLD;
    }
    return '';
}
function isMarkAsCashActionForTransaction(parentReport, violations, policy) {
    const hasPendingRTERViolation = (0, TransactionUtils_1.hasPendingRTERViolation)(violations);
    if (hasPendingRTERViolation) {
        return true;
    }
    const shouldShowBrokenConnectionViolation = (0, TransactionUtils_1.shouldShowBrokenConnectionViolation)(parentReport, policy, violations);
    if (!shouldShowBrokenConnectionViolation) {
        return false;
    }
    const isReportSubmitter = (0, ReportUtils_1.isCurrentUserSubmitter)(parentReport);
    const isReportApprover = (0, Member_1.isApprover)(policy, (0, Report_1.getCurrentUserAccountID)());
    const isAdmin = policy?.role === CONST_1.default.POLICY.ROLE.ADMIN;
    return isReportSubmitter || isReportApprover || isAdmin;
}
function getTransactionThreadPrimaryAction(transactionThreadReport, parentReport, reportTransaction, violations, policy) {
    if (isMarkAsResolvedAction(parentReport, violations, policy)) {
        return CONST_1.default.REPORT.TRANSACTION_PRIMARY_ACTIONS.MARK_AS_RESOLVED;
    }
    if ((0, ReportUtils_1.isHoldCreator)(reportTransaction, transactionThreadReport.reportID)) {
        return CONST_1.default.REPORT.TRANSACTION_PRIMARY_ACTIONS.REMOVE_HOLD;
    }
    if (isReviewDuplicatesAction(parentReport, [reportTransaction])) {
        return CONST_1.default.REPORT.TRANSACTION_PRIMARY_ACTIONS.REVIEW_DUPLICATES;
    }
    if (isMarkAsCashActionForTransaction(parentReport, violations, policy)) {
        return CONST_1.default.REPORT.TRANSACTION_PRIMARY_ACTIONS.MARK_AS_CASH;
    }
    return '';
}
