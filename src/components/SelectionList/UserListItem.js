"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const PressableWithFeedback_1 = require("@components/Pressable/PressableWithFeedback");
const ReportActionAvatars_1 = require("@components/ReportActionAvatars");
const Text_1 = require("@components/Text");
const TextWithTooltip_1 = require("@components/TextWithTooltip");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const getButtonState_1 = require("@libs/getButtonState");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const BaseListItem_1 = require("./BaseListItem");
function UserListItem({ item, isFocused, showTooltip, isDisabled, canSelectMultiple, onSelectRow, onCheckboxPress, onDismissError, shouldPreventEnterKeySubmit, rightHandSideComponent, onFocus, shouldSyncFocus, wrapperStyle, pressableStyle, shouldUseDefaultRightHandSideCheckmark, forwardedFSClass, }) {
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const focusedBackgroundColor = styles.sidebarLinkActive.backgroundColor;
    const subscriptAvatarBorderColor = isFocused ? focusedBackgroundColor : theme.sidebar;
    const hoveredBackgroundColor = !!styles.sidebarLinkHover && 'backgroundColor' in styles.sidebarLinkHover ? styles.sidebarLinkHover.backgroundColor : theme.sidebar;
    const handleCheckboxPress = (0, react_1.useCallback)(() => {
        if (onCheckboxPress) {
            onCheckboxPress(item);
        }
        else {
            onSelectRow(item);
        }
    }, [item, onCheckboxPress, onSelectRow]);
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const [isReportInOnyx] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${item.reportID}`, {
        canBeMissing: true,
        selector: (report) => !!report,
    });
    const reportExists = isReportInOnyx && !!item.reportID;
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const itemAccountID = Number(item.accountID || item.icons?.at(1)?.id) || 0;
    const isThereOnlyWorkspaceIcon = item.icons?.length === 1 && item.icons?.at(0)?.type === CONST_1.default.ICON_TYPE_WORKSPACE;
    const shouldUseIconPolicyID = !item.reportID && !item.accountID && !item.policyID;
    const policyID = isThereOnlyWorkspaceIcon && shouldUseIconPolicyID ? String(item.icons?.at(0)?.id) : item.policyID;
    return (<BaseListItem_1.default item={item} wrapperStyle={[styles.flex1, styles.justifyContentBetween, styles.sidebarLinkInner, styles.userSelectNone, styles.peopleRow, wrapperStyle]} isFocused={isFocused} isDisabled={isDisabled} showTooltip={showTooltip} canSelectMultiple={canSelectMultiple} onSelectRow={onSelectRow} onDismissError={onDismissError} shouldPreventEnterKeySubmit={shouldPreventEnterKeySubmit} rightHandSideComponent={rightHandSideComponent} errors={item.errors} pendingAction={item.pendingAction} pressableStyle={pressableStyle} FooterComponent={item.invitedSecondaryLogin ? (<Text_1.default style={[styles.ml9, styles.ph5, styles.pb3, styles.textLabelSupporting]}>
                        {translate('workspace.people.invitedBySecondaryLogin', { secondaryLogin: item.invitedSecondaryLogin })}
                    </Text_1.default>) : undefined} keyForList={item.keyForList} onFocus={onFocus} shouldSyncFocus={shouldSyncFocus}>
            {(hovered) => (<>
                    {!shouldUseDefaultRightHandSideCheckmark && !!canSelectMultiple && (<PressableWithFeedback_1.default accessibilityLabel={item.text ?? ''} role={CONST_1.default.ROLE.BUTTON} 
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            disabled={isDisabled || item.isDisabledCheckbox} onPress={handleCheckboxPress} style={[styles.cursorUnset, StyleUtils.getCheckboxPressableStyle(), item.isDisabledCheckbox && styles.cursorDisabled, styles.mr3]}>
                            <react_native_1.View style={[StyleUtils.getCheckboxContainerStyle(20), StyleUtils.getMultiselectListStyles(!!item.isSelected, !!item.isDisabled)]}>
                                {!!item.isSelected && (<Icon_1.default src={Expensicons.Checkmark} fill={theme.textLight} height={14} width={14}/>)}
                            </react_native_1.View>
                        </PressableWithFeedback_1.default>)}
                    {(!!reportExists || !!itemAccountID || !!policyID) && (<ReportActionAvatars_1.default subscriptAvatarBorderColor={hovered && !isFocused ? hoveredBackgroundColor : subscriptAvatarBorderColor} shouldShowTooltip={showTooltip} secondaryAvatarContainerStyle={[
                    StyleUtils.getBackgroundAndBorderStyle(theme.sidebar),
                    isFocused ? StyleUtils.getBackgroundAndBorderStyle(focusedBackgroundColor) : undefined,
                    hovered && !isFocused ? StyleUtils.getBackgroundAndBorderStyle(hoveredBackgroundColor) : undefined,
                ]} reportID={reportExists ? item.reportID : undefined} 
            /* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */
            accountIDs={!reportExists && !!itemAccountID ? [itemAccountID] : []} policyID={!reportExists && !!policyID ? policyID : undefined} singleAvatarContainerStyle={[styles.actionAvatar, styles.mr3]} fallbackDisplayName={item.text ?? item.alternateText ?? undefined}/>)}
                    <react_native_1.View style={[styles.flex1, styles.flexColumn, styles.justifyContentCenter, styles.alignItemsStretch, styles.optionRow]}>
                        <TextWithTooltip_1.default shouldShowTooltip={showTooltip} text={expensify_common_1.Str.removeSMSDomain(item.text ?? '')} style={[
                styles.optionDisplayName,
                isFocused ? styles.sidebarLinkActiveText : styles.sidebarLinkText,
                item.isBold !== false && styles.sidebarLinkTextBold,
                styles.pre,
                item.alternateText ? styles.mb1 : null,
            ]}/>
                        {!!item.alternateText && (<TextWithTooltip_1.default shouldShowTooltip={showTooltip} text={expensify_common_1.Str.removeSMSDomain(item.alternateText ?? '')} style={[styles.textLabelSupporting, styles.lh16, styles.pre]} forwardedFSClass={forwardedFSClass}/>)}
                    </react_native_1.View>
                    {!!item.rightElement && item.rightElement}
                    {!!item.shouldShowRightIcon && (<react_native_1.View style={[styles.popoverMenuIcon, styles.pointerEventsAuto, isDisabled && styles.cursorDisabled]}>
                            <Icon_1.default src={Expensicons.ArrowRight} fill={StyleUtils.getIconFillColor((0, getButtonState_1.default)(hovered, false, false, !!isDisabled, item.isInteractive !== false))}/>
                        </react_native_1.View>)}
                    {!!shouldUseDefaultRightHandSideCheckmark && !!canSelectMultiple && (<PressableWithFeedback_1.default accessibilityLabel={item.text ?? ''} role={CONST_1.default.ROLE.BUTTON} 
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            disabled={isDisabled || item.isDisabledCheckbox} onPress={handleCheckboxPress} style={[styles.cursorUnset, StyleUtils.getCheckboxPressableStyle(), item.isDisabledCheckbox && styles.cursorDisabled, styles.ml3]}>
                            <react_native_1.View style={[StyleUtils.getCheckboxContainerStyle(20), StyleUtils.getMultiselectListStyles(!!item.isSelected, !!item.isDisabled)]}>
                                {!!item.isSelected && (<Icon_1.default src={Expensicons.Checkmark} fill={theme.textLight} height={14} width={14}/>)}
                            </react_native_1.View>
                        </PressableWithFeedback_1.default>)}
                </>)}
        </BaseListItem_1.default>);
}
UserListItem.displayName = 'UserListItem';
exports.default = UserListItem;
