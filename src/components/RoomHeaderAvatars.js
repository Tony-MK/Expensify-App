"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const Avatar_1 = require("./Avatar");
const Expensicons = require("./Icon/Expensicons");
const PressableWithoutFocus_1 = require("./Pressable/PressableWithoutFocus");
const Text_1 = require("./Text");
function RoomHeaderAvatars({ icons, reportID }) {
    const navigateToAvatarPage = (icon) => {
        if (icon.type === CONST_1.default.ICON_TYPE_WORKSPACE && icon.id) {
            Navigation_1.default.navigate(ROUTES_1.default.REPORT_AVATAR.getRoute(reportID, icon.id.toString()));
            return;
        }
        if (icon.id) {
            Navigation_1.default.navigate(ROUTES_1.default.PROFILE_AVATAR.getRoute(Number(icon.id), Navigation_1.default.getActiveRoute()));
        }
    };
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    if (!icons.length) {
        return null;
    }
    if (icons.length === 1) {
        const icon = icons.at(0);
        if (!icon) {
            return;
        }
        return (<PressableWithoutFocus_1.default style={styles.noOutline} onPress={() => navigateToAvatarPage(icon)} accessibilityRole={CONST_1.default.ROLE.BUTTON} accessibilityLabel={icon.name ?? ''} disabled={icon.source === Expensicons.FallbackAvatar}>
                <Avatar_1.default source={icon.source} imageStyles={styles.avatarXLarge} size={CONST_1.default.AVATAR_SIZE.X_LARGE} name={icon.name} avatarID={icon.id} type={icon.type} fallbackIcon={icon.fallbackIcon}/>
            </PressableWithoutFocus_1.default>);
    }
    const iconsToDisplay = icons.slice(0, CONST_1.default.REPORT.MAX_PREVIEW_AVATARS);
    const iconStyle = [
        styles.roomHeaderAvatar,
        // Due to border-box box-sizing, the Avatars have to be larger when bordered to visually match size with non-bordered Avatars
        StyleUtils.getAvatarStyle(CONST_1.default.AVATAR_SIZE.LARGE_BORDERED),
    ];
    return (<react_native_1.View style={styles.pointerEventsBoxNone}>
            <react_native_1.View style={[styles.flexRow, styles.wAuto, styles.ml3]}>
                {iconsToDisplay.map((icon, index) => (<react_native_1.View 
        // eslint-disable-next-line react/no-array-index-key
        key={`${icon.id}${index}`} style={[styles.justifyContentCenter, styles.alignItemsCenter]}>
                        <PressableWithoutFocus_1.default style={[styles.mln4, StyleUtils.getAvatarBorderRadius(CONST_1.default.AVATAR_SIZE.LARGE_BORDERED, icon.type)]} onPress={() => navigateToAvatarPage(icon)} accessibilityRole={CONST_1.default.ROLE.BUTTON} accessibilityLabel={icon.name ?? ''} disabled={icon.source === Expensicons.FallbackAvatar}>
                            <Avatar_1.default source={icon.source} size={CONST_1.default.AVATAR_SIZE.LARGE} containerStyles={[...iconStyle, StyleUtils.getAvatarBorderRadius(CONST_1.default.AVATAR_SIZE.LARGE_BORDERED, icon.type)]} name={icon.name} avatarID={icon.id} type={icon.type} fallbackIcon={icon.fallbackIcon}/>
                        </PressableWithoutFocus_1.default>
                        {index === CONST_1.default.REPORT.MAX_PREVIEW_AVATARS - 1 && icons.length - CONST_1.default.REPORT.MAX_PREVIEW_AVATARS !== 0 && (<>
                                <react_native_1.View style={[
                    styles.roomHeaderAvatarSize,
                    styles.roomHeaderAvatar,
                    styles.mln4,
                    ...iconStyle,
                    StyleUtils.getAvatarBorderRadius(CONST_1.default.AVATAR_SIZE.LARGE_BORDERED, icon.type),
                    styles.roomHeaderAvatarOverlay,
                ]}/>
                                <Text_1.default style={styles.avatarInnerTextChat}>{`+${icons.length - CONST_1.default.REPORT.MAX_PREVIEW_AVATARS}`}</Text_1.default>
                            </>)}
                    </react_native_1.View>))}
            </react_native_1.View>
        </react_native_1.View>);
}
RoomHeaderAvatars.displayName = 'RoomHeaderAvatars';
exports.default = (0, react_1.memo)(RoomHeaderAvatars);
