"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useNetwork_1 = require("@hooks/useNetwork");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ReportUtils_1 = require("@libs/ReportUtils");
const UserUtils_1 = require("@libs/UserUtils");
const CONST_1 = require("@src/CONST");
const Icon_1 = require("./Icon");
const Expensicons = require("./Icon/Expensicons");
const Image_1 = require("./Image");
function Avatar({ source: originalSource, imageStyles, iconAdditionalStyles, containerStyles, size = CONST_1.default.AVATAR_SIZE.DEFAULT, fill, fallbackIcon = Expensicons.FallbackAvatar, fallbackIconTestID = '', type, name = '', avatarID, testID = 'Avatar', }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const [imageError, setImageError] = (0, react_1.useState)(false);
    (0, useNetwork_1.default)({ onReconnect: () => setImageError(false) });
    (0, react_1.useEffect)(() => {
        setImageError(false);
    }, [originalSource]);
    const isWorkspace = type === CONST_1.default.ICON_TYPE_WORKSPACE;
    const userAccountID = isWorkspace ? undefined : avatarID;
    const source = isWorkspace ? originalSource : (0, UserUtils_1.getAvatar)(originalSource, userAccountID);
    const useFallBackAvatar = imageError || !source || source === Expensicons.FallbackAvatar;
    const fallbackAvatar = isWorkspace ? (0, ReportUtils_1.getDefaultWorkspaceAvatar)(name) : fallbackIcon || Expensicons.FallbackAvatar;
    const fallbackAvatarTestID = isWorkspace ? (0, ReportUtils_1.getDefaultWorkspaceAvatarTestID)(name) : fallbackIconTestID || 'SvgFallbackAvatar Icon';
    const avatarSource = useFallBackAvatar ? fallbackAvatar : source;
    // We pass the color styles down to the SVG for the workspace and fallback avatar.
    const iconSize = StyleUtils.getAvatarSize(size);
    const imageStyle = [StyleUtils.getAvatarStyle(size), imageStyles, styles.noBorderRadius];
    const iconStyle = imageStyles ? [StyleUtils.getAvatarStyle(size), styles.bgTransparent, imageStyles] : undefined;
    let iconColors;
    if (isWorkspace) {
        iconColors = StyleUtils.getDefaultWorkspaceAvatarColor(avatarID?.toString() ?? '');
        // Assign the icon fill color only for the default fallback avatar
    }
    else if (useFallBackAvatar && avatarSource === Expensicons.FallbackAvatar) {
        iconColors = StyleUtils.getBackgroundColorAndFill(theme.buttonHoveredBG, theme.icon);
    }
    else {
        iconColors = null;
    }
    return (<react_native_1.View style={[containerStyles, styles.pointerEventsNone]} testID={testID}>
            {typeof avatarSource === 'string' ? (<react_native_1.View style={[iconStyle, StyleUtils.getAvatarBorderStyle(size, type), iconAdditionalStyles]}>
                    <Image_1.default source={{ uri: avatarSource }} style={imageStyle} onError={() => setImageError(true)} cachePolicy="memory-disk"/>
                </react_native_1.View>) : (<react_native_1.View style={iconStyle}>
                    <Icon_1.default testID={fallbackAvatarTestID} src={avatarSource} height={iconSize} width={iconSize} fill={imageError ? (iconColors?.fill ?? theme.offline) : (iconColors?.fill ?? fill)} additionalStyles={[StyleUtils.getAvatarBorderStyle(size, type), iconColors, iconAdditionalStyles]}/>
                </react_native_1.View>)}
        </react_native_1.View>);
}
Avatar.displayName = 'Avatar';
exports.default = Avatar;
