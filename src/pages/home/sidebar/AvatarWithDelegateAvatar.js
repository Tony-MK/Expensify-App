"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Avatar_1 = require("@components/Avatar");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const UserUtils = require("@libs/UserUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ProfileAvatarWithIndicator_1 = require("./ProfileAvatarWithIndicator");
function AvatarWithDelegateAvatar({ delegateEmail, isSelected = false, containerStyle }) {
    const styles = (0, useThemeStyles_1.default)();
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout to use correct avatar size
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const personalDetails = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST);
    const delegatePersonalDetail = Object.values(personalDetails[0] ?? {}).find((personalDetail) => personalDetail?.login?.toLowerCase() === delegateEmail);
    return (<react_native_1.View style={[styles.sidebarStatusAvatarContainer, containerStyle]}>
            <ProfileAvatarWithIndicator_1.default isSelected={isSelected}/>
            <react_native_1.View style={[styles.sidebarStatusAvatar]}>
                <react_native_1.View style={styles.emojiStatusLHN}>
                    <Avatar_1.default size={isSmallScreenWidth ? CONST_1.default.AVATAR_SIZE.MID_SUBSCRIPT : CONST_1.default.AVATAR_SIZE.SMALL} source={UserUtils.getSmallSizeAvatar(delegatePersonalDetail?.avatar, delegatePersonalDetail?.accountID)} fallbackIcon={delegatePersonalDetail?.fallbackIcon} type={CONST_1.default.ICON_TYPE_AVATAR}/>
                </react_native_1.View>
            </react_native_1.View>
        </react_native_1.View>);
}
AvatarWithDelegateAvatar.displayName = 'AvatarWithDelegateAvatar';
exports.default = AvatarWithDelegateAvatar;
