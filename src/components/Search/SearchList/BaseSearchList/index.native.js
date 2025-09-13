"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flash_list_1 = require("@shopify/flash-list");
const react_1 = require("react");
const react_native_reanimated_1 = require("react-native-reanimated");
const AnimatedFlashListComponent = react_native_reanimated_1.default.createAnimatedComponent((flash_list_1.FlashList));
function BaseSearchList({ data, renderItem, keyExtractor, onScroll, ref, onEndReached, onEndReachedThreshold, ListFooterComponent, onViewableItemsChanged, onLayout, estimatedItemSize, overrideItemLayout, estimatedListSize, contentContainerStyle, calculatedListHeight, }) {
    const renderItemWithoutKeyboardFocus = (0, react_1.useCallback)(({ item, index }) => {
        return renderItem(item, index, false, undefined);
    }, [renderItem]);
    return (<AnimatedFlashListComponent data={data} renderItem={renderItemWithoutKeyboardFocus} keyExtractor={keyExtractor} onScroll={onScroll} showsVerticalScrollIndicator={false} ref={ref} onEndReached={onEndReached} onEndReachedThreshold={onEndReachedThreshold} ListFooterComponent={ListFooterComponent} onViewableItemsChanged={onViewableItemsChanged} onLayout={onLayout} removeClippedSubviews drawDistance={1000} estimatedItemSize={estimatedItemSize} overrideItemLayout={overrideItemLayout} estimatedListSize={estimatedListSize} contentContainerStyle={contentContainerStyle} overrideProps={{ estimatedHeightSize: calculatedListHeight }}/>);
}
BaseSearchList.displayName = 'BaseSearchList';
exports.default = BaseSearchList;
