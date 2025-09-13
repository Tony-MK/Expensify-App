"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Pressable_1 = require("@components/Pressable");
var Text_1 = require("@components/Text");
var useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var AvatarWithDelegateAvatar_1 = require("./AvatarWithDelegateAvatar");
var AvatarWithOptionalStatus_1 = require("./AvatarWithOptionalStatus");
var ProfileAvatarWithIndicator_1 = require("./ProfileAvatarWithIndicator");
function NavigationTabBarAvatar(_a) {
    var _b, _c, _d, _e;
    var onPress = _a.onPress, _f = _a.isSelected, isSelected = _f === void 0 ? false : _f, style = _a.style;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var account = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: false })[0];
    var delegateEmail = (_c = (_b = account === null || account === void 0 ? void 0 : account.delegatedAccess) === null || _b === void 0 ? void 0 : _b.delegate) !== null && _c !== void 0 ? _c : '';
    var currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    var emojiStatus = (_e = (_d = currentUserPersonalDetails === null || currentUserPersonalDetails === void 0 ? void 0 : currentUserPersonalDetails.status) === null || _d === void 0 ? void 0 : _d.emojiCode) !== null && _e !== void 0 ? _e : '';
    /**
     * Renders the appropriate avatar component based on user state (delegate, emoji status, or default profile)
     * with the correct active (ring) state for selection and hover effects.
     */
    var renderAvatar = function (active) {
        if (delegateEmail) {
            return (<AvatarWithDelegateAvatar_1.default delegateEmail={delegateEmail} isSelected={active} containerStyle={styles.sidebarStatusAvatarWithEmojiContainer}/>);
        }
        if (emojiStatus) {
            return (<AvatarWithOptionalStatus_1.default emojiStatus={emojiStatus} isSelected={active} containerStyle={styles.sidebarStatusAvatarWithEmojiContainer}/>);
        }
        return (<ProfileAvatarWithIndicator_1.default isSelected={active} containerStyles={styles.tn0Half}/>);
    };
    return (<Pressable_1.PressableWithFeedback onPress={onPress} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('sidebarScreen.buttonMySettings')} wrapperStyle={styles.flex1} style={function (_a) {
        var hovered = _a.hovered;
        return [style, hovered && styles.navigationTabBarItemHovered];
    }}>
            {function (_a) {
            var hovered = _a.hovered;
            return (<>
                    {renderAvatar(isSelected || hovered)}
                    <Text_1.default style={[styles.textSmall, styles.textAlignCenter, isSelected ? styles.textBold : styles.textSupporting, styles.mt0Half, styles.navigationTabBarLabel]}>
                        {translate('initialSettingsPage.account')}
                    </Text_1.default>
                </>);
        }}
        </Pressable_1.PressableWithFeedback>);
}
NavigationTabBarAvatar.displayName = 'NavigationTabBarAvatar';
exports.default = NavigationTabBarAvatar;
