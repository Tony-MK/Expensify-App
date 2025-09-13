"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fast_equals_1 = require("fast-equals");
const react_1 = require("react");
const useCurrentReportID_1 = require("@hooks/useCurrentReportID");
const useGetExpensifyCardFromReportAction_1 = require("@hooks/useGetExpensifyCardFromReportAction");
const useOnyx_1 = require("@hooks/useOnyx");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const SidebarUtils_1 = require("@libs/SidebarUtils");
const CONST_1 = require("@src/CONST");
const ModifiedExpenseMessage_1 = require("@src/libs/ModifiedExpenseMessage");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const OptionRowLHN_1 = require("./OptionRowLHN");
/*
 * This component gets the data from onyx for the actual
 * OptionRowLHN component.
 * The OptionRowLHN component is memoized, so it will only
 * re-render if the data really changed.
 */
function OptionRowLHNData({ isOptionFocused = false, fullReport, reportAttributes, oneTransactionThreadReport, reportNameValuePairs, reportActions, personalDetails = {}, preferredLocale = CONST_1.default.LOCALES.DEFAULT, policy, invoiceReceiverPolicy, receiptTransactions, parentReportAction, iouReportReportActions, transaction, lastReportActionTransaction, transactionViolations, lastMessageTextFromReport, localeCompare, isReportArchived = false, ...propsToForward }) {
    const reportID = propsToForward.reportID;
    const currentReportIDValue = (0, useCurrentReportID_1.default)();
    const isReportFocused = isOptionFocused && currentReportIDValue?.currentReportID === reportID;
    const optionItemRef = (0, react_1.useRef)(undefined);
    const lastAction = (0, react_1.useMemo)(() => {
        if (!reportActions || !fullReport) {
            return undefined;
        }
        const canUserPerformWriteAction = (0, ReportUtils_1.canUserPerformWriteAction)(fullReport, isReportArchived);
        const actionsArray = (0, ReportActionsUtils_1.getSortedReportActions)(Object.values(reportActions));
        const reportActionsForDisplay = actionsArray.filter((reportAction) => (0, ReportActionsUtils_1.shouldReportActionBeVisibleAsLastAction)(reportAction, canUserPerformWriteAction) && reportAction.actionName !== CONST_1.default.REPORT.ACTIONS.TYPE.CREATED);
        return reportActionsForDisplay.at(-1);
    }, [reportActions, fullReport, isReportArchived]);
    const [movedFromReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${(0, ModifiedExpenseMessage_1.getMovedReportID)(lastAction, CONST_1.default.REPORT.MOVE_TYPE.FROM)}`, { canBeMissing: true });
    const [movedToReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${(0, ModifiedExpenseMessage_1.getMovedReportID)(lastAction, CONST_1.default.REPORT.MOVE_TYPE.TO)}`, { canBeMissing: true });
    const card = (0, useGetExpensifyCardFromReportAction_1.default)({ reportAction: lastAction, policyID: fullReport?.policyID });
    const optionItem = (0, react_1.useMemo)(() => {
        // Note: ideally we'd have this as a dependent selector in onyx!
        const item = SidebarUtils_1.default.getOptionData({
            report: fullReport,
            reportAttributes,
            oneTransactionThreadReport,
            reportNameValuePairs,
            personalDetails,
            policy,
            parentReportAction,
            lastMessageTextFromReport,
            invoiceReceiverPolicy,
            card,
            lastAction,
            localeCompare,
            isReportArchived,
            movedFromReport,
            movedToReport,
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
        reportAttributes?.brickRoadStatus,
        reportAttributes?.reportName,
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
