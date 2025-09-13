"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var useOnyx_1 = require("@hooks/useOnyx");
var useTransactionsAndViolationsForReport_1 = require("@hooks/useTransactionsAndViolationsForReport");
var MoneyRequestReportUtils_1 = require("@libs/MoneyRequestReportUtils");
var PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
var ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var Report_1 = require("@userActions/Report");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
function getSplitAuthor(transaction, splits) {
    var _a;
    var _b = (_a = transaction.comment) !== null && _a !== void 0 ? _a : {}, originalTransactionID = _b.originalTransactionID, source = _b.source;
    if (source !== CONST_1.default.IOU.TYPE.SPLIT || originalTransactionID === undefined) {
        return undefined;
    }
    var splitAction = splits === null || splits === void 0 ? void 0 : splits.find(function (split) { var _a; return ((_a = (0, ReportActionsUtils_1.getOriginalMessage)(split)) === null || _a === void 0 ? void 0 : _a.IOUTransactionID) === originalTransactionID; });
    if (!splitAction) {
        return undefined;
    }
    return splitAction.actorAccountID;
}
function useReportPreviewSenderID(_a) {
    var iouReport = _a.iouReport, action = _a.action, chatReport = _a.chatReport;
    var iouActions = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(iouReport === null || iouReport === void 0 ? void 0 : iouReport.reportID), {
        canBeMissing: true,
        selector: function (actions) { return Object.values(actions !== null && actions !== void 0 ? actions : {}).filter(ReportActionsUtils_1.isMoneyRequestAction); },
    })[0];
    var reportTransactions = (0, useTransactionsAndViolationsForReport_1.default)(action === null || action === void 0 ? void 0 : action.childReportID).transactions;
    var transactions = (0, react_1.useMemo)(function () { return (0, MoneyRequestReportUtils_1.getAllNonDeletedTransactions)(reportTransactions, iouActions !== null && iouActions !== void 0 ? iouActions : []); }, [reportTransactions, iouActions]);
    var splits = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(chatReport === null || chatReport === void 0 ? void 0 : chatReport.reportID), {
        canBeMissing: true,
        selector: function (actions) {
            return Object.values(actions !== null && actions !== void 0 ? actions : {})
                .filter(ReportActionsUtils_1.isMoneyRequestAction)
                .filter(function (act) { var _a; return ((_a = (0, ReportActionsUtils_1.getOriginalMessage)(act)) === null || _a === void 0 ? void 0 : _a.type) === CONST_1.default.IOU.REPORT_ACTION_TYPE.SPLIT; });
        },
    })[0];
    var policy = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(iouReport === null || iouReport === void 0 ? void 0 : iouReport.policyID), {
        canBeMissing: true,
    })[0];
    if ((action === null || action === void 0 ? void 0 : action.isOptimisticAction) && (action === null || action === void 0 ? void 0 : action.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW) {
        return (0, Report_1.getCurrentUserAccountID)();
    }
    // 1. If all amounts have the same sign - either all amounts are positive or all amounts are negative.
    // We have to do it this way because there can be a case when actions are not available
    // See: https://github.com/Expensify/App/pull/64802#issuecomment-3008944401
    var areAmountsSignsTheSame = new Set(transactions === null || transactions === void 0 ? void 0 : transactions.map(function (tr) { return Math.sign(tr.amount); })).size < 2;
    // 2. If there is only one attendee - we check that by counting unique emails converted to account IDs in the attendees list.
    // This is a fallback added because: https://github.com/Expensify/App/pull/64802#issuecomment-3007906310
    var attendeesIDs = transactions === null || transactions === void 0 ? void 0 : transactions
    // If the transaction is a split, then attendees are not present as a property so we need to use a helper function.
    .flatMap(function (tr) { var _a, _b, _c; return (_c = (_b = (_a = tr.comment) === null || _a === void 0 ? void 0 : _a.attendees) === null || _b === void 0 ? void 0 : _b.map) === null || _c === void 0 ? void 0 : _c.call(_b, function (att) { var _a, _b; return (((_a = tr.comment) === null || _a === void 0 ? void 0 : _a.source) === CONST_1.default.IOU.TYPE.SPLIT ? getSplitAuthor(tr, splits) : (_b = (0, PersonalDetailsUtils_1.getPersonalDetailByEmail)(att.email)) === null || _b === void 0 ? void 0 : _b.accountID); }); }).filter(function (accountID) { return !!accountID; });
    var isThereOnlyOneAttendee = new Set(attendeesIDs).size <= 1;
    // If the action is a 'Send Money' flow, it will only have one transaction, but the person who sent the money is the child manager account, not the child owner account.
    var isSendMoneyFlowBasedOnActions = !!iouActions && iouActions.every(ReportActionsUtils_1.isSentMoneyReportAction);
    // This is used only if there are no IOU actions in the Onyx
    // eslint-disable-next-line rulesdir/no-negated-variables
    var isSendMoneyFlowBasedOnTransactions = !!action && action.childMoneyRequestCount === 0 && (transactions === null || transactions === void 0 ? void 0 : transactions.length) === 1 && (chatReport ? (0, ReportUtils_1.isDM)(chatReport) : (policy === null || policy === void 0 ? void 0 : policy.type) === CONST_1.default.POLICY.TYPE.PERSONAL);
    var isSendMoneyFlow = !!iouActions && (iouActions === null || iouActions === void 0 ? void 0 : iouActions.length) > 0 ? isSendMoneyFlowBasedOnActions : isSendMoneyFlowBasedOnTransactions;
    var singleAvatarAccountID = isSendMoneyFlow ? action === null || action === void 0 ? void 0 : action.childManagerAccountID : action === null || action === void 0 ? void 0 : action.childOwnerAccountID;
    return areAmountsSignsTheSame && isThereOnlyOneAttendee ? singleAvatarAccountID : undefined;
}
exports.default = useReportPreviewSenderID;
