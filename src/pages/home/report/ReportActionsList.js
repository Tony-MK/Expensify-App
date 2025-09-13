"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const ActionSheetAwareScrollView_1 = require("@components/ActionSheetAwareScrollView");
const InvertedFlatList_1 = require("@components/InvertedFlatList");
const BaseInvertedFlatList_1 = require("@components/InvertedFlatList/BaseInvertedFlatList");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const ReportActionsSkeletonView_1 = require("@components/ReportActionsSkeletonView");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetworkWithOfflineStatus_1 = require("@hooks/useNetworkWithOfflineStatus");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useReportScrollManager_1 = require("@hooks/useReportScrollManager");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const Browser_1 = require("@libs/Browser");
const DateUtils_1 = require("@libs/DateUtils");
const Fullstory_1 = require("@libs/Fullstory");
const getDurationHighlightItem_1 = require("@libs/Navigation/helpers/getDurationHighlightItem");
const isReportTopmostSplitNavigator_1 = require("@libs/Navigation/helpers/isReportTopmostSplitNavigator");
const isSearchTopmostFullScreenRoute_1 = require("@libs/Navigation/helpers/isSearchTopmostFullScreenRoute");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const Visibility_1 = require("@libs/Visibility");
const variables_1 = require("@styles/variables");
const Report_1 = require("@userActions/Report");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const FloatingMessageCounter_1 = require("./FloatingMessageCounter");
const getInitialNumReportActionsToRender_1 = require("./getInitialNumReportActionsToRender");
const ListBoundaryLoader_1 = require("./ListBoundaryLoader");
const ReportActionsListItemRenderer_1 = require("./ReportActionsListItemRenderer");
const shouldDisplayNewMarkerOnReportAction_1 = require("./shouldDisplayNewMarkerOnReportAction");
const useReportUnreadMessageScrollTracking_1 = require("./useReportUnreadMessageScrollTracking");
// In the component we are subscribing to the arrival of new actions.
// As there is the possibility that there are multiple instances of a ReportScreen
// for the same report, we only ever want one subscription to be active, as
// the subscriptions could otherwise be conflicting.
const newActionUnsubscribeMap = {};
// Seems that there is an architecture issue that prevents us from using the reportID with useRef
// the useRef value gets reset when the reportID changes, so we use a global variable to keep track
let prevReportID = null;
/**
 * Create a unique key for each action in the FlatList.
 * We use the reportActionID that is a string representation of a random 64-bit int, which should be
 * random enough to avoid collisions
 */
