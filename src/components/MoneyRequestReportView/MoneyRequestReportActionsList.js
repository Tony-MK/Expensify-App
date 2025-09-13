"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var native_1 = require("@react-navigation/native");
var isEmpty_1 = require("lodash/isEmpty");
var react_1 = require("react");
var react_native_1 = require("react-native");
var ButtonWithDropdownMenu_1 = require("@components/ButtonWithDropdownMenu");
var Checkbox_1 = require("@components/Checkbox");
var ConfirmModal_1 = require("@components/ConfirmModal");
var DecisionModal_1 = require("@components/DecisionModal");
var FlatList_1 = require("@components/FlatList");
var BaseInvertedFlatList_1 = require("@components/InvertedFlatList/BaseInvertedFlatList");
var OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
var Pressable_1 = require("@components/Pressable");
var SearchContext_1 = require("@components/Search/SearchContext");
var Text_1 = require("@components/Text");
var useLoadReportActions_1 = require("@hooks/useLoadReportActions");
var useLocalize_1 = require("@hooks/useLocalize");
var useMobileSelectionMode_1 = require("@hooks/useMobileSelectionMode");
var useNetworkWithOfflineStatus_1 = require("@hooks/useNetworkWithOfflineStatus");
var useOnyx_1 = require("@hooks/useOnyx");
var usePrevious_1 = require("@hooks/usePrevious");
var useReportIsArchived_1 = require("@hooks/useReportIsArchived");
var useReportScrollManager_1 = require("@hooks/useReportScrollManager");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useSelectedTransactionsActions_1 = require("@hooks/useSelectedTransactionsActions");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Search_1 = require("@libs/actions/Search");
var DateUtils_1 = require("@libs/DateUtils");
var getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
var MoneyRequestReportUtils_1 = require("@libs/MoneyRequestReportUtils");
var Navigation_1 = require("@libs/Navigation/Navigation");
var ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var markOpenReportEnd_1 = require("@libs/Telemetry/markOpenReportEnd");
var TransactionUtils_1 = require("@libs/TransactionUtils");
var Visibility_1 = require("@libs/Visibility");
var isSearchTopmostFullScreenRoute_1 = require("@navigation/helpers/isSearchTopmostFullScreenRoute");
var FloatingMessageCounter_1 = require("@pages/home/report/FloatingMessageCounter");
var ReportActionsListItemRenderer_1 = require("@pages/home/report/ReportActionsListItemRenderer");
var shouldDisplayNewMarkerOnReportAction_1 = require("@pages/home/report/shouldDisplayNewMarkerOnReportAction");
var useReportUnreadMessageScrollTracking_1 = require("@pages/home/report/useReportUnreadMessageScrollTracking");
var variables_1 = require("@styles/variables");
var Report_1 = require("@userActions/Report");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var MoneyRequestReportTransactionList_1 = require("./MoneyRequestReportTransactionList");
var MoneyRequestViewReportFields_1 = require("./MoneyRequestViewReportFields");
var ReportActionsListLoadingSkeleton_1 = require("./ReportActionsListLoadingSkeleton");
var SearchMoneyRequestReportEmptyState_1 = require("./SearchMoneyRequestReportEmptyState");
/**
 * In this view we are not handling the special single transaction case, we're just handling the report
 */
