"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const TextWithTooltip_1 = require("@components/TextWithTooltip");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const BaseListItem_1 = require("./BaseListItem");
function RadioListItem({ item, isFocused, showTooltip, isDisabled, onSelectRow, onDismissError, shouldPreventEnterKeySubmit, rightHandSideComponent, isMultilineSupported = false, isAlternateTextMultilineSupported = false, alternateTextNumberOfLines = 2, onFocus, shouldSyncFocus, wrapperStyle, titleStyles, }) {
    const styles = (0, useThemeStyles_1.default)();
    const fullTitle = isMultilineSupported ? item.text?.trimStart() : item.text;
    const indentsLength = (item.text?.length ?? 0) - (fullTitle?.length ?? 0);
    const paddingLeft = Math.floor(indentsLength / CONST_1.default.INDENTS.length) * styles.ml3.marginLeft;
    const alternateTextMaxWidth = variables_1.default.sideBarWidth - styles.ph5.paddingHorizontal * 2 - styles.ml3.marginLeft - variables_1.default.iconSizeNormal;
    return (<BaseListItem_1.default item={item} wrapperStyle={[styles.flex1, styles.justifyContentBetween, styles.sidebarLinkInner, styles.userSelectNone, styles.optionRow, wrapperStyle]} isFocused={isFocused} isDisabled={isDisabled} showTooltip={showTooltip} onSelectRow={onSelectRow} onDismissError={onDismissError} shouldPreventEnterKeySubmit={shouldPreventEnterKeySubmit} rightHandSideComponent={rightHandSideComponent} keyForList={item.keyForList} onFocus={onFocus} shouldSyncFocus={shouldSyncFocus} pendingAction={item.pendingAction}>
            <>
                {!!item.leftElement && item.leftElement}
                <react_native_1.View style={[styles.flex1, styles.alignItemsStart]}>
                    <TextWithTooltip_1.default shouldShowTooltip={showTooltip} text={fullTitle ?? ''} style={[
            styles.optionDisplayName,
            isFocused ? styles.sidebarLinkActiveText : styles.sidebarLinkText,
            styles.sidebarLinkTextBold,
            isMultilineSupported ? styles.preWrap : styles.pre,
            item.alternateText ? styles.mb1 : null,
            isDisabled && styles.colorMuted,
            isMultilineSupported ? { paddingLeft } : null,
            titleStyles,
        ]} numberOfLines={isMultilineSupported ? 2 : 1}/>

                    {!!item.alternateText && (<TextWithTooltip_1.default shouldShowTooltip={showTooltip} text={item.alternateText} style={[
                styles.textLabelSupporting,
                styles.lh16,
                isAlternateTextMultilineSupported ? styles.preWrap : styles.pre,
                isAlternateTextMultilineSupported ? { maxWidth: alternateTextMaxWidth } : null,
            ]} numberOfLines={isAlternateTextMultilineSupported ? alternateTextNumberOfLines : 1}/>)}
                </react_native_1.View>
                {!!item.rightElement && item.rightElement}
            </>
        </BaseListItem_1.default>);
}
RadioListItem.displayName = 'RadioListItem';
exports.default = RadioListItem;
