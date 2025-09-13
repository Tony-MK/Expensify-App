"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flash_list_1 = require("@shopify/flash-list");
const react_1 = require("react");
const react_native_1 = require("react-native");
const CategoryShortcutBar_1 = require("@components/EmojiPicker/CategoryShortcutBar");
const EmojiSkinToneList_1 = require("@components/EmojiPicker/EmojiSkinToneList");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const CONST_1 = require("@src/CONST");
/**
 * Improves FlashList's recycling when there are different types of items
 */
const getItemType = (item) => {
    // item is undefined only when list is empty
    if (!item) {
        return;
    }
    if ('name' in item && item.name) {
        return CONST_1.default.EMOJI_PICKER_ITEM_TYPES.EMOJI;
    }
    if ('header' in item && item.header) {
        return CONST_1.default.EMOJI_PICKER_ITEM_TYPES.HEADER;
    }
    return CONST_1.default.EMOJI_PICKER_ITEM_TYPES.SPACER;
};
/**
 * Return a unique key for each emoji item
 *
 */
const keyExtractor = (item, index) => `emoji_picker_${item.code}_${index}`;
/**
 * Renders the list empty component
 */
function ListEmptyComponent() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return <Text_1.default style={[styles.textLabel, styles.colorMuted]}>{translate('common.noResultsFound')}</Text_1.default>;
}
function BaseEmojiPickerMenu({ headerEmojis, scrollToHeader, isFiltered, listWrapperStyle = [], data, renderItem, stickyHeaderIndices = [], extraData = [], alwaysBounceVertical = false }, ref) {
    const styles = (0, useThemeStyles_1.default)();
    const { windowWidth } = (0, useWindowDimensions_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    // Estimated list size should be a whole integer to avoid floating point precision errors
    // More info: https://github.com/Expensify/App/issues/34522
    const listWidth = shouldUseNarrowLayout ? Math.floor(windowWidth) : CONST_1.default.EMOJI_PICKER_SIZE.WIDTH;
    const flattenListWrapperStyle = (0, react_1.useMemo)(() => react_native_1.StyleSheet.flatten(listWrapperStyle), [listWrapperStyle]);
    return (<>
            {!isFiltered && (<CategoryShortcutBar_1.default headerEmojis={headerEmojis} onPress={scrollToHeader}/>)}
            <react_native_1.View style={listWrapperStyle}>
                <flash_list_1.FlashList ref={ref} keyboardShouldPersistTaps="handled" data={data} drawDistance={CONST_1.default.EMOJI_DRAW_AMOUNT} renderItem={renderItem} keyExtractor={keyExtractor} numColumns={CONST_1.default.EMOJI_NUM_PER_ROW} stickyHeaderIndices={stickyHeaderIndices} ListEmptyComponent={ListEmptyComponent} alwaysBounceVertical={alwaysBounceVertical} estimatedItemSize={CONST_1.default.EMOJI_PICKER_ITEM_HEIGHT} estimatedListSize={{ height: flattenListWrapperStyle.height, width: listWidth }} contentContainerStyle={styles.ph4} extraData={extraData} getItemType={getItemType} overrideProps={{
            // scrollPaddingTop set to consider sticky header while scrolling, https://github.com/Expensify/App/issues/36883
            style: {
                minHeight: 1,
                minWidth: 1,
                scrollPaddingTop: isFiltered ? 0 : CONST_1.default.EMOJI_PICKER_ITEM_HEIGHT,
            },
        }} scrollEnabled={data.length > 0}/>
            </react_native_1.View>
            <EmojiSkinToneList_1.default />
        </>);
}
BaseEmojiPickerMenu.displayName = 'BaseEmojiPickerMenu';
exports.default = react_1.default.forwardRef(BaseEmojiPickerMenu);
