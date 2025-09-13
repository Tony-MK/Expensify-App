"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Avatar_1 = require("@components/Avatar");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const PressableWithFeedback_1 = require("@components/Pressable/PressableWithFeedback");
const BaseListItem_1 = require("@components/SelectionList/BaseListItem");
const TextWithTooltip_1 = require("@components/TextWithTooltip");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const LoginUtils_1 = require("@libs/LoginUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
function UserSelectionListItem({ item, isFocused, showTooltip, isDisabled, canSelectMultiple, onSelectRow, onCheckboxPress, onDismissError, shouldPreventEnterKeySubmit, rightHandSideComponent, onFocus, shouldSyncFocus, wrapperStyle, pressableStyle, }) {
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const handleCheckboxPress = (0, react_1.useCallback)(() => {
        if (onCheckboxPress) {
            onCheckboxPress(item);
        }
        else {
            onSelectRow(item);
        }
    }, [item, onCheckboxPress, onSelectRow]);
    const userHandle = (0, react_1.useMemo)(() => {
        const login = item.login ?? '';
        // If the emails are not in the same private domain, we just return the users email
        if (!(0, LoginUtils_1.areEmailsFromSamePrivateDomain)(login, currentUserPersonalDetails.login ?? '')) {
            return expensify_common_1.Str.removeSMSDomain(login);
        }
        // Otherwise, the emails are a part of the same private domain, so we can remove the domain and just show username
        return login.split('@').at(0);
    }, [currentUserPersonalDetails.login, item.login]);
    const userDisplayName = (0, react_1.useMemo)(() => {
        return (0, ReportUtils_1.getDisplayNameForParticipant)({
            accountID: item.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID,
        });
    }, [item.accountID]);
    return (<BaseListItem_1.default item={item} wrapperStyle={[styles.flex1, styles.sidebarLinkInner, styles.userSelectNone, wrapperStyle]} isFocused={isFocused} isDisabled={isDisabled} showTooltip={showTooltip} canSelectMultiple={canSelectMultiple} onSelectRow={onSelectRow} onDismissError={onDismissError} shouldPreventEnterKeySubmit={shouldPreventEnterKeySubmit} rightHandSideComponent={rightHandSideComponent} errors={item.errors} pendingAction={item.pendingAction} pressableStyle={pressableStyle} keyForList={item.keyForList} onFocus={onFocus} shouldSyncFocus={shouldSyncFocus}>
            <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.h13, styles.gap3, styles.w100]}>
                {!!item.icons?.length && (<react_native_1.View style={styles.mentionSuggestionsAvatarContainer}>
                        <Avatar_1.default source={item.icons.at(0)?.source} size={CONST_1.default.AVATAR_SIZE.SMALL} name={item.icons.at(0)?.name} avatarID={item.icons.at(0)?.id} type={item.icons.at(0)?.type ?? CONST_1.default.ICON_TYPE_AVATAR} fallbackIcon={item.icons.at(0)?.fallbackIcon}/>
                    </react_native_1.View>)}

                <react_native_1.View style={[styles.flex1, styles.flexRow, styles.gap2, styles.flexShrink1, styles.alignItemsCenter]}>
                    <TextWithTooltip_1.default shouldShowTooltip={showTooltip} text={userDisplayName} style={[styles.flexShrink0, styles.optionDisplayName, isFocused ? styles.sidebarLinkActiveText : styles.sidebarLinkText, styles.sidebarLinkTextBold, styles.pre]}/>
                    {!!userHandle && (<TextWithTooltip_1.default text={`@${userHandle}`} shouldShowTooltip={showTooltip} style={[styles.textLabelSupporting, styles.lh16, styles.pre, styles.flexShrink1]}/>)}
                </react_native_1.View>

                <PressableWithFeedback_1.default accessibilityLabel={item.text ?? ''} role={CONST_1.default.ROLE.BUTTON} 
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    disabled={isDisabled || item.isDisabledCheckbox} onPress={handleCheckboxPress} style={[styles.cursorUnset, StyleUtils.getCheckboxPressableStyle(), item.isDisabledCheckbox && styles.cursorDisabled, styles.mr3]}>
                    <react_native_1.View style={[StyleUtils.getCheckboxContainerStyle(20), StyleUtils.getMultiselectListStyles(!!item.isSelected, !!item.isDisabled)]}>
                        {!!item.isSelected && (<Icon_1.default src={Expensicons.Checkmark} fill={theme.textLight} height={14} width={14}/>)}
                    </react_native_1.View>
                </PressableWithFeedback_1.default>

                {!!item.rightElement && item.rightElement}
            </react_native_1.View>
        </BaseListItem_1.default>);
}
UserSelectionListItem.displayName = 'UserSelectionListItem';
exports.default = UserSelectionListItem;
