"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const PressableWithFeedback_1 = require("@components/Pressable/PressableWithFeedback");
const ReportActionAvatars_1 = require("@components/ReportActionAvatars");
const TextWithTooltip_1 = require("@components/TextWithTooltip");
const useAnimatedHighlightStyle_1 = require("@hooks/useAnimatedHighlightStyle");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const BaseListItem_1 = require("./BaseListItem");
function TableListItem({ item, isFocused, showTooltip, isDisabled, canSelectMultiple, onSelectRow, onCheckboxPress, onDismissError, rightHandSideComponent, onFocus, onLongPressRow, shouldSyncFocus, titleContainerStyles, shouldUseDefaultRightHandSideCheckmark, }) {
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const animatedHighlightStyle = (0, useAnimatedHighlightStyle_1.default)({
        borderRadius: styles.selectionListPressableItemWrapper.borderRadius,
        shouldHighlight: !!item.shouldAnimateInHighlight,
        highlightColor: theme.messageHighlightBG,
        backgroundColor: theme.highlightBG,
    });
    const focusedBackgroundColor = styles.sidebarLinkActive.backgroundColor;
    const hoveredBackgroundColor = styles.sidebarLinkHover?.backgroundColor ? styles.sidebarLinkHover.backgroundColor : theme.sidebar;
    const handleCheckboxPress = (0, react_1.useCallback)(() => {
        if (onCheckboxPress) {
            onCheckboxPress(item);
        }
        else {
            onSelectRow(item);
        }
    }, [item, onCheckboxPress, onSelectRow]);
    return (<BaseListItem_1.default item={item} pressableStyle={[
            [
                styles.selectionListPressableItemWrapper,
                styles.mh0,
                // Removing background style because they are added to the parent OpacityView via animatedHighlightStyle
                item.shouldAnimateInHighlight ? styles.bgTransparent : undefined,
                item.isSelected && styles.activeComponentBG,
                item.cursorStyle,
            ],
        ]} pressableWrapperStyle={[styles.mh5, animatedHighlightStyle]} wrapperStyle={[styles.flexRow, styles.flex1, styles.justifyContentBetween, styles.userSelectNone, styles.alignItemsCenter]} containerStyle={styles.mb2} isFocused={isFocused} isDisabled={isDisabled} showTooltip={showTooltip} canSelectMultiple={canSelectMultiple} onLongPressRow={onLongPressRow} onSelectRow={onSelectRow} onDismissError={onDismissError} rightHandSideComponent={rightHandSideComponent} errors={item.errors} pendingAction={item.pendingAction} keyForList={item.keyForList} onFocus={onFocus} shouldSyncFocus={shouldSyncFocus} hoverStyle={item.isSelected && styles.activeComponentBG} shouldUseDefaultRightHandSideCheckmark={shouldUseDefaultRightHandSideCheckmark}>
            {(hovered) => (<>
                    {!!canSelectMultiple && (<PressableWithFeedback_1.default accessibilityLabel={item.text ?? ''} role={CONST_1.default.ROLE.BUTTON} 
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            disabled={isDisabled || item.isDisabledCheckbox} onPress={handleCheckboxPress} testID={`TableListItemCheckbox-${item.text}`} style={[styles.cursorUnset, StyleUtils.getCheckboxPressableStyle(), item.isDisabledCheckbox && styles.cursorDisabled, styles.mr3, item.cursorStyle]}>
                            <react_native_1.View style={[StyleUtils.getCheckboxContainerStyle(20), StyleUtils.getMultiselectListStyles(!!item.isSelected, !!item.isDisabled), item.cursorStyle]}>
                                {!!item.isSelected && (<Icon_1.default src={Expensicons.Checkmark} fill={theme.textLight} height={14} width={14}/>)}
                            </react_native_1.View>
                        </PressableWithFeedback_1.default>)}
                    {!!item.accountID && (<ReportActionAvatars_1.default accountIDs={[item.accountID]} fallbackDisplayName={item.text ?? item.alternateText ?? undefined} shouldShowTooltip={showTooltip} secondaryAvatarContainerStyle={[
                    StyleUtils.getBackgroundAndBorderStyle(theme.sidebar),
                    isFocused ? StyleUtils.getBackgroundAndBorderStyle(focusedBackgroundColor) : undefined,
                    hovered && !isFocused ? StyleUtils.getBackgroundAndBorderStyle(hoveredBackgroundColor) : undefined,
                ]}/>)}
                    <react_native_1.View style={[styles.flex1, styles.flexColumn, styles.justifyContentCenter, styles.alignItemsStretch, titleContainerStyles]}>
                        <TextWithTooltip_1.default shouldShowTooltip={showTooltip} text={item.text ?? ''} style={[
                styles.optionDisplayName,
                isFocused ? styles.sidebarLinkActiveText : styles.sidebarLinkText,
                styles.sidebarLinkTextBold,
                styles.pre,
                item.alternateText ? styles.mb1 : null,
                styles.justifyContentCenter,
            ]}/>
                        {!!item.alternateText && (<TextWithTooltip_1.default shouldShowTooltip={showTooltip} text={item.alternateText} style={[styles.textLabelSupporting, styles.lh16, styles.pre]}/>)}
                    </react_native_1.View>
                    {!!item.rightElement && item.rightElement}
                </>)}
        </BaseListItem_1.default>);
}
TableListItem.displayName = 'TableListItem';
exports.default = TableListItem;
