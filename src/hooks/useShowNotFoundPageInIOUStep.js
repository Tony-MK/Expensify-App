"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const useOnyx_1 = require("./useOnyx");
/**
 * Shows not found page when:
 * - Split bill: User is not the original actor OR transaction is incomplete
 * - Split expense: Transaction doesn't exist
 * - Money request: Action is not a money request OR user cannot edit it
 */
// eslint-disable-next-line rulesdir/no-negated-variables
const useShowNotFoundPageInIOUStep = (action, iouType, reportActionID, report, transaction) => {
    const isEditing = action === CONST_1.default.IOU.ACTION.EDIT;
    const isSplitBill = iouType === CONST_1.default.IOU.TYPE.SPLIT;
    const isSplitExpense = iouType === CONST_1.default.IOU.TYPE.SPLIT_EXPENSE;
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: true });
    const reportActionsReportID = (0, react_1.useMemo)(() => {
        let actionsReportID;
        if (isEditing) {
            actionsReportID = iouType === CONST_1.default.IOU.TYPE.SPLIT ? report?.reportID : report?.parentReportID;
        }
        return actionsReportID;
    }, [isEditing, iouType, report?.reportID, report?.parentReportID]);
    const [reportAction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportActionsReportID}`, {
        canEvict: false,
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        selector: (reportActions) => reportActions?.[`${report?.parentReportActionID || reportActionID}`],
        canBeMissing: true,
    });
    // eslint-disable-next-line rulesdir/no-negated-variables
    let shouldShowNotFoundPage = false;
    const canEditSplitBill = isSplitBill && reportAction && session?.accountID === reportAction.actorAccountID && (0, TransactionUtils_1.areRequiredFieldsEmpty)(transaction);
    const canEditSplitExpense = isSplitExpense && !!transaction;
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
