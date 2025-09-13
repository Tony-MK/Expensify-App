"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_svg_1 = require("react-native-svg");
const SkeletonViewContentLoader_1 = require("@components/SkeletonViewContentLoader");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
function AccountSwitcherSkeletonView({ shouldAnimate = true, avatarSize = CONST_1.default.AVATAR_SIZE.DEFAULT }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const avatarPlaceholderSize = StyleUtils.getAvatarSize(avatarSize);
    const avatarPlaceholderRadius = avatarPlaceholderSize / 2;
    const startPositionX = avatarPlaceholderRadius;
    return (<react_native_1.View style={styles.avatarSectionWrapperSkeleton}>
            <SkeletonViewContentLoader_1.default animate={shouldAnimate} backgroundColor={theme.skeletonLHNIn} foregroundColor={theme.skeletonLHNOut} height={avatarPlaceholderSize}>
                <react_native_svg_1.Circle cx={startPositionX} cy={avatarPlaceholderRadius} r={avatarPlaceholderRadius}/>
                <react_native_svg_1.Rect x={startPositionX + avatarPlaceholderRadius + styles.gap3.gap} y="6" width="45%" height="8"/>
                <react_native_svg_1.Rect x={startPositionX + avatarPlaceholderRadius + styles.gap3.gap} y="26" width="55%" height="8"/>
            </SkeletonViewContentLoader_1.default>
        </react_native_1.View>);
}
AccountSwitcherSkeletonView.displayName = 'AccountSwitcherSkeletonView';
exports.default = AccountSwitcherSkeletonView;
