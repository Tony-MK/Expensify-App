"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fast_equals_1 = require("fast-equals");
var react_1 = require("react");
var useCurrentReportID_1 = require("@hooks/useCurrentReportID");
var useGetExpensifyCardFromReportAction_1 = require("@hooks/useGetExpensifyCardFromReportAction");
var useOnyx_1 = require("@hooks/useOnyx");
var ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var SidebarUtils_1 = require("@libs/SidebarUtils");
var CONST_1 = require("@src/CONST");
var ModifiedExpenseMessage_1 = require("@src/libs/ModifiedExpenseMessage");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var OptionRowLHN_1 = require("./OptionRowLHN");
/*
 * This component gets the data from onyx for the actual
 * OptionRowLHN component.
 * The OptionRowLHN component is memoized, so it will only
 * re-render if the data really changed.
 */
function OptionRowLHNData(_a) {
    var _b = _a.isOptionFocused, isOptionFocused = _b === void 0 ? false : _b, fullReport = _a.fullReport, reportAttributes = _a.reportAttributes, oneTransactionThreadReport = _a.oneTransactionThreadReport, reportNameValuePairs = _a.reportNameValuePairs, reportActions = _a.reportActions, _c = _a.personalDetails, personalDetails = _c === void 0 ? {} : _c, _d = _a.preferredLocale, preferredLocale = _d === void 0 ? CONST_1.default.LOCALES.DEFAULT : _d, policy = _a.policy, invoiceReceiverPolicy = _a.invoiceReceiverPolicy, receiptTransactions = _a.receiptTransactions, parentReportAction = _a.parentReportAction, iouReportReportActions = _a.iouReportReportActions, transaction = _a.transaction, lastReportActionTransaction = _a.lastReportActionTransaction, transactionViolations = _a.transactionViolations, lastMessageTextFromReport = _a.lastMessageTextFromReport, localeCompare = _a.localeCompare, _e = _a.isReportArchived, isReportArchived = _e === void 0 ? false : _e, propsToForward = __rest(_a, ["isOptionFocused", "fullReport", "reportAttributes", "oneTransactionThreadReport", "reportNameValuePairs", "reportActions", "personalDetails", "preferredLocale", "policy", "invoiceReceiverPolicy", "receiptTransactions", "parentReportAction", "iouReportReportActions", "transaction", "lastReportActionTransaction", "transactionViolations", "lastMessageTextFromReport", "localeCompare", "isReportArchived"]);
    var reportID = propsToForward.reportID;
    var currentReportIDValue = (0, useCurrentReportID_1.default)();
    var isReportFocused = isOptionFocused && (currentReportIDValue === null || currentReportIDValue === void 0 ? void 0 : currentReportIDValue.currentReportID) === reportID;
    var optionItemRef = (0, react_1.useRef)(undefined);
    var lastAction = (0, react_1.useMemo)(function () {
        if (!reportActions || !fullReport) {
            return undefined;
        }
        var canUserPerformWriteAction = (0, ReportUtils_1.canUserPerformWriteAction)(fullReport, isReportArchived);
        var actionsArray = (0, ReportActionsUtils_1.getSortedReportActions)(Object.values(reportActions));
        var reportActionsForDisplay = actionsArray.filter(function (reportAction) { return (0, ReportActionsUtils_1.shouldReportActionBeVisibleAsLastAction)(reportAction, canUserPerformWriteAction) && reportAction.actionName !== CONST_1.default.REPORT.ACTIONS.TYPE.CREATED; });
        return reportActionsForDisplay.at(-1);
    }, [reportActions, fullReport, isReportArchived]);
    var movedFromReport = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat((0, ModifiedExpenseMessage_1.getMovedReportID)(lastAction, CONST_1.default.REPORT.MOVE_TYPE.FROM)), { canBeMissing: true })[0];
    var movedToReport = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat((0, ModifiedExpenseMessage_1.getMovedReportID)(lastAction, CONST_1.default.REPORT.MOVE_TYPE.TO)), { canBeMissing: true })[0];
    var card = (0, useGetExpensifyCardFromReportAction_1.default)({ reportAction: lastAction, policyID: fullReport === null || fullReport === void 0 ? void 0 : fullReport.policyID });
    var optionItem = (0, react_1.useMemo)(function () {
        // Note: ideally we'd have this as a dependent selector in onyx!
        var item = SidebarUtils_1.default.getOptionData({
            report: fullReport,
            reportAttributes: reportAttributes,
            oneTransactionThreadReport: oneTransactionThreadReport,
            reportNameValuePairs: reportNameValuePairs,
            personalDetails: personalDetails,
            policy: policy,
            parentReportAction: parentReportAction,
            lastMessageTextFromReport: lastMessageTextFromReport,
            invoiceReceiverPolicy: invoiceReceiverPolicy,
            card: card,
            lastAction: lastAction,
            localeCompare: localeCompare,
            isReportArchived: isReportArchived,
            movedFromReport: movedFromReport,
            movedToReport: movedToReport,
        });
        // eslint-disable-next-line react-compiler/react-compiler
        if ((0, fast_equals_1.deepEqual)(item, optionItemRef.current)) {
            // eslint-disable-next-line react-compiler/react-compiler
            return optionItemRef.current;
        }
        // eslint-disable-next-line react-compiler/react-compiler
        optionItemRef.current = item;
        return item;
        // Listen parentReportAction to update title of thread report when parentReportAction changed
        // Listen to transaction to update title of transaction report when transaction changed
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [
        fullReport,
        reportAttributes === null || reportAttributes === void 0 ? void 0 : reportAttributes.brickRoadStatus,
        reportAttributes === null || reportAttributes === void 0 ? void 0 : reportAttributes.reportName,
        oneTransactionThreadReport,
        reportNameValuePairs,
        lastReportActionTransaction,
        reportActions,
        personalDetails,
        preferredLocale,
        policy,
        parentReportAction,
        iouReportReportActions,
        transaction,
        receiptTransactions,
        invoiceReceiverPolicy,
        lastMessageTextFromReport,
        reportAttributes,
        card,
        localeCompare,
        isReportArchived,
        movedFromReport,
        movedToReport,
    ]);
    return (<OptionRowLHN_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...propsToForward} isOptionFocused={isReportFocused} optionItem={optionItem} report={fullReport}/>);
}
OptionRowLHNData.displayName = 'OptionRowLHNData';
/**
 * This component is rendered in a list.
 * On scroll we want to avoid that a item re-renders
 * just because the list has to re-render when adding more items.
 * Thats also why the React.memo is used on the outer component here, as we just
 * use it to prevent re-renders from parent re-renders.
 */
exports.default = react_1.default.memo(OptionRowLHNData);
