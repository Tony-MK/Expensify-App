"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSearchQueryItem = isSearchQueryItem;
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const BaseListItem_1 = require("@components/SelectionList/BaseListItem");
const TextWithTooltip_1 = require("@components/TextWithTooltip");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function isSearchQueryItem(item) {
    return 'searchItemType' in item;
}
function SearchQueryListItem({ item, isFocused, showTooltip, onSelectRow, onFocus, shouldSyncFocus }) {
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    return (<BaseListItem_1.default item={item} pressableStyle={[[styles.searchQueryListItemStyle, item.isSelected && styles.activeComponentBG, item.cursorStyle]]} wrapperStyle={[styles.flexRow, styles.flex1, styles.justifyContentBetween, styles.userSelectNone, styles.alignItemsCenter]} isFocused={isFocused} onSelectRow={onSelectRow} keyForList={item.keyForList} onFocus={onFocus} hoverStyle={item.isSelected && styles.activeComponentBG} shouldSyncFocus={shouldSyncFocus} showTooltip={showTooltip}>
            <>
                {!!item.singleIcon && (<Icon_1.default src={item.singleIcon} fill={theme.icon} additionalStyles={styles.mr3} medium/>)}
                <react_native_1.View style={[styles.flex1, styles.flexColumn, styles.justifyContentCenter, styles.alignItemsStretch]}>
                    <TextWithTooltip_1.default shouldShowTooltip={showTooltip ?? false} text={item.text ?? ''} style={[
            styles.optionDisplayName,
            isFocused ? styles.sidebarLinkActiveText : styles.sidebarLinkText,
            styles.sidebarLinkTextBold,
            styles.pre,
            item.alternateText ? styles.mb1 : null,
            styles.justifyContentCenter,
        ]}/>
                    {!!item.alternateText && (<TextWithTooltip_1.default shouldShowTooltip={showTooltip ?? false} text={item.alternateText} style={[styles.textLabelSupporting, styles.lh16, styles.pre]}/>)}
                </react_native_1.View>
            </>
        </BaseListItem_1.default>);
}
SearchQueryListItem.displayName = 'SearchQueryListItem';
exports.default = SearchQueryListItem;
