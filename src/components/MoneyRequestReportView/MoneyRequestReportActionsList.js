"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const isEmpty_1 = require("lodash/isEmpty");
const react_1 = require("react");
const react_native_1 = require("react-native");
const ButtonWithDropdownMenu_1 = require("@components/ButtonWithDropdownMenu");
const Checkbox_1 = require("@components/Checkbox");
const ConfirmModal_1 = require("@components/ConfirmModal");
const DecisionModal_1 = require("@components/DecisionModal");
const FlatList_1 = require("@components/FlatList");
const BaseInvertedFlatList_1 = require("@components/InvertedFlatList/BaseInvertedFlatList");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const Pressable_1 = require("@components/Pressable");
const SearchContext_1 = require("@components/Search/SearchContext");
const Text_1 = require("@components/Text");
const useLoadReportActions_1 = require("@hooks/useLoadReportActions");
const useLocalize_1 = require("@hooks/useLocalize");
const useMobileSelectionMode_1 = require("@hooks/useMobileSelectionMode");
const useNetworkWithOfflineStatus_1 = require("@hooks/useNetworkWithOfflineStatus");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useReportScrollManager_1 = require("@hooks/useReportScrollManager");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSelectedTransactionsActions_1 = require("@hooks/useSelectedTransactionsActions");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Search_1 = require("@libs/actions/Search");
const DateUtils_1 = require("@libs/DateUtils");
const getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
const MoneyRequestReportUtils_1 = require("@libs/MoneyRequestReportUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const markOpenReportEnd_1 = require("@libs/Telemetry/markOpenReportEnd");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const Visibility_1 = require("@libs/Visibility");
const isSearchTopmostFullScreenRoute_1 = require("@navigation/helpers/isSearchTopmostFullScreenRoute");
const FloatingMessageCounter_1 = require("@pages/home/report/FloatingMessageCounter");
const ReportActionsListItemRenderer_1 = require("@pages/home/report/ReportActionsListItemRenderer");
const shouldDisplayNewMarkerOnReportAction_1 = require("@pages/home/report/shouldDisplayNewMarkerOnReportAction");
const useReportUnreadMessageScrollTracking_1 = require("@pages/home/report/useReportUnreadMessageScrollTracking");
const variables_1 = require("@styles/variables");
const Report_1 = require("@userActions/Report");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const MoneyRequestReportTransactionList_1 = require("./MoneyRequestReportTransactionList");
const MoneyRequestViewReportFields_1 = require("./MoneyRequestViewReportFields");
const ReportActionsListLoadingSkeleton_1 = require("./ReportActionsListLoadingSkeleton");
const SearchMoneyRequestReportEmptyState_1 = require("./SearchMoneyRequestReportEmptyState");
/**
 * In this view we are not handling the special single transaction case, we're just handling the report
 */
const EmptyParentReportActionForTransactionThread = undefined;
const INITIAL_NUM_TO_RENDER = 20;
// Amount of time to wait until all list items should be rendered and scrollToEnd will behave well
const DELAY_FOR_SCROLLING_TO_END = 100;
function getParentReportAction(parentReportActions, parentReportActionID) {
    if (!parentReportActions || !parentReportActionID) {
        return;
    }
    return parentReportActions[parentReportActionID];
}
function MoneyRequestReportActionsList({ report, policy, reportActions = [], transactions = [], newTransactions, violations, hasNewerActions, hasOlderActions, showReportActionsLoadingState, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate, getLocalDateFromDatetime } = (0, useLocalize_1.default)();
    const { isOffline, lastOfflineAt, lastOnlineAt } = (0, useNetworkWithOfflineStatus_1.default)();
    const reportScrollManager = (0, useReportScrollManager_1.default)();
    const lastMessageTime = (0, react_1.useRef)(null);
    const didLayout = (0, react_1.useRef)(false);
    const [isVisible, setIsVisible] = (0, react_1.useState)(Visibility_1.default.isVisible);
    const isFocused = (0, native_1.useIsFocused)();
    const route = (0, native_1.useRoute)();
    // wrapped in useMemo to avoid unnecessary re-renders and improve performance
    const reportTransactionIDs = (0, react_1.useMemo)(() => transactions.map((transaction) => transaction.transactionID), [transactions]);
    const [chatReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${(0, getNonEmptyStringOnyxID_1.default)(report?.chatReportID)}`, { canBeMissing: true });
    const reportID = report?.reportID;
    const linkedReportActionID = route?.params?.reportActionID;
    const [allReports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { canBeMissing: false });
    const [policies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: false });
    const [parentReportAction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${(0, getNonEmptyStringOnyxID_1.default)(report?.parentReportID)}`, {
        canEvict: false,
        canBeMissing: true,
        selector: (parentReportActions) => getParentReportAction(parentReportActions, report?.parentReportActionID),
    });
    const [userWalletTierName] = (0, useOnyx_1.default)(ONYXKEYS_1.default.USER_WALLET, { selector: (wallet) => wallet?.tierName, canBeMissing: false });
    const [isUserValidated] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { selector: (account) => account?.validated, canBeMissing: true });
    const [userBillingFundID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_BILLING_FUND_ID, { canBeMissing: true });
    const personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    const [emojiReactions] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS}`, { canBeMissing: true });
    const [draftMessage] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_DRAFTS}`, { canBeMissing: true });
    const [tryNewDot] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_TRY_NEW_DOT, { canBeMissing: false });
    const isTryNewDotNVPDismissed = !!tryNewDot?.classicRedirect?.dismissed;
    const transactionsWithoutPendingDelete = (0, react_1.useMemo)(() => transactions.filter((t) => !(0, TransactionUtils_1.isTransactionPendingDelete)(t)), [transactions]);
    const mostRecentIOUReportActionID = (0, react_1.useMemo)(() => (0, ReportActionsUtils_1.getMostRecentIOURequestActionID)(reportActions), [reportActions]);
    const transactionThreadReportID = (0, ReportActionsUtils_1.getOneTransactionThreadReportID)(report, chatReport, reportActions ?? [], false, reportTransactionIDs);
    const firstVisibleReportActionID = (0, react_1.useMemo)(() => (0, ReportActionsUtils_1.getFirstVisibleReportActionID)(reportActions, isOffline), [reportActions, isOffline]);
    const [transactionThreadReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${transactionThreadReportID}`, { canBeMissing: true });
    const [currentUserAccountID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false, selector: (session) => session?.accountID });
    const isReportArchived = (0, useReportIsArchived_1.default)(reportID);
    const canPerformWriteAction = (0, ReportUtils_1.canUserPerformWriteAction)(report, isReportArchived);
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false });
    const [isDownloadErrorModalVisible, setIsDownloadErrorModalVisible] = (0, react_1.useState)(false);
    const { selectedTransactionIDs, setSelectedTransactions, clearSelectedTransactions } = (0, SearchContext_1.useSearchContext)();
    const isMobileSelectionModeEnabled = (0, useMobileSelectionMode_1.default)();
    const [isExportWithTemplateModalVisible, setIsExportWithTemplateModalVisible] = (0, react_1.useState)(false);
    const beginExportWithTemplate = (0, react_1.useCallback)((templateName, templateType, transactionIDList) => {
        if (!report) {
            return;
        }
        setIsExportWithTemplateModalVisible(true);
        (0, Search_1.queueExportSearchWithTemplate)({
            templateName,
            templateType,
            jsonQuery: '{}',
            reportIDList: [report.reportID],
            transactionIDList,
            policyID: policy?.id,
        });
    }, [report, policy]);
    const { options: selectedTransactionsOptions, handleDeleteTransactions, isDeleteModalVisible, hideDeleteModal, } = (0, useSelectedTransactionsActions_1.default)({
        report,
        reportActions,
        allTransactionsLength: transactions.length,
        session,
        onExportFailed: () => setIsDownloadErrorModalVisible(true),
        policy,
        beginExportWithTemplate: (templateName, templateType, transactionIDList) => beginExportWithTemplate(templateName, templateType, transactionIDList),
    });
    // We are reversing actions because in this View we are starting at the top and don't use Inverted list
    const visibleReportActions = (0, react_1.useMemo)(() => {
        const filteredActions = reportActions.filter((reportAction) => {
            const isActionVisibleOnMoneyReport = (0, MoneyRequestReportUtils_1.isActionVisibleOnMoneyRequestReport)(reportAction);
            return (isActionVisibleOnMoneyReport &&
                (isOffline || (0, ReportActionsUtils_1.isDeletedParentAction)(reportAction) || reportAction.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE || reportAction.errors) &&
                (0, ReportActionsUtils_1.shouldReportActionBeVisible)(reportAction, reportAction.reportActionID, canPerformWriteAction) &&
                (0, ReportActionsUtils_1.isIOUActionMatchingTransactionList)(reportAction, reportTransactionIDs));
        });
        return filteredActions.toReversed();
    }, [reportActions, isOffline, canPerformWriteAction, reportTransactionIDs]);
    const reportActionSize = (0, react_1.useRef)(visibleReportActions.length);
    const lastAction = visibleReportActions.at(-1);
    const lastActionIndex = lastAction?.reportActionID;
    const previousLastIndex = (0, react_1.useRef)(lastActionIndex);
    const scrollingVerticalBottomOffset = (0, react_1.useRef)(0);
    const scrollingVerticalTopOffset = (0, react_1.useRef)(0);
    const wrapperViewRef = (0, react_1.useRef)(null);
    const readActionSkipped = (0, react_1.useRef)(false);
    const lastVisibleActionCreated = (0, ReportUtils_1.getReportLastVisibleActionCreated)(report, transactionThreadReport);
    const hasNewestReportAction = lastAction?.created === lastVisibleActionCreated;
    const hasNewestReportActionRef = (0, react_1.useRef)(hasNewestReportAction);
    const userActiveSince = (0, react_1.useRef)(DateUtils_1.default.getDBTime());
    const reportActionIDs = (0, react_1.useMemo)(() => {
        return reportActions?.map((action) => action.reportActionID) ?? [];
    }, [reportActions]);
    const { loadOlderChats, loadNewerChats } = (0, useLoadReportActions_1.default)({
        reportID,
        reportActions,
        allReportActionIDs: reportActionIDs,
        transactionThreadReport,
        hasOlderActions,
        hasNewerActions,
    });
    const onStartReached = (0, react_1.useCallback)(() => {
        if (!(0, isSearchTopmostFullScreenRoute_1.default)()) {
            loadOlderChats(false);
            return;
        }
        react_native_1.InteractionManager.runAfterInteractions(() => requestAnimationFrame(() => loadOlderChats(false)));
    }, [loadOlderChats]);
    const onEndReached = (0, react_1.useCallback)(() => {
        loadNewerChats(false);
    }, [loadNewerChats]);
    const prevUnreadMarkerReportActionID = (0, react_1.useRef)(null);
    const visibleActionsMap = (0, react_1.useMemo)(() => {
        return visibleReportActions.reduce((actionsMap, reportAction) => {
            Object.assign(actionsMap, { [reportAction.reportActionID]: reportAction });
            return actionsMap;
        }, {});
    }, [visibleReportActions]);
    const prevVisibleActionsMap = (0, usePrevious_1.default)(visibleActionsMap);
    const reportLastReadTime = report.lastReadTime ?? '';
    /**
     * The timestamp for the unread marker.
     *
     * This should ONLY be updated when the user
     * - switches reports
     * - marks a message as read/unread
     * - reads a new message as it is received
     */
    const [unreadMarkerTime, setUnreadMarkerTime] = (0, react_1.useState)(reportLastReadTime);
    (0, react_1.useEffect)(() => {
        setUnreadMarkerTime(reportLastReadTime);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [report.reportID]);
    (0, react_1.useEffect)(() => {
        const unsubscribe = Visibility_1.default.onVisibilityChange(() => {
            setIsVisible(Visibility_1.default.isVisible());
        });
        return unsubscribe;
    }, []);
    (0, react_1.useEffect)(() => {
        if (!isFocused) {
            return;
        }
        if ((0, ReportUtils_1.isUnread)(report, transactionThreadReport, isReportArchived) || (lastAction && (0, ReportActionsUtils_1.isCurrentActionUnread)(report, lastAction, visibleReportActions))) {
            // On desktop, when the notification center is displayed, isVisible will return false.
            // Currently, there's no programmatic way to dismiss the notification center panel.
            // To handle this, we use the 'referrer' parameter to check if the current navigation is triggered from a notification.
            const isFromNotification = route?.params?.referrer === CONST_1.default.REFERRER.NOTIFICATION;
            if ((isVisible || isFromNotification) && scrollingVerticalBottomOffset.current < CONST_1.default.REPORT.ACTIONS.ACTION_VISIBLE_THRESHOLD) {
                (0, Report_1.readNewestAction)(report.reportID);
                if (isFromNotification) {
                    Navigation_1.default.setParams({ referrer: undefined });
                }
            }
            else {
                readActionSkipped.current = true;
            }
        }
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [report.lastVisibleActionCreated, transactionThreadReport?.lastVisibleActionCreated, report.reportID, isVisible]);
    (0, react_1.useEffect)(() => {
        if (!isVisible || !isFocused) {
            if (!lastMessageTime.current) {
                lastMessageTime.current = lastAction?.created ?? '';
            }
            return;
        }
        // In case the user read new messages (after being inactive) with other device we should
        // show marker based on report.lastReadTime
        const newMessageTimeReference = lastMessageTime.current && report.lastReadTime && lastMessageTime.current > report.lastReadTime ? userActiveSince.current : report.lastReadTime;
        lastMessageTime.current = null;
        const hasNewMessagesInView = scrollingVerticalBottomOffset.current < CONST_1.default.REPORT.ACTIONS.ACTION_VISIBLE_THRESHOLD;
        const hasUnreadReportAction = reportActions.some((reportAction) => newMessageTimeReference && newMessageTimeReference < reportAction.created && reportAction.actorAccountID !== (0, Report_1.getCurrentUserAccountID)());
        if (!hasNewMessagesInView || !hasUnreadReportAction) {
            return;
        }
        (0, Report_1.readNewestAction)(report.reportID);
        userActiveSince.current = DateUtils_1.default.getDBTime();
        // This effect logic to `mark as read` will only run when the report focused has new messages and the App visibility
        //  is changed to visible(meaning user switched to app/web, while user was previously using different tab or application).
        // We will mark the report as read in the above case which marks the LHN report item as read while showing the new message
        // marker for the chat messages received while the user wasn't focused on the report or on another browser tab for web.
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [isFocused, isVisible]);
    /**
     * The index of the earliest message that was received while offline
     */
    const earliestReceivedOfflineMessageIndex = (0, react_1.useMemo)(() => {
        const lastIndex = reportActions.findLastIndex((action) => {
            return (0, ReportActionsUtils_1.wasMessageReceivedWhileOffline)(action, isOffline, lastOfflineAt.current, lastOnlineAt.current, getLocalDateFromDatetime);
        });
        // The last index in the list is the earliest message that was received while offline
        return lastIndex > -1 ? lastIndex : undefined;
    }, [getLocalDateFromDatetime, isOffline, lastOfflineAt, lastOnlineAt, reportActions]);
    /**
     * The reportActionID the unread marker should display above
     */
    const [unreadMarkerReportActionID, unreadMarkerReportActionIndex] = (0, react_1.useMemo)(() => {
        // If there are message that were received while offline,
        // we can skip checking all messages later than the earliest received offline message.
        const startIndex = visibleReportActions.length - 1;
        const endIndex = earliestReceivedOfflineMessageIndex ?? 0;
        // Scan through each visible report action until we find the appropriate action to show the unread marker
        for (let index = startIndex; index >= endIndex; index--) {
            const reportAction = visibleReportActions.at(index);
            const nextAction = index > 0 ? visibleReportActions.at(index - 1) : undefined;
            const isEarliestReceivedOfflineMessage = index === earliestReceivedOfflineMessageIndex;
            const shouldDisplayNewMarker = reportAction &&
                (0, shouldDisplayNewMarkerOnReportAction_1.default)({
                    message: reportAction,
                    nextMessage: nextAction,
                    isEarliestReceivedOfflineMessage,
                    accountID: currentUserAccountID,
                    prevSortedVisibleReportActionsObjects: prevVisibleActionsMap,
                    unreadMarkerTime,
                    scrollingVerticalOffset: scrollingVerticalBottomOffset.current,
                    prevUnreadMarkerReportActionID: prevUnreadMarkerReportActionID.current,
                });
            // eslint-disable-next-line react-compiler/react-compiler
            if (shouldDisplayNewMarker) {
                return [reportAction.reportActionID, index];
            }
        }
        return [null, -1];
    }, [currentUserAccountID, earliestReceivedOfflineMessageIndex, prevVisibleActionsMap, visibleReportActions, unreadMarkerTime]);
    prevUnreadMarkerReportActionID.current = unreadMarkerReportActionID;
    const { isFloatingMessageCounterVisible, setIsFloatingMessageCounterVisible, trackVerticalScrolling, onViewableItemsChanged } = (0, useReportUnreadMessageScrollTracking_1.default)({
        reportID: report.reportID,
        currentVerticalScrollingOffsetRef: scrollingVerticalBottomOffset,
        readActionSkippedRef: readActionSkipped,
        unreadMarkerReportActionIndex,
        isInverted: false,
        onTrackScrolling: (event) => {
            const { layoutMeasurement, contentSize, contentOffset } = event.nativeEvent;
            const fullContentHeight = contentSize.height;
            /**
             * Count the diff between current scroll position and the bottom of the list.
             * Diff == (height of all items in the list) - (height of the layout with the list) - (how far user scrolled)
             */
            scrollingVerticalBottomOffset.current = fullContentHeight - layoutMeasurement.height - contentOffset.y;
            // We additionally track the top offset to be able to scroll to the new transaction when it's added
            scrollingVerticalTopOffset.current = contentOffset.y;
        },
    });
    (0, react_1.useEffect)(() => {
        if (scrollingVerticalBottomOffset.current < BaseInvertedFlatList_1.AUTOSCROLL_TO_TOP_THRESHOLD &&
            previousLastIndex.current !== lastActionIndex &&
            reportActionSize.current > reportActions.length &&
            hasNewestReportAction) {
            setIsFloatingMessageCounterVisible(false);
            reportScrollManager.scrollToEnd();
        }
        previousLastIndex.current = lastActionIndex;
        reportActionSize.current = visibleReportActions.length;
        hasNewestReportActionRef.current = hasNewestReportAction;
    }, [lastActionIndex, reportActions, reportScrollManager, hasNewestReportAction, visibleReportActions.length, setIsFloatingMessageCounterVisible]);
    /**
     * Subscribe to read/unread events and update our unreadMarkerTime
     */
    (0, react_1.useEffect)(() => {
        const unreadActionSubscription = react_native_1.DeviceEventEmitter.addListener(`unreadAction_${report.reportID}`, (newLastReadTime) => {
            setUnreadMarkerTime(newLastReadTime);
            userActiveSince.current = DateUtils_1.default.getDBTime();
        });
        const readNewestActionSubscription = react_native_1.DeviceEventEmitter.addListener(`readNewestAction_${report.reportID}`, (newLastReadTime) => {
            setUnreadMarkerTime(newLastReadTime);
        });
        return () => {
            unreadActionSubscription.remove();
            readNewestActionSubscription.remove();
        };
    }, [report.reportID]);
    /**
     * When the user reads a new message as it is received, we'll push the unreadMarkerTime down to the timestamp of
     * the latest report action. When new report actions are received and the user is not viewing them (they're above
     * the MSG_VISIBLE_THRESHOLD), the unread marker will display over those new messages rather than the initial
     * lastReadTime.
     */
    (0, react_1.useLayoutEffect)(() => {
        if (unreadMarkerReportActionID) {
            return;
        }
        const mostRecentReportActionCreated = lastAction?.created ?? '';
        if (mostRecentReportActionCreated <= unreadMarkerTime) {
            return;
        }
        setUnreadMarkerTime(mostRecentReportActionCreated);
    }, [lastAction?.created, unreadMarkerReportActionID, unreadMarkerTime]);
    const scrollToBottomForCurrentUserAction = (0, react_1.useCallback)((isFromCurrentUser, reportAction) => {
        react_native_1.InteractionManager.runAfterInteractions(() => {
            setIsFloatingMessageCounterVisible(false);
            // If a new comment is added from the current user, scroll to the bottom, otherwise leave the user position unchanged
            if (!isFromCurrentUser || reportAction?.actionName !== CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT) {
                return;
            }
            // We want to scroll to the end of the list where the newest message is
            // however scrollToEnd will not work correctly with items of variable sizes without `getItemLayout` - so we need to delay the scroll until every item rendered
            setTimeout(() => {
                reportScrollManager.scrollToEnd();
            }, DELAY_FOR_SCROLLING_TO_END);
        });
    }, [reportScrollManager, setIsFloatingMessageCounterVisible]);
    (0, react_1.useEffect)(() => {
        // This callback is triggered when a new action arrives via Pusher and the event is emitted from Report.ts. This allows us to maintain
        // a single source of truth for the "new action" event instead of trying to derive that a new action has appeared from looking at props.
        const unsubscribe = (0, Report_1.subscribeToNewActionEvent)(report.reportID, scrollToBottomForCurrentUserAction);
        return () => {
            if (!unsubscribe) {
                return;
            }
            unsubscribe();
        };
        // This effect handles subscribing to events, so we only want to run it on mount, and in case reportID changes
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [report.reportID]);
    const renderItem = (0, react_1.useCallback)(({ item: reportAction, index }) => {
        const displayAsGroup = !(0, ReportActionsUtils_1.isConsecutiveChronosAutomaticTimerAction)(visibleReportActions, index, (0, ReportUtils_1.chatIncludesChronosWithID)(reportAction?.reportID)) &&
            (0, ReportActionsUtils_1.hasNextActionMadeBySameActor)(visibleReportActions, index);
        const actionEmojiReactions = emojiReactions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS}${reportAction.reportActionID}`];
        const originalReportID = (0, ReportUtils_1.getOriginalReportID)(report.reportID, reportAction);
        const reportDraftMessages = draftMessage?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_DRAFTS}${originalReportID}`];
        const matchingDraftMessage = reportDraftMessages?.[reportAction.reportActionID];
        const matchingDraftMessageString = typeof matchingDraftMessage === 'string' ? matchingDraftMessage : matchingDraftMessage?.message;
        return (<ReportActionsListItemRenderer_1.default allReports={allReports} policies={policies} reportAction={reportAction} reportActions={reportActions} parentReportAction={parentReportAction} parentReportActionForTransactionThread={EmptyParentReportActionForTransactionThread} index={index} report={report} transactionThreadReport={transactionThreadReport} displayAsGroup={displayAsGroup} mostRecentIOUReportActionID={mostRecentIOUReportActionID} shouldDisplayNewMarker={reportAction.reportActionID === unreadMarkerReportActionID} shouldDisplayReplyDivider={visibleReportActions.length > 1} isFirstVisibleReportAction={firstVisibleReportActionID === reportAction.reportActionID} shouldHideThreadDividerLine linkedReportActionID={linkedReportActionID} userWalletTierName={userWalletTierName} isUserValidated={isUserValidated} personalDetails={personalDetails} userBillingFundID={userBillingFundID} emojiReactions={actionEmojiReactions} isReportArchived={isReportArchived} draftMessage={matchingDraftMessageString} isTryNewDotNVPDismissed={isTryNewDotNVPDismissed}/>);
    }, [
        visibleReportActions,
        reportActions,
        parentReportAction,
        report,
        transactionThreadReport,
        mostRecentIOUReportActionID,
        unreadMarkerReportActionID,
        firstVisibleReportActionID,
        linkedReportActionID,
        allReports,
        policies,
        userWalletTierName,
        isUserValidated,
        personalDetails,
        userBillingFundID,
        emojiReactions,
        draftMessage,
        isTryNewDotNVPDismissed,
        isReportArchived,
    ]);
    const scrollToBottomAndMarkReportAsRead = (0, react_1.useCallback)(() => {
        setIsFloatingMessageCounterVisible(false);
        if (!hasNewestReportAction) {
            (0, Report_1.openReport)(report.reportID);
            reportScrollManager.scrollToEnd();
            return;
        }
        reportScrollManager.scrollToEnd();
        readActionSkipped.current = false;
        (0, Report_1.readNewestAction)(report.reportID);
    }, [setIsFloatingMessageCounterVisible, hasNewestReportAction, reportScrollManager, report.reportID]);
    const scrollToNewTransaction = (0, react_1.useCallback)((pageY) => {
        wrapperViewRef.current?.measureInWindow((x, y, w, height) => {
            // If the new transaction is already visible, we don't need to scroll to it
            if (pageY > 0 && pageY < height) {
                return;
            }
            reportScrollManager.scrollToOffset(scrollingVerticalTopOffset.current + pageY - variables_1.default.scrollToNewTransactionOffset);
        });
    }, [reportScrollManager]);
    const reportHasComments = visibleReportActions.length > 0;
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
    const isSelectAllChecked = selectedTransactionIDs.length > 0 && selectedTransactionIDs.length === transactionsWithoutPendingDelete.length;
    // Wrapped into useCallback to stabilize children re-renders
    const keyExtractor = (0, react_1.useCallback)((item) => item.reportActionID, []);
    return (<react_native_1.View style={[styles.flex1]} ref={wrapperViewRef}>
            {shouldUseNarrowLayout && isMobileSelectionModeEnabled && (<>
                    <ButtonWithDropdownMenu_1.default onPress={() => null} options={selectedTransactionsOptions} customText={translate('workspace.common.selected', { count: selectedTransactionIDs.length })} isSplitButton={false} shouldAlwaysShowDropdownMenu wrapperStyle={[styles.w100, styles.ph5]}/>
                    <react_native_1.View style={[styles.alignItemsCenter, styles.userSelectNone, styles.flexRow, styles.pt6, styles.ph8, styles.pb3]}>
                        <Checkbox_1.default accessibilityLabel={translate('workspace.people.selectAll')} isChecked={isSelectAllChecked} isIndeterminate={selectedTransactionIDs.length > 0 && selectedTransactionIDs.length !== transactionsWithoutPendingDelete.length} onPress={() => {
                if (selectedTransactionIDs.length !== 0) {
                    clearSelectedTransactions(true);
                }
                else {
                    setSelectedTransactions(transactionsWithoutPendingDelete.map((t) => t.transactionID));
                }
            }}/>
                        <Pressable_1.PressableWithFeedback style={[styles.userSelectNone, styles.alignItemsCenter]} onPress={() => {
                if (isSelectAllChecked) {
                    clearSelectedTransactions(true);
                }
                else {
                    setSelectedTransactions(transactionsWithoutPendingDelete.map((t) => t.transactionID));
                }
            }} accessibilityLabel={translate('workspace.people.selectAll')} role="button" accessibilityState={{ checked: isSelectAllChecked }} dataSet={{ [CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT]: true }}>
                            <Text_1.default style={[styles.textStrong, styles.ph3]}>{translate('workspace.people.selectAll')}</Text_1.default>
                        </Pressable_1.PressableWithFeedback>
                    </react_native_1.View>
                    <ConfirmModal_1.default title={translate('iou.deleteExpense', { count: selectedTransactionIDs.length })} isVisible={isDeleteModalVisible} onConfirm={() => {
                const shouldNavigateBack = transactions.filter((trans) => trans.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE).length === selectedTransactionIDs.length;
                handleDeleteTransactions();
                if (shouldNavigateBack) {
                    Navigation_1.default.goBack(route.params?.backTo);
                }
            }} onCancel={hideDeleteModal} prompt={translate('iou.deleteConfirmation', { count: selectedTransactionIDs.length })} confirmText={translate('common.delete')} cancelText={translate('common.cancel')} danger shouldEnableNewFocusManagement/>
                </>)}
            <react_native_1.View style={[styles.flex1, styles.justifyContentEnd, styles.overflowHidden]}>
                <FloatingMessageCounter_1.default hasNewMessages={!!unreadMarkerReportActionID} isActive={isFloatingMessageCounterVisible} onClick={scrollToBottomAndMarkReportAsRead}/>
                {(0, isEmpty_1.default)(visibleReportActions) && (0, isEmpty_1.default)(transactions) && !showReportActionsLoadingState ? (<>
                        <MoneyRequestViewReportFields_1.default report={report} policy={policy}/>
                        <SearchMoneyRequestReportEmptyState_1.default />
                    </>) : (<FlatList_1.default initialNumToRender={INITIAL_NUM_TO_RENDER} accessibilityLabel={translate('sidebarScreen.listOfChatMessages')} testID="money-request-report-actions-list" style={styles.overscrollBehaviorContain} data={visibleReportActions} renderItem={renderItem} onViewableItemsChanged={onViewableItemsChanged} keyExtractor={keyExtractor} onLayout={recordTimeToMeasureItemLayout} onEndReached={onEndReached} onEndReachedThreshold={0.75} onStartReached={onStartReached} onStartReachedThreshold={0.75} ListHeaderComponent={<>
                                <MoneyRequestViewReportFields_1.default report={report} policy={policy}/>
                                <MoneyRequestReportTransactionList_1.default report={report} transactions={transactions} newTransactions={newTransactions} reportActions={reportActions} violations={violations} hasComments={reportHasComments} isLoadingInitialReportActions={showReportActionsLoadingState} scrollToNewTransaction={scrollToNewTransaction}/>
                            </>} keyboardShouldPersistTaps="handled" onScroll={trackVerticalScrolling} contentContainerStyle={[shouldUseNarrowLayout ? styles.pt4 : styles.pt2]} ref={reportScrollManager.ref} ListEmptyComponent={!isOffline && showReportActionsLoadingState ? <ReportActionsListLoadingSkeleton_1.default /> : undefined} // This skeleton component is only used for loading state, the empty state is handled by SearchMoneyRequestReportEmptyState
         removeClippedSubviews={false}/>)}
            </react_native_1.View>
            <DecisionModal_1.default title={translate('common.downloadFailedTitle')} prompt={translate('common.downloadFailedDescription')} isSmallScreenWidth={shouldUseNarrowLayout} onSecondOptionSubmit={() => setIsDownloadErrorModalVisible(false)} secondOptionText={translate('common.buttonConfirm')} isVisible={isDownloadErrorModalVisible} onClose={() => setIsDownloadErrorModalVisible(false)}/>
            <ConfirmModal_1.default onConfirm={() => {
            setIsExportWithTemplateModalVisible(false);
            clearSelectedTransactions(undefined, true);
        }} onCancel={() => setIsExportWithTemplateModalVisible(false)} isVisible={isExportWithTemplateModalVisible} title={translate('export.exportInProgress')} prompt={translate('export.conciergeWillSend')} confirmText={translate('common.buttonConfirm')} shouldShowCancelButton={false}/>
        </react_native_1.View>);
}
MoneyRequestReportActionsList.displayName = 'MoneyRequestReportActionsList';
exports.default = MoneyRequestReportActionsList;
