"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var native_1 = require("@react-navigation/native");
var react_1 = require("react");
var react_native_1 = require("react-native");
var ActionSheetAwareScrollView_1 = require("@components/ActionSheetAwareScrollView");
var InvertedFlatList_1 = require("@components/InvertedFlatList");
var BaseInvertedFlatList_1 = require("@components/InvertedFlatList/BaseInvertedFlatList");
var OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
var ReportActionsSkeletonView_1 = require("@components/ReportActionsSkeletonView");
var useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
var useLocalize_1 = require("@hooks/useLocalize");
var useNetworkWithOfflineStatus_1 = require("@hooks/useNetworkWithOfflineStatus");
var useOnyx_1 = require("@hooks/useOnyx");
var usePrevious_1 = require("@hooks/usePrevious");
var useReportIsArchived_1 = require("@hooks/useReportIsArchived");
var useReportScrollManager_1 = require("@hooks/useReportScrollManager");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var useWindowDimensions_1 = require("@hooks/useWindowDimensions");
var Browser_1 = require("@libs/Browser");
var DateUtils_1 = require("@libs/DateUtils");
var Fullstory_1 = require("@libs/Fullstory");
var getDurationHighlightItem_1 = require("@libs/Navigation/helpers/getDurationHighlightItem");
var isReportTopmostSplitNavigator_1 = require("@libs/Navigation/helpers/isReportTopmostSplitNavigator");
var isSearchTopmostFullScreenRoute_1 = require("@libs/Navigation/helpers/isSearchTopmostFullScreenRoute");
var Navigation_1 = require("@libs/Navigation/Navigation");
var ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var Visibility_1 = require("@libs/Visibility");
var variables_1 = require("@styles/variables");
var Report_1 = require("@userActions/Report");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var FloatingMessageCounter_1 = require("./FloatingMessageCounter");
var getInitialNumReportActionsToRender_1 = require("./getInitialNumReportActionsToRender");
var ListBoundaryLoader_1 = require("./ListBoundaryLoader");
var ReportActionsListItemRenderer_1 = require("./ReportActionsListItemRenderer");
var shouldDisplayNewMarkerOnReportAction_1 = require("./shouldDisplayNewMarkerOnReportAction");
var useReportUnreadMessageScrollTracking_1 = require("./useReportUnreadMessageScrollTracking");
// In the component we are subscribing to the arrival of new actions.
// As there is the possibility that there are multiple instances of a ReportScreen
// for the same report, we only ever want one subscription to be active, as
// the subscriptions could otherwise be conflicting.
var newActionUnsubscribeMap = {};
// Seems that there is an architecture issue that prevents us from using the reportID with useRef
// the useRef value gets reset when the reportID changes, so we use a global variable to keep track
var prevReportID = null;
/**
 * Create a unique key for each action in the FlatList.
 * We use the reportActionID that is a string representation of a random 64-bit int, which should be
 * random enough to avoid collisions
 */
