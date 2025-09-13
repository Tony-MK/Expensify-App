"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var flash_list_1 = require("@shopify/flash-list");
var react_1 = require("react");
var react_native_reanimated_1 = require("react-native-reanimated");
var AnimatedFlashListComponent = react_native_reanimated_1.default.createAnimatedComponent((flash_list_1.FlashList));
function BaseSearchList(_a) {
    var data = _a.data, renderItem = _a.renderItem, keyExtractor = _a.keyExtractor, onScroll = _a.onScroll, ref = _a.ref, onEndReached = _a.onEndReached, onEndReachedThreshold = _a.onEndReachedThreshold, ListFooterComponent = _a.ListFooterComponent, onViewableItemsChanged = _a.onViewableItemsChanged, onLayout = _a.onLayout, estimatedItemSize = _a.estimatedItemSize, overrideItemLayout = _a.overrideItemLayout, estimatedListSize = _a.estimatedListSize, contentContainerStyle = _a.contentContainerStyle, calculatedListHeight = _a.calculatedListHeight;
    var renderItemWithoutKeyboardFocus = (0, react_1.useCallback)(function (_a) {
        var item = _a.item, index = _a.index;
        return renderItem(item, index, false, undefined);
    }, [renderItem]);
    return (<AnimatedFlashListComponent data={data} renderItem={renderItemWithoutKeyboardFocus} keyExtractor={keyExtractor} onScroll={onScroll} showsVerticalScrollIndicator={false} ref={ref} onEndReached={onEndReached} onEndReachedThreshold={onEndReachedThreshold} ListFooterComponent={ListFooterComponent} onViewableItemsChanged={onViewableItemsChanged} onLayout={onLayout} removeClippedSubviews drawDistance={1000} estimatedItemSize={estimatedItemSize} overrideItemLayout={overrideItemLayout} estimatedListSize={estimatedListSize} contentContainerStyle={contentContainerStyle} overrideProps={{ estimatedHeightSize: calculatedListHeight }}/>);
}
BaseSearchList.displayName = 'BaseSearchList';
exports.default = BaseSearchList;
