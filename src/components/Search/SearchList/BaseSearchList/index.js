"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var flash_list_1 = require("@shopify/flash-list");
var react_1 = require("react");
var react_native_reanimated_1 = require("react-native-reanimated");
var useArrowKeyFocusManager_1 = require("@hooks/useArrowKeyFocusManager");
var useKeyboardShortcut_1 = require("@hooks/useKeyboardShortcut");
var Browser_1 = require("@libs/Browser");
var KeyDownPressListener_1 = require("@libs/KeyboardShortcut/KeyDownPressListener");
var CONST_1 = require("@src/CONST");
var AnimatedFlashListComponent = react_native_reanimated_1.default.createAnimatedComponent((flash_list_1.FlashList));
function BaseSearchList(_a) {
    var data = _a.data, columns = _a.columns, renderItem = _a.renderItem, onSelectRow = _a.onSelectRow, keyExtractor = _a.keyExtractor, onScroll = _a.onScroll, ref = _a.ref, isFocused = _a.isFocused, scrollToIndex = _a.scrollToIndex, onEndReached = _a.onEndReached, onEndReachedThreshold = _a.onEndReachedThreshold, ListFooterComponent = _a.ListFooterComponent, onViewableItemsChanged = _a.onViewableItemsChanged, onLayout = _a.onLayout, estimatedItemSize = _a.estimatedItemSize, overrideItemLayout = _a.overrideItemLayout, estimatedListSize = _a.estimatedListSize, contentContainerStyle = _a.contentContainerStyle, calculatedListHeight = _a.calculatedListHeight, flattenedItemsLength = _a.flattenedItemsLength;
    var hasKeyBeenPressed = (0, react_1.useRef)(false);
    var setHasKeyBeenPressed = (0, react_1.useCallback)(function () {
        if (hasKeyBeenPressed.current) {
            return;
        }
        // We need to track whether a key has been pressed to enable focus syncing only if a key has been pressed.
        // This is to avoid the default behavior of web showing blue border on click of items after a page refresh.
        hasKeyBeenPressed.current = true;
    }, []);
    var _b = (0, useArrowKeyFocusManager_1.default)(__assign(__assign({ initialFocusedIndex: -1, maxIndex: flattenedItemsLength - 1, isActive: isFocused, onFocusedIndexChange: function (index) {
            scrollToIndex === null || scrollToIndex === void 0 ? void 0 : scrollToIndex(index);
        } }, (!hasKeyBeenPressed.current && { setHasKeyBeenPressed: setHasKeyBeenPressed })), { isFocused: isFocused })), focusedIndex = _b[0], setFocusedIndex = _b[1];
    var renderItemWithKeyboardFocus = (0, react_1.useCallback)(function (_a) {
        var item = _a.item, index = _a.index;
        var isItemFocused = focusedIndex === index;
        var onFocus = function (event) {
            // Prevent unexpected scrolling on mobile Chrome after the context menu closes by ignoring programmatic focus not triggered by direct user interaction.
            if ((0, Browser_1.isMobileChrome)() && event.nativeEvent) {
                if (!event.nativeEvent.sourceCapabilities) {
                    return;
                }
                // Ignore the focus if it's caused by a touch event on mobile chrome.
                // For example, a long press will trigger a focus event on mobile chrome
                if (event.nativeEvent.sourceCapabilities.firesTouchEvents) {
                    return;
                }
            }
            setFocusedIndex(index);
        };
        return renderItem(item, index, isItemFocused, onFocus);
    }, [focusedIndex, renderItem, setFocusedIndex]);
    var selectFocusedOption = (0, react_1.useCallback)(function () {
        var focusedItem = data.at(focusedIndex);
        if (!focusedItem) {
            return;
        }
        onSelectRow(focusedItem);
    }, [data, focusedIndex, onSelectRow]);
    (0, useKeyboardShortcut_1.default)(CONST_1.default.KEYBOARD_SHORTCUTS.ENTER, selectFocusedOption, {
        captureOnInputs: true,
        shouldBubble: false,
        shouldPreventDefault: false,
        isActive: isFocused && focusedIndex >= 0,
        shouldStopPropagation: true,
    });
    (0, react_1.useEffect)(function () {
        (0, KeyDownPressListener_1.addKeyDownPressListener)(setHasKeyBeenPressed);
        return function () { return (0, KeyDownPressListener_1.removeKeyDownPressListener)(setHasKeyBeenPressed); };
    }, [setHasKeyBeenPressed]);
    var extraData = (0, react_1.useMemo)(function () { return [focusedIndex, isFocused, columns]; }, [focusedIndex, isFocused, columns]);
    return (<AnimatedFlashListComponent data={data} renderItem={renderItemWithKeyboardFocus} keyExtractor={keyExtractor} onScroll={onScroll} showsVerticalScrollIndicator={false} ref={ref} extraData={extraData} onEndReached={onEndReached} onEndReachedThreshold={onEndReachedThreshold} ListFooterComponent={ListFooterComponent} onViewableItemsChanged={onViewableItemsChanged} onLayout={onLayout} removeClippedSubviews drawDistance={1000} estimatedItemSize={estimatedItemSize} overrideItemLayout={overrideItemLayout} estimatedListSize={estimatedListSize} contentContainerStyle={contentContainerStyle} overrideProps={{ estimatedHeightSize: calculatedListHeight }}/>);
}
BaseSearchList.displayName = 'BaseSearchList';
exports.default = BaseSearchList;
