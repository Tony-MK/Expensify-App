"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
var SearchContext_1 = require("@components/Search/SearchContext");
var useAncestorReportsAndReportActions_1 = require("@hooks/useAncestorReportsAndReportActions");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var FormActions_1 = require("@libs/actions/FormActions");
var Search_1 = require("@libs/actions/Search");
var Navigation_1 = require("@libs/Navigation/Navigation");
var ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
var ValidationUtils_1 = require("@libs/ValidationUtils");
var HoldReasonFormView_1 = require("@pages/iou/HoldReasonFormView");
var IOU_1 = require("@userActions/IOU");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var SCREENS_1 = require("@src/SCREENS");
var MoneyRequestHoldReasonForm_1 = require("@src/types/form/MoneyRequestHoldReasonForm");
function SearchHoldReasonPage(_a) {
    var route = _a.route;
    var _b = route.params, _c = _b.backTo, backTo = _c === void 0 ? '' : _c, reportID = _b.reportID;
    var translate = (0, useLocalize_1.default)().translate;
    var context = (0, SearchContext_1.useSearchContext)();
    var _d = (0, useAncestorReportsAndReportActions_1.default)(reportID, true), report = _d.report, ancestorReportsAndReportActions = _d.ancestorReportsAndReportActions;
    var allReportTransactionsAndViolations = (0, OnyxListItemProvider_1.useAllReportsTransactionsAndViolations)();
    var selectedTransactionsIOUActions = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(reportID), {
        canBeMissing: false,
        selector: function (reportActions) {
            var actions = Object.values(reportActions !== null && reportActions !== void 0 ? reportActions : {});
            return context.selectedTransactionIDs.reduce(function (acc, transactionID) {
                var iouAction = (0, ReportActionsUtils_1.getIOUActionForTransactionID)(actions, transactionID);
                if (!iouAction) {
                    Log.warn("[SearchHoldReasonPage] No IOU action found for selected transactionID: ".concat(transactionID));
                    return acc;
                }
                acc[transactionID] = iouAction;
                return acc;
            }, {});
        },
    })[0];
    var selectedTransactionsThreads = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT), {
        canBeMissing: false,
        selector: function (allReports) {
            if (!allReports) {
                return;
            }
            return Object.entries(selectedTransactionsIOUActions !== null && selectedTransactionsIOUActions !== void 0 ? selectedTransactionsIOUActions : {}).reduce(function (acc, _a) {
                var transactionID = _a[0], iouAction = _a[1];
                if (!(iouAction === null || iouAction === void 0 ? void 0 : iouAction.childReportID)) {
                    return acc;
                }
                var thread = allReports[iouAction.childReportID];
                if (thread) {
                    acc[transactionID] = thread;
                }
                return acc;
            }, {});
        },
    })[0];
    // Get the selected transactions and violations for the current reportID
    var _e = (0, react_1.useMemo)(function () {
        var _a;
        if (!allReportTransactionsAndViolations || Object.keys(context.selectedTransactionIDs).length === 0) {
            return [{}, {}];
        }
        var reportTransactionsAndViolations = allReportTransactionsAndViolations[reportID];
        if (!(reportTransactionsAndViolations === null || reportTransactionsAndViolations === void 0 ? void 0 : reportTransactionsAndViolations.transactions)) {
            return [{}, {}];
        }
        var reportTransactions = reportTransactionsAndViolations.transactions, reportViolations = reportTransactionsAndViolations.violations;
        var transactions = {};
        var violations = {};
        for (var _i = 0, _b = context.selectedTransactionIDs; _i < _b.length; _i++) {
            var transactionID = _b[_i];
            var transaction = reportTransactions["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactionID)];
            if (!transaction) {
                Log.warn("[SearchHoldReasonPage] Selected transactionID: ".concat(transactionID, " not found in derived report transactions"));
                continue;
            }
            if ((transaction === null || transaction === void 0 ? void 0 : transaction.pendingAction) !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE) {
                transactions["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactionID)] = transaction;
                violations["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(transactionID)] = (_a = reportViolations === null || reportViolations === void 0 ? void 0 : reportViolations["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(transactionID)]) !== null && _a !== void 0 ? _a : [];
            }
        }
        return [transactions, violations];
    }, [allReportTransactionsAndViolations, context.selectedTransactionIDs, reportID]), selectedTransactions = _e[0], selectedTransactionViolations = _e[1];
    var onSubmit = (0, react_1.useCallback)(function (_a) {
        var comment = _a.comment;
        if (route.name === SCREENS_1.default.SEARCH.MONEY_REQUEST_REPORT_HOLD_TRANSACTIONS) {
            (0, IOU_1.bulkHold)(comment, report, ancestorReportsAndReportActions, selectedTransactions, selectedTransactionViolations, selectedTransactionsIOUActions !== null && selectedTransactionsIOUActions !== void 0 ? selectedTransactionsIOUActions : {}, selectedTransactionsThreads !== null && selectedTransactionsThreads !== void 0 ? selectedTransactionsThreads : {});
            context.clearSelectedTransactions(true);
        }
        else {
            (0, Search_1.holdMoneyRequestOnSearch)(context.currentSearchHash, Object.keys(context.selectedTransactions), comment, selectedTransactions, selectedTransactionsIOUActions !== null && selectedTransactionsIOUActions !== void 0 ? selectedTransactionsIOUActions : {});
            context.clearSelectedTransactions();
        }
        Navigation_1.default.goBack();
    }, [ancestorReportsAndReportActions, context, report, route.name, selectedTransactions, selectedTransactionViolations, selectedTransactionsThreads, selectedTransactionsIOUActions]);
    var validate = (0, react_1.useCallback)(function (values) {
        var errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, [MoneyRequestHoldReasonForm_1.default.COMMENT]);
        if (!values.comment) {
            errors.comment = translate('common.error.fieldRequired');
        }
        return errors;
    }, [translate]);
    (0, react_1.useEffect)(function () {
        (0, FormActions_1.clearErrors)(ONYXKEYS_1.default.FORMS.MONEY_REQUEST_HOLD_FORM);
        (0, FormActions_1.clearErrorFields)(ONYXKEYS_1.default.FORMS.MONEY_REQUEST_HOLD_FORM);
    }, []);
    return (<HoldReasonFormView_1.default onSubmit={onSubmit} validate={validate} backTo={backTo}/>);
}
SearchHoldReasonPage.displayName = 'SearchHoldReasonPage';
exports.default = SearchHoldReasonPage;
