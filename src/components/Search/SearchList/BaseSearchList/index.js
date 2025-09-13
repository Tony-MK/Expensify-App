"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flash_list_1 = require("@shopify/flash-list");
const react_1 = require("react");
const react_native_reanimated_1 = require("react-native-reanimated");
const useArrowKeyFocusManager_1 = require("@hooks/useArrowKeyFocusManager");
const useKeyboardShortcut_1 = require("@hooks/useKeyboardShortcut");
const Browser_1 = require("@libs/Browser");
const KeyDownPressListener_1 = require("@libs/KeyboardShortcut/KeyDownPressListener");
const CONST_1 = require("@src/CONST");
const AnimatedFlashListComponent = react_native_reanimated_1.default.createAnimatedComponent((flash_list_1.FlashList));
function BaseSearchList({ data, columns, renderItem, onSelectRow, keyExtractor, onScroll, ref, isFocused, scrollToIndex, onEndReached, onEndReachedThreshold, ListFooterComponent, onViewableItemsChanged, onLayout, estimatedItemSize, overrideItemLayout, estimatedListSize, contentContainerStyle, calculatedListHeight, flattenedItemsLength, }) {
    const hasKeyBeenPressed = (0, react_1.useRef)(false);
    const setHasKeyBeenPressed = (0, react_1.useCallback)(() => {
        if (hasKeyBeenPressed.current) {
            return;
        }
        // We need to track whether a key has been pressed to enable focus syncing only if a key has been pressed.
        // This is to avoid the default behavior of web showing blue border on click of items after a page refresh.
        hasKeyBeenPressed.current = true;
    }, []);
    const [focusedIndex, setFocusedIndex] = (0, useArrowKeyFocusManager_1.default)({
        initialFocusedIndex: -1,
        maxIndex: flattenedItemsLength - 1,
        isActive: isFocused,
        onFocusedIndexChange: (index) => {
            scrollToIndex?.(index);
        },
        // eslint-disable-next-line react-compiler/react-compiler
        ...(!hasKeyBeenPressed.current && { setHasKeyBeenPressed }),
        isFocused,
    });
    const renderItemWithKeyboardFocus = (0, react_1.useCallback)(({ item, index }) => {
        const isItemFocused = focusedIndex === index;
        const onFocus = (event) => {
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
    const selectFocusedOption = (0, react_1.useCallback)(() => {
        const focusedItem = data.at(focusedIndex);
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
    (0, react_1.useEffect)(() => {
        (0, KeyDownPressListener_1.addKeyDownPressListener)(setHasKeyBeenPressed);
        return () => (0, KeyDownPressListener_1.removeKeyDownPressListener)(setHasKeyBeenPressed);
    }, [setHasKeyBeenPressed]);
    const extraData = (0, react_1.useMemo)(() => [focusedIndex, isFocused, columns], [focusedIndex, isFocused, columns]);
    return (<AnimatedFlashListComponent data={data} renderItem={renderItemWithKeyboardFocus} keyExtractor={keyExtractor} onScroll={onScroll} showsVerticalScrollIndicator={false} ref={ref} extraData={extraData} onEndReached={onEndReached} onEndReachedThreshold={onEndReachedThreshold} ListFooterComponent={ListFooterComponent} onViewableItemsChanged={onViewableItemsChanged} onLayout={onLayout} removeClippedSubviews drawDistance={1000} estimatedItemSize={estimatedItemSize} overrideItemLayout={overrideItemLayout} estimatedListSize={estimatedListSize} contentContainerStyle={contentContainerStyle} overrideProps={{ estimatedHeightSize: calculatedListHeight }}/>);
}
BaseSearchList.displayName = 'BaseSearchList';
exports.default = BaseSearchList;
