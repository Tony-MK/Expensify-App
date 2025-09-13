"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const portal_1 = require("@gorhom/portal");
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderGap_1 = require("@components/HeaderGap");
const MoneyReportHeader_1 = require("@components/MoneyReportHeader");
const MoneyRequestHeader_1 = require("@components/MoneyRequestHeader");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const ReportActionsSkeletonView_1 = require("@components/ReportActionsSkeletonView");
const ReportHeaderSkeletonView_1 = require("@components/ReportHeaderSkeletonView");
const useNetwork_1 = require("@hooks/useNetwork");
const useNewTransactions_1 = require("@hooks/useNewTransactions");
const useOnyx_1 = require("@hooks/useOnyx");
const usePaginatedReportActions_1 = require("@hooks/usePaginatedReportActions");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useTransactionsAndViolationsForReport_1 = require("@hooks/useTransactionsAndViolationsForReport");
const Report_1 = require("@libs/actions/Report");
const getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
const Log_1 = require("@libs/Log");
const MoneyRequestReportUtils_1 = require("@libs/MoneyRequestReportUtils");
const navigationRef_1 = require("@libs/Navigation/navigationRef");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
const Navigation_1 = require("@navigation/Navigation");
const ReportActionsView_1 = require("@pages/home/report/ReportActionsView");
const ReportFooter_1 = require("@pages/home/report/ReportFooter");
const CONST_1 = require("@src/CONST");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const MoneyRequestReportActionsList_1 = require("./MoneyRequestReportActionsList");
function goBackFromSearchMoneyRequest() {
    const rootState = navigationRef_1.default.getRootState();
    const lastRoute = rootState.routes.at(-1);
    if (lastRoute?.name !== NAVIGATORS_1.default.SEARCH_FULLSCREEN_NAVIGATOR) {
        Log_1.default.hmmm('[goBackFromSearchMoneyRequest()] goBackFromSearchMoneyRequest was called from a different navigator than SearchFullscreenNavigator.');
        return;
    }
    if (rootState.routes.length > 1) {
        Navigation_1.default.goBack();
        return;
    }
    Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ROOT.getRoute({ query: (0, SearchQueryUtils_1.buildCannedSearchQuery)() }));
}
function InitialLoadingSkeleton({ styles }) {
    return (<react_native_1.View style={[styles.flex1]}>
            <react_native_1.View style={[styles.appContentHeader, styles.borderBottom]}>
                <ReportHeaderSkeletonView_1.default onBackButtonPress={() => { }}/>
            </react_native_1.View>
            <ReportActionsSkeletonView_1.default />
        </react_native_1.View>);
}
function getParentReportAction(parentReportActions, parentReportActionID) {
    if (!parentReportActions || !parentReportActionID) {
        return;
    }
    return parentReportActions[parentReportActionID];
}
function MoneyRequestReportView({ report, policy, reportMetadata, shouldDisplayReportFooter, backToRoute }) {
    const styles = (0, useThemeStyles_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const reportID = report?.reportID;
    const [isLoadingApp] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_APP, { canBeMissing: true });
    const [isComposerFullSize = false] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_IS_COMPOSER_FULL_SIZE}${reportID}`, { canBeMissing: true });
    const { reportPendingAction, reportErrors } = (0, ReportUtils_1.getReportOfflinePendingActionAndErrors)(report);
    const [chatReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${(0, getNonEmptyStringOnyxID_1.default)(report?.chatReportID)}`, { canBeMissing: true });
    const { reportActions: unfilteredReportActions, hasNewerActions, hasOlderActions } = (0, usePaginatedReportActions_1.default)(reportID);
    const reportActions = (0, ReportActionsUtils_1.getFilteredReportActionsForReportView)(unfilteredReportActions);
    const { transactions: reportTransactions, violations: allReportViolations } = (0, useTransactionsAndViolationsForReport_1.default)(reportID);
    const transactions = (0, react_1.useMemo)(() => (0, MoneyRequestReportUtils_1.getAllNonDeletedTransactions)(reportTransactions, reportActions), [reportTransactions, reportActions]);
    const visibleTransactions = transactions?.filter((transaction) => isOffline || transaction.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE);
    const reportTransactionIDs = visibleTransactions?.map((transaction) => transaction.transactionID);
    const transactionThreadReportID = (0, ReportActionsUtils_1.getOneTransactionThreadReportID)(report, chatReport, reportActions ?? [], isOffline, reportTransactionIDs);
    const newTransactions = (0, useNewTransactions_1.default)(reportMetadata?.hasOnceLoadedReportActions, transactions);
    const [parentReportAction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${(0, getNonEmptyStringOnyxID_1.default)(report?.parentReportID)}`, {
        canEvict: false,
        canBeMissing: true,
        selector: (parentReportActions) => getParentReportAction(parentReportActions, report?.parentReportActionID),
    });
    const lastReportAction = [...reportActions, parentReportAction].find((action) => (0, ReportUtils_1.canEditReportAction)(action) && !(0, ReportActionsUtils_1.isMoneyRequestAction)(action));
    const isLoadingInitialReportActions = reportMetadata?.isLoadingInitialReportActions;
    const dismissReportCreationError = (0, react_1.useCallback)(() => {
        goBackFromSearchMoneyRequest();
        react_native_1.InteractionManager.runAfterInteractions(() => (0, Report_1.removeFailedReport)(reportID));
    }, [reportID]);
    // Special case handling a report that is a transaction thread
    // If true we will use standard `ReportActionsView` to display report data and a special header, anything else is handled via `MoneyRequestReportActionsList`
    const isTransactionThreadView = (0, ReportUtils_1.isReportTransactionThread)(report);
    // Prevent the empty state flash by ensuring transaction data is fully loaded before deciding which view to render
    // We need to wait for both the selector to finish AND ensure we're not in a loading state where transactions could still populate
    const shouldWaitForTransactions = (0, MoneyRequestReportUtils_1.shouldWaitForTransactions)(report, transactions, reportMetadata);
    const isEmptyTransactionReport = visibleTransactions && visibleTransactions.length === 0 && transactionThreadReportID === undefined;
    const shouldDisplayMoneyRequestActionsList = !!isEmptyTransactionReport || (0, MoneyRequestReportUtils_1.shouldDisplayReportTableView)(report, visibleTransactions ?? []);
    const reportHeaderView = (0, react_1.useMemo)(() => isTransactionThreadView ? (<MoneyRequestHeader_1.default report={report} policy={policy} parentReportAction={parentReportAction} onBackButtonPress={() => {
            if (!backToRoute) {
                goBackFromSearchMoneyRequest();
                return;
            }
            Navigation_1.default.goBack(backToRoute);
        }}/>) : (<MoneyReportHeader_1.default report={report} policy={policy} reportActions={reportActions} transactionThreadReportID={transactionThreadReportID} isLoadingInitialReportActions={isLoadingInitialReportActions} shouldDisplayBackButton onBackButtonPress={() => {
            if (!backToRoute) {
                goBackFromSearchMoneyRequest();
                return;
            }
            Navigation_1.default.goBack(backToRoute);
        }}/>), [backToRoute, isLoadingInitialReportActions, isTransactionThreadView, parentReportAction, policy, report, reportActions, transactionThreadReportID]);
    if (!!(isLoadingInitialReportActions && reportActions.length === 0 && !isOffline) || shouldWaitForTransactions) {
        return <InitialLoadingSkeleton styles={styles}/>;
    }
    if (reportActions.length === 0) {
        return <ReportActionsSkeletonView_1.default shouldAnimate={false}/>;
    }
    if (!report) {
        return;
    }
    if (isLoadingApp) {
        return (<react_native_1.View style={styles.flex1}>
                <HeaderGap_1.default />
                <ReportHeaderSkeletonView_1.default />
                <ReportActionsSkeletonView_1.default />
                {shouldDisplayReportFooter ? (<ReportFooter_1.default report={report} reportMetadata={reportMetadata} policy={policy} pendingAction={reportPendingAction} isComposerFullSize={!!isComposerFullSize} lastReportAction={lastReportAction}/>) : null}
            </react_native_1.View>);
    }
    return (<react_native_1.View style={styles.flex1}>
            <OfflineWithFeedback_1.default pendingAction={reportPendingAction} errors={reportErrors} onClose={dismissReportCreationError} needsOffscreenAlphaCompositing style={styles.flex1} contentContainerStyle={styles.flex1} errorRowStyles={[styles.ph5, styles.mv2]}>
                <HeaderGap_1.default />
                {reportHeaderView}
                <react_native_1.View style={[styles.overflowHidden, styles.justifyContentEnd, styles.flex1]}>
                    {shouldDisplayMoneyRequestActionsList ? (<MoneyRequestReportActionsList_1.default report={report} policy={policy} transactions={visibleTransactions} newTransactions={newTransactions} reportActions={reportActions} violations={allReportViolations} hasOlderActions={hasOlderActions} hasNewerActions={hasNewerActions} showReportActionsLoadingState={isLoadingInitialReportActions && !reportMetadata?.hasOnceLoadedReportActions}/>) : (<ReportActionsView_1.default report={report} reportActions={reportActions} isLoadingInitialReportActions={reportMetadata?.isLoadingInitialReportActions} hasNewerActions={hasNewerActions} hasOlderActions={hasOlderActions} parentReportAction={parentReportAction} transactionThreadReportID={transactionThreadReportID}/>)}
                    {shouldDisplayReportFooter ? (<>
                            <ReportFooter_1.default report={report} reportMetadata={reportMetadata} policy={policy} pendingAction={reportPendingAction} isComposerFullSize={!!isComposerFullSize} lastReportAction={lastReportAction} reportTransactions={transactions}/>
                            <portal_1.PortalHost name="suggestions"/>
                        </>) : null}
                </react_native_1.View>
            </OfflineWithFeedback_1.default>
        </react_native_1.View>);
}
MoneyRequestReportView.displayName = 'MoneyRequestReportView';
exports.default = MoneyRequestReportView;
