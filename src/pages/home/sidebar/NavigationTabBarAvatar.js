"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Pressable_1 = require("@components/Pressable");
const Text_1 = require("@components/Text");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const AvatarWithDelegateAvatar_1 = require("./AvatarWithDelegateAvatar");
const AvatarWithOptionalStatus_1 = require("./AvatarWithOptionalStatus");
const ProfileAvatarWithIndicator_1 = require("./ProfileAvatarWithIndicator");
function NavigationTabBarAvatar({ onPress, isSelected = false, style }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: false });
    const delegateEmail = account?.delegatedAccess?.delegate ?? '';
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const emojiStatus = currentUserPersonalDetails?.status?.emojiCode ?? '';
    /**
     * Renders the appropriate avatar component based on user state (delegate, emoji status, or default profile)
     * with the correct active (ring) state for selection and hover effects.
     */
    const renderAvatar = (active) => {
        if (delegateEmail) {
            return (<AvatarWithDelegateAvatar_1.default delegateEmail={delegateEmail} isSelected={active} containerStyle={styles.sidebarStatusAvatarWithEmojiContainer}/>);
        }
        if (emojiStatus) {
            return (<AvatarWithOptionalStatus_1.default emojiStatus={emojiStatus} isSelected={active} containerStyle={styles.sidebarStatusAvatarWithEmojiContainer}/>);
        }
        return (<ProfileAvatarWithIndicator_1.default isSelected={active} containerStyles={styles.tn0Half}/>);
    };
    return (<Pressable_1.PressableWithFeedback onPress={onPress} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('sidebarScreen.buttonMySettings')} wrapperStyle={styles.flex1} style={({ hovered }) => [style, hovered && styles.navigationTabBarItemHovered]}>
            {({ hovered }) => (<>
                    {renderAvatar(isSelected || hovered)}
                    <Text_1.default style={[styles.textSmall, styles.textAlignCenter, isSelected ? styles.textBold : styles.textSupporting, styles.mt0Half, styles.navigationTabBarLabel]}>
                        {translate('initialSettingsPage.account')}
                    </Text_1.default>
                </>)}
        </Pressable_1.PressableWithFeedback>);
}
NavigationTabBarAvatar.displayName = 'NavigationTabBarAvatar';
exports.default = NavigationTabBarAvatar;
