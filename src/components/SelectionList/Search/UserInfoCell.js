"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Avatar_1 = require("@components/Avatar");
const Text_1 = require("@components/Text");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const SearchUIUtils_1 = require("@libs/SearchUIUtils");
const CONST_1 = require("@src/CONST");
function UserInfoCell({ avatar, accountID, displayName, avatarSize, containerStyle, textStyle, avatarStyle }) {
    const styles = (0, useThemeStyles_1.default)();
    const { isLargeScreenWidth } = (0, useResponsiveLayout_1.default)();
    if (!(0, SearchUIUtils_1.isCorrectSearchUserName)(displayName) || !accountID) {
        return null;
    }
    return (<react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, containerStyle]}>
            <Avatar_1.default imageStyles={[styles.alignSelfCenter]} size={avatarSize ?? CONST_1.default.AVATAR_SIZE.MID_SUBSCRIPT} source={avatar} name={displayName} type={CONST_1.default.ICON_TYPE_AVATAR} avatarID={accountID} containerStyles={[styles.pr2, avatarStyle]}/>
            <Text_1.default numberOfLines={1} style={[isLargeScreenWidth ? styles.themeTextColor : styles.textMicroBold, styles.flexShrink1, textStyle]}>
                {displayName}
            </Text_1.default>
        </react_native_1.View>);
}
UserInfoCell.displayName = 'UserInfoCell';
exports.default = UserInfoCell;
