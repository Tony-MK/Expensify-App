"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const ReportActionsSkeletonView_1 = require("@components/ReportActionsSkeletonView");
const useCopySelectionHelper_1 = require("@hooks/useCopySelectionHelper");
const useLoadReportActions_1 = require("@hooks/useLoadReportActions");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTransactionsAndViolationsForReport_1 = require("@hooks/useTransactionsAndViolationsForReport");
const Report_1 = require("@libs/actions/Report");
const DateUtils_1 = require("@libs/DateUtils");
const getIsReportFullyVisible_1 = require("@libs/getIsReportFullyVisible");
const MoneyRequestReportUtils_1 = require("@libs/MoneyRequestReportUtils");
const NumberUtils_1 = require("@libs/NumberUtils");
const Performance_1 = require("@libs/Performance");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const markOpenReportEnd_1 = require("@libs/Telemetry/markOpenReportEnd");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const ReportActionsList_1 = require("./ReportActionsList");
const UserTypingEventListener_1 = require("./UserTypingEventListener");
let listOldID = Math.round(Math.random() * 100);
function ReportActionsView({ report, parentReportAction, reportActions: allReportActions, isLoadingInitialReportActions, transactionThreadReportID, hasNewerActions, hasOlderActions, }) {
    (0, useCopySelectionHelper_1.default)();
    const route = (0, native_1.useRoute)();
    const isReportArchived = (0, useReportIsArchived_1.default)(report?.reportID);
    const [transactionThreadReportActions] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThreadReportID}`, {
        selector: (reportActions) => (0, ReportActionsUtils_1.getSortedReportActionsForDisplay)(reportActions, (0, ReportUtils_1.canUserPerformWriteAction)(report, isReportArchived), true),
        canBeMissing: true,
    });
    const [transactionThreadReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReportID}`, { canBeMissing: true });
    const [isLoadingApp] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_APP, { canBeMissing: true });
    const prevTransactionThreadReport = (0, usePrevious_1.default)(transactionThreadReport);
    const reportActionID = route?.params?.reportActionID;
    const prevReportActionID = (0, usePrevious_1.default)(reportActionID);
    const reportPreviewAction = (0, react_1.useMemo)(() => (0, ReportActionsUtils_1.getReportPreviewAction)(report.chatReportID, report.reportID), [report.chatReportID, report.reportID]);
    const didLayout = (0, react_1.useRef)(false);
    const { isOffline } = (0, useNetwork_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const isFocused = (0, native_1.useIsFocused)();
    const [isNavigatingToLinkedMessage, setNavigatingToLinkedMessage] = (0, react_1.useState)(!!reportActionID);
    const prevShouldUseNarrowLayoutRef = (0, react_1.useRef)(shouldUseNarrowLayout);
    const reportID = report.reportID;
    const isReportFullyVisible = (0, react_1.useMemo)(() => (0, getIsReportFullyVisible_1.default)(isFocused), [isFocused]);
    const { transactions: reportTransactions } = (0, useTransactionsAndViolationsForReport_1.default)(reportID);
    const reportTransactionIDs = (0, react_1.useMemo)(() => (0, MoneyRequestReportUtils_1.getAllNonDeletedTransactions)(reportTransactions, allReportActions ?? []).map((transaction) => transaction.transactionID), [reportTransactions, allReportActions]);
    (0, react_1.useEffect)(() => {
        // When we linked to message - we do not need to wait for initial actions - they already exists
        if (!reportActionID || !isOffline) {
            return;
        }
        (0, Report_1.updateLoadingInitialReportAction)(report.reportID);
    }, [isOffline, report.reportID, reportActionID]);
    // Change the list ID only for comment linking to get the positioning right
    const listID = (0, react_1.useMemo)(() => {
        if (!reportActionID && !prevReportActionID) {
            // Keep the old list ID since we're not in the Comment Linking flow
            return listOldID;
        }
        const newID = (0, NumberUtils_1.generateNewRandomInt)(listOldID, 1, Number.MAX_SAFE_INTEGER);
        // eslint-disable-next-line react-compiler/react-compiler
        listOldID = newID;
        return newID;
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [route, reportActionID]);
    // When we are offline before opening an IOU/Expense report,
    // the total of the report and sometimes the expense aren't displayed because these actions aren't returned until `OpenReport` API is complete.
    // We generate a fake created action here if it doesn't exist to display the total whenever possible because the total just depends on report data
    // and we also generate an expense action if the number of expenses in allReportActions is less than the total number of expenses
    // to display at least one expense action to match the total data.
    const reportActionsToDisplay = (0, react_1.useMemo)(() => {
        if (!(0, ReportUtils_1.isMoneyRequestReport)(report) || !allReportActions?.length) {
            return allReportActions;
        }
        const actions = [...allReportActions];
        const lastAction = allReportActions.at(-1);
        if (lastAction && !(0, ReportActionsUtils_1.isCreatedAction)(lastAction)) {
            const optimisticCreatedAction = (0, ReportUtils_1.buildOptimisticCreatedReportAction)(String(report?.ownerAccountID), DateUtils_1.default.subtractMillisecondsFromDateTime(lastAction.created, 1));
            optimisticCreatedAction.pendingAction = null;
            actions.push(optimisticCreatedAction);
        }
        const moneyRequestActions = allReportActions.filter((action) => {
            const originalMessage = (0, ReportActionsUtils_1.isMoneyRequestAction)(action) ? (0, ReportActionsUtils_1.getOriginalMessage)(action) : undefined;
            return ((0, ReportActionsUtils_1.isMoneyRequestAction)(action) &&
                originalMessage &&
                (originalMessage?.type === CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE ||
                    !!(originalMessage?.type === CONST_1.default.IOU.REPORT_ACTION_TYPE.PAY && originalMessage?.IOUDetails) ||
                    originalMessage?.type === CONST_1.default.IOU.REPORT_ACTION_TYPE.TRACK));
        });
        if (report.total && moneyRequestActions.length < (reportPreviewAction?.childMoneyRequestCount ?? 0) && (0, EmptyObject_1.isEmptyObject)(transactionThreadReport)) {
            const optimisticIOUAction = (0, ReportUtils_1.buildOptimisticIOUReportAction)({
                type: CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
                amount: 0,
                currency: CONST_1.default.CURRENCY.USD,
                comment: '',
                participants: [],
                transactionID: (0, NumberUtils_1.rand64)(),
                iouReportID: report.reportID,
                created: DateUtils_1.default.subtractMillisecondsFromDateTime(actions.at(-1)?.created ?? '', 1),
            });
            moneyRequestActions.push(optimisticIOUAction);
            actions.splice(actions.length - 1, 0, optimisticIOUAction);
        }
        // Update pending action of created action if we have some requests that are pending
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const createdAction = actions.pop();
        if (moneyRequestActions.filter((action) => !!action.pendingAction).length > 0) {
            createdAction.pendingAction = CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE;
        }
        return [...actions, createdAction];
    }, [allReportActions, report, transactionThreadReport, reportPreviewAction]);
    // Get a sorted array of reportActions for both the current report and the transaction thread report associated with this report (if there is one)
    // so that we display transaction-level and report-level report actions in order in the one-transaction view
    const reportActions = (0, react_1.useMemo)(() => (reportActionsToDisplay ? (0, ReportActionsUtils_1.getCombinedReportActions)(reportActionsToDisplay, transactionThreadReportID ?? null, transactionThreadReportActions ?? []) : []), [reportActionsToDisplay, transactionThreadReportActions, transactionThreadReportID]);
    const parentReportActionForTransactionThread = (0, react_1.useMemo)(() => (0, EmptyObject_1.isEmptyObject)(transactionThreadReportActions)
        ? undefined
        : allReportActions?.find((action) => action.reportActionID === transactionThreadReport?.parentReportActionID), [allReportActions, transactionThreadReportActions, transactionThreadReport?.parentReportActionID]);
    const canPerformWriteAction = (0, ReportUtils_1.canUserPerformWriteAction)(report, isReportArchived);
    const visibleReportActions = (0, react_1.useMemo)(() => reportActions.filter((reportAction) => (isOffline || (0, ReportActionsUtils_1.isDeletedParentAction)(reportAction) || reportAction.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE || reportAction.errors) &&
        (0, ReportActionsUtils_1.shouldReportActionBeVisible)(reportAction, reportAction.reportActionID, canPerformWriteAction) &&
        (0, ReportActionsUtils_1.isIOUActionMatchingTransactionList)(reportAction, reportTransactionIDs)), [reportActions, isOffline, canPerformWriteAction, reportTransactionIDs]);
    const newestReportAction = (0, react_1.useMemo)(() => reportActions?.at(0), [reportActions]);
    const mostRecentIOUReportActionID = (0, react_1.useMemo)(() => (0, ReportActionsUtils_1.getMostRecentIOURequestActionID)(reportActions), [reportActions]);
    const lastActionCreated = visibleReportActions.at(0)?.created;
    const isNewestAction = (actionCreated, lastVisibleActionCreated) => actionCreated && lastVisibleActionCreated ? actionCreated >= lastVisibleActionCreated : actionCreated === lastVisibleActionCreated;
    const hasNewestReportAction = isNewestAction(lastActionCreated, report.lastVisibleActionCreated) || isNewestAction(lastActionCreated, transactionThreadReport?.lastVisibleActionCreated);
    const isSingleExpenseReport = reportPreviewAction?.childMoneyRequestCount === 1;
    const isMissingTransactionThreadReportID = !transactionThreadReport?.reportID;
    const isReportDataIncomplete = isSingleExpenseReport && isMissingTransactionThreadReportID;
    const isMissingReportActions = visibleReportActions.length === 0;
    (0, react_1.useEffect)(() => {
        // update ref with current state
        prevShouldUseNarrowLayoutRef.current = shouldUseNarrowLayout;
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [shouldUseNarrowLayout, reportActions, isReportFullyVisible]);
    const allReportActionIDs = (0, react_1.useMemo)(() => {
        return allReportActions?.map((action) => action.reportActionID) ?? [];
    }, [allReportActions]);
    const { loadOlderChats, loadNewerChats } = (0, useLoadReportActions_1.default)({
        reportID,
        reportActionID,
        reportActions,
        allReportActionIDs,
        transactionThreadReport,
        hasOlderActions,
        hasNewerActions,
    });
    /**
     * Runs when the FlatList finishes laying out
     */
    const recordTimeToMeasureItemLayout = (0, react_1.useCallback)(() => {
        if (didLayout.current) {
            return;
        }
        didLayout.current = true;
        (0, markOpenReportEnd_1.default)();
    }, []);
    // Check if the first report action in the list is the one we're currently linked to
    const isTheFirstReportActionIsLinked = newestReportAction?.reportActionID === reportActionID;
    (0, react_1.useEffect)(() => {
        let timerID;
        if (isTheFirstReportActionIsLinked) {
            setNavigatingToLinkedMessage(true);
        }
        else {
            // After navigating to the linked reportAction, apply this to correctly set
            // `autoscrollToTopThreshold` prop when linking to a specific reportAction.
            react_native_1.InteractionManager.runAfterInteractions(() => {
                // Using a short delay to ensure the view is updated after interactions
                timerID = setTimeout(() => setNavigatingToLinkedMessage(false), 10);
            });
        }
        return () => {
            if (!timerID) {
                return;
            }
            clearTimeout(timerID);
        };
    }, [isTheFirstReportActionIsLinked]);
    // Show skeleton while loading initial report actions when data is incomplete/missing and online
    const shouldShowSkeletonForInitialLoad = isLoadingInitialReportActions && (isReportDataIncomplete || isMissingReportActions) && !isOffline;
    // Show skeleton while the app is loading and we're online
    const shouldShowSkeletonForAppLoad = isLoadingApp && !isOffline;
    if (shouldShowSkeletonForInitialLoad ?? shouldShowSkeletonForAppLoad) {
        return <ReportActionsSkeletonView_1.default />;
    }
    if (isMissingReportActions) {
        return <ReportActionsSkeletonView_1.default shouldAnimate={false}/>;
    }
    // AutoScroll is disabled when we do linking to a specific reportAction
    const shouldEnableAutoScroll = (hasNewestReportAction && (!reportActionID || !isNavigatingToLinkedMessage)) || (transactionThreadReport && !prevTransactionThreadReport);
    return (<>
            <ReportActionsList_1.default report={report} transactionThreadReport={transactionThreadReport} parentReportAction={parentReportAction} parentReportActionForTransactionThread={parentReportActionForTransactionThread} onLayout={recordTimeToMeasureItemLayout} sortedReportActions={reportActions} sortedVisibleReportActions={visibleReportActions} mostRecentIOUReportActionID={mostRecentIOUReportActionID} loadOlderChats={loadOlderChats} loadNewerChats={loadNewerChats} listID={listID} shouldEnableAutoScrollToTopThreshold={shouldEnableAutoScroll}/>
            <UserTypingEventListener_1.default report={report}/>
        </>);
}
ReportActionsView.displayName = 'ReportActionsView';
exports.default = Performance_1.default.withRenderTrace({ id: '<ReportActionsView> rendering' })(ReportActionsView);
