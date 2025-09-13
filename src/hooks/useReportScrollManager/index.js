"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ReportScreenContext_1 = require("@pages/home/ReportScreenContext");
function useReportScrollManager() {
    const { flatListRef } = (0, react_1.useContext)(ReportScreenContext_1.ActionListContext);
    /**
     * Scroll to the provided index. On non-native implementations we do not want to scroll when we are scrolling because
     */
    const scrollToIndex = (0, react_1.useCallback)((index, isEditing) => {
        if (!flatListRef?.current || isEditing) {
            return;
        }
        flatListRef.current.scrollToIndex({ index, animated: true });
    }, [flatListRef]);
    /**
     * Scroll to the bottom of the inverted FlatList.
     * When FlatList is inverted it's "bottom" is really it's top
     */
    const scrollToBottom = (0, react_1.useCallback)(() => {
        if (!flatListRef?.current) {
            return;
        }
        flatListRef.current.scrollToOffset({ animated: false, offset: 0 });
    }, [flatListRef]);
    /**
     * Scroll to the end of the FlatList.
     */
    const scrollToEnd = (0, react_1.useCallback)(() => {
        if (!flatListRef?.current) {
            return;
        }
        flatListRef.current.scrollToEnd({ animated: false });
    }, [flatListRef]);
    const scrollToOffset = (0, react_1.useCallback)((offset) => {
        if (!flatListRef?.current) {
            return;
        }
        flatListRef.current.scrollToOffset({ animated: true, offset });
    }, [flatListRef]);
    return { ref: flatListRef, scrollToIndex, scrollToBottom, scrollToEnd, scrollToOffset };
}
exports.default = useReportScrollManager;
