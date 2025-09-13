"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecondaryReportActions = getSecondaryReportActions;
exports.getSecondaryTransactionThreadActions = getSecondaryTransactionThreadActions;
exports.isDeleteAction = isDeleteAction;
exports.isMergeAction = isMergeAction;
exports.getSecondaryExportReportActions = getSecondaryExportReportActions;
exports.isSplitAction = isSplitAction;
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const Member_1 = require("./actions/Policy/Member");
const Report_1 = require("./actions/Report");
const PolicyUtils_1 = require("./PolicyUtils");
const ReportActionsUtils_1 = require("./ReportActionsUtils");
const ReportPrimaryActionUtils_1 = require("./ReportPrimaryActionUtils");
const ReportUtils_1 = require("./ReportUtils");
const SessionUtils_1 = require("./SessionUtils");
const TransactionUtils_1 = require("./TransactionUtils");
function isAddExpenseAction(report, reportTransactions, isReportArchived = false) {
    const isReportSubmitter = (0, ReportUtils_1.isCurrentUserSubmitter)(report);
    if (!isReportSubmitter || reportTransactions.length === 0) {
        return false;
    }
    return (0, ReportUtils_1.canAddTransaction)(report, isReportArchived);
}
function isSplitAction(report, reportTransactions, policy) {
    if (Number(reportTransactions?.length) !== 1) {
        return false;
    }
    const reportTransaction = reportTransactions.at(0);
    const isScanning = (0, TransactionUtils_1.hasReceipt)(reportTransaction) && (0, TransactionUtils_1.isReceiptBeingScanned)(reportTransaction);
    if ((0, TransactionUtils_1.isPending)(reportTransaction) || isScanning || !!reportTransaction?.errors) {
        return false;
    }
    const { amount } = (0, ReportUtils_1.getTransactionDetails)(reportTransaction) ?? {};
    if (!amount) {
        return false;
    }
    const { isExpenseSplit, isBillSplit } = (0, TransactionUtils_1.getOriginalTransactionWithSplitInfo)(reportTransaction);
    if (isExpenseSplit || isBillSplit) {
        return false;
    }
    if (!(0, ReportUtils_1.isExpenseReport)(report)) {
        return false;
    }
    if (report.stateNum && report.stateNum >= CONST_1.default.REPORT.STATE_NUM.APPROVED) {
        return false;
    }
    if ((0, ReportUtils_1.hasOnlyNonReimbursableTransactions)(report.reportID) && (0, PolicyUtils_1.isSubmitAndClose)(policy) && (0, PolicyUtils_1.isInstantSubmitEnabled)(policy)) {
        return false;
    }
    const isSubmitter = (0, ReportUtils_1.isCurrentUserSubmitter)(report);
    const isAdmin = policy?.role === CONST_1.default.POLICY.ROLE.ADMIN;
    const isManager = (report.managerID ?? CONST_1.default.DEFAULT_NUMBER_ID) === (0, Report_1.getCurrentUserAccountID)();
    const isOpenReport = (0, ReportUtils_1.isOpenReport)(report);
    const isPolicyExpenseChat = !!policy?.isPolicyExpenseChatEnabled;
    const currentUserEmail = (0, Report_1.getCurrentUserEmail)();
    const userIsPolicyMember = (0, PolicyUtils_1.isPolicyMember)(policy, currentUserEmail);
    if (!(userIsPolicyMember && isPolicyExpenseChat)) {
        return false;
    }
    if (isOpenReport) {
        return isSubmitter || isAdmin;
    }
    return isSubmitter || isAdmin || isManager;
}
function isSubmitAction(report, reportTransactions, policy, reportNameValuePairs, reportActions, isChatReportArchived = false, primaryAction) {
    if ((0, ReportUtils_1.isArchivedReport)(reportNameValuePairs) || isChatReportArchived) {
        return false;
    }
    const transactionAreComplete = reportTransactions.every((transaction) => transaction.amount !== 0 || transaction.modifiedAmount !== 0);
    if (!transactionAreComplete) {
        return false;
    }
    if (reportTransactions.length > 0 && reportTransactions.every((transaction) => (0, TransactionUtils_1.isPending)(transaction))) {
        return false;
    }
    const isExpenseReport = (0, ReportUtils_1.isExpenseReport)(report);
    if (!isExpenseReport || report?.total === 0) {
        return false;
    }
    const isReportSubmitter = (0, ReportUtils_1.isCurrentUserSubmitter)(report);
    const isAdmin = policy?.role === CONST_1.default.POLICY.ROLE.ADMIN;
    const isManager = report.managerID === (0, Report_1.getCurrentUserAccountID)();
    if (!isReportSubmitter && !isAdmin && !isManager) {
        return false;
    }
    const isOpenReport = (0, ReportUtils_1.isOpenReport)(report);
    if (!isOpenReport) {
        return false;
    }
    const submitToAccountID = (0, PolicyUtils_1.getSubmitToAccountID)(policy, report);
    if (submitToAccountID === report.ownerAccountID && policy?.preventSelfApproval) {
        return false;
    }
    const hasReportBeenRetracted = (0, ReportUtils_1.hasReportBeenReopened)(report, reportActions) || (0, ReportUtils_1.hasReportBeenRetracted)(report, reportActions);
    if (hasReportBeenRetracted && isReportSubmitter) {
        return false;
    }
    if (isAdmin || isManager) {
        return true;
    }
    const autoReportingFrequency = (0, PolicyUtils_1.getCorrectedAutoReportingFrequency)(policy);
    const isScheduledSubmitEnabled = policy?.harvesting?.enabled && autoReportingFrequency !== CONST_1.default.POLICY.AUTO_REPORTING_FREQUENCIES.MANUAL;
    return !!isScheduledSubmitEnabled || primaryAction !== CONST_1.default.REPORT.SECONDARY_ACTIONS.SUBMIT;
}
function isApproveAction(report, reportTransactions, violations, policy) {
    const isAnyReceiptBeingScanned = reportTransactions?.some((transaction) => (0, TransactionUtils_1.isReceiptBeingScanned)(transaction));
    if (isAnyReceiptBeingScanned) {
        return false;
    }
    const currentUserAccountID = (0, Report_1.getCurrentUserAccountID)();
    const managerID = report?.managerID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const isCurrentUserManager = managerID === currentUserAccountID;
    if (!isCurrentUserManager) {
        return false;
    }
    const isProcessingReport = (0, ReportUtils_1.isProcessingReport)(report);
    if (!isProcessingReport) {
        return false;
    }
    const isPreventSelfApprovalEnabled = policy?.preventSelfApproval;
    const isReportSubmitter = (0, ReportUtils_1.isCurrentUserSubmitter)(report);
    if (isPreventSelfApprovalEnabled && isReportSubmitter) {
        return false;
    }
    const isExpenseReport = (0, ReportUtils_1.isExpenseReport)(report);
    const reportHasDuplicatedTransactions = reportTransactions.some((transaction) => (0, TransactionUtils_1.isDuplicate)(transaction));
    if (isExpenseReport && isProcessingReport && reportHasDuplicatedTransactions) {
        return true;
    }
    if (reportTransactions.length > 0 && reportTransactions.every((transaction) => (0, TransactionUtils_1.isPending)(transaction))) {
        return false;
    }
    const transactionIDs = reportTransactions.map((t) => t.transactionID);
    const hasAllPendingRTERViolations = (0, TransactionUtils_1.allHavePendingRTERViolation)(reportTransactions, violations);
    if (hasAllPendingRTERViolations) {
        return true;
    }
    const isAdmin = policy?.role === CONST_1.default.POLICY.ROLE.ADMIN;
    const shouldShowBrokenConnectionViolation = (0, TransactionUtils_1.shouldShowBrokenConnectionViolationForMultipleTransactions)(transactionIDs, report, policy, violations);
    const isReportApprover = (0, Member_1.isApprover)(policy, currentUserAccountID);
    const userControlsReport = isReportApprover || isAdmin;
    return userControlsReport && shouldShowBrokenConnectionViolation;
}
function isUnapproveAction(report, policy) {
    const isExpenseReport = (0, ReportUtils_1.isExpenseReport)(report);
    const isReportApprover = (0, Member_1.isApprover)(policy, (0, Report_1.getCurrentUserAccountID)());
    const isReportApproved = (0, ReportUtils_1.isReportApproved)({ report });
    const isReportSettled = (0, ReportUtils_1.isSettled)(report);
    const isPaymentProcessing = report.isWaitingOnBankAccount && report.statusNum === CONST_1.default.REPORT.STATUS_NUM.APPROVED;
    const isAdmin = policy?.role === CONST_1.default.POLICY.ROLE.ADMIN;
    const isManager = report.managerID === (0, Report_1.getCurrentUserAccountID)();
    if (isReportSettled || !isExpenseReport || !isReportApproved || isPaymentProcessing) {
        return false;
    }
    if (report.statusNum === CONST_1.default.REPORT.STATUS_NUM.APPROVED) {
        return isManager || isAdmin;
    }
    return isReportApprover;
}
function isCancelPaymentAction(report, reportTransactions, policy) {
    const isExpenseReport = (0, ReportUtils_1.isExpenseReport)(report);
    if (!isExpenseReport) {
        return false;
    }
    const isAdmin = policy?.role === CONST_1.default.POLICY.ROLE.ADMIN;
    const isPayer = (0, ReportUtils_1.isPayer)((0, SessionUtils_1.getSession)(), report, false, policy);
    if (!isAdmin || !isPayer) {
        return false;
    }
    const isReportPaidElsewhere = report.stateNum === CONST_1.default.REPORT.STATE_NUM.APPROVED && report.statusNum === CONST_1.default.REPORT.STATUS_NUM.REIMBURSED;
    if (isReportPaidElsewhere) {
        return true;
    }
    const isPaymentProcessing = !!report.isWaitingOnBankAccount && report.statusNum === CONST_1.default.REPORT.STATUS_NUM.APPROVED;
    const payActions = reportTransactions.reduce((acc, transaction) => {
        const action = (0, ReportActionsUtils_1.getIOUActionForReportID)(report.reportID, transaction.transactionID);
        if (action && (0, ReportActionsUtils_1.isPayAction)(action)) {
            acc.push(action);
        }
        return acc;
    }, []);
    const hasDailyNachaCutoffPassed = payActions.some((action) => {
        const now = new Date();
        const paymentDatetime = new Date(action.created);
        const nowUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));
        const cutoffTimeUTC = new Date(Date.UTC(paymentDatetime.getUTCFullYear(), paymentDatetime.getUTCMonth(), paymentDatetime.getUTCDate(), 23, 45, 0));
        return nowUTC.getTime() < cutoffTimeUTC.getTime();
    });
    return isPaymentProcessing && !hasDailyNachaCutoffPassed;
}
function isExportAction(report, policy) {
    if (!policy) {
        return false;
    }
    const hasAccountingConnection = !!(0, PolicyUtils_1.getValidConnectedIntegration)(policy);
    if (!hasAccountingConnection) {
        return false;
    }
    const isInvoiceReport = (0, ReportUtils_1.isInvoiceReport)(report);
    // We don't allow export to accounting for invoice reports in OD so we want to align with that here.
    if (isInvoiceReport) {
        return false;
    }
    const isExpenseReport = (0, ReportUtils_1.isExpenseReport)(report);
    if (!isExpenseReport) {
        return false;
    }
    const isReportApproved = (0, ReportUtils_1.isReportApproved)({ report });
    const isReportPayer = (0, ReportUtils_1.isPayer)((0, SessionUtils_1.getSession)(), report, false, policy);
    const arePaymentsEnabled = (0, PolicyUtils_1.arePaymentsEnabled)(policy);
    const isReportClosed = (0, ReportUtils_1.isClosedReport)(report);
    const isReportSettled = (0, ReportUtils_1.isSettled)(report);
    if (isReportPayer && arePaymentsEnabled && (isReportApproved || isReportClosed || isReportSettled)) {
        return true;
    }
    const isAdmin = policy?.role === CONST_1.default.POLICY.ROLE.ADMIN;
    const isReportReimbursed = report.statusNum === CONST_1.default.REPORT.STATUS_NUM.REIMBURSED;
    const connectedIntegration = (0, PolicyUtils_1.getConnectedIntegration)(policy);
    const syncEnabled = (0, PolicyUtils_1.hasIntegrationAutoSync)(policy, connectedIntegration);
    const isReportFinished = isReportApproved || isReportReimbursed || isReportClosed;
    return isAdmin && isReportFinished && syncEnabled;
}
function isMarkAsExportedAction(report, policy) {
    if (!policy) {
        return false;
    }
    const hasAccountingConnection = !!(0, PolicyUtils_1.getValidConnectedIntegration)(policy);
    if (!hasAccountingConnection) {
        return false;
    }
    const isInvoiceReport = (0, ReportUtils_1.isInvoiceReport)(report);
    const isReportSender = (0, ReportUtils_1.isCurrentUserSubmitter)(report);
    if (isInvoiceReport && isReportSender) {
        return true;
    }
    const isExpenseReport = (0, ReportUtils_1.isExpenseReport)(report);
    if (!isExpenseReport) {
        return false;
    }
    const isReportPayer = (0, ReportUtils_1.isPayer)((0, SessionUtils_1.getSession)(), report, false, policy);
    const arePaymentsEnabled = (0, PolicyUtils_1.arePaymentsEnabled)(policy);
    const isReportApproved = (0, ReportUtils_1.isReportApproved)({ report });
    const isReportClosed = (0, ReportUtils_1.isClosedReport)(report);
    const isReportClosedOrApproved = isReportClosed || isReportApproved;
    if (isReportPayer && arePaymentsEnabled && isReportClosedOrApproved) {
        return true;
    }
    const isReportReimbursed = (0, ReportUtils_1.isSettled)(report);
    const connectedIntegration = (0, PolicyUtils_1.getConnectedIntegration)(policy);
    const syncEnabled = (0, PolicyUtils_1.hasIntegrationAutoSync)(policy, connectedIntegration);
    const isReportFinished = isReportClosedOrApproved || isReportReimbursed;
    if (!isReportFinished) {
        return false;
    }
    const isAdmin = policy?.role === CONST_1.default.POLICY.ROLE.ADMIN;
    const isExporter = (0, PolicyUtils_1.isPreferredExporter)(policy);
    return (isAdmin && syncEnabled) || (isExporter && !syncEnabled);
}
function isHoldAction(report, chatReport, reportTransactions, reportActions) {
    const transactionThreadReportID = (0, ReportActionsUtils_1.getOneTransactionThreadReportID)(report, chatReport, reportActions);
    const isOneExpenseReport = reportTransactions.length === 1;
    const transaction = reportTransactions.at(0);
    if ((!!reportActions && !transactionThreadReportID) || !isOneExpenseReport || !transaction) {
        return false;
    }
    return !!reportActions && isHoldActionForTransaction(report, transaction, reportActions);
}
function isHoldActionForTransaction(report, reportTransaction, reportActions) {
    const isExpenseReport = (0, ReportUtils_1.isExpenseReport)(report);
    const isIOUReport = (0, ReportUtils_1.isIOUReport)(report);
    const iouOrExpenseReport = isExpenseReport || isIOUReport;
    const action = (0, ReportActionsUtils_1.getIOUActionForTransactionID)(reportActions, reportTransaction.transactionID);
    const { canHoldRequest } = (0, ReportUtils_1.canHoldUnholdReportAction)(action);
    if (!iouOrExpenseReport || !canHoldRequest) {
        return false;
    }
    const isReportOnHold = (0, TransactionUtils_1.isOnHold)(reportTransaction);
    if (isReportOnHold) {
        return false;
    }
    const isOpenReport = (0, ReportUtils_1.isOpenReport)(report);
    const isSubmitter = (0, ReportUtils_1.isCurrentUserSubmitter)(report);
    const isReportManager = (0, ReportUtils_1.isReportManager)(report);
    if (isOpenReport && (isSubmitter || isReportManager)) {
        return true;
    }
    const isProcessingReport = (0, ReportUtils_1.isProcessingReport)(report);
    return isProcessingReport;
}
function isChangeWorkspaceAction(report, policies, reportActions) {
    const availablePolicies = Object.values(policies ?? {}).filter((newPolicy) => (0, ReportUtils_1.isWorkspaceEligibleForReportChange)(newPolicy, report, policies));
    let hasAvailablePolicies = availablePolicies.length > 1;
    if (!hasAvailablePolicies && availablePolicies.length === 1) {
        hasAvailablePolicies = !report.policyID || report.policyID !== availablePolicies?.at(0)?.id;
    }
    const reportPolicy = policies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${report.policyID}`];
    return hasAvailablePolicies && (0, ReportUtils_1.canEditReportPolicy)(report, reportPolicy) && !(0, ReportUtils_1.isExported)(reportActions);
}
function isDeleteAction(report, reportTransactions, reportActions, policy) {
    const isExpenseReport = (0, ReportUtils_1.isExpenseReport)(report);
    const isIOUReport = (0, ReportUtils_1.isIOUReport)(report);
    const isUnreported = (0, ReportUtils_1.isSelfDM)(report);
    const transaction = reportTransactions.at(0);
    const transactionID = transaction?.transactionID;
    const isOwner = transactionID ? (0, ReportActionsUtils_1.getIOUActionForTransactionID)(reportActions, transactionID)?.actorAccountID === (0, Report_1.getCurrentUserAccountID)() : false;
    const isReportOpenOrProcessing = (0, ReportUtils_1.isOpenReport)(report) || (0, ReportUtils_1.isProcessingReport)(report);
    const isSingleTransaction = reportTransactions.length === 1;
    const isInvoiceReport = (0, ReportUtils_1.isInvoiceReport)(report);
    if (reportTransactions.length > 0 && reportTransactions.every((t) => (0, TransactionUtils_1.isDemoTransaction)(t))) {
        return true;
    }
    if (isUnreported) {
        return isOwner;
    }
    if (isInvoiceReport) {
        return report?.ownerAccountID === (0, Report_1.getCurrentUserAccountID)() && isReportOpenOrProcessing && policy?.approvalMode !== CONST_1.default.POLICY.APPROVAL_MODE.OPTIONAL;
    }
    // Users cannot delete a report in the unreported or IOU cases, but they can delete individual transactions.
    // So we check if the reportTransactions length is 1 which means they're viewing a single transaction and thus can delete it.
    if (isIOUReport) {
        return isSingleTransaction && isOwner && isReportOpenOrProcessing;
    }
    if (isExpenseReport) {
        const isCardTransactionWithCorporateLiability = isSingleTransaction && (0, TransactionUtils_1.isCardTransaction)(transaction) && transaction?.comment?.liabilityType === CONST_1.default.TRANSACTION.LIABILITY_TYPE.RESTRICT;
        if (isCardTransactionWithCorporateLiability) {
            return false;
        }
        const isReportSubmitter = (0, ReportUtils_1.isCurrentUserSubmitter)(report);
        const isApprovalEnabled = policy ? policy.approvalMode && policy.approvalMode !== CONST_1.default.POLICY.APPROVAL_MODE.OPTIONAL : false;
        const isForwarded = (0, ReportUtils_1.isProcessingReport)(report) && isApprovalEnabled && !(0, ReportUtils_1.isAwaitingFirstLevelApproval)(report);
        return isReportSubmitter && isReportOpenOrProcessing && !isForwarded;
    }
    return false;
}
function isRetractAction(report, policy) {
    const isExpenseReport = (0, ReportUtils_1.isExpenseReport)(report);
    // This should be removed after we change how instant submit works
    const isInstantSubmit = (0, PolicyUtils_1.isInstantSubmitEnabled)(policy);
    if (!isExpenseReport || isInstantSubmit) {
        return false;
    }
    const isReportSubmitter = (0, ReportUtils_1.isCurrentUserSubmitter)(report);
    if (!isReportSubmitter) {
        return false;
    }
    const isProcessingReport = (0, ReportUtils_1.isProcessingReport)(report);
    if (!isProcessingReport) {
        return false;
    }
    return true;
}
function isReopenAction(report, policy) {
    const isExpenseReport = (0, ReportUtils_1.isExpenseReport)(report);
    if (!isExpenseReport) {
        return false;
    }
    const isClosedReport = (0, ReportUtils_1.isClosedReport)(report);
    if (!isClosedReport) {
        return false;
    }
    const isAdmin = policy?.role === CONST_1.default.POLICY.ROLE.ADMIN;
    if (!isAdmin) {
        return false;
    }
    return true;
}
/**
 * Checks whether the supplied report supports merging transactions from it.
 */
function isMergeAction(parentReport, reportTransactions, policy) {
    // Do not show merge action if there are multiple transactions
    if (reportTransactions.length !== 1) {
        return false;
    }
    // Temporary disable merge action for IOU reports
    // See: https://github.com/Expensify/App/issues/70329#issuecomment-3277062003
    if ((0, ReportUtils_1.isIOUReport)(parentReport)) {
        return false;
    }
    const isAnyReceiptBeingScanned = reportTransactions?.some((transaction) => (0, TransactionUtils_1.isReceiptBeingScanned)(transaction));
    if (isAnyReceiptBeingScanned) {
        return false;
    }
    if ((0, ReportUtils_1.isSelfDM)(parentReport)) {
        return true;
    }
    if ((0, ReportUtils_1.hasOnlyNonReimbursableTransactions)(parentReport.reportID) && (0, PolicyUtils_1.isSubmitAndClose)(policy) && (0, PolicyUtils_1.isInstantSubmitEnabled)(policy)) {
        return false;
    }
    const isAdmin = policy?.role === CONST_1.default.POLICY.ROLE.ADMIN;
    return (0, ReportUtils_1.isMoneyRequestReportEligibleForMerge)(parentReport.reportID, isAdmin);
}
function isRemoveHoldAction(report, chatReport, reportTransactions, reportActions, policy) {
    const isReportOnHold = reportTransactions.some(TransactionUtils_1.isOnHold);
    if (!isReportOnHold) {
        return false;
    }
    const transactionThreadReportID = (0, ReportActionsUtils_1.getOneTransactionThreadReportID)(report, chatReport, reportActions);
    if (!transactionThreadReportID) {
        return false;
    }
    const isHolder = reportTransactions.some((transaction) => (0, ReportUtils_1.isHoldCreator)(transaction, transactionThreadReportID));
    if (isHolder) {
        return false;
    }
    return policy?.role === CONST_1.default.POLICY.ROLE.ADMIN;
}
function isRemoveHoldActionForTransaction(report, reportTransaction, policy) {
    return (0, TransactionUtils_1.isOnHold)(reportTransaction) && policy?.role === CONST_1.default.POLICY.ROLE.ADMIN && !(0, ReportUtils_1.isHoldCreator)(reportTransaction, report.reportID);
}
function getSecondaryReportActions({ report, chatReport, reportTransactions, violations, policy, reportNameValuePairs, reportActions, policies, isChatReportArchived = false, }) {
    const options = [];
    if ((0, ReportPrimaryActionUtils_1.isPrimaryPayAction)(report, policy, reportNameValuePairs) && (0, ReportUtils_1.hasOnlyHeldExpenses)(report?.reportID)) {
        options.push(CONST_1.default.REPORT.SECONDARY_ACTIONS.PAY);
    }
    if (isAddExpenseAction(report, reportTransactions, isChatReportArchived || (0, ReportUtils_1.isArchivedReport)(reportNameValuePairs))) {
        options.push(CONST_1.default.REPORT.SECONDARY_ACTIONS.ADD_EXPENSE);
    }
    const primaryAction = (0, ReportPrimaryActionUtils_1.getReportPrimaryAction)({
        report,
        chatReport,
        reportTransactions,
        violations,
        policy,
        reportNameValuePairs,
        reportActions,
        isChatReportArchived,
    });
    if (isSubmitAction(report, reportTransactions, policy, reportNameValuePairs, reportActions, isChatReportArchived, primaryAction)) {
        options.push(CONST_1.default.REPORT.SECONDARY_ACTIONS.SUBMIT);
    }
    if (isApproveAction(report, reportTransactions, violations, policy)) {
        options.push(CONST_1.default.REPORT.SECONDARY_ACTIONS.APPROVE);
    }
    if (isUnapproveAction(report, policy)) {
        options.push(CONST_1.default.REPORT.SECONDARY_ACTIONS.UNAPPROVE);
    }
    if (isCancelPaymentAction(report, reportTransactions, policy)) {
        options.push(CONST_1.default.REPORT.SECONDARY_ACTIONS.CANCEL_PAYMENT);
    }
    if (isRetractAction(report, policy)) {
        options.push(CONST_1.default.REPORT.SECONDARY_ACTIONS.RETRACT);
    }
    if (isReopenAction(report, policy)) {
        options.push(CONST_1.default.REPORT.SECONDARY_ACTIONS.REOPEN);
    }
    if (isHoldAction(report, chatReport, reportTransactions, reportActions)) {
        options.push(CONST_1.default.REPORT.SECONDARY_ACTIONS.HOLD);
    }
    if (isRemoveHoldAction(report, chatReport, reportTransactions, reportActions, policy)) {
        options.push(CONST_1.default.REPORT.SECONDARY_ACTIONS.REMOVE_HOLD);
    }
    if ((0, ReportUtils_1.canRejectReportAction)(report, policy)) {
        options.push(CONST_1.default.REPORT.SECONDARY_ACTIONS.REJECT);
    }
    if (isSplitAction(report, reportTransactions, policy)) {
        options.push(CONST_1.default.REPORT.SECONDARY_ACTIONS.SPLIT);
    }
    if (isMergeAction(report, reportTransactions, policy)) {
        options.push(CONST_1.default.REPORT.SECONDARY_ACTIONS.MERGE);
    }
    options.push(CONST_1.default.REPORT.SECONDARY_ACTIONS.EXPORT);
    options.push(CONST_1.default.REPORT.SECONDARY_ACTIONS.DOWNLOAD_PDF);
    if (isChangeWorkspaceAction(report, policies, reportActions)) {
        options.push(CONST_1.default.REPORT.SECONDARY_ACTIONS.CHANGE_WORKSPACE);
    }
    if ((0, ReportUtils_1.isExpenseReport)(report) && (0, ReportUtils_1.isProcessingReport)(report) && (0, PolicyUtils_1.isPolicyAdmin)(policy)) {
        options.push(CONST_1.default.REPORT.SECONDARY_ACTIONS.CHANGE_APPROVER);
    }
    options.push(CONST_1.default.REPORT.SECONDARY_ACTIONS.VIEW_DETAILS);
    if (isDeleteAction(report, reportTransactions, reportActions ?? [], policy)) {
        options.push(CONST_1.default.REPORT.SECONDARY_ACTIONS.DELETE);
    }
    return options;
}
function getSecondaryExportReportActions(report, policy, reportActions, integrationsExportTemplates, customInAppTemplates) {
    const options = [];
    if (isExportAction(report, policy)) {
        options.push(CONST_1.default.REPORT.EXPORT_OPTIONS.EXPORT_TO_INTEGRATION);
    }
    if (isMarkAsExportedAction(report, policy)) {
        options.push(CONST_1.default.REPORT.EXPORT_OPTIONS.MARK_AS_EXPORTED);
    }
    options.push(CONST_1.default.REPORT.EXPORT_OPTIONS.DOWNLOAD_CSV, CONST_1.default.REPORT.EXPORT_OPTIONS.EXPENSE_LEVEL_EXPORT, CONST_1.default.REPORT.EXPORT_OPTIONS.REPORT_LEVEL_EXPORT);
    // Add any custom IS templates that have been added to the user's account as export options
    if (integrationsExportTemplates && integrationsExportTemplates.length > 0) {
        for (const template of integrationsExportTemplates) {
            options.push(template.name);
        }
    }
    // Add any in-app export templates that the user has created as export options
    if (customInAppTemplates && customInAppTemplates.length > 0) {
        for (const template of customInAppTemplates) {
            options.push(template.name);
        }
    }
    return options;
}
function getSecondaryTransactionThreadActions(parentReport, reportTransaction, reportActions, policy, transactionThreadReport) {
    const options = [];
    if (isHoldActionForTransaction(parentReport, reportTransaction, reportActions)) {
        options.push(CONST_1.default.REPORT.TRANSACTION_SECONDARY_ACTIONS.HOLD);
    }
    if (transactionThreadReport && isRemoveHoldActionForTransaction(transactionThreadReport, reportTransaction, policy)) {
        options.push(CONST_1.default.REPORT.TRANSACTION_SECONDARY_ACTIONS.REMOVE_HOLD);
    }
    if ((0, ReportUtils_1.canRejectReportAction)(parentReport, policy)) {
        options.push(CONST_1.default.REPORT.TRANSACTION_SECONDARY_ACTIONS.REJECT);
    }
    if (isSplitAction(parentReport, [reportTransaction], policy)) {
        options.push(CONST_1.default.REPORT.TRANSACTION_SECONDARY_ACTIONS.SPLIT);
    }
    if (isMergeAction(parentReport, [reportTransaction], policy)) {
        options.push(CONST_1.default.REPORT.TRANSACTION_SECONDARY_ACTIONS.MERGE);
    }
    options.push(CONST_1.default.REPORT.TRANSACTION_SECONDARY_ACTIONS.VIEW_DETAILS);
    if (isDeleteAction(parentReport, [reportTransaction], reportActions ?? [])) {
        options.push(CONST_1.default.REPORT.TRANSACTION_SECONDARY_ACTIONS.DELETE);
    }
    return options;
}