function keyExtractor(item) {
    return item.reportActionID;
}
var onScrollToIndexFailed = function () { };
function ReportActionsList(_a) {
    var _b, _c, _d, _e;
    var report = _a.report, transactionThreadReport = _a.transactionThreadReport, parentReportAction = _a.parentReportAction, sortedReportActions = _a.sortedReportActions, sortedVisibleReportActions = _a.sortedVisibleReportActions, onScroll = _a.onScroll, _f = _a.mostRecentIOUReportActionID, mostRecentIOUReportActionID = _f === void 0 ? '' : _f, loadNewerChats = _a.loadNewerChats, loadOlderChats = _a.loadOlderChats, onLayout = _a.onLayout, isComposerFullSize = _a.isComposerFullSize, listID = _a.listID, shouldEnableAutoScrollToTopThreshold = _a.shouldEnableAutoScrollToTopThreshold, parentReportActionForTransactionThread = _a.parentReportActionForTransactionThread;
    var currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    var personalDetailsList = (0, OnyxListItemProvider_1.usePersonalDetails)();
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var windowHeight = (0, useWindowDimensions_1.default)().windowHeight;
    var shouldUseNarrowLayout = (0, useResponsiveLayout_1.default)().shouldUseNarrowLayout;
    var getLocalDateFromDatetime = (0, useLocalize_1.default)().getLocalDateFromDatetime;
    var _g = (0, useNetworkWithOfflineStatus_1.default)(), isOffline = _g.isOffline, lastOfflineAt = _g.lastOfflineAt, lastOnlineAt = _g.lastOnlineAt;
    var route = (0, native_1.useRoute)();
    var reportScrollManager = (0, useReportScrollManager_1.default)();
    var userActiveSince = (0, react_1.useRef)(DateUtils_1.default.getDBTime());
    var lastMessageTime = (0, react_1.useRef)(null);
    var _h = (0, react_1.useState)(Visibility_1.default.isVisible), isVisible = _h[0], setIsVisible = _h[1];
    var isFocused = (0, native_1.useIsFocused)();
    var allReports = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { canBeMissing: false })[0];
    var policies = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: true })[0];
    var transactions = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION, { canBeMissing: true })[0];
    var accountID = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { selector: function (session) { return session === null || session === void 0 ? void 0 : session.accountID; }, canBeMissing: true })[0];
    var participantsContext = (0, react_1.useContext)(OnyxListItemProvider_1.PersonalDetailsContext);
    var isReportArchived = (0, useReportIsArchived_1.default)(report === null || report === void 0 ? void 0 : report.reportID);
    var userWalletTierName = (0, useOnyx_1.default)(ONYXKEYS_1.default.USER_WALLET, { selector: function (wallet) { return wallet === null || wallet === void 0 ? void 0 : wallet.tierName; }, canBeMissing: false })[0];
    var isUserValidated = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { selector: function (account) { return account === null || account === void 0 ? void 0 : account.validated; }, canBeMissing: true })[0];
    var draftMessage = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_DRAFTS), { canBeMissing: true })[0];
    var emojiReactions = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS), { canBeMissing: true })[0];
    var userBillingFundID = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_BILLING_FUND_ID, { canBeMissing: true })[0];
    var tryNewDot = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_TRY_NEW_DOT, { canBeMissing: false })[0];
    var isTryNewDotNVPDismissed = !!((_b = tryNewDot === null || tryNewDot === void 0 ? void 0 : tryNewDot.classicRedirect) === null || _b === void 0 ? void 0 : _b.dismissed);
    var _j = (0, react_1.useState)(false), isScrollToBottomEnabled = _j[0], setIsScrollToBottomEnabled = _j[1];
    var _k = (0, react_1.useState)(false), shouldScrollToEndAfterLayout = _k[0], setShouldScrollToEndAfterLayout = _k[1];
    var _l = (0, react_1.useState)(''), actionIdToHighlight = _l[0], setActionIdToHighlight = _l[1];
    (0, react_1.useEffect)(function () {
        var unsubscribe = Visibility_1.default.onVisibilityChange(function () {
            setIsVisible(Visibility_1.default.isVisible());
        });
        return unsubscribe;
    }, []);
    var scrollingVerticalOffset = (0, react_1.useRef)(0);
    var readActionSkipped = (0, react_1.useRef)(false);
    var hasHeaderRendered = (0, react_1.useRef)(false);
    var linkedReportActionID = (_c = route === null || route === void 0 ? void 0 : route.params) === null || _c === void 0 ? void 0 : _c.reportActionID;
    var lastAction = sortedVisibleReportActions.at(0);
    var sortedVisibleReportActionsObjects = (0, react_1.useMemo)(function () {
        return sortedVisibleReportActions.reduce(function (actions, action) {
            var _a;
            Object.assign(actions, (_a = {}, _a[action.reportActionID] = action, _a));
            return actions;
        }, {});
    }, [sortedVisibleReportActions]);
    var prevSortedVisibleReportActionsObjects = (0, usePrevious_1.default)(sortedVisibleReportActionsObjects);
    var reportLastReadTime = (_d = report.lastReadTime) !== null && _d !== void 0 ? _d : '';
    /**
     * The timestamp for the unread marker.
     *
     * This should ONLY be updated when the user
     * - switches reports
     * - marks a message as read/unread
     * - reads a new message as it is received
     */
    var _m = (0, react_1.useState)(reportLastReadTime), unreadMarkerTime = _m[0], setUnreadMarkerTime = _m[1];
    (0, react_1.useEffect)(function () {
        setUnreadMarkerTime(reportLastReadTime);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [report.reportID]);
    var prevUnreadMarkerReportActionID = (0, react_1.useRef)(null);
    /**
     * The index of the earliest message that was received while offline
     */
    var earliestReceivedOfflineMessageIndex = (0, react_1.useMemo)(function () {
        // Create a list of (sorted) indices of message that were received while offline
        var receivedOfflineMessages = sortedReportActions.reduce(function (acc, message, index) {
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
    var _o = (0, react_1.useMemo)(function () {
        // If there are message that were received while offline,
        // we can skip checking all messages later than the earliest received offline message.
        var startIndex = earliestReceivedOfflineMessageIndex !== null && earliestReceivedOfflineMessageIndex !== void 0 ? earliestReceivedOfflineMessageIndex : 0;
        // Scan through each visible report action until we find the appropriate action to show the unread marker
        for (var index = startIndex; index < sortedVisibleReportActions.length; index++) {
            var reportAction = sortedVisibleReportActions.at(index);
            var nextAction = sortedVisibleReportActions.at(index + 1);
            var isEarliestReceivedOfflineMessage = index === earliestReceivedOfflineMessageIndex;
            // eslint-disable-next-line react-compiler/react-compiler
            var shouldDisplayNewMarker = reportAction &&
                (0, shouldDisplayNewMarkerOnReportAction_1.default)({
                    message: reportAction,
                    nextMessage: nextAction,
                    isEarliestReceivedOfflineMessage: isEarliestReceivedOfflineMessage,
                    accountID: accountID,
                    prevSortedVisibleReportActionsObjects: prevSortedVisibleReportActionsObjects,
                    unreadMarkerTime: unreadMarkerTime,
                    scrollingVerticalOffset: scrollingVerticalOffset.current,
                    prevUnreadMarkerReportActionID: prevUnreadMarkerReportActionID.current,
                });
            if (shouldDisplayNewMarker) {
                return [reportAction.reportActionID, index];
            }
        }
        return [null, -1];
    }, [accountID, earliestReceivedOfflineMessageIndex, prevSortedVisibleReportActionsObjects, sortedVisibleReportActions, unreadMarkerTime]), unreadMarkerReportActionID = _o[0], unreadMarkerReportActionIndex = _o[1];
    prevUnreadMarkerReportActionID.current = unreadMarkerReportActionID;
    /**
     * Subscribe to read/unread events and update our unreadMarkerTime
     */
    (0, react_1.useEffect)(function () {
        var unreadActionSubscription = react_native_1.DeviceEventEmitter.addListener("unreadAction_".concat(report.reportID), function (newLastReadTime) {
            setUnreadMarkerTime(newLastReadTime);
            userActiveSince.current = DateUtils_1.default.getDBTime();
        });
        var readNewestActionSubscription = react_native_1.DeviceEventEmitter.addListener("readNewestAction_".concat(report.reportID), function (newLastReadTime) {
            setUnreadMarkerTime(newLastReadTime);
        });
        return function () {
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
    (0, react_1.useLayoutEffect)(function () {
        var _a;
        if (unreadMarkerReportActionID) {
            return;
        }
        var mostRecentReportActionCreated = (_a = lastAction === null || lastAction === void 0 ? void 0 : lastAction.created) !== null && _a !== void 0 ? _a : '';
        if (mostRecentReportActionCreated <= unreadMarkerTime) {
            return;
        }
        setUnreadMarkerTime(mostRecentReportActionCreated);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [lastAction === null || lastAction === void 0 ? void 0 : lastAction.created]);
    var lastActionIndex = lastAction === null || lastAction === void 0 ? void 0 : lastAction.reportActionID;
    var reportActionSize = (0, react_1.useRef)(sortedVisibleReportActions.length);
    var lastVisibleActionCreated = (0, ReportUtils_1.getReportLastVisibleActionCreated)(report, transactionThreadReport);
    var hasNewestReportAction = (lastAction === null || lastAction === void 0 ? void 0 : lastAction.created) === lastVisibleActionCreated || (0, ReportActionsUtils_1.isReportPreviewAction)(lastAction);
    var hasNewestReportActionRef = (0, react_1.useRef)(hasNewestReportAction);
    // eslint-disable-next-line react-compiler/react-compiler
    hasNewestReportActionRef.current = hasNewestReportAction;
    var previousLastIndex = (0, react_1.useRef)(lastActionIndex);
    // Display the new message indicator when comment linking and not close to the newest message.
    var reportActionID = (_e = route === null || route === void 0 ? void 0 : route.params) === null || _e === void 0 ? void 0 : _e.reportActionID;
    var _p = (0, useReportUnreadMessageScrollTracking_1.default)({
        reportID: report.reportID,
        currentVerticalScrollingOffsetRef: scrollingVerticalOffset,
        readActionSkippedRef: readActionSkipped,
        unreadMarkerReportActionIndex: unreadMarkerReportActionIndex,
        isInverted: true,
        onTrackScrolling: function (event) {
            scrollingVerticalOffset.current = event.nativeEvent.contentOffset.y;
            onScroll === null || onScroll === void 0 ? void 0 : onScroll(event);
        },
    }), isFloatingMessageCounterVisible = _p.isFloatingMessageCounterVisible, setIsFloatingMessageCounterVisible = _p.setIsFloatingMessageCounterVisible, trackVerticalScrolling = _p.trackVerticalScrolling, onViewableItemsChanged = _p.onViewableItemsChanged;
    (0, react_1.useEffect)(function () {
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
    (0, react_1.useEffect)(function () {
        userActiveSince.current = DateUtils_1.default.getDBTime();
        prevReportID = report.reportID;
    }, [report.reportID]);
    (0, react_1.useEffect)(function () {
        var _a;
        if (report.reportID !== prevReportID) {
            return;
        }
        if ((0, ReportUtils_1.isUnread)(report, transactionThreadReport, isReportArchived) || (lastAction && (0, ReportActionsUtils_1.isCurrentActionUnread)(report, lastAction, sortedVisibleReportActions))) {
            // On desktop, when the notification center is displayed, isVisible will return false.
            // Currently, there's no programmatic way to dismiss the notification center panel.
            // To handle this, we use the 'referrer' parameter to check if the current navigation is triggered from a notification.
            var isFromNotification = ((_a = route === null || route === void 0 ? void 0 : route.params) === null || _a === void 0 ? void 0 : _a.referrer) === CONST_1.default.REFERRER.NOTIFICATION;
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
    }, [report.lastVisibleActionCreated, transactionThreadReport === null || transactionThreadReport === void 0 ? void 0 : transactionThreadReport.lastVisibleActionCreated, report.reportID, isVisible]);
    (0, react_1.useEffect)(function () {
        if (linkedReportActionID) {
            return;
        }
        var shouldScrollToEnd = ((0, ReportUtils_1.isExpenseReport)(report) || (0, ReportActionsUtils_1.isTransactionThread)(parentReportAction)) && (0, isSearchTopmostFullScreenRoute_1.default)() && hasNewestReportAction && !unreadMarkerReportActionID;
        if (shouldScrollToEnd) {
            setShouldScrollToEndAfterLayout(true);
        }
        react_native_1.InteractionManager.runAfterInteractions(function () {
            setIsFloatingMessageCounterVisible(false);
            if (!shouldScrollToEnd) {
                reportScrollManager.scrollToBottom();
            }
        });
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    // Fixes Safari-specific issue where the whisper option is not highlighted correctly on hover after adding new transaction.
    // https://github.com/Expensify/App/issues/54520
    (0, react_1.useEffect)(function () {
        if (!(0, Browser_1.isSafari)()) {
            return;
        }
        var prevSorted = (lastAction === null || lastAction === void 0 ? void 0 : lastAction.reportActionID) ? prevSortedVisibleReportActionsObjects[lastAction === null || lastAction === void 0 ? void 0 : lastAction.reportActionID] : null;
        if ((lastAction === null || lastAction === void 0 ? void 0 : lastAction.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.ACTIONABLE_TRACK_EXPENSE_WHISPER && !prevSorted) {
            react_native_1.InteractionManager.runAfterInteractions(function () {
                reportScrollManager.scrollToBottom();
            });
        }
    }, [lastAction, prevSortedVisibleReportActionsObjects, reportScrollManager]);
    var scrollToBottomForCurrentUserAction = (0, react_1.useCallback)(function (isFromCurrentUser, action) {
        react_native_1.InteractionManager.runAfterInteractions(function () {
            // If a new comment is added and it's from the current user scroll to the bottom otherwise leave the user positioned where
            // they are now in the list.
            if (!isFromCurrentUser || (!(0, isReportTopmostSplitNavigator_1.default)() && !Navigation_1.default.getReportRHPActiveRoute())) {
                return;
            }
            if (!hasNewestReportActionRef.current && !isFromCurrentUser) {
                if (Navigation_1.default.getReportRHPActiveRoute()) {
                    return;
                }
                Navigation_1.default.setNavigationActionToMicrotaskQueue(function () {
                    Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(report.reportID));
                });
                return;
            }
            var index = sortedVisibleReportActions.findIndex(function (item) { return keyExtractor(item) === (action === null || action === void 0 ? void 0 : action.reportActionID); });
            if ((action === null || action === void 0 ? void 0 : action.actionName) === CONST_1.default.REPORT.ACTIONS.TYPE.REPORT_PREVIEW) {
                if (index > 0) {
                    setTimeout(function () {
                        reportScrollManager.scrollToIndex(index);
                    }, 100);
                }
                else {
                    setIsFloatingMessageCounterVisible(false);
                    reportScrollManager.scrollToBottom();
                }
                if (action === null || action === void 0 ? void 0 : action.reportActionID) {
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
    (0, react_1.useEffect)(function () {
        if (actionIdToHighlight === '') {
            return;
        }
        // Time highlight is the same as SearchPage
        var timer = setTimeout(function () {
            setActionIdToHighlight('');
        }, getDurationHighlightItem_1.default);
        return function () { return clearTimeout(timer); };
    }, [actionIdToHighlight]);
    (0, react_1.useEffect)(function () {
        // Why are we doing this, when in the cleanup of the useEffect we are already calling the unsubscribe function?
        // Answer: On web, when navigating to another report screen, the previous report screen doesn't get unmounted,
        //         meaning that the cleanup might not get called. When we then open a report we had open already previously, a new
        //         ReportScreen will get created. Thus, we have to cancel the earlier subscription of the previous screen,
        //         because the two subscriptions could conflict!
        //         In case we return to the previous screen (e.g. by web back navigation) the useEffect for that screen would
        //         fire again, as the focus has changed and will set up the subscription correctly again.
        var previousSubUnsubscribe = newActionUnsubscribeMap[report.reportID];
        if (previousSubUnsubscribe) {
            previousSubUnsubscribe();
        }
        // This callback is triggered when a new action arrives via Pusher and the event is emitted from Report.js. This allows us to maintain
        // a single source of truth for the "new action" event instead of trying to derive that a new action has appeared from looking at props.
        var unsubscribe = (0, Report_1.subscribeToNewActionEvent)(report.reportID, scrollToBottomForCurrentUserAction);
        var cleanup = function () {
            if (!unsubscribe) {
                return;
            }
            unsubscribe();
        };
        newActionUnsubscribeMap[report.reportID] = cleanup;
        return cleanup;
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [report.reportID]);
    var reportActionsListFSClass = Fullstory_1.default.getChatFSClass(participantsContext, report);
    var lastIOUActionWithError = sortedVisibleReportActions.find(function (action) { return action.errors; });
    var prevLastIOUActionWithError = (0, usePrevious_1.default)(lastIOUActionWithError);
    (0, react_1.useEffect)(function () {
        if ((lastIOUActionWithError === null || lastIOUActionWithError === void 0 ? void 0 : lastIOUActionWithError.reportActionID) === (prevLastIOUActionWithError === null || prevLastIOUActionWithError === void 0 ? void 0 : prevLastIOUActionWithError.reportActionID)) {
            return;
        }
        react_native_1.InteractionManager.runAfterInteractions(function () {
            reportScrollManager.scrollToBottom();
        });
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [lastAction]);
    var scrollToBottomAndMarkReportAsRead = (0, react_1.useCallback)(function () {
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
    var initialNumToRender = (0, react_1.useMemo)(function () {
        var minimumReportActionHeight = styles.chatItem.paddingTop + styles.chatItem.paddingBottom + variables_1.default.fontSizeNormalHeight;
        var availableHeight = windowHeight - (CONST_1.default.CHAT_FOOTER_MIN_HEIGHT + variables_1.default.contentHeaderHeight);
        var numToRender = Math.ceil(availableHeight / minimumReportActionHeight);
        if (linkedReportActionID) {
            return (0, getInitialNumReportActionsToRender_1.default)(numToRender);
        }
        return numToRender || undefined;
    }, [styles.chatItem.paddingBottom, styles.chatItem.paddingTop, windowHeight, linkedReportActionID]);
    /**
     * Thread's divider line should hide when the first chat in the thread is marked as unread.
     * This is so that it will not be conflicting with header's separator line.
     */
    var shouldHideThreadDividerLine = (0, react_1.useMemo)(function () { return (0, ReportActionsUtils_1.getFirstVisibleReportActionID)(sortedReportActions, isOffline) === unreadMarkerReportActionID; }, [sortedReportActions, isOffline, unreadMarkerReportActionID]);
    var firstVisibleReportActionID = (0, react_1.useMemo)(function () { return (0, ReportActionsUtils_1.getFirstVisibleReportActionID)(sortedReportActions, isOffline); }, [sortedReportActions, isOffline]);
    var shouldUseThreadDividerLine = (0, react_1.useMemo)(function () {
        var topReport = sortedVisibleReportActions.length > 0 ? sortedVisibleReportActions.at(sortedVisibleReportActions.length - 1) : null;
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
    (0, react_1.useEffect)(function () {
        var _a;
        if (report.reportID !== prevReportID) {
            return;
        }
        if (!isVisible || !isFocused) {
            if (!lastMessageTime.current) {
                lastMessageTime.current = (_a = lastAction === null || lastAction === void 0 ? void 0 : lastAction.created) !== null && _a !== void 0 ? _a : '';
            }
            return;
        }
        // In case the user read new messages (after being inactive) with other device we should
        // show marker based on report.lastReadTime
        var newMessageTimeReference = lastMessageTime.current && report.lastReadTime && lastMessageTime.current > report.lastReadTime ? userActiveSince.current : report.lastReadTime;
        lastMessageTime.current = null;
        var isArchivedReport = (0, ReportUtils_1.isArchivedNonExpenseReport)(report, isReportArchived);
        var hasNewMessagesInView = scrollingVerticalOffset.current < CONST_1.default.REPORT.ACTIONS.ACTION_VISIBLE_THRESHOLD;
        var hasUnreadReportAction = sortedVisibleReportActions.some(function (reportAction) {
            return newMessageTimeReference &&
                newMessageTimeReference < reportAction.created &&
                ((0, ReportActionsUtils_1.isReportPreviewAction)(reportAction) ? reportAction.childLastActorAccountID : reportAction.actorAccountID) !== (0, Report_1.getCurrentUserAccountID)();
        });
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
    var renderItem = (0, react_1.useCallback)(function (_a) {
        var _b, _c, _d;
        var reportAction = _a.item, index = _a.index;
        var originalReportID = (0, ReportUtils_1.getOriginalReportID)(report.reportID, reportAction);
        var reportDraftMessages = draftMessage === null || draftMessage === void 0 ? void 0 : draftMessage["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_DRAFTS).concat(originalReportID)];
        var matchingDraftMessage = reportDraftMessages === null || reportDraftMessages === void 0 ? void 0 : reportDraftMessages[reportAction.reportActionID];
        var matchingDraftMessageString = typeof matchingDraftMessage === 'string' ? matchingDraftMessage : matchingDraftMessage === null || matchingDraftMessage === void 0 ? void 0 : matchingDraftMessage.message;
        var actionEmojiReactions = emojiReactions === null || emojiReactions === void 0 ? void 0 : emojiReactions["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS).concat(reportAction.reportActionID)];
        var transactionID = (0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction) && ((_b = (0, ReportActionsUtils_1.getOriginalMessage)(reportAction)) === null || _b === void 0 ? void 0 : _b.IOUTransactionID);
        var transaction = transactionID ? transactions === null || transactions === void 0 ? void 0 : transactions["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactionID)] : undefined;
        var actionLinkedTransactionRouteError = (_d = (_c = transaction === null || transaction === void 0 ? void 0 : transaction.errorFields) === null || _c === void 0 ? void 0 : _c.route) !== null && _d !== void 0 ? _d : undefined;
        return (<ReportActionsListItemRenderer_1.default allReports={allReports} policies={policies} reportAction={reportAction} reportActions={sortedReportActions} parentReportAction={parentReportAction} parentReportActionForTransactionThread={parentReportActionForTransactionThread} index={index} report={report} transactionThreadReport={transactionThreadReport} linkedReportActionID={linkedReportActionID} displayAsGroup={!(0, ReportActionsUtils_1.isConsecutiveChronosAutomaticTimerAction)(sortedVisibleReportActions, index, (0, ReportUtils_1.chatIncludesChronosWithID)(reportAction === null || reportAction === void 0 ? void 0 : reportAction.reportID)) &&
                (0, ReportActionsUtils_1.isConsecutiveActionMadeByPreviousActor)(sortedVisibleReportActions, index)} mostRecentIOUReportActionID={mostRecentIOUReportActionID} shouldHideThreadDividerLine={shouldHideThreadDividerLine} shouldDisplayNewMarker={reportAction.reportActionID === unreadMarkerReportActionID} shouldDisplayReplyDivider={sortedVisibleReportActions.length > 1} isFirstVisibleReportAction={firstVisibleReportActionID === reportAction.reportActionID} shouldUseThreadDividerLine={shouldUseThreadDividerLine} transactions={Object.values(transactions !== null && transactions !== void 0 ? transactions : {})} userWalletTierName={userWalletTierName} isUserValidated={isUserValidated} personalDetails={personalDetailsList} draftMessage={matchingDraftMessageString} emojiReactions={actionEmojiReactions} allDraftMessages={draftMessage} allEmojiReactions={emojiReactions} isReportArchived={isReportArchived} linkedTransactionRouteError={actionLinkedTransactionRouteError} userBillingFundID={userBillingFundID} isTryNewDotNVPDismissed={isTryNewDotNVPDismissed}/>);
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
    var extraData = (0, react_1.useMemo)(function () { return [shouldUseNarrowLayout ? unreadMarkerReportActionID : undefined, (0, ReportUtils_1.isArchivedNonExpenseReport)(report, isReportArchived)]; }, [unreadMarkerReportActionID, shouldUseNarrowLayout, report, isReportArchived]);
    var hideComposer = !(0, ReportUtils_1.canUserPerformWriteAction)(report, isReportArchived);
    var shouldShowReportRecipientLocalTime = (0, ReportUtils_1.canShowReportRecipientLocalTime)(personalDetailsList, report, currentUserPersonalDetails.accountID) && !isComposerFullSize;
    var canShowHeader = isOffline || hasHeaderRendered.current;
    var onLayoutInner = (0, react_1.useCallback)(function (event) {
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
    var retryLoadNewerChatsError = (0, react_1.useCallback)(function () {
        loadNewerChats(true);
    }, [loadNewerChats]);
    var listHeaderComponent = (0, react_1.useMemo)(function () {
        // In case of an error we want to display the header no matter what.
        if (!canShowHeader) {
            // eslint-disable-next-line react-compiler/react-compiler
            hasHeaderRendered.current = true;
            return null;
        }
        return (<ListBoundaryLoader_1.default type={CONST_1.default.LIST_COMPONENTS.HEADER} onRetry={retryLoadNewerChatsError}/>);
    }, [canShowHeader, retryLoadNewerChatsError]);
    var shouldShowSkeleton = isOffline && !sortedVisibleReportActions.some(function (action) { return action.actionName === CONST_1.default.REPORT.ACTIONS.TYPE.CREATED; });
    var listFooterComponent = (0, react_1.useMemo)(function () {
        if (!shouldShowSkeleton) {
            return;
        }
        return <ReportActionsSkeletonView_1.default shouldAnimate={false}/>;
    }, [shouldShowSkeleton]);
    var onStartReached = (0, react_1.useCallback)(function () {
        if (!(0, isSearchTopmostFullScreenRoute_1.default)()) {
            loadNewerChats(false);
            return;
        }
        react_native_1.InteractionManager.runAfterInteractions(function () { return requestAnimationFrame(function () { return loadNewerChats(false); }); });
    }, [loadNewerChats]);
    var onEndReached = (0, react_1.useCallback)(function () {
        loadOlderChats(false);
    }, [loadOlderChats]);
    return (<>
            <FloatingMessageCounter_1.default hasNewMessages={!!unreadMarkerReportActionID} isActive={isFloatingMessageCounterVisible} onClick={scrollToBottomAndMarkReportAsRead}/>
            <react_native_1.View style={[styles.flex1, !shouldShowReportRecipientLocalTime && !hideComposer ? styles.pb4 : {}]} fsClass={reportActionsListFSClass}>
                <InvertedFlatList_1.default accessibilityLabel={translate('sidebarScreen.listOfChatMessages')} ref={reportScrollManager.ref} testID="report-actions-list" style={styles.overscrollBehaviorContain} data={sortedVisibleReportActions} renderItem={renderItem} renderScrollComponent={ActionSheetAwareScrollView_1.renderScrollComponent} contentContainerStyle={styles.chatContentScrollView} keyExtractor={keyExtractor} initialNumToRender={initialNumToRender} onEndReached={onEndReached} onEndReachedThreshold={0.75} onStartReached={onStartReached} onStartReachedThreshold={0.75} ListHeaderComponent={listHeaderComponent} ListFooterComponent={listFooterComponent} keyboardShouldPersistTaps="handled" onLayout={onLayoutInner} onScroll={trackVerticalScrolling} onViewableItemsChanged={onViewableItemsChanged} onScrollToIndexFailed={onScrollToIndexFailed} extraData={extraData} key={listID} shouldEnableAutoScrollToTopThreshold={shouldEnableAutoScrollToTopThreshold} initialScrollKey={reportActionID} onContentSizeChange={function () {
            trackVerticalScrolling(undefined);
        }}/>
            </react_native_1.View>
        </>);
}
ReportActionsList.displayName = 'ReportActionsList';
exports.default = (0, react_1.memo)(ReportActionsList);
