"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_svg_1 = require("react-native-svg");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const CONST_1 = require("@src/CONST");
const SkeletonViewContentLoader_1 = require("./SkeletonViewContentLoader");
function AvatarSkeleton({ size = CONST_1.default.AVATAR_SIZE.SMALL }) {
    const theme = (0, useTheme_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const avatarSize = StyleUtils.getAvatarSize(size);
    const skeletonCircleRadius = avatarSize / 2;
    return (<SkeletonViewContentLoader_1.default animate height={avatarSize} width={avatarSize} backgroundColor={theme.skeletonLHNIn} foregroundColor={theme.skeletonLHNOut}>
            <react_native_svg_1.Circle cx={skeletonCircleRadius} cy={skeletonCircleRadius} r={skeletonCircleRadius}/>
        </SkeletonViewContentLoader_1.default>);
}
AvatarSkeleton.displayName = 'AvatarSkeleton';
exports.default = AvatarSkeleton;
