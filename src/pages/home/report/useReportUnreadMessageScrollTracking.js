"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useReportUnreadMessageScrollTracking;
var native_1 = require("@react-navigation/native");
var react_1 = require("react");
var Report_1 = require("@userActions/Report");
var CONST_1 = require("@src/CONST");
function useReportUnreadMessageScrollTracking(_a) {
    var reportID = _a.reportID, currentVerticalScrollingOffsetRef = _a.currentVerticalScrollingOffsetRef, readActionSkippedRef = _a.readActionSkippedRef, onTrackScrolling = _a.onTrackScrolling, unreadMarkerReportActionIndex = _a.unreadMarkerReportActionIndex, isInverted = _a.isInverted;
    var _b = (0, react_1.useState)(false), isFloatingMessageCounterVisible = _b[0], setIsFloatingMessageCounterVisible = _b[1];
    var isFocused = (0, native_1.useIsFocused)();
    var ref = (0, react_1.useRef)({
        reportID: reportID,
        unreadMarkerReportActionIndex: unreadMarkerReportActionIndex,
        previousViewableItems: [],
        isFocused: true,
    });
    // We want to save the updated value on ref to use it in onViewableItemsChanged
    // because FlatList requires the callback to be stable and we cannot add a dependency on the useCallback.
    (0, react_1.useEffect)(function () {
        ref.current.reportID = reportID;
        ref.current.previousViewableItems = [];
    }, [reportID]);
    (0, react_1.useEffect)(function () {
        ref.current.isFocused = isFocused;
    }, [isFocused]);
    /**
     * On every scroll event we want to:
     * Show/hide the latest message pill when user is scrolling back/forth in the history of messages.
     * Call any other callback that the component might need
     */
    var trackVerticalScrolling = function (event) {
        if (event) {
            onTrackScrolling(event);
        }
        var hasUnreadMarkerReportAction = unreadMarkerReportActionIndex !== -1;
        // display floating button if we're scrolled more than the offset
        if (currentVerticalScrollingOffsetRef.current > CONST_1.default.REPORT.ACTIONS.LATEST_MESSAGES_PILL_SCROLL_OFFSET_THRESHOLD &&
            !isFloatingMessageCounterVisible &&
            !hasUnreadMarkerReportAction) {
            setIsFloatingMessageCounterVisible(true);
        }
        // hide floating button if we're scrolled closer than the offset
        if (currentVerticalScrollingOffsetRef.current < CONST_1.default.REPORT.ACTIONS.LATEST_MESSAGES_PILL_SCROLL_OFFSET_THRESHOLD &&
            isFloatingMessageCounterVisible &&
            !hasUnreadMarkerReportAction) {
            setIsFloatingMessageCounterVisible(false);
        }
    };
    var onViewableItemsChanged = (0, react_1.useCallback)(function (_a) {
        var viewableItems = _a.viewableItems;
        if (!ref.current.isFocused) {
            return;
        }
        ref.current.previousViewableItems = viewableItems;
        var viewableIndexes = viewableItems.map(function (viewableItem) { return viewableItem.index; }).filter(function (value) { return typeof value === 'number'; });
        var maxIndex = Math.max.apply(Math, viewableIndexes);
        var minIndex = Math.min.apply(Math, viewableIndexes);
        var unreadActionIndex = ref.current.unreadMarkerReportActionIndex;
        var hasUnreadMarkerReportAction = unreadActionIndex !== -1;
        var unreadActionVisible = isInverted ? unreadActionIndex >= minIndex : unreadActionIndex <= maxIndex;
        // display floating button if the unread report action is out of view
        if (!unreadActionVisible && hasUnreadMarkerReportAction) {
            setIsFloatingMessageCounterVisible(true);
        }
        // hide floating button if the unread report action becomes visible
        if (unreadActionVisible && hasUnreadMarkerReportAction) {
            setIsFloatingMessageCounterVisible(false);
        }
        // if we're scrolled closer than the offset and read action has been skipped then mark message as read
        if (unreadActionVisible && readActionSkippedRef.current) {
            // eslint-disable-next-line react-compiler/react-compiler,no-param-reassign
            readActionSkippedRef.current = false;
            (0, Report_1.readNewestAction)(ref.current.reportID);
        }
        // FlatList requires a stable onViewableItemsChanged callback for optimal performance.
        // Therefore, we use a ref to store values instead of adding them as dependencies.
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // When unreadMarkerReportActionIndex changes we will manually call onViewableItemsChanged with previousViewableItems to recalculate
    // the state of floating button because onViewableItemsChanged on  FlatList will only be called when viewable items change.
    (0, react_1.useEffect)(function () {
        ref.current.unreadMarkerReportActionIndex = unreadMarkerReportActionIndex;
        if (ref.current.previousViewableItems.length) {
            onViewableItemsChanged({ viewableItems: ref.current.previousViewableItems, changed: [] });
        }
    }, [onViewableItemsChanged, unreadMarkerReportActionIndex]);
    return {
        isFloatingMessageCounterVisible: isFloatingMessageCounterVisible,
        setIsFloatingMessageCounterVisible: setIsFloatingMessageCounterVisible,
        trackVerticalScrolling: trackVerticalScrolling,
        onViewableItemsChanged: onViewableItemsChanged,
    };
}
