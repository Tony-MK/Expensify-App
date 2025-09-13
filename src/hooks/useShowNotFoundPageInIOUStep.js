"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var TransactionUtils_1 = require("@libs/TransactionUtils");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var useOnyx_1 = require("./useOnyx");
/**
 * Shows not found page when:
 * - Split bill: User is not the original actor OR transaction is incomplete
 * - Split expense: Transaction doesn't exist
 * - Money request: Action is not a money request OR user cannot edit it
 */
// eslint-disable-next-line rulesdir/no-negated-variables
var useShowNotFoundPageInIOUStep = function (action, iouType, reportActionID, report, transaction) {
    var isEditing = action === CONST_1.default.IOU.ACTION.EDIT;
    var isSplitBill = iouType === CONST_1.default.IOU.TYPE.SPLIT;
    var isSplitExpense = iouType === CONST_1.default.IOU.TYPE.SPLIT_EXPENSE;
    var session = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: true })[0];
    var reportActionsReportID = (0, react_1.useMemo)(function () {
        var actionsReportID;
        if (isEditing) {
            actionsReportID = iouType === CONST_1.default.IOU.TYPE.SPLIT ? report === null || report === void 0 ? void 0 : report.reportID : report === null || report === void 0 ? void 0 : report.parentReportID;
        }
        return actionsReportID;
    }, [isEditing, iouType, report === null || report === void 0 ? void 0 : report.reportID, report === null || report === void 0 ? void 0 : report.parentReportID]);
    var reportAction = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(reportActionsReportID), {
        canEvict: false,
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        selector: function (reportActions) { return reportActions === null || reportActions === void 0 ? void 0 : reportActions["".concat((report === null || report === void 0 ? void 0 : report.parentReportActionID) || reportActionID)]; },
        canBeMissing: true,
    })[0];
    // eslint-disable-next-line rulesdir/no-negated-variables
    var shouldShowNotFoundPage = false;
    var canEditSplitBill = isSplitBill && reportAction && (session === null || session === void 0 ? void 0 : session.accountID) === reportAction.actorAccountID && (0, TransactionUtils_1.areRequiredFieldsEmpty)(transaction);
    var canEditSplitExpense = isSplitExpense && !!transaction;
    if (isEditing) {
        if (isSplitBill) {
            shouldShowNotFoundPage = !canEditSplitBill;
        }
        else if (isSplitExpense) {
            shouldShowNotFoundPage = !canEditSplitExpense;
        }
        else {
            shouldShowNotFoundPage = !(0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction) || !(0, ReportUtils_1.canEditMoneyRequest)(reportAction);
        }
    }
    return shouldShowNotFoundPage;
};
exports.default = useShowNotFoundPageInIOUStep;