var EmptyParentReportActionForTransactionThread = undefined;
var INITIAL_NUM_TO_RENDER = 20;
// Amount of time to wait until all list items should be rendered and scrollToEnd will behave well
var DELAY_FOR_SCROLLING_TO_END = 100;
function getParentReportAction(parentReportActions, parentReportActionID) {
    if (!parentReportActions || !parentReportActionID) {
        return;
    }
    return parentReportActions[parentReportActionID];
}
function MoneyRequestReportActionsList(_a) {
    var _b;
    var _c, _d, _e;
    var report = _a.report, policy = _a.policy, _f = _a.reportActions, reportActions = _f === void 0 ? [] : _f, _g = _a.transactions, transactions = _g === void 0 ? [] : _g, newTransactions = _a.newTransactions, violations = _a.violations, hasNewerActions = _a.hasNewerActions, hasOlderActions = _a.hasOlderActions, showReportActionsLoadingState = _a.showReportActionsLoadingState;
    var styles = (0, useThemeStyles_1.default)();
    var _h = (0, useLocalize_1.default)(), translate = _h.translate, getLocalDateFromDatetime = _h.getLocalDateFromDatetime;
    var _j = (0, useNetworkWithOfflineStatus_1.default)(), isOffline = _j.isOffline, lastOfflineAt = _j.lastOfflineAt, lastOnlineAt = _j.lastOnlineAt;
    var reportScrollManager = (0, useReportScrollManager_1.default)();
    var lastMessageTime = (0, react_1.useRef)(null);
    var didLayout = (0, react_1.useRef)(false);
    var _k = (0, react_1.useState)(Visibility_1.default.isVisible), isVisible = _k[0], setIsVisible = _k[1];
    var isFocused = (0, native_1.useIsFocused)();
    var route = (0, native_1.useRoute)();
    // wrapped in useMemo to avoid unnecessary re-renders and improve performance
    var reportTransactionIDs = (0, react_1.useMemo)(function () { return transactions.map(function (transaction) { return transaction.transactionID; }); }, [transactions]);
    var chatReport = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat((0, getNonEmptyStringOnyxID_1.default)(report === null || report === void 0 ? void 0 : report.chatReportID)), { canBeMissing: true })[0];
    var reportID = report === null || report === void 0 ? void 0 : report.reportID;
    var linkedReportActionID = (_c = route === null || route === void 0 ? void 0 : route.params) === null || _c === void 0 ? void 0 : _c.reportActionID;
    var allReports = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { canBeMissing: false })[0];
    var policies = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: false })[0];
    var parentReportAction = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat((0, getNonEmptyStringOnyxID_1.default)(report === null || report === void 0 ? void 0 : report.parentReportID)), {
        canEvict: false,
        canBeMissing: true,
        selector: function (parentReportActions) { return getParentReportAction(parentReportActions, report === null || report === void 0 ? void 0 : report.parentReportActionID); },
    })[0];
    var userWalletTierName = (0, useOnyx_1.default)(ONYXKEYS_1.default.USER_WALLET, { selector: function (wallet) { return wallet === null || wallet === void 0 ? void 0 : wallet.tierName; }, canBeMissing: false })[0];
    var isUserValidated = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { selector: function (account) { return account === null || account === void 0 ? void 0 : account.validated; }, canBeMissing: true })[0];
    var userBillingFundID = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_BILLING_FUND_ID, { canBeMissing: true })[0];
    var personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    var emojiReactions = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS), { canBeMissing: true })[0];
    var draftMessage = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_DRAFTS), { canBeMissing: true })[0];
    var tryNewDot = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_TRY_NEW_DOT, { canBeMissing: false })[0];
    var isTryNewDotNVPDismissed = !!((_d = tryNewDot === null || tryNewDot === void 0 ? void 0 : tryNewDot.classicRedirect) === null || _d === void 0 ? void 0 : _d.dismissed);
    var transactionsWithoutPendingDelete = (0, react_1.useMemo)(function () { return transactions.filter(function (t) { return !(0, TransactionUtils_1.isTransactionPendingDelete)(t); }); }, [transactions]);
    var mostRecentIOUReportActionID = (0, react_1.useMemo)(function () { return (0, ReportActionsUtils_1.getMostRecentIOURequestActionID)(reportActions); }, [reportActions]);
    var transactionThreadReportID = (0, ReportActionsUtils_1.getOneTransactionThreadReportID)(report, chatReport, reportActions !== null && reportActions !== void 0 ? reportActions : [], false, reportTransactionIDs);
    var firstVisibleReportActionID = (0, react_1.useMemo)(function () { return (0, ReportActionsUtils_1.getFirstVisibleReportActionID)(reportActions, isOffline); }, [reportActions, isOffline]);
    var transactionThreadReport = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(transactionThreadReportID), { canBeMissing: true })[0];
    var currentUserAccountID = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false, selector: function (session) { return session === null || session === void 0 ? void 0 : session.accountID; } })[0];
    var isReportArchived = (0, useReportIsArchived_1.default)(reportID);
    var canPerformWriteAction = (0, ReportUtils_1.canUserPerformWriteAction)(report, isReportArchived);
    var shouldUseNarrowLayout = (0, useResponsiveLayout_1.default)().shouldUseNarrowLayout;
    var session = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false })[0];
    var _l = (0, react_1.useState)(false), isDownloadErrorModalVisible = _l[0], setIsDownloadErrorModalVisible = _l[1];
    var _m = (0, SearchContext_1.useSearchContext)(), selectedTransactionIDs = _m.selectedTransactionIDs, setSelectedTransactions = _m.setSelectedTransactions, clearSelectedTransactions = _m.clearSelectedTransactions;
    var isMobileSelectionModeEnabled = (0, useMobileSelectionMode_1.default)();
    var _o = (0, react_1.useState)(false), isExportWithTemplateModalVisible = _o[0], setIsExportWithTemplateModalVisible = _o[1];
    var beginExportWithTemplate = (0, react_1.useCallback)(function (templateName, templateType, transactionIDList) {
        if (!report) {
            return;
        }
        setIsExportWithTemplateModalVisible(true);
        (0, Search_1.queueExportSearchWithTemplate)({
            templateName: templateName,
            templateType: templateType,
            jsonQuery: '{}',
            reportIDList: [report.reportID],
            transactionIDList: transactionIDList,
            policyID: policy === null || policy === void 0 ? void 0 : policy.id,
        });
    }, [report, policy]);
    var _p = (0, useSelectedTransactionsActions_1.default)({
        report: report,
        reportActions: reportActions,
        allTransactionsLength: transactions.length,
        session: session,
        onExportFailed: function () { return setIsDownloadErrorModalVisible(true); },
        policy: policy,
        beginExportWithTemplate: function (templateName, templateType, transactionIDList) { return beginExportWithTemplate(templateName, templateType, transactionIDList); },
    }), selectedTransactionsOptions = _p.options, handleDeleteTransactions = _p.handleDeleteTransactions, isDeleteModalVisible = _p.isDeleteModalVisible, hideDeleteModal = _p.hideDeleteModal;
    // We are reversing actions because in this View we are starting at the top and don't use Inverted list
    var visibleReportActions = (0, react_1.useMemo)(function () {
        var filteredActions = reportActions.filter(function (reportAction) {
            var isActionVisibleOnMoneyReport = (0, MoneyRequestReportUtils_1.isActionVisibleOnMoneyRequestReport)(reportAction);
            return (isActionVisibleOnMoneyReport &&
                (isOffline || (0, ReportActionsUtils_1.isDeletedParentAction)(reportAction) || reportAction.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE || reportAction.errors) &&
                (0, ReportActionsUtils_1.shouldReportActionBeVisible)(reportAction, reportAction.reportActionID, canPerformWriteAction) &&
                (0, ReportActionsUtils_1.isIOUActionMatchingTransactionList)(reportAction, reportTransactionIDs));
        });
        return filteredActions.toReversed();
    }, [reportActions, isOffline, canPerformWriteAction, reportTransactionIDs]);
    var reportActionSize = (0, react_1.useRef)(visibleReportActions.length);
    var lastAction = visibleReportActions.at(-1);
    var lastActionIndex = lastAction === null || lastAction === void 0 ? void 0 : lastAction.reportActionID;
    var previousLastIndex = (0, react_1.useRef)(lastActionIndex);
    var scrollingVerticalBottomOffset = (0, react_1.useRef)(0);
    var scrollingVerticalTopOffset = (0, react_1.useRef)(0);
    var wrapperViewRef = (0, react_1.useRef)(null);
    var readActionSkipped = (0, react_1.useRef)(false);
    var lastVisibleActionCreated = (0, ReportUtils_1.getReportLastVisibleActionCreated)(report, transactionThreadReport);
    var hasNewestReportAction = (lastAction === null || lastAction === void 0 ? void 0 : lastAction.created) === lastVisibleActionCreated;
    var hasNewestReportActionRef = (0, react_1.useRef)(hasNewestReportAction);
    var userActiveSince = (0, react_1.useRef)(DateUtils_1.default.getDBTime());
    var reportActionIDs = (0, react_1.useMemo)(function () {
        var _a;
        return (_a = reportActions === null || reportActions === void 0 ? void 0 : reportActions.map(function (action) { return action.reportActionID; })) !== null && _a !== void 0 ? _a : [];
    }, [reportActions]);
    var _q = (0, useLoadReportActions_1.default)({
        reportID: reportID,
        reportActions: reportActions,
        allReportActionIDs: reportActionIDs,
        transactionThreadReport: transactionThreadReport,
        hasOlderActions: hasOlderActions,
        hasNewerActions: hasNewerActions,
    }), loadOlderChats = _q.loadOlderChats, loadNewerChats = _q.loadNewerChats;
    var onStartReached = (0, react_1.useCallback)(function () {
        if (!(0, isSearchTopmostFullScreenRoute_1.default)()) {
            loadOlderChats(false);
            return;
        }
        react_native_1.InteractionManager.runAfterInteractions(function () { return requestAnimationFrame(function () { return loadOlderChats(false); }); });
    }, [loadOlderChats]);
    var onEndReached = (0, react_1.useCallback)(function () {
        loadNewerChats(false);
    }, [loadNewerChats]);
    var prevUnreadMarkerReportActionID = (0, react_1.useRef)(null);
    var visibleActionsMap = (0, react_1.useMemo)(function () {
        return visibleReportActions.reduce(function (actionsMap, reportAction) {
            var _a;
            Object.assign(actionsMap, (_a = {}, _a[reportAction.reportActionID] = reportAction, _a));
            return actionsMap;
        }, {});
    }, [visibleReportActions]);
    var prevVisibleActionsMap = (0, usePrevious_1.default)(visibleActionsMap);
    var reportLastReadTime = (_e = report.lastReadTime) !== null && _e !== void 0 ? _e : '';
    /**
     * The timestamp for the unread marker.
     *
     * This should ONLY be updated when the user
     * - switches reports
     * - marks a message as read/unread
     * - reads a new message as it is received
     */
    var _r = (0, react_1.useState)(reportLastReadTime), unreadMarkerTime = _r[0], setUnreadMarkerTime = _r[1];
    (0, react_1.useEffect)(function () {
        setUnreadMarkerTime(reportLastReadTime);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [report.reportID]);
    (0, react_1.useEffect)(function () {
        var unsubscribe = Visibility_1.default.onVisibilityChange(function () {
            setIsVisible(Visibility_1.default.isVisible());
        });
        return unsubscribe;
    }, []);
    (0, react_1.useEffect)(function () {
        var _a;
        if (!isFocused) {
            return;
        }
        if ((0, ReportUtils_1.isUnread)(report, transactionThreadReport, isReportArchived) || (lastAction && (0, ReportActionsUtils_1.isCurrentActionUnread)(report, lastAction, visibleReportActions))) {
            // On desktop, when the notification center is displayed, isVisible will return false.
            // Currently, there's no programmatic way to dismiss the notification center panel.
            // To handle this, we use the 'referrer' parameter to check if the current navigation is triggered from a notification.
            var isFromNotification = ((_a = route === null || route === void 0 ? void 0 : route.params) === null || _a === void 0 ? void 0 : _a.referrer) === CONST_1.default.REFERRER.NOTIFICATION;
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
    }, [report.lastVisibleActionCreated, transactionThreadReport === null || transactionThreadReport === void 0 ? void 0 : transactionThreadReport.lastVisibleActionCreated, report.reportID, isVisible]);
    (0, react_1.useEffect)(function () {
        var _a;
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
        var hasNewMessagesInView = scrollingVerticalBottomOffset.current < CONST_1.default.REPORT.ACTIONS.ACTION_VISIBLE_THRESHOLD;
        var hasUnreadReportAction = reportActions.some(function (reportAction) { return newMessageTimeReference && newMessageTimeReference < reportAction.created && reportAction.actorAccountID !== (0, Report_1.getCurrentUserAccountID)(); });
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
    var earliestReceivedOfflineMessageIndex = (0, react_1.useMemo)(function () {
        var lastIndex = reportActions.findLastIndex(function (action) {
            return (0, ReportActionsUtils_1.wasMessageReceivedWhileOffline)(action, isOffline, lastOfflineAt.current, lastOnlineAt.current, getLocalDateFromDatetime);
        });
        // The last index in the list is the earliest message that was received while offline
        return lastIndex > -1 ? lastIndex : undefined;
    }, [getLocalDateFromDatetime, isOffline, lastOfflineAt, lastOnlineAt, reportActions]);
    /**
     * The reportActionID the unread marker should display above
     */
    var _s = (0, react_1.useMemo)(function () {
        // If there are message that were received while offline,
        // we can skip checking all messages later than the earliest received offline message.
        var startIndex = visibleReportActions.length - 1;
        var endIndex = earliestReceivedOfflineMessageIndex !== null && earliestReceivedOfflineMessageIndex !== void 0 ? earliestReceivedOfflineMessageIndex : 0;
        // Scan through each visible report action until we find the appropriate action to show the unread marker
        for (var index = startIndex; index >= endIndex; index--) {
            var reportAction = visibleReportActions.at(index);
            var nextAction = index > 0 ? visibleReportActions.at(index - 1) : undefined;
            var isEarliestReceivedOfflineMessage = index === earliestReceivedOfflineMessageIndex;
            var shouldDisplayNewMarker = reportAction &&
                (0, shouldDisplayNewMarkerOnReportAction_1.default)({
                    message: reportAction,
                    nextMessage: nextAction,
                    isEarliestReceivedOfflineMessage: isEarliestReceivedOfflineMessage,
                    accountID: currentUserAccountID,
                    prevSortedVisibleReportActionsObjects: prevVisibleActionsMap,
                    unreadMarkerTime: unreadMarkerTime,
                    scrollingVerticalOffset: scrollingVerticalBottomOffset.current,
                    prevUnreadMarkerReportActionID: prevUnreadMarkerReportActionID.current,
                });
            // eslint-disable-next-line react-compiler/react-compiler
            if (shouldDisplayNewMarker) {
                return [reportAction.reportActionID, index];
            }
        }
        return [null, -1];
    }, [currentUserAccountID, earliestReceivedOfflineMessageIndex, prevVisibleActionsMap, visibleReportActions, unreadMarkerTime]), unreadMarkerReportActionID = _s[0], unreadMarkerReportActionIndex = _s[1];
    prevUnreadMarkerReportActionID.current = unreadMarkerReportActionID;
    var _t = (0, useReportUnreadMessageScrollTracking_1.default)({
        reportID: report.reportID,
        currentVerticalScrollingOffsetRef: scrollingVerticalBottomOffset,
        readActionSkippedRef: readActionSkipped,
        unreadMarkerReportActionIndex: unreadMarkerReportActionIndex,
        isInverted: false,
        onTrackScrolling: function (event) {
            var _a = event.nativeEvent, layoutMeasurement = _a.layoutMeasurement, contentSize = _a.contentSize, contentOffset = _a.contentOffset;
            var fullContentHeight = contentSize.height;
            /**
             * Count the diff between current scroll position and the bottom of the list.
             * Diff == (height of all items in the list) - (height of the layout with the list) - (how far user scrolled)
             */
            scrollingVerticalBottomOffset.current = fullContentHeight - layoutMeasurement.height - contentOffset.y;
            // We additionally track the top offset to be able to scroll to the new transaction when it's added
            scrollingVerticalTopOffset.current = contentOffset.y;
        },
    }), isFloatingMessageCounterVisible = _t.isFloatingMessageCounterVisible, setIsFloatingMessageCounterVisible = _t.setIsFloatingMessageCounterVisible, trackVerticalScrolling = _t.trackVerticalScrolling, onViewableItemsChanged = _t.onViewableItemsChanged;
    (0, react_1.useEffect)(function () {
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
    }, [lastAction === null || lastAction === void 0 ? void 0 : lastAction.created, unreadMarkerReportActionID, unreadMarkerTime]);
    var scrollToBottomForCurrentUserAction = (0, react_1.useCallback)(function (isFromCurrentUser, reportAction) {
        react_native_1.InteractionManager.runAfterInteractions(function () {
            setIsFloatingMessageCounterVisible(false);
            // If a new comment is added from the current user, scroll to the bottom, otherwise leave the user position unchanged
            if (!isFromCurrentUser || (reportAction === null || reportAction === void 0 ? void 0 : reportAction.actionName) !== CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT) {
                return;
            }
            // We want to scroll to the end of the list where the newest message is
            // however scrollToEnd will not work correctly with items of variable sizes without `getItemLayout` - so we need to delay the scroll until every item rendered
            setTimeout(function () {
                reportScrollManager.scrollToEnd();
            }, DELAY_FOR_SCROLLING_TO_END);
        });
    }, [reportScrollManager, setIsFloatingMessageCounterVisible]);
    (0, react_1.useEffect)(function () {
        // This callback is triggered when a new action arrives via Pusher and the event is emitted from Report.ts. This allows us to maintain
        // a single source of truth for the "new action" event instead of trying to derive that a new action has appeared from looking at props.
        var unsubscribe = (0, Report_1.subscribeToNewActionEvent)(report.reportID, scrollToBottomForCurrentUserAction);
        return function () {
            if (!unsubscribe) {
                return;
            }
            unsubscribe();
        };
        // This effect handles subscribing to events, so we only want to run it on mount, and in case reportID changes
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [report.reportID]);
    var renderItem = (0, react_1.useCallback)(function (_a) {
        var reportAction = _a.item, index = _a.index;
        var displayAsGroup = !(0, ReportActionsUtils_1.isConsecutiveChronosAutomaticTimerAction)(visibleReportActions, index, (0, ReportUtils_1.chatIncludesChronosWithID)(reportAction === null || reportAction === void 0 ? void 0 : reportAction.reportID)) &&
            (0, ReportActionsUtils_1.hasNextActionMadeBySameActor)(visibleReportActions, index);
        var actionEmojiReactions = emojiReactions === null || emojiReactions === void 0 ? void 0 : emojiReactions["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_REACTIONS).concat(reportAction.reportActionID)];
        var originalReportID = (0, ReportUtils_1.getOriginalReportID)(report.reportID, reportAction);
        var reportDraftMessages = draftMessage === null || draftMessage === void 0 ? void 0 : draftMessage["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_DRAFTS).concat(originalReportID)];
        var matchingDraftMessage = reportDraftMessages === null || reportDraftMessages === void 0 ? void 0 : reportDraftMessages[reportAction.reportActionID];
        var matchingDraftMessageString = typeof matchingDraftMessage === 'string' ? matchingDraftMessage : matchingDraftMessage === null || matchingDraftMessage === void 0 ? void 0 : matchingDraftMessage.message;
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
    var scrollToBottomAndMarkReportAsRead = (0, react_1.useCallback)(function () {
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
    var scrollToNewTransaction = (0, react_1.useCallback)(function (pageY) {
        var _a;
        (_a = wrapperViewRef.current) === null || _a === void 0 ? void 0 : _a.measureInWindow(function (x, y, w, height) {
            // If the new transaction is already visible, we don't need to scroll to it
            if (pageY > 0 && pageY < height) {
                return;
            }
            reportScrollManager.scrollToOffset(scrollingVerticalTopOffset.current + pageY - variables_1.default.scrollToNewTransactionOffset);
        });
    }, [reportScrollManager]);
    var reportHasComments = visibleReportActions.length > 0;
    /**
     * Runs when the FlatList finishes laying out
     */
    var recordTimeToMeasureItemLayout = (0, react_1.useCallback)(function () {
        if (didLayout.current) {
            return;
        }
        didLayout.current = true;
        (0, markOpenReportEnd_1.default)();
    }, []);
    var isSelectAllChecked = selectedTransactionIDs.length > 0 && selectedTransactionIDs.length === transactionsWithoutPendingDelete.length;
    // Wrapped into useCallback to stabilize children re-renders
    var keyExtractor = (0, react_1.useCallback)(function (item) { return item.reportActionID; }, []);
    return (<react_native_1.View style={[styles.flex1]} ref={wrapperViewRef}>
            {shouldUseNarrowLayout && isMobileSelectionModeEnabled && (<>
                    <ButtonWithDropdownMenu_1.default onPress={function () { return null; }} options={selectedTransactionsOptions} customText={translate('workspace.common.selected', { count: selectedTransactionIDs.length })} isSplitButton={false} shouldAlwaysShowDropdownMenu wrapperStyle={[styles.w100, styles.ph5]}/>
                    <react_native_1.View style={[styles.alignItemsCenter, styles.userSelectNone, styles.flexRow, styles.pt6, styles.ph8, styles.pb3]}>
                        <Checkbox_1.default accessibilityLabel={translate('workspace.people.selectAll')} isChecked={isSelectAllChecked} isIndeterminate={selectedTransactionIDs.length > 0 && selectedTransactionIDs.length !== transactionsWithoutPendingDelete.length} onPress={function () {
                if (selectedTransactionIDs.length !== 0) {
                    clearSelectedTransactions(true);
                }
                else {
                    setSelectedTransactions(transactionsWithoutPendingDelete.map(function (t) { return t.transactionID; }));
                }
            }}/>
                        <Pressable_1.PressableWithFeedback style={[styles.userSelectNone, styles.alignItemsCenter]} onPress={function () {
                if (isSelectAllChecked) {
                    clearSelectedTransactions(true);
                }
                else {
                    setSelectedTransactions(transactionsWithoutPendingDelete.map(function (t) { return t.transactionID; }));
                }
            }} accessibilityLabel={translate('workspace.people.selectAll')} role="button" accessibilityState={{ checked: isSelectAllChecked }} dataSet={_b = {}, _b[CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT] = true, _b}>
                            <Text_1.default style={[styles.textStrong, styles.ph3]}>{translate('workspace.people.selectAll')}</Text_1.default>
                        </Pressable_1.PressableWithFeedback>
                    </react_native_1.View>
                    <ConfirmModal_1.default title={translate('iou.deleteExpense', { count: selectedTransactionIDs.length })} isVisible={isDeleteModalVisible} onConfirm={function () {
                var _a;
                var shouldNavigateBack = transactions.filter(function (trans) { return trans.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE; }).length === selectedTransactionIDs.length;
                handleDeleteTransactions();
                if (shouldNavigateBack) {
                    Navigation_1.default.goBack((_a = route.params) === null || _a === void 0 ? void 0 : _a.backTo);
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
            <DecisionModal_1.default title={translate('common.downloadFailedTitle')} prompt={translate('common.downloadFailedDescription')} isSmallScreenWidth={shouldUseNarrowLayout} onSecondOptionSubmit={function () { return setIsDownloadErrorModalVisible(false); }} secondOptionText={translate('common.buttonConfirm')} isVisible={isDownloadErrorModalVisible} onClose={function () { return setIsDownloadErrorModalVisible(false); }}/>
            <ConfirmModal_1.default onConfirm={function () {
            setIsExportWithTemplateModalVisible(false);
            clearSelectedTransactions(undefined, true);
        }} onCancel={function () { return setIsExportWithTemplateModalVisible(false); }} isVisible={isExportWithTemplateModalVisible} title={translate('export.exportInProgress')} prompt={translate('export.conciergeWillSend')} confirmText={translate('common.buttonConfirm')} shouldShowCancelButton={false}/>
        </react_native_1.View>);
}
MoneyRequestReportActionsList.displayName = 'MoneyRequestReportActionsList';
exports.default = MoneyRequestReportActionsList;
