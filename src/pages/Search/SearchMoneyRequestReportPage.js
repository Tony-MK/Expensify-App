"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var portal_1 = require("@gorhom/portal");
var react_1 = require("react");
var react_native_1 = require("react-native");
var FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
var Provider_1 = require("@components/DragAndDrop/Provider");
var MoneyRequestReportView_1 = require("@components/MoneyRequestReportView/MoneyRequestReportView");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var useIsReportReadyToDisplay_1 = require("@hooks/useIsReportReadyToDisplay");
var useNetwork_1 = require("@hooks/useNetwork");
var useOnyx_1 = require("@hooks/useOnyx");
var usePaginatedReportActions_1 = require("@hooks/usePaginatedReportActions");
var useReportIsArchived_1 = require("@hooks/useReportIsArchived");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var useTransactionsAndViolationsForReport_1 = require("@hooks/useTransactionsAndViolationsForReport");
var getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
var MoneyRequestReportUtils_1 = require("@libs/MoneyRequestReportUtils");
var ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var Navigation_1 = require("@navigation/Navigation");
var ReactionListWrapper_1 = require("@pages/home/ReactionListWrapper");
var Report_1 = require("@userActions/Report");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ReportScreenContext_1 = require("@src/pages/home/ReportScreenContext");
var EmptyObject_1 = require("@src/types/utils/EmptyObject");
var defaultReportMetadata = {
    isLoadingInitialReportActions: true,
    isLoadingOlderReportActions: false,
    hasLoadingOlderReportActionsError: false,
    isLoadingNewerReportActions: false,
    hasLoadingNewerReportActionsError: false,
    isOptimisticReport: false,
};
function SearchMoneyRequestReportPage(_a) {
    var _b, _c;
    var route = _a.route;
    var shouldUseNarrowLayout = (0, useResponsiveLayout_1.default)().shouldUseNarrowLayout;
    var styles = (0, useThemeStyles_1.default)();
    var isOffline = (0, useNetwork_1.default)().isOffline;
    var reportIDFromRoute = (0, getNonEmptyStringOnyxID_1.default)((_b = route.params) === null || _b === void 0 ? void 0 : _b.reportID);
    var report = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(reportIDFromRoute), { allowStaleData: true, canBeMissing: true })[0];
    var _d = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_METADATA).concat(reportIDFromRoute), { canBeMissing: true, allowStaleData: true })[0], reportMetadata = _d === void 0 ? defaultReportMetadata : _d;
    var _e = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { allowStaleData: true, canBeMissing: false })[0], policies = _e === void 0 ? (0, EmptyObject_1.getEmptyObject)() : _e;
    var policy = policies === null || policies === void 0 ? void 0 : policies["".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(report === null || report === void 0 ? void 0 : report.policyID)];
    var isLoadingApp = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_APP, { canBeMissing: true })[0];
    var isReportArchived = (0, useReportIsArchived_1.default)(report === null || report === void 0 ? void 0 : report.reportID);
    var _f = (0, useIsReportReadyToDisplay_1.default)(report, reportIDFromRoute, isReportArchived), isEditingDisabled = _f.isEditingDisabled, isCurrentReportLoadedFromOnyx = _f.isCurrentReportLoadedFromOnyx;
    var _g = (0, react_1.useState)({}), scrollPosition = _g[0], setScrollPosition = _g[1];
    var flatListRef = (0, react_1.useRef)(null);
    var actionListValue = (0, react_1.useMemo)(function () { return ({ flatListRef: flatListRef, scrollPosition: scrollPosition, setScrollPosition: setScrollPosition }); }, [flatListRef, scrollPosition, setScrollPosition]);
    var chatReport = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(report === null || report === void 0 ? void 0 : report.chatReportID), { canBeMissing: true })[0];
    var unfilteredReportActions = (0, usePaginatedReportActions_1.default)(reportIDFromRoute).reportActions;
    var allReportTransactions = (0, useTransactionsAndViolationsForReport_1.default)(reportIDFromRoute).transactions;
    var reportActions = (0, react_1.useMemo)(function () { return (0, ReportActionsUtils_1.getFilteredReportActionsForReportView)(unfilteredReportActions); }, [unfilteredReportActions]);
    var reportTransactions = (0, react_1.useMemo)(function () { return (0, MoneyRequestReportUtils_1.getAllNonDeletedTransactions)(allReportTransactions, reportActions); }, [allReportTransactions, reportActions]);
    var visibleTransactions = (0, react_1.useMemo)(function () { return reportTransactions === null || reportTransactions === void 0 ? void 0 : reportTransactions.filter(function (transaction) { return isOffline || transaction.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE; }); }, [reportTransactions, isOffline]);
    var reportTransactionIDs = (0, react_1.useMemo)(function () { return visibleTransactions === null || visibleTransactions === void 0 ? void 0 : visibleTransactions.map(function (transaction) { return transaction.transactionID; }); }, [visibleTransactions]);
    var transactionThreadReportID = (0, ReportActionsUtils_1.getOneTransactionThreadReportID)(report, chatReport, reportActions !== null && reportActions !== void 0 ? reportActions : [], isOffline, reportTransactionIDs);
    var oneTransactionID = (_c = reportTransactions.at(0)) === null || _c === void 0 ? void 0 : _c.transactionID;
    var reportID = report === null || report === void 0 ? void 0 : report.reportID;
    (0, react_1.useEffect)(function () {
        if (transactionThreadReportID === CONST_1.default.FAKE_REPORT_ID && oneTransactionID) {
            var iouAction = (0, ReportActionsUtils_1.getIOUActionForTransactionID)(reportActions, oneTransactionID);
            (0, Report_1.createTransactionThreadReport)(report, iouAction);
            return;
        }
        (0, Report_1.openReport)(reportIDFromRoute, '', [], undefined, undefined, false, [], undefined);
        // We don't want this hook to re-run on the every report change
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [reportIDFromRoute, transactionThreadReportID]);
    // eslint-disable-next-line rulesdir/no-negated-variables
    var shouldShowNotFoundPage = (0, react_1.useMemo)(function () {
        if (isLoadingApp !== false) {
            return false;
        }
        // eslint-disable-next-line react-compiler/react-compiler
        if (!reportID && !(reportMetadata === null || reportMetadata === void 0 ? void 0 : reportMetadata.isLoadingInitialReportActions)) {
            // eslint-disable-next-line react-compiler/react-compiler
            return true;
        }
        return !!reportID && !(0, ReportUtils_1.isValidReportIDFromPath)(reportID);
    }, 
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    [reportID, reportMetadata === null || reportMetadata === void 0 ? void 0 : reportMetadata.isLoadingInitialReportActions]);
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
