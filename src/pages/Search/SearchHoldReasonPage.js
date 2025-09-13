"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const SearchContext_1 = require("@components/Search/SearchContext");
const useAncestorReportsAndReportActions_1 = require("@hooks/useAncestorReportsAndReportActions");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const FormActions_1 = require("@libs/actions/FormActions");
const Search_1 = require("@libs/actions/Search");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const HoldReasonFormView_1 = require("@pages/iou/HoldReasonFormView");
const IOU_1 = require("@userActions/IOU");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const SCREENS_1 = require("@src/SCREENS");
const MoneyRequestHoldReasonForm_1 = require("@src/types/form/MoneyRequestHoldReasonForm");
function SearchHoldReasonPage({ route }) {
    const { backTo = '', reportID } = route.params;
    const { translate } = (0, useLocalize_1.default)();
    const context = (0, SearchContext_1.useSearchContext)();
    const { report, ancestorReportsAndReportActions } = (0, useAncestorReportsAndReportActions_1.default)(reportID, true);
    const allReportTransactionsAndViolations = (0, OnyxListItemProvider_1.useAllReportsTransactionsAndViolations)();
    const [selectedTransactionsIOUActions] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`, {
        canBeMissing: false,
        selector: (reportActions) => {
            const actions = Object.values(reportActions ?? {});
            return context.selectedTransactionIDs.reduce((acc, transactionID) => {
                const iouAction = (0, ReportActionsUtils_1.getIOUActionForTransactionID)(actions, transactionID);
                if (!iouAction) {
                    Log.warn(`[SearchHoldReasonPage] No IOU action found for selected transactionID: ${transactionID}`);
                    return acc;
                }
                acc[transactionID] = iouAction;
                return acc;
            }, {});
        },
    });
    const [selectedTransactionsThreads] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}`, {
        canBeMissing: false,
        selector: (allReports) => {
            if (!allReports) {
                return;
            }
            return Object.entries(selectedTransactionsIOUActions ?? {}).reduce((acc, [transactionID, iouAction]) => {
                if (!iouAction?.childReportID) {
                    return acc;
                }
                const thread = allReports[iouAction.childReportID];
                if (thread) {
                    acc[transactionID] = thread;
                }
                return acc;
            }, {});
        },
    });
    // Get the selected transactions and violations for the current reportID
    const [selectedTransactions, selectedTransactionViolations] = (0, react_1.useMemo)(() => {
        if (!allReportTransactionsAndViolations || Object.keys(context.selectedTransactionIDs).length === 0) {
            return [{}, {}];
        }
        const reportTransactionsAndViolations = allReportTransactionsAndViolations[reportID];
        if (!reportTransactionsAndViolations?.transactions) {
            return [{}, {}];
        }
        const { transactions: reportTransactions, violations: reportViolations } = reportTransactionsAndViolations;
        const transactions = {};
        const violations = {};
        for (const transactionID of context.selectedTransactionIDs) {
            const transaction = reportTransactions[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`];
            if (!transaction) {
                Log.warn(`[SearchHoldReasonPage] Selected transactionID: ${transactionID} not found in derived report transactions`);
                continue;
            }
            if (transaction?.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE) {
                transactions[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`] = transaction;
                violations[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`] = reportViolations?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`] ?? [];
            }
        }
        return [transactions, violations];
    }, [allReportTransactionsAndViolations, context.selectedTransactionIDs, reportID]);
    const onSubmit = (0, react_1.useCallback)(({ comment }) => {
        if (route.name === SCREENS_1.default.SEARCH.MONEY_REQUEST_REPORT_HOLD_TRANSACTIONS) {
            (0, IOU_1.bulkHold)(comment, report, ancestorReportsAndReportActions, selectedTransactions, selectedTransactionViolations, selectedTransactionsIOUActions ?? {}, selectedTransactionsThreads ?? {});
            context.clearSelectedTransactions(true);
        }
        else {
            (0, Search_1.holdMoneyRequestOnSearch)(context.currentSearchHash, Object.keys(context.selectedTransactions), comment, selectedTransactions, selectedTransactionsIOUActions ?? {});
            context.clearSelectedTransactions();
        }
        Navigation_1.default.goBack();
    }, [ancestorReportsAndReportActions, context, report, route.name, selectedTransactions, selectedTransactionViolations, selectedTransactionsThreads, selectedTransactionsIOUActions]);
    const validate = (0, react_1.useCallback)((values) => {
        const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, [MoneyRequestHoldReasonForm_1.default.COMMENT]);
        if (!values.comment) {
            errors.comment = translate('common.error.fieldRequired');
        }
        return errors;
    }, [translate]);
    (0, react_1.useEffect)(() => {
        (0, FormActions_1.clearErrors)(ONYXKEYS_1.default.FORMS.MONEY_REQUEST_HOLD_FORM);
        (0, FormActions_1.clearErrorFields)(ONYXKEYS_1.default.FORMS.MONEY_REQUEST_HOLD_FORM);
    }, []);
    return (<HoldReasonFormView_1.default onSubmit={onSubmit} validate={validate} backTo={backTo}/>);
}
SearchHoldReasonPage.displayName = 'SearchHoldReasonPage';
exports.default = SearchHoldReasonPage;