function keyExtractor(item) {
    return item.reportActionID;
}
const onScrollToIndexFailed = () => { };
function ReportActionsList({ report, transactionThreadReport, parentReportAction, sortedReportActions, sortedVisibleReportActions, onScroll, mostRecentIOUReportActionID = '', loadNewerChats, loadOlderChats, onLayout, isComposerFullSize, listID, shouldEnableAutoScrollToTopThreshold, parentReportActionForTransactionThread, }) {
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const personalDetailsList = (0, OnyxListItemProvider_1.usePersonalDetails)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { windowHeight } = (0, useWindowDimensions_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { getLocalDateFromDatetime } = (0, useLocalize_1.default)();
    const { isOffline, lastOfflineAt, lastOnlineAt } = (0, useNetworkWithOfflineStatus_1.default)();
    const route = (0, native_1.useRoute)();
    const reportScrollManager = (0, useReportScrollManager_1.default)();
    const userActiveSince = (0, react_1.useRef)(DateUtils_1.default.getDBTime());
    const lastMessageTime = (0, react_1.useRef)(null);
    const [isVisible, setIsVisible] = (0, react_1.useState)(Visibility_1.default.isVisible);
    const isFocused = (0, native_1.useIsFocused)();
    const [allReports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { canBeMissing: false });
    const [policies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: true });
    const [transactions] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION, { canBeMissing: true });
    const [accountID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { selector: (session) => session?.accountID, canBeMissing: true });
    const participantsContext = (0, react_1.useContext)(OnyxListItemProvider_1.PersonalDetailsContext);
    const isReportArchived = (0, useReportIsArchived_1.default)(report?.reportID);
    const [userWalletTierName] = (0, useOnyx_1.default)(ONYXKEYS_1.default.USER_WALLET, { selector: (wallet) => wallet?.tierName, canBeMissing: false });
    const [isUserValidated] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { selector: (account) => account?.validated, canBeMissing: true });
    const [draftMessage] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_DRAFTS}`, { canBeMissing: true });
    const [emojiReactions] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS}`, { canBeMissing: true });
    const [userBillingFundID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_BILLING_FUND_ID, { canBeMissing: true });
    const [tryNewDot] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_TRY_NEW_DOT, { canBeMissing: false });
    const isTryNewDotNVPDismissed = !!tryNewDot?.classicRedirect?.dismissed;
    const [isScrollToBottomEnabled, setIsScrollToBottomEnabled] = (0, react_1.useState)(false);
    const [shouldScrollToEndAfterLayout, setShouldScrollToEndAfterLayout] = (0, react_1.useState)(false);
    const [actionIdToHighlight, setActionIdToHighlight] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        const unsubscribe = Visibility_1.default.onVisibilityChange(() => {
            setIsVisible(Visibility_1.default.isVisible());
        });
        return unsubscribe;
    }, []);
    const scrollingVerticalOffset = (0, react_1.useRef)(0);
    const readActionSkipped = (0, react_1.useRef)(false);
    const hasHeaderRendered = (0, react_1.useRef)(false);
    const linkedReportActionID = route?.params?.reportActionID;
    const lastAction = sortedVisibleReportActions.at(0);
    const sortedVisibleReportActionsObjects = (0, react_1.useMemo)(() => sortedVisibleReportActions.reduce((actions, action) => {
        Object.assign(actions, { [action.reportActionID]: action });
        return actions;
    }, {}), [sortedVisibleReportActions]);
    const prevSortedVisibleReportActionsObjects = (0, usePrevious_1.default)(sortedVisibleReportActionsObjects);
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
    const prevUnreadMarkerReportActionID = (0, react_1.useRef)(null);
    /**
     * The index of the earliest message that was received while offline
     */
    const earliestReceivedOfflineMessageIndex = (0, react_1.useMemo)(() => {
        // Create a list of (sorted) indices of message that were received while offline
        const receivedOfflineMessages = sortedReportActions.reduce((acc, message, index) => {
            if ((0, ReportActionsUtils_1.wasMessageReceivedWhileOffline)(message, isOffline, lastOfflineAt.current, lastOnlineAt.current, getLocalDateFromDatetime)) {
                acc[index] = index;
            }
            return acc;
        }, []);
        // The last index in the list is the earliest message that was received while offline
        return receivedOfflineMessages.at(-1);
    }, [getLocalDateFromDatetime, isOffline, lastOfflineAt, lastOnlineAt, sortedReportActions]);
    /**
     * The reportActionID the unread marker should display above
     */
    const [unreadMarkerReportActionID, unreadMarkerReportActionIndex] = (0, react_1.useMemo)(() => {
        // If there are message that were received while offline,
        // we can skip checking all messages later than the earliest received offline message.
        const startIndex = earliestReceivedOfflineMessageIndex ?? 0;
        // Scan through each visible report action until we find the appropriate action to show the unread marker
        for (let index = startIndex; index < sortedVisibleReportActions.length; index++) {
            const reportAction = sortedVisibleReportActions.at(index);
            const nextAction = sortedVisibleReportActions.at(index + 1);
            const isEarliestReceivedOfflineMessage = index === earliestReceivedOfflineMessageIndex;
            // eslint-disable-next-line react-compiler/react-compiler
            const shouldDisplayNewMarker = reportAction &&
                (0, shouldDisplayNewMarkerOnReportAction_1.default)({
                    message: reportAction,
                    nextMessage: nextAction,
                    isEarliestReceivedOfflineMessage,
                    accountID,
                    prevSortedVisibleReportActionsObjects,
                    unreadMarkerTime,
                    scrollingVerticalOffset: scrollingVerticalOffset.current,
                    prevUnreadMarkerReportActionID: prevUnreadMarkerReportActionID.current,
                });
            if (shouldDisplayNewMarker) {
                return [reportAction.reportActionID, index];
            }
        }
        return [null, -1];
    }, [accountID, earliestReceivedOfflineMessageIndex, prevSortedVisibleReportActionsObjects, sortedVisibleReportActions, unreadMarkerTime]);
    prevUnreadMarkerReportActionID.current = unreadMarkerReportActionID;
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
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [lastAction?.created]);
    const lastActionIndex = lastAction?.reportActionID;
    const reportActionSize = (0, react_1.useRef)(sortedVisibleReportActions.length);
    const lastVisibleActionCreated = (0, ReportUtils_1.getReportLastVisibleActionCreated)(report, transactionThreadReport);
    const hasNewestReportAction = lastAction?.created === lastVisibleActionCreated || (0, ReportActionsUtils_1.isReportPreviewAction)(lastAction);
    const hasNewestReportActionRef = (0, react_1.useRef)(hasNewestReportAction);
    // eslint-disable-next-line react-compiler/react-compiler
    hasNewestReportActionRef.current = hasNewestReportAction;
    const previousLastIndex = (0, react_1.useRef)(lastActionIndex);
    // Display the new message indicator when comment linking and not close to the newest message.
    const reportActionID = route?.params?.reportActionID;
    const { isFloatingMessageCounterVisible, setIsFloatingMessageCounterVisible, trackVerticalScrolling, onViewableItemsChanged } = (0, useReportUnreadMessageScrollTracking_1.default)({
        reportID: report.reportID,
        currentVerticalScrollingOffsetRef: scrollingVerticalOffset,
        readActionSkippedRef: readActionSkipped,
        unreadMarkerReportActionIndex,
        isInverted: true,
        onTrackScrolling: (event) => {
            scrollingVerticalOffset.current = event.nativeEvent.contentOffset.y;
            onScroll?.(event);
        },
    });
    (0, react_1.useEffect)(() => {
        if (scrollingVerticalOffset.current < BaseInvertedFlatList_1.AUTOSCROLL_TO_TOP_THRESHOLD &&
            previousLastIndex.current !== lastActionIndex &&
            reportActionSize.current !== sortedVisibleReportActions.length &&
            hasNewestReportAction) {
            setIsFloatingMessageCounterVisible(false);
            reportScrollManager.scrollToBottom();
        }
        previousLastIndex.current = lastActionIndex;
        reportActionSize.current = sortedVisibleReportActions.length;
    }, [lastActionIndex, sortedVisibleReportActions, reportScrollManager, hasNewestReportAction, linkedReportActionID, setIsFloatingMessageCounterVisible]);
    (0, react_1.useEffect)(() => {
        userActiveSince.current = DateUtils_1.default.getDBTime();
        prevReportID = report.reportID;
    }, [report.reportID]);
    (0, react_1.useEffect)(() => {
        if (report.reportID !== prevReportID) {
            return;
        }
        if ((0, ReportUtils_1.isUnread)(report, transactionThreadReport, isReportArchived) || (lastAction && (0, ReportActionsUtils_1.isCurrentActionUnread)(report, lastAction, sortedVisibleReportActions))) {
            // On desktop, when the notification center is displayed, isVisible will return false.
            // Currently, there's no programmatic way to dismiss the notification center panel.
            // To handle this, we use the 'referrer' parameter to check if the current navigation is triggered from a notification.
            const isFromNotification = route?.params?.referrer === CONST_1.default.REFERRER.NOTIFICATION;
            if ((isVisible || isFromNotification) && scrollingVerticalOffset.current < CONST_1.default.REPORT.ACTIONS.ACTION_VISIBLE_THRESHOLD) {
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
        if (linkedReportActionID) {
            return;
        }
        const shouldScrollToEnd = ((0, ReportUtils_1.isExpenseReport)(report) || (0, ReportActionsUtils_1.isTransactionThread)(parentReportAction)) && (0, isSearchTopmostFullScreenRoute_1.default)() && hasNewestReportAction && !unreadMarkerReportActionID;
        if (shouldScrollToEnd) {
            setShouldScrollToEndAfterLayout(true);
        }
        react_native_1.InteractionManager.runAfterInteractions(() => {
            setIsFloatingMessageCounterVisible(false);
            if (!shouldScrollToEnd) {
                reportScrollManager.scrollToBottom();
            }
        });
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    // Fixes Safari-specific issue where the whisper option is not highlighted correctly on hover after adding new transaction.
    // https://github.com/Expensify/App/issues/54520
    (0, react_1.useEffect)(() => {
        if (!(0, Browser_1.isSafari)()) {
            return;
        }
        const prevSorted = lastAction?.reportActionID ? prevSortedVisibleReportActionsObjects[lastAction?.reportActionID] : null;
        if (lastAction?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.ACTIONABLE_TRACK_EXPENSE_WHISPER && !prevSorted) {
            react_native_1.InteractionManager.runAfterInteractions(() => {
                reportScrollManager.scrollToBottom();
            });
        }
    }, [lastAction, prevSortedVisibleReportActionsObjects, reportScrollManager]);
    const scrollToBottomForCurrentUserAction = (0, react_1.useCallback)((isFromCurrentUser, action) => {
        react_native_1.InteractionManager.runAfterInteractions(() => {
            // If a new comment is added and it's from the current user scroll to the bottom otherwise leave the user positioned where
            // they are now in the list.
            if (!isFromCurrentUser || (!(0, isReportTopmostSplitNavigator_1.default)() && !Navigation_1.default.getReportRHPActiveRoute())) {
                return;
            }
            if (!hasNewestReportActionRef.current && !isFromCurrentUser) {
                if (Navigation_1.default.getReportRHPActiveRoute()) {
                    return;
                }
                Navigation_1.default.setNavigationActionToMicrotaskQueue(() => {
                    Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(report.reportID));
                });
                return;
            }
            const index = sortedVisibleReportActions.findIndex((item) => keyExtractor(item) === action?.reportActionID);
            if (action?.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW) {
                if (index > 0) {
                    setTimeout(() => {
                        reportScrollManager.scrollToIndex(index);
                    }, 100);
                }
                else {
                    setIsFloatingMessageCounterVisible(false);
                    reportScrollManager.scrollToBottom();
                }
                if (action?.reportActionID) {
                    setActionIdToHighlight(action.reportActionID);
                }
            }
            else {
                setIsFloatingMessageCounterVisible(false);
                reportScrollManager.scrollToBottom();
            }
            setIsScrollToBottomEnabled(true);
        });
    }, [report.reportID, reportScrollManager, setIsFloatingMessageCounterVisible, sortedVisibleReportActions]);
    // Clear the highlighted report action after scrolling and highlighting
    (0, react_1.useEffect)(() => {
        if (actionIdToHighlight === '') {
            return;
        }
        // Time highlight is the same as SearchPage
        const timer = setTimeout(() => {
            setActionIdToHighlight('');
        }, getDurationHighlightItem_1.default);
        return () => clearTimeout(timer);
    }, [actionIdToHighlight]);
    (0, react_1.useEffect)(() => {
        // Why are we doing this, when in the cleanup of the useEffect we are already calling the unsubscribe function?
        // Answer: On web, when navigating to another report screen, the previous report screen doesn't get unmounted,
        //         meaning that the cleanup might not get called. When we then open a report we had open already previously, a new
        //         ReportScreen will get created. Thus, we have to cancel the earlier subscription of the previous screen,
        //         because the two subscriptions could conflict!
        //         In case we return to the previous screen (e.g. by web back navigation) the useEffect for that screen would
        //         fire again, as the focus has changed and will set up the subscription correctly again.
        const previousSubUnsubscribe = newActionUnsubscribeMap[report.reportID];
        if (previousSubUnsubscribe) {
            previousSubUnsubscribe();
        }
        // This callback is triggered when a new action arrives via Pusher and the event is emitted from Report.js. This allows us to maintain
        // a single source of truth for the "new action" event instead of trying to derive that a new action has appeared from looking at props.
        const unsubscribe = (0, Report_1.subscribeToNewActionEvent)(report.reportID, scrollToBottomForCurrentUserAction);
        const cleanup = () => {
            if (!unsubscribe) {
                return;
            }
            unsubscribe();
        };
        newActionUnsubscribeMap[report.reportID] = cleanup;
        return cleanup;
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [report.reportID]);
    const reportActionsListFSClass = Fullstory_1.default.getChatFSClass(participantsContext, report);
    const lastIOUActionWithError = sortedVisibleReportActions.find((action) => action.errors);
    const prevLastIOUActionWithError = (0, usePrevious_1.default)(lastIOUActionWithError);
    (0, react_1.useEffect)(() => {
        if (lastIOUActionWithError?.reportActionID === prevLastIOUActionWithError?.reportActionID) {
            return;
        }
        react_native_1.InteractionManager.runAfterInteractions(() => {
            reportScrollManager.scrollToBottom();
        });
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [lastAction]);
    const scrollToBottomAndMarkReportAsRead = (0, react_1.useCallback)(() => {
        setIsFloatingMessageCounterVisible(false);
        if (!hasNewestReportAction) {
            if ((0, isSearchTopmostFullScreenRoute_1.default)()) {
                if (Navigation_1.default.getReportRHPActiveRoute()) {
                    Navigation_1.default.navigate(ROUTES_1.default.SEARCH_REPORT.getRoute({ reportID: report.reportID }));
                }
                else {
                    Navigation_1.default.navigate(ROUTES_1.default.SEARCH_MONEY_REQUEST_REPORT.getRoute({ reportID: report.reportID }));
                }
            }
            else {
                Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(report.reportID));
            }
            (0, Report_1.openReport)(report.reportID);
            reportScrollManager.scrollToBottom();
            return;
        }
        reportScrollManager.scrollToBottom();
        readActionSkipped.current = false;
        (0, Report_1.readNewestAction)(report.reportID);
    }, [setIsFloatingMessageCounterVisible, hasNewestReportAction, reportScrollManager, report.reportID]);
    /**
     * Calculates the ideal number of report actions to render in the first render, based on the screen height and on
     * the height of the smallest report action possible.
     */
    const initialNumToRender = (0, react_1.useMemo)(() => {
        const minimumReportActionHeight = styles.chatItem.paddingTop + styles.chatItem.paddingBottom + variables_1.default.fontSizeNormalHeight;
        const availableHeight = windowHeight - (CONST_1.default.CHAT_FOOTER_MIN_HEIGHT + variables_1.default.contentHeaderHeight);
        const numToRender = Math.ceil(availableHeight / minimumReportActionHeight);
        if (linkedReportActionID) {
            return (0, getInitialNumReportActionsToRender_1.default)(numToRender);
        }
        return numToRender || undefined;
    }, [styles.chatItem.paddingBottom, styles.chatItem.paddingTop, windowHeight, linkedReportActionID]);
    /**
     * Thread's divider line should hide when the first chat in the thread is marked as unread.
     * This is so that it will not be conflicting with header's separator line.
     */
    const shouldHideThreadDividerLine = (0, react_1.useMemo)(() => (0, ReportActionsUtils_1.getFirstVisibleReportActionID)(sortedReportActions, isOffline) === unreadMarkerReportActionID, [sortedReportActions, isOffline, unreadMarkerReportActionID]);
    const firstVisibleReportActionID = (0, react_1.useMemo)(() => (0, ReportActionsUtils_1.getFirstVisibleReportActionID)(sortedReportActions, isOffline), [sortedReportActions, isOffline]);
    const shouldUseThreadDividerLine = (0, react_1.useMemo)(() => {
        const topReport = sortedVisibleReportActions.length > 0 ? sortedVisibleReportActions.at(sortedVisibleReportActions.length - 1) : null;
        if (topReport && topReport.actionName !== CONST_1.default.REPORT.ACTIONS.TYPE.CREATED) {
            return false;
        }
        if ((0, ReportActionsUtils_1.isTransactionThread)(parentReportAction)) {
            return !(0, ReportActionsUtils_1.isDeletedParentAction)(parentReportAction) && !(0, ReportActionsUtils_1.isReversedTransaction)(parentReportAction);
        }
        if ((0, ReportUtils_1.isTaskReport)(report)) {
            return !(0, ReportUtils_1.isCanceledTaskReport)(report, parentReportAction);
        }
        return (0, ReportUtils_1.isExpenseReport)(report) || (0, ReportUtils_1.isIOUReport)(report) || (0, ReportUtils_1.isInvoiceReport)(report);
    }, [parentReportAction, report, sortedVisibleReportActions]);
    (0, react_1.useEffect)(() => {
        if (report.reportID !== prevReportID) {
            return;
        }
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
        const isArchivedReport = (0, ReportUtils_1.isArchivedNonExpenseReport)(report, isReportArchived);
        const hasNewMessagesInView = scrollingVerticalOffset.current < CONST_1.default.REPORT.ACTIONS.ACTION_VISIBLE_THRESHOLD;
        const hasUnreadReportAction = sortedVisibleReportActions.some((reportAction) => newMessageTimeReference &&
            newMessageTimeReference < reportAction.created &&
            ((0, ReportActionsUtils_1.isReportPreviewAction)(reportAction) ? reportAction.childLastActorAccountID : reportAction.actorAccountID) !== (0, Report_1.getCurrentUserAccountID)());
        if (!isArchivedReport && (!hasNewMessagesInView || !hasUnreadReportAction)) {
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
    const renderItem = (0, react_1.useCallback)(({ item: reportAction, index }) => {
        const originalReportID = (0, ReportUtils_1.getOriginalReportID)(report.reportID, reportAction);
        const reportDraftMessages = draftMessage?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_DRAFTS}${originalReportID}`];
        const matchingDraftMessage = reportDraftMessages?.[reportAction.reportActionID];
        const matchingDraftMessageString = typeof matchingDraftMessage === 'string' ? matchingDraftMessage : matchingDraftMessage?.message;
        const actionEmojiReactions = emojiReactions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS}${reportAction.reportActionID}`];
        const transactionID = (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction) && (0, ReportActionsUtils_1.getOriginalMessage)(reportAction)?.IOUTransactionID;
        const transaction = transactionID ? transactions?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`] : undefined;
        const actionLinkedTransactionRouteError = transaction?.errorFields?.route ?? undefined;
        return (<ReportActionsListItemRenderer_1.default allReports={allReports} policies={policies} reportAction={reportAction} reportActions={sortedReportActions} parentReportAction={parentReportAction} parentReportActionForTransactionThread={parentReportActionForTransactionThread} index={index} report={report} transactionThreadReport={transactionThreadReport} linkedReportActionID={linkedReportActionID} displayAsGroup={!(0, ReportActionsUtils_1.isConsecutiveChronosAutomaticTimerAction)(sortedVisibleReportActions, index, (0, ReportUtils_1.chatIncludesChronosWithID)(reportAction?.reportID)) &&
                (0, ReportActionsUtils_1.isConsecutiveActionMadeByPreviousActor)(sortedVisibleReportActions, index)} mostRecentIOUReportActionID={mostRecentIOUReportActionID} shouldHideThreadDividerLine={shouldHideThreadDividerLine} shouldDisplayNewMarker={reportAction.reportActionID === unreadMarkerReportActionID} shouldDisplayReplyDivider={sortedVisibleReportActions.length > 1} isFirstVisibleReportAction={firstVisibleReportActionID === reportAction.reportActionID} shouldUseThreadDividerLine={shouldUseThreadDividerLine} transactions={Object.values(transactions ?? {})} userWalletTierName={userWalletTierName} isUserValidated={isUserValidated} personalDetails={personalDetailsList} draftMessage={matchingDraftMessageString} emojiReactions={actionEmojiReactions} allDraftMessages={draftMessage} allEmojiReactions={emojiReactions} isReportArchived={isReportArchived} linkedTransactionRouteError={actionLinkedTransactionRouteError} userBillingFundID={userBillingFundID} isTryNewDotNVPDismissed={isTryNewDotNVPDismissed}/>);
    }, [
        draftMessage,
        emojiReactions,
        allReports,
        policies,
        sortedReportActions,
        parentReportAction,
        parentReportActionForTransactionThread,
        report,
        transactionThreadReport,
        linkedReportActionID,
        sortedVisibleReportActions,
        mostRecentIOUReportActionID,
        shouldHideThreadDividerLine,
        unreadMarkerReportActionID,
        firstVisibleReportActionID,
        shouldUseThreadDividerLine,
        transactions,
        userWalletTierName,
        isUserValidated,
        personalDetailsList,
        userBillingFundID,
        isTryNewDotNVPDismissed,
        isReportArchived,
    ]);
    // Native mobile does not render updates flatlist the changes even though component did update called.
    // To notify there something changes we can use extraData prop to flatlist
    const extraData = (0, react_1.useMemo)(() => [shouldUseNarrowLayout ? unreadMarkerReportActionID : undefined, (0, ReportUtils_1.isArchivedNonExpenseReport)(report, isReportArchived)], [unreadMarkerReportActionID, shouldUseNarrowLayout, report, isReportArchived]);
    const hideComposer = !(0, ReportUtils_1.canUserPerformWriteAction)(report, isReportArchived);
    const shouldShowReportRecipientLocalTime = (0, ReportUtils_1.canShowReportRecipientLocalTime)(personalDetailsList, report, currentUserPersonalDetails.accountID) && !isComposerFullSize;
    const canShowHeader = isOffline || hasHeaderRendered.current;
    const onLayoutInner = (0, react_1.useCallback)((event) => {
        onLayout(event);
        if (isScrollToBottomEnabled) {
            reportScrollManager.scrollToBottom();
            setIsScrollToBottomEnabled(false);
        }
        if (shouldScrollToEndAfterLayout) {
            reportScrollManager.scrollToEnd();
            setShouldScrollToEndAfterLayout(false);
        }
    }, [isScrollToBottomEnabled, onLayout, reportScrollManager, shouldScrollToEndAfterLayout]);
    const retryLoadNewerChatsError = (0, react_1.useCallback)(() => {
        loadNewerChats(true);
    }, [loadNewerChats]);
    const listHeaderComponent = (0, react_1.useMemo)(() => {
        // In case of an error we want to display the header no matter what.
        if (!canShowHeader) {
            // eslint-disable-next-line react-compiler/react-compiler
            hasHeaderRendered.current = true;
            return null;
        }
        return (<ListBoundaryLoader_1.default type={CONST_1.default.LIST_COMPONENTS.HEADER} onRetry={retryLoadNewerChatsError}/>);
    }, [canShowHeader, retryLoadNewerChatsError]);
    const shouldShowSkeleton = isOffline && !sortedVisibleReportActions.some((action) => action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.CREATED);
    const listFooterComponent = (0, react_1.useMemo)(() => {
        if (!shouldShowSkeleton) {
            return;
        }
        return <ReportActionsSkeletonView_1.default shouldAnimate={false}/>;
    }, [shouldShowSkeleton]);
    const onStartReached = (0, react_1.useCallback)(() => {
        if (!(0, isSearchTopmostFullScreenRoute_1.default)()) {
            loadNewerChats(false);
            return;
        }
        react_native_1.InteractionManager.runAfterInteractions(() => requestAnimationFrame(() => loadNewerChats(false)));
    }, [loadNewerChats]);
    const onEndReached = (0, react_1.useCallback)(() => {
        loadOlderChats(false);
    }, [loadOlderChats]);
    return (<>
            <FloatingMessageCounter_1.default hasNewMessages={!!unreadMarkerReportActionID} isActive={isFloatingMessageCounterVisible} onClick={scrollToBottomAndMarkReportAsRead}/>
            <react_native_1.View style={[styles.flex1, !shouldShowReportRecipientLocalTime && !hideComposer ? styles.pb4 : {}]} fsClass={reportActionsListFSClass}>
                <InvertedFlatList_1.default accessibilityLabel={translate('sidebarScreen.listOfChatMessages')} ref={reportScrollManager.ref} testID="report-actions-list" style={styles.overscrollBehaviorContain} data={sortedVisibleReportActions} renderItem={renderItem} renderScrollComponent={ActionSheetAwareScrollView_1.renderScrollComponent} contentContainerStyle={styles.chatContentScrollView} keyExtractor={keyExtractor} initialNumToRender={initialNumToRender} onEndReached={onEndReached} onEndReachedThreshold={0.75} onStartReached={onStartReached} onStartReachedThreshold={0.75} ListHeaderComponent={listHeaderComponent} ListFooterComponent={listFooterComponent} keyboardShouldPersistTaps="handled" onLayout={onLayoutInner} onScroll={trackVerticalScrolling} onViewableItemsChanged={onViewableItemsChanged} onScrollToIndexFailed={onScrollToIndexFailed} extraData={extraData} key={listID} shouldEnableAutoScrollToTopThreshold={shouldEnableAutoScrollToTopThreshold} initialScrollKey={reportActionID} onContentSizeChange={() => {
            trackVerticalScrolling(undefined);
        }}/>
            </react_native_1.View>
        </>);
}
ReportActionsList.displayName = 'ReportActionsList';
exports.default = (0, react_1.memo)(ReportActionsList);
