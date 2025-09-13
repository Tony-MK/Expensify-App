"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useOnyx_1 = require("@hooks/useOnyx");
const useTransactionsAndViolationsForReport_1 = require("@hooks/useTransactionsAndViolationsForReport");
const MoneyRequestReportUtils_1 = require("@libs/MoneyRequestReportUtils");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const Report_1 = require("@userActions/Report");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function getSplitAuthor(transaction, splits) {
    const { originalTransactionID, source } = transaction.comment ?? {};
    if (source !== CONST_1.default.IOU.TYPE.SPLIT || originalTransactionID === undefined) {
        return undefined;
    }
    const splitAction = splits?.find((split) => (0, ReportActionsUtils_1.getOriginalMessage)(split)?.IOUTransactionID === originalTransactionID);
    if (!splitAction) {
        return undefined;
    }
    return splitAction.actorAccountID;
}
function useReportPreviewSenderID({ iouReport, action, chatReport }) {
    const [iouActions] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReport?.reportID}`, {
        canBeMissing: true,
        selector: (actions) => Object.values(actions ?? {}).filter(ReportActionsUtils_1.isMoneyRequestAction),
    });
    const { transactions: reportTransactions } = (0, useTransactionsAndViolationsForReport_1.default)(action?.childReportID);
    const transactions = (0, react_1.useMemo)(() => (0, MoneyRequestReportUtils_1.getAllNonDeletedTransactions)(reportTransactions, iouActions ?? []), [reportTransactions, iouActions]);
    const [splits] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${chatReport?.reportID}`, {
        canBeMissing: true,
        selector: (actions) => Object.values(actions ?? {})
            .filter(ReportActionsUtils_1.isMoneyRequestAction)
            .filter((act) => (0, ReportActionsUtils_1.getOriginalMessage)(act)?.type === CONST_1.default.IOU.REPORT_ACTION_TYPE.SPLIT),
    });
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${iouReport?.policyID}`, {
        canBeMissing: true,
    });
    if (action?.isOptimisticAction && action?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW) {
        return (0, Report_1.getCurrentUserAccountID)();
    }
    // 1. If all amounts have the same sign - either all amounts are positive or all amounts are negative.
    // We have to do it this way because there can be a case when actions are not available
    // See: https://github.com/Expensify/App/pull/64802#issuecomment-3008944401
    const areAmountsSignsTheSame = new Set(transactions?.map((tr) => Math.sign(tr.amount))).size < 2;
    // 2. If there is only one attendee - we check that by counting unique emails converted to account IDs in the attendees list.
    // This is a fallback added because: https://github.com/Expensify/App/pull/64802#issuecomment-3007906310
    const attendeesIDs = transactions
        // If the transaction is a split, then attendees are not present as a property so we need to use a helper function.
        ?.flatMap((tr) => tr.comment?.attendees?.map?.((att) => (tr.comment?.source === CONST_1.default.IOU.TYPE.SPLIT ? getSplitAuthor(tr, splits) : (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(att.email)?.accountID)))
        .filter((accountID) => !!accountID);
    const isThereOnlyOneAttendee = new Set(attendeesIDs).size <= 1;
    // If the action is a 'Send Money' flow, it will only have one transaction, but the person who sent the money is the child manager account, not the child owner account.
    const isSendMoneyFlowBasedOnActions = !!iouActions && iouActions.every(ReportActionsUtils_1.isSentMoneyReportAction);
    // This is used only if there are no IOU actions in the Onyx
    // eslint-disable-next-line rulesdir/no-negated-variables
    const isSendMoneyFlowBasedOnTransactions = !!action && action.childMoneyRequestCount === 0 && transactions?.length === 1 && (chatReport ? (0, ReportUtils_1.isDM)(chatReport) : policy?.type === CONST_1.default.POLICY.TYPE.PERSONAL);
    const isSendMoneyFlow = !!iouActions && iouActions?.length > 0 ? isSendMoneyFlowBasedOnActions : isSendMoneyFlowBasedOnTransactions;
    const singleAvatarAccountID = isSendMoneyFlow ? action?.childManagerAccountID : action?.childOwnerAccountID;
    return areAmountsSignsTheSame && isThereOnlyOneAttendee ? singleAvatarAccountID : undefined;
}
exports.default = useReportPreviewSenderID;
