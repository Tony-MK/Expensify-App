"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ReportScreenContext_1 = require("@pages/home/ReportScreenContext");
function useReportScrollManager() {
    const { flatListRef, setScrollPosition } = (0, react_1.useContext)(ReportScreenContext_1.ActionListContext);
    /**
     * Scroll to the provided index.
     */
    const scrollToIndex = (0, react_1.useCallback)((index) => {
        if (!flatListRef?.current) {
            return;
        }
        flatListRef.current.scrollToIndex({ index });
    }, [flatListRef]);
    /**
     * Scroll to the bottom of the inverted FlatList.
     * When FlatList is inverted it's "bottom" is really it's top
     */
    const scrollToBottom = (0, react_1.useCallback)(() => {
        if (!flatListRef?.current) {
            return;
        }
        setScrollPosition({ offset: 0 });
        flatListRef.current?.scrollToOffset({ animated: false, offset: 0 });
    }, [flatListRef, setScrollPosition]);
    /**
     * Scroll to the end of the FlatList.
     */
    const scrollToEnd = (0, react_1.useCallback)(() => {
        if (!flatListRef?.current) {
            return;
        }
        const scrollViewRef = flatListRef.current.getNativeScrollRef();
        // Try to scroll on underlying scrollView if available, fallback to usual listRef
        if (scrollViewRef && 'scrollToEnd' in scrollViewRef) {
            scrollViewRef.scrollToEnd({ animated: false });
            return;
        }
        flatListRef.current.scrollToEnd({ animated: false });
    }, [flatListRef]);
    const scrollToOffset = (0, react_1.useCallback)((offset) => {
        if (!flatListRef?.current) {
            return;
        }
        flatListRef.current.scrollToOffset({ offset, animated: false });
    }, [flatListRef]);
    return { ref: flatListRef, scrollToIndex, scrollToBottom, scrollToEnd, scrollToOffset };
}
exports.default = useReportScrollManager;
