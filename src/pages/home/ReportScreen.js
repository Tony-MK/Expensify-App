"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const portal_1 = require("@gorhom/portal");
const native_1 = require("@react-navigation/native");
const fast_equals_1 = require("fast-equals");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Banner_1 = require("@components/Banner");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const Provider_1 = require("@components/DragAndDrop/Provider");
const Expensicons = require("@components/Icon/Expensicons");
const MoneyReportHeader_1 = require("@components/MoneyReportHeader");
const MoneyRequestHeader_1 = require("@components/MoneyRequestHeader");
const MoneyRequestReportActionsList_1 = require("@components/MoneyRequestReportView/MoneyRequestReportActionsList");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const ReportActionsSkeletonView_1 = require("@components/ReportActionsSkeletonView");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useAppFocusEvent_1 = require("@hooks/useAppFocusEvent");
const useCurrentReportID_1 = require("@hooks/useCurrentReportID");
const useDeepCompareRef_1 = require("@hooks/useDeepCompareRef");
const useIsReportReadyToDisplay_1 = require("@hooks/useIsReportReadyToDisplay");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useNewTransactions_1 = require("@hooks/useNewTransactions");
const useOnyx_1 = require("@hooks/useOnyx");
const usePaginatedReportActions_1 = require("@hooks/usePaginatedReportActions");
const usePermissions_1 = require("@hooks/usePermissions");
const usePrevious_1 = require("@hooks/usePrevious");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useTransactionsAndViolationsForReport_1 = require("@hooks/useTransactionsAndViolationsForReport");
const useViewportOffsetTop_1 = require("@hooks/useViewportOffsetTop");
const EmojiPickerAction_1 = require("@libs/actions/EmojiPickerAction");
const getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
const Log_1 = require("@libs/Log");
const MoneyRequestReportUtils_1 = require("@libs/MoneyRequestReportUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const clearReportNotifications_1 = require("@libs/Notification/clearReportNotifications");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const Composer_1 = require("@userActions/Composer");
const Report_1 = require("@userActions/Report");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const HeaderView_1 = require("./HeaderView");
const ReactionListWrapper_1 = require("./ReactionListWrapper");
const ReportActionsView_1 = require("./report/ReportActionsView");
const ReportFooter_1 = require("./report/ReportFooter");
const ReportScreenContext_1 = require("./ReportScreenContext");
const defaultReportMetadata = {
    hasOnceLoadedReportActions: false,
    isLoadingInitialReportActions: true,
    isLoadingOlderReportActions: false,
    hasLoadingOlderReportActionsError: false,
    isLoadingNewerReportActions: false,
    hasLoadingNewerReportActionsError: false,
    isOptimisticReport: false,
};
const reportDetailScreens = [
    ...Object.values(SCREENS_1.default.REPORT_DETAILS),
    ...Object.values(SCREENS_1.default.REPORT_SETTINGS),
    ...Object.values(SCREENS_1.default.PRIVATE_NOTES),
    ...Object.values(SCREENS_1.default.REPORT_PARTICIPANTS),
];
/**
 * Check is the report is deleted.
 * We currently use useMemo to memorize every properties of the report
 * so we can't check using isEmpty.
 *
 * @param report
 */
function isEmpty(report) {
    if ((0, EmptyObject_1.isEmptyObject)(report)) {
        return true;
    }
    return !Object.values(report).some((value) => value !== undefined && value !== '');
}
function getParentReportAction(parentReportActions, parentReportActionID) {
    if (!parentReportActions || !parentReportActionID) {
        return;
    }
    return parentReportActions[parentReportActionID];
}
function ReportScreen({ route, navigation }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const reportIDFromRoute = (0, getNonEmptyStringOnyxID_1.default)(route.params?.reportID);
    const reportActionIDFromRoute = route?.params?.reportActionID;
    const isFocused = (0, native_1.useIsFocused)();
    const prevIsFocused = (0, usePrevious_1.default)(isFocused);
    const firstRenderRef = (0, react_1.useRef)(true);
    const [firstRender, setFirstRender] = (0, react_1.useState)(true);
    const isSkippingOpenReport = (0, react_1.useRef)(false);
    const flatListRef = (0, react_1.useRef)(null);
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const { shouldUseNarrowLayout, isInNarrowPaneModal } = (0, useResponsiveLayout_1.default)();
    const currentReportIDValue = (0, useCurrentReportID_1.default)();
    const [isComposerFullSize = false] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_IS_COMPOSER_FULL_SIZE}${reportIDFromRoute}`, { canBeMissing: true });
    const [accountManagerReportID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT_MANAGER_REPORT_ID, { canBeMissing: true });
    const [accountManagerReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${(0, getNonEmptyStringOnyxID_1.default)(accountManagerReportID)}`, { canBeMissing: true });
    const [userLeavingStatus = false] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_USER_IS_LEAVING_ROOM}${reportIDFromRoute}`, { canBeMissing: true });
    const [reportOnyx] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportIDFromRoute}`, { allowStaleData: true, canBeMissing: true });
    const [reportNameValuePairsOnyx] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${reportIDFromRoute}`, { allowStaleData: true, canBeMissing: true });
    const [reportMetadata = defaultReportMetadata] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${reportIDFromRoute}`, { canBeMissing: true, allowStaleData: true });
    const [policies = (0, EmptyObject_1.getEmptyObject)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { allowStaleData: true, canBeMissing: false });
    const [parentReportAction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${(0, getNonEmptyStringOnyxID_1.default)(reportOnyx?.parentReportID)}`, {
        canEvict: false,
        selector: (parentReportActions) => getParentReportAction(parentReportActions, reportOnyx?.parentReportActionID),
        canBeMissing: true,
    });
    const deletedParentAction = (0, ReportActionsUtils_1.isDeletedParentAction)(parentReportAction);
    const prevDeletedParentAction = (0, usePrevious_1.default)(deletedParentAction);
    const permissions = (0, useDeepCompareRef_1.default)(reportOnyx?.permissions);
    (0, react_1.useEffect)(() => {
        // Don't update if there is a reportID in the params already
        if (route.params.reportID) {
            const reportActionID = route?.params?.reportActionID;
            const isValidReportActionID = reportActionID && (0, ValidationUtils_1.isNumeric)(reportActionID);
            if (reportActionID && !isValidReportActionID) {
                Navigation_1.default.isNavigationReady().then(() => navigation.setParams({ reportActionID: '' }));
            }
            return;
        }
        const lastAccessedReportID = (0, ReportUtils_1.findLastAccessedReport)(!isBetaEnabled(CONST_1.default.BETAS.DEFAULT_ROOMS), !!route.params.openOnAdminRoom)?.reportID;
        // It's possible that reports aren't fully loaded yet
        // in that case the reportID is undefined
        if (!lastAccessedReportID) {
            return;
        }
        Log_1.default.info(`[ReportScreen] no reportID found in params, setting it to lastAccessedReportID: ${lastAccessedReportID}`);
        navigation.setParams({ reportID: lastAccessedReportID });
    }, [isBetaEnabled, navigation, route]);
    const [personalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { canBeMissing: true });
    const chatWithAccountManagerText = (0, react_1.useMemo)(() => {
        if (accountManagerReportID) {
            const participants = (0, ReportUtils_1.getParticipantsAccountIDsForDisplay)(accountManagerReport, false, true);
            const participantPersonalDetails = (0, OptionsListUtils_1.getPersonalDetailsForAccountIDs)([participants?.at(0) ?? -1], personalDetails);
            const participantPersonalDetail = Object.values(participantPersonalDetails).at(0);
            const displayName = (0, PersonalDetailsUtils_1.getDisplayNameOrDefault)(participantPersonalDetail);
            const login = participantPersonalDetail?.login;
            if (displayName && login) {
                return translate('common.chatWithAccountManager', { accountManagerDisplayName: `${displayName} (${login})` });
            }
        }
        return '';
    }, [accountManagerReportID, accountManagerReport, personalDetails, translate]);
    /**
     * Create a lightweight Report so as to keep the re-rendering as light as possible by
     * passing in only the required props.
     *
     * Also, this plays nicely in contrast with Onyx,
     * which creates a new object every time collection changes. Because of this we can't
     * put this into onyx selector as it will be the same.
     */
    const report = (0, react_1.useMemo)(() => reportOnyx && {
        lastReadTime: reportOnyx.lastReadTime,
        reportID: reportOnyx.reportID,
        policyID: reportOnyx.policyID,
        lastVisibleActionCreated: reportOnyx.lastVisibleActionCreated,
        statusNum: reportOnyx.statusNum,
        stateNum: reportOnyx.stateNum,
        writeCapability: reportOnyx.writeCapability,
        type: reportOnyx.type,
        errorFields: reportOnyx.errorFields,
        parentReportID: reportOnyx.parentReportID,
        parentReportActionID: reportOnyx.parentReportActionID,
        chatType: reportOnyx.chatType,
        pendingFields: reportOnyx.pendingFields,
        isDeletedParentAction: reportOnyx.isDeletedParentAction,
        reportName: reportOnyx.reportName,
        description: reportOnyx.description,
        managerID: reportOnyx.managerID,
        total: reportOnyx.total,
        nonReimbursableTotal: reportOnyx.nonReimbursableTotal,
        fieldList: reportOnyx.fieldList,
        ownerAccountID: reportOnyx.ownerAccountID,
        currency: reportOnyx.currency,
        unheldTotal: reportOnyx.unheldTotal,
        unheldNonReimbursableTotal: reportOnyx.unheldNonReimbursableTotal,
        participants: reportOnyx.participants,
        isWaitingOnBankAccount: reportOnyx.isWaitingOnBankAccount,
        iouReportID: reportOnyx.iouReportID,
        isOwnPolicyExpenseChat: reportOnyx.isOwnPolicyExpenseChat,
        isPinned: reportOnyx.isPinned,
        chatReportID: reportOnyx.chatReportID,
        visibility: reportOnyx.visibility,
        oldPolicyName: reportOnyx.oldPolicyName,
        policyName: reportOnyx.policyName,
        private_isArchived: reportNameValuePairsOnyx?.private_isArchived,
        lastMentionedTime: reportOnyx.lastMentionedTime,
        avatarUrl: reportOnyx.avatarUrl,
        permissions,
        invoiceReceiver: reportOnyx.invoiceReceiver,
        policyAvatar: reportOnyx.policyAvatar,
    }, [reportOnyx, reportNameValuePairsOnyx, permissions]);
    const reportID = report?.reportID;
    const [chatReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report?.chatReportID}`, { canBeMissing: true });
    const prevReport = (0, usePrevious_1.default)(report);
    const prevUserLeavingStatus = (0, usePrevious_1.default)(userLeavingStatus);
    const lastReportIDFromRoute = (0, usePrevious_1.default)(reportIDFromRoute);
    const [isLinkingToMessage, setIsLinkingToMessage] = (0, react_1.useState)(!!reportActionIDFromRoute);
    const [currentUserAccountID = -1] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { selector: (value) => value?.accountID, canBeMissing: false });
    const [isLoadingApp] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_APP, { canBeMissing: true });
    const { reportActions: unfilteredReportActions, linkedAction, sortedAllReportActions, hasNewerActions, hasOlderActions } = (0, usePaginatedReportActions_1.default)(reportID, reportActionIDFromRoute);
    // wrapping in useMemo because this is array operation and can cause performance issues
    const reportActions = (0, react_1.useMemo)(() => (0, ReportActionsUtils_1.getFilteredReportActionsForReportView)(unfilteredReportActions), [unfilteredReportActions]);
    const [childReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${linkedAction?.childReportID}`, { canBeMissing: true });
    const [isBannerVisible, setIsBannerVisible] = (0, react_1.useState)(true);
    const [scrollPosition, setScrollPosition] = (0, react_1.useState)({});
    const wasReportAccessibleRef = (0, react_1.useRef)(false);
    const viewportOffsetTop = (0, useViewportOffsetTop_1.default)();
    const { reportPendingAction, reportErrors } = (0, ReportUtils_1.getReportOfflinePendingActionAndErrors)(report);
    const screenWrapperStyle = [styles.appContent, styles.flex1, { marginTop: viewportOffsetTop }];
    const isOptimisticDelete = report?.statusNum === CONST_1.default.REPORT.STATUS_NUM.CLOSED;
    const indexOfLinkedMessage = (0, react_1.useMemo)(() => reportActions.findIndex((obj) => reportActionIDFromRoute && String(obj.reportActionID) === String(reportActionIDFromRoute)), [reportActions, reportActionIDFromRoute]);
    const doesCreatedActionExists = (0, react_1.useCallback)(() => !!reportActions?.findLast((action) => (0, ReportActionsUtils_1.isCreatedAction)(action)), [reportActions]);
    const isLinkedMessageAvailable = indexOfLinkedMessage > -1;
    // The linked report actions should have at least 15 messages (counting as 1 page) above them to fill the screen.
    // If the count is too high (equal to or exceeds the web pagination size / 50) and there are no cached messages in the report,
    // OpenReport will be called each time the user scrolls up the report a bit, clicks on report preview, and then goes back.
    const isLinkedMessagePageReady = isLinkedMessageAvailable && (reportActions.length - indexOfLinkedMessage >= CONST_1.default.REPORT.MIN_INITIAL_REPORT_ACTION_COUNT || doesCreatedActionExists());
    const { transactions: allReportTransactions, violations: allReportViolations } = (0, useTransactionsAndViolationsForReport_1.default)(reportIDFromRoute);
    const reportTransactions = (0, react_1.useMemo)(() => (0, MoneyRequestReportUtils_1.getAllNonDeletedTransactions)(allReportTransactions, reportActions), [allReportTransactions, reportActions]);
    // wrapping in useMemo because this is array operation and can cause performance issues
    const visibleTransactions = (0, react_1.useMemo)(() => reportTransactions?.filter((transaction) => isOffline || transaction.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE), [reportTransactions, isOffline]);
    const reportTransactionIDs = (0, react_1.useMemo)(() => visibleTransactions?.map((transaction) => transaction.transactionID), [visibleTransactions]);
    const transactionThreadReportID = (0, ReportActionsUtils_1.getOneTransactionThreadReportID)(report, chatReport, reportActions ?? [], isOffline, reportTransactionIDs);
    const [transactionThreadReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReportID}`, { canBeMissing: true });
    const [transactionThreadReportActions = (0, EmptyObject_1.getEmptyObject)()] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThreadReportID}`, {
        canBeMissing: true,
    });
    const combinedReportActions = (0, ReportActionsUtils_1.getCombinedReportActions)(reportActions, transactionThreadReportID ?? null, Object.values(transactionThreadReportActions));
    const lastReportAction = [...combinedReportActions, parentReportAction].find((action) => (0, ReportUtils_1.canEditReportAction)(action) && !(0, ReportActionsUtils_1.isMoneyRequestAction)(action));
    // wrapping in useMemo to stabilize children re-rendering
    const policy = policies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${report?.policyID}`];
    const isTopMostReportId = currentReportIDValue?.currentReportID === reportIDFromRoute;
    const didSubscribeToReportLeavingEvents = (0, react_1.useRef)(false);
    const isTransactionThreadView = (0, ReportUtils_1.isReportTransactionThread)(report);
    const isMoneyRequestOrInvoiceReport = (0, ReportUtils_1.isMoneyRequestReport)(report) || (0, ReportUtils_1.isInvoiceReport)(report);
    // Prevent the empty state flash by ensuring transaction data is fully loaded before deciding which view to render
    // We need to wait for both the selector to finish AND ensure we're not in a loading state where transactions could still populate
    const shouldWaitForTransactions = (0, MoneyRequestReportUtils_1.shouldWaitForTransactions)(report, reportTransactions, reportMetadata);
    const newTransactions = (0, useNewTransactions_1.default)(reportMetadata?.hasOnceLoadedReportActions, reportTransactions);
    (0, react_1.useEffect)(() => {
        if (!prevIsFocused || isFocused) {
            return;
        }
        (0, EmojiPickerAction_1.hideEmojiPicker)(true);
    }, [prevIsFocused, isFocused]);
    (0, react_1.useEffect)(() => {
        if (!report?.reportID) {
            wasReportAccessibleRef.current = false;
            return;
        }
        wasReportAccessibleRef.current = true;
    }, [report]);
    const backTo = route?.params?.backTo;
    const onBackButtonPress = (0, react_1.useCallback)(() => {
        if (backTo === SCREENS_1.default.SEARCH.REPORT_RHP) {
            Navigation_1.default.goBack();
            return;
        }
        if (isInNarrowPaneModal) {
            Navigation_1.default.dismissModal();
            return;
        }
        if (Navigation_1.default.getShouldPopToSidebar()) {
            Navigation_1.default.popToSidebar();
            return;
        }
        if (backTo) {
            Navigation_1.default.goBack(backTo);
            return;
        }
        Navigation_1.default.goBack();
    }, [isInNarrowPaneModal, backTo]);
    let headerView = (<HeaderView_1.default reportID={reportIDFromRoute} onNavigationMenuButtonClicked={onBackButtonPress} report={report} parentReportAction={parentReportAction} shouldUseNarrowLayout={shouldUseNarrowLayout}/>);
    if (isTransactionThreadView) {
        headerView = (<MoneyRequestHeader_1.default report={report} policy={policy} parentReportAction={parentReportAction} onBackButtonPress={onBackButtonPress}/>);
    }
    if (isMoneyRequestOrInvoiceReport) {
        headerView = (<MoneyReportHeader_1.default report={report} policy={policy} transactionThreadReportID={transactionThreadReportID} isLoadingInitialReportActions={reportMetadata.isLoadingInitialReportActions} reportActions={reportActions} onBackButtonPress={onBackButtonPress}/>);
    }
    (0, react_1.useEffect)(() => {
        if (!transactionThreadReportID || !route?.params?.reportActionID || !(0, ReportUtils_1.isOneTransactionThread)(childReport, report, linkedAction)) {
            return;
        }
        navigation.setParams({ reportActionID: '' });
    }, [transactionThreadReportID, route?.params?.reportActionID, linkedAction, reportID, navigation, report, childReport]);
    const isReportArchived = (0, useReportIsArchived_1.default)(report?.reportID);
    const { isEditingDisabled, isCurrentReportLoadedFromOnyx } = (0, useIsReportReadyToDisplay_1.default)(report, reportIDFromRoute, isReportArchived);
    const isLinkedActionDeleted = (0, react_1.useMemo)(() => !!linkedAction && !(0, ReportActionsUtils_1.shouldReportActionBeVisible)(linkedAction, linkedAction.reportActionID, (0, ReportUtils_1.canUserPerformWriteAction)(report, isReportArchived)), [linkedAction, report, isReportArchived]);
    const prevIsLinkedActionDeleted = (0, usePrevious_1.default)(linkedAction ? isLinkedActionDeleted : undefined);
    // eslint-disable-next-line react-compiler/react-compiler
    const lastReportActionIDFromRoute = (0, usePrevious_1.default)(!firstRenderRef.current ? reportActionIDFromRoute : undefined);
    const [isNavigatingToDeletedAction, setIsNavigatingToDeletedAction] = (0, react_1.useState)(false);
    const isLinkedActionInaccessibleWhisper = (0, react_1.useMemo)(() => !!linkedAction && (0, ReportActionsUtils_1.isWhisperAction)(linkedAction) && !(linkedAction?.whisperedToAccountIDs ?? []).includes(currentUserAccountID), [currentUserAccountID, linkedAction]);
    const [deleteTransactionNavigateBackUrl] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_DELETE_TRANSACTION_NAVIGATE_BACK_URL, { canBeMissing: true });
    (0, react_1.useEffect)(() => {
        if (!isFocused || !deleteTransactionNavigateBackUrl) {
            return;
        }
        // Clear the URL after all interactions are processed to ensure all updates are completed before hiding the skeleton
        react_native_1.InteractionManager.runAfterInteractions(() => {
            requestAnimationFrame(() => {
                (0, Report_1.clearDeleteTransactionNavigateBackUrl)();
            });
        });
    }, [isFocused, deleteTransactionNavigateBackUrl]);
    // eslint-disable-next-line rulesdir/no-negated-variables
    const shouldShowNotFoundLinkedAction = (!isLinkedActionInaccessibleWhisper && isLinkedActionDeleted && isNavigatingToDeletedAction) ||
        (!reportMetadata?.isLoadingInitialReportActions &&
            !!reportActionIDFromRoute &&
            !!sortedAllReportActions &&
            sortedAllReportActions?.length > 0 &&
            reportActions.length === 0 &&
            !isLinkingToMessage);
    const currentReportIDFormRoute = route.params?.reportID;
    // eslint-disable-next-line rulesdir/no-negated-variables
    const shouldShowNotFoundPage = (0, react_1.useMemo)(() => {
        if (shouldShowNotFoundLinkedAction) {
            return true;
        }
        if (isLoadingApp !== false) {
            return false;
        }
        // eslint-disable-next-line react-compiler/react-compiler
        if (!wasReportAccessibleRef.current && !firstRenderRef.current && !reportID && !isOptimisticDelete && !reportMetadata?.isLoadingInitialReportActions && !userLeavingStatus) {
            // eslint-disable-next-line react-compiler/react-compiler
            return true;
        }
        return !!currentReportIDFormRoute && !(0, ReportUtils_1.isValidReportIDFromPath)(currentReportIDFormRoute);
    }, 
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    [firstRender, shouldShowNotFoundLinkedAction, reportID, isOptimisticDelete, reportMetadata?.isLoadingInitialReportActions, userLeavingStatus, currentReportIDFormRoute]);
    const createOneTransactionThreadReport = (0, react_1.useCallback)(() => {
        const currentReportTransaction = (0, ReportUtils_1.getReportTransactions)(reportID).filter((transaction) => transaction.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE);
        const oneTransactionID = currentReportTransaction.at(0)?.transactionID;
        const iouAction = (0, ReportActionsUtils_1.getIOUActionForReportID)(reportID, oneTransactionID);
        (0, Report_1.createTransactionThreadReport)(report, iouAction);
    }, [report, reportID]);
    const fetchReport = (0, react_1.useCallback)(() => {
        if (reportMetadata.isOptimisticReport && report?.type === CONST_1.default.REPORT.TYPE.CHAT && !(0, ReportUtils_1.isPolicyExpenseChat)(report)) {
            return;
        }
        if (report?.errorFields?.notFound && isOffline) {
            return;
        }
        // If there is one transaction thread that has not yet been created, we should create it.
        if (transactionThreadReportID === CONST_1.default.FAKE_REPORT_ID && !transactionThreadReport) {
            createOneTransactionThreadReport();
            return;
        }
        (0, Report_1.openReport)(reportIDFromRoute, reportActionIDFromRoute);
    }, [
        reportMetadata.isOptimisticReport,
        report,
        isOffline,
        transactionThreadReportID,
        transactionThreadReport,
        reportIDFromRoute,
        reportActionIDFromRoute,
        createOneTransactionThreadReport,
    ]);
    const prevTransactionThreadReportID = (0, usePrevious_1.default)(transactionThreadReportID);
    (0, react_1.useEffect)(() => {
        if (!!prevTransactionThreadReportID || !transactionThreadReportID) {
            return;
        }
        fetchReport();
    }, [fetchReport, prevTransactionThreadReportID, transactionThreadReportID]);
    (0, react_1.useEffect)(() => {
        if (!reportID || !isFocused) {
            return;
        }
        (0, Report_1.updateLastVisitTime)(reportID);
    }, [reportID, isFocused]);
    (0, react_1.useEffect)(() => {
        const skipOpenReportListener = react_native_1.DeviceEventEmitter.addListener(`switchToPreExistingReport_${reportID}`, ({ preexistingReportID }) => {
            if (!preexistingReportID) {
                return;
            }
            isSkippingOpenReport.current = true;
        });
        return () => {
            skipOpenReportListener.remove();
        };
    }, [reportID]);
    const dismissBanner = (0, react_1.useCallback)(() => {
        setIsBannerVisible(false);
    }, []);
    const chatWithAccountManager = (0, react_1.useCallback)(() => {
        Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(accountManagerReportID));
    }, [accountManagerReportID]);
    // Clear notifications for the current report when it's opened and re-focused
    const clearNotifications = (0, react_1.useCallback)(() => {
        // Check if this is the top-most ReportScreen since the Navigator preserves multiple at a time
        if (!isTopMostReportId) {
            return;
        }
        (0, clearReportNotifications_1.default)(reportID);
    }, [reportID, isTopMostReportId]);
    (0, react_1.useEffect)(clearNotifications, [clearNotifications]);
    (0, useAppFocusEvent_1.default)(clearNotifications);
    (0, react_1.useEffect)(() => {
        const interactionTask = react_native_1.InteractionManager.runAfterInteractions(() => {
            (0, Composer_1.setShouldShowComposeInput)(true);
        });
        return () => {
            interactionTask.cancel();
            if (!didSubscribeToReportLeavingEvents.current) {
                return;
            }
            (0, Report_1.unsubscribeFromLeavingRoomReportChannel)(reportID);
        };
        // I'm disabling the warning, as it expects to use exhaustive deps, even though we want this useEffect to run only on the first render.
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    (0, react_1.useEffect)(() => {
        // This function is triggered when a user clicks on a link to navigate to a report.
        // For each link click, we retrieve the report data again, even though it may already be cached.
        // There should be only one openReport execution per page start or navigating
        fetchReport();
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [route, isLinkedMessagePageReady, reportActionIDFromRoute]);
    const prevReportActions = (0, usePrevious_1.default)(reportActions);
    (0, react_1.useEffect)(() => {
        // This function is only triggered when a user is invited to a room after opening the link.
        // When a user opens a room they are not a member of, and the admin then invites them, only the INVITE_TO_ROOM action is available, so the background will be empty and room description is not available.
        // See https://github.com/Expensify/App/issues/57769 for more details
        if (prevReportActions.length !== 0 || reportActions.length !== 1 || reportActions.at(0)?.actionName !== CONST_1.default.REPORT.ACTIONS.TYPE.ROOM_CHANGE_LOG.INVITE_TO_ROOM) {
            return;
        }
        fetchReport();
    }, [prevReportActions, reportActions, fetchReport]);
    // If a user has chosen to leave a thread, and then returns to it (e.g. with the back button), we need to call `openReport` again in order to allow the user to rejoin and to receive real-time updates
    (0, react_1.useEffect)(() => {
        if (!shouldUseNarrowLayout || !isFocused || prevIsFocused || !(0, ReportUtils_1.isChatThread)(report) || !(0, ReportUtils_1.isHiddenForCurrentUser)(report) || isTransactionThreadView) {
            return;
        }
        (0, Report_1.openReport)(reportID);
        // We don't want to run this useEffect every time `report` is changed
        // Excluding shouldUseNarrowLayout from the dependency list to prevent re-triggering on screen resize events.
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [prevIsFocused, report?.participants, isFocused, isTransactionThreadView, reportID]);
    (0, react_1.useEffect)(() => {
        // We don't want this effect to run on the first render.
        if (firstRenderRef.current) {
            firstRenderRef.current = false;
            setFirstRender(false);
            return;
        }
        const onyxReportID = report?.reportID;
        const prevOnyxReportID = prevReport?.reportID;
        const wasReportRemoved = !!prevOnyxReportID && prevOnyxReportID === reportIDFromRoute && !onyxReportID;
        const isRemovalExpectedForReportType = isEmpty(report) && ((0, ReportUtils_1.isMoneyRequest)(prevReport) || (0, ReportUtils_1.isMoneyRequestReport)(prevReport) || (0, ReportUtils_1.isPolicyExpenseChat)(prevReport) || (0, ReportUtils_1.isGroupChat)(prevReport));
        const didReportClose = wasReportRemoved && prevReport.statusNum === CONST_1.default.REPORT.STATUS_NUM.OPEN && report?.statusNum === CONST_1.default.REPORT.STATUS_NUM.CLOSED;
        const isTopLevelPolicyRoomWithNoStatus = !report?.statusNum && !prevReport?.parentReportID && prevReport?.chatType === CONST_1.default.REPORT.CHAT_TYPE.POLICY_ROOM;
        const isClosedTopLevelPolicyRoom = wasReportRemoved && prevReport.statusNum === CONST_1.default.REPORT.STATUS_NUM.OPEN && isTopLevelPolicyRoomWithNoStatus;
        // Navigate to the Concierge chat if the room was removed from another device (e.g. user leaving a room or removed from a room)
        if (
        // non-optimistic case
        (!prevUserLeavingStatus && !!userLeavingStatus) ||
            didReportClose ||
            isRemovalExpectedForReportType ||
            isClosedTopLevelPolicyRoom ||
            (prevDeletedParentAction && !deletedParentAction)) {
            const currentRoute = Navigation_1.navigationRef.getCurrentRoute();
            const isReportDetailOpenInRHP = isTopMostReportId &&
                reportDetailScreens.find((r) => r === currentRoute?.name) &&
                !!currentRoute?.params &&
                typeof currentRoute.params === 'object' &&
                'reportID' in currentRoute.params &&
                reportIDFromRoute === currentRoute.params.reportID;
            // Early return if the report we're passing isn't in a focused state. We only want to navigate to Concierge if the user leaves the room from another device or gets removed from the room while the report is in a focused state.
            // Prevent auto navigation for report in RHP
            if ((!isFocused && !isReportDetailOpenInRHP) || isInNarrowPaneModal) {
                return;
            }
            Navigation_1.default.dismissModal();
            if (Navigation_1.default.getTopmostReportId() === prevOnyxReportID) {
                Navigation_1.default.isNavigationReady().then(() => {
                    Navigation_1.default.popToSidebar();
                });
            }
            if (prevReport?.parentReportID) {
                // Prevent navigation to the IOU/Expense Report if it is pending deletion.
                if ((0, ReportUtils_1.isMoneyRequestReportPendingDeletion)(prevReport.parentReportID)) {
                    return;
                }
                Navigation_1.default.isNavigationReady().then(() => {
                    Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(prevReport.parentReportID));
                });
                return;
            }
            Navigation_1.default.isNavigationReady().then(() => {
                (0, Report_1.navigateToConciergeChat)();
            });
            return;
        }
        // If you already have a report open and are deeplinking to a new report on native,
        // the ReportScreen never actually unmounts and the reportID in the route also doesn't change.
        // Therefore, we need to compare if the existing reportID is the same as the one in the route
        // before deciding that we shouldn't call OpenReport.
        if (reportIDFromRoute === lastReportIDFromRoute && (!onyxReportID || onyxReportID === reportIDFromRoute)) {
            return;
        }
        (0, Composer_1.setShouldShowComposeInput)(true);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [
        route,
        report,
        prevReport?.reportID,
        prevUserLeavingStatus,
        userLeavingStatus,
        prevReport?.statusNum,
        prevReport?.parentReportID,
        prevReport?.chatType,
        prevReport,
        reportIDFromRoute,
        lastReportIDFromRoute,
        isFocused,
        deletedParentAction,
        prevDeletedParentAction,
    ]);
    (0, react_1.useEffect)(() => {
        if (!(0, ReportUtils_1.isValidReportIDFromPath)(reportIDFromRoute)) {
            return;
        }
        // Ensures the optimistic report is created successfully
        if (reportIDFromRoute !== report?.reportID) {
            return;
        }
        // Ensures subscription event succeeds when the report/workspace room is created optimistically.
        // Check if the optimistic `OpenReport` or `AddWorkspaceRoom` has succeeded by confirming
        // any `pendingFields.createChat` or `pendingFields.addWorkspaceRoom` fields are set to null.
        // Existing reports created will have empty fields for `pendingFields`.
        const didCreateReportSuccessfully = !report?.pendingFields || (!report?.pendingFields.addWorkspaceRoom && !report?.pendingFields.createChat);
        let interactionTask = null;
        if (!didSubscribeToReportLeavingEvents.current && didCreateReportSuccessfully) {
            interactionTask = react_native_1.InteractionManager.runAfterInteractions(() => {
                (0, Report_1.subscribeToReportLeavingEvents)(reportIDFromRoute);
                didSubscribeToReportLeavingEvents.current = true;
            });
        }
        return () => {
            if (!interactionTask) {
                return;
            }
            interactionTask.cancel();
        };
    }, [report, didSubscribeToReportLeavingEvents, reportIDFromRoute]);
    const actionListValue = (0, react_1.useMemo)(() => ({ flatListRef, scrollPosition, setScrollPosition }), [flatListRef, scrollPosition, setScrollPosition]);
    // This helps in tracking from the moment 'route' triggers useMemo until isLoadingInitialReportActions becomes true. It prevents blinking when loading reportActions from cache.
    (0, react_1.useEffect)(() => {
        react_native_1.InteractionManager.runAfterInteractions(() => {
            setIsLinkingToMessage(false);
        });
    }, [reportMetadata?.isLoadingInitialReportActions]);
    const navigateToEndOfReport = (0, react_1.useCallback)(() => {
        Navigation_1.default.setParams({ reportActionID: '' });
        fetchReport();
    }, [fetchReport]);
    (0, react_1.useEffect)(() => {
        // Only handle deletion cases when there's a deleted action
        if (!isLinkedActionDeleted) {
            setIsNavigatingToDeletedAction(false);
            return;
        }
        // we want to do this distinguish between normal navigation and delete behavior
        if (lastReportActionIDFromRoute !== reportActionIDFromRoute) {
            setIsNavigatingToDeletedAction(true);
            return;
        }
        // Clear params when action gets deleted while highlighting
        if (!isNavigatingToDeletedAction && prevIsLinkedActionDeleted === false) {
            Navigation_1.default.setParams({ reportActionID: '' });
        }
    }, [isLinkedActionDeleted, prevIsLinkedActionDeleted, lastReportActionIDFromRoute, reportActionIDFromRoute, isNavigatingToDeletedAction]);
    // If user redirects to an inaccessible whisper via a deeplink, on a report they have access to,
    // then we set reportActionID as empty string, so we display them the report and not the "Not found page".
    (0, react_1.useEffect)(() => {
        if (!isLinkedActionInaccessibleWhisper) {
            return;
        }
        Navigation_1.default.isNavigationReady().then(() => {
            Navigation_1.default.setParams({ reportActionID: '' });
        });
    }, [isLinkedActionInaccessibleWhisper]);
    (0, react_1.useEffect)(() => {
        if (!!report?.lastReadTime || !(0, ReportUtils_1.isTaskReport)(report)) {
            return;
        }
        // After creating the task report then navigating to task detail we don't have any report actions and the last read time is empty so We need to update the initial last read time when opening the task report detail.
        (0, Report_1.readNewestAction)(report?.reportID);
    }, [report]);
    const lastRoute = (0, usePrevious_1.default)(route);
    // wrapping into useMemo to stabilize children re-renders as reportMetadata is changed frequently
    const showReportActionsLoadingState = (0, react_1.useMemo)(() => reportMetadata?.isLoadingInitialReportActions && !reportMetadata?.hasOnceLoadedReportActions, [reportMetadata?.isLoadingInitialReportActions, reportMetadata?.hasOnceLoadedReportActions]);
    // Define here because reportActions are recalculated before mount, allowing data to display faster than useEffect can trigger.
    // If we have cached reportActions, they will be shown immediately.
    // We aim to display a loader first, then fetch relevant reportActions, and finally show them.
    if ((lastRoute !== route || lastReportActionIDFromRoute !== reportActionIDFromRoute) && isLinkingToMessage !== !!reportActionIDFromRoute) {
        setIsLinkingToMessage(!!reportActionIDFromRoute);
        return null;
    }
    // If true reports that are considered MoneyRequest | InvoiceReport will get the new report table view
    const shouldDisplayMoneyRequestActionsList = isMoneyRequestOrInvoiceReport && (0, MoneyRequestReportUtils_1.shouldDisplayReportTableView)(report, visibleTransactions ?? []);
    return (<ReportScreenContext_1.ActionListContext.Provider value={actionListValue}>
            <ReactionListWrapper_1.default>
                <ScreenWrapper_1.default navigation={navigation} style={screenWrapperStyle} shouldEnableKeyboardAvoidingView={isTopMostReportId || isInNarrowPaneModal} testID={`report-screen-${reportID}`}>
                    <FullPageNotFoundView_1.default shouldShow={shouldShowNotFoundPage} subtitleKey={shouldShowNotFoundLinkedAction ? 'notFound.commentYouLookingForCannotBeFound' : 'notFound.noAccess'} subtitleStyle={[styles.textSupporting]} shouldShowBackButton={shouldUseNarrowLayout} onBackButtonPress={shouldShowNotFoundLinkedAction ? navigateToEndOfReport : Navigation_1.default.goBack} shouldShowLink={shouldShowNotFoundLinkedAction} linkTranslationKey="notFound.goToChatInstead" subtitleKeyBelowLink={shouldShowNotFoundLinkedAction ? 'notFound.contactConcierge' : ''} onLinkPress={navigateToEndOfReport} shouldDisplaySearchRouter>
                        <OfflineWithFeedback_1.default pendingAction={reportPendingAction} errors={reportErrors} shouldShowErrorMessages={false} needsOffscreenAlphaCompositing>
                            {headerView}
                        </OfflineWithFeedback_1.default>
                        {!!accountManagerReportID && (0, ReportUtils_1.isConciergeChatReport)(report) && isBannerVisible && (<Banner_1.default containerStyles={[styles.mh4, styles.mt4, styles.p4, styles.br2]} text={chatWithAccountManagerText} onClose={dismissBanner} onButtonPress={chatWithAccountManager} shouldShowCloseButton icon={Expensicons.Lightbulb} shouldShowIcon shouldShowButton/>)}
                        <Provider_1.default isDisabled={isEditingDisabled}>
                            <react_native_1.View style={[styles.flex1, styles.justifyContentEnd, styles.overflowHidden]} testID="report-actions-view-wrapper">
                                {(!report || shouldWaitForTransactions) && <ReportActionsSkeletonView_1.default />}
                                {!!report && !shouldDisplayMoneyRequestActionsList && !shouldWaitForTransactions ? (<ReportActionsView_1.default report={report} reportActions={reportActions} isLoadingInitialReportActions={reportMetadata?.isLoadingInitialReportActions} hasNewerActions={hasNewerActions} hasOlderActions={hasOlderActions} parentReportAction={parentReportAction} transactionThreadReportID={transactionThreadReportID}/>) : null}
                                {!!report && shouldDisplayMoneyRequestActionsList && !shouldWaitForTransactions ? (<MoneyRequestReportActionsList_1.default report={report} policy={policy} reportActions={reportActions} transactions={visibleTransactions} newTransactions={newTransactions} violations={allReportViolations} hasOlderActions={hasOlderActions} hasNewerActions={hasNewerActions} showReportActionsLoadingState={showReportActionsLoadingState}/>) : null}
                                {isCurrentReportLoadedFromOnyx ? (<ReportFooter_1.default report={report} reportMetadata={reportMetadata} policy={policy} pendingAction={reportPendingAction} isComposerFullSize={!!isComposerFullSize} lastReportAction={lastReportAction} reportTransactions={reportTransactions}/>) : null}
                            </react_native_1.View>
                            <portal_1.PortalHost name="suggestions"/>
                        </Provider_1.default>
                    </FullPageNotFoundView_1.default>
                </ScreenWrapper_1.default>
            </ReactionListWrapper_1.default>
        </ReportScreenContext_1.ActionListContext.Provider>);
}
ReportScreen.displayName = 'ReportScreen';
exports.default = (0, react_1.memo)(ReportScreen, (prevProps, nextProps) => (0, fast_equals_1.deepEqual)(prevProps.route, nextProps.route));
