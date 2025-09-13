"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const portal_1 = require("@gorhom/portal");
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const Provider_1 = require("@components/DragAndDrop/Provider");
const MoneyRequestReportView_1 = require("@components/MoneyRequestReportView/MoneyRequestReportView");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useIsReportReadyToDisplay_1 = require("@hooks/useIsReportReadyToDisplay");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePaginatedReportActions_1 = require("@hooks/usePaginatedReportActions");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useTransactionsAndViolationsForReport_1 = require("@hooks/useTransactionsAndViolationsForReport");
const getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
const MoneyRequestReportUtils_1 = require("@libs/MoneyRequestReportUtils");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const Navigation_1 = require("@navigation/Navigation");
const ReactionListWrapper_1 = require("@pages/home/ReactionListWrapper");
const Report_1 = require("@userActions/Report");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReportScreenContext_1 = require("@src/pages/home/ReportScreenContext");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const defaultReportMetadata = {
    isLoadingInitialReportActions: true,
    isLoadingOlderReportActions: false,
    hasLoadingOlderReportActionsError: false,
    isLoadingNewerReportActions: false,
    hasLoadingNewerReportActionsError: false,
    isOptimisticReport: false,
};
function SearchMoneyRequestReportPage({ route }) {
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const reportIDFromRoute = (0, getNonEmptyStringOnyxID_1.default)(route.params?.reportID);
    const [report] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportIDFromRoute}`, { allowStaleData: true, canBeMissing: true });
    const [reportMetadata = defaultReportMetadata] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${reportIDFromRoute}`, { canBeMissing: true, allowStaleData: true });
    const [policies = (0, EmptyObject_1.getEmptyObject)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { allowStaleData: true, canBeMissing: false });
    const policy = policies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${report?.policyID}`];
    const [isLoadingApp] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_APP, { canBeMissing: true });
    const isReportArchived = (0, useReportIsArchived_1.default)(report?.reportID);
    const { isEditingDisabled, isCurrentReportLoadedFromOnyx } = (0, useIsReportReadyToDisplay_1.default)(report, reportIDFromRoute, isReportArchived);
    const [scrollPosition, setScrollPosition] = (0, react_1.useState)({});
    const flatListRef = (0, react_1.useRef)(null);
    const actionListValue = (0, react_1.useMemo)(() => ({ flatListRef, scrollPosition, setScrollPosition }), [flatListRef, scrollPosition, setScrollPosition]);
    const [chatReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report?.chatReportID}`, { canBeMissing: true });
    const { reportActions: unfilteredReportActions } = (0, usePaginatedReportActions_1.default)(reportIDFromRoute);
    const { transactions: allReportTransactions } = (0, useTransactionsAndViolationsForReport_1.default)(reportIDFromRoute);
    const reportActions = (0, react_1.useMemo)(() => (0, ReportActionsUtils_1.getFilteredReportActionsForReportView)(unfilteredReportActions), [unfilteredReportActions]);
    const reportTransactions = (0, react_1.useMemo)(() => (0, MoneyRequestReportUtils_1.getAllNonDeletedTransactions)(allReportTransactions, reportActions), [allReportTransactions, reportActions]);
    const visibleTransactions = (0, react_1.useMemo)(() => reportTransactions?.filter((transaction) => isOffline || transaction.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE), [reportTransactions, isOffline]);
    const reportTransactionIDs = (0, react_1.useMemo)(() => visibleTransactions?.map((transaction) => transaction.transactionID), [visibleTransactions]);
    const transactionThreadReportID = (0, ReportActionsUtils_1.getOneTransactionThreadReportID)(report, chatReport, reportActions ?? [], isOffline, reportTransactionIDs);
    const oneTransactionID = reportTransactions.at(0)?.transactionID;
    const reportID = report?.reportID;
    (0, react_1.useEffect)(() => {
        if (transactionThreadReportID === CONST_1.default.FAKE_REPORT_ID && oneTransactionID) {
            const iouAction = (0, ReportActionsUtils_1.getIOUActionForTransactionID)(reportActions, oneTransactionID);
            (0, Report_1.createTransactionThreadReport)(report, iouAction);
            return;
        }
        (0, Report_1.openReport)(reportIDFromRoute, '', [], undefined, undefined, false, [], undefined);
        // We don't want this hook to re-run on the every report change
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [reportIDFromRoute, transactionThreadReportID]);
    // eslint-disable-next-line rulesdir/no-negated-variables
    const shouldShowNotFoundPage = (0, react_1.useMemo)(() => {
        if (isLoadingApp !== false) {
            return false;
        }
        // eslint-disable-next-line react-compiler/react-compiler
        if (!reportID && !reportMetadata?.isLoadingInitialReportActions) {
            // eslint-disable-next-line react-compiler/react-compiler
            return true;
        }
        return !!reportID && !(0, ReportUtils_1.isValidReportIDFromPath)(reportID);
    }, 
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    [reportID, reportMetadata?.isLoadingInitialReportActions]);
    if (shouldUseNarrowLayout) {
        return (<ReportScreenContext_1.ActionListContext.Provider value={actionListValue}>
                <ReactionListWrapper_1.default>
                    <ScreenWrapper_1.default testID={SearchMoneyRequestReportPage.displayName} shouldEnableMaxHeight offlineIndicatorStyle={styles.mtAuto} headerGapStyles={styles.searchHeaderGap}>
                        <FullPageNotFoundView_1.default shouldShow={shouldShowNotFoundPage} subtitleKey="notFound.noAccess" subtitleStyle={[styles.textSupporting]} shouldDisplaySearchRouter shouldShowBackButton={shouldUseNarrowLayout} onBackButtonPress={Navigation_1.default.goBack}>
                            <Provider_1.default isDisabled={isEditingDisabled}>
                                <MoneyRequestReportView_1.default report={report} reportMetadata={reportMetadata} policy={policy} shouldDisplayReportFooter={isCurrentReportLoadedFromOnyx} backToRoute={route.params.backTo}/>
                            </Provider_1.default>
                        </FullPageNotFoundView_1.default>
                    </ScreenWrapper_1.default>
                </ReactionListWrapper_1.default>
            </ReportScreenContext_1.ActionListContext.Provider>);
    }
    return (<ReportScreenContext_1.ActionListContext.Provider value={actionListValue}>
            <ReactionListWrapper_1.default>
                <ScreenWrapper_1.default testID={SearchMoneyRequestReportPage.displayName} shouldEnableMaxHeight offlineIndicatorStyle={styles.mtAuto} headerGapStyles={[styles.searchHeaderGap, styles.h0]}>
                    <react_native_1.View style={[styles.searchSplitContainer, styles.flexColumn, styles.flex1]}>
                        <FullPageNotFoundView_1.default shouldShow={shouldShowNotFoundPage} subtitleKey="notFound.noAccess" subtitleStyle={[styles.textSupporting]} shouldDisplaySearchRouter shouldShowBackButton={shouldUseNarrowLayout} onBackButtonPress={Navigation_1.default.goBack}>
                            <Provider_1.default isDisabled={isEditingDisabled}>
                                <react_native_1.View style={[styles.flex1, styles.justifyContentEnd, styles.overflowHidden]}>
                                    <MoneyRequestReportView_1.default report={report} reportMetadata={reportMetadata} policy={policy} shouldDisplayReportFooter={isCurrentReportLoadedFromOnyx} backToRoute={route.params.backTo}/>
                                </react_native_1.View>
                                <portal_1.PortalHost name="suggestions"/>
                            </Provider_1.default>
                        </FullPageNotFoundView_1.default>
                    </react_native_1.View>
                </ScreenWrapper_1.default>
            </ReactionListWrapper_1.default>
        </ReportScreenContext_1.ActionListContext.Provider>);
}
SearchMoneyRequestReportPage.displayName = 'SearchMoneyRequestReportPage';
exports.default = SearchMoneyRequestReportPage;
