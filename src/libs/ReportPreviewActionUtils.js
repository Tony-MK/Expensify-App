"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canReview = canReview;
exports.getReportPreviewAction = getReportPreviewAction;
const CONST_1 = require("@src/CONST");
const Report_1 = require("./actions/Report");
const PolicyUtils_1 = require("./PolicyUtils");
const ReportPrimaryActionUtils_1 = require("./ReportPrimaryActionUtils");
const ReportUtils_1 = require("./ReportUtils");
const SessionUtils_1 = require("./SessionUtils");
const TransactionUtils_1 = require("./TransactionUtils");
function canSubmit(report, violations, isReportArchived, policy, transactions) {
    if (isReportArchived) {
        return false;
    }
    const isExpense = (0, ReportUtils_1.isExpenseReport)(report);
    const isSubmitter = (0, ReportUtils_1.isCurrentUserSubmitter)(report);
    const isOpen = (0, ReportUtils_1.isOpenReport)(report);
    const isManager = report.managerID === (0, Report_1.getCurrentUserAccountID)();
    const isAdmin = policy?.role === CONST_1.default.POLICY.ROLE.ADMIN;
    const hasBeenRetracted = (0, ReportUtils_1.hasReportBeenReopened)(report) || (0, ReportUtils_1.hasReportBeenRetracted)(report);
    const isManualSubmitEnabled = (0, PolicyUtils_1.getCorrectedAutoReportingFrequency)(policy) === CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.MANUAL;
    if (!!transactions && transactions?.length > 0 && transactions.every((transaction) => (0, TransactionUtils_1.isPending)(transaction))) {
        return false;
    }
    const hasAnyViolations = (0, ReportUtils_1.hasMissingSmartscanFields)(report.reportID, transactions) || (0, ReportUtils_1.hasAnyViolations)(report.reportID, violations);
    const isAnyReceiptBeingScanned = transactions?.some((transaction) => (0, TransactionUtils_1.isScanning)(transaction));
    const submitToAccountID = (0, PolicyUtils_1.getSubmitToAccountID)(policy, report);
    if (submitToAccountID === report.ownerAccountID && policy?.preventSelfApproval) {
        return false;
    }
    const baseCanSubmit = isExpense && (isSubmitter || isManager || isAdmin) && isOpen && !hasAnyViolations && !isAnyReceiptBeingScanned && !!transactions && transactions.length > 0;
    // If a report has been retracted, we allow submission regardless of the auto reporting frequency.
    if (baseCanSubmit && hasBeenRetracted) {
        return true;
    }
    return baseCanSubmit && isManualSubmitEnabled;
}
function canApprove(report, violations, policy, transactions, shouldConsiderViolations = true) {
    const currentUserID = (0, Report_1.getCurrentUserAccountID)();
    const isExpense = (0, ReportUtils_1.isExpenseReport)(report);
    const isProcessing = (0, ReportUtils_1.isProcessingReport)(report);
    const isApprovalEnabled = policy ? policy.approvalMode && policy.approvalMode !== CONST_1.default.POLICY.APPROVAL_MODE.OPTIONAL : false;
    const managerID = report?.managerID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const isCurrentUserManager = managerID === currentUserID;
    const hasAnyViolations = (0, ReportUtils_1.hasMissingSmartscanFields)(report.reportID, transactions) || (0, ReportUtils_1.hasAnyViolations)(report.reportID, violations);
    const reportTransactions = transactions ?? (0, ReportUtils_1.getReportTransactions)(report?.reportID);
    const isAnyReceiptBeingScanned = transactions?.some((transaction) => (0, TransactionUtils_1.isScanning)(transaction));
    if (isAnyReceiptBeingScanned) {
        return false;
    }
    if (!!transactions && transactions?.length > 0 && transactions.every((transaction) => (0, TransactionUtils_1.isPending)(transaction))) {
        return false;
    }
    const isPreventSelfApprovalEnabled = policy?.preventSelfApproval;
    const isReportSubmitter = (0, ReportUtils_1.isCurrentUserSubmitter)(report);
    if (isPreventSelfApprovalEnabled && isReportSubmitter) {
        return false;
    }
    return isExpense && isProcessing && !!isApprovalEnabled && (!hasAnyViolations || !shouldConsiderViolations) && reportTransactions.length > 0 && isCurrentUserManager;
}
function canPay(report, violations, isReportArchived, policy, invoiceReceiverPolicy, shouldConsiderViolations = true) {
    if (isReportArchived) {
        return false;
    }
    const isReportPayer = (0, ReportUtils_1.isPayer)((0, SessionUtils_1.getSession)(), report, false, policy);
    const isExpense = (0, ReportUtils_1.isExpenseReport)(report);
    const isPaymentsEnabled = (0, PolicyUtils_1.arePaymentsEnabled)(policy);
    const isProcessing = (0, ReportUtils_1.isProcessingReport)(report);
    const isApprovalEnabled = policy ? policy.approvalMode && policy.approvalMode !== CONST_1.default.POLICY.APPROVAL_MODE.OPTIONAL : false;
    const isSubmittedWithoutApprovalsEnabled = !isApprovalEnabled && isProcessing;
    const isApproved = (0, ReportUtils_1.isReportApproved)({ report }) || isSubmittedWithoutApprovalsEnabled;
    const isClosed = (0, ReportUtils_1.isClosedReport)(report);
    const isReportFinished = (isApproved || isClosed) && !report.isWaitingOnBankAccount;
    const { reimbursableSpend } = (0, ReportUtils_1.getMoneyRequestSpendBreakdown)(report);
    const isReimbursed = (0, ReportUtils_1.isSettled)(report);
    const hasAnyViolations = (0, ReportUtils_1.hasAnyViolations)(report.reportID, violations);
    if (isExpense && isReportPayer && isPaymentsEnabled && isReportFinished && (!hasAnyViolations || !shouldConsiderViolations) && reimbursableSpend > 0) {
        return true;
    }
    if (!isProcessing) {
        return false;
    }
    const isIOU = (0, ReportUtils_1.isIOUReport)(report);
    if (isIOU && isReportPayer && !isReimbursed && reimbursableSpend > 0) {
        return true;
    }
    const isInvoice = (0, ReportUtils_1.isInvoiceReport)(report);
    if (!isInvoice) {
        return false;
    }
    const parentReport = (0, ReportUtils_1.getParentReport)(report);
    if (parentReport?.invoiceReceiver?.type === CONST_1.default.REPORT.INVOICE_RECEIVER_TYPE.INDIVIDUAL && reimbursableSpend > 0) {
        return parentReport?.invoiceReceiver?.accountID === (0, Report_1.getCurrentUserAccountID)();
    }
    return invoiceReceiverPolicy?.role === CONST_1.default.POLICY.ROLE.ADMIN && reimbursableSpend > 0;
}
function canExport(report, violations, policy) {
    const isExpense = (0, ReportUtils_1.isExpenseReport)(report);
    const isExporter = policy ? (0, PolicyUtils_1.isPreferredExporter)(policy) : false;
    const isReimbursed = (0, ReportUtils_1.isSettled)(report);
    const isClosed = (0, ReportUtils_1.isClosedReport)(report);
    const isApproved = (0, ReportUtils_1.isReportApproved)({ report });
    const connectedIntegration = (0, PolicyUtils_1.getValidConnectedIntegration)(policy);
    const syncEnabled = (0, PolicyUtils_1.hasIntegrationAutoSync)(policy, connectedIntegration);
    const hasAnyViolations = (0, ReportUtils_1.hasAnyViolations)(report.reportID, violations);
    if (!connectedIntegration || !isExpense || !isExporter) {
        return false;
    }
    const isExported = report.isExportedToIntegration ?? false;
    if (isExported) {
        return false;
    }
    const hasExportError = report.hasExportError ?? false;
    if (syncEnabled && !hasExportError) {
        return false;
    }
    if (report.isWaitingOnBankAccount) {
        return false;
    }
    return (isApproved || isReimbursed || isClosed) && !hasAnyViolations;
}
function canReview(report, violations, isReportArchived, policy, transactions) {
    const hasAnyViolations = (0, ReportUtils_1.hasMissingSmartscanFields)(report.reportID, transactions) || (0, ReportUtils_1.hasAnyViolations)(report.reportID, violations);
    const isSubmitter = (0, ReportUtils_1.isCurrentUserSubmitter)(report);
    const isOpen = (0, ReportUtils_1.isOpenExpenseReport)(report);
    const isReimbursed = (0, ReportUtils_1.isSettled)(report);
    if (!hasAnyViolations ||
        isReimbursed ||
        (!(isSubmitter && isOpen && policy?.areWorkflowsEnabled) &&
            !canApprove(report, violations, policy, transactions, false) &&
            !canPay(report, violations, isReportArchived, policy, policy, false))) {
        return false;
    }
    // We handle RTER violations independently because those are not configured via policy workflows
    const isAdmin = (0, PolicyUtils_1.isPolicyAdmin)(policy);
    const transactionIDs = transactions?.map((transaction) => transaction.transactionID) ?? [];
    const hasAllPendingRTERViolations = (0, TransactionUtils_1.allHavePendingRTERViolation)(transactions, violations);
    const shouldShowBrokenConnectionViolation = (0, TransactionUtils_1.shouldShowBrokenConnectionViolationForMultipleTransactions)(transactionIDs, report, policy, violations);
    if (hasAllPendingRTERViolations || (shouldShowBrokenConnectionViolation && (!isAdmin || isSubmitter) && !(0, ReportUtils_1.isReportApproved)({ report }) && !(0, ReportUtils_1.isReportManuallyReimbursed)(report))) {
        return true;
    }
    if (policy) {
        return !!policy.areWorkflowsEnabled || isSubmitter;
    }
    return true;
}
function getReportPreviewAction(violations, isReportArchived, report, policy, transactions, invoiceReceiverPolicy, isPaidAnimationRunning, isSubmittingAnimationRunning) {
    if (!report) {
        return CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.VIEW;
    }
    if (isPaidAnimationRunning) {
        return CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.PAY;
    }
    if (isSubmittingAnimationRunning) {
        return CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.SUBMIT;
    }
    if ((0, ReportPrimaryActionUtils_1.isAddExpenseAction)(report, transactions ?? [], isReportArchived)) {
        return CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.ADD_EXPENSE;
    }
    if (canSubmit(report, violations, isReportArchived, policy, transactions)) {
        return CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.SUBMIT;
    }
    if (canApprove(report, violations, policy, transactions)) {
        return CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.APPROVE;
    }
    if (canPay(report, violations, isReportArchived, policy, invoiceReceiverPolicy)) {
        return CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.PAY;
    }
    if (canExport(report, violations, policy)) {
        return CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.EXPORT_TO_ACCOUNTING;
    }
    if (canReview(report, violations, isReportArchived, policy, transactions)) {
        return CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.REVIEW;
    }
    return CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.VIEW;
}
