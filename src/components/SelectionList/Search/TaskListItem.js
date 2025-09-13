"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const BaseListItem_1 = require("@components/SelectionList/BaseListItem");
const useAnimatedHighlightStyle_1 = require("@hooks/useAnimatedHighlightStyle");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Fullstory_1 = require("@libs/Fullstory");
const variables_1 = require("@styles/variables");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const TaskListItemRow_1 = require("./TaskListItemRow");
function TaskListItem({ item, isFocused, showTooltip, isDisabled, canSelectMultiple, onSelectRow, onFocus, onLongPressRow, shouldSyncFocus, allReports, personalDetails, }) {
    const taskItem = item;
    const parentReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${taskItem?.parentReportID}`];
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { isLargeScreenWidth } = (0, useResponsiveLayout_1.default)();
    const listItemPressableStyle = [
        styles.selectionListPressableItemWrapper,
        styles.pv3,
        styles.ph3,
        // Removing background style because they are added to the parent OpacityView via animatedHighlightStyle
        styles.bgTransparent,
        item.isSelected && styles.activeComponentBG,
        styles.mh0,
    ];
    const listItemWrapperStyle = [
        styles.flex1,
        styles.userSelectNone,
        isLargeScreenWidth ? { ...styles.flexRow, ...styles.justifyContentBetween, ...styles.alignItemsCenter } : { ...styles.flexColumn, ...styles.alignItemsStretch },
    ];
    const animatedHighlightStyle = (0, useAnimatedHighlightStyle_1.default)({
        borderRadius: variables_1.default.componentBorderRadius,
        shouldHighlight: item?.shouldAnimateInHighlight ?? false,
        highlightColor: theme.messageHighlightBG,
        backgroundColor: theme.highlightBG,
    });
    const fsClass = Fullstory_1.default.getChatFSClass(personalDetails, parentReport);
    return (<BaseListItem_1.default item={item} pressableStyle={listItemPressableStyle} wrapperStyle={listItemWrapperStyle} containerStyle={[styles.mb2]} isFocused={isFocused} isDisabled={isDisabled} showTooltip={showTooltip} canSelectMultiple={canSelectMultiple} onSelectRow={onSelectRow} pendingAction={item.pendingAction} keyForList={item.keyForList} onFocus={onFocus} onLongPressRow={onLongPressRow} shouldSyncFocus={shouldSyncFocus} hoverStyle={item.isSelected && styles.activeComponentBG} pressableWrapperStyle={[styles.mh5, animatedHighlightStyle]} forwardedFSClass={fsClass}>
            <TaskListItemRow_1.default item={taskItem} showTooltip={showTooltip}/>
        </BaseListItem_1.default>);
}
TaskListItem.displayName = 'TaskListItem';
exports.default = TaskListItem;
