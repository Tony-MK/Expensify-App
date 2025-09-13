"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const BaseListItem_1 = require("@components/SelectionList/BaseListItem");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function SpendCategorySelectorListItem({ item, onSelectRow, isFocused }) {
    const styles = (0, useThemeStyles_1.default)();
    const { groupID, categoryID } = item;
    if (!groupID) {
        return;
    }
    return (<BaseListItem_1.default item={item} pressableStyle={[styles.mt2]} onSelectRow={onSelectRow} isFocused={isFocused} showTooltip keyForList={item.keyForList} pendingAction={item.pendingAction}>
            <MenuItemWithTopDescription_1.default shouldShowRightIcon title={categoryID} description={groupID[0].toUpperCase() + groupID.slice(1)} descriptionTextStyle={[styles.textNormal]} wrapperStyle={[styles.ph5]} onPress={() => onSelectRow(item)} focused={isFocused}/>
        </BaseListItem_1.default>);
}
SpendCategorySelectorListItem.displayName = 'SpendCategorySelectorListItem';
exports.default = SpendCategorySelectorListItem;
