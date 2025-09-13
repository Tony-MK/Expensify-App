"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalAmountForIOUReportPreviewButton = void 0;
exports.isActionVisibleOnMoneyRequestReport = isActionVisibleOnMoneyRequestReport;
exports.getThreadReportIDsForTransactions = getThreadReportIDsForTransactions;
exports.getReportIDForTransaction = getReportIDForTransaction;
exports.getAllNonDeletedTransactions = getAllNonDeletedTransactions;
exports.isSingleTransactionReport = isSingleTransactionReport;
exports.shouldDisplayReportTableView = shouldDisplayReportTableView;
exports.shouldWaitForTransactions = shouldWaitForTransactions;
const CONST_1 = require("@src/CONST");
const CurrencyUtils_1 = require("./CurrencyUtils");
const ReportActionsUtils_1 = require("./ReportActionsUtils");
const ReportUtils_1 = require("./ReportUtils");
const TransactionUtils_1 = require("./TransactionUtils");
/**
 * In MoneyRequestReport we filter out some IOU action types, because expense/transaction data is displayed in a separate list
 * at the top
 */
const IOU_ACTIONS_TO_FILTER_OUT = [CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE, CONST_1.default.IOU.REPORT_ACTION_TYPE.TRACK];
/**
 * Returns whether a specific action should be displayed in the feed/message list on MoneyRequestReportView.
 *
 * In MoneyRequestReport we filter out some action types, because expense/transaction data is displayed in a separate list
 * at the top the report, instead of in-between the rest of messages like in normal chat.
 * Because of that several action types are not relevant to this ReportView and should not be shown.
 */
function isActionVisibleOnMoneyRequestReport(action) {
    if ((0, ReportActionsUtils_1.isMoneyRequestAction)(action)) {
        const originalMessage = (0, ReportActionsUtils_1.getOriginalMessage)(action);
        return originalMessage ? !IOU_ACTIONS_TO_FILTER_OUT.includes(originalMessage.type) : false;
    }
    return action.actionName !== CONST_1.default.REPORT.ACTIONS.TYPE.CREATED;
}
/**
 * Give a list of report actions and a list of transactions,
 * function will return a list of reportIDs for the threads for the IOU parent action of every transaction.
 * It is used in UI to allow for navigation to "sibling" transactions when opening a single transaction (report) view.
 */
function getThreadReportIDsForTransactions(reportActions, transactions) {
    return transactions
        .map((transaction) => {
        if ((0, TransactionUtils_1.isTransactionPendingDelete)(transaction)) {
            return;
        }
        const action = (0, ReportActionsUtils_1.getIOUActionForTransactionID)(reportActions, transaction.transactionID);
        return action?.childReportID;
    })
        .filter((reportID) => !!reportID);
}
/**
 * Returns a correct reportID for a given TransactionListItemType for navigation/displaying purposes.
 */
function getReportIDForTransaction(transactionItem) {
    const isFromSelfDM = transactionItem.reportID === CONST_1.default.REPORT.UNREPORTED_REPORT_ID;
    return (!transactionItem.isFromOneTransactionReport || isFromSelfDM) && transactionItem.transactionThreadReportID !== CONST_1.default.REPORT.UNREPORTED_REPORT_ID
        ? transactionItem.transactionThreadReportID
        : transactionItem.reportID;
}
/**
 * Filters all available transactions and returns the ones that belong to not removed action and not removed parent action.
 */
function getAllNonDeletedTransactions(transactions, reportActions) {
    return Object.values(transactions ?? {}).filter((transaction) => {
        if (!transaction) {
            return false;
        }
        const action = (0, ReportActionsUtils_1.getIOUActionForTransactionID)(reportActions, transaction.transactionID);
        return !(0, ReportActionsUtils_1.isDeletedParentAction)(action) && (reportActions.length === 0 || !(0, ReportActionsUtils_1.isDeletedAction)(action));
    });
}
/**
 * Given a list of transaction, this function checks if a given report has exactly one transaction
 *
 * Note: this function may seem a bit trivial, but it's used as a guarantee that the same logic of checking for report
 * is used in context of Search and Inbox
 */
function isSingleTransactionReport(report, transactions) {
    if (transactions.length !== 1) {
        return false;
    }
    return transactions.at(0)?.reportID === report?.reportID;
}
/**
 * Returns whether a "table" ReportView/MoneyRequestReportView should be used for the report.
 *
 * If report is a special "transaction thread" we want to use other Report views.
 * Likewise, if report has only 1 connected transaction, then we also use other views.
 */
function shouldDisplayReportTableView(report, transactions) {
    return !(0, ReportUtils_1.isReportTransactionThread)(report) && !isSingleTransactionReport(report, transactions);
}
function shouldWaitForTransactions(report, transactions, reportMetadata) {
    const isTransactionDataReady = transactions !== undefined;
    const isTransactionThreadView = (0, ReportUtils_1.isReportTransactionThread)(report);
    const isStillLoadingData = !!reportMetadata?.isLoadingInitialReportActions || !!reportMetadata?.isLoadingOlderReportActions || !!reportMetadata?.isLoadingNewerReportActions;
    return (((0, ReportUtils_1.isMoneyRequestReport)(report) || (0, ReportUtils_1.isInvoiceReport)(report)) &&
        (!isTransactionDataReady || (isStillLoadingData && transactions?.length === 0)) &&
        !isTransactionThreadView &&
        report?.pendingFields?.createReport !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD &&
        !reportMetadata?.hasOnceLoadedReportActions);
}
/**
 * Determines the total amount to be displayed based on the selected button type in the IOU Report Preview.
 *
 * @param report - Onyx report object
 * @param policy - Onyx policy object
 * @param reportPreviewAction - The action that will take place when button is clicked which determines how amounts are calculated and displayed.
 * @returns - The total amount to be formatted as a string. Returns an empty string if no amount is applicable.
 */
const getTotalAmountForIOUReportPreviewButton = (report, policy, reportPreviewAction) => {
    // Determine whether the non-held amount is appropriate to display for the PAY button.
    const { nonHeldAmount, hasValidNonHeldAmount } = (0, ReportUtils_1.getNonHeldAndFullAmount)(report, reportPreviewAction === CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.PAY);
    const hasOnlyHeldExpenses = (0, ReportUtils_1.hasOnlyHeldExpenses)(report?.reportID);
    const canAllowSettlement = (0, ReportUtils_1.hasUpdatedTotal)(report, policy);
    // Split the total spend into different categories as needed.
    const { totalDisplaySpend, reimbursableSpend } = (0, ReportUtils_1.getMoneyRequestSpendBreakdown)(report);
    if (reportPreviewAction === CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.PAY) {
        // Return empty string if there are only held expenses which cannot be paid.
        if (hasOnlyHeldExpenses) {
            return '';
        }
        // We shouldn't display the nonHeldAmount as the default option if it's not valid since we cannot pay partially in this case
        if ((0, ReportUtils_1.hasHeldExpenses)(report?.reportID) && canAllowSettlement && hasValidNonHeldAmount && !hasOnlyHeldExpenses) {
            return nonHeldAmount;
        }
        // Default to reimbursable spend for PAY button if above conditions are not met.
        return (0, CurrencyUtils_1.convertToDisplayString)(reimbursableSpend, report?.currency);
    }
    // For all other cases, return the total display spend.
    return (0, CurrencyUtils_1.convertToDisplayString)(totalDisplaySpend, report?.currency);
};
exports.getTotalAmountForIOUReportPreviewButton = getTotalAmountForIOUReportPreviewButton;
