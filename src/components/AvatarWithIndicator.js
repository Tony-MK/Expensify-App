"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const UserUtils = require("@libs/UserUtils");
const CONST_1 = require("@src/CONST");
const Avatar_1 = require("./Avatar");
const AvatarSkeleton_1 = require("./AvatarSkeleton");
const Expensicons = require("./Icon/Expensicons");
const Indicator_1 = require("./Indicator");
const Tooltip_1 = require("./Tooltip");
function AvatarWithIndicator({ source, accountID, tooltipText = '', fallbackIcon = Expensicons.FallbackAvatar, isLoading = true }) {
    const styles = (0, useThemeStyles_1.default)();
    return (<Tooltip_1.default text={tooltipText}>
            <react_native_1.View style={[styles.sidebarAvatar]}>
                {isLoading ? (<AvatarSkeleton_1.default />) : (<>
                        <Avatar_1.default size={CONST_1.default.AVATAR_SIZE.SMALL} source={UserUtils.getSmallSizeAvatar(source, accountID)} fallbackIcon={fallbackIcon} avatarID={accountID} type={CONST_1.default.ICON_TYPE_AVATAR}/>
                        <Indicator_1.default />
                    </>)}
            </react_native_1.View>
        </Tooltip_1.default>);
}
AvatarWithIndicator.displayName = 'AvatarWithIndicator';
exports.default = AvatarWithIndicator;
